'use client';

import { useState, useMemo } from 'react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey, ResultLabel, SubjectData } from '@/data/types';
import { X, Trophy, Sparkles, RefreshCw, Share2, Star } from 'lucide-react';

// 뷰 모드 타입
type ViewMode = 'preview' | 'compare';

// 점수 계산 최댓값 (바 시각화용)
const MAX_SCORE_FOR_DISPLAY = 6;

// ============================================================================
// 랭킹 카테고리 정의
// ============================================================================

interface RankingCategory {
  id: string;
  name: string;
  emoji: string;
  description: string;
  // 점수 계산 함수: 높을수록 해당 카테고리에서 높은 순위
  getScore: (result: ResultLabel, data: SubjectData) => number;
}

// 테스트별 랭킹 카테고리 설정
const RANKING_CATEGORIES: Record<string, RankingCategory[]> = {
  // petMatch 전용 카테고리
  petMatch: [
    {
      id: 'activity',
      name: '활동성',
      emoji: '🏃',
      description: '활발하고 에너지 넘치는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.activity === 'high') score += 3;
        else if (c.activity === 'medium') score += 2;
        else if (c.activity === 'low') score += 1;
        if (c.time === 'high') score += 2;
        if (c.touch === 'high') score += 1;
        return score;
      }
    },
    {
      id: 'skinship',
      name: '스킨십',
      emoji: '🤗',
      description: '교감과 스킨십을 좋아하는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.touch === 'high') score += 3;
        else if (c.touch === 'medium') score += 2;
        else if (c.touch === 'low') score += 1;
        if (c.time === 'high') score += 1;
        return score;
      }
    },
    {
      id: 'easy',
      name: '초보 친화',
      emoji: '🌱',
      description: '키우기 쉬운 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 6; // 높은 점수에서 시작, 어려운 조건이면 감점
        if (c.activity === 'high') score -= 1;
        if (c.time === 'high') score -= 1;
        if (c.space === 'high') score -= 1;
        if (c.care === 'high') score -= 1;
        if (c.noise === 'high') score -= 1;
        return Math.max(0, score);
      }
    },
    {
      id: 'space',
      name: '공간',
      emoji: '🏠',
      description: '작은 공간에서도 가능한 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.space === 'low') score += 3;
        else if (c.space === 'medium') score += 2;
        else if (c.space === 'high') score += 1;
        if (c.noise === 'low') score += 1;
        return score;
      }
    },
    {
      id: 'quiet',
      name: '조용함',
      emoji: '🔇',
      description: '조용하고 독립적인 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.noise === 'low') score += 3;
        else if (c.noise === 'medium') score += 2;
        if (c.touch === 'low') score += 2;
        if (c.activity === 'low') score += 1;
        return score;
      }
    }
  ],

  // plant 전용 카테고리
  plant: [
    {
      id: 'easy',
      name: '초보 추천',
      emoji: '🌱',
      description: '관리가 쉬운 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 6;
        if (c.care === 'high') score -= 2;
        if (c.water === 'high') score -= 1;
        if (c.light === 'high') score -= 1;
        return Math.max(0, score);
      }
    },
    {
      id: 'lowlight',
      name: '음지 OK',
      emoji: '🌙',
      description: '햇빛 적어도 되는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.light === 'low') score += 3;
        else if (c.light === 'medium') score += 2;
        return score;
      }
    },
    {
      id: 'neglect',
      name: '방치 가능',
      emoji: '😴',
      description: '물 잘 안 줘도 되는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.water === 'low') score += 3;
        else if (c.water === 'medium') score += 2;
        if (c.care === 'low') score += 2;
        return score;
      }
    }
  ],

  // coffee 전용 카테고리
  coffee: [
    {
      id: 'strong',
      name: '진한 맛',
      emoji: '💪',
      description: '진하고 강한 맛 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.bitter === 'high') score += 3;
        if (c.caffeine === 'high') score += 2;
        if (c.sweet === 'low') score += 1;
        return score;
      }
    },
    {
      id: 'sweet',
      name: '달달함',
      emoji: '🍬',
      description: '달콤한 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.sweet === 'high') score += 3;
        else if (c.sweet === 'medium') score += 2;
        if (c.bitter === 'low') score += 1;
        return score;
      }
    },
    {
      id: 'refresh',
      name: '상쾌함',
      emoji: '🧊',
      description: '시원하고 상쾌한 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        if (c.temperature === 'low') score += 3; // 차가운
        // mood는 result 직접 속성
        if (result.mood === 'refresh' || result.mood === 'cool') score += 2;
        return score;
      }
    }
  ],

  // 기본 카테고리 (성격 테스트 등)
  default: [
    {
      id: 'energy',
      name: '에너지',
      emoji: '⚡',
      description: '활발하고 에너지 넘치는 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        // 다양한 활동성 관련 차원 체크
        ['activity', 'energy', 'active', 'inssa', 'adventure'].forEach(key => {
          if (c[key] === 'high') score += 2;
          else if (c[key] === 'medium') score += 1;
        });
        return score;
      }
    },
    {
      id: 'social',
      name: '사교성',
      emoji: '💬',
      description: '사교적이고 친화적인 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        ['social', 'inssa', 'humanLove', 'dogFriend', 'cute', 'express'].forEach(key => {
          if (c[key] === 'high') score += 2;
          else if (c[key] === 'medium') score += 1;
        });
        return score;
      }
    },
    {
      id: 'calm',
      name: '차분함',
      emoji: '🧘',
      description: '차분하고 신중한 순',
      getScore: (result) => {
        const c = result.condition;
        let score = 0;
        ['plan', 'chill', 'focus', 'persist'].forEach(key => {
          if (c[key] === 'high') score += 2;
          else if (c[key] === 'medium') score += 1;
        });
        // 낮은 활동성도 점수 추가
        ['activity', 'energy', 'active', 'inssa'].forEach(key => {
          if (c[key] === 'low') score += 1;
        });
        return score;
      }
    }
  ]
};

// ============================================================================
// 컴포넌트
// ============================================================================

interface ResultRankingViewProps {
  testType: SubjectKey;
  viewMode?: ViewMode;        // 'preview' (기본) | 'compare'
  myResult?: ResultLabel;     // compare 모드일 때 내 결과
  onClose: () => void;
  onStartTest?: () => void;   // preview 모드
  onRestart?: () => void;     // compare 모드
  onShare?: () => void;       // compare 모드
}

export default function ResultRankingView({
  testType,
  viewMode = 'preview',
  myResult,
  onClose,
  onStartTest,
  onRestart,
  onShare
}: ResultRankingViewProps) {
  const data = CHEMI_DATA[testType] as SubjectData | undefined;
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const isCompareMode = viewMode === 'compare' && myResult;

  // 해당 테스트의 랭킹 카테고리 가져오기
  const categories = useMemo(() => {
    return RANKING_CATEGORIES[testType] || RANKING_CATEGORIES.default;
  }, [testType]);

  // 선택된 카테고리의 랭킹 계산
  const rankedResults = useMemo(() => {
    if (!data || !selectedCategory) return null;

    const category = categories.find(c => c.id === selectedCategory);
    if (!category) return null;

    const resultsWithScores = data.resultLabels.map(result => ({
      result,
      score: category.getScore(result, data),
      isMyResult: isCompareMode && result.name === myResult?.name
    }));

    // 점수순 정렬
    return resultsWithScores
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({
        ...item,
        rank: index + 1
      }));
  }, [data, selectedCategory, categories, isCompareMode, myResult]);

  // 내 결과의 순위 찾기 (compare 모드용)
  const myRank = useMemo(() => {
    if (!rankedResults || !isCompareMode) return null;
    const found = rankedResults.find(r => r.isMyResult);
    return found?.rank || null;
  }, [rankedResults, isCompareMode]);

  if (!data) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl p-6 text-center">
          <p className="text-gray-500">데이터를 불러올 수 없습니다</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded-lg">
            닫기
          </button>
        </div>
      </div>
    );
  }

  const totalResults = data.resultLabels.length;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-xl overflow-hidden">
        {/* 헤더 */}
        <div className={`px-5 py-4 flex items-center justify-between shrink-0 ${
          isCompareMode
            ? 'bg-gradient-to-r from-amber-500 to-orange-500'
            : 'bg-gradient-to-r from-indigo-500 to-purple-500'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              {isCompareMode ? <Star className="w-5 h-5 text-white" /> : <Trophy className="w-5 h-5 text-white" />}
            </div>
            <div className="text-white">
              <h2 className="font-bold">
                {isCompareMode ? '내 결과 순위 비교' : data.title}
              </h2>
              <p className="text-white/80 text-xs">
                {isCompareMode
                  ? `${myResult?.emoji} ${myResult?.name}`
                  : `${totalResults}가지 결과 미리보기`}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 overflow-y-auto p-4">
          {!selectedCategory ? (
            // 카테고리 선택 화면
            <div className="space-y-4">
              {/* compare 모드: 내 결과 카드 */}
              {isCompareMode && myResult && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border-2 border-amber-300">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{myResult.emoji}</span>
                    <div className="flex-1">
                      <p className="text-xs text-amber-600 font-bold mb-1">내 결과</p>
                      <p className="font-bold text-gray-800 text-lg">{myResult.name}</p>
                      <p className="text-xs text-gray-500 line-clamp-1">{myResult.desc}</p>
                    </div>
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                  </div>
                </div>
              )}

              {/* 전체 결과 미리보기 */}
              <div className="bg-gray-50 rounded-xl p-4">
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-500" />
                  {isCompareMode ? '다른 결과들' : '모든 결과 타입'}
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {data.resultLabels.map((result, idx) => {
                    const isMyResultItem = isCompareMode && result.name === myResult?.name;
                    return (
                      <div
                        key={idx}
                        className={`rounded-lg p-2 text-center border transition-all ${
                          isMyResultItem
                            ? 'bg-amber-100 border-amber-300 ring-2 ring-amber-400'
                            : 'bg-white border-gray-100'
                        }`}
                      >
                        <span className="text-2xl block mb-1">{result.emoji}</span>
                        <span className={`text-xs font-medium line-clamp-1 ${
                          isMyResultItem ? 'text-amber-700' : 'text-gray-700'
                        }`}>
                          {result.name}
                        </span>
                        {isMyResultItem && (
                          <span className="text-[10px] text-amber-600 font-bold">← 나</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 랭킹 카테고리 */}
              <div>
                <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  {isCompareMode ? '카테고리별 내 순위 확인' : '재미있는 랭킹 보기'}
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className="w-full flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-left group"
                    >
                      <span className="text-2xl">{category.emoji}</span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-800 group-hover:text-indigo-600">
                          {category.name} 랭킹
                        </p>
                        <p className="text-xs text-gray-500">{category.description}</p>
                      </div>
                      <span className="text-gray-400 group-hover:text-indigo-500">→</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // 랭킹 결과 화면
            <div className="space-y-4">
              {/* 뒤로가기 */}
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-sm text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
              >
                ← 카테고리 선택으로
              </button>

              {/* 랭킹 타이틀 + compare 모드일 때 내 순위 표시 */}
              {(() => {
                const selected = categories.find(c => c.id === selectedCategory);
                if (!selected) return null;
                return (
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-200">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{selected.emoji}</span>
                        <h3 className="font-bold text-gray-800">{selected.name} 랭킹</h3>
                      </div>
                      {isCompareMode && myRank && (
                        <span className="px-3 py-1 bg-amber-500 text-white text-sm font-bold rounded-full">
                          내 순위: {myRank}위
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{selected.description}</p>
                  </div>
                );
              })()}

              {/* 랭킹 리스트 */}
              <div className="space-y-2">
                {rankedResults?.map(({ result, rank, score, isMyResult }) => (
                  <div
                    key={result.name}
                    className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isMyResult
                        ? 'bg-amber-100 border-amber-400 ring-2 ring-amber-400 shadow-md'
                        : rank === 1
                        ? 'bg-amber-50 border-amber-300'
                        : rank === 2
                        ? 'bg-gray-50 border-gray-300'
                        : rank === 3
                        ? 'bg-orange-50 border-orange-200'
                        : 'bg-white border-gray-100'
                    }`}
                  >
                    {/* 순위 */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isMyResult
                        ? 'bg-amber-500 text-white'
                        : rank === 1
                        ? 'bg-amber-400 text-white'
                        : rank === 2
                        ? 'bg-gray-400 text-white'
                        : rank === 3
                        ? 'bg-orange-400 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : rank}
                    </div>

                    {/* 결과 정보 */}
                    <span className="text-2xl">{result.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={`font-bold ${isMyResult ? 'text-amber-800' : 'text-gray-800'}`}>
                          {result.name}
                        </p>
                        {isMyResult && (
                          <span className="px-1.5 py-0.5 bg-amber-500 text-white text-[10px] font-bold rounded">
                            나
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-1">{result.desc}</p>
                    </div>

                    {/* 점수 바 (시각화) */}
                    <div className="w-16">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isMyResult
                              ? 'bg-amber-500'
                              : rank === 1
                              ? 'bg-amber-400'
                              : rank === 2
                              ? 'bg-gray-400'
                              : rank === 3
                              ? 'bg-orange-400'
                              : 'bg-indigo-300'
                          }`}
                          style={{ width: `${Math.min(100, (score / MAX_SCORE_FOR_DISPLAY) * 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 하단 CTA - 모드별 다른 버튼 (버튼 없으면 영역 숨김) */}
        {(isCompareMode ? (onRestart || onShare) : onStartTest) && (
          <div className="shrink-0 p-4 border-t border-gray-100 bg-gray-50">
            {isCompareMode ? (
              // compare 모드: 다시하기 + 공유 버튼
              <div className="flex gap-2">
                {onRestart && (
                  <button
                    onClick={() => {
                      onRestart();
                      onClose();
                    }}
                    className="flex-1 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    다시하기
                  </button>
                )}
                {onShare && (
                  <button
                    onClick={onShare}
                    className="flex-1 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                  >
                    <Share2 className="w-4 h-4" />
                    공유하기
                  </button>
                )}
              </div>
            ) : (
              // preview 모드: 테스트 시작 버튼
              <button
                onClick={() => {
                  onStartTest!();
                  onClose();
                }}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold rounded-xl hover:from-indigo-600 hover:to-purple-600 transition-all active:scale-[0.98]"
              >
                테스트하고 내 결과 확인하기 →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
