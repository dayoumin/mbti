'use client';

import React, { useMemo } from 'react';
import { Brain, Vote, ChevronRight, Sparkles } from 'lucide-react';
import { nextActionService } from '../services/NextActionService';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls';
import { CATEGORY_LABELS } from '@/data/content/categories';
import type { ContentCategory } from '@/data/content/types';

// ============================================================================
// Types
// ============================================================================

interface ContentActionsProps {
    testType: string;
    onQuizClick?: (category?: string) => void;
    onPollClick?: (category?: string) => void;
}

// 테스트 타입 → 콘텐츠 카테고리 매핑
const TEST_TO_CATEGORY: Record<string, ContentCategory> = {
    cat: 'cat',
    dog: 'dog',
    rabbit: 'rabbit',
    hamster: 'hamster',
    plant: 'plant',
    coffee: 'coffee',
    idealType: 'love',
    conflictStyle: 'relationship',
    petMatch: 'general',
    human: 'personality',
};

// ============================================================================
// Component
// ============================================================================

export default function ContentActions({
    testType,
    onQuizClick,
    onPollClick
}: ContentActionsProps) {
    // 테스트 타입에 맞는 카테고리 찾기
    const targetCategory = TEST_TO_CATEGORY[testType] || 'general';

    // 관련 퀴즈/투표 찾기
    const relatedContent = useMemo(() => {
        const quizzes = ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === targetCategory);
        const polls = VS_POLLS.filter(p => p.category === targetCategory);

        // 카테고리에 콘텐츠가 없으면 일반 카테고리에서 가져오기
        const fallbackQuizzes = quizzes.length === 0
            ? ALL_KNOWLEDGE_QUIZZES.slice(0, 2)
            : quizzes.slice(0, 2);
        const fallbackPolls = polls.length === 0
            ? VS_POLLS.slice(0, 2)
            : polls.slice(0, 2);

        return {
            quizzes: fallbackQuizzes,
            polls: fallbackPolls,
            quizCount: quizzes.length || ALL_KNOWLEDGE_QUIZZES.length,
            pollCount: polls.length || VS_POLLS.length,
        };
    }, [targetCategory]);

    const actions = nextActionService.getRecommendations({
        endpoint: 'test_result',
        contentId: testType,
    });

    // test 타입 제외하고 quiz, poll만 필터링
    const contentActions = actions.filter(a => a.type === 'quiz' || a.type === 'poll').slice(0, 2);

    if (contentActions.length === 0 && relatedContent.quizzes.length === 0 && relatedContent.polls.length === 0) {
        return null;
    }

    const categoryInfo = CATEGORY_LABELS[targetCategory] || { name: '관련', emoji: '📚' };
    const categoryLabel = categoryInfo.name;

    return (
        <div className="mt-6 w-full">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-800">다음에 해볼까요?</span>
            </div>

            {/* 콘텐츠 카드 그리드 */}
            <div className="grid grid-cols-2 gap-2">
                {/* 퀴즈 카드 */}
                {relatedContent.quizzes.length > 0 && (
                    <button
                        onClick={() => onQuizClick?.(targetCategory)}
                        className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:border-indigo-200 hover:shadow-sm transition-all text-left group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Brain className="w-4 h-4 text-indigo-500" />
                            <span className="text-xs font-bold text-indigo-600">{categoryLabel} 퀴즈</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                            {relatedContent.quizzes[0]?.question || '관련 퀴즈 풀어보기'}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-indigo-400">
                                {relatedContent.quizCount}개 퀴즈
                            </span>
                            <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                )}

                {/* 투표 카드 */}
                {relatedContent.polls.length > 0 && (
                    <button
                        onClick={() => onPollClick?.(targetCategory)}
                        className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-200 hover:shadow-sm transition-all text-left group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <Vote className="w-4 h-4 text-purple-500" />
                            <span className="text-xs font-bold text-purple-600">{categoryLabel} 투표</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2">
                            {relatedContent.polls[0]?.question || 'VS 투표 참여하기'}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-purple-400">
                                {relatedContent.pollCount}개 투표
                            </span>
                            <ChevronRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}
