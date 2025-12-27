'use client';

/**
 * Web Vitals 측정 컴포넌트
 *
 * 클라이언트 사이드에서 Web Vitals를 측정하고 GA4로 전송
 * layout.tsx에서 마운트하여 사용
 */

import { useEffect } from 'react';
import { reportWebVitals } from '@/lib/web-vitals';

export default function WebVitalsReporter() {
  useEffect(() => {
    // Web Vitals 측정 시작
    reportWebVitals();
  }, []);

  return null; // UI 없음 (측정만 수행)
}
