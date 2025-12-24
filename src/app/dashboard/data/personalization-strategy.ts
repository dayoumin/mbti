// ============================================================================
// 개인화 리텐션 전략 데이터
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type InterestCategory = 'pet' | 'love' | 'lifestyle' | 'personality' | 'food';
export type UserSegmentId = 'pet_lover' | 'love_seeker' | 'lifestyle_explorer' | 'completionist' | 'social_butterfly' | 'casual_visitor' | 'new_user';
export type ActivityLevel = 'cold' | 'warming' | 'active' | 'power';
export type RecommendationAlgorithm = 'popularity' | 'category' | 'collaborative' | 'content-based' | 'hybrid';

export interface Principle {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  color: string;
  examples: string[];
  metrics?: string[];
}

export interface UserSegment {
  id: UserSegmentId;
  name: string;
  description: string;
  icon: string;
  color: string;
  characteristics: string[];
  triggers: string[];
  recommendationStrategy: string;
  retentionTips: string[];
}

export interface AlgorithmDefinition {
  id: RecommendationAlgorithm;
  name: string;
  description: string;
  icon: string;
  useCase: string;
  pros: string[];
  cons: string[];
  implementation: string;
  dataRequired: string[];
}

export interface UIPattern {
  id: string;
  name: string;
  description: string;
  icon: string;
  wireframe: string;
  useCases: string[];
  implementation: string;
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  status: 'done' | 'in-progress' | 'planned' | 'later';
  description: string;
  tasks: {
    name: string;
    status: 'done' | 'in-progress' | 'pending';
    details?: string;
  }[];
  deliverables: string[];
  notes?: string;  // 추가 참고사항 (MVP 관련 등)
}

// ============================================================================
// 1. 핵심 원칙 (5가지)
// ============================================================================

export const PERSONALIZATION_PRINCIPLES: Principle[] = [
  {
    id: 'interest-first',
    title: '관심사 우선',
    subtitle: 'Interest-First Recommendation',
    description: '사용자가 관심 보인 카테고리와 주제를 우선 추천. 완료한 테스트, 참여한 퀴즈/투표에서 관심사 점수를 계산하여 콘텐츠 노출 순위 결정.',
    icon: '🎯',
    color: '#7aa2ff',
    examples: [
      '고양이 테스트 3개 완료 → 고양이 관련 퀴즈/투표 우선 노출',
      '연애 투표 자주 참여 → 연애 카테고리 상단 배치',
      'coffee 테스트 완료 → 라이프스타일 콘텐츠 추천',
    ],
    metrics: ['관심 카테고리 CTR', '세션당 참여 콘텐츠 수'],
  },
  {
    id: 'choice-power',
    title: '선택권 제공',
    subtitle: 'Give Users Control',
    description: '단일 "다음 테스트" 대신 2-3개 선택지 제공. 사용자가 직접 선택하면 참여율과 만족도가 높아짐. 선택 데이터도 개인화에 활용.',
    icon: '🔀',
    color: '#55e6c1',
    examples: [
      '결과 화면: "다음으로 뭐 해볼까?" + 3개 카드',
      '대시보드: "오늘 뭐 할래?" 섹션 (관심 기반 추천 3개)',
      '각 선택지에 "왜 이걸 추천하는지" 한줄 설명',
    ],
    metrics: ['선택 화면 전환율', '선택지별 클릭률'],
  },
  {
    id: '70-20-10',
    title: '70-20-10 법칙',
    subtitle: 'YouTube-Style Mix',
    description: '유튜브처럼 70% 관심 콘텐츠 + 20% 관련 콘텐츠 + 10% 새로운 것 조합. 익숙함과 신선함의 균형으로 지루함 방지.',
    icon: '📊',
    color: '#ff6b9d',
    examples: [
      '70%: 고양이 퀴즈/투표 (관심 카테고리)',
      '20%: 반려동물 일반 콘텐츠 (관련 확장)',
      '10%: 연애/커피 테스트 (새 카테고리 탐색 유도)',
    ],
    metrics: ['신규 카테고리 탐색률', '다양성 점수'],
  },
  {
    id: 'progressive-profile',
    title: '점진적 프로필',
    subtitle: 'Progressive Profiling',
    description: '처음부터 온보딩 설문 없이 시작. 테스트/퀴즈/투표 참여를 통해 자연스럽게 선호도 파악. 활동이 많아질수록 개인화 정확도 향상.',
    icon: '📈',
    color: '#ffd166',
    examples: [
      '테스트 1개 완료 → 해당 카테고리 우선 (+10점)',
      '퀴즈 정답 → 해당 주제 관심도 상승',
      '투표 참여 → 취향 데이터 수집',
    ],
    metrics: ['활동당 프로필 정확도 변화', '개인화 적용 비율'],
  },
  {
    id: 'youtube-feed',
    title: '유튜브식 피드',
    subtitle: 'Personalized Feed',
    description: '고정된 콘텐츠 목록이 아닌, 사용자마다 다른 피드 제공. 접속할 때마다 새로운 추천으로 재방문 동기 부여.',
    icon: '🔄',
    color: '#a29bfe',
    examples: [
      '대시보드 "오늘의 추천" 섹션 개인화',
      '새로고침마다 추천 순서 변경',
      '"왜 이걸 추천했나요?" 설명 툴팁',
    ],
    metrics: ['재방문율', '피드 스크롤 깊이'],
  },
];

// ============================================================================
// 2. 사용자 세그먼트 정의
// ============================================================================

export const USER_SEGMENTS: UserSegment[] = [
  {
    id: 'pet_lover',
    name: '반려동물 애호가',
    description: '반려동물 관련 테스트와 콘텐츠를 주로 즐기는 사용자',
    icon: '🐾',
    color: '#ff9f43',
    characteristics: [
      'pet 카테고리 테스트 2개 이상 완료',
      'pet 관련 퀴즈/투표 참여율 높음',
      '결과 공유 빈도 높음',
    ],
    triggers: [
      'cat, dog, rabbit, hamster 테스트 완료',
      'catBreed, dogBreed 심화 테스트 완료',
    ],
    recommendationStrategy: 'pet 카테고리 70% + lifestyle 20% + love 10%',
    retentionTips: [
      '새 반려동물 퀴즈 출시 알림',
      '반려동물 돌봄 팁 콘텐츠',
      '같은 결과 유형 반려인 커뮤니티',
    ],
  },
  {
    id: 'love_seeker',
    name: '연애 탐구자',
    description: '연애, 관계, 이상형 관련 콘텐츠에 관심이 많은 사용자',
    icon: '💕',
    color: '#ff6b6b',
    characteristics: [
      'idealType, conflictStyle 테스트 완료',
      'love 카테고리 투표 참여 많음',
      '케미 테스트 공유 경험',
    ],
    triggers: [
      'idealType 테스트 완료',
      'conflictStyle 테스트 완료',
      'love 투표 3개 이상 참여',
    ],
    recommendationStrategy: 'love 카테고리 70% + personality 20% + lifestyle 10%',
    retentionTips: [
      '커플 케미 테스트 초대 유도',
      '연애 상담 Q&A 콘텐츠',
      '연애 심리 퀴즈',
    ],
  },
  {
    id: 'lifestyle_explorer',
    name: '라이프스타일 탐험가',
    description: '다양한 라이프스타일 테스트를 즐기는 사용자',
    icon: '☕',
    color: '#a29bfe',
    characteristics: [
      'coffee, plant, petMatch 테스트 완료',
      '다양한 카테고리 골고루 참여',
      '트렌드 콘텐츠 관심 높음',
    ],
    triggers: [
      'coffee 테스트 완료',
      'plant 테스트 완료',
      '3개 이상 다른 카테고리 참여',
    ],
    recommendationStrategy: 'lifestyle 50% + 최근 관심 30% + 신규 20%',
    retentionTips: [
      '새 라이프스타일 테스트 우선 알림',
      '시즌 맞춤 콘텐츠',
      '트렌드 투표 참여 유도',
    ],
  },
  {
    id: 'completionist',
    name: '완료주의자',
    description: '모든 테스트를 완료하고 싶어하는 사용자',
    icon: '🏆',
    color: '#1dd1a1',
    characteristics: [
      '테스트 완료율 80% 이상',
      '연속 참여 스트릭 높음',
      '뱃지 수집 관심',
    ],
    triggers: [
      '완료 테스트 5개 이상',
      '연속 7일 이상 참여',
      '모든 pet 테스트 완료',
    ],
    recommendationStrategy: '미완료 테스트 우선 + 새 콘텐츠 즉시 추천',
    retentionTips: [
      '"N개 더 하면 전체 완료!" 진행률 표시',
      '완료 뱃지 보상',
      '새 테스트 출시 즉시 알림',
    ],
  },
  {
    id: 'social_butterfly',
    name: '소셜 나비',
    description: '결과 공유와 친구 초대를 자주 하는 사용자',
    icon: '🦋',
    color: '#55e6c1',
    characteristics: [
      '결과 공유 빈도 높음',
      '친구 초대 링크 생성 경험',
      '케미 테스트/투표 참여',
    ],
    triggers: [
      '결과 공유 3회 이상',
      '친구 초대 1회 이상',
      '의견 대결 참여',
    ],
    recommendationStrategy: '공유하기 좋은 콘텐츠 우선 + 바이럴 요소 강조',
    retentionTips: [
      '"친구 N명이 당신을 기다려요" 알림',
      '공유 보상 포인트',
      '친구와 함께하는 콘텐츠 추천',
    ],
  },
  {
    id: 'casual_visitor',
    name: '가끔 방문자',
    description: '간헐적으로 방문하는 사용자',
    icon: '👋',
    color: '#636e72',
    characteristics: [
      '주 1회 미만 방문',
      '테스트 1-2개만 완료',
      '세션 시간 짧음',
    ],
    triggers: [
      '마지막 방문 7일 이상',
      '완료 테스트 2개 이하',
    ],
    recommendationStrategy: '인기 콘텐츠 + 빠른 참여 가능한 것 우선',
    retentionTips: [
      '재방문 시 "오랜만이에요!" 환영 메시지',
      '짧은 투표로 가벼운 참여 유도',
      '이전 결과 리마인드',
    ],
  },
  {
    id: 'new_user',
    name: '신규 사용자',
    description: '처음 방문한 사용자 (콜드 스타트)',
    icon: '🌱',
    color: '#7aa2ff',
    characteristics: [
      '완료 테스트 0개',
      '첫 방문',
    ],
    triggers: [
      '세션 시작 + 테스트 기록 없음',
    ],
    recommendationStrategy: '인기 순위 기반 추천 (human, coffee)',
    retentionTips: [
      '가장 인기 있는 테스트 안내',
      '빠른 결과 확인 강조',
      '결과 공유 유도',
    ],
  },
];

// ============================================================================
// 3. 추천 알고리즘 설계
// ============================================================================

export const RECOMMENDATION_ALGORITHMS: AlgorithmDefinition[] = [
  {
    id: 'popularity',
    name: '인기 기반',
    description: '전체 사용자의 참여율, 완료율, 공유율 기반 인기 순위 추천',
    icon: '🔥',
    useCase: '콜드 스타트 (신규 사용자), 트렌드 표시',
    pros: [
      '구현 간단',
      '검증된 콘텐츠 추천',
      '신규 사용자에게 안전한 선택',
    ],
    cons: [
      '개인화 없음',
      '다양성 부족',
      '인기 콘텐츠 쏠림',
    ],
    implementation: '참여 수 + 완료율 + 공유 수 가중 평균',
    dataRequired: ['총 참여 수', '완료율', '공유 수'],
  },
  {
    id: 'category',
    name: '카테고리 기반',
    description: '첫 테스트 카테고리와 같거나 관련된 콘텐츠 우선 추천',
    icon: '📁',
    useCase: '워밍업 단계 (테스트 1-2개 완료)',
    pros: [
      '빠른 개인화 시작',
      '관심사 기반 확장',
      '구현 용이',
    ],
    cons: [
      '카테고리 고착 위험',
      '새 관심사 발견 어려움',
    ],
    implementation: '완료 테스트 카테고리 → 같은/관련 카테고리 우선',
    dataRequired: ['완료 테스트 목록', '카테고리 매핑'],
  },
  {
    id: 'collaborative',
    name: '협업 필터링',
    description: '비슷한 참여 패턴의 사용자들이 즐긴 콘텐츠 추천',
    icon: '👥',
    useCase: '활성 사용자 (테스트 3개 이상)',
    pros: [
      '숨은 관심사 발견',
      '세렌디피티 효과',
      '검증된 추천',
    ],
    cons: [
      '콜드 스타트 문제',
      '인기 편향',
      '계산 비용',
    ],
    implementation: '유사 사용자 군집 → 해당 군집 인기 콘텐츠',
    dataRequired: ['사용자-콘텐츠 매트릭스', '유사도 계산'],
  },
  {
    id: 'content-based',
    name: '콘텐츠 기반',
    description: '완료한 테스트 결과, 응답 패턴 기반 유사 콘텐츠 추천',
    icon: '🧬',
    useCase: '깊은 개인화가 필요할 때',
    pros: [
      '정교한 매칭',
      '결과 기반 추천',
      '새 콘텐츠도 추천 가능',
    ],
    cons: [
      '메타데이터 필요',
      '다양성 부족',
      '과적합 위험',
    ],
    implementation: '테스트 결과 벡터 → 유사 콘텐츠 매칭',
    dataRequired: ['테스트 결과', '콘텐츠 특성 벡터'],
  },
  {
    id: 'hybrid',
    name: '하이브리드',
    description: '여러 알고리즘 조합 (70-20-10 법칙 적용)',
    icon: '🔀',
    useCase: '모든 상황 (기본 권장)',
    pros: [
      '장점 결합',
      '상황별 최적화',
      '다양성과 관련성 균형',
    ],
    cons: [
      '구현 복잡',
      '튜닝 필요',
    ],
    implementation: '70% 관심 기반 + 20% 협업 필터링 + 10% 인기/랜덤',
    dataRequired: ['모든 데이터 소스'],
  },
];

// ============================================================================
// 4. 콜드 스타트 전략
// ============================================================================

export interface ColdStartStrategy {
  activityLevel: ActivityLevel;
  completedTests: string;
  strategy: string;
  algorithm: RecommendationAlgorithm;
  priority: string[];
  examples: string[];
}

export const COLD_START_STRATEGIES: ColdStartStrategy[] = [
  {
    activityLevel: 'cold',
    completedTests: '0개',
    strategy: '인기 기반 추천',
    algorithm: 'popularity',
    priority: ['human', 'coffee', 'cat'],
    examples: [
      '가장 인기 있는 테스트 3개 표시',
      '"1분이면 끝나요!" 강조',
      '참여자 수 표시로 신뢰감',
    ],
  },
  {
    activityLevel: 'warming',
    completedTests: '1-2개',
    strategy: '카테고리 확장',
    algorithm: 'category',
    priority: ['첫 테스트와 같은 카테고리', '관련 카테고리', '인기 테스트'],
    examples: [
      'cat 완료 → catBreed, dog 추천',
      'idealType 완료 → conflictStyle 추천',
      '같은 카테고리 퀴즈/투표 노출',
    ],
  },
  {
    activityLevel: 'active',
    completedTests: '3-5개',
    strategy: '개인화 시작',
    algorithm: 'hybrid',
    priority: ['관심 카테고리 (70%)', '관련 콘텐츠 (20%)', '새 발견 (10%)'],
    examples: [
      '70-20-10 법칙 본격 적용',
      '유사 사용자 패턴 참고',
      '"당신 같은 분들이 좋아한" 섹션',
    ],
  },
  {
    activityLevel: 'power',
    completedTests: '6개 이상',
    strategy: '정교한 개인화',
    algorithm: 'hybrid',
    priority: ['미완료 테스트', '새 콘텐츠', '심화 콘텐츠'],
    examples: [
      '완료율 기반 다음 추천',
      '새 테스트 출시 알림',
      '시나리오 퀴즈, 깊이 모드',
    ],
  },
];

// ============================================================================
// 5. UI 패턴 정의
// ============================================================================

export const UI_PATTERNS: UIPattern[] = [
  {
    id: 'choice-cards',
    name: '선택 카드',
    description: '2-3개 옵션을 카드 형태로 제공. 각 카드에 추천 이유 표시.',
    icon: '🃏',
    wireframe: `
┌─────────────────────────────────────────┐
│  다음으로 뭐 해볼까?                      │
├─────────────────────────────────────────┤
│  ┌───────────┐  ┌───────────┐  ┌───────────┐
│  │ 🐱        │  │ 💕        │  │ ☕        │
│  │ 고양이    │  │ 연애      │  │ 커피      │
│  │ 성격 2    │  │ 이상형    │  │ 취향      │
│  │ "관심 기반"│  │ "인기"    │  │ "새로운"  │
│  └───────────┘  └───────────┘  └───────────┘
└─────────────────────────────────────────┘
    `,
    useCases: [
      '테스트 결과 화면 하단',
      '대시보드 "오늘의 추천"',
      '메인 홈 진입 시',
    ],
    implementation: 'PersonalizedNextActions 컴포넌트',
  },
  {
    id: 'interest-chips',
    name: '관심사 필터 칩',
    description: '관심 카테고리를 칩으로 표시. 클릭하면 필터링.',
    icon: '🏷️',
    wireframe: `
┌─────────────────────────────────────────┐
│  [ 🐱 고양이 ] [ 💕 연애 ] [ ☕ 라이프 ] │
│  [ + 더보기 ]                            │
├─────────────────────────────────────────┤
│  필터된 콘텐츠 목록...                    │
└─────────────────────────────────────────┘
    `,
    useCases: [
      '대시보드 상단 필터',
      '퀴즈/투표 목록 필터',
      '검색 결과 필터',
    ],
    implementation: '기존 Dashboard 필터 확장',
  },
  {
    id: 'for-you-section',
    name: '"당신을 위한 추천" 섹션',
    description: '개인화된 추천 콘텐츠 섹션. 왜 추천하는지 설명 포함.',
    icon: '✨',
    wireframe: `
┌─────────────────────────────────────────┐
│  ✨ 당신을 위한 추천                      │
│  "고양이 테스트를 좋아하셔서 추천해요"     │
├─────────────────────────────────────────┤
│  [퀴즈1] [퀴즈2] [투표1]                  │
├─────────────────────────────────────────┤
│  🔄 다른 추천 보기                        │
└─────────────────────────────────────────┘
    `,
    useCases: [
      '대시보드 상단',
      '메인 홈',
      '카테고리 페이지',
    ],
    implementation: 'DailyContentCards 개인화 확장',
  },
  {
    id: 'recommendation-reason',
    name: '추천 이유 툴팁',
    description: '각 추천 항목에 "왜 추천했는지" 설명.',
    icon: '💡',
    wireframe: `
┌─────────────────────────────────────────┐
│  🐱 고양이 품종 테스트                    │
│  ┌─────────────────────────────────────┐
│  │ 💡 "고양이 성격 테스트를 완료해서     │
│  │     이 테스트도 좋아하실 것 같아요"   │
│  └─────────────────────────────────────┘
└─────────────────────────────────────────┘
    `,
    useCases: [
      '모든 추천 항목',
      '결과 화면 다음 추천',
    ],
    implementation: 'RecommendationReason 컴포넌트',
  },
];

// ============================================================================
// 6. 사용자 프로파일링 시스템 (타겟팅 광고용)
// ============================================================================

export interface InferenceRule {
  id: string;
  trigger: {
    type: 'test_complete' | 'quiz_answer' | 'poll_vote' | 'activity_pattern';
    testType?: string;
    quizId?: string;
    pollId?: string;
    optionId?: string;
    pattern?: string;
  };
  inference: {
    attribute: string;
    value: string;
    confidence: number;
  };
  description: string;
}

export interface UserAttribute {
  id: string;
  name: string;
  description: string;
  possibleValues: string[];
  inferenceMethod: string;
  adUseCase: string;
}

export interface AdTargetSegment {
  id: string;
  name: string;
  description: string;
  conditions: {
    attribute: string;
    operator: 'eq' | 'gte' | 'lte' | 'in';
    value: string | number | string[];
  }[];
  advertisers: string[];
  estimatedReach: string;
}

// 추론 규칙
export const INFERENCE_RULES: InferenceRule[] = [
  // 테스트 완료 기반
  {
    id: 'cat-interest',
    trigger: { type: 'test_complete', testType: 'cat' },
    inference: { attribute: 'petInterest', value: 'cat', confidence: 0.8 },
    description: '고양이 테스트 완료 → 고양이 관심',
  },
  {
    id: 'cat-owner',
    trigger: { type: 'test_complete', testType: 'catBreed' },
    inference: { attribute: 'petOwner', value: 'cat', confidence: 0.9 },
    description: '고양이 품종 테스트 완료 → 고양이 보유 추정',
  },
  {
    id: 'dog-interest',
    trigger: { type: 'test_complete', testType: 'dog' },
    inference: { attribute: 'petInterest', value: 'dog', confidence: 0.8 },
    description: '강아지 테스트 완료 → 강아지 관심',
  },
  {
    id: 'dog-owner',
    trigger: { type: 'test_complete', testType: 'dogBreed' },
    inference: { attribute: 'petOwner', value: 'dog', confidence: 0.9 },
    description: '강아지 품종 테스트 완료 → 강아지 보유 추정',
  },
  {
    id: 'relationship-seeking',
    trigger: { type: 'test_complete', testType: 'idealType' },
    inference: { attribute: 'relationshipSeeking', value: 'true', confidence: 0.7 },
    description: '이상형 테스트 완료 → 연애 관심',
  },
  {
    id: 'plant-interest',
    trigger: { type: 'test_complete', testType: 'plant' },
    inference: { attribute: 'plantInterest', value: 'true', confidence: 0.8 },
    description: '식물 테스트 완료 → 식물 관심',
  },
  {
    id: 'coffee-lover',
    trigger: { type: 'test_complete', testType: 'coffee' },
    inference: { attribute: 'coffeeInterest', value: 'high', confidence: 0.8 },
    description: '커피 테스트 완료 → 커피 관심',
  },
  // 활동 패턴 기반
  {
    id: 'night-owl',
    trigger: { type: 'activity_pattern', pattern: 'evening_active' },
    inference: { attribute: 'lifestyleTime', value: 'night_owl', confidence: 0.6 },
    description: '저녁/야간 활동 많음 → 야행성',
  },
  {
    id: 'morning-person',
    trigger: { type: 'activity_pattern', pattern: 'morning_active' },
    inference: { attribute: 'lifestyleTime', value: 'morning_person', confidence: 0.6 },
    description: '오전 활동 많음 → 아침형',
  },
];

// 추론 가능한 사용자 속성
export const USER_ATTRIBUTES: UserAttribute[] = [
  {
    id: 'petInterest',
    name: '반려동물 관심',
    description: '어떤 반려동물에 관심이 있는지',
    possibleValues: ['cat', 'dog', 'rabbit', 'hamster', 'none'],
    inferenceMethod: 'pet 관련 테스트 완료, 퀴즈/투표 참여',
    adUseCase: '펫용품, 펫푸드, 펫보험 광고',
  },
  {
    id: 'petOwner',
    name: '반려동물 보유',
    description: '실제로 반려동물을 키우는지',
    possibleValues: ['cat', 'dog', 'rabbit', 'hamster', 'multiple', 'none'],
    inferenceMethod: '품종 테스트 완료 (catBreed, dogBreed)',
    adUseCase: '프리미엄 펫용품, 동물병원, 펫시터',
  },
  {
    id: 'relationshipSeeking',
    name: '연애 관심도',
    description: '연애/관계에 관심이 있는지',
    possibleValues: ['true', 'false'],
    inferenceMethod: 'idealType, conflictStyle 테스트, love 투표',
    adUseCase: '데이팅앱, 소개팅 서비스',
  },
  {
    id: 'plantInterest',
    name: '식물 관심',
    description: '반려식물에 관심이 있는지',
    possibleValues: ['true', 'false'],
    inferenceMethod: 'plant 테스트, 식물 퀴즈/투표',
    adUseCase: '화분, 원예용품, 식물 구독',
  },
  {
    id: 'coffeeInterest',
    name: '커피 관심도',
    description: '커피에 대한 관심 수준',
    possibleValues: ['high', 'medium', 'low'],
    inferenceMethod: 'coffee 테스트 결과, 라이프스타일 투표',
    adUseCase: '커피 구독, 카페, 커피 용품',
  },
  {
    id: 'lifestyleTime',
    name: '생활 패턴',
    description: '아침형/저녁형 생활 패턴',
    possibleValues: ['morning_person', 'night_owl', 'flexible'],
    inferenceMethod: '접속 시간대 분석',
    adUseCase: '시간대별 콘텐츠 노출 최적화',
  },
  {
    id: 'engagementLevel',
    name: '참여 활발도',
    description: '서비스 이용 활발도',
    possibleValues: ['power', 'active', 'casual', 'dormant'],
    inferenceMethod: '참여 빈도, 세션 시간, 완료 수',
    adUseCase: '활성 사용자 타겟팅',
  },
];

// 광고 타겟팅 세그먼트
export const AD_TARGET_SEGMENTS: AdTargetSegment[] = [
  {
    id: 'cat_parent',
    name: '고양이 집사',
    description: '고양이를 키우거나 키울 계획인 사용자',
    conditions: [
      { attribute: 'petOwner', operator: 'eq', value: 'cat' },
    ],
    advertisers: ['프리미엄 고양이 사료', '고양이 용품', '동물병원', '펫보험'],
    estimatedReach: '전체 사용자의 15-20%',
  },
  {
    id: 'dog_parent',
    name: '강아지 보호자',
    description: '강아지를 키우거나 키울 계획인 사용자',
    conditions: [
      { attribute: 'petOwner', operator: 'eq', value: 'dog' },
    ],
    advertisers: ['강아지 사료', '강아지 용품', '펫시터', '훈련 서비스'],
    estimatedReach: '전체 사용자의 20-25%',
  },
  {
    id: 'single_seeking',
    name: '연애 관심자',
    description: '연애/소개팅에 관심이 있는 사용자',
    conditions: [
      { attribute: 'relationshipSeeking', operator: 'eq', value: 'true' },
    ],
    advertisers: ['데이팅앱', '소개팅 서비스', '뷰티/패션'],
    estimatedReach: '전체 사용자의 30-40%',
  },
  {
    id: 'plant_lover',
    name: '식물 애호가',
    description: '반려식물에 관심이 있는 사용자',
    conditions: [
      { attribute: 'plantInterest', operator: 'eq', value: 'true' },
    ],
    advertisers: ['화분', '원예용품', '식물 구독 서비스'],
    estimatedReach: '전체 사용자의 10-15%',
  },
  {
    id: 'coffee_addict',
    name: '커피 러버',
    description: '커피에 관심이 높은 사용자',
    conditions: [
      { attribute: 'coffeeInterest', operator: 'eq', value: 'high' },
    ],
    advertisers: ['커피 구독', '카페', '커피 머신', '원두'],
    estimatedReach: '전체 사용자의 25-30%',
  },
  {
    id: 'power_user',
    name: '파워 유저',
    description: '서비스를 활발히 이용하는 핵심 사용자',
    conditions: [
      { attribute: 'engagementLevel', operator: 'eq', value: 'power' },
    ],
    advertisers: ['프리미엄 서비스', '구독 상품', '커뮤니티 광고'],
    estimatedReach: '전체 사용자의 5-10%',
  },
];

// 프로파일링 시스템 통합
export const USER_PROFILING_SYSTEM = {
  inferenceRules: INFERENCE_RULES,
  userAttributes: USER_ATTRIBUTES,
  adTargetSegments: AD_TARGET_SEGMENTS,
  // 개인정보 보호 고려사항
  privacyConsiderations: [
    'deviceId만 사용, 실명 연결 없음',
    '광고 개인화 동의 옵션 제공',
    '어떤 데이터로 추천하는지 설명 가능',
    '프로필 데이터 삭제 기능 제공',
  ],
};

// ============================================================================
// 7. content-system.ts의 후속 참여 전략 통합
// ============================================================================

// 이 부분은 content-system.ts의 FOLLOWUP_STRATEGY를 참조
// 개인화 전략과 연결하여 사용

export const FOLLOWUP_INTEGRATION = {
  description: 'content-system.ts의 FOLLOWUP_STRATEGY와 연동',
  reference: 'src/app/dashboard/data/content-system.ts',
  keyElements: [
    { id: 'choice-cards', from: 'related-content', description: '관련 콘텐츠 → 선택 카드로 확장' },
    { id: 'segment-result', from: 'segment-result', description: '유형별 결과 비교 → 개인화 피드' },
    { id: 'why-recommendation', from: 'friend-tag', description: '추천 이유 표시' },
  ],
};

// ============================================================================
// 8. 구현 로드맵
// ============================================================================

export const IMPLEMENTATION_ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    title: '전략 문서화',
    status: 'done',
    description: '개인화 전략을 체계적으로 정리하고 대시보드에서 확인 가능하게',
    tasks: [
      { name: 'personalization-strategy.ts 데이터 파일 생성', status: 'done' },
      { name: 'PersonalizationStrategy.tsx 컴포넌트 생성', status: 'in-progress' },
      { name: 'page.tsx에 개인화 탭 추가', status: 'pending' },
    ],
    deliverables: ['대시보드 개인화 전략 탭'],
  },
  {
    phase: 2,
    title: '추천 로직 단일화',
    status: 'done',
    description: '3곳에 분산된 추천 우선순위를 recommendationPolicy로 통합',
    tasks: [
      { name: 'recommendationPolicy 모듈 생성', status: 'done', details: 'RECOMMENDATION_ORDER, POPULAR_TESTS, COLD_START_POPULARITY_LIMIT' },
      { name: 'NextActionService 리팩토링', status: 'done', details: 'recommendationPolicy 참조하도록 수정' },
      { name: 'ProfileService 리팩토링', status: 'done' },
      { name: 'ResultService 리팩토링', status: 'done' },
      { name: '단위 테스트 추가', status: 'pending' },
    ],
    deliverables: ['recommendationPolicy.ts', '리팩토링된 서비스들', '테스트 코드'],
  },
  {
    phase: 3,
    title: 'UserPreferenceService',
    status: 'planned',
    description: '사용자 선호도 계산 및 저장 서비스 구현',
    tasks: [
      { name: 'UserPreferenceService 생성', status: 'pending' },
      { name: '관심사 점수 계산 로직', status: 'pending' },
      { name: '세그먼트 결정 로직', status: 'pending' },
      { name: 'localStorage 연동', status: 'pending' },
    ],
    deliverables: ['UserPreferenceService.ts'],
  },
  {
    phase: 4,
    title: '결과 화면 선택 카드',
    status: 'planned',
    description: '테스트 결과 화면에 2-3개 선택 카드 추가',
    tasks: [
      { name: 'PersonalizedNextActions 컴포넌트', status: 'pending' },
      { name: 'page.js 결과 화면 수정', status: 'pending' },
      { name: '70-20-10 법칙 적용', status: 'pending' },
    ],
    deliverables: ['PersonalizedNextActions.tsx', '수정된 결과 화면'],
  },
  {
    phase: 5,
    title: '대시보드 개인화 피드',
    status: 'planned',
    description: '대시보드에 "당신을 위한 추천" 섹션 추가',
    tasks: [
      { name: 'ForYouSection 컴포넌트', status: 'pending' },
      { name: 'Dashboard.js 수정', status: 'pending' },
      { name: 'DailyContentCards 개인화 연동', status: 'pending' },
    ],
    deliverables: ['ForYouSection.tsx', '개인화된 대시보드'],
  },
  {
    phase: 6,
    title: '사용자 프로파일링 구현',
    status: 'later',
    description: '타겟팅 광고를 위한 사용자 특성 추론 시스템',
    tasks: [
      { name: 'UserProfilingService 생성', status: 'pending' },
      { name: '추론 규칙 엔진 구현', status: 'pending' },
      { name: '광고 세그먼트 API', status: 'pending' },
      { name: '개인정보 보호 설정', status: 'pending' },
    ],
    deliverables: ['UserProfilingService.ts', '세그먼트 API'],
  },
  {
    phase: 7,
    title: '추천 시스템 Phase 2: 협업 필터링',
    status: 'later',
    description: '사용자 행동 패턴 기반 추천 (유튜브/넷플릭스 스타일)',
    tasks: [
      { name: 'Turso DB에 참여 이력 테이블 추가', status: 'pending', details: 'user_content_participation 테이블' },
      { name: '유사 사용자 군집 알고리즘 구현', status: 'pending', details: '참여 패턴 유사도 계산' },
      { name: '"이 퀴즈 푼 사람들이 좋아한" 추천', status: 'pending', details: '협업 필터링 로직' },
      { name: '태그 기반 + 협업 필터링 하이브리드', status: 'pending', details: '70% 태그 + 30% 협업' },
      { name: '추천 정확도 A/B 테스트', status: 'pending' },
    ],
    deliverables: ['CollaborativeFilteringService.ts', '하이브리드 추천 알고리즘'],
  },
  {
    phase: 8,
    title: '콘텐츠 품질 관리: 사람 검수 프로세스',
    status: 'later',
    description: 'AI 생성 콘텐츠의 사람 검수 워크플로우 (MVP 이후, 패턴 안정화 시 검토)',
    tasks: [
      { name: '콘텐츠 검수 큐 시스템', status: 'pending', details: 'AI 생성 → 검수 대기 → 승인/반려 상태 관리' },
      { name: '검수자 대시보드 UI', status: 'pending', details: '팩트체크, 연령등급, 적절성 확인 화면' },
      { name: '자동 검수 규칙 학습', status: 'pending', details: '검수 결과 패턴 분석 → AI 생성 규칙 개선' },
      { name: '검수 불필요 콘텐츠 자동 승인', status: 'pending', details: '패턴 안정화 후 저위험 콘텐츠 자동 통과' },
    ],
    deliverables: ['ContentReviewService.ts', '검수 대시보드', '자동 승인 규칙'],
    notes: '⚠️ MVP에서는 AI 자동 검증만 사용. 바이럴 우선이므로 검수로 인한 지연 최소화. 문제 패턴 발견 시 도입 검토.',
  },
];

// ============================================================================
// 9. 리뷰에서 발견된 기존 코드 문제
// ============================================================================

export interface CodeIssue {
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  locations: { file: string; lines: string; role: string }[];
  problem: string;
  solution: string;
  phase: number;
}

export const EXISTING_CODE_ISSUES: CodeIssue[] = [
  {
    severity: 'high',
    title: '추천 우선순위 3곳 중복',
    description: '화면마다 "다음 테스트"가 달라지는 일관성 문제',
    locations: [
      { file: 'NextActionService.ts', lines: '166, 546', role: '다음 액션 추천' },
      { file: 'ProfileService.ts', lines: '211, 375', role: '프로필 기반 추천' },
      { file: 'ResultService.ts', lines: '355, 380', role: '결과 후 추천' },
    ],
    problem: '3개 서비스가 각각 다른 우선순위를 하드코딩 → 화면마다 다른 추천 노출',
    solution: 'recommendationPolicy 공통 모듈로 통합 (Phase 2)',
    phase: 2,
  },
  {
    severity: 'medium',
    title: '콜드 스타트 전략 불일치',
    description: '신규 사용자 추천이 하드코딩되어 있음',
    locations: [
      { file: 'NextActionService.ts', lines: '524, 546', role: '콜드 스타트 추천' },
    ],
    problem: '인기 기반 추천이 아닌 하드코딩된 순서에 의존',
    solution: '활동 수준별 분기 로직 추가 (0-2개 → 인기 기반, 3+ → 개인화)',
    phase: 2,
  },
  {
    severity: 'medium',
    title: '랭킹 메타데이터 All-or-Nothing',
    description: 'meta 없는 결과는 랭킹에서 제외되어 부분 도입 시 문제',
    locations: [
      { file: 'rankingTemplates.ts', lines: '189', role: '랭킹 템플릿' },
      { file: 'types.ts', lines: '24', role: '타입 정의' },
    ],
    problem: 'meta 필드가 없는 레거시 결과는 랭킹에서 완전히 제외',
    solution: '폴백 규칙 추가: meta 없으면 기본값 사용',
    phase: 2,
  },
  {
    severity: 'low',
    title: '추천 로직 테스트 부재',
    description: '추천 알고리즘에 대한 단위 테스트가 없음',
    locations: [],
    problem: '리팩토링 시 회귀 테스트 불가',
    solution: 'Phase 2에서 단위 테스트 추가',
    phase: 2,
  },
];

// ============================================================================
// 10. 통합 Export
// ============================================================================

export const PERSONALIZATION_STRATEGY = {
  principles: PERSONALIZATION_PRINCIPLES,
  segments: USER_SEGMENTS,
  algorithms: RECOMMENDATION_ALGORITHMS,
  coldStart: COLD_START_STRATEGIES,
  uiPatterns: UI_PATTERNS,
  profiling: USER_PROFILING_SYSTEM,
  followUpIntegration: FOLLOWUP_INTEGRATION,
  roadmap: IMPLEMENTATION_ROADMAP,
  existingIssues: EXISTING_CODE_ISSUES,
};

export default PERSONALIZATION_STRATEGY;
