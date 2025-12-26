'use client';

// ============================================================================
// 아이디어 파이프라인 (칸반 보드 스타일)
// ============================================================================

import { useMemo, useState } from 'react';
import {
  Lightbulb,
  Search,
  Palette,
  CheckCircle,
  Wrench,
  Sparkles,
  Pause,
  ChevronDown,
  ChevronUp,
  Filter,
  TrendingUp,
} from 'lucide-react';
import {
  THEMES,
  getTotalStats,
  getQuickWins,
  getHighPriorityIdeas,
} from '@/data/ideas';
import {
  PIPELINE_ORDER,
  STATUS_EMOJI,
  STATUS_LABEL,
  STATUS_COLOR,
  CATEGORY_LABEL,
  VIRAL_LABEL,
  type IdeaStatus,
  type ContentIdea,
} from '@/data/ideas/_types';

// ============================================================================
// 상태별 아이콘
// ============================================================================

const STATUS_ICON: Record<IdeaStatus, React.ReactNode> = {
  'idea': <Lightbulb className="w-4 h-4" />,
  'review': <Search className="w-4 h-4" />,
  'planning': <Palette className="w-4 h-4" />,
  'ready': <CheckCircle className="w-4 h-4" />,
  'in-progress': <Wrench className="w-4 h-4" />,
  'completed': <Sparkles className="w-4 h-4" />,
  'paused': <Pause className="w-4 h-4" />,
};

// ============================================================================
// 아이디어 카드
// ============================================================================

interface IdeaCardProps {
  idea: ContentIdea & { themeName: string; themeIcon: string };
}

function IdeaCard({ idea }: IdeaCardProps) {
  const [expanded, setExpanded] = useState(false);
  const viralInfo = VIRAL_LABEL[idea.viral.potential];

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 shadow-sm hover:shadow-md transition-shadow">
      {/* 헤더 */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
            <span>{idea.themeIcon}</span>
            <span className="truncate">{idea.themeName}</span>
            <span>·</span>
            <span>{CATEGORY_LABEL[idea.category]}</span>
          </div>
          <h4 className="font-medium text-gray-900 text-sm leading-tight">
            {idea.title}
          </h4>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="p-1 text-gray-400 hover:text-gray-600 rounded"
        >
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* 바이럴 + 난이도 */}
      <div className="flex items-center gap-2 mt-2 text-xs">
        <span className={viralInfo.color}>{viralInfo.label}</span>
        <span className="text-gray-400">·</span>
        <span className="text-gray-500">
          난이도 {'⭐'.repeat(idea.implementation.difficulty)}
        </span>
        {idea.strategy?.priority === 'high' && (
          <>
            <span className="text-gray-400">·</span>
            <span className="text-red-600 font-medium">우선</span>
          </>
        )}
      </div>

      {/* 확장 내용 */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-600 space-y-2">
          <p>{idea.description}</p>
          {idea.viral.reasons.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">바이럴 포인트:</span>
              <ul className="list-disc list-inside mt-1">
                {idea.viral.reasons.slice(0, 3).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          {idea.examples && idea.examples.length > 0 && (
            <div>
              <span className="font-medium text-gray-700">예시:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {idea.examples.slice(0, 3).map((ex, i) => (
                  <span key={i} className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                    {ex}
                  </span>
                ))}
              </div>
            </div>
          )}
          <div className="text-gray-400 text-[10px]">
            추가: {idea.addedAt} {idea.updatedAt && `· 수정: ${idea.updatedAt}`}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 파이프라인 컬럼
// ============================================================================

interface PipelineColumnProps {
  status: IdeaStatus;
  ideas: (ContentIdea & { themeName: string; themeIcon: string })[];
}

function PipelineColumn({ status, ideas }: PipelineColumnProps) {
  const [collapsed, setCollapsed] = useState(status === 'completed' || status === 'paused');

  return (
    <div className="flex-shrink-0 w-72 bg-gray-50 rounded-xl p-3">
      {/* 컬럼 헤더 */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="w-full flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span className={`p-1.5 rounded-md ${STATUS_COLOR[status]}`}>
            {STATUS_ICON[status]}
          </span>
          <span className="font-medium text-gray-900">{STATUS_LABEL[status]}</span>
          <span className="text-sm text-gray-500">({ideas.length})</span>
        </div>
        {collapsed ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
      </button>

      {/* 아이디어 목록 */}
      {!collapsed && (
        <div className="mt-3 space-y-2 max-h-[600px] overflow-y-auto">
          {ideas.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-4">없음</p>
          ) : (
            ideas.map((idea) => <IdeaCard key={idea.id} idea={idea} />)
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 메인 컴포넌트
// ============================================================================

type ViewMode = 'pipeline' | 'quickwins' | 'priority';

export default function IdeaPipeline() {
  const [viewMode, setViewMode] = useState<ViewMode>('pipeline');
  const [themeFilter, setThemeFilter] = useState<string>('all');

  // 전체 아이디어 (테마 정보 포함)
  const allIdeas = useMemo(() => {
    return THEMES.flatMap(theme =>
      theme.ideas.map(idea => ({
        ...idea,
        themeName: theme.name,
        themeIcon: theme.icon,
      }))
    );
  }, []);

  // 필터링
  const filteredIdeas = useMemo(() => {
    if (themeFilter === 'all') return allIdeas;
    return allIdeas.filter(i => i.themeName === themeFilter || THEMES.find(t => t.id === themeFilter)?.name === i.themeName);
  }, [allIdeas, themeFilter]);

  // 상태별 그룹핑
  const ideasByStatus = useMemo(() => {
    const grouped: Record<IdeaStatus, typeof filteredIdeas> = {
      'idea': [],
      'review': [],
      'planning': [],
      'ready': [],
      'in-progress': [],
      'completed': [],
      'paused': [],
    };
    filteredIdeas.forEach(idea => {
      grouped[idea.status].push(idea);
    });
    return grouped;
  }, [filteredIdeas]);

  // 통계
  const stats = useMemo(() => getTotalStats(), []);
  const quickWins = useMemo(() => getQuickWins(), []);
  const highPriority = useMemo(() => getHighPriorityIdeas(), []);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">아이디어 파이프라인</h2>
          <p className="text-gray-500 mt-1">
            {stats.totalThemes}개 테마 · {stats.totalIdeas}개 아이디어
          </p>
        </div>

        {/* 뷰 모드 선택 */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'pipeline'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            파이프라인
          </button>
          <button
            onClick={() => setViewMode('quickwins')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'quickwins'
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            ⚡ Quick Wins ({quickWins.length})
          </button>
          <button
            onClick={() => setViewMode('priority')}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              viewMode === 'priority'
                ? 'bg-red-100 text-red-700'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            🎯 우선순위 ({highPriority.length})
          </button>
        </div>
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {PIPELINE_ORDER.map(status => (
          <div
            key={status}
            className={`rounded-lg p-3 ${STATUS_COLOR[status]}`}
          >
            <div className="flex items-center gap-2">
              {STATUS_ICON[status]}
              <span className="font-medium">{STATUS_LABEL[status]}</span>
            </div>
            <div className="text-2xl font-bold mt-1">
              {ideasByStatus[status].length}
            </div>
          </div>
        ))}
      </div>

      {/* 테마 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Filter className="w-4 h-4 text-gray-400" />
        <button
          onClick={() => setThemeFilter('all')}
          className={`px-2 py-1 rounded text-sm ${
            themeFilter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          전체
        </button>
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => setThemeFilter(theme.id)}
            className={`px-2 py-1 rounded text-sm ${
              themeFilter === theme.id ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {theme.icon} {theme.name}
          </button>
        ))}
      </div>

      {/* 메인 뷰 */}
      {viewMode === 'pipeline' && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {PIPELINE_ORDER.filter(s => s !== 'paused').map(status => (
            <PipelineColumn
              key={status}
              status={status}
              ideas={ideasByStatus[status]}
            />
          ))}
          {/* 보류는 마지막에 */}
          {ideasByStatus['paused'].length > 0 && (
            <PipelineColumn status="paused" ideas={ideasByStatus['paused']} />
          )}
        </div>
      )}

      {viewMode === 'quickwins' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Quick Wins (고효과 + 저난이도)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickWins.map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      )}

      {viewMode === 'priority' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🎯</span>
            <h3 className="text-lg font-semibold text-gray-900">
              우선순위 높음 (priority: high)
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {highPriority.map(idea => (
              <IdeaCard key={idea.id} idea={idea} />
            ))}
          </div>
        </div>
      )}

      {/* 사용 안내 */}
      <div className="bg-blue-50 rounded-xl border border-blue-200 p-4 text-sm">
        <h4 className="font-medium text-blue-900 mb-2">💡 아이디어 관리 방법</h4>
        <ul className="text-blue-700 space-y-1">
          <li>• <strong>추가:</strong> "심리테스트에 OO 아이디어 추가해줘"</li>
          <li>• <strong>상태 변경:</strong> "애니 월드컵을 planning으로 변경"</li>
          <li>• <strong>완료 처리:</strong> "음식 밸런스 게임 완료 처리"</li>
          <li>• 데이터 위치: <code className="bg-blue-100 px-1 rounded">src/data/ideas/*.json</code></li>
        </ul>
      </div>
    </div>
  );
}
