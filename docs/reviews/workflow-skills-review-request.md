# Workflow Skills 구조 검토 요청

## 검토 목적
Workflow/Agent/Skill 분리 구조가 테스트/콘텐츠 워크플로우 모두에 적합한지 확인하고, 리서치 파일 처리 방식과 태그 매핑 설계를 점검하고자 합니다.

---

## 현재 구조

### 전체 아키텍처
```
요청 수신
  -> Workflow Skill (라우팅/흐름 제어)
      -> 리서치 파일 처리 (옵션)
      -> Creator Agent (1차 생성)
      -> Auditor Agent (2차 검증)
      -> 빌드/검증 스크립트 실행
      -> 결과 보고
```

### 파일 위치
```
.claude/
  skills/
    content-workflow/SKILL.md     # 콘텐츠 생성 워크플로우
    test-workflow/SKILL.md        # 테스트 생성 워크플로우
    fact-collector/SKILL.md       # 리서치 수집 공통 스킬
    content-generator/SKILL.md    # 콘텐츠 생성 로직
    content-validator/SKILL.md    # 콘텐츠 검증 로직
    test-generator/SKILL.md       # 테스트 생성 로직
    test-validator/SKILL.md       # 테스트 검증 로직
  agents/
    content-creator.md            # 콘텐츠 생성 에이전트
    content-quality-checker.md    # 콘텐츠 2차 검증 에이전트
    test-creator.md               # 테스트 생성 에이전트
    test-auditor.md               # 테스트 2차 검증 에이전트
```

---

## 두 Workflow 비교

### 동일한 점
| 항목 | test-workflow | content-workflow |
|------|---------------|------------------|
| 리서치 처리 | fact-collector 사용 | fact-collector 사용 |
| 경로 제공 시 | 사용자 제공 경로 파일 사용 | 사용자 제공 경로 파일 사용 |
| Step 1 | creator Agent | creator Agent |
| Step 2 | auditor Agent (2차 검증) | auditor Agent (2차 검증) |
| Step 3 | npm run build | npm run build |
| Step 4 | 결과 보고 | 결과 보고 |

### 다른 점
| 항목 | test-workflow | content-workflow |
|------|---------------|------------------|
| 대상 | Test, Matching (subjects/*.ts) | Quiz, Poll, Reaction (content/*.ts) |
| 파일 수 | 8개 단위 | 1-2개 단위 |
| 인사이트 태그 | test-tag-mappings.ts 수동 매핑 | ReactionTag 자동 매핑 |
| 리서치 폴더 | research/ | research/ 또는 research/facts/ |

---

## 설계 의도

### Workflow
- 역할: 전체 흐름/라우팅 제어, 파일 경로 결정, 빌드/결과 보고
- 관점: "무엇을 할지"를 결정하고 실행 순서를 관리

### Agent
- 역할: 실제 도메인 작업 수행(생성/검증)과 스킬 호출 조합
- 관점: "어떻게 만들고 검증할지"를 담당

### Skill
- 역할: 재사용 가능한 단일 기능 단위
- 예시:
  - fact-collector: 리서치 수집(공통)
  - xxx-generator: 생성 로직
  - xxx-validator: 검증 로직

---

## 리서치 파일 처리

### Before
사용자에게 리서치 파일 존재 여부를 질문하고, 없으면 fact-collector로 수집.
```
"{subject}" 테스트를 만들려고 합니다. 리서치 파일이 있나요?
1) 있으면 경로 입력
2) 없으면 fact-collector 실행
```

### After
사용자 입력에 경로가 포함되면 해당 파일 사용, 없으면 기본으로 fact-collector 실행.
```
## 리서치 파일 처리

### 경로 제공 시
"research/whiskey.md 기반으로 테스트를 만들어줘"
-> 해당 파일을 test-creator에 전달

### 경로 미제공 시
"테스트 만들어줘"
-> fact-collector 실행 후 생성
```

변경 이유: 질문 단계 제거로 사용자 입력 흐름 단순화. 경로가 있으면 우선 사용, 없으면 기본 수집.

---

## 검토 요청 사항 (4가지 핵심 질문)

1) 구조 적절성
- 두 Workflow가 동일한 Step 구조를 유지하는 것이 적절한가?
- Test vs Quiz 차이(대상/볼륨)는 Agent 레벨에서 처리하는 게 맞는가?

2) 리서치 파일 처리
- "경로 있으면 사용, 없으면 fact-collector" 방식이 합리적인가?
- fact-collector를 기본 경로로 두는 판단이 맞는가?

3) 2차 검증 구조
- creator + auditor 분리 구조가 적절한가?
- 독립 컨텍스트에서 2차 검증하는 방식이 효과적인가?

4) 추가 보완 필요성
- 추가해야 할 Skill 또는 Agent가 있는가?
- 현재 구조에서 개선이 필요한 지점이 있는가?

---

## 참고: 인사이트 태그

### Test (수동 매핑)
```typescript
// test-tag-mappings.ts
export const WHISKEY_TAG_MAPPING = {
  dimensions: {
    smoky: { high: ['bold'], low: ['mild'] },
    sweet: { high: ['sweet-lover'], low: ['dry-lover'] }
  }
};
```

### Reaction (자동 매핑)
```typescript
// types.ts
export const REACTION_TAG_TO_INSIGHT = {
  cool: { personality: ['reserved', 'resilient'], decision: ['practical'] },
  emotional: { personality: ['emotional', 'expressive', 'sensitive'] },
  // ...
};
```

매핑 방식 차이 이유:
- Test는 차원별 점수에 따라 태그 조합이 바뀌므로 수동 매핑이 유연함
- Reaction은 고정된 8개 태그 기준으로 인사이트가 결정되므로 자동 매핑이 적합
