// catBreed 테스트 데이터 - 고양이 품종 추천
// petMatch에서 "고양이" 결과 후 연결되는 세부 테스트

import { SubjectData } from '../types';

export const catBreedData: SubjectData = {
    "title": "나에게 맞는 고양이 품종",
    "subtitle": "어떤 고양이와 잘 맞을까?",
    "themeColor": "bg-slate-400",
    "icon": "CatIcon",
    "testType": "matching",
    "dimensions": {
        "activity": {
            "name": "활동성",
            "emoji": "⚡",
            "desc": "원하는 활동 수준"
        },
        "affection": {
            "name": "애교도",
            "emoji": "💕",
            "desc": "원하는 애교 수준"
        },
        "grooming": {
            "name": "관리도",
            "emoji": "✂️",
            "desc": "털 관리 투자 의향"
        },
        "vocal": {
            "name": "수다",
            "emoji": "🗣️",
            "desc": "고양이 소리 허용도"
        },
        "independence": {
            "name": "독립성",
            "emoji": "🏠",
            "desc": "독립적 vs 의존적"
        }
    },
    "questions": [
        // === 활동성 (activity) ===
        {
            "q": "어떤 스타일의 고양이를 원하시나요?",
            "dimension": "activity",
            "a": [
                { "text": "조용히 옆에 있는 고양이", "score": 1 },
                { "text": "가끔 놀아주면 되는 고양이", "score": 3 },
                { "text": "활발하게 뛰어노는 고양이", "score": 5 }
            ]
        },
        // === 애교도 (affection) ===
        {
            "q": "고양이와 어떤 관계를 원하나요?",
            "dimension": "affection",
            "a": [
                { "text": "도도하게 자기 할 일 하는 고양이", "score": 1 },
                { "text": "가끔 다가와 애교 부리는 고양이", "score": 3 },
                { "text": "항상 곁에 붙어있는 '개냥이'", "score": 5 }
            ]
        },
        {
            "q": "고양이가 무릎에 앉는 것을 좋아하시나요?",
            "dimension": "affection",
            "a": [
                { "text": "너무 달라붙는 건 부담스러워요", "score": 1 },
                { "text": "가끔은 좋아요", "score": 3 },
                { "text": "매일 안고 싶어요!", "score": 5 }
            ]
        },
        // === 관리도 (grooming) ===
        {
            "q": "털 관리에 대한 생각은?",
            "dimension": "grooming",
            "a": [
                { "text": "관리가 적은 단모종이 좋아요", "score": 1 },
                { "text": "적당한 관리는 OK", "score": 3 },
                { "text": "풍성한 장모종의 매력!", "score": 5 }
            ]
        },
        // === 수다 (vocal) ===
        {
            "q": "고양이 울음소리에 대한 생각은?",
            "dimension": "vocal",
            "a": [
                { "text": "조용한 고양이가 좋아요", "score": 1 },
                { "text": "적당히 소통하는 정도", "score": 3 },
                { "text": "수다쟁이도 귀여워요!", "score": 5 }
            ]
        },
        // === 독립성 (independence) ===
        {
            "q": "고양이가 혼자 있는 시간은?",
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
            "q": "첫 고양이인가요?",
            "dimension": "activity",
            "a": [
                { "text": "네, 처음이에요", "score": 1 },
                { "text": "어릴 때 키워봤어요", "score": 3 },
                { "text": "여러 마리 키워봤어요", "score": 5 }
            ]
        },
        {
            "q": "다른 반려동물이나 아이가 있나요?",
            "dimension": "affection",
            "a": [
                { "text": "없어요", "score": 3 },
                { "text": "다른 고양이가 있어요", "score": 5 },
                { "text": "강아지나 아이가 있어요", "score": 1 }
            ]
        }
    ],
    "resultLabels": [
        {
            "name": "코리안 숏헤어",
            "emoji": "🐱",
            "desc": "건강하고 적응력 좋은 토종 고양이",
            "condition": { "activity": "high", "grooming": "low", "independence": "high" },
            "mood": "cool",
            "color": "bg-gray-100",
            "interpretation": "한국의 토종 고양이! 다양한 성격을 가지고 있어 만나봐야 알 수 있지만, 대체로 건강하고 환경 적응력이 뛰어나요. 유기묘 입양을 고려해보세요!",
            "guide": "성격이 다양해서 만나서 교감해보는 게 중요해요. 단모라 관리가 쉽고, 건강한 편이에요.",
            "matchPoints": ["유기묘 입양을 고려하는 분", "관리가 쉬운 고양이를 원하는 분", "건강한 고양이를 원하는 분", "다양한 개성을 즐기는 분"],
            "detailInfo": {
                "origin": "한국",
                "lifespan": "15-20년",
                "size": "중형",
                "weight": "3.5-5.5kg",
                "personality": ["독립적", "영리함", "적응력좋음", "다양함", "건강함"],
                "goodWith": ["1인 가구", "가족", "다른 동물", "초보 양육자"],
                "notGoodWith": ["특별히 없음"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "medium",
                "trainingDifficulty": "medium",
                "healthIssues": ["특별한 유전질환 적음", "일반적인 건강관리만 필요"],
                "monthlyCost": { "min": 5, "max": 10, "note": "의료비 제외 기본 비용" },
                "initialCost": { "min": 0, "max": 30, "note": "유기묘 입양 시 무료~저렴" },
                "tips": [
                    "유기묘 보호소에서 만나보세요",
                    "성격이 천차만별이라 직접 교감해보는 게 중요해요",
                    "유전질환이 적어 건강한 편이에요",
                    "토종묘라 한국 기후에 잘 적응해요"
                ]
            }
        },
        {
            "name": "러시안 블루",
            "emoji": "🐱",
            "desc": "조용하고 우아한 은빛 고양이",
            "condition": { "activity": "low", "vocal": "low", "independence": "high" },
            "mood": "cool",
            "color": "bg-slate-200",
            "interpretation": "은빛 털과 에메랄드 눈이 아름다운 러시안 블루! 조용하고 수줍음이 많아 1인 가구에 잘 맞아요. 낯선 사람에게는 경계하지만, 주인에게는 충성스러워요.",
            "guide": "환경 변화에 민감해요. 규칙적인 생활을 좋아하고, 조용한 환경에서 편안해해요. 털빠짐이 적은 편이에요.",
            "matchPoints": ["조용한 환경을 원하는 분", "1인 가구", "차분한 고양이를 원하는 분", "우아한 외모를 좋아하는 분"],
            "detailInfo": {
                "origin": "러시아",
                "lifespan": "15-20년",
                "size": "중형",
                "weight": "3-5.5kg",
                "personality": ["조용함", "수줍음", "충성스러움", "예민함", "지능적"],
                "goodWith": ["1인 가구", "조용한 가정", "노인"],
                "notGoodWith": ["시끄러운 환경", "잦은 환경 변화", "어린 아이"],
                "exerciseNeeds": "low",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "medium",
                "healthIssues": ["비교적 건강함", "비만 주의", "방광 문제"],
                "monthlyCost": { "min": 5, "max": 12, "note": "기본 비용" },
                "initialCost": { "min": 50, "max": 150, "note": "분양가 + 용품" },
                "tips": [
                    "환경 변화에 민감해서 이사 시 주의해요",
                    "낯선 사람에게 숨지만 주인에겐 애교쟁이",
                    "털빠짐이 적어 관리가 쉬워요",
                    "규칙적인 생활 패턴을 좋아해요"
                ]
            }
        },
        {
            "name": "랙돌",
            "emoji": "🐱",
            "desc": "안기면 축 늘어지는 봉제인형",
            "condition": { "affection": "high", "activity": "low", "grooming": "high" },
            "mood": "happy",
            "color": "bg-blue-100",
            "interpretation": "안으면 인형처럼 축 늘어진다고 해서 랙돌! 온순하고 애교가 넘치며 주인을 졸졸 따라다녀요. '개냥이'의 대표격으로, 스킨십을 좋아하는 분에게 딱이에요.",
            "guide": "장모종이라 매일 빗질이 필요해요. 순한 성격이라 다른 동물과도 잘 지내요. 실내에서만 키우세요.",
            "matchPoints": ["스킨십을 좋아하는 분", "개냥이를 원하는 분", "장모종의 매력을 즐기는 분", "온순한 고양이를 원하는 분"],
            "detailInfo": {
                "origin": "미국",
                "lifespan": "12-17년",
                "size": "대형",
                "weight": "4.5-9kg (수컷 더 큼)",
                "personality": ["온순함", "애교많음", "느긋함", "순종적", "다정함"],
                "goodWith": ["어린이", "노인", "다른 동물", "초보 양육자"],
                "notGoodWith": ["방치되는 환경", "외출이 잦은 가정"],
                "exerciseNeeds": "low",
                "groomingNeeds": "high",
                "sheddingLevel": "medium",
                "trainingDifficulty": "easy",
                "healthIssues": ["비대성 심근병증(HCM)", "다낭성 신장질환", "방광 결석"],
                "monthlyCost": { "min": 8, "max": 15, "note": "장모종 관리비 포함" },
                "initialCost": { "min": 80, "max": 250, "note": "인기 품종으로 분양가 높음" },
                "tips": [
                    "안으면 인형처럼 축 늘어져서 랙돌이에요",
                    "주인을 졸졸 따라다니는 개냥이",
                    "매일 빗질해야 털 엉킴을 방지해요",
                    "순해서 싸움을 안 해 실내 전용으로 키우세요"
                ]
            }
        },
        {
            "name": "아비시니안",
            "emoji": "🐱",
            "desc": "호기심 가득한 활동파",
            "condition": { "activity": "high", "affection": "medium", "independence": "low" },
            "mood": "excited",
            "color": "bg-amber-100",
            "interpretation": "호기심이 넘치고 활동적인 아비시니안! 높은 곳을 좋아하고 탐험을 즐겨요. 지능이 높아 놀이를 통한 교감이 중요해요. 에너지 넘치는 분에게 추천!",
            "guide": "캣타워와 놀이터가 필수예요. 지루하면 스트레스받으니 다양한 장난감을 준비하세요. 다른 고양이와 함께 키우면 좋아요.",
            "matchPoints": ["활동적인 고양이를 원하는 분", "놀이를 즐기는 분", "호기심 많은 고양이를 원하는 분", "다묘 가정"],
            "detailInfo": {
                "origin": "이집트/에티오피아",
                "lifespan": "12-15년",
                "size": "중형",
                "weight": "3-5kg",
                "personality": ["활발함", "호기심많음", "지능적", "운동능력좋음", "사교적"],
                "goodWith": ["활동적인 가정", "다묘 가정", "놀아줄 시간 있는 분"],
                "notGoodWith": ["지루한 환경", "혼자 오래 있는 것"],
                "exerciseNeeds": "high",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["진행성 망막위축", "피루베이트 키나아제 결핍", "신장 아밀로이드증"],
                "monthlyCost": { "min": 5, "max": 12, "note": "장난감 비용 추가" },
                "initialCost": { "min": 70, "max": 200, "note": "분양가 + 용품" },
                "tips": [
                    "높은 곳을 좋아해서 캣타워 필수!",
                    "단모라 관리는 쉽지만 운동량이 많아요",
                    "지루하면 문제 행동이 생길 수 있어요",
                    "다른 고양이와 함께 키우면 더 행복해해요"
                ]
            }
        },
        {
            "name": "브리티시 숏헤어",
            "emoji": "🐱",
            "desc": "조용하고 독립적인 영국 신사",
            "condition": { "activity": "low", "independence": "high", "grooming": "low" },
            "mood": "cool",
            "color": "bg-blue-200",
            "interpretation": "통통한 볼과 동그란 눈이 매력적인 브리티시 숏헤어! 조용하고 독립적이라 바쁜 직장인에게 딱이에요. 안기는 것보다 옆에 앉아있는 걸 좋아해요.",
            "guide": "털이 두꺼워 주기적 빗질이 필요해요. 비만이 되기 쉬우니 식단 관리 중요! 조용한 환경을 좋아해요.",
            "matchPoints": ["바쁜 직장인", "독립적인 고양이를 원하는 분", "조용한 고양이를 원하는 분", "통통한 외모를 좋아하는 분"],
            "detailInfo": {
                "origin": "영국",
                "lifespan": "12-17년",
                "size": "중대형",
                "weight": "4-8kg",
                "personality": ["독립적", "조용함", "느긋함", "충성스러움", "차분함"],
                "goodWith": ["바쁜 직장인", "1인 가구", "조용한 가정"],
                "notGoodWith": ["과도한 스킨십", "시끄러운 환경"],
                "exerciseNeeds": "low",
                "groomingNeeds": "medium",
                "sheddingLevel": "medium",
                "trainingDifficulty": "medium",
                "healthIssues": ["비대성 심근병증(HCM)", "비만", "다낭성 신장질환"],
                "monthlyCost": { "min": 6, "max": 12, "note": "비만 예방 식단 고려" },
                "initialCost": { "min": 60, "max": 180, "note": "분양가 + 용품" },
                "tips": [
                    "안기는 것보다 옆에 앉아있는 걸 좋아해요",
                    "비만이 되기 쉬우니 식단 관리 필수!",
                    "두꺼운 털은 주 2-3회 빗질 권장",
                    "테디베어 같은 외모로 인기 많아요"
                ]
            }
        },
        {
            "name": "스코티시 폴드",
            "emoji": "🐱",
            "desc": "접힌 귀가 귀여운 애교쟁이",
            "condition": { "affection": "high", "vocal": "low", "independence": "low" },
            "mood": "happy",
            "color": "bg-orange-100",
            "interpretation": "접힌 귀가 특징인 스코티시 폴드! 온순하고 애교가 많아 가족 모두와 잘 지내요. 조용한 편이라 아파트 생활에도 적합해요.",
            "guide": "유전적으로 관절 문제가 있을 수 있어 건강 체크가 중요해요. 점프를 많이 시키지 마세요. 온순해서 다른 동물과도 잘 지내요.",
            "matchPoints": ["온순한 고양이를 원하는 분", "독특한 외모를 좋아하는 분", "애교 많은 고양이를 원하는 분", "가족이 있는 가정"],
            "detailInfo": {
                "origin": "스코틀랜드",
                "lifespan": "11-14년",
                "size": "중형",
                "weight": "3-6kg",
                "personality": ["온순함", "애교많음", "조용함", "사람좋아함", "적응력좋음"],
                "goodWith": ["어린이", "노인", "다른 동물", "가족"],
                "notGoodWith": ["높은 곳에서 점프", "과격한 놀이"],
                "exerciseNeeds": "low",
                "groomingNeeds": "medium",
                "sheddingLevel": "medium",
                "trainingDifficulty": "easy",
                "healthIssues": ["골연골이형성증(OCD)", "관절 문제", "심장 질환", "다낭성 신장질환"],
                "monthlyCost": { "min": 8, "max": 15, "note": "관절 영양제 비용 고려" },
                "initialCost": { "min": 80, "max": 250, "note": "접힌 귀 개체가 더 비쌈" },
                "tips": [
                    "유전적 관절 문제 때문에 건강검진 필수!",
                    "높은 곳 점프를 줄이고 낮은 캣타워 추천",
                    "폴드끼리 교배는 금지 (관절 문제 악화)",
                    "귀가 접히지 않은 '스트레이트'도 있어요"
                ]
            }
        },
        {
            "name": "샴",
            "emoji": "🐱",
            "desc": "수다쟁이 애교 폭발 고양이",
            "condition": { "vocal": "high", "affection": "high", "activity": "high" },
            "mood": "excited",
            "color": "bg-cream-100",
            "interpretation": "파란 눈의 수다쟁이 샴! 주인과 '대화'하는 걸 좋아하고, 관심받는 걸 즐겨요. 지능이 높고 활발해서 함께 놀아주는 시간이 중요해요.",
            "guide": "혼자 있는 걸 싫어해서 외출이 많으면 다묘 가정을 고려하세요. 울음소리가 크고 자주 울 수 있어요. 장난감과 놀이가 필수!",
            "matchPoints": ["소통하는 고양이를 원하는 분", "집에 자주 있는 분", "활발한 고양이를 원하는 분", "고양이 소리가 괜찮은 분"],
            "detailInfo": {
                "origin": "태국(시암)",
                "lifespan": "12-15년",
                "size": "중형",
                "weight": "3-5kg",
                "personality": ["수다쟁이", "애교많음", "지능적", "활발함", "관심받기좋아함"],
                "goodWith": ["집에 자주 있는 분", "소통을 즐기는 분", "다묘 가정"],
                "notGoodWith": ["외출이 잦은 가정", "조용한 환경을 원하는 분"],
                "exerciseNeeds": "high",
                "groomingNeeds": "low",
                "sheddingLevel": "low",
                "trainingDifficulty": "easy",
                "healthIssues": ["호흡기 문제", "진행성 망막위축", "아밀로이드증", "치과 문제"],
                "monthlyCost": { "min": 5, "max": 12, "note": "장난감 비용 추가" },
                "initialCost": { "min": 50, "max": 150, "note": "분양가 + 용품" },
                "tips": [
                    "울음소리가 크고 자주 울어요 - 이웃 배려 필요",
                    "외로움을 많이 타서 다묘 가정 추천",
                    "매우 똑똑해서 다양한 훈련이 가능해요",
                    "추위에 약하니 겨울철 보온 신경쓰세요"
                ]
            }
        },
        {
            "name": "페르시안",
            "emoji": "🐱",
            "desc": "우아하고 조용한 귀족 고양이",
            "condition": { "grooming": "high", "vocal": "low", "affection": "low" },
            "mood": "cool",
            "color": "bg-white",
            "interpretation": "풍성한 털과 납작한 얼굴이 특징인 페르시안! 조용하고 얌전해서 아파트 생활에 딱이에요. 느긋하고 평화로운 성격이에요.",
            "guide": "매일 빗질이 필수예요! 납작한 얼굴로 호흡기 관리가 필요하고, 눈물자국도 관리해야 해요. 더위에 약해요.",
            "matchPoints": ["조용한 고양이를 원하는 분", "장모종의 우아함을 즐기는 분", "관리에 투자할 수 있는 분", "느긋한 성격을 원하는 분"],
            "detailInfo": {
                "origin": "이란(페르시아)",
                "lifespan": "12-17년",
                "size": "중대형",
                "weight": "3.5-7kg",
                "personality": ["조용함", "온순함", "느긋함", "우아함", "얌전함"],
                "goodWith": ["조용한 가정", "노인", "아파트 생활"],
                "notGoodWith": ["더운 환경", "시끄러운 환경", "관리 시간 없는 분"],
                "exerciseNeeds": "low",
                "groomingNeeds": "high",
                "sheddingLevel": "high",
                "trainingDifficulty": "medium",
                "healthIssues": ["단두증후군", "다낭성 신장질환(PKD)", "눈물흘림", "호흡기 문제"],
                "monthlyCost": { "min": 10, "max": 20, "note": "미용 및 눈 관리비 포함" },
                "initialCost": { "min": 80, "max": 300, "note": "품종에 따라 다름" },
                "tips": [
                    "매일 빗질이 필수! 안 하면 털 엉킴이 심해요",
                    "납작한 얼굴로 눈물자국 매일 닦아주세요",
                    "더위에 약해서 여름엔 에어컨 필수",
                    "호흡기가 약해 과격한 운동은 피하세요"
                ]
            }
        },
        {
            "name": "먼치킨",
            "emoji": "🐱",
            "desc": "짧은 다리의 귀여운 고양이",
            "condition": { "affection": "high", "grooming": "low", "vocal": "low", "activity": "low" },
            "mood": "happy",
            "color": "bg-pink-100",
            "interpretation": "짧은 다리가 특징인 먼치킨! 다리는 짧아도 활발하고 호기심이 많아요. 애교가 넘치고 사람을 좋아해요.",
            "guide": "짧은 다리 때문에 높은 곳은 힘들어해요. 낮은 캣타워를 준비해주세요. 다양한 털 길이가 있어요.",
            "matchPoints": ["독특한 외모를 좋아하는 분", "애교 많은 고양이를 원하는 분", "활발한 고양이를 원하는 분", "귀여운 걸 좋아하는 분"],
            "detailInfo": {
                "origin": "미국",
                "lifespan": "12-15년",
                "size": "소형~중형",
                "weight": "2.5-4kg",
                "personality": ["활발함", "호기심많음", "애교많음", "사람좋아함", "장난기많음"],
                "goodWith": ["어린이", "가족", "다른 동물", "초보 양육자"],
                "notGoodWith": ["높은 캣타워", "점프가 많은 환경"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "low",
                "sheddingLevel": "medium",
                "trainingDifficulty": "easy",
                "healthIssues": ["척추 문제", "관절 문제", "비만 주의"],
                "monthlyCost": { "min": 5, "max": 12, "note": "털 길이에 따라 다름" },
                "initialCost": { "min": 100, "max": 300, "note": "인기 품종으로 분양가 높음" },
                "tips": [
                    "다리가 짧아도 활동량은 많아요!",
                    "낮은 캣타워와 계단을 준비해주세요",
                    "단모/장모 다양해서 관리 난이도가 달라요",
                    "다리가 짧다고 건강에 큰 문제는 아니에요"
                ]
            }
        },
        {
            "name": "노르웨이 숲",
            "emoji": "🐱",
            "desc": "숲에서 온 독립적인 대형 고양이",
            "condition": { "grooming": "high", "independence": "high", "activity": "high" },
            "mood": "cool",
            "color": "bg-green-100",
            "interpretation": "북유럽 숲에서 온 대형 장모종! 독립적이면서도 가족에게는 다정해요. 튼튼하고 건강한 품종이에요.",
            "guide": "장모라 빗질이 필요하지만 털 엉킴이 적어요. 대형이라 공간이 넓으면 좋아요. 추위에 강하지만 더위에는 약해요.",
            "matchPoints": ["대형 고양이를 원하는 분", "독립적인 고양이를 원하는 분", "장모종을 좋아하는 분", "넓은 공간이 있는 분"],
            "detailInfo": {
                "origin": "노르웨이",
                "lifespan": "14-16년",
                "size": "대형",
                "weight": "4-9kg (수컷 더 큼)",
                "personality": ["독립적", "다정함", "튼튼함", "지능적", "차분함"],
                "goodWith": ["넓은 공간", "가족", "다른 동물"],
                "notGoodWith": ["더운 환경", "좁은 공간"],
                "exerciseNeeds": "medium",
                "groomingNeeds": "high",
                "sheddingLevel": "high",
                "trainingDifficulty": "medium",
                "healthIssues": ["비대성 심근병증(HCM)", "당원축적병(GSD IV)", "고관절 이형성증"],
                "monthlyCost": { "min": 8, "max": 15, "note": "대형묘 기준" },
                "initialCost": { "min": 80, "max": 200, "note": "분양가 + 용품" },
                "tips": [
                    "장모지만 털 엉킴이 적어 관리가 수월해요",
                    "북유럽 출신이라 추위에 강해요",
                    "반대로 더위에는 약하니 여름철 주의!",
                    "성묘가 되는 데 4-5년 걸리는 만성숙형이에요"
                ]
            }
        }
    ]
};
