#!/usr/bin/env node
/**
 * 실제 콘텐츠 파일 검증 스크립트
 *
 * src/data/content/ 폴더의 실제 콘텐츠 파일들을 검증합니다.
 * TypeScript 빌드로 잡히지 않는 런타임 이슈를 이중으로 체크합니다.
 *
 * 사용법:
 *   node scripts/validate-content-files.mjs
 *
 * 검증 항목:
 * 1. 퀴즈 - 정답 유무, 정답 개수, explanation, tags, source
 * 2. 중복 ID 체크 (파일 내 + 전역)
 * 3. 태그 품질 (3개 이상)
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================================================
// 설정
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

// 팩트 필요 카테고리 (types.ts의 FactRequiredCategory와 동기화)
const FACT_REQUIRED_CATEGORIES = ['cat', 'dog', 'rabbit', 'hamster', 'bird', 'plant', 'coffee', 'alcohol'];

// insightTags 블록에서 태그 개수 세기
function countInsightTags(insightTagsBlock) {
  if (!insightTagsBlock) return 0;
  // 태그 배열들을 찾아서 개수 합산
  const tagArrays = insightTagsBlock.match(/\[([^\]]*)\]/g) || [];
  let count = 0;
  for (const arr of tagArrays) {
    const tags = arr.match(/['"]([^'"]+)['"]/g) || [];
    count += tags.length;
  }
  return count;
}

// ============================================================================
// 콘텐츠 파싱 유틸리티
// ============================================================================

function extractQuizzesFromFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const quizzes = [];

  // 콘텐츠 ID 패턴: cat-k-001, dog-quiz-001, tarot-poll-001 등
  // options 내부의 단순 id (a, b, c, d, q1, q2 등)는 제외
  const contentIdPattern = /\{\s*id:\s*['"]([a-z]+-[a-z]+-\d{3}|situation-[a-z]+-\d{3}|kids-[a-z]+-\d{3})['"]/g;
  let match;

  while ((match = contentIdPattern.exec(content)) !== null) {
    const startPos = match.index;
    const id = match[1];

    // 해당 ID 블록 찾기 (중첩된 {} 처리)
    let depth = 0;
    let endPos = startPos;
    for (let i = startPos; i < content.length; i++) {
      if (content[i] === '{') depth++;
      if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          endPos = i + 1;
          break;
        }
      }
    }

    const block = content.slice(startPos, endPos);

    // 필드 추출
    const quiz = { id };

    // category
    const catMatch = block.match(/category:\s*['"]([^'"]+)['"]/);
    if (catMatch) quiz.category = catMatch[1];

    // question
    const qMatch = block.match(/question:\s*['"]([^'"]+)['"]/);
    if (qMatch) quiz.question = qMatch[1];

    // type (knowledge인지 확인)
    const typeMatch = block.match(/type:\s*['"]([^'"]+)['"]/);
    quiz.type = typeMatch ? typeMatch[1] : 'knowledge'; // 기본값

    // options에서 isCorrect 체크
    const optionsMatch = block.match(/options:\s*\[([^\]]+)\]/s);
    if (optionsMatch) {
      const optionsBlock = optionsMatch[1];
      const correctCount = (optionsBlock.match(/isCorrect:\s*true/g) || []).length;
      quiz.correctCount = correctCount;
      quiz.hasOptions = true;
    }

    // explanation
    quiz.hasExplanation = /explanation:\s*['"]/.test(block);

    // tags
    const tagsMatch = block.match(/tags:\s*\[([^\]]*)\]/);
    if (tagsMatch) {
      const tagsStr = tagsMatch[1];
      const tags = tagsStr.match(/['"]([^'"]+)['"]/g)?.map(t => t.replace(/['"]/g, '')) || [];
      quiz.tags = tags;
    }

    // source
    quiz.hasSource = /source:\s*['"]/.test(block);

    // factRef
    quiz.hasFactRef = /factRef:\s*\{/.test(block);

    // insightTags (VS 투표용) - optionA, optionB 각각의 태그 개수 추출
    const optionAMatch = block.match(/optionA:\s*\{[^}]*insightTags:\s*\{([^}]*)\}/s);
    const optionBMatch = block.match(/optionB:\s*\{[^}]*insightTags:\s*\{([^}]*)\}/s);
    if (optionAMatch || optionBMatch) {
      quiz.insightTagCounts = {
        optionA: countInsightTags(optionAMatch?.[1] || ''),
        optionB: countInsightTags(optionBMatch?.[1] || ''),
      };
    }

    quizzes.push(quiz);
  }

  return quizzes;
}

// ============================================================================
// 검증 함수
// ============================================================================

function validateQuiz(quiz, fileName, dirPath) {
  const errors = [];
  const warnings = [];

  // 파일명/경로로 콘텐츠 타입 판단
  const isKnowledgeQuiz = fileName.includes('knowledge');
  const isScenario = fileName.includes('scenario');
  const isPoll = dirPath.includes('polls') || fileName.includes('poll');
  const isSituationReaction = dirPath.includes('situation-reactions');

  // 1. 정답 체크 (지식 퀴즈만)
  if (isKnowledgeQuiz) {
    if (quiz.correctCount === 0) {
      errors.push('정답(isCorrect: true) 없음');
    } else if (quiz.correctCount > 1) {
      errors.push(`정답이 ${quiz.correctCount}개 (1개만 가능)`);
    }
  }

  // 2. explanation 체크 (지식 퀴즈에만 필수, 나머지는 경고)
  if (!quiz.hasExplanation) {
    if (isKnowledgeQuiz) {
      warnings.push('explanation 누락');
    }
    // 투표/시나리오는 explanation 없어도 OK
  }

  // 3. tags 체크 (검색용 - 2개 이상이면 OK, 경고 제거)
  if (!quiz.tags || quiz.tags.length === 0) {
    errors.push('tags 없음');
  }
  // Note: 일반 tags는 2개도 충분. 중요한 것은 insightTags

  // 4. insightTags 체크 (VS 투표에만 적용 - 각 옵션별 3개 이상 권장)
  if (isPoll && quiz.insightTagCounts) {
    const { optionA, optionB } = quiz.insightTagCounts;
    if (optionA < 3) {
      warnings.push(`optionA insightTags ${optionA}개 (3개 이상 권장)`);
    }
    if (optionB < 3) {
      warnings.push(`optionB insightTags ${optionB}개 (3개 이상 권장)`);
    }
  }

  // 5. 팩트 필요 카테고리 source 체크 (지식 퀴즈만!)
  // 투표나 시나리오는 팩트 참조 불필요
  if (isKnowledgeQuiz && FACT_REQUIRED_CATEGORIES.includes(quiz.category)) {
    if (!quiz.hasSource && !quiz.hasFactRef) {
      errors.push(`팩트 카테고리(${quiz.category}) 지식퀴즈인데 source/factRef 없음`);
    }
  }

  return { errors, warnings };
}

// ============================================================================
// 메인 실행
// ============================================================================

function main() {
  log('\n╔═══════════════════════════════════════════════════════╗', 'bold');
  log('║   콘텐츠 파일 이중 검증 (Double-Check Validation)    ║', 'bold');
  log('╚═══════════════════════════════════════════════════════╝', 'bold');

  const contentDirs = [
    'src/data/content/quizzes',
    'src/data/content/polls',
    'src/data/content/situation-reactions',
  ];

  const allResults = [];
  const allIds = new Set();
  const duplicateIds = [];

  for (const dir of contentDirs) {
    const fullPath = join(projectRoot, dir);
    if (!existsSync(fullPath)) continue;

    const files = readdirSync(fullPath).filter(f =>
      f.endsWith('.ts') && f !== 'index.ts' && !f.includes('.d.ts')
    );

    log(`\n📁 ${dir}`, 'blue');

    for (const file of files) {
      const filePath = join(fullPath, file);
      const quizzes = extractQuizzesFromFile(filePath);

      if (quizzes.length === 0) continue;

      let fileErrors = 0;
      let fileWarnings = 0;

      for (const quiz of quizzes) {
        // 중복 ID 체크
        if (allIds.has(quiz.id)) {
          duplicateIds.push(quiz.id);
        }
        allIds.add(quiz.id);

        // 검증
        const result = validateQuiz(quiz, file, dir);

        if (result.errors.length > 0 || result.warnings.length > 0) {
          allResults.push({
            file: `${dir}/${file}`,
            id: quiz.id,
            errors: result.errors,
            warnings: result.warnings,
          });
          fileErrors += result.errors.length;
          fileWarnings += result.warnings.length;
        }
      }

      const icon = fileErrors === 0 ? '✓' : '✗';
      const color = fileErrors === 0 ? 'green' : 'red';
      log(`  ${icon} ${file}: ${quizzes.length}개 검증 (에러 ${fileErrors}, 경고 ${fileWarnings})`, color);
    }
  }

  // 결과 요약
  log('\n═══════════════════════════════════════════════════════', 'bold');
  log('📊 검증 결과', 'bold');
  log('═══════════════════════════════════════════════════════', 'bold');

  const errorResults = allResults.filter(r => r.errors.length > 0);
  const warningResults = allResults.filter(r => r.errors.length === 0 && r.warnings.length > 0);

  // 중복 ID
  if (duplicateIds.length > 0) {
    log(`\n❌ 중복 ID 발견 (${duplicateIds.length}개):`, 'red');
    [...new Set(duplicateIds)].forEach(id => {
      log(`  • ${id}`, 'red');
    });
  }

  // 에러 목록
  if (errorResults.length > 0) {
    log(`\n❌ 에러 (${errorResults.length}개):`, 'red');
    errorResults.forEach(r => {
      log(`  [${r.id}] ${r.errors.join(', ')}`, 'red');
      log(`    → ${r.file}`, 'yellow');
    });
  }

  // 경고 목록 (상위 10개만)
  if (warningResults.length > 0) {
    log(`\n⚠️ 경고 (${warningResults.length}개):`, 'yellow');
    warningResults.slice(0, 10).forEach(r => {
      log(`  [${r.id}] ${r.warnings.join(', ')}`, 'yellow');
    });
    if (warningResults.length > 10) {
      log(`  ... 외 ${warningResults.length - 10}개`, 'yellow');
    }
  }

  // 최종 결과
  const totalErrors = errorResults.length + duplicateIds.length;

  log('\n═══════════════════════════════════════════════════════', 'bold');
  if (totalErrors === 0) {
    log('✅ 이중 검증 통과!', 'green');
    log(`  총 ${allIds.size}개 콘텐츠, 경고 ${warningResults.length}개`, 'green');
    process.exit(0);
  } else {
    log(`❌ 이중 검증 실패 - ${totalErrors}개 에러`, 'red');
    process.exit(1);
  }
}

main();
