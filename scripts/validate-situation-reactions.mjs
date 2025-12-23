#!/usr/bin/env node

/**
 * 상황별 반응 투표 데이터 검증
 *
 * 실행: node scripts/validate-situation-reactions.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m'
};

console.log('');
console.log(`${colors.bold}════════════════════════════════════════════════════════════${colors.reset}`);
console.log(`${colors.bold}🎭 상황별 반응 투표 데이터 검증${colors.reset}`);
console.log(`${colors.bold}════════════════════════════════════════════════════════════${colors.reset}`);
console.log('');

// 파일 읽기
const baseDir = path.join(__dirname, '..', 'src', 'data', 'content', 'situation-reactions');
const relationshipFile = fs.readFileSync(path.join(baseDir, 'relationship.ts'), 'utf8');
const workFile = fs.readFileSync(path.join(baseDir, 'work.ts'), 'utf8');
const socialFile = fs.readFileSync(path.join(baseDir, 'social.ts'), 'utf8');

// 데이터 추출 (간단한 카운트)
const countItems = (content) => (content.match(/id: 'situation-reaction-/g) || []).length;

const relationship = countItems(relationshipFile);
const work = countItems(workFile);
const social = countItems(socialFile);
const total = relationship + work + social;

console.log(`${colors.cyan}📊 카테고리별 데이터 수:${colors.reset}`);
console.log(`   💕 relationship: ${relationship}개`);
console.log(`   💼 work: ${work}개`);
console.log(`   👥 social: ${social}개`);
console.log(`   📁 총: ${total}개`);
console.log('');

// ID 추출 및 검증
const allContent = relationshipFile + workFile + socialFile;
const idMatches = allContent.match(/id: 'situation-reaction-[^']+'/g) || [];
const ids = idMatches.map(m => m.match(/'([^']+)'/)[1]);
const uniqueIds = [...new Set(ids)];

console.log(`${colors.cyan}🔍 ID 검증:${colors.reset}`);
if (ids.length === uniqueIds.length) {
  console.log(`   ${colors.green}✅ 중복 ID 없음 (${ids.length}개 모두 고유)${colors.reset}`);
} else {
  const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  console.log(`   ${colors.red}❌ 중복 ID 발견: ${[...new Set(duplicates)].join(', ')}${colors.reset}`);
}

// ID-category 일치 검증
let idCategoryErrors = [];
for (const id of ids) {
  const parts = id.split('-');
  const category = parts[2]; // situation-reaction-{category}-xxx

  if (category === 'relationship' && !relationshipFile.includes(`'${id}'`)) {
    idCategoryErrors.push(`${id} (expected in relationship.ts)`);
  } else if (category === 'work' && !workFile.includes(`'${id}'`)) {
    idCategoryErrors.push(`${id} (expected in work.ts)`);
  } else if (category === 'social' && !socialFile.includes(`'${id}'`)) {
    idCategoryErrors.push(`${id} (expected in social.ts)`);
  }
}

if (idCategoryErrors.length === 0) {
  console.log(`   ${colors.green}✅ ID-파일 매핑 정상${colors.reset}`);
} else {
  console.log(`   ${colors.red}❌ ID-파일 불일치: ${idCategoryErrors.join(', ')}${colors.reset}`);
}

// tag 검증
const validTags = ['cool', 'emotional', 'rational', 'avoidant', 'confrontational', 'humorous', 'caring', 'passive'];
const tagMatches = allContent.match(/tag: '[^']+'/g) || [];
const usedTags = tagMatches.map(t => t.match(/'([^']+)'/)[1]);
const invalidTags = usedTags.filter(tag => !validTags.includes(tag));

console.log('');
console.log(`${colors.cyan}🏷️ Tag 검증:${colors.reset}`);
console.log(`   사용된 tag 수: ${usedTags.length}개`);
if (invalidTags.length === 0) {
  console.log(`   ${colors.green}✅ 모든 tag가 유효함${colors.reset}`);
} else {
  console.log(`   ${colors.yellow}⚠️ 비표준 tag: ${[...new Set(invalidTags)].join(', ')}${colors.reset}`);
}

// 사용된 tag 통계
const tagCounts = {};
for (const tag of usedTags) {
  tagCounts[tag] = (tagCounts[tag] || 0) + 1;
}
console.log(`   Tag 분포:`);
for (const [tag, count] of Object.entries(tagCounts).sort((a, b) => b[1] - a[1])) {
  console.log(`     - ${tag}: ${count}회`);
}

// personalityMapping 검증
console.log('');
console.log(`${colors.cyan}🧠 personalityMapping 검증:${colors.reset}`);
const hasMapping = (allContent.match(/personalityMapping: \{/g) || []).length;
console.log(`   ${hasMapping}/${total}개 항목에 personalityMapping 있음`);

// 필수 필드 검증
console.log('');
console.log(`${colors.cyan}📋 필수 필드 검증:${colors.reset}`);
const hasType = (allContent.match(/type: 'situation-reaction'/g) || []).length;
const hasCategory = (allContent.match(/category: '(relationship|work|social|awkward)'/g) || []).length;
const hasSituation = (allContent.match(/situation: '/g) || []).length;
const hasQuestion = (allContent.match(/question: '/g) || []).length;

const fieldChecks = [
  { name: 'type', count: hasType },
  { name: 'category', count: hasCategory },
  { name: 'situation', count: hasSituation },
  { name: 'question', count: hasQuestion },
];

let allFieldsOk = true;
for (const { name, count } of fieldChecks) {
  if (count === total) {
    console.log(`   ${colors.green}✅ ${name}: ${count}/${total}${colors.reset}`);
  } else {
    console.log(`   ${colors.red}❌ ${name}: ${count}/${total}${colors.reset}`);
    allFieldsOk = false;
  }
}

console.log('');
console.log(`${colors.bold}════════════════════════════════════════════════════════════${colors.reset}`);
if (allFieldsOk && idCategoryErrors.length === 0 && ids.length === uniqueIds.length) {
  console.log(`${colors.green}${colors.bold}✨ 모든 검증 통과!${colors.reset}`);
} else {
  console.log(`${colors.red}${colors.bold}❌ 일부 검증 실패${colors.reset}`);
  process.exit(1);
}
console.log(`${colors.bold}════════════════════════════════════════════════════════════${colors.reset}`);
console.log('');
