'use client';
import { createElement as h, useState, useEffect } from 'react';
import { insightService } from '../services/InsightService';
import * as Icons from './Icons';

// 로딩 스피너
const LoadingSpinner = () => h('div', {
    className: 'flex flex-col items-center justify-center py-12'
},
    h('div', {
        className: 'w-12 h-12 border-4 border-gray-200 border-t-yellow-400 rounded-full animate-spin'
    }),
    h('p', { className: 'mt-4 text-gray-500' }, '인사이트 분석 중...')
);

// 진행률 바
const ProgressBar = ({ value, color = 'bg-yellow-400' }) => h('div', {
    className: 'w-full bg-gray-200 rounded-full h-3'
},
    h('div', {
        className: `${color} h-full rounded-full transition-all duration-500`,
        style: { width: `${value}%` }
    })
);

// 인사이트 카드
const InsightCard = ({ emoji, title, content, type }) => {
    const bgColors = {
        personality: 'bg-purple-50 border-purple-200',
        animal: 'bg-yellow-50 border-yellow-200',
        relationship: 'bg-pink-50 border-pink-200',
        lifestyle: 'bg-green-50 border-green-200',
        progress: 'bg-blue-50 border-blue-200',
        complete: 'bg-gradient-to-r from-yellow-50 to-pink-50 border-yellow-300'
    };

    return h('div', {
        className: `p-4 rounded-xl border-2 ${bgColors[type] || 'bg-gray-50 border-gray-200'} mb-3`
    },
        h('div', { className: 'flex items-start gap-3' },
            h('span', { className: 'text-2xl flex-shrink-0' }, emoji),
            h('div', { className: 'flex-1 min-w-0' },
                h('h4', { className: 'font-bold text-gray-800 text-sm' }, title),
                h('p', { className: 'text-gray-600 text-sm mt-1 break-keep' }, content)
            )
        )
    );
};

// 동물 호환성 카드
const AnimalCompatCard = ({ animal, isTop }) => {
    const levelColors = {
        high: 'border-green-400 bg-green-50',
        medium: 'border-blue-400 bg-blue-50',
        low: 'border-yellow-400 bg-yellow-50',
        mismatch: 'border-gray-300 bg-gray-50'
    };

    return h('div', {
        className: `p-3 rounded-xl border-2 ${levelColors[animal.matchLevel?.level] || 'border-gray-200'} ${isTop ? 'ring-2 ring-yellow-400' : ''}`
    },
        h('div', { className: 'flex items-center justify-between mb-2' },
            h('div', { className: 'flex items-center gap-2' },
                h('span', { className: 'text-xl' }, animal.emoji || '🐾'),
                h('span', { className: 'font-bold text-gray-800' }, animal.name)
            ),
            h('span', {
                className: `text-sm font-bold ${animal.matchLevel?.color || 'text-gray-500'}`
            }, `${animal.similarity}%`)
        ),
        h('div', { className: 'mb-2' },
            h(ProgressBar, { value: animal.similarity, color: 'bg-yellow-400' })
        ),
        h('p', { className: 'text-xs text-gray-500' }, animal.insight),
        isTop && h('span', {
            className: 'inline-block mt-2 text-xs bg-yellow-400 text-gray-800 px-2 py-1 rounded-full font-bold'
        }, '🏆 Best Match!')
    );
};

// 추천 테스트 버튼
const RecommendationButton = ({ rec, onSelect }) => {
    const IconComponent = rec.icon ? Icons[rec.icon] : null;

    return h('button', {
        onClick: () => onSelect(rec.testType),
        className: 'w-full flex items-center gap-3 p-3 bg-white rounded-xl border-2 border-gray-200 hover:border-yellow-400 hover:bg-yellow-50 transition-all text-left'
    },
        IconComponent && h('div', { className: 'w-10 h-10 flex-shrink-0' },
            h(IconComponent, { mood: 'happy' })
        ),
        h('div', { className: 'flex-1 min-w-0' },
            h('p', { className: 'font-bold text-gray-800 text-sm' }, rec.title),
            h('p', { className: 'text-xs text-gray-500 truncate' }, rec.reason)
        ),
        h('span', { className: 'text-gray-400' }, '→')
    );
};

// 빈 상태
const EmptyState = ({ onStartTest }) => h('div', {
    className: 'flex flex-col items-center justify-center py-12 text-center'
},
    h('span', { className: 'text-6xl mb-4' }, '🔮'),
    h('h3', { className: 'text-xl font-bold text-gray-800 mb-2' }, '아직 인사이트가 없어요'),
    h('p', { className: 'text-gray-500 mb-6' }, '테스트를 완료하면 통합 분석을 해드려요!'),
    h('button', {
        onClick: onStartTest,
        className: 'px-6 py-3 bg-yellow-400 rounded-xl font-bold text-gray-800 hover:bg-yellow-500 transition-colors'
    }, '테스트 시작하기')
);

// 메인 InsightView 컴포넌트
export default function InsightView({ onClose, onSelectTest }) {
    const [insights, setInsights] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('summary');

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        setLoading(true);
        try {
            const data = await insightService.generateInsights();
            setInsights(data);
        } catch (error) {
            console.error('[InsightView] 인사이트 로드 실패:', error);
            setInsights({ hasData: false, message: '인사이트를 불러오지 못했어요.' });
        }
        setLoading(false);
    };

    // 탭 버튼
    const TabButton = ({ id, label, isActive }) => h('button', {
        onClick: () => setActiveTab(id),
        className: `flex-1 py-2 px-3 text-sm font-bold transition-colors ${isActive
                ? 'bg-yellow-400 text-gray-800 rounded-lg'
                : 'text-gray-500 hover:text-gray-700'
            }`
    }, label);

    // 로딩 중
    if (loading) {
        return h('div', {
            className: 'fixed inset-0 bg-white z-50 flex items-center justify-center'
        }, h(LoadingSpinner));
    }

    // 데이터 없음
    if (!insights?.hasData) {
        return h('div', {
            className: 'fixed inset-0 bg-white z-50 p-4 overflow-y-auto'
        },
            h('div', { className: 'max-w-md mx-auto' },
                h('div', { className: 'flex justify-between items-center mb-6' },
                    h('h2', { className: 'text-xl font-bold text-gray-800' }, '🔮 통합 인사이트'),
                    h('button', {
                        onClick: onClose,
                        className: 'w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100'
                    }, '✕')
                ),
                h(EmptyState, { onStartTest: () => { onClose(); onSelectTest('human'); } })
            )
        );
    }

    // 메인 콘텐츠
    return h('div', {
        className: 'fixed inset-0 bg-white z-50 overflow-y-auto'
    },
        h('div', { className: 'max-w-md mx-auto p-4 pb-20' },
            // 헤더
            h('div', { className: 'flex justify-between items-center mb-4' },
                h('h2', { className: 'text-xl font-bold text-gray-800' }, '🔮 통합 인사이트'),
                h('button', {
                    onClick: onClose,
                    className: 'w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500'
                }, '✕')
            ),

            // 완료율
            h('div', { className: 'bg-gray-100 rounded-xl p-4 mb-4' },
                h('div', { className: 'flex justify-between items-center mb-2' },
                    h('span', { className: 'text-sm font-bold text-gray-700' }, '테스트 완료율'),
                    h('span', { className: 'text-sm font-bold text-yellow-600' },
                        `${Math.round(insights.completionRate * 100)}%`
                    )
                ),
                h(ProgressBar, { value: insights.completionRate * 100 }),
                h('p', { className: 'text-xs text-gray-500 mt-2' },
                    `${insights.completedTests.length}/9 테스트 완료 (총 ${insights.totalTestsTaken}회 진행)`
                )
            ),

            // 탭
            h('div', { className: 'flex bg-gray-100 rounded-xl p-1 mb-4' },
                h(TabButton, { id: 'summary', label: '요약', isActive: activeTab === 'summary' }),
                h(TabButton, { id: 'details', label: '상세', isActive: activeTab === 'details' }),
                h(TabButton, { id: 'recommend', label: '추천', isActive: activeTab === 'recommend' })
            ),

            // 탭 콘텐츠
            activeTab === 'summary' && h('div', null,
                // 인사이트 메시지들
                insights.summaryMessages?.map((msg, idx) =>
                    h(InsightCard, {
                        key: idx,
                        emoji: msg.emoji,
                        title: msg.title,
                        content: msg.content,
                        type: msg.type
                    })
                )
            ),

            activeTab === 'details' && h('div', null,
                // 성격 프로필
                insights.personalityProfile && h('div', { className: 'mb-6' },
                    h('h3', { className: 'font-bold text-gray-800 mb-3 flex items-center gap-2' },
                        h('span', null, '👤'),
                        '성격 프로필'
                    ),
                    h('div', { className: 'bg-purple-50 rounded-xl p-4 border-2 border-purple-200' },
                        h('div', { className: 'flex items-center gap-2 mb-3' },
                            h('span', { className: 'text-2xl' }, insights.personalityProfile.resultEmoji),
                            h('span', { className: 'font-bold text-gray-800' }, insights.personalityProfile.resultName)
                        ),
                        h('p', { className: 'text-sm text-gray-600 mb-3' }, insights.personalityProfile.summary),
                        h('div', { className: 'space-y-2' },
                            insights.personalityProfile.dimensions?.slice(0, 5).map((dim, idx) =>
                                h('div', { key: dim.dimension, className: 'flex items-center gap-2' },
                                    h('span', { className: 'text-xs w-16 text-gray-600' }, dim.name),
                                    h('div', { className: 'flex-1' },
                                        h(ProgressBar, {
                                            value: dim.normalized * 100,
                                            color: idx < 2 ? 'bg-purple-400' : 'bg-gray-300'
                                        })
                                    ),
                                    h('span', { className: 'text-xs w-8 text-right text-gray-500' },
                                        `${Math.round(dim.normalized * 100)}%`
                                    )
                                )
                            )
                        )
                    )
                ),

                // 동물 호환성
                insights.animalCompatibility && h('div', { className: 'mb-6' },
                    h('h3', { className: 'font-bold text-gray-800 mb-3 flex items-center gap-2' },
                        h('span', null, '🐾'),
                        '동물 케미'
                    ),
                    h('div', { className: 'space-y-3' },
                        insights.animalCompatibility.animals?.map((animal, idx) =>
                            h(AnimalCompatCard, {
                                key: animal.type,
                                animal,
                                isTop: idx === 0
                            })
                        )
                    )
                ),

                // 관계 프로필
                insights.relationshipProfile && h('div', { className: 'mb-6' },
                    h('h3', { className: 'font-bold text-gray-800 mb-3 flex items-center gap-2' },
                        h('span', null, '💕'),
                        '연애 스타일'
                    ),
                    h('div', { className: 'bg-pink-50 rounded-xl p-4 border-2 border-pink-200' },
                        h('div', { className: 'flex items-center gap-2 mb-3' },
                            h('span', { className: 'text-2xl' }, insights.relationshipProfile.resultEmoji),
                            h('span', { className: 'font-bold text-gray-800' }, insights.relationshipProfile.resultName)
                        ),
                        h('p', { className: 'text-sm text-gray-600 mb-3' }, insights.relationshipProfile.summary),
                        h('div', { className: 'flex flex-wrap gap-2' },
                            insights.relationshipProfile.compatibleTypes?.map((type, idx) =>
                                h('span', {
                                    key: idx,
                                    className: 'text-xs bg-pink-200 text-pink-800 px-2 py-1 rounded-full'
                                }, type)
                            )
                        )
                    )
                ),

                // 라이프스타일
                insights.lifestyleProfile && h('div', { className: 'mb-6' },
                    h('h3', { className: 'font-bold text-gray-800 mb-3 flex items-center gap-2' },
                        h('span', null, '🌈'),
                        '라이프스타일'
                    ),
                    h('div', { className: 'bg-green-50 rounded-xl p-4 border-2 border-green-200' },
                        h('p', { className: 'text-sm text-gray-600' }, insights.lifestyleProfile.summary)
                    )
                ),

                // 데이터 없으면 안내
                !insights.personalityProfile && !insights.animalCompatibility &&
                !insights.relationshipProfile && !insights.lifestyleProfile &&
                h('div', { className: 'text-center py-8 text-gray-500' },
                    '더 많은 테스트를 완료하면 상세 분석이 나와요!'
                )
            ),

            activeTab === 'recommend' && h('div', null,
                insights.recommendations?.length > 0 ? h('div', null,
                    h('p', { className: 'text-sm text-gray-500 mb-4' },
                        '더 정확한 인사이트를 위해 추천드려요!'
                    ),
                    h('div', { className: 'space-y-3' },
                        insights.recommendations.map(rec =>
                            h(RecommendationButton, {
                                key: rec.testType,
                                rec,
                                onSelect: (testType) => {
                                    onClose();
                                    onSelectTest(testType);
                                }
                            })
                        )
                    )
                ) : h('div', { className: 'text-center py-8' },
                    h('span', { className: 'text-4xl mb-4 block' }, '🎉'),
                    h('p', { className: 'font-bold text-gray-800' }, '모든 테스트를 완료했어요!'),
                    h('p', { className: 'text-sm text-gray-500 mt-2' }, '다시 테스트해서 변화를 확인해보세요.')
                )
            )
        )
    );
};
