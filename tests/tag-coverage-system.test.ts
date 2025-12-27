/**
 * 태그 커버리지 시스템 테스트
 *
 * 콘텐츠-인사이트 연동 시스템이 올바르게 작동하는지 검증합니다:
 * 1. 태그 우선순위 계산 로직
 * 2. 카테고리별 권장 태그 조합
 * 3. Interest 태그 필수 포함 검증
 * 4. Stage 해금 요구사항 충족 여부
 *
 * 실행: npx vitest run tests/tag-coverage-system.test.ts
 */

import { describe, it, expect } from 'vitest';
import {
  STAGE_REQUIREMENTS,
  CATEGORY_TAG_RECOMMENDATIONS,
  CONTENT_GENERATION_GUIDELINES,
  getTagPriorities,
  getRecommendedTags,
} from '../src/data/insight/content-plan';
import {
  PERSONALITY_TAGS,
  DECISION_TAGS,
  RELATIONSHIP_TAGS,
  INTEREST_TAGS,
  LIFESTYLE_TAGS,
  VALID_INSIGHT_TAGS,
  CATEGORY_TO_INTEREST,
  isValidInsightTag,
  getTagCategory,
} from '../src/data/insight/insight-tags';
import { VS_POLLS } from '../src/data/content/polls/vs-polls';
import { LOVE_VS_POLLS } from '../src/data/content/polls/love-vs-polls';

// ============================================================================
// 1. insight-tags.ts 테스트
// ============================================================================

describe('insight-tags.ts', () => {
  describe('태그 정의', () => {
    it('모든 카테고리에 태그가 정의되어 있어야 함', () => {
      expect(PERSONALITY_TAGS.length).toBeGreaterThan(0);
      expect(DECISION_TAGS.length).toBeGreaterThan(0);
      expect(RELATIONSHIP_TAGS.length).toBeGreaterThan(0);
      expect(INTEREST_TAGS.length).toBeGreaterThan(0);
      expect(LIFESTYLE_TAGS.length).toBeGreaterThan(0);
    });

    it('VALID_INSIGHT_TAGS가 모든 태그를 포함해야 함', () => {
      const totalTags =
        PERSONALITY_TAGS.length +
        DECISION_TAGS.length +
        RELATIONSHIP_TAGS.length +
        INTEREST_TAGS.length +
        LIFESTYLE_TAGS.length;

      expect(VALID_INSIGHT_TAGS.size).toBe(totalTags);
    });

    it('Interest 태그가 20개 정의되어 있어야 함', () => {
      expect(INTEREST_TAGS.length).toBe(20);
    });

    it('모든 Interest 태그가 interest- 접두사를 가져야 함', () => {
      for (const tag of INTEREST_TAGS) {
        expect(tag.startsWith('interest-')).toBe(true);
      }
    });
  });

  describe('isValidInsightTag', () => {
    it('유효한 태그를 인식해야 함', () => {
      expect(isValidInsightTag('extroverted')).toBe(true);
      expect(isValidInsightTag('practical')).toBe(true);
      expect(isValidInsightTag('interest-love')).toBe(true);
    });

    it('유효하지 않은 태그를 거부해야 함', () => {
      expect(isValidInsightTag('invalid-tag')).toBe(false);
      expect(isValidInsightTag('')).toBe(false);
      expect(isValidInsightTag('EXTROVERTED')).toBe(false);
    });
  });

  describe('getTagCategory', () => {
    it('태그의 카테고리를 올바르게 반환해야 함', () => {
      expect(getTagCategory('extroverted')).toBe('personality');
      expect(getTagCategory('practical')).toBe('decision');
      expect(getTagCategory('competing')).toBe('relationship');
      expect(getTagCategory('interest-cat')).toBe('interest');
      expect(getTagCategory('active')).toBe('lifestyle');
    });
  });

  describe('CATEGORY_TO_INTEREST', () => {
    it('주요 카테고리가 매핑되어 있어야 함', () => {
      expect(CATEGORY_TO_INTEREST['cat']).toBe('interest-cat');
      expect(CATEGORY_TO_INTEREST['dog']).toBe('interest-dog');
      expect(CATEGORY_TO_INTEREST['love']).toBe('interest-love');
      expect(CATEGORY_TO_INTEREST['coffee']).toBe('interest-coffee');
    });
  });
});

// ============================================================================
// 2. content-plan.ts 테스트
// ============================================================================

describe('content-plan.ts', () => {
  describe('STAGE_REQUIREMENTS', () => {
    it('Stage 4는 interest 카테고리를 요구해야 함', () => {
      expect(STAGE_REQUIREMENTS.stage4.requiredCategories).toContain('interest');
    });

    it('Stage 5는 relationship 카테고리를 요구해야 함', () => {
      expect(STAGE_REQUIREMENTS.stage5.requiredCategories).toContain('relationship');
    });

    it('Stage 6는 모든 카테고리를 요구해야 함', () => {
      const required = STAGE_REQUIREMENTS.stage6.requiredCategories;
      expect(required).toContain('personality');
      expect(required).toContain('decision');
      expect(required).toContain('relationship');
      expect(required).toContain('interest');
      expect(required).toContain('lifestyle');
    });
  });

  describe('CATEGORY_TAG_RECOMMENDATIONS', () => {
    it('love 카테고리에 interest-love가 포함되어야 함', () => {
      expect(CATEGORY_TAG_RECOMMENDATIONS.love.interest).toContain('interest-love');
    });

    it('cat 카테고리에 interest-cat이 포함되어야 함', () => {
      expect(CATEGORY_TAG_RECOMMENDATIONS.cat.interest).toContain('interest-cat');
    });

    it('모든 권장 태그가 유효한 태그여야 함', () => {
      for (const [category, recs] of Object.entries(CATEGORY_TAG_RECOMMENDATIONS)) {
        for (const [tagType, tags] of Object.entries(recs)) {
          for (const tag of tags) {
            expect(isValidInsightTag(tag)).toBe(true);
          }
        }
      }
    });
  });

  describe('getTagPriorities', () => {
    it('Interest 태그가 없으면 critical 우선순위를 반환해야 함', () => {
      const emptyUsage = {
        personality: {},
        decision: {},
        relationship: {},
        interest: {},
        lifestyle: {},
      };

      const priorities = getTagPriorities(emptyUsage);
      const criticalInterest = priorities.filter(
        p => p.tier === 'critical' && p.tag.startsWith('interest-')
      );

      expect(criticalInterest.length).toBe(INTEREST_TAGS.length);
    });

    it('Interest 태그가 있으면 critical이 아니어야 함', () => {
      const withInterest = {
        personality: {},
        decision: {},
        relationship: {},
        interest: { 'interest-love': 10, 'interest-cat': 5 },
        lifestyle: {},
      };

      const priorities = getTagPriorities(withInterest);
      const lovePriority = priorities.find(p => p.tag === 'interest-love');
      const catPriority = priorities.find(p => p.tag === 'interest-cat');

      expect(lovePriority?.tier).not.toBe('critical');
      expect(catPriority?.tier).not.toBe('critical');
    });
  });

  describe('getRecommendedTags', () => {
    it('love 카테고리에 interest-love를 필수로 포함해야 함', () => {
      const emptyUsage = {
        personality: {},
        decision: {},
        relationship: {},
        interest: {},
        lifestyle: {},
      };

      const recs = getRecommendedTags('love', emptyUsage);
      expect(recs.required).toContain('interest-love');
    });
  });

  describe('CONTENT_GENERATION_GUIDELINES', () => {
    it('VS Poll은 personality와 decision을 필수로 요구해야 함', () => {
      const vsPoll = CONTENT_GENERATION_GUIDELINES.vsPoll;
      expect(vsPoll.requiredCategories).toContain('personality');
      expect(vsPoll.requiredCategories).toContain('decision');
    });

    it('Situation Reaction은 3개 카테고리를 필수로 요구해야 함', () => {
      const reaction = CONTENT_GENERATION_GUIDELINES.situationReaction;
      expect(reaction.requiredCategories.length).toBeGreaterThanOrEqual(3);
    });
  });
});

// ============================================================================
// 3. 실제 콘텐츠의 Interest 태그 검증
// ============================================================================

describe('실제 콘텐츠 Interest 태그 검증', () => {
  describe('LOVE_VS_POLLS', () => {
    it('love 카테고리 poll에 interest-love가 포함되어야 함', () => {
      let hasInterestLove = 0;
      let totalWithInsightTags = 0;

      for (const poll of LOVE_VS_POLLS) {
        const optionATags = poll.optionA.insightTags;
        const optionBTags = poll.optionB.insightTags;

        if (optionATags || optionBTags) {
          totalWithInsightTags++;

          const aHasLove = optionATags?.interest?.includes('interest-love');
          const bHasLove = optionBTags?.interest?.includes('interest-love');

          if (aHasLove || bHasLove) {
            hasInterestLove++;
          }
        }
      }

      // 최소 50% 이상의 poll이 interest-love를 포함해야 함
      const ratio = hasInterestLove / totalWithInsightTags;
      expect(ratio).toBeGreaterThanOrEqual(0.5);
    });
  });

  describe('VS_POLLS', () => {
    it('Interest 태그를 가진 poll이 존재해야 함', () => {
      let pollsWithInterest = 0;

      for (const poll of VS_POLLS) {
        const optionATags = poll.optionA.insightTags;
        const optionBTags = poll.optionB.insightTags;

        const aHasInterest = optionATags?.interest && optionATags.interest.length > 0;
        const bHasInterest = optionBTags?.interest && optionBTags.interest.length > 0;

        if (aHasInterest || bHasInterest) {
          pollsWithInterest++;
        }
      }

      expect(pollsWithInterest).toBeGreaterThan(0);
    });

    it('각 카테고리별 poll이 해당 Interest 태그를 사용해야 함', () => {
      const categoryInterestMap: Record<string, Set<string>> = {};

      for (const poll of VS_POLLS) {
        const category = poll.category;
        if (!categoryInterestMap[category]) {
          categoryInterestMap[category] = new Set();
        }

        const aInterest = poll.optionA.insightTags?.interest || [];
        const bInterest = poll.optionB.insightTags?.interest || [];

        for (const tag of [...aInterest, ...bInterest]) {
          categoryInterestMap[category].add(tag);
        }
      }

      // lifestyle 카테고리가 있다면 interest-lifestyle을 사용해야 함
      if (categoryInterestMap['lifestyle']) {
        expect(categoryInterestMap['lifestyle'].has('interest-lifestyle')).toBe(true);
      }
    });
  });
});

// ============================================================================
// 4. Stage 해금 가능성 테스트
// ============================================================================

describe('Stage 해금 가능성', () => {
  it('Stage 4 해금을 위한 Interest 태그가 콘텐츠에 존재해야 함', () => {
    let totalInterestTags = 0;

    // LOVE_VS_POLLS 체크
    for (const poll of LOVE_VS_POLLS) {
      totalInterestTags += poll.optionA.insightTags?.interest?.length || 0;
      totalInterestTags += poll.optionB.insightTags?.interest?.length || 0;
    }

    // VS_POLLS 체크
    for (const poll of VS_POLLS) {
      totalInterestTags += poll.optionA.insightTags?.interest?.length || 0;
      totalInterestTags += poll.optionB.insightTags?.interest?.length || 0;
    }

    expect(totalInterestTags).toBeGreaterThan(0);
  });

  it('Stage 5 해금을 위한 Relationship 태그가 콘텐츠에 존재해야 함', () => {
    let totalRelationshipTags = 0;

    for (const poll of [...LOVE_VS_POLLS, ...VS_POLLS]) {
      totalRelationshipTags += poll.optionA.insightTags?.relationship?.length || 0;
      totalRelationshipTags += poll.optionB.insightTags?.relationship?.length || 0;
    }

    expect(totalRelationshipTags).toBeGreaterThan(0);
  });
});

// ============================================================================
// 5. 데이터 무결성 테스트
// ============================================================================

describe('데이터 무결성', () => {
  it('모든 insightTags의 태그가 유효해야 함', () => {
    const invalidTags: string[] = [];

    const checkTags = (tags: string[] | undefined, context: string) => {
      if (!tags) return;
      for (const tag of tags) {
        if (!VALID_INSIGHT_TAGS.has(tag)) {
          invalidTags.push(`${context}: ${tag}`);
        }
      }
    };

    for (const poll of [...LOVE_VS_POLLS, ...VS_POLLS]) {
      const aT = poll.optionA.insightTags;
      const bT = poll.optionB.insightTags;

      if (aT) {
        checkTags(aT.personality, `${poll.id} optionA personality`);
        checkTags(aT.decision, `${poll.id} optionA decision`);
        checkTags(aT.relationship, `${poll.id} optionA relationship`);
        checkTags(aT.interest, `${poll.id} optionA interest`);
        checkTags(aT.lifestyle, `${poll.id} optionA lifestyle`);
      }

      if (bT) {
        checkTags(bT.personality, `${poll.id} optionB personality`);
        checkTags(bT.decision, `${poll.id} optionB decision`);
        checkTags(bT.relationship, `${poll.id} optionB relationship`);
        checkTags(bT.interest, `${poll.id} optionB interest`);
        checkTags(bT.lifestyle, `${poll.id} optionB lifestyle`);
      }
    }

    expect(invalidTags).toHaveLength(0);
  });
});
