'use client';

import { useContentParticipation } from './useContentParticipation';
import QuizWidget from './QuizWidget';
import PollWidget from './PollWidget';

export interface ContentWidgetContainerProps {
  variant?: 'compact' | 'full';
  onExploreMore?: () => void;
  className?: string;
}

export default function ContentWidgetContainer({
  variant = 'compact',
  onExploreMore,
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
    handleQuizAnswer,
    handlePollVote,
  } = useContentParticipation();

  const isCompact = variant === 'compact';

  // compact: 세로 배치 (사이드바/패널)
  // full: 가로 그리드 (모바일)
  const containerClass = isCompact
    ? `space-y-3 ${className}`
    : `grid grid-cols-2 gap-3 ${className}`;

  return (
    <div className={containerClass}>
      {quiz && (
        <QuizWidget
          quiz={quiz}
          isAnswered={isQuizAnswered}
          selectedOption={selectedQuizOption}
          showResult={showQuizResult}
          onAnswer={handleQuizAnswer}
          variant={variant}
          onExploreMore={onExploreMore}
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
          variant={variant}
          onExploreMore={onExploreMore}
        />
      )}
    </div>
  );
}
