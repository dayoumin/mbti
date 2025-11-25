# 성격 테스트 앱 - 프로젝트 문서

> ⚠️ **법적 주의**: 본 프로젝트는 MBTI®(등록상표)를 사용하지 않습니다.
> **Big Five (OCEAN)** 및 **IPIP 공개 도메인** 프레임워크를 기반으로 합니다.

## 문서 구조

```
docs/
├── README.md                    # 이 파일 (문서 인덱스)
├── PROJECT_OVERVIEW.md          # 프로젝트 개요 및 목표
├── ROADMAP.md                   # 개발 로드맵 및 마일스톤
├── LEGAL_COMPLIANCE.md          # ⚠️ 법적 준수 가이드라인 (필독!)
├── research/                    # 연구 자료 및 참고문헌
│   ├── REFERENCES.md            # 학술 논문 및 참고자료 목록
│   ├── PET_PERSONALITY.md       # 펫 성격 연구 (Feline Five, C-BARQ)
│   └── COMPETITOR_ANALYSIS.md   # 경쟁 서비스 분석
├── planning/                    # 기획 문서
│   ├── FEATURES.md              # 기능 명세
│   ├── DATA_STRUCTURE.md        # 데이터 구조 설계
│   ├── QUESTION_DESIGN.md       # 질문 설계 원칙 및 현황
│   └── QUESTION_BANK.md         # 🎲 문제은행 시스템 설계
└── design/                      # 설계 문서
    ├── DESIGN_SYSTEM.md         # ⭐ 디자인 시스템 (UI/로직/규칙)
    ├── ARCHITECTURE.md          # 시스템 아키텍처
    ├── COMPONENTS.md            # 컴포넌트 설계
    └── DATABASE.md              # 데이터베이스 스키마
```

## 빠른 링크

### ⚠️ 필독
- [법적 준수 가이드](./LEGAL_COMPLIANCE.md) - 상표권/저작권 준수, 금지 용어 목록

### 시작하기
- [프로젝트 개요](./PROJECT_OVERVIEW.md) - 프로젝트 목표, 대상, 핵심 가치
- [개발 로드맵](./ROADMAP.md) - 단계별 개발 계획

### 연구 자료
- [참고문헌 목록](./research/REFERENCES.md) - 학술 논문, 공개 도메인 자료
- [펫 성격 연구](./research/PET_PERSONALITY.md) - Feline Five, C-BARQ 등

### 기획
- [기능 명세](./planning/FEATURES.md) - 전체 기능 목록 및 우선순위
- [질문 설계](./planning/QUESTION_DESIGN.md) - 행동 기반 질문 설계 원칙
- [🎲 문제은행 시스템](./planning/QUESTION_BANK.md) - 랜덤 출제, 질문 생성 규칙

### 설계
- [⭐ 디자인 시스템](./design/DESIGN_SYSTEM.md) - UI 컴포넌트, 스타일, 로직 규칙
- [시스템 아키텍처](./design/ARCHITECTURE.md) - Next.js 구조 설계

---

## 업데이트 이력

| 날짜 | 버전 | 변경 내용 |
|------|------|-----------|
| 2025-01-XX | 0.1.0 | 초기 문서 구조 생성 |
| 2025-01-25 | 0.2.0 | 문제은행 시스템 설계 문서 추가, 검증 스크립트 추가 |

---

## 기여 방법

문서 업데이트 시 다음 규칙을 따릅니다:
1. 변경 사항은 업데이트 이력에 기록
2. 외부 링크는 반드시 출처 명시
3. 학술 자료는 DOI 또는 URL 포함
