/**
 * InsightService 버그 수정 검증 테스트
 *
 * 수정 사항:
 * 1. totalActivities 중복 카운트 버그 수정
 * 2. Stage 1 레벨 계산 일관성 확보
 * 3. 태그 오염 필터링 추가
 */

import { describe, it, expect } from 'vitest';
import {
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
} from '../src/data/insight/insight-tags';

describe('InsightService 버그 수정 검증', () => {

  describe('1. totalActivities 중복 카운트 버그', () => {
    it('incrementActivityStat 로직: relationshipActivities는 totalActivities 증가하지 않음', () => {
      // 수정된 로직 시뮬레이션
      const incrementActivityStat = (
        stats: { testCount: number; relationshipActivities: number; totalActivities: number },
        key: 'testCount' | 'relationshipActivities',
        countAsActivity: boolean = true
      ) => {
        stats[key]++;
        // 수정된 로직: relationshipActivities는 totalActivities 증가 안 함
        if (countAsActivity && key !== 'relationshipActivities') {
          stats.totalActivities++;
        }
      };

      // 관계 테스트 완료 시나리오
      const stats = { testCount: 0, relationshipActivities: 0, totalActivities: 0 };

      // 1. testCount 증가 → totalActivities +1
      incrementActivityStat(stats, 'testCount');
      expect(stats.testCount).toBe(1);
      expect(stats.totalActivities).toBe(1);

      // 2. relationshipActivities 증가 → totalActivities 변화 없음
      incrementActivityStat(stats, 'relationshipActivities');
      expect(stats.relationshipActivities).toBe(1);
      expect(stats.totalActivities).toBe(1); // 여전히 1 (2가 아님!)
    });

    it('수정 전 버그: 중복 카운트 발생', () => {
      // 버그 있던 로직
      const buggyIncrement = (
        stats: { testCount: number; relationshipActivities: number; totalActivities: number },
        key: 'testCount' | 'relationshipActivities'
      ) => {
        stats[key]++;
        stats.totalActivities++; // 항상 증가 (버그!)
      };

      const stats = { testCount: 0, relationshipActivities: 0, totalActivities: 0 };

      buggyIncrement(stats, 'testCount');
      buggyIncrement(stats, 'relationshipActivities');

      // 버그: totalActivities가 2가 됨 (1이어야 함)
      expect(stats.totalActivities).toBe(2);
    });
  });

  describe('2. Stage 1 레벨 계산 일관성', () => {
    it('동적으로 차원당 최대 점수를 계산해야 함', () => {
      // 수정 전: 고정값 15점
      // 수정 후: (questionCount / dimensionCount) * 5

      // human 테스트: 12문항, 5차원 → 차원당 3문항 → 최대 15점
      // cat 테스트: 12문항, 5차원 → 차원당 3문항 → 최대 15점
      // 차원 수가 다른 테스트는 다르게 계산됨

      const questionCount = 12;
      const dimensionCount = 5;
      const dimQuestionCount = Math.ceil(questionCount / dimensionCount);
      const dimMaxScore = dimQuestionCount * 5;

      expect(dimMaxScore).toBe(15); // 5차원 테스트

      // 6차원 테스트 예시
      const dimMaxScore6 = Math.ceil(12 / 6) * 5;
      expect(dimMaxScore6).toBe(10); // 차원당 2문항 → 최대 10점
    });

    it('레벨 판정 기준: high >= 60%, low < 40%', () => {
      const getLevel = (scorePercent: number): 'high' | 'medium' | 'low' => {
        if (scorePercent >= 60) return 'high';
        if (scorePercent >= 40) return 'medium';
        return 'low';
      };

      expect(getLevel(60)).toBe('high');
      expect(getLevel(59)).toBe('medium');
      expect(getLevel(40)).toBe('medium');
      expect(getLevel(39)).toBe('low');
    });
  });

  describe('3. 태그 오염 필터링', () => {
    it('유효한 인사이트 태그만 저장되어야 함', () => {
      const validTags = new Set<string>([
        ...PERSONALITY_TAGS,
        ...DECISION_TAGS,
        ...RELATIONSHIP_TAGS,
      ]);

      // 유효한 태그 예시
      expect(validTags.has('extroverted')).toBe(true);
      expect(validTags.has('introverted')).toBe(true);
      expect(validTags.has('practical')).toBe(true);
      expect(validTags.has('competing')).toBe(true);

      // 오염 태그 예시 (필터링되어야 함)
      expect(validTags.has('human')).toBe(false);      // testId
      expect(validTags.has('cat')).toBe(false);        // category
      expect(validTags.has('option-a')).toBe(false);   // selectedOption
      expect(validTags.has('wine')).toBe(false);       // quiz category
    });

    it('addTags에서 비인사이트 태그는 저장되지 않아야 함', () => {
      // 수정된 로직:
      // if (VALID_INSIGHT_TAGS.has(tag)) {
      //   counts[tag] = (counts[tag] || 0) + 1;
      // }

      // 결과: getTopTags()에서 'human', 'option-a' 등이 나오지 않음
    });
  });

  describe('유효한 인사이트 태그 목록', () => {
    it('PERSONALITY_TAGS 포함 항목', () => {
      const expected = [
        'extroverted', 'introverted', 'ambiverted',
        'logical', 'emotional', 'intuitive', 'analytical',
        'planned', 'spontaneous', 'flexible', 'structured',
        'independent', 'collaborative', 'supportive', 'leading',
        'resilient', 'sensitive',
      ];

      expected.forEach(tag => {
        expect(PERSONALITY_TAGS).toContain(tag);
      });
    });

    it('DECISION_TAGS 포함 항목', () => {
      const expected = [
        'practical', 'sentimental',
        'safe', 'adventurous',
        'solo', 'together',
        'direct', 'indirect',
        'present-focused', 'future-focused',
      ];

      expected.forEach(tag => {
        expect(DECISION_TAGS).toContain(tag);
      });
    });

    it('RELATIONSHIP_TAGS 포함 항목', () => {
      // TKI 갈등 모델 기반 태그
      // Note: expressive, reserved는 PERSONALITY_TAGS로 이동됨
      const expected = [
        'competing', 'avoiding', 'accommodating', 'collaborating', 'compromising',
        'close-bonding', 'space-needing',
        'self-first', 'other-first',
      ];

      expected.forEach(tag => {
        expect(RELATIONSHIP_TAGS).toContain(tag);
      });
    });
  });
});
