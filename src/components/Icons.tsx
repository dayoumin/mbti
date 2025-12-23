'use client';

import React from 'react';

export type Mood = 'happy' | 'cool' | 'sad' | 'excited' | 'calm';

export interface IconProps {
  className?: string;
  mood?: Mood;
}

interface ClickableIconProps {
  className?: string;
  onClick?: () => void;
}

export const ChevronDown = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

export const ChevronUp = ({ className }: IconProps) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
  </svg>
);

export const CloseIcon = ({ className, onClick }: ClickableIconProps) => (
  <svg onClick={onClick} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

export const BackIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

export const CatFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M20 30 Q 10 10 30 20 L 70 20 Q 90 10 80 30 L 80 70 Q 90 90 50 90 Q 10 90 20 70 Z" fill="white" stroke="#4A4A4A" strokeWidth="3" />
    {mood === "happy" && (
      <g>
        <circle cx="35" cy="45" r="3" fill="#4A4A4A" />
        <circle cx="65" cy="45" r="3" fill="#4A4A4A" />
        <path d="M45 55 Q 50 60 55 55" fill="none" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M25 50 L 10 50" stroke="#4A4A4A" strokeWidth="2" />
        <path d="M75 50 L 90 50" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="25" y="40" width="20" height="10" rx="2" fill="black" />
        <rect x="55" y="40" width="20" height="10" rx="2" fill="black" />
        <path d="M45 45 L 55 45" stroke="black" strokeWidth="2" />
        <path d="M45 60 Q 50 60 55 60" fill="none" stroke="#4A4A4A" strokeWidth="3" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <circle cx="35" cy="45" r="3" fill="#4A4A4A" />
        <circle cx="65" cy="45" r="3" fill="#4A4A4A" />
        <path d="M45 65 Q 50 60 55 65" fill="none" stroke="#4A4A4A" strokeWidth="3" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="35" cy="45" r="5" fill="#4A4A4A" />
        <circle cx="65" cy="45" r="5" fill="#4A4A4A" />
        <path d="M45 55 Q 50 65 55 55" fill="none" stroke="#4A4A4A" strokeWidth="3" />
      </g>
    )}
  </svg>
);

export const DogFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M25 30 Q 50 10 75 30 L 75 70 Q 90 90 50 90 Q 10 90 25 70 Z" fill="#FFC95F" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M15 40 Q 25 25 35 40 L 35 40" fill="#FFC95F" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M85 40 Q 75 25 65 40 L 65 40" fill="#FFC95F" stroke="#4A4A4A" strokeWidth="3" />
    {mood === "happy" && (
      <g>
        <circle cx="40" cy="50" r="3" fill="#4A4A4A" />
        <circle cx="60" cy="50" r="3" fill="#4A4A4A" />
        <path d="M45 60 Q 50 65 55 60 Z" fill="#FF9999" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="40" cy="50" r="4" fill="#4A4A4A" />
        <circle cx="60" cy="50" r="4" fill="#4A4A4A" />
        <path d="M40 60 Q 50 70 60 60 Z" fill="#FF9999" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="30" y="45" width="10" height="5" rx="1" fill="#4A4A4A" />
        <rect x="60" y="45" width="10" height="5" rx="1" fill="#4A4A4A" />
        <path d="M45 65 Q 50 65 55 65" fill="none" stroke="#4A4A4A" strokeWidth="3" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <circle cx="40" cy="50" r="3" fill="#4A4A4A" />
        <circle cx="60" cy="50" r="3" fill="#4A4A4A" />
        <path d="M40 65 Q 50 60 60 65 Z" fill="#FF9999" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

export const HumanIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="50" cy="30" r="15" fill="#FFD1DC" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M30 45 L 70 45 L 70 85 Q 50 95 30 85 Z" fill="#BDE0FE" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M30 50 L 20 60 M70 50 L 80 60" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
    {mood === "happy" && (
      <g>
        <circle cx="45" cy="30" r="2" fill="#4A4A4A" />
        <circle cx="55" cy="30" r="2" fill="#4A4A4A" />
        <path d="M45 35 Q 50 38 55 35" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

export const RabbitFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <ellipse cx="35" cy="20" rx="8" ry="20" fill="white" stroke="#4A4A4A" strokeWidth="3" />
    <ellipse cx="65" cy="20" rx="8" ry="20" fill="white" stroke="#4A4A4A" strokeWidth="3" />
    <ellipse cx="35" cy="20" rx="4" ry="12" fill="#FFB6C1" />
    <ellipse cx="65" cy="20" rx="4" ry="12" fill="#FFB6C1" />
    <ellipse cx="50" cy="60" rx="30" ry="25" fill="white" stroke="#4A4A4A" strokeWidth="3" />
    {mood === "happy" && (
      <g>
        <circle cx="40" cy="55" r="3" fill="#4A4A4A" />
        <circle cx="60" cy="55" r="3" fill="#4A4A4A" />
        <ellipse cx="50" cy="68" rx="5" ry="3" fill="#FFB6C1" />
        <path d="M45 70 Q 50 75 55 70" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="40" cy="55" r="4" fill="#4A4A4A" />
        <circle cx="60" cy="55" r="4" fill="#4A4A4A" />
        <ellipse cx="50" cy="68" rx="6" ry="4" fill="#FFB6C1" />
        <path d="M43 70 Q 50 78 57 70" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="32" y="52" width="15" height="6" rx="2" fill="black" />
        <rect x="53" y="52" width="15" height="6" rx="2" fill="black" />
        <ellipse cx="50" cy="68" rx="5" ry="3" fill="#FFB6C1" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <circle cx="40" cy="55" r="3" fill="#4A4A4A" />
        <circle cx="60" cy="55" r="3" fill="#4A4A4A" />
        <ellipse cx="50" cy="68" rx="5" ry="3" fill="#FFB6C1" />
        <path d="M45 73 Q 50 70 55 73" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

export const HamsterFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <circle cx="25" cy="30" r="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
    <circle cx="75" cy="30" r="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
    <circle cx="25" cy="30" r="6" fill="#FFB6C1" />
    <circle cx="75" cy="30" r="6" fill="#FFB6C1" />
    <ellipse cx="50" cy="55" rx="35" ry="30" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
    <ellipse cx="25" cy="60" rx="12" ry="10" fill="#FFDAB9" stroke="#4A4A4A" strokeWidth="2" />
    <ellipse cx="75" cy="60" rx="12" ry="10" fill="#FFDAB9" stroke="#4A4A4A" strokeWidth="2" />
    {mood === "happy" && (
      <g>
        <circle cx="40" cy="50" r="3" fill="#4A4A4A" />
        <circle cx="60" cy="50" r="3" fill="#4A4A4A" />
        <ellipse cx="50" cy="62" rx="4" ry="3" fill="#FF9999" />
        <path d="M46 65 Q 50 68 54 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="40" cy="50" r="4" fill="#4A4A4A" />
        <circle cx="60" cy="50" r="4" fill="#4A4A4A" />
        <ellipse cx="50" cy="62" rx="5" ry="4" fill="#FF9999" />
        <path d="M44 65 Q 50 72 56 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="32" y="47" width="15" height="6" rx="2" fill="black" />
        <rect x="53" y="47" width="15" height="6" rx="2" fill="black" />
        <ellipse cx="50" cy="62" rx="4" ry="3" fill="#FF9999" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <circle cx="40" cy="50" r="3" fill="#4A4A4A" />
        <circle cx="60" cy="50" r="3" fill="#4A4A4A" />
        <ellipse cx="50" cy="62" rx="4" ry="3" fill="#FF9999" />
        <path d="M46 68 Q 50 65 54 68" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

export const Capsule = () => (
  <svg viewBox="0 0 100 100" className="w-40 h-40 mx-auto">
    <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M5 50 L 95 50" stroke="#4A4A4A" strokeWidth="3" />
    <circle cx="50" cy="50" r="10" fill="white" stroke="#4A4A4A" strokeWidth="2" />
  </svg>
);

export const HeartIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M50 85 L20 55 Q5 40 20 25 Q35 10 50 30 Q65 10 80 25 Q95 40 80 55 Z" fill="#FF6B9D" stroke="#4A4A4A" strokeWidth="3" />
    {mood === "happy" && (
      <g>
        <circle cx="35" cy="45" r="3" fill="white" />
        <circle cx="65" cy="45" r="3" fill="white" />
        <path d="M40 55 Q 50 65 60 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="35" cy="45" r="4" fill="white" />
        <circle cx="65" cy="45" r="4" fill="white" />
        <path d="M35 55 Q 50 70 65 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        <path d="M15 20 L20 25 M25 15 L20 25 M15 30 L20 25" stroke="#FFD700" strokeWidth="2" />
        <path d="M85 20 L80 25 M75 15 L80 25 M85 30 L80 25" stroke="#FFD700" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="27" y="42" width="15" height="6" rx="2" fill="white" />
        <rect x="58" y="42" width="15" height="6" rx="2" fill="white" />
        <path d="M45 58 Q 50 58 55 58" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <circle cx="35" cy="45" r="3" fill="white" />
        <circle cx="65" cy="45" r="3" fill="white" />
        <path d="M40 60 Q 50 52 60 60" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

export const PlantIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M30 65 L35 90 L65 90 L70 65 Z" fill="#D2691E" stroke="#4A4A4A" strokeWidth="3" />
    <rect x="28" y="60" width="44" height="8" rx="2" fill="#CD853F" stroke="#4A4A4A" strokeWidth="2" />
    <ellipse cx="50" cy="62" rx="18" ry="4" fill="#8B4513" />
    {mood === "happy" && (
      <g>
        <ellipse cx="50" cy="35" rx="12" ry="20" fill="#228B22" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="35" cy="45" rx="10" ry="15" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(-30 35 45)" />
        <ellipse cx="65" cy="45" rx="10" ry="15" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(30 65 45)" />
        <path d="M50 55 L50 35" stroke="#228B22" strokeWidth="3" />
        <circle cx="45" cy="32" r="2" fill="#4A4A4A" />
        <circle cx="55" cy="32" r="2" fill="#4A4A4A" />
        <path d="M46 38 Q 50 42 54 38" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <ellipse cx="50" cy="40" rx="10" ry="18" fill="#228B22" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="38" cy="48" rx="8" ry="12" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(-25 38 48)" />
        <ellipse cx="62" cy="48" rx="8" ry="12" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(25 62 48)" />
        <path d="M50 58 L50 40" stroke="#228B22" strokeWidth="3" />
        <circle cx="50" cy="18" r="8" fill="#FF69B4" stroke="#4A4A4A" strokeWidth="2" />
        <circle cx="50" cy="18" r="4" fill="#FFD700" />
        <circle cx="46" cy="38" r="2" fill="#4A4A4A" />
        <circle cx="54" cy="38" r="2" fill="#4A4A4A" />
        <path d="M44 44 Q 50 50 56 44" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <ellipse cx="50" cy="40" rx="12" ry="22" fill="#228B22" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="35" cy="45" rx="6" ry="10" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="65" cy="42" rx="6" ry="12" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" />
        <rect x="40" y="32" width="8" height="5" rx="1" fill="black" />
        <rect x="52" y="32" width="8" height="5" rx="1" fill="black" />
        <path d="M48 34 L52 34" stroke="black" strokeWidth="1" />
        <path d="M46 42 Q 50 42 54 42" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <ellipse cx="50" cy="40" rx="10" ry="16" fill="#9ACD32" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="38" cy="50" rx="8" ry="10" fill="#BDB76B" stroke="#4A4A4A" strokeWidth="2" transform="rotate(-40 38 50)" />
        <ellipse cx="62" cy="50" rx="8" ry="10" fill="#BDB76B" stroke="#4A4A4A" strokeWidth="2" transform="rotate(40 62 50)" />
        <path d="M50 58 L50 42" stroke="#9ACD32" strokeWidth="3" />
        <circle cx="46" cy="38" r="2" fill="#4A4A4A" />
        <circle cx="54" cy="38" r="2" fill="#4A4A4A" />
        <path d="M46 46 Q 50 42 54 46" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

export const PetMatchIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <ellipse cx="50" cy="60" rx="20" ry="18" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
    <ellipse cx="30" cy="40" rx="10" ry="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="2" />
    <ellipse cx="50" cy="32" rx="10" ry="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="2" />
    <ellipse cx="70" cy="40" rx="10" ry="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="2" />
    {mood === "happy" && (
      <g>
        <circle cx="43" cy="55" r="2" fill="#4A4A4A" />
        <circle cx="57" cy="55" r="2" fill="#4A4A4A" />
        <path d="M46 62 Q 50 66 54 62" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="43" cy="55" r="3" fill="#4A4A4A" />
        <circle cx="57" cy="55" r="3" fill="#4A4A4A" />
        <path d="M44 62 Q 50 70 56 62" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        <path d="M20 25 L25 30 M30 20 L25 30 M20 35 L25 30" stroke="#FFD700" strokeWidth="2" />
        <path d="M80 25 L75 30 M70 20 L75 30 M80 35 L75 30" stroke="#FFD700" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="36" y="52" width="10" height="5" rx="1" fill="black" />
        <rect x="54" y="52" width="10" height="5" rx="1" fill="black" />
        <path d="M46 65 Q 50 65 54 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <circle cx="43" cy="55" r="2" fill="#4A4A4A" />
        <circle cx="57" cy="55" r="2" fill="#4A4A4A" />
        <path d="M46 65 Q 50 62 54 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

export const CoffeeIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    <path d="M25 35 L30 85 L70 85 L75 35 Z" fill="white" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M28 45 L32 80 L68 80 L72 45 Z" fill="#6F4E37" />
    <path d="M75 45 Q 90 45 90 60 Q 90 75 75 75" fill="none" stroke="#4A4A4A" strokeWidth="3" />
    {mood === "happy" && (
      <g>
        <path d="M35 25 Q 38 15 35 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 25 Q 53 15 50 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 25 Q 68 15 65 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <circle cx="42" cy="58" r="3" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="3" fill="#4A4A4A" />
        <path d="M45 68 Q 50 73 55 68" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <path d="M32 28 Q 36 15 32 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <path d="M44 28 Q 48 15 44 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <path d="M56 28 Q 60 15 56 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <path d="M68 28 Q 72 15 68 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <circle cx="42" cy="58" r="4" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="4" fill="#4A4A4A" />
        <path d="M43 68 Q 50 78 57 68" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <path d="M50 25 Q 53 15 50 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <rect x="34" y="54" width="12" height="6" rx="2" fill="black" />
        <rect x="54" y="54" width="12" height="6" rx="2" fill="black" />
        <path d="M46 57 L54 57" stroke="black" strokeWidth="2" />
        <path d="M45 70 Q 50 70 55 70" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <path d="M50 28 Q 52 22 50 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <circle cx="42" cy="58" r="3" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="3" fill="#4A4A4A" />
        <path d="M45 72 Q 50 67 55 72" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 셰프 모자 아이콘 (food 테스트용)
export const ChefHatIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 접시 배경 */}
    <ellipse cx="50" cy="70" rx="35" ry="12" fill="#FED7AA" />
    <ellipse cx="50" cy="68" rx="32" ry="10" fill="#FFEDD5" />

    {/* 셰프 모자 */}
    <path d="M25 40 Q25 20 50 20 Q75 20 75 40 L75 50 L25 50 Z" fill="white" stroke="#E5E5E5" strokeWidth="1.5" />
    <ellipse cx="35" cy="25" rx="10" ry="8" fill="white" />
    <ellipse cx="50" cy="22" rx="10" ry="8" fill="white" />
    <ellipse cx="65" cy="25" rx="10" ry="8" fill="white" />
    <rect x="25" y="48" width="50" height="8" fill="white" stroke="#E5E5E5" strokeWidth="1.5" rx="2" />

    {/* 음식 (상태별 다른 음식) */}
    {mood === 'happy' && (
      <>
        {/* 밥그릇 */}
        <ellipse cx="50" cy="68" rx="18" ry="8" fill="#FEF3C7" />
        <path d="M32 68 Q32 80 50 80 Q68 80 68 68" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
        <ellipse cx="50" cy="68" rx="15" ry="6" fill="white" />
        {/* 밥알 */}
        <ellipse cx="45" cy="66" rx="3" ry="2" fill="#FEFCE8" stroke="#FDE68A" />
        <ellipse cx="55" cy="67" rx="3" ry="2" fill="#FEFCE8" stroke="#FDE68A" />
        <ellipse cx="50" cy="64" rx="3" ry="2" fill="#FEFCE8" stroke="#FDE68A" />
      </>
    )}
    {mood === 'cool' && (
      <>
        {/* 초밥 */}
        <rect x="38" y="62" width="24" height="12" rx="6" fill="#FED7AA" />
        <ellipse cx="50" cy="60" rx="10" ry="5" fill="#FB923C" />
        <path d="M42 58 L58 58" stroke="white" strokeWidth="1" strokeDasharray="2,2" />
      </>
    )}
    {mood === 'excited' && (
      <>
        {/* 떡볶이 */}
        <ellipse cx="50" cy="68" rx="18" ry="8" fill="#DC2626" />
        <path d="M40 65 Q42 62 44 65" stroke="#FCA5A5" strokeWidth="2" fill="none" />
        <path d="M48 64 Q50 61 52 64" stroke="#FCA5A5" strokeWidth="2" fill="none" />
        <path d="M56 65 Q58 62 60 65" stroke="#FCA5A5" strokeWidth="2" fill="none" />
        {/* 파 */}
        <ellipse cx="45" cy="66" rx="2" ry="1" fill="#22C55E" />
        <ellipse cx="55" cy="67" rx="2" ry="1" fill="#22C55E" />
      </>
    )}
    {(mood === 'sad' || !['happy', 'cool', 'excited'].includes(mood || '')) && (
      <>
        {/* 국밥 */}
        <ellipse cx="50" cy="68" rx="18" ry="8" fill="#FDE68A" />
        <path d="M32 68 Q32 80 50 80 Q68 80 68 68" fill="#FEF3C7" stroke="#F59E0B" strokeWidth="1" />
        {/* 김치 고명 */}
        <ellipse cx="45" cy="66" rx="4" ry="2" fill="#EF4444" />
        <ellipse cx="55" cy="65" rx="3" ry="2" fill="#22C55E" />
        {/* 파 */}
        <path d="M48 64 L52 67" stroke="#22C55E" strokeWidth="1.5" />
      </>
    )}

    {/* 반짝이 */}
    <circle cx="30" cy="35" r="2" fill="#FCD34D" />
    <circle cx="70" cy="38" r="1.5" fill="#FCD34D" />
  </svg>
);

// 위스키 아이콘 (whiskeySample 테스트용)
export const WhiskeySampleIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 위스키 잔 */}
    <path d="M30 35 L35 85 L65 85 L70 35 Z" fill="none" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M30 35 L70 35" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
    {/* 위스키 액체 */}
    <path d="M33 50 L36 80 L64 80 L67 50 Z" fill="#D97706" opacity="0.8" />
    {/* 얼음 (큐브 형태) */}
    <rect x="40" y="55" width="10" height="10" rx="2" fill="white" opacity="0.6" stroke="#CBD5E1" strokeWidth="1" />
    <rect x="52" y="60" width="8" height="8" rx="2" fill="white" opacity="0.5" stroke="#CBD5E1" strokeWidth="1" />
    {/* 기포/반짝임 */}
    <circle cx="45" cy="70" r="1.5" fill="white" opacity="0.4" />
    <circle cx="55" cy="68" r="1" fill="white" opacity="0.4" />
    {mood === "happy" && (
      <g>
        <circle cx="42" cy="58" r="2" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="2" fill="#4A4A4A" />
        <path d="M45 65 Q 50 70 55 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="42" cy="58" r="3" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="3" fill="#4A4A4A" />
        <path d="M43 65 Q 50 75 57 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        {/* 반짝이 */}
        <path d="M20 30 L25 35 M30 25 L25 35 M20 40 L25 35" stroke="#FFD700" strokeWidth="2" />
        <path d="M80 30 L75 35 M70 25 L75 35 M80 40 L75 35" stroke="#FFD700" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="35" y="55" width="10" height="5" rx="2" fill="black" />
        <rect x="55" y="55" width="10" height="5" rx="2" fill="black" />
        <path d="M47 58 L53 58" stroke="black" strokeWidth="2" />
        <path d="M45 68 Q 50 68 55 68" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "calm" && (
      <g>
        <circle cx="42" cy="58" r="2" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="2" fill="#4A4A4A" />
        <path d="M45 66 Q 50 68 55 66" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 차 아이콘 (tea 테스트용)
export const TeaIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 찻잔 */}
    <path d="M20 40 L25 80 L75 80 L80 40 Z" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="3" />
    {/* 차 */}
    <path d="M23 50 L27 75 L73 75 L77 50 Z" fill="#90EE90" opacity="0.6" />
    {/* 손잡이 */}
    <path d="M80 50 Q 95 50 95 62 Q 95 74 80 74" fill="none" stroke="#4A4A4A" strokeWidth="3" />
    {/* 받침대 */}
    <ellipse cx="50" cy="85" rx="30" ry="5" fill="#DEB887" stroke="#4A4A4A" strokeWidth="2" />
    {mood === "happy" && (
      <g>
        {/* 증기 */}
        <path d="M35 35 Q38 25 35 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <path d="M50 32 Q53 22 50 12" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        <path d="M65 35 Q68 25 65 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
        {/* 찻잎 */}
        <ellipse cx="40" cy="58" rx="4" ry="2" fill="#228B22" opacity="0.6" />
        <ellipse cx="55" cy="62" rx="3" ry="1.5" fill="#228B22" opacity="0.6" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <path d="M30 35 Q34 22 30 8" fill="none" stroke="#A9A9A9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M45 32 Q49 18 45 5" fill="none" stroke="#A9A9A9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M60 32 Q64 18 60 5" fill="none" stroke="#A9A9A9" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M75 35 Q79 22 75 8" fill="none" stroke="#A9A9A9" strokeWidth="2.5" strokeLinecap="round" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <path d="M50 35 Q53 25 50 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
      </g>
    )}
  </svg>
);

// 갈등 대처 아이콘 (conflictStyle 테스트용)
export const ConflictIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 두 사람 */}
    <circle cx="30" cy="35" r="12" fill="#FFB6C1" stroke="#4A4A4A" strokeWidth="2" />
    <path d="M18 50 L42 50 L42 75 Q30 85 18 75 Z" fill="#87CEEB" stroke="#4A4A4A" strokeWidth="2" />
    <circle cx="70" cy="35" r="12" fill="#98FB98" stroke="#4A4A4A" strokeWidth="2" />
    <path d="M58 50 L82 50 L82 75 Q70 85 58 75 Z" fill="#DDA0DD" stroke="#4A4A4A" strokeWidth="2" />
    {mood === "happy" && (
      <g>
        {/* 악수/하트 */}
        <path d="M42 62 L58 62" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        <circle cx="50" cy="62" r="5" fill="#FF6B9D" />
        {/* 웃는 표정 */}
        <circle cx="27" cy="33" r="2" fill="#4A4A4A" />
        <circle cx="33" cy="33" r="2" fill="#4A4A4A" />
        <path d="M25 38 Q30 42 35 38" fill="none" stroke="#4A4A4A" strokeWidth="1.5" />
        <circle cx="67" cy="33" r="2" fill="#4A4A4A" />
        <circle cx="73" cy="33" r="2" fill="#4A4A4A" />
        <path d="M65 38 Q70 42 75 38" fill="none" stroke="#4A4A4A" strokeWidth="1.5" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <path d="M42 62 L58 62" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        <rect x="23" cy="30" width="10" height="4" rx="1" fill="black" />
        <rect x="63" cy="30" width="10" height="4" rx="1" fill="black" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        <path d="M42 65 L46 62 M54 62 L58 65" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" />
        <circle cx="27" cy="33" r="2" fill="#4A4A4A" />
        <circle cx="33" cy="33" r="2" fill="#4A4A4A" />
        <path d="M25 40 Q30 37 35 40" fill="none" stroke="#4A4A4A" strokeWidth="1.5" />
      </g>
    )}
  </svg>
);

// 과일 아이콘 (fruit 테스트용)
export const FruitIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 사과 */}
    <ellipse cx="50" cy="55" rx="28" ry="30" fill="#FF6B6B" stroke="#4A4A4A" strokeWidth="3" />
    <ellipse cx="40" cy="50" rx="8" ry="12" fill="#FF8787" opacity="0.5" />
    {/* 꼭지 */}
    <path d="M50 25 Q55 20 52 15" fill="none" stroke="#8B4513" strokeWidth="3" strokeLinecap="round" />
    {/* 잎 */}
    <ellipse cx="58" cy="22" rx="8" ry="5" fill="#22C55E" transform="rotate(30 58 22)" />
    {mood === "happy" && (
      <g>
        <circle cx="42" cy="50" r="3" fill="#4A4A4A" />
        <circle cx="58" cy="50" r="3" fill="#4A4A4A" />
        <path d="M45 60 Q50 66 55 60" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="42" cy="50" r="4" fill="#4A4A4A" />
        <circle cx="58" cy="50" r="4" fill="#4A4A4A" />
        <path d="M43 60 Q50 70 57 60" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        <path d="M20 35 L25 40 M30 30 L25 40" stroke="#FFD700" strokeWidth="2" />
        <path d="M80 35 L75 40 M70 30 L75 40" stroke="#FFD700" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="35" y="47" width="10" height="5" rx="2" fill="black" />
        <rect x="55" y="47" width="10" height="5" rx="2" fill="black" />
        <path d="M47 50 L53 50" stroke="black" strokeWidth="2" />
        <path d="M45 62 Q50 62 55 62" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 술 아이콘 (alcohol 테스트용)
export const AlcoholIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 맥주잔 */}
    <path d="M25 30 L25 80 L65 80 L65 30 Z" fill="#FCD34D" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M25 30 L65 30" stroke="#4A4A4A" strokeWidth="3" />
    {/* 맥주 거품 */}
    <ellipse cx="35" cy="28" rx="8" ry="6" fill="white" />
    <ellipse cx="50" cy="26" rx="10" ry="7" fill="white" />
    <ellipse cx="58" cy="30" rx="6" ry="5" fill="white" />
    {/* 손잡이 */}
    <path d="M65 40 Q 80 40 80 55 Q 80 70 65 70" fill="none" stroke="#4A4A4A" strokeWidth="3" />
    {/* 기포 */}
    <circle cx="35" cy="50" r="2" fill="white" opacity="0.6" />
    <circle cx="50" cy="60" r="3" fill="white" opacity="0.6" />
    <circle cx="40" cy="70" r="2" fill="white" opacity="0.6" />
    {mood === "happy" && (
      <g>
        <circle cx="38" cy="50" r="3" fill="#4A4A4A" />
        <circle cx="52" cy="50" r="3" fill="#4A4A4A" />
        <path d="M40 60 Q45 66 50 60" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="38" cy="50" r="4" fill="#4A4A4A" />
        <circle cx="52" cy="50" r="4" fill="#4A4A4A" />
        <path d="M38 60 Q45 70 52 60" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        <path d="M15 25 L20 30 M25 20 L20 30" stroke="#FFD700" strokeWidth="2" />
        <path d="M85 45 L80 50 M75 40 L80 50" stroke="#FFD700" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="32" y="47" width="10" height="5" rx="2" fill="black" />
        <rect x="48" y="47" width="10" height="5" rx="2" fill="black" />
        <path d="M43 50 L47 50" stroke="black" strokeWidth="2" />
        <path d="M40 62 Q45 62 50 62" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 빵 아이콘 (bread 테스트용)
export const BreadIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 크로아상 */}
    <path d="M15 60 Q30 40 50 50 Q70 40 85 60 Q70 75 50 65 Q30 75 15 60 Z" fill="#DEB887" stroke="#4A4A4A" strokeWidth="3" />
    {/* 크로아상 줄무늬 */}
    <path d="M25 55 Q35 48 45 55" fill="none" stroke="#CD853F" strokeWidth="2" />
    <path d="M40 52 Q50 45 60 52" fill="none" stroke="#CD853F" strokeWidth="2" />
    <path d="M55 55 Q65 48 75 55" fill="none" stroke="#CD853F" strokeWidth="2" />
    {/* 광택 */}
    <ellipse cx="35" cy="55" rx="5" ry="3" fill="#F5DEB3" opacity="0.5" />
    <ellipse cx="65" cy="55" rx="5" ry="3" fill="#F5DEB3" opacity="0.5" />
    {mood === "happy" && (
      <g>
        <circle cx="42" cy="58" r="2" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="2" fill="#4A4A4A" />
        <path d="M46 63 Q50 67 54 63" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="42" cy="58" r="3" fill="#4A4A4A" />
        <circle cx="58" cy="58" r="3" fill="#4A4A4A" />
        <path d="M44 63 Q50 70 56 63" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        <path d="M20 45 L25 50 M30 40 L25 50" stroke="#FFD700" strokeWidth="2" />
        <path d="M80 45 L75 50 M70 40 L75 50" stroke="#FFD700" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <rect x="36" y="55" width="10" height="5" rx="2" fill="black" />
        <rect x="54" y="55" width="10" height="5" rx="2" fill="black" />
        <path d="M47 58 L53 58" stroke="black" strokeWidth="2" />
        <path d="M46 65 Q50 65 54 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 향수 아이콘 (perfume 테스트용)
export const PerfumeIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 향수병 몸통 */}
    <path d="M30 40 L30 85 L70 85 L70 40 Z" fill="#E8D4F0" stroke="#4A4A4A" strokeWidth="3" />
    {/* 향수 액체 */}
    <path d="M32 50 L32 83 L68 83 L68 50 Z" fill="#DDA0DD" opacity="0.6" />
    {/* 병 목 */}
    <rect x="40" y="25" width="20" height="15" fill="#E8D4F0" stroke="#4A4A4A" strokeWidth="2" />
    {/* 뚜껑 */}
    <rect x="42" y="15" width="16" height="10" fill="#FFD700" stroke="#4A4A4A" strokeWidth="2" rx="2" />
    {/* 분사 노즐 */}
    <rect x="48" y="10" width="4" height="5" fill="#C0C0C0" />
    {mood === "happy" && (
      <g>
        {/* 향기 입자 */}
        <circle cx="25" cy="35" r="3" fill="#FFB6C1" opacity="0.6" />
        <circle cx="75" cy="30" r="2" fill="#FFB6C1" opacity="0.6" />
        <circle cx="20" cy="25" r="2" fill="#DDA0DD" opacity="0.6" />
        <circle cx="80" cy="40" r="2.5" fill="#DDA0DD" opacity="0.6" />
        <circle cx="42" cy="60" r="3" fill="#4A4A4A" />
        <circle cx="58" cy="60" r="3" fill="#4A4A4A" />
        <path d="M46 70 Q50 75 54 70" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <circle cx="20" cy="30" r="4" fill="#FFB6C1" opacity="0.7" />
        <circle cx="80" cy="25" r="3" fill="#FFB6C1" opacity="0.7" />
        <circle cx="15" cy="20" r="3" fill="#DDA0DD" opacity="0.7" />
        <circle cx="85" cy="35" r="3.5" fill="#DDA0DD" opacity="0.7" />
        <circle cx="25" cy="45" r="2" fill="#E6E6FA" opacity="0.7" />
        <circle cx="42" cy="60" r="4" fill="#4A4A4A" />
        <circle cx="58" cy="60" r="4" fill="#4A4A4A" />
        <path d="M44 70 Q50 80 56 70" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <circle cx="25" cy="35" r="2" fill="#FFB6C1" opacity="0.5" />
        <circle cx="75" cy="30" r="2" fill="#FFB6C1" opacity="0.5" />
        <rect x="36" y="57" width="10" height="5" rx="2" fill="black" />
        <rect x="54" y="57" width="10" height="5" rx="2" fill="black" />
        <path d="M47 60 L53 60" stroke="black" strokeWidth="2" />
        <path d="M46 72 Q50 72 54 72" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 아로마 아이콘 (aroma 테스트용)
export const AromaIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 디퓨저 병 */}
    <path d="M35 45 L35 85 L65 85 L65 45 Z" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="3" />
    {/* 오일 */}
    <path d="M37 55 L37 83 L63 83 L63 55 Z" fill="#9ACD32" opacity="0.5" />
    {/* 병 목 */}
    <rect x="42" y="35" width="16" height="10" fill="#F5F5DC" stroke="#4A4A4A" strokeWidth="2" />
    {/* 리드 스틱들 */}
    <line x1="45" y1="35" x2="40" y2="10" stroke="#8B4513" strokeWidth="2" />
    <line x1="50" y1="35" x2="50" y2="8" stroke="#8B4513" strokeWidth="2" />
    <line x1="55" y1="35" x2="60" y2="10" stroke="#8B4513" strokeWidth="2" />
    {mood === "happy" && (
      <g>
        {/* 향기 파동 */}
        <path d="M30 25 Q35 20 30 15" fill="none" stroke="#90EE90" strokeWidth="2" opacity="0.6" />
        <path d="M50 20 Q55 15 50 10" fill="none" stroke="#90EE90" strokeWidth="2" opacity="0.6" />
        <path d="M70 25 Q65 20 70 15" fill="none" stroke="#90EE90" strokeWidth="2" opacity="0.6" />
        <circle cx="43" cy="65" r="3" fill="#4A4A4A" />
        <circle cx="57" cy="65" r="3" fill="#4A4A4A" />
        <path d="M46 73 Q50 78 54 73" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <path d="M25 28 Q32 20 25 12" fill="none" stroke="#90EE90" strokeWidth="2.5" opacity="0.7" />
        <path d="M45 22 Q52 14 45 6" fill="none" stroke="#90EE90" strokeWidth="2.5" opacity="0.7" />
        <path d="M55 22 Q48 14 55 6" fill="none" stroke="#90EE90" strokeWidth="2.5" opacity="0.7" />
        <path d="M75 28 Q68 20 75 12" fill="none" stroke="#90EE90" strokeWidth="2.5" opacity="0.7" />
        <circle cx="43" cy="65" r="4" fill="#4A4A4A" />
        <circle cx="57" cy="65" r="4" fill="#4A4A4A" />
        <path d="M44 73 Q50 82 56 73" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <path d="M50 20 Q55 15 50 10" fill="none" stroke="#90EE90" strokeWidth="2" opacity="0.5" />
        <rect x="37" y="62" width="10" height="5" rx="2" fill="black" />
        <rect x="53" y="62" width="10" height="5" rx="2" fill="black" />
        <path d="M48 65 L52 65" stroke="black" strokeWidth="2" />
        <path d="M46 75 Q50 75 54 75" fill="none" stroke="#4A4A4A" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 음주 유형 아이콘 (drinkingStyle 테스트용)
export const DrinkingStyleIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 맥주잔 */}
    <path
      d="M35 30 L40 70 Q40 80 50 80 Q60 80 60 70 L65 30 Z"
      fill="#FFC107"
      stroke="#4A4A4A"
      strokeWidth="2.5"
    />
    {/* 거품 */}
    <ellipse cx="50" cy="28" rx="15" ry="8" fill="#FAFAFA" opacity="0.9" />
    <circle cx="45" cy="24" r="4" fill="white" opacity="0.8" />
    <circle cx="55" cy="26" r="3" fill="white" opacity="0.8" />
    <circle cx="50" cy="22" r="3" fill="white" opacity="0.8" />
    {/* 손잡이 */}
    <path
      d="M65 40 Q 75 40 75 50 Q 75 60 65 60"
      fill="none"
      stroke="#4A4A4A"
      strokeWidth="2.5"
    />
    {/* 기포 */}
    <circle cx="48" cy="60" r="2" fill="#FFD54F" opacity="0.6" />
    <circle cx="52" cy="50" r="1.5" fill="#FFD54F" opacity="0.6" />
    <circle cx="46" cy="45" r="1.5" fill="#FFD54F" opacity="0.6" />

    {mood === "happy" && (
      <>
        {/* 반짝임 효과 */}
        <circle cx="42" cy="55" r="1.5" fill="white" opacity="0.8" />
        <circle cx="56" cy="65" r="1" fill="white" opacity="0.8" />
      </>
    )}
    {mood === "excited" && (
      <>
        {/* 더 많은 거품과 기포 */}
        <circle cx="40" cy="35" r="2" fill="white" opacity="0.9" />
        <circle cx="60" cy="33" r="2" fill="white" opacity="0.9" />
        <circle cx="50" cy="55" r="2" fill="#FFD54F" opacity="0.7" />
      </>
    )}
    {mood === "calm" && (
      <>
        {/* 차분한 거품 */}
        <ellipse cx="50" cy="28" rx="12" ry="6" fill="#F5F5F5" opacity="0.7" />
      </>
    )}
  </svg>
);

// 소비 성향 아이콘 (spendingStyle 테스트용)
export const SpendingStyleIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 지갑 */}
    <path d="M20 35 L80 35 L80 75 Q80 85 70 85 L30 85 Q20 85 20 75 Z" fill="#4B5563" stroke="#1F2937" strokeWidth="3" />
    {/* 지갑 플랩 */}
    <path d="M20 35 Q20 25 30 25 L70 25 Q80 25 80 35" fill="#6B7280" stroke="#1F2937" strokeWidth="3" />
    {/* 카드 슬롯 */}
    <rect x="30" y="45" width="40" height="6" fill="#374151" rx="1" />
    <rect x="30" y="55" width="40" height="6" fill="#374151" rx="1" />
    {/* 동전/지폐 */}
    {mood === "happy" && (
      <g>
        {/* 동전들 */}
        <circle cx="35" cy="68" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <circle cx="50" cy="70" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <circle cx="65" cy="68" r="6" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        {/* 달러 사인 */}
        <text x="47" y="73" fontSize="8" fill="#D97706" fontWeight="bold">$</text>
      </g>
    )}
    {mood === "excited" && (
      <g>
        {/* 넘치는 돈 */}
        <circle cx="30" cy="65" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <circle cx="45" cy="68" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <circle cx="55" cy="68" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <circle cx="70" cy="65" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        {/* 지폐 */}
        <rect x="35" y="72" width="30" height="10" fill="#10B981" stroke="#059669" strokeWidth="1" rx="1" />
        {/* 반짝이 */}
        <path d="M15 30 L20 35 M25 25 L20 35 M15 40 L20 35" stroke="#FCD34D" strokeWidth="2" />
        <path d="M85 30 L80 35 M75 25 L80 35 M85 40 L80 35" stroke="#FCD34D" strokeWidth="2" />
      </g>
    )}
    {mood === "sad" && (
      <g>
        {/* 거의 빈 지갑 */}
        <circle cx="50" cy="70" r="4" fill="#9CA3AF" stroke="#6B7280" strokeWidth="1" opacity="0.6" />
        {/* 파리 */}
        <circle cx="40" cy="60" r="1.5" fill="#374151" />
        <ellipse cx="38" cy="60" rx="3" ry="1" fill="none" stroke="#374151" strokeWidth="0.5" />
        <ellipse cx="42" cy="60" rx="3" ry="1" fill="none" stroke="#374151" strokeWidth="0.5" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        {/* 카드 */}
        <rect x="35" y="65" width="30" height="15" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="2" rx="2" />
        <rect x="38" y="68" width="8" height="6" fill="#FCD34D" rx="1" />
        <line x1="38" y1="77" x2="62" y2="77" stroke="#93C5FD" strokeWidth="1" />
        {/* 선글라스 */}
        <rect x="25" y="40" width="10" height="5" rx="2" fill="black" />
        <rect x="65" y="40" width="10" height="5" rx="2" fill="black" />
        <path d="M35 42 L65 42" stroke="black" strokeWidth="2" />
      </g>
    )}
    {(mood === "calm" || !['happy', 'excited', 'sad', 'cool'].includes(mood || '')) && (
      <g>
        {/* 정리된 동전 */}
        <circle cx="40" cy="68" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
        <circle cx="60" cy="68" r="5" fill="#F59E0B" stroke="#D97706" strokeWidth="2" />
      </g>
    )}
  </svg>
);

// 라면 아이콘 (ramen 테스트용)
export const RamenIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 그릇 */}
    <ellipse cx="50" cy="75" rx="40" ry="12" fill="#DC2626" stroke="#4A4A4A" strokeWidth="3" />
    <path d="M10 75 Q10 55 50 55 Q90 55 90 75" fill="#DC2626" stroke="#4A4A4A" strokeWidth="3" />
    {/* 국물 */}
    <ellipse cx="50" cy="60" rx="35" ry="10" fill="#EF4444" opacity="0.6" />
    {/* 면 */}
    <path d="M25 58 Q30 50 35 58 Q40 50 45 58" fill="none" stroke="#FEF3C7" strokeWidth="3" />
    <path d="M45 58 Q50 50 55 58 Q60 50 65 58" fill="none" stroke="#FEF3C7" strokeWidth="3" />
    <path d="M55 60 Q60 52 65 60 Q70 52 75 60" fill="none" stroke="#FEF3C7" strokeWidth="3" />
    {/* 계란 반숙 */}
    <ellipse cx="50" cy="48" rx="10" ry="8" fill="white" stroke="#F59E0B" strokeWidth="2" />
    <circle cx="50" cy="48" r="4" fill="#F59E0B" />
    {/* 파 고명 */}
    <rect x="32" y="52" width="2" height="8" fill="#22C55E" rx="1" />
    <rect x="38" y="54" width="2" height="6" fill="#22C55E" rx="1" />
    <rect x="62" y="53" width="2" height="7" fill="#22C55E" rx="1" />
    {/* 김 */}
    <rect x="55" y="56" width="8" height="5" fill="#1F2937" opacity="0.8" rx="1" />
    {/* 김치 */}
    <ellipse cx="70" cy="58" rx="5" ry="3" fill="#DC2626" opacity="0.9" />
    {/* 증기 */}
    {mood === "happy" && (
      <g>
        <path d="M35 42 Q38 32 35 22" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M50 40 Q53 30 50 20" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <path d="M65 42 Q68 32 65 22" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        <path d="M30 42 Q34 28 30 14" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M45 40 Q49 26 45 12" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M55 40 Q59 26 55 12" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        <path d="M70 42 Q74 28 70 14" fill="none" stroke="#D1D5DB" strokeWidth="2.5" strokeLinecap="round" opacity="0.7" />
        {/* 불꽃 효과 */}
        <path d="M15 70 L20 75 M25 68 L20 75 M15 80 L20 75" stroke="#FF6B00" strokeWidth="2" />
        <path d="M85 70 L80 75 M75 68 L80 75 M85 80 L80 75" stroke="#FF6B00" strokeWidth="2" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        <path d="M50 40 Q53 30 50 20" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </g>
    )}
    {(mood === "calm" || mood === "sad") && (
      <g>
        <path d="M45 42 Q47 35 45 28" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
        <path d="M55 42 Q57 35 55 28" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      </g>
    )}
  </svg>
);

// 여행 스타일 아이콘 (travelStyle 테스트용)
export const TravelStyleIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }: IconProps) => (
  <svg viewBox="0 0 100 100" className={className}>
    {/* 비행기 */}
    <path d="M50 25 L70 45 L90 40 L92 42 L75 55 L78 75 L80 77 L72 75 L50 90 L28 75 L20 77 L22 75 L25 55 L8 42 L10 40 L30 45 Z" fill="#60A5FA" stroke="#1E40AF" strokeWidth="3" />
    {/* 비행기 창문 */}
    <circle cx="50" cy="50" r="5" fill="white" stroke="#1E40AF" strokeWidth="1.5" />
    <circle cx="45" cy="60" r="3" fill="white" stroke="#1E40AF" strokeWidth="1" />
    <circle cx="55" cy="60" r="3" fill="white" stroke="#1E40AF" strokeWidth="1" />
    {/* 구름 */}
    <g opacity="0.7">
      <ellipse cx="20" cy="30" rx="8" ry="5" fill="white" stroke="#CBD5E1" strokeWidth="1" />
      <ellipse cx="15" cy="32" rx="5" ry="3" fill="white" stroke="#CBD5E1" strokeWidth="1" />
      <ellipse cx="25" cy="32" rx="5" ry="3" fill="white" stroke="#CBD5E1" strokeWidth="1" />
    </g>
    <g opacity="0.7">
      <ellipse cx="80" cy="65" rx="10" ry="6" fill="white" stroke="#CBD5E1" strokeWidth="1" />
      <ellipse cx="75" cy="68" rx="6" ry="4" fill="white" stroke="#CBD5E1" strokeWidth="1" />
      <ellipse cx="87" cy="68" rx="6" ry="4" fill="white" stroke="#CBD5E1" strokeWidth="1" />
    </g>
    {mood === "happy" && (
      <g>
        {/* 비행운 */}
        <path d="M30 85 Q28 88 30 90" fill="none" stroke="#E0E7FF" strokeWidth="2" opacity="0.6" />
        <path d="M35 88 Q33 91 35 93" fill="none" stroke="#E0E7FF" strokeWidth="2" opacity="0.6" />
        <path d="M40 91 Q38 94 40 96" fill="none" stroke="#E0E7FF" strokeWidth="2" opacity="0.6" />
      </g>
    )}
    {mood === "excited" && (
      <g>
        {/* 반짝임 */}
        <path d="M15 15 L20 20 M25 10 L20 20 M15 25 L20 20" stroke="#FCD34D" strokeWidth="2" />
        <path d="M85 25 L80 30 M75 20 L80 30 M85 35 L80 30" stroke="#FCD34D" strokeWidth="2" />
        {/* 비행운 */}
        <path d="M25 85 Q22 90 25 95" fill="none" stroke="#E0E7FF" strokeWidth="2.5" opacity="0.7" />
        <path d="M35 88 Q32 93 35 98" fill="none" stroke="#E0E7FF" strokeWidth="2.5" opacity="0.7" />
      </g>
    )}
    {mood === "cool" && (
      <g>
        {/* 선글라스 */}
        <rect x="42" y="47" width="6" height="4" rx="1" fill="black" />
        <rect x="52" y="47" width="6" height="4" rx="1" fill="black" />
        <path d="M48 49 L52 49" stroke="black" strokeWidth="1" />
      </g>
    )}
  </svg>
);

// 아이콘 맵핑 (동적 렌더링용)
export const IconMap: Record<string, React.ComponentType<IconProps>> = {
  HumanIcon,
  CatFace,
  DogFace,
  RabbitFace,
  HamsterFace,
  HeartIcon,
  PlantIcon,
  PetMatchIcon,
  CoffeeIcon,
  TeaIcon,
  ConflictIcon,
  FruitIcon,
  AlcoholIcon,
  BreadIcon,
  PerfumeIcon,
  AromaIcon,
  ChefHatIcon,
  WhiskeySampleIcon,
  RamenIcon,
  DrinkingStyleIcon,
  SpendingStyleIcon,
  TravelStyleIcon,
};

export const getIcon = (iconName: string): React.ComponentType<IconProps> => {
  return IconMap[iconName] || HumanIcon;
};
