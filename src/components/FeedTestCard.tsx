'use client';

import React from 'react';
import { getIconComponent } from '@/utils';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import { SubjectKey } from '../data/types';
import { ChevronRight, Users } from 'lucide-react';

interface FeedTestCardProps {
    testKey: SubjectKey;
    onStart: (key: SubjectKey) => void;
    className?: string;
}

export default function FeedTestCard({ testKey, onStart, className = '' }: FeedTestCardProps) {
    const config = SUBJECT_CONFIG[testKey];
    const data = CHEMI_DATA[testKey];

    if (!config || !data) return null;

    const IconComponent = getIconComponent(config.icon);

    return (
        <button
            onClick={() => onStart(testKey)}
            className={`w-full bg-white rounded-2xl p-4 border border-slate-100 hover:border-indigo-200 hover:shadow-lg transition-all group relative overflow-hidden text-left ${className}`}
        >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50/30 rounded-full blur-2xl -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500" />

            <div className="flex gap-3 relative z-10">
                <div className="w-14 h-14 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                    <IconComponent mood="happy" className="w-10 h-10" />
                </div>

                <div className="flex-1 flex flex-col justify-center min-w-0">
                    <div className="flex items-center gap-1.5 mb-1">
                        <span className="px-1.5 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full border border-indigo-100/50">
                            {config.testType === 'personality' ? '심리' : '매칭'}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                            <Users className="w-3 h-3" />
                            1.2k+
                        </div>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 leading-tight mb-0.5 group-hover:text-indigo-600 transition-colors truncate">
                        {data.title}
                    </h3>
                    <p className="text-xs text-slate-500 truncate">
                        {data.subtitle}
                    </p>
                </div>

                <div className="flex items-center justify-center flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        <ChevronRight className="w-4 h-4" />
                    </div>
                </div>
            </div>
        </button>
    );
}
