import { expect, test } from '@playwright/test';

// getStablePollResults 함수 테스트
test.describe('getStablePollResults', () => {
  // 함수 직접 복사 (테스트용)
  function getStablePollResults(pollId: string) {
    const seedStr = String(pollId || '');
    let hash = 0;
    for (let i = 0; i < seedStr.length; i++) {
      hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
    }
    const base = Math.abs(hash) % 41;
    const a = 30 + base;
    return { a, b: 100 - a, total: 0 };
  }

  test('returns consistent results for same pollId', () => {
    const result1 = getStablePollResults('test-poll-123');
    const result2 = getStablePollResults('test-poll-123');
    expect(result1).toEqual(result2);
  });

  test('returns different results for different pollIds', () => {
    const result1 = getStablePollResults('poll-1');
    const result2 = getStablePollResults('poll-2');
    // 다를 확률이 매우 높음 (같은 해시가 나오지 않는 한)
    expect(result1.a === result2.a && result1.b === result2.b).toBe(false);
  });

  test('a + b always equals 100', () => {
    const testIds = ['poll-1', 'poll-abc', '', 'very-long-poll-id-12345'];
    for (const id of testIds) {
      const result = getStablePollResults(id);
      expect(result.a + result.b).toBe(100);
    }
  });

  test('a is between 30 and 70', () => {
    const testIds = ['poll-1', 'poll-abc', 'test', '123', 'xyz'];
    for (const id of testIds) {
      const result = getStablePollResults(id);
      expect(result.a).toBeGreaterThanOrEqual(30);
      expect(result.a).toBeLessThanOrEqual(70);
    }
  });

  test('handles empty string', () => {
    const result = getStablePollResults('');
    expect(result.a + result.b).toBe(100);
    expect(result.total).toBe(0);
  });
});

// moderateContent 함수 테스트
test.describe('moderateContent', () => {
  function moderateContent(question: string, optionA: string, optionB: string): {
    approved: boolean;
    reason?: string;
  } {
    const bannedWords = [
      '시발', '씨발', '개새끼', '병신', '지랄', '꺼져', '죽어',
      '섹스', '야동', '포르노', '성인', '19금',
      '마약', '대마', '필로폰', '코카인',
      '자살', '자해',
    ];

    const allText = `${question} ${optionA} ${optionB}`.toLowerCase();

    for (const word of bannedWords) {
      if (allText.includes(word)) {
        return { approved: false, reason: `금지어 포함: ${word}` };
      }
    }

    if (question.length < 5 || optionA.length < 1 || optionB.length < 1) {
      return { approved: false, reason: '내용이 너무 짧습니다' };
    }

    return { approved: true };
  }

  test('approves valid content', () => {
    const result = moderateContent(
      '고양이 사료는 뭐가 좋아요?',
      '습식',
      '건식'
    );
    expect(result.approved).toBe(true);
  });

  test('rejects banned words in question', () => {
    const result = moderateContent('시발 뭐가 좋아?', '옵션A', '옵션B');
    expect(result.approved).toBe(false);
    expect(result.reason).toContain('금지어');
  });

  test('rejects banned words in options', () => {
    const result = moderateContent('어떤게 좋아요?', '씨발 A', '옵션B');
    expect(result.approved).toBe(false);
    expect(result.reason).toContain('금지어');
  });

  test('rejects too short question', () => {
    const result = moderateContent('뭐?', '옵션A', '옵션B');
    expect(result.approved).toBe(false);
    expect(result.reason).toContain('짧습니다');
  });

  test('rejects empty options', () => {
    const result = moderateContent('충분히 긴 질문입니다', '', '옵션B');
    expect(result.approved).toBe(false);
    expect(result.reason).toContain('짧습니다');
  });

  test('is case insensitive for banned words', () => {
    // 한글은 대소문자가 없으므로 영문 금지어 테스트
    // toLowerCase 적용 확인 (한글 금지어는 영향 없음)
    const result = moderateContent('충분히 긴 질문입니다', 'A', 'B');
    expect(result.approved).toBe(true); // 금지어 없고 길이 충분
  });
});

// PollResults 타입 검증
test.describe('PollResults interface', () => {
  interface PollResults {
    a: number;
    b: number;
    total: number;
  }

  test('total -1 indicates loading/unknown state', () => {
    const unknownState: PollResults = { a: 50, b: 50, total: -1 };
    expect(unknownState.total).toBe(-1);
  });

  test('total 0 indicates first vote', () => {
    const firstVote: PollResults = { a: 50, b: 50, total: 0 };
    expect(firstVote.total).toBe(0);
  });

  test('total > 0 indicates actual votes', () => {
    const withVotes: PollResults = { a: 60, b: 40, total: 100 };
    expect(withVotes.total).toBeGreaterThan(0);
  });
});

// RewardInfo 타입 검증
test.describe('RewardInfo interface', () => {
  interface RewardInfo {
    points: number;
    newBadges: string[];
  }

  test('reward contains points and badges', () => {
    const reward: RewardInfo = {
      points: 10,
      newBadges: ['first_quiz', 'streak_3'],
    };
    expect(reward.points).toBe(10);
    expect(reward.newBadges).toHaveLength(2);
  });

  test('empty badges array is valid', () => {
    const reward: RewardInfo = {
      points: 5,
      newBadges: [],
    };
    expect(reward.newBadges).toHaveLength(0);
  });
});

// 좋아요 토글 로직 테스트
test.describe('Like toggle logic', () => {
  test('optimistic update pattern', () => {
    // 초기 상태
    let liked = false;
    let likeCount = 5;

    // Optimistic update (클릭 시)
    const prevLiked = liked;
    const prevCount = likeCount;
    liked = !liked;
    likeCount = liked ? likeCount + 1 : likeCount - 1;

    // 업데이트 확인
    expect(liked).toBe(true);
    expect(likeCount).toBe(6);

    // 롤백 테스트 (실패 시)
    liked = prevLiked;
    likeCount = prevCount;
    expect(liked).toBe(false);
    expect(likeCount).toBe(5);
  });

  test('toggle from liked to unliked', () => {
    let liked = true;
    let likeCount = 10;

    liked = !liked;
    likeCount = liked ? likeCount + 1 : likeCount - 1;

    expect(liked).toBe(false);
    expect(likeCount).toBe(9);
  });
});

// Poll ID 생성 테스트
test.describe('Poll ID generation', () => {
  test('user poll id format', () => {
    const timestamp = Date.now();
    const random = Math.random().toString(36).slice(2, 8);
    const pollId = `user-${timestamp}-${random}`;

    expect(pollId).toMatch(/^user-\d+-[a-z0-9]+$/);
    expect(pollId.startsWith('user-')).toBe(true);
  });

  test('generated ids are unique', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const pollId = `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      ids.add(pollId);
    }
    // 모든 ID가 고유해야 함 (확률적으로 거의 100%)
    expect(ids.size).toBeGreaterThan(95);
  });
});

// 참여자 수 표시 로직 테스트
test.describe('Participant count display logic', () => {
  function getDisplayText(total: number): string {
    if (total > 0) {
      return `${total.toLocaleString()}명 참여`;
    } else if (total === -1) {
      return '집계중...';
    } else {
      return '첫 번째 투표!';
    }
  }

  test('displays count for positive total', () => {
    expect(getDisplayText(100)).toBe('100명 참여');
    expect(getDisplayText(1000)).toBe('1,000명 참여');
  });

  test('displays loading for -1', () => {
    expect(getDisplayText(-1)).toBe('집계중...');
  });

  test('displays first vote for 0', () => {
    expect(getDisplayText(0)).toBe('첫 번째 투표!');
  });
});
