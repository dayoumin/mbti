// ============================================================================
// 배지 시스템 재설계 계획 (Badge System v2)
// ============================================================================
// 목적: 전문가 성장 느낌 + 장기 목표 + 커뮤니티 기여 반영
// 참고: Duolingo, Stack Overflow, Reddit, Spotify Wrapped, QuizDuel

// ============================================================================
// 설계 원칙
// ============================================================================

export const DESIGN_PRINCIPLES = {
  // 1. 5단계 성장 시스템
  growthLevels: {
    description: '4단계 → 5단계로 확장하여 더 세밀한 성장 느낌',
    levels: ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond'],
    colors: {
      bronze: '#CD7F32',
      silver: '#C0C0C0',
      gold: '#FFD700',
      platinum: '#E5E4E2',
      diamond: '#B9F2FF',
    },
  },

  // 2. 장기 목표 (쉽게 끝나지 않음)
  timeToAchieve: {
    bronze: '1일',
    silver: '1~2주',
    gold: '1~2개월',
    platinum: '2~3개월',
    diamond: '6개월+',
  },

  // 3. 받는 행동이 더 가치 있음
  actionWeights: {
    '좋아요 클릭': 1,
    '좋아요 받음': 5,
    '댓글 작성': 2,
    '내 댓글에 좋아요': 8,
    '답변 작성': 5,
    '답변 채택됨': 50,
    '감사 받음': 15,
    '게시글 작성': 3,
    '게시글 인기 (좋아요 10+)': 30,
    '게시글 베스트 선정': 100,
  },
};

// ============================================================================
// 대상별 전문가 트랙 (5단계)
// ============================================================================

export type ExpertTrackSubject =
  | 'cat' | 'dog' | 'rabbit' | 'hamster'  // 반려동물
  | 'fish' | 'bird' | 'reptile'           // 이색 반려동물
  | 'coffee' | 'plant';                    // 라이프스타일

export interface ExpertTrackLevel {
  level: 1 | 2 | 3 | 4 | 5;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  requirements: {
    test?: boolean;           // 기본 테스트 완료
    detailTest?: boolean;     // 세부 테스트 완료 (품종 등)
    quizCorrect?: number;     // 퀴즈 정답 수
    quizAccuracy?: number;    // 퀴즈 정답률 (%)
    pollVotes?: number;       // 투표 참여 수
    streakDays?: number;      // 해당 대상 활동 스트릭
    communityLikes?: number;  // 커뮤니티 좋아요 받음
    answersAdopted?: number;  // 답변 채택 수
  };
  estimatedTime: string;
  acquisitionRate: string;    // 예상 획득률
}

// 고양이 전문가 트랙 (대표 예시)
export const CAT_EXPERT_TRACK: ExpertTrackLevel[] = [
  {
    level: 1,
    tier: 'bronze',
    requirements: { test: true, quizCorrect: 5 },
    estimatedTime: '1일',
    acquisitionRate: '60%',
  },
  {
    level: 2,
    tier: 'silver',
    requirements: { test: true, detailTest: true, quizCorrect: 20, quizAccuracy: 70, pollVotes: 10 },
    estimatedTime: '2주',
    acquisitionRate: '25%',
  },
  {
    level: 3,
    tier: 'gold',
    requirements: { test: true, detailTest: true, quizCorrect: 50, quizAccuracy: 80, pollVotes: 30, streakDays: 14 },
    estimatedTime: '1~2개월',
    acquisitionRate: '10%',
  },
  {
    level: 4,
    tier: 'platinum',
    requirements: { test: true, detailTest: true, quizCorrect: 100, quizAccuracy: 85, pollVotes: 50, streakDays: 30, communityLikes: 30 },
    estimatedTime: '2~3개월',
    acquisitionRate: '3%',
  },
  {
    level: 5,
    tier: 'diamond',
    requirements: { test: true, detailTest: true, quizCorrect: 200, quizAccuracy: 90, pollVotes: 100, streakDays: 60, communityLikes: 100, answersAdopted: 10 },
    estimatedTime: '6개월+',
    acquisitionRate: '0.5%',
  },
];

// 대상별 배지 명칭
export const EXPERT_BADGE_NAMES: Record<ExpertTrackSubject, { [key in 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond']: { name: string; emoji: string } }> = {
  cat: {
    bronze: { name: '고양이 입문자', emoji: '🐱' },
    silver: { name: '고양이 관찰자', emoji: '😺' },
    gold: { name: '고양이 심리분석가', emoji: '😻' },
    platinum: { name: '고양이 행동전문가', emoji: '🐈' },
    diamond: { name: '고양이 마스터', emoji: '👑🐱' },
  },
  dog: {
    bronze: { name: '강아지 입문자', emoji: '🐕' },
    silver: { name: '강아지 관찰자', emoji: '🦮' },
    gold: { name: '강아지 심리분석가', emoji: '🐕‍🦺' },
    platinum: { name: '강아지 행동전문가', emoji: '🐩' },
    diamond: { name: '강아지 마스터', emoji: '👑🐕' },
  },
  rabbit: {
    bronze: { name: '토끼 입문자', emoji: '🐰' },
    silver: { name: '토끼 관찰자', emoji: '🐇' },
    gold: { name: '토끼 심리분석가', emoji: '🐰' },
    platinum: { name: '토끼 행동전문가', emoji: '🐇' },
    diamond: { name: '토끼 마스터', emoji: '👑🐰' },
  },
  hamster: {
    bronze: { name: '햄스터 입문자', emoji: '🐹' },
    silver: { name: '햄스터 관찰자', emoji: '🐹' },
    gold: { name: '햄스터 심리분석가', emoji: '🐹' },
    platinum: { name: '햄스터 행동전문가', emoji: '🐹' },
    diamond: { name: '햄스터 마스터', emoji: '👑🐹' },
  },
  fish: {
    bronze: { name: '아쿠아리스트 입문', emoji: '🐠' },
    silver: { name: '수조 관리자', emoji: '🐟' },
    gold: { name: '수생생물 분석가', emoji: '🐡' },
    platinum: { name: '수생생물 전문가', emoji: '🦈' },
    diamond: { name: '아쿠아 마스터', emoji: '👑🐠' },
  },
  bird: {
    bronze: { name: '버디 입문자', emoji: '🐦' },
    silver: { name: '조류 관찰자', emoji: '🦜' },
    gold: { name: '조류 심리분석가', emoji: '🦅' },
    platinum: { name: '조류 행동전문가', emoji: '🦉' },
    diamond: { name: '버디 마스터', emoji: '👑🦜' },
  },
  reptile: {
    bronze: { name: '파충류 입문자', emoji: '🦎' },
    silver: { name: '파충류 관찰자', emoji: '🐍' },
    gold: { name: '파충류 분석가', emoji: '🐊' },
    platinum: { name: '파충류 전문가', emoji: '🦎' },
    diamond: { name: '렙타일 마스터', emoji: '👑🦎' },
  },
  coffee: {
    bronze: { name: '커피 입문자', emoji: '☕' },
    silver: { name: '바리스타 수습', emoji: '☕' },
    gold: { name: '커피 감별사', emoji: '☕' },
    platinum: { name: '커피 소믈리에', emoji: '☕' },
    diamond: { name: '커피 마스터', emoji: '👑☕' },
  },
  plant: {
    bronze: { name: '식물 입문자', emoji: '🌱' },
    silver: { name: '가드너 수습', emoji: '🪴' },
    gold: { name: '플랜테리어 분석가', emoji: '🌿' },
    platinum: { name: '식물 전문가', emoji: '🌳' },
    diamond: { name: '보태니스트', emoji: '👑🌱' },
  },
};

// ============================================================================
// 커뮤니티 기여 배지 (5단계)
// ============================================================================

export const COMMUNITY_CONTRIBUTION_TRACK = [
  {
    level: 1,
    tier: 'bronze',
    name: '첫 도움',
    emoji: '🤝',
    description: '첫 답변 작성',
    requirements: { answersWritten: 1 },
    estimatedTime: '1일',
  },
  {
    level: 2,
    tier: 'silver',
    name: '도우미',
    emoji: '💬',
    description: '답변 좋아요 10개 받음',
    requirements: { likesReceived: 10 },
    estimatedTime: '1주',
  },
  {
    level: 3,
    tier: 'gold',
    name: '멘토',
    emoji: '🎓',
    description: '답변 채택 5회',
    requirements: { answersAdopted: 5, likesReceived: 30 },
    estimatedTime: '1개월',
  },
  {
    level: 4,
    tier: 'platinum',
    name: '커뮤니티 히어로',
    emoji: '🦸',
    description: '답변 채택 30회 + 좋아요 100개',
    requirements: { answersAdopted: 30, likesReceived: 100 },
    estimatedTime: '3개월',
  },
  {
    level: 5,
    tier: 'diamond',
    name: '전설의 조언자',
    emoji: '👑',
    description: '채택 100회 + 좋아요 500개',
    requirements: { answersAdopted: 100, likesReceived: 500 },
    estimatedTime: '1년+',
  },
];

// ============================================================================
// 비율 배지 (Spotify Wrapped 스타일)
// ============================================================================

export interface PercentileBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  percentile: number;      // 상위 N%
  category: 'activity' | 'quiz' | 'subject';
  subject?: ExpertTrackSubject;
  rarity: 'rare' | 'epic' | 'legendary';
  recalculatePeriod: 'weekly' | 'monthly' | 'yearly';
}

export const PERCENTILE_BADGES: PercentileBadge[] = [
  // 대상별 활동량 비율 배지
  { id: 'cat-top-10', name: '고양이 Top 10%', emoji: '🐱🔝', description: '고양이 활동량 상위 10%', percentile: 10, category: 'subject', subject: 'cat', rarity: 'rare', recalculatePeriod: 'monthly' },
  { id: 'cat-top-1', name: '고양이 Top 1%', emoji: '🐱👑', description: '고양이 활동량 상위 1%', percentile: 1, category: 'subject', subject: 'cat', rarity: 'legendary', recalculatePeriod: 'monthly' },
  { id: 'dog-top-10', name: '강아지 Top 10%', emoji: '🐕🔝', description: '강아지 활동량 상위 10%', percentile: 10, category: 'subject', subject: 'dog', rarity: 'rare', recalculatePeriod: 'monthly' },
  { id: 'dog-top-1', name: '강아지 Top 1%', emoji: '🐕👑', description: '강아지 활동량 상위 1%', percentile: 1, category: 'subject', subject: 'dog', rarity: 'legendary', recalculatePeriod: 'monthly' },

  // 퀴즈 정답률 비율 배지
  { id: 'quiz-top-10', name: '퀴즈 천재 Top 10%', emoji: '🧠🔝', description: '퀴즈 정답률 상위 10%', percentile: 10, category: 'quiz', rarity: 'rare', recalculatePeriod: 'monthly' },
  { id: 'quiz-top-5', name: '퀴즈 영재 Top 5%', emoji: '🧠⭐', description: '퀴즈 정답률 상위 5%', percentile: 5, category: 'quiz', rarity: 'epic', recalculatePeriod: 'monthly' },
  { id: 'quiz-top-1', name: '퀴즈 전설 Top 1%', emoji: '🧠👑', description: '퀴즈 정답률 상위 1%', percentile: 1, category: 'quiz', rarity: 'legendary', recalculatePeriod: 'monthly' },

  // 전체 활동량 비율 배지
  { id: 'activity-top-10', name: '활동왕 Top 10%', emoji: '🔥🔝', description: '월간 활동량 상위 10%', percentile: 10, category: 'activity', rarity: 'rare', recalculatePeriod: 'monthly' },
  { id: 'activity-top-3', name: '이달의 스타 Top 3%', emoji: '⭐🔝', description: '월간 활동량 상위 3%', percentile: 3, category: 'activity', rarity: 'epic', recalculatePeriod: 'monthly' },
  { id: 'activity-top-1', name: '이달의 MVP', emoji: '🏆👑', description: '월간 활동량 상위 1%', percentile: 1, category: 'activity', rarity: 'legendary', recalculatePeriod: 'monthly' },
];

// ============================================================================
// 퀴즈 대결 배지
// ============================================================================

export interface DuelBadge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  requirements: {
    duelsPlayed?: number;
    wins?: number;
    winStreak?: number;
    winRate?: number;        // 승률 (%)
    comebacks?: number;      // 역전승 횟수
    perfectWins?: number;    // 완승 (전문제 정답) 횟수
    speedRank?: number;      // 평균 응답시간 상위 %
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export const DUEL_BADGES: DuelBadge[] = [
  // 참여 관련
  { id: 'duel-first', name: '첫 대결', emoji: '⚔️', description: '퀴즈 대결 첫 참여', requirements: { duelsPlayed: 1 }, rarity: 'common' },
  { id: 'duel-10', name: '대결 애호가', emoji: '🎮', description: '10회 대결 참여', requirements: { duelsPlayed: 10 }, rarity: 'common' },
  { id: 'duel-50', name: '대결 마니아', emoji: '🎯', description: '50회 대결 참여', requirements: { duelsPlayed: 50 }, rarity: 'rare' },
  { id: 'duel-100', name: '대결 중독자', emoji: '💎', description: '100회 대결 참여', requirements: { duelsPlayed: 100 }, rarity: 'epic' },

  // 승리 관련
  { id: 'win-first', name: '첫 승리', emoji: '🏅', description: '첫 대결 승리', requirements: { wins: 1 }, rarity: 'common' },
  { id: 'win-10', name: '대결 고수', emoji: '🥉', description: '10승 달성', requirements: { wins: 10 }, rarity: 'rare' },
  { id: 'win-50', name: '대결 달인', emoji: '🥈', description: '50승 달성', requirements: { wins: 50 }, rarity: 'epic' },
  { id: 'win-100', name: '퀴즈 챔피언', emoji: '🥇', description: '100승 달성', requirements: { wins: 100 }, rarity: 'epic' },
  { id: 'win-500', name: '퀴즈 레전드', emoji: '👑', description: '500승 달성', requirements: { wins: 500 }, rarity: 'legendary' },

  // 연승 관련
  { id: 'streak-3', name: '3연승', emoji: '🔥', description: '3연승 달성', requirements: { winStreak: 3 }, rarity: 'common' },
  { id: 'streak-5', name: '무패 행진', emoji: '🔥🔥', description: '5연승 달성', requirements: { winStreak: 5 }, rarity: 'rare' },
  { id: 'streak-10', name: '연승 폭주', emoji: '🔥🔥🔥', description: '10연승 달성', requirements: { winStreak: 10 }, rarity: 'epic' },
  { id: 'streak-20', name: '무적', emoji: '💫', description: '20연승 달성', requirements: { winStreak: 20 }, rarity: 'legendary' },

  // 승률 관련 (최소 30대결 후)
  { id: 'winrate-60', name: '승률 마스터', emoji: '📊', description: '승률 60% 이상 (30대결+)', requirements: { duelsPlayed: 30, winRate: 60 }, rarity: 'rare' },
  { id: 'winrate-70', name: '승률 전문가', emoji: '📈', description: '승률 70% 이상 (50대결+)', requirements: { duelsPlayed: 50, winRate: 70 }, rarity: 'epic' },
  { id: 'winrate-80', name: '승률 레전드', emoji: '👑📊', description: '승률 80% 이상 (100대결+)', requirements: { duelsPlayed: 100, winRate: 80 }, rarity: 'legendary' },

  // 특수 상황
  { id: 'comeback-king', name: '역전의 명수', emoji: '🔄', description: '역전승 10회', requirements: { comebacks: 10 }, rarity: 'epic' },
  { id: 'perfect-win', name: '완벽한 승리', emoji: '💯', description: '완승 (전문제 정답) 5회', requirements: { perfectWins: 5 }, rarity: 'rare' },
  { id: 'speed-demon', name: '스피드 마스터', emoji: '⚡', description: '평균 응답시간 상위 10%', requirements: { speedRank: 10 }, rarity: 'epic' },
];

// ============================================================================
// 특별 달성 배지
// ============================================================================

export const SPECIAL_ACHIEVEMENT_BADGES = [
  // 크로스 대상 배지
  { id: 'animal-explorer', name: '동물 탐험가', emoji: '🧭', description: '반려동물 4종 Bronze 달성', rarity: 'rare' },
  { id: 'animal-expert', name: '동물 전문가', emoji: '📚', description: '반려동물 4종 Silver 달성', rarity: 'epic' },
  { id: 'zookeeper', name: '동물원장', emoji: '🦁', description: '모든 동물 Gold 달성', rarity: 'legendary' },
  { id: 'all-rounder', name: '올라운더', emoji: '🌟', description: '모든 카테고리 Silver 달성', rarity: 'legendary' },
  { id: 'grandmaster', name: '그랜드마스터', emoji: '👑👑', description: '3개 이상 Diamond 달성', rarity: 'legendary' },

  // 스트릭 배지
  { id: 'streak-7', name: '일주일 연속', emoji: '🔥', description: '7일 연속 활동', rarity: 'common' },
  { id: 'streak-30', name: '한 달 연속', emoji: '💪', description: '30일 연속 활동', rarity: 'rare' },
  { id: 'streak-100', name: '100일 연속', emoji: '🏅', description: '100일 연속 활동', rarity: 'epic' },
  { id: 'streak-365', name: '1년 연속', emoji: '👑🔥', description: '365일 연속 활동', rarity: 'legendary' },

  // 소셜 배지
  { id: 'first-share', name: '공유 시작', emoji: '📤', description: '첫 결과 공유', rarity: 'common' },
  { id: 'viral-post', name: '바이럴', emoji: '🌊', description: '게시글 좋아요 50개', rarity: 'epic' },
  { id: 'influencer', name: '인플루언서', emoji: '📢', description: '총 좋아요 받음 500개', rarity: 'legendary' },

  // 시즌/이벤트 (예시)
  { id: 'early-adopter', name: '얼리 어답터', emoji: '🌱', description: '2025년 가입자', rarity: 'legendary' },
  { id: 'christmas-2025', name: '크리스마스 2025', emoji: '🎄', description: '2025 크리스마스 이벤트 참여', rarity: 'rare' },
];

// ============================================================================
// 배지 총 개수 요약
// ============================================================================

export const BADGE_SUMMARY = {
  expertTracks: {
    subjects: 9,           // 고양이, 강아지, 토끼, 햄스터, 관상어, 새, 파충류, 커피, 식물
    levelsPerSubject: 5,
    total: 45,             // 9 × 5 = 45
  },
  communityContribution: 5,
  percentileBadges: 10,
  duelBadges: 19,
  specialAchievements: 14,
  grandTotal: 93,          // 45 + 5 + 10 + 19 + 14 = 93
};

// ============================================================================
// 구현 우선순위
// ============================================================================

export const IMPLEMENTATION_PRIORITY = [
  {
    phase: 1,
    name: '기본 구조',
    items: [
      '배지 타입 정의 (types.ts 업데이트)',
      '대상별 전문가 트랙 배지 데이터',
      '커뮤니티 기여 배지 데이터',
      'GamificationService 체크 로직 업데이트',
    ],
    effort: '2~3일',
  },
  {
    phase: 2,
    name: '퀴즈 대결',
    items: [
      '퀴즈 대결 기능 구현',
      '대결 배지 체크 로직',
      '대결 히스토리 저장',
    ],
    effort: '3~5일',
  },
  {
    phase: 3,
    name: '비율 배지',
    items: [
      '전체 사용자 통계 집계 (서버)',
      '비율 계산 로직',
      '월간/주간 재계산 스케줄러',
    ],
    effort: '3~5일',
  },
  {
    phase: 4,
    name: 'UI 개선',
    items: [
      '프로필 배지 표시 개선',
      '배지 획득 알림 개선',
      '배지 컬렉션 뷰',
    ],
    effort: '2~3일',
  },
];
