'use client';

import { useState } from 'react';
import { Check, ChevronRight, Zap, MessageCircle, Heart } from 'lucide-react';
import type { VSPoll } from '../../data/content/types';
import type { PollResults, RewardInfo } from './useContentParticipation';
import CommentSystem from '../CommentSystem';
import { useLike } from '@/hooks/useLike';

export interface PollWidgetProps {
  poll: VSPoll;
  isVoted: boolean;
  selectedOption: 'a' | 'b' | null;
  results: PollResults;
  isLoadingStats: boolean;
  onVote: (choice: 'a' | 'b') => void;
  remainingCount?: number;
  onNext?: () => void;
  reward?: RewardInfo | null;
  showComments?: boolean;
}

export default function PollWidget({
  poll,
  isVoted,
  selectedOption,
  results,
  isLoadingStats,
  onVote,
  remainingCount = 0,
  onNext,
  reward,
  showComments = true,
}: PollWidgetProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const { liked, likeCount, handleLike } = useLike({ targetType: 'poll', targetId: poll.id });

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
          <span className="text-[9px] font-black text-purple-600">VS</span>
        </div>
        <span className="text-xs font-bold text-purple-600">오늘의 투표</span>
        {isVoted && (
          <span className="ml-auto w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-600" />
          </span>
        )}
      </div>

      {/* 질문 및 투표 옵션: 모바일에서도 가로 배치 시도 */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 min-w-0">
          <p className="text-[13px] md:text-sm font-black text-slate-800 leading-tight">
            {poll.question}
          </p>
        </div>

        <div className="flex gap-2 w-[160px] md:w-[200px] flex-shrink-0">
          <PollOptionButton
            option={poll.optionA}
            choice="a"
            selectedOption={selectedOption}
            results={results}
            isLoadingStats={isLoadingStats}
            onVote={onVote}
          />
          <PollOptionButton
            option={poll.optionB}
            choice="b"
            selectedOption={selectedOption}
            results={results}
            isLoadingStats={isLoadingStats}
            onVote={onVote}
          />
        </div>
      </div>

      {/* 투표 후: 결과 & 다음 버튼 */}
      {selectedOption && (
        <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
          {/* 포인트 획득 + 좋아요 + 참여자 수 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-slate-400">
                {results.total > 0
                  ? `${results.total.toLocaleString()}명 참여`
                  : results.total === -1
                    ? '집계중...'
                    : '첫 번째 투표!'}
              </span>
              {/* 좋아요 버튼 */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 transition-colors ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
            </div>
            {reward && (
              <span className="flex items-center gap-1 font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                <Zap className="w-3 h-3" />
                +{reward.points}pt
              </span>
            )}
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2">
            {/* 댓글 버튼 */}
            {showComments && (
              <button
                onClick={() => setCommentsOpen(!commentsOpen)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold rounded-xl transition-all ${commentsOpen
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <MessageCircle className="w-4 h-4" />
                의견 나누기
              </button>
            )}

            {/* 다음 투표 버튼 */}
            {remainingCount > 0 && onNext && (
              <button
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl transition-all shadow-sm"
              >
                다음 투표
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 댓글 섹션 */}
          {showComments && commentsOpen && (
            <div className="pt-3 border-t border-slate-100">
              <CommentSystem
                targetType="poll"
                targetId={poll.id}
                placeholder="이 투표에 대한 의견을 남겨주세요..."
                maxDisplay={3}
              />
            </div>
          )}
        </div>
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
}

function PollOptionButton({
  option,
  choice,
  selectedOption,
  results,
  isLoadingStats,
  onVote,
}: PollOptionButtonProps) {
  const isSelected = selectedOption === choice;
  const percentage = choice === 'a' ? results.a : results.b;
  const isWinner = selectedOption && (
    (choice === 'a' && results.a > results.b) ||
    (choice === 'b' && results.b > results.a)
  );

  // 색상 정의
  const colors = {
    a: {
      border: isSelected ? 'border-purple-400' : selectedOption ? 'border-slate-200' : 'border-purple-200',
      bg: isSelected ? 'bg-purple-50' : selectedOption ? 'bg-slate-50' : 'bg-white',
      hover: !selectedOption ? 'hover:border-purple-300 hover:bg-purple-50' : '',
      bar: 'bg-purple-200/60',
      percent: 'text-purple-600',
    },
    b: {
      border: isSelected ? 'border-pink-400' : selectedOption ? 'border-slate-200' : 'border-pink-200',
      bg: isSelected ? 'bg-pink-50' : selectedOption ? 'bg-slate-50' : 'bg-white',
      hover: !selectedOption ? 'hover:border-pink-300 hover:bg-pink-50' : '',
      bar: 'bg-pink-200/60',
      percent: 'text-pink-600',
    },
  };

  const c = colors[choice];

  return (
    <button
      onClick={() => onVote(choice)}
      disabled={!!selectedOption || isLoadingStats}
      className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${c.border} ${c.bg} ${c.hover}`}
    >
      {/* 결과 바 (배경) */}
      {selectedOption && (
        <div
          className={`absolute bottom-0 left-0 right-0 ${c.bar} transition-all duration-500`}
          style={{ height: `${percentage}%` }}
        />
      )}

      {/* 콘텐츠 */}
      <div className="relative z-10 p-3.5 md:p-5 text-center flex flex-col items-center justify-center">
        <span className="text-3xl md:text-4xl block mb-1 md:mb-2 transition-transform group-hover:scale-125 duration-300">{option.emoji}</span>
        <span className="text-[11px] md:text-xs font-black text-slate-800 block leading-tight mb-1.5 md:mb-2">
          {option.text}
        </span>
        {selectedOption && (
          <div className={`text-xl md:text-2xl font-black ${c.percent}`}>
            {isLoadingStats ? '...' : `${percentage}%`}
          </div>
        )}
      </div>

      {/* 우승 표시 */}
      {isWinner && (
        <div className="absolute top-2 right-2 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center shadow-md animate-bounce-slight">
          <span className="text-xs">👑</span>
        </div>
      )}
    </button>
  );
}
