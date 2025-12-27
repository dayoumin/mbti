'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronRight, CheckCircle, Sparkles, Brain, Vote } from 'lucide-react';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls';
import { contentParticipationService } from '@/services/ContentParticipationService';
import { getParticipationBridge } from '@/services/ParticipationBridge';
import { userPreferenceService } from '@/services/UserPreferenceService';
import { demographicService } from '@/services/DemographicService';
import QuizWidget from './content/QuizWidget';
import PollWidget from './content/PollWidget';
import type { KnowledgeQuiz, VSPoll } from '@/data/content/types';
import type { PollResults, RewardInfo } from './content/useContentParticipation';

interface TodayQuizPollProps {
  onExploreMore?: () => void;
  className?: string;
}

// ============================================================================
// 시간 기반 로테이션 유틸리티
// ============================================================================

const ROTATION_HOURS = 6; // 6시간마다 로테이션

/**
 * 현재 시간대 슬롯 계산 (6시간 단위)
 * 예: 0-5시 = 슬롯0, 6-11시 = 슬롯1, 12-17시 = 슬롯2, 18-23시 = 슬롯3
 */
function getCurrentTimeSlot(): { dateKey: string; slotIndex: number } {
  const now = new Date();
  const dateKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  const slotIndex = Math.floor(now.getHours() / ROTATION_HOURS);
  return { dateKey, slotIndex };
}

/**
 * 다음 로테이션까지 남은 시간 (밀리초)
 */
function getTimeUntilNextRotation(): number {
  const now = new Date();
  const currentHour = now.getHours();
  const nextSlotHour = (Math.floor(currentHour / ROTATION_HOURS) + 1) * ROTATION_HOURS;

  const nextRotation = new Date(now);
  if (nextSlotHour >= 24) {
    // 다음 날 0시
    nextRotation.setDate(nextRotation.getDate() + 1);
    nextRotation.setHours(0, 0, 0, 0);
  } else {
    nextRotation.setHours(nextSlotHour, 0, 0, 0);
  }

  return nextRotation.getTime() - now.getTime();
}

/**
 * Seeded Random Number Generator (Mulberry32)
 * 같은 시드는 항상 같은 순서의 난수를 생성
 */
function seededRandom(seed: number): () => number {
  return function () {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/**
 * 문자열을 숫자 해시로 변환
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
}

/**
 * Seeded Fisher-Yates 셔플 (시드 기반으로 항상 같은 결과)
 */
function seededShuffle<T>(array: T[], seed: number): T[] {
  const shuffled = [...array];
  const random = seededRandom(seed);

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * 시간대 기반으로 콘텐츠 선택 (같은 시간대 = 같은 콘텐츠)
 * - 개인화 추천 순위 유지
 * - 안 푼 것 중에서 시간대 시드로 선택
 */
function selectQuizzesForTimeSlot(
  items: KnowledgeQuiz[],
  answeredIds: string[],
  count: number,
  timeSlotSeed: string
): KnowledgeQuiz[] {
  if (items.length === 0) return [];

  // 1. 연령 제한 + 추천 순 정렬
  const recommended = userPreferenceService.sortQuizzesByRecommendation(items);

  // 2. 안 푼 것만 필터
  const unanswered = recommended.filter(item => !answeredIds.includes(item.id));
  if (unanswered.length === 0) return [];

  // 3. 시간대 시드로 결정론적 셔플
  const seed = hashString(`quiz-${timeSlotSeed}`);
  const shuffled = seededShuffle(unanswered, seed);

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

function selectPollsForTimeSlot(
  items: VSPoll[],
  answeredIds: string[],
  count: number,
  timeSlotSeed: string
): VSPoll[] {
  if (items.length === 0) return [];

  // 1. 연령 제한 + 추천 순 정렬
  const recommended = userPreferenceService.sortPollsByRecommendation(items);

  // 2. 안 푼 것만 필터
  const unanswered = recommended.filter(item => !answeredIds.includes(item.id));
  if (unanswered.length === 0) return [];

  // 3. 시간대 시드로 결정론적 셔플
  const seed = hashString(`poll-${timeSlotSeed}`);
  const shuffled = seededShuffle(unanswered, seed);

  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// 기본 participation 데이터 (SSR 안전)
const DEFAULT_PARTICIPATION = {
  quizzes: [] as { quizId: string }[],
  polls: [] as { pollId: string }[],
  stats: {
    totalQuizAnswered: 0,
    totalCorrect: 0,
    totalPollVoted: 0,
    lastParticipatedAt: null as string | null,
  }
};

// 표시할 콘텐츠 개수
const QUIZ_COUNT = 2;
const POLL_COUNT = 2;

export default function TodayQuizPoll({ onExploreMore, className = '' }: TodayQuizPollProps) {
  // SSR 안전: 초기값은 빈 데이터로 시작
  const [participation, setParticipation] = useState(DEFAULT_PARTICIPATION);
  const [isClient, setIsClient] = useState(false);

  // 현재 시간대 슬롯 (6시간 단위 로테이션)
  const [timeSlot, setTimeSlot] = useState<{ dateKey: string; slotIndex: number } | null>(null);

  // 현재 보고 있는 퀴즈/투표 인덱스
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [currentPollIndex, setCurrentPollIndex] = useState(0);

  // 퀴즈 상태
  const [quizStates, setQuizStates] = useState<Record<string, {
    selectedOption: string | null;
    showResult: boolean;
    reward: RewardInfo | null;
  }>>({});

  // 투표 상태
  const [pollStates, setPollStates] = useState<Record<string, {
    selectedOption: 'a' | 'b' | null;
    results: PollResults;
    isLoadingStats: boolean;
    reward: RewardInfo | null;
  }>>({});

  // 클라이언트에서만 localStorage 데이터 로드 + 시간대 설정
  useEffect(() => {
    setIsClient(true);
    setParticipation(contentParticipationService.getParticipation());
    setTimeSlot(getCurrentTimeSlot());

    // 다음 로테이션 시간에 자동 업데이트
    const scheduleNextRotation = () => {
      const msUntilNext = getTimeUntilNextRotation();
      return setTimeout(() => {
        setTimeSlot(getCurrentTimeSlot());
        // 다음 로테이션도 예약
        const timerId = scheduleNextRotation();
        return () => clearTimeout(timerId);
      }, msUntilNext);
    };

    const timerId = scheduleNextRotation();
    return () => clearTimeout(timerId);
  }, []);

  // 참여 기록 기반으로 안 푼 퀴즈/투표 선택
  const answeredQuizIds = useMemo(() => participation.quizzes.map(q => q.quizId), [participation.quizzes]);
  const votedPollIds = useMemo(() => participation.polls.map(p => p.pollId), [participation.polls]);

  // 시간대 시드 생성 (날짜 + 슬롯 인덱스)
  const timeSlotSeed = useMemo(() => {
    if (!timeSlot) return '';
    return `${timeSlot.dateKey}-slot${timeSlot.slotIndex}`;
  }, [timeSlot]);

  // 연령 변경 감지용 상태 (프로필 업데이트 시 재계산 트리거)
  const [ageVersion, setAgeVersion] = useState(0);

  useEffect(() => {
    const handleProfileUpdate = () => {
      setAgeVersion(v => v + 1);
      userPreferenceService.reload(); // 선호도 데이터도 리로드
    };

    window.addEventListener('chemi:profileUpdated', handleProfileUpdate);
    return () => window.removeEventListener('chemi:profileUpdated', handleProfileUpdate);
  }, []);

  // 연령 제한 필터링된 콘텐츠 수 (UX 메시지 구분용)
  // 참여 기록 변경 또는 연령 변경 시 재계산
  const filteredQuizCount = useMemo(() =>
    userPreferenceService.sortQuizzesByRecommendation(ALL_KNOWLEDGE_QUIZZES).length,
    [participation.quizzes.length, ageVersion]
  );
  const filteredPollCount = useMemo(() =>
    userPreferenceService.sortPollsByRecommendation(VS_POLLS).length,
    [participation.polls.length, ageVersion]
  );

  // 시간대 기반 콘텐츠 선택 (같은 시간대 = 같은 콘텐츠)
  // ageVersion 변경 시에도 재선택 (연령 필터링 반영)
  const todayQuizzes = useMemo(() => {
    if (!timeSlotSeed) return [];
    return selectQuizzesForTimeSlot(ALL_KNOWLEDGE_QUIZZES, answeredQuizIds, QUIZ_COUNT, timeSlotSeed);
  }, [answeredQuizIds, timeSlotSeed, ageVersion]);

  const todayPolls = useMemo(() => {
    if (!timeSlotSeed) return [];
    return selectPollsForTimeSlot(VS_POLLS, votedPollIds, POLL_COUNT, timeSlotSeed);
  }, [votedPollIds, timeSlotSeed, ageVersion]);

  const currentQuiz = todayQuizzes[currentQuizIndex];
  const currentPoll = todayPolls[currentPollIndex];

  // 콘텐츠 상태 판별 (연령 제한 접근불가 vs 모두 완료 구분)
  const allQuizzesDone = isClient && todayQuizzes.length === 0 && filteredQuizCount > 0;
  const allPollsDone = isClient && todayPolls.length === 0 && filteredPollCount > 0;
  const noAccessibleQuizzes = isClient && filteredQuizCount === 0 && ALL_KNOWLEDGE_QUIZZES.length > 0;
  const noAccessiblePolls = isClient && filteredPollCount === 0 && VS_POLLS.length > 0;

  // 연령 미설정 vs 10대(미성년자) 구분 (ageVersion 변경 시 재평가)
  const hasAgeSet = useMemo(() => isClient && demographicService.hasAgeGroup(), [isClient, ageVersion]);
  const demographic = useMemo(() => isClient ? demographicService.getDemographic() : null, [isClient, ageVersion]);
  const isMinor = demographic?.ageGroup === '10s';

  // 퀴즈 답변 처리
  const handleQuizAnswer = async (optionId: string) => {
    if (!currentQuiz) return;

    const quizState = quizStates[currentQuiz.id];
    if (quizState?.showResult) return;

    const isCorrect = currentQuiz.options.find(o => o.id === optionId)?.isCorrect || false;

    // 상태 업데이트
    setQuizStates(prev => ({
      ...prev,
      [currentQuiz.id]: {
        selectedOption: optionId,
        showResult: true,
        reward: { points: isCorrect ? 10 : 5, newBadges: [] }
      }
    }));

    contentParticipationService.recordQuizAnswer(currentQuiz.id, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());

    // 선호도 기록 (개인화용)
    userPreferenceService.recordQuizEngagement(
      currentQuiz.category,
      currentQuiz.tags || [],
      isCorrect,
      currentQuiz.difficulty
    );

    try {
      const bridge = getParticipationBridge();
      await bridge.recordQuizAnswer(currentQuiz.id, 0, optionId, isCorrect, currentQuiz.category);
    } catch (e) {
      console.error('Quiz bridge error:', e);
    }
  };

  // 투표 처리
  const handlePollVote = async (choice: 'a' | 'b') => {
    if (!currentPoll) return;

    const pollState = pollStates[currentPoll.id];
    if (pollState?.selectedOption) return;

    // 로딩 상태
    setPollStates(prev => ({
      ...prev,
      [currentPoll.id]: {
        selectedOption: choice,
        results: { a: 0, b: 0, total: -1 },
        isLoadingStats: true,
        reward: null
      }
    }));

    contentParticipationService.recordPollVote(currentPoll.id, choice);
    setParticipation(contentParticipationService.getParticipation());

    // 선호도 기록 (개인화용)
    userPreferenceService.recordPollEngagement(
      currentPoll.category,
      currentPoll.tags || []
    );

    try {
      const bridge = getParticipationBridge();
      await bridge.recordPollVote(currentPoll.id, choice, undefined, currentPoll.category);

      // 결과 조회
      const res = await fetch(`/api/poll?pollId=${currentPoll.id}`);
      if (res.ok) {
        const data = await res.json();
        const total = data.total || 1;
        const aCount = data.a || 0;
        const bCount = data.b || 0;

        setPollStates(prev => ({
          ...prev,
          [currentPoll.id]: {
            selectedOption: choice,
            results: {
              a: Math.round((aCount / total) * 100),
              b: Math.round((bCount / total) * 100),
              total
            },
            isLoadingStats: false,
            reward: { points: 5, newBadges: [] }
          }
        }));
      }
    } catch (e) {
      console.error('Poll bridge error:', e);
      // 에러 시 기본값
      setPollStates(prev => ({
        ...prev,
        [currentPoll.id]: {
          selectedOption: choice,
          results: { a: 50, b: 50, total: 1 },
          isLoadingStats: false,
          reward: { points: 5, newBadges: [] }
        }
      }));
    }
  };

  // 다음 퀴즈로 이동
  const goToNextQuiz = () => {
    if (currentQuizIndex < todayQuizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
    }
  };

  // 다음 투표로 이동
  const goToNextPoll = () => {
    if (currentPollIndex < todayPolls.length - 1) {
      setCurrentPollIndex(prev => prev + 1);
    }
  };

  const stats = participation.stats;
  const hasActivity = isClient && (stats.totalQuizAnswered > 0 || stats.totalPollVoted > 0);

  // 현재 퀴즈 상태
  const currentQuizState = currentQuiz ? quizStates[currentQuiz.id] : null;
  const currentPollState = currentPoll ? pollStates[currentPoll.id] : null;

  return (
    <div className={`bg-slate-50 rounded-md p-4 border border-subtle ${className}`}>
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-brand-primary rounded-md flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">오늘의 퀴즈 & 투표</h3>
            <p className="text-xs text-slate-500">매일 새로운 콘텐츠가 기다려요</p>
          </div>
        </div>
        {/* 누적 참여 현황 */}
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
        {/* 퀴즈 완료 상태 */}
        {allQuizzesDone && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-green-700">퀴즈 마스터!</span>
                <p className="text-xs text-green-600">모든 퀴즈를 풀었어요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-green-100">
              <span className="text-xs text-green-600">
                {stats.totalQuizAnswered}개 완료 · 정답률 {stats.totalQuizAnswered > 0 ? Math.round((stats.totalCorrect || 0) / stats.totalQuizAnswered * 100) : 0}%
              </span>
              <span className="text-lg">🎓</span>
            </div>
          </div>
        )}

        {/* 연령 제한으로 퀴즈 접근 불가 - 연령 미설정 시 */}
        {noAccessibleQuizzes && !hasAgeSet && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-amber-700">더 많은 퀴즈가 기다려요!</span>
                <p className="text-xs text-amber-600">연령대를 설정하면 맞춤 퀴즈를 볼 수 있어요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-100">
              <span className="text-xs text-amber-600">
                테스트 완료 후 설정할 수 있어요
              </span>
              <span className="text-lg">🔓</span>
            </div>
          </div>
        )}

        {/* 연령 제한으로 퀴즈 접근 불가 - 10대(미성년자) */}
        {noAccessibleQuizzes && hasAgeSet && isMinor && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-sky-700">다른 퀴즈를 즐겨보세요!</span>
                <p className="text-xs text-sky-600">성격/동물 퀴즈가 준비되어 있어요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-100">
              <span className="text-xs text-sky-600">
                다양한 재미있는 퀴즈가 있어요
              </span>
              <span className="text-lg">🎯</span>
            </div>
          </div>
        )}

        {/* 연령 제한으로 퀴즈 접근 불가 - 성인이지만 콘텐츠 없음 */}
        {noAccessibleQuizzes && hasAgeSet && !isMinor && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-600">퀴즈 준비 중</span>
                <p className="text-xs text-slate-500">새로운 퀴즈가 곧 추가돼요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                다양한 퀴즈를 준비하고 있어요
              </span>
              <span className="text-lg">📚</span>
            </div>
          </div>
        )}

        {/* 오늘의 퀴즈 - QuizWidget 사용 */}
        {currentQuiz && (
          <QuizWidget
            quiz={currentQuiz}
            isAnswered={currentQuizState?.showResult || false}
            selectedOption={currentQuizState?.selectedOption || null}
            showResult={currentQuizState?.showResult || false}
            onAnswer={handleQuizAnswer}
            remainingCount={todayQuizzes.length - currentQuizIndex - 1}
            onNext={goToNextQuiz}
            reward={currentQuizState?.reward}
            quizAccuracy={stats.totalQuizAnswered > 0
              ? Math.round((stats.totalCorrect || 0) / stats.totalQuizAnswered * 100)
              : undefined}
          />
        )}

        {/* 투표 완료 상태 */}
        {allPollsDone && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-purple-700">투표 완료!</span>
                <p className="text-xs text-purple-600">모든 투표에 참여했어요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-purple-100">
              <span className="text-xs text-purple-600">
                {stats.totalPollVoted}개 완료
              </span>
              <span className="text-lg">🗳️</span>
            </div>
          </div>
        )}

        {/* 연령 제한으로 투표 접근 불가 - 연령 미설정 시 */}
        {noAccessiblePolls && !hasAgeSet && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-amber-700">더 많은 투표가 기다려요!</span>
                <p className="text-xs text-amber-600">연령대를 설정하면 맞춤 투표를 볼 수 있어요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-amber-100">
              <span className="text-xs text-amber-600">
                테스트 완료 후 설정할 수 있어요
              </span>
              <span className="text-lg">🔓</span>
            </div>
          </div>
        )}

        {/* 연령 제한으로 투표 접근 불가 - 10대(미성년자) */}
        {noAccessiblePolls && hasAgeSet && isMinor && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-sky-100 rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-sky-500" />
              </div>
              <div>
                <span className="text-sm font-bold text-sky-700">다른 투표를 즐겨보세요!</span>
                <p className="text-xs text-sky-600">재미있는 성격/취향 투표가 있어요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-sky-100">
              <span className="text-xs text-sky-600">
                친구들과 비교해보세요
              </span>
              <span className="text-lg">🎯</span>
            </div>
          </div>
        )}

        {/* 연령 제한으로 투표 접근 불가 - 성인이지만 콘텐츠 없음 */}
        {noAccessiblePolls && hasAgeSet && !isMinor && (
          <div className="bg-slate-50 rounded-md p-4 shadow-sm border border-subtle">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center">
                <Vote className="w-5 h-5 text-slate-400" />
              </div>
              <div>
                <span className="text-sm font-bold text-slate-600">투표 준비 중</span>
                <p className="text-xs text-slate-500">새로운 투표가 곧 추가돼요</p>
              </div>
            </div>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
              <span className="text-xs text-slate-500">
                다양한 투표를 준비하고 있어요
              </span>
              <span className="text-lg">🗳️</span>
            </div>
          </div>
        )}

        {/* 오늘의 투표 - PollWidget 사용 */}
        {currentPoll && (
          <PollWidget
            poll={currentPoll}
            isVoted={currentPollState?.selectedOption !== null && currentPollState?.selectedOption !== undefined}
            selectedOption={currentPollState?.selectedOption || null}
            results={currentPollState?.results || { a: 0, b: 0, total: 0 }}
            isLoadingStats={currentPollState?.isLoadingStats || false}
            onVote={handlePollVote}
            remainingCount={todayPolls.length - currentPollIndex - 1}
            onNext={goToNextPoll}
            reward={currentPollState?.reward}
          />
        )}
      </div>

      {/* 전체 콘텐츠 탐색 버튼 */}
      {onExploreMore && (
        <button
          onClick={onExploreMore}
          className="w-full mt-3 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-50/50 rounded-md border border-transparent hover:border-brand transition-all"
        >
          전체 콘텐츠 둘러보기
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
