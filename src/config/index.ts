/**
 * 중앙화된 설정 export
 *
 * 사용법:
 * import { LEVEL_THRESHOLDS, BADGE_THRESHOLDS } from '@/config';
 * import { QUARTER_NAMES, getSeasonDisplayName } from '@/config';
 */

// 점수/레벨 관련
export {
  type Level,
  LEVEL_THRESHOLDS,
  LEVELS,
  SCORING,
  BADGE_THRESHOLDS,
  LEVEL_DESCRIPTIONS,
} from './scoring';

// 시즌/분기 관련
export {
  QUARTER_NAMES,
  QUARTER_EMOJIS,
  SEASON_TYPES,
  SEASON_TYPE_LABELS,
  getQuarterName,
  getSeasonDisplayName,
} from './seasons';

// 테스트 키 관련 (기존)
export { DETAIL_TEST_KEYS, type DetailTestKey } from './testKeys';
