// ============================================================================
// 통계 시스템 설계 (2024-12-22)
// ============================================================================
// 사용자/개발자 통계 페이지 구성 및 데이터 흐름 정의

export type Status = 'done' | 'in_progress' | 'planned' | 'blocked';
export type Priority = 'high' | 'medium' | 'low';

// ============================================================================
// 현재 상태 분석
// ============================================================================

export interface CurrentState {
  component: string;
  location: string;
  dataSource: 'turso' | 'localStorage' | 'both';
  periodFilter: string;
  description: string;
}

export const CURRENT_STATISTICS: CurrentState[] = [
  // 사용자용
  {
    component: 'TodayRanking',
    location: 'src/components/TodayRanking.tsx',
    dataSource: 'turso',
    periodFilter: '전체 누적 (이름과 다름)',
    description: '찬반 투표 TOP 5, 테스트 결과 TOP 5',
  },
  {
    component: 'TodayRankingModal',
    location: 'src/components/TodayRankingModal.tsx',
    dataSource: 'turso',
    periodFilter: '전체 누적',
    description: '확장 랭킹 (TOP 10) + 댓글',
  },
  {
    component: 'MyRankingMini',
    location: 'src/components/MyRankingMini.tsx',
    dataSource: 'localStorage',
    periodFilter: '전체 (내 기록)',
    description: '내 결과의 카테고리별 순위',
  },
  {
    component: 'RankingTab',
    location: 'src/components/RankingTab.tsx',
    dataSource: 'both',
    periodFilter: '전체',
    description: '테스트별 결과 랭킹, 내 순위 강조',
  },
  {
    component: 'ParticipationStats',
    location: 'src/components/ParticipationStats.tsx',
    dataSource: 'localStorage',
    periodFilter: '전체 (내 기록)',
    description: '투표/퀴즈 참여, 배지, 정답률',
  },
  {
    component: 'MyProfile',
    location: 'src/components/MyProfile.tsx',
    dataSource: 'localStorage',
    periodFilter: '전체',
    description: '테스트 히스토리, 카테고리 분포',
  },
  // 대시보드용
  {
    component: 'RankingStats',
    location: 'src/app/dashboard/components/RankingStats.tsx',
    dataSource: 'turso',  // 이제 Turso 사용
    periodFilter: '현재 분기 + 7일',
    description: '시즌별 투표 통계, 인기 카테고리',
  },
  {
    component: 'DemographicsDashboard',
    location: 'src/app/dashboard/components/DemographicsDashboard.tsx',
    dataSource: 'turso',
    periodFilter: '전체 누적',
    description: '연령대/성별 분포, 교차 분석',
  },
];

// ============================================================================
// 문제점 분석
// ============================================================================

export interface Problem {
  id: string;
  category: 'data' | 'ux' | 'feature';
  severity: Priority;
  problem: string;
  impact: string;
  solution: string;
  status: Status;
}

export const PROBLEMS: Problem[] = [
  {
    id: 'ranking-localstorage',
    category: 'data',
    severity: 'high',
    problem: 'RankingService가 localStorage 사용',
    impact: '대시보드에서 개발자 본인 데이터만 보임',
    solution: 'Turso 전환 완료 (2024-12-22)',
    status: 'done',
  },
  {
    id: 'today-not-today',
    category: 'ux',
    severity: 'medium',
    problem: 'TodayRanking이 "오늘"이 아닌 전체 누적',
    impact: '사용자 혼란 (이름과 동작 불일치)',
    solution: '이름 변경 또는 기간 필터 추가',
    status: 'planned',
  },
  {
    id: 'period-filter-missing',
    category: 'feature',
    severity: 'medium',
    problem: '기간 필터 없음 (오늘/주간/월간)',
    impact: '트렌드 파악 어려움',
    solution: '/api/ranking에 date 필터 추가',
    status: 'planned',
  },
  {
    id: 'stats-scattered',
    category: 'ux',
    severity: 'low',
    problem: '통계 컴포넌트 분산',
    impact: '사용자가 원하는 정보 찾기 어려움',
    solution: '통계 페이지 통합 또는 명확한 네비게이션',
    status: 'planned',
  },
  {
    id: 'rarity-missing',
    category: 'feature',
    severity: 'medium',
    problem: '결과 희귀도 표시 없음',
    impact: '사용자 흥미 유발 기회 손실',
    solution: '결과 페이지에 "상위 N%" 표시',
    status: 'planned',
  },
];

// ============================================================================
// 사용자 통계 니즈 분석
// ============================================================================

export interface UserNeed {
  id: string;
  question: string;
  currentAnswer: string;
  idealAnswer: string;
  priority: Priority;
}

export const USER_NEEDS: UserNeed[] = [
  {
    id: 'result-rarity',
    question: '내 결과가 얼마나 희귀해?',
    currentAnswer: 'MyRankingMini (부분적)',
    idealAnswer: '결과 페이지에 "전체 N% 중 상위 X%" 표시',
    priority: 'high',
  },
  {
    id: 'popular-tests',
    question: '요즘 인기 테스트는?',
    currentAnswer: 'TodayRanking (투표만)',
    idealAnswer: '인기 테스트 순위 + 참여자 수',
    priority: 'high',
  },
  {
    id: 'age-comparison',
    question: '비슷한 사람들은 뭐 나왔어?',
    currentAnswer: '없음',
    idealAnswer: '연령/성별별 TOP 5 + 내 위치',
    priority: 'medium',
  },
  {
    id: 'my-history',
    question: '내 전체 활동 현황은?',
    currentAnswer: 'MyProfile (분산)',
    idealAnswer: '마이페이지 통계 탭에 통합',
    priority: 'medium',
  },
  {
    id: 'trend',
    question: '이번 주/월 트렌드는?',
    currentAnswer: '없음',
    idealAnswer: '주간/월간 인기 결과 변동',
    priority: 'low',
  },
];

// ============================================================================
// 개발자 대시보드 니즈
// ============================================================================

export interface DeveloperNeed {
  id: string;
  metric: string;
  currentAnswer: string;
  idealAnswer: string;
  priority: Priority;
}

export const DEVELOPER_NEEDS: DeveloperNeed[] = [
  {
    id: 'total-users',
    metric: '전체 사용자 통계',
    currentAnswer: 'RankingStats (Turso 전환 완료)',
    idealAnswer: '일별/주별 사용자 증가 추이',
    priority: 'high',
  },
  {
    id: 'test-completion',
    metric: '테스트별 완료율',
    currentAnswer: '없음',
    idealAnswer: '시작→완료 비율, 이탈 지점',
    priority: 'high',
  },
  {
    id: 'daily-trend',
    metric: '일별 추이',
    currentAnswer: '7일만',
    idealAnswer: '30일 + 비교 (전주 대비)',
    priority: 'medium',
  },
  {
    id: 'demographic-insights',
    metric: '연령/성별 인사이트',
    currentAnswer: 'DemographicsDashboard ✅',
    idealAnswer: '연령대별 선호 테스트, 결과 분포',
    priority: 'medium',
  },
  {
    id: 'funnel',
    metric: '퍼널 분석',
    currentAnswer: '없음',
    idealAnswer: '방문→테스트시작→완료→공유 퍼널',
    priority: 'medium',
  },
];

// ============================================================================
// 개선 계획
// ============================================================================

export interface ImprovementPlan {
  id: string;
  title: string;
  description: string;
  target: 'user' | 'developer' | 'both';
  priority: Priority;
  effort: 'low' | 'medium' | 'high';
  dependencies: string[];
  status: Status;
}

export const IMPROVEMENT_PLANS: ImprovementPlan[] = [
  // Phase 1: 즉시
  {
    id: 'ranking-turso',
    title: 'RankingService Turso 전환',
    description: '랭킹 투표 데이터를 서버에 저장, 기기 간 공유 가능',
    target: 'both',
    priority: 'high',
    effort: 'medium',
    dependencies: [],
    status: 'done',
  },
  {
    id: 'dashboard-stats-tab',
    title: '대시보드 통계 탭 정리',
    description: '분산된 통계 컴포넌트 통합, 기간 필터 추가',
    target: 'developer',
    priority: 'high',
    effort: 'medium',
    dependencies: ['ranking-turso'],
    status: 'in_progress',
  },
  // Phase 2: 사용자 통계 개선
  {
    id: 'result-rarity',
    title: '결과 희귀도 표시',
    description: '결과 페이지에 "상위 N%" 뱃지',
    target: 'user',
    priority: 'high',
    effort: 'low',
    dependencies: [],
    status: 'planned',
  },
  {
    id: 'age-comparison',
    title: '연령/성별별 비교',
    description: '"20대 남성 중 상위 15%" 같은 인사이트',
    target: 'user',
    priority: 'medium',
    effort: 'medium',
    dependencies: [],
    status: 'planned',
  },
  {
    id: 'my-stats-integration',
    title: '마이페이지 통계 탭 강화',
    description: '분산된 내 활동 데이터 통합 뷰',
    target: 'user',
    priority: 'medium',
    effort: 'medium',
    dependencies: [],
    status: 'planned',
  },
  // Phase 3: 비즈니스 인사이트
  {
    id: 'test-completion-rate',
    title: '테스트 완료율 대시보드',
    description: '테스트별 시작→완료 비율, 이탈 분석',
    target: 'developer',
    priority: 'high',
    effort: 'medium',
    dependencies: [],
    status: 'planned',
  },
  {
    id: 'daily-weekly-trend',
    title: '일별/주별 추이 차트',
    description: '30일 트렌드, 전주 대비 증감',
    target: 'developer',
    priority: 'medium',
    effort: 'medium',
    dependencies: [],
    status: 'planned',
  },
  {
    id: 'funnel-analysis',
    title: '퍼널 분석 (시작→완료→공유)',
    description: '단계별 전환율 시각화',
    target: 'developer',
    priority: 'medium',
    effort: 'high',
    dependencies: [],
    status: 'planned',
  },
];

// ============================================================================
// 데이터 흐름 설계
// ============================================================================

export interface DataFlow {
  name: string;
  source: string;
  storage: string;
  api: string;
  consumer: string;
}

export const DATA_FLOWS: DataFlow[] = [
  {
    name: '찬반 투표',
    source: 'VS_POLLS 클릭',
    storage: 'Turso poll_responses',
    api: '/api/poll',
    consumer: 'TodayRanking, TodayRankingModal',
  },
  {
    name: '퀴즈 응답',
    source: '퀴즈 정답 선택',
    storage: 'Turso quiz_responses',
    api: '/api/quiz',
    consumer: 'ParticipationStats',
  },
  {
    name: '테스트 결과',
    source: '테스트 완료',
    storage: 'Turso test_results + localStorage',
    api: '/api/ranking?type=results',
    consumer: 'TodayRanking, RankingTab',
  },
  {
    name: '랭킹 투표',
    source: '결과 대결 투표',
    storage: 'Turso ranking_votes',
    api: '/api/ranking-votes',
    consumer: 'RankingStats (대시보드)',
  },
  {
    name: '게이미피케이션',
    source: '모든 활동',
    storage: 'localStorage (GamificationService)',
    api: '없음 (클라이언트)',
    consumer: 'ParticipationStats, MyProfile',
  },
  {
    name: '인구통계',
    source: '보너스 질문',
    storage: 'Turso user_demographics',
    api: '/api/demographic',
    consumer: 'DemographicsDashboard, /api/ranking 필터',
  },
];

// ============================================================================
// 랭킹 페이지 설계 (신규)
// ============================================================================

export interface RankingPageSection {
  id: string;
  title: string;
  description: string;
  dataSource: string;
  features: string[];
  priority: Priority;
}

export const RANKING_PAGE_DESIGN: RankingPageSection[] = [
  {
    id: 'popular-tests',
    title: '인기 테스트',
    description: '테스트별 참여자 수 순위',
    dataSource: '/api/ranking?type=popular-tests',
    features: [
      '전체 인기순',
      '연령/성별별 인기순',
      '이번 주 급상승',
    ],
    priority: 'high',
  },
  {
    id: 'result-rankings',
    title: '결과 랭킹',
    description: '테스트별 결과 TOP 10',
    dataSource: '/api/ranking?type=results',
    features: [
      '테스트 선택 드롭다운',
      '연령/성별 필터',
      '내 결과 강조',
    ],
    priority: 'high',
  },
  {
    id: 'poll-rankings',
    title: '투표 랭킹',
    description: 'VS 투표 인기순',
    dataSource: '/api/poll (stats)',
    features: [
      '참여자 많은 순',
      '접전 중인 투표',
      '카테고리 필터',
    ],
    priority: 'medium',
  },
  {
    id: 'my-ranking',
    title: '내 순위',
    description: '내 결과들의 순위',
    dataSource: 'localStorage + API',
    features: [
      '테스트별 내 순위',
      '전체 중 상위 N%',
      '연령대별 비교',
    ],
    priority: 'high',
  },
];

// ============================================================================
// API 엔드포인트 현황
// ============================================================================

export interface APIEndpoint {
  path: string;
  method: string;
  purpose: string;
  parameters: string[];
  status: Status;
}

export const API_ENDPOINTS: APIEndpoint[] = [
  {
    path: '/api/ranking?type=results',
    method: 'GET',
    purpose: '테스트 결과 랭킹',
    parameters: ['testType', 'ageGroup', 'gender', 'limit'],
    status: 'done',
  },
  {
    path: '/api/ranking?type=by-age',
    method: 'GET',
    purpose: '연령대별 TOP 비교',
    parameters: ['testType (필수)'],
    status: 'done',
  },
  {
    path: '/api/ranking?type=popular-tests',
    method: 'GET',
    purpose: '테스트별 인기순',
    parameters: ['ageGroup', 'gender', 'limit'],
    status: 'done',
  },
  {
    path: '/api/ranking-votes',
    method: 'POST',
    purpose: '랭킹 투표 저장',
    parameters: ['deviceId', 'categoryId', 'resultKey', 'testType', 'seasonId'],
    status: 'done',
  },
  {
    path: '/api/ranking-votes?type=stats',
    method: 'GET',
    purpose: '랭킹 통계',
    parameters: ['seasonId'],
    status: 'done',
  },
  {
    path: '/api/ranking-votes?type=seasons',
    method: 'GET',
    purpose: '시즌 목록',
    parameters: [],
    status: 'done',
  },
  {
    path: '/api/demographic',
    method: 'GET',
    purpose: '인구통계 현황',
    parameters: [],
    status: 'done',
  },
  {
    path: '/api/poll',
    method: 'GET',
    purpose: '투표 통계',
    parameters: ['pollId'],
    status: 'done',
  },
];

// ============================================================================
// 통합 Export
// ============================================================================

export const STATISTICS_SYSTEM = {
  currentState: CURRENT_STATISTICS,
  problems: PROBLEMS,
  userNeeds: USER_NEEDS,
  developerNeeds: DEVELOPER_NEEDS,
  improvements: IMPROVEMENT_PLANS,
  dataFlows: DATA_FLOWS,
  rankingPageDesign: RANKING_PAGE_DESIGN,
  apiEndpoints: API_ENDPOINTS,
};

export default STATISTICS_SYSTEM;
