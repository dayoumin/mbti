# 운세 콘텐츠 AI 리뷰 요청

## 작업 개요

**작업일**: 2024-12-24
**작업 내용**: MBTI 엔터테인먼트 앱에 운세/별자리 콘텐츠 추가
**타겟 사용자**: MZ 세대 (20대 이상)

---

## 신규 생성 파일

### 1. `src/data/content/fortune/constellations.ts` (605줄)
황도 12궁 별자리 데이터 (MZ 버전)

**구조**:
```typescript
export type ElementType = 'fire' | 'earth' | 'air' | 'water';
export type ModalityType = 'cardinal' | 'fixed' | 'mutable';

export interface ConstellationData {
  id: string;           // aries, taurus, gemini...
  nameKo: string;       // 양자리, 황소자리...
  nameEn: string;       // Aries, Taurus...
  emoji: string;        // ♈, ♉...
  dateRange: string;    // "3.21~4.19"
  period: { start: string; end: string };  // MM-DD 형식
  element: ElementType;
  modality: ModalityType;
  rulingPlanet: string;
  keywords: string[];
  personality: {
    summary: string;
    growthPoint: string;
    year2025Keywords: string[];
  };
  compatibility: { best: string[]; good: string[]; challenge: string[]; };
  memes: { traits: string[]; situations: string[]; };
  meta?: ContentMeta;
}
```

**포함 데이터**:
- 12개 별자리 전체 데이터
- 호환성 매트릭스 (12x12 = 144 조합)
- 유틸리티 함수:
  - `getConstellationById(id)` - ID로 별자리 조회
  - `getConstellationByDate(month, day)` - 날짜로 별자리 조회
  - `getCompatibility(sign1, sign2)` - 두 별자리 궁합 조회
  - `getCompatibilityDescription(result)` - 궁합 결과 설명

**특이사항**:
- 염소자리(Capricorn) 날짜 범위가 연도를 넘김 (12/22~1/19)
- `getConstellationByDate()` 함수에서 이를 처리하는 로직 포함

---

### 2. `src/data/content/fortune/daily-messages.ts` (366줄)
오늘의 운세 메시지 (Barnum Effect 활용)

**구조**:
```typescript
interface DailyFortuneMessage {
  id: string;
  category: 'love' | 'money' | 'health' | 'general';
  tone: 'positive' | 'encouraging' | 'cautious';
  message: string;
}

interface LuckyTip {
  id: string;
  color: { name: string; emoji: string };
  number: number;
  item: string;
  time?: string;
  place?: string;
  action?: string;
}
```

**포함 데이터**:
- 연애운 메시지: 8개
- 재물운 메시지: 8개
- 건강운 메시지: 8개
- 일반운 메시지: 8개
- 럭키팁: 8개 (별도 집계)
- 메시지 총 32개 + 럭키팁 8개 = 40개 콘텐츠

**유틸리티 함수**:
- `getRandomDailyMessage(category)` - 카테고리별 랜덤 메시지
- `getRandomLuckyTip()` - 랜덤 럭키팁
- `getDailyFortuneSet()` - 오늘의 운세 세트 (전 카테고리 + 럭키팁)

---

## 수정 파일

### 3. `src/data/content/fortune/zodiac-polls.ts`
**수정 내용**: 처녀자리 이모지 수정
- Before: `👩‍🔬` (여성 과학자)
- After: `♍` (처녀자리 기호)

### 4. `src/data/content/fortune/zodiac-2025.ts`
**수정 내용**: 6개 띠에 미래 연도 추가
- 말띠: 2026 추가
- 양띠: 2027 추가
- 원숭이띠: 2028 추가
- 닭띠: 2029 추가
- 개띠: 2030 추가
- 돼지띠: 2031 추가

### 5. `src/data/content/fortune/index.ts`
**수정 내용**: 신규 모듈 export 추가
```typescript
export {
  CONSTELLATIONS, COMPATIBILITY_MATRIX,
  getConstellationById, getConstellationByDate,
  getCompatibility, getCompatibilityDescription,
} from './constellations';

export {
  LOVE_MESSAGES, MONEY_MESSAGES, HEALTH_MESSAGES, GENERAL_MESSAGES,
  LUCKY_TIPS, ALL_DAILY_MESSAGES,
  getRandomDailyMessage, getRandomLuckyTip, getDailyFortuneSet,
} from './daily-messages';
```

### 6. `src/data/content/index.ts`
**수정 내용**: CONTENT_STATS 업데이트
```typescript
import { ZODIAC_FORTUNES_2025, ZODIAC_POLLS, CONSTELLATIONS, ALL_DAILY_MESSAGES, LUCKY_TIPS } from './fortune';

export const CONTENT_STATS = {
  // ...기존
  constellations: CONSTELLATIONS.length,      // 12
  dailyMessages: ALL_DAILY_MESSAGES.length,   // 32
  luckyTips: LUCKY_TIPS.length,               // 8
  total: /* 모든 콘텐츠 합계 */
};
```

---

## 검증 결과

### 빌드 검증
```
✅ npm run build 성공
- TypeScript 컴파일 OK
- 타입 에러 없음
```

### 데이터 검증 (scripts/test-fortune-data.mjs)
```
✅ 12지신 운세: 12개 모두 존재
✅ 띠 계산 함수 3개 모두 존재
✅ 띠 계산 로직 테스트 8개 케이스 통과
   - 일반 연도 (1996~2025)
   - 미래 연도 (2032, 2033)
   - 과거 연도 (1955)
✅ 투표 데이터: 45개 (zodiac-polls 10개 + 기존 35개)
✅ 금지 표현 없음
```

### 로직 검증

**1. 띠 계산 로직 (`calculateZodiacSign`)**
```typescript
// year % 12로 인덱스 계산
const signs = ['rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake',
               'horse', 'goat', 'monkey', 'rooster', 'dog', 'pig'];
return signs[year % 12];
```
- 테스트 케이스 전부 통과
- years 배열에 없는 연도도 fallback으로 처리

**2. 별자리 날짜 변환 로직 (`getConstellationByDate`)**
```typescript
// 연도 넘김 처리 (염소자리: 12/22~1/19)
if (start > end) {
  if (dateStr >= start || dateStr <= end) return constellation;
} else {
  if (dateStr >= start && dateStr <= end) return constellation;
}
```
- 염소자리 연도 넘김 케이스 처리됨

**3. 호환성 매트릭스**
- 12x12 = 144 조합 완비
- 결과: ◎(최고), ○(좋음), △(보통), ×(도전)

---

## 리뷰 요청 사항

### 1. 코드 구조 검토
- [ ] ConstellationData 인터페이스 설계 적절성
- [ ] 함수 네이밍 컨벤션 일관성
- [ ] export 구조 적절성

### 2. 콘텐츠 품질 검토
- [ ] MZ 타겟팅 톤앤매너 적절성
- [ ] 바넘 효과 적용의 자연스러움
- [ ] 금지 표현 미사용 확인
- [ ] 성별/연령 고정관념 배제 여부

### 3. 로직 안정성 검토
- [ ] 날짜 범위 경계값 처리
- [ ] null/undefined 반환 케이스 처리
- [ ] 타입 안전성

### 4. 확장성 검토
- [ ] 추후 타로/사주 추가 시 구조 변경 필요성
- [ ] 다국어 지원 대비 여부

---

## 관련 파일 경로

```
src/data/content/fortune/
├── index.ts              # 통합 export
├── zodiac-2025.ts        # 12지신 2025 운세
├── zodiac-polls.ts       # 별자리/띠 투표
├── constellations.ts     # 황도 12궁 (NEW)
└── daily-messages.ts     # 일일 운세 메시지 (NEW)

src/data/content/
├── index.ts              # 전체 콘텐츠 통합
└── types.ts              # 타입 정의

scripts/
└── test-fortune-data.mjs # 검증 스크립트
```

---

## 참고: 콘텐츠 가이드라인

**금지 표현**:
- 죽음/수명 관련 (죽, 사망, 수명, 단명)
- 질병 관련 (암, 당뇨, 우울증, 공황)
- 금융 투자 관련 (주식, 코인, 로또)
- 법률 관련 (소송, 감옥, 구속)
- 단정적 표현 (100%, 확실히, 반드시, 틀림없)

**톤앤매너**:
- MZ 세대 친화적 (밈, 유행어 활용)
- 긍정적이고 가벼운 톤
- 포괄적/범용적 메시지 (Barnum Effect)
- 성별/연령 고정관념 배제
