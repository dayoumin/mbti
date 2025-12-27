#!/usr/bin/env node
/**
 * 기존 콘텐츠에 Interest 태그 자동 추가
 * - category를 기반으로 적절한 interest-* 태그 추가
 * - 기존 insightTags에 interest 배열 추가/병합
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, '..');

// ============================================================================
// 카테고리 → Interest 태그 매핑
// ============================================================================

const CATEGORY_TO_INTEREST = {
  // 반려동물
  cat: ['interest-cat', 'interest-pet'],
  dog: ['interest-dog', 'interest-pet'],
  rabbit: ['interest-rabbit', 'interest-pet'],
  hamster: ['interest-hamster', 'interest-pet'],
  bird: ['interest-bird', 'interest-pet'],
  fish: ['interest-fish', 'interest-pet'],
  reptile: ['interest-reptile', 'interest-pet'],
  pet: ['interest-pet'],
  smallPet: ['interest-pet'],

  // 식물/자연
  plant: ['interest-plant', 'interest-nature'],
  nature: ['interest-nature'],

  // 음식/음료
  coffee: ['interest-coffee'],
  food: ['interest-food'],
  alcohol: ['interest-alcohol'],
  wine: ['interest-alcohol'],

  // 관계/라이프스타일
  love: ['interest-love'],
  lifestyle: ['interest-lifestyle'],
  money: ['interest-money'],
  travel: ['interest-travel'],

  // 운세/심리
  tarot: ['interest-tarot', 'interest-psychology'],
  zodiac: ['interest-zodiac'],
  psychology: ['interest-psychology'],
  personality: ['interest-psychology'],
  bloodtype: ['interest-psychology'],
};

// ============================================================================
// 파일 처리
// ============================================================================

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  let addedCount = 0;

  // 파일에서 category 추출
  const categoryMatch = content.match(/category:\s*['"]([^'"]+)['"]/);
  if (!categoryMatch) {
    return { modified: false, addedCount: 0 };
  }

  const category = categoryMatch[1];
  const interestTags = CATEGORY_TO_INTEREST[category];

  if (!interestTags || interestTags.length === 0) {
    return { modified: false, addedCount: 0 };
  }

  // insightTags 패턴 찾기 (interest 없는 경우)
  // 패턴 1: insightTags: { ... } 형태에서 interest가 없는 경우
  const insightTagsPattern = /insightTags:\s*\{([^}]+)\}/g;

  let match;
  const replacements = [];

  while ((match = insightTagsPattern.exec(content)) !== null) {
    const fullMatch = match[0];
    const innerContent = match[1];

    // 이미 interest가 있으면 스킵
    if (innerContent.includes('interest:')) {
      continue;
    }

    // interest 태그 추가
    const interestArray = interestTags.map(t => `'${t}'`).join(', ');
    const newInnerContent = innerContent.trim().endsWith(',')
      ? innerContent + ` interest: [${interestArray}]`
      : innerContent + `, interest: [${interestArray}]`;

    const newInsightTags = `insightTags: {${newInnerContent}}`;

    replacements.push({
      original: fullMatch,
      replacement: newInsightTags,
      position: match.index,
    });
  }

  // 역순으로 교체 (뒤에서부터 교체해야 position이 안 밀림)
  replacements.sort((a, b) => b.position - a.position);

  for (const r of replacements) {
    content = content.slice(0, r.position) + r.replacement + content.slice(r.position + r.original.length);
    addedCount++;
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content);
  }

  return { modified, addedCount };
}

// ============================================================================
// 메인
// ============================================================================

function main() {
  const pollsDir = path.join(rootDir, 'src/data/content/polls');
  const reactionsDir = path.join(rootDir, 'src/data/content/situation-reactions');

  console.log('\n' + '='.repeat(60));
  console.log('🏷️  Interest 태그 자동 추가');
  console.log('='.repeat(60));

  let totalModified = 0;
  let totalAdded = 0;

  // Polls 처리
  if (fs.existsSync(pollsDir)) {
    console.log('\n📁 Polls 처리 중...');
    const pollFiles = fs.readdirSync(pollsDir).filter(f => f.endsWith('.ts') && !f.includes('index'));

    for (const file of pollFiles) {
      const filePath = path.join(pollsDir, file);
      const result = processFile(filePath);
      if (result.modified) {
        console.log(`   ✅ ${file}: ${result.addedCount}개 insightTags에 interest 추가`);
        totalModified++;
        totalAdded += result.addedCount;
      }
    }
  }

  // Situation Reactions 처리
  if (fs.existsSync(reactionsDir)) {
    console.log('\n📁 Situation-Reactions 처리 중...');
    const reactionFiles = fs.readdirSync(reactionsDir).filter(f => f.endsWith('.ts') && !f.includes('index'));

    for (const file of reactionFiles) {
      const filePath = path.join(reactionsDir, file);
      const result = processFile(filePath);
      if (result.modified) {
        console.log(`   ✅ ${file}: ${result.addedCount}개 insightTags에 interest 추가`);
        totalModified++;
        totalAdded += result.addedCount;
      }
    }
  }

  console.log('\n' + '-'.repeat(60));
  console.log(`📊 결과: ${totalModified}개 파일 수정, ${totalAdded}개 insightTags에 interest 추가`);

  if (totalAdded > 0) {
    console.log('\n⚠️  빌드 확인 필요: npm run build');
  }

  console.log('='.repeat(60) + '\n');
}

main();
