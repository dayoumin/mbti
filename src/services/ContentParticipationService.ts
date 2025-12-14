/**
 * ContentParticipationService - 퀴즈/투표 참여 기록 관리
 *
 * localStorage에 참여 기록을 저장하여 재방문 시에도 유지
 */

// ============================================================================
// 타입 정의
// ============================================================================

export interface QuizParticipation {
  quizId: string;
  selectedOption: string;
  isCorrect: boolean;
  answeredAt: string;
}

export interface PollParticipation {
  pollId: string;
  choice: 'a' | 'b';
  votedAt: string;
}

export interface ContentParticipationData {
  quizzes: QuizParticipation[];
  polls: PollParticipation[];
  stats: {
    totalQuizAnswered: number;
    totalCorrect: number;
    totalPollVoted: number;
    lastParticipatedAt: string | null;
  };
}

const STORAGE_KEY = 'chemi_content_participation';
const UPDATE_EVENT = 'chemi_content_participation_updated';

// ============================================================================
// 서비스 클래스
// ============================================================================

class ContentParticipationServiceClass {
  private data: ContentParticipationData;

  constructor() {
    this.data = this.loadFromStorage();
  }

  // 저장소에서 로드
  private loadFromStorage(): ContentParticipationData {
    if (typeof window === 'undefined') {
      return this.getDefaultData();
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.error('ContentParticipationService: Failed to load from storage', e);
    }

    return this.getDefaultData();
  }

  // 기본 데이터
  private getDefaultData(): ContentParticipationData {
    return {
      quizzes: [],
      polls: [],
      stats: {
        totalQuizAnswered: 0,
        totalCorrect: 0,
        totalPollVoted: 0,
        lastParticipatedAt: null,
      },
    };
  }

  // 저장소에 저장
  private saveToStorage(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.data));
      window.dispatchEvent(new Event(UPDATE_EVENT));
    } catch (e) {
      console.error('ContentParticipationService: Failed to save to storage', e);
    }
  }

  // 퀴즈 정답 기록
  recordQuizAnswer(quizId: string, selectedOption: string, isCorrect: boolean): void {
    // 이미 참여한 퀴즈인지 확인
    const existing = this.data.quizzes.find(q => q.quizId === quizId);
    if (existing) return; // 이미 참여함

    this.data.quizzes.push({
      quizId,
      selectedOption,
      isCorrect,
      answeredAt: new Date().toISOString(),
    });

    this.data.stats.totalQuizAnswered++;
    if (isCorrect) {
      this.data.stats.totalCorrect++;
    }
    this.data.stats.lastParticipatedAt = new Date().toISOString();

    this.saveToStorage();
  }

  // 투표 기록
  recordPollVote(pollId: string, choice: 'a' | 'b'): void {
    // 이미 참여한 투표인지 확인
    const existing = this.data.polls.find(p => p.pollId === pollId);
    if (existing) return; // 이미 참여함

    this.data.polls.push({
      pollId,
      choice,
      votedAt: new Date().toISOString(),
    });

    this.data.stats.totalPollVoted++;
    this.data.stats.lastParticipatedAt = new Date().toISOString();

    this.saveToStorage();
  }

  // 참여 데이터 조회
  getParticipation(): ContentParticipationData {
    // SSR에서 호출 시 최신 데이터 로드
    if (typeof window !== 'undefined') {
      this.data = this.loadFromStorage();
    }
    return this.data;
  }

  // 특정 퀴즈 참여 여부
  hasAnsweredQuiz(quizId: string): boolean {
    return this.data.quizzes.some(q => q.quizId === quizId);
  }

  // 특정 투표 참여 여부
  hasVotedPoll(pollId: string): boolean {
    return this.data.polls.some(p => p.pollId === pollId);
  }

  // 퀴즈 정답률
  getQuizAccuracy(): number {
    if (this.data.stats.totalQuizAnswered === 0) return 0;
    return Math.round((this.data.stats.totalCorrect / this.data.stats.totalQuizAnswered) * 100);
  }

  // 통계 조회
  getStats() {
    return {
      ...this.data.stats,
      accuracy: this.getQuizAccuracy(),
    };
  }

  // 데이터 초기화 (테스트용)
  reset(): void {
    this.data = this.getDefaultData();
    this.saveToStorage();
  }
}

// 싱글톤 인스턴스
export const contentParticipationService = new ContentParticipationServiceClass();

export default contentParticipationService;
