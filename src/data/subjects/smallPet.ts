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
            "condition": { "lifespan": "low", "handling": "high", "noise": "high", "social": "low" },
            "mood": "happy",
            "color": "bg-amber-100",
            "interpretation": "햄스터계의 대표주자! 볼주머니에 먹이를 담는 모습이 너무 귀여워요. 혼자 사는 걸 좋아하고, 밤에 활발하게 쳇바퀴를 돌려요. 첫 소동물로 추천!",
            "guide": "반드시 단독 사육! 영역 동물이라 함께 키우면 싸워요. 야행성이라 낮에는 깨우지 마세요. 쳇바퀴는 필수예요.",
            "matchPoints": ["첫 소동물로 추천", "귀여운 볼주머니를 보고 싶은 분", "혼자 사는 동물을 원하는 분", "야행성이 괜찮은 분"],
            "detailInfo": {
                "origin": "시리아",
                "lifespan": "2-3년",
                "size": "중형 (햄스터 중)",
                "weight": "100-150g",
                "personality": ["온순함", "호기심많음", "단독생활", "야행성", "핸들링용이"],
                "goodWith": ["1인 사육자", "초보자", "어린이(보호자 지도 하)"],
                "notGoodWith": ["다른 햄스터", "낮에 놀고 싶은 분"],
                "exerciseNeeds": "high",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["습성 꼬리병", "당뇨", "종양", "탈모"],
                "monthlyCost": { "min": 2, "max": 5, "note": "사료+베딩 비용" },
                "initialCost": { "min": 5, "max": 15, "note": "케이지+용품 포함" },
                "tips": [
                    "반드시 단독 사육! 영역 동물이에요",
                    "쳇바퀴 직경 21cm 이상 권장",
                    "낮에 깨우면 스트레스받아요",
                    "볼주머니에 먹이 담는 모습이 최고 귀여움 포인트!"
                ]
            }
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
            "matchPoints": ["작은 공간에서 키우고 싶은 분", "관찰하는 재미를 원하는 분", "작은 동물을 좋아하는 분", "핸들링 없어도 괜찮은 분"],
            "detailInfo": {
                "origin": "중앙아시아/중국",
                "lifespan": "1.5-2년",
                "size": "소형",
                "weight": "정글리안 30-50g / 로보 15-30g",
                "personality": ["빠름", "활발함", "예민함", "야행성", "종에따라다름"],
                "goodWith": ["관찰을 좋아하는 분", "작은 공간"],
                "notGoodWith": ["핸들링을 원하는 분", "어린 아이"],
                "exerciseNeeds": "high",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "hard",
                "healthIssues": ["당뇨(정글리안)", "호흡기 질환", "종양"],
                "monthlyCost": { "min": 2, "max": 4, "note": "사료+베딩" },
                "initialCost": { "min": 3, "max": 10, "note": "케이지+용품" },
                "tips": [
                    "매우 빨라서 탈출 주의!",
                    "정글리안: 온순, 핸들링 가능",
                    "로보로브스키: 빠르고 관찰용",
                    "작은 쳇바퀴(15cm 이상)도 OK"
                ]
            }
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
            "matchPoints": ["오래 함께하고 싶은 분", "스킨십을 원하는 분", "조용한 동물을 원하는 분", "넓은 공간이 있는 분"],
            "detailInfo": {
                "origin": "유럽",
                "lifespan": "8-12년",
                "size": "품종에 따라 다양",
                "weight": "소형 1-2kg / 중형 2-4kg / 대형 4kg 이상",
                "personality": ["조용함", "스킨십좋아함", "영역의식있음", "호기심많음", "사회적"],
                "goodWith": ["오래 함께하고 싶은 분", "조용한 환경", "넓은 공간"],
                "notGoodWith": ["더운 환경", "좁은 케이지만 사용"],
                "exerciseNeeds": "high",
                "groomingNeeds": "medium",
                "sheddingLevel": "medium",
                "trainingDifficulty": "medium",
                "healthIssues": ["부정교합", "소화기 정체", "자궁질환(암컷)", "스내플"],
                "monthlyCost": { "min": 5, "max": 15, "note": "건초+펠릿+채소" },
                "initialCost": { "min": 10, "max": 50, "note": "케이지+용품" },
                "tips": [
                    "건초(티모시)가 주식! 무제한 제공하세요",
                    "케이지 밖 운동 시간 매일 1시간 이상 권장",
                    "더위에 약해서 여름엔 에어컨 필수",
                    "중성화 수술 권장 (특히 암컷)"
                ]
            }
        },
        {
            "name": "기니피그",
            "emoji": "🐹",
            "desc": "뿌이뿌이 소리로 소통하는 친구",
            "condition": { "handling": "high", "social": "high", "noise": "low", "lifespan": "low" },
            "mood": "happy",
            "color": "bg-orange-100",
            "interpretation": "귀여운 소리로 소통하는 기니피그! 사회성이 좋아서 2마리 이상 함께 키우면 더 행복해해요. 온순하고 핸들링도 쉬워 아이가 있는 가정에도 추천!",
            "guide": "2마리 이상 함께 키우세요(같은 성별). 비타민C가 필요해서 채소를 매일 줘야 해요. 5~7년 정도 살아요.",
            "matchPoints": ["여러 마리를 키우고 싶은 분", "소리로 소통하고 싶은 분", "온순한 동물을 원하는 분", "아이가 있는 가정"],
            "detailInfo": {
                "origin": "남미(안데스 산맥)",
                "lifespan": "5-7년",
                "size": "중형",
                "weight": "700-1200g",
                "personality": ["온순함", "사회적", "소리로소통", "주행성", "핸들링쉬움"],
                "goodWith": ["어린이", "다마리 사육", "초보자"],
                "notGoodWith": ["단독 사육", "비타민C 관리 어려운 분"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["비타민C 결핍", "요로결석", "호흡기 감염", "피부 질환"],
                "monthlyCost": { "min": 5, "max": 12, "note": "건초+펠릿+채소" },
                "initialCost": { "min": 8, "max": 30, "note": "넓은 케이지 필요" },
                "tips": [
                    "2마리 이상 같은 성별로 함께 키우세요",
                    "비타민C 필수! 매일 채소 급여",
                    "'뿌이뿌이' 소리로 주인을 부르는 게 매력",
                    "낮에 활동해서 관찰하기 좋아요"
                ]
            }
        },
        {
            "name": "친칠라",
            "emoji": "🐭",
            "desc": "세상에서 가장 부드러운 털",
            "condition": { "lifespan": "high", "handling": "low", "noise": "high", "space": "high" },
            "mood": "cool",
            "color": "bg-slate-100",
            "interpretation": "구름 같은 털을 가진 친칠라! 15~20년 이상 살아 오래 함께할 수 있어요. 야행성이고 점프력이 뛰어나 큰 케이지가 필요해요.",
            "guide": "물에 젖으면 안 돼요! 모래목욕으로 털 관리를 해요. 더위에 매우 약해 에어컨 필수. 관리가 까다로워 경험자에게 추천.",
            "matchPoints": ["오래 함께하고 싶은 분", "부드러운 털을 좋아하는 분", "소동물 경험이 있는 분", "온도 관리가 가능한 분"],
            "detailInfo": {
                "origin": "남미(안데스 산맥)",
                "lifespan": "15-20년",
                "size": "중형",
                "weight": "400-600g",
                "personality": ["야행성", "점프력좋음", "독립적", "예민함", "활발함"],
                "goodWith": ["경험 있는 양육자", "오래 함께하고 싶은 분"],
                "notGoodWith": ["더운 환경", "물/습기", "초보자"],
                "exerciseNeeds": "high",
                "groomingNeeds": "medium",
                "sheddingLevel": "low",
                "trainingDifficulty": "medium",
                "healthIssues": ["부정교합", "열사병", "소화기 문제", "곰팡이 감염"],
                "monthlyCost": { "min": 8, "max": 20, "note": "모래목욕+건초+펠릿" },
                "initialCost": { "min": 30, "max": 100, "note": "대형 케이지 필요" },
                "tips": [
                    "절대 물에 젖으면 안 돼요! 모래목욕만!",
                    "더위에 매우 약함 - 22도 이하 유지 필수",
                    "점프력이 좋아 높은 케이지가 필요해요",
                    "세상에서 가장 부드러운 털을 가졌어요"
                ]
            }
        },
        {
            "name": "고슴도치",
            "emoji": "🦔",
            "desc": "동글동글 가시볼 친구",
            "condition": { "handling": "low", "noise": "high", "social": "low", "space": "low" },
            "mood": "cool",
            "color": "bg-gray-200",
            "interpretation": "가시가 귀여운 고슴도치! 독특한 매력이 있고, 길들이면 손 위에서도 편하게 있어요. 야행성이고 혼자 있는 걸 좋아해요.",
            "guide": "처음엔 가시를 세우지만, 익숙해지면 편해져요. 온도 관리가 중요해요(24-28도). 벌레를 먹여야 할 수 있어요.",
            "matchPoints": ["독특한 동물을 원하는 분", "단독 사육을 원하는 분", "밤에 활동해도 괜찮은 분", "길들이는 재미를 원하는 분"],
            "detailInfo": {
                "origin": "아프리카",
                "lifespan": "4-6년",
                "size": "소형",
                "weight": "300-500g",
                "personality": ["야행성", "단독생활", "예민함", "독특함", "길들이기필요"],
                "goodWith": ["독특한 반려동물을 원하는 분", "인내심 있는 양육자"],
                "notGoodWith": ["빠른 핸들링을 원하는 분", "벌레를 못 다루는 분"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "medium",
                "healthIssues": ["비만", "피부 질환", "종양", "치과 문제"],
                "monthlyCost": { "min": 5, "max": 15, "note": "사료+벌레" },
                "initialCost": { "min": 15, "max": 50, "note": "케이지+히터+용품" },
                "tips": [
                    "처음엔 가시를 세우지만 길들이면 순해져요",
                    "온도 24-28도 유지 필수! 동면 방지",
                    "밀웜, 귀뚜라미 등 벌레 급여 필요할 수 있어요",
                    "공 모양으로 말리는 방어 자세가 귀여워요"
                ]
            }
        },
        {
            "name": "페럿",
            "emoji": "🦦",
            "desc": "호기심 많은 장난꾸러기",
            "condition": { "lifespan": "high", "handling": "high", "space": "high", "social": "high" },
            "mood": "excited",
            "color": "bg-amber-50",
            "interpretation": "강아지처럼 활발하고 장난기 넘치는 페럿! 놀이를 좋아하고 교감도 잘해요. 2마리 이상 함께 키우면 더 재밌게 놀아요.",
            "guide": "냄새가 있어서 샘제거 수술이 필요할 수 있어요. 탈출의 명수라 페럿용 케이지가 필요해요. 5~10년 정도 살아요.",
            "matchPoints": ["활발한 동물을 원하는 분", "놀아주는 걸 좋아하는 분", "소동물 경험이 있는 분", "냄새에 민감하지 않은 분"],
            "detailInfo": {
                "origin": "유럽 (족제비 가축화)",
                "lifespan": "5-10년",
                "size": "중형",
                "weight": "0.7-2kg",
                "personality": ["활발함", "장난꾸러기", "호기심많음", "사회적", "놀이좋아함"],
                "goodWith": ["놀아줄 시간 있는 분", "활발한 동물을 원하는 분", "다마리 사육"],
                "notGoodWith": ["냄새에 민감한 분", "좁은 공간", "방치"],
                "exerciseNeeds": "high",
                "groomingNeeds": "medium",
                "sheddingLevel": "low",
                "trainingDifficulty": "medium",
                "healthIssues": ["부신질환", "인슐린종", "림프종", "위장관 이물"],
                "monthlyCost": { "min": 10, "max": 25, "note": "사료+위생용품" },
                "initialCost": { "min": 30, "max": 100, "note": "케이지+수술비 포함 시 높음" },
                "tips": [
                    "탈출의 명수! 좁은 틈도 통과해요",
                    "냄새 줄이려면 샘제거 수술 고려",
                    "강아지처럼 이름 부르면 달려와요",
                    "장난감 숨기기를 좋아하는 도둑놈이에요"
                ]
            }
        }
    ]
};
