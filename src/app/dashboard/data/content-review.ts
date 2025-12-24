// ============================================================================
// 콘텐츠 검수 시스템 데이터
// ============================================================================
//
// 역할:
// - AI가 발견한 연령 제한 후보를 기록
// - 사람이 검토하고 승인/수정/거부
// - 검수 이력 관리
// - 알림 시스템 (50개 이상 또는 매주 월요일)
// ============================================================================

// 검수 상태
export type ReviewStatus = 'pending' | 'approved' | 'modified' | 'rejected';

// 검수 타입
export type ReviewType = 'age-restriction' | 'content-quality' | 'accuracy' | 'sensitive';

// 검수 항목
export interface ContentReviewItem {
  id: string;                        // 고유 ID
  contentId: string;                 // 원본 콘텐츠 ID
  contentType: 'poll' | 'quiz' | 'scenario' | 'tournament' | 'situation-reaction';
  contentPath: string;               // 파일 경로
  reviewType: ReviewType;            // 검수 유형

  // AI 제안
  aiSuggestion: {
    field: string;                   // 변경 제안 필드 (예: "meta.isAdultOnly")
    currentValue: unknown;           // 현재 값
    suggestedValue: unknown;         // 제안 값
    reason: string;                  // 제안 이유
    confidence: 'high' | 'medium' | 'low';  // 확신도
  };

  // 원본 콘텐츠 요약
  contentSummary: {
    question?: string;               // 질문 또는 상황
    options?: string[];              // 선택지 요약
    tags?: string[];                 // 태그
  };

  // 검수 결과
  status: ReviewStatus;
  reviewedBy?: string;               // 검수자 (optional)
  reviewedAt?: string;               // 검수 일시
  reviewNote?: string;               // 검수 메모
  finalValue?: unknown;              // 최종 적용 값

  // 메타데이터
  createdAt: string;                 // 생성 일시
  createdBy: string;                 // 생성자 (AI 에이전트 이름)
}

// 검수 통계
export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  modified: number;
  rejected: number;
  byType: Record<ReviewType, number>;
}

// ============================================================================
// 초기 데이터 (예시)
// ============================================================================

export const CONTENT_REVIEW_ITEMS: ContentReviewItem[] = [
  // ============================================================================
  // 실제 콘텐츠 검수 사례 (대기 중)
  // ============================================================================
  {
    id: 'review-2024-12-24-001',
    contentId: 'vs-viral-005',
    contentType: 'poll',
    contentPath: 'src/data/content/polls/vs-polls.ts',
    reviewType: 'age-restriction',
    aiSuggestion: {
      field: 'meta.minAge',
      currentValue: undefined,
      suggestedValue: '20s',
      reason: '"애인의 남사친/여사친과 단둘이 술" - 술 언급이 있어 minAge: 20s 권장. isAdultOnly는 불필요 (음주 행동 묘사 아님)',
      confidence: 'high',
    },
    contentSummary: {
      question: '애인의 남사친/여사친과 단둘이 술?',
      options: ['믿으니까 상관 없음 🤝', '절대 안 됨 🛑'],
      tags: ['연애', '질투'],
    },
    status: 'pending',
    createdAt: '2024-12-24T00:00:00.000Z',
    createdBy: 'content-auditor',
  },
  {
    id: 'review-2024-12-24-002',
    contentId: 'vs-love-001',
    contentType: 'poll',
    contentPath: 'src/data/content/polls/vs-polls.ts',
    reviewType: 'age-restriction',
    aiSuggestion: {
      field: 'meta',
      currentValue: undefined,
      suggestedValue: undefined,
      reason: '"연애 스타일은?" - 10대도 연애를 하므로 연령 제한 불필요. 현재 설정 유지 권장.',
      confidence: 'high',
    },
    contentSummary: {
      question: '연애 스타일은?',
      options: ['밀당', '직진'],
      tags: ['연애'],
    },
    status: 'pending',
    createdAt: '2024-12-24T00:00:00.000Z',
    createdBy: 'content-auditor',
  },
  {
    id: 'review-2024-12-24-003',
    contentId: 'zodiac-poll-005',
    contentType: 'poll',
    contentPath: 'src/data/content/fortune/zodiac-polls.ts',
    reviewType: 'age-restriction',
    aiSuggestion: {
      field: 'meta.minAge',
      currentValue: '20s',
      suggestedValue: undefined,
      reason: '"월급날 가장 먼저 텅장이 되는 별자리는?" - 직장/월급 맥락이지만 학생 용돈 맥락에서도 공감 가능. minAge 제거 검토.',
      confidence: 'medium',
    },
    contentSummary: {
      question: '월급날 가장 먼저 텅장이 되는 별자리는?',
      options: ['사수자리 🏹', '사자자리 🦁', '천칭자리 ⚖️', '양자리 🐏'],
      tags: ['돈', '소비', '월급', '재미'],
    },
    status: 'pending',
    createdAt: '2024-12-24T00:00:00.000Z',
    createdBy: 'content-auditor',
  },
  {
    id: 'review-2024-12-24-004',
    contentId: 'zodiac-poll-008',
    contentType: 'poll',
    contentPath: 'src/data/content/fortune/zodiac-polls.ts',
    reviewType: 'age-restriction',
    aiSuggestion: {
      field: 'meta.minAge',
      currentValue: '20s',
      suggestedValue: '20s',
      reason: '"이직/전직 운이 가장 좋은 띠는?" - 이직/커리어 맥락은 직장인 대상. minAge: 20s 유지 권장.',
      confidence: 'high',
    },
    contentSummary: {
      question: '이직/전직 운이 가장 좋은 띠는?',
      options: ['말띠 🐎', '원숭이띠 🐒', '용띠 🐉'],
      tags: ['이직', '커리어', '띠'],
    },
    status: 'pending',
    createdAt: '2024-12-24T00:00:00.000Z',
    createdBy: 'content-auditor',
  },
  // ============================================================================
  // 완료된 검수 사례 (이력)
  // ============================================================================
  {
    id: 'review-2024-12-23-001',
    contentId: 'vs-viral-010',
    contentType: 'poll',
    contentPath: 'src/data/content/polls/vs-polls.ts',
    reviewType: 'age-restriction',
    aiSuggestion: {
      field: 'meta.isAdultOnly',
      currentValue: undefined,
      suggestedValue: false,
      reason: '"소주 vs 맥주" - 단순 선호 비교로 isAdultOnly 불필요, minAge만 유지',
      confidence: 'high',
    },
    contentSummary: {
      question: '소주 vs 맥주?',
      options: ['소주 🍶', '맥주 🍺'],
      tags: ['술', '음료'],
    },
    status: 'approved',
    reviewedAt: '2024-12-24T10:00:00.000Z',
    reviewNote: 'minAge: 20s 유지, isAdultOnly 불필요',
    finalValue: { minAge: '20s' },
    createdAt: '2024-12-23T00:00:00.000Z',
    createdBy: 'content-auditor',
  },
  {
    id: 'review-2024-12-23-002',
    contentId: 'vs-work-001',
    contentType: 'poll',
    contentPath: 'src/data/content/polls/vs-polls.ts',
    reviewType: 'age-restriction',
    aiSuggestion: {
      field: 'meta.minAge',
      currentValue: undefined,
      suggestedValue: '20s',
      reason: '"야근 후 회식 제안" - 직장 상황으로 minAge: 20s 권장',
      confidence: 'high',
    },
    contentSummary: {
      question: '야근 후 회식 제안',
      options: ['참석한다', '안 간다'],
      tags: ['직장', '회식'],
    },
    status: 'approved',
    reviewedAt: '2024-12-24T11:00:00.000Z',
    reviewNote: 'minAge: 20s 적용 완료',
    finalValue: { minAge: '20s' },
    createdAt: '2024-12-23T00:00:00.000Z',
    createdBy: 'content-auditor',
  },
  {
    id: 'review-2024-12-23-003',
    contentId: 'vs-love-date-001',
    contentType: 'poll',
    contentPath: 'src/data/content/polls/vs-polls.ts',
    reviewType: 'age-restriction',
    aiSuggestion: {
      field: 'meta.minAge',
      currentValue: undefined,
      suggestedValue: '20s',
      reason: '"첫 데이트 비용 누가 내나요?" - 연애 주제이지만 10대도 데이트함',
      confidence: 'low',
    },
    contentSummary: {
      question: '첫 데이트 비용 누가 내나요?',
      options: ['더치페이', '남자가', '사귄 사람이'],
      tags: ['연애', '데이트'],
    },
    status: 'rejected',
    reviewedAt: '2024-12-24T12:00:00.000Z',
    reviewNote: '10대도 데이트 경험 가능, 연령 제한 불필요',
    createdAt: '2024-12-23T00:00:00.000Z',
    createdBy: 'content-auditor',
  },
];

// ============================================================================
// 검수 기준 문서화
// ============================================================================

export const REVIEW_GUIDELINES = {
  'age-restriction': {
    title: '연령 제한 검수',
    description: 'isAdultOnly와 minAge 설정이 적절한지 검토',
    criteria: {
      isAdultOnly: {
        shouldApply: [
          '성적 내용, 야한 농담',
          '부부 관계, 19금 주제',
          '음주 행동/상태 묘사 ("취하면...", "술에 취해서...")',
        ],
        shouldNotApply: [
          '소주 vs 맥주 (단순 선호 비교)',
          '회식 참석 여부 (직장 상황)',
          '술값 지출 비교 (소비 패턴)',
        ],
      },
      minAge: {
        '20s': [
          '음주 관련 선호',
          '직장/회식 맥락',
          '연애/결혼 주제',
        ],
      },
    },
  },
  'content-quality': {
    title: '콘텐츠 품질 검수',
    description: '정확성, 명확성, 밸런스 검토',
    criteria: {},
  },
  'accuracy': {
    title: '정보 정확성 검수',
    description: '사실 관계, 수치 정확성 검토',
    criteria: {},
  },
  'sensitive': {
    title: '민감 콘텐츠 검수',
    description: '정치, 종교, 논쟁 주제 검토',
    criteria: {},
  },
};

// ============================================================================
// 유틸리티 함수
// ============================================================================

/** 검수 통계 계산 */
export function calculateReviewStats(items: ContentReviewItem[]): ReviewStats {
  const stats: ReviewStats = {
    total: items.length,
    pending: 0,
    approved: 0,
    modified: 0,
    rejected: 0,
    byType: {
      'age-restriction': 0,
      'content-quality': 0,
      'accuracy': 0,
      'sensitive': 0,
    },
  };

  items.forEach(item => {
    stats[item.status]++;
    stats.byType[item.reviewType]++;
  });

  return stats;
}

/** 대기 중인 검수 항목 필터 */
export function getPendingReviews(items: ContentReviewItem[]): ContentReviewItem[] {
  return items.filter(item => item.status === 'pending');
}

/** 타입별 검수 항목 필터 */
export function getReviewsByType(
  items: ContentReviewItem[],
  type: ReviewType
): ContentReviewItem[] {
  return items.filter(item => item.reviewType === type);
}

// ============================================================================
// 알림 시스템
// ============================================================================

export interface ReviewAlertConfig {
  // 임계값 알림: 대기 항목이 N개 이상이면 알림
  thresholdCount: number;
  // 정기 알림: 대기 항목이 1개 이상이면 매주 월요일 알림
  weeklyAlertEnabled: boolean;
  weeklyAlertDay: number;  // 0 = 일요일, 1 = 월요일, ...
  // 마지막 알림 일시
  lastAlertAt?: string;
}

export const REVIEW_ALERT_CONFIG: ReviewAlertConfig = {
  thresholdCount: 50,        // 50개 이상이면 즉시 알림
  weeklyAlertEnabled: true,  // 매주 월요일 알림 활성화
  weeklyAlertDay: 1,         // 월요일
};

/**
 * 알림이 필요한지 확인
 */
export function shouldShowAlert(
  pendingCount: number,
  config: ReviewAlertConfig = REVIEW_ALERT_CONFIG
): { shouldAlert: boolean; reason: 'threshold' | 'weekly' | null } {
  // 1. 임계값 초과
  if (pendingCount >= config.thresholdCount) {
    return { shouldAlert: true, reason: 'threshold' };
  }

  // 2. 매주 월요일 알림
  if (config.weeklyAlertEnabled && pendingCount > 0) {
    const today = new Date();
    const dayOfWeek = today.getDay();

    if (dayOfWeek === config.weeklyAlertDay) {
      // 오늘 이미 알림을 보냈는지 확인
      if (config.lastAlertAt) {
        const lastAlert = new Date(config.lastAlertAt);
        const isSameDay =
          lastAlert.getFullYear() === today.getFullYear() &&
          lastAlert.getMonth() === today.getMonth() &&
          lastAlert.getDate() === today.getDate();
        if (isSameDay) return { shouldAlert: false, reason: null };
      }
      return { shouldAlert: true, reason: 'weekly' };
    }
  }

  return { shouldAlert: false, reason: null };
}

/**
 * 알림 메시지 생성
 */
export function getAlertMessage(
  pendingCount: number,
  reason: 'threshold' | 'weekly'
): string {
  if (reason === 'threshold') {
    return `⚠️ 검수 대기 항목이 ${pendingCount}개입니다. 검토가 필요합니다.`;
  }
  return `📋 주간 알림: 검수 대기 항목 ${pendingCount}개가 있습니다.`;
}
