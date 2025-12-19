'use client';

import { ContentWidgetContainer } from './content';

interface DailyContentCardsProps {
  className?: string;
}

export default function DailyContentCards({ className = '' }: DailyContentCardsProps) {
  return (
    <section className={className}>
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="text-sm font-bold text-slate-700">오늘의 참여</span>
      </div>

      <ContentWidgetContainer />
    </section>
  );
}
