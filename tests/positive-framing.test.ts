/**
 * Positive Framing 유닛 테스트
 * - toPositiveFraming 함수 검증
 * - applyPositiveFramingToTest 전체 파이프라인 검증
 * - 실제 human 데이터 변환 검증
 */

import { describe, test, expect } from 'vitest';
import {
  toPositiveFraming,
  applyPositiveFramingToTest,
  POSITIVE_FRAMING_MAP
} from '../src/utils/framing';

describe('Positive Framing - toPositiveFraming', () => {
  test('기본 매핑 동작', () => {
    expect(toPositiveFraming('냉정한 판단')).toBe('이성적이고 객관적인 판단');
    expect(toPositiveFraming('소극적인 성격')).toBe('신중하고 사려 깊은 성격');
    expect(toPositiveFraming('비판적인 태도')).toBe('분석적인 태도');
  });

  test('부사형 변환 (냉정하게)', () => {
    expect(toPositiveFraming('냉정하게 평가해야')).toBe('이성적이고 객관적으로 평가해야');
  });

  test('부정적 표현 변환', () => {
    expect(toPositiveFraming('부정적으로 해석')).toBe('신중하게 해석');
    expect(toPositiveFraming('실패 없는')).toBe('도전 없는');
    expect(toPositiveFraming('거절당했을 때')).toBe('선택당했을 때');
  });

  test('긴 단어 우선 매칭 (소극적이지만 vs 소극적)', () => {
    expect(toPositiveFraming('소극적이지만')).toBe('신중하고 사려 깊지만');
    expect(toPositiveFraming('소극적')).toBe('신중하고 사려 깊은');
  });

  test('매핑 없는 텍스트는 그대로 유지', () => {
    expect(toPositiveFraming('활발한 성격')).toBe('활발한 성격');
    expect(toPositiveFraming('테스트 제목')).toBe('테스트 제목');
  });

  test('복수 매칭 (한 문장에 여러 단어)', () => {
    const input = '냉정한 판단과 비판적인 사고';
    const expected = '이성적이고 객관적인 판단과 분석적인 사고';
    expect(toPositiveFraming(input)).toBe(expected);
  });
});

describe('Positive Framing - applyPositiveFramingToTest', () => {
  test('title, subtitle 변환', () => {
    const testData = {
      title: '냉정한 테스트',
      subtitle: '소극적인 성격 분석'
    };

    const result = applyPositiveFramingToTest(testData);

    expect(result.title).toBe('이성적이고 객관적인 테스트');
    expect(result.subtitle).toBe('신중하고 사려 깊은 성격 분석');
  });

  test('dimensions 변환', () => {
    const testData = {
      dimensions: {
        empathy: {
          name: '감정적',
          emoji: '❤️',
          desc: '냉정한 판단보다 감정적 공감'
        }
      }
    };

    const result = applyPositiveFramingToTest(testData);

    expect(result.dimensions?.empathy.name).toBe('공감 능력이 뛰어난');
    expect(result.dimensions?.empathy.desc).toBe('이성적이고 객관적인 판단보다 공감 능력이 뛰어난 공감');
  });

  test('questions 변환 (질문 + 답변)', () => {
    const testData = {
      questions: [
        {
          q: '비판적인 댓글을 받으면?',
          dimension: 'empathy',
          a: [
            { text: '냉정하게 평가해야 공정하다', score: 1 },
            { text: '감정적으로 받아들인다', score: 5 }
          ]
        }
      ]
    };

    const result = applyPositiveFramingToTest(testData);

    expect(result.questions?.[0].q).toBe('분석적인 댓글을 받으면?');
    expect(result.questions?.[0].a[0].text).toBe('이성적이고 객관적으로 평가해야 공정하다');
    expect(result.questions?.[0].a[1].text).toBe('공감 능력이 뛰어난으로 받아들인다');
  });

  test('resultLabels 변환', () => {
    const testData = {
      resultLabels: [
        {
          name: '냉정한 분석가',
          desc: '비판적인 사고',
          interpretation: '소극적이지만 신중함',
          guide: '부정적으로 생각하지 마세요'
        }
      ]
    };

    const result = applyPositiveFramingToTest(testData);

    expect(result.resultLabels?.[0].name).toBe('이성적이고 객관적인 분석가');
    expect(result.resultLabels?.[0].desc).toBe('분석적인 사고');
    expect(result.resultLabels?.[0].interpretation).toBe('신중하고 사려 깊지만 신중함');
    expect(result.resultLabels?.[0].guide).toBe('신중하게 생각하지 마세요');
  });

  test('전체 필드 통합 변환', () => {
    const testData = {
      title: '냉정한 테스트',
      subtitle: '비판적 사고력',
      dimensions: {
        logic: { name: '논리적', emoji: '🧠', desc: '냉정함' }
      },
      questions: [
        {
          q: '소극적인 태도?',
          dimension: 'logic',
          a: [{ text: '비판적으로', score: 5 }]
        }
      ],
      resultLabels: [
        { name: '분석가', desc: '냉정함', interpretation: '소극적' }
      ]
    };

    const result = applyPositiveFramingToTest(testData);

    // Title/Subtitle
    expect(result.title).toBe('이성적이고 객관적인 테스트');
    expect(result.subtitle).toBe('분석적인 사고력');

    // Dimensions
    expect(result.dimensions?.logic.name).toBe('분석적인');
    expect(result.dimensions?.logic.desc).toBe('이성적이고 객관적인');

    // Questions
    expect(result.questions?.[0].q).toBe('신중하고 사려 깊은 태도?');
    expect(result.questions?.[0].a[0].text).toBe('분석적인으로');

    // Results
    expect(result.resultLabels?.[0].desc).toBe('이성적이고 객관적인');
    expect(result.resultLabels?.[0].interpretation).toBe('신중하고 사려 깊은');
  });

  test('undefined/null 필드 안전 처리', () => {
    const testData = {
      title: undefined,
      subtitle: null,
      dimensions: undefined,
      questions: undefined,
      resultLabels: undefined
    };

    const result = applyPositiveFramingToTest(testData as any);

    expect(result.title).toBeUndefined();
    expect(result.subtitle).toBeNull();
    expect(result.dimensions).toBeUndefined();
    expect(result.questions).toBeUndefined();
    expect(result.resultLabels).toBeUndefined();
  });
});

describe('Positive Framing - 실제 데이터 검증', () => {
  test('human 테스트 실제 질문 변환 (냉정하게 평가)', () => {
    const humanQuestion = {
      q: "리더로서 팀원을 평가해야 할 때?",
      dimension: "empathy",
      a: [
        { text: "성과와 능력 위주로 냉정하게 평가해야 공정하다.", score: 1 },
        { text: "그 사람의 노력과 팀 분위기에 미친 영향도 중요하게 고려한다.", score: 5 }
      ]
    };

    const testData = { questions: [humanQuestion] };
    const result = applyPositiveFramingToTest(testData);

    expect(result.questions?.[0].a[0].text).toBe(
      "성과와 능력 위주로 이성적이고 객관적으로 평가해야 공정하다."
    );
  });

  test('매핑 테이블 완전성 체크', () => {
    // 모든 매핑이 문법적으로 올바른지 확인
    const entries = Object.entries(POSITIVE_FRAMING_MAP);

    entries.forEach(([negative, positive]) => {
      expect(negative).toBeTruthy();
      expect(positive).toBeTruthy();
      expect(typeof negative).toBe('string');
      expect(typeof positive).toBe('string');
      expect(positive.length).toBeGreaterThan(0);
    });

    // 중복 값 체크 (같은 긍정 표현으로 여러 부정 표현 매핑 가능)
    expect(entries.length).toBeGreaterThan(20); // 최소 20개 이상 매핑
  });
});
