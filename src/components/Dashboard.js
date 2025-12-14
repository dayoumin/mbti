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
const TEST_BADGES = {
    human: 'HOT',
    fruit: 'NEW',
    alcohol: 'NEW',
    bread: 'NEW'
};

// Compact Test Item (아이콘 + 제목 + 배지) - 더 작게
const CompactTestItem = ({ item, onStart, badge }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    return (
        <button
            onClick={() => onStart(item.key)}
            className="group flex flex-col items-center gap-1 p-1.5 rounded-lg bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-200 transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5 relative"
        >
            {badge && (
                <span className={`absolute -top-1 -right-1 px-1 py-0.5 text-[7px] font-bold rounded-full shadow-sm ${
                    badge === 'HOT' ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' :
                    badge === 'NEW' ? 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white' :
                    'bg-slate-200 text-slate-600'
                }`}>
                    {badge}
                </span>
            )}
            <div className="w-8 h-8 flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 rounded-md group-hover:scale-110 transition-transform duration-300">
                <IconComponent mood="happy" className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-600 group-hover:text-indigo-600 transition-colors text-center leading-tight">
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

// 스트릭 배너 컴포넌트 (5초 후 자동 사라짐)
const StreakBanner = ({ streak, level, points, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 5000); // 5초 후 자동 닫힘
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
    const [localSelectedOption, setLocalSelectedOption] = useState(null);
    const [localShowResult, setLocalShowResult] = useState(false);

    if (!quiz) return null;

    const selectedOption = previousAnswer ?? localSelectedOption;
    const showResult = isAnswered || localShowResult;

    const handleSelect = (optionId) => {
        if (showResult) return;
        setLocalSelectedOption(optionId);
        setLocalShowResult(true);
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
                        {showResult && (
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
                    {showResult && (
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
    const [localVoted, setLocalVoted] = useState(null);

    if (!poll) return null;

    const voted = previousVote ?? localVoted;
    const results = getStablePollResults(poll.id);

    const handleVote = (choice) => {
        if (voted) return;
        setLocalVoted(choice);
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
                        {(isVoted || voted) && (
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
                    {(isVoted || voted) && (
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
    // 2단계 필터 상태
    const [activeType, setActiveType] = useState('all');        // 1차: 심리/매칭
    const [activeSubject, setActiveSubject] = useState(null);   // 2차: 주제별 (null = 전체)
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

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleUpdated = () => {
            setContentParticipation(contentParticipationService.getParticipation());
        };

        window.addEventListener('chemi_content_participation_updated', handleUpdated);
        return () => window.removeEventListener('chemi_content_participation_updated', handleUpdated);
    }, []);

    // 퀴즈 정답 처리
    const handleQuizAnswer = (quizId, optionId, isCorrect) => {
        if (!quizId || !optionId) return;

        contentParticipationService.recordQuizAnswer(quizId, optionId, !!isCorrect);
        setContentParticipation(contentParticipationService.getParticipation());

        if (!dailyQuiz) return;
        const result = gamificationService.recordQuizAnswer(!!isCorrect, dailyQuiz.category);
        setPointsToast({ points: result.points, message: isCorrect ? '정답!' : '참여 완료' });
        setGameStats(gamificationService.getStats());
        setCurrentLevel(gamificationService.getLevel());
    };

    // 투표 참여 처리
    const handlePollVote = (pollId, choice) => {
        if (!pollId || !choice) return;

        contentParticipationService.recordPollVote(pollId, choice);
        setContentParticipation(contentParticipationService.getParticipation());

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

                {/* 오늘의 참여 섹션 - 상단 배치 */}
                {(dailyQuiz || dailyPoll) && (
                    <section className="mb-4 animate-fade-in-up">
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
                                    isAnswered={!!contentParticipation.quizzes.find(q => q.quizId === dailyQuiz.id)}
                                    previousAnswer={contentParticipation.quizzes.find(q => q.quizId === dailyQuiz.id)?.selectedOption}
                                />
                            )}
                            {dailyPoll && (
                                <VSPollCard
                                    poll={dailyPoll}
                                    onVote={handlePollVote}
                                    isExpanded={pollExpanded}
                                    onToggle={() => setPollExpanded(!pollExpanded)}
                                    isVoted={!!contentParticipation.polls.find(p => p.pollId === dailyPoll.id)}
                                    previousVote={contentParticipation.polls.find(p => p.pollId === dailyPoll.id)?.choice}
                                />
                            )}
                        </div>
                    </section>
                )}

                {/* 필터 영역 - sticky로 고정 */}
                <div className="sticky top-0 z-20 bg-[#F0F2F5]/95 backdrop-blur-sm -mx-4 px-4 pt-1 pb-2">
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

                    {/* 2차 필터: 작은 칩 스타일 */}
                    <div className="mt-2 overflow-x-auto no-scrollbar">
                        <div className="flex gap-1">
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
                <section className="animate-fade-in-up min-h-[200px]">

                    {/* Grid: 모바일 5열, PC 6-7열 */}
                    <div className="grid gap-1 grid-cols-5 md:grid-cols-6 lg:grid-cols-7">
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
