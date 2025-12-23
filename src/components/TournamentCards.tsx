'use client';

import { ChevronRight, Trophy, Users, Flame } from 'lucide-react';
import {
  CAT_BREED_TOURNAMENT,
  RAMEN_WORLDCUP,
  VALUES_WORLDCUP,
  IDEALTYPE_CONDITIONS_WORLDCUP,
  MBTI_WORLDCUP,
  type Tournament,
} from '@/app/dashboard/data/tournament-sample';

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
    <div className={`bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl p-4 border border-amber-100/50 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center">
            <Trophy className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">이상형 월드컵</h3>
            <p className="text-xs text-slate-500">1:1 대결로 나의 최애를 찾아보세요!</p>
          </div>
        </div>
        <div className="flex items-center gap-1 text-xs text-amber-600 bg-amber-100 px-2 py-1 rounded-full">
          <Flame className="w-3 h-3" />
          <span>{ACTIVE_TOURNAMENTS.length}개</span>
        </div>
      </div>

      {/* 토너먼트 카드 그리드 */}
      <div className="grid grid-cols-2 gap-2">
        {ACTIVE_TOURNAMENTS.slice(0, 4).map((tournament) => (
          <button
            key={tournament.id}
            onClick={() => onTournamentClick?.(tournament.id)}
            className={`p-3 ${tournament.themeColor} rounded-xl border border-white/50 hover:shadow-md transition-all text-left group`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-lg">{tournament.emoji}</span>
              <span className="text-xs font-bold text-slate-700 line-clamp-1">
                {tournament.title}
              </span>
            </div>
            <p className="text-xs text-slate-500 line-clamp-1 mb-2">
              {tournament.description}
            </p>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-xs text-slate-400">
                <Users className="w-3 h-3" />
                <span>{tournament.roundSize}강</span>
              </div>
              <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        ))}
      </div>

      {/* 더보기 (5개 이상일 때) */}
      {ACTIVE_TOURNAMENTS.length > 4 && (
        <button
          onClick={() => onTournamentClick?.('all')}
          className="w-full mt-3 flex items-center justify-center gap-1 py-2 text-xs font-medium text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors"
        >
          전체 월드컵 보기 ({ACTIVE_TOURNAMENTS.length}개)
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
