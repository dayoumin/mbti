import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PollRankingTab from '@/components/ranking/PollRankingTab';
import type { PollRankingItem } from '@/components/ranking/hooks/useRankingData';

const mockPollRankings: PollRankingItem[] = [
  {
    pollId: 'poll-1',
    question: '고양이 vs 강아지',
    category: 'cat',
    totalVotes: 150,
    topOption: {
      id: 'a',
      text: '고양이',
      emoji: '🐱',
      percentage: 60,
    },
    commentCount: 5,
  },
  {
    pollId: 'poll-2',
    question: '커피 vs 차',
    category: 'lifestyle',
    totalVotes: 100,
    topOption: {
      id: 'b',
      text: '차',
      emoji: '🍵',
      percentage: 55,
    },
    commentCount: 3,
  },
];

describe('PollRankingTab', () => {
  it('로딩 중일 때 스켈레톤을 표시한다', () => {
    render(
      <PollRankingTab
        pollRankings={[]}
        loading={true}
        onPollClick={vi.fn()}
      />
    );

    const skeleton = screen.getByRole('generic', { hidden: true });
    expect(skeleton.className).toContain('animate-pulse');
  });

  it('데이터가 없을 때 빈 상태 메시지를 표시한다', () => {
    render(
      <PollRankingTab
        pollRankings={[]}
        loading={false}
        onPollClick={vi.fn()}
      />
    );

    expect(screen.getByText('아직 투표 데이터가 없어요')).toBeInTheDocument();
  });

  it('투표 랭킹 목록을 표시한다', () => {
    render(
      <PollRankingTab
        pollRankings={mockPollRankings}
        loading={false}
        onPollClick={vi.fn()}
      />
    );

    expect(screen.getByText('고양이 vs 강아지')).toBeInTheDocument();
    expect(screen.getByText('커피 vs 차')).toBeInTheDocument();
  });

  it('1위 항목에 올바른 스타일이 적용된다', () => {
    const { container } = render(
      <PollRankingTab
        pollRankings={mockPollRankings}
        loading={false}
        onPollClick={vi.fn()}
      />
    );

    const firstRankBadge = container.querySelector('.bg-amber-400');
    expect(firstRankBadge).toBeInTheDocument();
    expect(firstRankBadge?.textContent).toBe('1');
  });

  it('투표수가 표시된다', () => {
    render(
      <PollRankingTab
        pollRankings={mockPollRankings}
        loading={false}
        onPollClick={vi.fn()}
      />
    );

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('100')).toBeInTheDocument();
  });

  it('댓글 수가 표시된다', () => {
    render(
      <PollRankingTab
        pollRankings={mockPollRankings}
        loading={false}
        onPollClick={vi.fn()}
      />
    );

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('항목 클릭 시 onPollClick이 호출된다', async () => {
    const user = userEvent.setup();
    const onPollClick = vi.fn();

    render(
      <PollRankingTab
        pollRankings={mockPollRankings}
        loading={false}
        onPollClick={onPollClick}
      />
    );

    const firstPoll = screen.getByText('고양이 vs 강아지');
    await user.click(firstPoll);

    expect(onPollClick).toHaveBeenCalledWith('poll-1', '고양이 vs 강아지');
  });

  it('1위 옵션 정보가 표시된다', () => {
    render(
      <PollRankingTab
        pollRankings={mockPollRankings}
        loading={false}
        onPollClick={vi.fn()}
      />
    );

    expect(screen.getByText(/🐱 고양이 60%/)).toBeInTheDocument();
    expect(screen.getByText(/🍵 차 55%/)).toBeInTheDocument();
  });
});
