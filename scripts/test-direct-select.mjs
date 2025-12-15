/**
 * 직접 선택 모드 테스트
 * petMatch → 세부 테스트 직접 연결 기능 검증
 *
 * TypeScript 모듈을 직접 로드하기 어려우므로 petMatch.ts 파일을 직접 파싱
 */

import fs from 'fs';
import path from 'path';

console.log('=== 직접 선택 모드 테스트 ===\n');

// 1. petMatch.ts 파일 읽기
const petMatchPath = path.join(process.cwd(), 'src/data/subjects/petMatch.ts');
const petMatchContent = fs.readFileSync(petMatchPath, 'utf-8');

// resultLabels 섹션만 추출
const resultLabelsMatch = petMatchContent.match(/"resultLabels":\s*\[([\s\S]*)\]/);
if (!resultLabelsMatch) {
    console.error('❌ resultLabels를 찾을 수 없습니다!');
    process.exit(1);
}
const resultLabelsSection = resultLabelsMatch[1];

// 각 결과 객체에서 name과 nextTest 추출
const resultBlockRegex = /\{\s*"name":\s*"([^"]+)"[\s\S]*?"nextTest":\s*"([^"]+)"\s*\}/g;
const matches = [...resultLabelsSection.matchAll(resultBlockRegex)];

console.log('--- petMatch 결과별 nextTest 연결 확인 ---\n');

let hasError = false;
const directSelectOptions = [];

// 세부 테스트 파일 존재 확인
const subjectsDir = path.join(process.cwd(), 'src/data/subjects');

matches.forEach((match, idx) => {
    const [, name, nextTest] = match;

    // 해당 테스트 파일 존재 확인
    const testFile = path.join(subjectsDir, `${nextTest}.ts`);
    const fileExists = fs.existsSync(testFile);

    if (!fileExists) {
        console.error(`❌ [${idx + 1}] ${name}: nextTest="${nextTest}" 파일이 없음!`);
        hasError = true;
        return;
    }

    // 결과 개수 확인 (대략적)
    const testContent = fs.readFileSync(testFile, 'utf-8');
    const resultCount = (testContent.match(/"name":\s*"/g) || []).length;

    console.log(`✅ [${idx + 1}] ${name} → ${nextTest} (약 ${resultCount}개 결과)`);
    directSelectOptions.push({ name, nextTest, resultCount });
});

// 2. config.ts에서 세부 테스트 설정 확인
console.log('\n--- SUBJECT_CONFIG 확인 ---\n');
const configPath = path.join(process.cwd(), 'src/data/config.ts');
const configContent = fs.readFileSync(configPath, 'utf-8');

directSelectOptions.forEach(opt => {
    const hasConfig = configContent.includes(`${opt.nextTest}:`);
    if (hasConfig) {
        console.log(`✅ ${opt.nextTest}: SUBJECT_CONFIG에 설정 있음`);
    } else {
        console.error(`❌ ${opt.nextTest}: SUBJECT_CONFIG에 설정 없음!`);
        hasError = true;
    }
});

// 3. page.js에서 직접 선택 로직 확인
console.log('\n--- page.js 직접 선택 로직 확인 ---\n');
const pageJsPath = path.join(process.cwd(), 'src/app/page.js');
const pageJsContent = fs.readFileSync(pageJsPath, 'utf-8');

const checks = [
    { pattern: 'step === "directSelect"', desc: 'directSelect step 조건' },
    { pattern: "mode === 'petMatch'", desc: 'petMatch 모드 체크' },
    { pattern: 'setStep("directSelect")', desc: 'intro에서 directSelect로 전환' },
    { pattern: 'directSelect: true', desc: 'parentInfo에 directSelect 플래그' },
    { pattern: '잘 모르겠어요, 추천받을래요', desc: '추천받기 폴백 버튼' },
];

checks.forEach(({ pattern, desc }) => {
    if (pageJsContent.includes(pattern)) {
        console.log(`✅ ${desc}`);
    } else {
        console.error(`❌ ${desc} - 패턴 없음: ${pattern}`);
        hasError = true;
    }
});

// 4. 결과 요약
console.log('\n=== 테스트 결과 ===\n');
if (hasError) {
    console.error('❌ 테스트 실패 - 위 오류를 확인하세요');
    process.exit(1);
} else {
    console.log('✅ 모든 테스트 통과!');
    console.log(`   - 직접 선택 가능한 동물: ${directSelectOptions.length}개`);
    directSelectOptions.forEach((opt, i) => {
        console.log(`     ${i + 1}. ${opt.name} → ${opt.nextTest}`);
    });
}
