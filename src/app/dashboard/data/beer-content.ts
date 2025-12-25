// ============================================================================
// 맥주 콘텐츠 - 퀴즈 10개 + VS 투표 5개
// ============================================================================

import { Quiz, Poll } from './dashboard-content';

// ============================================================================
// 맥주 지식 퀴즈 10개
// ============================================================================

export const BEER_KNOWLEDGE_QUIZZES: Quiz[] = [
  {
    id: 'beer-quiz-001',
    type: 'knowledge',
    category: 'general',
    question: '라거(Lager)와 에일(Ale)의 가장 큰 차이는?',
    options: [
      { id: 'a', text: '맥주 색깔', isCorrect: false },
      { id: 'b', text: '발효 방식과 온도', isCorrect: true },
      { id: 'c', text: '알코올 도수', isCorrect: false },
    ],
    explanation: '라거는 하면발효(5-10°C), 에일은 상면발효(15-24°C)로 만들어요. 발효 방식에 따라 맛과 향이 완전히 달라집니다!',
    difficulty: 2,
    points: 15,
    tags: ['beer', '라거', '에일', '발효'],
  },
  {
    id: 'beer-quiz-002',
    type: 'knowledge',
    category: 'general',
    question: 'IPA (India Pale Ale)의 특징은?',
    options: [
      { id: 'a', text: '부드럽고 단맛이 강함', isCorrect: false },
      { id: 'b', text: '홉을 많이 써서 쓴맛과 과일향', isCorrect: true },
      { id: 'c', text: '검은색에 커피 맛', isCorrect: false },
    ],
    explanation: 'IPA는 홉을 대량으로 사용해 강한 쓴맛과 과일향이 특징이에요. 영국에서 인도로 수출할 때 보존용으로 홉을 많이 넣은 게 시작!',
    difficulty: 2,
    points: 15,
    tags: ['beer', 'IPA', '홉', '에일'],
  },
  {
    id: 'beer-quiz-003',
    type: 'knowledge',
    category: 'general',
    question: '맥주의 4대 원료가 아닌 것은?',
    options: [
      { id: 'a', text: '물', isCorrect: false },
      { id: 'b', text: '옥수수', isCorrect: true },
      { id: 'c', text: '홉', isCorrect: false },
    ],
    explanation: '맥주 4대 원료는 물, 맥아(보리), 홉, 효모예요. 독일 맥주 순수령(라인하이츠게보트)에서 정한 전통 레시피입니다.',
    difficulty: 1,
    points: 10,
    tags: ['beer', '원료', '홉', '맥아'],
  },
  {
    id: 'beer-quiz-004',
    type: 'knowledge',
    category: 'general',
    question: '스타우트(Stout) 맥주의 특징은?',
    options: [
      { id: 'a', text: '투명하고 황금색', isCorrect: false },
      { id: 'b', text: '검은색에 커피/초콜릿 향', isCorrect: true },
      { id: 'c', text: '분홍색에 과일향', isCorrect: false },
    ],
    explanation: '스타우트는 로스팅한 맥아를 사용해 검은색이며 커피, 초콜릿 향이 나요. 기네스가 대표적이에요!',
    difficulty: 1,
    points: 10,
    tags: ['beer', '스타우트', '흑맥주'],
  },
  {
    id: 'beer-quiz-005',
    type: 'knowledge',
    category: 'general',
    question: '맥주의 적정 서빙 온도는? (라거 기준)',
    options: [
      { id: 'a', text: '0-2°C (얼음처럼 차갑게)', isCorrect: false },
      { id: 'b', text: '4-7°C (시원하게)', isCorrect: true },
      { id: 'c', text: '15-20°C (미지근하게)', isCorrect: false },
    ],
    explanation: '라거는 4-7°C가 적정 온도! 너무 차가우면 맛과 향을 제대로 느낄 수 없어요. 에일은 조금 높은 7-10°C가 좋습니다.',
    difficulty: 2,
    points: 15,
    tags: ['beer', '온도', '서빙'],
  },
  {
    id: 'beer-quiz-006',
    type: 'knowledge',
    category: 'general',
    question: '맥주 거품(Head)의 역할은?',
    options: [
      { id: 'a', text: '그냥 보기 좋으라고', isCorrect: false },
      { id: 'b', text: '산화 방지 + 향 보존 + 입안감 향상', isCorrect: true },
      { id: 'c', text: '알코올 도수를 낮춤', isCorrect: false },
    ],
    explanation: '거품은 맥주의 산화를 막고 향을 가두며 부드러운 입안감을 만들어줘요. 이상적 비율은 맥주 대비 10-15%입니다!',
    difficulty: 2,
    points: 15,
    tags: ['beer', '거품', '서빙'],
  },
  {
    id: 'beer-quiz-007',
    type: 'knowledge',
    category: 'general',
    question: '밀맥주(Wheat Beer)의 특징은?',
    options: [
      { id: 'a', text: '진하고 쓴맛', isCorrect: false },
      { id: 'b', text: '부드럽고 탁한 외관', isCorrect: true },
      { id: 'c', text: '검은색에 스모키', isCorrect: false },
    ],
    explanation: '밀맥주는 밀을 주원료로 써서 부드럽고 가벼우며 탁한 외관이 특징! 바이젠(Weizen)이 대표적이에요.',
    difficulty: 2,
    points: 15,
    tags: ['beer', '밀맥주', '바이젠'],
  },
  {
    id: 'beer-quiz-008',
    type: 'knowledge',
    category: 'general',
    question: '맥주에 카페인이 들어있다?',
    options: [
      { id: 'a', text: '맞다, 소량 함유', isCorrect: false },
      { id: 'b', text: '틀렸다, 카페인 없음', isCorrect: true },
      { id: 'c', text: '다크 맥주에만 있음', isCorrect: false },
    ],
    explanation: '맥주에는 카페인이 없어요! 맥주는 보리(맥아)로 만들고, 커피는 커피 원두로 만들어요. 전혀 다른 작물입니다.',
    difficulty: 1,
    points: 10,
    tags: ['beer', '카페인', '성분'],
  },
  {
    id: 'beer-quiz-009',
    type: 'knowledge',
    category: 'general',
    question: '크래프트 비어(Craft Beer)의 정의는?',
    options: [
      { id: 'a', text: '대기업이 만든 맥주', isCorrect: false },
      { id: 'b', text: '소규모 독립 양조장의 맥주', isCorrect: true },
      { id: 'c', text: '외국산 수입 맥주', isCorrect: false },
    ],
    explanation: '크래프트 비어는 소규모 독립 양조장에서 전통 방식과 독창적 레시피로 만든 맥주를 말해요. 대량생산 맥주와 달리 개성이 강해요!',
    difficulty: 1,
    points: 10,
    tags: ['beer', '크래프트비어', '양조'],
  },
  {
    id: 'beer-quiz-010',
    type: 'knowledge',
    category: 'general',
    question: '옥토버페스트(Oktoberfest)는 어느 나라 축제?',
    options: [
      { id: 'a', text: '벨기에', isCorrect: false },
      { id: 'b', text: '독일', isCorrect: true },
      { id: 'c', text: '체코', isCorrect: false },
    ],
    explanation: '옥토버페스트는 독일 뮌헨에서 열리는 세계 최대 맥주 축제예요! 9월 중순부터 10월 초까지 약 16-18일간 진행됩니다.',
    difficulty: 1,
    points: 10,
    tags: ['beer', '옥토버페스트', '축제', '독일'],
  },
];

// ============================================================================
// 맥주 VS 투표 5개
// ============================================================================

export const BEER_VS_POLLS: Poll[] = [
  {
    id: 'beer-poll-001',
    type: 'vs',
    category: 'general',
    question: '맥주 취향은?',
    options: [
      { id: 'a', text: '라거 (깔끔하고 청량)', emoji: '🍺' },
      { id: 'b', text: '에일 (풍부하고 복잡)', emoji: '🍻' },
    ],
    tags: ['beer', '라거', '에일', '선호도'],
  },
  {
    id: 'beer-poll-002',
    type: 'vs',
    category: 'general',
    question: '맥주 색깔 선호는?',
    options: [
      { id: 'a', text: '황금색 (라거/필스너)', emoji: '🌟' },
      { id: 'b', text: '검은색 (스타우트/포터)', emoji: '🖤' },
    ],
    tags: ['beer', '색깔', '스타우트', '라거'],
  },
  {
    id: 'beer-poll-003',
    type: 'vs',
    category: 'general',
    question: '맥주 맛 취향은?',
    options: [
      { id: 'a', text: '쓴맛 강함 (IPA)', emoji: '🌿' },
      { id: 'b', text: '부드럽고 달콤 (밀맥주)', emoji: '🥖' },
    ],
    tags: ['beer', 'IPA', '밀맥주', '맛'],
  },
  {
    id: 'beer-poll-004',
    type: 'vs',
    category: 'general',
    question: '맥주 마실 때 선호하는 온도는?',
    options: [
      { id: 'a', text: '얼음처럼 차갑게', emoji: '🧊' },
      { id: 'b', text: '적정 온도(4-7°C)', emoji: '🌡️' },
    ],
    tags: ['beer', '온도', '서빙'],
  },
  {
    id: 'beer-poll-005',
    type: 'vs',
    category: 'general',
    question: '맥주 구매 기준은?',
    options: [
      { id: 'a', text: '대기업 맥주 (저렴하고 익숙)', emoji: '🏭' },
      { id: 'b', text: '크래프트 비어 (독특하고 개성)', emoji: '🎨' },
    ],
    tags: ['beer', '크래프트비어', '구매'],
  },
];
