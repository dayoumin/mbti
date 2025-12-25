// ============================================================================
// 테스트 결과 → 인사이트 태그 매핑
// ============================================================================
// 각 테스트의 차원 점수를 인사이트 태그로 변환
// Stage 1, 2에서 사용

import type { PersonalityTag, DecisionTag, RelationshipTag } from '@/app/dashboard/data/insight-system';

// ============================================================================
// 타입 정의
// ============================================================================

/** 차원별 태그 매핑 */
export interface DimensionTagMapping {
  /** HIGH 레벨 (60% 이상)일 때 적용되는 태그 */
  high: (PersonalityTag | DecisionTag | RelationshipTag)[];
  /** LOW 레벨 (40% 미만)일 때 적용되는 태그 */
  low: (PersonalityTag | DecisionTag | RelationshipTag)[];
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
      high: ['extroverted', 'leading', 'together'],
      low: ['introverted', 'independent', 'solo'],
    },
    adventure: {
      high: ['intuitive', 'spontaneous', 'adventurous'],
      low: ['analytical', 'structured', 'safe'],
    },
    empathy: {
      high: ['emotional', 'supportive', 'other-first'],
      low: ['logical', 'self-first'],
    },
    plan: {
      high: ['planned', 'structured', 'practical'],
      low: ['spontaneous', 'flexible'],
    },
    mental: {
      high: ['resilient'],
      low: ['sensitive'],
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
      high: ['intuitive', 'adventurous'],
      low: ['analytical', 'safe'],
    },
    alert: {
      high: ['sensitive', 'analytical'],
      low: ['resilient', 'flexible'],
    },
    boss: {
      high: ['leading', 'independent', 'competing'],
      low: ['collaborative', 'accommodating'],
    },
    random: {
      high: ['spontaneous', 'intuitive'],
      low: ['planned', 'structured'],
    },
    cute: {
      high: ['expressive', 'collaborative'],
      low: ['reserved', 'independent'],
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
      high: ['extroverted', 'adventurous'],
      low: ['introverted', 'safe'],
    },
    humanLove: {
      high: ['expressive', 'close-bonding', 'other-first'],
      low: ['reserved', 'space-needing'],
    },
    dogFriend: {
      high: ['collaborative', 'together'],
      low: ['independent', 'solo'],
    },
    focus: {
      high: ['planned', 'structured', 'analytical'],
      low: ['spontaneous', 'flexible'],
    },
    brave: {
      high: ['resilient', 'adventurous', 'competing'],
      low: ['sensitive', 'avoiding'],
    },
    persist: {
      high: ['structured', 'practical'],
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
      high: ['expressive', 'emotional', 'sentimental'],
      low: ['reserved', 'practical'],
    },
    commit: {
      high: ['structured', 'planned', 'future-focused'],
      low: ['spontaneous', 'present-focused'],
    },
    close: {
      high: ['close-bonding', 'together', 'expressive'],
      low: ['space-needing', 'independent'],
    },
    express: {
      high: ['expressive', 'direct'],
      low: ['reserved', 'indirect'],
    },
    active: {
      high: ['extroverted', 'adventurous', 'together'],
      low: ['introverted', 'solo'],
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
      high: ['competing', 'direct', 'leading'],
      low: ['accommodating', 'indirect'],
    },
    engage: {
      high: ['collaborating', 'direct'],
      low: ['avoiding', 'reserved'],
    },
    repair: {
      high: ['collaborating', 'compromising'],
      low: ['competing', 'avoiding'],
    },
    empathy: {
      high: ['other-first', 'accommodating', 'supportive'],
      low: ['self-first', 'competing'],
    },
    express: {
      high: ['expressive', 'direct'],
      low: ['reserved', 'indirect'],
    },
    support: {
      high: ['supportive', 'collaborative', 'other-first'],
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
      high: ['practical', 'resilient'],
      low: ['sentimental', 'sensitive'],
    },
    sweet: {
      high: ['sentimental', 'emotional'],
      low: ['practical', 'logical'],
    },
    caffeine: {
      high: ['extroverted', 'adventurous'],
      low: ['introverted', 'safe'],
    },
    temperature: {
      high: ['structured'], // 뜨거운 것 선호 = 전통적
      low: ['flexible'],    // 차가운 것 선호 = 현대적
    },
    mood: {
      high: ['emotional', 'sentimental'],
      low: ['practical', 'logical'],
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
      high: ['planned', 'structured', 'supportive'],
      low: ['spontaneous', 'flexible'],
    },
    light: {
      high: ['extroverted'],
      low: ['introverted'],
    },
    water: {
      high: ['supportive', 'other-first'],
      low: ['independent'],
    },
    space: {
      high: ['adventurous'],
      low: ['safe'],
    },
    style: {
      high: ['sentimental', 'intuitive'],
      low: ['practical', 'analytical'],
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
      high: ['extroverted', 'adventurous', 'together'],
      low: ['introverted', 'safe', 'solo'],
    },
    space: {
      high: ['flexible'],
      low: ['structured'],
    },
    time: {
      high: ['supportive', 'other-first'],
      low: ['independent'],
    },
    experience: {
      high: ['analytical', 'structured'],
      low: ['intuitive', 'spontaneous'],
    },
    interaction: {
      high: ['expressive', 'close-bonding'],
      low: ['reserved', 'space-needing'],
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
      high: ['intuitive', 'adventurous'],
      low: ['analytical', 'safe'],
    },
    social: {
      high: ['extroverted', 'together', 'collaborative'],
      low: ['introverted', 'solo', 'independent'],
    },
    active: {
      high: ['extroverted', 'spontaneous'],
      low: ['introverted', 'structured'],
    },
    brave: {
      high: ['resilient', 'adventurous'],
      low: ['sensitive', 'safe'],
    },
    chill: {
      high: ['flexible', 'resilient'],
      low: ['structured', 'sensitive'],
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
      high: ['intuitive', 'adventurous'],
      low: ['analytical', 'safe'],
    },
    hoard: {
      high: ['planned', 'practical', 'future-focused'],
      low: ['spontaneous', 'present-focused'],
    },
    active: {
      high: ['extroverted', 'adventurous'],
      low: ['introverted', 'safe'],
    },
    tame: {
      high: ['collaborative', 'supportive'],
      low: ['independent'],
    },
    nocturnal: {
      high: ['flexible', 'spontaneous'],
      low: ['structured', 'planned'],
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
 */
export function extractTagsFromTestResult(
  testId: string,
  dimensions: Record<string, number>,
  questionCount: number = 12
): string[] {
  const mapping = TEST_TAG_MAPPINGS[testId];
  if (!mapping) {
    console.warn(`[extractTagsFromTestResult] No mapping for test: ${testId}`);
    return [];
  }

  const tags: Set<string> = new Set();
  const maxScore = questionCount * 5; // 최대 점수 (문항당 5점)

  for (const [dimensionKey, score] of Object.entries(dimensions)) {
    const dimMapping = mapping.dimensions[dimensionKey];
    if (!dimMapping) continue;

    // 차원당 질문 수 추정 (균등 배분 가정)
    const dimQuestionCount = Math.ceil(questionCount / Object.keys(mapping.dimensions).length);
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
