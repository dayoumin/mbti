// 케미 테스트 상수 정의
// 생성일: 2025-12-11

// 레벨 타입
export type Level = 'high' | 'medium' | 'low';

export const CHEMI_CONSTANTS = {
    // 점수 관련
    MAX_SCORE_PER_QUESTION: 5,
    MIN_SCORE_PER_QUESTION: 1,
    DEFAULT_QUESTION_COUNT: 5,

    // 레벨 판정 기준 (백분율)
    LEVEL_THRESHOLDS: {
        HIGH: 60,    // 60% 이상 = high
        LOW: 40      // 40% 이하 = low, 그 사이 = medium
    },

    // 레벨 값
    LEVELS: {
        HIGH: 'high',
        MEDIUM: 'medium',
        LOW: 'low'
    }
};
