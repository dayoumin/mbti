'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clock, TrendingUp } from 'lucide-react';
import { NavTab, NAV_ITEMS } from './nav/types';
import { resultService } from '../services/ResultService';
import { CHEMI_DATA } from '../data/index';

// 타입 재export (기존 import 호환성 유지 - SidebarTab은 NavTab과 동일)
export type SidebarTab = NavTab;

interface RecentTest {
  testType: string;
  resultKey: string;
  resultEmoji: string;
  createdAt: string;
}

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onStartTest?: (testKey: string) => void;
  className?: string;
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onStartTest,
  className = ''
}: SidebarProps) {
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await resultService.getMyResults();
        // 최근 2개만 (사이드바 표시용)
        setRecentTests(results.slice(0, 2).map(r => ({
          testType: r.testType,
          resultKey: r.resultKey,
          resultEmoji: r.resultEmoji,
          createdAt: r.createdAt,
        })));
        setCompletedCount(results.length);
      } catch (e) {
        console.error('Failed to load recent tests:', e);
      }
    };
    loadData();
  }, []);

  return (
    <aside
      className={`hidden lg:flex flex-col w-60 h-screen bg-white/80 backdrop-blur-xl border-r border-slate-200/50 ${className}`}
      role="navigation"
      aria-label="사이드 네비게이션"
    >
      {/* 로고 영역 - 클릭 시 홈으로 */}
      <button
        onClick={() => onTabChange('home')}
        className="p-6 border-b border-slate-100 text-left hover:bg-slate-50/50 transition-colors"
      >
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
      </button>

      {/* 네비게이션 */}
      <nav className="p-4 pb-2">
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ key, label, icon: Icon }) => {
            const isActive = activeTab === key;

            return (
              <li key={key}>
                <button
                  onClick={() => onTabChange(key)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${isActive
                    ? 'bg-indigo-50 text-indigo-600 font-bold'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                    }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon
                    className={`w-5 h-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'
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

      {/* 하단 위젯 영역 - 스크롤 가능 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        {/* 최근 테스트 */}
        {recentTests.length > 0 && (
          <div className="bg-slate-50/80 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-600">최근 테스트</span>
            </div>
            <ul className="space-y-1">
              {recentTests.map((test) => {
                const data = CHEMI_DATA[test.testType as keyof typeof CHEMI_DATA];
                return (
                  <li key={`${test.testType}-${test.createdAt}`}>
                    <button
                      onClick={() => onStartTest?.(test.testType)}
                      className="w-full flex items-center gap-2 p-1.5 rounded-lg hover:bg-white/80 transition-colors text-left"
                    >
                      <span className="text-sm">{test.resultEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-medium text-slate-700 truncate">
                          {data?.title || test.testType}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* 통계 */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-semibold text-slate-600">내 활동</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-black text-indigo-600">{completedCount}</span>
            <span className="text-[10px] text-slate-500">개 테스트 완료</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
