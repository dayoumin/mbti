/**
 * 랭킹 관련 상수
 */

// 카테고리 이름 매핑
export const CATEGORY_NAMES: Record<string, string> = {
  cat: '🐱 고양이',
  dog: '🐕 강아지',
  love: '💕 연애',
  lifestyle: '☕ 라이프',
  personality: '🧠 성격',
  plant: '🌱 식물',
  general: '💬 일반',
};

// 테스트 타입 이름 매핑
export const TEST_TYPE_NAMES: Record<string, string> = {
  human: '성격',
  cat: '고양이',
  dog: '강아지',
  idealType: '이상형',
  petMatch: '반려동물',
  coffee: '커피',
  plant: '식물',
  rabbit: '토끼',
  hamster: '햄스터',
  conflictStyle: '갈등',
};

// 헬퍼 함수
export function getCategoryName(category: string): string {
  return CATEGORY_NAMES[category] || category;
}

export function getTestTypeName(testType: string): string {
  return TEST_TYPE_NAMES[testType] || testType;
}
