// ============================================================================
// 콘텐츠 카테고리 통합 타입
// ============================================================================

export type ContentCategory =
  // 반려동물
  | 'cat' | 'dog' | 'rabbit' | 'hamster'
  // 특수동물
  | 'fish' | 'bird' | 'reptile' | 'smallPet'
  // 라이프스타일
  | 'plant' | 'coffee' | 'lifestyle' | 'alcohol'
  // 심리/관계
  | 'personality' | 'love' | 'relationship'
  // 일반
  | 'general';

// CommunityCategory는 ContentCategory의 alias (하위 호환)
export type CommunityCategory = ContentCategory;

// ============================================================================
// 콘텐츠 메타데이터 (타겟팅, 연령 제한 등)
// ============================================================================

// AgeGroup, Gender는 DemographicService에서 정의 (중복 방지)
import type { AgeGroup, Gender } from '@/services/DemographicService';
// re-export하여 content 모듈에서도 사용 가능
export type { AgeGroup, Gender };

/**
 * 콘텐츠 메타데이터 - 퀴즈, 투표, 테스트 생성 시 포함
 */
export interface ContentMeta {
  // 연령 제한 (없으면 전체 연령)
  minAge?: AgeGroup;           // 최소 연령 (예: '20s' = 20대 이상)
  allowedAges?: AgeGroup[];    // 허용 연령 목록 (더 세밀한 제어)

  // 타겟 그룹 (없으면 전체 대상)
  targetGender?: Gender[];     // 타겟 성별 (예: ['female'] = 여성 추천)
  targetAges?: AgeGroup[];     // 타겟 연령대 (예: ['20s', '30s'])

  // 콘텐츠 속성
  isAdultOnly?: boolean;       // 성인 전용 (술 등)
  isSensitive?: boolean;       // 민감한 주제 (정치, 종교 등 - 필터링용)

  // 추천/노출 가중치
  priority?: number;           // 우선순위 (높을수록 먼저 노출, 기본 0)
  seasonal?: string[];         // 시즌 태그 (예: ['christmas', 'summer'])

  // 생성 정보
  createdAt?: string;          // 생성 일시
  createdBy?: 'manual' | 'ai'; // 생성 방식
}

// ============================================================================
// 지식 퀴즈
// ============================================================================

export interface KnowledgeQuiz {
  id: string;
  category: ContentCategory;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  difficulty: 1 | 2 | 3;
  source?: string;
  meta?: ContentMeta;  // 타겟팅/연령 제한 메타데이터
}

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

// 메타데이터가 있는 콘텐츠 타입
export type ContentWithMeta = { meta?: ContentMeta };

// ============================================================================
// 메타데이터 기반 필터링 유틸리티
// ============================================================================

const AGE_ORDER: AgeGroup[] = ['10s', '20s', '30s', '40s+'];

/**
 * 콘텐츠가 해당 연령에 적합한지 확인
 */
export function isContentAllowedForAge<T extends ContentWithMeta>(
  content: T,
  ageGroup?: AgeGroup
): boolean {
  const meta = content.meta;

  // 메타데이터 없으면 전체 허용
  if (!meta) return true;

  // 성인 전용 콘텐츠 체크
  if (meta.isAdultOnly) {
    if (!ageGroup || ageGroup === '10s') return false;
  }

  // 최소 연령 체크 (안전 우선: minAge 있으면 연령 확인 필수)
  if (meta.minAge) {
    if (!ageGroup) return false; // 연령 미확인 시 차단
    const minIndex = AGE_ORDER.indexOf(meta.minAge);
    const userIndex = AGE_ORDER.indexOf(ageGroup);
    if (userIndex < minIndex) return false;
  }

  // 허용 연령 목록 체크
  if (meta.allowedAges && meta.allowedAges.length > 0) {
    if (!ageGroup || !meta.allowedAges.includes(ageGroup)) return false;
  }

  return true;
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
 * 콘텐츠 목록을 연령/성별 기준으로 필터링
 */
export function filterContentByDemographic<T extends ContentWithMeta>(
  contents: T[],
  ageGroup?: AgeGroup,
  gender?: Gender,
  options?: { includeNonTargeted?: boolean }
): T[] {
  return contents.filter(content => {
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
 * 콘텐츠를 우선순위로 정렬
 */
export function sortContentByPriority<T extends ContentWithMeta>(contents: T[]): T[] {
  return [...contents].sort((a, b) => {
    const priorityA = a.meta?.priority ?? 0;
    const priorityB = b.meta?.priority ?? 0;
    return priorityB - priorityA; // 높은 우선순위가 먼저
  });
}
