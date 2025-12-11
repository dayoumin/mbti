/**
 * SUBJECT_CONFIG 추가 스크립트
 * - Subject 메타데이터를 data.js에 추가
 * - App.js와 ModeTabs.js에서 동적으로 참조 가능
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.join(__dirname, '..', 'data.js');

// SUBJECT_CONFIG 정의
const SUBJECT_CONFIG = `
// Subject 설정 - 새 테스트 추가시 여기에만 추가하면 됨
const SUBJECT_CONFIG = {
    human: {
        icon: "HumanIcon",
        label: "사람",
        intro: ["나는 어떤 사람일까?", "나의 숨겨진 성격은?", "친구들이 보는 나는?"],
        resultFormat: "simple",  // simple: 단순 형식, tabs: 탭형 (심층해석/육아팁)
        deepButtonText: "내 성격"
    },
    cat: {
        icon: "CatFace",
        label: "고양이",
        intro: ["철학 냥이?", "보스 냥이?", "인싸 냥이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 냥이"
    },
    dog: {
        icon: "DogFace",
        label: "강아지",
        intro: ["규율 멍멍이?", "파티 멍멍이?", "CEO 멍멍이?"],
        resultFormat: "tabs",
        deepButtonText: "우리 멍이"
    }
};

window.SUBJECT_CONFIG = SUBJECT_CONFIG;
`;

// data.js 읽기
let content = fs.readFileSync(dataPath, 'utf-8');

// 이미 SUBJECT_CONFIG가 있는지 확인
if (content.includes('SUBJECT_CONFIG')) {
    console.log('⚠️  SUBJECT_CONFIG가 이미 존재합니다.');
    process.exit(0);
}

// window.CHEMI_DATA = CHEMI_DATA; 앞에 삽입
const insertPoint = 'window.CHEMI_DATA = CHEMI_DATA;';
if (!content.includes(insertPoint)) {
    console.error('❌ 삽입 위치를 찾을 수 없습니다.');
    process.exit(1);
}

content = content.replace(insertPoint, SUBJECT_CONFIG + '\n' + insertPoint);

// 파일 저장
fs.writeFileSync(dataPath, content, 'utf-8');

console.log('✅ SUBJECT_CONFIG 추가 완료!');
console.log('');
console.log('다음 단계:');
console.log('1. App.js에서 SUBJECT_CONFIG 참조하도록 수정');
console.log('2. ModeTabs.js에서 동적 탭 생성하도록 수정');
