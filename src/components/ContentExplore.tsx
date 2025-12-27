'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
  HelpCircle, Vote, CheckCircle, MessageCircle,
  Lightbulb, ThumbsUp, Bookmark, ChevronRight, ChevronDown, ChevronUp,
  Trophy, Flame, Heart, Search, Sparkles, X, Zap, TrendingUp
} from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { MOCK_COMMUNITY_POSTS } from '@/data/content/community';
import { RANKABLE_TESTS } from '@/data/config';
import { getIconComponent } from '@/utils';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls';
import type { KnowledgeQuiz, VSPoll, ContentCategory, SituationReaction, SituationCategory } from '@/data/content/types';
import { getCategoryInfo } from '@/data/content/categories';
import { ALL_SITUATION_REACTIONS, SITUATION_CATEGORY_LABELS } from '@/data/content/situation-reactions';
import { SituationReactionCard } from '@/components/content/SituationReactionCard';
import { contentParticipationService, type ContentParticipationData } from '@/services/ContentParticipationService';
import { getParticipationBridge } from '@/services/ParticipationBridge';
import { SAMPLE_TIPS, SAMPLE_QUESTIONS, SAMPLE_DEBATES, formatRelativeTime, formatNumber } from '@/data/content/explore';
import type { Tip, Question, Debate } from '@/data/content/explore';
import { nextActionService, type NextAction } from '@/services/NextActionService';
import { NextActionInline } from '@/components/NextActionCard';
import CommentSystem from '@/components/CommentSystem';
import { contentRecommendationService } from '@/services/ContentRecommendationService';
import PopularPolls from '@/components/content/PopularPolls';
import { getStablePollResults } from '@/components/content/useContentParticipation';
import { SUBJECT_CONFIG } from '@/data/config';
import { CHEMI_DATA } from '@/data';
import { RelatedContentSection, type RelatedItem } from '@/components/content/RelatedContentSection';

// ============================================================================
// 타입 정의
// ============================================================================

interface ContentExploreProps {
  onClose: () => void;
  initialTab?: 'quiz' | 'poll' | 'community';
  onStartTest?: (testKey: string) => void;
  onNavigate?: (target: 'ranking' | 'community') => void;
}

type TabType = 'quiz' | 'poll' | 'community';
type CommunitySubTab = 'tips' | 'qna' | 'debate';

// CATEGORY_LABELS는 @/data/content/categories에서 import

// SituationCategory → ContentCategory 매핑
const SITUATION_TO_CONTENT_CATEGORY: Record<SituationCategory, ContentCategory> = {
  relationship: 'love',      // 연애 카테고리
  work: 'lifestyle',         // 라이프스타일
  social: 'relationship',    // 관계 카테고리
  awkward: 'general',        // 일반
};

// ============================================================================
// 스트릭 배너 컴포넌트
// ============================================================================

interface StreakBannerProps {
  currentStreak: number;
  longestStreak: number;
  hasParticipatedToday: boolean;
}

function StreakBanner({ currentStreak, longestStreak, hasParticipatedToday }: StreakBannerProps) {
  if (currentStreak === 0 && !hasParticipatedToday) {
    return (
      <div className="bg-gradient-to-r from-slate-100 to-slate-50 rounded-2xl p-4 mb-4 border border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl flex items-center justify-center">
            <Flame className="w-5 h-5 text-slate-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-600">오늘 첫 참여를 시작하세요!</p>
            <p className="text-xs text-slate-400">퀴즈나 투표에 참여하면 스트릭이 시작됩니다</p>
          </div>
          <Zap className="w-5 h-5 text-slate-300" />
        </div>
      </div>
    );
  }

  return (
    <div className={`rounded-2xl p-4 mb-4 ${hasParticipatedToday
      ? 'bg-gradient-to-r from-orange-500 to-amber-500'
      : 'bg-gradient-to-r from-orange-400 to-amber-400'
      }`}>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-slate-50/20 rounded-xl flex items-center justify-center">
          <span className="text-2xl">🔥</span>
        </div>
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{currentStreak}</span>
            <span className="text-sm font-bold text-white/80">일 연속 참여!</span>
          </div>
          <p className="text-xs text-white/70">
            {hasParticipatedToday
              ? '오늘도 참여 완료!'
              : '오늘 참여하면 스트릭이 이어집니다'}
            {longestStreak > currentStreak && ` · 최고 기록: ${longestStreak}일`}
          </p>
        </div>
        {hasParticipatedToday && (
          <div className="w-8 h-8 bg-slate-50/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 핫 토픽 컴포넌트
// ============================================================================

interface HotTopicItemProps {
  rank: number;
  emoji: string;
  title: string;
  type: 'quiz' | 'poll';
  stat: string;
  onClick?: () => void;
}

function HotTopicItem({ rank, emoji, title, type, stat, onClick }: HotTopicItemProps) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-subtle hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
    >
      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${rank === 1 ? 'bg-amber-400 text-white' :
        rank === 2 ? 'bg-slate-300 text-white' :
          'bg-orange-200 text-orange-700'
        }`}>
        {rank}
      </span>
      <span className="text-lg">{emoji}</span>
      <div className="flex-1 text-left min-w-0">
        <p className="text-sm font-bold text-secondary truncate group-hover:text-orange-600">
          {title}
        </p>
        <p className="text-xs text-muted">
          {type === 'quiz' ? '퀴즈' : '투표'} · {stat}
        </p>
      </div>
      <TrendingUp className="w-4 h-4 text-orange-400 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
}

interface HotTopicsSectionProps {
  quizzes: typeof ALL_KNOWLEDGE_QUIZZES;
  polls: typeof VS_POLLS;
  participation: ContentParticipationData;
  onQuizClick: (quizId: string) => void;
  onPollClick: (pollId: string) => void;
}

function HotTopicsSection({ quizzes, polls, participation, onQuizClick, onPollClick }: HotTopicsSectionProps) {
  // 인기도 계산 (결정론적 - ID 기반)
  const getPopularityScore = (id: string) => {
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash + id.charCodeAt(i)) | 0;
    }
    return Math.abs(hash) % 1000;
  };

  // 아직 참여하지 않은 것 중에서 인기순 정렬
  const uncompletedQuizzes = quizzes
    .filter(q => !participation.quizzes.some(pq => pq.quizId === q.id))
    .map(q => ({ ...q, popularity: getPopularityScore(q.id) }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 2);

  const uncompletedPolls = polls
    .filter(p => !participation.polls.some(pp => pp.pollId === p.id))
    .map(p => ({ ...p, popularity: getPopularityScore(p.id) }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 2);

  // 퀴즈와 투표를 섞어서 상위 3개 선택
  const hotItems = [...uncompletedQuizzes.map(q => ({
    id: q.id,
    type: 'quiz' as const,
    title: q.question,
    emoji: getCategoryInfo(q.category).emoji,
    stat: `정답률 ${30 + (getPopularityScore(q.id) % 40)}%`,
    popularity: q.popularity,
  })), ...uncompletedPolls.map(p => ({
    id: p.id,
    type: 'poll' as const,
    title: p.question,
    emoji: getCategoryInfo(p.category).emoji,
    stat: `${100 + (getPopularityScore(p.id) % 900)}명 참여`,
    popularity: p.popularity,
  }))]
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 3);

  if (hotItems.length === 0) {
    return null;
  }

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
          <Flame className="w-3.5 h-3.5 text-white" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">지금 인기</h3>
        <span className="text-xs text-slate-400">참여하지 않은 콘텐츠 중</span>
      </div>
      <div className="space-y-2">
        {hotItems.map((item, index) => (
          <HotTopicItem
            key={item.id}
            rank={index + 1}
            emoji={item.emoji}
            title={item.title}
            type={item.type}
            stat={item.stat}
            onClick={() => item.type === 'quiz' ? onQuizClick(item.id) : onPollClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 카테고리 진행률 컴포넌트
// ============================================================================

interface CategoryProgressProps {
  quizzes: typeof ALL_KNOWLEDGE_QUIZZES;
  polls: typeof VS_POLLS;
  participation: ContentParticipationData;
  activeTab: 'quiz' | 'poll';
  onCategoryClick: (category: string) => void;
}

function CategoryProgress({ quizzes, polls, participation, activeTab, onCategoryClick }: CategoryProgressProps) {
  const categoryStats = useMemo(() => {
    if (activeTab === 'quiz') {
      // O(n) - 참여한 퀴즈 ID Set 생성
      const completedIds = new Set(participation.quizzes.map(pq => pq.quizId));

      // O(n) - 카테고리별 통계를 한 번의 순회로 집계
      const statsMap = new Map<string, { total: number; completed: number }>();
      for (const quiz of quizzes) {
        const stat = statsMap.get(quiz.category) || { total: 0, completed: 0 };
        stat.total++;
        if (completedIds.has(quiz.id)) stat.completed++;
        statsMap.set(quiz.category, stat);
      }

      return Array.from(statsMap.entries()).map(([category, { total, completed }]) => ({
        category,
        label: getCategoryInfo(category),
        total,
        completed,
        percent: Math.round((completed / total) * 100),
      }));
    } else {
      // O(n) - 참여한 투표 ID Set 생성
      const completedIds = new Set(participation.polls.map(pp => pp.pollId));

      // O(n) - 카테고리별 통계를 한 번의 순회로 집계
      const statsMap = new Map<string, { total: number; completed: number }>();
      for (const poll of polls) {
        const stat = statsMap.get(poll.category) || { total: 0, completed: 0 };
        stat.total++;
        if (completedIds.has(poll.id)) stat.completed++;
        statsMap.set(poll.category, stat);
      }

      return Array.from(statsMap.entries()).map(([category, { total, completed }]) => ({
        category,
        label: getCategoryInfo(category),
        total,
        completed,
        percent: Math.round((completed / total) * 100),
      }));
    }
  }, [quizzes, polls, participation, activeTab]);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
          <Trophy className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <h3 className="text-sm font-bold text-slate-700">카테고리별 진행률</h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
        {categoryStats.map(({ category, label, total, completed, percent }) => (
          <button
            key={category}
            onClick={() => onCategoryClick(category)}
            className="p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all text-left group"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{label?.emoji}</span>
              <span className="text-xs font-bold text-slate-600 truncate">{label?.name}</span>
            </div>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
              <div
                className={`h-full rounded-full transition-all ${percent === 100 ? 'bg-emerald-500' : 'bg-indigo-500'
                  }`}
                style={{ width: `${percent}%` }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-400">{completed}/{total}</span>
              {percent === 100 && (
                <span className="text-xs text-emerald-500 font-bold">완료!</span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 퀴즈 카드 컴포넌트
// ============================================================================

interface QuizCardProps {
  quiz: KnowledgeQuiz;
  isAnswered: boolean;
  previousAnswer?: string;
  onAnswer: (quizId: string, optionId: string, isCorrect: boolean) => void;
  onNextAction?: (action: NextAction) => void;
  allQuizzes?: KnowledgeQuiz[];
  answeredQuizIds?: string[];
}

function QuizCard({ quiz, isAnswered, previousAnswer, onAnswer, onNextAction, allQuizzes = [], answeredQuizIds = [] }: QuizCardProps) {
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

// ============================================================================
// 투표 카드 컴포넌트
// ============================================================================

interface PollCardProps {
  poll: VSPoll;
  isVoted: boolean;
  previousVote?: 'a' | 'b';
  onVote: (pollId: string, choice: 'a' | 'b') => void;
  onNextAction?: (action: NextAction) => void;
  allPolls?: VSPoll[];
  votedPollIds?: string[];
}

function PollCard({ poll, isVoted, previousVote, onVote, onNextAction, allPolls = [], votedPollIds = [] }: PollCardProps) {
  const [localVoted, setLocalVoted] = useState<'a' | 'b' | null>(null);
  const [showComments, setShowComments] = useState(false);
  // total: null=로딩중, -1=API실패, 0=첫투표, >0=실제통계
  const [realStats, setRealStats] = useState<{ a: number; b: number; total: number } | null>(null);
  const voted = previousVote ?? localVoted;
  // API 실패(-1) 또는 0표 시 균등 분포 표시 (가짜 통계 방지)
  const hasRealVotes = realStats && realStats.total > 0;
  const results = hasRealVotes ? { a: realStats.a, b: realStats.b } : { a: 50, b: 50 };

  // 투표 후 실제 통계 가져오기
  useEffect(() => {
    if (!voted || realStats) return;

    const controller = new AbortController();

    fetch(`/api/poll?pollId=${poll.id}`, { signal: controller.signal })
      .then(res => res.json())
      .then(data => {
        // totalVotes가 0 이상이면 통계 표시 (0표도 유효한 상태)
        if (typeof data.totalVotes === 'number') {
          const aOpt = data.options?.find((o: { optionId: string }) => o.optionId === 'a');
          const bOpt = data.options?.find((o: { optionId: string }) => o.optionId === 'b');
          setRealStats({
            a: aOpt?.percentage ?? 50,
            b: bOpt?.percentage ?? 50,
            total: data.totalVotes,
          });
        } else {
          // API 응답이 비정상인 경우
          setRealStats({ a: 50, b: 50, total: -1 });
        }
      })
      .catch((error) => {
        // AbortError는 정상적인 cleanup이므로 무시
        if (error.name === 'AbortError') return;
        // API 실패 시 명시적으로 실패 상태 설정
        setRealStats({ a: 50, b: 50, total: -1 });
      });

    return () => controller.abort();
  }, [voted, poll.id, realStats]);

  // 다음 액션 추천
  const nextActions = voted
    ? nextActionService.getRecommendations({
      endpoint: 'poll_result',
      category: poll.category,
    }).slice(0, 2)
    : [];

  // 관련 투표 추천 (태그 기반, 미참여 우선) - RelatedItem 형식으로 변환
  const relatedPollItems = useMemo((): RelatedItem[] => {
    if (!voted || allPolls.length === 0) return [];
    const similar = contentRecommendationService.getSimilarPolls(poll, allPolls, 6);
    return similar
      .filter(s => !votedPollIds.includes(s.content.id))
      .slice(0, 3)
      .map(s => ({
        id: s.content.id,
        title: s.content.question,
        category: s.content.category,
        reason: s.reason,
      }));
  }, [voted, poll, allPolls, votedPollIds]);

  // 관련 투표 클릭 시 스크롤 이동
  const handlePollSelect = useCallback((pollId: string) => {
    const element = document.getElementById(`poll-${pollId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element.classList.add('ring-2', 'ring-purple-400');
      setTimeout(() => element.classList.remove('ring-2', 'ring-purple-400'), 2000);
    }
  }, []);

  const handleVote = (choice: 'a' | 'b') => {
    if (voted) return;
    setLocalVoted(choice);
    onVote(poll.id, choice);
  };

  const categoryInfo = getCategoryInfo(poll.category);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-3">
        <Vote className="w-4 h-4 text-purple-500" />
        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full">
          {categoryInfo.emoji} {categoryInfo.name}
        </span>
        {(isVoted || voted) && (
          <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full ml-auto flex items-center gap-1">
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
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-purple-200 bg-slate-50 hover:border-purple-300 hover:bg-purple-50'
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
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-pink-200 bg-slate-50 hover:border-pink-300 hover:bg-pink-50'
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

      {/* 참여자 수 표시 */}
      {voted && (
        <div className="mt-3 text-center">
          <span className="text-xs text-slate-400">
            {hasRealVotes
              ? `${realStats.total.toLocaleString()}명 참여`
              : realStats?.total === 0
                ? '첫 번째 투표입니다! 🎉'
                : realStats?.total === -1
                  ? '투표가 기록되었습니다'
                  : '통계 로딩 중...'}
          </span>
        </div>
      )}

      {/* 다음 액션 추천 */}
      {voted && nextActions.length > 0 && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <NextActionInline actions={nextActions} onActionClick={onNextAction} />
        </div>
      )}

      {/* 관련 투표 더보기 */}
      {voted && (
        <RelatedContentSection
          items={relatedPollItems}
          onSelect={handlePollSelect}
          contentType="poll"
        />
      )}

      {/* 댓글 토글 버튼 */}
      {voted && (
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
      {voted && showComments && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <CommentSystem
            targetType="poll"
            targetId={poll.id}
            placeholder="이 투표에 대한 의견을 남겨보세요..."
            maxDisplay={3}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 커뮤니티 - 팁 카드 컴포넌트
// ============================================================================

interface TipCardProps {
  tip: Tip;
  onNextAction?: (action: NextAction) => void;
}

function TipCard({ tip, onNextAction }: TipCardProps) {
  // 팁 카테고리 기반 다음 액션
  const nextActions = nextActionService.getRecommendations({
    endpoint: 'community_view',
    category: tip.category,
  }).filter(a => a.type === 'test').slice(0, 1);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center text-lg flex-shrink-0">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {tip.featured && (
              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded">
                베스트
              </span>
            )}
            <span className="text-xs text-gray-400">{tip.author.name}</span>
            {tip.author.badge && (
              <span className="text-xs text-indigo-500">{tip.author.badge}</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-800 mb-2">{tip.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{tip.content}</p>
          <div className="flex items-center gap-3 mt-3">
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-amber-500 transition-colors">
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>{formatNumber(tip.reactions.helpful)}</span>
            </button>
            <button className="flex items-center gap-1 text-xs text-gray-500 hover:text-indigo-500 transition-colors">
              <Bookmark className="w-3.5 h-3.5" />
              <span>{formatNumber(tip.reactions.saved)}</span>
            </button>
            <div className="flex gap-1 ml-auto">
              {tip.tags.slice(0, 2).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* 관련 테스트 추천 */}
          {nextActions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <NextActionInline actions={nextActions} onActionClick={onNextAction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 커뮤니티 - Q&A 카드 컴포넌트
// ============================================================================

interface QnACardProps {
  question: Question;
  onNextAction?: (action: NextAction) => void;
}

function QnACard({ question, onNextAction }: QnACardProps) {
  // Q&A 카테고리 기반 다음 액션
  const nextActions = nextActionService.getRecommendations({
    endpoint: 'community_view',
    category: question.category,
  }).filter(a => a.type === 'test').slice(0, 1);

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-subtle">
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${question.status === 'answered'
          ? 'bg-gradient-to-br from-emerald-100 to-green-100'
          : 'bg-gradient-to-br from-blue-100 to-indigo-100'
          }`}>
          {question.status === 'answered' ? '✅' : '❓'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${question.status === 'answered'
              ? 'bg-emerald-100 text-emerald-700'
              : 'bg-blue-100 text-blue-700'
              }`}>
              {question.status === 'answered' ? '답변완료' : '답변대기'}
            </span>
            <span className="text-xs text-muted">{question.author.nickname}</span>
            {question.author.resultBadge && (
              <span className="text-xs text-indigo-500">{question.author.resultBadge}</span>
            )}
          </div>
          <h3 className="font-bold text-sm text-slate-800 mb-2">{question.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed line-clamp-2">{question.content}</p>
          <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
            <span>답변 {question.answerCount}</span>
            <span>조회 {formatNumber(question.viewCount)}</span>
            <span>{formatRelativeTime(question.createdAt)}</span>
            <ChevronRight className="w-4 h-4 ml-auto text-gray-300" />
          </div>

          {/* 관련 테스트 추천 */}
          {nextActions.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <NextActionInline actions={nextActions} onActionClick={onNextAction} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 커뮤니티 - 토론/밸런스 카드 컴포넌트
// ============================================================================

interface DebateCardProps {
  debate: Debate;
  onNextAction?: (action: NextAction) => void;
}

function DebateCard({ debate, onNextAction }: DebateCardProps) {
  const [voted, setVoted] = useState<'a' | 'b' | null>(null);
  const totalVotes = debate.totalVotes + (voted ? 1 : 0);
  const aPercent = Math.round(((debate.optionA.votes + (voted === 'a' ? 1 : 0)) / totalVotes) * 100);
  const bPercent = 100 - aPercent;

  // 투표 후 다음 액션 추천
  const nextActions = voted
    ? nextActionService.getRecommendations({
      endpoint: 'community_view',
      category: debate.category,
    }).filter(a => a.type === 'test').slice(0, 1)
    : [];

  return (
    <div className="bg-slate-50 rounded-2xl p-4 shadow-sm border border-subtle">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-lg">⚔️</span>
        <span className="font-bold text-sm text-primary">{debate.title}</span>
        {debate.status === 'active' && (
          <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-xs font-bold rounded ml-auto">
            진행중
          </span>
        )}
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => !voted && setVoted('a')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'a' ? 'border-purple-400 bg-purple-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-purple-200 bg-slate-50 hover:border-purple-300'
            }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{debate.optionA.emoji}</span>
            <span className="text-xs font-bold text-slate-700 block">{debate.optionA.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-purple-600">{aPercent}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-purple-200/50 transition-all duration-500"
              style={{ height: `${aPercent}%` }}
            />
          )}
        </button>

        <div className="flex items-center">
          <span className="text-xs font-black text-slate-400">VS</span>
        </div>

        <button
          onClick={() => !voted && setVoted('b')}
          disabled={!!voted}
          className={`flex-1 relative overflow-hidden rounded-xl border-2 transition-all ${voted === 'b' ? 'border-pink-400 bg-pink-50' :
            voted ? 'border-gray-200 bg-gray-50' :
              'border-pink-200 bg-slate-50 hover:border-pink-300'
            }`}
        >
          <div className="p-3 text-center relative z-10">
            <span className="text-2xl block mb-1">{debate.optionB.emoji}</span>
            <span className="text-xs font-bold text-slate-700 block">{debate.optionB.text}</span>
            {voted && (
              <div className="mt-2 text-lg font-black text-pink-600">{bPercent}%</div>
            )}
          </div>
          {voted && (
            <div
              className="absolute bottom-0 left-0 right-0 bg-pink-200/50 transition-all duration-500"
              style={{ height: `${bPercent}%` }}
            />
          )}
        </button>
      </div>

      <div className="mt-3 text-center text-xs text-gray-400">
        {formatNumber(totalVotes)}명 참여
      </div>

      {/* 투표 후 관련 테스트 추천 */}
      {voted && nextActions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <NextActionInline actions={nextActions} onActionClick={onNextAction} />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 커뮤니티 탭 콘텐츠
// ============================================================================

interface CommunityContentProps {
  onNextAction?: (action: NextAction) => void;
}

function CommunityContent({ onNextAction }: CommunityContentProps) {
  const [subTab, setSubTab] = useState<CommunitySubTab>('tips');

  return (
    <div>
      {/* 서브 탭 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setSubTab('tips')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${subTab === 'tips'
            ? 'bg-amber-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <Lightbulb className="w-3.5 h-3.5 inline mr-1" />
          팁 베스트
        </button>
        <button
          onClick={() => setSubTab('qna')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${subTab === 'qna'
            ? 'bg-emerald-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          <MessageCircle className="w-3.5 h-3.5 inline mr-1" />
          Q&A
        </button>
        <button
          onClick={() => setSubTab('debate')}
          className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${subTab === 'debate'
            ? 'bg-rose-500 text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          ⚔️ 토론
        </button>
      </div>

      {/* 콘텐츠 */}
      <div className="space-y-3">
        {subTab === 'tips' && (
          <>
            {SAMPLE_TIPS.filter(t => t.featured).map(tip => (
              <TipCard key={tip.id} tip={tip} onNextAction={onNextAction} />
            ))}
            <div className="text-center py-4">
              <button className="text-xs text-indigo-500 font-medium hover:underline">
                더 많은 팁 보기 →
              </button>
            </div>
          </>
        )}
        {subTab === 'qna' && (
          <>
            {SAMPLE_QUESTIONS.map(question => (
              <QnACard key={question.id} question={question} onNextAction={onNextAction} />
            ))}
            <div className="text-center py-4">
              <button className="px-4 py-2 bg-emerald-500 text-white text-xs font-bold rounded-xl hover:bg-emerald-600 transition-colors">
                질문하기
              </button>
            </div>
          </>
        )}
        {subTab === 'debate' && (
          <>
            {SAMPLE_DEBATES.map(debate => (
              <DebateCard key={debate.id} debate={debate} onNextAction={onNextAction} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================================
// 우측 사이드바 (크로스 프로모션) - PC용
// ============================================================================
function ContentDiscoverySidebar({ onNavigate, onStartTest }: { onNavigate?: (target: string) => void; onStartTest?: (key: string) => void }) {
  // HOT 커뮤니티 글
  const hotPosts = [...MOCK_COMMUNITY_POSTS].sort((a, b) => b.likes - a.likes).slice(0, 3);

  // 추천 테스트 (랭킹 가능한 테스트)
  const recommendedTests = RANKABLE_TESTS.slice(0, 3);

  return (
    <aside className="hidden xl:block w-80 flex-shrink-0">
      <div className="sticky top-4 space-y-4">
        {/* 랭킹 바로가기 */}
        <section className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-2xl p-4 text-white">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-slate-50/20 rounded-xl flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold">랭킹 보기</h3>
              <p className="text-white/80 text-xs">테스트 결과 순위 확인</p>
            </div>
          </div>
          <button
            onClick={() => onNavigate?.('ranking')}
            className="w-full py-2 bg-slate-50/20 hover:bg-slate-50/30 rounded-xl text-sm font-bold transition-colors"
          >
            전체 랭킹 보기 →
          </button>
        </section>

        {/* HOT 커뮤니티 */}
        <section className="bg-slate-50 rounded-2xl border border-subtle shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-500 to-orange-500 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">HOT 게시물</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {hotPosts.map((post, index) => (
              <button
                key={post.id}
                onClick={() => onNavigate?.('community')}
                className="w-full flex items-start gap-2 p-2.5 bg-slate-50 rounded-xl hover:bg-rose-50 transition-colors text-left group"
              >
                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${index === 0 ? 'bg-amber-400 text-white' :
                  index === 1 ? 'bg-slate-300 text-white' :
                    'bg-orange-200 text-orange-700'
                  }`}>
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate group-hover:text-rose-600">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-slate-400">
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3" /> {post.likes}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageCircle className="w-3 h-3" /> {post.comments}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 추천 테스트 */}
        <section className="bg-slate-50 rounded-2xl border border-subtle shadow-sm overflow-hidden">
          <div className="px-4 pt-4 pb-3 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">추천 테스트</h3>
          </div>
          <div className="px-3 pb-3 space-y-2">
            {recommendedTests.map((test) => {
              const config = SUBJECT_CONFIG[test.key as keyof typeof SUBJECT_CONFIG];
              const data = CHEMI_DATA[test.key as keyof typeof CHEMI_DATA];
              if (!config || !data) return null;
              const IconComponent = getIconComponent(config.icon);

              return (
                <button
                  key={test.key}
                  onClick={() => onStartTest?.(test.key)}
                  className="w-full flex items-center gap-3 p-2.5 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors group"
                >
                  <div className="w-9 h-9 bg-slate-50 rounded-lg flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <IconComponent mood="happy" className="w-7 h-7" />
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <p className="text-xs font-bold text-slate-700 truncate group-hover:text-indigo-600">
                      {data.title}
                    </p>
                    <p className="text-xs text-slate-400">
                      {data.resultLabels?.length || 0}가지 결과
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-400" />
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </aside>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function ContentExplore({ onClose, initialTab = 'quiz', onStartTest, onNavigate }: ContentExploreProps) {
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [participation, setParticipation] = useState(contentParticipationService.getParticipation());
  const [showUncompletedOnly, setShowUncompletedOnly] = useState(false);
  const [focusedItemId, setFocusedItemId] = useState<string | null>(null);
  const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // 스트릭 데이터
  const streak = contentParticipationService.getStreak();
  const hasParticipatedToday = contentParticipationService.hasParticipatedToday();

  // 아이템 ref 설정 콜백
  const setItemRef = useCallback((id: string, element: HTMLDivElement | null) => {
    if (element) {
      itemRefs.current.set(id, element);
    } else {
      itemRefs.current.delete(id);
    }
  }, []);

  // 포커스된 아이템으로 스크롤
  useEffect(() => {
    if (focusedItemId) {
      // 약간의 지연 후 스크롤 (DOM 렌더링 대기)
      const timer = setTimeout(() => {
        const element = itemRefs.current.get(focusedItemId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        // 포커스 표시 3초 후 해제
        setTimeout(() => setFocusedItemId(null), 3000);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [focusedItemId]);

  useEffect(() => {
    const handleUpdated = () => {
      setParticipation(contentParticipationService.getParticipation());
    };

    window.addEventListener('chemi_content_participation_updated', handleUpdated);
    return () => window.removeEventListener('chemi_content_participation_updated', handleUpdated);
  }, []);

  // 퀴즈 필터링 (안 푼 것만 보기 옵션 포함)
  const filteredQuizzes = useMemo(() => {
    return ALL_KNOWLEDGE_QUIZZES.filter(q => {
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
      const isAnswered = participation.quizzes.some(pq => pq.quizId === q.id);
      const matchesCompletionFilter = !showUncompletedOnly || !isAnswered;
      return matchesCategory && matchesSearch && matchesCompletionFilter;
    });
  }, [selectedCategory, searchQuery, showUncompletedOnly, participation.quizzes]);

  // 투표 필터링 (안 푼 것만 보기 옵션 포함)
  const filteredPolls = useMemo(() => {
    return VS_POLLS.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.question.toLowerCase().includes(searchQuery.toLowerCase());
      const isVoted = participation.polls.some(pp => pp.pollId === p.id);
      const matchesCompletionFilter = !showUncompletedOnly || !isVoted;
      return matchesCategory && matchesSearch && matchesCompletionFilter;
    });
  }, [selectedCategory, searchQuery, showUncompletedOnly, participation.polls]);

  // 상황별 반응 필터링 (poll 탭에 통합)
  const filteredSituations = useMemo(() => {
    return ALL_SITUATION_REACTIONS.filter(s => {
      // SituationCategory를 ContentCategory로 매핑하여 필터링
      const mappedCategory = SITUATION_TO_CONTENT_CATEGORY[s.category];
      const matchesCategory = selectedCategory === 'all' || mappedCategory === selectedCategory;
      const matchesSearch = s.situation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.question.toLowerCase().includes(searchQuery.toLowerCase());
      const isAnswered = participation.situations?.some(ps => ps.situationId === s.id) || false;
      const matchesCompletionFilter = !showUncompletedOnly || !isAnswered;
      return matchesCategory && matchesSearch && matchesCompletionFilter;
    });
  }, [selectedCategory, searchQuery, showUncompletedOnly, participation.situations]);

  // 퀴즈 정답 처리
  // ContentParticipationService: UI 상태 (참여 여부 표시용)
  // ParticipationBridge: TursoService + GamificationService 통합 (DB 저장 + 배지/포인트)
  const handleQuizAnswer = async (quizId: string, optionId: string, isCorrect: boolean) => {
    // UI 상태 업데이트 (로컬 참여 기록)
    contentParticipationService.recordQuizAnswer(quizId, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());

    // 게이미피케이션 연동 (배지/포인트만 처리, DB 저장은 별도)
    const quiz = ALL_KNOWLEDGE_QUIZZES.find(q => q.id === quizId);
    const bridge = getParticipationBridge();
    if (bridge && quiz) {
      await bridge.recordQuizAnswer(quizId, 0, optionId, isCorrect, quiz.category);
    }
  };

  // 투표 처리
  const handlePollVote = async (pollId: string, choice: 'a' | 'b') => {
    // UI 상태 업데이트 (로컬 참여 기록)
    contentParticipationService.recordPollVote(pollId, choice);
    setParticipation(contentParticipationService.getParticipation());

    // 게이미피케이션 연동
    const poll = VS_POLLS.find(p => p.id === pollId);
    const bridge = getParticipationBridge();
    if (bridge && poll) {
      // 소수 의견 판단용 통계 (getStablePollResults는 ID 기반 결정론적 값)
      const results = getStablePollResults(pollId);
      const pollStats = {
        totalVotes: 100,
        optionVotes: {
          'a': results.a,
          'b': results.b,
        },
      };
      await bridge.recordPollVote(pollId, choice, pollStats, poll.category);
    }
  };

  // 상황별 반응 처리
  const handleSituationAnswer = (situationId: string, optionId: string) => {
    // UI 상태 업데이트 (로컬 참여 기록)
    contentParticipationService.recordSituationAnswer(situationId, optionId);
    setParticipation(contentParticipationService.getParticipation());

    // TODO: 게이미피케이션 연동 (상황별 반응도 배지/포인트 부여)
  };

  // 다음 액션 처리
  const handleNextAction = (action: NextAction) => {
    // 액션 타입에 따라 탭 전환 또는 화면 이동
    switch (action.type) {
      case 'quiz':
        setActiveTab('quiz');
        if (action.targetCategory) {
          setSelectedCategory(action.targetCategory as ContentCategory);
        }
        break;
      case 'poll':
        setActiveTab('poll');
        if (action.targetCategory) {
          setSelectedCategory(action.targetCategory as ContentCategory);
        }
        break;
      case 'community':
        setActiveTab('community');
        break;
      case 'test':
        // 테스트로 이동 - ContentExplore 닫고 특정 테스트 시작
        onClose();
        if (action.targetId && onStartTest) {
          onStartTest(action.targetId);
        }
        break;
      case 'share':
        // 공유 기능 (추후 구현)
        break;
      default:
        break;
    }
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
  const availableCategories = useMemo(() => {
    if (activeTab === 'quiz') {
      return [...new Set(ALL_KNOWLEDGE_QUIZZES.map(q => q.category))];
    }
    if (activeTab === 'poll') {
      return [...new Set(VS_POLLS.map(p => p.category))];
    }
    return [];
  }, [activeTab]);

  // 헤더 타이틀 & 서브타이틀
  const getHeaderInfo = () => {
    switch (activeTab) {
      case 'quiz':
        return {
          title: '퀴즈 & 투표',
          subtitle: `${stats.quizAnswered}/${stats.quizTotal} 참여 · 정답률 ${stats.quizAnswered > 0 ? Math.round((stats.quizCorrect / stats.quizAnswered) * 100) : 0}%`,
        };
      case 'poll':
        return {
          title: '퀴즈 & 투표',
          subtitle: `${stats.pollVoted}/${stats.pollTotal} 투표 완료`,
        };
      case 'community':
        return {
          title: '커뮤니티',
          subtitle: '팁, Q&A, 토론에 참여하세요!',
        };
      default:
        return { title: '퀴즈 & 투표', subtitle: '' };
    }
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col lg:left-60">
      {/* 헤더 */}
      <PageHeader
        title={headerInfo.title}
        subtitle={headerInfo.subtitle}
        onBack={onClose}
      >
        {/* 메인 탭 */}
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => { setActiveTab('quiz'); setSelectedCategory('all'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'quiz'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <HelpCircle className="w-3.5 h-3.5" />
            퀴즈
          </button>
          <button
            onClick={() => { setActiveTab('poll'); setSelectedCategory('all'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'poll'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <Vote className="w-3.5 h-3.5" />
            투표
          </button>
          <button
            onClick={() => { setActiveTab('community'); setSelectedCategory('all'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'community'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            커뮤니티
          </button>
        </div>

        {/* 검색 바 */}
        {activeTab !== 'community' && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={`${activeTab === 'quiz' ? '퀴즈' : '투표'} 검색...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-gray-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-gray-400" />
              </button>
            )}
          </div>
        )}

        {/* 카테고리 필터 */}
        {activeTab !== 'community' && (
          <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === 'all'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
            >
              전체
            </button>
            {availableCategories.map((cat) => {
              const labelInfo = getCategoryInfo(cat);

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                >
                  {labelInfo.emoji} {labelInfo.name}
                </button>
              );
            })}
          </div>
        )}

        {/* 안 푼 것만 보기 토글 */}
        {activeTab !== 'community' && (
          <div className="flex items-center justify-between mt-3 py-2 px-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                {activeTab === 'quiz'
                  ? `${stats.quizTotal - stats.quizAnswered}개 남음`
                  : `${stats.pollTotal - stats.pollVoted}개 남음`
                }
              </span>
            </div>
            <button
              onClick={() => setShowUncompletedOnly(!showUncompletedOnly)}
              role="switch"
              aria-checked={showUncompletedOnly}
              aria-label="안 한 것만 보기"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${showUncompletedOnly
                ? 'bg-indigo-100 text-indigo-700'
                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
            >
              <div
                className={`w-8 h-4 rounded-full transition-colors relative ${showUncompletedOnly ? 'bg-indigo-500' : 'bg-slate-300'
                  }`}
                aria-hidden="true"
              >
                <div className={`absolute top-0.5 w-3 h-3 bg-slate-50 rounded-full shadow transition-transform ${showUncompletedOnly ? 'translate-x-4' : 'translate-x-0.5'
                  }`} />
              </div>
              안 한 것만
            </button>
          </div>
        )}
      </PageHeader>

      {/* 콘텐츠 */}
      <div className="flex-1 overflow-y-auto pb-24 lg:pb-6">
        <div className="max-w-6xl mx-auto px-4 py-4 xl:flex xl:gap-6">
          {/* 메인 콘텐츠 영역 */}
          <div className="flex-1 min-w-0 max-w-2xl mx-auto xl:mx-0">
            {/* 스트릭 배너 - 퀴즈/투표 탭에서 표시 */}
            {activeTab !== 'community' && (
              <StreakBanner
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
                hasParticipatedToday={hasParticipatedToday}
              />
            )}

            {/* 핫 토픽 섹션 - 전체 카테고리일 때만 */}
            {activeTab !== 'community' && selectedCategory === 'all' && !showUncompletedOnly && (
              <HotTopicsSection
                quizzes={ALL_KNOWLEDGE_QUIZZES}
                polls={VS_POLLS}
                participation={participation}
                onQuizClick={(quizId) => {
                  setActiveTab('quiz');
                  setFocusedItemId(quizId);
                }}
                onPollClick={(pollId) => {
                  setActiveTab('poll');
                  setFocusedItemId(pollId);
                }}
              />
            )}

            {/* 카테고리별 진행률 - 전체 카테고리일 때만 */}
            {activeTab !== 'community' && selectedCategory === 'all' && !showUncompletedOnly && (
              <CategoryProgress
                quizzes={ALL_KNOWLEDGE_QUIZZES}
                polls={VS_POLLS}
                participation={participation}
                activeTab={activeTab}
                onCategoryClick={(category) => setSelectedCategory(category)}
              />
            )}

            <div className="space-y-3">
              {activeTab === 'quiz' && (
                filteredQuizzes.length > 0 ? (
                  filteredQuizzes.map((quiz) => {
                    const answered = participation.quizzes.find(q => q.quizId === quiz.id);
                    const isFocused = focusedItemId === quiz.id;
                    return (
                      <div
                        key={quiz.id}
                        id={`quiz-${quiz.id}`}
                        ref={(el) => setItemRef(quiz.id, el)}
                        className={isFocused ? 'ring-2 ring-orange-400 ring-offset-2 rounded-2xl transition-all' : 'transition-all'}
                      >
                        <QuizCard
                          quiz={quiz}
                          isAnswered={!!answered}
                          previousAnswer={answered?.selectedOption}
                          onAnswer={handleQuizAnswer}
                          onNextAction={handleNextAction}
                          allQuizzes={filteredQuizzes}
                          answeredQuizIds={participation.quizzes.map(q => q.quizId)}
                        />
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-12 text-gray-400">
                    <p>이 카테고리에 퀴즈가 없습니다</p>
                  </div>
                )
              )}
              {activeTab === 'poll' && (
                <>
                  {/* 인기 투표 섹션 (카테고리가 '전체'일 때, showUncompletedOnly일 때만) */}
                  {selectedCategory === 'all' && showUncompletedOnly && (
                    <PopularPolls className="mb-4" limit={3} showCreateButton={true} />
                  )}

                  {/* VS 투표 목록 */}
                  {filteredPolls.length > 0 && (
                    filteredPolls.map((poll) => {
                      const voted = participation.polls.find(p => p.pollId === poll.id);
                      const isFocused = focusedItemId === poll.id;
                      return (
                        <div
                          key={poll.id}
                          id={`poll-${poll.id}`}
                          ref={(el) => setItemRef(poll.id, el)}
                          className={isFocused ? 'ring-2 ring-orange-400 ring-offset-2 rounded-2xl transition-all' : 'transition-all'}
                        >
                          <PollCard
                            poll={poll}
                            isVoted={!!voted}
                            previousVote={voted?.choice}
                            onVote={handlePollVote}
                            onNextAction={handleNextAction}
                            allPolls={filteredPolls}
                            votedPollIds={participation.polls.map(p => p.pollId)}
                          />
                        </div>
                      );
                    })
                  )}

                  {/* 상황별 반응 섹션 */}
                  {filteredSituations.length > 0 && (
                    <>
                      {filteredPolls.length > 0 && (
                        <div className="flex items-center gap-2 my-4">
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                          <span className="text-xs font-medium text-blue-500 px-3 py-1 bg-blue-50 rounded-full">
                            💬 상황별 반응
                          </span>
                          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
                        </div>
                      )}
                      {filteredSituations.map((situation) => {
                        const answered = participation.situations?.find(s => s.situationId === situation.id);
                        const isFocused = focusedItemId === situation.id;
                        return (
                          <div
                            key={situation.id}
                            id={`situation-${situation.id}`}
                            ref={(el) => setItemRef(situation.id, el)}
                            className={isFocused ? 'ring-2 ring-blue-400 ring-offset-2 rounded-2xl transition-all' : 'transition-all'}
                          >
                            <SituationReactionCard
                              situation={situation}
                              isAnswered={!!answered}
                              previousAnswer={answered?.selectedOption}
                              onAnswer={handleSituationAnswer}
                              allSituations={filteredSituations}
                              answeredSituationIds={participation.situations?.map(s => s.situationId) || []}
                            />
                          </div>
                        );
                      })}
                    </>
                  )}

                  {/* 아무 콘텐츠도 없을 때 */}
                  {filteredPolls.length === 0 && filteredSituations.length === 0 && (
                    <div className="text-center py-12 text-gray-400">
                      <p>이 카테고리에 투표가 없습니다</p>
                    </div>
                  )}
                </>
              )}
              {activeTab === 'community' && (
                <CommunityContent onNextAction={handleNextAction} />
              )}
            </div>
          </div>

          {/* 우측 사이드바 - PC용 */}
          <ContentDiscoverySidebar
            onNavigate={(target) => {
              if (target === 'ranking' || target === 'community') {
                onClose();
                onNavigate?.(target);
              }
            }}
            onStartTest={(key) => {
              onClose();
              onStartTest?.(key);
            }}
          />
        </div>
      </div>
    </div>
  );
}
