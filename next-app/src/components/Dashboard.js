import React, { useMemo, useState, useEffect } from 'react';
import * as Icons from './Icons';
import { SUBJECT_CONFIG, TEST_TYPES } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import { resultService } from '../services/ResultService';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

// Compact Test Item (아이콘 + 제목만)
const CompactTestItem = ({ item, onStart, isCompleted }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    return (
        <button
            onClick={() => onStart(item.key)}
            className="group flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/60 hover:bg-white border border-white/60 hover:border-indigo-200 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 relative"
        >
            {isCompleted && (
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
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
const FeaturedTestCard = ({ item, onStart, rank }) => {
    const IconComponent = Icons[item.icon] || Icons.HumanIcon;

    const gradients = [
        'from-indigo-500/10 to-purple-500/10 border-indigo-200 hover:border-indigo-300',
        'from-amber-500/10 to-orange-500/10 border-amber-200 hover:border-amber-300',
        'from-emerald-500/10 to-teal-500/10 border-emerald-200 hover:border-emerald-300',
    ];

    return (
        <button
            onClick={() => onStart(item.key)}
            className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${gradients[rank % 3]} p-4`}
        >
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

const Dashboard = ({ onStartTest }) => {
    const [completedTests, setCompletedTests] = useState([]);

    useEffect(() => {
        const loadCompleted = async () => {
            const completed = await resultService.getCompletedTests();
            setCompletedTests(completed);
        };
        loadCompleted();
    }, []);

    // Group configs by testType
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

    // Featured tests (인기 테스트 3개)
    const featuredKeys = ['human', 'dog', 'idealType'];
    const featuredTests = featuredKeys
        .map(key => groupedConfigs.personality?.find(t => t.key === key) || groupedConfigs.matching?.find(t => t.key === key))
        .filter(Boolean);

    // All tests excluding featured
    const allTests = [...(groupedConfigs.personality || []), ...(groupedConfigs.matching || [])]
        .filter(t => !featuredKeys.includes(t.key));

    const completedCount = completedTests.length;
    const totalCount = Object.keys(SUBJECT_CONFIG).length;

    return (
        <div className="max-w-md md:max-w-2xl lg:max-w-4xl mx-auto w-full pb-8">
            {/* Compact Hero */}
            <div className="mb-6 text-center animate-fade-in-up">
                <h1 className="text-2xl md:text-3xl font-black text-slate-800">
                    오늘의 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">테스트</span>
                </h1>
                {completedCount > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                        {completedCount}/{totalCount}개 완료
                    </p>
                )}
            </div>

            {/* PC: 2열 레이아웃 */}
            <div className="md:grid md:grid-cols-2 md:gap-6">
                {/* Featured Section */}
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
                            />
                        ))}
                    </div>
                </section>

                {/* All Tests - Bento Grid */}
                <section className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center gap-2 mb-3 px-1">
                        <span className="text-sm font-bold text-slate-700">모든 테스트</span>
                        <span className="text-[10px] font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {allTests.length + featuredTests.length}
                        </span>
                    </div>

                    {/* 모바일: 4열, PC: 3열 (Featured와 나란히 배치되므로) */}
                    <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-4 gap-2">
                        {allTests.map((item) => (
                            <CompactTestItem
                                key={item.key}
                                item={item}
                                onStart={onStartTest}
                                isCompleted={completedTests.includes(item.key)}
                            />
                        ))}
                    </div>
                </section>
            </div>

            {/* Footer */}
            <div className="mt-8 text-center text-slate-300 text-[10px]">
                <p>© 2025 Chemi Test Lab</p>
            </div>
        </div>
    );
};

export default Dashboard;
