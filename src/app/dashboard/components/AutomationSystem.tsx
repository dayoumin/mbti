'use client';

import { useState } from 'react';
import {
  Zap,
  Bot,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Copy,
  Play,
  Search,
  Sparkles,
  Layers,
  Settings,
  BookOpen,
} from 'lucide-react';

// Note: AGENTS and SKILLS are kept for potential future use or external access

// =============================================================================
// Types
// =============================================================================

interface Agent {
  name: string;
  description: string;
  usage: string;
  tools: string[];
  examples: string[];
}

interface Skill {
  name: string;
  description: string;
  role: string;
  triggers: string[];
}

interface WorkflowStep {
  step: number;
  title: string;
  description: string;
  agent?: string;
  manual?: boolean;
}

// =============================================================================
// Data
// =============================================================================

interface AgentSystem {
  name: string;
  color: string;
  agents: Agent[];
}

const AGENT_SYSTEMS: AgentSystem[] = [
  {
    name: '테스트 자동화',
    color: 'purple',
    agents: [
      {
        name: 'test-creator',
        description: '새 테스트 생성 전문가',
        usage: 'research/*.md 기반 테스트 데이터 생성, 7개 파일 수정, 검증까지 완료',
        tools: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'],
        examples: [
          '"whiskey 테스트 만들어"',
          '"research/wine.md 기반으로 테스트 생성해"',
        ],
      },
      {
        name: 'test-improver',
        description: '기존 테스트 품질 개선',
        usage: '경고 수정, 중간점수 추가, 결과 조건 최적화',
        tools: ['Read', 'Write', 'Edit', 'Bash', 'Grep', 'Glob'],
        examples: [
          '"dog 테스트 개선해"',
          '"경고 있는 테스트 전부 수정해"',
        ],
      },
      {
        name: 'research-requester',
        description: '딥리서치 요청문 생성',
        usage: 'ChatGPT/Gemini/Perplexity에 복사할 프롬프트 자동 생성',
        tools: ['Read', 'Write', 'Glob'],
        examples: [
          '"wine 리서치 요청문 만들어"',
          '"고양이 품종 딥리서치 프롬프트 생성해"',
        ],
      },
      {
        name: 'test-auditor',
        description: '품질 자동 점검',
        usage: '전체 테스트 스캔, 문제점 발견, 우선순위 정리',
        tools: ['Read', 'Bash', 'Grep', 'Glob'],
        examples: [
          '"전체 테스트 품질 점검해"',
          '"dog 테스트 상세 점검"',
        ],
      },
    ],
  },
  {
    name: '콘텐츠 자동화',
    color: 'cyan',
    agents: [
      {
        name: 'content-creator',
        description: '퀴즈/투표/토너먼트 생성',
        usage: '카테고리별 콘텐츠 데이터 생성, 검증까지 완료',
        tools: ['Read', 'Write', 'Edit', 'Bash', 'Glob', 'Grep'],
        examples: [
          '"고양이 퀴즈 10개 만들어"',
          '"강아지 월드컵 32강 만들어"',
          '"연애 VS 투표 5개 만들어"',
        ],
      },
      {
        name: 'content-auditor',
        description: '콘텐츠 품질 점검',
        usage: '퀴즈/투표/토너먼트 스캔, 문제점 발견, 개선 우선순위 정리',
        tools: ['Read', 'Bash', 'Grep', 'Glob'],
        examples: [
          '"콘텐츠 품질 점검해"',
          '"고양이 퀴즈 상세 점검"',
          '"토너먼트 검증해"',
        ],
      },
    ],
  },
];

// 기존 호환성을 위한 플랫 배열
const AGENTS: Agent[] = AGENT_SYSTEMS.flatMap(system => system.agents);

interface SkillSystem {
  name: string;
  color: string;
  skills: Skill[];
}

const SKILL_SYSTEMS: SkillSystem[] = [
  {
    name: '테스트 Skills',
    color: 'purple',
    skills: [
      {
        name: 'research-parser',
        description: '리서치 파일 파싱',
        role: 'research/*.md에서 차원/결과/질문 추출',
        triggers: ['리서치 파일 읽기', '테스트 생성 시작'],
      },
      {
        name: 'test-generator',
        description: '테스트 코드 생성',
        role: '파싱된 데이터를 TypeScript 코드로 변환, 7개 파일 수정',
        triggers: ['테스트 생성', '새 테스트 추가'],
      },
      {
        name: 'test-validator',
        description: '검증 및 자동 수정',
        role: 'validate-test-data.mjs + npm build, 에러 자동 수정',
        triggers: ['테스트 생성 후', '테스트 수정 후'],
      },
    ],
  },
  {
    name: '콘텐츠 Skills',
    color: 'cyan',
    skills: [
      {
        name: 'content-workflow',
        description: '★ 콘텐츠 생성 오케스트레이터',
        role: '2개 Agent 순차 호출로 2중 검증: content-creator → content-auditor → 빌드 확인',
        triggers: ['00 컨텐츠 만들자', '퀴즈 만들어줘', '투표 만들어줘', '토너먼트 만들어줘'],
      },
      {
        name: 'fact-collector',
        description: '팩트 수집 및 검증',
        role: 'research/facts/*.md 파일 관리, 웹검색으로 팩트 수집/검증',
        triggers: ['팩트 필요 카테고리 콘텐츠 생성', '팩트 검증 요청'],
      },
      {
        name: 'content-generator',
        description: '콘텐츠 데이터 생성',
        role: '퀴즈/투표/토너먼트 TypeScript 코드 생성',
        triggers: ['퀴즈 생성', '투표 생성', '토너먼트 생성'],
      },
      {
        name: 'content-validator',
        description: '콘텐츠 검증',
        role: 'validate-content-samples.mjs + npm build, 에러 리포트 (팩트 참조 검증 포함)',
        triggers: ['콘텐츠 생성 후', '콘텐츠 수정 후'],
      },
    ],
  },
];

// 기존 호환성을 위한 플랫 배열
const SKILLS: Skill[] = SKILL_SYSTEMS.flatMap(system => system.skills);

const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    step: 1,
    title: '리서치 요청문 생성',
    description: 'ChatGPT/Gemini용 프롬프트 자동 생성',
    agent: 'research-requester',
  },
  {
    step: 2,
    title: '딥리서치 실행',
    description: 'ChatGPT/Gemini에서 리서치 후 결과 복사',
    manual: true,
  },
  {
    step: 3,
    title: '리서치 파일 저장',
    description: 'research/{subject}.md에 결과 저장',
    manual: true,
  },
  {
    step: 4,
    title: '테스트 생성',
    description: '리서치 파싱 → 코드 생성 → 검증',
    agent: 'test-creator',
  },
  {
    step: 5,
    title: '품질 점검',
    description: '전체 테스트 점검 및 우선순위 정리',
    agent: 'test-auditor',
  },
  {
    step: 6,
    title: '개선 작업',
    description: '경고 수정, 품질 향상',
    agent: 'test-improver',
  },
];

const TEST_TYPES = [
  {
    type: 'personality',
    name: '성격 테스트',
    dimensions: '5-6개',
    questions: '차원×3 (15-18)',
    results: '8-16개',
    purpose: '성격/유형 분석',
    examples: ['human', 'cat', 'dog'],
  },
  {
    type: 'matching',
    name: '매칭 테스트',
    dimensions: '4-6개',
    questions: '차원×2-3 (10-15)',
    results: '8-12개',
    purpose: '취향 기반 추천',
    examples: ['coffee', 'alcohol', 'plant'],
  },
  {
    type: 'situation',
    name: '상황 테스트',
    dimensions: '4-6개',
    questions: '차원×2 (10-12)',
    results: '6-10개',
    purpose: '상황별 대처 분석',
    examples: ['conflictStyle'],
  },
];

// =============================================================================
// 콘텐츠 검증 데이터
// =============================================================================

interface ValidationItem {
  type: 'quiz' | 'scenario' | 'poll' | 'situation-reaction' | 'tournament';
  label: string;
  icon: string;
  color: string;
  items: { category: string; count: number }[];
  validationRules: { rule: string; severity: 'error' | 'warning' }[];
}

const CONTENT_VALIDATION_DATA: ValidationItem[] = [
  {
    type: 'quiz',
    label: '지식 퀴즈',
    icon: '🧠',
    color: '#7aa2ff',
    items: [
      { category: 'cat', count: 10 },
    ],
    validationRules: [
      { rule: 'id 필수', severity: 'error' },
      { rule: 'question 필수', severity: 'error' },
      { rule: 'options 최소 2개', severity: 'error' },
      { rule: 'knowledge 타입: isCorrect 1개 필수', severity: 'error' },
      { rule: 'explanation 권장', severity: 'warning' },
      { rule: 'tags 권장', severity: 'warning' },
    ],
  },
  {
    type: 'scenario',
    label: '시나리오 퀴즈',
    icon: '📖',
    color: '#ff6b9d',
    items: [
      { category: 'cat', count: 1 },
    ],
    validationRules: [
      { rule: 'questions 최소 3개', severity: 'error' },
      { rule: 'results 최소 2개', severity: 'error' },
      { rule: '점수 범위 연속성', severity: 'warning' },
      { rule: '최대 점수 일치', severity: 'warning' },
    ],
  },
  {
    type: 'poll',
    label: '투표',
    icon: '📊',
    color: '#55e6c1',
    items: [
      { category: 'cat (vs)', count: 10 },
      { category: 'cat (choice)', count: 5 },
      { category: 'dog (breed)', count: 10 },
    ],
    validationRules: [
      { rule: 'VS 타입: 정확히 2개 옵션', severity: 'error' },
      { rule: 'choice 타입: 3-6개 옵션 권장', severity: 'warning' },
      { rule: 'tags 권장', severity: 'warning' },
    ],
  },
  {
    type: 'situation-reaction',
    label: '상황별 반응',
    icon: '🎭',
    color: '#ffd166',
    items: [
      { category: 'relationship', count: 5 },
      { category: 'work', count: 3 },
      { category: 'social', count: 1 },
      { category: 'awkward', count: 1 },
    ],
    validationRules: [
      { rule: 'id-category 일치 필수', severity: 'error' },
      { rule: 'category 유효값 필수', severity: 'error' },
      { rule: '옵션별 tag 필수', severity: 'error' },
      { rule: 'personalityMapping 권장', severity: 'warning' },
      { rule: 'tags 권장', severity: 'warning' },
    ],
  },
  {
    type: 'tournament',
    label: '토너먼트',
    icon: '🏆',
    color: '#a29bfe',
    items: [],
    validationRules: [
      { rule: 'contestants >= roundSize', severity: 'error' },
      { rule: 'roundSize: 4,8,16,32,64', severity: 'error' },
      { rule: '중복 contestant id 금지', severity: 'error' },
      { rule: 'description 권장', severity: 'warning' },
      { rule: 'funFact 권장', severity: 'warning' },
    ],
  },
];

const VALIDATION_COMMANDS = [
  {
    cmd: 'node scripts/validate-content-samples.mjs',
    desc: '전체 콘텐츠 검증',
    type: 'full',
  },
  {
    cmd: 'node scripts/validate-content-samples.mjs --verbose',
    desc: '상세 검증 결과',
    type: 'verbose',
  },
  {
    cmd: 'node scripts/validate-content-samples.mjs --json',
    desc: 'JSON 형식 출력',
    type: 'json',
  },
];

const CREATION_PROCESS = [
  {
    phase: '1. 계획',
    steps: [
      '테스트 주제 및 유형 결정 (personality/matching/situation)',
      'research-requester로 딥리서치 프롬프트 생성',
      'ChatGPT/Gemini에서 딥리서치 실행',
    ],
  },
  {
    phase: '2. 리서치 정리',
    steps: [
      '딥리서치 결과를 RESEARCH_RESULT.md 형식으로 정리',
      'research/{subject}.md에 저장',
      '차원 5-6개, 결과 8-16개, 질문 예시 포함 확인',
    ],
  },
  {
    phase: '3. 생성',
    steps: [
      'test-creator subagent 호출',
      '자동: 리서치 파싱 → 코드 생성 → 7개 파일 수정',
      '자동: validate-test-data.mjs + npm run build',
    ],
  },
  {
    phase: '4. 검증',
    steps: [
      '에러 0개, 경고 0개 확인',
      '중간점수(3) 40% 이상 확인',
      '모든 결과 도달 가능 확인',
    ],
  },
  {
    phase: '5. 개선 (반복)',
    steps: [
      'test-auditor로 품질 점검',
      'test-improver로 경고 수정',
      '리서치 기반 재설계 (필요시)',
    ],
  },
];

const QUALITY_CRITERIA = [
  { item: '에러 0개', score: 40, required: true },
  { item: '경고 0개', score: 20, required: false },
  { item: '중간점수 비율 40%+', score: 20, required: false },
  { item: '결과 도달률 100%', score: 20, required: false },
];

const RESEARCH_DECISION = {
  required: [
    { type: '심리학/성격 기반', reason: '학술 프레임워크 필요', examples: '사람, 고양이, 강아지 성격' },
    { type: '전문 지식 필요', reason: '분류 체계/풍미 프로필 필요', examples: '위스키, 와인, 커피, 향수' },
  ],
  notRequired: [
    { type: '일상 선택/기분 기반', reason: '상식 수준으로 충분', examples: '라면, 치킨, 간식, 야식' },
    { type: '상황/재미 중심', reason: '창의성이 더 중요', examples: '오늘 뭐 먹지, 주말 활동' },
  ],
  flowchart: `research/{subject}.md 파일이 있나?
├── 있음 → 파싱 후 생성
└── 없음 → 아래 분기
         ├── 명확히 전문 지식 필요 → "딥리서치 먼저 필요합니다" 안내
         ├── 명확히 일상 주제 → 상식 기반으로 바로 생성
         └── 애매함 → 사용자에게 질문 (딥리서치 vs 상식 기반)`,
};

// =============================================================================
// Component
// =============================================================================

export default function AutomationSystem() {
  const [activeTab, setActiveTab] = useState<'overview' | 'agents' | 'skills' | 'workflow' | 'research' | 'process' | 'validation'>('overview');

  const tabs = [
    { key: 'overview', label: '개요', icon: <Layers className="w-4 h-4" /> },
    { key: 'agents', label: 'Subagents', icon: <Bot className="w-4 h-4" /> },
    { key: 'skills', label: 'Skills', icon: <Sparkles className="w-4 h-4" /> },
    { key: 'workflow', label: '워크플로우', icon: <ArrowRight className="w-4 h-4" /> },
    { key: 'research', label: '리서치 판단', icon: <Search className="w-4 h-4" /> },
    { key: 'process', label: '생성 과정', icon: <BookOpen className="w-4 h-4" /> },
    { key: 'validation', label: '콘텐츠 검증', icon: <CheckCircle2 className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="db-card p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/20 flex items-center justify-center">
            <Zap className="w-5 h-5 text-yellow-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold">테스트 자동화 시스템</h2>
            <p className="text-sm opacity-70">Claude Code Subagents & Skills 기반</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                activeTab === tab.key
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'hover:bg-white/5'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* 파일 구조 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              파일 구조
            </h3>
            <pre className="bg-black/30 rounded-lg p-4 text-sm overflow-x-auto">
{`.claude/
├── agents/
│   ├── test-creator.md       # 새 테스트 생성
│   ├── test-improver.md      # 기존 테스트 개선
│   ├── test-auditor.md       # 테스트 품질 점검
│   ├── research-requester.md # 딥리서치 요청문 생성
│   ├── content-creator.md    # 퀴즈/투표/토너먼트 생성
│   └── content-auditor.md    # 콘텐츠 품질 점검 (2중 검증)
│
└── skills/
    ├── content-workflow/     # ★ 콘텐츠 생성 오케스트레이터
    ├── research-parser/      # 리서치 파일 파싱
    ├── test-generator/       # 테스트 코드 생성
    ├── test-validator/       # 테스트 검증 + 자동수정
    ├── fact-collector/       # 팩트 수집/검증
    ├── content-generator/    # 콘텐츠 코드 생성
    └── content-validator/    # 콘텐츠 검증

research/
└── {subject}.md              # 딥리서치 결과 저장

docs/test-creation/
├── RESEARCH_REQUEST.md       # 딥리서치 요청 템플릿
├── RESEARCH_RESULT.md        # 결과 저장 포맷
└── GENERATION_GUIDE.md       # 생성 가이드라인`}
            </pre>
          </div>

          {/* testType별 기준 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-400" />
              testType별 기준
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">유형</th>
                    <th className="text-left py-3 px-4">차원</th>
                    <th className="text-left py-3 px-4">질문</th>
                    <th className="text-left py-3 px-4">결과</th>
                    <th className="text-left py-3 px-4">용도</th>
                    <th className="text-left py-3 px-4">예시</th>
                  </tr>
                </thead>
                <tbody>
                  {TEST_TYPES.map((t) => (
                    <tr key={t.type} className="border-b border-white/5">
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400 text-xs">
                          {t.type}
                        </span>
                      </td>
                      <td className="py-3 px-4">{t.dimensions}</td>
                      <td className="py-3 px-4">{t.questions}</td>
                      <td className="py-3 px-4">{t.results}</td>
                      <td className="py-3 px-4">{t.purpose}</td>
                      <td className="py-3 px-4 opacity-60">{t.examples.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 품질 기준 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              품질 기준 (100점 만점)
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {QUALITY_CRITERIA.map((c) => (
                <div key={c.item} className="bg-black/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    {c.required ? (
                      <AlertCircle className="w-4 h-4 text-red-400" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-400" />
                    )}
                    <span className="text-sm">{c.item}</span>
                  </div>
                  <div className="text-2xl font-bold">{c.score}점</div>
                  <div className="text-xs opacity-60">
                    {c.required ? '필수' : '권장'}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
              <span className="text-yellow-400 font-semibold">목표: 85점 이상</span>
            </div>
          </div>
        </div>
      )}

      {/* Agents Tab */}
      {activeTab === 'agents' && (
        <div className="space-y-6">
          {AGENT_SYSTEMS.map((system) => (
            <div key={system.name} className="space-y-4">
              <h3 className={`text-lg font-semibold flex items-center gap-2 text-${system.color}-400`}>
                <Bot className="w-5 h-5" />
                {system.name}
                <span className="text-xs opacity-60 font-normal">({system.agents.length}개)</span>
              </h3>
              {system.agents.map((agent) => (
                <div key={agent.name} className="db-card p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-${system.color}-500/20 flex items-center justify-center`}>
                        <Bot className={`w-5 h-5 text-${system.color}-400`} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{agent.name}</h3>
                        <p className="text-sm opacity-70">{agent.description}</p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{agent.usage}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-2">Tools</div>
                      <div className="flex flex-wrap gap-1">
                        {agent.tools.map((tool) => (
                          <span
                            key={tool}
                            className="px-2 py-1 bg-blue-500/20 text-blue-400 rounded text-xs"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs uppercase opacity-50 mb-2">사용 예시</div>
                      <div className="space-y-1">
                        {agent.examples.map((ex, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-2 text-sm bg-black/20 rounded px-3 py-2"
                          >
                            <Play className="w-3 h-3 text-green-400" />
                            <code>{ex}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Skills Tab */}
      {activeTab === 'skills' && (
        <div className="space-y-6">
          {SKILL_SYSTEMS.map((system) => (
            <div key={system.name} className="space-y-4">
              <h3 className={`text-lg font-semibold flex items-center gap-2 text-${system.color}-400`}>
                <Sparkles className="w-5 h-5" />
                {system.name}
                <span className="text-xs opacity-60 font-normal">({system.skills.length}개)</span>
              </h3>
              {system.skills.map((skill) => (
                <div key={skill.name} className="db-card p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-xl bg-${system.color}-500/20 flex items-center justify-center`}>
                      <Sparkles className={`w-5 h-5 text-${system.color}-400`} />
                    </div>
                    <div>
                      <h3 className="font-semibold">{skill.name}</h3>
                      <p className="text-sm opacity-70">{skill.description}</p>
                    </div>
                  </div>

                  <p className="text-sm mb-4">{skill.role}</p>

                  <div>
                    <div className="text-xs uppercase opacity-50 mb-2">트리거</div>
                    <div className="flex flex-wrap gap-2">
                      {skill.triggers.map((trigger, i) => (
                        <span
                          key={i}
                          className={`px-3 py-1 bg-${system.color}-500/10 border border-${system.color}-500/20 rounded-full text-xs`}
                        >
                          {trigger}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}

          {/* 전체 아키텍처 */}
          <div className="db-card p-6 bg-gradient-to-r from-blue-500/10 to-green-500/10">
            <h4 className="font-semibold mb-4">Claude Code 전체 아키텍처</h4>
            <pre className="bg-black/30 rounded-lg p-4 text-sm mb-4">
{`┌─────────────────────────────────────────────────────────┐
│                     메인 Claude                          │
│                   (오케스트레이터)                        │
└─────────────────────────────────────────────────────────┘
         │                                    │
         ▼                                    ▼
┌─────────────────┐                  ┌─────────────────┐
│  Skill (지침서)  │                  │  Agent (실행자)  │
│                 │                  │                 │
│ • 순서/조건 정의 │                  │ • 작업 수행      │
│ • 규칙 명시      │                  │ • 결과 반환      │
└─────────────────┘                  └────────┬────────┘
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   MCP 서버들     │
                                     │                 │
                                     │ • DB 조회       │
                                     │ • API 호출      │
                                     │ • 외부 서비스    │
                                     └─────────────────┘`}
            </pre>
            <div className="grid grid-cols-4 gap-2 text-xs">
              <div className="bg-black/20 p-2 rounded text-center">
                <div className="font-medium text-blue-400">메인 Claude</div>
                <div className="opacity-60">Skill 읽고 Agent 호출</div>
              </div>
              <div className="bg-black/20 p-2 rounded text-center">
                <div className="font-medium text-purple-400">Skill</div>
                <div className="opacity-60">워크플로우 정의</div>
              </div>
              <div className="bg-black/20 p-2 rounded text-center">
                <div className="font-medium text-green-400">Agent</div>
                <div className="opacity-60">작업 실행 + MCP 연동</div>
              </div>
              <div className="bg-black/20 p-2 rounded text-center">
                <div className="font-medium text-cyan-400">MCP</div>
                <div className="opacity-60">외부 시스템 접근</div>
              </div>
            </div>

            {/* 오케스트레이션 개념 정리 */}
            <div className="mt-4 p-3 bg-orange-500/10 rounded-lg border border-orange-500/20 text-sm">
              <div className="font-medium text-orange-400 mb-2">"오케스트레이터 Agent" 개념 정리</div>
              <div className="text-xs opacity-80 space-y-1">
                <p>• <strong>일반 AI 용어</strong>: 다른 Agent들을 조율하는 상위 Agent</p>
                <p>• <strong>Claude Code에서</strong>: ❌ 존재하지 않음 (Subagent는 다른 Agent 호출 불가)</p>
                <p>• <strong>Anthropic 연구</strong>: 별도 인프라(Redis 등)로 구현한 다른 시스템</p>
                <p>• <strong>우리 해결책</strong>: Skill이 지침서 역할, 메인 Claude가 오케스트레이터</p>
              </div>
            </div>
          </div>

          <div className="db-card p-6 bg-gradient-to-r from-purple-500/10 to-cyan-500/10">
            <h4 className="font-semibold mb-2">Skill vs Agent 역할</h4>
            <p className="text-sm opacity-70 mb-4">
              Skill = 지침서 (메인 Claude가 읽고 따름), Agent = 독립 실행자 (자체 컨텍스트에서 작업)
            </p>

            {/* 2중 검증 워크플로우 */}
            <div className="mb-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
              <div className="font-medium text-green-400 mb-2">★ 콘텐츠 생성 2중 검증 워크플로우</div>
              <pre className="bg-black/30 rounded-lg p-3 text-sm">
{`사용자: "고양이 컨텐츠 만들자"
        ↓
메인 Claude → content-workflow Skill 읽음
        ↓
Step 1: Task(content-creator) 호출
        ↓ 독립 컨텍스트
Step 2: Task(content-auditor) 호출 ← 2중 검증!
        ↓ 독립 컨텍스트
Step 3: npm run build
        ↓
Step 4: 결과 보고`}
              </pre>
              <p className="text-xs opacity-60 mt-2">
                두 Agent는 독립 컨텍스트에서 실행 → 첫 번째가 놓친 문제를 두 번째가 발견
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <pre className="bg-black/30 rounded-lg p-4 text-sm">
{`test-creator (Subagent)
├── research-parser (Skill)
├── test-generator (Skill)
└── test-validator (Skill)`}
              </pre>
              <pre className="bg-black/30 rounded-lg p-4 text-sm">
{`content-creator (Subagent)
├── fact-collector (Skill)
├── content-generator (Skill)
└── content-validator (Skill)`}
              </pre>
            </div>
            <div className="mt-4 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20 text-sm">
              <div className="font-medium text-blue-400 mb-1">팩트 필요 카테고리</div>
              <code className="text-xs">cat, dog, rabbit, hamster, plant, coffee, alcohol</code>
              <p className="text-xs opacity-60 mt-1">
                이 카테고리의 지식 퀴즈는 반드시 fact-collector 스킬을 통해 팩트를 수집/참조해야 합니다.
              </p>
            </div>

            {/* 핵심 발견 */}
            <div className="mt-4 p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20 text-sm">
              <div className="font-medium text-yellow-400 mb-1">2024-12-25 실험 결과</div>
              <ul className="text-xs opacity-80 space-y-1">
                <li>• Subagent는 다른 Subagent 호출 불가 (공식 문서 명시)</li>
                <li>• <strong>Subagent에 "Agent 호출 기능" 없음</strong> → 기술적으로 불가</li>
                <li>• Subagent는 Skill 지침서는 읽을 수 있음</li>
                <li>• 메인 Claude만 Agent를 호출할 수 있음</li>
              </ul>
            </div>

            {/* 호출 권한 비교 */}
            <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20 text-sm">
              <div className="font-medium text-purple-400 mb-2">누가 뭘 호출할 수 있나?</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="bg-black/20 p-2 rounded text-center">
                  <div className="font-medium">메인 Claude</div>
                  <div className="opacity-60">Agent ✅ Skill ✅</div>
                </div>
                <div className="bg-black/20 p-2 rounded text-center">
                  <div className="font-medium">Subagent</div>
                  <div className="opacity-60">Agent ❌ Skill ✅</div>
                </div>
                <div className="bg-black/20 p-2 rounded text-center">
                  <div className="font-medium">Skill 지침서</div>
                  <div className="opacity-60">(메인이 읽고 실행)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Workflow Tab */}
      {activeTab === 'workflow' && (
        <div className="space-y-6">
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-6">전체 워크플로우</h3>
            <div className="space-y-4">
              {WORKFLOW_STEPS.map((step, idx) => (
                <div key={step.step} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step.manual
                          ? 'bg-orange-500/20 text-orange-400'
                          : 'bg-green-500/20 text-green-400'
                      }`}
                    >
                      {step.step}
                    </div>
                    {idx < WORKFLOW_STEPS.length - 1 && (
                      <div className="w-0.5 h-full bg-white/10 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold">{step.title}</h4>
                      {step.manual ? (
                        <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded text-xs">
                          수동
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-green-500/20 text-green-400 rounded text-xs">
                          자동
                        </span>
                      )}
                    </div>
                    <p className="text-sm opacity-70">{step.description}</p>
                    {step.agent && (
                      <div className="mt-2 flex items-center gap-2 text-xs">
                        <Bot className="w-3 h-3 text-purple-400" />
                        <code className="text-purple-400">{step.agent}</code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Commands */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4">빠른 명령어</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { cmd: '"wine 리서치 요청문 만들어"', desc: '딥리서치 프롬프트 생성' },
                { cmd: '"wine 테스트 만들어"', desc: '테스트 자동 생성' },
                { cmd: '"전체 테스트 점검해"', desc: '품질 점검' },
                { cmd: '"dog 테스트 개선해"', desc: '기존 테스트 개선' },
              ].map((item) => (
                <div
                  key={item.cmd}
                  className="flex items-center justify-between bg-black/20 rounded-lg p-4"
                >
                  <div>
                    <code className="text-green-400">{item.cmd}</code>
                    <p className="text-xs opacity-60 mt-1">{item.desc}</p>
                  </div>
                  <Copy className="w-4 h-4 opacity-40 hover:opacity-100 cursor-pointer" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Research Decision Tab */}
      {activeTab === 'research' && (
        <div className="space-y-6">
          {/* 리서치 필요 여부 판단 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-blue-400" />
              리서치 필요 여부 판단
            </h3>
            <p className="text-sm opacity-70 mb-6">
              test-creator는 주제에 따라 딥리서치가 필요한지 자동으로 판단합니다.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* 리서치 필요 */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-red-400 mb-3 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  딥리서치 필요
                </h4>
                <div className="space-y-3">
                  {RESEARCH_DECISION.required.map((item) => (
                    <div key={item.type} className="text-sm">
                      <div className="font-medium">{item.type}</div>
                      <div className="opacity-60">{item.reason}</div>
                      <div className="text-xs text-red-400 mt-1">예: {item.examples}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 리서치 불필요 */}
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                <h4 className="font-semibold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  상식 기반 생성 가능
                </h4>
                <div className="space-y-3">
                  {RESEARCH_DECISION.notRequired.map((item) => (
                    <div key={item.type} className="text-sm">
                      <div className="font-medium">{item.type}</div>
                      <div className="opacity-60">{item.reason}</div>
                      <div className="text-xs text-green-400 mt-1">예: {item.examples}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 판단 흐름도 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ArrowRight className="w-5 h-5 text-purple-400" />
              판단 흐름도
            </h3>
            <pre className="bg-black/30 rounded-lg p-4 text-sm overflow-x-auto">
              {RESEARCH_DECISION.flowchart}
            </pre>
          </div>

          {/* 테스트 케이스 결과 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              검증된 테스트 케이스
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4">주제</th>
                    <th className="text-left py-3 px-4">유형</th>
                    <th className="text-left py-3 px-4">판단 결과</th>
                    <th className="text-left py-3 px-4">상태</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { subject: 'whiskey-sample', type: '리서치 파일 있음', result: '파싱 후 생성', status: '✅' },
                    { subject: 'ramen', type: '일상 음식', result: '상식 기반 생성', status: '✅' },
                    { subject: 'wine', type: '전문 지식', result: '딥리서치 필요 안내', status: '✅' },
                    { subject: 'pasta', type: '애매함', result: '사용자에게 선택 요청', status: '✅' },
                    { subject: 'weekend', type: '상황/재미', result: '상식 기반 생성', status: '✅' },
                  ].map((item) => (
                    <tr key={item.subject} className="border-b border-white/5">
                      <td className="py-3 px-4">
                        <code className="text-purple-400">{item.subject}</code>
                      </td>
                      <td className="py-3 px-4 opacity-70">{item.type}</td>
                      <td className="py-3 px-4">{item.result}</td>
                      <td className="py-3 px-4">{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs opacity-50 mt-4">
              * 2024-12-23 test-creator agent로 5개 케이스 테스트 통과
            </p>
          </div>

          {/* 상식 기반 생성 규칙 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4">상식 기반 생성 시 규칙</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold opacity-70 mb-2">기본 설정</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>testType</span>
                    <code className="text-blue-400">matching</code>
                  </div>
                  <div className="flex justify-between">
                    <span>차원</span>
                    <span>4-5개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>질문</span>
                    <span>10-12개</span>
                  </div>
                  <div className="flex justify-between">
                    <span>결과</span>
                    <span>8-10개 (실제 상품/메뉴)</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-semibold opacity-70 mb-2">예시 차원 (라면)</h4>
                <pre className="bg-black/30 rounded-lg p-3 text-xs">
{`spicy: 매움 (순한맛 ↔ 불닭급)
soup: 국물 (볶음면 ↔ 국물면)
hunger: 배고픔 (간단히 ↔ 든든하게)
mood: 기분 (평범한 날 ↔ 특별한 날)`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Tab */}
      {activeTab === 'process' && (
        <div className="space-y-4">
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-2">테스트 생성 과정</h3>
            <p className="text-sm opacity-70 mb-6">
              이 과정을 따라 시행착오를 줄이고 일관된 품질의 테스트를 생성합니다.
            </p>

            {CREATION_PROCESS.map((phase, idx) => (
              <div key={phase.phase} className="mb-6 last:mb-0">
                <h4 className="font-semibold text-yellow-400 mb-3">{phase.phase}</h4>
                <div className="space-y-2 pl-4 border-l-2 border-yellow-500/30">
                  {phase.steps.map((step, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Lessons Learned */}
          <div className="db-card p-6 bg-gradient-to-r from-red-500/10 to-orange-500/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-400" />
              주의사항 (시행착오에서 배운 것)
            </h3>
            <div className="space-y-3">
              {[
                'testType별 수치가 다름 - 고정값 사용 금지',
                'condition: {} 사용 시 결과 도달 불가',
                '중간점수(3) 40% 이상 필수 - MEDIUM 레벨 도달용',
                'mood는 happy/cool/excited/calm 중 선택',
                '리서치 파일 없이 테스트 생성 금지',
                '검증 없이 작업 완료 보고 금지',
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-sm">
                  <AlertCircle className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Validation Tab */}
      {activeTab === 'validation' && (
        <div className="space-y-6">
          {/* 검증 개요 */}
          <div className="db-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold">콘텐츠 검증 시스템</h3>
                <p className="text-sm opacity-70">퀴즈/투표/토너먼트/상황별 반응 콘텐츠 품질 검증</p>
              </div>
            </div>

            <div className="grid grid-cols-5 gap-4 mt-6">
              {CONTENT_VALIDATION_DATA.map((item) => {
                const totalCount = item.items.reduce((sum, i) => sum + i.count, 0);
                return (
                  <div
                    key={item.type}
                    className="p-4 rounded-xl text-center"
                    style={{ background: `${item.color}15` }}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="text-2xl font-bold mt-2" style={{ color: item.color }}>
                      {totalCount}
                    </div>
                    <div className="text-xs opacity-70">{item.label}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 타입별 상세 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4">타입별 검증 규칙</h3>
            <div className="space-y-4">
              {CONTENT_VALIDATION_DATA.map((item) => (
                <div
                  key={item.type}
                  className="p-4 rounded-xl"
                  style={{ background: 'rgba(0,0,0,0.3)', borderLeft: `3px solid ${item.color}` }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <h4 className="font-semibold">{item.label}</h4>
                        <p className="text-xs opacity-60">
                          {item.items.length > 0
                            ? item.items.map(i => `${i.category}: ${i.count}개`).join(' · ')
                            : '샘플 없음'
                          }
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <span className="px-2 py-1 rounded text-xs bg-red-500/20 text-red-400">
                        에러 {item.validationRules.filter(r => r.severity === 'error').length}
                      </span>
                      <span className="px-2 py-1 rounded text-xs bg-yellow-500/20 text-yellow-400">
                        경고 {item.validationRules.filter(r => r.severity === 'warning').length}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {item.validationRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 text-sm"
                      >
                        {rule.severity === 'error' ? (
                          <AlertCircle className="w-3 h-3 text-red-400 flex-shrink-0" />
                        ) : (
                          <AlertCircle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                        )}
                        <span className="opacity-80">{rule.rule}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 상황별 반응 투표 상세 */}
          <div className="db-card p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <span className="text-xl">🎭</span>
              상황별 반응 투표 (Situation-Reaction)
            </h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-sm font-semibold opacity-70 mb-3">카테고리</h4>
                <div className="space-y-2">
                  {[
                    { id: 'relationship', name: '연애/이별', emoji: '💕', desc: '연애, 이별, 썸, 전애인' },
                    { id: 'work', name: '직장', emoji: '💼', desc: '상사, 동료, 회의, 회식' },
                    { id: 'social', name: '사회생활', emoji: '👥', desc: '친구 모임, SNS, 파티' },
                    { id: 'awkward', name: '어색한 순간', emoji: '😅', desc: '민망한 상황, 뻘쭘함' },
                  ].map((cat) => (
                    <div
                      key={cat.id}
                      className="flex items-center gap-3 p-2 rounded-lg bg-black/20"
                    >
                      <span className="text-lg">{cat.emoji}</span>
                      <div>
                        <div className="font-medium text-sm">{cat.name}</div>
                        <div className="text-xs opacity-60">{cat.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-semibold opacity-70 mb-3">반응 태그 (ReactionTag)</h4>
                <div className="flex flex-wrap gap-2">
                  {[
                    { tag: 'cool', desc: '쿨한' },
                    { tag: 'emotional', desc: '감정적' },
                    { tag: 'rational', desc: '이성적' },
                    { tag: 'avoidant', desc: '회피형' },
                    { tag: 'confrontational', desc: '대립형' },
                    { tag: 'humorous', desc: '유머러스' },
                    { tag: 'caring', desc: '배려형' },
                    { tag: 'passive', desc: '수동적' },
                  ].map((t) => (
                    <span
                      key={t.tag}
                      className="px-3 py-1 rounded-full text-xs bg-yellow-500/20 text-yellow-400"
                    >
                      {t.tag} ({t.desc})
                    </span>
                  ))}
                </div>

                <h4 className="text-sm font-semibold opacity-70 mt-4 mb-2">ID 형식</h4>
                <code className="text-xs bg-black/30 px-3 py-2 rounded block">
                  situation-reaction-{'{category}'}-{'{번호}'}
                </code>
                <p className="text-xs opacity-60 mt-1">
                  예: situation-reaction-relationship-001
                </p>
              </div>
            </div>
          </div>

          {/* 검증 명령어 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Play className="w-5 h-5 text-green-400" />
              검증 명령어
            </h3>
            <div className="grid md:grid-cols-3 gap-4">
              {VALIDATION_COMMANDS.map((cmd) => (
                <div
                  key={cmd.type}
                  className="bg-black/20 rounded-lg p-4"
                >
                  <code className="text-sm text-green-400 block mb-2">{cmd.cmd}</code>
                  <p className="text-xs opacity-60">{cmd.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <h4 className="font-semibold text-blue-400 mb-2">검증 스크립트 2종</h4>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <code className="text-blue-400">validate-test-data.mjs</code>
                  <p className="text-xs opacity-60 mt-1">성격/매칭 테스트 검증 (src/data/subjects/)</p>
                </div>
                <div>
                  <code className="text-blue-400">validate-content-samples.mjs</code>
                  <p className="text-xs opacity-60 mt-1">콘텐츠 샘플 검증 (퀴즈/투표/토너먼트)</p>
                </div>
              </div>
            </div>
          </div>

          {/* 검증 플로우 */}
          <div className="db-card p-6">
            <h3 className="text-lg font-semibold mb-4">콘텐츠 생성 → 검증 플로우</h3>
            <div className="flex items-center justify-between">
              {[
                { step: '1', title: '콘텐츠 생성', desc: 'content-creator 실행', color: '#7aa2ff' },
                { step: '2', title: '자체 검증', desc: '팩트체크, 일관성', color: '#55e6c1' },
                { step: '3', title: '파일 저장', desc: 'content-samples.ts', color: '#ffd166' },
                { step: '4', title: '스크립트 검증', desc: 'validate-content-samples', color: '#ff6b9d' },
                { step: '5', title: '빌드 확인', desc: 'npm run build', color: '#a29bfe' },
              ].map((item, idx, arr) => (
                <div key={item.step} className="flex items-center">
                  <div className="text-center">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-2 mx-auto"
                      style={{ background: `${item.color}20` }}
                    >
                      <span className="text-lg font-bold" style={{ color: item.color }}>
                        {item.step}
                      </span>
                    </div>
                    <p className="text-xs font-medium">{item.title}</p>
                    <p className="text-xs opacity-60">{item.desc}</p>
                  </div>
                  {idx < arr.length - 1 && (
                    <ArrowRight className="w-4 h-4 opacity-30 mx-2" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
