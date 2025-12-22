/**
 * ContentActions 컴포넌트 관련 단위 테스트
 * - 테스트 타입 → 카테고리 매핑 로직
 * - 관련 콘텐츠 필터링 및 폴백 로직
 */

import { describe, it, expect } from 'vitest';

// 테스트용 퀴즈/투표 목 데이터
const MOCK_QUIZZES = [
  { id: 'q1', category: 'cat', question: '고양이 퀴즈 1' },
  { id: 'q2', category: 'cat', question: '고양이 퀴즈 2' },
  { id: 'q3', category: 'dog', question: '강아지 퀴즈 1' },
  { id: 'q4', category: 'rabbit', question: '토끼 퀴즈 1' },
  { id: 'q5', category: 'plant', question: '식물 퀴즈 1' },
];

const MOCK_POLLS = [
  { id: 'p1', category: 'cat', question: '고양이 투표 1' },
  { id: 'p2', category: 'dog', question: '강아지 투표 1' },
  { id: 'p3', category: 'rabbit', question: '토끼 투표 1' },
];

// 컴포넌트에서 추출한 매핑 로직
const TEST_TO_CATEGORY: Record<string, string> = {
  cat: 'cat',
  dog: 'dog',
  rabbit: 'rabbit',
  hamster: 'hamster',
  plant: 'plant',
  coffee: 'coffee',
  idealType: 'love',
  conflictStyle: 'relationship',
  petMatch: 'general',
  human: 'personality',
};

// 관련 콘텐츠 찾기 로직
function getRelatedContent<T extends { category: string }>(
  items: T[],
  targetCategory: string,
  maxItems: number = 2
) {
  const filtered = items.filter(item => item.category === targetCategory);

  // 카테고리에 콘텐츠가 없으면 전체에서 가져오기 (폴백)
  if (filtered.length === 0) {
    return {
      items: items.slice(0, maxItems),
      count: items.length,
      isFallback: true,
    };
  }

  return {
    items: filtered.slice(0, maxItems),
    count: filtered.length,
    isFallback: false,
  };
}

describe('ContentActions - 테스트 타입 → 카테고리 매핑', () => {
  it('주요 테스트 타입이 올바른 카테고리에 매핑됨', () => {
    expect(TEST_TO_CATEGORY['cat']).toBe('cat');
    expect(TEST_TO_CATEGORY['dog']).toBe('dog');
    expect(TEST_TO_CATEGORY['rabbit']).toBe('rabbit');
    expect(TEST_TO_CATEGORY['plant']).toBe('plant');
  });

  it('복합 테스트 타입이 관련 카테고리에 매핑됨', () => {
    expect(TEST_TO_CATEGORY['idealType']).toBe('love');
    expect(TEST_TO_CATEGORY['conflictStyle']).toBe('relationship');
    expect(TEST_TO_CATEGORY['petMatch']).toBe('general');
    expect(TEST_TO_CATEGORY['human']).toBe('personality');
  });

  it('알 수 없는 테스트 타입은 undefined', () => {
    expect(TEST_TO_CATEGORY['unknown']).toBeUndefined();
  });
});

describe('ContentActions - 관련 콘텐츠 필터링', () => {
  it('해당 카테고리의 퀴즈만 필터링', () => {
    const result = getRelatedContent(MOCK_QUIZZES, 'cat');
    expect(result.items.length).toBe(2);
    expect(result.items.every(q => q.category === 'cat')).toBe(true);
    expect(result.count).toBe(2);
    expect(result.isFallback).toBe(false);
  });

  it('해당 카테고리의 투표만 필터링', () => {
    const result = getRelatedContent(MOCK_POLLS, 'dog');
    expect(result.items.length).toBe(1);
    expect(result.items[0].category).toBe('dog');
    expect(result.count).toBe(1);
    expect(result.isFallback).toBe(false);
  });

  it('여러 개 있으면 maxItems 개수만 반환', () => {
    const result = getRelatedContent(MOCK_QUIZZES, 'cat', 1);
    expect(result.items.length).toBe(1);
    expect(result.count).toBe(2); // 전체 개수는 2개
  });
});

describe('ContentActions - 폴백 로직', () => {
  it('해당 카테고리에 콘텐츠 없으면 전체에서 가져옴', () => {
    const result = getRelatedContent(MOCK_QUIZZES, 'hamster');
    expect(result.items.length).toBe(2);
    expect(result.count).toBe(MOCK_QUIZZES.length);
    expect(result.isFallback).toBe(true);
  });

  it('love 카테고리 폴백', () => {
    const result = getRelatedContent(MOCK_POLLS, 'love');
    expect(result.isFallback).toBe(true);
    expect(result.items.length).toBe(2);
  });

  it('빈 배열에서는 빈 결과 반환', () => {
    const result = getRelatedContent([], 'cat');
    expect(result.items.length).toBe(0);
    expect(result.count).toBe(0);
    expect(result.isFallback).toBe(true);
  });
});

describe('ContentActions - CATEGORY_LABELS 접근', () => {
  // CATEGORY_LABELS 객체 구조 시뮬레이션
  const CATEGORY_LABELS: Record<string, { name: string; emoji: string }> = {
    cat: { name: '고양이', emoji: '🐱' },
    dog: { name: '강아지', emoji: '🐕' },
    rabbit: { name: '토끼', emoji: '🐰' },
    plant: { name: '식물', emoji: '🌱' },
    general: { name: '일반', emoji: '📚' },
  };

  it('카테고리 라벨 객체 접근 (.name 속성)', () => {
    const categoryInfo = CATEGORY_LABELS['cat'];
    expect(categoryInfo.name).toBe('고양이');
    expect(categoryInfo.emoji).toBe('🐱');
  });

  it('알 수 없는 카테고리는 폴백 사용', () => {
    const categoryInfo = CATEGORY_LABELS['unknown'] || { name: '관련', emoji: '📚' };
    expect(categoryInfo.name).toBe('관련');
  });

  it('UI에 사용할 라벨 추출', () => {
    const targetCategory = 'rabbit';
    const categoryInfo = CATEGORY_LABELS[targetCategory] || { name: '관련', emoji: '📚' };
    const categoryLabel = categoryInfo.name;

    expect(categoryLabel).toBe('토끼');
    expect(`${categoryLabel} 퀴즈`).toBe('토끼 퀴즈');
    expect(`${categoryLabel} 투표`).toBe('토끼 투표');
  });
});
