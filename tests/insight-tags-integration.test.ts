/**
 * 인사이트 태그 통합 테스트
 *
 * 다양한 콘텐츠 타입에서 InsightTags가 올바르게 추출되는지 검증
 */

import { describe, test, expect } from 'vitest';

import {
  REACTION_TAG_TO_INSIGHT,
  getInsightTagsFromReactionOption,
  type SituationReactionOption,
  type InsightTags,
  type ReactionTag,
} from '../src/data/content/types';

import {
  VALID_INSIGHT_TAGS,
  isValidInsightTag,
  type PersonalityTag,
  type DecisionTag,
  type RelationshipTag,
} from '../src/data/insight/insight-tags';

// ============================================================================
// 테스트 케이스 1: ReactionTag → InsightTags 자동 매핑
// ============================================================================

describe('ReactionTag → InsightTags 자동 매핑', () => {

  // 모든 ReactionTag가 매핑되어 있는지
  test('모든 ReactionTag가 REACTION_TAG_TO_INSIGHT에 매핑됨', () => {
    const allReactionTags: ReactionTag[] = [
      'cool', 'emotional', 'rational', 'avoidant',
      'confrontational', 'humorous', 'caring', 'passive'
    ];

    allReactionTags.forEach(tag => {
      expect(REACTION_TAG_TO_INSIGHT[tag]).toBeDefined();
      console.log(`✓ ${tag}:`, REACTION_TAG_TO_INSIGHT[tag]);
    });
  });

  // 매핑된 태그가 모두 유효한지
  test('매핑된 모든 태그가 insight-tags.ts에 정의됨', () => {
    Object.entries(REACTION_TAG_TO_INSIGHT).forEach(([reactionTag, insightTags]) => {
      // personality 태그 검증
      insightTags.personality?.forEach(tag => {
        expect(isValidInsightTag(tag)).toBe(true);
      });

      // decision 태그 검증
      insightTags.decision?.forEach(tag => {
        expect(isValidInsightTag(tag)).toBe(true);
      });

      // relationship 태그 검증
      insightTags.relationship?.forEach(tag => {
        expect(isValidInsightTag(tag)).toBe(true);
      });
    });
  });

  // 각 매핑에 최소 2개 태그가 있는지
  test('각 ReactionTag에 최소 2개 InsightTag 매핑', () => {
    Object.entries(REACTION_TAG_TO_INSIGHT).forEach(([reactionTag, insightTags]) => {
      const totalTags =
        (insightTags.personality?.length || 0) +
        (insightTags.decision?.length || 0) +
        (insightTags.relationship?.length || 0);

      expect(totalTags).toBeGreaterThanOrEqual(2);
      console.log(`✓ ${reactionTag}: ${totalTags}개 태그`);
    });
  });
});

// ============================================================================
// 테스트 케이스 2: getInsightTagsFromReactionOption 함수
// ============================================================================

describe('getInsightTagsFromReactionOption 함수', () => {

  // 기본 케이스: tag만 있는 경우
  test('기본 케이스 - tag만 있으면 자동 매핑 태그 반환', () => {
    const option: SituationReactionOption = {
      id: 'a',
      text: '침착하게 대응한다',
      emoji: '😎',
      tag: 'cool',
    };

    const result = getInsightTagsFromReactionOption(option);

    expect(result.personality).toContain('reserved');
    expect(result.personality).toContain('resilient');
    expect(result.decision).toContain('practical');
  });

  // 추가 태그 병합 케이스
  test('추가 태그 병합 - insightTags가 있으면 자동 매핑과 병합', () => {
    const option: SituationReactionOption = {
      id: 'b',
      text: '혼자 결정한다',
      emoji: '😤',
      tag: 'confrontational',
      insightTags: {
        decision: ['solo'],
        lifestyle: ['active'],
      },
    };

    const result = getInsightTagsFromReactionOption(option);

    // 자동 매핑 태그
    expect(result.relationship).toContain('competing');
    expect(result.relationship).toContain('assertive');
    expect(result.decision).toContain('direct');

    // 추가 태그
    expect(result.decision).toContain('solo');
    expect(result.lifestyle).toContain('active');
  });

  // 빈 insightTags 케이스
  test('빈 insightTags - 자동 매핑만 반환', () => {
    const option: SituationReactionOption = {
      id: 'c',
      text: '감정적으로 반응',
      emoji: '😢',
      tag: 'emotional',
      insightTags: {},
    };

    const result = getInsightTagsFromReactionOption(option);

    expect(result.personality).toContain('emotional');
    expect(result.personality).toContain('expressive');
    expect(result.personality).toContain('sensitive');
  });
});

// ============================================================================
// 테스트 케이스 3: 실제 상황 반응 데이터 시뮬레이션
// ============================================================================

describe('실제 상황 반응 시뮬레이션', () => {

  // 연애 카테고리 - 이별 상황
  test('연애 카테고리 - 이별 상황 반응', () => {
    const options: SituationReactionOption[] = [
      { id: 'a', text: '쿨하게 인정한다', emoji: '😎', tag: 'cool' },
      { id: 'b', text: '눈물이 난다', emoji: '😢', tag: 'emotional' },
      { id: 'c', text: '이유를 따진다', emoji: '🤔', tag: 'rational' },
      { id: 'd', text: '연락을 끊는다', emoji: '🚫', tag: 'avoidant' },
    ];

    const results = options.map(opt => ({
      option: opt.id,
      tag: opt.tag,
      insights: getInsightTagsFromReactionOption(opt),
    }));

    console.log('\n연애 카테고리 - 이별 상황:');
    results.forEach(r => {
      const allTags = [
        ...(r.insights.personality || []),
        ...(r.insights.decision || []),
        ...(r.insights.relationship || []),
      ];
      console.log(`  ${r.option}. ${r.tag} → [${allTags.join(', ')}]`);
    });

    // 각 옵션이 다른 성향을 반영하는지
    expect(results[0].insights.personality).toContain('reserved');
    expect(results[1].insights.personality).toContain('emotional');
    expect(results[2].insights.personality).toContain('logical');
    expect(results[3].insights.relationship).toContain('avoiding');
  });

  // 직장 카테고리 - 상사 갈등 상황
  test('직장 카테고리 - 상사 갈등 상황', () => {
    const options: SituationReactionOption[] = [
      { id: 'a', text: '정면 돌파한다', emoji: '💪', tag: 'confrontational' },
      { id: 'b', text: '우회적으로 말한다', emoji: '🎭', tag: 'passive' },
      { id: 'c', text: '유머로 넘긴다', emoji: '😄', tag: 'humorous' },
      { id: 'd', text: '팀원을 챙긴다', emoji: '🤝', tag: 'caring' },
    ];

    const results = options.map(opt => ({
      option: opt.id,
      tag: opt.tag,
      insights: getInsightTagsFromReactionOption(opt),
    }));

    console.log('\n직장 카테고리 - 상사 갈등:');
    results.forEach(r => {
      const allTags = [
        ...(r.insights.personality || []),
        ...(r.insights.decision || []),
        ...(r.insights.relationship || []),
      ];
      console.log(`  ${r.option}. ${r.tag} → [${allTags.join(', ')}]`);
    });

    // 다양한 관계 스타일 반영
    expect(results[0].insights.relationship).toContain('competing');
    expect(results[1].insights.relationship).toContain('accommodating');
    expect(results[2].insights.decision).toContain('indirect');
    expect(results[3].insights.personality).toContain('supportive');
  });
});

// ============================================================================
// 테스트 케이스 4: 모호한 케이스 검증
// ============================================================================

describe('모호한 케이스 검증', () => {

  // passive vs avoidant 구분
  test('passive vs avoidant - 미묘한 차이 검증', () => {
    const passive = getInsightTagsFromReactionOption({
      id: 'a', text: '그냥 따른다', emoji: '😶', tag: 'passive'
    });

    const avoidant = getInsightTagsFromReactionOption({
      id: 'b', text: '피한다', emoji: '🏃', tag: 'avoidant'
    });

    console.log('\npassive vs avoidant:');
    console.log('  passive:', passive);
    console.log('  avoidant:', avoidant);

    // 둘 다 reserved 포함
    expect(passive.personality).toContain('reserved');
    expect(avoidant.personality).toContain('reserved');

    // passive는 accommodating, avoidant는 avoiding
    expect(passive.relationship).toContain('accommodating');
    expect(avoidant.relationship).toContain('avoiding');
  });

  // cool vs rational 구분
  test('cool vs rational - 이성적 반응의 두 유형', () => {
    const cool = getInsightTagsFromReactionOption({
      id: 'a', text: '태연하게 넘긴다', emoji: '😎', tag: 'cool'
    });

    const rational = getInsightTagsFromReactionOption({
      id: 'b', text: '논리적으로 분석한다', emoji: '🧠', tag: 'rational'
    });

    console.log('\ncool vs rational:');
    console.log('  cool:', cool);
    console.log('  rational:', rational);

    // 둘 다 practical 포함
    expect(cool.decision).toContain('practical');
    expect(rational.decision).toContain('practical');

    // cool은 resilient, rational은 analytical
    expect(cool.personality).toContain('resilient');
    expect(rational.personality).toContain('analytical');
  });

  // 추가 태그로 모호함 해소
  test('추가 insightTags로 모호함 해소', () => {
    // 같은 caring이지만 다른 뉘앙스
    const caringTogether = getInsightTagsFromReactionOption({
      id: 'a', text: '같이 해결하자', emoji: '🤝', tag: 'caring',
      insightTags: { decision: ['together'] }
    });

    const caringSolo = getInsightTagsFromReactionOption({
      id: 'b', text: '내가 알아서 처리할게', emoji: '💪', tag: 'caring',
      insightTags: { decision: ['solo'] }
    });

    console.log('\ncaring with different styles:');
    console.log('  caring + together:', caringTogether);
    console.log('  caring + solo:', caringSolo);

    // 둘 다 supportive
    expect(caringTogether.personality).toContain('supportive');
    expect(caringSolo.personality).toContain('supportive');

    // 추가 태그로 구분
    expect(caringTogether.decision).toContain('together');
    expect(caringSolo.decision).toContain('solo');
  });
});

// ============================================================================
// 테스트 케이스 5: VS 투표와의 비교 (콘텐츠 타입별 차이)
// ============================================================================

describe('콘텐츠 타입별 InsightTags 처리 비교', () => {

  test('VS 투표 - 직접 insightTags 지정', () => {
    // VS 투표는 insightTags를 직접 지정
    const vsPollOption = {
      id: 'a' as const,
      text: '계획적으로',
      emoji: '📋',
      insightTags: {
        personality: ['planned', 'structured'] as PersonalityTag[],
        decision: ['safe'] as DecisionTag[],
      }
    };

    // 총 태그 수 검증
    const totalTags =
      (vsPollOption.insightTags.personality?.length || 0) +
      (vsPollOption.insightTags.decision?.length || 0);

    expect(totalTags).toBeGreaterThanOrEqual(3);
    console.log('\nVS 투표 태그:', vsPollOption.insightTags);
  });

  test('상황 반응 - ReactionTag 자동 변환', () => {
    // 상황 반응은 ReactionTag에서 자동 변환
    const situationOption: SituationReactionOption = {
      id: 'a',
      text: '계획적으로 대응',
      emoji: '📋',
      tag: 'rational', // 자동 변환됨
    };

    const result = getInsightTagsFromReactionOption(situationOption);

    const totalTags =
      (result.personality?.length || 0) +
      (result.decision?.length || 0) +
      (result.relationship?.length || 0);

    expect(totalTags).toBeGreaterThanOrEqual(2);
    console.log('상황 반응 자동 변환:', result);
  });

  test('퀴즈 - InsightTags 없음 (정답/오답 기반)', () => {
    // 퀴즈는 InsightTags 없음 - 정답/오답으로만 판단
    const quizOption = {
      id: 'a',
      text: '정답 선택지',
      isCorrect: true,
    };

    // 퀴즈에는 insightTags 필드가 없음
    expect((quizOption as any).insightTags).toBeUndefined();
    console.log('\n퀴즈: InsightTags 없음 (정답/오답 기반)');
  });
});

// ============================================================================
// 테스트 실행
// ============================================================================

console.log('\n========================================');
console.log('인사이트 태그 통합 테스트 시작');
console.log('========================================\n');
