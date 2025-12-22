/**
 * AnalyticsService - 사용자 행동 이벤트 추적 서비스
 *
 * 현재: Turso에 저장 (미설정 시 localStorage 폴백)
 * 용도: 추천 클릭률, 전환율 분석
 */

import { resultService } from './ResultService';
import type { NextActionType, ActionPriority } from './NextActionService';
import { getUTMForAnalytics } from '@/utils';
import { STORAGE_KEYS } from '@/lib/storage';

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
  | 'share_click'           // 공유 클릭
  | 'page_view'             // 페이지 조회 (유입)
  | 'session_start';        // 세션 시작 (UTM 포함 첫 방문)

export type EventCategory = 'next_action' | 'content' | 'test' | 'community' | 'share' | 'acquisition';

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

// ========== 전환 분석 타입 ==========

interface FunnelStep {
  eventType: EventType;
  timestamp: string;
  deviceId: string;
  testType?: string;
}

export interface SourceConversionMetrics {
  source: string;
  sessions: number;
  testStarts: number;
  testCompletes: number;
  shares: number;
  startRate: number;      // 세션 → 시작 %
  completeRate: number;   // 시작 → 완료 %
  shareRate: number;      // 완료 → 공유 %
  overallConversion: number; // 세션 → 완료 %
}

export interface FunnelAnalysis {
  total: Omit<SourceConversionMetrics, 'source'>;
  bySource: SourceConversionMetrics[];
  period: {
    start: string;
    end: string;
    eventCount: number;
  };
}

export interface TestConversionAnalysis {
  testType: string;
  starts: number;
  completes: number;
  shares: number;
  completionRate: number;
  shareRate: number;
}

export interface ViralMetrics {
  sharers: number;
  viralUsers: number;
  coefficient: number;
  interpretation: string;
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

const STORAGE_KEY = STORAGE_KEYS.ANALYTICS_EVENTS;
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

    // UTM 데이터 가져오기 (유입 경로 추적)
    const utmData = getUTMForAnalytics();

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
        ...utmData, // UTM 파라미터 포함
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

  /**
   * 페이지 조회 추적 (유입 측정)
   */
  trackPageView(page: string): void {
    this.track({
      eventType: 'page_view',
      eventCategory: 'acquisition',
      meta: { page, url: window.location.href },
    });
  }

  /**
   * 세션 시작 추적 (UTM 유입 시)
   */
  trackSessionStart(): void {
    // 이미 이 세션에서 추적했는지 확인
    // sessionStorage는 탭 단위라 STORAGE_KEYS 사용 안 함
    const sessionKey = 'chemi_session_tracked';
    if (sessionStorage.getItem(sessionKey)) return;

    sessionStorage.setItem(sessionKey, 'true');

    this.track({
      eventType: 'session_start',
      eventCategory: 'acquisition',
      meta: {
        landing_page: window.location.pathname,
        referrer: document.referrer || 'direct',
      },
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

  // ========== 전환 분석 (로컬 데이터 기반) ==========

  /**
   * 퍼널 분석: 유입 → 테스트 시작 → 테스트 완료
   */
  getFunnelAnalysis(): FunnelAnalysis {
    const events = this.getLocalEvents();

    // UTM 소스별 그룹핑
    const bySource: Record<string, FunnelStep[]> = {};

    events.forEach(event => {
      const source = (event.meta?.utm_source as string) || 'direct';
      if (!bySource[source]) {
        bySource[source] = [];
      }
      bySource[source].push({
        eventType: event.event_type,
        timestamp: event.created_at,
        deviceId: event.device_id,
        testType: event.target_category || undefined,
      });
    });

    // 각 소스별 전환율 계산
    const sourceMetrics: SourceConversionMetrics[] = Object.entries(bySource).map(([source, steps]) => {
      const uniqueDevices = new Set(steps.map(s => s.deviceId));
      const sessions = uniqueDevices.size;

      const startedDevices = new Set(
        steps.filter(s => s.eventType === 'test_start').map(s => s.deviceId)
      );
      const completedDevices = new Set(
        steps.filter(s => s.eventType === 'test_complete').map(s => s.deviceId)
      );
      const sharedDevices = new Set(
        steps.filter(s => s.eventType === 'share_click').map(s => s.deviceId)
      );

      return {
        source,
        sessions,
        testStarts: startedDevices.size,
        testCompletes: completedDevices.size,
        shares: sharedDevices.size,
        startRate: sessions > 0 ? (startedDevices.size / sessions) * 100 : 0,
        completeRate: startedDevices.size > 0 ? (completedDevices.size / startedDevices.size) * 100 : 0,
        shareRate: completedDevices.size > 0 ? (sharedDevices.size / completedDevices.size) * 100 : 0,
        overallConversion: sessions > 0 ? (completedDevices.size / sessions) * 100 : 0,
      };
    });

    // 전체 통계
    const totalSessions = sourceMetrics.reduce((sum, m) => sum + m.sessions, 0);
    const totalStarts = sourceMetrics.reduce((sum, m) => sum + m.testStarts, 0);
    const totalCompletes = sourceMetrics.reduce((sum, m) => sum + m.testCompletes, 0);
    const totalShares = sourceMetrics.reduce((sum, m) => sum + m.shares, 0);

    return {
      total: {
        sessions: totalSessions,
        testStarts: totalStarts,
        testCompletes: totalCompletes,
        shares: totalShares,
        startRate: totalSessions > 0 ? (totalStarts / totalSessions) * 100 : 0,
        completeRate: totalStarts > 0 ? (totalCompletes / totalStarts) * 100 : 0,
        shareRate: totalCompletes > 0 ? (totalShares / totalCompletes) * 100 : 0,
        overallConversion: totalSessions > 0 ? (totalCompletes / totalSessions) * 100 : 0,
      },
      bySource: sourceMetrics.sort((a, b) => b.sessions - a.sessions),
      period: {
        start: events.length > 0 ? events[0].created_at : new Date().toISOString(),
        end: events.length > 0 ? events[events.length - 1].created_at : new Date().toISOString(),
        eventCount: events.length,
      },
    };
  }

  /**
   * 테스트별 전환율 분석
   */
  getTestConversionAnalysis(): TestConversionAnalysis[] {
    const events = this.getLocalEvents();
    const byTest: Record<string, { starts: Set<string>; completes: Set<string>; shares: Set<string> }> = {};

    events.forEach(event => {
      const testType = event.target_category;
      if (!testType) return;

      if (!byTest[testType]) {
        byTest[testType] = { starts: new Set(), completes: new Set(), shares: new Set() };
      }

      if (event.event_type === 'test_start') {
        byTest[testType].starts.add(event.device_id);
      } else if (event.event_type === 'test_complete') {
        byTest[testType].completes.add(event.device_id);
      } else if (event.event_type === 'share_click') {
        byTest[testType].shares.add(event.device_id);
      }
    });

    return Object.entries(byTest).map(([testType, data]) => ({
      testType,
      starts: data.starts.size,
      completes: data.completes.size,
      shares: data.shares.size,
      completionRate: data.starts.size > 0 ? (data.completes.size / data.starts.size) * 100 : 0,
      shareRate: data.completes.size > 0 ? (data.shares.size / data.completes.size) * 100 : 0,
    })).sort((a, b) => b.starts - a.starts);
  }

  /**
   * 바이럴 계수 추정 (공유 → 신규 유입)
   */
  getViralCoefficient(): ViralMetrics {
    const events = this.getLocalEvents();

    // 공유한 사용자 수
    const sharers = new Set(
      events.filter(e => e.event_type === 'share_click').map(e => e.device_id)
    );

    // 공유 링크로 유입된 사용자 (utm_medium=social 또는 share)
    const viralUsers = new Set(
      events
        .filter(e => {
          const medium = e.meta?.utm_medium as string;
          return e.event_type === 'session_start' && (medium === 'social' || medium === 'share');
        })
        .map(e => e.device_id)
    );

    // 바이럴 계수 = 공유로 유입된 유저 / 공유한 유저
    const coefficient = sharers.size > 0 ? viralUsers.size / sharers.size : 0;

    return {
      sharers: sharers.size,
      viralUsers: viralUsers.size,
      coefficient,
      interpretation: coefficient >= 1
        ? '바이럴 성장 중!'
        : coefficient >= 0.5
          ? '준수한 바이럴'
          : '개선 필요',
    };
  }
}

// 싱글톤 인스턴스
export const analyticsService = new AnalyticsServiceClass();

export default analyticsService;
