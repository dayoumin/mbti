// ============================================================================
// 분석/추적 시스템 데이터
// ============================================================================

export type TaskStatus = 'done' | 'in_progress' | 'planned' | 'blocked';
export type Priority = 'high' | 'medium' | 'low';

// ============================================================================
// 추적 이벤트 정의
// ============================================================================

export interface TrackingEvent {
  id: string;
  name: string;
  type: string;
  description: string;
  implemented: boolean;
  priority: Priority;
  metrics: string[];
}

export const TRACKING_EVENTS: TrackingEvent[] = [
  // 테스트 관련
  {
    id: 'test_start',
    name: '테스트 시작',
    type: 'test',
    description: '사용자가 테스트를 시작할 때',
    implemented: true,
    priority: 'high',
    metrics: ['시작율', '테스트별 시작 분포'],
  },
  {
    id: 'test_complete',
    name: '테스트 완료',
    type: 'test',
    description: '사용자가 테스트를 끝까지 완료할 때',
    implemented: true,
    priority: 'high',
    metrics: ['완료율', '이탈 지점', '평균 소요 시간'],
  },
  {
    id: 'test_abandon',
    name: '테스트 이탈',
    type: 'test',
    description: '테스트 중간에 이탈할 때',
    implemented: false,
    priority: 'medium',
    metrics: ['이탈율', '이탈 질문 번호', '이탈 패턴'],
  },
  // 추천 시스템
  {
    id: 'recommendation_view',
    name: '추천 노출',
    type: 'next_action',
    description: '추천 카드가 화면에 표시될 때',
    implemented: true,
    priority: 'high',
    metrics: ['노출수', '위치별 노출 분포'],
  },
  {
    id: 'recommendation_click',
    name: '추천 클릭',
    type: 'next_action',
    description: '추천 카드를 클릭할 때',
    implemented: true,
    priority: 'high',
    metrics: ['CTR', '위치별 클릭율', '추천 타입별 전환율'],
  },
  // 콘텐츠
  {
    id: 'quiz_start',
    name: '퀴즈 시작',
    type: 'content',
    description: '퀴즈를 시작할 때',
    implemented: true,
    priority: 'medium',
    metrics: ['퀴즈 참여율', '인기 퀴즈'],
  },
  {
    id: 'quiz_complete',
    name: '퀴즈 완료',
    type: 'content',
    description: '퀴즈 정답 확인할 때',
    implemented: true,
    priority: 'medium',
    metrics: ['퀴즈 완료율', '정답률'],
  },
  {
    id: 'poll_vote',
    name: '투표 참여',
    type: 'content',
    description: 'VS 투표에 참여할 때',
    implemented: true,
    priority: 'high',
    metrics: ['투표 참여율', '인기 투표', '재투표율'],
  },
  // 공유
  {
    id: 'share_click',
    name: '공유 클릭',
    type: 'share',
    description: '공유 버튼 클릭할 때',
    implemented: true,
    priority: 'high',
    metrics: ['공유율', '플랫폼별 공유', 'K-factor'],
  },
  {
    id: 'share_complete',
    name: '공유 완료',
    type: 'share',
    description: '실제 공유가 완료되었을 때',
    implemented: false,
    priority: 'medium',
    metrics: ['공유 완료율', '유입 추적'],
  },
  // 유입
  {
    id: 'referral_visit',
    name: '공유 유입',
    type: 'acquisition',
    description: '공유 링크로 방문할 때',
    implemented: false,
    priority: 'high',
    metrics: ['유입 경로', 'UTM별 전환율'],
  },
];

// ============================================================================
// 핵심 지표 (KPIs)
// ============================================================================

export interface KPI {
  id: string;
  name: string;
  description: string;
  formula: string;
  target: string;
  category: 'acquisition' | 'engagement' | 'retention' | 'viral';
  implemented: boolean;
}

export const KPIS: KPI[] = [
  // Acquisition
  {
    id: 'daily_visitors',
    name: '일일 방문자',
    description: '하루 동안 방문한 순 사용자 수',
    formula: 'COUNT(DISTINCT device_id) WHERE date = today',
    target: '1,000명/일',
    category: 'acquisition',
    implemented: false,
  },
  {
    id: 'traffic_source',
    name: '유입 경로',
    description: 'UTM 파라미터 기반 유입 분석',
    formula: 'GROUP BY utm_source, utm_medium',
    target: '공유 유입 30%+',
    category: 'acquisition',
    implemented: false,
  },
  // Engagement
  {
    id: 'test_completion_rate',
    name: '테스트 완료율',
    description: '시작한 테스트를 끝까지 완료하는 비율',
    formula: 'test_complete / test_start * 100',
    target: '70%+',
    category: 'engagement',
    implemented: true,
  },
  {
    id: 'recommendation_ctr',
    name: '추천 CTR',
    description: '추천 카드 클릭률',
    formula: 'recommendation_click / recommendation_view * 100',
    target: '15%+',
    category: 'engagement',
    implemented: true,
  },
  {
    id: 'avg_tests_per_user',
    name: '사용자당 테스트 수',
    description: '한 사용자가 완료한 평균 테스트 수',
    formula: 'COUNT(test_complete) / COUNT(DISTINCT device_id)',
    target: '2.5개+',
    category: 'engagement',
    implemented: false,
  },
  {
    id: 'poll_participation',
    name: '투표 참여율',
    description: '방문자 대비 투표 참여 비율',
    formula: 'poll_vote / page_view * 100',
    target: '20%+',
    category: 'engagement',
    implemented: true,
  },
  // Retention
  {
    id: 'return_rate_7d',
    name: '7일 재방문율',
    description: '7일 내 재방문 비율',
    formula: 'returning_users / total_users * 100',
    target: '20%+',
    category: 'retention',
    implemented: false,
  },
  {
    id: 'session_duration',
    name: '평균 세션 시간',
    description: '한 방문당 평균 체류 시간',
    formula: 'SUM(session_end - session_start) / session_count',
    target: '5분+',
    category: 'retention',
    implemented: false,
  },
  // Viral
  {
    id: 'share_rate',
    name: '공유율',
    description: '테스트 완료 후 공유하는 비율',
    formula: 'share_click / test_complete * 100',
    target: '30%+',
    category: 'viral',
    implemented: true,
  },
  {
    id: 'k_factor',
    name: 'K-factor',
    description: '한 사용자가 데려오는 신규 사용자 수',
    formula: 'invites_sent * conversion_rate',
    target: '1.0+ (바이럴 성장)',
    category: 'viral',
    implemented: false,
  },
  {
    id: 'viral_coefficient',
    name: '바이럴 계수',
    description: '공유→유입→완료 전환 비율',
    formula: 'shared_visit_completes / share_click',
    target: '10%+',
    category: 'viral',
    implemented: false,
  },
];

// ============================================================================
// 분석 로드맵
// ============================================================================

export interface AnalyticsTask {
  id: string;
  task: string;
  status: TaskStatus;
  priority: Priority;
  description: string;
  dependencies: string[];
}

export interface AnalyticsPhase {
  id: string;
  name: string;
  description: string;
  status: TaskStatus;
  tasks: AnalyticsTask[];
}

export const ANALYTICS_ROADMAP: AnalyticsPhase[] = [
  {
    id: 'phase-0',
    name: '기존 완료',
    description: '이미 구현된 추적',
    status: 'done',
    tasks: [
      {
        id: 'basic-events',
        task: '기본 이벤트 추적',
        status: 'done',
        priority: 'high',
        description: 'test_start, test_complete, recommendation_view/click, share_click',
        dependencies: [],
      },
      {
        id: 'local-storage',
        task: 'localStorage 폴백',
        status: 'done',
        priority: 'high',
        description: 'Supabase 미설정 시 로컬 저장',
        dependencies: [],
      },
      {
        id: 'rate-limiting',
        task: 'Rate Limiting',
        status: 'done',
        priority: 'medium',
        description: '분당 100이벤트 제한',
        dependencies: [],
      },
      {
        id: 'batch-processing',
        task: '배치 처리',
        status: 'done',
        priority: 'medium',
        description: '1초 간격, 10개씩 배치 전송',
        dependencies: [],
      },
    ],
  },
  {
    id: 'phase-1',
    name: 'Phase 1: 유입 추적',
    description: 'UTM 파라미터로 유입 경로 분석',
    status: 'done',
    tasks: [
      {
        id: 'utm-parser',
        task: 'UTM 파라미터 파싱',
        status: 'done',
        priority: 'high',
        description: '@/utils/utm - parseUTMFromUrl(), parseAndStoreUTM()',
        dependencies: [],
      },
      {
        id: 'utm-storage',
        task: 'UTM 세션 저장',
        status: 'done',
        priority: 'high',
        description: 'storeUTM() - 7일 만료, 첫 방문만 저장',
        dependencies: ['utm-parser'],
      },
      {
        id: 'referral-tracking',
        task: '리퍼러 추적',
        status: 'done',
        priority: 'medium',
        description: 'storeReferrer(), getStoredReferrer()',
        dependencies: [],
      },
      {
        id: 'share-utm-gen',
        task: '공유 UTM 자동 생성',
        status: 'done',
        priority: 'high',
        description: 'generateShareUrl(url, platform, content, contentId)',
        dependencies: ['utm-parser'],
      },
    ],
  },
  {
    id: 'phase-2',
    name: 'Phase 2: 퍼널 분석',
    description: '사용자 여정 단계별 전환율',
    status: 'done',
    tasks: [
      {
        id: 'session-tracking',
        task: '세션 추적',
        status: 'done',
        priority: 'high',
        description: 'trackSessionStart() - sessionStorage 기반, UTM 포함',
        dependencies: [],
      },
      {
        id: 'funnel-events',
        task: '퍼널 이벤트 정의',
        status: 'done',
        priority: 'high',
        description: 'session_start→test_start→test_complete→share_click 퍼널',
        dependencies: ['session-tracking'],
      },
      {
        id: 'drop-off-analysis',
        task: '이탈 지점 분석',
        status: 'planned',
        priority: 'medium',
        description: '테스트 중 이탈 질문, 화면 추적',
        dependencies: ['funnel-events'],
      },
      {
        id: 'conversion-dashboard',
        task: '전환율 대시보드',
        status: 'done',
        priority: 'medium',
        description: '대시보드 > 기획 > 전환 분석',
        dependencies: ['funnel-events'],
      },
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3: 행동 분석',
    description: '심층 사용자 행동 패턴',
    status: 'planned',
    tasks: [
      {
        id: 'scroll-tracking',
        task: '스크롤 추적',
        status: 'planned',
        priority: 'low',
        description: '페이지별 스크롤 깊이',
        dependencies: [],
      },
      {
        id: 'time-on-page',
        task: '체류 시간 추적',
        status: 'planned',
        priority: 'medium',
        description: '페이지/질문별 체류 시간',
        dependencies: ['session-tracking'],
      },
      {
        id: 'click-heatmap',
        task: '클릭 히트맵',
        status: 'planned',
        priority: 'low',
        description: '어디를 많이 클릭하는지 시각화',
        dependencies: [],
      },
      {
        id: 'user-segments',
        task: '사용자 세그먼트',
        status: 'planned',
        priority: 'medium',
        description: '신규/재방문, 테스트 완료 수 기반 세그먼트',
        dependencies: ['session-tracking'],
      },
    ],
  },
  {
    id: 'phase-4',
    name: 'Phase 4: 실시간 대시보드',
    description: '관리자용 실시간 분석',
    status: 'planned',
    tasks: [
      {
        id: 'realtime-visitors',
        task: '실시간 방문자',
        status: 'planned',
        priority: 'medium',
        description: '현재 접속 중인 사용자 수',
        dependencies: [],
      },
      {
        id: 'live-events',
        task: '실시간 이벤트 피드',
        status: 'planned',
        priority: 'low',
        description: '최근 이벤트 실시간 표시',
        dependencies: [],
      },
      {
        id: 'alert-system',
        task: '이상 감지 알림',
        status: 'planned',
        priority: 'low',
        description: '급격한 트래픽 변화, 에러 급증 알림',
        dependencies: ['realtime-visitors'],
      },
    ],
  },
];

// ============================================================================
// Google Analytics 비교
// ============================================================================

export interface GAComparison {
  feature: string;
  googleAnalytics: string;
  ourSystem: string;
  recommendation: 'ga' | 'our' | 'both';
  reason: string;
}

export const GA_COMPARISON: GAComparison[] = [
  {
    feature: '기본 트래픽',
    googleAnalytics: '페이지뷰, 세션, 사용자',
    ourSystem: '없음 (추가 필요)',
    recommendation: 'ga',
    reason: 'GA4 무료 + 강력한 기본 분석',
  },
  {
    feature: '유입 경로',
    googleAnalytics: 'UTM, 리퍼러 자동 분석',
    ourSystem: 'UTM 파싱 계획',
    recommendation: 'ga',
    reason: 'GA4의 Attribution 모델 활용',
  },
  {
    feature: '커스텀 이벤트',
    googleAnalytics: '커스텀 이벤트 제한적',
    ourSystem: 'test_complete, poll_vote 등',
    recommendation: 'both',
    reason: 'GA4에도 전송 + 상세 분석은 자체 DB',
  },
  {
    feature: '테스트 퍼널',
    googleAnalytics: '단순 퍼널만 가능',
    ourSystem: '질문별 이탈 분석 가능',
    recommendation: 'our',
    reason: '세밀한 테스트 분석은 자체 시스템',
  },
  {
    feature: '추천 분석',
    googleAnalytics: '불가',
    ourSystem: '추천 노출/클릭/전환',
    recommendation: 'our',
    reason: '비즈니스 로직에 맞는 자체 분석',
  },
  {
    feature: '실시간',
    googleAnalytics: '실시간 사용자, 위치',
    ourSystem: '계획 중',
    recommendation: 'ga',
    reason: 'GA4 실시간 대시보드 활용',
  },
  {
    feature: '사용자 프로퍼티',
    googleAnalytics: '제한적 (무료)',
    ourSystem: 'deviceId 기반 무제한',
    recommendation: 'our',
    reason: '사용자 세그먼트 자유로움',
  },
];

// ============================================================================
// 구현 권장 사항
// ============================================================================

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export const RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'ga4-basic',
    title: 'GA4 기본 설정',
    description: 'Google Analytics 4 추가로 트래픽, 유입 경로 기본 분석 확보',
    priority: 'high',
    effort: 'low',
    impact: 'high',
  },
  {
    id: 'utm-implement',
    title: 'UTM 유틸리티 구현',
    description: '공유 링크에 UTM 자동 추가, 유입 시 파싱/저장',
    priority: 'high',
    effort: 'medium',
    impact: 'high',
  },
  {
    id: 'ga-custom-events',
    title: 'GA4 커스텀 이벤트 전송',
    description: 'test_complete, share_click 등 주요 이벤트를 GA4에도 전송',
    priority: 'medium',
    effort: 'low',
    impact: 'medium',
  },
  {
    id: 'funnel-analysis',
    title: '퍼널 분석 구현',
    description: '방문→테스트→완료→공유 퍼널 시각화',
    priority: 'medium',
    effort: 'medium',
    impact: 'high',
  },
  {
    id: 'ab-testing',
    title: 'A/B 테스트 인프라',
    description: '추천 알고리즘, UI 변형 테스트 가능하게',
    priority: 'low',
    effort: 'high',
    impact: 'high',
  },
];

// ============================================================================
// 통합 Export
// ============================================================================

export const ANALYTICS_SYSTEM = {
  events: TRACKING_EVENTS,
  kpis: KPIS,
  roadmap: ANALYTICS_ROADMAP,
  gaComparison: GA_COMPARISON,
  recommendations: RECOMMENDATIONS,
};

export default ANALYTICS_SYSTEM;
