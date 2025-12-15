# 배포 전 체크리스트

> 배포 전 필수 확인 사항, 보안 점검, 악의적 사용 시나리오 분석

---

## 1. 기술적 체크리스트

### 1.1 빌드 & 환경

| 항목 | 확인 | 비고 |
|------|:----:|------|
| `npm run build` 성공 | [ ] | 타입 에러 없음 |
| `npm run lint` 통과 | [ ] | ESLint 경고 최소화 |
| 환경변수 설정 확인 | [ ] | `.env.local` |
| Supabase 마이그레이션 실행 | [ ] | 001~004.sql |

### 1.2 환경변수 체크

```bash
# 필수 (Supabase 연동 시)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# 선택 (미설정 시 localStorage 사용)
```

### 1.3 데이터 검증

| 항목 | 확인 | 명령어 |
|------|:----:|--------|
| 테스트 데이터 유효성 | [ ] | `node scripts/validate-test-data.mjs all` |
| 모든 결과 도달 가능 | [ ] | 위 스크립트에서 확인 |
| 빈 condition 없음 | [ ] | 위 스크립트에서 확인 |

---

## 2. 법적 체크리스트

> 상세: [LEGAL_COMPLIANCE.md](./LEGAL_COMPLIANCE.md)

### 2.1 상표권/저작권

| 항목 | 확인 |
|------|:----:|
| "MBTI" 단어 없음 | [ ] |
| "Myers-Briggs" 없음 | [ ] |
| 4글자 유형 코드 없음 (ENFP 등) | [ ] |
| E/I, S/N, T/F, J/P 직접 대조 없음 | [ ] |
| MBTI식 대조쌍 질문 없음 | [ ] |

### 2.2 콘텐츠 권리

| 항목 | 확인 |
|------|:----:|
| 이미지/아이콘 라이선스 확인 | [ ] |
| 폰트 라이선스 확인 | [ ] |
| 외부 API 이용약관 준수 | [ ] |

---

## 3. 개인정보 & 보안 체크리스트

### 3.1 수집 데이터 목록

| 데이터 | 수집 위치 | 용도 | 개인정보 여부 |
|--------|-----------|------|:------------:|
| device_id | ResultService, AnalyticsService | 익명 사용자 식별 | 준개인정보 |
| user_agent | AnalyticsService.meta | 기기/브라우저 분석 | 준개인정보 |
| screen_width | AnalyticsService.meta | 화면 분석 | X |
| 테스트 결과 | ResultService | 결과 저장/통계 | X |
| 클릭 이벤트 | AnalyticsService | 추천 최적화 | X |
| 퀴즈/투표 응답 | ContentParticipationService | 콘텐츠 참여 | X |

### 3.2 개인정보처리방침 필수 항목

| 항목 | 포함 여부 |
|------|:--------:|
| 수집 항목 명시 | [ ] |
| 수집 목적 명시 | [ ] |
| 보관 기간 명시 | [ ] |
| 제3자 제공 여부 (Supabase) | [ ] |
| 파기 방법 | [ ] |
| 이용자 권리 (삭제 요청 등) | [ ] |

### 3.3 보안 점검 (OWASP Top 10 기반)

| 취약점 | 상태 | 대응 |
|--------|:----:|------|
| XSS (Cross-Site Scripting) | ✅ | React 자동 이스케이프 |
| SQL Injection | ✅ | Supabase ORM 사용 |
| CSRF | ✅ | SameSite 쿠키 (Supabase) |
| 인증 우회 | N/A | 익명 서비스 |
| 민감 데이터 노출 | ✅ | 민감 정보 미수집 |
| 보안 설정 오류 | [ ] | RLS 정책 확인 |
| 컴포넌트 취약점 | [ ] | `npm audit` 실행 |

```bash
# 의존성 취약점 검사
npm audit

# 수정 가능한 취약점 자동 수정
npm audit fix
```

---

## 4. 악의적 사용 시나리오 분석

### 4.1 데이터 조작

| 시나리오 | 위험도 | 현재 상태 | 대응 방안 |
|----------|:------:|-----------|-----------|
| localStorage 조작으로 가짜 결과 생성 | 낮음 | 허용됨 | 서버 검증 없음 (개인 용도) |
| device_id 위조로 다른 사용자 데이터 접근 | 낮음 | RLS로 차단 | Supabase RLS 정책 |
| 대량 이벤트 전송 (DoS) | 중간 | 배치 처리로 완화 | Rate limiting 미구현 |

**Rate Limiting 권장 구현:**
```typescript
// AnalyticsService에 추가 권장
private eventCount = 0;
private resetTime = Date.now();
private readonly MAX_EVENTS_PER_MINUTE = 100;

track(event: AnalyticsEvent): void {
  // Rate limiting
  if (Date.now() - this.resetTime > 60000) {
    this.eventCount = 0;
    this.resetTime = Date.now();
  }
  if (this.eventCount >= this.MAX_EVENTS_PER_MINUTE) {
    console.warn('[AnalyticsService] Rate limit exceeded');
    return;
  }
  this.eventCount++;
  // ... 기존 로직
}
```

### 4.2 콘텐츠 악용

| 시나리오 | 위험도 | 현재 상태 | 대응 방안 |
|----------|:------:|-----------|-----------|
| 테스트 결과 스크린샷으로 허위 정보 유포 | 낮음 | 허용됨 | 결과에 "재미용" 고지 |
| 결과를 심리 진단으로 오해 | 중간 | 고지 부족 | 면책 조항 추가 필요 |
| 공유 기능으로 스팸 유포 | 낮음 | 허용됨 | 공유 URL에 도메인만 |

**면책 조항 권장 문구:**
```
이 테스트는 재미와 자기 이해를 위한 것으로,
전문적인 심리 검사나 진단을 대체하지 않습니다.
```

### 4.3 프라이버시 침해

| 시나리오 | 위험도 | 현재 상태 | 대응 방안 |
|----------|:------:|-----------|-----------|
| 다른 사람 결과 무단 공유 | 낮음 | 본인만 접근 | device_id 기반 격리 |
| 공유 링크로 결과 추적 | 낮음 | 링크에 결과 미포함 | 현재 안전 |
| 브라우저 공유 시 결과 노출 | 중간 | localStorage 저장 | 공용 기기 주의 안내 |

**공용 기기 안내 권장:**
```
공용 컴퓨터에서는 사용 후 브라우저 데이터를 삭제하세요.
```

### 4.4 서비스 남용

| 시나리오 | 위험도 | 현재 상태 | 대응 방안 |
|----------|:------:|-----------|-----------|
| 봇으로 대량 테스트 실행 | 낮음 | 허용됨 | 영향 없음 (무료 서비스) |
| 투표/퀴즈 조작 | 중간 | device_id 중복 체크 | 현재 구현됨 |
| 가짜 피드백 대량 전송 | 낮음 | 허용됨 | Rate limiting 권장 |

---

## 5. 사용자 시나리오별 위험 분석

### 5.1 일반 사용자

```
[정상] 테스트 → 결과 확인 → 공유 → 다른 테스트
위험: 없음
```

### 5.2 악의적 사용자

```
[시도] 콘솔에서 localStorage 조작
결과: 본인 데이터만 영향, 타인 피해 없음
위험도: 낮음

[시도] 반복 클릭으로 이벤트 폭탄
결과: 배치 처리로 DB 부하 분산, 본인 데이터만 오염
위험도: 낮음 (Rate limiting 추가 권장)

[시도] device_id 위조로 타인 데이터 접근
결과: Supabase RLS로 차단 (본인 device_id만 조회 가능)
위험도: 낮음
```

### 5.3 경쟁사/크롤러

```
[시도] 테스트 문항/결과 크롤링
결과: 공개 데이터, 막을 필요 없음
위험도: 낮음

[시도] API 직접 호출
결과: RLS로 보호, 타인 데이터 접근 불가
위험도: 낮음
```

---

## 6. 권장 조치 사항

### 6.1 필수 (배포 전)

- [ ] 개인정보처리방침 페이지 추가
- [ ] 면책 조항 추가 ("재미용 테스트" 고지)
- [ ] `npm audit` 실행 및 취약점 수정

### 6.2 권장 (배포 후)

- [ ] Rate limiting 구현 (AnalyticsService)
- [ ] 공용 기기 사용 안내 추가
- [ ] 에러 모니터링 설정 (Sentry 등)

### 6.3 선택 (향후)

- [ ] 데이터 삭제 기능 (GDPR 대응)
- [ ] 데이터 내보내기 기능
- [ ] 사용 통계 대시보드

---

## 7. 배포 프로세스

### 7.1 사전 체크

```bash
# 1. 빌드 확인
npm run build

# 2. 테스트 데이터 검증
node scripts/validate-test-data.mjs all

# 3. 보안 검사
npm audit

# 4. 환경변수 확인
cat .env.local
```

### 7.2 배포 순서

1. Supabase 마이그레이션 실행 (001~004.sql)
2. 환경변수 설정
3. 빌드 및 배포
4. 배포 후 테스트
   - 테스트 실행 → 결과 확인
   - localStorage 저장 확인
   - Supabase 데이터 저장 확인 (연동 시)

### 7.3 롤백 계획

```
문제 발생 시:
1. 이전 버전으로 롤백
2. Supabase 데이터는 영향 없음 (호환)
3. localStorage 데이터는 유지됨
```

---

## 업데이트 이력

| 날짜 | 변경 내용 |
|------|-----------|
| 2025-12-15 | 초기 문서 작성 |
