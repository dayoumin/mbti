// homeStyle 테스트 데이터 (집콕 스타일 매칭 테스트)
// 생성일: 2025-12-25

import type { SubjectData } from '../types';

export const homeStyleData: SubjectData = {
  "title": "집콕 취미 테스트",
  "subtitle": "나에게 맞는 집콕 취미는?",
  "themeColor": "bg-amber-500",
  "icon": "HomeStyleIcon",
  "testType": "matching",
  "dimensions": {
    "active": {
      "name": "활동성",
      "emoji": "🏃",
      "desc": "움직이는 걸 좋아하는 정도"
    },
    "creative": {
      "name": "창작욕",
      "emoji": "🎨",
      "desc": "무언가 만드는 것을 좋아하는 정도"
    },
    "focus": {
      "name": "집중력",
      "emoji": "🎯",
      "desc": "한 가지에 몰입하는 정도"
    },
    "social": {
      "name": "소통욕",
      "emoji": "💬",
      "desc": "혼자 vs 함께"
    },
    "learning": {
      "name": "배움욕",
      "emoji": "📚",
      "desc": "새로운 것을 배우려는 욕구"
    }
  },
  "questions": [
    {
      "q": "집에서 하루 종일 있으면?",
      "dimension": "active",
      "a": [
        { "text": "몸이 근질근질해요", "score": 5 },
        { "text": "적당히 괜찮아요", "score": 3 },
        { "text": "너무 편해요~", "score": 1 }
      ]
    },
    {
      "q": "집콕하면서 운동은?",
      "dimension": "active",
      "a": [
        { "text": "홈트 필수!", "score": 5 },
        { "text": "가끔 스트레칭 정도", "score": 3 },
        { "text": "움직이기 싫어요", "score": 1 }
      ]
    },
    {
      "q": "손으로 뭔가 만드는 거 좋아해요?",
      "dimension": "creative",
      "a": [
        { "text": "네! 만들기 좋아해요", "score": 5 },
        { "text": "키트 같은 건 해볼 만해요", "score": 3 },
        { "text": "만들기는 귀찮아요", "score": 1 }
      ]
    },
    {
      "q": "요리/베이킹에 대해?",
      "dimension": "creative",
      "a": [
        { "text": "새 레시피 도전 좋아해요!", "score": 5 },
        { "text": "간단한 건 해요", "score": 3 },
        { "text": "배달이 최고...", "score": 1 }
      ]
    },
    {
      "q": "영화/드라마 볼 때?",
      "dimension": "focus",
      "a": [
        { "text": "몰입해서 집중!", "score": 5 },
        { "text": "가끔 폰 보면서요", "score": 3 },
        { "text": "폰 하면서 봐요", "score": 1 }
      ]
    },
    {
      "q": "퍼즐이나 레고 같은 조립은?",
      "dimension": "focus",
      "a": [
        { "text": "몇 시간이고 할 수 있어요", "score": 5 },
        { "text": "잠깐은 재밌어요", "score": 3 },
        { "text": "지루해요", "score": 1 }
      ]
    },
    {
      "q": "집에서 혼자 있는 시간은?",
      "dimension": "social",
      "a": [
        { "text": "좀 심심해요", "score": 5 },
        { "text": "적당히 좋아요", "score": 3 },
        { "text": "최고예요!", "score": 1 }
      ]
    },
    {
      "q": "영상통화나 온라인 모임은?",
      "dimension": "social",
      "a": [
        { "text": "자주 해요!", "score": 5 },
        { "text": "가끔요", "score": 3 },
        { "text": "잘 안 해요", "score": 1 }
      ]
    },
    {
      "q": "새로운 취미 배우기에 대해?",
      "dimension": "learning",
      "a": [
        { "text": "항상 새로운 거 찾아요!", "score": 5 },
        { "text": "괜찮은 게 있으면요", "score": 3 },
        { "text": "익숙한 게 편해요", "score": 1 }
      ]
    },
    {
      "q": "유튜브/인강 보는 거?",
      "dimension": "learning",
      "a": [
        { "text": "배우는 영상 자주 봐요", "score": 5 },
        { "text": "가끔 봐요", "score": 3 },
        { "text": "재미있는 것만 봐요", "score": 1 }
      ]
    },
    {
      "q": "집콕할 때 선호하는 분위기는?",
      "dimension": "active",
      "a": [
        { "text": "뭔가 하고 있어야 해요", "score": 5 },
        { "text": "적당히 바쁜 게 좋아요", "score": 3 },
        { "text": "아무것도 안 하고 쉬고 싶어요", "score": 1 }
      ]
    },
    {
      "q": "완성작을 보는 뿌듯함은?",
      "dimension": "creative",
      "a": [
        { "text": "그 맛에 만들어요!", "score": 5 },
        { "text": "있으면 좋죠", "score": 3 },
        { "text": "별로 안 끌려요", "score": 1 }
      ]
    }
  ],
  "resultLabels": [
    {
      "name": "홈트레이닝",
      "emoji": "🏋️",
      "desc": "집에서도 몸을 움직여야 직성이 풀려요",
      "condition": { "active": "high", "focus": "high" },
      "mood": "excited",
      "color": "bg-red-500",
      "interpretation": "에너지 넘치는 당신에게 가만히 있는 집콕은 고문! 홈트레이닝으로 땀 흘리면 운동도 하고 스트레스도 풀리는 일석이조예요. 유튜브 홈트 영상 따라하기, 링피트, 줄넘기 등 다양한 방법이 있어요.",
      "guide": "요가, 필라테스, HIIT, 근력운동 중 취향에 맞는 것을 찾아보세요. 링피트나 저스트댄스 같은 게임도 추천! 운동 유튜버 구독해서 함께 하면 더 재밌어요.",
      "matchPoints": ["움직이는 걸 좋아하는 분", "집에서도 운동하고 싶은 분", "땀 흘리는 게 좋은 분", "건강 관리에 관심 있는 분"]
    },
    {
      "name": "DIY 공예",
      "emoji": "🎨",
      "desc": "손으로 만드는 즐거움! 창작의 기쁨",
      "condition": { "creative": "high", "focus": "high" },
      "mood": "happy",
      "color": "bg-pink-500",
      "interpretation": "만들기 좋아하고 집중력 좋은 당신에게 DIY 공예가 딱! 완성작을 보는 뿌듯함은 덤이에요. 비즈 공예, 캔들 만들기, 레진 아트, 미니어처 등 다양한 분야가 있어요.",
      "guide": "입문자 키트로 시작해보세요! 인스타그램이나 유튜브에서 DIY 영감을 얻을 수 있어요. 완성작은 인테리어 소품이나 선물로도 좋아요.",
      "matchPoints": ["만들기 좋아하는 분", "완성작 보는 뿌듯함 아는 분", "집중력 좋은 분", "손재주 있는 분"]
    },
    {
      "name": "요리/베이킹",
      "emoji": "👨‍🍳",
      "desc": "집에서 셰프가 되어보자!",
      "condition": { "creative": "high", "learning": "high" },
      "mood": "happy",
      "color": "bg-orange-500",
      "interpretation": "새로운 레시피 도전하고 맛있는 음식 만드는 게 즐거운 당신! 집콕하면서 요리 실력을 키워보세요. 유튜브 레시피 따라하기, 밀키트 도전, 베이킹 등 다양한 방법이 있어요.",
      "guide": "쉬운 레시피부터 시작해서 점점 레벨업! 백종원, 승우아빠 같은 요리 유튜버 구독 추천. 베이킹은 베이킹 스튜디오 원데이 클래스로 입문해도 좋아요.",
      "matchPoints": ["요리에 관심 있는 분", "새 레시피 도전 좋아하는 분", "맛있는 거 만드는 게 즐거운 분", "결과물 먹을 수 있어서 좋은 분"]
    },
    {
      "name": "게임/보드게임",
      "emoji": "🎮",
      "desc": "재미있게 시간 순삭!",
      "condition": { "focus": "high", "social": "high" },
      "mood": "excited",
      "color": "bg-indigo-600",
      "interpretation": "집중력도 좋고 함께 즐기는 것도 좋아하는 당신! 게임은 혼자도 좋고, 온라인으로 친구들과 함께해도 좋아요. 보드게임은 가족이나 친구와 함께 하면 더 재밌죠.",
      "guide": "PC/콘솔 게임, 모바일 게임, 보드게임 중 선호하는 것으로! 디스코드로 친구들과 게임하면 집콕도 외롭지 않아요. 2인 보드게임도 많아요!",
      "matchPoints": ["게임 좋아하는 분", "시간 가는 줄 모르고 싶은 분", "친구들과 함께 즐기고 싶은 분", "경쟁/협동 좋아하는 분"]
    },
    {
      "name": "영화/드라마 정주행",
      "emoji": "🎬",
      "desc": "침대에 누워서 몰아보기!",
      "condition": { "focus": "high", "active": "low", "creative": "low" },
      "mood": "happy",
      "color": "bg-slate-700",
      "interpretation": "푹 쉬면서 영화나 드라마에 빠져드는 것이 당신의 힐링! 넷플릭스, 디즈니+, 왓챠 등 OTT에서 정주행할 작품을 찾아보세요. 영화는 하루에 2-3편도 OK!",
      "guide": "워치리스트 만들어두고 하나씩 정복해보세요! SNS에서 추천받거나 평점 높은 작품 위주로. 간식과 함께 하면 더 완벽해요!",
      "matchPoints": ["영화/드라마 좋아하는 분", "편하게 쉬고 싶은 분", "스토리에 빠져드는 분", "OTT 구독 중인 분"]
    },
    {
      "name": "독서/오디오북",
      "emoji": "📚",
      "desc": "책 속으로 떠나는 여행",
      "condition": { "focus": "high", "learning": "high", "social": "low" },
      "mood": "happy",
      "color": "bg-amber-700",
      "interpretation": "조용히 혼자만의 시간에 책을 읽는 것이 최고의 힐링! 종이책, 전자책, 오디오북 등 다양한 방법으로 독서를 즐길 수 있어요. 소설, 에세이, 자기계발 등 장르도 다양하죠.",
      "guide": "한 달에 책 2-3권 목표로 시작해보세요! 밀리의서재, 리디북스 등 구독 서비스도 좋아요. 독서 기록 앱으로 읽은 책 정리하면 뿌듯해요!",
      "matchPoints": ["책 읽기 좋아하는 분", "조용히 집중하는 게 좋은 분", "배움을 즐기는 분", "혼자만의 시간이 소중한 분"]
    },
    {
      "name": "온라인 강의/스터디",
      "emoji": "💻",
      "desc": "집에서 배움의 즐거움!",
      "condition": { "learning": "high", "focus": "high" },
      "mood": "cool",
      "color": "bg-blue-600",
      "interpretation": "배움에 대한 열정이 넘치는 당신! 집콕하면서 새로운 기술을 배워보세요. 코딩, 언어, 디자인, 악기 등 온라인으로 배울 수 있는 것이 정말 많아요.",
      "guide": "클래스101, 탈잉, Udemy, Coursera 등 다양한 플랫폼이 있어요. 목표를 정하고 꾸준히! 배운 것을 SNS에 공유하면 동기부여도 돼요.",
      "matchPoints": ["새로운 것 배우기 좋아하는 분", "자기계발에 관심 있는 분", "시간 활용 잘하고 싶은 분", "스킬업 목표가 있는 분"]
    },
    {
      "name": "퍼즐/레고",
      "emoji": "🧩",
      "desc": "조각 맞추는 몰입의 쾌감!",
      "condition": { "focus": "high", "creative": "medium", "social": "low" },
      "mood": "cool",
      "color": "bg-green-600",
      "interpretation": "하나씩 맞춰가는 과정에서 몰입하는 즐거움! 퍼즐이나 레고는 완성했을 때 뿌듯함도 크고, 인테리어 소품으로도 좋아요. 시간 가는 줄 모르고 빠져들게 될 거예요.",
      "guide": "퍼즐은 500-1000피스부터, 레고는 관심 있는 테마로 시작! 완성 후 액자나 전시로 인테리어 활용도 가능해요. 나노블럭도 추천!",
      "matchPoints": ["조립하는 것 좋아하는 분", "집중력 좋은 분", "완성작 전시하고 싶은 분", "혼자 몰입하는 게 좋은 분"]
    },
    {
      "name": "가드닝/플랜테리어",
      "emoji": "🌱",
      "desc": "집에서 키우는 작은 정원",
      "condition": { "creative": "medium", "focus": "medium", "learning": "medium" },
      "mood": "happy",
      "color": "bg-green-500",
      "interpretation": "식물과 함께하는 집콕! 가드닝은 돌보는 즐거움과 성장하는 기쁨을 동시에 느낄 수 있어요. 초보자도 쉽게 키울 수 있는 식물부터 시작해보세요.",
      "guide": "몬스테라, 스투키, 행운목 등 초보 친화 식물로 시작! 물주기 앱 활용하면 편해요. 테라리움이나 수경재배도 재밌어요.",
      "matchPoints": ["식물 키우기 관심 있는 분", "돌보는 게 즐거운 분", "인테리어도 신경 쓰는 분", "생명 성장 보는 게 좋은 분"]
    },
    {
      "name": "음악/악기",
      "emoji": "🎸",
      "desc": "집에서 연주하는 나만의 콘서트",
      "condition": { "creative": "high", "learning": "high", "focus": "high" },
      "mood": "excited",
      "color": "bg-purple-600",
      "interpretation": "창작욕과 배움욕이 넘치는 당신에게 악기 연습이 딱! 기타, 우쿨렐레, 피아노, 칼림바 등 집에서 즐길 수 있는 악기가 많아요. 혼자 연주하는 즐거움을 느껴보세요.",
      "guide": "초보자는 우쿨렐레나 칼림바로 시작 추천! 유튜브 레슨 영상이 많아요. 디지털 피아노는 헤드폰 연결하면 층간소음 걱정 없어요!",
      "matchPoints": ["악기 연주에 관심 있는 분", "음악을 좋아하는 분", "새로운 취미 도전하고 싶은 분", "혼자 연습하는 게 편한 분"]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.homeStyle = homeStyleData;
}
