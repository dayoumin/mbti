// ============================================================================
// 연예인 이상형 월드컵 토너먼트 테스트
// ============================================================================
// 실행: npx tsx tests/celebrity-tournament-test.ts
// ============================================================================

import {
  CELEBRITY_MALE_TIER_TOURNAMENTS,
  CELEBRITY_FEMALE_TIER_TOURNAMENTS,
  getTournamentsByCategory,
  getTournamentById,
  TIER_TOURNAMENTS,
} from '../src/data/content/tournaments';

// ============================================================================
// 테스트 유틸리티
// ============================================================================

let passed = 0;
let failed = 0;

function test(name: string, fn: () => boolean) {
  try {
    if (fn()) {
      console.log(`✅ ${name}`);
      passed++;
    } else {
      console.log(`❌ ${name}`);
      failed++;
    }
  } catch (e) {
    console.log(`❌ ${name} - Error: ${e}`);
    failed++;
  }
}

function section(title: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📋 ${title}`);
  console.log('='.repeat(60));
}

// ============================================================================
// 테스트 실행
// ============================================================================

console.log('\n🎬 연예인 이상형 월드컵 토너먼트 테스트\n');

// --- 남자 연예인 토너먼트 테스트 ---
section('남자 연예인 토너먼트');

test('남자 토너먼트 3개 존재', () => {
  return CELEBRITY_MALE_TIER_TOURNAMENTS.length === 3;
});

test('메인 토너먼트 32명 포함', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  return main.items.length === 32;
});

test('모든 아이템에 description 존재', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  return main.items.every(item => item.description && item.description.length > 0);
});

test('모든 아이템에 emoji 존재', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  return main.items.every(item => item.emoji && item.emoji.length > 0);
});

test('imageUrl 미사용 (저작권)', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  return main.items.every(item => !('imageUrl' in item) || item.imageUrl === undefined);
});

test('20대 연예인 12명', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  const count = main.items.filter(item => item.tags?.includes('20대')).length;
  return count === 12;
});

test('30대 연예인 12명', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  const count = main.items.filter(item => item.tags?.includes('30대')).length;
  return count === 12;
});

test('40대 연예인 8명', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  const count = main.items.filter(item => item.tags?.includes('40대')).length;
  return count === 8;
});

test('ID 중복 없음', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  const ids = main.items.map(item => item.id);
  return new Set(ids).size === ids.length;
});

test('카테고리가 celebrity', () => {
  return CELEBRITY_MALE_TIER_TOURNAMENTS.every(t => t.category === 'celebrity');
});

test('타겟 성별이 female', () => {
  const main = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  return main.meta?.targetGender?.includes('female') ?? false;
});

// --- 여자 연예인 토너먼트 테스트 ---
section('여자 연예인 토너먼트');

test('여자 토너먼트 3개 존재', () => {
  return CELEBRITY_FEMALE_TIER_TOURNAMENTS.length === 3;
});

test('메인 토너먼트 32명 포함', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  return main.items.length === 32;
});

test('모든 아이템에 description 존재', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  return main.items.every(item => item.description && item.description.length > 0);
});

test('모든 아이템에 emoji 존재', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  return main.items.every(item => item.emoji && item.emoji.length > 0);
});

test('imageUrl 미사용 (저작권)', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  return main.items.every(item => !('imageUrl' in item) || item.imageUrl === undefined);
});

test('20대 연예인 12명', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  const count = main.items.filter(item => item.tags?.includes('20대')).length;
  return count === 12;
});

test('30대 연예인 12명', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  const count = main.items.filter(item => item.tags?.includes('30대')).length;
  return count === 12;
});

test('40대 연예인 8명', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  const count = main.items.filter(item => item.tags?.includes('40대')).length;
  return count === 8;
});

test('ID 중복 없음', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  const ids = main.items.map(item => item.id);
  return new Set(ids).size === ids.length;
});

test('카테고리가 celebrity', () => {
  return CELEBRITY_FEMALE_TIER_TOURNAMENTS.every(t => t.category === 'celebrity');
});

test('타겟 성별이 male', () => {
  const main = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  return main.meta?.targetGender?.includes('male') ?? false;
});

// --- 통합 테스트 ---
section('통합 테스트');

test('getTournamentsByCategory로 celebrity 조회', () => {
  const tournaments = getTournamentsByCategory('celebrity');
  return tournaments.length === 6; // 남 3 + 여 3
});

test('getTournamentById로 메인 토너먼트 조회', () => {
  const male = getTournamentById('celebrity-male-ideal-type-v1');
  const female = getTournamentById('celebrity-female-ideal-type-v1');
  return male !== undefined && female !== undefined;
});

test('TIER_TOURNAMENTS에 celebrity 토너먼트 포함', () => {
  const celebrityCount = TIER_TOURNAMENTS.filter(t => t.category === 'celebrity').length;
  return celebrityCount === 6;
});

test('바이럴 훅 존재', () => {
  const male = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  const female = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  return (
    male.viralHooks?.debateTopics?.length! > 0 &&
    female.viralHooks?.debateTopics?.length! > 0
  );
});

test('티어 라벨 커스텀', () => {
  const male = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
  const female = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];
  return (
    male.tierLabels?.S === '결혼각 이상형 💍' &&
    female.tierLabels?.S === '결혼각 이상형 💍'
  );
});

// --- 특정 연예인 포함 확인 ---
section('딥리서치 데이터 반영 확인');

const maleMain = CELEBRITY_MALE_TIER_TOURNAMENTS[0];
const femaleMain = CELEBRITY_FEMALE_TIER_TOURNAMENTS[0];

test('차은우 포함 (남자)', () => {
  return maleMain.items.some(item => item.name === '차은우');
});

test('변우석 포함 (남자)', () => {
  return maleMain.items.some(item => item.name === '변우석');
});

test('손석구 포함 (남자)', () => {
  return maleMain.items.some(item => item.name === '손석구');
});

test('장원영 포함 (여자)', () => {
  return femaleMain.items.some(item => item.name === '장원영');
});

test('카리나 포함 (여자)', () => {
  return femaleMain.items.some(item => item.name === '카리나');
});

test('송혜교 포함 (여자)', () => {
  return femaleMain.items.some(item => item.name === '송혜교');
});

// ============================================================================
// 결과 출력
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('📊 테스트 결과');
console.log('='.repeat(60));
console.log(`✅ 통과: ${passed}`);
console.log(`❌ 실패: ${failed}`);
console.log(`📈 성공률: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);
console.log('='.repeat(60) + '\n');

if (failed > 0) {
  process.exit(1);
}
