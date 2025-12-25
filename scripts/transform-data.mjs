#!/usr/bin/env node
/**
 * data.js 변환 스크립트
 * MBTI 기반 구조를 CHEMI_DATA (Big Five / Feline Five / C-BARQ) 구조로 변환
 * UTF-8 인코딩을 안전하게 처리
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 새로운 CHEMI_DATA 구조 정의
const CHEMI_DATA = {
    human: {
        title: "내 맘 테스트",
        subtitle: "나의 진짜 성격은?",
        themeColor: "bg-[#BDE0FE]",
        icon: "HumanIcon",
        dimensions: {
            inssa: { name: "인싸력", emoji: "🎭", desc: "사회적 에너지와 외향성" },
            adventure: { name: "모험심", emoji: "🌟", desc: "새로움에 대한 개방성" },
            empathy: { name: "공감력", emoji: "💗", desc: "감정적 민감성과 배려" },
            plan: { name: "계획력", emoji: "📋", desc: "체계성과 규칙 선호" },
            mental: { name: "멘탈력", emoji: "🧠", desc: "정서적 안정성" }
        },
        questions: [
            // EI -> inssa (외향/내향 -> 인싸력)
            { q: "오랜만에 동창회에 나갔다! 어색한 친구들 사이에서 나는?", dimension: "inssa", a: [{ text: "먼저 말을 걸며 분위기를 띄운다.", score: 5 }, { text: "친한 친구 옆에 딱 붙어서 조용히 있는다.", score: 1 }] },
            { q: "주말에 아무 약속이 없다면?", dimension: "inssa", a: [{ text: "심심해... 친구들에게 연락해 약속을 잡는다.", score: 5 }, { text: "나이스! 밀린 넷플릭스를 보며 침대와 한 몸이 된다.", score: 1 }] },
            { q: "갑자기 모르는 번호로 전화가 걸려온다면?", dimension: "inssa", a: [{ text: "여보세요? 일단 받고 누구인지 확인한다.", score: 5 }, { text: "스팸인가? 고민하다가 끊어지면 안도한다.", score: 1 }] },
            // SN -> adventure (감각/직관 -> 모험심)
            { q: "멍 때릴 때 주로 하는 생각은?", dimension: "adventure", a: [{ text: "오늘 저녁 뭐 먹지? 내일 할 일이 뭐더라?", score: 1 }, { text: "좀비 사태가 터지면 어디로 도망가지? 로또 당첨되면...", score: 5 }] },
            { q: "영화를 보고 나서 친구와 대화할 때 나는?", dimension: "adventure", a: [{ text: "주인공이 입은 옷 예쁘더라. 액션씬 대박이었어.", score: 1 }, { text: "그 결말의 의미는 뭘까? 감독이 전하려는 메시지는...", score: 5 }] },
            { q: "요리 레시피를 볼 때 나는?", dimension: "adventure", a: [{ text: "소금 1작은술... 계량스푼으로 정확히 맞춘다.", score: 1 }, { text: "이 정도면 되겠지? 감으로 대충 넣거나 내 맘대로 바꾼다.", score: 5 }] },
            // TF -> empathy (사고/감정 -> 공감력)
            { q: "친구가 '나 우울해서 빵 샀어'라고 했을 때 나의 반응은?", dimension: "empathy", a: [{ text: "무슨 빵 샀어? 맛있어?", score: 1 }, { text: "무슨 일 있어? 왜 우울해 ㅠㅠ", score: 5 }] },
            { q: "친구가 머리를 자르고 왔는데, 솔직히 좀 별로다. 이때 나는?", dimension: "empathy", a: [{ text: "음... 전이 더 나은 것 같은데? 솔직하게 말한다.", score: 1 }, { text: "오~ 변화를 줬네! 기분 전환 됐겠다! 돌려 말하거나 칭찬한다.", score: 5 }] },
            { q: "조별 과제 중, 열심히 했지만 결과물이 별로인 팀원에게 피드백한다면?", dimension: "empathy", a: [{ text: "이 부분은 수정이 필요해요. 부족한 점을 명확히 짚어준다.", score: 1 }, { text: "고생 많으셨어요! 근데 이 부분만 조금 더... 격려부터 한다.", score: 5 }] },
            // JP -> plan (판단/인식 -> 계획력)
            { q: "여행 가기 전날, 나의 짐 싸기 스타일은?", dimension: "plan", a: [{ text: "며칠 전부터 리스트를 작성하고 차곡차곡 싸둔다.", score: 5 }, { text: "출발 직전에 '지갑, 여권! 챙겼으면 됐지!' 하고 후다닥 싼다.", score: 1 }] },
            { q: "2주 뒤가 시험이다. 나의 공부 계획은?", dimension: "plan", a: [{ text: "일별로 공부할 분량을 나눠서 계획을 짠다.", score: 5 }, { text: "아직 2주나 남았네? 일단 놀다가 벼락치기한다.", score: 1 }] },
            { q: "친구와 맛집에 갔는데 문이 닫혀있다! 이때 나는?", dimension: "plan", a: [{ text: "아... 어떡하지? 미리 찾아둔 2순위 식당으로 간다.", score: 5 }, { text: "할 수 없지! 저기 맛있어 보이는데 갈까? 바로 옆 가게로 간다.", score: 1 }] },
            // mental (새로운 차원 - 정서적 안정성)
            { q: "중요한 발표가 코앞인데, 갑자기 자료가 날아갔다!", dimension: "mental", a: [{ text: "심호흡하고, 기억나는 대로 빠르게 다시 만든다.", score: 5 }, { text: "머리가 새하얘지고, 일단 패닉 상태에 빠진다.", score: 1 }] },
            { q: "SNS에서 누군가 내 글에 비판적인 댓글을 달았다.", dimension: "mental", a: [{ text: "그럴 수도 있지. 다양한 의견이 있는 거니까.", score: 5 }, { text: "하루 종일 그 댓글이 머릿속에서 떠나지 않는다.", score: 1 }] },
            { q: "친구가 며칠째 연락이 없다. 이때 드는 생각은?", dimension: "mental", a: [{ text: "바쁜가 보네. 나중에 연락 오겠지.", score: 5 }, { text: "나한테 서운한 거 있나? 뭔가 잘못했나?", score: 1 }] }
        ],
        questions_deep: [
            // EI deep -> inssa
            { q: "일주일 동안 사람들을 만나지 않고 집에만 있었다면?", dimension: "inssa", a: [{ text: "좀이 쑤신다. 세상과 단절된 느낌이 들어 우울하다.", score: 5 }, { text: "너무 평화롭다. 에너지가 완전히 충전된 기분이다.", score: 1 }] },
            { q: "대화 중 침묵이 흐르는 순간, 나는?", dimension: "inssa", a: [{ text: "어색함을 견딜 수 없어 무슨 말이든 꺼내 분위기를 띄운다.", score: 5 }, { text: "침묵도 대화의 일부라고 생각하며 편안하게 기다린다.", score: 1 }] },
            { q: "나의 인간관계 스타일은?", dimension: "inssa", a: [{ text: "넓고 얕은 관계. 다양한 사람들과 어울리는 것이 좋다.", score: 5 }, { text: "좁고 깊은 관계. 소수의 사람과 깊은 이야기를 나누는 것이 좋다.", score: 1 }] },
            { q: "파티나 모임에서 나는 주로?", dimension: "inssa", a: [{ text: "무대 중앙이나 시끌벅적한 곳에서 에너지를 발산한다.", score: 5 }, { text: "구석진 자리나 조용한 곳에서 한두 명과 대화하거나 관찰한다.", score: 1 }] },
            { q: "고민이 생겼을 때 나는?", dimension: "inssa", a: [{ text: "친구들에게 털어놓고 이야기하며 해결책을 찾는다.", score: 5 }, { text: "혼자 조용히 생각하며 스스로 답을 내릴 때까지 삭힌다.", score: 1 }] },
            { q: "새로운 모임에 나갔을 때 나의 자기소개 스타일은?", dimension: "inssa", a: [{ text: "안녕하세요! 저는~ 먼저 나서서 활기차게 나를 알린다.", score: 5 }, { text: "사회자가 시키거나 순서가 되면 차분하게 짧게 이야기한다.", score: 1 }] },
            // SN deep -> adventure
            { q: "사과라는 단어를 들으면 떠오르는 것은?", dimension: "adventure", a: [{ text: "빨갛다, 맛있다, 동그랗다, 아삭하다.", score: 1 }, { text: "백설공주, 뉴턴, 애플(아이폰), 유혹, 죄.", score: 5 }] },
            { q: "여행 계획을 짤 때 나는?", dimension: "adventure", a: [{ text: "맛집 위치, 교통편, 숙소 가격 등 구체적인 정보를 찾는다.", score: 1 }, { text: "여행지의 분위기, 그곳에서 느낄 감정, 특별한 경험을 상상한다.", score: 5 }] },
            { q: "일을 처리하는 방식은?", dimension: "adventure", a: [{ text: "검증된 방식, 매뉴얼, 선례를 따르는 것이 편하고 확실하다.", score: 1 }, { text: "남들이 안 해본 새로운 방식, 나만의 독창적인 방법을 시도하고 싶다.", score: 5 }] },
            { q: "추상적인 현대 미술 작품을 보았을 때?", dimension: "adventure", a: [{ text: "음... 그냥 점이랑 선이네. 이게 뭐지?", score: 1 }, { text: "작가의 고뇌와 혼란스러운 내면이 느껴져.", score: 5 }] },
            { q: "설명서를 읽을 때 나는?", dimension: "adventure", a: [{ text: "1번부터 순서대로 꼼꼼히 읽고 따라 한다.", score: 1 }, { text: "대충 그림만 훑어보고 일단 조립부터 해본다.", score: 5 }] },
            { q: "나에게 더 중요한 것은?", dimension: "adventure", a: [{ text: "현재의 즐거움, 눈앞의 현실, 확실한 팩트.", score: 1 }, { text: "미래의 가능성, 보이지 않는 의미, 큰 그림.", score: 5 }] },
            // TF deep -> empathy
            { q: "후배가 실수를 해서 시말서를 써야 하는 상황이다. 나는?", dimension: "empathy", a: [{ text: "규정은 규정이니 원칙대로 처리한다.", score: 1 }, { text: "사정을 들어보고 이번만 봐줄 수 있는지 알아본다.", score: 5 }] },
            { q: "리더로서 팀원을 평가해야 할 때?", dimension: "empathy", a: [{ text: "성과와 능력 위주로 냉정하게 평가해야 공정하다.", score: 1 }, { text: "그 사람의 노력과 팀 분위기에 미친 영향도 중요하게 고려한다.", score: 5 }] },
            { q: "논쟁이 붙었을 때 나는?", dimension: "empathy", a: [{ text: "내 논리가 맞다는 것을 증명하기 위해 끝까지 팩트를 제시한다.", score: 1 }, { text: "상대방의 기분이 상하지 않도록 적당히 맞춰주거나 화제를 돌린다.", score: 5 }] },
            { q: "나를 더 기분 좋게 하는 칭찬은?", dimension: "empathy", a: [{ text: "너 진짜 똑똑하다. 일 처리 완벽해.", score: 1 }, { text: "너는 정말 따뜻한 사람이야. 배려심이 깊어.", score: 5 }] },
            { q: "의사결정을 내릴 때 더 신경 쓰이는 것은?", dimension: "empathy", a: [{ text: "이것이 논리적으로 타당한가? 효율적인가?", score: 1 }, { text: "이것이 사람들에게 어떤 영향을 미칠까? 내 가치관에 맞는가?", score: 5 }] },
            { q: "친구가 늦어서 약속 시간에 늦었다. 친구는 '차가 너무 막혔어'라고 한다.", dimension: "empathy", a: [{ text: "그러게 좀 일찍 나오지 그랬어.", score: 1 }, { text: "오느라 고생했네. 차 막히면 힘들지.", score: 5 }] },
            // JP deep -> plan
            { q: "주말 일정이 갑자기 취소되었다면?", dimension: "plan", a: [{ text: "아... 계획 다 틀어졌네. 붕 뜬 시간에 당황하며 스트레스 받는다.", score: 5 }, { text: "오예! 자유시간이다! 즉흥적으로 하고 싶은 걸 하거나 쉰다.", score: 1 }] },
            { q: "내 방의 상태는?", dimension: "plan", a: [{ text: "물건들이 제자리에 정리되어 있고 깔끔하다.", score: 5 }, { text: "다소 어지럽혀져 있지만, 나름의 질서가 있어 찾을 순 있다.", score: 1 }] },
            { q: "새해 목표를 세울 때 나는?", dimension: "plan", a: [{ text: "3월까지 5kg 감량, 주 3회 운동 구체적인 수치와 계획을 짠다.", score: 5 }, { text: "올해는 더 건강해지기! 큰 방향성만 정해둔다.", score: 1 }] },
            { q: "반복되는 일상(루틴)에 대해 어떻게 생각하는가?", dimension: "plan", a: [{ text: "규칙적인 생활 패턴이 있어야 마음이 편하고 효율적이다.", score: 5 }, { text: "매일 똑같은 건 지루하다. 변화와 새로운 이벤트가 필요하다.", score: 1 }] },
            { q: "할 일 목록(To-Do List)을 작성하는가?", dimension: "plan", a: [{ text: "매일 작성하고 완료한 것을 체크하며 쾌감을 느낀다.", score: 5 }, { text: "머릿속으로 대충 생각하거나, 적어두고 까먹는 경우가 많다.", score: 1 }] },
            { q: "결정을 내려야 할 때 나는?", dimension: "plan", a: [{ text: "신속하게 결정을 내리고 다음 단계로 넘어가는 것을 선호한다.", score: 5 }, { text: "새로운 정보가 나올 수 있으므로 최대한 결정을 미루고 지켜본다.", score: 1 }] },
            // mental deep (새로운 차원)
            { q: "실수를 했을 때 나의 반응은?", dimension: "mental", a: [{ text: "다음엔 안 그러면 되지. 빠르게 털고 넘어간다.", score: 5 }, { text: "왜 그랬을까... 계속 곱씹으며 자책한다.", score: 1 }] },
            { q: "예상치 못한 변화가 생겼을 때?", dimension: "mental", a: [{ text: "상황에 맞춰 유연하게 대처한다.", score: 5 }, { text: "불안하고 어떻게 해야 할지 모르겠다.", score: 1 }] },
            { q: "스트레스를 받으면 나는?", dimension: "mental", a: [{ text: "운동이나 취미로 빠르게 해소한다.", score: 5 }, { text: "잠을 못 자거나 폭식/폭음을 하게 된다.", score: 1 }] },
            { q: "미래에 대한 걱정을 얼마나 자주 하는가?", dimension: "mental", a: [{ text: "가끔 생각하지만 크게 불안하지 않다.", score: 5 }, { text: "자주 걱정되고 불안할 때가 많다.", score: 1 }] },
            { q: "누군가에게 거절당했을 때?", dimension: "mental", a: [{ text: "아쉽지만 다른 기회가 있겠지.", score: 5 }, { text: "내가 뭘 잘못했나? 한동안 마음이 무겁다.", score: 1 }] },
            { q: "중요한 결정을 앞두고 있을 때?", dimension: "mental", a: [{ text: "충분히 고민하고 결정하면 후회하지 않는다.", score: 5 }, { text: "결정 후에도 계속 다른 선택이 나았을까 고민한다.", score: 1 }] }
        ],
        resultLabels: [
            // 주요 16가지 유형 + 변형
            { name: "에너자이저", emoji: "⚡", desc: "어디서든 분위기를 띄우는 인싸 중의 인싸!", condition: { inssa: "high", adventure: "high", empathy: "high" }, interpretation: "당신은 에너지가 넘치고 사람들과 함께할 때 빛나는 타입입니다. 새로운 경험을 두려워하지 않고, 주변 사람들의 감정을 잘 읽어 분위기를 이끕니다.", guide: "가끔은 혼자만의 시간을 가지며 에너지를 재충전하세요. 너무 많은 관계에 에너지를 쏟다 보면 정작 자신을 돌보지 못할 수 있어요.", mood: "excited", color: "bg-yellow-100" },
            { name: "전략가", emoji: "🎯", desc: "계획적이고 논리적인 마스터마인드", condition: { inssa: "low", plan: "high", empathy: "low" }, interpretation: "당신은 독립적이고 분석적인 사고를 가진 전략가입니다. 혼자만의 시간을 통해 깊이 있는 생각을 하고, 체계적으로 목표를 달성해 나갑니다.", guide: "때로는 논리보다 감정을 우선시해보세요. 주변 사람들의 마음을 헤아리는 연습이 관계를 더욱 풍요롭게 만들 거예요.", mood: "cool", color: "bg-indigo-100" },
            { name: "힐러", emoji: "💚", desc: "따뜻한 마음으로 모두를 치유하는 공감왕", condition: { empathy: "high", mental: "high", inssa: "medium" }, interpretation: "당신은 타인의 감정에 깊이 공감하고 따뜻하게 위로할 줄 아는 사람입니다. 안정적인 정서를 바탕으로 주변에 편안함을 선사합니다.", guide: "다른 사람을 돌보느라 자신의 감정을 무시하지 마세요. 당신의 마음도 충분히 돌봄받을 자격이 있어요.", mood: "happy", color: "bg-green-100" },
            { name: "모험가", emoji: "🚀", desc: "새로운 것을 찾아 떠나는 탐험가", condition: { adventure: "high", plan: "low", mental: "high" }, interpretation: "당신은 틀에 박힌 것을 싫어하고 항상 새로운 가능성을 탐색하는 자유로운 영혼입니다. 변화를 두려워하지 않고 도전을 즐깁니다.", guide: "가끔은 계획을 세워보는 것도 좋아요. 모험도 좋지만, 안정적인 기반이 더 큰 도전을 가능하게 합니다.", mood: "excited", color: "bg-orange-100" },
            { name: "수호자", emoji: "🛡️", desc: "묵묵히 곁을 지키는 든든한 버팀목", condition: { plan: "high", empathy: "high", inssa: "low" }, interpretation: "당신은 조용하지만 깊은 책임감과 배려심을 가진 사람입니다. 가까운 사람들을 위해 헌신하며, 신뢰할 수 있는 존재로 인정받습니다.", guide: "자신의 욕구와 감정도 중요하게 여기세요. 항상 남을 위해 희생하기보다 때로는 자신을 위한 시간을 가지세요.", mood: "happy", color: "bg-pink-100" },
            { name: "몽상가", emoji: "🌙", desc: "상상의 나래를 펼치는 로맨티스트", condition: { adventure: "high", empathy: "high", inssa: "low" }, interpretation: "당신은 풍부한 상상력과 깊은 감성을 가진 낭만주의자입니다. 내면의 세계가 풍요롭고, 예술적 감각이 뛰어납니다.", guide: "가끔은 현실에도 발을 딛고 서세요. 아름다운 상상을 현실로 만들어가는 과정도 즐거울 거예요.", mood: "sad", color: "bg-purple-100" },
            { name: "리더", emoji: "👑", desc: "앞장서서 이끄는 카리스마 대장", condition: { inssa: "high", plan: "high", mental: "high" }, interpretation: "당신은 사람들 앞에서 빛나며, 체계적으로 목표를 향해 나아가는 타고난 리더입니다. 흔들리지 않는 멘탈로 팀을 이끕니다.", guide: "모든 것을 혼자 책임지려 하지 마세요. 때로는 다른 사람에게 맡기고 신뢰하는 법을 배워보세요.", mood: "cool", color: "bg-blue-200" },
            { name: "예술가", emoji: "🎨", desc: "감성과 창의력이 넘치는 자유로운 영혼", condition: { adventure: "high", empathy: "high", plan: "low" }, interpretation: "당신은 틀에 얽매이지 않는 자유로운 사고와 풍부한 감성을 지닌 예술가 타입입니다. 독창적인 시각으로 세상을 바라봅니다.", guide: "현실적인 부분도 조금씩 챙겨보세요. 예술적 영감을 실현하려면 기본적인 토대가 필요합니다.", mood: "happy", color: "bg-yellow-100" },
            { name: "분석가", emoji: "🔬", desc: "날카로운 논리로 모든 것을 파헤치는 탐구자", condition: { adventure: "high", empathy: "low", inssa: "low" }, interpretation: "당신은 지적 호기심이 왕성하고 논리적 분석을 즐기는 탐구자입니다. 깊이 있는 사고로 문제의 본질을 꿰뚫어 봅니다.", guide: "사람들과의 교류도 새로운 아이디어의 원천이 될 수 있어요. 가끔은 머리보다 마음으로 소통해보세요.", mood: "cool", color: "bg-blue-100" },
            { name: "중재자", emoji: "☮️", desc: "갈등을 해결하고 화합을 이끄는 평화주의자", condition: { empathy: "high", inssa: "medium", mental: "high" }, interpretation: "당신은 다양한 입장을 이해하고 조율할 줄 아는 중재자입니다. 평화로운 분위기를 만들고 모두가 만족하는 해결책을 찾습니다.", guide: "자신의 의견도 확실히 표현하세요. 항상 중립을 지키다 보면 정작 자신이 원하는 것을 놓칠 수 있어요.", mood: "happy", color: "bg-green-100" },
            { name: "실행가", emoji: "⚙️", desc: "말보다 행동으로 보여주는 실천파", condition: { plan: "high", inssa: "medium", adventure: "low" }, interpretation: "당신은 계획을 세우면 반드시 실행하는 행동파입니다. 현실적이고 효율적인 방법으로 목표를 달성해 나갑니다.", guide: "가끔은 새로운 방법도 시도해보세요. 익숙한 것만 고집하면 더 좋은 기회를 놓칠 수 있어요.", mood: "cool", color: "bg-gray-100" },
            { name: "엔터테이너", emoji: "🎭", desc: "주목받는 것을 즐기는 무대 위의 스타", condition: { inssa: "high", empathy: "medium", plan: "low" }, interpretation: "당신은 사람들 앞에서 빛나는 것을 즐기고, 즉흥적인 상황에서도 재치있게 대처하는 엔터테이너입니다.", guide: "관심받지 못할 때도 자신의 가치를 인정하세요. 무대 아래에서도 당신은 충분히 특별합니다.", mood: "excited", color: "bg-orange-100" },
            { name: "현실주의자", emoji: "📊", desc: "발 딛고 있는 현실에 충실한 실용주의자", condition: { adventure: "low", plan: "high", empathy: "low" }, interpretation: "당신은 현실적이고 실용적인 사고를 가진 사람입니다. 확실한 것을 선호하고, 안정적인 방법으로 목표를 이룹니다.", guide: "가끔은 상상의 나래를 펼쳐보세요. 틀을 벗어난 생각이 새로운 가능성을 열어줄 거예요.", mood: "cool", color: "bg-blue-100" },
            { name: "조력자", emoji: "🤝", desc: "누구에게나 손을 내미는 따뜻한 사람", condition: { inssa: "high", empathy: "high", plan: "medium" }, interpretation: "당신은 사람들과 어울리는 것을 좋아하고, 누군가를 돕는 것에서 기쁨을 느끼는 따뜻한 사람입니다.", guide: "자신의 한계를 인정하세요. 모든 사람을 도울 수는 없어요. 자신을 먼저 돌보는 것도 중요합니다.", mood: "happy", color: "bg-pink-100" },
            { name: "철학자", emoji: "📚", desc: "깊은 생각에 잠기는 사색가", condition: { adventure: "high", inssa: "low", empathy: "medium" }, interpretation: "당신은 세상의 깊은 의미를 탐구하는 사색가입니다. 혼자만의 시간을 통해 통찰력 있는 생각을 발전시킵니다.", guide: "생각을 행동으로 옮기는 연습을 해보세요. 머릿속 아이디어를 현실로 만들 때 진정한 성취감을 느낄 거예요.", mood: "sad", color: "bg-purple-100" },
            { name: "균형잡힌 사람", emoji: "⚖️", desc: "모든 면에서 조화를 이루는 밸런스 마스터", condition: { inssa: "medium", adventure: "medium", empathy: "medium", plan: "medium", mental: "medium" }, interpretation: "당신은 모든 면에서 균형 잡힌 성격을 가지고 있습니다. 상황에 따라 유연하게 대처하며, 극단적이지 않은 안정감이 있습니다.", guide: "때로는 어느 한 방향으로 깊이 파고들어 보세요. 균형도 좋지만 열정적으로 몰입하는 경험도 소중합니다.", mood: "happy", color: "bg-gray-100" }
        ]
    },
    cat: {
        title: "냥심 테스트",
        subtitle: "우리 냥이의 진짜 성격은?",
        themeColor: "bg-[#FFD1DC]",
        icon: "CatFace",
        dimensions: {
            curious: { name: "호기심", emoji: "🔍", desc: "새로운 것에 대한 탐구심" },
            alert: { name: "경계심", emoji: "👀", desc: "환경에 대한 민감도" },
            boss: { name: "보스기질", emoji: "👑", desc: "독립성과 지배력" },
            random: { name: "엉뚱함", emoji: "🎲", desc: "예측불가한 행동 패턴" },
            cute: { name: "애교력", emoji: "🥰", desc: "친밀감과 사회성" }
        },
        questions: [
            // EI -> cute (사회성)
            { q: "집사가 화장실에 들어갔다. 문이 닫히면?", dimension: "cute", a: [{ text: "문 앞에서 야옹거리거나 앞발을 넣는다.", score: 5 }, { text: "나올 때까지 조용히 기다리거나 내 할 일 한다.", score: 1 }] },
            { q: "집에 낯선 손님이 찾아왔을 때?", dimension: "alert", a: [{ text: "누구냐옹? 먼저 다가가서 냄새를 맡는다.", score: 1 }, { text: "후다닥! 침대 밑이나 높은 곳으로 숨는다.", score: 5 }] },
            { q: "집사가 장난감을 흔들 때?", dimension: "curious", a: [{ text: "우다다다! 바로 달려들어 사냥한다.", score: 5 }, { text: "누워서 발만 까딱까딱... 귀찮다옹.", score: 1 }] },
            // SN -> curious (호기심)
            { q: "창밖을 구경할 때 나는?", dimension: "curious", a: [{ text: "지나가는 새, 벌레를 보며 채터링(깍깍)을 한다.", score: 5 }, { text: "그냥 멍하니 풍경을 바라보며 사색에 잠긴다.", score: 3 }] },
            { q: "새로운 박스가 생겼다!", dimension: "curious", a: [{ text: "일단 들어가서 사이즈가 맞는지 확인한다.", score: 3 }, { text: "이건 우주선이다옹! 상상하며 뜯고 맛본다.", score: 5 }] },
            { q: "사냥 놀이를 할 때?", dimension: "curious", a: [{ text: "눈앞에 보이는 장난감만 쫓는다.", score: 3 }, { text: "장난감이 숨을 곳을 미리 예측하고 매복한다.", score: 5 }] },
            // TF -> boss (지배력)
            { q: "집사가 슬퍼서 울고 있을 때?", dimension: "boss", a: [{ text: "배고프다옹. 밥그릇을 툭툭 친다.", score: 5 }, { text: "왜 그러냐옹... 조용히 다가와서 눈물을 핥아준다.", score: 1 }] },
            { q: "집사에게 혼났을 때?", dimension: "boss", a: [{ text: "흥! 꼬리를 홱 돌리고 무시한다.", score: 5 }, { text: "마징가 귀를 하고 눈치를 본다.", score: 1 }] },
            { q: "간식을 줄 때 집사의 손가락까지 깨물었다!", dimension: "boss", a: [{ text: "맛있는 냄새가 나서 그랬다옹. (당당)", score: 5 }, { text: "아팠냐옹? 미안해서 핥아준다.", score: 1 }] },
            // JP -> random (규칙성)
            { q: "밥 먹을 시간이 되었을 때?", dimension: "random", a: [{ text: "정확한 시간에 야옹! 밥 내놔라옹!", score: 1 }, { text: "자다가 생각나면 가서 먹는다.", score: 5 }] },
            { q: "화장실을 사용할 때?", dimension: "random", a: [{ text: "모래를 꼼꼼하게 덮어서 흔적을 없앤다.", score: 1 }, { text: "대충 덮거나 그냥 튀어 나간다.", score: 5 }] },
            { q: "잠자는 위치는?", dimension: "random", a: [{ text: "항상 자는 지정석(캣타워, 집사 베개 등)이 있다.", score: 1 }, { text: "그때그때 기분 내키는 곳에서 잔다.", score: 5 }] }
        ],
        questions_deep: [
            // EI deep -> cute
            { q: "다른 고양이 친구를 만났을 때?", dimension: "cute", a: [{ text: "반갑다옹! 코 인사를 시도한다.", score: 5 }, { text: "하악! 가까이 오지 마라옹!", score: 1 }] },
            { q: "집사가 이름을 불렀을 때?", dimension: "cute", a: [{ text: "야옹~ 하고 대답하며 달려간다.", score: 5 }, { text: "귀만 쫑긋하고 못 들은 척한다.", score: 1 }] },
            { q: "집안에서 나의 활동 반경은?", dimension: "cute", a: [{ text: "거실, 부엌, 안방... 온 집안을 누비고 다닌다.", score: 5 }, { text: "내 구역(캣타워, 숨숨집)에서 잘 안 나온다.", score: 1 }] },
            { q: "새로운 장난감을 사왔을 때?", dimension: "curious", a: [{ text: "신상이다! 바로 관심을 보이며 가지고 논다.", score: 5 }, { text: "며칠 동안 냄새만 맡으며 탐색전을 벌인다.", score: 3 }] },
            { q: "집사가 외출하고 돌아왔을 때?", dimension: "cute", a: [{ text: "현관까지 마중 나가서 다리에 몸을 비빈다.", score: 5 }, { text: "왔어? 자다가 눈만 한번 뜬다.", score: 1 }] },
            { q: "밤에 모두가 잠든 시간, 나는?", dimension: "random", a: [{ text: "우다다 타임! 혼자서도 잘 논다.", score: 5 }, { text: "집사 옆에 붙어서 같이 잔다.", score: 1 }] },
            // SN deep -> curious
            { q: "높은 곳(냉장고 위, 장롱 위)을 볼 때?", dimension: "curious", a: [{ text: "올라갈 수 있을까? 각도를 계산해본다.", score: 3 }, { text: "저기는 정복해야 할 나의 성이다옹!", score: 5 }] },
            { q: "거울을 볼 때?", dimension: "curious", a: [{ text: "그냥 나네. (무관심)", score: 1 }, { text: "저 녀석은 누구냐옹? 뒤에 누가 있나 확인한다.", score: 5 }] },
            { q: "벌레가 나타났다!", dimension: "curious", a: [{ text: "잡았다! 바로 앞발로 내리친다.", score: 3 }, { text: "저건 뭘까? 뚫어져라 관찰하며 채터링한다.", score: 5 }] },
            { q: "집사가 이상한 자세로 있을 때?", dimension: "curious", a: [{ text: "뭐하냐옹? 냄새를 맡아본다.", score: 3 }, { text: "새로운 놀이인가? 같이 이상한 자세를 취한다.", score: 5 }] },
            { q: "간식 서랍을 열지도 않았는데 달려간다?", dimension: "alert", a: [{ text: "봉지 부스럭거리는 소리를 들었다.", score: 3 }, { text: "집사의 기운이 간식을 줄 것 같았다.", score: 5 }] },
            { q: "TV에 새가 나올 때?", dimension: "curious", a: [{ text: "저건 가짜다옹. 별 반응 없다.", score: 1 }, { text: "잡고 싶다옹! TV 화면을 긁는다.", score: 5 }] },
            // TF deep -> boss
            { q: "집사가 아파서 누워있을 때?", dimension: "boss", a: [{ text: "심심하다옹. 놀아달라고 깨운다.", score: 5 }, { text: "걱정된다옹. 옆에서 골골송으로 치유해준다.", score: 1 }] },
            { q: "발톱 깎을 때?", dimension: "boss", a: [{ text: "이거 놓으라옹! (하악질/냥펀치)", score: 5 }, { text: "싫지만 츄르를 위해 참는다. (낑낑)", score: 1 }] },
            { q: "집사가 실수로 꼬리를 밟았다!", dimension: "boss", a: [{ text: "캬악! (바로 응징)", score: 5 }, { text: "야옹! (아프지만 도망가서 쳐다봄)", score: 1 }] },
            { q: "맛없는 간식을 줬을 때?", dimension: "boss", a: [{ text: "냄새 맡고 홱 돌아서 가버린다.", score: 5 }, { text: "일단 먹는 시늉은 해준다.", score: 1 }] },
            { q: "집사가 뽀뽀하려고 다가올 때?", dimension: "cute", a: [{ text: "앞발로 입을 막는다. (거절)", score: 1 }, { text: "눈을 감고 받아준다. (허락)", score: 5 }] },
            { q: "원하는 것을 요구할 때?", dimension: "boss", a: [{ text: "물건을 떨어뜨리거나 긁어서 관심을 끈다.", score: 5 }, { text: "애처로운 눈빛으로 야옹~ 하고 운다.", score: 1 }] },
            // JP deep -> random
            { q: "스크래쳐 사용 방식은?", dimension: "random", a: [{ text: "항상 긁던 곳만 긁어서 너덜너덜하다.", score: 1 }, { text: "소파, 벽지, 카펫... 긁히는 건 다 긁는다.", score: 5 }] },
            { q: "그루밍(털 고르기) 스타일은?", dimension: "random", a: [{ text: "발가락 사이까지 꼼꼼하게 순서대로 한다.", score: 1 }, { text: "생각날 때마다 대충 핥는다.", score: 5 }] },
            { q: "집안 가구 배치가 바뀌었을 때?", dimension: "alert", a: [{ text: "마음에 안 든다옹! 계속 울거나 불안해한다.", score: 5 }, { text: "오! 새로운 탐험지다옹! 신나게 돌아다닌다.", score: 1 }] },
            { q: "사료 먹는 스타일?", dimension: "random", a: [{ text: "딱 먹을 만큼만 먹고 남긴다. (자율급식 가능)", score: 1 }, { text: "있으면 다 먹어치운다. (식탐왕)", score: 5 }] },
            { q: "집사가 놀아주는 시간?", dimension: "random", a: [{ text: "매일 밤 10시! 루틴이 깨지면 화낸다.", score: 1 }, { text: "집사가 낚싯대 들면 그때가 노는 시간이다.", score: 5 }] },
            { q: "낯선 물건에 대한 반응?", dimension: "alert", a: [{ text: "조심스럽게 냄새 맡고 안전한지 확인 후 건드린다.", score: 5 }, { text: "일단 앞발로 툭 쳐보고 올라가 본다.", score: 1 }] }
        ],
        resultLabels: [
            { name: "철학 냥이", emoji: "🌙", desc: "창밖을 보며 우주의 섭리를 생각해요.", condition: { curious: "high", alert: "medium", boss: "low" }, interpretation: "깊은 통찰력과 이상주의를 가진 예언자적인 성격입니다. 조용히 사색하는 것을 좋아하고, 자신만의 세계관이 뚜렷합니다.", guide: "혼자만의 사색 시간을 존중해 주세요. 캣타워 높은 곳이나 창가에 편안한 자리를 마련해주면 좋아합니다.", mood: "sad", color: "bg-purple-100" },
            { name: "보스 냥이", emoji: "👑", desc: "이 집의 주인은 나다옹!", condition: { boss: "high", alert: "medium", cute: "low" }, interpretation: "독립적이고 자존심이 강한 고양이입니다. 자신의 영역과 규칙을 중요시하며, 집사도 자기 방식대로 다루려 합니다.", guide: "복종을 강요하기보다 '제안'하는 것이 효과적입니다. 선택권을 주고 스스로 결정하게 하면 협조적이 됩니다.", mood: "cool", color: "bg-indigo-100" },
            { name: "인싸 냥이", emoji: "🎉", desc: "새로운 친구를 만나면 먼저 다가가요!", condition: { cute: "high", curious: "high", alert: "low" }, interpretation: "사교적이고 활발한 성격입니다. 사람과 함께하는 것을 좋아하고, 관심받는 것을 즐깁니다.", guide: "집사의 적극적인 반응과 관심이 필요합니다. 혼자 있는 시간이 길면 외로워할 수 있어요.", mood: "happy", color: "bg-orange-100" },
            { name: "천사 냥이", emoji: "😇", desc: "집사가 힘들면 옆에서 골골송을 불러줘요.", condition: { cute: "high", boss: "low", alert: "low" }, interpretation: "타인의 감정을 읽고 헌신적으로 돌보는 따뜻한 마음의 소유자입니다. 공감 능력이 뛰어납니다.", guide: "집사가 힘들 때 먼저 다가오는 공감 능력이 뛰어납니다. 부드러운 목소리와 따뜻한 스킨십을 좋아해요.", mood: "happy", color: "bg-pink-100" },
            { name: "탐험 냥이", emoji: "🔭", desc: "새로운 곳은 모두 나의 탐험지!", condition: { curious: "high", random: "high", alert: "low" }, interpretation: "호기심이 많고 모험심이 강한 고양이입니다. 새로운 것에 두려움 없이 다가가며 탐구합니다.", guide: "다양한 환경 변화와 새로운 장난감을 제공해주세요. 안전한 범위 내에서 탐험할 수 있는 기회를 많이 주세요.", mood: "excited", color: "bg-yellow-100" },
            { name: "경계 냥이", emoji: "🚨", desc: "낯선 것에는 일단 하악!", condition: { alert: "high", boss: "medium", cute: "low" }, interpretation: "환경 변화에 민감하고 조심스러운 성격입니다. 안전을 최우선으로 생각하며, 익숙한 것을 선호합니다.", guide: "갑작스러운 변화를 피하고, 새로운 것을 천천히 소개해주세요. 안전한 숨을 공간을 항상 마련해두세요.", mood: "cool", color: "bg-blue-100" },
            { name: "엉뚱 냥이", emoji: "🎲", desc: "다음 행동은 나도 모른다옹!", condition: { random: "high", curious: "high", boss: "medium" }, interpretation: "예측 불가능한 행동으로 웃음을 주는 고양이입니다. 틀에 박히지 않은 자유로운 영혼입니다.", guide: "규칙적인 생활을 강요하지 마세요. 자유롭게 놀 수 있는 환경과 다양한 장난감이 좋습니다.", mood: "excited", color: "bg-green-100" },
            { name: "도도 냥이", emoji: "💅", desc: "쓰다듬는 것은 허락할 때만 가능.", condition: { boss: "high", cute: "low", random: "low" }, interpretation: "자존감이 높고 품위 있는 고양이입니다. 자신만의 기준이 확실하고, 쉽게 타협하지 않습니다.", guide: "먼저 다가가기보다 고양이가 다가올 때까지 기다려주세요. 존중받는다고 느끼면 마음을 열어요.", mood: "cool", color: "bg-gray-100" },
            { name: "애교 냥이", emoji: "🥰", desc: "집사 무릎이 내 자리다옹~", condition: { cute: "high", random: "medium", boss: "low" }, interpretation: "사람을 좋아하고 스킨십을 즐기는 다정한 고양이입니다. 관심과 사랑을 듬뿍 표현합니다.", guide: "충분한 스킨십과 대화를 해주세요. 이름을 부르며 애정을 표현하면 더욱 애교가 늘어납니다.", mood: "happy", color: "bg-pink-100" },
            { name: "균형 냥이", emoji: "☯️", desc: "상황에 따라 적절히 행동하는 중용의 고양이", condition: { curious: "medium", alert: "medium", boss: "medium", random: "medium", cute: "medium" }, interpretation: "모든 면에서 균형 잡힌 성격입니다. 상황에 따라 유연하게 대처하며, 적응력이 뛰어납니다.", guide: "다양한 환경과 경험을 제공해주세요. 어떤 상황에서도 잘 적응하는 든든한 고양이입니다.", mood: "happy", color: "bg-gray-100" }
        ]
    },
    dog: {
        title: "댕심 테스트",
        subtitle: "우리 멍이의 진짜 성격은?",
        themeColor: "bg-[#FFC95F]",
        icon: "DogFace",
        dimensions: {
            energy: { name: "활력", emoji: "⚡", desc: "에너지 수준과 활동성" },
            humanLove: { name: "인간사랑", emoji: "❤️", desc: "사람에 대한 친화력" },
            dogFriend: { name: "동료애", emoji: "🐕", desc: "다른 강아지와의 사회성" },
            focus: { name: "집중력", emoji: "🎯", desc: "훈련 가능성과 주의력" },
            brave: { name: "용감함", emoji: "🦁", desc: "두려움에 대한 반응" },
            persist: { name: "끈기", emoji: "💪", desc: "목표를 향한 집념" }
        },
        questions: [
            // EI -> humanLove + dogFriend
            { q: "산책 중 다른 강아지를 만났을 때?", dimension: "dogFriend", a: [{ text: "안녕! 꼬리 흔들며 격하게 인사한다.", score: 5 }, { text: "보호자 뒤로 숨거나 못 본 척 지나간다.", score: 1 }] },
            { q: "애견 카페에 갔을 때?", dimension: "dogFriend", a: [{ text: "우다다! 친구들과 어울려 뛰어논다.", score: 5 }, { text: "내 무릎 위나 의자 밑에만 있는다.", score: 1 }] },
            { q: "집에 손님이 왔을 때?", dimension: "humanLove", a: [{ text: "누구세요! 짖으면서도 꼬리는 흔든다.", score: 5 }, { text: "방에 들어가서 나올 생각을 안 한다.", score: 1 }] },
            // SN -> focus
            { q: "산책할 때 나는?", dimension: "focus", a: [{ text: "땅바닥 냄새 맡느라 앞으로 못 간다.", score: 1 }, { text: "나비나 새를 쫓아다니느라 정신없다.", score: 1 }] },
            { q: "간식을 숨겨놨을 때?", dimension: "focus", a: [{ text: "킁킁! 냄새를 따라 정확히 찾아낸다.", score: 5 }, { text: "어디 있지? 엉뚱한 곳을 파거나 짖는다.", score: 1 }] },
            { q: "보호자가 옷을 입을 때?", dimension: "focus", a: [{ text: "산책 가는 옷인지 출근복인지 귀신같이 안다.", score: 5 }, { text: "옷만 입으면 무조건 나가는 줄 알고 신난다.", score: 1 }] },
            // TF -> brave
            { q: "혼났을 때 반응은?", dimension: "brave", a: [{ text: "뭐가 문젠데? 억울하다는 듯 쳐다본다.", score: 5 }, { text: "잘못했어요... 배를 보이며 납작 엎드린다.", score: 1 }] },
            { q: "보호자가 울고 있을 때?", dimension: "humanLove", a: [{ text: "옆에 가만히 앉아서 지켜본다.", score: 3 }, { text: "얼굴을 핥고 안절부절못한다.", score: 5 }] },
            { q: "다른 강아지가 으르렁거릴 때?", dimension: "brave", a: [{ text: "같이 으르렁! 지지 않는다.", score: 5 }, { text: "깨갱... 꼬리를 내리고 피한다.", score: 1 }] },
            // JP -> persist
            { q: "산책 코스는?", dimension: "persist", a: [{ text: "항상 가던 길로 가야 마음이 편하다.", score: 5 }, { text: "오늘은 저쪽이다! 발길 닿는 대로 간다.", score: 1 }] },
            { q: "배변 습관은?", dimension: "focus", a: [{ text: "배변 패드 정중앙에 정확히 싼다.", score: 5 }, { text: "가끔 모서리에 싸거나 실수를 한다.", score: 1 }] },
            { q: "기다려 훈련을 할 때?", dimension: "persist", a: [{ text: "먹으라고 할 때까지 침 흘리며 참는다.", score: 5 }, { text: "못 참아! 눈치 보며 슬금슬금 먹는다.", score: 1 }] }
        ],
        questions_deep: [
            // EI deep -> humanLove + dogFriend
            { q: "엘리베이터에서 이웃을 만났을 때?", dimension: "humanLove", a: [{ text: "반갑다고 꼬리 치며 다가가려 한다.", score: 5 }, { text: "구석에 얌전히 앉아 있는다.", score: 1 }] },
            { q: "놀아달라고 할 때?", dimension: "humanLove", a: [{ text: "장난감을 물고 와서 무릎에 툭 던진다.", score: 5 }, { text: "그윽한 눈빛으로 쳐다보며 텔레파시를 보낸다.", score: 1 }] },
            { q: "TV에서 동물 소리가 날 때?", dimension: "energy", a: [{ text: "같이 짖거나 TV 앞으로 달려간다.", score: 5 }, { text: "별 관심 없이 잠만 잔다.", score: 1 }] },
            { q: "가족들이 다 모여 있을 때?", dimension: "humanLove", a: [{ text: "그 한가운데 자리를 잡고 눕는다.", score: 5 }, { text: "조용한 방이나 자기 집으로 들어간다.", score: 1 }] },
            { q: "처음 보는 강아지에게?", dimension: "dogFriend", a: [{ text: "놀자! 엉덩이를 들고 플레이 바우를 한다.", score: 5 }, { text: "냄새만 살짝 맡고 내 갈 길 간다.", score: 1 }] },
            { q: "미용실에 갔을 때?", dimension: "brave", a: [{ text: "미용사 선생님이랑 노느라 바쁘다.", score: 5 }, { text: "잔뜩 긴장해서 얼음이 된다.", score: 1 }] },
            // SN deep -> focus + energy
            { q: "거울 속의 자신을 볼 때?", dimension: "focus", a: [{ text: "그냥 나네. (냄새가 안 나니까 무시)", score: 5 }, { text: "누구냐 넌! 짖거나 뒤를 찾아본다.", score: 1 }] },
            { q: "산책 중 낙엽이 굴러갈 때?", dimension: "energy", a: [{ text: "바스락 소리에 귀를 쫑긋한다.", score: 3 }, { text: "살아있는 생물인 줄 알고 사냥하려 든다.", score: 5 }] },
            { q: "보호자의 표정 변화를?", dimension: "focus", a: [{ text: "목소리 톤이나 행동으로 기분을 파악한다.", score: 3 }, { text: "눈빛만 봐도 기분을 귀신같이 알아챈다.", score: 5 }] },
            { q: "장난감을 고를 때?", dimension: "energy", a: [{ text: "익숙한 공이나 인형을 선호한다.", score: 1 }, { text: "소리가 나거나 움직이는 신기한 걸 좋아한다.", score: 5 }] },
            { q: "간식 줄까? 말만 했을 때?", dimension: "focus", a: [{ text: "진짜 줄 때까지 기다린다.", score: 3 }, { text: "이미 침 흘리며 앉아 있다.", score: 5 }] },
            { q: "자다가 꿈을 꿀 때?", dimension: "energy", a: [{ text: "가끔 움찔거리는 정도다.", score: 1 }, { text: "달리기하고 짖고 난리가 난다.", score: 5 }] },
            // TF deep -> brave + humanLove
            { q: "간식을 공평하게 나눠주지 않았을 때?", dimension: "brave", a: [{ text: "내 밥그릇을 지키려고 으르렁댄다.", score: 5 }, { text: "시무룩해져서 구석으로 간다.", score: 1 }] },
            { q: "발을 밟혔을 때?", dimension: "brave", a: [{ text: "깨갱! 하고 자리를 피한다.", score: 3 }, { text: "아파 ㅠㅠ 안아달라고 매달린다.", score: 1 }] },
            { q: "목욕하기 싫을 때?", dimension: "brave", a: [{ text: "버티기! 힘으로 저항한다.", score: 5 }, { text: "불쌍한 표정으로 호소한다.", score: 1 }] },
            { q: "칭찬받았을 때?", dimension: "humanLove", a: [{ text: "당당하게 간식을 요구한다.", score: 3 }, { text: "온몸으로 기쁨을 표현하며 날뛴다.", score: 5 }] },
            { q: "보호자가 아픈 척 쓰러지면?", dimension: "humanLove", a: [{ text: "뭐해? 툭툭 건드려 본다.", score: 1 }, { text: "큰일 났다! 핥고 짖고 난리 난다.", score: 5 }] },
            { q: "서열 정리가 필요할 때?", dimension: "brave", a: [{ text: "내가 이 구역의 짱이다. 기싸움한다.", score: 5 }, { text: "평화가 좋아. 바로 배를 보인다.", score: 1 }] },
            // JP deep -> persist
            { q: "산책 시간 알림?", dimension: "persist", a: [{ text: "시간 되면 줄을 물고 온다.", score: 5 }, { text: "나가자고 할 때까지 기다린다.", score: 1 }] },
            { q: "잠자리 위치?", dimension: "persist", a: [{ text: "내 방석, 내 집. 정해진 곳에서만 잔다.", score: 5 }, { text: "소파, 침대, 바닥... 시원한 곳 찾아다닌다.", score: 1 }] },
            { q: "밥 먹는 속도?", dimension: "energy", a: [{ text: "꼭꼭 씹어서 일정하게 먹는다.", score: 1 }, { text: "숨도 안 쉬고 흡입한다.", score: 5 }] },
            { q: "새로운 개인기를 배울 때?", dimension: "focus", a: [{ text: "반복하면 금방 배운다.", score: 5 }, { text: "집중력이 짧아서 금방 딴짓한다.", score: 1 }] },
            { q: "산책 중 갈림길에서?", dimension: "persist", a: [{ text: "보호자가 이끄는 대로 잘 따라간다.", score: 3 }, { text: "내가 가고 싶은 길로 가려고 고집 부린다.", score: 5 }] },
            { q: "장난감 정리?", dimension: "focus", a: [{ text: "자기 집에 물어다 놓는다. (천재견?)", score: 5 }, { text: "온 집안에 흩뿌려 놓는다.", score: 1 }] }
        ],
        resultLabels: [
            { name: "에너자이저 멍멍이", emoji: "⚡", desc: "지치지 않는 무한 에너지의 소유자!", condition: { energy: "high", humanLove: "high", dogFriend: "high" }, interpretation: "에너지가 넘치고 사람과 다른 강아지 모두를 좋아하는 활발한 성격입니다. 어디서든 인기쟁이가 됩니다.", guide: "충분한 운동과 놀이 시간이 필수입니다. 에너지를 발산할 기회가 없으면 문제 행동으로 이어질 수 있어요.", mood: "excited", color: "bg-yellow-100" },
            { name: "집사바라기 멍멍이", emoji: "❤️", desc: "보호자가 세상의 전부인 충견!", condition: { humanLove: "high", brave: "medium", dogFriend: "low" }, interpretation: "보호자에 대한 애정이 깊고 충성스러운 성격입니다. 분리불안이 있을 수 있으니 주의가 필요합니다.", guide: "혼자 있는 시간을 조금씩 늘려가며 독립심을 키워주세요. 충분한 애정 표현도 잊지 마세요.", mood: "happy", color: "bg-pink-100" },
            { name: "리더 멍멍이", emoji: "👑", desc: "무리를 이끄는 타고난 리더!", condition: { brave: "high", persist: "high", energy: "high" }, interpretation: "용감하고 끈기 있는 리더 타입입니다. 자신감이 넘치고 목표를 향해 돌진합니다.", guide: "일관된 훈련과 명확한 규칙이 필요합니다. 리더십을 인정하되, 보호자가 진정한 리더임을 알려주세요.", mood: "cool", color: "bg-indigo-100" },
            { name: "천재 멍멍이", emoji: "🧠", desc: "한 번 보면 다 기억하는 똑똑이!", condition: { focus: "high", persist: "high", energy: "medium" }, interpretation: "집중력과 학습 능력이 뛰어난 영리한 강아지입니다. 복잡한 훈련도 금방 습득합니다.", guide: "두뇌를 자극하는 퍼즐 장난감이나 고급 훈련을 제공해주세요. 지루해하면 스스로 놀이를 만들어낼 수 있어요.", mood: "cool", color: "bg-blue-100" },
            { name: "겁쟁이 멍멍이", emoji: "🐾", desc: "세상이 무서워... 보호자만 믿어요.", condition: { brave: "low", humanLove: "high", energy: "low" }, interpretation: "겁이 많고 소심한 성격이지만, 보호자에 대한 신뢰는 깊습니다. 안전한 환경에서 편안해합니다.", guide: "무서운 상황에 천천히 노출시키며 자신감을 키워주세요. 절대 겁을 주거나 강요하지 마세요.", mood: "sad", color: "bg-purple-100" },
            { name: "파티 멍멍이", emoji: "🎉", desc: "어디서든 분위기 메이커!", condition: { energy: "high", dogFriend: "high", humanLove: "high" }, interpretation: "사교적이고 활발한 파티 동물입니다. 사람과 강아지 모두와 잘 어울립니다.", guide: "사회화 기회를 많이 제공해주세요. 애견 카페나 강아지 친구들과의 만남을 정기적으로 가져보세요.", mood: "excited", color: "bg-orange-100" },
            { name: "고집쟁이 멍멍이", emoji: "🐂", desc: "내 방식대로 할 거야!", condition: { persist: "high", brave: "high", focus: "low" }, interpretation: "고집이 세고 자기 주장이 강한 성격입니다. 한번 마음먹으면 꺾이지 않습니다.", guide: "인내심을 가지고 훈련해주세요. 강압적인 방법보다는 긍정 강화 훈련이 효과적입니다.", mood: "cool", color: "bg-red-100" },
            { name: "느긋이 멍멍이", emoji: "😴", desc: "급할 거 뭐 있어? 천천히~", condition: { energy: "low", persist: "low", brave: "medium" }, interpretation: "여유롭고 느긋한 성격입니다. 스트레스를 잘 받지 않고 어떤 환경에서도 적응합니다.", guide: "적당한 운동은 필요하지만 무리하게 활동을 강요하지 마세요. 편안한 환경을 유지해주세요.", mood: "happy", color: "bg-green-100" },
            { name: "수호자 멍멍이", emoji: "🛡️", desc: "가족을 지키는 든든한 보디가드!", condition: { brave: "high", humanLove: "high", focus: "high" }, interpretation: "가족에 대한 보호 본능이 강하고 충성스러운 수호자입니다. 경계심이 있지만 훈련으로 조절 가능합니다.", guide: "사회화 훈련을 통해 위협과 일상을 구분하게 해주세요. 과한 경계는 스트레스가 될 수 있어요.", mood: "cool", color: "bg-blue-200" },
            { name: "균형 멍멍이", emoji: "⚖️", desc: "모든 면에서 조화로운 이상적인 반려견", condition: { energy: "medium", humanLove: "medium", dogFriend: "medium", focus: "medium", brave: "medium", persist: "medium" }, interpretation: "모든 면에서 균형 잡힌 이상적인 성격입니다. 어떤 환경에서도 잘 적응하고 훈련하기 좋습니다.", guide: "다양한 경험과 훈련을 제공해주세요. 특별한 주의사항 없이 행복한 반려 생활이 가능합니다.", mood: "happy", color: "bg-gray-100" }
        ]
    }
};

// 유틸리티 함수들
const utilityFunctions = `
// 점수 레벨 판정 함수
function getScoreLevel(score, maxScore) {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 60) return "high";
    if (percentage < 40) return "low";  // 40% 미만만 LOW
    return "medium";
}

// 결과 라벨 매칭 함수
function matchResultLabel(scores, dimensions, resultLabels, questionsPerDim) {
    const levels = {};
    Object.keys(dimensions).forEach(dim => {
        const maxScore = questionsPerDim * 5;
        levels[dim] = getScoreLevel(scores[dim] || 0, maxScore);
    });

    // 조건에 맞는 결과 찾기
    for (const result of resultLabels) {
        const condition = result.condition;
        let match = true;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] !== level) {
                match = false;
                break;
            }
        }
        if (match) return result;
    }

    // 부분 매칭 (가장 많이 일치하는 결과)
    let bestMatch = resultLabels[resultLabels.length - 1];
    let bestScore = 0;
    for (const result of resultLabels) {
        const condition = result.condition;
        let matchCount = 0;
        for (const [dim, level] of Object.entries(condition)) {
            if (levels[dim] === level) matchCount++;
        }
        if (matchCount > bestScore) {
            bestScore = matchCount;
            bestMatch = result;
        }
    }
    return bestMatch;
}

window.getScoreLevel = getScoreLevel;
window.matchResultLabel = matchResultLabel;
`;

// 데이터를 JavaScript 문자열로 변환
function stringifyWithProperQuotes(obj, indent = 0) {
    const spaces = ' '.repeat(indent);
    const nextSpaces = ' '.repeat(indent + 4);

    if (obj === null) return 'null';
    if (obj === undefined) return 'undefined';
    if (typeof obj === 'string') return JSON.stringify(obj);
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);

    if (Array.isArray(obj)) {
        if (obj.length === 0) return '[]';
        const items = obj.map(item => stringifyWithProperQuotes(item, indent + 4));
        return `[\n${nextSpaces}${items.join(`,\n${nextSpaces}`)}\n${spaces}]`;
    }

    if (typeof obj === 'object') {
        const keys = Object.keys(obj);
        if (keys.length === 0) return '{}';
        const pairs = keys.map(key => {
            const value = stringifyWithProperQuotes(obj[key], indent + 4);
            // 키에 특수문자가 있으면 따옴표 사용
            const safeKey = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
            return `${safeKey}: ${value}`;
        });
        return `{\n${nextSpaces}${pairs.join(`,\n${nextSpaces}`)}\n${spaces}}`;
    }

    return String(obj);
}

// 메인 실행
const outputPath = path.join(__dirname, '..', 'data.js');

const output = `// CHEMI_DATA - 케미 테스트 데이터
// Big Five (OCEAN), Feline Five, C-BARQ 기반 성격 분석 시스템
// 생성일: ${new Date().toISOString().split('T')[0]}

const CHEMI_DATA = ${stringifyWithProperQuotes(CHEMI_DATA)};

${utilityFunctions}

window.CHEMI_DATA = CHEMI_DATA;
`;

// UTF-8로 파일 저장
fs.writeFileSync(outputPath, output, { encoding: 'utf8' });

console.log('✅ data.js 변환 완료!');
console.log(`📁 출력 경로: ${outputPath}`);
console.log(`📊 Human 질문 수: ${CHEMI_DATA.human.questions.length + CHEMI_DATA.human.questions_deep.length}`);
console.log(`📊 Cat 질문 수: ${CHEMI_DATA.cat.questions.length + CHEMI_DATA.cat.questions_deep.length}`);
console.log(`📊 Dog 질문 수: ${CHEMI_DATA.dog.questions.length + CHEMI_DATA.dog.questions_deep.length}`);
