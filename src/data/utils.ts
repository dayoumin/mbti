// 케미테스트 유틸리티 함수
// 생성일 2025-12-11

import { LEVEL_THRESHOLDS, LEVELS, SCORING, type Level } from '@/config';
import type { Dimension, ResultLabel } from './types';

export function getScoreLevel(score: number, maxScore: number): Level {
  const percentage = (score / maxScore) * 100;
  if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH as Level;
  if (percentage <= LEVEL_THRESHOLDS.LOW) return LEVELS.LOW as Level;
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

  // 부분 매칭 (가장 많이 일치)
  let bestMatch = resultLabels[resultLabels.length - 1];
  let bestScore = 0;
  for (const result of resultLabels) {
    const condition = result.condition || {};
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
