'use client';

import { useState, useEffect } from 'react';
import {
  Trophy,
  BarChart3,
  Users,
  Calendar,
  TrendingUp,
  Award,
  Clock,
  RefreshCw,
} from 'lucide-react';
import { rankingService, SeasonSummary, CategorySummary } from '@/services';

// ============================================================================
// 컴포넌트
// ============================================================================

export default function RankingStats() {
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardStats, setDashboardStats] = useState<{
    currentSeason: SeasonSummary;
    totalAllTimeVotes: number;
    mostPopularCategory: string | null;
    mostVotedResult: { name: string; emoji: string; votes: number } | null;
    recentActivity: Array<{ date: string; votes: number }>;
  } | null>(null);
  const [categorySummaries, setCategorySummaries] = useState<CategorySummary[]>([]);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const [stats, summaries] = await Promise.all([
        rankingService.getDashboardStats(),
        rankingService.getAllCategorySummaries('quarterly'),
      ]);
      setDashboardStats(stats);
      setCategorySummaries(summaries);
    } catch (error) {
      console.error('[RankingStats] 통계 로드 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();

    // 투표 이벤트 리스너
    const handleVote = () => {
      loadStats();
    };

    window.addEventListener('chemi:rankingVoted', handleVote);
    return () => window.removeEventListener('chemi:rankingVoted', handleVote);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-3" />
          <p className="text-gray-400">통계 로딩 중...</p>
        </div>
      </div>
    );
  }

  if (!dashboardStats) {
    return (
      <div className="text-center py-12 text-gray-500">
        통계 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  const { currentSeason, totalAllTimeVotes, mostPopularCategory, mostVotedResult, recentActivity } = dashboardStats;

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-100 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            랭킹 통계
          </h2>
          <p className="text-sm text-gray-400 mt-1">
            랭킹 투표 데이터 분석 및 인사이트
          </p>
        </div>
        <button
          onClick={loadStats}
          className="px-3 py-1.5 bg-gray-700 rounded-lg text-sm text-gray-300 hover:bg-gray-600 flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          새로고침
        </button>
      </div>

      {/* 현재 시즌 정보 */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-4 border border-indigo-500/30">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-500/20 rounded-full flex items-center justify-center">
            <Calendar className="w-6 h-6 text-indigo-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-indigo-400">{currentSeason.seasonName}</h3>
            <p className="text-sm text-gray-400">
              {currentSeason.startDate} ~ {currentSeason.endDate || '진행중'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-400">{currentSeason.totalVotes}</p>
            <p className="text-xs text-gray-500">총 투표수</p>
          </div>
        </div>
      </div>

      {/* 주요 지표 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span className="text-xs text-gray-500">시즌 투표</span>
          </div>
          <p className="text-2xl font-bold text-amber-400">{currentSeason.totalVotes}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-gray-500">참여자</span>
          </div>
          <p className="text-2xl font-bold text-blue-400">{currentSeason.participantCount}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-500">전체 투표</span>
          </div>
          <p className="text-2xl font-bold text-green-400">{totalAllTimeVotes}</p>
        </div>
        <div className="bg-gray-800/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-gray-500">1위 득표</span>
          </div>
          <div className="flex items-center gap-2">
            {mostVotedResult ? (
              <>
                <span className="text-xl">{mostVotedResult.emoji}</span>
                <span className="text-lg font-bold text-purple-400">{mostVotedResult.votes}</span>
              </>
            ) : (
              <span className="text-gray-500">-</span>
            )}
          </div>
        </div>
      </div>

      {/* 최근 7일 활동 */}
      <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
        <h4 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          최근 7일 투표 현황
        </h4>
        <div className="flex items-end gap-2 h-24">
          {recentActivity.map((day, idx) => {
            const maxVotes = Math.max(...recentActivity.map(d => d.votes), 1);
            const height = (day.votes / maxVotes) * 100;
            return (
              <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-gray-700 rounded-t relative" style={{ height: '80px' }}>
                  <div
                    className={`absolute bottom-0 w-full rounded-t transition-all ${
                      idx === recentActivity.length - 1 ? 'bg-blue-500' : 'bg-blue-500/50'
                    }`}
                    style={{ height: `${height}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(day.date).toLocaleDateString('ko', { weekday: 'short' })}
                </span>
                <span className="text-xs text-gray-400 font-mono">{day.votes}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 인기 카테고리 */}
      {currentSeason.topCategories.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h4 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            인기 랭킹 카테고리 TOP 5
          </h4>
          <div className="space-y-2">
            {currentSeason.topCategories.map((cat, idx) => (
              <div
                key={cat.categoryId}
                className="flex items-center gap-3 p-2 bg-gray-800/50 rounded-lg"
              >
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                  idx === 0 ? 'bg-amber-500 text-white' :
                  idx === 1 ? 'bg-gray-400 text-white' :
                  idx === 2 ? 'bg-orange-500 text-white' :
                  'bg-gray-600 text-gray-300'
                }`}>
                  {idx + 1}
                </span>
                <span className="flex-1 text-gray-300">{cat.categoryName}</span>
                <span className="text-sm text-gray-500">{cat.totalVotes}표</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 카테고리별 상세 통계 */}
      {categorySummaries.length > 0 && (
        <div className="bg-gray-800/30 rounded-xl p-4 border border-gray-700">
          <h4 className="font-bold text-gray-300 mb-4 flex items-center gap-2">
            <Award className="w-4 h-4 text-purple-400" />
            카테고리별 1위
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {categorySummaries
              .filter(s => s.topResults.length > 0)
              .map((summary) => {
                const top = summary.topResults[0];
                return (
                  <div
                    key={summary.categoryId}
                    className="bg-gray-800/50 rounded-lg p-3 text-center"
                  >
                    <p className="text-xs text-gray-500 mb-2">{summary.categoryName}</p>
                    <span className="text-2xl">{top.resultEmoji}</span>
                    <p className="text-sm font-medium text-gray-300 mt-1 line-clamp-1">
                      {top.resultKey}
                    </p>
                    <p className="text-xs text-amber-400">{top.votes}표</p>
                  </div>
                );
              })}
          </div>
        </div>
      )}

      {/* 데이터 없음 안내 */}
      {currentSeason.totalVotes === 0 && (
        <div className="text-center py-8 bg-gray-800/30 rounded-xl border border-gray-700">
          <Trophy className="w-12 h-12 text-gray-600 mx-auto mb-3" />
          <p className="text-gray-400 mb-2">아직 투표 데이터가 없습니다</p>
          <p className="text-sm text-gray-500">
            사용자들이 랭킹에 투표하면 여기에 통계가 표시됩니다
          </p>
        </div>
      )}

      {/* 인사이트 */}
      {currentSeason.totalVotes > 0 && (
        <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-xl p-4 border border-purple-500/30">
          <h4 className="font-bold text-purple-400 mb-3">인사이트</h4>
          <ul className="space-y-2 text-sm text-gray-300">
            {mostPopularCategory && (
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>가장 인기 있는 카테고리는 <strong>{mostPopularCategory}</strong>입니다.</span>
              </li>
            )}
            {mostVotedResult && (
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>
                  {mostVotedResult.emoji} <strong>{mostVotedResult.name}</strong>이(가)
                  {mostVotedResult.votes}표로 가장 많은 지지를 받고 있습니다.
                </span>
              </li>
            )}
            {currentSeason.participantCount > 0 && (
              <li className="flex items-start gap-2">
                <span className="text-purple-400">•</span>
                <span>
                  이번 시즌 {currentSeason.participantCount}명이 참여했으며,
                  인당 평균 {(currentSeason.totalVotes / currentSeason.participantCount).toFixed(1)}회 투표했습니다.
                </span>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
