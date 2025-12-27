/**
 * 성능 최적화 코드 리뷰 테스트 (Node.js 실행)
 * 2025-12-27
 */

import { toPositiveFraming, applyPositiveFramingToTest } from '../src/utils/framing.ts';

console.log('==================================================');
console.log('성능 최적화 코드 리뷰 테스트');
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
    toContain(substring) {
      if (!String(actual).includes(substring)) {
        throw new Error(`Expected to contain "${substring}", got "${actual}"`);
      }
    },
    toBeLessThan(num) {
      if (actual >= num) {
        throw new Error(`Expected ${actual} to be less than ${num}`);
      }
    },
    not: {
      toContain(substring) {
        if (String(actual).includes(substring)) {
          throw new Error(`Expected NOT to contain "${substring}", got "${actual}"`);
        }
      }
    }
  };
}

// ============================================================================
// 1. 기본 변환 정확성
// ============================================================================
console.log('📋 1. 기본 변환 정확성\n');

test('단일 단어 변환 - 엄격한', () => {
  expect(toPositiveFraming('엄격한')).toBe('명확한 기준을 가진');
});

test('단일 단어 변환 - 소극적', () => {
  expect(toPositiveFraming('소극적')).toBe('신중하고 사려 깊은');
});

test('단일 단어 변환 - 감정적', () => {
  expect(toPositiveFraming('감정적')).toBe('공감 능력이 뛰어난');
});

test('조사 포함 변환 - 엄격하고', () => {
  expect(toPositiveFraming('엄격하고')).toBe('명확한 기준을 가지고');
});

test('조사 포함 변환 - 소극적이지만', () => {
  expect(toPositiveFraming('소극적이지만')).toBe('신중하고 사려 깊지만');
});

test('문장 내 다중 변환', () => {
  const input = '엄격하고 냉정한 성격';
  const expected = '명확한 기준을 가지고 이성적이고 객관적인 성격';
  expect(toPositiveFraming(input)).toBe(expected);
});

test('부정적 표현 변환 - 비판적인', () => {
  expect(toPositiveFraming('비판적인')).toBe('분석적인');
});

test('부정적 표현 변환 - 실패/거절', () => {
  expect(toPositiveFraming('실패')).toBe('도전');
  expect(toPositiveFraming('거절')).toBe('선택');
});

// ============================================================================
// 2. 엣지 케이스
// ============================================================================
console.log('\n📋 2. 엣지 케이스\n');

test('빈 문자열 처리', () => {
  expect(toPositiveFraming('')).toBe('');
});

test('변환 대상 없는 텍스트', () => {
  const input = '평범한 일상적인 문장입니다.';
  expect(toPositiveFraming(input)).toBe(input);
});

test('긴 패턴 우선 매칭 (소극적이지만 vs 소극적)', () => {
  const input = '소극적이지만 신중한 사람';
  const result = toPositiveFraming(input);
  expect(result).toBe('신중하고 사려 깊지만 사려 깊은 사람');
});

test('정규식 특수 문자 - 괄호', () => {
  const input = '엄격한 (매우 엄격한)';
  const result = toPositiveFraming(input);
  expect(result).toContain('명확한 기준을 가진');
});

test('정규식 특수 문자 - 점', () => {
  const input = '엄격한. 소극적인.';
  const result = toPositiveFraming(input);
  expect(result).toContain('명확한 기준을 가진');
  expect(result).toContain('신중하고 사려 깊은');
});

test('중복 변환 방지', () => {
  const result = toPositiveFraming('엄격한');
  // "명확한 기준을 가진을 가진" 같은 중복 변환 없음
  expect(result).not.toContain('가진을 가진');
});

// ============================================================================
// 3. 전체 테스트 데이터 적용
// ============================================================================
console.log('\n📋 3. 전체 테스트 데이터 적용\n');

test('dimensions 변환', () => {
  const testData = {
    dimensions: {
      empathy: {
        name: '감정적',
        emoji: '💖',
        desc: '감정적인 성향'
      }
    }
  };

  const framed = applyPositiveFramingToTest(testData);
  expect(framed.dimensions.empathy.name).toBe('공감 능력이 뛰어난');
  expect(framed.dimensions.empathy.desc).toBe('공감 능력이 뛰어난 성향');
});

test('questions 변환', () => {
  const testData = {
    questions: [
      {
        q: '엄격한 규칙을 따르는 편인가요?',
        dimension: 'empathy',
        a: [
          { text: '소극적인 태도', score: 1 },
          { text: '냉정한 태도', score: 5 }
        ]
      }
    ]
  };

  const framed = applyPositiveFramingToTest(testData);
  expect(framed.questions[0].q).toContain('명확한 기준을 가진');
  expect(framed.questions[0].a[0].text).toBe('신중하고 사려 깊은 태도');
  expect(framed.questions[0].a[1].text).toBe('이성적이고 객관적인 태도');
});

test('resultLabels 변환', () => {
  const testData = {
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
  expect(framed.resultLabels[0].name).toBe('명확한 기준을 가진 리더');
  expect(framed.resultLabels[0].desc).toBe('신중하고 사려 깊은 성향');
  expect(framed.resultLabels[0].guide).toBe('사려 깊은 접근');
});

// ============================================================================
// 4. 성능 측정
// ============================================================================
console.log('\n📋 4. 성능 측정\n');

test('1000번 호출 성능 (< 100ms)', () => {
  const input = '엄격하고 냉정한 성격으로 소극적이지만 논리적인 사고를 하는 사람';

  const start = Date.now();
  for (let i = 0; i < 1000; i++) {
    toPositiveFraming(input);
  }
  const elapsed = Date.now() - start;

  console.log(`   ⏱️  1000번 호출: ${elapsed}ms`);
  expect(elapsed).toBeLessThan(100);
});

test('전체 테스트 데이터 변환 성능 (38개 테스트)', () => {
  const mockTestData = {
    title: '엄격한 테스트',
    dimensions: {
      dim1: { name: '감정적', emoji: '💖', desc: '감정적인 성향' },
      dim2: { name: '냉정한', emoji: '❄️', desc: '냉정한 태도' }
    },
    questions: Array(12).fill(null).map((_, i) => ({
      q: `엄격한 질문 ${i + 1}`,
      dimension: 'dim1',
      a: [
        { text: '소극적인', score: 1 },
        { text: '냉정한', score: 5 }
      ]
    })),
    resultLabels: Array(8).fill(null).map((_, i) => ({
      name: `엄격한 결과 ${i + 1}`,
      desc: '소극적인 설명',
      interpretation: '논리적이고 현실적인'
    }))
  };

  const start = Date.now();
  for (let i = 0; i < 38; i++) {
    applyPositiveFramingToTest(mockTestData);
  }
  const elapsed = Date.now() - start;

  console.log(`   ⏱️  38개 테스트 변환: ${elapsed}ms`);
  expect(elapsed).toBeLessThan(100);
});

// ============================================================================
// 5. Before vs After 동일성
// ============================================================================
console.log('\n📋 5. Before vs After 동일성\n');

test('최적화 전후 결과 동일 - 케이스 1', () => {
  expect(toPositiveFraming('엄격한 성격')).toBe('명확한 기준을 가진 성격');
});

test('최적화 전후 결과 동일 - 케이스 2', () => {
  expect(toPositiveFraming('소극적이지만 신중한')).toBe('신중하고 사려 깊지만 사려 깊은');
});

test('최적화 전후 결과 동일 - 케이스 3', () => {
  expect(toPositiveFraming('감정적인 반응')).toBe('공감 능력이 뛰어난 반응');
});

test('최적화 전후 결과 동일 - 케이스 4', () => {
  expect(toPositiveFraming('비판적인 태도로 부정적인 평가')).toBe('분석적인 태도로 신중한 평가');
});

test('최적화 전후 결과 동일 - 케이스 5', () => {
  expect(toPositiveFraming('실패를 거절하는 사람')).toBe('도전을 선택하는 사람');
});

// ============================================================================
// 6. 코드 리뷰 체크리스트
// ============================================================================
console.log('\n📋 6. 코드 리뷰 체크리스트\n');

test('✅ 길이 순 정렬 (긴 패턴 우선)', () => {
  const result = toPositiveFraming('소극적이지만');
  expect(result).toBe('신중하고 사려 깊지만');
});

test('✅ 전역 플래그 (g flag) 정상 작동', () => {
  const result = toPositiveFraming('엄격한 사람은 엄격한 기준을 가진다');
  const count = (result.match(/명확한 기준을 가진/g) || []).length;
  if (count !== 2) {
    throw new Error(`Expected 2 matches, got ${count}`);
  }
});

test('✅ 순수 함수 (입력 동일 → 출력 동일)', () => {
  const input = '엄격한';
  const result1 = toPositiveFraming(input);
  const result2 = toPositiveFraming(input);
  expect(result1).toBe(result2);
});

test('✅ 타입 안전성 (string 반환)', () => {
  const result = toPositiveFraming('test');
  if (typeof result !== 'string') {
    throw new Error('Expected string type');
  }
});

console.log('\n==================================================');
console.log(`결과: ${passedTests}/${totalTests} 테스트 통과`);
console.log('==================================================\n');

if (passedTests === totalTests) {
  console.log('✅ 모든 테스트 통과! 성능 최적화 검증 완료.\n');
  process.exit(0);
} else {
  console.log(`❌ ${totalTests - passedTests}개 테스트 실패\n`);
  process.exit(1);
}
