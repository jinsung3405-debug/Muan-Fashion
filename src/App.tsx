/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  Settings, 
  Sparkles, 
  Layers, 
  Smartphone, 
  Monitor, 
  ExternalLink,
  Code2,
  FileSpreadsheet,
  CheckCircle,
  HelpCircle,
  Scissors,
  QrCode,
  Share2
} from 'lucide-react';
import { FashionApp } from './components/FashionApp';
import { MakingGuideModal } from './components/MakingGuideModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { ShareModal } from './components/ShareModal';
import { AppConfig } from './types';
import { DEFAULT_CONFIG } from './data/fashionData';

const STORAGE_KEY = 'fashion_quiz_config_v2';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load saved config:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save config:', e);
    }
  };

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex flex-col font-gowun">
      {/* Top Header Bar */}
      <header className="bg-stone-950/90 border-b border-stone-800 backdrop-blur-md sticky top-0 z-40 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-pink-500 border border-pink-400 flex items-center justify-center text-white shadow-md">
              <Scissors className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-jua text-lg text-white tracking-wide">
                  {config.appTitle}
                </span>
                <span className="text-[11px] bg-pink-500/20 text-pink-300 border border-pink-500/40 px-2 py-0.5 rounded-full font-bold">
                  {config.teacherBrand || 'made by 써비쌤'}
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                {config.subTitle} • {config.teacherBrand || 'made by 써비쌤'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Share to Students Button */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold font-jua text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>학생들에게 공유 (QR)</span>
            </button>

            {/* Google Sheets / Teacher Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 text-xs font-bold font-jua transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>구글 시트 연동</span>
            </button>

            {/* How-to Guide */}
            <button
              onClick={() => setIsGuideOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold font-jua text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-stone-950" />
              <span>제작 가이드</span>
            </button>

            {/* View Mode Toggle for desktop */}
            <button
              onClick={() => setViewMode((prev) => (prev === 'mobile' ? 'expanded' : 'mobile'))}
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs transition-colors"
              title="화면 뷰 변경"
            >
              {viewMode === 'mobile' ? (
                <>
                  <Monitor className="w-3.5 h-3.5 text-stone-400" />
                  <span>수업 설명과 함께 보기</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-stone-400" />
                  <span>모바일 캔버스만</span>
                </>
              )}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4">
        
        {viewMode === 'expanded' ? (
          /* Two-column expanded layout for desktop */
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-12 gap-6 items-start py-4">
            
            {/* Left Column: Side Explanation & Teacher Toolkit */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className="bg-stone-800/90 border border-stone-700 rounded-2xl p-5 shadow-lg space-y-3">
                <div className="flex items-center gap-2 text-pink-400 font-jua text-lg">
                  <Sparkles className="w-5 h-5" />
                  <span>써비쌤의 기술가정 인터랙티브 수업</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  아이들이 스마트폰 카메라로 QR코드를 비춰 접속하면, <strong>로그인 없이 14개 미션</strong>을 해결하고 마지막 결과가 <strong>써비쌤의 구글 스프레드시트에 실시간으로 기록</strong>됩니다!
                </p>

                <div className="pt-2 border-t border-stone-700 space-y-2 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>미션 1</strong>: 옷만 보고 첫인상 & 직업 추론 (4인)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>미션 2</strong>: TPO & 기후별 세계 전통의상 퀴즈 (4국)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>미션 3</strong>: 내 체형 자가 진단 및 맞춤 코디 처방</span>
                  </div>
                  <div className="flex items-center gap-2 text-pink-300 font-bold">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>데이터 연동</strong>: 아이들이 제출하면 구글 시트에 1행씩 자동 누적!</span>
                  </div>
                </div>
              </div>

              {/* Share QR Preview Card */}
              <div className="bg-pink-950/40 border border-pink-600/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-jua text-pink-300 text-sm flex items-center gap-1.5 mb-1">
                    <QrCode className="w-4 h-4" /> 학생 접속용 QR 코드
                  </div>
                  <p className="text-xs text-stone-400">
                    빔프로젝터나 모니터에 크게 띄워 학생들을 참여시키세요.
                  </p>
                </div>
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-400 text-white rounded-xl text-xs font-jua font-bold shrink-0 shadow-sm"
                >
                  QR 열기
                </button>
              </div>

              {/* Google Sheets Status Card */}
              <div className="bg-emerald-950/40 border border-emerald-600/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-jua text-emerald-300 text-sm flex items-center gap-1.5 mb-1">
                    <FileSpreadsheet className="w-4 h-4" /> 구글 시트 연동 상태
                  </div>
                  <p className="text-xs text-stone-400">
                    {config.googleSheetWebhookUrl ? (
                      <span className="text-emerald-400 font-bold">● 실시간 수신 준비 완료</span>
                    ) : (
                      <span className="text-amber-400">○ 연동 URL 등록 필요 (1분 소요)</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-jua font-bold shrink-0 shadow-sm"
                >
                  설정하기
                </button>
              </div>

              {/* Brand Card */}
              <div className="bg-stone-800/60 border border-stone-700 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-stone-400">적용된 서명:</div>
                  <div className="font-bold text-sm text-pink-300">{config.teacherBrand || 'made by 써비쌤'}</div>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="text-xs px-2.5 py-1.5 bg-stone-700 hover:bg-stone-600 text-stone-200 rounded-lg font-bold"
                >
                  수정
                </button>
              </div>

            </div>

            {/* Right Column: Interactive App Simulator */}
            <div className="lg:col-span-7 flex justify-center">
              <FashionApp 
                config={config} 
                onOpenGuide={() => setIsGuideOpen(true)}
                onOpenSettings={() => setIsSettingsOpen(true)}
                onOpenShare={() => setIsShareOpen(true)}
              />
            </div>

          </div>
        ) : (
          /* Mobile Frame Centered Layout (Default Clean Experience) */
          <div className="w-full flex justify-center">
            <FashionApp 
              config={config} 
              onOpenGuide={() => setIsGuideOpen(true)}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenShare={() => setIsShareOpen(true)}
            />
          </div>
        )}

      </main>

      {/* Share Modal with QR code */}
      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        appTitle={config.appTitle}
      />

      {/* Guide Modal */}
      <MakingGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Teacher Settings Modal (Google Sheets & Brand) */}
      <TeacherSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />
    </div>
  );
}
