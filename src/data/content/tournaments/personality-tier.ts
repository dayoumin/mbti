// ============================================================================
// 성격별 궁합 티어 토너먼트 - 집단지성 커플 궁합 랭킹
// ============================================================================
// 바이럴 포인트:
// 1. 커플/친구 사이 비교 유도 - "우리 조합 몇 티어?"
// 2. 논쟁 폭발 - "열정형+열정형은 왜 F티어?" 등 의견 충돌
// 3. 자기 성격 대입 - "나는 분석형인데 감성형이랑 맞을까?"
// 4. 실시간 순위 변동 - 재방문/재투표 유도
// ============================================================================

import type { TierTournament } from '../types';

export const PERSONALITY_TIER_TOURNAMENT: TierTournament = {
  id: 'personality-compatibility-tier',
  type: 'tier-tournament',
  category: 'love',

  title: '성격별 궁합 티어표',
  subtitle: '집단지성이 정하는 찰떡/최악 조합 💕',
  emoji: '💘',

  // 32개 성격 궁합 조합 (논쟁 유발 + 다양한 조합)
  items: [
    // === 안정 × 감성 계열 ===
    {
      id: 'stable-caring',
      name: '안정형 + 배려형',
      emoji: '🌸',
      description: '서로 믿고 의지하는 조화로운 관계',
      tags: ['안정', '배려', '조화']
    },
    {
      id: 'stable-emotional',
      name: '안정형 + 감성형',
      emoji: '💙',
      description: '한 사람이 감정의 닥터가 되어주는 조합',
      tags: ['안정', '감성', '보완']
    },
    {
      id: 'stable-passive',
      name: '안정형 + 순응형',
      emoji: '🕊️',
      description: '평온한 일상을 추구하는 평화주의 듀오',
      tags: ['안정', '평화', '순응']
    },
    {
      id: 'stable-sensitive',
      name: '안정형 + 섬세형',
      emoji: '🎨',
      description: '안정감 속에서 감성을 꽃피우는 관계',
      tags: ['안정', '섬세', '감성']
    },

    // === 리더 × 추진 계열 ===
    {
      id: 'leader-passionate',
      name: '리더형 + 열정형',
      emoji: '🔥',
      description: '함께 목표를 향해 질주하는 드림팀',
      tags: ['리더', '열정', '추진력']
    },
    {
      id: 'leader-rational',
      name: '리더형 + 분석형',
      emoji: '💼',
      description: '전략과 실행력의 완벽한 조화',
      tags: ['리더', '분석', '전략']
    },
    {
      id: 'leader-supporter',
      name: '리더형 + 서포터형',
      emoji: '🤝',
      description: '왕과 참모, 역할 분담이 명확한 조합',
      tags: ['리더', '서포터', '협력']
    },
    {
      id: 'leader-leader',
      name: '리더형 + 리더형',
      emoji: '👑',
      description: '권력 다툼 vs 최강 파워커플?',
      tags: ['리더', '경쟁', '충돌']
    },

    // === 분석 × 합리 계열 ===
    {
      id: 'rational-rational',
      name: '분석형 + 분석형',
      emoji: '🧠',
      description: '논리로 소통하는 이성적 관계',
      tags: ['분석', '논리', '이성']
    },
    {
      id: 'rational-emotional',
      name: '분석형 + 감성형',
      emoji: '🎭',
      description: '극과 극이 만나면? 싸움 or 밸런스',
      tags: ['분석', '감성', '극과극']
    },
    {
      id: 'rational-creative',
      name: '분석형 + 창의형',
      emoji: '🎨',
      description: '현실과 상상이 만나는 독특한 조합',
      tags: ['분석', '창의', '보완']
    },
    {
      id: 'rational-supporter',
      name: '분석형 + 서포터형',
      emoji: '📊',
      description: '냉정한 판단, 따뜻한 실행의 조화',
      tags: ['분석', '서포터', '균형']
    },

    // === 감성 × 예술 계열 ===
    {
      id: 'emotional-emotional',
      name: '감성형 + 감성형',
      emoji: '💗',
      description: '서로의 감정을 깊이 이해하는 소울메이트',
      tags: ['감성', '공감', '깊이']
    },
    {
      id: 'emotional-creative',
      name: '감성형 + 창의형',
      emoji: '🌈',
      description: '감성과 상상력이 폭발하는 예술가 커플',
      tags: ['감성', '창의', '예술']
    },
    {
      id: 'emotional-caring',
      name: '감성형 + 배려형',
      emoji: '🫂',
      description: '서로를 어루만지는 힐링 관계',
      tags: ['감성', '배려', '힐링']
    },
    {
      id: 'emotional-passive',
      name: '감성형 + 순응형',
      emoji: '🌙',
      description: '한쪽이 감정 폭발, 한쪽이 수습하는 조합',
      tags: ['감성', '순응', '역할분담']
    },

    // === 열정 × 도전 계열 ===
    {
      id: 'passionate-passionate',
      name: '열정형 + 열정형',
      emoji: '🌋',
      description: '불과 불이 만나면 폭발? 시너지?',
      tags: ['열정', '에너지', '폭발']
    },
    {
      id: 'passionate-adventurer',
      name: '열정형 + 모험가형',
      emoji: '🚀',
      description: '함께 세계를 정복하는 역동적 듀오',
      tags: ['열정', '모험', '도전']
    },
    {
      id: 'passionate-stable',
      name: '열정형 + 안정형',
      emoji: '⚖️',
      description: '가속페달과 브레이크의 조합',
      tags: ['열정', '안정', '균형']
    },
    {
      id: 'passionate-passive',
      name: '열정형 + 순응형',
      emoji: '🎢',
      description: '한쪽이 끌고 가면 한쪽이 따라가는 관계',
      tags: ['열정', '순응', '주도권']
    },

    // === 창의 × 자유 계열 ===
    {
      id: 'creative-creative',
      name: '창의형 + 창의형',
      emoji: '🎪',
      description: '독특한 아이디어가 폭발하는 천재 조합',
      tags: ['창의', '독창', '아이디어']
    },
    {
      id: 'creative-adventurer',
      name: '창의형 + 모험가형',
      emoji: '🦄',
      description: '상상을 현실로 만드는 꿈의 팀',
      tags: ['창의', '모험', '실험']
    },
    {
      id: 'creative-stable',
      name: '창의형 + 안정형',
      emoji: '🏠',
      description: '꿈과 현실의 줄다리기',
      tags: ['창의', '안정', '타협']
    },
    {
      id: 'creative-supporter',
      name: '창의형 + 서포터형',
      emoji: '🌟',
      description: '꿈을 꾸는 사람과 실현하는 사람',
      tags: ['창의', '서포터', '협력']
    },

    // === 서포터 × 배려 계열 ===
    {
      id: 'supporter-supporter',
      name: '서포터형 + 서포터형',
      emoji: '🤗',
      description: '서로 양보만 하다가 결정 못 하는 조합?',
      tags: ['서포터', '배려', '우유부단']
    },
    {
      id: 'supporter-caring',
      name: '서포터형 + 배려형',
      emoji: '💝',
      description: '서로를 챙기는 따뜻한 관계',
      tags: ['서포터', '배려', '따뜻']
    },
    {
      id: 'supporter-passive',
      name: '서포터형 + 순응형',
      emoji: '🌿',
      description: '평온하지만 갈등 회피 성향 강함',
      tags: ['서포터', '순응', '평온']
    },
    {
      id: 'supporter-sensitive',
      name: '서포터형 + 섬세형',
      emoji: '🎀',
      description: '세심한 배려로 서로를 이해하는 조합',
      tags: ['서포터', '섬세', '이해']
    },

    // === 모험 × 자유 계열 ===
    {
      id: 'adventurer-adventurer',
      name: '모험가형 + 모험가형',
      emoji: '🏔️',
      description: '안전 따위 없는 스릴 넘치는 관계',
      tags: ['모험', '자유', '스릴']
    },
    {
      id: 'adventurer-stable',
      name: '모험가형 + 안정형',
      emoji: '🧳',
      description: '자유 vs 정착, 가치관 충돌 가능성',
      tags: ['모험', '안정', '충돌']
    },
    {
      id: 'adventurer-caring',
      name: '모험가형 + 배려형',
      emoji: '🗺️',
      description: '한쪽이 모험, 한쪽이 베이스캠프',
      tags: ['모험', '배려', '역할분담']
    },
    {
      id: 'adventurer-rational',
      name: '모험가형 + 분석형',
      emoji: '🎯',
      description: '직관 vs 계획, 생각의 차이가 큼',
      tags: ['모험', '분석', '차이']
    },
  ],

  // 커스텀 티어 라벨 (연애 궁합 버전)
  tierLabels: {
    'S': '환상의 짝궁 💯',
    'A': '찰떡 조합 👏',
    'B': '무난한 궁합 👍',
    'C': '노력 필요 😅',
    'D': '부딪힐 수 있음 😐',
    'F': '극과 극 💥',
  },

  // 바이럴 훅
  viralHooks: {
    debateTopics: [
      '열정형+열정형은 왜 F티어?',
      '리더형+리더형 vs 서포터+서포터',
      '분석형+감성형 극과 극 논란',
      '안정형+모험가형은 절대 안 맞음?',
      '같은 성격끼리 만나면?',
      '진짜 환상의 궁합은 뭐야?',
    ],
    fandoms: [
      '리더형', '분석형', '감성형', '열정형',
      '안정형', '창의형', '서포터형', '모험가형',
    ],
  },

  tags: ['성격', '궁합', '연애', '커플', '티어', '찰떡', '최악의조합'],

  meta: {
    ageRating: 'all',
    createdBy: 'ai',
    createdAt: '2025-12-26',
    priority: 90,  // 높은 우선순위
    timeSensitivity: {
      sensitivity: 'none',  // 보편적 성향, 반영구 콘텐츠
      sourceYear: 2025,
    },
  },
};

// 전체 export
export const PERSONALITY_TIER_TOURNAMENTS: TierTournament[] = [
  PERSONALITY_TIER_TOURNAMENT,
];
