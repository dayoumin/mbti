'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { HelpCircle, CheckCircle, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { KnowledgeQuiz } from '@/data/content/types';
import { getCategoryInfo } from '@/data/content/categories';
import { nextActionService, type NextAction } from '@/services/NextActionService';
import { NextActionInline } from '@/components/NextActionCard';
import CommentSystem from '@/components/CommentSystem';
import { contentRecommendationService } from '@/services/ContentRecommendationService';
import { RelatedContentSection, type RelatedItem } from '@/components/content/RelatedContentSection';

interface QuizCardProps {
  quiz: KnowledgeQuiz;
  isAnswered: boolean;
  previousAnswer?: string;
  onAnswer: (quizId: string, optionId: string, isCorrect: boolean) => void;
  onNextAction?: (action: NextAction) => void;
  allQuizzes?: KnowledgeQuiz[];
  answeredQuizIds?: string[];
}

export function QuizCard({ quiz, isAnswered, previousAnswer, onAnswer, onNextAction, allQuizzes = [], answeredQuizIds = [] }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(previousAnswer || null);
  const [showResult, setShowResult] = useState(isAnswered);
  const [showComments, setShowComments] = useState(false);

  // props 변경 시 상태 동기화 (방어적 코드)
  // 참여 기록 리셋 시에도 UI 상태 초기화
  useEffect(() => {
    if (previousAnswer) {
      setSelectedOption(previousAnswer);
      setShowResult(true);
    } else if (!isAnswered) {
      // 참여 기록이 리셋된 경우 (예: localStorage 초기화)
      setSelectedOption(null);
      setShowResult(false);
    }
  }, [previousAnswer, isAnswered]);

  // 다음 액션 추천
  const nextActions = showResult
    ? nextActionService.getRecommendations({
      endpoint: 'quiz_result',
      category: quiz.category,
    }).slice(0, 2)
    : [];

  // 관련 퀴즈 추천 (태그 기반, 미참여 우선) - RelatedItem 형식으로 변환
  const relatedQuizItems = useMemo((): RelatedItem[] => {
    if (!showResult || allQuizzes.length === 0) return [];
    const similar = contentRecommendationService.getSimilarQuizzes(quiz, allQuizzes, 6);
    return similar
      .filter(s => !answeredQuizIds.includes(s.content.id))
      .slice(0, 3)
      .map(s => ({
        id: s.content.id,
        title: s.content.question,
        category: s.content.category,
        reason: s.reason,
      }));
  }, [showResult, quiz, allQuizzes, answeredQuizIds]);

  // 관련 퀴즈 클릭 시 스크롤 이동
  const handleQuizSelect = useCallback((quizId: string) => {
    const element = document.getElementById(`quiz-${quizId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-orange-400');
      setTimeout(() => element.classList.remove('ring-2', 'ring-orange-400'), 2000);
    }
  }, []);

  const handleSelect = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
    setShowResult(true);
    const isCorrect = quiz.options.find(o => o.id === optionId)?.isCorrect || false;
    onAnswer(quiz.id, optionId, isCorrect);
  };

  const selectedIsCorrect = quiz.options.find(o => o.id === selectedOption)?.isCorrect;
  const categoryInfo = getCategoryInfo(quiz.category);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="w-4 h-4 text-blue-500" />
        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.name}
        </span>
        {isAnswered && (
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 참여완료
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-slate-700 mb-3">{quiz.question}</p>

      <div className="space-y-2">
        {quiz.options.map((option) => {
          const isSelected = selectedOption === option.id;
          const isCorrect = option.isCorrect;
          let bgClass = 'bg-gray-50 hover:bg-blue-50 border-gray-200';

          if (showResult) {
            if (isCorrect) {
              bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-700';
            } else if (isSelected && !isCorrect) {
              bgClass = 'bg-red-50 border-red-300 text-red-700';
            } else {
              bgClass = 'bg-gray-50 border-gray-200 text-gray-400';
            }
          }

          return (
            <button
              key={option.id}
              onClick={() => handleSelect(option.id)}
              disabled={showResult}
              className={`w-full text-left px-3 py-2 rounded-xl text-sm border transition-all ${bgClass}`}
            >
              {option.text}
              {showResult && isCorrect && <span className="ml-2">✓</span>}
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-3 p-3 rounded-xl text-xs ${selectedIsCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
          <div className="flex items-start justify-between gap-2">
            <span>{selectedIsCorrect ? '🎉 정답!' : '💡 오답!'} {quiz.explanation}</span>
          </div>
          {/* 통계 표시 - 다른 사람들의 선택 분포 */}
          <div className="mt-3 pt-3 border-t border-current/10">
            <p className="text-xs font-bold mb-2 opacity-80">📊 다른 사람들의 선택</p>
            <div className="space-y-1.5">
              {(() => {
                // 결정론적 mock 통계 (실제 API 연동 전)
                // hash를 한 번만 계산하여 재사용
                const CORRECT_BASE = 25;
                const CORRECT_RANGE = 30;
                const INCORRECT_BASE = 10;
                const INCORRECT_RANGE = 25;

                const hash = quiz.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
                const totalRaw = quiz.options.reduce((sum, o) => {
                  return sum + (o.isCorrect ? CORRECT_BASE + (hash % CORRECT_RANGE) : INCORRECT_BASE + (hash % INCORRECT_RANGE));
                }, 0);

                // 퍼센트 계산 (합계 100% 보장)
                const rawPercents = quiz.options.map((option) => {
                  const basePercent = option.isCorrect
                    ? CORRECT_BASE + (hash % CORRECT_RANGE)
                    : INCORRECT_BASE + (hash % INCORRECT_RANGE);
                  return (basePercent / totalRaw) * 100;
                });

                // floor로 계산 후 나머지를 가장 큰 값에 할당
                const floored = rawPercents.map(p => Math.floor(p));
                const remainder = 100 - floored.reduce((a, b) => a + b, 0);
                const maxIndex = rawPercents.indexOf(Math.max(...rawPercents));
                floored[maxIndex] += remainder;

                return quiz.options.map((option, idx) => {
                  const percent = floored[idx];

                  return (
                    <div key={option.id} className="flex items-center gap-2">
                      <div className="flex-1 h-5 bg-slate-50/50 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${option.isCorrect ? 'bg-emerald-400' : 'bg-slate-300'
                            }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="text-xs w-10 text-right font-bold">{percent}%</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 다음 액션 추천 */}
      {showResult && nextActions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <NextActionInline actions={nextActions} onActionClick={onNextAction} />
        </div>
      )}

      {/* 관련 퀴즈 더보기 */}
      {showResult && (
        <RelatedContentSection
          items={relatedQuizItems}
          onSelect={handleQuizSelect}
          contentType="quiz"
        />
      )}

      {/* 댓글 토글 버튼 */}
      {showResult && (
        <button
          onClick={() => setShowComments(!showComments)}
          className="w-full mt-3 py-2 flex items-center justify-center gap-1 text-xs text-slate-500 hover:text-slate-700 border-t border-gray-100 transition-colors"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          <span>댓글</span>
          {showComments ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      )}

      {/* 댓글 섹션 */}
      {showResult && showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentSystem
            targetType="quiz"
            targetId={quiz.id}
            placeholder="이 퀴즈에 대한 의견을 남겨보세요..."
            maxDisplay={3}
          />
        </div>
      )}
    </div>
  );
}

interface QuizTabProps {
  quizzes: KnowledgeQuiz[];
  answeredQuizIds: string[];
  onAnswer: (quizId: string, optionId: string, isCorrect: boolean) => void;
  onNextAction?: (action: NextAction) => void;
}

export default function QuizTab({ quizzes, answeredQuizIds, onAnswer, onNextAction }: QuizTabProps) {
  return (
    <>
      {quizzes.length > 0 ? (
        quizzes.map((quiz) => {
          const answered = answeredQuizIds.includes(quiz.id);
          return (
            <div key={quiz.id} id={`quiz-${quiz.id}`}>
              <QuizCard
                quiz={quiz}
                isAnswered={answered}
                onAnswer={onAnswer}
                onNextAction={onNextAction}
                allQuizzes={quizzes}
                answeredQuizIds={answeredQuizIds}
              />
            </div>
          );
        })
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p>이 카테고리에 퀴즈가 없습니다</p>
        </div>
      )}
    </>
  );
}
