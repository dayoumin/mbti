// bread 테스트 데이터

import { SubjectData } from '../types';

export const breadData: SubjectData = {
    "title": "딱 맞는 빵 찾기",
    "subtitle": "어떤 빵이 나와 맞을까?",
    "themeColor": "bg-amber-600",
    "icon": "BreadIcon",
    "testType": "matching",
    "dimensions": {
        "sweet": {
            "name": "단맛",
            "emoji": "🍬",
            "desc": "단 빵 vs 담백한 빵"
        },
        "texture": {
            "name": "식감",
            "emoji": "🥖",
            "desc": "바삭 vs 촉촉"
        },
        "filling": {
            "name": "속재료",
            "emoji": "🥐",
            "desc": "속이 꽉 찬 vs 심플한"
        },
        "meal": {
            "name": "용도",
            "emoji": "🍽️",
            "desc": "식사용 vs 간식용"
        },
        "style": {
            "name": "스타일",
            "emoji": "✨",
            "desc": "클래식 vs 트렌디"
        }
    },
    "questions": [
        {
            "q": "빵은 달아야 하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "달달한 빵이 최고예요!", "score": 5 },
                { "text": "적당히 달면 좋아요", "score": 3 },
                { "text": "담백한 빵이 좋아요", "score": 1 }
            ]
        },
        {
            "q": "크림빵 vs 소금빵, 선택한다면?",
            "dimension": "sweet",
            "a": [
                { "text": "달콤한 크림빵!", "score": 5 },
                { "text": "담백한 소금빵!", "score": 1 }
            ]
        },
        {
            "q": "빵 식감은 어떤 게 좋아요?",
            "dimension": "texture",
            "a": [
                { "text": "바삭바삭한 게 좋아요", "score": 5 },
                { "text": "겉바속촉이 좋아요", "score": 3 },
                { "text": "부드럽고 촉촉한 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "바게트를 좋아하나요?",
            "dimension": "texture",
            "a": [
                { "text": "네, 겉바속촉이 최고예요", "score": 5 },
                { "text": "너무 딱딱해요", "score": 1 }
            ]
        },
        {
            "q": "빵 속에 뭔가 들어있는 게 좋아요?",
            "dimension": "filling",
            "a": [
                { "text": "네, 속이 꽉 차야죠!", "score": 5 },
                { "text": "적당히 들어있으면 좋아요", "score": 3 },
                { "text": "심플한 빵이 좋아요", "score": 1 }
            ]
        },
        {
            "q": "단팥빵, 크림빵 같은 빵은?",
            "dimension": "filling",
            "a": [
                { "text": "속재료가 가득해서 좋아요", "score": 5 },
                { "text": "빵 자체만 먹고 싶어요", "score": 1 }
            ]
        },
        {
            "q": "빵을 주로 언제 먹나요?",
            "dimension": "meal",
            "a": [
                { "text": "아침 식사로 먹어요", "score": 5 },
                { "text": "간식이나 디저트로 먹어요", "score": 1 }
            ]
        },
        {
            "q": "빵으로 한 끼 때울 수 있나요?",
            "dimension": "meal",
            "a": [
                { "text": "네, 빵으로 식사 대체해요", "score": 5 },
                { "text": "빵은 간식이지 식사는 아니에요", "score": 1 }
            ]
        },
        {
            "q": "동네 빵집 vs 유명 베이커리?",
            "dimension": "style",
            "a": [
                { "text": "익숙한 동네 빵집이요", "score": 1 },
                { "text": "핫한 베이커리 투어해요", "score": 5 }
            ]
        },
        {
            "q": "새로 나온 빵을 시도하는 편인가요?",
            "dimension": "style",
            "a": [
                { "text": "신상은 무조건 시도!", "score": 5 },
                { "text": "원래 먹던 거 먹어요", "score": 1 }
            ]
        },
        {
            "q": "빵에 잼이나 버터를 바르나요?",
            "dimension": "sweet",
            "a": [
                { "text": "달달하게 발라 먹어요", "score": 5 },
                { "text": "그냥 먹어요", "score": 1 }
            ]
        },
        {
            "q": "식빵을 어떻게 먹나요?",
            "dimension": "texture",
            "a": [
                { "text": "토스트해서 바삭하게", "score": 5 },
                { "text": "그냥 부드럽게", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "케이크 종류의 빵을 좋아하나요?",
            "dimension": "sweet",
            "a": [
                { "text": "네, 달달한 케이크류 좋아요", "score": 5 },
                { "text": "너무 달아서 별로예요", "score": 1 }
            ]
        },
        {
            "q": "페이스트리(크루아상, 페스츄리)는?",
            "dimension": "texture",
            "a": [
                { "text": "바삭한 결이 좋아요", "score": 5 },
                { "text": "부서져서 지저분해요", "score": 1 }
            ]
        },
        {
            "q": "소시지빵, 고로케 같은 빵은?",
            "dimension": "filling",
            "a": [
                { "text": "든든해서 좋아요", "score": 5 },
                { "text": "빵만 먹고 싶어요", "score": 1 }
            ]
        },
        {
            "q": "샌드위치를 자주 먹나요?",
            "dimension": "meal",
            "a": [
                { "text": "네, 한 끼 때우기 좋아요", "score": 5 },
                { "text": "별로 안 먹어요", "score": 1 }
            ]
        },
        {
            "q": "크로플, 크룽지 같은 퓨전 빵은?",
            "dimension": "style",
            "a": [
                { "text": "트렌디해서 좋아요!", "score": 5 },
                { "text": "원조가 나아요", "score": 1 }
            ]
        },
        {
            "q": "초코빵 vs 치즈빵?",
            "dimension": "sweet",
            "a": [
                { "text": "달콤한 초코빵!", "score": 5 },
                { "text": "고소한 치즈빵!", "score": 1 }
            ]
        },
        {
            "q": "갓 구운 빵을 좋아하나요?",
            "dimension": "texture",
            "a": [
                { "text": "갓 구운 게 최고죠!", "score": 5 },
                { "text": "식어도 괜찮아요", "score": 1 }
            ]
        },
        {
            "q": "앙버터(앙금+버터) 빵을 좋아하나요?",
            "dimension": "filling",
            "a": [
                { "text": "꿀조합이에요!", "score": 5 },
                { "text": "너무 느끼해요", "score": 1 }
            ]
        },
        {
            "q": "빵과 함께 커피나 우유를 마시나요?",
            "dimension": "meal",
            "a": [
                { "text": "필수죠! 세트로 먹어요", "score": 5 },
                { "text": "빵만 먹어요", "score": 1 }
            ]
        },
        {
            "q": "편의점 빵을 사 먹나요?",
            "dimension": "style",
            "a": [
                { "text": "편하게 자주 사요", "score": 1 },
                { "text": "제대로 된 빵집 가요", "score": 5 }
            ]
        },
        {
            "q": "슈크림빵이나 에클레어는?",
            "dimension": "sweet",
            "a": [
                { "text": "크림 가득해서 좋아요", "score": 5 },
                { "text": "너무 달아요", "score": 1 }
            ]
        },
        {
            "q": "식빵을 사면 얼마나 먹나요?",
            "dimension": "meal",
            "a": [
                { "text": "아침마다 먹어요", "score": 5 },
                { "text": "가끔 먹고 남겨요", "score": 1 }
            ]
        },
        {
            "q": "마늘빵을 좋아하나요?",
            "dimension": "filling",
            "a": [
                { "text": "마늘 버터 듬뿍!", "score": 5 },
                { "text": "향이 강해서 별로예요", "score": 1 }
            ]
        },
        {
            "q": "호빵, 찐빵 같은 빵은?",
            "dimension": "texture",
            "a": [
                { "text": "촉촉하고 따뜻해서 좋아요", "score": 1 },
                { "text": "바삭한 빵이 나아요", "score": 5 }
            ]
        },
        {
            "q": "과일이 올라간 빵(타르트, 과일빵)은?",
            "dimension": "sweet",
            "a": [
                { "text": "과일빵 좋아요!", "score": 5 },
                { "text": "과일은 따로 먹어요", "score": 1 }
            ]
        },
        {
            "q": "통밀빵이나 호밀빵은?",
            "dimension": "meal",
            "a": [
                { "text": "건강해서 좋아요", "score": 5 },
                { "text": "맛이 밋밋해요", "score": 1 }
            ]
        },
        {
            "q": "베이글을 좋아하나요?",
            "dimension": "texture",
            "a": [
                { "text": "쫄깃해서 좋아요", "score": 5 },
                { "text": "너무 질겨요", "score": 1 }
            ]
        },
        {
            "q": "빵집에서 줄 서서 사 먹나요?",
            "dimension": "style",
            "a": [
                { "text": "맛있으면 줄 서요!", "score": 5 },
                { "text": "줄은 싫어요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "달콤한 크림빵",
            "emoji": "🍞",
            "desc": "부드럽고 달콤한 클래식",
            "condition": { "sweet": "high", "filling": "high", "texture": "low" },
            "mood": "happy",
            "color": "bg-yellow-300",
            "interpretation": "달콤한 크림이 가득 찬 크림빵이 당신의 빵! 부드럽고 달달한 맛을 좋아하시네요. 어린 시절 추억의 빵이기도 하죠.",
            "guide": "슈크림빵, 카스타드 크림빵, 생크림빵 등 다양해요. 냉장 보관하면 더 맛있어요!",
            "matchPoints": ["달콤한 빵을 좋아하는 분", "부드러운 식감을 원하는 분", "속재료가 가득한 빵을 좋아하는 분", "클래식한 빵을 선호하는 분"]
        },
        {
            "name": "바삭한 크루아상",
            "emoji": "🥐",
            "desc": "겹겹이 쌓인 버터의 풍미",
            "condition": { "texture": "high", "sweet": "low", "style": "high" },
            "mood": "cool",
            "color": "bg-amber-400",
            "interpretation": "바삭한 크루아상이 당신의 빵! 버터 향이 가득한 페이스트리의 바삭함을 즐기시네요. 커피와 함께라면 완벽!",
            "guide": "크루아상은 오븐에 살짝 데우면 더 바삭해요. 플레인, 아몬드, 초코 등 다양하게 즐겨보세요!",
            "matchPoints": ["바삭한 식감을 좋아하는 분", "버터 향을 좋아하는 분", "트렌디한 베이커리를 즐기는 분", "커피와 함께 먹는 분"]
        },
        {
            "name": "담백한 소금빵",
            "emoji": "🧈",
            "desc": "짭짤한 버터의 조화",
            "condition": { "sweet": "low", "texture": "high", "filling": "low" },
            "mood": "cool",
            "color": "bg-amber-200",
            "interpretation": "담백하고 짭짤한 소금빵! 달달한 빵보다 버터의 고소함과 소금의 짭짤함을 즐기시네요. 요즘 핫한 빵이죠!",
            "guide": "데우면 버터가 녹아서 더 맛있어요. 중간에 버터가 보이는 게 정품! 일본식 시오빵도 맛있어요.",
            "matchPoints": ["담백한 빵을 좋아하는 분", "짭짤한 맛을 원하는 분", "트렌디한 빵을 좋아하는 분", "버터를 좋아하는 분"]
        },
        {
            "name": "든든한 샌드위치",
            "emoji": "🥪",
            "desc": "한 끼 식사로 완벽한 선택",
            "condition": { "meal": "high", "filling": "high", "sweet": "low" },
            "mood": "happy",
            "color": "bg-green-400",
            "interpretation": "속이 꽉 찬 샌드위치가 당신의 빵! 빵을 간식이 아닌 식사로 즐기시네요. 햄, 야채, 치즈 등 영양도 챙기고!",
            "guide": "BLT, 에그마요, 참치 등 다양한 종류가 있어요. 직접 만들어도 좋고, 서브웨이 같은 곳도 좋아요!",
            "matchPoints": ["빵으로 식사하는 분", "든든한 빵을 원하는 분", "건강을 생각하는 분", "바쁜 일상 속 간편식을 원하는 분"]
        },
        {
            "name": "촉촉한 생크림 케이크",
            "emoji": "🍰",
            "desc": "달콤한 축하의 맛",
            "condition": { "sweet": "high", "texture": "low", "style": "medium" },
            "mood": "excited",
            "color": "bg-pink-200",
            "interpretation": "부드럽고 달콤한 생크림 케이크! 기념일이나 특별한 날에 빠질 수 없죠. 디저트로서의 빵을 사랑하시네요.",
            "guide": "생크림은 냉장 필수! 딸기 생크림 케이크가 클래식이에요. 조각 케이크로 자주 즐겨보세요.",
            "matchPoints": ["달콤한 디저트를 좋아하는 분", "부드러운 식감을 원하는 분", "특별한 날을 챙기는 분", "카페 디저트를 즐기는 분"]
        },
        {
            "name": "고소한 단팥빵",
            "emoji": "🫘",
            "desc": "한국인의 소울 빵",
            "condition": { "filling": "high", "sweet": "medium", "style": "low" },
            "mood": "happy",
            "color": "bg-red-800",
            "interpretation": "속이 꽉 찬 단팥빵! 달콤하면서도 속이 든든한 클래식 빵을 좋아하시네요. 동네 빵집의 정겨움이 느껴지죠.",
            "guide": "팥 앙금이 꽉 찬 게 맛있어요. 호두, 밤이 들어간 것도 맛있어요. 따뜻하게 데워 먹으면 더 좋아요!",
            "matchPoints": ["클래식한 빵을 좋아하는 분", "속재료가 풍부한 빵을 원하는 분", "달달한 것을 좋아하는 분", "동네 빵집을 좋아하는 분"]
        },
        {
            "name": "쫄깃한 베이글",
            "emoji": "🥯",
            "desc": "씹는 맛이 매력적인",
            "condition": { "texture": "high", "meal": "high", "sweet": "low" },
            "mood": "cool",
            "color": "bg-amber-500",
            "interpretation": "쫄깃쫄깃한 베이글! 독특한 식감과 담백한 맛으로 아침 식사용으로 딱이에요. 크림치즈랑 먹으면 완벽!",
            "guide": "플레인, 어니언, 블루베리 등 다양해요. 반으로 갈라 토스트하고 크림치즈를 듬뿍!",
            "matchPoints": ["쫄깃한 식감을 좋아하는 분", "아침 식사용 빵을 찾는 분", "담백한 빵을 원하는 분", "건강한 빵을 좋아하는 분"]
        },
        {
            "name": "바삭한 바게트",
            "emoji": "🥖",
            "desc": "프랑스의 대표 빵",
            "condition": { "texture": "high", "filling": "low", "meal": "high" },
            "mood": "cool",
            "color": "bg-amber-600",
            "interpretation": "겉바속촉의 대명사 바게트! 심플하지만 빵 본연의 맛을 즐기시네요. 올리브오일에 찍어 먹으면 최고!",
            "guide": "당일 구운 바게트가 맛있어요. 마늘빵으로 만들거나, 스프에 찍어 먹어도 좋아요!",
            "matchPoints": ["바삭한 식감을 좋아하는 분", "심플한 빵을 원하는 분", "식사용 빵을 찾는 분", "요리와 함께 먹는 빵을 좋아하는 분"]
        },
        {
            "name": "폭신한 식빵",
            "emoji": "🍞",
            "desc": "매일의 기본이 되는 빵",
            "condition": { "meal": "high", "texture": "low", "style": "low" },
            "mood": "happy",
            "color": "bg-amber-100",
            "interpretation": "기본 중의 기본 식빵! 토스트로, 샌드위치로, 매일 아침을 함께하는 든든한 친구죠.",
            "guide": "생식빵, 우유식빵, 호밀식빵 등 다양해요. 토스트기로 바삭하게 구워 버터랑 잼을 발라 드세요!",
            "matchPoints": ["매일 빵을 먹는 분", "기본적인 빵을 좋아하는 분", "아침 식사용 빵을 찾는 분", "다양하게 활용하고 싶은 분"]
        },
        {
            "name": "달달한 초코빵",
            "emoji": "🍫",
            "desc": "초코 러버를 위한 선택",
            "condition": { "sweet": "high", "style": "high", "texture": "low" },
            "mood": "excited",
            "color": "bg-amber-900",
            "interpretation": "달콤한 초코빵! 초콜릿의 진한 달콤함을 사랑하시네요. 간식이나 디저트로 완벽한 선택이에요.",
            "guide": "초코칩빵, 초코소라빵, 가나슈 빵 등 다양해요. 따뜻하게 데우면 초코가 녹아서 더 맛있어요!",
            "matchPoints": ["초콜릿을 좋아하는 분", "달달한 간식을 원하는 분", "부드러운 빵을 좋아하는 분", "디저트를 즐기는 분"]
        },
        {
            "name": "트렌디한 크로플",
            "emoji": "🧇",
            "desc": "SNS 맛집의 스타",
            "condition": { "style": "high", "texture": "high", "sweet": "medium" },
            "mood": "excited",
            "color": "bg-yellow-400",
            "interpretation": "요즘 핫한 크로플! 크루아상과 와플의 만남. 새로운 것을 좋아하고 트렌드를 따라가시네요!",
            "guide": "아이스크림이나 과일 토핑을 올려 먹으면 맛있어요. 크룽지, 소금빵 와플도 트렌디해요!",
            "matchPoints": ["트렌디한 빵을 좋아하는 분", "바삭한 식감을 원하는 분", "SNS 핫플을 즐기는 분", "새로운 것을 시도하는 분"]
        },
        {
            "name": "따뜻한 마늘빵",
            "emoji": "🧄",
            "desc": "고소한 마늘 버터의 향연",
            "condition": { "filling": "high", "texture": "medium", "sweet": "low" },
            "mood": "happy",
            "color": "bg-amber-300",
            "interpretation": "마늘 버터 향이 가득한 마늘빵! 스파게티나 스테이크와 함께 먹으면 완벽하죠. 고소하고 짭짤한 맛을 좋아하시네요.",
            "guide": "오븐에 데우면 겉은 바삭, 속은 부드러워요. 마늘 버터를 듬뿍 바른 게 맛있어요!",
            "matchPoints": ["고소한 맛을 좋아하는 분", "식사와 함께 먹는 빵을 원하는 분", "마늘을 좋아하는 분", "서양 음식을 즐기는 분"]
        }
    ]
};
