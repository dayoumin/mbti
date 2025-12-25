// ============================================================================
// contentGraph.ts - 콘텐츠 연결 그래프
// ============================================================================
//
// 콘텐츠 간 연결 관계 관리
// - 테스트 → 카테고리/퀴즈/투표/테스트
// - 카테고리 → 테스트 (자동 생성)
// - 운세 → 테스트
// - 결과 → 세부 테스트
//
// 카테고리 정보는 categories.ts에서 단일 소스로 관리
//
// ============================================================================

import type { SubjectKey } from './types';
import { CATEGORIES, type ContentCategory } from './content/categories';

// ============================================================================
// 타입 정의
// ============================================================================

export type ConnectionType = 'test' | 'quiz' | 'poll' | 'community' | 'fortune';

export interface ContentConnection {
  from: string;
  to: string;
  type: ConnectionType;
  relevance: number;  // 1-5 (높을수록 관련성 높음)
  reason: string;     // 추천 이유 (UI 표시용)
}

export interface CategoryMeta {
  label: string;
  icon: string;
}

export interface TestMeta {
  label: string;
  icon: string;
  category: string;
}

// ============================================================================
// 1. 테스트 → 카테고리 매핑
// ============================================================================

export const TEST_TO_CATEGORY: Record<string, ContentCategory> = {
  // 반려동물 성격
  cat: 'cat',
  dog: 'dog',
  rabbit: 'rabbit',
  hamster: 'hamster',

  // 세부 테스트
  dogBreed: 'dog',
  catBreed: 'cat',
  smallPet: 'smallPet',
  fishType: 'fish',
  birdType: 'bird',
  reptileType: 'reptile',

  // 매칭
  petMatch: 'pet',

  // 라이프스타일
  plant: 'plant',
  coffee: 'coffee',
  tea: 'coffee',
  alcohol: 'alcohol',
  drinkingStyle: 'alcohol',
  whiskeySample: 'alcohol',

  // 음식
  food: 'food',
  ramen: 'food',
  bread: 'food',
  fruit: 'food',

  // 뷰티/향기
  perfume: 'beauty',
  aroma: 'beauty',

  // 심리/관계
  human: 'personality',
  idealType: 'love',
  conflictStyle: 'relationship',
  spendingStyle: 'lifestyle',
  travelStyle: 'lifestyle',
};

// 프로필용 카테고리 (UI 표시용 - 더 넓은 그룹핑)
export const TEST_TO_PROFILE_CATEGORY: Record<string, string> = {
  human: 'personality',
  idealType: 'personality',
  conflictStyle: 'personality',
  cat: 'pet',
  dog: 'pet',
  rabbit: 'pet',
  hamster: 'pet',
  petMatch: 'pet',
  coffee: 'lifestyle',
  plant: 'lifestyle',
  tea: 'lifestyle',
  alcohol: 'lifestyle',
  // 세부 테스트
  dogBreed: 'detailed',
  catBreed: 'detailed',
  smallPet: 'detailed',
  fishType: 'detailed',
  birdType: 'detailed',
  reptileType: 'detailed',
};

// ============================================================================
// 2. 카테고리 → 테스트 매핑
// ============================================================================

// 카테고리별 추가 테스트 (TEST_TO_CATEGORY에서 자동 생성되지 않는 것들)
// 교차 카테고리 링크: 하위 카테고리에서 상위 매칭 테스트로 연결
const CATEGORY_EXTRA_TESTS: Partial<Record<ContentCategory, SubjectKey[]>> = {
  // 반려동물 카테고리 → 상위 카테고리에서 하위 테스트 접근 가능
  pet: ['petMatch', 'cat', 'dog', 'rabbit', 'hamster'],
  cat: ['petMatch'],
  dog: ['petMatch'],
  rabbit: ['petMatch'],
  hamster: ['petMatch'],
  fish: ['petMatch'],
  bird: ['petMatch'],
  reptile: ['petMatch'],
  smallPet: ['petMatch'],
  // 관계/연애 카테고리
  love: ['idealType', 'conflictStyle'],
  relationship: ['idealType', 'conflictStyle'],
  // 라이프스타일 카테고리
  lifestyle: ['coffee', 'plant', 'tea', 'spendingStyle', 'travelStyle'],
  // 돈/경조사 카테고리
  money: ['spendingStyle'],
  // 일반 폴백
  general: ['petMatch', 'human', 'coffee'],
  // 운세 카테고리
  zodiac: ['human', 'idealType'],
  tarot: ['human', 'conflictStyle', 'idealType'],
  fortune: ['human', 'idealType', 'conflictStyle'],
};

/**
 * TEST_TO_CATEGORY에서 CATEGORY_TO_TEST 자동 생성
 */
function buildCategoryToTest(): Record<string, SubjectKey[]> {
  const result: Record<string, SubjectKey[]> = {};

  // 1. TEST_TO_CATEGORY 역방향 매핑
  for (const [testKey, category] of Object.entries(TEST_TO_CATEGORY)) {
    if (!result[category]) {
      result[category] = [];
    }
    if (!result[category].includes(testKey as SubjectKey)) {
      result[category].push(testKey as SubjectKey);
    }
  }

  // 2. 추가 테스트 병합
  for (const [category, tests] of Object.entries(CATEGORY_EXTRA_TESTS)) {
    if (!result[category]) {
      result[category] = [];
    }
    for (const test of tests || []) {
      if (!result[category].includes(test)) {
        result[category].push(test);
      }
    }
  }

  return result;
}

export const CATEGORY_TO_TEST: Record<string, SubjectKey[]> = buildCategoryToTest();

// 커뮤니티 카테고리 → 테스트 (확장)
export const COMMUNITY_CATEGORY_TO_TEST: Record<string, SubjectKey[]> = {
  ...CATEGORY_TO_TEST,
};

// ============================================================================
// 3. 테스트 → 콘텐츠 연결 (퀴즈/투표/테스트)
// ============================================================================

export const TEST_CONNECTIONS: ContentConnection[] = [
  // petMatch
  { from: 'petMatch', to: 'pet', type: 'quiz', relevance: 5, reason: '반려동물 상식 퀴즈' },
  { from: 'petMatch', to: 'pet', type: 'poll', relevance: 4, reason: '반려동물 투표' },
  { from: 'petMatch', to: 'dogBreed', type: 'test', relevance: 5, reason: '강아지 품종 찾기' },
  { from: 'petMatch', to: 'catBreed', type: 'test', relevance: 5, reason: '고양이 품종 찾기' },

  // cat
  { from: 'cat', to: 'cat', type: 'quiz', relevance: 5, reason: '고양이 상식 퀴즈' },
  { from: 'cat', to: 'cat', type: 'poll', relevance: 4, reason: '집사들의 투표' },
  { from: 'cat', to: 'catBreed', type: 'test', relevance: 5, reason: '품종 알아보기' },

  // dog
  { from: 'dog', to: 'dog', type: 'quiz', relevance: 5, reason: '강아지 상식 퀴즈' },
  { from: 'dog', to: 'dog', type: 'poll', relevance: 4, reason: '견주들의 투표' },
  { from: 'dog', to: 'dogBreed', type: 'test', relevance: 5, reason: '품종 알아보기' },

  // plant
  { from: 'plant', to: 'plant', type: 'quiz', relevance: 5, reason: '식물 관리 퀴즈' },
  { from: 'plant', to: 'plant', type: 'poll', relevance: 4, reason: '식집사 투표' },

  // coffee
  { from: 'coffee', to: 'lifestyle', type: 'quiz', relevance: 4, reason: '라이프스타일 퀴즈' },
  { from: 'coffee', to: 'coffee', type: 'poll', relevance: 5, reason: '커피 취향 투표' },
  { from: 'coffee', to: 'plant', type: 'test', relevance: 3, reason: '식물 케미도 알아보기' },
  { from: 'coffee', to: 'tea', type: 'test', relevance: 4, reason: '차 취향도 알아보기' },

  // idealType
  { from: 'idealType', to: 'love', type: 'quiz', relevance: 5, reason: '연애 심리 퀴즈' },
  { from: 'idealType', to: 'love', type: 'poll', relevance: 5, reason: '연애 스타일 투표' },
  { from: 'idealType', to: 'conflictStyle', type: 'test', relevance: 5, reason: '갈등 대처 스타일' },

  // conflictStyle
  { from: 'conflictStyle', to: 'love', type: 'quiz', relevance: 4, reason: '관계 심리 퀴즈' },
  { from: 'conflictStyle', to: 'relationship', type: 'poll', relevance: 4, reason: '관계 투표' },
  { from: 'conflictStyle', to: 'idealType', type: 'test', relevance: 5, reason: '이상형 테스트' },

  // human
  { from: 'human', to: 'personality', type: 'quiz', relevance: 5, reason: '성격 유형 퀴즈' },
  { from: 'human', to: 'personality', type: 'poll', relevance: 4, reason: '성격별 투표' },
  { from: 'human', to: 'petMatch', type: 'test', relevance: 4, reason: '반려동물 매칭' },
  { from: 'human', to: 'idealType', type: 'test', relevance: 4, reason: '이상형 테스트' },
  { from: 'human', to: 'conflictStyle', type: 'test', relevance: 4, reason: '갈등 대처 스타일' },

  // rabbit
  { from: 'rabbit', to: 'rabbit', type: 'quiz', relevance: 5, reason: '토끼 상식 퀴즈' },
  { from: 'rabbit', to: 'pet', type: 'poll', relevance: 4, reason: '소동물 투표' },

  // hamster
  { from: 'hamster', to: 'hamster', type: 'quiz', relevance: 5, reason: '햄스터 상식 퀴즈' },
  { from: 'hamster', to: 'pet', type: 'poll', relevance: 4, reason: '소동물 투표' },
];

// ============================================================================
// 4. 운세 → 테스트 연결
// ============================================================================

export const FORTUNE_CONNECTIONS: ContentConnection[] = [
  // 별자리 성격
  { from: 'constellation', to: 'human', type: 'test', relevance: 5, reason: '별자리 말고 진짜 내 성격은?' },
  { from: 'constellation', to: 'idealType', type: 'test', relevance: 4, reason: '연애 성향도 알아볼래요?' },
  { from: 'constellation', to: 'personality', type: 'quiz', relevance: 4, reason: '성격 퀴즈 도전' },

  // 별자리 궁합
  { from: 'constellation-compatibility', to: 'idealType', type: 'test', relevance: 5, reason: '진짜 연애 스타일은?' },
  { from: 'constellation-compatibility', to: 'conflictStyle', type: 'test', relevance: 4, reason: '갈등 대처도 알아보기' },
  { from: 'constellation-compatibility', to: 'love', type: 'poll', relevance: 4, reason: '연애 투표 참여' },

  // 타로
  { from: 'tarot', to: 'human', type: 'test', relevance: 4, reason: '카드가 추천하는 성격 테스트' },
  { from: 'tarot', to: 'conflictStyle', type: 'test', relevance: 4, reason: '내면의 갈등 스타일' },
  { from: 'tarot', to: 'idealType', type: 'test', relevance: 3, reason: '연애 운 더 알아보기' },
  { from: 'tarot', to: 'general', type: 'quiz', relevance: 4, reason: '타로 퀴즈 도전' },
  { from: 'tarot', to: 'general', type: 'poll', relevance: 4, reason: '타로 투표 참여' },

  // 띠 운세
  { from: 'zodiac', to: 'human', type: 'test', relevance: 5, reason: '띠보다 정확한 내 성격' },
  { from: 'zodiac', to: 'conflictStyle', type: 'test', relevance: 4, reason: '대처 스타일 알아보기' },
  { from: 'zodiac', to: 'personality', type: 'poll', relevance: 3, reason: '성격 투표 참여' },

  // 일일 운세
  { from: 'daily-fortune', to: 'coffee', type: 'test', relevance: 3, reason: '오늘의 커피 운' },
  { from: 'daily-fortune', to: 'general', type: 'poll', relevance: 4, reason: '오늘의 투표' },
];

// ============================================================================
// 5. 결과 → 세부 테스트 매핑
// ============================================================================

export const RESULT_TO_DETAIL_TEST: Record<string, SubjectKey[]> = {
  // petMatch 결과 - 실제 resultLabel.name과 일치해야 함
  '활발한 강아지': ['dogBreed'],
  '얌전한 소형견': ['dogBreed'],
  '도도한 고양이': ['catBreed'],
  '응석쟁이 고양이': ['catBreed'],
  '귀여운 토끼': ['rabbit'],
  '활발한 햄스터': ['hamster'],
  '느긋한 물고기': ['fishType'],
  '똑똑한 앵무새': ['birdType'],
  '나만의 반려동물': [], // 폴백 결과 - 세부 테스트 없음
};

// ============================================================================
// 6. 카테고리 메타 정보 (categories.ts에서 파생)
// ============================================================================

/**
 * CATEGORY_META - categories.ts의 CATEGORIES에서 자동 생성
 * 하위 호환을 위해 유지
 */
export const CATEGORY_META: Record<string, CategoryMeta> = Object.fromEntries(
  Object.entries(CATEGORIES).map(([key, value]) => [
    key,
    { label: value.name, icon: value.emoji },
  ])
);

// ============================================================================
// 7. 테스트 메타 정보
// ============================================================================

export const TEST_META: Record<string, TestMeta> = {
  // 성격
  human: { label: '성격 유형', icon: '🧠', category: 'personality' },

  // 반려동물
  cat: { label: '고양이 성격', icon: '🐱', category: 'pet' },
  dog: { label: '강아지 성격', icon: '🐕', category: 'pet' },
  rabbit: { label: '토끼 성격', icon: '🐰', category: 'pet' },
  hamster: { label: '햄스터 성격', icon: '🐹', category: 'pet' },
  petMatch: { label: '반려동물 매칭', icon: '🐾', category: 'pet' },
  dogBreed: { label: '강아지 품종', icon: '🦮', category: 'pet' },
  catBreed: { label: '고양이 품종', icon: '🐈', category: 'pet' },
  smallPet: { label: '소동물', icon: '🐹', category: 'pet' },
  fishType: { label: '물고기', icon: '🐠', category: 'pet' },
  birdType: { label: '새', icon: '🐦', category: 'pet' },
  reptileType: { label: '파충류', icon: '🦎', category: 'pet' },

  // 연애/관계
  idealType: { label: '이상형', icon: '💕', category: 'love' },
  conflictStyle: { label: '갈등 대처', icon: '🤝', category: 'love' },

  // 라이프스타일
  plant: { label: '반려식물', icon: '🌱', category: 'lifestyle' },
  coffee: { label: '커피 성향', icon: '☕', category: 'lifestyle' },
  tea: { label: '차 성향', icon: '🍵', category: 'lifestyle' },
  alcohol: { label: '술 성향', icon: '🍺', category: 'lifestyle' },
  drinkingStyle: { label: '음주 스타일', icon: '🍻', category: 'lifestyle' },
  whiskeySample: { label: '위스키 취향', icon: '🥃', category: 'alcohol' },

  // 음식
  food: { label: '음식 성향', icon: '🍽️', category: 'food' },
  ramen: { label: '라면 성향', icon: '🍜', category: 'food' },
  bread: { label: '빵 성향', icon: '🍞', category: 'food' },
  fruit: { label: '과일 성향', icon: '🍎', category: 'food' },

  // 뷰티/향기
  perfume: { label: '향수 성향', icon: '🌸', category: 'beauty' },
  aroma: { label: '아로마 성향', icon: '🕯️', category: 'beauty' },

  // 생활 패턴
  spendingStyle: { label: '소비 스타일', icon: '💰', category: 'lifestyle' },
  travelStyle: { label: '여행 스타일', icon: '✈️', category: 'lifestyle' },
};

// ============================================================================
// 8. 유틸리티 함수
// ============================================================================

/**
 * 테스트에서 연결된 콘텐츠 가져오기
 */
export function getTestConnections(testKey: SubjectKey): ContentConnection[] {
  return TEST_CONNECTIONS.filter(c => c.from === testKey);
}

/**
 * 카테고리에 연결된 테스트 가져오기
 */
export function getTestsForCategory(category: string): SubjectKey[] {
  return CATEGORY_TO_TEST[category] || CATEGORY_TO_TEST['general'] || [];
}

/**
 * 운세 콘텐츠에서 연결된 테스트 가져오기
 */
export function getFortuneConnections(fortuneType: string): ContentConnection[] {
  return FORTUNE_CONNECTIONS.filter(c => c.from === fortuneType);
}

/**
 * 결과에서 세부 테스트 가져오기
 */
export function getDetailTestsForResult(resultKey: string): SubjectKey[] {
  return RESULT_TO_DETAIL_TEST[resultKey] || [];
}

/**
 * 모든 연결 가져오기 (통합)
 */
export function getAllConnections(): ContentConnection[] {
  return [...TEST_CONNECTIONS, ...FORTUNE_CONNECTIONS];
}

/**
 * 특정 콘텐츠로 연결되는 모든 소스 가져오기
 */
export function getSourcesFor(targetId: string, type?: ConnectionType): ContentConnection[] {
  const all = getAllConnections();
  return all.filter(c => c.to === targetId && (!type || c.type === type));
}

/**
 * 관련도 높은 순으로 정렬된 연결 가져오기
 */
export function getTopConnections(
  fromId: string,
  type?: ConnectionType,
  limit: number = 3
): ContentConnection[] {
  const all = [...TEST_CONNECTIONS, ...FORTUNE_CONNECTIONS];
  return all
    .filter(c => c.from === fromId && (!type || c.type === type))
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);
}
