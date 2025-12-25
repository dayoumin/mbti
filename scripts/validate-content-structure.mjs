#!/usr/bin/env node
/**
 * 콘텐츠 구조 검증 스크립트 (퀴즈/투표/토너먼트)
 *
 * 사용법:
 *   node scripts/validate-content-structure.mjs           # 전체 검증
 *   node scripts/validate-content-structure.mjs --verbose # 상세 출력
 *   node scripts/validate-content-structure.mjs --json    # JSON 형식 출력
 *
 * 검증 항목:
 * 1. 퀴즈 - id, question, options, 정답 유무, tags
 * 2. 시나리오 - 점수 범위 연속성, 최대 점수 일치
 * 3. 투표 - VS는 2개 옵션, choice는 3-5개 옵션
 * 4. 토너먼트 - participants >= roundSize, 중복 ID
 * 5. 상황별 반응 - category, tag, personalityMapping
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import vm from 'vm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// ============================================================
// 설정
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

// ============================================================
// 타입별 검증 함수
// ============================================================

// 유효한 카테고리 목록
const VALID_CATEGORIES = ['cat', 'dog', 'rabbit', 'hamster', 'plant', 'love', 'personality', 'lifestyle', 'food', 'general', 'work'];

// 팩트 필요 카테고리 목록 (지식 퀴즈는 팩트 참조 필수)
const FACT_REQUIRED_CATEGORIES = ['cat', 'dog', 'rabbit', 'hamster', 'plant', 'coffee', 'alcohol'];

// 연령 등급은 AI가 생성 시점에 판단하여 meta에 추가
// 검증 스크립트는 meta 필드 형식만 확인 (키워드 감지 제거 - false positive 방지)

function validateQuiz(quiz) {
  const errors = [];
  const warnings = [];

  if (!quiz.id) errors.push('id 필수');
  if (!quiz.question) errors.push('question 필수');
  if (!quiz.options || quiz.options.length < 2) errors.push('options 최소 2개 필요');

  // category 유효성 검사
  if (quiz.category && !VALID_CATEGORIES.includes(quiz.category)) {
    warnings.push(`category '${quiz.category}'가 표준 카테고리 아님`);
  }

  if (quiz.type === 'knowledge') {
    const hasCorrect = quiz.options?.some(o => o.isCorrect);
    if (!hasCorrect) errors.push('knowledge 퀴즈는 정답(isCorrect: true) 필수');

    const correctCount = quiz.options?.filter(o => o.isCorrect).length || 0;
    if (correctCount > 1) errors.push('정답은 1개만 가능');

    if (!quiz.explanation) warnings.push('explanation 권장');

    // 팩트 필요 카테고리 지식 퀴즈는 팩트 참조 필수
    if (FACT_REQUIRED_CATEGORIES.includes(quiz.category)) {
      const hasFactRef = quiz.source || quiz.factRef;
      if (!hasFactRef) {
        errors.push(`팩트 필요 카테고리(${quiz.category}) 지식 퀴즈는 source 또는 factRef 필수`);
      } else if (quiz.factRef && quiz.factRef.factId) {
        // factRef 형식 검증
        const factIdPattern = /^[a-z]+-fact-\d{3}$/;
        if (!factIdPattern.test(quiz.factRef.factId)) {
          warnings.push(`factRef.factId 형식 오류: ${quiz.factRef.factId} (권장: {category}-fact-{000})`);
        }
      }
    }
  }

  if (!quiz.difficulty || ![1, 2, 3].includes(quiz.difficulty)) {
    warnings.push('difficulty는 1, 2, 3 중 하나 권장');
  }

  // tags 필수 검증 (추천 시스템)
  if (!quiz.tags || quiz.tags.length === 0) {
    errors.push('tags 필수 (추천 시스템)');
  } else {
    if (quiz.tags.length < 3) warnings.push('tags 3개 이상 권장');
    // 영어 태그 검사
    const englishTags = quiz.tags.filter(t => /^[a-zA-Z]+$/.test(t));
    if (englishTags.length > 0) warnings.push(`한글 태그 권장: ${englishTags.join(', ')}`);
  }

  // 연령 등급은 AI가 생성 시점에 맥락을 판단하여 meta 추가
  // (키워드 자동 감지 제거 - "술래잡기" 같은 오탐 방지)

  return {
    type: 'quiz',
    id: quiz.id,
    category: quiz.category,  // 팩트 검증용
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateScenario(scenario) {
  const errors = [];
  const warnings = [];

  if (!scenario.id) errors.push('id 필수');
  if (!scenario.title) errors.push('title 필수');
  if (!scenario.questions || scenario.questions.length < 3) errors.push('questions 최소 3개 필요');
  if (!scenario.results || scenario.results.length < 2) errors.push('results 최소 2개 필요');

  if (scenario.questions && scenario.results) {
    // 점수 범위 연속성 체크
    const sortedResults = [...scenario.results].sort((a, b) => a.minScore - b.minScore);
    let prevMax = -1;
    for (const result of sortedResults) {
      if (result.minScore !== prevMax + 1 && prevMax !== -1) {
        warnings.push(`점수 범위 갭: ${prevMax} ~ ${result.minScore}`);
      }
      prevMax = result.maxScore;
    }

    // 최대 점수 계산 & 체크
    const maxPossibleScore = scenario.questions.reduce((sum, q) => {
      const maxPoints = Math.max(...(q.options?.map(o => o.points) || [0]));
      return sum + maxPoints;
    }, 0);

    const lastResult = sortedResults[sortedResults.length - 1];
    if (lastResult && lastResult.maxScore !== maxPossibleScore) {
      warnings.push(`최대 가능 점수(${maxPossibleScore})와 최고 등급 maxScore(${lastResult.maxScore}) 불일치`);
    }
  }

  return {
    type: 'scenario',
    id: scenario.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function validatePoll(poll) {
  const errors = [];
  const warnings = [];

  if (!poll.id) errors.push('id 필수');
  if (!poll.question) errors.push('question 필수');
  if (!poll.options || poll.options.length < 2) errors.push('options 최소 2개 필요');

  // category 유효성 검사
  if (poll.category && !VALID_CATEGORIES.includes(poll.category)) {
    warnings.push(`category '${poll.category}'가 표준 카테고리 아님`);
  }

  if (poll.type === 'vs' && poll.options?.length !== 2) {
    errors.push('vs 타입은 정확히 2개 옵션 필요');
  }

  if (poll.type === 'choice') {
    if (poll.options?.length < 3) warnings.push('choice 타입은 3개 이상 옵션 권장');
    if (poll.options?.length > 5) warnings.push('choice 타입은 5개 이하 옵션 권장');
  }

  // tags 필수 검증 (추천 시스템)
  if (!poll.tags || poll.tags.length === 0) {
    errors.push('tags 필수 (추천 시스템)');
  } else {
    if (poll.tags.length < 3) warnings.push('tags 3개 이상 권장');
    const englishTags = poll.tags.filter(t => /^[a-zA-Z]+$/.test(t));
    if (englishTags.length > 0) warnings.push(`한글 태그 권장: ${englishTags.join(', ')}`);
  }

  // 이모지 체크
  const hasEmoji = poll.options?.some(o => o.emoji);
  const allEmoji = poll.options?.every(o => o.emoji);
  if (hasEmoji && !allEmoji) warnings.push('일부 옵션에만 emoji 있음');

  // 연령 등급은 AI가 생성 시점에 맥락을 판단하여 meta 추가

  return {
    type: 'poll',
    id: poll.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateSituationReaction(sr) {
  const errors = [];
  const warnings = [];

  if (!sr.id) errors.push('id 필수');
  if (!sr.situation) errors.push('situation 필수');
  if (!sr.question) errors.push('question 필수');
  if (!sr.options || sr.options.length < 2) errors.push('options 최소 2개 필요');
  if (!sr.category) errors.push('category 필수');

  // ID와 category 일치 확인
  if (sr.id && sr.category) {
    const idCategory = sr.id.split('-')[2]; // situation-reaction-{category}-xxx
    if (idCategory !== sr.category) {
      errors.push(`ID(${sr.id})와 category(${sr.category}) 불일치`);
    }
  }

  // 유효한 category 확인
  const validCategories = ['relationship', 'work', 'social', 'awkward'];
  if (sr.category && !validCategories.includes(sr.category)) {
    errors.push(`잘못된 category: ${sr.category}`);
  }

  // 각 옵션에 tag가 있는지 확인
  const validTags = ['cool', 'emotional', 'rational', 'avoidant', 'confrontational', 'humorous', 'caring', 'passive'];
  const missingTags = sr.options?.filter(o => !o.tag);
  if (missingTags && missingTags.length > 0) {
    errors.push(`옵션 ${missingTags.map(o => o.id).join(', ')}에 tag 필수`);
  }

  // tag 유효성 확인
  sr.options?.forEach(o => {
    if (o.tag && !validTags.includes(o.tag)) {
      warnings.push(`옵션 ${o.id}의 tag '${o.tag}'가 표준 태그 아님`);
    }
  });

  // personalityMapping 권장
  if (!sr.personalityMapping || Object.keys(sr.personalityMapping).length === 0) {
    warnings.push('personalityMapping 권장 (성격별 통계용)');
  }

  // tags 필수 검증 (추천 시스템)
  if (!sr.tags || sr.tags.length === 0) {
    errors.push('tags 필수 (추천 시스템)');
  } else {
    if (sr.tags.length < 3) warnings.push('tags 3개 이상 권장');
    const englishTags = sr.tags.filter(t => /^[a-zA-Z]+$/.test(t));
    if (englishTags.length > 0) warnings.push(`한글 태그 권장: ${englishTags.join(', ')}`);
  }

  // 연령 등급은 AI가 생성 시점에 맥락을 판단하여 meta 추가

  return {
    type: 'situation-reaction',
    id: sr.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

function validateTournament(tournament) {
  const errors = [];
  const warnings = [];

  if (!tournament.id) errors.push('id 필수');
  if (!tournament.title) errors.push('title 필수');
  if (!tournament.contestants || tournament.contestants.length < 4) {
    errors.push('contestants 최소 4개 필요');
  }
  if (!tournament.roundSize) errors.push('roundSize 필수');

  // roundSize 유효성
  const validRoundSizes = [4, 8, 16, 32, 64];
  if (tournament.roundSize && !validRoundSizes.includes(tournament.roundSize)) {
    errors.push(`roundSize는 ${validRoundSizes.join(', ')} 중 하나여야 함`);
  }

  // contestants >= roundSize
  if (tournament.contestants && tournament.roundSize) {
    if (tournament.contestants.length < tournament.roundSize) {
      errors.push(`참가자(${tournament.contestants.length})가 라운드 크기(${tournament.roundSize})보다 적음`);
    }
    if (tournament.contestants.length === tournament.roundSize) {
      warnings.push('참가자 수가 정확히 라운드 수와 같음 - 여유 참가자 추가 권장');
    }
  }

  // 중복 ID 체크
  if (tournament.contestants) {
    const ids = tournament.contestants.map(c => c.id);
    const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
    if (duplicates.length > 0) {
      errors.push(`중복 contestant id: ${[...new Set(duplicates)].join(', ')}`);
    }

    // description 체크
    const noDesc = tournament.contestants.filter(c => !c.description);
    if (noDesc.length > 0) {
      warnings.push(`${noDesc.length}개 참가자에 description 없음`);
    }

    // funFact 체크
    const noFunFact = tournament.contestants.filter(c => !c.funFact);
    if (noFunFact.length > tournament.contestants.length * 0.5) {
      warnings.push('funFact 누락 참가자 많음 (결과 화면용 권장)');
    }
  }

  return {
    type: 'tournament',
    id: tournament.id,
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

// ============================================================
// 데이터 로더
// ============================================================

/**
 * 안전한 JS 표현식 파싱 (vm.runInNewContext 사용)
 * eval 대신 샌드박스 환경에서 실행하여 보안 강화
 */
function safeEval(code) {
  const sandbox = Object.create(null); // 프로토타입 없는 빈 객체
  return vm.runInNewContext(code, sandbox, {
    timeout: 5000, // 5초 타임아웃
    displayErrors: true
  });
}

function loadContentSamples() {
  const filePath = join(projectRoot, 'src', 'app', 'dashboard', 'data', 'dashboard-content.ts');

  if (!existsSync(filePath)) {
    console.error(`${colors.red}파일 없음: ${filePath}${colors.reset}`);
    return null;
  }

  const content = readFileSync(filePath, 'utf-8');

  // 각 배열/객체 추출
  const data = {};

  // 퀴즈 배열 추출
  const quizMatch = content.match(/export\s+const\s+CAT_KNOWLEDGE_QUIZZES[^=]*=\s*(\[[\s\S]*?\]);/);
  if (quizMatch) {
    try {
      data.quizzes = safeEval(quizMatch[1]);
    } catch (e) {
      console.error('퀴즈 파싱 실패:', e.message);
    }
  }

  // 시나리오 추출
  const scenarioMatch = content.match(/export\s+const\s+CAT_BUTLER_SCENARIO[^=]*=\s*(\{[\s\S]*?\n\};)/);
  if (scenarioMatch) {
    try {
      data.scenario = safeEval(`(${scenarioMatch[1].replace(/;$/, '')})`);
    } catch (e) {
      console.error('시나리오 파싱 실패:', e.message);
    }
  }

  // VS 투표 추출
  const vsMatch = content.match(/export\s+const\s+CAT_VS_POLLS[^=]*=\s*(\[[\s\S]*?\]);/);
  if (vsMatch) {
    try {
      data.vsPolls = safeEval(vsMatch[1]);
    } catch (e) {
      console.error('VS 투표 파싱 실패:', e.message);
    }
  }

  // Choice 투표 추출
  const choiceMatch = content.match(/export\s+const\s+CAT_CHOICE_POLLS[^=]*=\s*(\[[\s\S]*?\]);/);
  if (choiceMatch) {
    try {
      data.choicePolls = safeEval(choiceMatch[1]);
    } catch (e) {
      console.error('Choice 투표 파싱 실패:', e.message);
    }
  }

  // 강아지 품종 투표 추출
  const dogBreedMatch = content.match(/export\s+const\s+DOG_BREED_POLLS[^=]*=\s*(\[[\s\S]*?\]);/);
  if (dogBreedMatch) {
    try {
      data.dogBreedPolls = safeEval(dogBreedMatch[1]);
    } catch (e) {
      console.error('강아지 품종 투표 파싱 실패:', e.message);
    }
  }

  // 상황별 반응 투표 추출
  const srMatch = content.match(/export\s+const\s+SITUATION_REACTION_POLLS[^=]*=\s*(\[[\s\S]*?\]);/);
  if (srMatch) {
    try {
      data.situationReactionPolls = safeEval(srMatch[1]);
    } catch (e) {
      console.error('상황별 반응 투표 파싱 실패:', e.message);
    }
  }

  return data;
}

function loadTournamentSamples() {
  const filePath = join(projectRoot, 'src', 'app', 'dashboard', 'data', 'tournament-sample.ts');

  if (!existsSync(filePath)) {
    return null;
  }

  const content = readFileSync(filePath, 'utf-8');

  // 1. 먼저 contestants 배열 추출
  const contestantsMatch = content.match(/export\s+const\s+CAT_BREED_CONTESTANTS[^=]*=\s*(\[[\s\S]*?\n\];)/);
  let contestants = null;
  if (contestantsMatch) {
    try {
      contestants = safeEval(contestantsMatch[1]);
    } catch (e) {
      console.error('참가자 배열 파싱 실패:', e.message);
    }
  }

  // 2. 토너먼트 추출 (contestants 참조를 실제 배열로 대체)
  const match = content.match(/export\s+const\s+CAT_BREED_TOURNAMENT[^=]*=\s*(\{[\s\S]*?\n\};)/);
  if (match && contestants) {
    try {
      // CAT_BREED_CONTESTANTS 참조를 실제 데이터로 대체
      const tournamentCode = match[1]
        .replace(/;$/, '')
        .replace(/contestants:\s*CAT_BREED_CONTESTANTS/, `contestants: ${JSON.stringify(contestants)}`);
      return safeEval(`(${tournamentCode})`);
    } catch (e) {
      console.error('토너먼트 파싱 실패:', e.message);
      return null;
    }
  }

  return null;
}

// ============================================================
// 메인 실행
// ============================================================

function main() {
  const args = process.argv.slice(2);
  const verbose = args.includes('--verbose');
  const jsonOutput = args.includes('--json');

  if (!jsonOutput) {
    console.log('\n' + '═'.repeat(60));
    console.log(`${colors.bold}📋 콘텐츠 샘플 검증${colors.reset}`);
    console.log('═'.repeat(60));
  }

  const results = [];

  // 1. 콘텐츠 샘플 로드
  const contentData = loadContentSamples();
  if (!contentData) {
    console.error(`${colors.red}콘텐츠 샘플 로드 실패${colors.reset}`);
    process.exit(1);
  }

  // 2. 퀴즈 검증
  if (contentData.quizzes) {
    for (const quiz of contentData.quizzes) {
      const result = validateQuiz(quiz);
      results.push(result);
    }
  }

  // 3. 시나리오 검증
  if (contentData.scenario) {
    const result = validateScenario(contentData.scenario);
    results.push(result);
  }

  // 4. VS 투표 검증
  if (contentData.vsPolls) {
    for (const poll of contentData.vsPolls) {
      const result = validatePoll(poll);
      results.push(result);
    }
  }

  // 5. Choice 투표 검증
  if (contentData.choicePolls) {
    for (const poll of contentData.choicePolls) {
      const result = validatePoll(poll);
      results.push(result);
    }
  }

  // 6. 강아지 품종 투표 검증
  if (contentData.dogBreedPolls) {
    for (const poll of contentData.dogBreedPolls) {
      const result = validatePoll(poll);
      results.push(result);
    }
  }

  // 7. 상황별 반응 투표 검증
  if (contentData.situationReactionPolls) {
    for (const sr of contentData.situationReactionPolls) {
      const result = validateSituationReaction(sr);
      results.push(result);
    }
  }

  // 8. 토너먼트 검증
  const tournament = loadTournamentSamples();
  if (tournament) {
    const result = validateTournament(tournament);
    results.push(result);
  }

  // 9. 글로벌 중복 ID 체크 (verbose 출력 전에 수행)
  const allIds = results.map(r => r.id).filter(Boolean);
  const duplicateIds = allIds.filter((id, idx) => allIds.indexOf(id) !== idx);
  if (duplicateIds.length > 0) {
    const uniqueDuplicates = [...new Set(duplicateIds)];
    for (const dupId of uniqueDuplicates) {
      // 중복 ID를 가진 모든 결과에 에러 추가
      results.forEach(r => {
        if (r.id === dupId) {
          r.errors.push(`글로벌 중복 ID: ${dupId}`);
          r.isValid = false;
        }
      });
    }
  }

  // 10. verbose 모드 상세 출력 (글로벌 검증 완료 후)
  if (verbose && !jsonOutput) {
    if (contentData.quizzes) {
      console.log(`\n${colors.cyan}🧠 퀴즈 검증 (${contentData.quizzes.length}개)${colors.reset}`);
      results.filter(r => r.type === 'quiz').forEach(r => printResult(r));
    }

    if (contentData.scenario) {
      console.log(`\n${colors.cyan}📖 시나리오 퀴즈 검증${colors.reset}`);
      results.filter(r => r.type === 'scenario').forEach(r => printResult(r));
    }

    if (contentData.vsPolls || contentData.choicePolls || contentData.dogBreedPolls) {
      const pollResults = results.filter(r => r.type === 'poll');
      console.log(`\n${colors.cyan}📊 투표 검증 (${pollResults.length}개)${colors.reset}`);
      pollResults.forEach(r => printResult(r));
    }

    if (contentData.situationReactionPolls) {
      console.log(`\n${colors.cyan}🎭 상황별 반응 투표 검증 (${contentData.situationReactionPolls.length}개)${colors.reset}`);
      results.filter(r => r.type === 'situation-reaction').forEach(r => printResult(r));
    }

    if (tournament) {
      console.log(`\n${colors.cyan}🏆 토너먼트 검증${colors.reset}`);
      results.filter(r => r.type === 'tournament').forEach(r => printResult(r));
    }

    console.log(`\n${colors.cyan}🔍 글로벌 ID 중복 검사${colors.reset}`);
    if (duplicateIds.length > 0) {
      console.log(`  ${colors.red}✗ 중복 ID 발견: ${[...new Set(duplicateIds)].join(', ')}${colors.reset}`);
    } else {
      console.log(`  ${colors.green}✓ 중복 ID 없음${colors.reset}`);
    }
  }

  // 11. 팩트 참조 통계 계산
  const factRequiredQuizzes = results.filter(r =>
    r.type === 'quiz' &&
    r.category &&
    FACT_REQUIRED_CATEGORIES.includes(r.category)
  );
  const factMissingQuizzes = factRequiredQuizzes.filter(r =>
    r.errors.some(e => e.includes('팩트 필요 카테고리'))
  );

  // 12. 결과 요약
  const summary = {
    total: results.length,
    valid: results.filter(r => r.isValid).length,
    invalid: results.filter(r => !r.isValid).length,
    withWarnings: results.filter(r => r.warnings.length > 0).length,
    factCheck: {
      required: factRequiredQuizzes.length,
      missing: factMissingQuizzes.length,
      covered: factRequiredQuizzes.length - factMissingQuizzes.length,
    },
    byType: {
      quiz: results.filter(r => r.type === 'quiz'),
      scenario: results.filter(r => r.type === 'scenario'),
      poll: results.filter(r => r.type === 'poll'),
      'situation-reaction': results.filter(r => r.type === 'situation-reaction'),
      tournament: results.filter(r => r.type === 'tournament'),
    }
  };

  if (jsonOutput) {
    console.log(JSON.stringify({ summary, results }, null, 2));
    process.exit(summary.invalid > 0 ? 1 : 0);
  }

  // 콘솔 출력 요약
  console.log('\n' + '═'.repeat(60));
  console.log(`${colors.bold}📊 요약${colors.reset}`);
  console.log('═'.repeat(60));

  console.log(`\n=== 콘텐츠 샘플 검증 결과 ===\n`);

  // 타입별 결과
  for (const [type, typeResults] of Object.entries(summary.byType)) {
    if (typeResults.length > 0) {
      const validCount = typeResults.filter(r => r.isValid).length;
      const icon = validCount === typeResults.length ? '✅' : '⚠️';
      console.log(`${icon} ${type}: ${validCount}/${typeResults.length}개 검증 완료`);
    }
  }

  console.log(`\n=== 요약 ===`);
  console.log(`총 콘텐츠: ${summary.total}`);
  console.log(`${colors.green}유효: ${summary.valid}${colors.reset}`);
  console.log(`${colors.red}무효: ${summary.invalid}${colors.reset}`);
  console.log(`${colors.yellow}경고 있음: ${summary.withWarnings}${colors.reset}`);

  // 팩트 참조 통계
  if (summary.factCheck.required > 0) {
    console.log(`\n=== 📚 팩트 참조 검증 ===`);
    console.log(`팩트 필요 카테고리 퀴즈: ${summary.factCheck.required}개`);
    if (summary.factCheck.missing === 0) {
      console.log(`${colors.green}✓ 팩트 참조 있음: ${summary.factCheck.covered}개 (100%)${colors.reset}`);
    } else {
      console.log(`${colors.green}✓ 팩트 참조 있음: ${summary.factCheck.covered}개${colors.reset}`);
      console.log(`${colors.red}✗ 팩트 참조 없음: ${summary.factCheck.missing}개${colors.reset}`);
    }
  }

  // 에러/경고 목록
  const errorItems = results.filter(r => !r.isValid);
  const warningItems = results.filter(r => r.isValid && r.warnings.length > 0);

  if (errorItems.length > 0) {
    console.log(`\n=== ❌ 에러 목록 ===`);
    for (const item of errorItems) {
      console.log(`${colors.red}[${item.type}] ${item.id}: ${item.errors.join(', ')}${colors.reset}`);
    }
  }

  if (warningItems.length > 0) {
    console.log(`\n=== ⚠️ 경고 목록 ===`);
    for (const item of warningItems) {
      console.log(`${colors.yellow}[${item.type}] ${item.id}: [ ${item.warnings.map(w => `'${w}'`).join(', ')} ]${colors.reset}`);
    }
  }

  if (summary.invalid === 0) {
    console.log(`\n${colors.green}✨ 검증 완료!${colors.reset}`);
  } else {
    console.log(`\n${colors.red}❌ ${summary.invalid}개 콘텐츠에 에러 있음${colors.reset}`);
  }

  console.log('\n');
  process.exit(summary.invalid > 0 ? 1 : 0);
}

function printResult(result) {
  const icon = result.isValid ? '✓' : '✗';
  const color = result.isValid ? colors.green : colors.red;

  console.log(`  ${color}${icon}${colors.reset} ${result.id}`);

  if (result.errors.length > 0) {
    for (const e of result.errors) {
      console.log(`    ${colors.red}• ${e}${colors.reset}`);
    }
  }

  if (result.warnings.length > 0) {
    for (const w of result.warnings) {
      console.log(`    ${colors.yellow}• ${w}${colors.reset}`);
    }
  }
}

main();
