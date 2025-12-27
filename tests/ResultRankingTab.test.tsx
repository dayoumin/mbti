import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ResultRankingTab from '@/components/ranking/ResultRankingTab';
import type { ResultRankingItem } from '@/components/ranking/hooks/useRankingData';

const mockResultRankings: ResultRankingItem[] = [
  {
    resultName: '자유로운 영혼',
    resultEmoji: '🦅',
    testType: 'cat',
    count: 50,
  },
  {
    resultName: '조용한 관찰자',
    resultEmoji: '🦉',
    testType: 'dog',
    count: 40,
  },
  {
    resultName: '열정적인 탐험가',
    resultEmoji: '🦁',
    testType: 'human',
    count: 30,
  },
];

describe('ResultRankingTab', () => {
  it('로딩 중일 때 스켈레톤을 표시한다', () => {
    render(
      <ResultRankingTab
        resultRankings={[]}
        loading={true}
      />
    );

    const skeleton = screen.getByRole('generic', { hidden: true });
    expect(skeleton.className).toContain('animate-pulse');
  });

  it('데이터가 없을 때 빈 상태 메시지를 표시한다', () => {
    render(
      <ResultRankingTab
        resultRankings={[]}
        loading={false}
      />
    );

    expect(screen.getByText('아직 테스트 결과가 없어요')).toBeInTheDocument();
  });

  it('결과 랭킹 목록을 표시한다', () => {
    render(
      <ResultRankingTab
        resultRankings={mockResultRankings}
        loading={false}
      />
    );

    expect(screen.getByText('자유로운 영혼')).toBeInTheDocument();
    expect(screen.getByText('조용한 관찰자')).toBeInTheDocument();
    expect(screen.getByText('열정적인 탐험가')).toBeInTheDocument();
  });

  it('1위 항목에 골드 배지가 적용된다', () => {
    const { container } = render(
      <ResultRankingTab
        resultRankings={mockResultRankings}
        loading={false}
      />
    );

    const goldBadge = container.querySelector('.bg-amber-400');
    expect(goldBadge).toBeInTheDocument();
    expect(goldBadge?.textContent).toBe('1');
  });

  it('2위 항목에 실버 배지가 적용된다', () => {
    const { container } = render(
      <ResultRankingTab
        resultRankings={mockResultRankings}
        loading={false}
      />
    );

    const silverBadges = container.querySelectorAll('.bg-gray-400');
    expect(silverBadges.length).toBeGreaterThan(0);
    expect(silverBadges[0]?.textContent).toBe('2');
  });

  it('3위 항목에 브론즈 배지가 적용된다', () => {
    const { container } = render(
      <ResultRankingTab
        resultRankings={mockResultRankings}
        loading={false}
      />
    );

    const bronzeBadge = container.querySelector('.bg-orange-400');
    expect(bronzeBadge).toBeInTheDocument();
    expect(bronzeBadge?.textContent).toBe('3');
  });

  it('결과 카운트가 표시된다', () => {
    render(
      <ResultRankingTab
        resultRankings={mockResultRankings}
        loading={false}
      />
    );

    expect(screen.getByText('50회')).toBeInTheDocument();
    expect(screen.getByText('40회')).toBeInTheDocument();
    expect(screen.getByText('30회')).toBeInTheDocument();
  });

  it('테스트 타입이 한글로 표시된다', () => {
    render(
      <ResultRankingTab
        resultRankings={mockResultRankings}
        loading={false}
      />
    );

    expect(screen.getByText('고양이 테스트')).toBeInTheDocument();
    expect(screen.getByText('강아지 테스트')).toBeInTheDocument();
    expect(screen.getByText('성격 테스트')).toBeInTheDocument();
  });

  it('이모지가 표시된다', () => {
    render(
      <ResultRankingTab
        resultRankings={mockResultRankings}
        loading={false}
      />
    );

    expect(screen.getByText('🦅')).toBeInTheDocument();
    expect(screen.getByText('🦉')).toBeInTheDocument();
    expect(screen.getByText('🦁')).toBeInTheDocument();
  });
});
