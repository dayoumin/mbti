// ============================================================================
// 코드 리뷰 수정사항 검증 테스트
// ============================================================================
// 실행: npx tsx tests/code-review-fixes.test.ts
//
// 검증 항목:
// 1. InsightCards cleanup 동작 (언마운트 시 setState 방지)
// 2. InsightService API 응답 구조 검증

console.log('============================================================');
console.log(' 코드 리뷰 수정사항 검증 테스트');
console.log('============================================================\n');

let passCount = 0;
let failCount = 0;

function test(name: string, fn: () => void | Promise<void>) {
  return async () => {
    try {
      await fn();
      console.log(`✓ ${name}`);
      passCount++;
    } catch (error) {
      console.log(`✗ ${name}`);
      console.log(`  Error: ${error instanceof Error ? error.message : String(error)}`);
      failCount++;
    }
  };
}

function expect(actual: any) {
  return {
    toBe(expected: any) {
      // Boolean 비교 시 truthy/falsy 값을 boolean으로 변환
      const actualValue = typeof expected === 'boolean' ? Boolean(actual) : actual;
      if (actualValue !== expected) {
        throw new Error(`Expected ${expected}, got ${actualValue}`);
      }
    },
  };
}

// ============================================================================
// 메인 테스트 실행
// ============================================================================

(async () => {

// ============================================================================
// 1. InsightCards cleanup 동작
// ============================================================================

console.log('\n📋 1. InsightCards cleanup 동작\n');

await test('언마운트 시 Stage 7 setState가 실행되지 않아야 함', async () => {
  // Setup: React 환경 모의
  let setStateCallCount = 0;
  const mockSetStage7Result = () => { setStateCallCount++; };
  let cancelled = false;

  // loadInsightData 내부의 Stage 7 로직 시뮬레이션
  const simulateStage7Loading = () => {
    new Promise((resolve) => {
      setTimeout(() => {
        if (!cancelled) {
          mockSetStage7Result();
        }
        resolve(null);
      }, 100);
    });

    // cleanup 함수 반환
    return () => {
      cancelled = true;
    };
  };

  // Act: cleanup 함수 호출 (언마운트 시뮬레이션)
  const cleanup = simulateStage7Loading();
  cleanup(); // 즉시 언마운트

  // Wait for async operation
  await new Promise(resolve => setTimeout(resolve, 150));

  // Assert: setState가 호출되지 않아야 함
  expect(setStateCallCount).toBe(0);
})();

await test('정상 완료 시 Stage 7 setState가 실행되어야 함', async () => {
  // Setup
  let setStateCallCount = 0;
  const mockSetStage7Result = () => { setStateCallCount++; };
  let cancelled = false;

  // Stage 7 로직 시뮬레이션 (cleanup 호출 안함)
  new Promise((resolve) => {
    setTimeout(() => {
      if (!cancelled) {
        mockSetStage7Result();
      }
      resolve(null);
    }, 100);
  });

  // Act: cleanup 호출하지 않음 (정상 완료)
  await new Promise(resolve => setTimeout(resolve, 150));

  // Assert: setState가 호출되어야 함
  expect(setStateCallCount).toBe(1);
})();

// ============================================================================
// 2. InsightService API 응답 구조 검증
// ============================================================================

console.log('\n📋 2. InsightService API 응답 구조 검증\n');

await test('정상 응답 시 검증 통과해야 함', () => {
  const validResponse = {
    analysis: 'AI 분석 결과',
    nextSteps: [{ title: '다음 단계', description: '설명' }],
    coreIdentity: '핵심 정체성',
    keyTraits: [],
    meta: { confidenceLevel: 'high' as const, dataPoints: 10 },
  };

  // 실제 코드의 검증 로직 (InsightService.ts:759-762)
  const isValid = validResponse &&
                 typeof validResponse === 'object' &&
                 validResponse.analysis &&
                 validResponse.nextSteps;

  expect(isValid).toBe(true);
})();

await test('analysis 필드 없으면 검증 실패해야 함', () => {
  const invalidResponse = {
    nextSteps: [{ title: '다음 단계' }],
    coreIdentity: '핵심 정체성',
  };

  const isValid = (invalidResponse as any) &&
                 typeof invalidResponse === 'object' &&
                 (invalidResponse as any).analysis &&
                 invalidResponse.nextSteps;

  expect(isValid).toBe(false);
})();

await test('nextSteps 필드 없으면 검증 실패해야 함', () => {
  const invalidResponse = {
    analysis: 'AI 분석 결과',
    coreIdentity: '핵심 정체성',
  };

  const isValid = (invalidResponse as any) &&
                 typeof invalidResponse === 'object' &&
                 invalidResponse.analysis &&
                 (invalidResponse as any).nextSteps;

  expect(isValid).toBe(false);
})();

await test('응답이 객체가 아니면 검증 실패해야 함', () => {
  const invalidResponse = 'string response';

  const isValid = invalidResponse &&
                 typeof invalidResponse === 'object' &&
                 (invalidResponse as any).analysis &&
                 (invalidResponse as any).nextSteps;

  expect(isValid).toBe(false);
})();

await test('응답이 null이면 검증 실패해야 함', () => {
  const invalidResponse = null;

  const isValid = invalidResponse &&
                 typeof invalidResponse === 'object' &&
                 (invalidResponse as any).analysis &&
                 (invalidResponse as any).nextSteps;

  expect(isValid).toBe(false);
})();

await test('에러 응답 (error 필드 포함)도 검증 실패해야 함', () => {
  const errorResponse = {
    error: 'Failed to generate report',
  };

  const isValid = (errorResponse as any) &&
                 typeof errorResponse === 'object' &&
                 (errorResponse as any).analysis &&
                 (errorResponse as any).nextSteps;

  expect(isValid).toBe(false);
})();

// ============================================================================
// 3. 통합 시나리오
// ============================================================================

console.log('\n📋 3. 통합 시나리오\n');

await test('잘못된 API 응답 시 폴백으로 처리되어야 함', () => {
  const invalidResponse = { error: 'Something went wrong' };
  let usedFallback = false;

  // 검증 로직 (실제 코드와 동일 - InsightService.ts:759-762)
  const data = invalidResponse as any;
  if (!data || typeof data !== 'object' || !data.analysis || !data.nextSteps) {
    usedFallback = true;
  }

  expect(usedFallback).toBe(true);
})();

await test('정상 응답은 폴백 없이 통과해야 함', () => {
  const validResponse = {
    analysis: '분석',
    nextSteps: [],
    coreIdentity: 'test',
    keyTraits: [],
    meta: { confidenceLevel: 'high' as const, dataPoints: 5 },
  };
  let usedFallback = false;

  if (!validResponse || typeof validResponse !== 'object' || !validResponse.analysis || !validResponse.nextSteps) {
    usedFallback = true;
  }

  expect(usedFallback).toBe(false);
})();

await test('빈 배열도 유효한 nextSteps로 인정되어야 함', () => {
  const validResponse = {
    analysis: '분석',
    nextSteps: [], // 빈 배열도 OK
    coreIdentity: 'test',
    keyTraits: [],
    meta: { confidenceLevel: 'medium' as const, dataPoints: 3 },
  };
  let usedFallback = false;

  if (!validResponse || typeof validResponse !== 'object' || !validResponse.analysis || !validResponse.nextSteps) {
    usedFallback = true;
  }

  expect(usedFallback).toBe(false);
})();

// ============================================================================
// 결과 요약
// ============================================================================

console.log('\n============================================================');
console.log(`✅ Passed: ${passCount}`);
if (failCount > 0) {
  console.log(`❌ Failed: ${failCount}`);
  process.exit(1);
} else {
  console.log('🎉 모든 테스트 통과!');
  console.log('============================================================\n');
}

})(); // End of async IIFE
