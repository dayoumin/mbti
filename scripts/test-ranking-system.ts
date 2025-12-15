/**
 * 자동 랭킹 시스템 테스트
 * 실행: npx tsx scripts/test-ranking-system.ts
 */

import { petMatchData } from '../src/data/subjects/petMatch';
import { plantData } from '../src/data/subjects/plant';
import {
  generateRanking,
  getCurrentSeasonTemplates,
  getTodayRanking,
  getSeasonalTips,
  ALL_RANKING_TEMPLATES,
  PET_RANKING_TEMPLATES,
  PLANT_RANKING_TEMPLATES
} from '../src/data/rankingTemplates';

console.log('='.repeat(60));
console.log('자동 랭킹 시스템 테스트');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${e.message}`);
    failed++;
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

// === 1. 메타데이터 검증 ===
console.log('\n📋 1. 메타데이터 검증');

test('petMatch 모든 결과에 meta 존재', () => {
  const results = petMatchData.resultLabels;
  const withMeta = results.filter(r => r.meta);
  assert(withMeta.length === results.length,
    `meta 없는 결과: ${results.filter(r => !r.meta).map(r => r.name).join(', ')}`);
});

test('plant 모든 결과에 meta 존재', () => {
  const results = plantData.resultLabels;
  const withMeta = results.filter(r => r.meta);
  assert(withMeta.length === results.length,
    `meta 없는 결과: ${results.filter(r => !r.meta).map(r => r.name).join(', ')}`);
});

test('petMatch meta 필수 필드 검증', () => {
  const requiredFields = ['heatTolerance', 'coldTolerance', 'beginnerFriendly', 'careLevel'];
  for (const result of petMatchData.resultLabels) {
    for (const field of requiredFields) {
      assert(result.meta?.[field] !== undefined,
        `${result.name}에 ${field} 없음`);
    }
  }
});

test('plant meta 필수 필드 검증', () => {
  const requiredFields = ['heatTolerance', 'coldTolerance', 'beginnerFriendly', 'careLevel'];
  for (const result of plantData.resultLabels) {
    for (const field of requiredFields) {
      assert(result.meta?.[field] !== undefined,
        `${result.name}에 ${field} 없음`);
    }
  }
});

test('seasonalTips 4계절 모두 존재', () => {
  const seasons = ['spring', 'summer', 'fall', 'winter'];
  const allResults = [...petMatchData.resultLabels, ...plantData.resultLabels];
  for (const result of allResults) {
    if (result.meta?.seasonalTips) {
      for (const season of seasons) {
        assert(result.meta.seasonalTips[season],
          `${result.name}의 ${season} 팁 없음`);
      }
    }
  }
});

// === 2. 템플릿 검증 ===
console.log('\n📋 2. 템플릿 검증');

test('PET_RANKING_TEMPLATES 개수 확인', () => {
  assert(PET_RANKING_TEMPLATES.length === 7,
    `Expected 7, got ${PET_RANKING_TEMPLATES.length}`);
});

test('PLANT_RANKING_TEMPLATES 개수 확인', () => {
  assert(PLANT_RANKING_TEMPLATES.length === 8,
    `Expected 8, got ${PLANT_RANKING_TEMPLATES.length}`);
});

test('모든 템플릿 ID 고유성', () => {
  const ids = ALL_RANKING_TEMPLATES.map(t => t.id);
  const unique = new Set(ids);
  assert(ids.length === unique.size, '중복 ID 발견');
});

test('모든 템플릿 필수 필드 존재', () => {
  for (const template of ALL_RANKING_TEMPLATES) {
    assert(template.id, `id 없음`);
    assert(template.title, `${template.id}의 title 없음`);
    assert(template.description, `${template.id}의 description 없음`);
    assert(template.subject, `${template.id}의 subject 없음`);
    assert(template.sort, `${template.id}의 sort 없음`);
    assert(template.sort.field, `${template.id}의 sort.field 없음`);
    assert(template.sort.order, `${template.id}의 sort.order 없음`);
  }
});

// === 3. 랭킹 생성 로직 검증 ===
console.log('\n📋 3. 랭킹 생성 로직 검증');

test('generateRanking - 초보자 추천 정렬 (desc)', () => {
  const template = PET_RANKING_TEMPLATES.find(t => t.id === 'pet-beginner-friendly');
  const results = generateRanking(template, petMatchData.resultLabels);

  // beginnerFriendly 내림차순 확인
  for (let i = 0; i < results.length - 1; i++) {
    const curr = results[i].meta?.beginnerFriendly || 0;
    const next = results[i + 1].meta?.beginnerFriendly || 0;
    assert(curr >= next, `정렬 오류: ${results[i].name}(${curr}) < ${results[i+1].name}(${next})`);
  }
});

test('generateRanking - 더위 약한 순 정렬 (asc)', () => {
  const template = PET_RANKING_TEMPLATES.find(t => t.id === 'pet-summer-danger');
  const results = generateRanking(template, petMatchData.resultLabels);

  // heatTolerance 오름차순 확인 (낮을수록 더위에 약함)
  for (let i = 0; i < results.length - 1; i++) {
    const curr = results[i].meta?.heatTolerance || 0;
    const next = results[i + 1].meta?.heatTolerance || 0;
    assert(curr <= next, `정렬 오류: ${results[i].name}(${curr}) > ${results[i+1].name}(${next})`);
  }
});

test('generateRanking - 필터 적용 (spaceNeeded = small)', () => {
  const template = PET_RANKING_TEMPLATES.find(t => t.id === 'pet-small-space');
  const results = generateRanking(template, petMatchData.resultLabels);

  for (const result of results) {
    assert(result.meta?.spaceNeeded === 'small',
      `${result.name}의 spaceNeeded가 small이 아님: ${result.meta?.spaceNeeded}`);
  }
});

test('generateRanking - 필터 in 연산자 (suitableFor 배열)', () => {
  const template = PLANT_RANKING_TEMPLATES.find(t => t.id === 'plant-dark-room');
  const results = generateRanking(template, plantData.resultLabels);

  // 결과가 있거나 비어있을 수 있음 (필터 조건에 따라)
  for (const result of results) {
    const suitableFor = result.meta?.suitableFor || [];
    const hasMatch = suitableFor.some(s => ['어두운방', '저조도'].includes(s));
    assert(hasMatch, `${result.name}이 필터 조건을 만족하지 않음`);
  }
});

test('generateRanking - noiseLevel enum 정렬', () => {
  const template = PET_RANKING_TEMPLATES.find(t => t.id === 'pet-quiet');
  const results = generateRanking(template, petMatchData.resultLabels);

  const orderMap = { 'silent': 0, 'low': 1, 'medium': 2, 'high': 3 };
  for (let i = 0; i < results.length - 1; i++) {
    const curr = orderMap[results[i].meta?.noiseLevel] ?? 0;
    const next = orderMap[results[i + 1].meta?.noiseLevel] ?? 0;
    assert(curr <= next, `정렬 오류: ${results[i].name}(${results[i].meta?.noiseLevel}) > ${results[i+1].name}(${results[i+1].meta?.noiseLevel})`);
  }
});

// === 4. 계절 관련 함수 검증 ===
console.log('\n📋 4. 계절 관련 함수 검증');

test('getCurrentSeasonTemplates - 계절 시즌 템플릿 필터링', () => {
  const templates = getCurrentSeasonTemplates();
  const month = new Date().getMonth() + 1;
  let expectedSeason;
  if (month >= 3 && month <= 5) expectedSeason = 'spring';
  else if (month >= 6 && month <= 8) expectedSeason = 'summer';
  else if (month >= 9 && month <= 11) expectedSeason = 'fall';
  else expectedSeason = 'winter';

  // 시즌 없는 템플릿 + 현재 시즌 템플릿만 포함
  for (const t of templates) {
    assert(!t.season || t.season === expectedSeason,
      `${t.id}의 시즌(${t.season})이 현재 시즌(${expectedSeason})과 불일치`);
  }

  console.log(`   현재 시즌: ${expectedSeason}, 템플릿 ${templates.length}개`);
});

test('getTodayRanking - 오늘의 랭킹 반환', () => {
  const today = getTodayRanking();
  assert(today, '오늘의 랭킹이 없음');
  assert(today.id, '랭킹 ID 없음');
  assert(today.title, '랭킹 제목 없음');
  console.log(`   오늘의 랭킹: ${today.title}`);
});

test('getSeasonalTips - 계절별 팁 반환', () => {
  const allResults = [...petMatchData.resultLabels, ...plantData.resultLabels];
  const tips = getSeasonalTips(allResults);

  assert(tips.length > 0, '계절별 팁이 없음');
  for (const item of tips) {
    assert(item.result, 'result 없음');
    assert(item.tip, 'tip 없음');
  }
  console.log(`   계절별 팁 ${tips.length}개 생성됨`);
});

// === 5. 실제 랭킹 결과 미리보기 ===
console.log('\n📋 5. 랭킹 결과 미리보기');

console.log('\n🐾 초보자에게 추천하는 반려동물:');
const beginnerPets = generateRanking(
  PET_RANKING_TEMPLATES.find(t => t.id === 'pet-beginner-friendly'),
  petMatchData.resultLabels
);
beginnerPets.forEach((r, i) => {
  console.log(`   ${i + 1}. ${r.emoji} ${r.name} (친화도: ${r.meta?.beginnerFriendly})`);
});

console.log('\n🌱 초보 식집사 추천 식물:');
const beginnerPlants = generateRanking(
  PLANT_RANKING_TEMPLATES.find(t => t.id === 'plant-beginner'),
  plantData.resultLabels
);
beginnerPlants.slice(0, 5).forEach((r, i) => {
  console.log(`   ${i + 1}. ${r.emoji} ${r.name} (친화도: ${r.meta?.beginnerFriendly})`);
});

console.log('\n🤫 층간소음 걱정 없는 반려동물:');
const quietPets = generateRanking(
  PET_RANKING_TEMPLATES.find(t => t.id === 'pet-quiet'),
  petMatchData.resultLabels
);
quietPets.forEach((r, i) => {
  console.log(`   ${i + 1}. ${r.emoji} ${r.name} (소음: ${r.meta?.noiseLevel})`);
});

// === 결과 ===
console.log('\n' + '='.repeat(60));
console.log(`테스트 결과: ${passed} passed, ${failed} failed`);
console.log('='.repeat(60));

if (failed > 0) {
  process.exit(1);
}
