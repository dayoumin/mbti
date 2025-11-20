const TraitBar = ({ labelLeft, labelRight, scoreLeft, scoreRight, color }) => {
    const total = scoreLeft + scoreRight;
    const leftPercent = total === 0 ? 50 : Math.round((scoreLeft / total) * 100);
    const rightPercent = 100 - leftPercent;

    return (
        <div className="mb-4 w-full">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span>{labelLeft} {leftPercent}%</span>
                <span>{labelRight} {rightPercent}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden flex border border-gray-400">
                <div className={`${color} h-full transition-all duration-1000 ease-out`} style={{ width: `${leftPercent}%` }}></div>
                <div className="bg-gray-300 h-full transition-all duration-1000 ease-out" style={{ width: `${rightPercent}%` }}></div>
            </div>
        </div>
    );
};

window.TraitBar = TraitBar;
