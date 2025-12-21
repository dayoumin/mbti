// Subject 설정 - 새 테스트 추가시 여기에만 추가하면 됨
// 생성일: 2025-12-11

import type { SubjectConfig, SubjectKey } from './types';

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
        emoji: "👤",
        label: "사람",
        intro: ["나는 어떤 사람일까?", "나의 숨겨진 성격은?", "친구들이 보는 나는?"],
        resultFormat: "simple",  // simple: 단순 형식, tabs: 탭형 (심층해석/육아팁)
        deepButtonText: "내 성격"
    },
    cat: {
        testType: "personality",
        icon: "CatFace",
        emoji: "🐱",
        label: "고양이",
        intro: ["철학 냥이?", "보스 냥이?", "인싸 냥이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 냥이"
    },
    dog: {
        testType: "personality",
        icon: "DogFace",
        emoji: "🐶",
        label: "강아지",
        intro: ["규율 멍멍이?", "파티 멍멍이?", "CEO 멍멍이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 멍이"
    },
    rabbit: {
        testType: "personality",
        icon: "RabbitFace",
        emoji: "🐰",
        label: "토끼",
        intro: ["탐험가 토끼?", "애교쟁이 토끼?", "독립적인 토끼?"],
        resultFormat: "tabs",
        deepButtonText: "우리 토끼"
    },
    hamster: {
        testType: "personality",
        icon: "HamsterFace",
        emoji: "🐹",
        label: "햄스터",
        intro: ["쳇바퀴 마스터?", "수집왕 햄찌?", "인싸 햄찌?"],
        resultFormat: "tabs",
        deepButtonText: "우리 햄찌"
    },
    idealType: {
        testType: "matching",
        icon: "HeartIcon",
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
        emoji: "🍵",
        label: "차",
        intro: ["나에게 맞는 차는?", "오늘의 티타임", "내 취향의 차 찾기"],
        resultFormat: "matching",
        deepButtonText: "차 취향"
    },
    conflictStyle: {
        testType: "personality",
        icon: "ConflictIcon",
        emoji: "🤝",
        label: "갈등 대처",
        intro: ["나의 갈등 대처 스타일은?", "관계에서 어떻게 소통할까?", "더 나은 관계를 위해"],
        resultFormat: "simple",
        deepButtonText: "갈등 스타일"
    },
    fruit: {
        testType: "matching",
        icon: "FruitIcon",
        emoji: "🍎",
        label: "과일",
        intro: ["나를 과일로 표현하면?", "내 성격과 닮은 과일은?", "오늘의 과일 추천"],
        resultFormat: "matching",
        deepButtonText: "과일 취향"
    },
    alcohol: {
        testType: "matching",
        icon: "AlcoholIcon",
        emoji: "🍺",
        label: "술",
        intro: ["나에게 맞는 술은?", "오늘 뭐 마실까?", "내 취향의 술 찾기"],
        resultFormat: "matching",
        deepButtonText: "술 취향"
    },
    bread: {
        testType: "matching",
        icon: "BreadIcon",
        emoji: "🥐",
        label: "빵",
        intro: ["나를 빵으로 표현하면?", "내 성격과 닮은 빵은?", "오늘의 빵 추천"],
        resultFormat: "matching",
        deepButtonText: "빵 취향"
    },
    perfume: {
        testType: "matching",
        icon: "PerfumeIcon",
        emoji: "🌸",
        label: "향수",
        intro: ["나에게 맞는 향수는?", "내 분위기와 어울리는 향은?", "시그니처 향 찾기"],
        resultFormat: "matching",
        deepButtonText: "향수 취향"
    },
    aroma: {
        testType: "matching",
        icon: "AromaIcon",
        emoji: "🕯️",
        label: "아로마",
        intro: ["나에게 맞는 아로마는?", "오늘의 힐링 향", "테라피 향 추천"],
        resultFormat: "matching",
        deepButtonText: "아로마 취향"
    },
    food: {
        testType: "matching",
        icon: "ChefHatIcon",
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
    // 세부 테스트
    dogBreed: {
        testType: "matching",
        icon: "DogFace",
        emoji: "🐕",
        label: "강아지 품종",
        intro: ["어떤 품종이 나와 맞을까?", "운명의 반려견 찾기"],
        resultFormat: "matching",
        deepButtonText: "품종 매칭"
    },
    catBreed: {
        testType: "matching",
        icon: "CatFace",
        emoji: "🐈",
        label: "고양이 품종",
        intro: ["어떤 품종이 나와 맞을까?", "운명의 반려묘 찾기"],
        resultFormat: "matching",
        deepButtonText: "품종 매칭"
    },
    smallPet: {
        testType: "matching",
        icon: "HamsterFace",
        emoji: "🐹",
        label: "소동물",
        intro: ["어떤 소동물이 나와 맞을까?", "귀여운 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "소동물 매칭"
    },
    fishType: {
        testType: "matching",
        icon: "FishIcon",
        emoji: "🐠",
        label: "물고기",
        intro: ["어떤 물고기가 나와 맞을까?", "수중 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "물고기 매칭"
    },
    birdType: {
        testType: "matching",
        icon: "BirdIcon",
        emoji: "🦜",
        label: "새",
        intro: ["어떤 새가 나와 맞을까?", "깃털 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "새 매칭"
    },
    reptileType: {
        testType: "matching",
        icon: "ReptileIcon",
        emoji: "🦎",
        label: "파충류",
        intro: ["어떤 파충류가 나와 맞을까?", "쿨한 친구 찾기"],
        resultFormat: "matching",
        deepButtonText: "파충류 매칭"
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
