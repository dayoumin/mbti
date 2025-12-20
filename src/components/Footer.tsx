'use client';

import Link from 'next/link';

interface FooterProps {
  className?: string;
  variant?: 'default' | 'minimal';
}

export default function Footer({ className = '', variant = 'default' }: FooterProps) {
  if (variant === 'minimal') {
    return (
      <footer className={`text-center py-4 ${className}`}>
        <div className="flex items-center justify-center gap-3 text-xs text-slate-400">
          <Link href="/privacy" className="hover:text-slate-600 transition-colors">
            개인정보처리방침
          </Link>
          <span>|</span>
          <Link href="/terms" className="hover:text-slate-600 transition-colors">
            이용약관
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className={`hidden md:block border-t border-slate-100 bg-slate-50/50 ${className}`}>
      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* 면책 조항 */}
        <p className="text-xs text-slate-400 text-center mb-4">
          이 테스트는 재미와 자기 이해를 위한 것으로,
          전문적인 심리 검사를 대체하지 않습니다.
        </p>

        {/* 링크 */}
        <div className="flex items-center justify-center gap-4 text-xs">
          <Link
            href="/privacy"
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            개인정보처리방침
          </Link>
          <span className="text-slate-300">|</span>
          <Link
            href="/terms"
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            이용약관
          </Link>
        </div>

        {/* 저작권 */}
        <p className="text-[10px] text-slate-400 text-center mt-4">
          © 2025 케미테스트. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
