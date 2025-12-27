'use client';

import { CHEMI_DATA } from '@/data';
import { getTestIcon } from '@/utils/testIcons';
import TestSelector, { TestSelectorProps } from './TestSelector';

export default function TestDetail({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];
  const dimensionEntries = Object.entries(data.dimensions);

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      {/* Header Card */}
      <div className="db-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(122, 162, 255, 0.15)' }}
          >
            <span className="text-[var(--db-brand)]">{getTestIcon(selectedTest)}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--db-text)]">{data.title}</h2>
            <p className="text-[var(--db-muted)]">{data.subtitle}</p>
          </div>
        </div>

        {/* Dimensions */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--db-text)] mb-3">측정 차원</h3>
          <div className="grid grid-cols-5 gap-3">
            {dimensionEntries.map(([key, dim]) => (
              <div key={key} className="db-callout">
                <p className="font-medium text-[var(--db-text)]">{dim.name}</p>
                <p className="text-xs text-[var(--db-muted)] mt-1">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            결과 유형 ({data.resultLabels.length}개)
          </h3>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {data.resultLabels.slice(0, 8).map((result, idx) => (
            <div key={idx} className="db-callout flex items-center gap-3">
              <span className="text-2xl">{result.emoji}</span>
              <div>
                <p className="font-medium text-[var(--db-text)]">{result.name}</p>
                <p className="text-xs text-[var(--db-muted)] truncate max-w-xs">{result.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {data.resultLabels.length > 8 && (
          <p className="text-sm text-[var(--db-muted)] pb-4 text-center">
            + {data.resultLabels.length - 8}개 더...
          </p>
        )}
      </div>
    </div>
  );
}
