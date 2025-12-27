# ⚡ 5분 빠른 확인 가이드

## 현재 상태
✅ 개발 서버 실행 중: **http://localhost:3003**

---

## 📋 체크리스트 (5분)

### ✅ 1단계: DevTools 준비 (30초)

1. **브라우저 열기**: http://localhost:3003
2. **F12** 누르기
3. **Network** 탭 클릭
4. 필터에 `collect` 입력
5. **⚠️ Preserve log 체크** (필수!)

---

### ✅ 2단계: test_start 이벤트 (10초)

**동작:**
- 홈 화면 → 아무 테스트 선택 → "테스트 시작하기" 클릭

**확인:**
```
Network 탭에 즉시 나타남:
┌────────────────────────────────────────┐
│ Name: collect?v=2&tid=G-GS60DKM6SB...  │
│ Status: 200 OK                         │
│ Type: image/gif                        │
└────────────────────────────────────────┘

클릭하면 우측 Preview 또는 Payload 탭에서:
{
  "en": "test_start",          ← 이벤트 이름
  "ec": "engagement",          ← 카테고리
  "el": "dog"                  ← 테스트 종류
}
```

**❌ 안 나오면:**
```
콘솔에 입력:
window.gtag
→ 함수가 나와야 정상

안 나오면:
.env.local 파일에 NEXT_PUBLIC_GA_ID 있는지 확인
```

---

### ✅ 3단계: test_complete 이벤트 (2분)

**동작:**
- 질문 12개 빠르게 답하기
- 결과 화면 표시되면 Network 탭 확인

**확인:**
```
2번째 collect 요청:
{
  "en": "test_complete",
  "ec": "engagement",
  "el": "dog",
  "ev": "45"                   ← 소요 시간 (초)
}
```

---

### ✅ 4단계: share 이벤트 (30초)

**동작:**
- 결과 화면 우측 상단 공유 아이콘 클릭
- "URL 복사" 클릭

**확인:**
```
3번째 collect 요청:
{
  "en": "share",
  "ec": "engagement",
  "el": "link_dog"             ← link + 테스트종류
}
```

---

### ✅ 5단계: 퀴즈 이벤트 (1분)

**동작:**
1. 하단 탭 "탐험" 클릭
2. 퀴즈 탭에서 아무 퀴즈 선택
3. 정답 또는 오답 클릭

**확인:**
```
4번째 collect 요청:
{
  "en": "quiz_answer",
  "ec": "engagement",
  "el": "퀴즈ID",
  "ev": "1"                    ← 정답=1, 오답=0
}
```

---

## 🎯 최소 확인 항목

**3개만 확인하면 OK:**
- [x] test_start (테스트 시작)
- [x] test_complete (테스트 완료)
- [x] share (URL 복사)

→ 3개 다 보이면 **나머지도 100% 작동합니다!**

---

## 🔍 디버깅 치트시트

### collect 요청 아예 안 보임
```bash
# .env.local 확인
cat .env.local | grep GA_ID

# 있어야 할 내용:
NEXT_PUBLIC_GA_ID=G-GS60DKM6SB

# 없으면 추가 후 서버 재시작
npm run dev
```

### Status 0 또는 CORS 에러
```
→ GA_ID가 잘못됨
→ .env.local에서 G-GS60DKM6SB 정확히 확인
```

### Payload가 비어있음
```
→ Preview 탭 대신 Headers → Query String Parameters 확인
→ 또는 우클릭 → Copy → Copy as cURL → 텍스트 에디터에 붙여넣기
```

---

## ✨ 성공 예시

```
성공적으로 추적 중일 때 Network 탭:

collect?v=2&tid=G-GS60DKM6SB&en=test_start...      200 OK
collect?v=2&tid=G-GS60DKM6SB&en=test_complete...   200 OK
collect?v=2&tid=G-GS60DKM6SB&en=share...           200 OK
collect?v=2&tid=G-GS60DKM6SB&en=quiz_answer...     200 OK

전부 200 OK면 완벽! 🎉
```

---

## 📊 GA4 실시간 보고서 (2분 후)

**확인 방법:**
1. https://analytics.google.com 접속
2. 좌측 메뉴: **보고서 > 실시간**
3. **이벤트 수(이벤트 이름별)** 섹션

**예상 결과:**
```
test_start          (1개)
test_complete       (1개)
share               (1개)
quiz_answer         (1개)
...
```

**⚠️ 주의:**
- 최대 2분 지연됨
- 1-2분 기다린 후 새로고침

---

## 🚀 다음 단계

1. **지금**: DevTools에서 collect 요청 확인 ✅
2. **2분 후**: GA4 실시간 보고서 확인 ✅
3. **배포 후**: 프로덕션에서도 동일하게 작동 확인 ✅

**끝!**
