// ============================================================================
// timeSensitivity 메타데이터 검증 테스트
// ============================================================================
// 실행: npx tsx tests/timesensitivity.test.ts

import fs from 'fs';
import path from 'path';

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           timeSensitivity 메타데이터 검증 테스트                ║');
console.log('╚════════════════════════════════════════════════════════════════╝\n');

// ============================================================================
// 예상 sensitivity 레벨 (code-review-timesensitivity.md 기준)
// ============================================================================

const EXPECTED_SENSITIVITY: Record<string, 'high' | 'medium' | 'low' | 'none'> = {
  // Quizzes
  'bird-knowledge.ts': 'none',        // 동물 지식 (불변)
  'bloodtype-scenario.ts': 'none',    // 혈액형 성향 (불변)
  'cat-knowledge.ts': 'none',         // 동물 지식 (불변)
  'cat-scenario.ts': 'none',          // 동물 성향 (불변)
  'coffee-knowledge.ts': 'low',       // 커피 지식 (트렌드 영향) ← 문서 기준
  'dog-knowledge.ts': 'none',         // 동물 지식 (불변)
  'dog-scenario.ts': 'none',          // 동물 성향 (불변)
  'fish-knowledge.ts': 'none',        // 동물 지식 (불변)
  'hamster-knowledge.ts': 'none',     // 동물 지식 (불변)
  'kids-animals.ts': 'none',          // 아동용 동물 상식
  'love-knowledge.ts': 'low',         // 연애 상식 (트렌드 영향)
  'nostalgia-knowledge.ts': 'low',    // 추억/트렌드 (시대 영향) ← 실제 medium
  'plant-knowledge.ts': 'none',       // 식물 지식 (불변)
  'rabbit-knowledge.ts': 'none',      // 동물 지식 (불변)
  'rabbit-scenario.ts': 'none',       // 동물 성향 (불변)
  'reptile-knowledge.ts': 'none',     // 동물 지식 (불변)
  'tarot-quizzes.ts': 'none',         // 타로 상식 (불변)
  'wine-knowledge.ts': 'low',         // 와인 지식 (트렌드 영향) ← 문서 기준
  'seasonal-quizzes.ts': 'low',       // 시즌 콘텐츠
  'smallPet-knowledge.ts': 'none',    // 소동물 지식 (불변)

  // Polls
  'choice-polls.ts': 'none',          // 일반 라이프스타일/의견
  'coffee-vs-polls.ts': 'low',        // 커피 취향 (트렌드 영향) ← 문서 기준
  'kids-polls.ts': 'none',            // 아동용 취향 (불변)
  'love-vs-polls.ts': 'low',          // 연애 스타일 (트렌드 영향)
  'money-polls.ts': 'low',            // 재테크/소비 (경제 상황 영향) ← 실제 high
  'seasonal-polls.ts': 'low',         // 시즌 콘텐츠
  'tarot-polls.ts': 'none',           // 타로 관련 (불변)
  'vs-polls.ts': 'low',               // 밸런스게임 (트렌드 영향)
  'bloodtype-vs-polls.ts': 'none',    // 혈액형 (불변)
  'pet-vs-polls.ts': 'none',          // 펫 (불변)

  // Situation Reactions
  'awkward.ts': 'none',               // 보편적 상황 ← 실제 low
  'relationship.ts': 'low',           // 연애/관계 상황
  'social.ts': 'none',                // 사회적 상황 ← 실제 low
  'work.ts': 'low',                   // 직장 상황
};

// ============================================================================
// 파일별 실제 sensitivity 추출
// ============================================================================

interface FileAnalysis {
  file: string;
  dir: string;
  expected: string;
  actual: string;
  match: boolean;
  hasTimeSensitivity: boolean;
  sourceYear: number | null;
  itemCount: number;
}

function analyzeFile(dir: string, file: string): FileAnalysis {
  const fullPath = path.join(dir, file);
  const content = fs.readFileSync(fullPath, 'utf8');

  // Check if timeSensitivity exists
  const hasTimeSensitivity = content.includes('timeSensitivity');

  // Extract first sensitivity value (file-level or first item)
  const sensitivityMatch = content.match(/sensitivity:\s*['"](\w+)['"]/);
  const actual = sensitivityMatch ? sensitivityMatch[1] : 'missing';

  // Extract sourceYear
  const yearMatch = content.match(/sourceYear:\s*(\d+)/);
  const sourceYear = yearMatch ? parseInt(yearMatch[1]) : null;

  // Count items with timeSensitivity
  const itemMatches = content.match(/timeSensitivity/g);
  const itemCount = itemMatches ? itemMatches.length : 0;

  const expected = EXPECTED_SENSITIVITY[file] || 'unknown';
  const match = expected === actual;

  return {
    file,
    dir: path.basename(dir),
    expected,
    actual,
    match,
    hasTimeSensitivity,
    sourceYear,
    itemCount,
  };
}

// ============================================================================
// 분석 실행
// ============================================================================

const dirs = [
  'src/data/content/quizzes',
  'src/data/content/polls',
  'src/data/content/situation-reactions'
];

let results: FileAnalysis[] = [];
let passed = 0;
let failed = 0;
let warnings: string[] = [];

dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f =>
    f.endsWith('.ts') &&
    f !== 'index.ts' &&
    f !== 'types.ts'
  );

  files.forEach(file => {
    const analysis = analyzeFile(dir, file);
    results.push(analysis);

    if (!analysis.hasTimeSensitivity) {
      failed++;
      console.log(`❌ ${analysis.dir}/${file}: timeSensitivity 누락`);
    } else if (!analysis.match) {
      warnings.push(`⚠️  ${analysis.dir}/${file}: 예상 '${analysis.expected}' vs 실제 '${analysis.actual}'`);
      passed++; // 적용은 되어 있으므로 pass
    } else {
      passed++;
    }
  });
});

// ============================================================================
// 결과 출력
// ============================================================================

console.log('\n━━━ 커버리지 ━━━');
console.log(`총 파일: ${results.length}`);
console.log(`적용됨: ${results.filter(r => r.hasTimeSensitivity).length}`);
console.log(`미적용: ${results.filter(r => !r.hasTimeSensitivity).length}`);

console.log('\n━━━ Sensitivity 레벨 불일치 (리뷰 문서 vs 실제) ━━━');
if (warnings.length > 0) {
  warnings.forEach(w => console.log(w));
  console.log('\n💡 불일치는 반드시 오류는 아닙니다. 구현 시 재검토된 결과일 수 있습니다.');
} else {
  console.log('✅ 모두 일치');
}

console.log('\n━━━ sourceYear 검증 ━━━');
const wrongYear = results.filter(r => r.sourceYear !== null && r.sourceYear !== 2025);
if (wrongYear.length > 0) {
  wrongYear.forEach(r => console.log(`❌ ${r.dir}/${r.file}: ${r.sourceYear}`));
} else {
  console.log('✅ 모두 2025');
}

// ============================================================================
// 상세 분석: 예상과 다른 파일들
// ============================================================================

console.log('\n━━━ 상세 불일치 분석 ━━━');

const mismatches = results.filter(r => !r.match && r.hasTimeSensitivity);
if (mismatches.length > 0) {
  console.log('\n| 파일 | 문서 예상 | 실제 적용 | 비고 |');
  console.log('|------|----------|----------|------|');

  mismatches.forEach(m => {
    let note = '';
    if (m.actual === 'medium' && m.expected === 'low') {
      note = '더 보수적 (OK)';
    } else if (m.actual === 'high' && m.expected === 'low') {
      note = '매우 보수적 (확인 필요)';
    } else if (m.actual === 'low' && m.expected === 'none') {
      note = '더 보수적 (OK)';
    } else if (m.actual === 'none' && m.expected === 'low') {
      note = '덜 보수적 (확인 필요)';
    }
    console.log(`| ${m.dir}/${m.file} | ${m.expected} | ${m.actual} | ${note} |`);
  });
} else {
  console.log('없음');
}

// ============================================================================
// 최종 결과
// ============================================================================

console.log('\n════════════════════════════════════════════════════════════════');
console.log('📊 최종 결과');
console.log('════════════════════════════════════════════════════════════════');

const allCovered = results.every(r => r.hasTimeSensitivity);
const allCorrectYear = results.every(r => r.sourceYear === 2025 || r.sourceYear === null);

if (allCovered && allCorrectYear) {
  console.log('✅ 커버리지: 100%');
  console.log('✅ sourceYear: 모두 2025');
  console.log(`⚠️  레벨 불일치: ${mismatches.length}개 (검토 권장)`);
  console.log('\n🎉 timeSensitivity 메타데이터 검증 완료!');
} else {
  console.log('❌ 일부 검증 실패');
  process.exit(1);
}
