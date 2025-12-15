/**
 * 바이럴 콘텐츠 시스템 테스트
 * 실행: npx tsx scripts/test-viral-content.ts
 */

import { petMatchData } from '../src/data/subjects/petMatch';
import { plantData } from '../src/data/subjects/plant';
import {
  ALL_VOTE_TOPICS,
  getTodayVoteTopic,
  getWeeklyVoteTopic,
  getSeasonalVoteTopics,
  getCurrentSeason,
  getTopViralTopics
} from '../src/data/viralContent';

console.log('='.repeat(60));
console.log('바이럴 콘텐츠 시스템 점검');
console.log('='.repeat(60));

let passed = 0;
let failed = 0;

function test(name: string, fn: () => void) {
  try {
    fn();
    console.log(`✅ ${name}`);
    passed++;
  } catch (e) {
    console.log(`❌ ${name}`);
    console.log(`   Error: ${(e as Error).message}`);
    failed++;
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) throw new Error(message);
}

// === 1. FunFacts 검증 ===
console.log('\n📋 1. FunFacts 데이터 검증');

test('petMatch 모든 결과에 funFacts 존재', () => {
  const results = petMatchData.resultLabels;
  const withFunFacts = results.filter(r => r.meta?.funFacts);
  assert(withFunFacts.length === results.length,
    `funFacts 없는 결과: ${results.filter(r => !r.meta?.funFacts).map(r => r.name).join(', ')}`);
});

test('plant 모든 결과에 funFacts 존재', () => {
  const results = plantData.resultLabels;
  const withFunFacts = results.filter(r => r.meta?.funFacts);
  assert(withFunFacts.length === results.length,
    `funFacts 없는 결과: ${results.filter(r => !r.meta?.funFacts).map(r => r.name).join(', ')}`);
});

test('petMatch funFacts 필수 필드 검증', () => {
  for (const result of petMatchData.resultLabels) {
    const funFacts = result.meta?.funFacts;
    assert(!!funFacts?.didYouKnow?.length, `${result.name}에 didYouKnow 없음`);
    assert(!!funFacts?.commonMistakes?.length, `${result.name}에 commonMistakes 없음`);
    assert(!!funFacts?.proTips?.length, `${result.name}에 proTips 없음`);
    assert(!!funFacts?.viralOneLiner, `${result.name}에 viralOneLiner 없음`);
  }
});

test('plant funFacts 필수 필드 검증', () => {
  for (const result of plantData.resultLabels) {
    const funFacts = result.meta?.funFacts;
    assert(!!funFacts?.didYouKnow?.length, `${result.name}에 didYouKnow 없음`);
    assert(!!funFacts?.commonMistakes?.length, `${result.name}에 commonMistakes 없음`);
    assert(!!funFacts?.proTips?.length, `${result.name}에 proTips 없음`);
    assert(!!funFacts?.viralOneLiner, `${result.name}에 viralOneLiner 없음`);
  }
});

// === 2. 투표 토픽 검증 ===
console.log('\n📋 2. 투표 토픽 데이터 검증');

test('투표 토픽 25개 이상 존재', () => {
  assert(ALL_VOTE_TOPICS.length >= 25, `토픽 ${ALL_VOTE_TOPICS.length}개 (25개 이상 필요)`);
});

test('모든 토픽 필수 필드 존재', () => {
  for (const topic of ALL_VOTE_TOPICS) {
    assert(!!topic.id, 'id 없음');
    assert(!!topic.title, `${topic.id}의 title 없음`);
    assert(!!topic.optionA, `${topic.id}의 optionA 없음`);
    assert(!!topic.optionB, `${topic.id}의 optionB 없음`);
    assert(!!topic.category, `${topic.id}의 category 없음`);
    assert(!!topic.tags?.length, `${topic.id}의 tags 없음`);
  }
});

test('토픽 ID 고유성', () => {
  const ids = ALL_VOTE_TOPICS.map(t => t.id);
  const unique = new Set(ids);
  assert(ids.length === unique.size, '중복 ID 발견');
});

test('시즌별 토픽 필터링', () => {
  const seasonalTopics = getSeasonalVoteTopics();
  const currentSeason = getCurrentSeason();

  for (const topic of seasonalTopics) {
    assert(!topic.season || topic.season === currentSeason,
      `${topic.id}의 시즌(${topic.season})이 현재(${currentSeason})와 불일치`);
  }
});

test('오늘의 투표 반환', () => {
  const today = getTodayVoteTopic();
  assert(!!today, '오늘의 투표 없음');
  assert(!!today.id, 'ID 없음');
  assert(!!today.title, '제목 없음');
});

test('이번주 투표 반환', () => {
  const weekly = getWeeklyVoteTopic();
  assert(!!weekly, '이번주 투표 없음');
  assert(!!weekly.id, 'ID 없음');
});

test('바이럴 스코어 상위 토픽', () => {
  const top = getTopViralTopics(5);
  assert(top.length === 5, `상위 ${top.length}개 (5개 필요)`);

  // 내림차순 정렬 확인
  for (let i = 0; i < top.length - 1; i++) {
    const curr = top[i].viralScore || 0;
    const next = top[i + 1].viralScore || 0;
    assert(curr >= next, '바이럴 스코어 정렬 오류');
  }
});

// === 3. 데이터 통계 ===
console.log('\n📋 3. 데이터 통계');

const petResults = petMatchData.resultLabels;
const plantResults = plantData.resultLabels;

console.log(`\n🐾 petMatch: ${petResults.length}종 동물`);
petResults.forEach(r => {
  const ff = r.meta?.funFacts;
  console.log(`   ${r.emoji} ${r.name}: ${ff?.didYouKnow?.length || 0}개 사실, ${ff?.commonMistakes?.length || 0}개 오해, ${ff?.proTips?.length || 0}개 팁`);
});

console.log(`\n🌱 plant: ${plantResults.length}종 식물`);
plantResults.forEach(r => {
  const ff = r.meta?.funFacts;
  console.log(`   ${r.emoji} ${r.name}: ${ff?.didYouKnow?.length || 0}개 사실, ${ff?.commonMistakes?.length || 0}개 오해, ${ff?.proTips?.length || 0}개 팁`);
});

const byCategory = {
  pet: ALL_VOTE_TOPICS.filter(t => t.category === 'pet').length,
  plant: ALL_VOTE_TOPICS.filter(t => t.category === 'plant').length,
  lifestyle: ALL_VOTE_TOPICS.filter(t => t.category === 'lifestyle').length,
  fun: ALL_VOTE_TOPICS.filter(t => t.category === 'fun').length,
};
console.log(`\n📊 투표 토픽: ${ALL_VOTE_TOPICS.length}개`);
console.log(`   pet: ${byCategory.pet}개, plant: ${byCategory.plant}개, lifestyle: ${byCategory.lifestyle}개, fun: ${byCategory.fun}개`);

const bySeason = {
  summer: ALL_VOTE_TOPICS.filter(t => t.season === 'summer').length,
  winter: ALL_VOTE_TOPICS.filter(t => t.season === 'winter').length,
  spring: ALL_VOTE_TOPICS.filter(t => t.season === 'spring').length,
  general: ALL_VOTE_TOPICS.filter(t => !t.season).length,
};
console.log(`   시즌: 여름(${bySeason.summer}) 겨울(${bySeason.winter}) 봄(${bySeason.spring}) 연중(${bySeason.general})`);

console.log(`\n🗓️ 현재 시즌: ${getCurrentSeason()}`);
console.log(`   현재 시즌 토픽: ${getSeasonalVoteTopics().length}개`);

const today = getTodayVoteTopic();
console.log(`\n📅 오늘의 투표: ${today.title}`);
console.log(`   ${today.optionA} vs ${today.optionB}`);

const weekly = getWeeklyVoteTopic();
console.log(`\n📆 이번주 투표: ${weekly.title}`);
console.log(`   ${weekly.optionA} vs ${weekly.optionB}`);

// === 4. viralOneLiner 미리보기 ===
console.log('\n📋 4. viralOneLiner 미리보기 (SNS용)');

console.log('\n🐾 반려동물:');
petResults.forEach(r => {
  if (r.meta?.funFacts?.viralOneLiner) {
    console.log(`   ${r.meta.funFacts.viralOneLiner}`);
  }
});

console.log('\n🌱 식물:');
plantResults.forEach(r => {
  if (r.meta?.funFacts?.viralOneLiner) {
    console.log(`   ${r.meta.funFacts.viralOneLiner}`);
  }
});

// === 결과 ===
console.log('\n' + '='.repeat(60));
console.log(`테스트 결과: ${passed} passed, ${failed} failed`);
console.log('='.repeat(60));

if (failed > 0) {
  process.exit(1);
}
