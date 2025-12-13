/**
 * TestHeader - 테스트 진행 중 상단 네비게이션 바
 *
 * 기능:
 * - 이전 질문으로 돌아가기 (첫 질문이면 중단 확인)
 * - 현재 테스트 이름 표시
 * - 진행률 표시
 */

(function (window) {
    'use strict';

    const { createElement: h } = React;

    // 뒤로가기 아이콘
    const BackIcon = () => h('svg', {
        className: 'w-6 h-6',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
    }, h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M15 19l-7-7 7-7'
    }));

    // 종료(X) 아이콘
    const CloseIcon = () => h('svg', {
        className: 'w-6 h-6',
        fill: 'none',
        stroke: 'currentColor',
        viewBox: '0 0 24 24'
    }, h('path', {
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        strokeWidth: 2,
        d: 'M6 18L18 6M6 6l12 12'
    }));

    // 진행률 점 표시
    const ProgressDots = ({ current, total, themeColor }) => {
        const maxDots = 10;
        const dotsToShow = Math.min(total, maxDots);
        const filledDots = Math.round((current / total) * dotsToShow);

        return h('div', { className: 'flex gap-1 items-center' },
            // 숫자 표시
            h('span', { className: 'text-xs text-gray-500 mr-1' }, `${current}/${total}`),
            // 점들
            Array.from({ length: dotsToShow }, (_, i) =>
                h('div', {
                    key: i,
                    className: `w-2 h-2 rounded-full transition-colors ${i < filledDots
                        ? themeColor
                        : 'bg-gray-300'
                        }`
                })
            )
        );
    };

    // 테스트 중단 확인 모달
    const ExitModal = ({ isOpen, onConfirm, onCancel, testName }) => {
        if (!isOpen) return null;

        return h('div', {
            className: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'
        },
            h('div', {
                className: 'bg-white rounded-2xl p-6 w-full max-w-xs border-4 border-gray-800 shadow-xl animate-pop'
            },
                h('h3', { className: 'text-lg font-bold text-gray-800 mb-2 text-center' },
                    '테스트를 중단할까요?'
                ),
                h('p', { className: 'text-sm text-gray-500 mb-6 text-center' },
                    '진행한 내용은 저장되지 않아요'
                ),
                h('div', { className: 'flex gap-3' },
                    h('button', {
                        onClick: onCancel,
                        className: 'flex-1 py-3 px-4 bg-gray-100 rounded-xl font-bold text-gray-600 hover:bg-gray-200 transition-colors'
                    }, '계속하기'),
                    h('button', {
                        onClick: onConfirm,
                        className: 'flex-1 py-3 px-4 bg-red-500 rounded-xl font-bold text-white hover:bg-red-600 transition-colors'
                    }, '나가기')
                )
            )
        );
    };

    // 메인 TestHeader 컴포넌트
    const TestHeader = ({
        testName,
        currentQuestion,  // 0-indexed
        totalQuestions,
        themeColor = 'bg-yellow-400',
        onBack,           // 이전 질문으로
        onExit,           // 테스트 나가기
        canGoBack = true  // 뒤로가기 가능 여부
    }) => {
        const [showExitModal, setShowExitModal] = React.useState(false);

        const handleBackClick = () => {
            if (currentQuestion === 0) {
                // 첫 질문이면 나가기 확인
                setShowExitModal(true);
            } else if (onBack) {
                // 이전 질문으로
                onBack();
            }
        };

        const handleExitConfirm = () => {
            setShowExitModal(false);
            if (onExit) onExit();
        };

        return h(React.Fragment, null,
            // 헤더 바
            h('div', {
                className: 'flex items-center justify-between h-12 mb-4 -mx-2 px-2'
            },
                // 왼쪽: 뒤로가기 버튼
                h('button', {
                    onClick: handleBackClick,
                    className: 'w-11 h-11 flex items-center justify-center rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-600',
                    'aria-label': currentQuestion === 0 ? '테스트 나가기' : '이전 질문'
                }, h(BackIcon)),

                // 중앙: 테스트 이름
                h('span', {
                    className: 'text-sm font-bold text-gray-700 truncate px-2'
                }, testName),

                // 오른쪽: 진행률 및 종료 버튼
                h('div', { className: 'flex items-center gap-3' },
                    h(ProgressDots, {
                        current: currentQuestion + 1,
                        total: totalQuestions,
                        themeColor
                    }),
                    h('button', {
                        onClick: () => setShowExitModal(true),
                        className: 'p-1 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors text-gray-400',
                        'aria-label': '테스트 종료'
                    }, h(CloseIcon))
                )
            ),

            // 중단 확인 모달
            h(ExitModal, {
                isOpen: showExitModal,
                onConfirm: handleExitConfirm,
                onCancel: () => setShowExitModal(false),
                testName
            })
        );
    };

    // 전역 노출
    window.TestHeader = TestHeader;
    window.ExitModal = ExitModal;

})(window);
