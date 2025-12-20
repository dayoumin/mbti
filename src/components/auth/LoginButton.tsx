'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useAvailableProviders } from '@/hooks/useAvailableProviders';

interface LoginButtonProps {
  className?: string;
  showLogout?: boolean;
}

export default function LoginButton({ className = '', showLogout = true }: LoginButtonProps) {
  const { data: session, status } = useSession();
  const { providers, loading: providersLoading, hasProviders } = useAvailableProviders();

  if (status === 'loading' || providersLoading) {
    return (
      <div className={`animate-pulse bg-gray-200 rounded-lg h-10 w-24 ${className}`} />
    );
  }

  // 로그인된 상태
  if (session?.user) {
    if (!showLogout) return null;

    return (
      <div className={`flex items-center gap-3 ${className}`}>
        {session.user.image && (
          <img
            src={session.user.image}
            alt={session.user.name || '프로필'}
            className="w-8 h-8 rounded-full"
          />
        )}
        <span className="text-sm text-gray-700">
          {session.user.name || session.user.email}
        </span>
        <button
          onClick={() => signOut()}
          className="text-sm text-gray-500 hover:text-gray-700 underline"
        >
          로그아웃
        </button>
      </div>
    );
  }

  // provider가 없으면 안내 메시지
  if (!hasProviders) {
    return (
      <div className={`text-sm text-gray-500 ${className}`}>
        소셜 로그인이 아직 설정되지 않았습니다.
      </div>
    );
  }

  // 로그인 안된 상태 - 실제 설정된 소셜 로그인 버튼들만 표시
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {providers.map((provider) => (
        <button
          key={provider.id}
          onClick={() => signIn(provider.id)}
          className={`flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-opacity hover:opacity-90 ${provider.bgColor} ${provider.textColor} ${provider.border || ''}`}
        >
          {provider.icon}
          <span>{provider.name}로 계속하기</span>
        </button>
      ))}
    </div>
  );
}

// 간단한 로그인 유도 배너
export function LoginPromptBanner() {
  const { data: session } = useSession();

  if (session) return null;

  return (
    <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl">💡</span>
        <div className="flex-1">
          <p className="font-medium text-gray-800 mb-1">
            로그인하면 더 좋아요!
          </p>
          <p className="text-sm text-gray-600 mb-3">
            다른 기기에서도 내 결과를 볼 수 있어요.
            <br />
            <span className="text-orange-600">
              지금은 브라우저 초기화 시 사라질 수 있어요.
            </span>
          </p>
          <LoginButton className="max-w-xs" />
        </div>
      </div>
    </div>
  );
}

// 작은 로그인 버튼 (헤더용)
export function LoginButtonSmall() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="animate-pulse bg-gray-200 rounded-full h-8 w-8" />;
  }

  if (session?.user) {
    return (
      <button
        onClick={() => signOut()}
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800"
      >
        {session.user.image ? (
          <img
            src={session.user.image}
            alt=""
            className="w-7 h-7 rounded-full"
          />
        ) : (
          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center">
            <span className="text-xs">👤</span>
          </div>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={() => signIn()}
      className="text-sm text-purple-600 hover:text-purple-800 font-medium"
    >
      로그인
    </button>
  );
}
