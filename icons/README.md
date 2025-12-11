# PWA 아이콘 가이드

## 필요한 아이콘 사이즈

manifest.json에서 참조하는 아이콘 사이즈:

| 파일명 | 사이즈 | 용도 |
|--------|--------|------|
| icon-72x72.png | 72x72 | Android (ldpi) |
| icon-96x96.png | 96x96 | Android (mdpi) |
| icon-128x128.png | 128x128 | Android (hdpi) |
| icon-144x144.png | 144x144 | Android (xhdpi) |
| icon-152x152.png | 152x152 | iOS (iPad) |
| icon-192x192.png | 192x192 | Android (xxhdpi), 일반 |
| icon-384x384.png | 384x384 | Android (xxxhdpi) |
| icon-512x512.png | 512x512 | 스플래시, 스토어 |

## 아이콘 생성 방법

### 방법 1: 온라인 도구 사용
1. [RealFaviconGenerator](https://realfavicongenerator.net/) 접속
2. icon.svg 업로드
3. 설정 후 생성된 파일들 다운로드
4. 이 폴더에 복사

### 방법 2: 스크립트 사용 (Node.js + sharp)
```bash
npm install sharp
node scripts/generate-icons.js
```

### 방법 3: Figma/디자인 도구
1. 512x512 마스터 아이콘 디자인
2. 각 사이즈로 내보내기

## 디자인 가이드라인

- **Safe Zone**: 아이콘 중앙 80% 영역에 주요 요소 배치
- **배경색**: #FCD34D (노란색) - 앱 테마 컬러
- **모양**: 원형 마스크 대응 필요 (maskable icon)
- **대비**: 배경과 아이콘 요소 간 충분한 대비

## 현재 상태

- [x] icon.svg - 마스터 SVG 아이콘
- [ ] PNG 파일들 - 생성 필요

> SVG를 PNG로 변환하여 각 사이즈 파일을 생성해주세요.
