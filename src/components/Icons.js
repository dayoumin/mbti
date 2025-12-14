export const ChevronDown = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>);
export const ChevronUp = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>);
export const CloseIcon = ({ className, onClick }) => (<svg onClick={onClick} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

export const CatFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <path d="M20 30 Q 10 10 30 20 L 70 20 Q 90 10 80 30 L 80 70 Q 90 90 50 90 Q 10 90 20 70 Z" fill="white" stroke="#4A4A4A" strokeWidth="3" />
        {mood === "happy" && (<g><circle cx="35" cy="45" r="3" fill="#4A4A4A" /><circle cx="65" cy="45" r="3" fill="#4A4A4A" /><path d="M45 55 Q 50 60 55 55" fill="none" stroke="#4A4A4A" strokeWidth="3" /><path d="M25 50 L 10 50" stroke="#4A4A4A" strokeWidth="2" /><path d="M75 50 L 90 50" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "cool" && (<g><rect x="25" y="40" width="20" height="10" rx="2" fill="black" /><rect x="55" y="40" width="20" height="10" rx="2" fill="black" /><path d="M45 45 L 55 45" stroke="black" strokeWidth="2" /><path d="M45 60 Q 50 60 55 60" fill="none" stroke="#4A4A4A" strokeWidth="3" /></g>)}
        {mood === "sad" && (<g><circle cx="35" cy="45" r="3" fill="#4A4A4A" /><circle cx="65" cy="45" r="3" fill="#4A4A4A" /><path d="M45 65 Q 50 60 55 65" fill="none" stroke="#4A4A4A" strokeWidth="3" /></g>)}
        {mood === "excited" && (<g><circle cx="35" cy="45" r="5" fill="#4A4A4A" /><circle cx="65" cy="45" r="5" fill="#4A4A4A" /><path d="M45 55 Q 50 65 55 55" fill="none" stroke="#4A4A4A" strokeWidth="3" /></g>)}
    </svg>
);

export const DogFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <path d="M25 30 Q 50 10 75 30 L 75 70 Q 90 90 50 90 Q 10 90 25 70 Z" fill="#FFC95F" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M15 40 Q 25 25 35 40 L 35 40" fill="#FFC95F" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M85 40 Q 75 25 65 40 L 65 40" fill="#FFC95F" stroke="#4A4A4A" strokeWidth="3" />
        {mood === "happy" && (<g><circle cx="40" cy="50" r="3" fill="#4A4A4A" /><circle cx="60" cy="50" r="3" fill="#4A4A4A" /><path d="M45 60 Q 50 65 55 60 Z" fill="#FF9999" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "excited" && (<g><circle cx="40" cy="50" r="4" fill="#4A4A4A" /><circle cx="60" cy="50" r="4" fill="#4A4A4A" /><path d="M40 60 Q 50 70 60 60 Z" fill="#FF9999" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "cool" && (<g><rect x="30" y="45" width="10" height="5" rx="1" fill="#4A4A4A" /><rect x="60" y="45" width="10" height="5" rx="1" fill="#4A4A4A" /><path d="M45 65 Q 50 65 55 65" fill="none" stroke="#4A4A4A" strokeWidth="3" /></g>)}
        {mood === "sad" && (<g><circle cx="40" cy="50" r="3" fill="#4A4A4A" /><circle cx="60" cy="50" r="3" fill="#4A4A4A" /><path d="M40 65 Q 50 60 60 65 Z" fill="#FF9999" stroke="#4A4A4A" strokeWidth="2" /></g>)}
    </svg>
);

export const HumanIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="30" r="15" fill="#FFD1DC" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M30 45 L 70 45 L 70 85 Q 50 95 30 85 Z" fill="#BDE0FE" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M30 50 L 20 60 M70 50 L 80 60" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        {mood === "happy" && (<g><circle cx="45" cy="30" r="2" fill="#4A4A4A" /><circle cx="55" cy="30" r="2" fill="#4A4A4A" /><path d="M45 35 Q 50 38 55 35" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" /></g>)}
    </svg>
);

export const RabbitFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 긴 귀 */}
        <ellipse cx="35" cy="20" rx="8" ry="20" fill="white" stroke="#4A4A4A" strokeWidth="3" />
        <ellipse cx="65" cy="20" rx="8" ry="20" fill="white" stroke="#4A4A4A" strokeWidth="3" />
        <ellipse cx="35" cy="20" rx="4" ry="12" fill="#FFB6C1" />
        <ellipse cx="65" cy="20" rx="4" ry="12" fill="#FFB6C1" />
        {/* 얼굴 */}
        <ellipse cx="50" cy="60" rx="30" ry="25" fill="white" stroke="#4A4A4A" strokeWidth="3" />
        {mood === "happy" && (<g><circle cx="40" cy="55" r="3" fill="#4A4A4A" /><circle cx="60" cy="55" r="3" fill="#4A4A4A" /><ellipse cx="50" cy="68" rx="5" ry="3" fill="#FFB6C1" /><path d="M45 70 Q 50 75 55 70" fill="none" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "excited" && (<g><circle cx="40" cy="55" r="4" fill="#4A4A4A" /><circle cx="60" cy="55" r="4" fill="#4A4A4A" /><ellipse cx="50" cy="68" rx="6" ry="4" fill="#FFB6C1" /><path d="M43 70 Q 50 78 57 70" fill="none" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "cool" && (<g><rect x="32" y="52" width="15" height="6" rx="2" fill="black" /><rect x="53" y="52" width="15" height="6" rx="2" fill="black" /><ellipse cx="50" cy="68" rx="5" ry="3" fill="#FFB6C1" /></g>)}
        {mood === "sad" && (<g><circle cx="40" cy="55" r="3" fill="#4A4A4A" /><circle cx="60" cy="55" r="3" fill="#4A4A4A" /><ellipse cx="50" cy="68" rx="5" ry="3" fill="#FFB6C1" /><path d="M45 73 Q 50 70 55 73" fill="none" stroke="#4A4A4A" strokeWidth="2" /></g>)}
    </svg>
);

export const HamsterFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 둥근 귀 */}
        <circle cx="25" cy="30" r="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
        <circle cx="75" cy="30" r="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
        <circle cx="25" cy="30" r="6" fill="#FFB6C1" />
        <circle cx="75" cy="30" r="6" fill="#FFB6C1" />
        {/* 볼살 가득한 얼굴 */}
        <ellipse cx="50" cy="55" rx="35" ry="30" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
        {/* 볼 주머니 */}
        <ellipse cx="25" cy="60" rx="12" ry="10" fill="#FFDAB9" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="75" cy="60" rx="12" ry="10" fill="#FFDAB9" stroke="#4A4A4A" strokeWidth="2" />
        {mood === "happy" && (<g><circle cx="40" cy="50" r="3" fill="#4A4A4A" /><circle cx="60" cy="50" r="3" fill="#4A4A4A" /><ellipse cx="50" cy="62" rx="4" ry="3" fill="#FF9999" /><path d="M46 65 Q 50 68 54 65" fill="none" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "excited" && (<g><circle cx="40" cy="50" r="4" fill="#4A4A4A" /><circle cx="60" cy="50" r="4" fill="#4A4A4A" /><ellipse cx="50" cy="62" rx="5" ry="4" fill="#FF9999" /><path d="M44 65 Q 50 72 56 65" fill="none" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "cool" && (<g><rect x="32" y="47" width="15" height="6" rx="2" fill="black" /><rect x="53" y="47" width="15" height="6" rx="2" fill="black" /><ellipse cx="50" cy="62" rx="4" ry="3" fill="#FF9999" /></g>)}
        {mood === "sad" && (<g><circle cx="40" cy="50" r="3" fill="#4A4A4A" /><circle cx="60" cy="50" r="3" fill="#4A4A4A" /><ellipse cx="50" cy="62" rx="4" ry="3" fill="#FF9999" /><path d="M46 68 Q 50 65 54 68" fill="none" stroke="#4A4A4A" strokeWidth="2" /></g>)}
    </svg>
);

export const Capsule = () => (
    <svg viewBox="0 0 100 100" className="w-40 h-40 mx-auto">
        <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M5 50 L 95 50" stroke="#4A4A4A" strokeWidth="3" />
        <circle cx="50" cy="50" r="10" fill="white" stroke="#4A4A4A" strokeWidth="2" />
    </svg>
);

export const HeartIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 하트 모양 */}
        <path d="M50 85 L20 55 Q5 40 20 25 Q35 10 50 30 Q65 10 80 25 Q95 40 80 55 Z"
            fill="#FF6B9D" stroke="#4A4A4A" strokeWidth="3" />
        {mood === "happy" && (<g>
            <circle cx="35" cy="45" r="3" fill="white" />
            <circle cx="65" cy="45" r="3" fill="white" />
            <path d="M40 55 Q 50 65 60 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </g>)}
        {mood === "excited" && (<g>
            <circle cx="35" cy="45" r="4" fill="white" />
            <circle cx="65" cy="45" r="4" fill="white" />
            <path d="M35 55 Q 50 70 65 55" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            {/* 반짝임 */}
            <path d="M15 20 L20 25 M25 15 L20 25 M15 30 L20 25" stroke="#FFD700" strokeWidth="2" />
            <path d="M85 20 L80 25 M75 15 L80 25 M85 30 L80 25" stroke="#FFD700" strokeWidth="2" />
        </g>)}
        {mood === "cool" && (<g>
            <rect x="27" y="42" width="15" height="6" rx="2" fill="white" />
            <rect x="58" y="42" width="15" height="6" rx="2" fill="white" />
            <path d="M45 58 Q 50 58 55 58" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </g>)}
        {mood === "sad" && (<g>
            <circle cx="35" cy="45" r="3" fill="white" />
            <circle cx="65" cy="45" r="3" fill="white" />
            <path d="M40 60 Q 50 52 60 60" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
        </g>)}
    </svg>
);

export const PlantIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 화분 */}
        <path d="M30 65 L35 90 L65 90 L70 65 Z" fill="#D2691E" stroke="#4A4A4A" strokeWidth="3" />
        <rect x="28" y="60" width="44" height="8" rx="2" fill="#CD853F" stroke="#4A4A4A" strokeWidth="2" />
        {/* 흙 */}
        <ellipse cx="50" cy="62" rx="18" ry="4" fill="#8B4513" />
        {mood === "happy" && (<g>
            {/* 건강한 잎 */}
            <ellipse cx="50" cy="35" rx="12" ry="20" fill="#228B22" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="35" cy="45" rx="10" ry="15" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(-30 35 45)" />
            <ellipse cx="65" cy="45" rx="10" ry="15" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(30 65 45)" />
            <path d="M50 55 L50 35" stroke="#228B22" strokeWidth="3" />
            {/* 얼굴 */}
            <circle cx="45" cy="32" r="2" fill="#4A4A4A" />
            <circle cx="55" cy="32" r="2" fill="#4A4A4A" />
            <path d="M46 38 Q 50 42 54 38" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "excited" && (<g>
            {/* 꽃 피운 식물 */}
            <ellipse cx="50" cy="40" rx="10" ry="18" fill="#228B22" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="38" cy="48" rx="8" ry="12" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(-25 38 48)" />
            <ellipse cx="62" cy="48" rx="8" ry="12" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" transform="rotate(25 62 48)" />
            <path d="M50 58 L50 40" stroke="#228B22" strokeWidth="3" />
            {/* 꽃 */}
            <circle cx="50" cy="18" r="8" fill="#FF69B4" stroke="#4A4A4A" strokeWidth="2" />
            <circle cx="50" cy="18" r="4" fill="#FFD700" />
            {/* 얼굴 */}
            <circle cx="46" cy="38" r="2" fill="#4A4A4A" />
            <circle cx="54" cy="38" r="2" fill="#4A4A4A" />
            <path d="M44 44 Q 50 50 56 44" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "cool" && (<g>
            {/* 선인장 스타일 */}
            <ellipse cx="50" cy="40" rx="12" ry="22" fill="#228B22" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="35" cy="45" rx="6" ry="10" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="65" cy="42" rx="6" ry="12" fill="#32CD32" stroke="#4A4A4A" strokeWidth="2" />
            {/* 선글라스 */}
            <rect x="40" y="32" width="8" height="5" rx="1" fill="black" />
            <rect x="52" y="32" width="8" height="5" rx="1" fill="black" />
            <path d="M48 34 L52 34" stroke="black" strokeWidth="1" />
            <path d="M46 42 Q 50 42 54 42" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "sad" && (<g>
            {/* 시든 잎 */}
            <ellipse cx="50" cy="40" rx="10" ry="16" fill="#9ACD32" stroke="#4A4A4A" strokeWidth="2" />
            <ellipse cx="38" cy="50" rx="8" ry="10" fill="#BDB76B" stroke="#4A4A4A" strokeWidth="2" transform="rotate(-40 38 50)" />
            <ellipse cx="62" cy="50" rx="8" ry="10" fill="#BDB76B" stroke="#4A4A4A" strokeWidth="2" transform="rotate(40 62 50)" />
            <path d="M50 58 L50 42" stroke="#9ACD32" strokeWidth="3" />
            {/* 얼굴 */}
            <circle cx="46" cy="38" r="2" fill="#4A4A4A" />
            <circle cx="54" cy="38" r="2" fill="#4A4A4A" />
            <path d="M46 46 Q 50 42 54 46" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
    </svg>
);

export const PetMatchIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 발바닥 모양 */}
        <ellipse cx="50" cy="60" rx="20" ry="18" fill="#F4A460" stroke="#4A4A4A" strokeWidth="3" />
        <ellipse cx="30" cy="40" rx="10" ry="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="50" cy="32" rx="10" ry="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="2" />
        <ellipse cx="70" cy="40" rx="10" ry="12" fill="#F4A460" stroke="#4A4A4A" strokeWidth="2" />
        {mood === "happy" && (<g>
            <circle cx="43" cy="55" r="2" fill="#4A4A4A" />
            <circle cx="57" cy="55" r="2" fill="#4A4A4A" />
            <path d="M46 62 Q 50 66 54 62" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "excited" && (<g>
            <circle cx="43" cy="55" r="3" fill="#4A4A4A" />
            <circle cx="57" cy="55" r="3" fill="#4A4A4A" />
            <path d="M44 62 Q 50 70 56 62" fill="none" stroke="#4A4A4A" strokeWidth="2" />
            {/* 반짝임 */}
            <path d="M20 25 L25 30 M30 20 L25 30 M20 35 L25 30" stroke="#FFD700" strokeWidth="2" />
            <path d="M80 25 L75 30 M70 20 L75 30 M80 35 L75 30" stroke="#FFD700" strokeWidth="2" />
        </g>)}
        {mood === "cool" && (<g>
            <rect x="36" y="52" width="10" height="5" rx="1" fill="black" />
            <rect x="54" y="52" width="10" height="5" rx="1" fill="black" />
            <path d="M46 65 Q 50 65 54 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "sad" && (<g>
            <circle cx="43" cy="55" r="2" fill="#4A4A4A" />
            <circle cx="57" cy="55" r="2" fill="#4A4A4A" />
            <path d="M46 65 Q 50 62 54 65" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
    </svg>
);

export const CoffeeIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 컵 */}
        <path d="M25 35 L30 85 L70 85 L75 35 Z" fill="white" stroke="#4A4A4A" strokeWidth="3" />
        {/* 커피 */}
        <path d="M28 45 L32 80 L68 80 L72 45 Z" fill="#6F4E37" />
        {/* 손잡이 */}
        <path d="M75 45 Q 90 45 90 60 Q 90 75 75 75" fill="none" stroke="#4A4A4A" strokeWidth="3" />
        {mood === "happy" && (<g>
            {/* 김 */}
            <path d="M35 25 Q 38 15 35 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 25 Q 53 15 50 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M65 25 Q 68 15 65 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 얼굴 */}
            <circle cx="42" cy="58" r="3" fill="#4A4A4A" />
            <circle cx="58" cy="58" r="3" fill="#4A4A4A" />
            <path d="M45 68 Q 50 73 55 68" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "excited" && (<g>
            {/* 김 많이 */}
            <path d="M32 28 Q 36 15 32 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M44 28 Q 48 15 44 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M56 28 Q 60 15 56 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M68 28 Q 72 15 68 2" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 얼굴 */}
            <circle cx="42" cy="58" r="4" fill="#4A4A4A" />
            <circle cx="58" cy="58" r="4" fill="#4A4A4A" />
            <path d="M43 68 Q 50 78 57 68" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "cool" && (<g>
            {/* 김 */}
            <path d="M50 25 Q 53 15 50 5" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 선글라스 */}
            <rect x="34" y="54" width="12" height="6" rx="2" fill="black" />
            <rect x="54" y="54" width="12" height="6" rx="2" fill="black" />
            <path d="M46 57 L54 57" stroke="black" strokeWidth="2" />
            <path d="M45 70 Q 50 70 55 70" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "sad" && (<g>
            {/* 김 적게 */}
            <path d="M50 28 Q 52 22 50 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 얼굴 */}
            <circle cx="42" cy="58" r="3" fill="#4A4A4A" />
            <circle cx="58" cy="58" r="3" fill="#4A4A4A" />
            <path d="M45 72 Q 50 67 55 72" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
    </svg>
);

export const TeaIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 찻잔 */}
        <ellipse cx="50" cy="75" rx="28" ry="8" fill="#D2B48C" stroke="#4A4A4A" strokeWidth="2" />
        <path d="M22 45 Q 22 75 50 75 Q 78 75 78 45" fill="white" stroke="#4A4A4A" strokeWidth="3" />
        {/* 차 */}
        <path d="M25 50 Q 25 70 50 70 Q 75 70 75 50 Z" fill="#90EE90" />
        {/* 손잡이 */}
        <path d="M78 50 Q 92 50 92 62 Q 92 74 78 70" fill="none" stroke="#4A4A4A" strokeWidth="3" />
        {/* 찻잎 장식 */}
        <ellipse cx="50" cy="52" rx="6" ry="3" fill="#228B22" transform="rotate(-20 50 52)" />
        {mood === "happy" && (<g>
            {/* 김 */}
            <path d="M38 35 Q 40 25 38 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 35 Q 52 25 50 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M62 35 Q 64 25 62 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 얼굴 */}
            <circle cx="42" cy="58" r="2" fill="#4A4A4A" />
            <circle cx="58" cy="58" r="2" fill="#4A4A4A" />
            <path d="M46 64 Q 50 68 54 64" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "excited" && (<g>
            {/* 김 많이 + 하트 */}
            <path d="M35 35 Q 37 22 35 10" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M50 35 Q 52 22 50 10" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            <path d="M65 35 Q 67 22 65 10" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 하트 */}
            <path d="M85 20 Q 82 15 78 20 Q 74 15 71 20 Q 71 25 78 32 Q 85 25 85 20 Z" fill="#FF6B9D" />
            {/* 얼굴 */}
            <circle cx="42" cy="58" r="3" fill="#4A4A4A" />
            <circle cx="58" cy="58" r="3" fill="#4A4A4A" />
            <path d="M44 64 Q 50 72 56 64" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "cool" && (<g>
            {/* 김 */}
            <path d="M50 35 Q 52 25 50 15" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 선글라스 */}
            <rect x="35" y="55" width="10" height="5" rx="1" fill="black" />
            <rect x="55" y="55" width="10" height="5" rx="1" fill="black" />
            <path d="M45 57 L55 57" stroke="black" strokeWidth="1" />
            <path d="M46 66 Q 50 66 54 66" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "sad" && (<g>
            {/* 김 적게 */}
            <path d="M50 38 Q 51 32 50 25" fill="none" stroke="#A9A9A9" strokeWidth="2" strokeLinecap="round" />
            {/* 얼굴 */}
            <circle cx="42" cy="58" r="2" fill="#4A4A4A" />
            <circle cx="58" cy="58" r="2" fill="#4A4A4A" />
            <path d="M46 68 Q 50 64 54 68" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
    </svg>
);

export const FishIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 물고기 몸통 */}
        <ellipse cx="45" cy="50" rx="30" ry="20" fill="#4FC3F7" stroke="#4A4A4A" strokeWidth="3" />
        {/* 꼬리 지느러미 */}
        <path d="M75 50 L95 35 L95 65 Z" fill="#29B6F6" stroke="#4A4A4A" strokeWidth="2" />
        {/* 등 지느러미 */}
        <path d="M35 30 L45 20 L55 30" fill="#29B6F6" stroke="#4A4A4A" strokeWidth="2" />
        {/* 배 지느러미 */}
        <path d="M40 70 L45 78 L50 70" fill="#29B6F6" stroke="#4A4A4A" strokeWidth="2" />
        {/* 비늘 무늬 */}
        <path d="M30 45 Q 35 50 30 55" fill="none" stroke="#81D4FA" strokeWidth="2" />
        <path d="M45 45 Q 50 50 45 55" fill="none" stroke="#81D4FA" strokeWidth="2" />
        <path d="M60 45 Q 65 50 60 55" fill="none" stroke="#81D4FA" strokeWidth="2" />
        {mood === "happy" && (<g>
            <circle cx="28" cy="48" r="4" fill="white" stroke="#4A4A4A" strokeWidth="2" />
            <circle cx="29" cy="47" r="2" fill="#4A4A4A" />
            <path d="M35 55 Q 38 58 42 55" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "excited" && (<g>
            <circle cx="28" cy="48" r="5" fill="white" stroke="#4A4A4A" strokeWidth="2" />
            <circle cx="29" cy="47" r="2" fill="#4A4A4A" />
            <path d="M33 55 Q 38 62 43 55" fill="none" stroke="#4A4A4A" strokeWidth="2" />
            {/* 물방울 */}
            <circle cx="10" cy="40" r="3" fill="#B3E5FC" />
            <circle cx="15" cy="55" r="2" fill="#B3E5FC" />
        </g>)}
        {mood === "cool" && (<g>
            <rect x="22" y="44" width="12" height="6" rx="2" fill="black" />
            <path d="M35 56 Q 38 56 42 56" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "calm" && (<g>
            <circle cx="28" cy="48" r="4" fill="white" stroke="#4A4A4A" strokeWidth="2" />
            <circle cx="29" cy="48" r="2" fill="#4A4A4A" />
            <path d="M35 56 Q 38 56 42 56" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
    </svg>
);

export const BirdIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 몸통 */}
        <ellipse cx="50" cy="60" rx="25" ry="22" fill="#8BC34A" stroke="#4A4A4A" strokeWidth="3" />
        {/* 머리 */}
        <circle cx="50" cy="30" r="18" fill="#AED581" stroke="#4A4A4A" strokeWidth="3" />
        {/* 부리 */}
        <path d="M50 38 L58 45 L50 48 Z" fill="#FFC107" stroke="#4A4A4A" strokeWidth="2" />
        {/* 날개 */}
        <ellipse cx="28" cy="55" rx="10" ry="15" fill="#7CB342" stroke="#4A4A4A" strokeWidth="2" transform="rotate(-20 28 55)" />
        <ellipse cx="72" cy="55" rx="10" ry="15" fill="#7CB342" stroke="#4A4A4A" strokeWidth="2" transform="rotate(20 72 55)" />
        {/* 발 */}
        <path d="M40 80 L40 90 M38 90 L42 90" stroke="#FFC107" strokeWidth="3" strokeLinecap="round" />
        <path d="M60 80 L60 90 M58 90 L62 90" stroke="#FFC107" strokeWidth="3" strokeLinecap="round" />
        {mood === "happy" && (<g>
            <circle cx="42" cy="28" r="3" fill="#4A4A4A" />
            <circle cx="58" cy="28" r="3" fill="#4A4A4A" />
            <circle cx="43" cy="27" r="1" fill="white" />
            <circle cx="59" cy="27" r="1" fill="white" />
        </g>)}
        {mood === "excited" && (<g>
            <circle cx="42" cy="28" r="4" fill="#4A4A4A" />
            <circle cx="58" cy="28" r="4" fill="#4A4A4A" />
            <circle cx="43" cy="27" r="1.5" fill="white" />
            <circle cx="59" cy="27" r="1.5" fill="white" />
            {/* 음표 */}
            <text x="75" y="20" fontSize="12" fill="#FF6B9D">♪</text>
            <text x="82" y="28" fontSize="10" fill="#FF6B9D">♫</text>
        </g>)}
        {mood === "cool" && (<g>
            <rect x="35" y="25" width="12" height="6" rx="2" fill="black" />
            <rect x="53" y="25" width="12" height="6" rx="2" fill="black" />
            <path d="M47 28 L53 28" stroke="black" strokeWidth="2" />
        </g>)}
        {mood === "calm" && (<g>
            <path d="M39 28 Q 42 26 45 28" fill="none" stroke="#4A4A4A" strokeWidth="2" />
            <path d="M55 28 Q 58 26 61 28" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
    </svg>
);

export const ReptileIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        {/* 도마뱀 몸통 */}
        <ellipse cx="50" cy="55" rx="22" ry="18" fill="#66BB6A" stroke="#4A4A4A" strokeWidth="3" />
        {/* 머리 */}
        <ellipse cx="50" cy="30" rx="15" ry="12" fill="#81C784" stroke="#4A4A4A" strokeWidth="3" />
        {/* 꼬리 */}
        <path d="M50 73 Q 55 85 45 95" fill="none" stroke="#4CAF50" strokeWidth="8" strokeLinecap="round" />
        {/* 다리 */}
        <path d="M30 50 L15 45 M15 45 L10 40 M15 45 L12 50 M15 45 L18 50" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        <path d="M70 50 L85 45 M85 45 L90 40 M85 45 L88 50 M85 45 L82 50" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        <path d="M35 68 L25 80 M25 80 L20 78 M25 80 L22 85 M25 80 L28 85" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        <path d="M65 68 L75 80 M75 80 L80 78 M75 80 L78 85 M75 80 L72 85" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        {/* 등 무늬 */}
        <circle cx="42" cy="52" r="3" fill="#A5D6A7" />
        <circle cx="58" cy="52" r="3" fill="#A5D6A7" />
        <circle cx="50" cy="60" r="3" fill="#A5D6A7" />
        {mood === "happy" && (<g>
            <circle cx="43" cy="28" r="3" fill="#4A4A4A" />
            <circle cx="57" cy="28" r="3" fill="#4A4A4A" />
            <circle cx="44" cy="27" r="1" fill="white" />
            <circle cx="58" cy="27" r="1" fill="white" />
            <path d="M47 35 Q 50 38 53 35" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "excited" && (<g>
            <circle cx="43" cy="28" r="4" fill="#4A4A4A" />
            <circle cx="57" cy="28" r="4" fill="#4A4A4A" />
            <circle cx="44" cy="27" r="1.5" fill="white" />
            <circle cx="58" cy="27" r="1.5" fill="white" />
            <path d="M45 35 Q 50 42 55 35" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "cool" && (<g>
            <rect x="36" y="25" width="12" height="5" rx="1" fill="black" />
            <rect x="52" y="25" width="12" height="5" rx="1" fill="black" />
            <path d="M48 27 L52 27" stroke="black" strokeWidth="1" />
            <path d="M47 36 Q 50 36 53 36" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
        {mood === "calm" && (<g>
            <circle cx="43" cy="28" r="3" fill="#4A4A4A" />
            <circle cx="57" cy="28" r="3" fill="#4A4A4A" />
            <path d="M47 36 Q 50 36 53 36" fill="none" stroke="#4A4A4A" strokeWidth="2" />
        </g>)}
    </svg>
);

export const HeartHandshake = ({ className = "w-6 h-6" }) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        <path d="M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08v0c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66" />
        <path d="m18 15-2-2" />
        <path d="m15 18-2-2" />
    </svg>
);
