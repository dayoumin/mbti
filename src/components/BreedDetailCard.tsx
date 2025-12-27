'use client';

import React, { useState } from 'react';
import {
    MapPin, Clock, Scale, Heart, AlertTriangle, Zap, Scissors,
    DollarSign, Lightbulb, ChevronDown, ChevronUp, Check
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface CostRange {
    min: number;
    max: number;
    note?: string;
}

export interface BreedDetailInfo {
    origin?: string;
    lifespan?: string;
    size?: string;
    weight?: string;
    personality?: string[];
    goodWith?: string[];
    notGoodWith?: string[];
    exerciseNeeds?: 'low' | 'medium' | 'high';
    groomingNeeds?: 'low' | 'medium' | 'high';
    sheddingLevel?: 'low' | 'medium' | 'high';
    trainingDifficulty?: 'easy' | 'medium' | 'hard';
    healthIssues?: string[];
    initialCost?: CostRange;
    monthlyCost?: CostRange;
    tips?: string[];
}

interface BreedDetailCardProps {
    detailInfo: BreedDetailInfo | null | undefined;
    title?: string;
    icon?: React.ComponentType<{ className?: string }> | null;
}

// ============================================================================
// Constants
// ============================================================================

const DETAIL_LABELS = {
    needsLevel: { low: '낮음', medium: '보통', high: '높음' },
    difficulty: { easy: '쉬움', medium: '보통', hard: '어려움' },
};

const DETAIL_COLORS = {
    needsLevel: {
        low: 'text-green-600 bg-green-50',
        medium: 'text-amber-600 bg-amber-50',
        high: 'text-rose-600 bg-rose-50'
    },
    difficulty: {
        easy: 'text-green-600 bg-green-50',
        medium: 'text-amber-600 bg-amber-50',
        hard: 'text-rose-600 bg-rose-50'
    },
};

// ============================================================================
// Component
// ============================================================================

export default function BreedDetailCard({
    detailInfo,
    title = "상세 정보",
    icon: IconComponent = null
}: BreedDetailCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!detailInfo) return null;

    const needsLevelLabel = (level: string) =>
        DETAIL_LABELS.needsLevel[level as keyof typeof DETAIL_LABELS.needsLevel] || level;
    const difficultyLabel = (level: string) =>
        DETAIL_LABELS.difficulty[level as keyof typeof DETAIL_LABELS.difficulty] || level;
    const needsLevelColor = (level: string) =>
        DETAIL_COLORS.needsLevel[level as keyof typeof DETAIL_COLORS.needsLevel] || 'text-slate-600 bg-slate-50';
    const difficultyColor = (level: string) =>
        DETAIL_COLORS.difficulty[level as keyof typeof DETAIL_COLORS.difficulty] || 'text-slate-600 bg-slate-50';

    return (
        <div className="w-full mt-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border border-amber-200/50 overflow-hidden">
            {/* 헤더 - 항상 보임 */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between text-left"
            >
                <div className="flex items-center gap-2">
                    {IconComponent && <IconComponent className="w-5 h-5 text-amber-600" />}
                    <span className="font-bold text-slate-800">{title}</span>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
            </button>

            {/* 확장 콘텐츠 */}
            {isExpanded && (
                <div className="px-4 pb-4 space-y-4 animate-fade-in">
                    {/* 기본 정보 */}
                    <div className="grid grid-cols-2 gap-2">
                        {detailInfo.origin && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50/70 rounded-lg">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">원산지</p>
                                    <p className="text-xs font-semibold text-slate-700">{detailInfo.origin}</p>
                                </div>
                            </div>
                        )}
                        {detailInfo.lifespan && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50/70 rounded-lg">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">평균 수명</p>
                                    <p className="text-xs font-semibold text-slate-700">{detailInfo.lifespan}</p>
                                </div>
                            </div>
                        )}
                        {detailInfo.size && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50/70 rounded-lg">
                                <Scale className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">크기</p>
                                    <p className="text-xs font-semibold text-slate-700">{detailInfo.size}</p>
                                </div>
                            </div>
                        )}
                        {detailInfo.weight && (
                            <div className="flex items-center gap-2 p-2 bg-slate-50/70 rounded-lg">
                                <Scale className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-xs text-slate-400">체중</p>
                                    <p className="text-xs font-semibold text-slate-700">{detailInfo.weight}</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 성격 특성 */}
                    {detailInfo.personality && detailInfo.personality.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                                <Heart className="w-3.5 h-3.5 text-pink-500" /> 성격 특성
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {detailInfo.personality.map((trait, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-pink-50 text-pink-700 text-xs font-medium rounded-full">
                                        {trait}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 잘 맞는 / 주의 대상 */}
                    <div className="grid grid-cols-2 gap-2">
                        {detailInfo.goodWith && detailInfo.goodWith.length > 0 && (
                            <div className="p-2.5 bg-green-50/80 rounded-lg">
                                <h4 className="text-xs font-bold text-green-700 mb-1.5 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> 잘 맞는 환경
                                </h4>
                                <div className="space-y-0.5">
                                    {detailInfo.goodWith.map((item, idx) => (
                                        <p key={idx} className="text-xs text-green-800">{item}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        {detailInfo.notGoodWith && detailInfo.notGoodWith.length > 0 && (
                            <div className="p-2.5 bg-rose-50/80 rounded-lg">
                                <h4 className="text-xs font-bold text-rose-700 mb-1.5 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> 주의 사항
                                </h4>
                                <div className="space-y-0.5">
                                    {detailInfo.notGoodWith.map((item, idx) => (
                                        <p key={idx} className="text-xs text-rose-800">{item}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* 관리 정보 */}
                    <div>
                        <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                            <Scissors className="w-3.5 h-3.5 text-indigo-500" /> 관리 정보
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {detailInfo.exerciseNeeds && (
                                <div className="flex items-center justify-between p-2 bg-slate-50/70 rounded-lg">
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> 운동량
                                    </span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${needsLevelColor(detailInfo.exerciseNeeds)}`}>
                                        {needsLevelLabel(detailInfo.exerciseNeeds)}
                                    </span>
                                </div>
                            )}
                            {detailInfo.groomingNeeds && (
                                <div className="flex items-center justify-between p-2 bg-slate-50/70 rounded-lg">
                                    <span className="text-xs text-slate-500 flex items-center gap-1">
                                        <Scissors className="w-3 h-3" /> 미용관리
                                    </span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${needsLevelColor(detailInfo.groomingNeeds)}`}>
                                        {needsLevelLabel(detailInfo.groomingNeeds)}
                                    </span>
                                </div>
                            )}
                            {detailInfo.sheddingLevel && (
                                <div className="flex items-center justify-between p-2 bg-slate-50/70 rounded-lg">
                                    <span className="text-xs text-slate-500">털빠짐</span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${needsLevelColor(detailInfo.sheddingLevel)}`}>
                                        {needsLevelLabel(detailInfo.sheddingLevel)}
                                    </span>
                                </div>
                            )}
                            {detailInfo.trainingDifficulty && (
                                <div className="flex items-center justify-between p-2 bg-slate-50/70 rounded-lg">
                                    <span className="text-xs text-slate-500">훈련난이도</span>
                                    <span className={`text-xs font-bold px-1.5 py-0.5 rounded ${difficultyColor(detailInfo.trainingDifficulty)}`}>
                                        {difficultyLabel(detailInfo.trainingDifficulty)}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 건강 주의사항 */}
                    {detailInfo.healthIssues && detailInfo.healthIssues.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> 건강 주의사항
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                                {detailInfo.healthIssues.map((issue, idx) => (
                                    <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 text-xs rounded-full">
                                        {issue}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 비용 정보 */}
                    {(detailInfo.monthlyCost || detailInfo.initialCost) && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                                <DollarSign className="w-3.5 h-3.5 text-green-500" /> 예상 비용 (만원)
                            </h4>
                            <div className="grid grid-cols-2 gap-2">
                                {detailInfo.initialCost && (
                                    <div className="p-2.5 bg-slate-50/70 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-0.5">초기 비용</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {detailInfo.initialCost.min}~{detailInfo.initialCost.max}만원
                                        </p>
                                        {detailInfo.initialCost.note && (
                                            <p className="text-xs text-slate-400 mt-0.5">{detailInfo.initialCost.note}</p>
                                        )}
                                    </div>
                                )}
                                {detailInfo.monthlyCost && (
                                    <div className="p-2.5 bg-slate-50/70 rounded-lg">
                                        <p className="text-xs text-slate-400 mb-0.5">월 비용</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {detailInfo.monthlyCost.min}~{detailInfo.monthlyCost.max}만원
                                        </p>
                                        {detailInfo.monthlyCost.note && (
                                            <p className="text-xs text-slate-400 mt-0.5">{detailInfo.monthlyCost.note}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* 양육 꿀팁 */}
                    {detailInfo.tips && detailInfo.tips.length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1.5">
                                <Lightbulb className="w-3.5 h-3.5 text-yellow-500" /> 양육 꿀팁
                            </h4>
                            <div className="space-y-1.5">
                                {detailInfo.tips.map((tip, idx) => (
                                    <div key={idx} className="flex items-start gap-2 p-2 bg-yellow-50/80 rounded-lg">
                                        <span className="text-yellow-500 font-bold text-xs mt-0.5">💡</span>
                                        <p className="text-xs text-slate-700 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
