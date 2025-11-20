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

const Capsule = () => (
    <svg viewBox="0 0 100 100" className="w-40 h-40 mx-auto">
        <circle cx="50" cy="50" r="45" fill="#FFD700" stroke="#4A4A4A" strokeWidth="3" />
        <path d="M5 50 L 95 50" stroke="#4A4A4A" strokeWidth="3" />
        <circle cx="50" cy="50" r="10" fill="white" stroke="#4A4A4A" strokeWidth="2" />
    </svg>
);

// Make components globally available
window.ChevronDown = ChevronDown;
window.ChevronUp = ChevronUp;
window.CloseIcon = CloseIcon;
window.CatFace = CatFace;
window.DogFace = DogFace;
window.HumanIcon = HumanIcon;
window.Capsule = Capsule;
