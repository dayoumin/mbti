/**
 * 과일, 술, 빵 테스트 검증 스크립트
 * - 질문/답변 형식 검증
 * - 점수 산출 로직 검증
 * - 결과 매칭 시뮬레이션
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// TypeScript 파일에서 데이터 추출
function loadSubjectData(filename) {
    const filepath = join(__dirname, '..', 'src', 'data', 'subjects', filename);
    const content = readFileSync(filepath, 'utf-8');

    // export const xxxData: SubjectData = {...}; 패턴에서 객체 추출
    const match = content.match(/export const \w+Data[^=]*=\s*(\{[\s\S]*\});?\s*$/);
    if (!match) {
        throw new Error(`Could not parse data from ${filename}`);
    }

    // JSON으로 변환 가능하게 정리
    let jsonStr = match[1];
    // trailing comma 제거 및 JSON 형식으로 변환
    jsonStr = jsonStr.replace(/,(\s*[}\]])/g, '$1');

    return eval(`(${jsonStr})`);
}

const fruitData = loadSubjectData('fruit.ts');
const alcoholData = loadSubjectData('alcohol.ts');
const breadData = loadSubjectData('bread.ts');

const LEVEL_THRESHOLDS = { HIGH: 60, LOW: 40 };

function getScoreLevel(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= LEVEL_THRESHOLDS.HIGH) return 'high';
    if (percentage < LEVEL_THRESHOLDS.LOW) return 'low';  // 40% 미만만 LOW
    return 'medium';
}

function countDimensions(questions) {
    const counts = {};
    questions.forEach(q => {
        counts[q.dimension] = (counts[q.dimension] || 0) + 1;
    });
    return counts;
}

function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
    const levels = {};
    Object.keys(dimensions).forEach(dim => {
        const questionCount = dimCounts[dim] || 2;
        const maxScore = questionCount * 5;
        levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
    });

    // 완전 일치 찾기
    let bestExactMatch = null;
    let bestExactConditionCount = 0;

    for (const result of resultLabels) {
        const condition = result.condition;
        const conditionKeys = Object.keys(condition);
        if (conditionKeys.length === 0) continue;

        let match = true;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] !== level) {
                match = false;
                break;
            }
        }

        if (match && conditionKeys.length > bestExactConditionCount) {
            bestExactMatch = result;
            bestExactConditionCount = conditionKeys.length;
        }
    }

    if (bestExactMatch) return { result: bestExactMatch, levels, matchType: 'exact' };

    // 부분 매칭
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
    return { result: bestMatch, levels, matchType: 'partial', matchScore: bestScore };
}

function validateSubject(name, data) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📋 ${name} 테스트 검증`);
    console.log('='.repeat(60));

    const errors = [];
    const warnings = [];

    // 1. 기본 구조 검증
    console.log('\n[1] 기본 구조 검증');
    if (!data.title) errors.push('title 없음');
    if (!data.subtitle) errors.push('subtitle 없음');
    if (!data.themeColor) errors.push('themeColor 없음');
    if (!data.icon) errors.push('icon 없음');
    if (!data.testType) errors.push('testType 없음');
    console.log(`  ✓ 제목: ${data.title}`);
    console.log(`  ✓ 부제목: ${data.subtitle}`);
    console.log(`  ✓ 테마 색상: ${data.themeColor}`);
    console.log(`  ✓ 아이콘: ${data.icon}`);
    console.log(`  ✓ 테스트 유형: ${data.testType}`);

    // 2. 차원 검증
    console.log('\n[2] 차원(Dimension) 검증');
    const dimKeys = Object.keys(data.dimensions);
    console.log(`  차원 수: ${dimKeys.length}개`);
    dimKeys.forEach(key => {
        const dim = data.dimensions[key];
        if (!dim.name || !dim.emoji || !dim.desc) {
            errors.push(`차원 ${key}: 필수 속성 누락`);
        }
        console.log(`    - ${key}: ${dim.emoji} ${dim.name} (${dim.desc})`);
    });

    // 3. 질문 검증
    console.log('\n[3] 질문(Questions) 검증');
    const dimCounts = countDimensions(data.questions);
    console.log(`  기본 질문: ${data.questions.length}개`);
    console.log(`  심화 질문: ${data.questions_deep?.length || 0}개`);
    console.log(`  차원별 질문 수:`);
    Object.entries(dimCounts).forEach(([dim, count]) => {
        console.log(`    - ${dim}: ${count}개`);
    });

    // 모든 차원에 질문이 있는지 확인
    dimKeys.forEach(key => {
        if (!dimCounts[key]) {
            errors.push(`차원 ${key}에 질문이 없음`);
        }
    });

    // 질문 형식 검증
    data.questions.forEach((q, i) => {
        if (!q.q) errors.push(`질문 ${i + 1}: 질문 텍스트 없음`);
        if (!q.dimension) errors.push(`질문 ${i + 1}: dimension 없음`);
        if (!dimKeys.includes(q.dimension)) errors.push(`질문 ${i + 1}: 알 수 없는 dimension '${q.dimension}'`);
        if (!q.a || q.a.length < 2) errors.push(`질문 ${i + 1}: 답변 2개 미만`);

        // 점수 검증
        q.a.forEach((ans, j) => {
            if (!ans.text) errors.push(`질문 ${i + 1}, 답변 ${j + 1}: 텍스트 없음`);
            if (ans.score === undefined) errors.push(`질문 ${i + 1}, 답변 ${j + 1}: score 없음`);
            if (ans.score < 1 || ans.score > 5) warnings.push(`질문 ${i + 1}, 답변 ${j + 1}: score가 1-5 범위 밖 (${ans.score})`);
        });
    });

    // 4. 결과 검증
    console.log('\n[4] 결과(ResultLabels) 검증');
    console.log(`  결과 수: ${data.resultLabels.length}개`);

    data.resultLabels.forEach((r, i) => {
        if (!r.name) errors.push(`결과 ${i + 1}: name 없음`);
        if (!r.emoji) errors.push(`결과 ${i + 1}: emoji 없음`);
        if (!r.desc) errors.push(`결과 ${i + 1}: desc 없음`);
        if (!r.condition) errors.push(`결과 ${i + 1}: condition 없음`);
        if (!r.mood) errors.push(`결과 ${i + 1}: mood 없음`);
        if (!r.color) errors.push(`결과 ${i + 1}: color 없음`);
        if (!r.interpretation) errors.push(`결과 ${i + 1}: interpretation 없음`);
        if (!r.guide) errors.push(`결과 ${i + 1}: guide 없음`);
        if (!r.matchPoints || r.matchPoints.length === 0) warnings.push(`결과 ${i + 1}: matchPoints 없거나 비어있음`);

        // 조건 검증
        const condKeys = Object.keys(r.condition);
        if (condKeys.length === 0) errors.push(`결과 ${i + 1} '${r.name}': 빈 조건`);
        condKeys.forEach(key => {
            if (!dimKeys.includes(key)) errors.push(`결과 ${i + 1}: 알 수 없는 조건 키 '${key}'`);
            if (!['high', 'medium', 'low'].includes(r.condition[key])) {
                errors.push(`결과 ${i + 1}: 잘못된 조건 값 '${r.condition[key]}'`);
            }
        });
    });

    // 5. 결과 시뮬레이션
    console.log('\n[5] 결과 시뮬레이션');

    // 5.1 극단 케이스 테스트
    console.log('\n  [5.1] 극단 케이스:');

    // 모두 high (모든 질문 5점)
    const allHighScores = {};
    dimKeys.forEach(dim => {
        allHighScores[dim] = (dimCounts[dim] || 2) * 5;
    });
    const allHighResult = matchResultLabel(allHighScores, data.dimensions, data.resultLabels, dimCounts);
    console.log(`    모든 차원 HIGH → ${allHighResult.result.emoji} ${allHighResult.result.name} (${allHighResult.matchType})`);

    // 모두 low (모든 질문 1점)
    const allLowScores = {};
    dimKeys.forEach(dim => {
        allLowScores[dim] = (dimCounts[dim] || 2) * 1;
    });
    const allLowResult = matchResultLabel(allLowScores, data.dimensions, data.resultLabels, dimCounts);
    console.log(`    모든 차원 LOW  → ${allLowResult.result.emoji} ${allLowResult.result.name} (${allLowResult.matchType})`);

    // 5.2 각 결과의 조건대로 점수 설정시 해당 결과가 나오는지 확인
    console.log('\n  [5.2] 각 결과 도달 테스트:');
    const reachedResults = new Set();

    data.resultLabels.forEach(target => {
        const testScores = {};
        dimKeys.forEach(dim => {
            const qCount = dimCounts[dim] || 2;
            const maxScore = qCount * 5;
            const targetLevel = target.condition[dim];

            if (targetLevel === 'high') {
                testScores[dim] = Math.ceil(maxScore * 0.7); // 70%
            } else if (targetLevel === 'low') {
                testScores[dim] = Math.floor(maxScore * 0.3); // 30%
            } else if (targetLevel === 'medium') {
                testScores[dim] = Math.floor(maxScore * 0.5); // 50%
            } else {
                testScores[dim] = Math.floor(maxScore * 0.5); // 기본값
            }
        });

        const result = matchResultLabel(testScores, data.dimensions, data.resultLabels, dimCounts);
        const reached = result.result.name === target.name;
        reachedResults.add(result.result.name);

        const status = reached ? '✓' : '✗';
        const mismatch = reached ? '' : ` (실제: ${result.result.name})`;
        console.log(`    ${status} ${target.emoji} ${target.name}${mismatch}`);

        if (!reached) {
            warnings.push(`결과 '${target.name}'에 도달하지 못함 (실제: ${result.result.name})`);
        }
    });

    // 도달 불가 결과 확인
    const unreachable = data.resultLabels.filter(r => !reachedResults.has(r.name));
    if (unreachable.length > 0) {
        warnings.push(`도달 불가능한 결과: ${unreachable.map(r => r.name).join(', ')}`);
    }

    // 6. 요약
    console.log('\n[6] 검증 요약');
    console.log(`  오류: ${errors.length}개`);
    errors.forEach(e => console.log(`    ❌ ${e}`));
    console.log(`  경고: ${warnings.length}개`);
    warnings.forEach(w => console.log(`    ⚠️  ${w}`));

    return { errors, warnings };
}

// 실행
console.log('🧪 과일/술/빵 테스트 검증 시작\n');

const fruitResult = validateSubject('과일 (Fruit)', fruitData);
const alcoholResult = validateSubject('술 (Alcohol)', alcoholData);
const breadResult = validateSubject('빵 (Bread)', breadData);

// 최종 요약
console.log('\n' + '='.repeat(60));
console.log('📊 최종 요약');
console.log('='.repeat(60));

const totalErrors = fruitResult.errors.length + alcoholResult.errors.length + breadResult.errors.length;
const totalWarnings = fruitResult.warnings.length + alcoholResult.warnings.length + breadResult.warnings.length;

console.log(`\n과일: 오류 ${fruitResult.errors.length}, 경고 ${fruitResult.warnings.length}`);
console.log(`술: 오류 ${alcoholResult.errors.length}, 경고 ${alcoholResult.warnings.length}`);
console.log(`빵: 오류 ${breadResult.errors.length}, 경고 ${breadResult.warnings.length}`);
console.log(`\n총합: 오류 ${totalErrors}, 경고 ${totalWarnings}`);

if (totalErrors === 0) {
    console.log('\n✅ 모든 테스트 통과!');
} else {
    console.log('\n❌ 오류가 발견되었습니다.');
    process.exit(1);
}
