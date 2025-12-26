// ============================================================================
// 커피 VS 투표 콘텐츠
// ============================================================================

import type { VSPoll } from '../types';

export const COFFEE_VS_POLLS: VSPoll[] = [
  // ==========================================================================
  // 커피 종류
  // ==========================================================================
  {
    id: 'vs-coffee-001',
    category: 'coffee',
    question: '커피 원두는?',
    optionA: { id: 'a', text: '아라비카 (부드러움)', emoji: '🌸' },
    optionB: { id: 'b', text: '로부스타 (진함)', emoji: '💪' },
    tags: ['coffee', '원두', '취향'],
    meta: {
      timeSensitivity: {
        sensitivity: 'none',
        sourceYear: 2025
      }
    },
  },
  {
    id: 'vs-coffee-002',
    category: 'coffee',
    question: '에스프레소 베이스 메뉴는?',
    optionA: { id: 'a', text: '에스프레소 (진하게)', emoji: '☕' },
    optionB: { id: 'b', text: '아메리카노 (연하게)', emoji: '💧' },
    tags: ['coffee', '메뉴', '농도'],
  },
  {
    id: 'vs-coffee-003',
    category: 'coffee',
    question: '우유 들어간 커피는?',
    optionA: { id: 'a', text: '라떼 (부드러움)', emoji: '🥛' },
    optionB: { id: 'b', text: '카푸치노 (폼 듬뿍)', emoji: '☁️' },
    tags: ['coffee', '우유', '메뉴'],
  },
  {
    id: 'vs-coffee-004',
    category: 'coffee',
    question: '달달한 커피는?',
    optionA: { id: 'a', text: '카라멜 마끼아또', emoji: '🍮' },
    optionB: { id: 'b', text: '바닐라 라떼', emoji: '🍨' },
    tags: ['coffee', '달콤', '시럽'],
  },

  // ==========================================================================
  // 로스팅/추출
  // ==========================================================================
  {
    id: 'vs-coffee-005',
    category: 'coffee',
    question: '로스팅 정도는?',
    optionA: { id: 'a', text: '라이트 (과일향)', emoji: '🍊' },
    optionB: { id: 'b', text: '다크 (스모키)', emoji: '🔥' },
    tags: ['coffee', '로스팅', '향'],
  },
  {
    id: 'vs-coffee-006',
    category: 'coffee',
    question: '커피 추출 방식은?',
    optionA: { id: 'a', text: '드립 (깔끔)', emoji: '💧' },
    optionB: { id: 'b', text: '프렌치프레스 (진함)', emoji: '⚗️' },
    tags: ['coffee', '추출', '방식'],
  },
  {
    id: 'vs-coffee-007',
    category: 'coffee',
    question: '분쇄도는?',
    optionA: { id: 'a', text: '곱게 (에스프레소용)', emoji: '✨' },
    optionB: { id: 'b', text: '굵게 (프렌치프레스용)', emoji: '🔶' },
    tags: ['coffee', '분쇄', '입자'],
  },

  // ==========================================================================
  // 카페인/취향
  // ==========================================================================
  {
    id: 'vs-coffee-008',
    category: 'coffee',
    question: '카페인 필요할 때?',
    optionA: { id: 'a', text: '더블샷 (강하게)', emoji: '💥' },
    optionB: { id: 'b', text: '싱글샷 (적당히)', emoji: '🌿' },
    tags: ['coffee', '카페인', '강도'],
  },
  {
    id: 'vs-coffee-009',
    category: 'coffee',
    question: '디카페인 어때?',
    optionA: { id: 'a', text: '괜찮음 (향 즐기기)', emoji: '🌙' },
    optionB: { id: 'b', text: '안 마심 (카페인 필수)', emoji: '⚡' },
    tags: ['coffee', '디카페인', '카페인'],
  },
  {
    id: 'vs-coffee-010',
    category: 'coffee',
    question: '커피 맛 선호는?',
    optionA: { id: 'a', text: '산미 강한 (과일향)', emoji: '🍋' },
    optionB: { id: 'b', text: '쓴맛 강한 (초콜릿향)', emoji: '🍫' },
    tags: ['coffee', '맛', '향'],
  },
];

export default COFFEE_VS_POLLS;
