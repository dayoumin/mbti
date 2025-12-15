/**
 * 바이럴 콘텐츠 데이터
 * - 투표 토픽: SNS 공유용 찬반 투표
 * - 시즌/계절별 콘텐츠 회전
 */

// === 투표 토픽 타입 ===
export interface VoteTopic {
  id: string;
  title: string;               // 투표 제목 (짧고 임팩트 있게)
  description?: string;        // 부가 설명
  optionA: string;             // 찬성/A 옵션
  optionB: string;             // 반대/B 옵션
  category: 'pet' | 'plant' | 'lifestyle' | 'fun';
  season?: 'spring' | 'summer' | 'fall' | 'winter';  // 시즌 한정
  tags: string[];              // SNS 해시태그용
  viralScore?: number;         // 바이럴 예상 점수 (1-5)
}

// === 반려동물 투표 토픽 ===
export const PET_VOTE_TOPICS: VoteTopic[] = [
  // === 일반 (연중) ===
  {
    id: 'pet-dog-vs-cat',
    title: '강아지 vs 고양이, 당신의 선택은?',
    optionA: '강아지파',
    optionB: '고양이파',
    category: 'pet',
    tags: ['강아지vs고양이', '반려동물', '펫러버'],
    viralScore: 5
  },
  {
    id: 'pet-indoor-vs-outdoor',
    title: '집에서 키우기 좋은 동물은?',
    optionA: '작고 조용한 동물',
    optionB: '크고 활발한 동물',
    category: 'pet',
    tags: ['반려동물', '펫라이프', '집순이집돌이'],
    viralScore: 3
  },
  {
    id: 'pet-sleep-together',
    title: '반려동물과 같이 자는 것에 대해?',
    optionA: '당연히 같이 자야지!',
    optionB: '각자 공간이 필요해',
    category: 'pet',
    tags: ['반려동물', '펫라이프', '꿀잠'],
    viralScore: 4
  },
  {
    id: 'pet-name-style',
    title: '반려동물 이름, 어떤 스타일?',
    optionA: '귀여운 이름 (뽀삐, 콩이)',
    optionB: '사람 이름 (철수, 영희)',
    category: 'pet',
    tags: ['반려동물이름', '펫네이밍', '귀여워'],
    viralScore: 4
  },
  {
    id: 'pet-clothes',
    title: '반려동물에게 옷 입히기?',
    optionA: '귀엽잖아! 입혀야지',
    optionB: '동물은 자연 그대로가 좋아',
    category: 'pet',
    tags: ['펫패션', '반려동물옷', '귀여움폭발'],
    viralScore: 4
  },
  {
    id: 'pet-first-time',
    title: '첫 반려동물로 뭐가 좋을까?',
    optionA: '강아지/고양이',
    optionB: '작은 동물(햄스터, 물고기)',
    category: 'pet',
    tags: ['첫반려동물', '초보집사', '펫초보'],
    viralScore: 3
  },
  {
    id: 'pet-talk',
    title: '반려동물한테 말 거는 편?',
    optionA: '매일 수다 떨어요',
    optionB: '가끔 이름만 불러요',
    category: 'pet',
    tags: ['반려동물', '펫러버', '애기야'],
    viralScore: 4
  },

  // === 여름 시즌 ===
  {
    id: 'pet-summer-haircut',
    title: '여름에 반려동물 털 밀기?',
    optionA: '시원하게 밀어줘야지',
    optionB: '털이 자외선 보호해줘',
    category: 'pet',
    season: 'summer',
    tags: ['여름펫케어', '반려동물미용', '더위주의'],
    viralScore: 4
  },
  {
    id: 'pet-summer-ac',
    title: '외출할 때 에어컨 켜두고 가기?',
    optionA: '당연! 시원하게 해줘야지',
    optionB: '전기세가... 선풍기로',
    category: 'pet',
    season: 'summer',
    tags: ['여름펫케어', '에어컨', '반려동물더위'],
    viralScore: 4
  },

  // === 겨울 시즌 ===
  {
    id: 'pet-winter-clothes',
    title: '겨울에 반려동물 옷 필수?',
    optionA: '추위 타니까 입혀야지',
    optionB: '동물은 털이 있잖아',
    category: 'pet',
    season: 'winter',
    tags: ['겨울펫케어', '펫패션', '추위대비'],
    viralScore: 3
  }
];

// === 반려식물 투표 토픽 ===
export const PLANT_VOTE_TOPICS: VoteTopic[] = [
  // === 일반 (연중) ===
  {
    id: 'plant-name',
    title: '식물에게 이름 지어주기?',
    optionA: '당연히 지어줘야지',
    optionB: '식물인데 이름이 왜 필요해',
    category: 'plant',
    tags: ['식물이름', '플랜테리어', '식집사'],
    viralScore: 4
  },
  {
    id: 'plant-talk',
    title: '식물한테 말 걸기?',
    optionA: '이야기하면 잘 자란대!',
    optionB: '좀 이상하지 않아?',
    category: 'plant',
    tags: ['식집사', '식물키우기', '그린라이프'],
    viralScore: 5
  },
  {
    id: 'plant-overwater',
    title: '물을 많이 주는 편?',
    optionA: '목마를까봐 자주 줘요',
    optionB: '마를 때까지 기다려요',
    category: 'plant',
    tags: ['식물물주기', '식집사팁', '과습주의'],
    viralScore: 3
  },
  {
    id: 'plant-dead-guilt',
    title: '식물 죽이면 죄책감 느끼는 편?',
    optionA: '정말 속상해요...',
    optionB: '다음엔 더 잘 키울게',
    category: 'plant',
    tags: ['식집사', '식물키우기', '미안해'],
    viralScore: 4
  },
  {
    id: 'plant-big-vs-small',
    title: '선호하는 식물 크기는?',
    optionA: '존재감 있는 대형 식물',
    optionB: '아기자기한 미니 식물',
    category: 'plant',
    tags: ['플랜테리어', '식물추천', '대형식물'],
    viralScore: 3
  },
  {
    id: 'plant-flower-vs-foliage',
    title: '꽃 vs 관엽, 당신의 선택은?',
    optionA: '꽃이 피는 식물',
    optionB: '초록 잎 식물',
    category: 'plant',
    tags: ['식물선호', '꽃식물', '관엽식물'],
    viralScore: 4
  },
  {
    id: 'plant-succulent-vs-tropical',
    title: '다육이 vs 열대식물?',
    optionA: '통통 귀여운 다육이',
    optionB: '싱그러운 열대식물',
    category: 'plant',
    tags: ['다육이', '열대식물', '식물추천'],
    viralScore: 4
  },

  // === 계절별 ===
  {
    id: 'plant-winter-survive',
    title: '겨울에 식물 살리기 어려워요?',
    optionA: '네, 매년 몇 개씩 죽어요',
    optionB: '괜찮아요, 잘 키워요',
    category: 'plant',
    season: 'winter',
    tags: ['겨울식물', '식물월동', '식집사고민'],
    viralScore: 4
  },
  {
    id: 'plant-spring-repot',
    title: '봄마다 분갈이 하는 편?',
    optionA: '성장기니까 해줘야지',
    optionB: '귀찮아서 그냥 둬요',
    category: 'plant',
    season: 'spring',
    tags: ['봄분갈이', '식물분갈이', '식집사'],
    viralScore: 3
  }
];

// === 라이프스타일 투표 토픽 ===
export const LIFESTYLE_VOTE_TOPICS: VoteTopic[] = [
  {
    id: 'life-pet-vs-plant',
    title: '반려동물 vs 반려식물, 뭐가 더 좋아?',
    optionA: '반려동물',
    optionB: '반려식물',
    category: 'lifestyle',
    tags: ['반려생활', '펫vs식물', '라이프스타일'],
    viralScore: 5
  },
  {
    id: 'life-morning-vs-night',
    title: '아침형 vs 저녁형, 당신은?',
    optionA: '아침형 인간',
    optionB: '저녁형 인간',
    category: 'lifestyle',
    tags: ['아침형저녁형', '라이프스타일', 'MBTI'],
    viralScore: 4
  },
  {
    id: 'life-indoor-vs-outdoor',
    title: '집순이 vs 나들이파?',
    optionA: '집이 최고!',
    optionB: '밖이 좋아!',
    category: 'lifestyle',
    tags: ['집순이', '나들이', '라이프스타일'],
    viralScore: 4
  }
];

// === 재미 투표 토픽 ===
export const FUN_VOTE_TOPICS: VoteTopic[] = [
  {
    id: 'fun-pet-emoji',
    title: '반려동물 이모지로 표현하면?',
    optionA: '내 동물 닮은 이모지',
    optionB: '성격 닮은 이모지',
    category: 'fun',
    tags: ['이모지', '반려동물', '재미'],
    viralScore: 3
  },
  {
    id: 'fun-plant-personality',
    title: '만약 식물이 사람이라면?',
    optionA: '조용한 성격일 것 같아',
    optionB: '은근 까칠할 것 같아',
    category: 'fun',
    tags: ['식물', '상상', '재미'],
    viralScore: 4
  },
  {
    id: 'fun-reborn-animal',
    title: '다음 생에 동물로 태어난다면?',
    optionA: '귀여움 받는 반려동물',
    optionB: '자유로운 야생동물',
    category: 'fun',
    tags: ['다음생', '동물', '재미'],
    viralScore: 5
  }
];

// === 모든 투표 토픽 통합 ===
export const ALL_VOTE_TOPICS: VoteTopic[] = [
  ...PET_VOTE_TOPICS,
  ...PLANT_VOTE_TOPICS,
  ...LIFESTYLE_VOTE_TOPICS,
  ...FUN_VOTE_TOPICS
];

// === 헬퍼 함수들 ===

/**
 * 현재 계절 가져오기
 */
export function getCurrentSeason(): 'spring' | 'summer' | 'fall' | 'winter' {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring';
  if (month >= 6 && month <= 8) return 'summer';
  if (month >= 9 && month <= 11) return 'fall';
  return 'winter';
}

/**
 * 현재 계절에 맞는 투표 토픽 필터링
 */
export function getSeasonalVoteTopics(): VoteTopic[] {
  const currentSeason = getCurrentSeason();
  return ALL_VOTE_TOPICS.filter(t => !t.season || t.season === currentSeason);
}

/**
 * 오늘의 투표 토픽 (매일 다른 토픽)
 */
export function getTodayVoteTopic(): VoteTopic {
  const topics = getSeasonalVoteTopics();
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return topics[dayOfYear % topics.length];
}

/**
 * 이번 주 투표 토픽 (일주일 고정)
 */
export function getWeeklyVoteTopic(): VoteTopic {
  const topics = getSeasonalVoteTopics();
  const weekOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (86400000 * 7));
  return topics[weekOfYear % topics.length];
}

/**
 * 바이럴 스코어 높은 순 정렬
 */
export function getTopViralTopics(count: number = 5): VoteTopic[] {
  return [...getSeasonalVoteTopics()]
    .sort((a, b) => (b.viralScore || 0) - (a.viralScore || 0))
    .slice(0, count);
}

/**
 * 카테고리별 투표 토픽 가져오기
 */
export function getVoteTopicsByCategory(category: VoteTopic['category']): VoteTopic[] {
  return getSeasonalVoteTopics().filter(t => t.category === category);
}

/**
 * 랜덤 투표 토픽 가져오기
 */
export function getRandomVoteTopic(): VoteTopic {
  const topics = getSeasonalVoteTopics();
  return topics[Math.floor(Math.random() * topics.length)];
}
