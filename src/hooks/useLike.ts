'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getDeviceId } from '@/utils/device';

interface UseLikeOptions {
  targetType: 'quiz' | 'poll' | 'comment';
  targetId: string | number;
}

interface UseLikeReturn {
  liked: boolean;
  likeCount: number;
  handleLike: () => Promise<void>;
  isLoading: boolean;
}

/**
 * 좋아요 기능을 위한 커스텀 훅
 *
 * - 초기 좋아요 상태 로드
 * - 낙관적 업데이트 (Optimistic UI)
 * - 레이스 컨디션 방지
 * - 에러 시 롤백
 */
export function useLike({ targetType, targetId }: UseLikeOptions): UseLikeReturn {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const isLikeInFlight = useRef(false);
  const hasUserInteracted = useRef(false);

  // 좋아요 상태 로드
  useEffect(() => {
    let cancelled = false;
    hasUserInteracted.current = false;

    const loadLikeStatus = async () => {
      setIsLoading(true);
      try {
        const deviceId = getDeviceId();
        const res = await fetch(
          `/api/likes?targetType=${targetType}&targetId=${targetId}&deviceId=${deviceId}`
        );
        if (res.ok && !cancelled && !hasUserInteracted.current) {
          const data = await res.json();
          setLiked(data.liked);
          setLikeCount(data.count);
        }
      } catch {
        // 실패해도 무시
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    // targetId 변경 시 상태 초기화
    setLiked(false);
    setLikeCount(0);
    loadLikeStatus();

    return () => {
      cancelled = true;
    };
  }, [targetType, targetId]);

  // 좋아요 토글
  const handleLike = useCallback(async () => {
    if (isLikeInFlight.current) return;
    isLikeInFlight.current = true;
    hasUserInteracted.current = true;

    const prevLiked = liked;
    const prevCount = likeCount;

    // Optimistic update
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);

    try {
      const res = await fetch('/api/likes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          deviceId: getDeviceId(),
          targetType,
          targetId,
        }),
      });

      if (!res.ok) {
        // 롤백
        setLiked(prevLiked);
        setLikeCount(prevCount);
      }
    } catch {
      // 롤백
      setLiked(prevLiked);
      setLikeCount(prevCount);
    } finally {
      isLikeInFlight.current = false;
    }
  }, [liked, likeCount, targetType, targetId]);

  return { liked, likeCount, handleLike, isLoading };
}
