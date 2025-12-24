'use client';

import { useState, useMemo, useEffect } from 'react';
import {
  Database,
  Search,
  ExternalLink,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  ChevronDown,
  ChevronRight,
  Link2,
  Calendar,
  BookOpen,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';

// ============================================================================
// Types
// ============================================================================

interface Fact {
  id: string;
  title: string;
  value: string;
  source: string;
  url?: string;
  verifiedDate: string;
  usedIn: string[];
  note?: string;
}

interface CategoryFacts {
  category: string;
  label: string;
  emoji: string;
  lastUpdated: string;
  facts: Fact[];
}

interface ApiResponse {
  success: boolean;
  data: CategoryFacts[];
  stats?: {
    categories: number;
    totalFacts: number;
  };
  error?: string;
}

// ============================================================================
// Utilities
// ============================================================================

function getDaysSince(dateString: string): number {
  if (!dateString) return 999;
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

function getVerificationStatus(verifiedDate: string): 'fresh' | 'aging' | 'stale' {
  const days = getDaysSince(verifiedDate);
  if (days <= 90) return 'fresh';
  if (days <= 180) return 'aging';
  return 'stale';
}

// ============================================================================
// Components
// ============================================================================

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <RefreshCw className="w-6 h-6 text-blue-400 animate-spin" />
      <span className="ml-2 text-gray-400">팩트 데이터 로딩 중...</span>
    </div>
  );
}

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-500/10 border border-red-500/30 rounded-lg px-4 py-6 text-center">
      <AlertCircle className="w-8 h-8 text-red-400 mx-auto mb-2" />
      <div className="text-red-300 mb-4">{message}</div>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <Database className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <div className="text-gray-400 mb-2">팩트 데이터가 없습니다</div>
      <div className="text-sm text-gray-500">
        <code>research/facts/*.md</code> 파일을 추가하세요
      </div>
    </div>
  );
}

function FactCard({ fact }: { fact: Fact }) {
  const [expanded, setExpanded] = useState(false);
  const status = getVerificationStatus(fact.verifiedDate);

  const statusConfig = {
    fresh: { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-500/10', label: '검증됨' },
    aging: { icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-500/10', label: '재검증 권장' },
    stale: { icon: AlertTriangle, color: 'text-red-400', bg: 'bg-red-500/10', label: '재검증 필요' },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-700/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <code className="text-xs text-gray-500 font-mono">{fact.id}</code>
          <span className="text-white font-medium">{fact.title}</span>
          <span className={`text-xs px-2 py-0.5 rounded-full ${config.bg} ${config.color} flex items-center gap-1`}>
            <StatusIcon className="w-3 h-3" />
            {config.label}
          </span>
        </div>
        {expanded ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-gray-700/50 pt-3">
          {/* 값 */}
          <div className="flex items-start gap-2">
            <FileText className="w-4 h-4 text-blue-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">값</div>
              <div className="text-white">{fact.value}</div>
            </div>
          </div>

          {/* 출처 */}
          <div className="flex items-start gap-2">
            <BookOpen className="w-4 h-4 text-purple-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">출처</div>
              <div className="flex items-center gap-2">
                <span className="text-white">{fact.source}</span>
                {fact.url && (
                  <a
                    href={fact.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 검증일 */}
          <div className="flex items-start gap-2">
            <Calendar className="w-4 h-4 text-green-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">검증일</div>
              <div className="text-white">
                {fact.verifiedDate} ({getDaysSince(fact.verifiedDate)}일 전)
              </div>
            </div>
          </div>

          {/* 사용된 콘텐츠 */}
          <div className="flex items-start gap-2">
            <Link2 className="w-4 h-4 text-orange-400 mt-0.5" />
            <div>
              <div className="text-xs text-gray-500">사용된 콘텐츠</div>
              <div className="flex flex-wrap gap-1 mt-1">
                {fact.usedIn.length > 0 ? (
                  fact.usedIn.map((contentId) => (
                    <span
                      key={contentId}
                      className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded text-xs font-mono"
                    >
                      {contentId}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">아직 사용된 콘텐츠 없음</span>
                )}
              </div>
            </div>
          </div>

          {/* 비고 */}
          {fact.note && (
            <div className="text-sm text-gray-400 bg-gray-900/50 rounded px-3 py-2">
              {fact.note}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CategorySection({ data }: { data: CategoryFacts }) {
  const [expanded, setExpanded] = useState(true);

  const stats = useMemo(() => {
    const statuses = data.facts.map((f) => getVerificationStatus(f.verifiedDate));
    return {
      total: data.facts.length,
      fresh: statuses.filter((s) => s === 'fresh').length,
      aging: statuses.filter((s) => s === 'aging').length,
      stale: statuses.filter((s) => s === 'stale').length,
    };
  }, [data.facts]);

  return (
    <div className="bg-gray-800/30 rounded-xl border border-gray-700/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-5 py-4 flex items-center justify-between hover:bg-gray-700/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{data.emoji}</span>
          <span className="text-white font-semibold text-lg">{data.label}</span>
          <span className="text-gray-500 text-sm">({stats.total}개 팩트)</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-green-400">{stats.fresh} 검증</span>
            {stats.aging > 0 && <span className="text-yellow-400">{stats.aging} 권장</span>}
            {stats.stale > 0 && <span className="text-red-400">{stats.stale} 필요</span>}
          </div>
          {expanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
        </div>
      </button>

      {expanded && (
        <div className="px-5 pb-5 space-y-2">
          {data.facts.map((fact) => (
            <FactCard key={fact.id} fact={fact} />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function FactManager() {
  const [factsData, setFactsData] = useState<CategoryFacts[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFacts = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/facts');
      const data: ApiResponse = await response.json();

      if (data.success) {
        setFactsData(data.data);
      } else {
        setError(data.error || '팩트 데이터를 불러오는데 실패했습니다');
      }
    } catch (err) {
      setError('API 요청 중 오류가 발생했습니다');
      console.error('Fetch facts error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacts();
  }, []);

  const filteredData = useMemo(() => {
    if (!searchQuery.trim()) return factsData;

    const query = searchQuery.toLowerCase();
    return factsData.map((category) => ({
      ...category,
      facts: category.facts.filter(
        (fact) =>
          fact.id.toLowerCase().includes(query) ||
          fact.title.toLowerCase().includes(query) ||
          fact.value.toLowerCase().includes(query) ||
          fact.source.toLowerCase().includes(query) ||
          fact.usedIn.some((id) => id.toLowerCase().includes(query))
      ),
    })).filter((category) => category.facts.length > 0);
  }, [searchQuery, factsData]);

  const totalStats = useMemo(() => {
    const allFacts = factsData.flatMap((c) => c.facts);
    const statuses = allFacts.map((f) => getVerificationStatus(f.verifiedDate));
    return {
      total: allFacts.length,
      categories: factsData.length,
      fresh: statuses.filter((s) => s === 'fresh').length,
      aging: statuses.filter((s) => s === 'aging').length,
      stale: statuses.filter((s) => s === 'stale').length,
    };
  }, [factsData]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Database className="w-6 h-6 text-blue-400" />
          <h2 className="text-xl font-bold text-white">팩트 DB 관리</h2>
        </div>
        <button
          onClick={fetchFacts}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm text-gray-300 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          새로고침
        </button>
      </div>

      {/* Description */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg px-4 py-3 text-sm text-blue-200">
        퀴즈/투표 콘텐츠 생성 시 참조하는 검증된 팩트 데이터베이스입니다.
        <code className="ml-1 text-blue-400">research/facts/*.md</code> 파일을 자동으로 파싱합니다.
      </div>

      {/* Loading / Error / Empty States */}
      {loading && <LoadingState />}
      {error && <ErrorState message={error} onRetry={fetchFacts} />}
      {!loading && !error && factsData.length === 0 && <EmptyState />}

      {/* Content */}
      {!loading && !error && factsData.length > 0 && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-white">{totalStats.total}</div>
              <div className="text-sm text-gray-400">전체 팩트</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg px-4 py-3 border border-gray-700/50">
              <div className="text-2xl font-bold text-white">{totalStats.categories}</div>
              <div className="text-sm text-gray-400">카테고리</div>
            </div>
            <div className="bg-green-500/10 rounded-lg px-4 py-3 border border-green-500/30">
              <div className="text-2xl font-bold text-green-400">{totalStats.fresh}</div>
              <div className="text-sm text-green-300/70">검증됨</div>
            </div>
            <div className="bg-yellow-500/10 rounded-lg px-4 py-3 border border-yellow-500/30">
              <div className="text-2xl font-bold text-yellow-400">{totalStats.aging}</div>
              <div className="text-sm text-yellow-300/70">재검증 권장</div>
            </div>
            <div className="bg-red-500/10 rounded-lg px-4 py-3 border border-red-500/30">
              <div className="text-2xl font-bold text-red-400">{totalStats.stale}</div>
              <div className="text-sm text-red-300/70">재검증 필요</div>
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="팩트 ID, 제목, 값, 출처, 콘텐츠 ID로 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-800/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Categories */}
          <div className="space-y-4">
            {filteredData.map((category) => (
              <CategorySection key={category.category} data={category} />
            ))}

            {filteredData.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                검색 결과가 없습니다.
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="bg-gray-800/30 rounded-lg px-4 py-3 text-sm text-gray-400">
            <div className="font-medium text-gray-300 mb-1">팩트 파일 위치</div>
            <code className="text-blue-400">research/facts/*.md</code>
            <div className="mt-2 text-xs">
              콘텐츠 생성 시 content-creator 에이전트가 자동으로 팩트 파일을 참조합니다.
            </div>
          </div>
        </>
      )}
    </div>
  );
}
