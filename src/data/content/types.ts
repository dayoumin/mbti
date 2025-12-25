// ============================================================================
// 카테고리 타입 import
// ============================================================================

import type { ContentCategory, CommunityCategory } from './categories';

// 하위 호환을 위한 re-export
export type { ContentCategory, CommunityCategory };

// ============================================================================
// 시간 민감도 (Time Sensitivity) - 콘텐츠 유효기간 관리
// ============================================================================

/**
 * 콘텐츠 시간 민감도 레벨
 * - high: 금액/수치 기반 (축의금 평균 등) - 2년 유효
 * - medium: 트렌드 기반 (MZ 인식, 선호도 등) - 3년 유효
 * - low: 상황 판단 (밸런스게임 등) - 4년 유효
 * - none: 보편적 성향 (MBTI, 성격 테스트) - 무기한
 */
export type TimeSensitivity = 'high' | 'medium' | 'low' | 'none';

/**
 * 콘텐츠 검토 상태 (유효기간 관련)
 * - current: 현재 유효
 * - needs_review: 검토 필요 (유효기간 임박 또는 초과)
 * - outdated: 만료됨 (노출 중지 권장)
 */
export type ValidityStatus = 'current' | 'needs_review' | 'outdated';

/**
 * 시간 민감도별 유효기간 (년)
 */
export const VALIDITY_PERIODS: Record<TimeSensitivity, number | null> = {
  high: 2,      // 금액/수치 → 2년
  medium: 3,    // 트렌드 → 3년
  low: 4,       // 상황 판단 → 4년
  none: null,   // 보편 성향 → 무기한
};

/**
 * 시간 민감도 메타데이터
 */
export interface TimeSensitivityMeta {
  sensitivity: TimeSensitivity;   // 민감도 레벨
  sourceYear: number;             // 데이터 기준 연도 (예: 2025)
  validUntil?: string;            // 유효 기한 (YYYY-MM, 자동 계산 가능)
  lastReviewedAt?: string;        // 마지막 검토일 (YYYY-MM-DD)
  reviewNote?: string;            // 검토 메모
}

// ============================================================================
// 팩트 참조 타입
// ============================================================================

/**
 * 팩트 필요 카테고리 (수의학/식물학/식품 등 정확도 필요)
 */
export type FactRequiredCategory =
  | 'cat' | 'dog' | 'rabbit' | 'hamster' | 'bird'  // 반려동물
  | 'plant'                                         // 식물
  | 'coffee' | 'alcohol';                           // 식품/음료

/**
 * 팩트 ID 패턴: {category}-fact-{번호}
 * 예: cat-fact-001, dog-fact-002, plant-fact-003
 */
export type FactId = `${FactRequiredCategory}-fact-${string}`;

/**
 * 팩트 참조 정보
 */
export interface FactReference {
  factId: FactId;           // 팩트 ID
  verifiedDate?: string;    // 검증일 (YYYY-MM-DD)
}

// ============================================================================
// 연령 등급 시스템 (단순화)
// ============================================================================

/**
 * 콘텐츠 연령 등급 (단순 3단계)
 * - all: 전체 이용가 (기본값)
 * - kids: 어린이 특화 (12세 이하 추천, 10대에게 부스트)
 * - adult: 성인 전용 (20세 이상, 술/도박 등)
 */
export type AgeRating = 'all' | 'kids' | 'adult';

/**
 * 연령 제한 사유 (투명성을 위해)
 */
export type AgeRestrictionReason =
  | 'alcohol'      // 주류 관련
  | 'gambling';    // 도박 관련

// ============================================================================
// 콘텐츠 메타데이터 (타겟팅, 연령 제한 등)
// ============================================================================

// AgeGroup, Gender는 DemographicService에서 정의 (중복 방지)
import type { AgeGroup, Gender } from '@/services/DemographicService';
// re-export하여 content 모듈에서도 사용 가능
export type { AgeGroup, Gender };

/**
 * 콘텐츠 검수 상태
 * - pending: 검수 대기 (노출 안됨)
 * - approved: 승인됨 (노출됨)
 * - rejected: 거부됨 (노출 안됨)
 * - 없으면 기본값은 approved (기존 콘텐츠 호환)
 */
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

/**
 * 콘텐츠 메타데이터 - 퀴즈, 투표, 테스트 생성 시 포함
 */
export interface ContentMeta {
  // ========== 연령 등급 (신규 - 권장) ==========
  ageRating?: AgeRating;              // 연령 등급 (기본: 'all')
  ageRestrictionReason?: AgeRestrictionReason;  // 제한 사유

  // ========== 레거시 연령 제한 (하위 호환) ==========
  minAge?: AgeGroup;           // 최소 연령 (예: '20s' = 20대 이상)
  allowedAges?: AgeGroup[];    // 허용 연령 목록 (더 세밀한 제어)

  // 타겟 그룹 (없으면 전체 대상)
  targetGender?: Gender[];     // 타겟 성별 (예: ['female'] = 여성 추천)
  targetAges?: AgeGroup[];     // 타겟 연령대 (예: ['20s', '30s'])

  // 콘텐츠 속성
  isAdultOnly?: boolean;       // 성인 전용 (19금 콘텐츠만)
  isSensitive?: boolean;       // 민감한 주제 (정치, 종교 등 - 필터링용)

  // 검수 상태
  reviewStatus?: ReviewStatus; // 검수 상태 (없으면 approved)
  reviewNote?: string;         // 검수 메모

  // 추천/노출 가중치
  priority?: number;           // 우선순위 (높을수록 먼저 노출, 기본 0)
  seasonal?: string[];         // 시즌 태그 (예: ['christmas', 'summer'])

  // 생성 정보
  createdAt?: string;          // 생성 일시
  createdBy?: 'manual' | 'ai'; // 생성 방식

  // 시간 민감도 (유효기간 관리)
  timeSensitivity?: TimeSensitivityMeta;
}

// ============================================================================
// 지식 퀴즈
// ============================================================================

/**
 * 지식 퀴즈 기본 필드 (source 제외)
 */
interface KnowledgeQuizBase {
  id: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  factRef?: FactReference;      // 팩트 DB 참조 (선택)
  tags?: string[];              // 개인화 추천용 태그
  meta?: ContentMeta;           // 타겟팅/연령 제한 메타데이터
}

/**
 * 팩트 필요 카테고리 지식 퀴즈 - source 필수!
 * 카테고리: cat, dog, rabbit, hamster, plant, coffee, alcohol
 */
interface FactRequiredKnowledgeQuiz extends KnowledgeQuizBase {
  category: FactRequiredCategory;
  source: string;               // 필수! 팩트 ID 또는 'general-knowledge'
}

/**
 * 일반 카테고리 지식 퀴즈 - source 선택
 */
interface GeneralKnowledgeQuiz extends KnowledgeQuizBase {
  category: Exclude<ContentCategory, FactRequiredCategory>;
  source?: string;              // 선택
}

/**
 * 지식 퀴즈 통합 타입
 * - 팩트 필요 카테고리: source 필수
 * - 일반 카테고리: source 선택
 */
export type KnowledgeQuiz = FactRequiredKnowledgeQuiz | GeneralKnowledgeQuiz;

// ============================================================================
// 시나리오 퀴즈 (집사점수, 견주력 등)
// ============================================================================

export interface ScenarioQuiz {
  id: string;
  category: ContentCategory;
  title: string;
  description: string;
  emoji: string;
  questions: ScenarioQuestion[];
  results: ScenarioResult[];
  tags?: string[];  // 개인화 추천용 태그
  meta?: ContentMeta;  // 타겟팅/연령 제한 메타데이터
}

export interface ScenarioQuestion {
  id: string;
  situation: string;
  question: string;
  options: {
    id: string;
    text: string;
    points: number;
    feedback?: string;
  }[];
}

export interface ScenarioResult {
  minScore: number;
  maxScore: number;
  grade: string;
  title: string;
  emoji: string;
  description: string;
  tips?: string[];
}

// ============================================================================
// VS 투표
// ============================================================================

export interface VSPollOption {
  id: 'a' | 'b';
  text: string;
  emoji: string;
}

export interface VSPoll {
  id: string;
  category: ContentCategory;
  question: string;
  optionA: VSPollOption;
  optionB: VSPollOption;
  tags?: string[];
  meta?: ContentMeta;  // 타겟팅/연령 제한 메타데이터
}

// ============================================================================
// 선택 투표
// ============================================================================

export interface ChoicePoll {
  id: string;
  category: ContentCategory;
  question: string;
  options: {
    id: string;
    text: string;
    emoji?: string;
  }[];
  /**
   * 복수 선택 허용 여부
   * - true: 여러 옵션 선택 가능 (POST 시 optionIds 배열 또는 allowMultiple: true 전달)
   * - false/undefined: 단일 선택만 (기존 동작)
   */
  allowMultiple?: boolean;
  tags?: string[];
  meta?: ContentMeta;  // 타겟팅/연령 제한 메타데이터
}

// ============================================================================
// 상황별 반응 투표 (Situation-Reaction)
// ============================================================================

export type SituationCategory = 'relationship' | 'work' | 'social' | 'awkward';
export type ReactionTag = 'cool' | 'emotional' | 'rational' | 'avoidant' |
                          'confrontational' | 'humorous' | 'caring' | 'passive';

export interface SituationReaction {
  id: string;                    // "situation-reaction-{category}-{번호}"
  type: 'situation-reaction';
  category: SituationCategory;
  situation: string;             // 상황 설명 (1-2문장)
  question: string;              // "이럴 때 나는?"
  options: {
    id: string;                  // 'a', 'b', 'c', 'd'
    text: string;                // 반응 텍스트
    emoji: string;               // 반응 이모지
    tag: ReactionTag;            // 반응 유형 태그
  }[];
  personalityMapping?: {         // 성격 유형별 예상 반응 (통계용)
    [personalityType: string]: string;  // MBTI 등 -> optionId
  };
  tags?: string[];               // 검색용 태그
  meta?: ContentMeta;
}

// ============================================================================
// 통합 콘텐츠 타입
// ============================================================================

export type QuizContent = KnowledgeQuiz | ScenarioQuiz;
export type PollContent = VSPoll | ChoicePoll | SituationReaction;

// ============================================================================
// 운세 콘텐츠 (Fortune Content)
// ============================================================================

export type ZodiacSign =
  | 'rat' | 'ox' | 'tiger' | 'rabbit' | 'dragon' | 'snake'
  | 'horse' | 'goat' | 'monkey' | 'rooster' | 'dog' | 'pig';

export type Constellation =
  | 'aries' | 'taurus' | 'gemini' | 'cancer' | 'leo' | 'virgo'
  | 'libra' | 'scorpio' | 'sagittarius' | 'capricorn' | 'aquarius' | 'pisces';

/**
 * 12지신 띠별 운세
 */
export interface ZodiacFortune {
  id: string;
  sign: ZodiacSign;
  name: string;           // 한글명 (쥐, 소, 호랑이...)
  emoji: string;
  years: number[];        // 해당 띠 연도 (예: [1996, 2008, 2020])

  // 2025년 을사년 운세
  yearly: {
    year: number;         // 2025
    theme: string;        // 핵심 테마 (예: "은밀한 성장")
    message: string;      // 운세 메시지
    keywords: string[];   // 키워드 3개
    luckyColor?: string;
    luckyNumber?: number;
  };

  // 기본 성격 (투표/퀴즈용)
  personality: {
    traits: string[];     // 성격 키워드 3-5개
    strengths: string[];  // 장점 2-3개
    growth: string[];     // 성장 포인트 2-3개 (부정표현 X)
  };

  meta?: ContentMeta;
}

/**
 * 별자리 투표 게임
 */
export interface ZodiacPoll {
  id: string;
  type: 'zodiac-poll';
  category: 'zodiac';
  question: string;       // "좀비 아포칼립스에서 살아남을 별자리는?"
  scenario?: string;      // 상황 설명 (선택)
  options: {
    id: string;
    sign: Constellation | ZodiacSign;
    text: string;         // "전갈자리 (독종)"
    emoji: string;
    reason?: string;      // 왜 이 별자리인지 (결과 해설용)
  }[];
  explanation?: string;   // 결과 후 점성학적 해설
  tags?: string[];
  meta?: ContentMeta;
}

/**
 * 오늘의 운세 메시지 템플릿
 */
export interface DailyFortuneMessage {
  id: string;
  category: 'general' | 'love' | 'money' | 'work' | 'health';
  tone: 'positive' | 'cautious' | 'encouraging';
  message: string;
  advice?: string;
  luckyItem?: string;
}

export type FortuneContent = ZodiacFortune | ZodiacPoll | DailyFortuneMessage;

// 메타데이터가 있는 콘텐츠 타입
export type ContentWithMeta = { meta?: ContentMeta };

// ============================================================================
// 메타데이터 기반 필터링 유틸리티
// ============================================================================

const AGE_ORDER: AgeGroup[] = ['~9', '10s', '20s', '30s', '40s+'];

/**
 * 미성년자인지 확인 (~9 또는 10대)
 */
export function isMinor(ageGroup?: AgeGroup): boolean {
  return ageGroup === '~9' || ageGroup === '10s';
}

/**
 * 콘텐츠가 해당 연령에 적합한지 확인
 *
 * 필터링 로직 (단순):
 * - adult 콘텐츠: 미성년자(~9, 10대) 차단, 연령 미확인 시에도 차단
 * - kids/all 콘텐츠: 모두 허용
 */
export function isContentAllowedForAge<T extends ContentWithMeta>(
  content: T,
  ageGroup?: AgeGroup
): boolean {
  const meta = content.meta;

  // 메타데이터 없으면 전체 허용
  if (!meta) return true;

  // 1. ageRating: 'adult' 또는 isAdultOnly 체크
  const isAdult = meta.ageRating === 'adult' || meta.isAdultOnly;
  if (isAdult) {
    // 미성년자이거나 연령 미확인 → 차단
    if (!ageGroup || isMinor(ageGroup)) return false;
  }

  // 2. 레거시: 최소 연령 체크
  if (meta.minAge) {
    if (!ageGroup) return false;
    const minIndex = AGE_ORDER.indexOf(meta.minAge);
    const userIndex = AGE_ORDER.indexOf(ageGroup);
    if (userIndex < minIndex) return false;
  }

  // 3. 레거시: 허용 연령 목록 체크
  if (meta.allowedAges && meta.allowedAges.length > 0) {
    if (!ageGroup || !meta.allowedAges.includes(ageGroup)) return false;
  }

  return true;
}

/**
 * Kids 콘텐츠 부스트 계수 반환
 * - 10세 미만(~9)에게만 kids 콘텐츠 우선 노출
 */
export function getKidsBoostFactor<T extends ContentWithMeta>(
  content: T,
  ageGroup?: AgeGroup
): number {
  const meta = content.meta;

  // kids 콘텐츠 + 10세 미만 사용자 → 30% 부스트
  if (meta?.ageRating === 'kids' && ageGroup === '~9') {
    return 1.3;
  }

  return 1.0;
}

/**
 * 콘텐츠가 해당 사용자에게 추천되는지 확인 (타겟 매칭)
 */
export function isContentTargeted<T extends ContentWithMeta>(
  content: T,
  ageGroup?: AgeGroup,
  gender?: Gender
): boolean {
  const meta = content.meta;

  // 메타데이터 없으면 전체 대상
  if (!meta) return true;

  // 타겟 연령대 체크 (있으면 해당 연령만 추천)
  if (meta.targetAges && meta.targetAges.length > 0) {
    if (!ageGroup || !meta.targetAges.includes(ageGroup)) return false;
  }

  // 타겟 성별 체크 (있으면 해당 성별만 추천)
  if (meta.targetGender && meta.targetGender.length > 0) {
    if (!gender || !meta.targetGender.includes(gender)) return false;
  }

  return true;
}

/**
 * 콘텐츠가 검수 승인되었는지 확인
 * - reviewStatus 없으면 기본값 approved (기존 콘텐츠 호환)
 */
export function isContentApproved<T extends ContentWithMeta>(content: T): boolean {
  const status = content.meta?.reviewStatus;
  // undefined = approved (기존 콘텐츠 호환)
  return status === undefined || status === 'approved';
}

/**
 * 콘텐츠 목록을 연령/성별 기준으로 필터링
 */
export function filterContentByDemographic<T extends ContentWithMeta>(
  contents: T[],
  ageGroup?: AgeGroup,
  gender?: Gender,
  options?: { includeNonTargeted?: boolean; includePending?: boolean }
): T[] {
  return contents.filter(content => {
    // 0. 검수 상태 체크 (기본: 승인된 콘텐츠만)
    if (!options?.includePending && !isContentApproved(content)) return false;

    // 1. 연령 제한 체크 (필수)
    if (!isContentAllowedForAge(content, ageGroup)) return false;

    // 2. 타겟 매칭 체크 (옵션)
    if (!options?.includeNonTargeted) {
      // 타겟이 지정된 콘텐츠는 타겟 매칭 필요
      const meta = content.meta;
      if (meta?.targetAges || meta?.targetGender) {
        return isContentTargeted(content, ageGroup, gender);
      }
    }

    return true;
  });
}

/**
 * 검수 대기 중인 콘텐츠 필터
 */
export function filterPendingContent<T extends ContentWithMeta>(contents: T[]): T[] {
  return contents.filter(content => content.meta?.reviewStatus === 'pending');
}

/**
 * 콘텐츠를 우선순위로 정렬
 */
export function sortContentByPriority<T extends ContentWithMeta>(contents: T[]): T[] {
  return [...contents].sort((a, b) => {
    const priorityA = a.meta?.priority ?? 0;
    const priorityB = b.meta?.priority ?? 0;
    return priorityB - priorityA; // 높은 우선순위가 먼저
  });
}

// ============================================================================
// 시간 민감도 기반 유효기간 검증 유틸리티
// ============================================================================

/**
 * sourceYear와 sensitivity로 validUntil 자동 계산
 * @param sourceYear 데이터 기준 연도
 * @param sensitivity 시간 민감도
 * @returns YYYY-12 형식의 유효기한 (none이면 null)
 */
export function calculateValidUntil(
  sourceYear: number,
  sensitivity: TimeSensitivity
): string | null {
  const period = VALIDITY_PERIODS[sensitivity];
  if (period === null) return null;
  return `${sourceYear + period}-12`;
}

/**
 * 콘텐츠의 유효 상태 확인
 * @param meta 시간 민감도 메타데이터
 * @param currentDate 현재 날짜 (테스트용, 기본값 현재)
 * @returns 유효 상태
 */
export function getValidityStatus(
  meta?: TimeSensitivityMeta,
  currentDate: Date = new Date()
): ValidityStatus {
  // 메타 없거나 sensitivity가 none이면 항상 유효
  if (!meta || meta.sensitivity === 'none') return 'current';

  // validUntil 계산 (명시적 값 우선, 없으면 자동 계산)
  const validUntil = meta.validUntil
    ?? calculateValidUntil(meta.sourceYear, meta.sensitivity);

  if (!validUntil) return 'current';

  // YYYY-MM 형식 파싱
  const [year, month] = validUntil.split('-').map(Number);
  const expiryDate = new Date(year, month - 1, 1); // 해당 월 1일

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  // 만료 6개월 전부터 검토 필요
  const warningDate = new Date(year, month - 7, 1); // 6개월 전

  if (currentDate >= expiryDate) {
    return 'outdated';
  } else if (currentDate >= warningDate) {
    return 'needs_review';
  }

  return 'current';
}

/**
 * 콘텐츠가 현재 유효한지 확인 (노출 가능 여부)
 */
export function isContentValid<T extends ContentWithMeta>(
  content: T,
  currentDate?: Date
): boolean {
  const status = getValidityStatus(content.meta?.timeSensitivity, currentDate);
  // outdated만 노출 중지, needs_review는 노출하되 경고
  return status !== 'outdated';
}

/**
 * 콘텐츠 목록에서 유효한 것만 필터링
 */
export function filterValidContent<T extends ContentWithMeta>(
  contents: T[],
  currentDate?: Date
): T[] {
  return contents.filter(content => isContentValid(content, currentDate));
}

/**
 * 검토가 필요한 콘텐츠 필터 (대시보드용)
 */
export function filterNeedsReviewContent<T extends ContentWithMeta>(
  contents: T[],
  currentDate?: Date
): T[] {
  return contents.filter(content => {
    const status = getValidityStatus(content.meta?.timeSensitivity, currentDate);
    return status === 'needs_review' || status === 'outdated';
  });
}

/**
 * 유효 상태별 콘텐츠 그룹핑 (대시보드용)
 */
export function groupContentByValidity<T extends ContentWithMeta>(
  contents: T[],
  currentDate?: Date
): Record<ValidityStatus, T[]> {
  const result: Record<ValidityStatus, T[]> = {
    current: [],
    needs_review: [],
    outdated: [],
  };

  for (const content of contents) {
    const status = getValidityStatus(content.meta?.timeSensitivity, currentDate);
    result[status].push(content);
  }

  return result;
}

/**
 * TimeSensitivityMeta 생성 헬퍼
 * @param sensitivity 민감도 레벨
 * @param sourceYear 데이터 기준 연도 (기본: 현재 연도)
 */
export function createTimeSensitivityMeta(
  sensitivity: TimeSensitivity,
  sourceYear: number = new Date().getFullYear()
): TimeSensitivityMeta {
  return {
    sensitivity,
    sourceYear,
    validUntil: calculateValidUntil(sourceYear, sensitivity) ?? undefined,
  };
}
