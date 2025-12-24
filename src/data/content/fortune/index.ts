// ============================================================================
// 운세 콘텐츠 통합 export
// ============================================================================

// 12지신 운세 (연도 자동 계산)
export {
  ZODIAC_FORTUNES,
  ZODIAC_THEME,
  ZODIAC_PERSONALITIES,
  getYearInfo,
  getCurrentYearInfo,
  getCurrentYearTheme,
  getZodiacSign,
  getZodiacFortune,
  getAllZodiacFortunes,
  getYearlyFortune,
  // 하위 호환성
  getZodiacFortuneBySign,
  getZodiacByBirthYear,
  calculateZodiacSign,
} from './zodiac';

// 하위 호환성: 기존 ZODIAC_FORTUNES_2025, ZODIAC_2025_THEME 유지
export { ZODIAC_FORTUNES as ZODIAC_FORTUNES_2025 } from './zodiac';
export { ZODIAC_THEME as ZODIAC_2025_THEME } from './zodiac';

// 별자리/띠 투표 게임
export { ZODIAC_POLLS } from './zodiac-polls';

// 황도 12궁 별자리 (MZ 버전)
export {
  CONSTELLATIONS,
  COMPATIBILITY_MATRIX,
  getConstellationById,
  getConstellationByDate,
  getCompatibility,
  getCompatibilityDescription,
} from './constellations';
export type { ConstellationData, ElementType, ModalityType } from './constellations';

// 오늘의 운세 메시지
export {
  LOVE_MESSAGES,
  MONEY_MESSAGES,
  HEALTH_MESSAGES,
  GENERAL_MESSAGES,
  LUCKY_TIPS,
  ALL_DAILY_MESSAGES,
  getRandomDailyMessage,
  getRandomLuckyTip,
  getDailyFortuneSet,
} from './daily-messages';
export type { LuckyTip } from './daily-messages';

// 타입 re-export
export type {
  ZodiacSign,
  Constellation,
  ZodiacFortune,
  ZodiacPoll,
  DailyFortuneMessage,
  FortuneContent,
} from '../types';
