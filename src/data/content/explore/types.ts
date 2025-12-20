// ============================================================================
// 커뮤니티 콘텐츠 타입 정의
// ============================================================================

// ContentCategory를 재사용 (타입 통합)
// CommunityCategory는 @/data/content/types에서 export됨
import type { CommunityCategory } from '../types';
export type { CommunityCategory };

// ============================================================================
// 팁 (Tip) - 전문가/사용자 꿀팁
// ============================================================================

export interface Tip {
  id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  tags: string[];
  author: {
    type: 'expert' | 'user' | 'official';
    name: string;
    badge?: string;  // 전문가 자격, 결과 유형 등
  };
  relatedResult?: {
    testType: string;
    resultName: string;
  };
  reactions: {
    helpful: number;
    saved: number;
  };
  createdAt: string;
  featured?: boolean;  // 베스트 팁 여부
}

// ============================================================================
// Q&A - 질문과 답변
// ============================================================================

export interface Question {
  id: string;
  category: CommunityCategory;
  title: string;
  content: string;
  tags: string[];
  author: {
    id: string;
    nickname: string;
    resultBadge?: string;  // "🐱 러시안블루형" 같은 테스트 결과 뱃지
  };
  status: 'open' | 'answered' | 'closed';
  answerCount: number;
  viewCount: number;
  createdAt: string;
  relatedTest?: string;  // 관련 테스트 타입
}

export interface Answer {
  id: string;
  questionId: string;
  content: string;
  author: {
    id: string;
    nickname: string;
    isExpert?: boolean;
    resultBadge?: string;
  };
  reactions: {
    helpful: number;
  };
  isAccepted: boolean;  // 채택 여부
  createdAt: string;
}

// ============================================================================
// 투표 (Poll) - 가벼운 참여형 콘텐츠
// ============================================================================

export interface Poll {
  id: string;
  category: CommunityCategory;
  question: string;
  options: {
    id: string;
    text: string;
    emoji?: string;
    votes: number;
  }[];
  totalVotes: number;
  targetResult?: {
    testType: string;
    resultName: string;
  };  // 특정 결과 유형 대상 투표
  expiresAt?: string;
  createdAt: string;
}

// ============================================================================
// 퀴즈 (Quiz) - 지식/재미 콘텐츠
// ============================================================================

export interface Quiz {
  id: string;
  category: CommunityCategory;
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswer: string;  // option id
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  stats: {
    totalAttempts: number;
    correctRate: number;  // 0-100
  };
}

// ============================================================================
// 토론/밸런스 게임
// ============================================================================

export interface Debate {
  id: string;
  category: CommunityCategory;
  title: string;
  optionA: {
    text: string;
    emoji: string;
    votes: number;
    topComment?: string;
  };
  optionB: {
    text: string;
    emoji: string;
    votes: number;
    topComment?: string;
  };
  totalVotes: number;
  endAt?: string;
  status: 'active' | 'ended';
}

// ============================================================================
// 사용자 프로필 확장 (커뮤니티용)
// ============================================================================

export interface CommunityProfile {
  userId: string;
  nickname: string;
  avatar?: string;
  badges: {
    id: string;
    name: string;
    emoji: string;
    earnedAt: string;
  }[];
  testResults: {
    testType: string;
    resultName: string;
    resultEmoji: string;
  }[];
  stats: {
    tipsWritten: number;
    questionsAsked: number;
    answersGiven: number;
    helpfulCount: number;
  };
  joinedAt: string;
}
