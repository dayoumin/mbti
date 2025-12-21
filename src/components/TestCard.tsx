'use client';

import React from 'react';
import * as Icons from './Icons';

interface TestCardProps {
    item: {
        key: string;
        label: string;
        title?: string;
        icon: string;
    };
    onStart: (key: string) => void;
    badge?: string;
}

const TestCard = ({ item, onStart, badge }: TestCardProps) => {
    const IconComponent = (Icons as any)[item.icon] || (Icons as any).HumanIcon;

    return (
        <button
            onClick={() => onStart(item.key)}
            className="group flex flex-col items-center gap-2 pt-4 pb-3 px-2 rounded-xl bg-white/80 hover:bg-white border border-white/60 hover:border-indigo-200 transition-all duration-200 hover:shadow-md hover:-translate-y-1 relative"
        >
            {badge && (
                <span className={`absolute top-1 right-1 px-1.5 py-0.5 text-xs font-bold rounded-full shadow-sm z-10 ${badge === 'HOT' ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-white' :
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
                {item.title || item.label}
            </span>
        </button>
    );
};

export default TestCard;
