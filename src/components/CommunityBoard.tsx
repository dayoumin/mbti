'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { MessageCircle, Heart, Share2, Search, Filter, ChevronRight, Flame, Hash, Sparkles, PenSquare, ArrowUp, ArrowDown, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CommentSystem from './CommentSystem';
import CommunitySidebar from './community/CommunitySidebar';
import CommunityPostList from './community/CommunityPostList';
import { MOCK_COMMUNITY_POSTS, POST_CATEGORY_LABELS, getPostCategoryLabel, getPostCategoryStyle, type PostCategory } from '@/data/content/community';
import { SUBJECT_CONFIG } from '@/data/config';
import { CHEMI_DATA } from '@/data/index';
import { getIconComponent } from '@/utils';

type CategoryKey = 'all' | PostCategory;

// ============================================================================
// 공통 상수
// ============================================================================

// Mock 테스트 결과 배지
const TEST_BADGES = ['🐕 골든리트리버', '☕ 아메리카노', '😺 츤데레냥', '🐹 활발이'];

// ============================================================================
// 게시글 상세 우측 사이드바 (PC)
// ============================================================================
interface PostDetailSidebarProps {
  currentPost: typeof MOCK_COMMUNITY_POSTS[0];
  allPosts: typeof MOCK_COMMUNITY_POSTS;
  onSelectPost: (id: string) => void;
  onBack: () => void;
  onStartTest?: (testKey: string) => void;
  onShowToast?: (message: string) => void;
}

function PostDetailSidebar({ currentPost, allPosts, onSelectPost, onBack, onStartTest, onShowToast }: PostDetailSidebarProps) {
  // 같은 카테고리의 다른 글
  const relatedPosts = useMemo(() => {
    return allPosts
      .filter(p => p.category === currentPost.category && p.id !== currentPost.id)
      .slice(0, 3);
  }, [allPosts, currentPost]);

  // 인기 게시물 (전체 중 TOP 3, 현재 글 제외)
  const hotPosts = useMemo(() => {
    return allPosts
      .filter(p => p.id !== currentPost.id)
      .sort((a, b) => b.likes - a.likes)
      .slice(0, 3);
  }, [allPosts, currentPost]);

  // 현재 글의 위치 (이전/다음 네비게이션)
  const currentIndex = allPosts.findIndex(p => p.id === currentPost.id);
  const prevPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const nextPost = currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  // Mock 테스트 결과 배지 (빈 ID 가드 포함)
  const authorBadgeIndex = currentPost.id?.length > 0
    ? currentPost.id.charCodeAt(0) % TEST_BADGES.length
    : 0;
  const authorBadge = TEST_BADGES[authorBadgeIndex];

  // 추천 테스트 (글 카테고리 기반)
  const recommendedTests = useMemo(() => {
    const testMap: Record<PostCategory, string[]> = {
      tip: ['cat', 'dog'],
      qna: ['human', 'petMatch'],
      boast: ['cat', 'dog', 'rabbit'],
      general: ['human', 'coffee']
    };
    return (testMap[currentPost.category] || ['human']).slice(0, 2);
  }, [currentPost.category]);

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-20 space-y-4">
        {/* 작성자 정보 */}
        <section className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full flex items-center justify-center text-white text-lg font-bold">
              {currentPost.author.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-slate-700">{currentPost.author}</p>
              <p className="text-xs text-indigo-500">{authorBadge}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onShowToast?.('팔로우 기능은 준비 중이에요!')}
              className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-600 transition-colors"
            >
              팔로우
            </button>
            <button
              onClick={() => onShowToast?.('다른 글 보기 기능은 준비 중이에요!')}
              className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 rounded-lg text-xs font-bold text-indigo-600 transition-colors"
            >
              다른 글 보기
            </button>
          </div>
        </section>

        {/* 이전/다음 글 네비게이션 */}
        <section className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-2">
            <h3 className="text-sm font-bold text-slate-600 flex items-center gap-1">
              📖 글 이동
            </h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {prevPost && (
              <button
                onClick={() => onSelectPost(prevPost.id)}
                className="w-full flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors group text-left"
              >
                <ArrowUp className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400">이전 글</p>
                  <p className="text-xs font-bold text-slate-600 truncate group-hover:text-indigo-600">
                    {prevPost.title}
                  </p>
                </div>
              </button>
            )}
            {nextPost && (
              <button
                onClick={() => onSelectPost(nextPost.id)}
                className="w-full flex items-center gap-2 p-2.5 bg-slate-50 rounded-lg hover:bg-indigo-50 transition-colors group text-left"
              >
                <ArrowDown className="w-4 h-4 text-slate-400 group-hover:text-indigo-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-slate-400">다음 글</p>
                  <p className="text-xs font-bold text-slate-600 truncate group-hover:text-indigo-600">
                    {nextPost.title}
                  </p>
                </div>
              </button>
            )}
            <button
              onClick={onBack}
              className="w-full py-2 text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
            >
              ← 목록으로 돌아가기
            </button>
          </div>
        </section>

        {/* 관련 글 */}
        {relatedPosts.length > 0 && (
          <section className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-4 pt-3 pb-2 flex items-center gap-2">
              <Hash className="w-4 h-4 text-emerald-500" />
              <h3 className="text-sm font-bold text-slate-600">관련 글</h3>
            </div>
            <div className="px-3 pb-3 space-y-2">
              {relatedPosts.map(post => (
                <button
                  key={post.id}
                  onClick={() => onSelectPost(post.id)}
                  className="w-full p-2.5 bg-slate-50 rounded-lg hover:bg-emerald-50 transition-colors text-left group"
                >
                  <p className="text-xs font-bold text-slate-600 truncate group-hover:text-emerald-600">
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
                </button>
              ))}
            </div>
          </section>
        )}

        {/* 인기 게시물 */}
        <section className="bg-slate-50 rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="px-4 pt-3 pb-2 flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-bold text-slate-600">인기 글</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {hotPosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => onSelectPost(post.id)}
                className="w-full flex items-start gap-2 p-2 bg-slate-50 rounded-lg hover:bg-rose-50 transition-colors text-left group"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${index === 0 ? 'bg-amber-400 text-white' :
                  index === 1 ? 'bg-slate-300 text-white' :
                    'bg-orange-200 text-orange-700'
                  }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-600 truncate group-hover:text-rose-600">
                    {post.title}
                  </p>
                  <span className="text-xs text-rose-400 flex items-center gap-0.5 mt-0.5">
                    <Heart className="w-3 h-3 fill-rose-400" /> {post.likes}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 추천 테스트 */}
        <section className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h3 className="text-sm font-bold text-indigo-700">추천 테스트</h3>
          </div>
          <div className="space-y-2">
            {recommendedTests.map(testKey => {
              const config = SUBJECT_CONFIG[testKey as keyof typeof SUBJECT_CONFIG];
              const data = CHEMI_DATA[testKey as keyof typeof CHEMI_DATA];
              if (!config || !data) return null;
              const IconComponent = getIconComponent(config.icon);

              return (
                <button
                  key={testKey}
                  onClick={() => onStartTest?.(testKey)}
                  className="w-full flex items-center gap-3 p-2.5 bg-slate-50/80 rounded-xl hover:bg-slate-50 transition-colors group"
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


interface CommunityBoardProps {
  className?: string;
  onStartTest?: (testKey: string) => void;
  onClose?: () => void;
}

// 검색 debounce 훅
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

export default function CommunityBoard({ className = '', onStartTest, onClose }: CommunityBoardProps) {
  const [activeCategory, setActiveCategory] = useState<CategoryKey>('all');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showToast, setShowToast] = useState<string | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 검색어 debounce (300ms)
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // 토스트 표시 함수
  const showToastMessage = (message: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setShowToast(message);
    toastTimerRef.current = setTimeout(() => {
      setShowToast(null);
      toastTimerRef.current = null;
    }, 2000);
  };

  // 토스트 타이머 정리
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  // 검색 + 카테고리 필터링
  const filteredPosts = useMemo(() => {
    let posts = activeCategory === 'all'
      ? MOCK_COMMUNITY_POSTS
      : MOCK_COMMUNITY_POSTS.filter(p => p.category === activeCategory);

    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase();
      posts = posts.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query)
      );
    }

    return posts;
  }, [activeCategory, debouncedSearchQuery]);

  const selectedPost = MOCK_COMMUNITY_POSTS.find(p => p.id === selectedPostId);

  if (selectedPostId && selectedPost) {
    return (
      <div className={`flex flex-col h-full bg-slate-50 animate-fade-in ${className}`}>
        {/* 토스트 알림 */}
        {showToast && (
          <div
            role="status"
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-slate-800 text-white text-sm font-medium rounded-full shadow-lg animate-fade-in"
          >
            {showToast}
          </div>
        )}

        {/* Post Detail Header */}
        <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-md border-b border-slate-100 p-4 flex items-center justify-between">
          <button onClick={() => setSelectedPostId(null)} className="text-slate-500 font-bold flex items-center gap-1">
            <ChevronRight className="w-5 h-5 rotate-180" /> 목록으로
          </button>
          <div className="flex gap-3">
            <button className="p-2 text-slate-400 hover:text-rose-500" aria-label="좋아요"><Heart className="w-5 h-5" /></button>
            <button className="p-2 text-slate-400 hover:text-indigo-500" aria-label="공유"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>

        {/* 2단 레이아웃: 본문 + 사이드바 */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex justify-center p-4 pb-24 lg:p-6 lg:pb-6">
            <div className="flex gap-6 w-full max-w-[1000px]">
              {/* 메인 콘텐츠 */}
              <article className="flex-1 min-w-0 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm p-6">
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

                <div className="text-slate-700 leading-relaxed text-sm mb-8 whitespace-pre-wrap min-h-[200px]">
                  {selectedPost.content}
                </div>

                {/* 좋아요/공유 액션 바 */}
                <div className="flex items-center justify-center gap-4 py-4 border-t border-b border-slate-100 mb-6">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-500 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span className="text-sm font-bold">{selectedPost.likes}</span>
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-500 transition-colors">
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm font-bold">공유</span>
                  </button>
                </div>

                <div className="pt-2">
                  <CommentSystem targetType="test_result" targetId={`post_${selectedPostId}`} />
                </div>
              </article>

              {/* 우측 사이드바 - PC만 */}
              <PostDetailSidebar
                currentPost={selectedPost}
                allPosts={MOCK_COMMUNITY_POSTS}
                onSelectPost={setSelectedPostId}
                onBack={() => setSelectedPostId(null)}
                onStartTest={onStartTest}
                onShowToast={showToastMessage}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-col h-full bg-slate-50 relative ${className}`}>
      {/* 헤더 */}
      <PageHeader title="커뮤니티" onBack={onClose}>
        {/* 검색 바 */}
        <div className="relative mt-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-slate-400" />
            </button>
          )}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1 mt-3">
          <button
            onClick={() => setActiveCategory('all')}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
              }`}
          >
            전체
          </button>
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
      </PageHeader>

      {/* 2단 레이아웃: 메인 콘텐츠 + 우측 사이드바 */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex justify-center p-4 pb-24 lg:p-6 lg:pb-6">
          <div className="flex gap-6 w-full max-w-[1200px]">
            {/* 메인 콘텐츠 영역 */}
            {filteredPosts.length === 0 ? (
              <div className="flex-1 min-w-0">
                <div className="py-20 text-center text-slate-400 flex flex-col items-center gap-3 bg-slate-50 rounded-2xl">
                  <Filter className="w-8 h-8 opacity-20" />
                  <p className="text-sm font-medium">
                    {debouncedSearchQuery.trim() ? '검색 결과가 없습니다' : '게시글이 없습니다'}
                  </p>
                  {debouncedSearchQuery.trim() && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="text-xs text-indigo-500 hover:text-indigo-600 font-medium"
                    >
                      검색어 지우기
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <CommunityPostList
                posts={filteredPosts}
                onPostClick={setSelectedPostId}
                showEngagementBanner={true}
              />
            )}

            {/* 우측 사이드바 - PC에서만 표시 */}
            <CommunitySidebar
              posts={MOCK_COMMUNITY_POSTS}
              onSelectPost={setSelectedPostId}
              onCategoryChange={setActiveCategory}
            />
          </div>
        </div>
      </div>

      {/* Write Button - 모바일: FAB, PC: 텍스트 포함 버튼 */}
      <button
        aria-label="글쓰기"
        className="fixed bottom-24 right-6 lg:bottom-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-300 flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-20 w-14 h-14 rounded-full lg:w-auto lg:h-auto lg:px-5 lg:py-3 lg:rounded-xl lg:gap-2"
      >
        <PenSquare className="w-5 h-5" />
        <span className="hidden lg:inline text-sm font-bold">글쓰기</span>
      </button>
    </div>
  );
}
