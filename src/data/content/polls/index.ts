// ============================================================================
// 투표 데이터 통합 Export
// ============================================================================

export { VS_POLLS } from './vs-polls';

import { VS_POLLS } from './vs-polls';
import type { ContentCategory, VSPoll } from '../types';

// 카테고리별 투표 조회
export function getPollsByCategory(category: ContentCategory): VSPoll[] {
  return VS_POLLS.filter(p => p.category === category);
}

// 랜덤 투표 선택 (빈 배열이면 undefined 반환)
export function getRandomPoll(category?: ContentCategory): VSPoll | undefined {
  const filtered = category
    ? VS_POLLS.filter(p => p.category === category)
    : VS_POLLS;

  if (filtered.length === 0) return undefined;
  return filtered[Math.floor(Math.random() * filtered.length)];
}

// 태그별 투표 조회
export function getPollsByTag(tag: string): VSPoll[] {
  return VS_POLLS.filter(p => p.tags?.includes(tag));
}
