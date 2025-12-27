'use client';

import { useState } from 'react';
import {
  CheckCircle2, XCircle, AlertTriangle, Clock,
  PlayCircle, Package, Code, Monitor, Smartphone,
  Database, Shield, Zap, FileSearch, GitBranch,
  Users, TrendingUp, Bug, TestTube2
} from 'lucide-react';

// ============================================================================
// 타입 정의
// ============================================================================

type CheckStatus = 'pending' | 'pass' | 'fail' | 'warning';

interface CheckItem {
  id: string;
  category: string;
  name: string;
  description: string;
  status: CheckStatus;
  automated?: boolean;
  command?: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
}

// ============================================================================
// 배포 전 체크리스트 데이터
// ============================================================================

const DEPLOYMENT_CHECKS: CheckItem[] = [
  // 빌드 & 컴파일
  {
    id: 'build-success',
    category: '빌드',
    name: 'TypeScript 빌드 성공',
    description: 'npm run build 에러 없이 완료',
    status: 'pending',
    automated: true,
    command: 'npm run build',
    priority: 'critical',
  },
  {
    id: 'no-type-errors',
    category: '빌드',
    name: 'TypeScript 타입 에러 0개',
    description: '타입 체크 통과',
    status: 'pending',
    automated: true,
    command: 'npx tsc --noEmit',
    priority: 'critical',
  },
  {
    id: 'lint-check',
    category: '빌드',
    name: 'ESLint 경고 0개',
    description: '린트 검사 통과',
    status: 'pending',
    automated: true,
    command: 'npm run lint',
    priority: 'high',
  },

  // 콘텐츠 검증
  {
    id: 'content-validation',
    category: '콘텐츠',
    name: '콘텐츠 파일 검증 통과',
    description: '439개 퀴즈/투표 검증 (에러 0, 경고 0)',
    status: 'pending',
    automated: true,
    command: 'npm run validate:content',
    priority: 'critical',
  },
  {
    id: 'test-data-validation',
    category: '콘텐츠',
    name: '테스트 데이터 검증',
    description: '모든 테스트 데이터 무결성 확인',
    status: 'pending',
    automated: true,
    command: 'node scripts/validate-test-data.mjs all',
    priority: 'critical',
  },

  // 테스트
  {
    id: 'unit-tests',
    category: '테스트',
    name: '단위 테스트 통과',
    description: '핵심 로직 테스트 (10-20개)',
    status: 'pending',
    automated: true,
    command: 'npm test -- --project=unit',
    priority: 'high',
  },
  {
    id: 'e2e-smoke',
    category: '테스트',
    name: '스모크 테스트 통과',
    description: '모든 페이지 로드 확인',
    status: 'pending',
    automated: true,
    command: 'npx playwright test smoke.test.ts',
    priority: 'critical',
  },
  {
    id: 'e2e-critical',
    category: '테스트',
    name: '크리티컬 패스 E2E',
    description: '테스트 시작→결과→공유 플로우',
    status: 'pending',
    automated: true,
    command: 'npx playwright test critical-path.test.ts',
    priority: 'critical',
  },
  {
    id: 'responsive-test',
    category: '테스트',
    name: '반응형 레이아웃 테스트',
    description: '모바일/태블릿/데스크톱 일관성',
    status: 'pending',
    automated: true,
    command: 'npx playwright test responsive-layout.test.ts',
    priority: 'high',
  },

  // 반응형 & UI
  {
    id: 'mobile-ui',
    category: 'UI/UX',
    name: '모바일 UI 점검',
    description: 'iPhone SE, iPhone 14에서 확인',
    status: 'pending',
    automated: false,
    priority: 'critical',
  },
  {
    id: 'tablet-ui',
    category: 'UI/UX',
    name: '태블릿 UI 점검',
    description: 'iPad에서 확인',
    status: 'pending',
    automated: false,
    priority: 'high',
  },
  {
    id: 'desktop-ui',
    category: 'UI/UX',
    name: '데스크톱 UI 점검',
    description: '1280px, 1440px, 1920px에서 확인',
    status: 'pending',
    automated: false,
    priority: 'high',
  },
  {
    id: 'sidebar-consistency',
    category: 'UI/UX',
    name: '사이드바 너비 일관성',
    description: '좌측 w-60, 우측 w-80 통일',
    status: 'pending',
    automated: true,
    priority: 'medium',
  },

  // 성능
  {
    id: 'lighthouse-mobile',
    category: '성능',
    name: 'Lighthouse 모바일 90점 이상',
    description: 'Performance, Accessibility, Best Practices',
    status: 'pending',
    automated: true,
    priority: 'high',
  },
  {
    id: 'lighthouse-desktop',
    category: '성능',
    name: 'Lighthouse 데스크톱 95점 이상',
    description: 'Performance, Accessibility, Best Practices',
    status: 'pending',
    automated: true,
    priority: 'high',
  },
  {
    id: 'bundle-size',
    category: '성능',
    name: '번들 크기 체크',
    description: 'First Load JS < 200KB',
    status: 'pending',
    automated: true,
    priority: 'medium',
  },

  // 보안
  {
    id: 'env-vars',
    category: '보안',
    name: '환경 변수 확인',
    description: '.env 파일 git에 커밋 안 됨',
    status: 'pending',
    automated: true,
    command: 'git check-ignore .env',
    priority: 'critical',
  },
  {
    id: 'api-keys',
    category: '보안',
    name: 'API 키 노출 확인',
    description: '클라이언트 코드에 비밀 키 없음',
    status: 'pending',
    automated: false,
    priority: 'critical',
  },
  {
    id: 'cors-config',
    category: '보안',
    name: 'CORS 설정 확인',
    description: '허용된 도메인만 접근',
    status: 'pending',
    automated: false,
    priority: 'high',
  },

  // 데이터베이스
  {
    id: 'db-migration',
    category: '데이터베이스',
    name: 'DB 마이그레이션 완료',
    description: 'Supabase 스키마 최신 상태',
    status: 'pending',
    automated: false,
    priority: 'critical',
  },
  {
    id: 'db-backup',
    category: '데이터베이스',
    name: 'DB 백업 완료',
    description: '배포 전 데이터 백업',
    status: 'pending',
    automated: false,
    priority: 'critical',
  },

  // 브라우저 호환성
  {
    id: 'chrome-test',
    category: '호환성',
    name: 'Chrome 테스트',
    description: '최신 Chrome에서 동작 확인',
    status: 'pending',
    automated: false,
    priority: 'high',
  },
  {
    id: 'safari-test',
    category: '호환성',
    name: 'Safari 테스트',
    description: 'macOS/iOS Safari에서 동작 확인',
    status: 'pending',
    automated: false,
    priority: 'high',
  },
  {
    id: 'firefox-test',
    category: '호환성',
    name: 'Firefox 테스트',
    description: 'Firefox에서 동작 확인',
    status: 'pending',
    automated: false,
    priority: 'medium',
  },

  // 분석 & 모니터링
  {
    id: 'analytics-setup',
    category: '모니터링',
    name: 'Analytics 설정',
    description: 'Google Analytics / Amplitude 동작 확인',
    status: 'pending',
    automated: false,
    priority: 'high',
  },
  {
    id: 'error-tracking',
    category: '모니터링',
    name: 'Sentry 에러 트래킹',
    description: 'Sentry 설정 및 테스트',
    status: 'pending',
    automated: false,
    priority: 'high',
  },

  // 문서화
  {
    id: 'changelog',
    category: '문서',
    name: 'CHANGELOG 업데이트',
    description: '변경 사항 문서화',
    status: 'pending',
    automated: false,
    priority: 'medium',
  },
  {
    id: 'readme',
    category: '문서',
    name: 'README 최신화',
    description: '설치/실행 방법 확인',
    status: 'pending',
    automated: false,
    priority: 'low',
  },
];

// ============================================================================
// 컴포넌트
// ============================================================================

export default function DeploymentChecklist() {
  const [checks, setChecks] = useState<CheckItem[]>(DEPLOYMENT_CHECKS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // 카테고리별 분류
  const categories = Array.from(new Set(checks.map(c => c.category)));
  const filteredChecks = selectedCategory === 'all'
    ? checks
    : checks.filter(c => c.category === selectedCategory);

  // 통계 계산
  const stats = {
    total: checks.length,
    pass: checks.filter(c => c.status === 'pass').length,
    fail: checks.filter(c => c.status === 'fail').length,
    warning: checks.filter(c => c.status === 'warning').length,
    pending: checks.filter(c => c.status === 'pending').length,
  };

  const progress = Math.round(((stats.pass + stats.warning) / stats.total) * 100);

  // 상태 변경 핸들러
  const toggleStatus = (id: string) => {
    setChecks(prev => prev.map(check => {
      if (check.id === id) {
        const statusOrder: CheckStatus[] = ['pending', 'pass', 'warning', 'fail'];
        const currentIndex = statusOrder.indexOf(check.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        return { ...check, status: nextStatus };
      }
      return check;
    }));
  };

  // 자동화된 테스트 일괄 실행
  const runAutomatedChecks = () => {
    alert('자동화된 테스트를 실행합니다.\n\n실제로는 다음 명령을 순차 실행:\n- npm run build\n- npm run lint\n- npm test\n- npm run validate:content');
  };

  // 상태 아이콘
  const StatusIcon = ({ status }: { status: CheckStatus }) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="w-5 h-5 text-green-500" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  // 우선순위 배지
  const PriorityBadge = ({ priority }: { priority: string }) => {
    const colors = {
      critical: 'bg-red-100 text-red-700 border-red-200',
      high: 'bg-orange-100 text-orange-700 border-orange-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      low: 'bg-slate-100 text-slate-600 border-slate-200',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full border ${colors[priority as keyof typeof colors]}`}>
        {priority.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-[var(--db-text)] flex items-center gap-2">
            <Package className="w-7 h-7 text-[var(--db-brand)]" />
            배포 전 체크리스트
          </h2>
          <p className="text-sm text-[var(--db-muted)] mt-1">
            프로덕션 배포 전 필수 점검 항목 ({stats.total}개)
          </p>
        </div>

        <button
          onClick={runAutomatedChecks}
          className="px-4 py-2 rounded-lg bg-[var(--db-brand)] text-white text-sm font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <PlayCircle className="w-4 h-4" />
          자동 테스트 실행
        </button>
      </div>

      {/* 진행률 카드 */}
      <div className="db-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-[var(--db-text)]">전체 진행률</h3>
          <span className="text-3xl font-black text-[var(--db-brand)]">{progress}%</span>
        </div>

        {/* 프로그레스 바 */}
        <div className="w-full h-3 bg-[var(--db-alpha-bg)] rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-[var(--db-brand)] to-[var(--db-brand2)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 통계 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.pass}</div>
            <div className="text-xs text-[var(--db-muted)]">통과</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.warning}</div>
            <div className="text-xs text-[var(--db-muted)]">경고</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{stats.fail}</div>
            <div className="text-xs text-[var(--db-muted)]">실패</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-400">{stats.pending}</div>
            <div className="text-xs text-[var(--db-muted)]">대기</div>
          </div>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
            selectedCategory === 'all'
              ? 'bg-[var(--db-brand)] text-white'
              : 'bg-[var(--db-alpha-bg)] text-[var(--db-text)] hover:bg-[var(--db-alpha-hover)]'
          }`}
        >
          전체 ({checks.length})
        </button>
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-colors ${
              selectedCategory === category
                ? 'bg-[var(--db-brand)] text-white'
                : 'bg-[var(--db-alpha-bg)] text-[var(--db-text)] hover:bg-[var(--db-alpha-hover)]'
            }`}
          >
            {category} ({checks.filter(c => c.category === category).length})
          </button>
        ))}
      </div>

      {/* 체크리스트 */}
      <div className="space-y-2">
        {filteredChecks.map(check => (
          <div
            key={check.id}
            className="db-card p-4 hover:border-[var(--db-brand)] cursor-pointer transition-colors"
            onClick={() => toggleStatus(check.id)}
          >
            <div className="flex items-start gap-3">
              {/* 상태 아이콘 */}
              <div className="flex-shrink-0 mt-0.5">
                <StatusIcon status={check.status} />
              </div>

              {/* 내용 */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-[var(--db-text)]">{check.name}</h4>
                  <PriorityBadge priority={check.priority} />
                  {check.automated && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">
                      자동
                    </span>
                  )}
                </div>
                <p className="text-sm text-[var(--db-muted)] mb-2">{check.description}</p>
                {check.command && (
                  <code className="text-xs bg-[var(--db-alpha-bg)] px-2 py-1 rounded text-[var(--db-brand)]">
                    {check.command}
                  </code>
                )}
              </div>

              {/* 카테고리 아이콘 */}
              <div className="flex-shrink-0">
                {check.category === '빌드' && <Code className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '콘텐츠' && <FileSearch className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '테스트' && <TestTube2 className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === 'UI/UX' && <Monitor className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '성능' && <Zap className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '보안' && <Shield className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '데이터베이스' && <Database className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '호환성' && <Smartphone className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '모니터링' && <TrendingUp className="w-5 h-5 text-[var(--db-muted)]" />}
                {check.category === '문서' && <GitBranch className="w-5 h-5 text-[var(--db-muted)]" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 도움말 */}
      <div className="db-callout">
        <div className="flex items-start gap-3">
          <Bug className="w-5 h-5 text-[var(--db-brand)] flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-[var(--db-text)] mb-1">사용 방법</h4>
            <ul className="text-sm text-[var(--db-muted)] space-y-1">
              <li>• 각 항목을 클릭하여 상태 변경: 대기 → 통과 → 경고 → 실패</li>
              <li>• <span className="text-blue-600 font-bold">자동</span> 배지: 자동화된 테스트 (명령어 클릭하여 복사)</li>
              <li>• 우선순위: <span className="text-red-600 font-bold">CRITICAL</span> 항목은 반드시 통과 필요</li>
              <li>• 배포 전 최소 90% 통과 권장</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
