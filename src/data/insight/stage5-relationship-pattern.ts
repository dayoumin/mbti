// ============================================================================
// Stage 5: 관계 패턴 분석
// ============================================================================
// 관계 활동 10개 이상 완료 시 해금
// RELATIONSHIP_TAGS 기반으로 대인관계 패턴 분석

import type { RelationshipTag, PersonalityTag } from './insight-tags';
import { RELATIONSHIP_TAGS } from './insight-tags';

// ============================================================================
// 타입 정의
// ============================================================================

export type TKIStyle = 'competing' | 'avoiding' | 'accommodating' | 'collaborating' | 'compromising';

export interface TKIStyleInfo {
  id: TKIStyle;
  name: string;
  nameKr: string;
  emoji: string;
  description: string;
  strength: string;
  watchOut: string;
}

export interface RelationshipProfile {
  id: string;
  name: string;
  nameKr: string;
  emoji: string;
  description: string;
  characteristics: string[];
  strengths: string[];
  growthAreas: string[];
}

export interface RelationshipPatternResult {
  // 갈등 스타일 (TKI 기반)
  conflictStyle: {
    primary: TKIStyleInfo;
    secondary?: TKIStyleInfo;
    score: Record<TKIStyle, number>; // 각 스타일 점수
    interpretation: string;
  };

  // 친밀도 선호
  intimacyPreference: {
    type: 'close' | 'distant' | 'balanced';
    score: number; // -100 (거리) ~ +100 (밀착)
    interpretation: string;
  };

  // 배려 방향
  careDirection: {
    type: 'self' | 'other' | 'balanced';
    score: number; // -100 (자기) ~ +100 (타인)
    interpretation: string;
  };

  // 소통 스타일
  communicationStyle: {
    type: 'assertive' | 'diplomatic' | 'balanced';
    score: number; // -100 (주장적) ~ +100 (외교적)
    interpretation: string;
  };

  // 종합 프로필
  profile: RelationshipProfile;

  // 인사이트
  insights: string[];

  // 생성 시간
  generatedAt: string;
}

// ============================================================================
// TKI 갈등 스타일 정의 (5가지)
// ============================================================================

export const TKI_STYLES: Record<TKIStyle, TKIStyleInfo> = {
  competing: {
    id: 'competing',
    name: 'Competing',
    nameKr: '경쟁형',
    emoji: '🦁',
    description: '자기 주장이 강하고 승부욕이 있어요. 목표 달성을 위해 적극적으로 행동해요.',
    strength: '결단력, 추진력, 리더십',
    watchOut: '타인의 의견을 무시할 수 있어요. 양보도 때로는 필요해요.',
  },
  avoiding: {
    id: 'avoiding',
    name: 'Avoiding',
    nameKr: '회피형',
    emoji: '🐢',
    description: '갈등 상황을 피하고 평화를 유지하려 해요. 불필요한 충돌을 싫어해요.',
    strength: '평화 유지, 신중함, 스트레스 관리',
    watchOut: '문제를 미루면 커질 수 있어요. 때로는 직면이 필요해요.',
  },
  accommodating: {
    id: 'accommodating',
    name: 'Accommodating',
    nameKr: '수용형',
    emoji: '🕊️',
    description: '상대방의 의견을 존중하고 양보하는 편이에요. 관계 유지를 중시해요.',
    strength: '배려심, 관계 유지, 조화',
    watchOut: '자신의 필요도 중요해요. 가끔은 주장해보세요.',
  },
  collaborating: {
    id: 'collaborating',
    name: 'Collaborating',
    nameKr: '협력형',
    emoji: '🤝',
    description: '모두가 만족하는 해결책을 찾으려 해요. 윈-윈을 추구해요.',
    strength: '문제해결력, 창의성, 공감능력',
    watchOut: '모든 상황에 최적 해결책이 있는 건 아니에요. 효율도 고려하세요.',
  },
  compromising: {
    id: 'compromising',
    name: 'Compromising',
    nameKr: '타협형',
    emoji: '⚖️',
    description: '적절한 중간 지점을 찾아요. 실용적인 해결을 선호해요.',
    strength: '현실감각, 협상력, 유연성',
    watchOut: '가끔 최선보다 차선에 만족할 수 있어요. 더 좋은 방법도 모색해보세요.',
  },
};

// ============================================================================
// 관계 프로필 정의 (8개)
// ============================================================================

export const RELATIONSHIP_PROFILES: RelationshipProfile[] = [
  // 밀착 + 타인우선 조합
  {
    id: 'caring-connector',
    name: 'Caring Connector',
    nameKr: '따뜻한 연결자',
    emoji: '💕',
    description: '가까운 관계를 좋아하고, 상대를 먼저 생각하는 타입이에요.',
    characteristics: [
      '친밀한 관계에서 에너지를 얻어요',
      '상대의 필요를 먼저 챙겨요',
      '깊은 유대감을 형성해요',
    ],
    strengths: ['공감능력', '헌신', '신뢰 형성'],
    growthAreas: ['자기 돌봄', '건강한 경계 설정'],
  },

  // 밀착 + 자기우선 조합
  {
    id: 'passionate-partner',
    name: 'Passionate Partner',
    nameKr: '열정적 파트너',
    emoji: '🔥',
    description: '가까운 관계를 원하면서도 자신의 필요를 분명히 아는 타입이에요.',
    characteristics: [
      '깊은 관계를 추구해요',
      '자신의 감정을 솔직히 표현해요',
      '열정적으로 관계에 임해요',
    ],
    strengths: ['자기표현', '열정', '솔직함'],
    growthAreas: ['상대 페이스 존중', '인내심'],
  },

  // 거리 + 타인우선 조합
  {
    id: 'gentle-guardian',
    name: 'Gentle Guardian',
    nameKr: '조용한 수호자',
    emoji: '🛡️',
    description: '개인 공간을 중시하지만, 상대를 배려하는 마음이 깊어요.',
    characteristics: [
      '적당한 거리를 유지해요',
      '조용히 상대를 챙겨요',
      '관계에서 안정감을 줘요',
    ],
    strengths: ['안정감', '차분함', '배려'],
    growthAreas: ['감정 표현', '더 가까워지기'],
  },

  // 거리 + 자기우선 조합
  {
    id: 'independent-spirit',
    name: 'Independent Spirit',
    nameKr: '독립적인 영혼',
    emoji: '🦅',
    description: '자유와 독립을 중시하고, 자기만의 시간이 필요한 타입이에요.',
    characteristics: [
      '개인 공간이 중요해요',
      '자기 결정을 존중받길 원해요',
      '독립적으로 행동해요',
    ],
    strengths: ['자립심', '명확한 경계', '자기 이해'],
    growthAreas: ['의존 허용하기', '도움 요청하기'],
  },

  // 주장적 + 협력 조합
  {
    id: 'confident-collaborator',
    name: 'Confident Collaborator',
    nameKr: '자신감 있는 협력가',
    emoji: '🌟',
    description: '자기 의견을 분명히 하면서도 함께 해결책을 찾아요.',
    characteristics: [
      '솔직하게 의견을 말해요',
      '하지만 상대 의견도 경청해요',
      '건설적인 대화를 이끌어요',
    ],
    strengths: ['리더십', '협상력', '명확한 소통'],
    growthAreas: ['더 많은 경청', '속도 조절'],
  },

  // 외교적 + 협력 조합
  {
    id: 'harmonious-mediator',
    name: 'Harmonious Mediator',
    nameKr: '조화로운 중재자',
    emoji: '☮️',
    description: '부드럽게 소통하며 모두가 편한 방향을 찾아요.',
    characteristics: [
      '분위기를 살피며 말해요',
      '갈등을 부드럽게 해결해요',
      '모두의 입장을 고려해요',
    ],
    strengths: ['중재력', '공감', '분위기 파악'],
    growthAreas: ['직접적 표현', '자기 주장'],
  },

  // 주장적 + 경쟁 조합
  {
    id: 'bold-leader',
    name: 'Bold Leader',
    nameKr: '대담한 리더',
    emoji: '👑',
    description: '자신감 있게 앞장서고, 목표를 향해 밀고 나가는 타입이에요.',
    characteristics: [
      '결정을 빨리 내려요',
      '책임감이 강해요',
      '도전을 두려워하지 않아요',
    ],
    strengths: ['결단력', '추진력', '카리스마'],
    growthAreas: ['타인 의견 수용', '페이스 조절'],
  },

  // 균형형
  {
    id: 'adaptable-relator',
    name: 'Adaptable Relator',
    nameKr: '유연한 관계인',
    emoji: '🌊',
    description: '상황에 따라 유연하게 관계 스타일을 조절하는 타입이에요.',
    characteristics: [
      '상황 판단이 빨라요',
      '다양한 사람과 잘 어울려요',
      '균형감각이 뛰어나요',
    ],
    strengths: ['적응력', '다양성', '균형'],
    growthAreas: ['일관된 정체성 유지', '깊은 관계 형성'],
  },
];

// ============================================================================
// 분석 함수
// ============================================================================

/**
 * TKI 갈등 스타일 점수 계산
 */
export function calculateConflictStyleScores(
  tagCounts: Record<string, number>
): Record<TKIStyle, number> {
  const styles: TKIStyle[] = ['competing', 'avoiding', 'accommodating', 'collaborating', 'compromising'];

  const scores: Record<TKIStyle, number> = {
    competing: 0,
    avoiding: 0,
    accommodating: 0,
    collaborating: 0,
    compromising: 0,
  };

  styles.forEach(style => {
    scores[style] = tagCounts[style] || 0;
  });

  return scores;
}

/**
 * 주요 갈등 스타일 찾기
 */
export function findPrimaryConflictStyles(
  scores: Record<TKIStyle, number>
): { primary: TKIStyle; secondary?: TKIStyle } {
  const sorted = (Object.entries(scores) as [TKIStyle, number][])
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length === 0) {
    return { primary: 'compromising' }; // 기본값
  }

  const result: { primary: TKIStyle; secondary?: TKIStyle } = {
    primary: sorted[0][0],
  };

  if (sorted.length > 1 && sorted[1][1] >= sorted[0][1] * 0.5) {
    result.secondary = sorted[1][0];
  }

  return result;
}

/**
 * 축 점수 계산 (-100 ~ +100)
 */
export function calculateAxisScore(
  tagCounts: Record<string, number>,
  leftTag: string,
  rightTag: string
): number {
  const leftCount = tagCounts[leftTag] || 0;
  const rightCount = tagCounts[rightTag] || 0;
  const total = leftCount + rightCount;

  if (total === 0) return 0;

  return Math.round(((rightCount - leftCount) / total) * 100);
}

/**
 * 축 해석 생성
 */
export function interpretAxisScore(
  score: number,
  leftLabel: string,
  rightLabel: string
): string {
  if (score <= -60) return `강하게 ${leftLabel} 성향`;
  if (score <= -20) return `${leftLabel} 성향`;
  if (score < 20) return `${leftLabel}/${rightLabel} 균형`;
  if (score < 60) return `${rightLabel} 성향`;
  return `강하게 ${rightLabel} 성향`;
}

/**
 * 관계 프로필 매칭
 */
export function matchRelationshipProfile(
  intimacyScore: number,
  careScore: number,
  communicationScore: number,
  conflictStyle: TKIStyle
): RelationshipProfile {
  // 밀착/거리 기준
  const isClose = intimacyScore > 20;
  const isDistant = intimacyScore < -20;

  // 배려 방향 기준
  const isSelfFirst = careScore < -20;
  const isOtherFirst = careScore > 20;

  // 소통 스타일 기준
  const isAssertive = communicationScore < -20;
  const isDiplomatic = communicationScore > 20;

  // 갈등 스타일에 따른 분기
  if (conflictStyle === 'competing') {
    if (isAssertive) {
      return RELATIONSHIP_PROFILES.find(p => p.id === 'bold-leader')!;
    }
  }

  if (conflictStyle === 'collaborating') {
    if (isAssertive) {
      return RELATIONSHIP_PROFILES.find(p => p.id === 'confident-collaborator')!;
    }
    if (isDiplomatic) {
      return RELATIONSHIP_PROFILES.find(p => p.id === 'harmonious-mediator')!;
    }
  }

  // 친밀도 + 배려 조합
  if (isClose && isOtherFirst) {
    return RELATIONSHIP_PROFILES.find(p => p.id === 'caring-connector')!;
  }
  if (isClose && isSelfFirst) {
    return RELATIONSHIP_PROFILES.find(p => p.id === 'passionate-partner')!;
  }
  if (isDistant && isOtherFirst) {
    return RELATIONSHIP_PROFILES.find(p => p.id === 'gentle-guardian')!;
  }
  if (isDistant && isSelfFirst) {
    return RELATIONSHIP_PROFILES.find(p => p.id === 'independent-spirit')!;
  }

  // 기본값: 균형형
  return RELATIONSHIP_PROFILES.find(p => p.id === 'adaptable-relator')!;
}

/**
 * 인사이트 문장 생성
 */
export function generateInsights(
  conflictStyle: TKIStyle,
  intimacyScore: number,
  careScore: number,
  communicationScore: number
): string[] {
  const insights: string[] = [];

  // 갈등 스타일 인사이트
  const styleInfo = TKI_STYLES[conflictStyle];
  insights.push(`갈등 상황에서 ${styleInfo.nameKr} 스타일로 대처하는 경향이 있어요.`);

  // 친밀도 인사이트
  if (Math.abs(intimacyScore) >= 40) {
    if (intimacyScore > 0) {
      insights.push('가까운 관계를 선호하고, 친밀한 유대를 형성하려 해요.');
    } else {
      insights.push('개인 공간을 중시하고, 적당한 거리를 유지하려 해요.');
    }
  }

  // 배려 방향 인사이트
  if (Math.abs(careScore) >= 40) {
    if (careScore > 0) {
      insights.push('상대방의 필요를 먼저 살피는 타입이에요.');
    } else {
      insights.push('자신의 필요를 분명히 인식하고 표현하는 타입이에요.');
    }
  }

  // 소통 스타일 인사이트
  if (Math.abs(communicationScore) >= 40) {
    if (communicationScore > 0) {
      insights.push('부드럽고 외교적인 소통 스타일을 가지고 있어요.');
    } else {
      insights.push('직접적이고 솔직한 소통 스타일을 가지고 있어요.');
    }
  }

  // 조합 인사이트
  if (conflictStyle === 'accommodating' && careScore > 30) {
    insights.push('관계 유지를 위해 양보하는 경향이 있어요. 가끔은 자기 주장도 필요해요.');
  }
  if (conflictStyle === 'competing' && communicationScore < -30) {
    insights.push('강한 추진력이 있지만, 상대 페이스도 고려해보세요.');
  }

  return insights.slice(0, 4); // 최대 4개
}

// ============================================================================
// 메인 함수
// ============================================================================

/**
 * 전체 관계 패턴 결과 생성
 */
export function generateRelationshipPatternResult(
  tagCounts: Record<string, number>
): RelationshipPatternResult {
  // 1. TKI 갈등 스타일 분석
  const conflictScores = calculateConflictStyleScores(tagCounts);
  const { primary, secondary } = findPrimaryConflictStyles(conflictScores);

  // 2. 축 점수 계산
  const intimacyScore = calculateAxisScore(tagCounts, 'space-needing', 'close-bonding');
  const careScore = calculateAxisScore(tagCounts, 'self-first', 'other-first');
  const communicationScore = calculateAxisScore(tagCounts, 'assertive', 'diplomatic');

  // 3. 프로필 매칭
  const profile = matchRelationshipProfile(intimacyScore, careScore, communicationScore, primary);

  // 4. 인사이트 생성
  const insights = generateInsights(primary, intimacyScore, careScore, communicationScore);

  // 5. 해석 생성
  const intimacyInterpretation = interpretAxisScore(intimacyScore, '거리형', '밀착형');
  const careInterpretation = interpretAxisScore(careScore, '자기 우선', '타인 우선');
  const communicationInterpretation = interpretAxisScore(communicationScore, '주장적', '외교적');

  // 갈등 스타일 해석
  let conflictInterpretation = `${TKI_STYLES[primary].nameKr} 스타일`;
  if (secondary) {
    conflictInterpretation += ` + ${TKI_STYLES[secondary].nameKr} 성향`;
  }

  return {
    conflictStyle: {
      primary: TKI_STYLES[primary],
      secondary: secondary ? TKI_STYLES[secondary] : undefined,
      score: conflictScores,
      interpretation: conflictInterpretation,
    },
    intimacyPreference: {
      type: intimacyScore > 20 ? 'close' : intimacyScore < -20 ? 'distant' : 'balanced',
      score: intimacyScore,
      interpretation: intimacyInterpretation,
    },
    careDirection: {
      type: careScore > 20 ? 'other' : careScore < -20 ? 'self' : 'balanced',
      score: careScore,
      interpretation: careInterpretation,
    },
    communicationStyle: {
      type: communicationScore > 20 ? 'diplomatic' : communicationScore < -20 ? 'assertive' : 'balanced',
      score: communicationScore,
      interpretation: communicationInterpretation,
    },
    profile,
    insights,
    generatedAt: new Date().toISOString(),
  };
}

// ============================================================================
// 텍스트 헬퍼
// ============================================================================

/**
 * 요약 텍스트 생성
 */
export function getSummaryText(result: RelationshipPatternResult): string {
  const { profile, conflictStyle } = result;
  return `${profile.emoji} ${profile.nameKr}: ${conflictStyle.interpretation}`;
}

/**
 * TKI 스타일 설명 가져오기
 */
export function getTKIDescription(style: TKIStyle): string {
  return TKI_STYLES[style].description;
}
