// ============================================================================
// 테스트 결과 → 인사이트 태그 매핑
// ============================================================================
// 각 테스트의 차원 점수를 인사이트 태그로 변환
// Stage 1, 2에서 사용

import type { PersonalityTag, DecisionTag, RelationshipTag, InterestTag, LifestyleTag } from './insight-tags';

// ============================================================================
// 타입 정의
// ============================================================================

/** 차원별 태그 매핑 */
export interface DimensionTagMapping {
  /** HIGH 레벨 (60% 이상)일 때 적용되는 태그 */
  high: (PersonalityTag | DecisionTag | RelationshipTag | InterestTag | LifestyleTag)[];
  /** LOW 레벨 (40% 미만)일 때 적용되는 태그 */
  low: (PersonalityTag | DecisionTag | RelationshipTag | InterestTag | LifestyleTag)[];
}

/** 테스트별 태그 매핑 설정 */
export interface TestTagMapping {
  /** 테스트 ID */
  testId: string;
  /** 테스트 카테고리 */
  category: 'personality' | 'pet' | 'relationship' | 'lifestyle' | 'preference';
  /** 차원별 태그 매핑 */
  dimensions: Record<string, DimensionTagMapping>;
  /** 관계 활동으로 카운트할지 여부 */
  countsAsRelationship: boolean;
}

// ============================================================================
// Human (Big Five 기반) 테스트 태그 매핑
// ============================================================================

export const HUMAN_TAG_MAPPING: TestTagMapping = {
  testId: 'human',
  category: 'personality',
  countsAsRelationship: false,
  dimensions: {
    inssa: {
      high: ['extroverted', 'leading', 'together', 'socially-confident', 'expressive'],
      low: ['introverted', 'independent', 'solo', 'reserved', 'observant'],
    },
    adventure: {
      high: ['intuitive', 'spontaneous', 'adventurous', 'risk-taking', 'instinctive'],
      low: ['analytical', 'structured', 'safe', 'deliberate', 'conservative'],
    },
    empathy: {
      high: ['emotional', 'supportive', 'other-first', 'empathetic', 'nurturing'],
      low: ['logical', 'self-first', 'pragmatic', 'data-driven'],
    },
    plan: {
      high: ['planned', 'structured', 'practical', 'organized', 'systematic'],
      low: ['spontaneous', 'flexible', 'holistic'],
    },
    mental: {
      high: ['resilient', 'calm'],
      low: ['sensitive', 'excitable'],
    },
  },
};

// ============================================================================
// Cat (Feline Five 기반) 테스트 태그 매핑
// ============================================================================

export const CAT_TAG_MAPPING: TestTagMapping = {
  testId: 'cat',
  category: 'pet',
  countsAsRelationship: false,
  dimensions: {
    curious: {
      high: ['intuitive', 'adventurous', 'innovative'],
      low: ['analytical', 'safe', 'conservative'],
    },
    alert: {
      high: ['sensitive', 'analytical', 'excitable', 'observant'],
      low: ['resilient', 'flexible', 'calm'],
    },
    boss: {
      high: ['leading', 'independent', 'competing', 'assertive'],
      low: ['collaborative', 'accommodating', 'diplomatic'],
    },
    random: {
      high: ['spontaneous', 'intuitive', 'instinctive'],
      low: ['planned', 'structured', 'organized'],
    },
    cute: {
      high: ['expressive', 'collaborative', 'empathetic', 'nurturing'],
      low: ['reserved', 'independent', 'space-needing'],
    },
  },
};

// ============================================================================
// Dog (C-BARQ 기반) 테스트 태그 매핑
// ============================================================================

export const DOG_TAG_MAPPING: TestTagMapping = {
  testId: 'dog',
  category: 'pet',
  countsAsRelationship: false,
  dimensions: {
    energy: {
      high: ['extroverted', 'adventurous', 'energetic', 'active'],
      low: ['introverted', 'safe', 'relaxed', 'homebody'],
    },
    humanLove: {
      high: ['expressive', 'close-bonding', 'other-first', 'empathetic', 'nurturing'],
      low: ['reserved', 'space-needing', 'independent'],
    },
    dogFriend: {
      high: ['collaborative', 'together', 'socially-confident'],
      low: ['independent', 'solo', 'socially-anxious'],
    },
    focus: {
      high: ['planned', 'structured', 'analytical', 'organized', 'systematic'],
      low: ['spontaneous', 'flexible', 'instinctive'],
    },
    brave: {
      high: ['resilient', 'adventurous', 'competing', 'risk-taking'],
      low: ['sensitive', 'avoiding', 'cautious'],
    },
    persist: {
      high: ['structured', 'practical', 'routine-oriented'],
      low: ['flexible', 'spontaneous'],
    },
  },
};

// ============================================================================
// IdealType (연애 성향) 테스트 태그 매핑
// ============================================================================

export const IDEALTYPE_TAG_MAPPING: TestTagMapping = {
  testId: 'idealType',
  category: 'relationship',
  countsAsRelationship: true,
  dimensions: {
    passion: {
      high: ['expressive', 'emotional', 'sentimental', 'romantic'],
      low: ['reserved', 'practical', 'pragmatic'],
    },
    commit: {
      high: ['structured', 'planned', 'future-focused', 'organized'],
      low: ['spontaneous', 'present-focused', 'flexible'],
    },
    close: {
      high: ['close-bonding', 'together', 'expressive', 'empathetic'],
      low: ['space-needing', 'independent', 'reserved'],
    },
    express: {
      high: ['expressive', 'direct', 'articulate'],
      low: ['reserved', 'indirect', 'tactful'],
    },
    active: {
      high: ['extroverted', 'adventurous', 'together', 'active'],
      low: ['introverted', 'solo', 'homebody'],
    },
  },
};

// ============================================================================
// ConflictStyle (갈등 대처) 테스트 태그 매핑
// ============================================================================

export const CONFLICTSTYLE_TAG_MAPPING: TestTagMapping = {
  testId: 'conflictStyle',
  category: 'relationship',
  countsAsRelationship: true,
  dimensions: {
    assert: {
      high: ['competing', 'direct', 'leading', 'assertive'],
      low: ['accommodating', 'indirect', 'diplomatic'],
    },
    engage: {
      high: ['collaborating', 'direct', 'articulate'],
      low: ['avoiding', 'reserved', 'cautious'],
    },
    repair: {
      high: ['collaborating', 'compromising', 'empathetic'],
      low: ['competing', 'avoiding'],
    },
    empathy: {
      high: ['other-first', 'accommodating', 'supportive', 'empathetic', 'nurturing'],
      low: ['self-first', 'competing', 'pragmatic'],
    },
    express: {
      high: ['expressive', 'direct', 'articulate'],
      low: ['reserved', 'indirect', 'tactful'],
    },
    support: {
      high: ['supportive', 'collaborative', 'other-first', 'nurturing'],
      low: ['independent', 'self-first'],
    },
  },
};

// ============================================================================
// Coffee 테스트 태그 매핑
// ============================================================================

export const COFFEE_TAG_MAPPING: TestTagMapping = {
  testId: 'coffee',
  category: 'lifestyle',
  countsAsRelationship: false,
  dimensions: {
    bitter: {
      high: ['practical', 'resilient', 'pragmatic'],
      low: ['sentimental', 'sensitive', 'emotional'],
    },
    sweet: {
      high: ['sentimental', 'emotional', 'romantic'],
      low: ['practical', 'logical', 'data-driven'],
    },
    caffeine: {
      high: ['extroverted', 'adventurous', 'energetic'],
      low: ['introverted', 'safe', 'relaxed'],
    },
    temperature: {
      high: ['structured', 'traditional'], // 뜨거운 것 선호 = 전통적
      low: ['flexible', 'innovative'],    // 차가운 것 선호 = 현대적
    },
    mood: {
      high: ['emotional', 'sentimental', 'intuitive'],
      low: ['practical', 'logical', 'analytical'],
    },
  },
};

// ============================================================================
// Plant 테스트 태그 매핑
// ============================================================================

export const PLANT_TAG_MAPPING: TestTagMapping = {
  testId: 'plant',
  category: 'lifestyle',
  countsAsRelationship: false,
  dimensions: {
    care: {
      high: ['planned', 'structured', 'supportive', 'organized', 'routine-oriented'],
      low: ['spontaneous', 'flexible'],
    },
    light: {
      high: ['extroverted', 'energetic'],
      low: ['introverted', 'relaxed'],
    },
    water: {
      high: ['supportive', 'other-first', 'nurturing'],
      low: ['independent', 'self-first'],
    },
    space: {
      high: ['adventurous', 'innovative'],
      low: ['safe', 'conservative'],
    },
    style: {
      high: ['sentimental', 'intuitive', 'artistic'],
      low: ['practical', 'analytical', 'data-driven'],
    },
  },
};

// ============================================================================
// PetMatch 테스트 태그 매핑
// ============================================================================

export const PETMATCH_TAG_MAPPING: TestTagMapping = {
  testId: 'petMatch',
  category: 'lifestyle',
  countsAsRelationship: false,
  dimensions: {
    lifestyle: {
      high: ['extroverted', 'adventurous', 'together', 'active', 'energetic'],
      low: ['introverted', 'safe', 'solo', 'homebody', 'relaxed'],
    },
    space: {
      high: ['flexible', 'innovative'],
      low: ['structured', 'organized'],
    },
    time: {
      high: ['supportive', 'other-first', 'nurturing'],
      low: ['independent', 'self-first'],
    },
    experience: {
      high: ['analytical', 'structured', 'data-driven', 'systematic'],
      low: ['intuitive', 'spontaneous', 'instinctive'],
    },
    interaction: {
      high: ['expressive', 'close-bonding', 'empathetic'],
      low: ['reserved', 'space-needing', 'independent'],
    },
  },
};

// ============================================================================
// Rabbit 테스트 태그 매핑
// ============================================================================

export const RABBIT_TAG_MAPPING: TestTagMapping = {
  testId: 'rabbit',
  category: 'pet',
  countsAsRelationship: false,
  dimensions: {
    curious: {
      high: ['intuitive', 'adventurous', 'innovative'],
      low: ['analytical', 'safe', 'cautious'],
    },
    social: {
      high: ['extroverted', 'together', 'collaborative', 'socially-confident'],
      low: ['introverted', 'solo', 'independent', 'socially-anxious'],
    },
    active: {
      high: ['extroverted', 'spontaneous', 'energetic'],
      low: ['introverted', 'structured', 'relaxed'],
    },
    brave: {
      high: ['resilient', 'adventurous', 'risk-taking'],
      low: ['sensitive', 'safe', 'cautious'],
    },
    chill: {
      high: ['flexible', 'resilient', 'calm'],
      low: ['structured', 'sensitive', 'excitable'],
    },
  },
};

// ============================================================================
// Hamster 테스트 태그 매핑
// ============================================================================

export const HAMSTER_TAG_MAPPING: TestTagMapping = {
  testId: 'hamster',
  category: 'pet',
  countsAsRelationship: false,
  dimensions: {
    curious: {
      high: ['intuitive', 'adventurous', 'innovative'],
      low: ['analytical', 'safe', 'conservative'],
    },
    hoard: {
      high: ['planned', 'practical', 'future-focused', 'organized', 'collector'],
      low: ['spontaneous', 'present-focused', 'minimalist'],
    },
    active: {
      high: ['extroverted', 'adventurous', 'energetic'],
      low: ['introverted', 'safe', 'relaxed'],
    },
    tame: {
      high: ['collaborative', 'supportive', 'empathetic'],
      low: ['independent', 'self-first'],
    },
    nocturnal: {
      high: ['flexible', 'spontaneous', 'night-owl'],
      low: ['structured', 'planned', 'morning-person'],
    },
  },
};

// ============================================================================
// Attachment (애착 유형) 테스트 태그 매핑
// ============================================================================

export const ATTACHMENT_TAG_MAPPING: TestTagMapping = {
  testId: 'attachment',
  category: 'relationship',
  countsAsRelationship: true,
  dimensions: {
    anxiety: {
      high: ['sensitive', 'emotional', 'close-bonding', 'other-first', 'empathetic', 'excitable'],
      low: ['resilient', 'independent', 'space-needing', 'calm'],
    },
    avoidance: {
      high: ['space-needing', 'independent', 'reserved', 'avoiding', 'self-first'],
      low: ['close-bonding', 'expressive', 'collaborative', 'supportive', 'nurturing'],
    },
  },
};

// ============================================================================
// 전체 테스트 매핑 레지스트리
// ============================================================================

export const TEST_TAG_MAPPINGS: Record<string, TestTagMapping> = {
  human: HUMAN_TAG_MAPPING,
  cat: CAT_TAG_MAPPING,
  dog: DOG_TAG_MAPPING,
  idealType: IDEALTYPE_TAG_MAPPING,
  conflictStyle: CONFLICTSTYLE_TAG_MAPPING,
  coffee: COFFEE_TAG_MAPPING,
  plant: PLANT_TAG_MAPPING,
  petMatch: PETMATCH_TAG_MAPPING,
  rabbit: RABBIT_TAG_MAPPING,
  hamster: HAMSTER_TAG_MAPPING,
  attachment: ATTACHMENT_TAG_MAPPING,
};

// ============================================================================
// 헬퍼 함수
// ============================================================================

/** 점수 비율 → 레벨 변환 */
function getLevel(scorePercent: number): 'high' | 'medium' | 'low' {
  if (scorePercent >= 60) return 'high';
  if (scorePercent >= 40) return 'medium';
  return 'low';
}

/**
 * 테스트 결과에서 태그 추출
 * @param testId 테스트 ID
 * @param dimensions 차원별 점수
 * @param dimCounts 차원별 질문 수 (optional, 없으면 균등 배분 가정)
 */
export function extractTagsFromTestResult(
  testId: string,
  dimensions: Record<string, number>,
  dimCounts?: Record<string, number>
): string[] {
  const mapping = TEST_TAG_MAPPINGS[testId];
  if (!mapping) {
    console.warn(`[extractTagsFromTestResult] No mapping for test: ${testId}`);
    return [];
  }

  const tags: Set<string> = new Set();
  const dimensionCount = Object.keys(mapping.dimensions).length;

  for (const [dimensionKey, score] of Object.entries(dimensions)) {
    const dimMapping = mapping.dimensions[dimensionKey];
    if (!dimMapping) continue;

    // 차원별 질문 수: 전달받으면 사용, 아니면 기본값 추정
    const dimQuestionCount = dimCounts?.[dimensionKey] ?? Math.ceil(12 / dimensionCount);
    const dimMaxScore = dimQuestionCount * 5;
    const scorePercent = (score / dimMaxScore) * 100;
    const level = getLevel(scorePercent);

    if (level === 'high') {
      dimMapping.high.forEach(tag => tags.add(tag));
    } else if (level === 'low') {
      dimMapping.low.forEach(tag => tags.add(tag));
    }
    // MEDIUM은 태그 없음 (중립)
  }

  return Array.from(tags);
}

/**
 * 테스트가 관계 활동으로 카운트되는지 확인
 */
export function isRelationshipTest(testId: string): boolean {
  const mapping = TEST_TAG_MAPPINGS[testId];
  return mapping?.countsAsRelationship ?? false;
}

/**
 * 테스트 카테고리 조회
 */
export function getTestCategory(testId: string): string {
  const mapping = TEST_TAG_MAPPINGS[testId];
  return mapping?.category ?? 'unknown';
}

/**
 * 테스트 데이터에서 차원별 질문 수 계산
 * @param questions 테스트 질문 배열
 * @returns 차원별 질문 수 Record
 */
export function getDimensionQuestionCounts(
  questions: Array<{ dimension: string }>
): Record<string, number> {
  const counts: Record<string, number> = {};

  for (const q of questions) {
    counts[q.dimension] = (counts[q.dimension] || 0) + 1;
  }

  return counts;
}
