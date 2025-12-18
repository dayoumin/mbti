/**
 * KakaoShareService
 * 카카오톡 공유 기능 서비스
 *
 * 사용 전 필수:
 * 1. https://developers.kakao.com 에서 앱 등록
 * 2. JavaScript 키 발급
 * 3. 플랫폼 > Web > 사이트 도메인 등록
 * 4. 카카오링크 기능 활성화
 */

// 카카오 SDK 타입 정의
declare global {
  interface Window {
    Kakao?: {
      init: (key: string) => void;
      isInitialized: () => boolean;
      Share: {
        sendDefault: (params: KakaoShareParams) => void;
        sendCustom: (params: { templateId: number; templateArgs?: Record<string, string> }) => void;
      };
    };
  }
}

interface KakaoShareParams {
  objectType: 'feed' | 'list' | 'location' | 'commerce' | 'text';
  content?: {
    title: string;
    description: string;
    imageUrl: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  };
  social?: {
    likeCount?: number;
    commentCount?: number;
    sharedCount?: number;
  };
  buttons?: Array<{
    title: string;
    link: {
      mobileWebUrl: string;
      webUrl: string;
    };
  }>;
}

class KakaoShareService {
  private initialized = false;
  private sdkLoaded = false;

  /**
   * 카카오 SDK 로드 (동적)
   */
  async loadSDK(): Promise<boolean> {
    if (this.sdkLoaded) return true;
    if (typeof window === 'undefined') return false;

    return new Promise((resolve) => {
      // 이미 로드됨
      if (window.Kakao) {
        this.sdkLoaded = true;
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://t1.kakaocdn.net/kakao_js_sdk/2.5.0/kakao.min.js';
      script.integrity = 'sha384-kYPsUbBPlktXsY6/oNHSUDZoTX6+YI51f63jCPEIPFP09ttByAdxd2mEjKuhdqn4';
      script.crossOrigin = 'anonymous';
      script.async = true;

      script.onload = () => {
        this.sdkLoaded = true;
        resolve(true);
      };

      script.onerror = () => {
        console.error('Kakao SDK 로드 실패');
        resolve(false);
      };

      document.head.appendChild(script);
    });
  }

  /**
   * 카카오 SDK 초기화
   * @param appKey - 카카오 JavaScript 앱 키
   */
  async init(appKey: string): Promise<boolean> {
    if (this.initialized) return true;

    const loaded = await this.loadSDK();
    if (!loaded || !window.Kakao) return false;

    try {
      if (!window.Kakao.isInitialized()) {
        window.Kakao.init(appKey);
      }
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Kakao SDK 초기화 실패:', error);
      return false;
    }
  }

  /**
   * 카카오톡 피드 공유
   */
  async shareFeed(params: {
    title: string;
    description: string;
    imageUrl: string;
    buttonTitle?: string;
    linkUrl?: string;
  }): Promise<boolean> {
    if (!this.initialized || !window.Kakao) {
      console.warn('Kakao SDK가 초기화되지 않았습니다');
      return false;
    }

    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const linkUrl = params.linkUrl || baseUrl;

    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: params.title,
          description: params.description,
          imageUrl: params.imageUrl,
          link: {
            mobileWebUrl: linkUrl,
            webUrl: linkUrl,
          },
        },
        buttons: [
          {
            title: params.buttonTitle || '나도 테스트하기',
            link: {
              mobileWebUrl: linkUrl,
              webUrl: linkUrl,
            },
          },
        ],
      });
      return true;
    } catch (error) {
      console.error('카카오톡 공유 실패:', error);
      return false;
    }
  }

  /**
   * 테스트 결과 공유용 헬퍼
   */
  async shareTestResult(params: {
    testTitle: string;
    resultEmoji: string;
    resultName: string;
    resultDesc: string;
    imageUrl?: string;
    linkUrl?: string; // UTM이 포함된 공유 URL
  }): Promise<boolean> {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

    // 기본 이미지 (없으면 OG 이미지 사용)
    const imageUrl = params.imageUrl || `${baseUrl}/og-image.png`;

    return this.shareFeed({
      title: `${params.resultEmoji} ${params.resultName}`,
      description: `${params.testTitle} 결과\n"${params.resultDesc}"`,
      imageUrl,
      buttonTitle: '나도 테스트하기',
      linkUrl: params.linkUrl || baseUrl,
    });
  }

  /**
   * 랭킹 공유용 헬퍼
   */
  async shareRanking(params: {
    title: string;
    description: string;
    top3: Array<{ emoji: string; name: string }>;
    imageUrl?: string;
  }): Promise<boolean> {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    const imageUrl = params.imageUrl || `${baseUrl}/og-image.png`;

    const rankEmojis = ['1위', '2위', '3위'];
    const top3Text = params.top3
      .slice(0, 3)
      .map((r, i) => `${rankEmojis[i]} ${r.emoji} ${r.name}`)
      .join('\n');

    return this.shareFeed({
      title: params.title,
      description: `${params.description}\n\n${top3Text}`,
      imageUrl,
      buttonTitle: '전체 순위 보기',
      linkUrl: baseUrl,
    });
  }

  /**
   * 초기화 상태 확인
   */
  isReady(): boolean {
    return this.initialized && !!window.Kakao;
  }
}

// 싱글톤 인스턴스
export const kakaoShareService = new KakaoShareService();
export default KakaoShareService;
