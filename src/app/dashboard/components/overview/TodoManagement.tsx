'use client';

import { ListChecks, Clock, CheckCircle2, Lightbulb } from 'lucide-react';

interface TodoItem {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  category: string;
  createdAt: string;
}

export default function TodoManagement() {
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
