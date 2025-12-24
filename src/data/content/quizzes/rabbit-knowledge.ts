// ============================================================================
// 토끼 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const RABBIT_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'rabbit-k-001',
    category: 'rabbit',
    question: '토끼가 옆으로 "퐁"하고 뛰어오르는 행동(빙키)의 의미는?',
    options: [
      { id: 'a', text: '놀라서 도망가는 것', isCorrect: false },
      { id: 'b', text: '매우 기쁘고 행복한 표현', isCorrect: true },
      { id: 'c', text: '운동 부족 신호', isCorrect: false },
      { id: 'd', text: '발정기 행동', isCorrect: false },
    ],
    explanation: '"빙키(Binky)"는 토끼가 극도로 행복할 때 하는 점프예요! 공중에서 몸을 비틀며 뛰어오르는 귀여운 행동이에요.',
    difficulty: 1,
    tags: ['토끼', '빙키', '행동', '감정표현', '행복'],
  },
  {
    id: 'rabbit-k-002',
    category: 'rabbit',
    question: '토끼에게 절대 주면 안 되는 음식은?',
    options: [
      { id: 'a', text: '사과 (씨 제외)', isCorrect: false },
      { id: 'b', text: '상추', isCorrect: false },
      { id: 'c', text: '아이스버그 양상추', isCorrect: true },
      { id: 'd', text: '당근', isCorrect: false },
    ],
    explanation: '아이스버그 양상추는 수분이 너무 많고 영양가가 낮아 설사를 유발해요. 로메인이나 버터헤드 상추가 더 좋아요!',
    difficulty: 2,
    tags: ['토끼', '음식', '위험', '채소', '건강'],
  },
  {
    id: 'rabbit-k-003',
    category: 'rabbit',
    question: '토끼가 뒷발로 땅을 "쿵쿵" 치는 행동의 의미는?',
    options: [
      { id: 'a', text: '놀자는 신호', isCorrect: false },
      { id: 'b', text: '위험 경고 또는 화남', isCorrect: true },
      { id: 'c', text: '배가 고프다', isCorrect: false },
      { id: 'd', text: '잠이 온다', isCorrect: false },
    ],
    explanation: '"덤핑(Thumping)"이라고 해요. 야생에서 위험을 동료에게 알리던 본능이에요. 불만이나 화가 났을 때도 해요!',
    difficulty: 1,
    tags: ['토끼', '덤핑', '행동', '경고', '감정표현'],
  },
  {
    id: 'rabbit-k-004',
    category: 'rabbit',
    question: '토끼의 이빨은 평생 몇 cm 정도 자랄까요?',
    options: [
      { id: 'a', text: '자라지 않음', isCorrect: false },
      { id: 'b', text: '1년에 약 1cm', isCorrect: false },
      { id: 'c', text: '1년에 약 12cm (월 1cm)', isCorrect: true },
      { id: 'd', text: '1년에 약 30cm', isCorrect: false },
    ],
    explanation: '토끼 이빨은 매달 약 1cm씩 자라요! 그래서 건초를 갈아 먹으며 자연스럽게 마모시켜야 해요.',
    difficulty: 2,
    tags: ['토끼', '이빨', '신체', '건강', '관리'],
  },
  {
    id: 'rabbit-k-005',
    category: 'rabbit',
    question: '토끼가 주인의 손이나 얼굴을 핥는 행동의 의미는?',
    options: [
      { id: 'a', text: '소금기를 좋아해서', isCorrect: false },
      { id: 'b', text: '"너를 사랑해" 표현', isCorrect: true },
      { id: 'c', text: '배가 고파서', isCorrect: false },
      { id: 'd', text: '영역 표시', isCorrect: false },
    ],
    explanation: '토끼끼리 서로 그루밍해주는 것처럼, 사람을 핥는 것은 애정과 신뢰의 표현이에요!',
    difficulty: 1,
    tags: ['토끼', '그루밍', '애정표현', '신뢰', '소통'],
  },
  {
    id: 'rabbit-k-006',
    category: 'rabbit',
    question: '토끼 식단에서 가장 많은 비율을 차지해야 하는 것은?',
    options: [
      { id: 'a', text: '펠릿 사료', isCorrect: false },
      { id: 'b', text: '채소', isCorrect: false },
      { id: 'c', text: '건초 (티모시 등)', isCorrect: true },
      { id: 'd', text: '과일', isCorrect: false },
    ],
    explanation: '건초가 식단의 80% 이상을 차지해야 해요! 소화 건강과 이빨 마모에 필수적이에요.',
    difficulty: 1,
    tags: ['토끼', '건초', '식단', '음식', '건강'],
  },
  {
    id: 'rabbit-k-007',
    category: 'rabbit',
    question: '토끼가 코를 빠르게 씰룩거리는 것은?',
    options: [
      { id: 'a', text: '감기에 걸렸다', isCorrect: false },
      { id: 'b', text: '흥분하거나 호기심이 많은 상태', isCorrect: true },
      { id: 'c', text: '화가 났다', isCorrect: false },
      { id: 'd', text: '배가 고프다', isCorrect: false },
    ],
    explanation: '토끼의 코 씰룩임은 주변 냄새를 맡는 행동이에요. 빠를수록 흥분하거나 관심이 많다는 뜻이에요!',
    difficulty: 1,
    tags: ['토끼', '코', '행동', '호기심', '감정표현'],
  },
  {
    id: 'rabbit-k-008',
    category: 'rabbit',
    question: '토끼의 평균 수명은 약 몇 년일까요?',
    options: [
      { id: 'a', text: '2-3년', isCorrect: false },
      { id: 'b', text: '5-8년', isCorrect: false },
      { id: 'c', text: '8-12년', isCorrect: true },
      { id: 'd', text: '15-20년', isCorrect: false },
    ],
    explanation: '적절한 관리를 받으면 8-12년까지 살 수 있어요. 중성화, 실내 사육, 좋은 식단이 중요해요!',
    difficulty: 2,
    tags: ['토끼', '수명', '건강', '관리', '중성화'],
  },
];
