'use client';

import { ChevronRight, CheckCircle2, RefreshCw, Play } from 'lucide-react';
import { CHEMI_DATA } from '@/data';
import TestSelector, { TestSelectorProps } from './TestSelector';

export default function LogicViewer({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];

  // 차원별 문항 수 계산
  const dimCounts: Record<string, number> = {};
  data.questions.forEach((q) => {
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      {/* 매칭 로직 설명 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">🔄 매칭 로직 흐름</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* 플로우 다이어그램 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-medium">
              1. 사용자 답변
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium">
              2. 차원별 점수 합산
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium">
              3. 레벨 변환
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm font-medium">
              4. 조건 매칭
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 text-sm font-medium">
              5. 결과 결정
            </div>
          </div>

          {/* 레벨 변환 기준 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <h4 className="text-sm font-semibold text-[var(--db-text)] mb-3">📊 레벨 변환 기준</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400">HIGH</span>
                  <span className="text-[var(--db-muted)]">점수 ≥ 60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400">MEDIUM</span>
                  <span className="text-[var(--db-muted)]">40% ≤ 점수 &lt; 60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-400">LOW</span>
                  <span className="text-[var(--db-muted)]">점수 &lt; 40%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <h4 className="text-sm font-semibold text-[var(--db-text)] mb-3">🎯 매칭 우선순위</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--db-brand)] font-mono">1.</span>
                  <span className="text-[var(--db-text)]">완전 매칭 (모든 조건 일치)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--db-brand)] font-mono">2.</span>
                  <span className="text-[var(--db-text)]">조건 개수 많은 것 우선</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--db-brand)] font-mono">3.</span>
                  <span className="text-[var(--db-text)]">부분 매칭 (가장 많이 일치)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 선택된 테스트의 차원 및 결과 분석 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">📋 {data.title} 분석</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* 차원별 문항 수 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--db-muted)] mb-3">차원별 문항 수</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dimCounts).map(([dim, count]) => (
                <div key={dim} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(122,162,255,0.15)' }}>
                  <span className="text-[var(--db-text)] text-sm font-medium">{dim}</span>
                  <span className="text-[var(--db-brand)] text-sm">{count}문항</span>
                  <span className="text-[var(--db-muted)] text-xs">(max: {count * 5}점)</span>
                </div>
              ))}
            </div>
          </div>

          {/* 결과 유형별 조건 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--db-muted)] mb-3">결과 유형 조건</h4>
            <div className="space-y-2">
              {data.resultLabels.map((r, idx) => {
                const conditionEntries = Object.entries(r.condition || {});
                const conditionCount = conditionEntries.length;
                return (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50/5 transition-colors">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-[var(--db-text)] text-sm font-medium min-w-[120px]">{r.name}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {conditionCount > 0 ? (
                        conditionEntries.map(([dim, level]) => (
                          <span
                            key={dim}
                            className={`px-2 py-0.5 rounded text-xs font-mono ${level === 'high' ? 'bg-emerald-500/20 text-emerald-300' :
                                level === 'low' ? 'bg-rose-500/20 text-rose-300' :
                                  'bg-amber-500/20 text-amber-300'
                              }`}
                          >
                            {dim}:{level}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--db-muted)] text-xs italic">fallback (조건 없음)</span>
                      )}
                    </div>
                    <span className="text-[var(--db-muted)] text-xs ml-auto">({conditionCount}조건)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 검증 도구 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">🧪 검증 도구</h3>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-[var(--db-muted)]">
            테스트 데이터의 품질을 검증하는 스크립트들입니다. 새 테스트 추가 시 반드시 실행하세요.
          </p>

          {/* 스크립트 목록 */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[var(--db-text)] text-sm font-medium">통합 검증</span>
              </div>
              <code className="text-xs text-[var(--db-brand)] block">
                node scripts/validate-test-data.mjs {'{subject}'}
              </code>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                구조, 차원, 결과 도달 가능성, 동기화, 품질 검사
              </p>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                <span className="text-[var(--db-text)] text-sm font-medium">동기화 검사</span>
              </div>
              <code className="text-xs text-[var(--db-brand)] block">
                node scripts/compare-data-sync.mjs
              </code>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                Legacy(legacy/data/) ↔ TypeScript(src/data/) 일치 여부
              </p>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-purple-400" />
                <span className="text-[var(--db-text)] text-sm font-medium">매칭 로직 테스트</span>
              </div>
              <code className="text-xs text-[var(--db-brand)] block">
                node scripts/test-matching-logic.mjs
              </code>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                결과 유형별 도달 가능성, 경쟁 상황 테스트
              </p>
            </div>
          </div>

          {/* 검증 체크리스트 */}
          <div className="p-4 rounded-lg border border-[var(--db-brand)]/30" style={{ background: 'rgba(122,162,255,0.05)' }}>
            <h4 className="text-sm font-semibold text-[var(--db-brand)] mb-3">✅ 검증 체크리스트</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[var(--db-text)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>필수 필드 존재 (title, dimensions, questions, resultLabels)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>모든 차원에 질문 존재</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>모든 결과 유형 도달 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>중복 조건 없음</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>Next.js ↔ Legacy 동기화</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>질문 중복 없음</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
