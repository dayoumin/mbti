// ============================================================================
// 햄스터 지식 퀴즈
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const HAMSTER_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  {
    id: 'hamster-k-001',
    category: 'hamster',
    question: '햄스터의 평균 수명은?',
    options: [
      { id: 'a', text: '1년 미만', isCorrect: false },
      { id: 'b', text: '1.5~3년', isCorrect: true },
      { id: 'c', text: '5~7년', isCorrect: false },
      { id: 'd', text: '10년 이상', isCorrect: false },
    ],
    explanation: '햄스터의 평균 수명은 1.5~3년이에요. 시리안 햄스터는 비교적 짧은 수명을 가진고 있어요!',
    difficulty: 1,
    tags: ['햄스터', '수명', '기본정보'],
    source: 'hamster-fact-001',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-002',
    category: 'hamster',
    question: '햄스터는 주로 언제 활동하나요?',
    options: [
      { id: 'a', text: '낮에 활동', isCorrect: false },
      { id: 'b', text: '밤에 활동 (야행성)', isCorrect: true },
      { id: 'c', text: '아침에만 활동', isCorrect: false },
      { id: 'd', text: '24시간 계속 활동', isCorrect: false },
    ],
    explanation: '햄스터는 야행성 동물이에요. 주로 밤에 활동하고 낮에는 잠을 자요!',
    difficulty: 1,
    tags: ['햄스터', '야행성', '활동', '습성'],
    source: 'hamster-fact-002',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-003',
    category: 'hamster',
    question: '햄스터에게 절대 주면 안 되는 과일은?',
    options: [
      { id: 'a', text: '5%', isCorrect: false },
      { id: 'b', text: '10%', isCorrect: true },
      { id: 'c', text: '20%', isCorrect: false },
      { id: 'd', text: '30%', isCorrect: false },
    ],
    explanation: '햄스터는 볼주머니에 체중의 최대 20%까지 음식을 저장할 수 있어요! 볼주머니는 어깨까지 확장 가능해요.',
    difficulty: 2,
    tags: ['햄스터', '볼주머니', '체중', '저장'],
    source: 'hamster-fact-003',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-004',
    category: 'hamster',
    question: '햄스터는 시리안 햄스터 방법으로 올바른 것은?',
    options: [
      { id: 'a', text: '여러 마리 함께 키우기', isCorrect: false },
      { id: 'b', text: '반드시 단독 사육', isCorrect: true },
      { id: 'c', text: '같은 성별끼리만 가능', isCorrect: false },
      { id: 'd', text: '혼자 키우기', isCorrect: false },
    ],
    explanation: '시리안 햄스터 방법은 여러 마리 함께 키우는 게 좋아요. 하지만 같은 성별끼리만 가능해서 혼자 키우기가 어려울 수 있어요!',
    difficulty: 2,
    tags: ['햄스터', '시리안', '방법', '키우기'],
    source: 'hamster-fact-004',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-005',
    category: 'hamster',
    question: '햄스터에게 필요한 깊이의 최소 깊이는?',
    options: [
      { id: 'a', text: '10cm', isCorrect: false },
      { id: 'b', text: '15cm', isCorrect: true },
      { id: 'c', text: '20cm', isCorrect: false },
      { id: 'd', text: '25cm', isCorrect: false },
    ],
    explanation: '햄스터는 최소 15cm 깊이가 적정해요. 너무 얕으면 탈출이 어려워요!',
    difficulty: 2,
    tags: ['햄스터', '깊이', '환경', '크기'],
    source: 'hamster-fact-005',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-006',
    category: 'hamster',
    question: '햄스터에게 필요한 깔찜 최소 깊이는?',
    options: [
      { id: 'a', text: '5cm', isCorrect: false },
      { id: 'b', text: '10cm', isCorrect: true },
      { id: 'c', text: '15cm', isCorrect: false },
      { id: 'd', text: '20cm', isCorrect: false },
    ],
    explanation: '햄스터는 최소 10cm 깔찜이 적정해요. 너무 얕으면 탈출이 어려워요!',
    difficulty: 2,
    tags: ['햄스터', '깔찜', '환경', '크기'],
    source: 'hamster-fact-006',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-007',
    category: 'hamster',
    question: '햄스터에게 절대 주면 안 되는 음식은?',
    options: [
      { id: 'a', text: '무향 종이 깔짚', isCorrect: false },
      { id: 'b', text: '소나무/삼나무 깔짚', isCorrect: true },
      { id: 'c', text: '재생 종이 깔짚', isCorrect: false },
      { id: 'd', text: '유독성 햄스터', isCorrect: false },
    ],
    explanation: '무향 종이 깔짚은 독성이 있어요. 햄스터가 건강에 해를 줄 수 있어요!',
    difficulty: 1,
    tags: ['햄스터', '음식', '위험', '독성'],
    source: 'hamster-fact-007',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-008',
    category: 'hamster',
    question: '햄스터에게 절대 사용하면 안 되는 깔짚은?',
    options: [
      { id: 'a', text: '플라스틱', isCorrect: false },
      { id: 'b', text: '물통', isCorrect: true },
      { id: 'c', text: '금속', isCorrect: false },
      { id: 'd', text: '유리', isCorrect: false },
    ],
    explanation: '금속 깔짚은 햄스터에게 치명적인 위험해요. 햄스터는 금속을 씹어서 물을 마시는 습성이에요!',
    difficulty: 2,
    tags: ['햄스터', '깔짚', '위험', '금속'],
    source: 'hamster-fact-008',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-009',
    category: 'hamster',
    question: '햄스터가 깔찜을 사용하면 어떤 이유는?',
    options: [
      { id: 'a', text: '놀이 좋아서', isCorrect: false },
      { id: 'b', text: '청결 본능이에요', isCorrect: true },
      { id: 'c', text: '건강에 좋아서', isCorrect: false },
      { id: 'd', text: '보온을 좋아서', isCorrect: false },
    ],
    explanation: '깔찜은 놀이 공간을 확보해주는 것 중요해요. 햄스터가 깔찜을 사용하면 건강을 지켜주고 놀이를 제공해요!',
    difficulty: 1,
    tags: ['햄스터', '깔찜', '놀이', '건강'],
    source: 'hamster-fact-009',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-010',
    category: 'hamster',
    question: '햄스터에게 필요한 깊이의 최소 깊이는?',
    options: [
      { id: 'a', text: '10cm', isCorrect: false },
      { id: 'b', text: '15cm', isCorrect: true },
      { id: 'c', text: '20cm', isCorrect: false },
      { id: 'd', text: '25cm', isCorrect: false },
    ],
    explanation: '햄스터는 최소 15cm 깊이가 적정해요. 너무 얕으면 탈출이 어려워요!',
    difficulty: 2,
    tags: ['햄스터', '깊이', '환경', '크기'],
    source: 'hamster-fact-005',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-011',
    category: 'hamster',
    question: '햄스터가 무향 종이 깔짚은?',
    options: [
      { id: 'a', text: '무향 종이', isCorrect: false },
      { id: 'b', text: '향이 있는 종이', isCorrect: true },
      { id: 'c', text: '상관없음', isCorrect: false },
      { id: 'd', text: '상관 있는 종이', isCorrect: false },
    ],
    explanation: '햄스터는 무향 종이 깔짚은 독성이 있어요. 햄스터가 건강에 해를 줄 수 있어요!',
    difficulty: 1,
    tags: ['햄스터', '깔짚', '위험', '독성'],
    source: 'hamster-fact-010',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-012',
    category: 'hamster',
    question: '햄스터에게 절대 사용하면 안 되는 깔짚은?',
    options: [
      { id: 'a', text: '플라스틱', isCorrect: false },
      { id: 'b', text: '물통', isCorrect: true },
      { id: 'c', text: '금속', isCorrect: false },
      { id: 'd', text: '유리', isCorrect: false },
    ],
    explanation: '금속 깔짚은 햄스터에게 치명적인 위험해요. 햄스터는 금속을 씹어서 물을 마시는 습성이에요!',
    difficulty: 2,
    tags: ['햄스터', '깔짚', '위험', '금속'],
    source: 'hamster-fact-008',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-013',
    category: 'hamster',
    question: '햄스터가 "Wet Tail"은 햄스터의 어떤 증상인가요?',
    options: [
      { id: 'a', text: '변비', isCorrect: false },
      { id: 'b', text: '설사', isCorrect: true },
      { id: 'c', text: '탈모', isCorrect: false },
      { id: 'd', text: '피부병', isCorrect: false },
    ],
    explanation: '"Wet Tail"은 햄스터의 설사 증상 용어예요. 치료 안 하면 24시간 내 사망할 수 있어 즉시 병원가 야야 해요!',
    difficulty: 1,
    tags: ['햄스터', 'wet tail', '설사', '건강', '응급'],
    source: 'hamster-fact-013',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-014',
    category: 'hamster',
    question: '햄스터가 가장 큰 깊이 종은?',
    options: [
      { id: 'a', text: '로보로브스키', isCorrect: false },
      { id: 'b', text: '윈터화이트', isCorrect: true },
      { id: 'c', text: '시리안 햄스터', isCorrect: false },
      { id: 'd', text: '차이니즈 햄스터', isCorrect: false },
    ],
    explanation: '로보로브스키는 가장 큰 깊이 종이에요. 30cm 깊이까지 자라죠!',
    difficulty: 1,
    tags: ['햄스터', '깊이', '종', '환경'],
    source: 'hamster-fact-014',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
  {
    id: 'hamster-k-015',
    category: 'hamster',
    question: '햄스터가 더위해 취약한 이유는?',
    options: [
      { id: 'a', text: '털이 많아서', isCorrect: false },
      { id: 'b', text: '땀샘이 없어서', isCorrect: true },
      { id: 'c', text: '물을 안 마셔서', isCorrect: false },
      { id: 'd', text: '움직임이 많아서', isCorrect: false },
    ],
    explanation: '햄스터는 땀샘이 없고 물을 안 마셔서 취약해요. �소리 없으면 건강이 위험해요!',
    difficulty: 1,
    tags: ['햄스터', '취약', '건강', '위험'],
    source: 'hamster-fact-015',
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    }
  },
];

export default HAMSTER_KNOWLEDGE_QUIZZES;
