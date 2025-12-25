// ============================================================================
// 와인 월드컵 - 16강 토너먼트
// ============================================================================

import { Tournament, TournamentContestant } from './tournament-sample';

// ============================================================================
// 와인 16강 참가자
// ============================================================================

export const WINE_WORLDCUP_CONTESTANTS: TournamentContestant[] = [
  // === 레드 와인 - 풀 바디 ===
  {
    id: 'cabernet-sauvignon',
    name: '카베르네 소비뇽',
    emoji: '👑',
    description: '풀 바디 레드의 왕, 높은 타닌과 블랙커런트 향',
    tags: ['레드', '풀바디', '타닌', '보르도'],
    funFact: '보르도 5대 샤토의 주요 품종으로, 장기 숙성 능력이 뛰어나요',
  },
  {
    id: 'syrah-shiraz',
    name: '시라/쉬라즈',
    emoji: '🔥',
    description: '스파이시한 후추 향과 진한 과일 맛',
    tags: ['레드', '풀바디', '스파이시', '론'],
    funFact: '프랑스에서는 시라, 호주에서는 쉬라즈로 불려요',
  },
  {
    id: 'malbec',
    name: '말벡',
    emoji: '🇦🇷',
    description: '아르헨티나의 대표 품종, 블랙베리와 자두 향',
    tags: ['레드', '풀바디', '과일향', '아르헨티나'],
    funFact: '프랑스에서 왔지만 아르헨티나에서 세계적인 명성을 얻었어요',
  },
  {
    id: 'zinfandel',
    name: '진판델',
    emoji: '🍇',
    description: '캘리포니아의 보물, 잼 같은 과일 풍미',
    tags: ['레드', '풀바디', '과일풍미', '미국'],
    funFact: '캘리포니아에서 가장 오래된 품종 중 하나예요',
  },

  // === 레드 와인 - 미디엄/라이트 바디 ===
  {
    id: 'merlot',
    name: '메를로',
    emoji: '🍒',
    description: '부드러운 타닌, 체리와 자두의 달콤함',
    tags: ['레드', '미디엄바디', '부드러움', '보르도'],
    funFact: '카베르네 소비뇽의 완벽한 블렌딩 파트너예요',
  },
  {
    id: 'pinot-noir',
    name: '피노 누아',
    emoji: '🍓',
    description: '섬세하고 우아한 라이트 바디, 체리와 딸기 향',
    tags: ['레드', '라이트바디', '섬세함', '부르고뉴'],
    funFact: '재배가 까다로워 "와인의 여왕"으로 불려요',
  },
  {
    id: 'sangiovese',
    name: '산지오베제',
    emoji: '🇮🇹',
    description: '이탈리아의 자존심, 체리와 허브 향',
    tags: ['레드', '미디엄바디', '산도', '토스카나'],
    funFact: '키안티 와인의 주요 품종이에요',
  },
  {
    id: 'tempranillo',
    name: '템프라니요',
    emoji: '🇪🇸',
    description: '스페인의 대표 품종, 가죽과 담배 뉘앙스',
    tags: ['레드', '미디엄바디', '복합미', '리오하'],
    funFact: '"이른 성숙"이라는 뜻으로, 다른 품종보다 빨리 익어요',
  },

  // === 화이트 와인 - 풀 바디 ===
  {
    id: 'chardonnay',
    name: '샤도네이',
    emoji: '🧈',
    description: '오크 숙성의 버터와 바닐라 향',
    tags: ['화이트', '풀바디', '버터향', '부르고뉴'],
    funFact: '가장 다양한 스타일로 만들 수 있는 만능 품종이에요',
  },
  {
    id: 'viognier',
    name: '비오니에',
    emoji: '🌼',
    description: '풍부한 꽃향과 복숭아 아로마',
    tags: ['화이트', '풀바디', '꽃향', '론'],
    funFact: '한때 멸종 위기였지만 지금은 인기 품종으로 부활했어요',
  },

  // === 화이트 와인 - 라이트/미디엄 바디 ===
  {
    id: 'sauvignon-blanc',
    name: '소비뇽 블랑',
    emoji: '🌿',
    description: '높은 산도, 풀과 허브의 상큼함',
    tags: ['화이트', '라이트바디', '산뜻함', '뉴질랜드'],
    funFact: '뉴질랜드 말보로 지역에서 세계적인 명성을 얻었어요',
  },
  {
    id: 'riesling',
    name: '리슬링',
    emoji: '🍑',
    description: '높은 산도, 꽃과 복숭아 향, 드라이~스위트 다양',
    tags: ['화이트', '라이트바디', '산도', '독일'],
    funFact: '당도와 산도를 모두 높게 유지할 수 있는 유일한 품종이에요',
  },
  {
    id: 'pinot-grigio',
    name: '피노 그리지오',
    emoji: '🍋',
    description: '가볍고 산뜻한 이탈리아 스타일',
    tags: ['화이트', '라이트바디', '가벼움', '이탈리아'],
    funFact: '프랑스에서는 피노 그리, 이탈리아에서는 피노 그리지오로 불려요',
  },
  {
    id: 'gewurztraminer',
    name: '게뷔르츠트라미너',
    emoji: '🌹',
    description: '향긋한 라이치와 장미 향',
    tags: ['화이트', '미디엄바디', '향긋함', '알자스'],
    funFact: '"게뷔르츠"는 독일어로 "향신료"라는 뜻이에요',
  },

  // === 스파클링 ===
  {
    id: 'champagne',
    name: '샴페인',
    emoji: '🥂',
    description: '프랑스 샴파뉴 지역의 최고급 스파클링',
    tags: ['스파클링', '고급', '축하', '프랑스'],
    funFact: '샴파뉴 지역에서만 만들어진 것만 샴페인이라 부를 수 있어요',
  },
  {
    id: 'prosecco',
    name: '프로세코',
    emoji: '✨',
    description: '이탈리아의 경쾌한 스파클링, 과일향 가득',
    tags: ['스파클링', '과일향', '가벼움', '이탈리아'],
    funFact: '샴페인보다 가벼운 탄산과 과일향으로 일상에 즐기기 좋아요',
  },
];

// ============================================================================
// 와인 월드컵 토너먼트 정의
// ============================================================================

export const WINE_WORLDCUP: Tournament = {
  id: 'wine-worldcup-v1',
  type: 'worldcup',
  category: 'wine',
  title: '최애 와인 품종 월드컵',
  subtitle: '16강',
  description: '당신이 가장 좋아하는 와인 품종은? 레드부터 화이트, 스파클링까지!',
  emoji: '🍷',
  themeColor: 'bg-purple-100',

  contestants: WINE_WORLDCUP_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2025-12-25',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 와인 품종은 {winner}! 🍷',
  },
};

export default WINE_WORLDCUP;
