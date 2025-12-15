'use client';

import { Sparkles } from 'lucide-react';
import { NavTab, NAV_ITEMS } from './nav/types';

// 타입 재export (기존 import 호환성 유지 - SidebarTab은 NavTab과 동일)
export type SidebarTab = NavTab;

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  className?: string;
}

export default function Sidebar({ activeTab, onTabChange, className = '' }: SidebarProps) {
  return (
    <aside
      className={`hidden lg:flex flex-col w-60 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/50 ${className}`}
      role="navigation"
      aria-label="사이드 네비게이션"
    >
      {/* 로고 영역 */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-black text-lg text-slate-800">
              Chemi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Test</span>
            </h1>
            <p className="text-[10px] text-slate-400">오늘은 뭘 알아볼까?</p>
          </div>
        </div>
      </div>

      {/* 네비게이션 */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;
            return (
              <li key={key}>
                <button
                  onClick={() => onTabChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                    isActive
                      ? 'bg-indigo-50 text-indigo-600 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${
                      isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
                    }`}
                  />
                  <span className="text-sm">{label}</span>
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

    </aside>
  );
}
