import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  RotateCcw, 
  Check, 
  Sparkles, 
  FileSpreadsheet, 
  Copy, 
  Send, 
  ExternalLink,
  HelpCircle,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { AppConfig } from '../types';
import { DEFAULT_CONFIG } from '../data/fashionData';
import { GOOGLE_SHEETS_WEBHOOK_SCRIPT } from '../data/gasTemplates';

interface TeacherSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AppConfig;
  onSaveConfig: (newConfig: AppConfig) => void;
}

export const TeacherSettingsModal: React.FC<TeacherSettingsModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'sheet' | 'brand'>('sheet');
  const [appTitle, setAppTitle] = useState(config.appTitle);
  const [subTitle, setSubTitle] = useState(config.subTitle);
  const [teacherBrand, setTeacherBrand] = useState(config.teacherBrand || 'made by 써비쌤');
  const [webhookUrl, setWebhookUrl] = useState(config.googleSheetWebhookUrl || '');
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [testStatus, setTestStatus] = useState<{ loading: boolean; success?: boolean; message?: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      appTitle: appTitle.trim() || DEFAULT_CONFIG.appTitle,
      subTitle: subTitle.trim() || DEFAULT_CONFIG.subTitle,
      teacherBrand: teacherBrand.trim() || 'made by 써비쌤',
      googleSheetWebhookUrl: webhookUrl.trim(),
    });
    onClose();
  };

  const handleReset = () => {
    setAppTitle(DEFAULT_CONFIG.appTitle);
    setSubTitle(DEFAULT_CONFIG.subTitle);
    setTeacherBrand('made by 써비쌤');
    setWebhookUrl('');
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_SHEETS_WEBHOOK_SCRIPT);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Test send to the Google Sheet Webhook URL
  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      alert('먼저 구글 앱스 스크립트 웹 앱 URL을 입력해 주세요!');
      return;
    }

    setTestStatus({ loading: true });

    try {
      const testData = {
        studentGrade: '1학년 1반 1번',
        studentName: '테스트 학생',
        m1_1: '발랄함, 유쾌함 / 패션 디자이너',
        m1_2: '조용함, 섬세함 / 미술 작가',
        m1_3: '우아함, 부드러움 / 선생님',
        m1_4: '자유로움, 엉뚱함 / 개발자',
        m2_score: 4,
        m2_1: '정답 (인도)',
        m2_2: '정답 (멕시코)',
        m2_3: '정답 (베트남)',
        m2_4: '정답 (일본)',
        bodyDiagnosis: '균형 직사각형 (스트레이트형)',
        body1: '비슷함',
        body2: '얼굴, 팔, 가슴 등 상체',
        body3: '배꼽 가까이',
      };

      // Send via POST (mode: no-cors is standard for Google Apps Script Web Apps from browser)
      await fetch(webhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(testData),
      });

      setTestStatus({
        loading: false,
        success: true,
        message: '테스트 데이터가 전송되었습니다! 구글 스프레드시트에 새 행이 추가되었는지 확인해 보세요.',
      });
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: '전송 중 오류가 발생했습니다: ' + (err.message || String(err)),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-stone-800 overflow-hidden font-gowun text-stone-900 max-h-[90vh] flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="bg-emerald-100 border-b-2 border-stone-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500 border border-stone-900 flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-jua text-lg text-stone-900">구글 시트 연동 & 선생님 설정</h3>
              <p className="text-xs text-stone-600">학생 응답 실시간 수집 및 브랜딩 설정</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-emerald-200 border border-stone-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-stone-700" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-stone-200 bg-stone-50 px-4 gap-2 pt-2">
          <button
            type="button"
            onClick={() => setActiveTab('sheet')}
            className={`px-4 py-2 text-xs font-bold font-jua rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'sheet'
                ? 'bg-white border-t-2 border-x-2 border-stone-800 text-emerald-800 -mb-[1px]'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> 1. 구글 시트 실시간 연동 (핵심)
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('brand')}
            className={`px-4 py-2 text-xs font-bold font-jua rounded-t-xl transition-all flex items-center gap-1.5 ${
              activeTab === 'brand'
                ? 'bg-white border-t-2 border-x-2 border-stone-800 text-stone-900 -mb-[1px]'
                : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <Settings className="w-3.5 h-3.5" /> 2. 문구 & 브랜드 설정
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {activeTab === 'sheet' && (
            <div className="space-y-4">
              
              {/* Info banner */}
              <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-xs text-stone-700 leading-relaxed space-y-2">
                <div className="font-bold text-emerald-950 font-jua text-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>학생들이 퀴즈를 풀면 선생님 구글 시트에 바로 기록됩니다!</span>
                </div>
                <p>
                  아래 <strong>30초 가이드</strong>대로 구글 시트에 스크립트를 붙여넣고 배포 URL을 입력해 두시면, 
                  학생들이 마지막 화면에서 <strong>[선생님께 제출하기]</strong>를 누르는 즉시 시트에 학생별 이름, 성격 추론, 퀴즈 정답, 체형 분석 결과가 자동으로 한 행씩 쌓입니다.
                </p>
              </div>

              {/* Webhook Input Field */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 font-jua flex items-center justify-between">
                  <span>선생님의 구글 앱스 스크립트 웹 앱 URL</span>
                  <span className="text-[11px] text-stone-500 font-normal">https://script.google.com/macros/s/.../exec</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/AKfycby.../exec"
                    className="flex-1 px-3 py-2 text-xs border-2 border-stone-300 rounded-xl focus:border-emerald-600 focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testStatus?.loading}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-jua font-bold shrink-0 flex items-center gap-1 shadow-sm transition-transform active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{testStatus?.loading ? '전송 중...' : '연동 테스트'}</span>
                  </button>
                </div>
              </div>

              {/* Test Status feedback */}
              {testStatus && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 ${
                  testStatus.success 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                  {testStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />}
                  <span>{testStatus.message}</span>
                </div>
              )}

              {/* Step-by-Step Instructions */}
              <div className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-jua text-sm text-stone-900 flex items-center gap-1.5">
                    <span>⚡ 1분 만에 구글 시트 연동 URL 만드는 법</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 px-3 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-jua font-bold transition-colors shadow-xs"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? '복사 완료!' : '스크립트 코드 복사'}
                  </button>
                </div>

                <ol className="text-xs text-stone-600 space-y-2 list-decimal pl-4 leading-relaxed">
                  <li>
                    <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold inline-flex items-center gap-0.5">
                      구글 스프레드시트 <ExternalLink className="w-3 h-3" />
                    </a>
                    를 새로 하나 만듭니다 (예: <code>패션수업_학생응답</code>).
                  </li>
                  <li>
                    시트 상단 메뉴 <strong>[확장 프로그램] → [Apps Script]</strong>를 클릭합니다.
                  </li>
                  <li>
                    기존 내용을 지우고, 우측 상단 <strong>[스크립트 코드 복사]</strong> 버튼을 눌러 복사한 코드를 그대로 붙여넣습니다 (Ctrl+V).
                  </li>
                  <li>
                    상단 <strong>[저장]</strong> 아이콘(디스켓) 클릭 후, 우측 상단 <strong>[배포] → [새 배포]</strong>를 클릭합니다.
                  </li>
                  <li>
                    톱니바퀴에서 <strong>[웹 앱]</strong>을 선택하고:
                    <ul className="list-disc pl-4 mt-1 text-stone-500 space-y-0.5">
                      <li>설명: <code>학생 응답 수집</code></li>
                      <li>다음 사용자로 실행: <code>나(내 계정)</code></li>
                      <li>액세스 권한: <strong className="text-emerald-700 underline">모든 사용자(Anyone)</strong> (학생들이 로그인 없이 제출 가능)</li>
                    </ul>
                  </li>
                  <li>
                    <strong>[배포]</strong> 완료 시 생성되는 <code>https://script.google.com/macros/s/.../exec</code> 주소를 복사해 위의 입력창에 붙여넣고 [적용하기]를 누르면 끝입니다!
                  </li>
                </ol>
              </div>

            </div>
          )}

          {activeTab === 'brand' && (
            <div className="space-y-4">
              <div className="bg-pink-50 p-3 rounded-xl border border-pink-200 text-xs text-stone-700 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-pink-600 shrink-0 mt-0.5" />
                <span>
                  하단 문구에 <strong>made by 써비쌤</strong>이 기본 적용되어 있습니다. 
                  수업에 맞게 문구나 타이틀을 자유롭게 수정하실 수 있습니다.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  앱 메인 제목
                </label>
                <input
                  type="text"
                  value={appTitle}
                  onChange={(e) => setAppTitle(e.target.value)}
                  placeholder="예: 패션, 쉽지?"
                  className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-stone-300 rounded-xl focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  앱 서브 타이틀
                </label>
                <input
                  type="text"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  placeholder="예: 패션 테러리스트를 구해라"
                  className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-stone-300 rounded-xl focus:border-pink-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  하단 브랜드 문구 (교사 서명)
                </label>
                <input
                  type="text"
                  value={teacherBrand}
                  onChange={(e) => setTeacherBrand(e.target.value)}
                  placeholder="made by 써비쌤"
                  className="w-full px-3 py-2 text-xs sm:text-sm border-2 border-stone-300 rounded-xl focus:border-pink-500 focus:outline-none font-bold text-pink-600"
                />
                <p className="text-[11px] text-stone-500 mt-1">
                  모든 슬라이드 및 결과 리포트 하단에 표시됩니다. (현재: <strong>{teacherBrand}</strong>)
                </p>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-3 flex items-center justify-between border-t border-stone-200 mt-4">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" /> 기본값 복원
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-bold text-stone-600 hover:bg-stone-100 rounded-xl transition-colors"
              >
                닫기
              </button>
              <button
                type="submit"
                className="flex items-center gap-1 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-jua font-bold shadow-md transition-transform active:scale-95"
              >
                <Check className="w-4 h-4" /> 설정 저장하기
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
