'use client';

import { useState } from 'react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey } from '@/data/types';
import { TEST_TYPES, SUBJECT_CONFIG } from '@/data/config';
import { getTestIcon } from '@/utils/testIcons';

export interface TestSelectorProps {
  selectedTest: SubjectKey;
  onSelectTest: (test: SubjectKey) => void;
}

// 테스트를 타입별로 그룹화
export function getTestsByType(): Record<string, SubjectKey[]> {
  const grouped: Record<string, SubjectKey[]> = {};
  (Object.keys(CHEMI_DATA) as SubjectKey[]).forEach((key) => {
    const config = SUBJECT_CONFIG[key as keyof typeof SUBJECT_CONFIG];
    if (!config) return;
    const type = config.testType;
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(key);
  });
  return grouped;
}

interface TypeTabsProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

export function TypeTabs({ selectedType, onSelectType }: TypeTabsProps) {
  const testsByType = getTestsByType();
  const types = Object.keys(testsByType);

  return (
    <div className="db-tabs flex gap-2 p-2 rounded-xl mb-6">
      {types.map((type) => {
        const typeInfo = TEST_TYPES[type as keyof typeof TEST_TYPES];
        const isSelected = selectedType === type;
        const count = testsByType[type].length;

        return (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className={`db-tab flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${isSelected ? 'active' : ''
              }`}
          >
            <span>{typeInfo?.emoji}</span>
            <span>{typeInfo?.label || type}</span>
            <span className="db-chip">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function TestSelector({ selectedTest, onSelectTest }: TestSelectorProps) {
  const testsByType = getTestsByType();
  const types = Object.keys(testsByType);
  const [selectedType, setSelectedType] = useState(types[0] || 'personality');
  const testsForType = testsByType[selectedType] || [];

  return (
    <div className="mb-6">
      <TypeTabs selectedType={selectedType} onSelectType={setSelectedType} />

      <div className="flex flex-wrap gap-2">
        {testsForType.map((key) => {
          const data = CHEMI_DATA[key];
          const isSelected = selectedTest === key;

          return (
            <button
              key={key}
              onClick={() => onSelectTest(key)}
              className={`db-tab flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${isSelected ? 'active' : ''
                }`}
            >
              {getTestIcon(key)}
              {data.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
