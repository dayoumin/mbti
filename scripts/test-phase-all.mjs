/**
 * Phase 1, 2, 3 전체 기능 테스트
 * Node.js 직접 실행
 */

import { toPositiveFraming, applyPositiveFramingToTest } from '../src/utils/framing.ts';
import { extractTagsFromTestResult, TEST_TAG_MAPPINGS } from '../src/data/insight/test-tag-mappings.ts';
import { VALID_INSIGHT_TAGS } from '../src/data/insight/insight-tags.ts';

console.log('==================================================');
console.log('Phase 1, 2, 3 전체 기능 테스트');
console.log('==================================================\n');

let totalTests = 0;
let passedTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`✅ ${name}`);
    passedTests++;
  } catch (err) {
    console.log(`❌ ${name}`);
    console.log(`   ${err.message}`);
  }
}

function expect(actual) {
  return {
    toBe(expected) {
      if (actual !== expected) {
        throw new Error(`Expected "${expected}", got "${actual}"`);
      }
    },
    toContain(item) {
      if (!actual.includes(item)) {
        throw new Error(`Expected array to contain "${item}", got ${JSON.stringify(actual)}`);
      }
    },
    toBeGreaterThan(num) {
      if (actual <= num) {
        throw new Error(`Expected ${actual} to be greater than ${num}`);
      }
    },
    toBeDefined() {
      if (actual === undefined) {
        throw new Error('Expected value to be defined');
      }
    }
  };
}

console.log('📋 Phase 1: 긍정 프레이밍\n');

test('부정적 표현을 긍정적으로 변환', () => {
  expect(toPositiveFraming('엄격한 성격')).toBe('명확한 기준을 가진 성격');
  expect(toPositiveFraming('소극적인 태도')).toBe('신중하고 사려 깊은 태도');
  expect(toPositiveFraming('감정적인 반응')).toBe('공감 능력이 뛰어난 반응');
  expect(toPositiveFraming('논리적인 사고')).toBe('분석적인 사고');
});

test('조사가 포함된 표현도 변환', () => {
  expect(toPositiveFraming('엄격하고 냉정한')).toBe('명확한 기준을 가지고 이성적이고 객관적인');
});

test('전체 테스트 데이터에 적용', () => {
  const testData = {
    title: '성격 테스트',
    dimensions: {
      empathy: {
        name: '감정적',
        emoji: '💖',
        desc: '감정적인 성향'
      }
    },
    resultLabels: [
      {
        name: '엄격한 리더',
        desc: '소극적인 성향',
        interpretation: '논리적이고 현실적인',
        guide: '신중한 접근'
      }
    ]
  };

  const framed = applyPositiveFramingToTest(testData);

  expect(framed.dimensions.empathy.name).toBe('공감 능력이 뛰어난');
  expect(framed.resultLabels[0].name).toBe('명확한 기준을 가진 리더');
  expect(framed.resultLabels[0].desc).toBe('신중하고 사려 깊은 성향');
});

console.log('\n📋 Phase 2-3: 태그 매핑\n');

test('11개 모든 테스트 매핑 존재', () => {
  const expectedTests = [
    'human', 'cat', 'dog', 'idealType', 'conflictStyle',
    'coffee', 'plant', 'petMatch', 'rabbit', 'hamster', 'attachment'
  ];

  expectedTests.forEach(testId => {
    expect(TEST_TAG_MAPPINGS[testId]).toBeDefined();
    expect(TEST_TAG_MAPPINGS[testId].testId).toBe(testId);
  });
});

test('태그 추출 - HUMAN 테스트 (high/low)', () => {
  const dimensions = {
    inssa: 25,      // high (60% 이상)
    adventure: 8,   // low (40% 미만)
    empathy: 22,    // high
    plan: 20,       // high
    mental: 6       // low
  };

  const tags = extractTagsFromTestResult('human', dimensions);

  // high inssa
  expect(tags).toContain('extroverted');
  expect(tags).toContain('leading');

  // low adventure 또는 high plan에서 나오는 태그
  expect(tags).toContain('structured');

  // high empathy
  expect(tags).toContain('empathetic');

  // high plan
  expect(tags).toContain('organized');

  // 전체 태그 수 확인 (최소 10개 이상)
  expect(tags.length).toBeGreaterThan(10);
});

test('추출된 태그는 모두 유효한 InsightTag', () => {
  const dimensions = {
    inssa: 25,
    adventure: 8,
    empathy: 22,
    plan: 20,
    mental: 6
  };

  const tags = extractTagsFromTestResult('human', dimensions);

  tags.forEach(tag => {
    if (!VALID_INSIGHT_TAGS.has(tag)) {
      throw new Error(`Invalid tag: ${tag}`);
    }
  });
});

test('태그 카테고리별 분포 확인', () => {
  const dimensions = {
    inssa: 25,
    adventure: 8,
    empathy: 22,
    plan: 20,
    mental: 6
  };

  const tags = extractTagsFromTestResult('human', dimensions);

  // PersonalityTag 포함
  const hasPersonality = tags.some(t => ['extroverted', 'emotional', 'empathetic'].includes(t));
  if (!hasPersonality) throw new Error('No PersonalityTag found');

  // DecisionTag 포함
  const hasDecision = tags.some(t => ['analytical', 'planned'].includes(t));
  if (!hasDecision) throw new Error('No DecisionTag found');

  // LifestyleTag 포함
  const hasLifestyle = tags.some(t => ['organized', 'systematic'].includes(t));
  if (!hasLifestyle) throw new Error('No LifestyleTag found');
});

console.log('\n📋 통합 테스트\n');

test('전체 워크플로우: 데이터 → 긍정 프레이밍 → 태그 추출', () => {
  // 1. 부정적 표현이 있는 데이터
  const rawTestData = {
    title: '성격 테스트',
    dimensions: {
      empathy: {
        name: '감정적',
        emoji: '💖',
        desc: '감정적인 성향'
      }
    },
    resultLabels: [
      {
        name: '엄격한 리더',
        desc: '논리적이고 현실적인'
      }
    ]
  };

  // 2. Phase 1: 긍정 프레이밍
  const framedData = applyPositiveFramingToTest(rawTestData);
  expect(framedData.dimensions.empathy.name).toBe('공감 능력이 뛰어난');
  expect(framedData.resultLabels[0].name).toBe('명확한 기준을 가진 리더');

  // 3. Phase 2: 태그 추출
  const tags = extractTagsFromTestResult('human', {
    inssa: 25,
    adventure: 8,
    empathy: 22,
    plan: 20,
    mental: 6
  });
  expect(tags.length).toBeGreaterThan(0);
  expect(tags).toContain('extroverted');
  expect(tags).toContain('empathetic');
});

console.log('\n==================================================');
console.log(`결과: ${passedTests}/${totalTests} 테스트 통과`);
console.log('==================================================\n');

if (passedTests === totalTests) {
  console.log('✅ 모든 테스트 통과! Phase 1, 2, 3 검증 완료.\n');
  process.exit(0);
} else {
  console.log(`❌ ${totalTests - passedTests}개 테스트 실패\n`);
  process.exit(1);
}
