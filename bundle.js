/**
 * MBTI 테스트 앱 번들링 스크립트
 * 모든 외부 의존성을 인라인으로 포함한 단일 HTML 파일 생성
 */

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

const DIST_DIR = path.join(__dirname, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'index.html');

// 다운로드할 외부 리소스
const RESOURCES = {
    react: 'https://unpkg.com/react@18/umd/react.production.min.js',
    reactDom: 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js',
    babel: 'https://unpkg.com/@babel/standalone/babel.min.js',
    juaFontCss: 'https://fonts.googleapis.com/css2?family=Jua&display=swap'
};

// URL에서 콘텐츠 다운로드
function downloadFile(url) {
    return new Promise((resolve, reject) => {
        const parsedUrl = new URL(url);
        const protocol = parsedUrl.protocol === 'https:' ? https : http;

        protocol.get(url, (response) => {
            // 리다이렉트 처리
            if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
                let redirectUrl = response.headers.location;
                // 상대 URL 처리
                if (!redirectUrl.startsWith('http')) {
                    redirectUrl = `${parsedUrl.protocol}//${parsedUrl.host}${redirectUrl}`;
                }
                downloadFile(redirectUrl).then(resolve).catch(reject);
                return;
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
                return;
            }

            const chunks = [];
            response.on('data', chunk => chunks.push(chunk));
            response.on('end', () => resolve(Buffer.concat(chunks)));
            response.on('error', reject);
        }).on('error', reject);
    });
}

// 메인 번들링 함수
async function bundle() {
    console.log('🚀 번들링 시작...\n');

    // dist 디렉토리 확인
    if (!fs.existsSync(DIST_DIR)) {
        fs.mkdirSync(DIST_DIR);
    }

    // 1. 외부 JS 라이브러리 다운로드
    console.log('📦 외부 라이브러리 다운로드 중...');

    const [reactJs, reactDomJs, babelJs, juaFontCss] = await Promise.all([
        downloadFile(RESOURCES.react).then(buf => buf.toString('utf-8')),
        downloadFile(RESOURCES.reactDom).then(buf => buf.toString('utf-8')),
        downloadFile(RESOURCES.babel).then(buf => buf.toString('utf-8')),
        downloadFile(RESOURCES.juaFontCss).then(buf => buf.toString('utf-8'))
    ]);

    console.log('  ✅ React 다운로드 완료');
    console.log('  ✅ ReactDOM 다운로드 완료');
    console.log('  ✅ Babel 다운로드 완료');
    console.log('  ✅ Jua 폰트 CSS 다운로드 완료');

    // 2. 폰트 CSS에서 woff2 URL 추출 및 다운로드
    // Google Fonts CSS에서 URL 추출 (다양한 형식 대응)
    let fontUrlMatch = juaFontCss.match(/url\((https:\/\/[^)]+\.woff2)\)/);
    if (!fontUrlMatch) {
        fontUrlMatch = juaFontCss.match(/src:\s*url\(([^)]+)\)/);
    }
    if (!fontUrlMatch) {
        console.log('CSS 내용:', juaFontCss.substring(0, 500));
        throw new Error('폰트 URL을 찾을 수 없습니다');
    }
    const fontUrl = fontUrlMatch[1];
    console.log(`  📥 폰트 다운로드: ${fontUrl}`);

    const juaFontBuffer = await downloadFile(fontUrl);
    const juaFontBase64 = juaFontBuffer.toString('base64');
    console.log('\n🔤 Jua 폰트 Base64 변환 완료');

    // 3. 컴파일된 Tailwind CSS 읽기
    const tailwindCss = fs.readFileSync(path.join(DIST_DIR, 'output.css'), 'utf-8');
    console.log('🎨 Tailwind CSS 로드 완료');

    // 4. 원본 HTML 읽기
    const originalHtml = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf-8');
    console.log('📄 원본 HTML 로드 완료');

    // 5. JSX 코드 추출
    const jsxMatch = originalHtml.match(/<script type="text\/babel">([\s\S]*?)<\/script>/);
    if (!jsxMatch) {
        throw new Error('JSX 코드를 찾을 수 없습니다');
    }
    const jsxCode = jsxMatch[1];

    // 6. 새로운 HTML 생성
    console.log('\n📝 단일 HTML 파일 생성 중...');

    const bundledHtml = `<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MBTI 성격 테스트</title>

    <!-- Jua 폰트 (인라인) -->
    <style>
        @font-face {
            font-family: 'Jua';
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url(data:font/woff2;base64,${juaFontBase64}) format('woff2');
            unicode-range: U+AC00-D7A3, U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
        }
    </style>

    <!-- Tailwind CSS (컴파일됨) -->
    <style>
        ${tailwindCss}
    </style>

    <!-- 커스텀 스타일 -->
    <style>
        body {
            font-family: 'Jua', sans-serif;
            background-color: #F8FAFC;
        }

        /* 애니메이션 */
        @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            25% { transform: translate(-1px, -2px) rotate(-1deg); }
            50% { transform: translate(-3px, 0px) rotate(1deg); }
            75% { transform: translate(1px, -2px) rotate(-1deg); }
            100% { transform: translate(1px, 1px) rotate(0deg); }
        }
        .animate-shake { animation: shake 0.5s infinite; }

        @keyframes pop {
            0% { transform: scale(0.95); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-pop { animation: pop 0.3s ease-out; }

        /* 손그림 느낌의 테두리 */
        .doodle-border {
            border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
            border: 3px solid #4A4A4A;
            box-shadow: 4px 4px 0px #4A4A4A;
            transition: all 0.2s;
        }

        .doodle-border:active {
            transform: translate(2px, 2px);
            box-shadow: 2px 2px 0px #4A4A4A;
        }

        .progress-bar-fill { transition: width 0.5s ease-in-out; }

        .mode-tab {
            transition: all 0.2s;
            border-bottom: 4px solid transparent;
        }
        .mode-tab.active {
            color: #4A4A4A;
            border-bottom: 4px solid currentColor;
            font-weight: bold;
        }

        /* 아코디언 내용 전환 애니메이션 */
        .accordion-content {
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.3s ease-out;
        }
        .accordion-content.open {
            max-height: 500px;
            transition: max-height 0.5s ease-in-out;
        }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4">
    <div id="root" class="w-full max-w-md mx-auto"></div>

    <!-- React (인라인) -->
    <script>${reactJs}</script>

    <!-- ReactDOM (인라인) -->
    <script>${reactDomJs}</script>

    <!-- Babel (인라인) -->
    <script>${babelJs}</script>

    <!-- 앱 코드 -->
    <script type="text/babel">
${jsxCode}
    </script>
</body>
</html>`;

    // 7. 파일 저장
    fs.writeFileSync(OUTPUT_FILE, bundledHtml, 'utf-8');

    // 8. 결과 출력
    const fileSize = fs.statSync(OUTPUT_FILE).size;
    const fileSizeMB = (fileSize / 1024 / 1024).toFixed(2);

    console.log('\n✅ 번들링 완료!');
    console.log(`📁 출력 파일: ${OUTPUT_FILE}`);
    console.log(`📊 파일 크기: ${fileSizeMB} MB`);
    console.log('\n이 파일을 인트라넷에 배포하면 오프라인에서도 작동합니다.');
}

// 실행
bundle().catch(err => {
    console.error('❌ 번들링 실패:', err.message);
    process.exit(1);
});
