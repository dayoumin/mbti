'use client';

import { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Edit3,
  Eye,
  Filter,
  Search,
  ChevronDown,
  ChevronRight,
  FileText,
  Shield,
  RefreshCw,
  Trash2,
  Check,
  X,
} from 'lucide-react';
import {
  CONTENT_REVIEW_ITEMS,
  REVIEW_GUIDELINES,
  ContentReviewItem,
  ReviewStatus,
  ReviewType,
  calculateReviewStats,
  getPendingReviews,
  shouldShowAlert,
  getAlertMessage,
  REVIEW_ALERT_CONFIG,
} from '../data/content-review';

// ============================================================================
// Status Badge Component
// ============================================================================

function StatusBadge({ status }: { status: ReviewStatus }) {
  const config: Record<ReviewStatus, { icon: React.ReactNode; label: string; className: string }> = {
    pending: {
      icon: <Clock className="w-3 h-3" />,
      label: '대기',
      className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    },
    approved: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: '승인',
      className: 'bg-green-500/20 text-green-400 border-green-500/30',
    },
    modified: {
      icon: <Edit3 className="w-3 h-3" />,
      label: '수정',
      className: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    rejected: {
      icon: <XCircle className="w-3 h-3" />,
      label: '거부',
      className: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
  };

  const { icon, label, className } = config[status];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${className}`}>
      {icon}
      {label}
    </span>
  );
}

// ============================================================================
// Review Type Badge Component
// ============================================================================

function ReviewTypeBadge({ type }: { type: ReviewType }) {
  const config: Record<ReviewType, { icon: React.ReactNode; label: string; className: string }> = {
    'age-restriction': {
      icon: <Shield className="w-3 h-3" />,
      label: '연령 제한',
      className: 'bg-purple-500/20 text-purple-400',
    },
    'content-quality': {
      icon: <FileText className="w-3 h-3" />,
      label: '품질',
      className: 'bg-blue-500/20 text-blue-400',
    },
    accuracy: {
      icon: <CheckCircle2 className="w-3 h-3" />,
      label: '정확성',
      className: 'bg-green-500/20 text-green-400',
    },
    sensitive: {
      icon: <AlertTriangle className="w-3 h-3" />,
      label: '민감',
      className: 'bg-orange-500/20 text-orange-400',
    },
  };

  const { icon, label, className } = config[type];

  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs ${className}`}>
      {icon}
      {label}
    </span>
  );
}

// ============================================================================
// Confidence Badge Component
// ============================================================================

function ConfidenceBadge({ level }: { level: 'high' | 'medium' | 'low' }) {
  const config = {
    high: { label: '높음', className: 'text-green-400' },
    medium: { label: '중간', className: 'text-yellow-400' },
    low: { label: '낮음', className: 'text-red-400' },
  };

  return (
    <span className={`text-xs ${config[level].className}`}>
      확신도: {config[level].label}
    </span>
  );
}

// ============================================================================
// Review Item Card Component
// ============================================================================

function ReviewItemCard({
  item,
  onApprove,
  onReject,
  onModify,
}: {
  item: ContentReviewItem;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onModify: (id: string, note: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState('');

  return (
    <div className="bg-[var(--db-panel)] rounded-xl border border-[var(--db-border)] overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--db-panel-hover)]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-3">
          <button className="text-[var(--db-muted)]">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-[var(--db-text)]">{item.contentId}</span>
              <ReviewTypeBadge type={item.reviewType} />
              <StatusBadge status={item.status} />
            </div>
            <p className="text-sm text-[var(--db-muted)] mt-1 line-clamp-1">
              {item.contentSummary.question}
            </p>
          </div>
        </div>
        <ConfidenceBadge level={item.aiSuggestion.confidence} />
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-[var(--db-border)] p-4 space-y-4">
          {/* AI Suggestion */}
          <div className="bg-[var(--db-bg)]/50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-[var(--db-text)] mb-2">AI 제안</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--db-muted)]">필드:</span>
                <span className="ml-2 font-mono text-[var(--db-brand)]">{item.aiSuggestion.field}</span>
              </div>
              <div>
                <span className="text-[var(--db-muted)]">현재:</span>
                <span className="ml-2 font-mono text-red-400">
                  {JSON.stringify(item.aiSuggestion.currentValue)}
                </span>
              </div>
              <div className="col-span-2">
                <span className="text-[var(--db-muted)]">제안:</span>
                <span className="ml-2 font-mono text-green-400">
                  {JSON.stringify(item.aiSuggestion.suggestedValue)}
                </span>
              </div>
            </div>
            <p className="text-sm text-[var(--db-muted)] mt-2">
              {item.aiSuggestion.reason}
            </p>
          </div>

          {/* Content Summary */}
          {item.contentSummary.options && (
            <div className="bg-[var(--db-bg)]/50 rounded-lg p-3">
              <h4 className="text-sm font-medium text-[var(--db-text)] mb-2">콘텐츠 요약</h4>
              <ul className="space-y-1">
                {item.contentSummary.options.map((opt, i) => (
                  <li key={i} className="text-sm text-[var(--db-muted)]">
                    • {opt}
                  </li>
                ))}
              </ul>
              {item.contentSummary.tags && (
                <div className="flex gap-1 mt-2">
                  {item.contentSummary.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 bg-[var(--db-border)] rounded text-xs text-[var(--db-muted)]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Review Actions (only for pending) */}
          {item.status === 'pending' && (
            <div className="space-y-3">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="검수 메모 (선택사항)"
                className="w-full px-3 py-2 bg-[var(--db-bg)] border border-[var(--db-border)] rounded-lg text-sm text-[var(--db-text)] placeholder-[var(--db-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--db-brand)]/50"
                rows={2}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => onApprove(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30 transition-colors"
                >
                  <Check className="w-4 h-4" />
                  승인 (제안대로 적용)
                </button>
                <button
                  onClick={() => onModify(item.id, note)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
                >
                  <Edit3 className="w-4 h-4" />
                  수정 후 적용
                </button>
                <button
                  onClick={() => onReject(item.id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30 transition-colors"
                >
                  <X className="w-4 h-4" />
                  거부 (현재 유지)
                </button>
              </div>
            </div>
          )}

          {/* Review History (for completed) */}
          {item.status !== 'pending' && item.reviewedAt && (
            <div className="text-sm text-[var(--db-muted)]">
              <span>검수: {item.reviewedAt}</span>
              {item.reviewNote && <span className="ml-2">| {item.reviewNote}</span>}
            </div>
          )}

          {/* File Path */}
          <div className="text-xs text-[var(--db-muted)] font-mono">
            {item.contentPath}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Stats Card Component
// ============================================================================

function StatsCard({
  label,
  value,
  icon,
  color,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="bg-[var(--db-panel)] rounded-xl p-4 border border-[var(--db-border)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[var(--db-muted)]">{label}</p>
          <p className={`text-2xl font-bold ${color}`}>{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-[var(--db-bg)] ${color}`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Guidelines Section Component
// ============================================================================

function GuidelinesSection() {
  const ageGuideline = REVIEW_GUIDELINES['age-restriction'];

  return (
    <div className="bg-[var(--db-panel)] rounded-xl p-6 border border-[var(--db-border)]">
      <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
        <Shield className="w-5 h-5 text-purple-400" />
        {ageGuideline.title} 기준
      </h3>

      <div className="grid md:grid-cols-2 gap-6">
        {/* isAdultOnly */}
        <div>
          <h4 className="font-medium text-[var(--db-text)] mb-3">isAdultOnly 적용</h4>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-green-400 mb-2">✅ 적용해야 함:</p>
              <ul className="space-y-1">
                {ageGuideline.criteria.isAdultOnly.shouldApply.map((item, i) => (
                  <li key={i} className="text-sm text-[var(--db-muted)] pl-4">• {item}</li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm text-red-400 mb-2">❌ 적용하지 않음:</p>
              <ul className="space-y-1">
                {ageGuideline.criteria.isAdultOnly.shouldNotApply.map((item, i) => (
                  <li key={i} className="text-sm text-[var(--db-muted)] pl-4">• {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* minAge */}
        <div>
          <h4 className="font-medium text-[var(--db-text)] mb-3">minAge: &apos;20s&apos; 적용</h4>
          <ul className="space-y-1">
            {ageGuideline.criteria.minAge['20s'].map((item, i) => (
              <li key={i} className="text-sm text-[var(--db-muted)] pl-4">• {item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Empty State Component
// ============================================================================

function EmptyState() {
  return (
    <div className="bg-[var(--db-panel)] rounded-xl p-12 border border-[var(--db-border)] text-center">
      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-[var(--db-text)] mb-2">
        검수 대기 항목이 없습니다
      </h3>
      <p className="text-sm text-[var(--db-muted)]">
        content-auditor 에이전트가 검수 후보를 발견하면 여기에 표시됩니다.
      </p>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function ContentReview() {
  const [activeTab, setActiveTab] = useState<'pending' | 'all' | 'guidelines'>('pending');
  const [filterType, setFilterType] = useState<ReviewType | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 임시 상태 관리 (실제로는 서버/DB에 저장)
  const [items, setItems] = useState<ContentReviewItem[]>(CONTENT_REVIEW_ITEMS);

  const stats = calculateReviewStats(items);
  const pendingItems = getPendingReviews(items);

  // 알림 확인
  const alertInfo = shouldShowAlert(pendingItems.length);
  const alertMessage = alertInfo.reason ? getAlertMessage(pendingItems.length, alertInfo.reason) : null;

  // 필터링된 아이템
  const filteredItems = items.filter(item => {
    if (activeTab === 'pending' && item.status !== 'pending') return false;
    if (filterType !== 'all' && item.reviewType !== filterType) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.contentId.toLowerCase().includes(query) ||
        item.contentSummary.question?.toLowerCase().includes(query) ||
        item.contentSummary.tags?.some(t => t.toLowerCase().includes(query))
      );
    }
    return true;
  });

  // 액션 핸들러
  const handleApprove = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'approved' as ReviewStatus,
              reviewedAt: new Date().toISOString(),
              finalValue: item.aiSuggestion.suggestedValue,
            }
          : item
      )
    );
  };

  const handleReject = (id: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'rejected' as ReviewStatus,
              reviewedAt: new Date().toISOString(),
            }
          : item
      )
    );
  };

  const handleModify = (id: string, note: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              status: 'modified' as ReviewStatus,
              reviewedAt: new Date().toISOString(),
              reviewNote: note,
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[var(--db-text)]">콘텐츠 검수</h2>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            AI가 발견한 연령 제한 후보를 검토하고 승인/수정합니다
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[var(--db-brand)] text-[#081023] rounded-xl text-sm font-medium hover:opacity-90 transition-opacity">
          <RefreshCw className="w-4 h-4" />
          검수 대상 새로고침
        </button>
      </div>

      {/* Alert Banner */}
      {alertMessage && (
        <div className={`rounded-xl p-4 border flex items-center gap-3 ${
          alertInfo.reason === 'threshold'
            ? 'bg-red-500/10 border-red-500/30 text-red-400'
            : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
        }`}>
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{alertMessage}</span>
          <span className="text-xs opacity-75 ml-auto">
            알림 기준: {REVIEW_ALERT_CONFIG.thresholdCount}개 이상 또는 매주 월요일
          </span>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <StatsCard
          label="전체"
          value={stats.total}
          icon={<FileText className="w-5 h-5" />}
          color="text-[var(--db-text)]"
        />
        <StatsCard
          label="대기"
          value={stats.pending}
          icon={<Clock className="w-5 h-5" />}
          color="text-yellow-400"
        />
        <StatsCard
          label="승인"
          value={stats.approved}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="text-green-400"
        />
        <StatsCard
          label="수정"
          value={stats.modified}
          icon={<Edit3 className="w-5 h-5" />}
          color="text-blue-400"
        />
        <StatsCard
          label="거부"
          value={stats.rejected}
          icon={<XCircle className="w-5 h-5" />}
          color="text-red-400"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'pending', label: `대기 (${pendingItems.length})`, icon: <Clock className="w-4 h-4" /> },
          { key: 'all', label: '전체 기록', icon: <FileText className="w-4 h-4" /> },
          { key: 'guidelines', label: '검수 기준', icon: <Shield className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-[var(--db-brand)] text-[#081023]'
                : 'bg-[var(--db-panel)] text-[var(--db-muted)] hover:text-[var(--db-text)]'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Guidelines Tab */}
      {activeTab === 'guidelines' && <GuidelinesSection />}

      {/* List Tabs */}
      {activeTab !== 'guidelines' && (
        <>
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--db-muted)]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="콘텐츠 ID, 질문, 태그로 검색..."
                className="w-full pl-10 pr-4 py-2 bg-[var(--db-panel)] border border-[var(--db-border)] rounded-lg text-sm text-[var(--db-text)] placeholder-[var(--db-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--db-brand)]/50"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[var(--db-muted)]" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as typeof filterType)}
                className="px-3 py-2 bg-[var(--db-panel)] border border-[var(--db-border)] rounded-lg text-sm text-[var(--db-text)] focus:outline-none focus:ring-2 focus:ring-[var(--db-brand)]/50"
              >
                <option value="all">모든 유형</option>
                <option value="age-restriction">연령 제한</option>
                <option value="content-quality">품질</option>
                <option value="accuracy">정확성</option>
                <option value="sensitive">민감</option>
              </select>
            </div>
          </div>

          {/* Review Items */}
          {filteredItems.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="space-y-3">
              {filteredItems.map((item) => (
                <ReviewItemCard
                  key={item.id}
                  item={item}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  onModify={handleModify}
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
