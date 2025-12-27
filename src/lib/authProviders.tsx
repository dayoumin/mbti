/**
 * 소셜 로그인 프로바이더 정보
 *
 * LoginButton, login/page.tsx 등에서 공통 사용
 */

import { ReactNode } from 'react';

export interface SocialProvider {
  id: 'kakao' | 'google' | 'naver';
  name: string;
  bgColor: string;
  textColor: string;
  hoverColor: string;
  border?: string;
  icon: ReactNode;
}

// 카카오 아이콘
const KakaoIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M12 3C6.48 3 2 6.58 2 11c0 2.85 1.86 5.35 4.67 6.77-.15.52-.96 3.37-1 3.53 0 .08.03.16.09.21.07.05.16.06.24.03.32-.08 3.72-2.42 4.25-2.77.58.08 1.16.13 1.75.13 5.52 0 10-3.58 10-8s-4.48-8-10-8z" />
  </svg>
);

// 구글 아이콘
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

// 네이버 아이콘
const NaverIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
    <path d="M16.273 12.845L7.376 0H0v24h7.727V11.155L16.624 24H24V0h-7.727z" />
  </svg>
);

export const SOCIAL_PROVIDERS: SocialProvider[] = [
  {
    id: 'kakao',
    name: '카카오',
    bgColor: 'bg-[#FEE500]',
    textColor: 'text-[#191919]',
    hoverColor: 'hover:bg-[#F5DC00]',
    icon: <KakaoIcon />,
  },
  {
    id: 'google',
    name: '구글',
    bgColor: 'bg-slate-50',
    textColor: 'text-gray-700',
    hoverColor: 'hover:bg-gray-50',
    border: 'border border-gray-300',
    icon: <GoogleIcon />,
  },
  {
    id: 'naver',
    name: '네이버',
    bgColor: 'bg-[#03C75A]',
    textColor: 'text-white',
    hoverColor: 'hover:bg-[#02B350]',
    icon: <NaverIcon />,
  },
];
