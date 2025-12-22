'use client';

import { ChevronLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  onBack?: () => void;
  children?: ReactNode;  // 탭, 검색바 등 추가 요소
  className?: string;
}

/**
 * 공통 페이지 헤더 컴포넌트
 * - PC: 뒤로가기 버튼 숨김 (사이드바로 탭 전환)
 * - 모바일: 뒤로가기 버튼 표시
 */
export default function PageHeader({
  title,
  subtitle,
  icon,
  onBack,
  children,
  className = '',
}: PageHeaderProps) {
  return (
    <div className={`sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10 ${className}`}>
      <div className="px-4 lg:px-6 py-3">
        <div className="flex items-center gap-3">
          {/* 뒤로가기 버튼 - 모바일만 */}
          {onBack && (
            <button
              onClick={onBack}
              className="lg:hidden w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-all group"
            >
              <ChevronLeft className="w-6 h-6 text-slate-600 group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}
          <div className="flex-1">
            <h1 className="font-bold text-slate-800 flex items-center gap-2">
              {icon}
              {title}
            </h1>
            {subtitle && (
              <p className="text-xs text-slate-500">{subtitle}</p>
            )}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}