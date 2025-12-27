'use client';

import { BADGE_THRESHOLDS } from '@/config';

interface MinorityVoteBadgeProps {
  percentage: number; // 해당 옵션의 투표 비율
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

/**
 * 소수 의견 표시 배지
 * BADGE_THRESHOLDS.MINORITY_OPINION (30%) 미만일 때만 표시
 */
export default function MinorityVoteBadge({
  percentage,
  showLabel = true,
  size = 'md',
}: MinorityVoteBadgeProps) {
  // 임계값 이상이면 표시하지 않음
  if (percentage >= BADGE_THRESHOLDS.MINORITY_OPINION) return null;

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
  };

  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 rounded-full font-medium ${sizeClasses[size]}`}
    >
      <span>🦄</span>
      {showLabel && <span>소수 의견</span>}
    </span>
  );
}

/**
 * 투표 결과에 소수 의견 표시 추가
 */
export function VoteResultWithMinority({
  optionText,
  percentage,
  isSelected,
}: {
  optionText: string;
  percentage: number;
  isSelected: boolean;
}) {
  const isMinority = percentage < BADGE_THRESHOLDS.MINORITY_OPINION;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${isSelected
          ? 'bg-indigo-100 border-2 border-indigo-500'
          : 'bg-slate-50 border border-slate-200'
        }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-sm">{optionText}</span>
        {isMinority && isSelected && (
          <MinorityVoteBadge percentage={percentage} size="sm" />
        )}
      </div>
      <span className="text-sm font-medium text-slate-600">
        {percentage.toFixed(1)}%
      </span>
    </div>
  );
}
