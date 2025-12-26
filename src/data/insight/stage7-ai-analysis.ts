// ============================================================================
// Stage 7: AI 종합 분석
// ============================================================================
// Stage 6 해금 + 유료 결제 시 사용 가능
// 축적된 전체 데이터를 AI에게 전달하여 맞춤형 리포트 생성
//
// 이 파일은 AI 분석용 데이터 구조와 프롬프트 생성 로직을 담당
// 실제 AI 호출은 API 엔드포인트에서 처리

import type { Stage2Rule } from './stage2-rules';
import type { DecisionStyleResult } from './stage3-decision-style';
import type { InterestMapResult } from './stage4-interest-map';
import type { RelationshipPatternResult } from './stage5-relationship-pattern';
import type { HiddenPatternResult } from './stage6-hidden-pattern';

// ============================================================================
// 타입 정의
// ============================================================================

/** AI 분석에 전달할 사용자 프로필 데이터 */
export interface AIAnalysisInput {
  // 활동 요약
  activitySummary: {
    totalTests: number;
    totalPolls: number;
    totalQuizzes: number;
    totalActivities: number;
    activeDays: number; // 활동한 일수
  };

  // Stage별 인사이트 요약
  insights: {
    stage1: Stage1Summary | null;
    stage2: Stage2Summary | null;
    stage3: Stage3Summary | null;
    stage4: Stage4Summary | null;
    stage5: Stage5Summary | null;
    stage6: Stage6Summary | null;
  };

  // 전체 태그 분포
  tagDistribution: Array<{
    tag: string;
    count: number;
    percentage: number;
    category: 'personality' | 'decision' | 'relationship' | 'interest' | 'lifestyle';
  }>;
}

/** Stage 1 요약 */
export interface Stage1Summary {
  testCount: number;
  dominantTags: string[]; // 상위 3개
}

/** Stage 2 요약 */
export interface Stage2Summary {
  matchedRulesCount: number;
  topRules: Array<{
    title: string;
    description: string;
  }>;
}

/** Stage 3 요약 */
export interface Stage3Summary {
  profileName: string;
  dimensions: Array<{
    name: string;
    score: number; // -100 ~ +100
    interpretation: string;
  }>;
}

/** Stage 4 요약 */
export interface Stage4Summary {
  profileName: string;
  topInterests: Array<{
    category: string;
    percentage: number;
  }>;
}

/** Stage 5 요약 */
export interface Stage5Summary {
  profileName: string;
  conflictStyle: string;
  intimacyPreference: string;
  careDirection: string;
}

/** Stage 6 요약 */
export interface Stage6Summary {
  consistencyScore: number;
  contradictions: Array<{
    pattern: string;
    insight: string;
  }>;
  rarePatterns: string[];
}

/** AI 분석 결과 */
export interface AIAnalysisResult {
  // 핵심 정체성 (한 문장)
  coreIdentity: string;

  // 5가지 핵심 특성
  keyTraits: Array<{
    trait: string;
    emoji: string;
    description: string;
    strength: 'very-strong' | 'strong' | 'moderate';
  }>;

  // 강점 분석 (3개)
  strengths: Array<{
    title: string;
    description: string;
    examples: string[];
  }>;

  // 성장 포인트 (2개)
  growthAreas: Array<{
    title: string;
    description: string;
    tips: string[];
  }>;

  // 관계 스타일 분석
  relationshipStyle: {
    summary: string;
    compatibleTypes: string[];
    challengingTypes: string[];
    advice: string;
  };

  // 숨겨진 가능성
  hiddenPotential: {
    title: string;
    description: string;
    howToUnlock: string;
  };

  // 맞춤 조언 (3개)
  personalizedAdvice: Array<{
    context: string;
    advice: string;
  }>;

  // 메타 정보
  meta: {
    generatedAt: string;
    dataPoints: number; // 분석에 사용된 데이터 포인트 수
    confidenceLevel: 'high' | 'medium' | 'low';
  };
}

// ============================================================================
// AI 프롬프트 생성
// ============================================================================

/**
 * AI 분석용 시스템 프롬프트 생성
 */
export function generateSystemPrompt(): string {
  return `당신은 심리학과 행동 분석 전문가입니다. 사용자의 테스트 결과, 투표/퀴즈 참여 패턴, 태그 데이터를 분석하여 맞춤형 성격 리포트를 작성합니다.

분석 원칙:
1. 데이터 기반 객관성: 추측이 아닌 실제 행동 패턴 기반 분석
2. 긍정적 프레이밍: 약점도 성장 가능성으로 재해석
3. 구체적 예시: 추상적 표현 대신 일상에서의 적용 예시 제공
4. 모순의 통합: 상반된 특성은 상황적 유연성으로 해석

출력 형식:
- JSON 형식으로 응답
- 모든 텍스트는 한국어
- 이모지 적극 활용
- 2인칭(~해요, ~네요) 사용`;
}

/**
 * AI 분석용 사용자 프롬프트 생성
 */
export function generateUserPrompt(input: AIAnalysisInput): string {
  const lines: string[] = [];

  lines.push('# 사용자 프로필 데이터');
  lines.push('');

  // 활동 요약
  lines.push('## 활동 요약');
  lines.push(`- 완료한 테스트: ${input.activitySummary.totalTests}개`);
  lines.push(`- 참여한 투표: ${input.activitySummary.totalPolls}개`);
  lines.push(`- 풀어본 퀴즈: ${input.activitySummary.totalQuizzes}개`);
  lines.push(`- 총 활동: ${input.activitySummary.totalActivities}개`);
  lines.push('');

  // Stage별 인사이트
  lines.push('## 단계별 인사이트');
  lines.push('');

  if (input.insights.stage1) {
    lines.push('### 기본 성향 (Stage 1)');
    lines.push(`- 테스트 수: ${input.insights.stage1.testCount}`);
    lines.push(`- 상위 태그: ${input.insights.stage1.dominantTags.join(', ')}`);
    lines.push('');
  }

  if (input.insights.stage2) {
    lines.push('### 성격 조합 (Stage 2)');
    lines.push(`- 매칭된 룰: ${input.insights.stage2.matchedRulesCount}개`);
    input.insights.stage2.topRules.forEach((rule, i) => {
      lines.push(`- ${i + 1}. ${rule.title}: ${rule.description}`);
    });
    lines.push('');
  }

  if (input.insights.stage3) {
    lines.push('### 판단 스타일 (Stage 3)');
    lines.push(`- 프로필: ${input.insights.stage3.profileName}`);
    input.insights.stage3.dimensions.forEach(dim => {
      lines.push(`- ${dim.name}: ${dim.interpretation} (${dim.score > 0 ? '+' : ''}${dim.score})`);
    });
    lines.push('');
  }

  if (input.insights.stage4) {
    lines.push('### 관심사 지도 (Stage 4)');
    lines.push(`- 프로필: ${input.insights.stage4.profileName}`);
    input.insights.stage4.topInterests.forEach(interest => {
      lines.push(`- ${interest.category}: ${interest.percentage}%`);
    });
    lines.push('');
  }

  if (input.insights.stage5) {
    lines.push('### 관계 패턴 (Stage 5)');
    lines.push(`- 프로필: ${input.insights.stage5.profileName}`);
    lines.push(`- 갈등 스타일: ${input.insights.stage5.conflictStyle}`);
    lines.push(`- 친밀도 선호: ${input.insights.stage5.intimacyPreference}`);
    lines.push(`- 배려 방향: ${input.insights.stage5.careDirection}`);
    lines.push('');
  }

  if (input.insights.stage6) {
    lines.push('### 숨은 패턴 (Stage 6)');
    lines.push(`- 일관성 점수: ${input.insights.stage6.consistencyScore}%`);
    if (input.insights.stage6.contradictions.length > 0) {
      lines.push('- 모순 패턴:');
      input.insights.stage6.contradictions.forEach(c => {
        lines.push(`  - ${c.pattern}: ${c.insight}`);
      });
    }
    if (input.insights.stage6.rarePatterns.length > 0) {
      lines.push(`- 희귀 조합: ${input.insights.stage6.rarePatterns.join(', ')}`);
    }
    lines.push('');
  }

  // 태그 분포
  lines.push('## 태그 분포 (상위 15개)');
  input.tagDistribution.slice(0, 15).forEach((tag, i) => {
    lines.push(`${i + 1}. ${tag.tag}: ${tag.count}회 (${tag.percentage}%)`);
  });
  lines.push('');

  lines.push('---');
  lines.push('위 데이터를 분석하여 맞춤형 성격 리포트를 JSON 형식으로 작성해주세요.');

  return lines.join('\n');
}

// ============================================================================
// 데이터 변환 헬퍼
// ============================================================================

/**
 * Stage 2 룰을 요약 형식으로 변환
 */
export function summarizeStage2Rules(rules: Stage2Rule[]): Stage2Summary {
  return {
    matchedRulesCount: rules.length,
    topRules: rules.slice(0, 3).map(rule => ({
      title: rule.insight.title,
      description: rule.insight.description,
    })),
  };
}

/**
 * Stage 3 결과를 요약 형식으로 변환
 */
export function summarizeStage3Result(result: DecisionStyleResult): Stage3Summary {
  return {
    profileName: result.profile.nameKr,
    dimensions: result.dimensions.map(dim => ({
      name: dim.dimension.nameKr,
      score: dim.score,
      interpretation: dim.interpretation,
    })),
  };
}

/**
 * Stage 4 결과를 요약 형식으로 변환
 */
export function summarizeStage4Result(result: InterestMapResult): Stage4Summary {
  return {
    profileName: result.interestProfile.nameKr,
    topInterests: result.entries.slice(0, 3).map(entry => ({
      category: entry.category.nameKr,
      percentage: entry.percentage,
    })),
  };
}

/**
 * Stage 5 결과를 요약 형식으로 변환
 */
export function summarizeStage5Result(result: RelationshipPatternResult): Stage5Summary {
  return {
    profileName: result.profile.nameKr,
    conflictStyle: result.conflictStyle.primary.nameKr,
    intimacyPreference: result.intimacyPreference.interpretation,
    careDirection: result.careDirection.interpretation,
  };
}

/**
 * Stage 6 결과를 요약 형식으로 변환
 */
export function summarizeStage6Result(result: HiddenPatternResult): Stage6Summary {
  return {
    consistencyScore: result.consistency.score,
    contradictions: result.contradictions.slice(0, 3).map(c => ({
      pattern: c.interpretation,
      insight: c.insight,
    })),
    rarePatterns: result.rarePatterns.slice(0, 3).map(p => p.interpretation),
  };
}

// ============================================================================
// 기본 리포트 생성 (AI 없이)
// ============================================================================

/**
 * AI 없이 기본 리포트 생성 (폴백용)
 * 실제 서비스에서는 AI 응답 사용
 */
export function generateFallbackReport(input: AIAnalysisInput): AIAnalysisResult {
  const dominantTags = input.tagDistribution.slice(0, 5);
  const hasHighActivity = input.activitySummary.totalActivities >= 30;

  // 핵심 태그에서 정체성 추출
  const coreTag = dominantTags[0]?.tag || 'balanced';
  const coreIdentity = getCoreIdentityFromTag(coreTag);

  return {
    coreIdentity,

    keyTraits: dominantTags.slice(0, 5).map((tag, idx) => ({
      trait: getTraitNameFromTag(tag.tag),
      emoji: getEmojiFromTag(tag.tag),
      description: getTraitDescriptionFromTag(tag.tag),
      strength: idx === 0 ? 'very-strong' : idx < 3 ? 'strong' : 'moderate',
    })),

    strengths: [
      {
        title: '다양한 관심사',
        description: `${input.activitySummary.totalActivities}개의 활동을 통해 폭넓은 호기심을 보여주셨어요.`,
        examples: ['새로운 분야에 대한 열린 마음', '다양한 주제에 대한 이해력'],
      },
      {
        title: '자기 탐색 의지',
        description: '테스트와 콘텐츠 참여를 통해 자신을 알아가려는 노력이 돋보여요.',
        examples: ['성찰적인 태도', '성장 지향적 마인드셋'],
      },
      {
        title: input.insights.stage3?.profileName || '균형 잡힌 판단력',
        description: input.insights.stage3?.dimensions[0]?.interpretation || '상황에 따라 유연하게 판단하는 능력',
        examples: ['실용성과 감성의 조화', '안정과 모험의 균형'],
      },
    ],

    growthAreas: [
      {
        title: '일관성 강화',
        description: input.insights.stage6
          ? `일관성 ${input.insights.stage6.consistencyScore}%로, 상황에 따른 유연함을 보여요.`
          : '더 많은 활동으로 패턴을 파악해보세요.',
        tips: ['비슷한 상황에서의 선택 패턴 관찰하기', '핵심 가치 명확히 하기'],
      },
      {
        title: '관계 스킬 발전',
        description: input.insights.stage5
          ? `${input.insights.stage5.conflictStyle} 스타일을 보완할 수 있어요.`
          : '관계 관련 콘텐츠에 더 참여해보세요.',
        tips: ['다양한 갈등 대처 방식 연습', '상대방 관점 이해하기'],
      },
    ],

    relationshipStyle: {
      summary: input.insights.stage5?.profileName || '데이터 수집 중',
      compatibleTypes: ['공감형', '협력형'],
      challengingTypes: ['경쟁형', '회피형'],
      advice: '상대방의 관계 스타일을 이해하고 조율하는 연습을 해보세요.',
    },

    hiddenPotential: {
      title: '미발견 영역',
      description: input.insights.stage6?.rarePatterns[0] || '독특한 조합이 발견될 수 있어요',
      howToUnlock: '평소와 다른 유형의 콘텐츠에 도전해보세요.',
    },

    personalizedAdvice: [
      {
        context: '일상에서',
        advice: `${getTraitNameFromTag(coreTag)} 성향을 살려 강점을 발휘해보세요.`,
      },
      {
        context: '관계에서',
        advice: '자신의 관계 스타일을 인식하고 상대에게 맞춰 조율해보세요.',
      },
      {
        context: '성장을 위해',
        advice: '익숙하지 않은 영역에 도전하면 새로운 가능성을 발견할 수 있어요.',
      },
    ],

    meta: {
      generatedAt: new Date().toISOString(),
      dataPoints: input.activitySummary.totalActivities,
      confidenceLevel: hasHighActivity ? 'high' : input.activitySummary.totalActivities >= 15 ? 'medium' : 'low',
    },
  };
}

// ============================================================================
// 태그-텍스트 변환 헬퍼
// ============================================================================

function getCoreIdentityFromTag(tag: string): string {
  const identities: Record<string, string> = {
    // 기본 성격 - 에너지 방향 (외향성)
    extroverted: '사람들과 함께할 때 빛나는, 에너지 넘치는 소통가',
    introverted: '내면의 세계가 풍부한, 깊이 있는 사색가',
    ambiverted: '상황에 따라 유연하게 적응하는 균형 잡힌 소통가',
    // 정보 처리 (개방성)
    logical: '논리적 분석으로 문제를 해결하는 전략가',
    emotional: '감성과 공감 능력이 뛰어난 마음 따뜻한 사람',
    intuitive: '직관과 본능을 신뢰하는 통찰력의 소유자',
    analytical: '세밀한 분석으로 본질을 꿰뚫는 전략가',
    // 행동 방식 (성실성)
    planned: '체계적으로 준비하며 안정을 추구하는 플래너',
    spontaneous: '즉흥적인 순간을 즐기는 자유로운 영혼',
    flexible: '변화에 유연하게 적응하는 적응력의 달인',
    structured: '질서와 체계를 중시하는 조직력의 소유자',
    // 관계 스타일 (친화성)
    independent: '혼자서도 잘 해내는 자립심 강한 사람',
    collaborative: '함께 시너지를 내는 협력의 달인',
    supportive: '주변 사람을 먼저 배려하는 따뜻한 조력자',
    leading: '앞장서서 이끄는 리더십의 소유자',
    // 정서 안정성 (신경성)
    resilient: '어려움 속에서도 다시 일어나는 회복력의 소유자',
    sensitive: '섬세한 감수성으로 세상을 느끼는 사람',
    // 기타 성격
    adventurous: '새로운 경험을 두려워하지 않는 탐험가',
    safe: '신중하게 판단하며 안전을 우선시하는 현실주의자',
    cautious: '충분히 고려한 후 신중하게 결정하는 사려 깊은 사람',
    practical: '실용적인 가치를 추구하는 효율 전문가',
    sentimental: '감성과 의미를 중시하는 로맨티스트',
    // 시간 지향
    'present-focused': '지금 이 순간을 온전히 즐기는 현재주의자',
    'future-focused': '장기적 비전을 품고 미래를 준비하는 계획가',
    // 관계 스타일 (TKI 갈등 유형)
    collaborating: '함께 해결책을 찾아가는 협력적 파트너',
    competing: '목표를 향해 당당히 나아가는 추진력의 소유자',
    avoiding: '갈등을 현명하게 피하며 평화를 지키는 중재자',
    accommodating: '타인을 먼저 배려하는 따뜻한 마음의 소유자',
    compromising: '균형과 조화를 추구하는 현실적인 협상가',
    // 친밀도/배려 관계
    'close-bonding': '깊고 밀착된 관계를 선호하는 친밀함의 대가',
    'space-needing': '적당한 거리에서 서로를 존중하는 독립적인 사람',
    'self-first': '자신을 먼저 돌보며 건강한 경계를 유지하는 사람',
    'other-first': '타인을 우선시하며 헌신하는 배려의 아이콘',
    // 소통 스타일
    assertive: '자신의 의견을 명확히 표현하는 당당한 소통가',
    diplomatic: '상황에 맞게 유연하게 소통하는 외교관',
    expressive: '감정을 솔직하게 표현하는 열린 마음의 소유자',
    reserved: '신중하게 감정을 다루는 차분한 관찰자',
    // 성향
    optimistic: '긍정적인 시각으로 세상을 바라보는 희망의 메신저',
    pessimistic: '현실을 냉철하게 분석하는 신중한 전략가',
    // analytical은 454행에 이미 정의됨
    creative: '창의적인 아이디어로 새로운 가능성을 여는 혁신가',
    // 라이프스타일 (SSOT: insight-tags.ts LIFESTYLE_TAGS)
    active: '에너지 넘치는 활동적인 라이프스타일의 소유자',
    homebody: '집에서의 편안한 시간을 소중히 여기는 안락함의 전문가',
    frugal: '합리적인 소비로 가치를 극대화하는 현명한 절약가',
    splurger: '좋아하는 것에 아낌없이 투자하는 과감한 소비가',
    'morning-person': '아침의 상쾌함으로 하루를 시작하는 부지런한 사람',
    'night-owl': '밤의 고요함 속에서 영감을 얻는 야행성 창작가',
    consuming: '다양한 콘텐츠를 즐기며 영감을 얻는 문화 애호가',
  };

  // interest-* 태그 처리 (SSOT: insight-tags.ts INTEREST_TAGS 기준)
  if (tag.startsWith('interest-')) {
    const interest = tag.replace('interest-', '');
    const interestNames: Record<string, string> = {
      // 반려동물 (SSOT)
      cat: '고양이를 사랑하는 섬세한 감성의 소유자',
      dog: '강아지와 함께하며 따뜻한 에너지를 나누는 사람',
      rabbit: '토끼처럼 순수하고 부드러운 감성의 소유자',
      hamster: '작은 것에서 큰 행복을 찾는 세심한 사람',
      bird: '자유로운 영혼을 가진 호기심 많은 탐험가',
      fish: '고요함 속에서 평화를 찾는 관조적인 사람',
      reptile: '독특한 취향과 깊은 관심을 가진 탐구자',
      pet: '반려동물을 사랑하는 따뜻한 마음의 소유자',
      // 식물/자연
      plant: '식물과 함께 성장하며 생명을 가꾸는 사람',
      nature: '자연과 교감하며 평화를 찾는 사람',
      // 음식/음료
      coffee: '커피 한 잔의 여유를 아는 감각적인 사람',
      food: '미식의 즐거움을 아는 감각적인 탐험가',
      alcohol: '좋은 술과 함께하는 시간을 즐기는 미식가',
      // 관계/라이프스타일
      love: '사랑과 관계에 진심을 다하는 로맨티스트',
      lifestyle: '삶의 질을 중시하며 균형을 추구하는 사람',
      money: '재테크에 관심 많은 현실적인 계획가',
      // 운세/심리
      tarot: '타로로 내면을 탐구하는 신비로운 영혼',
      zodiac: '별자리와 운세에 관심 많은 탐구자',
      psychology: '심리학으로 마음을 이해하려는 탐구자',
    };
    return interestNames[interest] || `${interest}에 관심이 많은 다채로운 사람`;
  }

  return identities[tag] || '다양한 면을 가진 복합적인 성격의 소유자';
}

function getTraitNameFromTag(tag: string): string {
  const names: Record<string, string> = {
    // 에너지 방향 (외향성)
    extroverted: '외향성',
    introverted: '내향성',
    ambiverted: '양향성',
    // 정보 처리 (개방성)
    logical: '논리적 사고',
    emotional: '감성적 공감',
    intuitive: '직관력',
    analytical: '분석력',
    // 행동 방식 (성실성)
    planned: '계획성',
    spontaneous: '즉흥성',
    flexible: '유연성',
    structured: '체계성',
    // 관계 스타일 (친화성)
    independent: '독립성',
    collaborative: '협력성',
    supportive: '지지력',
    leading: '리더십',
    // 정서 안정성 (신경성)
    resilient: '회복력',
    sensitive: '민감성',
    // 기타 성격
    adventurous: '모험 추구',
    safe: '안정 추구',
    cautious: '신중함',
    practical: '실용주의',
    sentimental: '감성주의',
    // 시간 지향
    'present-focused': '현재 중심',
    'future-focused': '미래 지향',
    // 기타
    following: '협력성',
    direct: '직접적 소통',
    indirect: '배려적 소통',
    solo: '독립 활동',
    together: '협동 활동',
    // 관계 스타일 (TKI)
    collaborating: '협력형',
    competing: '경쟁형',
    avoiding: '회피형',
    accommodating: '수용형',
    compromising: '타협형',
    // 친밀도/배려
    'close-bonding': '밀착형',
    'space-needing': '거리형',
    'self-first': '자기 우선',
    'other-first': '타인 우선',
    // 소통 스타일
    assertive: '적극적 소통',
    diplomatic: '외교적 소통',
    expressive: '표현적',
    reserved: '절제적',
    // 성향
    optimistic: '낙관성',
    pessimistic: '신중함',
    // analytical은 545행에 이미 정의됨
    creative: '창의성',
    // 라이프스타일 (SSOT: insight-tags.ts LIFESTYLE_TAGS)
    active: '활동적',
    homebody: '집순이/집돌이',
    frugal: '절약형',
    splurger: '소비형',
    'morning-person': '아침형',
    'night-owl': '저녁형',
    consuming: '콘텐츠 소비형',
  };

  // interest-* 태그 처리 (SSOT: insight-tags.ts INTEREST_TAGS 기준)
  if (tag.startsWith('interest-')) {
    const interest = tag.replace('interest-', '');
    const interestNames: Record<string, string> = {
      // 반려동물
      cat: '고양이 사랑',
      dog: '강아지 사랑',
      rabbit: '토끼 사랑',
      hamster: '햄스터 사랑',
      bird: '조류 사랑',
      fish: '물고기 관심',
      reptile: '파충류 관심',
      pet: '반려동물 사랑',
      // 식물/자연
      plant: '식물 가꾸기',
      nature: '자연 친화',
      // 음식/음료
      coffee: '커피 애호가',
      food: '미식 탐구',
      alcohol: '주류 관심',
      // 관계/라이프스타일
      love: '연애 관심',
      lifestyle: '라이프스타일',
      money: '재테크 관심',
      // 운세/심리
      tarot: '타로 관심',
      zodiac: '별자리 관심',
      psychology: '심리학 관심',
    };
    return interestNames[interest] || `${interest} 관심`;
  }

  return names[tag] || tag;
}

function getEmojiFromTag(tag: string): string {
  const emojis: Record<string, string> = {
    // 에너지 방향 (외향성)
    extroverted: '🎉',
    introverted: '🌙',
    ambiverted: '🌓',
    // 정보 처리 (개방성)
    logical: '🧠',
    emotional: '💗',
    intuitive: '✨',
    analytical: '📊',
    // 행동 방식 (성실성)
    planned: '📋',
    spontaneous: '🎲',
    flexible: '🌊',
    structured: '🏗️',
    // 관계 스타일 (친화성)
    independent: '🦅',
    collaborative: '🤝',
    supportive: '🤲',
    leading: '👑',
    // 정서 안정성 (신경성)
    resilient: '💪',
    sensitive: '🌸',
    // 기타 성격
    adventurous: '🚀',
    safe: '🛡️',
    cautious: '🔍',
    practical: '⚙️',
    sentimental: '🎭',
    // 시간 지향
    'present-focused': '☀️',
    'future-focused': '🔭',
    // 기타
    following: '🤝',
    direct: '💬',
    indirect: '🌷',
    solo: '🎯',
    together: '👥',
    // 관계 스타일 (TKI)
    collaborating: '🤝',
    competing: '🏆',
    avoiding: '🕊️',
    accommodating: '💝',
    compromising: '⚖️',
    // 친밀도/배려
    'close-bonding': '🫂',
    'space-needing': '🌿',
    'self-first': '💪',
    'other-first': '🎁',
    // 소통 스타일
    assertive: '📢',
    diplomatic: '🎩',
    expressive: '🎨',
    reserved: '🔮',
    // 성향
    optimistic: '☀️',
    pessimistic: '🔍',
    // analytical은 642행에 이미 정의됨
    creative: '💡',
    // 라이프스타일 (SSOT: insight-tags.ts LIFESTYLE_TAGS)
    active: '🏃',
    homebody: '🏠',
    frugal: '💰',
    splurger: '💸',
    'morning-person': '🌅',
    'night-owl': '🌙',
    consuming: '📺',
  };

  // interest-* 태그 처리 (SSOT: insight-tags.ts INTEREST_TAGS 기준)
  if (tag.startsWith('interest-')) {
    const interest = tag.replace('interest-', '');
    const interestEmojis: Record<string, string> = {
      // 반려동물
      cat: '🐱',
      dog: '🐕',
      rabbit: '🐰',
      hamster: '🐹',
      bird: '🐦',
      fish: '🐟',
      reptile: '🦎',
      pet: '🐾',
      // 식물/자연
      plant: '🌱',
      nature: '🌳',
      // 음식/음료
      coffee: '☕',
      food: '🍽️',
      alcohol: '🍷',
      // 관계/라이프스타일
      love: '💕',
      lifestyle: '✨',
      money: '💰',
      // 운세/심리
      tarot: '🔮',
      zodiac: '⭐',
      psychology: '🧠',
    };
    return interestEmojis[interest] || '✨';
  }

  return emojis[tag] || '✨';
}

function getTraitDescriptionFromTag(tag: string): string {
  const descriptions: Record<string, string> = {
    // 에너지 방향 (외향성)
    extroverted: '사람들과의 교류에서 에너지를 얻고, 활발한 소통을 즐겨요.',
    introverted: '혼자만의 시간에서 충전하고, 깊이 있는 관계를 선호해요.',
    ambiverted: '상황에 따라 외향적이거나 내향적으로 유연하게 전환해요.',
    // 정보 처리 (개방성)
    logical: '감정보다 논리를 우선시하며, 객관적인 분석을 중시해요.',
    emotional: '감정과 직관을 신뢰하며, 공감 능력이 뛰어나요.',
    intuitive: '본능과 직관을 신뢰하며, 전체적인 그림을 파악하는 데 능해요.',
    analytical: '데이터와 논리를 바탕으로 세밀하게 분석하는 능력이 뛰어나요.',
    // 행동 방식 (성실성)
    planned: '미리 계획하고 준비하는 것을 좋아하며, 안정감을 추구해요.',
    spontaneous: '즉흥적인 결정을 즐기며, 유연하게 상황에 적응해요.',
    flexible: '변화에 유연하게 적응하고, 다양한 상황에서 유연하게 대처해요.',
    structured: '체계적인 접근을 선호하며, 질서 있는 환경에서 편안함을 느껴요.',
    // 관계 스타일 (친화성)
    independent: '스스로 판단하고 결정하며, 자립적으로 문제를 해결해요.',
    collaborative: '함께 협력하며 시너지를 내는 것을 좋아해요.',
    supportive: '주변 사람들을 먼저 배려하고 지원하는 역할을 잘해요.',
    leading: '앞장서서 이끄는 것을 좋아하고 책임감이 강해요.',
    // 정서 안정성 (신경성)
    resilient: '어려움이나 스트레스 상황에서도 빠르게 회복하고 다시 일어나요.',
    sensitive: '섬세한 감수성으로 주변 환경과 감정에 민감하게 반응해요.',
    // 기타 성격
    adventurous: '새로운 도전과 경험을 두려워하지 않아요.',
    safe: '검증된 방법을 선호하며, 리스크를 최소화해요.',
    cautious: '충분히 고려하고 신중하게 결정을 내리며, 위험을 미리 대비해요.',
    practical: '실질적인 가치와 효율성을 중시해요.',
    sentimental: '감성적 가치와 의미를 중요하게 생각해요.',
    // 시간 지향
    'present-focused': '지금 이 순간을 온전히 즐기며, 현재에 집중하는 것을 좋아해요.',
    'future-focused': '장기적인 관점에서 미래를 준비하고 계획하는 것을 중시해요.',
    // 기타
    following: '팀의 조화를 위해 협력하고 지원하는 역할을 잘해요.',
    direct: '솔직하고 명확하게 의사를 표현해요.',
    indirect: '상대방의 감정을 고려하며 부드럽게 소통해요.',
    solo: '독립적으로 일하는 것을 선호해요.',
    together: '함께 협력하며 시너지를 내는 것을 좋아해요.',
    // 관계 스타일 (TKI)
    collaborating: '상대와 함께 윈-윈 해결책을 찾으며, 관계와 목표 모두를 중시해요.',
    competing: '자신의 목표를 향해 적극적으로 나아가며, 결과를 중시해요.',
    avoiding: '갈등 상황을 피하며 평화로운 관계를 유지하려 해요.',
    accommodating: '상대의 필요를 먼저 고려하며, 조화를 중시해요.',
    compromising: '서로 양보하며 빠르게 합의점을 찾는 현실적인 접근을 해요.',
    // 친밀도/배려
    'close-bonding': '깊고 친밀한 관계를 선호하며, 가까운 사람과 많은 것을 공유해요.',
    'space-needing': '개인 공간을 중시하며, 적당한 거리에서 편안함을 느껴요.',
    'self-first': '자신의 필요와 건강을 먼저 챙기며, 건강한 경계를 유지해요.',
    'other-first': '타인을 먼저 배려하고, 주변 사람들의 행복에 가치를 둬요.',
    // 소통 스타일
    assertive: '자신의 생각과 감정을 명확하고 당당하게 전달해요.',
    diplomatic: '상황에 맞게 적절한 표현을 선택하며 조율하는 능력이 뛰어나요.',
    expressive: '감정을 솔직하게 표현하며, 열린 소통을 선호해요.',
    reserved: '감정을 신중하게 다루며, 차분하고 절제된 소통을 해요.',
    // 성향
    optimistic: '긍정적인 시각으로 상황을 바라보며, 가능성에 집중해요.',
    pessimistic: '현실적으로 상황을 분석하며, 리스크를 미리 대비해요.',
    // analytical은 739행에 이미 정의됨
    creative: '새로운 아이디어와 독창적인 해결책을 찾는 것을 즐겨요.',
    // 라이프스타일 (SSOT: insight-tags.ts LIFESTYLE_TAGS)
    active: '활동적인 것을 좋아하며, 밖에서 에너지를 발산하는 것을 즐겨요.',
    homebody: '집에서 편안하게 시간을 보내는 것을 좋아해요.',
    frugal: '합리적인 소비를 추구하며, 가치 있는 곳에 돈을 쓰는 것을 중시해요.',
    splurger: '좋아하는 것에 과감하게 투자하며, 경험에 가치를 둬요.',
    'morning-person': '아침에 활력이 넘치며, 일찍 시작하는 하루를 선호해요.',
    'night-owl': '밤에 더 활발하며, 늦은 시간에 영감이 떠오르는 편이에요.',
    consuming: '영화, 드라마, 책 등 다양한 콘텐츠를 즐기는 것을 좋아해요.',
  };

  // interest-* 태그 처리 (SSOT: insight-tags.ts INTEREST_TAGS 기준)
  if (tag.startsWith('interest-')) {
    const interest = tag.replace('interest-', '');
    const interestDescs: Record<string, string> = {
      // 반려동물
      cat: '고양이와 함께하며 섬세한 교감을 나누는 것을 좋아해요.',
      dog: '강아지와 함께하며 따뜻한 유대감을 나누는 것을 좋아해요.',
      rabbit: '토끼의 순수함에 매력을 느끼며 부드러운 감성을 가졌어요.',
      hamster: '작은 생명체를 돌보며 세심한 배려심을 보여줘요.',
      bird: '새들의 자유로움에 매력을 느끼며 호기심이 풍부해요.',
      fish: '물고기를 관찰하며 차분한 시간을 보내는 것을 좋아해요.',
      reptile: '파충류에 대한 깊은 관심과 독특한 취향을 가졌어요.',
      pet: '반려동물에 대한 따뜻한 애정을 가지고 있어요.',
      // 식물/자연
      plant: '식물을 가꾸며 생명을 돌보는 것에 보람을 느껴요.',
      nature: '자연과 함께하며 평화와 안정을 찾는 것을 좋아해요.',
      // 음식/음료
      coffee: '커피 한 잔의 여유를 즐기며 감각적인 취향을 가졌어요.',
      food: '다양한 음식을 탐구하고 미식의 즐거움을 아는 사람이에요.',
      alcohol: '좋은 술과 함께하는 시간의 가치를 아는 미식가예요.',
      // 관계/라이프스타일
      love: '사랑과 관계에 진심을 다하며 로맨틱한 감성을 가졌어요.',
      lifestyle: '삶의 질을 높이는 것에 관심이 많고 균형을 추구해요.',
      money: '재테크와 경제적 안정에 관심이 많은 현실적인 사람이에요.',
      // 운세/심리
      tarot: '타로를 통해 내면을 탐구하는 것을 즐겨요.',
      zodiac: '별자리와 운세로 자신과 타인을 이해하려 해요.',
      psychology: '심리학으로 마음의 작동 원리를 이해하려 해요.',
    };
    return interestDescs[interest] || `${interest} 분야에 특별한 관심을 가지고 있어요.`;
  }

  return descriptions[tag] || '독특한 개성을 가지고 있어요.';
}
