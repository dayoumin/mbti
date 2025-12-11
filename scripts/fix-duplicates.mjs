/**
 * 중복 질문 수정 스크립트
 *
 * 수정 대상:
 * 1. cat/questions_deep[24]: "낯선 손님이 집에 왔을 때?" → 다른 질문으로
 * 2. dog/questions_deep[25]: "산책 중 다른 강아지를 만났을 때?" → 다른 질문으로
 *
 * 사용법: node scripts/fix-duplicates.mjs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataPath = path.join(__dirname, '..', 'data.js');
let content = fs.readFileSync(dataPath, 'utf8');

console.log('🔧 중복 질문 수정 시작...\n');

// 1. Cat alert 중복 수정
// "낯선 손님이 집에 왔을 때?" → "집 근처에서 공사 소리가 날 때?"
const catDuplicate = {
    old: `{
                q: "낯선 손님이 집에 왔을 때?",
                dimension: "alert",
                a: [
                    { text: "어디 숨을 데 없나... 침대 밑으로 사라진다.", score: 5 },
                    { text: "누구냥? 일단 다가가서 냄새 맡아본다.", score: 1 }
                ]
            }`,
    new: `{
                q: "집 근처에서 공사 소리가 날 때?",
                dimension: "alert",
                a: [
                    { text: "스트레스 만렙! 가장 조용한 곳으로 피신한다.", score: 5 },
                    { text: "시끄럽네. 그래도 적응하며 일상을 보낸다.", score: 1 }
                ]
            }`
};

if (content.includes(catDuplicate.old)) {
    content = content.replace(catDuplicate.old, catDuplicate.new);
    console.log('✅ 수정: cat/alert "낯선 손님이 집에 왔을 때?" → "집 근처에서 공사 소리가 날 때?"');
} else {
    console.log('⚠️  건너뜀: cat/alert 중복 (찾을 수 없음)');
}

// 2. Dog dogFriend 중복 수정
// "산책 중 다른 강아지를 만났을 때?" → "동네 단골 강아지 친구를 만났을 때?"
const dogDuplicate = {
    old: `{
                q: "산책 중 다른 강아지를 만났을 때?",
                dimension: "dogFriend",
                a: [
                    { text: "친구다! 꼬리 흔들며 인사하러 간다.", score: 5 },
                    { text: "경계 모드. 보호자 뒤에 숨는다.", score: 1 }
                ]
            }`,
    new: `{
                q: "동네 단골 강아지 친구를 만났을 때?",
                dimension: "dogFriend",
                a: [
                    { text: "오랜만이야! 격하게 반기며 놀자고 한다.", score: 5 },
                    { text: "아는 사이지만 시큰둥하게 지나친다.", score: 1 }
                ]
            }`
};

if (content.includes(dogDuplicate.old)) {
    content = content.replace(dogDuplicate.old, dogDuplicate.new);
    console.log('✅ 수정: dog/dogFriend "산책 중 다른 강아지를 만났을 때?" → "동네 단골 강아지 친구를 만났을 때?"');
} else {
    console.log('⚠️  건너뜀: dog/dogFriend 중복 (찾을 수 없음)');
}

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf8');

console.log('\n✅ 중복 수정 완료!');
console.log('\n검증 스크립트를 다시 실행하세요:');
console.log('  node scripts/validate-questions.mjs');
