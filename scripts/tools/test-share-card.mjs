/**
 * ShareCard 컴포넌트 로직 테스트
 * - 순수 JavaScript 로직만 테스트 (DOM/Canvas 제외)
 */

console.log('='.repeat(60));
console.log('ShareCard 컴포넌트 로직 테스트');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${error.message}`);
    failed++;
  }
}

function assertEqual(actual, expected, message = '') {
  if (actual !== expected) {
    throw new Error(`${message} Expected: ${expected}, Got: ${actual}`);
  }
}

function assertTrue(condition, message = '') {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
}

// =============================================================================
// 1. 퍼센트 계산 테스트 (ShareCard Line 131)
// =============================================================================

console.log('\n--- 1. 퍼센트 계산 테스트 ---\n');

function calculatePercentage(score, maxScore = 25) {
  const safeScore = Math.max(0, score);
  if (!(maxScore > 0)) return 0;
  return Math.min((safeScore / maxScore) * 100, 100);
}

test('퍼센트 계산 - 0점', () => {
  assertEqual(calculatePercentage(0), 0);
});

test('퍼센트 계산 - 중간 점수 (12.5점)', () => {
  assertEqual(calculatePercentage(12.5), 50);
});

test('퍼센트 계산 - 최대 점수 (25점)', () => {
  assertEqual(calculatePercentage(25), 100);
});

test('퍼센트 계산 - 초과 점수 (30점)', () => {
  assertEqual(calculatePercentage(30), 100);
});

test('퍼센트 계산 - 큰 초과 점수 (100점)', () => {
  assertEqual(calculatePercentage(100), 100);
});

test('퍼센트 계산 - 음수 점수 0% 보정', () => {
  const result = calculatePercentage(-5);
  assertEqual(result, 0);
});

// =============================================================================
// 2. 텍스트 줄바꿈 로직 테스트 (ShareCard Line 100-118)
// =============================================================================

console.log('\n--- 2. 텍스트 줄바꿈 로직 테스트 ---\n');

// ShareCard의 실제 줄바꿈 로직 시뮬레이션
function simulateWordWrap(text, maxWidth = 420, avgCharWidth = 8) {
  const words = text.split(' ');
  const lines = [];
  let line = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + ' ';
    const estimatedWidth = testLine.length * avgCharWidth;

    if (estimatedWidth > maxWidth && i > 0) {
      lines.push(line.trim());
      line = words[i] + ' ';
    } else {
      line = testLine;
    }
  }
  if (line.trim()) {
    lines.push(line.trim());
  }

  return lines;
}

test('영어 텍스트 줄바꿈', () => {
  const text = 'Hello world this is a test string for word wrap functionality';
  const lines = simulateWordWrap(text);
  assertTrue(lines.length >= 1);
  console.log(`   입력: "${text}"`);
  console.log(`   결과: ${lines.length}줄`);
});

test('한글 텍스트 - 공백 있음', () => {
  const text = '사람들과 어울리는 에너지가 넘치고 새로운 거 도전하는 힘이 있어요';
  const lines = simulateWordWrap(text);
  assertTrue(lines.length >= 1);
  console.log(`   입력: "${text}"`);
  console.log(`   결과: ${lines.length}줄`);
});

test('한글 텍스트 - 공백 없음 (문제 케이스)', () => {
  const text = '사람들과어울리는에너지가넘치고새로운거도전하는힘이있어요';
  const lines = simulateWordWrap(text);
  // 공백이 없으면 한 줄로 처리됨 - 이것이 문제!
  assertEqual(lines.length, 1, '공백 없으면 줄바꿈 안됨');
  console.log(`   ⚠️ 공백 없는 한글: "${text.substring(0, 20)}..." → 줄바꿈 안됨`);
});

test('빈 텍스트', () => {
  const lines = simulateWordWrap('');
  assertEqual(lines.length, 0);
});

test('공백만 있는 텍스트', () => {
  const lines = simulateWordWrap('   ');
  assertEqual(lines.length, 0);
});

// =============================================================================
// 3. 차원 슬라이싱 테스트 (ShareCard Line 122)
// =============================================================================

console.log('\n--- 3. 차원 슬라이싱 테스트 ---\n');

test('차원 3개 (5개 미만)', () => {
  const dims = { a: {}, b: {}, c: {} };
  const sliced = Object.entries(dims).slice(0, 5);
  assertEqual(sliced.length, 3);
});

test('차원 5개 (정확히 5개)', () => {
  const dims = { a: {}, b: {}, c: {}, d: {}, e: {} };
  const sliced = Object.entries(dims).slice(0, 5);
  assertEqual(sliced.length, 5);
});

test('차원 7개 (5개 초과)', () => {
  const dims = { a: {}, b: {}, c: {}, d: {}, e: {}, f: {}, g: {} };
  const sliced = Object.entries(dims).slice(0, 5);
  assertEqual(sliced.length, 5);
  console.log('   ⚠️ 7개 차원 중 5개만 표시됨');
});

test('차원 0개', () => {
  const dims = {};
  const sliced = Object.entries(dims).slice(0, 5);
  assertEqual(sliced.length, 0);
});

// =============================================================================
// 4. 파일명 생성 테스트 (ShareCard Line 181)
// =============================================================================

console.log('\n--- 4. 파일명 생성 테스트 ---\n');

function generateFileName(testTitle, resultName) {
  const sanitizeFileName = (name) => name.replace(/[/\\:*?"<>|]/g, '_');
  return `${sanitizeFileName(testTitle)}_결과_${sanitizeFileName(resultName)}.png`;
}

test('일반 파일명', () => {
  const fileName = generateFileName('나의 성격 테스트', '활발한 리더');
  assertEqual(fileName, '나의 성격 테스트_결과_활발한 리더.png');
});

test('특수문자 포함 (sanitizeFileName)', () => {
  const fileName = generateFileName('테스트/이름', '결과:값');
  console.log(`   생성된 파일명: "${fileName}"`);
  assertTrue(!fileName.includes('/'));
  assertTrue(!fileName.includes(':'));
  assertTrue(fileName.includes('_'), 'sanitize로 _를 포함해야 함');
});

// =============================================================================
// 5. 공유 URL 생성 테스트 (ShareCard Line 188)
// =============================================================================

console.log('\n--- 5. 공유 URL 생성 테스트 ---\n');

function generateShareUrl(origin, testTitle) {
  return `${origin}?test=${encodeURIComponent(testTitle)}`;
}

test('일반 URL 생성', () => {
  const url = generateShareUrl('https://chemi.app', '성격 테스트');
  assertEqual(url, 'https://chemi.app?test=%EC%84%B1%EA%B2%A9%20%ED%85%8C%EC%8A%A4%ED%8A%B8');
});

test('특수문자 인코딩', () => {
  const url = generateShareUrl('https://chemi.app', '테스트 & 결과');
  assertTrue(url.includes('%26'), 'ampersand는 %26으로 인코딩');
});

// =============================================================================
// 6. 색상 배열 순환 테스트 (ShareCard Line 152)
// =============================================================================

console.log('\n--- 6. 색상 배열 순환 테스트 ---\n');

const colors = ['#f43f5e', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];

test('색상 순환 - 5개 차원', () => {
  for (let i = 0; i < 5; i++) {
    const color = colors[i % colors.length];
    assertTrue(colors.includes(color));
  }
});

test('색상 순환 - 6번째 차원 (순환)', () => {
  const color = colors[5 % colors.length];
  assertEqual(color, colors[0], '6번째는 첫 번째 색상으로 순환');
});

// =============================================================================
// 7. maxScore 동적 계산 제안 테스트
// =============================================================================

console.log('\n--- 7. maxScore 동적 적용 ---\n');

test('동적 maxScore (props로 전달)', () => {
  assertEqual(calculatePercentage(10, 20), 50);
  assertEqual(calculatePercentage(10, 0), 0);
});

// =============================================================================
// 결과 출력
// =============================================================================

console.log('\n' + '='.repeat(60));
console.log(`테스트 완료: ${passed} 통과, ${failed} 실패`);
console.log('='.repeat(60));

if (failed > 0) {
  console.log('\n⚠️ 실패한 테스트가 있습니다.\n');
  process.exit(1);
} else {
  console.log('\n✅ 모든 테스트 통과!\n');
}

console.log('--- 코드 리뷰 요약 ---');
console.log('');
console.log('🟢 수정 완료:');
console.log('   1. maxScore → props(maxScores) 기반 계산');
console.log('   2. 음수 점수 → Math.max(0, score) 처리');
console.log('   3. 파일명 특수문자 → sanitizeFileName 적용');
console.log('');
console.log('🟡 개선 권장:');
console.log('   1. 한글 텍스트 줄바꿈: 문자 단위 분리 또는 CSS word-break');
console.log('   2. 5개 초과 차원 시 UX 고려 (스크롤 또는 더보기)');
console.log('');
console.log('🟢 양호:');
console.log('   1. 초과 점수 100% 제한');
console.log('   2. URL 인코딩 처리');
console.log('   3. 색상 순환 로직');
console.log('   4. 에러 핸들링 (share cancelled)');
