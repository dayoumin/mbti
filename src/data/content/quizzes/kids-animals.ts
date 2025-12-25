// ============================================================================
// 키즈용 동물 지식 퀴즈 (ageRating: 'kids')
// 10세 미만 사용자에게 30% 추천 부스트
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const KIDS_ANIMAL_QUIZZES: KnowledgeQuiz[] = [
  // ==========================================================================
  // 고양이 퀴즈 (쉬운 난이도)
  // ==========================================================================
  {
    id: 'kids-cat-001',
    category: 'cat',
    question: '고양이가 기분이 좋을 때 내는 소리는?',
    options: [
      { id: 'a', text: '멍멍!', isCorrect: false },
      { id: 'b', text: '그르릉~', isCorrect: true },
      { id: 'c', text: '꿱꿱!', isCorrect: false },
      { id: 'd', text: '짹짹!', isCorrect: false },
    ],
    explanation: '고양이는 기분이 좋으면 "그르릉~" 소리를 내요. 이걸 "골골송"이라고 부르기도 해요! 🐱',
    difficulty: 1,
    tags: ['고양이', '소리', '기분', '골골송'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-cat-002',
    category: 'cat',
    question: '고양이 발바닥에 있는 귀여운 부분의 이름은?',
    options: [
      { id: 'a', text: '젤리', isCorrect: false },
      { id: 'b', text: '발톱', isCorrect: false },
      { id: 'c', text: '육구 (고양이 발바닥)', isCorrect: true },
      { id: 'd', text: '쿠션', isCorrect: false },
    ],
    explanation: '고양이 발바닥의 말랑말랑한 부분을 "육구"라고 불러요. 젤리처럼 부드럽고 귀여워요! 🐾',
    difficulty: 1,
    tags: ['고양이', '발바닥', '육구', '신체'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-cat-003',
    category: 'cat',
    question: '고양이 눈이 어둠 속에서 반짝이는 이유는?',
    options: [
      { id: 'a', text: '마법의 힘이 있어서', isCorrect: false },
      { id: 'b', text: '눈에서 빛이 나와서', isCorrect: false },
      { id: 'c', text: '빛을 반사하는 거울이 있어서', isCorrect: true },
      { id: 'd', text: '항상 반짝이는 건 아니야', isCorrect: false },
    ],
    explanation: '고양이 눈 안에는 작은 거울 같은 게 있어서 빛을 반사해요. 그래서 어둠 속에서도 잘 볼 수 있어요! ✨',
    difficulty: 1,
    tags: ['고양이', '눈', '야행성', '빛', '신비'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-cat-004',
    category: 'cat',
    question: '고양이가 꼬리를 바짝 세우면 어떤 기분일까?',
    options: [
      { id: 'a', text: '화났다', isCorrect: false },
      { id: 'b', text: '기분 좋고 반갑다', isCorrect: true },
      { id: 'c', text: '무섭다', isCorrect: false },
      { id: 'd', text: '배고프다', isCorrect: false },
    ],
    explanation: '꼬리를 쫙 세우는 건 "안녕! 반가워!"라는 뜻이에요. 고양이의 인사법이랍니다! 🐱💕',
    difficulty: 1,
    tags: ['고양이', '꼬리', '감정', '인사', '행동'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },

  // ==========================================================================
  // 강아지 퀴즈 (쉬운 난이도)
  // ==========================================================================
  {
    id: 'kids-dog-001',
    category: 'dog',
    question: '강아지가 꼬리를 흔들면 어떤 뜻일까?',
    options: [
      { id: 'a', text: '화가 났다', isCorrect: false },
      { id: 'b', text: '신나고 기분 좋다', isCorrect: true },
      { id: 'c', text: '졸리다', isCorrect: false },
      { id: 'd', text: '배가 아프다', isCorrect: false },
    ],
    explanation: '강아지가 꼬리를 흔드는 건 "기분 좋아!", "반가워!"라는 뜻이에요! 🐕💕',
    difficulty: 1,
    tags: ['강아지', '꼬리', '감정', '행동', '기분'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-dog-002',
    category: 'dog',
    question: '강아지 코가 항상 촉촉한 이유는?',
    options: [
      { id: 'a', text: '감기에 걸려서', isCorrect: false },
      { id: 'b', text: '냄새를 더 잘 맡기 위해서', isCorrect: true },
      { id: 'c', text: '물을 많이 마셔서', isCorrect: false },
      { id: 'd', text: '그냥 원래 그런 거야', isCorrect: false },
    ],
    explanation: '강아지 코가 촉촉하면 냄새 입자가 잘 붙어서 냄새를 더 잘 맡을 수 있어요! 강아지 코는 슈퍼 파워! 👃✨',
    difficulty: 1,
    tags: ['강아지', '코', '후각', '신체', '냄새'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-dog-003',
    category: 'dog',
    question: '강아지가 혀를 내밀고 헥헥거리는 이유는?',
    options: [
      { id: 'a', text: '배가 고파서', isCorrect: false },
      { id: 'b', text: '더워서 시원해지려고', isCorrect: true },
      { id: 'c', text: '친구를 찾아서', isCorrect: false },
      { id: 'd', text: '놀아달라고', isCorrect: false },
    ],
    explanation: '강아지는 땀을 흘리지 않아서 혀로 열을 식혀요. 에어컨 같은 거예요! 🌬️🐕',
    difficulty: 1,
    tags: ['강아지', '혀', '더위', '신체', '체온조절'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-dog-004',
    category: 'dog',
    question: '강아지가 빙글빙글 돌다가 눕는 이유는?',
    options: [
      { id: 'a', text: '어지러워서', isCorrect: false },
      { id: 'b', text: '잠자리가 편한지 확인하려고', isCorrect: true },
      { id: 'c', text: '춤추는 거야', isCorrect: false },
      { id: 'd', text: '운동하는 거야', isCorrect: false },
    ],
    explanation: '옛날 야생에서 풀을 눕혀서 침대를 만들던 습관이 남은 거예요! 똑똑한 강아지! 🐕💤',
    difficulty: 1,
    tags: ['강아지', '수면', '습관', '행동', '본능'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },

  // ==========================================================================
  // 토끼 퀴즈 (쉬운 난이도)
  // ==========================================================================
  {
    id: 'kids-rabbit-001',
    category: 'rabbit',
    question: '토끼가 기분 좋을 때 하는 행동은?',
    options: [
      { id: 'a', text: '멍하니 있기', isCorrect: false },
      { id: 'b', text: '점프하며 몸을 비틀기', isCorrect: true },
      { id: 'c', text: '소리 지르기', isCorrect: false },
      { id: 'd', text: '눈 감기', isCorrect: false },
    ],
    explanation: '토끼가 점프하면서 몸을 비트는 건 "빙키"라고 해요! "너무 신나!"라는 뜻이에요! 🐰🎉',
    difficulty: 1,
    tags: ['토끼', '빙키', '감정', '행동', '기분'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-rabbit-002',
    category: 'rabbit',
    question: '토끼 귀가 긴 이유는 무엇일까?',
    options: [
      { id: 'a', text: '예뻐 보이려고', isCorrect: false },
      { id: 'b', text: '멀리서 나는 소리도 잘 듣기 위해', isCorrect: true },
      { id: 'c', text: '날아가려고', isCorrect: false },
      { id: 'd', text: '그냥 원래 그런 거야', isCorrect: false },
    ],
    explanation: '토끼는 긴 귀로 아주 멀리 있는 소리도 들을 수 있어요. 슈퍼 히어로 귀! 🐰👂',
    difficulty: 1,
    tags: ['토끼', '귀', '청각', '신체', '감각'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },

  // ==========================================================================
  // 햄스터 퀴즈 (쉬운 난이도)
  // ==========================================================================
  {
    id: 'kids-hamster-001',
    category: 'hamster',
    question: '햄스터가 볼에 음식을 넣는 이유는?',
    options: [
      { id: 'a', text: '맛있어서 계속 먹으려고', isCorrect: false },
      { id: 'b', text: '안전한 곳에 저장하려고', isCorrect: true },
      { id: 'c', text: '볼이 아파서', isCorrect: false },
      { id: 'd', text: '장난치는 거야', isCorrect: false },
    ],
    explanation: '햄스터 볼주머니는 마법 가방 같아요! 음식을 넣어서 집으로 가져가 저장해요! 🐹🍎',
    difficulty: 1,
    tags: ['햄스터', '볼주머니', '음식', '저장', '습성'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-hamster-002',
    category: 'hamster',
    question: '햄스터가 쳇바퀴를 열심히 도는 이유는?',
    options: [
      { id: 'a', text: '지루해서', isCorrect: false },
      { id: 'b', text: '운동하고 에너지를 쓰려고', isCorrect: true },
      { id: 'c', text: '쳇바퀴가 예뻐서', isCorrect: false },
      { id: 'd', text: '도망치려고', isCorrect: false },
    ],
    explanation: '야생 햄스터는 하루에 엄청 멀리 뛰어다녀요! 집에서는 쳇바퀴로 운동해요! 🐹🏃',
    difficulty: 1,
    tags: ['햄스터', '쳇바퀴', '운동', '습성', '활동'],
    source: 'general-knowledge',
    meta: {
      ageRating: 'kids',
    },
  },

  // ==========================================================================
  // 일반 동물 상식 퀴즈
  // ==========================================================================
  {
    id: 'kids-animal-001',
    category: 'personality',
    question: '다음 중 밤에 활동하는 동물은?',
    options: [
      { id: 'a', text: '닭', isCorrect: false },
      { id: 'b', text: '부엉이', isCorrect: true },
      { id: 'c', text: '참새', isCorrect: false },
      { id: 'd', text: '비둘기', isCorrect: false },
    ],
    explanation: '부엉이는 밤에 눈을 크게 뜨고 활동해요! 어둠 속에서도 잘 볼 수 있는 큰 눈을 가졌어요! 🦉🌙',
    difficulty: 1,
    tags: ['동물', '야행성', '부엉이', '새', '습성'],
    meta: {
      ageRating: 'kids',
    },
  },
  {
    id: 'kids-animal-002',
    category: 'personality',
    question: '기린의 목이 긴 이유는 무엇일까?',
    options: [
      { id: 'a', text: '높은 나무 잎을 먹으려고', isCorrect: true },
      { id: 'b', text: '예뻐 보이려고', isCorrect: false },
      { id: 'c', text: '친구를 찾으려고', isCorrect: false },
      { id: 'd', text: '빨리 달리려고', isCorrect: false },
    ],
    explanation: '기린은 긴 목으로 다른 동물들이 못 먹는 높은 나무 잎을 먹을 수 있어요! 🦒🌳',
    difficulty: 1,
    tags: ['동물', '기린', '목', '적응', '먹이'],
    meta: {
      ageRating: 'kids',
    },
  },
];
