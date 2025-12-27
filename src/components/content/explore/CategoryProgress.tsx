'use client';

import { useMemo } from 'react';
import { Trophy } from 'lucide-react';
import type { KnowledgeQuiz, VSPoll } from '@/data/content/types';
import { getCategoryInfo } from '@/data/content/categories';
import type { ContentParticipationData } from '@/services/ContentParticipationService';

interface CategoryProgressProps {
  quizzes: KnowledgeQuiz[];
  polls: VSPoll[];
  participation: ContentParticipationData;
  activeTab: 'quiz' | 'poll';
  onCategoryClick: (category: string) => void;
}

export default function CategoryProgress({ quizzes, polls, participation, activeTab, onCategoryClick }: CategoryProgressProps) {
  const categoryStats = useMemo(() => {
    if (activeTab === 'quiz') {
      // O(n) - 참여한 퀴즈 ID Set 생성
      const completedIds = new Set(participation.quizzes.map(pq => pq.quizId));

      // O(n) - 카테고리별 통계를 한 번의 순회로 집계
      const statsMap = new Map<string, { total: number; completed: number }>();
      for (const quiz of quizzes) {
        const stat = statsMap.get(quiz.category) || { total: 0, completed: 0 };
        stat.total++;
        if (completedIds.has(quiz.id)) stat.completed++;
        statsMap.set(quiz.category, stat);
      }

      return Array.from(statsMap.entries()).map(([category, { total, completed }]) => ({
        category,
        label: getCategoryInfo(category),
        total,
        completed,
        percent: Math.round((completed / total) * 100),
      }));
    } else {
      // O(n) - 참여한 투표 ID Set 생성
      const completedIds = new Set(participation.polls.map(pp => pp.pollId));

      // O(n) - 카테고리별 통계를 한 번의 순회로 집계
      const statsMap = new Map<string, { total: number; completed: number }>();
      for (const poll of polls) {
        const stat = statsMap.get(poll.category) || { total: 0, completed: 0 };
        stat.total++;
        if (completedIds.has(poll.id)) stat.completed++;
        statsMap.set(poll.category, stat);
      }

      return Array.from(statsMap.entries()).map(([category, { total, completed }]) => ({
        category,
        label: getCategoryInfo(category),
        total,
        completed,
        percent: Math.round((completed / total) * 100),
      }));
    }
  }, [quizzes, polls, participation, activeTab]);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Trophy className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">카테고리별 진행률</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categoryStats.map(({ category, label, total, completed, percent }) => (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
            className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{label?.emoji}</span>
              <span className="text-xs font-bold text-slate-600 truncate">{label?.name}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{completed}/{total}</span>
              {percent === 100 && (
                <span className="text-xs text-emerald-500 font-bold">완료!</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
