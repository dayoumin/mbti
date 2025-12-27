/**
 * GA4 이벤트 추적 테스트
 *
 * window.gtag 함수가 올바른 파라미터로 호출되는지 검증
 * 환경: jsdom (window 객체 필요)
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { event, pageview, GA_MEASUREMENT_ID } from '@/lib/gtag';
import {
  trackTestStart,
  trackTestComplete,
  trackShare,
  trackQuizAnswer,
} from '@/lib/analytics';

describe('GA4 기본 기능', () => {
  beforeEach(() => {
    // window.gtag 모킹
    global.window.gtag = vi.fn();
  });

  it('gtag.event가 올바르게 동작', () => {
    event({
      action: 'test_action',
      category: 'test_category',
      label: 'test_label',
      value: 100,
    });

    expect(window.gtag).toHaveBeenCalledWith('event', 'test_action', {
      event_category: 'test_category',
      event_label: 'test_label',
      value: 100,
    });
  });

  it('gtag.pageview가 올바르게 동작', () => {
    pageview('/test/dog');

    expect(window.gtag).toHaveBeenCalledWith('config', GA_MEASUREMENT_ID, {
      page_path: '/test/dog',
    });
  });
});

describe('비즈니스 이벤트 추적', () => {
  beforeEach(() => {
    global.window.gtag = vi.fn();
  });

  it('trackTestStart - 테스트 시작 추적', () => {
    trackTestStart('dog');

    expect(window.gtag).toHaveBeenCalledWith('event', 'test_start', {
      event_category: 'engagement',
      event_label: 'dog',
      value: undefined,
    });
  });

  it('trackTestComplete - 밀리초를 초로 변환', () => {
    trackTestComplete('dog', 45000); // 45초

    expect(window.gtag).toHaveBeenCalledWith('event', 'test_complete', {
      event_category: 'engagement',
      event_label: 'dog',
      value: 45,
    });
  });

  it('trackQuizAnswer - 정답 여부를 value로 전달', () => {
    trackQuizAnswer('quiz_001', true);

    expect(window.gtag).toHaveBeenCalledWith('event', 'quiz_answer', {
      event_category: 'engagement',
      event_label: 'quiz_001',
      value: 1,
    });

    trackQuizAnswer('quiz_002', false);

    expect(window.gtag).toHaveBeenCalledWith('event', 'quiz_answer', {
      event_category: 'engagement',
      event_label: 'quiz_002',
      value: 0,
    });
  });

  it('trackShare - 플랫폼과 testType 조합', () => {
    trackShare('kakao', 'dog');

    expect(window.gtag).toHaveBeenCalledWith('event', 'share', {
      event_category: 'engagement',
      event_label: 'kakao_dog',
      value: undefined,
    });
  });
});

describe('SSR 안전성', () => {
  it('window 없으면 에러 없이 무시', () => {
    const originalWindow = global.window;
    (global as any).window = undefined;

    expect(() => {
      event({ action: 'test', category: 'test' });
      trackTestStart('dog');
    }).not.toThrow();

    (global as any).window = originalWindow;
  });

  it('window.gtag 없으면 에러 없이 무시', () => {
    delete (global.window as any).gtag;

    expect(() => {
      event({ action: 'test', category: 'test' });
      trackTestStart('dog');
    }).not.toThrow();
  });
});
