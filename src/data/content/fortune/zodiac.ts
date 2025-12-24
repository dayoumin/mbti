// ============================================================================
// 12지신 운세 데이터 (연도 자동 계산)
// ============================================================================

import type { ZodiacFortune } from '../types';

// 12지신 순서 (자-축-인-묘-진-사-오-미-신-유-술-해)
const ZODIAC_ORDER: ZodiacFortune['sign'][] = [
  'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
  'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'
];

// 천간 (10개, 갑-을-병-정-무-기-경-신-임-계)
const HEAVENLY_STEMS = [
  { name: '갑', element: 'wood', color: '청색', yin: false },
  { name: '을', element: 'wood', color: '청색', yin: true },
  { name: '병', element: 'fire', color: '적색', yin: false },
  { name: '정', element: 'fire', color: '적색', yin: true },
  { name: '무', element: 'earth', color: '황색', yin: false },
  { name: '기', element: 'earth', color: '황색', yin: true },
  { name: '경', element: 'metal', color: '백색', yin: false },
  { name: '신', element: 'metal', color: '백색', yin: true },
  { name: '임', element: 'water', color: '흑색', yin: false },
  { name: '계', element: 'water', color: '흑색', yin: true },
];

// 지지 (12개, 자-축-인-묘-진-사-오-미-신-유-술-해)
const EARTHLY_BRANCHES = [
  { name: '자', animal: 'rat', animalKo: '쥐' },
  { name: '축', animal: 'ox', animalKo: '소' },
  { name: '인', animal: 'tiger', animalKo: '호랑이' },
  { name: '묘', animal: 'rabbit', animalKo: '토끼' },
  { name: '진', animal: 'dragon', animalKo: '용' },
  { name: '사', animal: 'snake', animalKo: '뱀' },
  { name: '오', animal: 'horse', animalKo: '말' },
  { name: '미', animal: 'goat', animalKo: '양' },
  { name: '신', animal: 'monkey', animalKo: '원숭이' },
  { name: '유', animal: 'rooster', animalKo: '닭' },
  { name: '술', animal: 'dog', animalKo: '개' },
  { name: '해', animal: 'pig', animalKo: '돼지' },
];

/**
 * 연도로 천간지지 계산
 * 기준: 1984년 = 갑자년
 */
export function getYearInfo(year: number) {
  const baseYear = 1984; // 갑자년
  const diff = year - baseYear;

  const stemIndex = ((diff % 10) + 10) % 10;
  const branchIndex = ((diff % 12) + 12) % 12;

  const stem = HEAVENLY_STEMS[stemIndex];
  const branch = EARTHLY_BRANCHES[branchIndex];

  return {
    year,
    name: `${stem.name}${branch.name}년`,
    nameEn: `Year of the ${stem.element.charAt(0).toUpperCase() + stem.element.slice(1)} ${branch.animalKo}`,
    animal: branch.animal as ZodiacFortune['sign'],
    animalKo: branch.animalKo,
    element: stem.element,
    color: stem.color,
    yin: stem.yin,
  };
}

/**
 * 올해의 띠 정보
 */
export function getCurrentYearInfo() {
  return getYearInfo(new Date().getFullYear());
}

/**
 * 출생연도로 띠 계산
 */
export function getZodiacSign(birthYear: number): ZodiacFortune['sign'] {
  const baseYear = 1984; // 갑자년 = 쥐띠
  const diff = birthYear - baseYear;
  const index = ((diff % 12) + 12) % 12;
  return ZODIAC_ORDER[index];
}

/**
 * 12지신 기본 성격 데이터 (영구, 연도 무관)
 */
export const ZODIAC_PERSONALITIES: Record<ZodiacFortune['sign'], {
  name: string;
  emoji: string;
  traits: string[];
  strengths: string[];
  growth: string[];
}> = {
  rat: {
    name: '쥐',
    emoji: '🐀',
    traits: ['영리함', '적응력', '사교성', '기회포착', '민첩함'],
    strengths: ['위기 대처 능력이 뛰어나요', '인맥 관리를 잘해요'],
    growth: ['때로는 신중함이 필요해요', '큰 그림을 보는 연습을 해보세요'],
  },
  ox: {
    name: '소',
    emoji: '🐂',
    traits: ['성실함', '인내심', '책임감', '신뢰', '꾸준함'],
    strengths: ['믿음직스러운 사람이에요', '끈기 있게 목표를 달성해요'],
    growth: ['유연함을 키워보세요', '새로운 시도도 좋아요'],
  },
  tiger: {
    name: '호랑이',
    emoji: '🐅',
    traits: ['용맹함', '리더십', '자신감', '열정', '정의감'],
    strengths: ['추진력이 강해요', '어려운 상황에서 빛나요'],
    growth: ['가끔은 한 발 물러서 보세요', '협력의 힘을 믿어보세요'],
  },
  rabbit: {
    name: '토끼',
    emoji: '🐇',
    traits: ['온화함', '섬세함', '예술성', '평화추구', '사려깊음'],
    strengths: ['분위기를 부드럽게 만들어요', '세심한 배려를 해요'],
    growth: ['자기 주장도 필요해요', '결단력을 키워보세요'],
  },
  dragon: {
    name: '용',
    emoji: '🐉',
    traits: ['카리스마', '야망', '자신감', '창의력', '독립심'],
    strengths: ['사람들을 이끄는 힘이 있어요', '큰 꿈을 꿔요'],
    growth: ['겸손함을 더해보세요', '팀워크의 가치를 느껴보세요'],
  },
  snake: {
    name: '뱀',
    emoji: '🐍',
    traits: ['지혜', '신비로움', '직관력', '침착함', '매력'],
    strengths: ['통찰력이 뛰어나요', '목표를 향해 차분히 나아가요'],
    growth: ['마음을 더 열어보세요', '신뢰를 쌓는 시간을 가져보세요'],
  },
  horse: {
    name: '말',
    emoji: '🐎',
    traits: ['활동적', '자유로움', '열정', '낙관적', '사교적'],
    strengths: ['어디서든 분위기 메이커예요', '새로운 도전을 두려워하지 않아요'],
    growth: ['꾸준함을 더해보세요', '마무리의 중요성을 기억하세요'],
  },
  goat: {
    name: '양',
    emoji: '🐑',
    traits: ['온순함', '예술성', '배려심', '평화주의', '감성적'],
    strengths: ['창의적인 아이디어가 넘쳐요', '주변을 편안하게 해요'],
    growth: ['자기 표현을 더 해보세요', '결정을 미루지 마세요'],
  },
  monkey: {
    name: '원숭이',
    emoji: '🐒',
    traits: ['영리함', '재치', '호기심', '유연함', '사교성'],
    strengths: ['어떤 상황에서도 해결책을 찾아요', '유머 감각이 뛰어나요'],
    growth: ['진지함도 필요할 때가 있어요', '꾸준히 한 가지에 집중해보세요'],
  },
  rooster: {
    name: '닭',
    emoji: '🐓',
    traits: ['부지런함', '정직함', '자신감', '완벽주의', '관찰력'],
    strengths: ['계획을 세우고 실행하는 능력이 뛰어나요', '디테일을 놓치지 않아요'],
    growth: ['유연하게 생각해보세요', '비판보다 격려를 먼저 해보세요'],
  },
  dog: {
    name: '개',
    emoji: '🐕',
    traits: ['충성심', '정직함', '의리', '보호본능', '책임감'],
    strengths: ['누구보다 믿음직스러워요', '어려울 때 곁을 지켜요'],
    growth: ['가끔은 자신을 위한 시간도 가져보세요', '변화도 긍정적으로 받아들여보세요'],
  },
  pig: {
    name: '돼지',
    emoji: '🐷',
    traits: ['순수함', '관대함', '낙천적', '성실함', '인내심'],
    strengths: ['베풀기를 좋아해요', '긍정적인 에너지를 줘요'],
    growth: ['가끔은 거절하는 법도 배워보세요', '현실적인 판단도 필요해요'],
  },
};

/**
 * 삼합 관계 (가장 잘 맞는 조합)
 * - 신자진 (원숭이-쥐-용): 수국
 * - 해묘미 (돼지-토끼-양): 목국
 * - 인오술 (호랑이-말-개): 화국
 * - 사유축 (뱀-닭-소): 금국
 */
const SAMHAP: Record<ZodiacFortune['sign'], ZodiacFortune['sign'][]> = {
  rat: ['monkey', 'dragon'],
  ox: ['snake', 'rooster'],
  tiger: ['horse', 'dog'],
  rabbit: ['pig', 'goat'],
  dragon: ['rat', 'monkey'],
  snake: ['ox', 'rooster'],
  horse: ['tiger', 'dog'],
  goat: ['rabbit', 'pig'],
  monkey: ['rat', 'dragon'],
  rooster: ['snake', 'ox'],
  dog: ['tiger', 'horse'],
  pig: ['rabbit', 'goat'],
};

/**
 * 육합 관계 (1:1 최고 궁합)
 */
const YUKHAP: Record<ZodiacFortune['sign'], ZodiacFortune['sign']> = {
  rat: 'ox',
  ox: 'rat',
  tiger: 'pig',
  rabbit: 'dog',
  dragon: 'rooster',
  snake: 'monkey',
  horse: 'goat',
  goat: 'horse',
  monkey: 'snake',
  rooster: 'dragon',
  dog: 'rabbit',
  pig: 'tiger',
};

/**
 * 올해의 띠와의 관계로 운세 메시지 생성
 */
export function getYearlyFortune(sign: ZodiacFortune['sign'], year?: number) {
  const targetYear = year || new Date().getFullYear();
  const yearInfo = getYearInfo(targetYear);
  const yearAnimal = yearInfo.animal;
  const personality = ZODIAC_PERSONALITIES[sign];

  // 본명년 (자기 띠의 해)
  if (sign === yearAnimal) {
    return {
      year: targetYear,
      theme: '주인공의 해',
      message: `${yearInfo.name}의 주인공이에요! 세상의 이목이 집중되니, 숨겨둔 재능을 마음껏 펼치세요. 단, 겸손은 필수!`,
      keywords: ['주인공', '도약', '기회'],
      luckyColor: '빨강',
      luckyNumber: 2,
      compatibility: 'best',
    };
  }

  // 삼합 관계
  if (SAMHAP[sign].includes(yearAnimal)) {
    return {
      year: targetYear,
      theme: '시너지의 해',
      message: `${yearInfo.animalKo}띠와 삼합! 좋은 파트너를 만나 시너지를 낼 수 있는 해예요. 협력하면 더 큰 성과가 있어요.`,
      keywords: ['협력', '시너지', '성장'],
      luckyColor: '금색',
      luckyNumber: 6,
      compatibility: 'great',
    };
  }

  // 육합 관계
  if (YUKHAP[sign] === yearAnimal) {
    return {
      year: targetYear,
      theme: '안정과 결실',
      message: `${yearInfo.animalKo}띠와 육합! 안정적인 운세가 이어져요. 꾸준히 노력한 것이 결실을 맺는 해예요.`,
      keywords: ['안정', '결실', '보상'],
      luckyColor: '노랑',
      luckyNumber: 8,
      compatibility: 'good',
    };
  }

  // 일반 관계
  return {
    year: targetYear,
    theme: '새로운 도전',
    message: `${yearInfo.name}에는 새로운 도전이 기다려요. ${personality.strengths[0]} 이 강점을 살려보세요!`,
    keywords: ['도전', '성장', '변화'],
    luckyColor: '파랑',
    luckyNumber: 3,
    compatibility: 'neutral',
  };
}

/**
 * ZodiacFortune 형태로 변환 (기존 호환성 유지)
 */
export function getZodiacFortune(sign: ZodiacFortune['sign'], year?: number): ZodiacFortune {
  const targetYear = year || new Date().getFullYear();
  const personality = ZODIAC_PERSONALITIES[sign];
  const yearly = getYearlyFortune(sign, targetYear);

  // 출생 연도 목록 생성 (1960~2030 범위)
  const years: number[] = [];
  const signIndex = ZODIAC_ORDER.indexOf(sign);
  for (let y = 1960 + signIndex; y <= 2030; y += 12) {
    years.push(y);
  }

  return {
    id: `zodiac-${sign}-${targetYear}`,
    sign,
    name: personality.name,
    emoji: personality.emoji,
    years,
    yearly: {
      year: yearly.year,
      theme: yearly.theme,
      message: yearly.message,
      keywords: yearly.keywords,
      luckyColor: yearly.luckyColor,
      luckyNumber: yearly.luckyNumber,
    },
    personality: {
      traits: personality.traits,
      strengths: personality.strengths,
      growth: personality.growth,
    },
    meta: { minAge: '20s' },
  };
}

/**
 * 전체 12지신 운세 (현재 연도 기준)
 */
export function getAllZodiacFortunes(year?: number): ZodiacFortune[] {
  const targetYear = year || new Date().getFullYear();
  return ZODIAC_ORDER.map(sign => getZodiacFortune(sign, targetYear));
}

/**
 * 올해의 테마 정보
 */
export function getCurrentYearTheme() {
  const yearInfo = getCurrentYearInfo();

  const themeKeywords: Record<string, string[]> = {
    wood: ['성장', '창의성', '새로운 시작'],
    fire: ['열정', '변화', '에너지'],
    earth: ['안정', '실용', '기반 다지기'],
    metal: ['결단', '정리', '수확'],
    water: ['지혜', '유연함', '흐름'],
  };

  return {
    year: yearInfo.year,
    name: yearInfo.name,
    nameEn: yearInfo.nameEn,
    animal: yearInfo.animal,
    animalKo: yearInfo.animalKo,
    element: yearInfo.element,
    color: yearInfo.color,
    keywords: themeKeywords[yearInfo.element] || [],
    description: `${yearInfo.animalKo}의 해! ${yearInfo.element === 'wood' ? '새로운 시작' : yearInfo.element === 'fire' ? '열정적인 변화' : yearInfo.element === 'earth' ? '안정적인 성장' : yearInfo.element === 'metal' ? '결실의 시간' : '지혜로운 흐름'}이 기다려요.`,
  };
}

// 하위 호환성을 위한 export
export const ZODIAC_FORTUNES = getAllZodiacFortunes();
export const ZODIAC_THEME = getCurrentYearTheme();

// 기존 함수명 호환
export const calculateZodiacSign = (birthYear: number) => getZodiacFortune(getZodiacSign(birthYear));
export const getZodiacByBirthYear = (year: number) => getZodiacFortune(getZodiacSign(year));
export const getZodiacFortuneBySign = (sign: string) => getZodiacFortune(sign as ZodiacFortune['sign']);
