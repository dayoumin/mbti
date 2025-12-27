'use client';

import { Trophy, Flame, Heart, MessageCircle, Sparkles, ChevronRight } from 'lucide-react';
import { MOCK_COMMUNITY_POSTS } from '@/data/content/community';
import { RANKABLE_TESTS } from '@/data/config';
import { getIconComponent } from '@/utils';
import { SUBJECT_CONFIG } from '@/data/config';
import { CHEMI_DATA } from '@/data';

interface ContentDiscoverySidebarProps {
  onNavigate?: (target: string) => void;
  onStartTest?: (key: string) => void;
}

export default function ContentDiscoverySidebar({ onNavigate, onStartTest }: ContentDiscoverySidebarProps) {
  // HOT 커뮤니티 글
  const hotPosts = [...MOCK_COMMUNITY_POSTS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  // 추천 테스트 (랭킹 가능한 테스트)
  const recommendedTests = RANKABLE_TESTS.slice(0, 3);

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-4 space-y-4">
        {/* 랭킹 바로가기 */}
        <section className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-50/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">랭킹 보기</h3>
              <p className="text-white/80 text-xs">테스트 결과 순위 확인</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('ranking')}
            className="w-full py-2 bg-slate-50/20 hover:bg-slate-50/30 rounded-xl text-sm font-bold transition-colors"
          >
            전체 랭킹 보기 →
          </button>
        </section>

        {/* HOT 커뮤니티 */}
        <section className="bg-slate-50 rounded-2xl border border-subtle shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">HOT 게시물</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {hotPosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => onNavigate?.('community')}
                className="w-full flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl hover:bg-rose-50 transition-colors text-left group"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${index === 0 ? 'bg-amber-400 text-white' :
                  index === 1 ? 'bg-slate-300 text-white' :
                    'bg-orange-200 text-orange-700'
                  }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate group-hover:text-rose-600">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3" /> {post.comments}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 추천 테스트 */}
        <section className="bg-slate-50 rounded-2xl border border-subtle shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">추천 테스트</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {recommendedTests.map((test) => {
              const config = SUBJECT_CONFIG[test.key as keyof typeof SUBJECT_CONFIG];
              const data = CHEMI_DATA[test.key as keyof typeof CHEMI_DATA];
              if (!config || !data) return null;
              const IconComponent = getIconComponent(config.icon);

              return (
                <button
                  key={test.key}
                  onClick={() => onStartTest?.(test.key)}
                  className="w-full flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <IconComponent mood="happy" className="w-7 h-7" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600">
                      {data.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {data.resultLabels?.length || 0}가지 결과
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}
