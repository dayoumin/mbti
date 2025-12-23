/**
 * ContentParticipationService - 퀴즈/투표 참여 기록 관리
 *
 * localStorage에 참여 기록을 저장하여 재방문 시에도 유지
 */

import { STORAGE_KEYS } from '@/lib/storage';

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

export interface StreakData {
  currentStreak: number;          // 현재 연속 참여 일수
  longestStreak: number;          // 최장 연속 참여 일수
  lastParticipationDate: string | null;  // 마지막 참여 날짜 (YYYY-MM-DD)
  streakHistory: string[];        // 참여 날짜 기록 (최근 30일)
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
  streak: StreakData;
}

const STORAGE_KEY = STORAGE_KEYS.CONTENT_PARTICIPATION;
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
      streak: {
        currentStreak: 0,
        longestStreak: 0,
        lastParticipationDate: null,
        streakHistory: [],
      },
    };
  }

  // 날짜를 YYYY-MM-DD 형식으로 변환
  // 의도적으로 로컬 타임존 사용: 사용자의 실제 "하루" 기준으로 스트릭 계산
  // (KST 고정 시 해외 사용자가 자정 전후로 혼란 발생)
  private getDateString(date: Date = new Date()): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 두 날짜가 연속인지 확인 (어제와 오늘)
  // YYYY-MM-DD 형식의 문자열을 로컬 타임존으로 파싱
  private isConsecutiveDay(prevDate: string, currentDate: string): boolean {
    // YYYY-MM-DD를 로컬 날짜로 파싱 (UTC 해석 방지)
    const [prevYear, prevMonth, prevDay] = prevDate.split('-').map(Number);
    const [currYear, currMonth, currDay] = currentDate.split('-').map(Number);

    const prev = new Date(prevYear, prevMonth - 1, prevDay);
    const curr = new Date(currYear, currMonth - 1, currDay);

    const diffTime = curr.getTime() - prev.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    return diffDays === 1;
  }

  // 같은 날인지 확인
  private isSameDay(date1: string, date2: string): boolean {
    return date1 === date2;
  }

  // 스트릭 업데이트
  private updateStreak(): void {
    const today = this.getDateString();
    const streak = this.data.streak;

    // 스트릭 데이터가 없으면 초기화
    if (!streak) {
      this.data.streak = {
        currentStreak: 1,
        longestStreak: 1,
        lastParticipationDate: today,
        streakHistory: [today],
      };
      return;
    }

    const lastDate = streak.lastParticipationDate;

    // 오늘 이미 참여했으면 스킵
    if (lastDate && this.isSameDay(lastDate, today)) {
      return;
    }

    // 어제 참여했으면 스트릭 증가
    if (lastDate && this.isConsecutiveDay(lastDate, today)) {
      streak.currentStreak++;
    } else {
      // 스트릭 끊김 - 새로 시작
      streak.currentStreak = 1;
    }

    // 최장 스트릭 업데이트
    if (streak.currentStreak > streak.longestStreak) {
      streak.longestStreak = streak.currentStreak;
    }

    streak.lastParticipationDate = today;

    // 히스토리에 오늘 추가 (최근 30일만 유지)
    if (!streak.streakHistory.includes(today)) {
      streak.streakHistory.push(today);
      if (streak.streakHistory.length > 30) {
        streak.streakHistory = streak.streakHistory.slice(-30);
      }
    }
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

    // 스트릭 업데이트
    this.updateStreak();

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

    // 스트릭 업데이트
    this.updateStreak();

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

  // 스트릭 조회
  getStreak(): StreakData {
    // 기존 데이터에 streak이 없으면 기본값 반환
    if (!this.data.streak) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        lastParticipationDate: null,
        streakHistory: [],
      };
    }

    // 스트릭이 끊겼는지 확인 (어제 이전 마지막 참여)
    const today = this.getDateString();
    const yesterday = this.getDateString(new Date(Date.now() - 24 * 60 * 60 * 1000));
    const lastDate = this.data.streak.lastParticipationDate;

    if (lastDate && !this.isSameDay(lastDate, today) && !this.isSameDay(lastDate, yesterday)) {
      // 스트릭이 끊김 - currentStreak을 0으로 반환 (저장은 하지 않음)
      return {
        ...this.data.streak,
        currentStreak: 0,
      };
    }

    return this.data.streak;
  }

  // 오늘 참여 여부
  hasParticipatedToday(): boolean {
    const today = this.getDateString();
    return this.data.streak?.lastParticipationDate === today;
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
