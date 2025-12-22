---
name: research-parser
description: 딥리서치 결과 파일(research/*.md)을 파싱하여 테스트 생성에 필요한 구조화된 데이터 추출. 리서치 파일 읽기, 차원/결과 추출 시 사용.
allowed-tools: Read, Grep, Glob
---

# 리서치 파일 파서

## 목적
`research/{subject}.md` 파일을 읽고 테스트 생성에 필요한 정보를 추출합니다.

## 리서치 파일 위치
```
research/{subject}.md
```

## 파싱 대상 섹션

### 1. 개요 (Section 1)
- 테스트 유형: personality | matching | situation
- 제목, 부제목
- 테마 컬러

### 2. 차원 (Section 3)
```markdown
| 키 | 이름 | 이모지 | 설명 | LOW | HIGH | 근거 |
|-----|------|--------|------|-----|------|------|
| smoky | 스모키 | 🔥 | 피티/스모키 정도 | 깔끔한 맛 | 강한 피트향 | ... |
| body | 바디감 | 💪 | 맛의 무게감 | 가벼운 맛 | 풍성한 맛 | ... |
```
→ 추출하여 dimensions 객체로 변환

### 3. 결과 유형 (Section 4)
```markdown
### 결과 1: {이름}
- **이모지**: 🍷
- **설명**: ...
- **조건**: { dim1: "high", dim2: "low" }
- **mood**: happy | cool | excited | calm
- **color**: bg-xxx-300
```
→ 추출하여 resultLabels 배열로 변환

### 4. 질문 예시 (Section 5)
- 각 차원별 질문 2-3개
- 선택지와 점수 (5/3/1)

## 출력 형식

```typescript
{
  meta: {
    type: "personality" | "matching" | "situation",
    title: string,
    subtitle: string,
    themeColor: string,
    icon: string
  },
  dimensions: {
    [key: string]: {
      name: string,
      emoji: string,
      desc: string
    }
  },
  resultLabels: Array<{
    name: string,
    emoji: string,
    desc: string,
    condition: Record<string, "high" | "medium" | "low">,
    mood: string,
    color: string,
    interpretation: string,
    guide: string,
    matchPoints: string[]
  }>,
  questionExamples: Array<{
    dimension: string,
    question: string,
    answers: Array<{ text: string, score: number }>
  }>
}
```

## testType별 기준

| testType | 차원 | 질문 | 결과 |
|----------|------|------|------|
| personality | 5-6개 | 15-18 | 8-16 |
| matching | 4-6개 | 10-15 | 8-12 |
| situation | 4-6개 | 10-12 | 6-10 |

## 검증 체크리스트

- [ ] testType 명시됨
- [ ] 차원 개수 적절 (testType별 기준)
- [ ] 각 차원에 이모지, 설명 있음
- [ ] 결과 개수 적절 (testType별 기준)
- [ ] 각 결과에 condition 2-3개 있음
- [ ] mood, color 필드 있음
- [ ] 질문 예시 차원별 2개 이상
