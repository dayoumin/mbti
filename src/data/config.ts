// Subject 설정 - 새 테스트 추가시 여기에만 추가하면 됨
// 생성일: 2025-12-11

import type { SubjectConfig, SubjectKey } from './types';

// ========== 16유형 (성격 유형) 정의 ==========
// 참고: "MBTI"라는 단어 사용 금지 - "성격 유형" 또는 "16유형"으로 표현

export const PERSONALITY_TYPES = [
    'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
    'ESFP', 'ESFJ', 'ESTP', 'ESTJ',
    'INFP', 'INFJ', 'INTP', 'INTJ',
    'ISFP', 'ISFJ', 'ISTP', 'ISTJ',
] as const;

export type PersonalityType = typeof PERSONALITY_TYPES[number];

// 16유형 한글 설명 (UI 표시용)
export const PERSONALITY_TYPE_LABELS: Record<PersonalityType, { name: string; emoji: string; shortDesc: string }> = {
    ENFP: { name: '재기발랄한 활동가', emoji: '🦋', shortDesc: '열정적이고 창의적인' },
    ENFJ: { name: '정의로운 사회운동가', emoji: '🌟', shortDesc: '따뜻하고 이타적인' },
    ENTP: { name: '뜨거운 논쟁을 즐기는 변론가', emoji: '⚡', shortDesc: '영리하고 호기심 많은' },
    ENTJ: { name: '대담한 통솔자', emoji: '👑', shortDesc: '대담하고 결단력 있는' },
    ESFP: { name: '자유로운 영혼의 연예인', emoji: '🎉', shortDesc: '사교적이고 즉흥적인' },
    ESFJ: { name: '사교적인 외교관', emoji: '💝', shortDesc: '배려심 깊고 사교적인' },
    ESTP: { name: '모험을 즐기는 사업가', emoji: '🏄', shortDesc: '에너지 넘치고 현실적인' },
    ESTJ: { name: '엄격한 관리자', emoji: '📋', shortDesc: '체계적이고 실용적인' },
    INFP: { name: '열정적인 중재자', emoji: '🌈', shortDesc: '이상적이고 공감 능력 높은' },
    INFJ: { name: '선의의 옹호자', emoji: '🔮', shortDesc: '통찰력 있고 원칙적인' },
    INTP: { name: '논리적인 사색가', emoji: '🧠', shortDesc: '분석적이고 객관적인' },
    INTJ: { name: '용의주도한 전략가', emoji: '♟️', shortDesc: '독립적이고 전략적인' },
    ISFP: { name: '호기심 많은 예술가', emoji: '🎨', shortDesc: '온화하고 감성적인' },
    ISFJ: { name: '용감한 수호자', emoji: '🛡️', shortDesc: '헌신적이고 성실한' },
    ISTP: { name: '만능 재주꾼', emoji: '🔧', shortDesc: '논리적이고 융통성 있는' },
    ISTJ: { name: '청렴결백한 논리주의자', emoji: '📚', shortDesc: '신뢰할 수 있고 철저한' },
};

// 테스트 타입 정의
export const TEST_TYPES = {
    personality: {
        key: 'personality',
        label: '성격 테스트',
        emoji: '🧠',
        description: '나/반려동물의 성격을 알아보는 테스트'
    },
    matching: {
        key: 'matching',
        label: '매칭 테스트',
        emoji: '💫',
        description: '나에게 맞는 것을 찾아주는 테스트'
    }
};

export const SUBJECT_CONFIG: Record<SubjectKey, SubjectConfig> = {
    human: {
        testType: "personality",
        icon: "HumanIcon",
        lucideIcon: "Brain",
        emoji: "👤",
        label: "사람",
        intro: ["나는 어떤 사람일까?", "나의 숨겨진 성격은?", "친구들이 보는 나는?"],
        resultFormat: "simple",  // simple: 단순 형식, tabs: 탭형 (심층해석/육아팁)
        deepButtonText: "내 성격"
    },
    cat: {
        testType: "personality",
        icon: "CatFace",
        lucideIcon: "Cat",
        emoji: "🐱",
        label: "고양이",
        intro: ["철학 냥이?", "보스 냥이?", "인싸 냥이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 냥이"
    },
    dog: {
        testType: "personality",
        icon: "DogFace",
        lucideIcon: "Dog",
        emoji: "🐶",
        label: "강아지",
        intro: ["규율 멍멍이?", "파티 멍멍이?", "CEO 멍멍이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 멍이"
    },
    rabbit: {
        testType: "personality",
        icon: "RabbitFace",
        lucideIcon: "Rabbit",
        emoji: "🐰",
        label: "토끼",
        intro: ["탐험가 토끼?", "애교쟁이 토끼?", "독립적인 토끼?"],
        resultFormat: "tabs",
        deepButtonText: "우리 토끼"
    },
    hamster: {
        testType: "personality",
        icon: "HamsterFace",
        lucideIcon: "Puzzle",
        emoji: "🐹",
        label: "햄스터",
        intro: ["쳇바퀴 마스터?", "수집왕 햄찌?", "인싸 햄찌?"],
        resultFormat: "tabs",
        deepButtonText: "우리 햄찌"
    },
    idealType: {
        testType: "matching",
        icon: "HeartIcon",
        lucideIcon: "Heart",
        emoji: "💘",
        label: "이상형",
        intro: ["나의 이상형은?", "어떤 사람이 맞을까?", "운명의 상대는?"],
        resultFormat: "matching",
        deepButtonText: "이상형",
        matchPointsTitle: "💘 이런 사람이 맞아요",
        tabLabels: { interpretation: "💡 해석", guide: "🔮 연애 팁" },
        tabActiveColor: "bg-pink-100 border-pink-400",
        checkColor: "text-pink-500",
        analysisButtonText: "💘 상세 성향 분석 보기"
    },
    plant: {
        testType: "matching",
        icon: "PlantIcon",
        lucideIcon: "Flower2",
        emoji: "🌱",
        label: "식물",
        intro: ["나에게 맞는 식물은?", "초보도 키울 수 있을까?", "어떤 식물과 잘 맞을까?"],
        resultFormat: "matching",
        deepButtonText: "반려식물",
        matchPointsTitle: "🌱 이런 분에게 추천해요",
        tabLabels: { interpretation: "🌿 특징", guide: "💧 관리 팁" },
        tabActiveColor: "bg-green-100 border-green-400",
        checkColor: "text-green-500",
        analysisButtonText: "🌱 상세 성향 분석 보기"
    },
    petMatch: {
        testType: "matching",
        icon: "PetMatchIcon",
        lucideIcon: "Star",
        emoji: "🐾",
        label: "반려동물",
        intro: ["어떤 동물과 잘 맞을까?", "첫 반려동물 고민 중?", "나의 라이프스타일에 맞는 친구는?"],
        resultFormat: "matching",
        deepButtonText: "반려동물",
        matchPointsTitle: "🐾 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 소개", guide: "🏠 키우기 팁" },
        tabActiveColor: "bg-amber-100 border-amber-400",
        checkColor: "text-amber-600",
        analysisButtonText: "🐾 상세 성향 분석 보기"
    },
    coffee: {
        testType: "matching",
        icon: "CoffeeIcon",
        lucideIcon: "Coffee",
        emoji: "☕",
        label: "커피",
        intro: ["나에게 맞는 커피는?", "오늘 뭐 마시지?", "내 취향의 커피 찾기"],
        resultFormat: "matching",
        deepButtonText: "커피 취향",
        matchPointsTitle: "☕ 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 소개", guide: "💡 즐기는 팁" },
        tabActiveColor: "bg-amber-200 border-amber-600",
        checkColor: "text-amber-700",
        analysisButtonText: "☕ 상세 취향 분석 보기"
    },
    tea: {
        testType: "matching",
        icon: "TeaIcon",
        lucideIcon: "CupSoda",
        emoji: "🍵",
        label: "차",
        intro: ["나에게 맞는 차는?", "오늘의 티타임", "내 취향의 차 찾기"],
        resultFormat: "matching",
        deepButtonText: "차 취향"
    },
    conflictStyle: {
        testType: "personality",
        icon: "ConflictIcon",
        lucideIcon: "HeartHandshake",
        emoji: "🤝",
        label: "갈등 대처",
        intro: ["나의 갈등 대처 스타일은?", "관계에서 어떻게 소통할까?", "더 나은 관계를 위해"],
        resultFormat: "simple",
        deepButtonText: "갈등 스타일"
    },
    fruit: {
        testType: "matching",
        icon: "FruitIcon",
        lucideIcon: "Apple",
        emoji: "🍎",
        label: "과일",
        intro: ["나를 과일로 표현하면?", "내 성격과 닮은 과일은?", "오늘의 과일 추천"],
        resultFormat: "matching",
        deepButtonText: "과일 취향"
    },
    alcohol: {
        testType: "matching",
        icon: "AlcoholIcon",
        lucideIcon: "Wine",
        emoji: "🍺",
        label: "술",
        intro: ["나에게 맞는 술은?", "오늘 뭐 마실까?", "내 취향의 술 찾기"],
        resultFormat: "matching",
        deepButtonText: "술 취향"
    },
    bread: {
        testType: "matching",
        icon: "BreadIcon",
        lucideIcon: "Croissant",
        emoji: "🥐",
        label: "빵",
        intro: ["나를 빵으로 표현하면?", "내 성격과 닮은 빵은?", "오늘의 빵 추천"],
        resultFormat: "matching",
        deepButtonText: "빵 취향"
    },
    perfume: {
        testType: "matching",
        icon: "PerfumeIcon",
        lucideIcon: "Sparkle",
        emoji: "🌸",
        label: "향수",
        intro: ["나에게 맞는 향수는?", "내 분위기와 어울리는 향은?", "시그니처 향 찾기"],
        resultFormat: "matching",
        deepButtonText: "향수 취향"
    },
    aroma: {
        testType: "matching",
        icon: "AromaIcon",
        lucideIcon: "Leaf",
        emoji: "🕯️",
        label: "아로마",
        intro: ["나에게 맞는 아로마는?", "오늘의 힐링 향", "테라피 향 추천"],
        resultFormat: "matching",
        deepButtonText: "아로마 취향"
    },
    food: {
        testType: "matching",
        icon: "ChefHatIcon",
        lucideIcon: "UtensilsCrossed",
        emoji: "🍕",
        label: "음식",
        intro: ["나와 닮은 소울 푸드는?", "오늘 뭐 먹지?", "내 성향과 맞는 음식 찾기"],
        resultFormat: "matching",
        deepButtonText: "음식 취향",
        matchPointsTitle: "🍴 이런 분에게 추천해요",
        tabLabels: { interpretation: "🍱 소개", guide: "👨‍🍳 즐기는 법" },
        tabActiveColor: "bg-orange-100 border-orange-400",
        checkColor: "text-orange-600",
        analysisButtonText: "🍴 상세 입맛 분석 보기"
    },
    whiskeySample: {
        testType: "matching",
        icon: "WhiskeySampleIcon",
        lucideIcon: "Wine",
        emoji: "🥃",
        label: "위스키",
        intro: ["나에게 맞는 위스키는?", "내 취향의 위스키 찾기", "위스키 입문 가이드"],
        resultFormat: "matching",
        deepButtonText: "위스키 취향",
        matchPointsTitle: "🥃 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 소개", guide: "🍷 즐기는 법" },
        tabActiveColor: "bg-amber-100 border-amber-500",
        checkColor: "text-amber-700",
        analysisButtonText: "🥃 상세 취향 분석 보기"
    },
    ramen: {
        testType: "matching",
        icon: "RamenIcon",
        lucideIcon: "Soup",
        emoji: "🍜",
        label: "라면",
        intro: ["나에게 맞는 라면은?", "오늘 뭐 끓이지?", "내 취향의 라면 찾기"],
        resultFormat: "matching",
        deepButtonText: "라면 취향",
        matchPointsTitle: "🍜 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 소개", guide: "🍲 맛있게 먹는 법" },
        tabActiveColor: "bg-red-100 border-red-500",
        checkColor: "text-red-600",
        analysisButtonText: "🍜 상세 취향 분석 보기"
    },
    spendingStyle: {
        testType: "personality",
        icon: "SpendingStyleIcon",
        lucideIcon: "Wallet",
        emoji: "💳",
        label: "소비 성향",
        intro: ["나는 어떤 소비 스타일?", "내 지갑 사용법은?", "쇼핑 홀릭? 절약왕?"],
        resultFormat: "simple",
        deepButtonText: "소비 성향"
    },
    drinkingStyle: {
        testType: "personality",
        icon: "DrinkingStyleIcon",
        lucideIcon: "Beer",
        emoji: "🍺",
        label: "음주 유형",
        intro: ["나는 어떤 음주 스타일?", "술자리에서 나는?", "분위기 메이커? 조용한 음미파?"],
        resultFormat: "simple",
        deepButtonText: "음주 유형"
    },
    travelStyle: {
        testType: "personality",
        icon: "TravelStyleIcon",
        lucideIcon: "Plane",
        emoji: "✈️",
        label: "여행 스타일",
        intro: ["나의 여행 스타일은?", "계획형? 즉흥형?", "힐링 여행? 액티비티 여행?"],
        resultFormat: "simple",
        deepButtonText: "여행 스타일"
    },
    gameStyle: {
        testType: "personality",
        icon: "GameStyleIcon",
        lucideIcon: "Gamepad2",
        emoji: "🎮",
        label: "게임 스타일",
        intro: ["당신의 게임 플레이 스타일은?", "경쟁형? 탐험형?", "혼자? 같이?"],
        resultFormat: "simple",
        deepButtonText: "게임 스타일"
    },
    snsStyle: {
        testType: "personality",
        icon: "SnsStyleIcon",
        lucideIcon: "Share2",
        emoji: "📱",
        label: "SNS 성격",
        intro: ["당신의 SNS 페르소나는?", "인플루언서? 잠수함?", "공유러? 관찰러?"],
        resultFormat: "simple",
        deepButtonText: "SNS 스타일"
    },
    homeStyle: {
        testType: "matching",
        icon: "HomeStyleIcon",
        lucideIcon: "Sofa",
        emoji: "🛋️",
        label: "집콕 취미",
        intro: ["나에게 맞는 집콕 취미는?", "창작형? 감상형?", "활동적? 편안하게?"],
        resultFormat: "matching",
        deepButtonText: "집콕 취향",
        matchPointsTitle: "🛋️ 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 소개", guide: "💡 시작 팁" },
        tabActiveColor: "bg-amber-100 border-amber-500",
        checkColor: "text-amber-600",
        analysisButtonText: "🛋️ 상세 취향 분석 보기"
    },
    movieGenre: {
        testType: "matching",
        icon: "MovieGenreIcon",
        lucideIcon: "Clapperboard",
        emoji: "🎬",
        label: "영화/드라마",
        intro: ["당신에게 맞는 장르는?", "스릴러? 로맨스?", "코미디? SF?"],
        resultFormat: "matching",
        deepButtonText: "장르 취향",
        matchPointsTitle: "🎬 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 소개", guide: "🍿 추천 작품" },
        tabActiveColor: "bg-violet-100 border-violet-500",
        checkColor: "text-violet-600",
        analysisButtonText: "🎬 상세 취향 분석 보기"
    },
    // 세부 테스트
    dogBreed: {
        testType: "matching",
        icon: "DogFace",
        lucideIcon: "Dog",
        emoji: "🐕",
        label: "강아지 품종",
        intro: ["어떤 품종이 나와 맞을까?", "운명의 반려견 찾기"],
        resultFormat: "matching",
        deepButtonText: "품종 매칭"
    },
    catBreed: {
        testType: "matching",
        icon: "CatFace",
        lucideIcon: "Cat",
        emoji: "🐈",
        label: "고양이 품종",
        intro: ["어떤 품종이 나와 맞을까?", "운명의 반려묘 찾기"],
        resultFormat: "matching",
        deepButtonText: "품종 매칭"
    },
    smallPet: {
        testType: "matching",
        icon: "HamsterFace",
        lucideIcon: "Puzzle",
        emoji: "🐹",
        label: "소동물",
        intro: ["어떤 소동물이 나와 맞을까?", "귀여운 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "소동물 매칭"
    },
    fishType: {
        testType: "matching",
        icon: "FishIcon",
        lucideIcon: "Fish",
        emoji: "🐠",
        label: "물고기",
        intro: ["어떤 물고기가 나와 맞을까?", "수중 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "물고기 매칭"
    },
    birdType: {
        testType: "matching",
        icon: "BirdIcon",
        lucideIcon: "Bird",
        emoji: "🦜",
        label: "새",
        intro: ["어떤 새가 나와 맞을까?", "깃털 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "새 매칭"
    },
    reptileType: {
        testType: "matching",
        icon: "ReptileIcon",
        lucideIcon: "Bug",
        emoji: "🦎",
        label: "파충류",
        intro: ["어떤 파충류가 나와 맞을까?", "쿨한 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "파충류 매칭"
    },
    wine: {
        testType: "matching",
        icon: "WineIcon",
        lucideIcon: "Wine",
        emoji: "🍷",
        label: "와인",
        intro: ["나에게 어울리는 와인은?", "취향 저격 와인 찾기"],
        resultFormat: "matching",
        deepButtonText: "와인 매칭"
    },
    travel: {
        testType: "matching",
        icon: "TravelIcon",
        lucideIcon: "Plane",
        emoji: "✈️",
        label: "여행",
        intro: ["나의 여행 스타일은?", "완벽한 여행지 찾기"],
        resultFormat: "matching",
        deepButtonText: "여행지 매칭"
    },
    exercise: {
        testType: "matching",
        icon: "ExerciseIcon",
        lucideIcon: "Dumbbell",
        emoji: "🏋️",
        label: "운동",
        intro: ["나에게 맞는 운동은?", "운동 궁합 찾기"],
        resultFormat: "matching",
        deepButtonText: "운동 매칭"
    },
    bloodType: {
        testType: "matching",
        icon: "BloodTypeIcon",
        lucideIcon: "Droplet",
        emoji: "🩸",
        label: "혈액형",
        intro: ["나의 혈액형 성향은?", "혈액형별 특징 찾기"],
        resultFormat: "matching",
        deepButtonText: "혈액형 매칭",
        matchPointsTitle: "🩸 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 특징", guide: "💡 조언" },
        tabActiveColor: "bg-red-100 border-red-400",
        checkColor: "text-red-600",
        analysisButtonText: "🩸 상세 성향 분석 보기"
    }
};

// 세부 테스트 키 목록 (반려동물 품종 등)
export const DETAIL_TEST_KEYS: SubjectKey[] = [
    'dogBreed', 'catBreed', 'smallPet', 'fishType', 'birdType', 'reptileType'
];

// 메인 테스트 키 목록 (세부 테스트 제외)
export const MAIN_TEST_KEYS = (Object.keys(SUBJECT_CONFIG) as SubjectKey[])
    .filter(key => !DETAIL_TEST_KEYS.includes(key));

// 랭킹 가능한 테스트 목록 (성격 테스트만)
export const RANKABLE_TESTS: Array<{ key: keyof typeof SUBJECT_CONFIG; emoji: string; name: string }> = [
    { key: 'human', emoji: '👤', name: '사람 성격' },
    { key: 'cat', emoji: '🐱', name: '고양이 성격' },
    { key: 'dog', emoji: '🐶', name: '강아지 성격' },
    { key: 'rabbit', emoji: '🐰', name: '토끼 성격' },
    { key: 'hamster', emoji: '🐹', name: '햄스터 성격' },
];

// 랭킹 가능한 테스트 키만
export const RANKABLE_TEST_KEYS = RANKABLE_TESTS.map(t => t.key);
