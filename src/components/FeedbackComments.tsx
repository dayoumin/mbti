'use client';

import React, { useState, useEffect } from 'react';
import { MessageCircle, ThumbsUp, ThumbsDown, ChevronDown, ChevronUp } from 'lucide-react';
import { tursoService, type FeedbackComment } from '../services/TursoService';
import { formatRelativeTime } from '@/utils/format';

interface FeedbackCommentsProps {
  testType: string;
  resultName?: string;
  maxDisplay?: number;
}

export default function FeedbackComments({ testType, resultName, maxDisplay = 5 }: FeedbackCommentsProps) {
  const [comments, setComments] = useState<FeedbackComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      setIsLoading(true);
      const data = await tursoService.getComments(testType, resultName, 20);
      if (!cancelled) {
        setComments(data);
        setIsLoading(false);
      }
    }

    loadComments();
    return () => { cancelled = true; };
  }, [testType, resultName]);

  if (isLoading) {
    return (
      <div className="w-full p-4 bg-slate-50 rounded-xl animate-pulse">
        <div className="h-4 bg-slate-200 rounded w-1/3 mb-3"></div>
        <div className="space-y-2">
          <div className="h-12 bg-slate-200 rounded"></div>
          <div className="h-12 bg-slate-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (comments.length === 0) {
    return null;
  }

  const displayComments = isExpanded ? comments : comments.slice(0, maxDisplay);
  const hasMore = comments.length > maxDisplay;

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-3">
        <MessageCircle className="w-4 h-4 text-slate-500" />
        <span className="text-sm font-bold text-slate-700">
          다른 분들의 의견 ({comments.length})
        </span>
      </div>

      <div className="space-y-2">
        {displayComments.map((comment) => (
          <div
            key={comment.id}
            className="p-3 bg-white rounded-lg border border-slate-200 shadow-sm"
          >
            <div className="flex items-start gap-2">
              <div className={`mt-0.5 p-1 rounded-full ${
                comment.isAccurate
                  ? 'bg-emerald-100 text-emerald-600'
                  : 'bg-rose-100 text-rose-500'
              }`}>
                {comment.isAccurate
                  ? <ThumbsUp className="w-3 h-3" />
                  : <ThumbsDown className="w-3 h-3" />
                }
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                    {comment.resultName}
                  </span>
                  <span className="text-xs text-slate-400">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-slate-700 break-words">
                  {comment.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full mt-2 py-2 text-sm text-slate-500 hover:text-slate-700 flex items-center justify-center gap-1 transition-colors"
        >
          {isExpanded ? (
            <>
              <ChevronUp className="w-4 h-4" />
              접기
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" />
              더보기 ({comments.length - maxDisplay}개)
            </>
          )}
        </button>
      )}
    </div>
  );
}
