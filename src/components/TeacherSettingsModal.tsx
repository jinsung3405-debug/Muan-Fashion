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
  AlertCircle,
  Layers,
  ArrowRight
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
  const [webhookUrl, setWebhookUrl] = useState(
    config.googleSheetWebhookUrl || DEFAULT_CONFIG.googleSheetWebhookUrl || ''
  );
  
  const [copiedCode, setCopiedCode] = useState(false);
  const [testClass, setTestClass] = useState('1반');
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
    setWebhookUrl(DEFAULT_CONFIG.googleSheetWebhookUrl || '');
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(GOOGLE_SHEETS_WEBHOOK_SCRIPT);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Test send to the Google Sheet Webhook URL with class separation
  const handleTestWebhook = async () => {
    if (!webhookUrl.trim()) {
      alert('먼저 구글 앱스 스크립트 웹 앱 URL을 입력해 주세요!');
      return;
    }

    setTestStatus({ loading: true });

    try {
      const testData = {
        gradeLevel: '1학년',
        classNum: testClass,
        studentNumber: '1번',
        studentName: '테스트 학생',
        fullClassLabel: `1학년 ${testClass}`,
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

      // Dual Send (POST + GET query fallback)
      const postPromise = fetch(webhookUrl.trim(), {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: JSON.stringify(testData),
      });

      const getUrl = `${webhookUrl.trim()}${webhookUrl.includes('?') ? '&' : '?'}action=submit&data=${encodeURIComponent(JSON.stringify(testData))}`;
      const getPromise = fetch(getUrl, {
        method: 'GET',
        mode: 'no-cors',
      });

      await Promise.race([postPromise, getPromise]);

      setTestStatus({
        loading: false,
        success: true,
        message: `테스트 데이터가 [${testClass}]으로 전송되었습니다!\n\n구글 스프레드시트를 열어 [${testClass}] 탭과 [전체통합] 탭이 생겼는지 확인해 보세요!`,
      });
    } catch (err: any) {
      setTestStatus({
        loading: false,
        success: false,
        message: '전송 중 네트워크 오류: ' + (err.message || String(err)),
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border-2 border-stone-800 overflow-hidden font-gowun text-stone-900 max-h-[90vh] flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="bg-emerald-100 border-b-2 border-stone-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 border border-stone-900 flex items-center justify-center text-white shadow-xs">
              <FileSpreadsheet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-jua text-lg text-stone-900">각 반별 구글 시트 연동 & 설정</h3>
              <p className="text-xs text-stone-600">반별(1반, 2반...) 자동 탭 분리 누적 및 해결 가이드</p>
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
            <FileSpreadsheet className="w-3.5 h-3.5" /> 1. 반별 시트 연동 (해결 가이드)
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
              
              {/* Critical Root Cause Explanation */}
              <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-xs text-stone-800 leading-relaxed space-y-2">
                <div className="font-bold text-amber-950 font-jua text-sm flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>데이터가 시트에 누적되지 않았던 이유 & 해결법 (필독!)</span>
                </div>
                <div className="text-[12px] space-y-1 text-stone-700">
                  <p>
                    <strong>① 권한 미승인:</strong> 스프레드시트에 쓰기 권한을 주려면 Apps Script 편집기 상단에서 <code>testSave</code> 함수를 한 번 <strong>[▷ 실행]</strong>하고 <strong>[권한 검토] → [허용]</strong>을 눌러야 합니다.
                  </p>
                  <p>
                    <strong>② '새 버전' 미배포:</strong> Apps Script는 코드를 수정한 후 반드시 <strong>[배포 관리] → [수정(연필)] → [새 버전]</strong>을 선택하여 재배포해야 새 코드가 웹 앱에 반영됩니다.
                  </p>
                </div>
              </div>

              {/* Webhook URL Input Field */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1 font-jua flex items-center justify-between">
                  <span>선생님의 구글 앱스 스크립트 웹 앱 URL</span>
                  <span className="text-[11px] text-emerald-700 font-bold">● 현재 써비쌤 링크 적용됨</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://script.google.com/macros/s/.../exec"
                    className="flex-1 px-3 py-2 text-xs border-2 border-stone-300 rounded-xl focus:border-emerald-600 focus:outline-none font-mono"
                  />
                  <select
                    value={testClass}
                    onChange={(e) => setTestClass(e.target.value)}
                    className="px-2 py-2 text-xs border-2 border-stone-300 rounded-xl font-bold bg-stone-50"
                  >
                    {['1반', '2반', '3반', '4반', '5반'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleTestWebhook}
                    disabled={testStatus?.loading}
                    className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-300 text-white rounded-xl text-xs font-jua font-bold shrink-0 flex items-center gap-1 shadow-sm transition-transform active:scale-95 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{testStatus?.loading ? '전송 중...' : '테스트 전송'}</span>
                  </button>
                </div>
              </div>

              {/* Test Status Feedback */}
              {testStatus && (
                <div className={`p-3 rounded-xl border text-xs flex items-start gap-2 whitespace-pre-line ${
                  testStatus.success 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
                    : 'bg-red-50 border-red-300 text-red-900'
                }`}>
                  {testStatus.success ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 text-red-600 mt-0.5" />}
                  <span>{testStatus.message}</span>
                </div>
              )}

              {/* 30-Second Fix Checklist */}
              <div className="bg-stone-50 border-2 border-stone-300 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-jua text-sm text-stone-900 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-emerald-600" />
                    <span>반별 자동 분리 스크립트 적용 순서 (3단계)</span>
                  </h4>
                  <button
                    type="button"
                    onClick={handleCopyScript}
                    className="flex items-center gap-1 px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-lg text-xs font-jua font-bold transition-colors shadow-xs cursor-pointer"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCode ? '복사 완료!' : '새 스크립트 코드 복사'}
                  </button>
                </div>

                <ol className="text-xs text-stone-700 space-y-2 list-decimal pl-4 leading-relaxed">
                  <li>
                    구글 시트의 <strong>[확장 프로그램] → [Apps Script]</strong>를 열고, 우측 상단의 <strong>[새 스크립트 코드 복사]</strong> 버튼을 눌러 복사한 코드를 <strong>전부 덮어씌웁니다</strong>.
                  </li>
                  <li>
                    상단 함수 선택창에서 <span className="bg-amber-100 text-amber-900 px-1 py-0.5 rounded font-bold font-mono">testSave</span>를 선택하고 <strong>[▷ 실행]</strong> 버튼을 누릅니다.<br />
                    → <span className="text-emerald-700 font-bold">'권한 검토' → '고급' → '안전하지 않음으로 이동' → '허용'</span>을 클릭하여 구글 시트 접근을 승인합니다. (시트에 [1반], [전체통합] 탭이 즉시 생성됩니다!)
                  </li>
                  <li>
                    우측 상단 <strong>[배포] → [배포 관리]</strong>를 누른 뒤, 연필 아이콘(수정)을 누르고 <strong>버전: [새 버전]</strong>을 선택한 후 <strong>[배포]</strong>를 클릭하면 끝입니다!
                  </li>
                </ol>

                <div className="bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl text-[11px] text-emerald-900">
                  🎉 이제 학생들이 1반, 2반, 3반... 중 자기 반을 선택하여 제출하면, <strong>해당 반 탭에만 차곡차곡 누적</strong>되고 <strong>[전체통합] 탭에도 한 번 더 자동 기록</strong>됩니다!
                </div>
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
                className="flex items-center gap-1 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-jua font-bold shadow-md transition-transform active:scale-95 cursor-pointer"
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
