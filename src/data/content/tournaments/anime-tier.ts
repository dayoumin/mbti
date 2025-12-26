// ============================================================================
// 애니메이션 티어 토너먼트 - 집단지성 명작 랭킹
// ============================================================================
// 바이럴 포인트:
// 1. 논쟁 폭발 - 팬덤 간 의견 충돌 (귀멸 vs 주술, 원피스 vs 나루토)
// 2. 실시간 순위 변동 - 재방문 유도
// 3. 팬덤 동원력 - SNS 공유로 투표 동원
// ============================================================================

import type { TierTournament } from '../types';

export const ANIME_TIER_TOURNAMENT: TierTournament = {
  id: 'anime-tier-classic',
  type: 'tier-tournament',
  category: 'anime',

  title: '역대 애니메이션 티어표',
  subtitle: '집단지성이 정하는 명작 순위 🔥',
  emoji: '🎌',

  // 32개 애니메이션 (논쟁 유발 + 다양한 장르)
  items: [
    // === 현대 인기작 (팬덤 강력) ===
    { id: 'demon-slayer', name: '귀멸의 칼날', emoji: '🔥', tags: ['배틀', '점프', '2019'] },
    { id: 'jujutsu-kaisen', name: '주술회전', emoji: '👁️', tags: ['배틀', '점프', '2020'] },
    { id: 'spy-family', name: '스파이 패밀리', emoji: '🕵️', tags: ['코미디', '가족', '2022'] },
    { id: 'chainsaw-man', name: '체인소 맨', emoji: '🪚', tags: ['다크', '점프', '2022'] },
    { id: 'attack-titan', name: '진격의 거인', emoji: '⚔️', tags: ['다크', '액션', '2013'] },
    { id: 'my-hero', name: '나의 히어로 아카데미아', emoji: '💪', tags: ['히어로', '점프', '2016'] },

    // === 레전드 장기 연재 ===
    { id: 'one-piece', name: '원피스', emoji: '🏴‍☠️', tags: ['모험', '점프', '1999'] },
    { id: 'naruto', name: '나루토', emoji: '🍥', tags: ['닌자', '점프', '2002'] },
    { id: 'dragon-ball', name: '드래곤볼', emoji: '🐉', tags: ['배틀', '레전드', '1986'] },
    { id: 'bleach', name: '블리치', emoji: '⚡', tags: ['배틀', '점프', '2004'] },
    { id: 'hunter-x-hunter', name: '헌터x헌터', emoji: '🎯', tags: ['모험', '점프', '2011'] },

    // === 명작 드라마 ===
    { id: 'steins-gate', name: '슈타인즈 게이트', emoji: '⏰', tags: ['SF', '명작', '2011'] },
    { id: 'death-note', name: '데스노트', emoji: '📓', tags: ['스릴러', '심리', '2006'] },
    { id: 'code-geass', name: '코드기어스', emoji: '♟️', tags: ['로봇', '전략', '2006'] },
    { id: 'fullmetal', name: '강철의 연금술사', emoji: '🔧', tags: ['판타지', '명작', '2009'] },
    { id: 'evangelion', name: '에반게리온', emoji: '🤖', tags: ['로봇', '심리', '1995'] },

    // === 감성/치유계 ===
    { id: 'your-name', name: '너의 이름은', emoji: '🌠', tags: ['로맨스', '영화', '2016'] },
    { id: 'violet-evergarden', name: '바이올렛 에버가든', emoji: '💌', tags: ['감성', '작화', '2018'] },
    { id: 'anohana', name: '그날 본 꽃', emoji: '🌸', tags: ['감성', '눈물', '2011'] },
    { id: 'clannad', name: '클라나드', emoji: '🎻', tags: ['가족', '눈물', '2007'] },
    { id: 'frieren', name: '장송의 프리렌', emoji: '🧙‍♀️', tags: ['판타지', '감성', '2023'] },

    // === 스포츠/일상 ===
    { id: 'haikyuu', name: '하이큐!!', emoji: '🏐', tags: ['스포츠', '열혈', '2014'] },
    { id: 'slam-dunk', name: '슬램덩크', emoji: '🏀', tags: ['스포츠', '레전드', '1993'] },
    { id: 'bocchi', name: '봇치 더 록!', emoji: '🎸', tags: ['음악', '코미디', '2022'] },

    // === 이세계/판타지 ===
    { id: 'mushoku', name: '무직전생', emoji: '📖', tags: ['이세계', '성장', '2021'] },
    { id: 're-zero', name: '리제로', emoji: '🔄', tags: ['이세계', '다크', '2016'] },
    { id: 'konosuba', name: '코노스바', emoji: '😂', tags: ['이세계', '코미디', '2016'] },
    { id: 'sword-art', name: '소드 아트 온라인', emoji: '⚔️', tags: ['이세계', '게임', '2012'] },

    // === 독보적 장르 ===
    { id: 'mob-psycho', name: '모브사이코 100', emoji: '👻', tags: ['초능력', '성장', '2016'] },
    { id: 'one-punch', name: '원펀맨', emoji: '👊', tags: ['히어로', '코미디', '2015'] },
    { id: 'cowboy-bebop', name: '카우보이 비밥', emoji: '🚀', tags: ['SF', '명작', '1998'] },
    { id: 'gintama', name: '은혼', emoji: '🍡', tags: ['코미디', '패러디', '2006'] },
  ],

  // 커스텀 티어 라벨 (바이럴용 표현)
  tierLabels: {
    'S': '레전드 of 레전드 🏆',
    'A': '명작 인정 👏',
    'B': '재밌긴 함 👍',
    'C': '호불호 갈림 🤔',
    'D': '기대 이하 😐',
    'F': '시간 아까움 💀',
  },

  // 바이럴 훅
  viralHooks: {
    debateTopics: [
      '귀멸 vs 주술, 진짜 명작은?',
      '원피스 vs 나루토, 레전드 대결',
      '슬램덩크 vs 하이큐, 스포츠 끝판왕',
      '에반게리온이 S티어?',
      '이세계물은 전부 B티어 이하?',
      'SAO가 왜 여기에?',
    ],
    fandoms: [
      '귀멸팬', '주술팬', '원피스팬', '나루토팬',
      '진격팬', '에반게리온팬', '슬덩팬', '하이큐팬',
    ],
  },

  tags: ['애니', '티어', '랭킹', '논쟁', '투표', '명작'],

  meta: {
    ageRating: 'all',
    createdBy: 'ai',
    createdAt: '2025-12-26',
    priority: 100,  // 높은 우선순위
    timeSensitivity: {
      sensitivity: 'low',  // 트렌드 기반
      sourceYear: 2025,
    },
  },
};

// 추가 토너먼트 (장르별)
export const ANIME_TIER_SHONEN: TierTournament = {
  id: 'anime-tier-shonen',
  type: 'tier-tournament',
  category: 'anime',

  title: '소년만화 애니 티어표',
  subtitle: '점프/소년지 원작 총정리 ⚔️',
  emoji: '💥',

  items: [
    { id: 'one-piece', name: '원피스', emoji: '🏴‍☠️' },
    { id: 'naruto', name: '나루토', emoji: '🍥' },
    { id: 'dragon-ball', name: '드래곤볼', emoji: '🐉' },
    { id: 'demon-slayer', name: '귀멸의 칼날', emoji: '🔥' },
    { id: 'jujutsu-kaisen', name: '주술회전', emoji: '👁️' },
    { id: 'hunter-x-hunter', name: '헌터x헌터', emoji: '🎯' },
    { id: 'bleach', name: '블리치', emoji: '⚡' },
    { id: 'my-hero', name: '나의 히어로 아카데미아', emoji: '💪' },
    { id: 'chainsaw-man', name: '체인소 맨', emoji: '🪚' },
    { id: 'fullmetal', name: '강철의 연금술사', emoji: '🔧' },
    { id: 'one-punch', name: '원펀맨', emoji: '👊' },
    { id: 'mob-psycho', name: '모브사이코 100', emoji: '👻' },
    { id: 'gintama', name: '은혼', emoji: '🍡' },
    { id: 'black-clover', name: '블랙클로버', emoji: '☘️' },
    { id: 'fairy-tail', name: '페어리테일', emoji: '🧚' },
    { id: 'haikyuu', name: '하이큐!!', emoji: '🏐' },
  ],

  tierLabels: {
    'S': '레전드 소년만화',
    'A': '명작 배틀',
    'B': '재미는 보장',
    'C': '팬만 좋아함',
    'D': '늘어짐',
    'F': '유행 지남',
  },

  viralHooks: {
    debateTopics: [
      '3대 점프 vs 4대 점프?',
      '진짜 레전드 소년만화는?',
      '페어리테일 F티어 논란',
    ],
  },

  tags: ['소년만화', '점프', '배틀'],

  meta: {
    ageRating: 'all',
    createdBy: 'ai',
    createdAt: '2025-12-26',
  },
};

export const ANIME_TIER_ISEKAI: TierTournament = {
  id: 'anime-tier-isekai',
  type: 'tier-tournament',
  category: 'anime',

  title: '이세계 애니 티어표',
  subtitle: '트럭에 치여 전생하기 전에 골라 🚚',
  emoji: '🌀',

  items: [
    { id: 'mushoku', name: '무직전생', emoji: '📖' },
    { id: 're-zero', name: '리제로', emoji: '🔄' },
    { id: 'konosuba', name: '코노스바', emoji: '😂' },
    { id: 'sword-art', name: 'SAO', emoji: '⚔️' },
    { id: 'shield-hero', name: '방패 용사', emoji: '🛡️' },
    { id: 'overlord', name: '오버로드', emoji: '💀' },
    { id: 'slime', name: '슬라임', emoji: '🟢' },
    { id: 'no-game', name: '노게임 노라이프', emoji: '🎮' },
    { id: 'log-horizon', name: '로그 호라이즌', emoji: '📊' },
    { id: 'grimgar', name: '그림가르', emoji: '🗡️' },
    { id: 'danmachi', name: '던만추', emoji: '🎲' },
    { id: 'wise-grandson', name: '현자의 손자', emoji: '🧙' },
    { id: 'smartphone', name: '스마트폰 이세계', emoji: '📱' },
    { id: 'cautious-hero', name: '신중한 용사', emoji: '⚠️' },
    { id: 'bookworm', name: '책벌레', emoji: '📚' },
    { id: 'spider', name: '거미입니다만', emoji: '🕷️' },
  ],

  tierLabels: {
    'S': '이세계물 끝판왕',
    'A': '텐플릿 초월',
    'B': '무난하게 재밌',
    'C': '뇌절 시작',
    'D': '텐플릿 덩어리',
    'F': '트럭 피해야 함',
  },

  viralHooks: {
    debateTopics: [
      'SAO는 이세계 아니다?',
      '무직전생 호불호 폭발',
      '스마트폰 이세계가 F티어 맞음?',
    ],
  },

  tags: ['이세계', '전생', '판타지'],

  meta: {
    ageRating: 'all',
    createdBy: 'ai',
    createdAt: '2025-12-26',
  },
};

// 전체 export
export const ANIME_TIER_TOURNAMENTS: TierTournament[] = [
  ANIME_TIER_TOURNAMENT,
  ANIME_TIER_SHONEN,
  ANIME_TIER_ISEKAI,
];
