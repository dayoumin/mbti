/**
 * matchResultLabel 로직 테스트
 *
 * 검증 항목:
 * 1. 완전 매칭 - 조건이 많은 것 우선
 * 2. 부분 매칭 - 가장 많이 일치하는 것 선택
 * 3. 각 결과 유형 도달 가능성
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// 색상
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  dim: '\x1b[2m'
};

const log = {
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  dim: (msg) => console.log(`${colors.dim}  ${msg}${colors.reset}`)
};

// 상수
const CHEMI_CONSTANTS = {
  MAX_SCORE_PER_QUESTION: 5,
  MIN_SCORE_PER_QUESTION: 1,
  DEFAULT_QUESTION_COUNT: 5,
  LEVEL_THRESHOLDS: { HIGH: 60, LOW: 40 },
  LEVELS: { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
};

// 점수 레벨 판정
function getScoreLevel(score, maxScore) {
  const { LEVEL_THRESHOLDS, LEVELS } = CHEMI_CONSTANTS;
  const percentage = (score / maxScore) * 100;
  if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH;
  if (percentage <= LEVEL_THRESHOLDS.LOW) return LEVELS.LOW;
  return LEVELS.MEDIUM;
}

// 매칭 로직 (수정된 버전)
function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
  const { MAX_SCORE_PER_QUESTION, DEFAULT_QUESTION_COUNT } = CHEMI_CONSTANTS;

  const levels = {};
  Object.keys(dimensions).forEach(dim => {
    const questionCount = dimCounts[dim] || DEFAULT_QUESTION_COUNT;
    const maxScore = questionCount * MAX_SCORE_PER_QUESTION;
    levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
  });

  // 완전 일치 찾기 (조건이 더 많은 것 우선)
  let bestExactMatch = null;
  let bestExactConditionCount = 0;

  for (const result of resultLabels) {
    const condition = result.condition;
    const conditionKeys = Object.keys(condition);

    // 조건이 없으면 완전 매칭 대상에서 제외
    if (conditionKeys.length === 0) continue;

    let match = true;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] !== level) {
        match = false;
        break;
      }
    }

    // 완전 일치 + 조건이 더 많으면 우선 선택
    if (match && conditionKeys.length > bestExactConditionCount) {
      bestExactMatch = result;
      bestExactConditionCount = conditionKeys.length;
    }
  }

  if (bestExactMatch) return { result: bestExactMatch, matchType: 'exact', levels };

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
  return { result: bestMatch, matchType: 'partial', matchCount: bestScore, levels };
}

// conflictStyle 데이터 로드
function loadConflictStyleData() {
  const filePath = join(projectRoot, 'next-app', 'src', 'data', 'subjects', 'conflictStyle.ts');
  const content = readFileSync(filePath, 'utf-8');

  const match = content.match(/export\s+const\s+\w+Data[^=]*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!match) throw new Error('데이터 파싱 실패');

  return eval(`(${match[1].replace(/\/\/.*$/gm, '')})`);
}

// 테스트 케이스: 각 결과 유형별 시나리오
function generateTestCases(data) {
  const { dimensions, resultLabels } = data;
  const dimKeys = Object.keys(dimensions);

  const testCases = [];

  // 각 결과 유형에 대해 완전 매칭 테스트 케이스 생성
  for (const result of resultLabels) {
    const scores = {};
    const condition = result.condition;

    // 기본 점수 (medium에 해당)
    for (const dim of dimKeys) {
      scores[dim] = 8; // 3문항 * 5점 = 15, 8/15 = 53% (medium)
    }

    // 조건에 맞게 점수 조정
    for (const [dim, level] of Object.entries(condition)) {
      if (level === 'high') {
        scores[dim] = 13; // 13/15 = 87% (high)
      } else if (level === 'low') {
        scores[dim] = 4; // 4/15 = 27% (low)
      } else if (level === 'medium') {
        scores[dim] = 8; // 8/15 = 53% (medium)
      }
    }

    testCases.push({
      name: result.name,
      expectedResult: result.name,
      scores,
      conditionCount: Object.keys(condition).length
    });
  }

  return testCases;
}

// 경쟁 상황 테스트 케이스
function generateCompetitionCases(data) {
  return [
    {
      name: '열정적 파이터 vs 솔직한 전달자 (3조건 vs 3조건)',
      description: 'assert+express+engage HIGH → 파이터가 더 많은 조건으로 우선',
      scores: { assert: 13, engage: 13, repair: 8, empathy: 4, express: 13, support: 8 },
      expectedResult: '열정적 파이터'
    },
    {
      name: '적극적 협력가 vs 열정적 파이터 (둘 다 3조건)',
      description: 'assert+engage HIGH, empathy HIGH → 협력가',
      scores: { assert: 13, engage: 13, repair: 8, empathy: 13, express: 8, support: 8 },
      expectedResult: '적극적 협력가'
    },
    {
      name: '평화로운 중재자 vs 신중한 관찰자 (2조건 경쟁)',
      description: 'assert LOW, empathy HIGH, engage/express LOW → 둘 다 매칭 가능, 먼저 나오는 것 선택',
      scores: { assert: 4, engage: 4, repair: 8, empathy: 13, express: 4, support: 8 },
      expectedResult: '평화로운 중재자' // 또는 신중한 관찰자 (동일 조건 개수)
    },
    {
      name: '밸런스 소통가 (medium 조건)',
      description: 'assert+empathy MEDIUM → 밸런스 소통가',
      scores: { assert: 8, engage: 8, repair: 8, empathy: 8, express: 8, support: 8 },
      expectedResult: '밸런스 소통가'
    }
  ];
}

// 테스트 실행
function runTests() {
  console.log('\n🧪 matchResultLabel 로직 테스트\n');
  console.log('─'.repeat(60));

  const data = loadConflictStyleData();
  const { dimensions, resultLabels } = data;

  // 차원별 문항 수 계산
  const dimCounts = {};
  for (const q of data.questions) {
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
  }

  console.log('\n📊 차원별 문항 수:');
  for (const [dim, count] of Object.entries(dimCounts)) {
    log.dim(`${dim}: ${count}문항 (max: ${count * 5}점)`);
  }

  // 점수 범위 분석
  console.log('\n📈 레벨 판정 기준 (문항 3개 기준, max=15):');
  log.dim(`HIGH: 9점 이상 (60%+)`);
  log.dim(`MEDIUM: 7-8점 (40-60%)`);
  log.dim(`LOW: 6점 이하 (40%-)`);

  let passed = 0;
  let failed = 0;

  // 1. 기본 도달성 테스트
  console.log('\n\n📋 1. 결과 유형 도달성 테스트\n');

  const basicCases = generateTestCases(data);

  for (const tc of basicCases) {
    const { result, matchType, levels } = matchResultLabel(tc.scores, dimensions, resultLabels, dimCounts);

    if (result.name === tc.expectedResult) {
      log.success(`${tc.name} (${tc.conditionCount}조건) - ${matchType}`);
      passed++;
    } else {
      log.error(`${tc.name}`);
      log.dim(`  예상: ${tc.expectedResult}`);
      log.dim(`  실제: ${result.name} (${matchType})`);
      log.dim(`  레벨: ${JSON.stringify(levels)}`);
      failed++;
    }
  }

  // 2. 경쟁 상황 테스트
  console.log('\n\n📋 2. 경쟁 상황 테스트\n');

  const competitionCases = generateCompetitionCases(data);

  for (const tc of competitionCases) {
    const { result, matchType, levels, matchCount } = matchResultLabel(tc.scores, dimensions, resultLabels, dimCounts);

    if (result.name === tc.expectedResult) {
      log.success(`${tc.name}`);
      log.dim(`  ${tc.description}`);
      passed++;
    } else {
      log.error(`${tc.name}`);
      log.dim(`  ${tc.description}`);
      log.dim(`  예상: ${tc.expectedResult}`);
      log.dim(`  실제: ${result.name} (${matchType}, matchCount: ${matchCount || 'N/A'})`);
      log.dim(`  레벨: ${JSON.stringify(levels)}`);
      failed++;
    }
  }

  // 3. 결과 유형별 조건 분석
  console.log('\n\n📋 3. 결과 유형 조건 분석\n');

  const conditionAnalysis = resultLabels.map(r => ({
    name: r.name,
    conditions: Object.entries(r.condition).map(([k, v]) => `${k}:${v}`).join(', ') || '(없음)',
    count: Object.keys(r.condition).length
  })).sort((a, b) => b.count - a.count);

  for (const item of conditionAnalysis) {
    const status = item.count >= 2 ? colors.green : colors.yellow;
    console.log(`${status}  ${item.name}: ${item.conditions} (${item.count}조건)${colors.reset}`);
  }

  // 요약
  console.log('\n' + '═'.repeat(60));
  console.log('\n📊 테스트 결과\n');
  console.log(`   통과: ${colors.green}${passed}${colors.reset}`);
  console.log(`   실패: ${colors.red}${failed}${colors.reset}`);

  if (failed === 0) {
    console.log(`\n${colors.green}✅ 모든 테스트 통과!${colors.reset}\n`);
  } else {
    console.log(`\n${colors.red}❌ ${failed}개 테스트 실패${colors.reset}\n`);
  }

  return { passed, failed };
}

runTests();
