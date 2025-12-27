/**
 * localStorage 래퍼 유틸리티
 *
 * - 에러 처리 자동화
 * - 타입 안전성
 * - JSON parse/stringify 자동화
 * - SSR 환경 대응 (window undefined 체크)
 */

export const storage = {
  /**
   * localStorage에서 값 가져오기
   * @param key 저장 키
   * @param defaultValue 기본값 (파싱 실패 시 반환)
   * @returns 저장된 값 또는 기본값
   *
   * @example
   * const user = storage.get('user', { name: 'Guest' });
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`[Storage] Failed to get ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * localStorage에 값 저장
   * @param key 저장 키
   * @param value 저장할 값 (JSON 직렬화 가능한 값)
   *
   * @example
   * storage.set('user', { name: 'John' });
   */
  set(key: string, value: unknown): void {
    if (typeof window === 'undefined') return;

    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
    } catch (error) {
      // QuotaExceededError 명시적 처리
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.error(`[Storage] 저장 공간 부족. "${key}" 저장 실패.`);
        console.warn('[Storage] localStorage 용량이 가득 찼습니다. 오래된 데이터를 정리해주세요.');

        // 선택: 자동 정리 로직 (주석 처리됨 - 필요시 활성화)
        // this.clearOldData();
      } else if (error instanceof TypeError && error.message.includes('circular')) {
        // 순환 참조 감지
        console.error(`[Storage] 순환 참조 객체는 저장할 수 없습니다: "${key}"`);
      } else {
        console.error(`[Storage] Failed to set ${key}:`, error);
      }
    }
  },

  /**
   * localStorage에서 값 제거
   * @param key 제거할 키
   *
   * @example
   * storage.remove('user');
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Failed to remove ${key}:`, error);
    }
  },

  /**
   * localStorage 전체 초기화
   *
   * @example
   * storage.clear();
   */
  clear(): void {
    if (typeof window === 'undefined') return;

    try {
      localStorage.clear();
    } catch (error) {
      console.error('[Storage] Failed to clear:', error);
    }
  },

  /**
   * 특정 키가 존재하는지 확인
   * @param key 확인할 키
   * @returns 존재 여부
   *
   * @example
   * if (storage.has('user')) { ... }
   */
  has(key: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }
};