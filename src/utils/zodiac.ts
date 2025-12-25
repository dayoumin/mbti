// ============================================================================
// 연도/띠 동적 계산 유틸리티
// ============================================================================
//
// ⚠️ 중요: 양력(그레고리력) 기준
// - 이 모듈은 양력 1월 1일을 기준으로 연도를 계산합니다.
// - 음력 설날(1~2월) 기준이 아닙니다.
// - 전통적 띠 계산(음력 설날 기준)과 다를 수 있으나,
//   현대 한국에서 일반적으로 사용하는 양력 기준을 따릅니다.
// - 콘텐츠 목적상 엄밀한 음력 기준보다 이해하기 쉬운 양력 기준 채택.
//
// ============================================================================

/**
 * 12지신 띠 정보
 */
export const ZODIAC_ANIMALS = [
  { key: 'rat', name: '쥐', emoji: '🐀' },
  { key: 'ox', name: '소', emoji: '🐂' },
  { key: 'tiger', name: '호랑이', emoji: '🐅' },
  { key: 'rabbit', name: '토끼', emoji: '🐇' },
  { key: 'dragon', name: '용', emoji: '🐉' },
  { key: 'snake', name: '뱀', emoji: '🐍' },
  { key: 'horse', name: '말', emoji: '🐴' },
  { key: 'goat', name: '양', emoji: '🐐' },
  { key: 'monkey', name: '원숭이', emoji: '🐒' },
  { key: 'rooster', name: '닭', emoji: '🐓' },
  { key: 'dog', name: '개', emoji: '🐕' },
  { key: 'pig', name: '돼지', emoji: '🐖' },
] as const;

/**
 * 10천간 (갑을병정무기경신임계)
 */
export const HEAVENLY_STEMS = [
  { key: 'gap', name: '갑', hanja: '甲', element: '목', color: '청' },
  { key: 'eul', name: '을', hanja: '乙', element: '목', color: '청' },
  { key: 'byeong', name: '병', hanja: '丙', element: '화', color: '적' },
  { key: 'jeong', name: '정', hanja: '丁', element: '화', color: '적' },
  { key: 'mu', name: '무', hanja: '戊', element: '토', color: '황' },
  { key: 'gi', name: '기', hanja: '己', element: '토', color: '황' },
  { key: 'gyeong', name: '경', hanja: '庚', element: '금', color: '백' },
  { key: 'sin', name: '신', hanja: '辛', element: '금', color: '백' },
  { key: 'im', name: '임', hanja: '壬', element: '수', color: '흑' },
  { key: 'gye', name: '계', hanja: '癸', element: '수', color: '흑' },
] as const;

/**
 * 12지지 (자축인묘진사오미신유술해)
 */
export const EARTHLY_BRANCHES = [
  { key: 'ja', name: '자', hanja: '子', animal: 'rat' },
  { key: 'chuk', name: '축', hanja: '丑', animal: 'ox' },
  { key: 'in', name: '인', hanja: '寅', animal: 'tiger' },
  { key: 'myo', name: '묘', hanja: '卯', animal: 'rabbit' },
  { key: 'jin', name: '진', hanja: '辰', animal: 'dragon' },
  { key: 'sa', name: '사', hanja: '巳', animal: 'snake' },
  { key: 'o', name: '오', hanja: '午', animal: 'horse' },
  { key: 'mi', name: '미', hanja: '未', animal: 'goat' },
  { key: 'sin', name: '신', hanja: '申', animal: 'monkey' },
  { key: 'yu', name: '유', hanja: '酉', animal: 'rooster' },
  { key: 'sul', name: '술', hanja: '戌', animal: 'dog' },
  { key: 'hae', name: '해', hanja: '亥', animal: 'pig' },
] as const;

export type ZodiacAnimalKey = typeof ZODIAC_ANIMALS[number]['key'];

// ============================================================================
// 핵심 계산 함수
// ============================================================================

/**
 * 현재 연도 반환 (새해 콘텐츠용: 12월엔 다음해 반환)
 * @param forNewYear true면 12월에 다음해 반환
 */
export function getCurrentYear(forNewYear = false): number {
  // KST(한국 표준시) 기준으로 연도/월 계산 - Vercel/Node UTC 환경에서도 일관된 동작
  const now = new Date();
  const kstFormatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric',
    month: 'numeric',
  });
  const parts = kstFormatter.formatToParts(now);
  const year = parseInt(parts.find(p => p.type === 'year')!.value, 10);
  const month = parseInt(parts.find(p => p.type === 'month')!.value, 10);

  // 12월이고 새해 콘텐츠용이면 다음해 반환
  if (forNewYear && month === 12) {
    return year + 1;
  }
  return year;
}

/**
 * 연도에 해당하는 띠 인덱스 (0-11)
 * 기준: 2020년 = 쥐띠 (0)
 */
export function getZodiacIndex(year: number): number {
  return ((year - 2020) % 12 + 12) % 12;
}

/**
 * 연도에 해당하는 천간 인덱스 (0-9)
 * 기준: 2020년 = 경(6)
 */
export function getStemIndex(year: number): number {
  return ((year - 2020 + 6) % 10 + 10) % 10;
}

/**
 * 연도에 해당하는 지지 인덱스 (0-11)
 * 기준: 2020년 = 자(0)
 */
export function getBranchIndex(year: number): number {
  return ((year - 2020) % 12 + 12) % 12;
}

// ============================================================================
// 정보 조회 함수
// ============================================================================

/**
 * 연도의 띠 정보 반환
 */
export function getZodiacAnimal(year: number) {
  return ZODIAC_ANIMALS[getZodiacIndex(year)];
}

/**
 * 연도의 천간 정보 반환
 */
export function getHeavenlyStem(year: number) {
  return HEAVENLY_STEMS[getStemIndex(year)];
}

/**
 * 연도의 지지 정보 반환
 */
export function getEarthlyBranch(year: number) {
  return EARTHLY_BRANCHES[getBranchIndex(year)];
}

/**
 * 연도의 간지(干支) 이름 반환
 * 예: 2025 → "을사년(乙巳年)"
 */
export function getGanjiName(year: number): string {
  const stem = getHeavenlyStem(year);
  const branch = getEarthlyBranch(year);
  return `${stem.name}${branch.name}년(${stem.hanja}${branch.hanja}年)`;
}

/**
 * 연도의 띠 이름 반환
 * 예: 2025 → "뱀띠"
 */
export function getZodiacName(year: number): string {
  const animal = getZodiacAnimal(year);
  return `${animal.name}띠`;
}

/**
 * 연도의 색상+띠 이름 반환
 * 예: 2025 → "푸른 뱀"
 */
export function getColoredZodiacName(year: number): string {
  const stem = getHeavenlyStem(year);
  const animal = getZodiacAnimal(year);

  const colorMap: Record<string, string> = {
    '청': '푸른',
    '적': '붉은',
    '황': '황금',
    '백': '하얀',
    '흑': '검은',
  };

  return `${colorMap[stem.color] || stem.color} ${animal.name}`;
}

// ============================================================================
// 새해 콘텐츠용 헬퍼
// ============================================================================

/**
 * 새해 콘텐츠용 연도 정보 객체
 * 12월에는 다음해 정보 반환
 */
export function getNewYearInfo() {
  const year = getCurrentYear(true);
  const animal = getZodiacAnimal(year);
  const stem = getHeavenlyStem(year);
  const branch = getEarthlyBranch(year);

  return {
    year,
    animal,
    stem,
    branch,
    ganjiName: getGanjiName(year),           // "을사년(乙巳年)"
    zodiacName: getZodiacName(year),         // "뱀띠"
    coloredName: getColoredZodiacName(year), // "푸른 뱀"
    emoji: animal.emoji,
  };
}

/**
 * 동적 연도 정보 스냅샷 생성
 *
 * 주의: 각 getter 호출마다 getCurrentYear()가 호출되어
 * 자정 경계에서 불일치 가능성이 있었음.
 * → 스냅샷 패턴으로 일관성 보장.
 *
 * @example
 * const info = createDynamicYearSnapshot();
 * console.log(info.year, info.ganji, info.zodiac);
 */
export function createDynamicYearSnapshot() {
  const year = getCurrentYear(true);
  const animal = getZodiacAnimal(year);

  return {
    year,
    yearText: `${year}년`,
    ganji: getGanjiName(year),
    zodiac: getZodiacName(year),
    coloredZodiac: getColoredZodiacName(year),
    fullName: `${year}년 ${getGanjiName(year)}`,
    emoji: animal.emoji,
  };
}

/**
 * 동적 문자열 생성 헬퍼 (레거시 호환)
 *
 * ⚠️ 주의: 각 getter 호출마다 getCurrentYear()가 호출됨
 * - 자정 경계에서 year와 ganji가 불일치할 수 있음
 * - 일관성이 필요하면 createDynamicYearSnapshot() 사용 권장
 *
 * @deprecated createDynamicYearSnapshot() 사용 권장
 */
export const DYNAMIC_YEAR = {
  /** 현재/다음 연도 (12월엔 다음해) */
  get year() { return getCurrentYear(true); },

  /** "2025년" */
  get yearText() { return `${this.year}년`; },

  /** "을사년(乙巳年)" */
  get ganji() { return getGanjiName(this.year); },

  /** "뱀띠" */
  get zodiac() { return getZodiacName(this.year); },

  /** "푸른 뱀" */
  get coloredZodiac() { return getColoredZodiacName(this.year); },

  /** "2025년 을사년(乙巳年)" */
  get fullName() { return `${this.year}년 ${this.ganji}`; },

  /** 띠 동물 이모지 */
  get emoji() { return getZodiacAnimal(this.year).emoji; },
};

// ============================================================================
// 검증용: 연도별 간지 테이블
// ============================================================================

// 2020: 경자년(庚子年) 쥐띠
// 2021: 신축년(辛丑年) 소띠
// 2022: 임인년(壬寅年) 호랑이띠
// 2023: 계묘년(癸卯年) 토끼띠
// 2024: 갑진년(甲辰年) 용띠
// 2025: 을사년(乙巳年) 뱀띠
// 2026: 병오년(丙午年) 말띠
// 2027: 정미년(丁未年) 양띠
// 2028: 무신년(戊申年) 원숭이띠
// 2029: 기유년(己酉年) 닭띠
// 2030: 경술년(庚戌年) 개띠
// 2031: 신해년(辛亥年) 돼지띠
