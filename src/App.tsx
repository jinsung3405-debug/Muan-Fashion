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
  Share2,
  Users
} from 'lucide-react';
import { FashionApp } from './components/FashionApp';
import { MakingGuideModal } from './components/MakingGuideModal';
import { TeacherSettingsModal } from './components/TeacherSettingsModal';
import { ShareModal } from './components/ShareModal';
import { ClassDataViewerModal } from './components/ClassDataViewerModal';
import { AppConfig, StudentSubmissionRecord } from './types';
import { DEFAULT_CONFIG } from './data/fashionData';

const CONFIG_STORAGE_KEY = 'fashion_quiz_config_v3';
const SUBMISSIONS_STORAGE_KEY = 'fashion_quiz_submissions_v3';

export default function App() {
  const [config, setConfig] = useState<AppConfig>(() => {
    try {
      const saved = localStorage.getItem(CONFIG_STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.warn('Failed to load saved config:', e);
    }
    return DEFAULT_CONFIG;
  });

  const [submissions, setSubmissions] = useState<StudentSubmissionRecord[]>(() => {
    try {
      const saved = localStorage.getItem(SUBMISSIONS_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load saved submissions:', e);
    }
    return [];
  });

  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isClassDataOpen, setIsClassDataOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'mobile' | 'expanded'>('mobile');

  const handleSaveConfig = (newConfig: AppConfig) => {
    setConfig(newConfig);
    try {
      localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(newConfig));
    } catch (e) {
      console.warn('Failed to save config:', e);
    }
  };

  const handleSaveSubmission = (record: StudentSubmissionRecord) => {
    setSubmissions((prev) => {
      const updated = [record, ...prev];
      try {
        localStorage.setItem(SUBMISSIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save submission:', e);
      }
      return updated;
    });
  };

  const handleClearSubmissions = () => {
    setSubmissions([]);
    try {
      localStorage.removeItem(SUBMISSIONS_STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear submissions:', e);
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
            {/* Class Data Viewer */}
            <button
              onClick={() => setIsClassDataOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold font-jua text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Users className="w-4 h-4 text-white" />
              <span>반별 데이터 ({submissions.length})</span>
            </button>

            {/* Share to Students Button */}
            <button
              onClick={() => setIsShareOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500 hover:bg-pink-400 text-white font-bold font-jua text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <QrCode className="w-4 h-4 text-white" />
              <span>학생 공유 (QR)</span>
            </button>

            {/* Google Sheets / Teacher Settings */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white border border-emerald-400 text-xs font-bold font-jua transition-all active:scale-95 cursor-pointer shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4 text-white" />
              <span>구글 시트 연동 설정</span>
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
              className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs transition-colors cursor-pointer"
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
                  <span>써비쌤의 각 반별 맞춤 데이터 누적 시스템</span>
                </div>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  학생들이 제출하면 구글 스프레드시트에 <strong>각 반별 탭(1반, 2반, 3반...)</strong>이 자동으로 생성되어 자기 반 탭에만 차곡차곡 누적됩니다.
                </p>

                <div className="pt-2 border-t border-stone-700 space-y-2 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>반별 자동 분리</strong>: 1반 학생은 [1반] 탭, 2반 학생은 [2반] 탭으로 자동 저장!</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>전체통합 시트</strong>: 전교생 전체 응답도 한 번에 모아서 확인 가능</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span><strong>로컬 백업 & 엑셀</strong>: 시트 연결 없이도 [반별 데이터] 메뉴에서 즉시 엑셀 다운로드</span>
                  </div>
                </div>
              </div>

              {/* Class Submissions Overview Card */}
              <div className="bg-indigo-950/40 border border-indigo-600/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-jua text-indigo-300 text-sm flex items-center gap-1.5 mb-1">
                    <Users className="w-4 h-4" /> 반별 응답 현황 ({submissions.length}명 제출됨)
                  </div>
                  <p className="text-xs text-stone-400">
                    반별로 필터링하고 CSV 엑셀로 한 번에 다운로드할 수 있습니다.
                  </p>
                </div>
                <button
                  onClick={() => setIsClassDataOpen(true)}
                  className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-jua font-bold shrink-0 shadow-sm cursor-pointer"
                >
                  명단 보기
                </button>
              </div>

              {/* Share QR Preview Card */}
              <div className="bg-pink-950/40 border border-pink-600/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-jua text-pink-300 text-sm flex items-center gap-1.5 mb-1">
                    <QrCode className="w-4 h-4" /> 학생 접속용 대형 QR 코드
                  </div>
                  <p className="text-xs text-stone-400">
                    빔프로젝터나 교실 모니터에 크게 띄워 학생들을 참여시키세요.
                  </p>
                </div>
                <button
                  onClick={() => setIsShareOpen(true)}
                  className="px-3 py-1.5 bg-pink-500 hover:bg-pink-400 text-white rounded-xl text-xs font-jua font-bold shrink-0 shadow-sm cursor-pointer"
                >
                  QR 열기
                </button>
              </div>

              {/* Google Sheets Status Card */}
              <div className="bg-emerald-950/40 border border-emerald-600/50 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-jua text-emerald-300 text-sm flex items-center gap-1.5 mb-1">
                    <FileSpreadsheet className="w-4 h-4" /> 써비쌤의 구글 시트 연동 상태
                  </div>
                  <p className="text-xs text-stone-400">
                    {config.googleSheetWebhookUrl ? (
                      <span className="text-emerald-400 font-bold">● Apps Script Webhook 연결됨</span>
                    ) : (
                      <span className="text-amber-400">○ 연동 URL 설정 필요</span>
                    )}
                  </p>
                </div>
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-jua font-bold shrink-0 shadow-sm cursor-pointer"
                >
                  설정 가이드
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
                onOpenClassData={() => setIsClassDataOpen(true)}
                onSaveSubmission={handleSaveSubmission}
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
              onOpenClassData={() => setIsClassDataOpen(true)}
              onSaveSubmission={handleSaveSubmission}
            />
          </div>
        )}

      </main>

      {/* Class Data Viewer Modal */}
      <ClassDataViewerModal
        isOpen={isClassDataOpen}
        onClose={() => setIsClassDataOpen(false)}
        submissions={submissions}
        onClearSubmissions={handleClearSubmissions}
        googleSheetUrl={config.googleSheetWebhookUrl}
      />

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
