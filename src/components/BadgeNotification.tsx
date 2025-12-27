'use client';

import { useEffect, useState, useCallback } from 'react';
import { getBadgeById } from '@/data/gamification/badges';

interface BadgeNotificationProps {
  badgeId: string;
  onClose: () => void;
  autoCloseDelay?: number; // ms
}

export default function BadgeNotification({
  badgeId,
  onClose,
  autoCloseDelay = 5000,
}: BadgeNotificationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  const badge = getBadgeById(badgeId);

  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  useEffect(() => {
    // 진입 애니메이션
    const enterTimer = setTimeout(() => setIsVisible(true), 50);

    // 자동 닫기
    const closeTimer = setTimeout(() => {
      handleClose();
    }, autoCloseDelay);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
    };
  }, [autoCloseDelay, handleClose]);

  if (!badge) return null;

  const rarityColors = {
    common: 'from-gray-400 to-gray-500',
    uncommon: 'from-green-400 to-green-600',
    rare: 'from-blue-400 to-blue-600',
    epic: 'from-purple-400 to-purple-600',
    legendary: 'from-yellow-400 to-orange-500',
  };

  const rarityLabels = {
    common: '일반',
    uncommon: '고급',
    rare: '레어',
    epic: '에픽',
    legendary: '전설',
  };

  return (
    <div
      className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 ${isVisible && !isExiting
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-4'
        }`}
    >
      <div
        className={`bg-gradient-to-r ${rarityColors[badge.rarity]} p-[2px] rounded-2xl shadow-2xl`}
        onClick={handleClose}
      >
        <div className="bg-slate-50 rounded-2xl px-6 py-4 flex items-center gap-4">
          {/* 배지 아이콘 */}
          <div className="relative">
            <div className="w-16 h-16 flex items-center justify-center text-4xl bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full animate-pulse">
              {badge.emoji}
            </div>
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center text-xs">
              ✨
            </div>
          </div>

          {/* 배지 정보 */}
          <div className="flex flex-col">
            <span className="text-xs font-medium text-muted uppercase tracking-wide">
              배지 획득!
            </span>
            <span className="text-lg font-bold text-primary">
              {badge.name}
            </span>
            <span className="text-sm text-secondary">
              {badge.description}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`text-xs font-medium px-2 py-0.5 rounded-full bg-gradient-to-r ${rarityColors[badge.rarity]} text-white`}
              >
                {rarityLabels[badge.rarity]}
              </span>
              <span className="text-xs text-yellow-600 font-medium">
                +{badge.points}P
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
