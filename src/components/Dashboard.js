import { useMemo, useState, useEffect } from 'react';
import * as Icons from './Icons';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import { gamificationService } from '../services/GamificationService';
import { nextActionService } from '../services/NextActionService';
import { ChevronRight, Flame, Star, Sunrise, Sun, Moon, Sparkles } from 'lucide-react';
import { DETAIL_TEST_KEYS } from '../config/testKeys';
import Footer from './Footer';
import HeroBanner from './HeroBanner';
import DiscoveryFeed from './DiscoveryFeed';
import { RecommendedSection } from './ContentSections';
import TodayRankingPreview from './TodayRankingPreview';
import TodayRankingModal from './TodayRankingModal';
import TestCard from './TestCard';
import { POPULAR_TESTS } from '../data/recommendationPolicy';

// 1차 필터: 테스트 유형 (심리/매칭/관계/라이프)
const TEST_TYPE_TABS = {
    all: { label: '전체', emoji: '✨' },
    personality: { label: '심리', emoji: '🧠' },
    matching: { label: '매칭', emoji: '💫' },
    relationship: { label: '관계', emoji: '💕' },
    lifestyle: { label: '라이프', emoji: '🏠' }
};

// 2차 필터: 주제별 카테고리
const SUBJECT_CATEGORIES = {
    // 심리
    me: { label: '나', emoji: '👤' },
    pet: { label: '반려동물', emoji: '🐾' },
    // 매칭
    drink: { label: '음료', emoji: '🥤' },
    food: { label: '음식', emoji: '🍽️' },
    product: { label: '제품', emoji: '🛍️' },
    // 관계 (바이럴 특화)
    love: { label: '연애', emoji: '💕' },
    social: { label: '소통', emoji: '🗣️' },
    chemistry: { label: '궁합', emoji: '⚡' },
    // 라이프 (제품 연계)
    space: { label: '공간', emoji: '🏠' },
    routine: { label: '루틴', emoji: '⏰' },
    style: { label: '스타일', emoji: '👔' }
};

// 테스트별 주제 카테고리 매핑 (2차 필터용)
const TEST_SUBJECT_MAP = {
    // === 심리 (personality) ===
    human: 'me',           // 사람 성격
    cat: 'pet',            // 고양이 성격
    dog: 'pet',            // 강아지 성격
    rabbit: 'pet',         // 토끼 성격
    hamster: 'pet',        // 햄스터 성격

    // === 매칭 (matching) ===
    coffee: 'drink',       // 커피 매칭
    tea: 'drink',          // 차 매칭
    alcohol: 'drink',      // 술 매칭
    bread: 'food',         // 빵 매칭
    fruit: 'food',         // 과일 매칭
    plant: 'product',      // 식물 매칭 (제품 연계)
    petMatch: 'product',   // 반려동물 매칭 (제품 연계)
    perfume: 'product',    // 향수 매칭 (제품 연계)
    aroma: 'product',      // 아로마 매칭 (제품 연계)

    // === 관계 (relationship) - 바이럴 특화 ===
    idealType: 'love',         // 연애 이상형
    conflictStyle: 'social',   // 갈등 대처 (소통)
    // TODO: 추가 예정 - 궁합 테스트, 사랑의 언어, 연애 스타일 등

    // === 라이프 (lifestyle) - 제품 연계 ===
    // TODO: 추가 예정 - 공간 스타일, 루틴, 소비 성향 등

    // === 세부 테스트 (반려동물 품종) ===
    dogBreed: 'pet',
    catBreed: 'pet',
    smallPet: 'pet',
    fishType: 'pet',
    birdType: 'pet',
    reptileType: 'pet'
};

// 테스트별 1차 카테고리 매핑 (타입 필터용)
// config.testType 외에 relationship/lifestyle 구분을 위한 추가 매핑
const TEST_TYPE_MAP = {
    // 관계 카테고리로 분류될 테스트
    idealType: 'relationship',
    conflictStyle: 'relationship',
    // TODO: 추가될 관계 테스트들

    // 라이프 카테고리로 분류될 테스트
    // TODO: 추가될 라이프 테스트들
};

// 테스트의 실제 카테고리 타입 결정 (TEST_TYPE_MAP 우선, 없으면 config.testType)
const getTestType = (test) => {
    return TEST_TYPE_MAP[test.key] || test.testType || 'personality';
};

// 테스트 배지 설정
// HOT: 인기, NEW: 신규, UPDATE: 업데이트됨
const TEST_BADGES = {
    human: 'HOT', // 인기
    fruit: 'NEW', // 신규
    tea: 'UPDATE', // 업데이트됨
};

// 1차 필터 탭 (underline 스타일 - 고정 탭)
// count가 0이어도 탭은 표시하되 비활성 스타일 적용
const TypeTab = ({ type, isActive, onClick, count }) => {
    const isEmpty = count === 0;
    const tabInfo = TEST_TYPE_TABS[type];

    return (
        <button
            onClick={isEmpty ? undefined : onClick}
            disabled={isEmpty}
            className={`relative flex items-center gap-1 px-3 py-2 text-sm font-bold transition-all whitespace-nowrap ${
                isEmpty
                    ? 'text-slate-200 cursor-not-allowed'
                    : isActive
                        ? 'text-indigo-600'
                        : 'text-slate-400 hover:text-slate-600'
            }`}
        >
            <span>{tabInfo.emoji}</span>
            <span>{tabInfo.label}</span>
            <span className={`text-xs ${
                isEmpty
                    ? 'text-slate-200'
                    : isActive
                        ? 'text-indigo-400'
                        : 'text-slate-300'
            }`}>
                {count}
            </span>
            {/* Underline indicator */}
            {isActive && !isEmpty && (
                <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-indigo-500 rounded-full" />
            )}
        </button>
    );
};

// 2차 필터 칩 (작은 필터)
const SubjectChip = ({ subject, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-xs font-medium transition-all whitespace-nowrap ${isActive
            ? 'bg-slate-700 text-white'
            : 'bg-white/80 text-slate-500 hover:bg-white hover:text-slate-700 border border-slate-200'
            }`}
    >
        <span>{SUBJECT_CATEGORIES[subject].emoji}</span>
        <span>{SUBJECT_CATEGORIES[subject].label}</span>
    </button>
);

// Header (프로필 버튼은 하단 네비게이션으로 통합됨)
// PC에서는 좌측 사이드바에 로고가 있으므로 헤더 숨김
const Header = () => (
    <div className="flex items-center justify-center mb-6 animate-fade-in-up lg:hidden">
        <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
                Chemi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Test</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">오늘은 뭘 알아볼까?</p>
        </div>
    </div>
);

// 스트릭 배너 컴포넌트 (5초 후 자동 사라짐) + 보너스 액션 CTA
const StreakBanner = ({ streak, level, points, onClose, onBonusAction, bonusAction }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 8000); // 보너스 액션 있으면 8초로 연장
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!streak || streak.currentStreak === 0) return null;

    return (
        <div className="mb-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-3 border border-amber-200 animate-fade-in-up relative">
            {/* 닫기 버튼 */}
            <button
                onClick={onClose}
                className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center text-amber-400 hover:text-amber-600 hover:bg-amber-100 rounded-full transition-colors"
                aria-label="닫기"
            >
                ✕
            </button>
            <div className="flex items-center gap-3 pr-6">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
                    <Flame className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-black text-amber-700">
                            {streak.currentStreak}일 연속!
                        </span>
                        {streak.currentStreak >= 7 && (
                            <span className="text-xs bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-bold">
                                🔥 불타는 중
                            </span>
                        )}
                    </div>
                    <p className="text-xs text-amber-600">
                        최장 {streak.longestStreak}일 | {level?.emoji} {level?.name} Lv.{level?.level}
                    </p>
                </div>
                <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-amber-600">
                        <Star className="w-3 h-3" />
                        <span className="text-xs font-bold">{points}P</span>
                    </div>
                </div>
            </div>
            {/* 스트릭 보너스 CTA */}
            {bonusAction && (
                <button
                    onClick={() => onBonusAction?.(bonusAction)}
                    className="mt-2 w-full py-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-bold flex items-center justify-center gap-1.5 hover:from-amber-500 hover:to-orange-500 transition-all active:scale-95"
                >
                    <span>{bonusAction.icon}</span>
                    <span>{bonusAction.label}</span>
                    <ChevronRight className="w-3 h-3" />
                </button>
            )}
        </div>
    );
};

// 시간대별 추천 카드
const TimeBasedCard = ({ action, onAction }) => {
    if (!action) return null;

    // 시간대별 아이콘/색상
    const getTimeStyle = () => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour < 9) return { icon: Sunrise, gradient: 'from-amber-100 to-orange-100', border: 'border-amber-200', text: 'text-amber-700' };
        if (hour >= 9 && hour < 18) return { icon: Sun, gradient: 'from-yellow-100 to-amber-100', border: 'border-yellow-200', text: 'text-yellow-700' };
        if (hour >= 18 && hour < 22) return { icon: Moon, gradient: 'from-indigo-100 to-purple-100', border: 'border-indigo-200', text: 'text-indigo-700' };
        return { icon: Sparkles, gradient: 'from-slate-100 to-blue-100', border: 'border-slate-200', text: 'text-slate-700' };
    };

    const style = getTimeStyle();
    const TimeIcon = style.icon;

    return (
        <button
            onClick={() => onAction?.(action)}
            className={`w-full flex items-center gap-3 bg-gradient-to-r ${style.gradient} rounded-xl p-3 border ${style.border} hover:shadow-md transition-all group`}
        >
            <div className={`w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center flex-shrink-0`}>
                <TimeIcon className={`w-4 h-4 ${style.text}`} />
            </div>
            <div className="flex-1 text-left min-w-0">
                <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-bold ${style.text}`}>{action.icon} {action.label}</span>
                </div>
                <p className="text-xs font-medium text-slate-600 truncate">{action.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors flex-shrink-0" />
        </button>
    );
};

// 포인트 획득 토스트 컴포넌트
const PointsToast = ({ points, message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2500);
        return () => clearTimeout(timer);
    }, [onClose]);

    if (!points) return null;

    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce-in">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2">
                <Star className="w-4 h-4" />
                <span className="font-bold">+{points}P</span>
                {message && <span className="text-xs opacity-90">{message}</span>}
            </div>
        </div>
    );
};

// Background Decoration Component
const BackgroundDecoration = () => (
    <>
        {/* 상단 좌측 블롭 */}
        <div className="fixed top-[-10%] left-[-5%] w-[40%] h-[40%] bg-gradient-to-br from-indigo-200/40 to-purple-200/30 rounded-full blur-3xl pointer-events-none" />
        {/* 상단 우측 블롭 */}
        <div className="fixed top-[5%] right-[-10%] w-[35%] h-[35%] bg-gradient-to-bl from-pink-200/30 to-rose-200/20 rounded-full blur-3xl pointer-events-none" />
        {/* 하단 블롭 */}
        <div className="fixed bottom-[-5%] left-[20%] w-[50%] h-[30%] bg-gradient-to-t from-cyan-100/20 to-blue-100/10 rounded-full blur-3xl pointer-events-none" />
    </>
);

// DailyQuizCard와 VSPollCard는 DailyContentCards 컴포넌트로 통합됨

const Dashboard = ({ onStartTest, onContentExplore }) => {
    // 2단계 필터 상태
    const [activeType, setActiveType] = useState('all');        // 1차: 심리/매칭
    const [activeSubject, setActiveSubject] = useState(null);   // 2차: 주제별 (null = 전체)

    // 게이미피케이션 상태
    const [gameStats, setGameStats] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [pointsToast, setPointsToast] = useState(null);
    const [showStreakBanner, setShowStreakBanner] = useState(false); // 오늘 첫 방문 시에만 true

    // 시간대/스트릭 기반 추천
    const [timeBasedAction, setTimeBasedAction] = useState(null);
    const [streakBonusAction, setStreakBonusAction] = useState(null);

    // 랭킹 모달 상태
    const [showRankingModal, setShowRankingModal] = useState(false);

    useEffect(() => {
        // 게이미피케이션 초기화 및 방문 기록
        /* eslint-disable react-hooks/set-state-in-effect */
        const stats = gamificationService.getStats();
        setGameStats(stats);
        setCurrentLevel(gamificationService.getLevel());

        // 일일 방문 포인트 (오늘 첫 방문인 경우에만 streak 배너 표시)
        const visitResult = gamificationService.recordVisit();
        if (visitResult.streakUpdated && visitResult.points > 0) {
            setPointsToast({ points: visitResult.points, message: '오늘도 방문!' });
            setGameStats(gamificationService.getStats());
            setShowStreakBanner(true); // 오늘 첫 방문 시에만 배너 표시
        }

        // 시간대별 추천 초기화
        const currentHour = new Date().getHours();
        const timeAction = nextActionService.getTimeBasedAction(currentHour);
        setTimeBasedAction(timeAction);

        // 스트릭 보너스 초기화
        const streakCount = stats.streak?.currentStreak || 0;
        if (streakCount >= 3) {
            const bonusAction = nextActionService.getStreakBonusAction(streakCount);
            setStreakBonusAction(bonusAction);
        }
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);

    // 시간대/스트릭 보너스 액션 처리
    const handleBonusAction = (action) => {
        if (!action) return;

        switch (action.type) {
            case 'test':
                // 테스트 추천 → targetId가 있으면 해당 테스트, 없으면 인기 테스트
                onStartTest?.(action.targetId || POPULAR_TESTS[0] || 'human');
                break;
            case 'quiz':
            case 'poll':
                // 퀴즈/투표 추천 → 컨텐츠 탐색으로 이동
                onContentExplore?.();
                break;
            case 'share':
                // 공유 추천 → 프로필로 이동
                onContentExplore?.();
                break;
            default:
                break;
        }
    };

    // Group configs by testType (excluding detail tests from main list)
    const groupedConfigs = useMemo(() => {
        const groups = {};
        Object.entries(SUBJECT_CONFIG).forEach(([key, config]) => {
            const type = config.testType || 'personality';
            if (!groups[type]) groups[type] = [];

            const data = CHEMI_DATA[key] || {};

            groups[type].push({
                key,
                ...config,
                title: data.title || config.label,
                subtitle: data.subtitle || '나의 성향을 알아보세요!',
                color: data.themeColor || 'bg-gray-100'
            });
        });
        return groups;
    }, []);

    // All tests list (excluding detail tests)
    const allTests = useMemo(() => {
        return [...(groupedConfigs.personality || []), ...(groupedConfigs.matching || [])]
            .filter(t => !DETAIL_TEST_KEYS.includes(t.key));
    }, [groupedConfigs]);

    // Detail tests
    const detailTests = useMemo(() => {
        return [...(groupedConfigs.personality || []), ...(groupedConfigs.matching || [])]
            .filter(t => DETAIL_TEST_KEYS.includes(t.key));
    }, [groupedConfigs]);

    // 1차 필터 적용 (테스트 유형: 심리/매칭/관계/라이프)
    const typeFilteredTests = useMemo(() => {
        if (activeType === 'all') return allTests;
        return allTests.filter(t => getTestType(t) === activeType);
    }, [allTests, activeType]);

    // 2차 필터 적용 (주제별)
    const filteredTests = useMemo(() => {
        if (!activeSubject) return typeFilteredTests;
        return typeFilteredTests.filter(t => TEST_SUBJECT_MAP[t.key] === activeSubject);
    }, [typeFilteredTests, activeSubject]);

    // 1차 필터별 카운트
    const typeCounts = useMemo(() => {
        return {
            all: allTests.length,
            personality: allTests.filter(t => getTestType(t) === 'personality').length,
            matching: allTests.filter(t => getTestType(t) === 'matching').length,
            relationship: allTests.filter(t => getTestType(t) === 'relationship').length,
            lifestyle: allTests.filter(t => getTestType(t) === 'lifestyle').length
        };
    }, [allTests]);

    // 2차 필터별 카운트 (현재 1차 필터 기준)
    const subjectCounts = useMemo(() => {
        const counts = {};
        Object.keys(SUBJECT_CATEGORIES).forEach(sub => {
            counts[sub] = typeFilteredTests.filter(t => TEST_SUBJECT_MAP[t.key] === sub).length;
        });
        return counts;
    }, [typeFilteredTests]);

    return (
        <>
            {/* Background Decoration */}
            <BackgroundDecoration />

            {/* 포인트 획득 토스트 */}
            {pointsToast && (
                <PointsToast
                    points={pointsToast.points}
                    message={pointsToast.message}
                    onClose={() => setPointsToast(null)}
                />
            )}

            <div className="relative max-w-md md:max-w-2xl lg:max-w-4xl xl:max-w-5xl mx-auto w-full pb-24 lg:pb-8 px-4 lg:px-6">
                {/* Header */}
                <Header />

                {/* 스트릭 배너 + 보너스 액션 */}
                {showStreakBanner && gameStats && (
                    <StreakBanner
                        streak={gameStats.streak}
                        level={currentLevel}
                        points={gameStats.totalPoints}
                        onClose={() => setShowStreakBanner(false)}
                        bonusAction={streakBonusAction}
                        onBonusAction={handleBonusAction}
                    />
                )}

                {/* 히어로 배너 - 인기 테스트 추천 */}
                <HeroBanner
                    onStartTest={onStartTest}
                    className="mb-4 animate-fade-in-up"
                />

                {/* 모바일/태블릿: 디스커버리 피드 */}
                <div className="lg:hidden">
                    {/* 추천 섹션 - 모바일에서만 표시 (PC는 RightSidebar에서 표시) */}
                    <div className="mb-4 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <RecommendedSection onStartTest={onStartTest} />
                    </div>

                    {/* 오늘의 랭킹 - 미니 프리뷰 */}
                    <TodayRankingPreview
                        onClick={() => setShowRankingModal(true)}
                        className="mb-6 animate-fade-in-up"
                    />

                    {/* 혼합 디스커버리 피드 (모든 참여형 콘텐츠) */}
                    <DiscoveryFeed
                        onStartTest={onStartTest}
                        onExploreAll={onContentExplore}
                        className="mb-8 animate-fade-in-up"
                    />
                </div>

                {/* PC 전용: 단일 컬럼 테스트 카탈로그 (좌우 사이드바가 있으므로 내부 2컬럼 불필요) */}
                <div className="hidden lg:block mt-4">
                    {/* 필터 영역 - 고정 높이로 레이아웃 시프트 방지 */}
                    <div className="sticky top-4 z-20 bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200/60 p-3 shadow-sm" style={{ minHeight: '84px' }}>
                        {/* 1차 필터: 탭 스타일 (underline) */}
                        <div className="flex items-center border-b border-slate-200">
                            {Object.keys(TEST_TYPE_TABS).map((type) => (
                                <TypeTab
                                    key={type}
                                    type={type}
                                    isActive={activeType === type}
                                    onClick={() => {
                                        setActiveType(type);
                                        setActiveSubject(null);
                                    }}
                                    count={typeCounts[type]}
                                />
                            ))}
                        </div>

                        {/* 2차 필터: 작은 칩 스타일 - 고정 높이 + 가로 스크롤 */}
                        <div className="mt-2 overflow-x-auto no-scrollbar" style={{ height: '32px' }}>
                            <div className="flex gap-1 flex-nowrap">
                                {Object.keys(SUBJECT_CATEGORIES).map((sub) => {
                                    const count = subjectCounts[sub] || 0;
                                    if (count === 0) return null;
                                    return (
                                        <SubjectChip
                                            key={sub}
                                            subject={sub}
                                            isActive={activeSubject === sub}
                                            onClick={() => setActiveSubject(activeSubject === sub ? null : sub)}
                                            count={count}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* All Tests - Single Grid */}
                    <section className="animate-fade-in-up mt-3">
                        {/* Grid: 모바일 4열, 태블릿 5열, PC 5-6열 - 최적화된 밀도 */}
                        <div className="grid gap-2 grid-cols-4 sm:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 min-h-[280px] content-start">
                            {filteredTests.map((item) => (
                                <TestCard
                                    key={item.key}
                                    item={item}
                                    onStart={onStartTest}
                                    badge={TEST_BADGES[item.key]}
                                />
                            ))}
                        </div>

                        {/* Empty State */}
                        {filteredTests.length === 0 && (
                            <div className="text-center py-16 text-slate-400">
                                <div className="w-16 h-16 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <span className="text-2xl">{TEST_TYPE_TABS[activeType]?.emoji || '📋'}</span>
                                </div>
                                <p className="text-sm font-medium text-slate-500 mb-2">
                                    {activeType === 'relationship' && '관계 테스트 준비 중'}
                                    {activeType === 'lifestyle' && '라이프 테스트 준비 중'}
                                    {activeType !== 'relationship' && activeType !== 'lifestyle' && '이 카테고리에 테스트가 없습니다'}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {activeType === 'relationship' && '궁합 테스트, 사랑의 언어 등 바이럴 특화 테스트가 곧 출시됩니다!'}
                                    {activeType === 'lifestyle' && '공간 스타일, 소비 성향 등 제품 연계 테스트가 곧 출시됩니다!'}
                                </p>
                            </div>
                        )}
                    </section>

                    {/* 세부 테스트 섹션 - 항상 표시 */}
                    {detailTests.length > 0 && (activeType === 'all' || activeType === 'matching') && (!activeSubject || activeSubject === 'pet') && (
                        <section className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                            <div className="flex items-center gap-2 mb-3 px-1">
                                <span className="text-sm font-bold text-slate-600">
                                    🐾 세부 추천
                                </span>
                                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                    {detailTests.length}
                                </span>
                            </div>

                            <div className="bg-amber-50/50 rounded-2xl p-3 border border-amber-100">
                                <p className="text-xs text-amber-700 mb-3 px-1">
                                    💡 반려동물 매칭 테스트 후 자동으로 연결됩니다
                                </p>
                                <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                                    {detailTests.map((item) => (
                                        <TestCard
                                            key={item.key}
                                            item={item}
                                            onStart={onStartTest}
                                        />
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                {/* 푸터 - 개인정보처리방침, 이용약관, 면책조항 */}
                <Footer className="mt-12 mb-24" />

            </div>

            {/* 오늘의 랭킹 모달 */}
            <TodayRankingModal
                isOpen={showRankingModal}
                onClose={() => setShowRankingModal(false)}
                onPollClick={(pollId) => {
                    // TODO: 해당 투표로 이동하는 로직
                    console.log('Poll clicked:', pollId);
                }}
                onViewAllClick={() => {
                    onContentExplore?.();
                }}
            />
        </>
    );
};

export default Dashboard;
