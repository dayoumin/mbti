'use client';

import { useState } from 'react';
import { HelpCircle, Check, ChevronRight, Zap, TrendingUp, MessageCircle, Heart } from 'lucide-react';
import type { KnowledgeQuiz } from '../../data/content/types';
import type { RewardInfo } from './useContentParticipation';
import CommentSystem from '../CommentSystem';
import { useLike } from '@/hooks/useLike';
import { useCommentCount } from '@/hooks/useCommentCount';

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
  const { count: commentCount } = useCommentCount({ targetType: 'quiz', targetId: quiz.id });

  const isCorrect = selectedOption
    ? quiz.options.find(o => o.id === selectedOption)?.isCorrect
    : false;

  return (
    <div className="bg-slate-50 rounded-2xl p-5 shadow-sm border border-slate-100">
      {/* 헤더 */}
      <div className="flex items-center gap-2.5 mb-3">
        <div className="w-7 h-7 bg-blue-100 rounded-lg flex items-center justify-center">
          <HelpCircle className="w-4 h-4 text-blue-500" />
        </div>
        <span className="text-sm font-bold text-blue-600">오늘의 퀴즈</span>

        {/* 참여 현황 (퀴즈 전에도 표시) */}
        <div className="ml-auto flex items-center gap-2 text-xs text-slate-400">
          {commentCount > 0 && (
            <span className="flex items-center gap-1">
              <MessageCircle className="w-3 h-3" />
              {commentCount}
            </span>
          )}
          {isAnswered && (
            <span className="w-5 h-5 bg-emerald-100 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-emerald-600" />
            </span>
          )}
        </div>
      </div>

      {/* 질문 */}
      <p className="text-base font-bold text-slate-800 mb-3 leading-snug">
        {quiz.question}
      </p>

      {/* 옵션 또는 결과 */}
      {!showResult ? (
        <>
          {/* 미참여 + 접힘 상태 (모바일) */}
          {!isExpanded && !isAnswered && (
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-blue-50 hover:bg-blue-100 text-blue-600 text-sm font-bold rounded-xl border border-blue-100 transition-all sm:hidden"
            >
              퀴즈 풀어보기
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

          {/* 펼침 상태 또는 PC */}
          <div className={`${!isExpanded && !isAnswered ? 'hidden sm:grid' : 'grid'} grid-cols-1 sm:grid-cols-2 gap-2.5`}>
            {quiz.options.map((option) => (
              <button
                key={option.id}
                onClick={() => onAnswer(option.id)}
                className="w-full text-left px-4 py-3 md:px-5 md:py-3.5 rounded-md text-sm font-bold bg-slate-50 hover:bg-blue-50 border border-subtle hover:border-blue-300 transition-all hover:shadow-sm active:scale-[0.98]"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center text-xs text-slate-400 group-hover:text-blue-500 group-hover:border-blue-300 transition-all flex-shrink-0">
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
          <div className={`p-4 rounded-md ${isCorrect
            ? 'bg-emerald-50 border border-emerald-200'
            : 'bg-amber-50 border border-subtle'
            }`}>
            <div className="flex items-center justify-between">
              <span className={`text-base font-bold ${isCorrect ? 'text-emerald-700' : 'text-amber-700'}`}>
                {isCorrect ? '🎉 정답!' : '💡 아쉽네요!'}
              </span>
              {reward && (
                <span className="flex items-center gap-1 text-sm font-bold text-yellow-600 bg-yellow-100 px-2.5 py-1 rounded-full">
                  <Zap className="w-3.5 h-3.5" />
                  +{reward.points}pt
                </span>
              )}
            </div>

            {/* 정답률 + 좋아요 */}
            <div className="flex items-center justify-between mt-2.5">
              {typeof quizAccuracy === 'number' && (
                <div className="flex items-center gap-1.5 text-sm text-slate-600">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span>나의 정답률: <strong className="text-slate-800">{quizAccuracy}%</strong></span>
                </div>
              )}
              {/* 좋아요 버튼 */}
              <button
                onClick={handleLike}
                className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? 'text-rose-500' : 'text-slate-400 hover:text-rose-400'
                  }`}
              >
                <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>
            </div>
          </div>

          {/* 액션 버튼들 */}
          <div className="flex gap-2.5">
            {/* 댓글 버튼 */}
            {showComments && (
              <button
                onClick={() => setCommentsOpen(!commentsOpen)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold rounded-md transition-all ${commentsOpen
                  ? 'bg-slate-100 text-slate-600'
                  : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
                  }`}
              >
                <MessageCircle className="w-4 h-4" />
                {commentCount > 0 ? `의견 ${commentCount}개 보기` : '의견 나누기'}
              </button>
            )}

            {/* 다음 퀴즈 버튼 - 강조 스타일 */}
            {remainingCount > 0 && onNext && (
              <button
                onClick={onNext}
                className="flex-1 flex items-center justify-center gap-1.5 py-3 text-sm font-bold text-white bg-gradient-brand-primary hover:from-blue-600 hover:to-indigo-600 rounded-md transition-all shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                다음 퀴즈 ({remainingCount}개)
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
