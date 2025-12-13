// 케미테스트 유틸리티 함수
// 생성일 2025-12-11

function getScoreLevel(score, maxScore) {
  const { LEVEL_THRESHOLDS, LEVELS } = window.CHEMI_CONSTANTS;
  const percentage = (score / maxScore) * 100;
  if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH;
  if (percentage <= LEVEL_THRESHOLDS.LOW) return LEVELS.LOW;
  return LEVELS.MEDIUM;
}

function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
  const { MAX_SCORE_PER_QUESTION, DEFAULT_QUESTION_COUNT } = window.CHEMI_CONSTANTS;

  const levels = {};
  Object.keys(dimensions).forEach(dim => {
    const questionCount = dimCounts[dim] || DEFAULT_QUESTION_COUNT;
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

window.getScoreLevel = getScoreLevel;
window.matchResultLabel = matchResultLabel;

