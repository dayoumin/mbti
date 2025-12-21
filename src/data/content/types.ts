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

export type AgeGroup = '10s' | '20s' | '30s' | '40s+';
export type Gender = 'male' | 'female' | 'other';

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
// 통합 콘텐츠 타입
// ============================================================================

export type QuizContent = KnowledgeQuiz | ScenarioQuiz;
export type PollContent = VSPoll | ChoicePoll;
