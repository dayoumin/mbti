const { useState, useEffect } = React;
const { ChevronDown, ChevronUp, CloseIcon, CatFace, DogFace, HumanIcon, Capsule, TraitBar, ModeTabs } = window;

const App = () => {
    const [mode, setMode] = useState('human');
    const [step, setStep] = useState('intro');
    const [qIdx, setQIdx] = useState(0);
    const [scores, setScores] = useState({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
    const [finalType, setFinalType] = useState("");
    const [detailTab, setDetailTab] = useState("interpretation");
    const [isDeepMode, setIsDeepMode] = useState(false);
    const [showGraphPopup, setShowGraphPopup] = useState(false);

    const appData = window.MBTI_DATA.appData;
    const currentModeData = appData[mode] || appData.cat;
    const basicQuestions = currentModeData.questions || [];
    const deepQuestions = currentModeData.questions_deep || [];
    const questions = isDeepMode ? [...basicQuestions, ...deepQuestions] : basicQuestions;
    const maxQuestions = questions.length;

    const iconMap = {
        "HumanIcon": HumanIcon,
        "CatFace": CatFace,
        "DogFace": DogFace
    };

    const handleAnswer = (type, scoreVal) => {
        const newScores = { ...scores, [scoreVal]: scores[scoreVal] + 1 };
        setScores(newScores);
        if (qIdx + 1 < maxQuestions) {
            setQIdx(qIdx + 1);
        } else {
            calculateResult(newScores);
        }
    };

    const calculateResult = (finalScores) => {
        setStep("loading");
        setTimeout(() => {
            const typeE = finalScores.E > finalScores.I ? "E" : "I";
            const typeS = finalScores.S > finalScores.N ? "S" : "N";
            const typeT = finalScores.T > finalScores.F ? "T" : "F";
            const typeJ = finalScores.J > finalScores.P ? "J" : "P";
            const resultKey = typeE + typeS + typeT + typeJ;
            setFinalType(currentModeData.results[resultKey] ? resultKey : "ISTJ");
            setStep("result");
            setDetailTab("interpretation");
        }, 2000);
    };

    const restart = (newMode = mode) => {
        setMode(newMode);
        setStep("intro");
        setQIdx(0);
        setScores({ E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 });
        setFinalType("");
        setIsDeepMode(false);
        setShowGraphPopup(false);
    };

    const startDeepTest = () => {
        setIsDeepMode(true);
        setStep("question");
        setQIdx(basicQuestions.length);
    };

    const IconComponent = iconMap[currentModeData.icon];
    const resultData = finalType && currentModeData.results[finalType];

    return (
        <div className="w-full h-full bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col p-6 relative border-4 border-gray-800" style={{ minHeight: '600px' }}>
            {step === "intro" && (
                <div className="flex flex-col h-full animate-pop">
                    <ModeTabs mode={mode} onRestart={restart} />
                    <div className="flex-grow flex flex-col items-center justify-center text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{currentModeData.title}</h1>
                        <p className="text-gray-500 mb-8">나의 성격을 MBTI로 알아보세요!</p>
                        <IconComponent mood="happy" />
                        <div className="space-y-2 text-gray-600 font-medium mb-8">
                            {mode === 'human' && (
                                <>
                                    <span>나는 어떤 사람일까?</span>
                                    <span>나의 숨겨진 성격은?</span>
                                    <span>친구들이 보는 나는?</span>
                                </>
                            )}
                            {mode === 'cat' && (
                                <>
                                    <span>철학 냥이?</span>
                                    <span>보스 냥이?</span>
                                    <span>인싸 냥이?</span>
                                </>
                            )}
                            {mode === 'dog' && (
                                <>
                                    <span>규율 멍멍이?</span>
                                    <span>파티 멍멍이?</span>
                                    <span>CEO 멍멍이?</span>
                                </>
                            )}
                        </div>
                    </div>

                    <p className="text-xs text-gray-400 text-center mb-2">⏱️ 약 3분 소요</p>

                    <button
                        onClick={() => setStep("question")}
                        className={`doodle-border w-full py-4 ${currentModeData.themeColor} text-xl font-bold text-gray-800 hover:opacity-90 mt-auto`}>
                        테스트 시작하기 ({maxQuestions}문항)
                    </button>
                </div>
            )}

            {step === "question" && (
                <div className="w-full flex-grow flex flex-col justify-between animate-pop h-full">
                    <div className="w-full bg-gray-200 rounded-full h-4 border-2 border-gray-800 mb-6">
                        <div className={`${currentModeData.themeColor} h-full rounded-full border-r-2 border-gray-800 progress-bar-fill`} style={{ width: `${((qIdx + 1) / maxQuestions) * 100}%` }}></div>
                    </div>
                    <div className="text-center flex-grow flex flex-col justify-center">
                        <span className={`text-xl ${currentModeData.themeColor.replace('bg', 'text')} font-bold mb-2`}>Q{qIdx + 1}.</span>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 break-keep leading-relaxed min-h-[80px] flex items-center justify-center">{questions[qIdx]?.q}</h2>
                        <IconComponent mood="excited" />
                    </div>
                    <div className="space-y-4 mt-8 mb-4">
                        {questions[qIdx]?.a.map((ans, idx) => (
                            <button key={idx} onClick={() => handleAnswer(questions[qIdx].type, ans.score)} className="doodle-border w-full p-4 bg-white hover:bg-gray-50 text-gray-700 text-lg font-medium text-left transition-colors break-keep leading-relaxed h-20 flex items-center">{ans.text}</button>
                        ))}
                    </div>
                </div>
            )}

            {step === "loading" && (
                <div className="text-center w-full flex-grow flex flex-col items-center justify-center h-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-8">결과를 뽑는 중...</h2>
                    <div className="animate-shake cursor-pointer"><Capsule /></div>
                    <p className="mt-8 text-gray-400 animate-pulse">두근두근...</p>
                </div>
            )}

            {step === "result" && finalType && (
                <div className={`text-center w-full flex-grow flex flex-col items-center animate-pop ${resultData.color} bg-opacity-50 p-4 rounded-3xl overflow-y-auto`}>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 flex-shrink-0"><span className="bg-white px-3 py-1 rounded-full border-2 border-gray-800 text-lg mr-2">{finalType}</span>{resultData.title}</h2>
                    <IconComponent mood={resultData.mood} className="w-32 h-32 mx-auto mb-4 flex-shrink-0" />

                    {isDeepMode && (
                        <button
                            onClick={() => setShowGraphPopup(true)}
                            className="doodle-border w-full py-2 bg-white text-gray-700 font-bold mb-4 hover:bg-gray-50 flex-shrink-0 text-sm"
                        >
                            📊 상세 성향 분석 보기
                        </button>
                    )}

                    <div className="bg-white p-4 rounded-xl border-2 border-gray-800 shadow-sm w-full mb-4 flex-shrink-0">
                        <p className="text-gray-700 text-lg break-keep leading-relaxed font-bold">" {resultData.desc} "</p>
                    </div>

                    {mode === 'human' ? (
                        <div className="w-full mb-4 flex-shrink-0">
                            <div className="bg-white rounded-2xl border-2 border-gray-800 shadow-sm p-4">
                                <div className="text-gray-700 text-sm leading-relaxed break-keep whitespace-pre-wrap space-y-4">
                                    <div>
                                        <h3 className="font-bold text-base mb-2 text-gray-800">💡 심층 해석</h3>
                                        <p>{resultData.interpretation}</p>
                                    </div>
                                    <div className="border-t pt-4">
                                        <h3 className="font-bold text-base mb-2 text-gray-800">🍀 성격 조언</h3>
                                        <p>{resultData.guide}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full mb-4 flex-shrink-0">
                            <div className="bg-white rounded-2xl border-2 border-gray-800 shadow-sm">
                                <div className="flex text-sm font-bold">
                                    {[
                                        { key: 'interpretation', label: '심층 해석' },
                                        { key: 'guide', label: '육아 팁' }
                                    ].map((tab, idx) => (
                                        <button
                                            key={tab.key}
                                            onClick={() => setDetailTab(tab.key)}
                                            className={`flex-1 py-3 px-2 transition-colors ${idx === 0 ? 'rounded-tl-xl' : ''} ${idx === 1 ? 'rounded-tr-xl' : ''} ${detailTab === tab.key ? 'bg-yellow-100 text-gray-800 border-b-2 border-yellow-400' : 'text-gray-400 bg-gray-50'} `}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="p-4 text-gray-700 text-sm leading-relaxed break-keep whitespace-pre-wrap">
                                    {detailTab === "interpretation" ? resultData.interpretation : resultData.guide}
                                </div>
                            </div>
                        </div>
                    )}

                    {!isDeepMode && (
                        <button onClick={startDeepTest} className="doodle-border w-full py-3 bg-indigo-500 text-white font-bold mb-4 animate-pulse hover:bg-indigo-600 transition-colors flex-shrink-0">
                            {mode === 'human' ? '내 성격' : mode === 'cat' ? '우리 냥이' : '우리 멍이'}, 이게 다가 아니다? (+24문항)
                        </button>
                    )}

                    <div className="w-full mt-auto pt-4 flex-shrink-0 pb-4">
                        <button onClick={() => restart()} className="doodle-border w-full py-3 bg-white font-bold text-gray-500 hover:bg-gray-100">다시 하기</button>
                    </div>
                </div>
            )}

            {/* Graph Popup */}
            {showGraphPopup && (
                <div className="fixed inset-0 modal-overlay flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-3xl p-6 w-full max-w-sm border-4 border-gray-800 shadow-2xl animate-pop relative">
                        <button
                            onClick={() => setShowGraphPopup(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                        >
                            <CloseIcon className="w-6 h-6" />
                        </button>
                        <h3 className="text-xl font-bold text-gray-800 mb-6 text-center">📊 상세 성향 분석</h3>
                        <TraitBar labelLeft="외향(E)" labelRight="내향(I)" scoreLeft={scores.E} scoreRight={scores.I} color="bg-red-400" />
                        <TraitBar labelLeft="감각(S)" labelRight="직관(N)" scoreLeft={scores.S} scoreRight={scores.N} color="bg-yellow-400" />
                        <TraitBar labelLeft="사고(T)" labelRight="감정(F)" scoreLeft={scores.T} scoreRight={scores.F} color="bg-green-400" />
                        <TraitBar labelLeft="판단(J)" labelRight="인식(P)" scoreLeft={scores.J} scoreRight={scores.P} color="bg-blue-400" />
                        <div className="mt-6 text-center">
                            <button
                                onClick={() => setShowGraphPopup(false)}
                                className="doodle-border px-6 py-2 bg-gray-100 font-bold text-gray-600 hover:bg-gray-200"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
