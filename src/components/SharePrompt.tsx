'use client';

import { useState } from 'react';

interface SharePromptProps {
  title: string;
  text: string;
  url: string;
  triggerText?: string;
  onShare?: (method: 'native' | 'copy' | 'twitter' | 'kakao') => void;
  className?: string;
}

export default function SharePrompt({
  title,
  text,
  url,
  triggerText = '친구에게 공유하기',
  onShare,
  className = '',
}: SharePromptProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url });
        onShare?.('native');
      } catch {
        // 사용자가 취소한 경우
      }
    } else {
      setShowOptions(true);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      onShare?.('copy');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 복사 실패
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
    onShare?.('twitter');
  };

  const handleKakaoShare = () => {
    // Kakao SDK 필요
    if (typeof window !== 'undefined' && (window as unknown as { Kakao?: { Share?: { sendDefault: (config: Record<string, unknown>) => void } } }).Kakao?.Share) {
      const Kakao = (window as unknown as { Kakao: { Share: { sendDefault: (config: Record<string, unknown>) => void } } }).Kakao;
      Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title,
          description: text,
          imageUrl: `${url}/og-image.png`,
          link: { mobileWebUrl: url, webUrl: url },
        },
        buttons: [
          { title: '자세히 보기', link: { mobileWebUrl: url, webUrl: url } },
        ],
      });
      onShare?.('kakao');
    } else {
      // Kakao SDK 없으면 링크 복사
      handleCopyLink();
    }
  };

  return (
    <div className={`${className}`}>
      {/* 메인 공유 버튼 */}
      <button
        onClick={handleNativeShare}
        className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium py-3 px-4 rounded-xl flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        {triggerText}
      </button>

      {/* 공유 옵션 (Native Share API 없을 때) */}
      {showOptions && (
        <div className="mt-3 bg-gray-50 rounded-xl p-4 space-y-2">
          <button
            onClick={handleCopyLink}
            className="w-full bg-slate-50 border border-gray-200 text-gray-700 py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
          >
            {copied ? (
              <>
                <span className="text-green-500">✓</span>
                <span>복사 완료!</span>
              </>
            ) : (
              <>
                <span>🔗</span>
                <span>링크 복사</span>
              </>
            )}
          </button>

          <button
            onClick={handleTwitterShare}
            className="w-full bg-[#1DA1F2] text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#1a8cd8] transition-colors"
          >
            <span>𝕏</span>
            <span>X(트위터) 공유</span>
          </button>

          <button
            onClick={handleKakaoShare}
            className="w-full bg-[#FEE500] text-[#391B1B] py-2 px-4 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e6cf00] transition-colors"
          >
            <span>💬</span>
            <span>카카오톡 공유</span>
          </button>
        </div>
      )}
    </div>
  );
}
