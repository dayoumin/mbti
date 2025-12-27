'use client';

import { useState, useEffect } from 'react';
import { Trophy, Flame, BarChart3 } from 'lucide-react';
import { insightService, type UserActivityStats } from '@/services/InsightService';
import { STREAK_BONUS } from '@/data/gamification/points';

// ============================================================================
// 타입
// ============================================================================

interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
}

// ============================================================================
// ActivitySection 컴포넌트
// ============================================================================

export default function ActivitySection() {
  const [stats, setStats] = useState<UserActivityStats | null>(null);
  const [streakInfo, setStreakInfo] = useState<StreakInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // 데이터 로드
  useEffect(() => {
    const loadData = async () => {
      try {
        const activityStats = await insightService.getActivityStats();
        setStats(activityStats);

        // 스트릭 정보 (임시 - 실제로는 별도 서비스 필요)
        // TODO: GamificationService에서 실제 스트릭 데이터 가져오기
        setStreakInfo({
          currentStreak: 0,
          longestStreak: 0,
          lastActivityDate: null,
        });
      } catch (error) {
        console.error('Failed to load activity stats:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 다음 스트릭 보너스 계산
  const getNextStreakBonus = (current: number): { days: number; bonus: number } | null => {
    const streakDays = Object.keys(STREAK_BONUS).map(Number).sort((a, b) => a - b);
    for (const days of streakDays) {
      if (current < days) {
        return { days, bonus: STREAK_BONUS[days as keyof typeof STREAK_BONUS] };
      }
    }
    return null;
  };

  if (loading) {
    return (
      <section className="bg-slate-50 rounded-2xl p-4 md:p-6">
        <div className="animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-32 mb-4" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
            <div className="h-24 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </section>
    );
  }

  const nextBonus = streakInfo ? getNextStreakBonus(streakInfo.currentStreak) : null;

  return (
    <section className="bg-slate-50 rounded-2xl p-4 md:p-6">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-4">
        <BarChart3 className="w-5 h-5 text-indigo-500" />
        <h2 className="font-bold text-gray-900">활동 & 경쟁</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 랭킹 카드 */}
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-medium text-amber-800">나의 랭킹</span>
          </div>

          {stats && stats.testCount > 0 ? (
            <div className="text-center">
              <p className="text-3xl font-bold text-amber-600 mb-1">
                {stats.testCount}개
              </p>
              <p className="text-xs text-amber-700">테스트 완료</p>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-amber-600">아직 테스트가 없어요</p>
            </div>
          )}
        </div>

        {/* 스트릭 카드 */}
        <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Flame className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">연속 참여</span>
          </div>

          {streakInfo && streakInfo.currentStreak > 0 ? (
            <div>
              <div className="text-center mb-2">
                <p className="text-3xl font-bold text-orange-600">
                  {streakInfo.currentStreak}일
                </p>
                <p className="text-xs text-orange-700">연속 참여 중</p>
              </div>

              {nextBonus && (
                <div className="bg-slate-50/50 rounded-lg px-2 py-1 text-center">
                  <p className="text-xs text-orange-600">
                    {nextBonus.days}일 달성 시 +{nextBonus.bonus}P
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-orange-600">오늘 첫 활동을 해보세요!</p>
              <p className="text-xs text-orange-500 mt-1">
                3일 연속 시 +{STREAK_BONUS[3]}P
              </p>
            </div>
          )}
        </div>

        {/* 활동 통계 카드 */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-800">활동 현황</span>
          </div>

          {stats ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">테스트</span>
                <span className="text-sm font-medium text-gray-800">{stats.testCount}회</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">퀴즈</span>
                <span className="text-sm font-medium text-gray-800">{stats.quizCount}회</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">투표</span>
                <span className="text-sm font-medium text-gray-800">{stats.pollCount}회</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-sm text-blue-600">활동 기록이 없어요</p>
            </div>
          )}
        </div>
      </div>

      {/* 스트릭 마일스톤 */}
      {streakInfo && streakInfo.currentStreak > 0 && (
        <div className="mt-4 bg-gray-50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-2">스트릭 마일스톤</p>
          <div className="flex items-center gap-2">
            {Object.entries(STREAK_BONUS).slice(0, 4).map(([days, bonus]) => {
              const dayNum = parseInt(days);
              const achieved = streakInfo.currentStreak >= dayNum;

              return (
                <div
                  key={days}
                  className={`flex-1 text-center py-1 px-2 rounded-lg ${achieved
                    ? 'bg-orange-100 text-orange-700'
                    : 'bg-gray-100 text-gray-400'
                    }`}
                >
                  <p className="text-xs font-medium">{days}일</p>
                  <p className="text-[10px]">+{bonus}P</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
