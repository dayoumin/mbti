'use client';

import { useState, useEffect } from 'react';
import { Flame, Sparkles, Clock, ChevronRight, Heart } from 'lucide-react';
import { getIconComponent } from '@/utils';
import { SUBJECT_CONFIG, MAIN_TEST_KEYS } from '../data/config';
import { POPULAR_TESTS } from '../data/recommendationPolicy';
import { CHEMI_DATA } from '../data/index';
import type { SubjectKey } from '../data/types';
import { resultService } from '../services/ResultService';

// ============================================================================
// 타입 정의
// ============================================================================

interface ContentSectionsProps {
  onStartTest: (testKey: SubjectKey) => void;
  className?: string;
}

// ============================================================================
// 인기 테스트 데이터 (나중에 API에서 가져올 수 있음)
// ============================================================================

const NEW_TESTS: SubjectKey[] = ['fruit', 'tea', 'bread'];

// ============================================================================
// 작은 테스트 카드 (가로 스크롤용)
// ============================================================================

interface SmallTestCardProps {
  testKey: SubjectKey;
  onStart: (key: SubjectKey) => void;
  badge?: 'HOT' | 'NEW' | null;
  rank?: number;
}

function SmallTestCard({ testKey, onStart, badge, rank }: SmallTestCardProps) {
  const config = SUBJECT_CONFIG[testKey];
  const data = CHEMI_DATA[testKey];

  if (!config || !data) return null;

  const IconComponent = getIconComponent(config.icon);

  return (
    <button
      onClick={() => onStart(testKey)}
      className="flex-shrink-0 w-28 lg:w-full bg-white rounded-xl p-3 border border-slate-100 hover:border-indigo-200 hover:shadow-md transition-all hover:-translate-y-0.5 relative group flex flex-col lg:flex-row lg:items-center gap-2 lg:gap-3"
    >
      {/* 순위 배지 */}
      {rank && (
        <span className="absolute -top-1.5 -left-1.5 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-black rounded-full flex items-center justify-center shadow-sm z-10">
          {rank}
        </span>
      )}

      {/* HOT/NEW 배지 */}
      {badge && !rank && (
        <span className={`absolute -top-1 -right-1 px-1.5 py-0.5 text-xs font-bold rounded-full shadow-sm z-10 ${badge === 'HOT'
          ? 'bg-gradient-to-r from-rose-500 to-orange-500 text-white'
          : 'bg-gradient-to-r from-emerald-400 to-teal-400 text-white'
          }`}>
          {badge}
        </span>
      )}

      <div className="w-12 h-12 lg:w-10 lg:h-10 mx-auto lg:mx-0 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform flex-shrink-0">
        <IconComponent mood="happy" className="w-9 h-9 lg:w-7 lg:h-7" />
      </div>

      <div className="flex-1 min-w-0 text-center lg:text-left">
        <p className="text-sm font-bold text-slate-700 truncate">
          {data.title || config.label}
        </p>
        <p className="text-xs text-slate-400 mt-0.5 truncate">
          {data.subtitle || `${data.resultLabels?.length || 0}가지 결과`}
        </p>
      </div>
    </button>
  );
}

// ============================================================================
// 섹션 헤더
// ============================================================================

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  onMore?: () => void;
  moreLabel?: string;
}

function SectionHeader({ icon, title, subtitle, onMore, moreLabel = '더보기' }: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-3 px-1">
      <div className="flex items-center gap-2">
        {icon}
        <div>
          <h3 className="text-sm font-bold text-slate-700">{title}</h3>
          {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {onMore && (
        <button
          onClick={onMore}
          className="text-xs font-medium text-indigo-500 hover:text-indigo-600 transition-colors flex items-center gap-0.5"
        >
          {moreLabel}
          <ChevronRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

// ============================================================================
// 가로 스크롤 컨테이너
// ============================================================================

interface HorizontalScrollProps {
  children: React.ReactNode;
}

function HorizontalScroll({ children }: HorizontalScrollProps) {
  return (
    // 모바일: 가로 스크롤 / PC: 세로 그리드 (사이드바에서 사용)
    <div className="relative group/scroll">
      <div className="overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 lg:overflow-visible">
        <div className="flex gap-2 pb-2 pr-8 lg:pr-0 lg:grid lg:grid-cols-2 lg:gap-2 lg:pb-0">
          {children}
        </div>
      </div>
      {/* 가로 스크롤 힌트 제거 - 공간 확보 */}
    </div>
  );
}

// ============================================================================
// 인기 테스트 섹션 (순위 표시)
// ============================================================================

interface TrendingSectionProps {
  onStartTest: (key: SubjectKey) => void;
}

export function TrendingSection({ onStartTest }: TrendingSectionProps) {
  return (
    <section className="mb-5">
      <SectionHeader
        icon={<Flame className="w-4 h-4 text-orange-500" />}
        title="지금 뜨는 테스트"
        subtitle="실시간 인기"
      />
      <HorizontalScroll>
        {POPULAR_TESTS.map((key, index) => (
          <SmallTestCard
            key={key}
            testKey={key}
            onStart={onStartTest}
            rank={index + 1}
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}

// ============================================================================
// 신규 테스트 섹션
// ============================================================================

interface NewTestsSectionProps {
  onStartTest: (key: SubjectKey) => void;
}

export function NewTestsSection({ onStartTest }: NewTestsSectionProps) {
  if (NEW_TESTS.length === 0) return null;

  return (
    <section className="mb-5">
      <SectionHeader
        icon={<Sparkles className="w-4 h-4 text-emerald-500" />}
        title="새로 나온 테스트"
        subtitle="최신 업데이트"
      />
      <HorizontalScroll>
        {NEW_TESTS.map((key) => (
          <SmallTestCard
            key={key}
            testKey={key}
            onStart={onStartTest}
            badge="NEW"
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}

// ============================================================================
// 최근 본 테스트 섹션
// ============================================================================

interface RecentSectionProps {
  onStartTest: (key: SubjectKey) => void;
}

export function RecentSection({ onStartTest }: RecentSectionProps) {
  const [recentTests, setRecentTests] = useState<SubjectKey[]>([]);

  useEffect(() => {
    // 최근 결과에서 테스트 키 추출
    const loadRecent = async () => {
      const results = await resultService.getMyResults();
      // 최근 완료한 테스트 타입 추출 (중복 제거, 최근 순)
      const seen = new Set<string>();
      const recent = results
        .filter(r => {
          if (seen.has(r.testType)) return false;
          if (!MAIN_TEST_KEYS.includes(r.testType as SubjectKey)) return false;
          seen.add(r.testType);
          return true;
        })
        .slice(0, 5)
        .map(r => r.testType as SubjectKey);

      setRecentTests(recent);
    };
    loadRecent();
  }, []);

  if (recentTests.length === 0) return null;

  return (
    <section className="mb-5">
      <SectionHeader
        icon={<Clock className="w-4 h-4 text-slate-500" />}
        title="최근 본 테스트"
        subtitle="다시 해보기"
      />
      <HorizontalScroll>
        {recentTests.map((key) => (
          <SmallTestCard
            key={key}
            testKey={key}
            onStart={onStartTest}
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}

// ============================================================================
// 맞춤 추천 섹션 (테스트 결과 기반)
// ============================================================================

interface RecommendedSectionProps {
  onStartTest: (key: SubjectKey) => void;
}

export function RecommendedSection({ onStartTest }: RecommendedSectionProps) {
  const [recommended, setRecommended] = useState<SubjectKey[]>([]);

  useEffect(() => {
    const loadRecommended = async () => {
      const results = await resultService.getMyResults();
      const completedKeys = [...new Set(results.map(r => r.testType))] as SubjectKey[];

      // 완료하지 않은 테스트 중 추천 (인기 테스트 제외하여 중복 방지)
      const notCompleted = MAIN_TEST_KEYS.filter(key =>
        !completedKeys.includes(key) && !POPULAR_TESTS.includes(key)
      );

      // 만약 추천할 게 너무 적으면 인기 테스트도 포함 (단, 완료한 건 제외)
      const finalRecommended = notCompleted.length >= 3
        ? notCompleted
        : [...notCompleted, ...POPULAR_TESTS.filter(key => !completedKeys.includes(key))];

      setRecommended(finalRecommended.slice(0, 5));
    };
    loadRecommended();
  }, []);

  if (recommended.length === 0) return null;

  return (
    <section className="mb-5">
      <SectionHeader
        icon={<Heart className="w-4 h-4 text-pink-500" />}
        title="당신을 위한 추천"
        subtitle="아직 안 해본 테스트"
      />
      <HorizontalScroll>
        {recommended.map((key) => (
          <SmallTestCard
            key={key}
            testKey={key}
            onStart={onStartTest}
          />
        ))}
      </HorizontalScroll>
    </section>
  );
}

// ============================================================================
// 통합 컴포넌트 (모든 섹션)
// ============================================================================

export default function ContentSections({ onStartTest, className = '' }: ContentSectionsProps) {
  return (
    <div className={className}>
      <TrendingSection onStartTest={onStartTest} />
      <NewTestsSection onStartTest={onStartTest} />
      <RecentSection onStartTest={onStartTest} />
      <RecommendedSection onStartTest={onStartTest} />
    </div>
  );
}
