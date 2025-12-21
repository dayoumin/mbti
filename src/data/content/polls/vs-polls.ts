// ============================================================================
// VS 투표 콘텐츠
// ============================================================================

import type { VSPoll } from '../types';

export const VS_POLLS: VSPoll[] = [
  // ==========================================================================
  // 난제/바이럴 (Controversial/Viral) - 상단 배치하여 참여 유도
  // ==========================================================================
  {
    id: 'vs-viral-001',
    category: 'lifestyle',
    question: '민초 vs 반민초',
    optionA: { id: 'a', text: '민초는 사랑입니다', emoji: '🌿🍫' },
    optionB: { id: 'b', text: '민초는 치약 맛일 뿐', emoji: '🪥' },
    tags: ['음식', '취향'],
  },
  {
    id: 'vs-viral-002',
    category: 'lifestyle',
    question: '탕수육 먹는 법?',
    optionA: { id: 'a', text: '부먹 (촉촉함)', emoji: '☔' },
    optionB: { id: 'b', text: '찍먹 (바삭함)', emoji: '✨' },
    tags: ['음식', '탕수육'],
  },
  {
    id: 'vs-viral-003',
    category: 'lifestyle',
    question: '하와이안 피자(파인애플)',
    optionA: { id: 'a', text: '극호! 단짠의 완성', emoji: '🍍🍕' },
    optionB: { id: 'b', text: '불호! 과일은 후식으로', emoji: '🚫' },
    tags: ['음식', '피자'],
  },
  {
    id: 'vs-viral-004',
    category: 'love',
    question: '내 애인의 깻잎 논쟁',
    optionA: { id: 'a', text: '친구가 못 떼면 떼줄 수 있지', emoji: '🍃' },
    optionB: { id: 'b', text: '안 돼! 젓가락질은 금지', emoji: '❌' },
    tags: ['연애', '논쟁'],
  },
  {
    id: 'vs-viral-005',
    category: 'love',
    question: '애인의 남사친/여사친과 단둘이 술?',
    optionA: { id: 'a', text: '믿으니까 상관 없음', emoji: '🤝' },
    optionB: { id: 'b', text: '절대 안 됨', emoji: '🛑' },
    tags: ['연애', '질투'],
  },

  // ==========================================================================
  // 고양이
  // ==========================================================================
  {
    id: 'vs-cat-001',
    category: 'cat',
    question: '고양이 사료 선택은?',
    optionA: { id: 'a', text: '습식', emoji: '🥫' },
    optionB: { id: 'b', text: '건식', emoji: '🥣' },
    tags: ['사료', '고양이'],
  },
  {
    id: 'vs-cat-002',
    category: 'cat',
    question: '고양이 털 길이 취향은?',
    optionA: { id: 'a', text: '장모', emoji: '🦁' },
    optionB: { id: 'b', text: '단모', emoji: '🐱' },
    tags: ['품종', '고양이'],
  },
  {
    id: 'vs-cat-003',
    category: 'cat',
    question: '캣타워 vs 캣폴?',
    optionA: { id: 'a', text: '캣타워', emoji: '🏰' },
    optionB: { id: 'b', text: '캣폴', emoji: '🌳' },
    tags: ['용품', '고양이'],
  },
  {
    id: 'vs-cat-004',
    category: 'cat',
    question: '고양이 장난감은?',
    optionA: { id: 'a', text: '낚싯대', emoji: '🎣' },
    optionB: { id: 'b', text: '레이저 포인터', emoji: '🔴' },
    tags: ['장난감', '고양이'],
  },
  {
    id: 'vs-cat-005',
    category: 'cat',
    question: '고양이 모래 타입은?',
    optionA: { id: 'a', text: '벤토나이트', emoji: '⬜' },
    optionB: { id: 'b', text: '두부모래', emoji: '🟫' },
    tags: ['용품', '고양이'],
  },

  // ==========================================================================
  // 강아지
  // ==========================================================================
  {
    id: 'vs-dog-001',
    category: 'dog',
    question: '산책 시간 선호는?',
    optionA: { id: 'a', text: '아침 산책', emoji: '🌅' },
    optionB: { id: 'b', text: '저녁 산책', emoji: '🌆' },
    tags: ['산책', '강아지'],
  },
  {
    id: 'vs-dog-002',
    category: 'dog',
    question: '강아지 목줄 타입은?',
    optionA: { id: 'a', text: '목줄', emoji: '🔗' },
    optionB: { id: 'b', text: '하네스', emoji: '🦺' },
    tags: ['용품', '강아지'],
  },
  {
    id: 'vs-dog-003',
    category: 'dog',
    question: '강아지 미용은?',
    optionA: { id: 'a', text: '미용실', emoji: '💇' },
    optionB: { id: 'b', text: '셀프 미용', emoji: '🏠' },
    tags: ['미용', '강아지'],
  },
  {
    id: 'vs-dog-004',
    category: 'dog',
    question: '보상으로 더 좋아하는 건?',
    optionA: { id: 'a', text: '간식', emoji: '🦴' },
    optionB: { id: 'b', text: '장난감', emoji: '🧸' },
    tags: ['훈련', '강아지'],
  },
  {
    id: 'vs-dog-005',
    category: 'dog',
    question: '놀이 스타일 선호는?',
    optionA: { id: 'a', text: '노즈워크', emoji: '👃' },
    optionB: { id: 'b', text: '터그 놀이', emoji: '🪢' },
    tags: ['놀이', '강아지'],
  },

  // ==========================================================================
  // 반려동물 일반
  // ==========================================================================
  {
    id: 'vs-pet-001',
    category: 'general',
    question: '반려동물 사진 찍을 때?',
    optionA: { id: 'a', text: '자연스러운 순간', emoji: '📸' },
    optionB: { id: 'b', text: '포즈 잡혀주길 기다림', emoji: '🎬' },
    tags: ['반려동물'],
  },
  {
    id: 'vs-pet-002',
    category: 'general',
    question: '반려동물 이름 스타일?',
    optionA: { id: 'a', text: '귀여운 이름 (콩이, 봄이)', emoji: '💕' },
    optionB: { id: 'b', text: '멋진 이름 (루카, 레오)', emoji: '✨' },
    tags: ['반려동물'],
  },

  // ==========================================================================
  // 연애
  // ==========================================================================
  {
    id: 'vs-love-001',
    category: 'love',
    question: '연애 스타일은?',
    optionA: { id: 'a', text: '밀당', emoji: '🎭' },
    optionB: { id: 'b', text: '직진', emoji: '🚀' },
    tags: ['연애'],
  },
  {
    id: 'vs-love-002',
    category: 'love',
    question: '싸우면 먼저 연락하는 편?',
    optionA: { id: 'a', text: '내가 먼저', emoji: '📱' },
    optionB: { id: 'b', text: '상대가 먼저 오길 기다림', emoji: '⏳' },
    tags: ['연애', '갈등'],
  },
  {
    id: 'vs-love-003',
    category: 'love',
    question: '데이트 장소 선호는?',
    optionA: { id: 'a', text: '집 데이트', emoji: '🏠' },
    optionB: { id: 'b', text: '외출 데이트', emoji: '🎡' },
    tags: ['연애', '데이트'],
  },
  {
    id: 'vs-love-004',
    category: 'love',
    question: '연락 스타일은?',
    optionA: { id: 'a', text: '영상통화', emoji: '📹' },
    optionB: { id: 'b', text: '문자/카톡', emoji: '💬' },
    tags: ['연애', '연락'],
  },
  {
    id: 'vs-love-005',
    category: 'love',
    question: '이벤트 스타일은?',
    optionA: { id: 'a', text: '깜짝 서프라이즈', emoji: '🎁' },
    optionB: { id: 'b', text: '계획된 이벤트', emoji: '📅' },
    tags: ['연애', '이벤트'],
  },

  // ==========================================================================
  // 라이프스타일
  // ==========================================================================
  {
    id: 'vs-life-001',
    category: 'lifestyle',
    question: '커피 온도 선호는?',
    optionA: { id: 'a', text: '뜨거운 커피', emoji: '☕' },
    optionB: { id: 'b', text: '아이스 커피', emoji: '🧊' },
    tags: ['커피', '라이프스타일'],
  },
  {
    id: 'vs-life-002',
    category: 'lifestyle',
    question: '커피 vs 논커피?',
    optionA: { id: 'a', text: '아메리카노', emoji: '☕' },
    optionB: { id: 'b', text: '라떼', emoji: '🥛' },
    tags: ['커피', '라이프스타일'],
  },
  {
    id: 'vs-life-003',
    category: 'lifestyle',
    question: '생활 패턴은?',
    optionA: { id: 'a', text: '아침형 인간', emoji: '🌅' },
    optionB: { id: 'b', text: '저녁형 인간', emoji: '🌙' },
    tags: ['라이프스타일'],
  },
  {
    id: 'vs-life-004',
    category: 'lifestyle',
    question: '근무 환경 선호는?',
    optionA: { id: 'a', text: '재택근무', emoji: '🏠' },
    optionB: { id: 'b', text: '출근', emoji: '🏢' },
    tags: ['라이프스타일', '일'],
  },
  {
    id: 'vs-life-005',
    category: 'lifestyle',
    question: '식사 스타일은?',
    optionA: { id: 'a', text: '배달 음식', emoji: '🛵' },
    optionB: { id: 'b', text: '직접 요리', emoji: '👨‍🍳' },
    tags: ['라이프스타일', '음식'],
  },

  // ==========================================================================
  // 성격/심리
  // ==========================================================================
  {
    id: 'vs-personality-001',
    category: 'personality',
    question: '에너지 충전 방법은?',
    optionA: { id: 'a', text: '혼자만의 시간', emoji: '🧘' },
    optionB: { id: 'b', text: '사람들과 어울리기', emoji: '🎉' },
    tags: ['성격'],
  },
  {
    id: 'vs-personality-002',
    category: 'personality',
    question: '계획 스타일은?',
    optionA: { id: 'a', text: '철저한 계획형', emoji: '📋' },
    optionB: { id: 'b', text: '즉흥형', emoji: '🎲' },
    tags: ['성격'],
  },
  {
    id: 'vs-personality-003',
    category: 'personality',
    question: '갈등 상황에서?',
    optionA: { id: 'a', text: '바로 이야기', emoji: '💬' },
    optionB: { id: 'b', text: '시간 갖고 정리', emoji: '🧠' },
    tags: ['성격', '갈등'],
  },

  // ==========================================================================
  // 식물
  // ==========================================================================
  {
    id: 'vs-plant-001',
    category: 'plant',
    question: '식물 타입 선호는?',
    optionA: { id: 'a', text: '다육이', emoji: '🌵' },
    optionB: { id: 'b', text: '관엽식물', emoji: '🌿' },
    tags: ['식물'],
  },
  {
    id: 'vs-plant-002',
    category: 'plant',
    question: '물주기 앱 사용해요?',
    optionA: { id: 'a', text: '사용해요', emoji: '📱' },
    optionB: { id: 'b', text: '감으로 해요', emoji: '👆' },
    tags: ['식물'],
  },
  {
    id: 'vs-plant-003',
    category: 'plant',
    question: '재배 방식 선호는?',
    optionA: { id: 'a', text: '흙 재배', emoji: '🪴' },
    optionB: { id: 'b', text: '수경 재배', emoji: '💧' },
    tags: ['식물'],
  },
];

export default VS_POLLS;
