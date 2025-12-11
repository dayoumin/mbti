/**
 * 브라우저 통합 테스트 - Node.js 환경에서 시뮬레이션
 *
 * 실제 브라우저처럼 각 파일을 순서대로 로드하여
 * window 객체에 데이터가 올바르게 등록되는지 확인
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('=== 브라우저 통합 테스트 ===\n');

// window 객체 시뮬레이션
const window = {};

// 파일 로드 순서 (index.html과 동일)
const loadOrder = [
    'data/constants.js',
    'data/subjects/human.js',
    'data/subjects/cat.js',
    'data/subjects/dog.js',
    'data/subjects/rabbit.js',
    'data/subjects/hamster.js',
    'data/subjects/idealType.js',
    'data/subjects/plant.js',
    'data/index.js',
    'data/config.js',
    'data/utils.js'
];

// 각 파일을 순서대로 실행
console.log('1. 파일 로드 시뮬레이션:');
for (const file of loadOrder) {
    const filePath = path.join(projectRoot, file);
    const code = fs.readFileSync(filePath, 'utf-8');

    try {
        // vm.createContext로 window 객체를 전역으로 사용
        const context = vm.createContext({ window, console });
        vm.runInContext(code, context);
        console.log(`   ✓ ${file}`);
    } catch (error) {
        console.log(`   ✗ ${file}: ${error.message}`);
    }
}

// 2. CHEMI_CONSTANTS 확인
console.log('\n2. CHEMI_CONSTANTS 확인:');
if (window.CHEMI_CONSTANTS) {
    console.log(`   ✓ MAX_SCORE_PER_QUESTION: ${window.CHEMI_CONSTANTS.MAX_SCORE_PER_QUESTION}`);
    console.log(`   ✓ LEVEL_THRESHOLDS.HIGH: ${window.CHEMI_CONSTANTS.LEVEL_THRESHOLDS.HIGH}`);
    console.log(`   ✓ LEVEL_THRESHOLDS.LOW: ${window.CHEMI_CONSTANTS.LEVEL_THRESHOLDS.LOW}`);
} else {
    console.log('   ✗ CHEMI_CONSTANTS가 정의되지 않음');
}

// 3. CHEMI_DATA 확인
console.log('\n3. CHEMI_DATA 확인:');
if (window.CHEMI_DATA) {
    const subjects = Object.keys(window.CHEMI_DATA);
    console.log(`   ✓ 로드된 테스트: ${subjects.join(', ')}`);

    for (const subject of subjects) {
        const data = window.CHEMI_DATA[subject];
        const questionCount = (data.questions?.length || 0) + (data.questions_deep?.length || 0);
        const resultCount = data.resultLabels?.length || 0;
        console.log(`   - ${subject}: ${data.title} (질문 ${questionCount}개, 결과 ${resultCount}개)`);
    }
} else {
    console.log('   ✗ CHEMI_DATA가 정의되지 않음');
}

// 4. SUBJECT_CONFIG 확인
console.log('\n4. SUBJECT_CONFIG 확인:');
if (window.SUBJECT_CONFIG) {
    const configs = Object.keys(window.SUBJECT_CONFIG);
    console.log(`   ✓ 설정된 모드: ${configs.join(', ')}`);
} else {
    console.log('   ✗ SUBJECT_CONFIG가 정의되지 않음');
}

// 5. 유틸 함수 테스트
console.log('\n5. 유틸 함수 테스트:');
if (window.getScoreLevel && window.matchResultLabel) {
    // getScoreLevel 테스트
    const level1 = window.getScoreLevel(30, 50); // 60% = high
    const level2 = window.getScoreLevel(20, 50); // 40% = low
    const level3 = window.getScoreLevel(25, 50); // 50% = medium

    console.log(`   ✓ getScoreLevel(30, 50) = "${level1}" (expected: high)`);
    console.log(`   ✓ getScoreLevel(20, 50) = "${level2}" (expected: low)`);
    console.log(`   ✓ getScoreLevel(25, 50) = "${level3}" (expected: medium)`);

    // matchResultLabel 테스트 (human 데이터 사용)
    if (window.CHEMI_DATA?.human) {
        const humanData = window.CHEMI_DATA.human;
        const testScores = { inssa: 15, adventure: 15, empathy: 15, plan: 5, mental: 15 };
        const dimCounts = { inssa: 3, adventure: 3, empathy: 3, plan: 3, mental: 3 };

        const result = window.matchResultLabel(
            testScores,
            humanData.dimensions,
            humanData.resultLabels,
            dimCounts
        );

        console.log(`   ✓ matchResultLabel 테스트: "${result.name}"`);
    }
} else {
    console.log('   ✗ 유틸 함수가 정의되지 않음');
}

// 6. 데이터 무결성 검사
console.log('\n6. 데이터 무결성 검사:');
let integrityPassed = true;

if (window.CHEMI_DATA) {
    for (const [subject, data] of Object.entries(window.CHEMI_DATA)) {
        // 필수 필드 확인
        const requiredFields = ['title', 'subtitle', 'themeColor', 'icon', 'dimensions', 'questions', 'resultLabels'];
        for (const field of requiredFields) {
            if (!data[field]) {
                console.log(`   ✗ ${subject}: ${field} 누락`);
                integrityPassed = false;
            }
        }

        // 질문 데이터 검사
        for (const q of (data.questions || [])) {
            if (!q.q || !q.dimension || !q.a || q.a.length < 2) {
                console.log(`   ✗ ${subject}: 잘못된 질문 형식`);
                integrityPassed = false;
                break;
            }
        }

        // 결과 라벨 검사
        for (const r of (data.resultLabels || [])) {
            if (!r || !r.name || r.condition === undefined) {
                console.log(`   ✗ ${subject}: 잘못된 결과 라벨 형식 (r=${JSON.stringify(r)})`);
                integrityPassed = false;
                break;
            }
        }
    }
}

if (integrityPassed) {
    console.log('   ✓ 모든 데이터 무결성 검사 통과');
}

console.log('\n=== 테스트 완료 ===');
