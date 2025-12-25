// ============================================================================
// Stage 2: 성격 조합 룰 (15개)
// ============================================================================
// 테스트 3개 이상 완료 시 해금
// 여러 테스트 결과를 교차 분석하여 복합 인사이트 제공

import type { PersonalityTag, DecisionTag, RelationshipTag } from '@/app/dashboard/data/insight-system';

// ============================================================================
// 타입 정의
// ============================================================================

export interface Stage2Rule {
  id: string;
  name: string;
  nameKr: string;
  priority: number; // 낮을수록 우선
  confidence: 'high' | 'medium' | 'low';
  source?: string;

  // 조건: 필요한 태그 조합
  conditions: {
    required: (PersonalityTag | DecisionTag | RelationshipTag)[];
    optional?: (PersonalityTag | DecisionTag | RelationshipTag)[];
    conflicting?: (PersonalityTag | DecisionTag | RelationshipTag)[]; // 있으면 매칭 안됨
    minTagCount?: number; // required 중 최소 몇 개
  };

  // 인사이트 결과
  insight: {
    emoji: string;
    title: string;
    description: string;
    explanation: string;
    actionTip?: string;
  };
}

// ============================================================================
// Stage 2 룰 정의 (15개)
// ============================================================================

export const STAGE2_RULES: Stage2Rule[] = [
  // ═══════════════════════════════════════════════════════════════
  // 외향/내향 조합 (5개)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'combo-001',
    name: 'Social Butterfly',
    nameKr: '사교적인 나비',
    priority: 10,
    confidence: 'high',
    source: 'Big Five - Extraversion',
    conditions: {
      required: ['extroverted', 'expressive', 'together'],
      minTagCount: 2,
    },
    insight: {
      emoji: '🦋',
      title: '에너지 넘치는 사교가',
      description: '사람들과 함께할 때 에너지가 충전되는 타입이에요. 모임의 중심에서 빛나요.',
      explanation: '외향성 + 표현력 + 함께하기 선호의 조합',
      actionTip: '혼자 있는 시간도 가끔 필요해요. 재충전을 위한 "나만의 시간"을 챙겨보세요.',
    },
  },

  {
    id: 'combo-002',
    name: 'Quiet Observer',
    nameKr: '조용한 관찰자',
    priority: 10,
    confidence: 'high',
    source: 'Big Five - Introversion',
    conditions: {
      required: ['introverted', 'analytical', 'solo'],
      minTagCount: 2,
    },
    insight: {
      emoji: '🌙',
      title: '깊이 있는 관찰자',
      description: '혼자만의 시간을 통해 에너지를 충전하고, 깊이 있게 생각하는 것을 좋아해요.',
      explanation: '내향성 + 분석적 + 혼자 선호의 조합',
      actionTip: '소규모 모임이나 1:1 대화가 더 편할 수 있어요.',
    },
  },

  {
    id: 'combo-003',
    name: 'Selective Socializer',
    nameKr: '선택적 사교가',
    priority: 15,
    confidence: 'medium',
    conditions: {
      required: ['introverted', 'expressive'],
      optional: ['close-bonding'],
    },
    insight: {
      emoji: '🎭',
      title: '선택적 사교가',
      description: '평소엔 조용하지만, 친한 사람들 앞에서는 활발하게 표현해요.',
      explanation: '내향성이지만 표현력이 높은 흥미로운 조합',
      actionTip: '신뢰하는 사람들과의 시간이 당신에게 특별히 소중해요.',
    },
  },

  {
    id: 'combo-004',
    name: 'Quiet Leader',
    nameKr: '조용한 리더',
    priority: 15,
    confidence: 'medium',
    conditions: {
      required: ['introverted', 'leading'],
      conflicting: ['avoiding'],
    },
    insight: {
      emoji: '🌟',
      title: '조용한 영향력',
      description: '말보다 행동으로 보여주는 리더십을 가졌어요. 조용하지만 강한 존재감!',
      explanation: '내향성 + 리더십의 독특한 조합',
      actionTip: '당신의 차분한 카리스마는 큰 강점이에요.',
    },
  },

  {
    id: 'combo-005',
    name: 'Social Chameleon',
    nameKr: '사회적 카멜레온',
    priority: 20,
    confidence: 'medium',
    conditions: {
      required: ['flexible', 'collaborative'],
      optional: ['extroverted', 'introverted'],
    },
    insight: {
      emoji: '🦎',
      title: '적응의 달인',
      description: '상황에 따라 외향적일 수도, 내향적일 수도 있어요. 유연한 사회성을 가졌어요.',
      explanation: '유연성 + 협력적 성향의 조합',
      actionTip: '다양한 사람들과 잘 어울리는 건 큰 장점이에요!',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 의사결정 스타일 (4개)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'combo-006',
    name: 'Practical Strategist',
    nameKr: '실용적 전략가',
    priority: 10,
    confidence: 'high',
    conditions: {
      required: ['practical', 'planned', 'analytical'],
      minTagCount: 2,
    },
    insight: {
      emoji: '📊',
      title: '체계적인 전략가',
      description: '합리적이고 계획적으로 결정해요. 감정보다 논리를 우선시하는 편이에요.',
      explanation: '실용성 + 계획성 + 분석적 사고의 조합',
      actionTip: '가끔은 즉흥적인 결정도 재미있을 수 있어요!',
    },
  },

  {
    id: 'combo-007',
    name: 'Heart-led Decider',
    nameKr: '마음을 따르는 사람',
    priority: 10,
    confidence: 'high',
    conditions: {
      required: ['emotional', 'sentimental', 'intuitive'],
      minTagCount: 2,
    },
    insight: {
      emoji: '💖',
      title: '감성적 결정자',
      description: '마음이 이끄는 대로 결정해요. 직감을 신뢰하고 감정을 중요하게 생각해요.',
      explanation: '감성 + 정서적 + 직관적 사고의 조합',
      actionTip: '당신의 직감은 대부분 맞아요. 하지만 중요한 결정은 한 박자 쉬어가도 좋아요.',
    },
  },

  {
    id: 'combo-008',
    name: 'Adventurous Spirit',
    nameKr: '모험 정신',
    priority: 15,
    confidence: 'medium',
    conditions: {
      required: ['adventurous', 'spontaneous'],
      conflicting: ['safe'],
    },
    insight: {
      emoji: '🚀',
      title: '두려움 없는 도전자',
      description: '새로운 경험을 두려워하지 않아요. 안전보다 흥미를 선택하는 편이에요.',
      explanation: '모험심 + 즉흥성의 조합',
      actionTip: '가끔은 안전한 선택도 현명할 수 있어요. 균형을 찾아보세요.',
    },
  },

  {
    id: 'combo-009',
    name: 'Steady Anchor',
    nameKr: '안정적인 닻',
    priority: 15,
    confidence: 'medium',
    conditions: {
      required: ['safe', 'structured', 'planned'],
      minTagCount: 2,
    },
    insight: {
      emoji: '⚓',
      title: '안정의 수호자',
      description: '예측 가능한 것을 좋아하고, 안전한 선택을 선호해요.',
      explanation: '안전 추구 + 체계성 + 계획성의 조합',
      actionTip: '안정감은 큰 장점이에요. 하지만 때론 작은 변화도 시도해보세요.',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 관계 스타일 (4개)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'combo-010',
    name: 'Empathic Connector',
    nameKr: '공감하는 연결자',
    priority: 10,
    confidence: 'high',
    source: 'TKI - Accommodating/Collaborating',
    conditions: {
      required: ['supportive', 'other-first', 'collaborating'],
      minTagCount: 2,
    },
    insight: {
      emoji: '🤝',
      title: '따뜻한 공감자',
      description: '상대방의 입장을 먼저 생각해요. 관계에서 조화를 중요하게 여겨요.',
      explanation: '지지적 + 이타적 + 협력적 성향의 조합',
      actionTip: '나를 위한 시간도 충분히 가져요. 자기 돌봄도 중요해요.',
    },
  },

  {
    id: 'combo-011',
    name: 'Independent Thinker',
    nameKr: '독립적 사고가',
    priority: 10,
    confidence: 'high',
    conditions: {
      required: ['independent', 'self-first', 'direct'],
      minTagCount: 2,
    },
    insight: {
      emoji: '🦅',
      title: '독립적인 사고가',
      description: '자신의 의견을 중요하게 생각하고, 솔직하게 표현해요.',
      explanation: '독립성 + 자기 우선 + 직접적 표현의 조합',
      actionTip: '상대방의 관점도 들어보면 새로운 인사이트를 얻을 수 있어요.',
    },
  },

  {
    id: 'combo-012',
    name: 'Harmony Seeker',
    nameKr: '조화 추구자',
    priority: 15,
    confidence: 'medium',
    source: 'TKI - Avoiding/Compromising',
    conditions: {
      required: ['avoiding', 'compromising'],
      optional: ['indirect'],
    },
    insight: {
      emoji: '☮️',
      title: '평화주의자',
      description: '갈등을 피하고 조화를 추구해요. 타협점을 찾는 것을 선호해요.',
      explanation: '회피 + 타협 성향의 조합',
      actionTip: '때로는 갈등이 관계를 더 깊게 만들 수 있어요.',
    },
  },

  {
    id: 'combo-013',
    name: 'Assertive Communicator',
    nameKr: '단호한 소통가',
    priority: 15,
    confidence: 'medium',
    source: 'TKI - Competing',
    conditions: {
      required: ['competing', 'direct', 'expressive'],
      minTagCount: 2,
    },
    insight: {
      emoji: '⚔️',
      title: '확실한 주장',
      description: '자신의 의견을 명확하게 전달해요. 필요할 때 강하게 주장할 수 있어요.',
      explanation: '경쟁적 + 직접적 + 표현력의 조합',
      actionTip: '상대방의 의견도 경청하면 더 좋은 결과를 얻을 수 있어요.',
    },
  },

  // ═══════════════════════════════════════════════════════════════
  // 특수 조합 (2개)
  // ═══════════════════════════════════════════════════════════════

  {
    id: 'combo-014',
    name: 'Balanced Soul',
    nameKr: '균형 잡힌 영혼',
    priority: 20,
    confidence: 'medium',
    conditions: {
      required: ['flexible', 'resilient'],
      optional: ['collaborating', 'compromising'],
    },
    insight: {
      emoji: '⚖️',
      title: '조화로운 균형',
      description: '극단적이지 않고 균형 잡힌 성향을 가졌어요. 다양한 상황에 적응력이 좋아요.',
      explanation: '유연성 + 회복탄력성의 조합',
      actionTip: '균형은 훌륭한 강점이에요. 자신만의 색깔도 더해보세요.',
    },
  },

  {
    id: 'combo-015',
    name: 'Future Visionary',
    nameKr: '미래 비전가',
    priority: 20,
    confidence: 'medium',
    conditions: {
      required: ['future-focused', 'planned'],
      optional: ['adventurous'],
    },
    insight: {
      emoji: '🔮',
      title: '미래를 보는 눈',
      description: '장기적인 관점으로 생각하고, 미래를 위한 계획을 세우는 것을 좋아해요.',
      explanation: '미래 지향 + 계획성의 조합',
      actionTip: '현재의 소소한 즐거움도 놓치지 마세요!',
    },
  },
];

// ============================================================================
// 룰 매칭 함수
// ============================================================================

/**
 * 사용자 태그로 매칭되는 룰 찾기
 */
export function matchStage2Rules(
  userTags: string[],
  limit: number = 5
): Stage2Rule[] {
  const userTagSet = new Set(userTags);
  const matches: { rule: Stage2Rule; score: number }[] = [];

  for (const rule of STAGE2_RULES) {
    const { required, optional, conflicting, minTagCount } = rule.conditions;

    // 충돌 태그가 있으면 스킵
    if (conflicting && conflicting.some(tag => userTagSet.has(tag))) {
      continue;
    }

    // 필수 태그 중 매칭 개수
    const requiredMatches = required.filter(tag => userTagSet.has(tag)).length;
    const minRequired = minTagCount ?? required.length;

    // 최소 조건 미충족 시 스킵
    if (requiredMatches < minRequired) {
      continue;
    }

    // 점수 계산
    let score = requiredMatches * 10;

    // 옵션 태그 보너스
    if (optional) {
      const optionalMatches = optional.filter(tag => userTagSet.has(tag)).length;
      score += optionalMatches * 5;
    }

    // 신뢰도 보너스
    if (rule.confidence === 'high') score += 5;
    else if (rule.confidence === 'medium') score += 2;

    // 우선순위 보너스 (낮을수록 좋음)
    score += (30 - rule.priority);

    matches.push({ rule, score });
  }

  // 점수순 정렬 후 상위 N개 반환
  return matches
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(m => m.rule);
}

/**
 * 룰 ID로 조회
 */
export function getRuleById(id: string): Stage2Rule | undefined {
  return STAGE2_RULES.find(rule => rule.id === id);
}

/**
 * 전체 룰 수
 */
export function getTotalRuleCount(): number {
  return STAGE2_RULES.length;
}
