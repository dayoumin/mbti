// petMatch & coffee 테스트 검증 스크립트
// 생성일: 2025-12-11

import fs from 'fs';
import vm from 'vm';

// window 객체 시뮬레이션
global.window = {};

// 파일 로드
const files = [
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
    'data/config.js',
    'data/utils.js'
];

files.forEach(file => {
    try {
        const code = fs.readFileSync(file, 'utf8');
        vm.runInThisContext(code);
    } catch (e) {
        console.error('Error loading', file, ':', e.message);
    }
});

const CHEMI_DATA = window.CHEMI_DATA;
const SUBJECT_CONFIG = window.SUBJECT_CONFIG;
const TEST_TYPES = window.TEST_TYPES;
const matchResultLabel = window.matchResultLabel;

console.log('='.repeat(60));
console.log('🔍 petMatch & coffee 테스트 코드 리뷰');
console.log('='.repeat(60));

let totalErrors = 0;
let totalWarnings = 0;

// 1. 데이터 구조 검증
console.log('\n📋 [1] 데이터 구조 검증');
['petMatch', 'coffee'].forEach(key => {
    const data = CHEMI_DATA[key];
    if (!data) {
        console.log('  ❌', key, '데이터 없음');
        totalErrors++;
        return;
    }

    const required = ['title', 'subtitle', 'themeColor', 'dimensions', 'questions', 'resultLabels'];
    const missing = required.filter(f => !data[f]);

    if (missing.length > 0) {
        console.log('  ❌', key, '필수 필드 누락:', missing.join(', '));
        totalErrors++;
    } else {
        console.log('  ✅', key, '- 필수 필드 모두 존재');
    }

    const dims = Object.keys(data.dimensions);
    console.log('     차원:', dims.join(', '));
});

// 2. 질문 구조 검증
console.log('\n📋 [2] 질문 구조 검증');
['petMatch', 'coffee'].forEach(key => {
    const data = CHEMI_DATA[key];
    let errors = [];

    const allQuestions = [...(data.questions || []), ...(data.questions_deep || [])];

    allQuestions.forEach((q, idx) => {
        if (!q.q) errors.push(`질문 ${idx}: q 없음`);
        if (!q.dimension) errors.push(`질문 ${idx}: dimension 없음`);
        if (!q.a || !Array.isArray(q.a)) errors.push(`질문 ${idx}: a 배열 없음`);

        // 답변 score 범위 검증
        if (q.a) {
            q.a.forEach((ans, aIdx) => {
                if (ans.score < 1 || ans.score > 5) {
                    errors.push(`질문 ${idx} 답변 ${aIdx}: score 범위 오류 (${ans.score})`);
                }
            });
        }
    });

    if (errors.length > 0) {
        console.log('  ❌', key + ':');
        errors.slice(0, 5).forEach(e => console.log('     ', e));
        if (errors.length > 5) console.log(`     ... 외 ${errors.length - 5}개`);
        totalErrors += errors.length;
    } else {
        console.log('  ✅', key, `- 기본 ${data.questions.length}개, 심화 ${(data.questions_deep || []).length}개`);
    }
});

// 3. 결과 라벨 검증
console.log('\n📋 [3] 결과 라벨 검증');
['petMatch', 'coffee'].forEach(key => {
    const data = CHEMI_DATA[key];
    let errors = [];

    const required = ['name', 'emoji', 'desc', 'condition', 'interpretation', 'guide', 'matchPoints'];

    data.resultLabels.forEach((r, idx) => {
        const missing = required.filter(f => !r[f]);
        if (missing.length > 0) {
            errors.push(`${r.name}: ${missing.join(', ')} 누락`);
        }

        // condition 키 검증
        const dims = Object.keys(data.dimensions);
        const conditionKeys = Object.keys(r.condition || {});
        const invalidKeys = conditionKeys.filter(k => !dims.includes(k));
        if (invalidKeys.length > 0) {
            errors.push(`${r.name}: 잘못된 condition 키 - ${invalidKeys.join(', ')}`);
        }
    });

    if (errors.length > 0) {
        console.log('  ❌', key + ':');
        errors.forEach(e => console.log('     ', e));
        totalErrors += errors.length;
    } else {
        console.log('  ✅', key, `-`, data.resultLabels.length + '개 결과 유형');
    }
});

// 4. SUBJECT_CONFIG 검증
console.log('\n📋 [4] SUBJECT_CONFIG 검증');
['petMatch', 'coffee'].forEach(key => {
    const config = SUBJECT_CONFIG[key];
    if (!config) {
        console.log('  ❌', key, 'SUBJECT_CONFIG 없음');
        totalErrors++;
        return;
    }

    const required = ['testType', 'icon', 'label', 'intro', 'resultFormat'];
    const missing = required.filter(f => !config[f]);

    if (missing.length > 0) {
        console.log('  ❌', key, '필드 누락:', missing.join(', '));
        totalErrors++;
        return;
    }

    // matching 타입 추가 검증
    if (config.resultFormat === 'matching') {
        const matchingRequired = ['matchPointsTitle', 'tabLabels', 'tabActiveColor', 'checkColor'];
        const matchingMissing = matchingRequired.filter(f => !config[f]);
        if (matchingMissing.length > 0) {
            console.log('  ⚠️ ', key, 'matching 필드 누락:', matchingMissing.join(', '));
            totalWarnings++;
        }
    }

    console.log('  ✅', key, '- testType:', config.testType + ', icon:', config.icon);
});

// 5. 차원별 질문 분포
console.log('\n📋 [5] 차원별 질문 분포');
['petMatch', 'coffee'].forEach(key => {
    const data = CHEMI_DATA[key];
    const dimCounts = {};
    const dims = Object.keys(data.dimensions);

    dims.forEach(d => { dimCounts[d] = { basic: 0, deep: 0 }; });

    data.questions.forEach(q => {
        if (dimCounts[q.dimension]) dimCounts[q.dimension].basic++;
    });
    (data.questions_deep || []).forEach(q => {
        if (dimCounts[q.dimension]) dimCounts[q.dimension].deep++;
    });

    console.log(`  📊 ${key}:`);
    dims.forEach(d => {
        const dim = data.dimensions[d];
        const count = dimCounts[d];
        const total = count.basic + count.deep;
        const status = count.basic >= 2 ? '✅' : '⚠️';
        if (count.basic < 2) totalWarnings++;
        console.log(`    ${status} ${dim.emoji} ${dim.name}: 기본 ${count.basic}개 + 심화 ${count.deep}개 = ${total}개`);
    });
});

// 6. 결과 매칭 로직 테스트
console.log('\n📋 [6] 결과 매칭 로직 테스트');
['petMatch', 'coffee'].forEach(key => {
    const data = CHEMI_DATA[key];
    const dims = Object.keys(data.dimensions);

    // 테스트 케이스: 모든 점수가 높은 경우
    const highScores = {};
    dims.forEach(d => { highScores[d] = 15; }); // 3 questions * 5 score

    const dimCounts = {};
    data.questions.forEach(q => {
        dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
    });

    const result = matchResultLabel(highScores, data.dimensions, data.resultLabels, dimCounts);

    if (result) {
        console.log(`  ✅ ${key} 높은점수 → ${result.emoji} ${result.name}`);
    } else {
        console.log(`  ❌ ${key} 매칭 실패 (높은점수)`);
        totalErrors++;
    }

    // 테스트 케이스: 모든 점수가 낮은 경우
    const lowScores = {};
    dims.forEach(d => { lowScores[d] = 3; }); // 3 questions * 1 score

    const resultLow = matchResultLabel(lowScores, data.dimensions, data.resultLabels, dimCounts);

    if (resultLow) {
        console.log(`  ✅ ${key} 낮은점수 → ${resultLow.emoji} ${resultLow.name}`);
    } else {
        console.log(`  ❌ ${key} 매칭 실패 (낮은점수)`);
        totalErrors++;
    }
});

// 7. 아이콘 검증
console.log('\n📋 [7] 아이콘 등록 확인');
['PetMatchIcon', 'CoffeeIcon'].forEach(iconName => {
    // 실제 브라우저 환경이 아니므로 config에서 참조만 확인
    const usedBy = Object.entries(SUBJECT_CONFIG).find(([k, v]) => v.icon === iconName);
    if (usedBy) {
        console.log(`  ✅ ${iconName} → ${usedBy[0]}에서 사용`);
    } else {
        console.log(`  ⚠️  ${iconName} 사용처 없음`);
        totalWarnings++;
    }
});

// 결과 요약
console.log('\n' + '='.repeat(60));
console.log('📊 검증 결과 요약');
console.log('='.repeat(60));

if (totalErrors === 0 && totalWarnings === 0) {
    console.log('\n✅ 모든 검증 통과!');
} else {
    if (totalErrors > 0) {
        console.log(`\n❌ 오류: ${totalErrors}개`);
    }
    if (totalWarnings > 0) {
        console.log(`⚠️  경고: ${totalWarnings}개`);
    }
}

// 테스트 요약 테이블
console.log('\n┌─────────────┬───────┬───────┬───────┬─────────┐');
console.log('│   테스트    │ 기본  │ 심화  │ 결과  │ testType│');
console.log('├─────────────┼───────┼───────┼───────┼─────────┤');
['petMatch', 'coffee'].forEach(key => {
    const data = CHEMI_DATA[key];
    const config = SUBJECT_CONFIG[key];
    const basic = data.questions.length;
    const deep = (data.questions_deep || []).length;
    const results = data.resultLabels.length;
    console.log(`│ ${key.padEnd(11)} │ ${String(basic).padStart(5)} │ ${String(deep).padStart(5)} │ ${String(results).padStart(5)} │ ${config.testType.padEnd(7)} │`);
});
console.log('└─────────────┴───────┴───────┴───────┴─────────┘');

process.exit(totalErrors > 0 ? 1 : 0);
