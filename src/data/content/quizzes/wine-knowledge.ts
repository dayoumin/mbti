// ============================================================================
// 와인 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const WINE_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  // ========== 쉬움 (3개) ==========
  {
    id: 'wine-k-001',
    category: 'alcohol',
    question: '레드 와인이 붉은 색을 띠는 이유는?',
    options: [
      { id: 'a', text: '적포도의 과육 때문에', isCorrect: false },
      { id: 'b', text: '적포도 껍질과 함께 발효해서', isCorrect: true },
      { id: 'c', text: '레드 와인 효모를 사용해서', isCorrect: false },
      { id: 'd', text: '참나무 통에서 숙성해서', isCorrect: false },
    ],
    explanation: '레드 와인은 적포도를 껍질과 함께 발효시켜 껍질의 색소가 추출되어 붉은 색이 나요. 화이트 와인은 껍질을 제거하고 포도즙만 발효시켜요!',
    difficulty: 1,
    tags: ['alcohol', '와인', '레드와인', '발효', '기초'],
    source: 'wine-fact-001',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    },
  },
  {
    id: 'wine-k-002',
    category: 'alcohol',
    question: '레드 와인의 적정 서빙 온도는?',
    options: [
      { id: 'a', text: '6-8°C', isCorrect: false },
      { id: 'b', text: '8-12°C', isCorrect: false },
      { id: 'c', text: '15-18°C', isCorrect: true },
      { id: 'd', text: '20-25°C', isCorrect: false },
    ],
    explanation: '레드 와인은 15-18°C가 적정 온도예요. 너무 따뜻하면 알코올 냄새가 강해지고, 너무 차가우면 향이 안 나요!',
    difficulty: 1,
    tags: ['alcohol', '와인', '레드와인', '서빙', '온도'],
    source: 'wine-fact-002',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },
  {
    id: 'wine-k-003',
    category: 'alcohol',
    question: '와인에서 떫은맛과 입안이 마르는 느낌을 만드는 성분은?',
    options: [
      { id: 'a', text: '산도(Acidity)', isCorrect: false },
      { id: 'b', text: '타닌(Tannin)', isCorrect: true },
      { id: 'c', text: '당분(Sugar)', isCorrect: false },
      { id: 'd', text: '알코올', isCorrect: false },
    ],
    explanation: '타닌은 포도 껍질, 씨, 줄기에서 나오는 폴리페놀 성분이에요. 떫은맛을 내고, 타닌이 많을수록 장기 숙성이 가능해요!',
    difficulty: 1,
    tags: ['alcohol', '와인', '타닌', '성분', '기초'],
    source: 'wine-fact-003',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },

  // ========== 보통 (4개) ==========
  {
    id: 'wine-k-004',
    category: 'alcohol',
    question: '와인 코르크가 마르지 않도록 보관하는 방법은?',
    options: [
      { id: 'a', text: '세워서 보관', isCorrect: false },
      { id: 'b', text: '눕혀서 보관', isCorrect: true },
      { id: 'c', text: '거꾸로 보관', isCorrect: false },
      { id: 'd', text: '보관 방법은 상관없다', isCorrect: false },
    ],
    explanation: '와인을 눕혀서 보관하면 코르크가 와인에 항상 젖어있어 건조하지 않아요. 코르크가 마르면 공기가 들어가 산화되어 와인이 상해요!',
    difficulty: 2,
    tags: ['alcohol', '와인', '보관', '코르크', '산화'],
    source: 'wine-fact-009',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },
  {
    id: 'wine-k-005',
    category: 'alcohol',
    question: '와인의 무게감과 농도를 나타내는 용어는?',
    options: [
      { id: 'a', text: '타닌(Tannin)', isCorrect: false },
      { id: 'b', text: '바디(Body)', isCorrect: true },
      { id: 'c', text: '산도(Acidity)', isCorrect: false },
      { id: 'd', text: '알코올', isCorrect: false },
    ],
    explanation: '바디는 와인의 무게감, 농도감을 나타내요. 풀 바디(카베르네 소비뇽)는 묵직하고, 라이트 바디(피노 누아)는 가볍고 산뜻해요!',
    difficulty: 2,
    tags: ['alcohol', '와인', '바디', '특성', '용어'],
    source: 'wine-fact-005',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },
  {
    id: 'wine-k-006',
    category: 'alcohol',
    question: '카베르네 소비뇽의 특징으로 올바른 것은?',
    options: [
      { id: 'a', text: '라이트 바디, 낮은 타닌', isCorrect: false },
      { id: 'b', text: '풀 바디, 높은 타닌', isCorrect: true },
      { id: 'c', text: '미디엄 바디, 중간 타닌', isCorrect: false },
      { id: 'd', text: '라이트 바디, 높은 산도', isCorrect: false },
    ],
    explanation: '카베르네 소비뇽은 풀 바디에 높은 타닌을 가진 대표적인 레드 와인이에요. 블랙커런트 향이 나고 스테이크 같은 고기와 잘 어울려요!',
    difficulty: 2,
    tags: ['alcohol', '와인', '품종', '카베르네소비뇽', '적포도'],
    source: 'wine-fact-006',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },
  {
    id: 'wine-k-007',
    category: 'alcohol',
    question: '디캔팅(Decanting)을 하는 가장 큰 이유는?',
    options: [
      { id: 'a', text: '와인을 차갑게 만들려고', isCorrect: false },
      { id: 'b', text: '산소 접촉으로 향미를 개방하려고', isCorrect: true },
      { id: 'c', text: '알코올 도수를 낮추려고', isCorrect: false },
      { id: 'd', text: '와인의 색을 진하게 만들려고', isCorrect: false },
    ],
    explanation: '디캔팅은 산소와 접촉시켜 향미를 개방하고 침전물을 제거하는 과정이에요. 풀 바디 레드 와인이나 오래된 와인에 주로 해요!',
    difficulty: 2,
    tags: ['alcohol', '와인', '디캔팅', '서빙', '향미'],
    source: 'wine-fact-010',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },

  // ========== 어려움 (3개) ==========
  {
    id: 'wine-k-008',
    category: 'alcohol',
    question: '산도가 높은 화이트 와인이 해산물과 잘 어울리는 이유는?',
    options: [
      { id: 'a', text: '단맛이 비린내를 가려서', isCorrect: false },
      { id: 'b', text: '산도가 비린내를 중화시켜서', isCorrect: true },
      { id: 'c', text: '알코올이 비린내를 제거해서', isCorrect: false },
      { id: 'd', text: '차가운 온도가 비린내를 억제해서', isCorrect: false },
    ],
    explanation: '산도가 높은 화이트 와인은 레몬을 뿌린 것처럼 비린내를 중화시켜요. 그래서 생선, 굴 같은 해산물과 완벽한 조화를 이뤄요!',
    difficulty: 3,
    tags: ['alcohol', '와인', '페어링', '산도', '해산물'],
    source: 'wine-fact-008',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },
  {
    id: 'wine-k-009',
    category: 'alcohol',
    question: '와인이 산화되면 나타나는 증상이 아닌 것은?',
    options: [
      { id: 'a', text: '갈색으로 변한다', isCorrect: false },
      { id: 'b', text: '식초 냄새가 난다', isCorrect: false },
      { id: 'c', text: '과일향이 손실된다', isCorrect: false },
      { id: 'd', text: '타닌이 증가한다', isCorrect: true },
    ],
    explanation: '와인이 산화되면 갈변, 식초 냄새, 과일향 손실이 일어나요. 타닌은 증가하지 않고 오히려 분해돼요. 개봉 후 냉장 보관하면 2-5일 정도 보관 가능해요!',
    difficulty: 3,
    tags: ['alcohol', '와인', '산화', '보관', '증상'],
    source: 'wine-fact-009',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },
  {
    id: 'wine-k-010',
    category: 'alcohol',
    question: '와인 라벨에 표기된 "빈티지(Vintage)"가 의미하는 것은?',
    options: [
      { id: 'a', text: '와인 병입 연도', isCorrect: false },
      { id: 'b', text: '포도 수확 연도', isCorrect: true },
      { id: 'c', text: '와인 출시 연도', isCorrect: false },
      { id: 'd', text: '와이너리 설립 연도', isCorrect: false },
    ],
    explanation: '빈티지는 포도를 수확한 연도예요. 그해 기후에 따라 품질이 달라지기 때문에 같은 와이너리, 같은 품종이라도 빈티지에 따라 맛이 달라요!',
    difficulty: 3,
    tags: ['alcohol', '와인', '빈티지', '용어', '품질'],
    source: 'wine-fact-011',
    meta: {
      ageRating: 'adult',
      ageRestrictionReason: 'alcohol',
    },
  },
];
