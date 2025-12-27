'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { MessageCircle, Heart, Share2, Search, Filter, ChevronRight, Flame, TrendingUp, Hash, Award, Sparkles, PenSquare, ArrowUp, ArrowDown, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import CommentSystem from './CommentSystem';
import { MOCK_COMMUNITY_POSTS, POST_CATEGORY_LABELS, getPostCategoryLabel, getPostCategoryStyle, type PostCategory } from '@/data/content/community';
import { SUBJECT_CONFIG } from '@/data/config';
import { CHEMI_DATA } from '@/data/index';
import { getIconComponent } from '@/utils';

type CategoryKey = 'all' | PostCategory;

// ============================================================================
// 공통 상수
// ============================================================================
// Mock 테스트 결과 배지 (실제로는 유저 프로필에서 가져옴)
const TEST_BADGES = ['🐕 골든리트리버', '☕ 아메리카노', '😺 츤데레냥', '🐹 활발이'];

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

// 오늘의 주제를 위한 커스텀 훅 (하이드레이션 안전 + 플리커 방지)
function useTodayTopic() {
  const [topic, setTopic] = useState<typeof DAILY_TOPICS[0] | null>(null); // 초기값: null (로딩 중)

  useEffect(() => {
    // 클라이언트에서만 날짜 기반 계산 수행
    const today = new Date();
    const index = (today.getDate() + today.getMonth()) % DAILY_TOPICS.length;
    setTopic(DAILY_TOPICS[index]);
  }, []);

  return topic; // null이면 아직 준비 안됨
}

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
interface CommunitySidebarProps {
  posts: typeof MOCK_COMMUNITY_POSTS;
  onSelectPost: (id: string) => void;
  onCategoryChange: (category: CategoryKey) => void;
}

function CommunitySidebar({ posts, onSelectPost, onCategoryChange }: CommunitySidebarProps) {
  const todayTopic = useTodayTopic();

  // 태그 → 카테고리 매핑 (POST_CATEGORY_LABELS에서 동적 생성)
  const tagToCategoryMap = useMemo(() => {
    return Object.fromEntries(
      Object.entries(POST_CATEGORY_LABELS).map(([key, label]) => [`#${label.replace('/', '')}`, key])
    ) as Record<string, PostCategory>;
  }, []);

  // HOT 게시물 (좋아요 순 TOP 3)
  // 참고: 현재 Mock 데이터(~5개)에서는 full sort가 충분함
  // 대규모 데이터(100+) 시 partial selection 또는 서버 사이드 정렬 권장
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

  // 커뮤니티 통계 (하이드레이션 안전: 날짜 계산은 useEffect로 분리)
  const [todayDateStr, setTodayDateStr] = useState<string>('');
  useEffect(() => {
    setTodayDateStr(new Date().toISOString().split('T')[0]);
  }, []);

  const stats = useMemo(() => ({
    // todayDateStr이 빈 문자열이면 (SSR/초기 렌더) 전체 글 수 표시
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
    <aside className="hidden xl:block w-72 flex-shrink-0">
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

// ============================================================================
// 참여 유도 배너
// ============================================================================
function EngagementBanner() {
  const todayTopic = useTodayTopic();

  // 로딩 중일 때는 스켈레톤 표시 (플리커 방지)
  if (!todayTopic) {
    return (
      <div className="bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-2xl p-4 border border-amber-100 mb-4 animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-200 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-amber-100 rounded w-20" />
            <div className="h-5 bg-amber-100 rounded w-48" />
          </div>
          <div className="w-24 h-10 bg-amber-200 rounded-xl" />
        </div>
      </div>
    );
  }

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

  // 빈 ID 가드: ID가 없거나 빈 문자열이면 첫 번째 배지 사용
  const badgeIndex = post.id?.length > 0
    ? post.id.charCodeAt(post.id.length - 1) % TEST_BADGES.length
    : 0;
  const randomBadge = TEST_BADGES[badgeIndex];

  return (
    <button
      onClick={onClick}
      className="w-full bg-slate-50 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all text-left group relative overflow-hidden"
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="검색어를 입력하세요"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-10 py-2.5 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 transition-all outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-gray-400" />
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
              )}
            </div>

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
