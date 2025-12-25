// ============================================================================
// Stage 3: 판단 스타일 분석
// ============================================================================
// 투표 10개 이상 완료 시 해금
// insightTags 기반으로 사용자의 의사결정 패턴 분석

import type { DecisionTag, PersonalityTag } from './insight-tags';

// ============================================================================
// 타입 정의
// ============================================================================

export interface DecisionStyleProfile {
  id: string;
  name: string;
  nameKr: string;
  emoji: string;
  description: string;
  characteristics: string[];
  strengths: string[];
  watchOut: string;
}

export interface DecisionDimension {
  id: string;
  name: string;
  nameKr: string;
  emoji: string;
  poles: {
    left: { tag: DecisionTag | PersonalityTag; label: string };
    right: { tag: DecisionTag | PersonalityTag; label: string };
  };
}

export interface DecisionStyleResult {
  profile: DecisionStyleProfile;
  dimensions: {
    dimension: DecisionDimension;
    score: number; // -100 ~ +100 (left ~ right)
    interpretation: string;
  }[];
  dominantTags: { tag: string; count: number; percentage: number }[];
  generatedAt: string;
}

// ============================================================================
// 판단 차원 정의 (4개)
// ============================================================================

export const DECISION_DIMENSIONS: DecisionDimension[] = [
  {
    id: 'practical-emotional',
    name: 'Decision Basis',
    nameKr: '판단 기준',
    emoji: '⚖️',
    poles: {
      left: { tag: 'practical', label: '실용적' },
      right: { tag: 'sentimental', label: '감성적' },
    },
  },
  {
    id: 'safe-adventurous',
    name: 'Risk Preference',
    nameKr: '위험 선호',
    emoji: '🎲',
    poles: {
      left: { tag: 'safe', label: '안전 추구' },
      right: { tag: 'adventurous', label: '모험 추구' },
    },
  },
  {
    id: 'solo-together',
    name: 'Social Preference',
    nameKr: '활동 선호',
    emoji: '👥',
    poles: {
      left: { tag: 'solo', label: '혼자' },
      right: { tag: 'together', label: '함께' },
    },
  },
  {
    id: 'direct-indirect',
    name: 'Communication Style',
    nameKr: '소통 방식',
    emoji: '💬',
    poles: {
      left: { tag: 'direct', label: '직접적' },
      right: { tag: 'indirect', label: '간접적' },
    },
  },
];

// ============================================================================
// 판단 스타일 프로필 정의 (8개)
// ============================================================================

export const DECISION_PROFILES: DecisionStyleProfile[] = [
  // 실용 + 안전 조합
  {
    id: 'practical-safe',
    name: 'Careful Planner',
    nameKr: '신중한 계획가',
    emoji: '📋',
    description: '검증된 방법을 선호하고, 실용적인 기준으로 판단해요.',
    characteristics: [
      '위험을 최소화하는 선택을 해요',
      '논리와 데이터를 중시해요',
      '장기적 결과를 고려해요',
    ],
    strengths: ['안정적인 의사결정', '꼼꼼한 분석력', '리스크 관리'],
    watchOut: '가끔 기회를 놓칠 수 있어요. 작은 모험도 해보세요!',
  },

  // 실용 + 모험 조합
  {
    id: 'practical-adventurous',
    name: 'Calculated Risk-taker',
    nameKr: '계산된 도전가',
    emoji: '🎯',
    description: '실용적으로 판단하지만, 계산된 모험을 즐겨요.',
    characteristics: [
      '기회가 보이면 과감하게 도전해요',
      '하지만 무모하지는 않아요',
      '비용 대비 효과를 따져요',
    ],
    strengths: ['기회 포착력', '합리적 판단', '실행력'],
    watchOut: '감정적 가치도 중요해요. 숫자로 계산할 수 없는 것도 있어요.',
  },

  // 감성 + 안전 조합
  {
    id: 'emotional-safe',
    name: 'Gentle Guardian',
    nameKr: '따뜻한 수호자',
    emoji: '🛡️',
    description: '마음을 따르되, 안전한 선택을 선호해요.',
    characteristics: [
      '익숙하고 편안한 것을 좋아해요',
      '변화보다 안정을 추구해요',
      '소중한 것을 지키려 해요',
    ],
    strengths: ['정서적 안정', '신중한 보호본능', '일관성'],
    watchOut: '새로운 경험도 당신을 성장시켜요!',
  },

  // 감성 + 모험 조합
  {
    id: 'emotional-adventurous',
    name: 'Passionate Explorer',
    nameKr: '열정적 탐험가',
    emoji: '✨',
    description: '마음이 이끄는 대로, 새로운 경험을 추구해요.',
    characteristics: [
      '직감을 믿고 행동해요',
      '설레는 일에 뛰어들어요',
      '감정이 나침반이에요',
    ],
    strengths: ['열정', '창의성', '경험 다양성'],
    watchOut: '가끔은 한 박자 쉬고 생각해보는 것도 좋아요.',
  },

  // 혼자 + 직접적 조합
  {
    id: 'solo-direct',
    name: 'Independent Voice',
    nameKr: '독립적 목소리',
    emoji: '🦁',
    description: '혼자서도 잘하고, 할 말은 하는 타입이에요.',
    characteristics: [
      '자기 주관이 뚜렷해요',
      '솔직하게 의견을 표현해요',
      '독립적으로 일하는 걸 좋아해요',
    ],
    strengths: ['자립심', '솔직함', '효율성'],
    watchOut: '협업이 필요할 때는 한 발짝 물러서보는 것도 좋아요.',
  },

  // 혼자 + 간접적 조합
  {
    id: 'solo-indirect',
    name: 'Thoughtful Introvert',
    nameKr: '사려깊은 내면인',
    emoji: '🌿',
    description: '혼자만의 시간을 즐기고, 부드럽게 소통해요.',
    characteristics: [
      '조용히 생각을 정리해요',
      '직접 말하기보다 글이나 행동으로 표현해요',
      '자신만의 공간이 필요해요',
    ],
    strengths: ['깊은 사고', '배려심', '관찰력'],
    watchOut: '때로는 직접 말하는 것이 오해를 줄여요.',
  },

  // 함께 + 직접적 조합
  {
    id: 'together-direct',
    name: 'Team Catalyst',
    nameKr: '팀의 촉매제',
    emoji: '🔥',
    description: '함께할 때 에너지가 나고, 솔직하게 소통해요.',
    characteristics: [
      '적극적으로 의견을 나눠요',
      '팀 분위기를 주도해요',
      '갈등도 직접 해결하려 해요',
    ],
    strengths: ['리더십', '추진력', '영향력'],
    watchOut: '다른 사람의 속도도 존중해주세요.',
  },

  // 함께 + 간접적 조합
  {
    id: 'together-indirect',
    name: 'Harmonious Collaborator',
    nameKr: '조화로운 협력가',
    emoji: '🕊️',
    description: '함께하는 것을 좋아하고, 부드럽게 조율해요.',
    characteristics: [
      '분위기를 살피며 말해요',
      '갈등을 피하고 조화를 추구해요',
      '모두가 편한 방향을 찾아요',
    ],
    strengths: ['공감능력', '중재력', '팀워크'],
    watchOut: '자신의 의견도 중요해요. 가끔은 직접 말해보세요.',
  },
];

// ============================================================================
// 판단 스타일 분석 함수
// ============================================================================

/**
 * 투표 태그로 판단 스타일 차원 점수 계산
 * @param tagCounts 태그별 카운트
 */
export function calculateDimensionScores(
  tagCounts: Record<string, number>
): { dimension: DecisionDimension; score: number; interpretation: string }[] {
  return DECISION_DIMENSIONS.map(dimension => {
    const leftTag = dimension.poles.left.tag;
    const rightTag = dimension.poles.right.tag;

    const leftCount = tagCounts[leftTag] || 0;
    const rightCount = tagCounts[rightTag] || 0;
    const total = leftCount + rightCount;

    // 점수: -100 (완전 left) ~ +100 (완전 right)
    let score = 0;
    if (total > 0) {
      score = Math.round(((rightCount - leftCount) / total) * 100);
    }

    // 해석
    let interpretation = '';
    const leftLabel = dimension.poles.left.label;
    const rightLabel = dimension.poles.right.label;

    if (score <= -60) {
      interpretation = `강하게 ${leftLabel} 성향`;
    } else if (score <= -20) {
      interpretation = `${leftLabel} 성향`;
    } else if (score < 20) {
      interpretation = `${leftLabel}/${rightLabel} 균형`;
    } else if (score < 60) {
      interpretation = `${rightLabel} 성향`;
    } else {
      interpretation = `강하게 ${rightLabel} 성향`;
    }

    return { dimension, score, interpretation };
  });
}

/**
 * 판단 스타일 프로필 매칭
 * @param tagCounts 태그별 카운트
 */
export function matchDecisionProfile(
  tagCounts: Record<string, number>
): DecisionStyleProfile {
  // 각 차원별 태그 카운트
  const practicalCount = tagCounts['practical'] || 0;
  const sentimentalCount = tagCounts['sentimental'] || 0;
  const safeCount = tagCounts['safe'] || 0;
  const adventurousCount = tagCounts['adventurous'] || 0;
  const soloCount = tagCounts['solo'] || 0;
  const togetherCount = tagCounts['together'] || 0;
  const directCount = tagCounts['direct'] || 0;
  const indirectCount = tagCounts['indirect'] || 0;

  // 1차 분류 차원에 데이터가 있는지 확인
  const hasPrimaryData = (practicalCount + sentimentalCount + safeCount + adventurousCount) > 0;

  // 2차 분류 차원에 데이터가 있는지 확인
  const hasSecondaryData = (soloCount + togetherCount + directCount + indirectCount) > 0;

  // 1차 분류: 실용/감성 + 안전/모험 (데이터가 있을 때만)
  if (hasPrimaryData) {
    const isPractical = practicalCount >= sentimentalCount;
    const isSafe = safeCount >= adventurousCount;

    if (isPractical && isSafe) {
      return DECISION_PROFILES.find(p => p.id === 'practical-safe')!;
    }
    if (isPractical && !isSafe) {
      return DECISION_PROFILES.find(p => p.id === 'practical-adventurous')!;
    }
    if (!isPractical && isSafe) {
      return DECISION_PROFILES.find(p => p.id === 'emotional-safe')!;
    }
    if (!isPractical && !isSafe) {
      return DECISION_PROFILES.find(p => p.id === 'emotional-adventurous')!;
    }
  }

  // 2차 분류: 혼자/함께 + 직접/간접 (1차 데이터가 없을 때)
  if (hasSecondaryData) {
    const isSolo = soloCount >= togetherCount;
    const isDirect = directCount >= indirectCount;

    if (isSolo && isDirect) {
      return DECISION_PROFILES.find(p => p.id === 'solo-direct')!;
    }
    if (isSolo && !isDirect) {
      return DECISION_PROFILES.find(p => p.id === 'solo-indirect')!;
    }
    if (!isSolo && isDirect) {
      return DECISION_PROFILES.find(p => p.id === 'together-direct')!;
    }
    return DECISION_PROFILES.find(p => p.id === 'together-indirect')!;
  }

  // 기본값: 조화로운 협력가
  return DECISION_PROFILES.find(p => p.id === 'together-indirect')!;
}

/**
 * 전체 판단 스타일 결과 생성
 * @param tagCounts 태그별 카운트
 */
export function generateDecisionStyleResult(
  tagCounts: Record<string, number>
): DecisionStyleResult {
  const profile = matchDecisionProfile(tagCounts);
  const dimensions = calculateDimensionScores(tagCounts);

  // 상위 태그 계산
  const decisionTags = [
    'practical', 'sentimental', 'adventurous', 'safe', 'cautious',
    'solo', 'together', 'direct', 'indirect', 'present-focused', 'future-focused',
  ];

  const total = decisionTags.reduce((sum, tag) => sum + (tagCounts[tag] || 0), 0);

  const dominantTags = decisionTags
    .filter(tag => tagCounts[tag] && tagCounts[tag] > 0)
    .map(tag => ({
      tag,
      count: tagCounts[tag],
      percentage: total > 0 ? Math.round((tagCounts[tag] / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    profile,
    dimensions,
    dominantTags,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 텍스트 생성 헬퍼
// ============================================================================

/**
 * 차원 점수를 시각적 바 형태로 표현
 */
export function dimensionToBar(score: number): string {
  // -100 ~ +100 → 0 ~ 10
  const position = Math.round(((score + 100) / 200) * 10);
  const bar = '○○○○○○○○○○○'.split('');
  bar[position] = '●';
  return bar.join('');
}

/**
 * 판단 스타일 요약 텍스트
 */
export function getSummaryText(result: DecisionStyleResult): string {
  const { profile, dimensions } = result;

  const strongDimensions = dimensions
    .filter(d => Math.abs(d.score) >= 40)
    .map(d => d.interpretation);

  if (strongDimensions.length === 0) {
    return `${profile.emoji} ${profile.nameKr}: 균형 잡힌 판단 스타일을 가졌어요.`;
  }

  return `${profile.emoji} ${profile.nameKr}: ${strongDimensions.join(', ')}`;
}