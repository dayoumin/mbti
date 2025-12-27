'use client';

import { useState } from 'react';
import {
  Share2,
  RefreshCw,
  ChevronRight,
  Star,
  Heart,
  Settings,
  ThumbsUp,
  ThumbsDown,
} from 'lucide-react';

export default function AppDesignSystem() {
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedColor(name);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  // 중립적 컬러 시스템 - 60/30/10 법칙
  const colorSystem = {
    neutral: [
      { name: 'Background', value: '#F8FAFC', tailwind: 'slate-50' },
      { name: 'Surface', value: '#FFFFFF', tailwind: 'white' },
      { name: 'Border', value: '#E2E8F0', tailwind: 'slate-200' },
      { name: 'Muted', value: '#94A3B8', tailwind: 'slate-400' },
      { name: 'Text', value: '#1E293B', tailwind: 'slate-800' },
    ],
    primary: [
      { name: 'Primary', value: '#6366F1', tailwind: 'indigo-500', usage: 'CTA 버튼, 링크' },
    ],
    semantic: [
      { name: 'Success', value: '#10B981', tailwind: 'emerald-500', usage: '긍정' },
      { name: 'Error', value: '#EF4444', tailwind: 'red-500', usage: '부정' },
    ],
  };

  // 컴포넌트 카테고리별 분류
  const componentCategories = {
    core: {
      label: '핵심 UI',
      items: [
        { name: 'TestCard', file: 'TestCard.tsx', desc: '테스트 선택 카드' },
        { name: 'TraitBar', file: 'TraitBar.tsx', desc: '성향 비율 막대' },
        { name: 'ShareCard', file: 'ShareCard.tsx', desc: 'SNS 공유 카드' },
        { name: 'Toast', file: 'Toast.tsx', desc: '알림 토스트' },
      ],
    },
    layout: {
      label: '레이아웃',
      items: [
        { name: 'Dashboard', file: 'Dashboard.js', desc: '메인 홈' },
        { name: 'BottomNav', file: 'BottomNav.tsx', desc: '하단 네비게이션' },
        { name: 'Sidebar', file: 'Sidebar.tsx', desc: '사이드바 (데스크탑)' },
        { name: 'RightSidebar', file: 'RightSidebar.tsx', desc: '우측 사이드바' },
        { name: 'HeroBanner', file: 'HeroBanner.tsx', desc: '히어로 배너' },
      ],
    },
    content: {
      label: '콘텐츠',
      items: [
        { name: 'ContentExplore', file: 'ContentExplore.tsx', desc: '퀴즈/투표/팁 탐색' },
        { name: 'TodayRanking', file: 'TodayRanking.tsx', desc: '오늘의 랭킹' },
        { name: 'DailyContentCards', file: 'DailyContentCards.tsx', desc: '일일 콘텐츠' },
        { name: 'NextActionCard', file: 'NextActionCard.tsx', desc: '다음 행동 추천' },
      ],
    },
    community: {
      label: '커뮤니티',
      items: [
        { name: 'CommunityBoard', file: 'CommunityBoard.tsx', desc: '게시판' },
        { name: 'TalkPreview', file: 'TalkPreview.tsx', desc: '커뮤니티 미리보기' },
        { name: 'CommentSystem', file: 'CommentSystem.tsx', desc: '댓글 시스템' },
        { name: 'ParticipationStats', file: 'ParticipationStats.tsx', desc: '참여 통계' },
      ],
    },
    feedback: {
      label: '피드백/결과',
      items: [
        { name: 'ResultFeedback', file: 'ResultFeedback.tsx', desc: '피드백 버튼' },
        { name: 'FeedbackComments', file: 'FeedbackComments.tsx', desc: '피드백 댓글' },
        { name: 'ResultRankingView', file: 'ResultRankingView.tsx', desc: '결과 미리보기' },
        { name: 'MinorityVoteBadge', file: 'MinorityVoteBadge.tsx', desc: '소수파 뱃지' },
      ],
    },
    profile: {
      label: '프로필',
      items: [
        { name: 'MyProfile', file: 'MyProfile.tsx', desc: '프로필 페이지' },
        { name: 'BadgeNotification', file: 'BadgeNotification.tsx', desc: '배지 알림' },
      ],
    },
  };

  // 서비스 모듈
  const services = [
    { name: 'ResultService', desc: '결과 저장/조회', api: 'Supabase' },
    { name: 'RankingService', desc: '랭킹 투표/통계', api: 'Supabase' },
    { name: 'TursoService', desc: '피드백/퀴즈/투표', api: 'Turso' },
    { name: 'ParticipationBridge', desc: 'Turso+Gamification 통합', api: 'Turso+Local' },
    { name: 'GamificationService', desc: '배지/레벨/포인트', api: 'Local' },
    { name: 'NextActionService', desc: '다음 행동 추천', api: 'Local' },
    { name: 'AuthService', desc: '소셜 로그인', api: 'NextAuth' },
    { name: 'ProfileService', desc: '사용자 프로필', api: 'Supabase' },
    { name: 'ContentParticipationService', desc: '콘텐츠 참여 기록', api: 'Local' },
    { name: 'AnalyticsService', desc: '분석/추적', api: 'Vercel' },
  ];

  // 데이터 구조
  const dataStructures = [
    { name: 'QUIZ_REGISTRY', path: 'content/quizzes', desc: '퀴즈 자동 수집 (지식/시나리오)' },
    { name: 'POLL_REGISTRY', path: 'content/polls', desc: '투표 자동 수집' },
    { name: 'ContentCategory', path: 'content/types', desc: '15개 콘텐츠 카테고리' },
    { name: 'SUBJECT_CONFIG', path: 'config', desc: '테스트별 설정' },
  ];

  // 하위호환용 flat 배열
  const components = Object.values(componentCategories).flatMap(cat => cat.items);

  return (
    <div className="space-y-6">
      {/* 디자인 원칙 */}
      <div className="db-card p-5">
        <h3 className="text-sm font-semibold text-[var(--db-text)] mb-3">디자인 원칙</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg" style={{ background: 'var(--db-alpha-bg)' }}>
            <p className="text-2xl font-bold text-[var(--db-text)]">60%</p>
            <p className="text-xs text-[var(--db-muted)]">중립 (흰색/회색)</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ background: 'var(--db-alpha-bg)' }}>
            <p className="text-2xl font-bold text-[var(--db-text)]">30%</p>
            <p className="text-xs text-[var(--db-muted)]">보조 (텍스트/테두리)</p>
          </div>
          <div className="text-center p-4 rounded-lg" style={{ background: 'var(--db-alpha-bg)' }}>
            <p className="text-2xl font-bold text-[var(--db-brand)]">10%</p>
            <p className="text-xs text-[var(--db-muted)]">강조 (Primary)</p>
          </div>
        </div>
      </div>

      {/* 컬러 시스템 - 정리된 형태 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--db-text)]">컬러 시스템</h3>
        </div>
        <div className="p-5 space-y-5">
          {/* Neutral Colors */}
          <div>
            <p className="text-xs font-medium text-[var(--db-muted)] mb-2">NEUTRAL (60%)</p>
            <div className="flex gap-2">
              {colorSystem.neutral.map((color) => (
                <button
                  key={color.name}
                  onClick={() => copyToClipboard(color.tailwind, color.name)}
                  className="flex-1 group"
                >
                  <div
                    className="h-12 rounded-lg border border-slate-200 mb-1.5 transition-transform group-hover:scale-105"
                    style={{ background: color.value }}
                  />
                  <p className="text-xs text-[var(--db-muted)] text-center">
                    {copiedColor === color.name ? '복사됨!' : color.name}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Primary + Semantic */}
          <div className="flex gap-6">
            <div className="flex-1">
              <p className="text-xs font-medium text-[var(--db-muted)] mb-2">PRIMARY (10%)</p>
              <div className="flex gap-2">
                {colorSystem.primary.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => copyToClipboard(color.tailwind, color.name)}
                    className="flex-1 group"
                  >
                    <div
                      className="h-12 rounded-lg mb-1.5 transition-transform group-hover:scale-105"
                      style={{ background: color.value }}
                    />
                    <p className="text-xs text-[var(--db-muted)] text-center">
                      {copiedColor === color.name ? '복사됨!' : color.usage}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-[var(--db-muted)] mb-2">SEMANTIC</p>
              <div className="flex gap-2">
                {colorSystem.semantic.map((color) => (
                  <button
                    key={color.name}
                    onClick={() => copyToClipboard(color.tailwind, color.name)}
                    className="flex-1 group"
                  >
                    <div
                      className="h-12 rounded-lg mb-1.5 transition-transform group-hover:scale-105"
                      style={{ background: color.value }}
                    />
                    <p className="text-xs text-[var(--db-muted)] text-center">
                      {copiedColor === color.name ? '복사됨!' : color.usage}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 컴포넌트 미리보기 - 최소화 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--db-text)]">UI 미리보기</h3>
        </div>
        <div className="p-5" style={{ background: '#F8FAFC' }}>
          <div className="grid grid-cols-2 gap-4">
            {/* 카드 */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-lg">🧠</div>
                <div>
                  <p className="text-sm font-bold text-slate-800">성격 유형</p>
                  <p className="text-xs text-slate-500">12문항</p>
                </div>
              </div>
              <div className="text-xs text-indigo-500 font-medium">시작하기 →</div>
            </div>

            {/* 버튼들 */}
            <div className="space-y-2">
              <button className="w-full py-2.5 rounded-lg bg-indigo-500 text-white text-sm font-medium">
                Primary 버튼
              </button>
              <button className="w-full py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-slate-700 text-sm font-medium">
                Secondary 버튼
              </button>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-slate-50 border border-slate-200 text-emerald-600 text-xs font-medium flex items-center justify-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> 맞아요
                </button>
                <button className="flex-1 py-2 rounded-lg bg-slate-50 border border-slate-200 text-red-500 text-xs font-medium flex items-center justify-center gap-1">
                  <ThumbsDown className="w-3 h-3" /> 아니에요
                </button>
              </div>
            </div>
          </div>

          {/* TraitBar */}
          <div className="mt-4 bg-slate-50 rounded-lg border border-slate-200 p-3">
            <p className="text-xs font-medium text-slate-500 mb-2">TraitBar</p>
            <div className="flex justify-between text-xs text-slate-500 mb-1">
              <span>내향 72%</span>
              <span>외향 28%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
              <div className="bg-indigo-500 h-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 컴포넌트 목록 - 카테고리별 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--db-text)]">컴포넌트 ({components.length}개)</h3>
          <p className="text-xs text-[var(--db-muted)] mt-0.5">src/components/</p>
        </div>
        <div className="p-5 space-y-4">
          {Object.entries(componentCategories).map(([key, category]) => (
            <div key={key}>
              <p className="text-xs font-medium text-[var(--db-muted)] mb-2">{category.label}</p>
              <div className="grid grid-cols-2 gap-2">
                {category.items.map((comp) => (
                  <div key={comp.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-[var(--db-alpha-hover)] transition-colors">
                    <div className="flex items-center gap-2">
                      <code className="text-xs font-medium text-[var(--db-text)]">{comp.name}</code>
                    </div>
                    <span className="text-xs text-[var(--db-muted)]">{comp.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 서비스 모듈 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--db-text)]">서비스 모듈 ({services.length}개)</h3>
          <p className="text-xs text-[var(--db-muted)] mt-0.5">src/services/</p>
        </div>
        <div className="divide-y divide-[var(--db-line)]">
          {services.map((svc) => (
            <div key={svc.name} className="px-5 py-2.5 flex items-center justify-between hover:bg-[var(--db-alpha-hover)] transition-colors">
              <div className="flex items-center gap-3">
                <code className="text-xs font-medium text-[var(--db-text)]">{svc.name}</code>
                <span className="text-xs text-[var(--db-muted)]">{svc.desc}</span>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${svc.api === 'Supabase' ? 'bg-emerald-500/10 text-emerald-400' :
                  svc.api === 'Local' ? 'bg-slate-500/10 text-slate-400' :
                    'bg-blue-500/10 text-blue-400'
                }`}>{svc.api}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 데이터 구조 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--db-text)]">데이터 구조</h3>
          <p className="text-xs text-[var(--db-muted)] mt-0.5">src/data/</p>
        </div>
        <div className="divide-y divide-[var(--db-line)]">
          {dataStructures.map((ds) => (
            <div key={ds.name} className="px-5 py-2.5 flex items-center justify-between hover:bg-[var(--db-alpha-hover)] transition-colors">
              <div className="flex items-center gap-3">
                <code className="text-xs font-medium text-[var(--db-brand)]">{ds.name}</code>
                <span className="text-xs text-[var(--db-muted)]">{ds.desc}</span>
              </div>
              <code className="text-xs text-[var(--db-muted)]">{ds.path}</code>
            </div>
          ))}
        </div>
      </div>

      {/* 유틸리티 - 단순 리스트 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card p-4">
          <h4 className="text-xs font-semibold text-[var(--db-text)] mb-3">애니메이션</h4>
          <div className="space-y-1">
            {['fade-in', 'slide-up', 'pop', 'shake'].map((a) => (
              <code key={a} className="block text-xs text-[var(--db-muted)]">.animate-{a}</code>
            ))}
          </div>
        </div>
        <div className="db-card p-4">
          <h4 className="text-xs font-semibold text-[var(--db-text)] mb-3">유틸리티</h4>
          <div className="space-y-1">
            {['.glass-card', '.glass-button', '.no-scrollbar', '.progress-bar-fill'].map((u) => (
              <code key={u} className="block text-xs text-[var(--db-muted)]">{u}</code>
            ))}
          </div>
        </div>
      </div>

      {/* 아이콘 - 간단하게 */}
      <div className="db-card p-5">
        <h4 className="text-xs font-semibold text-[var(--db-text)] mb-3">아이콘</h4>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <code className="text-xs text-[var(--db-muted)]">lucide-react</code>
            <div className="flex gap-1">
              {[Share2, RefreshCw, ChevronRight, Star, Heart, Settings].map((Icon, i) => (
                <Icon key={i} className="w-4 h-4 text-[var(--db-muted)]" />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <code className="text-xs text-[var(--db-muted)]">Icons.js</code>
            <div className="flex gap-1 text-sm">
              {['🧠', '🐱', '🐕', '🌱', '☕'].map((e, i) => (
                <span key={i}>{e}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
