// ============================================================================
// 공정성 시스템 (Fairness & Anti-Abuse System)
// ============================================================================
// 목적: 투표/댓글/활동의 공정성 보장, 봇/어뷰징 방지
// 핵심: 중복 방지, 속도 제한, 일일/주간 한도

// ============================================================================
// Types
// ============================================================================

export type LimitType = 'rate' | 'daily' | 'weekly' | 'duplicate';

export interface FairnessRule {
  id: string;
  name: string;
  description: string;
  type: LimitType;
  target: 'vote' | 'comment' | 'quiz' | 'feedback' | 'all';
  limit: number;
  window?: string; // 시간 윈도우 (예: '1m', '1h', '1d', '1w')
  action: 'block' | 'warn' | 'throttle';
  implemented: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface AbusePattern {
  id: string;
  name: string;
  description: string;
  detection: string;
  response: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface FairnessMetric {
  name: string;
  description: string;
  target: string;
  currentStatus: 'good' | 'needs_work' | 'not_implemented';
}

// ============================================================================
// 공정성 규칙
// ============================================================================

export const FAIRNESS_RULES: FairnessRule[] = [
  // 투표 관련
  {
    id: 'vote-duplicate',
    name: '중복 투표 방지',
    description: '동일 투표에 1인 1표만 허용 (deviceId 기반)',
    type: 'duplicate',
    target: 'vote',
    limit: 1,
    action: 'block',
    implemented: true,
    priority: 'high',
  },
  {
    id: 'vote-rate',
    name: '투표 속도 제한',
    description: '1분에 최대 10번 투표 (봇 방지)',
    type: 'rate',
    target: 'vote',
    limit: 10,
    window: '1m',
    action: 'throttle',
    implemented: false,
    priority: 'medium',
  },
  {
    id: 'vote-daily',
    name: '일일 투표 한도',
    description: '하루 최대 100번 투표',
    type: 'daily',
    target: 'vote',
    limit: 100,
    window: '1d',
    action: 'block',
    implemented: false,
    priority: 'low',
  },

  // 댓글 관련
  {
    id: 'comment-rate',
    name: '댓글 간격 제한',
    description: '댓글 작성 후 최소 30초 대기',
    type: 'rate',
    target: 'comment',
    limit: 1,
    window: '30s',
    action: 'block',
    implemented: false,
    priority: 'high',
  },
  {
    id: 'comment-daily',
    name: '일일 댓글 한도',
    description: '하루 최대 20개 댓글',
    type: 'daily',
    target: 'comment',
    limit: 20,
    window: '1d',
    action: 'block',
    implemented: false,
    priority: 'high',
  },
  {
    id: 'comment-weekly',
    name: '주간 댓글 한도',
    description: '일주일 최대 100개 댓글 (AI 작성 방지)',
    type: 'weekly',
    target: 'comment',
    limit: 100,
    window: '1w',
    action: 'block',
    implemented: false,
    priority: 'medium',
  },
  {
    id: 'comment-duplicate',
    name: '중복 댓글 방지',
    description: '동일 내용 댓글 차단',
    type: 'duplicate',
    target: 'comment',
    limit: 1,
    action: 'block',
    implemented: false,
    priority: 'medium',
  },

  // 퀴즈 관련
  {
    id: 'quiz-rate',
    name: '퀴즈 응답 속도',
    description: '퀴즈당 최소 3초 대기 (자동 클릭 방지)',
    type: 'rate',
    target: 'quiz',
    limit: 1,
    window: '3s',
    action: 'warn',
    implemented: false,
    priority: 'low',
  },

  // 피드백 관련
  {
    id: 'feedback-daily',
    name: '일일 피드백 한도',
    description: '하루 최대 10개 피드백',
    type: 'daily',
    target: 'feedback',
    limit: 10,
    window: '1d',
    action: 'block',
    implemented: false,
    priority: 'medium',
  },

  // 전역 제한
  {
    id: 'global-rate',
    name: '전역 요청 제한',
    description: '1분에 최대 100개 요청',
    type: 'rate',
    target: 'all',
    limit: 100,
    window: '1m',
    action: 'throttle',
    implemented: true,
    priority: 'high',
  },
];

// ============================================================================
// 어뷰징 패턴
// ============================================================================

export const ABUSE_PATTERNS: AbusePattern[] = [
  {
    id: 'rapid-action',
    name: '빠른 연속 행동',
    description: '1초 이내 연속 클릭/투표',
    detection: '타임스탬프 간격 < 1초',
    response: '해당 요청 무시 + 경고',
    severity: 'medium',
  },
  {
    id: 'same-ip-flood',
    name: '동일 IP 대량 요청',
    description: '같은 IP에서 비정상적 대량 요청',
    detection: 'IP별 요청 카운트 > 임계값',
    response: '임시 IP 차단 (5분)',
    severity: 'high',
  },
  {
    id: 'bot-pattern',
    name: '봇 패턴',
    description: '일정한 간격의 기계적 요청',
    detection: '요청 간격 표준편차 < 0.1초',
    response: 'CAPTCHA 요구',
    severity: 'high',
  },
  {
    id: 'content-spam',
    name: '콘텐츠 스팸',
    description: '동일/유사 댓글 반복',
    detection: '텍스트 유사도 > 90%',
    response: '댓글 숨김 + 경고',
    severity: 'medium',
  },
  {
    id: 'vote-manipulation',
    name: '투표 조작 시도',
    description: '다중 계정/기기로 투표 조작',
    detection: '동일 IP + 다른 deviceId',
    response: '투표 무효화 + 알림',
    severity: 'critical',
  },
];

// ============================================================================
// 구현 로드맵
// ============================================================================

export interface FairnessPhase {
  id: string;
  name: string;
  description: string;
  status: 'done' | 'in_progress' | 'planned';
  items: {
    task: string;
    description: string;
    priority: 'high' | 'medium' | 'low';
    implemented: boolean;
  }[];
}

export const FAIRNESS_ROADMAP: FairnessPhase[] = [
  {
    id: 'phase-1',
    name: 'Phase 1: 기본 보호',
    description: '최소한의 어뷰징 방지',
    status: 'done',
    items: [
      {
        task: '중복 투표 방지',
        description: 'deviceId + pollId로 중복 체크',
        priority: 'high',
        implemented: true,
      },
      {
        task: '투표 후 결과 공개',
        description: '선입견 방지를 위해 투표 전 결과 숨김',
        priority: 'high',
        implemented: true,
      },
      {
        task: '전역 Rate Limit',
        description: 'AnalyticsService에 분당 100개 제한',
        priority: 'high',
        implemented: true,
      },
    ],
  },
  {
    id: 'phase-2',
    name: 'Phase 2: 댓글 보호',
    description: '댓글 도배/스팸 방지',
    status: 'planned',
    items: [
      {
        task: '댓글 간격 제한',
        description: '30초~1분 간격 강제',
        priority: 'high',
        implemented: false,
      },
      {
        task: '일일 댓글 한도',
        description: '하루 20개 제한',
        priority: 'high',
        implemented: false,
      },
      {
        task: '주간 댓글 한도',
        description: '주 100개 제한 (AI 작성 방지)',
        priority: 'medium',
        implemented: false,
      },
      {
        task: '중복 댓글 차단',
        description: '동일 내용 감지',
        priority: 'medium',
        implemented: false,
      },
    ],
  },
  {
    id: 'phase-3',
    name: 'Phase 3: 고급 탐지',
    description: '패턴 기반 어뷰징 탐지',
    status: 'planned',
    items: [
      {
        task: 'IP 기반 제한',
        description: '동일 IP 과다 요청 감지',
        priority: 'medium',
        implemented: false,
      },
      {
        task: '봇 패턴 감지',
        description: '기계적 요청 패턴 분석',
        priority: 'medium',
        implemented: false,
      },
      {
        task: '신고 기능',
        description: '부적절 댓글 신고 → 자동 숨김',
        priority: 'low',
        implemented: false,
      },
    ],
  },
];

// ============================================================================
// 공정성 지표
// ============================================================================

export const FAIRNESS_METRICS: FairnessMetric[] = [
  {
    name: '투표 신뢰도',
    description: '중복 제거된 순수 투표 비율',
    target: '> 99%',
    currentStatus: 'good',
  },
  {
    name: '댓글 품질',
    description: '스팸/도배 댓글 비율',
    target: '< 1%',
    currentStatus: 'not_implemented',
  },
  {
    name: '봇 차단율',
    description: '자동화 요청 차단 비율',
    target: '> 95%',
    currentStatus: 'needs_work',
  },
  {
    name: '어뷰징 탐지',
    description: '의심 행동 탐지율',
    target: '> 90%',
    currentStatus: 'not_implemented',
  },
];

// ============================================================================
// 현재 상태 요약
// ============================================================================

export const CURRENT_STATUS = {
  implemented: [
    '중복 투표 방지 (deviceId 기반)',
    '투표 후 결과 공개',
    '전역 Rate Limit (분당 100개)',
  ],
  planned: [
    '댓글 간격 제한 (30초)',
    '일일/주간 댓글 한도',
    'IP 기반 제한',
    '봇 패턴 감지',
    '신고 기능',
  ],
  storage: 'localStorage (현재) → Supabase (향후)',
};

// ============================================================================
// 통합 Export
// ============================================================================

export const FAIRNESS_SYSTEM = {
  rules: FAIRNESS_RULES,
  abusePatterns: ABUSE_PATTERNS,
  roadmap: FAIRNESS_ROADMAP,
  metrics: FAIRNESS_METRICS,
  currentStatus: CURRENT_STATUS,
};

export default FAIRNESS_SYSTEM;
