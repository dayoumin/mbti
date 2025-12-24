// ============================================================================
// 별자리/띠 투표 게임 콘텐츠
// "Who Is Most Likely To..." 형식의 소셜 투표
// ============================================================================

import type { ZodiacPoll } from '../types';

/**
 * 별자리 투표 게임
 * - 재미있는 상황 + 별자리/띠 선택
 * - 결과 후 점성학적 해설 제공
 * - 친구 공유 유도
 */
export const ZODIAC_POLLS: ZodiacPoll[] = [
  // ============================================================================
  // 생존/서바이벌 시리즈
  // ============================================================================
  {
    id: 'zodiac-poll-001',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '좀비 아포칼립스에서 끝까지 살아남을 별자리는?',
    scenario: '세상이 좀비로 뒤덮였다! 어떤 별자리가 가장 오래 버틸까?',
    options: [
      {
        id: 'a',
        sign: 'scorpio',
        text: '전갈자리',
        emoji: '🦂',
        reason: '극한 상황에서 빛나는 생존 본능과 냉철한 판단력',
      },
      {
        id: 'b',
        sign: 'capricorn',
        text: '염소자리',
        emoji: '🐐',
        reason: '철저한 준비성과 끈기로 어떤 상황도 견뎌냄',
      },
      {
        id: 'c',
        sign: 'virgo',
        text: '처녀자리',
        emoji: '♍',
        reason: '분석력과 계획성으로 최적의 생존 전략 수립',
      },
      {
        id: 'd',
        sign: 'aries',
        text: '양자리',
        emoji: '🐏',
        reason: '두려움 없는 용기와 빠른 결단력',
      },
    ],
    explanation: '전갈자리는 위기 상황에서 본능적인 판단력이 극대화된다고 해요. 하지만 모든 별자리가 각자의 강점으로 생존할 수 있어요!',
    tags: ['생존', '좀비', '재미'],
    meta: { minAge: '20s' },
  },
  {
    id: 'zodiac-poll-002',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '무인도에 떨어지면 가장 먼저 리더가 될 별자리는?',
    options: [
      {
        id: 'a',
        sign: 'leo',
        text: '사자자리',
        emoji: '🦁',
        reason: '타고난 리더십과 카리스마로 사람들을 모음',
      },
      {
        id: 'b',
        sign: 'aries',
        text: '양자리',
        emoji: '🐏',
        reason: '주저 없이 앞장서는 행동력',
      },
      {
        id: 'c',
        sign: 'capricorn',
        text: '염소자리',
        emoji: '🐐',
        reason: '냉철한 판단과 책임감',
      },
    ],
    explanation: '사자자리는 자연스럽게 중심이 되는 경향이 있어요. 하지만 상황에 따라 다른 별자리도 훌륭한 리더가 될 수 있답니다!',
    tags: ['리더십', '무인도', '서바이벌'],
    meta: { minAge: '20s' },
  },

  // ============================================================================
  // 연애/관계 시리즈
  // ============================================================================
  {
    id: 'zodiac-poll-003',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '첫 만남에서 가장 강렬한 인상을 남기는 별자리는?',
    options: [
      {
        id: 'a',
        sign: 'scorpio',
        text: '전갈자리',
        emoji: '🦂',
        reason: '신비로운 분위기와 강렬한 눈빛',
      },
      {
        id: 'b',
        sign: 'leo',
        text: '사자자리',
        emoji: '🦁',
        reason: '화려한 존재감과 자신감',
      },
      {
        id: 'c',
        sign: 'libra',
        text: '천칭자리',
        emoji: '⚖️',
        reason: '우아한 매력과 뛰어난 대화 스킬',
      },
      {
        id: 'd',
        sign: 'gemini',
        text: '쌍둥이자리',
        emoji: '👯',
        reason: '재치 있는 유머와 다채로운 매력',
      },
    ],
    explanation: '첫인상은 사람마다 달라요. 누군가는 강렬함에, 누군가는 편안함에 끌리죠!',
    tags: ['연애', '첫인상', '매력'],
    meta: { minAge: '20s' },
  },
  {
    id: 'zodiac-poll-004',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '가장 로맨틱한 데이트를 계획하는 별자리는?',
    options: [
      {
        id: 'a',
        sign: 'pisces',
        text: '물고기자리',
        emoji: '🐟',
        reason: '감성적이고 창의적인 데이트 아이디어',
      },
      {
        id: 'b',
        sign: 'cancer',
        text: '게자리',
        emoji: '🦀',
        reason: '상대방을 위한 세심한 배려',
      },
      {
        id: 'c',
        sign: 'taurus',
        text: '황소자리',
        emoji: '🐂',
        reason: '오감을 만족시키는 럭셔리한 데이트',
      },
    ],
    explanation: '물고기자리는 동화 같은 로맨스를 꿈꾸는 경향이 있어요. 하지만 최고의 데이트는 서로를 이해하는 마음에서 나온답니다!',
    tags: ['연애', '데이트', '로맨틱'],
    meta: { minAge: '20s' },
  },

  // ============================================================================
  // 일상/라이프스타일 시리즈
  // ============================================================================
  {
    id: 'zodiac-poll-005',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '월급날 가장 먼저 텅장이 되는 별자리는?',
    options: [
      {
        id: 'a',
        sign: 'sagittarius',
        text: '사수자리',
        emoji: '🏹',
        reason: 'YOLO! 경험을 위한 과감한 소비',
      },
      {
        id: 'b',
        sign: 'leo',
        text: '사자자리',
        emoji: '🦁',
        reason: '좋은 것을 즐기고 싶은 욕구',
      },
      {
        id: 'c',
        sign: 'libra',
        text: '천칭자리',
        emoji: '⚖️',
        reason: '예쁜 것, 좋은 것에 약함',
      },
      {
        id: 'd',
        sign: 'aries',
        text: '양자리',
        emoji: '🐏',
        reason: '충동적인 "지금 당장" 구매',
      },
    ],
    explanation: '소비 습관은 별자리보다 개인차가 커요. 하지만 재미로 보는 거니까! 💸',
    tags: ['돈', '소비', '월급', '재미'],
    meta: { minAge: '20s' },
  },
  {
    id: 'zodiac-poll-006',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '약속 시간에 가장 늦게 오는 별자리는?',
    options: [
      {
        id: 'a',
        sign: 'pisces',
        text: '물고기자리',
        emoji: '🐟',
        reason: '시간 개념이 독특해요 (몽환적)',
      },
      {
        id: 'b',
        sign: 'sagittarius',
        text: '사수자리',
        emoji: '🏹',
        reason: '오는 길에 다른 재미를 발견',
      },
      {
        id: 'c',
        sign: 'libra',
        text: '천칭자리',
        emoji: '⚖️',
        reason: '뭘 입을지 고르다가 지각',
      },
    ],
    explanation: '물고기자리는 시간보다 분위기에 집중하는 경향이 있다고 해요. 하지만 개인차가 있으니 너무 믿지는 마세요! 😂',
    tags: ['약속', '시간', '지각', '재미'],
    meta: { minAge: '20s' },
  },

  // ============================================================================
  // 띠별 운세/행운 시리즈
  // ============================================================================
  {
    id: 'zodiac-poll-007',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '가장 행운이 따르는 띠는?',
    scenario: '12지신 중 누가 가장 럭키할까?',
    options: [
      {
        id: 'a',
        sign: 'dragon',
        text: '용띠',
        emoji: '🐉',
        reason: '동양에서 가장 길한 동물! 타고난 행운아',
      },
      {
        id: 'b',
        sign: 'pig',
        text: '돼지띠',
        emoji: '🐷',
        reason: '복과 재물의 상징! 금전운 최강',
      },
      {
        id: 'c',
        sign: 'rabbit',
        text: '토끼띠',
        emoji: '🐇',
        reason: '달의 기운! 평화롭고 순탄한 삶',
      },
      {
        id: 'd',
        sign: 'snake',
        text: '뱀띠',
        emoji: '🐍',
        reason: '지혜의 상징! 위기를 기회로 바꾸는 힘',
      },
    ],
    explanation: '동양 점술에서 용은 가장 길한 동물이지만, 모든 띠에게 각자의 강점이 있어요!',
    tags: ['띠', '행운', '운세'],
    meta: { minAge: '20s' },
  },
  {
    id: 'zodiac-poll-008',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '이직/전직 운이 가장 좋은 띠는?',
    options: [
      {
        id: 'a',
        sign: 'horse',
        text: '말띠',
        emoji: '🐎',
        reason: '새로운 도전을 두려워하지 않는 열정',
      },
      {
        id: 'b',
        sign: 'monkey',
        text: '원숭이띠',
        emoji: '🐒',
        reason: '빠른 적응력과 재치로 어디서든 성공',
      },
      {
        id: 'c',
        sign: 'dragon',
        text: '용띠',
        emoji: '🐉',
        reason: '좋은 파트너/멘토를 끌어당기는 카리스마',
      },
    ],
    explanation: '변화를 두려워하지 않는다면 어떤 띠든 좋은 기회가 올 수 있어요!',
    tags: ['이직', '커리어', '띠'],
    meta: { minAge: '20s' },
  },

  // ============================================================================
  // 성격/특성 시리즈
  // ============================================================================
  {
    id: 'zodiac-poll-009',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '비밀을 가장 잘 지키는 별자리는?',
    options: [
      {
        id: 'a',
        sign: 'scorpio',
        text: '전갈자리',
        emoji: '🦂',
        reason: '무덤까지 가져가는 비밀 금고',
      },
      {
        id: 'b',
        sign: 'capricorn',
        text: '염소자리',
        emoji: '🐐',
        reason: '신뢰와 책임감의 아이콘',
      },
      {
        id: 'c',
        sign: 'cancer',
        text: '게자리',
        emoji: '🦀',
        reason: '소중한 사람을 보호하려는 마음',
      },
    ],
    explanation: '전갈자리는 비밀 유지에 강하다고 알려져 있어요. 하지만 진정한 비밀 금고는 신뢰하는 마음이죠!',
    tags: ['비밀', '신뢰', '성격'],
    meta: { minAge: '20s' },
  },
  {
    id: 'zodiac-poll-010',
    type: 'zodiac-poll',
    category: 'zodiac',
    question: '싸우면 가장 무서운 별자리는?',
    options: [
      {
        id: 'a',
        sign: 'scorpio',
        text: '전갈자리',
        emoji: '🦂',
        reason: '한 번 찍으면 끝까지 간다',
      },
      {
        id: 'b',
        sign: 'aries',
        text: '양자리',
        emoji: '🐏',
        reason: '불같은 성격! 즉각 폭발',
      },
      {
        id: 'c',
        sign: 'taurus',
        text: '황소자리',
        emoji: '🐂',
        reason: '평소엔 온순하지만 한계를 넘으면...',
      },
      {
        id: 'd',
        sign: 'leo',
        text: '사자자리',
        emoji: '🦁',
        reason: '자존심 건드리면 왕의 분노',
      },
    ],
    explanation: '화나면 무서운 건 다 똑같아요! 중요한 건 화해하는 마음이죠 💕',
    tags: ['성격', '분노', '재미'],
    meta: { minAge: '20s' },
  },
];

export default ZODIAC_POLLS;
