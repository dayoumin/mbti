'use client';

import React from 'react';
import * as Icons from './Icons';
import type { SubjectKey } from '../data/types';
import type { Mood } from './Icons';

interface TestCardProps {
    item: {
        key: string;
        label: string;
        title?: string;
        icon: string;
    };
    onStart?: (key: SubjectKey) => void;
    badge?: string;
}

const TestCard = ({ item, onStart, badge }: TestCardProps) => {
    // Type-safe icon lookup
    const iconMap: Record<string, React.FC<{ mood?: Mood; className?: string }>> = {
        HumanIcon: Icons.HumanIcon,
        CatFace: Icons.CatFace,
        DogFace: Icons.DogFace,
        RabbitFace: Icons.RabbitFace,
        HamsterFace: Icons.HamsterFace,
        HeartIcon: Icons.HeartIcon,
        PlantIcon: Icons.PlantIcon,
        PetMatchIcon: Icons.PetMatchIcon,
        CoffeeIcon: Icons.CoffeeIcon,
        ChefHatIcon: Icons.ChefHatIcon,
        WhiskeySampleIcon: Icons.WhiskeySampleIcon,
        TeaIcon: Icons.TeaIcon,
        ConflictIcon: Icons.ConflictIcon,
        FruitIcon: Icons.FruitIcon,
        AlcoholIcon: Icons.AlcoholIcon,
        BreadIcon: Icons.BreadIcon,
        PerfumeIcon: Icons.PerfumeIcon,
    };
    const IconComponent = iconMap[item.icon] || Icons.HumanIcon;

    return (
        <button
            onClick={() => onStart?.(item.key as SubjectKey)}
            className="glass-card rounded-md border-subtle shadow-sm hover:shadow-brand hover:border-brand transition-all duration-200 hover:-translate-y-1 relative"
        >
            {badge && (
                <span className={`absolute top-1 right-1 px-1.5 py-0.5 text-xs font-bold rounded-full shadow-sm z-10 ${badge === 'HOT' ? 'bg-gradient-warm' :
                    badge === 'NEW' ? 'bg-gradient-success' :
                        badge === 'UPDATE' ? 'bg-gradient-brand-primary' :
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
