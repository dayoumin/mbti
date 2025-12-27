/**
 * 콘텐츠 생성 계획 시스템
 * - 태그 우선순위에 따른 콘텐츠 생성 가이드
 * - 인사이트 Stage 해금을 위한 필수 태그 정의
 * - content-generator 스킬이 참조하는 SSOT
 */

import {
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  INTEREST_TAGS,
  LIFESTYLE_TAGS,
  InsightTag,
  PersonalityTag,
  DecisionTag,
  RelationshipTag,
  InterestTag,
  LifestyleTag,
} from './insight-tags';

// ============================================================================
// 태그 우선순위 (Priority Tiers)
// ============================================================================

export type PriorityTier = 'critical' | 'high' | 'medium' | 'low';

export interface TagPriority {
  tag: InsightTag;
  tier: PriorityTier;
  reason: string;
  targetUsage: number;  // 목표 사용 횟수
  currentUsage?: number; // 현재 사용 횟수 (런타임에 업데이트)
}

// ============================================================================
// Stage별 필수 태그
// ============================================================================

/**
 * 인사이트 Stage 해금에 필요한 태그 요구사항
 */
export const STAGE_REQUIREMENTS = {
  // Stage 4: 관심사 지도 - Interest 태그 필수
  stage4: {
    name: '관심사 지도',
    requiredCategories: ['interest'] as const,
    minimumTagsPerCategory: 5,
    description: '사용자의 관심사 분포를 시각화하려면 Interest 태그가 필요합니다.',
  },

  // Stage 5: 관계 패턴 - Relationship 태그 필수
  stage5: {
    name: '관계 패턴',
    requiredCategories: ['relationship'] as const,
    minimumTagsPerCategory: 8,
    description: '관계 스타일 분석을 위해 Relationship 태그가 필요합니다.',
  },

  // Stage 6: 통합 분석 - 모든 카테고리 균형
  stage6: {
    name: '통합 분석',
    requiredCategories: ['personality', 'decision', 'relationship', 'interest', 'lifestyle'] as const,
    minimumTagsPerCategory: 10,
    description: '종합 인사이트를 위해 모든 태그 카테고리가 균형 있게 필요합니다.',
  },
};

// ============================================================================
// Stage별 콘텐츠 목표 (Goal-Based Planning)
// ============================================================================

export interface ContentGoal {
  tag: string;
  target: number;       // 목표 사용 횟수
  contentType: 'vs-poll' | 'choice-poll' | 'situation-reaction' | 'quiz';
  category: string;     // 콘텐츠 카테고리 (cat, dog, love 등)
  description: string;  // 생성할 콘텐츠 설명
}

export interface StageGoals {
  stage: number;
  name: string;
  description: string;
  goals: ContentGoal[];
}

/**
 * Stage 4 해금을 위한 콘텐츠 목표
 * - 5개 이상의 Interest 태그가 각각 5회 이상 사용되어야 함
 */
export const STAGE_4_GOALS: StageGoals = {
  stage: 4,
  name: '관심사 지도',
  description: '다양한 관심사 태그를 수집하여 사용자 관심사 지도를 생성',
  goals: [
    {
      tag: 'interest-cat',
      target: 5,
      contentType: 'vs-poll',
      category: 'cat',
      description: '고양이 관련 VS Poll (예: 고양이 성격, 품종 선호)',
    },
    {
      tag: 'interest-dog',
      target: 5,
      contentType: 'vs-poll',
      category: 'dog',
      description: '강아지 관련 VS Poll (예: 견종 선호, 산책 스타일)',
    },
    {
      tag: 'interest-coffee',
      target: 5,
      contentType: 'vs-poll',
      category: 'coffee',
      description: '커피 관련 VS Poll (예: 원두 선호, 카페 스타일)',
    },
    {
      tag: 'interest-travel',
      target: 5,
      contentType: 'vs-poll',
      category: 'travel',
      description: '여행 관련 VS Poll (예: 여행 스타일, 숙소 선호)',
    },
    {
      tag: 'interest-money',
      target: 5,
      contentType: 'vs-poll',
      category: 'money',
      description: '재테크 관련 VS Poll (예: 투자 스타일, 소비 패턴)',
    },
  ],
};

/**
 * Stage 5 해금을 위한 콘텐츠 목표
 * - Relationship 태그 다양성 확보 (8개 태그 각 3회 이상)
 */
export const STAGE_5_GOALS: StageGoals = {
  stage: 5,
  name: '관계 패턴',
  description: '관계 스타일 태그를 수집하여 대인관계 패턴 분석',
  goals: [
    {
      tag: 'compromising',
      target: 3,
      contentType: 'situation-reaction',
      category: 'relationship',
      description: '갈등 상황에서 타협하는 반응 선택지 포함',
    },
    {
      tag: 'self-first',
      target: 3,
      contentType: 'vs-poll',
      category: 'lifestyle',
      description: '자기 우선 vs 타인 배려 선택 상황',
    },
    {
      tag: 'other-first',
      target: 3,
      contentType: 'vs-poll',
      category: 'love',
      description: '연애에서 배려 스타일 선택',
    },
    {
      tag: 'competing',
      target: 3,
      contentType: 'situation-reaction',
      category: 'work',
      description: '경쟁 상황에서의 반응 선택지',
    },
    {
      tag: 'diplomatic',
      target: 3,
      contentType: 'situation-reaction',
      category: 'social',
      description: '사회적 상황에서 외교적 반응 선택지',
    },
  ],
};

/**
 * 모든 Stage 목표 통합
 */
export const ALL_STAGE_GOALS: StageGoals[] = [
  STAGE_4_GOALS,
  STAGE_5_GOALS,
];

/**
 * 현재 태그 사용량으로 목표 달성률 계산
 */
export function calculateGoalProgress(
  goals: StageGoals,
  currentUsage: Record<string, Record<string, number>>
): {
  completed: number;
  total: number;
  percentage: number;
  pending: ContentGoal[];
} {
  let completed = 0;
  const pending: ContentGoal[] = [];

  for (const goal of goals.goals) {
    // 태그 카테고리 추출 (interest-cat → interest)
    const category = goal.tag.startsWith('interest-') ? 'interest' :
                     RELATIONSHIP_TAGS.includes(goal.tag as RelationshipTag) ? 'relationship' :
                     LIFESTYLE_TAGS.includes(goal.tag as LifestyleTag) ? 'lifestyle' :
                     DECISION_TAGS.includes(goal.tag as DecisionTag) ? 'decision' : 'personality';

    const current = currentUsage[category]?.[goal.tag] || 0;

    if (current >= goal.target) {
      completed++;
    } else {
      pending.push({
        ...goal,
        target: goal.target - current, // 남은 필요량
      });
    }
  }

  return {
    completed,
    total: goals.goals.length,
    percentage: Math.round((completed / goals.goals.length) * 100),
    pending,
  };
}

// ============================================================================
// 카테고리별 권장 태그 조합
// ============================================================================

/**
 * 콘텐츠 카테고리별 권장 태그 조합
 * content-generator가 참조하여 적절한 태그 선택
 */
export const CATEGORY_TAG_RECOMMENDATIONS: Record<string, {
  interest: InterestTag[];
  personality: PersonalityTag[];
  decision: DecisionTag[];
  relationship: RelationshipTag[];
  lifestyle: LifestyleTag[];
}> = {
  // 연애 카테고리
  love: {
    interest: ['interest-love', 'interest-psychology'],
    personality: ['romantic', 'emotional', 'expressive', 'reserved', 'empathetic'],
    decision: ['direct', 'indirect', 'tactful', 'together', 'solo'],
    relationship: ['close-bonding', 'space-needing', 'accommodating', 'assertive', 'diplomatic'],
    lifestyle: ['active', 'homebody'],
  },

  // 반려동물 카테고리
  cat: {
    interest: ['interest-cat', 'interest-pet'],
    personality: ['nurturing', 'independent', 'calm', 'observant'],
    decision: ['cautious', 'instinctive', 'safe'],
    relationship: ['space-needing', 'close-bonding'],
    lifestyle: ['homebody', 'relaxed', 'minimalist'],
  },

  dog: {
    interest: ['interest-dog', 'interest-pet'],
    personality: ['nurturing', 'collaborative', 'excitable', 'empathetic'],
    decision: ['together', 'adventurous', 'quick-decisive'],
    relationship: ['close-bonding', 'collaborating'],
    lifestyle: ['active', 'energetic', 'routine-oriented'],
  },

  // 커피/음식
  coffee: {
    interest: ['interest-coffee', 'interest-food'],
    personality: ['analytical', 'systematic', 'observant'],
    decision: ['research-based', 'deliberate', 'practical'],
    relationship: [],
    lifestyle: ['morning-person', 'routine-oriented', 'minimalist', 'collector'],
  },

  // 라이프스타일
  lifestyle: {
    interest: ['interest-lifestyle'],
    personality: ['planned', 'spontaneous', 'flexible', 'structured'],
    decision: ['practical', 'sentimental', 'future-focused', 'present-focused'],
    relationship: ['self-first', 'other-first'],
    lifestyle: ['frugal', 'splurger', 'minimalist', 'collector', 'balanced-lifestyle'],
  },

  // 재테크/돈
  money: {
    interest: ['interest-money'],
    personality: ['analytical', 'data-driven', 'systematic', 'planned'],
    decision: ['practical', 'risk-taking', 'conservative', 'research-based', 'deliberate'],
    relationship: ['self-first', 'competing'],
    lifestyle: ['frugal', 'splurger'],
  },

  // 타로/운세
  tarot: {
    interest: ['interest-tarot', 'interest-zodiac', 'interest-psychology'],
    personality: ['intuitive', 'emotional', 'sensitive', 'observant'],
    decision: ['instinctive', 'sentimental', 'nostalgic'],
    relationship: ['diplomatic'],
    lifestyle: ['creative', 'artistic'],
  },

  // 여행
  travel: {
    interest: ['interest-travel', 'interest-nature'],
    personality: ['extroverted', 'flexible', 'spontaneous'],
    decision: ['adventurous', 'quick-decisive', 'present-focused'],
    relationship: ['collaborating', 'compromising'],
    lifestyle: ['active', 'energetic', 'innovative'],
  },
};

// ============================================================================
// 부족 태그 자동 계산
// ============================================================================

/**
 * 현재 태그 사용량을 기반으로 우선 생성해야 할 태그 목록 반환
 * @param currentUsage 현재 태그 사용 현황
 * @returns 우선순위별 태그 목록
 */
export function getTagPriorities(
  currentUsage: Record<string, Record<string, number>>
): TagPriority[] {
  const priorities: TagPriority[] = [];

  // Interest 태그 - 전체 미사용이면 Critical
  for (const tag of INTEREST_TAGS) {
    const usage = currentUsage.interest?.[tag] || 0;
    priorities.push({
      tag,
      tier: usage === 0 ? 'critical' : usage < 5 ? 'high' : 'low',
      reason: usage === 0 ? 'Stage 4 해금 필수' : '관심사 다양성',
      targetUsage: 10,
      currentUsage: usage,
    });
  }

  // Relationship 태그 - 미사용이면 High
  for (const tag of RELATIONSHIP_TAGS) {
    const usage = currentUsage.relationship?.[tag] || 0;
    priorities.push({
      tag,
      tier: usage === 0 ? 'high' : usage < 5 ? 'medium' : 'low',
      reason: usage === 0 ? 'Stage 5 해금 필요' : '관계 분석 다양성',
      targetUsage: 8,
      currentUsage: usage,
    });
  }

  // Lifestyle 태그
  for (const tag of LIFESTYLE_TAGS) {
    const usage = currentUsage.lifestyle?.[tag] || 0;
    priorities.push({
      tag,
      tier: usage === 0 ? 'medium' : usage < 3 ? 'medium' : 'low',
      reason: '라이프스타일 분석 균형',
      targetUsage: 5,
      currentUsage: usage,
    });
  }

  // Personality 태그
  for (const tag of PERSONALITY_TAGS) {
    const usage = currentUsage.personality?.[tag] || 0;
    priorities.push({
      tag,
      tier: usage === 0 ? 'medium' : 'low',
      reason: '성격 분석 균형',
      targetUsage: 5,
      currentUsage: usage,
    });
  }

  // Decision 태그
  for (const tag of DECISION_TAGS) {
    const usage = currentUsage.decision?.[tag] || 0;
    priorities.push({
      tag,
      tier: usage === 0 ? 'medium' : 'low',
      reason: '판단 스타일 균형',
      targetUsage: 5,
      currentUsage: usage,
    });
  }

  // 우선순위로 정렬
  const tierOrder: Record<PriorityTier, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return priorities.sort((a, b) => tierOrder[a.tier] - tierOrder[b.tier]);
}

/**
 * 콘텐츠 생성 시 추천할 태그 조합 반환
 * @param category 콘텐츠 카테고리
 * @param currentUsage 현재 태그 사용 현황
 * @returns 권장 태그 조합
 */
export function getRecommendedTags(
  category: string,
  currentUsage: Record<string, Record<string, number>>
): {
  required: InsightTag[];
  recommended: InsightTag[];
  optional: InsightTag[];
} {
  const categoryRecs = CATEGORY_TAG_RECOMMENDATIONS[category];
  const priorities = getTagPriorities(currentUsage);

  // Critical/High 우선순위 태그 중 해당 카테고리와 맞는 것
  const criticalTags = priorities
    .filter(p => p.tier === 'critical' || p.tier === 'high')
    .map(p => p.tag);

  // 카테고리별 기본 Interest 태그
  const requiredInterest = categoryRecs?.interest || [];

  // 카테고리별 권장 태그 중 미사용인 것
  const recommendedTags: InsightTag[] = [];
  if (categoryRecs) {
    for (const catKey of ['personality', 'decision', 'relationship', 'lifestyle'] as const) {
      const catTags = categoryRecs[catKey] || [];
      for (const tag of catTags) {
        const usage = currentUsage[catKey]?.[tag] || 0;
        if (usage < 3) {
          recommendedTags.push(tag);
        }
      }
    }
  }

  return {
    required: [...requiredInterest, ...criticalTags.slice(0, 2)] as InsightTag[],
    recommended: recommendedTags.slice(0, 5),
    optional: priorities.filter(p => p.tier === 'medium').slice(0, 3).map(p => p.tag),
  };
}

// ============================================================================
// 콘텐츠 생성 지침
// ============================================================================

export const CONTENT_GENERATION_GUIDELINES = {
  // VS Poll 생성 시
  vsPoll: {
    minimumTags: 3,
    requiredCategories: ['personality', 'decision'],
    optionalCategories: ['relationship', 'lifestyle'],
    tips: [
      '각 선택지가 서로 다른 성향을 나타내도록 설계',
      'personality와 decision 태그를 반드시 포함',
      '관계 관련 질문이면 relationship 태그 추가',
    ],
  },

  // Choice Poll 생성 시
  choicePoll: {
    minimumTags: 2,
    requiredCategories: ['decision'],
    optionalCategories: ['lifestyle', 'personality'],
    tips: [
      '선택지별로 다른 가치관/스타일을 반영',
      '라이프스타일 관련이면 lifestyle 태그 추가',
    ],
  },

  // Quiz 생성 시
  quiz: {
    minimumTags: 1,
    requiredCategories: [],
    optionalCategories: ['interest'],
    tips: [
      '퀴즈 카테고리에 맞는 interest 태그 추가',
      '지식형 퀴즈는 태그 불필요할 수 있음',
    ],
  },

  // Situation Reaction 생성 시
  situationReaction: {
    minimumTags: 4,
    requiredCategories: ['personality', 'decision', 'relationship'],
    optionalCategories: ['lifestyle'],
    tips: [
      '각 반응 선택지에 2-3개 태그 매핑',
      '관계 상황이면 relationship 태그 필수',
      '반응의 차이가 명확하게 태그로 표현되어야 함',
    ],
  },
};

// ============================================================================
// Export
// ============================================================================

export type {
  PersonalityTag,
  DecisionTag,
  RelationshipTag,
  InterestTag,
  LifestyleTag,
};
