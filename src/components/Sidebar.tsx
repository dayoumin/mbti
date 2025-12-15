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

export default function Sidebar({ activeTab, onTabChange, onStartTest, className = '' }: SidebarProps) {
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        const results = await resultService.getMyResults();
        // 최근 3개만
        setRecentTests(results.slice(0, 3).map(r => ({
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

  const formatTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return '방금 전';
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

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
      <nav className="p-4">
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

      {/* 하단 위젯 영역 */}
      <div className="flex-1 flex flex-col justify-end p-4 space-y-4">
        {/* 최근 테스트 */}
        {recentTests.length > 0 && (
          <div className="bg-slate-50/80 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-600">최근 테스트</span>
            </div>
            <ul className="space-y-2">
              {recentTests.map((test, idx) => {
                const data = CHEMI_DATA[test.testType as keyof typeof CHEMI_DATA];
                return (
                  <li key={idx}>
                    <button
                      onClick={() => onStartTest?.(test.testType)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/80 transition-colors text-left"
                    >
                      <span className="text-lg">{test.resultEmoji}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-slate-700 truncate">
                          {data?.title || test.testType}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {formatTimeAgo(test.createdAt)}
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
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
            <span className="text-xs font-semibold text-slate-600">내 활동</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-indigo-600">{completedCount}</span>
            <span className="text-xs text-slate-500">개 테스트 완료</span>
          </div>
          {completedCount === 0 && (
            <p className="text-[10px] text-slate-400 mt-1">
              첫 테스트를 시작해보세요!
            </p>
          )}
        </div>
      </div>
    </aside>
  );
}
