import React from 'react';
import * as Icons from './Icons';

const TestCard = ({ title, subtitle, icon, color, tags, onStart, testType }) => {
    // Determine gradient based on config color or default
    const getGradient = (baseColor) => {
        // Simple mapping or default to gray
        if (baseColor?.includes('purple')) return 'from-purple-50 to-indigo-50 border-purple-200 hover:border-purple-300';
        if (baseColor?.includes('yellow')) return 'from-yellow-50 to-orange-50 border-yellow-200 hover:border-yellow-300';
        if (baseColor?.includes('blue')) return 'from-blue-50 to-cyan-50 border-blue-200 hover:border-blue-300';
        if (baseColor?.includes('pink')) return 'from-pink-50 to-rose-50 border-pink-200 hover:border-pink-300';
        if (baseColor?.includes('green')) return 'from-green-50 to-emerald-50 border-green-200 hover:border-green-300';
        if (baseColor?.includes('amber')) return 'from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300';
        return 'from-gray-50 to-slate-50 border-gray-200 hover:border-gray-300';
    };

    const gradientClass = getGradient(color);

    // Get Icon Component
    const IconComponent = Icons[icon] || Icons.HumanIcon;

    return (
        <button
            onClick={onStart}
            className={`w-full text-left group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 bg-gradient-to-br ${gradientClass}`}
        >
            <div className="p-6 relative z-10">
                <div className="flex justify-between items-start mb-4">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                        {/* Use the Icon Component if available */}
                        <IconComponent mood="happy" className="w-10 h-10" />
                    </div>
                    {tags && tags.length > 0 && (
                        <div className="flex gap-1 flex-wrap justify-end max-w-[50%]">
                            {tags.map((tag, idx) => (
                                <span key={idx} className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-gray-500 border border-gray-100 shadow-sm">
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-1 group-hover:text-indigo-600 transition-colors">
                    {title}
                </h3>
                <p className="text-sm text-gray-500 line-clamp-2 min-h-[40px]">
                    {subtitle}
                </p>

                <div className="mt-4 flex items-center text-xs font-bold text-gray-400 group-hover:text-indigo-500 transition-colors">
                    <span>테스트 시작하기</span>
                    <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                </div>
            </div>

            {/* Background decoration */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/40 rounded-full blur-2xl group-hover:bg-white/60 transition-colors"></div>
        </button>
    );
};

export default TestCard;
