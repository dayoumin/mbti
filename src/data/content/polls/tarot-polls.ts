// ============================================================================
// 타로 투표 콘텐츠 (20개)
// ============================================================================
//
// 출처: research/tarot/01-major-arcana-mz.md
// 카테고리: tarot
// 구성:
//   - 카드 대결 (vs): 10개
//   - 상황 선택 (choice): 5개
//   - 밸런스 게임 (vs): 5개
//
// ============================================================================

import type { VSPoll, ChoicePoll } from '../types';

// ============================================================================
// 1. 카드 대결 (vs) - 10개
// ============================================================================

export const TAROT_VS_POLLS: VSPoll[] = [
  {
    id: 'tarot-poll-001',
    category: 'tarot',
    question: '더 당기는 에너지는?',
    optionA: { id: 'a', text: 'The Fool (새로운 시작)', emoji: '🎒' },
    optionB: { id: 'b', text: 'The World (완성과 성취)', emoji: '🌍' },
    tags: ['The Fool', 'The World', '에너지'],
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    },
  },
  {
    id: 'tarot-poll-002',
    category: 'tarot',
    question: '지금 내게 필요한 건?',
    optionA: { id: 'a', text: 'The Magician (능력 발휘)', emoji: '🎩' },
    optionB: { id: 'b', text: 'Strength (멘탈 갑오)', emoji: '🦁' },
    tags: ['The Magician', 'Strength', '능력'],
  },
  {
    id: 'tarot-poll-003',
    category: 'tarot',
    question: '혼자만의 시간 vs 사람 만나기',
    optionA: { id: 'a', text: 'The Hermit (혼자 성찰)', emoji: '🏔️' },
    optionB: { id: 'b', text: 'The Lovers (사람과 케미)', emoji: '💕' },
    tags: ['The Hermit', 'The Lovers', '관계'],
  },
  {
    id: 'tarot-poll-004',
    category: 'tarot',
    question: '인생 리셋 vs 현재 유지',
    optionA: { id: 'a', text: 'Death (환골탈태)', emoji: '💀' },
    optionB: { id: 'b', text: 'Temperance (균형 유지)', emoji: '⚖️' },
    tags: ['Death', 'Temperance', '변화'],
  },
  {
    id: 'tarot-poll-005',
    category: 'tarot',
    question: '지금 내 상태는?',
    optionA: { id: 'a', text: 'The Sun (텐션 최고조)', emoji: '☀️' },
    optionB: { id: 'b', text: 'The Moon (새벽 감성)', emoji: '🌙' },
    tags: ['The Sun', 'The Moon', '감정'],
  },
  {
    id: 'tarot-poll-006',
    category: 'tarot',
    question: '직관 vs 논리, 어느 쪽?',
    optionA: { id: 'a', text: 'The High Priestess (직관력)', emoji: '🔮' },
    optionB: { id: 'b', text: 'Justice (이성적 판단)', emoji: '⚖️' },
    tags: ['The High Priestess', 'Justice', '판단'],
  },
  {
    id: 'tarot-poll-007',
    category: 'tarot',
    question: '플렉스 vs 미니멀',
    optionA: { id: 'a', text: 'The Empress (소확행 플렉스)', emoji: '👑' },
    optionB: { id: 'b', text: 'The Hermit (디지털 디톡스)', emoji: '🧘' },
    tags: ['The Empress', 'The Hermit', '라이프스타일'],
  },
  {
    id: 'tarot-poll-008',
    category: 'tarot',
    question: '돌진 vs 존버',
    optionA: { id: 'a', text: 'The Chariot (질주 모드)', emoji: '🏎️' },
    optionB: { id: 'b', text: 'The Hanged Man (존버 타임)', emoji: '⏳' },
    tags: ['The Chariot', 'The Hanged Man', '행동'],
  },
  {
    id: 'tarot-poll-009',
    category: 'tarot',
    question: '계획적 vs 즉흥적',
    optionA: { id: 'a', text: 'The Emperor (체계 잡기)', emoji: '🏛️' },
    optionB: { id: 'b', text: 'Wheel of Fortune (운에 맡김)', emoji: '🎡' },
    tags: ['The Emperor', 'Wheel of Fortune', '스타일'],
  },
  {
    id: 'tarot-poll-010',
    category: 'tarot',
    question: '희망 회로 vs 현실 직시',
    optionA: { id: 'a', text: 'The Star (힐링과 희망)', emoji: '⭐' },
    optionB: { id: 'b', text: 'The Tower (멘붕 후 리셋)', emoji: '⚡' },
    tags: ['The Star', 'The Tower', '태도'],
  },
  // 밸런스 게임 (vs) - 5개
  {
    id: 'tarot-poll-016',
    category: 'tarot',
    question: 'The Fool의 밸런스 게임',
    optionA: { id: 'a', text: '100억 받고 평생 집 밖 못 나가기', emoji: '🏠' },
    optionB: { id: 'b', text: '땡전 없이 전 세계 여행 (의식주 해결)', emoji: '✈️' },
    tags: ['The Fool', 'YOLO', '자유'],
  },
  {
    id: 'tarot-poll-017',
    category: 'tarot',
    question: 'The Magician의 밸런스 게임',
    optionA: { id: 'a', text: '모든 외국어 원어민처럼 구사', emoji: '🗣️' },
    optionB: { id: 'b', text: '모든 악기 프로급 연주', emoji: '🎸' },
    tags: ['The Magician', '능력', '재능'],
  },
  {
    id: 'tarot-poll-018',
    category: 'tarot',
    question: 'The Emperor의 밸런스 게임',
    optionA: { id: 'a', text: '창업해서 대박 CEO (워라밸 없음)', emoji: '💼' },
    optionB: { id: 'b', text: '정년 보장 공무원 (칼퇴 보장)', emoji: '🏛️' },
    tags: ['The Emperor', '성공', '선택'],
  },
  {
    id: 'tarot-poll-019',
    category: 'tarot',
    question: 'The Hermit의 밸런스 게임',
    optionA: { id: 'a', text: '무인도 혼자 1년 (인터넷 가능)', emoji: '🏝️' },
    optionB: { id: 'b', text: '싫은 상사와 단둘이 1년 (호화 저택)', emoji: '🏰' },
    tags: ['The Hermit', '고독', '인간관계'],
  },
  {
    id: 'tarot-poll-020',
    category: 'tarot',
    question: 'Wheel of Fortune의 밸런스 게임',
    optionA: { id: 'a', text: '과거로 돌아갈 수 있는 버튼', emoji: '⏮️' },
    optionB: { id: 'b', text: '미래를 미리 볼 수 있는 버튼 (수정 불가)', emoji: '🔮' },
    tags: ['Wheel of Fortune', '운명', '시간'],
  },
];

// ============================================================================
// 2. 상황 선택 (choice) - 5개
// ============================================================================

export const TAROT_CHOICE_POLLS: ChoicePoll[] = [
  {
    id: 'tarot-poll-011',
    category: 'tarot',
    question: '인생 막막할 때 뽑고 싶은 카드는?',
    options: [
      { id: 'a', text: 'The Fool (무모한 출발)', emoji: '🎒' },
      { id: 'b', text: 'The Hermit (혼자 생각)', emoji: '🏔️' },
      { id: 'c', text: 'The Star (희망 회로)', emoji: '⭐' },
      { id: 'd', text: 'Judgement (인생 터닝포인트)', emoji: '📯' },
    ],
    tags: ['인생', '막막함', '고민'],
  },
  {
    id: 'tarot-poll-012',
    category: 'tarot',
    question: '연애할 때 뽑고 싶은 카드는?',
    options: [
      { id: 'a', text: 'The Lovers (썸 성공)', emoji: '💕' },
      { id: 'b', text: 'The Devil (치명적 끌림)', emoji: '😈' },
      { id: 'c', text: 'The Empress (풍요로운 사랑)', emoji: '👑' },
      { id: 'd', text: 'Temperance (건강한 밸런스)', emoji: '⚖️' },
    ],
    tags: ['연애', '사랑', '관계'],
  },
  {
    id: 'tarot-poll-013',
    category: 'tarot',
    question: '직장/학교에서 뽑고 싶은 카드는?',
    options: [
      { id: 'a', text: 'The Magician (능력 폭발)', emoji: '🎩' },
      { id: 'b', text: 'The Emperor (리더십 발휘)', emoji: '🏛️' },
      { id: 'c', text: 'The Chariot (목표 달성)', emoji: '🏎️' },
      { id: 'd', text: 'Strength (멘탈 갑)', emoji: '🦁' },
    ],
    tags: ['직장', '학교', '성공'],
  },
  {
    id: 'tarot-poll-014',
    category: 'tarot',
    question: '멘탈 흔들릴 때 뽑고 싶은 카드는?',
    options: [
      { id: 'a', text: 'Strength (외유내강)', emoji: '🦁' },
      { id: 'b', text: 'The Sun (텐션업)', emoji: '☀️' },
      { id: 'c', text: 'Death (리셋하고 재시작)', emoji: '💀' },
      { id: 'd', text: 'The Hanged Man (존버의 힘)', emoji: '⏳' },
    ],
    tags: ['멘탈', '힐링', '회복'],
  },
  {
    id: 'tarot-poll-015',
    category: 'tarot',
    question: '변화가 필요할 때 뽑고 싶은 카드는?',
    options: [
      { id: 'a', text: 'Death (환골탈태)', emoji: '💀' },
      { id: 'b', text: 'The Tower (멘붕 후 새출발)', emoji: '⚡' },
      { id: 'c', text: 'Wheel of Fortune (운의 반전)', emoji: '🎡' },
      { id: 'd', text: 'Judgement (새로운 부름)', emoji: '📯' },
    ],
    tags: ['변화', '전환', '새출발'],
  },
];

// ============================================================================
// Export (레거시 호환)
// ============================================================================

// 통합 배열 (레거시: Poll 타입 호환용)
export const TAROT_POLLS = {
  vs: TAROT_VS_POLLS,
  choice: TAROT_CHOICE_POLLS,
};

export default TAROT_POLLS;
