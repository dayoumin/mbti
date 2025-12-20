'use client';

import { useAuthMerge } from '@/hooks/useAuthMerge';

/**
 * 로그인 성공 시 익명 데이터 병합을 처리하는 컴포넌트
 * SessionProvider 내부에서 렌더링됨
 */
export function AuthMergeHandler() {
  useAuthMerge();
  return null;
}
