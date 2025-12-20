// VS 투표 모듈 exports

export { default as VSPollCard } from './VSPollCard';
export * from './types';
export * from './utils';

// 기존 데이터 re-export
export { VS_POLLS, default as vsPolls } from '@/data/content/polls';
export { getRandomPoll } from '@/data/content';
