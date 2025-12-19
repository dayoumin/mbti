'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Heart, Users, Plus, ChevronRight } from 'lucide-react';
import { formatRelativeTime } from '@/utils/format';
import CreatePollModal from './CreatePollModal';

interface UserPoll {
  id: string;
  question: string;
  optionA: { text: string; emoji: string };
  optionB: { text: string; emoji: string };
  category: string;
  status: string;
  createdAt: string;
  voteCount: number;
  likeCount: number;
  score?: number;
}

interface PopularPollsProps {
  className?: string;
  limit?: number;
  showCreateButton?: boolean;
}

export default function PopularPolls({
  className = '',
  limit = 5,
  showCreateButton = true,
}: PopularPollsProps) {
  const [polls, setPolls] = useState<UserPoll[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const loadPolls = useCallback(async () => {
    try {
      const res = await fetch(`/api/poll?action=popular&limit=${limit}`);
      if (res.ok) {
        const data = await res.json();
        setPolls(data.polls || []);
      }
    } catch (error) {
      console.error('[PopularPolls] Load error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    loadPolls();
  }, [loadPolls]);

  const handlePollCreated = () => {
    loadPolls(); // 새로고침
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ${className}`}>
        <div className="animate-pulse space-y-3">
          <div className="h-5 bg-slate-200 rounded w-1/3" />
          <div className="h-16 bg-slate-100 rounded-xl" />
          <div className="h-16 bg-slate-100 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={`bg-white rounded-2xl p-4 shadow-sm border border-slate-100 ${className}`}>
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-r from-orange-100 to-rose-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-orange-500" />
            </div>
            <span className="text-xs font-bold text-orange-600">인기 투표</span>
          </div>
          {showCreateButton && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-1 px-2.5 py-1 bg-purple-100 hover:bg-purple-200 text-purple-600 text-xs font-bold rounded-full transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              만들기
            </button>
          )}
        </div>

        {/* 투표 목록 */}
        {polls.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-sm text-slate-400 mb-3">아직 인기 투표가 없어요</p>
            {showCreateButton && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold rounded-full"
              >
                <Plus className="w-4 h-4" />
                첫 번째 투표 만들기
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {polls.map((poll, index) => (
              <PollItem key={poll.id} poll={poll} rank={index + 1} />
            ))}
          </div>
        )}
      </div>

      {/* 투표 만들기 모달 */}
      <CreatePollModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={handlePollCreated}
      />
    </>
  );
}

interface PollItemProps {
  poll: UserPoll;
  rank: number;
}

function PollItem({ poll, rank }: PollItemProps) {
  const rankEmoji = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;

  return (
    <div className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer group">
      <div className="flex items-start gap-2">
        {/* 순위 */}
        <span className="text-lg min-w-[24px] text-center">{rankEmoji}</span>

        {/* 내용 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-800 truncate group-hover:text-purple-600 transition-colors">
            {poll.question}
          </p>
          <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
            {/* 선택지 미리보기 */}
            <span className="truncate max-w-[100px]">
              {poll.optionA.emoji} {poll.optionA.text}
            </span>
            <span className="text-slate-300">vs</span>
            <span className="truncate max-w-[100px]">
              {poll.optionB.emoji} {poll.optionB.text}
            </span>
          </div>
        </div>

        {/* 통계 */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="flex items-center gap-0.5">
            <Users className="w-3 h-3" />
            {poll.voteCount}
          </span>
          <span className="flex items-center gap-0.5">
            <Heart className="w-3 h-3" />
            {poll.likeCount}
          </span>
          <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
}
