// ============================================================================
// 세대 감성 퀴즈 - "이거 알면 나이 인증" 시리즈
// ============================================================================
// 바이럴 최적화: 90년대~2000년대 초반 감성 자극
// 타겟: 밀레니얼 세대(80년대 후반~90년대 중반생)
// ============================================================================

import type { KnowledgeQuiz } from '../types';

export const NOSTALGIA_KNOWLEDGE_QUIZZES: KnowledgeQuiz[] = [
  // 1. 90년대 TV 프로그램
  {
    id: 'nostalgia-k-001',
    category: 'general',
    question: '"뽀뽀뽀 아이 조아~" 이 노래는 어느 프로그램의 시그널송?',
    options: [
      { id: 'a', text: '뽀롱뽀롱 뽀로로', isCorrect: false },
      { id: 'b', text: '뽀뽀뽀', isCorrect: true },
      { id: 'c', text: '딩동댕 유치원', isCorrect: false },
      { id: 'd', text: '개구쟁이 스머프', isCorrect: false },
    ],
    explanation: 'KBS "뽀뽀뽀"는 1991년부터 2001년까지 방영된 전설의 유아 프로그램! 뽀미언니, 권혁수 형, 안현영 누나 기억나시나요?',
    difficulty: 1,
    tags: ['추억', '세대감성', '90년대', 'TV프로그램', '유년시절'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['20s', '30s', '40s+'],
    },
  },

  // 2. 추억의 과자
  {
    id: 'nostalgia-k-002',
    category: 'general',
    question: '옛날 문방구에서 10원~50원에 팔던 작고 동그란 껌의 이름은?',
    options: [
      { id: 'a', text: '쫀드기', isCorrect: true },
      { id: 'b', text: '후렌치파이', isCorrect: false },
      { id: 'c', text: '아폴로', isCorrect: false },
      { id: 'd', text: '마이쮸', isCorrect: false },
    ],
    explanation: '쫀드기는 90년대 문방구 필수템! 10원짜리 동전 크기에 색깔별 맛이 달랐죠. 요즘도 편의점에서 팔지만 가격은 20배 올랐어요.',
    difficulty: 1,
    tags: ['추억', '세대감성', '90년대', '과자', '문방구'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['20s', '30s', '40s+'],
    },
  },

  // 3. 문방구 아이템
  {
    id: 'nostalgia-k-003',
    category: 'general',
    question: '90년대 초등학생들이 모으던 딱지 중, 가장 귀했던 것은?',
    options: [
      { id: 'a', text: '포켓몬스터 띠부띠부씰', isCorrect: true },
      { id: 'b', text: '사각 종이딱지', isCorrect: false },
      { id: 'c', text: '짱구 스티커', isCorrect: false },
      { id: 'd', text: '말랑이', isCorrect: false },
    ],
    explanation: '90년대 후반~2000년대 초반 띠부띠부씰 열풍! 친구들과 교환하고 앨범에 모으던 추억... 지금은 빈티지 마켓에서 만 원 넘게 팔려요.',
    difficulty: 2,
    tags: ['추억', '세대감성', '90년대', '문방구', '포켓몬스터', '띠부씰'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['20s', '30s'],
    },
  },

  // 4. 옛날 게임 (오락실)
  {
    id: 'nostalgia-k-004',
    category: 'general',
    question: '90년대 오락실에서 가장 인기 많던 대전 게임은?',
    options: [
      { id: 'a', text: '철권', isCorrect: false },
      { id: 'b', text: 'KOF(킹오브파이터즈)', isCorrect: true },
      { id: 'c', text: '버블버블', isCorrect: false },
      { id: 'd', text: '펌프잇업', isCorrect: false },
    ],
    explanation: 'KOF 시리즈는 90년대 오락실의 황제! 쿄, 이오리, 불지갑, 마이... 캐릭터별 커맨드 외우느라 공책에 적던 기억 있죠?',
    difficulty: 2,
    tags: ['추억', '세대감성', '90년대', '오락실', '게임'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['30s', '40s+'],
    },
  },

  // 5. 추억의 노래/가수
  {
    id: 'nostalgia-k-005',
    category: 'general',
    question: '"캔디캔디" 원곡은 누구의 노래?',
    options: [
      { id: 'a', text: 'H.O.T', isCorrect: true },
      { id: 'b', text: '젝스키스', isCorrect: false },
      { id: 'c', text: '신화', isCorrect: false },
      { id: 'd', text: 'god', isCorrect: false },
    ],
    explanation: '1996년 H.O.T의 데뷔곡 "캔디"! 1세대 아이돌의 전설적인 시작. "내가 제일 잘 나가~"는 2000년대 2NE1이에요.',
    difficulty: 1,
    tags: ['추억', '세대감성', '90년대', '음악', 'H.O.T', '1세대아이돌'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['30s', '40s+'],
    },
  },

  // 6. 학교 급식/매점
  {
    id: 'nostalgia-k-006',
    category: 'general',
    question: '2000년대 초등학교 매점에서 가장 인기 많던 빵은?',
    options: [
      { id: 'a', text: '초코칩 쿠키', isCorrect: false },
      { id: 'b', text: '단팥빵', isCorrect: false },
      { id: 'c', text: '새우깡빵', isCorrect: true },
      { id: 'd', text: '크림빵', isCorrect: false },
    ],
    explanation: '새우깡빵(새우튀김빵)은 2000년대 학교 매점 최강자! 점심시간에 매점 앞 줄 서서 기다리던 그 맛... 지금도 편의점에서 팔아요.',
    difficulty: 2,
    tags: ['추억', '세대감성', '2000년대', '학교', '매점', '빵'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['20s', '30s'],
    },
  },

  // 7. 옛날 핸드폰/전자기기
  {
    id: 'nostalgia-k-007',
    category: 'general',
    question: '2000년대 초중반 가장 인기 많던 슬라이드폰은?',
    options: [
      { id: 'a', text: '애니콜 햅틱', isCorrect: false },
      { id: 'b', text: '초콜릿폰', isCorrect: true },
      { id: 'c', text: '아이폰 3GS', isCorrect: false },
      { id: 'd', text: '싸이언', isCorrect: false },
    ],
    explanation: 'LG 초콜릿폰(2005년)은 그 시대 아이콘! 블랙베리 같은 메탈 바디에 빨간 터치패드... 당시 50만원대로 월급의 절반이 넘는 가격이었어요.',
    difficulty: 1,
    tags: ['추억', '세대감성', '2000년대', '핸드폰', '초콜릿폰'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['30s', '40s+'],
    },
  },

  // 8. 추억의 만화/애니
  {
    id: 'nostalgia-k-008',
    category: 'general',
    question: '"달려라 하니"의 주인공 하니가 타는 탈것은?',
    options: [
      { id: 'a', text: '자전거', isCorrect: false },
      { id: 'b', text: '롤러스케이트', isCorrect: true },
      { id: 'c', text: '킥보드', isCorrect: false },
      { id: 'd', text: '인라인스케이트', isCorrect: false },
    ],
    explanation: '1988년 방영된 "달려라 하니"! 하니는 롤러스케이트를 타고 다녔어요. "오빠 믿지?"하던 그 목소리 기억나시나요?',
    difficulty: 2,
    tags: ['추억', '세대감성', '80년대', '90년대', '애니메이션', '달려라하니'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['30s', '40s+'],
    },
  },

  // 9. 문방구 먹거리
  {
    id: 'nostalgia-k-009',
    category: 'general',
    question: '90년대 문방구에서 팔던 "뽑기"의 다른 이름은?',
    options: [
      { id: 'a', text: '달고나', isCorrect: true },
      { id: 'b', text: '카라멜', isCorrect: false },
      { id: 'c', text: '엿', isCorrect: false },
      { id: 'd', text: '캔디', isCorrect: false },
    ],
    explanation: '달고나(뽑기)는 설탕을 녹여 만든 추억의 간식! 모양 안 깨고 바늘로 파내면 하나 더 주던... 2021년 "오징어게임"으로 전세계적 재유행!',
    difficulty: 1,
    tags: ['추억', '세대감성', '90년대', '문방구', '달고나', '뽑기'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['20s', '30s', '40s+'],
    },
  },

  // 10. 놀이터/동네 문화
  {
    id: 'nostalgia-k-010',
    category: 'general',
    question: '90년대 놀이터에서 가장 위험했던(?) 놀이기구는?',
    options: [
      { id: 'a', text: '시소', isCorrect: false },
      { id: 'b', text: '그네', isCorrect: false },
      { id: 'c', text: '회전무당(지구)', isCorrect: true },
      { id: 'd', text: '미끄럼틀', isCorrect: false },
    ],
    explanation: '회전무당(지구)은 빙글빙글 돌리다 튕겨나가기 일쑤! 안전사고 때문에 대부분 철거되었어요. 추억 속에만 남은 놀이기구...',
    difficulty: 2,
    tags: ['추억', '세대감성', '90년대', '놀이터', '유년시절'],
    meta: {
      timeSensitivity: {
        sensitivity: 'medium',
        sourceYear: 2025,
      },
      targetAges: ['30s', '40s+'],
    },
  },
];

// 통계
export const NOSTALGIA_QUIZ_STATS = {
  total: NOSTALGIA_KNOWLEDGE_QUIZZES.length,
  byDifficulty: {
    easy: NOSTALGIA_KNOWLEDGE_QUIZZES.filter(q => q.difficulty === 1).length,
    medium: NOSTALGIA_KNOWLEDGE_QUIZZES.filter(q => q.difficulty === 2).length,
    hard: NOSTALGIA_KNOWLEDGE_QUIZZES.filter(q => q.difficulty === 3).length,
  },
};
