// 케미 테스트 유틸리티 함수
// 생성일: 2025-12-11

// 점수 레벨 판정 함수
function getScoreLevel(score, maxScore) {
    const { LEVEL_THRESHOLDS, LEVELS } = window.CHEMI_CONSTANTS;
    const percentage = (score / maxScore) * 100;
    if (percentage >= LEVEL_THRESHOLDS.HIGH) return LEVELS.HIGH;
    if (percentage <= LEVEL_THRESHOLDS.LOW) return LEVELS.LOW;
    return LEVELS.MEDIUM;
}

// 결과 라벨 매칭 함수
function matchResultLabel(scores, dimensions, resultLabels, dimCounts) {
    const { MAX_SCORE_PER_QUESTION, DEFAULT_QUESTION_COUNT } = window.CHEMI_CONSTANTS;

    const levels = {};
    Object.keys(dimensions).forEach(dim => {
        const questionCount = dimCounts[dim] || DEFAULT_QUESTION_COUNT;
        const maxScore = questionCount * MAX_SCORE_PER_QUESTION;
        levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
    });

    // 완전 일치 찾기
    for (const result of resultLabels) {
        const condition = result.condition;
        let match = true;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] !== level) {
                match = false;
                break;
            }
        }
        if (match) return result;
    }

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

window.getScoreLevel = getScoreLevel;
window.matchResultLabel = matchResultLabel;
