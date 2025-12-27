/**
 * ResultService 최적화 검증 스크립트
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const resultServicePath = path.resolve(__dirname, '../src/services/ResultService.ts');
const retentionSystemPath = path.resolve(__dirname, '../src/app/dashboard/components/RetentionSystem.tsx');

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║   최적화 코드 리뷰 (Code Review for Optimization)   ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`\x1b[32m✓ ${name}\x1b[0m`);
    passed++;
  } catch (error) {
    console.log(`\x1b[31m✗ ${name}\x1b[0m`);
    console.log(`  \x1b[31m${error.message}\x1b[0m`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

// 파일 읽기
const resultServiceCode = fs.readFileSync(resultServicePath, 'utf-8');
const retentionSystemCode = fs.readFileSync(retentionSystemPath, 'utf-8');

console.log('📝 ResultService 최적화 검증\n');

test('ResultService.getIncompleteTests()에 optional 파라미터 추가됨', () => {
  const match = resultServiceCode.match(/async getIncompleteTests\((.*?)\)/);
  assert(match, 'getIncompleteTests 메서드를 찾을 수 없음');

  const params = match[1];
  assert(params.includes('completedTests'), 'completedTests 파라미터 없음');
  assert(params.includes('?:'), 'optional 파라미터가 아님');
  assert(params.includes('string[]'), 'string[] 타입이 아님');
});

test('getIncompleteTests 내부에서 nullish coalescing 사용', () => {
  assert(
    resultServiceCode.includes('completedTests ?? await this.getCompletedTests()'),
    'nullish coalescing 패턴이 없음'
  );
});

console.log('\n📝 RetentionSystem 최적화 검증\n');

test('RetentionSystem에서 최적화된 방식으로 호출', () => {
  assert(
    retentionSystemCode.includes('const completedTests = await resultService.getCompletedTests()'),
    'completedTests 변수가 없음'
  );
  assert(
    retentionSystemCode.includes('await resultService.getIncompleteTests(completedTests)'),
    'getIncompleteTests에 completedTests를 전달하지 않음'
  );
});

test('RetentionSystem에 unmount guard 추가됨', () => {
  assert(retentionSystemCode.includes('let mounted = true'), 'mounted 플래그 선언 없음');
  assert(retentionSystemCode.includes('if (!mounted) return'), 'mounted 체크 없음');
  assert(
    retentionSystemCode.includes('return () => {\n      mounted = false'),
    'cleanup 함수에서 mounted = false 설정 없음'
  );
});

test('setLoading도 mounted 체크', () => {
  assert(
    retentionSystemCode.includes('if (mounted) {\n          setLoading(false)'),
    'setLoading 호출 시 mounted 체크 없음'
  );
});

console.log('\n📝 통합 검증\n');

test('[통합] 최적화 패턴 모두 적용', () => {
  // ResultService 최적화
  assert(
    /async getIncompleteTests\(completedTests\?: string\[\]\)/.test(resultServiceCode),
    'ResultService 시그니처 불일치'
  );
  assert(
    resultServiceCode.includes('completedTests ?? await this.getCompletedTests()'),
    'nullish coalescing 없음'
  );

  // RetentionSystem 최적화
  const hasOptimizedCall =
    retentionSystemCode.includes('const completedTests = await resultService.getCompletedTests()') &&
    retentionSystemCode.includes('await resultService.getIncompleteTests(completedTests)');
  assert(hasOptimizedCall, 'RetentionSystem에서 최적화 패턴 미사용');

  // unmount guard
  const hasUnmountGuard =
    retentionSystemCode.includes('let mounted = true') &&
    retentionSystemCode.includes('if (!mounted) return') &&
    retentionSystemCode.includes('mounted = false');
  assert(hasUnmountGuard, 'unmount guard 패턴 미사용');
});

test('[검증] Before 방식(비효율적 패턴) 제거됨', () => {
  const liveMonitoringSectionMatch = retentionSystemCode.match(/const LiveMonitoringSection[\s\S]*?^};/m);
  assert(liveMonitoringSectionMatch, 'LiveMonitoringSection 컴포넌트를 찾을 수 없음');

  const sectionCode = liveMonitoringSectionMatch[0];
  const codeWithoutComments = sectionCode.replace(/\/\*[\s\S]*?\*\/|\/\/.*/g, '');

  // getIncompleteTests()를 파라미터 없이 호출하는 비효율적 패턴 검사
  const hasBadPattern = /getCompletedTests\(\)[\s\S]{0,200}getIncompleteTests\(\)/.test(codeWithoutComments);

  assert(!hasBadPattern, 'Before 방식(비효율적 패턴)이 아직 남아있음');
});

console.log('\n═══════════════════════════════════════════════════════');
console.log(`\n📊 결과: ${passed} passed, ${failed} failed\n`);

if (failed > 0) {
  console.log('\x1b[31m❌ 일부 테스트 실패\x1b[0m\n');
  process.exit(1);
} else {
  console.log('\x1b[32m✅ 모든 최적화 검증 통과!\x1b[0m\n');

  // 상세 정보
  console.log('🎯 적용된 최적화:');
  console.log('  1. getIncompleteTests()에 optional 파라미터 추가');
  console.log('  2. 중복 페칭 제거 (getMyResults 호출 2회 → 1회)');
  console.log('  3. unmount guard 추가 (setState 경고 방지)');
  console.log('  4. finally 블록에서도 mounted 체크\n');

  console.log('💡 예상 효과:');
  console.log('  - DB/Storage 접근 50% 감소');
  console.log('  - React setState 경고 제거');
  console.log('  - Best Practice 준수\n');
}
