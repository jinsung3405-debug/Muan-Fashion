import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  Users, 
  ExternalLink,
  Sparkles,
  Copy,
  Check
} from 'lucide-react';
import { StudentSubmissionRecord } from '../types';

interface ClassDataViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  submissions: StudentSubmissionRecord[];
  onClearSubmissions: () => void;
  googleSheetUrl?: string;
}

export const ClassDataViewerModal: React.FC<ClassDataViewerModalProps> = ({
  isOpen,
  onClose,
  submissions,
  onClearSubmissions,
  googleSheetUrl,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('ALL');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Extract distinct classes
  const classes = Array.from(
    new Set(submissions.map((s) => s.classNum || '미지정'))
  ).sort();

  const filteredSubmissions = selectedClass === 'ALL'
    ? submissions
    : submissions.filter((s) => (s.classNum || '미지정') === selectedClass);

  // Export to CSV
  const handleExportCsv = () => {
    if (submissions.length === 0) {
      alert('저장된 응답 데이터가 없습니다.');
      return;
    }

    const headers = [
      '제출일시', '학년', '반', '번호', '이름',
      '미션1_1번', '미션1_2번', '미션1_3번', '미션1_4번',
      '전통의상점수', '인도', '멕시코', '베트남', '일본',
      '체형진단', '어깨vs골반', '살붙는부위', '상하비율'
    ];

    const rows = filteredSubmissions.map((s) => [
      `"${s.timestamp}"`,
      `"${s.gradeLevel}"`,
      `"${s.classNum}"`,
      `"${s.studentNumber}"`,
      `"${s.studentName}"`,
      `"${s.m1_1.replace(/"/g, '""')}"`,
      `"${s.m1_2.replace(/"/g, '""')}"`,
      `"${s.m1_3.replace(/"/g, '""')}"`,
      `"${s.m1_4.replace(/"/g, '""')}"`,
      s.m2Score,
      `"${s.m2_1}"`,
      `"${s.m2_2}"`,
      `"${s.m2_3}"`,
      `"${s.m2_4}"`,
      `"${s.bodyDiagnosis}"`,
      `"${s.body1}"`,
      `"${s.body2}"`,
      `"${s.body3}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `패션퀴즈_응답데이터_${selectedClass === 'ALL' ? '전체' : selectedClass}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyTable = () => {
    if (filteredSubmissions.length === 0) return;
    const text = filteredSubmissions.map((s) => 
      `${s.gradeLevel} ${s.classNum} ${s.studentNumber} ${s.studentName} | 퀴즈:${s.m2Score}점 | 체형:${s.bodyDiagnosis}`
    ).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border-2 border-stone-800 overflow-hidden font-gowun text-stone-900 max-h-[90vh] flex flex-col animate-scaleUp">
        
        {/* Header */}
        <div className="bg-emerald-100 border-b-2 border-stone-800 p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 border border-stone-900 flex items-center justify-center text-white shadow-xs">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-jua text-lg text-stone-900">각 반별 제출 데이터 모아보기</h3>
              <p className="text-xs text-stone-600">반별 누적 현황 확인 및 엑셀 다운로드</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-emerald-200 border border-stone-400 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4 text-stone-700" />
          </button>
        </div>

        {/* Top Controls & Class Filter */}
        <div className="bg-stone-50 border-b border-stone-200 p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3">
          {/* Class Filter Badges */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs font-bold text-stone-600 font-jua flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> 반 선택:
            </span>
            <button
              onClick={() => setSelectedClass('ALL')}
              className={`px-3 py-1 rounded-xl text-xs font-bold font-jua border transition-all ${
                selectedClass === 'ALL'
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
              }`}
            >
              전체 ({submissions.length})
            </button>
            {classes.map((cls) => {
              const count = submissions.filter((s) => (s.classNum || '미지정') === cls).length;
              return (
                <button
                  key={cls}
                  onClick={() => setSelectedClass(cls)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold font-jua border transition-all shrink-0 ${
                    selectedClass === cls
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                      : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  {cls} ({count})
                </button>
              );
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTable}
              className="px-3 py-1.5 bg-white border border-stone-300 hover:bg-stone-100 rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '복사됨' : '명단 복사'}</span>
            </button>
            <button
              onClick={handleExportCsv}
              className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-jua font-bold flex items-center gap-1 shadow-sm transition-transform active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>CSV (엑셀) 다운로드</span>
            </button>
          </div>
        </div>

        {/* Content Table / Card List */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 space-y-3">
          {filteredSubmissions.length === 0 ? (
            <div className="text-center py-12 text-stone-500 space-y-2">
              <FileSpreadsheet className="w-12 h-12 text-stone-300 mx-auto" />
              <div className="font-jua text-base text-stone-600">아직 제출된 응답이 없습니다.</div>
              <p className="text-xs text-stone-400 max-w-sm mx-auto">
                학생들이 퀴즈 마지막 14번 화면에서 [써비쌤께 제출하기]를 누르면 여기에 실시간으로 쌓이고 구글 시트로도 자동 전송됩니다.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredSubmissions.map((s, idx) => (
                <div
                  key={s.id || idx}
                  className="bg-white border-2 border-stone-200 hover:border-emerald-500 rounded-2xl p-3 sm:p-4 transition-all shadow-xs space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-jua text-sm bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-lg">
                        {s.gradeLevel} {s.classNum}
                      </span>
                      {s.studentNumber && (
                        <span className="text-xs font-bold text-stone-500">
                          {s.studentNumber}
                        </span>
                      )}
                      <span className="font-bold text-base text-stone-900">
                        {s.studentName}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="bg-pink-100 text-pink-700 font-bold px-2 py-0.5 rounded-md text-[11px]">
                        전통의상 {s.m2Score} / 4점
                      </span>
                      <span>{s.timestamp}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700 pt-1">
                    <div className="bg-stone-50 p-2 rounded-xl">
                      <div className="font-bold text-stone-800 mb-1">👔 미션 1 (성격 & 직업 추론)</div>
                      <div className="text-[11px] text-stone-600 space-y-0.5">
                        <div>1번: {s.m1_1}</div>
                        <div>2번: {s.m1_2}</div>
                        <div>3번: {s.m1_3}</div>
                        <div>4번: {s.m1_4}</div>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-2 rounded-xl">
                      <div className="font-bold text-stone-800 mb-1">✨ 미션 3 체형 진단 & 답변</div>
                      <div className="text-[11px] text-stone-600 space-y-0.5">
                        <div><strong>체형:</strong> <span className="text-emerald-700 font-bold">{s.bodyDiagnosis}</span></div>
                        <div>어깨vs골반: {s.body1} | 살부위: {s.body2}</div>
                        <div>상하체비율: {s.body3}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 flex items-center justify-between">
          <button
            onClick={() => {
              if (confirm('저장된 학생 응답 목록을 비우시겠습니까? (구글 시트에 이미 기록된 내용은 삭제되지 않습니다)')) {
                onClearSubmissions();
              }
            }}
            className="flex items-center gap-1 text-xs text-stone-400 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" /> 브라우저 기록 비우기
          </button>

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
