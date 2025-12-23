'use client';

import { useState, useCallback } from 'react';
import { CHEMI_DATA } from '../data/index';
import { SUBJECT_CONFIG } from '../data/config';
import { SCORING } from '@/config';
import { matchResultLabel } from '../data/utils';
import { resultService } from '../services/ResultService';
import ResultRankingView from '../components/ResultRankingView';
import RankingTab from '../components/RankingTab';
import Dashboard from '../components/Dashboard';
import ShareCard from '../components/ShareCard';
import { FullProfile } from '../components/MyProfile';
import ContentExplore from '../components/ContentExplore';
import ResultFeedback from '../components/ResultFeedback';
import FeedbackComments from '../components/FeedbackComments';
import FunFactsCard from '../components/FunFactsCard';
import BonusInsightCard from '../components/BonusInsightCard';
import BottomNav from '../components/BottomNav';
import Sidebar from '../components/Sidebar';
import RightSidebar from '../components/RightSidebar';
import { TabletSlidePanel, type TabletContentTab } from '../components/responsive';
import FriendInvite from '../components/FriendInvite';
import FriendCompare from '../components/FriendCompare';
import BadgeNotification from '../components/BadgeNotification';
import { getGamificationService } from '../services/GamificationService';
import CommunityBoard from '../components/CommunityBoard';
import { CareProfilePrompt } from '../components/care';
import BreedDetailCard from '../components/BreedDetailCard';
import NextTestRecommendation from '../components/NextTestRecommendation';
import ContentActions from '../components/ContentActions';
import * as Icons from '../components/Icons';
import type { SubjectKey, ResultLabel, Dimension, SubjectConfig } from '../data/types';
import type { NavTab } from '../components/nav/types';
import {
    ChevronLeft, Share2, RefreshCw, BarChart2,
    Check, X, Sparkles, Home as HomeIcon, Trophy, ArrowRight, MessageSquare,
    Dog, Cat, Fish, Bird, Bug
} from 'lucide-react';

// Icons extraction for Result Characters
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { Capsule, HumanIcon } = Icons as any;

const MAX_SCORE_PER_QUESTION = SCORING.MAX_SCORE_PER_QUESTION;

// ============================================================================
// 타입 정의
// ============================================================================

type ViewType = 'dashboard' | 'test';
type StepType = 'intro' | 'question' | 'directSelect' | 'loading' | 'result';
type DetailTabType = 'interpretation' | 'guide';

// 모달 상태 통합 - 7개 boolean → 1개 유니온 타입
// care는 프로필 > 동물 탭에서 직접 관리하므로 제거
type ActiveModal =
    | 'profile'
    | 'contentExplore'  // 퀴즈/투표 (참여형 콘텐츠)
    | 'ranking'
    | 'community'
    | 'shareCard'
    | 'friendCompare'
    | 'graphPopup'
    | null;

interface Answer {
    qIdx: number;
    dimension: string;
    score: number;
}

interface ParentInfo {
    testType: string;
    resultName: string;
    directSelect?: boolean;
}


// ============================================================================
// 메인 컴포넌트
// ============================================================================

export default function Home() {
    // 뷰/테스트 상태
    const [view, setView] = useState<ViewType>('dashboard');
    const [mode, setMode] = useState<SubjectKey>('human');
    const [step, setStep] = useState<StepType>('intro');
    const [qIdx, setQIdx] = useState(0);
    const [scores, setScores] = useState<Record<string, number>>({});
    const [finalResult, setFinalResult] = useState<ResultLabel | null>(null);
    const [detailTab, setDetailTab] = useState<DetailTabType>('interpretation');
    const [isDeepMode, setIsDeepMode] = useState(false);
    const [answers, setAnswers] = useState<Answer[]>([]);

    // 모달 상태 통합 (기존 7개 boolean → 1개)
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    // 기타 상태
    const [tabletContentTab, setTabletContentTab] = useState<TabletContentTab>(null);
    const [parentInfo, setParentInfo] = useState<ParentInfo | null>(null);
    const [activeNavTab, setActiveNavTab] = useState<NavTab>('home');
    const [badgeQueue, setBadgeQueue] = useState<string[]>([]);

    // 헬퍼: 모달 열기/닫기
    const openModal = (modal: ActiveModal) => setActiveModal(modal);
    const closeModal = () => setActiveModal(null);

    // Ensure mode is valid
    const safeMode: SubjectKey = CHEMI_DATA[mode] ? mode : 'human';

    const currentModeData = CHEMI_DATA[safeMode];
    const dimensions = currentModeData.dimensions;
    const basicQuestions = currentModeData.questions || [];
    const deepQuestions = currentModeData.questions_deep || [];
    const questions = isDeepMode ? [...basicQuestions, ...deepQuestions] : basicQuestions;
    const maxQuestions = questions.length;

    const displayQuestionNum = qIdx + 1;
    const displayTotalQuestions = questions.length;

    const getInitialScores = useCallback(() => {
        const initial: Record<string, number> = {};
        Object.keys(dimensions).forEach(dim => initial[dim] = 0);
        return initial;
    }, [dimensions]);

    const subjectConfig = (SUBJECT_CONFIG[mode as keyof typeof SUBJECT_CONFIG] || {}) as Partial<SubjectConfig>;

    const handleStartTest = (testType: SubjectKey, fromParent: ParentInfo | null = null) => {
        setMode(testType);
        setStep('intro');
        setQIdx(0);
        setScores(getInitialScores());
        setAnswers([]);
        setIsDeepMode(false);
        setFinalResult(null);
        setParentInfo(fromParent);
        setView('test');
        closeModal(); // 모달 닫기
    };

    const handleAnswer = (dimension: string, scoreVal: number) => {
        setAnswers(prev => [...prev, { qIdx, dimension, score: scoreVal }]);
        const newScores = { ...scores, [dimension]: (scores[dimension] || 0) + scoreVal };
        setScores(newScores);
        if (qIdx + 1 < maxQuestions) {
            setQIdx(qIdx + 1);
        } else {
            calculateResult(newScores);
        }
    };

    const handleGoBack = () => {
        if (answers.length === 0) return;
        const lastAnswer = answers[answers.length - 1];
        setScores(prev => ({
            ...prev,
            [lastAnswer.dimension]: (prev[lastAnswer.dimension] || 0) - lastAnswer.score
        }));
        setAnswers(prev => prev.slice(0, -1));
        setQIdx(lastAnswer.qIdx);
    };

    const handleExit = () => {
        setView('dashboard');
        setStep('intro');
        setQIdx(0);
        setIsDeepMode(false);
        setActiveNavTab('home');
        closeModal();
    };

    // 하단 내비게이션 탭 변경 핸들러
    const handleNavTabChange = (tab: NavTab) => {
        setActiveNavTab(tab);
        closeModal(); // 모든 모달 닫기
        setView('dashboard');

        // 탭에 따라 모달 열기
        const tabToModal: Record<NavTab, ActiveModal> = {
            home: null,
            explore: 'contentExplore', // 퀴즈/투표 (참여형 콘텐츠)
            talk: 'community',
            ranking: 'ranking',
            profile: 'profile',
        };

        if (tabToModal[tab]) {
            openModal(tabToModal[tab]);
        }
    };

    const calculateResult = (finalScores: Record<string, number>) => {
        setStep('loading');
        setTimeout(async () => {
            const dimCounts: Record<string, number> = {};
            questions.forEach(q => {
                dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
            });

            const result = matchResultLabel(finalScores, dimensions, currentModeData.resultLabels as ResultLabel[], dimCounts);
            setFinalResult(result);
            setStep('result');
            setDetailTab('interpretation');

            if (resultService && result) {
                try {
                    await resultService.saveResult(mode, result, finalScores, isDeepMode, parentInfo || undefined);

                    const gamification = getGamificationService();
                    if (gamification) {
                        const { newBadges } = gamification.recordTestComplete(mode);
                        if (newBadges.length > 0) {
                            setBadgeQueue(prev => [...prev, ...newBadges]);
                        }
                    }
                } catch (error) {
                    console.error('Save failed:', error);
                }
            }
        }, 2000);
    };

    const restart = (newMode: SubjectKey = mode) => {
        setMode(newMode);
        setStep('intro');
        setQIdx(0);
        setScores(getInitialScores());
        setFinalResult(null);
        setIsDeepMode(false);
        setAnswers([]);
        closeModal();
    };

    const startDeepTest = () => {
        const deepStartIndex = basicQuestions.length;
        setQIdx(deepStartIndex);
        setIsDeepMode(true);
        setStep('question');
    };

    const getScorePercentage = (dimension: string) => {
        const questionsForDim = questions.filter(q => q.dimension === dimension);
        const maxPossible = questionsForDim.length * MAX_SCORE_PER_QUESTION;
        const score = scores[dimension] || 0;
        return maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
    };

    const getMaxScores = () => {
        const maxScores: Record<string, number> = {};
        Object.keys(dimensions).forEach(dim => {
            const questionsForDim = questions.filter(q => q.dimension === dim);
            maxScores[dim] = questionsForDim.length * MAX_SCORE_PER_QUESTION;
        });
        return maxScores;
    };

    // @ts-expect-error - Icons는 동적 접근
    const IconComponent = Icons[subjectConfig.icon] || HumanIcon;

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex">
            {/* 전역 모달들 - activeModal 기반으로 렌더링 */}
            {activeModal === 'profile' && (
                <FullProfile
                    onClose={() => {
                        closeModal();
                        setActiveNavTab('home');
                    }}
                    onStartTest={(testKey: string) => {
                        closeModal();
                        setActiveNavTab('home');
                        handleStartTest(testKey as SubjectKey);
                    }}
                />
            )}


            {/* 퀴즈/투표 (참여형 콘텐츠) */}
            {activeModal === 'contentExplore' && (
                <ContentExplore
                    initialTab="quiz"
                    onClose={() => {
                        closeModal();
                        setActiveNavTab('home');
                    }}
                    onStartTest={(testKey: string) => {
                        closeModal();
                        setActiveNavTab('home');
                        handleStartTest(testKey as SubjectKey);
                    }}
                    onNavigate={(target: string) => {
                        closeModal();
                        if (target === 'ranking') {
                            openModal('ranking');
                            setActiveNavTab('ranking');
                        } else if (target === 'community') {
                            openModal('community');
                            setActiveNavTab('talk');
                        }
                    }}
                />
            )}

            {activeModal === 'community' && (
                <div className="fixed inset-0 z-50 bg-[#F0F2F5] lg:left-60 lg:right-0">
                    <CommunityBoard
                        className="h-full"
                        onClose={() => {
                            closeModal();
                            setActiveNavTab('home');
                        }}
                    />
                </div>
            )}

            {view === 'dashboard' && activeModal === 'ranking' && (
                <RankingTab
                    onClose={() => {
                        closeModal();
                        setActiveNavTab('home');
                    }}
                    onStartTest={(testKey?: string) => {
                        closeModal();
                        setActiveNavTab('home');
                        handleStartTest((testKey || mode) as SubjectKey);
                    }}
                    onNavigate={(target: string) => {
                        closeModal();
                        if (target === 'poll' || target === 'quiz') {
                            openModal('contentExplore');
                            setActiveNavTab('explore');
                        } else if (target === 'community') {
                            openModal('community');
                            setActiveNavTab('talk');
                        }
                    }}
                />
            )}

            {/* 배지 획득 알림 */}
            {badgeQueue.length > 0 && (
                <BadgeNotification
                    badgeId={badgeQueue[0]}
                    onClose={() => setBadgeQueue(prev => prev.slice(1))}
                />
            )}

            {/* PC 좌측 사이드바 */}
            {view === 'dashboard' && (
                <Sidebar
                    activeTab={activeNavTab}
                    onTabChange={handleNavTabChange}
                    onStartTest={(testKey: string) => {
                        setActiveNavTab('home');
                        handleStartTest(testKey as SubjectKey);
                    }}
                />
            )}

            {/* 태블릿 띠지 탭 + 슬라이드 패널 */}
            {view === 'dashboard' && (
                <TabletSlidePanel
                    activeTab={tabletContentTab}
                    onTabChange={setTabletContentTab}
                    onExploreMore={() => {
                        setTabletContentTab(null);
                        openModal('contentExplore');
                        setActiveNavTab('explore');
                    }}
                />
            )}

            {/* 우측 사이드바 - fixed로 화면 고정 */}
            {view === 'dashboard' && (
                <RightSidebar
                    onOpenCommunity={() => {
                        openModal('community');
                        setActiveNavTab('talk');
                    }}
                    onOpenRanking={() => {
                        openModal('ranking');
                        setActiveNavTab('ranking');
                    }}
                    onStartTest={(testKey: string) => {
                        setActiveNavTab('home');
                        handleStartTest(testKey as SubjectKey);
                    }}
                />
            )}

            {/* 메인 콘텐츠 영역 - 좌우 사이드바가 fixed이므로 마진 추가 (테스트 뷰에서는 우측 마진 제외) */}
            <main className={`flex-1 min-h-screen flex p-4 pb-20 lg:pb-4 lg:ml-60 ${view === 'dashboard' ? 'xl:mr-80' : ''}`}>
                {view === 'dashboard' ? (
                    <div className="flex-1 flex justify-center">
                        <Dashboard
                            onStartTest={(testKey: string) => {
                                setActiveNavTab('home');
                                handleStartTest(testKey as SubjectKey);
                            }}
                            onContentExplore={() => {
                                openModal('contentExplore');
                                setActiveNavTab('explore');
                            }}
                        />
                    </div>
                ) : (
                    <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col relative transition-all duration-500 w-full h-full max-w-md min-h-[750px] shadow-2xl border border-white/50">
                        {/* Aurora Background Mesh */}
                        <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-100/40 blur-3xl -z-10 animate-pulse-slow"></div>

                        {/* --- INTRO VIEW --- */}
                        {step === 'intro' && (
                            <div className="flex flex-col h-full animate-fade-in px-8 py-10">
                                <div className="flex justify-between items-center mb-4">
                                    <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-800 transition-colors">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                                    <div className="flex flex-col items-center gap-2 mb-6">
                                        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 border border-rose-100 shadow-sm">
                                            <div className="relative flex h-2.5 w-2.5">
                                                <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></div>
                                                <div className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500"></div>
                                            </div>
                                            <span className="text-xl font-black text-rose-600">12,483</span>
                                            <span className="text-sm font-bold text-slate-600">명이 했어요!</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500">
                                            <span className="flex items-center gap-1">
                                                <span className="text-amber-500">⭐</span>
                                                <span className="font-bold">4.8</span>
                                            </span>
                                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                                            <span className="flex items-center gap-1">
                                                <span>⏱️</span>
                                                <span className="font-bold">약 3분</span>
                                            </span>
                                        </div>
                                    </div>

                                    <IconComponent mood="happy" className="w-36 h-36 mb-6 drop-shadow-2xl animate-bounce-slight" />

                                    <h1 className="text-4xl font-black text-slate-800 mb-3 text-center leading-tight tracking-tight">
                                        {currentModeData.title}
                                    </h1>
                                    <p className="text-slate-500 text-base font-medium text-center mb-8 max-w-[260px] leading-relaxed">
                                        {currentModeData.subtitle}
                                    </p>

                                    <div className="w-full bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm space-y-3 mb-8">
                                        {(subjectConfig.intro || []).map((text: string, idx: number) => (
                                            <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                    <Check className="w-3 h-3" />
                                                </div>
                                                {text}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="mt-auto space-y-3">
                                    <button
                                        onClick={() => setStep('question')}
                                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                                    >
                                        테스트 시작하기 <ArrowRight className="w-5 h-5" />
                                    </button>

                                    {mode === 'petMatch' && (
                                        <button
                                            onClick={() => setStep('directSelect')}
                                            className="w-full py-3.5 rounded-xl bg-white/60 hover:bg-white border border-white/60 text-slate-600 font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md"
                                        >
                                            <Check className="w-4 h-4 text-amber-500" />
                                            이미 원하는 동물이 있어요
                                        </button>
                                    )}

                                    <button onClick={() => openModal('ranking')} className="w-full py-3 text-slate-500 text-sm font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5">
                                        <Trophy className="w-4 h-4" /> 어떤 결과가 나올까? 미리보기
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- QUESTION VIEW --- */}
                        {step === 'question' && (
                            <div className="flex flex-col h-full animate-fade-in px-6 py-8">
                                <div className="flex justify-between items-center mb-8">
                                    <button onClick={handleGoBack} className="p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-800 transition-colors">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        {isDeepMode ? 'DEEP MODE' : 'QUESTION'}
                                    </span>
                                    <button onClick={handleExit} className="p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-red-500 transition-colors">
                                        <X className="w-6 h-6" />
                                    </button>
                                </div>

                                <div className="mb-10">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-black text-indigo-600">Q{displayQuestionNum}</span>
                                        <span className="text-xs font-bold text-slate-400">
                                            {displayQuestionNum}/{displayTotalQuestions}
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden shadow-inner">
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full transition-all duration-700 ease-out relative"
                                            style={{ width: `${((displayQuestionNum) / displayTotalQuestions) * 100}%` }}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 flex flex-col items-center justify-center -mt-6">
                                    <h2 className="text-3xl font-black text-slate-800 text-center leading-snug break-keep drop-shadow-sm">
                                        {questions[qIdx]?.q}
                                    </h2>
                                </div>

                                <div className="space-y-3 mt-auto mb-8">
                                    {questions[qIdx]?.a.map((ans: { text: string; score: number }, idx: number) => (
                                        <button
                                            key={idx}
                                            onClick={() => handleAnswer(questions[qIdx].dimension, ans.score)}
                                            className="w-full p-5 rounded-2xl bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-200 shadow-sm hover:shadow-md transition-all duration-200 text-left group flex items-center justify-between"
                                        >
                                            <span className="font-bold text-slate-600 group-hover:text-indigo-700 text-lg transition-colors">{ans.text}</span>
                                            <div className="w-6 h-6 rounded-full border-2 border-slate-200 group-hover:border-indigo-500 group-hover:bg-indigo-500 transition-all"></div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* --- DIRECT SELECT VIEW (petMatch 전용) --- */}
                        {step === 'directSelect' && mode === 'petMatch' && (
                            <div className="flex flex-col h-full animate-fade-in px-6 py-8">
                                <div className="flex justify-between items-center mb-6">
                                    <button onClick={() => setStep('intro')} className="p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-800 transition-colors">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        직접 선택
                                    </span>
                                    <div className="w-10" />
                                </div>

                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">
                                        어떤 반려동물을 원하세요?
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        해당 동물의 품종/종류 테스트로 바로 이동해요
                                    </p>
                                </div>

                                <div className="flex-1 space-y-3 overflow-y-auto">
                                    {(currentModeData.resultLabels as ResultLabel[]).map((result: ResultLabel) => {
                                        const nextTest = result.nextTest as SubjectKey | undefined;
                                        const nextData = nextTest ? CHEMI_DATA[nextTest] : null;
                                        const nextConfig = nextTest ? SUBJECT_CONFIG[nextTest] : null;
                                        // @ts-expect-error - Icons는 동적 접근
                                        const PetIcon = nextConfig ? Icons[nextConfig.icon] : null;

                                        if (!nextTest || !nextData) return null;

                                        return (
                                            <button
                                                key={result.name}
                                                onClick={() => handleStartTest(nextTest, { testType: 'petMatch', resultName: result.name, directSelect: true })}
                                                className="w-full p-4 rounded-2xl bg-white/70 hover:bg-white border border-white/60 hover:border-amber-200 shadow-sm hover:shadow-md transition-all duration-200 text-left group flex items-center gap-4"
                                            >
                                                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center border border-amber-100 group-hover:scale-110 transition-transform">
                                                    {PetIcon ? (
                                                        <PetIcon mood="happy" className="w-10 h-10" />
                                                    ) : (
                                                        <span className="text-3xl">{result.emoji}</span>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-0.5">
                                                        <span className="text-lg">{result.emoji}</span>
                                                        <span className="font-black text-slate-800 text-lg group-hover:text-amber-600 transition-colors">
                                                            {result.name}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-slate-500">
                                                        {nextData.resultLabels?.length || 0}개 {result.name === '강아지' || result.name === '고양이' ? '품종' : '종류'} 중 베스트 매치 찾기
                                                    </p>
                                                </div>
                                                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-amber-500 transition-colors" />
                                            </button>
                                        );
                                    })}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => setStep('question')}
                                        className="w-full py-3 text-slate-500 text-sm font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        잘 모르겠어요, 추천받을래요
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- LOADING VIEW --- */}
                        {step === 'loading' && (
                            <div className="flex flex-col items-center justify-center h-full animate-fade-in p-8 text-center">
                                <div className="relative mb-12">
                                    <div className="absolute inset-0 bg-indigo-300 rounded-full animate-ping opacity-20"></div>
                                    <div className="relative animate-bounce-slight">
                                        <Capsule className="w-28 h-28 drop-shadow-2xl" />
                                    </div>
                                </div>
                                <h2 className="text-2xl font-black text-slate-800 mb-2">결과 분석 중...</h2>
                                <p className="text-slate-500 font-medium animate-pulse">잠시만 기다려주세요 🔍</p>
                            </div>
                        )}

                        {/* --- RESULT VIEW --- */}
                        {step === 'result' && finalResult && (
                            <div className="flex flex-col h-full animate-fade-in relative">
                                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-white/90 to-transparent">
                                    <button onClick={() => setView('dashboard')} className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white">
                                        <HomeIcon className="w-5 h-5 text-slate-600" />
                                    </button>
                                    <button
                                        onClick={() => openModal('shareCard')}
                                        className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white text-indigo-600"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-1 overflow-y-auto no-scrollbar pt-14 px-5 pb-20">
                                    <div className="flex flex-col items-center text-center">
                                        {subjectConfig.resultFormat === 'matching' ? (
                                            <div className="w-full mb-4">
                                                <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5 border-2 border-indigo-100 shadow-lg overflow-hidden">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-pink-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs font-bold text-slate-400">{currentModeData.title} 결과</span>
                                                        <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500">
                                                            MATCH
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative flex-shrink-0">
                                                            <IconComponent mood={finalResult.mood || 'happy'} className="w-20 h-20 drop-shadow-lg" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className="text-3xl mb-1">{finalResult.emoji}</div>
                                                            <h1 className="text-xl font-black text-slate-800 leading-tight">
                                                                {finalResult.name}
                                                            </h1>
                                                        </div>
                                                    </div>
                                                    <p className="mt-3 text-sm font-medium text-slate-600 leading-relaxed break-keep border-t border-slate-100 pt-3">
                                                        &quot;{finalResult.desc}&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="flex items-center gap-4 mb-4 w-full">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 to-pink-200/50 blur-2xl rounded-full scale-150"></div>
                                                        <IconComponent mood={finalResult.mood || 'happy'} className="w-24 h-24 relative z-10 drop-shadow-xl" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-bold text-white mb-1 bg-indigo-400">
                                                            {finalResult.mood || 'RARE'} TYPE
                                                        </span>
                                                        <h1 className="text-2xl font-black text-slate-800 leading-tight">
                                                            {finalResult.name}
                                                        </h1>
                                                        <p className="text-xs text-slate-500 mt-1">{finalResult.emoji} {currentModeData.title}</p>
                                                    </div>
                                                </div>
                                                <div className="w-full bg-white/70 backdrop-blur-md rounded-xl p-4 border border-white/50 shadow-sm mb-4">
                                                    <p className="text-slate-700 font-semibold text-sm leading-relaxed break-keep">
                                                        &quot;{finalResult.desc}&quot;
                                                    </p>
                                                </div>
                                            </>
                                        )}

                                        {isDeepMode && (
                                            <button onClick={() => openModal('graphPopup')} className="w-full mb-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
                                                <BarChart2 className="w-4 h-4" /> 상세 성향 그래프
                                            </button>
                                        )}

                                        <div className="w-full space-y-3 text-left">
                                            {subjectConfig.resultFormat === 'matching' ? (
                                                <>
                                                    <div className="bg-white/60 rounded-xl p-1 border border-white/50 flex">
                                                        {(['interpretation', 'guide'] as const).map((tab) => (
                                                            <button
                                                                key={tab}
                                                                onClick={() => setDetailTab(tab)}
                                                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${detailTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                                            >
                                                                {tab === 'interpretation' ? '📖 소개' : '💡 팁'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                    <div className="bg-white/60 rounded-xl p-4 border border-white/50">
                                                        <p className="text-slate-600 text-sm leading-relaxed">
                                                            {detailTab === 'interpretation' ? finalResult.interpretation : finalResult.guide}
                                                        </p>
                                                    </div>

                                                    {(finalResult.matchPoints || []).length > 0 && (
                                                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                                                            <h3 className="font-bold text-slate-500 mb-2 flex items-center gap-1.5 text-xs">
                                                                <Check className="w-3 h-3 text-green-500" />
                                                                {subjectConfig.matchPointsTitle || '추천 포인트'}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(finalResult.matchPoints || []).map((point, idx) => (
                                                                    <span key={idx} className="px-2 py-0.5 bg-white text-slate-600 text-xs rounded-full border border-slate-200">
                                                                        {point}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {finalResult.meta?.funFacts && (
                                                        <FunFactsCard
                                                            funFacts={finalResult.meta.funFacts}
                                                            resultName={finalResult.name}
                                                            resultEmoji={finalResult.emoji}
                                                        />
                                                    )}

                                                    <BonusInsightCard
                                                        testType={safeMode}
                                                        resultName={finalResult.name}
                                                        resultEmoji={finalResult.emoji}
                                                    />

                                                    {finalResult.detailInfo && (() => {
                                                        const detailConfig: Record<string, { title: string; icon: typeof Dog | null }> = {
                                                            dogBreed: { title: '품종 상세 정보', icon: Dog },
                                                            catBreed: { title: '품종 상세 정보', icon: Cat },
                                                            smallPet: { title: '종류 상세 정보', icon: Bug },
                                                            fishType: { title: '종류 상세 정보', icon: Fish },
                                                            birdType: { title: '종류 상세 정보', icon: Bird },
                                                            reptileType: { title: '종류 상세 정보', icon: Bug },
                                                        };
                                                        const config = detailConfig[safeMode] || { title: '상세 정보', icon: null };
                                                        return <BreedDetailCard detailInfo={finalResult.detailInfo} title={config.title} icon={config.icon} />;
                                                    })()}

                                                    {finalResult.nextTest && CHEMI_DATA[finalResult.nextTest as SubjectKey] && (
                                                        <div className="mt-4 p-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 rounded-xl shadow-lg">
                                                            <div className="bg-white rounded-[10px] p-4">
                                                                <div className="flex items-center gap-1 mb-2">
                                                                    <Sparkles className="w-4 h-4 text-amber-500" />
                                                                    <span className="text-xs font-bold text-amber-600">더 자세히 알아보기</span>
                                                                </div>
                                                                <h4 className="font-black text-slate-800 mb-1">
                                                                    어떤 {finalResult.name === '강아지' ? '품종' : finalResult.name === '고양이' ? '품종' : '종류'}가 나와 맞을까?
                                                                </h4>
                                                                <p className="text-xs text-slate-500 mb-3">
                                                                    {CHEMI_DATA[finalResult.nextTest as SubjectKey].resultLabels?.length || 0}개 {finalResult.name === '강아지' || finalResult.name === '고양이' ? '품종' : '종류'} 중 나의 베스트 매치를 찾아보세요!
                                                                </p>
                                                                <button
                                                                    onClick={() => handleStartTest(finalResult.nextTest as SubjectKey, { testType: mode, resultName: finalResult.name })}
                                                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                                                                >
                                                                    {CHEMI_DATA[finalResult.nextTest as SubjectKey].title} 시작하기
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <div className="bg-white/60 rounded-xl p-4 border border-white/50 space-y-3">
                                                        <div>
                                                            <h3 className="font-bold text-slate-800 mb-1 text-sm">💡 상세 분석</h3>
                                                            <p className="text-slate-600 text-sm leading-relaxed">{finalResult.interpretation}</p>
                                                        </div>
                                                        <div className="border-t border-slate-100 pt-3">
                                                            <h3 className="font-bold text-slate-800 mb-1 text-sm">🍀 팁</h3>
                                                            <p className="text-slate-600 text-sm leading-relaxed">{finalResult.guide}</p>
                                                        </div>
                                                    </div>

                                                    <BonusInsightCard
                                                        testType={safeMode}
                                                        resultName={finalResult.name}
                                                        resultEmoji={finalResult.emoji}
                                                    />
                                                </>
                                            )}
                                        </div>

                                        {!isDeepMode && deepQuestions.length > 0 && (
                                            <button
                                                onClick={startDeepTest}
                                                className="w-full mt-4 py-3 rounded-xl relative overflow-hidden group shadow-md"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-transform group-hover:scale-105 duration-500"></div>
                                                <div className="relative flex items-center justify-center gap-2 text-white font-bold text-sm">
                                                    <Sparkles className="w-4 h-4 animate-pulse" />
                                                    더 소름돋는 결과 보기 (+{deepQuestions.length}문항)
                                                </div>
                                            </button>
                                        )}

                                        {/* 공유 버튼 (핵심 CTA) */}
                                        <div className="w-full mt-6 space-y-3">
                                            <button
                                                onClick={() => openModal('shareCard')}
                                                className="w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-orange-500 text-white font-black text-base flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.98] relative overflow-hidden group"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-rose-600 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <span className="relative flex items-center gap-2">
                                                    📸 결과 카드 저장하기
                                                </span>
                                                <span className="relative text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                                    1.2K
                                                </span>
                                            </button>

                                            <button
                                                onClick={() => openModal('shareCard')}
                                                className="w-full py-3.5 rounded-xl bg-[#FEE500] text-[#391B1B] font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.52 1.67 4.73 4.17 6.02l-.67 3.48 4.08-2.7c.79.13 1.6.2 2.42.2 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
                                                </svg>
                                                카카오톡으로 공유하기
                                            </button>
                                        </div>

                                        {/* 다음 행동 추천 (퀴즈/투표/비교/랭킹) */}
                                        <ContentActions
                                            testType={mode}
                                            onQuizClick={() => {
                                                openModal('contentExplore');
                                                setActiveNavTab('explore');
                                            }}
                                            onPollClick={() => {
                                                openModal('contentExplore');
                                                setActiveNavTab('explore');
                                            }}
                                            onCompareClick={() => openModal('friendCompare')}
                                            onRankingClick={() => openModal('ranking')}
                                        />

                                        <FriendInvite
                                            testType={mode}
                                            testName={currentModeData.title}
                                            className="w-full mt-6"
                                        />

                                        <CareProfilePrompt
                                            testSubject={mode}
                                            resultKey={finalResult.name}
                                            resultEmoji={finalResult.emoji}
                                            resultName={finalResult.name}
                                        />

                                        <div className="w-full mt-6 space-y-4">
                                            <ResultFeedback testType={mode} resultName={finalResult.name} />
                                            <FeedbackComments testType={mode} resultName={finalResult.name} />
                                        </div>

                                        <NextTestRecommendation currentTest={mode} onSelectTest={handleStartTest} onGoHome={() => setView('dashboard')} />
                                    </div>
                                </div>

                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                    <button
                                        onClick={() => restart()}
                                        className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/50 text-slate-600 text-xs font-bold hover:bg-white hover:text-indigo-600 transition-all flex items-center gap-1.5"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" /> 처음으로
                                    </button>
                                </div>

                                {/* Share Card Modal */}
                                {activeModal === 'shareCard' && finalResult && (
                                    <ShareCard
                                        testTitle={currentModeData.title}
                                        testKey={safeMode}
                                        resultName={finalResult.name}
                                        resultEmoji={finalResult.emoji}
                                        resultDesc={finalResult.desc}
                                        dimensions={dimensions}
                                        scores={scores}
                                        maxScores={getMaxScores()}
                                        onClose={closeModal}
                                        onCompare={() => {
                                            openModal('friendCompare');
                                        }}
                                    />
                                )}

                                {/* Friend Compare Modal */}
                                {activeModal === 'friendCompare' && finalResult && (
                                    <FriendCompare
                                        testType={mode}
                                        testName={currentModeData.title}
                                        myResult={finalResult.name}
                                        myResultEmoji={finalResult.emoji}
                                        myScores={scores}
                                        dimensions={dimensions}
                                        onClose={closeModal}
                                    />
                                )}
                            </div>
                        )}

                        {/* --- GRAPH POPUP --- */}
                        {activeModal === 'graphPopup' && (
                            <div className="absolute inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in">
                                <div className="bg-white w-full sm:w-[90%] max-w-sm rounded-t-[2rem] sm:rounded-[2rem] p-6 pb-10 shadow-2xl animate-slide-up relative max-h-[85%] overflow-y-auto">
                                    <h3 className="text-xl font-black text-slate-800 mb-6 text-center flex items-center justify-center gap-2">
                                        <BarChart2 className="w-6 h-6 text-indigo-500" /> 상세 성향 분석
                                    </h3>
                                    <div className="space-y-5">
                                        {Object.entries(dimensions).map(([key, dim], idx) => {
                                            const percentage = getScorePercentage(key);
                                            const colorClass = ['bg-rose-400', 'bg-amber-400', 'bg-emerald-400', 'bg-sky-400', 'bg-violet-400', 'bg-fuchsia-400'][idx % 6];
                                            return (
                                                <div key={key}>
                                                    <div className="flex justify-between items-center mb-1.5">
                                                        <span className="font-bold text-slate-700 text-sm flex items-center gap-2">
                                                            <span className="text-lg">{(dim as { emoji: string }).emoji}</span> {(dim as { name: string }).name}
                                                        </span>
                                                        <span className="font-bold text-indigo-600 text-sm">{percentage}%</span>
                                                    </div>
                                                    <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                        <div className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
                                                    </div>
                                                    <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{(dim as { desc: string }).desc}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <button onClick={closeModal} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800">
                                        <X className="w-6 h-6" />
                                    </button>
                                    <button onClick={closeModal} className="w-full mt-8 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                        닫기
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* --- RESULT RANKING VIEW --- */}
                        {activeModal === 'ranking' && view === 'test' && (
                            <ResultRankingView
                                testType={mode}
                                viewMode={step === 'result' && finalResult ? 'compare' : 'preview'}
                                myResult={step === 'result' && finalResult ? finalResult : null}
                                onClose={closeModal}
                                onStartTest={step !== 'result' ? () => handleStartTest(mode) : undefined}
                                onRestart={step === 'result' ? () => restart() : undefined}
                                onShare={step === 'result' ? () => {
                                    openModal('shareCard');
                                } : undefined}
                            />
                        )}
                    </div>
                )}

            </main>

            {/* 하단 내비게이션 - 모달 위에 표시되도록 main 밖에 배치 */}
            {view === 'dashboard' && (
                <BottomNav
                    activeTab={activeNavTab}
                    onTabChange={handleNavTabChange}
                />
            )}
        </div>
    );
}
