# Scripts 가이드

## 폴더 구조

```
scripts/
├── validate-*.mjs      # 핵심 검증 스크립트 (유지)
├── transform-data.mjs  # 데이터 변환 (유지)
├── tools/              # 일회성/유틸리티 스크립트
└── migrations/         # DB 마이그레이션
```

## 핵심 스크립트 (루트)

| 스크립트 | 용도 | 실행 방법 |
|---------|------|----------|
| `validate-all-content.mjs` | **통합 검증** (모든 검증 실행) | `npm run validate` |
| `validate-content-files.mjs` | 콘텐츠 파일 이중 검증 | `npm run validate:content` |
| `validate-content-samples.mjs` | 샘플 데이터 형식 검증 | `node scripts/validate-content-samples.mjs` |
| `validate-test-data.mjs` | 테스트 데이터 검증 | `node scripts/validate-test-data.mjs {subject}` |
| `validate-situation-reactions.mjs` | 상황반응 콘텐츠 검증 | `node scripts/validate-situation-reactions.mjs` |
| `validate-tags-quality.mjs` | 태그 품질 검증 | `node scripts/validate-tags-quality.mjs` |
| `transform-data.mjs` | 데이터 구조 변환 | `node scripts/transform-data.mjs` |

## npm scripts

```bash
# 자주 사용하는 명령어
npm run validate        # 전체 콘텐츠 검증
npm run validate:content # 콘텐츠 파일만 검증
npm run build           # 빌드 (자동으로 validate:content 실행)
```

## 스크립트 실행 방법

### .mjs 파일 (Node.js)
```bash
node scripts/validate-all-content.mjs
node scripts/validate-test-data.mjs whiskey
```

### .ts 파일 (TypeScript)
```bash
npx tsx scripts/tools/some-script.ts
# 또는
npm exec tsx scripts/tools/some-script.ts
```

> **참고**: tsx가 devDependencies에 설치되어 있어 .ts 파일도 직접 실행 가능

## 폴더별 설명

### tools/
일회성 스크립트, 테스트용 스크립트가 보관됨.
- `add-*.mjs` - 데이터 추가 도구
- `fix-*.mjs` - 데이터 수정 도구
- `test-*.mjs/ts` - 기능 테스트 스크립트
- `verify-*.mjs` - 검증 유틸리티
- `check-*.ts` - 일관성 검사

### migrations/
DB 스키마 마이그레이션 파일.
- `*.sql` - SQL 마이그레이션
- `setup-turso-schema.mjs` - Turso 초기 설정
- `run-migration.mjs` - 마이그레이션 실행

## 새 스크립트 작성 시

1. **일회성 작업** → `tools/` 폴더에 작성
2. **반복 사용 검증** → 루트에 `validate-*.mjs`로 작성
3. **DB 작업** → `migrations/` 폴더에 작성

### 권장 사항
- `.ts` 파일 권장 (타입 안전성)
- 실행: `npx tsx scripts/tools/my-script.ts`
- 공통 유틸이 필요하면 루트의 기존 스크립트 참고

## 검증 체계 전체 그림

```
[빌드 타임]
npm run build
 └─ prebuild: validate-content-files.mjs

[수동 검증]
npm run validate (= validate-all-content.mjs)
 ├─ validate-content-samples.mjs
 ├─ validate-content-files.mjs
 ├─ 연령 등급 검증
 └─ 태그 품질 검증

[AI 생성 시]
content-workflow 스킬
 ├─ content-creator Agent
 │   └─ content-validator Skill
 ├─ content-quality-checker Agent (2차)
 └─ npm run build
```
