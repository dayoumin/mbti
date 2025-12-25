// ============================================================================
// 대시보드 사이드바 설정
// ============================================================================

import {
  LayoutDashboard,
  FlaskConical,
  Wrench,
  Target,
  BookOpen,
  Clock,
  Star,
  Play,
  FileText,
  Lightbulb,
  Sparkles,
  BarChart3,
  Code2,
  Eye,
  Palette,
  ListChecks,
  Microscope,
  Globe,
  RefreshCw,
  MessageCircle,
  Layers,
  User,
  PieChart,
  Activity,
  Share2,
  TrendingUp,
  Users,
  PawPrint,
  Puzzle,
  Bug,
  Shield,
  Database,
} from 'lucide-react';
import { CHEMI_DATA } from '@/data';

// ============================================================================
// Types
// ============================================================================

export type SidebarCategory = 'overview' | 'tests' | 'planning' | 'devtools' | 'reference';

export interface SubTab {
  key: string;
  label: string;
  icon?: React.ReactNode;
}

export interface SidebarItem {
  key: SidebarCategory;
  label: string;
  icon: React.ReactNode;
  badge?: string;
  subTabs: SubTab[];
}

// ============================================================================
// Sidebar Configuration
// ============================================================================

export const SIDEBAR_ITEMS: SidebarItem[] = [
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
      { key: 'category', label: '카테고리 전략', icon: <Layers className="w-4 h-4" /> },
      { key: 'userStrategy', label: '사용자 전략', icon: <Users className="w-4 h-4" /> },
      { key: 'features', label: '제품 기능', icon: <Layers className="w-4 h-4" /> },
      { key: 'community', label: '커뮤니티 전략', icon: <MessageCircle className="w-4 h-4" /> },
      { key: 'profile', label: '프로필 시스템', icon: <User className="w-4 h-4" /> },
      { key: 'ranking', label: '인기 랭킹', icon: <PieChart className="w-4 h-4" /> },
      { key: 'viral', label: '바이럴 콘텐츠', icon: <Sparkles className="w-4 h-4" /> },
      { key: 'retention', label: '체류 유도', icon: <RefreshCw className="w-4 h-4" /> },
      { key: 'share', label: '공유 전략', icon: <Share2 className="w-4 h-4" /> },
      { key: 'fairness', label: '공정성 시스템', icon: <Activity className="w-4 h-4" /> },
      { key: 'analytics', label: '분석/추적', icon: <BarChart3 className="w-4 h-4" /> },
      { key: 'conversion', label: '전환 분석', icon: <TrendingUp className="w-4 h-4" /> },
      { key: 'care', label: '케어 시스템', icon: <PawPrint className="w-4 h-4" /> },
    ],
  },
  {
    key: 'devtools',
    label: '개발',
    icon: <Wrench className="w-5 h-5" />,
    subTabs: [
      { key: 'contentOverview', label: '콘텐츠 현황', icon: <Database className="w-4 h-4" /> },
      { key: 'architecture', label: '아키텍처', icon: <Puzzle className="w-4 h-4" /> },
      { key: 'tokens', label: '디자인 시스템', icon: <Palette className="w-4 h-4" /> },
      { key: 'contentReview', label: '콘텐츠 검수', icon: <Shield className="w-4 h-4" /> },
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

