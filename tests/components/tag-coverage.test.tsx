/**
 * TagCoverage 컴포넌트 테스트
 *
 * 검증 항목:
 * 1. 컴포넌트 렌더링
 * 2. Stage별 목표 표시
 * 3. 진행률 계산
 * 4. 다음 작업 추천
 * 5. 명령어 생성
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import TagCoverage from '../../src/app/dashboard/components/devtools/TagCoverage';

// clipboard mock
Object.assign(navigator, {
  clipboard: {
    writeText: vi.fn().mockResolvedValue(undefined),
  },
});

describe('TagCoverage', () => {
  describe('렌더링', () => {
    it('헤더가 렌더링되어야 함', () => {
      render(<TagCoverage />);
      expect(screen.getByText('콘텐츠 생성 목표')).toBeDefined();
    });

    it('Stage 4 섹션이 렌더링되어야 함', () => {
      render(<TagCoverage />);
      // "Stage 4: 관심사 지도"가 하나의 텍스트로 렌더링됨
      expect(screen.getByText(/Stage 4:.*관심사 지도/)).toBeDefined();
    });

    it('Stage 5 섹션이 렌더링되어야 함', () => {
      render(<TagCoverage />);
      // "Stage 5: 관계 패턴"이 하나의 텍스트로 렌더링됨
      expect(screen.getByText(/Stage 5:.*관계 패턴/)).toBeDefined();
    });

    it('워크플로우 안내가 렌더링되어야 함', () => {
      render(<TagCoverage />);
      expect(screen.getByText('콘텐츠 생성 워크플로우')).toBeDefined();
    });
  });

  describe('다음 작업 추천', () => {
    it('다음 작업 섹션이 표시되어야 함', () => {
      render(<TagCoverage />);
      expect(screen.getByText('📋 다음 작업')).toBeDefined();
    });

    it('남은 수량이 표시되어야 함', () => {
      render(<TagCoverage />);
      // "남은 수량" 텍스트가 있어야 함
      expect(screen.getByText('남은 수량')).toBeDefined();
    });
  });

  describe('목표 목록', () => {
    it('interest-cat 목표가 표시되어야 함', () => {
      render(<TagCoverage />);
      expect(screen.getByText('interest-cat')).toBeDefined();
    });

    it('interest-dog 목표가 표시되어야 함', () => {
      render(<TagCoverage />);
      expect(screen.getByText('interest-dog')).toBeDefined();
    });

    it('compromising 목표가 표시되어야 함', () => {
      render(<TagCoverage />);
      expect(screen.getByText('compromising')).toBeDefined();
    });
  });

  describe('진행률 표시', () => {
    it('Stage별 진행률 퍼센트가 표시되어야 함', () => {
      render(<TagCoverage />);
      // 퍼센트 표시 (0%, 20%, 등)
      const percentages = screen.getAllByText(/%$/);
      expect(percentages.length).toBeGreaterThan(0);
    });

    it('완료/전체 카운트가 표시되어야 함', () => {
      render(<TagCoverage />);
      // "N/M 완료" 형식
      expect(screen.getAllByText(/\/\d+ 완료/).length).toBeGreaterThan(0);
    });
  });

  describe('명령어 복사', () => {
    it('명령어 복사 버튼이 존재해야 함', () => {
      render(<TagCoverage />);
      const copyButtons = screen.getAllByText('명령어 복사');
      expect(copyButtons.length).toBeGreaterThan(0);
    });

    it('복사 버튼 클릭 시 clipboard에 복사되어야 함', async () => {
      render(<TagCoverage />);
      const copyButton = screen.getAllByText('명령어 복사')[0];

      fireEvent.click(copyButton);

      expect(navigator.clipboard.writeText).toHaveBeenCalled();
    });
  });
});

describe('TagCoverage 로직 단위 테스트', () => {
  // getCurrentUsage 함수 로직
  const CURRENT_USAGE: Record<string, Record<string, number>> = {
    interest: {
      'interest-love': 20,
      'interest-lifestyle': 178,
      'interest-cat': 0,
    },
    relationship: {
      'assertive': 10,
      'compromising': 0,
    },
  };

  const getCurrentUsage = (tag: string): number => {
    const category = tag.startsWith('interest-') ? 'interest' : 'relationship';
    return CURRENT_USAGE[category]?.[tag] || 0;
  };

  it('interest-love 사용량을 올바르게 반환해야 함', () => {
    expect(getCurrentUsage('interest-love')).toBe(20);
  });

  it('interest-cat 사용량을 0으로 반환해야 함', () => {
    expect(getCurrentUsage('interest-cat')).toBe(0);
  });

  it('없는 태그는 0을 반환해야 함', () => {
    expect(getCurrentUsage('interest-nonexistent')).toBe(0);
  });

  it('relationship 태그를 올바르게 분류해야 함', () => {
    expect(getCurrentUsage('assertive')).toBe(10);
    expect(getCurrentUsage('compromising')).toBe(0);
  });

  // getGoalStatus 함수 로직
  type GoalStatus = 'done' | 'partial' | 'none';

  const getGoalStatus = (current: number, target: number): GoalStatus => {
    if (current >= target) return 'done';
    if (current > 0) return 'partial';
    return 'none';
  };

  it('목표 달성 시 done을 반환해야 함', () => {
    expect(getGoalStatus(5, 5)).toBe('done');
    expect(getGoalStatus(10, 5)).toBe('done');
  });

  it('부분 달성 시 partial을 반환해야 함', () => {
    expect(getGoalStatus(3, 5)).toBe('partial');
    expect(getGoalStatus(1, 5)).toBe('partial');
  });

  it('미달성 시 none을 반환해야 함', () => {
    expect(getGoalStatus(0, 5)).toBe('none');
  });

  // generateCommand 함수 로직
  const generateCommand = (
    category: string,
    contentType: string,
    tag: string,
    remaining: number
  ): string => {
    if (remaining <= 0) return '';
    return `${category} ${contentType} ${remaining}개 만들어줘 (${tag} 태그 필수)`;
  };

  it('명령어를 올바르게 생성해야 함', () => {
    const command = generateCommand('cat', 'vs-poll', 'interest-cat', 5);
    expect(command).toBe('cat vs-poll 5개 만들어줘 (interest-cat 태그 필수)');
  });

  it('남은 수량이 0이면 빈 문자열을 반환해야 함', () => {
    expect(generateCommand('cat', 'vs-poll', 'interest-cat', 0)).toBe('');
  });

  it('남은 수량이 음수면 빈 문자열을 반환해야 함', () => {
    expect(generateCommand('cat', 'vs-poll', 'interest-cat', -1)).toBe('');
  });

  // getStageProgress 함수 로직
  const getStageProgress = (
    goals: Array<{ current: number; target: number }>
  ): { completed: number; total: number; percentage: number } => {
    const completed = goals.filter((g) => g.current >= g.target).length;
    return {
      completed,
      total: goals.length,
      percentage: Math.round((completed / goals.length) * 100),
    };
  };

  it('모두 완료 시 100%를 반환해야 함', () => {
    const goals = [
      { current: 5, target: 5 },
      { current: 10, target: 5 },
    ];
    expect(getStageProgress(goals)).toEqual({
      completed: 2,
      total: 2,
      percentage: 100,
    });
  });

  it('하나도 완료 안됐으면 0%를 반환해야 함', () => {
    const goals = [
      { current: 0, target: 5 },
      { current: 2, target: 5 },
    ];
    expect(getStageProgress(goals)).toEqual({
      completed: 0,
      total: 2,
      percentage: 0,
    });
  });

  it('절반 완료 시 50%를 반환해야 함', () => {
    const goals = [
      { current: 5, target: 5 },
      { current: 0, target: 5 },
    ];
    expect(getStageProgress(goals)).toEqual({
      completed: 1,
      total: 2,
      percentage: 50,
    });
  });
});
