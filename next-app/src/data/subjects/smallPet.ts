// smallPet 테스트 데이터 - 소동물 추천
// petMatch에서 "소동물" 결과 후 연결되는 세부 테스트

import { SubjectData } from '../types';

export const smallPetData: SubjectData = {
    "title": "나에게 맞는 소동물",
    "subtitle": "어떤 소동물과 잘 맞을까?",
    "themeColor": "bg-pink-300",
    "icon": "HamsterIcon",
    "testType": "matching",
    "dimensions": {
        "lifespan": {
            "name": "함께할시간",
            "emoji": "⏳",
            "desc": "원하는 동반 기간"
        },
        "handling": {
            "name": "만지기",
            "emoji": "🤲",
            "desc": "스킨십 욕구"
        },
        "noise": {
            "name": "활동시간",
            "emoji": "🌙",
            "desc": "야행성 허용도"
        },
        "space": {
            "name": "공간",
            "emoji": "📦",
            "desc": "사육장 공간"
        },
        "social": {
            "name": "사회성",
            "emoji": "👥",
            "desc": "다마리 vs 단독 사육"
        }
    },
    "questions": [
        // === 함께할 시간 (lifespan) ===
        {
            "q": "소동물과 얼마나 오래 함께하고 싶나요?",
            "dimension": "lifespan",
            "a": [
                { "text": "2-3년 정도면 적당해요", "score": 1 },
                { "text": "5년 이상 함께하고 싶어요", "score": 3 },
                { "text": "10년 이상 오래 함께하고 싶어요", "score": 5 }
            ]
        },
        // === 스킨십 (handling) ===
        {
            "q": "소동물을 손에 올리고 만지고 싶나요?",
            "dimension": "handling",
            "a": [
                { "text": "바라보는 것만으로 충분해요", "score": 1 },
                { "text": "가끔 만져보고 싶어요", "score": 3 },
                { "text": "자주 안고 놀고 싶어요", "score": 5 }
            ]
        },
        // === 활동 시간 (noise) ===
        {
            "q": "야행성 동물도 괜찮나요?",
            "dimension": "noise",
            "a": [
                { "text": "낮에 활동하는 동물이 좋아요", "score": 1 },
                { "text": "상관없어요", "score": 3 },
                { "text": "밤에 활동해도 괜찮아요", "score": 5 }
            ]
        },
        {
            "q": "밤에 쳇바퀴 소리가 나도 괜찮나요?",
            "dimension": "noise",
            "a": [
                { "text": "조용해야 해요", "score": 1 },
                { "text": "다른 방에 두면 괜찮아요", "score": 3 },
                { "text": "소리에 신경 안 써요", "score": 5 }
            ]
        },
        // === 공간 (space) ===
        {
            "q": "사육장을 얼마나 크게 둘 수 있나요?",
            "dimension": "space",
            "a": [
                { "text": "작은 케이지 정도", "score": 1 },
                { "text": "중형 케이지", "score": 3 },
                { "text": "큰 케이지나 방 한쪽을 쓸 수 있어요", "score": 5 }
            ]
        },
        // === 사회성 (social) ===
        {
            "q": "여러 마리를 함께 키우고 싶나요?",
            "dimension": "social",
            "a": [
                { "text": "한 마리만 키우고 싶어요", "score": 1 },
                { "text": "상관없어요", "score": 3 },
                { "text": "여러 마리가 함께 있으면 더 귀여울 것 같아요", "score": 5 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "소동물 경험이 있나요?",
            "dimension": "handling",
            "a": [
                { "text": "처음이에요", "score": 1 },
                { "text": "어릴 때 키워봤어요", "score": 3 },
                { "text": "여러 번 키워봤어요", "score": 5 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "골든 햄스터",
            "emoji": "🐹",
            "desc": "귀여운 볼주머니의 대표 햄스터",
            "condition": { "lifespan": "low", "handling": "medium", "noise": "high", "social": "low" },
            "mood": "happy",
            "color": "bg-amber-100",
            "interpretation": "햄스터계의 대표주자! 볼주머니에 먹이를 담는 모습이 너무 귀여워요. 혼자 사는 걸 좋아하고, 밤에 활발하게 쳇바퀴를 돌려요. 첫 소동물로 추천!",
            "guide": "반드시 단독 사육! 영역 동물이라 함께 키우면 싸워요. 야행성이라 낮에는 깨우지 마세요. 쳇바퀴는 필수예요.",
            "matchPoints": ["첫 소동물로 추천", "귀여운 볼주머니를 보고 싶은 분", "혼자 사는 동물을 원하는 분", "야행성이 괜찮은 분"]
        },
        {
            "name": "드워프 햄스터",
            "emoji": "🐹",
            "desc": "작고 빠른 미니 햄스터",
            "condition": { "lifespan": "low", "handling": "low", "noise": "high", "space": "low" },
            "mood": "excited",
            "color": "bg-gray-100",
            "interpretation": "골든보다 작고 빠른 드워프 햄스터! 정글리안, 로보로브스키 등이 있어요. 작아서 핸들링은 어렵지만, 작은 공간에서도 키울 수 있어요.",
            "guide": "매우 빨라서 탈출 주의! 종류에 따라 성격이 달라요. 정글리안은 비교적 온순하고, 로보로브스키는 빠르고 예민해요.",
            "matchPoints": ["작은 공간에서 키우고 싶은 분", "관찰하는 재미를 원하는 분", "작은 동물을 좋아하는 분", "핸들링 없어도 괜찮은 분"]
        },
        {
            "name": "토끼",
            "emoji": "🐰",
            "desc": "말랑말랑 솜뭉치 같은 친구",
            "condition": { "lifespan": "high", "handling": "high", "space": "high", "noise": "low" },
            "mood": "happy",
            "color": "bg-pink-50",
            "interpretation": "오래 함께할 수 있는 토끼! 생각보다 스킨십을 좋아하고, 쓰다듬어주면 좋아해요. 낮에 활동하고, 조용해서 아파트에서도 키우기 좋아요.",
            "guide": "건초(티모시)가 주식이에요. 케이지 밖에서 운동 시간도 필요해요. 더위에 약하니 온도 관리 중요! 8~12년 정도 살아요.",
            "matchPoints": ["오래 함께하고 싶은 분", "스킨십을 원하는 분", "조용한 동물을 원하는 분", "넓은 공간이 있는 분"]
        },
        {
            "name": "기니피그",
            "emoji": "🐹",
            "desc": "뿌이뿌이 소리로 소통하는 친구",
            "condition": { "lifespan": "medium", "handling": "high", "social": "high", "noise": "low" },
            "mood": "happy",
            "color": "bg-orange-100",
            "interpretation": "귀여운 소리로 소통하는 기니피그! 사회성이 좋아서 2마리 이상 함께 키우면 더 행복해해요. 온순하고 핸들링도 쉬워 아이가 있는 가정에도 추천!",
            "guide": "2마리 이상 함께 키우세요(같은 성별). 비타민C가 필요해서 채소를 매일 줘야 해요. 5~7년 정도 살아요.",
            "matchPoints": ["여러 마리를 키우고 싶은 분", "소리로 소통하고 싶은 분", "온순한 동물을 원하는 분", "아이가 있는 가정"]
        },
        {
            "name": "친칠라",
            "emoji": "🐭",
            "desc": "세상에서 가장 부드러운 털",
            "condition": { "lifespan": "high", "handling": "medium", "noise": "high", "space": "high" },
            "mood": "cool",
            "color": "bg-slate-100",
            "interpretation": "구름 같은 털을 가진 친칠라! 15~20년 이상 살아 오래 함께할 수 있어요. 야행성이고 점프력이 뛰어나 큰 케이지가 필요해요.",
            "guide": "물에 젖으면 안 돼요! 모래목욕으로 털 관리를 해요. 더위에 매우 약해 에어컨 필수. 관리가 까다로워 경험자에게 추천.",
            "matchPoints": ["오래 함께하고 싶은 분", "부드러운 털을 좋아하는 분", "소동물 경험이 있는 분", "온도 관리가 가능한 분"]
        },
        {
            "name": "고슴도치",
            "emoji": "🦔",
            "desc": "동글동글 가시볼 친구",
            "condition": { "lifespan": "medium", "handling": "medium", "noise": "high", "social": "low" },
            "mood": "cool",
            "color": "bg-gray-200",
            "interpretation": "가시가 귀여운 고슴도치! 독특한 매력이 있고, 길들이면 손 위에서도 편하게 있어요. 야행성이고 혼자 있는 걸 좋아해요.",
            "guide": "처음엔 가시를 세우지만, 익숙해지면 편해져요. 온도 관리가 중요해요(24-28도). 벌레를 먹여야 할 수 있어요.",
            "matchPoints": ["독특한 동물을 원하는 분", "단독 사육을 원하는 분", "밤에 활동해도 괜찮은 분", "길들이는 재미를 원하는 분"]
        },
        {
            "name": "페럿",
            "emoji": "🦦",
            "desc": "호기심 많은 장난꾸러기",
            "condition": { "lifespan": "medium", "handling": "high", "space": "high", "social": "high" },
            "mood": "excited",
            "color": "bg-amber-50",
            "interpretation": "강아지처럼 활발하고 장난기 넘치는 페럿! 놀이를 좋아하고 교감도 잘해요. 2마리 이상 함께 키우면 더 재밌게 놀아요.",
            "guide": "냄새가 있어서 샘제거 수술이 필요할 수 있어요. 탈출의 명수라 페럿용 케이지가 필요해요. 5~10년 정도 살아요.",
            "matchPoints": ["활발한 동물을 원하는 분", "놀아주는 걸 좋아하는 분", "소동물 경험이 있는 분", "냄새에 민감하지 않은 분"]
        }
    ]
};
