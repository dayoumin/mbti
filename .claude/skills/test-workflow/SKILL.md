---
name: test-workflow
description: 테스트 생성 전체 워크플로우. "00 테스트 만들어줘", "새 테스트 추가해줘" 요청 시 자동 실행. 2개 Agent 순차 호출로 2중 검증.
---

# 테스트 생성 워크플로우

## 언제 사용하나

- "whiskey 테스트 만들어줘"
- "wine 테스트 추가해줘"
- "새 성격 테스트 만들어줘"
- "research/xxx.md 기반으로 테스트 생성해줘"

---

## 리서치 파일 처리

### 사용자가 파일 경로 제공하면
```
"research/whiskey.md 기반으로 위스키 테스트 만들어줘"
→ 해당 파일을 test-creator에 전달
```

### 파일 경로 없으면 (기본)
```
"위스키 테스트 만들어줘"
→ fact-collector가 웹검색으로 분류체계/특성 수집 후 생성
```

**리서치 파일 위치**: `research/`

---

## 워크플로우 (필수 순서!)

```
Step 1: test-creator Agent (생성 + 자체검증)
    ↓
Step 2: test-auditor Agent (2중 검증, 독립 컨텍스트)
    ↓
Step 3: 빌드 확인
    ↓
Step 4: 결과 보고 또는 문제 알림
```

---

## Step 1: 테스트 생성

```
Task tool 사용:
- subagent_type: "test-creator"
- prompt: 사용자 요청 전달 (subject, 리서치 파일 경로)
```

**test-creator Agent가 하는 일:**
- 리서치 파일 파싱 (research-parser Skill)
- 테스트 데이터 생성 (test-generator Skill) - 8개 파일 수정
- 인사이트 태그 매핑 추가 (test-tag-mappings.ts)
- 자체 검증 (test-validator Skill)
- 파일 저장

---

## Step 2: 2중 검증 (필수!)

**⚠️ Step 1 완료 후 반드시 실행!**

```
Task tool 사용:
- subagent_type: "test-auditor"
- prompt: "방금 생성된 {subject} 테스트 품질 점검해줘"
```

**test-auditor Agent가 하는 일:**
- 다른 시각에서 품질 검토 (독립 컨텍스트)
- 차원/결과 도달 가능성 확인
- 중간점수(3) 비율 확인
- 인사이트 태그 매핑 검증
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
✅ 테스트 생성 완료

## 생성 결과
- subject: {subject}
- 차원: {N}개
- 질문: {N}개 (중간점수 비율: {N}%)
- 결과: {N}개

## 검증 결과
- 1차 (test-creator): 통과
- 2차 (test-auditor): 통과
- 빌드: 성공

## 수정 파일 (8개)
- src/data/subjects/{subject}.ts (신규)
- src/data/types.ts
- src/data/config.ts
- src/data/index.ts
- src/components/Icons.js
- src/app/dashboard/page.tsx
- scripts/validate-test-data.mjs
- src/data/insight/test-tag-mappings.ts
```

### 문제 발견 시
```
⚠️ 테스트 생성 완료 (검토 필요)

## 발견된 문제
{문제 목록}

## 권장 조치
{수정 방법}

→ 개발자 검토 필요
```

### 실패 시
```
❌ 테스트 생성 실패

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

### 사용자: "whiskey 테스트 만들어줘"

```
1. Task(test-creator)
   prompt: "research/whiskey.md 기반으로 whiskey 테스트 생성해줘"
   → 8개 파일 수정, 인사이트 태그 매핑 추가

2. Task(test-auditor)
   prompt: "방금 생성된 whiskey 테스트 품질 점검해줘"
   → 에러 0, 경고 1 (중간점수 비율 38%)

3. npm run build
   → 성공

4. 결과 보고
   ⚠️ 생성 완료, 경고 1개
   - 중간점수 비율 38% (권장 40% 이상)
```

### 사용자: "wine 테스트 추가해줘"

```
1. Task(test-creator)
   prompt: "research/wine.md 기반으로 wine 테스트 생성해줘"
   → 8개 파일 수정

2. Task(test-auditor)
   prompt: "방금 생성된 wine 테스트 품질 점검해줘"
   → 에러 0, 경고 0

3. npm run build
   → 성공

4. 결과 보고
   ✅ 생성 완료
```

---

## content-workflow와의 비교 (동일 구조!)

| 항목 | test-workflow | content-workflow |
|------|---------------|------------------|
| **파일 없으면** | fact-collector로 웹검색 | fact-collector로 웹검색 |
| **파일 있으면** | 사용자가 경로 제공 시 사용 | 사용자가 경로 제공 시 사용 |
| **Step 1** | test-creator Agent | content-creator Agent |
| **Step 2** | test-auditor Agent | content-auditor Agent |
| **Step 3** | npm run build | npm run build |
| **Step 4** | 결과 보고 | 결과 보고 |
| 담당 | 메인 테스트 (personality/matching) | 참여형 콘텐츠 (Quiz/Poll/Reaction) |
| 수정 파일 수 | 8개 | 1-2개 |
| 인사이트 | test-tag-mappings.ts 수동 추가 | ReactionTag 자동 변환 |