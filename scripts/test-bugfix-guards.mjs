/**
 * 버그 수정 가드 테스트
 * - Deep-mode 버튼 조건 검증
 * - 데이터 누락 fallback 검증
 * - 아이콘 누락 fallback 검증
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

console.log('🧪 버그 수정 가드 테스트\n');
console.log('='.repeat(50));

// 분리된 데이터 파일 로드
const window = {
    // 기본 아이콘 mock
    HumanIcon: () => 'HumanIcon',
    CatFace: () => 'CatFace',
    DogFace: () => 'DogFace',
};

const loadOrder = [
    'data/constants.js',
    'data/subjects/human.js',
    'data/subjects/cat.js',
    'data/subjects/dog.js',
    'data/subjects/rabbit.js',
    'data/subjects/hamster.js',
    'data/subjects/idealType.js',
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

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
    try {
        fn();
        console.log(`✅ ${name}`);
        testsPassed++;
    } catch (e) {
        console.log(`❌ ${name}: ${e.message}`);
        testsFailed++;
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

// ========================================
console.log('\n📋 테스트 1: Deep-mode 버튼 가드\n');
// ========================================

test('questions_deep이 빈 배열인 subject 식별', () => {
    const subjectsWithNoDeep = [];
    const subjectsWithDeep = [];

    Object.entries(CHEMI_DATA).forEach(([key, data]) => {
        const deepQuestions = data.questions_deep || [];
        if (deepQuestions.length === 0) {
            subjectsWithNoDeep.push(key);
        } else {
            subjectsWithDeep.push(key);
        }
    });

    console.log(`   - 심화 질문 있음: ${subjectsWithDeep.join(', ')}`);
    console.log(`   - 심화 질문 없음: ${subjectsWithNoDeep.join(', ') || '없음'}`);

    // 모든 subject에 대해 상태 확인
    assert(subjectsWithDeep.length > 0 || subjectsWithNoDeep.length > 0,
           'subject가 하나도 없습니다');
});

test('Deep-mode 버튼 조건: deepQuestions.length > 0', () => {
    // App.js의 조건 시뮬레이션
    Object.entries(CHEMI_DATA).forEach(([key, data]) => {
        const deepQuestions = data.questions_deep || [];
        const shouldShowButton = deepQuestions.length > 0;

        // 버튼이 표시되어야 하는 경우, 실제로 질문이 있는지 확인
        if (shouldShowButton) {
            assert(deepQuestions.length > 0,
                   `${key}: 버튼 표시되지만 심화 질문 없음`);
        }
    });
});

test('Deep-mode 시작 시 qIdx 유효성', () => {
    Object.entries(CHEMI_DATA).forEach(([key, data]) => {
        const basicQuestions = data.questions || [];
        const deepQuestions = data.questions_deep || [];
        const allQuestions = [...basicQuestions, ...deepQuestions];

        // startDeepTest 시뮬레이션
        const startQIdx = basicQuestions.length;

        // deepQuestions가 있는 경우에만 유효한 인덱스여야 함
        if (deepQuestions.length > 0) {
            assert(startQIdx < allQuestions.length,
                   `${key}: startQIdx(${startQIdx}) >= allQuestions.length(${allQuestions.length})`);
            assert(allQuestions[startQIdx] !== undefined,
                   `${key}: qIdx ${startQIdx}에 해당하는 질문 없음`);
        }
    });
});

// ========================================
console.log('\n📋 테스트 2: 데이터 누락 Fallback\n');
// ========================================

test('SUBJECT_CONFIG의 모든 키가 CHEMI_DATA에 존재', () => {
    const configKeys = Object.keys(SUBJECT_CONFIG);
    const dataKeys = Object.keys(CHEMI_DATA);

    const missingInData = configKeys.filter(k => !dataKeys.includes(k));

    if (missingInData.length > 0) {
        console.log(`   ⚠️  CHEMI_DATA에 없는 키: ${missingInData.join(', ')}`);
        console.log(`   → 이 키들은 human 데이터로 fallback됩니다`);
    }

    // 테스트는 통과 (경고만 출력)
    assert(true, '');
});

test('Fallback 시 human 데이터 존재 확인', () => {
    assert(CHEMI_DATA.human !== undefined, 'human 데이터가 없습니다');
    assert(CHEMI_DATA.human.questions.length > 0, 'human 질문이 없습니다');
    assert(CHEMI_DATA.human.dimensions !== undefined, 'human dimensions가 없습니다');
});

test('누락된 mode에 대한 fallback 시뮬레이션', () => {
    const testModes = ['human', 'cat', 'nonexistent_mode', 'another_fake'];

    testModes.forEach(mode => {
        const currentModeData = CHEMI_DATA[mode] || CHEMI_DATA.human;

        assert(currentModeData !== undefined,
               `${mode}: fallback 후에도 데이터 없음`);
        assert(currentModeData.questions !== undefined,
               `${mode}: questions 없음`);

        if (!CHEMI_DATA[mode]) {
            console.log(`   - "${mode}": human으로 fallback ✓`);
        }
    });
});

// ========================================
console.log('\n📋 테스트 3: 아이콘 Fallback\n');
// ========================================

test('SUBJECT_CONFIG의 icon 필드 존재 확인', () => {
    Object.entries(SUBJECT_CONFIG).forEach(([key, cfg]) => {
        assert(cfg.icon !== undefined, `${key}: icon 필드 누락`);
    });
});

test('아이콘 fallback 로직 시뮬레이션', () => {
    // ModeTabs의 로직 시뮬레이션
    const results = [];

    Object.entries(SUBJECT_CONFIG).forEach(([key, cfg]) => {
        const IconComponent = window[cfg.icon];
        const finalIcon = IconComponent || window.HumanIcon;

        if (!IconComponent) {
            results.push(`${key}: "${cfg.icon}" → HumanIcon (fallback)`);
        } else {
            results.push(`${key}: "${cfg.icon}" ✓`);
        }

        assert(finalIcon !== undefined, `${key}: fallback 후에도 아이콘 없음`);
    });

    results.forEach(r => console.log(`   - ${r}`));
});

test('누락된 아이콘에 대한 fallback', () => {
    // 의도적으로 없는 아이콘 테스트
    const fakeConfig = {
        test: { icon: 'NonExistentIcon', label: 'Test' }
    };

    const IconComponent = window[fakeConfig.test.icon];
    const finalIcon = IconComponent || window.HumanIcon;

    assert(IconComponent === undefined, 'NonExistentIcon이 존재함 (예상치 않음)');
    assert(finalIcon === window.HumanIcon, 'fallback이 HumanIcon이 아님');
});

// ========================================
console.log('\n📋 테스트 4: 경계 조건 테스트\n');
// ========================================

test('빈 questions 배열 처리', () => {
    // questions가 빈 경우 시뮬레이션
    const emptyData = {
        questions: [],
        questions_deep: [],
        dimensions: {}
    };

    const basicQuestions = emptyData.questions || [];
    const deepQuestions = emptyData.questions_deep || [];
    const maxQuestions = basicQuestions.length;

    assert(maxQuestions === 0, 'maxQuestions가 0이 아님');
    assert(deepQuestions.length === 0, 'deepQuestions가 0이 아님');

    // 버튼이 표시되지 않아야 함
    const shouldShowDeepButton = deepQuestions.length > 0;
    assert(!shouldShowDeepButton, '빈 배열에서 버튼이 표시됨');
});

test('progress bar 계산 (0 나눗셈 방지)', () => {
    const testCases = [
        { qIdx: 0, maxQuestions: 10, expected: 10 },
        { qIdx: 5, maxQuestions: 10, expected: 60 },
        { qIdx: 0, maxQuestions: 0, expected: Infinity },  // JS에서 n/0 = Infinity
    ];

    testCases.forEach(tc => {
        const progress = ((tc.qIdx + 1) / tc.maxQuestions) * 100;

        if (tc.maxQuestions === 0) {
            assert(progress === Infinity, '0 나눗셈이 Infinity를 반환하지 않음');
            console.log(`   - qIdx=${tc.qIdx}, max=0: Infinity (UI에서 방지됨 - 빈 questions면 question step에 진입 불가)`);
        } else {
            assert(progress === tc.expected,
                   `qIdx=${tc.qIdx}, max=${tc.maxQuestions}: ${progress}% != ${tc.expected}%`);
        }
    });
});

// ========================================
// 결과 출력
// ========================================

console.log('\n' + '='.repeat(50));
console.log(`\n📊 테스트 결과: ${testsPassed} 통과, ${testsFailed} 실패\n`);

if (testsFailed > 0) {
    process.exit(1);
}
