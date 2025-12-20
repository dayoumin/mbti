'use client';

import { useState, useEffect } from 'react';
import { Sparkles, Clock, TrendingUp, PenSquare, Heart, MessageCircle } from 'lucide-react';
import { NavTab, NAV_ITEMS } from './nav/types';
import { resultService } from '../services/ResultService';
import { CHEMI_DATA } from '../data/index';
import { getIconComponent } from '@/utils';
import { SUBJECT_CONFIG } from '../data/config';
import type { SubjectKey } from '../data/types';
import { getPostCategoryLabel, getPostCategoryStyle } from '../data/content/community';

// 타입 재export (기존 import 호환성 유지 - SidebarTab은 NavTab과 동일)
export type SidebarTab = NavTab;

interface RecentTest {
  testType: string;
  resultKey: string;
  resultEmoji: string;
  createdAt: string;
}

interface MyPost {
  id: string;
  category: 'tip' | 'qna' | 'boast' | 'general';
  title: string;
  likes: number;
  comments: number;
  date: string;
}

interface SidebarProps {
  activeTab: SidebarTab;
  onTabChange: (tab: SidebarTab) => void;
  onStartTest?: (testKey: string) => void;
  className?: string;
}

// 작은 테스트 카드 (사이드바용)
function SidebarTestCard({ testKey, onStart, rank }: { testKey: SubjectKey; onStart: (key: string) => void; rank?: number }) {
  const config = SUBJECT_CONFIG[testKey];
  const data = CHEMI_DATA[testKey as keyof typeof CHEMI_DATA];

  if (!config || !data) return null;

  const IconComponent = getIconComponent(config.icon);

  return (
    <button
      onClick={() => onStart(testKey)}
      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white/80 transition-all group text-left relative"
    >
      {rank && (
        <span className="absolute -top-1 -left-1 w-4 h-4 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-[8px] font-black rounded-full flex items-center justify-center shadow-sm z-10">
          {rank}
        </span>
      )}
      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
        <IconComponent mood="happy" className="w-6 h-6" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
          {data.title || config.label}
        </p>
      </div>
    </button>
  );
}

export default function Sidebar({
  activeTab,
  onTabChange,
  onStartTest,
  className = ''
}: SidebarProps) {
  const [recentTests, setRecentTests] = useState<RecentTest[]>([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [myPosts, setMyPosts] = useState<MyPost[]>([]);

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

        // TODO: 실제 API 연동 시 교체
        // 현재는 localStorage에서 내가 쓴 글 가져오기 (Mock)
        const savedPosts = localStorage.getItem('chemi_my_posts');
        if (savedPosts) {
          setMyPosts(JSON.parse(savedPosts).slice(0, 3));
        }
      } catch (e) {
        console.error('Failed to load data:', e);
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
        {/* 최근 본 테스트 */}
        {recentTests.length > 0 && (
          <div className="bg-slate-50/80 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-[10px] font-semibold text-slate-600">최근 본 테스트</span>
            </div>
            <div className="space-y-0.5">
              {recentTests.map((test) => (
                <SidebarTestCard
                  key={`${test.testType}-${test.createdAt}`}
                  testKey={test.testType as SubjectKey}
                  onStart={onStartTest || (() => {})}
                />
              ))}
            </div>
          </div>
        )}

        {/* 내가 쓴 글 */}
        {myPosts.length > 0 && (
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-2">
              <PenSquare className="w-3.5 h-3.5 text-pink-500" />
              <span className="text-[10px] font-semibold text-pink-700">내가 쓴 글</span>
            </div>
            <div className="space-y-1.5">
              {myPosts.map((post) => (
                <button
                  key={post.id}
                  onClick={() => onTabChange('talk')}
                  className="w-full p-2 bg-white/60 rounded-lg hover:bg-white transition-colors text-left group"
                >
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${getPostCategoryStyle(post.category)}`}>
                      {getPostCategoryLabel(post.category)}
                    </span>
                  </div>
                  <p className="text-[10px] font-medium text-slate-700 truncate group-hover:text-pink-600 transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
                      <Heart className="w-2.5 h-2.5" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5 text-[9px] text-slate-400">
                      <MessageCircle className="w-2.5 h-2.5" /> {post.comments}
                    </span>
                  </div>
                </button>
              ))}
            </div>
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
