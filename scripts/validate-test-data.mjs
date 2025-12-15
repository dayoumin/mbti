#!/usr/bin/env node
/**
 * 테스트 데이터 통합 검증 프레임워크
 *
 * 사용법:
 *   node scripts/validate-test-data.mjs              # 전체 검증
 *   node scripts/validate-test-data.mjs conflictStyle # 특정 테스트만
 *   node scripts/validate-test-data.mjs --fix        # 자동 수정 가능한 이슈 표시
 *
 * 검증 항목:
 * 1. 구조 검증 - 필수 필드, 타입 체크
 * 2. 차원 검증 - 질문-차원 매핑, 차원별 문항 수
 * 3. 결과 검증 - 조건 유효성, 도달 가능성
 * 4. 동기화 검증 - Legacy ↔ Next.js 일치
 * 5. 질문 품질 - 중복, 유사도, 점수 분포
 */

import { readFileSync, existsSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================================
// 설정
// ============================================================

const SUBJECTS = [
  'human', 'cat', 'dog', 'rabbit', 'hamster',
  'idealType', 'plant', 'petMatch', 'coffee', 'tea', 'conflictStyle',
  'fruit', 'alcohol', 'bread', 'perfume', 'aroma',
  // petMatch 세부 테스트
  'dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'
];

const CHEMI_CONSTANTS = {
  MAX_SCORE_PER_QUESTION: 5,
  MIN_SCORE_PER_QUESTION: 1,
  DEFAULT_QUESTION_COUNT: 5,
  LEVEL_THRESHOLDS: { HIGH: 60, LOW: 40 },
  LEVELS: { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
};

const REQUIRED_FIELDS = {
  root: ['title', 'dimensions', 'questions', 'resultLabels'],
  dimension: ['name', 'emoji', 'desc'],
  question: ['q', 'dimension', 'a'],
  answer: ['text', 'score'],
  resultLabel: ['name', 'emoji', 'desc', 'condition', 'matchPoints', 'interpretation', 'guide']
};

// 세부 테스트 (petMatch 하위)에서 detailInfo 필수인 테스트
const DETAIL_INFO_REQUIRED_TESTS = [
  'dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'
];

// detailInfo 권장 필드
const DETAIL_INFO_RECOMMENDED_FIELDS = [
  'origin', 'lifespan', 'size', 'weight',
  'personality', 'goodWith', 'notGoodWith',
  'exerciseNeeds', 'groomingNeeds', 'sheddingLevel', 'trainingDifficulty',
  'healthIssues', 'monthlyCost', 'initialCost', 'tips'
];

// ============================================================
// 유틸리티
// ============================================================

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m',
  bold: '\x1b[1m'
};

class ValidationResult {
  constructor(subject) {
    this.subject = subject;
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  error(category, message, details = null) {
    this.errors.push({ category, message, details });
  }

  warn(category, message, details = null) {
    this.warnings.push({ category, message, details });
  }

  addInfo(category, message, details = null) {
    this.info.push({ category, message, details });
  }

  get isValid() {
    return this.errors.length === 0;
  }

  print() {
    const icon = this.isValid ? '✓' : '✗';
    const color = this.isValid ? colors.green : colors.red;

    console.log(`\n${color}${icon} ${this.subject}${colors.reset}`);

    if (this.errors.length > 0) {
      console.log(`  ${colors.red}오류 (${this.errors.length}):${colors.reset}`);
      for (const e of this.errors) {
        console.log(`    ${colors.red}• [${e.category}] ${e.message}${colors.reset}`);
        if (e.details) console.log(`      ${colors.dim}${e.details}${colors.reset}`);
      }
    }

    if (this.warnings.length > 0) {
      console.log(`  ${colors.yellow}경고 (${this.warnings.length}):${colors.reset}`);
      for (const w of this.warnings) {
        console.log(`    ${colors.yellow}• [${w.category}] ${w.message}${colors.reset}`);
        if (w.details) console.log(`      ${colors.dim}${w.details}${colors.reset}`);
      }
    }

    if (this.info.length > 0 && (this.errors.length > 0 || this.warnings.length > 0)) {
      console.log(`  ${colors.blue}정보:${colors.reset}`);
      for (const i of this.info) {
        console.log(`    ${colors.dim}• ${i.message}${colors.reset}`);
      }
    }
  }
}

// ============================================================
// 데이터 로더
// ============================================================

function loadNextData(subject) {
  const filePath = join(projectRoot, 'src', 'data', 'subjects', `${subject}.ts`);
  if (!existsSync(filePath)) return null;

  const content = readFileSync(filePath, 'utf-8');
  const match = content.match(/export\s+const\s+\w+Data[^=]*=\s*(\{[\s\S]*\})\s*;?\s*$/);
  if (!match) return null;

  try {
    return eval(`(${match[1].replace(/\/\/.*$/gm, '')})`);
  } catch (e) {
    return null;
  }
}

function loadLegacyData(subject) {
  const filePath = join(projectRoot, 'data', 'subjects', `${subject}.js`);
  if (!existsSync(filePath)) return null;

  const content = readFileSync(filePath, 'utf-8');

  // const SUBJECT_DATA = { ... } 패턴
  const varMatch = content.match(/const\s+\w+_DATA\s*=\s*(\{[\s\S]*?\});?\s*(?:window|$)/i);
  if (varMatch) {
    try {
      return eval(`(${varMatch[1].replace(/\/\/.*$/gm, '')})`);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// ============================================================
// 검증 함수들
// ============================================================

// 1. 구조 검증
function validateStructure(data, result) {
  // 루트 필드 체크
  for (const field of REQUIRED_FIELDS.root) {
    if (!(field in data)) {
      result.error('구조', `필수 필드 누락: ${field}`);
    }
  }

  // dimensions 체크
  if (data.dimensions) {
    for (const [key, dim] of Object.entries(data.dimensions)) {
      for (const field of REQUIRED_FIELDS.dimension) {
        if (!(field in dim)) {
          result.error('구조', `차원 '${key}'에 필드 누락: ${field}`);
        }
      }
    }
  }

  // questions 체크
  if (data.questions) {
    data.questions.forEach((q, idx) => {
      for (const field of REQUIRED_FIELDS.question) {
        if (!(field in q)) {
          result.error('구조', `질문 #${idx + 1}에 필드 누락: ${field}`);
        }
      }

      if (q.a) {
        q.a.forEach((a, aidx) => {
          for (const field of REQUIRED_FIELDS.answer) {
            if (!(field in a)) {
              result.error('구조', `질문 #${idx + 1} 답변 #${aidx + 1}에 필드 누락: ${field}`);
            }
          }
        });
      }
    });
  }

  // resultLabels 체크
  if (data.resultLabels) {
    data.resultLabels.forEach((r, idx) => {
      for (const field of REQUIRED_FIELDS.resultLabel) {
        if (!(field in r)) {
          result.warn('구조', `결과 '${r.name || idx}'에 필드 누락: ${field}`);
        }
      }
    });
  }
}

// 2. 차원 검증
function validateDimensions(data, result) {
  if (!data.dimensions || !data.questions) return;

  const dimKeys = Object.keys(data.dimensions);
  const dimCounts = {};

  // 차원별 문항 수 카운트
  for (const q of data.questions) {
    if (!dimKeys.includes(q.dimension)) {
      result.error('차원', `질문의 차원이 정의되지 않음: ${q.dimension}`, q.q?.substring(0, 30));
    }
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
  }

  // 차원별 문항 수 균형 체크
  const counts = Object.values(dimCounts);
  const minCount = Math.min(...counts);
  const maxCount = Math.max(...counts);

  if (maxCount - minCount > 1) {
    result.warn('차원', `차원별 문항 수 불균형`,
      Object.entries(dimCounts).map(([k, v]) => `${k}:${v}`).join(', '));
  }

  // 사용되지 않는 차원 체크
  for (const dim of dimKeys) {
    if (!dimCounts[dim]) {
      result.error('차원', `차원에 해당하는 질문이 없음: ${dim}`);
    }
  }

  result.addInfo('차원', `${dimKeys.length}개 차원, ${data.questions.length}개 질문`);
}

// 3. 결과 검증
function validateResults(data, result) {
  if (!data.dimensions || !data.resultLabels || !data.questions) return;

  const dimKeys = Object.keys(data.dimensions);
  const dimCounts = {};
  for (const q of data.questions) {
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
  }

  // 각 결과의 조건 검증
  const conditionCounts = [];

  for (const r of data.resultLabels) {
    const condition = r.condition || {};
    const conditionKeys = Object.keys(condition);
    conditionCounts.push({ name: r.name, count: conditionKeys.length });

    // 조건의 차원이 유효한지 체크
    for (const dim of conditionKeys) {
      if (!dimKeys.includes(dim)) {
        result.error('결과', `결과 '${r.name}'의 조건에 잘못된 차원: ${dim}`);
      }
    }

    // 조건의 레벨이 유효한지 체크
    for (const [dim, level] of Object.entries(condition)) {
      if (!['high', 'medium', 'low'].includes(level)) {
        result.error('결과', `결과 '${r.name}'의 조건에 잘못된 레벨: ${dim}=${level}`);
      }
    }
  }

  // 조건 없는 결과 체크
  const emptyConditions = conditionCounts.filter(c => c.count === 0);
  if (emptyConditions.length > 0) {
    result.warn('결과', `조건 없는 결과 유형 존재 (fallback만 가능)`,
      emptyConditions.map(c => c.name).join(', '));
  }

  // 중복 조건 체크
  const conditionMap = new Map();
  for (const r of data.resultLabels) {
    const condKey = JSON.stringify(Object.entries(r.condition || {}).sort());
    if (conditionMap.has(condKey) && condKey !== '[]') {
      result.warn('결과', `중복 조건`, `'${conditionMap.get(condKey)}' = '${r.name}'`);
    }
    conditionMap.set(condKey, r.name);
  }

  // 도달 가능성 시뮬레이션
  const reachable = simulateReachability(data, dimCounts);
  const unreachable = data.resultLabels.filter(r => !reachable.has(r.name));

  if (unreachable.length > 0) {
    result.warn('결과', `도달 불가능한 결과 유형`, unreachable.map(r => r.name).join(', '));
  }

  result.addInfo('결과', `${data.resultLabels.length}개 결과 유형`);
}

// 도달 가능성 시뮬레이션
function simulateReachability(data, dimCounts) {
  const { dimensions, resultLabels } = data;
  const dimKeys = Object.keys(dimensions);
  const reachable = new Set();

  // 각 결과의 조건을 만족하는 점수 조합 생성
  for (const r of resultLabels) {
    const condition = r.condition || {};
    const scores = {};

    // 기본값: medium
    for (const dim of dimKeys) {
      const qCount = dimCounts[dim] || 3;
      scores[dim] = Math.round(qCount * 5 * 0.5); // 50%
    }

    // 조건에 맞게 조정
    for (const [dim, level] of Object.entries(condition)) {
      const qCount = dimCounts[dim] || 3;
      const maxScore = qCount * 5;

      if (level === 'high') {
        scores[dim] = Math.ceil(maxScore * 0.7); // 70%
      } else if (level === 'low') {
        scores[dim] = Math.floor(maxScore * 0.3); // 30%
      } else {
        scores[dim] = Math.round(maxScore * 0.5); // 50%
      }
    }

    // 매칭 테스트
    const matched = matchResultLabel(scores, dimensions, resultLabels, dimCounts);
    if (matched) {
      reachable.add(matched.name);
    }
  }

  return reachable;
}

// 간소화된 매칭 로직
function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
  const { MAX_SCORE_PER_QUESTION, DEFAULT_QUESTION_COUNT, LEVEL_THRESHOLDS, LEVELS } = CHEMI_CONSTANTS;

  const levels = {};
  Object.keys(dimensions).forEach(dim => {
    const questionCount = dimCounts[dim] || DEFAULT_QUESTION_COUNT;
    const maxScore = questionCount * MAX_SCORE_PER_QUESTION;
    const percentage = (scores[dim] || 0) / maxScore * 100;

    if (percentage >= LEVEL_THRESHOLDS.HIGH) levels[dim] = LEVELS.HIGH;
    else if (percentage <= LEVEL_THRESHOLDS.LOW) levels[dim] = LEVELS.LOW;
    else levels[dim] = LEVELS.MEDIUM;
  });

  // 완전 일치 (조건 많은 것 우선)
  let bestMatch = null;
  let bestCount = 0;

  for (const result of resultLabels) {
    const condition = result.condition || {};
    const conditionKeys = Object.keys(condition);
    if (conditionKeys.length === 0) continue;

    let match = true;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] !== level) {
        match = false;
        break;
      }
    }

    if (match && conditionKeys.length > bestCount) {
      bestMatch = result;
      bestCount = conditionKeys.length;
    }
  }

  if (bestMatch) return bestMatch;

  // 부분 매칭
  let partialBest = resultLabels[resultLabels.length - 1];
  let partialScore = 0;

  for (const result of resultLabels) {
    const condition = result.condition || {};
    let matchCount = 0;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] === level) matchCount++;
    }
    if (matchCount > partialScore) {
      partialScore = matchCount;
      partialBest = result;
    }
  }

  return partialBest;
}

// 4. 데이터 로드 (레거시 동기화 검증 제거됨)
function loadData(subject, result) {
  const nextData = loadNextData(subject);

  if (!nextData) {
    result.error('데이터', 'Next.js 데이터 없음');
    return null;
  }

  return nextData;
}

// 5. 질문 품질 검증
function validateQuestionQuality(data, result) {
  if (!data.questions) return;

  // 점수 분포 체크
  const scoreDistribution = { '5/1': 0, '5/2': 0, '5/3': 0, 'other': 0 };

  for (const q of data.questions) {
    if (!q.a) continue;

    const scores = q.a.map(a => a.score).sort((a, b) => b - a);

    if (scores.length === 2) {
      if (scores[0] === 5 && scores[1] === 1) scoreDistribution['5/1']++;
      else if (scores[0] === 5 && scores[1] === 2) scoreDistribution['5/2']++;
      else if (scores[0] === 5 && scores[1] === 3) scoreDistribution['5/3']++;
      else scoreDistribution['other']++;
    } else {
      scoreDistribution['other']++;
    }
  }

  // 5/1 이분법만 사용하면 경고
  if (scoreDistribution['5/1'] === data.questions.length) {
    result.warn('품질', '모든 질문이 5/1 이분법 사용',
      'medium 레벨 도달 어려움 - 일부 질문에 중간 점수(3점) 추가 권장');
  }

  // 질문 중복 체크 (간단한 유사도)
  const questionTexts = data.questions.map(q => q.q);
  for (let i = 0; i < questionTexts.length; i++) {
    for (let j = i + 1; j < questionTexts.length; j++) {
      if (questionTexts[i] === questionTexts[j]) {
        result.error('품질', `중복 질문`, `#${i + 1}, #${j + 1}: "${questionTexts[i].substring(0, 30)}..."`);
      }
    }
  }

  result.addInfo('품질', `점수 분포: 5/1=${scoreDistribution['5/1']}, 5/2=${scoreDistribution['5/2']}, 기타=${scoreDistribution['other']}`);
}

// 6. detailInfo 검증 (세부 테스트 전용)
function validateDetailInfo(data, result, subject) {
  if (!DETAIL_INFO_REQUIRED_TESTS.includes(subject)) return;
  if (!data.resultLabels) return;

  let withDetailInfo = 0;
  let withoutDetailInfo = 0;
  const missingFields = {};

  for (const r of data.resultLabels) {
    if (r.detailInfo) {
      withDetailInfo++;

      // 권장 필드 체크
      for (const field of DETAIL_INFO_RECOMMENDED_FIELDS) {
        if (!(field in r.detailInfo)) {
          missingFields[field] = (missingFields[field] || 0) + 1;
        }
      }
    } else {
      withoutDetailInfo++;
      result.warn('detailInfo', `detailInfo 누락: "${r.name}"`,
        '세부 테스트 결과에는 상세 정보 추가 권장');
    }
  }

  // 누락 필드 요약 (50% 이상 누락 시 경고)
  const threshold = Math.floor(data.resultLabels.length * 0.5);
  for (const [field, count] of Object.entries(missingFields)) {
    if (count > threshold) {
      result.warn('detailInfo', `${count}개 결과에서 '${field}' 필드 누락`);
    }
  }

  if (withDetailInfo > 0) {
    result.addInfo('detailInfo', `${withDetailInfo}/${data.resultLabels.length}개 결과에 detailInfo 있음`);
  }

  if (withoutDetailInfo === data.resultLabels.length) {
    result.warn('detailInfo', '모든 결과에 detailInfo 없음',
      '세부 테스트에는 품종/종류 상세 정보 추가 필요');
  }
}

// ============================================================
// 메인 실행
// ============================================================

function validateSubject(subject) {
  const result = new ValidationResult(subject);

  // 1. 데이터 로드
  const data = loadData(subject, result);
  if (!data) {
    return result;
  }

  // 2. 구조 검증
  validateStructure(data, result);

  // 3. 차원 검증
  validateDimensions(data, result);

  // 4. 결과 검증
  validateResults(data, result);

  // 5. 질문 품질 검증
  validateQuestionQuality(data, result);

  // 6. detailInfo 검증 (세부 테스트 전용)
  validateDetailInfo(data, result, subject);

  return result;
}

function main() {
  const args = process.argv.slice(2);
  const targetSubject = args.find(a => !a.startsWith('-'));
  const showFix = args.includes('--fix');

  console.log('\n' + '═'.repeat(60));
  console.log(`${colors.bold}📋 테스트 데이터 통합 검증${colors.reset}`);
  console.log('═'.repeat(60));

  const subjectsToValidate = targetSubject ? [targetSubject] : SUBJECTS;
  const results = [];

  for (const subject of subjectsToValidate) {
    if (!SUBJECTS.includes(subject)) {
      console.log(`${colors.red}알 수 없는 subject: ${subject}${colors.reset}`);
      continue;
    }
    results.push(validateSubject(subject));
  }

  // 결과 출력
  for (const result of results) {
    result.print();
  }

  // 요약
  console.log('\n' + '═'.repeat(60));
  console.log(`${colors.bold}📊 요약${colors.reset}`);
  console.log('═'.repeat(60));

  const passed = results.filter(r => r.isValid).length;
  const failed = results.filter(r => !r.isValid).length;
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);

  console.log(`\n  검증됨: ${results.length}개 테스트`);
  console.log(`  ${colors.green}통과: ${passed}${colors.reset}`);
  console.log(`  ${colors.red}실패: ${failed}${colors.reset}`);
  console.log(`  총 오류: ${totalErrors}, 경고: ${totalWarnings}`);

  if (showFix) {
    console.log(`\n${colors.cyan}💡 자동 수정 권장 사항:${colors.reset}`);
    console.log(`  - 동기화 문제: node scripts/compare-data-sync.mjs`);
    console.log(`  - 도달 불가 결과: 조건 수정 또는 매칭 순서 조정`);
    console.log(`  - 5/1 이분법: 일부 질문에 중간 점수 추가`);
  }

  console.log('\n');

  process.exit(failed > 0 ? 1 : 0);
}

main();
