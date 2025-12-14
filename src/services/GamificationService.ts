// ============================================================================
// 게이미피케이션 서비스
// ============================================================================

import type { UserGameStats, StreakInfo } from '../data/gamification/types';
import { BADGES, getBadgeById } from '../data/gamification/badges';
import { getLevelByPoints, getPointsToNextLevel, DAILY_MISSIONS } from '../data/gamification/levels';

const STORAGE_KEY = 'chemi_game_stats';

// 기본 통계 생성 함수 (매번 새 객체 반환)
function createDefaultStats(): UserGameStats {
  return {
    testsCompleted: 0,
    testsByType: {},
    quizzesAnswered: 0,
    quizzesCorrect: 0,
    pollsVoted: 0,
    streak: {
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: '',
      streakStartDate: '',
    },
    badges: [],
    totalPoints: 0,
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
  // 활동 기록
  // ============================================================================

  // 테스트 완료
  recordTestComplete(testType: string): { points: number; newBadges: string[] } {
    this.stats.testsCompleted++;
    this.stats.testsByType[testType] = (this.stats.testsByType[testType] || 0) + 1;

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
    }

    const points = isCorrect ? 10 : 2; // 정답 10점, 오답 2점
    this.stats.totalPoints += points;

    const newBadges = this.checkBadges();
    this.updateStreak();
    this.save();

    return { points, newBadges };
  }

  // 투표 참여
  recordPollVote(): { points: number; newBadges: string[] } {
    this.stats.pollsVoted++;

    const points = 5; // 투표 포인트
    this.stats.totalPoints += points;

    const newBadges = this.checkBadges();
    this.updateStreak();
    this.save();

    return { points, newBadges };
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
    return new Date().toISOString().split('T')[0];
  }

  private updateStreak(): void {
    const today = this.getToday();
    const { lastActivityDate, currentStreak, longestStreak, streakStartDate } = this.stats.streak;

    if (lastActivityDate === today) {
      return; // 오늘 이미 활동함
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

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
          // TODO: 모든 메인 테스트 완료 체크
          return Object.keys(this.stats.testsByType).length >= 10;
        }
        break;

      case 'quiz':
        if (condition.type === 'first') {
          return this.stats.quizzesCorrect >= 1;
        }
        if (condition.type === 'count' && condition.value) {
          if (condition.target) {
            // TODO: 카테고리별 정답 수 추적 필요
            return false;
          }
          return this.stats.quizzesCorrect >= condition.value;
        }
        break;

      case 'poll':
        if (condition.type === 'first') {
          return this.stats.pollsVoted >= 1;
        }
        if (condition.type === 'count' && condition.value) {
          return this.stats.pollsVoted >= condition.value;
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

    return DAILY_MISSIONS.map(mission => {
      let completed = false;

      switch (mission.type) {
        case 'visit':
          completed = visitedToday;
          break;
        case 'quiz':
          // TODO: 오늘 푼 퀴즈 수 추적 필요
          completed = false;
          break;
        case 'poll':
          // TODO: 오늘 참여한 투표 수 추적 필요
          completed = false;
          break;
        case 'test':
          // TODO: 오늘 완료한 테스트 수 추적 필요
          completed = false;
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

// 하위 호환성을 위한 export (SSR에서는 빈 객체 반환하지 않도록 주의)
export const gamificationService = typeof window !== 'undefined'
  ? new GamificationService()
  : (null as unknown as GamificationService);

export default gamificationService;
