'use client';

import { ChevronRight } from 'lucide-react';
import { ContentWidgetContainer } from './content';

interface DailyContentCardsProps {
  onExploreMore?: () => void;
  className?: string;
}

export default function DailyContentCards({ onExploreMore, className = '' }: DailyContentCardsProps) {
  return (
    <section className={`${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-bold text-slate-700">오늘의 참여</span>
        {onExploreMore && (
          <button
            onClick={onExploreMore}
            className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-0.5"
          >
            더보기
            <ChevronRight className="w-3 h-3" />
          </button>
        )}
      </div>

      <ContentWidgetContainer
        variant="full"
        onExploreMore={onExploreMore}
      />
    </section>
  );
}
