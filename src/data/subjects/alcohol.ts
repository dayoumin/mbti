// alcohol 테스트 데이터

import { SubjectData } from '../types';

export const alcoholData: SubjectData = {
    "title": "오늘 밤 한 잔 테스트",
    "subtitle": "어떤 술이 나와 맞을까?",
    "themeColor": "bg-purple-700",
    "icon": "AlcoholIcon",
    "testType": "matching",
    "dimensions": {
        "strength": {
            "name": "도수",
            "emoji": "🔥",
            "desc": "술의 강도 선호"
        },
        "sweet": {
            "name": "단맛",
            "emoji": "🍬",
            "desc": "달콤한 정도"
        },
        "social": {
            "name": "분위기",
            "emoji": "🎉",
            "desc": "술 마시는 상황"
        },
        "taste": {
            "name": "맛 성향",
            "emoji": "👅",
            "desc": "복잡한 vs 깔끔한 맛"
        },
        "style": {
            "name": "스타일",
            "emoji": "✨",
            "desc": "술을 즐기는 방식"
        }
    },
    "questions": [
        {
            "q": "술의 도수는 어느 정도가 좋아요?",
            "dimension": "strength",
            "a": [
                { "text": "독한 술도 잘 마셔요", "score": 5 },
                { "text": "적당한 도수가 좋아요", "score": 3 },
                { "text": "가벼운 술이 좋아요", "score": 1 }
            ]
        },
        {
            "q": "소주를 마실 때?",
            "dimension": "strength",
            "a": [
                { "text": "스트레이트로 마셔요", "score": 5 },
                { "text": "음료랑 섞어 마셔요", "score": 1 }
            ]
        },
        {
            "q": "달달한 술을 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "네, 달아야 맛있어요", "score": 5 },
                { "text": "살짝 단 정도가 좋아요", "score": 3 },
                { "text": "드라이한 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "과일 맛 술(과일주, 칵테일)은?",
            "dimension": "sweet",
            "a": [
                { "text": "좋아요, 맛있어요", "score": 5 },
                { "text": "술 맛이 안 나요", "score": 1 }
            ]
        },
        {
            "q": "술은 주로 어떤 자리에서 마시나요?",
            "dimension": "social",
            "a": [
                { "text": "친구들과 시끌벅적하게", "score": 5 },
                { "text": "조용히 혼술로", "score": 1 }
            ]
        },
        {
            "q": "술자리 분위기는?",
            "dimension": "social",
            "a": [
                { "text": "신나게 2차 3차까지!", "score": 5 },
                { "text": "분위기 봐서 결정해요", "score": 3 },
                { "text": "적당히 한두 잔이요", "score": 1 }
            ]
        },
        {
            "q": "술맛은 어떤 게 좋아요?",
            "dimension": "taste",
            "a": [
                { "text": "깊고 복잡한 맛이요", "score": 5 },
                { "text": "깔끔하고 단순한 맛이요", "score": 1 }
            ]
        },
        {
            "q": "위스키나 와인 같은 술은?",
            "dimension": "taste",
            "a": [
                { "text": "좋아요, 음미하면서 마셔요", "score": 5 },
                { "text": "잘 모르겠어요, 복잡해요", "score": 1 }
            ]
        },
        {
            "q": "술 마실 때 안주는?",
            "dimension": "style",
            "a": [
                { "text": "술과 안주 페어링이 중요해요", "score": 5 },
                { "text": "간단한 안주면 충분해요", "score": 1 }
            ]
        },
        {
            "q": "술을 마시는 이유는?",
            "dimension": "style",
            "a": [
                { "text": "술 자체의 맛을 즐기려고", "score": 5 },
                { "text": "분위기나 취하려고", "score": 1 }
            ]
        },
        {
            "q": "숙취는 어떤 편이에요?",
            "dimension": "strength",
            "a": [
                { "text": "잘 안 해요, 센 편이에요", "score": 5 },
                { "text": "숙취가 힘들어요", "score": 1 }
            ]
        },
        {
            "q": "새로운 술을 시도하는 편인가요?",
            "dimension": "taste",
            "a": [
                { "text": "다양하게 도전해봐요", "score": 5 },
                { "text": "익숙한 술이 좋아요", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "양주(위스키, 브랜디 등)를 마셔본 적 있나요?",
            "dimension": "strength",
            "a": [
                { "text": "네, 좋아해요", "score": 5 },
                { "text": "너무 독해요", "score": 1 }
            ]
        },
        {
            "q": "폭탄주를 마시나요?",
            "dimension": "strength",
            "a": [
                { "text": "분위기 타면 마셔요", "score": 5 },
                { "text": "안 마셔요", "score": 1 }
            ]
        },
        {
            "q": "막걸리는 어떤 맛이 좋아요?",
            "dimension": "sweet",
            "a": [
                { "text": "달달한 막걸리가 좋아요", "score": 5 },
                { "text": "텁텁하고 진한 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "하이볼을 마셔본 적 있나요?",
            "dimension": "sweet",
            "a": [
                { "text": "네, 탄산이라 마시기 좋아요", "score": 5 },
                { "text": "그냥 원액으로 마셔요", "score": 1 }
            ]
        },
        {
            "q": "회식이나 단체 술자리는?",
            "dimension": "social",
            "a": [
                { "text": "좋아요, 신나요", "score": 5 },
                { "text": "힘들어요, 혼술이 나아요", "score": 1 }
            ]
        },
        {
            "q": "바(bar)나 펍에 가는 것은?",
            "dimension": "social",
            "a": [
                { "text": "분위기 좋아서 좋아요", "score": 5 },
                { "text": "집에서 마시는 게 편해요", "score": 1 }
            ]
        },
        {
            "q": "와인을 고를 때 라벨을 읽어보나요?",
            "dimension": "taste",
            "a": [
                { "text": "네, 품종이나 지역 확인해요", "score": 5 },
                { "text": "잘 모르고 골라요", "score": 1 }
            ]
        },
        {
            "q": "술의 향을 맡아보나요?",
            "dimension": "taste",
            "a": [
                { "text": "네, 향도 중요해요", "score": 5 },
                { "text": "그냥 마셔요", "score": 1 }
            ]
        },
        {
            "q": "술잔에 신경을 쓰나요?",
            "dimension": "style",
            "a": [
                { "text": "네, 잔도 중요해요", "score": 5 },
                { "text": "상관없어요", "score": 1 }
            ]
        },
        {
            "q": "집에 술을 모아두나요?",
            "dimension": "style",
            "a": [
                { "text": "네, 컬렉션이 있어요", "score": 5 },
                { "text": "필요할 때 사요", "score": 1 }
            ]
        },
        {
            "q": "전통주(청주, 약주 등)에 관심 있나요?",
            "dimension": "taste",
            "a": [
                { "text": "네, 다양하게 마셔봤어요", "score": 5 },
                { "text": "잘 모르겠어요", "score": 1 }
            ]
        },
        {
            "q": "술과 음식 페어링을 생각하나요?",
            "dimension": "style",
            "a": [
                { "text": "네, 어울리는 조합이 중요해요", "score": 5 },
                { "text": "그냥 먹고 싶은 거 먹어요", "score": 1 }
            ]
        },
        {
            "q": "소맥(소주+맥주)을 마시나요?",
            "dimension": "social",
            "a": [
                { "text": "회식 때 자주 마셔요", "score": 5 },
                { "text": "따로 마시는 게 나아요", "score": 1 }
            ]
        },
        {
            "q": "술 마신 다음 날 해장술을 마시나요?",
            "dimension": "strength",
            "a": [
                { "text": "가끔 해장술 마셔요", "score": 5 },
                { "text": "절대 안 해요", "score": 1 }
            ]
        },
        {
            "q": "칵테일을 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "네, 다양한 맛이 좋아요", "score": 5 },
                { "text": "단순한 술이 나아요", "score": 1 }
            ]
        },
        {
            "q": "술을 천천히 음미하며 마시나요?",
            "dimension": "style",
            "a": [
                { "text": "네, 천천히 즐겨요", "score": 5 },
                { "text": "빨리 마시는 편이에요", "score": 1 }
            ]
        },
        {
            "q": "수입 맥주를 즐기나요?",
            "dimension": "taste",
            "a": [
                { "text": "네, 다양하게 마셔요", "score": 5 },
                { "text": "국산 맥주가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "술을 선물로 주고받나요?",
            "dimension": "style",
            "a": [
                { "text": "네, 좋은 술 선물해요", "score": 5 },
                { "text": "술 선물은 잘 안 해요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "시원한 생맥주",
            "emoji": "🍺",
            "desc": "친구들과 함께하는 청량한 한 잔",
            "condition": { "strength": "low", "social": "high", "taste": "low" },
            "mood": "excited",
            "color": "bg-amber-400",
            "interpretation": "시원한 생맥주가 당신의 술! 친구들과 치맥, 회식에서 가볍게 즐기기 딱 좋죠. 청량하고 깔끔한 맛으로 부담 없이 마실 수 있어요.",
            "guide": "생맥주는 차갑게 마셔야 맛있어요. 치킨, 피자, 감자튀김과 잘 어울려요. 수제 맥주도 도전해보세요!",
            "matchPoints": ["가벼운 술을 좋아하는 분", "친구들과 어울리는 분", "시원한 술을 원하는 분", "치맥을 사랑하는 분"]
        },
        {
            "name": "깔끔한 소주",
            "emoji": "🍶",
            "desc": "한국인의 소울 드링크",
            "condition": { "strength": "high", "taste": "low", "social": "high" },
            "mood": "happy",
            "color": "bg-green-500",
            "interpretation": "대한민국 국민주 소주! 깔끔하고 담백한 맛으로 어떤 안주와도 잘 어울려요. 소맥도 좋고, 스트레이트도 좋고!",
            "guide": "차갑게 마시면 더 깔끔해요. 삼겹살, 김치찌개 등 한식과 찰떡이에요. 과일 소주도 다양하게 즐겨보세요!",
            "matchPoints": ["깔끔한 맛을 좋아하는 분", "한식과 함께 마시는 분", "회식을 즐기는 분", "가성비를 중요시하는 분"]
        },
        {
            "name": "달달한 칵테일",
            "emoji": "🍹",
            "desc": "화려하고 달콤한 파티 드링크",
            "condition": { "sweet": "high", "strength": "low", "social": "high" },
            "mood": "excited",
            "color": "bg-pink-400",
            "interpretation": "달콤한 칵테일이 당신의 술! 예쁜 비주얼과 다양한 맛을 즐길 수 있어요. 파티나 특별한 날에 딱이죠.",
            "guide": "모히토, 피나콜라다, 코스모폴리탄 등 다양한 칵테일을 시도해보세요. 집에서 간단한 하이볼도 만들어보세요!",
            "matchPoints": ["달콤한 술을 좋아하는 분", "파티를 즐기는 분", "예쁜 술을 좋아하는 분", "도수가 낮은 술을 원하는 분"]
        },
        {
            "name": "풍미 있는 와인",
            "emoji": "🍷",
            "desc": "우아하고 깊은 맛의 와인",
            "condition": { "taste": "high", "style": "high", "sweet": "low" },
            "mood": "cool",
            "color": "bg-red-700",
            "interpretation": "깊은 풍미의 와인이 당신의 술! 음식과의 페어링을 즐기고, 술의 향과 맛을 음미하는 타입이시네요.",
            "guide": "레드와인은 고기, 화이트와인은 해산물과 잘 어울려요. 와인 온도도 중요해요. 레드는 상온, 화이트는 차갑게!",
            "matchPoints": ["술 맛을 음미하는 분", "음식 페어링을 즐기는 분", "우아한 분위기를 좋아하는 분", "복잡한 맛을 즐기는 분"]
        },
        {
            "name": "깊은 위스키",
            "emoji": "🥃",
            "desc": "남다른 취향의 프리미엄 술",
            "condition": { "strength": "high", "taste": "high", "style": "high" },
            "mood": "cool",
            "color": "bg-amber-700",
            "interpretation": "깊고 복잡한 위스키가 당신의 술! 술의 맛과 향을 진정으로 즐기는 마니아시네요. 스트레이트로 음미하는 시간을 사랑하죠.",
            "guide": "싱글몰트, 블렌디드 등 다양한 위스키를 경험해보세요. 하이볼로 가볍게 시작해도 좋아요. 얼음은 큰 게 좋아요!",
            "matchPoints": ["술 마니아인 분", "강한 술을 즐기는 분", "혼술을 즐기는 분", "프리미엄 술을 원하는 분"]
        },
        {
            "name": "전통 막걸리",
            "emoji": "🍶",
            "desc": "한국의 맛, 걸쭉한 정",
            "condition": { "taste": "medium", "sweet": "high", "style": "low" },
            "mood": "happy",
            "color": "bg-stone-200",
            "interpretation": "우리 전통 막걸리가 당신의 술! 달달하고 부드러운 맛에 파전, 김치전과의 조합은 최고죠. 건강에도 좋아요.",
            "guide": "막걸리는 흔들어서 마셔요. 파전, 김치전, 보쌈과 환상 궁합! 생막걸리는 유통기한 짧으니 빨리 드세요.",
            "matchPoints": ["달달한 술을 좋아하는 분", "전통 술에 관심 있는 분", "부드러운 술을 원하는 분", "한식과 함께 마시는 분"]
        },
        {
            "name": "청량한 하이볼",
            "emoji": "🧊",
            "desc": "위스키의 새로운 매력",
            "condition": { "strength": "medium", "sweet": "medium", "social": "medium" },
            "mood": "cool",
            "color": "bg-amber-300",
            "interpretation": "탄산의 청량함과 위스키의 깊이를 동시에! 하이볼은 부담 없이 마시기 좋으면서도 맛의 깊이가 있어요.",
            "guide": "짐빔 하이볼, 산토리 하이볼 등 다양해요. 레몬이나 라임을 넣으면 더 상쾌해요. 탄산수 비율로 도수 조절 가능!",
            "matchPoints": ["위스키에 입문하는 분", "탄산을 좋아하는 분", "적당한 도수를 원하는 분", "트렌디한 술을 원하는 분"]
        },
        {
            "name": "우아한 샴페인",
            "emoji": "🥂",
            "desc": "특별한 날의 축배",
            "condition": { "social": "high", "sweet": "low", "taste": "medium" },
            "mood": "excited",
            "color": "bg-yellow-200",
            "interpretation": "축하의 술 샴페인! 특별한 날, 기념일에 빠질 수 없죠. 우아한 거품과 드라이한 맛이 매력적이에요.",
            "guide": "샴페인은 차갑게 (6-8도) 서빙해요. 브뤼(Brut)가 드라이하고, 데미섹(Demi-sec)이 달아요. 프로세코, 까바도 비슷해요!",
            "matchPoints": ["특별한 날을 즐기는 분", "파티를 좋아하는 분", "드라이한 맛을 원하는 분", "우아한 분위기를 좋아하는 분"]
        },
        {
            "name": "혼술의 정석 사케",
            "emoji": "🍶",
            "desc": "조용히 즐기는 일본의 맛",
            "condition": { "social": "low", "taste": "high", "strength": "medium" },
            "mood": "cool",
            "color": "bg-slate-100",
            "interpretation": "일본 전통주 사케가 당신의 술! 은은한 쌀 향과 부드러운 맛. 혼자 조용히 음미하기 좋아요.",
            "guide": "다이긴조, 준마이 등 등급이 다양해요. 차갑게 또는 데워서 마셔요. 일식과 잘 어울려요!",
            "matchPoints": ["혼술을 즐기는 분", "부드러운 술을 좋아하는 분", "일식을 좋아하는 분", "술을 음미하는 분"]
        },
        {
            "name": "시원한 소맥",
            "emoji": "🍺",
            "desc": "회식의 단골 메뉴",
            "condition": { "social": "high", "strength": "low", "taste": "high" },
            "mood": "excited",
            "color": "bg-lime-400",
            "interpretation": "대한민국 회식 문화의 상징 소맥! 소주와 맥주의 환상적인 조합. 친구들과 함께하면 더 맛있죠.",
            "guide": "황금비율은 소주 3 : 맥주 7 이라고 해요. 소맥잔에 소주 먼저, 맥주는 천천히! 거품이 포인트예요.",
            "matchPoints": ["회식을 즐기는 분", "친구들과 어울리는 분", "깔끔한 맛을 원하는 분", "취하고 싶을 때"]
        },
        {
            "name": "달콤한 과일주",
            "emoji": "🍑",
            "desc": "과일의 달콤함 그대로",
            "condition": { "sweet": "high", "strength": "low", "taste": "low" },
            "mood": "happy",
            "color": "bg-pink-300",
            "interpretation": "달콤한 과일주가 당신의 술! 복분자, 매실주, 청포도주 등 과일의 맛이 살아있어요. 술이 약한 분도 즐기기 좋아요.",
            "guide": "복분자주, 매실주, 살구주 등 다양해요. 차갑게 마시면 더 맛있어요. 여성분들에게 인기 만점!",
            "matchPoints": ["달콤한 술을 좋아하는 분", "가벼운 술을 원하는 분", "과일을 좋아하는 분", "술이 약한 분"]
        },
        {
            "name": "감성의 수제 맥주",
            "emoji": "🍺",
            "desc": "개성 있는 크래프트 비어",
            "condition": { "taste": "high", "style": "medium", "strength": "low" },
            "mood": "cool",
            "color": "bg-orange-600",
            "interpretation": "개성 넘치는 수제 맥주가 당신의 술! IPA, 스타우트, 필스너 등 다양한 맛을 즐기는 맥주 마니아시네요.",
            "guide": "IPA는 홉의 쓴맛, 스타우트는 로스팅 향, 필스너는 청량함이 특징이에요. 맥주 펍에서 다양하게 시도해보세요!",
            "matchPoints": ["맥주 마니아인 분", "다양한 맛을 즐기는 분", "트렌디한 술을 원하는 분", "술의 맛을 중요시하는 분"]
        }
    ]
};
