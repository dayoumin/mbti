# InsightTags 시스템 리뷰 요청

## 개요

VS 투표 콘텐츠에 사용자 인사이트 분석용 태그 시스템을 추가했습니다.
코드 품질, 태그 매핑의 적절성, 개선점을 리뷰해주세요.

## 변경 파일

### 1. 태그 정의 (SSOT)
- **파일**: `src/data/insight/insight-tags.ts`
- **내용**: 5개 카테고리, 68개 태그 정의
  - PersonalityTag (18개): Big Five 기반 성격
  - DecisionTag (12개): 의사결정 스타일
  - RelationshipTag (12개): TKI 갈등 모델 기반
  - InterestTag (18개): 관심사 (자동 추출용)
  - LifestyleTag (8개): 생활 방식

### 2. 타입 정의
- **파일**: `src/data/content/types.ts`
- **변경**: InsightTags 인터페이스에 타입 강제 적용
```typescript
export interface InsightTags {
  personality?: PersonalityTag[];   // 성격 태그
  decision?: DecisionTag[];         // 판단 태그
  relationship?: RelationshipTag[]; // 관계 태그
  interest?: InterestTag[];         // 관심사 태그
  lifestyle?: LifestyleTag[];       // 라이프스타일 태그
}
```

### 3. VS 투표 데이터
- **파일**: `src/data/content/polls/vs-polls.ts`
- **변경**: 89개 투표에 insightTags 추가
- **예시**:
```typescript
{
  id: 'vs-viral-001',
  question: '민초 vs 반민초',
  optionA: {
    text: '민초는 사랑입니다',
    insightTags: {
      decision: ['adventurous', 'sentimental'],
      personality: ['expressive']
    },
  },
  optionB: {
    text: '민초는 치약 맛일 뿐',
    insightTags: {
      decision: ['safe', 'practical'],
      personality: ['reserved']
    },
  },
}
```

### 4. 검증 스크립트
- **파일**: `scripts/validate-content-files.mjs`
- **변경**:
  - 일반 `tags` 경고 제거 (검색용이라 2개도 OK)
  - `insightTags` 검증 추가 (옵션당 3개+ 권장)

### 5. 콘텐츠 생성 스킬
- **파일**: `.claude/skills/content-generator/SKILL.md`
- **변경**: insightTags 3개+ 규칙 문서화

## 검증 결과

```
VS_POLLS 총 개수: 89
insightTags 있는 투표: 89
3개 미만 태그 경고: 0
유효하지 않은 태그: 0

가장 많이 사용된 태그 TOP 5:
1. practical: 61회
2. sentimental: 41회
3. structured: 36회
4. safe: 35회
5. expressive: 31회

총 사용된 태그 종류: 44/68
빌드: 성공 ✅
```

## 리뷰 요청 사항

### 1. 태그 매핑 적절성
- 각 투표 옵션에 부여된 insightTags가 의미적으로 적절한가?
- 예: "민초 좋아" → adventurous, expressive가 맞는가?

### 2. 태그 균형
- 특정 태그가 너무 많이/적게 사용되지 않았는가?
- practical(61회) vs splurger(2회) 불균형

### 3. 누락된 조합
- 특정 성격 조합이 나올 수 없는 질문이 있는가?
- 예: 모든 질문이 extrovert vs introvert 구조

### 4. 개선 제안
- 더 세분화해야 할 태그 카테고리?
- 연령대별 해석 고려 시 추가 필요한 정보?

## 향후 계획

```
Stage 3: 판단 스타일 룰 (insightTags 기반 분석)
Stage 4: 관심사 지도 (category → interest 태그 자동 추출)
Stage 5-7: 관계 패턴, AI 해석, 추천 시스템
```

## 참고 파일

- 태그 정의: `src/data/insight/insight-tags.ts`
- VS 투표: `src/data/content/polls/vs-polls.ts`
- 타입: `src/data/content/types.ts`
- 검증 테스트: `tests/insight-tags-validation.test.ts`
