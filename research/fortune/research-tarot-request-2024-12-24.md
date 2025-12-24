# 타로 카드 딥리서치 요청

## 목적
엔터테인먼트 앱 운세 콘텐츠용 타로 카드 해석 데이터 수집

## 중요 조건
- **엔터테인먼트/재미 목적** (점술 서비스 X)
- **긍정적/희망적 해석 중심**
- **단정적 표현 금지** ("~할 수도 있어요", "~일 가능성이" 등 권유형)
- **20대 타겟** 친근한 말투

---

## 리서치 요청 1: 메이저 아르카나 22장

각 카드별로 다음 정보를 정리해주세요:

### 카드 정보 템플릿
```
카드명 (영문)
- 번호: 0~21
- 키워드: 3~5개 (한글)
- 이모지: 대표 이모지 1개
- 정방향 해석:
  - 일반: 1~2문장 (긍정적, 희망적)
  - 연애: 1~2문장
  - 커리어: 1~2문장
  - 재물: 1~2문장
- 역방향 해석:
  - 일반: 1~2문장 (성장 관점, 비난X)
  - 조언: "이럴 땐~" 형식
- 오늘의 메시지: 20대가 공감할 짧은 한마디 (1문장)
```

### 22장 목록
0. The Fool (바보)
1. The Magician (마법사)
2. The High Priestess (여사제)
3. The Empress (여황제)
4. The Emperor (황제)
5. The Hierophant (교황)
6. The Lovers (연인)
7. The Chariot (전차)
8. Strength (힘)
9. The Hermit (은둔자)
10. Wheel of Fortune (운명의 수레바퀴)
11. Justice (정의)
12. The Hanged Man (매달린 사람)
13. Death (죽음) → 변화/전환 관점으로
14. Temperance (절제)
15. The Devil (악마) → 유혹/집착 관점으로
16. The Tower (탑) → 변화의 기회 관점으로
17. The Star (별)
18. The Moon (달)
19. The Sun (태양)
20. Judgement (심판)
21. The World (세계)

---

## 리서치 요청 2: 원카드 리딩 메시지

각 카드별 "오늘의 운세" 스타일 짧은 메시지 5개씩:

```
예시 (The Fool):
1. "새로운 시작이 두렵다면, 그건 성장하고 있다는 증거예요!"
2. "오늘은 계획보다 직감을 믿어보세요 ✨"
3. "완벽하지 않아도 괜찮아요. 일단 시작해봐요!"
4. "순수한 호기심이 가장 좋은 나침반이 될 수 있어요"
5. "실패해도 괜찮아요. 여정 자체가 선물이니까요 🎁"
```

---

## 주의사항

### 사용 금지 표현
- "반드시", "틀림없이", "100%" 등 단정적 표현
- 건강/질병 관련 예측
- 재물 손실 예측 (투자 실패 등)
- 이별/파국 단정
- 죽음/수명 언급

### 권장 표현
- "~할 수도 있어요"
- "~의 기운이 느껴져요"
- "~를 생각해보는 건 어떨까요?"
- "~의 가능성이 열려 있어요"

---

## 출력 형식

JSON 또는 마크다운 테이블 형식으로 정리해주세요.
데이터는 TypeScript 타입으로 변환할 예정입니다.

```typescript
interface TarotCard {
  id: string;           // 'major-00-fool'
  number: number;       // 0
  nameKo: string;       // '바보'
  nameEn: string;       // 'The Fool'
  emoji: string;        // '🃏'
  keywords: string[];   // ['새로운 시작', '순수', '모험']
  upright: {
    general: string;
    love: string;
    career: string;
    money: string;
  };
  reversed: {
    general: string;
    advice: string;
  };
  dailyMessages: string[];  // 5개
}
```
