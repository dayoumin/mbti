// ============================================================================
// EventBus - 이벤트 발행/구독 시스템
// ============================================================================
// 컴포넌트 → UserActivityService → EventBus → 구독자들
//
// 구독자:
// - GamificationService: XP, 배지, 레벨 처리
// - InsightService: 태그 집계, 해금 체크 (예정)
// - AnalyticsService: 이벤트 로깅 (예정)

import type {
  UserActivityEvent,
  ActivityType,
  EventHandler,
  Unsubscribe,
  IEventBus,
} from '@/types/events';

// ============================================================================
// EventBus 클래스
// ============================================================================

class EventBusService implements IEventBus {
  private handlers: Set<EventHandler> = new Set();
  private activityHandlers: Map<ActivityType, Set<EventHandler>> = new Map();
  private processedKeys: Set<string> = new Set();

  // 멱등성 키 유지 시간 (5분)
  private readonly IDEMPOTENCY_TTL = 5 * 60 * 1000;

  constructor() {
    // 주기적으로 오래된 멱등성 키 정리
    if (typeof window !== 'undefined') {
      setInterval(() => this.cleanupIdempotencyKeys(), this.IDEMPOTENCY_TTL);
    }
  }

  /**
   * 이벤트 발행
   * - 멱등성 체크 후 모든 구독자에게 전달
   */
  async publish(event: UserActivityEvent): Promise<void> {
    // 멱등성 체크 - 이미 처리된 이벤트면 무시
    if (this.processedKeys.has(event.idempotencyKey)) {
      console.log(`[EventBus] Duplicate event ignored: ${event.idempotencyKey}`);
      return;
    }

    // 멱등성 키 저장 (타임스탬프와 함께)
    this.processedKeys.add(event.idempotencyKey);

    console.log(`[EventBus] Publishing event: ${event.activityType}`, {
      id: event.id,
      contentId: event.payload.contentId,
    });

    // 전체 구독자에게 발행
    const promises: Promise<void>[] = [];

    for (const handler of this.handlers) {
      promises.push(this.safeInvoke(handler, event));
    }

    // 특정 활동 타입 구독자에게 발행
    const activityHandlers = this.activityHandlers.get(event.activityType);
    if (activityHandlers) {
      for (const handler of activityHandlers) {
        promises.push(this.safeInvoke(handler, event));
      }
    }

    // 모든 핸들러 실행 완료 대기
    await Promise.all(promises);
  }

  /**
   * 모든 이벤트 구독
   */
  subscribe(handler: EventHandler): Unsubscribe {
    this.handlers.add(handler);

    return () => {
      this.handlers.delete(handler);
    };
  }

  /**
   * 특정 활동 타입만 구독
   */
  subscribeToActivity(activityType: ActivityType, handler: EventHandler): Unsubscribe {
    if (!this.activityHandlers.has(activityType)) {
      this.activityHandlers.set(activityType, new Set());
    }

    this.activityHandlers.get(activityType)!.add(handler);

    return () => {
      this.activityHandlers.get(activityType)?.delete(handler);
    };
  }

  /**
   * 안전한 핸들러 실행 (에러 격리)
   */
  private async safeInvoke(handler: EventHandler, event: UserActivityEvent): Promise<void> {
    try {
      await handler(event);
    } catch (error) {
      console.error('[EventBus] Handler error:', error);
      // 개별 핸들러 에러가 다른 핸들러에 영향 주지 않음
    }
  }

  /**
   * 오래된 멱등성 키 정리
   */
  private cleanupIdempotencyKeys(): void {
    // 간단한 구현: 5분 후 전체 클리어
    // 실제로는 타임스탬프 기반으로 정리해야 함
    if (this.processedKeys.size > 1000) {
      console.log('[EventBus] Cleaning up idempotency keys');
      this.processedKeys.clear();
    }
  }

  /**
   * 모든 구독 해제 (테스트용)
   */
  reset(): void {
    this.handlers.clear();
    this.activityHandlers.clear();
    this.processedKeys.clear();
  }
}

// ============================================================================
// 싱글톤 인스턴스
// ============================================================================

export const eventBus = new EventBusService();

// ============================================================================
// 타입 export
// ============================================================================

export type { IEventBus };
