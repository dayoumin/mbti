/**
 * 토끼/햄스터 Subject 추가 스크립트
 * - 학술 기반 차원 설계
 * - 토끼: Rabbit Behavior Assessment 연구 기반
 * - 햄스터: Small Mammal Behavior 연구 기반
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data.js');

// 토끼 데이터
const rabbitData = {
    title: "토끼 맘 테스트",
    subtitle: "우리 토끼 성향은?",
    themeColor: "bg-[#FFB6C1]",
    icon: "RabbitFace",
    dimensions: {
        curious: {
            name: "호기심",
            emoji: "🔍",
            desc: "새로운 것에 대한 탐구심"
        },
        social: {
            name: "사교성",
            emoji: "💕",
            desc: "사람/동물과의 친밀도"
        },
        active: {
            name: "활동성",
            emoji: "🏃",
            desc: "움직임과 놀이 선호도"
        },
        brave: {
            name: "담력",
            emoji: "🦁",
            desc: "낯선 상황에 대한 대담함"
        },
        chill: {
            name: "느긋함",
            emoji: "😌",
            desc: "스트레스 관리 능력"
        }
    },
    questions: [
        // curious (호기심) - 기본 3개
        {
            q: "새로운 장난감을 케이지에 넣어주면?",
            dimension: "curious",
            a: [
                { text: "바로 다가가서 코로 킁킁 탐색한다", score: 5 },
                { text: "멀리서 지켜보다가 나중에 확인한다", score: 1 }
            ]
        },
        {
            q: "집안에서 처음 가보는 공간을 발견하면?",
            dimension: "curious",
            a: [
                { text: "신나서 구석구석 돌아다닌다", score: 5 },
                { text: "익숙한 곳으로 돌아가려 한다", score: 1 }
            ]
        },
        {
            q: "낯선 소리가 들리면?",
            dimension: "curious",
            a: [
                { text: "귀를 쫑긋 세우고 소리 방향을 확인한다", score: 5 },
                { text: "숨거나 움츠러든다", score: 1 }
            ]
        },
        // social (사교성) - 기본 3개
        {
            q: "주인이 손을 내밀면?",
            dimension: "social",
            a: [
                { text: "다가와서 손 냄새를 맡거나 핥는다", score: 5 },
                { text: "피하거나 무시한다", score: 1 }
            ]
        },
        {
            q: "쓰다듬어 주려고 하면?",
            dimension: "social",
            a: [
                { text: "가만히 있거나 더 기대온다", score: 5 },
                { text: "피하려고 한다", score: 1 }
            ]
        },
        {
            q: "다른 반려동물(토끼/고양이 등)을 만나면?",
            dimension: "social",
            a: [
                { text: "관심을 보이며 다가간다", score: 5 },
                { text: "경계하거나 도망간다", score: 1 }
            ]
        },
        // active (활동성) - 기본 2개
        {
            q: "케이지 밖으로 나오면 주로?",
            dimension: "active",
            a: [
                { text: "신나게 뛰어다니고 빙키(점프)한다", score: 5 },
                { text: "한 곳에 앉아서 쉰다", score: 1 }
            ]
        },
        {
            q: "저녁 시간대 토끼의 모습은?",
            dimension: "active",
            a: [
                { text: "활발하게 움직이며 놀아달라 한다", score: 5 },
                { text: "조용히 휴식을 취한다", score: 1 }
            ]
        },
        // brave (담력) - 기본 2개
        {
            q: "갑자기 큰 소리가 나면?",
            dimension: "brave",
            a: [
                { text: "잠깐 멈추고 다시 하던 일을 한다", score: 5 },
                { text: "숨거나 발을 쿵쿵 구른다", score: 1 }
            ]
        },
        {
            q: "처음 보는 사람이 방문하면?",
            dimension: "brave",
            a: [
                { text: "호기심을 가지고 다가간다", score: 5 },
                { text: "숨거나 경계한다", score: 1 }
            ]
        },
        // chill (느긋함) - 기본 2개
        {
            q: "안아주려고 하면?",
            dimension: "chill",
            a: [
                { text: "차분하게 안겨 있는다", score: 5 },
                { text: "발버둥 치며 내려가려 한다", score: 1 }
            ]
        },
        {
            q: "평소 토끼의 모습은?",
            dimension: "chill",
            a: [
                { text: "편안하게 옆으로 누워 있거나 늘어져 있다", score: 5 },
                { text: "항상 긴장하고 주변을 살핀다", score: 1 }
            ]
        }
    ],
    questions_deep: [
        // curious 심화
        { q: "새로운 야채를 처음 주면?", dimension: "curious", a: [{ text: "일단 맛본다", score: 5 }, { text: "익숙한 것만 먹는다", score: 1 }] },
        { q: "방 구조를 바꾸면?", dimension: "curious", a: [{ text: "바뀐 곳을 열심히 탐색한다", score: 5 }, { text: "혼란스러워한다", score: 1 }] },
        { q: "새로운 건초 종류를 주면?", dimension: "curious", a: [{ text: "호기심 있게 시도한다", score: 5 }, { text: "기존 건초만 먹는다", score: 1 }] },
        { q: "창문 밖 새소리가 들리면?", dimension: "curious", a: [{ text: "귀 세우고 관심을 보인다", score: 5 }, { text: "무관심하다", score: 1 }] },
        // social 심화
        { q: "여러 명이 집에 있을 때?", dimension: "social", a: [{ text: "돌아다니며 각자에게 관심을 보인다", score: 5 }, { text: "주인 곁에만 있는다", score: 1 }] },
        { q: "주인이 바닥에 누우면?", dimension: "social", a: [{ text: "옆에 와서 같이 눕는다", score: 5 }, { text: "관심 없다", score: 1 }] },
        { q: "주인이 우울해 보이면?", dimension: "social", a: [{ text: "다가와서 코를 킁킁거린다", score: 5 }, { text: "평소와 같다", score: 1 }] },
        { q: "손에 간식이 있으면?", dimension: "social", a: [{ text: "손에서 직접 받아먹는다", score: 5 }, { text: "바닥에 놓아야 먹는다", score: 1 }] },
        // active 심화
        { q: "놀이 시간에 터널을 주면?", dimension: "active", a: [{ text: "신나게 통과하며 논다", score: 5 }, { text: "관심 없다", score: 1 }] },
        { q: "아침에 일어나면?", dimension: "active", a: [{ text: "케이지 안에서 뛰어다닌다", score: 5 }, { text: "조용히 건초를 먹는다", score: 1 }] },
        { q: "공이나 장난감을 주면?", dimension: "active", a: [{ text: "코로 밀며 논다", score: 5 }, { text: "무시한다", score: 1 }] },
        { q: "밤늦은 시간에는?", dimension: "active", a: [{ text: "여전히 활동적이다", score: 5 }, { text: "조용히 쉰다", score: 1 }] },
        // brave 심화
        { q: "청소기 소리가 나면?", dimension: "brave", a: [{ text: "신경 쓰지 않는다", score: 5 }, { text: "패닉 상태가 된다", score: 1 }] },
        { q: "발톱 깎을 때?", dimension: "brave", a: [{ text: "비교적 차분하다", score: 5 }, { text: "격하게 저항한다", score: 1 }] },
        { q: "차를 타고 이동하면?", dimension: "brave", a: [{ text: "금방 적응한다", score: 5 }, { text: "매우 불안해한다", score: 1 }] },
        { q: "낯선 환경(병원 등)에 가면?", dimension: "brave", a: [{ text: "주변을 살피며 적응한다", score: 5 }, { text: "계속 떨거나 숨으려 한다", score: 1 }] },
        // chill 심화
        { q: "주인이 TV를 크게 틀어도?", dimension: "chill", a: [{ text: "편하게 쉰다", score: 5 }, { text: "불안해한다", score: 1 }] },
        { q: "케이지 청소 중일 때?", dimension: "chill", a: [{ text: "신경 쓰지 않는다", score: 5 }, { text: "스트레스 받아한다", score: 1 }] },
        { q: "사진 찍으려고 하면?", dimension: "chill", a: [{ text: "가만히 있어준다", score: 5 }, { text: "피한다", score: 1 }] },
        { q: "손톱 정리나 그루밍 중?", dimension: "chill", a: [{ text: "편안하게 받아들인다", score: 5 }, { text: "싫어한다", score: 1 }] }
    ],
    resultLabels: [
        {
            name: "탐험가 토끼",
            emoji: "🗺️",
            desc: "호기심 만땅! 뭐든 궁금한 탐험가",
            condition: { curious: "high", social: "high", brave: "high" },
            interpretation: "호기심이 넘치고 사교적인 성격입니다. 새로운 것을 두려워하지 않고 적극적으로 탐색해요.",
            guide: "다양한 장난감과 탐색 공간을 제공해주세요. 새로운 경험을 좋아하니 안전한 범위에서 탐험 기회를 주세요.",
            mood: "excited",
            color: "bg-yellow-100"
        },
        {
            name: "애교쟁이 토끼",
            emoji: "🥰",
            desc: "사람 좋아! 스킨십 최고!",
            condition: { social: "high", chill: "high" },
            interpretation: "사람과의 교감을 즐기는 다정한 성격입니다. 스킨십을 좋아하고 주인 곁에 있는 걸 좋아해요.",
            guide: "많은 애정과 스킨십을 주세요. 혼자 두는 시간이 길면 외로워할 수 있어요.",
            mood: "happy",
            color: "bg-pink-100"
        },
        {
            name: "액티브 토끼",
            emoji: "🏃",
            desc: "뛰고 뛰고 또 뛰고! 빙키 마스터",
            condition: { active: "high", brave: "high" },
            interpretation: "에너지가 넘치고 활동적인 성격입니다. 놀이 시간을 정말 좋아하고 빙키(기쁨 점프)를 자주 해요.",
            guide: "충분한 운동 공간과 놀이 시간을 제공해주세요. 터널, 공 등 다양한 장난감이 좋아요.",
            mood: "excited",
            color: "bg-green-100"
        },
        {
            name: "신중한 토끼",
            emoji: "🤔",
            desc: "일단 지켜본다... 안전 제일!",
            condition: { curious: "low", brave: "low" },
            interpretation: "조심성이 많고 신중한 성격입니다. 새로운 것에 시간을 두고 천천히 적응해요.",
            guide: "급격한 환경 변화를 피하고 천천히 새로운 것을 소개해주세요. 숨을 공간을 항상 제공해주세요.",
            mood: "sad",
            color: "bg-blue-100"
        },
        {
            name: "독립적인 토끼",
            emoji: "😎",
            desc: "나는 나! 쿨한 마이웨이",
            condition: { social: "low", chill: "high" },
            interpretation: "독립적이고 자기만의 시간을 중요시하는 성격입니다. 스킨십보다는 자유를 선호해요.",
            guide: "억지 스킨십은 피하고 토끼가 다가올 때까지 기다려주세요. 개인 공간을 존중해주세요.",
            mood: "cool",
            color: "bg-purple-100"
        },
        {
            name: "겁쟁이 토끼",
            emoji: "🐰",
            desc: "무서워... 조용히 해줘...",
            condition: { brave: "low", chill: "low" },
            interpretation: "예민하고 겁이 많은 성격입니다. 조용하고 안정적인 환경을 좋아해요.",
            guide: "갑작스러운 소리나 움직임을 피해주세요. 안전한 숨을 공간과 일관된 루틴이 중요해요.",
            mood: "sad",
            color: "bg-gray-100"
        },
        {
            name: "사색가 토끼",
            emoji: "📚",
            desc: "조용히 생각 중... 철학 토끼",
            condition: { active: "low", chill: "high" },
            interpretation: "차분하고 조용한 성격입니다. 활동적이기보다는 편안히 쉬는 것을 좋아해요.",
            guide: "편안한 휴식 공간을 만들어주세요. 억지로 놀게 하지 말고 토끼의 페이스를 존중해주세요.",
            mood: "happy",
            color: "bg-indigo-100"
        },
        {
            name: "밸런스 토끼",
            emoji: "⚖️",
            desc: "모든 면에서 균형 잡힌 이상적인 토끼",
            condition: { curious: "medium", social: "medium", active: "medium", brave: "medium", chill: "medium" },
            interpretation: "균형 잡힌 성격으로 다양한 상황에 잘 적응합니다. 키우기 편한 성격이에요.",
            guide: "현재 환경을 유지하면서 다양한 경험을 조금씩 제공해주세요.",
            mood: "happy",
            color: "bg-teal-100"
        }
    ]
};

// 햄스터 데이터
const hamsterData = {
    title: "햄스터 맘 테스트",
    subtitle: "우리 햄찌 성향은?",
    themeColor: "bg-[#F4A460]",
    icon: "HamsterFace",
    dimensions: {
        curious: {
            name: "탐험심",
            emoji: "🔎",
            desc: "새로운 것에 대한 호기심"
        },
        hoard: {
            name: "저장욕",
            emoji: "🥜",
            desc: "먹이를 모으려는 본능"
        },
        active: {
            name: "활동량",
            emoji: "🎡",
            desc: "쳇바퀴 러닝, 움직임 정도"
        },
        tame: {
            name: "친밀도",
            emoji: "🤝",
            desc: "사람에 대한 길들여짐"
        },
        nocturnal: {
            name: "야행성",
            emoji: "🌙",
            desc: "밤 활동 선호도"
        }
    },
    questions: [
        // curious (탐험심) - 기본 3개
        {
            q: "케이지에 새로운 물건을 넣어주면?",
            dimension: "curious",
            a: [
                { text: "바로 다가가서 냄새 맡고 탐색한다", score: 5 },
                { text: "경계하며 거리를 둔다", score: 1 }
            ]
        },
        {
            q: "햄스터 볼에 넣어주면?",
            dimension: "curious",
            a: [
                { text: "신나게 굴리며 탐험한다", score: 5 },
                { text: "움직이지 않고 가만히 있다", score: 1 }
            ]
        },
        {
            q: "손바닥 위에 올려놓으면?",
            dimension: "curious",
            a: [
                { text: "손가락 사이를 탐색한다", score: 5 },
                { text: "도망가려 한다", score: 1 }
            ]
        },
        // hoard (저장욕) - 기본 2개
        {
            q: "먹이를 주면?",
            dimension: "hoard",
            a: [
                { text: "볼주머니에 가득 채워 집으로 간다", score: 5 },
                { text: "그 자리에서 바로 먹는다", score: 1 }
            ]
        },
        {
            q: "간식을 여러 개 주면?",
            dimension: "hoard",
            a: [
                { text: "최대한 많이 볼에 넣으려 한다", score: 5 },
                { text: "하나씩 먹는다", score: 1 }
            ]
        },
        // active (활동량) - 기본 3개
        {
            q: "쳇바퀴를 얼마나 돌리나요?",
            dimension: "active",
            a: [
                { text: "밤새 돌린다! 소리가 들릴 정도", score: 5 },
                { text: "가끔 돌리거나 안 탄다", score: 1 }
            ]
        },
        {
            q: "케이지 밖으로 나오면?",
            dimension: "active",
            a: [
                { text: "쉬지 않고 돌아다닌다", score: 5 },
                { text: "한 곳에 머무른다", score: 1 }
            ]
        },
        {
            q: "케이지 안에서 주로?",
            dimension: "active",
            a: [
                { text: "이리저리 움직이며 활동한다", score: 5 },
                { text: "집 안에서 자고 있다", score: 1 }
            ]
        },
        // tame (친밀도) - 기본 2개
        {
            q: "손을 케이지에 넣으면?",
            dimension: "tame",
            a: [
                { text: "다가와서 냄새 맡거나 올라온다", score: 5 },
                { text: "도망가거나 숨는다", score: 1 }
            ]
        },
        {
            q: "이름을 부르면?",
            dimension: "tame",
            a: [
                { text: "반응하며 다가온다", score: 5 },
                { text: "반응이 없다", score: 1 }
            ]
        },
        // nocturnal (야행성) - 기본 2개
        {
            q: "낮 시간에는 주로?",
            dimension: "nocturnal",
            a: [
                { text: "깊이 자고 있다", score: 5 },
                { text: "가끔 활동한다", score: 1 }
            ]
        },
        {
            q: "밤 10시 이후에는?",
            dimension: "nocturnal",
            a: [
                { text: "쳇바퀴 소리가 들릴 정도로 활동적", score: 5 },
                { text: "조용히 쉬고 있다", score: 1 }
            ]
        }
    ],
    questions_deep: [
        // curious 심화
        { q: "새로운 베딩 종류를 깔아주면?", dimension: "curious", a: [{ text: "파헤치며 탐색한다", score: 5 }, { text: "불편해한다", score: 1 }] },
        { q: "터널을 넣어주면?", dimension: "curious", a: [{ text: "바로 들어가서 탐험한다", score: 5 }, { text: "관심 없다", score: 1 }] },
        { q: "새로운 간식을 주면?", dimension: "curious", a: [{ text: "일단 맛본다", score: 5 }, { text: "익숙한 것만 먹는다", score: 1 }] },
        { q: "케이지 레이아웃을 바꾸면?", dimension: "curious", a: [{ text: "바뀐 환경을 탐색한다", score: 5 }, { text: "스트레스 받아한다", score: 1 }] },
        // hoard 심화
        { q: "씨앗류를 주면?", dimension: "hoard", a: [{ text: "볼이 터질 듯 저장한다", score: 5 }, { text: "적당히 먹는다", score: 1 }] },
        { q: "집 안을 들여다보면?", dimension: "hoard", a: [{ text: "음식 저장소가 가득하다", score: 5 }, { text: "별로 쌓아두지 않는다", score: 1 }] },
        { q: "화장실 모래를 갈아주면?", dimension: "hoard", a: [{ text: "음식을 다시 옮겨 저장한다", score: 5 }, { text: "신경 쓰지 않는다", score: 1 }] },
        // active 심화
        { q: "플레이펜에서 놀 때?", dimension: "active", a: [{ text: "계속 뛰어다닌다", score: 5 }, { text: "금방 지친다", score: 1 }] },
        { q: "모래 목욕을 시켜주면?", dimension: "active", a: [{ text: "신나게 뒹군다", score: 5 }, { text: "관심 없다", score: 1 }] },
        { q: "케이지 철망을 오르려 하나요?", dimension: "active", a: [{ text: "자주 오른다", score: 5 }, { text: "안 오른다", score: 1 }] },
        { q: "파헤치기 놀이를?", dimension: "active", a: [{ text: "정말 좋아한다", score: 5 }, { text: "별로 안 한다", score: 1 }] },
        // tame 심화
        { q: "간식을 손에 들고 있으면?", dimension: "tame", a: [{ text: "손에서 받아먹는다", score: 5 }, { text: "손을 피한다", score: 1 }] },
        { q: "핸들링(손에 올리기)할 때?", dimension: "tame", a: [{ text: "편안해한다", score: 5 }, { text: "도망가려 한다", score: 1 }] },
        { q: "케이지 문을 열면?", dimension: "tame", a: [{ text: "다가와서 올라오려 한다", score: 5 }, { text: "무관심하다", score: 1 }] },
        { q: "건드리면?", dimension: "tame", a: [{ text: "물지 않는다", score: 5 }, { text: "물 수 있다", score: 1 }] },
        // nocturnal 심화
        { q: "저녁 식사 시간쯤?", dimension: "nocturnal", a: [{ text: "일어나기 시작한다", score: 5 }, { text: "아직 자고 있다", score: 1 }] },
        { q: "새벽 시간에?", dimension: "nocturnal", a: [{ text: "가장 활발하다", score: 5 }, { text: "조용하다", score: 1 }] },
        { q: "낮에 깨우면?", dimension: "nocturnal", a: [{ text: "짜증내며 다시 잔다", score: 5 }, { text: "일어난다", score: 1 }] }
    ],
    resultLabels: [
        {
            name: "탐험가 햄찌",
            emoji: "🗺️",
            desc: "호기심 폭발! 모든 게 궁금해",
            condition: { curious: "high", active: "high" },
            interpretation: "호기심이 넘치고 활동적인 성격입니다. 새로운 것을 발견하면 바로 탐색해요.",
            guide: "다양한 장난감과 터널, 은신처를 제공해주세요. 탐험할 수 있는 안전한 공간도 좋아요.",
            mood: "excited",
            color: "bg-yellow-100"
        },
        {
            name: "수집왕 햄찌",
            emoji: "🥜",
            desc: "볼주머니 가득! 저장의 달인",
            condition: { hoard: "high" },
            interpretation: "저장 본능이 강한 햄스터입니다. 먹이를 모으는 것에 큰 기쁨을 느껴요.",
            guide: "숨길 수 있는 다양한 간식을 주세요. 저장할 공간도 충분히 제공해주세요.",
            mood: "happy",
            color: "bg-orange-100"
        },
        {
            name: "쳇바퀴 마스터",
            emoji: "🎡",
            desc: "뛴다! 뛴다! 밤새 러닝",
            condition: { active: "high", nocturnal: "high" },
            interpretation: "밤에 특히 활동적인 에너자이저입니다. 쳇바퀴 러닝을 정말 좋아해요.",
            guide: "조용한 쳇바퀴를 제공하고 밤 활동을 방해하지 마세요. 충분한 운동이 건강에 중요해요.",
            mood: "excited",
            color: "bg-green-100"
        },
        {
            name: "인싸 햄찌",
            emoji: "🤝",
            desc: "사람 좋아! 친근한 성격",
            condition: { tame: "high", curious: "high" },
            interpretation: "사람을 잘 따르고 친근한 성격입니다. 핸들링에도 잘 적응해요.",
            guide: "자주 교감하고 손에 올려 놀아주세요. 신뢰 관계가 잘 형성되어 있어요.",
            mood: "happy",
            color: "bg-pink-100"
        },
        {
            name: "수줍음쟁이 햄찌",
            emoji: "🙈",
            desc: "조심조심... 천천히 다가와",
            condition: { tame: "low", curious: "low" },
            interpretation: "겁이 많고 조심스러운 성격입니다. 신뢰를 쌓는 데 시간이 필요해요.",
            guide: "억지로 만지지 말고 천천히 신뢰를 쌓아주세요. 간식으로 유대감을 형성하세요.",
            mood: "sad",
            color: "bg-blue-100"
        },
        {
            name: "낮잠왕 햄찌",
            emoji: "😴",
            desc: "낮엔 자야지... zzZ",
            condition: { nocturnal: "high", active: "low" },
            interpretation: "확실한 야행성으로 낮에는 깊이 잠들어 있어요. 밤에 조금씩 활동합니다.",
            guide: "낮에 깨우지 마세요. 밤 활동 시간을 존중해주는 것이 중요해요.",
            mood: "happy",
            color: "bg-indigo-100"
        },
        {
            name: "균형잡힌 햄찌",
            emoji: "⚖️",
            desc: "모든 면에서 균형 잡힌 이상적인 햄스터",
            condition: { curious: "medium", hoard: "medium", active: "medium", tame: "medium", nocturnal: "medium" },
            interpretation: "균형 잡힌 성격으로 다양한 상황에 잘 적응합니다. 키우기 편한 성격이에요.",
            guide: "현재 환경을 유지하면서 꾸준히 교감해주세요.",
            mood: "happy",
            color: "bg-teal-100"
        },
        {
            name: "미스터리 햄찌",
            emoji: "🎭",
            desc: "예측불가! 매력적인 반전",
            condition: { curious: "medium", active: "medium" },
            interpretation: "다양한 면을 가진 매력적인 성격입니다. 때에 따라 다른 모습을 보여줘요.",
            guide: "햄스터의 다양한 성격을 관찰하고 즐겨주세요. 유연하게 대응하는 것이 좋아요.",
            mood: "cool",
            color: "bg-purple-100"
        }
    ]
};

// SUBJECT_CONFIG에 추가할 내용
const newSubjectConfigs = `
    rabbit: {
        icon: "RabbitFace",
        label: "토끼",
        intro: ["탐험가 토끼?", "애교쟁이 토끼?", "독립적인 토끼?"],
        resultFormat: "tabs",
        deepButtonText: "우리 토끼"
    },
    hamster: {
        icon: "HamsterFace",
        label: "햄스터",
        intro: ["쳇바퀴 마스터?", "수집왕 햄찌?", "인싸 햄찌?"],
        resultFormat: "tabs",
        deepButtonText: "우리 햄찌"
    }`;

// data.js 읽기
let content = fs.readFileSync(dataPath, 'utf-8');

// 이미 rabbit이나 hamster가 있는지 확인
if (content.includes('"rabbit"') || content.includes("'rabbit'") || content.includes('rabbit:')) {
    console.log('⚠️  rabbit 또는 hamster가 이미 존재합니다.');
    process.exit(0);
}

// 1. CHEMI_DATA에 rabbit, hamster 추가
// dog: { ... } 다음에 추가
const dogEndPattern = /(\s*dog:\s*\{[\s\S]*?\n\s*\})\s*\n(\};)/;
const match = content.match(dogEndPattern);

if (!match) {
    console.error('❌ dog 데이터의 끝을 찾을 수 없습니다.');
    process.exit(1);
}

const rabbitStr = JSON.stringify(rabbitData, null, 8).replace(/^/gm, '    ').trim();
const hamsterStr = JSON.stringify(hamsterData, null, 8).replace(/^/gm, '    ').trim();

content = content.replace(
    dogEndPattern,
    `$1,\n    rabbit: ${rabbitStr},\n    hamster: ${hamsterStr}\n$2`
);

// 2. SUBJECT_CONFIG에 rabbit, hamster 추가
const configEndPattern = /(deepButtonText:\s*"우리 멍이"\s*\n\s*\})\s*\n(\};)/;
content = content.replace(
    configEndPattern,
    `$1,${newSubjectConfigs}\n$2`
);

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf-8');

console.log('✅ 토끼/햄스터 데이터 추가 완료!');
console.log('');
console.log('추가된 내용:');
console.log('  - rabbit: 5차원, 기본 12문항, 심화 20문항');
console.log('  - hamster: 5차원, 기본 12문항, 심화 17문항');
console.log('');
console.log('다음 단계: node scripts/validate-questions.mjs');
