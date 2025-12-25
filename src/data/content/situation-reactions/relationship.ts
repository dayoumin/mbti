// ============================================================================
// 상황별 반응: 연애/이별
// ============================================================================

import type { SituationReaction } from '../types';

export const RELATIONSHIP_REACTIONS: SituationReaction[] = [
  {
    id: 'situation-reaction-relationship-001',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '3년 사귄 연인이 갑자기 "우리 잠깐 거리를 두자"고 말했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '왜? 뭐가 문제야? 바로 따져 물음', emoji: '😠', tag: 'confrontational' },
      { id: 'b', text: '알겠어... 시간 줄게 (속으로 울면서)', emoji: '😢', tag: 'emotional' },
      { id: 'c', text: '그래, 나도 생각할 시간 필요했어', emoji: '😌', tag: 'rational' },
      { id: 'd', text: '연락 먼저 오면 받을게 (읽씹 시작)', emoji: '😎', tag: 'cool' },
    ],
    personalityMapping: {
      'ENFP': 'a',
      'INFP': 'b',
      'INTJ': 'c',
      'ISTP': 'd',
      'ESFJ': 'a',
      'ISFJ': 'b',
    },
    tags: ['이별', '연애', '거리두기'],
    meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } },
  },
  {
    id: 'situation-reaction-relationship-002',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '헤어진 전 애인에게서 새벽 2시에 "잘 지내?"라는 카톡이 왔다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '읽씹하고 다음날 "어 잘 지내" 단답', emoji: '😏', tag: 'cool' },
      { id: 'b', text: '설마... 다시? 심장 쿵쾅거리며 답장', emoji: '💓', tag: 'emotional' },
      { id: 'c', text: '새벽에 왜 연락해? 할 말 있으면 낮에 해', emoji: '😤', tag: 'confrontational' },
      { id: 'd', text: '차단은 이럴 때 쓰라고 있는 거지', emoji: '🚫', tag: 'avoidant' },
    ],
    personalityMapping: {
      'ENTJ': 'c',
      'INFP': 'b',
      'ISTP': 'a',
      'INTP': 'd',
      'ENFJ': 'b',
    },
    tags: ['이별', '연애', '전애인', '새벽연락'],
    meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } },
  },
  {
    id: 'situation-reaction-relationship-003',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '친구의 소개팅 상대가 첫 만남에서 "저 솔직한 편이에요"라며 외모 지적을 했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '저도 솔직하게 말할게요. 다신 안 볼게요.', emoji: '💅', tag: 'confrontational' },
      { id: 'b', text: '네... 하하... (속으로 멘탈 박살)', emoji: '🥲', tag: 'emotional' },
      { id: 'c', text: '아 그래요? 근데 그건 예의는 아닌 것 같은데', emoji: '🤔', tag: 'rational' },
      { id: 'd', text: '화장실 다녀올게요 (도주 준비)', emoji: '🏃', tag: 'avoidant' },
    ],
    personalityMapping: {
      'ESTJ': 'a',
      'INFP': 'b',
      'INTP': 'c',
      'ISFP': 'd',
    },
    tags: ['소개팅', '연애', '무례함'],
    meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } },
  },
  {
    id: 'situation-reaction-relationship-004',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '썸 타던 사람이 "우리 그냥 친구로 지내자"고 했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '응 알겠어! 우리 좋은 친구하자 (마음 접음)', emoji: '🙂', tag: 'rational' },
      { id: 'b', text: '왜...? 내가 뭘 잘못한 거야...', emoji: '😭', tag: 'emotional' },
      { id: 'c', text: '아 그래? ㅋㅋ 연락할 일 있나 모르겠네', emoji: '🙄', tag: 'cool' },
      { id: 'd', text: '혹시 다른 사람 생긴 거야?', emoji: '🕵️', tag: 'confrontational' },
    ],
    personalityMapping: {
      'ISTJ': 'a',
      'ENFP': 'b',
      'ESTP': 'c',
      'ENFJ': 'd',
    },
    tags: ['썸', '연애', '거절'],
    meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } },
  },
  {
    id: 'situation-reaction-relationship-005',
    type: 'situation-reaction',
    category: 'relationship',
    situation: '연인이 "네 친구 ○○ 좀 별로인 것 같아"라고 내 베프를 험담했다.',
    question: '이럴 때 나는?',
    options: [
      { id: 'a', text: '왜? 뭐가 별로인데? (방어 태세)', emoji: '🛡️', tag: 'confrontational' },
      { id: 'b', text: '아... 그래? 뭐 그럴 수도... (어색)', emoji: '😅', tag: 'passive' },
      { id: 'c', text: '내 친구인데 그렇게 말하면 기분 나빠', emoji: '😤', tag: 'emotional' },
      { id: 'd', text: '음... 왜 그렇게 생각해? 이유가 뭔데?', emoji: '🤔', tag: 'rational' },
    ],
    personalityMapping: {
      'ESFP': 'a',
      'ISFJ': 'b',
      'ENFP': 'c',
      'INTP': 'd',
    },
    tags: ['연애', '친구', '갈등'],
    meta: { timeSensitivity: { sensitivity: 'low', sourceYear: 2025 } },
  },
];
