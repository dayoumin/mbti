// ============================================================================
// 콘텐츠 유효성 검사 유틸리티
// ============================================================================
// timeSensitivity 기반 콘텐츠 만료 여부 확인

import type { TimeSensitivityMeta, TimeSensitivity } from '@/data/content/types';

// ============================================================================
// 상수
// ============================================================================

/** 민감도별 유효기간 (년 단위) */
const VALIDITY_PERIODS: Record<TimeSensitivity, number> = {
  high: 2,    // 금액/수치 → 2년
  medium: 3,  // 트렌드/연예인 → 3년
  low: 4,     // 가치관 → 4년
  none: Infinity,  // 무제한
};

/** 검토 필요 임박 기간 (개월 단위) */
const REVIEW_WARNING_MONTHS = 6;

// ============================================================================
// 유틸리티 함수
// ============================================================================

/**
 * validUntil 자동 계산
 * @param sourceYear 데이터 기준 연도
 * @param sensitivity 민감도 레벨
 * @returns YYYY-MM 형식 문자열
 */
export function calculateValidUntil(
  sourceYear: number,
  sensitivity: TimeSensitivity
): string | undefined {
  if (sensitivity === 'none') return undefined;

  const validityYears = VALIDITY_PERIODS[sensitivity];
  const expiryYear = sourceYear + validityYears;

  return `${expiryYear}-12`;
}

/**
 * 콘텐츠 유효성 상태 확인
 */
export type ValidityStatus = 'valid' | 'review-needed' | 'expired' | 'unknown';

export interface ValidityCheckResult {
  status: ValidityStatus;
  validUntil?: string;
  daysRemaining?: number;
  message?: string;
}

/**
 * timeSensitivity 기반 콘텐츠 유효성 검사
 * @param timeSensitivity 시간 민감도 메타데이터
 * @param currentDate 현재 날짜 (테스트용, 기본: 오늘)
 */
export function checkContentValidity(
  timeSensitivity?: TimeSensitivityMeta,
  currentDate: Date = new Date()
): ValidityCheckResult {
  // timeSensitivity 없으면 unknown
  if (!timeSensitivity) {
    return {
      status: 'unknown',
      message: 'timeSensitivity 메타데이터 없음',
    };
  }

  const { sensitivity, sourceYear, validUntil: explicitValidUntil } = timeSensitivity;

  // none = 무제한 유효
  if (sensitivity === 'none') {
    return {
      status: 'valid',
      message: '시간 제한 없음',
    };
  }

  // validUntil 계산 (명시적으로 지정되어 있으면 사용, 아니면 자동 계산)
  const validUntil = explicitValidUntil || calculateValidUntil(sourceYear, sensitivity);

  if (!validUntil) {
    return {
      status: 'unknown',
      message: 'validUntil 계산 실패',
    };
  }

  // YYYY-MM 형식 파싱
  const [year, month] = validUntil.split('-').map(Number);
  const expiryDate = new Date(year, month - 1, 1); // 해당 월 1일
  const diffMs = expiryDate.getTime() - currentDate.getTime();
  const daysRemaining = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 만료됨
  if (daysRemaining < 0) {
    return {
      status: 'expired',
      validUntil,
      daysRemaining,
      message: `${-daysRemaining}일 전 만료됨`,
    };
  }

  // 검토 필요 (6개월 이내)
  const reviewWarningDays = REVIEW_WARNING_MONTHS * 30;
  if (daysRemaining <= reviewWarningDays) {
    return {
      status: 'review-needed',
      validUntil,
      daysRemaining,
      message: `${daysRemaining}일 후 만료 (검토 필요)`,
    };
  }

  // 유효함
  return {
    status: 'valid',
    validUntil,
    daysRemaining,
    message: `${daysRemaining}일 후 만료`,
  };
}

/**
 * 콘텐츠 배열 필터링 - 유효한 콘텐츠만 반환
 * @param contents 콘텐츠 배열
 * @param includeReviewNeeded 검토 필요 콘텐츠 포함 여부 (기본: true)
 */
export function filterValidContents<T extends { meta?: { timeSensitivity?: TimeSensitivityMeta } }>(
  contents: T[],
  includeReviewNeeded = true
): T[] {
  return contents.filter((content) => {
    const result = checkContentValidity(content.meta?.timeSensitivity);

    if (result.status === 'expired') return false;
    if (result.status === 'review-needed' && !includeReviewNeeded) return false;

    return true; // valid, review-needed(옵션), unknown 포함
  });
}

/**
 * 콘텐츠 배열 통계
 */
export interface ContentValidityStats {
  total: number;
  valid: number;
  reviewNeeded: number;
  expired: number;
  unknown: number;
}

/**
 * 콘텐츠 배열의 유효성 통계 계산
 */
export function getContentValidityStats<
  T extends { meta?: { timeSensitivity?: TimeSensitivityMeta } }
>(contents: T[]): ContentValidityStats {
  const stats: ContentValidityStats = {
    total: contents.length,
    valid: 0,
    reviewNeeded: 0,
    expired: 0,
    unknown: 0,
  };

  contents.forEach((content) => {
    const result = checkContentValidity(content.meta?.timeSensitivity);

    switch (result.status) {
      case 'valid':
        stats.valid++;
        break;
      case 'review-needed':
        stats.reviewNeeded++;
        break;
      case 'expired':
        stats.expired++;
        break;
      case 'unknown':
        stats.unknown++;
        break;
    }
  });

  return stats;
}

/**
 * 만료 임박 콘텐츠 정렬 (남은 일수 적은 순)
 */
export function sortByExpiryDate<T extends { meta?: { timeSensitivity?: TimeSensitivityMeta } }>(
  contents: T[]
): T[] {
  return [...contents].sort((a, b) => {
    const resultA = checkContentValidity(a.meta?.timeSensitivity);
    const resultB = checkContentValidity(b.meta?.timeSensitivity);

    // 둘 다 유효하지 않으면 순서 유지
    if (!resultA.daysRemaining && !resultB.daysRemaining) return 0;
    if (!resultA.daysRemaining) return 1;
    if (!resultB.daysRemaining) return -1;

    // 남은 일수 적은 순 (오름차순)
    return resultA.daysRemaining - resultB.daysRemaining;
  });
}
