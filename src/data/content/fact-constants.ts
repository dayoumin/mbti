/**
 * 팩트 시스템 상수 중앙화
 *
 * 모든 팩트 관련 필드명, 기준값은 이 파일에서 정의합니다.
 * 문서/코드에서 하드코딩하지 말고 이 상수를 참조하세요.
 */

// ============================================================================
// 필드명 상수
// ============================================================================

/**
 * 퀴즈에서 팩트 참조할 때 사용하는 필드명
 * - KnowledgeQuiz.source 필드에 팩트 ID 저장
 * - 예: source: 'cat-fact-001'
 */
export const FACT_SOURCE_FIELD = 'source' as const;

/**
 * 팩트가 없는 일반 지식 퀴즈의 source 값
 */
export const GENERAL_KNOWLEDGE_SOURCE = 'general-knowledge' as const;

// ============================================================================
// 팩트 필요 카테고리
// ============================================================================

/**
 * 팩트 검증이 필수인 카테고리
 * - 수의학, 식물학, 식품 등 정확도가 중요한 정보
 */
export const FACT_REQUIRED_CATEGORIES = [
  'cat', 'dog', 'rabbit', 'hamster',  // 반려동물
  'plant',                             // 식물
  'coffee', 'alcohol',                 // 식품/음료
] as const;

export type FactRequiredCategory = typeof FACT_REQUIRED_CATEGORIES[number];

/**
 * 카테고리가 팩트 필수인지 확인
 */
export function isFactRequiredCategory(category: string): category is FactRequiredCategory {
  return FACT_REQUIRED_CATEGORIES.includes(category as FactRequiredCategory);
}

// ============================================================================
// 검증 주기 (일 단위)
// ============================================================================

/**
 * 팩트 타입별 검증 주기
 * - constant: 변하지 않는 사실 (체온, 정상 수치 등) → 검증 불필요
 * - guideline: 가이드라인 기반 (백신 프로토콜 등) → 1년마다
 * - statistic: 통계 기반 정보 → 6개월마다
 */
export const FACT_VERIFICATION_DAYS = {
  /** 변하지 않는 상수 (체온, 해부학적 특성 등) - 재검증 불필요 */
  constant: Infinity,
  /** 가이드라인 기반 (백신, 돌봄 권장사항 등) - 1년마다 */
  guideline: 365,
  /** 통계/연구 기반 - 6개월마다 */
  statistic: 180,
} as const;

export type FactType = keyof typeof FACT_VERIFICATION_DAYS;

/**
 * UI 상태 기준 (factType이 없는 레거시 팩트용)
 * - fresh: 6개월 이내 (180일)
 * - aging: 6개월~1년 (180~365일)
 * - stale: 1년 초과
 */
export const VERIFICATION_STATUS_DAYS = {
  fresh: 180,   // 6개월 이내
  aging: 365,   // 1년 이내
} as const;

/**
 * 검증일 기준 상태 반환
 */
export function getVerificationStatus(
  verifiedDate: string,
  factType?: FactType
): 'fresh' | 'aging' | 'stale' | 'constant' {
  // constant 타입은 항상 fresh
  if (factType === 'constant') return 'constant';

  const days = getDaysSince(verifiedDate);
  if (days < 0) return 'stale';  // 미래 날짜 = 오류

  // factType이 있으면 해당 기준 사용
  if (factType) {
    const threshold = FACT_VERIFICATION_DAYS[factType];
    return days <= threshold ? 'fresh' : 'stale';
  }

  // 레거시: 기본 기준 사용
  if (days <= VERIFICATION_STATUS_DAYS.fresh) return 'fresh';
  if (days <= VERIFICATION_STATUS_DAYS.aging) return 'aging';
  return 'stale';
}

/**
 * 날짜로부터 경과 일수 계산
 * - 미래 날짜면 음수 반환 (오류 감지용)
 */
export function getDaysSince(dateString: string): number {
  if (!dateString) return 999;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();  // Math.abs 제거!
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// ============================================================================
// 팩트 ID 패턴
// ============================================================================

/**
 * 팩트 ID 정규식
 * 형식: {category}-fact-{번호}
 * 예: cat-fact-001, dog-fact-012
 */
export const FACT_ID_PATTERN = /^[a-z]+-fact-\d{3,}$/;

/**
 * 팩트 ID 형식 검증
 */
export function isValidFactId(id: string): boolean {
  return FACT_ID_PATTERN.test(id);
}

/**
 * 팩트 ID 생성
 */
export function createFactId(category: string, number: number): string {
  return `${category}-fact-${String(number).padStart(3, '0')}`;
}

// ============================================================================
// 팩트 파일 경로
// ============================================================================

export const FACTS_DIRECTORY = 'research/facts' as const;

export function getFactFilePath(category: string): string {
  return `${FACTS_DIRECTORY}/${category}.md`;
}