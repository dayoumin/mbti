'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MessageCircle, Heart, ChevronDown, ChevronUp, Send, Reply } from 'lucide-react';
import { formatRelativeTime } from '@/utils/format';
import { getDeviceId } from '@/utils/device';

// ========== 상수 ==========

const LIKE_STORAGE_KEY = 'chemi_comment_likes';

// ========== 타입 정의 ==========

export interface Comment {
  id: number;
  deviceId: string;
  content: string;
  likes: number;
  parentId: number | null;
  createdAt: string;
  // UI 상태
  replies?: Comment[];
  showReplies?: boolean;
}

export interface CommentSystemProps {
  targetType: 'poll' | 'quiz' | 'test_result' | 'ranking';
  targetId: string;
  /** 작성자 배지 (예: "🐱 도도한 집사") */
  userBadge?: string;
  /** 최대 표시 댓글 수 (더보기로 확장) */
  maxDisplay?: number;
  /** 댓글 작성 placeholder */
  placeholder?: string;
}

// ========== 배지 생성 유틸 ==========

const ANONYMOUS_BADGES = [
  '🌟 익명의 탐험가',
  '🎯 호기심 가득',
  '💫 신비로운 분',
  '🌈 무지개 여행자',
  '🎪 숨은 관찰자',
  '🎭 미스터리 게스트',
  '🎨 색다른 시선',
  '🎵 리듬감 있는',
];

function getAnonymousBadge(deviceId: string): string {
  // deviceId 해시로 일관된 배지 선택
  const hash = deviceId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ANONYMOUS_BADGES[hash % ANONYMOUS_BADGES.length];
}

function shortenDeviceId(deviceId: string): string {
  // anon_1234567890_xxx -> 익명#7890
  const match = deviceId.match(/_(\d{4})\d*_/);
  if (match) return `익명#${match[1]}`;
  return `익명#${deviceId.slice(-4)}`;
}

// ========== 좋아요 상태 로컬 저장 (서버 동기화 보완) ==========

function loadLikedComments(): Set<number> {
  if (typeof window === 'undefined') return new Set();
  try {
    const stored = localStorage.getItem(LIKE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return new Set(Array.isArray(parsed) ? parsed : []);
    }
  } catch {
    // ignore
  }
  return new Set();
}

function saveLikedComments(liked: Set<number>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LIKE_STORAGE_KEY, JSON.stringify([...liked]));
  } catch {
    // ignore
  }
}

// ========== 메인 컴포넌트 ==========

export default function CommentSystem({
  targetType,
  targetId,
  userBadge,
  maxDisplay = 5,
  placeholder = '의견을 남겨주세요...',
}: CommentSystemProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [deviceId, setDeviceId] = useState<string>('');
  const [isReady, setIsReady] = useState(false); // deviceId 준비 상태
  const [likedComments, setLikedComments] = useState<Set<number>>(new Set());

  const replyInputRef = useRef<HTMLInputElement>(null);

  // 디바이스 ID 및 좋아요 상태 초기화
  useEffect(() => {
    const id = getDeviceId();
    setDeviceId(id);
    setLikedComments(loadLikedComments());
    setIsReady(true);
  }, []);

  // 댓글 로드
  const loadComments = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(
        `/api/comments?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}&limit=50`
      );
      const data = await res.json();

      if (data.comments) {
        // 대댓글 구조화
        const rootComments: Comment[] = [];
        const replyMap = new Map<number, Comment[]>();

        data.comments.forEach((c: Comment) => {
          if (c.parentId) {
            const replies = replyMap.get(c.parentId) || [];
            replies.push(c);
            replyMap.set(c.parentId, replies);
          } else {
            rootComments.push({ ...c, replies: [], showReplies: false });
          }
        });

        // 답글 연결
        rootComments.forEach(c => {
          c.replies = replyMap.get(c.id) || [];
        });

        // 최신순 정렬 (답글은 오래된 순)
        rootComments.sort((a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        rootComments.forEach(c => {
          c.replies?.sort((a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });

        setComments(rootComments);
        setTotalCount(data.total);
      }
    } catch (error) {
      console.error('[CommentSystem] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [targetType, targetId]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  // 댓글 작성
  const handleSubmit = async (parentId?: number) => {
    const content = parentId ? replyContent : newComment;
    if (!content.trim() || isSubmitting || !isReady || !deviceId) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          targetType,
          targetId,
          content: content.trim(),
          parentId: parentId || null,
        }),
      });

      if (res.ok) {
        if (parentId) {
          setReplyContent('');
          setReplyingTo(null);
        } else {
          setNewComment('');
        }
        await loadComments();
      } else {
        setSubmitError('댓글 등록에 실패했어요. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('[CommentSystem] Submit error:', error);
      setSubmitError('네트워크 오류가 발생했어요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 좋아요 토글
  const handleLike = async (commentId: number) => {
    if (!deviceId || !isReady) return;

    // Optimistic UI
    const wasLiked = likedComments.has(commentId);

    const updateLikedState = (add: boolean) => {
      setLikedComments(prev => {
        const next = new Set(prev);
        if (add) next.add(commentId);
        else next.delete(commentId);
        saveLikedComments(next); // localStorage에 저장
        return next;
      });
    };

    // 낙관적 업데이트
    updateLikedState(!wasLiked);
    setComments(prev => updateCommentLikes(prev, commentId, wasLiked ? -1 : 1));

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId,
          targetType: 'comment',
          targetId: commentId.toString(),
        }),
      });

      if (!res.ok) {
        // 실패 시 롤백
        updateLikedState(wasLiked);
        setComments(prev => updateCommentLikes(prev, commentId, wasLiked ? 1 : -1));
      } else {
        // 성공 시 서버 응답 확인하여 상태 동기화
        const data = await res.json();
        if (data.liked !== undefined && data.liked !== !wasLiked) {
          // 서버 상태와 불일치 시 서버 상태로 동기화
          updateLikedState(data.liked);
        }
      }
    } catch (error) {
      console.error('[CommentSystem] Like error:', error);
      // 네트워크 오류 시 롤백
      updateLikedState(wasLiked);
      setComments(prev => updateCommentLikes(prev, commentId, wasLiked ? 1 : -1));
    }
  };

  // 댓글 likes 업데이트 헬퍼
  const updateCommentLikes = (comments: Comment[], commentId: number, delta: number): Comment[] => {
    return comments.map(c => {
      if (c.id === commentId) {
        return { ...c, likes: Math.max(0, (c.likes || 0) + delta) };
      }
      if (c.replies) {
        return { ...c, replies: updateCommentLikes(c.replies, commentId, delta) };
      }
      return c;
    });
  };

  // 답글 토글
  const toggleReplies = (commentId: number) => {
    setComments(prev => prev.map(c =>
      c.id === commentId ? { ...c, showReplies: !c.showReplies } : c
    ));
  };

  // 답글 입력창 열기
  const openReplyInput = (commentId: number) => {
    setReplyingTo(commentId);
    setReplyContent('');
    setTimeout(() => replyInputRef.current?.focus(), 100);
  };

  // 표시할 댓글
  const displayComments = isExpanded ? comments : comments.slice(0, maxDisplay);
  const hasMore = comments.length > maxDisplay;
  const rootCount = comments.length;

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="w-full p-4 bg-slate-50 rounded-xl animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
        <div className="space-y-2">
          <div className="h-16 bg-slate-200 rounded"></div>
          <div className="h-16 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* 헤더 */}
      <div className="flex items-center gap-2">
        <MessageCircle className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-bold text-slate-700">
          댓글 {totalCount > 0 && `(${totalCount})`}
        </span>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <input
            type="text"
            value={newComment}
            onChange={(e) => {
              setNewComment(e.target.value);
              if (submitError) setSubmitError(null);
            }}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit()}
            placeholder={isReady ? placeholder : '준비 중...'}
            maxLength={500}
            disabled={!isReady}
            className="w-full px-4 py-2.5 pr-12 bg-white border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all disabled:bg-slate-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={() => handleSubmit()}
            disabled={!newComment.trim() || isSubmitting || !isReady}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-blue-500 hover:bg-blue-50 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 에러 메시지 */}
      {submitError && (
        <div className="text-xs text-rose-500 bg-rose-50 px-3 py-2 rounded-lg">
          {submitError}
        </div>
      )}

      {/* 내 배지 표시 */}
      {userBadge && (
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <span className="bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 px-2 py-0.5 rounded-full">
            {userBadge}
          </span>
          <span>로 댓글이 표시돼요</span>
        </div>
      )}

      {/* 댓글 목록 */}
      {comments.length === 0 ? (
        <div className="text-center py-8 text-slate-400 text-sm">
          아직 댓글이 없어요. 첫 번째로 의견을 남겨보세요!
        </div>
      ) : (
        <div className="space-y-3">
          {displayComments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              deviceId={deviceId}
              userBadge={userBadge}
              liked={likedComments.has(comment.id)}
              onLike={handleLike}
              onReply={openReplyInput}
              onToggleReplies={toggleReplies}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={handleSubmit}
              replyInputRef={replyInputRef}
              isSubmitting={isSubmitting}
              likedComments={likedComments}
            />
          ))}
        </div>
      )}

      {/* 더보기 버튼 */}
      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              접기
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              더보기 ({rootCount - maxDisplay}개)
            </>
          )}
        </button>
      )}
    </div>
  );
}

// ========== 댓글 아이템 컴포넌트 ==========

interface CommentItemProps {
  comment: Comment;
  deviceId: string;
  userBadge?: string;
  liked: boolean;
  onLike: (id: number) => void;
  onReply: (id: number) => void;
  onToggleReplies: (id: number) => void;
  replyingTo: number | null;
  replyContent: string;
  setReplyContent: (v: string) => void;
  onSubmitReply: (parentId: number) => void;
  replyInputRef: React.RefObject<HTMLInputElement | null>;
  isSubmitting: boolean;
  likedComments: Set<number>;
  isReply?: boolean;
}

function CommentItem({
  comment,
  deviceId,
  userBadge,
  liked,
  onLike,
  onReply,
  onToggleReplies,
  replyingTo,
  replyContent,
  setReplyContent,
  onSubmitReply,
  replyInputRef,
  isSubmitting,
  likedComments,
  isReply = false,
}: CommentItemProps) {
  const isOwnComment = comment.deviceId === deviceId;
  const badge = isOwnComment && userBadge ? userBadge : getAnonymousBadge(comment.deviceId);
  const displayName = shortenDeviceId(comment.deviceId);
  const replyCount = comment.replies?.length || 0;

  return (
    <div className={`${isReply ? 'ml-8 border-l-2 border-slate-100 pl-3' : ''}`}>
      <div className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
        {/* 헤더: 배지 + 이름 + 시간 */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            isOwnComment
              ? 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700'
              : 'bg-slate-100 text-slate-600'
          }`}>
            {badge}
          </span>
          <span className="text-xs text-slate-400">{displayName}</span>
          <span className="text-xs text-slate-300">·</span>
          <span className="text-xs text-slate-400">{formatRelativeTime(comment.createdAt)}</span>
          {isOwnComment && (
            <span className="text-xs text-blue-500 font-medium ml-auto">나</span>
          )}
        </div>

        {/* 내용 */}
        <p className="text-sm text-slate-700 break-words mb-2">
          {comment.content}
        </p>

        {/* 액션 버튼 */}
        <div className="flex items-center gap-4 text-xs">
          {/* 좋아요 */}
          <button
            onClick={() => onLike(comment.id)}
            className={`flex items-center gap-1 transition-colors ${
              liked
                ? 'text-rose-500'
                : 'text-slate-400 hover:text-rose-400'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
            <span>{comment.likes || 0}</span>
          </button>

          {/* 답글 (루트 댓글만) */}
          {!isReply && (
            <button
              onClick={() => onReply(comment.id)}
              className="flex items-center gap-1 text-slate-400 hover:text-blue-500 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              <span>답글</span>
            </button>
          )}

          {/* 답글 펼치기 */}
          {!isReply && replyCount > 0 && (
            <button
              onClick={() => onToggleReplies(comment.id)}
              className="flex items-center gap-1 text-blue-500 hover:text-blue-600 transition-colors"
            >
              {comment.showReplies ? (
                <>
                  <ChevronUp className="w-3.5 h-3.5" />
                  <span>답글 숨기기</span>
                </>
              ) : (
                <>
                  <ChevronDown className="w-3.5 h-3.5" />
                  <span>답글 {replyCount}개 보기</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* 답글 입력창 */}
      {!isReply && replyingTo === comment.id && (
        <div className="mt-2 ml-8 flex gap-2">
          <input
            ref={replyInputRef}
            type="text"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && onSubmitReply(comment.id)}
            placeholder="답글을 입력하세요..."
            maxLength={500}
            className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/30"
          />
          <button
            onClick={() => onSubmitReply(comment.id)}
            disabled={!replyContent.trim() || isSubmitting}
            className="px-3 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 답글 목록 */}
      {!isReply && comment.showReplies && comment.replies && comment.replies.length > 0 && (
        <div className="mt-2 space-y-2">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              deviceId={deviceId}
              userBadge={userBadge}
              liked={likedComments.has(reply.id)}
              onLike={onLike}
              onReply={onReply}
              onToggleReplies={onToggleReplies}
              replyingTo={replyingTo}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              onSubmitReply={onSubmitReply}
              replyInputRef={replyInputRef}
              isSubmitting={isSubmitting}
              likedComments={likedComments}
              isReply={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
