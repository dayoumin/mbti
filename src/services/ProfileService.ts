/**
 * ProfileService - 테스트 결과를 프로필 데이터로 변환
 *
 * 테스트 결과를 수집하여 "나의 프로필"을 구성
 * - 성격 (human 테스트) → 5차원 레이더 차트
 * - 반려동물 케미 (cat, dog, rabbit, hamster, petMatch) → 바 차트
 * - 연애/관계 (idealType, conflictStyle) → 카드
 * - 라이프스타일 (coffee, plant) → 뱃지
 */

import { resultService } from './ResultService';
import { CHEMI_DATA, SUBJECT_CONFIG, DETAIL_TEST_KEYS } from '@/data';
import type { SubjectKey } from '@/data/types';
import { RECOMMENDATION_ORDER } from '@/data/recommendationPolicy';
import type { PersonalityType } from '@/data/config';
import { STORAGE_KEYS, LocalStorage } from '@/lib/storage';

// ========== 타입 정의 ==========

export interface PersonalityTrait {
  key: string;
  label: string;
  score: number;  // 0-100
  level: 'LOW' | 'MEDIUM' | 'HIGH';
}

export interface PetChemiScore {
  pet: string;       // subject key (cat, dog, etc.)
  petName: string;   // 한글명 (고양이, 강아지)
  petEmoji: string;
  resultName: string;
  compatibility: number;  // 0-100
}

export interface NextRecommendation {
  testKey: string;
  testLabel: string;
  testEmoji?: string;  // SUBJECT_CONFIG.emoji가 없을 수 있음
  reason: string;
  reward: string;  // "라이프스타일 뱃지 획득!" 등
}

export interface ProfileBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
  requirement: string;
}

export interface HiddenCombo {
  id: string;
  name: string;
  emoji: string;
  description: string;
  unlocked: boolean;
  requiredTests: string[];
  completedTests: string[];
}

// 사용자가 직접 입력/선택한 프로필 설정
export interface UserProfileSettings {
  personalityType?: PersonalityType;  // 16유형 (선택사항)
  // 향후 확장: nickname, birthYear, gender 등
}

export interface MyProfileData {
  // 기본 정보
  userId: string;
  lastUpdated: string;
  completedTests: number;
  totalTests: number;
  completionRate: number;

  // 사용자 선택 정보
  personalityType: PersonalityType | null;  // 16유형

  // 성격 프로필 (human 테스트)
  personality: {
    resultName: string;
    resultEmoji: string;
    traits: PersonalityTrait[];
  } | null;

  // 반려동물 케미
  petChemi: {
    recommendedPet: string | null;
    scores: PetChemiScore[];
  };

  // 연애/관계
  relationship: {
    idealType: { resultName: string; resultEmoji: string } | null;
    conflictStyle: { resultName: string; resultEmoji: string } | null;
  };

  // 라이프스타일
  lifestyle: {
    coffee: { resultName: string; resultEmoji: string } | null;
    plant: { resultName: string; resultEmoji: string } | null;
  };

  // === 유인 요소 ===

  // 다음 추천 테스트
  nextRecommendation: NextRecommendation | null;

  // 뱃지/도전과제
  badges: ProfileBadge[];

  // 숨겨진 조합
  hiddenCombos: HiddenCombo[];

  // 다음 마일스톤
  nextMilestone: {
    target: number;  // 50%, 70%, 100%
    reward: string;
    testsNeeded: number;
  } | null;
}

// ========== 차원 라벨 매핑 ==========

const HUMAN_DIMENSION_LABELS: Record<string, string> = {
  inssa: '인싸력',
  adventure: '모험심',
  empathy: '공감력',
  plan: '계획력',
  mental: '멘탈력',
};

const PET_LABELS: Record<string, { name: string; emoji: string }> = {
  cat: { name: '고양이', emoji: '🐱' },
  dog: { name: '강아지', emoji: '🐕' },
  rabbit: { name: '토끼', emoji: '🐰' },
  hamster: { name: '햄스터', emoji: '🐹' },
};

// ========== 뱃지 정의 ==========

const BADGE_DEFINITIONS: Omit<ProfileBadge, 'unlocked' | 'unlockedAt'>[] = [
  {
    id: 'pet-master',
    name: '펫 마스터',
    emoji: '🐾',
    description: '반려동물 케미 테스트 4종 완료',
    requirement: '고양이, 강아지, 토끼, 햄스터 테스트 모두 완료',
  },
  {
    id: 'love-expert',
    name: '연애박사',
    emoji: '💕',
    description: '연애 관련 테스트 모두 완료',
    requirement: '이상형, 갈등 대처 테스트 완료',
  },
  {
    id: 'lifestyle-guru',
    name: '라이프스타일 전문가',
    emoji: '✨',
    description: '라이프스타일 테스트 모두 완료',
    requirement: '커피, 식물 테스트 완료',
  },
  {
    id: 'self-explorer',
    name: '자아 탐험가',
    emoji: '🧠',
    description: '성격 분석 테스트 완료',
    requirement: '사람 성격 테스트 완료',
  },
  {
    id: 'completionist',
    name: '완벽주의자',
    emoji: '🏆',
    description: '모든 메인 테스트 완료',
    requirement: '전체 완료율 100%',
  },
];

// ========== 숨겨진 조합 정의 ==========

const COMBO_DEFINITIONS: Omit<HiddenCombo, 'unlocked' | 'completedTests'>[] = [
  {
    id: 'cat-coffee',
    name: '쿨한 독립파',
    emoji: '😎',
    description: '고양이 집사 + 커피 러버 = 혼자만의 시간을 즐기는 여유로운 타입',
    requiredTests: ['cat', 'coffee'],
  },
  {
    id: 'dog-plant',
    name: '따뜻한 돌봄이',
    emoji: '🌻',
    description: '강아지 집사 + 식물 집사 = 생명을 돌보는 따뜻한 마음의 소유자',
    requiredTests: ['dog', 'plant'],
  },
  {
    id: 'human-ideal',
    name: '관계 마스터',
    emoji: '💫',
    description: '성격 분석 + 이상형 테스트 = 나와 상대를 깊이 이해하는 타입',
    requiredTests: ['human', 'idealType'],
  },
  {
    id: 'all-pets',
    name: '동물 왕국',
    emoji: '👑',
    description: '모든 반려동물 테스트 완료 = 진정한 동물 애호가',
    requiredTests: ['cat', 'dog', 'rabbit', 'hamster', 'petMatch'],
  },
  {
    id: 'full-self',
    name: '자기 이해 마스터',
    emoji: '🔮',
    description: '성격 + 연애 + 갈등 대처 완료 = 나 자신을 완벽히 이해',
    requiredTests: ['human', 'idealType', 'conflictStyle'],
  },
];

// ========== 테스트 추천 우선순위 ==========

// 이모지는 SUBJECT_CONFIG.emoji에서 참조, 나머지 추천 상세 정보만 정의
const RECOMMENDATION_DETAILS: Partial<Record<SubjectKey, { reason: string; reward: string; category: string }>> = {
  human: { reason: '나를 알아야 시작이죠!', reward: '자아 탐험가 뱃지 획득', category: 'me' },
  coffee: { reason: '가볍게 시작해보세요', reward: '라이프스타일 뱃지 진행', category: 'lifestyle' },
  cat: { reason: '냥이와의 케미는?', reward: '펫 마스터 뱃지 진행', category: 'pet' },
  dog: { reason: '멍멍이와의 케미는?', reward: '펫 마스터 뱃지 진행', category: 'pet' },
  idealType: { reason: '내 이상형을 찾아보세요', reward: '연애박사 뱃지 진행', category: 'love' },
  plant: { reason: '반려식물 찾기', reward: '라이프스타일 뱃지 완성!', category: 'lifestyle' },
  petMatch: { reason: '어떤 동물이 맞을까?', reward: '동물 왕국 조합 진행', category: 'pet' },
  conflictStyle: { reason: '관계에서 중요해요', reward: '연애박사 뱃지 완성!', category: 'love' },
  rabbit: { reason: '토끼와의 케미는?', reward: '펫 마스터 뱃지 진행', category: 'pet' },
  hamster: { reason: '햄찌와의 케미는?', reward: '펫 마스터 뱃지 완성!', category: 'pet' },
  tea: { reason: '차 취향도 알아봐요', reward: '새 테스트 완료', category: 'lifestyle' },
  fruit: { reason: '입맛 성향을 알아봐요', reward: '새 테스트 완료', category: 'lifestyle' },
  alcohol: { reason: '내 취향 술은?', reward: '새 테스트 완료', category: 'lifestyle' },
  bread: { reason: '내 입맛 빵은?', reward: '새 테스트 완료', category: 'lifestyle' },
  perfume: { reason: '향 취향을 찾아봐요', reward: '새 테스트 완료', category: 'lifestyle' },
  aroma: { reason: '기분에 맞는 향은?', reward: '새 테스트 완료', category: 'lifestyle' },
};

// ========== 유틸리티 함수 ==========

function calculateCompatibility(scores: Record<string, number>): number {
  // 점수를 0-100 호환성으로 변환
  const values = Object.values(scores);
  if (values.length === 0) return 50;

  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  // 점수가 높을수록 케미가 좋다고 가정 (조정 가능)
  return Math.min(100, Math.max(0, Math.round(avg * 20)));
}

function getScoreLevel(score: number): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (score >= 60) return 'HIGH';
  if (score >= 40) return 'MEDIUM';
  return 'LOW';
}

// ========== ProfileService Class ==========

class ProfileServiceClass {
  // ========== 사용자 프로필 설정 관리 ==========

  /**
   * 사용자 프로필 설정 조회
   */
  getUserSettings(): UserProfileSettings {
    return LocalStorage.get<UserProfileSettings>(
      STORAGE_KEYS.USER_PROFILE_SETTINGS,
      {}
    );
  }

  /**
   * 사용자 프로필 설정 저장
   */
  saveUserSettings(settings: Partial<UserProfileSettings>): boolean {
    const current = this.getUserSettings();
    const updated = { ...current, ...settings };
    return LocalStorage.set(STORAGE_KEYS.USER_PROFILE_SETTINGS, updated);
  }

  /**
   * 16유형 조회
   */
  getPersonalityType(): PersonalityType | null {
    const settings = this.getUserSettings();
    return settings.personalityType || null;
  }

  /**
   * 16유형 저장
   */
  setPersonalityType(type: PersonalityType | null): boolean {
    if (type === null) {
      const settings = this.getUserSettings();
      delete settings.personalityType;
      return LocalStorage.set(STORAGE_KEYS.USER_PROFILE_SETTINGS, settings);
    }
    return this.saveUserSettings({ personalityType: type });
  }

  // ========== 프로필 데이터 조회 ==========

  async getMyProfile(): Promise<MyProfileData> {
    const results = await resultService.getMyResults();
    const allTests = Object.keys(CHEMI_DATA);
    const userSettings = this.getUserSettings();

    // 테스트별 최신 결과 추출
    const latestByType: Record<string, typeof results[0]> = {};
    results.forEach((r) => {
      if (!latestByType[r.testType] ||
          new Date(r.createdAt) > new Date(latestByType[r.testType].createdAt)) {
        latestByType[r.testType] = r;
      }
    });

    // 성격 프로필 (human)
    const humanResult = latestByType['human'];
    let personality: MyProfileData['personality'] = null;

    if (humanResult) {
      const traits: PersonalityTrait[] = Object.entries(humanResult.scores || {}).map(([key, value]) => {
        const score = Math.min(100, Math.max(0, value * 20)); // 0-5 → 0-100
        return {
          key,
          label: HUMAN_DIMENSION_LABELS[key] || key,
          score,
          level: getScoreLevel(score),
        };
      });

      personality = {
        resultName: humanResult.resultKey,
        resultEmoji: humanResult.resultEmoji,
        traits,
      };
    }

    // 반려동물 케미
    const petTypes = ['cat', 'dog', 'rabbit', 'hamster'];
    const petScores: PetChemiScore[] = [];

    for (const pet of petTypes) {
      const petResult = latestByType[pet];
      if (petResult) {
        const petInfo = PET_LABELS[pet];
        petScores.push({
          pet,
          petName: petInfo.name,
          petEmoji: petInfo.emoji,
          resultName: petResult.resultKey,
          compatibility: calculateCompatibility(petResult.scores || {}),
        });
      }
    }

    // petMatch 결과에서 추천 반려동물
    const petMatchResult = latestByType['petMatch'];
    const recommendedPet = petMatchResult?.resultKey || null;

    // 연애/관계
    const idealTypeResult = latestByType['idealType'];
    const conflictStyleResult = latestByType['conflictStyle'];

    // 라이프스타일
    const coffeeResult = latestByType['coffee'];
    const plantResult = latestByType['plant'];

    // 완료율 계산 (petMatch 세부 테스트 제외)
    const mainTests = allTests.filter(t => !(DETAIL_TEST_KEYS as readonly string[]).includes(t));
    const completedTestSet = new Set(results.map(r => r.testType));
    const completedMainTests = mainTests.filter(t => completedTestSet.has(t)).length;
    const completionRate = Math.round((completedMainTests / mainTests.length) * 100);

    // === 유인 요소 계산 ===

    // 1. 다음 추천 테스트
    const nextRecommendation = this.getNextRecommendation(completedTestSet);

    // 2. 뱃지 계산
    const badges = this.calculateBadges(completedTestSet, completionRate);

    // 3. 숨겨진 조합 계산
    const hiddenCombos = this.calculateCombos(completedTestSet);

    // 4. 다음 마일스톤
    const nextMilestone = this.getNextMilestone(completionRate, completedMainTests, mainTests.length);

    return {
      userId: resultService.getUserId(),
      lastUpdated: results.length > 0 ? results[0].createdAt : new Date().toISOString(),
      completedTests: completedMainTests,
      totalTests: mainTests.length,
      completionRate,

      // 사용자 선택 정보
      personalityType: userSettings.personalityType || null,

      personality,

      petChemi: {
        recommendedPet,
        scores: petScores,
      },

      relationship: {
        idealType: idealTypeResult ? {
          resultName: idealTypeResult.resultKey,
          resultEmoji: idealTypeResult.resultEmoji,
        } : null,
        conflictStyle: conflictStyleResult ? {
          resultName: conflictStyleResult.resultKey,
          resultEmoji: conflictStyleResult.resultEmoji,
        } : null,
      },

      lifestyle: {
        coffee: coffeeResult ? {
          resultName: coffeeResult.resultKey,
          resultEmoji: coffeeResult.resultEmoji,
        } : null,
        plant: plantResult ? {
          resultName: plantResult.resultKey,
          resultEmoji: plantResult.resultEmoji,
        } : null,
      },

      // 유인 요소
      nextRecommendation,
      badges,
      hiddenCombos,
      nextMilestone,
    };
  }

  // 다음 추천 테스트 계산
  private getNextRecommendation(completedTests: Set<string>): NextRecommendation | null {
    for (const key of RECOMMENDATION_ORDER) {
      if (completedTests.has(key)) continue;
      const rec = RECOMMENDATION_DETAILS[key];
      const config = SUBJECT_CONFIG[key];
      if (!rec || !config) continue;
      return {
        testKey: key,
        testLabel: config.label,
        testEmoji: config.emoji || '',
        reason: rec.reason,
        reward: rec.reward,
      };
    }
    return null;
  }

  // 뱃지 계산
  private calculateBadges(completedTests: Set<string>, completionRate: number): ProfileBadge[] {
    const petTests = ['cat', 'dog', 'rabbit', 'hamster'];
    const loveTests = ['idealType', 'conflictStyle'];
    const lifestyleTests = ['coffee', 'plant'];

    return BADGE_DEFINITIONS.map(badge => {
      let unlocked = false;

      switch (badge.id) {
        case 'pet-master':
          unlocked = petTests.every(t => completedTests.has(t));
          break;
        case 'love-expert':
          unlocked = loveTests.every(t => completedTests.has(t));
          break;
        case 'lifestyle-guru':
          unlocked = lifestyleTests.every(t => completedTests.has(t));
          break;
        case 'self-explorer':
          unlocked = completedTests.has('human');
          break;
        case 'completionist':
          unlocked = completionRate >= 100;
          break;
      }

      return {
        ...badge,
        unlocked,
        unlockedAt: unlocked ? new Date().toISOString() : undefined,
      };
    });
  }

  // 숨겨진 조합 계산
  private calculateCombos(completedTests: Set<string>): HiddenCombo[] {
    return COMBO_DEFINITIONS.map(combo => {
      const completedInCombo = combo.requiredTests.filter(t => completedTests.has(t));
      const unlocked = completedInCombo.length === combo.requiredTests.length;

      return {
        ...combo,
        unlocked,
        completedTests: completedInCombo,
      };
    });
  }

  // 다음 마일스톤 계산
  private getNextMilestone(
    completionRate: number,
    completed: number,
    total: number
  ): MyProfileData['nextMilestone'] {
    const milestones = [
      { target: 30, reward: '시작하는 프로필 달성!' },
      { target: 50, reward: '성장하는 프로필 + 특별 인사이트 해금' },
      { target: 70, reward: '풍부한 프로필 + 조합 발견 확률 UP' },
      { target: 100, reward: '완벽한 프로필 + 완벽주의자 뱃지' },
    ];

    for (const milestone of milestones) {
      if (completionRate < milestone.target) {
        const targetCompleted = Math.ceil((milestone.target / 100) * total);
        return {
          target: milestone.target,
          reward: milestone.reward,
          testsNeeded: targetCompleted - completed,
        };
      }
    }
    return null;
  }

  // 프로필 완성도에 따른 레벨
  getProfileLevel(completionRate: number): { level: number; title: string; color: string } {
    if (completionRate >= 90) return { level: 5, title: '완벽한 프로필', color: '#ffd700' };
    if (completionRate >= 70) return { level: 4, title: '풍부한 프로필', color: '#55e6c1' };
    if (completionRate >= 50) return { level: 3, title: '성장하는 프로필', color: '#7aa2ff' };
    if (completionRate >= 30) return { level: 2, title: '시작하는 프로필', color: '#ffd166' };
    return { level: 1, title: '새로운 프로필', color: '#a29bfe' };
  }
}

// 싱글톤 인스턴스
export const profileService = new ProfileServiceClass();

export default profileService;

