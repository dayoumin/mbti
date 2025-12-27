'use client';

import { CheckCircle2 } from 'lucide-react';

export default function Roadmap() {
  const roadmapItems = [
    {
      phase: 'Phase 1',
      title: '바이럴 루프',
      items: ['SNS 공유 카드 ✓', '피드백 수집 ✓', '카카오톡 공유', '리퍼럴 추적'],
      done: false,
      current: true,
      color: '#7aa2ff'
    },
    {
      phase: 'Phase 2',
      title: '친구 비교/궁합',
      items: ['링크 기반 비교', '궁합 점수', '관계 타입별 해석'],
      done: false,
      current: false,
      color: '#ff6b9d'
    },
    {
      phase: 'Phase 3',
      title: '게이미피케이션',
      items: [
        '데일리 콘텐츠',
        '일일 미션 (이벤트성)',
        '연속 참여 스트릭',
        '뱃지/레벨 시스템',
        '토너먼트/대결'
      ],
      done: false,
      current: false,
      color: '#55e6c1',
      note: '⚠️ 콘텐츠가 충분히 쌓인 후 이벤트성으로 도입 검토. 상시 기능보다 특별 이벤트로 활용 권장.'
    },
    {
      phase: 'Phase 4',
      title: '커뮤니티',
      items: ['전체 라운지', '유형 필터', '모더레이션'],
      done: false,
      current: false,
      color: '#ffd166'
    },
  ];

  return (
    <div className="space-y-6">
      {/* 핵심 원칙 */}
      <div className="db-card p-5">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">핵심 전략</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.08)' }}>
            <span className="text-2xl mb-2 block">🔄</span>
            <h4 className="font-semibold text-[var(--db-text)]">바이럴 루프 우선</h4>
            <p className="text-sm text-[var(--db-muted)]">공유 → 유입 → 테스트 → 비교 → 재공유</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.08)' }}>
            <span className="text-2xl mb-2 block">⚡</span>
            <h4 className="font-semibold text-[var(--db-text)]">마찰 최소화</h4>
            <p className="text-sm text-[var(--db-muted)]">로그인 없이 비교까지 완료</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.08)' }}>
            <span className="text-2xl mb-2 block">📅</span>
            <h4 className="font-semibold text-[var(--db-text)]">매일 올 이유</h4>
            <p className="text-sm text-[var(--db-muted)]">스트릭 전에 데일리 콘텐츠 먼저</p>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.08)' }}>
            <span className="text-2xl mb-2 block">🏠</span>
            <h4 className="font-semibold text-[var(--db-text)]">커뮤니티는 마지막</h4>
            <p className="text-sm text-[var(--db-muted)]">가장 비싸고 위험한 기능</p>
          </div>
        </div>
      </div>

      {/* 타임라인 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">커뮤니티 로드맵</h3>
          <p className="text-sm text-[var(--db-muted)]">상세: 기획 → 제품 기능 탭</p>
        </div>
        <div className="p-5 relative">
          <div className="absolute left-9 top-5 bottom-5 w-0.5" style={{ background: 'var(--db-line)' }} />
          <div className="space-y-8">
            {roadmapItems.map((item) => (
              <div key={item.phase} className="relative pl-12">
                <div
                  className="absolute left-6 w-5 h-5 rounded-full border-2 flex items-center justify-center"
                  style={{
                    background: item.current ? item.color : item.done ? 'var(--db-ok)' : 'var(--db-panel)',
                    borderColor: item.current ? item.color : item.done ? 'var(--db-ok)' : 'var(--db-line)'
                  }}
                >
                  {item.done && <CheckCircle2 className="w-4 h-4 text-[#081023] absolute -top-0.5 -left-0.5" />}
                  {item.current && <div className="w-2 h-2 rounded-full bg-slate-50" />}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-[var(--db-text)]">{item.phase}: {item.title}</h4>
                    {item.current && (
                      <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: `${item.color}22`, color: item.color }}>
                        현재
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {item.items.map((i) => (
                      <span
                        key={i}
                        className="px-3 py-1.5 rounded-lg text-sm"
                        style={{
                          background: item.current ? `${item.color}15` : item.done ? 'rgba(124,255,138,0.1)' : 'rgba(255,255,255,0.03)',
                          color: item.current ? item.color : item.done ? 'var(--db-ok)' : 'var(--db-muted)',
                          border: `1px solid ${item.current ? `${item.color}30` : 'rgba(255,255,255,0.1)'}`
                        }}
                      >
                        {i}
                      </span>
                    ))}
                  </div>
                  {item.note && (
                    <p className="mt-3 text-sm text-[var(--db-muted)] italic">{item.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI 시대 포지셔닝 */}
      <div className="db-card p-5">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">AI 시대 생존 전략</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
            <h4 className="font-semibold text-[var(--db-danger)] mb-2">AI가 잘하는 것</h4>
            <ul className="text-sm text-[var(--db-muted)] space-y-1">
              <li>• 정보 제공 (유형 특징 설명)</li>
              <li>• 즉석 대화형 분석</li>
              <li>• 일반적인 조언</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(124,255,138,0.08)', border: '1px solid rgba(124,255,138,0.2)' }}>
            <h4 className="font-semibold text-[var(--db-ok)] mb-2">우리가 이기는 것</h4>
            <ul className="text-sm text-[var(--db-muted)] space-y-1">
              <li>• 결과 축적 & 시간별 비교</li>
              <li>• 친구와 궁합/비교</li>
              <li>• 커뮤니티 검증 & 집단 지성</li>
              <li>• 재방문 루프 (스트릭, 랭킹)</li>
            </ul>
          </div>
        </div>
        <div className="mt-4 p-3 rounded-lg" style={{ background: 'rgba(122,162,255,0.08)' }}>
          <p className="text-sm text-[var(--db-text)]">
            <strong>결론:</strong> &quot;정보 제공&quot;은 AI가 이김. <strong>&quot;경험 + 축적 + 소셜&quot;</strong>은 앱이 이김.
          </p>
        </div>
      </div>
    </div>
  );
}
