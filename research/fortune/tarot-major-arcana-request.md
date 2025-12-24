# 타로 메이저 아르카나 22장 딥리서치 요청

## 목적
MZ세대 타겟 엔터테인먼트 운세 앱용 타로 카드 데이터 수집

## 요청 사항

### 1. 메이저 아르카나 22장 기본 정보
각 카드별로 다음 정보 필요:

| 필드 | 설명 | 예시 |
|------|------|------|
| number | 카드 번호 (0-21) | 0 |
| id | 영문 ID | "the-fool" |
| nameKo | 한글명 | "바보" |
| nameEn | 영문명 | "The Fool" |
| emoji | 대표 이모지 | "🎒" |
| keywords | 핵심 키워드 3-5개 | ["새로운 시작", "순수", "모험"] |

### 2. 정방향/역방향 해석 (MZ 버전)
**중요**: 부정적 카드도 긍정적/성찰적으로 리프레이밍

| 카드 | 기존 인식 | MZ 리프레이밍 방향 |
|------|----------|-------------------|
| 13. Death | 죽음/끝 | 새로운 챕터, 변신의 시작 |
| 15. The Devil | 유혹/중독 | 내면의 욕망 인식, 자기 이해 |
| 16. The Tower | 재앙/파괴 | 뜻밖의 돌파구, 답답함 해소 |

각 카드별:
```
upright: {
  general: "일반 해석 (1-2문장, MZ 말투)",
  love: "연애운 해석",
  money: "재물운 해석",
  advice: "오늘의 조언"
}
reversed: {
  general: "역방향 일반 해석",
  advice: "역방향 조언"
}
```

### 3. MZ 감성 요소
- **짧은 한줄 요약**: 인스타 스토리 공유용 (15자 이내)
- **상황 밈**: "이 카드가 나왔을 때 나" 식의 공감 상황
- **추천 행동**: 오늘 해보면 좋은 간단한 액션

### 4. 수집 형식 (TypeScript)
```typescript
interface TarotCard {
  number: number;           // 0-21
  id: string;               // 영문 ID
  nameKo: string;           // 한글명
  nameEn: string;           // 영문명
  emoji: string;            // 대표 이모지
  keywords: string[];       // 핵심 키워드

  upright: {
    general: string;        // 정방향 일반
    love: string;           // 연애운
    money: string;          // 재물운
    advice: string;         // 조언
  };

  reversed: {
    general: string;        // 역방향 일반
    advice: string;         // 역방향 조언
  };

  mz: {
    oneLiner: string;       // 한줄 요약 (15자)
    situation: string;      // 공감 상황
    action: string;         // 추천 행동
  };

  meta?: {
    minAge?: string;        // "20s"
  };
}
```

### 5. 콘텐츠 가이드라인 (필수 준수)

**금지 표현**:
- 죽음/수명 직접 언급 (죽, 사망, 수명, 단명)
- 질병 언급 (암, 우울증, 공황 등)
- 금융 투자 조언 (주식, 코인, 로또)
- 법률 문제 (소송, 감옥)
- 단정적 표현 (100%, 확실히, 반드시)

**톤앤매너**:
- MZ 친화적 (밈, 유행어 적절히 활용)
- 긍정적이고 가벼운 톤
- 성찰과 자기 이해 강조
- 성별/연령 고정관념 배제

### 6. 22장 카드 목록

| # | 영문명 | 한글명 | 특별 주의 |
|---|--------|--------|----------|
| 0 | The Fool | 바보 | |
| 1 | The Magician | 마법사 | |
| 2 | The High Priestess | 여사제 | |
| 3 | The Empress | 여황제 | |
| 4 | The Emperor | 황제 | |
| 5 | The Hierophant | 교황 | |
| 6 | The Lovers | 연인 | |
| 7 | The Chariot | 전차 | |
| 8 | Strength | 힘 | |
| 9 | The Hermit | 은둔자 | |
| 10 | Wheel of Fortune | 운명의 수레바퀴 | |
| 11 | Justice | 정의 | |
| 12 | The Hanged Man | 매달린 사람 | 부정적 느낌 → "새로운 관점" |
| 13 | Death | 죽음 | **필수 리프레이밍** → "변화/재생" |
| 14 | Temperance | 절제 | |
| 15 | The Devil | 악마 | **필수 리프레이밍** → "내면 인식" |
| 16 | The Tower | 탑 | **필수 리프레이밍** → "돌파구" |
| 17 | The Star | 별 | |
| 18 | The Moon | 달 | 불안 → "직관의 시간" |
| 19 | The Sun | 태양 | |
| 20 | Judgement | 심판 | |
| 21 | The World | 세계 | |

### 7. 참고 자료
- 라이더-웨이트 타로 (Rider-Waite Tarot) - 가장 보편적
- 기존 앱 참고: 포스텔러, 헬로우봇
- MZ 타로 유튜버/인스타 계정 참고

### 8. 결과물 형태
- 22장 전체 데이터를 TypeScript 배열로 정리
- 각 카드별 이미지 설명(디자인 가이드용) 별도 정리

---

**요청일**: 2024-12-24
**용도**: MBTI 엔터테인먼트 앱 운세 기능 (Phase 1)
**우선순위**: 높음 (별자리/12지신 다음 구현 예정)
