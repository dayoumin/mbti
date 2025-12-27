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
// 배포 체크리스트 (Deployment Checklist)
// ============================================================================

export interface DeploymentChecklist {
  id: string;
  category: 'env' | 'build' | 'deployment' | 'verification';
  label: string;
  items: {
    task: string;
    done: boolean;
    notes?: string;
    command?: string;
  }[];
}

export const DEPLOYMENT_CHECKLISTS: DeploymentChecklist[] = [
  {
    id: 'env-variables',
    category: 'env',
    label: '환경변수 설정',
    items: [
      {
        task: 'OPENAI_API_KEY 설정',
        done: false,
        notes: 'AI 리포트 생성용 (Stage 7)',
      },
      {
        task: 'TURSO_DATABASE_URL 설정',
        done: false,
        notes: 'libsql://store-dayoumin.aws-ap-northeast-1.turso.io',
      },
      {
        task: 'TURSO_AUTH_TOKEN 설정',
        done: false,
        notes: 'Turso 인증 토큰',
      },
      {
        task: 'NEXT_PUBLIC_APP_URL 설정',
        done: false,
        notes: '공유 URL 생성용 (https://yourdomain.com)',
      },
    ],
  },
  {
    id: 'api-timeout',
    category: 'env',
    label: 'API 타임아웃 설정',
    items: [
      {
        task: 'OpenAI API 타임아웃 30초',
        done: false,
        notes: 'src/services/InsightService.ts 확인',
      },
      {
        task: 'Turso DB 타임아웃 10초',
        done: false,
        notes: 'src/lib/turso.ts 확인',
      },
      {
        task: 'API 에러 핸들링 확인',
        done: false,
        notes: '폴백 메커니즘 정상 작동 확인',
      },
    ],
  },
  {
    id: 'build-verification',
    category: 'build',
    label: '빌드 검증',
    items: [
      {
        task: 'npm run build 성공',
        done: true,
        command: 'npm run build',
      },
      {
        task: 'npm start 프로덕션 모드 테스트',
        done: false,
        command: 'npm start',
      },
      {
        task: '타입 에러 0개 확인',
        done: true,
        notes: 'TypeScript 빌드 통과',
      },
      {
        task: '콘텐츠 검증 (439개 통과)',
        done: true,
        notes: 'Phase 1,2,3 완료',
      },
    ],
  },
  {
    id: 'vercel-deployment',
    category: 'deployment',
    label: 'Vercel 배포',
    items: [
      {
        task: 'Vercel 프로젝트 생성',
        done: false,
        notes: 'vercel.com에서 프로젝트 연결',
      },
      {
        task: '환경변수 등록 (Production)',
        done: false,
        notes: 'OPENAI_API_KEY, TURSO_* 등록',
      },
      {
        task: '도메인 연결',
        done: false,
        notes: '커스텀 도메인 설정 (선택)',
      },
      {
        task: 'OG 이미지 확인',
        done: false,
        notes: 'SNS 공유 시 미리보기 이미지',
      },
      {
        task: 'Analytics 활성화',
        done: false,
        notes: 'Vercel Analytics (무료)',
      },
    ],
  },
  {
    id: 'post-deployment',
    category: 'verification',
    label: '배포 후 확인',
    items: [
      {
        task: '메인 페이지 접속 확인',
        done: false,
        notes: '테스트 선택 → 진행 → 결과 화면',
      },
      {
        task: 'AI 리포트 생성 확인',
        done: false,
        notes: 'Stage 7 AI 분석 정상 작동',
      },
      {
        task: 'DB 저장 확인',
        done: false,
        notes: 'Turso DB에 결과 저장 확인',
        command: 'npx turso db shell store-dayoumin',
      },
      {
        task: '공유 기능 확인',
        done: false,
        notes: 'Instagram Story, 링크 공유',
      },
      {
        task: '모바일 반응형 확인',
        done: false,
        notes: 'iPhone, Android 테스트',
      },
    ],
  },
];

// ============================================================================
// 운영 체크리스트 (Operations Checklist)
// ============================================================================

export interface OperationsChecklist {
  id: string;
  milestone: '1k' | '10k' | '100k'; // 사용자 마일스톤
  label: string;
  trigger: string;
  items: {
    task: string;
    done: boolean;
    notes?: string;
    priority: 'critical' | 'high' | 'medium';
  }[];
}

export const OPERATIONS_CHECKLISTS: OperationsChecklist[] = [
  {
    id: 'db-profiling-1k',
    milestone: '1k',
    label: 'DB 쿼리 프로파일링 (1000명 달성 시)',
    trigger: '실사용자 1000명 이상',
    items: [
      {
        task: 'Turso CLI로 쿼리 실행 시간 측정',
        done: false,
        notes: '.timer on → 쿼리 실행',
        priority: 'critical',
      },
      {
        task: 'GROUP BY 쿼리 응답 시간 기록',
        done: false,
        notes: 'SELECT result_name, COUNT(*) ... GROUP BY',
        priority: 'critical',
      },
      {
        task: '임계값 확인 (> 100ms?)',
        done: false,
        notes: '목표: < 100ms, 경고: > 200ms, 긴급: > 500ms',
        priority: 'high',
      },
      {
        task: '느린 쿼리 TOP 10 식별',
        done: false,
        notes: 'P95 기준 느린 쿼리 우선 최적화',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'db-optimization-1k',
    milestone: '1k',
    label: 'DB 최적화 1단계 (응답 시간 > 100ms)',
    trigger: '쿼리 응답 시간 > 100ms',
    items: [
      {
        task: '복합 인덱스 추가 (type + result_name)',
        done: false,
        notes: 'CREATE INDEX idx_test_results_type_result',
        priority: 'critical',
      },
      {
        task: '복합 인덱스 추가 (device_id + created_at)',
        done: false,
        notes: 'CREATE INDEX idx_test_results_device_created',
        priority: 'high',
      },
      {
        task: '인덱스 적용 후 재측정',
        done: false,
        notes: '예상: 500ms → 50ms',
        priority: 'critical',
      },
    ],
  },
  {
    id: 'caching-200ms',
    milestone: '1k',
    label: 'DB 최적화 2단계 (응답 시간 > 200ms)',
    trigger: '인덱스 후에도 응답 시간 > 200ms',
    items: [
      {
        task: '결과 분포 캐싱 (10분)',
        done: false,
        notes: 'unstable_cache 적용',
        priority: 'critical',
      },
      {
        task: '내 결과 순위 SQL 계산 변경',
        done: false,
        notes: '클라이언트 계산 → 서버 SQL',
        priority: 'high',
      },
      {
        task: '캐싱 적용 후 재측정',
        done: false,
        notes: '예상: DB 부하 99% 감소',
        priority: 'critical',
      },
    ],
  },
  {
    id: 'data-collection-1k',
    milestone: '1k',
    label: '사용자 데이터 수집 (1000명)',
    trigger: '실사용자 1000명 이상',
    items: [
      {
        task: 'Google Analytics 또는 Vercel Analytics 확인',
        done: false,
        notes: '완료율, 공유율, 재방문율',
        priority: 'high',
      },
      {
        task: '인기 테스트 TOP 10 확인',
        done: false,
        notes: '어떤 테스트가 가장 많이 완료되었는지',
        priority: 'medium',
      },
      {
        task: '결과 분포 쏠림 확인',
        done: false,
        notes: '특정 결과 > 40% 편향 있는지',
        priority: 'high',
      },
      {
        task: 'A/B 테스트 설계 (결과 UI)',
        done: false,
        notes: '상세 분석 펼침 vs 접힘 비교',
        priority: 'medium',
      },
    ],
  },
  {
    id: 'aggregation-table-10k',
    milestone: '10k',
    label: 'DB 최적화 3단계 (10,000명)',
    trigger: '실사용자 10,000명 이상',
    items: [
      {
        task: '집계 테이블 생성 (test_results_summary)',
        done: false,
        notes: 'CREATE TABLE test_results_summary',
        priority: 'critical',
      },
      {
        task: '크론 작업 설정 (매시간 갱신)',
        done: false,
        notes: 'Vercel Cron 또는 별도 스케줄러',
        priority: 'high',
      },
      {
        task: '집계 테이블 적용 후 재측정',
        done: false,
        notes: '예상: 500ms → 10ms',
        priority: 'critical',
      },
    ],
  },
  {
    id: 'read-replica-100k',
    milestone: '100k',
    label: 'DB 최적화 4단계 (100,000명)',
    trigger: '실사용자 100,000명 이상',
    items: [
      {
        task: 'Turso Pro 플랜 업그레이드 ($25/월)',
        done: false,
        notes: '읽기 전용 복제본 설정',
        priority: 'critical',
      },
      {
        task: '읽기/쓰기 클라이언트 분리',
        done: false,
        notes: 'masterClient, replicaClient',
        priority: 'critical',
      },
      {
        task: '모니터링 대시보드 구축',
        done: false,
        notes: '쿼리 P50, P95, P99 추적',
        priority: 'high',
      },
    ],
  },
  {
    id: 'cost-monitoring',
    milestone: '10k',
    label: '비용 모니터링 (10,000명)',
    trigger: '실사용자 10,000명 이상',
    items: [
      {
        task: 'OpenAI API 월 사용량 확인',
        done: false,
        notes: '예상: $500/월',
        priority: 'high',
      },
      {
        task: 'AI 리포트 캐싱 검토',
        done: false,
        notes: '동일 결과 → 재사용 (비용 절감)',
        priority: 'medium',
      },
      {
        task: 'Vercel 대역폭 확인',
        done: false,
        notes: 'Pro 플랜 필요 여부',
        priority: 'medium',
      },
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
  deploymentChecklists: DEPLOYMENT_CHECKLISTS,
  operationsChecklists: OPERATIONS_CHECKLISTS,
  alphaGuide: ALPHA_TEST_GUIDE,
  currentStatus: CURRENT_OPS_STATUS,
};

export default OPERATIONS_SYSTEM;