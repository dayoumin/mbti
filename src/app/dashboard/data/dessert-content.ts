// ============================================================================
// 디저트 콘텐츠 (퀴즈 10개 + VS 투표 5개)
// ============================================================================

import { Quiz, Poll } from './dashboard-content';

// ============================================================================
// 디저트 지식 퀴즈 10개
// ============================================================================

export const DESSERT_KNOWLEDGE_QUIZZES: Quiz[] = [
  {
    id: 'dessert-quiz-001',
    type: 'knowledge',
    category: 'food',
    question: '마카롱의 현재 형태(두 쿠키 사이 크림)를 처음 만든 곳은?',
    options: [
      { id: 'a', text: '이탈리아 피렌체', isCorrect: false },
      { id: 'b', text: '파리의 라뒤레(Ladurée)', isCorrect: true },
      { id: 'c', text: '벨기에 브뤼셀', isCorrect: false },
    ],
    explanation: '마카롱은 16세기 이탈리아에서 프랑스로 전해졌지만, 현재의 두 쿠키 사이 크림을 넣는 형태는 20세기 초 파리의 라뒤레에서 개발했어요!',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '마카롱', '역사', '프랑스'],
  },
  {
    id: 'dessert-quiz-002',
    type: 'knowledge',
    category: 'food',
    question: '티라미수(Tiramisu)의 뜻은?',
    options: [
      { id: 'a', text: '달콤한 꿈', isCorrect: false },
      { id: 'b', text: '나를 끌어올려줘', isCorrect: true },
      { id: 'c', text: '이탈리아의 밤', isCorrect: false },
    ],
    explanation: '티라미수는 이탈리아어로 "Pick me up(나를 끌어올려줘)"라는 뜻! 카페인과 설탕으로 기운을 북돋아준다는 의미예요.',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '티라미수', '이탈리아', '의미'],
  },
  {
    id: 'dessert-quiz-003',
    type: 'knowledge',
    category: 'food',
    question: '젤라토와 아이스크림의 차이는?',
    options: [
      { id: 'a', text: '젤라토가 공기 함량 적고 유지방 낮음', isCorrect: true },
      { id: 'b', text: '둘은 같은 것', isCorrect: false },
      { id: 'c', text: '아이스크림이 더 진한 맛', isCorrect: false },
    ],
    explanation: '젤라토는 아이스크림보다 공기 함량이 적고(25-30% vs 50%), 유지방 함량도 낮아요(4-8% vs 14-18%). 그래서 더 진한 맛과 부드러운 질감이 특징!',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '젤라토', '아이스크림', '차이'],
  },
  {
    id: 'dessert-quiz-004',
    type: 'knowledge',
    category: 'food',
    question: '화이트 초콜릿에 들어있는 카카오 성분은?',
    options: [
      { id: 'a', text: '카카오 매스만', isCorrect: false },
      { id: 'b', text: '카카오 버터만', isCorrect: true },
      { id: 'c', text: '카카오 없음', isCorrect: false },
    ],
    explanation: '화이트 초콜릿은 카카오 버터만 있고 카카오 매스는 없어요! 그래서 갈색이 아닌 흰색이죠.',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '초콜릿', '카카오', '성분'],
  },
  {
    id: 'dessert-quiz-005',
    type: 'knowledge',
    category: 'food',
    question: '수플레를 만들 때 가장 중요한 것은?',
    options: [
      { id: 'a', text: '오븐 온도를 높게', isCorrect: false },
      { id: 'b', text: '머랭(휘핑한 달걀 흰자)', isCorrect: true },
      { id: 'c', text: '반죽을 많이 섞기', isCorrect: false },
    ],
    explanation: '수플레는 머랭을 베이스에 섞어 부풀려 만들어요! 오븐 문을 열면 온도가 떨어져 꺼지므로 주의가 필요해요.',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '수플레', '제과기술'],
  },
  {
    id: 'dessert-quiz-006',
    type: 'knowledge',
    category: 'food',
    question: '에클레어(Éclair)의 뜻은?',
    options: [
      { id: 'a', text: '하늘', isCorrect: false },
      { id: 'b', text: '번개', isCorrect: true },
      { id: 'c', text: '빛', isCorrect: false },
    ],
    explanation: '에클레어는 프랑스어로 "번개"! 너무 맛있어서 번개처럼 빠르게 먹게 된다는 유래가 있어요.',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '에클레어', '프랑스', '의미'],
  },
  {
    id: 'dessert-quiz-007',
    type: 'knowledge',
    category: 'food',
    question: '크렘 브륄레와 크렘 카라멜의 차이는?',
    options: [
      { id: 'a', text: '브륄레는 표면 캐러멜, 카라멜은 밑에 소스', isCorrect: true },
      { id: 'b', text: '둘은 같은 것', isCorrect: false },
      { id: 'c', text: '브륄레는 초콜릿 베이스', isCorrect: false },
    ],
    explanation: '크렘 브륄레는 표면에 설탕을 뿌려 토치로 캐러멜화하고, 크렘 카라멜은 밑에 캐러멜 소스가 깔려 있어요. 둘 다 커스터드 기반!',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '크렘브륄레', '푸딩', '차이'],
  },
  {
    id: 'dessert-quiz-008',
    type: 'knowledge',
    category: 'food',
    question: '판나코타(Panna Cotta)의 뜻은?',
    options: [
      { id: 'a', text: '하얀 꿈', isCorrect: false },
      { id: 'b', text: '익힌 크림', isCorrect: true },
      { id: 'c', text: '달콤한 밤', isCorrect: false },
    ],
    explanation: '판나코타는 이탈리아어로 "익힌 크림"! 젤라틴으로 굳힌 크림 디저트예요.',
    difficulty: 2,
    points: 15,
    tags: ['dessert', '판나코타', '이탈리아', '의미'],
  },
  {
    id: 'dessert-quiz-009',
    type: 'knowledge',
    category: 'food',
    question: '치즈케이크가 처음 만들어진 곳은?',
    options: [
      { id: 'a', text: '뉴욕', isCorrect: false },
      { id: 'b', text: '고대 그리스', isCorrect: true },
      { id: 'c', text: '프랑스', isCorrect: false },
    ],
    explanation: '치즈케이크는 고대 그리스 올림픽 선수들에게 제공되었던 역사가 있어요! 뉴욕 치즈케이크는 크림치즈를 사용한 미국식 변형이에요.',
    difficulty: 2,
    points: 20,
    tags: ['dessert', '치즈케이크', '역사', '그리스'],
  },
  {
    id: 'dessert-quiz-010',
    type: 'knowledge',
    category: 'food',
    question: '다크 초콜릿의 카카오 함량 기준은?',
    options: [
      { id: 'a', text: '50% 이상', isCorrect: false },
      { id: 'b', text: '70% 이상', isCorrect: true },
      { id: 'c', text: '90% 이상', isCorrect: false },
    ],
    explanation: '다크 초콜릿은 일반적으로 카카오 70% 이상! 밀크 초콜릿은 10-50% 정도예요.',
    difficulty: 1,
    points: 10,
    tags: ['dessert', '초콜릿', '다크초콜릿', '카카오'],
  },
];

// ============================================================================
// 디저트 VS 투표 5개
// ============================================================================

export const DESSERT_VS_POLLS: Poll[] = [
  {
    id: 'dessert-poll-001',
    type: 'vs',
    category: 'food',
    question: '케이크 vs 아이스크림, 어느 쪽?',
    options: [
      { id: 'a', text: '케이크', emoji: '🍰' },
      { id: 'b', text: '아이스크림', emoji: '🍦' },
    ],
    tags: ['dessert', '선호도', '케이크', '아이스크림'],
  },
  {
    id: 'dessert-poll-002',
    type: 'vs',
    category: 'food',
    question: '초콜릿 디저트 취향은?',
    options: [
      { id: 'a', text: '다크 초콜릿 (진하고 쌉쌀)', emoji: '🍫' },
      { id: 'b', text: '밀크 초콜릿 (달콤하고 부드러움)', emoji: '🍬' },
    ],
    tags: ['dessert', '초콜릿', '취향'],
  },
  {
    id: 'dessert-poll-003',
    type: 'vs',
    category: 'food',
    question: '프랑스 디저트 최애는?',
    options: [
      { id: 'a', text: '마카롱', emoji: '🧁' },
      { id: 'b', text: '에클레어', emoji: '🥖' },
    ],
    tags: ['dessert', '프랑스', '마카롱', '에클레어'],
  },
  {
    id: 'dessert-poll-004',
    type: 'vs',
    category: 'food',
    question: '이탈리아 디저트 최애는?',
    options: [
      { id: 'a', text: '티라미수', emoji: '☕' },
      { id: 'b', text: '판나코타', emoji: '🍮' },
    ],
    tags: ['dessert', '이탈리아', '티라미수', '판나코타'],
  },
  {
    id: 'dessert-poll-005',
    type: 'vs',
    category: 'food',
    question: '브라우니 vs 쿠키, 어느 쪽?',
    options: [
      { id: 'a', text: '브라우니 (촉촉하고 진함)', emoji: '🟫' },
      { id: 'b', text: '쿠키 (바삭하고 달콤)', emoji: '🍪' },
    ],
    tags: ['dessert', '브라우니', '쿠키', '선호도'],
  },
];

export const DESSERT_CONTENT = {
  quizzes: DESSERT_KNOWLEDGE_QUIZZES,
  polls: DESSERT_VS_POLLS,
};
