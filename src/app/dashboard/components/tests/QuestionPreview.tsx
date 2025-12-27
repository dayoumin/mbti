'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { CHEMI_DATA } from '@/data';
import TestSelector, { TestSelectorProps } from './TestSelector';

export default function QuestionPreview({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return data.questions;
    return data.questions.filter((q) =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.questions, searchTerm]);

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      {/* Search */}
      <div className="relative db-search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--db-muted)]" />
        <input
          type="text"
          placeholder="질문 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 outline-none"
        />
      </div>

      {/* Questions List */}
      <div className="db-card divide-y divide-[rgba(255,255,255,0.06)]">
        {filteredQuestions.map((q, idx) => (
          <div key={idx} className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
            <div className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
                style={{ background: 'rgba(122, 162, 255, 0.2)', color: 'var(--db-brand)' }}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-[var(--db-text)]">{q.q}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[var(--db-muted)]">
                  <span>차원: {q.dimension}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
