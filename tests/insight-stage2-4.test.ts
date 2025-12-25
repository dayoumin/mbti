/**
 * Stage 2-4 인사이트 로직 검증 테스트
 *
 * Stage 2: 성격 조합 룰 매칭
 * Stage 3: 판단 스타일 분석
 * Stage 4: 관심사 지도
 *
 * 실행: npx vitest run tests/insight-stage2-4.test.ts
 */

import { describe, it, expect } from 'vitest';
import { matchStage2Rules, STAGE2_RULES } from '../src/data/insight/stage2-rules';
import {
  generateDecisionStyleResult,
  calculateDimensionScores,
  matchDecisionProfile,
  DECISION_DIMENSIONS,
  DECISION_PROFILES,
} from '../src/data/insight/stage3-decision-style';
import {
  generateInterestMapResult,
  aggregateByCategory,
  INTEREST_CATEGORIES,
  INTEREST_PROFILES,
} from '../src/data/insight/stage4-interest-map';

// ============================================================================
// Stage 2: 성격 조합 룰 테스트
// ============================================================================

describe('Stage 2: 성격 조합 룰', () => {
  it('STAGE2_RULES에 15개 룰이 정의되어 있어야 함', () => {
    expect(STAGE2_RULES).toHaveLength(15);
  });

  it('각 룰은 필수 필드를 가져야 함', () => {
    STAGE2_RULES.forEach((rule, index) => {
      expect(rule.id).toBeDefined();
      expect(rule.name).toBeDefined();
      expect(rule.nameKr).toBeDefined();
      expect(rule.conditions).toBeDefined();
      expect(rule.conditions.required).toBeDefined();
      expect(rule.conditions.required.length).toBeGreaterThanOrEqual(2);
      expect(rule.insight).toBeDefined();
      expect(rule.insight.emoji).toBeDefined();
      expect(rule.insight.title).toBeDefined();
      expect(rule.insight.description).toBeDefined();
    });
  });

  it('matchStage2Rules: 모든 필수 태그가 있으면 매칭', () => {
    // combo-001 조건: required: ['extroverted', 'expressive', 'together'], minTagCount: 2
    const userTags = ['extroverted', 'expressive', 'together'];
    const matches = matchStage2Rules(userTags, 5);

    expect(matches.length).toBeGreaterThan(0);
    const socialButterfly = matches.find(m => m.id === 'combo-001');
    expect(socialButterfly).toBeDefined();
    expect(socialButterfly?.nameKr).toBe('사교적인 나비');
  });

  it('matchStage2Rules: 필수 태그 없으면 매칭 안됨', () => {
    const userTags = ['introverted', 'analytical'];
    const matches = matchStage2Rules(userTags, 5);

    // combo-001 (extroverted + leading)은 매칭되면 안됨
    const socialLeader = matches.find(m => m.id === 'combo-001');
    expect(socialLeader).toBeUndefined();
  });

  it('matchStage2Rules: 점수순 정렬', () => {
    // 여러 룰이 매칭될 수 있는 태그 조합
    const userTags = ['extroverted', 'leading', 'spontaneous', 'adventurous'];
    const matches = matchStage2Rules(userTags, 10);

    // 점수 내림차순 정렬 확인
    for (let i = 1; i < matches.length; i++) {
      expect(matches[i - 1].matchScore).toBeGreaterThanOrEqual(matches[i].matchScore);
    }
  });

  it('matchStage2Rules: limit 적용', () => {
    const userTags = ['extroverted', 'introverted', 'leading', 'supportive', 'spontaneous', 'planned'];
    const matches = matchStage2Rules(userTags, 3);

    expect(matches.length).toBeLessThanOrEqual(3);
  });

  it('룰 confidence 레벨 분포', () => {
    const confidences = STAGE2_RULES.map(r => r.confidence);
    const confidenceSet = new Set(confidences);

    // high, medium, low 중 존재하는 것들 확인
    expect(confidenceSet.size).toBeGreaterThanOrEqual(1);

    // 모든 룰이 유효한 confidence를 가짐
    const validConfidences = ['high', 'medium', 'low'];
    STAGE2_RULES.forEach(rule => {
      expect(validConfidences).toContain(rule.confidence);
    });
  });
});

// ============================================================================
// Stage 3: 판단 스타일 분석 테스트
// ============================================================================

describe('Stage 3: 판단 스타일 분석', () => {
  it('DECISION_DIMENSIONS에 4개 차원이 정의되어 있어야 함', () => {
    expect(DECISION_DIMENSIONS).toHaveLength(4);

    const dimensionIds = DECISION_DIMENSIONS.map(d => d.id);
    expect(dimensionIds).toContain('practical-emotional');
    expect(dimensionIds).toContain('safe-adventurous');
    expect(dimensionIds).toContain('solo-together');
    expect(dimensionIds).toContain('direct-indirect');
  });

  it('DECISION_PROFILES에 8개 프로필이 정의되어 있어야 함', () => {
    expect(DECISION_PROFILES).toHaveLength(8);
  });

  describe('calculateDimensionScores', () => {
    it('태그 없으면 점수 0', () => {
      const tagCounts: Record<string, number> = {};
      const scores = calculateDimensionScores(tagCounts);

      scores.forEach(dim => {
        expect(dim.score).toBe(0);
      });
    });

    it('한쪽만 있으면 해당 방향으로 100점', () => {
      const tagCounts = { practical: 5 }; // sentimental 없음
      const scores = calculateDimensionScores(tagCounts);

      const practicalDim = scores.find(s => s.dimension.id === 'practical-emotional');
      expect(practicalDim?.score).toBe(-100); // left (practical) 방향
    });

    it('양쪽 균형이면 0점 근처', () => {
      const tagCounts = { practical: 5, sentimental: 5 };
      const scores = calculateDimensionScores(tagCounts);

      const practicalDim = scores.find(s => s.dimension.id === 'practical-emotional');
      expect(practicalDim?.score).toBe(0);
    });

    it('해석 텍스트 생성', () => {
      const tagCounts = { practical: 8, sentimental: 2 };
      const scores = calculateDimensionScores(tagCounts);

      const practicalDim = scores.find(s => s.dimension.id === 'practical-emotional');
      expect(practicalDim?.interpretation).toContain('실용적');
    });
  });

  describe('matchDecisionProfile', () => {
    it('practical + safe → practical-safe 프로필', () => {
      const tagCounts = { practical: 5, sentimental: 2, safe: 5, adventurous: 2 };
      const profile = matchDecisionProfile(tagCounts);

      expect(profile.id).toBe('practical-safe');
      expect(profile.nameKr).toBe('신중한 계획가');
    });

    it('sentimental + adventurous → emotional-adventurous 프로필', () => {
      const tagCounts = { practical: 2, sentimental: 5, safe: 2, adventurous: 5 };
      const profile = matchDecisionProfile(tagCounts);

      expect(profile.id).toBe('emotional-adventurous');
      expect(profile.nameKr).toBe('열정적 탐험가');
    });
  });

  describe('generateDecisionStyleResult', () => {
    it('전체 결과 구조 검증', () => {
      const tagCounts = {
        practical: 5,
        sentimental: 3,
        safe: 2,
        adventurous: 4,
        solo: 3,
        together: 5,
        direct: 4,
        indirect: 2,
      };

      const result = generateDecisionStyleResult(tagCounts);

      expect(result.profile).toBeDefined();
      expect(result.dimensions).toHaveLength(4);
      expect(result.dominantTags).toBeDefined();
      expect(result.generatedAt).toBeDefined();
    });

    it('dominantTags 정렬 및 제한', () => {
      const tagCounts = {
        practical: 10,
        sentimental: 8,
        safe: 6,
        adventurous: 4,
        solo: 2,
        together: 1,
      };

      const result = generateDecisionStyleResult(tagCounts);

      // 최대 5개
      expect(result.dominantTags.length).toBeLessThanOrEqual(5);

      // 내림차순 정렬
      for (let i = 1; i < result.dominantTags.length; i++) {
        expect(result.dominantTags[i - 1].count).toBeGreaterThanOrEqual(result.dominantTags[i].count);
      }
    });
  });
});

// ============================================================================
// Stage 4: 관심사 지도 테스트
// ============================================================================

describe('Stage 4: 관심사 지도', () => {
  it('INTEREST_CATEGORIES에 6개 카테고리가 정의되어 있어야 함', () => {
    expect(INTEREST_CATEGORIES).toHaveLength(6);

    const categoryIds = INTEREST_CATEGORIES.map(c => c.id);
    expect(categoryIds).toContain('pets');
    expect(categoryIds).toContain('nature');
    expect(categoryIds).toContain('food-drink');
    expect(categoryIds).toContain('relationships');
    expect(categoryIds).toContain('lifestyle');
    expect(categoryIds).toContain('fortune');
  });

  it('INTEREST_PROFILES에 7개 프로필이 정의되어 있어야 함', () => {
    expect(INTEREST_PROFILES).toHaveLength(7);

    const profileIds = INTEREST_PROFILES.map(p => p.id);
    expect(profileIds).toContain('pet-lover');
    expect(profileIds).toContain('nature-seeker');
    expect(profileIds).toContain('foodie');
    expect(profileIds).toContain('all-rounder');
  });

  describe('aggregateByCategory', () => {
    it('interest- 태그만 집계', () => {
      const tagCounts = {
        'interest-cat': 5,
        'interest-dog': 3,
        'practical': 10, // 이건 집계 안됨
        'introverted': 5, // 이것도 집계 안됨
      };

      const result = aggregateByCategory(tagCounts);

      // pets 카테고리에 cat + dog = 8
      expect(result.get('pets')).toBe(8);

      // 다른 카테고리는 0
      expect(result.get('nature')).toBe(0);
    });

    it('카테고리 전체 초기화', () => {
      const tagCounts = {};
      const result = aggregateByCategory(tagCounts);

      // 모든 카테고리 존재
      expect(result.size).toBe(6);
      INTEREST_CATEGORIES.forEach(cat => {
        expect(result.has(cat.id)).toBe(true);
      });
    });
  });

  describe('generateInterestMapResult', () => {
    it('전체 결과 구조 검증', () => {
      const tagCounts = {
        'interest-cat': 5,
        'interest-coffee': 3,
        'interest-love': 2,
      };

      const result = generateInterestMapResult(tagCounts, 20);

      expect(result.entries).toHaveLength(6);
      expect(result.totalActivities).toBe(20);
      expect(result.topCategory).toBeDefined();
      expect(result.interestProfile).toBeDefined();
      expect(result.insights).toBeDefined();
      expect(result.generatedAt).toBeDefined();
    });

    it('entries는 카운트 내림차순 정렬', () => {
      const tagCounts = {
        'interest-cat': 10,
        'interest-coffee': 5,
        'interest-love': 3,
      };

      const result = generateInterestMapResult(tagCounts, 20);

      // pets (cat) > food-drink (coffee) > relationships (love)
      expect(result.entries[0].category.id).toBe('pets');
      expect(result.entries[0].count).toBe(10);
    });

    it('50% 이상이면 해당 프로필', () => {
      const tagCounts = {
        'interest-cat': 20,
        'interest-dog': 10,
        'interest-coffee': 2,
      };

      const result = generateInterestMapResult(tagCounts, 35);

      // pets가 30/32 = 93%
      expect(result.interestProfile.id).toBe('pet-lover');
    });

    it('상위 2개가 비슷하면 all-rounder', () => {
      const tagCounts = {
        'interest-cat': 10,
        'interest-coffee': 9,
        'interest-love': 8,
      };

      const result = generateInterestMapResult(tagCounts, 30);

      // 차이가 15% 미만이면 all-rounder
      expect(result.interestProfile.id).toBe('all-rounder');
    });

    it('인사이트 최대 4개', () => {
      const tagCounts = {
        'interest-cat': 20,
        'interest-plant': 15,
        'interest-coffee': 10,
        'interest-love': 5,
      };

      const result = generateInterestMapResult(tagCounts, 50);

      expect(result.insights.length).toBeLessThanOrEqual(4);
    });

    it('topCategory 없으면 null', () => {
      const tagCounts = {};
      const result = generateInterestMapResult(tagCounts, 0);

      expect(result.topCategory).toBeNull();
    });
  });
});

// ============================================================================
// 통합 테스트
// ============================================================================

describe('Stage 2-4 통합 시나리오', () => {
  it('시나리오: 고양이 집사 + 카페 러버', () => {
    // 테스트 결과에서 추출된 태그
    const personalityTags = ['introverted', 'planned', 'supportive'];

    // 투표에서 추출된 태그
    const decisionTags = { safe: 5, practical: 3, solo: 4, indirect: 2 };

    // 콘텐츠 카테고리에서 추출된 관심사 태그
    const interestTags = {
      'interest-cat': 8,
      'interest-coffee': 6,
      'interest-plant': 2,
    };

    // Stage 2: 성격 조합
    const stage2Matches = matchStage2Rules(personalityTags, 3);
    expect(stage2Matches.length).toBeGreaterThanOrEqual(0);

    // Stage 3: 판단 스타일
    const stage3Result = generateDecisionStyleResult(decisionTags);
    expect(stage3Result.profile).toBeDefined();
    expect(stage3Result.profile.id).toBe('practical-safe'); // 실용적 + 안전

    // Stage 4: 관심사 지도
    const stage4Result = generateInterestMapResult(interestTags, 20);
    expect(stage4Result.topCategory?.id).toBe('pets');
    expect(stage4Result.interestProfile.id).toBe('pet-lover');
  });

  it('시나리오: 활동적인 연애 탐험가', () => {
    const personalityTags = ['extroverted', 'adventurous', 'expressive'];
    const decisionTags = { adventurous: 8, sentimental: 6, together: 5, direct: 4 };
    const interestTags = {
      'interest-love': 10,
      'interest-food': 5,
      'interest-lifestyle': 3,
    };

    // Stage 2
    const stage2Matches = matchStage2Rules(personalityTags, 5);
    // extroverted는 combo-001, combo-002 등에 필요

    // Stage 3
    const stage3Result = generateDecisionStyleResult(decisionTags);
    expect(stage3Result.profile.id).toBe('emotional-adventurous');

    // Stage 4
    const stage4Result = generateInterestMapResult(interestTags, 25);
    expect(stage4Result.topCategory?.id).toBe('relationships');
    expect(stage4Result.interestProfile.id).toBe('relationship-explorer');
  });
});
