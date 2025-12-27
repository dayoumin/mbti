'use client';

function ArchiveItem({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <code className="text-sm text-[var(--db-brand)]">{name}</code>
      <p className="text-xs text-[var(--db-muted)] mt-1">{desc}</p>
    </div>
  );
}

export default function ArchiveSection() {
  return (
    <div className="space-y-6">
      <div className="db-callout" style={{ borderColor: 'rgba(255,209,102,0.35)' }}>
        <p className="text-sm text-[var(--db-text)]">
          <strong className="text-[var(--db-warning)]">아카이브:</strong> 현재 사이드바에서 제외된 컴포넌트들입니다. 코드는 그대로 유지되어 필요시 재활용 가능합니다.
        </p>
      </div>

      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">미사용 컴포넌트 목록</h3>
        </div>
        <div className="p-5 grid grid-cols-2 gap-4">
          <ArchiveItem name="VisionMoat" desc="비전/해자 전략 - 로드맵에 통합됨" />
          <ArchiveItem name="ExpansionPlan" desc="확장 계획 - 로드맵에 통합됨" />
          <ArchiveItem name="Monetization" desc="수익화 전략" />
          <ArchiveItem name="AIDefense" desc="AI 시대 대응 - 로드맵에 통합됨" />
          <ArchiveItem name="UXFlow" desc="UX 흐름 다이어그램" />
          <ArchiveItem name="Development" desc="개발 가이드 (레거시)" />
          <ArchiveItem name="LegacyUI" desc="레거시 UI 참고" />
          <ArchiveItem name="FeedbackAnalysis" desc="피드백 분석 (데이터 축적 중)" />
        </div>
      </div>
    </div>
  );
}
