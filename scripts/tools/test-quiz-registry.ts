/**
 * 퀴즈 레지스트리 및 검증 함수 테스트
 *
 * 테스트 항목:
 * 1. QUIZ_REGISTRY 구조 검증
 * 2. ID 중복 체크
 * 3. 지식 퀴즈 검증 함수
 * 4. 시나리오 퀴즈 점수 범위 검증
 * 5. 통계 함수 동작 확인
 *
 * 실행: npx tsx scripts/test-quiz-registry.ts
 */

import {
  ALL_KNOWLEDGE_QUIZZES,
  ALL_SCENARIO_QUIZZES,
  validateKnowledgeQuiz,
  validateScenarioQuizScores,
  validateAllQuizzes,
  getQuizzesByCategory,
  QUIZ_STATS,
} from '../src/data/content/quizzes';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
};

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`${colors.green}✓${colors.reset} ${name}`);
    passed++;
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${name}`);
    console.log(`  ${colors.red}${error.message}${colors.reset}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

console.log(`${colors.bold}\n═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}퀴즈 레지스트리 테스트${colors.reset}`);
console.log(`${colors.bold}═══════════════════════════════════════════════════════${colors.reset}\n`);

// ============================================================================
// 1. 기본 구조 테스트
// ============================================================================

console.log(`${colors.blue}[1] 기본 구조 테스트${colors.reset}`);

test('ALL_KNOWLEDGE_QUIZZES가 배열임', () => {
  assert(Array.isArray(ALL_KNOWLEDGE_QUIZZES), 'ALL_KNOWLEDGE_QUIZZES is not an array');
});

test('ALL_SCENARIO_QUIZZES가 배열임', () => {
  assert(Array.isArray(ALL_SCENARIO_QUIZZES), 'ALL_SCENARIO_QUIZZES is not an array');
});

test('지식 퀴즈가 1개 이상 존재', () => {
  assert(ALL_KNOWLEDGE_QUIZZES.length > 0, `Expected > 0, got ${ALL_KNOWLEDGE_QUIZZES.length}`);
});

test('시나리오 퀴즈가 1개 이상 존재', () => {
  assert(ALL_SCENARIO_QUIZZES.length > 0, `Expected > 0, got ${ALL_SCENARIO_QUIZZES.length}`);
});

// ============================================================================
// 2. ID 중복 테스트
// ============================================================================

console.log(`\n${colors.blue}[2] ID 중복 테스트${colors.reset}`);

test('지식 퀴즈 ID 중복 없음', () => {
  const ids = ALL_KNOWLEDGE_QUIZZES.map(q => q.id);
  const uniqueIds = new Set(ids);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert(ids.length === uniqueIds.size, `중복 ID: ${duplicates.join(', ')}`);
});

test('시나리오 퀴즈 ID 중복 없음', () => {
  const ids = ALL_SCENARIO_QUIZZES.map(q => q.id);
  const uniqueIds = new Set(ids);
  const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert(ids.length === uniqueIds.size, `중복 ID: ${duplicates.join(', ')}`);
});

// ============================================================================
// 3. 지식 퀴즈 검증 함수 테스트
// ============================================================================

console.log(`\n${colors.blue}[3] 지식 퀴즈 검증 함수 테스트${colors.reset}`);

test('정답 1개인 퀴즈 → valid', () => {
  const validQuiz = {
    id: 'test-001',
    question: '테스트?',
    options: [
      { id: 'a', text: 'A', isCorrect: true },
      { id: 'b', text: 'B', isCorrect: false },
      { id: 'c', text: 'C', isCorrect: false },
    ],
    explanation: '설명',
    difficulty: 1,
    category: 'cat',
    source: 'test',
  };
  const result = validateKnowledgeQuiz(validQuiz);
  assert(result.valid, `Expected valid, got errors: ${result.errors.join(', ')}`);
});

test('정답 없는 퀴즈 → invalid', () => {
  const noCorrect = {
    id: 'test-002',
    options: [
      { id: 'a', text: 'A', isCorrect: false },
      { id: 'b', text: 'B', isCorrect: false },
    ],
  };
  const result = validateKnowledgeQuiz(noCorrect);
  assert(!result.valid, 'Expected invalid (no correct answer)');
  assert(result.errors.some(e => e.includes('정답')), 'Expected error about 정답');
});

test('정답 여러 개인 퀴즈 → invalid', () => {
  const multiCorrect = {
    id: 'test-003',
    options: [
      { id: 'a', text: 'A', isCorrect: true },
      { id: 'b', text: 'B', isCorrect: true },
    ],
  };
  const result = validateKnowledgeQuiz(multiCorrect);
  assert(!result.valid, 'Expected invalid (multiple correct answers)');
});

test('옵션 1개인 퀴즈 → invalid', () => {
  const oneOption = {
    id: 'test-004',
    options: [
      { id: 'a', text: 'A', isCorrect: true },
    ],
  };
  const result = validateKnowledgeQuiz(oneOption);
  assert(!result.valid, 'Expected invalid (only 1 option)');
});

// ============================================================================
// 4. 시나리오 퀴즈 점수 범위 검증 테스트
// ============================================================================

console.log(`\n${colors.blue}[4] 시나리오 퀴즈 점수 범위 테스트${colors.reset}`);

test('연속 점수 범위 → valid', () => {
  const validScenario = {
    id: 'scenario-test-001',
    questions: [
      { options: [{ points: 0 }, { points: 5 }, { points: 10 }] },
      { options: [{ points: 0 }, { points: 5 }, { points: 10 }] },
    ],
    results: [
      { minScore: 0, maxScore: 10, grade: 'C' },
      { minScore: 11, maxScore: 20, grade: 'A' },
    ],
  };
  const result = validateScenarioQuizScores(validScenario);
  assert(result.valid, `Expected valid, got: ${result.errors.join(', ')}`);
});

test('점수 범위 갭 → invalid', () => {
  const gapScenario = {
    id: 'scenario-test-002',
    questions: [
      { options: [{ points: 0 }, { points: 10 }] },
    ],
    results: [
      { minScore: 0, maxScore: 3, grade: 'C' },
      { minScore: 7, maxScore: 10, grade: 'A' }, // 4-6 갭
    ],
  };
  const result = validateScenarioQuizScores(gapScenario);
  assert(!result.valid, 'Expected invalid (gap in score range)');
  assert(result.errors.some(e => e.includes('갭')), 'Expected error about 갭');
});

test('최대 점수 불일치 → invalid', () => {
  const mismatchScenario = {
    id: 'scenario-test-003',
    questions: [
      { options: [{ points: 0 }, { points: 10 }] },
      { options: [{ points: 0 }, { points: 10 }] },
    ],
    results: [
      { minScore: 0, maxScore: 15, grade: 'A' }, // 최대 20인데 15까지만
    ],
  };
  const result = validateScenarioQuizScores(mismatchScenario);
  assert(!result.valid, 'Expected invalid (max score mismatch)');
});

// ============================================================================
// 5. 전체 검증 함수 테스트
// ============================================================================

console.log(`\n${colors.blue}[5] 전체 검증 함수 테스트${colors.reset}`);

test('validateAllQuizzes 실행 성공', () => {
  const result = validateAllQuizzes();
  assert(typeof result.valid === 'boolean', 'Expected valid to be boolean');
  assert(Array.isArray(result.errors), 'Expected errors to be array');
});

test('현재 등록된 모든 퀴즈가 유효함', () => {
  const result = validateAllQuizzes();
  if (!result.valid) {
    throw new Error(`검증 실패: ${result.errors.slice(0, 5).join(', ')}${result.errors.length > 5 ? '...' : ''}`);
  }
});

// ============================================================================
// 6. 조회 함수 테스트
// ============================================================================

console.log(`\n${colors.blue}[6] 조회 함수 테스트${colors.reset}`);

test('getQuizzesByCategory("cat") 반환', () => {
  const catQuizzes = getQuizzesByCategory('cat');
  assert(catQuizzes.knowledge.length > 0, 'Expected cat knowledge quizzes');
  assert(catQuizzes.scenario.length > 0, 'Expected cat scenario quizzes');
});

test('getQuizzesByCategory("dog") 반환', () => {
  const dogQuizzes = getQuizzesByCategory('dog');
  assert(dogQuizzes.knowledge.length > 0, 'Expected dog knowledge quizzes');
});

test('getQuizzesByCategory("nonexistent") 빈 배열 반환', () => {
  const noQuizzes = getQuizzesByCategory('nonexistent');
  assert(noQuizzes.knowledge.length === 0, 'Expected empty array');
  assert(noQuizzes.scenario.length === 0, 'Expected empty array');
});

// ============================================================================
// 7. 통계 함수 테스트
// ============================================================================

console.log(`\n${colors.blue}[7] 통계 함수 테스트${colors.reset}`);

test('QUIZ_STATS.knowledge.total이 정확함', () => {
  assert(
    QUIZ_STATS.knowledge.total === ALL_KNOWLEDGE_QUIZZES.length,
    `Expected ${ALL_KNOWLEDGE_QUIZZES.length}, got ${QUIZ_STATS.knowledge.total}`
  );
});

test('QUIZ_STATS.knowledge.byCategory() 동작', () => {
  const byCategory = QUIZ_STATS.knowledge.byCategory();
  assert(typeof byCategory === 'object', 'Expected object');
  assert(byCategory.cat > 0, 'Expected cat count > 0');
});

test('QUIZ_STATS.scenario.total이 정확함', () => {
  assert(
    QUIZ_STATS.scenario.total === ALL_SCENARIO_QUIZZES.length,
    `Expected ${ALL_SCENARIO_QUIZZES.length}, got ${QUIZ_STATS.scenario.total}`
  );
});

test('QUIZ_STATS.registeredCategories 존재', () => {
  assert(Array.isArray(QUIZ_STATS.registeredCategories), 'Expected array');
  assert(QUIZ_STATS.registeredCategories.includes('cat'), 'Expected cat in categories');
});

// ============================================================================
// 결과 출력
// ============================================================================

console.log(`\n${colors.bold}═══════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}테스트 결과${colors.reset}`);
console.log(`${colors.bold}═══════════════════════════════════════════════════════${colors.reset}`);

const total = passed + failed;
console.log(`\n총 ${total}개 테스트`);
console.log(`${colors.green}통과: ${passed}개${colors.reset}`);
if (failed > 0) {
  console.log(`${colors.red}실패: ${failed}개${colors.reset}`);
}

console.log(`\n${colors.blue}퀴즈 통계:${colors.reset}`);
console.log(`  지식 퀴즈: ${ALL_KNOWLEDGE_QUIZZES.length}개`);
console.log(`  시나리오 퀴즈: ${ALL_SCENARIO_QUIZZES.length}개`);
console.log(`  등록 카테고리: ${QUIZ_STATS.registeredCategories.join(', ')}`);

if (failed > 0) {
  process.exit(1);
}
