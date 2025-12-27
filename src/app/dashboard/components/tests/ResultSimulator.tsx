'use client';

import { useState, useMemo } from 'react';
import { CHEMI_DATA } from '@/data';
import TestSelector, { TestSelectorProps } from './TestSelector';

export default function ResultSimulator({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];
  const dimensionKeys = Object.keys(data.dimensions);

  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    dimensionKeys.forEach((key) => (initial[key] = 50));
    return initial;
  });

  const handleScoreChange = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const matchedResult = useMemo(() => {
    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    const idx = Math.floor((avgScore / 100) * (data.resultLabels.length - 1));
    return data.resultLabels[Math.min(idx, data.resultLabels.length - 1)];
  }, [scores, data.resultLabels]);

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      <div className="grid grid-cols-2 gap-6">
        {/* Score Sliders */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">점수 조절</h3>
          </div>
          <div className="p-5 space-y-4">
            {dimensionKeys.map((key) => {
              const dim = (data.dimensions as Record<string, { name: string; emoji: string; desc: string }>)[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--db-text)]">{dim.name}</span>
                    <span className="text-sm text-[var(--db-brand)] font-bold">{scores[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores[key]}
                    onChange={(e) => handleScoreChange(key, Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: 'rgba(122, 162, 255, 0.3)', accentColor: 'var(--db-brand)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Preview */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">예측 결과</h3>
          </div>
          <div className="p-5">
            {matchedResult && (
              <div className="text-center">
                <span className="text-6xl mb-4 block">{matchedResult.emoji}</span>
                <h4 className="text-xl font-bold text-[var(--db-text)] mb-2">{matchedResult.name}</h4>
                <p className="text-[var(--db-muted)]">{matchedResult.desc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
