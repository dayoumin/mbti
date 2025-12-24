/**
 * 콘텐츠 카테고리 공통 정의
 * ContentExplore, ParticipationStats 등에서 공유
 */

import type { ContentCategory } from './types';

// 카테고리 라벨 (name으로 통일)
export const CATEGORY_LABELS: Record<ContentCategory, { name: string; emoji: string }> = {
  // 반려동물
  cat: { name: '고양이', emoji: '🐱' },
  dog: { name: '강아지', emoji: '🐕' },
  rabbit: { name: '토끼', emoji: '🐰' },
  hamster: { name: '햄스터', emoji: '🐹' },
  // 특수동물
  fish: { name: '관상어', emoji: '🐟' },
  bird: { name: '새', emoji: '🐦' },
  reptile: { name: '파충류', emoji: '🦎' },
  smallPet: { name: '소동물', emoji: '🐾' },
  // 라이프스타일
  plant: { name: '식물', emoji: '🌿' },
  coffee: { name: '커피', emoji: '☕' },
  lifestyle: { name: '라이프스타일', emoji: '🏠' },
  alcohol: { name: '술', emoji: '🍺' },
  // 심리/관계
  personality: { name: '성격', emoji: '🧠' },
  love: { name: '연애', emoji: '💕' },
  relationship: { name: '관계', emoji: '💑' },
  // 운세/점술
  fortune: { name: '운세', emoji: '🔮' },
  zodiac: { name: '별자리/띠', emoji: '⭐' },
  tarot: { name: '타로', emoji: '🃏' },
  // 일반
  general: { name: '일반', emoji: '📚' },
};

export const CATEGORY_KEYS = Object.keys(CATEGORY_LABELS) as ContentCategory[];

/** 콘텐츠 카테고리 정보 조회 (이름, 이모지) */
export function getContentCategoryInfo(category: string): { name: string; label: string; emoji: string } {
  const info = CATEGORY_LABELS[category as ContentCategory] || { name: category, emoji: '📊' };
  return { ...info, label: info.name };
}
