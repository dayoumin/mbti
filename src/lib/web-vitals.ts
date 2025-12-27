/**
 * Web Vitals 성능 측정 및 GA4 전송
 *
 * Core Web Vitals:
 * - LCP (Largest Contentful Paint) - 목표: < 2.5s
 * - INP (Interaction to Next Paint) - 목표: < 200ms (FID 대체)
 * - CLS (Cumulative Layout Shift) - 목표: < 0.1
 *
 * Additional Metrics:
 * - FCP (First Contentful Paint) - 목표: < 1.8s
 * - TTFB (Time to First Byte) - 목표: < 600ms
 *
 * @see https://web.dev/vitals/
 * @see https://web.dev/inp/ (INP가 FID를 대체)
 */

import { onLCP, onINP, onCLS, onFCP, onTTFB } from 'web-vitals';
import * as gtag from './gtag';

/**
 * Web Vitals 측정 시작 및 GA4로 전송
 *
 * @example
 * // src/app/layout.tsx에서 호출
 * reportWebVitals();
 */
export function reportWebVitals() {
  // LCP: 가장 큰 콘텐츠가 렌더링되는 시간
  onLCP((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'LCP',
      value: Math.round(metric.value), // 밀리초
    });
  });

  // INP: 사용자 상호작용에 대한 페이지 반응성 (FID 대체)
  onINP((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'INP',
      value: Math.round(metric.value),
    });
  });

  // CLS: 페이지 수명 동안 발생하는 레이아웃 이동
  onCLS((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'CLS',
      value: Math.round(metric.value * 1000), // 소수점을 정수로 변환
    });
  });

  // FCP: 첫 번째 콘텐츠가 렌더링되는 시간
  onFCP((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'FCP',
      value: Math.round(metric.value),
    });
  });

  // TTFB: 서버 응답 시간
  onTTFB((metric) => {
    gtag.event({
      action: 'web_vitals',
      category: 'performance',
      label: 'TTFB',
      value: Math.round(metric.value),
    });
  });
}
