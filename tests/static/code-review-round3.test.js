/**
 * 코드 리뷰 Round 3 - inflightRequest userId 검증
 *
 * 발견 이슈:
 * - inflightRequest가 userId 변경을 추적하지 않음
 * - setUserId() 후 진행 중인 요청이 있으면 잘못된 사용자 데이터 반환 가능
 */

const fs = require('fs');
const path = require('path');

// ========== 파일 읽기 ==========

const resultServicePath = path.resolve(__dirname, '../../src/services/ResultService.ts');
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
console.log('코드 리뷰 Round 3 - inflightRequest userId 검증');
console.log('==================================================\n');

// ========== 1. 현재 구조 분석 ==========

console.log('📋 현재 구조 분석\n');

// 1-1. inflightRequest는 단순 Promise 타입
test(
  'inflightRequest는 단순 Promise 타입',
  resultServiceContent.includes('private inflightRequest: Promise<TestResultCamel[]> | null'),
  'userId 정보를 포함하지 않음'
);

// 1-2. setUserId()에서 inflightRequest 무효화 확인
test(
  'setUserId()에서 inflightRequest 무효화',
  /setUserId\(userId: string\)[\s\S]*?this\.inflightRequest = null/.test(resultServiceContent),
  '진행 중인 요청도 무효화'
);

// ========== 2. 잠재적 버그 시나리오 검증 ==========

console.log('\n📋 잠재적 버그 시나리오\n');

console.log('시나리오:');
console.log('1. T=0ms: user-A로 getMyResults() 호출 → inflightRequest 설정');
console.log('2. T=10ms: setUserId("user-B") 호출 → 캐시만 무효화');
console.log('3. T=20ms: user-B로 getMyResults() 호출 → user-A의 inflightRequest 반환');
console.log('4. 결과: user-B 요청이 user-A 데이터를 받음 ❌\n');

// 2-1. 문제: inflightRequest에 userId 정보 없음
test(
  '문제: inflightRequest에 userId 정보 없음',
  !resultServiceContent.includes('inflightRequestUserId'),
  '어떤 userId로 요청 중인지 추적 불가'
);

// 2-2. 해결: setUserId()가 inflightRequest를 무효화함
test(
  '해결: setUserId()가 inflightRequest를 무효화함',
  /setUserId\(userId: string\)[\s\S]*?this\.inflightRequest = null/.test(resultServiceContent),
  '사용자 전환 시 진행 중인 요청도 취소됨'
);

// ========== 3. 수정 완료 검증 ==========

console.log('\n📋 수정 완료 검증\n');

// 3-1. setUserId()에서 캐시 무효화
test(
  'setUserId()에서 캐시 무효화',
  /this\.invalidateCache\(\);/.test(resultServiceContent),
  'invalidateCache() 호출 확인'
);

// 3-2. setUserId()에서 inflightRequest 무효화
test(
  'setUserId()에서 inflightRequest 무효화',
  /this\.inflightRequest = null;/.test(resultServiceContent),
  'inflightRequest = null 할당 확인'
);

// 3-3. 두 무효화 순서 확인 (캐시 → inflightRequest)
test(
  '무효화 순서 확인',
  /this\.invalidateCache\(\);[\s\S]*?this\.inflightRequest = null;/.test(resultServiceContent),
  '캐시 먼저, 그다음 inflightRequest'
);

// ========== 결과 출력 ==========

console.log('\n==================================================');
console.log('검증 결과 요약');
console.log('==================================================');
console.log(`✅ PASS: ${passCount}개`);
console.log(`❌ FAIL: ${failCount}개`);
console.log(`📊 성공률: ${((passCount / (passCount + failCount)) * 100).toFixed(1)}%`);
console.log('==================================================\n');

if (failCount === 0) {
  console.log('✅ inflightRequest userId 불일치 버그 수정 완료!\n');
} else {
  console.log('⚠️  일부 검증 실패, 수정 필요\n');
  process.exit(1);
}
