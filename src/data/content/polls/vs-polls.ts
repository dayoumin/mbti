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
    optionA: {
      id: 'a',
      text: '민초는 사랑입니다',
      emoji: '🌿🍫',
      insightTags: { decision: ['adventurous'], personality: ['expressive'] },
    },
    optionB: {
      id: 'b',
      text: '민초는 치약 맛일 뿐',
      emoji: '🪥',
      insightTags: { decision: ['safe'], personality: ['reserved'] },
    },
    tags: ['음식', '취향'],
  },
  {
    id: 'vs-viral-002',
    category: 'lifestyle',
    question: '탕수육 먹는 법?',
    optionA: {
      id: 'a',
      text: '부먹 (촉촉함)',
      emoji: '☔',
      insightTags: { decision: ['emotional'], personality: ['spontaneous'] },
    },
    optionB: {
      id: 'b',
      text: '찍먹 (바삭함)',
      emoji: '✨',
      insightTags: { decision: ['practical'], personality: ['structured'] },
    },
    tags: ['음식', '탕수육'],
  },
  {
    id: 'vs-viral-003',
    category: 'lifestyle',
    question: '하와이안 피자(파인애플)',
    optionA: {
      id: 'a',
      text: '극호! 단짠의 완성',
      emoji: '🍍🍕',
      insightTags: { decision: ['adventurous'], personality: ['expressive'] },
    },
    optionB: {
      id: 'b',
      text: '불호! 과일은 후식으로',
      emoji: '🚫',
      insightTags: { decision: ['safe'], personality: ['reserved'] },
    },
    tags: ['음식', '피자'],
  },
  {
    id: 'vs-viral-004',
    category: 'love',
    question: '내 애인의 깻잎 논쟁',
    optionA: {
      id: 'a',
      text: '친구가 못 떼면 떼줄 수 있지',
      emoji: '🍃',
      insightTags: { relationship: ['supportive'], personality: ['extroverted'] },
    },
    optionB: {
      id: 'b',
      text: '안 돼! 젓가락질은 금지',
      emoji: '❌',
      insightTags: { relationship: ['assertive'], decision: ['emotional'] },
    },
    tags: ['연애', '논쟁'],
  },
  {
    id: 'vs-viral-005',
    category: 'love',
    question: '애인의 남사친/여사친과 단둘이 술?',
    optionA: {
      id: 'a',
      text: '믿으니까 상관 없음',
      emoji: '🤝',
      insightTags: { relationship: ['supportive'], decision: ['practical'] },
    },
    optionB: {
      id: 'b',
      text: '절대 안 됨',
      emoji: '🛑',
      insightTags: { relationship: ['assertive'], decision: ['emotional'] },
    },
    tags: ['연애', '질투'],
    meta: { minAge: '20s', isAdultOnly: true },
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
  {
    id: 'vs-cat-006',
    category: 'cat',
    question: '고양이 중성화 시기, 언제가 나을까?',
    optionA: { id: 'a', text: '생후 4-6개월 (첫 발정 전)', emoji: '🐱' },
    optionB: { id: 'b', text: '생후 1년 이후 (충분히 성장 후)', emoji: '🐈' },
    tags: ['중성화', '고양이', '건강'],
  },
  {
    id: 'vs-cat-007',
    category: 'cat',
    question: '중성화 수술 전 금식, 어떻게?',
    optionA: { id: 'a', text: '12시간 금식 (안전하게)', emoji: '🌙' },
    optionB: { id: 'b', text: '4-6시간 금식 (최신 가이드)', emoji: '⏰' },
    tags: ['중성화', '고양이', '수술준비'],
  },
  {
    id: 'vs-cat-008',
    category: 'cat',
    question: '중성화 후 넥카라, 어떻게 하시나요?',
    optionA: { id: 'a', text: '깔때기 넥카라 (확실한 차단)', emoji: '🔵' },
    optionB: { id: 'b', text: '도넛형 넥쿠션 (편안함)', emoji: '🍩' },
    tags: ['중성화', '고양이', '수술관리'],
  },
  {
    id: 'vs-cat-009',
    category: 'cat',
    question: '중성화 후 사료 바꾸시나요?',
    optionA: { id: 'a', text: '중성화 전용 사료로', emoji: '🥫' },
    optionB: { id: 'b', text: '기존 사료 유지 + 양 조절', emoji: '🥣' },
    tags: ['중성화', '고양이', '사료', '체중관리'],
  },
  {
    id: 'vs-cat-010',
    category: 'cat',
    question: '중성화 후 성격 변화, 어떻게 느끼셨나요?',
    optionA: { id: 'a', text: '많이 변했어요', emoji: '🔄' },
    optionB: { id: 'b', text: '거의 안 변했어요', emoji: '😺' },
    tags: ['중성화', '고양이', '행동변화'],
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

  // 강아지 - 중성화 관련 (vs-dog-006 ~ 010)
  {
    id: 'vs-dog-006',
    category: 'dog',
    question: '강아지 중성화 시기, 어떻게 하셨나요?',
    optionA: { id: 'a', text: '생후 6-9개월 (조기)', emoji: '🐶' },
    optionB: { id: 'b', text: '돌 이후 (성장 완료 후)', emoji: '🐕' },
    tags: ['중성화', '강아지', '수술', '시기', '건강'],
  },
  {
    id: 'vs-dog-007',
    category: 'dog',
    question: '중성화 수술 전 금식, 어떻게 하셨나요?',
    optionA: { id: 'a', text: '자정부터 엄격 금식', emoji: '🚫' },
    optionB: { id: 'b', text: '저녁밥은 조금 줌', emoji: '🥄' },
    tags: ['중성화', '강아지', '금식', '수술준비', '마취'],
  },
  {
    id: 'vs-dog-008',
    category: 'dog',
    question: '중성화 후 넥카라, 어떻게 하시나요?',
    optionA: { id: 'a', text: '깔때기 넥카라 (안전 중시)', emoji: '🔔' },
    optionB: { id: 'b', text: '부드러운 넥쿠션', emoji: '☁️' },
    tags: ['중성화', '강아지', '넥카라', '수술관리', '회복'],
  },
  {
    id: 'vs-dog-009',
    category: 'dog',
    question: '중성화 후 사료 바꾸시나요?',
    optionA: { id: 'a', text: '중성화 전용 사료로', emoji: '🥫' },
    optionB: { id: 'b', text: '기존 사료, 양만 조절', emoji: '⚖️' },
    tags: ['중성화', '강아지', '사료', '체중관리', '건강'],
  },
  {
    id: 'vs-dog-010',
    category: 'dog',
    question: '중성화 후 행동 변화, 어떻게 느끼셨나요?',
    optionA: { id: 'a', text: '확실히 차분해짐', emoji: '😌' },
    optionB: { id: 'b', text: '별 차이 못 느낌', emoji: '🤷' },
    tags: ['중성화', '강아지', '행동변화', '마운팅', '성격'],
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

  // 연애 초기 (썸/소개팅)
  {
    id: 'vs-love-006',
    category: 'love',
    question: '첫 만남에서 호감 표현은?',
    optionA: { id: 'a', text: '확실하게 어필', emoji: '💘' },
    optionB: { id: 'b', text: '은근슬쩍 신호만', emoji: '👀' },
    tags: ['연애', '썸', '호감'],
  },
  {
    id: 'vs-love-007',
    category: 'love',
    question: '썸 탈 때 연락 주도권은?',
    optionA: { id: 'a', text: '내가 먼저 자주 연락', emoji: '📲' },
    optionB: { id: 'b', text: '상대가 연락 오면 답장', emoji: '💬' },
    tags: ['연애', '썸', '연락'],
  },
  {
    id: 'vs-love-008',
    category: 'love',
    question: '고백은 언제?',
    optionA: { id: 'a', text: '확신 서면 빠르게', emoji: '⚡' },
    optionB: { id: 'b', text: '충분히 알아본 후', emoji: '🕐' },
    tags: ['연애', '고백', '타이밍'],
  },
  {
    id: 'vs-love-009',
    category: 'love',
    question: '첫 데이트 장소 선택은?',
    optionA: { id: 'a', text: '카페/산책 (대화 중심)', emoji: '☕' },
    optionB: { id: 'b', text: '영화/전시 (활동 중심)', emoji: '🎬' },
    tags: ['연애', '첫데이트', '장소'],
  },
  {
    id: 'vs-love-010',
    category: 'love',
    question: '소개팅에서 외모 vs 대화?',
    optionA: { id: 'a', text: '첫인상(외모) 중요', emoji: '✨' },
    optionB: { id: 'b', text: '대화 잘 통하면 OK', emoji: '💬' },
    tags: ['연애', '소개팅', '이상형'],
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
    question: '커피 타입은?',
    optionA: { id: 'a', text: '아메리카노 (진하게)', emoji: '☕' },
    optionB: { id: 'b', text: '라떼 (부드럽게)', emoji: '🥛' },
    tags: ['커피', '라이프스타일', '음료'],
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
  // 토끼
  // ==========================================================================
  {
    id: 'vs-rabbit-001',
    category: 'rabbit',
    question: '토끼 사료 선택은?',
    optionA: { id: 'a', text: '펠릿 위주', emoji: '🥣' },
    optionB: { id: 'b', text: '건초 위주', emoji: '🌾' },
    tags: ['토끼', '사료'],
  },
  {
    id: 'vs-rabbit-002',
    category: 'rabbit',
    question: '토끼 사육 방식은?',
    optionA: { id: 'a', text: '케이지 사육', emoji: '🏠' },
    optionB: { id: 'b', text: '방목 사육', emoji: '🐰' },
    tags: ['토끼', '환경'],
  },
  {
    id: 'vs-rabbit-003',
    category: 'rabbit',
    question: '토끼 털 관리는?',
    optionA: { id: 'a', text: '자주 빗질', emoji: '🪮' },
    optionB: { id: 'b', text: '자연스럽게', emoji: '🍃' },
    tags: ['토끼', '관리'],
  },
  {
    id: 'vs-rabbit-004',
    category: 'rabbit',
    question: '토끼 간식 선호는?',
    optionA: { id: 'a', text: '과일 (사과, 바나나)', emoji: '🍎' },
    optionB: { id: 'b', text: '채소 (당근, 상추)', emoji: '🥕' },
    tags: ['토끼', '간식'],
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
  {
    id: 'vs-plant-004',
    category: 'plant',
    question: '식물 구매 장소는?',
    optionA: { id: 'a', text: '꽃집/화원', emoji: '🏪' },
    optionB: { id: 'b', text: '온라인/당근마켓', emoji: '📦' },
    tags: ['식물', '구매'],
  },
  {
    id: 'vs-plant-005',
    category: 'plant',
    question: '화분 스타일은?',
    optionA: { id: 'a', text: '테라코타/토분', emoji: '🏺' },
    optionB: { id: 'b', text: '화이트/모던', emoji: '⬜' },
    tags: ['식물', '인테리어'],
  },

  // ==========================================================================
  // 추가 바이럴/라이프스타일
  // ==========================================================================
  {
    id: 'vs-viral-006',
    category: 'lifestyle',
    question: '짜장면 vs 짬뽕?',
    optionA: { id: 'a', text: '짜장면', emoji: '🍝' },
    optionB: { id: 'b', text: '짬뽕', emoji: '🍜' },
    tags: ['음식', '중식'],
  },
  {
    id: 'vs-viral-007',
    category: 'lifestyle',
    question: '치킨은?',
    optionA: { id: 'a', text: '후라이드', emoji: '🍗' },
    optionB: { id: 'b', text: '양념', emoji: '🔥' },
    tags: ['음식', '치킨'],
  },
  {
    id: 'vs-viral-008',
    category: 'lifestyle',
    question: '라면 끓일 때 물 먼저?',
    optionA: { id: 'a', text: '물 먼저 끓이고 면', emoji: '💧' },
    optionB: { id: 'b', text: '면과 물 동시에', emoji: '🍜' },
    tags: ['음식', '라면'],
  },
  {
    id: 'vs-viral-009',
    category: 'lifestyle',
    question: '계란 프라이 익힘 정도?',
    optionA: { id: 'a', text: '반숙', emoji: '🍳' },
    optionB: { id: 'b', text: '완숙', emoji: '🥚' },
    tags: ['음식', '계란'],
  },
  {
    id: 'vs-viral-010',
    category: 'lifestyle',
    question: '소주 vs 맥주?',
    optionA: { id: 'a', text: '소주', emoji: '🍶' },
    optionB: { id: 'b', text: '맥주', emoji: '🍺' },
    tags: ['술', '음료'],
    meta: { minAge: '20s' },  // 단순 선호 비교, isAdultOnly 아님
  },
  {
    id: 'vs-life-006',
    category: 'lifestyle',
    question: '쇼핑 스타일은?',
    optionA: { id: 'a', text: '오프라인 매장', emoji: '🏬' },
    optionB: { id: 'b', text: '온라인 쇼핑', emoji: '📱' },
    tags: ['라이프스타일', '쇼핑'],
  },
  {
    id: 'vs-life-007',
    category: 'lifestyle',
    question: '여행 스타일은?',
    optionA: { id: 'a', text: '계획 빡빡하게', emoji: '📋' },
    optionB: { id: 'b', text: '즉흥 여행', emoji: '🎲' },
    tags: ['라이프스타일', '여행'],
  },
  {
    id: 'vs-life-008',
    category: 'lifestyle',
    question: '운동 시간대는?',
    optionA: { id: 'a', text: '아침 운동', emoji: '🌅' },
    optionB: { id: 'b', text: '저녁 운동', emoji: '🌙' },
    tags: ['라이프스타일', '운동'],
  },
  {
    id: 'vs-life-009',
    category: 'lifestyle',
    question: '휴일에 뭐해?',
    optionA: { id: 'a', text: '밖에 나가기', emoji: '🚗' },
    optionB: { id: 'b', text: '집에서 쉬기', emoji: '🛋️' },
    tags: ['라이프스타일', '휴식'],
  },
  {
    id: 'vs-life-010',
    category: 'lifestyle',
    question: '영화 볼 때?',
    optionA: { id: 'a', text: '영화관', emoji: '🎬' },
    optionB: { id: 'b', text: '넷플릭스/OTT', emoji: '📺' },
    tags: ['라이프스타일', '영화'],
  },

  // ==========================================================================
  // 연령 제한 판단 모호 케이스 (Ambiguous Age Cases)
  // ==========================================================================
  {
    id: 'vs-ambiguous-001',
    category: 'lifestyle',
    question: '친구 만나면?',
    optionA: { id: 'a', text: '카페 가자', emoji: '☕' },
    optionB: { id: 'b', text: '한잔 하자', emoji: '🍺' },
    tags: ['취향', '기호품', '사교'],
    meta: { minAge: '20s' },
  },
  {
    id: 'vs-ambiguous-002',
    category: 'love',
    question: '첫 데이트 비용은?',
    optionA: { id: 'a', text: '더치페이', emoji: '💰' },
    optionB: { id: 'b', text: '한 사람이 내기', emoji: '💳' },
    tags: ['연애', '데이트'],
    // meta 없음 - 10대도 경험 가능한 일반적 연애 상황
  },
  {
    id: 'vs-ambiguous-003',
    category: 'lifestyle',
    question: '야근 후 회식 제안',
    optionA: { id: 'a', text: '참석한다 (팀워크)', emoji: '🍻' },
    optionB: { id: 'b', text: '정중히 거절 (휴식)', emoji: '🏠' },
    tags: ['직장', '회식'],
    meta: { minAge: '20s' },  // 직장생활 맥락, isAdultOnly 아님
  },
  {
    id: 'vs-ambiguous-004',
    category: 'lifestyle',
    question: '한 달 지출 중 더 큰 건?',
    optionA: { id: 'a', text: 'OTT 구독료', emoji: '📺' },
    optionB: { id: 'b', text: '술값', emoji: '🍺' },
    tags: ['소비', '라이프스타일'],
    meta: { minAge: '20s' },
    // meta 있음 (minAge만) - 술 소비 비교이지만 강제 성인 전용은 아님
  },
  {
    id: 'vs-ambiguous-005',
    category: 'love',
    question: '하루 종일 연락 없는 연인',
    optionA: { id: 'a', text: '먼저 연락한다', emoji: '📱' },
    optionB: { id: 'b', text: '연락 올 때까지 기다린다', emoji: '⏳' },
    tags: ['연애', '연락'],
    // meta 없음 - 10대도 경험하는 보편적 연애 고민
  },

  // ==========================================================================
  // 연애/사랑 추가
  // ==========================================================================
  {
    id: 'vs-love-016',
    category: 'love',
    question: '사랑의 언어는?',
    optionA: { id: 'a', text: '선물/깜짝 이벤트', emoji: '🎁' },
    optionB: { id: 'b', text: '함께하는 시간', emoji: '⏰' },
    tags: ['연애', '표현'],
  },
  {
    id: 'vs-love-017',
    category: 'love',
    question: '연애 공개 여부는?',
    optionA: { id: 'a', text: '공개연애 (SNS, 주변에 알림)', emoji: '📢' },
    optionB: { id: 'b', text: '비공개 (조용히)', emoji: '🤫' },
    tags: ['연애', '사생활'],
  },
  {
    id: 'vs-love-018',
    category: 'love',
    question: '기념일 챙기는 스타일?',
    optionA: { id: 'a', text: '백일, 200일 다 챙김', emoji: '📅' },
    optionB: { id: 'b', text: '큰 기념일만 (1주년 등)', emoji: '🎂' },
    tags: ['연애', '기념일'],
  },
  {
    id: 'vs-love-019',
    category: 'love',
    question: '스킨십 편한 정도는?',
    optionA: { id: 'a', text: '애정표현 자주 (손잡기, 안기)', emoji: '💑' },
    optionB: { id: 'b', text: '은근하게 (가끔)', emoji: '🤝' },
    tags: ['연애', '스킨십'],
  },
  {
    id: 'vs-love-020',
    category: 'love',
    question: '연애 초반에 미래 이야기?',
    optionA: { id: 'a', text: '빨리 이야기 (결혼, 계획)', emoji: '💍' },
    optionB: { id: 'b', text: '천천히 (지금에 집중)', emoji: '🌸' },
    tags: ['연애', '미래'],
  },
  {
    id: 'vs-love-011',
    category: 'love',
    question: '전애인 사진/선물 보관?',
    optionA: { id: 'a', text: '다 버림 (깨끗하게)', emoji: '🗑️' },
    optionB: { id: 'b', text: '추억으로 남김', emoji: '📦' },
    tags: ['연애', '과거'],
  },
  {
    id: 'vs-love-012',
    category: 'love',
    question: 'SNS 커플 인증?',
    optionA: { id: 'a', text: '자주 올림 (프사, 스토리)', emoji: '📷' },
    optionB: { id: 'b', text: '안 올림 (우리끼리)', emoji: '🔒' },
    tags: ['연애', 'SNS'],
  },
  {
    id: 'vs-love-013',
    category: 'love',
    question: '애칭 부르는 거?',
    optionA: { id: 'a', text: '좋아함 (자기야, 오빠/언니)', emoji: '💕' },
    optionB: { id: 'b', text: '이름이 편함', emoji: '📛' },
    tags: ['연애', '호칭'],
  },
  {
    id: 'vs-love-014',
    category: 'love',
    question: '싸운 뒤 화해 방식?',
    optionA: { id: 'a', text: '대화로 풀기', emoji: '💬' },
    optionB: { id: 'b', text: '시간 지나면 자연스럽게', emoji: '⏳' },
    tags: ['연애', '갈등'],
  },
  {
    id: 'vs-love-015',
    category: 'love',
    question: '애인 친구들과의 관계?',
    optionA: { id: 'a', text: '친하게 지냄 (같이 만남)', emoji: '👥' },
    optionB: { id: 'b', text: '적당한 거리 유지', emoji: '🚪' },
    tags: ['연애', '인간관계'],
  },
];

export default VS_POLLS;
