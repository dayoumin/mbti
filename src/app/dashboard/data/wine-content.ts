// ============================================================================
// 와인 콘텐츠 - 퀴즈 10개 + VS 투표 5개
// ============================================================================

import { Quiz, Poll } from './content-samples';

// ============================================================================
// 와인 지식 퀴즈 10개
// ============================================================================

export const WINE_KNOWLEDGE_QUIZZES: Quiz[] = [
  {
    id: 'wine-quiz-001',
    type: 'knowledge',
    category: 'food',
    question: '레드 와인의 색이 빨간 이유는?',
    options: [
      { id: 'a', text: '적포도 과육 색깔', isCorrect: false },
      { id: 'b', text: '적포도 껍질과 함께 발효', isCorrect: true },
      { id: 'c', text: '색소 첨가', isCorrect: false },
    ],
    explanation: '레드 와인은 적포도 껍질과 함께 발효하여 색소를 추출해요. 과육은 대부분 투명합니다!',
    difficulty: 1,
    points: 10,
    tags: ['wine', '레드와인', '발효', '제조법'],
  },
  {
    id: 'wine-quiz-002',
    type: 'knowledge',
    category: 'food',
    question: '레드 와인의 적정 서빙 온도는?',
    options: [
      { id: 'a', text: '6-8°C (아주 차갑게)', isCorrect: false },
      { id: 'b', text: '15-18°C (약간 서늘)', isCorrect: true },
      { id: 'c', text: '25°C 이상 (실온)', isCorrect: false },
    ],
    explanation: '레드 와인은 15-18°C가 적정 온도예요. 너무 따뜻하면 알코올 냄새가 강해지고, 차가우면 향이 닫혀요.',
    difficulty: 2,
    points: 15,
    tags: ['wine', '서빙온도', '레드와인'],
  },
  {
    id: 'wine-quiz-003',
    type: 'knowledge',
    category: 'food',
    question: '와인의 "타닌(Tannin)"이란?',
    options: [
      { id: 'a', text: '단맛을 내는 성분', isCorrect: false },
      { id: 'b', text: '떫은맛을 내는 성분', isCorrect: true },
      { id: 'c', text: '신맛을 내는 성분', isCorrect: false },
    ],
    explanation: '타닌은 포도 껍질, 씨, 줄기에서 나오는 폴리페놀로, 입안을 마르게 하는 떫은맛을 내요. 레드 와인에 많습니다!',
    difficulty: 2,
    points: 15,
    tags: ['wine', '타닌', '성분', '맛'],
  },
  {
    id: 'wine-quiz-004',
    type: 'knowledge',
    category: 'food',
    question: '와인을 눕혀서 보관하는 이유는?',
    options: [
      { id: 'a', text: '공간 절약', isCorrect: false },
      { id: 'b', text: '코르크 건조 방지', isCorrect: true },
      { id: 'c', text: '와인 맛 향상', isCorrect: false },
    ],
    explanation: '코르크가 마르면 공기가 들어가 와인이 산화돼요. 와인에 코르크를 적셔 밀봉 상태를 유지합니다!',
    difficulty: 1,
    points: 10,
    tags: ['wine', '보관법', '코르크'],
  },
  {
    id: 'wine-quiz-005',
    type: 'knowledge',
    category: 'food',
    question: '와인의 "바디(Body)"란 무엇일까요?',
    options: [
      { id: 'a', text: '와인의 색 진하기', isCorrect: false },
      { id: 'b', text: '와인의 무게감, 농도감', isCorrect: true },
      { id: 'c', text: '와인의 알코올 도수', isCorrect: false },
    ],
    explanation: '바디는 와인의 무게감이에요. 풀 바디(진하고 묵직함), 미디엄 바디(중간), 라이트 바디(가볍고 산뜻함)로 나뉩니다.',
    difficulty: 2,
    points: 15,
    tags: ['wine', '바디', '특성', '용어'],
  },
  {
    id: 'wine-quiz-006',
    type: 'knowledge',
    category: 'food',
    question: '카베르네 소비뇽의 특징은?',
    options: [
      { id: 'a', text: '라이트 바디, 체리 향', isCorrect: false },
      { id: 'b', text: '풀 바디, 높은 타닌, 블랙커런트 향', isCorrect: true },
      { id: 'c', text: '미디엄 바디, 자두 향', isCorrect: false },
    ],
    explanation: '카베르네 소비뇽은 대표적인 풀 바디 레드 와인! 타닌이 높고 블랙커런트, 블랙베리 향이 특징입니다.',
    difficulty: 2,
    points: 15,
    tags: ['wine', '품종', '카베르네소비뇽', '적포도'],
  },
  {
    id: 'wine-quiz-007',
    type: 'knowledge',
    category: 'food',
    question: '디캔팅(Decanting)을 하는 이유는?',
    options: [
      { id: 'a', text: '와인을 차갑게 하려고', isCorrect: false },
      { id: 'b', text: '산소 접촉으로 향미 개방', isCorrect: true },
      { id: 'c', text: '와인을 예쁘게 담으려고', isCorrect: false },
    ],
    explanation: '디캔팅은 와인을 공기에 노출시켜 향미를 풍부하게 만들어요. 풀 바디 레드나 오래된 와인에 효과적입니다!',
    difficulty: 2,
    points: 15,
    tags: ['wine', '디캔팅', '서빙', '용어'],
  },
  {
    id: 'wine-quiz-008',
    type: 'knowledge',
    category: 'food',
    question: '화이트 와인과 해산물이 잘 어울리는 이유는?',
    options: [
      { id: 'a', text: '색이 잘 어울려서', isCorrect: false },
      { id: 'b', text: '산도가 비린내를 중화', isCorrect: true },
      { id: 'c', text: '차갑게 마셔서', isCorrect: false },
    ],
    explanation: '화이트 와인의 높은 산도가 해산물의 비린내를 중화시켜 청량하게 만들어줘요. 레몬과 비슷한 원리!',
    difficulty: 2,
    points: 15,
    tags: ['wine', '페어링', '화이트와인', '음식매칭'],
  },
  {
    id: 'wine-quiz-009',
    type: 'knowledge',
    category: 'food',
    question: '와인 산화의 증상이 아닌 것은?',
    options: [
      { id: 'a', text: '색이 갈색으로 변함', isCorrect: false },
      { id: 'b', text: '식초 냄새가 남', isCorrect: false },
      { id: 'c', text: '더 달콤해짐', isCorrect: true },
    ],
    explanation: '산화된 와인은 갈변되고 식초 냄새가 나며 과일향이 사라져요. 달콤해지는 건 산화 증상이 아닙니다!',
    difficulty: 2,
    points: 15,
    tags: ['wine', '보관', '산화', '품질'],
  },
  {
    id: 'wine-quiz-010',
    type: 'knowledge',
    category: 'food',
    question: '와인 "빈티지(Vintage)"란?',
    options: [
      { id: 'a', text: '와인 제조사 이름', isCorrect: false },
      { id: 'b', text: '포도 수확 연도', isCorrect: true },
      { id: 'c', text: '와인 숙성 기간', isCorrect: false },
    ],
    explanation: '빈티지는 포도 수확 연도예요! 그해 기후에 따라 품질이 달라져서 좋은 빈티지는 가격도 높아요.',
    difficulty: 1,
    points: 10,
    tags: ['wine', '빈티지', '용어'],
  },
];

// ============================================================================
// 와인 VS 투표 5개
// ============================================================================

export const WINE_VS_POLLS: Poll[] = [
  {
    id: 'wine-poll-001',
    type: 'vs',
    category: 'food',
    question: '와인 선호도는?',
    options: [
      { id: 'a', text: '레드 와인 (풍부하고 진함)', emoji: '🍷' },
      { id: 'b', text: '화이트 와인 (산뜻하고 가벼움)', emoji: '🥂' },
    ],
    tags: ['wine', '선호도', '레드', '화이트'],
  },
  {
    id: 'wine-poll-002',
    type: 'vs',
    category: 'food',
    question: '적포도 품종 선호는?',
    options: [
      { id: 'a', text: '카베르네 소비뇽 (묵직하고 타닌 강함)', emoji: '🔥' },
      { id: 'b', text: '피노 누아 (가볍고 부드러움)', emoji: '🍓' },
    ],
    tags: ['wine', '품종', '적포도', '카베르네', '피노누아'],
  },
  {
    id: 'wine-poll-003',
    type: 'vs',
    category: 'food',
    question: '청포도 품종 선호는?',
    options: [
      { id: 'a', text: '샤도네이 (풍성하고 버터 향)', emoji: '🧈' },
      { id: 'b', text: '소비뇽 블랑 (상큼하고 허브 향)', emoji: '🌿' },
    ],
    tags: ['wine', '품종', '청포도', '샤도네이', '소비뇽블랑'],
  },
  {
    id: 'wine-poll-004',
    type: 'vs',
    category: 'food',
    question: '와인 즐기는 스타일은?',
    options: [
      { id: 'a', text: '스파클링 (샴페인, 프로세코)', emoji: '🥂' },
      { id: 'b', text: '스틸 와인 (일반 레드/화이트)', emoji: '🍷' },
    ],
    tags: ['wine', '스타일', '스파클링', '샴페인'],
  },
  {
    id: 'wine-poll-005',
    type: 'vs',
    category: 'food',
    question: '와인 페어링 음식은?',
    options: [
      { id: 'a', text: '레드 와인 + 스테이크', emoji: '🥩' },
      { id: 'b', text: '화이트 와인 + 해산물', emoji: '🦞' },
    ],
    tags: ['wine', '페어링', '음식매칭'],
  },
];
