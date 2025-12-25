// ============================================================================
// 커뮤니티 샘플 데이터
// 실제 운영 시 Supabase 등 DB로 대체
// ============================================================================

import { Tip, Question, Answer, Poll, Quiz, Debate } from './types';

// ============================================================================
// 팁 베스트 (Featured Tips)
// ============================================================================

export const SAMPLE_TIPS: Tip[] = [
  // === 고양이 팁 ===
  {
    id: 'tip-cat-001',
    category: 'cat',
    title: '새 고양이가 숨어만 있을 때 꿀팁',
    content: '처음 며칠은 강제로 꺼내지 마세요! 숨을 공간(캣타워 아래, 침대 밑)을 충분히 주고, 하루 2-3번 가까이에서 조용히 책 읽기나 폰하기. 냄새에 익숙해지면 먼저 나와요. 간식은 던지지 말고 손 위에 올려두고 기다리기!',
    tags: ['입양초기', '적응', '사회화'],
    author: {
      type: 'user',
      name: '냥이집사3년차',
      badge: '🐱 러시안블루형',
    },
    relatedResult: {
      testType: 'catBreed',
      resultName: '러시안블루',
    },
    reactions: { helpful: 234, saved: 89 },
    createdAt: '2024-12-10T09:00:00Z',
    featured: true,
  },
  {
    id: 'tip-cat-002',
    category: 'cat',
    title: '장모종 털 관리 필수템',
    content: '슬리커 브러시 + 쇠빗(콤) 조합이 최고! 매일 5분씩 빗질해주면 털뭉침 예방됨. 엉킨 털은 억지로 빼지 말고 가위로 잘라내기. 여름엔 미용 고려해보세요 (라이온컷 추천)',
    tags: ['털관리', '장모종', '그루밍'],
    author: {
      type: 'expert',
      name: '펫미용사 민지',
      badge: '✂️ 전문 미용사',
    },
    reactions: { helpful: 567, saved: 203 },
    createdAt: '2024-12-08T14:30:00Z',
    featured: true,
  },

  // === 강아지 팁 ===
  {
    id: 'tip-dog-001',
    category: 'dog',
    title: '분리불안 해결 3단계 훈련법',
    content: '1단계: 외출 신호(열쇠 소리 등) 탈감작 → 열쇠 들고 소파 앉기 반복\n2단계: 짧은 외출 연습 → 30초부터 시작, 점진적 증가\n3단계: 혼자 있는 시간에 콩(Kong) 등 놀이 제공\n※ 돌아왔을 때 과하게 반기지 않기!',
    tags: ['분리불안', '훈련', '행동교정'],
    author: {
      type: 'expert',
      name: '반려견 훈련사 김쌤',
      badge: '🎓 KKF 인증 훈련사',
    },
    reactions: { helpful: 892, saved: 456 },
    createdAt: '2024-12-05T10:00:00Z',
    featured: true,
  },
  {
    id: 'tip-dog-002',
    category: 'dog',
    title: '여름철 산책 시간대 & 발바닥 화상 예방',
    content: '손등으로 바닥 5초 이상 못 대면 강아지도 못 걸어요! 여름 산책은 아침 6-8시 또는 저녁 8시 이후로. 핫스팟(아스팔트) 피해서 잔디나 흙길로 다니기. 발바닥 왁스(Musher\'s Secret) 바르면 보호됨.',
    tags: ['산책', '여름', '안전'],
    author: {
      type: 'user',
      name: '말티즈아빠',
      badge: '🐕 시바이누형',
    },
    reactions: { helpful: 445, saved: 178 },
    createdAt: '2024-12-01T16:00:00Z',
    featured: true,
  },

  // === 소동물 팁 ===
  {
    id: 'tip-hamster-001',
    category: 'hamster',
    title: '햄스터 쳇바퀴 소음 없애는 법',
    content: '저소음 쳇바퀴 추천: 사일런트러너, 까로젤\n기존 쳇바퀴 소음 줄이기: 축에 바셀린 or 식용유 살짝 바르기\n쇠 쳇바퀴보다 플라스틱이 조용함. 직경은 골든 21cm, 드워프 16cm 이상!',
    tags: ['쳇바퀴', '소음', '용품추천'],
    author: {
      type: 'user',
      name: '햄찌덕후',
      badge: '🐹 골든햄스터형',
    },
    reactions: { helpful: 334, saved: 122 },
    createdAt: '2024-11-28T11:00:00Z',
    featured: true,
  },

  // === 관상어 팁 ===
  {
    id: 'tip-fish-001',
    category: 'fish',
    title: '베타 지느러미 찢어졌을 때 응급처치',
    content: '일단 당황 금지! 베타 지느러미는 재생됩니다.\n1. 수질 체크 (암모니아, 아질산 0 확인)\n2. 수온 26-28도 유지\n3. 물 30% 환수 후 소금욕 (1L당 소금 1g)\n4. 심하면 메틸렌블루 희석액\n※ 뾰족한 장식 제거하기!',
    tags: ['베타', '응급처치', '질병'],
    author: {
      type: 'expert',
      name: '아쿠아리스트 준',
      badge: '🐟 수조관리 전문',
    },
    reactions: { helpful: 278, saved: 145 },
    createdAt: '2024-11-25T09:30:00Z',
    featured: true,
  },

  // === 식물 팁 ===
  {
    id: 'tip-plant-001',
    category: 'plant',
    title: '물 줘야 할 타이밍 100% 알 수 있는 방법',
    content: '흙 표면만 보지 마세요! 나무젓가락을 흙에 5cm 꽂아두고 빼보기. 젓가락이 마르면 물 줄 때!\n또는 화분 들어보기 - 가벼워지면 물 필요. 무게 차이가 확실함.\n대부분 과습으로 죽으니 "의심되면 하루 더 기다리기"',
    tags: ['물주기', '초보', '관리법'],
    author: {
      type: 'user',
      name: '식물킬러탈출',
      badge: '🌿 몬스테라형',
    },
    reactions: { helpful: 723, saved: 412 },
    createdAt: '2024-11-20T14:00:00Z',
    featured: true,
  },
];

// ============================================================================
// Q&A 샘플
// ============================================================================

export const SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'q-001',
    category: 'cat',
    title: '러시안블루 입양 예정인데 첫 만남 때 주의사항 있나요?',
    content: '이번 주말에 러시안블루 아기 고양이를 데려올 예정입니다. 캐터리에서 데려오는 건데, 첫 만남 때 어떻게 하면 고양이가 덜 무서워할까요? 이동장도 처음 사용하는 거라 걱정이에요.',
    tags: ['러시안블루', '입양', '첫만남'],
    author: {
      id: 'user-123',
      nickname: '예비집사',
      resultBadge: '🐱 러시안블루형',
    },
    status: 'answered',
    answerCount: 3,
    viewCount: 456,
    createdAt: '2024-12-14T10:30:00Z',
    relatedTest: 'catBreed',
  },
  {
    id: 'q-002',
    category: 'dog',
    title: '시바이누가 자꾸 으르렁거려요 ㅠㅠ',
    content: '1살 된 시바이누인데, 제가 소파에 먼저 앉아있으면 옆에 와서 앉다가 갑자기 으르렁거립니다. 간식 줄 때도 손을 물려고 해요. 이거 공격성인가요? 어떻게 해야 할까요?',
    tags: ['시바이누', '공격성', '행동문제'],
    author: {
      id: 'user-456',
      nickname: '시바아빠',
      resultBadge: '🐕 시바이누형',
    },
    status: 'answered',
    answerCount: 5,
    viewCount: 892,
    createdAt: '2024-12-13T16:45:00Z',
    relatedTest: 'dogBreed',
  },
  {
    id: 'q-003',
    category: 'hamster',
    title: '햄스터 볼 안 채우는데 아픈 건가요?',
    content: '원래 볼주머니에 먹이 엄청 채우던 애가 요즘 볼에 안 넣고 그냥 먹어요. 이빨은 괜찮아 보이는데... 아픈 걸까요?',
    tags: ['햄스터', '건강', '볼주머니'],
    author: {
      id: 'user-789',
      nickname: '햄찌맘',
    },
    status: 'open',
    answerCount: 1,
    viewCount: 234,
    createdAt: '2024-12-14T08:00:00Z',
    relatedTest: 'smallPet',
  },
];

export const SAMPLE_ANSWERS: Answer[] = [
  {
    id: 'a-001-1',
    questionId: 'q-001',
    content: '러시안블루는 낯가림이 심한 편이라 첫 만남 때 조용히 해주세요!\n\n1. 이동장에 캐터리 냄새 나는 담요 깔아가기\n2. 차에서 말 안 걸고 조용히 이동\n3. 집 도착하면 이동장 문 열어두고 강제로 안 꺼내기\n4. 첫 며칠은 한 방에서만 적응시키기\n\n화이팅하세요! 러시안블루 정말 예쁜 아이들이에요 💙',
    author: {
      id: 'user-expert-1',
      nickname: '러블 3년차 집사',
      resultBadge: '🐱 러시안블루형',
    },
    reactions: { helpful: 45 },
    isAccepted: true,
    createdAt: '2024-12-14T11:00:00Z',
  },
  {
    id: 'a-002-1',
    questionId: 'q-002',
    content: '시바이누 특성상 자원 지키기(resource guarding) 행동일 수 있어요. 당장은:\n\n1. 으르렁할 때 "안돼" 하지 말고 그냥 자리 피하기\n2. 간식은 바닥에 떨어뜨려 주기\n3. 소파는 당분간 못 올라오게 하기\n\n근본적으론 전문 훈련사 상담 추천드려요. 시바는 자존심이 세서 일반적인 훈련법이 안 통할 수 있어요.',
    author: {
      id: 'user-expert-2',
      nickname: '반려견 훈련사 김쌤',
      isExpert: true,
      resultBadge: '🎓 훈련전문가',
    },
    reactions: { helpful: 78 },
    isAccepted: true,
    createdAt: '2024-12-13T18:00:00Z',
  },
];

// ============================================================================
// 투표 샘플
// ============================================================================

export const SAMPLE_POLLS: Poll[] = [
  {
    id: 'poll-001',
    category: 'cat',
    question: '고양이가 가장 귀여울 때는?',
    options: [
      { id: 'opt-1', text: '골골송 부를 때', emoji: '😻', votes: 1234 },
      { id: 'opt-2', text: '냥펀치 할 때', emoji: '🐱', votes: 892 },
      { id: 'opt-3', text: '꾹꾹이 할 때', emoji: '🐾', votes: 2045 },
      { id: 'opt-4', text: '박스에 들어갈 때', emoji: '📦', votes: 567 },
    ],
    totalVotes: 4738,
    createdAt: '2024-12-10T00:00:00Z',
  },
  {
    id: 'poll-002',
    category: 'dog',
    question: '강아지 산책 vs 강아지 목욕',
    options: [
      { id: 'opt-1', text: '산책이 더 힘들어', emoji: '🚶', votes: 1567 },
      { id: 'opt-2', text: '목욕이 더 힘들어', emoji: '🛁', votes: 2890 },
    ],
    totalVotes: 4457,
    createdAt: '2024-12-12T00:00:00Z',
  },
  {
    id: 'poll-003',
    category: 'personality',
    question: '테스트 결과 공유할 때 어디에?',
    options: [
      { id: 'opt-1', text: '인스타 스토리', emoji: '📸', votes: 3456 },
      { id: 'opt-2', text: '카카오톡', emoji: '💬', votes: 4567 },
      { id: 'opt-3', text: '트위터/X', emoji: '🐦', votes: 890 },
      { id: 'opt-4', text: '안 함 (혼자 봄)', emoji: '🤫', votes: 1234 },
    ],
    totalVotes: 10147,
    createdAt: '2024-12-14T00:00:00Z',
  },
];

// ============================================================================
// 퀴즈 샘플
// ============================================================================

export const SAMPLE_QUIZZES: Quiz[] = [
  {
    id: 'quiz-001',
    category: 'cat',
    question: '고양이가 "야옹" 하고 우는 건 원래 누구랑 소통하기 위한 걸까요?',
    options: [
      { id: 'a', text: '다른 고양이' },
      { id: 'b', text: '인간' },
      { id: 'c', text: '먹이(쥐, 새)' },
      { id: 'd', text: '자기 자신' },
    ],
    correctAnswer: 'b',
    explanation: '성묘끼리는 거의 울지 않아요! "야옹"은 고양이가 인간과 소통하기 위해 발달시킨 소리입니다. 새끼 고양이가 엄마에게 우는 습관이 인간 집사에게로 이어진 거죠.',
    difficulty: 'medium',
    tags: ['고양이', '행동', '소통'],
    stats: { totalAttempts: 5678, correctRate: 42 },
  },
  {
    id: 'quiz-002',
    category: 'dog',
    question: '강아지가 하품을 하는 이유로 가장 맞는 것은?',
    options: [
      { id: 'a', text: '졸려서' },
      { id: 'b', text: '스트레스를 받아서' },
      { id: 'c', text: '배가 고파서' },
      { id: 'd', text: '주인을 따라해서' },
    ],
    correctAnswer: 'b',
    explanation: '강아지의 하품은 "칼밍 시그널"이에요. 긴장하거나 스트레스 받을 때 스스로 진정하려고 하품합니다. 물론 정말 졸려서 하품할 때도 있어요!',
    difficulty: 'easy',
    tags: ['강아지', '행동', '칼밍시그널'],
    stats: { totalAttempts: 8901, correctRate: 35 },
  },
  {
    id: 'quiz-003',
    category: 'fish',
    question: '금붕어의 기억력은 얼마나 될까요?',
    options: [
      { id: 'a', text: '3초' },
      { id: 'b', text: '3분' },
      { id: 'c', text: '몇 개월' },
      { id: 'd', text: '기억력이 없음' },
    ],
    correctAnswer: 'c',
    explanation: '"금붕어 기억력 3초"는 완전 오해예요! 실제로 금붕어는 몇 개월 동안 학습한 내용을 기억할 수 있습니다. 먹이 주는 사람도 알아봐요!',
    difficulty: 'hard',
    tags: ['금붕어', '상식', '미신깨기'],
    stats: { totalAttempts: 4567, correctRate: 28 },
  },
];

// ============================================================================
// 밸런스 게임/토론 샘플
// ============================================================================

export const SAMPLE_DEBATES: Debate[] = [
  {
    id: 'debate-001',
    category: 'cat',
    title: '고양이 vs 강아지',
    optionA: {
      text: '고양이가 최고다',
      emoji: '🐱',
      votes: 12345,
      topComment: '도도한 매력, 독립성, 털 날림 적음',
    },
    optionB: {
      text: '강아지가 최고다',
      emoji: '🐕',
      votes: 11234,
      topComment: '무한 애정, 같이 산책, 활발한 교감',
    },
    totalVotes: 23579,
    status: 'active',
  },
  {
    id: 'debate-002',
    category: 'general',
    title: '반려동물 양육 필수 조건',
    optionA: {
      text: '시간이 더 중요',
      emoji: '⏰',
      votes: 8901,
      topComment: '돈은 벌면 되지만 시간은 만들기 어려움',
    },
    optionB: {
      text: '돈이 더 중요',
      emoji: '💰',
      votes: 6789,
      topComment: '의료비, 사료값 감당 못하면 반려동물이 고생',
    },
    totalVotes: 15690,
    status: 'active',
  },
];
