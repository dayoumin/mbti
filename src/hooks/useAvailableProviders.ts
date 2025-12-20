'use client';

import { useState, useEffect } from 'react';
import { getProviders, LiteralUnion, ClientSafeProvider } from 'next-auth/react';
import { BuiltInProviderType } from 'next-auth/providers/index';
import { SOCIAL_PROVIDERS, SocialProvider } from '@/lib/authProviders';

type ProvidersRecord = Record<
  LiteralUnion<BuiltInProviderType, string>,
  ClientSafeProvider
>;

/**
 * 서버에 실제 설정된 provider만 필터링해서 반환
 *
 * NextAuth의 /api/auth/providers API를 호출하여
 * 환경변수가 설정된 provider만 UI에 표시
 */
export function useAvailableProviders() {
  const [providers, setProviders] = useState<SocialProvider[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchProviders() {
      try {
        const serverProviders: ProvidersRecord | null = await getProviders();

        if (cancelled) return;

        if (!serverProviders) {
          setProviders([]);
          setLoading(false);
          return;
        }

        // 서버에 설정된 provider ID 목록
        const availableIds = Object.keys(serverProviders);

        // SOCIAL_PROVIDERS에서 실제 사용 가능한 것만 필터
        const filtered = SOCIAL_PROVIDERS.filter((p) =>
          availableIds.includes(p.id)
        );

        setProviders(filtered);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          console.error('[useAvailableProviders] 오류:', err);
          setError('프로바이더 로딩 실패');
          // 실패 시 전체 표시 (fallback)
          setProviders(SOCIAL_PROVIDERS);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchProviders();

    return () => {
      cancelled = true;
    };
  }, []);

  return { providers, loading, error, hasProviders: providers.length > 0 };
}

export default useAvailableProviders;
