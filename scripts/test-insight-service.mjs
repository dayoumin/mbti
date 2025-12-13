/**
 * InsightService 테스트
 * - 인사이트 생성 로직
 * - 상관관계 계산
 * - 요약 메시지 생성
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

function assertInRange(value, min, max, message = '') {
    if (value < min || value > max) {
        throw new Error(`${message} Expected ${value} to be between ${min} and ${max}`);
    }
}

// ========== 1. InsightService.js 파일 검증 ==========
console.log('\n[1] InsightService 파일 구조 검증');

const insightServiceContent = fs.readFileSync(
    path.join(projectRoot, 'services/InsightService.js'),
    'utf8'
);

test('IIFE 패턴 사용', () => {
    assertTrue(insightServiceContent.includes('(function(window)'), 'IIFE 시작');
    assertTrue(insightServiceContent.includes('})(window)'), 'IIFE 종료');
});

test('InsightService 클래스 정의', () => {
    assertTrue(insightServiceContent.includes('class InsightService'));
});

test('전역 인스턴스 노출', () => {
    assertTrue(insightServiceContent.includes('window.insightService = new InsightService()'));
});

test('DIMENSION_CORRELATIONS 정의', () => {
    assertTrue(insightServiceContent.includes('const DIMENSION_CORRELATIONS'));
    assertTrue(insightServiceContent.includes('human_cat'));
    assertTrue(insightServiceContent.includes('human_dog'));
    assertTrue(insightServiceContent.includes('human_idealType'));
});

test('INSIGHT_REQUIREMENTS 정의', () => {
    assertTrue(insightServiceContent.includes('const INSIGHT_REQUIREMENTS'));
    assertTrue(insightServiceContent.includes('minimum'));
    assertTrue(insightServiceContent.includes('basic'));
    assertTrue(insightServiceContent.includes('animal'));
});

test('generateInsights 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('async generateInsights()'));
});

test('analyzePersonality 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('analyzePersonality(humanResult)'));
});

test('analyzeAnimalCompatibility 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('analyzeAnimalCompatibility(humanResult, animalResults)'));
});

test('analyzeRelationship 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('analyzeRelationship(idealTypeResult, humanResult)'));
});

test('analyzeLifestyle 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('analyzeLifestyle(lifestyleResults)'));
});

test('calculateSimilarity 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('calculateSimilarity(humanScores, animalScores, correlation)'));
});

test('generateSummaryMessages 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('generateSummaryMessages(insights)'));
});

test('getRecommendations 메서드 존재', () => {
    assertTrue(insightServiceContent.includes('getRecommendations(completedTests)'));
});

// ========== 2. InsightView.js 파일 검증 ==========
console.log('\n[2] InsightView 컴포넌트 검증');

const insightViewContent = fs.readFileSync(
    path.join(projectRoot, 'components/InsightView.js'),
    'utf8'
);

test('InsightView IIFE 패턴', () => {
    assertTrue(insightViewContent.includes('(function(window)'), 'IIFE 시작');
    assertTrue(insightViewContent.includes('})(window)'), 'IIFE 종료');
});

test('InsightView 전역 노출', () => {
    assertTrue(insightViewContent.includes('window.InsightView = InsightView'));
});

test('탭 구조 (summary, details, recommend)', () => {
    assertTrue(insightViewContent.includes("'summary'"));
    assertTrue(insightViewContent.includes("'details'"));
    assertTrue(insightViewContent.includes("'recommend'"));
});

test('InsightCard 컴포넌트', () => {
    assertTrue(insightViewContent.includes('const InsightCard'));
});

test('AnimalCompatCard 컴포넌트', () => {
    assertTrue(insightViewContent.includes('const AnimalCompatCard'));
});

test('EmptyState 컴포넌트', () => {
    assertTrue(insightViewContent.includes('const EmptyState'));
});

test('insightService.generateInsights 호출', () => {
    assertTrue(insightViewContent.includes('window.insightService.generateInsights()'));
});

// ========== 3. index.html 스크립트 검증 ==========
console.log('\n[3] index.html 스크립트 로드 검증');

const htmlContent = fs.readFileSync(
    path.join(projectRoot, 'index.html'),
    'utf8'
);

test('InsightService.js 스크립트 태그', () => {
    assertTrue(htmlContent.includes('services/InsightService.js'));
});

test('InsightView.js 스크립트 태그', () => {
    assertTrue(htmlContent.includes('components/InsightView.js'));
});

test('InsightService가 App.js 전에 로드', () => {
    const insightServiceIndex = htmlContent.indexOf('InsightService.js');
    const appIndex = htmlContent.indexOf('App.js');
    assertTrue(insightServiceIndex < appIndex, 'InsightService가 App보다 먼저');
});

test('InsightView가 App.js 전에 로드', () => {
    const insightViewIndex = htmlContent.indexOf('InsightView.js');
    const appIndex = htmlContent.indexOf('App.js');
    assertTrue(insightViewIndex < appIndex, 'InsightView가 App보다 먼저');
});

// ========== 4. App.js 통합 검증 ==========
console.log('\n[4] App.js 통합 검증');

const appContent = fs.readFileSync(
    path.join(projectRoot, 'App.js'),
    'utf8'
);

test('InsightView import', () => {
    assertTrue(appContent.includes('InsightView'));
});

test('showInsight 상태', () => {
    assertTrue(appContent.includes('[showInsight, setShowInsight]'));
});

test('인사이트 버튼 존재', () => {
    assertTrue(appContent.includes('통합 인사이트 보기'));
    assertTrue(appContent.includes('setShowInsight(true)'));
});

test('InsightView 렌더링', () => {
    assertTrue(appContent.includes('<InsightView'));
    assertTrue(appContent.includes('onClose={() => setShowInsight(false)}'));
});

// ========== 5. 상관관계 계산 시뮬레이션 ==========
console.log('\n[5] 상관관계 계산 시뮬레이션');

// 간단한 유사도 계산 시뮬레이션
function simulateSimilarity(humanScores, animalScores, correlation) {
    const MAX_SCORE = 5;
    const DEFAULT_QUESTION_COUNT = 5;
    const maxScorePerDimension = DEFAULT_QUESTION_COUNT * MAX_SCORE;

    let totalCorrelation = 0;
    let count = 0;

    for (const [humanDim, animalCorr] of Object.entries(correlation)) {
        const humanScore = humanScores[humanDim] || 0;

        for (const [animalDim, corrValue] of Object.entries(animalCorr)) {
            const animalScore = animalScores[animalDim] || 0;

            const normalizedHuman = humanScore / maxScorePerDimension;
            const normalizedAnimal = animalScore / maxScorePerDimension;

            if (corrValue > 0) {
                totalCorrelation += (1 - Math.abs(normalizedHuman - normalizedAnimal)) * corrValue;
            } else {
                totalCorrelation += Math.abs(normalizedHuman - normalizedAnimal) * Math.abs(corrValue);
            }
            count++;
        }
    }

    return count > 0 ? Math.min(1, Math.max(0, totalCorrelation / count + 0.3)) : 0.5;
}

const testCorrelation = {
    'inssa': { 'cute': 0.7, 'boss': -0.3 },
    'adventure': { 'curious': 0.8 }
};

test('높은 유사도 (비슷한 점수)', () => {
    const human = { inssa: 20, adventure: 18 };
    const animal = { cute: 20, boss: 5, curious: 18 };
    const similarity = simulateSimilarity(human, animal, testCorrelation);
    assertInRange(similarity, 0.5, 1.0, '유사한 점수는 높은 유사도');
});

test('낮은 유사도 (다른 점수)', () => {
    const human = { inssa: 25, adventure: 25 };
    const animal = { cute: 5, boss: 25, curious: 5 };
    const similarity = simulateSimilarity(human, animal, testCorrelation);
    assertInRange(similarity, 0.0, 0.7, '다른 점수는 낮은 유사도');
});

test('중간 점수도 유효한 유사도 반환', () => {
    const human = { inssa: 15, adventure: 15 };
    const animal = { cute: 15, boss: 15, curious: 15 };
    const similarity = simulateSimilarity(human, animal, testCorrelation);
    assertInRange(similarity, 0.3, 0.9, '중간 점수');
});

// ========== 6. groupByType 로직 시뮬레이션 ==========
console.log('\n[6] groupByType 로직 시뮬레이션');

function groupByType(results) {
    return results.reduce((acc, result) => {
        const type = result.testType;
        if (!acc[type]) acc[type] = [];
        acc[type].push(result);
        return acc;
    }, {});
}

test('빈 배열 처리', () => {
    const result = groupByType([]);
    assertEquals(Object.keys(result).length, 0);
});

test('단일 테스트 그룹화', () => {
    const results = [
        { testType: 'human', resultKey: 'type1' },
        { testType: 'human', resultKey: 'type2' }
    ];
    const grouped = groupByType(results);
    assertEquals(grouped.human.length, 2);
});

test('다중 테스트 그룹화', () => {
    const results = [
        { testType: 'human', resultKey: 'type1' },
        { testType: 'cat', resultKey: 'type2' },
        { testType: 'human', resultKey: 'type3' },
        { testType: 'dog', resultKey: 'type4' }
    ];
    const grouped = groupByType(results);
    assertEquals(Object.keys(grouped).length, 3);
    assertEquals(grouped.human.length, 2);
    assertEquals(grouped.cat.length, 1);
    assertEquals(grouped.dog.length, 1);
});

// ========== 7. 추천 테스트 로직 시뮬레이션 ==========
console.log('\n[7] 추천 테스트 로직 시뮬레이션');

function getRecommendations(completedTests) {
    const allTests = ['human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType', 'plant', 'coffee', 'petMatch'];
    const incomplete = allTests.filter(t => !completedTests.includes(t));

    const priority = {
        human: 1, cat: 2, dog: 2, idealType: 3,
        rabbit: 4, hamster: 4, plant: 5, coffee: 5, petMatch: 5
    };

    return incomplete
        .sort((a, b) => priority[a] - priority[b])
        .slice(0, 3);
}

test('아무것도 안 했을 때 human 우선 추천', () => {
    const recs = getRecommendations([]);
    assertEquals(recs[0], 'human');
});

test('human 완료 후 cat/dog 추천', () => {
    const recs = getRecommendations(['human']);
    assertTrue(recs.includes('cat') || recs.includes('dog'));
});

test('모든 테스트 완료 시 빈 배열', () => {
    const all = ['human', 'cat', 'dog', 'rabbit', 'hamster', 'idealType', 'plant', 'coffee', 'petMatch'];
    const recs = getRecommendations(all);
    assertEquals(recs.length, 0);
});

test('최대 3개만 추천', () => {
    const recs = getRecommendations([]);
    assertTrue(recs.length <= 3);
});

// ========== 결과 출력 ==========
console.log('\n========================================');
console.log(`테스트 완료: ${passed} 통과, ${failed} 실패`);
console.log('========================================\n');

process.exit(failed > 0 ? 1 : 0);
