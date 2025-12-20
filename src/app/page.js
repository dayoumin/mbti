'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { CHEMI_DATA } from '../data/index';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_CONSTANTS } from '../data/constants';
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
import BottomNav from '../components/BottomNav';
import Sidebar from '../components/Sidebar';
import { TabletSlidePanel } from '../components/responsive';
import FriendInvite from '../components/FriendInvite';
import FriendCompare from '../components/FriendCompare';
import BadgeNotification from '../components/BadgeNotification';
import ParticipationStats from '../components/ParticipationStats';
import { nextActionService } from '../services/NextActionService';
import { getGamificationService } from '../services/GamificationService';
import { NextActionInline } from '../components/NextActionCard';
import CommunityBoard from '../components/CommunityBoard';
import * as Icons from '../components/Icons';
import {
    ChevronLeft, Share2, RefreshCw, BarChart2,
    Check, X, Sparkles, Home as HomeIcon, Trophy, ArrowRight, Users, MessageSquare,
    MapPin, Clock, Scale, Heart, AlertTriangle, Zap, Scissors, Dog, Cat, Fish, Bird, Bug, DollarSign, Lightbulb, ChevronDown, ChevronUp
} from 'lucide-react';

// Icons extraction for Result Characters (Keep custom SVGs for character art)
const { Capsule, HumanIcon } = Icons;

const MAX_SCORE_PER_QUESTION = CHEMI_CONSTANTS.MAX_SCORE_PER_QUESTION;

// --- Components ---

// Breed/Type Detail Info Utilities (재사용 가능)
const DETAIL_LABELS = {
    needsLevel: { low: '낮음', medium: '보통', high: '높음' },
    difficulty: { easy: '쉬움', medium: '보통', hard: '어려움' },
};

const DETAIL_COLORS = {
    needsLevel: { low: 'text-green-600 bg-green-50', medium: 'text-amber-600 bg-amber-50', high: 'text-rose-600 bg-rose-50' },
    difficulty: { easy: 'text-green-600 bg-green-50', medium: 'text-amber-600 bg-amber-50', hard: 'text-rose-600 bg-rose-50' },
};

// Breed Detail Info Card Component
// title: 표시할 제목 (기본: "상세 정보")
// icon: 아이콘 컴포넌트 (기본: null, 아이콘 없음)
const BreedDetailCard = ({ detailInfo, title = "상세 정보", icon: IconComponent = null }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!detailInfo) return null;

    const needsLevelLabel = (level) => DETAIL_LABELS.needsLevel[level] || level;
    const difficultyLabel = (level) => DETAIL_LABELS.difficulty[level] || level;
    const needsLevelColor = (level) => DETAIL_COLORS.needsLevel[level] || 'text-slate-600 bg-slate-50';
    const difficultyColor = (level) => DETAIL_COLORS.difficulty[level] || 'text-slate-600 bg-slate-50';

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
                            <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg">
                                <MapPin className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-400">원산지</p>
                                    <p className="text-xs font-semibold text-slate-700">{detailInfo.origin}</p>
                                </div>
                            </div>
                        )}
                        {detailInfo.lifespan && (
                            <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg">
                                <Clock className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-400">평균 수명</p>
                                    <p className="text-xs font-semibold text-slate-700">{detailInfo.lifespan}</p>
                                </div>
                            </div>
                        )}
                        {detailInfo.size && (
                            <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg">
                                <Scale className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-400">크기</p>
                                    <p className="text-xs font-semibold text-slate-700">{detailInfo.size}</p>
                                </div>
                            </div>
                        )}
                        {detailInfo.weight && (
                            <div className="flex items-center gap-2 p-2 bg-white/70 rounded-lg">
                                <Scale className="w-4 h-4 text-slate-400" />
                                <div>
                                    <p className="text-[10px] text-slate-400">체중</p>
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
                                    <span key={idx} className="px-2 py-1 bg-pink-50 text-pink-700 text-[11px] font-medium rounded-full">
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
                                <h4 className="text-[10px] font-bold text-green-700 mb-1.5 flex items-center gap-1">
                                    <Check className="w-3 h-3" /> 잘 맞는 환경
                                </h4>
                                <div className="space-y-0.5">
                                    {detailInfo.goodWith.map((item, idx) => (
                                        <p key={idx} className="text-[11px] text-green-800">{item}</p>
                                    ))}
                                </div>
                            </div>
                        )}
                        {detailInfo.notGoodWith && detailInfo.notGoodWith.length > 0 && (
                            <div className="p-2.5 bg-rose-50/80 rounded-lg">
                                <h4 className="text-[10px] font-bold text-rose-700 mb-1.5 flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3" /> 주의 사항
                                </h4>
                                <div className="space-y-0.5">
                                    {detailInfo.notGoodWith.map((item, idx) => (
                                        <p key={idx} className="text-[11px] text-rose-800">{item}</p>
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
                                <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                        <Zap className="w-3 h-3" /> 운동량
                                    </span>
                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${needsLevelColor(detailInfo.exerciseNeeds)}`}>
                                        {needsLevelLabel(detailInfo.exerciseNeeds)}
                                    </span>
                                </div>
                            )}
                            {detailInfo.groomingNeeds && (
                                <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                                        <Scissors className="w-3 h-3" /> 미용관리
                                    </span>
                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${needsLevelColor(detailInfo.groomingNeeds)}`}>
                                        {needsLevelLabel(detailInfo.groomingNeeds)}
                                    </span>
                                </div>
                            )}
                            {detailInfo.sheddingLevel && (
                                <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                                    <span className="text-[11px] text-slate-500">털빠짐</span>
                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${needsLevelColor(detailInfo.sheddingLevel)}`}>
                                        {needsLevelLabel(detailInfo.sheddingLevel)}
                                    </span>
                                </div>
                            )}
                            {detailInfo.trainingDifficulty && (
                                <div className="flex items-center justify-between p-2 bg-white/70 rounded-lg">
                                    <span className="text-[11px] text-slate-500">훈련난이도</span>
                                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${difficultyColor(detailInfo.trainingDifficulty)}`}>
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
                                    <span key={idx} className="px-2 py-1 bg-amber-50 text-amber-700 text-[11px] rounded-full">
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
                                    <div className="p-2.5 bg-white/70 rounded-lg">
                                        <p className="text-[10px] text-slate-400 mb-0.5">초기 비용</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {detailInfo.initialCost.min}~{detailInfo.initialCost.max}만원
                                        </p>
                                        {detailInfo.initialCost.note && (
                                            <p className="text-[10px] text-slate-400 mt-0.5">{detailInfo.initialCost.note}</p>
                                        )}
                                    </div>
                                )}
                                {detailInfo.monthlyCost && (
                                    <div className="p-2.5 bg-white/70 rounded-lg">
                                        <p className="text-[10px] text-slate-400 mb-0.5">월 비용</p>
                                        <p className="text-sm font-bold text-slate-700">
                                            {detailInfo.monthlyCost.min}~{detailInfo.monthlyCost.max}만원
                                        </p>
                                        {detailInfo.monthlyCost.note && (
                                            <p className="text-[10px] text-slate-400 mt-0.5">{detailInfo.monthlyCost.note}</p>
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
                                        <p className="text-[11px] text-slate-700 leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

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

// Content Actions - 퀴즈/투표 다음 액션 추천
const ContentActions = ({ testType, onQuizClick, onPollClick }) => {
    const actions = nextActionService.getRecommendations({
        endpoint: 'test_result',
        contentId: testType,
    });

    // test 타입 제외하고 quiz, poll만 필터링
    const contentActions = actions.filter(a => a.type === 'quiz' || a.type === 'poll').slice(0, 2);

    if (contentActions.length === 0) return null;

    const handleActionClick = (action) => {
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
};

// Next Test Recommendation Card - Compact (개인화 추천 사용)
const NextTestRecommendation = ({ currentTest, onSelectTest, onGoHome }) => {
    const [recommendation, setRecommendation] = useState(null);
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
                    testType: personalizedAction.targetId,
                    reason: incomplete.includes(personalizedAction.targetId) ? 'new' : 'retest',
                    label: personalizedAction.label,
                    description: personalizedAction.description,
                });
            } else {
                // 폴백: 기존 로직
                const rec = await resultService.getRecommendedTest();
                if (rec && rec.testType !== currentTest) {
                    setRecommendation(rec);
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

    // 개인화 추천 메시지 결정
    const getRecommendationMessage = () => {
        if (recommendation.reason === 'retest') return '다시 해볼까요?';
        if (recommendation.description) return recommendation.description;
        if (incompleteCount > 0) return `${incompleteCount}개 테스트가 남았어요`;
        return '다음 추천';
    };

    return (
        <div className="mt-5 w-full">
            <div className="p-0.5 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-xl border border-white/60">
                <div className="bg-white/70 rounded-[10px] p-3">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-indigo-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            {recommendation.label || (recommendation.reason === 'retest' ? '다시 해볼까요?' : '다음 추천')}
                        </span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full">
                            {completedCount}/{completedCount + incompleteCount} 완료
                        </span>
                    </div>

                    <button
                        onClick={() => onSelectTest(recommendation.testType)}
                        className="w-full flex items-center gap-3 text-left group"
                    >
                        {IconComponent && (
                            <div className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm border border-slate-100 group-hover:scale-110 transition-transform">
                                <IconComponent mood="happy" className="w-7 h-7" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors text-sm truncate">{data.title}</h4>
                            <p className="text-[10px] text-slate-400 truncate">
                                {recommendation.reason === 'new' ? '아직 안 해본 테스트예요!' : data.subtitle}
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
                className="w-full mt-2 py-2 text-[10px] font-bold text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1 transition-colors"
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
    const [showRanking, setShowRanking] = useState(false);
    const [showShareCard, setShowShareCard] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [showContentExplore, setShowContentExplore] = useState(false);
    const [tabletContentTab, setTabletContentTab] = useState(null); // 태블릿 띠지 탭 상태
    const [parentInfo, setParentInfo] = useState(null); // petMatch → 세부 테스트 연결용
    const [activeNavTab, setActiveNavTab] = useState('home'); // 하단 내비게이션 상태
    const [badgeQueue, setBadgeQueue] = useState([]); // 배지 알림 큐 (여러 배지 순차 표시)
    const [showFriendCompare, setShowFriendCompare] = useState(false); // 친구 비교 모달
    const [showCommunity, setShowCommunity] = useState(false); // 커뮤니티 게시판

    // Ensure mode is valid - use useMemo to derive safe mode
    const safeMode = CHEMI_DATA[mode] ? mode : 'human';

    const currentModeData = CHEMI_DATA[safeMode];
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

    // Reset scores when mode changes via handleStartTest, not useEffect
    // The scores are reset in handleStartTest function using getInitialScores()

    const subjectConfig = SUBJECT_CONFIG[mode] || {};

    const handleStartTest = (testType, fromParent = null) => {
        setMode(testType);
        setStep('intro');
        setQIdx(0);
        setScores(getInitialScores());
        setAnswers([]);
        setIsDeepMode(false);
        setFinalResult(null);
        setParentInfo(fromParent); // { testType: 'petMatch', resultName: '강아지' }
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
        setActiveNavTab('home');
    };

    // 하단 내비게이션 탭 변경 핸들러
    const handleNavTabChange = (tab) => {
        setActiveNavTab(tab);
        if (tab === 'home') {
            setView('dashboard');
            setShowProfile(false);
            setShowContentExplore(false);
            setShowRanking(false);
            setShowCommunity(false);
        } else if (tab === 'explore') {
            setView('dashboard');
            setShowContentExplore(true);
            setShowProfile(false);
            setShowRanking(false);
            setShowCommunity(false);
        } else if (tab === 'talk') {
            setView('dashboard');
            setShowCommunity(true);
            setShowProfile(false);
            setShowContentExplore(false);
            setShowRanking(false);
        } else if (tab === 'ranking') {
            setView('dashboard');
            setShowRanking(true);
            setShowProfile(false);
            setShowContentExplore(false);
            setShowCommunity(false);
        } else if (tab === 'profile') {
            setView('dashboard');
            setShowProfile(true);
            setShowContentExplore(false);
            setShowRanking(false);
        }
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
                    await resultService.saveResult(mode, result, finalScores, isDeepMode, parentInfo);

                    // 게이미피케이션 기록
                    const gamification = getGamificationService();
                    if (gamification) {
                        const { newBadges } = gamification.recordTestComplete(mode);
                        if (newBadges.length > 0) {
                            setBadgeQueue(prev => [...prev, ...newBadges]); // 기존 큐에 추가
                        }
                    }
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

    // 차원별 최대 점수 계산 (ShareCard에 전달)
    const getMaxScores = () => {
        const maxScores = {};
        Object.keys(dimensions).forEach(dim => {
            const questionsForDim = questions.filter(q => q.dimension === dim);
            maxScores[dim] = questionsForDim.length * MAX_SCORE_PER_QUESTION;
        });
        return maxScores;
    };

    const IconComponent = Icons[subjectConfig.icon] || HumanIcon;

    return (
        <div className="min-h-screen bg-[#F0F2F5] flex">
            {/* 전역 모달들 - 사이드바 포함 전체 화면에 오버레이 */}
            {showProfile && (
                <FullProfile
                    onClose={() => {
                        setShowProfile(false);
                        setActiveNavTab('home');
                    }}
                    onStartTest={(testKey) => {
                        setShowProfile(false);
                        setActiveNavTab('home');
                        handleStartTest(testKey);
                    }}
                />
            )}

            {showContentExplore && (
                <ContentExplore
                    onClose={() => {
                        setShowContentExplore(false);
                        setActiveNavTab('home');
                    }}
                    onStartTest={(testKey) => {
                        setShowContentExplore(false);
                        setActiveNavTab('home');
                        handleStartTest(testKey);
                    }}
                />
            )}

            {showCommunity && (
                <div className="fixed inset-0 z-50 bg-[#F0F2F5] lg:left-64 lg:right-0">
                    <CommunityBoard className="h-full" />
                </div>
            )}

            {view === 'dashboard' && showRanking && (
                <RankingTab
                    onClose={() => {
                        setShowRanking(false);
                        setActiveNavTab('home');
                    }}
                    onStartTest={(testKey) => {
                        setShowRanking(false);
                        setActiveNavTab('home');
                        handleStartTest(testKey || mode);
                    }}
                />
            )}

            {/* 배지 획득 알림 (큐에서 순차 표시) */}
            {badgeQueue.length > 0 && (
                <BadgeNotification
                    badgeId={badgeQueue[0]}
                    onClose={() => setBadgeQueue(prev => prev.slice(1))}
                />
            )}

            {/* PC 사이드바 */}
            {view === 'dashboard' && (
                <Sidebar
                    activeTab={activeNavTab}
                    onTabChange={handleNavTabChange}
                    onStartTest={(testKey) => {
                        setActiveNavTab('home');
                        handleStartTest(testKey);
                    }}
                    onContentExplore={() => {
                        setShowContentExplore(true);
                        setActiveNavTab('explore');
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
                        setShowContentExplore(true);
                        setActiveNavTab('explore');
                    }}
                />
            )}

            <main className="flex-1 min-h-screen flex items-center justify-center p-4 pb-20 lg:pb-4">
                {view === 'dashboard' ? (
                    <Dashboard
                        onStartTest={(testKey) => {
                            setActiveNavTab('home');
                            handleStartTest(testKey);
                        }}
                        onContentExplore={() => {
                            setShowContentExplore(true);
                            setActiveNavTab('explore');
                        }}
                    />
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
                                    {/* Social Proof - Enhanced */}
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

                                    {/* Main Icon */}
                                    <IconComponent mood="happy" className="w-36 h-36 mb-6 drop-shadow-2xl animate-bounce-slight" />

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

                                <div className="mt-auto space-y-3">
                                    {/* Primary CTA - Enhanced */}
                                    <button
                                        onClick={() => setStep("question")}
                                        className="w-full py-5 rounded-2xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center gap-2 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-0.5 active:scale-[0.98]"
                                    >
                                        테스트 시작하기 <ArrowRight className="w-5 h-5" />
                                    </button>

                                    {/* petMatch 전용: 직접 선택 모드 */}
                                    {mode === 'petMatch' && (
                                        <button
                                            onClick={() => setStep("directSelect")}
                                            className="w-full py-3.5 rounded-xl bg-white/60 hover:bg-white border border-white/60 text-slate-600 font-bold flex items-center justify-center gap-2 transition-all hover:shadow-md"
                                        >
                                            <Check className="w-4 h-4 text-amber-500" />
                                            이미 원하는 동물이 있어요
                                        </button>
                                    )}

                                    <button onClick={() => setShowRanking(true)} className="w-full py-3 text-slate-500 text-sm font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5">
                                        <Trophy className="w-4 h-4" /> 어떤 결과가 나올까? 미리보기
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

                                {/* Progress - Enhanced */}
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

                                {/* Question */}
                                <div className="flex-1 flex flex-col items-center justify-center -mt-6">
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

                        {/* --- DIRECT SELECT VIEW (petMatch 전용) --- */}
                        {step === "directSelect" && mode === 'petMatch' && (
                            <div className="flex flex-col h-full animate-fade-in px-6 py-8">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <button onClick={() => setStep("intro")} className="p-2 rounded-full hover:bg-white/50 text-slate-400 hover:text-slate-800 transition-colors">
                                        <ChevronLeft className="w-6 h-6" />
                                    </button>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        직접 선택
                                    </span>
                                    <div className="w-10" /> {/* spacer */}
                                </div>

                                {/* Title */}
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">
                                        어떤 반려동물을 원하세요?
                                    </h2>
                                    <p className="text-sm text-slate-500">
                                        해당 동물의 품종/종류 테스트로 바로 이동해요
                                    </p>
                                </div>

                                {/* Pet Options */}
                                <div className="flex-1 space-y-3 overflow-y-auto">
                                    {currentModeData.resultLabels.map((result) => {
                                        const nextTest = result.nextTest;
                                        const nextData = nextTest ? CHEMI_DATA[nextTest] : null;
                                        const nextConfig = nextTest ? SUBJECT_CONFIG[nextTest] : null;
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

                                {/* Footer */}
                                <div className="mt-6 pt-4 border-t border-slate-100">
                                    <button
                                        onClick={() => setStep("question")}
                                        className="w-full py-3 text-slate-500 text-sm font-bold hover:text-indigo-600 transition-colors flex items-center justify-center gap-1.5"
                                    >
                                        <Sparkles className="w-4 h-4" />
                                        잘 모르겠어요, 추천받을래요
                                    </button>
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
                                <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-gradient-to-b from-white/90 to-transparent">
                                    <button onClick={() => setView('dashboard')} className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white">
                                        <HomeIcon className="w-5 h-5 text-slate-600" />
                                    </button>
                                    <button
                                        onClick={() => setShowShareCard(true)}
                                        className="p-2 rounded-full bg-white/50 backdrop-blur-sm shadow-sm hover:bg-white text-indigo-600"
                                    >
                                        <Share2 className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="flex-1 overflow-y-auto no-scrollbar pt-14 px-5 pb-20">
                                    {/* Result Card Content - Compact */}
                                    <div className="flex flex-col items-center text-center">
                                        {/* HERO: 결과 카드 - 매칭 테스트일 때 더 강조 */}
                                        {subjectConfig.resultFormat === 'matching' ? (
                                            // 매칭 결과: 카드 스타일로 크게 표시
                                            <div className="w-full mb-4">
                                                <div className="relative bg-gradient-to-br from-white to-slate-50 rounded-2xl p-5 border-2 border-indigo-100 shadow-lg overflow-hidden">
                                                    {/* 배경 장식 */}
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-100/50 to-pink-100/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                                                    {/* 상단 라벨 */}
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-xs font-bold text-slate-400">{currentModeData.title} 결과</span>
                                                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-500">
                                                            MATCH
                                                        </span>
                                                    </div>

                                                    {/* 메인 결과 */}
                                                    <div className="flex items-center gap-4">
                                                        <div className="relative flex-shrink-0">
                                                            <IconComponent mood={finalResult.mood || "happy"} className="w-20 h-20 drop-shadow-lg" />
                                                        </div>
                                                        <div className="flex-1 text-left">
                                                            <div className="text-3xl mb-1">{finalResult.emoji}</div>
                                                            <h1 className="text-xl font-black text-slate-800 leading-tight">
                                                                {finalResult.name}
                                                            </h1>
                                                        </div>
                                                    </div>

                                                    {/* 한줄 설명 */}
                                                    <p className="mt-3 text-sm font-medium text-slate-600 leading-relaxed break-keep border-t border-slate-100 pt-3">
                                                        &quot;{finalResult.desc}&quot;
                                                    </p>
                                                </div>
                                            </div>
                                        ) : (
                                            // 성격 테스트: 기존 컴팩트 스타일
                                            <>
                                                <div className="flex items-center gap-4 mb-4 w-full">
                                                    <div className="relative flex-shrink-0">
                                                        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-200/50 to-pink-200/50 blur-2xl rounded-full scale-150"></div>
                                                        <IconComponent mood={finalResult.mood || "happy"} className="w-24 h-24 relative z-10 drop-shadow-xl" />
                                                    </div>
                                                    <div className="flex-1 text-left">
                                                        <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white mb-1 bg-indigo-400`}>
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

                                        {/* Deep Mode CTA - Inline */}
                                        {isDeepMode && (
                                            <button onClick={() => setShowGraphPopup(true)} className="w-full mb-4 py-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-bold flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">
                                                <BarChart2 className="w-4 h-4" /> 상세 성향 그래프
                                            </button>
                                        )}

                                        {/* Detailed Content - Compact */}
                                        <div className="w-full space-y-3 text-left">
                                            {subjectConfig.resultFormat === 'matching' ? (
                                                <>
                                                    {/* 해석/조언 탭 먼저 (핵심 정보) */}
                                                    <div className="bg-white/60 rounded-xl p-1 border border-white/50 flex">
                                                        {['interpretation', 'guide'].map((tab) => (
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
                                                            {detailTab === "interpretation" ? finalResult.interpretation : finalResult.guide}
                                                        </p>
                                                    </div>

                                                    {/* Match Points - 보조 정보로 축소 */}
                                                    {(finalResult.matchPoints || []).length > 0 && (
                                                        <div className="bg-slate-50/80 rounded-xl p-3 border border-slate-100">
                                                            <h3 className="font-bold text-slate-500 mb-2 flex items-center gap-1.5 text-xs">
                                                                <Check className="w-3 h-3 text-green-500" />
                                                                {subjectConfig.matchPointsTitle || "추천 포인트"}
                                                            </h3>
                                                            <div className="flex flex-wrap gap-1">
                                                                {(finalResult.matchPoints || []).map((point, idx) => (
                                                                    <span key={idx} className="px-2 py-0.5 bg-white text-slate-600 text-[11px] rounded-full border border-slate-200">
                                                                        {point}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* FunFacts - 바이럴 콘텐츠 (petMatch, plant) */}
                                                    {finalResult.meta?.funFacts && (
                                                        <FunFactsCard
                                                            funFacts={finalResult.meta.funFacts}
                                                            resultName={finalResult.name}
                                                            resultEmoji={finalResult.emoji}
                                                        />
                                                    )}

                                                    {/* 품종/종류 상세 정보 - 세부 테스트 결과에서만 표시 */}
                                                    {finalResult.detailInfo && (() => {
                                                        // 테스트 타입별 제목과 아이콘 설정
                                                        const detailConfig = {
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

                                                    {/* nextTest CTA - 세부 테스트 연결 */}
                                                    {finalResult.nextTest && CHEMI_DATA[finalResult.nextTest] && (
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
                                                                    {CHEMI_DATA[finalResult.nextTest].resultLabels?.length || 0}개 {finalResult.name === '강아지' || finalResult.name === '고양이' ? '품종' : '종류'} 중 나의 베스트 매치를 찾아보세요!
                                                                </p>
                                                                <button
                                                                    onClick={() => handleStartTest(finalResult.nextTest, { testType: mode, resultName: finalResult.name })}
                                                                    className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                                                                >
                                                                    {CHEMI_DATA[finalResult.nextTest].title} 시작하기
                                                                    <ArrowRight className="w-4 h-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </>
                                            ) : (
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
                                            )}
                                        </div>

                                        {/* Upgrade to Deep Mode - Compact */}
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

                                        {/* Share & Compare CTA - 바이럴 최적화 순서 */}
                                        <div className="w-full mt-6 space-y-3">
                                            {/* 1. 결과 카드 저장 - 가장 쉬운 액션 */}
                                            <button
                                                onClick={() => setShowShareCard(true)}
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

                                            {/* 2. 카카오톡 공유 - 한국 최적화 */}
                                            <button
                                                onClick={() => setShowShareCard(true)}
                                                className="w-full py-3.5 rounded-xl bg-[#FEE500] text-[#391B1B] font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                            >
                                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                                    <path d="M12 3C6.48 3 2 6.48 2 10.5c0 2.52 1.67 4.73 4.17 6.02l-.67 3.48 4.08-2.7c.79.13 1.6.2 2.42.2 5.52 0 10-3.48 10-7.5S17.52 3 12 3z" />
                                                </svg>
                                                카카오톡으로 공유하기
                                            </button>

                                            {/* 3. 내 순위 보기 */}
                                            <button
                                                onClick={() => setShowRanking(true)}
                                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.98]"
                                            >
                                                <Trophy className="w-5 h-5" />
                                                내 순위 확인하기
                                            </button>

                                            {/* 4. 친구와 비교하기 */}
                                            <button
                                                onClick={() => setShowFriendCompare(true)}
                                                className="w-full py-3 rounded-xl bg-white/60 hover:bg-white border border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                                            >
                                                <Users className="w-4 h-4" />
                                                친구와 비교하기
                                            </button>
                                            {/* 5. 커뮤니티 자랑하기 - 신규 연동 */}
                                            <button
                                                onClick={() => {
                                                    setActiveNavTab('talk');
                                                    setShowCommunity(true);
                                                }}
                                                className="w-full py-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 font-black text-base flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                                            >
                                                <MessageSquare className="w-5 h-5" />
                                                집사 대화방에서 결과 자랑하기
                                            </button>
                                        </div>

                                        {/* 퀴즈/투표 다음 액션 */}
                                        <ContentActions
                                            testType={mode}
                                            onQuizClick={() => {
                                                setShowContentExplore(true);
                                                setActiveNavTab('explore');
                                            }}
                                            onPollClick={() => {
                                                setShowContentExplore(true);
                                                setActiveNavTab('explore');
                                            }}
                                        />

                                        {/* 친구 초대 */}
                                        <FriendInvite
                                            testType={mode}
                                            testName={currentModeData.title}
                                            className="w-full mt-6"
                                        />

                                        {/* 결과 피드백 */}
                                        <div className="w-full mt-6 space-y-4">
                                            <ResultFeedback testType={mode} resultName={finalResult.name} />
                                            <FeedbackComments testType={mode} resultName={finalResult.name} />
                                        </div>

                                        {/* Recommendations - Compact */}
                                        <NextTestRecommendation currentTest={mode} onSelectTest={handleStartTest} onGoHome={() => setView('dashboard')} />
                                    </div>
                                </div>

                                {/* Floating Restart Button */}
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                                    <button
                                        onClick={() => restart()}
                                        className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md shadow-lg border border-white/50 text-slate-600 text-xs font-bold hover:bg-white hover:text-indigo-600 transition-all flex items-center gap-1.5"
                                    >
                                        <RefreshCw className="w-3.5 h-3.5" /> 처음으로
                                    </button>
                                </div>

                                {/* Share Card Modal */}
                                {showShareCard && finalResult && (
                                    <ShareCard
                                        testTitle={currentModeData.title}
                                        testKey={safeMode}
                                        resultName={finalResult.name}
                                        resultEmoji={finalResult.emoji}
                                        resultDesc={finalResult.desc}
                                        dimensions={dimensions}
                                        scores={scores}
                                        maxScores={getMaxScores()}
                                        onClose={() => setShowShareCard(false)}
                                        onCompare={() => {
                                            setShowShareCard(false);
                                            setShowFriendCompare(true);
                                        }}
                                    />
                                )}

                                {/* Friend Compare Modal */}
                                {showFriendCompare && finalResult && (
                                    <FriendCompare
                                        testType={mode}
                                        testName={currentModeData.title}
                                        myResult={finalResult.name}
                                        myResultEmoji={finalResult.emoji}
                                        myScores={scores}
                                        dimensions={dimensions}
                                        onClose={() => setShowFriendCompare(false)}
                                    />
                                )}
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

                        {/* --- RESULT RANKING VIEW --- */}
                        {showRanking && (
                            <ResultRankingView
                                testType={mode}
                                viewMode={step === 'result' && finalResult ? 'compare' : 'preview'}
                                myResult={step === 'result' ? finalResult : undefined}
                                onClose={() => setShowRanking(false)}
                                onStartTest={step !== 'result' ? () => handleStartTest(mode) : undefined}
                                onRestart={step === 'result' ? () => restart() : undefined}
                                onShare={step === 'result' ? () => {
                                    setShowRanking(false);
                                    setShowShareCard(true);
                                } : undefined}
                            />
                        )}
                    </div>
                )}

                {/* 하단 내비게이션 - 대시보드에서만 표시, 테스트 중에는 숨김 */}
                {view === 'dashboard' && (
                    <BottomNav
                        activeTab={activeNavTab}
                        onTabChange={handleNavTabChange}
                    />
                )}
            </main>
        </div>
    );
}
