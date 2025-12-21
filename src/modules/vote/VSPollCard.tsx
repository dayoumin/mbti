'use client';

import { useState } from 'react';
import { Vote, ChevronRight, ChevronDown } from 'lucide-react';
import { VSPoll } from './types';
import { getStablePollResults } from './utils';

interface VSPollCardProps {
  poll: VSPoll;
  onVote?: (pollId: string, choice: 'a' | 'b') => void;
  isExpanded?: boolean;
  onToggle?: () => void;
  isVoted?: boolean;
  previousVote?: 'a' | 'b' | null;
}

export default function VSPollCard({
  poll,
  onVote,
  isExpanded = false,
  onToggle,
  isVoted = false,
  previousVote = null
}: VSPollCardProps) {
  const [localVoted, setLocalVoted] = useState<'a' | 'b' | null>(null);

  if (!poll) return null;

  const voted = previousVote ?? localVoted;
  const results = getStablePollResults(poll.id);

  const handleVote = (choice: 'a' | 'b') => {
    if (voted) return;
    setLocalVoted(choice);
    onVote?.(poll.id, choice);
  };

  // 컴팩트 모드 (접힌 상태)
  if (!isExpanded) {
    return (
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100 hover:border-purple-200 transition-all group"
      >
        <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <Vote className="w-4 h-4 text-purple-500" />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-purple-500 block">VS 투표</span>
            {(isVoted || voted) && (
              <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                완료
              </span>
            )}
          </div>
          <p className="text-xs font-medium text-slate-600 truncate">
            {poll.optionA.text} vs {poll.optionB.text}
          </p>
        </div>
        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
      </button>
    );
  }

  // 펼쳐진 상태
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 text-purple-500" />
          <span className="text-xs font-bold text-purple-600">VS 투표</span>
          {(isVoted || voted) && (
            <span className="text-xs font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
              완료
            </span>
          )}
        </div>
        {onToggle && (
          <button onClick={onToggle} className="p-1 hover:bg-purple-100 rounded-lg transition-colors">
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        )}
      </div>
      <p className="text-xs font-bold text-slate-700 mb-3 text-center">{poll.question}</p>

      <div className="flex gap-2">
        {/* 옵션 A */}
        <button
          onClick={() => handleVote('a')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-lg border-2 transition-all ${
            voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-slate-200 bg-slate-50' :
            'border-purple-200 bg-white hover:border-purple-300'
          }`}
        >
          <div className="p-2 text-center relative z-10">
            <span className="text-xl block">{poll.optionA.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionA.text}</span>
            {voted && <div className="text-sm font-black text-purple-600">{results.a}%</div>}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-purple-200/50 transition-all duration-500"
              style={{ height: `${results.a}%` }}
            />
          )}
        </button>

        {/* VS 구분선 */}
        <div className="flex items-center">
          <span className="text-xs font-black text-slate-400">VS</span>
        </div>

        {/* 옵션 B */}
        <button
          onClick={() => handleVote('b')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-lg border-2 transition-all ${
            voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-slate-200 bg-slate-50' :
            'border-pink-200 bg-white hover:border-pink-300'
          }`}
        >
          <div className="p-2 text-center relative z-10">
            <span className="text-xl block">{poll.optionB.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionB.text}</span>
            {voted && <div className="text-sm font-black text-pink-600">{results.b}%</div>}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-pink-200/50 transition-all duration-500"
              style={{ height: `${results.b}%` }}
            />
          )}
        </button>
      </div>

      {(voted || isVoted) && (
        <p className="text-center text-xs text-slate-400 mt-2">참여 완료!</p>
      )}
    </div>
  );
}
