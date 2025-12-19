'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomQuiz, getRandomPoll } from '../../data/content';
import { ALL_KNOWLEDGE_QUIZZES } from '../../data/content/quizzes';
import { VS_POLLS } from '../../data/content/polls/vs-polls';
import { contentParticipationService } from '../../services/ContentParticipationService';
import { tursoService } from '../../services/TursoService';
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

export interface UseContentParticipationReturn {
  // 데이터
  quiz: KnowledgeQuiz | null;
  poll: VSPoll | null;

  // 퀴즈 상태
  selectedQuizOption: string | null;
  showQuizResult: boolean;
  isQuizAnswered: boolean;

  // 투표 상태
  selectedPollOption: 'a' | 'b' | null;
  pollResults: PollResults;
  isPollVoted: boolean;
  isLoadingStats: boolean;

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

  // 투표 상태
  const [selectedPollOption, setSelectedPollOption] = useState<'a' | 'b' | null>(null);
  const [pollResults, setPollResults] = useState<PollResults>({ a: 50, b: 50, total: 0 });
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  // 레이스 컨디션 방지: 현재 poll.id 추적
  const currentPollIdRef = useRef<string | null>(null);

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
        setPollResults(getStablePollResults(pollId));
      }
    } catch {
      if (currentPollIdRef.current === pollId) {
        setPollResults(getStablePollResults(pollId));
      }
    } finally {
      if (currentPollIdRef.current === pollId) {
        setIsLoadingStats(false);
      }
    }
  }, []);

  useEffect(() => {
    const currentParticipation = contentParticipationService.getParticipation();
    setParticipation(currentParticipation);

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
    if (showQuizResult || !quiz) return;
    setSelectedQuizOption(optionId);
    setShowQuizResult(true);

    const isCorrect = quiz.options.find(o => o.id === optionId)?.isCorrect || false;
    contentParticipationService.recordQuizAnswer(quiz.id, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());

    // Turso에 저장 (실패해도 로컬 상태는 유지)
    try {
      await tursoService.saveQuizResponse(quiz.id, optionId, isCorrect);
    } catch (e) {
      console.error('[Quiz] Failed to save to Turso:', e);
    }
  }, [quiz, showQuizResult]);

  // 투표 처리
  const handlePollVote = useCallback(async (choice: 'a' | 'b') => {
    if (selectedPollOption || !poll) return;
    setSelectedPollOption(choice);

    contentParticipationService.recordPollVote(poll.id, choice);
    setParticipation(contentParticipationService.getParticipation());

    // Turso에 저장 (실패해도 로컬 상태는 유지)
    try {
      await tursoService.savePollResponse(poll.id, choice);
    } catch (e) {
      console.error('[Poll] Failed to save to Turso:', e);
    }

    // 통계 로드
    loadPollStats(poll.id);
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
    selectedPollOption,
    pollResults,
    isPollVoted,
    isLoadingStats,
    remainingQuizCount,
    remainingPollCount,
    handleQuizAnswer,
    handlePollVote,
    goToNextQuiz,
    goToNextPoll,
  };
}
