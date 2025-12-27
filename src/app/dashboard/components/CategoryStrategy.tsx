'use client';

import { useState } from 'react';
import {
  Brain,
  Sparkles,
  Heart,
  Home,
  ChevronRight,
  Target,
  TrendingUp,
  Calendar,
  Users,
  CheckCircle2,
  Layers,
  Lightbulb,
  DollarSign,
  Share2,
  MessageSquare,
  Eye,
  Zap,
} from 'lucide-react';
import {
  CATEGORY_DEFINITIONS,
  CATEGORY_ROADMAP,
  SUGGESTED_DEBATES,
  CategoryDefinition,
  TestIdea,
  RoadmapPhase,
  DebateTopic,
  MainCategory,
} from '../data/category-strategy';

// ============================================================================
// Icons
// ============================================================================

const CATEGORY_ICONS: Record<MainCategory, React.ReactNode> = {
  personality: <Brain className="w-5 h-5" />,
  matching: <Sparkles className="w-5 h-5" />,
  relationship: <Heart className="w-5 h-5" />,
  lifestyle: <Home className="w-5 h-5" />,
};

const PRIORITY_COLORS = {
  high: 'bg-rose-100 text-rose-700',
  medium: 'bg-amber-100 text-amber-700',
  low: 'bg-slate-100 text-slate-600',
};

// ============================================================================
// Sub Components
// ============================================================================

function ViralMeter({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className={`w-2 h-2 rounded-full ${i <= score ? 'bg-pink-500' : 'bg-slate-200'
            }`}
        />
      ))}
    </div>
  );
}

function CategoryCard({ category }: { category: CategoryDefinition }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center gap-3 hover:bg-slate-50 transition-colors text-left"
      >
        <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center text-white`}>
          {CATEGORY_ICONS[category.id]}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-lg">{category.emoji}</span>
            <h3 className="font-bold text-slate-800">{category.name}</h3>
            {(category.id === 'relationship' || category.id === 'lifestyle') && (
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full">
                NEW
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">{category.description}</p>
        </div>
        <ChevronRight className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-4 pb-4 space-y-4 animate-fade-in border-t border-slate-100">
          {/* Sub Categories */}
          <div className="pt-4">
            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> 서브 카테고리
            </h4>
            <div className="flex flex-wrap gap-2">
              {category.subCategories.map((sub) => (
                <span
                  key={sub.id}
                  className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-medium text-slate-700"
                >
                  {sub.emoji} {sub.name}
                </span>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" /> 특징
            </h4>
            <ul className="space-y-1">
              {category.features.map((feature, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs text-slate-600">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Test Ideas */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Lightbulb className="w-3.5 h-3.5" /> 테스트 아이디어
            </h4>
            <div className="space-y-2">
              {category.testIdeas.map((idea, idx) => (
                <TestIdeaCard key={idx} idea={idea} />
              ))}
            </div>
          </div>

          {/* Viral Strategy */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <Share2 className="w-3.5 h-3.5" /> 바이럴 전략
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2 bg-pink-50 rounded-lg">
                <p className="text-xs font-bold text-pink-700 mb-1">공유 훅</p>
                <ul className="space-y-0.5">
                  {category.viral.shareHooks.map((hook, idx) => (
                    <li key={idx} className="text-xs text-pink-600">• {hook}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2 bg-amber-50 rounded-lg">
                <p className="text-xs font-bold text-amber-700 mb-1">랭킹 아이디어</p>
                <ul className="space-y-0.5">
                  {category.viral.rankingIdeas.map((idea, idx) => (
                    <li key={idx} className="text-xs text-amber-600">• {idea}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2 bg-purple-50 rounded-lg">
                <p className="text-xs font-bold text-purple-700 mb-1">토론 주제</p>
                <ul className="space-y-0.5">
                  {category.viral.debateTopics.slice(0, 3).map((topic, idx) => (
                    <li key={idx} className="text-xs text-purple-600">• {topic}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Monetization */}
          <div>
            <h4 className="text-xs font-bold text-slate-600 mb-2 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" /> 수익화 전략
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <p className="text-xs font-bold text-emerald-700 mb-1">제품 연계</p>
                <ul className="space-y-0.5">
                  {category.monetization.productLinks.map((link, idx) => (
                    <li key={idx} className="text-xs text-emerald-600">• {link}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <p className="text-xs font-bold text-blue-700 mb-1">어필리에이트</p>
                <ul className="space-y-0.5">
                  {category.monetization.affiliateIdeas.map((idea, idx) => (
                    <li key={idx} className="text-xs text-blue-600">• {idea}</li>
                  ))}
                </ul>
              </div>
              <div className="p-2 bg-indigo-50 rounded-lg">
                <p className="text-xs font-bold text-indigo-700 mb-1">스폰서십</p>
                <ul className="space-y-0.5">
                  {category.monetization.sponsorshipPotential.map((sponsor, idx) => (
                    <li key={idx} className="text-xs text-indigo-600">• {sponsor}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TestIdeaCard({ idea }: { idea: TestIdea }) {
  return (
    <div className="p-2.5 bg-slate-50 rounded-lg flex items-center gap-3">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">{idea.name}</span>
          <span className={`px-1.5 py-0.5 text-xs font-bold rounded ${PRIORITY_COLORS[idea.priority]}`}>
            {idea.priority === 'high' ? '높음' : idea.priority === 'medium' ? '보통' : '낮음'}
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">{idea.description}</p>
        {idea.productLink && (
          <p className="text-xs text-emerald-600 mt-1">💰 {idea.productLink}</p>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="text-xs text-slate-400">바이럴</span>
        <ViralMeter score={idea.viralPotential} />
      </div>
    </div>
  );
}

function RoadmapCard({ phase }: { phase: RoadmapPhase }) {
  return (
    <div className="bg-slate-50 rounded-xl border border-slate-200 p-4">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
          <span className="text-sm font-black text-indigo-600">{phase.phase}</span>
        </div>
        <div>
          <h4 className="font-bold text-slate-800">{phase.name}</h4>
          <p className="text-xs text-slate-500">{phase.period}</p>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <p className="text-xs font-bold text-slate-600 mb-1">목표</p>
          <ul className="space-y-0.5">
            {phase.goals.map((goal, idx) => (
              <li key={idx} className="text-xs text-slate-600 flex items-start gap-1">
                <Target className="w-3 h-3 text-indigo-500 mt-0.5 flex-shrink-0" />
                {goal}
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-emerald-50 rounded-lg">
            <p className="text-xs font-bold text-emerald-700 mb-1">테스트</p>
            {phase.tests.map((test, idx) => (
              <p key={idx} className="text-xs text-emerald-600">• {test}</p>
            ))}
          </div>
          <div className="p-2 bg-blue-50 rounded-lg">
            <p className="text-xs font-bold text-blue-700 mb-1">기능</p>
            {phase.features.map((feature, idx) => (
              <p key={idx} className="text-xs text-blue-600">• {feature}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DebateCard({ debate }: { debate: DebateTopic }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-3">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{CATEGORY_DEFINITIONS.find(c => c.id === debate.category)?.emoji}</span>
        <span className="text-xs font-bold text-slate-700">{debate.topic}</span>
        <div className="ml-auto">
          <ViralMeter score={debate.viralPotential} />
        </div>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 p-2 bg-purple-50 rounded-lg text-center">
          <span className="text-xl">{debate.optionA.emoji}</span>
          <p className="text-xs font-medium text-purple-700">{debate.optionA.text}</p>
        </div>
        <div className="flex items-center">
          <span className="text-xs font-black text-slate-400">VS</span>
        </div>
        <div className="flex-1 p-2 bg-pink-50 rounded-lg text-center">
          <span className="text-xl">{debate.optionB.emoji}</span>
          <p className="text-xs font-medium text-pink-700">{debate.optionB.text}</p>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export default function CategoryStrategy() {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'roadmap' | 'debates'>('overview');

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'overview', label: '개요', icon: <Eye className="w-4 h-4" /> },
          { key: 'categories', label: '카테고리 상세', icon: <Layers className="w-4 h-4" /> },
          { key: 'roadmap', label: '로드맵', icon: <Calendar className="w-4 h-4" /> },
          { key: 'debates', label: '토론 주제', icon: <MessageSquare className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as typeof activeTab)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === tab.key
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Category Summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CATEGORY_DEFINITIONS.map((cat) => (
              <div
                key={cat.id}
                className={`p-4 rounded-2xl text-white ${cat.color}`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {CATEGORY_ICONS[cat.id]}
                  <span className="font-bold">{cat.name}</span>
                </div>
                <p className="text-xs opacity-90 mb-2">{cat.description}</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-black">{cat.testIdeas.length}</span>
                  <span className="text-xs opacity-75">테스트 아이디어</span>
                </div>
                {(cat.id === 'relationship' || cat.id === 'lifestyle') && (
                  <span className="mt-2 inline-block px-2 py-0.5 bg-white/20 text-xs font-bold rounded-full">
                    신규 카테고리
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Key Points */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5" /> 카테고리 확장 핵심 포인트
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-pink-600 mb-2 flex items-center gap-1">
                  <Heart className="w-4 h-4" /> 관계 카테고리
                </h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• <b>바이럴 특화</b>: 궁합/비교 테스트로 2인+ 참여 유도</li>
                  <li>• <b>순위/찬반</b>: 토론 주제로 소셜 공유 극대화</li>
                  <li>• <b>결과 비교</b>: 친구/연인과 결과 비교 기능</li>
                </ul>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl">
                <h4 className="font-bold text-emerald-600 mb-2 flex items-center gap-1">
                  <Home className="w-4 h-4" /> 라이프 카테고리
                </h4>
                <ul className="space-y-1 text-sm text-slate-600">
                  <li>• <b>제품 연계</b>: 결과별 관련 제품 추천</li>
                  <li>• <b>어필리에이트</b>: 구매 전환 수익화</li>
                  <li>• <b>스폰서십</b>: 브랜드 협업 기회</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Layers className="w-4 h-4 text-indigo-500" />
                <span className="text-xs text-slate-500">총 카테고리</span>
              </div>
              <span className="text-2xl font-black text-slate-800">{CATEGORY_DEFINITIONS.length}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span className="text-xs text-slate-500">테스트 아이디어</span>
              </div>
              <span className="text-2xl font-black text-slate-800">
                {CATEGORY_DEFINITIONS.reduce((sum, c) => sum + c.testIdeas.length, 0)}
              </span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-purple-500" />
                <span className="text-xs text-slate-500">토론 주제</span>
              </div>
              <span className="text-2xl font-black text-slate-800">{SUGGESTED_DEBATES.length}</span>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-emerald-500" />
                <span className="text-xs text-slate-500">로드맵 단계</span>
              </div>
              <span className="text-2xl font-black text-slate-800">{CATEGORY_ROADMAP.length}</span>
            </div>
          </div>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div className="space-y-4">
          {CATEGORY_DEFINITIONS.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}

      {/* Roadmap Tab */}
      {activeTab === 'roadmap' && (
        <div className="space-y-4">
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <h3 className="font-bold text-indigo-800 mb-2">카테고리 확장 로드맵</h3>
            <p className="text-sm text-indigo-600">
              관계와 라이프 카테고리를 단계적으로 확장하여 바이럴과 수익화를 강화합니다.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CATEGORY_ROADMAP.map((phase) => (
              <RoadmapCard key={phase.phase} phase={phase} />
            ))}
          </div>
        </div>
      )}

      {/* Debates Tab */}
      {activeTab === 'debates' && (
        <div className="space-y-4">
          <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
            <h3 className="font-bold text-purple-800 mb-2">추천 토론 주제</h3>
            <p className="text-sm text-purple-600">
              바이럴 잠재력이 높은 찬반 투표 주제입니다. 관계/라이프 카테고리 특화.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {SUGGESTED_DEBATES.map((debate, idx) => (
              <DebateCard key={idx} debate={debate} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
