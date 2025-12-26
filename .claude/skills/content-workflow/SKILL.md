---
name: content-workflow
description: 콘텐츠 생성 전체 워크플로우. "00 컨텐츠 만들자", "퀴즈 만들어줘", "투표 만들어줘" 요청 시 자동 실행. 2개 Agent 순차 호출로 2중 검증.
---

# 콘텐츠 생성 워크플로우

## 언제 사용하나

- "고양이 컨텐츠 만들자"
- "연애 컨텐츠 만들자"
- "고양이 퀴즈 10개 만들어줘"
- "연애 투표 5개 만들어줘"
- "강아지 토너먼트 만들어줘"

---

## 리서치 파일 처리

### 사용자가 파일 경로 제공하면
```
"research/cat-health.md 기반으로 고양이 퀴즈 만들어줘"
→ 해당 파일을 content-creator에 전달
```

### 파일 경로 없으면 (기본)
```
"고양이 퀴즈 만들어줘"
→ fact-collector가 웹검색으로 팩트 수집 후 생성
```

**리서치 파일 위치**: `research/` 또는 `research/facts/`

---

## 워크플로우 (필수 순서!)

```
Step 1: content-creator Agent (생성 + 자체검증)
    ↓
Step 2: content-auditor Agent (2중 검증, 독립 컨텍스트)
    ↓
Step 3: 빌드 확인
    ↓
Step 4: 결과 보고 또는 문제 알림
```

---

## Step 1: 콘텐츠 생성

```
Task tool 사용:
- subagent_type: "content-creator"
- prompt: 사용자 요청 전달 (카테고리, 타입, 수량)
```

**content-creator Agent가 하는 일:**
- 팩트 확인 (fact-collector Skill)
- 콘텐츠 생성 (content-generator Skill)
- 자체 검증 (content-validator Skill)
- 파일 저장

---

## Step 2: 2중 검증 (필수!)

**⚠️ Step 1 완료 후 반드시 실행!**

```
Task tool 사용:
- subagent_type: "content-auditor"
- prompt: "방금 생성된 {카테고리} 콘텐츠 품질 점검해줘"
```

**content-auditor Agent가 하는 일:**
- 다른 시각에서 품질 검토 (독립 컨텍스트)
- 연령 등급 확인
- 태그 일관성 확인
- 중복 콘텐츠 발견
- 에러/경고 보고

**왜 2중 검증인가:**
- 두 Agent는 **독립 컨텍스트**에서 실행
- 첫 번째 Agent가 놓친 문제를 두 번째가 발견
- AI 실수 반복 방지

---

## Step 3: 빌드 확인

```bash
npm run build
```

- 타입 에러 없는지 확인
- 빌드 실패 시 → 개발자에게 알림

---

## Step 4: 결과 보고

### 성공 시
```
✅ 콘텐츠 생성 완료

## 생성 결과
- 타입: {퀴즈/투표/토너먼트}
- 개수: {N}개
- 카테고리: {cat/dog/love/...}

## 검증 결과
- 1차 (content-creator): 통과
- 2차 (content-auditor): 통과
- 빌드: 성공

## 파일 위치
{저장된 파일 경로}
```

### 문제 발견 시
```
⚠️ 콘텐츠 생성 완료 (검토 필요)

## 발견된 문제
{문제 목록}

## 권장 조치
{수정 방법}

→ 개발자 검토 필요
```

### 실패 시
```
❌ 콘텐츠 생성 실패

## 실패 단계
{Step 1/2/3 중 어디서}

## 에러 내용
{에러 메시지}

→ 개발자 확인 필요
```

---

## 중요 규칙

### 순서 엄수
1. Step 1 → Step 2 → Step 3 → Step 4
2. 병렬 실행 금지
3. 각 단계 완료 확인 후 다음 단계

### 2중 검증 필수
- Step 1만 하고 끝내면 안 됨
- **반드시** Step 2 실행
- 2중 검증 건너뛰기 금지

### 문제 발견 시
- 자동 수정 시도하지 않음
- 문제 내용 명확히 정리
- 개발자에게 알림

---

## 예시

### 사용자: "고양이 컨텐츠 만들자"

```
1. Task(content-creator)
   prompt: "고양이 퀴즈와 투표 만들어줘"
   → 퀴즈 5개, 투표 3개 생성

2. Task(content-auditor)
   prompt: "방금 생성된 cat 콘텐츠 품질 점검해줘"
   → 에러 0, 경고 1 (중복 발견)

3. npm run build
   → 성공

4. 결과 보고
   ⚠️ 생성 완료, 경고 1개
   - cat-quiz-xxx: 기존 퀴즈와 유사
```

### 사용자: "연애 투표 5개 만들어줘"

```
1. Task(content-creator)
   prompt: "연애 VS 투표 5개 만들어줘"
   → 투표 5개 생성

2. Task(content-auditor)
   prompt: "방금 생성된 love 투표 품질 점검해줘"
   → 에러 0, 경고 0

3. npm run build
   → 성공

4. 결과 보고
   ✅ 생성 완료
```

---

## test-workflow와의 비교 (동일 구조!)

| 항목 | content-workflow | test-workflow |
|------|------------------|---------------|
| **파일 없으면** | fact-collector로 웹검색 | fact-collector로 웹검색 |
| **파일 있으면** | 사용자가 경로 제공 시 사용 | 사용자가 경로 제공 시 사용 |
| **Step 1** | content-creator Agent | test-creator Agent |
| **Step 2** | content-auditor Agent | test-auditor Agent |
| **Step 3** | npm run build | npm run build |
| **Step 4** | 결과 보고 | 결과 보고 |
| 담당 | 참여형 콘텐츠 (Quiz/Poll/Reaction) | 메인 테스트 (personality/matching) |
| 수정 파일 수 | 1-2개 | 8개 |
| 인사이트 | ReactionTag 자동 변환 | test-tag-mappings.ts 수동 추가 |
