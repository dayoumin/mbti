/**
 * 디바이스/사용자 식별 유틸리티
 * - 익명 사용자 ID 생성/조회
 */

export const USER_KEY = 'chemi_user';

function generateAnonymousId(): string {
  const randomPart =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2, 11);

  return `anon_${Date.now()}_${randomPart}`;
}

/**
 * 디바이스 ID 가져오기 (없으면 생성)
 * - 익명 사용자 식별자
 * - localStorage에 저장
 */
export function getDeviceId(): string {
  if (typeof window === 'undefined') return 'server';

  try {
    const stored = localStorage.getItem(USER_KEY);
    if (stored) return stored;

    const created = generateAnonymousId();
    localStorage.setItem(USER_KEY, created);
    return created;
  } catch {
    return generateAnonymousId();
  }
}

/**
 * 디바이스 ID 존재 여부 확인
 */
export function hasDeviceId(): boolean {
  if (typeof window === 'undefined') return false;

  try {
    return !!localStorage.getItem(USER_KEY);
  } catch {
    return false;
  }
}
