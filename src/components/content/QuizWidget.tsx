'use client';

import { useState } from 'react';
import { HelpCircle, Check, ChevronRight, Zap, TrendingUp, MessageCircle, Heart } from 'lucide-react';
import type { KnowledgeQuiz } from '../../data/content/types';
import type { RewardInfo } from './useContentParticipation';
import CommentSystem from '../CommentSystem';
import { useLike } from '@/hooks/useLike';

export interface QuizWidgetProps {
  quiz: KnowledgeQuiz;
  isAnswered: boolean;
  selectedOption: string | null;
  showResult: boolean;
  onAnswer: (optionId: string) => void;
  remainingCount?: number;
  onNext?: () => void;
  reward?: RewardInfo | null;
  quizAccuracy?: number;
  showComments?: boolean;
}

export default function QuizWidget({
  quiz,
  isAnswered,
  selectedOption,
  showResult,
  onAnswer,
  remainingCount = 0,
  onNext,
  reward,
  quizAccuracy,
  showComments = true,
}: QuizWidgetProps) {
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const { liked, likeCount, handleLike } = useLike({ targetType: 'quiz', targetId: quiz.id });

  const isCorrect = selectedOption
    ? quiz.options.find(o => o.id === selectedOption)?.isCorrect
    : false;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-2">
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
      <p className="text-sm font-bold text-slate-800 mb-2 leading-snug">
        {quiz.question}
      </p>

      {/* 옵션 또는 결과 */}
      {!showResult ? (
        <>
          {/* 미참여 + 접힘 상태 (모바일) */}
          {!isExpanded && !isAnswered && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-black rounded-xl border border-blue-100 transition-all sm:hidden"
            >
              퀴즈 풀어보기
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* 펼침 상태 또는 PC */}
          <div className={`${!isExpanded && !isAnswered ? 'hidden sm:grid' : 'grid'} grid-cols-1 sm:grid-cols-2 gap-2`}>
            {quiz.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onAnswer(option.id)}
                className="w-full text-left px-3 py-2.5 md:px-4 md:py-3 rounded-xl text-xs font-bold bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 transition-all hover:shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-2">
                  <span className="w-4.5 h-4.5 md:w-5 md:h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-xs text-slate-400 group-hover:text-blue-500 group-hover:border-blue-300 transition-all flex-shrink-0">
                    {quiz.options.indexOf(option) + 1}
                  </span>
                  {option.text}
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {/* 정답/오답 + 포인트 표시 */}
          <div className={`p-3 rounded-xl ${isCorrect
            ? 'bg-emerald-50 border border-emerald-200'
            : 'bg-amber-50 border border-amber-200'
            }`}>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-bold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isCorrect ? '🎉 정답!' : '💡 아쉽네요!'}
              </span>
              {reward && (
                <span className="flex items-center gap-1 text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-0.5 rounded-full">
                  <Zap className="w-3 h-3" />
                  +{reward.points}pt
                </span>
              )}
            </div>

            {/* 정답률 + 좋아요 */}
            <div className="flex items-center justify-between mt-2">
              {typeof quizAccuracy === 'number' && (
                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>나의 정답률: <strong className="text-slate-800">{quizAccuracy}%</strong></span>
                </div>
              )}
              {/* 좋아요 버튼 */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1 text-xs transition-colors ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                  }`}
              >
                <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
            </div>
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

            {/* 다음 퀴즈 버튼 */}
            {remainingCount > 0 && onNext && (
              <button
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 rounded-xl transition-all shadow-sm"
              >
                다음 퀴즈
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* 댓글 섹션 */}
          {showComments && commentsOpen && (
            <div className="pt-3 border-t border-slate-100">
              <CommentSystem
                targetType="quiz"
                targetId={quiz.id}
                placeholder="이 퀴즈에 대한 의견을 남겨주세요..."
                maxDisplay={3}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
