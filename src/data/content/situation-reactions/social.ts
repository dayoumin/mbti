// ============================================================================
// 상황별 반응: 친구/모임
// ============================================================================

import type { SituationReaction } from '../types';

export const SOCIAL_REACTIONS: SituationReaction[] = [
  {
    id: 'situation-reaction-social-001',
    type: 'situation-reaction',
    category: 'social',
    situation: '친구 모임에서 한 친구가 계속 나만 빼고 농담을 한다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '야 나도 껴줘~ (웃으면서 참여 시도)', emoji: '😊', tag: 'caring' },
      { id: 'b', text: '뭔가 기분 나쁜데... 일단 조용히 있음', emoji: '😶', tag: 'passive' },
      { id: 'c', text: '아 나 화장실 (잠깐 피함)', emoji: '🚶', tag: 'avoidant' },
      { id: 'd', text: '왜 나만 빼? 솔직히 좀 그런데', emoji: '😠', tag: 'confrontational' },
    ],
    personalityMapping: {
      'ENFP': 'a',
      'INFP': 'b',
      'INTP': 'c',
      'ESTP': 'd',
    },
    tags: ['친구', '모임', '소외감'],
    meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } },
  },
  {
    id: 'situation-reaction-social-002',
    type: 'situation-reaction',
    category: 'social',
    situation: 'SNS에 올린 사진에 친구가 "살 좀 빠졌다ㅋㅋ" 라고 댓글을 달았다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: 'ㅋㅋㅋ 응 요즘 열심히 운동해~ (긍정 해석)', emoji: '💪', tag: 'rational' },
      { id: 'b', text: '살쪘었다는 거야? 뭔 뜻이야? (확인)', emoji: '🤔', tag: 'confrontational' },
      { id: 'c', text: '아... 그랬어? (갑자기 자존감 하락)', emoji: '😔', tag: 'emotional' },
      { id: 'd', text: '댓글 무시하고 삭제할까 고민', emoji: '🗑️', tag: 'avoidant' },
    ],
    personalityMapping: {
      'ENFJ': 'a',
      'ESTJ': 'b',
      'INFP': 'c',
      'ISFP': 'd',
    },
    tags: ['SNS', '친구', '외모'],
    meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } },
  },
];
