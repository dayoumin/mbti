import { useState, useEffect } from 'react';
import { tursoService } from '@/services/TursoService';
import { VS_POLLS } from '@/data/content/polls';
import { getCommentCount } from '@/utils/comments';

// ============================================================================
// 타입 정의
// ============================================================================

export interface PollRankingItem {
  pollId: string;
  question: string;
  category: string;
  totalVotes: number;
  topOption: {
    id: string;
    text: string;
    emoji: string;
    percentage: number;
  } | null;
  commentCount: number;
}

export interface ResultRankingItem {
  resultName: string;
  resultEmoji: string;
  testType: string;
  count: number;
}

// ============================================================================
// Hook
// ============================================================================

export function useRankingData(isOpen: boolean) {
  const [pollRankings, setPollRankings] = useState<PollRankingItem[]>([]);
  const [resultRankings, setResultRankings] = useState<ResultRankingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    let isCancelled = false;

    const loadRankings = async () => {
      setLoading(true);
      setError(null);
      try {
        // 투표 랭킹 로드
        const pollStats = await Promise.all(
          VS_POLLS.map(async (poll) => {
            const stats = await tursoService.getPollStats(poll.id);
            const topOption = stats.options.length > 0
              ? stats.options.reduce((a, b) => a.count > b.count ? a : b)
              : null;

            // 댓글 수 로드
            const commentCount = await getCommentCount('poll', poll.id);

            return {
              pollId: poll.id,
              question: poll.question,
              category: poll.category,
              totalVotes: stats.totalVotes,
              topOption: topOption ? {
                id: topOption.optionId,
                text: topOption.optionId === 'a' ? poll.optionA.text : poll.optionB.text,
                emoji: topOption.optionId === 'a' ? poll.optionA.emoji : poll.optionB.emoji,
                percentage: topOption.percentage,
              } : null,
              commentCount,
            };
          })
        );

        if (isCancelled) return;

        // 투표수 순으로 정렬
        const sortedPolls = pollStats
          .filter(p => p.totalVotes > 0)
          .sort((a, b) => b.totalVotes - a.totalVotes)
          .slice(0, 10); // 모달에서는 10개까지

        setPollRankings(sortedPolls);

        // 전체 참여자 수 계산
        const total = pollStats.reduce((sum, p) => sum + p.totalVotes, 0);
        setTotalParticipants(total);

        // 테스트 결과 랭킹 로드 (Turso DB 기반)
        const loadResultRankings = async () => {
          try {
            const res = await fetch('/api/ranking?type=results&limit=10');
            if (!res.ok) throw new Error('Failed to fetch rankings');
            const data = await res.json();

            if (isCancelled) return;
            setResultRankings(data.rankings || []);
          } catch (error) {
            if (isCancelled) return;
            console.error('[useRankingData] 결과 랭킹 로드 실패:', error);
            // DB 실패 시 localStorage 폴백
            try {
              const resultsKey = 'chemi_test_results';
              const results = JSON.parse(localStorage.getItem(resultsKey) || '[]');
              const resultCounts: Record<string, { count: number; emoji: string; testType: string }> = {};

              results.forEach((r: { result_key?: string; result_emoji?: string; test_type?: string }) => {
                const key = r.result_key;
                if (key) {
                  if (!resultCounts[key]) {
                    resultCounts[key] = { count: 0, emoji: r.result_emoji || '📊', testType: r.test_type || '' };
                  }
                  resultCounts[key].count++;
                }
              });

              const sortedResults = Object.entries(resultCounts)
                .map(([name, data]) => ({
                  resultName: name,
                  resultEmoji: data.emoji,
                  testType: data.testType,
                  count: data.count,
                }))
                .sort((a, b) => b.count - a.count)
                .slice(0, 10);

              setResultRankings(sortedResults);
            } catch {
              setResultRankings([]);
            }
          }
        };

        await loadResultRankings();
      } catch (err) {
        if (isCancelled) return;
        const error = err instanceof Error ? err : new Error('랭킹 로드 실패');
        console.error('[useRankingData] 랭킹 로드 실패:', error);
        setError(error);
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    loadRankings();

    return () => {
      isCancelled = true;
    };
  }, [isOpen]);

  return {
    pollRankings,
    resultRankings,
    loading,
    totalParticipants,
    error,
  };
}
