import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const subjectsDir = path.join(__dirname, '..', 'src', 'data', 'subjects');
const allFiles = fs.readdirSync(subjectsDir);
const files = allFiles.filter(f => f.endsWith('.ts') && f !== 'index.ts');

console.log('='.repeat(70));
console.log('📊 전체 테스트 현황 분석');
console.log('='.repeat(70));

let totalTests = 0;
let testsWithMiddle = 0;
const results = [];

for (const file of files) {
  const content = fs.readFileSync(path.join(subjectsDir, file), 'utf-8');
  // "score": 5 형식도 감지
  const scoreMatches = content.match(/"?score"?:\s*(\d+)/g) || [];

  if (scoreMatches.length === 0) continue;

  totalTests++;
  const scores = scoreMatches.map(m => parseInt(m.match(/\d+/)[0]));
  const counts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const s of scores) {
    if (counts[s] !== undefined) counts[s]++;
  }

  const hasMiddle = counts[2] > 0 || counts[3] > 0 || counts[4] > 0;
  if (hasMiddle) testsWithMiddle++;

  const mark = hasMiddle ? '✅' : '❌';
  const name = file.replace('.ts', '');
  const qCount = Math.round((counts[1] + counts[5]) / 2) || Math.round(scores.length / 2);

  results.push({ mark, name, hasMiddle, qCount, counts });
}

// 3점 없는 것 먼저
results.sort((a, b) => a.hasMiddle - b.hasMiddle);

for (const r of results) {
  console.log(`${r.mark} ${r.name.padEnd(18)} (${r.qCount}문항) 점수분포: 1=${r.counts[1]} 3=${r.counts[3]} 5=${r.counts[5]}`);
}

console.log('');
console.log('='.repeat(70));
console.log(`총 테스트: ${totalTests}`);
console.log(`✅ 3점 옵션 있음: ${testsWithMiddle}`);
console.log(`❌ 3점 옵션 없음 (수정 필요): ${totalTests - testsWithMiddle}`);
console.log('='.repeat(70));
