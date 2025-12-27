#!/usr/bin/env node
/**
 * Apply positive framing to all test subjects
 * 전체 38개 테스트에 긍정 프레이밍 일괄 적용
 */

import { readFile, writeFile, readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

// Import framing map
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
  '감정적으로': '공감적으로',
  '감정적인': '공감 능력이 뛰어난',
  '감정적': '공감 능력이 뛰어난',
  '냉정하게': '이성적이고 객관적으로',
  '냉정한': '이성적이고 객관적인',
  '냉정함': '이성적이고 객관적인',
  '무뚝뚝한': '침착하고 차분한',
  '무뚝뚝함': '침착하고 차분함',
  '내성적이지만': '내면이 깊고 사색적이지만',
  '내성적인': '내면이 깊고 사색적인',
  '내성적': '내면이 깊고 사색적인',
  '외향적인': '활발하고 사교적인',
  '외향적': '활발하고 사교적인',

  // 행동 패턴
  '충동적': '순간을 즐기는',
  '충동적인': '순간을 즐기는',
  '신중한': '사려 깊은',
  '신중함': '사려 깊음',
  '보수적': '안정적인',
  '보수적인': '안정적인',
  '진보적': '혁신적인',
  '진보적인': '혁신적인',

  // 사고 방식 (부사형 추가)
  '현실적으로': '실용적으로',
  '현실적': '실용적인',
  '현실적인': '실용적인',
  '이상적으로': '비전을 가지고',
  '이상적': '비전이 있는',
  '이상적인': '비전이 있는',
  '논리적으로': '분석적으로',
  '논리적': '분석적인',
  '논리적인': '분석적인',
  '직관적으로': '통찰력 있게',
  '직관적': '통찰력 있는',
  '직관적인': '통찰력 있는',

  // 부정적 표현 (조사 포함 버전 우선)
  '비판적으로': '분석적으로',
  '비판적인': '분석적인',
  '비판적': '분석적인',
  '부정적으로': '신중하게',
  '부정적인': '신중한',
  '부정적': '신중한',
  '소극적으로': '신중하게',
  '충동적으로': '즉흥적으로',
  '실패를': '도전을',
  '실패': '도전',
  '거절을': '선택을',
  '거절': '선택',
};

function toPositiveFraming(text) {
  // 매핑된 표현들을 길이 순으로 정렬 (긴 것부터 매칭)
  const sortedEntries = Object.entries(POSITIVE_FRAMING_MAP).sort(
    ([a], [b]) => b.length - a.length
  );

  // 정규식 특수 문자 이스케이프
  const escapedKeys = sortedEntries.map(([negative]) =>
    negative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  );

  // 단일 패스 정규식 생성 (| 로 OR 조건)
  const pattern = new RegExp(escapedKeys.join('|'), 'g');

  // 한 번에 교체 (이미 변환된 텍스트는 재처리 안 됨)
  return text.replace(pattern, (matched) => POSITIVE_FRAMING_MAP[matched]);
}

async function main() {
  const subjectsDir = join(projectRoot, 'src/data/subjects');
  const backupDir = join(projectRoot, 'src/data/subjects/backups');

  console.log('📂 Reading subjects directory...');
  const files = await readdir(subjectsDir);
  const testFiles = files.filter(f => f.endsWith('.ts') && f !== 'index.ts');

  console.log(`\n📝 Found ${testFiles.length} test files\n`);

  let totalProcessed = 0;
  let totalTransformed = 0;
  const transformedFiles = [];
  const skippedFiles = [];

  for (const file of testFiles) {
    const filePath = join(subjectsDir, file);

    // Skip human.ts (already done)
    if (file === 'human.ts') {
      console.log(`⏭️  Skipping ${file} (already processed)`);
      skippedFiles.push(file);
      continue;
    }

    const content = await readFile(filePath, 'utf-8');
    const framedContent = toPositiveFraming(content);

    // Check if any changes were made
    const changes = Object.keys(POSITIVE_FRAMING_MAP).filter(key =>
      content.includes(key)
    );

    if (changes.length > 0) {
      // Backup original (only if changed)
      const backupPath = filePath + '.backup';
      await writeFile(backupPath, content, 'utf-8');

      // Write transformed content
      await writeFile(filePath, framedContent, 'utf-8');

      console.log(`✅ ${file}: ${changes.length}개 용어 변환`);
      changes.forEach(term => {
        console.log(`   - "${term}" → "${POSITIVE_FRAMING_MAP[term]}"`);
      });
      console.log('');

      totalTransformed += changes.length;
      transformedFiles.push({ file, count: changes.length });
    } else {
      console.log(`💡 ${file}: 변환 대상 없음 (이미 긍정적)\n`);
      skippedFiles.push(file);
    }

    totalProcessed++;
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 최종 결과');
  console.log('='.repeat(60));
  console.log(`✅ 처리된 파일: ${totalProcessed}/${testFiles.length}`);
  console.log(`🔄 변환된 파일: ${transformedFiles.length}`);
  console.log(`⏭️  스킵된 파일: ${skippedFiles.length}`);
  console.log(`📝 총 변환 용어: ${totalTransformed}개`);

  if (transformedFiles.length > 0) {
    console.log('\n변환된 파일:');
    transformedFiles.forEach(({ file, count }) => {
      console.log(`  - ${file} (${count}개)`);
    });
  }

  console.log('\n💾 백업 파일: *.ts.backup으로 저장됨');
  console.log('✅ 긍정 프레이밍 일괄 적용 완료!\n');
}

main().catch(err => {
  console.error('❌ Error:', err);
  process.exit(1);
});
