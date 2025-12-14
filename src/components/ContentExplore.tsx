'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, HelpCircle, Vote, CheckCircle } from 'lucide-react';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls/vs-polls';
import type { KnowledgeQuiz, VSPoll, ContentCategory } from '@/data/content/types';
import { contentParticipationService } from '@/services/ContentParticipationService';

// ============================================================================
// 타입 정의
// ============================================================================

interface ContentExploreProps {
  onClose: () => void;
  initialTab?: 'quiz' | 'poll';
}

type TabType = 'quiz' | 'poll';

const CATEGORY_LABELS: Record<ContentCategory, { label: string; emoji: string }> = {
  cat: { label: '고양이', emoji: '🐱' },
  dog: { label: '강아지', emoji: '🐕' },
  rabbit: { label: '토끼', emoji: '🐰' },
  hamster: { label: '햄스터', emoji: '🐹' },
  general: { label: '일반', emoji: '📚' },
  love: { label: '연애', emoji: '💕' },
  lifestyle: { label: '라이프스타일', emoji: '☕' },
  personality: { label: '성격', emoji: '🧠' },
  plant: { label: '식물', emoji: '🌱' },
};

// ============================================================================
// 퀴즈 카드 컴포넌트
// ============================================================================

interface QuizCardProps {
  quiz: KnowledgeQuiz;
  isAnswered: boolean;
  previousAnswer?: string;
  onAnswer: (quizId: string, optionId: string, isCorrect: boolean) => void;
}

function QuizCard({ quiz, isAnswered, previousAnswer, onAnswer }: QuizCardProps) {
  const [selectedOption, setSelectedOption] = useState<string | null>(previousAnswer || null);
  const [showResult, setShowResult] = useState(isAnswered);

  const handleSelect = (optionId: string) => {
    if (showResult) return;
    setSelectedOption(optionId);
    setShowResult(true);
    const isCorrect = quiz.options.find(o => o.id === optionId)?.isCorrect || false;
    onAnswer(quiz.id, optionId, isCorrect);
  };

  const selectedIsCorrect = quiz.options.find(o => o.id === selectedOption)?.isCorrect;
  const categoryInfo = CATEGORY_LABELS[quiz.category];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <HelpCircle className="w-4 h-4 text-blue-500" />
        <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.label}
        </span>
        {isAnswered && (
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
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
          {selectedIsCorrect ? '🎉 정답!' : '💡 오답!'} {quiz.explanation}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 투표 카드 컴포넌트
// ============================================================================

interface PollCardProps {
  poll: VSPoll;
  isVoted: boolean;
  previousVote?: 'a' | 'b';
  onVote: (pollId: string, choice: 'a' | 'b') => void;
}

function getStablePollResults(pollId: string) {
  const seedStr = String(pollId || '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash) % 41; // 0..40
  const a = 30 + base; // 30..70
  return { a, b: 100 - a };
}

function PollCard({ poll, isVoted, previousVote, onVote }: PollCardProps) {
  const [localVoted, setLocalVoted] = useState<'a' | 'b' | null>(null);
  const voted = previousVote ?? localVoted;
  const results = getStablePollResults(poll.id);

  const handleVote = (choice: 'a' | 'b') => {
    if (voted) return;
    setLocalVoted(choice);
    onVote(poll.id, choice);
  };

  const categoryInfo = CATEGORY_LABELS[poll.category];

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Vote className="w-4 h-4 text-purple-500" />
        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.label}
        </span>
        {(isVoted || voted) && (
          <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> 투표완료
          </span>
        )}
      </div>

      <p className="text-sm font-bold text-slate-700 mb-4 text-center">{poll.question}</p>

      <div className="flex gap-3">
        {/* Option A */}
        <button
          onClick={() => handleVote('a')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
            voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-gray-200 bg-gray-50' :
            'border-purple-200 bg-white hover:border-purple-300 hover:bg-purple-50'
          }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{poll.optionA.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionA.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-purple-600">{results.a}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-purple-200/50 transition-all duration-500"
              style={{ height: `${results.a}%` }}
            />
          )}
        </button>

        {/* VS */}
        <div className="flex items-center">
          <span className="text-xs font-black text-slate-400">VS</span>
        </div>

        {/* Option B */}
        <button
          onClick={() => handleVote('b')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${
            voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-gray-200 bg-gray-50' :
            'border-pink-200 bg-white hover:border-pink-300 hover:bg-pink-50'
          }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{poll.optionB.emoji}</span>
            <span className="text-xs font-bold text-slate-700">{poll.optionB.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-pink-600">{results.b}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-pink-200/50 transition-all duration-500"
              style={{ height: `${results.b}%` }}
            />
          )}
        </button>
      </div>
    </div>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function ContentExplore({ onClose, initialTab = 'quiz' }: ContentExploreProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<ContentCategory | 'all'>('all');
  const [participation, setParticipation] = useState(contentParticipationService.getParticipation());

  useEffect(() => {
    const handleUpdated = () => {
      setParticipation(contentParticipationService.getParticipation());
    };

    window.addEventListener('chemi_content_participation_updated', handleUpdated);
    return () => window.removeEventListener('chemi_content_participation_updated', handleUpdated);
  }, []);

  // 카테고리별 필터링
  const filteredQuizzes = selectedCategory === 'all'
    ? ALL_KNOWLEDGE_QUIZZES
    : ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === selectedCategory);

  const filteredPolls = selectedCategory === 'all'
    ? VS_POLLS
    : VS_POLLS.filter(p => p.category === selectedCategory);

  // 퀴즈 정답 처리
  const handleQuizAnswer = (quizId: string, optionId: string, isCorrect: boolean) => {
    contentParticipationService.recordQuizAnswer(quizId, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());
  };

  // 투표 처리
  const handlePollVote = (pollId: string, choice: 'a' | 'b') => {
    contentParticipationService.recordPollVote(pollId, choice);
    setParticipation(contentParticipationService.getParticipation());
  };

  // 통계
  const stats = {
    quizTotal: ALL_KNOWLEDGE_QUIZZES.length,
    quizAnswered: participation.quizzes.length,
    quizCorrect: participation.quizzes.filter(q => q.isCorrect).length,
    pollTotal: VS_POLLS.length,
    pollVoted: participation.polls.length,
  };

  // 현재 필터에 있는 카테고리들
  const availableCategories = activeTab === 'quiz'
    ? [...new Set(ALL_KNOWLEDGE_QUIZZES.map(q => q.category))]
    : [...new Set(VS_POLLS.map(p => p.category))];

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-slate-100 to-slate-200 z-50 overflow-hidden">
      {/* 헤더 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-10">
        <div className="max-w-lg mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="font-bold text-slate-800">퀴즈 & 투표</h1>
              <p className="text-[10px] text-slate-500">
                {activeTab === 'quiz'
                  ? `${stats.quizAnswered}/${stats.quizTotal} 참여 · 정답률 ${stats.quizAnswered > 0 ? Math.round((stats.quizCorrect / stats.quizAnswered) * 100) : 0}%`
                  : `${stats.pollVoted}/${stats.pollTotal} 투표 완료`
                }
              </p>
            </div>
          </div>

          {/* 탭 */}
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setActiveTab('quiz')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'quiz'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <HelpCircle className="w-4 h-4 inline mr-1" />
              퀴즈 ({stats.quizTotal})
            </button>
            <button
              onClick={() => setActiveTab('poll')}
              className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${
                activeTab === 'poll'
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <Vote className="w-4 h-4 inline mr-1" />
              투표 ({stats.pollTotal})
            </button>
          </div>

          {/* 카테고리 필터 */}
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-slate-800 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              전체
            </button>
            {availableCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-slate-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {CATEGORY_LABELS[cat].emoji} {CATEGORY_LABELS[cat].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 콘텐츠 */}
      <div className="overflow-y-auto h-[calc(100vh-180px)] pb-20">
        <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
          {activeTab === 'quiz' ? (
            filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => {
                const answered = participation.quizzes.find(q => q.quizId === quiz.id);
                return (
                  <QuizCard
                    key={quiz.id}
                    quiz={quiz}
                    isAnswered={!!answered}
                    previousAnswer={answered?.selectedOption}
                    onAnswer={handleQuizAnswer}
                  />
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>이 카테고리에 퀴즈가 없습니다</p>
              </div>
            )
          ) : (
            filteredPolls.length > 0 ? (
              filteredPolls.map((poll) => {
                const voted = participation.polls.find(p => p.pollId === poll.id);
                return (
                  <PollCard
                    key={poll.id}
                    poll={poll}
                    isVoted={!!voted}
                    previousVote={voted?.choice}
                    onVote={handlePollVote}
                  />
                );
              })
            ) : (
              <div className="text-center py-12 text-gray-400">
                <p>이 카테고리에 투표가 없습니다</p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
