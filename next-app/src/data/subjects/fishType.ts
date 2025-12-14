// fishType 테스트 데이터 - 관상어 추천
// petMatch에서 "관상어" 결과 후 연결되는 세부 테스트

import { SubjectData } from '../types';

export const fishTypeData: SubjectData = {
    "title": "나에게 맞는 관상어",
    "subtitle": "어떤 물고기와 잘 맞을까?",
    "themeColor": "bg-blue-400",
    "icon": "FishIcon",
    "testType": "matching",
    "dimensions": {
        "difficulty": {
            "name": "난이도",
            "emoji": "📊",
            "desc": "원하는 사육 난이도"
        },
        "tankSize": {
            "name": "수조크기",
            "emoji": "🐟",
            "desc": "준비할 수 있는 수조 크기"
        },
        "visual": {
            "name": "시각적",
            "emoji": "✨",
            "desc": "원하는 시각적 효과"
        },
        "social": {
            "name": "군영",
            "emoji": "👥",
            "desc": "군영 vs 단독 사육"
        },
        "maintenance": {
            "name": "관리",
            "emoji": "🧹",
            "desc": "관리 투자 의향"
        }
    },
    "questions": [
        // === 난이도 (difficulty) ===
        {
            "q": "관상어 경험이 있나요?",
            "dimension": "difficulty",
            "a": [
                { "text": "처음이에요, 쉬운 것부터", "score": 1 },
                { "text": "금붕어 정도 키워봤어요", "score": 3 },
                { "text": "열대어 경험 있어요", "score": 5 }
            ]
        },
        // === 수조 크기 (tankSize) ===
        {
            "q": "어느 정도 크기의 수조를 둘 수 있나요?",
            "dimension": "tankSize",
            "a": [
                { "text": "작은 어항 (10L 이하)", "score": 1 },
                { "text": "중형 수조 (30~60L)", "score": 3 },
                { "text": "대형 수조 (60L 이상)", "score": 5 }
            ]
        },
        // === 시각적 효과 (visual) ===
        {
            "q": "어떤 스타일의 물고기를 원하나요?",
            "dimension": "visual",
            "a": [
                { "text": "심플하고 관리 쉬운 것", "score": 1 },
                { "text": "예쁜 색상과 무늬", "score": 3 },
                { "text": "화려하고 우아한 것", "score": 5 }
            ]
        },
        {
            "q": "수조 인테리어에 관심 있나요?",
            "dimension": "visual",
            "a": [
                { "text": "간단하게 할래요", "score": 1 },
                { "text": "적당히 꾸밀래요", "score": 3 },
                { "text": "아쿠아스케이핑에 도전!", "score": 5 }
            ]
        },
        // === 군영 (social) ===
        {
            "q": "여러 마리가 함께 헤엄치는 모습을 보고 싶나요?",
            "dimension": "social",
            "a": [
                { "text": "한 마리만 있어도 돼요", "score": 1 },
                { "text": "몇 마리 정도", "score": 3 },
                { "text": "군영으로 헤엄치는 모습이 보고 싶어요!", "score": 5 }
            ]
        },
        // === 관리 (maintenance) ===
        {
            "q": "물갈이와 수질 관리에 시간을 쓸 수 있나요?",
            "dimension": "maintenance",
            "a": [
                { "text": "최소한으로 하고 싶어요", "score": 1 },
                { "text": "주 1회 정도 가능해요", "score": 3 },
                { "text": "정기적 관리 가능해요", "score": 5 }
            ]
        }
    ],
    "questions_deep": [],
    "resultLabels": [
        {
            "name": "베타",
            "emoji": "🐟",
            "desc": "화려한 지느러미의 투사",
            "condition": { "difficulty": "low", "tankSize": "low", "social": "low" },
            "mood": "cool",
            "color": "bg-purple-100",
            "interpretation": "혼자서도 충분히 아름다운 베타! 작은 어항에서도 키울 수 있고, 관리도 쉬워요. 다양한 색상과 화려한 지느러미가 매력적이에요.",
            "guide": "반드시 단독 사육! 다른 베타나 화려한 물고기와 함께 키우면 안 돼요. 여과기 없이도 가능하지만 있으면 더 좋아요. 수온 25-28도 유지.",
            "matchPoints": ["첫 관상어로 추천", "작은 공간에서 키우고 싶은 분", "화려한 색상을 원하는 분", "단독 사육을 원하는 분"]
        },
        {
            "name": "구피",
            "emoji": "🐟",
            "desc": "알록달록 번식이 쉬운 물고기",
            "condition": { "difficulty": "low", "tankSize": "low", "social": "high" },
            "mood": "happy",
            "color": "bg-rainbow-100",
            "interpretation": "다양한 색상과 무늬가 예쁜 구피! 번식이 매우 쉬워서 '물고기 공장'이라 불려요. 수컷이 더 화려하고, 암컷은 새끼를 낳아요.",
            "guide": "번식을 원치 않으면 수컷만 키우세요. 수온 22-26도, pH 7.0-8.0이 좋아요. 초보자에게 딱 맞는 물고기!",
            "matchPoints": ["초보자에게 추천", "번식의 기쁨을 느끼고 싶은 분", "다양한 색상을 원하는 분", "여러 마리를 키우고 싶은 분"]
        },
        {
            "name": "네온테트라",
            "emoji": "🐟",
            "desc": "빛나는 파란 줄의 군영어",
            "condition": { "difficulty": "low", "tankSize": "high", "social": "high", "visual": "high" },
            "mood": "cool",
            "color": "bg-blue-100",
            "interpretation": "빛나는 파란색과 빨간색의 네온테트라! 10마리 이상 군영으로 키우면 정말 아름다워요. 수조를 수중 정원처럼 꾸밀 수 있어요.",
            "guide": "최소 10마리 이상 함께 키우세요. 수온 22-26도, 약산성(pH 6.0-7.0)을 좋아해요. 수초와 함께 키우면 더 예뻐요.",
            "matchPoints": ["군영의 아름다움을 원하는 분", "수초 수조에 관심 있는 분", "아쿠아스케이핑을 하고 싶은 분", "평화로운 수조를 원하는 분"]
        },
        {
            "name": "금붕어",
            "emoji": "🐟",
            "desc": "전통적인 관상어의 대표",
            "condition": { "difficulty": "low", "tankSize": "high", "maintenance": "high" },
            "mood": "happy",
            "color": "bg-orange-100",
            "interpretation": "오랜 역사의 관상어 금붕어! 생각보다 큰 수조가 필요하고, 오래 살아요(10~15년). 먹이를 먹는 모습이 귀여워요.",
            "guide": "작은 어항은 NO! 최소 60L 이상 권장. 히터 없이도 되지만 급격한 온도 변화는 피하세요. 먹이를 많이 먹어서 물이 빨리 더러워져요.",
            "matchPoints": ["전통적인 관상어를 원하는 분", "오래 함께하고 싶은 분", "히터 없이 키우고 싶은 분", "큰 수조를 둘 수 있는 분"]
        },
        {
            "name": "코리도라스",
            "emoji": "🐟",
            "desc": "바닥 청소부 귀염둥이",
            "condition": { "difficulty": "low", "tankSize": "high", "social": "high", "maintenance": "low" },
            "mood": "happy",
            "color": "bg-gray-100",
            "interpretation": "수조 바닥을 청소해주는 귀여운 코리도라스! 수염을 움직이며 바닥을 뒤지는 모습이 귀여워요. 다른 물고기와 합사도 잘해요.",
            "guide": "3마리 이상 함께 키우세요. 바닥재는 모래가 좋아요(자갈은 수염 다칠 수 있어요). 온순해서 대부분의 물고기와 잘 지내요.",
            "matchPoints": ["청소부 물고기가 필요한 분", "귀여운 물고기를 원하는 분", "합사할 물고기를 찾는 분", "온순한 물고기를 원하는 분"]
        },
        {
            "name": "엔젤피시",
            "emoji": "🐟",
            "desc": "우아한 삼각형의 여왕",
            "condition": { "difficulty": "high", "tankSize": "high", "visual": "high" },
            "mood": "cool",
            "color": "bg-silver-100",
            "interpretation": "우아하게 헤엄치는 엔젤피시! 독특한 삼각형 몸매와 긴 지느러미가 매력적이에요. 수조의 중심을 차지하는 존재감이 있어요.",
            "guide": "키가 크니 높은 수조가 필요해요. 영역 의식이 있어 작은 물고기는 잡아먹을 수 있어요. 수온 26-30도, pH 6.5-7.0.",
            "matchPoints": ["우아한 물고기를 원하는 분", "중급자에게 추천", "큰 수조를 둘 수 있는 분", "존재감 있는 물고기를 원하는 분"]
        },
        {
            "name": "디스커스",
            "emoji": "🐟",
            "desc": "열대어의 왕",
            "condition": { "difficulty": "high", "tankSize": "high", "visual": "high", "maintenance": "high" },
            "mood": "cool",
            "color": "bg-red-100",
            "interpretation": "열대어의 왕이라 불리는 디스커스! 원반형 몸에 다양한 색상과 무늬가 아름다워요. 까다롭지만 그만큼 보람 있어요.",
            "guide": "수질에 매우 민감해요. 수온 28-30도, 약산성 연수가 필요해요. 물갈이를 자주 해줘야 해요. 상급자에게 추천!",
            "matchPoints": ["상급자에게 도전", "가장 아름다운 물고기를 원하는 분", "정성을 쏟을 수 있는 분", "열대어 왕에 도전하고 싶은 분"]
        },
        {
            "name": "플레코",
            "emoji": "🐟",
            "desc": "유리창 청소부",
            "condition": { "difficulty": "low", "tankSize": "high", "maintenance": "low", "visual": "low" },
            "mood": "cool",
            "color": "bg-brown-100",
            "interpretation": "수조 유리와 장식물의 이끼를 청소해주는 플레코! 야행성이라 낮에는 숨어있다가 밤에 활동해요. 묵묵히 일하는 일꾼이에요.",
            "guide": "종류에 따라 크기가 매우 다양해요(5cm~50cm). 야행성이라 숨을 곳을 만들어주세요. 이끼만으로 부족하니 플레코 전용 사료도 주세요.",
            "matchPoints": ["청소부 물고기가 필요한 분", "이끼 제거를 원하는 분", "야행성이 괜찮은 분", "큰 수조가 있는 분"]
        }
    ]
};
