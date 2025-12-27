/**
 * 코드 리뷰 수정사항 검증 테스트
 *
 * 검증 항목:
 * 1. InsightService.syncStatsFromTurso() 존재 및 호출 순서
 * 2. InsightService.buildStage1Summary() Turso 우선 조회
 * 3. InsightService testType 필터 강화
 * 4. ResultService 캐싱 구현
 */

const fs = require('fs');
const path = require('path');

// ========== 파일 읽기 ==========

const insightServicePath = path.resolve(__dirname, '../../src/services/InsightService.ts');
const resultServicePath = path.resolve(__dirname, '../../src/services/ResultService.ts');

const insightServiceContent = fs.readFileSync(insightServicePath, 'utf-8');
const resultServiceContent = fs.readFileSync(resultServicePath, 'utf-8');

// ========== 테스트 케이스 ==========

let passCount = 0;
let failCount = 0;

function test(name, condition, details = '') {
  if (condition) {
    console.log(`✅ PASS: ${name}`);
    passCount++;
  } else {
    console.error(`❌ FAIL: ${name}`);
    if (details) console.error(`   ${details}`);
    failCount++;
  }
}

console.log('==================================================');
console.log('코드 리뷰 수정사항 검증 테스트');
console.log('==================================================\n');

// ========== 1. InsightService 검증 ==========

console.log('📋 InsightService.ts 검증\n');

// 1-1. syncStatsFromTurso() 메서드 존재
test(
  'syncStatsFromTurso() 메서드 존재',
  insightServiceContent.includes('private async syncStatsFromTurso()')
);

// 1-2. syncUnlocksOnLoad()에서 syncStatsFromTurso() 호출
test(
  'syncUnlocksOnLoad()에서 syncStatsFromTurso() 호출',
  insightServiceContent.includes('await this.syncStatsFromTurso();')
);

// 1-3. syncStatsFromTurso() → checkAndUnlockStages() 호출 순서
const syncOrderRegex = /await this\.syncStatsFromTurso\(\);[\s\S]*?await this\.checkAndUnlockStages\(\);/;
test(
  'syncStatsFromTurso() → checkAndUnlockStages() 호출 순서',
  syncOrderRegex.test(insightServiceContent),
  '동기화 후 unlock 체크 순서 확인 필요'
);

// 1-4. testType 필터 강화 (빈 문자열 제외)
const testTypeFilterRegex = /r\.testType\s*&&\s*r\.testType\.trim\(\)/;
test(
  'testType 필터 강화 (빈 문자열 제외)',
  testTypeFilterRegex.test(insightServiceContent),
  'r.testType && r.testType.trim() 패턴 확인'
);

// 1-5. buildStage1Summary()에서 testResults.length 사용
test(
  'buildStage1Summary()에서 testResults.length === 0 체크',
  insightServiceContent.includes('if (testResults.length === 0)'),
  'stats.testCount 대신 testResults.length 사용 확인'
);

// 1-6. buildStage1Summary()에서 testCount = validTestResults.length 사용
test(
  'buildStage1Summary()에서 testCount = validTestResults.length',
  /testCount:\s*validTestResults\.length/.test(insightServiceContent),
  'stats.testCount 대신 validTestResults.length 사용 확인'
);

// 1-7. Turso 동기화 실패 시 degraded mode
test(
  'Turso 동기화 실패 시 degraded mode (에러 처리)',
  insightServiceContent.includes('// 동기화 실패해도 기존 로직 계속 진행 (degraded mode)'),
  '동기화 실패해도 앱 동작 계속됨'
);

// ========== 2. ResultService 검증 ==========

console.log('\n📋 ResultService.ts 검증\n');

// 2-1. 메모리 캐시 필드 존재
test(
  '메모리 캐시 필드 존재 (resultsCache)',
  resultServiceContent.includes('private resultsCache:')
);

// 2-2. CACHE_TTL_MS 상수 존재
test(
  'CACHE_TTL_MS 상수 존재 (30초)',
  resultServiceContent.includes('private readonly CACHE_TTL_MS = 30 * 1000;'),
  '30초 TTL 확인'
);

// 2-3. getMyResults()에서 캐시 확인
test(
  'getMyResults()에서 캐시 확인',
  /if \(this\.resultsCache\.data && \(now - this\.resultsCache\.timestamp\) < this\.CACHE_TTL_MS\)/.test(resultServiceContent),
  'TTL 기반 캐시 체크'
);

// 2-4. 캐시 업데이트
test(
  'getMyResults()에서 캐시 업데이트',
  /this\.resultsCache = \{[\s\S]*?data: merged,[\s\S]*?timestamp: Date\.now\(\)/.test(resultServiceContent),
  '조회 후 캐시 업데이트'
);

// 2-5. invalidateCache() 메서드 존재
test(
  'invalidateCache() 메서드 존재',
  resultServiceContent.includes('private invalidateCache()')
);

// 2-6. saveResult()에서 invalidateCache() 호출
test(
  'saveResult()에서 invalidateCache() 호출',
  resultServiceContent.includes('this.invalidateCache();'),
  '새 결과 저장 시 캐시 무효화'
);

// ========== 3. 통합 검증 ==========

console.log('\n📋 통합 검증\n');

// 3-1. InsightService에서 ResultService import
test(
  'InsightService에서 resultService import',
  insightServiceContent.includes("import { resultService } from './ResultService';")
);

// 3-2. syncStatsFromTurso()에서 resultService.getMyResults() 호출
test(
  'syncStatsFromTurso()에서 resultService.getMyResults() 호출',
  /private async syncStatsFromTurso[\s\S]*?const results = await resultService\.getMyResults\(\);/.test(insightServiceContent),
  'Turso 결과 조회 확인'
);

// 3-3. buildStage1Summary()에서 resultService.getMyResults() 호출
test(
  'buildStage1Summary()에서 resultService.getMyResults() 호출',
  /private async buildStage1Summary[\s\S]{0,200}const testResults = await resultService\.getMyResults\(\);/.test(insightServiceContent),
  'Turso 우선 조회 확인'
);

// ========== 4. 버그 수정 검증 (Round 2) ==========

console.log('\n📋 버그 수정 검증 (Round 2)\n');

// 4-1. setUserId()에서 invalidateCache() 호출
test(
  'setUserId()에서 invalidateCache() 호출',
  /setUserId\(userId: string\)[\s\S]*?this\.invalidateCache\(\);/.test(resultServiceContent),
  '사용자 전환 시 캐시 무효화 확인'
);

// 4-2. inflightRequest 필드 존재
test(
  'inflightRequest 필드 존재',
  resultServiceContent.includes('private inflightRequest: Promise<TestResultCamel[]> | null'),
  '동시 호출 중복 방지용 필드'
);

// 4-3. getMyResults()에서 inflightRequest 확인
test(
  'getMyResults()에서 inflightRequest 확인',
  /if \(this\.inflightRequest\)/.test(resultServiceContent),
  '진행 중인 요청 재사용'
);

// 4-4. fetchAndCacheResults() 메서드 존재
test(
  'fetchAndCacheResults() 메서드 존재',
  resultServiceContent.includes('private async fetchAndCacheResults('),
  '실제 조회 로직 분리'
);

// 4-5. buildStage1Summary()에서 validTestResults 필터링
test(
  'buildStage1Summary()에서 validTestResults 필터링',
  /const validTestResults = testResults\.filter\(r => r\.testType && r\.testType\.trim\(\)\);/.test(insightServiceContent),
  'syncStatsFromTurso()와 동일한 필터 적용'
);

// 4-6. buildStage1Summary()에서 validTestResults.length 사용
test(
  'buildStage1Summary()에서 validTestResults.length 사용',
  /testCount: validTestResults\.length/.test(insightServiceContent),
  '필터링된 결과 개수 사용'
);

// ========== 결과 출력 ==========

console.log('\n==================================================');
console.log('테스트 결과 요약');
console.log('==================================================');
console.log(`✅ PASS: ${passCount}개`);
console.log(`❌ FAIL: ${failCount}개`);
console.log(`📊 성공률: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
console.log('==================================================\n');

// 실패 시 exit code 1
if (failCount > 0) {
  process.exit(1);
}
