'use client';

import { useState, useMemo } from 'react';
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
  HeartHandshake,
  Cat,
  Dog,
  Rabbit,
  Coffee,
  Flower2,
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
  Fish,
  Bird,
  Bug,
  Layers,
  User,
  PieChart,
  Activity,
  Share2,
  CupSoda,
  Apple,
  Wine,
  Croissant,
  Sparkle,
  Leaf,
  Sun,
  Moon,
  ThumbsUp,
  ThumbsDown,
  Copy,
} from 'lucide-react';
import Link from 'next/link';
import { CHEMI_DATA } from '@/data';
import { SubjectKey } from '@/data/types';
import { TEST_TYPES, SUBJECT_CONFIG } from '@/data/config';
import CommunityStrategy from './components/CommunityStrategy';
import ContentSystem from './components/ContentSystem';
import ProfileSystem from './components/ProfileSystem';
import PostDetailTestStrategy from './components/PostDetailTestStrategy';
import SocialFeatures from './components/SocialFeatures';
import RetentionStrategy from './components/RetentionStrategy';
import MarketingStrategy from './components/MarketingStrategy';
import PopularRanking from './components/PopularRanking';
import ViralContent from './components/ViralContent';
import RetentionSystem from './components/RetentionSystem';
import ShareStrategy from './components/ShareStrategy';
import FairnessSystem from './components/FairnessSystem';
import AnalyticsSystem from './components/AnalyticsSystem';

// ============================================================================
// Types
// ============================================================================

type SidebarCategory = 'overview' | 'tests' | 'planning' | 'devtools' | 'reference';

interface SidebarItem {
  key: SidebarCategory;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  subTabs: { key: string; label: string; icon?: React.ReactNode }[];
}

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
    key: 'planning',
    label: '기획',
    icon: <Target className="w-5 h-5" />,
    subTabs: [
      { key: 'roadmap', label: '로드맵', icon: <Lightbulb className="w-4 h-4" /> },
      { key: 'features', label: '제품 기능', icon: <Layers className="w-4 h-4" /> },
      { key: 'profile', label: '프로필 시스템', icon: <User className="w-4 h-4" /> },
      { key: 'ranking', label: '인기 랭킹', icon: <PieChart className="w-4 h-4" /> },
      { key: 'viral', label: '바이럴 콘텐츠', icon: <Sparkles className="w-4 h-4" /> },
      { key: 'retention', label: '체류 유도', icon: <RefreshCw className="w-4 h-4" /> },
      { key: 'share', label: '공유 전략', icon: <Share2 className="w-4 h-4" /> },
      { key: 'fairness', label: '공정성 시스템', icon: <Activity className="w-4 h-4" /> },
      { key: 'analytics', label: '분석/추적', icon: <BarChart3 className="w-4 h-4" /> },
    ],
  },
  {
    key: 'devtools',
    label: '개발',
    icon: <Wrench className="w-5 h-5" />,
    subTabs: [
      { key: 'architecture', label: '아키텍처', icon: <Puzzle className="w-4 h-4" /> },
      { key: 'tokens', label: '디자인 시스템', icon: <Palette className="w-4 h-4" /> },
      { key: 'troubleshoot', label: '트러블슈팅', icon: <Bug className="w-4 h-4" /> },
      { key: 'learning', label: '학습', icon: <BookOpen className="w-4 h-4" /> },
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
// Test Icon Mapping
// ============================================================================

const TEST_ICONS: Record<SubjectKey, React.ReactNode> = {
  human: <Brain className="w-5 h-5" />,
  cat: <Cat className="w-5 h-5" />,
  dog: <Dog className="w-5 h-5" />,
  rabbit: <Rabbit className="w-5 h-5" />,
  hamster: <Puzzle className="w-5 h-5" />,
  idealType: <Heart className="w-5 h-5" />,
  plant: <Flower2 className="w-5 h-5" />,
  petMatch: <Star className="w-5 h-5" />,
  coffee: <Coffee className="w-5 h-5" />,
  tea: <CupSoda className="w-5 h-5" />,
  conflictStyle: <HeartHandshake className="w-5 h-5" />,
  fruit: <Apple className="w-5 h-5" />,
  alcohol: <Wine className="w-5 h-5" />,
  bread: <Croissant className="w-5 h-5" />,
  perfume: <Sparkle className="w-5 h-5" />,
  aroma: <Leaf className="w-5 h-5" />,
  // petMatch 세부 테스트
  dogBreed: <Dog className="w-5 h-5" />,
  catBreed: <Cat className="w-5 h-5" />,
  smallPet: <Puzzle className="w-5 h-5" />,
  fishType: <Fish className="w-5 h-5" />,
  birdType: <Bird className="w-5 h-5" />,
  reptileType: <Bug className="w-5 h-5" />,
};

// ============================================================================
// Dashboard Component
// ============================================================================

export default function DashboardPage() {
  const [activeCategory, setActiveCategory] = useState<SidebarCategory>('overview');
  const [activeSubTab, setActiveSubTab] = useState<string>('summary');
  const [selectedTest, setSelectedTest] = useState<SubjectKey>('human');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const currentSidebarItem = SIDEBAR_ITEMS.find((item) => item.key === activeCategory);

  const handleCategoryChange = (category: SidebarCategory) => {
    setActiveCategory(category);
    const item = SIDEBAR_ITEMS.find((i) => i.key === category);
    if (item && item.subTabs.length > 0) {
      setActiveSubTab(item.subTabs[0].key);
    }
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
        <nav className="flex-1 px-3 py-2 space-y-1.5 overflow-y-auto">
          {SIDEBAR_ITEMS.map((item) => (
            <button
              key={item.key}
              onClick={() => handleCategoryChange(item.key)}
              className={`db-nav-item w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium ${
                activeCategory === item.key ? 'active' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={activeCategory === item.key ? 'text-[var(--db-brand)]' : 'text-[var(--db-muted)]'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              <div className="flex items-center gap-2">
                {item.badge && (
                  <span className="db-chip">
                    {item.badge}
                  </span>
                )}
                <ChevronRight
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeCategory === item.key ? 'rotate-90 text-[var(--db-brand)]' : 'text-[var(--db-muted)]'
                  }`}
                />
              </div>
            </button>
          ))}
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
        <header className="sticky top-0 z-40 h-14 db-header">
          <div className="h-full px-6 flex items-center gap-6">
            {/* Sub Tabs */}
            <div className="db-tabs flex items-center gap-2 px-3 py-2 rounded-xl">
              {currentSidebarItem?.subTabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveSubTab(tab.key)}
                  className={`db-tab flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium ${
                    activeSubTab === tab.key ? 'active' : ''
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Right side: Update date + Theme Toggle */}
            <div className="ml-auto flex items-center gap-4">
              <span className="text-xs text-[var(--db-muted)]">
                업데이트: 2025.12.15
              </span>
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

        {/* Content Area */}
        <div className="p-6">
          {activeCategory === 'overview' && activeSubTab === 'summary' && <OverviewSummary />}
          {activeCategory === 'overview' && activeSubTab === 'recent' && <RecentActivity />}
          {activeCategory === 'tests' && activeSubTab === 'list' && (
            <TestList selectedTest={selectedTest} onSelectTest={setSelectedTest} />
          )}
          {activeCategory === 'tests' && activeSubTab === 'detail' && (
            <TestDetail selectedTest={selectedTest} onSelectTest={setSelectedTest} />
          )}
          {activeCategory === 'tests' && activeSubTab === 'questions' && (
            <QuestionPreview selectedTest={selectedTest} onSelectTest={setSelectedTest} />
          )}
          {activeCategory === 'tests' && activeSubTab === 'simulator' && (
            <ResultSimulator selectedTest={selectedTest} onSelectTest={setSelectedTest} />
          )}
          {activeCategory === 'tests' && activeSubTab === 'logic' && (
            <LogicViewer selectedTest={selectedTest} onSelectTest={setSelectedTest} />
          )}
          {/* 개요 - TODO */}
          {activeCategory === 'overview' && activeSubTab === 'todos' && <TodoManagement />}
          {/* 기획 */}
          {activeCategory === 'planning' && activeSubTab === 'roadmap' && <Roadmap />}
          {activeCategory === 'planning' && activeSubTab === 'features' && <ProductFeatures />}
          {activeCategory === 'planning' && activeSubTab === 'profile' && <ProfileSystem />}
          {activeCategory === 'planning' && activeSubTab === 'ranking' && <PopularRanking />}
          {activeCategory === 'planning' && activeSubTab === 'viral' && <ViralContent />}
          {activeCategory === 'planning' && activeSubTab === 'retention' && <RetentionSystem />}
          {activeCategory === 'planning' && activeSubTab === 'share' && <ShareStrategy />}
          {activeCategory === 'planning' && activeSubTab === 'fairness' && <FairnessSystem />}
          {activeCategory === 'planning' && activeSubTab === 'analytics' && <AnalyticsSystem />}
          {/* 개발 */}
          {activeCategory === 'devtools' && activeSubTab === 'architecture' && <Architecture />}
          {activeCategory === 'devtools' && activeSubTab === 'tokens' && <DesignTokens />}
          {activeCategory === 'devtools' && activeSubTab === 'troubleshoot' && <Troubleshooting />}
          {activeCategory === 'devtools' && activeSubTab === 'learning' && <Learning />}
          {/* 참고 */}
          {activeCategory === 'reference' && activeSubTab === 'references' && <References />}
          {activeCategory === 'reference' && activeSubTab === 'newTests' && <NewTestResearch />}
        </div>
      </main>
    </div>
  );
}

// ============================================================================
// Overview Components
// ============================================================================

function OverviewSummary() {
  const testCount = Object.keys(CHEMI_DATA).length;
  const totalQuestions = Object.values(CHEMI_DATA).reduce(
    (sum, data) => sum + data.questions.length,
    0
  );
  const totalResults = Object.values(CHEMI_DATA).reduce(
    (sum, data) => sum + data.resultLabels.length,
    0
  );

  const stats = [
    { label: '총 테스트', value: testCount, icon: <FlaskConical className="w-5 h-5" />, color: 'var(--db-brand)' },
    { label: '총 질문', value: totalQuestions, icon: <FileText className="w-5 h-5" />, color: 'var(--db-brand2)' },
    { label: '결과 유형', value: totalResults, icon: <Sparkles className="w-5 h-5" />, color: 'var(--db-warning)' },
    { label: '테스트 타입', value: Object.keys(TEST_TYPES).length, icon: <Puzzle className="w-5 h-5" />, color: 'var(--db-danger)' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="db-card p-5 hover:scale-[1.02] transition-transform duration-200"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{ background: `${stat.color}22` }}
            >
              <span style={{ color: stat.color }}>{stat.icon}</span>
            </div>
            <p className="text-2xl font-bold text-[var(--db-text)]">{stat.value}</p>
            <p className="text-sm text-[var(--db-muted)]">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Test Overview Cards */}
      <div className="db-card overflow-visible">
        <div className="db-card-header px-5 py-4">
          <h2 className="text-lg font-semibold text-[var(--db-text)]">테스트 현황</h2>
        </div>
        <div className="p-5 grid grid-cols-3 gap-4">
          {(Object.keys(CHEMI_DATA) as SubjectKey[]).map((key) => {
            const data = CHEMI_DATA[key];

            return (
              <div
                key={key}
                className="db-callout hover:scale-[1.01] transition-transform duration-200"
              >
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[var(--db-brand)]">{TEST_ICONS[key]}</span>
                  <div>
                    <h3 className="font-medium text-[var(--db-text)]">{data.title}</h3>
                    <p className="text-xs text-[var(--db-muted)]">{data.subtitle}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-[var(--db-muted)]">
                    <strong className="text-[var(--db-text)]">{data.questions.length}</strong> 질문
                  </span>
                  <span className="text-[var(--db-muted)]">
                    <strong className="text-[var(--db-text)]">{data.resultLabels.length}</strong> 결과
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="db-card overflow-visible">
        <div className="db-card-header px-5 py-4">
          <h2 className="text-lg font-semibold text-[var(--db-text)]">빠른 작업</h2>
        </div>
        <div className="p-5 flex gap-3">
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
            style={{
              background: 'linear-gradient(135deg, var(--db-brand), var(--db-brand2))',
              color: '#081023'
            }}
          >
            <Play className="w-4 h-4" />
            테스트 실행
          </Link>
          <button className="db-tab flex items-center gap-2 px-4 py-2">
            <Settings className="w-4 h-4" />
            설정
          </button>
          <button className="db-tab flex items-center gap-2 px-4 py-2">
            <RefreshCw className="w-4 h-4" />
            데이터 새로고침
          </button>
        </div>
      </div>
    </div>
  );
}

function RecentActivity() {
  const activities = [
    { type: 'add', message: '대시보드 구조 개편 (전략→제품→성장→운영)', time: '2024-12-15' },
    { type: 'add', message: 'perfume, aroma 테스트 추가', time: '2024-12-14' },
    { type: 'add', message: '피드백 댓글 기능 (FeedbackComments)', time: '2024-12-14' },
    { type: 'add', message: 'fruit, alcohol, bread 테스트 추가', time: '2024-12-13' },
    { type: 'add', message: 'petMatch 세부 테스트 6종 추가', time: '2024-12-12' },
    { type: 'update', message: 'ResultFeedback 피드백 수집 기능', time: '2024-12-11' },
  ];

  return (
    <div className="db-card">
      <div className="db-card-header px-5 py-4">
        <h2 className="text-lg font-semibold text-[var(--db-text)]">최근 활동</h2>
      </div>
      <div className="p-5 space-y-3">
        {activities.map((activity, idx) => (
          <div key={idx} className="db-callout flex items-center gap-4">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                background: activity.type === 'add' ? 'rgba(124, 255, 138, 0.15)' : 'rgba(122, 162, 255, 0.15)'
              }}
            >
              {activity.type === 'add' ? (
                <CheckCircle2 className="w-4 h-4 text-[var(--db-ok)]" />
              ) : (
                <RefreshCw className="w-4 h-4 text-[var(--db-brand)]" />
              )}
            </div>
            <div className="flex-1">
              <p className="text-sm text-[var(--db-text)]">{activity.message}</p>
              <p className="text-xs text-[var(--db-muted)]">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Test Components
// ============================================================================

interface TestSelectorProps {
  selectedTest: SubjectKey;
  onSelectTest: (test: SubjectKey) => void;
}

// 테스트를 타입별로 그룹화
function getTestsByType(): Record<string, SubjectKey[]> {
  const grouped: Record<string, SubjectKey[]> = {};
  (Object.keys(CHEMI_DATA) as SubjectKey[]).forEach((key) => {
    const config = SUBJECT_CONFIG[key];
    const type = config.testType;
    if (!grouped[type]) grouped[type] = [];
    grouped[type].push(key);
  });
  return grouped;
}

// 타입 탭 버튼 컴포넌트
interface TypeTabsProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}

function TypeTabs({ selectedType, onSelectType }: TypeTabsProps) {
  const testsByType = getTestsByType();
  const types = Object.keys(testsByType);

  return (
    <div className="db-tabs flex gap-2 p-2 rounded-xl mb-6">
      {types.map((type) => {
        const typeInfo = TEST_TYPES[type];
        const isSelected = selectedType === type;
        const count = testsByType[type].length;

        return (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className={`db-tab flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
              isSelected ? 'active' : ''
            }`}
          >
            <span>{typeInfo?.emoji}</span>
            <span>{typeInfo?.label || type}</span>
            <span className="db-chip">
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function TestSelector({ selectedTest, onSelectTest }: TestSelectorProps) {
  const testsByType = getTestsByType();
  const types = Object.keys(testsByType);
  const [selectedType, setSelectedType] = useState(types[0] || 'personality');
  const testsForType = testsByType[selectedType] || [];

  return (
    <div className="mb-6">
      <TypeTabs selectedType={selectedType} onSelectType={setSelectedType} />

      <div className="flex flex-wrap gap-2">
        {testsForType.map((key) => {
          const data = CHEMI_DATA[key];
          const isSelected = selectedTest === key;

          return (
            <button
              key={key}
              onClick={() => onSelectTest(key)}
              className={`db-tab flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium ${
                isSelected ? 'active' : ''
              }`}
            >
              {TEST_ICONS[key]}
              {data.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TestList({ selectedTest, onSelectTest }: TestSelectorProps) {
  const testsByType = getTestsByType();
  const types = Object.keys(testsByType);
  const [selectedType, setSelectedType] = useState(types[0] || 'personality');
  const testsForType = testsByType[selectedType] || [];
  const typeInfo = TEST_TYPES[selectedType];

  return (
    <div className="space-y-6">
      <TypeTabs selectedType={selectedType} onSelectType={setSelectedType} />

      {/* 타입 설명 */}
      <div className="flex items-center gap-3 text-sm text-[var(--db-muted)]">
        <span>{typeInfo?.description}</span>
        <span className="opacity-50">•</span>
        <span>{testsForType.length}개 테스트</span>
      </div>

      {/* 테스트 카드 그리드 */}
      <div className="grid grid-cols-2 gap-4">
        {testsForType.map((key) => {
          const data = CHEMI_DATA[key];

          return (
            <div
              key={key}
              onClick={() => onSelectTest(key)}
              className={`db-card p-5 cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                selectedTest === key ? 'ring-2 ring-[var(--db-brand)]' : ''
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: 'rgba(122, 162, 255, 0.15)' }}
                >
                  <span className="text-[var(--db-brand)]">{TEST_ICONS[key]}</span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--db-text)] mb-1">{data.title}</h3>
                  <p className="text-sm text-[var(--db-muted)] mb-3">{data.subtitle}</p>
                  <div className="flex items-center gap-4 text-xs text-[var(--db-muted)]">
                    <span>{data.questions.length}개 질문</span>
                    <span>{data.resultLabels.length}개 결과</span>
                    <span>{Object.keys(data.dimensions).length}개 차원</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function TestDetail({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];
  const dimensionEntries = Object.entries(data.dimensions);

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      {/* Header Card */}
      <div className="db-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center"
            style={{ background: 'rgba(122, 162, 255, 0.15)' }}
          >
            <span className="text-[var(--db-brand)]">{TEST_ICONS[selectedTest]}</span>
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--db-text)]">{data.title}</h2>
            <p className="text-[var(--db-muted)]">{data.subtitle}</p>
          </div>
        </div>

        {/* Dimensions */}
        <div className="mt-6">
          <h3 className="text-sm font-semibold text-[var(--db-text)] mb-3">측정 차원</h3>
          <div className="grid grid-cols-5 gap-3">
            {dimensionEntries.map(([key, dim]) => (
              <div key={key} className="db-callout">
                <p className="font-medium text-[var(--db-text)]">{dim.name}</p>
                <p className="text-xs text-[var(--db-muted)] mt-1">{dim.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">
            결과 유형 ({data.resultLabels.length}개)
          </h3>
        </div>
        <div className="p-5 grid grid-cols-2 gap-3">
          {data.resultLabels.slice(0, 8).map((result, idx) => (
            <div key={idx} className="db-callout flex items-center gap-3">
              <span className="text-2xl">{result.emoji}</span>
              <div>
                <p className="font-medium text-[var(--db-text)]">{result.name}</p>
                <p className="text-xs text-[var(--db-muted)] truncate max-w-xs">{result.desc}</p>
              </div>
            </div>
          ))}
        </div>
        {data.resultLabels.length > 8 && (
          <p className="text-sm text-[var(--db-muted)] pb-4 text-center">
            + {data.resultLabels.length - 8}개 더...
          </p>
        )}
      </div>
    </div>
  );
}

function QuestionPreview({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];
  const [searchTerm, setSearchTerm] = useState('');

  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return data.questions;
    return data.questions.filter((q) =>
      q.q.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data.questions, searchTerm]);

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      {/* Search */}
      <div className="relative db-search">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--db-muted)]" />
        <input
          type="text"
          placeholder="질문 검색..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 outline-none"
        />
      </div>

      {/* Questions List */}
      <div className="db-card divide-y divide-[rgba(255,255,255,0.06)]">
        {filteredQuestions.map((q, idx) => (
          <div key={idx} className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
            <div className="flex items-start gap-3">
              <span
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium shrink-0"
                style={{ background: 'rgba(122, 162, 255, 0.2)', color: 'var(--db-brand)' }}
              >
                {idx + 1}
              </span>
              <div className="flex-1">
                <p className="text-[var(--db-text)]">{q.q}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-[var(--db-muted)]">
                  <span>차원: {q.dimension}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// DevTools Components
// ============================================================================

function ResultSimulator({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];
  const dimensionKeys = Object.keys(data.dimensions);

  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    dimensionKeys.forEach((key) => (initial[key] = 50));
    return initial;
  });

  const handleScoreChange = (key: string, value: number) => {
    setScores((prev) => ({ ...prev, [key]: value }));
  };

  const matchedResult = useMemo(() => {
    const avgScore = Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length;
    const idx = Math.floor((avgScore / 100) * (data.resultLabels.length - 1));
    return data.resultLabels[Math.min(idx, data.resultLabels.length - 1)];
  }, [scores, data.resultLabels]);

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      <div className="grid grid-cols-2 gap-6">
        {/* Score Sliders */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">점수 조절</h3>
          </div>
          <div className="p-5 space-y-4">
            {dimensionKeys.map((key) => {
              const dim = data.dimensions[key];
              return (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-[var(--db-text)]">{dim.name}</span>
                    <span className="text-sm text-[var(--db-brand)] font-bold">{scores[key]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={scores[key]}
                    onChange={(e) => handleScoreChange(key, Number(e.target.value))}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{ background: 'rgba(122, 162, 255, 0.3)', accentColor: 'var(--db-brand)' }}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Result Preview */}
        <div className="db-card">
          <div className="db-card-header px-5 py-4">
            <h3 className="text-lg font-semibold text-[var(--db-text)]">예측 결과</h3>
          </div>
          <div className="p-5">
            {matchedResult && (
              <div className="text-center">
                <span className="text-6xl mb-4 block">{matchedResult.emoji}</span>
                <h4 className="text-xl font-bold text-[var(--db-text)] mb-2">{matchedResult.name}</h4>
                <p className="text-[var(--db-muted)]">{matchedResult.desc}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LogicViewer({ selectedTest, onSelectTest }: TestSelectorProps) {
  const data = CHEMI_DATA[selectedTest];

  // 차원별 문항 수 계산
  const dimCounts: Record<string, number> = {};
  data.questions.forEach((q) => {
    dimCounts[q.dimension] = (dimCounts[q.dimension] || 0) + 1;
  });

  return (
    <div className="space-y-6">
      <TestSelector selectedTest={selectedTest} onSelectTest={onSelectTest} />

      {/* 매칭 로직 설명 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">🔄 매칭 로직 흐름</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* 플로우 다이어그램 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 text-sm font-medium">
              1. 사용자 답변
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-purple-500/20 text-purple-300 text-sm font-medium">
              2. 차원별 점수 합산
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-emerald-500/20 text-emerald-300 text-sm font-medium">
              3. 레벨 변환
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-amber-500/20 text-amber-300 text-sm font-medium">
              4. 조건 매칭
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--db-muted)]" />
            <div className="px-4 py-2 rounded-lg bg-rose-500/20 text-rose-300 text-sm font-medium">
              5. 결과 결정
            </div>
          </div>

          {/* 레벨 변환 기준 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <h4 className="text-sm font-semibold text-[var(--db-text)] mb-3">📊 레벨 변환 기준</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-emerald-400">HIGH</span>
                  <span className="text-[var(--db-muted)]">점수 ≥ 60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-amber-400">MEDIUM</span>
                  <span className="text-[var(--db-muted)]">40% &lt; 점수 &lt; 60%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-rose-400">LOW</span>
                  <span className="text-[var(--db-muted)]">점수 ≤ 40%</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <h4 className="text-sm font-semibold text-[var(--db-text)] mb-3">🎯 매칭 우선순위</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-[var(--db-brand)] font-mono">1.</span>
                  <span className="text-[var(--db-text)]">완전 매칭 (모든 조건 일치)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--db-brand)] font-mono">2.</span>
                  <span className="text-[var(--db-text)]">조건 개수 많은 것 우선</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[var(--db-brand)] font-mono">3.</span>
                  <span className="text-[var(--db-text)]">부분 매칭 (가장 많이 일치)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 선택된 테스트의 차원 및 결과 분석 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">📋 {data.title} 분석</h3>
        </div>
        <div className="p-5 space-y-4">
          {/* 차원별 문항 수 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--db-muted)] mb-3">차원별 문항 수</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(dimCounts).map(([dim, count]) => (
                <div key={dim} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(122,162,255,0.15)' }}>
                  <span className="text-[var(--db-text)] text-sm font-medium">{dim}</span>
                  <span className="text-[var(--db-brand)] text-sm">{count}문항</span>
                  <span className="text-[var(--db-muted)] text-xs">(max: {count * 5}점)</span>
                </div>
              ))}
            </div>
          </div>

          {/* 결과 유형별 조건 */}
          <div>
            <h4 className="text-sm font-semibold text-[var(--db-muted)] mb-3">결과 유형 조건</h4>
            <div className="space-y-2">
              {data.resultLabels.map((r, idx) => {
                const conditionEntries = Object.entries(r.condition || {});
                const conditionCount = conditionEntries.length;
                return (
                  <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="text-lg">{r.emoji}</span>
                    <span className="text-[var(--db-text)] text-sm font-medium min-w-[120px]">{r.name}</span>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {conditionCount > 0 ? (
                        conditionEntries.map(([dim, level]) => (
                          <span
                            key={dim}
                            className={`px-2 py-0.5 rounded text-xs font-mono ${
                              level === 'high' ? 'bg-emerald-500/20 text-emerald-300' :
                              level === 'low' ? 'bg-rose-500/20 text-rose-300' :
                              'bg-amber-500/20 text-amber-300'
                            }`}
                          >
                            {dim}:{level}
                          </span>
                        ))
                      ) : (
                        <span className="text-[var(--db-muted)] text-xs italic">fallback (조건 없음)</span>
                      )}
                    </div>
                    <span className="text-[var(--db-muted)] text-xs ml-auto">({conditionCount}조건)</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 검증 도구 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">🧪 검증 도구</h3>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-[var(--db-muted)]">
            테스트 데이터의 품질을 검증하는 스크립트들입니다. 새 테스트 추가 시 반드시 실행하세요.
          </p>

          {/* 스크립트 목록 */}
          <div className="space-y-3">
            <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[var(--db-text)] text-sm font-medium">통합 검증</span>
              </div>
              <code className="text-xs text-[var(--db-brand)] block">
                node scripts/validate-test-data.mjs {'{subject}'}
              </code>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                구조, 차원, 결과 도달 가능성, 동기화, 품질 검사
              </p>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-blue-400" />
                <span className="text-[var(--db-text)] text-sm font-medium">동기화 검사</span>
              </div>
              <code className="text-xs text-[var(--db-brand)] block">
                node scripts/compare-data-sync.mjs
              </code>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                Legacy(legacy/data/) ↔ TypeScript(src/data/) 일치 여부
              </p>
            </div>

            <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
              <div className="flex items-center gap-2 mb-2">
                <Play className="w-4 h-4 text-purple-400" />
                <span className="text-[var(--db-text)] text-sm font-medium">매칭 로직 테스트</span>
              </div>
              <code className="text-xs text-[var(--db-brand)] block">
                node scripts/test-matching-logic.mjs
              </code>
              <p className="text-xs text-[var(--db-muted)] mt-1">
                결과 유형별 도달 가능성, 경쟁 상황 테스트
              </p>
            </div>
          </div>

          {/* 검증 체크리스트 */}
          <div className="p-4 rounded-lg border border-[var(--db-brand)]/30" style={{ background: 'rgba(122,162,255,0.05)' }}>
            <h4 className="text-sm font-semibold text-[var(--db-brand)] mb-3">✅ 검증 체크리스트</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-[var(--db-text)]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>필수 필드 존재 (title, dimensions, questions, resultLabels)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>모든 차원에 질문 존재</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>모든 결과 유형 도달 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>중복 조건 없음</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>Next.js ↔ Legacy 동기화</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded border border-[var(--db-muted)]" />
                <span>질문 중복 없음</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DesignTokens() {
  const [activeSection, setActiveSection] = useState<'app' | 'dashboard' | 'archive'>('app');

  return (
    <div className="space-y-6">
      {/* Section Tabs */}
      <div className="db-card p-2">
        <div className="flex gap-1">
          {[
            { key: 'app' as const, label: '앱 디자인 시스템' },
            { key: 'dashboard' as const, label: '대시보드 토큰' },
            { key: 'archive' as const, label: '아카이브' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveSection(tab.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeSection === tab.key
                  ? 'bg-[var(--db-brand)] text-[#081023]'
                  : 'text-[var(--db-muted)] hover:text-[var(--db-text)] hover:bg-[rgba(255,255,255,0.05)]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeSection === 'app' && <AppDesignSystem />}
      {activeSection === 'dashboard' && <DashboardTokens />}
      {activeSection === 'archive' && <ArchiveSection />}
    </div>
  );
}

function AppDesignSystem() {
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

  const components = [
    { name: 'TestCard', file: 'TestCard.js', desc: '테스트 선택 카드' },
    { name: 'TraitBar', file: 'TraitBar.tsx', desc: '성향 비율 막대' },
    { name: 'ShareCard', file: 'ShareCard.tsx', desc: 'SNS 공유 카드' },
    { name: 'ResultFeedback', file: 'ResultFeedback.tsx', desc: '피드백 버튼' },
    { name: 'FeedbackComments', file: 'FeedbackComments.tsx', desc: '피드백 댓글' },
    { name: 'ResultRankingView', file: 'ResultRankingView.tsx', desc: '결과 미리보기/랭킹' },
    { name: 'Dashboard', file: 'Dashboard.js', desc: '메인 홈' },
    { name: 'MyProfile', file: 'MyProfile.tsx', desc: '프로필 페이지' },
  ];

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
                  <p className="text-[10px] text-[var(--db-muted)] text-center">
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
                    <p className="text-[10px] text-[var(--db-muted)] text-center">
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
                    <p className="text-[10px] text-[var(--db-muted)] text-center">
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
            <div className="bg-white rounded-xl border border-slate-200 p-4">
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
              <button className="w-full py-2.5 rounded-lg bg-white border border-slate-200 text-slate-700 text-sm font-medium">
                Secondary 버튼
              </button>
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-emerald-600 text-xs font-medium flex items-center justify-center gap-1">
                  <ThumbsUp className="w-3 h-3" /> 맞아요
                </button>
                <button className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-red-500 text-xs font-medium flex items-center justify-center gap-1">
                  <ThumbsDown className="w-3 h-3" /> 아니에요
                </button>
              </div>
            </div>
          </div>

          {/* TraitBar */}
          <div className="mt-4 bg-white rounded-lg border border-slate-200 p-3">
            <p className="text-[10px] font-medium text-slate-500 mb-2">TraitBar</p>
            <div className="flex justify-between text-[10px] text-slate-500 mb-1">
              <span>내향 72%</span>
              <span>외향 28%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden flex">
              <div className="bg-indigo-500 h-full" style={{ width: '72%' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 컴포넌트 목록 - 심플 테이블 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-sm font-semibold text-[var(--db-text)]">컴포넌트 목록</h3>
          <p className="text-xs text-[var(--db-muted)] mt-0.5">src/components/</p>
        </div>
        <div className="divide-y divide-[var(--db-line)]">
          {components.map((comp) => (
            <div key={comp.name} className="px-5 py-3 flex items-center justify-between hover:bg-[var(--db-alpha-hover)] transition-colors">
              <div className="flex items-center gap-3">
                <code className="text-sm font-medium text-[var(--db-text)]">{comp.name}</code>
                <span className="text-xs text-[var(--db-muted)]">{comp.desc}</span>
              </div>
              <code className="text-xs text-[var(--db-muted)]">{comp.file}</code>
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

function DashboardTokens() {
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

function ArchiveSection() {
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

function ArchiveItem({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
      <code className="text-sm text-[var(--db-brand)]">{name}</code>
      <p className="text-xs text-[var(--db-muted)] mt-1">{desc}</p>
    </div>
  );
}

// ============================================================================
// Strategy Components (아카이브 - 현재 미사용)
// ============================================================================

function VisionMoat() {
  const moats = [
    { num: 1, title: '네트워크 효과', desc: '내 선택 후 "집단 분포/비슷한 사람"이 보이면 타인의 존재가 필수 기능이 됨' },
    { num: 2, title: '상황 데이터 축적', desc: '종/환경/시간에 따른 선택·결과가 축적되어 추천/리포트로 확장 가능' },
    { num: 3, title: '신뢰 그래프', desc: '활동량이 아니라 결과 기반 신뢰도로 "고수 발언의 무게"가 형성됨' },
    { num: 4, title: '전환 비용', desc: '개인 히스토리, 스트릭, 약점 분석이 쌓이면 다른 앱으로 이동이 귀찮아짐' },
    { num: 5, title: '학습 락인', desc: '복습·재등장·약점 퀴즈로 사용자가 "성장하는 느낌"을 지속적으로 받음' },
  ];

  const difficulties = [
    { level: '쉬움', items: ['퀴즈 UI', 'AI 설명', '디자인'], color: 'var(--db-danger)' },
    { level: '중간', items: ['상황 콘텐츠(문항) 자체'], color: 'var(--db-warning)' },
    { level: '어려움', items: ['집단 선택 분포', '구조화된 경험 DB'], color: 'var(--db-ok)' },
    { level: '매우 어려움', items: ['신뢰 그래프(결과 기반)', '개인 히스토리'], color: 'var(--db-brand)' },
  ];

  return (
    <div className="space-y-6">
      {/* 핵심 비전 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">핵심 비전</h3>
        </div>
        <div className="p-5">
          <div className="p-4 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(122,162,255,0.15), rgba(85,230,193,0.1))' }}>
            <p className="text-lg font-bold text-[var(--db-text)] mb-2">
              &quot;정답을 주는 앱이 아니라, 상황 판단이 모이는 표준 공간&quot;
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="db-pill ok">네트워크 효과</span>
              <span className="db-pill ok">상황 데이터 축적</span>
              <span className="db-pill ok">신뢰 그래프</span>
              <span className="db-pill warn">초기 범위는 좁게</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-[var(--db-muted)]">
            <div><strong className="text-[var(--db-text)]">유입:</strong> 가볍게 퀴즈/상황 콘텐츠로 들어옴</div>
            <div><strong className="text-[var(--db-text)]">체류:</strong> 내 선택 vs 집단 분포, 토론, 결과 업데이트</div>
            <div><strong className="text-[var(--db-text)]">락인:</strong> 히스토리/레벨/신뢰도/개인 약점이 계정에 쌓임</div>
            <div><strong className="text-[var(--db-text)]">확장:</strong> 데이터가 쌓일수록 AI·제휴·전문가 모델이 자연스럽게 붙음</div>
          </div>
        </div>
      </div>

      {/* 해자 5종 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">선점 효과 (해자) 5종</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">복제 가능한 것(기능) 대신 복제 어려운 것(데이터·신뢰·전환비용)에 집중</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {moats.map((moat) => (
            <div key={moat.num} className="db-callout">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded-full text-sm font-bold flex items-center justify-center"
                  style={{ background: 'var(--db-brand)', color: '#081023' }}
                >
                  {moat.num}
                </span>
                <span className="font-semibold text-[var(--db-text)]">{moat.title}</span>
              </div>
              <p className="text-sm text-[var(--db-muted)]">{moat.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 경쟁 난이도 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">경쟁자가 따라오기 어려운 포인트</h3>
        </div>
        <div className="p-5 space-y-3">
          {difficulties.map((d) => (
            <div
              key={d.level}
              className="flex items-center gap-3 p-3 rounded-xl"
              style={{ background: `${d.color}15`, border: `1px solid ${d.color}40` }}
            >
              <span className="px-2 py-1 rounded text-xs font-bold" style={{ color: d.color }}>{d.level}</span>
              <span className="text-sm text-[var(--db-text)]">{d.items.join(', ')}</span>
            </div>
          ))}
          <div className="mt-4 db-callout" style={{ borderColor: 'rgba(255,209,102,0.35)' }}>
            <strong className="text-[var(--db-warning)]">실행 팁:</strong>
            <span className="text-[var(--db-muted)] ml-2">시작부터 상황 ID와 결과 업데이트를 넣어 &quot;데이터가 쌓이는 길&quot;을 열어두기</span>
          </div>
        </div>
      </div>

      {/* MVP 범위 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">MVP 범위</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-bold text-[var(--db-ok)] mb-3">✅ 해야 할 것</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 반려식물 / 관상어 / 반려견 중 <strong className="text-[var(--db-text)]">하나만</strong> 선택</li>
              <li>• 상황 퀴즈 30~50개 (초급/중급 섞기)</li>
              <li>• 선택 후 <strong className="text-[var(--db-text)]">집단 분포</strong> 노출</li>
              <li>• 결과 요약(매뉴얼) + 경험 기록 템플릿</li>
              <li>• 상황별 고정 스레드(토론)</li>
              <li>• 내 히스토리 (최근 답변/결과 업데이트)</li>
            </ul>
            <div className="mt-3 p-2 rounded-lg text-xs" style={{ background: 'rgba(124,255,138,0.1)', color: 'var(--db-ok)' }}>
              <strong>초기 KPI:</strong> 일간 재방문율, 결과 업데이트율, 상황별 댓글/기록 수
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[var(--db-danger)] mb-3">❌ 초기에 하면 망하는 것</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 모든 반려생물 카테고리 동시 시작</li>
              <li>• AI가 &apos;정답&apos;을 독점하는 자동 답변</li>
              <li>• 화려한 기능(챗봇, 마켓, 라이브 등)부터</li>
              <li>• 무제한 게시판 (정보 쓰레기화 위험)</li>
            </ul>
            <div className="mt-3 p-2 rounded-lg text-xs" style={{ background: 'rgba(255,107,107,0.1)', color: 'var(--db-danger)' }}>
              <strong>대신:</strong> &quot;상황 → 선택 → 분포 → 기록&quot;의 루프를 완성하는 데 리소스를 몰빵
            </div>
          </div>
        </div>
      </div>

      {/* AI 역할 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">AI 역할 설계</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">AI는 &apos;정답 기계&apos;가 아니라 해설자/요약자/분석가로 제한</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(124,255,138,0.08)' }}>
            <h4 className="font-bold text-[var(--db-ok)] mb-3">✅ AI가 할 일</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 상황/가이드 <strong className="text-[var(--db-text)]">요약</strong></li>
              <li>• 집단 선택 패턴 <strong className="text-[var(--db-text)]">설명</strong> (초보/고수 차이 등)</li>
              <li>• 개인 약점(자주 틀리는 클러스터) <strong className="text-[var(--db-text)]">리포트</strong></li>
              <li>• 토론 스레드 <strong className="text-[var(--db-text)]">요약</strong> (하이라이트만)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.08)' }}>
            <h4 className="font-bold text-[var(--db-danger)] mb-3">❌ AI가 하면 안 되는 일</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 단일 정답을 제시하며 판단을 대체</li>
              <li>• 커뮤니티를 건너뛰게 만드는 자동 상담</li>
              <li>• 검증 안 된 개인 경험을 &apos;사실&apos;처럼 단정</li>
            </ul>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(122,162,255,0.1)', color: 'var(--db-brand)' }}>
            <strong>원칙:</strong> AI는 &quot;설명/정리&quot;만 하고, &quot;결정&quot;은 사용자와 집단 데이터가 하게 만든다
          </div>
        </div>
      </div>
    </div>
  );
}

function Monetization() {
  return (
    <div className="space-y-6">
      {/* 수익화 개요 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">수익화 설계</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">무료 루프를 유지하면서, &apos;분석/심화/편의&apos;에 과금을 붙인다</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="db-callout">
            <h4 className="font-bold text-[var(--db-text)] mb-3">무료</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 기본 상황 퀴즈</li>
              <li>• 집단 분포 보기</li>
              <li>• 경험 기록/토론 참여</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.1)', border: '2px solid rgba(122,162,255,0.3)' }}>
            <h4 className="font-bold text-[var(--db-brand)] mb-3">💎 유료(구독)</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 개인 히스토리 분석(약점, 리포트)</li>
              <li>• 고급 시뮬레이션/타임라인</li>
              <li>• 유사 사용자 비교(더 상세)</li>
              <li>• 스레드 요약/하이라이트</li>
            </ul>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="db-callout" style={{ borderColor: 'rgba(255,209,102,0.35)' }}>
            <strong className="text-[var(--db-warning)]">포인트:</strong>
            <span className="text-[var(--db-muted)] ml-2">커뮤니티 접근을 막으면 성장성이 꺾이니, &quot;분석/심화&quot; 쪽을 유료로</span>
          </div>
        </div>
      </div>

      {/* 제휴/마켓 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">제휴/마켓 연결</h3>
        </div>
        <div className="p-5">
          <ul className="space-y-3 text-sm text-[var(--db-muted)]">
            <li className="flex items-start gap-2">
              <span className="text-[var(--db-brand)]">•</span>
              <span><strong className="text-[var(--db-text)]">상황 기반 추천:</strong> &quot;히터 고장&quot; → 히터/온도계/예비 전원</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--db-brand)]">•</span>
              <span><strong className="text-[var(--db-text)]">초보 패키지:</strong> &quot;입문 생존 키트&quot; 같은 큐레이션</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[var(--db-brand)]">•</span>
              <span><strong className="text-[var(--db-text)]">브랜드 협업:</strong> 특정 장비 사용 후 경험 기록(리워드)</span>
            </li>
          </ul>
        </div>
      </div>

      {/* 광고 수익 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">광고 수익</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="db-callout">
            <h4 className="font-bold text-[var(--db-text)] mb-2">네이티브 광고</h4>
            <ul className="space-y-1 text-sm text-[var(--db-muted)]">
              <li>• 결과 화면 하단 관련 상품 추천</li>
              <li>• 테스트 완료 후 스폰서 콘텐츠</li>
              <li>• 인사이트 페이지 내 파트너 배너</li>
            </ul>
          </div>
          <div className="db-callout">
            <h4 className="font-bold text-[var(--db-text)] mb-2">광고 원칙</h4>
            <ul className="space-y-1 text-sm text-[var(--db-muted)]">
              <li>• 테스트 진행 중에는 광고 X (몰입 방해)</li>
              <li>• 관련성 높은 광고만 (맥락 기반)</li>
              <li>• 유료 구독자에게는 광고 제거 옵션</li>
            </ul>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="db-callout text-sm">
            <strong className="text-[var(--db-text)]">AdSense/AdMob:</strong>
            <span className="text-[var(--db-muted)] ml-1">초기에는 구글 광고로 시작, 트래픽 증가 시 직접 광고 영업으로 전환</span>
          </div>
        </div>
      </div>

      {/* 데이터 모델 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">데이터 모델 (상황 표준화)</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">상황을 &apos;콘텐츠&apos;가 아니라 &apos;데이터 단위&apos;로 만든다 (상황 ID가 자산)</p>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <h4 className="font-bold text-[var(--db-text)] mb-2">Situation 스키마</h4>
            <pre className="p-4 rounded-lg text-xs overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--db-brand2)' }}>
{`Situation
- id: "AQ-FW-001"
- domain: "aquarium" | "pet" | "plant"
- categoryPath: ["관상어","담수어","질병"]
- title: "바닥에 가라앉고 숨이 가쁨"
- difficulty: 1..5
- riskLevel: 1..5
- choices: [{key:"A", text:"..."}]
- guide: {whatToCheck, immediateActions}
- tags: ["호흡","부레","수질"]`}
            </pre>
          </div>
          <div>
            <h4 className="font-bold text-[var(--db-text)] mb-2">Experience 스키마</h4>
            <pre className="p-4 rounded-lg text-xs overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--db-brand2)' }}>
{`Experience (구조화 기록)
- situationId: "AQ-FW-001"
- chosen: "C"
- outcome: "회복" | "악화" | "미확인"
- timeline: "48시간 내 회복"
- environment: {
    volumeL: 20, tempC: 24,
    species: ["네온테트라"]
  }
- lesson: "격리+에어레이션 효과적"
- createdAt, updatedAt`}
            </pre>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="p-3 rounded-xl text-sm" style={{ background: 'rgba(122,162,255,0.1)', color: 'var(--db-brand)' }}>
            <strong>핵심:</strong> Situation ID로 공유/검색/표준화가 가능해지고, 경험이 연결된다
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpansionPlan() {
  const tracks = [
    {
      title: '테스트 확장',
      icon: '🧪',
      color: '#7aa2ff',
      items: [
        { name: '성격 테스트 (human)', status: 'done' },
        { name: '동물 테스트 (cat/dog/rabbit/hamster)', status: 'done' },
        { name: '매칭 테스트 (plant/petMatch/coffee)', status: 'done' },
        { name: '상황 테스트 (idealType/conflictStyle)', status: 'done' },
        { name: '육아 유형 (childMatch)', status: 'planned' },
      ],
    },
    {
      title: '소셜 기능',
      icon: '🔗',
      color: '#ff6b9d',
      items: [
        { name: 'SNS 공유 카드', status: 'next' },
        { name: '카카오톡 공유', status: 'next' },
        { name: '친구 비교/궁합', status: 'planned' },
        { name: '커뮤니티 라운지', status: 'planned' },
      ],
    },
    {
      title: '리텐션',
      icon: '🔄',
      color: '#55e6c1',
      items: [
        { name: '데일리 퀴즈', status: 'planned' },
        { name: '스트릭 시스템', status: 'planned' },
        { name: '뱃지/레벨', status: 'planned' },
        { name: '리더보드', status: 'planned' },
      ],
    },
    {
      title: '인프라',
      icon: '🏗️',
      color: '#ffd166',
      items: [
        { name: 'Supabase 연동', status: 'blocked' },
        { name: '리퍼럴 추적', status: 'planned' },
        { name: '분석 대시보드', status: 'planned' },
      ],
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'done': return { bg: 'rgba(124,255,138,0.15)', color: 'var(--db-ok)', label: '완료' };
      case 'next': return { bg: 'rgba(122,162,255,0.15)', color: 'var(--db-brand)', label: '다음' };
      case 'blocked': return { bg: 'rgba(255,107,107,0.15)', color: 'var(--db-danger)', label: '차단' };
      default: return { bg: 'rgba(169,180,208,0.15)', color: 'var(--db-muted)', label: '예정' };
    }
  };

  return (
    <div className="space-y-6">
      {/* 현재 우선순위 */}
      <div className="db-card p-5">
        <h3 className="text-lg font-semibold text-[var(--db-text)] mb-4">현재 우선순위</h3>
        <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.1)', border: '1px solid rgba(122,162,255,0.3)' }}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h4 className="font-bold text-[var(--db-brand)]">Phase 1: 바이럴 루프</h4>
              <p className="text-sm text-[var(--db-muted)]">SNS 공유 카드 → 카카오톡 공유 → 리퍼럴 추적</p>
            </div>
          </div>
        </div>
      </div>

      {/* 트랙별 진행 */}
      <div className="grid grid-cols-2 gap-4">
        {tracks.map((track) => (
          <div key={track.title} className="db-card p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{track.icon}</span>
              <h3 className="font-semibold text-[var(--db-text)]">{track.title}</h3>
            </div>
            <div className="space-y-2">
              {track.items.map((item) => {
                const style = getStatusStyle(item.status);
                return (
                  <div key={item.name} className="flex items-center justify-between p-2 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
                    <span className="text-sm text-[var(--db-text)]">{item.name}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ background: style.bg, color: style.color }}
                    >
                      {style.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Roadmap() {
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
      items: ['데일리 콘텐츠', '스트릭', '뱃지/레벨'],
      done: false,
      current: false,
      color: '#55e6c1'
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
                  {item.current && <div className="w-2 h-2 rounded-full bg-white" />}
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

// ============================================================================
// Research Components
// ============================================================================

function NewTestResearch() {
  const researchItems = [
    {
      title: '갈등 대처 유형',
      key: 'conflictStyle',
      type: 'situation',
      status: 'designing',
      description: '갈등 상황에서의 대처 스타일 분석',
      dims: ['주장성', '참여도', '회복력', '공감력', '표현력', '지지력'],
      basis: 'Gottman, TKI, Dyadic Coping',
    },
    {
      title: '우리 아이 이해하기',
      key: 'childMatch',
      type: 'matching',
      status: 'researching',
      description: '양육 상황에서의 반응 유형 측정',
      dims: ['활동에너지', '적응력', '집중력', '감정강도', '사회성', '규칙성'],
      basis: 'Thomas & Chess, Rothbart CBQ, Baumrind',
    },
    {
      title: '이색 반려동물 매칭',
      key: 'exoticPet',
      type: 'matching',
      status: 'planned',
      description: '파충류/조류/어류 등 다양한 반려동물 매칭',
      dims: ['시간', '공간', '교감욕구', '경험도', '관리력', '안정성', '감각내성'],
      basis: '수의학회 가이드라인',
    },
    {
      title: '관상어 상황 대처',
      key: 'fishCare',
      type: 'situation',
      status: 'planned',
      description: '관상어 돌봄 상황별 대처 능력 측정',
      dims: ['수질관리', '질병대처', '환경조절', '먹이관리', '응급대처'],
      basis: '수족관 관리 실무',
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'researching': return { bg: 'rgba(255,209,102,0.15)', color: 'var(--db-warning)' };
      case 'designing': return { bg: 'rgba(122,162,255,0.15)', color: 'var(--db-brand)' };
      default: return { bg: 'rgba(169,180,208,0.15)', color: 'var(--db-muted)' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-3 gap-4">
        <div className="db-card p-4 text-center">
          <Microscope className="w-6 h-6 mx-auto mb-2 text-[var(--db-warning)]" />
          <p className="text-2xl font-bold text-[var(--db-warning)]">1</p>
          <p className="text-sm text-[var(--db-muted)]">조사중</p>
        </div>
        <div className="db-card p-4 text-center">
          <Palette className="w-6 h-6 mx-auto mb-2 text-[var(--db-brand)]" />
          <p className="text-2xl font-bold text-[var(--db-brand)]">1</p>
          <p className="text-sm text-[var(--db-muted)]">설계중</p>
        </div>
        <div className="db-card p-4 text-center">
          <Clock className="w-6 h-6 mx-auto mb-2 text-[var(--db-muted)]" />
          <p className="text-2xl font-bold text-[var(--db-muted)]">2</p>
          <p className="text-sm text-[var(--db-muted)]">예정</p>
        </div>
      </div>

      {/* Research Items */}
      {researchItems.map((item) => {
        const statusStyle = getStatusStyle(item.status);
        return (
          <div key={item.title} className="db-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-semibold text-[var(--db-text)]">{item.title}</h3>
                  <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--db-brand2)' }}>{item.key}</code>
                  <span
                    className="text-xs px-2 py-0.5 rounded"
                    style={{
                      background: item.type === 'situation' ? 'rgba(255,209,102,0.15)' : 'rgba(124,255,138,0.15)',
                      color: item.type === 'situation' ? 'var(--db-warning)' : 'var(--db-ok)'
                    }}
                  >
                    {item.type}
                  </span>
                </div>
                <p className="text-[var(--db-muted)]">{item.description}</p>
              </div>
              <span
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ background: statusStyle.bg, color: statusStyle.color }}
              >
                {item.status === 'researching' ? '조사중' : item.status === 'designing' ? '설계중' : '예정'}
              </span>
            </div>
            <div className="flex flex-wrap gap-1 mb-3">
              {item.dims.map((dim) => (
                <span key={dim} className="db-chip">{dim}</span>
              ))}
            </div>
            <div className="flex items-center gap-2 text-xs text-[var(--db-muted)]">
              <BookOpen className="w-3.5 h-3.5 text-[var(--db-ok)]" />
              <span>근거: {item.basis}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function References() {
  return (
    <div className="space-y-6">
      {/* 아동 기질 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">부모-자녀 이해 테스트</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">아동 기질 및 양육 스타일 평가</p>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResearchCard
            title="Thomas & Chess 기질 9차원"
            year="1977"
            source="New York Longitudinal Study"
            dims={['활동수준', '규칙성', '접근/회피', '적응력', '반응강도', '기분', '지속력', '주의산만성', '감각역치']}
            note="40년간 추적연구로 검증된 아동 기질 모델"
          />
          <ResearchCard
            title="Rothbart CBQ"
            year="2006"
            source="Children's Behavior Questionnaire"
            dims={['외향성/활발함', '부정적 정서', '의도적 통제']}
            note="3~7세 대상, 신경생물학적 근거"
          />
          <ResearchCard
            title="Baumrind 양육 스타일"
            year="1991"
            source="Journal of Early Adolescence"
            dims={['권위적', '독재적', '허용적', '방임적']}
            note="반응성 × 요구성 2축 모델"
          />
          <ResearchCard
            title="적합성 모델 (Goodness of Fit)"
            year="1977"
            source="Thomas & Chess"
            dims={['아이 기질', '환경/양육', '조화도']}
            note="'나쁜 기질'은 없고 맞지 않는 조합만 있음"
          />
        </div>
      </div>

      {/* 관계 갈등 대처 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">이성간 갈등 대처</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">관계 심리학 및 갈등 해결 프레임워크</p>
        </div>
        <div className="p-5 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ResearchCard
            title="Gottman 4가지 위험신호"
            year="1999"
            source="The Gottman Institute"
            dims={['비판', '경멸', '방어', '담쌓기']}
            note="이혼 예측 정확도 90%+, 40년 연구"
          />
          <ResearchCard
            title="Thomas-Kilmann TKI"
            year="1974"
            source="Conflict Mode Instrument"
            dims={['경쟁', '협력', '타협', '회피', '수용']}
            note="주장성 × 협조성 2축 모델"
          />
          <ResearchCard
            title="성인 애착 유형"
            year="2007"
            source="Mikulincer & Shaver"
            dims={['안정형(55%)', '불안형(20%)', '회피형(25%)', '혼란형(5-10%)']}
            note="갈등 시 반응 패턴 예측"
          />
          <ResearchCard
            title="Dyadic Coping"
            year="2005"
            source="Bodenmann"
            dims={['지지적 대처', '위임 대처', '공동 대처']}
            note="커플이 함께 스트레스에 대처하는 방식"
          />
        </div>
      </div>

      {/* 주요 참고문헌 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">주요 참고문헌</h3>
        </div>
        <div className="p-5 space-y-3 text-sm">
          <ReferenceItem
            authors="Thomas, A., & Chess, S."
            year="1977"
            title="Temperament and Development"
            note="아동 기질 9차원 원전"
          />
          <ReferenceItem
            authors="Rothbart, M. K., & Bates, J. E."
            year="2006"
            title="Temperament. Handbook of Child Psychology, Vol. 3"
            note="CBQ 이론적 배경"
          />
          <ReferenceItem
            authors="Baumrind, D."
            year="1991"
            title="The influence of parenting style. Journal of Early Adolescence"
            note="양육 스타일 4유형"
          />
          <ReferenceItem
            authors="Gottman, J. M."
            year="1999"
            title="The Seven Principles for Making Marriage Work"
            note="관계 연구 40년 집대성"
          />
          <ReferenceItem
            authors="Thomas & Kilmann"
            year="1974"
            title="Thomas-Kilmann Conflict Mode Instrument"
            note="갈등 대처 5유형"
          />
          <ReferenceItem
            authors="Bodenmann, G."
            year="2005"
            title="Dyadic Coping and Its Significance for Marital Functioning"
            note="커플 스트레스 대처"
          />
        </div>
      </div>
    </div>
  );
}

function ResearchCard({ title, year, source, dims, note }: {
  title: string;
  year: string;
  source: string;
  dims: string[];
  note: string;
}) {
  return (
    <div className="db-callout">
      <div className="flex items-start justify-between mb-2">
        <h4 className="font-bold text-[var(--db-text)]">{title}</h4>
        <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(122,162,255,0.15)', color: 'var(--db-brand)' }}>{year}</span>
      </div>
      <div className="text-xs text-[var(--db-muted)] mb-2">{source}</div>
      <div className="flex flex-wrap gap-1 mb-2">
        {dims.map((dim) => (
          <span key={dim} className="db-chip">{dim}</span>
        ))}
      </div>
      <div className="text-sm text-[var(--db-muted)]">{note}</div>
    </div>
  );
}

function ReferenceItem({ authors, year, title, note }: {
  authors: string;
  year: string;
  title: string;
  note: string;
}) {
  return (
    <div className="db-callout">
      <div className="flex items-start gap-2">
        <span className="db-chip shrink-0">{year}</span>
        <div>
          <span className="text-[var(--db-muted)]">{authors}</span>
          <span className="text-[var(--db-muted)] mx-1">-</span>
          <span className="text-[var(--db-text)] font-medium">{title}</span>
          <span className="text-xs text-[var(--db-brand)] ml-2">({note})</span>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// AI Defense Strategy Component
// ============================================================================

function AIDefense() {
  return (
    <div className="space-y-6">
      {/* AI 대화의 한계 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">AI 대화만의 한계</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">&quot;대화로 답&quot;은 편하지만, 검증·축적·재방문이 약하다</p>
        </div>
        <div className="p-5 space-y-3">
          <div className="db-callout flex items-start gap-3">
            <span className="text-[var(--db-danger)]">⚠️</span>
            <div>
              <strong className="text-[var(--db-text)]">입력 한계</strong>
              <p className="text-sm text-[var(--db-muted)] mt-1">환경/조건을 정확히 못 넣으면 답이 흔들림 (어항 용량·수질·종 / 식물 빛·통풍·물주기 등)</p>
            </div>
          </div>
          <div className="db-callout flex items-start gap-3">
            <span className="text-[var(--db-danger)]">⚠️</span>
            <div>
              <strong className="text-[var(--db-text)]">검증 부재</strong>
              <p className="text-sm text-[var(--db-muted)] mt-1">&apos;실제로 좋아졌는지&apos; 결과 데이터가 약함</p>
            </div>
          </div>
          <div className="db-callout flex items-start gap-3">
            <span className="text-[var(--db-warning)]">⚠️</span>
            <div>
              <strong className="text-[var(--db-text)]">재방문 동기 약함</strong>
              <p className="text-sm text-[var(--db-muted)] mt-1">대화는 끝나면 흩어지고, 누적 자산화가 제한적</p>
            </div>
          </div>
          <div className="db-callout flex items-start gap-3">
            <span className="text-[var(--db-warning)]">⚠️</span>
            <div>
              <strong className="text-[var(--db-text)]">근거 비교 어려움</strong>
              <p className="text-sm text-[var(--db-muted)] mt-1">여러 선택지 중 &apos;성공률 높은 방법&apos; 근거가 부족</p>
            </div>
          </div>
        </div>
      </div>

      {/* 우리 서비스 포지셔닝 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">우리 서비스 포지셔닝</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">&quot;AI 상담 앱&quot;이 아니라 &quot;증거가 쌓이는 곳&quot;</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.08)', border: '1px solid rgba(255,107,107,0.2)' }}>
              <h4 className="font-bold text-[var(--db-danger)] mb-3">ChatGPT 같은 일반 AI</h4>
              <ul className="space-y-2 text-sm text-[var(--db-muted)]">
                <li>• 개별 대화 기반 조언</li>
                <li>• 근거/성공률 비교가 약함</li>
                <li>• 사용자 히스토리가 플랫폼 밖에서 분절</li>
              </ul>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(124,255,138,0.08)', border: '1px solid rgba(124,255,138,0.2)' }}>
              <h4 className="font-bold text-[var(--db-ok)] mb-3">우리 서비스</h4>
              <ul className="space-y-2 text-sm text-[var(--db-muted)]">
                <li>• 상황 ID로 연결되는 <strong className="text-[var(--db-text)]">집단 선택 분포</strong></li>
                <li>• 환경/결과가 붙는 <strong className="text-[var(--db-text)]">경험 DB</strong> 축적</li>
                <li>• 결과 기반 <strong className="text-[var(--db-text)]">신뢰도</strong>로 &apos;고수의 무게&apos; 형성</li>
                <li>• <strong className="text-[var(--db-text)]">전환비용</strong>: 내 기록/약점/루틴이 쌓여 떠나기 어려움</li>
              </ul>
            </div>
          </div>
          <div className="p-3 rounded-xl text-center" style={{ background: 'linear-gradient(135deg, rgba(122,162,255,0.15), rgba(85,230,193,0.1))' }}>
            <strong className="text-[var(--db-text)]">한 줄:</strong>
            <span className="text-[var(--db-brand)] ml-2">&quot;답을 주는 곳&quot;이 아니라 &quot;증거가 쌓이는 곳&quot;을 만든다</span>
          </div>
        </div>
      </div>

      {/* AI 사용 규칙 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">AI 사용 규칙 (커뮤니티 보호)</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">AI는 해설자/요약자/분석가로 제한, 판단은 사람+데이터가</p>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(124,255,138,0.08)' }}>
            <h4 className="font-bold text-[var(--db-ok)] mb-3">✅ AI가 해야 할 것 (Do)</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 체크리스트 제공 (다음 질문/확인 항목)</li>
              <li>• 집단 선택 패턴 요약 (조건별로)</li>
              <li>• 토론 스레드 요약 (하이라이트)</li>
              <li>• 개인 약점/실수 패턴 리포트</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.08)' }}>
            <h4 className="font-bold text-[var(--db-danger)] mb-3">❌ AI가 하면 안 되는 것 (Don&apos;t)</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li>• 단일 정답 단정 (&quot;무조건 X 하세요&quot;)</li>
              <li>• 커뮤니티를 건너뛰게 만드는 자동 상담 흐름</li>
              <li>• 검증 안 된 개인 경험을 사실처럼 단정</li>
            </ul>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="db-callout" style={{ borderColor: 'rgba(122,162,255,0.35)' }}>
            <strong className="text-[var(--db-brand)]">권장 문장 스타일:</strong>
            <span className="text-[var(--db-muted)] ml-2">&quot;가능성이 높은 순서/조건/위험 신호/다음 조치&quot;로 안내</span>
          </div>
        </div>
      </div>

      {/* UX 안전장치 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">UX 안전장치 (대화형 AI 대비)</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="db-callout">
            <strong className="text-[var(--db-brand)]">필수 입력 단계</strong>
            <p className="text-sm text-[var(--db-muted)] mt-1">AI가 답하기 전에 환경/조건을 템플릿으로 받기</p>
          </div>
          <div className="db-callout">
            <strong className="text-[var(--db-brand)]">분포 우선</strong>
            <p className="text-sm text-[var(--db-muted)] mt-1">AI 텍스트보다 &apos;집단 분포/성공 사례&apos;가 먼저 보이게</p>
          </div>
          <div className="db-callout">
            <strong className="text-[var(--db-brand)]">결과 업데이트 강제</strong>
            <p className="text-sm text-[var(--db-muted)] mt-1">일정 시간 후 &quot;어떻게 됐나요?&quot; 리마인드</p>
          </div>
          <div className="db-callout">
            <strong className="text-[var(--db-brand)]">상황 스레드 고정</strong>
            <p className="text-sm text-[var(--db-muted)] mt-1">답이 흩어지지 않게 상황 ID로 모으기</p>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="p-3 rounded-xl text-sm text-center" style={{ background: 'rgba(122,162,255,0.1)', color: 'var(--db-brand)' }}>
            <strong>목표:</strong> 사용자에게 &quot;AI 답변&quot;이 아니라 &quot;검증된 흐름(증거+기록)&quot;을 주는 경험
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// UX Flow Component
// ============================================================================

function UXFlow() {
  return (
    <div className="space-y-6">
      {/* 필수 사용자 루프 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">필수 사용자 루프</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">네트워크 효과를 &apos;의도적으로&apos; 강제하는 UX</p>
        </div>
        <div className="p-5">
          <div className="p-4 rounded-xl mb-4 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <code className="text-sm text-[var(--db-brand2)]">
              상황 → 선택 → (집단 분포) → 매뉴얼 요약 → 경험 기록/토론 → 내 히스토리
            </code>
          </div>
          <div className="space-y-3">
            <div className="db-callout flex items-start gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--db-brand)', color: '#081023' }}>1</span>
              <div>
                <strong className="text-[var(--db-text)]">집단 분포는 반드시 보여주기</strong>
                <p className="text-sm text-[var(--db-muted)] mt-1">선택 직후 타인의 존재를 체감하게</p>
              </div>
            </div>
            <div className="db-callout flex items-start gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--db-brand)', color: '#081023' }}>2</span>
              <div>
                <strong className="text-[var(--db-text)]">매뉴얼은 짧게</strong>
                <p className="text-sm text-[var(--db-muted)] mt-1">&quot;지금 할 것&quot; 중심으로</p>
              </div>
            </div>
            <div className="db-callout flex items-start gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--db-brand)', color: '#081023' }}>3</span>
              <div>
                <strong className="text-[var(--db-text)]">기록은 템플릿으로</strong>
                <p className="text-sm text-[var(--db-muted)] mt-1">환경/결과/교훈 구조화</p>
              </div>
            </div>
            <div className="db-callout flex items-start gap-3">
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'var(--db-brand)', color: '#081023' }}>4</span>
              <div>
                <strong className="text-[var(--db-text)]">상황별 스레드 고정</strong>
                <p className="text-sm text-[var(--db-muted)] mt-1">정보가 흩어지지 않게</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 화면 구성 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">화면 구성 (예시)</h3>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.08)', border: '1px solid rgba(122,162,255,0.2)' }}>
            <h4 className="font-bold text-[var(--db-brand)] mb-3">📄 상황 상세 페이지 탭</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li className="flex items-center gap-2"><span className="db-chip">1</span> 상황</li>
              <li className="flex items-center gap-2"><span className="db-chip">2</span> 선택 & 분포</li>
              <li className="flex items-center gap-2"><span className="db-chip">3</span> 매뉴얼 (요약)</li>
              <li className="flex items-center gap-2"><span className="db-chip">4</span> 경험 기록</li>
              <li className="flex items-center gap-2"><span className="db-chip">5</span> 토론 (스레드)</li>
            </ul>
          </div>
          <div className="p-4 rounded-xl" style={{ background: 'rgba(85,230,193,0.08)', border: '1px solid rgba(85,230,193,0.2)' }}>
            <h4 className="font-bold text-[var(--db-brand2)] mb-3">👤 내 페이지 탭</h4>
            <ul className="space-y-2 text-sm text-[var(--db-muted)]">
              <li className="flex items-center gap-2"><span className="db-chip">1</span> 최근 답변</li>
              <li className="flex items-center gap-2"><span className="db-chip">2</span> 결과 업데이트 요청</li>
              <li className="flex items-center gap-2"><span className="db-chip">3</span> 약점/실수 패턴</li>
              <li className="flex items-center gap-2"><span className="db-chip">4</span> 레벨/신뢰도</li>
            </ul>
          </div>
        </div>
        <div className="px-5 pb-5">
          <div className="db-callout" style={{ borderColor: 'rgba(255,209,102,0.35)' }}>
            <strong className="text-[var(--db-warning)]">UX 팁:</strong>
            <span className="text-[var(--db-muted)] ml-2">&quot;댓글 자유 작성&quot;보다 &quot;경험 폼 제출&quot;을 먼저 노출하면 데이터 품질이 올라간다</span>
          </div>
        </div>
      </div>

      {/* 신뢰도/레벨 산정 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">신뢰도/레벨 산정 로직</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">활동량이 아니라 결과 기반으로 신뢰도를 반영</p>
        </div>
        <div className="p-5">
          <div className="space-y-3 mb-4">
            <div className="db-callout">
              <div className="flex items-center gap-2 mb-1">
                <span className="db-pill ok">가중치 높음</span>
                <strong className="text-[var(--db-text)]">결과 업데이트한 경험 비율</strong>
              </div>
              <p className="text-sm text-[var(--db-muted)]">실제 결과를 보고한 기록이 많을수록</p>
            </div>
            <div className="db-callout">
              <div className="flex items-center gap-2 mb-1">
                <span className="db-pill ok">가중치 높음</span>
                <strong className="text-[var(--db-text)]">특정 상황군 성공률</strong>
              </div>
              <p className="text-sm text-[var(--db-muted)]">반복적으로 &apos;좋은 결과&apos;로 이어진 선택</p>
            </div>
            <div className="db-callout">
              <div className="flex items-center gap-2 mb-1">
                <span className="db-pill warn">가중치 중간</span>
                <strong className="text-[var(--db-text)]">커뮤니티 평가</strong>
              </div>
              <p className="text-sm text-[var(--db-muted)]">&quot;도움됨&quot; 투표 + 스팸/허위 신고 반영</p>
            </div>
          </div>
          <div className="p-4 rounded-xl overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <pre className="text-xs text-[var(--db-brand2)]">{`TrustScore 예시 (단순)
trust = base
  + w1 * verifiedExperienceCount
  + w2 * helpfulVotes
  + w3 * successRateByCluster
  - w4 * spamReports`}</pre>
          </div>
        </div>
      </div>

      {/* Next.js 라우팅 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">Next.js 권장 라우팅</h3>
        </div>
        <div className="p-5">
          <div className="p-4 rounded-xl mb-4 overflow-x-auto" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <pre className="text-xs text-[var(--db-brand2)]">{`/
  - 홈 (카테고리/추천 상황)
/s/[situationId]
  - 상황 상세 (탭: 상황/분포/매뉴얼/기록/토론)
/me
  - 내 히스토리/리포트 (로그인)
/admin (선택)
  - 상황 등록/수정 (초기엔 JSON seed)`}</pre>
          </div>
          <div className="db-callout" style={{ borderColor: 'rgba(124,255,138,0.35)' }}>
            <strong className="text-[var(--db-ok)]">MVP 팁:</strong>
            <span className="text-[var(--db-muted)] ml-2">초기에는 DB 없이 JSON seed + 간단한 저장부터 시작해도 됨</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Architecture Component (레거시 아키텍처 탭)
// ============================================================================

function Architecture() {
  return (
    <div className="space-y-6">
      {/* 폴더 구조 & 컴포넌트 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>🗂️</span> 폴더 구조
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li><strong className="text-[var(--db-text)]">src/data/</strong> · subjects, constants, config, utils, types</li>
            <li><strong className="text-[var(--db-text)]">src/components/</strong> · Icons, ModeTabs, TraitBar, TestHeader</li>
            <li><strong className="text-[var(--db-text)]">src/services/</strong> · ResultService</li>
            <li><strong className="text-[var(--db-text)]">scripts/</strong> · 데이터 검증·변환 스크립트 모음</li>
          </ul>
        </div>
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>🧩</span> 컴포넌트 목록
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li><strong className="text-[var(--db-text)]">page.tsx</strong> · 메인 테스트 (home/test/result 화면)</li>
            <li><strong className="text-[var(--db-text)]">ModeTabs</strong> · 탭 및 테스트 스위치</li>
            <li><strong className="text-[var(--db-text)]">TestHeader</strong> · 진행 중 네비게이션</li>
            <li><strong className="text-[var(--db-text)]">TraitBar</strong> · 차원별 점수 시각화</li>
            <li><strong className="text-[var(--db-text)]">Icons</strong> · 테스트별 아이콘 세트</li>
          </ul>
        </div>
      </div>

      {/* 서비스 & 상태 관리 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>🛰️</span> 서비스 목록
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li><strong className="text-[var(--db-text)]">ResultService</strong> · saveResult, getMyResults, getRecommendedTest</li>
            <li className="text-xs text-[var(--db-muted)] opacity-70">Supabase 예정: StorageProviders.supabase (저장/동기화)</li>
          </ul>
        </div>
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>📦</span> 상태 관리
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li>React useState 로컬 상태 (테스트 선택, 점수, 결과)</li>
            <li>localStorage 저장 → 추후 Supabase 연동 시 동기화</li>
            <li>서비스 흐름: 질문 응답 → 결과 저장 → 인사이트 생성</li>
          </ul>
        </div>
      </div>

      {/* 데이터 스키마 & API 흐름 */}
      <div className="grid grid-cols-2 gap-4">
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>💾</span> 데이터 스키마
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li>localStorage key: <code className="text-xs px-2 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>chemi_results</code></li>
            <li>필드: testType, resultLabel, scores, createdAt, userId</li>
            <li>Supabase(예정): tables <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>results</code>, <code className="text-xs px-1 py-0.5 rounded" style={{ background: 'rgba(0,0,0,0.3)' }}>insights</code></li>
          </ul>
        </div>
        <div className="db-card p-5">
          <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
            <span>🔄</span> API / 서비스 흐름
          </h3>
          <ul className="space-y-2 text-sm text-[var(--db-muted)]">
            <li>ResultService.save → localStorage / Supabase 저장</li>
            <li>ResultService.getRecommendedTest → 완료/미완료 테스트 탐색</li>
            <li>matchResultLabel → 점수 기반 결과 매칭</li>
          </ul>
        </div>
      </div>

      {/* 타입 시스템 */}
      <div className="db-card p-5">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4 flex items-center gap-2">
          <span>📝</span> 타입 시스템 (TypeScript)
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h4 className="text-sm font-semibold text-[var(--db-brand)] mb-2">SubjectKey</h4>
            <p className="text-xs text-[var(--db-muted)]">테스트 종류 유니온 타입</p>
            <code className="text-xs text-[var(--db-brand2)] block mt-1">{`'human' | 'cat' | 'dog' | ...`}</code>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h4 className="text-sm font-semibold text-[var(--db-brand)] mb-2">Question</h4>
            <p className="text-xs text-[var(--db-muted)]">질문 데이터 타입</p>
            <code className="text-xs text-[var(--db-brand2)] block mt-1">{`{ q, dimension, a[] }`}</code>
          </div>
          <div className="p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h4 className="text-sm font-semibold text-[var(--db-brand)] mb-2">ResultLabel</h4>
            <p className="text-xs text-[var(--db-muted)]">결과 라벨 타입</p>
            <code className="text-xs text-[var(--db-brand2)] block mt-1">{`{ name, emoji, condition }`}</code>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Development Component (레거시 개발 탭)
// ============================================================================

function Development() {
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

// ============================================================================
// Troubleshooting Component (트러블슈팅 기록)
// ============================================================================

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
      'FeedbackService에서 Supabase 연결 실패',
      '브라우저 콘솔에서 process.env.NEXT_PUBLIC_* 값이 빈 문자열',
      '서버 측에서는 .env.local 인식하지만 클라이언트 번들에서 값이 ""',
    ],
    cause: 'Next.js 16 + Turbopack(dev)에서 .env.local의 NEXT_PUBLIC_* 값이 클라이언트 번들 생성 시 컴파일 타임에 빈 문자열로 상수 폴딩됨. Turbopack이 "공개 env"를 자동 주입하지 못하는 버그/불안정.',
    solution: 'next.config.ts에 env 블록을 추가해 명시적으로 환경변수를 매핑:\n\nenv: {\n  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",\n  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",\n  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? "",\n}',
    files: ['next.config.ts'],
    tags: ['Turbopack', 'env', 'Next.js 16', 'Supabase'],
  },
];

function Troubleshooting() {
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
                className={`w-5 h-5 text-[var(--db-muted)] transition-transform ${
                  expandedId === issue.id ? 'rotate-90' : ''
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

// ============================================================================
// Learning Component (레거시 학습 탭)
// ============================================================================

function Learning() {
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
          React 기반 프레임워크입니다. 라우팅, 빌드, 최적화를 자동으로 처리해줍니다.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <span className="text-2xl block mb-2">📁</span>
            <span className="text-sm text-[var(--db-text)]">파일 기반 라우팅</span>
            <p className="text-xs text-[var(--db-muted)] mt-1">app/page.tsx → /</p>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <span className="text-2xl block mb-2">⚡</span>
            <span className="text-sm text-[var(--db-text)]">자동 최적화</span>
            <p className="text-xs text-[var(--db-muted)] mt-1">코드 스플리팅, 이미지</p>
          </div>
          <div className="p-4 rounded-lg text-center" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <span className="text-2xl block mb-2">🚀</span>
            <span className="text-sm text-[var(--db-text)]">정적/동적 렌더링</span>
            <p className="text-xs text-[var(--db-muted)] mt-1">SSG, SSR 지원</p>
          </div>
        </div>
      </div>

      {/* 프로젝트 실행 방식 */}
      <div className="db-card p-6">
        <div className="flex items-baseline gap-4 mb-4">
          <span className="text-xs font-mono text-[var(--db-muted)]">04</span>
          <h3 className="text-lg font-semibold text-[var(--db-text)]">이 프로젝트 실행 방법</h3>
        </div>
        <div className="p-4 rounded-xl" style={{ background: 'rgba(124,255,138,0.1)', border: '1px solid rgba(124,255,138,0.3)' }}>
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">🎯</span>
            <div>
              <span className="font-semibold text-[var(--db-text)]">루트 디렉토리</span>
              <span className="text-xs text-[var(--db-ok)] ml-2">권장</span>
            </div>
          </div>
          <p className="text-sm text-[var(--db-muted)] mb-2">Next.js (빌드 시 변환)</p>
          <code className="block text-sm px-3 py-2 rounded" style={{ background: 'rgba(0,0,0,0.3)', color: 'var(--db-brand)' }}>
            npm run dev
          </code>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Legacy UI Reference Component
// ============================================================================

function LegacyUI() {
  return (
    <div className="space-y-6">
      <div className="db-card p-6">
        <h2 className="text-xl font-bold text-[var(--db-text)] mb-2">레거시 UI 참고</h2>
        <p className="text-[var(--db-muted)]">
          기존 index.html 앱의 디자인 요소들입니다. 향후 디자인 개선 시 참고용으로 사용하세요.
        </p>
      </div>

      {/* 디자인 특징 */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">🎨 디자인 특징</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="db-callout">
            <h4 className="font-semibold text-[var(--db-text)] mb-2">폰트</h4>
            <p className="text-sm text-[var(--db-muted)]">Jua (구글 폰트) - 친근하고 부드러운 느낌</p>
          </div>
          <div className="db-callout">
            <h4 className="font-semibold text-[var(--db-text)] mb-2">배경</h4>
            <p className="text-sm text-[var(--db-muted)]">#F8FAFC (밝은 회색) - 눈의 피로 감소</p>
          </div>
          <div className="db-callout">
            <h4 className="font-semibold text-[var(--db-text)] mb-2">버튼 스타일</h4>
            <p className="text-sm text-[var(--db-muted)]">doodle-border - 손그림 느낌의 비정형 테두리</p>
          </div>
          <div className="db-callout">
            <h4 className="font-semibold text-[var(--db-text)] mb-2">애니메이션</h4>
            <p className="text-sm text-[var(--db-muted)]">shake, pop - 인터랙션 피드백</p>
          </div>
        </div>
      </div>

      {/* Doodle Border 예시 */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">✏️ Doodle Border 스타일</h3>
        <div className="p-6 rounded-lg" style={{ background: '#F8FAFC' }}>
          <div className="flex items-center justify-center gap-4">
            <button
              className="px-6 py-3 text-gray-800 font-bold"
              style={{
                borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
                border: '3px solid #4A4A4A',
                boxShadow: '4px 4px 0px #4A4A4A',
                background: '#FCD34D',
                fontFamily: 'Jua, sans-serif'
              }}
            >
              시작하기
            </button>
            <button
              className="px-6 py-3 text-gray-800 font-bold"
              style={{
                borderRadius: '255px 15px 225px 15px / 15px 225px 15px 255px',
                border: '3px solid #4A4A4A',
                boxShadow: '4px 4px 0px #4A4A4A',
                background: '#86EFAC',
                fontFamily: 'Jua, sans-serif'
              }}
            >
              다음
            </button>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">손그림 느낌의 버튼 스타일</p>
        </div>
        <div className="mt-4 p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
          <pre className="text-xs text-[var(--db-brand2)] overflow-x-auto">{`.doodle-border {
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  border: 3px solid #4A4A4A;
  box-shadow: 4px 4px 0px #4A4A4A;
}`}</pre>
        </div>
      </div>

      {/* 컬러 팔레트 */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">🎨 레거시 컬러 팔레트</h3>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#FCD34D' }} />
            <p className="text-sm text-[var(--db-text)]">Primary</p>
            <p className="text-xs text-[var(--db-muted)]">#FCD34D</p>
          </div>
          <div className="text-center">
            <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#86EFAC' }} />
            <p className="text-sm text-[var(--db-text)]">Success</p>
            <p className="text-xs text-[var(--db-muted)]">#86EFAC</p>
          </div>
          <div className="text-center">
            <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#F8FAFC' }} />
            <p className="text-sm text-[var(--db-text)]">Background</p>
            <p className="text-xs text-[var(--db-muted)]">#F8FAFC</p>
          </div>
          <div className="text-center">
            <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#4A4A4A' }} />
            <p className="text-sm text-[var(--db-text)]">Border</p>
            <p className="text-xs text-[var(--db-muted)]">#4A4A4A</p>
          </div>
          <div className="text-center">
            <div className="w-full h-16 rounded-lg mb-2" style={{ background: '#FDA4AF' }} />
            <p className="text-sm text-[var(--db-text)]">Accent</p>
            <p className="text-xs text-[var(--db-muted)]">#FDA4AF</p>
          </div>
        </div>
      </div>

      {/* 애니메이션 */}
      <div className="db-card p-6">
        <h3 className="text-lg font-bold text-[var(--db-text)] mb-4">🎬 애니메이션 정의</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h4 className="text-sm font-semibold text-[var(--db-brand)] mb-2">@keyframes shake</h4>
            <p className="text-xs text-[var(--db-muted)]">선택 시 흔들리는 효과</p>
            <pre className="text-xs text-[var(--db-brand2)] mt-2">{`transform: translate(1px, 1px) rotate(0deg);`}</pre>
          </div>
          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,0,0,0.3)' }}>
            <h4 className="text-sm font-semibold text-[var(--db-brand)] mb-2">@keyframes pop</h4>
            <p className="text-xs text-[var(--db-muted)]">등장 시 팝업 효과</p>
            <pre className="text-xs text-[var(--db-brand2)] mt-2">{`transform: scale(0.8) → scale(1);`}</pre>
          </div>
        </div>
      </div>

      {/* 참고 사항 */}
      <div className="db-card p-6" style={{ borderColor: 'rgba(122,162,255,0.3)', borderWidth: '2px' }}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">💡</span>
          <div>
            <h4 className="font-bold text-[var(--db-brand)]">디자인 방향 고려 사항</h4>
            <ul className="text-sm text-[var(--db-muted)] mt-2 space-y-1">
              <li>• <strong className="text-[var(--db-text)]">모바일 우선:</strong> max-w-md 컨테이너로 모바일 최적화</li>
              <li>• <strong className="text-[var(--db-text)]">친근한 느낌:</strong> Jua 폰트 + 손그림 테두리로 부담 없는 UI</li>
              <li>• <strong className="text-[var(--db-text)]">피드백:</strong> shake/pop 애니메이션으로 인터랙션 강화</li>
              <li>• <strong className="text-[var(--db-text)]">PC 확장:</strong> 현재 모바일 중심, PC용 레이아웃 확장 필요</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Operations Components
// ============================================================================

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
}

function TodoManagement() {
  const todos: TodoItem[] = [
    {
      id: '1',
      title: '운영자 피드백 분석 대시보드',
      description: '테스트별 정확도 통계, 부정적 피드백 목록, AI 개선 제안 생성, CSV 내보내기',
      status: 'todo',
      priority: 'medium',
      category: '운영 도구',
      createdAt: '2024-12-15',
    },
    {
      id: '2',
      title: '향수/아로마 테스트 검증',
      description: 'perfume, aroma 테스트 데이터 검증 및 빌드 확인',
      status: 'done',
      priority: 'high',
      category: '테스트 추가',
      createdAt: '2024-12-14',
    },
    {
      id: '3',
      title: '피드백 댓글 기능',
      description: 'FeedbackComments 컴포넌트로 다른 사용자 의견 표시',
      status: 'done',
      priority: 'high',
      category: '기능 개발',
      createdAt: '2024-12-14',
    },
  ];

  const statusColors = {
    'todo': { bg: 'rgba(122,162,255,0.15)', text: 'var(--db-brand)', label: '예정' },
    'in-progress': { bg: 'rgba(255,209,102,0.15)', text: 'var(--db-warning)', label: '진행중' },
    'done': { bg: 'rgba(124,255,138,0.15)', text: 'var(--db-ok)', label: '완료' },
  };

  const priorityColors = {
    'high': { bg: 'rgba(255,107,107,0.15)', text: 'var(--db-danger)' },
    'medium': { bg: 'rgba(255,209,102,0.15)', text: 'var(--db-warning)' },
    'low': { bg: 'rgba(122,162,255,0.15)', text: 'var(--db-brand)' },
  };

  const todoCount = todos.filter(t => t.status === 'todo').length;
  const inProgressCount = todos.filter(t => t.status === 'in-progress').length;
  const doneCount = todos.filter(t => t.status === 'done').length;

  return (
    <div className="space-y-6">
      {/* 상태 요약 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="db-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(122,162,255,0.15)' }}>
              <ListChecks className="w-5 h-5 text-[var(--db-brand)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--db-text)]">{todoCount}</p>
              <p className="text-xs text-[var(--db-muted)]">예정</p>
            </div>
          </div>
        </div>
        <div className="db-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,209,102,0.15)' }}>
              <Clock className="w-5 h-5 text-[var(--db-warning)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--db-text)]">{inProgressCount}</p>
              <p className="text-xs text-[var(--db-muted)]">진행중</p>
            </div>
          </div>
        </div>
        <div className="db-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'rgba(124,255,138,0.15)' }}>
              <CheckCircle2 className="w-5 h-5 text-[var(--db-ok)]" />
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--db-text)]">{doneCount}</p>
              <p className="text-xs text-[var(--db-muted)]">완료</p>
            </div>
          </div>
        </div>
      </div>

      {/* TODO 목록 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">작업 목록</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">프로젝트 진행 상황 관리</p>
        </div>
        <div className="p-5 space-y-3">
          {todos.map((todo) => {
            const statusStyle = statusColors[todo.status];
            const priorityStyle = priorityColors[todo.priority];

            return (
              <div key={todo.id} className="db-callout">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: statusStyle.bg, color: statusStyle.text }}
                      >
                        {statusStyle.label}
                      </span>
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ background: priorityStyle.bg, color: priorityStyle.text }}
                      >
                        {todo.priority === 'high' ? '높음' : todo.priority === 'medium' ? '중간' : '낮음'}
                      </span>
                      <span className="text-xs text-[var(--db-muted)]">{todo.category}</span>
                    </div>
                    <h4 className="font-medium text-[var(--db-text)]">{todo.title}</h4>
                    {todo.description && (
                      <p className="text-sm text-[var(--db-muted)] mt-1">{todo.description}</p>
                    )}
                  </div>
                  <span className="text-xs text-[var(--db-muted)] whitespace-nowrap">{todo.createdAt}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 안내 */}
      <div className="db-callout" style={{ borderColor: 'rgba(122,162,255,0.35)' }}>
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-[var(--db-brand)] shrink-0 mt-0.5" />
          <div>
            <p className="text-sm text-[var(--db-text)]">
              <strong>TODO 관리 팁:</strong> AI와 대화하면서 &quot;TODO로 기록해줘&quot;라고 요청하면 이 목록에 추가됩니다.
            </p>
            <p className="text-xs text-[var(--db-muted)] mt-1">
              현재는 정적 데이터입니다. 추후 Supabase 연동 시 실시간 관리 가능.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackAnalysis() {
  return (
    <div className="space-y-6">
      {/* 개요 */}
      <div className="db-card">
        <div className="db-card-header px-5 py-4">
          <h3 className="text-lg font-semibold text-[var(--db-text)]">피드백 분석 (예정)</h3>
          <p className="text-sm text-[var(--db-muted)] mt-1">사용자 피드백 데이터 기반 테스트 개선</p>
        </div>
        <div className="p-5">
          <div className="db-callout mb-4" style={{ borderColor: 'rgba(255,209,102,0.35)' }}>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[var(--db-warning)]" />
              <span className="text-sm text-[var(--db-warning)]">데이터 축적 중 - 피드백이 충분히 쌓이면 분석 기능 활성화</span>
            </div>
          </div>

          <h4 className="font-medium text-[var(--db-text)] mb-3">예정 기능</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(122,162,255,0.08)' }}>
              <BarChart3 className="w-6 h-6 text-[var(--db-brand)] mb-2" />
              <h5 className="font-medium text-[var(--db-text)]">테스트별 정확도</h5>
              <p className="text-xs text-[var(--db-muted)] mt-1">👍/👎 비율로 테스트 품질 확인</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255,107,107,0.08)' }}>
              <MessageCircle className="w-6 h-6 text-[var(--db-danger)] mb-2" />
              <h5 className="font-medium text-[var(--db-text)]">부정 피드백 목록</h5>
              <p className="text-xs text-[var(--db-muted)] mt-1">&quot;아니에요&quot; 응답 + 코멘트 모아보기</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(85,230,193,0.08)' }}>
              <Brain className="w-6 h-6 text-[var(--db-brand2)] mb-2" />
              <h5 className="font-medium text-[var(--db-text)]">AI 개선 제안</h5>
              <p className="text-xs text-[var(--db-muted)] mt-1">피드백 패턴 분석 후 질문/결과 수정 제안</p>
            </div>
            <div className="p-4 rounded-xl" style={{ background: 'rgba(124,255,138,0.08)' }}>
              <FileText className="w-6 h-6 text-[var(--db-ok)] mb-2" />
              <h5 className="font-medium text-[var(--db-text)]">CSV 내보내기</h5>
              <p className="text-xs text-[var(--db-muted)] mt-1">피드백 데이터 다운로드</p>
            </div>
          </div>
        </div>
      </div>

      {/* 데이터 소스 */}
      <div className="db-card p-5">
        <h4 className="font-medium text-[var(--db-text)] mb-3">연결된 데이터</h4>
        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-[var(--db-brand)]" />
              <span className="text-sm text-[var(--db-text)]">mbti_feedback 테이블</span>
            </div>
            <span className="text-xs text-[var(--db-muted)]">Supabase</span>
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'rgba(0,0,0,0.2)' }}>
            <div className="flex items-center gap-3">
              <Code2 className="w-4 h-4 text-[var(--db-brand)]" />
              <span className="text-sm text-[var(--db-text)]">FeedbackService.ts</span>
            </div>
            <span className="text-xs text-[var(--db-muted)]">src/services/</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Product Features (통합)
// ============================================================================

function ProductFeatures() {
  const [activeTab, setActiveTab] = useState<'content' | 'social' | 'community' | 'retention' | 'marketing'>('content');

  const tabs = [
    { key: 'content' as const, label: '콘텐츠 시스템', icon: <Layers className="w-4 h-4" /> },
    { key: 'social' as const, label: '소셜 기능', icon: <Share2 className="w-4 h-4" /> },
    { key: 'community' as const, label: '커뮤니티', icon: <MessageCircle className="w-4 h-4" /> },
    { key: 'retention' as const, label: '리텐션', icon: <RefreshCw className="w-4 h-4" /> },
    { key: 'marketing' as const, label: '마케팅', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="db-card p-2">
        <div className="flex gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.key
                  ? 'bg-[var(--db-brand)] text-[#081023]'
                  : 'text-[var(--db-muted)] hover:text-[var(--db-text)] hover:bg-[var(--db-hover)]'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {activeTab === 'content' && <ContentSystem />}
      {activeTab === 'social' && <SocialFeatures />}
      {activeTab === 'community' && <CommunityStrategy />}
      {activeTab === 'retention' && <RetentionStrategy />}
      {activeTab === 'marketing' && <MarketingStrategy />}
    </div>
  );
}
