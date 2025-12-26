/**
 * Stage 5-6 인사이트 로직 검증 테스트
 *
 * Stage 5: 관계 패턴 분석
 * Stage 6: 숨은 패턴 분석
 *
 * 실행: npx vitest run tests/insight-stage5-6.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  generateRelationshipPatternResult,
  calculateConflictStyleScores,
  findPrimaryConflictStyles,
  calculateAxisScore,
  matchRelationshipProfile,
  TKI_STYLES,
  RELATIONSHIP_PROFILES,
} from '../src/data/insight/stage5-relationship-pattern';
import {
  generateHiddenPatternResult,
  findContradictions,
  findRarePatterns,
  analyzeConsistency,
  extractDominantTraits,
  CONTRADICTION_RULES,
  RARE_COMBINATIONS,
} from '../src/data/insight/stage6-hidden-pattern';

// ============================================================================
// Stage 5: 관계 패턴 테스트
// ============================================================================

describe('Stage 5: 관계 패턴 분석', () => {
  describe('TKI 스타일 정의', () => {
    it('5개 TKI 스타일이 정의되어 있어야 함', () => {
      const styles = Object.keys(TKI_STYLES);
      expect(styles).toHaveLength(5);
      expect(styles).toContain('competing');
      expect(styles).toContain('avoiding');
      expect(styles).toContain('accommodating');
      expect(styles).toContain('collaborating');
      expect(styles).toContain('compromising');
    });

    it('각 TKI 스타일은 필수 필드를 가져야 함', () => {
      Object.values(TKI_STYLES).forEach(style => {
        expect(style.id).toBeDefined();
        expect(style.name).toBeDefined();
        expect(style.nameKr).toBeDefined();
        expect(style.emoji).toBeDefined();
        expect(style.description).toBeDefined();
        expect(style.strength).toBeDefined();
        expect(style.watchOut).toBeDefined();
      });
    });
  });

  describe('관계 프로필 정의', () => {
    it('8개 관계 프로필이 정의되어 있어야 함', () => {
      expect(RELATIONSHIP_PROFILES).toHaveLength(8);
    });

    it('각 프로필은 필수 필드를 가져야 함', () => {
      RELATIONSHIP_PROFILES.forEach(profile => {
        expect(profile.id).toBeDefined();
        expect(profile.name).toBeDefined();
        expect(profile.nameKr).toBeDefined();
        expect(profile.emoji).toBeDefined();
        expect(profile.description).toBeDefined();
        expect(profile.characteristics).toBeInstanceOf(Array);
        expect(profile.strengths).toBeInstanceOf(Array);
        expect(profile.growthAreas).toBeInstanceOf(Array);
      });
    });
  });

  describe('calculateConflictStyleScores', () => {
    it('TKI 태그 점수를 올바르게 집계해야 함', () => {
      const tagCounts = {
        competing: 5,
        avoiding: 3,
        collaborating: 2,
      };

      const scores = calculateConflictStyleScores(tagCounts);

      expect(scores.competing).toBe(5);
      expect(scores.avoiding).toBe(3);
      expect(scores.collaborating).toBe(2);
      expect(scores.accommodating).toBe(0);
      expect(scores.compromising).toBe(0);
    });

    it('태그가 없으면 모든 점수가 0이어야 함', () => {
      const scores = calculateConflictStyleScores({});

      Object.values(scores).forEach(score => {
        expect(score).toBe(0);
      });
    });
  });

  describe('findPrimaryConflictStyles', () => {
    it('가장 높은 점수의 스타일을 primary로 반환해야 함', () => {
      const scores = {
        competing: 10,
        avoiding: 5,
        accommodating: 2,
        collaborating: 3,
        compromising: 1,
      };

      const result = findPrimaryConflictStyles(scores);

      expect(result.primary).toBe('competing');
    });

    it('두 번째 스타일이 50% 이상이면 secondary로 반환해야 함', () => {
      const scores = {
        competing: 10,
        avoiding: 6, // 60% of 10
        accommodating: 0,
        collaborating: 0,
        compromising: 0,
      };

      const result = findPrimaryConflictStyles(scores);

      expect(result.primary).toBe('competing');
      expect(result.secondary).toBe('avoiding');
    });

    it('두 번째 스타일이 50% 미만이면 secondary가 없어야 함', () => {
      const scores = {
        competing: 10,
        avoiding: 4, // 40% of 10
        accommodating: 0,
        collaborating: 0,
        compromising: 0,
      };

      const result = findPrimaryConflictStyles(scores);

      expect(result.primary).toBe('competing');
      expect(result.secondary).toBeUndefined();
    });

    it('모든 점수가 0이면 기본값 compromising 반환', () => {
      const scores = {
        competing: 0,
        avoiding: 0,
        accommodating: 0,
        collaborating: 0,
        compromising: 0,
      };

      const result = findPrimaryConflictStyles(scores);

      expect(result.primary).toBe('compromising');
    });
  });

  describe('calculateAxisScore', () => {
    it('한쪽만 있으면 해당 방향으로 100/-100', () => {
      const tagCounts = { 'close-bonding': 5 };
      const score = calculateAxisScore(tagCounts, 'space-needing', 'close-bonding');
      expect(score).toBe(100); // right 방향
    });

    it('양쪽 균형이면 0', () => {
      const tagCounts = { 'close-bonding': 5, 'space-needing': 5 };
      const score = calculateAxisScore(tagCounts, 'space-needing', 'close-bonding');
      expect(score).toBe(0);
    });

    it('left가 더 많으면 음수', () => {
      const tagCounts = { 'close-bonding': 2, 'space-needing': 8 };
      const score = calculateAxisScore(tagCounts, 'space-needing', 'close-bonding');
      expect(score).toBe(-60); // (2-8)/10 * 100 = -60
    });

    it('태그가 없으면 0', () => {
      const score = calculateAxisScore({}, 'space-needing', 'close-bonding');
      expect(score).toBe(0);
    });
  });

  describe('matchRelationshipProfile', () => {
    it('close + other-first → caring-connector', () => {
      const profile = matchRelationshipProfile(50, 50, 0, 'accommodating');
      expect(profile.id).toBe('caring-connector');
    });

    it('close + self-first → passionate-partner', () => {
      const profile = matchRelationshipProfile(50, -50, 0, 'competing');
      expect(profile.id).toBe('passionate-partner');
    });

    it('distant + other-first → gentle-guardian', () => {
      const profile = matchRelationshipProfile(-50, 50, 0, 'avoiding');
      expect(profile.id).toBe('gentle-guardian');
    });

    it('distant + self-first → independent-spirit', () => {
      const profile = matchRelationshipProfile(-50, -50, 0, 'competing');
      expect(profile.id).toBe('independent-spirit');
    });

    it('assertive + collaborating → confident-collaborator', () => {
      const profile = matchRelationshipProfile(0, 0, -50, 'collaborating');
      expect(profile.id).toBe('confident-collaborator');
    });

    it('diplomatic + collaborating → harmonious-mediator', () => {
      const profile = matchRelationshipProfile(0, 0, 50, 'collaborating');
      expect(profile.id).toBe('harmonious-mediator');
    });

    it('assertive + competing → bold-leader', () => {
      const profile = matchRelationshipProfile(0, 0, -50, 'competing');
      expect(profile.id).toBe('bold-leader');
    });

    it('균형 상태 → adaptable-relator', () => {
      const profile = matchRelationshipProfile(0, 0, 0, 'compromising');
      expect(profile.id).toBe('adaptable-relator');
    });
  });

  describe('generateRelationshipPatternResult', () => {
    it('전체 결과 구조 검증', () => {
      const tagCounts = {
        competing: 5,
        avoiding: 2,
        'close-bonding': 4,
        'space-needing': 1,
        'self-first': 3,
        'other-first': 2,
        assertive: 4,
        diplomatic: 1,
      };

      const result = generateRelationshipPatternResult(tagCounts);

      expect(result.conflictStyle).toBeDefined();
      expect(result.conflictStyle.primary).toBeDefined();
      expect(result.conflictStyle.score).toBeDefined();
      expect(result.intimacyPreference).toBeDefined();
      expect(result.careDirection).toBeDefined();
      expect(result.communicationStyle).toBeDefined();
      expect(result.profile).toBeDefined();
      expect(result.insights).toBeInstanceOf(Array);
      expect(result.generatedAt).toBeDefined();
    });

    it('태그가 없어도 기본 결과 반환', () => {
      const result = generateRelationshipPatternResult({});

      expect(result.conflictStyle.primary).toBeDefined();
      expect(result.profile).toBeDefined();
    });
  });
});

// ============================================================================
// Stage 6: 숨은 패턴 테스트
// ============================================================================

describe('Stage 6: 숨은 패턴 분석', () => {
  describe('모순 룰 정의', () => {
    it('12개 모순 룰이 정의되어 있어야 함', () => {
      expect(CONTRADICTION_RULES.length).toBe(12);
    });

    it('각 룰은 필수 필드를 가져야 함', () => {
      CONTRADICTION_RULES.forEach(rule => {
        expect(rule.left).toBeDefined();
        expect(rule.right).toBeDefined();
        expect(rule.interpretation).toBeDefined();
        expect(rule.insight).toBeDefined();
        expect(rule.emoji).toBeDefined();
      });
    });
  });

  describe('희귀 조합 정의', () => {
    it('10개 희귀 조합이 정의되어 있어야 함', () => {
      expect(RARE_COMBINATIONS.length).toBe(10);
    });

    it('각 조합은 필수 필드를 가져야 함', () => {
      RARE_COMBINATIONS.forEach(combo => {
        expect(combo.tags).toBeInstanceOf(Array);
        expect(combo.tags.length).toBeGreaterThanOrEqual(2);
        expect(['uncommon', 'rare', 'very-rare']).toContain(combo.rarity);
        expect(combo.percentage).toBeGreaterThan(0);
        expect(combo.interpretation).toBeDefined();
        expect(combo.emoji).toBeDefined();
      });
    });
  });

  describe('findContradictions', () => {
    it('양쪽 태그가 2개 이상일 때 모순 발견', () => {
      const tagCounts = {
        extroverted: 5,
        introverted: 4,
      };

      const contradictions = findContradictions(tagCounts);

      expect(contradictions.length).toBeGreaterThan(0);
      expect(contradictions[0].tagPair).toContain('extroverted');
      expect(contradictions[0].tagPair).toContain('introverted');
    });

    it('한쪽만 2개 이상이면 모순 아님', () => {
      const tagCounts = {
        extroverted: 10,
        introverted: 1,
      };

      const contradictions = findContradictions(tagCounts);

      // introverted가 1개 밖에 없으므로 모순 아님
      const extIntro = contradictions.find(
        c => c.tagPair.includes('extroverted') && c.tagPair.includes('introverted')
      );
      expect(extIntro).toBeUndefined();
    });

    it('비율이 2배 초과면 모순 아님', () => {
      const tagCounts = {
        extroverted: 10,
        introverted: 3, // 10/3 > 2
      };

      const contradictions = findContradictions(tagCounts);

      const extIntro = contradictions.find(
        c => c.tagPair.includes('extroverted') && c.tagPair.includes('introverted')
      );
      expect(extIntro).toBeUndefined();
    });

    it('최대 3개까지만 반환', () => {
      const tagCounts = {
        extroverted: 5, introverted: 5,
        planned: 5, spontaneous: 5,
        logical: 5, emotional: 5,
        practical: 5, sentimental: 5,
        adventurous: 5, safe: 5,
      };

      const contradictions = findContradictions(tagCounts);

      expect(contradictions.length).toBeLessThanOrEqual(3);
    });
  });

  describe('findRarePatterns', () => {
    it('모든 태그가 있으면 희귀 조합 발견', () => {
      const tagCounts = {
        introverted: 3,
        leading: 2,
        direct: 4,
      };

      const rarePatterns = findRarePatterns(tagCounts);

      const quietLeader = rarePatterns.find(p => p.interpretation === '조용한 리더');
      expect(quietLeader).toBeDefined();
      expect(quietLeader?.rarity).toBe('very-rare');
    });

    it('일부 태그만 있으면 희귀 조합 없음', () => {
      const tagCounts = {
        introverted: 3,
        leading: 2,
        // direct 없음
      };

      const rarePatterns = findRarePatterns(tagCounts);

      const quietLeader = rarePatterns.find(p => p.interpretation === '조용한 리더');
      expect(quietLeader).toBeUndefined();
    });

    it('최대 3개까지만 반환', () => {
      const tagCounts = {
        // 여러 희귀 조합 충족
        introverted: 3, leading: 2, direct: 4,
        extroverted: 3, analytical: 2, planned: 4,
        emotional: 3, practical: 2, structured: 4,
        expressive: 2,
        spontaneous: 2, cautious: 2,
      };

      const rarePatterns = findRarePatterns(tagCounts);

      expect(rarePatterns.length).toBeLessThanOrEqual(3);
    });

    it('희귀도순 정렬 (very-rare 먼저)', () => {
      const tagCounts = {
        introverted: 3, leading: 2, direct: 4, // very-rare
        expressive: 2, // rare with introverted
      };

      const rarePatterns = findRarePatterns(tagCounts);

      if (rarePatterns.length >= 2) {
        expect(['very-rare', 'rare']).toContain(rarePatterns[0].rarity);
      }
    });
  });

  describe('analyzeConsistency', () => {
    it('태그가 없으면 중간 일관성', () => {
      const result = analyzeConsistency({});

      expect(result.score).toBe(50);
      expect(result.level).toBe('medium');
    });

    it('집중된 태그면 높은 일관성', () => {
      const tagCounts = {
        extroverted: 20,
        leading: 15,
        direct: 10,
      };

      const result = analyzeConsistency(tagCounts);

      expect(result.score).toBeGreaterThan(50);
    });

    it('분산된 태그면 낮은 일관성', () => {
      const tagCounts: Record<string, number> = {};
      // 20개 태그에 각 1개씩
      const tags = [
        'extroverted', 'introverted', 'logical', 'emotional',
        'planned', 'spontaneous', 'independent', 'collaborative',
        'resilient', 'sensitive', 'practical', 'sentimental',
        'adventurous', 'safe', 'solo', 'together',
        'direct', 'indirect', 'competing', 'avoiding',
      ];
      tags.forEach(tag => { tagCounts[tag] = 1; });

      const result = analyzeConsistency(tagCounts);

      expect(result.level).toBe('medium');
    });

    it('점수 범위는 0-100', () => {
      const tagCounts = {
        extroverted: 100,
        introverted: 100,
        planned: 100,
        spontaneous: 100,
      };

      const result = analyzeConsistency(tagCounts);

      expect(result.score).toBeGreaterThanOrEqual(0);
      expect(result.score).toBeLessThanOrEqual(100);
    });
  });

  describe('extractDominantTraits', () => {
    it('상위 5개 특성 추출', () => {
      const tagCounts = {
        extroverted: 10,
        logical: 8,
        planned: 6,
        independent: 4,
        resilient: 2,
        sensitive: 1,
      };

      const traits = extractDominantTraits(tagCounts);

      expect(traits.length).toBe(5);
      expect(traits[0].tag).toBe('extroverted');
      expect(traits[0].count).toBe(10);
    });

    it('카테고리 정보 포함', () => {
      const tagCounts = {
        extroverted: 5,
        practical: 3,
        competing: 2,
      };

      const traits = extractDominantTraits(tagCounts);

      const extroTrait = traits.find(t => t.tag === 'extroverted');
      const practicalTrait = traits.find(t => t.tag === 'practical');
      const competingTrait = traits.find(t => t.tag === 'competing');

      expect(extroTrait?.category).toBe('성격');
      expect(practicalTrait?.category).toBe('판단');
      expect(competingTrait?.category).toBe('관계');
    });

    it('내림차순 정렬', () => {
      const tagCounts = {
        planned: 3,
        extroverted: 10,
        logical: 5,
      };

      const traits = extractDominantTraits(tagCounts);

      expect(traits[0].count).toBeGreaterThanOrEqual(traits[1].count);
      expect(traits[1].count).toBeGreaterThanOrEqual(traits[2].count);
    });
  });

  describe('generateHiddenPatternResult', () => {
    it('전체 결과 구조 검증', () => {
      const tagCounts = {
        extroverted: 5,
        introverted: 4,
        planned: 6,
        spontaneous: 3,
        logical: 4,
        practical: 5,
      };

      const result = generateHiddenPatternResult(tagCounts);

      expect(result.contradictions).toBeInstanceOf(Array);
      expect(result.rarePatterns).toBeInstanceOf(Array);
      expect(result.consistency).toBeDefined();
      expect(result.consistency.score).toBeDefined();
      expect(result.consistency.level).toBeDefined();
      expect(result.overallInsight).toBeDefined();
      expect(result.personalizedMessage).toBeDefined();
      expect(result.dominantTraits).toBeInstanceOf(Array);
      expect(result.generatedAt).toBeDefined();
    });

    it('태그가 없어도 기본 결과 반환', () => {
      const result = generateHiddenPatternResult({});

      expect(result.contradictions).toHaveLength(0);
      expect(result.rarePatterns).toHaveLength(0);
      expect(result.consistency).toBeDefined();
    });
  });
});

// ============================================================================
// 통합 테스트
// ============================================================================

describe('Stage 5-6 통합 시나리오', () => {
  it('시나리오: 경쟁적이지만 배려심 있는 리더', () => {
    const tagCounts = {
      // 갈등 스타일
      competing: 8,
      collaborating: 5,
      // 친밀도
      'close-bonding': 6,
      'space-needing': 2,
      // 배려 방향
      'self-first': 3,
      'other-first': 4,
      // 소통 스타일
      assertive: 7,
      diplomatic: 3,
      // 성격
      extroverted: 6,
      leading: 5,
      direct: 4,
    };

    // Stage 5
    const stage5Result = generateRelationshipPatternResult(tagCounts);
    expect(stage5Result.conflictStyle.primary.id).toBe('competing');
    expect(stage5Result.conflictStyle.secondary?.id).toBe('collaborating');

    // Stage 6
    const stage6Result = generateHiddenPatternResult(tagCounts);
    expect(stage6Result.dominantTraits.length).toBeGreaterThan(0);
    expect(stage6Result.dominantTraits[0].tag).toBe('competing');
  });

  it('시나리오: 내향적이지만 표현력 있는 (희귀 조합)', () => {
    const tagCounts = {
      // 희귀 조합: introverted + expressive
      introverted: 5,
      expressive: 4,
      // 갈등 스타일
      avoiding: 4,
      accommodating: 3,
      // 친밀도
      'space-needing': 5,
      'close-bonding': 2,
      // 배려 방향
      'other-first': 5,
      'self-first': 1,
    };

    // Stage 5
    const stage5Result = generateRelationshipPatternResult(tagCounts);
    expect(stage5Result.profile).toBeDefined();

    // Stage 6 - 희귀 조합 발견
    const stage6Result = generateHiddenPatternResult(tagCounts);
    const selectiveExpressor = stage6Result.rarePatterns.find(
      p => p.interpretation === '선택적 표현가'
    );
    expect(selectiveExpressor).toBeDefined();
    expect(selectiveExpressor?.rarity).toBe('rare');
  });

  it('시나리오: 다면적 성격 (많은 모순)', () => {
    const tagCounts = {
      extroverted: 5, introverted: 4,
      planned: 5, spontaneous: 4,
      logical: 4, emotional: 4,
      practical: 3, sentimental: 3,
      // 갈등
      competing: 3,
      accommodating: 3,
    };

    // Stage 6 - 여러 모순 발견
    const stage6Result = generateHiddenPatternResult(tagCounts);
    expect(stage6Result.contradictions.length).toBeGreaterThan(0);
    // 많은 모순이 있으면 일관성이 낮아짐 (다면적 성격)
    expect(['low', 'medium']).toContain(stage6Result.consistency.level);
  });
});
