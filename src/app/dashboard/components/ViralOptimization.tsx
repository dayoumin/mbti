'use client';

import { TrendingUp, CheckCircle2, Share2, Zap, Target, BarChart3, Circle } from 'lucide-react';
import { useLocalStorage } from '@/utils/useLocalStorage';

/**
 * 바이럴 최적화 전략
 * 2025년 시장 리서치 기반 실행 계획 + 진행 현황 추적
 */

// 기본 진행 상황 (초기값)
const DEFAULT_PROGRESS = {
  phase1: [
    { id: 'p1-1', title: '타입명 최우선 표시 (dimension 분석 앞)', completed: true },
    { id: 'p1-2', title: '상세 분석 접기/펼치기 (기본 접힌 상태)', completed: true },
    { id: 'p1-3', title: '공유 이미지 자동 생성 (Canvas API)', completed: true },
    { id: 'p1-4', title: '긍정적 프레이밍 전체 적용 (12개 테스트, 25개 용어)', completed: true },
    { id: 'p1-5', title: '모바일 UI 점검 (375px 이하)', completed: false },
  ],
  phase2: [
    { id: 'p2-1', title: 'Stage 7 AI 리포트 실구현', completed: false },
    { id: 'p2-2', title: '응답 시간 수집 인프라', completed: false },
    { id: 'p2-3', title: '확신도 가중치 계산 로직', completed: false },
    { id: 'p2-4', title: '태그 매핑 60개 → 100개 확대', completed: false },
    { id: 'p2-5', title: 'Stage 2~6 인사이트 정밀도 검증', completed: false },
  ],
  phase3: [
    { id: 'p3-1', title: 'timeSensitivity 전체 콘텐츠 추가', completed: false },
    { id: 'p3-2', title: 'validity check 로직 구현', completed: false },
    { id: 'p3-3', title: '대시보드 만료 경고 섹션', completed: false },
    { id: 'p3-4', title: '자동 갱신 알림 (관리자용)', completed: false },
  ],
};

export default function ViralOptimization() {
  // localStorage에 진행 상황 저장 (새로고침해도 유지)
  const [progress, setProgress] = useLocalStorage('viral-optimization-progress', DEFAULT_PROGRESS);

  const toggleTask = (phase: keyof typeof progress, taskId: string) => {
    setProgress((prev) => ({
      ...prev,
      [phase]: prev[phase].map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      ),
    }));
  };

  const calculateProgress = (phase: keyof typeof progress) => {
    const tasks = progress[phase];
    if (tasks.length === 0) return 0; // Zero guard
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  const totalProgress = Math.round(
    (calculateProgress('phase1') + calculateProgress('phase2') + calculateProgress('phase3')) / 3
  );
  return (
    <div className="space-y-6">
      {/* 헤더 + 전체 진행률 */}
      <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg p-6 border border-pink-200">
        <div className="flex items-start gap-4 mb-4">
          <TrendingUp className="text-pink-600 flex-shrink-0" size={32} />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">바이럴 최적화 전략</h2>
            <p className="text-slate-700 leading-relaxed">
              2025년 심리테스트 시장 리서치 기반 실행 계획<br />
              <span className="text-sm text-slate-600">
                16Personalities 10억 회, BuzzFeed 96% 완료율 벤치마크 분석 완료
              </span>
            </p>
          </div>
        </div>
        {/* 전체 진행률 */}
        <div className="bg-slate-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">전체 진행률</span>
            <span className="text-2xl font-bold text-green-600">{totalProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${totalProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 핵심 발견 */}
      <div className="bg-slate-50 rounded-lg p-6 border-2 border-yellow-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Zap className="text-yellow-600" size={24} />
          핵심 발견
        </h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <strong className="text-slate-900">새로운 축 추가 불필요</strong>
              <p className="text-sm text-slate-600">단일축 스펙트럼 방식은 2025년 시장에서 비주류. 공유율 낮고 바이럴 어려움</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <strong className="text-slate-900">기존 인프라 완성이 우선</strong>
              <p className="text-sm text-slate-600">InsightService Stage 7, 태그 시스템, 이벤트 추적 이미 구축됨</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="text-green-600 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <strong className="text-slate-900">타입 분류 방식이 Best Practice</strong>
              <p className="text-sm text-slate-600">백분위 대신 타입명 + 특성 설명이 심리/연애 테스트에 적합</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phase 1: 바이럴 최적화 */}
      <PhaseCard
        phase={1}
        title="바이럴 최적화 (즉시 효과)"
        icon={<Share2 className="text-pink-600" size={24} />}
        color="pink"
        expectedEffect="완료율 +20%, 공유율 +30%"
        duration="1주"
        progress={calculateProgress('phase1')}
        checklist={progress.phase1}
        onToggle={(taskId) => toggleTask('phase1', taskId)}
        description="결과 UI/UX 개선, SNS 공유 강화, 긍정적 프레이밍"
        files={['src/app/page.js', 'src/components/ShareButton.tsx', 'src/utils/framing.ts']}
      />

      {/* Phase 2: 깊이 제공 */}
      <PhaseCard
        phase={2}
        title="깊이 제공 (재방문율 향상)"
        icon={<Target className="text-purple-600" size={24} />}
        color="purple"
        expectedEffect="재방문율 +22%, 세션 시간 +14%"
        duration="2주"
        progress={calculateProgress('phase2')}
        checklist={progress.phase2}
        onToggle={(taskId) => toggleTask('phase2', taskId)}
        description="InsightService Stage 7, 응답 시간 수집, 태그 매핑 확대"
        files={['src/services/InsightService.ts', 'src/data/types.ts', 'src/components/TestCard.tsx']}
      />

      {/* Phase 3: 선택적 확장 */}
      <PhaseCard
        phase={3}
        title="선택적 확장 (차별화)"
        icon={<BarChart3 className="text-blue-600" size={24} />}
        color="blue"
        expectedEffect="콘텐츠 신선도 자동 관리, 운영 효율화"
        duration="1주"
        progress={calculateProgress('phase3')}
        checklist={progress.phase3}
        onToggle={(taskId) => toggleTask('phase3', taskId)}
        description="timeSensitivity 적용, 활동 시간대 분석, 결과 히스토리 패턴"
        files={['src/data/content/quizzes/*.ts', 'src/services/AnalyticsService.ts']}
      />

      {/* 시장 벤치마크 */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <h3 className="text-xl font-bold text-slate-900 mb-4">시장 벤치마크 (2025년)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b-2 border-slate-300">
                <th className="text-left py-2 px-4 font-semibold">서비스</th>
                <th className="text-left py-2 px-4 font-semibold">결과 방식</th>
                <th className="text-left py-2 px-4 font-semibold">성과</th>
                <th className="text-left py-2 px-4 font-semibold">핵심 전략</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <tr>
                <td className="py-3 px-4 font-medium">16Personalities</td>
                <td className="py-3 px-4">타입 분류 + 차원 스펙트럼</td>
                <td className="py-3 px-4 text-green-600 font-semibold">10억 회 완료</td>
                <td className="py-3 px-4">표면은 단순, 상세는 선택적</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">BuzzFeed</td>
                <td className="py-3 px-4">단순 타입 분류</td>
                <td className="py-3 px-4 text-green-600 font-semibold">96% 완료율</td>
                <td className="py-3 px-4">긍정 프레이밍, 모바일 70%</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">Noom</td>
                <td className="py-3 px-4">게임화 해금 시스템</td>
                <td className="py-3 px-4 text-green-600 font-semibold">참여 +300%</td>
                <td className="py-3 px-4">점진적 공개</td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-medium">여행 플랫폼</td>
                <td className="py-3 px-4">목적지 해금</td>
                <td className="py-3 px-4 text-green-600 font-semibold">세션 +22%, 가입 +14%</td>
                <td className="py-3 px-4">Progressive Disclosure</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 보류 항목 */}
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-300">
        <h3 className="text-xl font-bold text-slate-900 mb-4">🚫 보류 항목</h3>
        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <span className="text-red-600">❌</span>
            <div>
              <strong>단일축 스펙트럼 테스트</strong> (연애 관대↔엄격 등)<br />
              <span className="text-slate-600">조건: 사용자 피드백 "너무 복잡해" 다수 시 재평가</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600">❌</span>
            <div>
              <strong>백분위 결과 표시</strong><br />
              <span className="text-slate-600">조건: 능력 테스트 추가 시 (IQ, 지식 퀴즈 등)</span>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-red-600">❌</span>
            <div>
              <strong>타인 비교 기능</strong><br />
              <span className="text-slate-600">조건: 실사용자 1000명 이상 확보 후</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Phase 카드 컴포넌트
function PhaseCard({
  phase,
  title,
  icon,
  color,
  expectedEffect,
  duration,
  progress,
  checklist,
  onToggle,
  description,
  files,
}: {
  phase: number;
  title: string;
  icon: React.ReactNode;
  color: 'pink' | 'purple' | 'blue';
  expectedEffect: string;
  duration: string;
  progress: number;
  checklist: Array<{ id: string; title: string; completed: boolean }>;
  onToggle: (taskId: string) => void;
  description: string;
  files: string[];
}) {
  const colorClasses = {
    pink: { bg: 'bg-pink-50', border: 'border-pink-300', progress: 'from-pink-500 to-pink-600' },
    purple: { bg: 'bg-purple-50', border: 'border-purple-300', progress: 'from-purple-500 to-purple-600' },
    blue: { bg: 'bg-blue-50', border: 'border-blue-300', progress: 'from-blue-500 to-blue-600' },
  };

  const classes = colorClasses[color];

  return (
    <div className={`${classes.bg} rounded-lg p-6 border-2 ${classes.border}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start gap-3">
          {icon}
          <div>
            <h3 className="text-xl font-bold text-slate-900">Phase {phase}: {title}</h3>
            <p className="text-sm text-slate-600 mt-1">
              예상 효과: <strong>{expectedEffect}</strong> | 기간: {duration}
            </p>
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          </div>
        </div>
        <span className="text-2xl font-bold text-slate-900">{progress}%</span>
      </div>

      {/* 진행률 바 */}
      <div className="w-full bg-slate-50 rounded-full h-2 mb-4">
        <div
          className={`bg-gradient-to-r ${classes.progress} h-2 rounded-full transition-all duration-300`}
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* 체크리스트 */}
      <div className="space-y-2 mb-4">
        {checklist.map((task) => (
          <label
            key={task.id}
            className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 hover:border-slate-300 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task.id)}
              className="mt-0.5 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
            />
            <span className={`text-sm flex-1 ${task.completed ? 'line-through text-slate-400' : 'text-slate-700'}`}>
              {task.title}
            </span>
            {task.completed ? (
              <CheckCircle2 className="text-green-600 flex-shrink-0" size={20} />
            ) : (
              <Circle className="text-slate-300 flex-shrink-0" size={20} />
            )}
          </label>
        ))}
      </div>

      {/* 파일 목록 */}
      <div className="text-xs text-slate-500">
        📁 {files.join(', ')}
      </div>
    </div>
  );
}
