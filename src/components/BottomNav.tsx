'use client';

import { NavTab, NAV_ITEMS } from './nav/types';

// 타입 재export (기존 import 호환성 유지)
export type { NavTab };

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  className?: string;
}

export default function BottomNav({ activeTab, onTabChange, className = '' }: BottomNavProps) {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-[60] lg:hidden ${className}`}
      role="navigation"
      aria-label="하단 네비게이션"
    >
      {/* 배경 블러 + 그라데이션 */}
      <div className="absolute inset-0 bg-slate-50/80 backdrop-blur-xl border-t border-subtle" />

      {/* Safe Area 패딩 (iPhone 등) */}
      <div className="relative flex items-center justify-around px-2 py-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => onTabChange(key)}
              className={`flex flex-col items-center justify-center gap-0.5 min-w-[56px] min-h-[52px] px-3 py-2 rounded-xl transition-all ${isActive
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-700 active:bg-slate-100'
                }`}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className={`p-1.5 rounded-lg transition-all ${isActive ? 'bg-indigo-100' : ''
                }`}>
                <Icon
                  className={`w-5 h-5 transition-all ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                    }`}
                />
              </div>
              <span className={`text-xs font-medium ${isActive ? 'font-bold' : ''
                }`}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}