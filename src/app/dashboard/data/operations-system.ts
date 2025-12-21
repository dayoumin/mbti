// ============================================================================
// 운영 시스템 (Operations & Monitoring System)
// ============================================================================
// 목적: 알파 테스트 및 출시 후 운영 모니터링 가이드
// 핵심: 자동 검증, 수동 점검, 실시간 모니터링, 대응 프로세스

// ============================================================================
// Types
// ============================================================================

export type CheckCategory = 'automated' | 'manual' | 'monitoring' | 'response';
export type CheckStatus = 'ready' | 'partial' | 'planned';
export type Priority = 'critical' | 'high' | 'medium' | 'low';
export type Phase = 'pre_launch' | 'alpha' | 'beta' | 'production';

export interface OperationsCheck {
  id: string;
  name: string;
  description: string;
  category: CheckCategory;
  status: CheckStatus;
  priority: Priority;
  phase: Phase[];
  command?: string; // 자동화된 경우 실행 명령
  frequency?: string; // 점검 주기
  owner: 'ai' | 'human' | 'system';
}

export interface MonitoringMetric {
  id: string;
  name: string;
  description: string;
  target: string;
  alertThreshold?: string;
  dashboard: boolean; // 대시보드에 표시 여부
  implemented: boolean;
}

export interface IncidentResponse {
  id: string;
  scenario: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  detection: string;
  response: string[];
  preventive: string[];
}

export interface LaunchChecklist {
  phase: Phase;
  label: string;
  description: string;
  items: {
    task: string;
    done: boolean;
    notes?: string;
  }[];
}

// ============================================================================
// 운영 점검 항목
// ============================================================================

export const OPERATIONS_CHECKS: OperationsCheck[] = [
  // ============ 자동화된 검증 ============
  {
    id: 'test-reachability',
    name: '결과 도달 가능성 검증',
    description: '모든 테스트 결과가 실제로 도달 가능한지 검증',
    category: 'automated',
    status: 'ready',
    priority: 'critical',
    phase: ['pre_launch', 'alpha'],
    command: 'node scripts/validate-test-data.mjs {subject}',
    frequency: '코드 변경 시',
    owner: 'ai',
  },
  {
    id: 'type-safety',
    name: '타입 안전성 검증',
    description: 'TypeScript 빌드로 타입 오류 검출',
    category: 'automated',
    status: 'ready',
    priority: 'critical',
    phase: ['pre_launch', 'alpha', 'beta', 'production'],
    command: 'npm run build',
    frequency: '모든 코드 변경 시',
    owner: 'ai',
  },
  {
    id: 'e2e-responsive',
    name: '반응형 E2E 테스트',
    description: '모바일/태블릿/데스크톱 화면 테스트',
    category: 'automated',
    status: 'ready',
    priority: 'high',
    phase: ['pre_launch', 'alpha'],
    command: 'npx playwright test responsive',
    frequency: 'UI 변경 시',
    owner: 'ai',
  },
  {
    id: 'scoring-logic',
    name: '점수 계산 로직 검증',
    description: '시뮬레이터로 점수→결과 매칭 테스트',
    category: 'automated',
    status: 'ready',
    priority: 'high',
    phase: ['pre_launch'],
    command: '대시보드 시뮬레이터 사용',
    frequency: '로직 변경 시',
    owner: 'ai',
  },

  // ============ 수동 점검 ============
  {
    id: 'content-quality',
    name: '콘텐츠 품질 점검',
    description: '질문/결과 텍스트 오타, 어색한 문장 검토',
    category: 'manual',
    status: 'partial',
    priority: 'high',
    phase: ['alpha', 'beta'],
    frequency: '사용자 피드백 접수 시',
    owner: 'human',
  },
  {
    id: 'result-balance',
    name: '결과 분포 밸런스',
    description: '특정 결과에 쏠림 현상 확인',
    category: 'manual',
    status: 'planned',
    priority: 'medium',
    phase: ['alpha', 'beta'],
    frequency: '주 1회',
    owner: 'human',
  },
  {
    id: 'feedback-review',
    name: '피드백 내용 검토',
    description: '제출된 피드백 중 유용한 개선점 추출',
    category: 'manual',
    status: 'planned',
    priority: 'medium',
    phase: ['alpha', 'beta', 'production'],
    frequency: '일 1회',
    owner: 'human',
  },
  {
    id: 'quiz-accuracy',
    name: '퀴즈 정확도 검증',
    description: '퀴즈 정답/오답이 올바른지 확인',
    category: 'manual',
    status: 'partial',
    priority: 'high',
    phase: ['pre_launch', 'alpha'],
    frequency: '퀴즈 추가 시',
    owner: 'ai',
  },

  // ============ 모니터링 ============
  {
    id: 'result-distribution',
    name: '결과 분포 모니터링',
    description: '실시간 결과 분포 추적',
    category: 'monitoring',
    status: 'planned',
    priority: 'high',
    phase: ['alpha', 'beta', 'production'],
    frequency: '실시간',
    owner: 'system',
  },
  {
    id: 'error-tracking',
    name: '에러 추적',
    description: 'JavaScript 에러, API 실패 모니터링',
    category: 'monitoring',
    status: 'planned',
    priority: 'critical',
    phase: ['beta', 'production'],
    frequency: '실시간',
    owner: 'system',
  },
  {
    id: 'abuse-detection',
    name: '어뷰징 탐지',
    description: '비정상적 투표/댓글 패턴 감지',
    category: 'monitoring',
    status: 'partial',
    priority: 'high',
    phase: ['alpha', 'beta', 'production'],
    frequency: '실시간',
    owner: 'system',
  },
  {
    id: 'performance',
    name: '성능 모니터링',
    description: '페이지 로드 시간, API 응답 시간',
    category: 'monitoring',
    status: 'planned',
    priority: 'medium',
    phase: ['beta', 'production'],
    frequency: '실시간',
    owner: 'system',
  },

  // ============ 대응 ============
  {
    id: 'spam-filter',
    name: '스팸 댓글 필터',
    description: '부적절 댓글 자동/수동 필터링',
    category: 'response',
    status: 'planned',
    priority: 'high',
    phase: ['beta', 'production'],
    owner: 'system',
  },
  {
    id: 'hotfix-process',
    name: '핫픽스 프로세스',
    description: '긴급 버그 수정 배포 절차',
    category: 'response',
    status: 'ready',
    priority: 'critical',
    phase: ['production'],
    owner: 'ai',
  },
  {
    id: 'rollback',
    name: '롤백 절차',
    description: '문제 발생 시 이전 버전 복구',
    category: 'response',
    status: 'ready',
    priority: 'critical',
    phase: ['production'],
    owner: 'ai',
  },
];

// ============================================================================
// 모니터링 지표
// ============================================================================

export const MONITORING_METRICS: MonitoringMetric[] = [
  // 사용자 지표
  {
    id: 'daily-tests',
    name: '일일 테스트 완료 수',
    description: '하루에 완료된 테스트 수',
    target: '성장 추세 유지',
    dashboard: true,
    implemented: false,
  },
  {
    id: 'completion-rate',
    name: '테스트 완료율',
    description: '시작 대비 완료 비율',
    target: '> 70%',
    alertThreshold: '< 50%',
    dashboard: true,
    implemented: false,
  },
  {
    id: 'share-rate',
    name: '결과 공유율',
    description: '결과 확인 후 공유 비율',
    target: '> 20%',
    dashboard: true,
    implemented: false,
  },

  // 품질 지표
  {
    id: 'result-distribution',
    name: '결과 분포',
    description: '각 결과 유형별 비율',
    target: '균등 분포 (±20%)',
    alertThreshold: '특정 결과 > 40%',
    dashboard: true,
    implemented: false,
  },
  {
    id: 'feedback-sentiment',
    name: '피드백 감정 분석',
    description: '긍정/부정 피드백 비율',
    target: '긍정 > 70%',
    alertThreshold: '부정 > 40%',
    dashboard: false,
    implemented: false,
  },

  // 기술 지표
  {
    id: 'error-rate',
    name: '에러 발생률',
    description: 'JS 에러 / 전체 세션',
    target: '< 1%',
    alertThreshold: '> 5%',
    dashboard: true,
    implemented: false,
  },
  {
    id: 'page-load',
    name: '페이지 로드 시간',
    description: '평균 첫 페이지 로드',
    target: '< 2초',
    alertThreshold: '> 4초',
    dashboard: false,
    implemented: false,
  },

  // 보안 지표
  {
    id: 'duplicate-votes',
    name: '중복 투표 시도율',
    description: '차단된 중복 투표 비율',
    target: '모니터링',
    alertThreshold: '> 10%',
    dashboard: true,
    implemented: true,
  },
  {
    id: 'spam-comments',
    name: '스팸 댓글율',
    description: '스팸으로 분류된 댓글 비율',
    target: '< 5%',
    alertThreshold: '> 15%',
    dashboard: false,
    implemented: false,
  },
];

// ============================================================================
// 인시던트 대응
// ============================================================================

export const INCIDENT_RESPONSES: IncidentResponse[] = [
  {
    id: 'result-skew',
    scenario: '특정 결과에 70% 이상 쏠림',
    severity: 'high',
    detection: '결과 분포 모니터링',
    response: [
      '해당 테스트 condition 로직 점검',
      '시뮬레이터로 다양한 조합 테스트',
      '조건 조정 후 재배포',
    ],
    preventive: [
      'validate-test-data.mjs 검증 강화',
      '출시 전 시뮬레이터 샘플링',
    ],
  },
  {
    id: 'vote-manipulation',
    scenario: '투표 조작 의심 (다중 계정)',
    severity: 'critical',
    detection: '동일 IP + 다른 deviceId 패턴',
    response: [
      '해당 투표 데이터 격리',
      'IP 기반 임시 차단',
      '로그 분석 후 영구 조치',
    ],
    preventive: [
      'deviceId + IP 복합 검증',
      'Rate Limit 강화',
    ],
  },
  {
    id: 'spam-flood',
    scenario: '댓글 도배 공격',
    severity: 'high',
    detection: '분당 댓글 수 급증',
    response: [
      '댓글 기능 임시 비활성화',
      '스팸 댓글 일괄 삭제',
      'Rate Limit 임시 강화',
    ],
    preventive: [
      '댓글 간격 제한 (30초)',
      '일일 댓글 한도 적용',
    ],
  },
  {
    id: 'critical-bug',
    scenario: '테스트 진행 불가 버그',
    severity: 'critical',
    detection: '에러 모니터링 또는 사용자 신고',
    response: [
      '즉시 이전 버전 롤백',
      '버그 원인 분석',
      '수정 후 재배포',
    ],
    preventive: [
      'E2E 테스트 강화',
      'Staging 환경 검증',
    ],
  },
  {
    id: 'inappropriate-content',
    scenario: '부적절한 댓글/피드백',
    severity: 'medium',
    detection: '키워드 필터 또는 신고',
    response: [
      '해당 콘텐츠 숨김 처리',
      '작성자 경고 또는 차단',
    ],
    preventive: [
      '금칙어 필터',
      '신고 기능 활성화',
    ],
  },
];

// ============================================================================
// 출시 체크리스트
// ============================================================================

export const LAUNCH_CHECKLISTS: LaunchChecklist[] = [
  {
    phase: 'pre_launch',
    label: 'Pre-Launch',
    description: '출시 전 필수 점검 사항',
    items: [
      { task: 'validate-test-data 모든 테스트 통과', done: true },
      { task: 'npm run build 성공', done: true },
      { task: '반응형 E2E 테스트 통과', done: true },
      { task: '시뮬레이터로 결과 분포 샘플링', done: false },
      { task: '모든 테스트 직접 플레이', done: false },
      { task: 'deviceId 기반 중복 방지 확인', done: true },
      { task: '공유 기능 동작 확인', done: true },
    ],
  },
  {
    phase: 'alpha',
    label: 'Alpha',
    description: '알파 테스트 중 점검 사항',
    items: [
      { task: '실제 결과 분포 모니터링 설정', done: false },
      { task: '피드백 수집 채널 확인', done: true },
      { task: '주요 버그 수집 및 수정', done: false, notes: '알파 중 진행' },
      { task: '콘텐츠 품질 피드백 반영', done: false },
      { task: '어뷰징 패턴 모니터링', done: false },
    ],
  },
  {
    phase: 'beta',
    label: 'Beta',
    description: '베타 테스트 중 점검 사항',
    items: [
      { task: '에러 추적 시스템 연동 (Sentry 등)', done: false },
      { task: '성능 모니터링 설정', done: false },
      { task: '스팸/어뷰징 대응 자동화', done: false },
      { task: '결과 분포 밸런스 조정', done: false },
    ],
  },
  {
    phase: 'production',
    label: 'Production',
    description: '정식 출시 후 운영 사항',
    items: [
      { task: '일일 모니터링 루틴 설정', done: false },
      { task: '핫픽스 배포 프로세스 문서화', done: false },
      { task: '롤백 절차 테스트', done: false },
      { task: '백업 전략 수립', done: false },
    ],
  },
];

// ============================================================================
// 알파 테스트 가이드
// ============================================================================

export const ALPHA_TEST_GUIDE = {
  duration: '1-2주',
  targetUsers: '10-50명 (내부 또는 친구)',
  goals: [
    '주요 버그 발견 및 수정',
    '결과 분포 실제 데이터 확인',
    '콘텐츠 품질 피드백 수집',
    '어뷰징 패턴 조기 발견',
  ],
  dataToCollect: [
    '테스트별 완료율',
    '결과 분포 비율',
    '사용자 피드백 (자유 텍스트)',
    '에러 로그',
    '의심 행동 패턴',
  ],
  successCriteria: [
    '치명적 버그 0개',
    '테스트 완료율 > 70%',
    '결과 분포 균형 (최대 편차 30%)',
    '긍정적 피드백 비율 > 60%',
  ],
  exitCriteria: [
    '주요 버그 모두 수정',
    '결과 밸런스 조정 완료',
    '베타 출시 결정',
  ],
};

// ============================================================================
// 현재 상태 요약
// ============================================================================

export const CURRENT_OPS_STATUS = {
  phase: 'pre_launch' as Phase,
  automated: {
    ready: ['결과 도달 검증', '타입 안전성', 'E2E 테스트', '시뮬레이터'],
    note: 'AI가 코드 변경 시 자동 실행',
  },
  manual: {
    ready: ['콘텐츠 품질 점검 (부분)', '퀴즈 정확도 (부분)'],
    planned: ['결과 분포 밸런스', '피드백 검토'],
    note: '알파 테스트 중 사용자 피드백 기반 진행',
  },
  monitoring: {
    ready: ['중복 투표 차단 (deviceId)'],
    planned: ['결과 분포', '에러 추적', '성능', '어뷰징'],
    note: '알파 이후 순차 도입',
  },
  recommendation: '알파 테스트를 시작하며 실제 데이터 기반으로 개선',
};

// ============================================================================
// 통합 Export
// ============================================================================

export const OPERATIONS_SYSTEM = {
  checks: OPERATIONS_CHECKS,
  metrics: MONITORING_METRICS,
  incidents: INCIDENT_RESPONSES,
  checklists: LAUNCH_CHECKLISTS,
  alphaGuide: ALPHA_TEST_GUIDE,
  currentStatus: CURRENT_OPS_STATUS,
};

export default OPERATIONS_SYSTEM;