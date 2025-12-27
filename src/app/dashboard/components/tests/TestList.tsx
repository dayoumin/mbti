'use client';

import { useState } from 'react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey } from '@/data/types';
import { TEST_TYPES } from '@/data/config';
import { getTestIcon } from '@/utils/testIcons';
import { TypeTabs, getTestsByType, TestSelectorProps } from './TestSelector';

export default function TestList({ selectedTest, onSelectTest }: TestSelectorProps) {
  const testsByType = getTestsByType();
  const types = Object.keys(testsByType);
  const [selectedType, setSelectedType] = useState(types[0] || 'personality');
  const testsForType = testsByType[selectedType] || [];
  const typeInfo = TEST_TYPES[selectedType as keyof typeof TEST_TYPES];

  return (
    <div className="space-y-6">
      <TypeTabs selectedType={selectedType} onSelectType={setSelectedType} />

      {/* 타입 설명 */}
      <div className="flex items-center gap-3 text-sm text-[var(--db-muted)]">
        <span>{typeInfo?.description}</span>
        <span className="opacity-50">•</span>
        <span>{testsForType.length}개 테스트</span>
      </div>

      {/* 테스트 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {testsForType.map((key) => {
          const data = CHEMI_DATA[key];

          return (
            <div
              key={key}
              onClick={() => onSelectTest(key)}
              className={`db-card p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${selectedTest === key ? 'ring-2 ring-[var(--db-brand)]' : ''
                }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(122, 162, 255, 0.15)' }}
                >
                  <span className="text-[var(--db-brand)]">{getTestIcon(key)}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--db-text)] mb-1">{data.title}</h3>
                  <p className="text-sm text-[var(--db-muted)] mb-3">{data.subtitle}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--db-muted)]">
                    <span>{data.questions.length}개 질문</span>
                    <span>{data.resultLabels.length}개 결과</span>
                    <span>{Object.keys(data.dimensions).length}개 차원</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
