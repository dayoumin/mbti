# CLAUDE.md - 프로젝트 가이드

## ⚠️ 최우선 규칙: data.js 직접 수정 금지

```
┌──────────────────────────────────────────────────┐
│  data.js는 Edit/Write 도구로 절대 수정하지 마세요  │
│  → 반드시 Node.js 스크립트 사용                    │
└──────────────────────────────────────────────────┘
```

**이유**: UTF-8 한글 인코딩 손상, 배열 구조 파손 위험

## data.js 수정 워크플로우

```bash
# 1. 현재 상태 검증
node scripts/validate-questions.mjs

# 2. 오류가 있으면 수정 스크립트 실행
node scripts/fix-data-errors.mjs

# 3. 새 질문 추가 필요시
#    → scripts/add-questions.mjs 작성 후 실행

# 4. 수정 후 재검증 (오류 0개 확인)
node scripts/validate-questions.mjs
```

## git checkout data.js 후 복구

```bash
node scripts/transform-data.mjs   # CHEMI_DATA로 변환
node scripts/fix-data-errors.mjs  # 오류 수정
node scripts/validate-questions.mjs  # 검증
```

## 새 질문 추가 방법

**직접 Edit 금지!** 대신:
1. `scripts/add-questions.mjs` 스크립트 작성
2. 템플릿: [디자인 시스템 9.3절](docs/design/DESIGN_SYSTEM.md#93-질문-추가-스크립트-템플릿) 참조
3. 스크립트 실행 후 검증

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

---

## 스크립트 목록

| 스크립트 | 용도 |
|----------|------|
| `scripts/transform-data.mjs` | MBTI → CHEMI_DATA 구조 변환 |
| `scripts/fix-data-errors.mjs` | 알려진 데이터 오류 자동 수정 |
| `scripts/validate-questions.mjs` | 질문 데이터 검증 |

---

## 문서 링크

- [문제은행 시스템](docs/planning/QUESTION_BANK.md) - 랜덤 출제, 질문 생성 규칙
- [디자인 시스템](docs/design/DESIGN_SYSTEM.md) - UI/로직/규칙
- [질문 설계](docs/planning/QUESTION_DESIGN.md) - 질문 작성 원칙
