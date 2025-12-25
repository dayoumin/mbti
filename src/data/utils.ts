// 케미테스트 유틸리티 함수
// 생성일 2025-12-11

import { LEVEL_THRESHOLDS, LEVELS, SCORING, type Level } from '@/config';
import type { Dimension, ResultLabel } from './types';

export function getScoreLevel(score: number, maxScore: number): Level {
  const percentage = (score / maxScore) * 100;
  if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH as Level;
  // 40% 미만만 LOW (40%는 MEDIUM에 포함 - 경계값 일관성)
  if (percentage < LEVEL_THRESHOLDS.LOW) return LEVELS.LOW as Level;
  return LEVELS.MEDIUM as Level;
}

export function matchResultLabel(
  scores: Record<string, number>,
  dimensions: Record<string, Dimension>,
  resultLabels: ResultLabel[],
  dimCounts?: Record<string, number>
): ResultLabel {
  const { MAX_SCORE_PER_QUESTION, DEFAULT_QUESTION_COUNT } = SCORING;

  const levels: Record<string, Level> = {};
  Object.keys(dimensions).forEach(dim => {
    const questionCount = dimCounts?.[dim] || DEFAULT_QUESTION_COUNT;
    const maxScore = questionCount * MAX_SCORE_PER_QUESTION;
    levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
  });

  // 완전 매칭: 조건이 더 구체적인(키가 많은) 결과 우선, 빈 조건은 제외
  let bestExactMatch = null;
  let bestExactConditionCount = 0;

  for (const result of resultLabels) {
    const condition = result.condition || {};
    const conditionKeys = Object.keys(condition);
    if (conditionKeys.length === 0) continue;

    let match = true;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] !== level) {
        match = false;
        break;
      }
    }

    if (match && conditionKeys.length > bestExactConditionCount) {
      bestExactMatch = result;
      bestExactConditionCount = conditionKeys.length;
    }
  }

  if (bestExactMatch) return bestExactMatch;

  // 부분 매칭: 1개 이상 일치하는 결과 중 가장 많이 일치하는 것 선택
  // 동점 시 조건 개수가 많은 것 우선 (더 구체적인 결과)
  let bestMatch = resultLabels[resultLabels.length - 1]; // 폴백
  let bestMatchCount = 0;
  let bestConditionCount = 0;

  for (const result of resultLabels) {
    const condition = result.condition || {};
    const conditionKeys = Object.keys(condition);
    if (conditionKeys.length === 0) continue;

    let matchCount = 0;
    for (const [dim, level] of Object.entries(condition)) {
      if (levels[dim] === level) matchCount++;
    }

    // 0개 매칭은 제외 - 아무것도 일치하지 않으면 폴백으로
    if (matchCount === 0) continue;

    // 일치 개수가 더 많거나, 동점이면 조건 개수가 더 많은 것 선택
    if (matchCount > bestMatchCount ||
        (matchCount === bestMatchCount && conditionKeys.length > bestConditionCount)) {
      bestMatchCount = matchCount;
      bestConditionCount = conditionKeys.length;
      bestMatch = result;
    }
  }

  return bestMatch;
}
