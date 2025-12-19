'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Flame, Users } from 'lucide-react';
import { feedbackService } from '@/services/FeedbackService';
import { VS_POLLS } from '@/data/content/polls/vs-polls';

interface TopPollItem {
  pollId: string;
  question: string;
  totalVotes: number;
}

interface TodayRankingPreviewProps {
  onClick: () => void;
  className?: string;
}

export default function TodayRankingPreview({ onClick, className = '' }: TodayRankingPreviewProps) {
  const [topPoll, setTopPoll] = useState<TopPollItem | null>(null);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopPoll = async () => {
      try {
        // 투표 통계 로드
        const pollStats = await Promise.all(
          VS_POLLS.map(async (poll) => {
            const stats = await feedbackService.getPollStats(poll.id);
            return {
              pollId: poll.id,
              question: poll.question,
              totalVotes: stats.totalVotes,
            };
          })
        );

        // 1위 투표 찾기
        const sorted = pollStats
          .filter(p => p.totalVotes > 0)
          .sort((a, b) => b.totalVotes - a.totalVotes);

        if (sorted.length > 0) {
          setTopPoll(sorted[0]);
        }

        // 전체 참여자 수
        const total = pollStats.reduce((sum, p) => sum + p.totalVotes, 0);
        setTotalParticipants(total);
      } catch (error) {
        console.error('[TodayRankingPreview] 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopPoll();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-3 shadow-sm border border-gray-100 animate-pulse ${className}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-1"></div>
            <div className="h-3 bg-gray-100 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!topPoll && totalParticipants === 0) {
    return null; // 데이터 없으면 숨김
  }

  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-r from-orange-50 to-rose-50 rounded-xl p-3 shadow-sm border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all group ${className}`}
    >
      <div className="flex items-center gap-3">
        {/* 아이콘 */}
        <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-rose-500 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm">
          <Flame className="w-5 h-5 text-white" />
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-orange-700">오늘의 랭킹</span>
            {totalParticipants > 0 && (
              <span className="text-[10px] bg-orange-100 text-orange-600 px-1.5 py-0.5 rounded-full font-medium flex items-center gap-0.5">
                <Users className="w-2.5 h-2.5" />
                {totalParticipants}
              </span>
            )}
          </div>
          {topPoll && (
            <p className="text-xs text-gray-600 truncate mt-0.5">
              <span className="text-amber-500">🏆</span> {topPoll.question}
            </p>
          )}
        </div>

        {/* 화살표 */}
        <div className="flex items-center gap-1 text-orange-400 group-hover:text-orange-600 transition-colors flex-shrink-0">
          <span className="text-[10px] font-medium">더보기</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </button>
  );
}
