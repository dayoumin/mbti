// VS 투표 유틸리티 함수

import { VoteResults } from './types';

/**
 * pollId 기반으로 안정적인(결정론적) 투표 결과 생성
 * 실제 백엔드 연동 전까지 목업으로 사용
 */
export const getStablePollResults = (pollId: string): VoteResults => {
  const seedStr = String(pollId || '');
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = ((hash << 5) - hash + seedStr.charCodeAt(i)) | 0;
  }
  const base = Math.abs(hash) % 41; // 0..40
  const a = 30 + base; // 30..70
  return { a, b: 100 - a };
};
