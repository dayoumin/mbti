/**
 * AuthService - 인증 관련 서비스
 *
 * 익명 → 로그인 계정 병합, 세션 관리 등
 */

import { getDeviceId, USER_KEY } from '@/utils/device';
import { STORAGE_KEYS, LocalStorage } from '@/lib/storage';

// ========== 타입 정의 ==========

interface MergeResult {
  success: boolean;
  mergedCount?: number;
  error?: string;
}

interface AuthUser {
  id: string;
  email?: string;
  name?: string;
  image?: string;
  provider?: string;
}

// ========== 상수 (레거시 호환 - STORAGE_KEYS 사용 권장) ==========

const AUTH_USER_KEY = STORAGE_KEYS.AUTH_USER;
const MERGED_DEVICE_IDS_KEY = STORAGE_KEYS.MERGED_DEVICE_IDS;

// ========== AuthService Class ==========

class AuthServiceClass {
  /**
   * 현재 익명 device_id 가져오기
   */
  getDeviceId(): string {
    return getDeviceId();
  }

  /**
   * 로그인한 사용자 정보 저장 (로컬)
   */
  setAuthUser(user: AuthUser | null): void {
    if (user) {
      LocalStorage.set(AUTH_USER_KEY, user);
    } else {
      LocalStorage.remove(AUTH_USER_KEY);
    }
  }

  /**
   * 저장된 로그인 사용자 정보 가져오기
   */
  getAuthUser(): AuthUser | null {
    return LocalStorage.get<AuthUser | null>(AUTH_USER_KEY, null);
  }

  /**
   * 익명 데이터 → 로그인 계정으로 병합
   *
   * 로그인 성공 후 호출하여 기존 device_id 데이터를 user_id로 연결
   */
  async mergeAnonymousToAuth(authUserId: string): Promise<MergeResult> {
    const deviceId = this.getDeviceId();

    // 이미 병합된 device_id인지 확인
    if (this.isAlreadyMerged(deviceId, authUserId)) {
      console.log('[AuthService] 이미 병합된 device_id:', deviceId);
      return { success: true, mergedCount: 0 };
    }

    try {
      // TODO: Supabase에서 device_id → user_id 매핑 업데이트
      // 현재는 로컬에서 병합 기록만 저장

      // 1. localStorage의 결과 데이터에 user_id 연결 (나중에 Supabase 연동 시)
      // await this.updateResultsUserId(deviceId, authUserId);

      // 2. 병합 기록 저장
      this.recordMerge(deviceId, authUserId);

      console.log('[AuthService] 익명 데이터 병합 완료:', { deviceId, authUserId });

      return { success: true, mergedCount: 1 };
    } catch (error) {
      console.error('[AuthService] 병합 실패:', error);
      return { success: false, error: (error as Error).message };
    }
  }

  /**
   * 병합 기록 저장
   */
  private recordMerge(deviceId: string, authUserId: string): void {
    const merged = LocalStorage.get<Record<string, string[]>>(MERGED_DEVICE_IDS_KEY, {});

    if (!merged[authUserId]) {
      merged[authUserId] = [];
    }

    if (!merged[authUserId].includes(deviceId)) {
      merged[authUserId].push(deviceId);
    }

    LocalStorage.set(MERGED_DEVICE_IDS_KEY, merged);
  }

  /**
   * 이미 병합된 device_id인지 확인
   */
  private isAlreadyMerged(deviceId: string, authUserId: string): boolean {
    const merged = LocalStorage.get<Record<string, string[]>>(MERGED_DEVICE_IDS_KEY, {});
    return merged[authUserId]?.includes(deviceId) || false;
  }

  /**
   * 특정 user_id에 연결된 모든 device_id 가져오기
   */
  getMergedDeviceIds(authUserId: string): string[] {
    const merged = LocalStorage.get<Record<string, string[]>>(MERGED_DEVICE_IDS_KEY, {});
    return merged[authUserId] || [];
  }

  /**
   * 로그인 상태 확인 (NextAuth 세션과 별개로 로컬 확인용)
   */
  isLoggedIn(): boolean {
    return this.getAuthUser() !== null;
  }

  /**
   * 로그아웃 처리 (로컬 정리)
   */
  logout(): void {
    this.setAuthUser(null);
    // device_id는 유지 (익명 사용 계속 가능)
  }

  /**
   * 계정 삭제 시 데이터 정리
   */
  async deleteAccount(authUserId: string): Promise<{ success: boolean }> {
    try {
      // TODO: Turso에서 user_id 관련 데이터 삭제

      // 로컬 정리
      this.setAuthUser(null);

      // 병합 기록에서 제거
      const merged = LocalStorage.get<Record<string, string[]>>(MERGED_DEVICE_IDS_KEY, {});
      delete merged[authUserId];
      LocalStorage.set(MERGED_DEVICE_IDS_KEY, merged);

      return { success: true };
    } catch (error) {
      console.error('[AuthService] 계정 삭제 실패:', error);
      return { success: false };
    }
  }
}

// 싱글톤 인스턴스
export const authService = new AuthServiceClass();

export default authService;
