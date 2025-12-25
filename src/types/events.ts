// ============================================================================
// 이벤트 타입 정의
// ============================================================================
// UserActivityService에서 발행하는 이벤트 스키마
// EventBus를 통해 GamificationService, InsightService, AnalyticsService가 구독

// ============================================================================
// 활동 타입 정의
// ============================================================================

export type ActivityType =
  | 'test_complete'       // 테스트 완료
  | 'quiz_solve'          // 퀴즈 풀기 (정답/오답)
  | 'poll_vote'           // 투표 참여
  | 'qa_answer'           // Q&A 답변 작성
  | 'qa_adopted'          // Q&A 답변 채택됨
  | 'post_write'          // 게시글 작성
  | 'comment_write'       // 댓글 작성
  | 'like_give'           // 좋아요 누름
  | 'like_receive'        // 좋아요 받음
  | 'daily_visit'         // 일일 방문
  | 'duel_complete';      // 대결 완료

export type ContentType = 'test' | 'quiz' | 'poll' | 'qa' | 'post' | 'comment' | 'duel';

// ============================================================================
// 활동 Payload
// ============================================================================

export interface ActivityPayload {
  /** 콘텐츠 고유 ID */
  contentId: string;

  /** 콘텐츠 타입 */
  contentType: ContentType;

  /** 카테고리 (cat, dog, relationship 등) */
  category: string;

  /** 인사이트용 태그 */
  tags: string[];

  // === 활동별 추가 정보 ===

  /** 퀴즈 결과 */
  result?: 'correct' | 'wrong';

  /** 점수 (퀴즈, 대결 등) */
  score?: number;

  /** 테스트 결과명 */
  testResult?: string;

  /** 차원별 점수 (테스트) */
  dimensions?: Record<string, number>;

  /** 대결 승리 여부 */
  won?: boolean;
}

// ============================================================================
// 사용자 활동 이벤트
// ============================================================================

export interface UserActivityEvent {
  // === 식별자 ===

  /** 이벤트 고유 ID (UUID v4) */
  id: string;

  /**
   * 멱등성 키
   * 중복 처리 방지용: userId + activityType + contentId + timestamp(분 단위)
   */
  idempotencyKey: string;

  /** 요청 추적용 ID */
  traceId: string;

  // === 메타 ===

  /** 스키마 버전 */
  schemaVersion: '1.0';

  /** 발생 시간 (ISO 8601) */
  occurredAt: string;

  /** 이벤트 소스 */
  source: 'web' | 'app';

  // === 주체 ===

  /** 사용자 ID (device ID 또는 로그인 ID) */
  userId: string;

  /** 세션 ID */
  sessionId: string;

  // === 활동 ===

  /** 활동 타입 */
  activityType: ActivityType;

  /** 활동 상세 정보 */
  payload: ActivityPayload;
}

// ============================================================================
// 이벤트 버스 타입
// ============================================================================

/** 이벤트 핸들러 타입 */
export type EventHandler<T = UserActivityEvent> = (event: T) => void | Promise<void>;

/** 구독 해제 함수 */
export type Unsubscribe = () => void;

/** 이벤트 버스 인터페이스 */
export interface IEventBus {
  /** 이벤트 발행 */
  publish(event: UserActivityEvent): Promise<void>;

  /** 이벤트 구독 */
  subscribe(handler: EventHandler): Unsubscribe;

  /** 특정 활동 타입만 구독 */
  subscribeToActivity(activityType: ActivityType, handler: EventHandler): Unsubscribe;
}

// ============================================================================
// 이벤트 생성 헬퍼 타입
// ============================================================================

/** 이벤트 생성 시 필수 정보 */
export interface CreateEventInput {
  userId: string;
  sessionId: string;
  activityType: ActivityType;
  payload: ActivityPayload;
  source?: 'web' | 'app';
}

// ============================================================================
// 보상 관련 타입
// ============================================================================

/** 활동별 보상 정의 */
export interface ActivityReward {
  /** 획득 XP */
  xp: number;

  /** 인사이트 포인트 (해금용) */
  insightPoints: number;
}

/** 보상 결과 */
export interface RewardResult {
  /** 획득 XP */
  xpEarned: number;

  /** 인사이트 포인트 */
  insightPointsEarned: number;

  /** 레벨업 발생 여부 */
  leveledUp: boolean;

  /** 새로 획득한 배지 ID 목록 */
  badgesEarned: string[];

  /** 스트릭 보너스 */
  streakBonus?: number;
}
