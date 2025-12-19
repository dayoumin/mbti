'use client';

import { Check, MessageCircle } from 'lucide-react';
import type { VSPoll } from '../../data/content/types';
import type { PollResults } from './useContentParticipation';

export interface PollWidgetProps {
  poll: VSPoll;
  isVoted: boolean;
  selectedOption: 'a' | 'b' | null;
  results: PollResults;
  isLoadingStats: boolean;
  onVote: (choice: 'a' | 'b') => void;
  variant?: 'compact' | 'full';
  onExploreMore?: () => void;
}

export default function PollWidget({
  poll,
  isVoted,
  selectedOption,
  results,
  isLoadingStats,
  onVote,
  variant = 'compact',
  onExploreMore,
}: PollWidgetProps) {
  const isCompact = variant === 'compact';

  // compact: 사이드바/패널용 (그라디언트 배경, 세로 옵션)
  // full: 모바일 인라인용 (흰 배경, 가로 옵션)
  const containerClass = isCompact
    ? 'bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100'
    : 'bg-white rounded-2xl p-3 shadow-sm border border-slate-100';

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-5 h-5 bg-purple-100 rounded-md flex items-center justify-center">
          <span className="text-[8px] font-black text-purple-600">VS</span>
        </div>
        <span className="text-[10px] font-bold text-purple-600">투표</span>
        {isVoted && (
          <span className="ml-auto w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-emerald-600" />
          </span>
        )}
      </div>

      <p className="text-xs font-bold text-slate-700 mb-2 line-clamp-2 leading-snug">
        {poll.question}
      </p>

      {isCompact ? (
        // 세로 배치 (사이드바/패널)
        <div className="space-y-1.5">
          <PollOptionButton
            option={poll.optionA}
            choice="a"
            selectedOption={selectedOption}
            results={results}
            isLoadingStats={isLoadingStats}
            onVote={onVote}
            layout="horizontal"
          />
          <PollOptionButton
            option={poll.optionB}
            choice="b"
            selectedOption={selectedOption}
            results={results}
            isLoadingStats={isLoadingStats}
            onVote={onVote}
            layout="horizontal"
          />
        </div>
      ) : (
        // 가로 배치 (모바일)
        <>
          <div className="flex gap-2">
            <PollOptionButton
              option={poll.optionA}
              choice="a"
              selectedOption={selectedOption}
              results={results}
              isLoadingStats={isLoadingStats}
              onVote={onVote}
              layout="vertical"
            />
            <PollOptionButton
              option={poll.optionB}
              choice="b"
              selectedOption={selectedOption}
              results={results}
              isLoadingStats={isLoadingStats}
              onVote={onVote}
              layout="vertical"
            />
          </div>

          {/* 투표 후 참여자 수 & CTA */}
          {selectedOption && (
            <div className="mt-2 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-slate-400">
                  {results.total > 0 ? `${results.total.toLocaleString()}명 참여` : '첫 번째 투표!'}
                </span>
                {onExploreMore && (
                  <button
                    onClick={onExploreMore}
                    className="text-[9px] font-medium text-indigo-500 hover:text-indigo-600 flex items-center gap-0.5"
                  >
                    <MessageCircle className="w-3 h-3" />
                    의견 보기
                  </button>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

interface PollOptionButtonProps {
  option: { emoji: string; text: string };
  choice: 'a' | 'b';
  selectedOption: 'a' | 'b' | null;
  results: PollResults;
  isLoadingStats: boolean;
  onVote: (choice: 'a' | 'b') => void;
  layout: 'horizontal' | 'vertical';
}

function PollOptionButton({
  option,
  choice,
  selectedOption,
  results,
  isLoadingStats,
  onVote,
  layout,
}: PollOptionButtonProps) {
  const isSelected = selectedOption === choice;
  const percentage = choice === 'a' ? results.a : results.b;
  const colorA = choice === 'a' ? 'purple' : 'pink';

  const baseClass = layout === 'horizontal'
    ? 'w-full relative overflow-hidden rounded-lg border-2 transition-all'
    : 'flex-1 relative overflow-hidden rounded-xl border-2 transition-all';

  const stateClass = isSelected
    ? `border-${colorA}-400 bg-${colorA}-50`
    : selectedOption
      ? 'border-slate-200 bg-slate-50'
      : `border-${colorA}-200 bg-white hover:border-${colorA}-300 hover:bg-${colorA}-50`;

  // Tailwind purge 대응 - 실제 사용 클래스
  const selectedStyles = {
    a: isSelected ? 'border-purple-400 bg-purple-50' : selectedOption ? 'border-slate-200 bg-slate-50' : 'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50',
    b: isSelected ? 'border-pink-400 bg-pink-50' : selectedOption ? 'border-slate-200 bg-slate-50' : 'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50',
  };

  const barColor = choice === 'a' ? 'bg-purple-200/50' : 'bg-pink-200/50';
  const percentColor = choice === 'a' ? 'text-purple-600' : 'text-pink-600';

  if (layout === 'horizontal') {
    // 사이드바/패널용 가로 레이아웃
    return (
      <button
        onClick={() => onVote(choice)}
        disabled={!!selectedOption || isLoadingStats}
        className={`${baseClass} ${selectedStyles[choice]}`}
      >
        <div className="p-2 flex items-center gap-2 relative z-10">
          <span className="text-lg">{option.emoji}</span>
          <span className="text-[10px] font-bold text-slate-700 flex-1 truncate">
            {option.text}
          </span>
          {selectedOption && (
            <span className={`text-xs font-black ${percentColor}`}>
              {isLoadingStats ? '...' : `${percentage}%`}
            </span>
          )}
        </div>
        {selectedOption && (
          <div
            className={`absolute inset-y-0 left-0 ${barColor} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        )}
      </button>
    );
  }

  // 모바일용 세로 레이아웃
  return (
    <button
      onClick={() => onVote(choice)}
      disabled={!!selectedOption || isLoadingStats}
      className={`${baseClass} ${selectedStyles[choice]}`}
    >
      <div className="p-2 text-center relative z-10">
        <span className="text-lg block">{option.emoji}</span>
        <span className="text-[9px] font-bold text-slate-700 block truncate">
          {option.text}
        </span>
        {selectedOption && (
          <div className={`text-sm font-black ${percentColor} mt-0.5`}>
            {isLoadingStats ? '...' : `${percentage}%`}
          </div>
        )}
      </div>
      {selectedOption && (
        <div
          className={`absolute bottom-0 left-0 right-0 ${barColor} transition-all duration-500`}
          style={{ height: `${percentage}%` }}
        />
      )}
    </button>
  );
}
