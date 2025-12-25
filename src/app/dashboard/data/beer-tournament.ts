// ============================================================================
// 맥주 월드컵 - 16강 토너먼트
// ============================================================================

import { Tournament, TournamentContestant } from './tournament-sample';

// ============================================================================
// 맥주 16강 참가자
// ============================================================================

export const BEER_WORLDCUP_CONTESTANTS: TournamentContestant[] = [
  // === 라거 (Lager) ===
  {
    id: 'pilsner',
    name: '필스너',
    emoji: '🌟',
    description: '황금빛 맥주의 원조, 깔끔하고 청량한 맛',
    tags: ['라거', '필스너', '깔끔', '체코'],
    funFact: '1842년 체코 필젠에서 탄생한 라거의 대표주자예요',
  },
  {
    id: 'helles',
    name: '헬레스',
    emoji: '☀️',
    description: '독일식 라거, 부드럽고 달콤한 맥아 향',
    tags: ['라거', '부드러움', '독일', '맥아'],
    funFact: '독일어로 "밝다"는 뜻으로, 뮌헨의 대표 맥주예요',
  },
  {
    id: 'bock',
    name: '복(Bock)',
    emoji: '🐐',
    description: '진한 맥아 향과 높은 도수의 독일 강한 라거',
    tags: ['라거', '강함', '독일', '도수'],
    funFact: '염소(Bock)가 상징인 이유는 독일어 발음에서 유래했어요',
  },
  {
    id: 'lager-general',
    name: '라거',
    emoji: '🍺',
    description: '세계에서 가장 많이 마시는 맥주 스타일',
    tags: ['라거', '대중', '청량', '하면발효'],
    funFact: '전 세계 맥주의 약 90%가 라거 스타일이에요',
  },

  // === 에일 (Ale) ===
  {
    id: 'ipa',
    name: 'IPA',
    emoji: '🌿',
    description: '홉의 쓴맛과 과일향이 폭발하는 인디아 페일 에일',
    tags: ['에일', 'IPA', '홉', '쓴맛'],
    funFact: '영국에서 인도로 가는 긴 항해를 위해 홉을 많이 넣은 게 시작!',
  },
  {
    id: 'pale-ale',
    name: '페일 에일',
    emoji: '🧡',
    description: '균형 잡힌 홉과 맥아, IPA보다 부드러운 에일',
    tags: ['에일', '균형', '부드러움', '영국'],
    funFact: 'IPA의 조상격으로, 18세기 영국에서 탄생했어요',
  },
  {
    id: 'stout',
    name: '스타우트',
    emoji: '🖤',
    description: '검은색 흑맥주, 커피와 초콜릿 향',
    tags: ['에일', '흑맥주', '커피', '초콜릿'],
    funFact: '기네스가 대표적인 아일랜드 스타일 스타우트예요',
  },
  {
    id: 'porter',
    name: '포터',
    emoji: '☕',
    description: '스타우트보다 약한 흑맥주, 달콤한 캐러멜 향',
    tags: ['에일', '흑맥주', '캐러멜', '런던'],
    funFact: '18세기 런던 항구 노동자들이 즐겨 마셔서 Porter라는 이름이 붙었어요',
  },

  // === 밀맥주 & 벨지안 ===
  {
    id: 'weizen',
    name: '바이젠',
    emoji: '🥖',
    description: '독일식 밀맥주, 부드럽고 바나나/클로브 향',
    tags: ['밀맥주', '부드러움', '독일', '바나나향'],
    funFact: '밀 함량이 50% 이상인 독일 전통 맥주예요',
  },
  {
    id: 'witbier',
    name: '벨지안 위트',
    emoji: '🍊',
    description: '벨기에식 밀맥주, 오렌지 껍질과 코리앤더 향',
    tags: ['밀맥주', '벨기에', '오렌지', '상큼'],
    funFact: '호가든이 대표적인 벨지안 위트비어예요',
  },
  {
    id: 'tripel',
    name: '트리펠',
    emoji: '🍯',
    description: '벨기에 강한 에일, 달콤하고 높은 도수',
    tags: ['에일', '벨기에', '강함', '달콤'],
    funFact: '알코올 도수가 8-12%로 높지만 놀랍도록 부드러워요',
  },

  // === 사워 & 특수 맥주 ===
  {
    id: 'sour-ale',
    name: '사워 에일',
    emoji: '🍋',
    description: '새콤한 맛의 에일, 과일 향 풍부',
    tags: ['에일', '사워', '새콤', '과일'],
    funFact: '유산균 발효로 요거트 같은 새콤함이 특징이에요',
  },
  {
    id: 'fruit-beer',
    name: '프루트 비어',
    emoji: '🍓',
    description: '과일을 넣어 만든 달콤한 맥주',
    tags: ['특수', '과일', '달콤', '디저트'],
    funFact: '벨기에 람빅에 체리나 라즈베리를 넣은 크릭이 유명해요',
  },

  // === 크래프트 & 특수 ===
  {
    id: 'imperial-stout',
    name: '임페리얼 스타우트',
    emoji: '👑',
    description: '스타우트의 황제, 진하고 높은 도수',
    tags: ['에일', '스타우트', '강함', '황제'],
    funFact: '러시아 황제를 위해 만든 맥주로, 도수가 8-12%예요',
  },
  {
    id: 'kolsch',
    name: '쾰쉬',
    emoji: '💛',
    description: '독일 쾰른 지방 맥주, 라거처럼 깔끔한 에일',
    tags: ['에일', '독일', '깔끔', '쾰른'],
    funFact: '쾰른에서만 만들 수 있고, 200ml 작은 잔에 마셔요',
  },
  {
    id: 'amber-ale',
    name: '앰버 에일',
    emoji: '🧡',
    description: '호박색 에일, 캐러멜과 견과류 향',
    tags: ['에일', '호박색', '캐러멜', '견과류'],
    funFact: '미국 크래프트 비어 붐의 초기 주자였어요',
  },
];

// ============================================================================
// 맥주 월드컵 토너먼트 정의
// ============================================================================

export const BEER_WORLDCUP: Tournament = {
  id: 'beer-worldcup-v1',
  type: 'worldcup',
  category: 'general',
  title: '최애 맥주 스타일 월드컵',
  subtitle: '16강',
  description: '전 세계 맥주 스타일 중 당신의 최애는? 라거, 에일, 밀맥주, 사워까지 다양한 맥주 중 1등을 가려보세요!',
  emoji: '🍺',
  themeColor: 'bg-amber-100',

  contestants: BEER_WORLDCUP_CONTESTANTS,
  roundSize: 16,

  status: 'active',
  createdAt: '2025-12-25',

  resultConfig: {
    showRanking: true,
    showWinRate: true,
    showSegmentComparison: true,
    shareMessage: '나의 최애 맥주는 {winner}! 🍺',
  },
};

export default BEER_WORLDCUP;
