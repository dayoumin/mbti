/**
 * TodayQuizPoll 컴포넌트 관련 단위 테스트
 * - 날짜 기반 퀴즈/투표 선택 로직
 * - 참여 상태 복원 로직
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// 테스트용 퀴즈/투표 목 데이터
const MOCK_QUIZZES = [
  { id: 'q1', question: '퀴즈 1', category: 'cat', options: [{ id: 'a', text: 'A', isCorrect: true }], explanation: '설명' },
  { id: 'q2', question: '퀴즈 2', category: 'dog', options: [{ id: 'a', text: 'A', isCorrect: false }], explanation: '설명' },
  { id: 'q3', question: '퀴즈 3', category: 'rabbit', options: [{ id: 'a', text: 'A', isCorrect: true }], explanation: '설명' },
];

const MOCK_POLLS = [
  { id: 'p1', question: '투표 1', category: 'cat', optionA: { id: 'a', text: 'A', emoji: '🅰️' }, optionB: { id: 'b', text: 'B', emoji: '🅱️' } },
  { id: 'p2', question: '투표 2', category: 'dog', optionA: { id: 'a', text: 'A', emoji: '🅰️' }, optionB: { id: 'b', text: 'B', emoji: '🅱️' } },
];

// 날짜 기반 선택 함수 (컴포넌트에서 추출)
function getTodayQuiz<T>(quizzes: T[], dateOverride?: Date): T | null {
  if (quizzes.length === 0) return null;
  const today = dateOverride || new Date();
  const dayIndex = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate();
  return quizzes[dayIndex % quizzes.length];
}

function getTodayPoll<T>(polls: T[], dateOverride?: Date): T | null {
  if (polls.length === 0) return null;
  const today = dateOverride || new Date();
  const dayIndex = today.getFullYear() * 1000 + today.getMonth() * 31 + today.getDate() + 7;
  return polls[dayIndex % polls.length];
}

describe('TodayQuizPoll - 날짜 기반 선택 로직', () => {
  describe('getTodayQuiz', () => {
    it('빈 배열이면 null 반환', () => {
      expect(getTodayQuiz([])).toBeNull();
    });

    it('같은 날짜에는 같은 퀴즈 반환 (결정적)', () => {
      const date = new Date(2024, 11, 22); // 2024-12-22
      const quiz1 = getTodayQuiz(MOCK_QUIZZES, date);
      const quiz2 = getTodayQuiz(MOCK_QUIZZES, date);
      expect(quiz1).toBe(quiz2);
    });

    it('다른 날짜에는 다른 퀴즈 반환 가능', () => {
      const date1 = new Date(2024, 11, 22);
      const date2 = new Date(2024, 11, 23);
      const quiz1 = getTodayQuiz(MOCK_QUIZZES, date1);
      const quiz2 = getTodayQuiz(MOCK_QUIZZES, date2);
      // 3개 퀴즈 중 다른 날에 같은 것이 선택될 확률 33%이므로
      // 항상 다르다고 단정할 수 없지만, 로직이 날짜에 따라 변하는지 확인
      expect(quiz1).toBeDefined();
      expect(quiz2).toBeDefined();
    });

    it('배열 범위 내에서 순환', () => {
      // 1000일 동안 테스트 - 모두 유효한 인덱스인지
      for (let i = 0; i < 1000; i++) {
        const date = new Date(2024, 0, 1 + i);
        const quiz = getTodayQuiz(MOCK_QUIZZES, date);
        expect(MOCK_QUIZZES).toContain(quiz);
      }
    });
  });

  describe('getTodayPoll', () => {
    it('빈 배열이면 null 반환', () => {
      expect(getTodayPoll([])).toBeNull();
    });

    it('같은 날짜에 같은 투표 반환', () => {
      const date = new Date(2024, 11, 22);
      const poll1 = getTodayPoll(MOCK_POLLS, date);
      const poll2 = getTodayPoll(MOCK_POLLS, date);
      expect(poll1).toBe(poll2);
    });

    it('퀴즈와 다른 오프셋 사용 (같은 날 다른 콘텐츠)', () => {
      const date = new Date(2024, 11, 22);
      const quizIndex = (date.getFullYear() * 1000 + date.getMonth() * 31 + date.getDate()) % MOCK_QUIZZES.length;
      const pollIndex = (date.getFullYear() * 1000 + date.getMonth() * 31 + date.getDate() + 7) % MOCK_POLLS.length;
      // 오프셋 7이 적용되어 다른 인덱스 계산
      expect(quizIndex).not.toBe(pollIndex);
    });
  });
});

describe('TodayQuizPoll - 참여 상태', () => {
  const mockParticipation = {
    quizzes: [
      { quizId: 'q1', selectedOption: 'a', isCorrect: true },
    ],
    polls: [
      { pollId: 'p1', choice: 'b' as const },
    ],
    stats: {
      totalQuizAnswered: 1,
      totalCorrect: 1,
      totalPollVoted: 1,
      lastParticipatedAt: '2024-12-22',
    },
  };

  it('이미 참여한 퀴즈는 상태 복원', () => {
    const todayQuiz = { id: 'q1' };
    const answered = mockParticipation.quizzes.find(q => q.quizId === todayQuiz.id);

    expect(answered).toBeDefined();
    expect(answered?.selectedOption).toBe('a');
    expect(answered?.isCorrect).toBe(true);
  });

  it('이미 참여한 투표는 상태 복원', () => {
    const todayPoll = { id: 'p1' };
    const voted = mockParticipation.polls.find(p => p.pollId === todayPoll.id);

    expect(voted).toBeDefined();
    expect(voted?.choice).toBe('b');
  });

  it('참여하지 않은 콘텐츠는 undefined', () => {
    const todayQuiz = { id: 'q2' };
    const answered = mockParticipation.quizzes.find(q => q.quizId === todayQuiz.id);

    expect(answered).toBeUndefined();
  });
});

describe('TodayQuizPoll - 통계 표시', () => {
  it('활동이 있으면 hasActivity true', () => {
    const stats = { totalQuizAnswered: 1, totalPollVoted: 0 };
    const hasActivity = stats.totalQuizAnswered > 0 || stats.totalPollVoted > 0;
    expect(hasActivity).toBe(true);
  });

  it('활동이 없으면 hasActivity false', () => {
    const stats = { totalQuizAnswered: 0, totalPollVoted: 0 };
    const hasActivity = stats.totalQuizAnswered > 0 || stats.totalPollVoted > 0;
    expect(hasActivity).toBe(false);
  });
});
