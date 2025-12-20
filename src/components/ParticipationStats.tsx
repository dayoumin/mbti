'use client';

import { useEffect, useState } from 'react';
import { getParticipationBridge, type ParticipationSummary } from '@/services/ParticipationBridge';
import { getContentCategoryInfo } from '@/data/content/categories';

interface ParticipationStatsProps {
  className?: string;
  compact?: boolean;
}

export default function ParticipationStats({
  className = '',
  compact = false,
}: ParticipationStatsProps) {
  const [stats, setStats] = useState<ParticipationSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const bridge = getParticipationBridge();
      if (bridge) {
        const summary = await bridge.getParticipationSummary();
        setStats(summary);
      }
      setLoading(false);
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <div className={`animate-pulse bg-gray-100 rounded-xl h-24 ${className}`} />
    );
  }

  if (!stats) return null;

  if (compact) {
    return (
      <div className={`flex items-center gap-4 ${className}`}>
        <StatBadge emoji="🗳️" value={stats.polls.total} label="투표" />
        <StatBadge emoji="🧠" value={stats.quizzes.total} label="퀴즈" />
        <StatBadge emoji="🏅" value={stats.badges.total} label="배지" />
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-4 ${className}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-3">나의 참여 현황</h3>

      <div className="grid grid-cols-3 gap-4">
        {/* 투표 통계 */}
        <div className="text-center">
          <div className="text-2xl mb-1">🗳️</div>
          <div className="text-xl font-bold text-gray-900">{stats.polls.total}</div>
          <div className="text-xs text-gray-500">투표 참여</div>
          {stats.polls.minorityRatio > 0 && (
            <div className="text-xs text-purple-600 mt-1">
              🦄 {stats.polls.minorityRatio}% 소수파
            </div>
          )}
        </div>

        {/* 퀴즈 통계 */}
        <div className="text-center">
          <div className="text-2xl mb-1">🧠</div>
          <div className="text-xl font-bold text-gray-900">{stats.quizzes.total}</div>
          <div className="text-xs text-gray-500">퀴즈 도전</div>
          {stats.quizzes.correctRate > 0 && (
            <div className="text-xs text-green-600 mt-1">
              ✓ {stats.quizzes.correctRate}% 정답률
            </div>
          )}
        </div>

        {/* 배지 통계 */}
        <div className="text-center">
          <div className="text-2xl mb-1">🏅</div>
          <div className="text-xl font-bold text-gray-900">{stats.badges.total}</div>
          <div className="text-xs text-gray-500">획득 배지</div>
          {stats.badges.recent.length > 0 && (
            <div className="text-xs text-yellow-600 mt-1">
              최근 +{stats.badges.recent.length}
            </div>
          )}
        </div>
      </div>

      {/* 상위 관심 카테고리 */}
      {stats.polls.topCategories.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500 mb-2">관심 카테고리</div>
          <div className="flex gap-2">
            {stats.polls.topCategories.map(({ category, count }) => (
              <CategoryTag key={category} category={category} count={count} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatBadge({
  emoji,
  value,
  label,
}: {
  emoji: string;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
      <span>{emoji}</span>
      <span className="font-medium text-gray-900">{value}</span>
      <span className="text-xs text-gray-500">{label}</span>
    </div>
  );
}

function CategoryTag({ category, count }: { category: string; count: number }) {
  const { emoji, label } = getContentCategoryInfo(category);

  return (
    <span className="inline-flex items-center gap-1 bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
      <span>{emoji}</span>
      <span>{label}</span>
      <span className="text-indigo-500">({count})</span>
    </span>
  );
}
