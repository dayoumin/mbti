'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

interface TroubleshootingIssue {
  id: string;
  date: string;
  title: string;
  symptoms: string[];
  cause: string;
  solution: string;
  files?: string[];
  tags: string[];
}

const TROUBLESHOOTING_ISSUES: TroubleshootingIssue[] = [
  {
    id: 'turbopack-env-2024-12',
    date: '2024-12',
    title: 'Turbopack에서 NEXT_PUBLIC_* 환경변수 빈 문자열 문제',
    symptoms: [
      'Supabase 서비스에서 연결 실패 (레거시 이슈)',
      '브라우저 콘솔에서 process.env.NEXT_PUBLIC_* 값이 빈 문자열',
      '서버 측에서는 .env.local 인식하지만 클라이언트 번들에서 값이 ""',
    ],
    cause: 'Next.js 16 + Turbopack(dev)에서 .env.local의 NEXT_PUBLIC_* 값이 클라이언트 번들 생성 시 컴파일 타임에 빈 문자열로 상수 폴딩됨. Turbopack이 "공개 env"를 자동 주입하지 못하는 버그/불안정.',
    solution: 'next.config.ts에 env 블록을 추가해 명시적으로 환경변수를 매핑:\n\nenv: {\n  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",\n  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",\n  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "",\n}',
    files: ['next.config.ts'],
    tags: ['Turbopack', 'env', 'Next.js 16', 'Supabase'],
  },
];

export default function Troubleshooting() {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="db-card p-6">
        <h2 className="text-xl font-bold text-[var(--db-text)] mb-2">🔧 트러블슈팅 기록</h2>
        <p className="text-[var(--db-muted)]">
          개발 중 만난 이슈와 해결 방법을 기록합니다. 같은 문제 재발 시 참고용.
        </p>
      </div>

      {/* 이슈 목록 */}
      <div className="space-y-4">
        {TROUBLESHOOTING_ISSUES.map((issue) => (
          <div key={issue.id} className="db-card overflow-hidden">
            {/* 헤더 (클릭 가능) */}
            <button
              onClick={() => setExpandedId(expandedId === issue.id ? null : issue.id)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-[var(--db-card-hover)] transition-colors"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">🐛</span>
                <div className="text-left">
                  <h3 className="font-semibold text-[var(--db-text)]">{issue.title}</h3>
                  <p className="text-sm text-[var(--db-muted)]">{issue.date}</p>
                </div>
              </div>
              <ChevronRight
                className={`w-5 h-5 text-[var(--db-muted)] transition-transform ${expandedId === issue.id ? 'rotate-90' : ''
                  }`}
              />
            </button>

            {/* 상세 내용 */}
            {expandedId === issue.id && (
              <div className="px-6 pb-6 space-y-4 border-t border-[var(--db-border)]">
                {/* 태그 */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {issue.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs rounded-full bg-[var(--db-brand)]/20 text-[var(--db-brand)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* 증상 */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--db-text)] mb-2">📋 증상</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-[var(--db-muted)]">
                    {issue.symptoms.map((s, i) => (
                      <li key={i}>{s}</li>
                    ))}
                  </ul>
                </div>

                {/* 원인 */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--db-text)] mb-2">🔍 원인</h4>
                  <p className="text-sm text-[var(--db-muted)]">{issue.cause}</p>
                </div>

                {/* 해결 */}
                <div>
                  <h4 className="text-sm font-semibold text-[var(--db-text)] mb-2">✅ 해결</h4>
                  <pre className="text-sm text-[var(--db-muted)] bg-black/30 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                    {issue.solution}
                  </pre>
                </div>

                {/* 수정 파일 */}
                {issue.files && (
                  <div>
                    <h4 className="text-sm font-semibold text-[var(--db-text)] mb-2">📁 수정 파일</h4>
                    <div className="flex flex-wrap gap-2">
                      {issue.files.map((file) => (
                        <code
                          key={file}
                          className="px-2 py-1 text-xs rounded bg-black/30 text-[var(--db-brand)]"
                        >
                          {file}
                        </code>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 대안/팁 */}
      <div className="db-card p-6">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">💡 개발 환경 팁</h3>
        <div className="space-y-3 text-sm text-[var(--db-muted)]">
          <div className="flex items-start gap-3">
            <span className="text-[var(--db-brand)]">•</span>
            <p>
              <strong className="text-[var(--db-text)]">Turbopack 불안정 시:</strong>{' '}
              <code className="px-1 py-0.5 rounded bg-black/30">next dev --no-turbo</code>로 Webpack 사용
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[var(--db-brand)]">•</span>
            <p>
              <strong className="text-[var(--db-text)]">환경변수 확인:</strong>{' '}
              브라우저 콘솔에서 <code className="px-1 py-0.5 rounded bg-black/30">process.env.NEXT_PUBLIC_*</code> 출력해보기
            </p>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-[var(--db-brand)]">•</span>
            <p>
              <strong className="text-[var(--db-text)]">Lock 파일 에러:</strong>{' '}
              <code className="px-1 py-0.5 rounded bg-black/30">.next/dev/lock</code> 삭제 후 재시작
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
