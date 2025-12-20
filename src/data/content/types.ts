// ============================================================================
// 콘텐츠 카테고리 통합 타입
// ============================================================================

export type ContentCategory =
  // 반려동물
  | 'cat' | 'dog' | 'rabbit' | 'hamster'
  // 특수동물
  | 'fish' | 'bird' | 'reptile' | 'smallPet'
  // 라이프스타일
  | 'plant' | 'coffee' | 'lifestyle'
  // 심리/관계
  | 'personality' | 'love' | 'relationship'
  // 일반
  | 'general';

// CommunityCategory는 ContentCategory의 alias (하위 호환)
export type CommunityCategory = ContentCategory;

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
}

// ============================================================================
// 통합 콘텐츠 타입
// ============================================================================

export type QuizContent = KnowledgeQuiz | ScenarioQuiz;
export type PollContent = VSPoll | ChoicePoll;
