// 케미 테스트 유틸리티 함수

import { CHEMI_CONSTANTS, Level } from './constants';
import { Dimension, ResultLabel } from './types';

// 점수 레벨 판정 함수
export function getScoreLevel(score: number, maxScore: number): Level {
  const { LEVEL_THRESHOLDS, LEVELS } = CHEMI_CONSTANTS;
  const percentage = (score / maxScore) * 100;
  if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH;
  if (percentage <= LEVEL_THRESHOLDS.LOW) return LEVELS.LOW;
  return LEVELS.MEDIUM;
}

// 결과 라벨 매칭 함수
export function matchResultLabel(
  scores: Record<string, number>,
  dimensions: Record<string, Dimension>,
  resultLabels: ResultLabel[],
  dimCounts: Record<string, number>
): ResultLabel {
  const { MAX_SCORE_PER_QUESTION, DEFAULT_QUESTION_COUNT } = CHEMI_CONSTANTS;

  const levels: Record<string, Level> = {};
  Object.keys(dimensions).forEach(dim => {
    const questionCount = dimCounts[dim] || DEFAULT_QUESTION_COUNT;
    const maxScore = questionCount * MAX_SCORE_PER_QUESTION;
    levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
  });

  // 완전 일치 찾기 (조건이 더 많은 것 우선)
  let bestExactMatch: ResultLabel | null = null;
  let bestExactConditionCount = 0;

  for (const result of resultLabels) {
    const condition = result.condition;
    const conditionKeys = Object.keys(condition);

    // 조건이 없으면 완전 매칭 대상에서 제외
    if (conditionKeys.length === 0) continue;

    let match = true;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] !== level) {
        match = false;
        break;
      }
    }

    // 완전 일치 + 조건이 더 많으면 우선 선택
    if (match && conditionKeys.length > bestExactConditionCount) {
      bestExactMatch = result;
      bestExactConditionCount = conditionKeys.length;
    }
  }

  if (bestExactMatch) return bestExactMatch;

  // 부분 매칭 (가장 많이 일치하는 결과)
  let bestMatch = resultLabels[resultLabels.length - 1];
  let bestScore = 0;
  for (const result of resultLabels) {
    const condition = result.condition;
    let matchCount = 0;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] === level) matchCount++;
    }
    if (matchCount > bestScore) {
      bestScore = matchCount;
      bestMatch = result;
    }
  }
  return bestMatch;
}
