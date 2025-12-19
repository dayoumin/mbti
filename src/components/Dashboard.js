import { useMemo, useState, useEffect } from 'react';
import * as Icons from './Icons';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import { gamificationService } from '../services/GamificationService';
import { nextActionService } from '../services/NextActionService';
import { ChevronRight, ChevronDown, Flame, Star, Sunrise, Sun, Moon, Sparkles } from 'lucide-react';
import { DETAIL_TEST_KEYS } from '../config/testKeys';
import Footer from './Footer';
import HeroBanner from './HeroBanner';
import DailyContentCards from './DailyContentCards';
import { TrendingSection, RecentSection, RecommendedSection } from './ContentSections';
import TodayRankingPreview from './TodayRankingPreview';
import TodayRankingModal from './TodayRankingModal';

// 1차 필터: 테스트 유형 (심리/매칭)
const TEST_TYPE_TABS = {
    all: { label: '전체', emoji: '✨' },
    personality: { label: '심리', emoji: '🧠' },
    matching: { label: '매칭', emoji: '💫' }
};

// 2차 필터: 주제별 카테고리 (전체 제거 - 1차 필터에서 이미 전체 선택 가능)
const SUBJECT_CATEGORIES = {
    me: { label: '나', emoji: '👤' },
    pet: { label: '반려동물', emoji: '🐾' },
    drink: { label: '음료', emoji: '🥤' },
    food: { label: '음식', emoji: '🍽️' },
    life: { label: '라이프', emoji: '🌿' },
    love: { label: '연애', emoji: '💕' }
};

// 테스트별 주제 카테고리 매핑
const TEST_SUBJECT_MAP = {
    // 나
    human: 'me',
    conflictStyle: 'me',
    // 반려동물
    cat: 'pet',
    dog: 'pet',
    rabbit: 'pet',
    hamster: 'pet',
    // 음료
    coffee: 'drink',
    tea: 'drink',
    alcohol: 'drink',
    // 음식
    bread: 'food',
    fruit: 'food',
    // 라이프
    plant: 'life',
    petMatch: 'life',
    // 연애
    idealType: 'love',
    // 세부 테스트 (반려동물)
    dogBreed: 'pet',
    catBreed: 'pet',
    smallPet: 'pet',
    fishType: 'pet',
    birdType: 'pet',
    reptileType: 'pet'
};

// 테스트 배지 설정
// HOT: 인기, NEW: 신규, UPDATE: 업데이트됨
const TEST_BADGES = {
    human: 'HOT', // 인기
    fruit: 'NEW', // 신규
    tea: 'UPDATE', // 업데이트됨
};

// Test Card - 4열에 맞게 더 큰 아이콘 + 제목
const TestCard = ({ item, onStart, badge }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    return (
        <button
            onClick={() => onStart(item.key)}
            className="group flex flex-col items-center gap-2 pt-4 pb-3 px-2 rounded-xl bg-white/80 hover:bg-white border border-white/60 hover:border-indigo-200 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative"
        >
            {badge && (
                <span className={`absolute top-1 right-1 px-1.5 py-0.5 text-[8px] font-bold rounded-full shadow-sm z-10 ${
                    badge === 'HOT' ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' :
                    badge === 'NEW' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white' :
                    badge === 'UPDATE' ? 'bg-gradient-to-r from-blue-400 to-indigo-400 text-white' :
                    'bg-slate-200 text-slate-600'
                }`}>
                    {badge}
                </span>
            )}
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl group-hover:scale-110 transition-transform duration-300 shadow-sm">
                <IconComponent mood="happy" className="w-9 h-9" />
            </div>
            <span className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition-colors text-center leading-tight">
                {item.label}
            </span>
        </button>
    );
};

// 1차 필터 탭 (underline 스타일 - 고정 탭)
const TypeTab = ({ type, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`relative flex items-center gap-1 px-3 py-2 text-sm font-bold transition-all whitespace-nowrap ${
            isActive
                ? 'text-indigo-600'
                : 'text-slate-400 hover:text-slate-600'
        }`}
    >
        <span>{TEST_TYPE_TABS[type].label}</span>
        <span className={`text-[10px] ${isActive ? 'text-indigo-400' : 'text-slate-300'}`}>
            {count}
        </span>
        {/* Underline indicator */}
        {isActive && (
            <span className="absolute bottom-0 left-1 right-1 h-0.5 bg-indigo-500 rounded-full" />
        )}
    </button>
);

// 2차 필터 칩 (작은 필터)
const SubjectChip = ({ subject, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-0.5 px-2 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap ${
            isActive
                ? 'bg-slate-700 text-white'
                : 'bg-white/80 text-slate-500 hover:bg-white hover:text-slate-700 border border-slate-200'
        }`}
    >
        <span>{SUBJECT_CATEGORIES[subject].emoji}</span>
        <span>{SUBJECT_CATEGORIES[subject].label}</span>
    </button>
);

// Header (프로필 버튼은 하단 네비게이션으로 통합됨)
const Header = () => (
    <div className="flex items-center justify-center mb-6 animate-fade-in-up">
        <div className="text-center lg:text-left lg:flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 lg:hidden">
                Chemi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Test</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1 lg:mt-0 lg:text-base lg:font-medium">오늘은 뭘 알아볼까?</p>
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
                            <span className="text-[10px] bg-amber-400 text-white px-1.5 py-0.5 rounded-full font-bold">
                                🔥 불타는 중
                            </span>
                        )}
                    </div>
                    <p className="text-[10px] text-amber-600">
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
                    <span className={`text-[10px] font-bold ${style.text}`}>{action.icon} {action.label}</span>
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
    const [showDetailTests, setShowDetailTests] = useState(false);

    // 게이미피케이션 상태
    const [gameStats, setGameStats] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [pointsToast, setPointsToast] = useState(null);
    const [showStreakBanner, setShowStreakBanner] = useState(true);

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

        // 일일 방문 포인트
        const visitResult = gamificationService.recordVisit();
        if (visitResult.streakUpdated && visitResult.points > 0) {
            setPointsToast({ points: visitResult.points, message: '오늘도 방문!' });
            setGameStats(gamificationService.getStats());
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
                onStartTest?.(action.targetId || 'human');
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

    // 1차 필터 적용 (테스트 유형)
    const typeFilteredTests = useMemo(() => {
        if (activeType === 'all') return allTests;
        return allTests.filter(t => t.testType === activeType);
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
            personality: allTests.filter(t => t.testType === 'personality').length,
            matching: allTests.filter(t => t.testType === 'matching').length
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

            <div className="relative max-w-md md:max-w-2xl lg:max-w-5xl xl:max-w-6xl mx-auto w-full pb-24 lg:pb-8 px-4 lg:px-8">
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

                {/* 오늘의 참여 - 반응형 그리드 */}
                <DailyContentCards
                    className="mb-4 animate-fade-in-up"
                />

                {/* 오늘의 랭킹 - 미니 프리뷰 (클릭 시 모달) */}
                <TodayRankingPreview
                    onClick={() => setShowRankingModal(true)}
                    className="mb-4 animate-fade-in-up"
                />

                {/* PC: 2컬럼 레이아웃 / 모바일: 단일 컬럼 */}
                <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-6">
                    {/* 왼쪽 사이드바: 인기/추천/최근 섹션 */}
                    {/* PC: 고정 사이드바 / 모바일: 상단 가로 스크롤 */}
                    <aside className="mb-4 lg:mb-0 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                        <div className="lg:sticky lg:top-4">
                            <div className="lg:bg-white/60 lg:backdrop-blur-sm lg:rounded-2xl lg:p-4 lg:border lg:border-white/80 lg:shadow-sm lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto lg:no-scrollbar">
                                <TrendingSection onStartTest={onStartTest} />
                                <RecentSection onStartTest={onStartTest} />
                                <RecommendedSection onStartTest={onStartTest} />
                            </div>
                        </div>
                    </aside>

                    {/* 오른쪽 메인 영역 (모바일에서는 전체 너비) */}
                    <main>
                        {/* 필터 영역 - 고정 높이로 레이아웃 시프트 방지 */}
                        <div className="sticky top-0 z-20 bg-[#F0F2F5]/95 backdrop-blur-sm -mx-4 px-4 lg:mx-0 lg:px-0 lg:bg-white/60 lg:rounded-xl lg:border lg:border-white/80 pt-1 pb-2 lg:p-3 lg:min-h-0" style={{ minHeight: '76px' }}>
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

                            {/* 2차 필터: 작은 칩 스타일 - PC에서는 자동 높이 */}
                            <div className="mt-2 overflow-x-auto no-scrollbar h-8 lg:h-auto lg:overflow-visible">
                                <div className="flex gap-1 lg:flex-wrap">
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

                            {/* Grid: 모바일 4열, PC 4-5열 - 더 큰 아이콘으로 탭 용이성 향상 */}
                            <div className="grid gap-2 grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 min-h-[280px] content-start">
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
                                <div className="text-center py-12 text-slate-400">
                                    <p className="text-sm">이 카테고리에 테스트가 없습니다</p>
                                </div>
                            )}
                        </section>

                        {/* 세부 테스트 섹션 (접힘 가능) */}
                        {detailTests.length > 0 && (activeType === 'all' || activeType === 'matching') && (!activeSubject || activeSubject === 'pet') && (
                            <section className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                                <button
                                    onClick={() => setShowDetailTests(!showDetailTests)}
                                    className="flex items-center gap-2 mb-3 px-1 w-full text-left group"
                                >
                                    <span className="text-sm font-bold text-slate-500 group-hover:text-slate-700 transition-colors">
                                        🐾 반려동물 세부 추천
                                    </span>
                                    <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                        {detailTests.length}
                                    </span>
                                    {showDetailTests ? (
                                        <ChevronDown className="w-4 h-4 text-slate-400 ml-auto" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-slate-400 ml-auto" />
                                    )}
                                </button>

                                {showDetailTests && (
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
                                )}
                            </section>
                        )}
                    </main>
                </div>

                {/* 푸터 - 개인정보처리방침, 이용약관, 면책조항 */}
                <Footer className="mt-8 mb-20" />

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
