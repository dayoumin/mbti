import { useMemo, useState, useEffect } from 'react';
import * as Icons from './Icons';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import { getRandomQuiz, getRandomPoll } from '../data/content';
import { ALL_KNOWLEDGE_QUIZZES } from '../data/content/quizzes';
import { VS_POLLS } from '../data/content/polls/vs-polls';
import { gamificationService } from '../services/GamificationService';
import { contentParticipationService } from '../services/ContentParticipationService';
import { ChevronRight, ChevronDown, User, HelpCircle, Vote, Flame, Star } from 'lucide-react';
import { DETAIL_TEST_KEYS } from '../config/testKeys';
import { CompactProfile } from './MyProfile';

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
    tea: 'match',
    idealType: 'love',
    // 세부 테스트
    dogBreed: 'pet',
    catBreed: 'pet',
    smallPet: 'pet',
    fishType: 'pet',
    birdType: 'pet',
    reptileType: 'pet'
};

// 테스트 배지 설정
const TEST_BADGES = {
    human: 'HOT',
    tea: 'NEW'
};

// Compact Test Item (아이콘 + 제목 + 배지) - 더 작게
const CompactTestItem = ({ item, onStart, badge }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    return (
        <button
            onClick={() => onStart(item.key)}
            className="group flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-200 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 relative"
        >
            {badge && (
                <span className={`absolute -top-1 -right-1 px-1 py-0.5 text-[8px] font-bold rounded-full shadow-sm ${
                    badge === 'HOT' ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' :
                    badge === 'NEW' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white' :
                    'bg-slate-200 text-slate-600'
                }`}>
                    {badge}
                </span>
            )}
            <div className="w-10 h-10 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg group-hover:scale-110 transition-transform duration-300">
                <IconComponent mood="happy" className="w-7 h-7" />
            </div>
            <span className="text-[11px] font-bold text-slate-600 group-hover:text-indigo-600 transition-colors text-center leading-tight">
                {item.label}
            </span>
        </button>
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

// Header with Profile
const Header = ({ onProfileClick }) => (
    <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div className="w-10" /> {/* Spacer for centering */}
        <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800">
                Chemi <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">Test</span>
            </h1>
            <p className="text-sm text-slate-500 mt-1">오늘은 뭘 알아볼까?</p>
        </div>
        <button
            onClick={onProfileClick}
            className="w-10 h-10 rounded-full bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-200 flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-all shadow-sm hover:shadow-md"
        >
            <User className="w-5 h-5" />
        </button>
    </div>
);

// 스트릭 배너 컴포넌트
const StreakBanner = ({ streak, level, points, onClose }) => {
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
        </div>
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

// 오늘의 퀴즈 카드 (접힘/펼침)
 const DailyQuizCard = ({ quiz, onAnswer, isExpanded, onToggle, isAnswered = false, previousAnswer = null }) => {
    const [selectedOption, setSelectedOption] = useState(previousAnswer);
    const [showResult, setShowResult] = useState(isAnswered);

    useEffect(() => {
        setSelectedOption(previousAnswer);
        setShowResult(isAnswered);
    }, [quiz?.id, isAnswered, previousAnswer]);

    if (!quiz) return null;

    const handleSelect = (optionId) => {
        if (showResult) return;
        setSelectedOption(optionId);
        setShowResult(true);
        const isCorrect = quiz.options.find(o => o.id === optionId)?.isCorrect || false;
        onAnswer?.(quiz.id, optionId, isCorrect);
    };

    const selectedIsCorrect = quiz.options.find(o => o.id === selectedOption)?.isCorrect;

    // 컴팩트 모드 (접힌 상태)
    if (!isExpanded) {
        return (
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100 hover:border-blue-200 transition-all group"
            >
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                </div>
                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-blue-500 block">오늘의 퀴즈</span>
                        {isAnswered && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                                완료
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 truncate">{quiz.question}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors flex-shrink-0" />
            </button>
        );
    }

    // 펼쳐진 상태
    return (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-100">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-bold text-blue-600">오늘의 퀴즈</span>
                    {isAnswered && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                            완료
                        </span>
                    )}
                    <span className="text-[10px] bg-blue-100 text-blue-500 px-1.5 py-0.5 rounded-full">
                        {quiz.category === 'cat' ? '🐱' : quiz.category === 'dog' ? '🐕' : '📚'}
                    </span>
                </div>
                <button onClick={onToggle} className="p-1 hover:bg-blue-100 rounded-lg transition-colors">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
            </div>
            <p className="text-sm font-bold text-slate-700 mb-2">{quiz.question}</p>
            <div className="space-y-1.5">
                {quiz.options.map((option) => {
                    const isSelected = selectedOption === option.id;
                    const isCorrect = option.isCorrect;
                    let bgClass = 'bg-white hover:bg-blue-50 border-slate-200';

                    if (showResult) {
                        if (isCorrect) {
                            bgClass = 'bg-emerald-50 border-emerald-300 text-emerald-700';
                        } else if (isSelected && !isCorrect) {
                            bgClass = 'bg-red-50 border-red-300 text-red-700';
                        } else {
                            bgClass = 'bg-slate-50 border-slate-200 text-slate-400';
                        }
                    }

                    return (
                        <button
                            key={option.id}
                            onClick={() => handleSelect(option.id)}
                            disabled={showResult}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs border transition-all ${bgClass}`}
                        >
                            {option.text}
                            {showResult && isCorrect && <span className="ml-1">✓</span>}
                        </button>
                    );
                })}
            </div>
            {showResult && (
                <div className={`mt-2 p-2 rounded-lg text-[11px] ${selectedIsCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {selectedIsCorrect ? '🎉 정답!' : '💡 오답!'} {quiz.explanation}
                </div>
            )}
        </div>
    );
};

const getStablePollResults = (pollId) => {
    const seedStr = String(pollId || '');
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
        hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
    }
    const base = Math.abs(hash) % 41; // 0..40
    const a = 30 + base; // 30..70
    return { a, b: 100 - a };
};

// VS 투표 카드 (접힘/펼침)
const VSPollCard = ({ poll, onVote, isExpanded, onToggle, isVoted = false, previousVote = null }) => {
    const [voted, setVoted] = useState(previousVote);
    const [results, setResults] = useState(() => getStablePollResults(poll?.id));

    useEffect(() => {
        if (!poll) return;
        setVoted(previousVote);
        setResults(getStablePollResults(poll.id));
    }, [poll?.id, previousVote]);

    if (!poll) return null;

    const handleVote = (choice) => {
        if (voted) return;
        setVoted(choice);
        setResults(getStablePollResults(poll.id));
        onVote?.(poll.id, choice);
    };

    // 컴팩트 모드 (접힌 상태)
    if (!isExpanded) {
        return (
            <button
                onClick={onToggle}
                className="w-full flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100 hover:border-purple-200 transition-all group"
            >
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Vote className="w-4 h-4 text-purple-500" />
                </div>
                <div className="flex-1 text-left min-w-0">
                    <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-purple-500 block">VS 투표</span>
                        {isVoted && (
                            <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                                완료
                            </span>
                        )}
                    </div>
                    <p className="text-xs font-medium text-slate-600 truncate">{poll.optionA.text} vs {poll.optionB.text}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-purple-500 transition-colors flex-shrink-0" />
            </button>
        );
    }

    // 펼쳐진 상태
    return (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-3 border border-purple-100">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-purple-500" />
                    <span className="text-xs font-bold text-purple-600">VS 투표</span>
                    {isVoted && (
                        <span className="text-[9px] font-bold bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                            완료
                        </span>
                    )}
                </div>
                <button onClick={onToggle} className="p-1 hover:bg-purple-100 rounded-lg transition-colors">
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
            </div>
            <p className="text-xs font-bold text-slate-700 mb-3 text-center">{poll.question}</p>

            <div className="flex gap-2">
                <button
                    onClick={() => handleVote('a')}
                    disabled={!!voted}
                    className={`flex-1 relative overflow-hidden rounded-lg border-2 transition-all ${
                        voted === 'a' ? 'border-purple-400 bg-purple-50' :
                        voted ? 'border-slate-200 bg-slate-50' :
                        'border-purple-200 bg-white hover:border-purple-300'
                    }`}
                >
                    <div className="p-2 text-center relative z-10">
                        <span className="text-xl block">{poll.optionA.emoji}</span>
                        <span className="text-[10px] font-bold text-slate-700">{poll.optionA.text}</span>
                        {voted && <div className="text-sm font-black text-purple-600">{results.a}%</div>}
                    </div>
                    {voted && (
                        <div className="absolute bottom-0 left-0 right-0 bg-purple-200/50 transition-all duration-500" style={{ height: `${results.a}%` }} />
                    )}
                </button>

                <div className="flex items-center">
                    <span className="text-[10px] font-black text-slate-400">VS</span>
                </div>

                <button
                    onClick={() => handleVote('b')}
                    disabled={!!voted}
                    className={`flex-1 relative overflow-hidden rounded-lg border-2 transition-all ${
                        voted === 'b' ? 'border-pink-400 bg-pink-50' :
                        voted ? 'border-slate-200 bg-slate-50' :
                        'border-pink-200 bg-white hover:border-pink-300'
                    }`}
                >
                    <div className="p-2 text-center relative z-10">
                        <span className="text-xl block">{poll.optionB.emoji}</span>
                        <span className="text-[10px] font-bold text-slate-700">{poll.optionB.text}</span>
                        {voted && <div className="text-sm font-black text-pink-600">{results.b}%</div>}
                    </div>
                    {voted && (
                        <div className="absolute bottom-0 left-0 right-0 bg-pink-200/50 transition-all duration-500" style={{ height: `${results.b}%` }} />
                    )}
                </button>
            </div>

            {(voted || isVoted) && (
                <p className="text-center text-[10px] text-slate-400 mt-2">참여 완료!</p>
            )}
        </div>
    );
};

const Dashboard = ({ onStartTest, onProfileClick, onContentExplore }) => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [showDetailTests, setShowDetailTests] = useState(false);

    // 오늘의 퀴즈/투표 (클라이언트에서만 랜덤 선택)
    const [dailyQuiz, setDailyQuiz] = useState(null);
    const [dailyPoll, setDailyPoll] = useState(null);
    const [contentParticipation, setContentParticipation] = useState(() => contentParticipationService.getParticipation());

    // 퀴즈/투표 펼침 상태 (기본: 접힌 상태)
    const [quizExpanded, setQuizExpanded] = useState(false);
    const [pollExpanded, setPollExpanded] = useState(false);

    // 게이미피케이션 상태
    const [gameStats, setGameStats] = useState(null);
    const [currentLevel, setCurrentLevel] = useState(null);
    const [pointsToast, setPointsToast] = useState(null);
    const [showStreakBanner, setShowStreakBanner] = useState(true);

    useEffect(() => {
        // 클라이언트 사이드에서만 랜덤 선택 (hydration mismatch 방지)
        /* eslint-disable react-hooks/set-state-in-effect */
        const currentParticipation = contentParticipationService.getParticipation();
        setContentParticipation(currentParticipation);

        const unansweredQuizzes = ALL_KNOWLEDGE_QUIZZES.filter(q => !currentParticipation.quizzes.some(p => p.quizId === q.id));
        const unvotedPolls = VS_POLLS.filter(p => !currentParticipation.polls.some(v => v.pollId === p.id));

        const nextQuiz = unansweredQuizzes.length > 0
            ? unansweredQuizzes[Math.floor(Math.random() * unansweredQuizzes.length)]
            : getRandomQuiz();

        const nextPoll = unvotedPolls.length > 0
            ? unvotedPolls[Math.floor(Math.random() * unvotedPolls.length)]
            : getRandomPoll();

        setDailyQuiz(nextQuiz);
        setDailyPoll(nextPoll);

        // 게이미피케이션 초기화 및 방문 기록
        const stats = gamificationService.getStats();
        setGameStats(stats);
        setCurrentLevel(gamificationService.getLevel());

        // 일일 방문 포인트
        const visitResult = gamificationService.recordVisit();
        if (visitResult.streakUpdated && visitResult.points > 0) {
            setPointsToast({ points: visitResult.points, message: '오늘도 방문!' });
            setGameStats(gamificationService.getStats());
        }
        /* eslint-enable react-hooks/set-state-in-effect */
    }, []);

    // 퀴즈 정답 처리
    const handleQuizAnswer = (optionId) => {
        if (!dailyQuiz) return;
        const isCorrect = dailyQuiz.options.find(o => o.id === optionId)?.isCorrect;
        const result = gamificationService.recordQuizAnswer(isCorrect, dailyQuiz.category);
        setPointsToast({ points: result.points, message: isCorrect ? '정답!' : '참여 완료' });
        setGameStats(gamificationService.getStats());
        setCurrentLevel(gamificationService.getLevel());
    };

    // 투표 참여 처리
    const handlePollVote = (_choice) => {
        const result = gamificationService.recordPollVote();
        setPointsToast({ points: result.points, message: '투표 완료!' });
        setGameStats(gamificationService.getStats());
        setCurrentLevel(gamificationService.getLevel());
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

    // Filter tests by category
    const filteredTests = useMemo(() => {
        return allTests.filter(t => activeCategory === 'all' || TEST_CATEGORIES[t.key] === activeCategory);
    }, [allTests, activeCategory]);

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

            <div className="relative max-w-md md:max-w-2xl lg:max-w-4xl mx-auto w-full pb-8 px-4">
                {/* Header */}
                <Header onProfileClick={onProfileClick} />

                {/* 스트릭 배너 */}
                {showStreakBanner && gameStats && (
                    <StreakBanner
                        streak={gameStats.streak}
                        level={currentLevel}
                        points={gameStats.totalPoints}
                        onClose={() => setShowStreakBanner(false)}
                    />
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

                {/* All Tests - Single Grid */}
                <section className="animate-fade-in-up">
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

                    {/* Grid: 모바일 4열, PC 5-6열 */}
                    <div className="grid gap-1.5 grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
                        {filteredTests.map((item) => (
                            <CompactTestItem
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

                {/* 퀴즈/투표 섹션 - 전체 카테고리에서만 표시 (컴팩트) */}
                {activeCategory === 'all' && (dailyQuiz || dailyPoll) && (
                    <section className="mt-4 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
                        <div className="flex items-center justify-between mb-2 px-1">
                            <span className="text-xs font-bold text-slate-500">오늘의 참여</span>
                            {onContentExplore && (
                                <button
                                    onClick={onContentExplore}
                                    className="text-[10px] font-medium text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-0.5"
                                >
                                    더보기
                                    <ChevronRight className="w-3 h-3" />
                                </button>
                            )}
                        </div>
                        <div className="space-y-2">
                            {dailyQuiz && (
                                <DailyQuizCard
                                    quiz={dailyQuiz}
                                    onAnswer={handleQuizAnswer}
                                    isExpanded={quizExpanded}
                                    onToggle={() => setQuizExpanded(!quizExpanded)}
                                />
                            )}
                            {dailyPoll && (
                                <VSPollCard
                                    poll={dailyPoll}
                                    onVote={handlePollVote}
                                    isExpanded={pollExpanded}
                                    onToggle={() => setPollExpanded(!pollExpanded)}
                                />
                            )}
                        </div>
                    </section>
                )}

                {/* 세부 테스트 섹션 (접힘 가능) */}
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
