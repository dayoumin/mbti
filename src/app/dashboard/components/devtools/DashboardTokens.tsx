'use client';

export default function DashboardTokens() {
  const colors = [
    { name: 'Brand', value: '#7aa2ff', hex: 'var(--db-brand)' },
    { name: 'Brand2', value: '#55e6c1', hex: 'var(--db-brand2)' },
    { name: 'Success', value: '#7CFF8A', hex: 'var(--db-ok)' },
    { name: 'Warning', value: '#ffd166', hex: 'var(--db-warning)' },
    { name: 'Error', value: '#ff6b6b', hex: 'var(--db-danger)' },
    { name: 'Text', value: '#e8eefc', hex: 'var(--db-text)' },
    { name: 'Muted', value: '#a9b4d0', hex: 'var(--db-muted)' },
    { name: 'Panel', value: '#0f1629', hex: 'var(--db-panel)' },
  ];

  return (
    <div className="space-y-6">
      {/* Colors */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">컬러 팔레트 (다크 테마)</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">대시보드 전용 CSS 변수</p>
        </div>
        <div className="p-5 grid grid-cols-4 gap-4">
          {colors.map((color) => (
            <div key={color.name} className="text-center">
              <div className="w-full h-16 rounded-lg mb-2" style={{ background: color.value }} />
              <p className="text-sm font-medium text-[var(--db-text)]">{color.name}</p>
              <code className="text-xs text-[var(--db-brand)]">{color.hex}</code>
            </div>
          ))}
        </div>
      </div>

      {/* Dashboard Components */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">대시보드 컴포넌트 클래스</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">globals.css에 정의된 .db-* 클래스</p>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-sm text-[var(--db-brand)]">.db-card</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">기본 카드 컨테이너</p>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-sm text-[var(--db-brand)]">.db-card-header</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">카드 헤더 (border-bottom)</p>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-sm text-[var(--db-brand)]">.db-chip</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">작은 태그 칩</p>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-sm text-[var(--db-brand)]">.db-pill</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">상태 표시 필 (.ok, .warn, .bad)</p>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-sm text-[var(--db-brand)]">.db-callout</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">강조 박스</p>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-sm text-[var(--db-brand)]">.db-nav-item</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">사이드바 네비게이션</p>
          </div>
        </div>
      </div>

      {/* Typography */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">타이포그래피</h3>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <span className="text-xs text-[var(--db-muted)] block mb-1">Heading 1 (2xl, bold)</span>
            <p className="text-2xl font-bold text-[var(--db-text)]">The quick brown fox</p>
          </div>
          <div>
            <span className="text-xs text-[var(--db-muted)] block mb-1">Heading 2 (xl, semibold)</span>
            <p className="text-xl font-semibold text-[var(--db-text)]">The quick brown fox</p>
          </div>
          <div>
            <span className="text-xs text-[var(--db-muted)] block mb-1">Body (base)</span>
            <p className="text-base text-[var(--db-text)]">The quick brown fox jumps over the lazy dog.</p>
          </div>
          <div>
            <span className="text-xs text-[var(--db-muted)] block mb-1">Caption (sm, muted)</span>
            <p className="text-sm text-[var(--db-muted)]">The quick brown fox jumps over the lazy dog.</p>
          </div>
        </div>
      </div>

      {/* Spacing */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">간격 시스템</h3>
        </div>
        <div className="p-5 flex items-end gap-4">
          {[1, 2, 3, 4, 6, 8, 12, 16].map((n) => (
            <div key={n} className="text-center">
              <div className="rounded" style={{ width: `${n * 4}px`, height: `${n * 4}px`, background: 'var(--db-brand)' }} />
              <p className="text-xs text-[var(--db-muted)] mt-2">{n * 4}px</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
