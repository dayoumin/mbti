// ============================================================================
// 키즈용 VS 투표 (ageRating: 'kids')
// 10세 미만 사용자에게 30% 추천 부스트
// ============================================================================

import type { VSPoll } from '../types';

// 공통 timeSensitivity 설정 (동물/상상력/취향 = none)
const DEFAULT_TIME_SENSITIVITY = {
  timeSensitivity: {
    sensitivity: 'none' as const,
    sourceYear: 2025,
  },
};

export const KIDS_VS_POLLS: VSPoll[] = [
  // ==========================================================================
  // 동물 취향 투표
  // ==========================================================================
  {
    id: 'kids-vs-001',
    category: 'personality',
    question: '어떤 동물 친구가 더 좋아?',
    optionA: { id: 'a', text: '멍멍! 강아지', emoji: '🐶' },
    optionB: { id: 'b', text: '야옹~ 고양이', emoji: '🐱' },
    tags: ['동물', '강아지', '고양이', '취향'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-002',
    category: 'rabbit',
    question: '토끼 vs 햄스터, 누가 더 귀여워?',
    optionA: { id: 'a', text: '깡충깡충 토끼', emoji: '🐰' },
    optionB: { id: 'b', text: '볼빵빵 햄스터', emoji: '🐹' },
    tags: ['동물', '토끼', '햄스터', '귀여움'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-003',
    category: 'cat',
    question: '고양이 발바닥, 어떤 색이 더 좋아?',
    optionA: { id: 'a', text: '분홍분홍 핑크', emoji: '🩷' },
    optionB: { id: 'b', text: '까만 검정색', emoji: '🖤' },
    tags: ['고양이', '발바닥', '육구', '색깔'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-004',
    category: 'dog',
    question: '강아지랑 같이 하고 싶은 건?',
    optionA: { id: 'a', text: '공 던지기 놀이', emoji: '⚾' },
    optionB: { id: 'b', text: '산책하기', emoji: '🚶' },
    tags: ['강아지', '놀이', '산책', '활동'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },

  // ==========================================================================
  // 일상 취향 투표
  // ==========================================================================
  {
    id: 'kids-vs-005',
    category: 'lifestyle',
    question: '더 좋아하는 계절은?',
    optionA: { id: 'a', text: '눈 오는 겨울', emoji: '⛄' },
    optionB: { id: 'b', text: '바다 가는 여름', emoji: '🏖️' },
    tags: ['계절', '겨울', '여름', '취향'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-006',
    category: 'lifestyle',
    question: '아침에 일어나면?',
    optionA: { id: 'a', text: '바로 일어나는 아침형', emoji: '🌅' },
    optionB: { id: 'b', text: '조금 더 자는 저녁형', emoji: '🌙' },
    tags: ['생활패턴', '아침', '저녁', '습관'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-007',
    category: 'lifestyle',
    question: '놀 때 더 재밌는 건?',
    optionA: { id: 'a', text: '밖에서 뛰어놀기', emoji: '🏃' },
    optionB: { id: 'b', text: '집에서 게임하기', emoji: '🎮' },
    tags: ['놀이', '야외', '실내', '취향'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-008',
    category: 'lifestyle',
    question: '더 먹고 싶은 간식은?',
    optionA: { id: 'a', text: '달콤한 아이스크림', emoji: '🍦' },
    optionB: { id: 'b', text: '바삭바삭 과자', emoji: '🍪' },
    tags: ['간식', '음식', '아이스크림', '과자'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },

  // ==========================================================================
  // 상상력 자극 투표
  // ==========================================================================
  {
    id: 'kids-vs-009',
    category: 'personality',
    question: '마법이 있다면 뭘 하고 싶어?',
    optionA: { id: 'a', text: '하늘을 날기', emoji: '🦸' },
    optionB: { id: 'b', text: '동물과 대화하기', emoji: '🗣️🐾' },
    tags: ['상상력', '마법', '꿈', '소원'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-010',
    category: 'personality',
    question: '어떤 초능력이 갖고 싶어?',
    optionA: { id: 'a', text: '투명해지기', emoji: '👻' },
    optionB: { id: 'b', text: '순간이동하기', emoji: '✨' },
    tags: ['초능력', '상상력', '능력', '꿈'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },

  // ==========================================================================
  // 동물 특성 비교 투표
  // ==========================================================================
  {
    id: 'kids-vs-011',
    category: 'cat',
    question: '고양이 털, 뭐가 더 좋아?',
    optionA: { id: 'a', text: '복슬복슬 긴 털', emoji: '🦁' },
    optionB: { id: 'b', text: '보들보들 짧은 털', emoji: '🐱' },
    tags: ['고양이', '털', '품종', '취향'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
  {
    id: 'kids-vs-012',
    category: 'dog',
    question: '강아지 크기, 뭐가 더 좋아?',
    optionA: { id: 'a', text: '아기처럼 작은 강아지', emoji: '🐕' },
    optionB: { id: 'b', text: '곰처럼 큰 강아지', emoji: '🐕‍🦺' },
    tags: ['강아지', '크기', '품종', '취향'],
    meta: {
      ageRating: 'kids',
    ...DEFAULT_TIME_SENSITIVITY,
    },
  },
];
