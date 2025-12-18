// ============================================================================
// 게이미피케이션 서비스
// ============================================================================

import type { UserGameStats, StreakInfo, DailyActivity } from '../data/gamification/types';
import type { SubjectKey } from '../data/types';
import { BADGES, getBadgeById } from '../data/gamification/badges';
import { getLevelByPoints, getPointsToNextLevel, DAILY_MISSIONS } from '../data/gamification/levels';
import { MAIN_TEST_KEYS } from '../data/config';

const STORAGE_KEY = 'chemi_game_stats';

// 기본 통계 생성 함수 (매번 새 객체 반환)
function createDefaultStats(): UserGameStats {
  return {
    testsCompleted: 0,
    testsByType: {},
    quizzesAnswered: 0,
    quizzesCorrect: 0,
    quizCorrectStreak: 0,
    quizzesByCategory: {},
    pollsVoted: 0,
    pollsByCategory: {},
    minorityVotes: 0,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: '',
      streakStartDate: '',
    },
    badges: [],
    totalPoints: 0,
    dailyActivities: [],
  };
}

class GamificationService {
  private stats: UserGameStats = createDefaultStats();

  constructor() {
    this.load();
  }

  // ============================================================================
  // 저장/로드
  // ============================================================================

  private load(): void {
    if (typeof window === 'undefined') return;

    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.stats = { ...createDefaultStats(), ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Failed to load game stats:', e);
    }
  }

  private save(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.stats));
    } catch (e) {
      console.error('Failed to save game stats:', e);
    }
  }

  // ============================================================================
  // 통계 조회
  // ============================================================================

  getStats(): UserGameStats {
    return { ...this.stats };
  }

  getLevel() {
    return getLevelByPoints(this.stats.totalPoints);
  }

  getLevelProgress() {
    return getPointsToNextLevel(this.stats.totalPoints);
  }

  getBadges() {
    return this.stats.badges.map(ub => ({
      ...ub,
      badge: getBadgeById(ub.badgeId),
    }));
  }

  getStreak(): StreakInfo {
    return { ...this.stats.streak };
  }

  // ============================================================================
  // 일일 활동 추적
  // ============================================================================

  // 읽기 전용: 상태 변경 없이 오늘 활동 조회
  private peekTodayActivity(): DailyActivity {
    const today = this.getToday();
    const activity = this.stats.dailyActivities.find(a => a.date === today);
    return activity || {
      date: today,
      testsCompleted: 0,
      quizzesAnswered: 0,
      quizzesCorrect: 0,
      pollsVoted: 0,
    };
  }

  // 수정용: 오늘 활동이 없으면 생성하고 반환 (save 필요)
  private getOrCreateTodayActivity(): DailyActivity {
    const today = this.getToday();
    let activity = this.stats.dailyActivities.find(a => a.date === today);

    if (!activity) {
      activity = {
        date: today,
        testsCompleted: 0,
        quizzesAnswered: 0,
        quizzesCorrect: 0,
        pollsVoted: 0,
      };
      this.stats.dailyActivities.push(activity);

      // 최근 7일만 유지
      this.stats.dailyActivities = this.stats.dailyActivities
        .filter(a => {
          const activityDate = new Date(a.date);
          const weekAgo = new Date();
          weekAgo.setDate(weekAgo.getDate() - 7);
          return activityDate >= weekAgo;
        })
        .sort((a, b) => b.date.localeCompare(a.date));
    }

    return activity;
  }

  getTodayStats(): DailyActivity {
    return { ...this.peekTodayActivity() };
  }

  // ============================================================================
  // 활동 기록
  // ============================================================================

  // 테스트 완료
  recordTestComplete(testType: SubjectKey | string): { points: number; newBadges: string[] } {
    this.stats.testsCompleted++;
    this.stats.testsByType[testType] = (this.stats.testsByType[testType] || 0) + 1;

    // 오늘 활동 업데이트
    const todayActivity = this.getOrCreateTodayActivity();
    todayActivity.testsCompleted++;

    const points = 20; // 테스트 완료 포인트
    this.stats.totalPoints += points;

    const newBadges = this.checkBadges();
    this.updateStreak();
    this.save();

    return { points, newBadges };
  }

  // 퀴즈 정답
  recordQuizAnswer(isCorrect: boolean, category?: string): { points: number; newBadges: string[] } {
    this.stats.quizzesAnswered++;
    if (isCorrect) {
      this.stats.quizzesCorrect++;
      this.stats.quizCorrectStreak++; // 연속 정답 증가
    } else {
      this.stats.quizCorrectStreak = 0; // 오답 시 연속 정답 리셋
    }

    // 카테고리별 추적
    if (category) {
      if (!this.stats.quizzesByCategory[category]) {
        this.stats.quizzesByCategory[category] = { answered: 0, correct: 0 };
      }
      this.stats.quizzesByCategory[category].answered++;
      if (isCorrect) {
        this.stats.quizzesByCategory[category].correct++;
      }
    }

    // 오늘 활동 업데이트
    const todayActivity = this.getOrCreateTodayActivity();
    todayActivity.quizzesAnswered++;
    if (isCorrect) {
      todayActivity.quizzesCorrect++;
    }

    const points = isCorrect ? 10 : 2; // 정답 10점, 오답 2점
    this.stats.totalPoints += points;

    const newBadges = this.checkBadges();
    this.updateStreak();
    this.save();

    return { points, newBadges };
  }

  // 투표 참여
  recordPollVote(options?: { category?: string; isMinority?: boolean }): { points: number; newBadges: string[] } {
    this.stats.pollsVoted++;

    // 카테고리별 추적
    if (options?.category) {
      this.stats.pollsByCategory[options.category] =
        (this.stats.pollsByCategory[options.category] || 0) + 1;
    }

    // 소수 의견 추적
    if (options?.isMinority) {
      this.stats.minorityVotes = (this.stats.minorityVotes || 0) + 1;
    }

    // 오늘 활동 업데이트
    const todayActivity = this.getOrCreateTodayActivity();
    todayActivity.pollsVoted++;

    const points = 5; // 투표 포인트
    this.stats.totalPoints += points;

    const newBadges = this.checkBadges();
    this.updateStreak();
    this.save();

    return { points, newBadges };
  }

  // 소수 의견 비율 조회
  getMinorityVoteRatio(): number {
    if (this.stats.pollsVoted === 0) return 0;
    return Math.round(((this.stats.minorityVotes || 0) / this.stats.pollsVoted) * 100);
  }

  // 카테고리별 투표 현황 조회
  getPollsByCategory(): Record<string, number> {
    return { ...this.stats.pollsByCategory };
  }

  // 방문 기록
  recordVisit(): { points: number; streakUpdated: boolean } {
    const today = this.getToday();
    const lastActivity = this.stats.streak.lastActivityDate;

    if (lastActivity === today) {
      return { points: 0, streakUpdated: false };
    }

    const points = 5; // 일일 방문 포인트
    this.stats.totalPoints += points;

    this.updateStreak();
    this.save();

    return { points, streakUpdated: true };
  }

  // ============================================================================
  // 스트릭 관리
  // ============================================================================

  private getToday(): string {
    // 로컬 시간대 기준 날짜 (YYYY-MM-DD)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private updateStreak(): void {
    const today = this.getToday();
    const { lastActivityDate, currentStreak, longestStreak } = this.stats.streak;

    if (lastActivityDate === today) {
      return; // 오늘 이미 활동함
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yYear = yesterday.getFullYear();
    const yMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
    const yDay = String(yesterday.getDate()).padStart(2, '0');
    const yesterdayStr = `${yYear}-${yMonth}-${yDay}`;

    if (lastActivityDate === yesterdayStr) {
      // 연속 유지
      this.stats.streak.currentStreak = currentStreak + 1;
      this.stats.streak.longestStreak = Math.max(longestStreak, currentStreak + 1);
    } else if (!lastActivityDate) {
      // 첫 활동
      this.stats.streak.currentStreak = 1;
      this.stats.streak.longestStreak = 1;
      this.stats.streak.streakStartDate = today;
    } else {
      // 스트릭 끊김
      this.stats.streak.currentStreak = 1;
      this.stats.streak.streakStartDate = today;
    }

    this.stats.streak.lastActivityDate = today;
  }

  // ============================================================================
  // 배지 체크
  // ============================================================================

  private checkBadges(): string[] {
    const newBadges: string[] = [];
    const earnedBadgeIds = this.stats.badges.map(b => b.badgeId);

    for (const badge of BADGES) {
      if (earnedBadgeIds.includes(badge.id)) continue;

      const earned = this.checkBadgeCondition(badge);
      if (earned) {
        this.stats.badges.push({
          badgeId: badge.id,
          earnedAt: new Date(),
        });
        this.stats.totalPoints += badge.points;
        newBadges.push(badge.id);
      }
    }

    return newBadges;
  }

  private checkBadgeCondition(badge: typeof BADGES[0]): boolean {
    const { condition } = badge;

    switch (badge.category) {
      case 'test':
        if (condition.type === 'first') {
          return this.stats.testsCompleted >= 1;
        }
        if (condition.type === 'count' && condition.value) {
          return this.stats.testsCompleted >= condition.value;
        }
        if (condition.type === 'special' && badge.id === 'all-rounder') {
          // 모든 메인 테스트 완료 체크
          return MAIN_TEST_KEYS.every(test => (this.stats.testsByType[test] || 0) > 0);
        }
        break;

      case 'quiz':
        if (condition.type === 'first') {
          return this.stats.quizzesCorrect >= 1;
        }
        if (condition.type === 'streak' && condition.value) {
          // 퀴즈 연속 정답 체크
          return this.stats.quizCorrectStreak >= condition.value;
        }
        if (condition.type === 'count' && condition.value) {
          if (condition.target) {
            // 카테고리별 정답 수 체크
            const categoryStats = this.stats.quizzesByCategory[condition.target];
            return categoryStats ? categoryStats.correct >= condition.value : false;
          }
          return this.stats.quizzesCorrect >= condition.value;
        }
        break;

      case 'poll':
        if (condition.type === 'first') {
          return this.stats.pollsVoted >= 1;
        }
        if (condition.type === 'count' && condition.value) {
          if (condition.target === 'minority') {
            // 소수 의견 횟수 체크
            return (this.stats.minorityVotes || 0) >= condition.value;
          }
          if (condition.target) {
            // 카테고리별 투표 수 체크
            return (this.stats.pollsByCategory[condition.target] || 0) >= condition.value;
          }
          return this.stats.pollsVoted >= condition.value;
        }
        if (condition.type === 'special' && badge.id === 'minority-voice') {
          // 소수 의견 비율 50% 이상 (10회 이상 투표 후)
          if (this.stats.pollsVoted < 10) return false;
          return this.getMinorityVoteRatio() >= 50;
        }
        break;

      case 'streak':
        if (condition.type === 'streak' && condition.value) {
          return this.stats.streak.currentStreak >= condition.value;
        }
        break;
    }

    return false;
  }

  // ============================================================================
  // 일일 미션
  // ============================================================================

  getDailyMissionStatus(): Array<{ mission: typeof DAILY_MISSIONS[0]; completed: boolean }> {
    const today = this.getToday();
    const visitedToday = this.stats.streak.lastActivityDate === today;
    const todayActivity = this.peekTodayActivity(); // 읽기 전용 - 상태 변경 없음

    return DAILY_MISSIONS.map(mission => {
      let completed = false;

      switch (mission.type) {
        case 'visit':
          completed = visitedToday;
          break;
        case 'quiz':
          // 오늘 푼 퀴즈 수 체크 (미션 목표값과 비교)
          completed = todayActivity.quizzesAnswered >= (mission.target || 1);
          break;
        case 'poll':
          // 오늘 참여한 투표 수 체크
          completed = todayActivity.pollsVoted >= (mission.target || 1);
          break;
        case 'test':
          // 오늘 완료한 테스트 수 체크
          completed = todayActivity.testsCompleted >= (mission.target || 1);
          break;
      }

      return { mission, completed };
    });
  }

  // ============================================================================
  // 리셋 (개발용)
  // ============================================================================

  reset(): void {
    this.stats = createDefaultStats();
    this.save();
  }
}

// 싱글톤 인스턴스 (클라이언트 전용)
let instance: GamificationService | null = null;

export function getGamificationService(): GamificationService | null {
  if (typeof window === 'undefined') return null;
  if (!instance) instance = new GamificationService();
  return instance;
}

// 하위 호환성을 위한 export (getGamificationService와 동일한 인스턴스 사용)
export const gamificationService = typeof window !== 'undefined'
  ? getGamificationService()
  : null;

export default gamificationService;
