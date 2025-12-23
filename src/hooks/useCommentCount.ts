'use client';

import { useState, useEffect } from 'react';

interface UseCommentCountOptions {
  targetType: 'quiz' | 'poll' | 'test_result' | 'ranking';
  targetId: string;
}

/**
 * 댓글 수 조회 hook
 * - 투표/퀴즈 전에도 댓글 수를 미리 표시하기 위함
 */
export function useCommentCount({ targetType, targetId }: UseCommentCountOptions) {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchCount = async () => {
      setIsLoading(true);
      try {
        // limit=1로 최소한의 데이터만 가져옴 (total만 필요)
        const res = await fetch(
          `/api/comments?targetType=${targetType}&targetId=${encodeURIComponent(targetId)}&limit=1`
        );
        if (res.ok && !cancelled) {
          const data = await res.json();
          setCount(data.total || 0);
        }
      } catch {
        // 실패해도 무시 (0으로 표시)
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    fetchCount();

    return () => {
      cancelled = true;
    };
  }, [targetType, targetId]);

  return { count, isLoading };
}
