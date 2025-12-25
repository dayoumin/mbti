/**
 * 콘텐츠 카테고리 정의 - 단일 소스 (Single Source of Truth)
 *
 * 모든 카테고리 정보는 이 파일에서만 정의합니다.
 * - ContentCategory 타입
 * - 카테고리 메타 정보 (label, emoji)
 * - 카테고리 키 목록
 *
 * 새 카테고리 추가 시:
 * 1. CATEGORY_KEY_LIST에 키 추가
 * 2. CATEGORIES 객체에 정보 추가
 */

// ============================================================================
// 카테고리 정의 (단일 소스)
// ============================================================================

/**
 * 카테고리 정보 타입
 */
interface CategoryInfo {
  name: string;
  emoji: string;
}

/**
 * 모든 카테고리 키 (타입 정의용)
 */
const CATEGORY_KEY_LIST = [
  'pet', 'cat', 'dog', 'rabbit', 'hamster',
  'fish', 'bird', 'reptile', 'smallPet',
  'plant', 'coffee', 'food', 'lifestyle', 'alcohol',
  'beauty',
  'personality', 'love', 'relationship',
  'money',
  'fortune', 'zodiac', 'tarot',
  'general',
] as const;

/**
 * ContentCategory 타입 - 카테고리 키 목록에서 생성
 */
export type ContentCategory = typeof CATEGORY_KEY_LIST[number];

/**
 * 모든 카테고리 정의
 */
export const CATEGORIES: Record<ContentCategory, CategoryInfo> = {
  // 반려동물
  pet: { name: '반려동물', emoji: '🐾' },
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
  food: { name: '음식', emoji: '🍽️' },
  lifestyle: { name: '라이프스타일', emoji: '🏠' },
  alcohol: { name: '술', emoji: '🍺' },

  // 뷰티/향기
  beauty: { name: '뷰티', emoji: '🌸' },

  // 심리/관계
  personality: { name: '성격', emoji: '🧠' },
  love: { name: '연애', emoji: '💕' },
  relationship: { name: '관계', emoji: '💑' },

  // 돈/경조사
  money: { name: '돈/경조사', emoji: '💰' },

  // 운세/점술
  fortune: { name: '운세', emoji: '🔮' },
  zodiac: { name: '별자리/띠', emoji: '⭐' },
  tarot: { name: '타로', emoji: '🃏' },

  // 일반
  general: { name: '일반', emoji: '📚' },
};

/**
 * CommunityCategory는 ContentCategory의 alias (하위 호환)
 */
export type CommunityCategory = ContentCategory;

// ============================================================================
// 파생 데이터 (자동 생성)
// ============================================================================

/**
 * 카테고리 라벨 (하위 호환용 alias)
 */
export const CATEGORY_LABELS: Record<ContentCategory, CategoryInfo> = CATEGORIES;

/**
 * 모든 카테고리 키 배열
 */
export const CATEGORY_KEYS = Object.keys(CATEGORIES) as ContentCategory[];

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * 카테고리 정보 조회 (이름, 이모지)
 */
export function getCategoryInfo(category: string): { name: string; emoji: string } {
  return CATEGORIES[category as ContentCategory] || { name: category, emoji: '📊' };
}

/**
 * 콘텐츠 카테고리 정보 조회 (레거시 호환 - label 필드 포함)
 */
export function getContentCategoryInfo(category: string): { name: string; label: string; emoji: string } {
  const info = getCategoryInfo(category);
  return { ...info, label: info.name };
}

/**
 * 카테고리가 유효한지 확인
 */
export function isValidCategory(category: string): category is ContentCategory {
  return category in CATEGORIES;
}
