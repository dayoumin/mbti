// ============================================================================
// Choice 투표 (다중 선택지)
// ============================================================================

import type { ChoicePoll } from '../types';

// 공통 timeSensitivity 설정 (일반 라이프스타일/의견 = none)
const DEFAULT_TIME_SENSITIVITY = {
  timeSensitivity: {
    sensitivity: 'none' as const,
    sourceYear: 2025,
  },
};

export const CHOICE_POLLS: ChoicePoll[] = [
  {
    id: 'choice-life-001',
    category: 'lifestyle',
    question: '여건이 된다면 낳고 싶은 자녀 수는?',
    options: [
      { id: 'a', text: '0명 (딩크/비혼)', emoji: '🙅' },
      { id: 'b', text: '1명', emoji: '👶' },
      { id: 'c', text: '2명', emoji: '👶👶' },
      { id: 'd', text: '3명', emoji: '👨‍👩‍👧' },
      { id: 'e', text: '4명 이상', emoji: '👨‍👩‍👧‍👦' },
    ],
    tags: ['라이프스타일', '가족', '자녀'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },

  // ============================================================================
  // 운세 관심도 투표 (Fortune Interest Polls)
  // ============================================================================
  {
    id: 'choice-fortune-001',
    category: 'fortune',
    question: '가장 궁금한 운세는?',
    options: [
      { id: 'a', text: '오늘의 별자리 운세', emoji: '⭐' },
      { id: 'b', text: '올해 띠별 운세', emoji: '🐍' },
      { id: 'c', text: '타로 카드 한 장 뽑기', emoji: '🃏' },
      { id: 'd', text: '별자리 궁합 보기', emoji: '💕' },
      { id: 'e', text: '운세 안 봄', emoji: '🙅' },
    ],
    tags: ['운세', '별자리', '타로', '띠'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-fortune-002',
    category: 'fortune',
    question: '운세를 주로 언제 봐?',
    options: [
      { id: 'a', text: '아침에 하루 시작 전', emoji: '🌅' },
      { id: 'b', text: '심심할 때 랜덤으로', emoji: '😴' },
      { id: 'c', text: '중요한 결정 앞에서', emoji: '🤔' },
      { id: 'd', text: '새해/생일 같은 특별한 날', emoji: '🎉' },
      { id: 'e', text: '거의 안 봄', emoji: '🙅' },
    ],
    tags: ['운세', '습관', '라이프스타일'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-fortune-003',
    category: 'fortune',
    question: '운세 결과 나오면 어떻게 해?',
    options: [
      { id: 'a', text: '좋은 건 믿고, 나쁜 건 무시', emoji: '😎' },
      { id: 'b', text: '재미로 보고 바로 까먹음', emoji: '😂' },
      { id: 'c', text: '스크샷 찍어서 친구한테 공유', emoji: '📱' },
      { id: 'd', text: '은근히 신경 쓰임', emoji: '😰' },
      { id: 'e', text: '진지하게 참고함', emoji: '🧐' },
    ],
    tags: ['운세', '심리', '재미'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-fortune-004',
    category: 'fortune',
    question: '별자리 vs 띠, 뭐가 더 맞는 것 같아?',
    options: [
      { id: 'a', text: '별자리가 더 맞음', emoji: '⭐' },
      { id: 'b', text: '띠가 더 맞음', emoji: '🐲' },
      { id: 'c', text: '둘 다 맞음', emoji: '🎯' },
      { id: 'd', text: '둘 다 안 맞음', emoji: '❌' },
      { id: 'e', text: '혈액형이 더 맞음', emoji: '🩸' },
    ],
    tags: ['운세', '별자리', '띠', '혈액형'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-fortune-005',
    category: 'fortune',
    question: '타로 카드 뽑을 때 제일 궁금한 건?',
    options: [
      { id: 'a', text: '연애/썸 운세', emoji: '💕' },
      { id: 'b', text: '재물/돈 운세', emoji: '💰' },
      { id: 'c', text: '취업/이직 운세', emoji: '💼' },
      { id: 'd', text: '오늘 하루 전체 운세', emoji: '🌞' },
      { id: 'e', text: '타로 안 봄', emoji: '🙅' },
    ],
    tags: ['타로', '운세', '연애', '재물'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },

  // ============================================================================
  // 라이프스타일 투표 (Lifestyle Polls)
  // ============================================================================
  {
    id: 'choice-life-002',
    category: 'lifestyle',
    question: '주말에 제일 하고 싶은 건?',
    options: [
      { id: 'a', text: '집에서 푹 쉬기', emoji: '🛋️' },
      { id: 'b', text: '친구들이랑 놀기', emoji: '🎉' },
      { id: 'c', text: '카페에서 여유 즐기기', emoji: '☕' },
      { id: 'd', text: '운동/액티비티', emoji: '🏃' },
      { id: 'e', text: '취미/자기계발', emoji: '📚' },
    ],
    tags: ['라이프스타일', '주말', '휴식'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-life-003',
    category: 'lifestyle',
    question: '휴가 스타일은 어떤 게 좋아?',
    options: [
      { id: 'a', text: '바다에서 힐링', emoji: '🏖️' },
      { id: 'b', text: '도시 여행/쇼핑', emoji: '🏙️' },
      { id: 'c', text: '산/자연 탐방', emoji: '⛰️' },
      { id: 'd', text: '맛집 투어', emoji: '🍽️' },
      { id: 'e', text: '집에서 쉬는 게 최고', emoji: '🏠' },
    ],
    tags: ['라이프스타일', '여행', '휴가'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-life-004',
    category: 'lifestyle',
    question: '요즘 제일 꽂혀 있는 취미는?',
    options: [
      { id: 'a', text: '운동/피트니스', emoji: '💪' },
      { id: 'b', text: '요리/베이킹', emoji: '🍳' },
      { id: 'c', text: 'OTT/영화 보기', emoji: '📺' },
      { id: 'd', text: '게임', emoji: '🎮' },
      { id: 'e', text: '독서/공부', emoji: '📖' },
    ],
    tags: ['라이프스타일', '취미', '여가'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },

  // ============================================================================
  // 연애 투표 (Love Polls)
  // ============================================================================
  {
    id: 'choice-love-001',
    category: 'love',
    question: '썸 탈 때 제일 중요한 건?',
    options: [
      { id: 'a', text: '외모/첫인상', emoji: '😍' },
      { id: 'b', text: '대화/유머 코드', emoji: '💬' },
      { id: 'c', text: '성격/가치관', emoji: '💝' },
      { id: 'd', text: '취미/관심사', emoji: '🎨' },
      { id: 'e', text: '직업/경제력', emoji: '💼' },
    ],
    tags: ['연애', '썸', '이상형'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-love-002',
    category: 'love',
    question: '데이트 중 제일 좋은 순간은?',
    options: [
      { id: 'a', text: '맛있는 거 같이 먹을 때', emoji: '🍽️' },
      { id: 'b', text: '깊은 대화 나눌 때', emoji: '💭' },
      { id: 'c', text: '손잡고 걸을 때', emoji: '👫' },
      { id: 'd', text: '새로운 곳 탐험할 때', emoji: '🗺️' },
      { id: 'e', text: '집에서 편하게 있을 때', emoji: '🏠' },
    ],
    tags: ['연애', '데이트', '로맨스'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-love-003',
    category: 'love',
    question: '연애할 때 내 스타일은?',
    options: [
      { id: 'a', text: '매일 연락하는 스타일', emoji: '📱' },
      { id: 'b', text: '적당히 텀 두는 스타일', emoji: '⏰' },
      { id: 'c', text: '붙어 있는 거 좋아하는 스타일', emoji: '💕' },
      { id: 'd', text: '각자 시간 중요한 스타일', emoji: '🎯' },
      { id: 'e', text: '상황마다 다름', emoji: '🤷' },
    ],
    tags: ['연애', '스타일', '성향'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },

  // ============================================================================
  // 고양이 투표 (Cat Polls)
  // ============================================================================
  {
    id: 'choice-cat-001',
    category: 'cat',
    question: '고양이 키우면 제일 하고 싶은 건?',
    options: [
      { id: 'a', text: '매일 사진 찍기', emoji: '📸' },
      { id: 'b', text: '같이 놀아주기', emoji: '🧶' },
      { id: 'c', text: '안아서 쿨쿨 자기', emoji: '😴' },
      { id: 'd', text: '츄르 먹이기', emoji: '🍖' },
      { id: 'e', text: '멍 때리며 바라보기', emoji: '👀' },
    ],
    tags: ['고양이', '반려묘', '일상'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-cat-002',
    category: 'cat',
    question: '고양이 품종 중 제일 키우고 싶은 건?',
    options: [
      { id: 'a', text: '코숏/코리안숏헤어', emoji: '🐱' },
      { id: 'b', text: '러시안블루', emoji: '💙' },
      { id: 'c', text: '브리티시숏헤어', emoji: '😺' },
      { id: 'd', text: '스핑크스', emoji: '👽' },
      { id: 'e', text: '길고양이 입양', emoji: '❤️' },
    ],
    tags: ['고양이', '품종', '반려묘'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },

  // ============================================================================
  // 강아지 투표 (Dog Polls)
  // ============================================================================
  {
    id: 'choice-dog-001',
    category: 'dog',
    question: '강아지랑 제일 하고 싶은 활동은?',
    options: [
      { id: 'a', text: '산책/공원 뛰어놀기', emoji: '🏃' },
      { id: 'b', text: '카페 같이 가기', emoji: '☕' },
      { id: 'c', text: '애견 수영장', emoji: '🏊' },
      { id: 'd', text: '집에서 놀아주기', emoji: '🏠' },
      { id: 'e', text: '같이 낮잠 자기', emoji: '😴' },
    ],
    tags: ['강아지', '반려견', '활동'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-dog-002',
    category: 'dog',
    question: '강아지 크기 어떤 게 좋아?',
    options: [
      { id: 'a', text: '소형견 (5kg 이하)', emoji: '🐕' },
      { id: 'b', text: '중소형견 (5-10kg)', emoji: '🐶' },
      { id: 'c', text: '중형견 (10-20kg)', emoji: '🦮' },
      { id: 'd', text: '대형견 (20kg 이상)', emoji: '🐕‍🦺' },
      { id: 'e', text: '크기 상관없음', emoji: '❤️' },
    ],
    tags: ['강아지', '크기', '품종'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },

  // ============================================================================
  // 음식/카페 투표 (Food Polls)
  // ============================================================================
  {
    id: 'choice-food-001',
    category: 'food',
    question: '야식으로 제일 땡기는 건?',
    options: [
      { id: 'a', text: '치킨', emoji: '🍗' },
      { id: 'b', text: '피자', emoji: '🍕' },
      { id: 'c', text: '족발/보쌈', emoji: '🥓' },
      { id: 'd', text: '라면', emoji: '🍜' },
      { id: 'e', text: '야식 안 먹음', emoji: '🙅' },
    ],
    tags: ['음식', '야식', '배달'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-food-002',
    category: 'food',
    question: '카페에서 주로 뭐 마셔?',
    options: [
      { id: 'a', text: '아메리카노', emoji: '☕' },
      { id: 'b', text: '라떼/카푸치노', emoji: '🥛' },
      { id: 'c', text: '프라푸치노/음료', emoji: '🥤' },
      { id: 'd', text: '차/논카페인', emoji: '🍵' },
      { id: 'e', text: '시즌 메뉴', emoji: '🎄' },
    ],
    tags: ['카페', '음료', '커피'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },

  // ============================================================================
  // 성격/MBTI 투표 (Personality Polls)
  // ============================================================================
  {
    id: 'choice-personality-001',
    category: 'personality',
    question: '친구들이 말하는 내 성격은?',
    options: [
      { id: 'a', text: '긍정적이고 밝음', emoji: '😄' },
      { id: 'b', text: '차분하고 조용함', emoji: '😌' },
      { id: 'c', text: '유머러스하고 재밌음', emoji: '🤣' },
      { id: 'd', text: '똑부러지고 계획적', emoji: '📝' },
      { id: 'e', text: '엉뚱하고 4차원', emoji: '🌀' },
    ],
    tags: ['성격', 'MBTI', '자기분석'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'choice-personality-002',
    category: 'personality',
    question: '스트레스 받을 때 나는?',
    options: [
      { id: 'a', text: '친구한테 하소연', emoji: '😭' },
      { id: 'b', text: '혼자 조용히 해소', emoji: '🧘' },
      { id: 'c', text: '운동으로 풀기', emoji: '💪' },
      { id: 'd', text: '먹방/잠으로 해결', emoji: '😴' },
      { id: 'e', text: '쇼핑/취미 활동', emoji: '🛍️' },
    ],
    tags: ['성격', '스트레스', '대처방식'],
    meta: { minAge: '20s', ...DEFAULT_TIME_SENSITIVITY },
  },
];

export default CHOICE_POLLS;