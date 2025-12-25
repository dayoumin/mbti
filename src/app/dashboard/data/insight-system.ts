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

export interface InsightStage {
  id: number;
  name: string;
  emoji: string;
  unlockCondition: string;
  analysisMethod: 'aggregation' | 'rule-matching' | 'ai-generation';
  cost: 'free' | 'paid';
  description: string;
  userValue: string;
  nudgeMessage: string; // 다음 단계 유도
}

export const INSIGHT_STAGES: InsightStage[] = [
  {
    id: 1,
    name: '기본 성향',
    emoji: '📊',
    unlockCondition: '테스트 1개',
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
    unlockCondition: '테스트 3개',
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
    unlockCondition: '투표 10개',
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
    unlockCondition: '활동 15개',
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
    unlockCondition: '관계 활동 10개',
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
    unlockCondition: '활동 30개',
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
    unlockCondition: 'Stage 6 해금 + 결제',
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
    description: '현재 설계된 단일 프리미엄 리포트',
    pricingModel: 'one-time',
    price: '$2.99',
    repurchaseMotivation: '낮음',
  },
  {
    id: 'pet-care-program',
    name: '사육관리 프로그램',
    description: '반려동물 맞춤 케어 가이드',
    pricingModel: 'subscription',
    price: '$4.99/월',
    repurchaseMotivation: '높음',
  },
  {
    id: 'relationship-match',
    name: '관계 궁합 분석',
    description: '친구/연인과 비교 분석',
    pricingModel: 'one-time',
    price: '$1.99/명',
    repurchaseMotivation: '중간',
  },
  {
    id: 'monthly-report',
    name: '월간 인사이트 리포트',
    description: '한 달 변화 추적 리포트',
    pricingModel: 'subscription',
    price: '$2.99/월',
    repurchaseMotivation: '높음',
  },
  {
    id: 'premium-badge-theme',
    name: '프리미엄 뱃지/테마',
    description: '꾸미기 요소',
    pricingModel: 'one-time',
    price: '$0.99',
    repurchaseMotivation: '중간',
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
  {
    phase: 'Phase 1',
    title: '기반 시스템',
    duration: '2주',
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
    duration: '2주',
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
    duration: '2주',
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
    title: 'AI 분석 & 기본 수익화',
    duration: '1주',
    tasks: [
      'AI 프롬프트 최적화',
      'Stage 7: AI 종합 분석',
      '비용 모니터링',
      '결제 시스템 연동 (단품 결제)',
    ],
    deliverable: 'AI 분석 + 단품 수익화',
  },
  {
    phase: 'Phase 5',
    title: '사람 매칭 시스템',
    duration: '3주',
    tasks: [
      '친구 궁합 분석 (무료 바이럴)',
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
    title: '프리미엄 & 구독',
    duration: '2주',
    tasks: [
      '프로필 열람권 결제 ($0.99/명)',
      '구독 결제 시스템 ($6.99/월)',
      '사육관리 프로그램 UI',
      '월간 인사이트 리포트',
      '프리미엄 뱃지/테마',
      '메시지 시스템 (구독자용)',
    ],
    deliverable: '완전한 수익화 시스템',
    revenueTarget: '$1,500-2,000/월 (MAU 10k 기준)',
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
