/**
 * NextAuth.js 설정
 *
 * 소셜 로그인: 카카오, 구글, 네이버
 * 익명 사용 유지 + 선택적 로그인
 */

import { NextAuthOptions } from 'next-auth';
import type { OAuthConfig } from 'next-auth/providers/oauth';
import GoogleProvider from 'next-auth/providers/google';
import KakaoProvider from 'next-auth/providers/kakao';
import NaverProvider from 'next-auth/providers/naver';

// 환경변수가 설정된 프로바이더만 등록
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const providers: OAuthConfig<any>[] = [];

if (process.env.KAKAO_CLIENT_ID && process.env.KAKAO_CLIENT_SECRET) {
  providers.push(
    KakaoProvider({
      clientId: process.env.KAKAO_CLIENT_ID,
      clientSecret: process.env.KAKAO_CLIENT_SECRET,
    })
  );
}

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

if (process.env.NAVER_CLIENT_ID && process.env.NAVER_CLIENT_SECRET) {
  providers.push(
    NaverProvider({
      clientId: process.env.NAVER_CLIENT_ID,
      clientSecret: process.env.NAVER_CLIENT_SECRET,
    })
  );
}

export const authOptions: NextAuthOptions = {
  providers,

  callbacks: {
    async jwt({ token, account }) {
      // 최초 로그인 시 provider 정보 저장
      if (account) {
        token.provider = account.provider;
        token.providerAccountId = account.providerAccountId;
      }
      return token;
    },

    async session({ session, token }) {
      // 세션에 사용자 ID 추가
      if (session.user) {
        session.user.id = token.sub || '';
        // provider는 optional - 없으면 undefined
        session.user.provider = token.provider;
      }
      return session;
    },

    // 로그인 성공 처리 (익명→계정 병합은 서버 API에서 수행)
    async signIn() {
      return true;
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  debug: process.env.NODE_ENV === 'development',
};

// 타입 확장 (session.user에 커스텀 필드 추가)
declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      provider?: string;  // optional로 수정
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    provider?: string;
    providerAccountId?: string;
  }
}
