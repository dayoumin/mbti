// ============================================================================
// 투표 데이터 통합 Export
// ============================================================================
//
// 새 투표 추가 방법:
// 1. 현재: vs-polls.ts에 직접 추가
// 2. 투표가 많아지면: cat-polls.ts, dog-polls.ts 등으로 분리 후 POLL_REGISTRY에 추가
// ============================================================================

import type { ContentCategory, VSPoll, ChoicePoll } from '../types';

// --- 투표 데이터 import ---
import { VS_POLLS as VS_POLLS_DATA } from './vs-polls';
import { KIDS_VS_POLLS } from './kids-polls';
import { CHOICE_POLLS as CHOICE_POLLS_DATA } from './choice-polls';
import { PET_VS_POLLS } from './pet-vs-polls';
import { COFFEE_VS_POLLS } from './coffee-vs-polls';
import { LOVE_VS_POLLS } from './love-vs-polls';
import { MONEY_POLLS } from './money-polls';
import { TAROT_VS_POLLS, TAROT_CHOICE_POLLS } from './tarot-polls';

// ============================================================================
// 투표 레지스트리 (분리 시 여기에 추가)
// ============================================================================

const POLL_REGISTRY: VSPoll[][] = [
  VS_POLLS_DATA,
  KIDS_VS_POLLS,
  PET_VS_POLLS,
  COFFEE_VS_POLLS,
  LOVE_VS_POLLS,
  TAROT_VS_POLLS,
  // 투표 분리 시 여기에 추가 (예: CAT_POLLS, DOG_POLLS)
];

// ============================================================================
// 통합 배열 (자동 생성)
// ============================================================================

export const VS_POLLS: VSPoll[] = POLL_REGISTRY.flat();
export const CHOICE_POLLS: ChoicePoll[] = [...CHOICE_POLLS_DATA, ...MONEY_POLLS, ...TAROT_CHOICE_POLLS];

// 기존 export 유지 (직접 접근용)
export { VS_POLLS as default };

// ============================================================================
// 조회 함수
// ============================================================================

/** 카테고리별 투표 조회 */
export function getPollsByCategory(category: ContentCategory): VSPoll[] {
  return VS_POLLS.filter(p => p.category === category);
}

/** 랜덤 투표 선택 */
export function getRandomPoll(category?: ContentCategory): VSPoll | undefined {
  const filtered = category
    ? VS_POLLS.filter(p => p.category === category)
    : VS_POLLS;

  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

/** 태그별 투표 조회 */
export function getPollsByTag(tag: string): VSPoll[] {
  return VS_POLLS.filter(p => p.tags?.includes(tag));
}

/** Choice Poll ID로 조회 */
export function getChoicePollById(pollId: string): ChoicePoll | undefined {
  return CHOICE_POLLS.find(p => p.id === pollId);
}

// ============================================================================
// 통계
// ============================================================================

export const POLL_STATS = {
  total: VS_POLLS.length,
  byCategory: () => {
    const counts: Record<string, number> = {};
    VS_POLLS.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts as Partial<Record<ContentCategory, number>>;
  },
  byTag: () => {
    const counts: Record<string, number> = {};
    VS_POLLS.forEach(p => {
      p.tags?.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return counts;
  },
};
