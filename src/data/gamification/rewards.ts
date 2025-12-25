// ============================================================================
// 보상 설정 (단일 소스)
// ============================================================================
// 활동별 XP + 인사이트 포인트를 중앙에서 관리
// points.ts의 POINTS와 동기화되어야 함

import { POINTS } from './points';
import type { ActivityType, ActivityReward } from '@/types/events';

// ============================================================================
// 활동별 보상 정의
// ============================================================================

export const ACTIVITY_REWARDS: Record<ActivityType, ActivityReward> = {
  // 테스트
  test_complete: {
    xp: POINTS.TEST_COMPLETE,
    insightPoints: 3,
  },

  // 퀴즈
  quiz_solve: {
    xp: POINTS.QUIZ_CORRECT,  // 정답 기준, 오답은 별도 처리
    insightPoints: 1,
  },

  // 투표
  poll_vote: {
    xp: POINTS.POLL_VOTE,
    insightPoints: 1,
  },

  // Q&A
  qa_answer: {
    xp: POINTS.ANSWER_WRITE,
    insightPoints: 2,
  },
  qa_adopted: {
    xp: POINTS.ANSWER_ADOPTED,
    insightPoints: 5,
  },

  // 게시글/댓글
  post_write: {
    xp: POINTS.POST_WRITE,
    insightPoints: 1,
  },
  comment_write: {
    xp: POINTS.COMMENT_WRITE,
    insightPoints: 0,  // 댓글은 인사이트 포인트 없음
  },

  // 좋아요
  like_give: {
    xp: 0,  // 좋아요 주기는 XP 없음
    insightPoints: 0,
  },
  like_receive: {
    xp: POINTS.LIKE_RECEIVED,
    insightPoints: 0,
  },

  // 방문
  daily_visit: {
    xp: POINTS.DAILY_VISIT,
    insightPoints: 0,
  },

  // 대결
  duel_complete: {
    xp: POINTS.DUEL_WIN,  // 승리 기준, 패배는 별도 처리
    insightPoints: 2,
  },
} as const;

// ============================================================================
// 특수 보상 (조건에 따라 다른 보상)
// ============================================================================

export const SPECIAL_REWARDS = {
  /** 퀴즈 오답 시 보상 */
  QUIZ_WRONG: {
    xp: POINTS.QUIZ_WRONG,
    insightPoints: 1,  // 오답도 인사이트 포인트는 동일
  },

  /** 대결 패배 시 보상 */
  DUEL_LOSE: {
    xp: POINTS.DUEL_LOSE,
    insightPoints: 1,  // 패배도 참여 보상
  },
} as const;

// ============================================================================
// 카테고리별 가중치 (인사이트 집계용)
// ============================================================================

export const CATEGORY_WEIGHTS: Record<string, number> = {
  // 관계 카테고리는 Stage 5 해금에 가중치
  relationship: 1.5,
  idealType: 1.5,
  conflictStyle: 1.5,

  // 성격 테스트 가중치
  human: 1.2,
  personality: 1.2,

  // 기본 가중치
  default: 1.0,
} as const;

// ============================================================================
// 헬퍼 함수
// ============================================================================

/**
 * 활동 타입과 결과에 따른 보상 계산
 */
export function getReward(
  activityType: ActivityType,
  options?: {
    result?: 'correct' | 'wrong';
    won?: boolean;
  }
): ActivityReward {
  // 퀴즈 오답
  if (activityType === 'quiz_solve' && options?.result === 'wrong') {
    return SPECIAL_REWARDS.QUIZ_WRONG;
  }

  // 대결 패배
  if (activityType === 'duel_complete' && options?.won === false) {
    return SPECIAL_REWARDS.DUEL_LOSE;
  }

  return ACTIVITY_REWARDS[activityType];
}

/**
 * 카테고리 가중치 조회
 */
export function getCategoryWeight(category: string): number {
  return CATEGORY_WEIGHTS[category] ?? CATEGORY_WEIGHTS.default;
}

/**
 * 인사이트 포인트에 카테고리 가중치 적용
 */
export function getWeightedInsightPoints(
  basePoints: number,
  category: string
): number {
  const weight = getCategoryWeight(category);
  return Math.round(basePoints * weight);
}
