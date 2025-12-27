'use client';

import { TrendingUp } from 'lucide-react';
import { ResultRankingItem } from './hooks/useRankingData';
import { getTestTypeName } from '@/data/constants/rankings';

interface ResultRankingTabProps {
  resultRankings: ResultRankingItem[];
  loading: boolean;
}

// 순위 뱃지 스타일
const getRankBadgeStyle = (idx: number): string => {
  if (idx === 0) return 'bg-amber-400 text-white';
  if (idx === 1) return 'bg-gray-400 text-white';
  if (idx === 2) return 'bg-orange-400 text-white';
  return 'bg-gray-200 text-gray-600';
};

export default function ResultRankingTab({
  resultRankings,
  loading,
}: ResultRankingTabProps) {
  if (loading) {
    return (
      <div className="animate-pulse space-y-3 p-4">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-14 bg-gray-100 rounded-xl"></div>
        ))}
      </div>
    );
  }

  if (resultRankings.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm p-4">
        아직 테스트 결과가 없어요
      </div>
    );
  }

  return (
    <div className="space-y-2 p-4">
      {resultRankings.map((result, idx) => (
        <div
          key={`${result.testType}-${result.resultName}`}
          className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
        >
          {/* 순위 */}
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${getRankBadgeStyle(idx)}`}>
            {idx + 1}
          </div>

          {/* 이모지 */}
          <span className="text-2xl flex-shrink-0">{result.resultEmoji}</span>

          {/* 정보 */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-800 truncate">
              {result.resultName}
            </p>
            <span className="text-xs text-gray-400">
              {getTestTypeName(result.testType)} 테스트
            </span>
          </div>

          {/* 카운트 */}
          <div className="flex items-center gap-1 text-orange-500 flex-shrink-0">
            <TrendingUp className="w-3 h-3" />
            <span className="text-xs font-bold">{result.count}회</span>
          </div>
        </div>
      ))}
    </div>
  );
}
