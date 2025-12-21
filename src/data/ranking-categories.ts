/**
 * 랭킹 카테고리 정의
 *
 * 테스트별로 결과를 평가하는 기준(카테고리)을 정의합니다.
 * 각 카테고리는 결과의 condition을 기반으로 점수를 계산합니다.
 *
 * 사용처:
 * - RankingTab.tsx: 전체 랭킹 뷰
 * - MyRankingMini.tsx: 사이드바 미니 랭킹
 * - ResultRankingView.tsx: 결과 화면 랭킹
 */

import type { ResultLabel } from './types';

// ============================================================================
// 타입 정의
// ============================================================================

export interface RankingCategory {
  id: string;
  name: string;
  emoji: string;
  description?: string;  // 선택적 (RankingTab에서만 사용)
  getScore: (result: ResultLabel) => number;
}

export type RankingCategoriesMap = Record<string, RankingCategory[]>;

// ============================================================================
// 랭킹 카테고리 정의
// ============================================================================

export const RANKING_CATEGORIES: RankingCategoriesMap = {
  petMatch: [
    {
      id: 'activity',
      name: '활동성',
      emoji: '🏃',
      description: '활발하고 에너지 넘치는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.activity === 'high') score += 3;
        else if (c.activity === 'medium') score += 2;
        else if (c.activity === 'low') score += 1;
        if (c.time === 'high') score += 2;
        return score;
      }
    },
    {
      id: 'easy',
      name: '초보 친화',
      emoji: '🌱',
      description: '키우기 쉬운 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 6;
        if (c.activity === 'high') score -= 1;
        if (c.time === 'high') score -= 1;
        if (c.space === 'high') score -= 1;
        return Math.max(0, score);
      }
    },
  ],
  plant: [
    {
      id: 'easy',
      name: '초보 추천',
      emoji: '🌱',
      description: '관리가 쉬운 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 6;
        if (c.care === 'high') score -= 2;
        if (c.water === 'high') score -= 1;
        return Math.max(0, score);
      }
    },
    {
      id: 'neglect',
      name: '방치 가능',
      emoji: '😴',
      description: '물 잘 안 줘도 되는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.water === 'low') score += 3;
        else if (c.water === 'medium') score += 2;
        return score;
      }
    },
  ],
  coffee: [
    {
      id: 'strong',
      name: '진한 맛',
      emoji: '💪',
      description: '진하고 강한 맛 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.bitter === 'high') score += 3;
        if (c.caffeine === 'high') score += 2;
        return score;
      }
    },
    {
      id: 'sweet',
      name: '달달함',
      emoji: '🍬',
      description: '달콤한 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.sweet === 'high') score += 3;
        else if (c.sweet === 'medium') score += 2;
        return score;
      }
    },
  ],
  idealType: [
    {
      id: 'passion',
      name: '열정',
      emoji: '🔥',
      description: '열정적인 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.passion === 'high') score += 3;
        else if (c.passion === 'medium') score += 2;
        return score;
      }
    },
    {
      id: 'stable',
      name: '안정',
      emoji: '🏠',
      description: '안정적인 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.commit === 'high') score += 3;
        else if (c.commit === 'medium') score += 2;
        return score;
      }
    },
  ],
  food: [
    {
      id: 'adventure',
      name: '모험심',
      emoji: '🌶️',
      description: '새로운 음식에 도전하는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.adventure === 'high') score += 3;
        else if (c.adventure === 'medium') score += 2;
        return score;
      }
    },
    {
      id: 'comfort',
      name: '편안함',
      emoji: '🍚',
      description: '익숙한 음식을 좋아하는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.comfort === 'high') score += 3;
        else if (c.comfort === 'medium') score += 2;
        return score;
      }
    },
  ],
};
