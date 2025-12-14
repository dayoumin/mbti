import React from 'react';
import { SUBJECT_CONFIG, TEST_TYPES } from '../data/config';
import * as Icons from './Icons';

export default function ModeTabs({ mode, onRestart }) {
    // testType별로 그룹핑
    const groupedTabs = {};
    Object.entries(SUBJECT_CONFIG).forEach(([key, cfg]) => {
        const type = cfg.testType || 'personality';
        if (!groupedTabs[type]) {
            groupedTabs[type] = [];
        }

        let IconComponent = Icons[cfg.icon];
        if (!IconComponent) {
            console.warn(`[CHEMI] 아이콘 누락: "${cfg.icon}". 기본 아이콘 사용.`);
            IconComponent = Icons.HumanIcon;
        }

        groupedTabs[type].push({
            key,
            label: cfg.label,
            Icon: IconComponent
        });
    });

    // testTypes 순서대로 렌더링
    const typeOrder = Object.keys(TEST_TYPES);

    return (
        <div className="w-full mb-6 space-y-3">
            {typeOrder.map((typeKey) => {
                const typeInfo = TEST_TYPES[typeKey];
                const tabs = groupedTabs[typeKey] || [];
                if (tabs.length === 0) return null;

                return (
                    <div key={typeKey}>
                        <div className="text-xs font-bold text-gray-500 mb-1 px-1">
                            {typeInfo.emoji} {typeInfo.label}
                        </div>
                        <div className="flex gap-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.key}
                                    onClick={() => onRestart(tab.key)}
                                    className={`flex-1 min-w-0 py-2 px-1 doodle-border transition-all ${mode === tab.key
                                        ? 'bg-gradient-to-br from-yellow-100 to-pink-100 scale-105'
                                        : 'bg-white hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.Icon mood="happy" className="w-8 h-8 mx-auto mb-1" />
                                    <div className="text-xs font-bold text-gray-800 truncate">{tab.label}</div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
