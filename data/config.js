// Subject 설정 - 새 테스트 추가시 여기에만 추가하면 됨
// 생성일: 2025-12-11

// 테스트 타입 정의
const TEST_TYPES = {
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

const SUBJECT_CONFIG = {
    human: {
        testType: "personality",
        icon: "HumanIcon",
        label: "사람",
        intro: ["나는 어떤 사람일까?", "나의 숨겨진 성격은?", "친구들이 보는 나는?"],
        resultFormat: "simple",  // simple: 단순 형식, tabs: 탭형 (심층해석/육아팁)
        deepButtonText: "내 성격"
    },
    cat: {
        testType: "personality",
        icon: "CatFace",
        label: "고양이",
        intro: ["철학 냥이?", "보스 냥이?", "인싸 냥이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 냥이"
    },
    dog: {
        testType: "personality",
        icon: "DogFace",
        label: "강아지",
        intro: ["규율 멍멍이?", "파티 멍멍이?", "CEO 멍멍이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 멍이"
    },
    rabbit: {
        testType: "personality",
        icon: "RabbitFace",
        label: "토끼",
        intro: ["탐험가 토끼?", "애교쟁이 토끼?", "독립적인 토끼?"],
        resultFormat: "tabs",
        deepButtonText: "우리 토끼"
    },
    hamster: {
        testType: "personality",
        icon: "HamsterFace",
        label: "햄스터",
        intro: ["쳇바퀴 마스터?", "수집왕 햄찌?", "인싸 햄찌?"],
        resultFormat: "tabs",
        deepButtonText: "우리 햄찌"
    },
    idealType: {
        testType: "matching",
        icon: "HeartIcon",
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
        label: "커피",
        intro: ["나에게 맞는 커피는?", "오늘 뭐 마시지?", "내 취향의 커피 찾기"],
        resultFormat: "matching",
        deepButtonText: "커피 취향",
        matchPointsTitle: "☕ 이런 분에게 추천해요",
        tabLabels: { interpretation: "📖 소개", guide: "💡 즐기는 팁" },
        tabActiveColor: "bg-amber-200 border-amber-600",
        checkColor: "text-amber-700",
        analysisButtonText: "☕ 상세 취향 분석 보기"
    }
};

window.TEST_TYPES = TEST_TYPES;
window.SUBJECT_CONFIG = SUBJECT_CONFIG;
