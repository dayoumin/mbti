const ChevronDown = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>);
const ChevronUp = ({ className }) => (<svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>);
const CloseIcon = ({ className, onClick }) => (<svg onClick={onClick} className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>);

const CatFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <path d="M20 30 Q 10 10 30 20 L 70 20 Q 90 10 80 30 L 80 70 Q 90 90 50 90 Q 10 90 20 70 Z" fill="white" stroke="#4A4A4A" strokeWidth="3" />
        {mood === "happy" && (<g><circle cx="35" cy="45" r="3" fill="#4A4A4A" /><circle cx="65" cy="45" r="3" fill="#4A4A4A" /><path d="M45 55 Q 50 60 55 55" fill="none" stroke="#4A4A4A" strokeWidth="3" /><path d="M25 50 L 10 50" stroke="#4A4A4A" strokeWidth="2" /><path d="M75 50 L 90 50" stroke="#4A4A4A" strokeWidth="2" /></g>)}
        {mood === "cool" && (<g><rect x="25" y="40" width="20" height="10" rx="2" fill="black" /><rect x="55" y="40" width="20" height="10" rx="2" fill="black" /><path d="M45 45 L 55 45" stroke="black" strokeWidth="2" /><path d="M45 60 Q 50 60 55 60" fill="none" stroke="#4A4A4A" strokeWidth="3" /></g>)}
        {mood === "sad" && (<g><circle cx="35" cy="45" r="3" fill="#4A4A4A" /><circle cx="65" cy="45" r="3" fill="#4A4A4A" /><path d="M45 65 Q 50 60 55 65" fill="none" stroke="#4A4A4A" strokeWidth="3" /></g>)}
        {mood === "excited" && (<g><circle cx="35" cy="45" r="5" fill="#4A4A4A" /><circle cx="65" cy="45" r="5" fill="#4A4A4A" /><path d="M45 55 Q 50 65 55 55" fill="none" stroke="#4A4A4A" strokeWidth="3" /></g>)}
    </svg>
);

const DogFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
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

const HumanIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
    <svg viewBox="0 0 100 100" className={className}>
        <circle cx="50" cy="30" r="15" fill="#FFD1DC" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M30 45 L 70 45 L 70 85 Q 50 95 30 85 Z" fill="#BDE0FE" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M30 50 L 20 60 M70 50 L 80 60" stroke="#4A4A4A" strokeWidth="3" strokeLinecap="round" />
        {mood === "happy" && (<g><circle cx="45" cy="30" r="2" fill="#4A4A4A" /><circle cx="55" cy="30" r="2" fill="#4A4A4A" /><path d="M45 35 Q 50 38 55 35" fill="none" stroke="#4A4A4A" strokeWidth="2" strokeLinecap="round" /></g>)}
    </svg>
);

const RabbitFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
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

const HamsterFace = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
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

const Capsule = () => (
    <svg viewBox="0 0 100 100" className="w-40 h-40 mx-auto">
        <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M5 50 L 95 50" stroke="#4A4A4A" strokeWidth="3" />
        <circle cx="50" cy="50" r="10" fill="white" stroke="#4A4A4A" strokeWidth="2" />
    </svg>
);

const HeartIcon = ({ mood = "happy", className = "w-32 h-32 mx-auto mb-4" }) => (
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

// Make components globally available
window.ChevronDown = ChevronDown;
window.ChevronUp = ChevronUp;
window.CloseIcon = CloseIcon;
window.CatFace = CatFace;
window.DogFace = DogFace;
window.HumanIcon = HumanIcon;
window.RabbitFace = RabbitFace;
window.HamsterFace = HamsterFace;
window.Capsule = Capsule;
window.HeartIcon = HeartIcon;
