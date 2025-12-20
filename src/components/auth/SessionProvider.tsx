'use client';

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react';
import { ReactNode } from 'react';
import { AuthMergeHandler } from './AuthMergeHandler';

interface Props {
  children: ReactNode;
}

export default function SessionProvider({ children }: Props) {
  return (
    <NextAuthSessionProvider>
      <AuthMergeHandler />
      {children}
    </NextAuthSessionProvider>
  );
}
