import fs from 'fs';
import path from 'path';

const dirs = [
  'src/data/content/quizzes',
  'src/data/content/polls',
  'src/data/content/situation-reactions'
];

let results = [];

dirs.forEach(dir => {
  const files = fs.readdirSync(dir).filter(f =>
    f.endsWith('.ts') &&
    f !== 'index.ts' &&
    f !== 'types.ts'
  );

  files.forEach(file => {
    const content = fs.readFileSync(path.join(dir, file), 'utf8');
    const hasTimeSensitivity = content.includes('timeSensitivity');
    const hasDefaultConst = content.includes('DEFAULT_TIME_SENSITIVITY');

    const sensitivityMatch = content.match(/sensitivity:\s*['"](\w+)['"]/);
    const sensitivity = sensitivityMatch ? sensitivityMatch[1] : 'missing';

    const sourceYearMatch = content.match(/sourceYear:\s*(\d+)/);
    const sourceYear = sourceYearMatch ? sourceYearMatch[1] : 'missing';

    results.push({
      dir: path.basename(dir),
      file,
      hasTimeSensitivity,
      hasDefaultConst,
      sensitivity,
      sourceYear
    });
  });
});

// Summary
const total = results.length;
const covered = results.filter(r => r.hasTimeSensitivity).length;

console.log('╔════════════════════════════════════════════════════════════════╗');
console.log('║           timeSensitivity 커버리지 검증                         ║');
console.log('╚════════════════════════════════════════════════════════════════╝');
console.log('');
console.log(`총 파일: ${total}`);
console.log(`적용됨: ${covered}`);
console.log(`미적용: ${total - covered}`);
console.log(`커버리지: ${Math.round(covered/total*100)}%`);
console.log('');

// Missing files
const missing = results.filter(r => !r.hasTimeSensitivity);
if (missing.length > 0) {
  console.log('━━━ 미적용 파일 ━━━');
  missing.forEach(m => console.log(`  ✗ ${m.dir}/${m.file}`));
  console.log('');
}

// Sensitivity distribution
console.log('━━━ Sensitivity 분포 ━━━');
const dist = {};
results.filter(r => r.hasTimeSensitivity).forEach(r => {
  dist[r.sensitivity] = (dist[r.sensitivity] || 0) + 1;
});
Object.entries(dist).sort().forEach(([k, v]) => {
  console.log(`  ${k}: ${v}개`);
});
console.log('');

// Source year check
const wrongYear = results.filter(r => r.hasTimeSensitivity && r.sourceYear !== '2025');
if (wrongYear.length > 0) {
  console.log('━━━ sourceYear != 2025 ━━━');
  wrongYear.forEach(m => console.log(`  ⚠ ${m.dir}/${m.file} (${m.sourceYear})`));
  console.log('');
}

// Files without DEFAULT_TIME_SENSITIVITY constant
const noDefault = results.filter(r => r.hasTimeSensitivity && !r.hasDefaultConst);
if (noDefault.length > 0) {
  console.log('━━━ DEFAULT_TIME_SENSITIVITY 상수 누락 ━━━');
  noDefault.forEach(m => console.log(`  ⚠ ${m.dir}/${m.file}`));
  console.log('');
}

// Final result
if (covered === total && wrongYear.length === 0) {
  console.log('✅ 모든 검증 통과!');
} else {
  console.log('❌ 검증 실패');
  process.exit(1);
}
