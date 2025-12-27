'use client';

import { TrendingUp, Flame } from 'lucide-react';
import type { KnowledgeQuiz, VSPoll } from '@/data/content/types';
import { getCategoryInfo } from '@/data/content/categories';
import type { ContentParticipationData } from '@/services/ContentParticipationService';

interface HotTopicItemProps {
  rank: number;
  emoji: string;
  title: string;
  type: 'quiz' | 'poll';
  stat: string;
  onClick?: () => void;
}

function HotTopicItem({ rank, emoji, title, type, stat, onClick }: HotTopicItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-subtle hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
    >
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${rank === 1 ? 'bg-amber-400 text-white' :
        rank === 2 ? 'bg-slate-300 text-white' :
          'bg-orange-200 text-orange-700'
        }`}>
        {rank}
      </span>
      <span className="text-lg">{emoji}</span>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-bold text-secondary truncate group-hover:text-orange-600">
          {title}
        </p>
        <p className="text-xs text-muted">
          {type === 'quiz' ? '퀴즈' : '투표'} · {stat}
        </p>
      </div>
      <TrendingUp className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

interface HotTopicsSectionProps {
  quizzes: KnowledgeQuiz[];
  polls: VSPoll[];
  participation: ContentParticipationData;
  onQuizClick: (quizId: string) => void;
  onPollClick: (pollId: string) => void;
}

export default function HotTopicsSection({ quizzes, polls, participation, onQuizClick, onPollClick }: HotTopicsSectionProps) {
  // 인기도 계산 (결정론적 - ID 기반)
  const getPopularityScore = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % 1000;
  };

  // 아직 참여하지 않은 것 중에서 인기순 정렬
  const uncompletedQuizzes = quizzes
    .filter(q => !participation.quizzes.some(pq => pq.quizId === q.id))
    .map(q => ({ ...q, popularity: getPopularityScore(q.id) }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 2);

  const uncompletedPolls = polls
    .filter(p => !participation.polls.some(pp => pp.pollId === p.id))
    .map(p => ({ ...p, popularity: getPopularityScore(p.id) }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 2);

  // 퀴즈와 투표를 섞어서 상위 3개 선택
  const hotItems = [...uncompletedQuizzes.map(q => ({
    id: q.id,
    type: 'quiz' as const,
    title: q.question,
    emoji: getCategoryInfo(q.category).emoji,
    stat: `정답률 ${30 + (getPopularityScore(q.id) % 40)}%`,
    popularity: q.popularity,
  })), ...uncompletedPolls.map(p => ({
    id: p.id,
    type: 'poll' as const,
    title: p.question,
    emoji: getCategoryInfo(p.category).emoji,
    stat: `${100 + (getPopularityScore(p.id) % 900)}명 참여`,
    popularity: p.popularity,
  }))]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  if (hotItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Flame className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">지금 인기</h3>
        <span className="text-xs text-slate-400">참여하지 않은 콘텐츠 중</span>
      </div>
      <div className="space-y-2">
        {hotItems.map((item, index) => (
          <HotTopicItem
            key={item.id}
            rank={index + 1}
            emoji={item.emoji}
            title={item.title}
            type={item.type}
            stat={item.stat}
            onClick={() => item.type === 'quiz' ? onQuizClick(item.id) : onPollClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
