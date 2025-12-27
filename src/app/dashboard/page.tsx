'use client';

import { useState } from 'react';
import {
  LayoutDashboard,
  FlaskConical,
  Wrench,
  Target,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Clock,
  Star,
  Play,
  Settings,
  FileText,
  Lightbulb,
  Search,
  Sparkles,
  CheckCircle2,
  Zap,
  Heart,
  Brain,
  Puzzle,
  BarChart3,
  Code2,
  Eye,
  Palette,
  ListChecks,
  Microscope,
  Globe,
  RefreshCw,
  MessageCircle,
  Bug,
  Layers,
  User,
  PieChart,
  Activity,
  Share2,
  Sun,
  Moon,
  Shield,
  Image,
  ImagePlus,
  FolderOpen,
  Wand2,
} from 'lucide-react';
import { CHEMI_DATA } from '@/data';
import { SubjectKey } from '@/data/types';

// ============================================================================
// Overview Components
// ============================================================================
import { OverviewSummary, RecentActivity, TodoManagement } from './components/overview';

// ============================================================================
// Test Components
// ============================================================================
import { TestList, TestDetail, QuestionPreview, ResultSimulator, LogicViewer } from './components/tests';

// ============================================================================
// DevTools Components
// ============================================================================
import { DesignTokens, Troubleshooting, Learning, Development, GA4Monitor, TagCoverage } from './components/devtools';

// ============================================================================
// Planning Components
// ============================================================================
import { Roadmap } from './components/planning';

// ============================================================================
// Existing External Components
// ============================================================================
import CommunityStrategy from './components/CommunityStrategy';
import ContentSystem from './components/ContentSystem';
import ProfileSystem from './components/ProfileSystem';
import IdeaBank from './components/IdeaBank';
import SocialFeatures from './components/SocialFeatures';
import RetentionStrategy from './components/RetentionStrategy';
import MarketingStrategy from './components/MarketingStrategy';
import PopularRanking from './components/PopularRanking';
import ViralContent from './components/ViralContent';
import RetentionSystem from './components/RetentionSystem';
import ShareStrategy from './components/ShareStrategy';
import FairnessSystem from './components/FairnessSystem';
import AnalyticsSystem from './components/AnalyticsSystem';
import ConversionAnalysis from './components/ConversionAnalysis';
import PersonalizationStrategy from './components/PersonalizationStrategy';
import CategoryStrategy from './components/CategoryStrategy';
import UserStrategy from './components/UserStrategy';
import BadgeSystem from './components/BadgeSystem';
import CareSystem from './components/CareSystem';
import DemographicsDashboard from './components/DemographicsDashboard';
import BusinessStrategy from './components/BusinessStrategy';
import OperationsSystem from './components/OperationsSystem';
import FirstMoverStrategy from './components/FirstMoverStrategy';
import AutomationSystem from './components/AutomationSystem';
import GlobalExpansion from './components/GlobalExpansion';
import DemographicTester from './components/DemographicTester';
import FactManager from './components/FactManager';
import ContentReview from './components/ContentReview';
import ContentOverview from './components/ContentOverview';
import ResultDistributionMonitor from './components/ResultDistributionMonitor';
import InsightSystem from './components/InsightSystem';
import ContentStatusDashboard from './components/ContentStatusDashboard';
import IdeaPipeline from './components/IdeaPipeline';
import DeveloperGuide from './components/DeveloperGuide';
import ImagePromptManager from './components/ImagePromptManager';
import PromptEditor from './components/PromptEditor';
import CopyrightGuide from './components/CopyrightGuide';
import ViralOptimization from './components/ViralOptimization';
import DeploymentChecklist from './components/DeploymentChecklist';

// ============================================================================
// Types
// ============================================================================

type SidebarCategory = 'overview' | 'tests' | 'content' | 'planning' | 'devtools' | 'reference';

interface SubTabGroup {
  groupLabel: string;
  tabs: { key: string; label: string; icon?: React.ReactNode }[];
}

interface SidebarItem {
  key: SidebarCategory;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  subTabs?: { key: string; label: string; icon?: React.ReactNode }[];
  subTabGroups?: SubTabGroup[];
}

// ============================================================================
// Route Mapping - 라우팅을 한 곳에서 관리
// ============================================================================

interface RouteConfig {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component: React.ComponentType<any>;
  needsTestProps?: boolean;
}

const ROUTE_MAP: Record<string, Record<string, RouteConfig>> = {
  overview: {
    summary: { component: OverviewSummary },
    contentStatus: { component: ContentStatusDashboard },
    ideaPipeline: { component: IdeaPipeline },
    recent: { component: RecentActivity },
    todos: { component: TodoManagement },
  },
  tests: {
    list: { component: TestList, needsTestProps: true },
    detail: { component: TestDetail, needsTestProps: true },
    questions: { component: QuestionPreview, needsTestProps: true },
    simulator: { component: ResultSimulator, needsTestProps: true },
    logic: { component: LogicViewer, needsTestProps: true },
  },
  content: {
    contentOverview: { component: ContentOverview },
    imagePrompts: { component: ImagePromptManager },
    promptEditor: { component: PromptEditor },
    contentReview: { component: ContentReview },
  },
  planning: {
    viralOptimization: { component: ViralOptimization },
    ideaBank: { component: IdeaBank },
    insight: { component: InsightSystem },
    content: { component: ContentSystem },
    firstMover: { component: FirstMoverStrategy },
    roadmap: { component: Roadmap },
    category: { component: CategoryStrategy },
    userStrategy: { component: UserStrategy },
    viral: { component: ViralContent },
    share: { component: ShareStrategy },
    retention: { component: RetentionStrategy },
    features: { component: SocialFeatures },
    community: { component: CommunityStrategy },
    profile: { component: ProfileSystem },
    badge: { component: BadgeSystem },
    care: { component: CareSystem },
    ranking: { component: PopularRanking },
    fairness: { component: FairnessSystem },
    operations: { component: OperationsSystem },
    analytics: { component: AnalyticsSystem },
    conversion: { component: ConversionAnalysis },
    demographics: { component: DemographicsDashboard },
    business: { component: BusinessStrategy },
    global: { component: GlobalExpansion },
  },
  devtools: {
    aiTools: { component: DeveloperGuide },
    deployment: { component: DeploymentChecklist },
    architecture: { component: Development },
    automation: { component: AutomationSystem },
    ga4: { component: GA4Monitor },
    tagCoverage: { component: TagCoverage },
    facts: { component: FactManager },
    demographicTest: { component: DemographicTester },
    tokens: { component: DesignTokens },
    resultDistribution: { component: ResultDistributionMonitor },
    troubleshoot: { component: Troubleshooting },
    learning: { component: Learning },
    copyright: { component: CopyrightGuide },
  },
  reference: {
    references: { component: () => <div className="db-card p-6"><p className="text-[var(--db-muted)]">참고자료 섹션</p></div> },
    newTests: { component: () => <div className="db-card p-6"><p className="text-[var(--db-muted)]">신규 테스트 조사 섹션</p></div> },
  },
};

// ============================================================================
// Sidebar Configuration
// ============================================================================

const SIDEBAR_ITEMS: SidebarItem[] = [
  {
    key: 'overview',
    label: '개요',
    icon: <LayoutDashboard className="w-5 h-5" />,
    subTabs: [
      { key: 'summary', label: '요약', icon: <BarChart3 className="w-4 h-4" /> },
      { key: 'contentStatus', label: '콘텐츠 현황', icon: <Layers className="w-4 h-4" /> },
      { key: 'ideaPipeline', label: '아이디어 파이프라인', icon: <Lightbulb className="w-4 h-4" /> },
      { key: 'recent', label: '최근 활동', icon: <Clock className="w-4 h-4" /> },
      { key: 'todos', label: 'TODO', icon: <ListChecks className="w-4 h-4" /> },
    ],
  },
  {
    key: 'tests',
    label: '테스트',
    icon: <FlaskConical className="w-5 h-5" />,
    badge: String(Object.keys(CHEMI_DATA).length),
    subTabs: [
      { key: 'list', label: '목록', icon: <ListChecks className="w-4 h-4" /> },
      { key: 'detail', label: '상세 스펙', icon: <FileText className="w-4 h-4" /> },
      { key: 'questions', label: '질문 미리보기', icon: <Eye className="w-4 h-4" /> },
      { key: 'simulator', label: '시뮬레이터', icon: <Play className="w-4 h-4" /> },
      { key: 'logic', label: '로직 뷰어', icon: <Code2 className="w-4 h-4" /> },
    ],
  },
  {
    key: 'content',
    label: '콘텐츠',
    icon: <Image className="w-5 h-5" />,
    subTabs: [
      { key: 'contentOverview', label: '콘텐츠 현황', icon: <FolderOpen className="w-4 h-4" /> },
      { key: 'imagePrompts', label: '이미지 프롬프트', icon: <ImagePlus className="w-4 h-4" /> },
      { key: 'promptEditor', label: '프롬프트 에디터', icon: <Wand2 className="w-4 h-4" /> },
      { key: 'contentReview', label: '콘텐츠 검수', icon: <CheckCircle2 className="w-4 h-4" /> },
    ],
  },
  {
    key: 'planning',
    label: '기획',
    icon: <Target className="w-5 h-5" />,
    subTabGroups: [
      {
        groupLabel: '전략',
        tabs: [
          { key: 'viralOptimization', label: '바이럴 최적화 🔥', icon: <TrendingUp className="w-4 h-4" /> },
          { key: 'ideaBank', label: '아이디어 뱅크', icon: <Lightbulb className="w-4 h-4" /> },
          { key: 'insight', label: '인사이트 시스템', icon: <Brain className="w-4 h-4" /> },
          { key: 'content', label: '콘텐츠 시스템', icon: <Sparkles className="w-4 h-4" /> },
          { key: 'firstMover', label: '선점 효과', icon: <Zap className="w-4 h-4" /> },
          { key: 'roadmap', label: '로드맵', icon: <ListChecks className="w-4 h-4" /> },
          { key: 'category', label: '카테고리', icon: <Layers className="w-4 h-4" /> },
          { key: 'userStrategy', label: '사용자', icon: <User className="w-4 h-4" /> },
          { key: 'viral', label: '바이럴', icon: <Star className="w-4 h-4" /> },
          { key: 'share', label: '공유', icon: <Share2 className="w-4 h-4" /> },
          { key: 'retention', label: '체류 유도', icon: <RefreshCw className="w-4 h-4" /> },
        ],
      },
      {
        groupLabel: '기능',
        tabs: [
          { key: 'features', label: '제품 기능', icon: <Layers className="w-4 h-4" /> },
          { key: 'community', label: '커뮤니티', icon: <MessageCircle className="w-4 h-4" /> },
          { key: 'profile', label: '프로필', icon: <User className="w-4 h-4" /> },
          { key: 'badge', label: '배지 시스템', icon: <Star className="w-4 h-4" /> },
          { key: 'care', label: '케어 시스템', icon: <Heart className="w-4 h-4" /> },
          { key: 'ranking', label: '인기 랭킹', icon: <PieChart className="w-4 h-4" /> },
          { key: 'fairness', label: '공정성', icon: <Activity className="w-4 h-4" /> },
          { key: 'operations', label: '운영', icon: <Settings className="w-4 h-4" /> },
        ],
      },
      {
        groupLabel: '분석',
        tabs: [
          { key: 'analytics', label: '분석/추적', icon: <BarChart3 className="w-4 h-4" /> },
          { key: 'conversion', label: '전환 분석', icon: <TrendingUp className="w-4 h-4" /> },
          { key: 'demographics', label: '인구통계', icon: <User className="w-4 h-4" /> },
        ],
      },
      {
        groupLabel: '비즈니스',
        tabs: [
          { key: 'business', label: '비즈니스 전략', icon: <TrendingUp className="w-4 h-4" /> },
          { key: 'global', label: '글로벌 확장', icon: <Globe className="w-4 h-4" /> },
        ],
      },
    ],
  },
  {
    key: 'devtools',
    label: '개발',
    icon: <Wrench className="w-5 h-5" />,
    subTabs: [
      { key: 'aiTools', label: 'AI 도구 가이드', icon: <Sparkles className="w-4 h-4" /> },
      { key: 'deployment', label: '배포 체크리스트', icon: <CheckCircle2 className="w-4 h-4" /> },
      { key: 'architecture', label: '아키텍처', icon: <Puzzle className="w-4 h-4" /> },
      { key: 'automation', label: '자동화', icon: <Zap className="w-4 h-4" /> },
      { key: 'ga4', label: 'GA4 모니터링', icon: <Activity className="w-4 h-4" /> },
      { key: 'tagCoverage', label: '태그 커버리지', icon: <BarChart3 className="w-4 h-4" /> },
      { key: 'facts', label: '팩트 DB', icon: <FileText className="w-4 h-4" /> },
      { key: 'demographicTest', label: '연령 테스터', icon: <User className="w-4 h-4" /> },
      { key: 'tokens', label: '디자인 시스템', icon: <Palette className="w-4 h-4" /> },
      { key: 'resultDistribution', label: '결과 분포', icon: <BarChart3 className="w-4 h-4" /> },
      { key: 'troubleshoot', label: '트러블슈팅', icon: <Bug className="w-4 h-4" /> },
      { key: 'learning', label: '학습', icon: <BookOpen className="w-4 h-4" /> },
      { key: 'copyright', label: '저작권 가이드', icon: <Shield className="w-4 h-4" /> },
    ],
  },
  {
    key: 'reference',
    label: '참고',
    icon: <BookOpen className="w-5 h-5" />,
    subTabs: [
      { key: 'references', label: '참고자료', icon: <Globe className="w-4 h-4" /> },
      { key: 'newTests', label: '신규 테스트 조사', icon: <Microscope className="w-4 h-4" /> },
    ],
  },
];

// ============================================================================
// Dashboard Component
// ============================================================================

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState<SidebarCategory>('overview');
  const [activeSubTab, setActiveSubTab] = useState<string>('summary');
  const [selectedTest, setSelectedTest] = useState<SubjectKey>('human');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [expandedCategory, setExpandedCategory] = useState<SidebarCategory | null>('overview');
  const [activeGroup, setActiveGroup] = useState<string>('전략');

  const currentSidebarItem = SIDEBAR_ITEMS.find((item) => item.key === activeCategory);

  const getAllTabs = (item: SidebarItem) => {
    if (item.subTabs) return item.subTabs;
    if (item.subTabGroups) {
      return item.subTabGroups.flatMap(g => g.tabs);
    }
    return [];
  };

  const getCurrentGroupTabs = () => {
    if (!currentSidebarItem?.subTabGroups) return currentSidebarItem?.subTabs || [];
    const group = currentSidebarItem.subTabGroups.find(g => g.groupLabel === activeGroup);
    return group?.tabs || [];
  };

  const handleCategoryChange = (category: SidebarCategory) => {
    setActiveCategory(category);
    setExpandedCategory(expandedCategory === category ? null : category);
    const item = SIDEBAR_ITEMS.find((i) => i.key === category);
    if (item) {
      const allTabs = getAllTabs(item);
      if (allTabs.length > 0) {
        setActiveSubTab(allTabs[0].key);
      }
      if (item.subTabGroups && item.subTabGroups.length > 0) {
        setActiveGroup(item.subTabGroups[0].groupLabel);
      }
    }
  };

  const handleGroupChange = (groupLabel: string) => {
    setActiveGroup(groupLabel);
    const group = currentSidebarItem?.subTabGroups?.find(g => g.groupLabel === groupLabel);
    if (group && group.tabs.length > 0) {
      setActiveSubTab(group.tabs[0].key);
    }
  };

  // 라우팅 매핑으로 컴포넌트 렌더링
  const renderContent = () => {
    const categoryRoutes = ROUTE_MAP[activeCategory];
    if (!categoryRoutes) return null;

    const routeConfig = categoryRoutes[activeSubTab];
    if (!routeConfig) return null;

    const Component = routeConfig.component;
    if (routeConfig.needsTestProps) {
      return <Component selectedTest={selectedTest} onSelectTest={setSelectedTest} />;
    }
    return <Component />;
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dashboard-dark' : 'dashboard-light'}`}>
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 db-sidebar flex flex-col z-50">
        {/* Logo */}
        <div className="p-4">
          <div className="db-sidebar-brand flex items-center gap-3 p-3 rounded-2xl">
            <div className="w-10 h-10 rounded-xl db-sidebar-logo flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[#081023]" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-[var(--db-text)]">Chemi Dashboard</h1>
              <p className="text-xs text-[var(--db-muted)]">테스트 관리 & 전략</p>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-4 pb-3 db-search">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--db-muted)]" />
            <input
              type="text"
              placeholder="검색..."
              className="w-full pl-10 pr-4 py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => {
            const isExpanded = expandedCategory === item.key;
            const isActive = activeCategory === item.key;
            const hasSubGroups = item.subTabGroups && item.subTabGroups.length > 0;

            return (
              <div key={item.key}>
                <button
                  onClick={() => handleCategoryChange(item.key)}
                  className={`db-nav-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${isActive ? 'active' : ''}`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-[var(--db-brand)]' : 'text-[var(--db-muted)]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.badge && <span className="db-chip">{item.badge}</span>}
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90 text-[var(--db-brand)]' : 'text-[var(--db-muted)]'}`} />
                  </div>
                </button>

                {/* 하위 메뉴 (그룹이 있는 경우) */}
                {isExpanded && hasSubGroups && (
                  <div className="ml-4 mt-1 space-y-1 border-l border-[var(--db-border)] pl-3">
                    {item.subTabGroups!.map((group) => (
                      <button
                        key={group.groupLabel}
                        onClick={() => handleGroupChange(group.groupLabel)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeGroup === group.groupLabel && isActive
                          ? 'bg-[var(--db-brand)]/10 text-[var(--db-brand)]'
                          : 'text-[var(--db-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-panel)]'
                        }`}
                      >
                        {group.groupLabel}
                        <span className="ml-2 text-[10px] opacity-60">({group.tabs.length})</span>
                      </button>
                    ))}
                  </div>
                )}

                {/* 하위 메뉴 (일반 subTabs인 경우) */}
                {isExpanded && !hasSubGroups && item.subTabs && item.subTabs.length > 0 && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-[var(--db-border)] pl-3">
                    {item.subTabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setActiveSubTab(tab.key)}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-xs transition-colors flex items-center gap-2 ${activeSubTab === tab.key && isActive
                          ? 'bg-[var(--db-brand)]/10 text-[var(--db-brand)]'
                          : 'text-[var(--db-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-panel)]'
                        }`}
                      >
                        {tab.icon}
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4">
          <div className="db-footer-note">
            <p className="text-xs">v0.1.0 Beta · Next.js 16</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-72">
        {/* Header */}
        <header className="sticky top-0 z-40 db-header pt-4 pb-3">
          <div className="px-6 flex items-center gap-6">
            {currentSidebarItem?.subTabGroups ? (
              <>
                <span className="text-sm font-medium text-[var(--db-brand)]">{activeGroup}</span>
                <div className="db-tabs flex items-center gap-1.5 px-2 py-1.5 rounded-xl">
                  {getCurrentGroupTabs().map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveSubTab(tab.key)}
                      className={`db-tab flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium ${activeSubTab === tab.key ? 'active' : ''}`}
                    >
                      {tab.icon}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="db-tabs flex items-center gap-2 px-3 py-2 rounded-xl">
                {currentSidebarItem?.subTabs?.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveSubTab(tab.key)}
                    className={`db-tab flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${activeSubTab === tab.key ? 'active' : ''}`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>
            )}

            <div className="ml-auto flex items-center gap-4">
              <span className="text-xs text-[var(--db-muted)]">업데이트: 2025.12.27</span>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-[var(--db-panel)] transition-colors"
                title={theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-[var(--db-muted)]" />
                ) : (
                  <Moon className="w-5 h-5 text-[var(--db-muted)]" />
                )}
              </button>
            </div>
          </div>
        </header>

        {/* Content Area - 라우팅 매핑으로 렌더링 */}
        <div className="p-6 pt-8">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
