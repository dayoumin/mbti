/**
 * 상황반응 콘텐츠 테스트 스크립트
 * 실행: npx tsx scripts/test-situation-reactions.mjs
 */

import { RELATIONSHIP_REACTIONS } from '../src/data/content/situation-reactions/relationship.ts';
import { WORK_REACTIONS } from '../src/data/content/situation-reactions/work.ts';
import { SOCIAL_REACTIONS } from '../src/data/content/situation-reactions/social.ts';
import { AWKWARD_REACTIONS } from '../src/data/content/situation-reactions/awkward.ts';

const ALL_SITUATION_REACTIONS = [
  ...RELATIONSHIP_REACTIONS,
  ...WORK_REACTIONS,
  ...SOCIAL_REACTIONS,
  ...AWKWARD_REACTIONS,
];

const SITUATION_CATEGORY_LABELS = {
  relationship: { emoji: '💕', name: '연애/이별' },
  work: { emoji: '💼', name: '직장생활' },
  social: { emoji: '👥', name: '친구/모임' },
  awkward: { emoji: '😅', name: '어색한 순간' },
};

function getSituationReactionsByCategory(category) {
  return ALL_SITUATION_REACTIONS.filter(r => r.category === category);
}

console.log('=== 상황반응 콘텐츠 테스트 ===\n');

// 1. 전체 개수
console.log('1. 전체 개수:', ALL_SITUATION_REACTIONS.length);

// 2. 카테고리별 개수
console.log('\n2. 카테고리별 개수:');
for (const cat of Object.keys(SITUATION_CATEGORY_LABELS)) {
  const count = getSituationReactionsByCategory(cat).length;
  const label = SITUATION_CATEGORY_LABELS[cat];
  console.log(`   ${label.emoji} ${label.name}: ${count}개`);
}

// 3. awkward 카테고리 샘플
console.log('\n3. awkward 카테고리 샘플:');
const awkwardList = getSituationReactionsByCategory('awkward');
awkwardList.slice(0, 3).forEach((item, i) => {
  console.log(`   ${i+1}. ${item.situation.slice(0, 35)}...`);
});

// 4. 검증
console.log('\n4. 검증 결과:');

// 태그 검증
const tagCheck = awkwardList.every(item =>
  item.tags && item.tags.length >= 3 && item.tags[0] === '민망'
);
console.log(`   태그 규칙 (3개+, 첫태그='민망'): ${tagCheck ? '✅ PASS' : '❌ FAIL'}`);

// ID 중복 검증
const ids = ALL_SITUATION_REACTIONS.map(r => r.id);
const idCheck = ids.length === new Set(ids).size;
console.log(`   ID 중복 없음: ${idCheck ? '✅ PASS' : '❌ FAIL'}`);

// 옵션 tag 검증
const optCheck = ALL_SITUATION_REACTIONS.every(item =>
  item.options.every(opt => opt.tag)
);
console.log(`   옵션 tag 존재: ${optCheck ? '✅ PASS' : '❌ FAIL'}`);

// 필수 필드 검증
const requiredFields = ['id', 'type', 'category', 'situation', 'question', 'options', 'tags'];
const fieldCheck = ALL_SITUATION_REACTIONS.every(item =>
  requiredFields.every(field => item[field] !== undefined)
);
console.log(`   필수 필드 존재: ${fieldCheck ? '✅ PASS' : '❌ FAIL'}`);

// type 값 검증
const typeCheck = ALL_SITUATION_REACTIONS.every(item =>
  item.type === 'situation-reaction'
);
console.log(`   type='situation-reaction': ${typeCheck ? '✅ PASS' : '❌ FAIL'}`);

console.log('\n=== 테스트 완료 ===');
