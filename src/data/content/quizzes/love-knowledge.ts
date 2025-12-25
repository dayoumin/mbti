// ============================================================================
// 연애 초기 지식 퀴즈 (썸/소개팅)
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const LOVE_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'love-k-001',
    category: 'love',
    question: '상대가 나에게 호감이 있다는 신호로 가장 확실한 것은?',
    options: [
      { id: 'a', text: '눈을 자주 마주치고 미소 짓는다', isCorrect: false },
      { id: 'b', text: '대화할 때 몸을 내 쪽으로 향한다', isCorrect: false },
      { id: 'c', text: '먼저 연락하고 구체적인 질문을 많이 한다', isCorrect: true },
      { id: 'd', text: 'SNS에 좋아요를 누른다', isCorrect: false },
    ],
    explanation: '심리학 연구에 따르면, 호감이 있는 사람에게는 먼저 연락하고 상대에 대해 구체적으로 알고 싶어해요. 단순한 시선이나 제스처보다 "행동"이 더 확실한 신호예요!',
    difficulty: 2,
    tags: ['연애', '호감신호', '심리'],
  },
  {
    id: 'love-k-002',
    category: 'love',
    question: '소개팅/첫 데이트에서 가장 피해야 할 대화 주제는?',
    options: [
      { id: 'a', text: '취미나 관심사', isCorrect: false },
      { id: 'b', text: '전 애인 이야기', isCorrect: true },
      { id: 'c', text: '최근 본 영화나 드라마', isCorrect: false },
      { id: 'd', text: '여행 경험', isCorrect: false },
    ],
    explanation: '연애 심리 전문가들이 공통으로 지적하는 첫 데이트 금기는 "전 애인 이야기". 아직 끝나지 않은 감정이 있다는 인상을 주거나, 상대를 비교 대상으로 만들 수 있어요.',
    difficulty: 1,
    tags: ['연애', '첫데이트', '대화주제'],
  },
  {
    id: 'love-k-003',
    category: 'love',
    question: '썸 단계에서 적절한 연락 빈도는?',
    options: [
      { id: 'a', text: '매일 아침저녁 인사 + 틈날 때마다', isCorrect: false },
      { id: 'b', text: '2-3일에 한 번 정도', isCorrect: false },
      { id: 'c', text: '상대의 답장 속도와 비슷하게', isCorrect: true },
      { id: 'd', text: '일주일에 한 번', isCorrect: false },
    ],
    explanation: '연애 심리학에서는 "미러링(Mirroring)"이 중요해요. 상대가 하루에 2-3번 연락하면 나도 그 정도로 맞추는 게 부담 없고 자연스러워요. 일방적으로 너무 많거나 적으면 온도차가 느껴질 수 있어요.',
    difficulty: 2,
    tags: ['연애', '연락빈도', '썸'],
  },
  {
    id: 'love-k-004',
    category: 'love',
    question: '고백하기 적절한 타이밍으로 가장 좋은 것은?',
    options: [
      { id: 'a', text: '첫 만남에서 호감이 확실하면 바로', isCorrect: false },
      { id: 'b', text: '3-5번 정도 만나고 서로 편해졌을 때', isCorrect: true },
      { id: 'c', text: '한 달 이상 충분히 알아본 후', isCorrect: false },
      { id: 'd', text: '상대가 먼저 고백할 때까지 기다린다', isCorrect: false },
    ],
    explanation: '연애 전문가들이 권장하는 타이밍은 "3-5번의 만남 후". 서로에 대한 기본 정보를 알고 편안함을 느끼되, 너무 오래 끌어 친구 존으로 가기 전이 적절해요. 감정이 식거나 다른 사람이 끼어들 수 있어요.',
    difficulty: 2,
    tags: ['연애', '고백타이밍', '썸'],
  },
  {
    id: 'love-k-005',
    category: 'love',
    question: '첫 데이트 비용, 어떻게 하는 게 좋을까?',
    options: [
      { id: 'a', text: '무조건 남자가 낸다', isCorrect: false },
      { id: 'b', text: '정확히 반반 더치페이', isCorrect: false },
      { id: 'c', text: '한 사람이 밥값, 다른 사람이 카페값 등 번갈아', isCorrect: true },
      { id: 'd', text: '먼저 제안한 사람이 낸다', isCorrect: false },
    ],
    explanation: '최근 연애 트렌드 조사에 따르면, 첫 데이트에서는 "번갈아 내기"가 가장 선호돼요. 한 사람이 전부 내면 부담스럽고, 정확한 더치는 너무 계산적으로 보일 수 있어요. "내가 밥 살게, 너는 디저트 사!" 같은 게 자연스러워요.',
    difficulty: 1,
    tags: ['연애', '첫데이트', '데이트비용'],
    meta: { minAge: '20s' },
  },
];
