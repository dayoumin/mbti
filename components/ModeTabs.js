const ModeTabs = ({ mode, onRestart }) => {
    const [activeType, setActiveType] = React.useState(null);
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

    // testTypes 순서대로
    const typeOrder = Object.keys(testTypes);

    // 현재 mode가 속한 타입 찾기 (초기값 설정)
    React.useEffect(() => {
        const currentConfig = config[mode];
        if (currentConfig) {
            setActiveType(currentConfig.testType || 'personality');
        }
    }, [mode]);

    // activeType이 없으면 첫 번째 타입으로
    const currentType = activeType || typeOrder[0];
    const currentTabs = groupedTabs[currentType] || [];

    return (
        <div className="w-full mb-6">
            {/* 1단: 카테고리 탭 */}
            <div className="flex mb-3">
                {typeOrder.map((typeKey) => {
                    const typeInfo = testTypes[typeKey];
                    const isActive = currentType === typeKey;
                    return (
                        <button
                            key={typeKey}
                            onClick={() => setActiveType(typeKey)}
                            className={`flex-1 py-2 px-3 text-sm font-bold transition-all border-b-4 ${
                                isActive
                                    ? 'text-gray-800 border-gray-800 bg-white'
                                    : 'text-gray-400 border-transparent hover:text-gray-600'
                            }`}
                        >
                            {typeInfo.emoji} {typeInfo.label}
                        </button>
                    );
                })}
            </div>

            {/* 2단: 해당 카테고리의 테스트들 */}
            <div className="grid grid-cols-3 gap-2">
                {currentTabs.map((tab) => (
                    <button
                        key={tab.key}
                        onClick={() => onRestart(tab.key)}
                        className={`py-3 px-2 doodle-border transition-all ${
                            mode === tab.key
                                ? 'bg-gradient-to-br from-yellow-100 to-pink-100 scale-105'
                                : 'bg-white hover:bg-gray-50'
                        }`}
                    >
                        <tab.Icon mood="happy" className="w-10 h-10 mx-auto mb-1" />
                        <div className="text-xs font-bold text-gray-800">{tab.label}</div>
                    </button>
                ))}
            </div>
        </div>
    );
};

window.ModeTabs = ModeTabs;
