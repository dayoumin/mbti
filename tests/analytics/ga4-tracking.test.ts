/**
 * GA4 이벤트 추적 단위 테스트
 *
 * 실행: npm test tests/analytics/ga4-tracking.test.ts
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

// gtag mock
const mockGtag = vi.fn();

// analytics 함수들을 mock된 환경에서 테스트하기 위해 동적 import
let trackTestStart: any;
let trackTestComplete: any;
let trackShare: any;
let trackQuizAnswer: any;
let trackPollVote: any;
let trackReaction: any;
let trackRankingVote: any;

describe('GA4 이벤트 추적', () => {
  beforeEach(async () => {
    // gtag 초기화
    mockGtag.mockClear();
    (global as any).window = {
      gtag: mockGtag,
    };

    // analytics 함수들 동적 import
    const analytics = await import('@/lib/analytics');
    trackTestStart = analytics.trackTestStart;
    trackTestComplete = analytics.trackTestComplete;
    trackShare = analytics.trackShare;
    trackQuizAnswer = analytics.trackQuizAnswer;
    trackPollVote = analytics.trackPollVote;
    trackReaction = analytics.trackReaction;
    trackRankingVote = analytics.trackRankingVote;
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('테스트 이벤트', () => {
    it('테스트 시작 이벤트를 전송한다', () => {
      trackTestStart('dog');

      expect(mockGtag).toHaveBeenCalledWith('event', 'test_start', {
        event_category: 'engagement',
        event_label: 'dog',
        value: undefined,
      });
    });

    it('테스트 완료 이벤트를 소요 시간과 함께 전송한다', () => {
      const duration = 45000; // 45초
      trackTestComplete('dog', duration);

      expect(mockGtag).toHaveBeenCalledWith('event', 'test_complete', {
        event_category: 'engagement',
        event_label: 'dog',
        value: 45, // 초 단위로 변환
      });
    });

    it('소요 시간을 초 단위로 변환한다', () => {
      trackTestComplete('cat', 127500); // 2분 7.5초

      expect(mockGtag).toHaveBeenCalledWith('event', 'test_complete', {
        event_category: 'engagement',
        event_label: 'cat',
        value: 128, // 반올림
      });
    });
  });

  describe('공유 이벤트', () => {
    it('카카오톡 공유 이벤트를 전송한다', () => {
      trackShare('kakao', 'dog');

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', {
        event_category: 'engagement',
        event_label: 'kakao_dog',
        value: undefined,
      });
    });

    it('URL 복사 이벤트를 전송한다', () => {
      trackShare('link', 'cat');

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', {
        event_category: 'engagement',
        event_label: 'link_cat',
        value: undefined,
      });
    });

    it('testKey 없이도 동작한다', () => {
      trackShare('native');

      expect(mockGtag).toHaveBeenCalledWith('event', 'share', {
        event_category: 'engagement',
        event_label: 'native',
        value: undefined,
      });
    });
  });

  describe('참여형 콘텐츠 이벤트', () => {
    it('퀴즈 정답 이벤트를 전송한다', () => {
      trackQuizAnswer('dog_quiz_001', true);

      expect(mockGtag).toHaveBeenCalledWith('event', 'quiz_answer', {
        event_category: 'engagement',
        event_label: 'dog_quiz_001',
        value: 1, // 정답
      });
    });

    it('퀴즈 오답 이벤트를 전송한다', () => {
      trackQuizAnswer('cat_quiz_002', false);

      expect(mockGtag).toHaveBeenCalledWith('event', 'quiz_answer', {
        event_category: 'engagement',
        event_label: 'cat_quiz_002',
        value: 0, // 오답
      });
    });

    it('투표 참여 이벤트를 전송한다', () => {
      trackPollVote('poll_001', 'a');

      expect(mockGtag).toHaveBeenCalledWith('event', 'poll_vote', {
        event_category: 'engagement',
        event_label: 'poll_001_a',
        value: undefined,
      });
    });

    it('상황 반응 이벤트를 전송한다', () => {
      trackReaction('awkward_001', 'option_2');

      expect(mockGtag).toHaveBeenCalledWith('event', 'situation_reaction', {
        event_category: 'engagement',
        event_label: 'awkward_001',
        value: undefined,
      });
    });

    it('랭킹 투표 이벤트를 전송한다', () => {
      trackRankingVote('dog', 'golden_retriever');

      expect(mockGtag).toHaveBeenCalledWith('event', 'ranking_vote', {
        event_category: 'engagement',
        event_label: 'dog_golden_retriever',
        value: undefined,
      });
    });
  });

  describe('브라우저 환경 체크', () => {
    it('window가 없으면 이벤트를 전송하지 않는다', () => {
      delete (global as any).window;

      trackTestStart('dog');

      expect(mockGtag).not.toHaveBeenCalled();
    });

    it('gtag가 없으면 이벤트를 전송하지 않는다', () => {
      (global as any).window = {};

      trackTestStart('dog');

      expect(mockGtag).not.toHaveBeenCalled();
    });
  });
});
