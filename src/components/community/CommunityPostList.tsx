'use client';

import { useState, useEffect } from 'react';
import { Heart, MessageCircle, Flame, PenSquare, Sparkles } from 'lucide-react';
import { getPostCategoryLabel, getPostCategoryStyle } from '@/data/content/community';
import type { MOCK_COMMUNITY_POSTS } from '@/data/content/community';

// ============================================================================
// 공통 상수
// ============================================================================

// Mock 테스트 결과 배지
const TEST_BADGES = ['🐕 골든리트리버', '☕ 아메리카노', '😺 츤데레냥', '🐹 활발이'];

// 오늘의 토론 주제
const DAILY_TOPICS = [
  { question: "집사들의 가장 큰 고민은?", emoji: "🤔", tags: ["#고민상담", "#집사일상"] },
  { question: "우리 아이 첫 만남 에피소드", emoji: "💕", tags: ["#첫만남", "#추억"] },
  { question: "요즘 핫한 간식 추천해주세요!", emoji: "🍖", tags: ["#간식추천", "#먹방"] },
  { question: "여름철 털 관리 꿀팁", emoji: "☀️", tags: ["#여름", "#털관리"] },
  { question: "반려동물과 여행 가본 곳", emoji: "✈️", tags: ["#여행", "#펫프렌들리"] },
];

// 오늘의 주제 훅
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
// EngagementBanner - 참여 유도 배너
// ============================================================================

function EngagementBanner() {
  const todayTopic = useTodayTopic();

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
// PostCard - 게시물 카드
// ============================================================================

interface PostCardProps {
  post: typeof MOCK_COMMUNITY_POSTS[0];
  onClick: () => void;
}

function PostCard({ post, onClick }: PostCardProps) {
  const isHot = post.likes >= 50 || post.comments >= 20;

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

      {/* 헤더 */}
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

      {/* 하단 */}
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

        <span className="text-xs font-medium text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
          {randomBadge}
        </span>
      </div>
    </button>
  );
}

// ============================================================================
// CommunityPostList Props
// ============================================================================

interface CommunityPostListProps {
  posts: typeof MOCK_COMMUNITY_POSTS;
  onPostClick: (postId: string) => void;
  showEngagementBanner?: boolean;
}

// ============================================================================
// CommunityPostList - 게시글 목록
// ============================================================================

export default function CommunityPostList({ posts, onPostClick, showEngagementBanner = true }: CommunityPostListProps) {
  return (
    <div className="flex-1 min-w-0 space-y-3">
      {/* 참여 유도 배너 */}
      {showEngagementBanner && <EngagementBanner />}

      {/* Post List */}
      {posts.map(post => (
        <PostCard
          key={post.id}
          post={post}
          onClick={() => onPostClick(post.id)}
        />
      ))}

      {posts.length === 0 && (
        <div className="py-20 text-center text-slate-400 bg-slate-50 rounded-2xl">
          <p className="text-sm font-medium">게시글이 없습니다</p>
        </div>
      )}
    </div>
  );
}
