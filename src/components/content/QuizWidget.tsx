'use client';

import { HelpCircle, Check, ChevronRight } from 'lucide-react';
import type { KnowledgeQuiz } from '../../data/content/types';

export interface QuizWidgetProps {
  quiz: KnowledgeQuiz;
  isAnswered: boolean;
  selectedOption: string | null;
  showResult: boolean;
  onAnswer: (optionId: string) => void;
  remainingCount?: number;
  onNext?: () => void;
}

export default function QuizWidget({
  quiz,
  isAnswered,
  selectedOption,
  showResult,
  onAnswer,
  remainingCount = 0,
  onNext,
}: QuizWidgetProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
        </div>
        <span className="text-xs font-bold text-blue-600">오늘의 퀴즈</span>
        {isAnswered && (
          <span className="ml-auto w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
            <Check className="w-3 h-3 text-emerald-600" />
          </span>
        )}
      </div>

      {/* 질문 */}
      <p className="text-sm font-bold text-slate-800 mb-3 leading-snug">
        {quiz.question}
      </p>

      {/* 옵션 또는 결과 */}
      {!showResult ? (
        <div className="space-y-2">
          {quiz.options.map((option) => (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              className="w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all"
            >
              {option.text}
            </button>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {/* 정답/오답 표시 */}
          <div className={`p-3 rounded-xl text-sm font-bold ${
            quiz.options.find(o => o.id === selectedOption)?.isCorrect
              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
              : 'bg-amber-50 text-amber-700 border border-amber-200'
          }`}>
            {quiz.options.find(o => o.id === selectedOption)?.isCorrect
              ? '🎉 정답입니다!'
              : '💡 아쉽네요!'}
          </div>

          {/* 다음 퀴즈 버튼 */}
          {remainingCount > 0 && onNext && (
            <button
              onClick={onNext}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all shadow-sm"
            >
              다음 퀴즈 풀기
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
