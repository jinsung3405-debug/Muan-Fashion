import React, { useEffect, useRef, useState } from 'react';
import QRCode from 'qrcode';
import { 
  X, 
  Copy, 
  Check, 
  QrCode, 
  Share2, 
  Sparkles, 
  Smartphone, 
  CheckCircle2, 
  HelpCircle 
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  appTitle: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  appTitle,
}) => {
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && canvasRef.current && currentUrl) {
      QRCode.toCanvas(
        canvasRef.current,
        currentUrl,
        {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#1c1917',
            light: '#ffffff',
          },
        },
        (error) => {
          if (error) console.error('QR code generation failed:', error);
        }
      );
    }
  }, [isOpen, currentUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border-2 border-stone-800 overflow-hidden font-gowun text-stone-900 animate-scaleUp">
        
        {/* Header */}
        <div className="bg-pink-100 border-b-2 border-stone-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-pink-500 border border-stone-900 flex items-center justify-center text-white shadow-xs">
              <Share2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-jua text-lg text-stone-900">학생들에게 앱 공유하기</h3>
              <p className="text-xs text-stone-600">스마트폰이나 태블릿으로 바로 참여</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-pink-200 border border-stone-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-stone-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 flex flex-col items-center text-center">
          
          <div className="bg-pink-50 border border-pink-200 px-3.5 py-1.5 rounded-full text-xs font-bold text-pink-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>수업 화면(빔프로젝터/TV)에 띄워주세요!</span>
          </div>

          {/* QR Code Container */}
          <div className="p-3 bg-white border-2 border-stone-900 rounded-2xl shadow-md">
            <canvas ref={canvasRef} className="rounded-lg" />
          </div>

          <p className="text-xs text-stone-600 max-w-xs leading-relaxed">
            학생들이 <strong>스마트폰 카메라</strong>로 위 QR코드를 비추면 로그인 없이 즉시 퀴즈에 참여할 수 있습니다.
          </p>

          {/* Copy Link Input */}
          <div className="w-full space-y-1.5 text-left">
            <label className="text-xs font-bold text-stone-700 font-jua">
              직접 접속 링크 (구글 클래스룸 / 카톡 전송용)
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 text-xs bg-stone-100 border-2 border-stone-300 rounded-xl font-mono text-stone-700 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl text-xs font-jua font-bold flex items-center gap-1 shrink-0 transition-transform active:scale-95 shadow-sm"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? '복사됨!' : '링크 복사'}
              </button>
            </div>
          </div>

          {/* Quick Tip */}
          <div className="w-full bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-left text-xs text-emerald-900 flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>학생들이 마지막 14번 슬라이드에서 <strong>[선생님께 제출하기]</strong>를 누르면 선생님의 구글 시트로 실시간 저장됩니다!</span>
          </div>

        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 p-3.5 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-jua text-xs transition-colors"
          >
            닫기
          </button>
        </div>

      </div>
    </div>
  );
};
