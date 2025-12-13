import React, { useMemo } from 'react';
import TestCard from './TestCard';
import { SUBJECT_CONFIG, TEST_TYPES } from '../data/config';
import { CHEMI_DATA } from '../data/index';

const Dashboard = ({ onStartTest }) => {
    // Group configs by testType
    const groupedConfigs = useMemo(() => {
        const groups = {};
        Object.entries(SUBJECT_CONFIG).forEach(([key, config]) => {
            const type = config.testType || 'personality';
            if (!groups[type]) groups[type] = [];

            // Get data for subtitle/description
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

    // Order of sections
    const sectionOrder = ['personality', 'matching'];

    return (
        <div className="max-w-4xl mx-auto w-full pb-20">
            {/* Hero Section */}
            <div className="mb-10 text-center space-y-4 animate-fade-in-up">
                <h1 className="text-3xl md:text-4xl font-black text-gray-800 leading-tight">
                    나를 알아가는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-pink-500">가장 쉬운 방법</span>
                </h1>
                <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto break-keep">
                    다양한 성격 테스트와 매칭 테스트를 통해 나 자신과 반려동물, 그리고 내 주변 사람들을 더 깊이 이해해보세요.
                </p>
            </div>

            {/* Categories */}
            <div className="space-y-12">
                {sectionOrder.map(typeKey => {
                    const typeInfo = TEST_TYPES[typeKey];
                    const items = groupedConfigs[typeKey] || [];

                    if (items.length === 0) return null;

                    return (
                        <section key={typeKey} className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                            <div className="flex items-center gap-2 mb-6 px-2">
                                <span className="text-2xl">{typeInfo.emoji}</span>
                                <h2 className="text-xl font-bold text-gray-800">{typeInfo.label}</h2>
                                <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                                    {items.length}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {items.map((item, idx) => (
                                    <TestCard
                                        key={item.key}
                                        title={item.title}
                                        subtitle={item.subtitle}
                                        icon={item.icon}
                                        color={item.color}
                                        tags={item.testType === 'matching' ? ['매칭', '궁합'] : ['성격', '심리']}
                                        onStart={() => onStartTest(item.key)}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}
            </div>

            {/* Footer / Additional Info */}
            <div className="mt-16 text-center text-gray-400 text-xs">
                <p>© 2025 Chemi Test Lab. All rights reserved.</p>
            </div>
        </div>
    );
};

export default Dashboard;
