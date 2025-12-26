'use client';

// ============================================================================
// 콘텐츠 현황 대시보드 - 자동 집계
// ============================================================================

import { useMemo } from 'react';
import {
  BarChart3,
  HelpCircle,
  Vote,
  MessageSquare,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  Trophy,
} from 'lucide-react';

import ContentValidityManager from './ContentValidityManager';

// 콘텐츠 데이터 import (레지스트리에서 통합 배열 사용 - 타로 포함)
import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS, CHOICE_POLLS } from '@/data/content/polls';
import { ALL_SITUATION_REACTIONS } from '@/data/content/situation-reactions';
import { ZODIAC_FORTUNES_2025, ZODIAC_POLLS, CONSTELLATIONS, ALL_DAILY_MESSAGES, LUCKY_TIPS } from '@/data/content/fortune';
import { TIER_TOURNAMENTS, TOURNAMENT_STATS } from '@/data/content/tournaments';
import { CATEGORY_LABELS } from '@/data/content/categories';
import type { ContentCategory, SituationCategory } from '@/data/content/types';

// ============================================================================
// Types
// ============================================================================

interface ContentTypeStats {
  name: string;
  count: number;
  icon: React.ReactNode;
  color: string;
  subTypes?: { name: string; count: number }[];
}

interface CategoryStats {
  category: string;
  label: string;
  emoji: string;
  quizzes: number;
  polls: number;
  situationReactions: number;
  total: number;
}

// ============================================================================
// Component
// ============================================================================

export default function ContentOverview() {
  // 자동 집계 통계
  const stats = useMemo(() => {
    // 콘텐츠 타입별 통계 (타로는 레지스트리에 통합됨)
    const contentTypes: ContentTypeStats[] = [
      {
        name: '퀴즈',
        count: ALL_KNOWLEDGE_QUIZZES.length + ALL_SCENARIO_QUIZZES.length,
        icon: <HelpCircle className="w-5 h-5" />,
        color: 'bg-blue-500',
        subTypes: [
          { name: '지식 퀴즈', count: ALL_KNOWLEDGE_QUIZZES.length },
          { name: '시나리오 퀴즈', count: ALL_SCENARIO_QUIZZES.length },
        ],
      },
      {
        name: '투표',
        count: VS_POLLS.length + CHOICE_POLLS.length,
        icon: <Vote className="w-5 h-5" />,
        color: 'bg-purple-500',
        subTypes: [
          { name: 'VS 투표', count: VS_POLLS.length },
          { name: '선택 투표', count: CHOICE_POLLS.length },
        ],
      },
      {
        name: '상황별 반응',
        count: ALL_SITUATION_REACTIONS.length,
        icon: <MessageSquare className="w-5 h-5" />,
        color: 'bg-green-500',
        subTypes: [
          { name: '연애/관계', count: ALL_SITUATION_REACTIONS.filter(s => s.category === 'relationship').length },
          { name: '직장', count: ALL_SITUATION_REACTIONS.filter(s => s.category === 'work').length },
          { name: '사회/친구', count: ALL_SITUATION_REACTIONS.filter(s => s.category === 'social').length },
        ],
      },
      {
        name: '운세',
        count: ZODIAC_FORTUNES_2025.length + ZODIAC_POLLS.length + CONSTELLATIONS.length + ALL_DAILY_MESSAGES.length + LUCKY_TIPS.length,
        icon: <Sparkles className="w-5 h-5" />,
        color: 'bg-amber-500',
        subTypes: [
          { name: '띠별 운세', count: ZODIAC_FORTUNES_2025.length },
          { name: '별자리', count: CONSTELLATIONS.length },
          { name: '운세 투표', count: ZODIAC_POLLS.length },
          { name: '일일 메시지', count: ALL_DAILY_MESSAGES.length },
          { name: '행운 팁', count: LUCKY_TIPS.length },
        ],
      },
      {
        name: '티어 토너먼트',
        count: TIER_TOURNAMENTS.length,
        icon: <Trophy className="w-5 h-5" />,
        color: 'bg-orange-500',
        subTypes: (() => {
          const byCategory = TOURNAMENT_STATS.byCategory();
          return Object.entries(byCategory).map(([cat, count]) => ({
            name: CATEGORY_LABELS[cat as ContentCategory]?.name || cat,
            count: count as number,
          }));
        })(),
      },
    ];

    // 카테고리별 통계 (모든 콘텐츠 직접 집계)
    // 1. 퀴즈 집계 (지식 + 시나리오, 타로는 지식 퀴즈에 포함됨)
    const allQuizzes = [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES];
    const quizByCategory: Record<string, number> = {};
    allQuizzes.forEach(q => {
      quizByCategory[q.category] = (quizByCategory[q.category] || 0) + 1;
    });

    // 2. 투표 집계 (VS + Choice, 타로는 각각에 포함됨)
    const allPolls = [...VS_POLLS, ...CHOICE_POLLS];
    const pollByCategory: Record<string, number> = {};
    allPolls.forEach(p => {
      pollByCategory[p.category] = (pollByCategory[p.category] || 0) + 1;
    });

    // 3. 상황반응 집계
    const situationByCategory: Record<string, number> = {};
    ALL_SITUATION_REACTIONS.forEach(s => {
      situationByCategory[s.category] = (situationByCategory[s.category] || 0) + 1;
    });

    // 4. 모든 카테고리 수집 (콘텐츠 카테고리 + 상황 카테고리)
    const allCategories = new Set([
      ...Object.keys(quizByCategory),
      ...Object.keys(pollByCategory),
      ...Object.keys(situationByCategory),
    ]);

    const categoryStats: CategoryStats[] = Array.from(allCategories)
      .map(cat => {
        const info = CATEGORY_LABELS[cat as ContentCategory];
        const quizCount = quizByCategory[cat] || 0;
        const pollCount = pollByCategory[cat] || 0;
        const situationCount = situationByCategory[cat] || 0;
        return {
          category: cat,
          label: info?.name || cat,
          emoji: info?.emoji || '📊',
          quizzes: quizCount,
          polls: pollCount,
          situationReactions: situationCount,
          total: quizCount + pollCount + situationCount,
        };
      })
      .filter(c => c.total > 0)
      .sort((a, b) => b.total - a.total);

    // 전체 통계
    const totalContent = contentTypes.reduce((sum, ct) => sum + ct.count, 0);

    return { contentTypes, categoryStats, totalContent };
  }, []);

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">콘텐츠 현황</h2>
          <p className="text-gray-500 mt-1">실시간 자동 집계 · 파일 수정 시 자동 반영</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span className="text-green-700 font-medium">총 {stats.totalContent.toLocaleString()}개</span>
        </div>
      </div>

      {/* 콘텐츠 타입별 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.contentTypes.map((type) => (
          <div
            key={type.name}
            className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-lg ${type.color} text-white`}>
                {type.icon}
              </div>
              <span className="text-2xl font-bold text-gray-900">{type.count}</span>
            </div>
            <h3 className="font-semibold text-gray-900 mb-3">{type.name}</h3>
            {type.subTypes && (
              <div className="space-y-1.5">
                {type.subTypes.map((sub) => (
                  <div key={sub.name} className="flex justify-between text-sm">
                    <span className="text-gray-500">{sub.name}</span>
                    <span className="text-gray-700 font-medium">{sub.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 카테고리별 분포 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-gray-600" />
          카테고리별 분포
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {stats.categoryStats.map((cat) => (
            <div
              key={cat.category}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 truncate">{cat.label}</div>
                <div className="text-sm text-gray-500">
                  {cat.quizzes > 0 && <span>퀴즈 {cat.quizzes}</span>}
                  {cat.quizzes > 0 && (cat.polls > 0 || cat.situationReactions > 0) && <span> · </span>}
                  {cat.polls > 0 && <span>투표 {cat.polls}</span>}
                  {cat.polls > 0 && cat.situationReactions > 0 && <span> · </span>}
                  {cat.situationReactions > 0 && <span>상황 {cat.situationReactions}</span>}
                </div>
              </div>
              <div className="text-lg font-bold text-gray-900">{cat.total}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 콘텐츠 비율 차트 */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-gray-600" />
          콘텐츠 유형 비율
        </h3>
        {stats.totalContent > 0 ? (
          <>
            <div className="flex h-8 rounded-full overflow-hidden">
              {stats.contentTypes.map((type) => {
                const percentage = (type.count / stats.totalContent) * 100;
                return (
                  <div
                    key={type.name}
                    className={`${type.color} flex items-center justify-center text-white text-xs font-medium`}
                    style={{ width: `${percentage}%` }}
                    title={`${type.name}: ${type.count}개 (${percentage.toFixed(1)}%)`}
                  >
                    {percentage > 10 && `${percentage.toFixed(0)}%`}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-4 mt-4">
              {stats.contentTypes.map((type) => (
                <div key={type.name} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${type.color}`} />
                  <span className="text-sm text-gray-600">{type.name}</span>
                  <span className="text-sm font-medium text-gray-900">
                    ({((type.count / stats.totalContent) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-gray-500 text-center py-4">콘텐츠가 없습니다</div>
        )}
      </div>

      {/* 콘텐츠 추가 가이드 */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          콘텐츠 추가 시
        </h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-blue-800 mb-2">파일 위치</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• 퀴즈: <code className="bg-blue-100 px-1 rounded">src/data/content/quizzes/</code></li>
              <li>• 투표: <code className="bg-blue-100 px-1 rounded">src/data/content/polls/</code></li>
              <li>• 상황반응: <code className="bg-blue-100 px-1 rounded">src/data/content/situation-reactions/</code></li>
              <li>• 운세: <code className="bg-blue-100 px-1 rounded">src/data/content/fortune/</code></li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-blue-800 mb-2">자동 반영 조건</h4>
            <ul className="space-y-1 text-blue-700">
              <li>• 해당 폴더의 <code className="bg-blue-100 px-1 rounded">index.ts</code>에 export 추가</li>
              <li>• 레지스트리 배열에 등록</li>
              <li>• 빌드 성공 시 즉시 반영</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 토너먼트 상세 */}
      {TIER_TOURNAMENTS.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-orange-500" />
            티어 토너먼트 목록
            <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-sm rounded-full">
              총 아이템 {TOURNAMENT_STATS.totalItems()}개
            </span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {TIER_TOURNAMENTS.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <span className="text-2xl">{t.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{t.title}</div>
                  <div className="text-sm text-gray-500">
                    {CATEGORY_LABELS[t.category]?.name || t.category} · {t.items.length}개 아이템
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 최근 변경 (placeholder) */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-gray-600" />
          최근 추가된 콘텐츠 유형
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="font-medium">money</span>
            <span>- 돈/경조사 투표 {CHOICE_POLLS.filter(p => p.category === 'money').length}개</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded">
            <span className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="font-medium">tarot</span>
            <span>- 타로 퀴즈 {ALL_KNOWLEDGE_QUIZZES.filter(q => q.category === 'tarot').length}개, 투표 {VS_POLLS.filter(p => p.category === 'tarot').length + CHOICE_POLLS.filter(p => p.category === 'tarot').length}개</span>
          </div>
        </div>
      </div>

      {/* 유효기간 관리 */}
      <ContentValidityManager />
    </div>
  );
}
