'use client';

import { Flame, Zap, CheckCircle } from 'lucide-react';

interface StreakBannerProps {
  currentStreak: number;
  longestStreak: number;
  hasParticipatedToday: boolean;
}

export default function StreakBanner({ currentStreak, longestStreak, hasParticipatedToday }: StreakBannerProps) {
  if (currentStreak === 0 && !hasParticipatedToday) {
    return (
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-4 mb-4 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-600">오늘 첫 참여를 시작하세요!</p>
            <p className="text-xs text-slate-400">퀴즈나 투표에 참여하면 스트릭이 시작됩니다</p>
          </div>
          <Zap className="w-5 h-5 text-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-4 mb-4 ${hasParticipatedToday
      ? 'bg-gradient-to-r from-orange-500 to-amber-500'
      : 'bg-gradient-to-r from-orange-400 to-amber-400'
      }`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-50/20 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔥</span>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{currentStreak}</span>
            <span className="text-sm font-bold text-white/80">일 연속 참여!</span>
          </div>
          <p className="text-xs text-white/70">
            {hasParticipatedToday
              ? '오늘도 참여 완료!'
              : '오늘 참여하면 스트릭이 이어집니다'}
            {longestStreak > currentStreak && ` · 최고 기록: ${longestStreak}일`}
          </p>
        </div>
        {hasParticipatedToday && (
          <div className="w-8 h-8 bg-slate-50/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}
