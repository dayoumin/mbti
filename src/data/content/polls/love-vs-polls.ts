// ============================================================================
// 연애 스타일 VS 투표 콘텐츠
// ============================================================================

import type { VSPoll } from '../types';

// 공통 timeSensitivity 설정 (연애/관계 = low)
const DEFAULT_TIME_SENSITIVITY = {
  timeSensitivity: {
    sensitivity: 'low' as const,
    sourceYear: 2025,
  },
};

export const LOVE_VS_POLLS: VSPoll[] = [
  // ==========================================================================
  // 연애 커뮤니케이션 스타일
  // ==========================================================================
  {
    id: 'vs-love-style-001',
    category: 'love',
    question: '연애 스타일은?',
    optionA: {
      id: 'a',
      text: '밀당 (설렘 중요)',
      emoji: '🎭',
      insightTags: { decision: ['indirect'], personality: ['emotional'] },
    },
    optionB: {
      id: 'b',
      text: '직진 (솔직함 중요)',
      emoji: '🚀',
      insightTags: { decision: ['direct', 'practical'] },
    },
    tags: ['love', 'relationship', '연애스타일'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'vs-love-style-002',
    category: 'love',
    question: '연락 스타일은?',
    optionA: {
      id: 'a',
      text: '자주 연락 (수시로)',
      emoji: '💬',
      insightTags: { personality: ['extroverted', 'supportive'] },
    },
    optionB: {
      id: 'b',
      text: '자유롭게 (필요할 때)',
      emoji: '🕊️',
      insightTags: { personality: ['introverted', 'independent'] },
    },
    tags: ['love', 'relationship', '연락'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'vs-love-style-003',
    category: 'love',
    question: '사랑 표현 방식은?',
    optionA: {
      id: 'a',
      text: '말로 표현 (자주 말함)',
      emoji: '💕',
      insightTags: { personality: ['expressive'], decision: ['direct'] },
    },
    optionB: {
      id: 'b',
      text: '행동으로 표현 (챙겨줌)',
      emoji: '🎁',
      insightTags: { personality: ['reserved', 'supportive'] },
    },
    tags: ['love', 'relationship', '표현'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },

  // ==========================================================================
  // 데이트 & 일상
  // ==========================================================================
  {
    id: 'vs-love-date-001',
    category: 'love',
    question: '데이트 장소 선호는?',
    optionA: {
      id: 'a',
      text: '집 데이트 (편안함)',
      emoji: '🏠',
      insightTags: { personality: ['introverted'], decision: ['safe'] },
    },
    optionB: {
      id: 'b',
      text: '외출 데이트 (활동)',
      emoji: '🎡',
      insightTags: { personality: ['extroverted'], decision: ['adventurous'] },
    },
    tags: ['love', 'relationship', '데이트'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'vs-love-date-002',
    category: 'love',
    question: '데이트 계획은?',
    optionA: {
      id: 'a',
      text: '미리 계획 (코스 정함)',
      emoji: '📋',
      insightTags: { personality: ['structured'], decision: ['practical'] },
    },
    optionB: {
      id: 'b',
      text: '즉흥적으로 (그때그때)',
      emoji: '🎲',
      insightTags: { personality: ['spontaneous'], decision: ['adventurous'] },
    },
    tags: ['love', 'relationship', '데이트', '계획'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'vs-love-date-003',
    category: 'love',
    question: '함께하는 시간 vs 개인 시간?',
    optionA: {
      id: 'a',
      text: '최대한 함께 (매일 보고싶어)',
      emoji: '💑',
      insightTags: { personality: ['extroverted'], decision: ['together'] },
    },
    optionB: {
      id: 'b',
      text: '각자 시간도 중요 (균형)',
      emoji: '⚖️',
      insightTags: { personality: ['introverted', 'independent'] },
    },
    tags: ['love', 'relationship', '시간관리'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },

  // ==========================================================================
  // 갈등 해결 & 소통
  // ==========================================================================
  {
    id: 'vs-love-conflict-001',
    category: 'love',
    question: '싸우면 먼저 연락하는 편?',
    optionA: {
      id: 'a',
      text: '내가 먼저 (빨리 풀고 싶어)',
      emoji: '📱',
      insightTags: { personality: ['supportive', 'emotional'], relationship: ['accommodating'] },
    },
    optionB: {
      id: 'b',
      text: '상대가 먼저 오길 (기다림)',
      emoji: '⏳',
      insightTags: { relationship: ['assertive'], decision: ['practical'] },
    },
    tags: ['love', 'relationship', '갈등', '화해'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'vs-love-conflict-002',
    category: 'love',
    question: '갈등 상황에서 내 스타일은?',
    optionA: {
      id: 'a',
      text: '바로 대화 (즉시 해결)',
      emoji: '💬',
      insightTags: { decision: ['direct'], personality: ['expressive'] },
    },
    optionB: {
      id: 'b',
      text: '시간 갖고 정리 (쿨타임)',
      emoji: '🧠',
      insightTags: { decision: ['indirect', 'practical'] },
    },
    tags: ['love', 'relationship', '갈등', '소통'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },

  // ==========================================================================
  // 애정 표현 & 스킨십
  // ==========================================================================
  {
    id: 'vs-love-affection-001',
    category: 'love',
    question: '스킨십 선호는?',
    optionA: {
      id: 'a',
      text: '자주 (손잡기, 안기)',
      emoji: '🤗',
      insightTags: { personality: ['expressive'], decision: ['together'] },
    },
    optionB: {
      id: 'b',
      text: '적당히 (가끔)',
      emoji: '🤝',
      insightTags: { personality: ['reserved', 'independent'] },
    },
    tags: ['love', 'relationship', '스킨십'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
  {
    id: 'vs-love-affection-002',
    category: 'love',
    question: 'SNS 커플 인증은?',
    optionA: {
      id: 'a',
      text: '자주 올림 (프사, 스토리)',
      emoji: '📷',
      insightTags: { personality: ['expressive', 'extroverted'] },
    },
    optionB: {
      id: 'b',
      text: '안 올림 (우리끼리)',
      emoji: '🔒',
      insightTags: { personality: ['reserved', 'introverted'] },
    },
    tags: ['love', 'relationship', 'SNS', '인증'],
  meta: { ...DEFAULT_TIME_SENSITIVITY },
  },
];

export default LOVE_VS_POLLS;
