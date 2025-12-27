'use client';

import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { HelpCircle, Vote, MessageCircle, Search, X } from 'lucide-react';
import PageHeader from '@/components/PageHeader';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls';
import { getCategoryInfo } from '@/data/content/categories';
import { ALL_SITUATION_REACTIONS } from '@/data/content/situation-reactions';
import { SituationReactionCard } from '@/components/content/SituationReactionCard';
import { contentParticipationService } from '@/services/ContentParticipationService';
import { getParticipationBridge } from '@/services/ParticipationBridge';
import { nextActionService, type NextAction } from '@/services/NextActionService';
import PopularPolls from '@/components/content/PopularPolls';
import { getStablePollResults } from '@/components/content/useContentParticipation';
import type { ContentCategory } from '@/data/content/types';
import type { TabType } from './content/explore/types';
import { SITUATION_TO_CONTENT_CATEGORY } from './content/explore/types';
import StreakBanner from './content/explore/StreakBanner';
import HotTopicsSection from './content/explore/HotTopicsSection';
import CategoryProgress from './content/explore/CategoryProgress';
import { QuizCard } from './content/explore/QuizTab';
import { PollCard } from './content/explore/PollTab';
import CommunityContent from './content/explore/CommunityTab';
import ContentDiscoverySidebar from './content/explore/ContentDiscoverySidebar';
import { trackQuizAnswer, trackPollVote, trackReaction } from '@/lib/analytics';

interface ContentExploreProps {
  onClose: () => void;
  initialTab?: 'quiz' | 'poll' | 'community';
  onStartTest?: (testKey: string) => void;
  onNavigate?: (target: 'ranking' | 'community') => void;
}

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
    if (!focusedItemId) return;

    let timer1: ReturnType<typeof setTimeout> | null = null;
    let timer2: ReturnType<typeof setTimeout> | null = null;

    timer1 = setTimeout(() => {
      const element = itemRefs.current.get(focusedItemId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      timer2 = setTimeout(() => setFocusedItemId(null), 3000);
    }, 100);

    return () => {
      if (timer1) clearTimeout(timer1);
      if (timer2) clearTimeout(timer2);
    };
  }, [focusedItemId]);

  useEffect(() => {
    const handleUpdated = () => {
      setParticipation(contentParticipationService.getParticipation());
    };

    window.addEventListener('chemi_content_participation_updated', handleUpdated);
    return () => window.removeEventListener('chemi_content_participation_updated', handleUpdated);
  }, []);

  // 퀴즈 필터링
  const filteredQuizzes = useMemo(() => {
    return ALL_KNOWLEDGE_QUIZZES.filter(q => {
      const matchesCategory = selectedCategory === 'all' || q.category === selectedCategory;
      const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase());
      const isAnswered = participation.quizzes.some(pq => pq.quizId === q.id);
      const matchesCompletionFilter = !showUncompletedOnly || !isAnswered;
      return matchesCategory && matchesSearch && matchesCompletionFilter;
    });
  }, [selectedCategory, searchQuery, showUncompletedOnly, participation.quizzes]);

  // 투표 필터링
  const filteredPolls = useMemo(() => {
    return VS_POLLS.filter(p => {
      const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchesSearch = p.question.toLowerCase().includes(searchQuery.toLowerCase());
      const isVoted = participation.polls.some(pp => pp.pollId === p.id);
      const matchesCompletionFilter = !showUncompletedOnly || !isVoted;
      return matchesCategory && matchesSearch && matchesCompletionFilter;
    });
  }, [selectedCategory, searchQuery, showUncompletedOnly, participation.polls]);

  // 상황별 반응 필터링
  const filteredSituations = useMemo(() => {
    return ALL_SITUATION_REACTIONS.filter(s => {
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
  const handleQuizAnswer = async (quizId: string, optionId: string, isCorrect: boolean) => {
    // GA4 추적: 퀴즈 응답
    trackQuizAnswer(quizId, isCorrect);

    contentParticipationService.recordQuizAnswer(quizId, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());

    const quiz = ALL_KNOWLEDGE_QUIZZES.find(q => q.id === quizId);
    const bridge = getParticipationBridge();
    if (bridge && quiz) {
      await bridge.recordQuizAnswer(quizId, 0, optionId, isCorrect, quiz.category);
    }
  };

  // 투표 처리
  const handlePollVote = async (pollId: string, choice: 'a' | 'b') => {
    // GA4 추적: 투표 참여
    trackPollVote(pollId, choice);

    contentParticipationService.recordPollVote(pollId, choice);
    setParticipation(contentParticipationService.getParticipation());

    const poll = VS_POLLS.find(p => p.id === pollId);
    const bridge = getParticipationBridge();
    if (bridge && poll) {
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
    // GA4 추적: 상황 반응 참여
    trackReaction(situationId, optionId);

    contentParticipationService.recordSituationAnswer(situationId, optionId);
    setParticipation(contentParticipationService.getParticipation());
  };

  // 다음 액션 처리
  const handleNextAction = (action: NextAction) => {
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
        onClose();
        if (action.targetId && onStartTest) {
          onStartTest(action.targetId);
        }
        break;
      case 'share':
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
        <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar" role="tablist" aria-label="콘텐츠 탐색 탭">
          <button
            onClick={() => { setActiveTab('quiz'); setSelectedCategory('all'); }}
            role="tab"
            aria-selected={activeTab === 'quiz'}
            aria-controls="quiz-panel"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'quiz'
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <HelpCircle className="w-3.5 h-3.5" aria-hidden="true" />
            퀴즈
          </button>
          <button
            onClick={() => { setActiveTab('poll'); setSelectedCategory('all'); }}
            role="tab"
            aria-selected={activeTab === 'poll'}
            aria-controls="poll-panel"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'poll'
              ? 'bg-purple-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <Vote className="w-3.5 h-3.5" aria-hidden="true" />
            투표
          </button>
          <button
            onClick={() => { setActiveTab('community'); setSelectedCategory('all'); }}
            role="tab"
            aria-selected={activeTab === 'community'}
            aria-controls="community-panel"
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${activeTab === 'community'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
            커뮤니티
          </button>
        </div>

        {/* 검색 바 */}
        {activeTab !== 'community' && (
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder={`${activeTab === 'quiz' ? '퀴즈' : '투표'} 검색...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-10 py-2.5 bg-slate-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-slate-50 transition-all outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full hover:bg-slate-200 transition-colors"
              >
                <X className="w-3.5 h-3.5 text-slate-400" />
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
            {/* 스트릭 배너 */}
            {activeTab !== 'community' && (
              <StreakBanner
                currentStreak={streak.currentStreak}
                longestStreak={streak.longestStreak}
                hasParticipatedToday={hasParticipatedToday}
              />
            )}

            {/* 핫 토픽 섹션 */}
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

            {/* 카테고리별 진행률 */}
            {activeTab !== 'community' && selectedCategory === 'all' && !showUncompletedOnly && (
              <CategoryProgress
                quizzes={ALL_KNOWLEDGE_QUIZZES}
                polls={VS_POLLS}
                participation={participation}
                activeTab={activeTab}
                onCategoryClick={(category) => setSelectedCategory(category)}
              />
            )}

            <div className="space-y-3" role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
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
                  <div className="text-center py-12 text-slate-400">
                    <p>이 카테고리에 퀴즈가 없습니다</p>
                  </div>
                )
              )}
              {activeTab === 'poll' && (
                <>
                  {/* 인기 투표 섹션 */}
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
                    <div className="text-center py-12 text-slate-400">
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
