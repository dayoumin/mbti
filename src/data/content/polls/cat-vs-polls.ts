// ============================================================================
// 고양이 VS 투표 콘텐츠 (interest-cat 태그 포함)
// ============================================================================

import type { VSPoll } from '../types';

export const CAT_VS_POLLS: VSPoll[] = [
  {
    id: 'cat-poll-011',
    category: 'cat',
    question: '고양이 성격, 어떤 게 더 좋아?',
    optionA: {
      id: 'a',
      text: '활발하고 장난 많은 고양이',
      emoji: '🐈‍⬛',
      insightTags: {
        personality: ['excitable', 'expressive'],
        decision: ['adventurous'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['active', 'energetic'],
      },
    },
    optionB: {
      id: 'b',
      text: '조용하고 차분한 고양이',
      emoji: '😌',
      insightTags: {
        personality: ['calm', 'reserved'],
        decision: ['safe'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['relaxed', 'homebody'],
      },
    },
    tags: ['성격', '행동', '선호도'],
  },
  {
    id: 'cat-poll-012',
    category: 'cat',
    question: '고양이와 시간 보내기, 어떤 게 더 좋아?',
    optionA: {
      id: 'a',
      text: '함께 놀아주기 (낚싯대, 공)',
      emoji: '🎾',
      insightTags: {
        personality: ['excitable', 'expressive'],
        decision: ['together'],
        relationship: ['close-bonding'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['active', 'energetic'],
      },
    },
    optionB: {
      id: 'b',
      text: '조용히 옆에 있기 (힐링타임)',
      emoji: '🧘',
      insightTags: {
        personality: ['calm', 'observant'],
        decision: ['present-focused'],
        relationship: ['space-needing'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['relaxed', 'homebody'],
      },
    },
    tags: ['시간', '교감', '놀이'],
  },
  {
    id: 'cat-poll-013',
    category: 'cat',
    question: '고양이 간식 타이밍은?',
    optionA: {
      id: 'a',
      text: '매일 정해진 시간에',
      emoji: '⏰',
      insightTags: {
        personality: ['structured', 'planned'],
        decision: ['deliberate'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['routine-oriented'],
      },
    },
    optionB: {
      id: 'b',
      text: '고양이 반응 보고 즉흥적으로',
      emoji: '🎲',
      insightTags: {
        personality: ['spontaneous', 'flexible'],
        decision: ['instinctive'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['relaxed'],
      },
    },
    tags: ['간식', '루틴', '스케줄'],
  },
  {
    id: 'cat-poll-014',
    category: 'cat',
    question: '다묘 가정 vs 외동냥이?',
    optionA: {
      id: 'a',
      text: '고양이 여러 마리 (다묘)',
      emoji: '🐱🐱',
      insightTags: {
        personality: ['nurturing'],
        decision: ['together'],
        relationship: ['close-bonding'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['active'],
      },
    },
    optionB: {
      id: 'b',
      text: '고양이 한 마리 (외동)',
      emoji: '🐱',
      insightTags: {
        personality: ['independent'],
        decision: ['solo'],
        relationship: ['space-needing'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['minimalist'],
      },
    },
    tags: ['다묘', '외동', '가족'],
  },
  {
    id: 'cat-poll-015',
    category: 'cat',
    question: '고양이 품종 선호는?',
    optionA: {
      id: 'a',
      text: '코리안 숏헤어 (코숏)',
      emoji: '🐈',
      insightTags: {
        personality: ['logical', 'analytical'],
        decision: ['safe', 'pragmatic', 'practical'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['frugal'],
      },
    },
    optionB: {
      id: 'b',
      text: '순종 (페르시안, 러시안블루 등)',
      emoji: '👑',
      insightTags: {
        personality: ['expressive'],
        decision: ['idealistic'],
        interest: ['interest-cat', 'interest-pet'],
        lifestyle: ['collector', 'splurger'],
      },
    },
    tags: ['품종', '코숏', '순종'],
  },
];
