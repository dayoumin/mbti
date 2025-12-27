'use client';

// ============================================================================
// 개발자 가이드 - AI 도구 사용법 (스킬/에이전트)
// ============================================================================

import { useState } from 'react';
import {
  Zap,
  Bot,
  ChevronDown,
  ChevronRight,
  Terminal,
  Lightbulb,
  CheckCircle,
  FileText,
  Search,
  Wrench,
  Sparkles,
} from 'lucide-react';

// ============================================================================
// 데이터 정의
// ============================================================================

type ToolCategory = 'test' | 'content' | 'quality' | 'idea' | 'research';

interface ToolInfo {
  id: string;
  name: string;
  type: 'agent' | 'skill';
  category: ToolCategory;
  description: string;
  whenToUse: string[];
  examples: string[];
  inputs?: string[];
  outputs?: string[];
  relatedTools?: string[];
}

const CATEGORIES: { key: ToolCategory; name: string; emoji: string; color: string }[] = [
  { key: 'test', name: 'MBTI 테스트', emoji: '🧪', color: 'bg-purple-100 text-purple-700' },
  { key: 'content', name: '콘텐츠 (퀴즈/투표)', emoji: '📝', color: 'bg-blue-100 text-blue-700' },
  { key: 'quality', name: '품질 관리', emoji: '✅', color: 'bg-green-100 text-green-700' },
  { key: 'idea', name: '아이디어 관리', emoji: '💡', color: 'bg-yellow-100 text-yellow-700' },
  { key: 'research', name: '리서치/팩트', emoji: '🔍', color: 'bg-orange-100 text-orange-700' },
];

const TOOLS: ToolInfo[] = [
  // === 테스트 관련 ===
  {
    id: 'test-creator',
    name: 'test-creator',
    type: 'agent',
    category: 'test',
    description: 'MBTI 테스트 생성 전문가. 리서치 파일 기반 테스트 데이터 생성, 8개 파일 수정, 자동 검증까지 완료.',
    whenToUse: [
      '새 테스트를 추가할 때',
      'research/*.md 파일 기반 테스트 생성',
      'subjects/*.ts 신규 생성 필요할 때',
    ],
    examples: [
      '"test-creator로 whiskey 테스트 만들어"',
      '"research/wine.md 기반으로 테스트 생성해줘"',
    ],
    inputs: ['research/{subject}.md 리서치 파일'],
    outputs: [
      'src/data/subjects/{subject}.ts',
      'types.ts, config.ts, index.ts 수정',
      'Icons.js, dashboard 수정',
    ],
    relatedTools: ['research-parser', 'test-generator', 'test-validator'],
  },
  {
    id: 'test-improver',
    name: 'test-improver',
    type: 'agent',
    category: 'test',
    description: '기존 MBTI 테스트 품질 개선. 경고 수정, 중간점수 추가, 결과 조건 최적화.',
    whenToUse: [
      '기존 테스트에 경고가 있을 때',
      '중간점수(3) 옵션이 부족할 때',
      'condition 조건 수정 필요할 때',
    ],
    examples: [
      '"test-improver로 dog 테스트 개선해"',
      '"경고 있는 테스트 전부 수정해줘"',
    ],
    relatedTools: ['test-validator'],
  },
  {
    id: 'test-auditor',
    name: 'test-auditor',
    type: 'agent',
    category: 'quality',
    description: '전체 테스트 품질 자동 점검. 모든 테스트 스캔, 문제점 발견, 우선순위 정리.',
    whenToUse: [
      '전체 테스트 상태 파악',
      '품질 점검 리포트 필요',
      '어떤 테스트부터 수정할지 결정',
    ],
    examples: [
      '"전체 테스트 품질 점검해줘"',
      '"테스트 상태 리포트 만들어줘"',
    ],
    outputs: ['품질 리포트 (에러/경고 요약, 우선순위별 정리)'],
  },
  {
    id: 'test-generator',
    name: 'test-generator',
    type: 'skill',
    category: 'test',
    description: '파싱된 리서치 데이터 기반 TypeScript 테스트 데이터 파일 생성.',
    whenToUse: [
      'test-creator Agent 내부에서 자동 호출',
      'subjects/*.ts 파일 생성',
    ],
    examples: [
      '/test-generator whiskey',
    ],
  },
  {
    id: 'test-validator',
    name: 'test-validator',
    type: 'skill',
    category: 'quality',
    description: '테스트 데이터 검증 및 자동 수정. validate-test-data.mjs 실행, 빌드 확인, 에러 자동 수정.',
    whenToUse: [
      '테스트 생성/수정 후 검증',
      '빌드 에러 자동 수정',
    ],
    examples: [
      '/test-validator whiskey',
    ],
  },

  // === 콘텐츠 관련 ===
  {
    id: 'content-creator',
    name: 'content-creator',
    type: 'agent',
    category: 'content',
    description: '퀴즈/투표/상황반응 콘텐츠 생성. 팩트 확인, 데이터 생성, 자체 검증까지.',
    whenToUse: [
      '지식 퀴즈 생성',
      'VS 투표 생성',
      '상황별 반응 투표 생성',
      '토너먼트/월드컵 생성',
    ],
    examples: [
      '"고양이 퀴즈 10개 만들어줘"',
      '"연애 VS 투표 5개 만들어줘"',
      '"이별 상황 반응 투표 만들어줘"',
      '"강아지 품종 월드컵 32강 만들어줘"',
    ],
    outputs: [
      'src/data/content/quizzes/*.ts',
      'src/data/content/polls/*.ts',
      'src/data/content/situation-reactions/*.ts',
    ],
    relatedTools: ['content-generator', 'content-validator', 'fact-collector'],
  },
  {
    id: 'content-quality-checker',
    name: 'content-quality-checker',
    type: 'agent',
    category: 'quality',
    description: '기존 퀴즈/투표/토너먼트 품질 점검 (2중 검증). 전체 콘텐츠 스캔, 문제점 발견, 개선 우선순위 정리.',
    whenToUse: [
      '콘텐츠 생성 후 2차 검증',
      '전체 콘텐츠 품질 점검',
      '연령 등급/태그 일관성 확인',
    ],
    examples: [
      '"콘텐츠 품질 점검해줘"',
      '"방금 생성된 cat 콘텐츠 검증해줘"',
    ],
    outputs: ['품질 리포트 (에러/경고 요약)'],
    relatedTools: ['content-audit-rules'],
  },
  {
    id: 'content-workflow',
    name: 'content-workflow',
    type: 'skill',
    category: 'content',
    description: '콘텐츠 생성 전체 워크플로우. 2개 Agent 순차 호출로 2중 검증 보장.',
    whenToUse: [
      '"컨텐츠 만들자" 요청 시',
      '퀴즈/투표 생성 요청 시',
      '자동으로 2중 검증이 필요할 때',
    ],
    examples: [
      '/content-workflow',
      '"고양이 컨텐츠 만들자"',
    ],
  },
  {
    id: 'content-generator',
    name: 'content-generator',
    type: 'skill',
    category: 'content',
    description: '퀴즈/투표/토너먼트 콘텐츠 데이터 생성.',
    whenToUse: [
      'content-creator Agent 내부에서 자동 호출',
      '특정 타입/카테고리 콘텐츠 직접 생성',
    ],
    examples: [
      '/content-generator',
    ],
  },
  {
    id: 'content-validator',
    name: 'content-validator',
    type: 'skill',
    category: 'quality',
    description: '생성된 콘텐츠의 형식/필수필드 검증.',
    whenToUse: [
      'content-creator Agent 내부에서 자동 호출',
      '콘텐츠 저장 전 유효성 검사',
    ],
    examples: [
      '/content-validator',
    ],
  },
  {
    id: 'content-audit-rules',
    name: 'content-audit-rules',
    type: 'skill',
    category: 'quality',
    description: '콘텐츠 품질 점검 규칙. 연령 등급, 태그, 형식 검사 기준 정의.',
    whenToUse: [
      'content-quality-checker Agent가 참조',
      '품질 기준 확인 필요시',
    ],
    examples: [],
  },

  // === 아이디어 관리 ===
  {
    id: 'idea-manager',
    name: 'idea-manager',
    type: 'agent',
    category: 'idea',
    description: '아이디어 뱅크 관리. 아이디어 추가, 상태 변경, 테마 관리.',
    whenToUse: [
      '새 아이디어 추가',
      '아이디어 상태 변경 (idea → planning → ready 등)',
      '새 테마 추가',
    ],
    examples: [
      '"심리테스트에 MBTI 궁합 아이디어 추가해줘"',
      '"애니 월드컵을 planning으로 변경"',
      '"음식 밸런스 게임 완료 처리"',
    ],
    outputs: [
      'src/data/ideas/{theme}.json 수정',
    ],
  },

  // === 기능 개발 ===
  {
    id: 'feature-developer',
    name: 'feature-developer',
    type: 'agent',
    category: 'idea',
    description: '새 기능 개발 전문가. 서비스/컴포넌트/데이터 구조 변경이 필요한 기능 추가.',
    whenToUse: [
      '새 서비스/기능 개발',
      '기존 기능 확장',
      '아키텍처 변경',
    ],
    examples: [
      '"프로필에 16유형 추가해줘"',
      '"새 서비스 만들어줘"',
    ],
  },

  // === 리서치 ===
  {
    id: 'research-requester',
    name: 'research-requester',
    type: 'agent',
    category: 'research',
    description: '딥리서치 요청문 자동 생성. 새 테스트를 위한 ChatGPT/Gemini/Perplexity 딥리서치 프롬프트 작성.',
    whenToUse: [
      '새 테스트 주제 리서치 필요',
      '전문 지식 기반 테스트 기획',
    ],
    examples: [
      '"whiskey 테스트 리서치 요청문 만들어줘"',
    ],
    outputs: ['딥리서치 프롬프트 (복사해서 사용)'],
  },
  {
    id: 'research-parser',
    name: 'research-parser',
    type: 'skill',
    category: 'research',
    description: '딥리서치 결과 파일(research/*.md) 파싱. 차원/결과/질문 데이터 추출.',
    whenToUse: [
      'test-creator Agent 내부에서 자동 호출',
      '리서치 파일 분석',
    ],
    examples: [
      '/research-parser whiskey',
    ],
    inputs: ['research/{subject}.md'],
    outputs: ['구조화된 데이터 (차원, 결과, 질문 예시)'],
  },
  {
    id: 'fact-collector',
    name: 'fact-collector',
    type: 'skill',
    category: 'research',
    description: '웹검색으로 검증된 팩트 수집. 수의학/식물학/식품 정보 등 정확도가 필요한 팩트 수집 후 저장.',
    whenToUse: [
      '동물 관련 퀴즈 생성 시',
      '신뢰할 수 있는 정보 필요 시',
      '팩트 파일(research/facts/*.md) 업데이트',
    ],
    examples: [
      '/fact-collector cat',
    ],
    outputs: ['research/facts/{category}.md'],
  },
];

// ============================================================================
// 컴포넌트
// ============================================================================

interface ToolCardProps {
  tool: ToolInfo;
  expanded: boolean;
  onToggle: () => void;
}

function ToolCard({ tool, expanded, onToggle }: ToolCardProps) {
  const isAgent = tool.type === 'agent';

  return (
    <div className="bg-slate-50 rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      <button
        onClick={onToggle}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className={`p-2 rounded-lg ${isAgent ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
            {isAgent ? <Bot className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{tool.name}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded ${isAgent ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                {isAgent ? 'Agent' : 'Skill'}
              </span>
            </div>
            <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{tool.description}</p>
          </div>
        </div>
        {expanded ? <ChevronDown className="w-5 h-5 text-gray-400" /> : <ChevronRight className="w-5 h-5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 space-y-4">
          {/* 언제 사용하나 */}
          <div>
            <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
              <Lightbulb className="w-4 h-4 text-yellow-500" />
              언제 사용하나
            </h4>
            <ul className="text-sm text-gray-600 space-y-1">
              {tool.whenToUse.map((use, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {use}
                </li>
              ))}
            </ul>
          </div>

          {/* 사용 예시 */}
          {tool.examples.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 flex items-center gap-1.5 mb-2">
                <Terminal className="w-4 h-4 text-gray-500" />
                사용 예시
              </h4>
              <div className="space-y-1">
                {tool.examples.map((ex, i) => (
                  <code key={i} className="block text-sm bg-gray-800 text-green-400 px-3 py-1.5 rounded">
                    {ex}
                  </code>
                ))}
              </div>
            </div>
          )}

          {/* 입력/출력 */}
          <div className="flex gap-4">
            {tool.inputs && (
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-700 mb-1">📥 입력</h4>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {tool.inputs.map((input, i) => (
                    <li key={i}>• {input}</li>
                  ))}
                </ul>
              </div>
            )}
            {tool.outputs && (
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-700 mb-1">📤 출력</h4>
                <ul className="text-xs text-gray-600 space-y-0.5">
                  {tool.outputs.map((output, i) => (
                    <li key={i}>• {output}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 관련 도구 */}
          {tool.relatedTools && tool.relatedTools.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">🔗 관련 도구</h4>
              <div className="flex flex-wrap gap-1">
                {tool.relatedTools.map(related => (
                  <span key={related} className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                    {related}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function DeveloperGuide() {
  const [selectedCategory, setSelectedCategory] = useState<ToolCategory | 'all'>('all');
  const [expandedTools, setExpandedTools] = useState<Set<string>>(new Set());

  const filteredTools = selectedCategory === 'all'
    ? TOOLS
    : TOOLS.filter(t => t.category === selectedCategory);

  const agents = filteredTools.filter(t => t.type === 'agent');
  const skills = filteredTools.filter(t => t.type === 'skill');

  const toggleTool = (id: string) => {
    const newSet = new Set(expandedTools);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedTools(newSet);
  };

  const expandAll = () => {
    setExpandedTools(new Set(filteredTools.map(t => t.id)));
  };

  const collapseAll = () => {
    setExpandedTools(new Set());
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI 도구 가이드</h2>
          <p className="text-gray-500 mt-1">
            {agents.length}개 Agent · {skills.length}개 Skill
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={expandAll}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            모두 펼치기
          </button>
          <button
            onClick={collapseAll}
            className="px-3 py-1.5 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            모두 접기
          </button>
        </div>
      </div>

      {/* Agent vs Skill 설명 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Bot className="w-5 h-5 text-purple-600" />
            <h3 className="font-semibold text-purple-900">Agent (에이전트)</h3>
          </div>
          <p className="text-sm text-purple-700">
            복잡한 작업을 자율적으로 처리하는 AI 비서. 여러 도구를 조합해 작업 완료까지 진행.
          </p>
          <p className="text-xs text-purple-600 mt-2">
            <strong>호출:</strong> "~로 ○○ 해줘" 또는 Task tool 사용
          </p>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-blue-900">Skill (스킬)</h3>
          </div>
          <p className="text-sm text-blue-700">
            단일 작업에 특화된 명령어. Agent 내부에서 호출되거나, /skill-name으로 직접 실행.
          </p>
          <p className="text-xs text-blue-600 mt-2">
            <strong>호출:</strong> /스킬이름 또는 Agent가 자동 호출
          </p>
        </div>
      </div>

      {/* 카테고리 필터 */}
      <div className="flex items-center gap-2 flex-wrap">
        <Search className="w-4 h-4 text-gray-400" />
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
        >
          전체
        </button>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${selectedCategory === cat.key ? cat.color : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {cat.emoji} {cat.name}
          </button>
        ))}
      </div>

      {/* 도구 목록 */}
      <div className="space-y-6">
        {/* Agents */}
        {agents.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-purple-600" />
              Agents ({agents.length})
            </h3>
            <div className="space-y-2">
              {agents.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  expanded={expandedTools.has(tool.id)}
                  onToggle={() => toggleTool(tool.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Skills */}
        {skills.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-blue-600" />
              Skills ({skills.length})
            </h3>
            <div className="space-y-2">
              {skills.map(tool => (
                <ToolCard
                  key={tool.id}
                  tool={tool}
                  expanded={expandedTools.has(tool.id)}
                  onToggle={() => toggleTool(tool.id)}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 워크플로우 가이드 */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          추천 워크플로우
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 테스트 생성 워크플로우 */}
          <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">🧪 새 MBTI 테스트 추가</h4>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-purple-100 text-purple-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">1</span>
                <span><code className="bg-gray-100 px-1 rounded">research-requester</code>로 딥리서치 요청문 생성</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-purple-100 text-purple-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">2</span>
                <span>ChatGPT/Gemini에서 리서치 실행 → research/*.md 저장</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-purple-100 text-purple-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">3</span>
                <span><code className="bg-gray-100 px-1 rounded">test-creator</code>로 테스트 생성 (자동 검증)</span>
              </li>
            </ol>
          </div>

          {/* 콘텐츠 생성 워크플로우 */}
          <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">📝 퀴즈/투표 생성</h4>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">1</span>
                <span>"고양이 퀴즈 10개 만들어줘" 요청</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">2</span>
                <span><code className="bg-gray-100 px-1 rounded">content-creator</code> → 생성 + 1차 검증</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-blue-100 text-blue-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">3</span>
                <span><code className="bg-gray-100 px-1 rounded">content-quality-checker</code> → 2차 검증</span>
              </li>
            </ol>
          </div>

          {/* 품질 관리 워크플로우 */}
          <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">✅ 품질 점검</h4>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-green-100 text-green-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">1</span>
                <span><code className="bg-gray-100 px-1 rounded">test-auditor</code>로 테스트 전체 점검</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-100 text-green-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">2</span>
                <span>우선순위 높은 것부터 <code className="bg-gray-100 px-1 rounded">test-improver</code>로 개선</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-green-100 text-green-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">3</span>
                <span><code className="bg-gray-100 px-1 rounded">content-quality-checker</code>로 콘텐츠 점검</span>
              </li>
            </ol>
          </div>

          {/* 아이디어 관리 */}
          <div className="bg-slate-50 rounded-lg p-4 border border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">💡 아이디어 관리</h4>
            <ol className="text-sm text-gray-600 space-y-2">
              <li className="flex items-start gap-2">
                <span className="bg-yellow-100 text-yellow-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">1</span>
                <span>"심리테스트에 ○○ 추가해줘" 요청</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-yellow-100 text-yellow-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">2</span>
                <span><code className="bg-gray-100 px-1 rounded">idea-manager</code>가 JSON 자동 수정</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="bg-yellow-100 text-yellow-700 w-5 h-5 rounded-full text-xs flex items-center justify-center flex-shrink-0">3</span>
                <span>아이디어 파이프라인에서 진행 현황 확인</span>
              </li>
            </ol>
          </div>
        </div>
      </div>

      {/* 파일 위치 안내 */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
        <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          도구 정의 파일 위치
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
          <div>
            <span className="text-purple-600 font-medium">Agents:</span>
            <code className="ml-2 bg-gray-200 px-1 rounded">.claude/agents/*.md</code>
          </div>
          <div>
            <span className="text-blue-600 font-medium">Skills:</span>
            <code className="ml-2 bg-gray-200 px-1 rounded">.claude/skills/*/SKILL.md</code>
          </div>
        </div>
      </div>
    </div>
  );
}
