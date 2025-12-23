// whiskeySample 테스트 데이터 (나에게 맞는 위스키 매칭)
// 생성일: 2025-12-22
// 기반: research/whiskey-sample.md

import type { SubjectData } from '../types';

export const whiskeySampleData: SubjectData = {
    "title": "나에게 맞는 위스키는?",
    "subtitle": "당신의 취향에 딱 맞는 위스키를 찾아드려요",
    "themeColor": "bg-amber-100",
    "icon": "WhiskeySampleIcon",
    "testType": "matching",
    "dimensions": {
        "smoky": {
            "name": "스모키",
            "emoji": "🔥",
            "desc": "피티/스모키 정도"
        },
        "body": {
            "name": "바디감",
            "emoji": "💪",
            "desc": "맛의 무게감/풍성함"
        },
        "sweet": {
            "name": "단맛",
            "emoji": "🍯",
            "desc": "달콤한 정도"
        },
        "complex": {
            "name": "복잡도",
            "emoji": "🧩",
            "desc": "맛의 층위 다양성"
        },
        "smooth": {
            "name": "부드러움",
            "emoji": "🌊",
            "desc": "목넘김 질감"
        }
    },
    "questions": [
        // 차원: smoky (2개)
        {
            "q": "캠프파이어에서 맡는 연기 냄새, 어떠세요?",
            "dimension": "smoky",
            "a": [
                { "text": "그 냄새가 너무 좋아요!", "score": 5 },
                { "text": "살짝 나는 건 괜찮아요", "score": 3 },
                { "text": "솔직히 별로예요", "score": 1 }
            ]
        },
        {
            "q": "훈제 연어나 훈제 치즈를 좋아하나요?",
            "dimension": "smoky",
            "a": [
                { "text": "훈제 음식 완전 좋아해요!", "score": 5 },
                { "text": "가끔은 먹어요", "score": 3 },
                { "text": "별로 안 좋아해요", "score": 1 }
            ]
        },
        // 차원: body (2개)
        {
            "q": "음료를 마실 때 선호하는 느낌은?",
            "dimension": "body",
            "a": [
                { "text": "묵직하고 풍성한 느낌", "score": 5 },
                { "text": "중간 정도의 무게감", "score": 3 },
                { "text": "가볍고 산뜻한 느낌", "score": 1 }
            ]
        },
        {
            "q": "스테이크를 먹는다면?",
            "dimension": "body",
            "a": [
                { "text": "마블링 좋은 두꺼운 고기", "score": 5 },
                { "text": "적당한 두께면 좋아요", "score": 3 },
                { "text": "얇고 담백한 게 좋아요", "score": 1 }
            ]
        },
        // 차원: sweet (2개)
        {
            "q": "디저트를 고른다면?",
            "dimension": "sweet",
            "a": [
                { "text": "진한 초콜릿 케이크", "score": 5 },
                { "text": "과일 타르트", "score": 3 },
                { "text": "에스프레소 한 잔", "score": 1 }
            ]
        },
        {
            "q": "커피는 어떻게 마시나요?",
            "dimension": "sweet",
            "a": [
                { "text": "시럽 넣은 달달한 커피", "score": 5 },
                { "text": "우유만 살짝", "score": 3 },
                { "text": "블랙으로!", "score": 1 }
            ]
        },
        // 차원: complex (2개)
        {
            "q": "와인을 마실 때?",
            "dimension": "complex",
            "a": [
                { "text": "여러 풍미가 느껴지는 게 좋아요", "score": 5 },
                { "text": "적당히 복잡한 게 좋아요", "score": 3 },
                { "text": "단순명쾌한 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "영화는 어떤 스타일?",
            "dimension": "complex",
            "a": [
                { "text": "반전과 복선 가득한 영화", "score": 5 },
                { "text": "적당히 흥미로운 영화", "score": 3 },
                { "text": "스토리가 명확한 영화", "score": 1 }
            ]
        },
        // 차원: smooth (2개)
        {
            "q": "술을 마실 때 가장 중요한 것은?",
            "dimension": "smooth",
            "a": [
                { "text": "부드러운 목넘김", "score": 5 },
                { "text": "적당한 자극", "score": 3 },
                { "text": "강렬한 임팩트", "score": 1 }
            ]
        },
        {
            "q": "카레 맵기를 고른다면?",
            "dimension": "smooth",
            "a": [
                { "text": "순한맛", "score": 5 },
                { "text": "보통맛", "score": 3 },
                { "text": "매운맛", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "아일라 싱글몰트",
            "emoji": "🥃",
            "desc": "바다와 연기의 조화, 아일라섬의 강렬함",
            "condition": { "smoky": "high", "body": "high" },
            "mood": "cool",
            "color": "bg-slate-700",
            "interpretation": "당신은 강렬하고 개성 있는 맛을 추구합니다. 도전적인 맛도 두려워하지 않고, 깊은 풍미를 음미할 줄 압니다.",
            "guide": "라프로익 10년, 아드벡 10년, 라가불린 16년을 추천드려요.",
            "matchPoints": ["강한 개성을 좋아하는 분", "위스키 경험이 풍부한 분", "바다향을 즐기는 분"]
        },
        {
            "name": "스페이사이드 싱글몰트",
            "emoji": "🍯",
            "desc": "꿀과 과일향의 우아한 조화",
            "condition": { "sweet": "high", "smooth": "high" },
            "mood": "happy",
            "color": "bg-amber-400",
            "interpretation": "부드럽고 달콤한 것을 좋아하는 당신. 우아하고 균형 잡힌 맛을 선호합니다.",
            "guide": "글렌피딕 15년, 맥캘란 12년, 발베니 더블우드를 추천드려요.",
            "matchPoints": ["달콤한 맛 선호", "부드러운 목넘김 중시", "입문자에게 추천"]
        },
        {
            "name": "하이랜드 싱글몰트",
            "emoji": "🏔️",
            "desc": "꽃향기와 헤더향의 산뜻함",
            "condition": { "body": "medium", "complex": "high" },
            "mood": "calm",
            "color": "bg-emerald-400",
            "interpretation": "복잡하고 다층적인 맛을 즐기는 미식가 타입. 다양한 향미의 조화를 감상합니다.",
            "guide": "글렌모렌지 오리지널, 달모어 12년, 오반 14년을 추천드려요.",
            "matchPoints": ["복잡한 풍미 선호", "자연스러운 향 중시", "탐구형 음주자"]
        },
        {
            "name": "로우랜드 싱글몰트",
            "emoji": "🌿",
            "desc": "가볍고 상쾌한 풀향기",
            "condition": { "body": "low", "smooth": "high" },
            "mood": "calm",
            "color": "bg-lime-300",
            "interpretation": "가볍고 부담 없는 맛을 선호합니다. 깔끔하고 상쾌한 것을 좋아해요.",
            "guide": "글렌킨치 12년, 오크니를 추천드려요.",
            "matchPoints": ["가벼운 맛 선호", "식전주로 적합", "위스키 입문자"]
        },
        {
            "name": "버번",
            "emoji": "🌽",
            "desc": "옥수수의 달콤함과 바닐라향",
            "condition": { "sweet": "high", "smoky": "low" },
            "mood": "happy",
            "color": "bg-orange-400",
            "interpretation": "달콤하고 친근한 맛을 좋아합니다. 스모키한 것보다는 바닐라와 캐러멜을 선호해요.",
            "guide": "메이커스 마크, 버팔로 트레이스, 우드포드 리저브를 추천드려요.",
            "matchPoints": ["달콤한 맛 선호", "스모키 비선호", "칵테일 베이스로도 활용"]
        },
        {
            "name": "아이리쉬 위스키",
            "emoji": "☘️",
            "desc": "부드럽고 순한 트리플 증류",
            "condition": { "smooth": "high", "complex": "low" },
            "mood": "happy",
            "color": "bg-green-400",
            "interpretation": "부드럽고 마시기 편한 것을 최고로 칩니다. 복잡한 것보다 깔끔한 맛이 좋아요.",
            "guide": "제임슨, 부쉬밀스, 레드브레스트를 추천드려요.",
            "matchPoints": ["극도의 부드러움", "입문자 최적", "하이볼에 적합"]
        },
        {
            "name": "블렌디드 스카치",
            "emoji": "🎩",
            "desc": "균형 잡힌 접근성 좋은 맛",
            "condition": { "body": "medium", "sweet": "medium" },
            "mood": "calm",
            "color": "bg-yellow-600",
            "interpretation": "극단적인 맛보다 균형을 중시합니다. 다양한 상황에서 무난하게 즐길 수 있는 것을 선호해요.",
            "guide": "조니워커 블랙, 시바스 리갈 12년, 발렌타인 17년을 추천드려요.",
            "matchPoints": ["균형 잡힌 맛", "다용도 활용", "선물용으로도 적합"]
        },
        {
            "name": "캠벨타운 싱글몰트",
            "emoji": "⚓",
            "desc": "소금기와 오일리한 특성",
            "condition": { "smoky": "medium", "body": "high" },
            "mood": "cool",
            "color": "bg-cyan-600",
            "interpretation": "독특하고 개성 있는 맛을 찾습니다. 해안가의 짭짤함과 오일리한 질감을 즐겨요.",
            "guide": "스프링뱅크 10년, 글렌스코샤를 추천드려요.",
            "matchPoints": ["독특한 개성 추구", "바다향 좋아함", "위스키 매니아"]
        }
    ]
};

if (typeof window !== 'undefined') {
  (window as unknown as { CHEMI_SUBJECTS?: Record<string, typeof whiskeySampleData> }).CHEMI_SUBJECTS =
    (window as unknown as { CHEMI_SUBJECTS?: Record<string, typeof whiskeySampleData> }).CHEMI_SUBJECTS || {};
  (window as unknown as { CHEMI_SUBJECTS: Record<string, typeof whiskeySampleData> }).CHEMI_SUBJECTS.whiskeySample = whiskeySampleData;
}
