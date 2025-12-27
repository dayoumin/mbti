'use client';

import { useState, useEffect, useMemo } from 'react';
import { Flame, Hash, Award, TrendingUp, Sparkles, Heart, MessageCircle } from 'lucide-react';
import { POST_CATEGORY_LABELS, type PostCategory } from '@/data/content/community';
import type { MOCK_COMMUNITY_POSTS } from '@/data/content/community';

type CategoryKey = 'all' | PostCategory;

// ============================================================================
// 공통 상수
// ============================================================================

// Mock 활발한 유저 데이터
const ACTIVE_USERS = [
  { id: '1', nickname: '고양이집사', postCount: 15, testResult: '😺 츤데레냥' },
  { id: '2', nickname: '댕댕이러버', postCount: 12, testResult: '🐕 골든리트리버' },
  { id: '3', nickname: '햄찌맘', postCount: 8, testResult: '🐹 활발이' },
];

// 오늘의 토론 주제 (Mock - 매일 다른 주제)
const DAILY_TOPICS = [
  { question: "집사들의 가장 큰 고민은?", emoji: "🤔", tags: ["#고민상담", "#집사일상"] },
  { question: "우리 아이 첫 만남 에피소드", emoji: "💕", tags: ["#첫만남", "#추억"] },
  { question: "요즘 핫한 간식 추천해주세요!", emoji: "🍖", tags: ["#간식추천", "#먹방"] },
  { question: "여름철 털 관리 꿀팁", emoji: "☀️", tags: ["#여름", "#털관리"] },
  { question: "반려동물과 여행 가본 곳", emoji: "✈️", tags: ["#여행", "#펫프렌들리"] },
];

// 오늘의 주제를 위한 커스텀 훅 (하이드레이션 안전 + 플리커 방지)
function useTodayTopic() {
  const [topic, setTopic] = useState<typeof DAILY_TOPICS[0] | null>(null);

  useEffect(() => {
    const today = new Date();
    const index = (today.getDate() + today.getMonth()) % DAILY_TOPICS.length;
    setTopic(DAILY_TOPICS[index]);
  }, []);

  return topic;
}

// ============================================================================
// CommunitySidebar Props
// ============================================================================

interface CommunitySidebarProps {
  posts: typeof MOCK_COMMUNITY_POSTS;
  onSelectPost: (id: string) => void;
  onCategoryChange: (category: CategoryKey) => void;
}

// ============================================================================
// CommunitySidebar - 우측 사이드바 컴포넌트
// ============================================================================

export default function CommunitySidebar({ posts, onSelectPost, onCategoryChange }: CommunitySidebarProps) {
  const todayTopic = useTodayTopic();

  // 태그 → 카테고리 매핑
  const tagToCategoryMap = useMemo(() => {
    return Object.fromEntries(
      Object.entries(POST_CATEGORY_LABELS).map(([key, label]) => [`#${label.replace('/', '')}`, key])
    ) as Record<string, PostCategory>;
  }, []);

  // HOT 게시물 (좋아요 순 TOP 3)
  const hotPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.likes - a.likes).slice(0, 3);
  }, [posts]);

  // 인기 태그 추출
  const popularTags = useMemo(() => {
    const categoryEmojis: Record<PostCategory, string> = {
      tip: '💡',
      qna: '❓',
      boast: '🎉',
      general: '💬'
    };
    return Object.entries(POST_CATEGORY_LABELS).map(([key, label]) => ({
      tag: `#${label.replace('/', '')}`,
      emoji: categoryEmojis[key as PostCategory],
      count: posts.filter(p => p.category === key).length
    }));
  }, [posts]);

  // 커뮤니티 통계 (하이드레이션 안전)
  const [todayDateStr, setTodayDateStr] = useState<string>('');
  useEffect(() => {
    setTodayDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  const stats = useMemo(() => ({
    todayPosts: todayDateStr
      ? posts.filter(p => p.date === todayDateStr).length || posts.length
      : posts.length,
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
    totalComments: posts.reduce((sum, p) => sum + p.comments, 0),
  }), [posts, todayDateStr]);

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-4 space-y-4">
        {/* HOT 게시물 TOP3 */}
        <section className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-800">HOT 게시물</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {hotPosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => onSelectPost(post.id)}
                className="w-full flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group text-left"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${index === 0 ? 'bg-amber-400 text-white' :
                  index === 1 ? 'bg-slate-300 text-white' :
                    'bg-orange-200 text-orange-700'
                  }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-0.5 text-xs text-rose-500">
                      <Heart className="w-3 h-3 fill-rose-500" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-slate-400">
                      <MessageCircle className="w-3 h-3" /> {post.comments}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 활발한 유저 */}
        <section className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">활발한 집사</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {ACTIVE_USERS.map((user) => (
              <div
                key={user.id}
                className="flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl"
              >
                <div className="w-9 h-9 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.nickname.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-700 truncate">{user.nickname}</p>
                  <p className="text-xs text-slate-400">{user.testResult}</p>
                </div>
                <span className="text-xs font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
                  +{user.postCount}글
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* 인기 태그 */}
        <section className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Hash className="w-4 h-4 text-emerald-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">인기 태그</h3>
          </div>
          <div className="px-4 pb-4 flex flex-wrap gap-2">
            {popularTags.map(({ tag, emoji, count }) => (
              <button
                key={tag}
                onClick={() => {
                  const category = tagToCategoryMap[tag];
                  if (category) onCategoryChange(category);
                }}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full text-xs font-medium transition-colors"
              >
                <span>{emoji}</span>
                <span>{tag}</span>
                <span className="text-slate-400">({count})</span>
              </button>
            ))}
            {todayTopic?.tags.map((tag: string) => (
              <button
                key={tag}
                className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-600 rounded-full text-xs font-bold"
              >
                <Sparkles className="w-3 h-3" />
                {tag}
              </button>
            ))}
          </div>
        </section>

        {/* 커뮤니티 통계 */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-indigo-700">커뮤니티 통계</h3>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-50/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-indigo-600">{stats.todayPosts}</p>
              <p className="text-xs text-slate-500">오늘 글</p>
            </div>
            <div className="bg-slate-50/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-rose-500">{stats.totalLikes}</p>
              <p className="text-xs text-slate-500">좋아요</p>
            </div>
            <div className="bg-slate-50/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-emerald-500">{stats.totalComments}</p>
              <p className="text-xs text-slate-500">댓글</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}
