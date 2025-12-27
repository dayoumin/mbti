/**
 * 애플리케이션 이벤트 추적
 *
 * GA4로 전송할 비즈니스 이벤트 정의
 */

import * as gtag from './gtag';

/**
 * 1. 테스트 시작 추적
 * @param testType - 테스트 종류 (dog, cat, human 등)
 *
 * @example
 * trackTestStart('dog');
 */
export const trackTestStart = (testType: string) => {
  gtag.event({
    action: 'test_start',
    category: 'engagement',
    label: testType,
  });
};

/**
 * 2. 테스트 완료 추적
 * @param testType - 테스트 종류
 * @param duration - 소요 시간 (밀리초)
 *
 * @example
 * trackTestComplete('dog', 45000); // 45초 소요
 */
export const trackTestComplete = (testType: string, duration: number) => {
  gtag.event({
    action: 'test_complete',
    category: 'engagement',
    label: testType,
    value: Math.round(duration / 1000), // 초 단위로 변환
  });
};

/**
 * 3. 공유 버튼 클릭 추적
 * @param platform - 공유 플랫폼 (kakao, link, instagram 등)
 * @param testType - 테스트 종류
 *
 * @example
 * trackShare('kakao', 'dog');
 */
export const trackShare = (platform: string, testType?: string) => {
  gtag.event({
    action: 'share',
    category: 'engagement',
    label: testType ? `${platform}_${testType}` : platform,
  });
};

/**
 * 4. 퀴즈 응답 추적
 * @param quizId - 퀴즈 ID
 * @param isCorrect - 정답 여부
 *
 * @example
 * trackQuizAnswer('dog_001', true);
 */
export const trackQuizAnswer = (quizId: string, isCorrect: boolean) => {
  gtag.event({
    action: 'quiz_answer',
    category: 'engagement',
    label: quizId,
    value: isCorrect ? 1 : 0, // 1 = 정답, 0 = 오답
  });
};

/**
 * 5. 투표 참여 추적
 * @param pollId - 투표 ID
 * @param selectedOption - 선택한 옵션
 *
 * @example
 * trackPollVote('poll_001', 'A');
 */
export const trackPollVote = (pollId: string, selectedOption: string) => {
  gtag.event({
    action: 'poll_vote',
    category: 'engagement',
    label: `${pollId}_${selectedOption}`,
  });
};

/**
 * 6. 상황 반응 참여 추적
 * @param reactionId - 상황 반응 ID
 * @param selectedReaction - 선택한 반응
 *
 * @example
 * trackReaction('awkward_001', '웃으며 넘어간다');
 */
export const trackReaction = (reactionId: string, selectedReaction: string) => {
  gtag.event({
    action: 'situation_reaction',
    category: 'engagement',
    label: reactionId,
  });
};

/**
 * 7. 랭킹 투표 추적
 * @param testType - 테스트 종류
 * @param resultKey - 결과 키
 *
 * @example
 * trackRankingVote('dog', 'retriever');
 */
export const trackRankingVote = (testType: string, resultKey: string) => {
  gtag.event({
    action: 'ranking_vote',
    category: 'engagement',
    label: `${testType}_${resultKey}`,
  });
};

/**
 * 8. 페이지 체류 시간 추적
 * @param pageName - 페이지 이름
 * @param duration - 체류 시간 (밀리초)
 *
 * @example
 * trackPageDwell('test_result', 30000); // 30초 체류
 */
export const trackPageDwell = (pageName: string, duration: number) => {
  gtag.event({
    action: 'page_dwell',
    category: 'engagement',
    label: pageName,
    value: Math.round(duration / 1000),
  });
};
