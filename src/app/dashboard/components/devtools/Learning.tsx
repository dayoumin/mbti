'use client';

export default function Learning() {
  return (
    <div className="space-y-8">
      <div className="db-card p-6">
        <h2 className="text-xl font-bold text-[var(--db-text)] mb-2">웹 개발 기초</h2>
        <p className="text-[var(--db-muted)]">이 프로젝트를 이해하기 위한 핵심 개념들</p>
      </div>

      {/* JSX */}
      <div className="db-card p-6">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-xs font-mono text-[var(--db-muted)]">01</span>
          <h3 className="text-lg font-semibold text-[var(--db-text)]">JSX란?</h3>
        </div>
        <p className="text-[var(--db-muted)] mb-4">
          HTML처럼 생긴 JavaScript 코드입니다. React에서 UI를 쉽게 작성하기 위해 만든 문법이에요.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(122,162,255,0.1)', borderLeft: '3px solid var(--db-brand)' }}>
            <span className="text-xs text-[var(--db-muted)]">JSX 문법</span>
            <pre className="mt-2 text-sm text-[var(--db-text)] font-mono">{`<button onClick={click}>
  클릭
</button>`}</pre>
            <p className="text-xs text-[var(--db-ok)] mt-2">직관적이고 읽기 쉬움</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--db-muted)' }}>
            <span className="text-xs text-[var(--db-muted)]">순수 JavaScript</span>
            <pre className="mt-2 text-sm text-[var(--db-muted)] font-mono">{`React.createElement(
  "button",
  {onClick: click},
  "클릭"
)`}</pre>
            <p className="text-xs text-[var(--db-muted)] mt-2">복잡하고 읽기 어려움</p>
          </div>
        </div>
      </div>

      {/* TypeScript */}
      <div className="db-card p-6">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-xs font-mono text-[var(--db-muted)]">02</span>
          <h3 className="text-lg font-semibold text-[var(--db-text)]">TypeScript란?</h3>
        </div>
        <p className="text-[var(--db-muted)] mb-4">
          JavaScript에 타입을 추가한 언어입니다. 코드 작성 시 오류를 미리 잡아줍니다.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(122,162,255,0.1)', borderLeft: '3px solid var(--db-brand)' }}>
            <span className="text-xs text-[var(--db-muted)]">TypeScript</span>
            <pre className="mt-2 text-sm text-[var(--db-text)] font-mono">{`function add(a: number, b: number): number {
  return a + b;
}`}</pre>
            <p className="text-xs text-[var(--db-ok)] mt-2">타입 오류를 미리 감지</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)', borderLeft: '3px solid var(--db-muted)' }}>
            <span className="text-xs text-[var(--db-muted)]">JavaScript</span>
            <pre className="mt-2 text-sm text-[var(--db-muted)] font-mono">{`function add(a, b) {
  return a + b;
}
// add("1", 2) → "12" 오류!`}</pre>
            <p className="text-xs text-[var(--db-warning)] mt-2">런타임에 오류 발생</p>
          </div>
        </div>
      </div>

      {/* Next.js */}
      <div className="db-card p-6">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-xs font-mono text-[var(--db-muted)]">03</span>
          <h3 className="text-lg font-semibold text-[var(--db-text)]">Next.js란?</h3>
        </div>
        <p className="text-[var(--db-muted)] mb-4">
          React 기반 웹 프레임워크입니다. 라우팅, 서버 렌더링, 최적화를 자동으로 처리해줍니다.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h4 className="font-semibold text-[var(--db-text)] mb-2">App Router</h4>
            <p className="text-xs text-[var(--db-muted)]">폴더 구조 = URL 구조. app/page.tsx → /</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h4 className="font-semibold text-[var(--db-text)] mb-2">Server/Client</h4>
            <p className="text-xs text-[var(--db-muted)]">&apos;use client&apos; 명시하면 클라이언트 컴포넌트</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <h4 className="font-semibold text-[var(--db-text)] mb-2">빌드</h4>
            <p className="text-xs text-[var(--db-muted)]">npm run build → 정적 파일 생성</p>
          </div>
        </div>
      </div>

      {/* 프로젝트 구조 */}
      <div className="db-card p-6">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-xs font-mono text-[var(--db-muted)]">04</span>
          <h3 className="text-lg font-semibold text-[var(--db-text)]">이 프로젝트 구조</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-[var(--db-brand)]">src/app/</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">페이지들 (page.tsx = 메인, dashboard/ = 대시보드)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-[var(--db-brand)]">src/components/</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">재사용 가능한 UI 조각들</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-[var(--db-brand)]">src/data/</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">테스트 데이터 (subjects/*.ts)</p>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <code className="text-[var(--db-brand)]">src/services/</code>
            <p className="text-xs text-[var(--db-muted)] mt-1">비즈니스 로직 (저장, 조회 등)</p>
          </div>
        </div>
      </div>
    </div>
  );
}
