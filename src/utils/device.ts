/**
 * 디바이스/사용자 식별 유틸리티
 * - 익명 사용자 ID 관리
 */

const USER_KEY = 'chemi_user';

/**
 * 디바이스 ID 가져오기 (없으면 생성)
 * - 익명 사용자 식별용
 * - localStorage에 저장
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  let user = localStorage.getItem(USER_KEY);
  if (!user) {
    user = 'anon_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem(USER_KEY, user);
  }
  return user;
}

/**
 * 디바이스 ID 존재 여부 확인
 */
export function hasDeviceId(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(USER_KEY);
}

/**
 * USER_KEY 상수 export (기존 코드 호환)
 */
export { USER_KEY };
