// catBreed 테스트 데이터 - 고양이 품종 추천
// petMatch에서 "고양이" 결과 후 연결되는 세부 테스트

import { SubjectData } from '../types';

export const catBreedData: SubjectData = {
    "title": "나에게 맞는 고양이 품종",
    "subtitle": "어떤 고양이와 잘 맞을까?",
    "themeColor": "bg-slate-400",
    "icon": "CatIcon",
    "testType": "matching",
    "dimensions": {
        "activity": {
            "name": "활동성",
            "emoji": "⚡",
            "desc": "원하는 활동 수준"
        },
        "affection": {
            "name": "애교도",
            "emoji": "💕",
            "desc": "원하는 애교 수준"
        },
        "grooming": {
            "name": "관리도",
            "emoji": "✂️",
            "desc": "털 관리 투자 의향"
        },
        "vocal": {
            "name": "수다",
            "emoji": "🗣️",
            "desc": "고양이 소리 허용도"
        },
        "independence": {
            "name": "독립성",
            "emoji": "🏠",
            "desc": "독립적 vs 의존적"
        }
    },
    "questions": [
        // === 활동성 (activity) ===
        {
            "q": "어떤 스타일의 고양이를 원하시나요?",
            "dimension": "activity",
            "a": [
                { "text": "조용히 옆에 있는 고양이", "score": 1 },
                { "text": "가끔 놀아주면 되는 고양이", "score": 3 },
                { "text": "활발하게 뛰어노는 고양이", "score": 5 }
            ]
        },
        // === 애교도 (affection) ===
        {
            "q": "고양이와 어떤 관계를 원하나요?",
            "dimension": "affection",
            "a": [
                { "text": "도도하게 자기 할 일 하는 고양이", "score": 1 },
                { "text": "가끔 다가와 애교 부리는 고양이", "score": 3 },
                { "text": "항상 곁에 붙어있는 '개냥이'", "score": 5 }
            ]
        },
        {
            "q": "고양이가 무릎에 앉는 것을 좋아하시나요?",
            "dimension": "affection",
            "a": [
                { "text": "너무 달라붙는 건 부담스러워요", "score": 1 },
                { "text": "가끔은 좋아요", "score": 3 },
                { "text": "매일 안고 싶어요!", "score": 5 }
            ]
        },
        // === 관리도 (grooming) ===
        {
            "q": "털 관리에 대한 생각은?",
            "dimension": "grooming",
            "a": [
                { "text": "관리가 적은 단모종이 좋아요", "score": 1 },
                { "text": "적당한 관리는 OK", "score": 3 },
                { "text": "풍성한 장모종의 매력!", "score": 5 }
            ]
        },
        // === 수다 (vocal) ===
        {
            "q": "고양이 울음소리에 대한 생각은?",
            "dimension": "vocal",
            "a": [
                { "text": "조용한 고양이가 좋아요", "score": 1 },
                { "text": "적당히 소통하는 정도", "score": 3 },
                { "text": "수다쟁이도 귀여워요!", "score": 5 }
            ]
        },
        // === 독립성 (independence) ===
        {
            "q": "고양이가 혼자 있는 시간은?",
            "dimension": "independence",
            "a": [
                { "text": "거의 항상 함께 있어요", "score": 1 },
                { "text": "낮에는 혼자, 저녁에 함께", "score": 3 },
                { "text": "혼자 있는 시간이 꽤 길어요", "score": 5 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "첫 고양이인가요?",
            "dimension": "activity",
            "a": [
                { "text": "네, 처음이에요", "score": 1 },
                { "text": "어릴 때 키워봤어요", "score": 3 },
                { "text": "여러 마리 키워봤어요", "score": 5 }
            ]
        },
        {
            "q": "다른 반려동물이나 아이가 있나요?",
            "dimension": "affection",
            "a": [
                { "text": "없어요", "score": 3 },
                { "text": "다른 고양이가 있어요", "score": 5 },
                { "text": "강아지나 아이가 있어요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "코리안 숏헤어",
            "emoji": "🐱",
            "desc": "건강하고 적응력 좋은 토종 고양이",
            "condition": { "activity": "medium", "grooming": "low", "independence": "high" },
            "mood": "cool",
            "color": "bg-gray-100",
            "interpretation": "한국의 토종 고양이! 다양한 성격을 가지고 있어 만나봐야 알 수 있지만, 대체로 건강하고 환경 적응력이 뛰어나요. 유기묘 입양을 고려해보세요!",
            "guide": "성격이 다양해서 만나서 교감해보는 게 중요해요. 단모라 관리가 쉽고, 건강한 편이에요.",
            "matchPoints": ["유기묘 입양을 고려하는 분", "관리가 쉬운 고양이를 원하는 분", "건강한 고양이를 원하는 분", "다양한 개성을 즐기는 분"]
        },
        {
            "name": "러시안 블루",
            "emoji": "🐱",
            "desc": "조용하고 우아한 은빛 고양이",
            "condition": { "activity": "low", "vocal": "low", "independence": "high" },
            "mood": "cool",
            "color": "bg-slate-200",
            "interpretation": "은빛 털과 에메랄드 눈이 아름다운 러시안 블루! 조용하고 수줍음이 많아 1인 가구에 잘 맞아요. 낯선 사람에게는 경계하지만, 주인에게는 충성스러워요.",
            "guide": "환경 변화에 민감해요. 규칙적인 생활을 좋아하고, 조용한 환경에서 편안해해요. 털빠짐이 적은 편이에요.",
            "matchPoints": ["조용한 환경을 원하는 분", "1인 가구", "차분한 고양이를 원하는 분", "우아한 외모를 좋아하는 분"]
        },
        {
            "name": "랙돌",
            "emoji": "🐱",
            "desc": "안기면 축 늘어지는 봉제인형",
            "condition": { "affection": "high", "activity": "low", "grooming": "high" },
            "mood": "happy",
            "color": "bg-blue-100",
            "interpretation": "안으면 인형처럼 축 늘어진다고 해서 랙돌! 온순하고 애교가 넘치며 주인을 졸졸 따라다녀요. '개냥이'의 대표격으로, 스킨십을 좋아하는 분에게 딱이에요.",
            "guide": "장모종이라 매일 빗질이 필요해요. 순한 성격이라 다른 동물과도 잘 지내요. 실내에서만 키우세요.",
            "matchPoints": ["스킨십을 좋아하는 분", "개냥이를 원하는 분", "장모종의 매력을 즐기는 분", "온순한 고양이를 원하는 분"]
        },
        {
            "name": "아비시니안",
            "emoji": "🐱",
            "desc": "호기심 가득한 활동파",
            "condition": { "activity": "high", "affection": "medium", "independence": "low" },
            "mood": "excited",
            "color": "bg-amber-100",
            "interpretation": "호기심이 넘치고 활동적인 아비시니안! 높은 곳을 좋아하고 탐험을 즐겨요. 지능이 높아 놀이를 통한 교감이 중요해요. 에너지 넘치는 분에게 추천!",
            "guide": "캣타워와 놀이터가 필수예요. 지루하면 스트레스받으니 다양한 장난감을 준비하세요. 다른 고양이와 함께 키우면 좋아요.",
            "matchPoints": ["활동적인 고양이를 원하는 분", "놀이를 즐기는 분", "호기심 많은 고양이를 원하는 분", "다묘 가정"]
        },
        {
            "name": "브리티시 숏헤어",
            "emoji": "🐱",
            "desc": "조용하고 독립적인 영국 신사",
            "condition": { "activity": "low", "independence": "high", "grooming": "medium" },
            "mood": "cool",
            "color": "bg-blue-200",
            "interpretation": "통통한 볼과 동그란 눈이 매력적인 브리티시 숏헤어! 조용하고 독립적이라 바쁜 직장인에게 딱이에요. 안기는 것보다 옆에 앉아있는 걸 좋아해요.",
            "guide": "털이 두꺼워 주기적 빗질이 필요해요. 비만이 되기 쉬우니 식단 관리 중요! 조용한 환경을 좋아해요.",
            "matchPoints": ["바쁜 직장인", "독립적인 고양이를 원하는 분", "조용한 고양이를 원하는 분", "통통한 외모를 좋아하는 분"]
        },
        {
            "name": "스코티시 폴드",
            "emoji": "🐱",
            "desc": "접힌 귀가 귀여운 애교쟁이",
            "condition": { "affection": "high", "activity": "low", "vocal": "low" },
            "mood": "happy",
            "color": "bg-orange-100",
            "interpretation": "접힌 귀가 특징인 스코티시 폴드! 온순하고 애교가 많아 가족 모두와 잘 지내요. 조용한 편이라 아파트 생활에도 적합해요.",
            "guide": "유전적으로 관절 문제가 있을 수 있어 건강 체크가 중요해요. 점프를 많이 시키지 마세요. 온순해서 다른 동물과도 잘 지내요.",
            "matchPoints": ["온순한 고양이를 원하는 분", "독특한 외모를 좋아하는 분", "애교 많은 고양이를 원하는 분", "가족이 있는 가정"]
        },
        {
            "name": "샴",
            "emoji": "🐱",
            "desc": "수다쟁이 애교 폭발 고양이",
            "condition": { "vocal": "high", "affection": "high", "activity": "high" },
            "mood": "excited",
            "color": "bg-cream-100",
            "interpretation": "파란 눈의 수다쟁이 샴! 주인과 '대화'하는 걸 좋아하고, 관심받는 걸 즐겨요. 지능이 높고 활발해서 함께 놀아주는 시간이 중요해요.",
            "guide": "혼자 있는 걸 싫어해서 외출이 많으면 다묘 가정을 고려하세요. 울음소리가 크고 자주 울 수 있어요. 장난감과 놀이가 필수!",
            "matchPoints": ["소통하는 고양이를 원하는 분", "집에 자주 있는 분", "활발한 고양이를 원하는 분", "고양이 소리가 괜찮은 분"]
        },
        {
            "name": "페르시안",
            "emoji": "🐱",
            "desc": "우아하고 조용한 귀족 고양이",
            "condition": { "activity": "low", "grooming": "high", "vocal": "low" },
            "mood": "cool",
            "color": "bg-white",
            "interpretation": "풍성한 털과 납작한 얼굴이 특징인 페르시안! 조용하고 얌전해서 아파트 생활에 딱이에요. 느긋하고 평화로운 성격이에요.",
            "guide": "매일 빗질이 필수예요! 납작한 얼굴로 호흡기 관리가 필요하고, 눈물자국도 관리해야 해요. 더위에 약해요.",
            "matchPoints": ["조용한 고양이를 원하는 분", "장모종의 우아함을 즐기는 분", "관리에 투자할 수 있는 분", "느긋한 성격을 원하는 분"]
        },
        {
            "name": "먼치킨",
            "emoji": "🐱",
            "desc": "짧은 다리의 귀여운 고양이",
            "condition": { "activity": "medium", "affection": "high", "grooming": "medium" },
            "mood": "happy",
            "color": "bg-pink-100",
            "interpretation": "짧은 다리가 특징인 먼치킨! 다리는 짧아도 활발하고 호기심이 많아요. 애교가 넘치고 사람을 좋아해요.",
            "guide": "짧은 다리 때문에 높은 곳은 힘들어해요. 낮은 캣타워를 준비해주세요. 다양한 털 길이가 있어요.",
            "matchPoints": ["독특한 외모를 좋아하는 분", "애교 많은 고양이를 원하는 분", "활발한 고양이를 원하는 분", "귀여운 걸 좋아하는 분"]
        },
        {
            "name": "노르웨이 숲",
            "emoji": "🐱",
            "desc": "숲에서 온 독립적인 대형 고양이",
            "condition": { "grooming": "high", "independence": "high", "activity": "medium" },
            "mood": "cool",
            "color": "bg-green-100",
            "interpretation": "북유럽 숲에서 온 대형 장모종! 독립적이면서도 가족에게는 다정해요. 튼튼하고 건강한 품종이에요.",
            "guide": "장모라 빗질이 필요하지만 털 엉킴이 적어요. 대형이라 공간이 넓으면 좋아요. 추위에 강하지만 더위에는 약해요.",
            "matchPoints": ["대형 고양이를 원하는 분", "독립적인 고양이를 원하는 분", "장모종을 좋아하는 분", "넓은 공간이 있는 분"]
        }
    ]
};
