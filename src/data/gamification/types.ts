// ============================================================================
// 게이미피케이션 타입 정의 (v2)
// ============================================================================

// ============================================================================
// 배지 기본 타입
// ============================================================================

// 배지 카테고리
export type BadgeCategory =
  | 'expert'      // 대상별 전문가 트랙
  | 'community'   // 커뮤니티 기여
  | 'duel'        // 퀴즈 대결
  | 'percentile'  // 비율 배지
  | 'streak'      // 연속 활동
  | 'special'     // 특별 달성
  | 'test'        // 테스트 (레거시 호환)
  | 'quiz'        // 퀴즈 (레거시 호환)
  | 'poll'        // 투표 (레거시 호환)
  | 'social';     // 소셜 (레거시 호환)

// 배지 등급 (5단계)
export type BadgeTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

// 배지 희귀도
export type BadgeRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';

// 전문가 트랙 대상
export type ExpertSubject =
  | 'cat' | 'dog' | 'rabbit' | 'hamster'  // 반려동물
  | 'fish' | 'bird' | 'reptile'           // 이색 반려동물
  | 'coffee' | 'plant';                    // 라이프스타일

// ============================================================================
// 배지 조건 타입
// ============================================================================

export interface BadgeCondition {
  type: 'count' | 'streak' | 'first' | 'special' | 'expert' | 'community' | 'duel' | 'percentile';
  target?: string;           // 대상 (cat, dog, quiz 등)
  value?: number;            // 필요 횟수/일수/비율
  tier?: BadgeTier;          // 전문가 트랙 등급
  description: string;
  // 전문가 트랙 조건
  requirements?: ExpertRequirements;
  // 커뮤니티 조건
  communityRequirements?: CommunityRequirements;
  // 대결 조건
  duelRequirements?: DuelRequirements;
}

// 전문가 트랙 요구사항
export interface ExpertRequirements {
  test?: boolean;            // 기본 테스트 완료
  detailTest?: boolean;      // 세부 테스트 완료 (품종 등)
  quizCorrect?: number;      // 퀴즈 정답 수
  quizAccuracy?: number;     // 퀴즈 정답률 (%)
  pollVotes?: number;        // 투표 참여 수
  streakDays?: number;       // 해당 대상 활동 스트릭
  communityLikes?: number;   // 커뮤니티 좋아요 받음
  answersAdopted?: number;   // 답변 채택 수
}

// 커뮤니티 요구사항
export interface CommunityRequirements {
  answersWritten?: number;   // 작성한 답변 수
  likesReceived?: number;    // 받은 좋아요 수
  answersAdopted?: number;   // 채택된 답변 수
  postsWritten?: number;     // 작성한 게시글 수
  commentsWritten?: number;  // 작성한 댓글 수
}

// 대결 요구사항
export interface DuelRequirements {
  duelsPlayed?: number;      // 참여한 대결 수
  wins?: number;             // 승리 횟수
  winStreak?: number;        // 연승 횟수
  winRate?: number;          // 승률 (%)
  comebacks?: number;        // 역전승 횟수
  perfectWins?: number;      // 완승 횟수
  speedRank?: number;        // 평균 응답시간 상위 %
}

// ============================================================================
// 배지 정의
// ============================================================================

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
  tier?: BadgeTier;          // 전문가/커뮤니티 트랙용
  subject?: ExpertSubject;   // 전문가 트랙 대상
  condition: BadgeCondition;
  points: number;
  // 비율 배지용
  percentile?: number;       // 상위 N%
  recalculatePeriod?: 'weekly' | 'monthly' | 'yearly';
}

// 사용자 배지 획득 기록
export interface UserBadge {
  badgeId: string;
  earnedAt: Date;
  progress?: number;         // 진행률 (0-100)
  tier?: BadgeTier;          // 획득한 등급
}

// ============================================================================
// 스트릭 & 활동 추적
// ============================================================================

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;  // YYYY-MM-DD
  streakStartDate: string;
}

export interface DailyActivity {
  date: string;              // YYYY-MM-DD
  testsCompleted: number;
  quizzesAnswered: number;
  quizzesCorrect: number;
  pollsVoted: number;
  // 추가 필드
  duelsPlayed?: number;
  duelsWon?: number;
  likesGiven?: number;
  likesReceived?: number;
  commentsWritten?: number;
}

// ============================================================================
// 사용자 게임 통계
// ============================================================================

export interface UserGameStats {
  // 테스트 관련
  testsCompleted: number;
  testsByType: Record<string, number>;

  // 퀴즈 관련
  quizzesAnswered: number;
  quizzesCorrect: number;
  quizCorrectStreak: number;
  quizzesByCategory: Record<string, { answered: number; correct: number }>;

  // 투표 관련
  pollsVoted: number;
  pollsByCategory: Record<string, number>;
  minorityVotes: number;

  // 스트릭
  streak: StreakInfo;

  // 배지
  badges: UserBadge[];

  // 포인트
  totalPoints: number;

  // 일일 활동 (최근 7일)
  dailyActivities: DailyActivity[];

  // ============================================
  // 신규 필드 (v2)
  // ============================================

  // 대상별 전문가 트랙 진행도
  expertProgress: Record<ExpertSubject, ExpertTrackProgress>;

  // 커뮤니티 활동
  community: CommunityStats;

  // 퀴즈 대결
  duel: DuelStats;
}

// 전문가 트랙 진행도
export interface ExpertTrackProgress {
  currentTier: BadgeTier | null;
  testsCompleted: string[];      // 완료한 테스트 ID 목록
  quizCorrect: number;
  quizTotal: number;
  pollVotes: number;
  streakDays: number;
  lastActiveDate: string;
}

// 커뮤니티 통계
export interface CommunityStats {
  answersWritten: number;
  answersAdopted: number;
  likesReceived: number;
  likesGiven: number;
  postsWritten: number;
  commentsWritten: number;
  thanksReceived: number;
}

// 대결 통계
export interface DuelStats {
  duelsPlayed: number;
  wins: number;
  losses: number;
  currentWinStreak: number;
  longestWinStreak: number;
  comebacks: number;
  perfectWins: number;
  totalResponseTime: number;   // 총 응답 시간 (ms)
  totalQuestions: number;      // 총 문제 수 (평균 계산용)
}

// ============================================================================
// 레벨 & 미션
// ============================================================================

export interface Level {
  level: number;
  name: string;
  emoji: string;
  minPoints: number;
  maxPoints: number;
}

export interface DailyMission {
  id: string;
  title: string;
  description: string;
  emoji: string;
  target: number;
  points: number;
  type: 'test' | 'quiz' | 'poll' | 'visit' | 'duel' | 'community';
}

// ============================================================================
// 배지 등급 색상 (UI용)
// ============================================================================

export const TIER_COLORS: Record<BadgeTier, string> = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
};

export const TIER_LABELS: Record<BadgeTier, string> = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
};

export const RARITY_COLORS: Record<BadgeRarity, string> = {
  common: '#9CA3AF',
  uncommon: '#10B981',
  rare: '#3B82F6',
  epic: '#8B5CF6',
  legendary: '#F59E0B',
};
