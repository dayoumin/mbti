# CLAUDE.md - 프로젝트 가이드

## AI 코딩 환경 (중요!)

**이 프로젝트는 AI(Claude)가 코딩합니다.**
- 프로젝트 오너는 전문 개발자가 아닌 기획자/PM 역할
- 모든 코드 작성, 수정, 디버깅은 AI가 담당
- CLI 스크립트, 보일러플레이트 생성기 등 사람용 자동화 도구 불필요

### AI 자율 점검 규칙 (필수!)

**작업 완료 후 AI가 스스로 검증하고, 문제 있으면 자동 수정한다.**

| 작업 유형 | 완료 후 자동 실행 | 실패 시 |
|----------|------------------|--------|
| 테스트 추가/수정 | `node scripts/validate-test-data.mjs {subject}` | 스스로 수정 후 재검증 |
| 모든 코드 변경 | `npm run build` | 타입/빌드 에러 스스로 수정 |
| 컴포넌트 추가 | 빌드 + 사용처에서 import 확인 | 누락된 import 추가 |

```
작업 흐름:
요청 → 코드 작성 → [자동 검증] → 에러? → [자동 수정] → [재검증] → 완료 보고
                      ↓                              ↑
                    통과 ─────────────────────────────┘
```

**금지사항:**
- 검증 없이 "완료했습니다" 보고 금지
- 에러 발견 후 사용자에게 "에러가 있는데 수정할까요?" 질문 금지 → 그냥 수정
- 빌드 실패 상태로 작업 종료 금지

### 상황별 자동 점검 상세

**테스트 데이터 추가/수정 시:**
```bash
# 1. 개별 테스트 검증
node scripts/validate-test-data.mjs {subject}

# 2. 경고(warning) 발견 시 자동 수정:
#    - "unreachable result" → condition 조건 수정
#    - "5/1 scoring only" → 중간 점수(3) 옵션 추가
#    - "missing dimension" → 해당 차원 질문 추가

# 3. 빌드 검증
npm run build
```

**컴포넌트/서비스 추가 시:**
```bash
# 1. 빌드 검증
npm run build

# 2. 타입 에러 시 자동 수정:
#    - import 누락 → 추가
#    - 타입 불일치 → 인터페이스 수정
#    - export 누락 → 추가
```

**콘텐츠(퀴즈/투표) 생성 시:**
```
1. content-creator 서브에이전트로 생성
2. 빌드 테스트 (npm run build)
3. 완료 후 사용자에게 질문: "2차 검증할까요?"
   - "응" / "해줘" → content-auditor 서브에이전트 실행
   - "아니" / "됐어" → 스킵
```
→ 2차 검증은 다른 AI 인스턴스가 수행하여 실수 방지

**완료 보고 형식:**
```
✅ {작업 내용} 완료
- 검증: validate-test-data 통과 (에러 0, 경고 0)
- 빌드: 성공
- 수정한 파일: {파일 목록}
```

### AI 코드 리뷰 규칙

| 복잡도 | 리뷰 |
|--------|------|
| 단순 | 검증 후 완료 |
| 중간 (3개+ 파일) | 주요 변경점 설명 |
| 복잡 | 다른 AI 리뷰 권장 |

**설명 요청 시**: 전문용어 최소화, 비유 활용, 배경 설명

---

## 콘텐츠 타입 (5종)

| 타입 | 분류 | 설명 | 위치 |
|------|------|------|------|
| **Test** | 메인 | 성향 테스트 (다차원 분석, 5-15분) | `subjects/*.ts` |
| **Matching** | 메인 | 궁합 테스트 (2인 호환성) | `subjects/*.ts` (type: matching) |
| **Quiz** | 참여형 | 지식 퀴즈 (정답 있음, 점수) | `content/quizzes/*.ts` |
| **Poll** | 참여형 | 투표 (VS, 선택, 정답 없음) | `content/polls/*.ts` |
| **Reaction** | 스낵 | 상황별 반응 ("이럴 때 나는?") | `content/situation-reactions/*.ts` |

### 콘텐츠 생성
- **Test/Matching**: `신규 테스트 추가` 섹션 참조
- **Quiz/Poll/Reaction**: `/content-workflow` 스킬 사용

---

## 핵심 규칙 (AI 필독)

### Next.js 앱 (루트)
- **메인 앱**: 루트 디렉토리 - Next.js 16 + TypeScript + Tailwind
- **컴포넌트**: `src/components/` - 현재 5개, 15개 넘으면 ui/feature 분리
- **데이터**: `src/data/` - types.ts, config.ts, subjects/*.ts
- **유틸리티**: `src/utils/` - 공통 함수 (format, device)
- **서비스**: `src/services/` - Result, Ranking, Feedback, Profile 등
- **페이지**: `/` (테스트), `/dashboard` (관리/통계/시뮬레이터)

### 코딩 규칙
- 컴포넌트: `'use client'` 명시, Props 인터페이스 정의
- 타입: `SubjectKey` 유니온 타입으로 테스트 종류 관리
- 비동기: useEffect 내 async 함수, cancelled 플래그로 cleanup
- 스타일: Tailwind 유틸리티 + globals.css 커스텀 클래스
- Import: 공통 유틸은 `@/utils`, 서비스는 `@/services`에서 import

### 대시보드 참조
- 상세 스펙, 시뮬레이터, 로직 뷰어는 `/dashboard`에서 확인
- 디자인 토큰, 컴포넌트 프리뷰 등 라이브 확인 필요한 것은 대시보드에 추가

---

## 주요 링크

| 링크 | 설명 |
|------|------|
| **[src/](src/)** | 소스 코드 |
| **[/dashboard](/dashboard)** | 🔗 프로젝트 대시보드 (모든 기획/전략 통합) |

### 대시보드 주요 섹션
| 섹션 | 설명 |
|------|------|
| 전략 > 콘텐츠 시스템 | 퀴즈/투표/Q&A 기획, 데이터 구조, 구현 로드맵 |
| 전략 > 커뮤니티 | 커뮤니티 전략 Phase 1~4, 리스크, 지표 |
| 전략 > 로드맵 | 전체 개발 로드맵 |
| 개발 도구 > 시뮬레이터 | 결과 매칭 테스트 |
| 테스트 관리 | 테스트별 상세 스펙, 질문 미리보기 |

### 참고 문서 (레거시)
| 링크 | 설명 |
|------|------|
| [docs/planning/EXTENSION_ARCHITECTURE.md](docs/planning/EXTENSION_ARCHITECTURE.md) | Supabase 스키마/인사이트 설계 |
| [docs/design/DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md) | UI/로직/스타일 규칙 |

---

## 프로젝트 구조

```
MBTI/
├── src/
│   ├── app/
│   │   ├── page.js            # 메인 테스트 (/, home/test/result 화면)
│   │   ├── dashboard/
│   │   │   ├── page.tsx       # 대시보드 메인
│   │   │   ├── components/    # 대시보드 전용 컴포넌트
│   │   │   │   ├── CommunityStrategy.tsx   # 커뮤니티 전략 뷰어
│   │   │   │   └── ContentSystem.tsx       # 퀴즈/투표/Q&A 기획 뷰어
│   │   │   └── data/          # 대시보드 전용 데이터
│   │   │       ├── community.ts        # 커뮤니티 전략 데이터
│   │   │       └── content-system.ts   # 콘텐츠 시스템 데이터
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── globals.css        # 전역 스타일
│   ├── components/            # 공통 컴포넌트
│   ├── data/                  # 테스트 데이터
│   │   ├── types.ts           # 타입 정의
│   │   ├── config.ts          # SUBJECT_CONFIG, TEST_TYPES, RANKABLE_TESTS
│   │   ├── subjects/*.ts      # 테스트별 데이터
│   │   └── index.ts           # CHEMI_DATA 통합
│   ├── utils/                 # 공통 유틸리티
│   │   ├── format.ts          # 시간/숫자/날짜 포맷팅
│   │   ├── device.ts          # 디바이스 ID 관리
│   │   └── index.ts           # barrel export
│   └── services/              # 서비스 레이어
│       ├── ResultService.ts   # 테스트 결과 저장/조회
│       ├── RankingService.ts  # 랭킹 투표/통계
│       ├── FeedbackService.ts # 피드백/퀴즈/투표
│       ├── ProfileService.ts  # 사용자 프로필
│       └── index.ts           # 서비스 통합 export
├── docs/                      # 레거시 문서 (대시보드로 통합 중)
├── scripts/                   # 검증/테스트 스크립트
├── legacy/                    # 레거시 코드 (사용 안함)
└── package.json
```

---

### 명령어
```bash
npm run dev      # 개발 서버 실행
npm run build    # 프로덕션 빌드
npm run lint     # 린트 검사
```

### 데이터 수정
```bash
npm run build    # 검증
# src/data/subjects/{subject}.ts 편집
```

---

## 차원(Dimension) 키 참조

→ **[docs/DIMENSIONS.md](docs/DIMENSIONS.md)** 참조

---

## 결과 매칭 로직

점수 비율 → 레벨(HIGH/MEDIUM/LOW) → 조건 매칭 → 결과 선택

| 레벨 | 점수 비율 |
|------|----------|
| HIGH | 70% 이상 |
| MEDIUM | 30~70% |
| LOW | 30% 미만 |

**핵심**: 조건이 많이 일치할수록 우선 선택, `condition: {}`은 폴백용

---

## 신규 테스트 추가

> "wine 테스트 추가해줘" → AI가 아래 파일들 모두 수정

### 수정할 파일 목록 (5개)

| 순서 | 파일 | 할 일 |
|------|------|-------|
| 1 | `src/data/subjects/{subject}.ts` | 테스트 데이터 생성 (기존 파일 참고) |
| 2 | `src/data/types.ts` | SubjectKey 유니온에 추가 |
| 3 | `src/data/config.ts` | SUBJECT_CONFIG에 설정 추가 (icon + lucideIcon 필드) |
| 4 | `src/data/index.ts` | import + CHEMI_DATA에 추가 |
| 5 | `src/components/Icons.tsx` | {Subject}Icon SVG 컴포넌트 + IconMap에 추가 |

**참고**: 대시보드 아이콘은 config.ts의 `lucideIcon` 필드에서 자동으로 읽어옴 (별도 수정 불필요)

### 테스트 데이터 구조
```typescript
// subjects/{subject}.ts 기본 구조
export const {subject}Data: SubjectData = {
  title: "테스트 제목",
  subtitle: "부제목",
  themeColor: "bg-xxx-100",
  icon: "{Subject}Icon",
  dimensions: {
    dim1: { name: "차원명", emoji: "🎯", desc: "설명" },
    // 4-6개 차원
  },
  questions: [
    // 12-16개 질문, 각 차원당 최소 2개
    // 중간 점수(3) 옵션 포함 권장
    { q: "질문?", dimension: "dim1", a: [
      { text: "높은 선택", score: 5 },
      { text: "중간 선택", score: 3 },  // ← 중요!
      { text: "낮은 선택", score: 1 }
    ]}
  ],
  resultLabels: [
    // 8-16개 결과
    // condition에 2-3개 조건 (빈 조건은 마지막 폴백 결과에만)
    { name: "결과명", emoji: "✨", desc: "한줄설명",
      condition: { dim1: "high", dim2: "low" },  // 필수
      mood: "happy", color: "bg-xxx-300",
      interpretation: "해석", guide: "가이드",
      matchPoints: ["추천 포인트1", "추천 포인트2"]
    }
  ]
};
```

### 필수 검증
```bash
node scripts/validate-test-data.mjs {subject}  # 에러 0개 필수
npm run build  # 빌드 성공 필수
```

### 핵심 규칙
- `condition: {}`은 마지막 결과(폴백)에만 허용
- 각 결과에 2~3개 조건 권장
- 질문에 중간 점수(3) 옵션 포함 → MEDIUM 레벨 도달 가능
- 모든 결과 유형은 도달 가능해야 함

---

## 공통 유틸리티 참조

### @/utils/format
| 함수 | 설명 | 예시 |
|------|------|------|
| `formatRelativeTime(dateString)` | 상대 시간 | `"방금 전"`, `"5분 전"`, `"3일 전"` |
| `timeAgo` | formatRelativeTime alias | 위와 동일 |
| `formatNumber(num)` | 숫자 축약 | `1234` → `"1.2K"`, `1500000` → `"1.5M"` |
| `formatDate(dateString)` | 한국어 날짜 | `"12월 15일"` |

### @/utils/device
| 함수 | 설명 |
|------|------|
| `getDeviceId()` | 익명 사용자 ID 반환 (없으면 생성, localStorage 저장) |
| `hasDeviceId()` | 디바이스 ID 존재 여부 |
| `USER_KEY` | localStorage 키 (`'chemi_user'`) |

### @/data/config 상수
| 상수 | 설명 |
|------|------|
| `SUBJECT_CONFIG` | 테스트별 설정 (아이콘, 라벨, 테마 등) |
| `TEST_TYPES` | 테스트 유형 (personality, matching) |
| `MAIN_TEST_KEYS` | 메인 테스트 키 목록 (세부 테스트 제외) |
| `RANKABLE_TESTS` | 랭킹 지원 테스트 목록 `[{ key, emoji, name }]` |
| `RANKABLE_TEST_KEYS` | 랭킹 지원 테스트 키만 `SubjectKey[]` |

### @/services 서비스
| 서비스 | 설명 |
|--------|------|
| `resultService` | 테스트 결과 저장/조회 (localStorage + Supabase 준비) |
| `rankingService` | 랭킹 투표/통계 |
| `feedbackService` | 피드백, 퀴즈, 투표 응답 |
| `profileService` | 사용자 프로필 |
| `gamificationService` | 배지, 레벨, 포인트 |
| `nextActionService` | 다음 행동 추천 |
