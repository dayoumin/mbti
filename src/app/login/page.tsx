'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { useAvailableProviders } from '@/hooks/useAvailableProviders';

function LoginContent() {
  const { data: session, status } = useSession();
  const { providers, loading: providersLoading, hasProviders } = useAvailableProviders();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  const error = searchParams.get('error');

  // 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    if (session) {
      router.push(callbackUrl);
    }
  }, [session, router, callbackUrl]);

  if (status === 'loading' || providersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-purple-50 to-white px-4">
      <div className="w-full max-w-sm">
        {/* 로고/제목 */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">케미 테스트</h1>
          <p className="text-gray-600">로그인하고 내 결과를 안전하게 저장하세요</p>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            로그인 중 문제가 발생했습니다. 다시 시도해주세요.
          </div>
        )}

        {/* 로그인 혜택 안내 */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 shadow-sm border border-gray-100">
          <h3 className="font-medium text-gray-800 mb-2">로그인하면</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              다른 기기에서도 내 결과 확인
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              테스트 기록 영구 보관
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500">✓</span>
              뱃지와 프로필 유지
            </li>
          </ul>
        </div>

        {/* 소셜 로그인 버튼 - 실제 설정된 provider만 표시 */}
        {hasProviders ? (
          <div className="space-y-3">
            {providers.map((provider) => (
              <button
                key={provider.id}
                onClick={() => signIn(provider.id, { callbackUrl })}
                className={`w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${provider.bgColor} ${provider.textColor} ${provider.hoverColor} ${provider.border || ''}`}
              >
                {provider.icon}
                <span>{provider.name}로 계속하기</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center p-4 bg-gray-50 rounded-xl text-gray-500 text-sm">
            소셜 로그인이 아직 설정되지 않았습니다.
            <br />
            <span className="text-xs">관리자에게 문의하세요.</span>
          </div>
        )}

        {/* 익명 사용 안내 */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push(callbackUrl)}
            className="text-gray-500 hover:text-gray-700 text-sm underline"
          >
            로그인 없이 계속하기
          </button>
          <p className="mt-2 text-xs text-orange-600">
            * 로그인 없이 사용 시 기기 변경이나 브라우저 초기화 시 데이터가 사라질 수 있어요
          </p>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
