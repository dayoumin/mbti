/**
 * TursoService - Turso DB 클라이언트 서비스
 *
 * 브라우저에서 API 라우트를 통해 Turso DB와 통신
 * - localStorage 폴백 지원
 * - 오프라인 지원 (나중에)
 */

import { getDeviceId } from '@/utils/device';

// ========== 타입 정의 ==========

export interface PollStats {
  pollId: string;
  totalVotes: number;
  options: { optionId: string; count: number; percentage: number }[];
}

export interface QuizStats {
  quizId: string;
  totalAttempts: number;
  correctRate: number;
  byQuestion: { questionIndex: number; correctRate: number }[];
}

export interface FeedbackStats {
  accurate: number;
  inaccurate: number;
  total: number;
}

export interface FeedbackComment {
  id: number;
  resultName: string;
  isAccurate: boolean;
  comment: string;
  createdAt: string;
}

// 타겟 타입 (댓글, 좋아요 공용)
export type CommentTargetType = 'poll' | 'quiz' | 'test_result' | 'ranking';
export type LikeTargetType = 'comment' | 'post' | 'poll' | 'quiz';

export interface Comment {
  id: number;
  authorId: string;  // 해시화된 익명 ID (deviceId 대신)
  isOwner: boolean;  // 본인 댓글 여부
  content: string;
  likes: number;
  parentId: number | null;
  createdAt: string;
}

export interface CommentsResponse {
  comments: Comment[];
  total: number;
  hasMore: boolean;
}

// ========== TursoService Class ==========

class TursoServiceClass {
  private apiBase = '/api';

  // ========== 투표 ==========

  async savePollResponse(pollId: string, optionId: string): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${this.apiBase}/poll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          pollId,
          optionId,
        }),
      });

      if (!res.ok) throw new Error('Failed to save poll');
      return { success: true };
    } catch (error) {
      console.error('[TursoService] savePollResponse error:', error);
      return { success: false };
    }
  }

  async getPollStats(pollId: string): Promise<PollStats> {
    try {
      const res = await fetch(`${this.apiBase}/poll?pollId=${encodeURIComponent(pollId)}`);
      if (!res.ok) throw new Error('Failed to get poll stats');
      return await res.json();
    } catch (error) {
      console.error('[TursoService] getPollStats error:', error);
      return { pollId, totalVotes: 0, options: [] };
    }
  }

  // ========== 퀴즈 ==========

  async saveQuizResponse(
    quizId: string,
    selectedOption: string,
    isCorrect: boolean,
    questionIndex: number = 0,
    points: number = 0
  ): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${this.apiBase}/quiz`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          quizId,
          questionIndex,
          selectedOption,
          isCorrect,
          points,
        }),
      });

      if (!res.ok) throw new Error('Failed to save quiz');
      return { success: true };
    } catch (error) {
      console.error('[TursoService] saveQuizResponse error:', error);
      return { success: false };
    }
  }

  async getQuizStats(quizId: string): Promise<QuizStats> {
    try {
      const res = await fetch(`${this.apiBase}/quiz?quizId=${encodeURIComponent(quizId)}`);
      if (!res.ok) throw new Error('Failed to get quiz stats');
      return await res.json();
    } catch (error) {
      console.error('[TursoService] getQuizStats error:', error);
      return { quizId, totalAttempts: 0, correctRate: 0, byQuestion: [] };
    }
  }

  // ========== 피드백 ==========

  async saveFeedback(
    testType: string,
    resultName: string,
    isAccurate: boolean,
    comment?: string
  ): Promise<{ success: boolean }> {
    try {
      const res = await fetch(`${this.apiBase}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          testType,
          resultName,
          isAccurate,
          comment,
        }),
      });

      if (!res.ok) throw new Error('Failed to save feedback');
      return { success: true };
    } catch (error) {
      console.error('[TursoService] saveFeedback error:', error);
      return { success: false };
    }
  }

  async getFeedbackStats(testType: string): Promise<FeedbackStats> {
    try {
      const res = await fetch(
        `${this.apiBase}/feedback?testType=${encodeURIComponent(testType)}&type=stats`
      );
      if (!res.ok) throw new Error('Failed to get feedback stats');
      return await res.json();
    } catch (error) {
      console.error('[TursoService] getFeedbackStats error:', error);
      return { accurate: 0, inaccurate: 0, total: 0 };
    }
  }

  async getComments(
    testType: string,
    resultName?: string,
    limit: number = 10
  ): Promise<FeedbackComment[]> {
    try {
      let url = `${this.apiBase}/feedback?testType=${encodeURIComponent(testType)}&type=comments&limit=${limit}`;
      if (resultName) {
        url += `&resultName=${encodeURIComponent(resultName)}`;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error('Failed to get comments');

      const data = await res.json();
      return data.comments || [];
    } catch (error) {
      console.error('[TursoService] getComments error:', error);
      return [];
    }
  }

  // ========== 통합 댓글 ==========

  /**
   * 댓글 작성
   * @param targetType - 대상 타입 (poll, quiz, test_result, ranking)
   * @param targetId - 대상 ID (pollId, quizId, testType_resultName 등)
   * @param content - 댓글 내용
   * @param parentId - 대댓글인 경우 부모 댓글 ID
   */
  async addComment(
    targetType: CommentTargetType,
    targetId: string,
    content: string,
    parentId?: number
  ): Promise<{ success: boolean; id?: number }> {
    try {
      const res = await fetch(`${this.apiBase}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          targetType,
          targetId,
          content,
          parentId,
        }),
      });

      if (!res.ok) throw new Error('Failed to add comment');
      const data = await res.json();
      return { success: true, id: data.id };
    } catch (error) {
      console.error('[TursoService] addComment error:', error);
      return { success: false };
    }
  }

  /**
   * 댓글 조회
   * @param targetType - 대상 타입
   * @param targetId - 대상 ID
   * @param limit - 가져올 개수 (기본 20)
   * @param offset - 시작 위치 (페이지네이션용)
   */
  async getTargetComments(
    targetType: CommentTargetType,
    targetId: string,
    limit: number = 20,
    offset: number = 0
  ): Promise<CommentsResponse> {
    try {
      const deviceId = getDeviceId();
      const params = new URLSearchParams({
        targetType,
        targetId,
        deviceId,
        limit: String(limit),
        offset: String(offset),
      });

      const res = await fetch(`${this.apiBase}/comments?${params}`);
      if (!res.ok) throw new Error('Failed to get comments');
      return await res.json();
    } catch (error) {
      console.error('[TursoService] getTargetComments error:', error);
      return { comments: [], total: 0, hasMore: false };
    }
  }

  /**
   * 내 댓글인지 확인
   */
  isMyComment(comment: Comment): boolean {
    return comment.isOwner;
  }

  // ========== 좋아요 ==========

  /**
   * 좋아요 토글 (추가/삭제)
   */
  async toggleLike(
    targetType: LikeTargetType,
    targetId: string
  ): Promise<{ success: boolean; liked: boolean }> {
    try {
      const res = await fetch(`${this.apiBase}/likes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          targetType,
          targetId,
        }),
      });

      if (!res.ok) throw new Error('Failed to toggle like');
      const data = await res.json();
      return { success: true, liked: data.liked };
    } catch (error) {
      console.error('[TursoService] toggleLike error:', error);
      return { success: false, liked: false };
    }
  }

  /**
   * 좋아요 정보 조회
   */
  async getLikeInfo(
    targetType: LikeTargetType,
    targetId: string
  ): Promise<{ count: number; liked: boolean }> {
    try {
      const params = new URLSearchParams({
        targetType,
        targetId,
        deviceId: getDeviceId(),
      });

      const res = await fetch(`${this.apiBase}/likes?${params}`);
      if (!res.ok) throw new Error('Failed to get like info');
      return await res.json();
    } catch (error) {
      console.error('[TursoService] getLikeInfo error:', error);
      return { count: 0, liked: false };
    }
  }

  // ========== 테스트 결과 ==========

  /**
   * 테스트 결과 저장
   */
  async saveTestResult(
    testType: string,
    resultName: string,
    resultEmoji: string,
    scores: Record<string, number>,
    isDeepMode: boolean = false,
    parentInfo?: { testType: string; resultName: string },
    timestamp?: string
  ): Promise<{ success: boolean; id?: string }> {
    try {
      const res = await fetch(`${this.apiBase}/test-results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          testType,
          resultName,
          resultEmoji,
          scores,
          isDeepMode,
          parentInfo,
          timestamp,
        }),
      });

      if (!res.ok) throw new Error('Failed to save test result');
      const data = await res.json();
      return { success: true, id: data.id };
    } catch (error) {
      console.error('[TursoService] saveTestResult error:', error);
      return { success: false };
    }
  }

  /**
   * 내 테스트 결과 조회
   */
  async getMyResults(): Promise<TestResult[]> {
    try {
      const res = await fetch(
        `${this.apiBase}/test-results?type=my-results&deviceId=${encodeURIComponent(getDeviceId())}`
      );
      if (!res.ok) throw new Error('Failed to get my results');
      const data = await res.json();
      return data.results || [];
    } catch (error) {
      console.error('[TursoService] getMyResults error:', error);
      return [];
    }
  }

  /**
   * 결과 분포 조회 (다른 유형은 어떤지)
   */
  async getResultDistribution(
    testType: string,
    filter?: { ageGroup?: string; gender?: string }
  ): Promise<ResultDistribution> {
    try {
      const params = new URLSearchParams({
        type: 'distribution',
        testType,
      });
      if (filter?.ageGroup) params.set('ageGroup', filter.ageGroup);
      if (filter?.gender) params.set('gender', filter.gender);

      const res = await fetch(`${this.apiBase}/test-results?${params}`);
      if (!res.ok) throw new Error('Failed to get distribution');
      return await res.json();
    } catch (error) {
      console.error('[TursoService] getResultDistribution error:', error);
      return { testType, total: 0, distribution: [], filter: { ageGroup: 'all', gender: 'all' } };
    }
  }

  /**
   * 내 결과 순위 조회
   */
  async getMyResultRank(testType: string): Promise<MyResultRank> {
    try {
      const params = new URLSearchParams({
        type: 'my-rank',
        testType,
        deviceId: getDeviceId(),
      });

      const res = await fetch(`${this.apiBase}/test-results?${params}`);
      if (!res.ok) throw new Error('Failed to get my rank');
      return await res.json();
    } catch (error) {
      console.error('[TursoService] getMyResultRank error:', error);
      return { hasResult: false };
    }
  }
}

// ========== 추가 타입 정의 ==========

export interface TestResult {
  id: number;
  testType: string;
  resultKey: string;
  resultEmoji: string;
  scores: Record<string, number>;
  isDeepMode: boolean;
  parentTest?: string;
  parentResult?: string;
  createdAt: string;
}

export interface ResultDistribution {
  testType: string;
  total: number;
  distribution: {
    rank: number;
    resultName: string;
    count: number;
    percentage: number;
  }[];
  filter: {
    ageGroup: string;
    gender: string;
  };
}

export interface MyResultRank {
  hasResult: boolean;
  testType?: string;
  resultName?: string;
  rank?: number;
  totalResults?: number;
  count?: number;
  percentage?: number;
  total?: number;
}

// 싱글톤 인스턴스
export const tursoService = new TursoServiceClass();

export default tursoService;
