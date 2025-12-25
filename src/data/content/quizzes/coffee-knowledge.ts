// ============================================================================
// 커피 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const COFFEE_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  // ========== 쉬움 (3개) ==========
  {
    id: 'coffee-k-001',
    category: 'coffee',
    question: '아메리카노의 카페인 함량을 결정하는 가장 중요한 요소는?',
    options: [
      { id: 'a', text: '물의 양', isCorrect: false },
      { id: 'b', text: '에스프레소 샷 수', isCorrect: true },
      { id: 'c', text: '컵의 크기', isCorrect: false },
      { id: 'd', text: '물의 온도', isCorrect: false },
    ],
    explanation: '에스프레소 1샷은 약 63-77mg의 카페인을 함유해요. 물을 희석해도 카페인 양은 동일하므로, 샷 수가 많을수록 카페인이 높아요!',
    difficulty: 1,
    tags: ['coffee', '카페인', '아메리카노', '에스프레소', '기초'],
    source: 'coffee-fact-001',
  },
  {
    id: 'coffee-k-002',
    category: 'coffee',
    question: '아라비카와 로부스타 중 카페인 함량이 더 높은 것은?',
    options: [
      { id: 'a', text: '아라비카', isCorrect: false },
      { id: 'b', text: '로부스타', isCorrect: true },
      { id: 'c', text: '둘 다 같다', isCorrect: false },
      { id: 'd', text: '로스팅에 따라 다르다', isCorrect: false },
    ],
    explanation: '로부스타는 약 2.7% 카페인을 함유하고, 아라비카는 약 1.5%예요. 로부스타가 거의 2배 많아요! 카페인이 많을수록 쓴맛이 강해져요.',
    difficulty: 1,
    tags: ['coffee', '원두', '아라비카', '로부스타', '카페인'],
    source: 'coffee-fact-002',
  },
  {
    id: 'coffee-k-003',
    category: 'coffee',
    question: '라이트 로스팅 커피의 특징은?',
    options: [
      { id: 'a', text: '쓴맛이 강하다', isCorrect: false },
      { id: 'b', text: '과일향과 꽃향이 강하다', isCorrect: true },
      { id: 'c', text: '산미가 거의 없다', isCorrect: false },
      { id: 'd', text: '카페인이 가장 적다', isCorrect: false },
    ],
    explanation: '라이트 로스팅(385-410°F)은 원두의 원래 특성을 보존해서 과일향, 꽃향이 강하고 산미가 높아요. 카페인도 가장 많아요!',
    difficulty: 1,
    tags: ['coffee', '로스팅', '라이트로스트', '맛', '향'],
    source: 'coffee-fact-003',
  },

  // ========== 보통 (4개) ==========
  {
    id: 'coffee-k-004',
    category: 'coffee',
    question: '프렌치 프레스로 커피를 추출할 때 권장 분쇄도는?',
    options: [
      { id: 'a', text: '아주 곱게 (에스프레소용)', isCorrect: false },
      { id: 'b', text: '중간 (드립용)', isCorrect: false },
      { id: 'c', text: '굵게 (바다소금 크기)', isCorrect: true },
      { id: 'd', text: '분쇄하지 않은 원두', isCorrect: false },
    ],
    explanation: '프렌치 프레스는 4-5분간 물과 원두가 직접 접촉하는 침출식이에요. 너무 곱게 갈면 과추출되고 필터를 통과해 텁텁해져요.',
    difficulty: 2,
    tags: ['coffee', '프렌치프레스', '분쇄도', '추출', '방법'],
    source: 'coffee-fact-004',
  },
  {
    id: 'coffee-k-005',
    category: 'coffee',
    question: '드립 커피의 가장 큰 특징은?',
    options: [
      { id: 'a', text: '고압으로 빠르게 추출', isCorrect: false },
      { id: 'b', text: '종이 필터로 깔끔한 맛', isCorrect: true },
      { id: 'c', text: '침출식으로 진한 바디감', isCorrect: false },
      { id: 'd', text: '크레마 생성', isCorrect: false },
    ],
    explanation: '드립 커피는 종이 필터를 사용해 미세한 입자와 오일을 걸러내서 깔끔하고 부드러운 맛이 나요. 미국인의 41%가 매일 드립 커피를 마셔요!',
    difficulty: 2,
    tags: ['coffee', '드립', '필터', '추출', '맛'],
    source: 'coffee-fact-004',
  },
  {
    id: 'coffee-k-006',
    category: 'coffee',
    question: '커피 로스팅 시 캐러멜, 견과류, 초콜릿 향을 만드는 화학 반응은?',
    options: [
      { id: 'a', text: '발효 반응', isCorrect: false },
      { id: 'b', text: '마이야르 반응', isCorrect: true },
      { id: 'c', text: '산화 반응', isCorrect: false },
      { id: 'd', text: '중합 반응', isCorrect: false },
    ],
    explanation: '마이야르 반응은 열에 의해 아미노산과 당이 결합하면서 갈색으로 변하고 복합적인 향미를 만들어요. 스테이크 굽는 것과 같은 원리예요!',
    difficulty: 2,
    tags: ['coffee', '로스팅', '화학', '마이야르', '향'],
    source: 'coffee-fact-005',
  },
  {
    id: 'coffee-k-007',
    category: 'coffee',
    question: '다크 로스팅 커피가 라이트 로스팅보다 산미가 낮은 이유는?',
    options: [
      { id: 'a', text: '카페인이 더 많아서', isCorrect: false },
      { id: 'b', text: '산성 화합물이 분해되어서', isCorrect: true },
      { id: 'c', text: '물을 더 많이 흡수해서', isCorrect: false },
      { id: 'd', text: '설탕 함량이 높아서', isCorrect: false },
    ],
    explanation: '다크 로스팅(430-480°F)은 고온에서 산성 화합물이 분해되어 산미가 낮아져요. 그래서 위가 예민한 사람에게 더 좋아요!',
    difficulty: 2,
    tags: ['coffee', '로스팅', '다크로스트', '산미', '화학'],
    source: 'coffee-fact-003',
  },

  // ========== 어려움 (3개) ==========
  {
    id: 'coffee-k-008',
    category: 'coffee',
    question: '로부스타가 아라비카보다 병충해에 강한 이유는?',
    options: [
      { id: 'a', text: '뿌리가 더 깊어서', isCorrect: false },
      { id: 'b', text: '카페인이 천연 살충제 역할을 해서', isCorrect: true },
      { id: 'c', text: '잎이 더 두꺼워서', isCorrect: false },
      { id: 'd', text: '성장 속도가 빨라서', isCorrect: false },
    ],
    explanation: '카페인은 식물의 천연 방어 메커니즘이에요. 로부스타가 아라비카보다 카페인이 2배 많아서 해충에 강하지만, 그만큼 쓴맛도 강해져요.',
    difficulty: 3,
    tags: ['coffee', '로부스타', '카페인', '생물학', '병충해'],
    source: 'coffee-fact-002',
  },
  {
    id: 'coffee-k-009',
    category: 'coffee',
    question: 'FDA가 권장하는 건강한 성인의 하루 최대 카페인 섭취량은?',
    options: [
      { id: 'a', text: '200mg', isCorrect: false },
      { id: 'b', text: '300mg', isCorrect: false },
      { id: 'c', text: '400mg', isCorrect: true },
      { id: 'd', text: '500mg', isCorrect: false },
    ],
    explanation: '미국 FDA는 건강한 성인 기준 하루 400mg(아메리카노 약 3-4잔) 이하를 권장해요. 임산부나 카페인 민감자는 더 적게 섭취해야 해요.',
    difficulty: 3,
    tags: ['coffee', '카페인', '건강', 'FDA', '섭취량'],
    source: 'coffee-fact-006',
  },
  {
    id: 'coffee-k-010',
    category: 'coffee',
    question: '아라비카가 세계 커피 시장에서 차지하는 비중은?',
    options: [
      { id: 'a', text: '약 50%', isCorrect: false },
      { id: 'b', text: '약 60%', isCorrect: false },
      { id: 'c', text: '약 70%', isCorrect: true },
      { id: 'd', text: '약 80%', isCorrect: false },
    ],
    explanation: '아라비카는 세계 커피 시장의 약 70%를 차지해요. 달콤하고 과일향이 나며 설탕/지방 함량이 높아 스페셜티 커피에 주로 사용돼요!',
    difficulty: 3,
    tags: ['coffee', '아라비카', '시장', '통계', '품종'],
    source: 'coffee-fact-007',
  },
];
