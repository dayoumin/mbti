// plant 테스트 데이터

import { SubjectData } from '../types';

export const plantData: SubjectData = {
    "title": "나의 반려식물 찾기",
    "subtitle": "나에게 맞는 식물은?",
    "themeColor": "bg-green-300",
    "icon": "PlantIcon",
    "testType": "matching",
    "dimensions": {
        "care": {
            "name": "관리력",
            "emoji": "🌱",
            "desc": "식물 돌봄에 쓸 수 있는 시간과 관심"
        },
        "light": {
            "name": "채광",
            "emoji": "☀️",
            "desc": "집의 햇빛 환경"
        },
        "water": {
            "name": "물주기",
            "emoji": "💧",
            "desc": "물주기 습관과 성향"
        },
        "space": {
            "name": "공간",
            "emoji": "🏠",
            "desc": "식물을 둘 공간 크기"
        },
        "style": {
            "name": "취향",
            "emoji": "🎨",
            "desc": "선호하는 식물 스타일"
        }
    },
    "questions": [
        {
            "q": "평소 식물 관리에 얼마나 시간을 쓸 수 있나요?",
            "dimension": "care",
            "a": [
                { "text": "매일 돌봐줄 수 있어요", "score": 5 },
                { "text": "일주일에 한번 정도만...", "score": 1 }
            ]
        },
        {
            "q": "식물이 아프면 어떻게 할 것 같아요?",
            "dimension": "care",
            "a": [
                { "text": "원인 찾아서 적극 치료해요", "score": 5 },
                { "text": "그냥 두고 지켜봐요", "score": 1 }
            ]
        },
        {
            "q": "외출이나 여행이 잦은 편인가요?",
            "dimension": "care",
            "a": [
                { "text": "집에 있는 날이 더 많아요", "score": 5 },
                { "text": "자주 집을 비워요", "score": 1 }
            ]
        },
        {
            "q": "집에 햇빛이 얼마나 들어오나요?",
            "dimension": "light",
            "a": [
                { "text": "온종일 환하게 들어와요", "score": 5 },
                { "text": "어둡고 그늘진 편이에요", "score": 1 }
            ]
        },
        {
            "q": "식물을 둘 곳은 어디인가요?",
            "dimension": "light",
            "a": [
                { "text": "창가나 베란다", "score": 5 },
                { "text": "방 안쪽이나 욕실", "score": 1 }
            ]
        },
        {
            "q": "계절에 따라 채광이 어떤가요?",
            "dimension": "light",
            "a": [
                { "text": "사계절 밝은 편이에요", "score": 5 },
                { "text": "겨울엔 많이 어두워요", "score": 1 }
            ]
        },
        {
            "q": "물주기를 기억하는 편인가요?",
            "dimension": "water",
            "a": [
                { "text": "정해진 날에 꼬박꼬박!", "score": 5 },
                { "text": "생각나면 주는 편...", "score": 1 }
            ]
        },
        {
            "q": "식물에 물을 줄 때 스타일은?",
            "dimension": "water",
            "a": [
                { "text": "흠뻑 듬뿍 줘야 마음이 편해요", "score": 5 },
                { "text": "조금씩 주는 게 좋아요", "score": 1 }
            ]
        },
        {
            "q": "과습으로 식물을 죽인 경험이?",
            "dimension": "water",
            "a": [
                { "text": "있어요... 물을 너무 줬나봐요", "score": 5 },
                { "text": "없어요, 오히려 건조하게 키워요", "score": 1 }
            ]
        },
        {
            "q": "식물을 둘 공간이 얼마나 되나요?",
            "dimension": "space",
            "a": [
                { "text": "넓은 거실이나 베란다 있어요", "score": 5 },
                { "text": "책상 위 작은 공간만...", "score": 1 }
            ]
        },
        {
            "q": "원하는 식물 크기는?",
            "dimension": "space",
            "a": [
                { "text": "존재감 있는 큰 식물!", "score": 5 },
                { "text": "아담한 미니 식물", "score": 1 }
            ]
        },
        {
            "q": "어떤 느낌의 식물이 좋아요?",
            "dimension": "style",
            "a": [
                { "text": "꽃이 피는 화려한 식물", "score": 5 },
                { "text": "초록 잎이 예쁜 식물", "score": 1 }
            ]
        },
        {
            "q": "인테리어 스타일은?",
            "dimension": "style",
            "a": [
                { "text": "화사하고 생기 넘치는", "score": 5 },
                { "text": "미니멀하고 깔끔한", "score": 1 }
            ]
        }
    ],
    "questions_deep": [
        {
            "q": "분갈이 해본 적 있나요?",
            "dimension": "care",
            "a": [
                { "text": "네, 주기적으로 해줘요", "score": 5 },
                { "text": "해본 적 없어요", "score": 1 }
            ]
        },
        {
            "q": "식물 영양제나 비료를 주나요?",
            "dimension": "care",
            "a": [
                { "text": "계절마다 챙겨줘요", "score": 5 },
                { "text": "물만 줘요", "score": 1 }
            ]
        },
        {
            "q": "병충해 관리는 어떻게?",
            "dimension": "care",
            "a": [
                { "text": "살충제나 천연 방법으로 관리해요", "score": 5 },
                { "text": "잘 모르겠어요...", "score": 1 }
            ]
        },
        {
            "q": "식물등이나 LED 조명을 설치할 의향이?",
            "dimension": "light",
            "a": [
                { "text": "필요하면 설치할 수 있어요", "score": 5 },
                { "text": "자연광만으로 키우고 싶어요", "score": 1 }
            ]
        },
        {
            "q": "직사광선이 드는 곳이 있나요?",
            "dimension": "light",
            "a": [
                { "text": "네, 남향 창가가 있어요", "score": 5 },
                { "text": "전부 간접광이에요", "score": 1 }
            ]
        },
        {
            "q": "습도 관리에 신경 쓸 수 있나요?",
            "dimension": "water",
            "a": [
                { "text": "가습기나 분무기로 관리해요", "score": 5 },
                { "text": "따로 신경 쓰기 어려워요", "score": 1 }
            ]
        },
        {
            "q": "저면관수(아래서 물 주기) 알고 있나요?",
            "dimension": "water",
            "a": [
                { "text": "네, 해본 적 있어요", "score": 5 },
                { "text": "처음 들어봐요", "score": 1 }
            ]
        },
        {
            "q": "물주기 앱이나 알림을 사용할 의향이?",
            "dimension": "water",
            "a": [
                { "text": "좋아요, 사용할게요", "score": 5 },
                { "text": "그냥 감으로 주고 싶어요", "score": 1 }
            ]
        },
        {
            "q": "반려동물이나 아이가 있나요?",
            "dimension": "space",
            "a": [
                { "text": "없어요", "score": 5 },
                { "text": "있어요 (독성 식물 주의 필요)", "score": 1 }
            ]
        },
        {
            "q": "행잉 플랜트(매달아 키우기)에 관심 있어요?",
            "dimension": "space",
            "a": [
                { "text": "네, 공간 활용 좋을 것 같아요", "score": 5 },
                { "text": "바닥이나 선반에만 두고 싶어요", "score": 1 }
            ]
        },
        {
            "q": "독특한 모양의 식물에 관심 있어요?",
            "dimension": "style",
            "a": [
                { "text": "특이하고 개성 있는 게 좋아요", "score": 5 },
                { "text": "평범하고 익숙한 게 편해요", "score": 1 }
            ]
        },
        {
            "q": "식물 성장 과정을 즐기는 편인가요?",
            "dimension": "style",
            "a": [
                { "text": "새 잎 나는 거 보면 행복해요", "score": 5 },
                { "text": "완성된 모습이 좋아요", "score": 1 }
            ]
        },
        {
            "q": "향기나는 식물을 좋아하나요?",
            "dimension": "style",
            "a": [
                { "text": "네, 허브나 꽃향기 좋아해요", "score": 5 },
                { "text": "무향이 편해요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "몬스테라",
            "emoji": "🌿",
            "desc": "존재감 있는 이국적인 매력의 식물",
            "condition": { "care": "high", "light": "medium", "space": "high" },
            "mood": "happy",
            "color": "bg-green-100",
            "interpretation": "당신은 식물을 적극적으로 돌볼 의지가 있고 넓은 공간을 가지고 있네요. 몬스테라는 큰 잎사귀로 공간을 화사하게 채워주고, 관리도 비교적 쉬운 편이에요. 간접광에서도 잘 자라서 밝은 실내 어디든 잘 어울려요.",
            "guide": "물은 겉흙이 마르면 흠뻑 주세요. 잎이 커지면 지지대를 세워주면 더 예쁘게 자라요. 잎에 먼지가 쌓이면 젖은 천으로 닦아주세요.",
            "matchPoints": ["넓은 공간이 있는 분", "이국적인 인테리어를 원하는 분", "주 1회 물주기 가능한 분", "공기정화 효과를 원하는 분"],
            "meta": {
                "heatTolerance": 4,        // 더위에 강함
                "coldTolerance": 2,        // 추위에 약함 (10도 이하 주의)
                "humidityTolerance": 4,    // 습도 좋아함
                "beginnerFriendly": 4,     // 비교적 쉬움
                "careLevel": 3,            // 중간
                "spaceNeeded": "large",
                "suitableFor": ["넓은공간", "밝은간접광", "초보자"],
                "notSuitableFor": ["좁은공간", "어두운곳"],
                "seasonalTips": {
                    "spring": "성장기 시작, 분갈이 적기",
                    "summer": "성장 활발, 물주기 늘리기, 직사광선 피하기",
                    "fall": "성장 둔화, 물주기 줄이기",
                    "winter": "휴면기, 물 최소화, 10도 이상 유지"
                },
                "tags": ["공기정화", "대형식물", "인테리어", "간접광OK"]
            }
        },
        {
            "name": "스투키",
            "emoji": "🌵",
            "desc": "물 안 줘도 OK! 초보자의 영원한 친구",
            "condition": { "care": "low", "water": "low" },
            "mood": "cool",
            "color": "bg-green-50",
            "interpretation": "바쁜 일상에 식물까지 신경 쓰기 어렵다면 스투키가 딱이에요! 한 달에 한 번 물만 줘도 건강하게 자라고, 공기정화 능력도 뛰어나요. 방치해도 잘 살아남는 강인한 식물이에요.",
            "guide": "정말 가끔 물주세요 (월 1-2회). 과습이 가장 큰 적이에요. 통풍이 잘 되는 곳에 두면 더 좋아요.",
            "matchPoints": ["초보 식집사", "자주 집을 비우는 분", "물주기 자주 잊는 분", "사무실에 두고 싶은 분"],
            "meta": {
                "heatTolerance": 5,        // 더위에 강함
                "coldTolerance": 2,        // 추위에 약함 (10도 이하 주의)
                "humidityTolerance": 2,    // 건조 선호
                "beginnerFriendly": 5,     // 최고로 쉬움
                "careLevel": 1,            // 관리 거의 필요 없음
                "spaceNeeded": "small",
                "suitableFor": ["초보자", "사무실", "건조한환경", "방치OK"],
                "notSuitableFor": ["과습환경"],
                "seasonalTips": {
                    "spring": "물주기 시작, 월 1회",
                    "summer": "통풍 중요, 직사광선 피하기",
                    "fall": "물주기 줄이기",
                    "winter": "물 거의 안 줘도 됨, 10도 이상 유지"
                },
                "tags": ["공기정화", "초보추천", "저관리", "사무실추천", "죽이기어려움"]
            }
        },
        {
            "name": "포토스",
            "emoji": "💚",
            "desc": "어디서든 잘 자라는 만능 식물",
            "condition": { "light": "low", "care": "medium" },
            "mood": "happy",
            "color": "bg-emerald-100",
            "interpretation": "어두운 공간에서도 포토스는 건강하게 자라요. 덩굴처럼 뻗어나가는 모습이 예쁘고, NASA 공기정화 식물 목록에도 있어요. 물꽂이로도 쉽게 번식하니 친구에게 나눠주기도 좋아요.",
            "guide": "물은 흙이 마르면 주세요. 줄기가 길어지면 잘라서 물에 꽂으면 뿌리가 나요. 행잉이나 선반 위에 두면 예뻐요.",
            "matchPoints": ["어두운 방에 식물을 원하는 분", "덩굴 식물을 좋아하는 분", "쉽게 번식시키고 싶은 분", "공기정화가 필요한 분"],
            "meta": {
                "heatTolerance": 4,        // 더위에 강함
                "coldTolerance": 2,        // 추위에 약함
                "humidityTolerance": 4,    // 습도 좋아함
                "beginnerFriendly": 5,     // 매우 쉬움
                "careLevel": 2,            // 관리 쉬움
                "spaceNeeded": "small",
                "suitableFor": ["어두운방", "초보자", "행잉", "수경재배"],
                "notSuitableFor": ["직사광선"],
                "seasonalTips": {
                    "spring": "성장 시작, 가지치기 적기",
                    "summer": "성장 활발, 물 자주",
                    "fall": "성장 둔화",
                    "winter": "물주기 줄이기, 10도 이상 유지"
                },
                "tags": ["공기정화", "초보추천", "저광OK", "행잉", "번식쉬움"]
            }
        },
        {
            "name": "스킨답서스",
            "emoji": "🍃",
            "desc": "넝쿨넝쿨 자라는 행잉 플랜트의 정석",
            "condition": { "space": "low", "light": "low", "care": "low" },
            "mood": "happy",
            "color": "bg-lime-100",
            "interpretation": "공간이 좁아도 걱정 없어요! 스킨답서스는 매달아 키우면 공간을 차지하지 않으면서도 분위기를 살려줘요. 관리도 쉽고 어두운 곳에서도 잘 자라요.",
            "guide": "창가에서 조금 떨어진 곳에서도 OK. 물은 2주에 한 번 정도. 너무 길어지면 잘라서 물꽂이로 번식 가능해요.",
            "matchPoints": ["원룸이나 작은 공간", "행잉 인테리어를 원하는 분", "저조도 환경", "가끔 물주는 분"],
            "meta": {
                "heatTolerance": 4,
                "coldTolerance": 2,
                "humidityTolerance": 3,
                "beginnerFriendly": 5,
                "careLevel": 1,
                "spaceNeeded": "small",
                "suitableFor": ["원룸", "저조도", "행잉", "초보자"],
                "notSuitableFor": ["직사광선"],
                "seasonalTips": {
                    "spring": "성장 시작",
                    "summer": "물 자주, 성장 활발",
                    "fall": "물주기 줄이기",
                    "winter": "10도 이상 유지, 물 줄이기"
                },
                "tags": ["저광OK", "행잉", "초보추천", "소공간", "번식쉬움"]
            }
        },
        {
            "name": "다육이",
            "emoji": "🪴",
            "desc": "통통 귀여운 미니 식물",
            "condition": { "water": "low", "space": "low", "style": "low" },
            "mood": "happy",
            "color": "bg-green-100",
            "interpretation": "책상 위 작은 공간에 딱 맞는 아기자기한 다육이예요. 물을 자주 안 줘도 되고, 다양한 모양과 색깔로 수집하는 재미도 있어요. 미니멀한 인테리어에 잘 어울려요.",
            "guide": "물은 2-3주에 한 번, 완전히 마른 후에 주세요. 햇빛을 좋아하니 창가에 두면 좋아요. 과습 주의!",
            "matchPoints": ["미니멀한 인테리어", "책상 위에 둘 식물", "수집하는 재미를 원하는 분", "물주기 드문 분"],
            "meta": {
                "heatTolerance": 4,        // 더위에 강함
                "coldTolerance": 2,        // 추위에 약함 (종류에 따라 다름)
                "humidityTolerance": 1,    // 건조 필수!
                "beginnerFriendly": 4,     // 쉬움 (과습만 주의)
                "careLevel": 2,
                "spaceNeeded": "small",
                "suitableFor": ["책상", "창가", "수집", "건조한환경"],
                "notSuitableFor": ["과습환경", "어두운곳"],
                "seasonalTips": {
                    "spring": "성장기, 분갈이 적기",
                    "summer": "통풍 중요, 고온 주의 (휴면종 있음)",
                    "fall": "성장기, 물주기 조절",
                    "winter": "단수 또는 월 1회, 동해 주의"
                },
                "tags": ["미니", "수집", "저관리", "인테리어", "건조선호"]
            }
        },
        {
            "name": "아레카야자",
            "emoji": "🌴",
            "desc": "집에서 즐기는 열대 휴양지 느낌",
            "condition": { "care": "high", "light": "high", "space": "high" },
            "mood": "excited",
            "color": "bg-green-200",
            "interpretation": "햇빛 좋은 넓은 공간이 있다면 아레카야자로 휴양지 분위기를 만들어보세요! 공기정화와 가습 효과가 뛰어나고, 시원하게 뻗은 잎이 멋져요. 관리에 조금 신경 써야 해요.",
            "guide": "밝은 간접광에서 잘 자라요. 물은 겉흙이 마르면 주고, 잎에 분무도 해주세요. 통풍이 중요해요.",
            "matchPoints": ["넓고 밝은 공간", "열대 인테리어를 원하는 분", "적극적인 관리 가능한 분", "가습 효과를 원하는 분"],
            "meta": {
                "heatTolerance": 4,
                "coldTolerance": 1,        // 추위에 매우 약함 (13도 이하 위험)
                "humidityTolerance": 5,    // 높은 습도 좋아함
                "beginnerFriendly": 2,     // 관리 어려움
                "careLevel": 4,
                "spaceNeeded": "large",
                "suitableFor": ["넓은공간", "밝은간접광", "가습필요"],
                "notSuitableFor": ["추운환경", "건조한환경", "초보자"],
                "seasonalTips": {
                    "spring": "성장 시작, 분갈이 적기",
                    "summer": "성장 최성기, 물 충분히, 직사광선 주의",
                    "fall": "물주기 줄이기 시작",
                    "winter": "13도 이상 필수! 잎끝 갈변 주의, 가습"
                },
                "tags": ["공기정화", "가습효과", "대형식물", "열대", "인테리어"]
            }
        },
        {
            "name": "산세베리아",
            "emoji": "🗡️",
            "desc": "밤에도 산소를 뿜는 침실 식물",
            "condition": { "care": "low", "light": "medium" },
            "mood": "cool",
            "color": "bg-green-100",
            "interpretation": "산세베리아는 밤에 산소를 방출해서 침실에 두기 좋아요. 강인해서 방치해도 잘 자라고, 모던한 느낌의 인테리어에 잘 어울려요. 초보자도 쉽게 키울 수 있어요.",
            "guide": "한 달에 1-2번 물주기. 과습만 피하면 거의 죽지 않아요. 직사광선보다 밝은 간접광이 좋아요.",
            "matchPoints": ["침실에 둘 식물", "공기정화가 필요한 분", "모던한 인테리어", "초보 식집사"],
            "meta": {
                "heatTolerance": 5,
                "coldTolerance": 2,        // 추위에 약함 (10도 이하 주의)
                "humidityTolerance": 2,    // 건조 선호
                "beginnerFriendly": 5,     // 최고로 쉬움
                "careLevel": 1,
                "spaceNeeded": "medium",
                "suitableFor": ["침실", "사무실", "초보자", "건조한환경"],
                "notSuitableFor": ["과습환경"],
                "seasonalTips": {
                    "spring": "성장 시작, 분갈이 가능",
                    "summer": "성장기, 월 2회 물주기",
                    "fall": "물주기 줄이기",
                    "winter": "물 거의 안 줘도 됨, 10도 이상 유지"
                },
                "tags": ["공기정화", "야간산소", "침실추천", "초보추천", "죽이기어려움"]
            }
        },
        {
            "name": "허브 (로즈마리/바질)",
            "emoji": "🌿",
            "desc": "키우고 먹고 향기까지! 실용만점",
            "condition": { "care": "high", "light": "high", "style": "high" },
            "mood": "excited",
            "color": "bg-green-200",
            "interpretation": "요리에 직접 기른 허브를 넣는 로망이 있다면! 햇빛이 잘 드는 창가에서 허브를 키워보세요. 향기도 좋고 수확의 기쁨도 있어요. 꾸준한 관리가 필요해요.",
            "guide": "하루 6시간 이상 직사광선 필요. 물은 겉흙이 마르면 주세요. 자주 수확해야 더 풍성하게 자라요.",
            "matchPoints": ["요리를 좋아하는 분", "실용적인 식물을 원하는 분", "햇빛 좋은 창가가 있는 분", "향기를 좋아하는 분"],
            "meta": {
                "heatTolerance": 3,        // 종류에 따라 다름
                "coldTolerance": 2,        // 대부분 추위에 약함 (로즈마리 제외)
                "humidityTolerance": 3,
                "beginnerFriendly": 2,     // 관리 어려움
                "careLevel": 4,
                "spaceNeeded": "small",
                "suitableFor": ["요리", "남향창가", "향기좋아함"],
                "notSuitableFor": ["어두운환경", "방치스타일"],
                "seasonalTips": {
                    "spring": "성장 시작, 파종 적기 (바질)",
                    "summer": "성장 활발, 수확 자주, 물 충분히",
                    "fall": "수확 마무리, 바질은 1년생 주의",
                    "winter": "로즈마리는 실내로, 바질은 종료 또는 실내"
                },
                "tags": ["향기", "요리", "실용적", "직사광선필요", "수확가능"]
            }
        },
        {
            "name": "홍콩야자",
            "emoji": "🌳",
            "desc": "우아한 자태의 공기정화 식물",
            "condition": { "care": "medium", "space": "high", "light": "medium" },
            "mood": "happy",
            "color": "bg-green-100",
            "interpretation": "세련된 잎 모양으로 인테리어 포인트가 되는 홍콩야자예요. 공기정화 능력이 뛰어나고, 적당한 관리로 오래 키울 수 있어요. 거실의 코너를 멋지게 채워줄 거예요.",
            "guide": "밝은 간접광에서 잘 자라요. 물은 겉흙이 마르면 충분히 주세요. 분무로 습도 관리해주면 좋아요.",
            "matchPoints": ["거실에 둘 큰 식물", "세련된 인테리어", "공기정화가 필요한 분", "중급 식집사"],
            "meta": {
                "heatTolerance": 4,
                "coldTolerance": 2,        // 추위에 약함 (10도 이하 주의)
                "humidityTolerance": 4,    // 습도 좋아함
                "beginnerFriendly": 3,     // 중간
                "careLevel": 3,
                "spaceNeeded": "large",
                "suitableFor": ["거실", "밝은간접광", "중급자"],
                "notSuitableFor": ["추운환경", "어두운곳"],
                "seasonalTips": {
                    "spring": "성장 시작, 분갈이 적기",
                    "summer": "성장 활발, 물 충분히, 습도 유지",
                    "fall": "물주기 줄이기",
                    "winter": "10도 이상 유지, 물 줄이기, 갈잎 정리"
                },
                "tags": ["공기정화", "대형식물", "인테리어", "세련된", "거실추천"]
            }
        },
        {
            "name": "칼라테아",
            "emoji": "🎨",
            "desc": "예술작품 같은 무늬잎 식물",
            "condition": { "care": "high", "water": "high", "style": "high" },
            "mood": "excited",
            "color": "bg-purple-100",
            "interpretation": "칼라테아의 화려한 무늬는 정말 예술작품 같아요! 습도 관리에 신경 써야 하지만, 그만큼 아름다운 잎을 선사해요. 밤에는 잎을 접는 특이한 습성도 있어요.",
            "guide": "높은 습도 필수! 자주 분무해주세요. 직사광선은 피하고 밝은 그늘에서. 정수된 물 사용 권장.",
            "matchPoints": ["화려한 식물을 원하는 분", "습도 관리 가능한 분", "독특한 식물을 좋아하는 분", "중상급 식집사"],
            "meta": {
                "heatTolerance": 3,
                "coldTolerance": 1,        // 추위에 매우 약함 (15도 이하 위험)
                "humidityTolerance": 5,    // 높은 습도 필수!
                "beginnerFriendly": 1,     // 어려움
                "careLevel": 5,            // 관리 많이 필요
                "spaceNeeded": "medium",
                "suitableFor": ["습도관리가능", "화려한무늬선호", "상급자"],
                "notSuitableFor": ["건조한환경", "초보자", "방치스타일"],
                "seasonalTips": {
                    "spring": "성장 시작, 습도 유지",
                    "summer": "습도 높게 유지, 직사광선 절대 금지",
                    "fall": "물주기 조절, 습도 계속 유지",
                    "winter": "15도 이상 필수! 가습기 권장, 갈잎 주의"
                },
                "tags": ["화려한무늬", "고습도필요", "상급자용", "야간잎접힘", "관리어려움"]
            }
        }
    ]
};
