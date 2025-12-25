// ============================================================================
// 인사이트 태그 시스템 - SSOT (Single Source of Truth)
// ============================================================================
// 모든 인사이트 태그는 여기서 정의됩니다.
// InsightService, content-generator 스킬, 검증 스크립트 모두 이 파일을 참조합니다.

// ============================================================================
// 1. 성격 태그 (Personality Tags) - Big Five 기반
// ============================================================================

export const PERSONALITY_TAGS = [
  // 에너지 방향 (외향성)
  'extroverted',    // 외향적 - 사람들과 어울리기 좋아함
  'introverted',    // 내향적 - 혼자 시간 선호
  'ambiverted',     // 양향적 - 상황에 따라 유연

  // 정보 처리 (개방성)
  'logical',        // 논리적 - 분석적으로 판단
  'emotional',      // 감성적 - 감정/직관으로 판단
  'intuitive',      // 직관적 - 본능을 신뢰
  'analytical',     // 분석적 - 데이터 중시

  // 행동 방식 (성실성)
  'planned',        // 계획적 - 미리 준비
  'spontaneous',    // 즉흥적 - 순간에 따라
  'flexible',       // 유연한 - 적응력 좋음
  'structured',     // 체계적 - 질서 중시

  // 관계 스타일 (친화성)
  'independent',    // 독립적 - 혼자서도 잘함
  'collaborative',  // 협력적 - 함께 해결
  'supportive',     // 지지적 - 상대를 먼저 배려
  'leading',        // 주도적 - 앞장서서 이끔

  // 정서 안정성 (신경성)
  'resilient',      // 회복력 있는 - 스트레스에 강함
  'sensitive',      // 민감한 - 감정에 예민

  // 표현력
  'expressive',     // 표현적 - 감정/생각을 적극 표현
  'reserved',       // 절제된 - 감정 표현 조심스러움
] as const;

export type PersonalityTag = typeof PERSONALITY_TAGS[number];

// ============================================================================
// 2. 판단 태그 (Decision Tags) - 의사결정 스타일
// ============================================================================

export const DECISION_TAGS = [
  // 판단 기준
  'practical',      // 실용적 - 현실적 기준
  'sentimental',    // 감성적 - 감정 기반 (emotional과 구분)

  // 위험 성향
  'adventurous',    // 모험적 - 새로운 시도 선호
  'safe',           // 안전 추구 - 검증된 것 선호
  'cautious',       // 신중한 - 충분히 고려 후 결정

  // 사회성
  'solo',           // 혼자 지향 - 독립적 활동
  'together',       // 함께 지향 - 협력적 활동

  // 커뮤니케이션
  'direct',         // 직접적 - 솔직하게 말함
  'indirect',       // 간접적 - 돌려서 표현

  // 시간 지향
  'present-focused', // 현재 중심 - 지금을 즐김
  'future-focused',  // 미래 중심 - 장기적 관점
] as const;

export type DecisionTag = typeof DECISION_TAGS[number];

// ============================================================================
// 3. 관계 태그 (Relationship Tags) - TKI 갈등 모델 기반
// ============================================================================

export const RELATIONSHIP_TAGS = [
  // 갈등 대처 (TKI 5유형)
  'competing',      // 경쟁형 - 자기 주장 강함
  'avoiding',       // 회피형 - 갈등 피함
  'accommodating',  // 수용형 - 상대에게 양보
  'collaborating',  // 협력형 - 함께 해결책 찾음
  'compromising',   // 타협형 - 중간 지점 찾음

  // 친밀도 선호
  'close-bonding',  // 밀착형 - 가까운 관계 선호
  'space-needing',  // 거리형 - 개인 공간 중요

  // 배려 방향
  'self-first',     // 자기 우선 - 자신의 니즈 먼저
  'other-first',    // 타인 우선 - 상대의 니즈 먼저

  // 소통 스타일
  'assertive',      // 주장적 - 자기 의견 분명히
  'diplomatic',     // 외교적 - 부드럽게 조율
] as const;

export type RelationshipTag = typeof RELATIONSHIP_TAGS[number];

// ============================================================================
// 4. 관심사 태그 (Interest Tags) - Stage 4 관심사 지도
// ============================================================================
// 카테고리 기반 관심사 자동 추출

export const INTEREST_TAGS = [
  // 반려동물
  'interest-cat',       // 고양이
  'interest-dog',       // 강아지
  'interest-rabbit',    // 토끼
  'interest-hamster',   // 햄스터
  'interest-bird',      // 새
  'interest-fish',      // 물고기
  'interest-reptile',   // 파충류
  'interest-pet',       // 반려동물 전반

  // 식물/자연
  'interest-plant',     // 식물
  'interest-nature',    // 자연

  // 음식/음료
  'interest-coffee',    // 커피
  'interest-food',      // 음식
  'interest-alcohol',   // 주류 (성인)

  // 관계/라이프스타일
  'interest-love',      // 연애
  'interest-lifestyle', // 라이프스타일
  'interest-money',     // 재테크/돈

  // 운세/심리
  'interest-tarot',     // 타로
  'interest-zodiac',    // 별자리/띠
  'interest-psychology',// 심리
] as const;

export type InterestTag = typeof INTEREST_TAGS[number];

// ============================================================================
// 5. 라이프스타일 태그 (Lifestyle Tags) - 생활 방식
// ============================================================================

export const LIFESTYLE_TAGS = [
  // 활동 수준
  'active',           // 활동적
  'homebody',         // 집순이/집돌이

  // 소비 성향
  'frugal',           // 절약형
  'splurger',         // 소비형

  // 시간 선호
  'morning-person',   // 아침형
  'night-owl',        // 저녁형

  // 취미 스타일
  'creative',         // 창작형
  'consuming',        // 소비형 (콘텐츠 즐기기)
] as const;

export type LifestyleTag = typeof LIFESTYLE_TAGS[number];

// ============================================================================
// 통합 타입
// ============================================================================

export type InsightTag =
  | PersonalityTag
  | DecisionTag
  | RelationshipTag
  | InterestTag
  | LifestyleTag;

// 전체 인사이트 태그 Set (필터링용)
export const VALID_INSIGHT_TAGS = new Set<string>([
  ...PERSONALITY_TAGS,
  ...DECISION_TAGS,
  ...RELATIONSHIP_TAGS,
  ...INTEREST_TAGS,
  ...LIFESTYLE_TAGS,
]);

// ============================================================================
// 카테고리 → 관심사 태그 자동 매핑
// ============================================================================

export const CATEGORY_TO_INTEREST: Record<string, InterestTag> = {
  // 반려동물
  cat: 'interest-cat',
  dog: 'interest-dog',
  rabbit: 'interest-rabbit',
  hamster: 'interest-hamster',
  bird: 'interest-bird',
  fish: 'interest-fish',
  reptile: 'interest-reptile',

  // 식물/음료
  plant: 'interest-plant',
  coffee: 'interest-coffee',
  food: 'interest-food',
  alcohol: 'interest-alcohol',

  // 관계/라이프스타일
  love: 'interest-love',
  lifestyle: 'interest-lifestyle',
  money: 'interest-money',

  // 운세
  tarot: 'interest-tarot',
  zodiac: 'interest-zodiac',
};

/**
 * 카테고리에서 관심사 태그 추출
 * @example getInterestTagFromCategory('cat') → 'interest-cat'
 */
export function getInterestTagFromCategory(category: string): InterestTag | null {
  return CATEGORY_TO_INTEREST[category] || null;
}

// ============================================================================
// 태그 유틸리티
// ============================================================================

/**
 * 태그가 유효한 인사이트 태그인지 확인
 */
export function isValidInsightTag(tag: string): tag is InsightTag {
  return VALID_INSIGHT_TAGS.has(tag);
}

/**
 * 태그 배열에서 유효한 것만 필터링
 */
export function filterValidTags(tags: string[]): InsightTag[] {
  return tags.filter(isValidInsightTag) as InsightTag[];
}

/**
 * 태그의 카테고리 판별
 */
export function getTagCategory(
  tag: InsightTag
): 'personality' | 'decision' | 'relationship' | 'interest' | 'lifestyle' {
  if ((PERSONALITY_TAGS as readonly string[]).includes(tag)) return 'personality';
  if ((DECISION_TAGS as readonly string[]).includes(tag)) return 'decision';
  if ((RELATIONSHIP_TAGS as readonly string[]).includes(tag)) return 'relationship';
  if ((INTEREST_TAGS as readonly string[]).includes(tag)) return 'interest';
  return 'lifestyle';
}

// ============================================================================
// 타입 강제용 InsightTags 인터페이스
// ============================================================================
// content/types.ts의 InsightTags를 대체할 수 있는 엄격한 버전

export interface StrictInsightTags {
  personality?: PersonalityTag[];
  decision?: DecisionTag[];
  relationship?: RelationshipTag[];
  interest?: InterestTag[];
  lifestyle?: LifestyleTag[];
}
