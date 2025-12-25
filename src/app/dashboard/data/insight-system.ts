// ============================================================================
// 인사이트 시스템 설계 (리서치 기반)
// ============================================================================
// 작성일: 2024-12-25
// 기반 문서: docs/planning/INSIGHT_SYSTEM_MASTER.md
// 리서치: research/INSIGHT_RESEARCH_CLAUDE_FINDINGS.md
// 외부 검증: Gemini 딥리서치 보고서

// ============================================================================
// 1. 핵심 컨셉
// ============================================================================

export const INSIGHT_CONCEPT = {
  title: '인사이트 시스템',
  subtitle: '활동하면 자연스럽게 나를 알게 되는 경험',
  version: '1.0',

  // 핵심 차별화
  differentiation: {
    traditional: {
      name: '일반 AI 채팅',
      description: '"나에 대해 분석해줘" → 한 번 대화로 끝',
      limitation: '사용자가 "말한 것"만 분석, 자기 인식 편향 반영',
    },
    ours: {
      name: '우리 앱',
      description: '테스트 + 퀴즈 + 투표 참여 → 데이터 축적',
      advantage: '사용자가 "행동한 것" 분석, 무의식적 선택 패턴 발견',
    },
  },

  // 심리학적 기반
  psychologicalBasis: {
    ecologicalValidity: '암묵적 프로파일링이 자기보고식보다 생태학적 타당도 높음',
    implicitProfiling: '무의식적 선택, 반복 습관, 미세 기호 분석',
    biasReduction: '사회적 바람직성 편향(Social Desirability Bias) 감소',
  },
};

// ============================================================================
// 2. 7단계 점진적 해금 시스템
// ============================================================================

// 구조화된 해금 조건 (동적 렌더링용, points.ts의 INSIGHT_UNLOCK과 동기화)
export interface UnlockCondition {
  type: 'tests' | 'polls' | 'activities' | 'relationshipActivities' | 'stage' | 'paid';
  requiredCount?: number;
  requiredStage?: number;
}

export interface InsightStage {
  id: number;
  name: string;
  emoji: string;
  unlockCondition: UnlockCondition;  // 구조화된 조건 (로직용)
  analysisMethod: 'aggregation' | 'rule-matching' | 'ai-generation';
  cost: 'free' | 'paid';
  description: string;
  userValue: string;
  nudgeMessage: string; // 다음 단계 유도
}

// 해금 조건 텍스트 생성 헬퍼 (UI 렌더링용)
export function getUnlockConditionText(condition: UnlockCondition): string {
  switch (condition.type) {
    case 'tests':
      return `테스트 ${condition.requiredCount}개`;
    case 'polls':
      return `투표 ${condition.requiredCount}개`;
    case 'activities':
      return `활동 ${condition.requiredCount}개`;
    case 'relationshipActivities':
      return `관계 활동 ${condition.requiredCount}개`;
    case 'stage':
      return `Stage ${condition.requiredStage} 해금`;
    case 'paid':
      return `Stage 6 해금 + 결제`;
    default:
      return '';
  }
}

export const INSIGHT_STAGES: InsightStage[] = [
  {
    id: 1,
    name: '기본 성향',
    emoji: '📊',
    unlockCondition: { type: 'tests', requiredCount: 1 },
    analysisMethod: 'aggregation',
    cost: 'free',
    description: '첫 테스트 결과와 차원별 점수',
    userValue: '즉각적인 피드백으로 첫 참여 만족도 확보',
    nudgeMessage: '테스트 2개 더 하면 **성격 조합** 인사이트가 열려요!',
  },
  {
    id: 2,
    name: '성격 조합',
    emoji: '🔮',
    unlockCondition: { type: 'tests', requiredCount: 3 },
    analysisMethod: 'rule-matching',
    cost: 'free',
    description: '여러 테스트 결과를 조합한 복합 성격 분석',
    userValue: '단일 테스트로는 볼 수 없는 교차 인사이트',
    nudgeMessage: '투표 10개 참여하면 **판단 스타일**이 보여요!',
  },
  {
    id: 3,
    name: '판단 스타일',
    emoji: '⚖️',
    unlockCondition: { type: 'polls', requiredCount: 10 },
    analysisMethod: 'aggregation',
    cost: 'free',
    description: '실용 vs 감성, 안전 vs 모험 등 결정 패턴',
    userValue: '무의식적 선택 패턴 인식',
    nudgeMessage: '활동 5개 더 하면 **관심사 지도**가 완성돼요!',
  },
  {
    id: 4,
    name: '관심사 지도',
    emoji: '🗺️',
    unlockCondition: { type: 'activities', requiredCount: 15 },
    analysisMethod: 'aggregation',
    cost: 'free',
    description: '카테고리별 참여 비율 시각화',
    userValue: '자신의 관심사 영역 객관적 파악',
    nudgeMessage: '관계 테스트 하면 **관계 패턴**이 열려요!',
  },
  {
    id: 5,
    name: '관계 패턴',
    emoji: '💬',
    unlockCondition: { type: 'relationshipActivities', requiredCount: 10 },
    analysisMethod: 'rule-matching',
    cost: 'free',
    description: '표현 스타일, 갈등 대처 방식 분석',
    userValue: '대인 관계 강점과 성장점 발견',
    nudgeMessage: '총 30개 활동하면 **숨은 패턴**이 보여요!',
  },
  {
    id: 6,
    name: '숨은 패턴',
    emoji: '🔍',
    unlockCondition: { type: 'activities', requiredCount: 30 },
    analysisMethod: 'rule-matching',
    cost: 'free',
    description: '테스트 간 모순, 시간대별 패턴 발견',
    userValue: '자신도 몰랐던 의외의 모습 발견',
    nudgeMessage: 'AI 종합 분석으로 더 깊이 알아보세요!',
  },
  {
    id: 7,
    name: 'AI 종합 분석',
    emoji: '🤖',
    unlockCondition: { type: 'paid', requiredStage: 6 },
    analysisMethod: 'ai-generation',
    cost: 'paid',
    description: 'Claude AI가 생성하는 맞춤형 성격 리포트',
    userValue: '전문가 수준의 종합 분석',
    nudgeMessage: '',
  },
];

// ============================================================================
// 3. 태그 시스템
// ============================================================================

// 성격 태그 (Big Five 기반)
export const PERSONALITY_TAGS = [
  // 에너지 방향 (외향성)
  'extroverted', 'introverted', 'ambiverted',
  // 정보 처리 (개방성)
  'logical', 'emotional', 'intuitive', 'analytical',
  // 행동 방식 (성실성)
  'planned', 'spontaneous', 'flexible', 'structured',
  // 관계 스타일 (친화성)
  'independent', 'collaborative', 'supportive', 'leading',
  // 정서 안정성 (신경성)
  'resilient', 'sensitive',
] as const;

// 결정 태그 (투표 선택지용)
export const DECISION_TAGS = [
  'practical', 'sentimental',    // 실용 vs 감성 (emotional과 구분)
  'safe', 'adventurous',         // 안전 vs 모험
  'solo', 'together',            // 혼자 vs 함께
  'direct', 'indirect',          // 직접 vs 우회
  'present-focused', 'future-focused', // 현재 vs 미래
] as const;

// 관계 태그 (TKI 갈등 모델 기반)
export const RELATIONSHIP_TAGS = [
  // 표현 스타일
  'expressive', 'reserved',
  // 갈등 대처 (TKI 5유형)
  'competing', 'avoiding', 'accommodating', 'collaborating', 'compromising',
  // 친밀도 선호
  'close-bonding', 'space-needing',
  // 감정 처리
  'self-first', 'other-first',
] as const;

export type PersonalityTag = typeof PERSONALITY_TAGS[number];
export type DecisionTag = typeof DECISION_TAGS[number];
export type RelationshipTag = typeof RELATIONSHIP_TAGS[number];

// ============================================================================
// 4. 심리학적 근거 (리서치 결과)
// ============================================================================

export const PSYCHOLOGICAL_EVIDENCE = {
  bigFive: {
    name: 'Big Five (OCEAN) 성격 모델',
    validity: '세계에서 가장 많이 연구되고 검증된 성격 모델',
    reliability: 'BFI-2 60항목 버전 Cronbach α 높음',
    metaAnalysis: '2024년 메타분석: 43,715명, 34개 연구',
    source: 'https://link.springer.com/article/10.1186/s40359-024-02271-x',
  },

  tki: {
    name: 'Thomas-Kilmann 갈등 모델 (TKI)',
    validity: '1천만 부 이상 판매, 40년 이상 사용',
    reliability: 'Test-retest 0.61-0.68',
    note: '연구 도구로서는 의문, 실용적 토론/인사이트용으로 적합',
    source: 'https://ap.themyersbriggs.com/themyersbriggs-history-validity-tki.aspx',
  },

  petPersonality: {
    name: '반려동물-성격 상관관계',
    validity: 'Texas 대학 4,565명 연구 (Sam Gosling)',
    findings: {
      dog: '외향성 +15%, 친화성 +13%, 성실성 +11%',
      cat: '신경증 +12%, 개방성 +11%',
    },
    recentStudy: '2024 연구: 개 주인 = 회복탄력성↑, 고양이 주인 = 신경증↑',
    source: 'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1406590/full',
  },

  coffeePersonality: {
    name: '커피 취향-성격 상관관계',
    findings: {
      black: '성실성, 실용주의 높음. 어둠의 3요소와 약한 양의 상관',
      latte: '친화성 높음, 심리적 위안 추구',
    },
    note: '연구 기반 약함, 재미 요소로 활용 권장',
  },
};

// ============================================================================
// 5. 룰 엔진 설계
// ============================================================================

export interface InsightRule {
  id: string;
  name: string;
  priority: number; // 낮을수록 우선
  category: 'personality' | 'lifestyle' | 'relationship' | 'hidden';
  confidence: 'high' | 'medium' | 'low';
  source?: string; // 심리학 연구 출처

  conditions: {
    tests?: {
      [testKey: string]: {
        results?: string[];
        dimensions?: { [dim: string]: ('high' | 'medium' | 'low')[] };
        tags?: string[];
      };
    };
    decisionPattern?: { tag: string; minRatio: number }[];
    interests?: { category: string; minCount: number }[];
    minActivities?: number;
  };

  insight: {
    title: string;
    emoji: string;
    description: string;
    explanation?: string;
    actionTip?: string;
  };
}

// 예시 룰 (60개 중 일부)
export const SAMPLE_RULES: InsightRule[] = [
  {
    id: 'personality-001',
    name: '조용한 관찰자',
    priority: 10,
    category: 'personality',
    confidence: 'high',
    source: 'Texas University Pet Study',
    conditions: {
      tests: {
        cat: { tags: ['introverted', 'analytical'] },
        human: { dimensions: { inssa: ['low', 'medium'] } },
      },
    },
    insight: {
      title: '조용한 관찰자',
      emoji: '🌙',
      description: '혼자만의 시간을 소중히 여기고, 깊이 있는 관계를 선호해요.',
      explanation: '고양이 성향 + 낮은 인싸력 조합',
      actionTip: '소규모 모임이나 1:1 대화가 더 편할 수 있어요',
    },
  },
  {
    id: 'hidden-001',
    name: '선택적 친밀',
    priority: 5,
    category: 'hidden',
    confidence: 'high',
    conditions: {
      tests: {
        cat: { tags: ['independent'] },
        idealType: { tags: ['close-bonding'] },
      },
    },
    insight: {
      title: '독립과 친밀 사이',
      emoji: '🎭',
      description: '평소엔 혼자 시간이 필요하지만, 연인에게는 깊은 친밀감을 원해요.',
      explanation: '고양이 성향(독립)과 이상형(밀착)의 대비가 흥미로운 내면을 보여줘요',
    },
  },
];

// 룰 카테고리별 수량 계획
export const RULE_PLAN = {
  personality: { count: 15, description: '외향/내향 조합, 에너지 패턴' },
  combination: { count: 15, description: '2-3개 테스트 교차 분석' },
  lifestyle: { count: 10, description: '취향 패턴, 루틴 성향' },
  relationship: { count: 10, description: '갈등 대처, 표현 스타일' },
  hidden: { count: 10, description: '모순 발견, 시간대 패턴' },
  total: 60,
};

// ============================================================================
// 5.1 행동-특성 매핑 테이블 (Gemini 딥리서치 보고서 기반)
// ============================================================================
// 사용자의 구체적인 행동(Event)을 심리적 특성(Trait)으로 변환하는 가중치 테이블
// 근거: 심리측정학적 검증 결과 (Big Five, TKI, 애착 이론)

export interface BehaviorTraitMapping {
  activity: string;
  activityKr: string;
  primaryTrait: {
    trait: string;
    impact: 'high' | 'medium' | 'low';
    direction: '+' | '-';
  };
  secondaryTrait?: {
    trait: string;
    impact: 'high' | 'medium' | 'low';
    direction: '+' | '-';
  };
  narrativeAngle: string; // 인사이트 서사 방향
  source?: string;
}

export const BEHAVIOR_TRAIT_MAPPINGS: BehaviorTraitMapping[] = [
  // ═══════════════════════════════════════════════════════════════
  // 반려동물 벡터 (Texas 대학 연구 기반)
  // ═══════════════════════════════════════════════════════════════
  {
    activity: 'dog_walking',
    activityKr: '반려견 산책',
    primaryTrait: { trait: 'extraversion', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'conscientiousness', impact: 'medium', direction: '+' },
    narrativeAngle: '규범 준수와 사회적 연결성을 강조하는 메시지',
    source: 'Texas University Pet Study (4,565명)',
  },
  {
    activity: 'cat_care',
    activityKr: '반려묘 케어',
    primaryTrait: { trait: 'openness', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'neuroticism', impact: 'low', direction: '+' },
    narrativeAngle: '독립성과 정서적 깊이, 창의성을 지지하는 메시지',
    source: 'Texas University Pet Study',
  },
  {
    activity: 'dog_training',
    activityKr: '반려견 훈련',
    primaryTrait: { trait: 'dominance', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'rule_consciousness', impact: 'high', direction: '+' },
    narrativeAngle: '리더십과 구조적 사고방식을 칭찬',
    source: 'C-BARQ 연구',
  },
  {
    activity: 'cat_play',
    activityKr: '반려묘 놀이',
    primaryTrait: { trait: 'abstractedness', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'social_dominance', impact: 'medium', direction: '-' },
    narrativeAngle: '비선형적 사고와 상상력을 자극하는 피드백',
    source: 'Feline Five 연구',
  },
  {
    activity: 'pet_community',
    activityKr: '반려동물 커뮤니티 활동',
    primaryTrait: { trait: 'agreeableness', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'extraversion', impact: 'medium', direction: '+' },
    narrativeAngle: '공동체 의식과 정보 공유 의지를 강조',
  },

  // ═══════════════════════════════════════════════════════════════
  // 미각 벡터 (커피/음료 취향)
  // ═══════════════════════════════════════════════════════════════
  {
    activity: 'black_coffee',
    activityKr: '블랙 커피 선호',
    primaryTrait: { trait: 'conscientiousness', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'tough_mindedness', impact: 'medium', direction: '+' },
    narrativeAngle: '효율성 추구와 실용적 미니멀리즘 강조',
    source: '쓴맛 선호-Dark Triad 약한 상관 연구',
  },
  {
    activity: 'latte_sweet',
    activityKr: '라떼/달콤한 음료 선호',
    primaryTrait: { trait: 'agreeableness', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'comfort_seeking', impact: 'high', direction: '+' },
    narrativeAngle: '"오늘 하루 자신에게 너그러웠나요?" 같은 따뜻한 어조',
  },
  {
    activity: 'tea_preference',
    activityKr: '차/말차 선호',
    primaryTrait: { trait: 'openness', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'health_consciousness', impact: 'medium', direction: '+' },
    narrativeAngle: '마음 챙김과 건강한 루틴 강조',
    source: 'Study Finds - Coffee or Tea Personality (2,000명)',
  },

  // ═══════════════════════════════════════════════════════════════
  // 사회적 배터리 벡터
  // ═══════════════════════════════════════════════════════════════
  {
    activity: 'large_party',
    activityKr: '대규모 파티/네트워킹',
    primaryTrait: { trait: 'social_energy_drain', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'extraversion', impact: 'high', direction: '+' },
    narrativeAngle: '외향인에게는 에너지 충전, 내향인에게는 방전 경고',
    source: '도파민 보상 시스템 연구',
  },
  {
    activity: 'solo_reading',
    activityKr: '혼자 독서/멍하니 있기',
    primaryTrait: { trait: 'social_energy_recharge', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'introversion', impact: 'medium', direction: '+' },
    narrativeAngle: '"지금은 혼자만의 동굴이 필요한 시간입니다" 같은 검증 메시지',
    source: '코르티솔 반응 연구',
  },
  {
    activity: 'small_group',
    activityKr: '소규모 모임 (3-5명)',
    primaryTrait: { trait: 'social_balance', impact: 'medium', direction: '+' },
    narrativeAngle: '균형 잡힌 사회적 에너지 관리 칭찬',
  },

  // ═══════════════════════════════════════════════════════════════
  // 갈등 관리 벡터 (TKI 모델 기반)
  // ═══════════════════════════════════════════════════════════════
  {
    activity: 'conflict_avoid',
    activityKr: '갈등 회피 ("말 안 하기로 했다")',
    primaryTrait: { trait: 'avoiding', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'assertiveness', impact: 'low', direction: '-' },
    narrativeAngle: '단기적 평화 vs 장기적 관계 비용 인사이트',
    source: 'Thomas-Kilmann Conflict Mode (TKI)',
  },
  {
    activity: 'conflict_compete',
    activityKr: '갈등 경쟁 ("내 의견 끝까지 주장")',
    primaryTrait: { trait: 'competing', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'assertiveness', impact: 'high', direction: '+' },
    narrativeAngle: '목표 달성력 강조, 관계 유지 팁 제공',
    source: 'TKI',
  },
  {
    activity: 'conflict_collaborate',
    activityKr: '갈등 협력 ("윈-윈 찾기")',
    primaryTrait: { trait: 'collaborating', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'agreeableness', impact: 'high', direction: '+' },
    narrativeAngle: '관계 강화 능력과 문제 해결력 칭찬',
    source: 'TKI',
  },
  {
    activity: 'conflict_accommodate',
    activityKr: '갈등 수용 ("상대방 의견 따르기")',
    primaryTrait: { trait: 'accommodating', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'assertiveness', impact: 'low', direction: '-' },
    narrativeAngle: '관계 우선 성향 인정, 자기 주장 성장점 제시',
    source: 'TKI',
  },
  {
    activity: 'conflict_compromise',
    activityKr: '갈등 타협 ("서로 양보")',
    primaryTrait: { trait: 'compromising', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'pragmatism', impact: 'medium', direction: '+' },
    narrativeAngle: '효율적 해결 능력 강조',
    source: 'TKI',
  },

  // ═══════════════════════════════════════════════════════════════
  // 라이프스타일 벡터
  // ═══════════════════════════════════════════════════════════════
  {
    activity: 'morning_routine',
    activityKr: '아침 루틴 (운동, 명상 등)',
    primaryTrait: { trait: 'conscientiousness', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'self_discipline', impact: 'high', direction: '+' },
    narrativeAngle: '자기 관리 능력과 일관성 강조',
  },
  {
    activity: 'night_owl',
    activityKr: '야행성 활동 (밤 10시 이후)',
    primaryTrait: { trait: 'openness', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'emotional_sensitivity', impact: 'medium', direction: '+' },
    narrativeAngle: '"피곤할 때 감정에 더 솔직해지시네요" 같은 발견',
  },
  {
    activity: 'plant_care',
    activityKr: '식물 돌봄',
    primaryTrait: { trait: 'nurturing', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'patience', impact: 'medium', direction: '+' },
    narrativeAngle: '조용한 돌봄과 성장 지켜보기의 만족감 강조',
  },
  {
    activity: 'spontaneous_trip',
    activityKr: '즉흥 여행/외출',
    primaryTrait: { trait: 'openness', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'spontaneity', impact: 'high', direction: '+' },
    narrativeAngle: '모험 정신과 유연성 강조',
  },

  // ═══════════════════════════════════════════════════════════════
  // 관계/표현 벡터
  // ═══════════════════════════════════════════════════════════════
  {
    activity: 'direct_expression',
    activityKr: '감정 직접 표현',
    primaryTrait: { trait: 'assertiveness', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'extraversion', impact: 'medium', direction: '+' },
    narrativeAngle: '솔직한 소통 능력 칭찬',
  },
  {
    activity: 'indirect_expression',
    activityKr: '감정 간접 표현 (행동으로)',
    primaryTrait: { trait: 'reserved', impact: 'medium', direction: '+' },
    secondaryTrait: { trait: 'thoughtfulness', impact: 'high', direction: '+' },
    narrativeAngle: '섬세한 배려와 사려 깊음 강조',
  },
  {
    activity: 'gift_giving',
    activityKr: '선물 주기',
    primaryTrait: { trait: 'love_language_gifts', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'thoughtfulness', impact: 'medium', direction: '+' },
    narrativeAngle: '물질적 표현을 통한 애정 전달 스타일',
  },
  {
    activity: 'quality_time',
    activityKr: '함께 시간 보내기 중시',
    primaryTrait: { trait: 'love_language_time', impact: 'high', direction: '+' },
    secondaryTrait: { trait: 'presence', impact: 'high', direction: '+' },
    narrativeAngle: '함께하는 순간의 가치를 아는 사람',
  },
];

// 사회적 배터리 계산용 상수
export const SOCIAL_BATTERY_CONFIG = {
  // 활동별 에너지 영향 (내향인 기준, 외향인은 반전)
  energyImpact: {
    large_party: -30,        // 대규모 모임: 크게 방전
    networking_event: -25,   // 네트워킹: 방전
    small_group: -10,        // 소규모 모임: 약간 방전
    one_on_one: -5,          // 1:1 대화: 미미한 방전
    solo_activity: +20,      // 혼자 활동: 충전
    solo_reading: +25,       // 독서/명상: 크게 충전
    nature_walk: +15,        // 자연 산책: 충전
    phone_call: -10,         // 전화 통화: 약간 방전
  },

  // 내향/외향 판별 임계값
  thresholds: {
    introvert: 40,   // 외향성 점수 40 이하 = 내향
    ambivert: 60,    // 40-60 = 양향
    extravert: 60,   // 60 이상 = 외향
  },

  // 배터리 상태별 메시지
  messages: {
    critical: '지금은 혼자만의 동굴이 필요한 시간입니다. 🌙',
    low: '에너지가 낮아지고 있어요. 조용한 시간을 가져보세요.',
    medium: '적절한 균형을 유지하고 있어요.',
    high: '사회적 에너지가 충분해요! 모임에 참여해보는 건 어때요?',
    full: '에너지가 넘쳐요! 새로운 만남도 즐길 수 있겠네요.',
  },
};

// ============================================================================
// 6. 기술 스택 권장사항
// ============================================================================

export const TECH_RECOMMENDATIONS = {
  ruleEngine: {
    recommended: 'json-rules-engine',
    reason: 'all/any/not 조건 지원, 비동기 팩트 처리, 우선순위 지원',
    npm: 'npm install json-rules-engine',
    github: 'https://github.com/CacheControl/json-rules-engine',
    alternatives: ['RulePilot', 'node-rules'],
  },

  database: {
    strategy: 'SQLite JSONB + Generated Column',
    pattern: `
      -- 투표 태그: JSON 배열 (읽기 위주)
      CREATE TABLE polls (
        id TEXT PRIMARY KEY,
        option_a_tags JSON,
        option_b_tags JSON
      );

      -- 자주 쿼리하는 필드: Generated Column + Index
      CREATE TABLE user_insights (
        id INTEGER PRIMARY KEY,
        user_id TEXT NOT NULL,
        insight_type TEXT GENERATED ALWAYS AS (json_extract(insight_data, '$.type')) VIRTUAL,
        insight_data JSON NOT NULL
      );
      CREATE INDEX idx_user_type ON user_insights(user_id, insight_type);
    `,
    note: 'EXPLAIN QUERY PLAN으로 인덱스 사용 여부 필수 확인',
  },

  llm: {
    costEstimate: {
      model: 'Claude Haiku',
      perAnalysis: '$0.01',
      monthly10kUsers: '$10 (10% AI 사용률 기준)',
      withCaching: '$2-5 (60-80% 절감)',
    },
    optimization: [
      '프롬프트 압축: JSON/불릿 형식으로 35-95% 절감',
      '시맨틱 캐싱: 유사 의도 쿼리 재사용으로 90% 절감',
      '모델 캐스케이딩: 간단한 것은 Haiku, 복잡한 것은 Sonnet',
      '출력 토큰 제한: 출력이 입력보다 2-5배 비쌈',
    ],
  },
};

// ============================================================================
// 6.1 페르소나 & 어조 가이드 (Gemini 딥리서치 보고서 기반)
// ============================================================================
// Co-Star 성공 요인 반영: "팩트 폭력(Biting Truth)" 스타일
// 무조건적 칭찬보다 데이터 기반 직설적 인사이트가 공유율 높음

export const PERSONA_GUIDE = {
  // 핵심 페르소나 정의
  persona: {
    name: '냉철하지만 위트있는 행동 심리학자',
    description: '무조건적인 칭찬보다 데이터 기반 팩트 폭력(Biting Truth)을 선호',
    tone: 'snarky-but-caring', // Co-Star 성공 요인
    inspiration: 'Co-Star의 "팩트 폭력" + The Pattern의 "깊이 있는 분석"',
  },

  // 어조별 예시 (상황에 따라 선택)
  toneExamples: {
    // 팩트 폭력 스타일 (공유하고 싶은 콘텐츠)
    biting: [
      '당신은 갈등 앞에서 도망가는 걸 "배려"라고 부르고 있네요.',
      '혼자 있고 싶다면서 연인에겐 24시간 붙어있고 싶어하는 모순... 흥미롭네요.',
      '계획적이라고 했는데, 커피 취향은 매번 바뀌네요. 진짜 당신은 누구죠?',
      '고양이를 좋아한다고 했지만, 투표 패턴은 "같이 있고 싶어요"를 외치고 있어요.',
    ],

    // 따뜻한 지지 스타일 (균형용)
    supportive: [
      '혼자 시간이 필요한 건 이기적인 게 아니에요. 충전이 필요한 거죠.',
      '상대방을 먼저 생각하는 당신, 가끔은 자신도 돌봐주세요.',
      '루틴을 지키는 당신의 일관성이 주변 사람들에게 안정감을 줘요.',
    ],

    // 발견/인사이트 스타일
    discovery: [
      '밤 10시 이후 투표에서 감정적 선택이 40% 증가해요. 피곤하면 솔직해지시나봐요.',
      '고양이 테스트에선 독립형인데, 이상형 테스트에선 밀착형... 가까운 사람에겐 다르군요.',
      '커피는 항상 같은 걸 마시는데, 여행지는 매번 새로운 곳을 고르시네요.',
    ],
  },

  // 프롬프트 템플릿
  promptTemplate: {
    system: `당신은 냉철하지만 위트 있는 행동 심리학자입니다.

## 성격
- 무조건적인 칭찬보다 데이터 기반 팩트 폭력(Biting Truth)을 선호합니다
- 하지만 근본적으로 사용자를 돕고 싶어합니다 (snarky-but-caring)
- 모순이나 흥미로운 패턴을 발견하면 날카롭게 지적합니다
- 너무 상처주지 않도록 위트를 섞어서 표현합니다

## 어조 규칙
1. 짧고 강렬하게 (1-2문장 핵심)
2. 데이터를 구체적으로 인용 ("40%", "5번 중 4번" 등)
3. 반전이나 모순을 부각
4. "~하시네요", "~인 것 같아요" 대신 "~군요", "~네요" 사용
5. 이모지는 문장 끝에 하나만

## 피해야 할 것
- "정말 대단해요!", "완벽해요!" 같은 과한 칭찬
- 뻔한 조언 ("자신을 사랑하세요")
- 너무 긴 설명
- 모호한 표현`,

    userDataFormat: `## 사용자 데이터
### 테스트 결과
{{testResults}}

### 투표 패턴 (최근 30일)
- 실용 vs 감성: {{practicalRatio}}% vs {{emotionalRatio}}%
- 안전 vs 모험: {{safeRatio}}% vs {{adventurousRatio}}%
- 혼자 vs 함께: {{soloRatio}}% vs {{togetherRatio}}%

### 시간대 패턴
- 가장 활발한 시간: {{peakHour}}
- 밤(22시 이후) 감정적 선택 증가율: {{nightEmotionalIncrease}}%

### 발견된 모순
{{contradictions}}`,

    outputFormat: `## 요청
위 데이터를 분석하여 다음 형식으로 인사이트를 제공해주세요:

### 한 줄 팩트 폭력 (필수)
- 가장 흥미로운 모순이나 패턴을 날카롭게 지적

### 숨은 패턴 (1-2개)
- 사용자도 몰랐을 의외의 발견

### 성장 포인트 (1개)
- 비난이 아닌 가능성으로 표현

응답은 JSON 형식으로:
{
  "bitingTruth": "한 줄 팩트 폭력",
  "hiddenPatterns": ["패턴1", "패턴2"],
  "growthPoint": "성장 포인트"
}`,
  },

  // 상황별 어조 선택 가이드
  toneSelection: {
    // 모순 발견 시 → biting 스타일
    contradiction: 'biting',
    // 첫 인사이트 해금 시 → supportive 스타일
    firstUnlock: 'supportive',
    // 숨은 패턴 발견 시 → discovery 스타일
    hiddenPattern: 'discovery',
    // 사회적 배터리 낮을 때 → supportive 스타일
    lowBattery: 'supportive',
    // 공유 가능 콘텐츠 → biting 스타일 (바이럴 효과)
    shareable: 'biting',
  },

  // 공유용 콘텐츠 포맷
  shareableFormats: [
    '{name}님은 {contradiction}... {emoji}',
    '테스트 결과: {result1} + {result2} = {insight}',
    '{percentage}%의 사람들과 다른 선택을 했어요: {uniqueChoice}',
  ],
};

// ============================================================================
// 7. 게이미피케이션 & 리텐션
// ============================================================================

export const GAMIFICATION_STRATEGY = {
  retentionBenchmark: {
    effect: '+22% 리텐션 (게이미피케이션 적용 앱)',
    source: 'CleverTap',
  },

  progressiveDisclosure: {
    principle: '초기 3-4개 옵션만 노출, 선택 시 세부 옵션 확장',
    effect: 'Hick\'s Law에 따라 의사결정 시간 단축',
  },

  mechanics: [
    {
      name: '연속 기록 (Streaks)',
      description: '듀오링고 스타일 연속 기록 + 동결 아이템',
      purpose: '습관 형성, 이탈 방지',
    },
    {
      name: '정체성 뱃지',
      description: '"카페인 수도승" 같은 자아 표현 뱃지',
      purpose: '수집 욕구 + 자아 표현',
    },
    {
      name: '가변적 보상',
      description: '예측 불가능한 타이밍에 희귀 인사이트',
      purpose: '도파민 분비, 습관 강화',
    },
  ],

  nudgePatterns: [
    '"N개 더 하면 해금!" - 명확한 목표 제시',
    '"지금쯤 사회적 배터리 20% 남았겠네요" - 가치 제공 알림',
    '"[친구]님도 스트레스 높아요. 커피 한 잔?" - 사회적 트리거',
  ],
};

// ============================================================================
// 8. 비즈니스 모델
// ============================================================================

export const BUSINESS_MODEL = {
  benchmarks: {
    freemiumConversion: {
      good: '3-5%',
      great: '6-8%',
      source: 'RevenueCat State of Subscription Apps 2025',
    },
    healthWellness: {
      median: '18.5%',
      top: '57.7%',
      rpi: '$0.44 (설치당 수익 중간값)',
    },
  },

  competitorAnalysis: {
    '16Personalities': {
      traffic: '월 1,710만 방문',
      model: '무료 테스트 + 유료 프리미엄 리포트',
      tests: '10억 회 이상',
    },
    'Co-Star': {
      users: '3천만+',
      successFactor: '팩트 폭력 스타일, 공유하고 싶은 콘텐츠',
    },
    'The Pattern': {
      successFactor: '깊이 있는 심리 분석, Bonds 기능',
    },
  },

  ourModel: {
    free: 'Stage 1-6 인사이트 (룰 기반)',
    paid: 'Stage 7 AI 종합 분석 + 프리미엄 기능',
    // 가격은 PRICING_TIERS 참조 (단일 소스)
    targetConversion: '3-5% (초기), 5-6% (성장)',
  },
};

// ============================================================================
// 9. 유료 전환 포인트 & 추가 기능
// ============================================================================

// 타입 정의
export interface PremiumFeature {
  id: string;
  name: string;
  description: string;
  pricingModel: 'one-time' | 'subscription' | 'bundle';
  price: string;
  repurchaseMotivation: 'low' | 'medium' | 'high';
  includedInSubscription?: boolean;
}

export interface PricingTier {
  name: string;
  price?: { monthly?: string; yearly?: string };
  includes: string[];
  note?: string;
}

export interface OneTimeItem {
  name: string;
  price: string;
  note?: string;
}

export const PREMIUM_FEATURES: PremiumFeature[] = [
  {
    id: 'ai-analysis',
    name: 'AI 종합 분석',
    description: '축적된 활동 데이터 기반 AI 성격 리포트',
    pricingModel: 'one-time',
    price: '$2.99',
    repurchaseMotivation: 'low',
    includedInSubscription: true,
  },
  {
    id: 'pet-care-program',
    name: '사육관리 프로그램',
    description: '반려동물 맞춤 케어 가이드 + 알림 + 체크리스트',
    pricingModel: 'subscription',
    price: '$4.99/월',
    repurchaseMotivation: 'high',
    includedInSubscription: true,
  },
  {
    id: 'relationship-match',
    name: '관계 궁합 심화 분석',
    description: '친구/연인과 상세 비교 분석 + AI 관계 조언',
    pricingModel: 'bundle',
    price: '$1.99/명, 3인 $4.99, 5인 $6.99',
    repurchaseMotivation: 'medium',
    includedInSubscription: true,
  },
  {
    id: 'monthly-report',
    name: '월간 인사이트 리포트',
    description: '한 달간 변화 추적 + 성장 분석',
    pricingModel: 'subscription',
    price: '$2.99/월',
    repurchaseMotivation: 'high',
    includedInSubscription: true,
  },
  {
    id: 'premium-badge-theme',
    name: '프리미엄 뱃지/테마',
    description: '프로필 꾸미기 요소',
    pricingModel: 'one-time',
    price: '$0.99',
    repurchaseMotivation: 'medium',
    includedInSubscription: true,
  },
];

export const PET_CARE_PROGRAM = {
  name: '사육관리 프로그램',
  summary: 'petMatch 결과와 사용자 환경을 결합한 맞춤 케어 가이드',
  inputs: {
    testResult: 'petMatch 테스트 결과',
    environment: ['1인가구', '직장인', '원룸'],
  },
  exampleScenario: {
    testResult: '고양이 추천 (독립형)',
    userEnvironment: '1인가구, 직장인, 원룸',
    guide: [
      '자동급식기 추천 (외출 많음)',
      '낮잠 많은 품종 추천 (혼자 시간 많음)',
      '월별 케어 체크리스트',
      '계절별 주의사항 알림',
    ],
  },
  tiers: {
    free: '기본 결과만 제공',
    premium: {
      price: '$4.99/월',
      includes: ['맞춤 가이드', '알림', '체크리스트', '계절별 주의사항'],
    },
  },
};

// RELATIONSHIP_MATCH는 아래 "사람 매칭 시스템" 섹션에서 정의 (무료 바이럴용)

export const MONTHLY_REPORT = {
  name: '월간 인사이트 리포트',
  description: '한 달 변화 추적',
  pricing: {
    model: 'subscription',
    price: '$2.99/월',
  },
  cadence: 'monthly',
  includes: [
    '테스트/투표/활동 변화 추이',
    '핵심 패턴 변화 요약',
    '다음 달 추천 액션',
  ],
};

export const PRICING_TIERS = {
  free: {
    name: '무료',
    includes: [
      '모든 테스트/퀴즈/투표',
      'Stage 1-6 인사이트',
      '기본 프로필',
      'petMatch 기본 결과',
      '친구 궁합 분석 (무료)', // 바이럴용
      '"비슷한 사람 N명" 알림 (숫자만)',
    ],
  },
  oneTime: {
    name: '프리미엄 단품',
    items: [
      { name: 'AI 종합 분석', price: '$2.99' },
      { name: '프로필 열람권', price: '$0.99/명', note: '비슷한 사람 프로필 보기' },
      { name: '프리미엄 뱃지 팩', price: '$0.99' },
    ],
  },
  subscription: {
    name: '프리미엄 구독',
    price: {
      monthly: '$6.99',
      yearly: '$49.99',
    },
    includes: [
      'AI 분석 무제한',
      '사육관리 프로그램 (맞춤 가이드 + 알림)',
      '월간 인사이트 리포트',
      '사람 매칭 무제한 (프로필 열람 + 메시지)',
      '프리미엄 테마/뱃지',
      '광고 제거',
    ],
  },
};

// ============================================================================
// 10. 사람 매칭 시스템 (핵심 차별점)
// ============================================================================

export const PEOPLE_MATCHING_SYSTEM = {
  name: '사람 매칭',
  subtitle: '행동 데이터 기반 - 다른 앱에 없는 차별점',

  // 왜 특별한가?
  uniqueValue: {
    problem: '기존 매칭앱은 자기소개(말한 것)에 의존 → 거짓/과장 많음',
    solution: '우리는 테스트/투표/퀴즈 참여 데이터(행동한 것) 기반 → 더 정확',
    dataPoints: [
      '성격 테스트 결과 (Big Five 기반)',
      '투표 선택 패턴 (실용 vs 감성, 모험 vs 안전)',
      '관심사 분포 (카테고리별 참여)',
      '관계 스타일 (TKI 갈등 유형)',
      '시간대별 활동 패턴',
    ],
  },

  // 매칭 유형
  matchTypes: [
    {
      id: 'similar',
      name: '비슷한 사람',
      emoji: '🪞',
      description: '성향/관심사가 비슷한 사람',
      algorithm: '태그 유사도 + 카테고리 겹침',
      useCase: '취미 친구, 공감대',
    },
    {
      id: 'complementary',
      name: '케미 좋은 사람',
      emoji: '⚡',
      description: '서로 보완되는 성향의 사람',
      algorithm: '반대 태그 + 갈등 스타일 호환',
      useCase: '연인, 파트너',
    },
    {
      id: 'pet-buddy',
      name: '반려동물 친구',
      emoji: '🐾',
      description: '같은 동물 키우거나 관심 있는 사람',
      algorithm: 'petMatch 결과 + 사육 경험',
      useCase: '산책 메이트, 정보 공유',
    },
    {
      id: 'mentor',
      name: '멘토/멘티',
      emoji: '🎓',
      description: '경험자 ↔ 초보 연결',
      algorithm: '퀴즈 점수 차이 + 관심 카테고리',
      useCase: '반려동물 초보 ↔ 베테랑',
    },
  ],

  // 무료 vs 유료
  tiers: {
    free: {
      features: [
        '친구 궁합 분석 (초대 링크)',
        '"비슷한 사람 N명 있어요" 알림',
        '매칭 유형 미리보기',
      ],
      purpose: '바이럴 + 유료 전환 유도',
    },
    paid: {
      features: [
        '비슷한 사람 프로필 열람',
        '메시지 보내기',
        '매칭 필터 (성별, 지역, 관심사)',
        '프리미엄 프로필 뱃지',
      ],
      pricing: {
        perProfile: '$0.99/명',
        unlimited: '구독 $6.99/월',
      },
    },
  },

  // 프라이버시 & 안전
  privacy: {
    profileVisibility: ['닉네임만', '프로필 사진 선택', '위치 대략적(시/구)'],
    blockedInfo: ['실명', '정확한 위치', '연락처'],
    userControl: ['매칭 참여 ON/OFF', '특정 사용자 차단', '프로필 숨기기'],
  },

  // 수익 예측
  revenueProjection: {
    mau: 10000,
    matchingOptIn: '30% (3,000명)',
    paidConversion: '10% (300명)',
    scenarios: [
      { model: '프로필 열람 $0.99/명 × 5명', revenue: '$1,485/월' },
      { model: '구독 $6.99/월 × 100명', revenue: '$699/월' },
      { model: '혼합', revenue: '$1,500-2,000/월' },
    ],
  },
};

// 궁합 분석 (무료 기본 + 유료 심화)
export const RELATIONSHIP_MATCH = {
  name: '친구 궁합 분석',
  description: '친구/연인과 테스트 결과 비교',

  // 무료 vs 유료 구분
  tiers: {
    free: {
      name: '기본 궁합',
      includes: ['궁합 점수 (0-100%)', '공통점 3가지', '케미 포인트 1개'],
      purpose: '바이럴 + 사용자 유입',
    },
    premium: {
      name: '심화 분석',
      includes: [
        '상세 궁합 리포트',
        '차이점 분석',
        '갈등 예측 & 해결 팁',
        '소통 스타일 비교',
        'AI 관계 조언',
      ],
      pricing: {
        perPerson: '$1.99',
        bundle3: '$4.99',   // 17% 할인
        bundle5: '$6.99',   // 30% 할인
        unlimited: '구독 포함',
      },
    },
  },

  flow: [
    '1. 내 프로필에서 "궁합 분석" 클릭',
    '2. 친구에게 초대 링크 공유',
    '3. 친구가 테스트 완료하면 기본 궁합 결과 생성 (무료)',
    '4. 심화 분석 원하면 결제 또는 구독',
  ],

  viral: {
    shareText: '우리 궁합 {score}%! 너도 해봐 →',
    benefit: '친구 초대 → 둘 다 활동 증가 → 데이터 축적',
  },
};

// ============================================================================
// 10. 구현 로드맵
// ============================================================================

export const IMPLEMENTATION_ROADMAP = [
  // ═══════════════════════════════════════════════════════════════
  // 기술 부채 해소 (코드 구조 개선)
  // ═══════════════════════════════════════════════════════════════
  {
    phase: 'Phase 0',
    title: '설계 데이터 분리 (기술 부채)',
    priority: 'low', // 실제 서비스 구현 전까지 불필요
    trigger: '실제 InsightService 구현 시작 시',
    tasks: [
      'insight-system.ts → 여러 파일로 분리',
      '  - insight/concept.ts (핵심 컨셉, 해금 시스템)',
      '  - insight/tags.ts (태그 정의)',
      '  - insight/rules.ts (룰 정의)',
      '  - insight/behavior-mappings.ts (행동-특성 매핑)',
      '  - insight/persona.ts (페르소나 가이드)',
      '  - insight/pricing.ts (비즈니스 모델, 가격)',
      '  - insight/matching.ts (사람 매칭 시스템)',
      '  - insight/index.ts (통합 export)',
      'barrel export로 기존 import 호환 유지',
      'BEHAVIOR_TRAIT_MAPPINGS에 trait union type 추가',
    ],
    note: '현재 설계 문서로 사용 중 → 실제 서비스 코드 전환 시 진행',
    estimatedSize: '각 파일 100-200줄 수준',
  },

  // ═══════════════════════════════════════════════════════════════
  // 기능 개발 (모두 무료로 구현, 유료화 로직 없음)
  // ═══════════════════════════════════════════════════════════════
  {
    phase: 'Phase 1',
    title: '기반 시스템',
    tasks: [
      '태그 타입 정의 (src/data/insight/tags.ts)',
      '테스트 결과 태그 매핑 (주요 10개 테스트)',
      'InsightRule 인터페이스 구현',
      'InsightService 기본 구조',
      'json-rules-engine 설치 및 통합',
    ],
    deliverable: '태그 시스템 + 룰 엔진 기반',
  },
  {
    phase: 'Phase 2',
    title: 'Stage 1-4 인사이트',
    tasks: [
      'Stage 1: 기본 성향 (즉시 표시)',
      'Stage 2: 성격 조합 (룰 15개)',
      '투표 태그 추가 (50개)',
      'Stage 3: 판단 스타일',
      'Stage 4: 관심사 지도',
      '인사이트 UI 컴포넌트',
      '해금 유도 UI',
    ],
    deliverable: '4단계 인사이트 + 해금 시스템',
  },
  {
    phase: 'Phase 3',
    title: 'Stage 5-6 인사이트',
    tasks: [
      '관계 태그 확장',
      'Stage 5: 관계 패턴 (룰 10개)',
      'Turso DB 마이그레이션',
      'Stage 6: 숨은 패턴 (룰 10개)',
      '시간대 분석 로직',
      '교차 분석 로직',
    ],
    deliverable: '6단계 인사이트 완성',
  },
  {
    phase: 'Phase 4',
    title: 'AI 분석',
    tasks: [
      'AI 프롬프트 최적화',
      'Stage 7: AI 종합 분석 (기능 구현)',
      '비용 모니터링 대시보드',
    ],
    deliverable: 'AI 분석 기능 완성',
  },
  {
    phase: 'Phase 5',
    title: '사람 매칭 & 궁합',
    tasks: [
      '친구 궁합 분석',
      '초대 링크 시스템',
      '매칭 알고리즘 구현 (태그 유사도, 보완 케미)',
      '프로필 열람 UI',
      '"비슷한 사람 N명" 알림 시스템',
      '매칭 참여 ON/OFF, 차단 기능',
      '프라이버시 설정 UI',
    ],
    deliverable: '사람 매칭 + 궁합 분석 시스템',
    priority: '핵심 차별화 - 행동 데이터 기반 매칭',
  },
  {
    phase: 'Phase 6',
    title: '추가 기능',
    tasks: [
      '사육관리 프로그램 UI',
      '월간 인사이트 리포트',
      '프리미엄 뱃지/테마',
      '메시지 시스템',
    ],
    deliverable: '부가 기능 완성',
  },

  // ═══════════════════════════════════════════════════════════════
  // 유료화 (기능 완성 후 마지막에 진행)
  // ═══════════════════════════════════════════════════════════════
  {
    phase: 'Phase 7',
    title: '유료화 & 결제 연동',
    tasks: [
      '유료/무료 기능 플래그 추가',
      '결제 시스템 연동 (Stripe/토스페이먼츠)',
      '구독 관리 시스템',
      '프리미엄 잠금 UI',
      '가격 A/B 테스트 준비',
    ],
    deliverable: '수익화 시스템',
    note: '모든 기능 완성 후 마지막에 진행',
    pricingReference: 'PRICING_TIERS 참조',
  },
];

// ============================================================================
// 11. 성공 지표
// ============================================================================

export const SUCCESS_METRICS = {
  userBehavior: [
    { metric: '인사이트 페이지 진입률', target: '30%+', note: '메인 대비' },
    { metric: '해금 유도 클릭률', target: '20%+', note: '유도 메시지 클릭' },
    { metric: '30개 활동 달성률', target: '15%+', note: '숨은 패턴 해금' },
    { metric: 'AI 분석 요청률', target: '5%+', note: '유료 전환' },
  ],
  quality: [
    { metric: '인사이트 정확도', target: '80%+', note: '"맞아요" 피드백' },
    { metric: '공유율', target: '10%+', note: 'SNS 공유' },
    { metric: '재방문 (인사이트 목적)', target: '20%+', note: '세션 분석' },
  ],
};

// ============================================================================
// Export
// ============================================================================

export const INSIGHT_SYSTEM = {
  concept: INSIGHT_CONCEPT,
  stages: INSIGHT_STAGES,
  tags: {
    personality: PERSONALITY_TAGS,
    decision: DECISION_TAGS,
    relationship: RELATIONSHIP_TAGS,
  },
  psychology: PSYCHOLOGICAL_EVIDENCE,
  rules: {
    samples: SAMPLE_RULES,
    plan: RULE_PLAN,
  },
  // 딥리서치 보고서 반영 (2024-12-25)
  behaviorMappings: BEHAVIOR_TRAIT_MAPPINGS,  // 행동-특성 매핑 테이블
  socialBattery: SOCIAL_BATTERY_CONFIG,       // 사회적 배터리 설정
  personaGuide: PERSONA_GUIDE,                // 페르소나 & 어조 가이드
  tech: TECH_RECOMMENDATIONS,
  gamification: GAMIFICATION_STRATEGY,
  business: BUSINESS_MODEL,
  premium: {
    features: PREMIUM_FEATURES,
    petCareProgram: PET_CARE_PROGRAM,
    monthlyReport: MONTHLY_REPORT,
    pricingTiers: PRICING_TIERS,
  },
  peopleMatching: PEOPLE_MATCHING_SYSTEM,  // 핵심 차별화
  relationshipMatch: RELATIONSHIP_MATCH,    // 무료 바이럴용
  roadmap: IMPLEMENTATION_ROADMAP,
  metrics: SUCCESS_METRICS,
};

export default INSIGHT_SYSTEM;
