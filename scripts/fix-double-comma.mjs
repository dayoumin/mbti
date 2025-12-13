/**
 * data.js와 분리된 파일에서 이중 콤마(,,) 오류 수정
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// 수정할 파일 목록
const filesToFix = [
    'data.js',
    'data/subjects/rabbit.js',
    'data/subjects/hamster.js'
];

console.log('=== 이중 콤마 수정 ===\n');

for (const file of filesToFix) {
    const filePath = path.join(projectRoot, file);

    if (!fs.existsSync(filePath)) {
        console.log(`Skip: ${file} (파일 없음)`);
        continue;
    }

    let content = fs.readFileSync(filePath, 'utf-8');
    const original = content;

    // 이중 콤마 수정: },, -> },
    // 배열 내 빈 요소: [item1,, item2] -> [item1, item2]
    content = content.replace(/,\s*,/g, ',');

    if (content !== original) {
        fs.writeFileSync(filePath, content, 'utf-8');
        console.log(`Fixed: ${file}`);
    } else {
        console.log(`OK: ${file} (수정 필요 없음)`);
    }
}

console.log('\n=== 완료 ===');
