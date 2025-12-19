'use client';

import { useState, useEffect, useCallback } from 'react';
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

  // 액션
  handleQuizAnswer: (optionId: string) => void;
  handlePollVote: (choice: 'a' | 'b') => Promise<void>;
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

  // 투표 통계 로드
  const loadPollStats = useCallback(async (pollId: string) => {
    setIsLoadingStats(true);
    try {
      const stats = await tursoService.getPollStats(pollId);
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
      setPollResults(getStablePollResults(pollId));
    } finally {
      setIsLoadingStats(false);
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
  const handleQuizAnswer = useCallback((optionId: string) => {
    if (showQuizResult || !quiz) return;
    setSelectedQuizOption(optionId);
    setShowQuizResult(true);

    const isCorrect = quiz.options.find(o => o.id === optionId)?.isCorrect || false;
    contentParticipationService.recordQuizAnswer(quiz.id, optionId, isCorrect);
    setParticipation(contentParticipationService.getParticipation());
  }, [quiz, showQuizResult]);

  // 투표 처리
  const handlePollVote = useCallback(async (choice: 'a' | 'b') => {
    if (selectedPollOption || !poll) return;
    setSelectedPollOption(choice);

    contentParticipationService.recordPollVote(poll.id, choice);
    setParticipation(contentParticipationService.getParticipation());

    // Turso에 저장
    await tursoService.savePollResponse(poll.id, choice);

    // 통계 로드
    loadPollStats(poll.id);
  }, [poll, selectedPollOption, loadPollStats]);

  const isQuizAnswered = quiz ? participation.quizzes.some(q => q.quizId === quiz.id) : false;
  const isPollVoted = poll ? participation.polls.some(p => p.pollId === poll.id) : false;

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
    handleQuizAnswer,
    handlePollVote,
  };
}
