/**
 * UTM 유틸리티 - 공유 링크 생성 및 유입 추적
 *
 * 사용법:
 * - 공유 시: generateShareUrl(url, 'kakao', 'dog-result')
 * - 유입 시: parseAndStoreUTM() - 앱 초기화 시 호출
 * - 조회: getStoredUTM()
 */

// ========== 타입 정의 ==========

export interface UTMParams {
  utm_source: string;      // 유입 출처 (kakao, instagram, link_copy)
  utm_medium: string;      // 매체 (social, share, direct)
  utm_campaign?: string;   // 캠페인 (test-result, vs-poll, quiz)
  utm_content?: string;    // 콘텐츠 (dog, cat, human)
  utm_term?: string;       // 키워드 (선택)
}

export type SharePlatform =
  | 'kakao'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'link_copy'
  | 'native_share'
  | 'direct';

export type ShareContent =
  | 'test-result'
  | 'vs-poll'
  | 'quiz'
  | 'home';

// ========== 상수 ==========

const UTM_STORAGE_KEY = 'chemi_utm';
const UTM_EXPIRY_MS = 7 * 24 * 60 * 60 * 1000; // 7일

// 플랫폼별 기본 medium
const PLATFORM_MEDIUM: Record<SharePlatform, string> = {
  kakao: 'social',
  instagram: 'social',
  facebook: 'social',
  twitter: 'social',
  link_copy: 'share',
  native_share: 'share',
  direct: 'direct',
};

// ========== 공유 URL 생성 ==========

/**
 * 공유용 URL에 UTM 파라미터 추가
 *
 * @param baseUrl - 기본 URL (예: 'https://chemi.app')
 * @param platform - 공유 플랫폼 (kakao, instagram, link_copy 등)
 * @param content - 공유 콘텐츠 유형 (test-result, vs-poll 등)
 * @param contentId - 콘텐츠 ID (테스트 키, 투표 ID 등)
 * @returns UTM이 포함된 URL
 *
 * @example
 * generateShareUrl('https://chemi.app/result/dog', 'kakao', 'test-result', 'golden-retriever')
 * // => 'https://chemi.app/result/dog?utm_source=kakao&utm_medium=social&utm_campaign=test-result&utm_content=golden-retriever'
 */
export function generateShareUrl(
  baseUrl: string,
  platform: SharePlatform,
  content: ShareContent,
  contentId?: string
): string {
  const url = new URL(baseUrl);

  // 기존 UTM 파라미터 제거 (중복 방지)
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
    url.searchParams.delete(param);
  });

  // UTM 파라미터 추가
  url.searchParams.set('utm_source', platform);
  url.searchParams.set('utm_medium', PLATFORM_MEDIUM[platform]);
  url.searchParams.set('utm_campaign', content);

  if (contentId) {
    url.searchParams.set('utm_content', contentId);
  }

  return url.toString();
}

/**
 * 현재 페이지 URL에 UTM 추가
 */
export function generateCurrentPageShareUrl(
  platform: SharePlatform,
  content: ShareContent,
  contentId?: string
): string {
  if (typeof window === 'undefined') {
    return '';
  }

  // 현재 URL에서 쿼리 파라미터 제거한 기본 URL
  const baseUrl = `${window.location.origin}${window.location.pathname}`;
  return generateShareUrl(baseUrl, platform, content, contentId);
}

// ========== UTM 파싱 및 저장 ==========

/**
 * URL에서 UTM 파라미터 파싱
 */
export function parseUTMFromUrl(url?: string): UTMParams | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const searchParams = url
    ? new URL(url).searchParams
    : new URLSearchParams(window.location.search);

  const utm_source = searchParams.get('utm_source');
  const utm_medium = searchParams.get('utm_medium');

  // utm_source가 없으면 UTM 없음
  if (!utm_source) {
    return null;
  }

  return {
    utm_source,
    utm_medium: utm_medium || 'unknown',
    utm_campaign: searchParams.get('utm_campaign') || undefined,
    utm_content: searchParams.get('utm_content') || undefined,
    utm_term: searchParams.get('utm_term') || undefined,
  };
}

/**
 * UTM 파라미터를 localStorage에 저장
 * - 첫 방문 시에만 저장 (기존 UTM 덮어쓰지 않음)
 * - 7일 후 만료
 */
export function storeUTM(utm: UTMParams): void {
  if (typeof window === 'undefined') {
    return;
  }

  const stored = localStorage.getItem(UTM_STORAGE_KEY);

  // 이미 유효한 UTM이 있으면 덮어쓰지 않음
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (parsed.expiry > Date.now()) {
        return; // 유효한 기존 UTM 유지
      }
    } catch {
      // 파싱 실패 시 새로 저장
    }
  }

  const data = {
    ...utm,
    storedAt: Date.now(),
    expiry: Date.now() + UTM_EXPIRY_MS,
  };

  localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(data));
}

/**
 * 저장된 UTM 조회
 */
export function getStoredUTM(): UTMParams | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(UTM_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    const parsed = JSON.parse(stored);

    // 만료 체크
    if (parsed.expiry && parsed.expiry < Date.now()) {
      localStorage.removeItem(UTM_STORAGE_KEY);
      return null;
    }

    return {
      utm_source: parsed.utm_source,
      utm_medium: parsed.utm_medium,
      utm_campaign: parsed.utm_campaign,
      utm_content: parsed.utm_content,
      utm_term: parsed.utm_term,
    };
  } catch {
    return null;
  }
}

/**
 * 저장된 UTM 삭제
 */
export function clearStoredUTM(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem(UTM_STORAGE_KEY);
}

/**
 * URL에서 UTM 파싱하고 저장 (앱 초기화 시 호출)
 * - 첫 방문 시 UTM이 있으면 저장
 * - 리퍼러도 함께 저장
 */
export function parseAndStoreUTM(): UTMParams | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const utm = parseUTMFromUrl();

  if (utm) {
    storeUTM(utm);

    // URL에서 UTM 파라미터 제거 (깔끔한 URL)
    cleanUTMFromUrl();
  }

  return utm;
}

/**
 * URL에서 UTM 파라미터 제거 (history.replaceState)
 */
function cleanUTMFromUrl(): void {
  if (typeof window === 'undefined') {
    return;
  }

  const url = new URL(window.location.href);
  let hasUTM = false;

  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(param => {
    if (url.searchParams.has(param)) {
      url.searchParams.delete(param);
      hasUTM = true;
    }
  });

  if (hasUTM) {
    window.history.replaceState({}, '', url.toString());
  }
}

// ========== 리퍼러 추적 ==========

const REFERRER_STORAGE_KEY = 'chemi_referrer';

export interface ReferrerInfo {
  referrer: string;
  domain: string;
  storedAt: number;
}

/**
 * 리퍼러 저장 (첫 방문 시)
 */
export function storeReferrer(): void {
  if (typeof window === 'undefined') {
    return;
  }

  // 이미 저장된 리퍼러가 있으면 무시
  if (localStorage.getItem(REFERRER_STORAGE_KEY)) {
    return;
  }

  const referrer = document.referrer;
  if (!referrer) {
    return;
  }

  try {
    const url = new URL(referrer);
    const data: ReferrerInfo = {
      referrer,
      domain: url.hostname,
      storedAt: Date.now(),
    };
    localStorage.setItem(REFERRER_STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 유효하지 않은 URL
  }
}

/**
 * 저장된 리퍼러 조회
 */
export function getStoredReferrer(): ReferrerInfo | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const stored = localStorage.getItem(REFERRER_STORAGE_KEY);
  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored) as ReferrerInfo;
  } catch {
    return null;
  }
}

// ========== 분석용 유틸리티 ==========

/**
 * 유입 정보 통합 조회 (UTM + Referrer)
 */
export function getAcquisitionInfo(): {
  utm: UTMParams | null;
  referrer: ReferrerInfo | null;
  source: string;
} {
  const utm = getStoredUTM();
  const referrer = getStoredReferrer();

  // 소스 결정: UTM > Referrer > Direct
  let source = 'direct';
  if (utm?.utm_source) {
    source = utm.utm_source;
  } else if (referrer?.domain) {
    source = referrer.domain;
  }

  return { utm, referrer, source };
}

/**
 * 이벤트 전송용 UTM 데이터 포맷
 */
export function getUTMForAnalytics(): Record<string, string | undefined> {
  const utm = getStoredUTM();
  if (!utm) {
    return {};
  }

  return {
    utm_source: utm.utm_source,
    utm_medium: utm.utm_medium,
    utm_campaign: utm.utm_campaign,
    utm_content: utm.utm_content,
    utm_term: utm.utm_term,
  };
}
