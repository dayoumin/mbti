// ============================================================================
// 상황별 반응 투표 데이터
// ============================================================================

import type { SituationReaction, SituationCategory } from '../types';

// 카테고리별 데이터 import
import { RELATIONSHIP_REACTIONS } from './relationship';
import { WORK_REACTIONS } from './work';
import { SOCIAL_REACTIONS } from './social';
import { AWKWARD_REACTIONS } from './awkward';

// ============================================================================
// 전체 상황별 반응 데이터
// ============================================================================

export const ALL_SITUATION_REACTIONS: SituationReaction[] = [
  ...RELATIONSHIP_REACTIONS,
  ...WORK_REACTIONS,
  ...SOCIAL_REACTIONS,
  ...AWKWARD_REACTIONS,
];

// ============================================================================
// 카테고리별 조회
// ============================================================================

export function getSituationReactionsByCategory(category: SituationCategory): SituationReaction[] {
  return ALL_SITUATION_REACTIONS.filter(sr => sr.category === category);
}

// ============================================================================
// 랜덤 조회
// ============================================================================

export function getRandomSituationReaction(category?: SituationCategory): SituationReaction {
  const pool = category
    ? getSituationReactionsByCategory(category)
    : ALL_SITUATION_REACTIONS;
  return pool[Math.floor(Math.random() * pool.length)];
}

// ============================================================================
// 카테고리 라벨
// ============================================================================

export const SITUATION_CATEGORY_LABELS: Record<SituationCategory, { name: string; emoji: string; desc: string }> = {
  relationship: { name: '연애/이별', emoji: '💕', desc: '연애, 썸, 이별 상황' },
  work: { name: '직장생활', emoji: '💼', desc: '상사, 동료, 회의, 회식' },
  social: { name: '친구/모임', emoji: '👥', desc: '친구 관계, SNS, 파티' },
  awkward: { name: '어색한 순간', emoji: '😅', desc: '민망하고 어색한 상황' },
};

// re-export 개별 카테고리
export { RELATIONSHIP_REACTIONS } from './relationship';
export { WORK_REACTIONS } from './work';
export { SOCIAL_REACTIONS } from './social';
export { AWKWARD_REACTIONS } from './awkward';
