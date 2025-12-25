// ============================================================================
// 혈액형 궁합 VS 투표 콘텐츠
// ============================================================================

import type { VSPoll } from '../types';

export const BLOODTYPE_VS_POLLS: VSPoll[] = [
  // ==========================================================================
  // 혈액형 커플 궁합
  // ==========================================================================
  {
    id: 'vs-bloodtype-couple-001',
    category: 'bloodtype',
    question: 'A형 + B형 커플 vs O형 + AB형 커플, 더 잘 맞을까?',
    optionA: { id: 'a', text: 'A형 + B형 (정반대 매력)', emoji: '🅰️🅱️' },
    optionB: { id: 'b', text: 'O형 + AB형 (보완 관계)', emoji: '🅾️🆎' },
    tags: ['bloodtype', 'relationship', '궁합'],
  },
  {
    id: 'vs-bloodtype-couple-002',
    category: 'bloodtype',
    question: 'A형끼리 커플 vs O형끼리 커플, 더 오래 갈까?',
    optionA: { id: 'a', text: 'A형끼리 (서로 이해)', emoji: '🅰️🅰️' },
    optionB: { id: 'b', text: 'O형끼리 (편안함)', emoji: '🅾️🅾️' },
    tags: ['bloodtype', 'relationship', '같은혈액형'],
  },
  {
    id: 'vs-bloodtype-couple-003',
    category: 'bloodtype',
    question: 'B형 + AB형 커플 vs A형 + O형 커플, 더 케미 좋을까?',
    optionA: { id: 'a', text: 'B형 + AB형 (자유로운 조합)', emoji: '🅱️🆎' },
    optionB: { id: 'b', text: 'A형 + O형 (안정적 조합)', emoji: '🅰️🅾️' },
    tags: ['bloodtype', 'relationship', '케미'],
  },

  // ==========================================================================
  // 혈액형별 남자 스타일
  // ==========================================================================
  {
    id: 'vs-bloodtype-man-001',
    category: 'bloodtype',
    question: 'A형 남자 vs B형 남자, 더 로맨틱할까?',
    optionA: { id: 'a', text: 'A형 남자 (세심한 배려)', emoji: '💐' },
    optionB: { id: 'b', text: 'B형 남자 (자유로운 낭만)', emoji: '🎸' },
    tags: ['bloodtype', 'relationship', '남자', '로맨스'],
  },
  {
    id: 'vs-bloodtype-man-002',
    category: 'bloodtype',
    question: 'O형 남자 vs AB형 남자, 더 다정할까?',
    optionA: { id: 'a', text: 'O형 남자 (따뜻한 포용)', emoji: '🤗' },
    optionB: { id: 'b', text: 'AB형 남자 (섬세한 감성)', emoji: '🎨' },
    tags: ['bloodtype', 'relationship', '남자', '성격'],
  },

  // ==========================================================================
  // 혈액형별 여자 스타일
  // ==========================================================================
  {
    id: 'vs-bloodtype-woman-001',
    category: 'bloodtype',
    question: 'A형 여자 vs B형 여자, 더 매력적일까?',
    optionA: { id: 'a', text: 'A형 여자 (차분한 매력)', emoji: '🌸' },
    optionB: { id: 'b', text: 'B형 여자 (발랄한 매력)', emoji: '✨' },
    tags: ['bloodtype', 'relationship', '여자', '매력'],
  },
  {
    id: 'vs-bloodtype-woman-002',
    category: 'bloodtype',
    question: 'O형 여자 vs AB형 여자, 사귀기 더 편할까?',
    optionA: { id: 'a', text: 'O형 여자 (털털한 성격)', emoji: '😊' },
    optionB: { id: 'b', text: 'AB형 여자 (독특한 감성)', emoji: '🎭' },
    tags: ['bloodtype', 'relationship', '여자', '성격'],
  },

  // ==========================================================================
  // 혈액형 갈등 상황
  // ==========================================================================
  {
    id: 'vs-bloodtype-conflict-001',
    category: 'bloodtype',
    question: '싸웠을 때 먼저 연락할 확률이 높은 건?',
    optionA: { id: 'a', text: 'A형 (참다가 먼저)', emoji: '📱' },
    optionB: { id: 'b', text: 'O형 (쿨하게 먼저)', emoji: '💬' },
    tags: ['bloodtype', 'relationship', '갈등', '화해'],
  },
  {
    id: 'vs-bloodtype-conflict-002',
    category: 'bloodtype',
    question: '갈등 해결 스타일은?',
    optionA: { id: 'a', text: 'B형 (솔직하게 터놓기)', emoji: '💥' },
    optionB: { id: 'b', text: 'AB형 (이성적으로 풀기)', emoji: '🧠' },
    tags: ['bloodtype', 'relationship', '갈등', '소통'],
  },

  // ==========================================================================
  // 혈액형 데이트 스타일
  // ==========================================================================
  {
    id: 'vs-bloodtype-date-001',
    category: 'bloodtype',
    question: '데이트 계획 더 잘 짤 것 같은 건?',
    optionA: { id: 'a', text: 'A형 (완벽한 플랜)', emoji: '📋' },
    optionB: { id: 'b', text: 'B형 (즉흥적 재미)', emoji: '🎲' },
    tags: ['bloodtype', 'relationship', '데이트', '계획'],
  },
];

export default BLOODTYPE_VS_POLLS;
