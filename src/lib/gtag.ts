/**
 * Google Analytics 4 (GA4) 설정 및 이벤트 추적
 *
 * @see https://developers.google.com/analytics/devguides/collection/ga4
 */

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// gtag 타입 정의
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event',
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

export interface GtagEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

/**
 * 페이지뷰 추적
 * @param url - 페이지 URL
 *
 * @example
 * pageview('/test/dog');
 */
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    });
  }
};

/**
 * 커스텀 이벤트 추적
 * @param event - 이벤트 정보
 *
 * @example
 * event({
 *   action: 'test_start',
 *   category: 'engagement',
 *   label: 'dog',
 * });
 */
export const event = ({ action, category, label, value }: GtagEvent) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};
