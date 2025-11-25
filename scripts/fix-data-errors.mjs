/**
 * data.js 오류 수정 스크립트 (v3)
 *
 * 수정 사항:
 * 1. dog "산책할 때 나는?" - 점수가 둘 다 1인 문제 수정
 * 2. cat questions 배열 끝에 alert 질문 추가
 * 3. cat questions 배열 끝에 cute 질문 추가
 * 4. dog questions 배열 끝에 energy 질문 2개 추가
 * 5. dog dogFriend 질문 추가 (3개 → 4개)
 *
 * 사용법: node scripts/fix-data-errors.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'data.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('🔧 data.js 오류 수정 시작...\n');

// 1. dog "산책할 때 나는?" 점수 수정
// 검색할 패턴 (현재)
const dogWalkPattern = /\{\s*q:\s*"산책할\s*때\s*나는\?",\s*dimension:\s*"focus",\s*a:\s*\[\s*\{\s*text:\s*"땅바닥 냄새 맡느라 앞으로 못 간다\.",\s*score:\s*1\s*\}/;

if (dogWalkPattern.test(content)) {
    content = content.replace(
        /(\{\s*q:\s*"산책할\s*때\s*나는\?",\s*dimension:\s*"focus",\s*a:\s*\[\s*\{\s*text:\s*"땅바닥 냄새 맡느라 앞으로 못 간다\.",\s*score:\s*)1(\s*\})/,
        '$15$2'
    );
    console.log('✅ 수정: dog "산책할 때 나는?" 점수 (1,1 → 5,1)');
} else {
    console.log('⚠️  건너뜀: dog "산책할 때 나는?" (이미 수정됨 또는 찾을 수 없음)');
}

// 2. cat questions 배열 끝에 질문 추가
// 라인 1101-1102: }        ],        questions_deep: [
// cat questions_deep 시작 직전에 삽입

const catQuestionsDeepStart = content.indexOf('questions_deep: [', content.indexOf('cat: {'));
const catQuestionsEndPos = content.lastIndexOf(']', catQuestionsDeepStart);

const newCatAlertQuestion = `,
            {
                q: "갑자기 큰 소리가 났을 때?",
                dimension: "alert",
                a: [
                    {
                        text: "화들짝! 높은 곳으로 대피한다.",
                        score: 5
                    },
                    {
                        text: "뭐지? 고개만 돌려서 확인한다.",
                        score: 1
                    }
                ]
            }`;

const newCatCuteQuestion = `,
            {
                q: "쓰다듬어 줄 때?",
                dimension: "cute",
                a: [
                    {
                        text: "그르렁~ 몸을 맡기고 배를 보여준다.",
                        score: 5
                    },
                    {
                        text: "적당히 받다가 손을 물거나 피한다.",
                        score: 1
                    }
                ]
            }`;

// cat에 질문 추가
if (!content.includes('갑자기 큰 소리가 났을 때?')) {
    // cat questions 배열 끝 위치 찾기 (정확한 위치)
    const catSection = content.indexOf('cat: {');
    const catQDeepStart = content.indexOf('questions_deep: [', catSection);
    const catQEnd = content.lastIndexOf(']', catQDeepStart);

    // ] 직전에 삽입
    content = content.slice(0, catQEnd) + newCatAlertQuestion + content.slice(catQEnd);
    console.log('✅ 추가: cat/alert 기본 질문 "갑자기 큰 소리가 났을 때?"');
} else {
    console.log('⚠️  건너뜀: cat/alert 질문 (이미 존재)');
}

if (!content.includes('쓰다듬어 줄 때?')) {
    const catSection = content.indexOf('cat: {');
    const catQDeepStart = content.indexOf('questions_deep: [', catSection);
    const catQEnd = content.lastIndexOf(']', catQDeepStart);

    content = content.slice(0, catQEnd) + newCatCuteQuestion + content.slice(catQEnd);
    console.log('✅ 추가: cat/cute 기본 질문 "쓰다듬어 줄 때?"');
} else {
    console.log('⚠️  건너뜀: cat/cute 질문 (이미 존재)');
}

// 3. dog questions 배열 끝에 energy 질문 추가
const newDogEnergyQuestion1 = `,
            {
                q: "아침에 일어났을 때?",
                dimension: "energy",
                a: [
                    {
                        text: "세상 밖으로! 신나게 뛰어다니며 아침을 시작한다.",
                        score: 5
                    },
                    {
                        text: "아직 졸려... 늘어지게 기지개만 켠다.",
                        score: 1
                    }
                ]
            }`;

const newDogEnergyQuestion2 = `,
            {
                q: "집에서 보내는 시간은?",
                dimension: "energy",
                a: [
                    {
                        text: "장난감 물고 뛰어다니며 혼자 논다.",
                        score: 5
                    },
                    {
                        text: "창가에서 멍하니 바깥을 구경한다.",
                        score: 1
                    }
                ]
            }`;

const newDogFriendQuestion = `,
            {
                q: "강아지 유치원이나 훈련소에서?",
                dimension: "dogFriend",
                a: [
                    {
                        text: "다른 강아지들과 잘 어울리며 즐거워한다.",
                        score: 5
                    },
                    {
                        text: "구석에서 혼자 있거나 사람만 찾는다.",
                        score: 1
                    }
                ]
            }`;

if (!content.includes('아침에 일어났을 때?')) {
    const dogSection = content.indexOf('dog: {');
    const dogQDeepStart = content.indexOf('questions_deep: [', dogSection);
    const dogQEnd = content.lastIndexOf(']', dogQDeepStart);

    content = content.slice(0, dogQEnd) + newDogEnergyQuestion1 + newDogEnergyQuestion2 + content.slice(dogQEnd);
    console.log('✅ 추가: dog/energy 기본 질문 2개');
} else {
    console.log('⚠️  건너뜀: dog/energy 질문 (이미 존재)');
}

// 4. dog dogFriend 심화 질문 추가
if (!content.includes('강아지 유치원이나 훈련소에서?')) {
    // dog questions_deep 배열 끝에 추가
    const dogSection = content.indexOf('dog: {');
    const dogQDeepStart = content.indexOf('questions_deep: [', dogSection);
    const dogResultLabelsStart = content.indexOf('resultLabels:', dogSection);
    const dogQDeepEnd = content.lastIndexOf(']', dogResultLabelsStart);

    content = content.slice(0, dogQDeepEnd) + newDogFriendQuestion + content.slice(dogQDeepEnd);
    console.log('✅ 추가: dog/dogFriend 심화 질문 "강아지 유치원이나 훈련소에서?"');
} else {
    console.log('⚠️  건너뜀: dog/dogFriend 질문 (이미 존재)');
}

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf8');

console.log('\n✅ data.js 수정 완료!');
console.log('\n검증 스크립트를 다시 실행하세요:');
console.log('  node scripts/validate-questions.mjs');
