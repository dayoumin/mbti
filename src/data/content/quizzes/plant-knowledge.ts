// ============================================================================
// 반려식물 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const PLANT_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'plant-k-001',
    category: 'plant',
    question: '실내 화분 식물에 물을 주는 가장 좋은 방법은?',
    options: [
      { id: 'a', text: '매일 조금씩', isCorrect: false },
      { id: 'b', text: '흙이 마르면 흠뻑', isCorrect: true },
      { id: 'c', text: '잎에 뿌려주기', isCorrect: false },
      { id: 'd', text: '정해진 요일마다', isCorrect: false },
    ],
    explanation: '흙 표면이 마르면 화분 아래로 물이 빠질 때까지 충분히 주세요. 과습보다 약간 건조한 게 대부분의 식물에게 좋아요!',
    difficulty: 1,
  },
  {
    id: 'plant-k-002',
    category: 'plant',
    question: '몬스테라의 잎에 구멍이 생기는 이유는?',
    options: [
      { id: 'a', text: '병에 걸렸다', isCorrect: false },
      { id: 'b', text: '빛을 더 받기 위해', isCorrect: true },
      { id: 'c', text: '물을 적게 줘서', isCorrect: false },
      { id: 'd', text: '영양 부족', isCorrect: false },
    ],
    explanation: '열대 우림 바닥에서 위쪽 빛을 더 받기 위해 진화한 거예요. 구멍으로 빛이 아래 잎까지 통과해요!',
    difficulty: 2,
  },
  {
    id: 'plant-k-003',
    category: 'plant',
    question: '다육이와 선인장의 가장 큰 공통점은?',
    options: [
      { id: 'a', text: '모두 가시가 있다', isCorrect: false },
      { id: 'b', text: '물을 저장하는 능력', isCorrect: true },
      { id: 'c', text: '같은 과(科)에 속한다', isCorrect: false },
      { id: 'd', text: '모두 사막에서만 산다', isCorrect: false },
    ],
    explanation: '둘 다 잎이나 줄기에 물을 저장하는 "다육" 식물이에요. 선인장은 다육식물의 한 종류랍니다!',
    difficulty: 2,
  },
  {
    id: 'plant-k-004',
    category: 'plant',
    question: '식물의 잎이 노랗게 변하는 가장 흔한 원인은?',
    options: [
      { id: 'a', text: '햇빛이 너무 강해서', isCorrect: false },
      { id: 'b', text: '과습 또는 과건조', isCorrect: true },
      { id: 'c', text: '온도가 너무 높아서', isCorrect: false },
      { id: 'd', text: '화분이 작아서', isCorrect: false },
    ],
    explanation: '물 문제가 가장 흔해요! 너무 많이 주면 뿌리가 썩고, 너무 적으면 영양 공급이 안 돼요.',
    difficulty: 1,
  },
  {
    id: 'plant-k-005',
    category: 'plant',
    question: '"공기정화 식물"로 알려진 스파티필럼의 또 다른 이름은?',
    options: [
      { id: 'a', text: '행운목', isCorrect: false },
      { id: 'b', text: '스투키', isCorrect: false },
      { id: 'c', text: '피스 릴리', isCorrect: true },
      { id: 'd', text: '개운죽', isCorrect: false },
    ],
    explanation: '하얀 꽃이 평화(Peace)를 상징해서 "Peace Lily"라고 불려요. NASA 공기정화 식물 연구에서 상위권이었어요!',
    difficulty: 2,
  },
  {
    id: 'plant-k-006',
    category: 'plant',
    question: '고양이에게 위험한 반려식물은?',
    options: [
      { id: 'a', text: '해바라기', isCorrect: false },
      { id: 'b', text: '백합과 식물', isCorrect: true },
      { id: 'c', text: '바질', isCorrect: false },
      { id: 'd', text: '아레카야자', isCorrect: false },
    ],
    explanation: '백합은 고양이에게 매우 위험해요! 꽃가루만 핥아도 급성 신부전을 일으킬 수 있어요.',
    difficulty: 1,
  },
  {
    id: 'plant-k-007',
    category: 'plant',
    question: '식물을 분갈이할 때 가장 좋은 시기는?',
    options: [
      { id: 'a', text: '겨울 (휴면기)', isCorrect: false },
      { id: 'b', text: '봄 (성장기 시작)', isCorrect: true },
      { id: 'c', text: '한여름 (최성수기)', isCorrect: false },
      { id: 'd', text: '언제든 상관없음', isCorrect: false },
    ],
    explanation: '봄에 성장 활동이 시작되면 뿌리가 빠르게 적응해요. 겨울 분갈이는 스트레스가 커요!',
    difficulty: 1,
  },
  {
    id: 'plant-k-008',
    category: 'plant',
    question: '산세베리아(스투키)가 밤에 특별한 이유는?',
    options: [
      { id: 'a', text: '밤에 꽃이 핀다', isCorrect: false },
      { id: 'b', text: '밤에 산소를 방출한다', isCorrect: true },
      { id: 'c', text: '밤에 물을 흡수한다', isCorrect: false },
      { id: 'd', text: '밤에 잎이 닫힌다', isCorrect: false },
    ],
    explanation: 'CAM 식물이라서 밤에 이산화탄소를 흡수하고 산소를 내보내요. 침실에 두면 좋아요!',
    difficulty: 2,
  },
];
