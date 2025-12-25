# 상황별 반응 투표 시스템 - AI 리뷰 요청

## 작업 요약

**목적**: 기존 퀴즈/투표 콘텐츠 시스템에 "상황별 반응 투표" 기능 추가

**배경**:
- 성격 테스트 앱에서 사용자 재방문 유도를 위한 참여형 콘텐츠
- "이런 상황에서 나는 어떻게 반응할까?" 형식의 투표
- MBTI 등 성격 유형과 연동하여 통계 제공 예정

---

## 변경된 파일

### 1. 타입 정의 추가
**파일**: `src/data/content/types.ts`

```typescript
// 추가된 타입
export type SituationCategory = 'relationship' | 'work' | 'social' | 'awkward';
export type ReactionTag = 'cool' | 'emotional' | 'rational' | 'avoidant' |
                          'confrontational' | 'humorous' | 'caring' | 'passive';

export interface SituationReaction {
  id: string;                    // "situation-reaction-{category}-{번호}"
  type: 'situation-reaction';
  category: SituationCategory;
  situation: string;             // 상황 설명
  question: string;              // "이럴 때 나는?"
  options: {
    id: string;
    text: string;
    emoji: string;
    tag: ReactionTag;            // 반응 유형 태그
  }[];
  personalityMapping?: {         // MBTI → optionId 매핑
    [personalityType: string]: string;
  };
  tags?: string[];
  meta?: ContentMeta;
}

// 기존 타입에 추가
export type PollContent = VSPoll | ChoicePoll | SituationReaction;
```

### 2. 데이터 파일 생성
**폴더**: `src/data/content/situation-reactions/`

| 파일 | 설명 | 데이터 수 |
|------|------|----------|
| `index.ts` | 통합 export, 조회 함수 | - |
| `relationship.ts` | 연애/이별 상황 | 5개 |
| `work.ts` | 직장생활 상황 | 3개 |
| `social.ts` | 친구/모임 상황 | 2개 |

### 3. 통합 export 수정
**파일**: `src/data/content/index.ts`

```typescript
// 추가된 export
export * from './situation-reactions';
export { getRandomSituationReaction } from './situation-reactions';

// CONTENT_STATS에 추가
situationReactions: ALL_SITUATION_REACTIONS.length,
```

### 4. 검증 스크립트 생성
**파일**: `scripts/validate-situation-reactions.mjs`

---

## 리뷰 요청 사항

### 1. 타입 설계
- `personalityMapping`의 key가 `string`으로 느슨함. MBTI 16가지 타입으로 제한해야 할까?
- `ReactionTag` 8가지가 충분한가? 확장 필요?

### 2. 데이터 구조
- ID 규칙 `situation-reaction-{category}-{번호}`가 적절한가?
- `awkward` 카테고리 데이터가 없음 - 추후 추가 예정이지만 빈 파일이라도 만들어야 할까?

### 3. 확장성
- 현재 10개 샘플 데이터. 대량 데이터 생성 시 파일 분리 전략은?
- DB 연동 시 스키마 변환 고려사항?

### 4. UI 연동
- ContentExplore.tsx에 상황별 반응 탭 추가 필요 (아직 미구현)
- 결과 통계 표시 방식 (성격별 분포 차트 등)

---

## 검증 결과

```
✅ 중복 ID 없음 (10개 모두 고유)
✅ ID-파일 매핑 정상
✅ 모든 tag가 유효함
✅ personalityMapping: 10/10개 있음
✅ 필수 필드 모두 있음
✅ 빌드 성공
```

### Tag 분포
| tag | 사용 횟수 |
|-----|----------|
| confrontational | 10회 |
| emotional | 9회 |
| rational | 7회 |
| avoidant | 6회 |
| cool | 5회 |
| passive | 2회 |
| caring | 1회 |
| humorous | 0회 |

---

## 관련 문서

- 콘텐츠 생성 가이드: `.claude/skills/content-generator/SKILL.md`
- 콘텐츠 검증 가이드: `.claude/skills/content-validator/SKILL.md`
- 대시보드 샘플: `src/app/dashboard/data/dashboard-content.ts` (문서화/검증용)

---

## 리뷰어에게

1. 위 코드/구조에서 문제점이나 개선점이 있으면 알려주세요
2. 특히 타입 설계와 확장성 관련 피드백 부탁드립니다
3. UI 구현 시 고려해야 할 점도 있으면 공유해주세요
