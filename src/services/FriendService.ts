// ============================================================================
// 친구 연결 서비스
// 초대 코드 생성, 결과 비교, 매칭 점수 계산
// ============================================================================

import { getDeviceId } from '@/utils/device';
import { STORAGE_KEYS as GLOBAL_STORAGE_KEYS } from '@/lib/storage';
import { storage } from '@/utils';

// ============================================================================
// 타입 정의
// ============================================================================

export interface InviteCode {
  code: string;
  createdBy: string;  // deviceId
  createdAt: string;
  testType: string;
  expiresAt: string;
}

export interface FriendConnection {
  friendId: string;
  nickname?: string;
  connectedAt: string;
  sharedTests: string[];  // 함께 본 테스트 종류
}

export interface TestComparison {
  testType: string;
  myResult: string;
  friendResult: string;
  matchScore: number;  // 0-100
  dimensionMatches: Array<{ dimension: string; similarity: number }>;  // 차원별 유사도
  insights: string[];
}

// ============================================================================
// 상수
// ============================================================================

// 로컬 키 매핑 (기존 코드 호환)
const STORAGE_KEYS = {
  INVITE_CODES: GLOBAL_STORAGE_KEYS.INVITE_CODES,
  FRIENDS: GLOBAL_STORAGE_KEYS.FRIENDS,
  PENDING_INVITES: GLOBAL_STORAGE_KEYS.PENDING_INVITES,
};

const INVITE_CODE_EXPIRY = 7 * 24 * 60 * 60 * 1000; // 7일
const CODE_LENGTH = 6;

// ============================================================================
// 헬퍼 함수
// ============================================================================

function generateInviteCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // 혼동 문자 제외 (O, 0, I, 1)
  let code = '';
  for (let i = 0; i < CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// ============================================================================
// 친구 서비스 클래스
// ============================================================================

class FriendService {
  // ============================================================================
  // 초대 코드 관리
  // ============================================================================

  /**
   * 초대 코드 생성
   */
  createInviteCode(testType: string): InviteCode {
    const code = generateInviteCode();
    const now = new Date();
    const deviceId = getDeviceId();

    const inviteCode: InviteCode = {
      code,
      createdBy: deviceId,
      createdAt: now.toISOString(),
      testType,
      expiresAt: new Date(now.getTime() + INVITE_CODE_EXPIRY).toISOString(),
    };

    // 저장
    const existing = this.getInviteCodes();
    existing.push(inviteCode);
    this.saveInviteCodes(existing);

    return inviteCode;
  }

  /**
   * 초대 코드 검증
   */
  validateInviteCode(code: string): InviteCode | null {
    const codes = this.getInviteCodes();
    const found = codes.find(c => c.code.toUpperCase() === code.toUpperCase());

    if (!found) return null;

    // 만료 확인
    if (new Date(found.expiresAt) < new Date()) {
      return null;
    }

    // 자기 코드인지 확인
    if (found.createdBy === getDeviceId()) {
      return null;
    }

    return found;
  }

  /**
   * 초대 수락 (친구 연결)
   */
  acceptInvite(code: string): FriendConnection | null {
    const inviteCode = this.validateInviteCode(code);
    if (!inviteCode) return null;

    const connection: FriendConnection = {
      friendId: inviteCode.createdBy,
      connectedAt: new Date().toISOString(),
      sharedTests: [inviteCode.testType],
    };

    // 친구 목록에 추가
    const friends = this.getFriends();
    const existingFriend = friends.find(f => f.friendId === connection.friendId);

    if (existingFriend) {
      // 기존 친구면 공유 테스트 추가
      if (!existingFriend.sharedTests.includes(inviteCode.testType)) {
        existingFriend.sharedTests.push(inviteCode.testType);
      }
    } else {
      friends.push(connection);
    }

    this.saveFriends(friends);

    return connection;
  }

  // ============================================================================
  // 친구 관리
  // ============================================================================

  /**
   * 친구 목록 조회
   */
  getFriends(): FriendConnection[] {
    if (typeof window === 'undefined') return [];

    return storage.get<FriendConnection[]>(STORAGE_KEYS.FRIENDS, []);
  }

  /**
   * 친구 수
   */
  getFriendCount(): number {
    return this.getFriends().length;
  }

  /**
   * 친구 닉네임 설정
   */
  setFriendNickname(friendId: string, nickname: string): boolean {
    const friends = this.getFriends();
    const friend = friends.find(f => f.friendId === friendId);

    if (!friend) return false;

    friend.nickname = nickname;
    this.saveFriends(friends);
    return true;
  }

  // ============================================================================
  // 결과 비교
  // ============================================================================

  /**
   * 테스트 결과 비교 (결과 이름만 비교)
   */
  compareResults(
    testType: string,
    myResult: string,
    friendResult: string
  ): TestComparison {
    // 같은 결과면 100점, 다르면 50점 (차원 비교 없이)
    const matchScore = myResult === friendResult ? 100 : 50;
    const insights = this.generateInsights(testType, myResult, friendResult, matchScore);

    return {
      testType,
      myResult,
      friendResult,
      matchScore,
      dimensionMatches: [],
      insights,
    };
  }

  /**
   * 테스트 결과 비교 (차원별 점수 포함)
   * @param myScores 내 차원별 점수 { dimension: score }
   * @param friendScores 친구 차원별 점수
   */
  compareResultsWithScores(
    testType: string,
    myResult: string,
    friendResult: string,
    myScores: Record<string, number>,
    friendScores: Record<string, number>
  ): TestComparison {
    // 차원별 유사도 계산
    const dimensionMatches: Array<{ dimension: string; similarity: number }> = [];
    const allDimensions = new Set([...Object.keys(myScores), ...Object.keys(friendScores)]);

    let totalSimilarity = 0;
    let dimensionCount = 0;

    for (const dim of allDimensions) {
      const myScore = myScores[dim] ?? 0;
      const friendScore = friendScores[dim] ?? 0;

      // 점수 차이를 유사도로 변환 (0-100)
      // 최대 점수 차이가 100이라고 가정
      const maxPossibleDiff = 100;
      const diff = Math.abs(myScore - friendScore);
      const similarity = Math.round(100 - (diff / maxPossibleDiff) * 100);

      dimensionMatches.push({ dimension: dim, similarity });
      totalSimilarity += similarity;
      dimensionCount++;
    }

    // 전체 매칭 점수 (차원별 유사도 평균)
    const matchScore = dimensionCount > 0
      ? Math.round(totalSimilarity / dimensionCount)
      : (myResult === friendResult ? 100 : 50);

    // 유사도 높은 순 정렬
    dimensionMatches.sort((a, b) => b.similarity - a.similarity);

    const insights = this.generateInsightsWithDimensions(
      testType,
      myResult,
      friendResult,
      matchScore,
      dimensionMatches
    );

    return {
      testType,
      myResult,
      friendResult,
      matchScore,
      dimensionMatches,
      insights,
    };
  }

  /**
   * 비교 인사이트 생성 (기본)
   */
  private generateInsights(
    _testType: string,
    myResult: string,
    friendResult: string,
    matchScore: number
  ): string[] {
    const insights: string[] = [];

    if (matchScore >= 80) {
      insights.push('🎯 정말 잘 맞는 조합이에요!');
      insights.push('💕 서로를 잘 이해할 수 있어요');
    } else if (matchScore >= 50) {
      insights.push('🤝 비슷한 점도 다른 점도 있어요');
      insights.push('💡 서로에게 배울 점이 많아요');
    } else {
      insights.push('🌈 완전히 다른 스타일이에요');
      insights.push('✨ 다양한 관점을 공유할 수 있어요');
    }

    if (myResult === friendResult) {
      insights.push(`🎊 같은 "${myResult}" 유형이에요!`);
    }

    return insights;
  }

  /**
   * 비교 인사이트 생성 (차원별 분석 포함)
   */
  private generateInsightsWithDimensions(
    _testType: string,
    myResult: string,
    friendResult: string,
    matchScore: number,
    dimensionMatches: Array<{ dimension: string; similarity: number }>
  ): string[] {
    const insights: string[] = [];

    // 기본 매칭 메시지
    if (matchScore >= 80) {
      insights.push('🎯 정말 잘 맞는 조합이에요!');
    } else if (matchScore >= 60) {
      insights.push('🤝 꽤 비슷한 성향이에요');
    } else if (matchScore >= 40) {
      insights.push('💫 다양한 점이 조화를 이뤄요');
    } else {
      insights.push('🌈 서로 다른 매력이 있어요');
    }

    // 가장 비슷한 차원
    if (dimensionMatches.length > 0) {
      const mostSimilar = dimensionMatches[0];
      if (mostSimilar.similarity >= 80) {
        insights.push(`💕 "${mostSimilar.dimension}"이(가) 가장 비슷해요 (${mostSimilar.similarity}%)`);
      }
    }

    // 가장 다른 차원
    if (dimensionMatches.length > 1) {
      const mostDifferent = dimensionMatches[dimensionMatches.length - 1];
      if (mostDifferent.similarity < 50) {
        insights.push(`✨ "${mostDifferent.dimension}"에서 서로 다른 관점을 가져요`);
      }
    }

    // 같은 결과 유형
    if (myResult === friendResult) {
      insights.push(`🎊 같은 "${myResult}" 유형이에요!`);
    }

    return insights;
  }

  // ============================================================================
  // 공유 URL 생성
  // ============================================================================

  /**
   * 친구 초대 URL 생성
   */
  getInviteUrl(code: string): string {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}?invite=${code}`;
  }

  /**
   * 결과 비교 URL 생성
   */
  getCompareUrl(testType: string, resultId: string): string {
    if (typeof window === 'undefined') return '';
    return `${window.location.origin}?compare=${testType}&result=${resultId}`;
  }

  // ============================================================================
  // 내부 저장 메서드
  // ============================================================================

  private getInviteCodes(): InviteCode[] {
    if (typeof window === 'undefined') return [];

    const codes = storage.get<InviteCode[]>(STORAGE_KEYS.INVITE_CODES, []);

    // 만료된 코드 정리
    const now = new Date();
    return codes.filter(c => new Date(c.expiresAt) > now);
  }

  private saveInviteCodes(codes: InviteCode[]): void {
    if (typeof window === 'undefined') return;

    storage.set(STORAGE_KEYS.INVITE_CODES, codes);
  }

  private saveFriends(friends: FriendConnection[]): void {
    if (typeof window === 'undefined') return;

    storage.set(STORAGE_KEYS.FRIENDS, friends);
  }

  // ============================================================================
  // 리셋 (개발용)
  // ============================================================================

  reset(): void {
    if (typeof window === 'undefined') return;

    storage.remove(STORAGE_KEYS.INVITE_CODES);
    storage.remove(STORAGE_KEYS.FRIENDS);
    storage.remove(STORAGE_KEYS.PENDING_INVITES);
  }
}

// 싱글톤 인스턴스
let instance: FriendService | null = null;

export function getFriendService(): FriendService {
  if (!instance) {
    instance = new FriendService();
  }
  return instance;
}

export const friendService = typeof window !== 'undefined'
  ? getFriendService()
  : null;

export default friendService;
