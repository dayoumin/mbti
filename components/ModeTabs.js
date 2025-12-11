const ModeTabs = ({ mode, onRestart }) => {
    // SUBJECT_CONFIG에서 동적으로 탭 생성
    const config = window.SUBJECT_CONFIG || {};
    const tabs = Object.entries(config).map(([key, cfg]) => ({
        key,
        label: cfg.label,
        Icon: window[cfg.icon]
    }));

    return (
        <div className="flex w-full mb-6 gap-1 overflow-x-auto">
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
    );
};

window.ModeTabs = ModeTabs;
