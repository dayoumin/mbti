// ============================================================================
// 참여 브릿지 서비스
// FeedbackService ↔ GamificationService 연결
// ============================================================================

import { getGamificationService } from './GamificationService';
import { feedbackService, type PollResponseData, type QuizResponseData, type PollStats } from './FeedbackService';

// PollStats 타입 (간단 버전 - Bridge에서 사용)
interface SimplePollStats {
  totalVotes: number;
  optionVotes: Record<string, number>;
}

export interface PollVoteResult {
  saved: boolean;
  isMinority: boolean;
  gamification: {
    points: number;
    newBadges: string[];
  };
}

export interface QuizAnswerResult {
  saved: boolean;
  isCorrect: boolean;
  gamification: {
    points: number;
    newBadges: string[];
  };
}

export interface ParticipationSummary {
  polls: {
    total: number;
    minorityCount: number;
    minorityRatio: number;
    topCategories: Array<{ category: string; count: number }>;
  };
  quizzes: {
    total: number;
    correct: number;
    correctRate: number;
    bestCategory: string | null;
  };
  badges: {
    total: number;
    recent: string[];
  };
}

class ParticipationBridge {
  // ============================================================================
  // 투표 참여 (통합)
  // ============================================================================

  /**
   * 투표 참여 처리 (저장 + 게이미피케이션)
   * @param pollId 투표 ID
   * @param optionId 선택한 옵션 ID
   * @param pollStats 현재 투표 통계 (소수 의견 판단용)
   * @param category 투표 카테고리 (선택)
   */
  async recordPollVote(
    pollId: string,
    optionId: string,
    pollStats?: SimplePollStats,
    category?: string
  ): Promise<PollVoteResult> {
    // 1. 소수 의견 여부 판단
    let isMinority = false;
    if (pollStats && pollStats.totalVotes > 0) {
      const optionVotes = pollStats.optionVotes[optionId] || 0;
      const ratio = (optionVotes / pollStats.totalVotes) * 100;
      isMinority = ratio < 30; // 30% 미만이면 소수 의견
    }

    // 2. FeedbackService에 저장 (PollStats 형식으로 변환)
    const pollResponse: PollResponseData & { category?: string } = {
      pollId,
      optionId,
      category,
    };

    // PollStats 변환 (options 배열 형식)
    let feedbackPollStats: PollStats | undefined;
    if (pollStats) {
      const options = Object.entries(pollStats.optionVotes).map(([optId, count]) => ({
        optionId: optId,
        count,
        percentage: pollStats.totalVotes > 0 ? (count / pollStats.totalVotes) * 100 : 0,
      }));
      feedbackPollStats = {
        pollId,
        totalVotes: pollStats.totalVotes,
        options,
      };
    }

    const result = await feedbackService.savePollResponseWithAnalysis(pollResponse, feedbackPollStats);
    const saved = result.success;

    // 3. GamificationService에 기록
    const gamificationService = getGamificationService();
    let gamification = { points: 0, newBadges: [] as string[] };

    if (gamificationService) {
      gamification = gamificationService.recordPollVote({
        category,
        isMinority,
      });
    }

    return {
      saved,
      isMinority,
      gamification,
    };
  }

  // ============================================================================
  // 퀴즈 참여 (통합)
  // ============================================================================

  /**
   * 퀴즈 답변 처리 (저장 + 게이미피케이션)
   * @param quizId 퀴즈 ID
   * @param selectedAnswer 선택한 답변
   * @param isCorrect 정답 여부
   * @param category 퀴즈 카테고리 (선택)
   */
  async recordQuizAnswer(
    quizId: string,
    questionIndex: number,
    selectedAnswer: string,
    isCorrect: boolean,
    category?: string
  ): Promise<QuizAnswerResult> {
    // 1. FeedbackService에 저장
    const quizResponse: QuizResponseData & { category?: string } = {
      quizId,
      questionIndex,
      selectedOption: selectedAnswer,
      isCorrect,
      category,
    };

    const result = await feedbackService.saveQuizResponseWithCategory(quizResponse);
    const saved = result.success;

    // 2. GamificationService에 기록
    const gamificationService = getGamificationService();
    let gamification = { points: 0, newBadges: [] as string[] };

    if (gamificationService) {
      gamification = gamificationService.recordQuizAnswer(isCorrect, category);
    }

    return {
      saved,
      isCorrect,
      gamification,
    };
  }

  // ============================================================================
  // 참여 현황 조회
  // ============================================================================

  /**
   * 사용자 참여 요약 정보 조회
   */
  async getParticipationSummary(): Promise<ParticipationSummary> {
    const gamificationService = getGamificationService();

    // 투표 분석
    const pollAnalysis = await feedbackService.getUserPollAnalysis();

    // 퀴즈 분석
    const quizAnalysis = await feedbackService.getUserQuizAnalysis();

    // 배지 정보
    let badges = { total: 0, recent: [] as string[] };
    if (gamificationService) {
      const allBadges = gamificationService.getBadges();
      badges = {
        total: allBadges.length,
        recent: allBadges
          .sort((a, b) => new Date(b.earnedAt).getTime() - new Date(a.earnedAt).getTime())
          .slice(0, 3)
          .map(b => b.badgeId),
      };
    }

    // 상위 카테고리 변환
    const topCategories = Object.entries(pollAnalysis.categoryBreakdown)
      .map(([category, count]) => ({ category, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      polls: {
        total: pollAnalysis.totalPolls,
        minorityCount: pollAnalysis.minorityVotes,
        minorityRatio: pollAnalysis.minorityRatio,
        topCategories,
      },
      quizzes: {
        total: quizAnalysis.totalAnswered,
        correct: quizAnalysis.correctCount,
        correctRate: quizAnalysis.correctRate,
        bestCategory: quizAnalysis.bestCategory,
      },
      badges,
    };
  }

  // ============================================================================
  // 배지 획득 알림 체크
  // ============================================================================

  /**
   * 최근 획득한 배지 확인 (UI 알림용)
   */
  getRecentBadges(since: Date): Array<{ badgeId: string; earnedAt: Date }> {
    const gamificationService = getGamificationService();
    if (!gamificationService) return [];

    return gamificationService.getBadges()
      .filter(b => new Date(b.earnedAt) >= since)
      .map(b => ({ badgeId: b.badgeId, earnedAt: new Date(b.earnedAt) }));
  }

  // ============================================================================
  // 참여 유도 메시지 생성
  // ============================================================================

  /**
   * 참여 유도 메시지 생성
   */
  getEngagementMessage(): string | null {
    const gamificationService = getGamificationService();
    if (!gamificationService) return null;

    const stats = gamificationService.getStats();
    const minorityRatio = gamificationService.getMinorityVoteRatio();

    // 소수 의견 관련 메시지
    if (stats.pollsVoted >= 5 && minorityRatio >= 40 && minorityRatio < 50) {
      return `소신파까지 ${50 - minorityRatio}% 더 필요해요! 🎭`;
    }

    // 카테고리 관련 메시지
    const pollsByCategory = gamificationService.getPollsByCategory();
    for (const [category, count] of Object.entries(pollsByCategory)) {
      if (count >= 7 && count < 10) {
        const categoryNames: Record<string, string> = {
          cat: '냥집사 투표왕',
          dog: '댕댕이 투표왕',
          love: '연애 고수',
        };
        if (categoryNames[category]) {
          return `${categoryNames[category]}까지 ${10 - count}개 남았어요! 🏆`;
        }
      }
    }

    // 투표 중독자
    if (stats.pollsVoted >= 40 && stats.pollsVoted < 50) {
      return `투표 중독자까지 ${50 - stats.pollsVoted}개 남았어요! 🎯`;
    }

    return null;
  }
}

// 싱글톤 인스턴스
let instance: ParticipationBridge | null = null;

export function getParticipationBridge(): ParticipationBridge {
  if (!instance) {
    instance = new ParticipationBridge();
  }
  return instance;
}

export const participationBridge = typeof window !== 'undefined'
  ? getParticipationBridge()
  : null;

export default participationBridge;
