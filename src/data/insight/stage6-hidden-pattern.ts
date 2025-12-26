// ============================================================================
// Stage 6: 숨은 패턴 분석
// ============================================================================
// 총 활동 30개 이상 완료 시 해금
// 전체 태그 데이터에서 모순, 희귀 조합, 일관성 분석

import type { InsightTag, PersonalityTag, DecisionTag } from './insight-tags';
import { PERSONALITY_TAGS, DECISION_TAGS, RELATIONSHIP_TAGS } from './insight-tags';

// ============================================================================
// 타입 정의
// ============================================================================

export interface ContradictionPattern {
  tagPair: [string, string];
  leftCount: number;
  rightCount: number;
  interpretation: string;
  insight: string;
  emoji: string;
}

export interface RarePattern {
  tags: string[];
  rarity: 'uncommon' | 'rare' | 'very-rare';
  percentage: number; // 추정 희귀도 (낮을수록 희귀)
  interpretation: string;
  emoji: string;
}

export interface ConsistencyAnalysis {
  score: number; // 0-100
  level: 'high' | 'medium' | 'low';
  interpretation: string;
  details: string[];
}

export interface HiddenPatternResult {
  // 모순 패턴
  contradictions: ContradictionPattern[];

  // 희귀 조합
  rarePatterns: RarePattern[];

  // 일관성 분석
  consistency: ConsistencyAnalysis;

  // 종합 인사이트
  overallInsight: string;
  personalizedMessage: string;

  // 상위 태그
  dominantTraits: { tag: string; count: number; category: string }[];

  // 생성 시간
  generatedAt: string;
}

// ============================================================================
// 모순 태그 쌍 정의
// ============================================================================

interface ContradictionRule {
  left: string;
  right: string;
  interpretation: string;
  insight: string;
  emoji: string;
}

export const CONTRADICTION_RULES: ContradictionRule[] = [
  // 성격 모순
  {
    left: 'extroverted',
    right: 'introverted',
    interpretation: '상황에 따라 달라지는 사회성',
    insight: '혼자만의 시간도, 사람들과의 시간도 모두 즐기는 타입이에요. 필요에 따라 에너지를 조절할 줄 알아요.',
    emoji: '🎭',
  },
  {
    left: 'planned',
    right: 'spontaneous',
    interpretation: '계획과 즉흥 사이',
    insight: '계획을 세우지만 변화에도 유연해요. 상황에 맞게 스타일을 바꿀 수 있어요.',
    emoji: '🔄',
  },
  {
    left: 'logical',
    right: 'emotional',
    interpretation: '이성과 감성의 공존',
    insight: '머리와 마음을 모두 활용해요. 상황에 따라 논리와 감정을 오가며 판단해요.',
    emoji: '💫',
  },
  {
    left: 'independent',
    right: 'collaborative',
    interpretation: '독립과 협력 사이',
    insight: '혼자서도 잘하지만 팀워크도 좋아요. 상황에 맞게 역할을 조절해요.',
    emoji: '🌐',
  },
  {
    left: 'leading',
    right: 'supportive',
    interpretation: '리더와 서포터 사이',
    insight: '앞장설 때와 뒤에서 지원할 때를 알아요. 유연한 역할 전환이 가능해요.',
    emoji: '🎯',
  },

  // 판단 스타일 모순
  {
    left: 'practical',
    right: 'sentimental',
    interpretation: '실용과 감성 사이',
    insight: '현실적이면서도 감성적 가치를 중시해요. 둘 다 중요하게 여겨요.',
    emoji: '⚖️',
  },
  {
    left: 'adventurous',
    right: 'safe',
    interpretation: '모험과 안전 사이',
    insight: '도전하고 싶지만 완전히 무모하지는 않아요. 계산된 리스크를 택해요.',
    emoji: '🎲',
  },
  {
    left: 'solo',
    right: 'together',
    interpretation: '혼자와 함께 사이',
    insight: '때로는 혼자, 때로는 함께. 활동에 따라 선호가 달라져요.',
    emoji: '👥',
  },
  {
    left: 'direct',
    right: 'indirect',
    interpretation: '직접적/간접적 소통',
    insight: '상황과 상대에 따라 소통 방식을 조절해요. 유연한 커뮤니케이터예요.',
    emoji: '💬',
  },

  // 관계 모순
  {
    left: 'close-bonding',
    right: 'space-needing',
    interpretation: '밀착과 거리 사이',
    insight: '가까워지고 싶지만 개인 시간도 필요해요. 건강한 균형을 찾고 있어요.',
    emoji: '❤️‍🔥',
  },
  {
    left: 'self-first',
    right: 'other-first',
    interpretation: '자기와 타인 사이',
    insight: '자신도 챙기고 상대도 배려해요. 균형 잡힌 배려를 추구해요.',
    emoji: '🤲',
  },
  {
    left: 'competing',
    right: 'accommodating',
    interpretation: '경쟁과 수용 사이',
    insight: '때로는 주장하고 때로는 양보해요. 상황에 맞는 전략을 선택해요.',
    emoji: '🏆',
  },
];

// ============================================================================
// 희귀 조합 정의
// ============================================================================

interface RareCombinationRule {
  tags: string[];
  rarity: 'uncommon' | 'rare' | 'very-rare';
  percentage: number;
  interpretation: string;
  emoji: string;
}

export const RARE_COMBINATIONS: RareCombinationRule[] = [
  // 매우 희귀 (5% 미만)
  {
    tags: ['introverted', 'leading', 'direct'],
    rarity: 'very-rare',
    percentage: 3,
    interpretation: '조용한 리더',
    emoji: '🦉',
  },
  {
    tags: ['extroverted', 'analytical', 'planned'],
    rarity: 'very-rare',
    percentage: 4,
    interpretation: '사교적 전략가',
    emoji: '🎭',
  },
  {
    tags: ['emotional', 'practical', 'structured'],
    rarity: 'very-rare',
    percentage: 5,
    interpretation: '감성적 현실주의자',
    emoji: '🌈',
  },

  // 희귀 (5-15%)
  {
    tags: ['introverted', 'expressive'],
    rarity: 'rare',
    percentage: 8,
    interpretation: '선택적 표현가',
    emoji: '🎨',
  },
  {
    tags: ['spontaneous', 'cautious'],
    rarity: 'rare',
    percentage: 10,
    interpretation: '계산된 즉흥가',
    emoji: '🎯',
  },
  {
    tags: ['competing', 'diplomatic'],
    rarity: 'rare',
    percentage: 12,
    interpretation: '부드러운 승부사',
    emoji: '🦊',
  },
  {
    tags: ['independent', 'close-bonding'],
    rarity: 'rare',
    percentage: 11,
    interpretation: '독립적 연결자',
    emoji: '🦅',
  },

  // 흔치 않은 (15-25%)
  {
    tags: ['logical', 'sentimental'],
    rarity: 'uncommon',
    percentage: 18,
    interpretation: '균형 잡힌 판단자',
    emoji: '⚖️',
  },
  {
    tags: ['resilient', 'sensitive'],
    rarity: 'uncommon',
    percentage: 20,
    interpretation: '강인한 감수성',
    emoji: '💪',
  },
  {
    tags: ['avoiding', 'assertive'],
    rarity: 'uncommon',
    percentage: 22,
    interpretation: '선택적 전투가',
    emoji: '🐯',
  },
];

// ============================================================================
// 분석 함수
// ============================================================================

/**
 * 모순 패턴 발견
 */
export function findContradictions(
  tagCounts: Record<string, number>
): ContradictionPattern[] {
  const contradictions: ContradictionPattern[] = [];

  for (const rule of CONTRADICTION_RULES) {
    const leftCount = tagCounts[rule.left] || 0;
    const rightCount = tagCounts[rule.right] || 0;

    // 양쪽 모두 2개 이상이고, 차이가 2배 이내면 모순
    if (leftCount >= 2 && rightCount >= 2) {
      const ratio = Math.max(leftCount, rightCount) / Math.min(leftCount, rightCount);
      if (ratio <= 2) {
        contradictions.push({
          tagPair: [rule.left, rule.right],
          leftCount,
          rightCount,
          interpretation: rule.interpretation,
          insight: rule.insight,
          emoji: rule.emoji,
        });
      }
    }
  }

  // 모순 강도순 정렬 (비율이 1에 가까울수록 강한 모순)
  return contradictions
    .sort((a, b) => {
      const ratioA = Math.max(a.leftCount, a.rightCount) / Math.min(a.leftCount, a.rightCount);
      const ratioB = Math.max(b.leftCount, b.rightCount) / Math.min(b.leftCount, b.rightCount);
      return ratioA - ratioB;
    })
    .slice(0, 3); // 상위 3개
}

/**
 * 희귀 조합 발견
 */
export function findRarePatterns(
  tagCounts: Record<string, number>
): RarePattern[] {
  const rarePatterns: RarePattern[] = [];

  for (const rule of RARE_COMBINATIONS) {
    // 모든 태그가 1개 이상 있는지 확인
    const allPresent = rule.tags.every(tag => (tagCounts[tag] || 0) >= 1);

    if (allPresent) {
      rarePatterns.push({
        tags: rule.tags,
        rarity: rule.rarity,
        percentage: rule.percentage,
        interpretation: rule.interpretation,
        emoji: rule.emoji,
      });
    }
  }

  // 희귀도순 정렬
  const rarityOrder = { 'very-rare': 0, 'rare': 1, 'uncommon': 2 };
  return rarePatterns
    .sort((a, b) => rarityOrder[a.rarity] - rarityOrder[b.rarity])
    .slice(0, 3); // 상위 3개
}

/**
 * 일관성 분석
 */
export function analyzeConsistency(
  tagCounts: Record<string, number>
): ConsistencyAnalysis {
  const details: string[] = [];

  // 태그별 카운트 분석
  const allTags = Object.entries(tagCounts).filter(([_, count]) => count > 0);
  const totalTags = allTags.reduce((sum, [_, count]) => sum + count, 0);

  if (totalTags === 0) {
    return {
      score: 50,
      level: 'medium',
      interpretation: '아직 데이터가 충분하지 않아요.',
      details: ['더 많은 활동을 하면 패턴이 보여요.'],
    };
  }

  // 1. 지배적 태그 분석 (상위 3개가 전체의 몇 %?)
  const sortedTags = allTags.sort((a, b) => b[1] - a[1]);
  const top3Count = sortedTags.slice(0, 3).reduce((sum, [_, count]) => sum + count, 0);
  const top3Ratio = top3Count / totalTags;

  let consistencyScore = 50;

  if (top3Ratio >= 0.6) {
    consistencyScore += 25;
    details.push('몇 가지 핵심 특성이 일관되게 나타나요.');
  } else if (top3Ratio >= 0.4) {
    consistencyScore += 10;
    details.push('특성이 다양하게 분포되어 있어요.');
  } else {
    consistencyScore -= 10;
    details.push('다양한 상황에 다양하게 반응하는 타입이에요.');
  }

  // 2. 모순 개수 분석
  const contradictions = findContradictions(tagCounts);
  if (contradictions.length >= 3) {
    consistencyScore -= 20;
    details.push('여러 면에서 유연하게 변화하는 모습이 보여요.');
  } else if (contradictions.length === 0) {
    consistencyScore += 15;
    details.push('선택이 일관되고 예측 가능해요.');
  }

  // 3. 태그 다양성 (고유 태그 수)
  const uniqueTagCount = allTags.length;
  if (uniqueTagCount >= 15) {
    consistencyScore -= 10;
    details.push('다양한 면을 가지고 있어요.');
  } else if (uniqueTagCount <= 5) {
    consistencyScore += 10;
    details.push('명확한 성향이 있어요.');
  }

  // 점수 범위 조정
  consistencyScore = Math.max(0, Math.min(100, consistencyScore));

  // 레벨 결정
  let level: 'high' | 'medium' | 'low';
  let interpretation: string;

  if (consistencyScore >= 70) {
    level = 'high';
    interpretation = '일관된 성향: 선택 패턴이 예측 가능하고 명확해요.';
  } else if (consistencyScore >= 40) {
    level = 'medium';
    interpretation = '균형 잡힌 성향: 상황에 따라 유연하게 대응해요.';
  } else {
    level = 'low';
    interpretation = '다면적 성향: 다양한 상황에 다양한 모습을 보여요.';
  }

  return {
    score: consistencyScore,
    level,
    interpretation,
    details,
  };
}

/**
 * 상위 특성 추출
 */
export function extractDominantTraits(
  tagCounts: Record<string, number>
): { tag: string; count: number; category: string }[] {
  const categoryMap: Record<string, string> = {};

  // 카테고리 매핑
  PERSONALITY_TAGS.forEach(tag => { categoryMap[tag] = '성격'; });
  DECISION_TAGS.forEach(tag => { categoryMap[tag] = '판단'; });
  RELATIONSHIP_TAGS.forEach(tag => { categoryMap[tag] = '관계'; });

  return Object.entries(tagCounts)
    .filter(([tag, count]) => count > 0 && categoryMap[tag])
    .map(([tag, count]) => ({
      tag,
      count,
      category: categoryMap[tag],
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
}

/**
 * 종합 인사이트 생성
 */
export function generateOverallInsight(
  contradictions: ContradictionPattern[],
  rarePatterns: RarePattern[],
  consistency: ConsistencyAnalysis,
  dominantTraits: { tag: string; count: number; category: string }[]
): string {
  const parts: string[] = [];

  // 일관성 기반
  if (consistency.level === 'high') {
    parts.push('당신은 명확한 성향을 가진 사람이에요.');
  } else if (consistency.level === 'low') {
    parts.push('당신은 다양한 면을 가진 복합적인 사람이에요.');
  }

  // 모순 기반
  if (contradictions.length >= 2) {
    parts.push('상반된 특성을 함께 가지고 있어서 상황에 따라 유연하게 변화해요.');
  }

  // 희귀 조합 기반
  if (rarePatterns.some(p => p.rarity === 'very-rare')) {
    parts.push('아주 독특한 성향 조합을 가지고 있어요!');
  } else if (rarePatterns.some(p => p.rarity === 'rare')) {
    parts.push('흔치 않은 특별한 조합을 가지고 있어요.');
  }

  // 기본 인사이트
  if (parts.length === 0) {
    parts.push('다양한 활동을 통해 자신만의 패턴이 형성되고 있어요.');
  }

  return parts.join(' ');
}

/**
 * 맞춤형 메시지 생성
 */
export function generatePersonalizedMessage(
  contradictions: ContradictionPattern[],
  rarePatterns: RarePattern[],
  dominantTraits: { tag: string; count: number; category: string }[]
): string {
  // 가장 두드러진 특성 기반 메시지
  if (dominantTraits.length > 0) {
    const topTrait = dominantTraits[0].tag;

    // 특성별 맞춤 메시지
    const messages: Record<string, string> = {
      'extroverted': '사람들과 함께할 때 빛나는 당신! 에너지를 나누는 것을 좋아해요.',
      'introverted': '혼자만의 시간에서 에너지를 얻는 당신! 깊이 있는 생각이 강점이에요.',
      'logical': '논리적으로 분석하는 당신! 명확한 판단력이 돋보여요.',
      'emotional': '감성이 풍부한 당신! 공감 능력이 뛰어나요.',
      'planned': '계획적인 당신! 체계적으로 일을 처리해요.',
      'spontaneous': '즉흥적인 당신! 변화에 빠르게 적응해요.',
      'adventurous': '도전을 즐기는 당신! 새로운 경험이 원동력이에요.',
      'safe': '신중한 당신! 안정감 있는 선택을 해요.',
    };

    if (messages[topTrait]) {
      return messages[topTrait];
    }
  }

  // 희귀 조합 기반
  if (rarePatterns.length > 0) {
    const rarest = rarePatterns[0];
    return `${rarest.emoji} ${rarest.interpretation}인 당신은 특별한 조합을 가지고 있어요!`;
  }

  // 모순 기반
  if (contradictions.length > 0) {
    const topContradiction = contradictions[0];
    return `${topContradiction.emoji} ${topContradiction.interpretation}을 보여주는 다면적인 당신!`;
  }

  return '더 많은 활동을 통해 당신만의 숨은 패턴을 발견해보세요!';
}

// ============================================================================
// 메인 함수
// ============================================================================

/**
 * 전체 숨은 패턴 결과 생성
 */
export function generateHiddenPatternResult(
  tagCounts: Record<string, number>
): HiddenPatternResult {
  // 1. 모순 패턴 발견
  const contradictions = findContradictions(tagCounts);

  // 2. 희귀 조합 발견
  const rarePatterns = findRarePatterns(tagCounts);

  // 3. 일관성 분석
  const consistency = analyzeConsistency(tagCounts);

  // 4. 상위 특성 추출
  const dominantTraits = extractDominantTraits(tagCounts);

  // 5. 종합 인사이트
  const overallInsight = generateOverallInsight(
    contradictions,
    rarePatterns,
    consistency,
    dominantTraits
  );

  // 6. 맞춤형 메시지
  const personalizedMessage = generatePersonalizedMessage(
    contradictions,
    rarePatterns,
    dominantTraits
  );

  return {
    contradictions,
    rarePatterns,
    consistency,
    overallInsight,
    personalizedMessage,
    dominantTraits,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 텍스트 헬퍼
// ============================================================================

/**
 * 요약 텍스트 생성
 */
export function getSummaryText(result: HiddenPatternResult): string {
  const { contradictions, rarePatterns, consistency } = result;

  const parts: string[] = [];

  if (contradictions.length > 0) {
    parts.push(`모순 ${contradictions.length}개`);
  }
  if (rarePatterns.length > 0) {
    parts.push(`희귀조합 ${rarePatterns.length}개`);
  }
  parts.push(`일관성 ${consistency.score}%`);

  return parts.join(' | ');
}

/**
 * 희귀도 한국어 변환
 */
export function getRarityLabel(rarity: 'uncommon' | 'rare' | 'very-rare'): string {
  const labels = {
    'uncommon': '흔치 않음',
    'rare': '희귀',
    'very-rare': '매우 희귀',
  };
  return labels[rarity];
}
