/**
 * 네비게이션 기능 테스트
 * - 이전 질문으로 돌아가기
 * - 점수 롤백
 * - 테스트 중단
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

// 테스트 결과 추적
let passed = 0;
let failed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`  ✓ ${name}`);
        passed++;
    } catch (e) {
        console.log(`  ✗ ${name}`);
        console.log(`    Error: ${e.message}`);
        failed++;
    }
}

function assertEquals(actual, expected, message = '') {
    if (actual !== expected) {
        throw new Error(`${message} Expected ${expected}, got ${actual}`);
    }
}

function assertTrue(value, message = '') {
    if (!value) {
        throw new Error(message || 'Expected true');
    }
}

// ========== 1. TestHeader 컴포넌트 테스트 ==========
console.log('\n[1] TestHeader 컴포넌트 테스트');

const testHeaderContent = fs.readFileSync(
    path.join(projectRoot, 'components/TestHeader.js'),
    'utf8'
);

test('IIFE 패턴 사용', () => {
    assertTrue(testHeaderContent.includes('(function(window)'), 'IIFE 시작');
    assertTrue(testHeaderContent.includes('})(window)'), 'IIFE 종료');
});

test('TestHeader 전역 노출', () => {
    assertTrue(testHeaderContent.includes('window.TestHeader = TestHeader'));
});

test('ExitModal 전역 노출', () => {
    assertTrue(testHeaderContent.includes('window.ExitModal = ExitModal'));
});

test('첫 질문에서 모달 표시 로직', () => {
    assertTrue(testHeaderContent.includes('if (currentQuestion === 0)'));
    assertTrue(testHeaderContent.includes('setShowExitModal(true)'));
});

test('themeColor 직접 사용 (버그 수정 확인)', () => {
    // 의미없는 replace가 제거되었는지 확인
    assertTrue(!testHeaderContent.includes("themeColor.replace('bg-', 'bg-')"));
    assertTrue(testHeaderContent.includes('? themeColor'));
});

test('진행률 점 계산 로직', () => {
    assertTrue(testHeaderContent.includes('const filledDots = Math.round((current / total) * dotsToShow)'));
});

// ========== 2. App.js 네비게이션 로직 테스트 ==========
console.log('\n[2] App.js 네비게이션 로직 테스트');

const appContent = fs.readFileSync(
    path.join(projectRoot, 'App.js'),
    'utf8'
);

test('answers 상태 정의', () => {
    assertTrue(appContent.includes('const [answers, setAnswers] = useState([])'));
});

test('handleAnswer에서 히스토리 기록', () => {
    assertTrue(appContent.includes('setAnswers(prev => [...prev, { qIdx, dimension, score: scoreVal }])'));
});

test('handleGoBack 함수 존재', () => {
    assertTrue(appContent.includes('const handleGoBack = ()'));
});

test('handleGoBack에서 점수 롤백', () => {
    assertTrue(appContent.includes('[lastAnswer.dimension]: (prev[lastAnswer.dimension] || 0) - lastAnswer.score'));
});

test('handleGoBack에서 히스토리 제거', () => {
    assertTrue(appContent.includes('setAnswers(prev => prev.slice(0, -1))'));
});

test('handleGoBack에서 이전 질문으로 이동', () => {
    assertTrue(appContent.includes('setQIdx(lastAnswer.qIdx)'));
});

test('handleExit 함수 존재', () => {
    assertTrue(appContent.includes('const handleExit = ()'));
});

test('handleExit에서 상태 초기화', () => {
    assertTrue(appContent.includes("setStep('intro')"));
    assertTrue(appContent.includes('setAnswers([])'));
});

test('restart에서 answers 초기화', () => {
    // restart 함수 내에서 setAnswers([]) 호출 확인
    const restartMatch = appContent.match(/const restart[\s\S]*?setShowGraphPopup\(false\);[\s\S]*?setAnswers\(\[\]\)/);
    assertTrue(restartMatch !== null, 'restart 함수에서 setAnswers([]) 호출');
});

test('TestHeader 컴포넌트 통합', () => {
    assertTrue(appContent.includes('<TestHeader'));
    assertTrue(appContent.includes('onBack={handleGoBack}'));
    assertTrue(appContent.includes('onExit={handleExit}'));
});

// ========== 3. index.html 스크립트 로드 테스트 ==========
console.log('\n[3] index.html 스크립트 로드 테스트');

const htmlContent = fs.readFileSync(
    path.join(projectRoot, 'index.html'),
    'utf8'
);

test('TestHeader.js 스크립트 태그 존재', () => {
    assertTrue(htmlContent.includes('components/TestHeader.js'));
});

test('TestHeader가 App.js 전에 로드', () => {
    const testHeaderIndex = htmlContent.indexOf('TestHeader.js');
    const appIndex = htmlContent.indexOf('App.js');
    assertTrue(testHeaderIndex < appIndex, 'TestHeader가 App보다 먼저 로드되어야 함');
});

test('type="text/babel" 속성', () => {
    assertTrue(htmlContent.includes('type="text/babel" src="components/TestHeader.js"'));
});

// ========== 4. 점수 롤백 로직 시뮬레이션 테스트 ==========
console.log('\n[4] 점수 롤백 로직 시뮬레이션 테스트');

// 시뮬레이션용 상태
let scores = { inssa: 0, adventure: 0, empathy: 0 };
let answers = [];
let qIdx = 0;

function simulateAnswer(dimension, scoreVal) {
    answers.push({ qIdx, dimension, score: scoreVal });
    scores = { ...scores, [dimension]: (scores[dimension] || 0) + scoreVal };
    qIdx++;
}

function simulateGoBack() {
    if (answers.length === 0) return false;
    const lastAnswer = answers[answers.length - 1];
    scores = {
        ...scores,
        [lastAnswer.dimension]: (scores[lastAnswer.dimension] || 0) - lastAnswer.score
    };
    answers = answers.slice(0, -1);
    qIdx = lastAnswer.qIdx;
    return true;
}

test('3개 답변 후 점수 합산', () => {
    simulateAnswer('inssa', 5);
    simulateAnswer('adventure', 3);
    simulateAnswer('empathy', 4);

    assertEquals(scores.inssa, 5, 'inssa 점수');
    assertEquals(scores.adventure, 3, 'adventure 점수');
    assertEquals(scores.empathy, 4, 'empathy 점수');
    assertEquals(qIdx, 3, 'qIdx');
    assertEquals(answers.length, 3, 'answers 길이');
});

test('한 번 뒤로가기 후 점수 롤백', () => {
    simulateGoBack();

    assertEquals(scores.empathy, 0, 'empathy 롤백');
    assertEquals(qIdx, 2, 'qIdx 롤백');
    assertEquals(answers.length, 2, 'answers 길이 감소');
});

test('두 번 더 뒤로가기 후 초기 상태', () => {
    simulateGoBack();
    simulateGoBack();

    assertEquals(scores.inssa, 0, 'inssa 롤백');
    assertEquals(scores.adventure, 0, 'adventure 롤백');
    assertEquals(qIdx, 0, 'qIdx 초기화');
    assertEquals(answers.length, 0, 'answers 비어있음');
});

test('빈 히스토리에서 뒤로가기 시도', () => {
    const result = simulateGoBack();
    assertTrue(!result, '빈 히스토리에서 false 반환');
    assertEquals(qIdx, 0, 'qIdx 유지');
});

// ========== 5. 동일 차원 연속 답변 롤백 테스트 ==========
console.log('\n[5] 동일 차원 연속 답변 테스트');

// 상태 리셋
scores = { inssa: 0, adventure: 0 };
answers = [];
qIdx = 0;

test('같은 차원 3번 답변', () => {
    simulateAnswer('inssa', 3);
    simulateAnswer('inssa', 5);
    simulateAnswer('inssa', 4);

    assertEquals(scores.inssa, 12, '누적 점수');
});

test('역순으로 롤백', () => {
    simulateGoBack(); // 4 빼기
    assertEquals(scores.inssa, 8, '첫 번째 롤백');

    simulateGoBack(); // 5 빼기
    assertEquals(scores.inssa, 3, '두 번째 롤백');

    simulateGoBack(); // 3 빼기
    assertEquals(scores.inssa, 0, '세 번째 롤백');
});

// ========== 결과 출력 ==========
console.log('\n========================================');
console.log(`테스트 완료: ${passed} 통과, ${failed} 실패`);
console.log('========================================\n');

process.exit(failed > 0 ? 1 : 0);
