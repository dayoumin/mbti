/**
 * 연애 이상형 테스트 데이터 추가 스크립트
 *
 * 학술 근거:
 * - Sternberg 삼각 이론 (1986): passion, commitment
 * - 애착 이론 (Hazan & Shaver, 1987): close
 * - 5 Love Languages (Chapman, 1992): express, active
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data.js');

console.log('💕 연애 이상형 테스트 데이터 추가\n');

// 이상형 테스트 데이터
const idealTypeData = {
    title: "연애 이상형 테스트",
    subtitle: "나의 이상형은 어떤 사람일까?",
    themeColor: "pink",
    icon: "HeartIcon",
    testType: "matching",  // 새로운 테스트 타입
    dimensions: {
        passion: { name: "열정", emoji: "🔥", desc: "연애 온도" },
        commit: { name: "헌신", emoji: "💍", desc: "관계 진지도" },
        close: { name: "친밀", emoji: "🤗", desc: "밀착 정도" },
        express: { name: "표현", emoji: "💬", desc: "감정 표현" },
        active: { name: "활동", emoji: "🎯", desc: "데이트 스타일" }
    },
    questions: [
        // passion (열정) - 3개
        {
            q: "연인에게 받고 싶은 연락 빈도는?",
            dimension: "passion",
            a: [
                { text: "수시로! 뭐해? 밥 먹었어?", score: 5 },
                { text: "필요할 때만 하면 돼", score: 1 }
            ]
        },
        {
            q: "기념일에 대한 생각은?",
            dimension: "passion",
            a: [
                { text: "100일, 200일... 다 챙기고 싶어!", score: 5 },
                { text: "생일이랑 연말 정도면 충분해", score: 1 }
            ]
        },
        {
            q: "연인과 함께하는 시간이...",
            dimension: "passion",
            a: [
                { text: "매일매일 만나고 싶어!", score: 5 },
                { text: "적당히 만나는 게 좋아", score: 1 }
            ]
        },
        // commit (헌신) - 3개
        {
            q: "연애를 시작할 때 나는?",
            dimension: "commit",
            a: [
                { text: "미래까지 생각하고 시작해", score: 5 },
                { text: "일단 만나보고 결정해", score: 1 }
            ]
        },
        {
            q: "연인의 힘든 일에 대해...",
            dimension: "commit",
            a: [
                { text: "내 일처럼 함께 해결하고 싶어", score: 5 },
                { text: "응원은 하지만 각자의 일이야", score: 1 }
            ]
        },
        {
            q: "관계에서 가장 중요한 것은?",
            dimension: "commit",
            a: [
                { text: "서로를 향한 약속과 신뢰", score: 5 },
                { text: "지금 이 순간의 행복", score: 1 }
            ]
        },
        // close (친밀) - 2개
        {
            q: "연인과의 이상적인 거리감은?",
            dimension: "close",
            a: [
                { text: "붙어 다니는 커플이 좋아", score: 5 },
                { text: "적당한 거리가 필요해", score: 1 }
            ]
        },
        {
            q: "연인의 친구 모임에...",
            dimension: "close",
            a: [
                { text: "같이 가고 싶어! 다 알고 싶어", score: 5 },
                { text: "각자의 영역은 존중해줘", score: 1 }
            ]
        },
        // express (표현) - 2개
        {
            q: "사랑 표현 방식은?",
            dimension: "express",
            a: [
                { text: "\"사랑해\"를 자주 말하고 싶어", score: 5 },
                { text: "말보다 행동으로 보여줄래", score: 1 }
            ]
        },
        {
            q: "갈등이 생기면?",
            dimension: "express",
            a: [
                { text: "바로 대화로 풀고 싶어", score: 5 },
                { text: "시간을 두고 생각 정리 먼저", score: 1 }
            ]
        },
        // active (활동) - 2개
        {
            q: "이상적인 데이트는?",
            dimension: "active",
            a: [
                { text: "맛집, 카페, 영화... 밖으로!", score: 5 },
                { text: "집에서 넷플릭스가 최고", score: 1 }
            ]
        },
        {
            q: "주말 계획은?",
            dimension: "active",
            a: [
                { text: "새로운 곳 탐방하고 싶어", score: 5 },
                { text: "집에서 푹 쉬고 싶어", score: 1 }
            ]
        }
    ],
    questions_deep: [
        // passion 심화 - 4개
        {
            q: "연인이 바쁘다고 연락이 뜸하면?",
            dimension: "passion",
            a: [
                { text: "서운해... 짧게라도 연락해줬으면", score: 5 },
                { text: "이해해, 나중에 연락하겠지", score: 1 }
            ]
        },
        {
            q: "서프라이즈 이벤트에 대해?",
            dimension: "passion",
            a: [
                { text: "완전 좋아! 나도 해주고 싶어", score: 5 },
                { text: "부담스러워... 평범한 게 좋아", score: 1 }
            ]
        },
        {
            q: "첫 만남부터 설레는 느낌이...",
            dimension: "passion",
            a: [
                { text: "중요해! 그게 사랑의 시작이야", score: 5 },
                { text: "천천히 알아가도 괜찮아", score: 1 }
            ]
        },
        {
            q: "연인과 떨어져 있을 때?",
            dimension: "passion",
            a: [
                { text: "하루도 안 보면 보고 싶어", score: 5 },
                { text: "각자 시간도 필요하니까", score: 1 }
            ]
        },
        // commit 심화 - 4개
        {
            q: "연인의 가족을 만나는 것은?",
            dimension: "commit",
            a: [
                { text: "당연히 만나야지, 중요한 일이야", score: 5 },
                { text: "좀 더 친해진 다음에...", score: 1 }
            ]
        },
        {
            q: "연인과의 미래 계획을...",
            dimension: "commit",
            a: [
                { text: "구체적으로 이야기하고 싶어", score: 5 },
                { text: "그때 가서 생각하면 돼", score: 1 }
            ]
        },
        {
            q: "연인이 힘든 시기를 겪고 있다면?",
            dimension: "commit",
            a: [
                { text: "옆에서 끝까지 함께할 거야", score: 5 },
                { text: "응원하지만 해결은 스스로", score: 1 }
            ]
        },
        {
            q: "연애 중 다른 이성에게 관심이 간다면?",
            dimension: "commit",
            a: [
                { text: "절대 안 돼, 한 사람만!", score: 5 },
                { text: "감정은 어쩔 수 없지 않아?", score: 1 }
            ]
        },
        // close 심화 - 4개
        {
            q: "연인과 함께 사는 것은?",
            dimension: "close",
            a: [
                { text: "빨리 같이 살고 싶어!", score: 5 },
                { text: "결혼 전까지는 좀...", score: 1 }
            ]
        },
        {
            q: "연인의 SNS를 체크하는 것은?",
            dimension: "close",
            a: [
                { text: "당연히 봐야지! 궁금하니까", score: 5 },
                { text: "굳이? 사생활 존중해줘야지", score: 1 }
            ]
        },
        {
            q: "커플 아이템에 대해?",
            dimension: "close",
            a: [
                { text: "완전 좋아! 다 맞추고 싶어", score: 5 },
                { text: "굳이...? 부끄러워", score: 1 }
            ]
        },
        {
            q: "연인의 비밀번호를 아는 것은?",
            dimension: "close",
            a: [
                { text: "당연히 서로 알아야지", score: 5 },
                { text: "개인 영역은 존중해야 해", score: 1 }
            ]
        },
        // express 심화 - 4개
        {
            q: "연인이 속상해 보이면?",
            dimension: "express",
            a: [
                { text: "바로 물어봐야지, 왜 그래?", score: 5 },
                { text: "말할 때까지 기다려줄래", score: 1 }
            ]
        },
        {
            q: "기분이 안 좋을 때?",
            dimension: "express",
            a: [
                { text: "연인에게 바로 말해야 해", score: 5 },
                { text: "혼자 정리하고 나서 말할래", score: 1 }
            ]
        },
        {
            q: "연인에게 칭찬을...",
            dimension: "express",
            a: [
                { text: "매일매일 해주고 싶어", score: 5 },
                { text: "특별한 날에 해주면 되지", score: 1 }
            ]
        },
        {
            q: "스킨십에 대해?",
            dimension: "express",
            a: [
                { text: "손잡고 허그! 자주 하고 싶어", score: 5 },
                { text: "공공장소에선 자제하고 싶어", score: 1 }
            ]
        },
        // active 심화 - 4개
        {
            q: "여행 스타일은?",
            dimension: "active",
            a: [
                { text: "액티비티 가득! 알차게!", score: 5 },
                { text: "느긋하게 힐링 여행", score: 1 }
            ]
        },
        {
            q: "새로운 취미를...",
            dimension: "active",
            a: [
                { text: "같이 배워보고 싶어!", score: 5 },
                { text: "각자 좋아하는 거 하면 돼", score: 1 }
            ]
        },
        {
            q: "연인과 운동을...",
            dimension: "active",
            a: [
                { text: "같이 하면 더 재밌을 것 같아", score: 5 },
                { text: "운동은 혼자가 편해", score: 1 }
            ]
        },
        {
            q: "주말 아침에?",
            dimension: "active",
            a: [
                { text: "브런치 먹으러 나가자!", score: 5 },
                { text: "늦잠 자고 집에서 먹자", score: 1 }
            ]
        }
    ],
    resultLabels: [
        {
            name: "다정다감 연인",
            emoji: "🥰",
            desc: "따뜻한 말과 애정 표현이 가득한 상대",
            condition: { passion: "high", express: "high", close: "high" },
            matchPoints: [
                "매일 연락하며 안부를 묻는 사람",
                "스킨십과 애정 표현이 풍부한 사람",
                "함께하는 시간을 소중히 여기는 사람"
            ],
            interpretation: "당신은 감정적 교감과 따뜻한 소통을 중요시해요. 서로의 일상을 공유하고, 자주 사랑을 확인하고 싶어하는 타입이에요.",
            guide: "첫 만남에서 상대방이 얼마나 적극적으로 대화하는지, 감정 표현에 솔직한지 살펴보세요.",
            mood: "excited",
            color: "bg-pink-100"
        },
        {
            name: "든든한 버팀목",
            emoji: "🏔️",
            desc: "믿음직하고 헌신적인 상대",
            condition: { commit: "high", close: "high" },
            matchPoints: [
                "약속을 잘 지키는 사람",
                "힘들 때 곁에 있어주는 사람",
                "미래를 함께 계획하는 사람"
            ],
            interpretation: "안정적이고 진지한 관계를 원해요. 가벼운 만남보다 깊고 의미 있는 관계를 추구하는 타입이에요.",
            guide: "상대방이 관계에 얼마나 진지한지, 책임감이 있는지 확인해보세요.",
            mood: "happy",
            color: "bg-blue-100"
        },
        {
            name: "열정적인 로맨티스트",
            emoji: "💘",
            desc: "설렘과 열정이 넘치는 상대",
            condition: { passion: "high", active: "high" },
            matchPoints: [
                "서프라이즈를 좋아하는 사람",
                "새로운 경험을 함께 즐기는 사람",
                "매일이 특별한 날처럼 느껴지게 하는 사람"
            ],
            interpretation: "두근거림과 설렘을 연애의 핵심으로 생각해요. 매너리즘에 빠지지 않는 활기찬 관계를 원해요.",
            guide: "상대방이 얼마나 적극적이고 창의적인지, 함께 새로운 것을 시도할 의향이 있는지 보세요.",
            mood: "excited",
            color: "bg-red-100"
        },
        {
            name: "자유로운 동반자",
            emoji: "🦋",
            desc: "서로의 공간을 존중하는 상대",
            condition: { close: "low", commit: "medium" },
            matchPoints: [
                "개인 시간을 존중하는 사람",
                "집착하지 않는 사람",
                "독립적이면서도 함께할 때 행복한 사람"
            ],
            interpretation: "연애도 중요하지만 개인의 삶도 소중해요. 서로의 영역을 존중하면서 함께 성장하는 관계를 원해요.",
            guide: "상대방이 당신의 혼자만의 시간과 취미를 존중하는지 확인하세요.",
            mood: "cool",
            color: "bg-cyan-100"
        },
        {
            name: "편안한 베스트프렌드",
            emoji: "☕",
            desc: "친구처럼 편안한 상대",
            condition: { passion: "low", close: "medium", express: "low" },
            matchPoints: [
                "오래 알아온 친구 같은 편안함",
                "무리하지 않는 자연스러운 관계",
                "말하지 않아도 통하는 사람"
            ],
            interpretation: "드라마틱한 연애보다 잔잔하고 편안한 관계를 원해요. 오래 함께해도 부담 없는 관계가 이상적이에요.",
            guide: "처음부터 편하게 대화할 수 있는지, 억지로 꾸미지 않아도 되는 관계인지 보세요.",
            mood: "happy",
            color: "bg-yellow-100"
        },
        {
            name: "액티브 파트너",
            emoji: "⚡",
            desc: "함께 활동하는 것을 즐기는 상대",
            condition: { active: "high", passion: "medium" },
            matchPoints: [
                "다양한 취미를 함께 즐기는 사람",
                "여행과 새로운 경험을 좋아하는 사람",
                "에너지가 넘치는 사람"
            ],
            interpretation: "함께 무언가를 하면서 추억을 쌓는 것을 좋아해요. 같이 움직이고 경험하는 관계가 이상적이에요.",
            guide: "취미나 관심사가 비슷한지, 함께 활동할 의향이 있는지 확인하세요.",
            mood: "excited",
            color: "bg-orange-100"
        },
        {
            name: "진지한 소울메이트",
            emoji: "✨",
            desc: "깊은 대화와 교감을 나누는 상대",
            condition: { commit: "high", express: "high" },
            matchPoints: [
                "진지한 대화를 즐기는 사람",
                "감정을 솔직하게 나누는 사람",
                "서로의 성장을 응원하는 사람"
            ],
            interpretation: "표면적인 관계보다 영혼까지 통하는 깊은 관계를 원해요. 진정한 이해와 소통이 중요해요.",
            guide: "깊은 대화가 가능한지, 서로의 가치관이 맞는지 확인하세요.",
            mood: "happy",
            color: "bg-purple-100"
        },
        {
            name: "밸런스 연인",
            emoji: "⚖️",
            desc: "모든 면에서 균형 잡힌 상대",
            condition: {},
            matchPoints: [
                "적당한 연락, 적당한 만남",
                "개인 시간과 커플 시간의 균형",
                "안정과 설렘의 조화"
            ],
            interpretation: "극단적이지 않은 균형 잡힌 관계를 원해요. 너무 뜨겁지도, 너무 차갑지도 않은 적당한 온도가 좋아요.",
            guide: "상대방이 극단적이지 않고 균형 잡힌 사람인지 살펴보세요.",
            mood: "happy",
            color: "bg-green-100"
        }
    ]
};

// SUBJECT_CONFIG에 추가할 데이터
const idealTypeConfig = {
    icon: "HeartIcon",
    label: "이상형",
    intro: ["나의 이상형은?", "어떤 사람이 맞을까?", "운명의 상대는?"],
    resultFormat: "matching",
    deepButtonText: "이상형"
};

// data.js 읽기
let content = fs.readFileSync(dataPath, 'utf-8');

// 1. CHEMI_DATA에 idealType 추가
// hamster 데이터 뒤에 추가
const hamsterEndPattern = /(hamster:\s*\{[\s\S]*?\n    \})(,?\s*\n\};?\s*\n\s*\/\/ 점수)/;
const idealTypeDataStr = JSON.stringify(idealTypeData, null, 8)
    .replace(/^/gm, '        ')
    .replace(/^        /, '');

if (content.match(hamsterEndPattern)) {
    content = content.replace(hamsterEndPattern, `$1,\n    idealType: ${idealTypeDataStr}$2`);
    console.log('✅ CHEMI_DATA에 idealType 추가');
} else {
    console.log('⚠️  CHEMI_DATA에 추가할 위치를 찾을 수 없습니다.');
}

// 2. SUBJECT_CONFIG에 idealType 추가
const configEndPattern = /(hamster:\s*\{[^}]*\})(,?\s*\n\};)/;
const idealTypeConfigStr = `\n    idealType: ${JSON.stringify(idealTypeConfig, null, 8).replace(/^/gm, '    ').replace(/^    /, '')}`;

if (content.match(configEndPattern)) {
    content = content.replace(configEndPattern, `$1,${idealTypeConfigStr}$2`);
    console.log('✅ SUBJECT_CONFIG에 idealType 추가');
} else {
    console.log('⚠️  SUBJECT_CONFIG에 추가할 위치를 찾을 수 없습니다.');
}

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf-8');

console.log('\n✅ 연애 이상형 테스트 데이터 추가 완료!');
console.log('다음 단계: node scripts/validate-questions.mjs');
