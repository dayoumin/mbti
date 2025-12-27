'use client';

import { useState } from 'react';
import AppDesignSystem from './AppDesignSystem';
import DashboardTokens from './DashboardTokens';
import ArchiveSection from './ArchiveSection';

export default function DesignTokens() {
  const [activeSection, setActiveSection] = useState<'app' | 'dashboard' | 'archive'>('app');

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="db-card p-2">
        <div className="flex gap-1">
          {[
            { key: 'app' as const, label: '앱 디자인 시스템' },
            { key: 'dashboard' as const, label: '대시보드 토큰' },
            { key: 'archive' as const, label: '아카이브' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === tab.key
                  ? 'bg-[var(--db-brand)] text-[#081023]'
                  : 'text-[var(--db-muted)] hover:text-[var(--db-text)] hover:bg-[rgba(255,255,255,0.05)]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSection === 'app' && <AppDesignSystem />}
      {activeSection === 'dashboard' && <DashboardTokens />}
      {activeSection === 'archive' && <ArchiveSection />}
    </div>
  );
}
