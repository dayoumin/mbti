const ModeTabs = ({ mode, onRestart }) => {
    const { HumanIcon, CatFace, DogFace } = window;

    const tabs = [
        { key: 'human', label: '사람', Icon: HumanIcon },
        { key: 'cat', label: '고양이', Icon: CatFace },
        { key: 'dog', label: '강아지', Icon: DogFace }
    ];

    return (
        <div className="flex w-full mb-6 gap-2">
            {tabs.map((tab) => (
                <button
                    key={tab.key}
                    onClick={() => onRestart(tab.key)}
                    className={`flex-1 py-3 doodle-border transition-all ${mode === tab.key
                            ? 'bg-gradient-to-br from-yellow-100 to-pink-100 scale-105'
                            : 'bg-white hover:bg-gray-50'
                        }`}
                >
                    <tab.Icon mood="happy" className="w-12 h-12 mx-auto mb-1" />
                    <div className="text-sm font-bold text-gray-800">{tab.label}</div>
                </button>
            ))}
        </div>
    );
};

window.ModeTabs = ModeTabs;
