'use client';

import { ChevronRight, Trophy, Users, Flame } from 'lucide-react';
import {
  CAT_BREED_TOURNAMENT,
  RAMEN_WORLDCUP,
  VALUES_WORLDCUP,
  IDEALTYPE_CONDITIONS_WORLDCUP,
  MBTI_WORLDCUP,
  type Tournament,
} from '@/app/dashboard/data/dashboard-tournaments';

interface TournamentCardsProps {
  onTournamentClick?: (tournamentId: string) => void;
  className?: string;
}

// 활성화된 토너먼트 목록
const ACTIVE_TOURNAMENTS: Tournament[] = [
  CAT_BREED_TOURNAMENT,
  RAMEN_WORLDCUP,
  VALUES_WORLDCUP,
  IDEALTYPE_CONDITIONS_WORLDCUP,
  MBTI_WORLDCUP,
];

export default function TournamentCards({ onTournamentClick, className = '' }: TournamentCardsProps) {
  if (ACTIVE_TOURNAMENTS.length === 0) return null;

  return (
    <div className={`bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-5 border border-amber-100/50 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-800">이상형 월드컵</h3>
            <p className="text-sm text-slate-500">1:1 대결로 나의 최애를 찾아보세요!</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-amber-600 bg-amber-100 px-2.5 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5" />
          <span>{ACTIVE_TOURNAMENTS.length}개</span>
        </div>
      </div>

      {/* 토너먼트 카드 그리드 */}
      <div className="grid grid-cols-2 gap-2.5">
        {ACTIVE_TOURNAMENTS.slice(0, 4).map((tournament) => (
          <button
            key={tournament.id}
            onClick={() => onTournamentClick?.(tournament.id)}
            className={`p-3.5 ${tournament.themeColor} rounded-xl border border-white/50 hover:shadow-md transition-all text-left group`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{tournament.emoji}</span>
              <span className="text-sm font-bold text-slate-700 line-clamp-1">
                {tournament.title}
              </span>
            </div>
            <p className="text-sm text-slate-500 line-clamp-1 mb-2.5">
              {tournament.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-sm text-slate-400">
                <Users className="w-3.5 h-3.5" />
                <span>{tournament.roundSize}강</span>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* 더보기 (5개 이상일 때) */}
      {ACTIVE_TOURNAMENTS.length > 4 && (
        <button
          onClick={() => onTournamentClick?.('all')}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 text-sm font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
        >
          전체 월드컵 보기 ({ACTIVE_TOURNAMENTS.length}개)
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
