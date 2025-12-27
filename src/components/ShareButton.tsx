'use client';

import { useState } from 'react';
import { Share2, Download, Copy, Check } from 'lucide-react';

/**
 * SNS 공유 강화 버튼
 * - URL 복사
 * - 이미지 다운로드 (Canvas API)
 * - Instagram Story 최적화
 */
export default function ShareButton({
  resultName,
  resultEmoji,
  testTitle,
  mode = 'button',
}: {
  resultName: string;
  resultEmoji: string;
  testTitle: string;
  mode?: 'button' | 'icon';
}) {
  const [copied, setCopied] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('복사 실패:', err);
    }
  };

  const handleDownloadImage = () => {
    // Canvas API로 이미지 생성
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920; // Instagram Story 비율 (9:16)

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 배경 그라데이션
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#f0f9ff'); // from-blue-50
    gradient.addColorStop(1, '#faf5ff'); // to-purple-50
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 한글 안전 폰트 스택
    const koreanFont = '"Malgun Gothic", "Apple SD Gothic Neo", Arial, sans-serif';

    // 이모지 (크게)
    ctx.font = `bold 300px ${koreanFont}`;
    ctx.textAlign = 'center';
    ctx.fillText(resultEmoji, canvas.width / 2, 500);

    // 결과 이름
    ctx.font = `bold 100px ${koreanFont}`;
    ctx.fillStyle = '#1e293b'; // text-slate-800
    ctx.fillText(resultName, canvas.width / 2, 700);

    // 테스트 제목
    ctx.font = `50px ${koreanFont}`;
    ctx.fillStyle = '#64748b'; // text-slate-500
    ctx.fillText(testTitle, canvas.width / 2, 800);

    // URL (하단) - 동적 도메인
    ctx.font = `40px ${koreanFont}`;
    ctx.fillStyle = '#94a3b8'; // text-slate-400
    const domain = window.location.hostname || 'chemi.kr';
    ctx.fillText(domain, canvas.width / 2, 1800);

    // 다운로드
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${testTitle}-${resultName}.png`;
      a.click();
      URL.revokeObjectURL(url);
    });

    setShowMenu(false);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `나는 ${resultName}! ${resultEmoji}`,
          text: `${testTitle} 결과: ${resultName}`,
          url: window.location.href,
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      handleCopyLink();
    }
    setShowMenu(false);
  };

  if (mode === 'icon') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-2 rounded-full bg-slate-50/50 backdrop-blur-sm shadow-sm hover:bg-slate-50 text-indigo-600"
        >
          <Share2 className="w-5 h-5" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-full mt-2 w-48 bg-slate-50 rounded-lg shadow-xl border border-slate-200 py-2 z-50">
            <button
              onClick={handleNativeShare}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              공유하기
            </button>
            <button
              onClick={handleCopyLink}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
              {copied ? '복사됨!' : 'URL 복사'}
            </button>
            <button
              onClick={handleDownloadImage}
              className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              이미지 저장
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={handleNativeShare}
      className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:from-indigo-600 hover:to-purple-600 transition-all shadow-lg"
    >
      <Share2 className="w-4 h-4" />
      공유하기
    </button>
  );
}
