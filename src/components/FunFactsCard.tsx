'use client';

import React, { useState } from 'react';
import { Lightbulb, AlertCircle, Sparkles, Share2, ChevronDown, ChevronUp, Copy, Check } from 'lucide-react';

interface FunFacts {
    didYouKnow?: string[];
    commonMistakes?: string[];
    proTips?: string[];
    viralOneLiner?: string;
}

interface FunFactsCardProps {
    funFacts: FunFacts;
    resultName: string;
    resultEmoji: string;
}

type TabKey = 'didYouKnow' | 'commonMistakes' | 'proTips';

interface Tab {
    key: TabKey;
    label: string;
    icon: typeof Sparkles;
    color: string;
    data: string[];
}

export default function FunFactsCard({ funFacts, resultName, resultEmoji }: FunFactsCardProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [copiedOneLiner, setCopiedOneLiner] = useState(false);
    const [activeTab, setActiveTab] = useState<TabKey>('didYouKnow');

    if (!funFacts) return null;

    const { didYouKnow = [], commonMistakes = [], proTips = [], viralOneLiner } = funFacts;

    // 탭 데이터
    const tabs: Tab[] = [
        {
            key: 'didYouKnow',
            label: '알고 계셨나요?',
            icon: Sparkles,
            color: 'amber',
            data: didYouKnow
        },
        {
            key: 'commonMistakes',
            label: '흔한 오해',
            icon: AlertCircle,
            color: 'rose',
            data: commonMistakes
        },
        {
            key: 'proTips',
            label: '프로 팁',
            icon: Lightbulb,
            color: 'emerald',
            data: proTips
        },
    ];

    const currentTab = tabs.find(t => t.key === activeTab);

    // viralOneLiner 복사
    const handleCopyOneLiner = async () => {
        if (!viralOneLiner) return;

        try {
            await navigator.clipboard.writeText(viralOneLiner);
            setCopiedOneLiner(true);
            setTimeout(() => setCopiedOneLiner(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    // SNS 공유 (Web Share API)
    const handleShareOneLiner = async () => {
        if (!viralOneLiner) return;

        const shareText = `${viralOneLiner}\n\n나도 테스트 해보기 👉`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: `${resultEmoji} ${resultName} - 재미있는 사실`,
                    text: shareText,
                    url: window.location.href,
                });
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    console.error('Share failed:', err);
                }
            }
        } else {
            // Fallback: 클립보드에 복사
            handleCopyOneLiner();
        }
    };

    return (
        <div className="w-full mt-4">
            {/* 메인 카드 - 항상 viralOneLiner 표시 */}
            {viralOneLiner && (
                <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl border border-violet-200/50 overflow-hidden mb-3">
                    <div className="p-4">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg">
                                <Sparkles className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-violet-600 uppercase tracking-wider mb-1">
                                    SNS 공유용 한 마디
                                </p>
                                <p className="text-sm font-bold text-slate-800 leading-relaxed break-keep">
                                    {viralOneLiner}
                                </p>
                            </div>
                        </div>

                        {/* 공유/복사 버튼 */}
                        <div className="flex gap-2 mt-3">
                            <button
                                onClick={handleShareOneLiner}
                                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg transition-all active:scale-95"
                            >
                                <Share2 className="w-3.5 h-3.5" />
                                SNS 공유
                            </button>
                            <button
                                onClick={handleCopyOneLiner}
                                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
                                    copiedOneLiner
                                        ? 'bg-emerald-500 text-white'
                                        : 'bg-white border border-violet-200 text-violet-600 hover:bg-violet-50'
                                }`}
                            >
                                {copiedOneLiner ? (
                                    <>
                                        <Check className="w-3.5 h-3.5" />
                                        복사됨!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3.5 h-3.5" />
                                        복사
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* 확장 가능한 상세 정보 */}
            <div className="bg-white/60 rounded-xl border border-slate-200/50 overflow-hidden">
                {/* 헤더 - 클릭하면 펼쳐짐 */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-lg">{resultEmoji}</span>
                        <span className="font-bold text-slate-700 text-sm">
                            {resultName}에 대해 더 알아보기
                        </span>
                    </div>
                    {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                        <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                </button>

                {/* 확장 콘텐츠 */}
                {isExpanded && (
                    <div className="px-4 pb-4 animate-fade-in">
                        {/* 탭 선택 */}
                        <div className="flex gap-1 p-1 bg-slate-100 rounded-xl mb-3">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                const isActive = activeTab === tab.key;
                                return (
                                    <button
                                        key={tab.key}
                                        onClick={() => setActiveTab(tab.key)}
                                        className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1 ${
                                            isActive
                                                ? `bg-white shadow-sm text-${tab.color}-600`
                                                : 'text-slate-400 hover:text-slate-600'
                                        }`}
                                    >
                                        <Icon className="w-3 h-3" />
                                        <span className="hidden sm:inline">{tab.label}</span>
                                    </button>
                                );
                            })}
                        </div>

                        {/* 탭 콘텐츠 */}
                        <div className="space-y-2">
                            {currentTab?.data.map((item, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start gap-2.5 p-3 rounded-xl ${
                                        currentTab.key === 'didYouKnow' ? 'bg-amber-50/80' :
                                        currentTab.key === 'commonMistakes' ? 'bg-rose-50/80' :
                                        'bg-emerald-50/80'
                                    }`}
                                >
                                    <span className={`text-sm mt-0.5 ${
                                        currentTab.key === 'didYouKnow' ? 'text-amber-500' :
                                        currentTab.key === 'commonMistakes' ? 'text-rose-500' :
                                        'text-emerald-500'
                                    }`}>
                                        {currentTab.key === 'didYouKnow' ? '✨' :
                                         currentTab.key === 'commonMistakes' ? '⚠️' : '💡'}
                                    </span>
                                    <p className="text-sm text-slate-700 leading-relaxed flex-1">
                                        {item}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* 탭별 데이터가 없을 때 */}
                        {(!currentTab?.data || currentTab.data.length === 0) && (
                            <div className="text-center py-6 text-slate-400 text-sm">
                                아직 준비 중이에요
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
