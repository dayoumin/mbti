'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomQuiz, getRandomPoll } from '../../data/content';
import { ALL_KNOWLEDGE_QUIZZES } from '../../data/content/quizzes';
import { VS_POLLS } from '../../data/content/polls';
import { contentParticipationService } from '../../services/ContentParticipationService';
import { tursoService } from '../../services/TursoService';
import { getGamificationService } from '../../services/GamificationService';
import type { KnowledgeQuiz, VSPoll } from '../../data/content/types';

// 폴백용 안정적인 투표 결과 생성
export function getStablePollResults(pollId: string) {
  const seedStr = String(pollId || '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash) % 41;
  const a = 30 + base;
  return { a, b: 100 - a, total: 0 };
}

export interface PollResults {
  a: number;
  b: number;
  total: number;
}

export interface RewardInfo {
  points: number;
  newBadges: string[];
}

export interface UseContentParticipationReturn {
  // 데이터
  quiz: KnowledgeQuiz | null;
  poll: VSPoll | null;

  // 퀴즈 상태
  selectedQuizOption: string | null;
  showQuizResult: boolean;
  isQuizAnswered: boolean;
  lastQuizReward: RewardInfo | null;

  // 투표 상태
  selectedPollOption: 'a' | 'b' | null;
  pollResults: PollResults;
  isPollVoted: boolean;
  isLoadingStats: boolean;
  lastPollReward: RewardInfo | null;

  // 전체 통계
  totalPoints: number;
  quizAccuracy: number;

  // 남은 개수
  remainingQuizCount: number;
  remainingPollCount: number;

  // 액션
  handleQuizAnswer: (optionId: string) => void;
  handlePollVote: (choice: 'a' | 'b') => Promise<void>;
  goToNextQuiz: () => void;
  goToNextPoll: () => void;
}

export function useContentParticipation(): UseContentParticipationReturn {
  const [quiz, setQuiz] = useState<KnowledgeQuiz | null>(null);
  const [poll, setPoll] = useState<VSPoll | null>(null);
  const [participation, setParticipation] = useState(() => contentParticipationService.getParticipation());

  // 퀴즈 상태
  const [selectedQuizOption, setSelectedQuizOption] = useState<string | null>(null);
  const [showQuizResult, setShowQuizResult] = useState(false);
  const [lastQuizReward, setLastQuizReward] = useState<RewardInfo | null>(null);

  // 투표 상태
  const [selectedPollOption, setSelectedPollOption] = useState<'a' | 'b' | null>(null);
  const [pollResults, setPollResults] = useState<PollResults>({ a: 50, b: 50, total: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [lastPollReward, setLastPollReward] = useState<RewardInfo | null>(null);

  // 전체 통계
  const [totalPoints, setTotalPoints] = useState(0);
  const [quizAccuracy, setQuizAccuracy] = useState(0);

  // 레이스 컨디션 방지: 현재 poll.id 추적
  const currentPollIdRef = useRef<string | null>(null);

  // 중복 클릭 방지: 제출 진행 중 플래그
  const isSubmittingQuizRef = useRef(false);
  const isSubmittingPollRef = useRef(false);

  // 투표 통계 로드 (레이스 컨디션 방지)
  const loadPollStats = useCallback(async (pollId: string) => {
    currentPollIdRef.current = pollId;
    setIsLoadingStats(true);
    try {
      const stats = await tursoService.getPollStats(pollId);
      // 응답 도착 시 현재 poll과 일치하는지 확인
      if (currentPollIdRef.current !== pollId) return;

      if (stats.totalVotes > 0) {
        const aOption = stats.options.find(o => o.optionId === 'a');
        const bOption = stats.options.find(o => o.optionId === 'b');
        setPollResults({
          a: aOption?.percentage ?? 50,
          b: bOption?.percentage ?? 50,
          total: stats.totalVotes,
        });
      } else {
        // total을 -1로 설정하여 "집계 전" 상태 표시
        setPollResults({ ...getStablePollResults(pollId), total: -1 });
      }
    } catch {
      if (currentPollIdRef.current === pollId) {
        // 실패 시에도 -1로 설정
        setPollResults({ ...getStablePollResults(pollId), total: -1 });
      }
    } finally {
      // 현재 pollId와 일치할 때만 로딩 해제 (경합 방지)
      if (currentPollIdRef.current === pollId) {
        setIsLoadingStats(false);
      }
    }
  }, []);

  useEffect(() => {
    const currentParticipation = contentParticipationService.getParticipation();
    setParticipation(currentParticipation);

    // 게이미피케이션 통계 로드
    const gamificationService = getGamificationService();
    if (gamificationService) {
      const stats = gamificationService.getStats();
      setTotalPoints(stats.totalPoints);
      if (stats.quizzesAnswered > 0) {
        setQuizAccuracy(Math.round((stats.quizzesCorrect / stats.quizzesAnswered) * 100));
      }
    }

    // 아직 안 푼 퀴즈 선택
    const unansweredQuizzes = ALL_KNOWLEDGE_QUIZZES.filter(
      q => !currentParticipation.quizzes.some(p => p.quizId === q.id)
    );
    const nextQuiz = unansweredQuizzes.length > 0
      ? unansweredQuizzes[Math.floor(Math.random() * unansweredQuizzes.length)]
      : getRandomQuiz();
    setQuiz(nextQuiz ?? null);

    // 아직 안 한 투표 선택
    const unvotedPolls = VS_POLLS.filter(
      p => !currentParticipation.polls.some(v => v.pollId === p.id)
    );
    const nextPoll = unvotedPolls.length > 0
      ? unvotedPolls[Math.floor(Math.random() * unvotedPolls.length)]
      : getRandomPoll();
    setPoll(nextPoll ?? null);

    // 초기 poll 선택 시 currentPollIdRef 설정 (레이스 컨디션 방지)
    if (nextPoll) {
      currentPollIdRef.current = nextPoll.id;
    }

    // 이미 참여한 경우 상태 복원
    if (nextQuiz) {
      const answered = currentParticipation.quizzes.find(q => q.quizId === nextQuiz.id);
      if (answered) {
        setSelectedQuizOption(answered.selectedOption);
        setShowQuizResult(true);
      }
    }
    if (nextPoll) {
      const voted = currentParticipation.polls.find(p => p.pollId === nextPoll.id);
      if (voted) {
        setSelectedPollOption(voted.choice);
        loadPollStats(nextPoll.id);
      }
    }
  }, [loadPollStats]);

  // 퀴즈 답변 처리
  const handleQuizAnswer = useCallback(async (optionId: string) => {
    // 중복 클릭 방지: ref 플래그로 동기적 체크
    if (showQuizResult || !quiz || isSubmittingQuizRef.current) return;
    isSubmittingQuizRef.current = true;

    setSelectedQuizOption(optionId);
    setShowQuizResult(true);

    const isCorrect = quiz.options.find(o => o.id === optionId)?.isCorrect || false;
    contentParticipationService.recordQuizAnswer(quiz.id, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());

    // 게이미피케이션: 포인트 & 배지 획득
    const gamificationService = getGamificationService();
    if (gamificationService) {
      const reward = gamificationService.recordQuizAnswer(isCorrect, quiz.category);
      setLastQuizReward(reward);
      setTotalPoints(gamificationService.getStats().totalPoints);

      // 정답률 업데이트
      const stats = gamificationService.getStats();
      if (stats.quizzesAnswered > 0) {
        setQuizAccuracy(Math.round((stats.quizzesCorrect / stats.quizzesAnswered) * 100));
      }
    }

    // Turso에 저장 (실패해도 로컬 상태는 유지)
    try {
      await tursoService.saveQuizResponse(quiz.id, optionId, isCorrect);
    } catch (e) {
      console.error('[Quiz] Failed to save to Turso:', e);
    }
  }, [quiz, showQuizResult]);

  // 투표 처리
  const handlePollVote = useCallback(async (choice: 'a' | 'b') => {
    // 중복 클릭 방지: ref 플래그로 동기적 체크
    if (selectedPollOption || !poll || isSubmittingPollRef.current) return;
    isSubmittingPollRef.current = true;

    // pollId 스냅샷: 비동기 작업 중 poll 변경에 대비
    const pollIdSnapshot = poll.id;

    setSelectedPollOption(choice);

    contentParticipationService.recordPollVote(poll.id, choice);
    setParticipation(contentParticipationService.getParticipation());

    // 게이미피케이션: 포인트 & 배지 획득
    const gamificationService = getGamificationService();
    if (gamificationService) {
      const reward = gamificationService.recordPollVote({ category: poll.category });
      setLastPollReward(reward);
      setTotalPoints(gamificationService.getStats().totalPoints);
    }

    // Turso에 저장 (실패해도 로컬 상태는 유지)
    try {
      await tursoService.savePollResponse(poll.id, choice);
    } catch (e) {
      console.error('[Poll] Failed to save to Turso:', e);
    }

    // 통계 로드 (스냅샷 pollId가 현재 poll과 일치할 때만)
    if (currentPollIdRef.current === pollIdSnapshot) {
      loadPollStats(pollIdSnapshot);
    }
  }, [poll, selectedPollOption, loadPollStats]);

  // 남은 퀴즈/투표 계산
  const getUnansweredQuizzes = useCallback(() => {
    return ALL_KNOWLEDGE_QUIZZES.filter(
      q => !participation.quizzes.some(p => p.quizId === q.id)
    );
  }, [participation]);

  const getUnvotedPolls = useCallback(() => {
    return VS_POLLS.filter(
      p => !participation.polls.some(v => v.pollId === p.id)
    );
  }, [participation]);

  // 다음 퀴즈로 이동
  const goToNextQuiz = useCallback(() => {
    const unanswered = getUnansweredQuizzes().filter(q => q.id !== quiz?.id);
    if (unanswered.length > 0) {
      const nextQuiz = unanswered[Math.floor(Math.random() * unanswered.length)];
      setQuiz(nextQuiz);
      setSelectedQuizOption(null);
      setShowQuizResult(false);
      setLastQuizReward(null); // 보상 리셋
      isSubmittingQuizRef.current = false; // 제출 플래그 리셋
    }
  }, [quiz, getUnansweredQuizzes]);

  // 다음 투표로 이동
  const goToNextPoll = useCallback(() => {
    const unvoted = getUnvotedPolls().filter(p => p.id !== poll?.id);
    if (unvoted.length > 0) {
      const nextPoll = unvoted[Math.floor(Math.random() * unvoted.length)];
      // 레이스 컨디션 방지: 새 poll.id로 갱신하여 이전 응답 무시
      currentPollIdRef.current = nextPoll.id;
      setPoll(nextPoll);
      setSelectedPollOption(null);
      setPollResults({ a: 50, b: 50, total: 0 });
      setIsLoadingStats(false); // 로딩 상태 리셋 (락 방지)
      setLastPollReward(null); // 보상 리셋
      isSubmittingPollRef.current = false; // 제출 플래그 리셋
    }
  }, [poll, getUnvotedPolls]);

  const isQuizAnswered = quiz ? participation.quizzes.some(q => q.quizId === quiz.id) : false;
  const isPollVoted = poll ? participation.polls.some(p => p.pollId === poll.id) : false;

  // 현재 항목 제외한 남은 개수
  const remainingQuizCount = getUnansweredQuizzes().filter(q => q.id !== quiz?.id).length;
  const remainingPollCount = getUnvotedPolls().filter(p => p.id !== poll?.id).length;

  return {
    quiz,
    poll,
    selectedQuizOption,
    showQuizResult,
    isQuizAnswered,
    lastQuizReward,
    selectedPollOption,
    pollResults,
    isPollVoted,
    isLoadingStats,
    lastPollReward,
    totalPoints,
    quizAccuracy,
    remainingQuizCount,
    remainingPollCount,
    handleQuizAnswer,
    handlePollVote,
    goToNextQuiz,
    goToNextPoll,
  };
}
