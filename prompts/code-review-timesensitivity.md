# timeSensitivity 전체 코드 리뷰 요청

## 목적
모든 콘텐츠 파일에 `timeSensitivity` 메타데이터가 올바르게 추가되었는지 검증하고, 일관성 및 품질을 확인합니다.

## 배경
- **timeSensitivity**: 콘텐츠 유효기간 관리를 위한 메타데이터
- **sensitivity 레벨**: `high`(2년), `medium`(3년), `low`(4년), `none`(무제한)
- **sourceYear**: 콘텐츠 생성 연도 (2025)

## 검토 대상 파일 (34개)

### 퀴즈 (18개) - `src/data/content/quizzes/`
| 파일 | 예상 sensitivity | 이유 |
|------|-----------------|------|
| bird-knowledge.ts | none | 동물 지식 (불변) |
| bloodtype-scenario.ts | none | 혈액형 성향 (불변) |
| cat-knowledge.ts | none | 동물 지식 (불변) |
| cat-scenario.ts | none | 동물 성향 (불변) |
| coffee-knowledge.ts | low | 커피 지식 (트렌드 영향) |
| dog-knowledge.ts | none | 동물 지식 (불변) |
| dog-scenario.ts | none | 동물 성향 (불변) |
| fish-knowledge.ts | none | 동물 지식 (불변) |
| hamster-knowledge.ts | none | 동물 지식 (불변) |
| kids-animals.ts | none | 아동용 동물 상식 |
| love-knowledge.ts | low | 연애 상식 (트렌드 영향) |
| nostalgia-knowledge.ts | low | 추억/트렌드 (시대 영향) |
| plant-knowledge.ts | none | 식물 지식 (불변) |
| rabbit-knowledge.ts | none | 동물 지식 (불변) |
| rabbit-scenario.ts | none | 동물 성향 (불변) |
| reptile-knowledge.ts | none | 동물 지식 (불변) |
| tarot-quizzes.ts | none | 타로 상식 (불변) |
| wine-knowledge.ts | low | 와인 지식 (트렌드 영향) |

### 투표 (10개) - `src/data/content/polls/`
| 파일 | 예상 sensitivity | 이유 |
|------|-----------------|------|
| choice-polls.ts | none | 일반 라이프스타일/의견 |
| coffee-vs-polls.ts | low | 커피 취향 (트렌드 영향) |
| kids-polls.ts | none | 아동용 취향 (불변) |
| love-vs-polls.ts | low | 연애 스타일 (트렌드 영향) |
| money-polls.ts | low | 재테크/소비 (경제 상황 영향) |
| seasonal-polls.ts | low | 시즌 콘텐츠 |
| tarot-polls.ts | none | 타로 관련 (불변) |
| vs-polls.ts | low | 밸런스게임 (트렌드 영향) |

### 상황반응 (6개) - `src/data/content/situation-reactions/`
| 파일 | 예상 sensitivity | 이유 |
|------|-----------------|------|
| awkward.ts | none | 보편적 상황 |
| daily.ts | none | 일상 상황 |
| food.ts | none | 음식 상황 |
| love.ts | low | 연애 상황 |
| social.ts | none | 사회적 상황 |
| work.ts | low | 직장 상황 |

## 검증 항목

### 1. 필수 체크리스트
- [ ] 모든 파일에 `DEFAULT_TIME_SENSITIVITY` 상수가 정의되어 있는가?
- [ ] 모든 콘텐츠 항목에 `meta.timeSensitivity`가 포함되어 있는가?
- [ ] `sensitivity` 값이 위 표와 일치하는가?
- [ ] `sourceYear`가 모두 2025인가?

### 2. 일관성 체크
- [ ] 같은 카테고리 파일들의 sensitivity 레벨이 일관적인가?
- [ ] 기존 meta 속성(minAge, ageRating, seasonal 등)이 유지되어 있는가?
- [ ] spread 문법(`...DEFAULT_TIME_SENSITIVITY`)이 올바르게 사용되었는가?

### 3. 코드 품질 체크
- [ ] TypeScript 타입 에러가 없는가?
- [ ] 들여쓰기와 포맷팅이 일관적인가?
- [ ] 불필요한 중복 코드가 없는가?

## 검증 방법

### 빠른 검증 (터미널)
```bash
# 빌드 성공 확인
npm run build

# timeSensitivity 커버리지 확인
node -e "
const fs = require('fs');
const path = require('path');

const dirs = [
  'src/data/content/quizzes',
  'src/data/content/polls',
  'src/data/content/situation-reactions'
];

let total = 0, covered = 0;
dirs.forEach(dir => {
  fs.readdirSync(dir).filter(f => f.endsWith('.ts') && f !== 'index.ts').forEach(file => {
    total++;
    if (fs.readFileSync(path.join(dir, file), 'utf8').includes('timeSensitivity')) covered++;
  });
});
console.log(\`Coverage: \${covered}/\${total} (\${Math.round(covered/total*100)}%)\`);
"
```

### 상세 검증 (파일별)
각 파일을 열어 다음을 확인:
1. 파일 상단에 `DEFAULT_TIME_SENSITIVITY` 상수 존재
2. 각 콘텐츠 항목의 `meta` 필드에 timeSensitivity spread 확인
3. 기존 meta 속성과 병합이 올바른지 확인

## 발견 시 수정 필요 사항

### 우선순위 1 (Critical)
- timeSensitivity 누락된 항목
- 잘못된 sensitivity 레벨 (예: 동물 지식에 `high`)
- 빌드 에러

### 우선순위 2 (Important)
- sourceYear가 2025가 아닌 경우
- 기존 meta 속성 누락 (minAge, ageRating 등)

### 우선순위 3 (Minor)
- 코드 포맷팅 불일치
- 불필요한 공백

## 리뷰 결과 보고 형식

```markdown
## 검증 결과

### 요약
- 검토 파일: XX개
- 통과: XX개
- 문제 발견: XX개

### 발견된 문제 (있는 경우)

#### [파일명]
- **문제**: 설명
- **위치**: 라인 번호 또는 콘텐츠 ID
- **해결 방법**: 제안

### 개선 제안 (선택)
- 코드 품질 향상을 위한 제안
```

## 참고 자료
- 타입 정의: `src/data/content/types.ts` - `TimeSensitivity` 인터페이스
- 대시보드: `src/app/dashboard/components/ContentValidityManager.tsx`
- 검증 스크립트: `scripts/validate-content-files.mjs`
