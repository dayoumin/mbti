// ============================================================================
// 세부 테스트 후 사용자 여정 데이터
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type JourneyPhase = 'immediate' | 'short-term' | 'long-term';
export type Priority = 'high' | 'medium' | 'low';
export type ImplementationStatus = 'planned' | 'in-progress' | 'done';

export interface UserNeed {
  id: string;
  title: string;
  description: string;
  userScenario: string;
  priority: Priority;
  phase: JourneyPhase;
  status: ImplementationStatus;
  difficulty: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  details: string[];
  dataRequirements?: string[];
  relatedFeatures?: string[];
}

export interface DetailTestCategory {
  id: string;
  name: string;
  icon: string;
  parentTest: string;
  resultTypes: string[];
  postTestNeeds: string[]; // UserNeed IDs
}

export interface CommunityConnection {
  id: string;
  name: string;
  description: string;
  targetAudience: string;
  contentIdeas: string[];
  moderationNotes: string[];
}

// ============================================================================
// 사용자 여정 흐름
// ============================================================================

export const USER_JOURNEY_FLOW = {
  title: '세부 테스트 후 사용자 여정',
  description: 'PetMatch → 세부 테스트(품종 추천) → 다음 단계',
  stages: [
    {
      id: 'complete-detail-test',
      name: '세부 테스트 완료',
      emoji: '✅',
      description: '품종 추천 결과 확인',
      example: '"나에게 맞는 강아지는 골든 리트리버!"',
    },
    {
      id: 'result-understanding',
      name: '결과 이해',
      emoji: '📖',
      description: '추천 품종에 대한 상세 정보 확인',
      example: '성격, 관리법, 비용, 주의사항 등',
    },
    {
      id: 'decision-support',
      name: '결정 지원',
      emoji: '🤔',
      description: '실제 입양/분양 결정을 위한 정보',
      example: '비교, 체크리스트, 현실적 조언',
    },
    {
      id: 'action-guidance',
      name: '행동 유도',
      emoji: '🎯',
      description: '다음 행동으로 연결',
      example: '정보 더 찾기, 커뮤니티, 분양처',
    },
    {
      id: 'community-entry',
      name: '커뮤니티 진입',
      emoji: '👥',
      description: '같은 관심사 사용자와 연결',
      example: '"골든 리트리버 예비맘/아빠들" 그룹',
    },
  ],
};

// ============================================================================
// 사용자 니즈 상세
// ============================================================================

export const USER_NEEDS: UserNeed[] = [
  // === 즉시 (Immediate) ===
  {
    id: 'breed-detail-info',
    title: '품종 상세 정보',
    description: '추천 품종의 구체적인 특징과 정보',
    userScenario: '"골든 리트리버가 추천됐는데, 실제로 어떤 아이인지 더 알고 싶어요"',
    priority: 'high',
    phase: 'immediate',
    status: 'done',  // ✅ 2024-12 구현 완료
    difficulty: 2,
    impact: 5,
    details: [
      '성격 특성 (친화력, 활동량, 독립성 등)',
      '외모 특징 (크기, 털, 색상 등)',
      '건강 주의사항 (유전질환, 수명 등)',
      '양육 환경 요구사항 (공간, 운동량 등)',
    ],
    dataRequirements: [
      'breedInfo: { personality, appearance, health, environment }',
      '각 품종별 최소 10개 항목',
    ],
    relatedFeatures: ['result-card', 'share'],
    // 구현 내역:
    // - types.ts: BreedDetailInfo 인터페이스 추가
    // - dogBreed.ts: 12개 품종에 detailInfo 추가
    // - page.js: BreedDetailCard 컴포넌트 (접힘/펼침 아코디언)
    // - 포함 정보: origin, lifespan, size, weight, personality, goodWith, notGoodWith,
    //   exerciseNeeds, groomingNeeds, sheddingLevel, trainingDifficulty, healthIssues,
    //   monthlyCost, initialCost, tips
  },
  {
    id: 'care-guide',
    title: '관리/돌봄 가이드',
    description: '실제 양육에 필요한 관리법',
    userScenario: '"골든 리트리버를 키우려면 뭘 준비해야 하지?"',
    priority: 'high',
    phase: 'immediate',
    status: 'done',  // ✅ 2024-12 구현 완료 (detailInfo에 통합)
    difficulty: 2,
    impact: 5,
    details: [
      '필수 준비물 체크리스트',
      '일일/주간/월간 관리 루틴',
      '먹이/간식 가이드',
      '미용/위생 관리',
      '훈련 기본 가이드',
    ],
    dataRequirements: [
      'careGuide: { essentials, routine, feeding, grooming, training }',
    ],
    // 구현 내역:
    // - detailInfo.exerciseNeeds/groomingNeeds/sheddingLevel/trainingDifficulty로 관리 정보 제공
    // - detailInfo.tips: 양육 꿀팁 3-5개
    // - BreedDetailCard에서 관리 정보 섹션으로 표시
  },
  {
    id: 'cost-estimate',
    title: '비용 예상',
    description: '실제 양육에 드는 비용 정보',
    userScenario: '"골든 리트리버 키우는 데 한 달에 얼마나 들까?"',
    priority: 'high',
    phase: 'immediate',
    status: 'done',  // ✅ 2024-12 구현 완료 (detailInfo에 통합)
    difficulty: 1,
    impact: 4,
    details: [
      '초기 비용 (입양/분양, 용품)',
      '월간 유지비 (사료, 간식, 의료)',
      '연간 비용 (예방접종, 미용)',
      '예상치 못한 비용 (응급, 질병)',
    ],
    dataRequirements: [
      'costEstimate: { initial, monthly, yearly, emergency }',
      '가격대는 범위로 표시 (10~20만원)',
    ],
    // 구현 내역:
    // - detailInfo.monthlyCost: { min, max, note } - 월 비용 범위
    // - detailInfo.initialCost: { min, max, note } - 초기 비용 범위
    // - BreedDetailCard에서 "예상 비용" 섹션으로 표시 (만원 단위)
  },

  // === 단기 (Short-term) ===
  {
    id: 'comparison-tool',
    title: '품종 비교',
    description: '여러 품종을 나란히 비교',
    userScenario: '"골든 리트리버랑 래브라도 중에 뭐가 더 나을까?"',
    priority: 'medium',
    phase: 'short-term',
    status: 'planned',
    difficulty: 3,
    impact: 4,
    details: [
      '2-3개 품종 동시 비교',
      '항목별 비교 (성격, 크기, 비용, 관리난이도)',
      '나의 조건과 매칭 점수',
      '"나에게 더 맞는 건?" 결론 제시',
    ],
    relatedFeatures: ['profile-candidates'],
  },
  {
    id: 'profile-candidates',
    title: '후보 목록 저장',
    description: '마음에 드는 품종 저장/관리',
    userScenario: '"일단 골든 리트리버 저장해두고, 나중에 다시 볼래"',
    priority: 'high',
    phase: 'short-term',
    status: 'planned',
    difficulty: 2,
    impact: 5,
    details: [
      '"나의 후보" 목록에 추가',
      '여러 테스트 결과 통합 관리',
      '프로필에서 모아보기',
      '친구와 후보 공유',
    ],
    relatedFeatures: ['profile-system', 'share'],
  },
  {
    id: 'reality-check',
    title: '현실 체크',
    description: '입양 전 현실적인 조언',
    userScenario: '"정말 골든 리트리버를 키울 수 있을까? 솔직한 얘기가 듣고 싶어"',
    priority: 'medium',
    phase: 'short-term',
    status: 'planned',
    difficulty: 2,
    impact: 4,
    details: [
      '양육 어려운 점 솔직히 안내',
      '"이런 분께는 추천하지 않아요"',
      '대안 품종 제안',
      '입양 전 체크리스트',
    ],
  },

  // === 장기 (Long-term) ===
  {
    id: 'community-connection',
    title: '커뮤니티 연결',
    description: '같은 품종/관심사 사용자와 연결',
    userScenario: '"골든 리트리버 키우는 사람들 얘기가 듣고 싶어"',
    priority: 'medium',
    phase: 'long-term',
    status: 'planned',
    difficulty: 4,
    impact: 5,
    details: [
      '품종별 소그룹/채널',
      '"예비 보호자" vs "현재 보호자" 구분',
      'Q&A: 선배에게 물어보기',
      '일상 공유 (사진, 이야기)',
    ],
    relatedFeatures: ['community-strategy-phase4'],
  },
  {
    id: 'adoption-guide',
    title: '입양/분양 가이드',
    description: '실제 입양 과정 안내',
    userScenario: '"골든 리트리버 어디서 입양하지? 좋은 곳 어떻게 찾아?"',
    priority: 'low',
    phase: 'long-term',
    status: 'planned',
    difficulty: 3,
    impact: 3,
    details: [
      '입양 vs 분양 장단점',
      '좋은 분양처/보호소 찾는 법',
      '주의할 점 (펫샵, 번식장 등)',
      '법적 절차/준비물',
    ],
  },
  {
    id: 'first-week-guide',
    title: '첫 주 가이드',
    description: '입양 후 첫 주 적응 가이드',
    userScenario: '"드디어 골든 리트리버 데려왔는데, 첫 주에 뭘 해야 해?"',
    priority: 'low',
    phase: 'long-term',
    status: 'planned',
    difficulty: 2,
    impact: 4,
    details: [
      'Day 1-7 단계별 가이드',
      '적응 체크리스트',
      '흔한 문제/해결법',
      '응급 상황 대처',
    ],
  },
];

// ============================================================================
// 세부 테스트 카테고리별 연결
// ============================================================================

export const DETAIL_TEST_CATEGORIES: DetailTestCategory[] = [
  {
    id: 'dogBreed',
    name: '강아지 품종',
    icon: '🐕',
    parentTest: 'petMatch',
    resultTypes: [
      '골든 리트리버', '래브라도', '비글', '시바이누', '말티즈',
      '푸들', '진돗개', '웰시코기', '포메라니안', '불독',
      '허스키', '보더콜리'
    ],
    postTestNeeds: ['breed-detail-info', 'care-guide', 'cost-estimate', 'comparison-tool', 'community-connection'],
  },
  {
    id: 'catBreed',
    name: '고양이 품종',
    icon: '🐱',
    parentTest: 'petMatch',
    resultTypes: [
      '러시안블루', '브리티쉬숏헤어', '페르시안', '먼치킨',
      '뱅갈', '스핑크스', '메인쿤', '샴', '랙돌', '코숏'
    ],
    postTestNeeds: ['breed-detail-info', 'care-guide', 'cost-estimate', 'comparison-tool', 'community-connection'],
  },
  {
    id: 'smallPet',
    name: '소동물',
    icon: '🐹',
    parentTest: 'petMatch',
    resultTypes: [
      '햄스터', '기니피그', '친칠라', '데구', '고슴도치', '페럿', '토끼'
    ],
    postTestNeeds: ['breed-detail-info', 'care-guide', 'cost-estimate', 'reality-check'],
  },
  {
    id: 'fishType',
    name: '관상어',
    icon: '🐠',
    parentTest: 'petMatch',
    resultTypes: [
      '베타', '구피', '네온테트라', '금붕어', '코리도라스',
      '플레코', '엔젤피쉬', '디스커스'
    ],
    postTestNeeds: ['breed-detail-info', 'care-guide', 'cost-estimate'],
  },
  {
    id: 'birdType',
    name: '새',
    icon: '🐦',
    parentTest: 'petMatch',
    resultTypes: [
      '사랑앵무', '코카틸', '모란앵무', '잉꼬', '금화조', '십자매'
    ],
    postTestNeeds: ['breed-detail-info', 'care-guide', 'cost-estimate', 'reality-check'],
  },
  {
    id: 'reptileType',
    name: '파충류',
    icon: '🦎',
    parentTest: 'petMatch',
    resultTypes: [
      '레오파드게코', '크레스티드게코', '비어디드래곤',
      '옥수수뱀', '볼파이톤', '붉은귀거북'
    ],
    postTestNeeds: ['breed-detail-info', 'care-guide', 'cost-estimate', 'reality-check'],
  },
];

// ============================================================================
// 커뮤니티 연결 포인트
// ============================================================================

export const COMMUNITY_CONNECTIONS: CommunityConnection[] = [
  {
    id: 'pre-adopter-group',
    name: '예비 보호자 모임',
    description: '입양/분양 전 정보 교환',
    targetAudience: '세부 테스트 완료 후 아직 입양 전인 사용자',
    contentIdeas: [
      '"골든 리트리버 입양 고민 중이에요"',
      '"말티즈 vs 푸들 뭐가 나을까요?"',
      '"고양이 처음인데 뭘 준비해야 할까요?"',
    ],
    moderationNotes: [
      '분양처 홍보/광고 금지',
      '개인 거래 금지',
      '정보 공유 위주로 유도',
    ],
  },
  {
    id: 'breed-owner-group',
    name: '품종별 보호자 모임',
    description: '같은 품종 보호자들의 일상 공유',
    targetAudience: '해당 품종을 이미 키우는 사용자',
    contentIdeas: [
      '일상 사진/영상 공유',
      '품종 특유의 행동/습성 공감',
      '추천 용품/병원 정보',
    ],
    moderationNotes: [
      '다른 품종 비하 금지',
      '의료 정보는 참고용임을 명시',
    ],
  },
  {
    id: 'qna-mentoring',
    name: '선배 보호자 Q&A',
    description: '경험자가 초보자에게 조언',
    targetAudience: '품종 경험자 ↔ 예비/초보 보호자',
    contentIdeas: [
      '"골든 리트리버 3년 키운 사람입니다 AMA"',
      '"첫 강아지 데려온 지 한 달, 궁금한 것 있으면 물어보세요"',
    ],
    moderationNotes: [
      '답변자 신뢰도 표시 (양육 기간 등)',
      '의료/법률 조언은 전문가 상담 권장',
    ],
  },
];

// ============================================================================
// 구현 로드맵
// ============================================================================

export interface RoadmapPhase {
  id: string;
  name: string;
  duration: string;
  items: {
    needId: string;
    description: string;
    deliverables: string[];
  }[];
}

export const IMPLEMENTATION_ROADMAP: RoadmapPhase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1: 기본 정보 제공',
    duration: '2-3주',
    items: [
      {
        needId: 'breed-detail-info',
        description: '품종 상세 정보 카드 추가',
        deliverables: [
          '결과 화면에 "상세 정보 보기" 버튼',
          '품종별 정보 데이터 (성격, 외모, 건강)',
          '모달/페이지로 상세 정보 표시',
        ],
      },
      {
        needId: 'care-guide',
        description: '기본 관리 가이드',
        deliverables: [
          '준비물 체크리스트',
          '기본 관리 팁 3-5개',
        ],
      },
    ],
  },
  {
    id: 'phase-2',
    name: 'Phase 2: 의사결정 지원',
    duration: '3-4주',
    items: [
      {
        needId: 'cost-estimate',
        description: '비용 예상 정보',
        deliverables: [
          '품종별 비용 데이터',
          '비용 breakdown 표시',
        ],
      },
      {
        needId: 'profile-candidates',
        description: '후보 저장 기능',
        deliverables: [
          '결과에서 "후보에 추가" 버튼',
          '프로필 페이지에서 후보 목록 관리',
        ],
      },
      {
        needId: 'comparison-tool',
        description: '품종 비교 기능',
        deliverables: [
          '2-3개 품종 선택',
          '항목별 비교 테이블',
        ],
      },
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3: 커뮤니티 연결',
    duration: '4-6주',
    items: [
      {
        needId: 'community-connection',
        description: '품종별 소그룹',
        deliverables: [
          '품종별 Q&A 게시판',
          '예비 보호자 모임',
          '경험자 멘토링',
        ],
      },
      {
        needId: 'adoption-guide',
        description: '입양 가이드',
        deliverables: [
          '입양 vs 분양 안내',
          '좋은 분양처 찾는 법',
        ],
      },
    ],
  },
];

// ============================================================================
// 핵심 지표
// ============================================================================

export const KEY_METRICS = [
  {
    id: 'detail-info-view',
    name: '상세 정보 조회율',
    description: '세부 테스트 완료 후 상세 정보를 본 비율',
    target: '60%+',
    measurement: '(상세 정보 조회 수 / 세부 테스트 완료 수) × 100',
  },
  {
    id: 'candidate-save',
    name: '후보 저장율',
    description: '결과를 후보 목록에 저장한 비율',
    target: '30%+',
    measurement: '(후보 저장 수 / 세부 테스트 완료 수) × 100',
  },
  {
    id: 'comparison-use',
    name: '비교 기능 사용율',
    description: '품종 비교 기능을 사용한 비율',
    target: '20%+',
    measurement: '(비교 사용 수 / 후보 2개 이상 저장 수) × 100',
  },
  {
    id: 'community-join',
    name: '커뮤니티 진입율',
    description: '세부 테스트 후 커뮤니티로 진입한 비율',
    target: '15%+',
    measurement: '(커뮤니티 진입 수 / 세부 테스트 완료 수) × 100',
  },
];

// ============================================================================
// 통합 Export
// ============================================================================

export const POST_DETAIL_TEST_STRATEGY = {
  journeyFlow: USER_JOURNEY_FLOW,
  userNeeds: USER_NEEDS,
  detailTestCategories: DETAIL_TEST_CATEGORIES,
  communityConnections: COMMUNITY_CONNECTIONS,
  roadmap: IMPLEMENTATION_ROADMAP,
  metrics: KEY_METRICS,
};

export default POST_DETAIL_TEST_STRATEGY;
