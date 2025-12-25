#!/usr/bin/env node
/**
 * 콘텐츠 통합 검증 스크립트
 *
 * 모든 검증을 한 번에 실행합니다:
 * 1. 형식 검증 (validate-content-samples.mjs)
 * 2. 연령 등급 검증
 * 3. 태그 품질 검증
 *
 * 사용법:
 *   node scripts/validate-all-content.mjs
 *   node scripts/validate-all-content.mjs --fix  # 자동 수정 가능한 것만
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================================================
// 색상 출력
// ============================================================================
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  bold: '\x1b[1m',
};

function log(msg, color = 'reset') {
  console.log(`${colors[color]}${msg}${colors.reset}`);
}

// ============================================================================
// 1. 형식 검증 (기존 스크립트 호출)
// ============================================================================
function runFormatValidation() {
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('📋 1단계: 형식 검증 (샘플 데이터)', 'bold');
  log('═══════════════════════════════════════════════════════', 'blue');

  try {
    execSync('node scripts/validate-content-samples.mjs', {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    return { success: true, errors: 0 };
  } catch (e) {
    return { success: false, errors: 1 };
  }
}

// ============================================================================
// 1.5. 실제 콘텐츠 파일 이중 검증
// ============================================================================
function runContentFilesValidation() {
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('🔍 1.5단계: 콘텐츠 파일 이중 검증', 'bold');
  log('═══════════════════════════════════════════════════════', 'blue');

  try {
    execSync('node scripts/validate-content-files.mjs', {
      cwd: projectRoot,
      stdio: 'inherit'
    });
    return { success: true, errors: 0 };
  } catch (e) {
    return { success: false, errors: 1 };
  }
}

// ============================================================================
// 2. 연령 등급 검증
// ============================================================================

// 성인 키워드 (맥락 없이 단순 키워드만)
const ADULT_KEYWORDS_STRICT = [
  '술자리', '음주', '취하', '숙취', '건배', '술집', '2차', '3차',
  '베팅', '판돈', '도박',
  '19금', '야한', '원나잇',
];

// 오탐 방지 패턴 (이건 성인용 아님)
const FALSE_POSITIVE_PATTERNS = [
  /술래/, /와인딩/, /칵테일\s*드레스/, /칵테일\s*새우/,
  /막걸리\s*빵/, /맥주효모/, /(와인|위스키)\s*색/,
  /포커\s*페이스/, /경마장\s*(근처|맛집)/, /카지노\s*인테리어/,
];

function checkAgeRating(text, hasMeta) {
  // 오탐 패턴 먼저 체크
  for (const pattern of FALSE_POSITIVE_PATTERNS) {
    if (pattern.test(text)) {
      return { needsAdult: false, reason: '오탐 패턴' };
    }
  }

  // 성인 키워드 체크
  for (const keyword of ADULT_KEYWORDS_STRICT) {
    if (text.includes(keyword)) {
      if (!hasMeta) {
        return { needsAdult: true, reason: `"${keyword}" 포함` };
      }
    }
  }

  return { needsAdult: false, reason: null };
}

function runAgeRatingValidation() {
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('🔞 2단계: 연령 등급 검증', 'bold');
  log('═══════════════════════════════════════════════════════', 'blue');

  const contentDirs = [
    'src/data/content/quizzes',
    'src/data/content/polls',
    'src/data/content/situation-reactions',
  ];

  const issues = [];
  let totalChecked = 0;

  for (const dir of contentDirs) {
    const fullPath = join(projectRoot, dir);
    if (!existsSync(fullPath)) continue;

    const files = readdirSync(fullPath).filter(f => f.endsWith('.ts') && f !== 'index.ts');

    for (const file of files) {
      const filePath = join(fullPath, file);
      const content = readFileSync(filePath, 'utf-8');

      // 간단한 파싱: 각 객체 블록 찾기
      const idMatches = [...content.matchAll(/id:\s*['"]([^'"]+)['"]/g)];
      const questionMatches = [...content.matchAll(/question:\s*['"]([^'"]+)['"]/g)];
      const situationMatches = [...content.matchAll(/situation:\s*['"]([^'"]+)['"]/g)];

      for (let i = 0; i < idMatches.length; i++) {
        const id = idMatches[i][1];
        const text = questionMatches[i]?.[1] || situationMatches[i]?.[1] || '';

        // 해당 ID 근처에 meta가 있는지 확인
        const idPos = idMatches[i].index;
        const nextIdPos = idMatches[i + 1]?.index || content.length;
        const block = content.slice(idPos, nextIdPos);
        const hasMeta = /ageRating.*adult|isAdultOnly.*true/.test(block);

        const result = checkAgeRating(text, hasMeta);
        totalChecked++;

        if (result.needsAdult) {
          issues.push({
            id,
            file: `${dir}/${file}`,
            text: text.substring(0, 50) + '...',
            reason: result.reason,
          });
        }
      }
    }
  }

  log(`\n검사 완료: ${totalChecked}개 콘텐츠`, 'green');

  if (issues.length === 0) {
    log('✅ 연령 등급 문제 없음', 'green');
    return { success: true, errors: 0, issues: [] };
  } else {
    log(`\n❌ 연령 등급 문제 ${issues.length}개 발견:`, 'red');
    for (const issue of issues) {
      log(`  [${issue.id}] ${issue.reason}`, 'red');
      log(`    → ${issue.text}`, 'yellow');
      log(`    파일: ${issue.file}`, 'yellow');
    }
    return { success: false, errors: issues.length, issues };
  }
}

// ============================================================================
// 3. 태그 품질 검증
// ============================================================================
function runTagValidation() {
  log('\n═══════════════════════════════════════════════════════', 'blue');
  log('🏷️  3단계: 태그 품질 검증', 'bold');
  log('═══════════════════════════════════════════════════════', 'blue');

  const contentDirs = [
    'src/data/content/quizzes',
    'src/data/content/polls',
    'src/data/content/situation-reactions',
  ];

  const issues = [];
  const allTags = new Map(); // tag -> count
  let totalWithTags = 0;
  let totalWithout = 0;

  for (const dir of contentDirs) {
    const fullPath = join(projectRoot, dir);
    if (!existsSync(fullPath)) continue;

    const files = readdirSync(fullPath).filter(f => f.endsWith('.ts') && f !== 'index.ts');

    for (const file of files) {
      const filePath = join(fullPath, file);
      const content = readFileSync(filePath, 'utf-8');

      // 콘텐츠 블록별 파싱 (options 내부 id 제외하기 위해)
      // 패턴: id로 시작하고 category가 따라오는 콘텐츠 객체만 대상
      const contentBlocks = [...content.matchAll(/\{\s*id:\s*['"]([^'"]+)['"][^}]*?category:\s*['"]([^'"]+)['"][^}]*?\}/gs)];

      // 더 정확한 방법: 각 콘텐츠 항목을 개별 파싱
      // 콘텐츠 ID 패턴: cat-k-001, dog-quiz-001 등 (하이픈 포함 긴 ID)
      const contentIdPattern = /id:\s*['"]([a-z]+-[a-z]+-\d{3}|[a-z]+-[a-z]+-[a-z]+-\d{3}|situation-[a-z]+-\d{3})['"]/g;
      const contentIds = [...content.matchAll(contentIdPattern)];

      for (const match of contentIds) {
        const id = match[1];
        const idPos = match.index;

        // 해당 ID 이후 다음 콘텐츠 ID 또는 파일 끝까지의 블록 찾기
        const nextMatch = contentIds.find(m => m.index > idPos);
        const blockEnd = nextMatch ? nextMatch.index : content.length;
        const block = content.slice(idPos, blockEnd);

        // 블록 내에서 tags 찾기
        const tagMatch = block.match(/tags:\s*\[([^\]]*)\]/);

        if (!tagMatch || tagMatch[1].trim() === '') {
          totalWithout++;
          issues.push({
            id,
            file: `${dir}/${file}`,
            type: 'missing',
            message: 'tags 누락',
          });
        } else {
          totalWithTags++;
          // 태그 파싱
          const tagStr = tagMatch[1];
          const tags = tagStr.match(/['"]([^'"]+)['"]/g)?.map(t => t.replace(/['"]/g, '')) || [];

          if (tags.length < 3) {
            issues.push({
              id,
              file: `${dir}/${file}`,
              type: 'insufficient',
              message: `tags ${tags.length}개 (3개 이상 권장)`,
            });
          }

          // 태그 빈도 수집
          for (const tag of tags) {
            allTags.set(tag, (allTags.get(tag) || 0) + 1);
          }
        }
      }
    }
  }

  const missingCount = issues.filter(i => i.type === 'missing').length;
  const insufficientCount = issues.filter(i => i.type === 'insufficient').length;

  log(`\n태그 현황:`, 'green');
  log(`  - 태그 있음: ${totalWithTags}개`, 'green');
  log(`  - 태그 없음: ${totalWithout}개`, totalWithout > 0 ? 'red' : 'green');
  log(`  - 3개 미만: ${insufficientCount}개`, insufficientCount > 0 ? 'yellow' : 'green');

  // 태그 통계
  const sortedTags = [...allTags.entries()].sort((a, b) => b[1] - a[1]);
  log(`\n가장 많이 사용된 태그:`, 'blue');
  sortedTags.slice(0, 5).forEach(([tag, count]) => {
    log(`  ${tag}: ${count}회`, 'blue');
  });

  if (missingCount > 0) {
    log(`\n❌ 태그 누락 ${missingCount}개 (에러):`, 'red');
    issues.filter(i => i.type === 'missing').slice(0, 5).forEach(issue => {
      log(`  [${issue.id}] ${issue.file}`, 'red');
    });
    if (missingCount > 5) log(`  ... 외 ${missingCount - 5}개`, 'red');

    return { success: false, errors: missingCount, warnings: insufficientCount };
  }

  if (insufficientCount > 0) {
    log(`\n⚠️ 태그 부족 ${insufficientCount}개 (경고):`, 'yellow');
  }

  log('\n✅ 태그 필수 조건 충족', 'green');
  return { success: true, errors: 0, warnings: insufficientCount };
}

// ============================================================================
// 메인 실행
// ============================================================================
async function main() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'bold');
  log('║     콘텐츠 통합 검증 (Content Validation Suite)      ║', 'bold');
  log('╚═══════════════════════════════════════════════════════╝', 'bold');

  const results = {
    format: { success: true, errors: 0 },
    contentFiles: { success: true, errors: 0 },
    ageRating: { success: true, errors: 0 },
    tags: { success: true, errors: 0 },
  };

  // 1. 형식 검증 (샘플 데이터)
  results.format = runFormatValidation();

  // 1.5. 콘텐츠 파일 이중 검증
  results.contentFiles = runContentFilesValidation();

  // 2. 연령 등급 검증
  results.ageRating = runAgeRatingValidation();

  // 3. 태그 품질 검증
  results.tags = runTagValidation();

  // 최종 요약
  log('\n╔═══════════════════════════════════════════════════════╗', 'bold');
  log('║                    최종 결과                          ║', 'bold');
  log('╚═══════════════════════════════════════════════════════╝', 'bold');

  const totalErrors = results.format.errors + results.contentFiles.errors + results.ageRating.errors + results.tags.errors;

  log(`\n1. 형식 검증 (샘플): ${results.format.success ? '✅ 통과' : '❌ 실패'}`, results.format.success ? 'green' : 'red');
  log(`2. 콘텐츠 이중검증: ${results.contentFiles.success ? '✅ 통과' : '❌ 실패'}`, results.contentFiles.success ? 'green' : 'red');
  log(`3. 연령 등급: ${results.ageRating.success ? '✅ 통과' : '❌ 실패'}`, results.ageRating.success ? 'green' : 'red');
  log(`4. 태그 품질: ${results.tags.success ? '✅ 통과' : '❌ 실패'}`, results.tags.success ? 'green' : 'red');

  if (totalErrors === 0) {
    log('\n🎉 모든 검증 통과!', 'green');
    process.exit(0);
  } else {
    log(`\n❌ 총 ${totalErrors}개 에러 발견 - 수정 필요`, 'red');
    process.exit(1);
  }
}

main().catch(console.error);
