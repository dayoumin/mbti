/**
 * AuthService - 인증 관련 서비스
 *
 * 익명 → 로그인 계정 병합, 세션 관리 등
 */

import { getDeviceId, USER_KEY } from '@/utils/device';

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

// ========== 상수 ==========

const AUTH_USER_KEY = 'chemi_auth_user';
const MERGED_DEVICE_IDS_KEY = 'chemi_merged_device_ids';

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
    if (typeof window === 'undefined') return;

    if (user) {
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_USER_KEY);
    }
  }

  /**
   * 저장된 로그인 사용자 정보 가져오기
   */
  getAuthUser(): AuthUser | null {
    if (typeof window === 'undefined') return null;

    try {
      const stored = localStorage.getItem(AUTH_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
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
    if (typeof window === 'undefined') return;

    try {
      const stored = localStorage.getItem(MERGED_DEVICE_IDS_KEY);
      const merged: Record<string, string[]> = stored ? JSON.parse(stored) : {};

      if (!merged[authUserId]) {
        merged[authUserId] = [];
      }

      if (!merged[authUserId].includes(deviceId)) {
        merged[authUserId].push(deviceId);
      }

      localStorage.setItem(MERGED_DEVICE_IDS_KEY, JSON.stringify(merged));
    } catch (error) {
      console.error('[AuthService] 병합 기록 저장 실패:', error);
    }
  }

  /**
   * 이미 병합된 device_id인지 확인
   */
  private isAlreadyMerged(deviceId: string, authUserId: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const stored = localStorage.getItem(MERGED_DEVICE_IDS_KEY);
      if (!stored) return false;

      const merged: Record<string, string[]> = JSON.parse(stored);
      return merged[authUserId]?.includes(deviceId) || false;
    } catch {
      return false;
    }
  }

  /**
   * 특정 user_id에 연결된 모든 device_id 가져오기
   */
  getMergedDeviceIds(authUserId: string): string[] {
    if (typeof window === 'undefined') return [];

    try {
      const stored = localStorage.getItem(MERGED_DEVICE_IDS_KEY);
      if (!stored) return [];

      const merged: Record<string, string[]> = JSON.parse(stored);
      return merged[authUserId] || [];
    } catch {
      return [];
    }
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
      // TODO: Supabase에서 user_id 관련 데이터 삭제

      // 로컬 정리
      this.setAuthUser(null);

      // 병합 기록에서 제거
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem(MERGED_DEVICE_IDS_KEY);
        if (stored) {
          const merged: Record<string, string[]> = JSON.parse(stored);
          delete merged[authUserId];
          localStorage.setItem(MERGED_DEVICE_IDS_KEY, JSON.stringify(merged));
        }
      }

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
