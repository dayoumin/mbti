'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { getDeviceId } from '@/utils/device';
import { authService } from '@/services/AuthService';

const RESULTS_KEY = 'chemi_test_results';
const MIGRATED_KEY = 'chemi_migrated_at'; // 마이그레이션 완료 시점 기록

/**
 * 로그인 성공 시 익명 데이터를 서버 API를 통해 병합하는 훅
 *
 * 동작:
 * 1. device_id 매핑 병합 (/api/auth/merge)
 * 2. localStorage 테스트 결과 → DB 마이그레이션 (/api/auth/migrate)
 *
 * 보안:
 * - 병합 로직은 서버에서 수행 (클라이언트 신뢰 X)
 * - 세션 검증 후 device_id 소유 확인
 *
 * 재시도:
 * - 계정 전환 시 재병합 가능 (lastMergedUserId 추적)
 * - 마이그레이션 실패 시 재시도 허용 (MIGRATED_KEY로 추적)
 */
export function useAuthMerge() {
  const { data: session, status } = useSession();
  const lastMergedUserIdRef = useRef<string | null>(null);
  const isMergingRef = useRef(false);

  useEffect(() => {
    // 로딩 중이거나 병합 진행 중이면 스킵
    if (status === 'loading' || isMergingRef.current) return;

    // 로그인된 상태가 아니면 스킵
    if (!session?.user?.id) {
      // 로그아웃 시 lastMergedUserId 리셋
      if (lastMergedUserIdRef.current) {
        lastMergedUserIdRef.current = null;
      }
      return;
    }

    const userId = session.user.id;

    // 같은 사용자로 이미 병합했으면 스킵
    if (lastMergedUserIdRef.current === userId) {
      return;
    }

    // 로컬에 사용자 정보 저장
    authService.setAuthUser({
      id: userId,
      email: session.user.email || undefined,
      name: session.user.name || undefined,
      image: session.user.image || undefined,
      provider: session.user.provider,
    });

    // 병합 시작
    isMergingRef.current = true;

    const deviceId = getDeviceId();

    // 1단계: device_id 매핑 병합
    fetch('/api/auth/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
    })
      .then(async (res) => {
        const data = await res.json();

        if (data.success) {
          if (data.mergedCount && data.mergedCount > 0) {
            console.log('[useAuthMerge] 병합 완료:', { userId, deviceId });
          } else if (data.alreadyMerged) {
            console.log('[useAuthMerge] 이미 병합됨:', { userId, deviceId });
          }

          // 2단계: localStorage 데이터 → DB 마이그레이션
          const migrationSuccess = await migrateLocalStorageData(deviceId);

          // 마이그레이션 성공 시에만 병합 완료로 표시
          if (migrationSuccess) {
            lastMergedUserIdRef.current = userId;
          }
          // 마이그레이션 실패해도 병합은 완료 (다음 로그인 시 재시도)
        } else {
          // 병합 실패 시 재시도 가능하도록 lastMergedUserId 설정 안 함
          console.warn('[useAuthMerge] 병합 실패:', data.error);
        }
      })
      .catch((error) => {
        // 네트워크 오류 등 - 재시도 가능
        console.error('[useAuthMerge] 병합 오류:', error);
      })
      .finally(() => {
        isMergingRef.current = false;
      });
  }, [session, status]);
}

/**
 * localStorage의 테스트 결과를 서버 DB로 마이그레이션
 * @returns 성공 여부
 */
async function migrateLocalStorageData(deviceId: string): Promise<boolean> {
  try {
    // localStorage에서 테스트 결과 가져오기
    const storedResults = localStorage.getItem(RESULTS_KEY);
    if (!storedResults) {
      console.log('[useAuthMerge] 마이그레이션할 데이터 없음');
      return true; // 데이터 없으면 성공으로 처리
    }

    const testResults = JSON.parse(storedResults);
    if (!Array.isArray(testResults) || testResults.length === 0) {
      return true; // 빈 배열이면 성공으로 처리
    }

    // 이미 마이그레이션된 데이터는 필터링
    const migratedAt = localStorage.getItem(MIGRATED_KEY);
    const migratedTime = migratedAt ? new Date(migratedAt).getTime() : 0;

    const newResults = testResults.filter(result => {
      const resultTime = new Date(result.created_at).getTime();
      return resultTime > migratedTime;
    });

    if (newResults.length === 0) {
      console.log('[useAuthMerge] 새로 마이그레이션할 데이터 없음');
      return true;
    }

    console.log('[useAuthMerge] 마이그레이션 시작:', newResults.length, '개');

    // 서버로 전송
    const res = await fetch('/api/auth/migrate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, testResults: newResults }),
    });

    const data = await res.json();

    if (data.success) {
      console.log('[useAuthMerge] 마이그레이션 완료:', {
        migrated: data.migratedCount,
        skipped: data.skippedCount,
      });

      // 마이그레이션 완료 시점 기록 (다음에 새 데이터만 마이그레이션)
      localStorage.setItem(MIGRATED_KEY, new Date().toISOString());
      return true;
    } else {
      console.warn('[useAuthMerge] 마이그레이션 실패:', data.error);
      return false;
    }
  } catch (error) {
    console.error('[useAuthMerge] 마이그레이션 오류:', error);
    return false;
  }
}

export default useAuthMerge;
