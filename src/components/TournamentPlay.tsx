'use client';

import { useState, useMemo, useEffect } from 'react';
import { ChevronLeft, Trophy, Share2, RotateCcw, Crown, Medal, Award } from 'lucide-react';
import {
  CAT_BREED_TOURNAMENT,
  RAMEN_WORLDCUP,
  VALUES_WORLDCUP,
  IDEALTYPE_CONDITIONS_WORLDCUP,
  MBTI_WORLDCUP,
  type Tournament,
  type TournamentContestant,
} from '@/app/dashboard/data/dashboard-tournaments';

// ============================================================================
// Types
// ============================================================================

interface TournamentPlayProps {
  tournamentId: string;
  onBack: () => void;
  onComplete?: (winnerId: string, rankings: string[]) => void;
}

interface MatchState {
  round: number;           // 현재 라운드 (16, 8, 4, 2, 1)
  matchIndex: number;      // 현재 대결 인덱스
  contestants: TournamentContestant[];  // 현재 라운드 참가자들
  winner: TournamentContestant | null;  // 최종 우승자
  rankings: TournamentContestant[];     // 순위 기록 (탈락 순서 역순)
}

// ============================================================================
// 토너먼트 목록
// ============================================================================

const TOURNAMENTS: Record<string, Tournament> = {
  'cat-breed-worldcup-v1': CAT_BREED_TOURNAMENT,
  'ramen-worldcup-v1': RAMEN_WORLDCUP,
  'values-worldcup-v1': VALUES_WORLDCUP,
  'idealtype-conditions-worldcup-v1': IDEALTYPE_CONDITIONS_WORLDCUP,
  'mbti-worldcup-v1': MBTI_WORLDCUP,
};

// ============================================================================
// Shuffle 유틸
// ============================================================================

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// ============================================================================
// 라운드 이름
// ============================================================================

function getRoundName(round: number): string {
  if (round === 2) return '결승';
  if (round === 4) return '준결승';
  return `${round}강`;
}

// ============================================================================
// Component
// ============================================================================

export default function TournamentPlay({ tournamentId, onBack, onComplete }: TournamentPlayProps) {
  const tournament = TOURNAMENTS[tournamentId];

  // 토너먼트가 없으면 에러 표시
  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-slate-500 mb-4">토너먼트를 찾을 수 없습니다.</p>
          <button onClick={onBack} className="text-indigo-600 font-medium">
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 셔플된 참가자로 시작
  const shuffledContestants = useMemo(
    () => shuffleArray(tournament.contestants.slice(0, tournament.roundSize)),
    [tournament]
  );

  const [matchState, setMatchState] = useState<MatchState>({
    round: tournament.roundSize,
    matchIndex: 0,
    contestants: shuffledContestants,
    winner: null,
    rankings: [],
  });

  const [isAnimating, setIsAnimating] = useState(false);
  const [selectedSide, setSelectedSide] = useState<'left' | 'right' | null>(null);

  // 현재 대결 참가자
  const currentPair = useMemo(() => {
    const idx = matchState.matchIndex * 2;
    return {
      left: matchState.contestants[idx],
      right: matchState.contestants[idx + 1],
    };
  }, [matchState.contestants, matchState.matchIndex]);

  // 진행률
  const totalMatches = tournament.roundSize - 1; // 16강 = 15경기
  const completedMatches = useMemo(() => {
    let completed = 0;
    let round = tournament.roundSize;
    while (round > matchState.round) {
      completed += round / 2;
      round = round / 2;
    }
    completed += matchState.matchIndex;
    return completed;
  }, [tournament.roundSize, matchState.round, matchState.matchIndex]);

  const progress = Math.round((completedMatches / totalMatches) * 100);

  // 선택 핸들러
  const handleSelect = (side: 'left' | 'right') => {
    if (isAnimating || matchState.winner) return;

    setSelectedSide(side);
    setIsAnimating(true);

    const winner = side === 'left' ? currentPair.left : currentPair.right;
    const loser = side === 'left' ? currentPair.right : currentPair.left;

    setTimeout(() => {
      setMatchState(prev => {
        const newWinners = [...prev.contestants.slice(0, prev.matchIndex * 2), winner];
        const nextMatchIndex = prev.matchIndex + 1;
        const matchesInRound = prev.round / 2;

        // 현재 라운드 끝?
        if (nextMatchIndex >= matchesInRound) {
          // 다음 라운드로
          const nextRound = prev.round / 2;

          // 결승 끝?
          if (nextRound < 2) {
            return {
              ...prev,
              winner: winner,
              rankings: [winner, loser, ...prev.rankings],
            };
          }

          // 다음 라운드 준비
          const winnersOfRound = [...newWinners.slice(prev.contestants.length - matchesInRound), winner];
          return {
            round: nextRound,
            matchIndex: 0,
            contestants: winnersOfRound,
            winner: null,
            rankings: [loser, ...prev.rankings],
          };
        }

        // 같은 라운드 다음 대결
        return {
          ...prev,
          matchIndex: nextMatchIndex,
          contestants: [...prev.contestants.slice(0, nextMatchIndex * 2), winner, ...prev.contestants.slice(nextMatchIndex * 2)],
          rankings: [loser, ...prev.rankings],
        };
      });

      setSelectedSide(null);
      setIsAnimating(false);
    }, 400);
  };

  // 다시하기
  const handleRestart = () => {
    const newShuffled = shuffleArray(tournament.contestants.slice(0, tournament.roundSize));
    setMatchState({
      round: tournament.roundSize,
      matchIndex: 0,
      contestants: newShuffled,
      winner: null,
      rankings: [],
    });
  };

  // 결과 화면
  if (matchState.winner) {
    const rankings = matchState.rankings;

    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* 헤더 */}
        <div className="sticky top-0 z-10 bg-slate-50/80 backdrop-blur-sm border-b border-amber-100">
          <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <button onClick={onBack} className="p-2 -ml-2 text-slate-600">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <span className="font-bold text-slate-800">{tournament.title}</span>
            <button className="p-2 -mr-2 text-slate-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 결과 */}
        <div className="max-w-lg mx-auto px-4 py-8">
          {/* 우승자 */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <Trophy className="w-4 h-4" />
              우승
            </div>
            <div className={`w-32 h-32 mx-auto ${tournament.themeColor} rounded-full flex items-center justify-center text-6xl mb-4 shadow-lg ring-4 ring-amber-300`}>
              {matchState.winner.emoji}
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {matchState.winner.name}
            </h2>
            <p className="text-slate-600">{matchState.winner.description}</p>
            {matchState.winner.funFact && (
              <p className="mt-4 text-sm text-amber-700 bg-amber-50 p-3 rounded-xl">
                💡 {matchState.winner.funFact}
              </p>
            )}
          </div>

          {/* 순위 */}
          <div className="bg-slate-50 rounded-2xl p-4 shadow-sm mb-6">
            <h3 className="font-bold text-slate-800 mb-3">🏆 최종 순위</h3>
            <div className="space-y-2">
              {rankings.slice(0, 4).map((contestant, idx) => (
                <div
                  key={contestant.id}
                  className={`flex items-center gap-3 p-2 rounded-xl ${idx === 0 ? 'bg-amber-50' : idx === 1 ? 'bg-slate-50' : idx === 2 ? 'bg-orange-50' : 'bg-slate-50'
                    }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${idx === 0 ? 'bg-amber-200 text-amber-700' :
                    idx === 1 ? 'bg-slate-200 text-slate-600' :
                      idx === 2 ? 'bg-orange-200 text-orange-700' :
                        'bg-slate-100 text-slate-500'
                    }`}>
                    {idx === 0 ? <Crown className="w-4 h-4" /> :
                      idx === 1 ? <Medal className="w-4 h-4" /> :
                        idx === 2 ? <Award className="w-4 h-4" /> :
                          <span className="text-xs font-bold">{idx + 1}</span>}
                  </div>
                  <span className="text-xl">{contestant.emoji}</span>
                  <span className="font-medium text-slate-700">{contestant.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="flex gap-3">
            <button
              onClick={handleRestart}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              다시하기
            </button>
            <button
              onClick={onBack}
              className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl font-medium text-white hover:from-amber-600 hover:to-orange-600 transition-colors"
            >
              돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 대결 화면
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* 헤더 */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <button onClick={onBack} className="p-2 -ml-2 text-white/70 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="text-center">
              <span className="text-white font-bold">{tournament.title}</span>
              <div className="text-amber-400 text-sm font-medium">{getRoundName(matchState.round)}</div>
            </div>
            <div className="w-9" />
          </div>

          {/* 진행 바 */}
          <div className="h-1 bg-slate-50/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* VS 대결 */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="text-center text-white/50 text-sm mb-4">
          {matchState.matchIndex + 1} / {matchState.round / 2}
        </div>

        <div className="relative">
          {/* VS 뱃지 */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-orange-500 rounded-full flex items-center justify-center shadow-lg shadow-red-500/30">
              <span className="text-white font-black text-lg">VS</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Left */}
            <button
              onClick={() => handleSelect('left')}
              disabled={isAnimating}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 ${selectedSide === 'left'
                ? 'scale-105 ring-4 ring-amber-400'
                : selectedSide === 'right'
                  ? 'scale-95 opacity-50'
                  : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              <div className={`absolute inset-0 ${tournament.themeColor} opacity-90`} />
              <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                <span className="text-5xl mb-3">{currentPair.left?.emoji}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2">
                  {currentPair.left?.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {currentPair.left?.description}
                </p>
              </div>
            </button>

            {/* Right */}
            <button
              onClick={() => handleSelect('right')}
              disabled={isAnimating}
              className={`relative aspect-[3/4] rounded-2xl overflow-hidden transition-all duration-300 ${selectedSide === 'right'
                ? 'scale-105 ring-4 ring-amber-400'
                : selectedSide === 'left'
                  ? 'scale-95 opacity-50'
                  : 'hover:scale-[1.02] active:scale-[0.98]'
                }`}
            >
              <div className={`absolute inset-0 ${tournament.themeColor} opacity-90`} />
              <div className="relative h-full flex flex-col items-center justify-center p-4 text-center">
                <span className="text-5xl mb-3">{currentPair.right?.emoji}</span>
                <h3 className="text-lg font-bold text-slate-800 mb-1 line-clamp-2">
                  {currentPair.right?.name}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2">
                  {currentPair.right?.description}
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* 안내 */}
        <p className="text-center text-white/40 text-sm mt-6">
          더 좋아하는 쪽을 선택하세요!
        </p>
      </div>
    </div>
  );
}
