/**
 * @deprecated 이 파일은 @/config로 이동되었습니다.
 * 하위 호환성을 위해 re-export합니다.
 *
 * 새 코드에서는 다음을 사용하세요:
 * import { LEVEL_THRESHOLDS, LEVELS, SCORING, type Level } from '@/config';
 */
export { type Level, LEVEL_THRESHOLDS, LEVELS, SCORING } from '@/config';

// 레거시 호환용 (기존 코드가 CHEMI_CONSTANTS를 사용하는 경우)
import { LEVEL_THRESHOLDS, LEVELS, SCORING } from '@/config';

export const CHEMI_CONSTANTS = {
    ...SCORING,
    LEVEL_THRESHOLDS,
    LEVELS,
};
