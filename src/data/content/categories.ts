/**
 * 콘텐츠 카테고리 공통 정의
 * ContentExplore, ParticipationStats 등에서 공유
 */

import type { ContentCategory } from './types';

export const CATEGORY_LABELS: Record<ContentCategory, { label: string; emoji: string }> = {
  cat: { label: '고양이', emoji: '🐱' },
  dog: { label: '강아지', emoji: '🐕' },
  rabbit: { label: '토끼', emoji: '🐰' },
  hamster: { label: '햄스터', emoji: '🐹' },
  general: { label: '일반', emoji: '📚' },
  love: { label: '연애', emoji: '💕' },
  lifestyle: { label: '라이프스타일', emoji: '☕' },
  personality: { label: '성격', emoji: '🧠' },
  plant: { label: '식물', emoji: '🌱' },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS) as ContentCategory[];

export function getCategoryLabel(category: string): { label: string; emoji: string } {
  return CATEGORY_LABELS[category as ContentCategory] || { label: category, emoji: '📊' };
}
