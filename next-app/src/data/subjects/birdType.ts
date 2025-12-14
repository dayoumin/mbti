// birdType 테스트 데이터 - 반려조 추천
// petMatch에서 "새" 결과 후 연결되는 세부 테스트

import { SubjectData } from '../types';

export const birdTypeData: SubjectData = {
    "title": "나에게 맞는 반려조",
    "subtitle": "어떤 새와 잘 맞을까?",
    "themeColor": "bg-sky-400",
    "icon": "BirdIcon",
    "testType": "matching",
    "dimensions": {
        "noise": {
            "name": "소음허용",
            "emoji": "🔊",
            "desc": "새 소리 허용도"
        },
        "interaction": {
            "name": "교감도",
            "emoji": "🤝",
            "desc": "원하는 교감 수준"
        },
        "space": {
            "name": "공간",
            "emoji": "🏠",
            "desc": "새장 크기"
        },
        "time": {
            "name": "돌봄시간",
            "emoji": "⏰",
            "desc": "새에게 쓸 수 있는 시간"
        },
        "experience": {
            "name": "경험도",
            "emoji": "📚",
            "desc": "반려조 경험 수준"
        }
    },
    "questions": [
        // === 소음 허용도 (noise) ===
        {
            "q": "새 울음소리에 대한 생각은?",
            "dimension": "noise",
            "a": [
                { "text": "조용한 새가 좋아요", "score": 1 },
                { "text": "적당한 지저귐은 좋아요", "score": 3 },
                { "text": "시끄러워도 괜찮아요!", "score": 5 }
            ]
        },
        {
            "q": "새가 말을 따라하면 좋겠나요?",
            "dimension": "noise",
            "a": [
                { "text": "조용한 게 좋아요", "score": 1 },
                { "text": "간단한 소리 정도면", "score": 3 },
                { "text": "말 따라하는 새 원해요!", "score": 5 }
            ]
        },
        // === 교감도 (interaction) ===
        {
            "q": "새와 어떤 관계를 원하나요?",
            "dimension": "interaction",
            "a": [
                { "text": "바라보는 것만으로 좋아요", "score": 1 },
                { "text": "가끔 손에 올려보고 싶어요", "score": 3 },
                { "text": "어깨에 앉히고 놀고 싶어요!", "score": 5 }
            ]
        },
        {
            "q": "새에게 재주를 가르치고 싶나요?",
            "dimension": "interaction",
            "a": [
                { "text": "그냥 있어만 줘도 돼요", "score": 1 },
                { "text": "간단한 것 정도는", "score": 3 },
                { "text": "다양한 재주를 가르치고 싶어요!", "score": 5 }
            ]
        },
        // === 공간 (space) ===
        {
            "q": "새장을 얼마나 크게 둘 수 있나요?",
            "dimension": "space",
            "a": [
                { "text": "작은 새장 정도", "score": 1 },
                { "text": "중형 새장 가능", "score": 3 },
                { "text": "큰 새장이나 방사 가능해요", "score": 5 }
            ]
        },
        // === 돌봄 시간 (time) ===
        {
            "q": "매일 새와 보낼 수 있는 시간은?",
            "dimension": "time",
            "a": [
                { "text": "30분 이하", "score": 1 },
                { "text": "1~2시간 정도", "score": 3 },
                { "text": "2시간 이상 함께할 수 있어요", "score": 5 }
            ]
        },
        // === 경험도 (experience) ===
        {
            "q": "반려조 경험이 있나요?",
            "dimension": "experience",
            "a": [
                { "text": "처음이에요", "score": 1 },
                { "text": "어릴 때 키워봤어요", "score": 3 },
                { "text": "여러 새를 키워봤어요", "score": 5 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "새의 수명에 대한 생각은?",
            "dimension": "time",
            "a": [
                { "text": "5년 이하가 좋아요", "score": 1 },
                { "text": "10~20년도 괜찮아요", "score": 3 },
                { "text": "오래 함께해도 좋아요", "score": 5 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "십자매/문조",
            "emoji": "🐦",
            "desc": "조용하고 관찰하기 좋은 새",
            "condition": { "noise": "low", "interaction": "low", "experience": "low" },
            "mood": "calm",
            "color": "bg-amber-100",
            "interpretation": "조용하고 얌전한 십자매와 문조! 여러 마리가 옹기종기 모여 있는 모습이 귀여워요. 손에 타지 않아도 바라보는 것만으로 힐링되는 새예요.",
            "guide": "2~3마리 이상 함께 키우면 더 자연스러운 모습을 볼 수 있어요. 작은 새장도 OK지만, 넓으면 더 좋아해요. 첫 반려조로 추천!",
            "matchPoints": ["첫 반려조로 추천", "조용한 새를 원하는 분", "바라보는 것을 즐기는 분", "여러 마리를 키우고 싶은 분"]
        },
        {
            "name": "카나리아",
            "emoji": "🐦",
            "desc": "아름다운 노랫소리의 가수",
            "condition": { "noise": "medium", "interaction": "low", "space": "low" },
            "mood": "happy",
            "color": "bg-yellow-100",
            "interpretation": "노란 깃털과 아름다운 노랫소리의 카나리아! 수컷이 노래를 잘 불러요. 손에 타지 않지만, 맑은 노랫소리로 집안을 밝혀줘요.",
            "guide": "노래하는 수컷을 원하면 1마리만, 번식을 원하면 암수 한 쌍을 키우세요. 핸들링은 어렵지만 노래로 교감해요.",
            "matchPoints": ["새 노랫소리를 즐기고 싶은 분", "손에 타지 않아도 되는 분", "작은 새를 원하는 분", "아름다운 색을 좋아하는 분"]
        },
        {
            "name": "잉꼬",
            "emoji": "🦜",
            "desc": "활발하고 애교 넘치는 소형 앵무",
            "condition": { "noise": "medium", "interaction": "high", "space": "medium", "experience": "low" },
            "mood": "excited",
            "color": "bg-green-100",
            "interpretation": "알록달록 귀여운 잉꼬! 작지만 애교가 넘치고, 잘 길들이면 손에도 잘 올라와요. 짧은 말도 따라할 수 있어요. 초보자도 키우기 좋아요.",
            "guide": "어릴 때부터 키우면 잘 길들여져요. 짝을 지어주면 서로에게 빠져서 사람에겐 덜 친해질 수 있어요. 다양한 색상이 있어요.",
            "matchPoints": ["핸들링을 원하는 초보자", "작은 앵무를 원하는 분", "애교 있는 새를 원하는 분", "다양한 색상을 좋아하는 분"]
        },
        {
            "name": "코카티엘",
            "emoji": "🦜",
            "desc": "볼터치가 귀여운 다정한 친구",
            "condition": { "noise": "medium", "interaction": "high", "time": "high", "experience": "medium" },
            "mood": "happy",
            "color": "bg-gray-100",
            "interpretation": "빨간 볼터치와 관모가 매력적인 코카티엘! 성격이 다정하고 주인을 잘 따라요. 휘파람과 멜로디를 잘 배우고, 쓰다듬으면 좋아해요.",
            "guide": "하루 최소 1시간 이상 함께하는 시간이 필요해요. 외로우면 스트레스받으니 많이 놀아주세요. 깃털 가루가 많이 나와요.",
            "matchPoints": ["다정한 새를 원하는 분", "휘파람/노래를 가르치고 싶은 분", "스킨십을 원하는 분", "시간을 쏟을 수 있는 분"]
        },
        {
            "name": "모란앵무",
            "emoji": "🦜",
            "desc": "알록달록 장난꾸러기",
            "condition": { "noise": "high", "interaction": "medium", "space": "medium" },
            "mood": "excited",
            "color": "bg-rose-100",
            "interpretation": "화려한 색깔의 장난꾸러기 모란앵무! 활발하고 호기심이 많아요. 소리가 좀 크지만, 다양한 재주를 배울 수 있어요.",
            "guide": "질투심이 있어 1마리만 키우면 주인에게 집착할 수 있어요. 부리 힘이 세서 장난감을 많이 부숴요. 물어뜯는 것을 좋아해요.",
            "matchPoints": ["활발한 새를 원하는 분", "화려한 색상을 좋아하는 분", "장난감 놀이를 즐기는 분", "소리에 관대한 분"]
        },
        {
            "name": "회색앵무",
            "emoji": "🦜",
            "desc": "말 잘하는 천재 앵무새",
            "condition": { "noise": "high", "interaction": "high", "time": "high", "space": "high", "experience": "high" },
            "mood": "cool",
            "color": "bg-slate-200",
            "interpretation": "앵무새 중 가장 똑똑한 회색앵무! 수백 단어를 말할 수 있고, 상황에 맞게 대화할 수 있어요. 40~60년 이상 살아 평생 친구가 돼요.",
            "guide": "매우 똑똑해서 정서적 교감이 중요해요. 하루 최소 2~3시간 함께해야 하고, 외로우면 깃털 뽑기 등 문제 행동이 생겨요. 큰 새장 필수!",
            "matchPoints": ["말하는 새를 원하는 분", "오래 함께하고 싶은 분", "시간을 많이 쏟을 수 있는 분", "앵무새 경험이 있는 분"]
        }
    ]
};
