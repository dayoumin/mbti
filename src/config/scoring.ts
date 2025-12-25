/**
 * 점수/레벨 관련 상수
 *
 * 사용처:
 * - 테스트 결과 레벨 판정 (matchResultLabel)
 * - 게이미피케이션 배지 조건
 * - 소수 의견 판정
 */

// 레벨 타입
export type Level = 'high' | 'medium' | 'low';

// 레벨 판정 기준 (백분율)
export const LEVEL_THRESHOLDS = {
  HIGH: 60,    // 60% 이상 = high
  LOW: 40,     // 40% 미만 = low, 40~60% = medium
} as const;

// 레벨 값
export const LEVELS = {
  HIGH: 'high',
  MEDIUM: 'medium',
  LOW: 'low',
} as const;

// 점수 관련
export const SCORING = {
  MAX_SCORE_PER_QUESTION: 5,
  MIN_SCORE_PER_QUESTION: 1,
  DEFAULT_QUESTION_COUNT: 5,
} as const;

// 게이미피케이션/배지 임계값
export const BADGE_THRESHOLDS = {
  WINRATE_MASTER: 60,    // 승률 60% 이상 (랭킹 대결)
  MINORITY_OPINION: 30,  // 30% 미만이면 소수 의견
} as const;

// 레벨 설명 (UI 표시용) - 임계값과 동기화
export const LEVEL_DESCRIPTIONS = {
  HIGH: { label: 'HIGH', description: `점수 ≥ ${LEVEL_THRESHOLDS.HIGH}%`, color: 'text-green-600' },
  MEDIUM: { label: 'MEDIUM', description: `${LEVEL_THRESHOLDS.LOW}% ≤ 점수 < ${LEVEL_THRESHOLDS.HIGH}%`, color: 'text-yellow-600' },
  LOW: { label: 'LOW', description: `점수 < ${LEVEL_THRESHOLDS.LOW}%`, color: 'text-red-600' },
} as const;
