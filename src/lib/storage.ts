/**
 * localStorage 키 및 헬퍼 함수 중앙화
 *
 * 모든 localStorage 키를 한 곳에서 관리하여:
 * - 키 충돌 방지
 * - 오타 방지
 * - 일관된 접두사 사용
 */

// ============================================================================
// Storage Keys
// ============================================================================

export const STORAGE_KEYS = {
  // 테스트 결과
  TEST_RESULTS: 'chemi_test_results',

  // 랭킹
  RANKING_VOTES: 'chemi_ranking_votes',
  RANKING_STATS: 'chemi_ranking_stats',

  // 게이미피케이션
  GAME_STATS: 'chemi_game_stats',

  // 케어 (반려동물)
  CARE_PROFILES: 'chemi_care_profiles',
  CARE_SCHEDULES: 'chemi_care_schedules',
  CARE_LOGS: 'chemi_care_logs',

  // 케어 (식물)
  PLANT_PROFILES: 'chemi_plant_profiles',
  PLANT_SCHEDULES: 'chemi_plant_schedules',
  PLANT_LOGS: 'chemi_plant_logs',

  // 인증/사용자
  AUTH_USER: 'chemi_auth_user',
  MERGED_DEVICE_IDS: 'chemi_merged_device_ids',
  DEMOGRAPHIC: 'chemi_demographic',
  DEVICE_ID: 'chemi_user',

  // 콘텐츠 참여
  CONTENT_PARTICIPATION: 'chemi_content_participation',

  // 분석
  ANALYTICS_EVENTS: 'chemi_analytics_events',
  SESSION_TRACKED: 'chemi_session_tracked',

  // 친구
  FRIENDS: 'chemi_friends',
  INVITE_CODES: 'chemi_invite_codes',
  PENDING_INVITES: 'chemi_pending_invites',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

// ============================================================================
// LocalStorage Helper
// ============================================================================

/**
 * localStorage 안전 접근 헬퍼
 *
 * 사용법:
 * const data = LocalStorage.get(STORAGE_KEYS.GAME_STATS, defaultValue);
 * LocalStorage.set(STORAGE_KEYS.GAME_STATS, newData);
 */
export const LocalStorage = {
  /**
   * localStorage에서 데이터 조회
   * SSR 환경 및 파싱 에러 안전 처리
   */
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`[LocalStorage] Failed to get ${key}:`, error);
      return defaultValue;
    }
  },

  /**
   * localStorage에 데이터 저장
   * SSR 환경 및 저장 에러 안전 처리
   */
  set(key: string, value: unknown): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`[LocalStorage] Failed to set ${key}:`, error);
      return false;
    }
  },

  /**
   * localStorage에서 데이터 삭제
   */
  remove(key: string): boolean {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`[LocalStorage] Failed to remove ${key}:`, error);
      return false;
    }
  },

  /**
   * 여러 키 한번에 삭제
   */
  removeMany(keys: string[]): boolean {
    return keys.every(key => this.remove(key));
  },

  /**
   * 특정 접두사로 시작하는 모든 키 삭제
   */
  clearByPrefix(prefix: string): number {
    if (typeof window === 'undefined') return 0;
    let count = 0;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(prefix)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        count++;
      });
    } catch (error) {
      console.error(`[LocalStorage] Failed to clear by prefix ${prefix}:`, error);
    }
    return count;
  },

  /**
   * 모든 chemi_ 접두사 데이터 삭제 (로그아웃 등)
   */
  clearAll(): number {
    return this.clearByPrefix('chemi_');
  },
};

// ============================================================================
// 마이그레이션 유틸
// ============================================================================

/**
 * 레거시 키를 새 키로 마이그레이션
 * 이미 새 키에 데이터가 있으면 건너뜀
 */
export function migrateStorageKey(oldKey: string, newKey: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const oldData = localStorage.getItem(oldKey);
    const newData = localStorage.getItem(newKey);

    // 새 키에 이미 데이터가 있으면 건너뜀
    if (newData) return false;

    // 레거시 데이터가 있으면 새 키로 복사
    if (oldData) {
      localStorage.setItem(newKey, oldData);
      // 레거시 키는 유지 (안전을 위해)
      return true;
    }
    return false;
  } catch (error) {
    console.error(`[LocalStorage] Migration failed ${oldKey} → ${newKey}:`, error);
    return false;
  }
}
