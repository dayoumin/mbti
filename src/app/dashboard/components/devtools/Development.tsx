'use client';

export default function Development() {
  return (
    <div className="space-y-6">
      {/* 코딩 규칙 & 테스트 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>📐</span> 코딩 규칙
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li>컴포넌트: <code className="text-[var(--db-brand)]">{`'use client'`}</code> 명시, Props 인터페이스 정의</li>
            <li>네이밍: camelCase(TS) / snake_case(DB)</li>
            <li>타입: SubjectKey 유니온 타입으로 테스트 종류 관리</li>
            <li>비동기: useEffect 내 async 함수, cancelled 플래그로 cleanup</li>
          </ul>
        </div>
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>🧪</span> 테스트 스크립트
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li><code className="text-[var(--db-brand)]">node scripts/validate-test-data.mjs</code></li>
            <li><code className="text-[var(--db-brand)]">node scripts/compare-data-sync.mjs</code></li>
            <li><code className="text-[var(--db-brand)]">node scripts/test-matching-logic.mjs</code></li>
            <li><code className="text-[var(--db-brand)]">node scripts/check-similarity.mjs</code></li>
          </ul>
        </div>
      </div>

      {/* 환경 설정 & 의존성 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>⚙️</span> 환경 설정
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li><strong className="text-[var(--db-text)]">Next.js 16</strong> + TypeScript + Tailwind</li>
            <li>스타일: Tailwind 유틸리티 + globals.css 커스텀</li>
            <li>빌드: <code className="text-[var(--db-brand)]">npm run build</code> → 정적 배포 가능</li>
            <li>데이터: localStorage 저장, 추후 Supabase 연동</li>
          </ul>
        </div>
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>📦</span> 의존성
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li>React 19, Next.js 16</li>
            <li>TailwindCSS 4</li>
            <li>Lucide React (아이콘)</li>
            <li>TypeScript 5</li>
          </ul>
        </div>
      </div>

      {/* 주요 문서 링크 */}
      <div className="db-card p-5">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
          <span>📚</span> 문서 링크
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <a href="/docs/planning/QUESTION_BANK.md" className="db-callout hover:border-[var(--db-brand)] transition-colors">
            <span className="text-[var(--db-brand)]">📋</span>
            <span className="ml-2 text-[var(--db-text)]">QUESTION_BANK</span>
            <span className="text-xs text-[var(--db-muted)] ml-2">문제은행, 랜덤 출제 규칙</span>
          </a>
          <a href="/docs/design/DESIGN_SYSTEM.md" className="db-callout hover:border-[var(--db-brand)] transition-colors">
            <span className="text-[var(--db-brand)]">🎨</span>
            <span className="ml-2 text-[var(--db-text)]">DESIGN_SYSTEM</span>
            <span className="text-xs text-[var(--db-muted)] ml-2">UI/로직/스타일 규칙</span>
          </a>
          <a href="/docs/planning/QUESTION_DESIGN.md" className="db-callout hover:border-[var(--db-brand)] transition-colors">
            <span className="text-[var(--db-brand)]">✏️</span>
            <span className="ml-2 text-[var(--db-text)]">QUESTION_DESIGN</span>
            <span className="text-xs text-[var(--db-muted)] ml-2">질문 작성 원칙</span>
          </a>
          <a href="/docs/planning/EXTENSION_ARCHITECTURE.md" className="db-callout hover:border-[var(--db-brand)] transition-colors">
            <span className="text-[var(--db-brand)]">🏗️</span>
            <span className="ml-2 text-[var(--db-text)]">EXTENSION_ARCHITECTURE</span>
            <span className="text-xs text-[var(--db-muted)] ml-2">확장 아키텍처</span>
          </a>
        </div>
      </div>

      {/* 경고 */}
      <div className="db-card p-5" style={{ borderColor: 'rgba(255,107,107,0.3)', borderWidth: '2px' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">⚠️</span>
          <div>
            <h4 className="font-bold text-[var(--db-danger)]">데이터 직접 수정 주의</h4>
            <p className="text-sm text-[var(--db-muted)] mt-1">
              src/data/subjects/*.ts 파일 수정 후 반드시 <code className="text-[var(--db-brand)]">npm run build</code>로 검증하세요.
              인코딩/타입 오류 방지를 위해 검증 스크립트 사용을 권장합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
