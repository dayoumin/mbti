import { CELEBRITY_MALE_IDEAL_TYPE, CELEBRITY_MALE_20S, CELEBRITY_MALE_ACTOR_VS_IDOL } from '../src/data/content/tournaments/celebrity-male-tier.ts';

const main = CELEBRITY_MALE_IDEAL_TYPE;

console.log('================================================');
console.log('남자 연예인 이상형 월드컵 품질 점검');
console.log('================================================\n');

// 1. 참가자 수
console.log('1. 참가자 수:', main.items.length, '/ 32명 (목표)');
if (main.items.length !== 32) {
  console.log('   ERROR: 32명이 아님!');
} else {
  console.log('   OK');
}

// 2. 중복 ID 확인
const ids = main.items.map(i => i.id);
const uniqueIds = new Set(ids);
console.log('\n2. 중복 ID 확인');
if (ids.length !== uniqueIds.size) {
  const duplicates = ids.filter((id, idx) => ids.indexOf(id) !== idx);
  console.log('   ERROR 중복 발견:', [...new Set(duplicates)].join(', '));
} else {
  console.log('   OK 중복 없음');
}

// 3. imageUrl 확인
console.log('\n3. imageUrl 사용 (저작권 이슈)');
const hasImageUrl = main.items.some(i => 'imageUrl' in i);
if (hasImageUrl) {
  console.log('   ERROR imageUrl 사용됨');
} else {
  console.log('   OK imageUrl 미사용');
}

// 4. 세대별 분포
console.log('\n4. 세대별 분포');
const twenties = main.items.filter(i => i.tags.includes('20대'));
const thirties = main.items.filter(i => i.tags.includes('30대'));
const forties = main.items.filter(i => i.tags.includes('40대'));
console.log('   20대:', twenties.length, '명');
console.log('   30대:', thirties.length, '명');
console.log('   40대:', forties.length, '명');

// 5. 직업 분포
console.log('\n5. 직업 분포');
const actors = main.items.filter(i => i.tags.includes('배우'));
const idols = main.items.filter(i => i.tags.includes('아이돌'));
console.log('   배우:', actors.length, '명');
console.log('   아이돌:', idols.length, '명');

// 6. 연령 등급
console.log('\n6. 연령 등급');
console.log('   ageRating:', main.meta.ageRating);
console.log('   isAdultOnly:', main.meta.isAdultOnly || 'undefined');
console.log('   minAge:', main.meta.minAge || 'undefined');

// 7. 태그 일관성
console.log('\n7. 태그 일관성');
const allTags = new Set();
main.items.forEach(i => i.tags.forEach(t => allTags.add(t)));
console.log('   사용된 태그:', [...allTags].sort().join(', '));

const missingAgeTags = main.items.filter(i => 
  !i.tags.includes('20대') && !i.tags.includes('30대') && !i.tags.includes('40대')
);
if (missingAgeTags.length > 0) {
  console.log('   WARNING: 연령 태그 누락:', missingAgeTags.map(i => i.name).join(', '));
} else {
  console.log('   OK 모든 항목에 연령 태그 있음');
}

// 8. description 패턴
console.log('\n8. description 필드');
const hasDescription = main.items.every(i => i.description);
console.log('   전체 존재:', hasDescription ? 'OK 모두 있음' : 'ERROR 누락 있음');

const descPattern = main.items.filter(i => 
  i.description && i.description.includes('|')
);
console.log('   패턴 일관성:', descPattern.length, '/', main.items.length);

// 9. emoji 확인
console.log('\n9. emoji 필드');
const allHaveEmoji = main.items.every(i => i.emoji);
console.log('   전체 존재:', allHaveEmoji ? 'OK' : 'ERROR');

// 10. viralHooks
console.log('\n10. 바이럴 훅');
console.log('   논쟁 주제:', main.viralHooks?.debateTopics?.length || 0, '개');
console.log('   팬덤:', main.viralHooks?.fandoms?.length || 0, '개');

// 11. 추가 토너먼트 확인
console.log('\n11. 추가 토너먼트');
console.log('   20대 전용:', CELEBRITY_MALE_20S.items.length, '명');
console.log('   배우vs아이돌:', CELEBRITY_MALE_ACTOR_VS_IDOL.items.length, '명');

// 12. 메인 토너먼트 명단
console.log('\n12. 메인 토너먼트 참가자 명단 (32명)');
console.log('   ─────────────────────────────────');
main.items.forEach((item, idx) => {
  const ageTag = item.tags.find(t => ['20대', '30대', '40대'].includes(t)) || '?';
  const jobTag = item.tags.find(t => ['아이돌', '배우'].includes(t)) || '?';
  console.log((idx + 1) + '. ' + item.name + ' | ' + item.emoji + ' | ' + ageTag + ' ' + jobTag);
});

console.log('\n================================================');
console.log('품질 점검 완료');
console.log('================================================');
