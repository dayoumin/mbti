// ============================================================================
// UserActivityService - 사용자 활동 이벤트 처리
// ============================================================================
// 역할:
// 1. 이벤트 정규화 (다양한 입력 → 표준 이벤트 형식)
// 2. 멱등성 키 생성 (중복 방지)
// 3. EventBus로 발행
//
// 사용 예:
//   userActivityService.trackTestComplete('human', 'result-name', { dim1: 80 });
//   userActivityService.trackQuizSolve('cat-k-001', true);
//   userActivityService.trackPollVote('vs-cat-001', 'option-a');

import { eventBus } from './EventBus';
import { getDeviceId } from '@/utils/device';
import type {
  UserActivityEvent,
  ActivityType,
  ActivityPayload,
  CreateEventInput,
  ContentType,
} from '@/types/events';

// ============================================================================
// UUID 생성 (간단한 구현)
// ============================================================================

function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // 폴백: 간단한 UUID v4 생성
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// ============================================================================
// 세션 ID 관리
// ============================================================================

let currentSessionId: string | null = null;

function getSessionId(): string {
  if (!currentSessionId) {
    // 세션 스토리지에서 조회 또는 새로 생성
    if (typeof sessionStorage !== 'undefined') {
      currentSessionId = sessionStorage.getItem('chemi_session_id');
      if (!currentSessionId) {
        currentSessionId = generateUUID();
        sessionStorage.setItem('chemi_session_id', currentSessionId);
      }
    } else {
      currentSessionId = generateUUID();
    }
  }
  return currentSessionId;
}

// ============================================================================
// UserActivityService 클래스
// ============================================================================

class UserActivityServiceClass {
  /**
   * 멱등성 키 생성
   * 형식: {userId}:{activityType}:{contentId}:{분단위타임스탬프}
   */
  private generateIdempotencyKey(
    userId: string,
    activityType: ActivityType,
    contentId: string
  ): string {
    const minuteTimestamp = Math.floor(Date.now() / 60000);
    return `${userId}:${activityType}:${contentId}:${minuteTimestamp}`;
  }

  /**
   * 이벤트 생성
   */
  private createEvent(input: CreateEventInput): UserActivityEvent {
    const id = generateUUID();
    const idempotencyKey = this.generateIdempotencyKey(
      input.userId,
      input.activityType,
      input.payload.contentId
    );

    return {
      id,
      idempotencyKey,
      traceId: id, // 단순화: id와 동일하게 설정
      schemaVersion: '1.0',
      occurredAt: new Date().toISOString(),
      source: input.source ?? 'web',
      userId: input.userId,
      sessionId: input.sessionId,
      activityType: input.activityType,
      payload: input.payload,
    };
  }

  /**
   * 이벤트 발행
   */
  private async publish(input: CreateEventInput): Promise<void> {
    const event = this.createEvent(input);
    await eventBus.publish(event);
  }

  // ========================================================================
  // 공개 API - 활동별 트래킹 메서드
  // ========================================================================

  /**
   * 테스트 완료
   */
  async trackTestComplete(
    testId: string,
    resultName: string,
    dimensions: Record<string, number>,
    tags: string[] = []
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'test_complete',
      payload: {
        contentId: testId,
        contentType: 'test',
        category: testId, // 테스트 ID가 카테고리
        tags: [testId, ...tags],
        testResult: resultName,
        dimensions,
      },
    });
  }

  /**
   * 퀴즈 풀기
   */
  async trackQuizSolve(
    quizId: string,
    isCorrect: boolean,
    category: string,
    tags: string[] = []
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'quiz_solve',
      payload: {
        contentId: quizId,
        contentType: 'quiz',
        category,
        tags: [category, ...tags],
        result: isCorrect ? 'correct' : 'wrong',
        score: isCorrect ? 1 : 0,
      },
    });
  }

  /**
   * 투표 참여
   */
  async trackPollVote(
    pollId: string,
    selectedOption: string,
    category: string,
    tags: string[] = []
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'poll_vote',
      payload: {
        contentId: pollId,
        contentType: 'poll',
        category,
        tags: [category, selectedOption, ...tags],
      },
    });
  }

  /**
   * Q&A 답변 작성
   */
  async trackQAAnswer(
    questionId: string,
    answerId: string,
    category: string,
    tags: string[] = []
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'qa_answer',
      payload: {
        contentId: `${questionId}:${answerId}`,
        contentType: 'qa',
        category,
        tags: [category, ...tags],
      },
    });
  }

  /**
   * Q&A 답변 채택됨
   */
  async trackQAAdopted(
    answerId: string,
    category: string,
    tags: string[] = []
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'qa_adopted',
      payload: {
        contentId: answerId,
        contentType: 'qa',
        category,
        tags: [category, ...tags],
      },
    });
  }

  /**
   * 게시글 작성
   */
  async trackPostWrite(
    postId: string,
    category: string,
    tags: string[] = []
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'post_write',
      payload: {
        contentId: postId,
        contentType: 'post',
        category,
        tags: [category, ...tags],
      },
    });
  }

  /**
   * 댓글 작성
   */
  async trackCommentWrite(
    commentId: string,
    parentType: ContentType,
    parentId: string,
    category: string
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'comment_write',
      payload: {
        contentId: commentId,
        contentType: 'comment',
        category,
        tags: [category, parentType],
      },
    });
  }

  /**
   * 좋아요 (주기)
   */
  async trackLikeGive(
    targetType: ContentType,
    targetId: string,
    category: string
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'like_give',
      payload: {
        contentId: `${targetType}:${targetId}`,
        contentType: targetType,
        category,
        tags: [category],
      },
    });
  }

  /**
   * 좋아요 (받기) - 다른 사용자가 내 콘텐츠에 좋아요
   */
  async trackLikeReceive(
    targetType: ContentType,
    targetId: string,
    receiverUserId: string,
    category: string
  ): Promise<void> {
    const sessionId = getSessionId();

    await this.publish({
      userId: receiverUserId,
      sessionId,
      activityType: 'like_receive',
      payload: {
        contentId: `${targetType}:${targetId}`,
        contentType: targetType,
        category,
        tags: [category],
      },
    });
  }

  /**
   * 일일 방문
   */
  async trackDailyVisit(): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();
    const today = new Date().toISOString().split('T')[0];

    await this.publish({
      userId,
      sessionId,
      activityType: 'daily_visit',
      payload: {
        contentId: `visit:${today}`,
        contentType: 'post', // 방문은 별도 타입 없음
        category: 'visit',
        tags: ['daily_visit'],
      },
    });
  }

  /**
   * 대결 완료
   */
  async trackDuelComplete(
    duelId: string,
    won: boolean,
    score: number,
    category: string,
    tags: string[] = []
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType: 'duel_complete',
      payload: {
        contentId: duelId,
        contentType: 'duel',
        category,
        tags: [category, ...tags],
        won,
        score,
      },
    });
  }

  // ========================================================================
  // 통합 API
  // ========================================================================

  /**
   * 범용 활동 트래킹 (타입에 맞는 메서드가 없을 때)
   */
  async track(
    activityType: ActivityType,
    payload: ActivityPayload
  ): Promise<void> {
    const userId = getDeviceId();
    const sessionId = getSessionId();

    await this.publish({
      userId,
      sessionId,
      activityType,
      payload,
    });
  }
}

// ============================================================================
// 싱글톤 인스턴스
// ============================================================================

export const userActivityService = new UserActivityServiceClass();
