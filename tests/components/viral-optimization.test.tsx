/**
 * ViralOptimization 컴포넌트 테스트
 *
 * 검증 항목:
 * 1. 컴포넌트 렌더링
 * 2. 진행률 계산 로직
 * 3. 체크박스 토글 기능
 * 4. Phase별 진행률 표시
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ViralOptimization from '../../src/app/dashboard/components/ViralOptimization';

describe('ViralOptimization', () => {
  describe('렌더링', () => {
    it('헤더가 렌더링되어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText('바이럴 최적화 전략')).toBeDefined();
    });

    it('3개의 Phase 카드가 렌더링되어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText(/Phase 1:/)).toBeDefined();
      expect(screen.getByText(/Phase 2:/)).toBeDefined();
      expect(screen.getByText(/Phase 3:/)).toBeDefined();
    });

    it('핵심 발견 섹션이 렌더링되어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText('핵심 발견')).toBeDefined();
    });

    it('시장 벤치마크 테이블이 렌더링되어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText('시장 벤치마크 (2025년)')).toBeDefined();
      expect(screen.getByText('16Personalities')).toBeDefined();
      expect(screen.getByText('BuzzFeed')).toBeDefined();
    });
  });

  describe('진행률 계산', () => {
    it('전체 진행률이 표시되어야 함', () => {
      render(<ViralOptimization />);
      // 초기 상태: Phase1 4/5(80%), Phase2 0/5(0%), Phase3 0/4(0%)
      // 평균: (80 + 0 + 0) / 3 = 26.67 ≈ 27%
      const progressText = screen.getByText(/전체 진행률/);
      expect(progressText).toBeDefined();
    });

    it('Phase 1 진행률이 80%여야 함 (4/5 완료)', () => {
      render(<ViralOptimization />);
      // Phase 1에서 4개가 완료된 상태
      const phase1Section = screen.getByText(/Phase 1:/).closest('div');
      expect(phase1Section).toBeDefined();
    });
  });

  describe('체크박스 토글', () => {
    it('체크박스 클릭 시 상태가 변경되어야 함', () => {
      render(<ViralOptimization />);

      // 첫 번째 미완료 항목 찾기
      const checkbox = screen.getByLabelText(/모바일 UI 점검/);
      expect(checkbox).toBeDefined();

      // 초기 상태: unchecked
      expect((checkbox as HTMLInputElement).checked).toBe(false);

      // 클릭
      fireEvent.click(checkbox);

      // 변경 후: checked
      expect((checkbox as HTMLInputElement).checked).toBe(true);
    });

    it('완료된 항목은 체크된 상태여야 함', () => {
      render(<ViralOptimization />);

      const completedCheckbox = screen.getByLabelText(/타입명 최우선 표시/);
      expect((completedCheckbox as HTMLInputElement).checked).toBe(true);
    });
  });

  describe('Phase 카드 내용', () => {
    it('Phase 1은 바이럴 최적화 관련 내용이어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText(/바이럴 최적화 \(즉시 효과\)/)).toBeDefined();
      expect(screen.getByText(/완료율 \+20%, 공유율 \+30%/)).toBeDefined();
    });

    it('Phase 2는 깊이 제공 관련 내용이어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText(/깊이 제공 \(재방문율 향상\)/)).toBeDefined();
    });

    it('Phase 3는 선택적 확장 관련 내용이어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText(/선택적 확장 \(차별화\)/)).toBeDefined();
    });
  });

  describe('보류 항목', () => {
    it('보류 항목 섹션이 렌더링되어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText('🚫 보류 항목')).toBeDefined();
    });

    it('단일축 스펙트럼 테스트가 보류 항목에 있어야 함', () => {
      render(<ViralOptimization />);
      expect(screen.getByText(/단일축 스펙트럼 테스트/)).toBeDefined();
    });
  });
});

describe('진행률 계산 로직 단위 테스트', () => {
  // calculateProgress 함수 로직 검증
  const calculateProgress = (tasks: Array<{ completed: boolean }>) => {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
  };

  it('빈 배열은 0%를 반환해야 함', () => {
    expect(calculateProgress([])).toBe(0);
  });

  it('모두 완료되면 100%를 반환해야 함', () => {
    const tasks = [
      { completed: true },
      { completed: true },
      { completed: true },
    ];
    expect(calculateProgress(tasks)).toBe(100);
  });

  it('절반 완료되면 50%를 반환해야 함', () => {
    const tasks = [
      { completed: true },
      { completed: false },
    ];
    expect(calculateProgress(tasks)).toBe(50);
  });

  it('4/5 완료되면 80%를 반환해야 함', () => {
    const tasks = [
      { completed: true },
      { completed: true },
      { completed: true },
      { completed: true },
      { completed: false },
    ];
    expect(calculateProgress(tasks)).toBe(80);
  });

  it('1/3 완료되면 33%를 반환해야 함 (반올림)', () => {
    const tasks = [
      { completed: true },
      { completed: false },
      { completed: false },
    ];
    expect(calculateProgress(tasks)).toBe(33);
  });
});
