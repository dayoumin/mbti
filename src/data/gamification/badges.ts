// ============================================================================
// 배지 정의
// ============================================================================

import type { Badge } from './types';

export const BADGES: Badge[] = [
  // ==========================================================================
  // 테스트 배지
  // ==========================================================================
  {
    id: 'first-test',
    name: '첫 발자국',
    description: '첫 번째 테스트 완료',
    emoji: '👣',
    category: 'test',
    rarity: 'common',
    condition: { type: 'first', description: '아무 테스트나 1개 완료' },
    points: 10,
  },
  {
    id: 'test-explorer',
    name: '탐험가',
    description: '5개 이상의 테스트 완료',
    emoji: '🧭',
    category: 'test',
    rarity: 'common',
    condition: { type: 'count', value: 5, description: '테스트 5개 완료' },
    points: 50,
  },
  {
    id: 'test-master',
    name: '테스트 마스터',
    description: '10개 이상의 테스트 완료',
    emoji: '🎓',
    category: 'test',
    rarity: 'rare',
    condition: { type: 'count', value: 10, description: '테스트 10개 완료' },
    points: 100,
  },
  {
    id: 'all-rounder',
    name: '올라운더',
    description: '모든 메인 테스트 완료',
    emoji: '🌟',
    category: 'test',
    rarity: 'epic',
    condition: { type: 'special', description: '모든 메인 테스트 완료' },
    points: 200,
  },

  // ==========================================================================
  // 퀴즈 배지
  // ==========================================================================
  {
    id: 'quiz-rookie',
    name: '퀴즈 루키',
    description: '첫 퀴즈 정답',
    emoji: '🧠',
    category: 'quiz',
    rarity: 'common',
    condition: { type: 'first', description: '퀴즈 1개 정답' },
    points: 10,
  },
  {
    id: 'quiz-streak-3',
    name: '연속 정답',
    description: '3문제 연속 정답',
    emoji: '🔥',
    category: 'quiz',
    rarity: 'common',
    condition: { type: 'streak', value: 3, description: '3문제 연속 정답' },
    points: 30,
  },
  {
    id: 'quiz-master',
    name: '퀴즈 마스터',
    description: '50문제 이상 정답',
    emoji: '🏆',
    category: 'quiz',
    rarity: 'rare',
    condition: { type: 'count', value: 50, description: '50문제 정답' },
    points: 100,
  },
  {
    id: 'cat-expert',
    name: '고양이 박사',
    description: '고양이 퀴즈 10개 정답',
    emoji: '🐱',
    category: 'quiz',
    rarity: 'rare',
    condition: { type: 'count', target: 'cat', value: 10, description: '고양이 퀴즈 10개 정답' },
    points: 50,
  },
  {
    id: 'dog-expert',
    name: '강아지 박사',
    description: '강아지 퀴즈 10개 정답',
    emoji: '🐕',
    category: 'quiz',
    rarity: 'rare',
    condition: { type: 'count', target: 'dog', value: 10, description: '강아지 퀴즈 10개 정답' },
    points: 50,
  },

  // ==========================================================================
  // 투표 배지
  // ==========================================================================
  {
    id: 'first-vote',
    name: '첫 투표',
    description: '첫 번째 투표 참여',
    emoji: '🗳️',
    category: 'poll',
    rarity: 'common',
    condition: { type: 'first', description: '투표 1개 참여' },
    points: 10,
  },
  {
    id: 'poll-enthusiast',
    name: '투표 애호가',
    description: '10개 이상 투표 참여',
    emoji: '📊',
    category: 'poll',
    rarity: 'common',
    condition: { type: 'count', value: 10, description: '투표 10개 참여' },
    points: 50,
  },

  // ==========================================================================
  // 스트릭 배지
  // ==========================================================================
  {
    id: 'streak-3',
    name: '3일 연속',
    description: '3일 연속 방문',
    emoji: '🔥',
    category: 'streak',
    rarity: 'common',
    condition: { type: 'streak', value: 3, description: '3일 연속 활동' },
    points: 30,
  },
  {
    id: 'streak-7',
    name: '일주일 연속',
    description: '7일 연속 방문',
    emoji: '💪',
    category: 'streak',
    rarity: 'rare',
    condition: { type: 'streak', value: 7, description: '7일 연속 활동' },
    points: 70,
  },
  {
    id: 'streak-30',
    name: '한 달 연속',
    description: '30일 연속 방문',
    emoji: '👑',
    category: 'streak',
    rarity: 'epic',
    condition: { type: 'streak', value: 30, description: '30일 연속 활동' },
    points: 300,
  },
  {
    id: 'streak-100',
    name: '100일 연속',
    description: '100일 연속 방문',
    emoji: '🏅',
    category: 'streak',
    rarity: 'legendary',
    condition: { type: 'streak', value: 100, description: '100일 연속 활동' },
    points: 1000,
  },

  // ==========================================================================
  // 소셜 배지
  // ==========================================================================
  {
    id: 'first-share',
    name: '공유왕',
    description: '첫 결과 공유',
    emoji: '📤',
    category: 'social',
    rarity: 'common',
    condition: { type: 'first', description: '결과 카드 첫 공유' },
    points: 20,
  },

  // ==========================================================================
  // 특별 배지
  // ==========================================================================
  {
    id: 'early-adopter',
    name: '얼리 어답터',
    description: '서비스 초기 가입자',
    emoji: '🌱',
    category: 'special',
    rarity: 'legendary',
    condition: { type: 'special', description: '2025년 가입자' },
    points: 100,
  },
];

// 배지 조회 함수
export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}

export function getBadgesByCategory(category: Badge['category']): Badge[] {
  return BADGES.filter(b => b.category === category);
}

export function getBadgesByRarity(rarity: Badge['rarity']): Badge[] {
  return BADGES.filter(b => b.rarity === rarity);
}
