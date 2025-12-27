#!/usr/bin/env node
/**
 * Apply positive framing to human test (proof of concept)
 */

import { readFile, writeFile } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Import framing map (we'll inline it here for simplicity)
const POSITIVE_FRAMING_MAP = {
  // 성격 특성 (조사 포함 버전 우선)
  '엄격하고': '명확한 기준을 가지고',
  '엄격한': '명확한 기준을 가진',
  '엄격함': '명확한 기준',
  '소극적이지만': '신중하고 사려 깊지만',
  '소극적인': '신중하고 사려 깊은',
  '소극적': '신중하고 사려 깊은',
  '계획성 없음': '즉흥적이고 유연한',
  '계획성 없는': '즉흥적이고 유연한',
  '감정적인': '공감 능력이 뛰어난',
  '감정적': '공감 능력이 뛰어난',
  '냉정한': '이성적이고 객관적인',
  '냉정함': '이성적이고 객관성',
  '무뚝뚝한': '침착하고 차분한',
  '무뚝뚝함': '침착하고 차분함',
  '내성적이지만': '내면이 깊고 사색적이지만',
  '내성적인': '내면이 깊고 사색적인',
  '내성적': '내면이 깊고 사색적인',
  '외향적인': '활발하고 사교적인',
  '외향적': '활발하고 사교적인',
  '충동적': '순간을 즐기는',
  '충동적인': '순간을 즐기는',
  '신중한': '사려 깊은',
  '신중함': '사려 깊음',
  '보수적': '안정적인',
  '보수적인': '안정적인',
  '진보적': '혁신적인',
  '진보적인': '혁신적인',
  '현실적': '실용적인',
  '현실적인': '실용적인',
  '이상적': '비전이 있는',
  '이상적인': '비전이 있는',
  '논리적': '분석적인',
  '논리적인': '분석적인',
  '직관적': '통찰력 있는',
  '직관적인': '통찰력 있는',
};

function toPositiveFraming(text) {
  let result = text;

  // 매핑된 표현들을 찾아서 교체 (길이 순으로 정렬하여 긴 것부터 매칭)
  const sortedEntries = Object.entries(POSITIVE_FRAMING_MAP).sort(
    ([a], [b]) => b.length - a.length
  );

  sortedEntries.forEach(([negative, positive]) => {
    // 전역 검색으로 모든 occurrence 교체
    result = result.split(negative).join(positive);
  });

  return result;
}

async function main() {
  const humanFilePath = join(projectRoot, 'src/data/subjects/human.ts');

  console.log('📝 Reading human.ts...');
  const content = await readFile(humanFilePath, 'utf-8');

  console.log('✨ Applying positive framing...');
  const framedContent = toPositiveFraming(content);

  // Backup original
  const backupPath = humanFilePath + '.backup';
  await writeFile(backupPath, content, 'utf-8');
  console.log(`💾 Backup saved to ${backupPath}`);

  // Write transformed content
  await writeFile(humanFilePath, framedContent, 'utf-8');
  console.log('✅ Positive framing applied to human.ts');

  // Count changes
  const changes = Object.keys(POSITIVE_FRAMING_MAP).filter(key =>
    content.includes(key)
  );

  if (changes.length > 0) {
    console.log(`\n🔄 Transformed terms (${changes.length}):`);
    changes.forEach(term => {
      console.log(`  - "${term}" → "${POSITIVE_FRAMING_MAP[term]}"`);
    });
  } else {
    console.log('\n💡 No negative terms found - test already positive!');
  }
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
