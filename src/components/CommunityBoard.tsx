'use client';

import React, { useState, useMemo } from 'react';
import { MessageCircle, Heart, Share2, Search, Filter, Plus, ChevronRight, Flame, Users, TrendingUp, Hash, Award, Sparkles, PenSquare } from 'lucide-react';
import CommentSystem from './CommentSystem';
import { MOCK_COMMUNITY_POSTS, POST_CATEGORY_LABELS, getPostCategoryLabel, getPostCategoryStyle, type PostCategory } from '@/data/content/community';

type CategoryKey = 'all' | PostCategory;

// ============================================================================
// 오늘의 토론 주제 (Mock - 매일 다른 주제)
// ============================================================================
const DAILY_TOPICS = [
  { question: "집사들의 가장 큰 고민은?", emoji: "🤔", tags: ["#고민상담", "#집사일상"] },
  { question: "우리 아이 첫 만남 에피소드", emoji: "💕", tags: ["#첫만남", "#추억"] },
  { question: "요즘 핫한 간식 추천해주세요!", emoji: "🍖", tags: ["#간식추천", "#먹방"] },
  { question: "여름철 털 관리 꿀팁", emoji: "☀️", tags: ["#여름", "#털관리"] },
  { question: "반려동물과 여행 가본 곳", emoji: "✈️", tags: ["#여행", "#펫프렌들리"] },
];

// 오늘 날짜 기반 주제 선택
const getTodayTopic = () => {
  const today = new Date();
  const index = (today.getDate() + today.getMonth()) % DAILY_TOPICS.length;
  return DAILY_TOPICS[index];
};

// ============================================================================
// Mock 활발한 유저 데이터
// ============================================================================
const ACTIVE_USERS = [
  { id: '1', nickname: '고양이집사', postCount: 15, testResult: '😺 츤데레냥' },
  { id: '2', nickname: '댕댕이러버', postCount: 12, testResult: '🐕 골든리트리버' },
  { id: '3', nickname: '햄찌맘', postCount: 8, testResult: '🐹 활발이' },
];

// ============================================================================
// 우측 사이드바 컴포넌트
// ============================================================================
function CommunitySidebar({ posts }: { posts: typeof MOCK_COMMUNITY_POSTS }) {
  const todayTopic = getTodayTopic();

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

  // 커뮤니티 통계
  const stats = useMemo(() => ({
    todayPosts: posts.filter(p => p.date === new Date().toISOString().split('T')[0]).length || posts.length,
    totalLikes: posts.reduce((sum, p) => sum + p.likes, 0),
    totalComments: posts.reduce((sum, p) => sum + p.comments, 0),
  }), [posts]);

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-4 space-y-4">
        {/* HOT 게시물 TOP3 */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-bold text-slate-800">HOT 게시물</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {hotPosts.map((post, index) => (
              <div
                key={post.id}
                className="flex items-start gap-2.5 p-2.5 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer group"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
                  index === 0 ? 'bg-amber-400 text-white' :
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
              </div>
            ))}
          </div>
        </section>

        {/* 활발한 유저 */}
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center">
              <Award className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-base font-bold text-slate-800">활발한 집사</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {ACTIVE_USERS.map((user, index) => (
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
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
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
                className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600 rounded-full text-xs font-medium transition-colors"
              >
                <span>{emoji}</span>
                <span>{tag}</span>
                <span className="text-slate-400">({count})</span>
              </button>
            ))}
            {todayTopic.tags.map(tag => (
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
            <div className="bg-white/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-indigo-600">{stats.todayPosts}</p>
              <p className="text-xs text-slate-500">오늘 글</p>
            </div>
            <div className="bg-white/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-rose-500">{stats.totalLikes}</p>
              <p className="text-xs text-slate-500">좋아요</p>
            </div>
            <div className="bg-white/60 rounded-xl p-2.5 text-center">
              <p className="text-lg font-black text-emerald-500">{stats.totalComments}</p>
              <p className="text-xs text-slate-500">댓글</p>
            </div>
          </div>
        </section>
      </div>
    </aside>
  );
}

// ============================================================================
// 참여 유도 배너
// ============================================================================
function EngagementBanner() {
  const todayTopic = getTodayTopic();

  return (
    <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-2xl p-4 border border-amber-100 mb-4">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-amber-200">
          {todayTopic.emoji}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full">
              오늘의 토론
            </span>
          </div>
          <h3 className="text-base font-black text-slate-800">
            {todayTopic.question}
          </h3>
        </div>
        <button className="flex-shrink-0 px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl shadow-md hover:shadow-lg transition-all active:scale-95">
          <PenSquare className="w-4 h-4 inline mr-1" />
          참여하기
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 게시물 카드 (리치 버전)
// ============================================================================
interface PostCardProps {
  post: typeof MOCK_COMMUNITY_POSTS[0];
  onClick: () => void;
}

function PostCard({ post, onClick }: PostCardProps) {
  const isHot = post.likes >= 50 || post.comments >= 20;

  // Mock 테스트 결과 배지 (실제로는 유저 프로필에서 가져옴)
  const testBadges = ['🐕 골든리트리버', '☕ 아메리카노', '😺 츤데레냥', '🐹 활발이'];
  const randomBadge = testBadges[post.id.charCodeAt(post.id.length - 1) % testBadges.length];

  return (
    <button
      onClick={onClick}
      className="w-full bg-white p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all text-left group relative overflow-hidden"
    >
      {/* HOT 배지 */}
      {isHot && (
        <div className="absolute top-3 right-3 px-2 py-0.5 bg-gradient-to-r from-rose-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
          <Flame className="w-3 h-3" /> HOT
        </div>
      )}

      {/* 헤더: 카테고리 + 작성자 정보 */}
      <div className="flex items-center gap-2 mb-2">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${getPostCategoryStyle(post.category)}`}>
          {getPostCategoryLabel(post.category)}
        </span>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {post.author.charAt(0)}
          </div>
          <span className="text-xs font-medium text-slate-600">{post.author}</span>
        </div>
        <span className="text-xs text-slate-300">·</span>
        <span className="text-xs text-slate-400">{post.date}</span>
      </div>

      {/* 제목 */}
      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm mb-1.5 pr-16">
        {post.title}
      </h3>

      {/* 본문 미리보기 */}
      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3">
        {post.content}
      </p>

      {/* 하단: 통계 + 테스트 배지 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Heart className={`w-3.5 h-3.5 ${isHot ? 'text-rose-500 fill-rose-500' : ''}`} />
            <span className={isHot ? 'text-rose-500 font-bold' : ''}>{post.likes}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-400">
            <MessageCircle className="w-3.5 h-3.5" /> {post.comments}
          </div>
          <span className="text-xs text-slate-300">조회 {post.viewCount}</span>
        </div>

        {/* 테스트 결과 배지 */}
        <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
          {randomBadge}
        </span>
      </div>
    </button>
  );
}

export default function CommunityBoard({ className = '' }: { className?: string }) {
    const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
    const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

    const filteredPosts = activeCategory === 'all'
        ? MOCK_COMMUNITY_POSTS
        : MOCK_COMMUNITY_POSTS.filter(p => p.category === activeCategory);

    const selectedPost = MOCK_COMMUNITY_POSTS.find(p => p.id === selectedPostId);

    if (selectedPostId && selectedPost) {
        return (
            <div className={`flex flex-col h-full bg-white animate-fade-in ${className}`}>
                {/* Post Detail Header */}
                <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between">
                    <button onClick={() => setSelectedPostId(null)} className="text-slate-500 font-bold flex items-center gap-1">
                        <ChevronRight className="w-5 h-5 rotate-180" /> 목록으로
                    </button>
                    <div className="flex gap-3">
                        <button className="p-2 text-slate-400 hover:text-rose-500"><Heart className="w-5 h-5" /></button>
                        <button className="p-2 text-slate-400 hover:text-indigo-500"><Share2 className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="mb-6">
                        <span className={`px-2 py-0.5 text-xs font-bold rounded-full mb-2 inline-block ${getPostCategoryStyle(selectedPost.category)}`}>
                            {getPostCategoryLabel(selectedPost.category)}
                        </span>
                        <h1 className="text-xl font-black text-slate-800 leading-tight mb-3">
                            {selectedPost.title}
                        </h1>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <span className="font-bold text-slate-600">{selectedPost.author}</span>
                            <span>·</span>
                            <span>{selectedPost.date}</span>
                            <span>·</span>
                            <span>조회 {selectedPost.viewCount}</span>
                        </div>
                    </div>

                    <div className="text-slate-700 leading-relaxed text-sm mb-8 whitespace-pre-wrap">
                        {selectedPost.content}
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <CommentSystem targetType="test_result" targetId={`post_${selectedPostId}`} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`flex flex-col h-full bg-slate-50 relative ${className}`}>
            {/* Search & Header */}
            <div className="bg-white px-6 py-4 shadow-sm border-b border-slate-100 sticky top-0 z-10">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-black text-slate-800">커뮤니티</h2>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        <input
                            type="text"
                            placeholder="검색어를 입력하세요"
                            className="bg-slate-50 border-none rounded-full py-2 pl-9 pr-4 text-xs w-48 focus:ring-2 focus:ring-indigo-500/20"
                        />
                    </div>
                </div>

                {/* Categories */}
                <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
                    {Object.entries(POST_CATEGORY_LABELS).map(([key, label]) => (
                        <button
                            key={key}
                            onClick={() => setActiveCategory(key as CategoryKey)}
                            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === key
                                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                                }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 2단 레이아웃: 메인 콘텐츠 + 우측 사이드바 */}
            <div className="flex-1 overflow-y-auto">
                <div className="flex justify-center p-4 pb-24 xl:pb-4">
                    <div className="flex gap-6 w-full max-w-[1200px]">
                        {/* 메인 콘텐츠 영역 */}
                        <div className="flex-1 min-w-0 space-y-3">
                            {/* 참여 유도 배너 */}
                            <EngagementBanner />

                            {/* Post List */}
                            {filteredPosts.map(post => (
                                <PostCard
                                    key={post.id}
                                    post={post}
                                    onClick={() => setSelectedPostId(post.id)}
                                />
                            ))}

                            {filteredPosts.length === 0 && (
                                <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3 bg-white rounded-2xl">
                                    <Filter className="w-8 h-8 opacity-20" />
                                    <p className="text-sm font-medium">게시글이 없습니다</p>
                                </div>
                            )}
                        </div>

                        {/* 우측 사이드바 - PC에서만 표시 */}
                        <CommunitySidebar posts={MOCK_COMMUNITY_POSTS} />
                    </div>
                </div>
            </div>

            {/* Write Button */}
            <button className="fixed bottom-24 right-6 xl:bottom-6 w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-full shadow-lg shadow-indigo-300 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-20">
                <Plus className="w-6 h-6" />
            </button>
        </div>
    );
}
