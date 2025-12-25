// ============================================================================
// 게이미피케이션 통합 Export
// ============================================================================

// Types
export * from './types';

// Badges
export * from './badges';

// Levels
export * from './levels';

// Points (포인트 설정)
export * from './points';

// 통합 통계
import { BADGES } from './badges';
import { LEVELS, DAILY_MISSIONS } from './levels';

export const GAMIFICATION_STATS = {
  totalBadges: BADGES.length,
  totalLevels: LEVELS.length,
  dailyMissions: DAILY_MISSIONS.length,
  badgesByCategory: {
    test: BADGES.filter(b => b.category === 'test').length,
    quiz: BADGES.filter(b => b.category === 'quiz').length,
    poll: BADGES.filter(b => b.category === 'poll').length,
    streak: BADGES.filter(b => b.category === 'streak').length,
    social: BADGES.filter(b => b.category === 'social').length,
    special: BADGES.filter(b => b.category === 'special').length,
  },
  badgesByRarity: {
    common: BADGES.filter(b => b.rarity === 'common').length,
    rare: BADGES.filter(b => b.rarity === 'rare').length,
    epic: BADGES.filter(b => b.rarity === 'epic').length,
    legendary: BADGES.filter(b => b.rarity === 'legendary').length,
  },
};
