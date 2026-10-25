import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ChevronRight, 
  RotateCcw, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Sparkles, 
  Share2, 
  Printer, 
  Check, 
  ArrowRight,
  Send,
  FileSpreadsheet,
  QrCode,
  Globe2,
  Lock,
  UserCheck,
  Users
} from 'lucide-react';
import { AppConfig, StudentAnswers, StudentSubmissionRecord } from '../types';
import { 
  PERSONALITY_TRAITS, 
  MISSION1_ITEMS, 
  JOB_SUGGESTIONS, 
  MISSION2_QUIZZES, 
  BODY_PROPORTION_IMAGE,
  diagnoseBodyType 
} from '../data/fashionData';

interface FashionAppProps {
  config: AppConfig;
  onOpenGuide: () => void;
  onOpenSettings: () => void;
  onOpenShare: () => void;
  onOpenClassData?: () => void;
  onSaveSubmission?: (record: StudentSubmissionRecord) => void;
}

export const FashionApp: React.FC<FashionAppProps> = ({
  config,
  onOpenGuide,
  onOpenSettings,
  onOpenShare,
  onOpenClassData,
  onSaveSubmission,
}) => {
  // Current Slide (1 to 14)
  const [currentSlide, setCurrentSlide] = useState<number>(1);

  // Student Identity: Grade, Class, Number, Name
  const [gradeLevel, setGradeLevel] = useState<string>('1학년');
  const [classNum, setClassNum] = useState<string>('1반');
  const [customClass, setCustomClass] = useState<string>('');
  const [studentNumber, setStudentNumber] = useState<string>('');
  const [studentName, setStudentName] = useState<string>('');

  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submissionFeedback, setSubmissionFeedback] = useState<{
    show: boolean;
    title: string;
    message: string;
    isSuccess: boolean;
  }>({
    show: false,
    title: '',
    message: '',
    isSuccess: true,
  });

  // Student Answers State
  const [answers, setAnswers] = useState<StudentAnswers>({
    mission1: {
      1: { traits: [], job: '' },
      2: { traits: [], job: '' },
      3: { traits: [], job: '' },
      4: { traits: [], job: '' },
    },
    mission2: {},
    body: {
      body1: '',
      body2: '',
      body3: '',
    },
  });

  // Quiz Modal State for Mission 2
  const [quizModal, setQuizModal] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    selected: string;
    correctAnswer: string;
    costumeName: string;
    explanation: string;
    climateTrivia: string;
    nextSlide: number;
  }>({
    isOpen: false,
    isCorrect: false,
    selected: '',
    correctAnswer: '',
    costumeName: '',
    explanation: '',
    climateTrivia: '',
    nextSlide: 1,
  });

  const [copiedSummary, setCopiedSummary] = useState(false);

  // Helper: Go to Slide with Scroll Reset
  const goToSlide = (num: number) => {
    setCurrentSlide(num);
    const container = document.getElementById('slide-scroll-area');
    if (container) {
      container.scrollTop = 0;
    }
  };

  // Trait Selection (max 2)
  const toggleTrait = (itemId: number, trait: string) => {
    const currentTraits = answers.mission1[itemId]?.traits || [];
    let updatedTraits: string[];

    if (currentTraits.includes(trait)) {
      updatedTraits = currentTraits.filter((t) => t !== trait);
    } else {
      if (currentTraits.length >= 2) {
        alert('성격 특성은 2개까지만 고를 수 있습니다!');
        return;
      }
      updatedTraits = [...currentTraits, trait];
    }

    setAnswers((prev) => ({
      ...prev,
      mission1: {
        ...prev.mission1,
        [itemId]: {
          ...prev.mission1[itemId],
          traits: updatedTraits,
        },
      },
    }));
  };

  // Job text input update
  const setJob = (itemId: number, job: string) => {
    setAnswers((prev) => ({
      ...prev,
      mission1: {
        ...prev.mission1,
        [itemId]: {
          ...prev.mission1[itemId],
          job,
        },
      },
    }));
  };

  // Validate Mission 1 Step before proceeding
  const handleNextMission1 = (itemId: number) => {
    const itemTraits = answers.mission1[itemId]?.traits || [];
    if (itemTraits.length < 2) {
      alert('성격적 특성을 2개 선택해 주세요!');
      return;
    }
    goToSlide(currentSlide + 1);
  };

  // Quiz Selection in Mission 2
  const handleCheckQuiz = (quizItem: typeof MISSION2_QUIZZES[0], selectedCountry: string) => {
    const isCorrect = selectedCountry === quizItem.country;

    if (isCorrect) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#f8b3c3', '#ff85a2', '#a7f3d0', '#fde047'],
      });
    }

    setAnswers((prev) => ({
      ...prev,
      mission2: {
        ...prev.mission2,
        [quizItem.id]: {
          selected: selectedCountry,
          isCorrect,
        },
      },
    }));

    setQuizModal({
      isOpen: true,
      isCorrect,
      selected: selectedCountry,
      correctAnswer: quizItem.country,
      costumeName: quizItem.costumeName,
      explanation: quizItem.explanation,
      climateTrivia: quizItem.climateTrivia,
      nextSlide: currentSlide + 1,
    });
  };

  const handleCloseQuizModal = () => {
    setQuizModal((prev) => ({ ...prev, isOpen: false }));
    goToSlide(quizModal.nextSlide);
  };

  // Body survey selection
  const handleSelectBodyOption = (key: 'body1' | 'body2' | 'body3', value: string) => {
    setAnswers((prev) => ({
      ...prev,
      body: {
        ...prev.body,
        [key]: value,
      },
    }));
  };

  const handleNextSlide12 = () => {
    if (!answers.body.body1 || !answers.body.body2) {
      alert('두 질문 모두 항목을 선택해 주세요!');
      return;
    }
    goToSlide(13);
  };

  const handleNextSlide13 = () => {
    if (!answers.body.body3) {
      alert('비율 항목을 선택해 주세요!');
      return;
    }
    goToSlide(14);
  };

  // Reset entire app
  const handleRestart = () => {
    setAnswers({
      mission1: {
        1: { traits: [], job: '' },
        2: { traits: [], job: '' },
        3: { traits: [], job: '' },
        4: { traits: [], job: '' },
      },
      mission2: {},
      body: {
        body1: '',
        body2: '',
        body3: '',
      },
    });
    setIsSubmitted(false);
    goToSlide(1);
  };

  // Body Diagnosis Result for Slide 14
  const bodyDiagnosis = diagnoseBodyType(answers.body);
  const m2Score = Object.values(answers.mission2).filter((r) => r.isCorrect).length;

  const effectiveClass = classNum === 'CUSTOM' ? (customClass.trim() || '미지정반') : classNum;
  const fullClassLabel = `${gradeLevel} ${effectiveClass}`;

  // Submit results to Google Sheets with multi-class separation
  const handleSubmitToGoogleSheet = async () => {
    if (!studentName.trim()) {
      alert('이름을 입력해 주세요!');
      return;
    }

    setIsSubmitting(true);

    const nowFormatted = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });

    const submissionData = {
      gradeLevel,
      classNum: effectiveClass,
      studentNumber: studentNumber.trim() ? (studentNumber.includes('번') ? studentNumber.trim() : `${studentNumber.trim()}번`) : '',
      studentName: studentName.trim(),
      fullClassLabel,
      m1_1: `성격: ${answers.mission1[1]?.traits.join(', ') || '-'} / 직업: ${answers.mission1[1]?.job || '-'}`,
      m1_2: `성격: ${answers.mission1[2]?.traits.join(', ') || '-'} / 직업: ${answers.mission1[2]?.job || '-'}`,
      m1_3: `성격: ${answers.mission1[3]?.traits.join(', ') || '-'} / 직업: ${answers.mission1[3]?.job || '-'}`,
      m1_4: `성격: ${answers.mission1[4]?.traits.join(', ') || '-'} / 직업: ${answers.mission1[4]?.job || '-'}`,
      m2_score: m2Score,
      m2_1: answers.mission2[1]?.isCorrect ? '정답(인도)' : `오답(선택: ${answers.mission2[1]?.selected || '-'})`,
      m2_2: answers.mission2[2]?.isCorrect ? '정답(멕시코)' : `오답(선택: ${answers.mission2[2]?.selected || '-'})`,
      m2_3: answers.mission2[3]?.isCorrect ? '정답(베트남)' : `오답(선택: ${answers.mission2[3]?.selected || '-'})`,
      m2_4: answers.mission2[4]?.isCorrect ? '정답(일본)' : `오답(선택: ${answers.mission2[4]?.selected || '-'})`,
      bodyDiagnosis: bodyDiagnosis.bodyTypeTitle,
      body1: answers.body.body1 || '-',
      body2: answers.body.body2 || '-',
      body3: answers.body.body3 || '-',
    };

    const webhookUrl = config.googleSheetWebhookUrl?.trim();

    // 1. Save locally for teacher class backup
    const localRecord: StudentSubmissionRecord = {
      id: `${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: nowFormatted,
      gradeLevel: submissionData.gradeLevel,
      classNum: submissionData.classNum,
      studentNumber: submissionData.studentNumber,
      studentName: submissionData.studentName,
      fullClassLabel: submissionData.fullClassLabel,
      m1_1: submissionData.m1_1,
      m1_2: submissionData.m1_2,
      m1_3: submissionData.m1_3,
      m1_4: submissionData.m1_4,
      m2Score: submissionData.m2_score,
      m2_1: submissionData.m2_1,
      m2_2: submissionData.m2_2,
      m2_3: submissionData.m2_3,
      m2_4: submissionData.m2_4,
      bodyDiagnosis: submissionData.bodyDiagnosis,
      body1: submissionData.body1,
      body2: submissionData.body2,
      body3: submissionData.body3,
      sentToGoogleSheet: !!webhookUrl,
    };

    if (onSaveSubmission) {
      onSaveSubmission(localRecord);
    }

    // 2. Dual transmission to Google Apps Script (POST + GET Fallback)
    if (webhookUrl) {
      try {
        // Method A: POST via text/plain (no preflight, no-cors)
        const postPromise = fetch(webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'text/plain',
          },
          body: JSON.stringify(submissionData),
        });

        // Method B: GET with URL encoded data parameter (bulletproof fallback)
        const getUrl = `${webhookUrl}${webhookUrl.includes('?') ? '&' : '?'}action=submit&data=${encodeURIComponent(JSON.stringify(submissionData))}`;
        const getPromise = fetch(getUrl, {
          method: 'GET',
          mode: 'no-cors',
        });

        await Promise.race([postPromise, getPromise]);

        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.5 },
          colors: ['#f8b3c3', '#34d399', '#60a5fa', '#fbbf24'],
        });

        setIsSubmitted(true);
        setSubmissionFeedback({
          show: true,
          title: '🎉 제출 성공!',
          message: `[${fullClassLabel} ${studentNumber} ${studentName}] 학생의 응답이 제출되었습니다!\n\n써비쌤의 구글 스프레드시트 [${effectiveClass}] 탭과 [전체통합] 탭에 실시간으로 자동 누적되었습니다.`,
          isSuccess: true,
        });
      } catch (err: any) {
        // Even if network blips, local backup recorded
        setIsSubmitted(true);
        setSubmissionFeedback({
          show: true,
          title: '제출 완료 (안내)',
          message: `[${fullClassLabel} ${studentName}] 학생의 응답이 브라우저에 안전하게 저장되었습니다.\n\n구글 시트에 반영되지 않았다면 [선생님 설정] > [Apps Script 코드 복사]로 '새 버전' 배포가 완료되었는지 확인해 주세요!`,
          isSuccess: true,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
      setSubmissionFeedback({
        show: true,
        title: '구글 시트 연동 안내',
        message: '구글 시트 주소가 설정되지 않아 로컬 목록에만 보관되었습니다. 상단 [시트 설정]에서 써비쌤의 Apps Script 웹앱 링크를 등록해 주세요.',
        isSuccess: false,
      });
    }
  };

  // Copy Summary to Clipboard
  const handleCopySummary = () => {
    const text = `[${config.appTitle} 결과 보고서]
학생: ${fullClassLabel} ${studentNumber} ${studentName || '익명'}
선생님: ${config.teacherBrand}

[미션 1] 옷만 보고 맞히기
- 1번: ${answers.mission1[1]?.traits.join(', ') || '미선택'} / 직업: ${answers.mission1[1]?.job || '미입력'}
- 2번: ${answers.mission1[2]?.traits.join(', ') || '미선택'} / 직업: ${answers.mission1[2]?.job || '미입력'}
- 3번: ${answers.mission1[3]?.traits.join(', ') || '미선택'} / 직업: ${answers.mission1[3]?.job || '미입력'}
- 4번: ${answers.mission1[4]?.traits.join(', ') || '미선택'} / 직업: ${answers.mission1[4]?.job || '미입력'}

[미션 2] 전통의상 맞히기 (점수: ${m2Score}/4)
- 1번(인도): ${answers.mission2[1]?.isCorrect ? '정답' : '오답'}
- 2번(멕시코): ${answers.mission2[2]?.isCorrect ? '정답' : '오답'}
- 3번(베트남): ${answers.mission2[3]?.isCorrect ? '정답' : '오답'}
- 4번(일본): ${answers.mission2[4]?.isCorrect ? '정답' : '오답'}

[미션 3] 나의 체형 진단 & 코디 팁
- 체형 유형: ${bodyDiagnosis.bodyTypeTitle}
- 어깨 vs 골반: ${answers.body.body1 || '-'}
- 살 붙는 부위: ${answers.body.body2 || '-'}
- 상하체 비율: ${answers.body.body3 || '-'}
- 추천 스타일링: ${bodyDiagnosis.stylingTips[0]}`;

    navigator.clipboard.writeText(text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[92vh] w-full p-2 sm:p-4 select-none">
      
      {/* Top Controls Bar */}
      <div className="w-full max-w-[480px] mb-2 px-2 flex items-center justify-between text-xs text-stone-300 font-gowun">
        <div className="flex items-center gap-1.5 bg-stone-800/80 px-2.5 py-1 rounded-full border border-stone-700">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></span>
          <span>슬라이드 {currentSlide} / 14</span>
        </div>

        <div className="flex items-center gap-1.5">
          {onOpenClassData && (
            <button
              onClick={onOpenClassData}
              className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-2.5 py-1 rounded-full border border-indigo-400 shadow-sm transition-all text-[11px]"
              title="각 반별 제출 데이터 모아보기"
            >
              <Users className="w-3.5 h-3.5" /> 반별 데이터
            </button>
          )}
          <button
            onClick={onOpenShare}
            className="flex items-center gap-1 bg-pink-500 hover:bg-pink-400 text-white font-bold px-2.5 py-1 rounded-full border border-pink-400 shadow-sm transition-all text-[11px]"
            title="학생들에게 QR 코드 및 링크 공유"
          >
            <QrCode className="w-3.5 h-3.5" /> 공유
          </button>
          <button
            onClick={onOpenSettings}
            className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-full border border-emerald-400 transition-all text-[11px] font-bold"
            title="구글 시트 연동 설정"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" /> 시트 설정
          </button>
        </div>
      </div>

      {/* Main App Container */}
      <div 
        id="app-canvas"
        className="w-full max-w-[480px] h-[820px] sm:h-[840px] bg-[#fdebed] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-[3.5px] border-stone-900 relative overflow-hidden flex flex-col font-gowun text-stone-900"
      >

        {/* Global Progress Line */}
        <div className="w-full bg-pink-200 h-1.5">
          <div 
            className="bg-pink-500 h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${(currentSlide / 14) * 100}%` }}
          />
        </div>

        {/* Scrollable Slide Content Area */}
        <div id="slide-scroll-area" className="flex-1 overflow-y-auto px-5 py-4 flex flex-col justify-between">

          {/* ==================== SLIDE 1: INTRO MISSION 1 ==================== */}
          {currentSlide === 1 && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold text-stone-600 mb-1 tracking-tight">
                  {config.subTitle}
                </div>
                <h1 className="font-jua text-4xl sm:text-5xl text-stone-900 tracking-tight">
                  {config.appTitle}
                </h1>
              </div>

              <div className="my-auto space-y-4">
                <div className="bg-white/70 backdrop-blur-xs border border-pink-300 rounded-2xl p-4 sm:p-5 text-sm sm:text-base leading-relaxed text-stone-800 shadow-sm text-left">
                  <p className="mb-3">
                    사람이 누군가를 처음 만났을 때 그 사람에 대한 느낌을 결정하는 데는 
                    딱 <strong className="text-pink-600 underline underline-offset-4 decoration-2">3초</strong>가 걸려요.
                  </p>
                  <p className="mb-3">
                    우리는 입으로 말을 하기도 전에 <strong>내가 입은 옷</strong>으로 먼저 나를 표현하게 됩니다.
                  </p>
                  <p className="mb-3">
                    깔끔한 셔츠를 입으면 <span className="bg-pink-100 px-1 py-0.5 rounded font-bold">"정돈되고 신뢰감 있는 사람"</span>처럼 보이고, 
                    편안한 트레이닝복을 입으면 <span className="bg-emerald-100 px-1 py-0.5 rounded font-bold">"친근하고 활동적인 사람"</span>처럼 보이죠.
                  </p>
                  <p className="text-stone-900 font-bold bg-amber-50 p-2.5 rounded-xl border border-amber-200">
                    💡 즉, 옷은 말하지 않아도 나를 알려주는 가장 빠른 자기소개서입니다.
                  </p>
                  <p className="text-xs text-stone-500 mt-2">
                    아래 미션을 통해 우리가 옷을 입는 이유를 직접 찾아보세요!
                  </p>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => goToSlide(2)}
                    className="font-jua text-2xl bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-[3px] border-stone-900 rounded-full px-10 py-3 shadow-[0_5px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    START <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="mt-3 inline-block bg-[#f8b3c3] border-2 border-stone-900 rounded-full px-4 py-1.5 font-jua text-sm text-stone-900">
                    미션 1, 옷만 보고 맞히기
                  </div>
                </div>
              </div>

              {/* Footer Brand: made by 써비쌤 */}
              <div className="text-center text-xs font-bold text-stone-700 pt-2 border-t border-pink-200/60 font-gowun">
                • {config.teacherBrand || 'made by 써비쌤'} •
              </div>
            </div>
          )}

          {/* ==================== SLIDES 2 ~ 5: MISSION 1 QUESTIONS 1 ~ 4 ==================== */}
          {currentSlide >= 2 && currentSlide <= 5 && (() => {
            const itemIndex = currentSlide - 2;
            const item = MISSION1_ITEMS[itemIndex];
            const currentItemAnswers = answers.mission1[item.id] || { traits: [], job: '' };
            const selectedCount = currentItemAnswers.traits.length;

            return (
              <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
                {/* Header */}
                <div className="text-center">
                  <div className="text-xs font-bold text-stone-600 mb-0.5">{config.subTitle}</div>
                  <h1 className="font-jua text-3xl text-stone-900 mb-1">{config.appTitle}</h1>
                  <div className="inline-block bg-[#f8b3c3] border-2 border-stone-900 rounded-full px-3.5 py-1 font-jua text-xs sm:text-sm text-stone-900 shadow-xs">
                    미션 1, 옷만 보고 맞히기
                  </div>
                </div>

                {/* Question Body */}
                <div className="my-auto flex flex-col items-center">
                  {/* Photo Container */}
                  <div className="relative w-full max-w-[210px] h-[190px] sm:h-[200px] border-[3px] border-stone-900 rounded-2xl overflow-hidden bg-white shadow-md mb-2.5">
                    <span className="absolute top-2 left-2 z-10 bg-white border-2 border-stone-900 font-jua text-xs px-2 py-0.5 rounded-full shadow-xs">
                      {item.numberLabel}
                    </span>
                    <img
                      src={item.imageUrl}
                      alt={item.alt}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>

                  {/* Personality Traits Question */}
                  <div className="w-full bg-white/80 border-2 border-stone-900 rounded-2xl p-3 mb-2 shadow-xs">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-jua text-sm sm:text-base text-stone-900">
                        이 사람은 어떤 성격일까?
                      </span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                        selectedCount === 2 
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-400' 
                          : 'bg-pink-100 text-pink-700 border-pink-300'
                      }`}>
                        선택: {selectedCount}/2개
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-1.5">
                      {PERSONALITY_TRAITS.map((trait) => {
                        const isSelected = currentItemAnswers.traits.includes(trait);
                        return (
                          <button
                            key={trait}
                            onClick={() => toggleTrait(item.id, trait)}
                            className={`py-1.5 px-1 text-xs rounded-lg font-bold border-2 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#ff85a2] text-white border-stone-900 shadow-[0_2px_0_#000] scale-102'
                                : 'bg-white text-stone-800 border-stone-300 hover:border-stone-500 hover:bg-stone-50'
                            }`}
                          >
                            {trait}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Job Question */}
                  <div className="w-full bg-white/80 border-2 border-stone-900 rounded-2xl p-2.5 shadow-xs">
                    <div className="font-jua text-xs sm:text-sm text-stone-900 mb-1.5 flex items-center justify-between">
                      <span>어떤 직업을 가지고 있을까?</span>
                      <span className="text-[11px] text-stone-500 font-gowun">추측하여 적어보세요</span>
                    </div>
                    <input
                      type="text"
                      value={currentItemAnswers.job}
                      onChange={(e) => setJob(item.id, e.target.value)}
                      placeholder="예: 패션 디자이너, 대학생, 개발자..."
                      className="w-full px-3 py-1.5 text-xs sm:text-sm border-2 border-stone-300 rounded-xl focus:border-stone-900 focus:outline-none bg-stone-50"
                    />

                    {/* Quick suggestion tags */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {JOB_SUGGESTIONS.slice(0, 5).map((jobTag) => (
                        <button
                          key={jobTag}
                          onClick={() => setJob(item.id, jobTag)}
                          className="text-[10px] bg-stone-100 hover:bg-pink-100 text-stone-700 px-1.5 py-0.5 rounded border border-stone-200 transition-colors"
                        >
                          +{jobTag}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation */}
                <div className="pt-2 flex flex-col items-center">
                  <button
                    onClick={() => handleNextMission1(item.id)}
                    className="font-jua text-lg bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-2 border-stone-900 rounded-full px-8 py-2 shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    다음으로 <ArrowRight className="w-4 h-4" />
                  </button>
                  <div className="text-[11px] font-bold text-stone-700 mt-2">
                    • {config.teacherBrand || 'made by 써비쌤'} •
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ==================== SLIDE 6: INTRO MISSION 2 ==================== */}
          {currentSlide === 6 && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold text-stone-600 mb-1">{config.subTitle}</div>
                <h1 className="font-jua text-4xl sm:text-5xl text-stone-900">{config.appTitle}</h1>
              </div>

              <div className="my-auto space-y-4">
                <div className="bg-white/80 border-2 border-pink-300 rounded-2xl p-5 text-sm sm:text-base leading-relaxed text-stone-800 shadow-sm text-left">
                  <div className="flex items-center gap-2 mb-3 text-pink-700 font-bold font-jua text-lg">
                    <Globe2 className="w-6 h-6 text-pink-600" />
                    움직이는 박물관, 전통의상
                  </div>
                  <p className="mb-3">
                    세계 각국의 전통의상은 그 나라의 <strong className="text-emerald-700">기후(날씨)</strong>와 <strong className="text-indigo-700">문화(생활 방식)</strong>가 고스란히 담겨 있는 <strong className="bg-pink-100 px-1 py-0.5 rounded font-bold">'움직이는 박물관'</strong>입니다.
                  </p>
                  <p className="mb-3">
                    선조들은 주어진 자연환경에 적응하기 위해 옷의 형태, 소재, 색상을 끊임없이 연구했어요.
                  </p>
                  <p className="text-stone-800 font-bold bg-amber-50 p-3 rounded-xl border border-amber-200">
                    💡 TPO(시간·장소·상황)를 본격적으로 배우기 전에, 전통 의상을 보고 각 나라의 문화와 날씨를 유추해 보세요!
                  </p>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => goToSlide(7)}
                    className="font-jua text-2xl bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-[3px] border-stone-900 rounded-full px-10 py-3 shadow-[0_5px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    START <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="mt-3 inline-block bg-[#f8b3c3] border-2 border-stone-900 rounded-full px-4 py-1.5 font-jua text-sm text-stone-900">
                    미션 2, 전통의상 맞히기
                  </div>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-stone-700 pt-2 border-t border-pink-200/60">
                • {config.teacherBrand || 'made by 써비쌤'} •
              </div>
            </div>
          )}

          {/* ==================== SLIDES 7 ~ 10: MISSION 2 QUIZZES 1 ~ 4 ==================== */}
          {currentSlide >= 7 && currentSlide <= 10 && (() => {
            const quizIndex = currentSlide - 7;
            const quiz = MISSION2_QUIZZES[quizIndex];

            return (
              <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
                {/* Header */}
                <div className="text-center">
                  <div className="text-xs font-bold text-stone-600 mb-0.5">{config.subTitle}</div>
                  <h1 className="font-jua text-3xl text-stone-900 mb-1">{config.appTitle}</h1>
                  <div className="inline-block bg-[#f8b3c3] border-2 border-stone-900 rounded-full px-3.5 py-1 font-jua text-xs sm:text-sm text-stone-900 shadow-xs">
                    미션 2, 전통의상 맞히기
                  </div>
                </div>

                {/* Content */}
                <div className="my-auto flex flex-col items-center">
                  {/* Photo Container */}
                  <div className="relative w-full max-w-[280px] h-[220px] sm:h-[240px] border-[3px] border-stone-900 rounded-2xl overflow-hidden bg-white shadow-md mb-3">
                    <span className="absolute top-2 left-2 z-10 bg-white border-2 border-stone-900 font-jua text-xs px-2 py-0.5 rounded-full shadow-xs">
                      {quiz.numberLabel}
                    </span>
                    <img
                      src={quiz.imageUrl}
                      alt={quiz.costumeName}
                      className="w-full h-full object-cover"
                      loading="eager"
                    />
                  </div>

                  <div className="font-jua text-base sm:text-lg text-stone-900 mb-2">
                    어떤 나라의 전통의상일까요?
                  </div>

                  {/* 8 Country Grid */}
                  <div className="grid grid-cols-4 gap-2 w-full max-w-[340px]">
                    {quiz.options.map((country) => (
                      <button
                        key={country}
                        onClick={() => handleCheckQuiz(quiz, country)}
                        className="bg-white hover:bg-[#ff85a2] hover:text-white text-stone-900 border-2 border-stone-900 rounded-xl py-2.5 font-jua text-sm sm:text-base shadow-[0_3px_0_#000] active:translate-y-0.5 active:shadow-[0_1px_0_#000] transition-all cursor-pointer"
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs font-bold text-stone-700 pt-2">
                  • {config.teacherBrand || 'made by 써비쌤'} •
                </div>
              </div>
            );
          })()}

          {/* ==================== SLIDE 11: INTRO MISSION 3 ==================== */}
          {currentSlide === 11 && (
            <div className="flex-1 flex flex-col justify-between py-2 animate-fadeIn">
              <div className="text-center">
                <div className="text-xs sm:text-sm font-bold text-stone-600 mb-1">{config.subTitle}</div>
                <h1 className="font-jua text-4xl sm:text-5xl text-stone-900">{config.appTitle}</h1>
              </div>

              <div className="my-auto space-y-4">
                <div className="bg-white/80 border-2 border-pink-300 rounded-2xl p-5 text-sm sm:text-base leading-relaxed text-stone-800 shadow-sm text-left">
                  <div className="text-pink-600 font-bold font-jua text-lg mb-2">
                    "옷을 잘 입는 비밀? 나를 아는 것부터 시작이야!"
                  </div>
                  <p className="mb-2.5">
                    친구들, 옷을 잘 입는 사람들의 진짜 비밀이 뭔지 알아? 무조건 패셔니스타를 똑같이 따라 입거나 비싼 옷을 사는 게 아니야.
                  </p>
                  <p className="mb-2.5 font-bold text-stone-900">
                    바로 <span className="bg-amber-200 px-1.5 py-0.5 rounded">'내 몸(체형)'</span>을 누구보다 정확하게 알고 있다는 것이지!
                  </p>
                  <p className="mb-2.5">
                    사람마다 얼굴 모양이 다르듯 체형도 전부 달라. 어깨가 넓은 친구도 있고, 허리가 쏙 들어간 친구도 있고, 하체가 발달한 친구도 있지.
                  </p>
                  <p className="mb-2.5 text-pink-700 font-bold">
                    중요한 건 너의 체형에 <span className="underline underline-offset-4 decoration-2 decoration-pink-500">'틀린 몸'</span>은 절대 없다는 거야!
                  </p>
                  <p className="text-xs sm:text-sm text-stone-600 bg-stone-50 p-3 rounded-xl border border-stone-200">
                    내 체형의 장점은 시선이 가도록 돋보이게 만들고, 단점은 슬쩍 커버해 주는 옷을 골라 입는 게 진짜 옷을 잘 입는 지혜야. 예를 들어, 세로 선을 활용하면 키가 더 커 보이는 착시 효과를 만들 수 있는 것처럼 말이지.
                  </p>
                </div>

                <div className="text-center pt-2">
                  <button
                    onClick={() => goToSlide(12)}
                    className="font-jua text-2xl bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-[3px] border-stone-900 rounded-full px-10 py-3 shadow-[0_5px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    START <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="mt-3 inline-block bg-[#f8b3c3] border-2 border-stone-900 rounded-full px-4 py-1.5 font-jua text-sm text-stone-900">
                    미션 3, 나의 체형알기
                  </div>
                </div>
              </div>

              <div className="text-center text-xs font-bold text-stone-700 pt-2 border-t border-pink-200/60">
                • {config.teacherBrand || 'made by 써비쌤'} •
              </div>
            </div>
          )}

          {/* ==================== SLIDE 12: MISSION 3 PART 1 (상체 vs 하체) ==================== */}
          {currentSlide === 12 && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
              {/* Header */}
              <div className="text-center">
                <div className="text-xs font-bold text-stone-600 mb-0.5">{config.subTitle}</div>
                <h1 className="font-jua text-3xl text-stone-900 mb-1">{config.appTitle}</h1>
                <div className="inline-block bg-[#f8b3c3] border-2 border-stone-900 rounded-full px-3.5 py-1 font-jua text-xs sm:text-sm text-stone-900 shadow-xs">
                  미션 3, 나의 체형알기
                </div>
              </div>

              <div className="text-center my-1">
                <div className="inline-block bg-white border-2 border-stone-900 rounded-full px-4 py-1 font-jua text-base text-stone-900">
                  상체 vs 하체
                </div>
              </div>

              {/* Questions */}
              <div className="space-y-3.5 my-auto">
                {/* Question 1 */}
                <div className="bg-white/80 border-2 border-stone-900 rounded-2xl p-3 shadow-xs">
                  <div className="text-xs sm:text-sm font-bold text-stone-900 mb-2">
                    정면에서 볼 때, 어깨와 골반 너비 중 어느 쪽이 더 넓어 보이나요?
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['어깨가 더 넓음', '골반이 더 넓음', '비슷함'].map((opt) => {
                      const isSelected = answers.body.body1 === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectBodyOption('body1', opt)}
                          className={`py-2 px-1 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#ff85a2] text-white border-stone-900 shadow-[0_2px_0_#000]'
                              : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-stone-500'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="bg-white/80 border-2 border-stone-900 rounded-2xl p-3 shadow-xs">
                  <div className="text-xs sm:text-sm font-bold text-stone-900 mb-2">
                    체중이 늘 때, 살이 먼저 붙는 부위는?
                  </div>
                  <div className="space-y-1.5">
                    {['얼굴, 팔, 가슴 등 상체', '뱃살, 허리', '엉덩이, 다리 등 하체'].map((opt) => {
                      const isSelected = answers.body.body2 === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectBodyOption('body2', opt)}
                          className={`w-full py-2 px-3 text-xs sm:text-sm font-bold rounded-xl border-2 transition-all cursor-pointer text-left flex items-center justify-between ${
                            isSelected
                              ? 'bg-[#ff85a2] text-white border-stone-900 shadow-[0_2px_0_#000]'
                              : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-stone-500'
                          }`}
                        >
                          <span>{opt}</span>
                          {isSelected && <Check className="w-4 h-4 text-white" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-2 flex flex-col items-center">
                <button
                  onClick={handleNextSlide12}
                  className="font-jua text-lg bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-2 border-stone-900 rounded-full px-8 py-2 shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  다음으로 <ArrowRight className="w-4 h-4" />
                </button>
                <div className="text-[11px] font-bold text-stone-700 mt-2">
                  • {config.teacherBrand || 'made by 써비쌤'} •
                </div>
              </div>
            </div>
          )}

          {/* ==================== SLIDE 13: MISSION 3 PART 2 (비율) ==================== */}
          {currentSlide === 13 && (
            <div className="flex-1 flex flex-col justify-between py-1 animate-fadeIn">
              {/* Header */}
              <div className="text-center">
                <div className="text-xs font-bold text-stone-600 mb-0.5">{config.subTitle}</div>
                <h1 className="font-jua text-3xl text-stone-900 mb-1">{config.appTitle}</h1>
                <div className="inline-block bg-[#f8b3c3] border-2 border-stone-900 rounded-full px-3.5 py-1 font-jua text-xs sm:text-sm text-stone-900 shadow-xs">
                  미션 3, 나의 체형알기
                </div>
              </div>

              <div className="text-center my-1">
                <div className="inline-block bg-white border-2 border-stone-900 rounded-full px-4 py-1 font-jua text-base text-stone-900">
                  비율
                </div>
              </div>

              <div className="my-auto space-y-3">
                <div className="bg-white/80 border-2 border-stone-900 rounded-2xl p-3 shadow-xs">
                  <div className="text-xs sm:text-sm font-bold text-stone-900 mb-2">
                    명치부터 손을 차례대로 포개었을 때
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    {['배꼽이 가려진다', '배꼽 가까이', '배꼽이 더 아래에'].map((opt) => {
                      const isSelected = answers.body.body3 === opt;
                      return (
                        <button
                          key={opt}
                          onClick={() => handleSelectBodyOption('body3', opt)}
                          className={`py-2 px-1 text-xs font-bold rounded-xl border-2 transition-all cursor-pointer text-center ${
                            isSelected
                              ? 'bg-[#ff85a2] text-white border-stone-900 shadow-[0_2px_0_#000]'
                              : 'bg-stone-50 text-stone-800 border-stone-300 hover:border-stone-500'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Proportion Illustration */}
                <div className="text-center">
                  <div className="inline-block border-2 border-stone-900 rounded-2xl overflow-hidden shadow-md max-w-[260px] bg-white">
                    <img
                      src={BODY_PROPORTION_IMAGE}
                      alt="상하체 비율 측정 참고 사진"
                      className="w-full h-[155px] sm:h-[165px] object-cover"
                    />
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    손바닥을 명치에 대고 내려가며 배꼽 위치를 가늠해 보세요.
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="pt-2 flex flex-col items-center">
                <button
                  onClick={handleNextSlide13}
                  className="font-jua text-lg bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-2 border-stone-900 rounded-full px-8 py-2 shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  결과 확인하기 <ChevronRight className="w-5 h-5" />
                </button>
                <div className="text-[11px] font-bold text-stone-700 mt-2">
                  • {config.teacherBrand || 'made by 써비쌤'} •
                </div>
              </div>
            </div>
          )}

          {/* ==================== SLIDE 14: SUMMARY & RESULTS ==================== */}
          {currentSlide === 14 && (
            <div className="flex-1 flex flex-col justify-start py-1 animate-fadeIn">
              {/* Header */}
              <div className="text-center mb-1.5">
                <div className="text-xs font-bold text-stone-600 mb-0.5">{config.subTitle}</div>
                <h1 className="font-jua text-3xl text-stone-900 mb-0.5">{config.appTitle}</h1>
              </div>

              <div className="text-center mb-2">
                <h2 className="font-jua text-2xl text-stone-900 inline-flex items-center gap-1.5">
                  📋 나의 패션 탐구 결과
                </h2>
              </div>

              {/* Student Information Card (Grade, Class, Name) */}
              <div className="bg-white border-2 border-stone-900 rounded-2xl p-3 mb-2.5 shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-jua text-stone-800 flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-pink-600" />
                    <span>학생 인적 사항 (반별 시트 자동 분리)</span>
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold border border-emerald-300">
                    반별 시트 누적
                  </span>
                </div>

                {/* Grade and Class Dropdowns */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-0.5">학년 선택</label>
                    <select
                      value={gradeLevel}
                      onChange={(e) => setGradeLevel(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-pink-500 bg-stone-50 font-bold"
                    >
                      <option value="1학년">1학년</option>
                      <option value="2학년">2학년</option>
                      <option value="3학년">3학년</option>
                      <option value="기타">기타</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-0.5">반 선택</label>
                    <select
                      value={classNum}
                      onChange={(e) => setClassNum(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-pink-500 bg-stone-50 font-bold"
                    >
                      {['1반', '2반', '3반', '4반', '5반', '6반', '7반', '8반', '9반', '10반', 'CUSTOM'].map((c) => (
                        <option key={c} value={c}>
                          {c === 'CUSTOM' ? '직접 입력' : c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {classNum === 'CUSTOM' && (
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-0.5">반 직접 입력</label>
                    <input
                      type="text"
                      value={customClass}
                      onChange={(e) => setCustomClass(e.target.value)}
                      placeholder="예: 11반 또는 동아리반"
                      className="w-full px-2.5 py-1 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-pink-500 bg-stone-50"
                    />
                  </div>
                )}

                {/* Number and Name */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-0.5">번호</label>
                    <input
                      type="text"
                      value={studentNumber}
                      onChange={(e) => setStudentNumber(e.target.value)}
                      placeholder="예: 15번"
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-pink-500 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-stone-600 block mb-0.5">이름 (필수)</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      placeholder="예: 김민수"
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded-lg focus:outline-none focus:border-pink-500 bg-stone-50 font-bold"
                    />
                  </div>
                </div>

                <div className="bg-pink-50 p-1.5 rounded-lg text-[10px] text-pink-800 flex items-center justify-between">
                  <span>📌 저장될 시트 위치: <strong>[{effectiveClass}]</strong> 탭 & <strong>[전체통합]</strong> 탭</span>
                </div>

                {/* Big Submit Button */}
                <button
                  onClick={handleSubmitToGoogleSheet}
                  disabled={isSubmitting || isSubmitted}
                  className={`w-full py-2.5 px-3 rounded-xl font-jua text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 cursor-pointer ${
                    isSubmitted
                      ? 'bg-emerald-600 text-white cursor-default'
                      : isSubmitting
                      ? 'bg-stone-400 text-white cursor-wait'
                      : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-[0_3px_0_#065f46]'
                  }`}
                >
                  {isSubmitting ? (
                    <>전송 중...</>
                  ) : isSubmitted ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>써비쌤께 제출 완료!</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>써비쌤께 제출하기 (구글 시트 전송)</span>
                    </>
                  )}
                </button>
              </div>

              {/* Scrollable Summary Cards */}
              <div className="space-y-2.5 overflow-y-auto max-h-[340px] sm:max-h-[380px] pr-1">
                
                {/* Mission 1 Card */}
                <div className="bg-white border-2 border-stone-900 rounded-xl p-3 shadow-xs">
                  <h4 className="font-jua text-sm text-stone-900 pb-1.5 border-b border-stone-200 mb-2 flex items-center justify-between">
                    <span>[미션 1] 옷만 보고 맞히기</span>
                    <span className="text-[11px] text-pink-600 font-bold">인상 & 첫느낌</span>
                  </h4>
                  <div className="space-y-1.5 text-xs text-stone-700">
                    {[1, 2, 3, 4].map((id) => (
                      <div key={id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                        <span className="font-bold text-stone-900">{id}번:</span>
                        <div className="text-right text-[11px]">
                          성격(<span className="text-pink-600 font-bold">{answers.mission1[id]?.traits.join(', ') || '미선택'}</span>) / 
                          직업(<span className="text-indigo-600 font-bold">{answers.mission1[id]?.job || '미입력'}</span>)
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mission 2 Card */}
                <div className="bg-white border-2 border-stone-900 rounded-xl p-3 shadow-xs">
                  <h4 className="font-jua text-sm text-stone-900 pb-1.5 border-b border-stone-200 mb-2 flex items-center justify-between">
                    <span>[미션 2] 전통의상 맞히기</span>
                    <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                      점수: {m2Score} / 4점
                    </span>
                  </h4>
                  <div className="space-y-1 text-xs text-stone-700">
                    {MISSION2_QUIZZES.map((q) => {
                      const res = answers.mission2[q.id];
                      return (
                        <div key={q.id} className="flex items-center justify-between bg-stone-50 p-1.5 rounded-lg border border-stone-200">
                          <div>
                            <strong>{q.numberLabel} ({q.country}):</strong>{' '}
                            <span className="text-stone-500 text-[11px]">{q.costumeName}</span>
                          </div>
                          <div>
                            {res?.isCorrect ? (
                              <span className="text-emerald-600 font-bold inline-flex items-center gap-0.5">
                                <CheckCircle2 className="w-3.5 h-3.5" /> 정답 ({res.selected})
                              </span>
                            ) : (
                              <span className="text-red-500 font-bold inline-flex items-center gap-0.5 text-[11px]">
                                <XCircle className="w-3.5 h-3.5" /> 오답 (선택: {res?.selected || '미선택'} / 정답: {q.country})
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Mission 3 Card & Diagnosis */}
                <div className="bg-white border-2 border-stone-900 rounded-xl p-3 shadow-xs">
                  <h4 className="font-jua text-sm text-stone-900 pb-1.5 border-b border-stone-200 mb-2 flex items-center justify-between">
                    <span>[미션 3] 나의 체형알기</span>
                    <span className="text-[11px] text-amber-700 font-bold">자가 진단</span>
                  </h4>
                  <div className="space-y-1 text-xs text-stone-700 mb-3">
                    <div className="flex justify-between py-0.5 border-b border-stone-100">
                      <strong>어깨 vs 골반:</strong>
                      <span className="font-bold text-stone-900">{answers.body.body1 || '미선택'}</span>
                    </div>
                    <div className="flex justify-between py-0.5 border-b border-stone-100">
                      <strong>살이 붙는 부위:</strong>
                      <span className="font-bold text-stone-900">{answers.body.body2 || '미선택'}</span>
                    </div>
                    <div className="flex justify-between py-0.5">
                      <strong>상하체 비율:</strong>
                      <span className="font-bold text-stone-900">{answers.body.body3 || '미선택'}</span>
                    </div>
                  </div>

                  {/* Body Type AI Stylist Advice Box */}
                  <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-3 text-left">
                    <div className="flex items-center gap-1.5 font-jua text-sm text-amber-950 mb-1">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <span>체형 분석: {bodyDiagnosis.bodyTypeTitle}</span>
                    </div>
                    <p className="text-[11px] text-stone-600 mb-2 font-gowun">
                      {bodyDiagnosis.bodyTypeSubtitle}
                    </p>

                    <div className="space-y-1.5 text-[11px] text-stone-800">
                      <div className="font-bold text-stone-900">✨ 어울리는 스타일링 팁:</div>
                      <ul className="list-disc pl-4 space-y-1 text-stone-700">
                        {bodyDiagnosis.stylingTips.map((tip, idx) => (
                          <li key={idx}>{tip}</li>
                        ))}
                      </ul>
                      
                      <div className="pt-1 flex flex-wrap gap-1">
                        <span className="font-bold text-stone-900">추천템:</span>
                        {bodyDiagnosis.recommendedItems.map((item, idx) => (
                          <span key={idx} className="bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            #{item}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-2.5 flex flex-col items-center gap-2">
                <div className="flex gap-2 w-full">
                  <button
                    onClick={handleCopySummary}
                    className="flex-1 py-2 px-3 bg-stone-900 hover:bg-stone-800 text-white rounded-xl font-jua text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                    {copiedSummary ? '복사 완료!' : '결과 복사하기'}
                  </button>

                  <button
                    onClick={handlePrint}
                    className="py-2 px-3 bg-white hover:bg-stone-100 text-stone-900 border-2 border-stone-900 rounded-xl font-jua text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> 인쇄/저장
                  </button>
                </div>

                <button
                  onClick={handleRestart}
                  className="font-jua text-lg bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-2 border-stone-900 rounded-full px-8 py-1.5 shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-4 h-4" /> 다시 시작하기
                </button>

                {/* Footer Brand: made by 써비쌤 */}
                <div className="text-[12px] font-bold text-stone-800 mt-1 font-gowun">
                  • {config.teacherBrand || 'made by 써비쌤'} •
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ==================== QUIZ ANSWER MODAL ==================== */}
      {quizModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#fdebed] border-[3px] border-stone-900 rounded-3xl p-6 max-w-sm w-full text-center shadow-[0_10px_30px_rgba(0,0,0,0.5)] font-gowun animate-scaleUp">
            
            <div className="mb-3">
              {quizModal.isCorrect ? (
                <div className="inline-flex items-center gap-1.5 font-jua text-4xl text-emerald-600 tracking-tight">
                  <CheckCircle2 className="w-9 h-9" /> 정답!
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 font-jua text-4xl text-red-500 tracking-tight">
                  <XCircle className="w-9 h-9" /> 오답!
                </div>
              )}
            </div>

            <div className="bg-white border-2 border-stone-900 rounded-2xl p-4 text-left space-y-2 mb-4 shadow-xs">
              <div className="text-xs font-bold text-stone-500 uppercase">전통의상 해설</div>
              <div className="font-jua text-lg text-stone-900">
                {quizModal.correctAnswer} - {quizModal.costumeName}
              </div>
              <p className="text-xs text-stone-700 leading-relaxed">
                {quizModal.explanation}
              </p>
              <div className="bg-pink-50 p-2.5 rounded-xl border border-pink-200 text-xs text-pink-900 leading-relaxed">
                <strong>🌡️ 기후 & 문화 포인트:</strong><br />
                {quizModal.climateTrivia}
              </div>
            </div>

            <button
              onClick={handleCloseQuizModal}
              className="font-jua text-xl bg-[#d1f2d9] hover:bg-[#bbf0c6] text-stone-950 border-[3px] border-stone-900 rounded-full px-8 py-2.5 shadow-[0_4px_0_#000] active:translate-y-1 active:shadow-[0_1px_0_#000] transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              다음 화면으로 <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* ==================== SUBMISSION FEEDBACK MODAL ==================== */}
      {submissionFeedback.show && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border-[3px] border-stone-900 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl font-gowun animate-scaleUp">
            
            <div className="w-14 h-14 rounded-full mx-auto mb-3 flex items-center justify-center border-2 border-stone-900 bg-emerald-100 text-emerald-600">
              {submissionFeedback.isSuccess ? (
                <CheckCircle2 className="w-8 h-8" />
              ) : (
                <HelpCircle className="w-8 h-8 text-amber-600" />
              )}
            </div>

            <h3 className="font-jua text-xl text-stone-900 mb-2">
              {submissionFeedback.title}
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed mb-4 whitespace-pre-line text-left bg-stone-50 p-3 rounded-xl border border-stone-200">
              {submissionFeedback.message}
            </p>

            <button
              onClick={() => setSubmissionFeedback((prev) => ({ ...prev, show: false }))}
              className="font-jua text-sm bg-stone-900 hover:bg-stone-800 text-white rounded-xl px-6 py-2 transition-transform active:scale-95 cursor-pointer"
            >
              확인
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
