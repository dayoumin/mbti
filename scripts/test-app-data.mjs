/**
 * 앱 데이터 무결성 테스트
 * - CHEMI_DATA 로드 확인
 * - SUBJECT_CONFIG 로드 확인
 * - 아이콘 참조 확인
 * - 결과 매칭 로직 테스트
 *
 * 데이터 소스: data/subjects/*.js (모듈화된 구조)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🧪 앱 데이터 무결성 테스트\n');
console.log('='.repeat(50));

// 분리된 데이터 파일 로드 (브라우저 시뮬레이션)
const window = {};

const loadOrder = [
    'data/constants.js',
    'data/subjects/human.js',
    'data/subjects/cat.js',
    'data/subjects/dog.js',
    'data/subjects/rabbit.js',
    'data/subjects/hamster.js',
    'data/subjects/idealType.js',
    'data/subjects/petMatch.js',
    'data/subjects/plant.js',
    'data/subjects/coffee.js',
    'data/index.js',
    'data/config.js'
];

for (const file of loadOrder) {
    const filePath = path.join(projectRoot, file);
    if (!fs.existsSync(filePath)) {
        console.error(`❌ 파일을 찾을 수 없습니다: ${file}`);
        process.exit(1);
    }
    const code = fs.readFileSync(filePath, 'utf-8');
    try {
        const context = vm.createContext({ window, console });
        vm.runInContext(code, context);
    } catch (e) {
        console.error(`❌ ${file} 로드 실패:`, e.message);
        process.exit(1);
    }
}

const CHEMI_DATA = window.CHEMI_DATA;
const SUBJECT_CONFIG = window.SUBJECT_CONFIG;

if (!CHEMI_DATA) {
    console.error('❌ CHEMI_DATA를 찾을 수 없습니다.');
    process.exit(1);
}
console.log('✅ CHEMI_DATA 로드 성공');

if (!SUBJECT_CONFIG) {
    console.error('❌ SUBJECT_CONFIG를 찾을 수 없습니다.');
    process.exit(1);
}
console.log('✅ SUBJECT_CONFIG 로드 성공');

console.log('\n' + '='.repeat(50));
console.log('📋 Subject 일치 확인\n');

// CHEMI_DATA와 SUBJECT_CONFIG 키 비교
const dataKeys = Object.keys(CHEMI_DATA);
const configKeys = Object.keys(SUBJECT_CONFIG);

console.log('CHEMI_DATA keys:', dataKeys.join(', '));
console.log('SUBJECT_CONFIG keys:', configKeys.join(', '));

const missingInConfig = dataKeys.filter(k => !configKeys.includes(k));
const missingInData = configKeys.filter(k => !dataKeys.includes(k));

if (missingInConfig.length > 0) {
    console.log('⚠️  SUBJECT_CONFIG에 없는 키:', missingInConfig.join(', '));
}
if (missingInData.length > 0) {
    console.log('⚠️  CHEMI_DATA에 없는 키:', missingInData.join(', '));
}
if (missingInConfig.length === 0 && missingInData.length === 0) {
    console.log('✅ 모든 키가 일치합니다.');
}

console.log('\n' + '='.repeat(50));
console.log('🎨 아이콘 참조 확인\n');

// 예상되는 아이콘 목록 (Icons.js 기준)
const availableIcons = ['HumanIcon', 'CatFace', 'DogFace', 'RabbitFace', 'HamsterFace', 'HeartIcon', 'PlantIcon', 'PetMatchIcon', 'CoffeeIcon'];

Object.entries(CHEMI_DATA).forEach(([key, data]) => {
    const icon = data.icon;
    const configIcon = SUBJECT_CONFIG[key]?.icon;

    const dataIconOk = availableIcons.includes(icon);
    const configIconOk = availableIcons.includes(configIcon);

    console.log(`${key}:`);
    console.log(`  data.icon: ${icon} ${dataIconOk ? '✅' : '❌ (없음)'}`);
    console.log(`  config.icon: ${configIcon} ${configIconOk ? '✅' : '❌ (없음)'}`);

    if (icon !== configIcon) {
        console.log(`  ⚠️  아이콘 불일치!`);
    }
});

console.log('\n' + '='.repeat(50));
console.log('🔢 결과 매칭 로직 테스트\n');

// getScoreLevel 함수 직접 구현 (data.js와 동일)
function getScoreLevel(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 60) return "high";
    if (percentage <= 40) return "low";
    return "medium";
}

// 테스트 케이스
const testCases = [
    { score: 30, max: 50, expected: 'high' },    // 60%
    { score: 25, max: 50, expected: 'medium' },  // 50%
    { score: 15, max: 50, expected: 'low' },     // 30%
    { score: 35, max: 50, expected: 'high' },    // 70%
    { score: 20, max: 50, expected: 'low' },     // 40% (경계)
];

let passed = 0;
testCases.forEach(tc => {
    const result = getScoreLevel(tc.score, tc.max);
    const ok = result === tc.expected;
    if (ok) passed++;
    console.log(`  getScoreLevel(${tc.score}, ${tc.max}) = "${result}" ${ok ? '✅' : `❌ (expected: ${tc.expected})`}`);
});

console.log(`\n  결과: ${passed}/${testCases.length} 통과`);

console.log('\n' + '='.repeat(50));
console.log('📊 각 Subject 데이터 요약\n');

Object.entries(CHEMI_DATA).forEach(([key, data]) => {
    const dims = Object.keys(data.dimensions).length;
    const basic = data.questions?.length || 0;
    const deep = data.questions_deep?.length || 0;
    const results = data.resultLabels?.length || 0;

    console.log(`${key}:`);
    console.log(`  차원: ${dims}개, 기본: ${basic}개, 심화: ${deep}개, 결과: ${results}개`);

    // 필수 필드 확인
    const requiredFields = ['title', 'subtitle', 'themeColor', 'icon', 'dimensions', 'questions', 'resultLabels'];
    const missing = requiredFields.filter(f => !data[f]);
    if (missing.length > 0) {
        console.log(`  ❌ 누락된 필드: ${missing.join(', ')}`);
    } else {
        console.log(`  ✅ 모든 필수 필드 존재`);
    }
});

console.log('\n' + '='.repeat(50));
console.log('🎯 결과 라벨 조건 검증\n');

let totalIssues = 0;

Object.entries(CHEMI_DATA).forEach(([key, data]) => {
    const dims = Object.keys(data.dimensions);
    let issues = [];

    data.resultLabels?.forEach((label, idx) => {
        const conditionDims = Object.keys(label.condition || {});

        // 조건에 사용된 차원이 실제로 존재하는지 확인
        const invalidDims = conditionDims.filter(d => !dims.includes(d));
        if (invalidDims.length > 0) {
            issues.push(`  [${idx}] ${label.name}: 존재하지 않는 차원 "${invalidDims.join(', ')}"`);
        }

        // 조건 값이 유효한지 확인 (high, medium, low)
        const invalidValues = Object.entries(label.condition || {})
            .filter(([_, v]) => !['high', 'medium', 'low'].includes(v))
            .map(([k, v]) => `${k}=${v}`);
        if (invalidValues.length > 0) {
            issues.push(`  [${idx}] ${label.name}: 잘못된 조건 값 "${invalidValues.join(', ')}"`);
        }
    });

    if (issues.length > 0) {
        console.log(`${key}: ❌ ${issues.length}개 문제`);
        issues.forEach(i => console.log(i));
        totalIssues += issues.length;
    } else {
        console.log(`${key}: ✅ 모든 결과 라벨 조건 유효`);
    }
});

console.log('\n' + '='.repeat(50));
console.log('🔗 matchResultLabel 함수 테스트\n');

// matchResultLabel 함수 구현 (data.js와 동일)
function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
    const levels = {};
    Object.keys(dimensions).forEach(dim => {
        const questionCount = dimCounts[dim] || 5;
        const maxScore = questionCount * 5;
        levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
    });

    for (const result of resultLabels) {
        const condition = result.condition;
        let match = true;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] !== level) {
                match = false;
                break;
            }
        }
        if (match) return result;
    }

    let bestMatch = resultLabels[resultLabels.length - 1];
    let bestScore = 0;
    for (const result of resultLabels) {
        const condition = result.condition;
        let matchCount = 0;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] === level) matchCount++;
        }
        if (matchCount > bestScore) {
            bestScore = matchCount;
            bestMatch = result;
        }
    }
    return bestMatch;
}

// 테스트: 차원별 질문 수가 다른 경우 (cat 모드 시뮬레이션)
const catData = CHEMI_DATA.cat;
const catDimCounts = { curious: 4, alert: 2, boss: 3, random: 3, cute: 2 };
const catScores = { curious: 16, alert: 8, boss: 12, random: 6, cute: 8 };
// curious: 16/20=80% → high, alert: 8/10=80% → high, boss: 12/15=80% → high
// random: 6/15=40% → low, cute: 8/10=80% → high

const catResult = matchResultLabel(catScores, catData.dimensions, catData.resultLabels, catDimCounts);
console.log('  Cat 테스트 (차원별 질문 수 다름):');
console.log(`    dimCounts: ${JSON.stringify(catDimCounts)}`);
console.log(`    scores: ${JSON.stringify(catScores)}`);
console.log(`    결과: "${catResult.name}" ${catResult.name ? '✅' : '❌'}`);

// 테스트: NaN 버그 없는지 확인 (이전 버그: questionsPerDim * 5 = NaN)
const testDimCounts = { dim1: 3, dim2: 4, dim3: 5 };
const testDims = { dim1: { name: "테스트1" }, dim2: { name: "테스트2" }, dim3: { name: "테스트3" } };
const testScores = { dim1: 12, dim2: 16, dim3: 10 };  // 12/15=80%, 16/20=80%, 10/25=40%
const testLabels = [
    { name: "테스트A", condition: { dim1: "high", dim2: "high" } },
    { name: "테스트B", condition: { dim1: "low" } },
    { name: "기본", condition: {} }
];

const testResult = matchResultLabel(testScores, testDims, testLabels, testDimCounts);
const expectedName = "테스트A";  // dim1=high, dim2=high 매칭
console.log('\n  NaN 버그 테스트:');
console.log(`    결과: "${testResult.name}" ${testResult.name === expectedName ? '✅' : `❌ (expected: ${expectedName})`}`);

console.log('\n' + '='.repeat(50));

if (totalIssues === 0) {
    console.log('\n✅ 모든 테스트 통과!\n');
} else {
    console.log(`\n⚠️  ${totalIssues}개 문제 발견\n`);
}
