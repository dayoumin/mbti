// reptileType 테스트 데이터 - 파충류 추천
// petMatch에서 "파충류" 결과 후 연결되는 세부 테스트

import { SubjectData } from '../types';

export const reptileTypeData: SubjectData = {
    "title": "나에게 맞는 파충류",
    "subtitle": "어떤 파충류와 잘 맞을까?",
    "themeColor": "bg-emerald-500",
    "icon": "ReptileIcon",
    "testType": "matching",
    "dimensions": {
        "handling": {
            "name": "핸들링",
            "emoji": "🤲",
            "desc": "만지기 욕구"
        },
        "space": {
            "name": "공간",
            "emoji": "📦",
            "desc": "사육장 크기"
        },
        "feeding": {
            "name": "먹이",
            "emoji": "🦗",
            "desc": "벌레 먹이 허용도"
        },
        "maintenance": {
            "name": "관리도",
            "emoji": "🌡️",
            "desc": "온습도 관리 투자"
        },
        "experience": {
            "name": "경험도",
            "emoji": "📚",
            "desc": "파충류 경험 수준"
        }
    },
    "questions": [
        // === 핸들링 (handling) ===
        {
            "q": "파충류를 손에 올리고 싶나요?",
            "dimension": "handling",
            "a": [
                { "text": "바라만 봐도 좋아요", "score": 1 },
                { "text": "가끔 만져보고 싶어요", "score": 3 },
                { "text": "자주 손에 올리고 싶어요!", "score": 5 }
            ]
        },
        // === 공간 (space) ===
        {
            "q": "사육장을 얼마나 크게 둘 수 있나요?",
            "dimension": "space",
            "a": [
                { "text": "작은 사육장 (30cm 이하)", "score": 1 },
                { "text": "중형 사육장 (60cm 정도)", "score": 3 },
                { "text": "큰 사육장 (90cm 이상)", "score": 5 }
            ]
        },
        {
            "q": "사육장 인테리어에 관심 있나요?",
            "dimension": "space",
            "a": [
                { "text": "심플하게 할래요", "score": 1 },
                { "text": "적당히 꾸밀래요", "score": 3 },
                { "text": "바이오액티브/자연식 사육장 도전!", "score": 5 }
            ]
        },
        // === 먹이 (feeding) ===
        {
            "q": "벌레 먹이에 대한 생각은?",
            "dimension": "feeding",
            "a": [
                { "text": "절대 안 돼요! 채소만 먹는 종류로", "score": 1 },
                { "text": "밀웜/귀뚜라미 정도는 OK", "score": 3 },
                { "text": "살아있는 벌레도 괜찮아요", "score": 5 }
            ]
        },
        {
            "q": "쥐나 핑키(새끼쥐) 먹이는 괜찮나요?",
            "dimension": "feeding",
            "a": [
                { "text": "절대 안 돼요", "score": 1 },
                { "text": "냉동 쥐까지는 OK", "score": 3 },
                { "text": "괜찮아요", "score": 5 }
            ]
        },
        // === 관리도 (maintenance) ===
        {
            "q": "온도/습도 관리에 대한 생각은?",
            "dimension": "maintenance",
            "a": [
                { "text": "간단한 관리만 하고 싶어요", "score": 1 },
                { "text": "히터/조명 정도는 설치할게요", "score": 3 },
                { "text": "온습도 철저히 맞출 수 있어요", "score": 5 }
            ]
        },
        // === 경험도 (experience) ===
        {
            "q": "파충류 경험이 있나요?",
            "dimension": "experience",
            "a": [
                { "text": "처음이에요", "score": 1 },
                { "text": "조금 키워봤어요", "score": 3 },
                { "text": "여러 종류 키워봤어요", "score": 5 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "파충류의 수명에 대한 생각은?",
            "dimension": "maintenance",
            "a": [
                { "text": "5~10년 정도가 좋아요", "score": 1 },
                { "text": "10~20년도 괜찮아요", "score": 3 },
                { "text": "20년 이상도 괜찮아요", "score": 5 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "레오파드 게코",
            "emoji": "🦎",
            "desc": "웃는 얼굴의 초보자용 게코",
            "condition": { "handling": "high", "space": "low", "feeding": "high", "experience": "low" },
            "mood": "happy",
            "color": "bg-yellow-100",
            "interpretation": "웃는 것처럼 보이는 귀여운 레오파드 게코! 파충류 중 핸들링이 가장 쉽고 온순해요. 야행성이라 낮에는 숨어있다가 밤에 활동해요. 첫 파충류로 최고의 선택!",
            "guide": "밀웜, 귀뚜라미를 먹어요. 바닥 히터로 온도 관리하고, 습도는 크게 신경 안 써도 돼요. 탈피할 때만 습도를 높여주세요. 꼬리에 영양을 저장해요.",
            "matchPoints": ["첫 파충류로 추천", "핸들링을 원하는 분", "작은 사육장만 가능한 분", "귀여운 파충류를 원하는 분"],
            "detailInfo": {
                "origin": "파키스탄/아프가니스탄",
                "lifespan": "15-20년",
                "size": "18-25cm",
                "weight": "45-65g",
                "personality": ["온순함", "핸들링쉬움", "야행성", "귀여움"],
                "goodWith": ["초보자", "핸들링을 원하는 분", "작은 공간"],
                "notGoodWith": ["주행성 활동을 보고 싶은 분"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["대사성 골질환(MBD)", "탈피 문제", "내부 기생충"],
                "monthlyCost": { "min": 3, "max": 8, "note": "벌레 먹이+전기세" },
                "initialCost": { "min": 10, "max": 50, "note": "사육장+히터+용품" },
                "tips": [
                    "웃는 것처럼 보이는 귀여운 얼굴!",
                    "꼬리에 영양을 저장해서 통통해요",
                    "야행성이라 낮엔 숨어있어요",
                    "탈피할 때만 습도 높여주면 OK"
                ]
            }
        },
        {
            "name": "크레스티드 게코",
            "emoji": "🦎",
            "desc": "속눈썹이 귀여운 과일 게코",
            "condition": { "handling": "high", "space": "low", "feeding": "low", "experience": "low" },
            "mood": "happy",
            "color": "bg-orange-100",
            "interpretation": "속눈썹 같은 볏이 귀여운 크레스티드 게코! 벌레 없이 파우더 사료만으로 키울 수 있어요. 나무 위에서 생활하는 수목형이라 높은 사육장이 필요해요.",
            "guide": "크레스티드 전용 파우더 사료가 있어서 벌레 안 줘도 돼요! 습도 관리가 중요해요. 꼬리가 떨어지면 재생 안 되니 주의.",
            "matchPoints": ["벌레 먹이가 싫은 분", "초보자에게 추천", "귀여운 외모를 좋아하는 분", "사료 급여를 원하는 분"],
            "detailInfo": {
                "origin": "뉴칼레도니아",
                "lifespan": "15-20년",
                "size": "20-25cm",
                "weight": "35-55g",
                "personality": ["온순함", "핸들링쉬움", "야행성", "점프잘함"],
                "goodWith": ["초보자", "벌레가 싫은 분", "수목형 사육장"],
                "notGoodWith": ["꼬리를 잡는 것(재생X)"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["대사성 골질환(MBD)", "탈피 문제", "스트레스"],
                "monthlyCost": { "min": 3, "max": 6, "note": "파우더 사료+전기세" },
                "initialCost": { "min": 15, "max": 60, "note": "높은 사육장+용품" },
                "tips": [
                    "벌레 없이 파우더 사료만으로 OK!",
                    "꼬리 떨어지면 재생 안 돼요 - 주의!",
                    "습도 60-80% 유지 필요",
                    "수목형이라 높은 사육장에 가지 세팅"
                ]
            }
        },
        {
            "name": "비어디드래곤",
            "emoji": "🦎",
            "desc": "친화력 갑 수염 도마뱀",
            "condition": { "handling": "high", "space": "high", "maintenance": "high" },
            "mood": "happy",
            "color": "bg-amber-100",
            "interpretation": "사람을 잘 따르는 비어디드래곤! 파충류 중 가장 친화력이 좋아요. 손에 올려놓으면 편하게 있고, 주인을 알아봐요. 낮에 활동하는 종이라 관찰하기 좋아요.",
            "guide": "UVB 조명과 바스킹 스팟이 필수예요. 어릴 땐 곤충 위주, 성체는 채소 비율을 높여요. 90cm 이상 큰 사육장이 필요해요. 온도 기울기를 만들어주세요.",
            "matchPoints": ["교감하는 파충류를 원하는 분", "주간 활동을 보고 싶은 분", "큰 사육장이 가능한 분", "친화력 좋은 파충류를 원하는 분"],
            "detailInfo": {
                "origin": "호주",
                "lifespan": "10-15년",
                "size": "40-60cm",
                "weight": "300-500g",
                "personality": ["친화력좋음", "주행성", "온순함", "주인인식"],
                "goodWith": ["교감을 원하는 분", "큰 사육장 가능한 분"],
                "notGoodWith": ["좁은 공간", "UVB 세팅 어려운 분"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["대사성 골질환(MBD)", "아데노바이러스", "기생충"],
                "monthlyCost": { "min": 10, "max": 25, "note": "벌레+채소+전기세(조명)" },
                "initialCost": { "min": 50, "max": 200, "note": "대형 사육장+UVB+히터" },
                "tips": [
                    "파충류 중 가장 친화력 좋음! 주인을 알아봐요",
                    "UVB 조명 필수 - 없으면 뼈가 약해져요",
                    "바스킹 스팟 40도, 쿨존 25도 온도 기울기",
                    "성체는 채소 70% + 곤충 30%로 급여"
                ]
            }
        },
        {
            "name": "옥수수뱀",
            "emoji": "🐍",
            "desc": "다양한 색상의 초보자용 뱀",
            "condition": { "handling": "high", "feeding": "high", "maintenance": "low" },
            "mood": "cool",
            "color": "bg-red-100",
            "interpretation": "다양한 색상과 무늬가 아름다운 옥수수뱀! 성격이 온순해서 뱀 입문용으로 최고예요. 독이 없고, 물리는 일도 거의 없어요. 20년 이상 살 수 있어요.",
            "guide": "냉동 쥐를 먹여야 해요. 탈출의 명수라 뚜껑이 단단한 사육장 필수! 1~2주에 한 번 급여하면 돼서 관리가 쉬워요.",
            "matchPoints": ["뱀을 키워보고 싶은 분", "핸들링을 원하는 분", "다양한 색상을 좋아하는 분", "온순한 뱀을 원하는 분"],
            "detailInfo": {
                "origin": "북미",
                "lifespan": "15-20년",
                "size": "90-150cm",
                "weight": "350-700g",
                "personality": ["온순함", "핸들링쉬움", "야행성", "탈출잘함"],
                "goodWith": ["뱀 초보자", "핸들링을 원하는 분"],
                "notGoodWith": ["냉동 쥐 급여가 싫은 분"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["호흡기 감염", "진드기", "탈피 문제"],
                "monthlyCost": { "min": 3, "max": 8, "note": "냉동 쥐(1-2주 1회)+전기세" },
                "initialCost": { "min": 20, "max": 80, "note": "사육장+히터+용품" },
                "tips": [
                    "뱀 입문용으로 최고! 온순하고 관리 쉬움",
                    "탈출의 명수 - 단단한 뚜껑 필수!",
                    "1-2주에 한 번 급여라 관리 편해요",
                    "다양한 모프(색상 변이)가 있어요"
                ]
            }
        },
        {
            "name": "볼 파이톤",
            "emoji": "🐍",
            "desc": "둥글게 말리는 소심한 뱀",
            "condition": { "handling": "high", "space": "high", "feeding": "high", "maintenance": "high", "experience": "high" },
            "mood": "cool",
            "color": "bg-stone-200",
            "interpretation": "무서우면 둥글게 말린다고 해서 볼 파이톤! 소심하고 온순해요. 다양한 모프(색상 변이)가 있어 컬렉션하는 분도 많아요. 30년 이상 장수해요.",
            "guide": "습도 관리가 중요해요(60% 이상). 식욕이 까다로워 거식할 수 있어요. 냉동 쥐를 먹여야 해요. 스트레스에 민감해요.",
            "matchPoints": ["다양한 모프를 좋아하는 분", "온순한 뱀을 원하는 분", "장수하는 반려동물을 원하는 분", "습도 관리가 가능한 분"],
            "detailInfo": {
                "origin": "아프리카(서부/중부)",
                "lifespan": "25-30년",
                "size": "90-150cm",
                "weight": "1-2kg",
                "personality": ["소심함", "온순함", "야행성", "스트레스민감"],
                "goodWith": ["다양한 모프를 원하는 분", "장수 반려동물"],
                "notGoodWith": ["거식 스트레스 감당 어려운 분", "습도 관리 어려운 분"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "medium",
                "healthIssues": ["호흡기 감염", "진드기", "거식증", "탈피 문제"],
                "monthlyCost": { "min": 5, "max": 12, "note": "냉동 쥐+습도관리+전기세" },
                "initialCost": { "min": 30, "max": 500, "note": "모프에 따라 가격 천차만별" },
                "tips": [
                    "무서우면 공처럼 둥글게 말려서 볼파이톤!",
                    "습도 60% 이상 유지 필수",
                    "거식하기 쉬우니 스트레스 최소화",
                    "수천 가지 모프가 있어 컬렉션 재미!"
                ]
            }
        },
        {
            "name": "붉은귀 거북",
            "emoji": "🐢",
            "desc": "친숙한 반수생 거북",
            "condition": { "handling": "low", "space": "high", "feeding": "low", "maintenance": "high" },
            "mood": "calm",
            "color": "bg-green-100",
            "interpretation": "붉은 귀가 특징인 친숙한 거북이! 물에서 주로 생활하며, 일광욕을 좋아해요. 생각보다 활동적이고, 먹이 달라고 다가오는 모습이 귀여워요. 30년 이상 살아요.",
            "guide": "반수생이라 물과 육지가 모두 필요해요. 여과 장치와 UVB 조명 필수! 물을 많이 더럽혀서 여과기 관리가 중요해요. 생각보다 커져요(25cm 이상).",
            "matchPoints": ["거북이를 키우고 싶은 분", "수생 환경을 꾸미고 싶은 분", "오래 함께하고 싶은 분", "관찰하는 재미를 원하는 분"],
            "detailInfo": {
                "origin": "북미",
                "lifespan": "20-40년",
                "size": "20-30cm (등갑)",
                "weight": "1-3kg",
                "personality": ["활동적", "먹보", "반수생", "장수"],
                "goodWith": ["오래 함께하고 싶은 분", "수생 환경 세팅 가능한 분"],
                "notGoodWith": ["작은 공간", "핸들링을 많이 원하는 분"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "medium",
                "healthIssues": ["대사성 골질환(MBD)", "비타민A 결핍", "쉘 로트", "호흡기 감염"],
                "monthlyCost": { "min": 8, "max": 20, "note": "사료+여과기관리+전기세" },
                "initialCost": { "min": 50, "max": 200, "note": "대형 수조+여과기+UVB+육지" },
                "tips": [
                    "반수생이라 물+육지(바스킹 존) 모두 필요",
                    "UVB 조명 필수 - 없으면 뼈와 등갑이 약해져요",
                    "생각보다 많이 커져요 (25cm 이상)",
                    "물을 많이 더럽혀서 강력한 여과기 필수!"
                ]
            }
        }
    ]
};
