// ============================================================================
// Choice 투표 (다중 선택지)
// ============================================================================

import type { ChoicePoll } from '../types';

export const CHOICE_POLLS: ChoicePoll[] = [
  {
    id: 'choice-life-001',
    category: 'lifestyle',
    question: '여건이 된다면 낳고 싶은 자녀 수는?',
    options: [
      { id: 'a', text: '0명 (딩크/비혼)', emoji: '🙅' },
      { id: 'b', text: '1명', emoji: '👶' },
      { id: 'c', text: '2명', emoji: '👶👶' },
      { id: 'd', text: '3명', emoji: '👨‍👩‍👧' },
      { id: 'e', text: '4명 이상', emoji: '👨‍👩‍👧‍👦' },
    ],
    tags: ['라이프스타일', '가족', '자녀'],
    meta: { minAge: '20s' },
  },

  // ============================================================================
  // 운세 관심도 투표 (Fortune Interest Polls)
  // ============================================================================
  {
    id: 'choice-fortune-001',
    category: 'fortune',
    question: '가장 궁금한 운세는?',
    options: [
      { id: 'a', text: '오늘의 별자리 운세', emoji: '⭐' },
      { id: 'b', text: '올해 띠별 운세', emoji: '🐍' },
      { id: 'c', text: '타로 카드 한 장 뽑기', emoji: '🃏' },
      { id: 'd', text: '별자리 궁합 보기', emoji: '💕' },
      { id: 'e', text: '운세 안 봄', emoji: '🙅' },
    ],
    tags: ['운세', '별자리', '타로', '띠'],
    meta: { minAge: '20s' },
  },
  {
    id: 'choice-fortune-002',
    category: 'fortune',
    question: '운세를 주로 언제 봐요?',
    options: [
      { id: 'a', text: '아침에 하루 시작 전', emoji: '🌅' },
      { id: 'b', text: '심심할 때 랜덤으로', emoji: '😴' },
      { id: 'c', text: '중요한 결정 앞에서', emoji: '🤔' },
      { id: 'd', text: '새해/생일 같은 특별한 날', emoji: '🎉' },
      { id: 'e', text: '거의 안 봄', emoji: '🙅' },
    ],
    tags: ['운세', '습관', '라이프스타일'],
    meta: { minAge: '20s' },
  },
  {
    id: 'choice-fortune-003',
    category: 'fortune',
    question: '운세 결과 나오면 어떻게 해요?',
    options: [
      { id: 'a', text: '좋은 건 믿고, 나쁜 건 무시', emoji: '😎' },
      { id: 'b', text: '재미로 보고 바로 까먹음', emoji: '😂' },
      { id: 'c', text: '스크샷 찍어서 친구한테 공유', emoji: '📱' },
      { id: 'd', text: '은근히 신경 쓰임', emoji: '😰' },
      { id: 'e', text: '진지하게 참고함', emoji: '🧐' },
    ],
    tags: ['운세', '심리', '재미'],
    meta: { minAge: '20s' },
  },
  {
    id: 'choice-fortune-004',
    category: 'fortune',
    question: '별자리 vs 띠, 뭐가 더 맞는 것 같아요?',
    options: [
      { id: 'a', text: '별자리가 더 맞음', emoji: '⭐' },
      { id: 'b', text: '띠가 더 맞음', emoji: '🐲' },
      { id: 'c', text: '둘 다 맞음', emoji: '🎯' },
      { id: 'd', text: '둘 다 안 맞음', emoji: '❌' },
      { id: 'e', text: 'MBTI가 젤 맞음', emoji: '🧠' },
    ],
    tags: ['운세', '별자리', '띠', 'MBTI'],
    meta: { minAge: '20s' },
  },
  {
    id: 'choice-fortune-005',
    category: 'fortune',
    question: '타로 카드 뽑을 때 제일 궁금한 건?',
    options: [
      { id: 'a', text: '연애/썸 운세', emoji: '💕' },
      { id: 'b', text: '재물/돈 운세', emoji: '💰' },
      { id: 'c', text: '취업/이직 운세', emoji: '💼' },
      { id: 'd', text: '오늘 하루 전체 운세', emoji: '🌞' },
      { id: 'e', text: '타로 안 봄', emoji: '🙅' },
    ],
    tags: ['타로', '운세', '연애', '재물'],
    meta: { minAge: '20s' },
  },
];

export default CHOICE_POLLS;