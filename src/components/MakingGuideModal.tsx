import React, { useState } from 'react';
import { 
  X, 
  Copy, 
  Check, 
  BookOpen, 
  Code2, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Sparkles, 
  ExternalLink,
  ChevronRight,
  Layers,
  HelpCircle,
  Lightbulb
} from 'lucide-react';
import { CODE_GS_TEMPLATE, GAS_INDEX_HTML_SNIPPET, GOOGLE_SHEETS_WEBHOOK_SCRIPT } from '../data/gasTemplates';

interface MakingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MakingGuideModal: React.FC<MakingGuideModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'gas_step' | 'image_tip' | 'sheets' | 'code'>('overview');
  const [copiedCodeGs, setCopiedCodeGs] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);

  if (!isOpen) return null;

  const handleCopyCodeGs = () => {
    navigator.clipboard.writeText(CODE_GS_TEMPLATE);
    setCopiedCodeGs(true);
    setTimeout(() => setCopiedCodeGs(false), 2000);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(GAS_INDEX_HTML_SNIPPET);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-50 text-stone-800 rounded-2xl max-w-4xl w-full max-h-[90vh] shadow-2xl flex flex-col border-2 border-stone-800 overflow-hidden">
        
        {/* Header */}
        <div className="bg-amber-100 border-b-2 border-stone-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 border-2 border-stone-900 flex items-center justify-center text-stone-950 font-bold shadow-sm">
              <Lightbulb className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black font-jua text-stone-900 flex items-center gap-2">
                이런 교육용 웹 앱은 어떻게 만들까요?
              </h2>
              <p className="text-xs sm:text-sm text-stone-600 font-gowun">
                구글 앱스 스크립트(GAS)와 최신 웹 기술로 제작하는 완벽 실전 가이드
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-200 border-2 border-stone-800 flex items-center justify-center transition-colors"
            aria-label="닫기"
          >
            <X className="w-5 h-5 text-stone-700" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-stone-300 bg-stone-100 px-4 overflow-x-auto gap-2 py-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'overview'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. 원리 한눈에 보기
          </button>

          <button
            onClick={() => setActiveTab('gas_step')}
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gas_step'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" /> 2. GAS 제작 단계 (5분 완성)
          </button>

          <button
            onClick={() => setActiveTab('image_tip')}
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'image_tip'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 3. 이미지 호스팅 비법
          </button>

          <button
            onClick={() => setActiveTab('sheets')}
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sheets'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> 4. 학생 응답 시트 연동
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-2 text-sm font-bold rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'code'
                ? 'bg-stone-900 text-white shadow-sm'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Code2 className="w-4 h-4" /> 5. 전체 템플릿 코드
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 text-stone-800 space-y-6">

          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 font-gowun">
              <div className="bg-pink-50 border-2 border-pink-300 rounded-xl p-4 sm:p-5">
                <h3 className="text-lg font-bold font-jua text-pink-900 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-pink-600" /> 보내주신 주소의 앱은 어떤 구조인가요?
                </h3>
                <p className="text-sm leading-relaxed text-stone-700">
                  사용자님이 공유해주신 링크(<code>script.google.com/.../exec</code>)는 <strong>Google Apps Script(구글 앱스 스크립트, 줄여서 GAS)의 HTML Service</strong>를 이용해 만든 <strong>'웹 앱(Web App)'</strong>입니다. 별도의 유료 웹 서버나 도메인 비용 없이, 구글 드라이브와 스프레드시트만으로 누구나 무료 배포할 수 있는 초강력 도구입니다!
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white border-2 border-stone-800 rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">프론트엔드 (화면)</div>
                  <h4 className="font-jua text-base font-bold text-stone-900 mb-2">14개 슬라이드 전환 구조</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    페이지 전체를 새로고침하지 않고, 한 화면 안에 14개의 <code>&lt;div class="slide"&gt;</code>를 겹쳐 둔 뒤 자바스크립트의 <code>goToSlide(num)</code> 함수로 <code>active</code> 클래스를 껐다 켜며 넘기는 <strong>싱글 페이지(SPA)</strong> 방식입니다.
                  </p>
                </div>

                <div className="bg-white border-2 border-stone-800 rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">인터랙션 로직</div>
                  <h4 className="font-jua text-base font-bold text-stone-900 mb-2">선택 제한 및 모달 피드백</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    성격 키워드는 2개까지만 고르도록 배열(Array) 길이를 체크하고, 전통의상 퀴즈를 누르면 팝업 모달(Modal)로 정답/오답을 즉시 피드백한 뒤 결과를 누적(State)합니다.
                  </p>
                </div>

                <div className="bg-white border-2 border-stone-800 rounded-xl p-4 shadow-sm">
                  <div className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-1">백엔드 및 저장소</div>
                  <h4 className="font-jua text-base font-bold text-stone-900 mb-2">구글 드라이브 & 시트</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    문제 사진은 구글 드라이브에 올린 뒤 공유 링크를 이미지 태그로 불러오며, 학생들이 마지막에 제출한 값은 구글 스프레드시트의 엑셀 표로 실시간 기록할 수 있습니다.
                  </p>
                </div>
              </div>

              <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4">
                <h4 className="font-bold font-jua text-emerald-900 mb-1 text-base">💡 현재 창에서 확인하실 수 있는 점</h4>
                <p className="text-sm text-emerald-800 leading-relaxed">
                  지금 보고 계신 이 앱은 바로 그 원본의 디자인, 사운드, 모달, 인터랙션을 100% 동일하게 재현하고 최신 <strong>반응형 모바일 뷰, 스타일링 진단 알고리즘, 인쇄 기능, 교사명 커스텀</strong>까지 업그레이드한 완성형 버전입니다!
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: GAS STEP BY STEP */}
          {activeTab === 'gas_step' && (
            <div className="space-y-5 font-gowun">
              <h3 className="text-lg font-bold font-jua text-stone-900">
                🚀 구글 앱스 스크립트로 5분 만에 배포하는 단계
              </h3>

              <div className="space-y-4">
                <div className="flex gap-3 bg-white border-2 border-stone-800 p-4 rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-pink-400 text-stone-900 border-2 border-stone-900 font-jua flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-jua text-base">구글 스프레드시트 만들기</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      <a href="https://sheets.google.com" target="_blank" rel="noreferrer" className="text-blue-600 underline font-bold">Google Sheets</a>로 이동해 새 스프레드시트를 생성합니다 (예: <code>기술가정_패션퀴즈_응답</code>).
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 bg-white border-2 border-stone-800 p-4 rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-pink-400 text-stone-900 border-2 border-stone-900 font-jua flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-jua text-base">Apps Script 편집기 열기</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      상단 메뉴에서 <strong>[확장 프로그램] → [Apps Script]</strong>를 클릭합니다. 새 편집기 창이 열립니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 bg-white border-2 border-stone-800 p-4 rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-pink-400 text-stone-900 border-2 border-stone-900 font-jua flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-jua text-base">Code.gs & index.html 파일 추가</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      왼쪽 파일 목록에서 <code>Code.gs</code>에 제공된 doGet 코드를 붙여넣고, <strong>[+] 버튼 → [HTML]</strong>을 눌러 파일 이름을 <code>index</code>로 생성한 뒤 HTML 코드를 붙여넣습니다.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 bg-white border-2 border-stone-800 p-4 rounded-xl shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-pink-400 text-stone-900 border-2 border-stone-900 font-jua flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 font-jua text-base">웹 앱으로 배포하기 (가장 중요 ⭐)</h4>
                    <p className="text-xs text-stone-600 mt-1">
                      우측 상단 <strong>[배포] → [새 배포]</strong> 클릭 → 톱니바퀴 아이콘에서 <strong>[웹 앱]</strong> 선택<br/>
                      - <strong>설명</strong>: 패션 퀴즈 1버전<br/>
                      - <strong>다음 사용자로 실행</strong>: <u>나(내 계정)</u><br/>
                      - <strong>액세스 권한이 있는 사용자</strong>: <u>모든 사용자(Anyone)</u> (학생들이 구글 로그인 없이도 접속 가능)<br/>
                      - <strong>[배포]</strong> 버튼 누르면 나오는 <code>https://script.google.com/macros/s/.../exec</code> 링크가 바로 학생들에게 주는 URL입니다!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: IMAGE TIP */}
          {activeTab === 'image_tip' && (
            <div className="space-y-5 font-gowun">
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4">
                <h3 className="text-base font-bold font-jua text-amber-950 mb-1 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-amber-600" /> 구글 드라이브 사진을 웹에 띄우는 핵심 공식!
                </h3>
                <p className="text-xs text-stone-700 leading-relaxed">
                  보통 구글 드라이브에서 '링크 복사'를 하면 <code>drive.google.com/file/d/아이디/view</code> 형태의 뷰어 주소가 나옵니다. 하지만 이 주소를 <code>&lt;img src="..."&gt;</code>에 넣으면 화면에 사진이 나오지 않습니다.
                </p>
              </div>

              <div className="bg-white border-2 border-stone-800 rounded-xl p-4 space-y-3">
                <h4 className="font-bold font-jua text-sm text-stone-900">✨ 직링크 변환 마법 공식:</h4>
                <div className="bg-stone-100 p-3 rounded-lg border border-stone-300 text-xs font-mono space-y-2 break-all">
                  <div className="text-stone-500">
                    ❌ 일반 공유 링크: https://drive.google.com/file/d/<span className="bg-yellow-200 text-stone-900 font-bold px-1 rounded">1iv_dcEiMrshJJiD...</span>/view?usp=sharing
                  </div>
                  <div className="text-emerald-700 font-bold">
                    ⭕ 직접 노출 링크: https://lh3.googleusercontent.com/d/<span className="bg-yellow-200 text-stone-900 font-bold px-1 rounded">1iv_dcEiMrshJJiD...</span>
                  </div>
                </div>
                <ul className="text-xs text-stone-600 space-y-1.5 list-disc pl-4">
                  <li>사진 파일을 구글 드라이브에 업로드하고, 공유 설정을 <strong>"링크가 있는 모든 사용자 - 뷰어"</strong>로 변경합니다.</li>
                  <li>링크 중간에 있는 고유 <strong>파일 ID</strong>만 복사합니다.</li>
                  <li><code>https://lh3.googleusercontent.com/d/파일ID</code> 뒤에 붙여넣으면 어디서든 초고속으로 이미지 로딩이 가능합니다!</li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 4: GOOGLE SHEETS SYNC */}
          {activeTab === 'sheets' && (
            <div className="space-y-4 font-gowun">
              <h3 className="text-lg font-bold font-jua text-stone-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> 각 반마다(1반, 2반...) 자동 탭 분리 누적 원리
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                학생이 제출할 때 선택한 <strong>[반] 정보</strong>를 바탕으로, 구글 앱스 스크립트가 스프레드시트에 해당 반 탭(예: <code>1반</code>, <code>2반</code>)이 있는지 검사하고, 없으면 예쁜 헤더와 함께 <strong>새 시트를 자동으로 생성</strong>하여 저장합니다. 동시에 <strong>[전체통합]</strong> 탭에도 누적되어 전교생 응답을 한눈에 볼 수 있습니다!
              </p>

              <div className="bg-amber-50 border-2 border-amber-300 p-3.5 rounded-xl text-xs text-amber-900 space-y-1">
                <div className="font-bold font-jua text-sm text-amber-950">⚠️ 데이터가 시트에 누적되지 않을 때 체크리스트</div>
                <div>1. Apps Script에서 <code>testSave</code> 함수를 한 번 <strong>[▷ 실행]</strong>하여 권한 승인을 완료했는가?</div>
                <div>2. 코드 수정 후 <strong>[배포 관리] → [수정] → [새 버전]</strong>으로 업데이트 배포했는가?</div>
              </div>

              <div className="border-2 border-stone-800 rounded-xl overflow-hidden bg-white">
                <div className="bg-stone-800 text-stone-200 px-4 py-2 text-xs font-mono flex items-center justify-between font-bold">
                  <span>📄 각 반별 자동 분리 스크립트 (Code.gs)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(GOOGLE_SHEETS_WEBHOOK_SCRIPT);
                      alert('반별 자동 분리 스크립트가 복사되었습니다!');
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded text-xs font-jua transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" /> 스크립트 전체 복사
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono bg-stone-950 text-stone-300 overflow-x-auto max-h-56 leading-relaxed">
                  {GOOGLE_SHEETS_WEBHOOK_SCRIPT}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 5: READY-TO-USE CODE */}
          {activeTab === 'code' && (
            <div className="space-y-5 font-gowun">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-jua text-stone-900">복사해서 바로 쓰는 GAS 템플릿 코드</h3>
                  <p className="text-xs text-stone-500">버튼을 눌러 구글 앱스 스크립트에 바로 붙여넣으세요.</p>
                </div>
              </div>

              {/* Code.gs */}
              <div className="border-2 border-stone-800 rounded-xl overflow-hidden bg-white">
                <div className="bg-stone-800 text-stone-200 px-4 py-2 text-xs font-mono flex items-center justify-between font-bold">
                  <span>📄 Code.gs (반별 자동 분리 & Webhook 수신)</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(GOOGLE_SHEETS_WEBHOOK_SCRIPT);
                      setCopiedCodeGs(true);
                      setTimeout(() => setCopiedCodeGs(false), 2000);
                    }}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded text-xs transition-colors"
                  >
                    {copiedCodeGs ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedCodeGs ? '복사됨!' : 'Code.gs 복사'}
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono bg-stone-950 text-stone-300 overflow-x-auto max-h-56 leading-relaxed">
                  {GOOGLE_SHEETS_WEBHOOK_SCRIPT}
                </pre>
              </div>

              {/* index.html */}
              <div className="border-2 border-stone-800 rounded-xl overflow-hidden bg-white">
                <div className="bg-stone-800 text-stone-200 px-4 py-2 text-xs font-mono flex items-center justify-between font-bold">
                  <span>🌐 index.html (앱 디자인 & 로직)</span>
                  <button
                    onClick={handleCopyHtml}
                    className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded text-xs transition-colors"
                  >
                    {copiedHtml ? <Check className="w-3.5 h-3.5 text-stone-900" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedHtml ? '복사됨!' : 'index.html 요약 복사'}
                  </button>
                </div>
                <pre className="p-3 text-[11px] font-mono bg-stone-950 text-stone-300 overflow-x-auto max-h-56 leading-relaxed">
                  {GAS_INDEX_HTML_SNIPPET}
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-stone-100 border-t-2 border-stone-800 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-stone-600 font-gowun">
            🌟 교과 수업 및 인터랙티브 퀴즈 도구로 자유롭게 활용하고 변형하실 수 있습니다.
          </div>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-jua text-sm transition-transform active:scale-95"
          >
            확인하고 앱 체험하기
          </button>
        </div>

      </div>
    </div>
  );
};
