'use client';

import { useMemo } from 'react';
import { Brain, Vote, ChevronRight, Sparkles, Users, Trophy } from 'lucide-react';
import { ALL_KNOWLEDGE_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS } from '@/data/content/polls';
import { getCategoryInfo } from '@/data/content/categories';
import { TEST_TO_CATEGORY } from '@/data/contentGraph';

// ============================================================================
// Types
// ============================================================================

interface ContentActionsProps {
    testType: string;
    onQuizClick?: (category?: string) => void;
    onPollClick?: (category?: string) => void;
    onCompareClick?: () => void;
    onRankingClick?: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function ContentActions({
    testType,
    onQuizClick,
    onPollClick,
    onCompareClick,
    onRankingClick
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

    const categoryInfo = getCategoryInfo(targetCategory);
    const categoryLabel = categoryInfo.name;

    // 모든 액션이 없으면 렌더링 안함
    const hasContent = relatedContent.quizzes.length > 0 || relatedContent.polls.length > 0;
    const hasActions = onCompareClick || onRankingClick;

    if (!hasContent && !hasActions) {
        return null;
    }

    return (
        <div className="mt-6 w-full">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-sm font-bold text-slate-800">다음에 해볼까요?</span>
            </div>

            {/* 2x2 그리드 카드 */}
            <div className="grid grid-cols-2 gap-2">
                {/* 퀴즈 카드 */}
                {relatedContent.quizzes.length > 0 && onQuizClick && (
                    <button
                        onClick={() => onQuizClick(targetCategory)}
                        className="p-3 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border border-indigo-100 hover:border-indigo-200 hover:shadow-md transition-all text-left group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Brain className="w-4 h-4 text-indigo-500" />
                            </div>
                            <span className="text-xs font-bold text-indigo-600">{categoryLabel} 퀴즈</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2 min-h-[2rem]">
                            {relatedContent.quizzes[0]?.question || '관련 퀴즈 풀어보기'}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-indigo-400">
                                {relatedContent.quizCount}개
                            </span>
                            <ChevronRight className="w-3 h-3 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                )}

                {/* 투표 카드 */}
                {relatedContent.polls.length > 0 && onPollClick && (
                    <button
                        onClick={() => onPollClick(targetCategory)}
                        className="p-3 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:border-purple-200 hover:shadow-md transition-all text-left group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Vote className="w-4 h-4 text-purple-500" />
                            </div>
                            <span className="text-xs font-bold text-purple-600">{categoryLabel} 투표</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2 min-h-[2rem]">
                            {relatedContent.polls[0]?.question || 'VS 투표 참여하기'}
                        </p>
                        <div className="flex items-center justify-between">
                            <span className="text-xs text-purple-400">
                                {relatedContent.pollCount}개
                            </span>
                            <ChevronRight className="w-3 h-3 text-purple-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                )}

                {/* 친구 비교 카드 */}
                {onCompareClick && (
                    <button
                        onClick={onCompareClick}
                        className="p-3 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:border-amber-200 hover:shadow-md transition-all text-left group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Users className="w-4 h-4 text-amber-500" />
                            </div>
                            <span className="text-xs font-bold text-amber-600">친구와 비교</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2 min-h-[2rem]">
                            내 결과 공유하고 친구 결과와 비교해보세요
                        </p>
                        <div className="flex items-center justify-end">
                            <ChevronRight className="w-3 h-3 text-amber-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                )}

                {/* 랭킹 카드 */}
                {onRankingClick && (
                    <button
                        onClick={onRankingClick}
                        className="p-3 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100 hover:border-emerald-200 hover:shadow-md transition-all text-left group"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-7 h-7 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <Trophy className="w-4 h-4 text-emerald-500" />
                            </div>
                            <span className="text-xs font-bold text-emerald-600">랭킹 보기</span>
                        </div>
                        <p className="text-xs text-slate-600 line-clamp-2 mb-2 min-h-[2rem]">
                            같은 결과 사람들 순위 확인
                        </p>
                        <div className="flex items-center justify-end">
                            <ChevronRight className="w-3 h-3 text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                    </button>
                )}
            </div>
        </div>
    );
}
