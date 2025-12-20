'use client';

import React from 'react';
import { getIconComponent } from '@/utils';
import { SUBJECT_CONFIG } from '../data/config';
import { CHEMI_DATA } from '../data/index';
import { SubjectKey } from '../data/types';
import { ChevronRight, Sparkles, Users } from 'lucide-react';

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
            className={`w-full bg-white rounded-[2rem] p-6 border border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all group relative overflow-hidden text-left ${className}`}
        >
            {/* Decorative Background */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-500" />

            <div className="flex gap-5 relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <IconComponent mood="happy" className="w-14 h-14" />
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-1.5">
                        <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-full border border-indigo-100/50 uppercase tracking-wider">
                            {config.testType === 'personality' ? '심리' : '매칭'}
                        </span>
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 font-bold">
                            <Users className="w-3 h-3" />
                            1.2k+ 참여
                        </div>
                    </div>
                    <h3 className="text-xl font-black text-slate-800 leading-tight mb-1 group-hover:text-indigo-600 transition-colors">
                        {data.title}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium line-clamp-2 leading-relaxed">
                        {data.subtitle}
                    </p>
                </div>

                <div className="flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                    </div>
                </div>
            </div>

            {/* Quick Start Label (Bottom) */}
            <div className="mt-4 flex items-center gap-2 text-xs font-black text-indigo-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <Sparkles className="w-3 h-3" />
                지금 바로 시작하기
            </div>
        </button>
    );
}
