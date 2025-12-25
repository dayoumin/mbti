// ============================================================================
// 여행 콘텐츠 - 퀴즈 10개 + VS 투표 5개
// ============================================================================

import { Quiz, Poll } from './dashboard-content';

// ============================================================================
// 여행 지식 퀴즈 10개
// ============================================================================

export const TRAVEL_KNOWLEDGE_QUIZZES: Quiz[] = [
  {
    id: 'travel-quiz-001',
    type: 'knowledge',
    category: 'travel',
    question: '여권 유효기간은 입국일 기준 최소 몇 개월 남아야 할까요? (대부분의 국가)',
    options: [
      { id: 'a', text: '3개월', isCorrect: false },
      { id: 'b', text: '6개월', isCorrect: true },
      { id: 'c', text: '12개월', isCorrect: false },
    ],
    explanation: '대부분의 국가는 입국일 기준 여권 유효기간이 최소 6개월 이상 남아있어야 합니다. 출발 전 반드시 확인하세요!',
    difficulty: 1,
    points: 10,
    tags: ['travel', '여권', '준비사항'],
  },
  {
    id: 'travel-quiz-002',
    type: 'knowledge',
    category: 'travel',
    question: '시차 적응을 위해 가장 좋은 방법은?',
    options: [
      { id: 'a', text: '도착 즉시 현지 시간에 맞춰 생활', isCorrect: true },
      { id: 'b', text: '낮잠을 충분히 잔다', isCorrect: false },
      { id: 'c', text: '한국 시간에 맞춰 계속 생활', isCorrect: false },
    ],
    explanation: '도착 즉시 현지 시간에 맞춰 식사하고 활동하면 시차 적응이 빨라요. 낮잠은 최대 20분만 권장합니다.',
    difficulty: 1,
    points: 10,
    tags: ['travel', '시차', '건강'],
  },
  {
    id: 'travel-quiz-003',
    type: 'knowledge',
    category: 'travel',
    question: '기내 수하물로 반입 불가능한 것은?',
    options: [
      { id: 'a', text: '100ml 이하 화장품', isCorrect: false },
      { id: 'b', text: '보조배터리', isCorrect: false },
      { id: 'c', text: '150ml 선크림', isCorrect: true },
    ],
    explanation: '액체류는 100ml 이하 용기에 담아야 기내 반입 가능해요. 150ml 용기는 내용물이 적어도 불가능합니다!',
    difficulty: 2,
    points: 15,
    tags: ['travel', '기내수하물', '보안검색'],
  },
  {
    id: 'travel-quiz-004',
    type: 'knowledge',
    category: 'travel',
    question: '해외에서 분실한 여권 재발급은 어디서 하나요?',
    options: [
      { id: 'a', text: '현지 경찰서', isCorrect: false },
      { id: 'b', text: '한국 대사관/영사관', isCorrect: true },
      { id: 'c', text: '현지 출입국관리소', isCorrect: false },
    ],
    explanation: '여권 분실 시 즉시 현지 한국 대사관 또는 영사관에 신고하고 여행증명서나 단수여권을 발급받아야 합니다.',
    difficulty: 2,
    points: 15,
    tags: ['travel', '여권', '비상상황'],
  },
  {
    id: 'travel-quiz-005',
    type: 'knowledge',
    category: 'travel',
    question: '비행기 탑승 전 체크인 마감 시간은 보통?',
    options: [
      { id: 'a', text: '출발 30분 전', isCorrect: false },
      { id: 'b', text: '출발 60분 전', isCorrect: true },
      { id: 'c', text: '출발 120분 전', isCorrect: false },
    ],
    explanation: '국제선은 출발 60~90분 전, 국내선은 30~40분 전까지 체크인을 완료해야 해요. 여유 있게 공항에 도착하세요!',
    difficulty: 1,
    points: 10,
    tags: ['travel', '비행기', '체크인'],
  },
  {
    id: 'travel-quiz-006',
    type: 'knowledge',
    category: 'travel',
    question: '로밍 요금 걱정 없이 해외에서 인터넷 쓰는 방법은?',
    options: [
      { id: 'a', text: '로밍 켜두고 쓴다', isCorrect: false },
      { id: 'b', text: 'eSIM 또는 현지 유심 구매', isCorrect: true },
      { id: 'c', text: '와이파이만 사용', isCorrect: false },
    ],
    explanation: 'eSIM이나 현지 유심을 사용하면 저렴하게 데이터를 쓸 수 있어요. 포켓 와이파이도 좋은 선택입니다.',
    difficulty: 1,
    points: 10,
    tags: ['travel', '인터넷', 'eSIM'],
  },
  {
    id: 'travel-quiz-007',
    type: 'knowledge',
    category: 'travel',
    question: '항공권 예약 시 가장 저렴한 시기는?',
    options: [
      { id: 'a', text: '출발 1주일 전', isCorrect: false },
      { id: 'b', text: '출발 2-3개월 전', isCorrect: true },
      { id: 'c', text: '출발 당일', isCorrect: false },
    ],
    explanation: '통계적으로 출발 2-3개월 전에 예약하면 가장 저렴해요. 성수기는 더 일찍 예약하는 게 좋습니다.',
    difficulty: 2,
    points: 15,
    tags: ['travel', '항공권', '예약팁'],
  },
  {
    id: 'travel-quiz-008',
    type: 'knowledge',
    category: 'travel',
    question: '해외여행자보험, 언제 가입해야 할까요?',
    options: [
      { id: 'a', text: '출발 당일', isCorrect: false },
      { id: 'b', text: '여행 출발 전날까지', isCorrect: true },
      { id: 'c', text: '현지 도착 후', isCorrect: false },
    ],
    explanation: '여행자보험은 출발 전에 가입해야 공항에서의 사고나 비행 중 문제도 보장받을 수 있어요.',
    difficulty: 1,
    points: 10,
    tags: ['travel', '보험', '준비사항'],
  },
  {
    id: 'travel-quiz-009',
    type: 'knowledge',
    category: 'travel',
    question: '기내 반입 가능한 보조배터리 용량은?',
    options: [
      { id: 'a', text: '100Wh 이하', isCorrect: true },
      { id: 'b', text: '200Wh 이하', isCorrect: false },
      { id: 'c', text: '제한 없음', isCorrect: false },
    ],
    explanation: '보조배터리는 100Wh(약 27,000mAh) 이하만 기내 반입 가능해요. 위탁 수하물로는 절대 불가!',
    difficulty: 2,
    points: 15,
    tags: ['travel', '보조배터리', '기내수하물'],
  },
  {
    id: 'travel-quiz-010',
    type: 'knowledge',
    category: 'travel',
    question: '환전은 언제 하는 게 가장 유리할까요?',
    options: [
      { id: 'a', text: '공항에서 출발 직전', isCorrect: false },
      { id: 'b', text: '현지 시내 환전소', isCorrect: true },
      { id: 'c', text: '호텔 프론트', isCorrect: false },
    ],
    explanation: '일반적으로 현지 시내 환전소가 가장 환율이 좋아요. 공항과 호텔은 수수료가 높습니다.',
    difficulty: 2,
    points: 15,
    tags: ['travel', '환전', '팁'],
  },
];

// ============================================================================
// 여행 VS 투표 5개
// ============================================================================

export const TRAVEL_VS_POLLS: Poll[] = [
  {
    id: 'travel-poll-001',
    type: 'vs',
    category: 'travel',
    question: '여행 스타일은?',
    options: [
      { id: 'a', text: '자유여행 (일정 직접 짜기)', emoji: '🗺️' },
      { id: 'b', text: '패키지여행 (편하게 따라가기)', emoji: '🚌' },
    ],
    tags: ['travel', '여행스타일', '일정'],
  },
  {
    id: 'travel-poll-002',
    type: 'vs',
    category: 'travel',
    question: '여행지 선호는?',
    options: [
      { id: 'a', text: '도시 여행 (쇼핑, 카페, 관광)', emoji: '🏙️' },
      { id: 'b', text: '자연 여행 (등산, 해변, 풍경)', emoji: '🏞️' },
    ],
    tags: ['travel', '여행지', '선호도'],
  },
  {
    id: 'travel-poll-003',
    type: 'vs',
    category: 'travel',
    question: '숙소 선택 기준은?',
    options: [
      { id: 'a', text: '저렴한 게스트하우스/호스텔', emoji: '🏠' },
      { id: 'b', text: '편한 호텔', emoji: '🏨' },
    ],
    tags: ['travel', '숙소', '예산'],
  },
  {
    id: 'travel-poll-004',
    type: 'vs',
    category: 'travel',
    question: '여행 음식은?',
    options: [
      { id: 'a', text: '현지 음식 도전', emoji: '🍜' },
      { id: 'b', text: '한식당 찾아가기', emoji: '🍚' },
    ],
    tags: ['travel', '음식', '현지체험'],
  },
  {
    id: 'travel-poll-005',
    type: 'vs',
    category: 'travel',
    question: '여행 기념품은?',
    options: [
      { id: 'a', text: '사진으로만 추억', emoji: '📸' },
      { id: 'b', text: '기념품 꼭 구매', emoji: '🎁' },
    ],
    tags: ['travel', '기념품', '쇼핑'],
  },
];
