# 콘텐츠 연결 그래프 통합 - 코드 리뷰 요청

> 작성일: 2024-12-25
> 리뷰 요청 대상: 다른 AI (Claude, GPT, Gemini 등)

## 변경 개요

분산되어 있던 콘텐츠 연결 로직을 단일 모듈(`contentGraph.ts`)로 통합하고, 운세 콘텐츠 → 테스트 연결을 추가했습니다.

## 변경 파일

| 파일 | 변경 내용 |
|------|----------|
| `src/data/contentGraph.ts` | **신규** - 콘텐츠 연결 그래프 통합 모듈 |
| `src/services/NextActionService.ts` | contentGraph에서 import, 운세 결과 핸들링 추가 |
| `src/components/ContentActions.tsx` | 로컬 TEST_TO_CATEGORY 제거, contentGraph에서 import |
| `src/components/RightSidebar.tsx` | PET_RESULT_TO_DETAIL_TEST → RESULT_TO_DETAIL_TEST 변경 |
| `src/data/content/types.ts` | ContentCategory에 'pet' 추가 |
| `src/data/content/categories.ts` | CATEGORY_LABELS에 'pet' 추가 |

## 주요 변경 내용

### 1. contentGraph.ts 구조

```typescript
// 단일 소스로 통합된 연결 데이터
├── TEST_TO_CATEGORY          // 테스트 → 카테고리
├── TEST_TO_PROFILE_CATEGORY  // 프로필용 카테고리 (UI 표시)
├── CATEGORY_TO_TEST          // 카테고리 → 테스트[]
├── COMMUNITY_CATEGORY_TO_TEST // 커뮤니티용 확장
├── TEST_CONNECTIONS          // 테스트 → 퀴즈/투표/테스트 연결
├── FORTUNE_CONNECTIONS       // 운세 → 테스트 연결 (NEW!)
├── RESULT_TO_DETAIL_TEST     // 결과 → 세부 테스트
├── CATEGORY_META             // 카테고리 메타 정보
├── TEST_META                 // 테스트 메타 정보
└── 유틸리티 함수들
```

### 2. FORTUNE_CONNECTIONS (새 기능)

운세 콘텐츠에서 본 테스트로 연결하는 그래프:

```typescript
const FORTUNE_CONNECTIONS: ContentConnection[] = [
  // 별자리 성격
  { from: 'constellation', to: 'human', type: 'test', relevance: 5, reason: '별자리 말고 진짜 내 성격은?' },
  { from: 'constellation', to: 'idealType', type: 'test', relevance: 4, reason: '연애 성향도 알아볼래요?' },

  // 타로
  { from: 'tarot', to: 'human', type: 'test', relevance: 4, reason: '카드가 추천하는 성격 테스트' },
  { from: 'tarot', to: 'conflictStyle', type: 'test', relevance: 4, reason: '내면의 갈등 스타일' },

  // 띠 운세
  { from: 'zodiac', to: 'human', type: 'test', relevance: 5, reason: '띠보다 정확한 내 성격' },
  // ...
];
```

### 3. NextActionService 확장

새로운 endpoint `fortune_result` 추가:

```typescript
case 'fortune_result':
  return this.getFortuneResultActions(context.fortuneType);
```

## 리뷰 포인트

### 1. 설계 관련

- [ ] 단일 모듈 통합 방식이 적절한가?
- [ ] ContentConnection 인터페이스 설계가 충분히 확장 가능한가?
- [ ] 양방향 연결 (A→B, B→A) 지원이 필요한가?

### 2. 타입 관련

- [ ] `Record<string, ContentCategory>` vs `Record<SubjectKey, ContentCategory>` - 유연성 vs 타입 안전성 트레이드오프
- [ ] ConnectionType과 NextActionType 중복 - 통합 필요?

### 3. 기능 관련

- [ ] FORTUNE_CONNECTIONS의 relevance 점수 기준이 적절한가?
- [ ] 운세 → 테스트 연결 멘트(reason)가 자연스러운가?
- [ ] 테스트 완료 여부를 고려한 추천 필요?

### 4. 유지보수 관련

- [ ] 새 테스트/콘텐츠 추가 시 수정 포인트가 명확한가?
- [ ] 그래프 시각화/검증 도구 필요?

## 테스트 방법

```bash
npm run build  # 타입 체크 + 빌드 성공 확인
```

## 관련 문서

- [RETENTION_LOOP_PLAN.md](../planning/RETENTION_LOOP_PLAN.md) - 재방문 루프 기획
- [NextActionService.ts](../../src/services/NextActionService.ts) - 다음 액션 추천 로직

## 질문 사항

1. **그래프 순환 검사**: A→B→C→A 같은 순환이 생기면 문제가 되나?
2. **가중치 시스템**: relevance 외에 다른 가중치 요소 필요?
3. **A/B 테스트**: 추천 로직 실험을 위한 구조 필요?
