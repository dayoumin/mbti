'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { CHEMI_DATA } from '../data/index';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_CONSTANTS } from '../data/constants';
import { matchResultLabel } from '../data/utils';
import { resultService } from '../services/ResultService';
import InsightView from '../components/InsightView';
import Dashboard from '../components/Dashboard';
import * as Icons from '../components/Icons';
import {
    ChevronLeft, ChevronRight, Share2, RefreshCw, BarChart2,
    Info, Check, X, Sparkles, Home as HomeIcon, Trophy, ArrowRight
} from 'lucide-react';

// Icons extraction for Result Characters (Keep custom SVGs for character art)
const { Capsule, CloseIcon, HumanIcon } = Icons;

const MAX_SCORE_PER_QUESTION = CHEMI_CONSTANTS.MAX_SCORE_PER_QUESTION;

// --- Components ---

// Premium Button Component
const GlassButton = ({ children, onClick, className = "", variant = "primary" }) => {
    const baseStyle = "w-full py-4 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95";

    // Variants
    const variants = {
        primary: "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg hover:shadow-indigo-500/30 hover:-translate-y-0.5",
        secondary: "bg-white/60 hover:bg-white/90 text-slate-700 border border-white/60 shadow-sm hover:shadow-md backdrop-blur-sm",
        outline: "border-2 border-indigo-100 text-indigo-600 hover:bg-indigo-50",
        ghost: "text-slate-500 hover:bg-slate-100/50 hover:text-slate-800"
    };

    return (
        <button onClick={onClick} className={`${baseStyle} ${variants[variant] || variants.primary} ${className}`}>
            {children}
        </button>
    );
};

// Next Test Recommendation Card
const NextTestRecommendation = ({ currentTest, onSelectTest, onGoHome }) => {
    const [recommendation, setRecommendation] = useState(null);
    const [completedCount, setCompletedCount] = useState(0);

    useEffect(() => {
        const loadRecommendation = async () => {
            const rec = await resultService.getRecommendedTest();
            const completed = await resultService.getCompletedTests();
            setCompletedCount(completed.length);

            if (rec && rec.testType !== currentTest) {
                setRecommendation(rec);
            } else {
                const incomplete = await resultService.getIncompleteTests();
                const other = incomplete.find(t => t !== currentTest);
                if (other) {
                    setRecommendation({ testType: other, reason: 'new' });
                }
            }
        };
        loadRecommendation();
    }, [currentTest]);

    if (!recommendation) return null;

    const config = SUBJECT_CONFIG[recommendation.testType];
    const data = CHEMI_DATA[recommendation.testType];

    if (!config || !data) return null;

    const IconComponent = Icons[config.icon];

    return (
        <div className="mt-8 p-1 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-2xl border border-white/60 shadow-sm backdrop-blur-md">
            <div className="bg-white/60 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-bold text-indigo-600 flex items-center gap-1.5">
                        <Sparkles className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        {recommendation.reason === 'retest' ? '다시 해볼까요?' : '다음 추천 테스트'}
                    </span>
                    <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                        {completedCount}개 완료
                    </span>
                </div>

                <button
                    onClick={() => onSelectTest(recommendation.testType)}
                    className="w-full flex items-center gap-4 text-left group"
                >
                    {IconComponent && (
                        <div className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform duration-300">
                            <IconComponent mood="happy" className="w-10 h-10" />
                        </div>
                    )}
                    <div className="flex-1">
                        <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-lg">{data.title}</h4>
                        <p className="text-xs text-slate-500 line-clamp-1">{data.subtitle}</p>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                        <ArrowRight className="w-4 h-4" />
                    </div>
                </button>
            </div>

            <button
                onClick={onGoHome}
                className="w-full mt-2 py-3 text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors"
            >
                <HomeIcon className="w-3 h-3" />
                대시보드로 돌아가기
            </button>
        </div>
    );
};

export default function Home() {
    const [view, setView] = useState('dashboard');
    const [mode, setMode] = useState('human');
    const [step, setStep] = useState('intro');
    const [qIdx, setQIdx] = useState(0);
    const [scores, setScores] = useState({});
    const [finalResult, setFinalResult] = useState(null);
    const [detailTab, setDetailTab] = useState("interpretation");
    const [isDeepMode, setIsDeepMode] = useState(false);
    const [showGraphPopup, setShowGraphPopup] = useState(false);
    const [answers, setAnswers] = useState([]);
    const [showInsight, setShowInsight] = useState(false);

    // Ensure data exists
    useEffect(() => {
        if (!CHEMI_DATA[mode]) {
            setMode('human');
        }
    }, [mode]);

    const currentModeData = CHEMI_DATA[mode] || CHEMI_DATA.human;
    const dimensions = currentModeData.dimensions;
    const basicQuestions = currentModeData.questions || [];
    const deepQuestions = currentModeData.questions_deep || [];
    const questions = isDeepMode ? [...basicQuestions, ...deepQuestions] : basicQuestions;
    const maxQuestions = questions.length;

    const displayQuestionNum = qIdx + 1;
    const displayTotalQuestions = questions.length;

    const getInitialScores = useCallback(() => {
        const initial = {};
        Object.keys(dimensions).forEach(dim => initial[dim] = 0);
        return initial;
    }, [dimensions]);

    useEffect(() => {
        setScores(getInitialScores());
    }, [mode, getInitialScores]);

    const subjectConfig = SUBJECT_CONFIG[mode] || {};

    const handleStartTest = (testType) => {
        setMode(testType);
        setStep('intro');
        setQIdx(0);
        setScores(getInitialScores());
        setAnswers([]);
        setIsDeepMode(false);
        setFinalResult(null);
        setView('test');
    };

    const handleAnswer = (dimension, scoreVal) => {
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
    };

    const calculateResult = (finalScores) => {
        setStep("loading");
        setTimeout(async () => {
            const dimCounts = {};
            questions.forEach(q => {
                dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
            });

            const result = matchResultLabel(finalScores, dimensions, currentModeData.resultLabels, dimCounts);
            setFinalResult(result);
            setStep("result");
            setDetailTab("interpretation");

            if (resultService && result) {
                try {
                    await resultService.saveResult(mode, result, finalScores, isDeepMode);
                } catch (error) {
                    console.error('Save failed:', error);
                }
            }
        }, 2000); // 2s loading
    };

    const restart = (newMode = mode) => {
        setMode(newMode);
        setStep("intro");
        setQIdx(0);
        setScores(getInitialScores());
        setFinalResult(null);
        setIsDeepMode(false);
        setShowGraphPopup(false);
        setAnswers([]);
    };

    const startDeepTest = () => {
        const deepStartIndex = basicQuestions.length;
        setQIdx(deepStartIndex);
        setIsDeepMode(true);
        setStep("question");
    };

    const getScorePercentage = (dimension) => {
        const questionsForDim = questions.filter(q => q.dimension === dimension);
        const maxPossible = questionsForDim.length * MAX_SCORE_PER_QUESTION;
        const score = scores[dimension] || 0;
        return maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
    };

    const IconComponent = Icons[subjectConfig.icon] || HumanIcon;

    return (
        <main className="min-h-screen bg-[#F0F2F5] flex items-center justify-center p-4">
            {view === 'dashboard' ? (
                <Dashboard onStartTest={handleStartTest} />
            ) : (
                <div className="glass-card rounded-[2.5rem] overflow-hidden flex flex-col relative transition-all duration-500 w-full h-full max-w-md min-h-[750px] shadow-2xl border border-white/50">
                    {/* Aurora Background Mesh */}
                    <div className="absolute top-[-20%] left-[-20%] w-[150%] h-[150%] bg-gradient-to-br from-indigo-100/40 via-purple-100/40 to-pink-100/40 blur-3xl -z-10 animate-pulse-slow"></div>

                    {/* --- INTRO VIEW --- */}
                    {step === "intro" && (
                        <div className="flex flex-col h-full animate-fade-in px-8 py-10">
                            <div className="flex justify-between items-center mb-4">
                                <button onClick={() => setView('dashboard')} className="p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-800 transition-colors">
                                    <ChevronLeft className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="flex-1 flex flex-col items-center justify-center -mt-8">
                                {/* Social Proof Badge */}
                                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/40 border border-white/60 text-slate-600 text-[11px] font-bold backdrop-blur-md mb-8 shadow-sm">
                                    <div className="relative flex h-2 w-2">
                                        <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
                                        <div className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></div>
                                    </div>
                                    <span className="tracking-wide">1,248명 참여 중</span>
                                </div>

                                {/* Main Icon */}
                                <IconComponent mood="happy" className="w-40 h-40 mb-8 drop-shadow-2xl animate-bounce-slight" />

                                {/* Title */}
                                <h1 className="text-4xl font-black text-slate-800 mb-3 text-center leading-tight tracking-tight">
                                    {currentModeData.title}
                                </h1>
                                <p className="text-slate-500 text-base font-medium text-center mb-8 max-w-[260px] leading-relaxed">
                                    {currentModeData.subtitle}
                                </p>

                                {/* Features List */}
                                <div className="w-full bg-white/40 backdrop-blur-sm rounded-2xl p-5 border border-white/40 shadow-sm space-y-3 mb-8">
                                    {(subjectConfig.intro || []).map((text, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                                            <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                                                <Check className="w-3 h-3" />
                                            </div>
                                            {text}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-auto space-y-4">
                                <p className="text-center text-xs text-slate-400 font-medium">⏱️ 소요 시간: 약 3분</p>
                                <GlassButton onClick={() => setStep("question")} variant="primary">
                                    테스트 시작하기 <ArrowRight className="w-5 h-5" />
                                </GlassButton>
                                <button onClick={() => setShowInsight(true)} className="w-full py-3 text-slate-500 text-sm font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5">
                                    <Trophy className="w-4 h-4" /> 전체 결과 랭킹 보기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- QUESTION VIEW --- */}
                    {step === "question" && (
                        <div className="flex flex-col h-full animate-fade-in px-6 py-8">
                            {/* Header */}
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

                            {/* Progress */}
                            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-12 overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                                    style={{ width: `${((displayQuestionNum) / displayTotalQuestions) * 100}%` }}
                                ></div>
                            </div>

                            {/* Question */}
                            <div className="flex-1 flex flex-col items-center justify-center -mt-10">
                                <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-50 text-indigo-600 text-sm font-black mb-6">
                                    Q{displayQuestionNum}
                                </span>
                                <h2 className="text-3xl font-black text-slate-800 text-center leading-snug break-keep drop-shadow-sm">
                                    {questions[qIdx]?.q}
                                </h2>
                            </div>

                            {/* Answers */}
                            <div className="space-y-3 mt-auto mb-8">
                                {questions[qIdx]?.a.map((ans, idx) => (
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

                    {/* --- LOADING VIEW --- */}
                    {step === "loading" && (
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
                    {step === "result" && finalResult && (
                        <div className={`flex flex-col h-full animate-fade-in relative`}>
                            {/* Fixed Header */}
                            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 bg-gradient-to-b from-white/80 to-transparent">
                                <button onClick={() => setView('dashboard')} className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white">
                                    <HomeIcon className="w-5 h-5 text-slate-600" />
                                </button>
                                <button className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white text-indigo-600">
                                    <Share2 className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Scrollable Content */}
                            <div className="flex-1 overflow-y-auto no-scrollbar pt-20 px-6 pb-24">
                                {/* Result Card Content */}
                                <div className="flex flex-col items-center text-center">
                                    <div className="text-6xl mb-4 drop-shadow-md animate-pop">{finalResult.emoji}</div>
                                    <h1 className="text-3xl font-black text-slate-800 mb-2 leading-tight">
                                        {finalResult.name}
                                    </h1>
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mb-8 ${'bg-indigo-400'}`}>
                                        {finalResult.mood || 'RARE'} TYPE
                                    </span>

                                    <div className="relative mb-10 w-full flex justify-center">
                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 to-pink-200/50 blur-3xl rounded-full scale-125"></div>
                                        <IconComponent mood={finalResult.mood || "happy"} className="w-48 h-48 relative z-10 drop-shadow-2xl" />
                                    </div>

                                    {/* Quote Box */}
                                    <div className="w-full bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/50 shadow-sm mb-6">
                                        <p className="text-slate-800 font-bold text-lg leading-relaxed break-keep">
                                            "{finalResult.desc}"
                                        </p>
                                    </div>

                                    {/* Deep Mode CTA */}
                                    {isDeepMode && (
                                        <GlassButton onClick={() => setShowGraphPopup(true)} variant="secondary" className="mb-8">
                                            <BarChart2 className="w-5 h-5 text-indigo-500" /> 상세 성향 그래프 보기
                                        </GlassButton>
                                    )}

                                    {/* Detailed Content Tabs/List */}
                                    <div className="w-full space-y-4 text-left">
                                        {subjectConfig.resultFormat === 'matching' ? (
                                            <>
                                                <div className="bg-white/60 rounded-2xl p-5 border border-white/50">
                                                    <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                                                        <Sparkles className="w-4 h-4 text-pink-500" />
                                                        {subjectConfig.matchPointsTitle || "이런 점이 잘 맞아요"}
                                                    </h3>
                                                    <ul className="space-y-2.5">
                                                        {(finalResult.matchPoints || []).map((point, idx) => (
                                                            <li key={idx} className="flex items-start gap-2.5 text-sm font-medium text-slate-600 leading-relaxed">
                                                                <Check className="w-4 h-4 text-pink-500 flex-shrink-0 mt-0.5" />
                                                                {point}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                <div className="bg-white/60 rounded-2xl p-1 border border-white/50 flex p-1">
                                                    {['interpretation', 'guide'].map((tab) => (
                                                        <button
                                                            key={tab}
                                                            onClick={() => setDetailTab(tab)}
                                                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${detailTab === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
                                                        >
                                                            {tab === 'interpretation' ? '💡 해석' : '🔮 조언'}
                                                        </button>
                                                    ))}
                                                </div>
                                                <div className="bg-white/60 rounded-2xl p-5 border border-white/50 mt-2 min-h-[100px]">
                                                    <p className="text-slate-700 text-sm leading-relaxed">
                                                        {detailTab === "interpretation" ? finalResult.interpretation : finalResult.guide}
                                                    </p>
                                                </div>
                                            </>
                                        ) : (
                                            <div className="bg-white/60 rounded-2xl p-6 border border-white/50">
                                                <h3 className="font-bold text-slate-800 mb-2">💡 상세 분석</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed mb-4">{finalResult.interpretation}</p>
                                                <h3 className="font-bold text-slate-800 mb-2">🍀 팁</h3>
                                                <p className="text-slate-600 text-sm leading-relaxed">{finalResult.guide}</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Upgrade to Deep Mode */}
                                    {!isDeepMode && deepQuestions.length > 0 && (
                                        <button
                                            onClick={startDeepTest}
                                            className="w-full mt-8 py-4 rounded-xl relative overflow-hidden group shadow-lg"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 transition-transform group-hover:scale-105 duration-500"></div>
                                            <div className="relative flex items-center justify-center gap-2 text-white font-bold">
                                                <Sparkles className="w-5 h-5 animate-pulse" />
                                                더 소름돋는 결과 보기 (+{deepQuestions.length}문항)
                                            </div>
                                        </button>
                                    )}

                                    {/* Recommendations */}
                                    <NextTestRecommendation currentTest={mode} onSelectTest={handleStartTest} onGoHome={() => setView('dashboard')} />
                                </div>
                            </div>

                            {/* Floating Restart Button */}
                            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
                                <button
                                    onClick={() => restart()}
                                    className="px-5 py-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-lg border border-white/50 text-slate-600 text-sm font-bold hover:bg-white hover:text-indigo-600 transition-all flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" /> 처음으로
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- GRAPH POPUP --- */}
                    {showGraphPopup && (
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
                                                        <span className="text-lg">{dim.emoji}</span> {dim.name}
                                                    </span>
                                                    <span className="font-bold text-indigo-600 text-sm">{percentage}%</span>
                                                </div>
                                                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                                                    <div className={`h-full rounded-full ${colorClass} transition-all duration-1000 ease-out`} style={{ width: `${percentage}%` }}></div>
                                                </div>
                                                <p className="text-xs text-slate-400 mt-1.5 line-clamp-1">{dim.desc}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                                <button onClick={() => setShowGraphPopup(false)} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800">
                                    <X className="w-6 h-6" />
                                </button>
                                <button onClick={() => setShowGraphPopup(false)} className="w-full mt-8 py-3.5 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                                    닫기
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- INSIGHT VIEW --- */}
                    {showInsight && (
                        <InsightView
                            onClose={() => setShowInsight(false)}
                            onSelectTest={(testType) => {
                                setShowInsight(false);
                                handleStartTest(testType);
                            }}
                        />
                    )}
                </div>
            )}
        </main>
    );
}
