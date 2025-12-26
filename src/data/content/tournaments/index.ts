// ============================================================================
// 토너먼트 데이터 통합 Export
// ============================================================================

import type { ContentCategory, TierTournament } from '../types';

// --- 토너먼트 데이터 import ---
import { ANIME_TIER_TOURNAMENTS } from './anime-tier';
import { RAMEN_TIER_TOURNAMENTS } from './food-tier';
import { CELEBRITY_MALE_TIER_TOURNAMENTS } from './celebrity-male-tier';
import { CELEBRITY_FEMALE_TIER_TOURNAMENTS } from './celebrity-female-tier';
import { PERSONALITY_TIER_TOURNAMENTS } from './personality-tier';

// ============================================================================
// 토너먼트 레지스트리
// ============================================================================

const TOURNAMENT_REGISTRY: TierTournament[][] = [
  ANIME_TIER_TOURNAMENTS,
  RAMEN_TIER_TOURNAMENTS,
  CELEBRITY_MALE_TIER_TOURNAMENTS,
  CELEBRITY_FEMALE_TIER_TOURNAMENTS,
  PERSONALITY_TIER_TOURNAMENTS,
  // 추가 토너먼트 파일 여기에 등록
];

// ============================================================================
// 통합 배열
// ============================================================================

export const TIER_TOURNAMENTS: TierTournament[] = TOURNAMENT_REGISTRY.flat();

// 개별 export
export { ANIME_TIER_TOURNAMENTS } from './anime-tier';
export { RAMEN_TIER_TOURNAMENTS } from './food-tier';
export { CELEBRITY_MALE_TIER_TOURNAMENTS } from './celebrity-male-tier';
export { CELEBRITY_FEMALE_TIER_TOURNAMENTS } from './celebrity-female-tier';
export { PERSONALITY_TIER_TOURNAMENTS } from './personality-tier';

// ============================================================================
// 조회 함수
// ============================================================================

/** 카테고리별 토너먼트 조회 */
export function getTournamentsByCategory(category: ContentCategory): TierTournament[] {
  return TIER_TOURNAMENTS.filter(t => t.category === category);
}

/** ID로 토너먼트 조회 */
export function getTournamentById(id: string): TierTournament | undefined {
  return TIER_TOURNAMENTS.find(t => t.id === id);
}

/** 랜덤 토너먼트 선택 */
export function getRandomTournament(category?: ContentCategory): TierTournament | undefined {
  const filtered = category
    ? TIER_TOURNAMENTS.filter(t => t.category === category)
    : TIER_TOURNAMENTS;

  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/** 태그별 토너먼트 조회 */
export function getTournamentsByTag(tag: string): TierTournament[] {
  return TIER_TOURNAMENTS.filter(t => t.tags?.includes(tag));
}

// ============================================================================
// 통계
// ============================================================================

export const TOURNAMENT_STATS = {
  total: TIER_TOURNAMENTS.length,
  byCategory: () => {
    const counts: Partial<Record<ContentCategory, number>> = {};
    TIER_TOURNAMENTS.forEach(t => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  },
  totalItems: () => {
    return TIER_TOURNAMENTS.reduce((sum, t) => sum + t.items.length, 0);
  },
};
