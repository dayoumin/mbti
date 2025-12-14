// ============================================================================
// 게이미피케이션 타입 정의
// ============================================================================

// 배지 카테고리
export type BadgeCategory = 'test' | 'quiz' | 'poll' | 'streak' | 'social' | 'special';

// 배지 등급
export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

// 배지 정의
export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  condition: BadgeCondition;
  points: number;
}

// 배지 획득 조건
export interface BadgeCondition {
  type: 'count' | 'streak' | 'first' | 'special';
  target?: string; // 특정 테스트/퀴즈 등
  value?: number; // 필요 횟수/일수
  description: string;
}

// 사용자 배지 획득 기록
export interface UserBadge {
  badgeId: string;
  earnedAt: Date;
  progress?: number; // 진행률 (0-100)
}

// 스트릭 정보
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string; // YYYY-MM-DD
  streakStartDate: string;
}

// 사용자 게임 통계
export interface UserGameStats {
  // 테스트 관련
  testsCompleted: number;
  testsByType: Record<string, number>;

  // 퀴즈 관련
  quizzesAnswered: number;
  quizzesCorrect: number;

  // 투표 관련
  pollsVoted: number;

  // 스트릭
  streak: StreakInfo;

  // 배지
  badges: UserBadge[];

  // 포인트
  totalPoints: number;
}

// 레벨 정의
export interface Level {
  level: number;
  name: string;
  emoji: string;
  minPoints: number;
  maxPoints: number;
}

// 일일 미션
export interface DailyMission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  points: number;
  type: 'test' | 'quiz' | 'poll' | 'visit';
}
