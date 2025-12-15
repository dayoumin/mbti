/**
 * AnalyticsService - 사용자 행동 이벤트 추적 서비스
 *
 * 현재: Supabase에 저장 (미설정 시 localStorage 폴백)
 * 용도: 추천 클릭률, 전환율 분석
 */

import { resultService } from './ResultService';
import type { NextActionType, ActionPriority } from './NextActionService';

// ========== 타입 정의 ==========

export type EventType =
  | 'recommendation_view'    // 추천 카드 노출
  | 'recommendation_click'   // 추천 카드 클릭
  | 'test_start'            // 테스트 시작
  | 'test_complete'         // 테스트 완료
  | 'quiz_start'            // 퀴즈 시작
  | 'quiz_complete'         // 퀴즈 완료
  | 'poll_vote'             // 투표 참여
  | 'content_view'          // 콘텐츠 조회
  | 'share_click';          // 공유 클릭

export type EventCategory = 'next_action' | 'content' | 'test' | 'community' | 'share';

export type SourceEndpoint =
  | 'test_result'
  | 'quiz_result'
  | 'poll_result'
  | 'community_view'
  | 'ranking_view'
  | 'profile_view'
  | 'home';

export interface AnalyticsEvent {
  eventType: EventType;
  eventCategory?: EventCategory;
  sourceEndpoint?: SourceEndpoint;
  sourceId?: string;
  sourceCategory?: string;
  targetType?: NextActionType;
  targetId?: string;
  targetCategory?: string;
  recommendationPriority?: ActionPriority;
  recommendationPosition?: number;
  meta?: Record<string, unknown>;
}

interface EventData {
  device_id: string;
  event_type: EventType;
  event_category: EventCategory | null;
  source_endpoint: SourceEndpoint | null;
  source_id: string | null;
  source_category: string | null;
  target_type: string | null;
  target_id: string | null;
  target_category: string | null;
  recommendation_priority: string | null;
  recommendation_position: number | null;
  meta: Record<string, unknown>;
  created_at: string;
}

// ========== Supabase 클라이언트 ==========

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseClient: any = null;

async function getSupabaseClient() {
  if (supabaseClient) return supabaseClient;

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return null;
  }

  try {
    const moduleName = '@supabase/supabase-js';
    const { createClient } = await import(/* webpackIgnore: true */ moduleName);
    supabaseClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    return supabaseClient;
  } catch {
    return null;
  }
}

// ========== 로컬 스토리지 폴백 ==========

const STORAGE_KEY = 'chemi_analytics_events';
const MAX_LOCAL_EVENTS = 100; // 로컬에 최대 100개만 저장

function saveToLocalStorage(event: EventData): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as EventData[];
    existing.push(event);

    // 오래된 이벤트 정리
    if (existing.length > MAX_LOCAL_EVENTS) {
      existing.splice(0, existing.length - MAX_LOCAL_EVENTS);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('[AnalyticsService] localStorage 저장 실패:', error);
  }
}

// ========== Rate Limiting ==========

const RATE_LIMIT = {
  MAX_EVENTS_PER_MINUTE: 100,
  WINDOW_MS: 60000, // 1분
};

// ========== AnalyticsService Class ==========

class AnalyticsServiceClass {
  private queue: EventData[] = [];
  private isProcessing = false;
  private batchTimeout: ReturnType<typeof setTimeout> | null = null;

  // Rate limiting
  private eventCount = 0;
  private windowStart = Date.now();

  /**
   * Rate limit 체크
   */
  private checkRateLimit(): boolean {
    const now = Date.now();

    // 윈도우 리셋
    if (now - this.windowStart > RATE_LIMIT.WINDOW_MS) {
      this.eventCount = 0;
      this.windowStart = now;
    }

    // 한도 초과 체크
    if (this.eventCount >= RATE_LIMIT.MAX_EVENTS_PER_MINUTE) {
      console.warn('[AnalyticsService] Rate limit exceeded, event dropped');
      return false;
    }

    this.eventCount++;
    return true;
  }

  /**
   * 이벤트 추적
   */
  track(event: AnalyticsEvent): void {
    if (typeof window === 'undefined') return;

    // Rate limiting 체크
    if (!this.checkRateLimit()) return;

    const eventData: EventData = {
      device_id: resultService.getUserId(),
      event_type: event.eventType,
      event_category: event.eventCategory || null,
      source_endpoint: event.sourceEndpoint || null,
      source_id: event.sourceId || null,
      source_category: event.sourceCategory || null,
      target_type: event.targetType || null,
      target_id: event.targetId || null,
      target_category: event.targetCategory || null,
      recommendation_priority: event.recommendationPriority || null,
      recommendation_position: event.recommendationPosition ?? null,
      meta: {
        ...event.meta,
        screen_width: window.innerWidth,
        user_agent: navigator.userAgent,
        timestamp: Date.now(),
      },
      created_at: new Date().toISOString(),
    };

    this.queue.push(eventData);
    this.scheduleBatch();
  }

  /**
   * 추천 카드 노출 추적
   */
  trackRecommendationView(
    sourceEndpoint: SourceEndpoint,
    sourceCategory: string | undefined,
    targetType: NextActionType,
    targetCategory: string,
    priority: ActionPriority,
    position: number
  ): void {
    this.track({
      eventType: 'recommendation_view',
      eventCategory: 'next_action',
      sourceEndpoint,
      sourceCategory,
      targetType,
      targetCategory,
      recommendationPriority: priority,
      recommendationPosition: position,
    });
  }

  /**
   * 추천 카드 클릭 추적
   */
  trackRecommendationClick(
    sourceEndpoint: SourceEndpoint,
    sourceCategory: string | undefined,
    targetType: NextActionType,
    targetId: string,
    targetCategory: string,
    priority: ActionPriority,
    position: number
  ): void {
    this.track({
      eventType: 'recommendation_click',
      eventCategory: 'next_action',
      sourceEndpoint,
      sourceCategory,
      targetType,
      targetId,
      targetCategory,
      recommendationPriority: priority,
      recommendationPosition: position,
    });
  }

  /**
   * 테스트 시작 추적
   */
  trackTestStart(testType: string, source?: SourceEndpoint): void {
    this.track({
      eventType: 'test_start',
      eventCategory: 'test',
      sourceEndpoint: source,
      targetType: 'test',
      targetCategory: testType,
    });
  }

  /**
   * 테스트 완료 추적
   */
  trackTestComplete(testType: string, resultKey: string): void {
    this.track({
      eventType: 'test_complete',
      eventCategory: 'test',
      targetType: 'test',
      targetCategory: testType,
      targetId: resultKey,
    });
  }

  /**
   * 공유 클릭 추적
   */
  trackShareClick(contentType: string, contentId: string, shareType: string): void {
    this.track({
      eventType: 'share_click',
      eventCategory: 'share',
      targetType: 'test',
      targetCategory: contentType,
      targetId: contentId,
      meta: { shareType },
    });
  }

  // 배치 처리 스케줄링
  private scheduleBatch(): void {
    if (this.batchTimeout) return;

    this.batchTimeout = setTimeout(() => {
      this.batchTimeout = null;
      this.processBatch();
    }, 1000); // 1초 후 배치 처리
  }

  // 배치 처리
  private async processBatch(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) return;

    this.isProcessing = true;
    const batch = this.queue.splice(0, 10); // 최대 10개씩 처리

    const supabase = await getSupabaseClient();

    if (supabase) {
      try {
        const { error } = await supabase
          .from('mbti_analytics_events')
          .insert(batch);

        if (error) throw error;
      } catch (error) {
        console.error('[AnalyticsService] Supabase 저장 실패:', error);
        // 실패 시 로컬에 저장
        batch.forEach(saveToLocalStorage);
      }
    } else {
      // Supabase 미설정 - 로컬에만 저장
      batch.forEach(saveToLocalStorage);
    }

    this.isProcessing = false;

    // 큐에 남은 이벤트가 있으면 다시 처리
    if (this.queue.length > 0) {
      this.scheduleBatch();
    }
  }

  /**
   * 로컬 저장된 이벤트 조회 (개발용)
   */
  getLocalEvents(): EventData[] {
    if (typeof window === 'undefined') return [];

    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') as EventData[];
    } catch {
      return [];
    }
  }

  /**
   * 로컬 이벤트 삭제 (개발용)
   */
  clearLocalEvents(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  }
}

// 싱글톤 인스턴스
export const analyticsService = new AnalyticsServiceClass();

export default analyticsService;
