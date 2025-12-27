'use client';

import { useMemo, useState } from 'react';
import {
    Calendar,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    RefreshCw,
    Clock,
} from 'lucide-react';

import { ALL_KNOWLEDGE_QUIZZES, ALL_SCENARIO_QUIZZES } from '@/data/content/quizzes';
import { VS_POLLS, CHOICE_POLLS } from '@/data/content/polls';
import { ALL_SITUATION_REACTIONS } from '@/data/content/situation-reactions';
import { TIER_TOURNAMENTS } from '@/data/content/tournaments';
import { CATEGORY_LABELS } from '@/data/content/categories';
import type { ContentCategory, ValidityStatus, TimeSensitivity } from '@/data/content/types';
import { getValidityStatus, VALIDITY_PERIODS } from '@/data/content/types';

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

export default function ContentValidityManager() {
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
            <div className="db-card-header px-5 py-4 flex items-center justify-between border-b border-white/10">
                <h3 className="text-lg font-semibold text-[var(--db-text)] flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[var(--db-brand)]" />
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
                        <RefreshCw className="w-4 h-4 text-[var(--db-brand)]" />
                        갱신 주기별 분포
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {(Object.entries(SENSITIVITY_LABELS) as [TimeSensitivity, typeof SENSITIVITY_LABELS[TimeSensitivity]][]).map(([sensitivity, config]) => (
                            <div key={sensitivity} className="flex items-center gap-2">
                                <span
                                    className="w-3 h-3 rounded-full shrink-0"
                                    style={{ background: config.color }}
                                />
                                <span className="text-xs text-[var(--db-muted)] truncate">
                                    {config.label} ({config.period}): {validityData.bySensitivity[sensitivity]}개
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 주의가 필요한 콘텐츠 목록 */}
                {needsAttention > 0 ? (
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

                        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                            {[...validityData.byStatus.outdated, ...validityData.byStatus.needs_review]
                                .slice(0, showAllItems ? undefined : 5)
                                .map((item) => {
                                    const statusConfig = STATUS_CONFIG[item.status];
                                    const typeLabel = { quiz: '퀴즈', poll: '투표', situation: '상황', tournament: '토너먼트' }[item.type];
                                    const categoryInfo = CATEGORY_LABELS[item.category as ContentCategory];

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-3 rounded-lg bg-black/20 border border-white/5"
                                        >
                                            <span style={{ color: statusConfig.color }}>{statusConfig.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-50/10 text-[var(--db-muted)] uppercase">
                                                        {typeLabel}
                                                    </span>
                                                    <span className="text-[10px] text-[var(--db-muted)]">
                                                        {categoryInfo?.emoji} {categoryInfo?.name || item.category}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-[var(--db-text)] truncate mt-1">{item.title}</p>
                                            </div>
                                            <div className="text-right">
                                                <div
                                                    className="text-[10px] px-2 py-0.5 rounded-full inline-block"
                                                    style={{ background: statusConfig.bgColor, color: statusConfig.color }}
                                                >
                                                    {statusConfig.label}
                                                </div>
                                                <p className="text-[10px] text-[var(--db-muted)] mt-1">
                                                    {item.validUntil ? `~${item.validUntil}` : '무기한'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>

                        {!showAllItems && needsAttention > 5 && (
                            <p className="text-xs text-center text-[var(--db-muted)] pt-1">
                                외 {needsAttention - 5}개 더...
                            </p>
                        )}
                    </div>
                ) : (
                    <div className="space-y-3">
                        <div className="p-8 text-center bg-black/10 rounded-xl border border-dashed border-white/10">
                            <CheckCircle2 className="w-10 h-10 text-green-500/30 mx-auto mb-3" />
                            <p className="text-sm text-[var(--db-muted)]">모든 콘텐츠가 현재 유효합니다.</p>
                            <button
                                onClick={() => setShowAllItems(!showAllItems)}
                                className="mt-4 text-xs text-[var(--db-brand)] hover:underline"
                            >
                                {showAllItems ? '상세 목록 접기' : '전체 목록 보기'}
                            </button>
                        </div>

                        {showAllItems && (
                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                {validityData.items.map((item) => {
                                    const statusConfig = STATUS_CONFIG[item.status];
                                    const typeLabel = { quiz: '퀴즈', poll: '투표', situation: '상황', tournament: '토너먼트' }[item.type];
                                    const categoryInfo = CATEGORY_LABELS[item.category as ContentCategory];

                                    return (
                                        <div
                                            key={item.id}
                                            className="flex items-center gap-3 p-2.5 rounded-lg bg-black/20 border border-white/5 opacity-80"
                                        >
                                            <span style={{ color: statusConfig.color }}>{statusConfig.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-50/10 text-[var(--db-muted)] uppercase">
                                                        {typeLabel}
                                                    </span>
                                                    <span className="text-[9px] text-[var(--db-muted)]">
                                                        {categoryInfo?.emoji} {categoryInfo?.name || item.category}
                                                    </span>
                                                </div>
                                                <p className="text-xs text-[var(--db-text)] truncate mt-0.5">{item.title}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-[var(--db-muted)]">
                                                    {item.validUntil ? `~${item.validUntil}` : '무기한'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
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
