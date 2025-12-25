/**
 * PWA 아이콘 생성 스크립트
 * SVG를 다양한 크기의 PNG로 변환
 *
 * 사용법: node scripts/generate-icons.mjs
 * 필요: npm install sharp
 */

import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const ICONS_DIR = path.join(__dirname, '..', 'icons');
const SVG_PATH = path.join(ICONS_DIR, 'icon.svg');

// manifest.json에 정의된 아이콘 크기들
const SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

async function generateIcons() {
    console.log('🎨 PWA 아이콘 생성 시작...\n');

    // SVG 파일 확인
    if (!fs.existsSync(SVG_PATH)) {
        console.error('❌ icon.svg 파일을 찾을 수 없습니다:', SVG_PATH);
        process.exit(1);
    }

    const svgBuffer = fs.readFileSync(SVG_PATH);
    let successCount = 0;

    for (const size of SIZES) {
        const outputPath = path.join(ICONS_DIR, `icon-${size}x${size}.png`);

        try {
            await sharp(svgBuffer)
                .resize(size, size)
                .png()
                .toFile(outputPath);

            console.log(`  ✅ icon-${size}x${size}.png 생성 완료`);
            successCount++;
        } catch (error) {
            console.error(`  ❌ icon-${size}x${size}.png 생성 실패:`, error.message);
        }
    }

    console.log(`\n🎉 완료! ${successCount}/${SIZES.length}개 아이콘 생성됨`);
    console.log(`📁 위치: ${ICONS_DIR}`);
}

generateIcons().catch(console.error);
