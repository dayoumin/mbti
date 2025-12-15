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
            "matchPoints": ["첫 관상어로 추천", "작은 공간에서 키우고 싶은 분", "화려한 색상을 원하는 분", "단독 사육을 원하는 분"],
            "detailInfo": {
                "origin": "태국/동남아시아",
                "lifespan": "2-4년",
                "size": "5-7cm",
                "weight": "수조 최소 5L 이상 권장",
                "personality": ["영역의식강함", "공격적(동종)", "활발함", "호기심많음"],
                "goodWith": ["단독 사육", "초보자"],
                "notGoodWith": ["다른 베타", "화려한 물고기", "작은 어항"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["지느러미 썩음병", "수적병", "벨벳병"],
                "monthlyCost": { "min": 1, "max": 3, "note": "사료+수질관리" },
                "initialCost": { "min": 3, "max": 15, "note": "어항+히터+사료" },
                "tips": [
                    "반드시 단독 사육! 다른 베타와 싸워요",
                    "공기 호흡이 가능해서 여과기 없어도 OK",
                    "수온 25-28도, 주 1회 30% 물갈이",
                    "다양한 색상과 지느러미 형태가 있어요"
                ]
            }
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
            "matchPoints": ["초보자에게 추천", "번식의 기쁨을 느끼고 싶은 분", "다양한 색상을 원하는 분", "여러 마리를 키우고 싶은 분"],
            "detailInfo": {
                "origin": "남미(베네수엘라)",
                "lifespan": "2-3년",
                "size": "수컷 3-4cm / 암컷 4-6cm",
                "weight": "수조 최소 20L 권장",
                "personality": ["활발함", "평화로움", "군영생활", "번식력강함"],
                "goodWith": ["초보자", "다른 소형어", "군영 사육"],
                "notGoodWith": ["대형 육식어", "공격적인 어종"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["흰점병", "지느러미 썩음병", "곰팡이 감염"],
                "monthlyCost": { "min": 1, "max": 3, "note": "사료+수질관리" },
                "initialCost": { "min": 5, "max": 20, "note": "수조+여과기+히터" },
                "tips": [
                    "번식이 매우 쉬워서 수컷만 키우면 조절 가능",
                    "수컷이 더 화려하고 암컷은 덜 화려해요",
                    "난태생이라 새끼를 낳아요 (알X)",
                    "다양한 품종과 색상이 있어 수집 재미도!"
                ]
            }
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
            "matchPoints": ["군영의 아름다움을 원하는 분", "수초 수조에 관심 있는 분", "아쿠아스케이핑을 하고 싶은 분", "평화로운 수조를 원하는 분"],
            "detailInfo": {
                "origin": "남미(아마존 유역)",
                "lifespan": "5-8년",
                "size": "3-4cm",
                "weight": "수조 최소 40L 이상, 10마리+ 군영",
                "personality": ["평화로움", "군영생활", "소심함", "활발함"],
                "goodWith": ["수초 수조", "다른 소형어", "아쿠아스케이핑"],
                "notGoodWith": ["대형어", "공격적인 어종", "소수 사육"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["네온병", "흰점병", "수질 스트레스"],
                "monthlyCost": { "min": 2, "max": 5, "note": "사료+수질관리" },
                "initialCost": { "min": 15, "max": 50, "note": "수조+여과기+히터+수초" },
                "tips": [
                    "10마리 이상 군영으로 키워야 예뻐요!",
                    "약산성 연수(pH 6.0-7.0)를 좋아해요",
                    "수초와 함께 키우면 더욱 아름다워요",
                    "빛에 반사되어 네온처럼 빛나요"
                ]
            }
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
            "matchPoints": ["전통적인 관상어를 원하는 분", "오래 함께하고 싶은 분", "히터 없이 키우고 싶은 분", "큰 수조를 둘 수 있는 분"],
            "detailInfo": {
                "origin": "중국",
                "lifespan": "10-15년 (관리 잘하면 20년+)",
                "size": "품종에 따라 10-30cm",
                "weight": "수조 최소 60L 이상 (마리당 40L)",
                "personality": ["먹보", "온순함", "사회적", "호기심많음"],
                "goodWith": ["같은 종 금붕어", "냉수어"],
                "notGoodWith": ["열대어", "작은 어항", "다른 물고기와 합사"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["부레 장애", "흰점병", "지느러미 썩음병"],
                "monthlyCost": { "min": 3, "max": 8, "note": "사료+물갈이+여과" },
                "initialCost": { "min": 20, "max": 80, "note": "대형 수조+강력 여과기" },
                "tips": [
                    "작은 어항은 절대 안 돼요! 60L 이상 필수",
                    "히터 없이도 OK, 상온에서 키울 수 있어요",
                    "먹보라서 물이 빨리 더러워져요 - 강력 여과기 필수",
                    "주 1-2회 30-50% 물갈이 권장"
                ]
            }
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
            "matchPoints": ["청소부 물고기가 필요한 분", "귀여운 물고기를 원하는 분", "합사할 물고기를 찾는 분", "온순한 물고기를 원하는 분"],
            "detailInfo": {
                "origin": "남미",
                "lifespan": "5-10년",
                "size": "3-7cm (종류에 따라)",
                "weight": "수조 30L 이상, 3마리+ 권장",
                "personality": ["온순함", "사회적", "바닥생활", "야행성경향"],
                "goodWith": ["대부분의 소형어", "수초 수조", "합사"],
                "notGoodWith": ["공격적인 어종", "날카로운 자갈 바닥"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["수염 손상", "세균 감염", "수질 민감"],
                "monthlyCost": { "min": 2, "max": 4, "note": "사료(침하 사료)+수질관리" },
                "initialCost": { "min": 10, "max": 30, "note": "수조+모래바닥+여과기" },
                "tips": [
                    "바닥재는 모래가 좋아요! 자갈은 수염 상처",
                    "3마리 이상 함께 키워야 행복해해요",
                    "바닥을 뒤지며 청소해주는 귀여운 청소부",
                    "침하 사료(가라앉는 사료)를 별도로 급여하세요"
                ]
            }
        },
        {
            "name": "엔젤피시",
            "emoji": "🐟",
            "desc": "우아한 삼각형의 여왕",
            "condition": { "difficulty": "high", "tankSize": "high", "visual": "high", "maintenance": "low" },
            "mood": "cool",
            "color": "bg-silver-100",
            "interpretation": "우아하게 헤엄치는 엔젤피시! 독특한 삼각형 몸매와 긴 지느러미가 매력적이에요. 수조의 중심을 차지하는 존재감이 있어요.",
            "guide": "키가 크니 높은 수조가 필요해요. 영역 의식이 있어 작은 물고기는 잡아먹을 수 있어요. 수온 26-30도, pH 6.5-7.0.",
            "matchPoints": ["우아한 물고기를 원하는 분", "중급자에게 추천", "큰 수조를 둘 수 있는 분", "존재감 있는 물고기를 원하는 분"],
            "detailInfo": {
                "origin": "남미(아마존 유역)",
                "lifespan": "10-12년",
                "size": "15cm (키 포함 20cm+)",
                "weight": "수조 150L 이상, 높이 50cm+ 필요",
                "personality": ["우아함", "영역의식", "육식성향", "사회적"],
                "goodWith": ["비슷한 크기 어종", "중대형 테트라"],
                "notGoodWith": ["소형어(먹힐 수 있음)", "지느러미 뜯는 어종"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "medium",
                "healthIssues": ["헥사미타", "흰점병", "지느러미 썩음병"],
                "monthlyCost": { "min": 5, "max": 10, "note": "사료+수질관리" },
                "initialCost": { "min": 50, "max": 150, "note": "대형 높은 수조+여과기" },
                "tips": [
                    "높이가 있는 수조가 필수! (50cm 이상)",
                    "소형어는 잡아먹을 수 있어요",
                    "수온 26-30도로 다른 열대어보다 높아요",
                    "짝을 이루면 번식도 가능해요"
                ]
            }
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
            "matchPoints": ["상급자에게 도전", "가장 아름다운 물고기를 원하는 분", "정성을 쏟을 수 있는 분", "열대어 왕에 도전하고 싶은 분"],
            "detailInfo": {
                "origin": "남미(아마존 유역)",
                "lifespan": "10-15년",
                "size": "15-20cm",
                "weight": "수조 200L 이상, 마리당 50L",
                "personality": ["예민함", "사회적", "우아함", "까다로움"],
                "goodWith": ["같은 종 디스커스", "코리도라스", "온순한 테트라"],
                "notGoodWith": ["공격적인 어종", "초보자"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "hard",
                "healthIssues": ["헥사미타", "세균 감염", "스트레스 질환"],
                "monthlyCost": { "min": 15, "max": 40, "note": "고품질 사료+물갈이+약품" },
                "initialCost": { "min": 100, "max": 500, "note": "대형 수조+고급 여과+개체 가격" },
                "tips": [
                    "열대어의 왕! 상급자에게만 추천",
                    "수온 28-30도로 높게, 약산성 연수 유지",
                    "매일 또는 이틀에 한번 물갈이 필요",
                    "5마리 이상 군영으로 키워야 스트레스↓"
                ]
            }
        },
        {
            "name": "플레코",
            "emoji": "🐟",
            "desc": "유리창 청소부",
            "condition": { "difficulty": "low", "maintenance": "low", "visual": "low", "social": "low" },
            "mood": "cool",
            "color": "bg-brown-100",
            "interpretation": "수조 유리와 장식물의 이끼를 청소해주는 플레코! 야행성이라 낮에는 숨어있다가 밤에 활동해요. 묵묵히 일하는 일꾼이에요.",
            "guide": "종류에 따라 크기가 매우 다양해요(5cm~50cm). 야행성이라 숨을 곳을 만들어주세요. 이끼만으로 부족하니 플레코 전용 사료도 주세요.",
            "matchPoints": ["청소부 물고기가 필요한 분", "이끼 제거를 원하는 분", "야행성이 괜찮은 분", "큰 수조가 있는 분"],
            "detailInfo": {
                "origin": "남미",
                "lifespan": "10-15년",
                "size": "소형 5cm ~ 대형 50cm+ (종류에 따라)",
                "weight": "종류에 따라 수조 크기 선택 필요",
                "personality": ["야행성", "평화로움", "은둔형", "이끼청소"],
                "goodWith": ["대부분의 어종과 합사 가능"],
                "notGoodWith": ["같은 플레코 종", "너무 작은 수조"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["영양실조(이끼만으로 부족)", "세균 감염"],
                "monthlyCost": { "min": 2, "max": 5, "note": "플레코 전용 사료" },
                "initialCost": { "min": 5, "max": 50, "note": "종류에 따라 크게 다름" },
                "tips": [
                    "종류에 따라 크기가 매우 달라요! 구매 전 확인",
                    "이끼만으로 부족하니 전용 사료 급여 필수",
                    "야행성이라 낮에는 숨을 곳(유목 등) 필요",
                    "유리와 장식물의 이끼를 청소해줘요"
                ]
            }
        }
    ]
};
