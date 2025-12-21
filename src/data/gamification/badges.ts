// ============================================================================
// 배지 정의 (v2) - 총 93개
// ============================================================================

import type { Badge, ExpertSubject, BadgeTier } from './types';

// ============================================================================
// 전문가 트랙 배지 생성 헬퍼
// ============================================================================

interface ExpertBadgeNames {
  bronze: { name: string; emoji: string };
  silver: { name: string; emoji: string };
  gold: { name: string; emoji: string };
  platinum: { name: string; emoji: string };
  diamond: { name: string; emoji: string };
}

const EXPERT_BADGE_NAMES: Record<ExpertSubject, ExpertBadgeNames> = {
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

// 등급별 요구사항
const TIER_REQUIREMENTS: Record<BadgeTier, {
  quizCorrect: number;
  quizAccuracy: number;
  pollVotes: number;
  streakDays: number;
  communityLikes: number;
  answersAdopted: number;
  points: number;
  rarity: Badge['rarity'];
}> = {
  bronze: { quizCorrect: 5, quizAccuracy: 0, pollVotes: 0, streakDays: 0, communityLikes: 0, answersAdopted: 0, points: 20, rarity: 'common' },
  silver: { quizCorrect: 20, quizAccuracy: 70, pollVotes: 10, streakDays: 0, communityLikes: 0, answersAdopted: 0, points: 50, rarity: 'uncommon' },
  gold: { quizCorrect: 50, quizAccuracy: 80, pollVotes: 30, streakDays: 14, communityLikes: 0, answersAdopted: 0, points: 100, rarity: 'rare' },
  platinum: { quizCorrect: 100, quizAccuracy: 85, pollVotes: 50, streakDays: 30, communityLikes: 30, answersAdopted: 0, points: 200, rarity: 'epic' },
  diamond: { quizCorrect: 200, quizAccuracy: 90, pollVotes: 100, streakDays: 60, communityLikes: 100, answersAdopted: 10, points: 500, rarity: 'legendary' },
};

// 전문가 트랙 배지 생성
function generateExpertBadges(): Badge[] {
  const badges: Badge[] = [];
  const subjects = Object.keys(EXPERT_BADGE_NAMES) as ExpertSubject[];
  const tiers: BadgeTier[] = ['bronze', 'silver', 'gold', 'platinum', 'diamond'];

  for (const subject of subjects) {
    for (const tier of tiers) {
      const names = EXPERT_BADGE_NAMES[subject][tier];
      const req = TIER_REQUIREMENTS[tier];

      badges.push({
        id: `expert-${subject}-${tier}`,
        name: names.name,
        description: `${subject} 전문가 트랙 ${tier} 등급`,
        emoji: names.emoji,
        category: 'expert',
        rarity: req.rarity,
        tier,
        subject,
        condition: {
          type: 'expert',
          target: subject,
          tier,
          description: `${tier} 등급 달성`,
          requirements: {
            test: true,
            detailTest: tier !== 'bronze',
            quizCorrect: req.quizCorrect,
            quizAccuracy: req.quizAccuracy,
            pollVotes: req.pollVotes,
            streakDays: req.streakDays,
            communityLikes: req.communityLikes,
            answersAdopted: req.answersAdopted,
          },
        },
        points: req.points,
      });
    }
  }

  return badges;
}

// ============================================================================
// 커뮤니티 기여 배지 (5단계)
// ============================================================================

const COMMUNITY_BADGES: Badge[] = [
  {
    id: 'community-bronze',
    name: '첫 도움',
    description: '첫 답변 작성',
    emoji: '🤝',
    category: 'community',
    rarity: 'common',
    tier: 'bronze',
    condition: {
      type: 'community',
      tier: 'bronze',
      description: '답변 1개 작성',
      communityRequirements: { answersWritten: 1 },
    },
    points: 10,
  },
  {
    id: 'community-silver',
    name: '도우미',
    description: '답변 좋아요 10개 받음',
    emoji: '💬',
    category: 'community',
    rarity: 'uncommon',
    tier: 'silver',
    condition: {
      type: 'community',
      tier: 'silver',
      description: '좋아요 10개 받음',
      communityRequirements: { likesReceived: 10 },
    },
    points: 50,
  },
  {
    id: 'community-gold',
    name: '멘토',
    description: '답변 채택 5회',
    emoji: '🎓',
    category: 'community',
    rarity: 'rare',
    tier: 'gold',
    condition: {
      type: 'community',
      tier: 'gold',
      description: '채택 5회 + 좋아요 30개',
      communityRequirements: { answersAdopted: 5, likesReceived: 30 },
    },
    points: 100,
  },
  {
    id: 'community-platinum',
    name: '커뮤니티 히어로',
    description: '답변 채택 30회 + 좋아요 100개',
    emoji: '🦸',
    category: 'community',
    rarity: 'epic',
    tier: 'platinum',
    condition: {
      type: 'community',
      tier: 'platinum',
      description: '채택 30회 + 좋아요 100개',
      communityRequirements: { answersAdopted: 30, likesReceived: 100 },
    },
    points: 300,
  },
  {
    id: 'community-diamond',
    name: '전설의 조언자',
    description: '채택 100회 + 좋아요 500개',
    emoji: '👑',
    category: 'community',
    rarity: 'legendary',
    tier: 'diamond',
    condition: {
      type: 'community',
      tier: 'diamond',
      description: '채택 100회 + 좋아요 500개',
      communityRequirements: { answersAdopted: 100, likesReceived: 500 },
    },
    points: 1000,
  },
];

// ============================================================================
// 비율 배지 (Spotify Wrapped 스타일)
// ============================================================================

const PERCENTILE_BADGES: Badge[] = [
  // 대상별 활동량
  { id: 'cat-top-10', name: '고양이 Top 10%', description: '고양이 활동량 상위 10%', emoji: '🐱🔝', category: 'percentile', rarity: 'rare', condition: { type: 'percentile', target: 'cat', value: 10, description: '월간 활동량 상위 10%' }, points: 50, percentile: 10, recalculatePeriod: 'monthly' },
  { id: 'cat-top-1', name: '고양이 Top 1%', description: '고양이 활동량 상위 1%', emoji: '🐱👑', category: 'percentile', rarity: 'legendary', condition: { type: 'percentile', target: 'cat', value: 1, description: '월간 활동량 상위 1%' }, points: 200, percentile: 1, recalculatePeriod: 'monthly' },
  { id: 'dog-top-10', name: '강아지 Top 10%', description: '강아지 활동량 상위 10%', emoji: '🐕🔝', category: 'percentile', rarity: 'rare', condition: { type: 'percentile', target: 'dog', value: 10, description: '월간 활동량 상위 10%' }, points: 50, percentile: 10, recalculatePeriod: 'monthly' },
  { id: 'dog-top-1', name: '강아지 Top 1%', description: '강아지 활동량 상위 1%', emoji: '🐕👑', category: 'percentile', rarity: 'legendary', condition: { type: 'percentile', target: 'dog', value: 1, description: '월간 활동량 상위 1%' }, points: 200, percentile: 1, recalculatePeriod: 'monthly' },

  // 퀴즈 정답률
  { id: 'quiz-top-10', name: '퀴즈 천재 Top 10%', description: '퀴즈 정답률 상위 10%', emoji: '🧠🔝', category: 'percentile', rarity: 'rare', condition: { type: 'percentile', target: 'quiz', value: 10, description: '정답률 상위 10%' }, points: 50, percentile: 10, recalculatePeriod: 'monthly' },
  { id: 'quiz-top-5', name: '퀴즈 영재 Top 5%', description: '퀴즈 정답률 상위 5%', emoji: '🧠⭐', category: 'percentile', rarity: 'epic', condition: { type: 'percentile', target: 'quiz', value: 5, description: '정답률 상위 5%' }, points: 100, percentile: 5, recalculatePeriod: 'monthly' },
  { id: 'quiz-top-1', name: '퀴즈 전설 Top 1%', description: '퀴즈 정답률 상위 1%', emoji: '🧠👑', category: 'percentile', rarity: 'legendary', condition: { type: 'percentile', target: 'quiz', value: 1, description: '정답률 상위 1%' }, points: 200, percentile: 1, recalculatePeriod: 'monthly' },

  // 전체 활동량
  { id: 'activity-top-10', name: '활동왕 Top 10%', description: '월간 활동량 상위 10%', emoji: '🔥🔝', category: 'percentile', rarity: 'rare', condition: { type: 'percentile', target: 'activity', value: 10, description: '활동량 상위 10%' }, points: 50, percentile: 10, recalculatePeriod: 'monthly' },
  { id: 'activity-top-3', name: '이달의 스타 Top 3%', description: '월간 활동량 상위 3%', emoji: '⭐🔝', category: 'percentile', rarity: 'epic', condition: { type: 'percentile', target: 'activity', value: 3, description: '활동량 상위 3%' }, points: 150, percentile: 3, recalculatePeriod: 'monthly' },
  { id: 'activity-top-1', name: '이달의 MVP', description: '월간 활동량 상위 1%', emoji: '🏆👑', category: 'percentile', rarity: 'legendary', condition: { type: 'percentile', target: 'activity', value: 1, description: '활동량 상위 1%' }, points: 300, percentile: 1, recalculatePeriod: 'monthly' },
];

// ============================================================================
// 퀴즈 대결 배지
// ============================================================================

const DUEL_BADGES: Badge[] = [
  // 참여
  { id: 'duel-first', name: '첫 대결', description: '퀴즈 대결 첫 참여', emoji: '⚔️', category: 'duel', rarity: 'common', condition: { type: 'duel', description: '대결 1회 참여', duelRequirements: { duelsPlayed: 1 } }, points: 10 },
  { id: 'duel-10', name: '대결 애호가', description: '10회 대결 참여', emoji: '🎮', category: 'duel', rarity: 'common', condition: { type: 'duel', description: '대결 10회 참여', duelRequirements: { duelsPlayed: 10 } }, points: 30 },
  { id: 'duel-50', name: '대결 마니아', description: '50회 대결 참여', emoji: '🎯', category: 'duel', rarity: 'rare', condition: { type: 'duel', description: '대결 50회 참여', duelRequirements: { duelsPlayed: 50 } }, points: 100 },
  { id: 'duel-100', name: '대결 중독자', description: '100회 대결 참여', emoji: '💎', category: 'duel', rarity: 'epic', condition: { type: 'duel', description: '대결 100회 참여', duelRequirements: { duelsPlayed: 100 } }, points: 200 },

  // 승리
  { id: 'win-first', name: '첫 승리', description: '첫 대결 승리', emoji: '🏅', category: 'duel', rarity: 'common', condition: { type: 'duel', description: '첫 승리', duelRequirements: { wins: 1 } }, points: 15 },
  { id: 'win-10', name: '대결 고수', description: '10승 달성', emoji: '🥉', category: 'duel', rarity: 'rare', condition: { type: 'duel', description: '10승 달성', duelRequirements: { wins: 10 } }, points: 50 },
  { id: 'win-50', name: '대결 달인', description: '50승 달성', emoji: '🥈', category: 'duel', rarity: 'epic', condition: { type: 'duel', description: '50승 달성', duelRequirements: { wins: 50 } }, points: 150 },
  { id: 'win-100', name: '퀴즈 챔피언', description: '100승 달성', emoji: '🥇', category: 'duel', rarity: 'epic', condition: { type: 'duel', description: '100승 달성', duelRequirements: { wins: 100 } }, points: 300 },
  { id: 'win-500', name: '퀴즈 레전드', description: '500승 달성', emoji: '👑', category: 'duel', rarity: 'legendary', condition: { type: 'duel', description: '500승 달성', duelRequirements: { wins: 500 } }, points: 1000 },

  // 연승
  { id: 'streak-win-3', name: '3연승', description: '3연승 달성', emoji: '🔥', category: 'duel', rarity: 'common', condition: { type: 'duel', description: '3연승', duelRequirements: { winStreak: 3 } }, points: 20 },
  { id: 'streak-win-5', name: '무패 행진', description: '5연승 달성', emoji: '🔥🔥', category: 'duel', rarity: 'rare', condition: { type: 'duel', description: '5연승', duelRequirements: { winStreak: 5 } }, points: 50 },
  { id: 'streak-win-10', name: '연승 폭주', description: '10연승 달성', emoji: '🔥🔥🔥', category: 'duel', rarity: 'epic', condition: { type: 'duel', description: '10연승', duelRequirements: { winStreak: 10 } }, points: 150 },
  { id: 'streak-win-20', name: '무적', description: '20연승 달성', emoji: '💫', category: 'duel', rarity: 'legendary', condition: { type: 'duel', description: '20연승', duelRequirements: { winStreak: 20 } }, points: 500 },

  // 승률 (최소 30대결 후)
  { id: 'winrate-60', name: '승률 마스터', description: '승률 60% 이상', emoji: '📊', category: 'duel', rarity: 'rare', condition: { type: 'duel', description: '30대결+ 승률 60%', duelRequirements: { duelsPlayed: 30, winRate: 60 } }, points: 80 },
  { id: 'winrate-70', name: '승률 전문가', description: '승률 70% 이상', emoji: '📈', category: 'duel', rarity: 'epic', condition: { type: 'duel', description: '50대결+ 승률 70%', duelRequirements: { duelsPlayed: 50, winRate: 70 } }, points: 150 },
  { id: 'winrate-80', name: '승률 레전드', description: '승률 80% 이상', emoji: '👑📊', category: 'duel', rarity: 'legendary', condition: { type: 'duel', description: '100대결+ 승률 80%', duelRequirements: { duelsPlayed: 100, winRate: 80 } }, points: 500 },

  // 특수
  { id: 'comeback-king', name: '역전의 명수', description: '역전승 10회', emoji: '🔄', category: 'duel', rarity: 'epic', condition: { type: 'duel', description: '역전승 10회', duelRequirements: { comebacks: 10 } }, points: 100 },
  { id: 'perfect-win', name: '완벽한 승리', description: '완승 5회', emoji: '💯', category: 'duel', rarity: 'rare', condition: { type: 'duel', description: '전문제 정답 승리 5회', duelRequirements: { perfectWins: 5 } }, points: 80 },
];

// ============================================================================
// 스트릭 배지
// ============================================================================

const STREAK_BADGES: Badge[] = [
  { id: 'streak-3', name: '3일 연속', description: '3일 연속 방문', emoji: '🔥', category: 'streak', rarity: 'common', condition: { type: 'streak', value: 3, description: '3일 연속 활동' }, points: 30 },
  { id: 'streak-7', name: '일주일 연속', description: '7일 연속 방문', emoji: '💪', category: 'streak', rarity: 'uncommon', condition: { type: 'streak', value: 7, description: '7일 연속 활동' }, points: 70 },
  { id: 'streak-30', name: '한 달 연속', description: '30일 연속 방문', emoji: '🏅', category: 'streak', rarity: 'rare', condition: { type: 'streak', value: 30, description: '30일 연속 활동' }, points: 300 },
  { id: 'streak-100', name: '100일 연속', description: '100일 연속 방문', emoji: '👑', category: 'streak', rarity: 'epic', condition: { type: 'streak', value: 100, description: '100일 연속 활동' }, points: 1000 },
  { id: 'streak-365', name: '1년 연속', description: '365일 연속 방문', emoji: '👑🔥', category: 'streak', rarity: 'legendary', condition: { type: 'streak', value: 365, description: '365일 연속 활동' }, points: 5000 },
];

// ============================================================================
// 특별 달성 배지
// ============================================================================

const SPECIAL_BADGES: Badge[] = [
  // 크로스 대상
  { id: 'animal-explorer', name: '동물 탐험가', description: '반려동물 4종 Bronze 달성', emoji: '🧭', category: 'special', rarity: 'rare', condition: { type: 'special', description: '고양이/강아지/토끼/햄스터 Bronze' }, points: 100 },
  { id: 'animal-expert', name: '동물 전문가', description: '반려동물 4종 Silver 달성', emoji: '📚', category: 'special', rarity: 'epic', condition: { type: 'special', description: '고양이/강아지/토끼/햄스터 Silver' }, points: 300 },
  { id: 'zookeeper', name: '동물원장', description: '모든 동물 Gold 달성', emoji: '🦁', category: 'special', rarity: 'legendary', condition: { type: 'special', description: '모든 동물 대상 Gold 등급' }, points: 1000 },
  { id: 'all-rounder', name: '올라운더', description: '모든 카테고리 Silver 달성', emoji: '🌟', category: 'special', rarity: 'legendary', condition: { type: 'special', description: '모든 9개 대상 Silver 등급' }, points: 1500 },
  { id: 'grandmaster', name: '그랜드마스터', description: '3개 이상 Diamond 달성', emoji: '👑👑', category: 'special', rarity: 'legendary', condition: { type: 'special', description: '3개 이상 대상 Diamond 등급' }, points: 3000 },

  // 소셜
  { id: 'first-share', name: '공유 시작', description: '첫 결과 공유', emoji: '📤', category: 'social', rarity: 'common', condition: { type: 'first', description: '결과 카드 첫 공유' }, points: 20 },
  { id: 'viral-post', name: '바이럴', description: '게시글 좋아요 50개', emoji: '🌊', category: 'special', rarity: 'epic', condition: { type: 'special', description: '게시글 좋아요 50개 달성' }, points: 200 },
  { id: 'influencer', name: '인플루언서', description: '총 좋아요 받음 500개', emoji: '📢', category: 'special', rarity: 'legendary', condition: { type: 'special', description: '총 좋아요 500개 받음' }, points: 500 },

  // 시즌/이벤트
  { id: 'early-adopter', name: '얼리 어답터', description: '2025년 가입자', emoji: '🌱', category: 'special', rarity: 'legendary', condition: { type: 'special', description: '2025년 서비스 초기 가입' }, points: 100 },

  // 레거시 호환 (기존 배지)
  { id: 'first-test', name: '첫 발자국', description: '첫 번째 테스트 완료', emoji: '👣', category: 'test', rarity: 'common', condition: { type: 'first', description: '아무 테스트나 1개 완료' }, points: 10 },
  { id: 'test-explorer', name: '탐험가', description: '5개 이상의 테스트 완료', emoji: '🧭', category: 'test', rarity: 'common', condition: { type: 'count', value: 5, description: '테스트 5개 완료' }, points: 50 },
  { id: 'quiz-rookie', name: '퀴즈 루키', description: '첫 퀴즈 정답', emoji: '🧠', category: 'quiz', rarity: 'common', condition: { type: 'first', description: '퀴즈 1개 정답' }, points: 10 },
  { id: 'first-vote', name: '첫 투표', description: '첫 번째 투표 참여', emoji: '🗳️', category: 'poll', rarity: 'common', condition: { type: 'first', description: '투표 1개 참여' }, points: 10 },
];

// ============================================================================
// 전체 배지 통합
// ============================================================================

export const BADGES: Badge[] = [
  ...generateExpertBadges(),  // 45개 (9개 대상 × 5단계)
  ...COMMUNITY_BADGES,        // 5개
  ...PERCENTILE_BADGES,       // 10개
  ...DUEL_BADGES,             // 19개
  ...STREAK_BADGES,           // 5개
  ...SPECIAL_BADGES,          // 14개
  // 총 98개 (레거시 포함)
];

// ============================================================================
// 배지 조회 함수
// ============================================================================

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return BADGES.filter(b => b.category === category);
}

export function getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
  return BADGES.filter(b => b.rarity === rarity);
}

export function getBadgesBySubject(subject: ExpertSubject): Badge[] {
  return BADGES.filter(b => b.subject === subject);
}

export function getBadgesByTier(tier: BadgeTier): Badge[] {
  return BADGES.filter(b => b.tier === tier);
}

export function getExpertBadge(subject: ExpertSubject, tier: BadgeTier): Badge | undefined {
  return BADGES.find(b => b.id === `expert-${subject}-${tier}`);
}

// 배지 개수 요약
export const BADGE_COUNTS = {
  expert: 45,
  community: 5,
  percentile: 10,
  duel: 19,
  streak: 5,
  special: 14,
  total: BADGES.length,
};
