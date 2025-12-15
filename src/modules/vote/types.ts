// VS 투표 모듈 타입 정의
// 기존 src/data/content/types.ts의 VSPoll과 호환

export type { VSPoll, VSPollOption } from '@/data/content/types';

// 투표 결과 (목업/집계용)
export interface VoteResults {
  a: number;  // 퍼센트
  b: number;  // 퍼센트
}
