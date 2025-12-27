import { useState } from 'react';
import { getDeviceId } from '@/utils/device';

// ============================================================================
// 타입 정의
// ============================================================================

export interface Comment {
  id: number;
  authorId: string;  // 해시화된 익명 ID
  isOwner: boolean;  // 본인 댓글 여부
  content: string;
  likes: number;
  createdAt: string;
}

export interface CommentView {
  pollId: string;
  question: string;
}

// ============================================================================
// API 함수들
// ============================================================================

async function getComments(targetType: string, targetId: string, limit = 20, offset = 0): Promise<{ comments: Comment[]; total: number; hasMore: boolean }> {
  try {
    const deviceId = getDeviceId();
    const res = await fetch(`/api/comments?targetType=${targetType}&targetId=${targetId}&limit=${limit}&offset=${offset}&deviceId=${deviceId}`);
    if (!res.ok) return { comments: [], total: 0, hasMore: false };
    return await res.json();
  } catch {
    return { comments: [], total: 0, hasMore: false };
  }
}

async function postComment(targetType: string, targetId: string, content: string): Promise<boolean> {
  try {
    const deviceId = getDeviceId();
    const res = await fetch('/api/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId, targetType, targetId, content }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ============================================================================
// Hook
// ============================================================================

export function useComments(onCommentCountUpdate?: (pollId: string, count: number) => void) {
  const [commentView, setCommentView] = useState<CommentView | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentLoading, setCommentLoading] = useState(false);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [commentTotal, setCommentTotal] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  // 댓글 보기 열기
  const openCommentView = async (pollId: string, question: string) => {
    setCommentView({ pollId, question });
    setCommentLoading(true);
    setComments([]);
    setCommentTotal(0); // 이전 poll의 댓글 수가 잠시 보이는 것 방지
    setError(null);
    try {
      const data = await getComments('poll', pollId);
      setComments(data.comments);
      setCommentTotal(data.total);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('댓글 로드 실패');
      console.error('[useComments] 댓글 로드 실패:', error);
      setError(error);
      setComments([]);
      setCommentTotal(0);
    } finally {
      setCommentLoading(false);
    }
  };

  // 댓글 제출
  const handleSubmitComment = async () => {
    if (!commentView || !commentInput.trim() || submitting) return;

    setSubmitting(true);
    setError(null);
    try {
      const success = await postComment('poll', commentView.pollId, commentInput.trim());
      if (success) {
        // 댓글 목록 새로고침
        const data = await getComments('poll', commentView.pollId);
        setComments(data.comments);
        setCommentTotal(data.total);
        setCommentInput('');

        // 부모 컴포넌트에 댓글 수 업데이트 알림
        if (onCommentCountUpdate) {
          onCommentCountUpdate(commentView.pollId, data.total);
        }
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('댓글 작성 실패');
      console.error('[useComments] 댓글 작성 실패:', error);
      setError(error);
    } finally {
      setSubmitting(false);
    }
  };

  // 댓글 뷰에서 뒤로가기
  const closeCommentView = () => {
    setCommentView(null);
    setComments([]);
    setCommentInput('');
  };

  return {
    commentView,
    comments,
    commentLoading,
    commentInput,
    setCommentInput,
    submitting,
    commentTotal,
    error,
    openCommentView,
    handleSubmitComment,
    closeCommentView,
  };
}
