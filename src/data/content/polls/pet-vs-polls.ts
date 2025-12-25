// ============================================================================
// 반려동물 VS 투표 콘텐츠
// ============================================================================

import type { VSPoll } from '../types';

export const PET_VS_POLLS: VSPoll[] = [
  // ==========================================================================
  // 반려동물 종류 VS
  // ==========================================================================
  {
    id: 'vs-pet-species-001',
    category: 'general',
    question: '고양이 vs 강아지?',
    optionA: { id: 'a', text: '고양이 (독립적 매력)', emoji: '🐱' },
    optionB: { id: 'b', text: '강아지 (충직한 친구)', emoji: '🐶' },
    tags: ['반려동물', '고양이', '강아지'],
  },
  {
    id: 'vs-pet-species-002',
    category: 'general',
    question: '토끼 vs 햄스터?',
    optionA: { id: 'a', text: '토끼 (폴짝폴짝)', emoji: '🐰' },
    optionB: { id: 'b', text: '햄스터 (볼주머니 귀요미)', emoji: '🐹' },
    tags: ['반려동물', '토끼', '햄스터'],
  },
  {
    id: 'vs-pet-species-003',
    category: 'general',
    question: '대형견 vs 소형견?',
    optionA: { id: 'a', text: '대형견 (든든한 친구)', emoji: '🦮' },
    optionB: { id: 'b', text: '소형견 (귀여운 동반자)', emoji: '🐕' },
    tags: ['반려동물', '강아지', '품종'],
  },
  {
    id: 'vs-pet-species-004',
    category: 'general',
    question: '털 많은 품종 vs 털 적은 품종?',
    optionA: { id: 'a', text: '털 많은 품종 (몽글몽글)', emoji: '🦁' },
    optionB: { id: 'b', text: '털 적은 품종 (관리 편함)', emoji: '✨' },
    tags: ['반려동물', '품종', '관리'],
  },

  // ==========================================================================
  // 반려동물 관리 VS
  // ==========================================================================
  {
    id: 'vs-pet-care-001',
    category: 'general',
    question: '습식 사료 vs 건식 사료?',
    optionA: { id: 'a', text: '습식 (촉촉하고 맛있어)', emoji: '🥫' },
    optionB: { id: 'b', text: '건식 (편하고 치아 건강)', emoji: '🥣' },
    tags: ['반려동물', '사료', '관리'],
  },
  {
    id: 'vs-pet-care-002',
    category: 'general',
    question: '목욕 주기는?',
    optionA: { id: 'a', text: '자주 (청결 우선)', emoji: '🛁' },
    optionB: { id: 'b', text: '가끔 (피부 건강 우선)', emoji: '💧' },
    tags: ['반려동물', '목욕', '관리'],
  },
  {
    id: 'vs-pet-care-003',
    category: 'general',
    question: '반려동물 간식 선호는?',
    optionA: { id: 'a', text: '수제 간식 (직접 만듦)', emoji: '👨‍🍳' },
    optionB: { id: 'b', text: '시판 간식 (편하게)', emoji: '🛒' },
    tags: ['반려동물', '간식', '관리'],
  },

  // ==========================================================================
  // 반려동물 라이프스타일 VS
  // ==========================================================================
  {
    id: 'vs-pet-life-001',
    category: 'general',
    question: '반려동물과 잠잘 때?',
    optionA: { id: 'a', text: '같이 잔다 (침대 공유)', emoji: '🛏️' },
    optionB: { id: 'b', text: '따로 잔다 (전용 공간)', emoji: '🏠' },
    tags: ['반려동물', '생활', '수면'],
  },
  {
    id: 'vs-pet-life-002',
    category: 'general',
    question: '반려동물 장난감 구매 주기?',
    optionA: { id: 'a', text: '자주 사줌 (계속 새로운 거)', emoji: '🎁' },
    optionB: { id: 'b', text: '가끔 사줌 (아껴 쓰기)', emoji: '🧸' },
    tags: ['반려동물', '장난감', '소비'],
  },
  {
    id: 'vs-pet-life-003',
    category: 'general',
    question: '반려동물 옷 입히는 거?',
    optionA: { id: 'a', text: '좋아함 (패션 아이템)', emoji: '👕' },
    optionB: { id: 'b', text: '안 좋아함 (자연스럽게)', emoji: '🚫' },
    tags: ['반려동물', '옷', '패션'],
  },
];

export default PET_VS_POLLS;
