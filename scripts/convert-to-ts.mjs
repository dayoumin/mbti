// Subject JS 파일을 TypeScript로 변환하는 스크립트
import fs from 'fs';
import path from 'path';

const subjectsDir = path.join(process.cwd(), 'data/subjects');
const outputDir = path.join(process.cwd(), 'next-app/src/data/subjects');

// 출력 디렉토리 생성
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 각 subject 파일 처리
const subjects = ['cat', 'dog', 'rabbit', 'hamster', 'idealType', 'plant', 'petMatch', 'coffee'];

for (const subject of subjects) {
  const inputFile = path.join(subjectsDir, `${subject}.js`);
  const outputFile = path.join(outputDir, `${subject}.ts`);

  if (!fs.existsSync(inputFile)) {
    console.log(`파일 없음: ${inputFile}`);
    continue;
  }

  let content = fs.readFileSync(inputFile, 'utf-8');

  // 상수명 추출 (예: CAT_DATA, DOG_DATA 등)
  const constMatch = content.match(/const\s+(\w+_DATA)\s*=/);
  if (!constMatch) {
    console.log(`상수 패턴 없음: ${subject}`);
    continue;
  }
  const constName = constMatch[1];
  const camelName = subject + 'Data';

  // 변환
  // 1. 주석 제거
  content = content.replace(/^\/\/.*\n/gm, '');

  // 2. const XXX_DATA = { ... } 부분 추출
  const dataStart = content.indexOf(`const ${constName}`);
  let braceCount = 0;
  let dataEnd = dataStart;
  let inString = false;
  let stringChar = '';

  for (let i = content.indexOf('{', dataStart); i < content.length; i++) {
    const char = content[i];
    const prevChar = i > 0 ? content[i-1] : '';

    // 문자열 처리
    if ((char === '"' || char === "'" || char === '`') && prevChar !== '\\') {
      if (!inString) {
        inString = true;
        stringChar = char;
      } else if (char === stringChar) {
        inString = false;
      }
    }

    if (!inString) {
      if (char === '{') braceCount++;
      if (char === '}') {
        braceCount--;
        if (braceCount === 0) {
          dataEnd = i + 1;
          break;
        }
      }
    }
  }

  const dataContent = content.substring(content.indexOf('{', dataStart), dataEnd);

  // TypeScript 파일 생성
  const tsContent = `// ${subject} 테스트 데이터

import { SubjectData } from '../types';

export const ${camelName}: SubjectData = ${dataContent};
`;

  fs.writeFileSync(outputFile, tsContent, 'utf-8');
  console.log(`변환 완료: ${subject}.ts`);
}

console.log('\n모든 변환 완료!');
