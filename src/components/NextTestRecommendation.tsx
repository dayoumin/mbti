'use client';

import { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Home as HomeIcon } from 'lucide-react';
import { CHEMI_DATA } from '../data/index';
import { SUBJECT_CONFIG } from '../data/config';
import { SubjectKey } from '../data/types';
import { resultService } from '../services/ResultService';
import { nextActionService } from '../services/NextActionService';
import * as Icons from './Icons';

// ============================================================================
// Types
// ============================================================================

interface Recommendation {
    testType: SubjectKey;
    reason: 'new' | 'retest';
    label?: string;
    description?: string;
}

interface NextTestRecommendationProps {
    currentTest: SubjectKey;
    onSelectTest: (testType: SubjectKey) => void;
    onGoHome: () => void;
}

// ============================================================================
// Component
// ============================================================================

export default function NextTestRecommendation({
    currentTest,
    onSelectTest,
    onGoHome
}: NextTestRecommendationProps) {
    const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
    const [completedCount, setCompletedCount] = useState(0);
    const [incompleteCount, setIncompleteCount] = useState(0);

    useEffect(() => {
        const loadRecommendation = async () => {
            const completed = await resultService.getCompletedTests();
            const incomplete = await resultService.getIncompleteTests();
            setCompletedCount(completed.length);
            setIncompleteCount(incomplete.length);

            // NextActionService의 개인화 추천 사용
            const personalizedAction = nextActionService.getPersonalizedTestRecommendation(
                currentTest,
                completed,
                incomplete.filter(t => t !== currentTest)
            );

            if (personalizedAction && personalizedAction.targetId) {
                setRecommendation({
                    testType: personalizedAction.targetId as SubjectKey,
                    reason: incomplete.includes(personalizedAction.targetId as SubjectKey) ? 'new' : 'retest',
                    label: personalizedAction.label,
                    description: personalizedAction.description,
                });
            } else {
                // 폴백: 기존 로직
                const rec = await resultService.getRecommendedTest();
                if (rec && rec.testType !== currentTest) {
                    setRecommendation({
                        testType: rec.testType as SubjectKey,
                        reason: rec.reason as 'new' | 'retest',
                    });
                }
            }
        };
        loadRecommendation();
    }, [currentTest]);

    if (!recommendation) return null;

    const config = SUBJECT_CONFIG[recommendation.testType];
    const data = CHEMI_DATA[recommendation.testType];

    if (!config || !data) return null;

    const IconComponent = Icons[config.icon as keyof typeof Icons] as React.ComponentType<{
        mood?: string;
        className?: string;
    }>;

    return (
        <div className="mt-5 w-full">
            <div className="p-0.5 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-xl border border-slate-50/60">
                <div className="bg-slate-50/70 rounded-[10px] p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {recommendation.label || (recommendation.reason === 'retest' ? '다시 해볼까요?' : '다음 추천')}
                        </span>
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {completedCount}/{completedCount + incompleteCount} 완료
                        </span>
                    </div>

                    <button
                        onClick={() => onSelectTest(recommendation.testType)}
                        className="w-full flex items-center gap-3 text-left group"
                    >
                        {IconComponent && (
                            <div className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                <IconComponent mood="happy" className="w-7 h-7" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-primary group-hover:text-indigo-600 transition-colors text-sm truncate">{data.title}</h4>
                            <p className="text-xs text-slate-400 truncate">
                                {recommendation.description || (recommendation.reason === 'new' ? '아직 안 해본 테스트예요!' : data.subtitle)}
                            </p>
                        </div>
                        <div className="w-6 h-6 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all flex-shrink-0">
                            <ArrowRight className="w-3 h-3" />
                        </div>
                    </button>
                </div>
            </div>

            <button
                onClick={onGoHome}
                className="w-full mt-2 py-2 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors"
            >
                <HomeIcon className="w-3 h-3" />
                대시보드로 돌아가기
            </button>
        </div>
    );
}
