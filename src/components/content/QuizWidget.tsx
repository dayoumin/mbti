'use client';

import { HelpCircle, Check } from 'lucide-react';
import type { KnowledgeQuiz } from '../../data/content/types';

export interface QuizWidgetProps {
  quiz: KnowledgeQuiz;
  isAnswered: boolean;
  selectedOption: string | null;
  showResult: boolean;
  onAnswer: (optionId: string) => void;
  variant?: 'compact' | 'full';
  onExploreMore?: () => void;
}

export default function QuizWidget({
  quiz,
  isAnswered,
  selectedOption,
  showResult,
  onAnswer,
  variant = 'compact',
  onExploreMore,
}: QuizWidgetProps) {
  const isCompact = variant === 'compact';

  // compact: 사이드바/패널용 (그라디언트 배경)
  // full: 모바일 인라인용 (흰 배경)
  const containerClass = isCompact
    ? 'bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100'
    : 'bg-white rounded-2xl p-3 shadow-sm border border-slate-100';

  const optionClass = isCompact
    ? 'w-full text-left px-2 py-1.5 rounded-lg text-[10px] bg-white/80 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all truncate'
    : 'w-full text-left px-2 py-1.5 rounded-lg text-[10px] bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all truncate';

  // full 모드에서는 처음 2개만 보여주고 나머지는 "더보기"
  const displayOptions = isCompact ? quiz.options : quiz.options.slice(0, 2);
  const hasMoreOptions = !isCompact && quiz.options.length > 2;

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-1.5 mb-2">
        <div className="w-5 h-5 bg-blue-100 rounded-md flex items-center justify-center">
          <HelpCircle className="w-3 h-3 text-blue-500" />
        </div>
        <span className="text-[10px] font-bold text-blue-600">
          {isCompact ? '오늘의 퀴즈' : '퀴즈'}
        </span>
        {isAnswered && (
          <span className="ml-auto w-4 h-4 bg-emerald-100 rounded-full flex items-center justify-center">
            <Check className="w-2.5 h-2.5 text-emerald-600" />
          </span>
        )}
      </div>

      <p className="text-xs font-bold text-slate-700 mb-2 line-clamp-2 leading-snug">
        {quiz.question}
      </p>

      {!showResult ? (
        <div className={isCompact ? 'space-y-1' : 'space-y-1.5'}>
          {displayOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className={optionClass}
            >
              {option.text}
            </button>
          ))}
          {hasMoreOptions && onExploreMore && (
            <button
              onClick={onExploreMore}
              className="w-full text-center py-1 text-[10px] text-slate-400 hover:text-blue-500"
            >
              +{quiz.options.length - 2}개 더보기
            </button>
          )}
        </div>
      ) : (
        <div className={`p-2 rounded-lg text-[10px] ${
          quiz.options.find(o => o.id === selectedOption)?.isCorrect
            ? isCompact ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-50 text-emerald-700'
            : isCompact ? 'bg-amber-100 text-amber-700' : 'bg-amber-50 text-amber-700'
        }`}>
          {quiz.options.find(o => o.id === selectedOption)?.isCorrect ? '🎉 정답!' : '💡 오답!'}
        </div>
      )}
    </div>
  );
}
