import { CATEGORY_TO_TEST } from '../src/data/contentGraph';

console.log('=== CATEGORY_TO_TEST["pet"] ===');
console.log(CATEGORY_TO_TEST['pet']);

console.log('\n=== 반려동물 카테고리별 테스트 ===');
const petCategories = ['pet', 'cat', 'dog', 'rabbit', 'hamster'];
for (const cat of petCategories) {
  console.log(`${cat}:`, CATEGORY_TO_TEST[cat]);
}

console.log('\n=== 예상 동작 분석 ===');
console.log('pet 카테고리 퀴즈/투표 → 추천 테스트:', CATEGORY_TO_TEST['pet']);
console.log('cat 카테고리 퀴즈/투표 → 추천 테스트:', CATEGORY_TO_TEST['cat']);
