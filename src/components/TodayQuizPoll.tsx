'use client';

import { useState, useEffect, useMemo } from 'react';
import { Brain, Vote, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls';
import { contentParticipationService } from '@/services/ContentParticipationService';
import { getParticipationBridge } from '@/services/ParticipationBridge';
import type { KnowledgeQuiz, VSPoll } from '@/data/content/types';

interface TodayQuizPollProps {
  onExploreMore?: () => void;
  className?: string;
}

// 오늘의 퀴즈 선택 (날짜 기반 결정적 선택)
function getTodayQuiz(): KnowledgeQuiz | null {
  if (ALL_KNOWLEDGE_QUIZZES.length === 0) return null;
  const today = new Date();
  const dayIndex = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
  return ALL_KNOWLEDGE_QUIZZES[dayIndex % ALL_KNOWLEDGE_QUIZZES.length];
}

// 오늘의 투표 선택 (날짜 기반 결정적 선택, 퀴즈와 다른 오프셋)
function getTodayPoll(): VSPoll | null {
  if (VS_POLLS.length === 0) return null;
  const today = new Date();
  const dayIndex = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate() + 7;
  return VS_POLLS[dayIndex % VS_POLLS.length];
}

export default function TodayQuizPoll({ onExploreMore, className = '' }: TodayQuizPollProps) {
  const [participation, setParticipation] = useState(contentParticipationService.getParticipation());
  const [quizAnswer, setQuizAnswer] = useState<string | null>(null);
  const [pollVote, setPollVote] = useState<'a' | 'b' | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [pollStats, setPollStats] = useState({ a: 50, b: 50 });

  const todayQuiz = useMemo(() => getTodayQuiz(), []);
  const todayPoll = useMemo(() => getTodayPoll(), []);

  // 이미 참여한 퀴즈/투표 확인
  useEffect(() => {
    if (todayQuiz) {
      const answered = participation.quizzes.find(q => q.quizId === todayQuiz.id);
      if (answered) {
        setQuizAnswer(answered.selectedOption);
        setShowQuizResult(true);
      }
    }
    if (todayPoll) {
      const voted = participation.polls.find(p => p.pollId === todayPoll.id);
      if (voted) {
        setPollVote(voted.choice);
      }
    }
  }, [participation, todayQuiz, todayPoll]);

  // 퀴즈 답변 처리
  const handleQuizAnswer = async (optionId: string) => {
    if (!todayQuiz || showQuizResult) return;

    const isCorrect = todayQuiz.options.find(o => o.id === optionId)?.isCorrect || false;
    setQuizAnswer(optionId);
    setShowQuizResult(true);

    contentParticipationService.recordQuizAnswer(todayQuiz.id, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());

    try {
      const bridge = getParticipationBridge();
      // questionIndex는 단일 퀴즈이므로 0
      await bridge.recordQuizAnswer(todayQuiz.id, 0, optionId, isCorrect, todayQuiz.category);
    } catch (e) {
      console.error('Quiz bridge error:', e);
    }
  };

  // 투표 처리
  const handlePollVote = async (choice: 'a' | 'b') => {
    if (!todayPoll || pollVote) return;

    setPollVote(choice);

    // 가상 통계 업데이트 (실제 API 연동 시 대체)
    const newStats = choice === 'a'
      ? { a: Math.min(pollStats.a + 2, 70), b: Math.max(pollStats.b - 2, 30) }
      : { a: Math.max(pollStats.a - 2, 30), b: Math.min(pollStats.b + 2, 70) };
    setPollStats(newStats);

    contentParticipationService.recordPollVote(todayPoll.id, choice);
    setParticipation(contentParticipationService.getParticipation());

    try {
      const bridge = getParticipationBridge();
      // pollStats는 undefined로 전달 (서버에서 조회)
      await bridge.recordPollVote(todayPoll.id, choice, undefined, todayPoll.category);
    } catch (e) {
      console.error('Poll bridge error:', e);
    }
  };

  const stats = participation.stats;
  const hasActivity = stats.totalQuizAnswered > 0 || stats.totalPollVoted > 0;

  return (
    <div className={`bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-4 border border-indigo-100/50 ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">오늘의 퀴즈 & 투표</h3>
            <p className="text-xs text-slate-500">매일 새로운 콘텐츠가 기다려요</p>
          </div>
        </div>
        {hasActivity && (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="flex items-center gap-1">
              <Brain className="w-3 h-3" />
              {stats.totalQuizAnswered}
            </span>
            <span className="flex items-center gap-1">
              <Vote className="w-3 h-3" />
              {stats.totalPollVoted}
            </span>
          </div>
        )}
      </div>

      {/* 콘텐츠 그리드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* 오늘의 퀴즈 */}
        {todayQuiz && (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-bold text-indigo-600">오늘의 퀴즈</span>
              {showQuizResult && (
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded-full ml-auto ${
                  todayQuiz.options.find(o => o.id === quizAnswer)?.isCorrect
                    ? 'bg-green-100 text-green-600'
                    : 'bg-red-100 text-red-600'
                }`}>
                  {todayQuiz.options.find(o => o.id === quizAnswer)?.isCorrect ? '정답!' : '오답'}
                </span>
              )}
            </div>

            <p className="text-sm font-medium text-slate-700 mb-3 line-clamp-2">
              {todayQuiz.question}
            </p>

            <div className="space-y-1.5">
              {todayQuiz.options.slice(0, 4).map((option) => {
                const isSelected = quizAnswer === option.id;
                const isCorrectAnswer = option.isCorrect;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleQuizAnswer(option.id)}
                    disabled={showQuizResult}
                    className={`w-full text-left text-xs p-2 rounded-lg transition-all ${
                      showQuizResult
                        ? isCorrectAnswer
                          ? 'bg-green-100 text-green-700 border border-green-200'
                          : isSelected
                            ? 'bg-red-100 text-red-700 border border-red-200'
                            : 'bg-slate-50 text-slate-400'
                        : 'bg-slate-50 hover:bg-indigo-50 text-slate-600 hover:text-indigo-600'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {showQuizResult && isCorrectAnswer && (
                        <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      )}
                      <span className="line-clamp-1">{option.text}</span>
                    </span>
                  </button>
                );
              })}
            </div>

            {showQuizResult && todayQuiz.explanation && (
              <div className="mt-2 p-2 bg-indigo-50 rounded-lg">
                <p className="text-xs text-indigo-700 line-clamp-2">{todayQuiz.explanation}</p>
              </div>
            )}
          </div>
        )}

        {/* 오늘의 투표 */}
        {todayPoll && (
          <div className="bg-white rounded-xl p-3 shadow-sm">
            <div className="flex items-center gap-2 mb-2">
              <Vote className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-purple-600">오늘의 투표</span>
              {pollVote && (
                <span className="text-xs text-slate-400 ml-auto">투표 완료</span>
              )}
            </div>

            <p className="text-sm font-medium text-slate-700 mb-3 line-clamp-2">
              {todayPoll.question}
            </p>

            <div className="space-y-2">
              {/* Option A */}
              <button
                onClick={() => handlePollVote('a')}
                disabled={!!pollVote}
                className={`w-full text-left p-2 rounded-lg transition-all relative overflow-hidden ${
                  pollVote
                    ? pollVote === 'a'
                      ? 'bg-purple-100 border border-purple-200'
                      : 'bg-slate-50'
                    : 'bg-slate-50 hover:bg-purple-50'
                }`}
              >
                {pollVote && (
                  <div
                    className="absolute inset-0 bg-purple-200/30 transition-all"
                    style={{ width: `${pollStats.a}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-medium">
                    <span>{todayPoll.optionA.emoji}</span>
                    <span className={pollVote === 'a' ? 'text-purple-700' : 'text-slate-600'}>
                      {todayPoll.optionA.text}
                    </span>
                  </span>
                  {pollVote && (
                    <span className="text-xs font-bold text-purple-600">{pollStats.a}%</span>
                  )}
                </div>
              </button>

              {/* VS */}
              <div className="flex items-center justify-center">
                <span className="text-xs font-bold text-slate-300">VS</span>
              </div>

              {/* Option B */}
              <button
                onClick={() => handlePollVote('b')}
                disabled={!!pollVote}
                className={`w-full text-left p-2 rounded-lg transition-all relative overflow-hidden ${
                  pollVote
                    ? pollVote === 'b'
                      ? 'bg-pink-100 border border-pink-200'
                      : 'bg-slate-50'
                    : 'bg-slate-50 hover:bg-pink-50'
                }`}
              >
                {pollVote && (
                  <div
                    className="absolute inset-0 bg-pink-200/30 transition-all"
                    style={{ width: `${pollStats.b}%` }}
                  />
                )}
                <div className="relative flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs font-medium">
                    <span>{todayPoll.optionB.emoji}</span>
                    <span className={pollVote === 'b' ? 'text-pink-700' : 'text-slate-600'}>
                      {todayPoll.optionB.text}
                    </span>
                  </span>
                  {pollVote && (
                    <span className="text-xs font-bold text-pink-600">{pollStats.b}%</span>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 더보기 버튼 */}
      {onExploreMore && (
        <button
          onClick={onExploreMore}
          className="w-full mt-3 flex items-center justify-center gap-1 py-2 text-xs font-medium text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          더 많은 퀴즈/투표 보기
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
