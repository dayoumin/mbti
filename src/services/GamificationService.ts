// ============================================================================
// 게이미피케이션 서비스
// ============================================================================

import type { UserGameStats, StreakInfo, DailyActivity, ExpertSubject, ExpertTrackProgress, CommunityStats, DuelStats, Badge, BadgeTier } from '../data/gamification/types';
export type { UserGameStats };
import type { SubjectKey } from '../data/types';
import { BADGES, getBadgeById } from '../data/gamification/badges';
import { getLevelByPoints, getPointsToNextLevel, DAILY_MISSIONS } from '../data/gamification/levels';
import { STORAGE_KEYS } from '@/lib/storage';

// SubjectKey 또는 category에서 ExpertSubject 추출 (전문가 트랙 대상)
// 퀴즈/투표의 category는 SubjectKey에 없는 값('fish' 등)도 포함할 수 있음
const EXPERT_SUBJECT_MAP: Record<string, ExpertSubject> = {
  // 기본 테스트 (SubjectKey)
  cat: 'cat',
  dog: 'dog',
  rabbit: 'rabbit',
  hamster: 'hamster',
  plant: 'plant',
  coffee: 'coffee',
  // 이색 반려동물 (퀴즈/투표 category용 - SubjectKey에 없음)
  fish: 'fish',
  bird: 'bird',
  reptile: 'reptile',
  // 세부 테스트 → 상위 카테고리 매핑
  catBreed: 'cat',
  dogBreed: 'dog',
  smallPet: 'hamster',
  fishType: 'fish',
  birdType: 'bird',
  reptileType: 'reptile',
};

export function getExpertSubjectFromKey(key: SubjectKey | string): ExpertSubject | null {
  return EXPERT_SUBJECT_MAP[key as SubjectKey] || null;
}

const STORAGE_KEY = STORAGE_KEYS.GAME_STATS;

// 기본 전문가 트랙 진행도 생성
function createDefaultExpertProgress(): ExpertTrackProgress {
  return {
    currentTier: null,
    testsCompleted: [],
    quizCorrect: 0,
    quizTotal: 0,
    pollVotes: 0,
    streakDays: 0,
    lastActiveDate: '',
  };
}

// 기본 커뮤니티 통계 생성
function createDefaultCommunityStats(): CommunityStats {
  return {
    answersWritten: 0,
    answersAdopted: 0,
    likesReceived: 0,
    likesGiven: 0,
    postsWritten: 0,
    commentsWritten: 0,
    thanksReceived: 0,
  };
}

// 기본 대결 통계 생성
function createDefaultDuelStats(): DuelStats {
  return {
    duelsPlayed: 0,
    wins: 0,
    losses: 0,
    currentWinStreak: 0,
    longestWinStreak: 0,
    comebacks: 0,
    perfectWins: 0,
    totalResponseTime: 0,
    totalQuestions: 0,
  };
}

// 기본 통계 생성 함수 (매번 새 객체 반환)
function createDefaultStats(): UserGameStats {
  const expertSubjects: ExpertSubject[] = ['cat', 'dog', 'rabbit', 'hamster', 'fish', 'bird', 'reptile', 'coffee', 'plant'];
  const expertProgress = expertSubjects.reduce((acc, subject) => {
    acc[subject] = createDefaultExpertProgress();
    return acc;
  }, {} as Record<ExpertSubject, ExpertTrackProgress>);

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
    expertProgress,
    community: createDefaultCommunityStats(),
    duel: createDefaultDuelStats(),
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
        const parsed = JSON.parse(saved);
        const defaults = createDefaultStats();

        // 깊은 병합: 중첩 객체 필드들을 개별적으로 병합
        this.stats = {
          ...defaults,
          ...parsed,
          // streak 깊은 병합 (undefined 방지)
          streak: {
            ...defaults.streak,
            ...(parsed.streak || {}),
          },
          // expertProgress 깊은 병합
          expertProgress: this.mergeExpertProgress(defaults.expertProgress, parsed.expertProgress),
          // community 깊은 병합
          community: {
            ...defaults.community,
            ...(parsed.community || {}),
          },
          // duel 깊은 병합
          duel: {
            ...defaults.duel,
            ...(parsed.duel || {}),
          },
        };
      }
    } catch (e) {
      console.error('Failed to load game stats:', e);
    }
  }

  // expertProgress 깊은 병합 헬퍼
  private mergeExpertProgress(
    defaults: Record<ExpertSubject, ExpertTrackProgress>,
    saved?: Record<string, Partial<ExpertTrackProgress>>
  ): Record<ExpertSubject, ExpertTrackProgress> {
    if (!saved) return defaults;

    const result = { ...defaults };
    for (const key of Object.keys(defaults) as ExpertSubject[]) {
      if (saved[key]) {
        result[key] = {
          ...defaults[key],
          ...saved[key],
        };
      }
    }
    return result;
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

  // 테스트 완료 (subject: 전문가 트랙 대상 키)
  recordTestComplete(testType: SubjectKey | string, options?: { subject?: ExpertSubject; testId?: string }): { points: number; newBadges: string[] } {
    this.stats.testsCompleted++;
    this.stats.testsByType[testType] = (this.stats.testsByType[testType] || 0) + 1;

    // 전문가 트랙 진행도 업데이트 (subject 자동 추출)
    const expertSubject = options?.subject || getExpertSubjectFromKey(testType);
    if (expertSubject) {
      // testId: 세부 테스트인 경우 testType 사용, 아니면 'main'
      const testId = options?.testId || (testType !== expertSubject ? testType : 'main');
      this.updateExpertProgress(expertSubject, 'test', testId);
    }

    // 오늘 활동 업데이트
    const todayActivity = this.getOrCreateTodayActivity();
    todayActivity.testsCompleted++;

    const points = 20; // 테스트 완료 포인트
    this.stats.totalPoints += points;

    this.updateStreak();
    const newBadges = this.checkBadges(); // 스트릭 업데이트 후 배지 체크
    this.save();

    return { points, newBadges };
  }

  // 퀴즈 정답 (subject: 전문가 트랙 대상 키, category에서 자동 추출 가능)
  recordQuizAnswer(isCorrect: boolean, category?: string, subject?: ExpertSubject): { points: number; newBadges: string[] } {
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

    // 전문가 트랙 진행도 업데이트 (subject 자동 추출)
    const expertSubject = subject || (category ? getExpertSubjectFromKey(category) : null);
    if (expertSubject) {
      this.updateExpertProgress(expertSubject, 'quiz', undefined, isCorrect);
    }

    // 오늘 활동 업데이트
    const todayActivity = this.getOrCreateTodayActivity();
    todayActivity.quizzesAnswered++;
    if (isCorrect) {
      todayActivity.quizzesCorrect++;
    }

    const points = isCorrect ? 10 : 2; // 정답 10점, 오답 2점
    this.stats.totalPoints += points;

    this.updateStreak();
    const newBadges = this.checkBadges(); // 스트릭 업데이트 후 배지 체크
    this.save();

    return { points, newBadges };
  }

  // 투표 참여 (subject: 전문가 트랙 대상 키, category에서 자동 추출 가능)
  recordPollVote(options?: { category?: string; isMinority?: boolean; subject?: ExpertSubject }): { points: number; newBadges: string[] } {
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

    // 전문가 트랙 진행도 업데이트 (subject 자동 추출)
    const expertSubject = options?.subject || (options?.category ? getExpertSubjectFromKey(options.category) : null);
    if (expertSubject) {
      this.updateExpertProgress(expertSubject, 'poll');
    }

    // 오늘 활동 업데이트
    const todayActivity = this.getOrCreateTodayActivity();
    todayActivity.pollsVoted++;

    const points = 5; // 투표 포인트
    this.stats.totalPoints += points;

    this.updateStreak();
    const newBadges = this.checkBadges(); // 스트릭 업데이트 후 배지 체크
    this.save();

    return { points, newBadges };
  }

  // ============================================================================
  // 전문가 트랙 진행도 업데이트
  // ============================================================================

  private updateExpertProgress(
    subject: ExpertSubject,
    activityType: 'test' | 'quiz' | 'poll',
    testId?: string,
    isCorrect?: boolean
  ): void {
    const progress = this.stats.expertProgress[subject];
    if (!progress) return;

    const today = this.getToday();

    switch (activityType) {
      case 'test':
        if (testId && !progress.testsCompleted.includes(testId)) {
          progress.testsCompleted.push(testId);
        }
        break;

      case 'quiz':
        progress.quizTotal++;
        if (isCorrect) {
          progress.quizCorrect++;
        }
        break;

      case 'poll':
        progress.pollVotes++;
        break;
    }

    // 스트릭 업데이트
    if (progress.lastActiveDate === today) {
      // 오늘 이미 활동함 - 스트릭 유지
    } else if (progress.lastActiveDate && progress.lastActiveDate > today) {
      // 미래 날짜인 경우 무시 (기기 시간 변경/타임존 이동 대응)
    } else {
      const yesterdayStr = this.getYesterday();

      if (progress.lastActiveDate === yesterdayStr) {
        progress.streakDays++;
      } else if (!progress.lastActiveDate) {
        progress.streakDays = 1;
      } else {
        progress.streakDays = 1; // 스트릭 끊김
      }
      progress.lastActiveDate = today;
    }
  }

  // 전문가 트랙 진행도 조회
  getExpertProgress(subject: ExpertSubject): ExpertTrackProgress | null {
    return this.stats.expertProgress[subject] || null;
  }

  // 모든 전문가 트랙 진행도 조회
  getAllExpertProgress(): Record<ExpertSubject, ExpertTrackProgress> {
    return { ...this.stats.expertProgress };
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

  // 카테고리별 퀴즈 현황 조회
  getQuizzesByCategory(): Record<string, { answered: number; correct: number }> {
    return { ...this.stats.quizzesByCategory };
  }

  // 방문 기록
  recordVisit(): { points: number; streakUpdated: boolean; newBadges: string[] } {
    const today = this.getToday();
    const lastActivity = this.stats.streak.lastActivityDate;

    if (lastActivity === today) {
      return { points: 0, streakUpdated: false, newBadges: [] };
    }

    // 미래 날짜인 경우 무시 (기기 시간 변경/타임존 이동 대응)
    if (lastActivity && lastActivity > today) {
      return { points: 0, streakUpdated: false, newBadges: [] };
    }

    const points = 5; // 일일 방문 포인트
    this.stats.totalPoints += points;

    this.updateStreak();
    const newBadges = this.checkBadges(); // 스트릭 배지 체크 추가
    this.save();

    return { points, streakUpdated: true, newBadges };
  }

  // ============================================================================
  // 커뮤니티 활동 기록
  // ============================================================================

  // 답변 작성
  recordAnswerWrite(): { points: number; newBadges: string[] } {
    this.stats.community.answersWritten++;

    const points = 10;
    this.stats.totalPoints += points;

    this.updateStreak(); // 커뮤니티 활동도 스트릭에 반영
    const newBadges = this.checkBadges(); // 스트릭 업데이트 후 배지 체크
    this.save();

    return { points, newBadges };
  }

  // 답변 채택됨
  recordAnswerAdopted(): { points: number; newBadges: string[] } {
    this.stats.community.answersAdopted++;

    const points = 50; // 채택은 높은 점수
    this.stats.totalPoints += points;

    const newBadges = this.checkBadges();
    // 채택은 수동적 이벤트라 스트릭에 미반영
    this.save();

    return { points, newBadges };
  }

  // 좋아요 받음
  recordLikeReceived(): { points: number; newBadges: string[] } {
    this.stats.community.likesReceived++;

    const points = 5;
    this.stats.totalPoints += points;

    const newBadges = this.checkBadges();
    // 좋아요 받음은 수동적 이벤트라 스트릭에 미반영
    this.save();

    return { points, newBadges };
  }

  // 좋아요 줌
  recordLikeGiven(): { newBadges: string[] } {
    this.stats.community.likesGiven++;
    this.updateStreak(); // 능동적 활동이므로 스트릭에 반영
    const newBadges = this.checkBadges(); // 스트릭 배지 체크 추가
    this.save();
    return { newBadges };
  }

  // 게시글 작성
  recordPostWrite(): { points: number; newBadges: string[] } {
    this.stats.community.postsWritten++;

    const points = 5;
    this.stats.totalPoints += points;

    this.updateStreak(); // 커뮤니티 활동도 스트릭에 반영
    const newBadges = this.checkBadges(); // 스트릭 업데이트 후 배지 체크
    this.save();

    return { points, newBadges };
  }

  // 댓글 작성
  recordCommentWrite(): { points: number; newBadges: string[] } {
    this.stats.community.commentsWritten++;

    const points = 2;
    this.stats.totalPoints += points;

    this.updateStreak(); // 커뮤니티 활동도 스트릭에 반영
    const newBadges = this.checkBadges(); // 스트릭 업데이트 후 배지 체크
    this.save();

    return { points, newBadges };
  }

  // 커뮤니티 통계 조회
  getCommunityStats(): CommunityStats {
    return { ...this.stats.community };
  }

  // ============================================================================
  // 대결 기록
  // ============================================================================

  // 대결 결과 기록
  recordDuelResult(options: {
    won: boolean;
    isComeback?: boolean;
    isPerfect?: boolean;
    responseTimeMs?: number;
    questionsCount?: number;
  }): { points: number; newBadges: string[] } {
    const duel = this.stats.duel;
    duel.duelsPlayed++;

    if (options.won) {
      duel.wins++;
      duel.currentWinStreak++;
      duel.longestWinStreak = Math.max(duel.longestWinStreak, duel.currentWinStreak);

      if (options.isComeback) {
        duel.comebacks++;
      }
      if (options.isPerfect) {
        duel.perfectWins++;
      }
    } else {
      duel.losses++;
      duel.currentWinStreak = 0;
    }

    // 응답 시간 통계
    if (options.responseTimeMs) {
      duel.totalResponseTime += options.responseTimeMs;
    }
    if (options.questionsCount) {
      duel.totalQuestions += options.questionsCount;
    }

    const points = options.won ? 15 : 5; // 승리 15점, 패배 5점 (참여 보상)
    this.stats.totalPoints += points;

    this.updateStreak();
    const newBadges = this.checkBadges(); // 스트릭 업데이트 후 배지 체크
    this.save();

    return { points, newBadges };
  }

  // 대결 통계 조회
  getDuelStats(): DuelStats {
    return { ...this.stats.duel };
  }

  // 대결 승률 계산
  getDuelWinRate(): number {
    if (this.stats.duel.duelsPlayed === 0) return 0;
    return Math.round((this.stats.duel.wins / this.stats.duel.duelsPlayed) * 100);
  }

  // 평균 응답 시간 (ms)
  getAverageResponseTime(): number {
    if (this.stats.duel.totalQuestions === 0) return 0;
    return Math.round(this.stats.duel.totalResponseTime / this.stats.duel.totalQuestions);
  }

  // ============================================================================
  // 스트릭 관리
  // ============================================================================

  private getToday(): string {
    return this.formatDate(new Date());
  }

  private getYesterday(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return this.formatDate(yesterday);
  }

  private formatDate(date: Date): string {
    // 로컬 시간대 기준 날짜 (YYYY-MM-DD)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  private updateStreak(): void {
    const today = this.getToday();
    const { lastActivityDate, currentStreak, longestStreak } = this.stats.streak;

    if (lastActivityDate === today) {
      return; // 오늘 이미 활동함
    }

    // 미래 날짜인 경우 무시 (기기 시간 변경/타임존 이동 대응)
    if (lastActivityDate && lastActivityDate > today) {
      return;
    }

    const yesterdayStr = this.getYesterday();

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

  private checkBadgeCondition(badge: Badge): boolean {
    const { condition } = badge;

    switch (badge.category) {
      // ============================================
      // 레거시 카테고리 (기존 로직 유지)
      // ============================================
      case 'test':
        if (condition.type === 'first') {
          return this.stats.testsCompleted >= 1;
        }
        if (condition.type === 'count' && condition.value) {
          return this.stats.testsCompleted >= condition.value;
        }
        break;

      case 'quiz':
        if (condition.type === 'first') {
          return this.stats.quizzesCorrect >= 1;
        }
        if (condition.type === 'streak' && condition.value) {
          return this.stats.quizCorrectStreak >= condition.value;
        }
        if (condition.type === 'count' && condition.value) {
          if (condition.target) {
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
            return (this.stats.minorityVotes || 0) >= condition.value;
          }
          if (condition.target) {
            return (this.stats.pollsByCategory[condition.target] || 0) >= condition.value;
          }
          return this.stats.pollsVoted >= condition.value;
        }
        break;

      case 'social':
        // 소셜 배지는 나중에 공유 기능 구현 시 처리
        if (condition.type === 'first' && badge.id === 'first-share') {
          // TODO: 공유 횟수 추적 필요
          return false;
        }
        break;

      // ============================================
      // 스트릭 배지 (역대 최고 기록으로 달성 가능)
      // ============================================
      case 'streak':
        if (condition.type === 'streak' && condition.value) {
          return this.stats.streak.longestStreak >= condition.value;
        }
        break;

      // ============================================
      // 전문가 트랙 배지 (새로 추가)
      // ============================================
      case 'expert':
        return this.checkExpertBadgeCondition(badge);

      // ============================================
      // 커뮤니티 배지 (새로 추가)
      // ============================================
      case 'community':
        return this.checkCommunityBadgeCondition(badge);

      // ============================================
      // 대결 배지 (새로 추가)
      // ============================================
      case 'duel':
        return this.checkDuelBadgeCondition(badge);

      // ============================================
      // 비율 배지 (서버 계산 필요 - 클라이언트에서는 false)
      // ============================================
      case 'percentile':
        // 비율 배지는 서버에서 주기적으로 계산하여 부여
        // 클라이언트에서는 체크하지 않음
        return false;

      // ============================================
      // 특별 달성 배지
      // ============================================
      case 'special':
        return this.checkSpecialBadgeCondition(badge);
    }

    return false;
  }

  // ============================================================================
  // 전문가 트랙 배지 체크
  // ============================================================================

  private checkExpertBadgeCondition(badge: Badge): boolean {
    const { condition, subject, tier } = badge;
    if (!subject || !tier || !condition.requirements) return false;

    const progress = this.stats.expertProgress[subject];
    if (!progress) return false;

    const req = condition.requirements;
    const tierOrder: BadgeTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

    // 이전 등급이 있어야 다음 등급 획득 가능 (bronze 제외)
    if (tier !== 'bronze') {
      const prevTierIndex = tierOrder.indexOf(tier) - 1;
      if (prevTierIndex >= 0) {
        const prevTier = tierOrder[prevTierIndex];
        const hasPrevTier = this.stats.badges.some(
          b => b.badgeId === `expert-${subject}-${prevTier}`
        );
        if (!hasPrevTier) return false;
      }
    }

    // 기본 테스트 완료 체크 - 'main' 테스트 필수
    if (req.test && !progress.testsCompleted.includes('main')) return false;

    // 세부 테스트 체크 (silver 이상) - 'main' 외에 추가 테스트 1개 이상
    if (req.detailTest) {
      const detailTests = progress.testsCompleted.filter(t => t !== 'main');
      if (detailTests.length < 1) return false;
    }

    // 퀴즈 정답 수 체크
    if (req.quizCorrect && progress.quizCorrect < req.quizCorrect) return false;

    // 퀴즈 정답률 체크 (최소 10문제 이상 풀어야 유효)
    if (req.quizAccuracy) {
      const MIN_QUIZ_FOR_ACCURACY = 10;
      if (progress.quizTotal < MIN_QUIZ_FOR_ACCURACY) return false;
      const accuracy = (progress.quizCorrect / progress.quizTotal) * 100;
      if (accuracy < req.quizAccuracy) return false;
    }

    // 투표 참여 체크
    if (req.pollVotes && progress.pollVotes < req.pollVotes) return false;

    // 스트릭 체크
    if (req.streakDays && progress.streakDays < req.streakDays) return false;

    // 커뮤니티 좋아요 체크 (platinum 이상)
    if (req.communityLikes && this.stats.community.likesReceived < req.communityLikes) return false;

    // 답변 채택 체크 (diamond)
    if (req.answersAdopted && this.stats.community.answersAdopted < req.answersAdopted) return false;

    return true;
  }

  // ============================================================================
  // 커뮤니티 배지 체크
  // ============================================================================

  private checkCommunityBadgeCondition(badge: Badge): boolean {
    const { condition } = badge;
    const req = condition.communityRequirements;
    if (!req) return false;

    const community = this.stats.community;

    // 답변 작성 수 체크
    if (req.answersWritten && community.answersWritten < req.answersWritten) return false;

    // 받은 좋아요 체크
    if (req.likesReceived && community.likesReceived < req.likesReceived) return false;

    // 채택된 답변 체크
    if (req.answersAdopted && community.answersAdopted < req.answersAdopted) return false;

    // 게시글 수 체크
    if (req.postsWritten && community.postsWritten < req.postsWritten) return false;

    // 댓글 수 체크
    if (req.commentsWritten && community.commentsWritten < req.commentsWritten) return false;

    return true;
  }

  // ============================================================================
  // 대결 배지 체크
  // ============================================================================

  private checkDuelBadgeCondition(badge: Badge): boolean {
    const { condition } = badge;
    const req = condition.duelRequirements;
    if (!req) return false;

    const duel = this.stats.duel;

    // 대결 참여 횟수
    if (req.duelsPlayed && duel.duelsPlayed < req.duelsPlayed) return false;

    // 승리 횟수
    if (req.wins && duel.wins < req.wins) return false;

    // 연승 횟수 (longestWinStreak으로 체크 - 역대 최고 연승)
    if (req.winStreak && duel.longestWinStreak < req.winStreak) return false;

    // 승률 체크 (최소 대결 수 필요)
    if (req.winRate && req.duelsPlayed) {
      if (duel.duelsPlayed < req.duelsPlayed) return false;
      const winRate = (duel.wins / duel.duelsPlayed) * 100;
      if (winRate < req.winRate) return false;
    }

    // 역전승 횟수
    if (req.comebacks && duel.comebacks < req.comebacks) return false;

    // 완승 횟수
    if (req.perfectWins && duel.perfectWins < req.perfectWins) return false;

    return true;
  }

  // ============================================================================
  // 특별 달성 배지 체크
  // ============================================================================

  private checkSpecialBadgeCondition(badge: Badge): boolean {
    const { id } = badge;

    switch (id) {
      // 크로스 대상 배지
      case 'animal-explorer': {
        // 반려동물 4종 Bronze 달성
        const animals: ExpertSubject[] = ['cat', 'dog', 'rabbit', 'hamster'];
        return animals.every(animal =>
          this.stats.badges.some(b => b.badgeId === `expert-${animal}-bronze`)
        );
      }

      case 'animal-expert': {
        // 반려동물 4종 Silver 달성
        const animals: ExpertSubject[] = ['cat', 'dog', 'rabbit', 'hamster'];
        return animals.every(animal =>
          this.stats.badges.some(b => b.badgeId === `expert-${animal}-silver`)
        );
      }

      case 'zookeeper': {
        // 모든 동물 Gold 달성 (7종)
        const allAnimals: ExpertSubject[] = ['cat', 'dog', 'rabbit', 'hamster', 'fish', 'bird', 'reptile'];
        return allAnimals.every(animal =>
          this.stats.badges.some(b => b.badgeId === `expert-${animal}-gold`)
        );
      }

      case 'all-rounder': {
        // 모든 9개 대상 Silver 등급
        const allSubjects: ExpertSubject[] = ['cat', 'dog', 'rabbit', 'hamster', 'fish', 'bird', 'reptile', 'coffee', 'plant'];
        return allSubjects.every(subject =>
          this.stats.badges.some(b => b.badgeId === `expert-${subject}-silver`)
        );
      }

      case 'grandmaster': {
        // 3개 이상 Diamond 달성
        const allSubjects: ExpertSubject[] = ['cat', 'dog', 'rabbit', 'hamster', 'fish', 'bird', 'reptile', 'coffee', 'plant'];
        const diamondCount = allSubjects.filter(subject =>
          this.stats.badges.some(b => b.badgeId === `expert-${subject}-diamond`)
        ).length;
        return diamondCount >= 3;
      }

      // 바이럴/인플루언서 배지
      case 'viral-post':
        // 단일 게시글 좋아요 50개 - 서버에서 처리 필요
        return false;

      case 'influencer':
        // 총 좋아요 500개 받음
        return this.stats.community.likesReceived >= 500;

      // 얼리 어답터
      case 'early-adopter':
        // 2025년 가입자 - 가입일 체크 필요 (현재는 false)
        // TODO: 가입일 추적 시스템 추가 시 구현
        return false;

      default:
        return false;
    }
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
