/**
 * 시간대 기반 로테이션 로직 테스트
 *
 * 테스트 항목:
 * 1. 같은 시간대 = 같은 콘텐츠 순서
 * 2. 다른 시간대 = 다른 콘텐츠 순서
 * 3. 6시간 슬롯 계산 정확성
 */

const ROTATION_HOURS = 6;

// ============================================================================
// 테스트할 함수들 (TodayQuizPoll.tsx에서 복사)
// ============================================================================

function getCurrentTimeSlot(date = new Date()) {
  const dateKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  const slotIndex = Math.floor(date.getHours() / ROTATION_HOURS);
  return { dateKey, slotIndex };
}

function getTimeUntilNextRotation(now = new Date()) {
  const currentHour = now.getHours();
  const nextSlotHour = (Math.floor(currentHour / ROTATION_HOURS) + 1) * ROTATION_HOURS;

  const nextRotation = new Date(now);
  if (nextSlotHour >= 24) {
    nextRotation.setDate(nextRotation.getDate() + 1);
    nextRotation.setHours(0, 0, 0, 0);
  } else {
    nextRotation.setHours(nextSlotHour, 0, 0, 0);
  }

  return nextRotation.getTime() - now.getTime();
}

function seededRandom(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function seededShuffle(array, seed) {
  const shuffled = [...array];
  const random = seededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// 테스트
// ============================================================================

console.log('🧪 시간대 기반 로테이션 테스트\n');
console.log('='.repeat(60));

// 테스트 1: 시간대 슬롯 계산
console.log('\n📅 테스트 1: 시간대 슬롯 계산');
console.log('-'.repeat(40));

const testHours = [0, 3, 5, 6, 11, 12, 17, 18, 23];
testHours.forEach(hour => {
  const testDate = new Date(2024, 11, 23, hour, 30, 0); // 2024-12-23 HH:30:00
  const slot = getCurrentTimeSlot(testDate);
  const expectedSlot = Math.floor(hour / 6);
  const pass = slot.slotIndex === expectedSlot;
  console.log(`  ${hour}시 → 슬롯 ${slot.slotIndex} (예상: ${expectedSlot}) ${pass ? '✅' : '❌'}`);
});

// 테스트 2: 같은 시간대 = 같은 순서
console.log('\n🔄 테스트 2: 같은 시간대 = 같은 순서');
console.log('-'.repeat(40));

const testItems = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const timeSlotSeed1 = '2024-12-23-slot2';
const timeSlotSeed2 = '2024-12-23-slot2'; // 동일

const seed1 = hashString(`quiz-${timeSlotSeed1}`);
const seed2 = hashString(`quiz-${timeSlotSeed2}`);

const shuffled1 = seededShuffle(testItems, seed1);
const shuffled2 = seededShuffle(testItems, seed2);

const sameOrder = JSON.stringify(shuffled1) === JSON.stringify(shuffled2);
console.log(`  시드 1: ${timeSlotSeed1} → [${shuffled1.join(', ')}]`);
console.log(`  시드 2: ${timeSlotSeed2} → [${shuffled2.join(', ')}]`);
console.log(`  동일 순서: ${sameOrder ? '✅ YES' : '❌ NO'}`);

// 테스트 3: 다른 시간대 = 다른 순서
console.log('\n🔀 테스트 3: 다른 시간대 = 다른 순서');
console.log('-'.repeat(40));

const differentSlots = [
  '2024-12-23-slot0',
  '2024-12-23-slot1',
  '2024-12-23-slot2',
  '2024-12-23-slot3',
  '2024-12-24-slot0', // 다음 날
];

const results = differentSlots.map(slot => {
  const seed = hashString(`quiz-${slot}`);
  const shuffled = seededShuffle(testItems, seed);
  return { slot, order: shuffled.slice(0, 3).join(',') };
});

results.forEach(r => {
  console.log(`  ${r.slot} → [${r.order}, ...]`);
});

// 유니크 순서 체크
const uniqueOrders = new Set(results.map(r => r.order));
const allDifferent = uniqueOrders.size === results.length;
console.log(`  모두 다른 순서: ${allDifferent ? '✅ YES' : '⚠️ 일부 중복'}`);

// 테스트 4: 다음 로테이션 시간 계산
console.log('\n⏰ 테스트 4: 다음 로테이션까지 시간');
console.log('-'.repeat(40));

const rotationTests = [
  { hour: 0, min: 0, expected: 6 * 60 },    // 0시 → 6시 (6시간)
  { hour: 5, min: 30, expected: 30 },        // 5:30 → 6시 (30분)
  { hour: 6, min: 0, expected: 6 * 60 },    // 6시 → 12시 (6시간)
  { hour: 11, min: 59, expected: 1 },        // 11:59 → 12시 (1분)
  { hour: 23, min: 0, expected: 60 },        // 23시 → 다음날 0시 (1시간)
];

rotationTests.forEach(test => {
  const testDate = new Date(2024, 11, 23, test.hour, test.min, 0);
  const msUntil = getTimeUntilNextRotation(testDate);
  const minUntil = Math.round(msUntil / 60000);
  const pass = Math.abs(minUntil - test.expected) < 2; // 1분 오차 허용
  console.log(`  ${test.hour}:${String(test.min).padStart(2, '0')} → ${minUntil}분 후 (예상: ${test.expected}분) ${pass ? '✅' : '❌'}`);
});

// 테스트 5: 결정론적 재현성
console.log('\n🎯 테스트 5: 결정론적 재현성 (100회 반복)');
console.log('-'.repeat(40));

const fixedSeed = '2024-12-23-slot2';
let allSame = true;
let firstResult = null;

for (let i = 0; i < 100; i++) {
  const seed = hashString(`quiz-${fixedSeed}`);
  const result = seededShuffle(testItems, seed);

  if (firstResult === null) {
    firstResult = JSON.stringify(result);
  } else if (JSON.stringify(result) !== firstResult) {
    allSame = false;
    break;
  }
}

console.log(`  100회 반복 결과 동일: ${allSame ? '✅ YES' : '❌ NO'}`);

// 결과 요약
console.log('\n' + '='.repeat(60));
console.log('📊 테스트 요약');
console.log('='.repeat(60));
console.log(`
✅ 구현된 기능:
  - 6시간 단위 시간대 슬롯 (0-5, 6-11, 12-17, 18-23시)
  - 날짜 + 슬롯을 시드로 사용하여 결정론적 셔플
  - 같은 시간대 접속 = 같은 콘텐츠 순서
  - 다른 시간대 = 다른 콘텐츠 순서
  - 다음 로테이션 시간 자동 계산

💡 사용자 경험:
  - 같은 시간대에 새로고침해도 같은 퀴즈/투표 표시
  - 6시간 후 접속 시 새로운 콘텐츠 세트
  - 이미 푼 것은 제외되고 안 푼 것 중에서 선택
`);
