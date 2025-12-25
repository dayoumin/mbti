// gameStyle 테스트 데이터 (게임 플레이 스타일 성격 테스트)
// 생성일: 2025-12-25

import type { SubjectData } from '../types';

export const gameStyleData: SubjectData = {
  "title": "게임 스타일 테스트",
  "subtitle": "당신의 게임 플레이 스타일은?",
  "themeColor": "bg-indigo-600",
  "icon": "GameStyleIcon",
  "testType": "personality",
  "dimensions": {
    "competitive": {
      "name": "경쟁심",
      "emoji": "🏆",
      "desc": "이기고 싶은 욕구"
    },
    "social": {
      "name": "사교성",
      "emoji": "👥",
      "desc": "함께 플레이하는 즐거움"
    },
    "explore": {
      "name": "탐험심",
      "emoji": "🗺️",
      "desc": "새로운 것을 찾는 호기심"
    },
    "patience": {
      "name": "끈기",
      "emoji": "💪",
      "desc": "어려운 것에 도전하는 힘"
    },
    "immerse": {
      "name": "몰입도",
      "emoji": "🎮",
      "desc": "게임에 빠져드는 정도"
    }
  },
  "questions": [
    {
      "q": "게임에서 지면 어떻게 하나요?",
      "dimension": "competitive",
      "a": [
        { "text": "다시 도전! 이길 때까지!", "score": 5 },
        { "text": "좀 쉬다가 다시 해요", "score": 3 },
        { "text": "지는 건 별로 신경 안 써요", "score": 1 }
      ]
    },
    {
      "q": "랭킹이나 순위에 대해 어떻게 생각하나요?",
      "dimension": "competitive",
      "a": [
        { "text": "상위권 가야 직성이 풀려요", "score": 5 },
        { "text": "중상위권이면 만족해요", "score": 3 },
        { "text": "순위? 그냥 재밌으면 돼요", "score": 1 }
      ]
    },
    {
      "q": "게임은 주로 어떻게 하나요?",
      "dimension": "social",
      "a": [
        { "text": "친구들이랑 같이!", "score": 5 },
        { "text": "온라인으로 모르는 사람들과도", "score": 3 },
        { "text": "혼자 조용히 하는 게 좋아요", "score": 1 }
      ]
    },
    {
      "q": "멀티플레이어 게임에서 팀플은?",
      "dimension": "social",
      "a": [
        { "text": "팀원들과 소통하며 전략 짜요", "score": 5 },
        { "text": "필요할 때만 대화해요", "score": 3 },
        { "text": "혼자 플레이 선호해요", "score": 1 }
      ]
    },
    {
      "q": "새 게임을 시작하면?",
      "dimension": "explore",
      "a": [
        { "text": "구석구석 다 돌아다녀요", "score": 5 },
        { "text": "메인 스토리 클리어 후 탐험", "score": 3 },
        { "text": "메인 스토리만 해요", "score": 1 }
      ]
    },
    {
      "q": "숨겨진 요소(히든 퀘스트, 이스터에그)에 대해?",
      "dimension": "explore",
      "a": [
        { "text": "꼭 다 찾아야 해요!", "score": 5 },
        { "text": "우연히 발견하면 좋죠", "score": 3 },
        { "text": "별로 관심 없어요", "score": 1 }
      ]
    },
    {
      "q": "어려운 보스전에서?",
      "dimension": "patience",
      "a": [
        { "text": "몇 시간이고 도전해요", "score": 5 },
        { "text": "5-10번 시도 후 공략 봐요", "score": 3 },
        { "text": "빨리 공략 보고 넘어가요", "score": 1 }
      ]
    },
    {
      "q": "반복 작업(파밍, 레벨업)에 대해?",
      "dimension": "patience",
      "a": [
        { "text": "묵묵히 해요, 성장하는 맛!", "score": 5 },
        { "text": "필요하면 하죠", "score": 3 },
        { "text": "지루해서 싫어요", "score": 1 }
      ]
    },
    {
      "q": "게임할 때 시간이 어떻게 가나요?",
      "dimension": "immerse",
      "a": [
        { "text": "벌써 새벽?! 시간 순삭", "score": 5 },
        { "text": "2-3시간 정도 해요", "score": 3 },
        { "text": "짧게 틈틈이 해요", "score": 1 }
      ]
    },
    {
      "q": "게임 스토리에 몰입하나요?",
      "dimension": "immerse",
      "a": [
        { "text": "캐릭터 감정이입 제대로!", "score": 5 },
        { "text": "어느 정도는요", "score": 3 },
        { "text": "스토리 스킵해요", "score": 1 }
      ]
    },
    {
      "q": "게임에서 PvP(대전) vs PvE(협동)?",
      "dimension": "competitive",
      "a": [
        { "text": "PvP! 사람 이겨야 재밌어요", "score": 5 },
        { "text": "둘 다 좋아요", "score": 3 },
        { "text": "PvE가 편해요", "score": 1 }
      ]
    },
    {
      "q": "게임 커뮤니티 활동은?",
      "dimension": "social",
      "a": [
        { "text": "디스코드, 공략글 활발히!", "score": 5 },
        { "text": "가끔 공략 참고해요", "score": 3 },
        { "text": "혼자 알아서 해요", "score": 1 }
      ]
    }
  ],
  "resultLabels": [
    {
      "name": "하드코어 챔피언",
      "emoji": "🏆",
      "desc": "승리만이 답! 진정한 승부사",
      "condition": { "competitive": "high", "patience": "high" },
      "mood": "excited",
      "color": "bg-red-600",
      "interpretation": "당신은 게임에서 지는 걸 못 참는 진정한 승부사예요! 어려운 도전도 끝까지 포기하지 않고, 실력을 갈고닦아 정상에 오르는 것이 목표죠. e스포츠 프로게이머 DNA가 있으신 분!",
      "guide": "경쟁 게임에서 빛나는 타입이에요. FPS, 격투게임, MOBA 등 실력이 중요한 게임을 추천! 단, 너무 스트레스받지 않게 가끔은 힐링 게임도 해보세요.",
      "matchPoints": ["경쟁 게임의 짜릿함을 아는 분", "실력 향상에 진심인 분", "어려울수록 불타오르는 분", "e스포츠를 즐겨 보는 분"]
    },
    {
      "name": "소셜 게이머",
      "emoji": "👥",
      "desc": "함께라서 즐거운 게임!",
      "condition": { "social": "high", "competitive": "medium" },
      "mood": "happy",
      "color": "bg-blue-500",
      "interpretation": "게임은 친구들과 함께해야 제맛! 디스코드 켜고 수다 떨면서 게임하는 게 최고의 힐링이죠. 혼자 하면 심심해서 금방 접게 되는 타입이에요.",
      "guide": "파티 게임, 협동 게임이 딱 맞아요! 오버쿡, 발로란트 팀전, 몬스터헌터 등 친구들과 함께하는 게임을 추천해요. 길드나 클랜 활동도 좋아요!",
      "matchPoints": ["친구들과 게임하는 게 행복한 분", "보이스챗 수다가 즐거운 분", "협동 플레이를 좋아하는 분", "게임 친구가 많은 분"]
    },
    {
      "name": "탐험가 모험러",
      "emoji": "🗺️",
      "desc": "세상의 모든 비밀을 찾아서",
      "condition": { "explore": "high", "immerse": "high" },
      "mood": "excited",
      "color": "bg-green-600",
      "interpretation": "게임 세계의 구석구석을 탐험하는 것이 즐거운 당신! 숨겨진 던전, 이스터에그, 히든 엔딩... 모든 것을 발견해야 직성이 풀려요. 100% 도전과제 완료가 목표!",
      "guide": "오픈월드 RPG가 천직이에요! 젤다, 엘든링, 스카이림 같은 게임에서 몇백 시간 녹일 수 있어요. 인디 게임의 숨겨진 명작 찾기도 추천!",
      "matchPoints": ["오픈월드에서 길을 잃는 게 즐거운 분", "도전과제 100%가 목표인 분", "숨겨진 요소 찾는 게 재밌는 분", "게임 세계관에 빠지는 분"]
    },
    {
      "name": "스토리텔러",
      "emoji": "📖",
      "desc": "게임 속 이야기에 감동받는 사람",
      "condition": { "immerse": "high", "competitive": "low" },
      "mood": "happy",
      "color": "bg-purple-500",
      "interpretation": "당신에게 게임은 또 하나의 드라마! 캐릭터에 감정이입하고, 스토리에 눈물 흘리기도 해요. 엔딩 크레딧이 올라갈 때 뿌듯함과 아쉬움이 공존하죠.",
      "guide": "스토리 중심 게임이 딱이에요! 라스트 오브 어스, 갓 오브 워, 페르소나 시리즈 추천. 비주얼 노벨이나 인디 스토리 게임도 좋아할 거예요.",
      "matchPoints": ["게임 스토리에 감동받는 분", "캐릭터에 애정을 쏟는 분", "엔딩 보고 여운이 남는 분", "게임도 예술이라 생각하는 분"]
    },
    {
      "name": "캐주얼 힐러",
      "emoji": "🌿",
      "desc": "편하게 즐기는 게 최고!",
      "condition": { "competitive": "low", "patience": "low" },
      "mood": "happy",
      "color": "bg-teal-400",
      "interpretation": "게임은 스트레스 받으려고 하는 게 아니잖아요? 편하게, 재밌게, 힐링하면서 즐기는 게 당신의 스타일! 어려우면 공략 보고, 지쳐도 OK.",
      "guide": "힐링 게임, 시뮬레이션이 딱이에요! 동물의 숲, 스타듀밸리, 포켓몬 같은 편안한 게임 추천. 모바일 퍼즐 게임도 좋아요!",
      "matchPoints": ["게임으로 힐링하는 분", "스트레스 없이 즐기고 싶은 분", "귀여운 게임을 좋아하는 분", "틈틈이 가볍게 하는 분"]
    },
    {
      "name": "전략의 달인",
      "emoji": "🧠",
      "desc": "머리 쓰는 게임이 진짜 게임!",
      "condition": { "patience": "high", "explore": "high", "competitive": "medium" },
      "mood": "cool",
      "color": "bg-slate-600",
      "interpretation": "당신은 두뇌 풀가동 게이머! 복잡한 시스템을 분석하고, 최적의 전략을 세우는 것이 즐거워요. 한 수 앞을 내다보는 쾌감을 아는 사람이죠.",
      "guide": "전략 시뮬레이션, 덱빌딩, 퍼즐이 딱이에요! 문명, 슬레이 더 스파이어, 팩토리오 같은 게임에서 시간이 순삭될 거예요.",
      "matchPoints": ["복잡한 시스템이 재밌는 분", "최적화를 추구하는 분", "계획 세우는 게 즐거운 분", "전략 게임 매니아"]
    },
    {
      "name": "올라운더 게이머",
      "emoji": "🎮",
      "desc": "모든 장르를 섭렵하는 진정한 게이머",
      "condition": { "social": "medium", "explore": "medium", "immerse": "medium" },
      "mood": "happy",
      "color": "bg-indigo-500",
      "interpretation": "장르 불문 다 즐기는 게임 잡식러! 친구들과 할 땐 멀티, 혼자 할 땐 싱글, 어떤 게임이든 적응하고 즐길 수 있어요. 게임에 대한 넓은 식견이 장점!",
      "guide": "다양한 장르를 골고루 즐겨보세요! 게임 구독 서비스(게임패스 등)가 딱이에요. 새로운 게임 도전을 두려워하지 마세요!",
      "matchPoints": ["장르 안 가리는 분", "새 게임 도전을 즐기는 분", "상황에 맞게 게임 고르는 분", "게임 전반에 관심 많은 분"]
    },
    {
      "name": "솔로 장인",
      "emoji": "🎯",
      "desc": "나만의 세계에서 집중!",
      "condition": { "social": "low", "immerse": "high", "patience": "high" },
      "mood": "cool",
      "color": "bg-gray-700",
      "interpretation": "혼자 조용히 게임에 집중하는 것이 좋은 당신! 자신만의 페이스로 천천히, 꼼꼼히 플레이하며 게임 세계에 온전히 빠져들어요.",
      "guide": "싱글 플레이어 명작이 딱이에요! 다크소울, 홀로우나이트, 위쳐3 같은 게임에서 자신만의 시간을 보내세요. 인디 게임 발굴도 추천!",
      "matchPoints": ["혼자 게임하는 게 편한 분", "자기 페이스가 중요한 분", "깊이 있는 플레이를 즐기는 분", "싱글 게임 마니아"]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.CHEMI_SUBJECTS = window.CHEMI_SUBJECTS || {};
  window.CHEMI_SUBJECTS.gameStyle = gameStyleData;
}
