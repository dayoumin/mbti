// ============================================================================
// 상황별 반응: 직장생활
// ============================================================================

import type { SituationReaction } from '../types';

export const WORK_REACTIONS: SituationReaction[] = [
  {
    id: 'situation-reaction-work-001',
    type: 'situation-reaction',
    category: 'work',
    situation: '팀장이 회의 중 내 아이디어를 대놓고 무시하고 다른 사람 의견만 칭찬했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '회의 끝나고 팀장 찾아가서 따로 얘기함', emoji: '💬', tag: 'confrontational' },
      { id: 'b', text: '속으로 삭이고 퇴근 후 친구한테 푸념', emoji: '😮‍💨', tag: 'emotional' },
      { id: 'c', text: '그냥 결과로 보여주면 되지 뭐', emoji: '💪', tag: 'cool' },
      { id: 'd', text: '다음부턴 굳이 의견 안 내야지', emoji: '🤐', tag: 'avoidant' },
    ],
    personalityMapping: {
      'ENTJ': 'a',
      'INFP': 'b',
      'ISTP': 'c',
      'ISFJ': 'd',
    },
    tags: ['직장', '상사', '무시', '회의'],
  },
  {
    id: 'situation-reaction-work-002',
    type: 'situation-reaction',
    category: 'work',
    situation: '동료가 내가 한 일을 자기가 한 것처럼 상사에게 보고했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '바로 그 자리에서 "그건 제가 한 건데요"', emoji: '✋', tag: 'confrontational' },
      { id: 'b', text: '증거 모아두고 나중에 상사에게 따로 말함', emoji: '📋', tag: 'rational' },
      { id: 'c', text: '분하지만... 일단 참고 지켜봄', emoji: '😤', tag: 'emotional' },
      { id: 'd', text: 'ㅋㅋ 그래 가져가라 관심없다', emoji: '🙄', tag: 'cool' },
    ],
    personalityMapping: {
      'ESTJ': 'a',
      'INTJ': 'b',
      'ISFJ': 'c',
      'INTP': 'd',
    },
    tags: ['직장', '동료', '공로가로채기'],
  },
  {
    id: 'situation-reaction-work-003',
    type: 'situation-reaction',
    category: 'work',
    situation: '회식 자리에서 상사가 "너 요즘 일 많이 힘들지?"라며 술을 계속 권한다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '네~ 감사합니다~ (받으면서 몰래 버림)', emoji: '🍺', tag: 'avoidant' },
      { id: 'b', text: '죄송한데 저 오늘 컨디션이... (거절)', emoji: '🙏', tag: 'rational' },
      { id: 'c', text: '아 감동... 팀장님도 한 잔! (케미 모드)', emoji: '🥹', tag: 'emotional' },
      { id: 'd', text: '네 힘들어요. 일이 너무 많아서요 (직구)', emoji: '💥', tag: 'confrontational' },
    ],
    personalityMapping: {
      'ISFP': 'a',
      'ISTJ': 'b',
      'ESFJ': 'c',
      'ENTP': 'd',
    },
    tags: ['직장', '회식', '술자리'],
  },
];
