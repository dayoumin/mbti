'use client';

import { Users, MessageCircle } from 'lucide-react';
import { PollRankingItem } from './hooks/useRankingData';
import { getCategoryName } from '@/data/constants/rankings';

interface PollRankingTabProps {
  pollRankings: PollRankingItem[];
  loading: boolean;
  onPollClick: (pollId: string, question: string) => void;
}

// 순위 뱃지 스타일
const getRankBadgeStyle = (idx: number): string => {
  if (idx === 0) return 'bg-amber-400 text-white';
  if (idx === 1) return 'bg-gray-400 text-white';
  if (idx === 2) return 'bg-orange-400 text-white';
  return 'bg-gray-200 text-gray-600';
};

export default function PollRankingTab({
  pollRankings,
  loading,
  onPollClick,
}: PollRankingTabProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3 p-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (pollRankings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm p-4">
        아직 투표 데이터가 없어요
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {pollRankings.map((poll, idx) => (
        <div
          key={poll.pollId}
          onClick={() => onPollClick(poll.pollId, poll.question)}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-orange-50 transition-all group cursor-pointer"
        >
          {/* 순위 */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${getRankBadgeStyle(idx)}`}>
            {idx + 1}
          </div>

          {/* 정보 */}
          <div className="flex-1 min-w-0 text-left">
            <p className="text-sm font-bold text-gray-800 truncate group-hover:text-orange-600 transition-colors">
              {poll.question}
            </p>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <span className="text-xs text-gray-400">{getCategoryName(poll.category)}</span>
              {poll.topOption && (
                <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full">
                  {poll.topOption.emoji} {poll.topOption.text} {poll.topOption.percentage}%
                </span>
              )}
            </div>
          </div>

          {/* 참여수 */}
          <div className="text-right flex-shrink-0">
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="w-3 h-3" />
              <span className="text-xs font-bold">{poll.totalVotes}</span>
            </div>
          </div>

          {/* 댓글 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPollClick(poll.pollId, poll.question);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-200 hover:bg-orange-200 text-gray-600 hover:text-orange-600 transition-colors flex-shrink-0"
          >
            <MessageCircle className="w-3 h-3" />
            <span className="text-xs font-medium">{poll.commentCount || 0}</span>
          </button>
        </div>
      ))}
    </div>
  );
}
