'use client';

import { MessageCircle, Send } from 'lucide-react';
import { Comment } from './hooks/useComments';
import { formatRelativeTime } from '@/utils/format';

interface CommentViewProps {
  comments: Comment[];
  commentLoading: boolean;
  commentInput: string;
  setCommentInput: (value: string) => void;
  submitting: boolean;
  error?: Error | null;
  onSubmit: () => void;
}

export default function CommentView({
  comments,
  commentLoading,
  commentInput,
  setCommentInput,
  submitting,
  error,
  onSubmit,
}: CommentViewProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* 댓글 목록 */}
      <div className="flex-1 overflow-y-auto p-4">
        {commentLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 bg-gray-100 rounded-xl"></div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageCircle className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 text-sm font-medium mb-1">아직 댓글이 없어요</p>
            <p className="text-gray-400 text-xs">첫 번째 댓글을 남겨보세요!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-400">
                    익명#{comment.authorId.slice(0, 4)}{comment.isOwner && ' (나)'}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{comment.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 댓글 입력 */}
      <div className="p-4 border-t border-gray-100 flex-shrink-0">
        {error && (
          <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs text-red-600">{error.message}</p>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="댓글을 입력하세요..."
            className="flex-1 px-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300"
            disabled={submitting}
            maxLength={500}
          />
          <button
            onClick={onSubmit}
            disabled={!commentInput.trim() || submitting}
            className="w-10 h-10 bg-gradient-to-r from-orange-500 to-rose-500 text-white rounded-xl flex items-center justify-center hover:from-orange-600 hover:to-rose-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-1 text-right">
          {commentInput.length}/500
        </p>
      </div>
    </div>
  );
}
