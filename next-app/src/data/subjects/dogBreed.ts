// dogBreed 테스트 데이터 - 강아지 품종 추천
// petMatch에서 "강아지" 결과 후 연결되는 세부 테스트

import { SubjectData } from '../types';

export const dogBreedData: SubjectData = {
    "title": "나에게 맞는 강아지 품종",
    "subtitle": "어떤 강아지와 잘 맞을까?",
    "themeColor": "bg-amber-400",
    "icon": "DogIcon",
    "testType": "matching",
    "dimensions": {
        "size": {
            "name": "크기선호",
            "emoji": "📏",
            "desc": "선호하는 강아지 크기"
        },
        "energy": {
            "name": "활동량",
            "emoji": "⚡",
            "desc": "원하는 에너지 레벨"
        },
        "grooming": {
            "name": "관리도",
            "emoji": "✂️",
            "desc": "털 관리 투자 의향"
        },
        "training": {
            "name": "훈련",
            "emoji": "🎓",
            "desc": "훈련 투자 의향"
        },
        "independence": {
            "name": "독립성",
            "emoji": "🏠",
            "desc": "혼자 있는 시간 허용"
        }
    },
    "questions": [
        // === 크기 선호 (size) ===
        {
            "q": "어떤 크기의 강아지를 원하시나요?",
            "dimension": "size",
            "a": [
                { "text": "안고 다닐 수 있는 소형견", "score": 1 },
                { "text": "적당한 중형견", "score": 3 },
                { "text": "듬직한 대형견", "score": 5 }
            ]
        },
        {
            "q": "집 공간은 어느 정도인가요?",
            "dimension": "size",
            "a": [
                { "text": "원룸/소형 아파트", "score": 1 },
                { "text": "일반 아파트", "score": 3 },
                { "text": "마당 있는 집/넓은 공간", "score": 5 }
            ]
        },
        // === 에너지 레벨 (energy) ===
        {
            "q": "강아지와 얼마나 활동적으로 지내고 싶나요?",
            "dimension": "energy",
            "a": [
                { "text": "집에서 조용히 함께하고 싶어요", "score": 1 },
                { "text": "적당한 산책과 놀이 정도", "score": 3 },
                { "text": "매일 뛰어놀고 운동하고 싶어요!", "score": 5 }
            ]
        },
        {
            "q": "하루에 산책 시간은 얼마나 가능한가요?",
            "dimension": "energy",
            "a": [
                { "text": "30분 이하", "score": 1 },
                { "text": "30분~1시간", "score": 3 },
                { "text": "1시간 이상", "score": 5 }
            ]
        },
        // === 털 관리 (grooming) ===
        {
            "q": "털 빠짐에 대한 생각은?",
            "dimension": "grooming",
            "a": [
                { "text": "털 빠짐 최소화가 중요해요", "score": 1 },
                { "text": "어느 정도는 괜찮아요", "score": 3 },
                { "text": "상관없어요, 청소하면 되죠!", "score": 5 }
            ]
        },
        {
            "q": "미용샵 방문이나 빗질에 시간을 투자할 수 있나요?",
            "dimension": "grooming",
            "a": [
                { "text": "최소한으로 하고 싶어요", "score": 1 },
                { "text": "가끔 미용은 OK", "score": 3 },
                { "text": "정기적 관리 가능해요", "score": 5 }
            ]
        },
        // === 훈련 (training) ===
        {
            "q": "강아지 훈련에 얼마나 관심 있나요?",
            "dimension": "training",
            "a": [
                { "text": "기본만 하면 돼요", "score": 1 },
                { "text": "기본 훈련은 잘 시키고 싶어요", "score": 3 },
                { "text": "다양한 훈련과 교육에 관심 있어요", "score": 5 }
            ]
        },
        // === 독립성 (independence) ===
        {
            "q": "강아지가 혼자 있는 시간이 얼마나 될까요?",
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
            "q": "강아지를 키우는 주된 목적은?",
            "dimension": "energy",
            "a": [
                { "text": "힐링과 정서적 교감", "score": 1 },
                { "text": "일상의 동반자", "score": 3 },
                { "text": "함께 운동하고 활동하기", "score": 5 }
            ]
        },
        {
            "q": "아이나 다른 반려동물이 있나요?",
            "dimension": "training",
            "a": [
                { "text": "없어요", "score": 3 },
                { "text": "어린 아이가 있어요", "score": 1 },
                { "text": "다른 반려동물이 있어요", "score": 5 }
            ]
        },
        {
            "q": "강아지 경험이 있나요?",
            "dimension": "training",
            "a": [
                { "text": "처음이에요", "score": 1 },
                { "text": "어릴 때 키워봤어요", "score": 3 },
                { "text": "여러 마리 키워봤어요", "score": 5 }
            ]
        },
        {
            "q": "알레르기 걱정이 있나요?",
            "dimension": "grooming",
            "a": [
                { "text": "네, 저알레르기견이 필요해요", "score": 1 },
                { "text": "약간 있지만 괜찮을 것 같아요", "score": 3 },
                { "text": "없어요", "score": 5 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "골든 리트리버",
            "emoji": "🦮",
            "desc": "온순하고 가족적인 대표 반려견",
            "condition": { "size": "high", "energy": "high", "grooming": "high" },
            "mood": "happy",
            "color": "bg-amber-100",
            "interpretation": "활동적이고 가족을 사랑하는 당신에게 골든 리트리버는 최고의 동반자예요! 똑똒하고 훈련이 잘 되며, 아이들과도 잘 지내요. 넓은 공간에서 마음껏 뛰어놀 수 있으면 더 행복해해요.",
            "guide": "하루 1-2시간 운동이 필요해요. 털빠짐이 많아 주기적 빗질이 필수예요. 물놀이를 좋아해서 수영도 좋아요!",
            "matchPoints": ["가족과 함께하는 분", "넓은 공간이 있는 분", "활동적인 생활을 하는 분", "훈련에 관심 있는 분"]
        },
        {
            "name": "래브라도 리트리버",
            "emoji": "🐕",
            "desc": "친근하고 훈련이 잘 되는 만능견",
            "condition": { "size": "high", "energy": "high", "grooming": "medium" },
            "mood": "excited",
            "color": "bg-yellow-100",
            "interpretation": "사교적이고 에너지 넘치는 래브라도는 누구와도 잘 지내요! 안내견, 구조견으로도 활약할 만큼 똑똒하고 충성스러워요. 활동적인 가정에 딱 맞아요.",
            "guide": "매일 충분한 운동이 필요해요. 먹는 걸 좋아해서 비만 주의! 물놀이와 가져오기 놀이를 좋아해요.",
            "matchPoints": ["활동적인 가정", "아이가 있는 가정", "첫 대형견으로 추천", "야외활동을 좋아하는 분"]
        },
        {
            "name": "푸들",
            "emoji": "🐩",
            "desc": "똑똑하고 털 빠짐 없는 우아한 친구",
            "condition": { "grooming": "high", "training": "high" },
            "mood": "cool",
            "color": "bg-purple-100",
            "interpretation": "지능이 매우 높고 털이 빠지지 않아 알레르기가 있어도 키울 수 있어요! 토이/미니/스탠다드 다양한 크기가 있어 원하는 크기를 선택할 수 있어요.",
            "guide": "정기적인 미용이 필수예요 (4-6주마다). 지능이 높아 다양한 훈련이 가능하고, 지루하지 않게 해주는 게 중요해요.",
            "matchPoints": ["알레르기가 있는 분", "미용에 투자할 수 있는 분", "똑똒한 강아지를 원하는 분", "다양한 훈련에 관심 있는 분"]
        },
        {
            "name": "말티즈",
            "emoji": "🐶",
            "desc": "사랑스러운 애교쟁이 소형견",
            "condition": { "size": "low", "energy": "low", "independence": "low" },
            "mood": "happy",
            "color": "bg-white",
            "interpretation": "새하얀 털에 사랑스러운 눈망울! 말티즈는 주인을 무척 따르고 애교가 넘쳐요. 아파트 생활에 완벽하게 적합하고, 운동량도 적어 바쁜 분들에게도 좋아요.",
            "guide": "분리불안이 생기기 쉬우니 어릴 때 훈련해주세요. 눈물자국 관리와 정기적 미용이 필요해요. 짧은 산책으로 충분해요!",
            "matchPoints": ["아파트 거주자", "소형견을 원하는 분", "애교 많은 강아지를 원하는 분", "실내 생활 중심인 분"]
        },
        {
            "name": "시츄",
            "emoji": "🐕",
            "desc": "온순하고 조용한 실내견",
            "condition": { "size": "low", "energy": "low", "independence": "high" },
            "mood": "cool",
            "color": "bg-gray-100",
            "interpretation": "얌전하고 조용한 시츄는 아파트 생활에 딱이에요! 운동량이 적고 낯선 사람에게도 친근해요. 처음 강아지를 키우는 분에게 추천해요.",
            "guide": "더위에 약하니 여름철 주의하세요. 긴 털은 정기적 관리가 필요하지만, 짧게 미용하면 관리가 쉬워요.",
            "matchPoints": ["조용한 환경을 원하는 분", "처음 강아지를 키우는 분", "노년층에게 추천", "실내 생활 중심인 분"]
        },
        {
            "name": "포메라니안",
            "emoji": "🐕",
            "desc": "활발하고 용감한 작은 사자",
            "condition": { "size": "low", "energy": "medium", "grooming": "high" },
            "mood": "excited",
            "color": "bg-orange-100",
            "interpretation": "작지만 용감하고 활발한 포메라니안! 호기심이 많고 영리해서 재롱을 잘 부려요. 풍성한 털이 매력적이지만 관리가 필요해요.",
            "guide": "작아도 자기 주장이 강하니 어릴 때 훈련이 중요해요. 털빠짐이 있고 정기적 빗질이 필요해요. 경계심이 있어 짖을 수 있어요.",
            "matchPoints": ["활발한 소형견을 원하는 분", "털 관리를 즐기는 분", "영리한 강아지를 원하는 분", "아파트 거주자"]
        },
        {
            "name": "웰시코기",
            "emoji": "🐕",
            "desc": "짧은 다리에 넘치는 에너지",
            "condition": { "size": "high", "energy": "high", "training": "medium" },
            "mood": "excited",
            "color": "bg-amber-200",
            "interpretation": "귀여운 외모와 달리 에너지가 넘치는 목양견이에요! 똑똑하고 충성스러우며, 가족을 '몰이'하려는 본능이 있어요. 활동적인 분에게 잘 맞아요.",
            "guide": "허리가 길어 뛰어내리기는 조심! 털빠짐이 많아요. 충분한 운동과 정신적 자극이 필요해요.",
            "matchPoints": ["활동적인 분", "귀여운 외모를 좋아하는 분", "훈련에 관심 있는 분", "털빠짐을 감당할 수 있는 분"]
        },
        {
            "name": "프렌치 불독",
            "emoji": "🐕",
            "desc": "느긋하고 조용한 도시견",
            "condition": { "size": "low", "energy": "low", "grooming": "low", "independence": "high" },
            "mood": "cool",
            "color": "bg-slate-100",
            "interpretation": "조용하고 느긋한 프렌치 불독은 아파트 생활의 왕이에요! 운동량이 적고 짖지 않아 이웃 걱정이 없어요. 특유의 표정이 매력적이에요.",
            "guide": "더위에 매우 약하니 여름철 에어컨 필수! 단두종이라 호흡기 주의가 필요해요. 짧은 털이라 관리는 쉬워요.",
            "matchPoints": ["아파트 거주자", "조용한 강아지를 원하는 분", "운동량 적은 분", "독특한 외모를 좋아하는 분"]
        },
        {
            "name": "비글",
            "emoji": "🐕",
            "desc": "호기심 많은 탐험가",
            "condition": { "size": "high", "energy": "high", "independence": "high" },
            "mood": "excited",
            "color": "bg-amber-100",
            "interpretation": "뛰어난 후각과 넘치는 호기심! 비글은 항상 새로운 냄새를 찾아다니는 탐험가예요. 활발하고 사교적이지만 독립적인 면도 있어요.",
            "guide": "후각이 발달해 산책 시 리드줄 필수! 먹는 걸 좋아해서 음식 관리 중요해요. 충분한 운동으로 에너지 발산이 필요해요.",
            "matchPoints": ["활동적인 분", "야외활동을 좋아하는 분", "독립적인 성격을 이해하는 분", "중형견을 원하는 분"]
        },
        {
            "name": "시바견",
            "emoji": "🐕",
            "desc": "독립적이고 깔끔한 일본견",
            "condition": { "size": "high", "energy": "medium", "independence": "high" },
            "mood": "cool",
            "color": "bg-red-100",
            "interpretation": "고양이 같은 강아지! 시바견은 독립적이고 깔끔해서 자기 털 관리도 스스로 해요. 충성스럽지만 고집이 있어 경험자에게 추천해요.",
            "guide": "고집이 세서 훈련에 인내가 필요해요. 털빠짐이 많은 편이에요. 낯선 사람에게는 경계심이 있어요.",
            "matchPoints": ["독립적인 강아지를 원하는 분", "깔끔한 강아지를 좋아하는 분", "강아지 경험이 있는 분", "고집을 이해할 수 있는 분"]
        },
        {
            "name": "보더 콜리",
            "emoji": "🐕",
            "desc": "최고의 지능을 가진 운동선수",
            "condition": { "size": "high", "energy": "high", "training": "high" },
            "mood": "excited",
            "color": "bg-blue-100",
            "interpretation": "강아지계의 천재! 보더 콜리는 지능과 운동능력이 최고예요. 다양한 훈련과 활동에 관심 있고, 함께 도전하고 싶은 분에게 딱이에요.",
            "guide": "매우 높은 운동량과 정신적 자극이 필요해요. 지루하면 문제 행동이 생길 수 있어요. 어질리티 등 스포츠 추천!",
            "matchPoints": ["매우 활동적인 분", "훈련에 열정이 있는 분", "독스포츠에 관심 있는 분", "시간 투자가 가능한 분"]
        },
        {
            "name": "요크셔테리어",
            "emoji": "🐕",
            "desc": "작지만 용감한 테리어",
            "condition": { "size": "low", "grooming": "high", "energy": "high" },
            "mood": "excited",
            "color": "bg-blue-100",
            "interpretation": "우아한 긴 털과 작은 몸집! 요크셔테리어는 용감하고 자신감 넘치는 성격이에요. 털이 빠지지 않아 알레르기가 있어도 키울 수 있어요.",
            "guide": "긴 털은 매일 빗질이 필요해요. 짧게 미용하면 관리가 쉬워요. 작지만 테리어 기질로 자기 주장이 강해요.",
            "matchPoints": ["알레르기가 있는 분", "우아한 외모를 좋아하는 분", "소형견을 원하는 분", "미용에 투자할 수 있는 분"]
        }
    ]
};
