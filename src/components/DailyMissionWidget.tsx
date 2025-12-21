'use client';

import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, Circle, Flame, Star, ChevronRight, Zap } from 'lucide-react';

interface Mission {
    id: string;
    label: string;
    targetCount: number;
    currentCount: number;
    points: number;
    type: 'test' | 'quiz' | 'poll' | 'post';
}

const INITIAL_MISSIONS: Mission[] = [
    { id: '1', label: '심리/매칭 테스트 참여', targetCount: 1, currentCount: 0, points: 50, type: 'test' },
    { id: '2', label: '오늘의 퀴즈 풀기', targetCount: 1, currentCount: 0, points: 20, type: 'quiz' },
    { id: '3', label: '커뮤니티 글쓰기 또는 댓글', targetCount: 2, currentCount: 0, points: 30, type: 'post' }
];

export default function DailyMissionWidget({ className = '' }: { className?: string }) {
    const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
    const [isExpanded, setIsExpanded] = useState(false);

    // Mock progress update for demo
    useEffect(() => {
        // In a real app, this would load from a mission service
    }, []);

    const completedCount = missions.filter(m => m.currentCount >= m.targetCount).length;
    const totalPoints = missions.reduce((acc, m) => acc + (m.currentCount >= m.targetCount ? m.points : 0), 0);
    const progressPercent = Math.round((completedCount / missions.length) * 100);

    return (
        <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all duration-300 ${className} ${isExpanded ? 'ring-2 ring-indigo-500/10' : ''}`}>
            {/* Header */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full p-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
                        <Target className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                        <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                            일일 미션
                            {completedCount === missions.length ? (
                                <span className="text-xs bg-emerald-500 text-white px-2 py-0.5 rounded-full font-bold animate-bounce">완료!</span>
                            ) : (
                                <span className="text-xs bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full font-bold">
                                    {completedCount}/{missions.length}
                                </span>
                            )}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                            <div className="w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-indigo-500 transition-all duration-500"
                                    style={{ width: `${progressPercent}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-slate-400">{progressPercent}%</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="text-right hidden sm:block">
                        <div className="flex items-center gap-1 justify-end">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black text-slate-700">{totalPoints}P</span>
                        </div>
                        <p className="text-xs text-slate-400 font-medium whitespace-nowrap">오늘 획득한 포인트</p>
                    </div>
                    <ChevronRight className={`w-5 h-5 text-slate-300 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                </div>
            </button>

            {/* Mission List */}
            {isExpanded && (
                <div className="px-4 pb-4 animate-slide-down">
                    <div className="bg-slate-50 rounded-xl p-3 space-y-2">
                        {missions.map(mission => {
                            const isDone = mission.currentCount >= mission.targetCount;
                            return (
                                <div key={mission.id} className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-slate-100 shadow-xs">
                                    <div className="flex items-center gap-3">
                                        {isDone ? (
                                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        ) : (
                                            <Circle className="w-4 h-4 text-slate-200" />
                                        )}
                                        <div className="flex flex-col">
                                            <span className={`text-xs font-bold ${isDone ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                                {mission.label}
                                            </span>
                                            <span className="text-xs text-slate-400">
                                                {mission.currentCount} / {mission.targetCount} 완료
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1 px-2 py-1 bg-amber-50 rounded-full border border-amber-100">
                                        <Star className="w-2.5 h-2.5 text-amber-600 fill-amber-600" />
                                        <span className="text-xs font-black text-amber-700">+{mission.points}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="mt-3 p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-between text-white shadow-md shadow-indigo-100">
                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-amber-300 fill-amber-300" />
                            <div className="flex flex-col">
                                <span className="text-xs font-black">7일 연속 미션 성공 중!</span>
                                <span className="text-xs opacity-80">보너스 100P 획득까지 2일 남음</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                            <span className="text-sm font-black">7🔥</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
