// tea 테스트 데이터

import { SubjectData } from '../types';

export const teaData: SubjectData = {
    "title": "나의 차(茶) 찾기",
    "subtitle": "어떤 차가 나와 맞을까?",
    "themeColor": "bg-green-700",
    "icon": "TeaIcon",
    "testType": "matching",
    "dimensions": {
        "flavor": {
            "name": "맛 선호",
            "emoji": "🍃",
            "desc": "어떤 맛의 차를 좋아하나요"
        },
        "caffeine": {
            "name": "카페인",
            "emoji": "⚡",
            "desc": "카페인이 필요한 정도"
        },
        "temperature": {
            "name": "온도",
            "emoji": "🌡️",
            "desc": "뜨거운 vs 차가운"
        },
        "mood": {
            "name": "분위기",
            "emoji": "✨",
            "desc": "차를 마시는 상황과 기분"
        },
        "health": {
            "name": "건강",
            "emoji": "💚",
            "desc": "건강 효능에 대한 관심"
        }
    },
    "questions": [
        {
            "q": "차의 맛에서 가장 중요한 건?",
            "dimension": "flavor",
            "a": [
                { "text": "깊고 진한 맛이 좋아요", "score": 5 },
                { "text": "가볍고 상쾌한 맛이 좋아요", "score": 1 }
            ]
        },
        {
            "q": "쓴맛이 나는 차에 대해 어떻게 생각하세요?",
            "dimension": "flavor",
            "a": [
                { "text": "쓴맛도 차의 매력이에요", "score": 5 },
                { "text": "쓴맛은 싫어요", "score": 1 }
            ]
        },
        {
            "q": "달달한 디저트와 함께 마실 때?",
            "dimension": "flavor",
            "a": [
                { "text": "쌉싸름한 차가 어울려요", "score": 5 },
                { "text": "달달한 차도 좋아요", "score": 1 }
            ]
        },
        {
            "q": "차를 마시는 주된 이유는?",
            "dimension": "caffeine",
            "a": [
                { "text": "집중이 필요할 때, 잠 깨려고", "score": 5 },
                { "text": "휴식과 여유를 위해서", "score": 1 }
            ]
        },
        {
            "q": "저녁에 차를 마시면?",
            "dimension": "caffeine",
            "a": [
                { "text": "잠을 못 자요", "score": 1 },
                { "text": "괜찮아요, 잘 자요", "score": 5 }
            ]
        },
        {
            "q": "커피 대신 차를 마시는 이유가 있다면?",
            "dimension": "caffeine",
            "a": [
                { "text": "카페인이 부드러워서", "score": 1 },
                { "text": "차 특유의 맛이 좋아서", "score": 5 }
            ]
        },
        {
            "q": "차는 뜨거운 것 vs 차가운 것?",
            "dimension": "temperature",
            "a": [
                { "text": "따뜻한 차가 좋아요", "score": 5 },
                { "text": "아이스티가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "여름에도 뜨거운 차를 마시나요?",
            "dimension": "temperature",
            "a": [
                { "text": "네, 여름에도 따뜻하게", "score": 5 },
                { "text": "여름엔 시원한 게 최고죠", "score": 1 }
            ]
        },
        {
            "q": "차를 주로 언제 마시나요?",
            "dimension": "mood",
            "a": [
                { "text": "혼자 조용히 쉴 때", "score": 5 },
                { "text": "친구들과 함께할 때", "score": 1 }
            ]
        },
        {
            "q": "차를 마시는 시간은?",
            "dimension": "mood",
            "a": [
                { "text": "천천히 여유롭게", "score": 5 },
                { "text": "빠르게 마시는 편이에요", "score": 1 }
            ]
        },
        {
            "q": "차의 건강 효능에 관심이 있나요?",
            "dimension": "health",
            "a": [
                { "text": "네, 건강에 좋은 차를 찾아요", "score": 5 },
                { "text": "맛이 더 중요해요", "score": 1 }
            ]
        },
        {
            "q": "소화나 수면에 도움되는 차를 마셔본 적 있나요?",
            "dimension": "health",
            "a": [
                { "text": "네, 효능 보고 골라요", "score": 5 },
                { "text": "그냥 맛있는 거 마셔요", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "녹차의 텁텁한 맛에 대해?",
            "dimension": "flavor",
            "a": [
                { "text": "그게 녹차의 매력이에요", "score": 5 },
                { "text": "좀 부담스러워요", "score": 1 }
            ]
        },
        {
            "q": "꽃차(자스민, 캐모마일 등)를 좋아하나요?",
            "dimension": "flavor",
            "a": [
                { "text": "네, 향이 좋아요", "score": 1 },
                { "text": "향이 너무 강해요", "score": 5 }
            ]
        },
        {
            "q": "과일향 블렌디드 티는?",
            "dimension": "flavor",
            "a": [
                { "text": "좋아요, 상큼해요", "score": 1 },
                { "text": "차는 차답게...", "score": 5 }
            ]
        },
        {
            "q": "말차(가루녹차)를 마셔본 적 있나요?",
            "dimension": "caffeine",
            "a": [
                { "text": "네, 에너지가 좋아요", "score": 5 },
                { "text": "너무 진해서 별로예요", "score": 1 }
            ]
        },
        {
            "q": "디카페인 차에 대해?",
            "dimension": "caffeine",
            "a": [
                { "text": "카페인 없으면 허전해요", "score": 5 },
                { "text": "디카페인도 좋아요", "score": 1 }
            ]
        },
        {
            "q": "아침에 마시는 차로는?",
            "dimension": "caffeine",
            "a": [
                { "text": "잠 깨는 진한 차가 좋아요", "score": 5 },
                { "text": "부드러운 차가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "밀크티(우유 넣은 차)를 좋아하나요?",
            "dimension": "temperature",
            "a": [
                { "text": "따뜻하게 마시면 좋아요", "score": 5 },
                { "text": "시원한 버블티가 좋아요", "score": 1 }
            ]
        },
        {
            "q": "콜드브루 티에 대해?",
            "dimension": "temperature",
            "a": [
                { "text": "부드럽고 좋아요", "score": 1 },
                { "text": "차는 따뜻해야죠", "score": 5 }
            ]
        },
        {
            "q": "차를 마실 때 다과도 함께?",
            "dimension": "mood",
            "a": [
                { "text": "차만으로 충분해요", "score": 5 },
                { "text": "뭔가 곁들여야 좋아요", "score": 1 }
            ]
        },
        {
            "q": "찻잔이나 다구에 관심 있나요?",
            "dimension": "mood",
            "a": [
                { "text": "네, 분위기도 중요해요", "score": 5 },
                { "text": "그냥 머그컵도 괜찮아요", "score": 1 }
            ]
        },
        {
            "q": "허브티의 효능에 대해 찾아본 적 있나요?",
            "dimension": "health",
            "a": [
                { "text": "네, 효능별로 골라요", "score": 5 },
                { "text": "그냥 마셔요", "score": 1 }
            ]
        },
        {
            "q": "몸이 안 좋을 때 특정 차를 찾나요?",
            "dimension": "health",
            "a": [
                { "text": "네, 생강차, 유자차 등", "score": 5 },
                { "text": "약을 먹지 차는...", "score": 1 }
            ]
        },
        {
            "q": "차에 꿀이나 설탕을 넣나요?",
            "dimension": "flavor",
            "a": [
                { "text": "안 넣어요, 원래 맛 그대로", "score": 5 },
                { "text": "달게 마셔요", "score": 1 }
            ]
        },
        {
            "q": "홍차의 진한 맛을 좋아하나요?",
            "dimension": "flavor",
            "a": [
                { "text": "네, 진하고 깊은 맛 좋아요", "score": 5 },
                { "text": "너무 진하면 부담돼요", "score": 1 }
            ]
        },
        {
            "q": "차를 마시면서 명상이나 휴식을?",
            "dimension": "mood",
            "a": [
                { "text": "네, 마음이 편해져요", "score": 5 },
                { "text": "그냥 음료로 마셔요", "score": 1 }
            ]
        },
        {
            "q": "전통 다도에 관심이 있나요?",
            "dimension": "mood",
            "a": [
                { "text": "네, 배워보고 싶어요", "score": 5 },
                { "text": "관심 없어요", "score": 1 }
            ]
        },
        {
            "q": "다이어트 티를 마셔본 적 있나요?",
            "dimension": "health",
            "a": [
                { "text": "네, 효과 기대하면서", "score": 5 },
                { "text": "맛이 별로라서 안 마셔요", "score": 1 }
            ]
        },
        {
            "q": "스트레스 받을 때 차를 마시면?",
            "dimension": "health",
            "a": [
                { "text": "마음이 진정돼요", "score": 5 },
                { "text": "커피나 다른 걸 찾아요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "진한 녹차",
            "emoji": "🍵",
            "desc": "깊고 진한 맛을 즐기는 차 마니아",
            "condition": { "flavor": "high", "caffeine": "high", "health": "high" },
            "mood": "cool",
            "color": "bg-green-800",
            "interpretation": "차 본연의 깊은 맛을 아는 당신! 녹차의 쌉싸름한 풍미와 깊은 여운을 즐기는 타입이에요. 건강에도 관심이 많고, 차를 통해 마음의 여유를 찾는 분이시네요.",
            "guide": "일본산 옥로차나 한국 보성 녹차를 추천해요. 70-80도의 물로 우려내면 쓴맛이 덜하고 감칠맛이 살아나요. 말차로 라떼를 만들어 마셔도 좋아요!",
            "matchPoints": ["진한 차를 좋아하는 분", "건강에 관심 있는 분", "카페인이 필요한 분", "전통 차에 관심 있는 분"]
        },
        {
            "name": "영국식 홍차",
            "emoji": "🫖",
            "desc": "클래식하고 우아한 티타임",
            "condition": { "flavor": "high", "temperature": "high", "mood": "high" },
            "mood": "happy",
            "color": "bg-amber-700",
            "interpretation": "우아한 티타임을 즐기는 당신에게 영국식 홍차가 딱이에요! 진하고 깊은 홍차의 맛과 함께 여유로운 시간을 보내는 걸 좋아하시는군요.",
            "guide": "얼그레이, 아쌈, 다즐링 등 다양한 홍차를 시도해보세요. 스콘이나 쿠키와 함께하면 완벽한 애프터눈 티가 돼요. 밀크티로 마셔도 맛있어요!",
            "matchPoints": ["진한 맛을 좋아하는 분", "따뜻한 차를 선호하는 분", "여유로운 티타임을 즐기는 분", "클래식한 분위기를 좋아하는 분"]
        },
        {
            "name": "캐모마일 허브티",
            "emoji": "🌼",
            "desc": "편안한 휴식을 위한 선택",
            "condition": { "caffeine": "low", "mood": "high", "health": "high" },
            "mood": "happy",
            "color": "bg-yellow-100",
            "interpretation": "카페인 없이 편안하게 쉬고 싶은 당신에게 캐모마일이 딱이에요! 은은한 꽃향과 함께 마음의 평화를 찾는 타입이시네요. 건강과 휴식을 동시에 챙기는 현명한 선택!",
            "guide": "자기 전에 따뜻하게 마시면 숙면에 도움이 돼요. 꿀을 살짝 넣으면 더 맛있어요. 라벤더나 페퍼민트와 블렌딩된 제품도 시도해보세요.",
            "matchPoints": ["카페인에 민감한 분", "수면의 질을 높이고 싶은 분", "여유로운 시간을 좋아하는 분", "건강을 생각하는 분"]
        },
        {
            "name": "시원한 아이스티",
            "emoji": "🧊",
            "desc": "상쾌하고 시원하게!",
            "condition": { "temperature": "low", "flavor": "low", "caffeine": "medium" },
            "mood": "excited",
            "color": "bg-cyan-200",
            "interpretation": "시원하고 상쾌한 게 최고! 무더운 날 얼음 동동 띄운 아이스티만큼 청량한 게 없죠. 가볍고 마시기 편한 차를 선호하는 당신이에요.",
            "guide": "복숭아 아이스티, 레몬 아이스티 등 과일향 블렌딩이 잘 어울려요. 콜드브루로 우려내면 더 부드러워요. 탄산수를 섞으면 스파클링 티가 돼요!",
            "matchPoints": ["시원한 음료를 좋아하는 분", "가벼운 맛을 선호하는 분", "과일향을 좋아하는 분", "사계절 아이스인 분"]
        },
        {
            "name": "달콤한 버블티",
            "emoji": "🧋",
            "desc": "달달하고 재미있는 차",
            "condition": { "flavor": "low", "temperature": "low", "caffeine": "low" },
            "mood": "excited",
            "color": "bg-purple-200",
            "interpretation": "차도 맛있고 재미있어야 하죠! 타피오카 펄이 톡톡 터지는 식감과 달콤한 맛을 즐기는 당신. 친구들과 함께 마시면 더 즐거워요.",
            "guide": "흑당 버블티, 타로 밀크티, 망고 스무디 티 등 다양한 종류를 시도해보세요. 토핑도 바꿔가며 즐겨보세요!",
            "matchPoints": ["단맛을 좋아하는 분", "재미있는 음료를 원하는 분", "친구들과 함께 마시는 분", "사진 찍기 좋은 비주얼을 좋아하는 분"]
        },
        {
            "name": "생강차",
            "emoji": "🫚",
            "desc": "몸을 따뜻하게 해주는 건강 차",
            "condition": { "health": "high", "temperature": "high", "caffeine": "low" },
            "mood": "happy",
            "color": "bg-amber-300",
            "interpretation": "건강을 생각하는 현명한 당신! 생강차의 알싸한 맛과 몸을 따뜻하게 해주는 효능을 아는 분이시네요. 감기 예방, 소화 촉진에 관심이 많으시군요.",
            "guide": "꿀과 함께 마시면 맛이 더 좋아요. 대추, 레몬을 넣어도 맛있어요. 쌀쌀한 날 따뜻하게 마시면 몸이 개운해져요.",
            "matchPoints": ["건강에 관심 있는 분", "카페인 없는 차를 원하는 분", "따뜻한 차를 좋아하는 분", "소화에 도움이 필요한 분"]
        },
        {
            "name": "페퍼민트 티",
            "emoji": "🌿",
            "desc": "상쾌한 향으로 기분 전환",
            "condition": { "health": "high", "flavor": "low", "caffeine": "low" },
            "mood": "cool",
            "color": "bg-emerald-200",
            "interpretation": "상쾌한 민트향으로 기분 전환을 원하는 당신! 소화도 도와주고 카페인도 없어서 언제든 마실 수 있어요. 청량한 느낌을 좋아하시는군요.",
            "guide": "식후에 마시면 소화에 좋아요. 아이스로 마셔도 시원하고 좋아요. 레몬이나 꿀을 넣으면 더 맛있어요.",
            "matchPoints": ["상쾌한 향을 좋아하는 분", "소화에 도움이 필요한 분", "카페인 없는 차를 원하는 분", "가벼운 맛을 선호하는 분"]
        },
        {
            "name": "로얄 밀크티",
            "emoji": "🥛",
            "desc": "진한 홍차와 우유의 부드러운 조화",
            "condition": { "flavor": "high", "temperature": "high", "mood": "low" },
            "mood": "happy",
            "color": "bg-amber-200",
            "interpretation": "진한 홍차에 우유를 넣어 부드럽게 마시는 밀크티! 쓴맛은 부담스럽지만 차의 깊은 맛은 즐기고 싶은 당신에게 딱이에요. 바쁜 일상 속 작은 위로가 되어줄 거예요.",
            "guide": "아쌈이나 CTC 홍차로 진하게 우려서 우유와 함께 끓이면 진짜 밀크티가 돼요. 설탕이나 꿀을 넣어 달콤하게 마셔도 좋아요.",
            "matchPoints": ["부드러운 맛을 좋아하는 분", "따뜻한 차를 선호하는 분", "우유를 좋아하는 분", "일상의 작은 행복을 즐기는 분"]
        },
        {
            "name": "루이보스 티",
            "emoji": "🌾",
            "desc": "카페인 없는 건강한 대안",
            "condition": { "caffeine": "low", "health": "high", "flavor": "medium" },
            "mood": "happy",
            "color": "bg-red-200",
            "interpretation": "카페인 없이도 차의 깊은 맛을 즐기고 싶은 당신! 루이보스는 남아프리카의 허브로, 항산화 성분이 풍부하고 카페인이 없어서 아이부터 임산부까지 누구나 마실 수 있어요.",
            "guide": "바닐라 루이보스, 캐러멜 루이보스 등 블렌딩된 제품도 맛있어요. 밀크티로 만들어도 좋고, 아이스로 마셔도 좋아요.",
            "matchPoints": ["카페인에 민감한 분", "건강에 관심 있는 분", "깊은 맛을 좋아하는 분", "언제든 마시고 싶은 분"]
        },
        {
            "name": "자스민 티",
            "emoji": "🌸",
            "desc": "은은한 꽃향의 우아함",
            "condition": { "flavor": "medium", "caffeine": "medium", "mood": "high" },
            "mood": "happy",
            "color": "bg-pink-100",
            "interpretation": "은은한 자스민 꽃향이 가득한 차를 좋아하는 당신! 녹차에 자스민 향을 입혀 만든 이 차는 우아하고 향긋해요. 여유로운 티타임에 딱이에요.",
            "guide": "중국 자스민 티가 가장 유명해요. 너무 뜨거운 물로 우리면 쓴맛이 나니 70-80도가 좋아요. 차갑게 마셔도 향이 좋아요.",
            "matchPoints": ["꽃향을 좋아하는 분", "우아한 분위기를 즐기는 분", "적당한 카페인을 원하는 분", "아시안 푸드와 함께 마시는 분"]
        },
        {
            "name": "우롱차",
            "emoji": "🍂",
            "desc": "녹차와 홍차 사이의 오묘한 맛",
            "condition": { "flavor": "high", "caffeine": "medium", "health": "medium" },
            "mood": "cool",
            "color": "bg-amber-600",
            "interpretation": "녹차의 산뜻함과 홍차의 깊이를 동시에 즐기는 당신! 우롱차는 반발효차로 복잡하고 오묘한 풍미를 가지고 있어요. 차를 제대로 아는 분이시네요.",
            "guide": "대만 고산 우롱차, 철관음 등 다양한 종류가 있어요. 여러 번 우려 마실 수 있고, 우릴 때마다 다른 맛이 나요. 공부차 스타일로 즐겨보세요!",
            "matchPoints": ["복잡한 풍미를 좋아하는 분", "차를 여러 번 우려 마시는 분", "적당한 카페인을 원하는 분", "새로운 맛에 도전하는 분"]
        },
        {
            "name": "유자차",
            "emoji": "🍊",
            "desc": "새콤달콤 비타민 가득",
            "condition": { "health": "high", "flavor": "low", "temperature": "high" },
            "mood": "excited",
            "color": "bg-yellow-300",
            "interpretation": "새콤달콤한 유자차를 좋아하는 당신! 비타민C가 풍부하고 감기 예방에도 좋아요. 따뜻하게 마시면 몸도 마음도 따뜻해지는 한국의 전통 차예요.",
            "guide": "유자청을 직접 만들어도 좋아요. 탄산수에 타서 유자에이드로 마셔도 맛있어요. 겨울철 필수 차!",
            "matchPoints": ["새콤달콤한 맛을 좋아하는 분", "건강에 관심 있는 분", "따뜻한 차를 좋아하는 분", "한국 전통 차를 즐기는 분"]
        }
    ]
};
