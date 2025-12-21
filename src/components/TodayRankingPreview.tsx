'use client';

import { useState, useEffect } from 'react';
import { ChevronRight, Flame, Users } from 'lucide-react';
import { tursoService } from '@/services/TursoService';
import { VS_POLLS } from '@/data/content/polls';

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
  const [topPolls, setTopPolls] = useState<TopPollItem[]>([]);
  const [totalParticipants, setTotalParticipants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTopPolls = async () => {
      try {
        const pollStats = await Promise.all(
          VS_POLLS.map(async (poll) => {
            const stats = await tursoService.getPollStats(poll.id);
            return {
              pollId: poll.id,
              question: poll.question,
              totalVotes: stats.totalVotes,
            };
          })
        );

        const sorted = pollStats
          .filter(p => p.totalVotes > 0)
          .sort((a, b) => b.totalVotes - a.totalVotes);

        setTopPolls(sorted.slice(0, 3));

        const total = pollStats.reduce((sum, p) => sum + p.totalVotes, 0);
        setTotalParticipants(total);
      } catch (error) {
        console.error('[TodayRankingPreview] 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadTopPolls();
  }, []);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl p-3 shadow-sm border border-slate-100 animate-pulse ${className}`}>
        <div className="h-10 bg-slate-100 rounded-lg"></div>
      </div>
    );
  }

  if (topPolls.length === 0 && totalParticipants === 0) {
    return null;
  }

  return (
    <button
      onClick={onClick}
      className={`w-full bg-gradient-to-r from-orange-50 to-rose-50 rounded-2xl p-4 shadow-sm border border-orange-100 hover:shadow-md hover:border-orange-200 transition-all group ${className}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        {/* 헤더 섹션 */}
        <div className="flex items-center gap-3 lg:border-r lg:border-orange-200 lg:pr-6 whitespace-nowrap">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-rose-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md transform group-hover:rotate-12 transition-transform">
            <Flame className="w-6 h-6 text-white" />
          </div>
          <div className="text-left">
            <h3 className="text-base font-black text-orange-700">오늘의 랭킹</h3>
            <p className="text-xs text-orange-500 font-bold flex items-center gap-1">
              <Users className="w-2.5 h-2.5" />
              {totalParticipants.toLocaleString()}명 참여 중
            </p>
          </div>
        </div>

        {/* 랭킹 아이템들 */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {topPolls.map((poll, index) => (
            <div key={poll.pollId} className={`flex items-center gap-2 p-2 rounded-lg bg-white/50 border border-white/60 ${index >= 1 ? 'hidden md:flex' : ''} ${index >= 2 ? 'hidden lg:flex' : ''}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black ${index === 0 ? 'bg-amber-400 text-white' :
                  index === 1 ? 'bg-slate-300 text-white' :
                    'bg-orange-200 text-orange-700'
                }`}>
                {index + 1}
              </span>
              <p className="text-xs text-slate-700 font-bold truncate flex-1 text-left">
                {poll.question}
              </p>
            </div>
          ))}
          {/* 폴백: 데이터가 1개뿐일 때 나머지를 채우거나 숨김 */}
        </div>

        {/* 더보기 버튼 (PC전용) */}
        <div className="hidden lg:flex items-center gap-1 text-orange-400 group-hover:text-orange-600 font-bold transition-colors">
          <span className="text-xs">더보기</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </button>
  );
}
