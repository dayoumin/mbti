'use client';

import Link from 'next/link';
import {
  FlaskConical,
  FileText,
  Sparkles,
  Puzzle,
  Play,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey } from '@/data/types';
import { TEST_TYPES } from '@/data/config';
import { getTestIcon } from '@/utils/testIcons';

export default function OverviewSummary() {
  const testCount = Object.keys(CHEMI_DATA).length;
  const totalQuestions = Object.values(CHEMI_DATA).reduce(
    (sum, data) => sum + data.questions.length,
    0
  );
  const totalResults = Object.values(CHEMI_DATA).reduce(
    (sum, data) => sum + data.resultLabels.length,
    0
  );

  const stats = [
    { label: '총 테스트', value: testCount, icon: <FlaskConical className="w-5 h-5" />, color: 'var(--db-brand)' },
    { label: '총 질문', value: totalQuestions, icon: <FileText className="w-5 h-5" />, color: 'var(--db-brand2)' },
    { label: '결과 유형', value: totalResults, icon: <Sparkles className="w-5 h-5" />, color: 'var(--db-warning)' },
    { label: '테스트 타입', value: Object.keys(TEST_TYPES).length, icon: <Puzzle className="w-5 h-5" />, color: 'var(--db-danger)' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="db-card p-5 hover:scale-[1.02] transition-transform duration-200"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${stat.color}22` }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--db-text)]">{stat.value}</p>
            <p className="text-sm text-[var(--db-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Test Overview Cards */}
      <div className="db-card overflow-visible">
        <div className="db-card-header px-5 py-4">
          <h2 className="text-lg font-semibold text-[var(--db-text)]">테스트 현황</h2>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          {(Object.keys(CHEMI_DATA) as SubjectKey[]).map((key) => {
            const data = CHEMI_DATA[key];

            return (
              <div
                key={key}
                className="db-callout hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[var(--db-brand)]">{getTestIcon(key)}</span>
                  <div>
                    <h3 className="font-medium text-[var(--db-text)]">{data.title}</h3>
                    <p className="text-xs text-[var(--db-muted)]">{data.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[var(--db-muted)]">
                    <strong className="text-[var(--db-text)]">{data.questions.length}</strong> 질문
                  </span>
                  <span className="text-[var(--db-muted)]">
                    <strong className="text-[var(--db-text)]">{data.resultLabels.length}</strong> 결과
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="db-card overflow-visible">
        <div className="db-card-header px-5 py-4">
          <h2 className="text-lg font-semibold text-[var(--db-text)]">빠른 작업</h2>
        </div>
        <div className="p-5 flex gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, var(--db-brand), var(--db-brand2))',
              color: '#081023'
            }}
          >
            <Play className="w-4 h-4" />
            테스트 실행
          </Link>
          <button className="db-tab flex items-center gap-2 px-4 py-2">
            <Settings className="w-4 h-4" />
            설정
          </button>
          <button className="db-tab flex items-center gap-2 px-4 py-2">
            <RefreshCw className="w-4 h-4" />
            데이터 새로고침
          </button>
        </div>
      </div>
    </div>
  );
}