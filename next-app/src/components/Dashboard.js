import { useMemo, useState, useEffect } from 'react';
import * as Icons from './Icons';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import { resultService } from '../services/ResultService';
import { ArrowRight, Sparkles, TrendingUp, Check, RotateCcw, ChevronRight, ChevronDown, Play, Target } from 'lucide-react';

// petMatch 세부 테스트 키 (메인 목록에서 숨김)
const DETAIL_TEST_KEYS = ['dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'];

// 카테고리 정의
const CATEGORIES = {
    all: { label: '전체', emoji: '✨' },
    me: { label: '나', emoji: '🧠' },
    pet: { label: '반려동물', emoji: '🐾' },
    match: { label: '매칭', emoji: '💫' },
    love: { label: '연애', emoji: '💕' }
};

// 테스트별 카테고리 매핑
const TEST_CATEGORIES = {
    human: 'me',
    conflictStyle: 'me',
    cat: 'pet',
    dog: 'pet',
    rabbit: 'pet',
    hamster: 'pet',
    petMatch: 'match',
    plant: 'match',
    coffee: 'match',
    idealType: 'love',
    // 세부 테스트
    dogBreed: 'pet',
    catBreed: 'pet',
    smallPet: 'pet',
    fishType: 'pet',
    birdType: 'pet',
    reptileType: 'pet'
};

// 인기 테스트 키 (고정)
const FEATURED_KEYS = ['human', 'dog', 'idealType'];

// Compact Test Item (아이콘 + 제목만)
const CompactTestItem = ({ item, onStart, isCompleted }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    return (
        <button
            onClick={() => onStart(item.key)}
            className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative"
        >
            {isCompleted && (
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                </div>
            )}
            <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <IconComponent mood="happy" className="w-8 h-8" />
            </div>
            <span className="text-xs font-bold text-slate-600 group-hover:text-indigo-600 transition-colors text-center leading-tight">
                {item.label}
            </span>
        </button>
    );
};

// Featured Test Card (인기 테스트용 - 크게)
const FeaturedTestCard = ({ item, onStart, rank, isCompleted }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    const gradients = [
        'from-indigo-500/10 to-purple-500/10 border-indigo-200 hover:border-indigo-300',
        'from-amber-500/10 to-orange-500/10 border-amber-200 hover:border-amber-300',
        'from-emerald-500/10 to-teal-500/10 border-emerald-200 hover:border-emerald-300',
    ];

    return (
        <button
            onClick={() => onStart(item.key)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${gradients[rank % 3]} p-4 w-full text-left`}
        >
            {isCompleted && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm z-10">
                    <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
            )}
            <div className="flex items-center gap-3">
                <div className="w-14 h-14 flex items-center justify-center bg-white rounded-2xl shadow-sm group-hover:scale-110 transition-transform duration-300">
                    <IconComponent mood="happy" className="w-10 h-10" />
                </div>
                <div className="flex-1 text-left">
                    <div className="flex items-center gap-2 mb-0.5">
                        {rank === 0 && (
                            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-bold rounded-full">
                                <TrendingUp className="w-2.5 h-2.5" /> HOT
                            </span>
                        )}
                    </div>
                    <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                        {item.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1">{item.subtitle}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center text-slate-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <ArrowRight className="w-4 h-4" />
                </div>
            </div>
        </button>
    );
};

// Completed Test Card (재시도 가능)
const CompletedTestCard = ({ item, result, onStart }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    return (
        <div className="relative bg-white/80 rounded-xl p-3 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
                    <IconComponent mood="happy" className="w-7 h-7" />
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-700 text-sm truncate">{item.label}</h4>
                    <p className="text-[11px] text-slate-400 truncate">
                        {result?.resultName ? `결과: ${result.resultName}` : '완료됨'}
                    </p>
                </div>
                <button
                    onClick={() => onStart(item.key)}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 rounded-lg text-xs font-bold transition-colors"
                >
                    <RotateCcw className="w-3 h-3" />
                    다시
                </button>
            </div>
        </div>
    );
};

// Category Tab Button
const CategoryTab = ({ category, isActive, onClick, count }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
            isActive
                ? 'bg-indigo-500 text-white shadow-md'
                : 'bg-white/60 text-slate-600 hover:bg-white hover:shadow-sm'
        }`}
    >
        <span>{CATEGORIES[category].emoji}</span>
        <span>{CATEGORIES[category].label}</span>
        {count > 0 && !isActive && (
            <span className="text-[10px] bg-slate-200 text-slate-500 px-1.5 py-0.5 rounded-full">
                {count}
            </span>
        )}
    </button>
);

// Hero Section for First-time Users
const HeroSection = ({ onStartFirst, completedCount, totalCount }) => {
    const isFirstTime = completedCount === 0;

    if (isFirstTime) {
        return (
            <div className="mb-6 p-6 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-3xl text-white relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl translate-x-10 -translate-y-10"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-x-10 translate-y-10"></div>

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Target className="w-5 h-5" />
                        <span className="text-sm font-bold opacity-90">첫 번째 테스트</span>
                    </div>
                    <h1 className="text-2xl font-black mb-2 leading-tight">
                        나를 알아가는<br />첫 걸음
                    </h1>
                    <p className="text-sm opacity-80 mb-4">
                        5분만 투자해서 나의 숨겨진 성격을 발견해보세요
                    </p>
                    <button
                        onClick={onStartFirst}
                        className="w-full py-3.5 bg-white text-indigo-600 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:scale-95"
                    >
                        <Play className="w-5 h-5" fill="currentColor" />
                        내 마음 테스트 시작하기
                    </button>
                </div>
            </div>
        );
    }

    // 재방문자용 헤더 - 심플하게
    return (
        <div className="mb-6 text-center animate-fade-in-up">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
                Chemi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Test</span>
            </h1>
            <p className="text-sm text-slate-500 mt-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full font-bold">
                    <Check className="w-4 h-4" />
                    {completedCount}/{totalCount}개 완료
                </span>
            </p>
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

const Dashboard = ({ onStartTest }) => {
    const [completedTests, setCompletedTests] = useState([]);
    const [completedResults, setCompletedResults] = useState({});
    const [activeCategory, setActiveCategory] = useState('all');
    const [showDetailTests, setShowDetailTests] = useState(false);
    const [showAllCompleted, setShowAllCompleted] = useState(false);

    useEffect(() => {
        const loadCompleted = async () => {
            const completed = await resultService.getCompletedTests();
            setCompletedTests(completed);

            // Load result details for completed tests
            const allResults = await resultService.getMyResults();
            const resultsByType = {};

            // 각 테스트 타입별로 가장 최신 결과만 저장
            for (const result of allResults) {
                if (!resultsByType[result.testType] ||
                    new Date(result.createdAt) > new Date(resultsByType[result.testType].createdAt)) {
                    resultsByType[result.testType] = {
                        resultName: result.resultKey,
                        emoji: result.resultEmoji,
                        createdAt: result.createdAt
                    };
                }
            }
            setCompletedResults(resultsByType);
        };
        loadCompleted();
    }, []);

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

    // Featured tests (인기 테스트 3개)
    const featuredTests = FEATURED_KEYS
        .map(key => allTests.find(t => t.key === key))
        .filter(Boolean);

    // Filter tests by category
    const filteredTests = useMemo(() => {
        if (activeCategory === 'all') {
            return allTests.filter(t => !FEATURED_KEYS.includes(t.key));
        }
        return allTests.filter(t => TEST_CATEGORIES[t.key] === activeCategory);
    }, [allTests, activeCategory]);

    // Completed tests with details
    const completedTestItems = useMemo(() => {
        return completedTests
            .filter(key => !DETAIL_TEST_KEYS.includes(key))
            .map(key => {
                const testItem = allTests.find(t => t.key === key);
                return testItem ? {
                    ...testItem,
                    result: completedResults[key]
                } : null;
            })
            .filter(Boolean);
    }, [completedTests, completedResults, allTests]);

    // Count tests per category
    const categoryCounts = useMemo(() => {
        const counts = { all: allTests.length };
        Object.keys(CATEGORIES).forEach(cat => {
            if (cat !== 'all') {
                counts[cat] = allTests.filter(t => TEST_CATEGORIES[t.key] === cat).length;
            }
        });
        return counts;
    }, [allTests]);

    const completedCount = completedTests.filter(key => !DETAIL_TEST_KEYS.includes(key)).length;
    const totalCount = allTests.length;

    return (
        <>
            {/* Background Decoration */}
            <BackgroundDecoration />

            <div className="relative max-w-md md:max-w-2xl lg:max-w-4xl mx-auto w-full pb-8 px-4">
                {/* Hero Section */}
                <HeroSection
                onStartFirst={() => onStartTest('human')}
                completedCount={completedCount}
                totalCount={totalCount}
            />

            {/* Completed Tests Section (if any) */}
            {completedTestItems.length > 0 && activeCategory === 'all' && (
                <section className="mb-6 animate-fade-in-up">
                    <div className="flex items-center justify-between mb-3 px-1">
                        <div className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-green-500" />
                            <span className="text-sm font-bold text-slate-700">완료한 테스트</span>
                            <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                {completedTestItems.length}
                            </span>
                        </div>
                    </div>
                    <div className="space-y-2">
                        {(showAllCompleted ? completedTestItems : completedTestItems.slice(0, 3)).map((item) => (
                            <CompletedTestCard
                                key={item.key}
                                item={item}
                                result={item.result}
                                onStart={onStartTest}
                            />
                        ))}
                        {completedTestItems.length > 3 && (
                            <button
                                onClick={() => setShowAllCompleted(!showAllCompleted)}
                                className="w-full py-2 text-xs text-slate-400 hover:text-slate-600 font-bold flex items-center justify-center gap-1"
                            >
                                {showAllCompleted ? (
                                    <>접기 <ChevronDown className="w-3 h-3" /></>
                                ) : (
                                    <>+{completedTestItems.length - 3}개 더 보기 <ChevronRight className="w-3 h-3" /></>
                                )}
                            </button>
                        )}
                    </div>
                </section>
            )}

            {/* Category Tabs */}
            <div className="mb-4 overflow-x-auto no-scrollbar -mx-4 px-4">
                <div className="flex gap-2 pb-2">
                    {Object.keys(CATEGORIES).map((cat) => (
                        <CategoryTab
                            key={cat}
                            category={cat}
                            isActive={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                            count={categoryCounts[cat]}
                        />
                    ))}
                </div>
            </div>

            {/* PC: 2열 레이아웃 */}
            <div className="md:grid md:grid-cols-2 md:gap-6">
                {/* Featured Section - Only show in 'all' category */}
                {activeCategory === 'all' && (
                    <section className="mb-6 md:mb-0 animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span className="text-sm font-bold text-slate-700">인기 테스트</span>
                        </div>
                        <div className="space-y-2">
                            {featuredTests.map((item, idx) => (
                                <FeaturedTestCard
                                    key={item.key}
                                    item={item}
                                    onStart={onStartTest}
                                    rank={idx}
                                    isCompleted={completedTests.includes(item.key)}
                                />
                            ))}
                        </div>
                    </section>
                )}

                {/* All Tests - Bento Grid */}
                <section className={`animate-fade-in-up ${activeCategory !== 'all' ? 'md:col-span-2' : ''}`} style={{ animationDelay: '0.1s' }}>
                    {activeCategory === 'all' && (
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <span className="text-sm font-bold text-slate-700">모든 테스트</span>
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {filteredTests.length + featuredTests.length}
                            </span>
                        </div>
                    )}

                    {activeCategory !== 'all' && (
                        <div className="flex items-center gap-2 mb-3 px-1">
                            <span className="text-lg">{CATEGORIES[activeCategory].emoji}</span>
                            <span className="text-sm font-bold text-slate-700">
                                {CATEGORIES[activeCategory].label} 테스트
                            </span>
                            <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                                {filteredTests.length}
                            </span>
                        </div>
                    )}

                    {/* Grid: 모바일 3열, 태블릿 3열, PC(카테고리 선택시) 4-5열 */}
                    <div className={`grid gap-2 ${
                        activeCategory === 'all'
                            ? 'grid-cols-3 md:grid-cols-3 lg:grid-cols-4'
                            : 'grid-cols-3 md:grid-cols-4 lg:grid-cols-5'
                    }`}>
                        {filteredTests.map((item) => (
                            <CompactTestItem
                                key={item.key}
                                item={item}
                                onStart={onStartTest}
                                isCompleted={completedTests.includes(item.key)}
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
            </div>

            {/* 세부 테스트 섹션 (접힘 가능) - activeCategory가 'all' 또는 'pet'일 때만 표시 */}
            {detailTests.length > 0 && (activeCategory === 'all' || activeCategory === 'pet') && (
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
                            <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                                {detailTests.map((item) => (
                                    <CompactTestItem
                                        key={item.key}
                                        item={item}
                                        onStart={onStartTest}
                                        isCompleted={completedTests.includes(item.key)}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </section>
            )}

            {/* Footer */}
            <div className="mt-10 text-center text-slate-300 text-[10px]">
                <p>© 2025 Chemi Test Lab</p>
            </div>
        </div>
        </>
    );
};

export default Dashboard;
