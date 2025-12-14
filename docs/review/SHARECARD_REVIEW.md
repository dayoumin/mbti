# ShareCard 컴포넌트 코드 리뷰

> 작성일: 2025-12-14
> 리뷰 대상: `src/components/ShareCard.tsx`

---

## 1. 컴포넌트 개요

### 목적
- 테스트 결과를 Canvas API로 이미지 카드로 생성
- SNS 공유용 다운로드, 링크 복사, 네이티브 공유 기능 제공
- 바이럴 루프의 핵심 컴포넌트 (커뮤니티 Phase 1)

### 파일 정보
- **경로**: `src/components/ShareCard.tsx`
- **라인 수**: 305줄
- **의존성**: React, lucide-react (아이콘)

---

## 2. Props 인터페이스

```typescript
interface ShareCardProps {
  testTitle: string;           // 테스트 제목
  resultName: string;          // 결과 이름
  resultEmoji: string;         // 결과 이모지
  resultDesc: string;          // 결과 설명
  dimensions?: Record<string, { name: string; emoji: string }>;  // 차원 정보
  scores?: Record<string, number>;      // 점수
  maxScores?: Record<string, number>;   // 차원별 최대 점수
  onClose: () => void;         // 닫기 콜백
  onCompare?: () => void;      // 비교하기 콜백
}
```

---

## 3. 주요 기능

### 3.1 Canvas 이미지 생성 (useEffect)
- **크기**: 540x720px (인스타 스토리 비율 3:4)
- **구성요소**:
  - 그라디언트 배경 (#667eea → #764ba2 → #f093fb)
  - 흰색 카드 (둥근 모서리)
  - 테스트 제목, 이모지, 결과명, 설명
  - 차원별 점수 막대 (최대 5개)
  - CTA 문구 ("나도 테스트하기")
  - 브랜드 로고

### 3.2 공유 기능
| 기능 | 메서드 | 설명 |
|-----|-------|------|
| 다운로드 | `handleDownload()` | PNG 파일 저장 |
| 링크 복사 | `handleCopyLink()` | 클립보드 복사 |
| 네이티브 공유 | `handleShare()` | Web Share API |

---

## 4. 코드 품질 분석

### 4.1 잘된 점

| 항목 | 설명 |
|-----|------|
| TypeScript 타입 정의 | Props 인터페이스 명확히 정의됨 |
| 컴포넌트 분리 | 독립적인 모달 컴포넌트로 분리됨 |
| 에러 핸들링 | share cancelled, clipboard 에러 처리 |
| 접근성 | disabled 상태 처리, 시각적 피드백 |
| 음수 점수 처리 | `Math.max(0, score)` 추가됨 |
| 초과 점수 처리 | `Math.min(percentage, 100)` 적용됨 |
| 파일명 sanitize | 특수문자 제거 함수 추가됨 |
| 동적 maxScore | props로 받아서 처리 |

### 4.2 개선 필요 사항

| 우선순위 | 항목 | 현재 | 제안 |
|---------|-----|-----|------|
| 🟡 중간 | 한글 줄바꿈 | 공백 기준 분리 | 문자 단위 분리 또는 고정 폭 처리 |
| 🟡 중간 | Canvas 폰트 | 시스템 폰트 | 웹폰트 로드 후 렌더링 |
| 🟢 낮음 | 색상 하드코딩 | 인라인 값 | JS 상수/토큰으로 관리 |
| 🟢 낮음 | 로딩 상태 | 스피너만 | 스켈레톤 UI 추가 가능 |

---

## 5. 디자인 시스템 준수도

| 항목 | 준수 | 비고 |
|-----|-----|------|
| Tailwind 클래스 사용 | ✅ | UI 요소에 적용 |
| 색상 토큰 | 🟡 | Canvas 내부는 하드코딩 |
| 반응형 | ✅ | max-w-md, max-h-[90vh] |
| 애니메이션 | ✅ | animate-fade-in, animate-slide-up |
| 아이콘 시스템 | ✅ | lucide-react 사용 |
| 버튼 스타일 | ✅ | 그라디언트, 상태별 스타일 |

---

## 6. 테스트 결과

### 실행 명령
```bash
node scripts/test-share-card.mjs
```

### 결과: 22개 테스트 통과

| 카테고리 | 테스트 | 결과 |
|---------|-------|------|
| 퍼센트 계산 | 0점, 중간, 최대, 초과, 음수 | ✅ |
| 텍스트 줄바꿈 | 영어, 한글(공백있음/없음), 빈값 | ✅ |
| 차원 슬라이싱 | 3개, 5개, 7개, 0개 | ✅ |
| 파일명 생성 | 일반, 특수문자 | ✅ |
| URL 생성 | 인코딩 | ✅ |
| 색상 순환 | 5개, 6개(순환) | ✅ |
| maxScore 계산 | 동적 계산 | ✅ |

---

## 7. 수정 이력

| 날짜 | 수정 내용 |
|-----|----------|
| 2025-12-14 | 초기 구현 |
| 2025-12-14 | maxScores props 추가 |
| 2025-12-14 | 음수 점수 처리 추가 |
| 2025-12-14 | sanitizeFileName 함수 추가 |

---

## 8. 관련 파일

| 파일 | 역할 |
|-----|------|
| `src/app/page.js` | ShareCard 사용처, maxScores 계산 |
| `src/components/index.ts` | ShareCard export |
| `scripts/test-share-card.mjs` | 로직 테스트 스크립트 |

---

## 9. 향후 개선 계획

### Phase 1 완료 후
- [ ] 카카오톡 SDK 연동
- [ ] UTM 파라미터 추가 (리퍼럴 추적)

### Phase 2
- [ ] 친구 비교 결과 카드 생성
- [ ] 궁합 점수 시각화

### UI/UX 개선
- [ ] 웹폰트 적용 (Jua)
- [ ] 테마별 카드 디자인
- [ ] QR 코드 추가

---

## 10. AI 리뷰 요청사항

다음 관점에서 추가 리뷰 요청:

1. **Canvas API 최적화**: 렌더링 성능 개선 방안
2. **메모리 관리**: toDataURL 호출 시 메모리 누수 가능성
3. **크로스 브라우저**: roundRect 지원 여부 (IE 미지원)
4. **접근성**: 스크린 리더 대응 추가 필요 여부
5. **테스트 커버리지**: 추가 필요한 테스트 케이스

---

## 부록: 전체 코드

```typescript
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Download, Share2, Copy, Check, X, Users } from 'lucide-react';

interface ShareCardProps {
  testTitle: string;
  resultName: string;
  resultEmoji: string;
  resultDesc: string;
  dimensions?: Record<string, { name: string; emoji: string }>;
  scores?: Record<string, number>;
  maxScores?: Record<string, number>;
  onClose: () => void;
  onCompare?: () => void;
}

export default function ShareCard({
  testTitle,
  resultName,
  resultEmoji,
  resultDesc,
  dimensions,
  scores,
  maxScores,
  onClose,
  onCompare,
}: ShareCardProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas 크기 설정
    const width = 540;
    const height = 720;
    canvas.width = width;
    canvas.height = height;

    // 배경 그라디언트
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#667eea');
    gradient.addColorStop(0.5, '#764ba2');
    gradient.addColorStop(1, '#f093fb');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 배경 장식 원
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.beginPath();
    ctx.arc(width * 0.8, height * 0.2, 150, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(width * 0.2, height * 0.8, 100, 0, Math.PI * 2);
    ctx.fill();

    // 카드 배경
    const cardX = 30;
    const cardY = 80;
    const cardW = width - 60;
    const cardH = height - 160;
    const cardRadius = 24;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, cardRadius);
    ctx.fill();

    // ... (이하 렌더링 로직)

    const url = canvas.toDataURL('image/png');
    setImageUrl(url);
    setGenerating(false);
  }, [testTitle, resultName, resultEmoji, resultDesc, dimensions, scores, maxScores]);

  // ... (공유 함수들)

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
      {/* 모달 UI */}
    </div>
  );
}
```
