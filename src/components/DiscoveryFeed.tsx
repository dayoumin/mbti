'use client';

import React, { useMemo } from 'react';
import { SubjectKey } from '../data/types';
import { MAIN_TEST_KEYS } from '../data/config';
import { useContentParticipation } from './content/useContentParticipation';
import FeedTestCard from './FeedTestCard';
import QuizWidget from './content/QuizWidget';
import PollWidget from './content/PollWidget';
import TalkPreview from './TalkPreview';
import { ChevronRight, LayoutGrid } from 'lucide-react';

interface DiscoveryFeedProps {
    onStartTest: (key: SubjectKey) => void;
    onExploreAll?: () => void;
    className?: string;
}

export default function DiscoveryFeed({ onStartTest, onExploreAll, className = '' }: DiscoveryFeedProps) {
    const {
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
        quizAccuracy,
        remainingQuizCount,
        remainingPollCount,
        handleQuizAnswer,
        handlePollVote,
        goToNextQuiz,
        goToNextPoll,
    } = useContentParticipation();

    // Feed composition logic: Interleave tests with other interactive widgets
    const feedItems = useMemo(() => {
        const items: any[] = [];

        // Interleave tests with widgets
        // Filter out some tests to keep the feed fresh (could be randomized)
        const availableTests = [...MAIN_TEST_KEYS].slice(0, 10);

        availableTests.forEach((testKey, index) => {
            items.push({ type: 'test', id: testKey, payload: testKey });

            // Insert special widgets at specific intervals
            if (index === 0 && quiz) { // Added quiz condition
                items.push({ type: 'quiz', id: 'quiz-1' });
            }
            if (index === 2) {
                items.push({ type: 'talk', id: 'talk-1' });
            }
            if (index === 4 && poll) { // Added poll condition
                items.push({ type: 'poll', id: 'poll-1' });
            }
            if (index === 6 && remainingQuizCount > 0) { // Added remainingQuizCount condition
                items.push({ type: 'quiz', id: 'quiz-2' }); // Another quiz later
            }
        });

        return items;
    }, [quiz, poll, remainingQuizCount]); // Updated dependencies

    return (
        <div className={`space-y-6 pb-4 ${className}`}>
            {feedItems.map((item) => {
                switch (item.type) {
                    case 'test':
                        return <FeedTestCard key={item.id} testKey={item.payload} onStart={onStartTest} />;
                    case 'quiz':
                        return quiz ? ( // Conditional rendering for quiz
                            <QuizWidget
                                key={item.id}
                                quiz={quiz}
                                isAnswered={isQuizAnswered}
                                selectedOption={selectedQuizOption}
                                showResult={showQuizResult}
                                onAnswer={handleQuizAnswer}
                                remainingCount={remainingQuizCount}
                                onNext={goToNextQuiz}
                                reward={lastQuizReward}
                                quizAccuracy={quizAccuracy}
                            />
                        ) : null;
                    case 'poll':
                        return poll ? ( // Conditional rendering for poll
                            <PollWidget
                                key={item.id}
                                poll={poll}
                                isVoted={isPollVoted}
                                selectedOption={selectedPollOption}
                                results={pollResults}
                                isLoadingStats={isLoadingStats}
                                onVote={handlePollVote}
                                remainingCount={remainingPollCount}
                                onNext={goToNextPoll}
                                reward={lastPollReward}
                            />
                        ) : null;
                    case 'talk':
                        return <TalkPreview key={item.id} />;
                    default:
                        return null;
                }
            })}

            {/* End of Feed CTA: Explore All Center */}
            {onExploreAll && (
                <div className="pt-4 pb-8 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white shadow-sm">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-200">
                            <LayoutGrid className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-black text-slate-800 mb-2">테스트가 더 궁금하신가요?</h3>
                        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
                            MBTI, 성향, 매칭 등<br />
                            50여개의 모든 테스트를 탐색에서 확인해보세요!
                        </p>
                        <button
                            onClick={onExploreAll}
                            className="w-full py-4 bg-slate-900 text-white font-black rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all active:scale-95 shadow-md"
                        >
                            전체 테스트 보러가기
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
