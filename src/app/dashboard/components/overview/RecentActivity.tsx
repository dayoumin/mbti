'use client';

import { CheckCircle2, RefreshCw } from 'lucide-react';

export default function RecentActivity() {
  const activities = [
    { type: 'add', message: '대시보드 구조 개편 (전략→제품→성장→운영)', time: '2024-12-15' },
    { type: 'add', message: 'perfume, aroma 테스트 추가', time: '2024-12-14' },
    { type: 'add', message: '피드백 댓글 기능 (FeedbackComments)', time: '2024-12-14' },
    { type: 'add', message: 'fruit, alcohol, bread 테스트 추가', time: '2024-12-13' },
    { type: 'add', message: 'petMatch 세부 테스트 6종 추가', time: '2024-12-12' },
    { type: 'update', message: 'ResultFeedback 피드백 수집 기능', time: '2024-12-11' },
  ];

  return (
    <div className="db-card">
      <div className="db-card-header px-5 py-4">
        <h2 className="text-lg font-semibold text-[var(--db-text)]">최근 활동</h2>
      </div>
      <div className="p-5 space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="db-callout flex items-center gap-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: activity.type === 'add' ? 'rgba(124, 255, 138, 0.15)' : 'rgba(122, 162, 255, 0.15)'
              }}
            >
              {activity.type === 'add' ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--db-ok)]" />
              ) : (
                <RefreshCw className="w-4 h-4 text-[var(--db-brand)]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--db-text)]">{activity.message}</p>
              <p className="text-xs text-[var(--db-muted)]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}