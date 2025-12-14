// ============================================================================
// 소셜 기능 통합 전략
// 세부 테스트 후 → 커뮤니티 진입까지의 소셜 기능 로드맵
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type SocialFeaturePhase = 'share' | 'compare' | 'discover' | 'connect' | 'community';

export interface SocialFeature {
  id: string;
  name: string;
  description: string;
  phase: SocialFeaturePhase;
  userScenario: string;
  priority: 'high' | 'medium' | 'low';
  status: 'planned' | 'in-progress' | 'done';
  difficulty: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  requirements: string[];
  metrics: string[];
}

export interface SocialPhase {
  id: SocialFeaturePhase;
  name: string;
  emoji: string;
  description: string;
  color: string;
  keyQuestion: string;
  features: string[]; // Feature IDs
}

// ============================================================================
// 소셜 기능 단계 정의
// ============================================================================

export const SOCIAL_PHASES: SocialPhase[] = [
  {
    id: 'share',
    name: '공유하기',
    emoji: '📤',
    description: '내 결과를 친구에게 공유',
    color: '#7aa2ff',
    keyQuestion: '"이거 나온 거 봐!" → 친구가 클릭하게 만들기',
    features: ['share-card', 'kakao-share', 'instagram-story', 'link-copy'],
  },
  {
    id: 'compare',
    name: '비교하기',
    emoji: '🔄',
    description: '친구와 결과 비교',
    color: '#ff6b9d',
    keyQuestion: '"우리 둘 궁합이 어떨까?" → 비교 결과 보여주기',
    features: ['link-compare', 'compatibility-score', 'compare-card'],
  },
  {
    id: 'discover',
    name: '발견하기',
    emoji: '🔍',
    description: '다른 사람들의 결과/의견 보기',
    color: '#55e6c1',
    keyQuestion: '"다른 사람들은 어떻게 생각할까?" → 통계/투표 보여주기',
    features: ['result-stats', 'poll-results', 'trend-report', 'segment-compare'],
  },
  {
    id: 'connect',
    name: '연결하기',
    emoji: '🤝',
    description: '같은 결과/관심사 사람들과 연결',
    color: '#ffd166',
    keyQuestion: '"나 같은 사람들은 누구지?" → 그룹/채널 안내',
    features: ['same-result-group', 'interest-group', 'mentoring-match'],
  },
  {
    id: 'community',
    name: '커뮤니티',
    emoji: '🏠',
    description: '지속적인 교류의 장',
    color: '#a29bfe',
    keyQuestion: '"여기서 계속 이야기하고 싶어" → 정착 유도',
    features: ['qna-board', 'daily-content', 'user-content', 'events'],
  },
];

// ============================================================================
// 소셜 기능 상세
// ============================================================================

export const SOCIAL_FEATURES: SocialFeature[] = [
  // === Phase 1: 공유하기 ===
  {
    id: 'share-card',
    name: 'SNS 공유 카드',
    description: '결과를 예쁜 이미지로 자동 생성',
    phase: 'share',
    userScenario: '"이 결과 친구한테 보여주고 싶어!"',
    priority: 'high',
    status: 'planned',
    difficulty: 2,
    impact: 5,
    requirements: [
      '결과 한 줄 요약',
      '공유 시 "비교하러 가기" 링크 포함',
      '채널별 최적 사이즈 (카카오/인스타/틱톡)',
    ],
    metrics: ['공유율', '공유→유입 전환율'],
  },
  {
    id: 'kakao-share',
    name: '카카오톡 공유',
    description: '원클릭 카카오톡 공유',
    phase: 'share',
    userScenario: '"카톡으로 바로 보내고 싶어"',
    priority: 'high',
    status: 'planned',
    difficulty: 1,
    impact: 5,
    requirements: [
      '카카오 SDK 연동',
      '커스텀 템플릿 메시지',
      '친구 초대 버튼',
    ],
    metrics: ['카카오 공유 수', '카카오→유입 전환율'],
  },
  {
    id: 'instagram-story',
    name: '인스타그램 스토리',
    description: '인스타 스토리용 이미지',
    phase: 'share',
    userScenario: '"인스타 스토리에 올리고 싶어"',
    priority: 'medium',
    status: 'planned',
    difficulty: 2,
    impact: 4,
    requirements: [
      '1080x1920 세로 이미지',
      '스와이프 업 유도 텍스트',
      '브랜드 워터마크',
    ],
    metrics: ['인스타 공유 수'],
  },
  {
    id: 'link-copy',
    name: '링크 복사',
    description: '공유 링크 원클릭 복사',
    phase: 'share',
    userScenario: '"링크 복사해서 어디든 보내고 싶어"',
    priority: 'high',
    status: 'planned',
    difficulty: 1,
    impact: 3,
    requirements: [
      '단축 URL (또는 UTM 파라미터)',
      '복사 완료 피드백',
      '리퍼럴 추적',
    ],
    metrics: ['링크 복사 수', '링크→유입 전환율'],
  },

  // === Phase 2: 비교하기 ===
  {
    id: 'link-compare',
    name: '링크 기반 비교',
    description: '링크 열기 → 1분 테스트 → 자동 비교',
    phase: 'compare',
    userScenario: '"친구 링크 열었는데 바로 비교됐어!"',
    priority: 'high',
    status: 'planned',
    difficulty: 3,
    impact: 5,
    requirements: [
      '익명 세션으로 테스트 완료',
      '로그인 없이 비교 가능',
      '나중에 계정 연결 옵션',
    ],
    metrics: ['비교 완료율', '비교→계정연결 전환율'],
  },
  {
    id: 'compatibility-score',
    name: '궁합 점수',
    description: '0-100% 궁합 점수 + 근거',
    phase: 'compare',
    userScenario: '"우리 궁합이 몇 퍼센트야?"',
    priority: 'high',
    status: 'planned',
    difficulty: 3,
    impact: 5,
    requirements: [
      '점수 산출 로직',
      '3개 이상 근거 카드',
      '관계 타입별 해석 (커플/친구/동료)',
    ],
    metrics: ['궁합 조회 수', '궁합 결과 공유율'],
  },
  {
    id: 'compare-card',
    name: '비교 결과 카드',
    description: '두 사람 비교 결과 공유용 이미지',
    phase: 'compare',
    userScenario: '"비교 결과도 공유하고 싶어!"',
    priority: 'medium',
    status: 'planned',
    difficulty: 2,
    impact: 4,
    requirements: [
      '두 결과 나란히 표시',
      '궁합 점수 + 핵심 포인트',
      '다른 친구 초대 유도',
    ],
    metrics: ['비교 카드 공유율'],
  },

  // === Phase 3: 발견하기 ===
  {
    id: 'result-stats',
    name: '결과 통계',
    description: '전체 중 내 결과 비율',
    phase: 'discover',
    userScenario: '"이 결과 나온 사람이 몇 퍼센트야?"',
    priority: 'high',
    status: 'planned',
    difficulty: 2,
    impact: 4,
    requirements: [
      '결과별 비율 표시',
      '실시간 업데이트 (또는 주기적)',
      '"희귀도" 표시로 재미 요소',
    ],
    metrics: ['통계 조회율'],
  },
  {
    id: 'poll-results',
    name: '투표 결과',
    description: '다른 사람들의 선택 보기',
    phase: 'discover',
    userScenario: '"다른 사람들은 뭘 선택했지?"',
    priority: 'high',
    status: 'planned',
    difficulty: 2,
    impact: 4,
    requirements: [
      '투표 후 결과 공개',
      '성격 유형별 세그먼트',
      '"나와 같은 결과 사람들은?" 필터',
    ],
    metrics: ['투표 참여율', '투표 후 재방문율'],
  },
  {
    id: 'trend-report',
    name: '트렌드 리포트',
    description: '주간/월간 인기 결과/투표',
    phase: 'discover',
    userScenario: '"요즘 뭐가 인기야?"',
    priority: 'medium',
    status: 'planned',
    difficulty: 2,
    impact: 3,
    requirements: [
      '주간 핫 토픽 TOP 5',
      '월간 결과 트렌드',
      '시즌별 패턴',
    ],
    metrics: ['리포트 조회율', '리포트 공유율'],
  },
  {
    id: 'segment-compare',
    name: '유형별 비교',
    description: '다른 유형과 응답 비교',
    phase: 'discover',
    userScenario: '"ENFP는 다르게 생각할까?"',
    priority: 'medium',
    status: 'planned',
    difficulty: 3,
    impact: 4,
    requirements: [
      '유형별 응답 분포',
      '내 유형 vs 다른 유형 비교',
      '차이점 하이라이트',
    ],
    metrics: ['세그먼트 비교 사용율'],
  },

  // === Phase 4: 연결하기 ===
  {
    id: 'same-result-group',
    name: '같은 결과 그룹',
    description: '같은 결과 받은 사람들 모임',
    phase: 'connect',
    userScenario: '"나 같은 결과 받은 사람들 얘기 듣고 싶어"',
    priority: 'medium',
    status: 'planned',
    difficulty: 3,
    impact: 4,
    requirements: [
      '결과별 채널/스레드',
      '자동 초대 (테스트 완료 시)',
      '익명 참여 가능',
    ],
    metrics: ['그룹 진입율', '그룹 내 활동율'],
  },
  {
    id: 'interest-group',
    name: '관심사 그룹',
    description: '품종/테마별 관심사 모임',
    phase: 'connect',
    userScenario: '"골든 리트리버 관심 있는 사람들끼리 모이고 싶어"',
    priority: 'medium',
    status: 'planned',
    difficulty: 3,
    impact: 4,
    requirements: [
      '품종/카테고리별 그룹',
      '"예비 보호자" vs "현재 보호자" 구분',
      '경험자 표시',
    ],
    metrics: ['관심사 그룹 가입율'],
  },
  {
    id: 'mentoring-match',
    name: '멘토링 매칭',
    description: '경험자 ↔ 초보자 연결',
    phase: 'connect',
    userScenario: '"골든 리트리버 키워본 사람한테 물어보고 싶어"',
    priority: 'low',
    status: 'planned',
    difficulty: 4,
    impact: 5,
    requirements: [
      '경험자 풀 확보',
      '매칭 알고리즘',
      '리워드/인센티브',
    ],
    metrics: ['멘토링 요청 수', '매칭 성사율'],
  },

  // === Phase 5: 커뮤니티 ===
  {
    id: 'qna-board',
    name: 'Q&A 게시판',
    description: '질문/답변 커뮤니티',
    phase: 'community',
    userScenario: '"궁금한 거 물어볼 곳이 필요해"',
    priority: 'medium',
    status: 'planned',
    difficulty: 4,
    impact: 5,
    requirements: [
      '카테고리별 게시판',
      '답변자 신뢰도 (경험 표시)',
      '베스트 답변 채택',
    ],
    metrics: ['질문 수', '답변율', 'DAU'],
  },
  {
    id: 'daily-content',
    name: '데일리 콘텐츠',
    description: '매일 새로운 퀴즈/투표',
    phase: 'community',
    userScenario: '"매일 할 거 있으면 좋겠다"',
    priority: 'high',
    status: 'planned',
    difficulty: 2,
    impact: 5,
    requirements: [
      '오늘의 퀴즈 3문제',
      '오늘의 투표 1개',
      '스트릭 연동',
    ],
    metrics: ['일일 참여율', 'D1/D7 리텐션'],
  },
  {
    id: 'user-content',
    name: '유저 생성 콘텐츠',
    description: '사용자가 만든 퀴즈/투표',
    phase: 'community',
    userScenario: '"내가 만든 퀴즈 올리고 싶어"',
    priority: 'low',
    status: 'planned',
    difficulty: 4,
    impact: 4,
    requirements: [
      '콘텐츠 생성 도구',
      '모더레이션/검수',
      '인기 콘텐츠 보상',
    ],
    metrics: ['UGC 생성 수', 'UGC 참여율'],
  },
  {
    id: 'events',
    name: '이벤트/챌린지',
    description: '기간 한정 이벤트',
    phase: 'community',
    userScenario: '"이벤트 있으면 더 재밌을 것 같아"',
    priority: 'low',
    status: 'planned',
    difficulty: 3,
    impact: 4,
    requirements: [
      '시즌 이벤트 (명절, 기념일)',
      '챌린지 (7일 연속 참여 등)',
      '한정 보상/뱃지',
    ],
    metrics: ['이벤트 참여율', '이벤트 기간 리텐션'],
  },
];

// ============================================================================
// "다른 사람들 상황 살피기" 관련 기능
// ============================================================================

export const OBSERVE_OTHERS_FEATURES = {
  title: '다른 사람들 상황 살피기',
  description: '사용자가 다른 사람들의 선택/결과/의견을 참고할 수 있는 기능',
  scenarios: [
    {
      id: 'before-test',
      name: '테스트 전',
      question: '"다른 사람들도 이 테스트 해봤나?"',
      features: ['테스트별 참여자 수', '인기 테스트 순위', '친구가 한 테스트 표시'],
    },
    {
      id: 'during-test',
      name: '테스트 중',
      question: '"다른 사람들은 뭘 선택하지?"',
      features: ['실시간 선택 비율 (옵션)', '이전 질문 통계 보기'],
    },
    {
      id: 'after-test',
      name: '테스트 후',
      question: '"내 결과 받은 사람이 얼마나 될까?"',
      features: ['결과 희귀도', '결과별 비율', '같은 결과 사용자 수'],
    },
    {
      id: 'detail-test-after',
      name: '세부 테스트 후',
      question: '"골든 리트리버 추천받은 사람들은 어떻게 생각해?"',
      features: ['품종별 Q&A', '예비 보호자 모임', '선배 보호자 조언'],
    },
    {
      id: 'general',
      name: '일반 탐색',
      question: '"요즘 뭐가 인기야? 다른 사람들은 뭘 하지?"',
      features: ['인기 투표', '트렌드 리포트', '활발한 토론'],
    },
  ],
};

// ============================================================================
// 구현 우선순위 (소셜 기능 관점)
// ============================================================================

export const SOCIAL_IMPLEMENTATION_PRIORITY = [
  {
    phase: 1,
    name: '공유 기반 바이럴',
    duration: '1-2개월',
    focus: '테스트 완료 → 공유 → 친구 유입 루프',
    features: ['share-card', 'kakao-share', 'link-copy', 'result-stats'],
    kpi: '공유율 20%+, 공유→유입 전환 10%+',
  },
  {
    phase: 2,
    name: '비교 기반 관계',
    duration: '2-3개월',
    focus: '친구와 비교 → 재공유 → 바이럴 강화',
    features: ['link-compare', 'compatibility-score', 'compare-card', 'poll-results'],
    kpi: '비교 완료율 30%+, 비교 결과 공유율 15%+',
  },
  {
    phase: 3,
    name: '발견 기반 탐색',
    duration: '2-3개월',
    focus: '다른 사람들 의견 → 호기심 → 재방문',
    features: ['trend-report', 'segment-compare', 'daily-content'],
    kpi: 'D7 리텐션 15%+, 일일 콘텐츠 참여율 30%+',
  },
  {
    phase: 4,
    name: '연결 기반 커뮤니티',
    duration: '3-4개월',
    focus: '같은 관심사 연결 → 정착 → 충성 사용자',
    features: ['same-result-group', 'interest-group', 'qna-board'],
    kpi: '커뮤니티 진입율 10%+, MAU 리텐션 20%+',
  },
];

// ============================================================================
// 핵심 지표 (소셜)
// ============================================================================

export const SOCIAL_METRICS = [
  {
    category: '공유',
    metrics: [
      { id: 'share-rate', name: '공유율', target: '20%+', formula: '공유 수 / 테스트 완료 수' },
      { id: 'share-to-visit', name: '공유→유입', target: '10%+', formula: '유입 수 / 공유 링크 클릭 수' },
      { id: 'viral-coefficient', name: 'K-factor', target: '1.0+', formula: '신규 가입 / 초대 수' },
    ],
  },
  {
    category: '비교',
    metrics: [
      { id: 'compare-rate', name: '비교 완료율', target: '30%+', formula: '비교 완료 수 / 비교 시작 수' },
      { id: 'compare-share', name: '비교 공유율', target: '15%+', formula: '비교 결과 공유 수 / 비교 완료 수' },
    ],
  },
  {
    category: '참여',
    metrics: [
      { id: 'poll-rate', name: '투표 참여율', target: '40%+', formula: '투표 참여 수 / 노출 수' },
      { id: 'daily-rate', name: '일일 콘텐츠 참여율', target: '30%+', formula: '일일 참여 수 / DAU' },
    ],
  },
  {
    category: '커뮤니티',
    metrics: [
      { id: 'community-entry', name: '커뮤니티 진입율', target: '10%+', formula: '커뮤니티 방문 수 / 테스트 완료 수' },
      { id: 'community-retention', name: '커뮤니티 리텐션', target: '20%+', formula: 'MAU / 총 가입자' },
    ],
  },
];

// ============================================================================
// 통합 Export
// ============================================================================

export const SOCIAL_FEATURES_STRATEGY = {
  phases: SOCIAL_PHASES,
  features: SOCIAL_FEATURES,
  observeOthers: OBSERVE_OTHERS_FEATURES,
  implementationPriority: SOCIAL_IMPLEMENTATION_PRIORITY,
  metrics: SOCIAL_METRICS,
};

export default SOCIAL_FEATURES_STRATEGY;
