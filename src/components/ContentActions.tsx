'use client';

import React from 'react';
import { nextActionService } from '../services/NextActionService';
import { NextActionInline } from './NextActionCard';

// ============================================================================
// Types
// ============================================================================

interface ContentActionsProps {
    testType: string;
    onQuizClick?: (category?: string) => void;
    onPollClick?: (category?: string) => void;
}

// ============================================================================
// Component
// ============================================================================

export default function ContentActions({
    testType,
    onQuizClick,
    onPollClick
}: ContentActionsProps) {
    const actions = nextActionService.getRecommendations({
        endpoint: 'test_result',
        contentId: testType,
    });

    // test 타입 제외하고 quiz, poll만 필터링
    const contentActions = actions.filter(a => a.type === 'quiz' || a.type === 'poll').slice(0, 2);

    if (contentActions.length === 0) return null;

    const handleActionClick = (action: { type: string; targetCategory?: string }) => {
        if (action.type === 'quiz') {
            onQuizClick?.(action.targetCategory);
        } else if (action.type === 'poll') {
            onPollClick?.(action.targetCategory);
        }
    };

    return (
        <div className="mt-4 w-full">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold text-slate-500">🎯 관련 콘텐츠</span>
            </div>
            <NextActionInline actions={contentActions} onActionClick={handleActionClick} />
        </div>
    );
}
