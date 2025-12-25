/**
 * 질문 확장 스크립트 v2
 *
 * 목표: 122개 → 약 150개
 * - Cat: alert +5, cute +3, boss +2, random +2 = +12
 * - Dog: dogFriend +4, persist +3, energy +1, humanLove +1, brave +1 = +10
 * - Human: mental +1, adventure +1 = +2 (균형 조정)
 *
 * 사용법: node scripts/add-questions-v2.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'data.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('📝 질문 확장 시작...\n');

let addCount = 0;

// ============================================
// CAT 질문 추가
// ============================================

// Cat alert (경계심) +5
const catAlertQuestions = [
    `{
                q: "낯선 손님이 집에 왔을 때?",
                dimension: "alert",
                a: [
                    { text: "어디 숨을 데 없나... 침대 밑으로 사라진다.", score: 5 },
                    { text: "누구냥? 일단 다가가서 냄새 맡아본다.", score: 1 }
                ]
            }`,
    `{
                q: "창문 밖에서 이상한 소리가 날 때?",
                dimension: "alert",
                a: [
                    { text: "귀를 쫑긋! 꼬리 부풀리고 경계 태세.", score: 5 },
                    { text: "뭐지? 창가로 가서 구경한다.", score: 1 }
                ]
            }`,
    `{
                q: "집사가 캐리어를 꺼냈을 때?",
                dimension: "alert",
                a: [
                    { text: "위험 감지! 순간이동으로 사라진다.", score: 5 },
                    { text: "저건 뭐하는 거지? 관심 있게 본다.", score: 1 }
                ]
            }`,
    `{
                q: "처음 보는 물건이 집에 생겼을 때?",
                dimension: "alert",
                a: [
                    { text: "멀리서 관찰... 며칠간 조심스럽게 접근.", score: 5 },
                    { text: "신상이다! 바로 올라타거나 냄새 맡는다.", score: 1 }
                ]
            }`,
    `{
                q: "집사가 평소와 다른 행동을 할 때?",
                dimension: "alert",
                a: [
                    { text: "뭔가 수상해... 눈을 떼지 않고 감시한다.", score: 5 },
                    { text: "관심 없다옹. 내 할 일 한다.", score: 1 }
                ]
            }`
];

// Cat cute (애교력) +3
const catCuteQuestions = [
    `{
                q: "집사가 다른 동물 영상을 볼 때?",
                dimension: "cute",
                a: [
                    { text: "야옹~ 나를 봐달라고 화면 앞을 막는다.", score: 5 },
                    { text: "마음대로 해라. 나는 창밖을 본다.", score: 1 }
                ]
            }`,
    `{
                q: "집사 무릎이 비어있을 때?",
                dimension: "cute",
                a: [
                    { text: "자리 확보! 바로 올라가서 자리 잡는다.", score: 5 },
                    { text: "내 자리는 따로 있다. 캣타워로 간다.", score: 1 }
                ]
            }`,
    `{
                q: "츄르를 받고 싶을 때?",
                dimension: "cute",
                a: [
                    { text: "머리 부비부비~ 온갖 애교로 구걸한다.", score: 5 },
                    { text: "서랍 앞에서 무언의 압박을 가한다.", score: 1 }
                ]
            }`
];

// Cat boss (보스기질) +2
const catBossQuestions = [
    `{
                q: "집사가 내 자리에 앉았을 때?",
                dimension: "boss",
                a: [
                    { text: "이건 내 자리다! 째려보며 앉으라고 압박.", score: 5 },
                    { text: "다른 데 가면 되지. 옆으로 간다.", score: 1 }
                ]
            }`,
    `{
                q: "밥 시간이 늦어졌을 때?",
                dimension: "boss",
                a: [
                    { text: "밥! 밥! 밥! 시끄럽게 항의한다.", score: 5 },
                    { text: "오겠지... 기다린다.", score: 1 }
                ]
            }`
];

// Cat random (엉뚱함) +2
const catRandomQuestions = [
    `{
                q: "한밤중에 갑자기?",
                dimension: "random",
                a: [
                    { text: "운동회 시작! 집안을 미친 듯이 뛴다.", score: 5 },
                    { text: "푹 자고 있다. 새벽형 고양이 아님.", score: 1 }
                ]
            }`,
    `{
                q: "빈 박스와 비싼 캣타워가 있을 때?",
                dimension: "random",
                a: [
                    { text: "박스 최고! 캣타워는 장식이다.", score: 5 },
                    { text: "캣타워로 간다. 높은 곳이 좋다.", score: 1 }
                ]
            }`
];

// ============================================
// DOG 질문 추가
// ============================================

// Dog dogFriend (동료애) +4
const dogFriendQuestions = [
    `{
                q: "산책 중 다른 강아지를 만났을 때?",
                dimension: "dogFriend",
                a: [
                    { text: "친구다! 꼬리 흔들며 인사하러 간다.", score: 5 },
                    { text: "경계 모드. 보호자 뒤에 숨는다.", score: 1 }
                ]
            }`,
    `{
                q: "강아지 놀이터에서?",
                dimension: "dogFriend",
                a: [
                    { text: "모든 강아지와 어울리며 신나게 논다.", score: 5 },
                    { text: "보호자 곁에만 있으려 한다.", score: 1 }
                ]
            }`,
    `{
                q: "집에 다른 강아지가 놀러 왔을 때?",
                dimension: "dogFriend",
                a: [
                    { text: "환영해! 장난감 가져와서 같이 놀자고 한다.", score: 5 },
                    { text: "내 영역이야! 으르렁거린다.", score: 1 }
                ]
            }`,
    `{
                q: "다른 강아지가 먼저 다가올 때?",
                dimension: "dogFriend",
                a: [
                    { text: "반가워! 코 인사하며 친해진다.", score: 5 },
                    { text: "불편해... 피하려 한다.", score: 1 }
                ]
            }`
];

// Dog persist (끈기) +3
const dogPersistQuestions = [
    `{
                q: "좋아하는 장난감이 소파 밑에 들어갔을 때?",
                dimension: "persist",
                a: [
                    { text: "절대 포기 안 해! 계속 파고든다.", score: 5 },
                    { text: "아쉽지만... 다른 장난감을 찾는다.", score: 1 }
                ]
            }`,
    `{
                q: "보호자가 '안 돼'라고 했는데 하고 싶을 때?",
                dimension: "persist",
                a: [
                    { text: "끈질기게 눈치 보며 재시도한다.", score: 5 },
                    { text: "알겠어... 순순히 포기한다.", score: 1 }
                ]
            }`,
    `{
                q: "산책 중 가고 싶은 곳이 있을 때?",
                dimension: "persist",
                a: [
                    { text: "줄을 당기며 그쪽으로 가려 한다.", score: 5 },
                    { text: "보호자 리드에 따른다.", score: 1 }
                ]
            }`
];

// Dog energy (활력) +1
const dogEnergyQuestions = [
    `{
                q: "비 오는 날 산책을 못 갈 때?",
                dimension: "energy",
                a: [
                    { text: "에너지 폭발! 집안에서 뛰어다닌다.", score: 5 },
                    { text: "오늘은 쉬는 날~ 잠만 잔다.", score: 1 }
                ]
            }`
];

// Dog humanLove (인간사랑) +1
const dogHumanLoveQuestions = [
    `{
                q: "보호자가 외출 준비를 할 때?",
                dimension: "humanLove",
                a: [
                    { text: "안 돼! 현관문 앞에서 애절한 눈빛.", score: 5 },
                    { text: "갔다 와~ 자기 자리로 간다.", score: 1 }
                ]
            }`
];

// Dog brave (용감함) +1
const dogBraveQuestions = [
    `{
                q: "우산 펴는 소리를 들었을 때?",
                dimension: "brave",
                a: [
                    { text: "뭐야? 다가가서 확인한다.", score: 5 },
                    { text: "무서워! 뒤로 물러난다.", score: 1 }
                ]
            }`
];

// ============================================
// HUMAN 질문 추가
// ============================================

// Human mental (멘탈력) +1
const humanMentalQuestions = [
    `{
                q: "열심히 준비한 일이 결과가 안 좋았을 때?",
                dimension: "mental",
                a: [
                    { text: "다음엔 더 잘하면 돼. 피드백 삼아 넘긴다.", score: 5 },
                    { text: "한동안 무기력하고 자책하게 된다.", score: 1 }
                ]
            }`
];

// Human adventure (모험심) +1
const humanAdventureQuestions = [
    `{
                q: "해외여행에서 길을 잃었을 때?",
                dimension: "adventure",
                a: [
                    { text: "오히려 좋아! 예상 못한 장소를 탐험한다.", score: 5 },
                    { text: "불안해서 빨리 원래 경로로 돌아가려 한다.", score: 1 }
                ]
            }`
];

// ============================================
// 삽입 함수
// ============================================

function insertQuestionsDeep(mode, questions) {
    // mode의 questions_deep 배열 끝에 삽입
    const modeSection = content.indexOf(`${mode}: {`);
    const resultLabelsStart = content.indexOf('resultLabels:', modeSection);
    const questionsDeepEnd = content.lastIndexOf(']', resultLabelsStart);

    const insertStr = ',\n            ' + questions.join(',\n            ');
    content = content.slice(0, questionsDeepEnd) + insertStr + content.slice(questionsDeepEnd);

    return questions.length;
}

// ============================================
// 실행
// ============================================

// Cat 추가
console.log('🐱 CAT 질문 추가:');
addCount += insertQuestionsDeep('cat', catAlertQuestions);
console.log(`  ✅ alert (경계심) +${catAlertQuestions.length}`);

// content 다시 읽기 (위치 변경됨)
addCount += insertQuestionsDeep('cat', catCuteQuestions);
console.log(`  ✅ cute (애교력) +${catCuteQuestions.length}`);

addCount += insertQuestionsDeep('cat', catBossQuestions);
console.log(`  ✅ boss (보스기질) +${catBossQuestions.length}`);

addCount += insertQuestionsDeep('cat', catRandomQuestions);
console.log(`  ✅ random (엉뚱함) +${catRandomQuestions.length}`);

// Dog 추가
console.log('\n🐕 DOG 질문 추가:');
addCount += insertQuestionsDeep('dog', dogFriendQuestions);
console.log(`  ✅ dogFriend (동료애) +${dogFriendQuestions.length}`);

addCount += insertQuestionsDeep('dog', dogPersistQuestions);
console.log(`  ✅ persist (끈기) +${dogPersistQuestions.length}`);

addCount += insertQuestionsDeep('dog', dogEnergyQuestions);
console.log(`  ✅ energy (활력) +${dogEnergyQuestions.length}`);

addCount += insertQuestionsDeep('dog', dogHumanLoveQuestions);
console.log(`  ✅ humanLove (인간사랑) +${dogHumanLoveQuestions.length}`);

addCount += insertQuestionsDeep('dog', dogBraveQuestions);
console.log(`  ✅ brave (용감함) +${dogBraveQuestions.length}`);

// Human 추가
console.log('\n👤 HUMAN 질문 추가:');
addCount += insertQuestionsDeep('human', humanMentalQuestions);
console.log(`  ✅ mental (멘탈력) +${humanMentalQuestions.length}`);

addCount += insertQuestionsDeep('human', humanAdventureQuestions);
console.log(`  ✅ adventure (모험심) +${humanAdventureQuestions.length}`);

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf8');

console.log(`\n✅ 총 ${addCount}개 질문 추가 완료!`);
console.log('\n검증 스크립트를 실행하세요:');
console.log('  node scripts/validate-questions.mjs');
