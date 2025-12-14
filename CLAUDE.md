# CLAUDE.md - 프로젝트 가이드

## 핵심 규칙 (AI 필독)

### Next.js 앱 (루트)
- **메인 앱**: 루트 디렉토리 - Next.js 16 + TypeScript + Tailwind
- **컴포넌트**: `src/components/` - 현재 5개, 15개 넘으면 ui/feature 분리
- **데이터**: `src/data/` - types.ts, config.ts, subjects/*.ts
- **서비스**: `src/services/` - ResultService (localStorage → Supabase 준비)
- **페이지**: `/` (테스트), `/dashboard` (관리/통계/시뮬레이터)

### 코딩 규칙
- 컴포넌트: `'use client'` 명시, Props 인터페이스 정의
- 타입: `SubjectKey` 유니온 타입으로 테스트 종류 관리
- 비동기: useEffect 내 async 함수, cancelled 플래그로 cleanup
- 스타일: Tailwind 유틸리티 + globals.css 커스텀 클래스

### 대시보드 참조
- 상세 스펙, 시뮬레이터, 로직 뷰어는 `/dashboard`에서 확인
- 디자인 토큰, 컴포넌트 프리뷰 등 라이브 확인 필요한 것은 대시보드에 추가

---

## 주요 링크

| 링크 | 설명 |
|------|------|
| **[src/](src/)** | 소스 코드 |
| **[src/app/dashboard](src/app/dashboard/)** | 프로젝트 대시보드 |
| **[docs/PROGRESS.md](docs/PROGRESS.md)** | 진행 상황 |

### 상세 문서
| 링크 | 설명 |
|------|------|
| [docs/planning/EXTENSION_ARCHITECTURE.md](docs/planning/EXTENSION_ARCHITECTURE.md) | 확장 아키텍처 (Supabase/인사이트) |
| [docs/design/DESIGN_SYSTEM.md](docs/design/DESIGN_SYSTEM.md) | UI/로직/스타일 규칙 |
| [docs/planning/QUESTION_BANK.md](docs/planning/QUESTION_BANK.md) | 문제은행, 랜덤 출제 규칙 |
| [docs/planning/QUESTION_DESIGN.md](docs/planning/QUESTION_DESIGN.md) | 질문 작성 원칙 |

---

## 프로젝트 구조

```
MBTI/
├── src/
│   ├── app/
│   │   ├── page.js            # 메인 테스트 (/, home/test/result 화면)
│   │   ├── dashboard/
│   │   │   └── page.tsx       # 대시보드 (통계/테스트관리/시뮬레이터)
│   │   ├── layout.tsx         # 루트 레이아웃
│   │   └── globals.css        # 전역 스타일
│   ├── components/
│   │   ├── Icons.tsx          # 9종 아이콘 (mood 변형)
│   │   ├── TraitBar.tsx       # 성향 막대 그래프
│   │   ├── ModeTabs.tsx       # 테스트 선택 탭
│   │   ├── TestHeader.tsx     # 테스트 헤더 (뒤로/종료)
│   │   ├── Dashboard.js       # 대시보드 메인 컴포넌트
│   │   ├── ShareCard.tsx      # SNS 공유 카드
│   │   └── index.ts           # 컴포넌트 export
│   ├── data/
│   │   ├── types.ts           # 타입 정의 (SubjectKey, Question, ResultLabel...)
│   │   ├── constants.ts       # 상수 (CHEMI_CONSTANTS)
│   │   ├── config.ts          # SUBJECT_CONFIG, TEST_TYPES
│   │   ├── utils.ts           # matchResultLabel, getScoreLevel
│   │   ├── subjects/*.ts      # 테스트 데이터
│   │   └── index.ts           # CHEMI_DATA 통합
│   └── services/
│       ├── ResultService.ts   # 결과 저장/조회 (localStorage/Supabase)
│       ├── InsightService.js  # 인사이트 생성
│       └── index.ts
├── public/                    # 정적 파일
├── supabase/                  # Supabase 마이그레이션
├── docs/                      # 문서
├── scripts/                   # 검증/테스트 스크립트
├── legacy/                    # 레거시 코드 (사용 안함)
├── package.json
└── tsconfig.json
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

### Human (Big Five 기반)
| 키 | 이름 | 설명 |
|----|------|------|
| inssa | 인싸력 | 사람들과 어울리는 에너지 |
| adventure | 모험심 | 새로운 거 도전하는 힘 |
| empathy | 공감력 | 마음 읽어주는 능력 |
| plan | 계획력 | 착착 준비하는 능력 |
| mental | 멘탈력 | 흔들리지 않는 마음 |

### Cat (Feline Five 기반)
| 키 | 이름 | 설명 |
|----|------|------|
| curious | 호기심 | 뭐든 궁금해! |
| alert | 경계심 | 항상 촉 세우는 중 |
| boss | 보스기질 | 이 집의 주인은 나다냥 |
| random | 엉뚱함 | 오늘 기분은 복불복 |
| cute | 애교력 | 츄르 앞에선 순둥이 |

### Dog (C-BARQ 기반)
| 키 | 이름 | 설명 |
|----|------|------|
| energy | 활력 | 우다다 파워! |
| humanLove | 인간사랑 | 주인이 최고야! |
| dogFriend | 동료애 | 강아지 친구 사귀기 |
| focus | 집중력 | 간식 앞에선 천재견 |
| brave | 용감함 | 무서운 거 없다 멍! |
| persist | 끈기 | 포기란 없다 멍! |

### Rabbit
| 키 | 이름 | 설명 |
|----|------|------|
| curious | 호기심 | 뭐든 궁금해! |
| social | 사교성 | 친구가 좋아! |
| active | 활동성 | 뛰어놀자! |
| brave | 담력 | 무서운 거 없어! |
| chill | 느긋함 | 편하게 있자~ |

### Hamster
| 키 | 이름 | 설명 |
|----|------|------|
| curious | 탐험심 | 뭐든 탐험! |
| hoard | 저장욕 | 볼주머니 가득! |
| active | 활동량 | 쳇바퀴 달려! |
| tame | 친밀도 | 손 위에서 잠들기 |
| nocturnal | 야행성 | 밤이 좋아! |

### IdealType (연애 성향)
| 키 | 이름 | 설명 |
|----|------|------|
| passion | 열정 | 불타는 사랑! |
| commit | 헌신 | 진지한 관계 |
| close | 친밀 | 가까이 붙어있기 |
| express | 표현 | 사랑 표현하기 |
| active | 활동 | 함께 놀기 |

### Plant (반려식물 매칭)
| 키 | 이름 | 설명 |
|----|------|------|
| care | 관리력 | 식물 돌봄 시간/관심 |
| light | 채광 | 집의 햇빛 환경 |
| water | 물주기 | 물주기 습관 |
| space | 공간 | 식물 둘 공간 크기 |
| style | 취향 | 선호 식물 스타일 |

### PetMatch (반려동물 매칭)
| 키 | 이름 | 설명 |
|----|------|------|
| lifestyle | 생활패턴 | 활동량과 외출 빈도 |
| space | 주거공간 | 집의 크기와 환경 |
| time | 돌봄시간 | 반려동물에게 쓸 수 있는 시간 |
| experience | 경험도 | 반려동물 양육 경험 |
| interaction | 교감욕구 | 원하는 교감 수준 |

### Coffee (커피 매칭)
| 키 | 이름 | 설명 |
|----|------|------|
| bitter | 쓴맛 | 쓴맛 선호도 |
| sweet | 단맛 | 단맛 선호도 |
| caffeine | 카페인 | 카페인 필요 정도 |
| temperature | 온도 | 뜨거운 vs 차가운 |
| mood | 분위기 | 커피 마시는 상황/기분 |

### ConflictStyle (갈등 대처 - TKI/Gottman 기반)
| 키 | 이름 | 설명 |
|----|------|------|
| assert | 주장성 | 내 의견 표현 정도 |
| engage | 참여도 | 대화 유지 vs 철수 |
| repair | 회복력 | 관계 복구 능력 |
| empathy | 공감력 | 상대 관점 이해 |
| express | 표현력 | 감정 표현 방식 |
| support | 지지력 | 스트레스 시 지원 |

---

## 결과 매칭 로직

모든 테스트 타입(성격/매칭)은 동일한 `matchResultLabel()` 함수 사용:

### 처리 흐름
```
점수 → 레벨 변환 → 조건 매칭 → 결과 선택
```

### 1단계: 점수 → 레벨 변환
```
점수 비율 = 점수 / (문항수 × 5) × 100
- HIGH: 60% 이상
- MEDIUM: 40~60%
- LOW: 40% 이하
```

### 2단계: 조건 매칭 (우선순위)
1. **완전 매칭**: 모든 조건이 일치하는 결과 중 **조건이 가장 많은 것** 선택
2. **부분 매칭**: 완전 매칭 없으면, 가장 많은 조건이 일치하는 결과 선택
3. **폴백**: 아무것도 없으면 마지막 결과 반환

### 핵심 규칙
- **`condition: {}`은 사용 금지** - 완전 매칭 대상에서 제외됨
- **조건 개수가 많을수록 우선** - 더 구체적인 결과가 선택됨
- **모든 결과 유형은 도달 가능해야 함** - 검증 필수

---

## 신규 테스트 추가 (Quick Guide)

### 파일 수정 순서
1. `src/data/subjects/{subject}.ts` - 데이터 생성
2. `src/data/types.ts` - SubjectKey 추가
3. `src/data/config.ts` - SUBJECT_CONFIG 추가
4. `src/data/index.ts` - export 추가

### 필수 검증 (에러 0개 필수)
```bash
node scripts/validate-test-data.mjs {subject}
npm run build
```

### 핵심 규칙
- `condition: {}` 사용 금지 (도달 불가)
- 각 결과에 2~3개 조건 권장
- 모든 결과 유형 도달 가능해야 함
- 차원당 최소 1개 질문 필요
