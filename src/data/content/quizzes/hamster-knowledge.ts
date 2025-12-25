// ============================================================================
// 햄스터 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const HAMSTER_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  // 난이도 1 (쉬움) - 3개
  {
    id: 'hamster-k-001',
    category: 'hamster',
    question: '햄스터는 언제 주로 활동하는 동물일까요?',
    options: [
      { id: 'a', text: '아침에만 활동', isCorrect: false },
      { id: 'b', text: '낮 시간에 활동', isCorrect: false },
      { id: 'c', text: '저녁~밤에 활동 (야행성)', isCorrect: true },
      { id: 'd', text: '24시간 활동', isCorrect: false },
    ],
    explanation: '햄스터는 야행성 동물이에요! 낮에는 잠을 자고 저녁부터 밤에 활동하며 먹이를 찾아다녀요.',
    difficulty: 1,
    tags: ['햄스터', '야행성', '생활패턴', '습성'],
    source: 'hamster-fact-002',
  },
  {
    id: 'hamster-k-002',
    category: 'hamster',
    question: '햄스터가 볼주머니에 먹이를 저장하는 습성 때문에 붙여진 이름의 유래는?',
    options: [
      { id: 'a', text: '영어 "hammer(망치)" - 단단한 먹이를 부수는 모습', isCorrect: false },
      { id: 'b', text: '독일어 "hamstern(저장하다)"', isCorrect: true },
      { id: 'c', text: '라틴어 "hamatus(갈고리)" - 발톱 모양', isCorrect: false },
      { id: 'd', text: '프랑스어 "hameau(작은 마을)" - 굴 파는 습성', isCorrect: false },
    ],
    explanation: '"Hamster"는 독일어 "hamstern(저장하다)"에서 유래했어요! 볼주머니에 먹이를 가득 저장하는 습성을 보고 이름이 붙여졌답니다.',
    difficulty: 1,
    tags: ['햄스터', '어원', '볼주머니', '저장습성', '지식'],
    source: 'hamster-fact-003',
  },
  {
    id: 'hamster-k-003',
    category: 'hamster',
    question: '햄스터에게 절대 주면 안 되는 음식은?',
    options: [
      { id: 'a', text: '당근', isCorrect: false },
      { id: 'b', text: '초콜릿', isCorrect: true },
      { id: 'c', text: '사과 (씨 제외)', isCorrect: false },
      { id: 'd', text: '시금치', isCorrect: false },
    ],
    explanation: '초콜릿의 테오브로민 성분은 햄스터가 분해하지 못해 중독을 일으킬 수 있어요. 양파, 생콩도 절대 금물이에요!',
    difficulty: 1,
    tags: ['햄스터', '음식', '위험', '건강', '독성'],
    source: 'hamster-fact-006',
  },

  // 난이도 2 (보통) - 4개
  {
    id: 'hamster-k-004',
    category: 'hamster',
    question: '햄스터의 평균 수명은 약 몇 년일까요?',
    options: [
      { id: 'a', text: '1년 미만', isCorrect: false },
      { id: 'b', text: '2-3년', isCorrect: true },
      { id: 'c', text: '5-7년', isCorrect: false },
      { id: 'd', text: '10년 이상', isCorrect: false },
    ],
    explanation: '햄스터는 평균 2-3년을 살아요. 로보로브스키 햄스터가 3-4년으로 가장 오래 살며, 좋은 환경에서는 더 오래 살 수도 있어요!',
    difficulty: 2,
    tags: ['햄스터', '수명', '로보로브스키', '건강', '관리'],
    source: 'hamster-fact-001',
  },
  {
    id: 'hamster-k-005',
    category: 'hamster',
    question: '햄스터의 이빨은 어떤 특징이 있나요?',
    options: [
      { id: 'a', text: '태어날 때부터 다 자라 있음', isCorrect: false },
      { id: 'b', text: '평생 자라므로 갈아야 함', isCorrect: true },
      { id: 'c', text: '1년에 한 번 이갈이', isCorrect: false },
      { id: 'd', text: '사람처럼 유치와 영구치로 교체', isCorrect: false },
    ],
    explanation: '햄스터의 이빨은 평생 자라요! 그래서 나무 막대나 딱딱한 간식으로 이빨을 갈 수 있게 해줘야 해요.',
    difficulty: 2,
    tags: ['햄스터', '이빨', '신체', '관리', '건강'],
    source: 'hamster-fact-004',
  },
  {
    id: 'hamster-k-006',
    category: 'hamster',
    question: '시리안(골든) 햄스터의 올바른 사육 방법은?',
    options: [
      { id: 'a', text: '여러 마리를 함께 키움 (합사)', isCorrect: false },
      { id: 'b', text: '한 마리씩 단독으로 키움', isCorrect: true },
      { id: 'c', text: '암수 한 쌍만 합사 가능', isCorrect: false },
      { id: 'd', text: '어릴 때부터 키우면 합사 가능', isCorrect: false },
    ],
    explanation: '시리안 햄스터는 단독 생활을 해야 해요! 합사하면 죽을 때까지 싸우므로 반드시 한 마리씩 키워야 합니다.',
    difficulty: 2,
    tags: ['햄스터', '시리안', '골든', '합사금지', '단독생활'],
    source: 'hamster-fact-005',
  },
  {
    id: 'hamster-k-007',
    category: 'hamster',
    question: '햄스터 식단에서 가장 많은 비율을 차지해야 하는 것은?',
    options: [
      { id: 'a', text: '해바라기씨 등 씨앗류', isCorrect: false },
      { id: 'b', text: '펠릿 사료 (약 80%)', isCorrect: true },
      { id: 'c', text: '채소와 과일', isCorrect: false },
      { id: 'd', text: '견과류', isCorrect: false },
    ],
    explanation: '펠릿 사료가 식단의 약 80%를 차지해야 해요. 씨앗 위주 사료는 비만 위험이 있어서 주의해야 합니다!',
    difficulty: 2,
    tags: ['햄스터', '식단', '펠릿', '영양', '건강'],
    source: 'hamster-fact-009',
  },

  // 난이도 3 (어려움) - 3개
  {
    id: 'hamster-k-008',
    category: 'hamster',
    question: '햄스터 케이지의 베딩(깔짚)은 최소 몇 cm 이상 깊게 깔아야 할까요?',
    options: [
      { id: 'a', text: '3cm', isCorrect: false },
      { id: 'b', text: '5cm', isCorrect: false },
      { id: 'c', text: '10cm', isCorrect: true },
      { id: 'd', text: '20cm', isCorrect: false },
    ],
    explanation: '햄스터는 야생에서 굴을 파며 사는 습성이 있어서 최소 10cm 이상 깊게 깔아야 스트레스를 줄일 수 있어요!',
    difficulty: 3,
    tags: ['햄스터', '베딩', '케이지', '굴파기', '환경'],
    source: 'hamster-fact-008',
  },
  {
    id: 'hamster-k-009',
    category: 'hamster',
    question: '햄스터에게 적정한 온도와 습도는?',
    options: [
      { id: 'a', text: '15-18°C, 습도 70-80%', isCorrect: false },
      { id: 'b', text: '20-25°C, 습도 40-60%', isCorrect: true },
      { id: 'c', text: '25-30°C, 습도 30-40%', isCorrect: false },
      { id: 'd', text: '10-15°C, 습도 50-70%', isCorrect: false },
    ],
    explanation: '햄스터는 사막 출신이지만 추위에 약해요. 온도 20-25°C, 습도 40-60%를 유지해야 건강하게 지낼 수 있어요!',
    difficulty: 3,
    tags: ['햄스터', '온도', '습도', '환경', '건강'],
    source: 'hamster-fact-007',
  },
  {
    id: 'hamster-k-010',
    category: 'hamster',
    question: '가장 작은 햄스터 종인 로보로브스키 햄스터의 성체 크기는?',
    options: [
      { id: 'a', text: '10-15cm', isCorrect: false },
      { id: 'b', text: '7-10cm', isCorrect: false },
      { id: 'c', text: '5-7cm', isCorrect: false },
      { id: 'd', text: '2.5-5cm', isCorrect: true },
    ],
    explanation: '로보로브스키 햄스터는 성체가 되어도 2.5-5cm 정도밖에 안 되는 가장 작은 햄스터예요! 정말 작고 귀엽죠?',
    difficulty: 3,
    tags: ['햄스터', '로보로브스키', '크기', '품종', '지식'],
    source: 'hamster-fact-012',
  },
];
