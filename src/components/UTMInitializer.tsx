'use client';

import { useEffect } from 'react';
import { parseAndStoreUTM, storeReferrer } from '@/utils';

/**
 * UTM 및 리퍼러 초기화 컴포넌트
 * - 앱 로드 시 URL의 UTM 파라미터를 파싱하여 저장
 * - 리퍼러 정보 저장
 * - Layout에서 한 번만 실행됨
 */
export default function UTMInitializer() {
  useEffect(() => {
    // UTM 파라미터 파싱 및 저장
    parseAndStoreUTM();

    // 리퍼러 저장
    storeReferrer();
  }, []);

  // 렌더링 없음
  return null;
}
