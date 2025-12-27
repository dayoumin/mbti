// ============================================================================
// 강아지 VS 투표 콘텐츠 (interest-dog 태그 포함)
// ============================================================================

import type { VSPoll } from '../types';

export const DOG_VS_POLLS: VSPoll[] = [
  {
    id: 'dog-poll-001',
    category: 'dog',
    question: '강아지 산책 시간, 어떤 게 더 좋아?',
    optionA: {
      id: 'a',
      text: '긴 산책 (1시간 이상)',
      emoji: '🏃',
      insightTags: {
        personality: ['excitable', 'expressive'],
        decision: ['adventurous'],
        relationship: ['close-bonding'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['active', 'energetic'],
      },
    },
    optionB: {
      id: 'b',
      text: '짧은 산책 (30분 이내)',
      emoji: '🚶',
      insightTags: {
        personality: ['calm', 'reserved'],
        decision: ['safe', 'practical'],
        relationship: ['space-needing'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['relaxed', 'homebody'],
      },
    },
    tags: ['산책', '운동', '시간'],
  },
  {
    id: 'dog-poll-002',
    category: 'dog',
    question: '강아지 훈련 방식은?',
    optionA: {
      id: 'a',
      text: '전문가 위탁 훈련',
      emoji: '🎓',
      insightTags: {
        personality: ['logical', 'analytical'],
        decision: ['research-based', 'practical'],
        relationship: ['self-first'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['splurger'],
      },
    },
    optionB: {
      id: 'b',
      text: '직접 훈련 (유튜브, 책)',
      emoji: '📚',
      insightTags: {
        personality: ['independent', 'systematic'],
        decision: ['solo', 'deliberate'],
        relationship: ['close-bonding'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['frugal'],
      },
    },
    tags: ['훈련', '교육', '방식'],
  },
  {
    id: 'dog-poll-003',
    category: 'dog',
    question: '강아지 털 관리는?',
    optionA: {
      id: 'a',
      text: '집에서 직접 빗질/목욕',
      emoji: '🧼',
      insightTags: {
        personality: ['independent', 'nurturing'],
        decision: ['solo', 'practical'],
        relationship: ['close-bonding'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['frugal', 'routine-oriented'],
      },
    },
    optionB: {
      id: 'b',
      text: '미용실에서 정기적으로',
      emoji: '✂️',
      insightTags: {
        personality: ['structured', 'planned'],
        decision: ['deliberate', 'pragmatic'],
        relationship: ['diplomatic'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['splurger'],
      },
    },
    tags: ['털', '미용', '관리'],
  },
  {
    id: 'dog-poll-004',
    category: 'dog',
    question: '강아지 놀이 스타일은?',
    optionA: {
      id: 'a',
      text: '공 던져주기, 달리기 (활동적)',
      emoji: '⚾',
      insightTags: {
        personality: ['excitable', 'expressive'],
        decision: ['adventurous', 'together'],
        relationship: ['close-bonding'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['active', 'energetic'],
      },
    },
    optionB: {
      id: 'b',
      text: '노즈워크, 퍼즐토이 (두뇌 활동)',
      emoji: '🧩',
      insightTags: {
        personality: ['logical', 'analytical', 'systematic', 'supportive'],
        decision: ['deliberate', 'practical'],
        relationship: ['close-bonding'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['relaxed', 'innovative'],
      },
    },
    tags: ['놀이', '운동', '두뇌'],
  },
  {
    id: 'dog-poll-005',
    category: 'dog',
    question: '강아지 간식 선호는?',
    optionA: {
      id: 'a',
      text: '자연식 간식 (고구마, 닭가슴살)',
      emoji: '🥔',
      insightTags: {
        personality: ['nurturing', 'empathetic'],
        decision: ['practical', 'research-based'],
        relationship: ['other-first'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['health-conscious', 'wellness-focused'],
      },
    },
    optionB: {
      id: 'b',
      text: '시판 간식 (껌, 육포)',
      emoji: '🦴',
      insightTags: {
        personality: ['flexible', 'spontaneous'],
        decision: ['pragmatic', 'quick-decisive'],
        relationship: ['self-first'],
        interest: ['interest-dog', 'interest-pet'],
        lifestyle: ['relaxed'],
      },
    },
    tags: ['간식', '식습관', '건강'],
  },
];
