# 팩트 데이터베이스

퀴즈/투표 콘텐츠 생성 시 참조하는 검증된 팩트 모음입니다.

## 구조

```
research/facts/
├── README.md           # 이 파일
├── cat.md              # 고양이 관련 팩트
├── dog.md              # 강아지 관련 팩트
├── plant.md            # 식물 관련 팩트
└── {category}.md       # 기타 카테고리
```

## 팩트 항목 포맷

```markdown
## {category}-fact-{번호}: {제목}
- **값**: 구체적인 수치나 사실
- **출처**: 출처명 (기관/논문/사이트)
- **URL**: https://... (가능한 경우)
- **검증일**: YYYY-MM-DD
- **사용된 콘텐츠**: content-id-1, content-id-2
- **비고**: 추가 설명 (선택)
```

## 팩트 필요 카테고리

| 카테고리 | 팩트 필수 | 이유 |
|----------|----------|------|
| cat, dog, rabbit, hamster | O | 수의학 정보 |
| plant | O | 식물학 정보 |
| coffee, alcohol | O | 식품/음료 정보 |
| love, relationship, personality | X | 주관적/심리적 |

## 워크플로우

1. **콘텐츠 생성 요청** → content-creator
2. **팩트 필요 여부 판단** (카테고리 기준)
3. **팩트 파일 확인** (research/facts/{category}.md)
   - 있으면: 참조해서 콘텐츠 생성
   - 없으면: 웹검색 → 팩트 수집 → 파일 생성 → 콘텐츠 생성
4. **콘텐츠에 source 추가** (팩트 ID 참조, 예: `source: 'cat-fact-001'`)

## 검증 주기

팩트 타입에 따라 검증 주기가 다릅니다:

| 타입 | 설명 | 검증 주기 | 예시 |
|------|------|----------|------|
| `constant` | 변하지 않는 사실 | 불필요 | 체온, 해부학적 특성 |
| `guideline` | 가이드라인 기반 | 1년 | 백신 프로토콜, 돌봄 권장 |
| `statistic` | 통계/연구 기반 | 6개월 | 평균 수명, 발생률 |

**상수 참조**: `src/data/content/fact-constants.ts`