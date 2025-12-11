/**
 * petMatch와 coffee 테스트 데이터 검증 스크립트
 * - 추가된 질문 검증
 * - resultLabels 조건 검증
 * - 매칭 로직 시뮬레이션
 */

import fs from 'fs';
import path from 'path';
import vm from 'vm';

// 브라우저 환경 시뮬레이션
const window = {
    CHEMI_SUBJECTS: {},
    CHEMI_CONSTANTS: {}
};

const context = vm.createContext({ window, console });

// 데이터 파일 로드
const dataDir = path.join(process.cwd(), 'data');
const subjectsDir = path.join(dataDir, 'subjects');

const files = [
    path.join(dataDir, 'constants.js'),
    path.join(dataDir, 'utils.js'),
    path.join(subjectsDir, 'petMatch.js'),
    path.join(subjectsDir, 'coffee.js')
];

files.forEach(file => {
    const content = fs.readFileSync(file, 'utf-8');
    vm.runInContext(content, context);
});

const petMatchData = window.CHEMI_SUBJECTS.petMatch;
const coffeeData = window.CHEMI_SUBJECTS.coffee;

let passed = 0;
let failed = 0;

function test(name, condition, detail = '') {
    if (condition) {
        console.log(`  ✅ ${name}`);
        passed++;
    } else {
        console.log(`  ❌ ${name}${detail ? ` - ${detail}` : ''}`);
        failed++;
    }
}

function section(title) {
    console.log(`\n${'='.repeat(50)}`);
    console.log(`📋 ${title}`);
    console.log('='.repeat(50));
}

// =============================================
// petMatch 테스트
// =============================================
section('petMatch 테스트');

// 1. 기본 구조 검증
console.log('\n[1] 기본 구조 검증');
test('testType이 matching임', petMatchData.testType === 'matching');
test('dimensions 5개 존재', Object.keys(petMatchData.dimensions).length === 5);

const petDimensions = ['lifestyle', 'space', 'time', 'experience', 'interaction'];
petDimensions.forEach(dim => {
    test(`dimension "${dim}" 존재`, petMatchData.dimensions[dim] !== undefined);
});

// 2. 질문 수 검증
console.log('\n[2] 질문 수 검증');
test('기본 질문 13개', petMatchData.questions.length === 13);
test('심화 질문 16개', petMatchData.questions_deep.length === 16,
    `실제: ${petMatchData.questions_deep.length}`);

// 3. 차원별 질문 분포 검증
console.log('\n[3] 차원별 질문 분포');
const petQuestionsByDim = {};
[...petMatchData.questions, ...petMatchData.questions_deep].forEach(q => {
    petQuestionsByDim[q.dimension] = (petQuestionsByDim[q.dimension] || 0) + 1;
});

petDimensions.forEach(dim => {
    const count = petQuestionsByDim[dim] || 0;
    test(`${dim}: ${count}개 (최소 4개 이상)`, count >= 4);
});

// 4. 새로 추가된 질문 검증
console.log('\n[4] 새로 추가된 질문 검증');
const newPetQuestions = [
    { q: '주말에 주로 어떻게 보내나요?', dim: 'lifestyle' },
    { q: '규칙적인 생활 패턴을 유지하나요?', dim: 'lifestyle' },
    { q: '집에 베란다나 테라스가 있나요?', dim: 'space' },
    { q: '층간소음에 민감한 환경인가요?', dim: 'space' },
    { q: '매일 정해진 시간에 밥을 챙겨줄 수 있나요?', dim: 'time' },
    { q: '반려동물 교육 영상이나 책을 볼 의향이 있나요?', dim: 'experience' },
    { q: '반려동물이 아플 때 병원에 자주 갈 수 있나요?', dim: 'experience' },
    { q: '반려동물과 함께 자고 싶나요?', dim: 'interaction' }
];

newPetQuestions.forEach(({ q, dim }) => {
    const found = petMatchData.questions_deep.find(question => question.q === q);
    test(`"${q.substring(0, 20)}..." 존재`, found !== undefined);
    if (found) {
        test(`  - dimension이 "${dim}"임`, found.dimension === dim);
    }
});

// 5. resultLabels 조건 검증
console.log('\n[5] resultLabels 조건 검증');
test('결과 유형 8개', petMatchData.resultLabels.length === 8);

const petResults = [
    { name: '활발한 강아지', requiredDims: ['lifestyle', 'space', 'time', 'interaction', 'experience'] },
    { name: '얌전한 소형견', requiredDims: ['lifestyle', 'space', 'time', 'interaction'] },
    { name: '도도한 고양이', requiredDims: ['lifestyle', 'time', 'interaction'] },
    { name: '응석쟁이 고양이', requiredDims: ['lifestyle', 'space', 'time', 'interaction'] },
    { name: '귀여운 토끼', requiredDims: ['space', 'time', 'interaction'] },
    { name: '활발한 햄스터', requiredDims: ['space', 'time', 'experience'] },
    { name: '느긋한 물고기', requiredDims: ['time', 'interaction', 'experience'] },
    { name: '똑똑한 앵무새', requiredDims: ['time', 'interaction', 'experience'] }
];

petResults.forEach(({ name, requiredDims }) => {
    const result = petMatchData.resultLabels.find(r => r.name === name);
    test(`"${name}" 존재`, result !== undefined);
    if (result) {
        const conditionKeys = Object.keys(result.condition);
        const hasAllDims = requiredDims.every(dim => conditionKeys.includes(dim));
        test(`  - 조건에 필수 차원 포함`, hasAllDims,
            `필요: ${requiredDims.join(', ')}, 실제: ${conditionKeys.join(', ')}`);
    }
});

// 6. matchPoints 검증
console.log('\n[6] matchPoints 검증');
petMatchData.resultLabels.forEach(result => {
    test(`"${result.name}" matchPoints 존재`,
        Array.isArray(result.matchPoints) && result.matchPoints.length > 0);
});

// =============================================
// coffee 테스트
// =============================================
section('coffee 테스트');

// 1. 기본 구조 검증
console.log('\n[1] 기본 구조 검증');
test('testType이 matching임', coffeeData.testType === 'matching');
test('dimensions 5개 존재', Object.keys(coffeeData.dimensions).length === 5);

const coffeeDimensions = ['bitter', 'sweet', 'caffeine', 'temperature', 'mood'];
coffeeDimensions.forEach(dim => {
    test(`dimension "${dim}" 존재`, coffeeData.dimensions[dim] !== undefined);
});

// 2. 질문 수 검증
console.log('\n[2] 질문 수 검증');
test('기본 질문 13개', coffeeData.questions.length === 13);
test('심화 질문 20개', coffeeData.questions_deep.length === 20,
    `실제: ${coffeeData.questions_deep.length}`);

// 3. 차원별 질문 분포 검증
console.log('\n[3] 차원별 질문 분포');
const coffeeQuestionsByDim = {};
[...coffeeData.questions, ...coffeeData.questions_deep].forEach(q => {
    coffeeQuestionsByDim[q.dimension] = (coffeeQuestionsByDim[q.dimension] || 0) + 1;
});

coffeeDimensions.forEach(dim => {
    const count = coffeeQuestionsByDim[dim] || 0;
    test(`${dim}: ${count}개 (최소 5개 이상)`, count >= 5);
});

// 4. 새로 추가된 질문 검증
console.log('\n[4] 새로 추가된 질문 검증');
const newCoffeeQuestions = [
    { q: '블랙커피(아메리카노, 에스프레소)를 즐기나요?', dim: 'bitter' },
    { q: '커피 쓴맛이 혀에 남는 느낌은?', dim: 'bitter' },
    { q: '프라푸치노나 쉐이크 음료는?', dim: 'sweet' },
    { q: '커피에 우유를 넣을 때?', dim: 'sweet' },
    { q: '오후 3시 이후에도 커피를 마시나요?', dim: 'caffeine' },
    { q: '커피 없이 하루를 시작할 수 있나요?', dim: 'caffeine' },
    { q: '미지근해진 커피를 마실 수 있나요?', dim: 'temperature' },
    { q: '여름에 뜨거운 커피를 마시나요?', dim: 'temperature' },
    { q: '혼자 카페에 가는 것은?', dim: 'mood' },
    { q: '커피를 마시면서 주로 뭘 하나요?', dim: 'mood' }
];

newCoffeeQuestions.forEach(({ q, dim }) => {
    const found = coffeeData.questions_deep.find(question => question.q === q);
    test(`"${q.substring(0, 25)}..." 존재`, found !== undefined);
    if (found) {
        test(`  - dimension이 "${dim}"임`, found.dimension === dim);
    }
});

// 5. resultLabels 조건 검증
console.log('\n[5] resultLabels 조건 검증');
test('결과 유형 9개', coffeeData.resultLabels.length === 9);

const coffeeResults = [
    { name: '진한 에스프레소', mustHave: ['bitter', 'sweet', 'caffeine'] },
    { name: '클래식 아메리카노', mustHave: ['bitter', 'sweet', 'caffeine'] },
    { name: '부드러운 카페라떼', mustHave: ['bitter', 'sweet', 'temperature', 'caffeine'] },
    { name: '달콤한 바닐라 라떼', mustHave: ['bitter', 'sweet', 'caffeine'] },
    { name: '아이스 콜드브루', mustHave: ['temperature', 'bitter', 'caffeine'] },
    { name: '진한 카페모카', mustHave: ['sweet', 'bitter', 'caffeine'] },
    { name: '여유로운 플랫화이트', mustHave: ['bitter', 'sweet', 'mood', 'caffeine'] },
    { name: '카페인 프리 허브티', mustHave: ['caffeine', 'bitter', 'mood'] },
    { name: '트렌디한 아인슈페너', mustHave: ['bitter', 'sweet', 'temperature', 'caffeine'] }
];

coffeeResults.forEach(({ name, mustHave }) => {
    const result = coffeeData.resultLabels.find(r => r.name === name);
    test(`"${name}" 존재`, result !== undefined);
    if (result) {
        const conditionKeys = Object.keys(result.condition);
        const hasAllDims = mustHave.every(dim => conditionKeys.includes(dim));
        test(`  - 필수 조건 포함`, hasAllDims,
            `필요: ${mustHave.join(', ')}, 실제: ${conditionKeys.join(', ')}`);
    }
});

// 6. 점수 검증 (1 또는 5)
console.log('\n[6] 답변 점수 검증');
let invalidScores = [];
[...coffeeData.questions, ...coffeeData.questions_deep].forEach((q, idx) => {
    q.a.forEach(a => {
        if (a.score !== 1 && a.score !== 5) {
            invalidScores.push({ q: q.q, score: a.score });
        }
    });
});
test('모든 답변 점수가 1 또는 5임', invalidScores.length === 0,
    invalidScores.length > 0 ? `잘못된 점수: ${JSON.stringify(invalidScores)}` : '');

// =============================================
// 매칭 로직 시뮬레이션
// =============================================
section('매칭 로직 시뮬레이션');

// getScoreLevel 함수
function getScoreLevel(score, maxScore = 25) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 60) return 'high';
    if (percentage >= 40) return 'medium';
    return 'low';
}

// 매칭 함수
function matchResult(scores, resultLabels) {
    const levels = {};
    for (const [dim, score] of Object.entries(scores)) {
        levels[dim] = getScoreLevel(score, 25);
    }

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
    return resultLabels[resultLabels.length - 1]; // 기본값
}

// petMatch 시뮬레이션
console.log('\n[petMatch 시뮬레이션]');

const petTestCases = [
    {
        name: '활동적인 사람',
        scores: { lifestyle: 23, space: 22, time: 24, experience: 21, interaction: 23 },
        expected: '활발한 강아지'
    },
    {
        name: '바쁜 직장인',
        scores: { lifestyle: 8, space: 15, time: 9, experience: 12, interaction: 12 },
        expected: '도도한 고양이'
    },
    {
        name: '초보 집순이 (교감 원함)',
        scores: { lifestyle: 8, space: 8, time: 12, experience: 12, interaction: 20 },
        expected: '응석쟁이 고양이'
    }
];

petTestCases.forEach(({ name, scores, expected }) => {
    const result = matchResult(scores, petMatchData.resultLabels);
    test(`${name} → ${expected}`, result.name === expected, `실제: ${result.name}`);
});

// coffee 시뮬레이션
console.log('\n[coffee 시뮬레이션]');

const coffeeTestCases = [
    {
        name: '커피 마니아',
        scores: { bitter: 24, sweet: 6, caffeine: 23, temperature: 15, mood: 20 },
        expected: '진한 에스프레소'
    },
    {
        name: '달달이',
        scores: { bitter: 7, sweet: 24, caffeine: 8, temperature: 15, mood: 12 },
        expected: '달콤한 바닐라 라떼'
    },
    {
        name: '얼죽아',
        scores: { bitter: 14, sweet: 10, caffeine: 22, temperature: 6, mood: 15 },
        expected: '아이스 콜드브루'
    }
];

coffeeTestCases.forEach(({ name, scores, expected }) => {
    const result = matchResult(scores, coffeeData.resultLabels);
    test(`${name} → ${expected}`, result.name === expected, `실제: ${result.name}`);
});

// =============================================
// 결과 요약
// =============================================
section('테스트 결과 요약');
console.log(`\n총 ${passed + failed}개 테스트`);
console.log(`  ✅ 통과: ${passed}개`);
console.log(`  ❌ 실패: ${failed}개`);

if (failed > 0) {
    console.log('\n⚠️  일부 테스트가 실패했습니다.');
    process.exit(1);
} else {
    console.log('\n🎉 모든 테스트 통과!');
    process.exit(0);
}
