# CLAUDE.md - 프로젝트 가이드

## 데이터 구조

```
data/
├── constants.js      # 공유 상수 (MAX_SCORE, LEVEL_THRESHOLDS)
├── utils.js          # 유틸 함수 (getScoreLevel, matchResultLabel)
├── config.js         # 테스트별 UI 설정 (SUBJECT_CONFIG)
├── index.js          # CHEMI_DATA 통합
└── subjects/         # 테스트별 데이터
    ├── human.js
    ├── cat.js
    ├── dog.js
    ├── rabbit.js
    ├── hamster.js
    ├── idealType.js
    └── plant.js
```

**정식 데이터 소스**: `data/subjects/*.js` (분리된 파일)
**레거시**: `data.js` (참조용, 직접 수정 금지)

---

## 데이터 수정 워크플로우

### 검증
```bash
node scripts/validate-questions.mjs
```

### 새 질문 추가
1. `data/subjects/{subject}.js` 파일 직접 편집
2. `questions` 또는 `questions_deep` 배열에 추가
3. 검증 스크립트 실행

### 새 테스트 추가
1. `data/subjects/{newSubject}.js` 파일 생성
2. `data/index.js`에 import 추가
3. `data/config.js`에 SUBJECT_CONFIG 추가
4. `index.html` 및 `admin.html`에 script 태그 추가

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

---

## 공유 상수 (data/constants.js)

```javascript
CHEMI_CONSTANTS = {
    MAX_SCORE_PER_QUESTION: 5,
    MIN_SCORE_PER_QUESTION: 1,
    DEFAULT_QUESTION_COUNT: 5,
    LEVEL_THRESHOLDS: { HIGH: 60, LOW: 40 },
    LEVELS: { HIGH: 'high', MEDIUM: 'medium', LOW: 'low' }
}
```

---

## 스크립트 목록

### 활성 스크립트 (분리 구조 사용)
| 스크립트 | 용도 |
|----------|------|
| `scripts/validate-questions.mjs` | 질문 데이터 검증 |
| `scripts/verify-refactored-data.mjs` | 분리된 파일 구조 검증 |
| `scripts/test-browser-integration.mjs` | 브라우저 통합 테스트 |
| `scripts/test-app-data.mjs` | 앱 데이터 무결성 테스트 |
| `scripts/check-similarity.mjs` | 질문 유사도 검사 |
| `scripts/fix-double-comma.mjs` | 이중 콤마 오류 수정 |

### 레거시 스크립트 (data.js 대상, 참조용)
| 스크립트 | 용도 |
|----------|------|
| `scripts/refactor-data-structure.mjs` | data.js → 분리 구조 변환 (완료) |
| `scripts/add-*.mjs` | 원타임 데이터 추가 스크립트 |
| `scripts/fix-*.mjs` (일부) | 원타임 오류 수정 스크립트 |
| `scripts/transform-data.mjs` | MBTI→CHEMI 구조 변환 (레거시) |

---

## 문서 링크

- [문제은행 시스템](docs/planning/QUESTION_BANK.md) - 랜덤 출제, 질문 생성 규칙
- [디자인 시스템](docs/design/DESIGN_SYSTEM.md) - UI/로직/규칙
- [질문 설계](docs/planning/QUESTION_DESIGN.md) - 질문 작성 원칙
