'use client';

// ============================================================================
// 콘텐츠 전체 현황 대시보드
// ============================================================================
// 테스트 + 퀴즈 + 투표 + 상황반응 + 아이디어 뱅크 모두 한눈에

import { useMemo, useState } from 'react';
import {
  BarChart3,
  FlaskConical,
  HelpCircle,
  Vote,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  CheckCircle2,
  Clock,
  Zap,
  Target,
  Layers,
  ChevronDown,
  Sparkles,
  AlertTriangle,
  XCircle,
  Calendar,
  RefreshCw,
} from 'lucide-react';

// 데이터 imports
import { CHEMI_DATA } from '@/data';
import { SUBJECT_CONFIG } from '@/data/config';
import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS, CHOICE_POLLS } from '@/data/content/polls';
import { ALL_SITUATION_REACTIONS } from '@/data/content/situation-reactions';
import { ZODIAC_FORTUNES_2025, ZODIAC_POLLS, CONSTELLATIONS, ALL_DAILY_MESSAGES, LUCKY_TIPS } from '@/data/content/fortune';
import { TIER_TOURNAMENTS } from '@/data/content/tournaments';
import { getTotalStats, getQuickWins, getHighPriorityIdeas } from '../data/idea-bank';
import { CATEGORY_LABELS } from '@/data/content/categories';
import type { ContentCategory, ValidityStatus } from '@/data/content/types';
import { getValidityStatus, VALIDITY_PERIODS, type TimeSensitivity } from '@/data/content/types';

// ============================================================================
// Types
// ============================================================================

interface ContentTypeCard {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  count: number;
  subItems?: { name: string; count: number; status?: 'active' | 'idea' | 'completed' }[];
  description: string;
}

// ============================================================================
// Main Component
// ============================================================================

export default function ContentStatusDashboard() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const stats = useMemo(() => {
    // 1. 테스트 통계
    const testKeys = Object.keys(CHEMI_DATA) as (keyof typeof SUBJECT_CONFIG)[];
    const personalityTests = testKeys.filter(k => SUBJECT_CONFIG[k]?.testType === 'personality');
    const matchingTests = testKeys.filter(k => SUBJECT_CONFIG[k]?.testType === 'matching');

    // 2. 콘텐츠 통계
    const totalQuizzes = ALL_KNOWLEDGE_QUIZZES.length + ALL_SCENARIO_QUIZZES.length;
    const totalPolls = VS_POLLS.length + CHOICE_POLLS.length;
    const totalSituations = ALL_SITUATION_REACTIONS.length;
    const totalFortune = ZODIAC_FORTUNES_2025.length + ZODIAC_POLLS.length + CONSTELLATIONS.length + ALL_DAILY_MESSAGES.length + LUCKY_TIPS.length;

    // 3. 아이디어 통계
    const ideaStats = getTotalStats();
    const quickWins = getQuickWins();
    const highPriority = getHighPriorityIdeas();

    // 4. 전체 합계
    const totalImplemented = testKeys.length + totalQuizzes + totalPolls + totalSituations + totalFortune;
    const totalIdeas = ideaStats.totalIdeas;

    return {
      tests: {
        total: testKeys.length,
        personality: personalityTests.length,
        matching: matchingTests.length,
      },
      content: {
        quizzes: totalQuizzes,
        knowledgeQuizzes: ALL_KNOWLEDGE_QUIZZES.length,
        scenarioQuizzes: ALL_SCENARIO_QUIZZES.length,
        polls: totalPolls,
        vsPolls: VS_POLLS.length,
        choicePolls: CHOICE_POLLS.length,
        situations: totalSituations,
        fortune: totalFortune,
      },
      ideas: {
        total: ideaStats.totalIdeas,
        themes: ideaStats.totalThemes,
        veryHighViral: ideaStats.veryHighViralIdeas,
        highPriority: ideaStats.highPriorityIdeas,
        quickWins: quickWins.length,
        completed: ideaStats.completed,
        inProgress: ideaStats.inProgress,
      },
      totals: {
        implemented: totalImplemented,
        planned: totalIdeas,
        all: totalImplemented + totalIdeas,
      },
    };
  }, []);

  // 카드 데이터
  const contentCards: ContentTypeCard[] = [
    {
      id: 'tests',
      name: '성향 테스트',
      icon: <FlaskConical className="w-6 h-6" />,
      color: '#7aa2ff',
      bgColor: 'rgba(122, 162, 255, 0.15)',
      count: stats.tests.total,
      description: '다차원 분석 기반 성향/궁합 테스트',
      subItems: [
        { name: '성향 테스트', count: stats.tests.personality, status: 'active' },
        { name: '궁합 테스트', count: stats.tests.matching, status: 'active' },
      ],
    },
    {
      id: 'quizzes',
      name: '퀴즈',
      icon: <HelpCircle className="w-6 h-6" />,
      color: '#55e6c1',
      bgColor: 'rgba(85, 230, 193, 0.15)',
      count: stats.content.quizzes,
      description: '지식 테스트 및 시나리오 퀴즈',
      subItems: [
        { name: '지식 퀴즈', count: stats.content.knowledgeQuizzes, status: 'active' },
        { name: '시나리오 퀴즈', count: stats.content.scenarioQuizzes, status: 'active' },
      ],
    },
    {
      id: 'polls',
      name: '투표',
      icon: <Vote className="w-6 h-6" />,
      color: '#a29bfe',
      bgColor: 'rgba(162, 155, 254, 0.15)',
      count: stats.content.polls,
      description: 'VS 밸런스 게임 및 선택 투표',
      subItems: [
        { name: 'VS 투표', count: stats.content.vsPolls, status: 'active' },
        { name: '선택 투표', count: stats.content.choicePolls, status: 'active' },
      ],
    },
    {
      id: 'situations',
      name: '상황별 반응',
      icon: <MessageSquare className="w-6 h-6" />,
      color: '#ff6b9d',
      bgColor: 'rgba(255, 107, 157, 0.15)',
      count: stats.content.situations,
      description: '"이럴 때 나는?" 스낵 콘텐츠',
      subItems: [
        { name: '전체', count: stats.content.situations, status: 'active' },
      ],
    },
    {
      id: 'fortune',
      name: '운세',
      icon: <Sparkles className="w-6 h-6" />,
      color: '#ffd166',
      bgColor: 'rgba(255, 209, 102, 0.15)',
      count: stats.content.fortune,
      description: '띠별/별자리 운세 및 일일 메시지',
      subItems: [
        { name: '띠별 운세', count: ZODIAC_FORTUNES_2025.length, status: 'active' },
        { name: '별자리', count: CONSTELLATIONS.length, status: 'active' },
        { name: '운세 투표', count: ZODIAC_POLLS.length, status: 'active' },
      ],
    },
    {
      id: 'ideas',
      name: '아이디어 뱅크',
      icon: <Lightbulb className="w-6 h-6" />,
      color: '#ff6b6b',
      bgColor: 'rgba(255, 107, 107, 0.15)',
      count: stats.ideas.total,
      description: '기획 중인 콘텐츠 아이디어',
      subItems: [
        { name: '테마', count: stats.ideas.themes, status: 'idea' },
        { name: '매우 높은 바이럴', count: stats.ideas.veryHighViral, status: 'idea' },
        { name: 'Quick Wins', count: stats.ideas.quickWins, status: 'idea' },
        { name: '완료', count: stats.ideas.completed, status: 'completed' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* 전체 요약 헤더 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="db-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--db-muted)]">구현 완료</p>
              <p className="text-2xl font-bold text-green-400">{stats.totals.implemented}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--db-muted)]">
            테스트 {stats.tests.total} + 퀴즈 {stats.content.quizzes} + 투표 {stats.content.polls} + 상황 {stats.content.situations} + 운세 {stats.content.fortune}
          </p>
        </div>

        <div className="db-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-[var(--db-muted)]">기획 중</p>
              <p className="text-2xl font-bold text-amber-400">{stats.totals.planned}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--db-muted)]">
            {stats.ideas.themes}개 테마 · 우선순위 높음 {stats.ideas.highPriority}개
          </p>
        </div>

        <div className="db-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--db-brand)]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--db-brand)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--db-muted)]">전체 콘텐츠</p>
              <p className="text-2xl font-bold text-[var(--db-brand)]">{stats.totals.all}</p>
            </div>
          </div>
          <p className="text-xs text-[var(--db-muted)]">
            구현률 {Math.round((stats.totals.implemented / stats.totals.all) * 100)}%
          </p>
        </div>
      </div>

      {/* 콘텐츠 타입별 카드 */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {contentCards.map((card) => (
          <div
            key={card.id}
            className="db-card overflow-hidden cursor-pointer transition-all hover:scale-[1.02]"
            onClick={() => setExpandedCard(expandedCard === card.id ? null : card.id)}
          >
            <div className="p-5" style={{ background: card.bgColor }}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ background: `${card.color}30`, color: card.color }}
                  >
                    {card.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[var(--db-text)]">{card.name}</h3>
                    <p className="text-xs text-[var(--db-muted)]">{card.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold" style={{ color: card.color }}>
                    {card.count}
                  </p>
                  <ChevronDown
                    className={`w-4 h-4 text-[var(--db-muted)] transition-transform ml-auto ${
                      expandedCard === card.id ? 'rotate-180' : ''
                    }`}
                  />
                </div>
              </div>

              {/* 진행률 바 */}
              <div className="w-full h-1.5 bg-black/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(100, (card.count / 100) * 100)}%`,
                    background: card.color,
                  }}
                />
              </div>
            </div>

            {/* 확장된 세부 정보 */}
            {expandedCard === card.id && card.subItems && (
              <div className="p-4 border-t border-white/10 space-y-2">
                {card.subItems.map((sub, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-black/20"
                  >
                    <div className="flex items-center gap-2">
                      {sub.status === 'active' && (
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                      )}
                      {sub.status === 'idea' && (
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                      )}
                      {sub.status === 'completed' && (
                        <span className="w-2 h-2 rounded-full bg-purple-500" />
                      )}
                      <span className="text-sm text-[var(--db-muted)]">{sub.name}</span>
                    </div>
                    <span className="text-sm font-medium text-[var(--db-text)]">{sub.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="db-card p-5">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <ActionButton
            label="아이디어 뱅크"
            description="기획 중인 콘텐츠 보기"
            icon={<Lightbulb className="w-5 h-5" />}
            color="#ff6b6b"
            badge={`${stats.ideas.total}개`}
          />
          <ActionButton
            label="Quick Wins"
            description="바로 구현 가능"
            icon={<Zap className="w-5 h-5" />}
            color="#ffd166"
            badge={`${stats.ideas.quickWins}개`}
          />
          <ActionButton
            label="우선순위 높음"
            description="먼저 구현할 것"
            icon={<Target className="w-5 h-5" />}
            color="#ff6b9d"
            badge={`${stats.ideas.highPriority}개`}
          />
          <ActionButton
            label="테마 목록"
            description="카테고리별 아이디어"
            icon={<Layers className="w-5 h-5" />}
            color="#7aa2ff"
            badge={`${stats.ideas.themes}개`}
          />
        </div>
      </div>

      {/* 유효기간 관리 */}
      <ContentValidityManager />

      {/* 카테고리별 콘텐츠 분포 */}
      <ContentByCategory />
    </div>
  );
}

// ============================================================================
// Sub Components
// ============================================================================

function ActionButton({
  label,
  description,
  icon,
  color,
  badge,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  badge?: string;
}) {
  return (
    <button className="p-4 rounded-xl text-left transition-all hover:scale-[1.02]" style={{ background: `${color}15` }}>
      <div className="flex items-center justify-between mb-2">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${color}25`, color }}>
          {icon}
        </div>
        {badge && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: `${color}25`, color }}>
            {badge}
          </span>
        )}
      </div>
      <h4 className="font-medium text-[var(--db-text)]">{label}</h4>
      <p className="text-xs text-[var(--db-muted)]">{description}</p>
    </button>
  );
}

// ============================================================================
// 유효기간 관리 컴포넌트
// ============================================================================

interface ContentValidityItem {
  id: string;
  type: 'quiz' | 'poll' | 'situation' | 'tournament';
  title: string;
  category: string;
  sensitivity: TimeSensitivity;
  sourceYear: number;
  validUntil: string | null;
  status: ValidityStatus;
}

const SENSITIVITY_LABELS: Record<TimeSensitivity, { label: string; color: string; period: string }> = {
  high: { label: '높음', color: '#ef4444', period: '2년' },
  medium: { label: '중간', color: '#f59e0b', period: '3년' },
  low: { label: '낮음', color: '#22c55e', period: '4년' },
  none: { label: '무기한', color: '#6b7280', period: '∞' },
};

const STATUS_CONFIG: Record<ValidityStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  current: { label: '유효', color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', icon: <CheckCircle2 className="w-4 h-4" /> },
  needs_review: { label: '검토 필요', color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', icon: <AlertTriangle className="w-4 h-4" /> },
  outdated: { label: '만료됨', color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', icon: <XCircle className="w-4 h-4" /> },
};

function ContentValidityManager() {
  const [showAllItems, setShowAllItems] = useState(false);

  const validityData = useMemo(() => {
    const items: ContentValidityItem[] = [];
    const now = new Date();

    // 퀴즈 검사
    [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES].forEach((quiz) => {
      const meta = quiz.meta?.timeSensitivity;
      if (meta) {
        const status = getValidityStatus(meta, now);
        const validUntil = meta.validUntil ?? (
          VALIDITY_PERIODS[meta.sensitivity]
            ? `${meta.sourceYear + VALIDITY_PERIODS[meta.sensitivity]!}-12`
            : null
        );
        items.push({
          id: quiz.id,
          type: 'quiz',
          title: 'question' in quiz ? quiz.question.slice(0, 40) + '...' : quiz.title,
          category: quiz.category,
          sensitivity: meta.sensitivity,
          sourceYear: meta.sourceYear,
          validUntil,
          status,
        });
      }
    });

    // 투표 검사
    [...VS_POLLS, ...CHOICE_POLLS].forEach((poll) => {
      const meta = poll.meta?.timeSensitivity;
      if (meta) {
        const status = getValidityStatus(meta, now);
        const validUntil = meta.validUntil ?? (
          VALIDITY_PERIODS[meta.sensitivity]
            ? `${meta.sourceYear + VALIDITY_PERIODS[meta.sensitivity]!}-12`
            : null
        );
        items.push({
          id: poll.id,
          type: 'poll',
          title: poll.question.slice(0, 40) + (poll.question.length > 40 ? '...' : ''),
          category: poll.category,
          sensitivity: meta.sensitivity,
          sourceYear: meta.sourceYear,
          validUntil,
          status,
        });
      }
    });

    // 상황반응 검사
    ALL_SITUATION_REACTIONS.forEach((sr) => {
      const meta = sr.meta?.timeSensitivity;
      if (meta) {
        const status = getValidityStatus(meta, now);
        const validUntil = meta.validUntil ?? (
          VALIDITY_PERIODS[meta.sensitivity]
            ? `${meta.sourceYear + VALIDITY_PERIODS[meta.sensitivity]!}-12`
            : null
        );
        items.push({
          id: sr.id,
          type: 'situation',
          title: sr.situation.slice(0, 40) + (sr.situation.length > 40 ? '...' : ''),
          category: sr.category,
          sensitivity: meta.sensitivity,
          sourceYear: meta.sourceYear,
          validUntil,
          status,
        });
      }
    });

    // 토너먼트 검사
    TIER_TOURNAMENTS.forEach((tournament) => {
      const meta = tournament.meta?.timeSensitivity;
      if (meta) {
        const status = getValidityStatus(meta, now);
        const validUntil = meta.validUntil ?? (
          VALIDITY_PERIODS[meta.sensitivity]
            ? `${meta.sourceYear + VALIDITY_PERIODS[meta.sensitivity]!}-12`
            : null
        );
        items.push({
          id: tournament.id,
          type: 'tournament',
          title: tournament.title,
          category: tournament.category,
          sensitivity: meta.sensitivity,
          sourceYear: meta.sourceYear,
          validUntil,
          status,
        });
      }
    });

    // 상태별 집계
    const byStatus: Record<ValidityStatus, ContentValidityItem[]> = {
      current: [],
      needs_review: [],
      outdated: [],
    };

    items.forEach(item => {
      byStatus[item.status].push(item);
    });

    // 민감도별 집계
    const bySensitivity: Record<TimeSensitivity, number> = {
      high: 0,
      medium: 0,
      low: 0,
      none: 0,
    };

    items.forEach(item => {
      bySensitivity[item.sensitivity]++;
    });

    return {
      items,
      byStatus,
      bySensitivity,
      totalWithMeta: items.length,
      totalContent: ALL_KNOWLEDGE_QUIZZES.length + ALL_SCENARIO_QUIZZES.length +
        VS_POLLS.length + CHOICE_POLLS.length +
        ALL_SITUATION_REACTIONS.length +
        TIER_TOURNAMENTS.length,
    };
  }, []);

  const needsAttention = validityData.byStatus.needs_review.length + validityData.byStatus.outdated.length;

  return (
    <div className="db-card">
      <div className="db-card-header px-5 py-4 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          콘텐츠 유효기간 관리
          {needsAttention > 0 && (
            <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/20 text-amber-400">
              {needsAttention}개 주의
            </span>
          )}
        </h3>
        <div className="text-xs text-[var(--db-muted)]">
          유효기간 설정: {validityData.totalWithMeta}개 / 전체: {validityData.totalContent}개
        </div>
      </div>

      <div className="p-5 space-y-5">
        {/* 상태별 요약 카드 */}
        <div className="grid grid-cols-3 gap-3">
          {(Object.entries(STATUS_CONFIG) as [ValidityStatus, typeof STATUS_CONFIG[ValidityStatus]][]).map(([status, config]) => (
            <div
              key={status}
              className="p-4 rounded-xl"
              style={{ background: config.bgColor }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span style={{ color: config.color }}>{config.icon}</span>
                <span className="text-sm font-medium text-[var(--db-text)]">{config.label}</span>
              </div>
              <p className="text-2xl font-bold" style={{ color: config.color }}>
                {validityData.byStatus[status].length}
              </p>
            </div>
          ))}
        </div>

        {/* 민감도별 분포 */}
        <div className="p-4 rounded-xl bg-black/20">
          <h4 className="text-sm font-medium text-[var(--db-text)] mb-3 flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            갱신 주기별 분포
          </h4>
          <div className="flex gap-4">
            {(Object.entries(SENSITIVITY_LABELS) as [TimeSensitivity, typeof SENSITIVITY_LABELS[TimeSensitivity]][]).map(([sensitivity, config]) => (
              <div key={sensitivity} className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ background: config.color }}
                />
                <span className="text-xs text-[var(--db-muted)]">
                  {config.label} ({config.period}): {validityData.bySensitivity[sensitivity]}개
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 주의가 필요한 콘텐츠 목록 */}
        {needsAttention > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-[var(--db-text)] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                주의가 필요한 콘텐츠
              </h4>
              <button
                onClick={() => setShowAllItems(!showAllItems)}
                className="text-xs text-[var(--db-brand)] hover:underline"
              >
                {showAllItems ? '접기' : '전체 보기'}
              </button>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto">
              {[...validityData.byStatus.outdated, ...validityData.byStatus.needs_review]
                .slice(0, showAllItems ? undefined : 5)
                .map((item) => {
                  const statusConfig = STATUS_CONFIG[item.status];
                  const typeLabel = { quiz: '퀴즈', poll: '투표', situation: '상황', tournament: '토너먼트' }[item.type];
                  const categoryInfo = CATEGORY_LABELS[item.category as ContentCategory];

                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-black/20"
                    >
                      <span style={{ color: statusConfig.color }}>{statusConfig.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs px-1.5 py-0.5 rounded bg-white/10 text-[var(--db-muted)]">
                            {typeLabel}
                          </span>
                          <span className="text-xs text-[var(--db-muted)]">
                            {categoryInfo?.emoji} {categoryInfo?.name || item.category}
                          </span>
                        </div>
                        <p className="text-sm text-[var(--db-text)] truncate mt-1">{item.title}</p>
                      </div>
                      <div className="text-right">
                        <div
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: statusConfig.bgColor, color: statusConfig.color }}
                        >
                          {statusConfig.label}
                        </div>
                        <p className="text-xs text-[var(--db-muted)] mt-1">
                          {item.validUntil ? `~${item.validUntil}` : '무기한'}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>

            {!showAllItems && needsAttention > 5 && (
              <p className="text-xs text-center text-[var(--db-muted)]">
                외 {needsAttention - 5}개 더...
              </p>
            )}
          </div>
        )}

        {/* 유효기간 미설정 콘텐츠 안내 */}
        {validityData.totalWithMeta < validityData.totalContent && (
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Clock className="w-4 h-4 text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400 font-medium">
                  유효기간 미설정 콘텐츠: {validityData.totalContent - validityData.totalWithMeta}개
                </p>
                <p className="text-xs text-[var(--db-muted)] mt-1">
                  트렌드/시의성 있는 콘텐츠에 timeSensitivity 메타 추가 권장
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ContentByCategory() {
  const categoryData = useMemo(() => {
    // 모든 콘텐츠에서 카테고리 집계
    const categories: Record<string, { quizzes: number; polls: number; situations: number }> = {};

    // 퀴즈
    [...ALL_KNOWLEDGE_QUIZZES, ...ALL_SCENARIO_QUIZZES].forEach((q) => {
      if (!categories[q.category]) categories[q.category] = { quizzes: 0, polls: 0, situations: 0 };
      categories[q.category].quizzes++;
    });

    // 투표
    [...VS_POLLS, ...CHOICE_POLLS].forEach((p) => {
      if (!categories[p.category]) categories[p.category] = { quizzes: 0, polls: 0, situations: 0 };
      categories[p.category].polls++;
    });

    // 상황반응
    ALL_SITUATION_REACTIONS.forEach((s) => {
      if (!categories[s.category]) categories[s.category] = { quizzes: 0, polls: 0, situations: 0 };
      categories[s.category].situations++;
    });

    return Object.entries(categories)
      .map(([key, value]) => {
        const info = CATEGORY_LABELS[key as ContentCategory];
        return {
          key,
          label: info?.name || key,
          emoji: info?.emoji || '📊',
          ...value,
          total: value.quizzes + value.polls + value.situations,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, []);

  return (
    <div className="db-card">
      <div className="db-card-header px-5 py-4">
        <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          카테고리별 콘텐츠 분포
        </h3>
      </div>
      <div className="p-5">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {categoryData.map((cat) => (
            <div
              key={cat.key}
              className="flex items-center gap-3 p-3 rounded-xl bg-black/20 hover:bg-black/30 transition-colors"
            >
              <span className="text-2xl">{cat.emoji}</span>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-[var(--db-text)] truncate text-sm">{cat.label}</div>
                <div className="flex gap-2 text-xs text-[var(--db-muted)]">
                  {cat.quizzes > 0 && <span className="text-[#55e6c1]">Q{cat.quizzes}</span>}
                  {cat.polls > 0 && <span className="text-[#a29bfe]">P{cat.polls}</span>}
                  {cat.situations > 0 && <span className="text-[#ff6b9d]">S{cat.situations}</span>}
                </div>
              </div>
              <div className="text-lg font-bold text-[var(--db-text)]">{cat.total}</div>
            </div>
          ))}
        </div>

        {/* 범례 */}
        <div className="flex gap-4 mt-4 pt-4 border-t border-white/10 text-xs text-[var(--db-muted)]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#55e6c1]" />
            Q = 퀴즈
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#a29bfe]" />
            P = 투표
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#ff6b9d]" />
            S = 상황반응
          </div>
        </div>
      </div>
    </div>
  );
}
