// ============================================================================
// 카테고리 전략 데이터 (관계/라이프 확장)
// ============================================================================

// ============================================================================
// Types
// ============================================================================

export type MainCategory = 'personality' | 'matching' | 'relationship' | 'lifestyle';
export type SubCategory = string;

export interface CategoryDefinition {
  id: MainCategory;
  name: string;
  emoji: string;
  description: string;
  color: string;
  subCategories: SubCategoryDefinition[];
  features: string[];
  testIdeas: TestIdea[];
  monetization: MonetizationStrategy;
  viral: ViralStrategy;
}

export interface SubCategoryDefinition {
  id: SubCategory;
  name: string;
  emoji: string;
  description: string;
}

export interface TestIdea {
  name: string;
  description: string;
  subCategory: SubCategory;
  priority: 'high' | 'medium' | 'low';
  viralPotential: 1 | 2 | 3 | 4 | 5;
  productLink?: string;
}

export interface MonetizationStrategy {
  productLinks: string[];
  affiliateIdeas: string[];
  sponsorshipPotential: string[];
}

export interface ViralStrategy {
  shareHooks: string[];
  rankingIdeas: string[];
  debateTopics: string[];
}

// ============================================================================
// 카테고리 정의
// ============================================================================

export const CATEGORY_DEFINITIONS: CategoryDefinition[] = [
  // =========================================================================
  // 심리 (Personality) - 기존
  // =========================================================================
  {
    id: 'personality',
    name: '심리',
    emoji: '🧠',
    description: '나와 반려동물의 성격을 알아보는 테스트',
    color: 'bg-indigo-500',
    subCategories: [
      { id: 'me', name: '나', emoji: '👤', description: '사람 성격 테스트' },
      { id: 'pet', name: '반려동물', emoji: '🐾', description: '반려동물 성격 테스트' },
    ],
    features: [
      '과학적 성격 이론 기반 (Big Five, Feline Five 등)',
      '결과 공유로 자기 표현',
      '친구와 비교 기능',
    ],
    testIdeas: [
      { name: '사람 성격 테스트', description: 'Big Five 기반 성격 분석', subCategory: 'me', priority: 'high', viralPotential: 5 },
      { name: '고양이 성격 테스트', description: 'Feline Five 기반', subCategory: 'pet', priority: 'high', viralPotential: 4 },
      { name: '강아지 성격 테스트', description: 'C-BARQ 기반', subCategory: 'pet', priority: 'high', viralPotential: 4 },
    ],
    monetization: {
      productLinks: ['성격 관련 서적', '자기계발 코스'],
      affiliateIdeas: ['MBTI 굿즈', '성격 유형별 추천 제품'],
      sponsorshipPotential: ['심리 상담 서비스', '교육 플랫폼'],
    },
    viral: {
      shareHooks: ['나의 성격 유형 공유', '친구와 성격 비교'],
      rankingIdeas: ['가장 인기 있는 성격 유형'],
      debateTopics: ['MBTI 진짜 맞을까?'],
    },
  },

  // =========================================================================
  // 매칭 (Matching) - 기존 + 제품 연계 강화
  // =========================================================================
  {
    id: 'matching',
    name: '매칭',
    emoji: '💫',
    description: '나에게 맞는 것을 찾아주는 테스트',
    color: 'bg-purple-500',
    subCategories: [
      { id: 'drink', name: '음료', emoji: '🥤', description: '커피/차/술 매칭' },
      { id: 'food', name: '음식', emoji: '🍽️', description: '빵/과일 등 음식 매칭' },
      { id: 'product', name: '제품', emoji: '🛍️', description: '식물/향수/아로마 등 제품 매칭' },
    ],
    features: [
      '취향 기반 추천',
      '제품 구매 연계',
      '계절/시간대별 추천',
    ],
    testIdeas: [
      { name: '커피 매칭', description: '나에게 맞는 커피 찾기', subCategory: 'drink', priority: 'high', viralPotential: 4, productLink: '커피 브랜드' },
      { name: '향수 매칭', description: '나만의 시그니처 향 찾기', subCategory: 'product', priority: 'medium', viralPotential: 3, productLink: '향수 브랜드' },
      { name: '식물 매칭', description: '나에게 맞는 반려식물', subCategory: 'product', priority: 'high', viralPotential: 4, productLink: '식물 쇼핑몰' },
    ],
    monetization: {
      productLinks: ['커피 구독 서비스', '향수 샘플 세트', '식물 배송 서비스'],
      affiliateIdeas: ['결과별 제품 추천 링크', '계절 한정 제품'],
      sponsorshipPotential: ['음료 브랜드', '뷰티 브랜드', '인테리어 브랜드'],
    },
    viral: {
      shareHooks: ['내 커피 취향 공유', '내 향수 유형 공유'],
      rankingIdeas: ['가장 인기 있는 커피', '계절별 인기 향수'],
      debateTopics: ['아메리카노 vs 라떼', '우디향 vs 플로럴향'],
    },
  },

  // =========================================================================
  // 관계 (Relationship) - 신규 (바이럴 특화)
  // =========================================================================
  {
    id: 'relationship',
    name: '관계',
    emoji: '💕',
    description: '관계와 소통에 관한 테스트 - 바이럴 특화',
    color: 'bg-pink-500',
    subCategories: [
      { id: 'love', name: '연애', emoji: '💕', description: '연애 성향/이상형 테스트' },
      { id: 'social', name: '소통', emoji: '🗣️', description: '소통 스타일/갈등 대처 테스트' },
      { id: 'chemistry', name: '궁합', emoji: '⚡', description: '친구/연인/동료 궁합 테스트' },
    ],
    features: [
      '2인 이상 참여 유도 (궁합)',
      '순위/랭킹 기능',
      '찬반 투표 연계',
      '결과 비교 공유',
    ],
    testIdeas: [
      {
        name: '연애 이상형 테스트',
        description: '나의 이상형 유형 분석',
        subCategory: 'love',
        priority: 'high',
        viralPotential: 5
      },
      {
        name: '갈등 대처 유형',
        description: 'TKI/Gottman 기반 갈등 스타일',
        subCategory: 'social',
        priority: 'high',
        viralPotential: 4
      },
      {
        name: '사랑의 언어 테스트',
        description: '5가지 사랑의 언어 분석',
        subCategory: 'love',
        priority: 'high',
        viralPotential: 5
      },
      {
        name: '커플 궁합 테스트',
        description: '연인과 함께 하는 궁합 테스트',
        subCategory: 'chemistry',
        priority: 'high',
        viralPotential: 5
      },
      {
        name: '친구 궁합 테스트',
        description: '친구와 케미 확인',
        subCategory: 'chemistry',
        priority: 'medium',
        viralPotential: 5
      },
      {
        name: '팀워크 스타일 테스트',
        description: '협업/소통 스타일 분석',
        subCategory: 'social',
        priority: 'medium',
        viralPotential: 3
      },
      {
        name: '의존성/독립성 테스트',
        description: '관계에서의 거리감 분석',
        subCategory: 'love',
        priority: 'low',
        viralPotential: 3
      },
    ],
    monetization: {
      productLinks: ['연애 관련 서적', '커플 아이템'],
      affiliateIdeas: ['데이트 코스 추천', '커플 체험 상품'],
      sponsorshipPotential: ['데이팅 앱', '웨딩 서비스'],
    },
    viral: {
      shareHooks: [
        '친구/연인 태그해서 함께 테스트',
        '궁합 점수 공유',
        '이상형 유형 공개',
      ],
      rankingIdeas: [
        '가장 인기 있는 이상형 유형',
        '커플 궁합 베스트 조합',
        '갈등 대처 유형 분포',
      ],
      debateTopics: [
        '연락 매일 vs 자유롭게',
        '기념일 중요 vs 매일이 기념일',
        '질투 귀여움 vs 질투 싫음',
        '데이트 계획파 vs 즉흥파',
      ],
    },
  },

  // =========================================================================
  // 라이프 (Lifestyle) - 신규 (제품 연계)
  // =========================================================================
  {
    id: 'lifestyle',
    name: '라이프',
    emoji: '🏠',
    description: '라이프스타일 분석 - 제품/서비스 연계 특화',
    color: 'bg-emerald-500',
    subCategories: [
      { id: 'space', name: '공간', emoji: '🏠', description: '집/공간 스타일 테스트' },
      { id: 'routine', name: '루틴', emoji: '⏰', description: '생활 패턴/루틴 테스트' },
      { id: 'style', name: '스타일', emoji: '👔', description: '패션/소비 스타일 테스트' },
    ],
    features: [
      '제품 추천과 직접 연계',
      '계절/상황별 맞춤 추천',
      '라이프스타일 진단',
    ],
    testIdeas: [
      {
        name: '홈 스타일 테스트',
        description: '나에게 맞는 인테리어 스타일',
        subCategory: 'space',
        priority: 'high',
        viralPotential: 4,
        productLink: '가구/인테리어 브랜드'
      },
      {
        name: '아침형/저녁형 테스트',
        description: '크로노타입 분석',
        subCategory: 'routine',
        priority: 'high',
        viralPotential: 4
      },
      {
        name: '미니멀/맥시멀 성향',
        description: '생활 스타일 분석',
        subCategory: 'space',
        priority: 'medium',
        viralPotential: 3,
        productLink: '정리/수납 용품'
      },
      {
        name: '소비 성향 테스트',
        description: '나의 소비 패턴 분석',
        subCategory: 'style',
        priority: 'medium',
        viralPotential: 4,
        productLink: '가계부/재테크 앱'
      },
      {
        name: '여행 스타일 테스트',
        description: '나에게 맞는 여행 유형',
        subCategory: 'routine',
        priority: 'high',
        viralPotential: 5,
        productLink: '여행 서비스'
      },
      {
        name: '운동 성향 테스트',
        description: '나에게 맞는 운동 찾기',
        subCategory: 'routine',
        priority: 'medium',
        viralPotential: 3,
        productLink: '피트니스/운동 앱'
      },
      {
        name: '패션 스타일 테스트',
        description: '나의 패션 성향 분석',
        subCategory: 'style',
        priority: 'medium',
        viralPotential: 4,
        productLink: '패션 브랜드'
      },
    ],
    monetization: {
      productLinks: ['가구/인테리어 쇼핑몰', '여행 예약 서비스', '패션 플랫폼'],
      affiliateIdeas: ['결과별 제품 큐레이션', '계절별 라이프스타일 제품'],
      sponsorshipPotential: ['가구 브랜드', '여행사', '패션 브랜드', '웰니스 브랜드'],
    },
    viral: {
      shareHooks: [
        '내 홈 스타일 공유',
        '아침형/저녁형 인증',
        '여행 스타일 공유',
      ],
      rankingIdeas: [
        '가장 인기 있는 인테리어 스타일',
        '아침형 vs 저녁형 비율',
        '여행 스타일 분포',
      ],
      debateTopics: [
        '미니멀 vs 맥시멀',
        '아침형 vs 저녁형',
        '계획 여행 vs 즉흥 여행',
        '온라인 쇼핑 vs 오프라인 쇼핑',
      ],
    },
  },
];

// ============================================================================
// 구현 로드맵
// ============================================================================

export interface RoadmapPhase {
  phase: number;
  name: string;
  period: string;
  goals: string[];
  tests: string[];
  features: string[];
}

export const CATEGORY_ROADMAP: RoadmapPhase[] = [
  {
    phase: 1,
    name: '관계 카테고리 기반 구축',
    period: '1-2주',
    goals: [
      '관계 카테고리 UI 추가',
      '기존 테스트 재분류 (idealType, conflictStyle)',
      '바이럴 기능 기반 구축',
    ],
    tests: ['연애 이상형 테스트 (기존)', '갈등 대처 유형 (기존)'],
    features: ['카테고리 탭 UI', '빈 상태 안내 메시지'],
  },
  {
    phase: 2,
    name: '관계 테스트 확장',
    period: '3-4주',
    goals: [
      '사랑의 언어 테스트 추가',
      '궁합 테스트 시스템 구축',
      '결과 비교 기능',
    ],
    tests: ['사랑의 언어 테스트', '커플 궁합 테스트'],
    features: ['2인 테스트 시스템', '결과 비교 공유'],
  },
  {
    phase: 3,
    name: '라이프 카테고리 구축',
    period: '5-6주',
    goals: [
      '라이프 카테고리 테스트 추가',
      '제품 추천 연계 시스템',
      '계절별 추천 기능',
    ],
    tests: ['홈 스타일 테스트', '아침형/저녁형 테스트', '여행 스타일 테스트'],
    features: ['제품 추천 카드', '외부 링크 연동'],
  },
  {
    phase: 4,
    name: '수익화 최적화',
    period: '7-8주',
    goals: [
      '어필리에이트 연동',
      '스폰서십 시스템',
      'A/B 테스트',
    ],
    tests: ['소비 성향 테스트', '패션 스타일 테스트'],
    features: ['제품 구매 전환 추적', '스폰서 배너 시스템'],
  },
];

// ============================================================================
// 카테고리별 투표/토론 주제
// ============================================================================

export interface DebateTopic {
  category: MainCategory;
  topic: string;
  optionA: { text: string; emoji: string };
  optionB: { text: string; emoji: string };
  viralPotential: 1 | 2 | 3 | 4 | 5;
}

export const SUGGESTED_DEBATES: DebateTopic[] = [
  // 관계 카테고리
  {
    category: 'relationship',
    topic: '연인에게 연락은?',
    optionA: { text: '매일 자주', emoji: '📱' },
    optionB: { text: '필요할 때만', emoji: '🔕' },
    viralPotential: 5,
  },
  {
    category: 'relationship',
    topic: '기념일 챙기기',
    optionA: { text: '매년 철저히', emoji: '🎂' },
    optionB: { text: '매일이 특별', emoji: '💝' },
    viralPotential: 4,
  },
  {
    category: 'relationship',
    topic: '연인의 질투',
    optionA: { text: '귀엽다', emoji: '🥰' },
    optionB: { text: '불편하다', emoji: '😤' },
    viralPotential: 5,
  },
  // 라이프 카테고리
  {
    category: 'lifestyle',
    topic: '집 정리 스타일',
    optionA: { text: '미니멀리스트', emoji: '🧹' },
    optionB: { text: '맥시멀리스트', emoji: '🏠' },
    viralPotential: 4,
  },
  {
    category: 'lifestyle',
    topic: '나는?',
    optionA: { text: '아침형 인간', emoji: '🌅' },
    optionB: { text: '저녁형 인간', emoji: '🌙' },
    viralPotential: 5,
  },
  {
    category: 'lifestyle',
    topic: '여행 스타일',
    optionA: { text: '꼼꼼 계획파', emoji: '📋' },
    optionB: { text: '자유 즉흥파', emoji: '🎒' },
    viralPotential: 5,
  },
];
