/**
 * 연령 등급 시스템 테스트
 * 실행: node scripts/test-age-rating.mjs
 */

// ============================================================================
// 테스트용 함수 구현 (타입스크립트 모듈을 직접 import 불가하므로 로직 복제)
// ============================================================================

const AGE_ORDER = ['~9', '10s', '20s', '30s', '40s+'];

function isMinor(ageGroup) {
  return ageGroup === '~9' || ageGroup === '10s';
}

function isContentAllowedForAge(content, ageGroup) {
  const meta = content.meta;

  // 메타데이터 없으면 전체 허용
  if (!meta) return true;

  // 1. ageRating: 'adult' 또는 isAdultOnly 체크
  const isAdult = meta.ageRating === 'adult' || meta.isAdultOnly;
  if (isAdult) {
    // 미성년자이거나 연령 미확인 → 차단
    if (!ageGroup || isMinor(ageGroup)) return false;
  }

  // 2. 레거시: 최소 연령 체크
  if (meta.minAge) {
    if (!ageGroup) return false;
    const minIndex = AGE_ORDER.indexOf(meta.minAge);
    const userIndex = AGE_ORDER.indexOf(ageGroup);
    if (userIndex < minIndex) return false;
  }

  // 3. 레거시: 허용 연령 목록 체크
  if (meta.allowedAges && meta.allowedAges.length > 0) {
    if (!ageGroup || !meta.allowedAges.includes(ageGroup)) return false;
  }

  return true;
}

function getKidsBoostFactor(content, ageGroup) {
  const meta = content.meta;

  // kids 콘텐츠 + 10세 미만 사용자 → 30% 부스트
  if (meta?.ageRating === 'kids' && ageGroup === '~9') {
    return 1.3;
  }

  return 1.0;
}

// ============================================================================
// 테스트 케이스
// ============================================================================

const testCases = [
  // ========== 연령 제한 필터링 테스트 ==========
  {
    name: 'all 등급 - 10대 허용',
    content: { meta: { ageRating: 'all' } },
    ageGroup: '10s',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
  {
    name: 'all 등급 - 미확인 허용',
    content: { meta: { ageRating: 'all' } },
    ageGroup: undefined,
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
  {
    name: 'kids 등급 - 10대 허용 (부스트 없음)',
    content: { meta: { ageRating: 'kids' } },
    ageGroup: '10s',
    expectedAllowed: true,
    expectedBoost: 1.0,  // 10대는 부스트 없음 (17세도 포함되므로)
  },
  {
    name: 'kids 등급 - ~9세 허용 + 부스트',
    content: { meta: { ageRating: 'kids' } },
    ageGroup: '~9',
    expectedAllowed: true,
    expectedBoost: 1.3,  // 10세 미만에게만 부스트
  },
  {
    name: 'kids 등급 - 20대 허용 (부스트 없음)',
    content: { meta: { ageRating: 'kids' } },
    ageGroup: '20s',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
  {
    name: 'adult 등급 - 10대 차단',
    content: { meta: { ageRating: 'adult' } },
    ageGroup: '10s',
    expectedAllowed: false,
    expectedBoost: 1.0,
  },
  {
    name: 'adult 등급 - 미확인 차단',
    content: { meta: { ageRating: 'adult' } },
    ageGroup: undefined,
    expectedAllowed: false,
    expectedBoost: 1.0,
  },
  {
    name: 'adult 등급 - 20대 허용',
    content: { meta: { ageRating: 'adult' } },
    ageGroup: '20s',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
  {
    name: 'adult 등급 - 30대 허용',
    content: { meta: { ageRating: 'adult' } },
    ageGroup: '30s',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
  {
    name: 'adult 등급 - 40대+ 허용',
    content: { meta: { ageRating: 'adult' } },
    ageGroup: '40s+',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },

  // ========== 레거시 호환 테스트 ==========
  {
    name: 'isAdultOnly - 10대 차단 (레거시)',
    content: { meta: { isAdultOnly: true } },
    ageGroup: '10s',
    expectedAllowed: false,
    expectedBoost: 1.0,
  },
  {
    name: 'isAdultOnly - 20대 허용 (레거시)',
    content: { meta: { isAdultOnly: true } },
    ageGroup: '20s',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
  {
    name: 'minAge 20s - 10대 차단 (레거시)',
    content: { meta: { minAge: '20s' } },
    ageGroup: '10s',
    expectedAllowed: false,
    expectedBoost: 1.0,
  },
  {
    name: 'minAge 20s - 30대 허용 (레거시)',
    content: { meta: { minAge: '20s' } },
    ageGroup: '30s',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },

  // ========== 메타데이터 없음 테스트 ==========
  {
    name: '메타 없음 - 모두 허용',
    content: {},
    ageGroup: undefined,
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
  {
    name: '메타 없음 - 10대 허용',
    content: {},
    ageGroup: '10s',
    expectedAllowed: true,
    expectedBoost: 1.0,
  },
];

// ============================================================================
// 테스트 실행
// ============================================================================

console.log('========================================');
console.log('연령 등급 시스템 테스트');
console.log('========================================\n');

let passed = 0;
let failed = 0;

for (const tc of testCases) {
  const actualAllowed = isContentAllowedForAge(tc.content, tc.ageGroup);
  const actualBoost = getKidsBoostFactor(tc.content, tc.ageGroup);

  const allowedMatch = actualAllowed === tc.expectedAllowed;
  const boostMatch = Math.abs(actualBoost - tc.expectedBoost) < 0.01;

  if (allowedMatch && boostMatch) {
    console.log(`✅ ${tc.name}`);
    passed++;
  } else {
    console.log(`❌ ${tc.name}`);
    if (!allowedMatch) {
      console.log(`   허용 여부: 예상 ${tc.expectedAllowed}, 실제 ${actualAllowed}`);
    }
    if (!boostMatch) {
      console.log(`   부스트: 예상 ${tc.expectedBoost}, 실제 ${actualBoost}`);
    }
    failed++;
  }
}

console.log('\n========================================');
console.log(`결과: ${passed}개 통과, ${failed}개 실패`);
console.log('========================================');

if (failed > 0) {
  process.exit(1);
}

// ============================================================================
// 맥락 기반 콘텐츠 분류 테스트 (AI 검증 시뮬레이션)
// ============================================================================

console.log('\n========================================');
console.log('맥락 기반 콘텐츠 분류 테스트');
console.log('========================================\n');

/**
 * 콘텐츠 텍스트를 분석하여 적절한 연령 등급 추천
 * 실제 AI 검증에서는 이 로직을 참고하여 맥락을 판단
 */
function analyzeContentForAgeRating(text) {
  // ===== 1단계: 오탐 패턴 체크 (음주 키워드 있지만 성인용 아님) =====
  // 단, 이후에 실제 음주 맥락이 있으면 adult로 재판정
  const falsePositivePatterns = [
    { pattern: /술래/, reason: '술래잡기 (놀이)' },
    { pattern: /와인딩/, reason: '와인딩 로드 (도로)' },
    { pattern: /칵테일\s*드레스/, reason: '칵테일 드레스 (패션)' },
    { pattern: /칵테일\s*새우/, reason: '칵테일 새우 (요리)' },
    { pattern: /막걸리\s*빵/, reason: '막걸리 빵 (제과)' },
    { pattern: /맥주효모/, reason: '맥주효모 (미용)' },
    { pattern: /(와인|위스키)\s*색/, reason: '색상명' },
    { pattern: /맥주\s*거품/, reason: '비유' },
    { pattern: /소주병\s*재활용/, reason: '재활용품' },
    { pattern: /포커\s*페이스/, reason: '표정 관용구' },
    { pattern: /경마장\s*(근처|맛집|주변)/, reason: '장소' },
    { pattern: /카지노\s*(인테리어|디자인)/, reason: '인테리어' },
    { pattern: /로또\s*당첨되면/, reason: '가정 질문' },
  ];

  // ===== 2단계: 확실한 성인용 패턴 =====
  const adultPatterns = [
    // 음주 행위
    { pattern: /술을?\s*(권|마시|먹|따르|돌리)/, reason: '음주 권유/섭취' },
    { pattern: /(한잔|한캔)\s*(하|마시|vs)/, reason: '음주' },
    { pattern: /(마시|먹으면서|하면서).*(와인|맥주|소주|위스키|칵테일)/, reason: '음주' },
    { pattern: /(와인|맥주|소주|위스키).*(마시|한잔|하이볼|온더락)/, reason: '음주' },
    { pattern: /칵테일(?!\s*(드레스|새우)).*(마시|한잔|vs|하이볼|온더락)/, reason: '음주' },
    { pattern: /술자리|음주/, reason: '술자리/음주 상황' },
    { pattern: /숙취/, reason: '숙취 (음주 후)' },
    { pattern: /취하/, reason: '취함 상태' },
    { pattern: /건배/, reason: '건배 (음주)' },
    { pattern: /술집/, reason: '술집' },
    { pattern: /레시피.*(칵테일|와인|맥주)|(칵테일|와인|맥주).*레시피/, reason: '술 제조' },

    // 회식 + 음주 맥락
    { pattern: /회식.*(술|취|한잔|건배|2차)/, reason: '회식 술자리' },

    // 도박
    { pattern: /베팅|판돈/, reason: '도박' },
    { pattern: /(경마|포커|카지노).*(꿀팁|전략|돈|베팅)/, reason: '도박' },
  ];

  // ===== 3단계: 회식 관련 일반 패턴 (음주 없음) =====
  const meetingOnlyPatterns = [
    { pattern: /회식.*(참석|불참|메뉴|장소|대화)(?!.*(술|취|건배|2차))/, reason: '회식 (음주 없음)' },
  ];

  // 먼저 확실한 성인용 패턴 체크
  for (const ap of adultPatterns) {
    if (ap.pattern.test(text)) {
      return { rating: 'adult', reason: ap.reason, isFalsePositive: false };
    }
  }

  // 오탐 패턴 체크
  for (const fp of falsePositivePatterns) {
    if (fp.pattern.test(text)) {
      return { rating: 'all', reason: fp.reason, isFalsePositive: true };
    }
  }

  // 회식 일반 패턴 체크
  for (const mp of meetingOnlyPatterns) {
    if (mp.pattern.test(text)) {
      return { rating: 'all', reason: mp.reason, isFalsePositive: true };
    }
  }

  // 기본 all
  return { rating: 'all', reason: '일반 콘텐츠', isFalsePositive: false };
}

// 맥락 기반 테스트 케이스
const contextTestCases = [
  // ===== 성인용 필요 (meta 추가해야 함) =====
  { text: '회식에서 상사가 술을 계속 권한다', expected: 'adult', reason: '음주 권유' },
  { text: '소주 vs 맥주, 어떤 술이 더 좋아?', expected: 'all', reason: '가벼운 취향 질문 (바이럴 우선)' },
  { text: '숙취 해소법으로 뭐가 효과 있어?', expected: 'adult', reason: '숙취' },
  { text: '와인 시음회에서 취하면?', expected: 'adult', reason: '음주+취함' },
  { text: '카지노에서 베팅 전략은?', expected: 'adult', reason: '도박' },
  { text: '술자리에서 분위기 띄우는 법', expected: 'adult', reason: '술자리' },

  // ===== 오탐 주의 (성인용 아님) =====
  { text: '술래잡기에서 누가 술래?', expected: 'all', reason: '술래잡기 (놀이)' },
  { text: '와인딩 로드를 드라이브하면?', expected: 'all', reason: '와인딩 로드 (도로)' },
  { text: '칵테일 드레스 vs 캐주얼 드레스', expected: 'all', reason: '칵테일 드레스 (패션)' },
  { text: '회식 참석 vs 불참?', expected: 'all', reason: '회식 참석 (음주 없음)' },
  { text: '막걸리 빵은 어떤 맛?', expected: 'all', reason: '막걸리 빵 (제과)' },
  { text: '맥주효모 샴푸 효과 있어?', expected: 'all', reason: '맥주효모 (미용)' },

  // ===== 일반 콘텐츠 =====
  { text: '고양이 vs 강아지 어떤 게 더 좋아?', expected: 'all', reason: '일반 투표' },
  { text: '아침형 인간 vs 저녁형 인간', expected: 'all', reason: '생활패턴' },

  // ===== 🔥 실수하기 쉬운 경계 사례 (Edge Cases) =====

  // --- 음주 관련 경계 ---
  { text: '와인 색상이 예쁜 립스틱 추천', expected: 'all', reason: '와인색 = 색상명' },
  { text: '맥주 거품 같은 라떼 아트', expected: 'all', reason: '맥주 거품 = 비유' },
  { text: '소주병 재활용 화분 만들기', expected: 'all', reason: '소주병 = 재활용품' },
  { text: '칵테일 새우 요리법', expected: 'all', reason: '칵테일 새우 = 요리' },
  { text: '위스키 색 고양이 털', expected: 'all', reason: '위스키색 = 색상명' },

  // --- 음주 맥락 확실 (adult) ---
  { text: '와인 한잔 하면서 영화 보기', expected: 'adult', reason: '와인 마시기' },
  { text: '맥주 한캔 vs 소주 한잔', expected: 'adult', reason: '술 비교' },
  { text: '칵테일 레시피 추천해줘', expected: 'adult', reason: '술 제조' },
  { text: '위스키 온더락 vs 하이볼', expected: 'adult', reason: '술 음용법' },

  // --- 회식 관련 경계 ---
  { text: '회식 메뉴 뭐가 좋아?', expected: 'all', reason: '음식만 언급' },
  { text: '회식 장소 추천', expected: 'all', reason: '장소만 언급' },
  { text: '회식에서 상사랑 대화법', expected: 'all', reason: '대화만 언급' },
  { text: '회식 후 2차 술집 가자는데', expected: 'adult', reason: '술집 = 음주' },
  { text: '회식 건배사 뭐라고 해?', expected: 'adult', reason: '건배 = 음주' },

  // --- 도박 관련 경계 ---
  { text: '경마장 근처 맛집', expected: 'all', reason: '장소만 언급' },
  { text: '포커 페이스 연습법', expected: 'all', reason: '표정 관용구' },
  { text: '카지노 인테리어 디자인', expected: 'all', reason: '인테리어' },
  { text: '로또 당첨되면 뭐할래?', expected: 'all', reason: '가정 질문' },
  { text: '경마 베팅 꿀팁', expected: 'adult', reason: '베팅 = 도박' },
  { text: '포커 판돈 얼마가 적당?', expected: 'adult', reason: '판돈 = 도박' },

  // --- 복합 사례 ---
  { text: '술래잡기하다 술 마시기', expected: 'adult', reason: '술래잡기 + 술 마시기' },
  { text: '와인딩 로드에서 와인 마시기', expected: 'adult', reason: '와인딩 + 와인 마시기' },
  { text: '칵테일 드레스 입고 칵테일 마시기', expected: 'adult', reason: '드레스 + 칵테일 마시기' },
];

let contextPassed = 0;
let contextFailed = 0;

for (const tc of contextTestCases) {
  const result = analyzeContentForAgeRating(tc.text);
  const isCorrect = result.rating === tc.expected;

  if (isCorrect) {
    const icon = result.isFalsePositive ? '🔍' : '✅';
    console.log(`${icon} "${tc.text}"`);
    console.log(`   → ${result.rating}: ${result.reason}`);
    contextPassed++;
  } else {
    console.log(`❌ "${tc.text}"`);
    console.log(`   예상: ${tc.expected} (${tc.reason})`);
    console.log(`   실제: ${result.rating} (${result.reason})`);
    contextFailed++;
  }
}

console.log('\n========================================');
console.log(`맥락 분류 결과: ${contextPassed}개 통과, ${contextFailed}개 실패`);
console.log('========================================');

// 최종 결과
const totalFailed = failed + contextFailed;
if (totalFailed > 0) {
  process.exit(1);
}
