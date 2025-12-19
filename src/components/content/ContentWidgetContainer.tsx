'use client';

import { useContentParticipation } from './useContentParticipation';
import QuizWidget from './QuizWidget';
import PollWidget from './PollWidget';

export interface ContentWidgetContainerProps {
  className?: string;
}

export default function ContentWidgetContainer({
  className = '',
}: ContentWidgetContainerProps) {
  const {
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
  } = useContentParticipation();

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${className}`}>
      {quiz && (
        <QuizWidget
          quiz={quiz}
          isAnswered={isQuizAnswered}
          selectedOption={selectedQuizOption}
          showResult={showQuizResult}
          onAnswer={handleQuizAnswer}
          remainingCount={remainingQuizCount}
          onNext={goToNextQuiz}
        />
      )}

      {poll && (
        <PollWidget
          poll={poll}
          isVoted={isPollVoted}
          selectedOption={selectedPollOption}
          results={pollResults}
          isLoadingStats={isLoadingStats}
          onVote={handlePollVote}
          remainingCount={remainingPollCount}
          onNext={goToNextPoll}
        />
      )}
    </div>
  );
}
