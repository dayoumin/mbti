const ModeTabs = ({ mode, onRestart }) => {
    const config = window.SUBJECT_CONFIG || {};
    const testTypes = window.TEST_TYPES || {};

    // testType별로 그룹핑
    const groupedTabs = {};
    Object.entries(config).forEach(([key, cfg]) => {
        const type = cfg.testType || 'personality';
        if (!groupedTabs[type]) {
            groupedTabs[type] = [];
        }
        const IconComponent = window[cfg.icon];
        if (!IconComponent) {
            console.warn(`[CHEMI] 아이콘 누락: "${cfg.icon}"이 window에 등록되지 않았습니다. 기본 아이콘을 사용합니다.`);
        }
        groupedTabs[type].push({
            key,
            label: cfg.label,
            Icon: IconComponent || window.HumanIcon
        });
    });

    // testTypes 순서대로 렌더링
    const typeOrder = Object.keys(testTypes);

    return (
        <div className="w-full mb-6 space-y-3">
            {typeOrder.map((typeKey) => {
                const typeInfo = testTypes[typeKey];
                const tabs = groupedTabs[typeKey] || [];
                if (tabs.length === 0) return null;

                return (
                    <div key={typeKey}>
                        <div className="text-xs font-bold text-gray-500 mb-1 px-1">
                            {typeInfo.emoji} {typeInfo.label}
                        </div>
                        <div className="flex gap-1 overflow-x-auto">
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
                    </div>
                );
            })}
        </div>
    );
};

window.ModeTabs = ModeTabs;
