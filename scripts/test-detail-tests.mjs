// 세부 테스트 검증 스크립트
// petMatch 세부 테스트(dogBreed, catBreed, smallPet, fishType, birdType, reptileType)의
// 결과 매칭 로직과 커버리지를 검증

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 레거시 data.js에서 CHEMI_DATA 로드 (Next.js TypeScript 파일 직접 로드 불가)
// 대신 TypeScript 파일을 직접 파싱하여 검증

const DETAIL_TESTS = ['dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'];
const LEVEL_THRESHOLDS = { HIGH: 60, LOW: 40 };

// TypeScript 파일에서 데이터 추출 (간단한 파싱)
function loadTestData(testName) {
    const filePath = join(__dirname, '..', 'src', 'data', 'subjects', `${testName}.ts`);
    const content = readFileSync(filePath, 'utf-8');

    // dimensions 추출 - dimensions 블록 내의 키들 찾기
    const dimensions = [];
    const dimBlockMatch = content.match(/"dimensions"\s*:\s*\{([\s\S]*?)\},\s*"questions"/);
    if (dimBlockMatch) {
        const dimContent = dimBlockMatch[1];
        // "키이름": { 형태로 시작하는 것들 추출
        const dimMatches = dimContent.matchAll(/"(\w+)"\s*:\s*\{[^}]*"name"/g);
        for (const m of dimMatches) {
            if (m[1] !== 'name' && m[1] !== 'emoji' && m[1] !== 'desc') {
                dimensions.push(m[1]);
            }
        }
    }

    // questions 추출 (dimension별 카운트)
    const questionMatches = content.matchAll(/"dimension"\s*:\s*"(\w+)"/g);
    const questionsByDim = {};
    for (const m of questionMatches) {
        const dim = m[1];
        questionsByDim[dim] = (questionsByDim[dim] || 0) + 1;
    }

    // resultLabels 추출
    const results = [];
    const resultMatches = content.matchAll(/"name"\s*:\s*"([^"]+)"[^}]*"condition"\s*:\s*\{([^}]*)\}/gs);
    for (const m of resultMatches) {
        const name = m[1];
        const condStr = m[2];
        const condition = {};
        const condMatches = condStr.matchAll(/"(\w+)"\s*:\s*"(\w+)"/g);
        for (const c of condMatches) {
            condition[c[1]] = c[2];
        }
        if (Object.keys(condition).length > 0) {
            results.push({ name, condition });
        }
    }

    return { dimensions, questionsByDim, results };
}

// 점수를 레벨로 변환
function getScoreLevel(score, questionCount) {
    const maxScore = questionCount * 5;
    const percentage = (score / maxScore) * 100;
    if (percentage >= LEVEL_THRESHOLDS.HIGH) return 'high';
    if (percentage < LEVEL_THRESHOLDS.LOW) return 'low';  // 40% 미만만 LOW
    return 'medium';
}

function getPossibleLevels(questionCount) {
    const scoreOptions = [1, 3, 5];
    const levels = new Set();

    function dfs(index, totalScore) {
        if (index >= questionCount) {
            levels.add(getScoreLevel(totalScore, questionCount));
            return;
        }
        for (const score of scoreOptions) {
            dfs(index + 1, totalScore + score);
        }
    }

    dfs(0, 0);

    const ordered = ['low', 'medium', 'high'];
    return ordered.filter((l) => levels.has(l));
}

// 모든 가능한 응답 조합 생성
function generateAllCombinations(dimensions, questionsByDim) {
    const dimList = dimensions.filter(d => questionsByDim[d] > 0);
    const levelOptionsByDim = {};
    for (const dim of dimList) {
        levelOptionsByDim[dim] = getPossibleLevels(questionsByDim[dim]);
    }

    function generate(index, current) {
        if (index >= dimList.length) {
            return [{ ...current }];
        }
        const dim = dimList[index];
        const results = [];
        for (const level of levelOptionsByDim[dim]) {
            current[dim] = level;
            results.push(...generate(index + 1, current));
        }
        return results;
    }

    return generate(0, {});
}

// 결과 매칭
function matchResult(levels, results) {
    let bestMatch = null;
    let bestScore = -1;

    for (const result of results) {
        let matchCount = 0;
        let allMatch = true;

        for (const [dim, expectedLevel] of Object.entries(result.condition)) {
            if (levels[dim] === expectedLevel) {
                matchCount++;
            } else {
                allMatch = false;
            }
        }

        // 완전 매칭 우선
        if (allMatch && matchCount > 0) {
            if (matchCount > bestScore || (matchCount === bestScore && Object.keys(result.condition).length > Object.keys(bestMatch?.condition || {}).length)) {
                bestMatch = result;
                bestScore = matchCount;
            }
        }
    }

    // 부분 매칭
    if (!bestMatch) {
        for (const result of results) {
            let matchCount = 0;
            for (const [dim, expectedLevel] of Object.entries(result.condition)) {
                if (levels[dim] === expectedLevel) {
                    matchCount++;
                }
            }
            if (matchCount > bestScore) {
                bestMatch = result;
                bestScore = matchCount;
            }
        }
    }

    return bestMatch || results[results.length - 1];
}

// 커버리지 분석
function analyzeCoverage(testName) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📊 ${testName} 검증`);
    console.log('='.repeat(60));

    try {
        const data = loadTestData(testName);

        console.log(`\n📋 기본 정보:`);
        console.log(`   차원: ${data.dimensions.join(', ')}`);
        console.log(`   질문 분포: ${JSON.stringify(data.questionsByDim)}`);
        console.log(`   결과 수: ${data.results.length}개`);

        // 차원당 최소 1개 질문 확인
        const errors = [];
        for (const dim of data.dimensions) {
            if (!data.questionsByDim[dim] || data.questionsByDim[dim] === 0) {
                errors.push(`❌ 차원 '${dim}'에 질문이 없습니다.`);
            }
        }

        // 빈 조건 확인
        for (const result of data.results) {
            if (Object.keys(result.condition).length === 0) {
                errors.push(`❌ '${result.name}'의 condition이 비어있습니다 (도달 불가).`);
            }
        }

        if (errors.length > 0) {
            console.log(`\n⚠️ 오류:`);
            errors.forEach(e => console.log(`   ${e}`));
            return { testName, pass: false, errors };
        }

        // 커버리지 계산
        const combinations = generateAllCombinations(data.dimensions, data.questionsByDim);
        const coverage = {};
        data.results.forEach(r => coverage[r.name] = 0);

        for (const combo of combinations) {
            const matched = matchResult(combo, data.results);
            if (matched) {
                coverage[matched.name]++;
            }
        }

        const total = combinations.length;
        console.log(`\n📈 커버리지 (${total}개 조합):`);

        const sortedCoverage = Object.entries(coverage).sort((a, b) => b[1] - a[1]);
        let unreachable = [];

        for (const [name, count] of sortedCoverage) {
            const pct = ((count / total) * 100).toFixed(1);
            const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
            console.log(`   ${name.padEnd(15)} ${bar} ${pct}% (${count}/${total})`);
            if (count === 0) {
                unreachable.push(name);
            }
        }

        if (unreachable.length > 0) {
            console.log(`\n⚠️ 도달 불가능한 결과: ${unreachable.join(', ')}`);
            return { testName, pass: false, unreachable };
        }

        // 결과 조건 출력
        console.log(`\n🎯 결과 조건:`);
        for (const result of data.results) {
            const condStr = Object.entries(result.condition)
                .map(([k, v]) => `${k}:${v}`)
                .join(', ');
            console.log(`   ${result.name}: { ${condStr} }`);
        }

        console.log(`\n✅ ${testName} 검증 통과!`);
        return { testName, pass: true, coverage };

    } catch (e) {
        console.log(`\n❌ 오류 발생: ${e.message}`);
        return { testName, pass: false, error: e.message };
    }
}

// 시나리오 테스트
function runScenarioTests() {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`🎭 시나리오 테스트`);
    console.log('='.repeat(60));

    const scenarios = [
        {
            name: '초보자 + 소형견 + 조용한 환경',
            test: 'dogBreed',
            levels: { size: 'low', energy: 'low', grooming: 'low', training: 'low', independence: 'low' },
            expected: ['말티즈', '시츄', '프렌치 불독']
        },
        {
            name: '활동적 + 대형견 + 훈련 열정',
            test: 'dogBreed',
            levels: { size: 'high', energy: 'high', grooming: 'medium', training: 'high', independence: 'medium' },
            expected: ['골든 리트리버', '래브라도 리트리버', '보더 콜리']
        },
        {
            name: '바쁜 직장인 + 독립적 고양이',
            test: 'catBreed',
            levels: { activity: 'low', affection: 'low', grooming: 'low', vocal: 'low', independence: 'high' },
            expected: ['러시안 블루', '브리티시 숏헤어', '코리안 숏헤어']
        },
        {
            name: '첫 소동물 + 짧은 수명 OK',
            test: 'smallPet',
            levels: { lifespan: 'low', handling: 'medium', noise: 'high', space: 'low', social: 'low' },
            expected: ['골든 햄스터', '드워프 햄스터']
        },
        {
            name: '첫 어항 + 간단 관리',
            test: 'fishType',
            levels: { difficulty: 'low', tankSize: 'low', visual: 'low', social: 'low', maintenance: 'low' },
            expected: ['베타', '구피']
        },
        {
            name: '첫 반려조 + 조용함',
            test: 'birdType',
            levels: { noise: 'low', interaction: 'low', space: 'low', time: 'low', experience: 'low' },
            expected: ['십자매/문조', '카나리아']
        },
        {
            name: '첫 파충류 + 핸들링 원함',
            test: 'reptileType',
            levels: { handling: 'high', space: 'low', feeding: 'medium', maintenance: 'low', experience: 'low' },
            expected: ['레오파드 게코', '크레스티드 게코']
        }
    ];

    let passed = 0;
    let failed = 0;

    for (const scenario of scenarios) {
        try {
            const data = loadTestData(scenario.test);
            const matched = matchResult(scenario.levels, data.results);
            const isExpected = scenario.expected.includes(matched.name);

            if (isExpected) {
                console.log(`\n✅ ${scenario.name}`);
                console.log(`   결과: ${matched.name} (예상 목록에 포함)`);
                passed++;
            } else {
                console.log(`\n⚠️ ${scenario.name}`);
                console.log(`   결과: ${matched.name}`);
                console.log(`   예상: ${scenario.expected.join(' 또는 ')}`);
                failed++;
            }
        } catch (e) {
            console.log(`\n❌ ${scenario.name}: 오류 - ${e.message}`);
            failed++;
        }
    }

    console.log(`\n📊 시나리오 결과: ${passed}/${passed + failed} 통과`);
    return { passed, failed };
}

// 메인 실행
console.log('🔍 petMatch 세부 테스트 검증');
console.log('='.repeat(60));

const results = [];
for (const test of DETAIL_TESTS) {
    results.push(analyzeCoverage(test));
}

const scenarioResults = runScenarioTests();

// 최종 요약
console.log(`\n${'='.repeat(60)}`);
console.log('📋 최종 요약');
console.log('='.repeat(60));

const passedTests = results.filter(r => r.pass).length;
const failedTests = results.filter(r => !r.pass).length;

console.log(`\n커버리지 검증: ${passedTests}/${DETAIL_TESTS.length} 통과`);
console.log(`시나리오 테스트: ${scenarioResults.passed}/${scenarioResults.passed + scenarioResults.failed} 통과`);

if (failedTests > 0) {
    console.log(`\n❌ 실패한 테스트:`);
    results.filter(r => !r.pass).forEach(r => {
        console.log(`   - ${r.testName}: ${r.errors?.join(', ') || r.unreachable?.join(', ') || r.error}`);
    });
}

process.exit(failedTests > 0 || scenarioResults.failed > 0 ? 1 : 0);
