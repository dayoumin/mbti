/**
 * 레거시(data/) ↔ Next.js(next-app/src/data/) 데이터 동일성 비교 스크립트
 *
 * 사용법: node scripts/compare-data-sync.mjs
 *
 * 검사 항목:
 * 1. 각 subject의 존재 여부
 * 2. dimensions, questions, resultLabels 구조 비교
 * 3. 차이점 상세 보고
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ANSI 색상
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

const log = {
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  dim: (msg) => console.log(`${colors.dim}  ${msg}${colors.reset}`)
};

// Subject 목록
const SUBJECTS = [
  'human', 'cat', 'dog', 'rabbit', 'hamster',
  'idealType', 'plant', 'petMatch', 'coffee', 'conflictStyle'
];

// 레거시 파일 로드 (window 객체 시뮬레이션)
function loadLegacyData() {
  const data = {};

  for (const subject of SUBJECTS) {
    const filePath = join(projectRoot, 'data', 'subjects', `${subject}.js`);

    if (!existsSync(filePath)) {
      log.warn(`Legacy: ${subject}.js 파일 없음`);
      continue;
    }

    try {
      const content = readFileSync(filePath, 'utf-8');

      // window.CHEMI_SUBJECTS.subject = DATA 패턴 파싱
      const varMatch = content.match(/const\s+(\w+)_DATA\s*=\s*(\{[\s\S]*?\});?\s*(?:window|$)/i);
      if (!varMatch) {
        // 다른 패턴 시도: 직접 객체 할당
        const directMatch = content.match(/window\.CHEMI_SUBJECTS\.(\w+)\s*=\s*(\{[\s\S]*\});?/);
        if (directMatch) {
          const jsonStr = directMatch[2]
            .replace(/\/\/.*$/gm, '') // 주석 제거
            .replace(/,(\s*[}\]])/g, '$1'); // trailing comma 제거
          try {
            data[subject] = eval(`(${jsonStr})`);
          } catch (e) {
            log.error(`Legacy ${subject}: 파싱 실패 - ${e.message}`);
          }
        }
        continue;
      }

      const jsonStr = varMatch[2]
        .replace(/\/\/.*$/gm, '') // 주석 제거
        .replace(/,(\s*[}\]])/g, '$1'); // trailing comma 제거

      try {
        data[subject] = eval(`(${jsonStr})`);
      } catch (e) {
        log.error(`Legacy ${subject}: 파싱 실패 - ${e.message}`);
      }
    } catch (e) {
      log.error(`Legacy ${subject}: 로드 실패 - ${e.message}`);
    }
  }

  return data;
}

// Next.js 데이터 로드 (TS를 직접 파싱)
function loadNextData() {
  const data = {};

  for (const subject of SUBJECTS) {
    const filePath = join(projectRoot, 'next-app', 'src', 'data', 'subjects', `${subject}.ts`);

    if (!existsSync(filePath)) {
      log.warn(`Next.js: ${subject}.ts 파일 없음`);
      continue;
    }

    try {
      const content = readFileSync(filePath, 'utf-8');

      // export const subjectData: SubjectData = { ... } 패턴 파싱
      const match = content.match(/export\s+const\s+\w+Data[^=]*=\s*(\{[\s\S]*\})\s*;?\s*$/);
      if (!match) {
        log.error(`Next.js ${subject}: 데이터 패턴 찾기 실패`);
        continue;
      }

      let jsonStr = match[1]
        .replace(/\/\/.*$/gm, '') // 주석 제거
        .replace(/,(\s*[}\]])/g, '$1') // trailing comma 제거
        .replace(/(\w+):/g, '"$1":') // key를 쌍따옴표로
        .replace(/"(\w+)":\s*"(\w+)"\s+as\s+const/g, '"$1": "$2"'); // as const 제거

      try {
        data[subject] = JSON.parse(jsonStr);
      } catch (e) {
        // JSON 파싱 실패시 eval로 시도
        try {
          data[subject] = eval(`(${match[1].replace(/\/\/.*$/gm, '')})`);
        } catch (e2) {
          log.error(`Next.js ${subject}: 파싱 실패 - ${e2.message}`);
        }
      }
    } catch (e) {
      log.error(`Next.js ${subject}: 로드 실패 - ${e.message}`);
    }
  }

  return data;
}

// 깊은 비교
function deepCompare(obj1, obj2, path = '') {
  const diffs = [];

  if (typeof obj1 !== typeof obj2) {
    diffs.push({ path, type: 'type', v1: typeof obj1, v2: typeof obj2 });
    return diffs;
  }

  if (obj1 === null || obj2 === null) {
    if (obj1 !== obj2) {
      diffs.push({ path, type: 'value', v1: obj1, v2: obj2 });
    }
    return diffs;
  }

  if (typeof obj1 !== 'object') {
    if (obj1 !== obj2) {
      diffs.push({ path, type: 'value', v1: obj1, v2: obj2 });
    }
    return diffs;
  }

  if (Array.isArray(obj1) !== Array.isArray(obj2)) {
    diffs.push({ path, type: 'structure', v1: 'array', v2: 'object' });
    return diffs;
  }

  if (Array.isArray(obj1)) {
    if (obj1.length !== obj2.length) {
      diffs.push({ path, type: 'length', v1: obj1.length, v2: obj2.length });
    }
    const minLen = Math.min(obj1.length, obj2.length);
    for (let i = 0; i < minLen; i++) {
      diffs.push(...deepCompare(obj1[i], obj2[i], `${path}[${i}]`));
    }
    return diffs;
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const allKeys = new Set([...keys1, ...keys2]);

  for (const key of allKeys) {
    const newPath = path ? `${path}.${key}` : key;

    if (!(key in obj1)) {
      diffs.push({ path: newPath, type: 'missing_legacy', v2: typeof obj2[key] });
    } else if (!(key in obj2)) {
      diffs.push({ path: newPath, type: 'missing_next', v1: typeof obj1[key] });
    } else {
      diffs.push(...deepCompare(obj1[key], obj2[key], newPath));
    }
  }

  return diffs;
}

// 메인 비교 실행
function runComparison() {
  console.log('\n🔍 레거시 ↔ Next.js 데이터 동일성 비교\n');
  console.log('─'.repeat(50));

  const legacyData = loadLegacyData();
  const nextData = loadNextData();

  console.log(`\n📦 로드된 데이터:`);
  console.log(`   Legacy: ${Object.keys(legacyData).length}개 subjects`);
  console.log(`   Next.js: ${Object.keys(nextData).length}개 subjects\n`);
  console.log('─'.repeat(50));

  let totalIssues = 0;
  const summary = [];

  for (const subject of SUBJECTS) {
    console.log(`\n📋 ${subject}`);

    const legacy = legacyData[subject];
    const next = nextData[subject];

    if (!legacy && !next) {
      log.dim('양쪽 모두 없음');
      summary.push({ subject, status: 'none' });
      continue;
    }

    if (!legacy) {
      log.warn('Legacy 없음 - Next.js만 존재');
      summary.push({ subject, status: 'next_only' });
      totalIssues++;
      continue;
    }

    if (!next) {
      log.warn('Next.js 없음 - Legacy만 존재');
      summary.push({ subject, status: 'legacy_only' });
      totalIssues++;
      continue;
    }

    // 주요 필드 비교
    const fieldsToCompare = ['title', 'dimensions', 'questions', 'deepQuestions', 'resultLabels'];
    const subjectDiffs = [];

    for (const field of fieldsToCompare) {
      if (legacy[field] && next[field]) {
        const diffs = deepCompare(legacy[field], next[field], field);
        if (diffs.length > 0) {
          subjectDiffs.push({ field, diffs });
        }
      } else if (legacy[field] && !next[field]) {
        subjectDiffs.push({ field, diffs: [{ type: 'missing_next' }] });
      } else if (!legacy[field] && next[field]) {
        subjectDiffs.push({ field, diffs: [{ type: 'missing_legacy' }] });
      }
    }

    if (subjectDiffs.length === 0) {
      log.success('동일함');
      summary.push({ subject, status: 'sync' });
    } else {
      log.error(`${subjectDiffs.length}개 필드에서 차이 발견`);

      for (const { field, diffs } of subjectDiffs) {
        const uniqueDiffs = diffs.slice(0, 3); // 처음 3개만 표시
        log.dim(`  ${field}: ${diffs.length}개 차이`);

        for (const diff of uniqueDiffs) {
          if (diff.type === 'value') {
            log.dim(`    ${diff.path}: "${diff.v1}" → "${diff.v2}"`);
          } else if (diff.type === 'length') {
            log.dim(`    ${diff.path}: 길이 ${diff.v1} → ${diff.v2}`);
          } else if (diff.type === 'missing_next') {
            log.dim(`    ${diff.path}: Next.js에 없음`);
          } else if (diff.type === 'missing_legacy') {
            log.dim(`    ${diff.path}: Legacy에 없음`);
          }
        }

        if (diffs.length > 3) {
          log.dim(`    ... 외 ${diffs.length - 3}개`);
        }
      }

      summary.push({ subject, status: 'diff', count: subjectDiffs.length });
      totalIssues++;
    }
  }

  // 요약
  console.log('\n' + '═'.repeat(50));
  console.log('\n📊 요약\n');

  const syncCount = summary.filter(s => s.status === 'sync').length;
  const diffCount = summary.filter(s => s.status === 'diff').length;
  const missingCount = summary.filter(s => ['next_only', 'legacy_only'].includes(s.status)).length;

  console.log(`   ✓ 동기화됨: ${syncCount}개`);
  console.log(`   ✗ 차이 있음: ${diffCount}개`);
  console.log(`   ⚠ 한쪽만 존재: ${missingCount}개`);

  if (totalIssues === 0) {
    console.log(`\n${colors.green}✅ 모든 데이터가 동기화되어 있습니다!${colors.reset}\n`);
    process.exit(0);
  } else {
    console.log(`\n${colors.red}❌ ${totalIssues}개 subject에서 동기화 필요${colors.reset}\n`);
    process.exit(1);
  }
}

runComparison();
