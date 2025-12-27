/**
 * GA4 모니터링 대시보드
 *
 * Google Analytics 4 설정 및 이벤트 현황 확인
 */

import { BarChart3, TrendingUp, Zap, DollarSign, ExternalLink, CheckCircle2, Clock } from 'lucide-react';

export default function GA4Monitor() {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--db-text)] mb-2">GA4 모니터링</h2>
        <p className="text-[var(--db-muted)]">
          Google Analytics 4 이벤트 추적 및 성능 측정 현황
        </p>
      </div>

      {/* 상태 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="db-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle2 className="w-5 h-5 text-green-500" />
            <h3 className="font-semibold text-[var(--db-text)]">구현 완료</h3>
          </div>
          <p className="text-2xl font-bold text-[var(--db-text)]">13개</p>
          <p className="text-sm text-[var(--db-muted)]">이벤트 추적 중</p>
        </div>

        <div className="db-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-[var(--db-text)]">비용</h3>
          </div>
          <p className="text-2xl font-bold text-green-600">$0/월</p>
          <p className="text-sm text-[var(--db-muted)]">완전 무료 (무제한)</p>
        </div>

        <div className="db-card p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-5 h-5 text-purple-500" />
            <h3 className="font-semibold text-[var(--db-text)]">데이터 보관</h3>
          </div>
          <p className="text-2xl font-bold text-[var(--db-text)]">14개월</p>
          <p className="text-sm text-[var(--db-muted)]">무료 (최대 50개월)</p>
        </div>
      </div>

      {/* 비즈니스 이벤트 */}
      <section className="db-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Zap className="w-5 h-5 text-[var(--db-accent)]" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">비즈니스 이벤트 (8개)</h3>
        </div>

        <div className="space-y-3">
          {[
            {
              name: 'test_start',
              desc: '테스트 시작',
              label: 'testType (예: dog, cat)',
              code: "trackTestStart('dog')",
            },
            {
              name: 'test_complete',
              desc: '테스트 완료',
              label: 'testType + 소요 시간(초)',
              code: "trackTestComplete('dog', 45000)",
            },
            {
              name: 'share',
              desc: '공유 버튼 클릭',
              label: 'platform_testType (예: kakao_dog)',
              code: "trackShare('kakao', 'dog')",
            },
            {
              name: 'quiz_answer',
              desc: '퀴즈 응답',
              label: 'quizId, value: 1(정답) or 0(오답)',
              code: "trackQuizAnswer('dog_001', true)",
            },
            {
              name: 'poll_vote',
              desc: '투표 참여',
              label: 'pollId_option',
              code: "trackPollVote('poll_001', 'A')",
            },
            {
              name: 'situation_reaction',
              desc: '상황 반응 참여',
              label: 'reactionId',
              code: "trackReaction('awkward_001', '웃음')",
            },
            {
              name: 'ranking_vote',
              desc: '랭킹 투표',
              label: 'testType_resultKey',
              code: "trackRankingVote('dog', 'retriever')",
            },
            {
              name: 'page_dwell',
              desc: '페이지 체류 시간',
              label: 'pageName + 체류 시간(초)',
              code: "trackPageDwell('result', 30000)",
            },
          ].map((event) => (
            <div key={event.name} className="border-l-4 border-[var(--db-accent)] pl-4 py-2">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <code className="text-sm font-mono text-[var(--db-accent)]">{event.name}</code>
                  <p className="text-sm text-[var(--db-text)] mt-1">{event.desc}</p>
                  <p className="text-xs text-[var(--db-muted)] mt-1">Label: {event.label}</p>
                </div>
                <code className="text-xs bg-[var(--db-hover)] px-2 py-1 rounded text-[var(--db-muted)] whitespace-nowrap">
                  {event.code}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 성능 메트릭 */}
      <section className="db-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-[var(--db-accent)]" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">Web Vitals 성능 메트릭 (5개)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              metric: 'LCP',
              name: 'Largest Contentful Paint',
              target: '< 2.5초',
              desc: '가장 큰 콘텐츠가 렌더링되는 시간',
              color: 'blue',
            },
            {
              metric: 'INP',
              name: 'Interaction to Next Paint',
              target: '< 200ms',
              desc: '사용자 상호작용에 대한 페이지 반응성 (FID 대체)',
              color: 'green',
            },
            {
              metric: 'CLS',
              name: 'Cumulative Layout Shift',
              target: '< 0.1',
              desc: '페이지 수명 동안 발생하는 레이아웃 이동',
              color: 'purple',
            },
            {
              metric: 'FCP',
              name: 'First Contentful Paint',
              target: '< 1.8초',
              desc: '첫 번째 콘텐츠가 렌더링되는 시간',
              color: 'orange',
            },
            {
              metric: 'TTFB',
              name: 'Time to First Byte',
              target: '< 600ms',
              desc: '서버 응답 시간',
              color: 'pink',
            },
          ].map((metric) => (
            <div key={metric.metric} className="db-card p-4 border-l-4" style={{ borderColor: `var(--db-${metric.color})` }}>
              <div className="flex items-center justify-between mb-2">
                <code className="text-lg font-mono font-bold text-[var(--db-text)]">{metric.metric}</code>
                <span className="text-sm font-semibold text-green-600">{metric.target}</span>
              </div>
              <p className="text-sm font-medium text-[var(--db-text)] mb-1">{metric.name}</p>
              <p className="text-xs text-[var(--db-muted)]">{metric.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* KPI 목표 */}
      <section className="db-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-[var(--db-accent)]" />
          <h3 className="text-lg font-semibold text-[var(--db-text)]">주요 지표 (KPI)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: '테스트 완료율',
              formula: 'test_complete / test_start',
              target: '70%',
              desc: '시작한 테스트 중 완료한 비율',
            },
            {
              name: '공유율',
              formula: 'share / test_complete',
              target: '30%',
              desc: '테스트 완료 후 공유한 비율',
            },
            {
              name: '퀴즈 정답률',
              formula: 'quiz_answer(value=1) / quiz_answer',
              target: '60%',
              desc: '퀴즈 정답 비율',
            },
            {
              name: '콘텐츠 참여율',
              formula: '(quiz + poll + reaction) / DAU',
              target: '40%',
              desc: '일별 활성 사용자 중 콘텐츠 참여 비율',
            },
          ].map((kpi) => (
            <div key={kpi.name} className="db-card p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-[var(--db-text)]">{kpi.name}</h4>
                <span className="text-sm font-bold text-[var(--db-accent)]">목표: {kpi.target}</span>
              </div>
              <code className="text-xs bg-[var(--db-hover)] px-2 py-1 rounded block mb-2 text-[var(--db-muted)]">
                {kpi.formula}
              </code>
              <p className="text-xs text-[var(--db-muted)]">{kpi.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 빠른 링크 */}
      <section className="db-card p-6">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">빠른 링크</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <a
            href="https://analytics.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[var(--db-hover)] rounded-lg hover:bg-[var(--db-accent)] hover:text-white transition-colors group"
          >
            <ExternalLink className="w-5 h-5" />
            <div>
              <p className="font-semibold">GA4 대시보드</p>
              <p className="text-sm opacity-80">실시간 리포트 확인</p>
            </div>
          </a>

          <a
            href="/dashboard"
            onClick={(e) => {
              e.preventDefault();
              const element = document.querySelector('[data-file="GA4_SETUP_GUIDE"]');
              if (element) element.scrollIntoView({ behavior: 'smooth' });
            }}
            className="flex items-center gap-3 p-4 bg-[var(--db-hover)] rounded-lg hover:bg-[var(--db-accent)] hover:text-white transition-colors group"
          >
            <ExternalLink className="w-5 h-5" />
            <div>
              <p className="font-semibold">설정 가이드</p>
              <p className="text-sm opacity-80">GA4 초기 설정 방법</p>
            </div>
          </a>

          <a
            href="https://web.dev/vitals/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[var(--db-hover)] rounded-lg hover:bg-[var(--db-accent)] hover:text-white transition-colors group"
          >
            <ExternalLink className="w-5 h-5" />
            <div>
              <p className="font-semibold">Web Vitals 가이드</p>
              <p className="text-sm opacity-80">성능 메트릭 설명</p>
            </div>
          </a>

          <a
            href="https://github.com/GoogleChrome/web-vitals"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 p-4 bg-[var(--db-hover)] rounded-lg hover:bg-[var(--db-accent)] hover:text-white transition-colors group"
          >
            <ExternalLink className="w-5 h-5" />
            <div>
              <p className="font-semibold">web-vitals 패키지</p>
              <p className="text-sm opacity-80">NPM 패키지 문서</p>
            </div>
          </a>
        </div>
      </section>

      {/* 구현 파일 */}
      <section className="db-card p-6">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">구현 파일</h3>

        <div className="space-y-2">
          {[
            { file: 'src/lib/gtag.ts', desc: 'GA4 설정 및 이벤트 함수' },
            { file: 'src/lib/analytics.ts', desc: '8개 비즈니스 이벤트 추적 함수' },
            { file: 'src/lib/web-vitals.ts', desc: 'Web Vitals 측정 및 GA4 전송' },
            { file: 'src/components/WebVitalsReporter.tsx', desc: 'Web Vitals 측정 컴포넌트' },
            { file: 'src/app/layout.tsx', desc: 'GA4 스크립트 + Web Vitals 통합' },
            { file: 'docs/planning/GA4_SETUP_GUIDE.md', desc: '상세 설정 가이드' },
          ].map((item) => (
            <div key={item.file} className="flex items-start gap-3 p-3 bg-[var(--db-hover)] rounded">
              <code className="text-sm text-[var(--db-accent)] font-mono flex-1">{item.file}</code>
              <span className="text-xs text-[var(--db-muted)]">{item.desc}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 다음 단계 */}
      <section className="db-card p-6 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">다음 단계 (Phase 1-2)</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-[var(--db-text)] mb-2">Phase 1: 1개월 후 (사용자 1,000명+)</h4>
            <ul className="text-sm text-[var(--db-muted)] space-y-1 ml-4">
              <li>• 전환 이벤트 설정 (test_complete)</li>
              <li>• 맞춤 측정기준 추가 (연령대, 테스트 유형)</li>
              <li>• 리마케팅 타겟 생성</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-[var(--db-text)] mb-2">Phase 2: 3개월 후 (사용자 5,000명+)</h4>
            <ul className="text-sm text-[var(--db-muted)] space-y-1 ml-4">
              <li>• GA4 + BigQuery 연동 (무료, 월 10GB까지)</li>
              <li>• SQL 복잡한 쿼리 + 머신러닝 분석</li>
              <li>• A/B 테스트 (결과 페이지 레이아웃, CTA 문구)</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
