# GA4 추적 수동 테스트 체크리스트

## ✅ 즉시 확인 방법 (5분)

### 1. 개발 서버 실행
```bash
npm run dev
```

### 2. Chrome DevTools 준비
1. 브라우저: `http://localhost:3000`
2. **F12** 누르기
3. **Network** 탭 선택
4. 필터: `collect` 입력
5. **Preserve log** 체크 (페이지 이동 시에도 로그 유지)

---

## 📋 테스트 시나리오 (8개 이벤트)

### ✅ 1. 테스트 시작 (test_start)

**동작**:
1. 홈에서 아무 테스트 선택 (예: 강아지 테스트)
2. "테스트 시작하기" 클릭

**확인**:
```
Network 탭에서 찾기:
- URL: collect?v=2&...en=test_start...
- Payload:
  - event_category: "engagement"
  - event_label: "dog" (선택한 테스트)
```

---

### ✅ 2. 테스트 완료 (test_complete)

**동작**:
1. 테스트 끝까지 진행 (12문항)
2. 결과 화면 표시

**확인**:
```
Network 탭에서 찾기:
- URL: collect?v=2&...en=test_complete...
- Payload:
  - event_category: "engagement"
  - event_label: "dog"
  - value: 숫자 (소요 시간, 초 단위)
    예: value=45 → 45초 소요
```

---

### ✅ 3. 카카오톡 공유 (share)

**동작**:
1. 결과 화면에서 "카카오톡으로 공유하기" 클릭
2. (카카오 SDK 없어도 추적은 전송됨)

**확인**:
```
- URL: collect?v=2&...en=share...
- Payload:
  - event_category: "engagement"
  - event_label: "kakao_dog"
```

---

### ✅ 4. URL 복사 (share)

**동작**:
1. 결과 화면 우측 상단 공유 아이콘 클릭
2. "URL 복사" 선택

**확인**:
```
- URL: collect?v=2&...en=share...
- Payload:
  - event_category: "engagement"
  - event_label: "link_dog"
```

---

### ✅ 5. 퀴즈 응답 (quiz_answer)

**동작**:
1. 하단 탭에서 "탐험" (Explore) 선택
2. 퀴즈 탭에서 아무 퀴즈 선택
3. 정답 또는 오답 선택

**확인**:
```
- URL: collect?v=2&...en=quiz_answer...
- Payload:
  - event_category: "engagement"
  - event_label: "퀴즈 ID" (예: "dog_quiz_001")
  - value: 1 (정답) 또는 0 (오답)
```

---

### ✅ 6. 투표 참여 (poll_vote)

**동작**:
1. "탐험" > "투표" 탭
2. VS 투표에서 A 또는 B 선택

**확인**:
```
- URL: collect?v=2&...en=poll_vote...
- Payload:
  - event_category: "engagement"
  - event_label: "투표ID_a" (예: "poll_001_a")
```

---

### ✅ 7. 상황 반응 (situation_reaction)

**동작**:
1. "탐험" > "상황반응" 탭
2. 아무 상황 선택 후 반응 선택

**확인**:
```
- URL: collect?v=2&...en=situation_reaction...
- Payload:
  - event_category: "engagement"
  - event_label: "상황ID" (예: "awkward_001")
```

---

### ✅ 8. 랭킹 투표 (ranking_vote)

**동작**:
1. 하단 탭 "랭킹" 선택
2. 카테고리 선택 (예: "가장 활동적인")
3. 결과 중 하나에 투표

**확인**:
```
- URL: collect?v=2&...en=ranking_vote...
- Payload:
  - event_category: "engagement"
  - event_label: "dog_golden_retriever"
```

---

## 🔍 추가 확인 사항

### GA4 실시간 보고서 (1-2분 후)
1. [Google Analytics](https://analytics.google.com) 접속
2. 좌측 메뉴: **보고서 > 실시간**
3. **이벤트 수(이벤트 이름별)** 섹션 확인

**예상 결과**:
```
test_start          (1개)
test_complete       (1개)
share               (2개) - kakao + link
quiz_answer         (1개)
poll_vote           (1개)
situation_reaction  (1개)
ranking_vote        (1개)

합계: 8개 이벤트
```

---

## ❌ 문제 해결

### collect 요청이 안 보임
**원인**: gtag 스크립트 로드 실패
**해결**:
1. `.env.local`에 `NEXT_PUBLIC_GA_ID=G-GS60DKM6SB` 있는지 확인
2. 개발 서버 재시작: `npm run dev`
3. 브라우저 콘솔에서 `window.gtag` 입력 → 함수가 나와야 함

### Status 0 또는 CORS 에러
**원인**: 잘못된 GA_ID
**해결**: `.env.local`의 GA_ID가 정확한지 확인 (G-로 시작)

### GA4 실시간 보고서에 안 나옴
**원인**: 정상 (최대 2분 지연)
**해결**: 2분 기다린 후 새로고침

---

## 📊 테스트 완료 기록

- [ ] test_start 확인
- [ ] test_complete 확인 (duration 값도 확인)
- [ ] share (kakao) 확인
- [ ] share (link) 확인
- [ ] quiz_answer 확인 (value=1 또는 0)
- [ ] poll_vote 확인
- [ ] situation_reaction 확인
- [ ] ranking_vote 확인
- [ ] GA4 실시간 보고서 확인

**전체 통과 시**: 🎉 GA4 추적 완벽 작동!
