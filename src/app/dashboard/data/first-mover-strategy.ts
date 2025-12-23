// ============================================================================
// 선점 효과 전략 (First-Mover Advantage Strategy)
// AI 시대, 앱 복제가 쉬운 환경에서 지속 가능한 경쟁 우위 확보
// ============================================================================

// ============================================================================
// 타입 정의
// ============================================================================

export interface SuccessCaseStudy {
  id: string;
  name: string;
  country: string;
  category: string;
  launchYear: number;
  keyStrategy: string[];
  networkEffectType: 'direct' | 'indirect' | 'data' | 'social';
  switchingCostFactors: string[];
  currentStatus: string;
  lessonsLearned: string[];
  sources?: { title: string; url: string }[];
}

export interface CompetitiveAdvantage {
  id: string;
  name: string;
  description: string;
  importance: 1 | 2 | 3 | 4 | 5;
  difficulty: 1 | 2 | 3 | 4 | 5;
  timeToValue: 'short' | 'medium' | 'long';
  currentStatus: 'not-started' | 'in-progress' | 'partial' | 'complete';
  features: AdvantageFeature[];
  metrics?: string[];
}

export interface AdvantageFeature {
  name: string;
  description: string;
  status: 'planned' | 'in-progress' | 'done';
  linkedService?: string;
}

export interface ViralTrend2025 {
  id: string;
  trend: string;
  description: string;
  examples: string[];
  applicability: 'high' | 'medium' | 'low';
  implementation: string[];
  sources: { title: string; url: string }[];
}

export interface RetentionStrategy {
  id: string;
  name: string;
  description: string;
  targetRetention: string;
  features: string[];
  benchmark: string;
}

export interface ImplementationRoadmap {
  phase: string;
  name: string;
  duration: string;
  focus: string;
  tasks: { name: string; priority: 'critical' | 'high' | 'medium' }[];
  expectedOutcome: string;
}

// ============================================================================
// 성공 사례 연구
// ============================================================================

export const SUCCESS_CASE_STUDIES: SuccessCaseStudy[] = [
  {
    id: 'kakao',
    name: '카카오톡',
    country: '한국',
    category: '메신저',
    launchYear: 2010,
    keyStrategy: [
      '초기 무료 문자 대체 포지셔닝',
      '모바일 주소록 연동으로 빠른 네트워크 형성',
      '이모티콘/선물하기로 플랫폼 확장',
      '카카오페이 등 생태계 락인',
    ],
    networkEffectType: 'direct',
    switchingCostFactors: [
      '친구 목록 (대화 기록)',
      '카카오페이 잔액',
      '구매한 이모티콘',
      '연동된 서비스들 (택시, 뱅크 등)',
    ],
    currentStatus: '한국 메신저 시장 95% 점유',
    lessonsLearned: [
      '먼저 시작해서 네트워크 효과 선점',
      '무료로 시작해서 사용자 확보 후 수익화',
      '생태계 확장으로 전환 비용 극대화',
    ],
  },
  {
    id: 'duolingo',
    name: 'Duolingo',
    country: '미국',
    category: '교육',
    launchYear: 2012,
    keyStrategy: [
      '게이미피케이션 (스트릭, 리그, XP)',
      '일일 알림으로 습관 형성',
      '친구와 경쟁 기능',
      '무료+광고 모델로 진입장벽 낮춤',
    ],
    networkEffectType: 'social',
    switchingCostFactors: [
      '학습 진행 기록 (스트릭 N일)',
      '달성한 레벨과 배지',
      '친구 리그 순위',
      '학습 패턴 데이터',
    ],
    currentStatus: '언어 학습 앱 1위, DAU 2000만+',
    lessonsLearned: [
      '스트릭이 가장 강력한 리텐션 도구',
      '손실 회피 심리 활용 (스트릭 잃기 싫음)',
      '작은 일일 목표로 습관화',
    ],
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    country: '중국/글로벌',
    category: 'SNS',
    launchYear: 2016,
    keyStrategy: [
      '알고리즘 기반 추천 (팔로우 필요 없음)',
      'UGC 바이럴 (틱톡 챌린지)',
      '크리에이터 수익화로 콘텐츠 확보',
      '짧은 영상 = 낮은 제작 장벽',
    ],
    networkEffectType: 'indirect',
    switchingCostFactors: [
      '팔로워/팔로잉 네트워크',
      '알고리즘이 학습한 취향',
      '저장한 영상, 좋아요 기록',
      '크리에이터는 수익 포기 필요',
    ],
    currentStatus: '글로벌 10억+ 사용자',
    lessonsLearned: [
      '개인화 알고리즘이 최고의 락인',
      '크리에이터 확보 = 콘텐츠 확보',
      'UGC 챌린지로 바이럴 유도',
    ],
    sources: [
      {
        title: 'UGC-Driven Growth',
        url: 'https://wezom.com/blog/how-to-make-a-mobile-app-go-viral-in-2025-proven-growth-strategies',
      },
    ],
  },
  {
    id: 'strava',
    name: 'Strava',
    country: '미국',
    category: '피트니스',
    launchYear: 2009,
    keyStrategy: [
      '세그먼트 리더보드 (구간별 순위)',
      '활동 공유 SNS',
      '클럽/챌린지 기능',
      '연간 Wrapped 같은 통계',
    ],
    networkEffectType: 'social',
    switchingCostFactors: [
      '수년간의 운동 기록',
      '세그먼트 기록과 순위',
      '운동 친구 네트워크',
      'Kudos(좋아요) 히스토리',
    ],
    currentStatus: '러닝/사이클 앱 1위, 1억+ 사용자',
    lessonsLearned: [
      '니치 커뮤니티 먼저 장악',
      '경쟁 심리 활용 (리더보드)',
      '데이터 축적 = 전환 비용',
    ],
  },
];

// ============================================================================
// 경쟁 우위 요소 (현재 프로젝트용)
// ============================================================================

export const COMPETITIVE_ADVANTAGES: CompetitiveAdvantage[] = [
  {
    id: 'data-moat',
    name: '데이터 해자 (Data Moat)',
    description:
      '시간이 지날수록 쌓이는 통계 데이터. "한국인 N만명 중 당신은 상위 M%"',
    importance: 5,
    difficulty: 3,
    timeToValue: 'long',
    currentStatus: 'in-progress',
    features: [
      {
        name: '누적 테스트 통계',
        description: '테스트별 결과 분포, 시간대별 트렌드',
        status: 'in-progress',
        linkedService: 'TursoService',
      },
      {
        name: '상대 위치 표시',
        description: '"상위 15%", "평균보다 높음" 등',
        status: 'planned',
      },
      {
        name: '지역/연령별 통계',
        description: '인구통계학적 분석 (선택 입력)',
        status: 'planned',
        linkedService: 'DemographicService',
      },
      {
        name: '시즌별 트렌드',
        description: '월별/분기별 인기 결과 변화',
        status: 'in-progress',
        linkedService: 'RankingService',
      },
    ],
    metrics: ['총 테스트 횟수', '유니크 사용자 수', '평균 테스트/유저'],
  },
  {
    id: 'switching-cost',
    name: '전환 비용 (Switching Cost)',
    description: '사용자가 다른 앱으로 갈 때 "잃는 것"을 만들기',
    importance: 5,
    difficulty: 2,
    timeToValue: 'medium',
    currentStatus: 'partial',
    features: [
      {
        name: '테스트 히스토리',
        description: '완료한 테스트 목록과 결과 기록',
        status: 'done',
        linkedService: 'ResultService',
      },
      {
        name: '배지 컬렉션',
        description: '획득한 배지 (특히 희귀 배지)',
        status: 'done',
        linkedService: 'GamificationService',
      },
      {
        name: '전문가 등급',
        description: '고양이 전문가 Lv.5 같은 진행도',
        status: 'done',
        linkedService: 'GamificationService',
      },
      {
        name: '친구 비교 기록',
        description: '친구와의 케미/비교 히스토리',
        status: 'in-progress',
        linkedService: 'FriendService',
      },
      {
        name: '시즌 랭킹 기록',
        description: '2025년 1분기 투표 3위 등',
        status: 'done',
        linkedService: 'RankingService',
      },
    ],
    metrics: ['평균 테스트 완료 수/유저', '배지 보유 수/유저', '리텐션율'],
  },
  {
    id: 'network-effect',
    name: '네트워크 효과 (Network Effect)',
    description: '친구가 있어야 재밌는 기능. 혼자 떠날 수 없게 만들기',
    importance: 5,
    difficulty: 4,
    timeToValue: 'medium',
    currentStatus: 'partial',
    features: [
      {
        name: '친구 초대',
        description: '초대 코드로 친구 연결, 보상 제공',
        status: 'done',
        linkedService: 'FriendService',
      },
      {
        name: '결과 비교',
        description: '친구와 테스트 결과 비교 ("궁합 78%")',
        status: 'done',
        linkedService: 'FriendService',
      },
      {
        name: '친구 랭킹',
        description: '친구들 중 고양이 지식 1위',
        status: 'planned',
      },
      {
        name: '그룹 테스트',
        description: '모임/가족 단위로 같이 하기',
        status: 'planned',
      },
      {
        name: '카카오 공유',
        description: '결과 공유로 바이럴 유도',
        status: 'done',
        linkedService: 'KakaoShareService',
      },
    ],
    metrics: ['초대 전환율', '친구 연결 수/유저', 'K-factor (바이럴 계수)'],
  },
  {
    id: 'habit-loop',
    name: '습관화 (Habit Loop)',
    description: '매일 들어올 이유 만들기. 스트릭, 일일 콘텐츠',
    importance: 4,
    difficulty: 3,
    timeToValue: 'short',
    currentStatus: 'partial',
    features: [
      {
        name: '출석 스트릭',
        description: '연속 방문 기록, 스트릭 배지',
        status: 'done',
        linkedService: 'GamificationService',
      },
      {
        name: '일일 퀴즈',
        description: '오늘의 퀴즈 1문제',
        status: 'done',
        linkedService: 'ContentParticipationService',
      },
      {
        name: '일일 투표',
        description: '오늘의 논쟁 투표',
        status: 'done',
        linkedService: 'ContentParticipationService',
      },
      {
        name: '시즌 이벤트',
        description: '한정 배지, 특별 테스트',
        status: 'planned',
      },
      {
        name: '스트릭 복구',
        description: '스트릭 잃었을 때 복구 기회',
        status: 'planned',
      },
    ],
    metrics: ['DAU/MAU 비율', '평균 스트릭 일수', '일일 콘텐츠 참여율'],
  },
  {
    id: 'personalization',
    name: '개인화 (Personalization)',
    description: '오래 쓸수록 나를 더 잘 아는 앱',
    importance: 4,
    difficulty: 4,
    timeToValue: 'long',
    currentStatus: 'in-progress',
    features: [
      {
        name: '통합 인사이트',
        description: '여러 테스트 결과 종합 분석',
        status: 'planned',
        // TODO: InsightService 구현 필요
      },
      {
        name: '맞춤 추천',
        description: '성향 기반 다음 테스트 추천',
        status: 'done',
        linkedService: 'NextActionService',
      },
      {
        name: '성향 변화 추적',
        description: '시간에 따른 성격 변화 그래프',
        status: 'planned',
      },
      {
        name: '맞춤 콘텐츠',
        description: '관심 카테고리 기반 퀴즈/투표 추천',
        status: 'planned',
      },
    ],
    metrics: ['추천 클릭률', '세션당 테스트 수', '재방문율'],
  },
];

// ============================================================================
// 2024-2025 바이럴 트렌드
// ============================================================================

export const VIRAL_TRENDS_2025: ViralTrend2025[] = [
  {
    id: 'micro-community',
    trend: '마이크로 커뮤니티 우선',
    description:
      '대규모 확장 전에 작은 커뮤니티(학교, 동호회)에서 네트워크 효과 검증',
    examples: ['틱톡 초기 뮤지컬리', '카카오톡 초기 대학생', 'Slack 게이머 커뮤니티'],
    applicability: 'high',
    implementation: [
      '펫 카페/동호회 타겟팅',
      '특정 반려동물 커뮤니티 집중',
      '지역 기반 그룹 기능',
    ],
    sources: [
      {
        title: 'Key Insights from App Growth Annual 2024',
        url: 'https://www.revenuecat.com/blog/growth/key-insights-from-app-growth-annual-2024/',
      },
    ],
  },
  {
    id: 'ugc-viral',
    trend: 'UGC 기반 바이럴',
    description:
      '사용자가 직접 콘텐츠를 만들고 공유. 틱톡 챌린지, 인스타 필터 형태',
    examples: ['틱톡 해시태그 챌린지', '인스타 AR 필터', 'Spotify Wrapped'],
    applicability: 'high',
    implementation: [
      '결과 이미지 공유 (인스타 스토리용)',
      '친구 태그 챌린지 ("우리 케미 테스트")',
      '"나의 2025 반려동물 성격" 연말 정산',
    ],
    sources: [
      {
        title: 'How to Make a Mobile App Go Viral in 2025',
        url: 'https://wezom.com/blog/how-to-make-a-mobile-app-go-viral-in-2025-proven-growth-strategies',
      },
    ],
  },
  {
    id: 'streak-gamification',
    trend: '스트릭 게이미피케이션',
    description:
      '연속 사용 기록으로 손실 회피 심리 활용. Duolingo가 가장 성공적',
    examples: ['Duolingo 스트릭', 'Snapchat 스트릭', 'GitHub 잔디'],
    applicability: 'high',
    implementation: [
      '일일 퀴즈/투표 스트릭',
      '스트릭 프리즈 아이템 (보상)',
      '친구와 스트릭 경쟁',
    ],
    sources: [
      {
        title: '8 Viral Strategies to Rapidly Grow Your App Users',
        url: 'https://www.imarkinfotech.com/8-viral-strategies-to-rapidly-grow-your-app-users/',
      },
    ],
  },
  {
    id: 'referral-loop',
    trend: '친구 추천 바이럴 루프',
    description:
      '추천한 사람과 추천받은 사람 모두에게 보상. 추천 사용자는 LTV 25% 높음',
    examples: ['Dropbox 용량 보너스', 'Uber 무료 탑승', 'Toss 캐시백'],
    applicability: 'high',
    implementation: [
      '초대시 양쪽 모두 희귀 배지',
      '초대 N명 달성 시 특별 보상',
      '친구 초대 리더보드',
    ],
    sources: [
      {
        title: 'How to Integrate Viral Loops Into Your App',
        url: 'https://yodelmobile.com/how-to-integrate-viral-loops/',
      },
    ],
  },
  {
    id: 'retention-first',
    trend: '리텐션 우선 전략',
    description:
      '신규 획득보다 기존 사용자 유지가 더 중요. 80%가 3일 내 이탈',
    examples: ['앱 온보딩 최적화', '푸시 알림 개인화', '재참여 캠페인'],
    applicability: 'high',
    implementation: [
      '첫 테스트 완료까지 이탈 방지',
      '2번째 테스트 유도 (추천 시스템)',
      '3일 후 리마인더 알림',
    ],
    sources: [
      {
        title: 'App Retention Benchmarks Report 2025',
        url: 'https://www.appsflyer.com/resources/reports/app-retention-benchmarks/',
      },
      {
        title: 'Why Retention Drives Viral Growth',
        url: 'https://andrewchen.com/more-retention-more-viral-growth/',
      },
    ],
  },
];

// ============================================================================
// 리텐션 전략
// ============================================================================

export const RETENTION_STRATEGIES: RetentionStrategy[] = [
  {
    id: 'day1',
    name: 'Day 1 리텐션',
    description: '첫날 재방문. 핵심 가치 전달 성공 여부',
    targetRetention: '40%+',
    features: [
      '첫 테스트 완료 후 다음 테스트 추천',
      '결과 저장 유도 (다시 보기 위해 재방문)',
      '친구와 비교하기 CTA',
    ],
    benchmark: '업계 평균 25-30%',
  },
  {
    id: 'day7',
    name: 'Day 7 리텐션',
    description: '1주일 후 재방문. 습관 형성 시작',
    targetRetention: '20%+',
    features: [
      '스트릭 시스템 소개',
      '새로운 테스트 알림',
      '친구 초대 보상 안내',
    ],
    benchmark: '업계 평균 10-15%',
  },
  {
    id: 'day30',
    name: 'Day 30 리텐션',
    description: '1개월 후 재방문. 장기 사용자 전환',
    targetRetention: '10%+',
    features: [
      '월간 리포트 (이번 달 활동 요약)',
      '시즌 이벤트 참여 유도',
      '배지 컬렉션 진행도 알림',
    ],
    benchmark: '업계 평균 5-8%',
  },
];

// ============================================================================
// 구현 로드맵 (선점 효과 강화)
// ============================================================================

export const IMPLEMENTATION_ROADMAP: ImplementationRoadmap[] = [
  {
    phase: '1',
    name: '데이터 영속성 확보',
    duration: '완료',
    focus: '전환 비용의 기초',
    tasks: [
      { name: 'Turso DB 연동', priority: 'critical' },
      { name: '테스트 결과 서버 저장', priority: 'critical' },
      { name: '배지/레벨 서버 동기화', priority: 'high' },
    ],
    expectedOutcome: '기기 변경해도 데이터 유지',
  },
  {
    phase: '2',
    name: '네트워크 효과 강화',
    duration: '진행중',
    focus: '친구 연결',
    tasks: [
      { name: '친구 초대 보상 강화', priority: 'critical' },
      { name: '결과 비교 UI 개선', priority: 'high' },
      { name: '친구 랭킹 구현', priority: 'medium' },
      { name: '그룹 테스트 기능', priority: 'medium' },
    ],
    expectedOutcome: '친구당 K-factor 1.2 이상',
  },
  {
    phase: '3',
    name: '습관화 시스템',
    duration: '진행중',
    focus: '매일 방문',
    tasks: [
      { name: '일일 콘텐츠 안정화', priority: 'critical' },
      { name: '스트릭 복구 기능', priority: 'high' },
      { name: '푸시 알림 (웹)', priority: 'high' },
      { name: '시즌 이벤트 시스템', priority: 'medium' },
    ],
    expectedOutcome: 'DAU/MAU 20% 이상',
  },
  {
    phase: '4',
    name: '데이터 해자 구축',
    duration: '예정',
    focus: '통계 차별화',
    tasks: [
      { name: '누적 통계 대시보드', priority: 'critical' },
      { name: '"N만명 중 상위 M%" 표시', priority: 'critical' },
      { name: '지역/연령별 분석', priority: 'medium' },
      { name: '시간별 트렌드 분석', priority: 'medium' },
    ],
    expectedOutcome: '경쟁자 추월 불가능한 데이터 축적',
  },
];

// ============================================================================
// 핵심 지표 (KPIs)
// ============================================================================

export const KEY_METRICS = {
  acquisition: {
    name: '사용자 획득',
    metrics: [
      { id: 'new_users', name: '신규 사용자', target: '주간 1000+' },
      { id: 'k_factor', name: 'K-factor (바이럴 계수)', target: '1.0+' },
      { id: 'invite_rate', name: '초대 전환율', target: '15%+' },
    ],
  },
  retention: {
    name: '리텐션',
    metrics: [
      { id: 'd1_retention', name: 'D1 리텐션', target: '40%' },
      { id: 'd7_retention', name: 'D7 리텐션', target: '20%' },
      { id: 'd30_retention', name: 'D30 리텐션', target: '10%' },
    ],
  },
  engagement: {
    name: '참여도',
    metrics: [
      { id: 'dau_mau', name: 'DAU/MAU', target: '20%' },
      { id: 'tests_per_user', name: '테스트 수/유저', target: '3+' },
      { id: 'streak_avg', name: '평균 스트릭', target: '5일+' },
    ],
  },
  moat: {
    name: '경쟁 우위',
    metrics: [
      { id: 'total_tests', name: '누적 테스트 수', target: '100만+' },
      { id: 'friend_connections', name: '친구 연결', target: '유저당 2+' },
      { id: 'badge_collection', name: '배지 보유', target: '유저당 5+' },
    ],
  },
};

// ============================================================================
// 요약: 선점 효과 핵심 원칙
// ============================================================================

export const CORE_PRINCIPLES = [
  {
    id: 'data-first',
    principle: '데이터가 곧 경쟁력',
    description:
      'AI 시대에 누구나 앱을 만들 수 있지만, 축적된 데이터는 복제할 수 없다.',
    action: '모든 사용자 활동을 서버에 기록하고, 통계로 활용',
  },
  {
    id: 'network-before-monetization',
    principle: '수익화보다 네트워크 효과',
    description:
      '사용자 수가 적을 때 수익화하면 성장이 멈춘다. 네트워크 효과 먼저.',
    action: '친구 초대, 공유, 비교 기능에 집중',
  },
  {
    id: 'retention-over-acquisition',
    principle: '획득보다 유지',
    description:
      '80%가 3일 내 이탈. 신규 사용자 100명보다 기존 사용자 10명 유지가 낫다.',
    action: '스트릭, 일일 콘텐츠, 푸시 알림으로 재방문 유도',
  },
  {
    id: 'switching-cost',
    principle: '떠나면 잃는 것',
    description:
      '사용자가 다른 앱으로 갈 때 "잃는 것"이 있어야 락인된다.',
    action: '히스토리, 배지, 친구 연결, 랭킹 기록 축적',
  },
];
