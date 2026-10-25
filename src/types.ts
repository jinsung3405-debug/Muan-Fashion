export interface Mission1Item {
  id: number;
  numberLabel: string;
  imageUrl: string;
  alt: string;
}

export interface Mission2Quiz {
  id: number;
  numberLabel: string;
  country: string;
  costumeName: string;
  imageUrl: string;
  options: string[];
  explanation: string;
  climateTrivia: string;
}

export interface BodySurveyAnswers {
  body1: string; // 어깨 vs 골반
  body2: string; // 살이 먼저 붙는 부위
  body3: string; // 상하체 비율 (배꼽 위치)
}

export interface StudentAnswers {
  mission1: {
    [key: number]: {
      traits: string[];
      job: string;
    };
  };
  mission2: {
    [key: number]: {
      selected: string;
      isCorrect: boolean;
    };
  };
  body: BodySurveyAnswers;
}

export interface AppConfig {
  appTitle: string;
  subTitle: string;
  teacherBrand: string;
  googleSheetWebhookUrl?: string; // Google Apps Script doPost/doGet URL
}

export interface StudentSubmissionRecord {
  id: string;
  timestamp: string;
  gradeLevel: string; // 학년 (예: 1학년, 2학년)
  classNum: string;   // 반 (예: 1반, 2반...)
  studentNumber: string; // 번호 (예: 15번)
  studentName: string;   // 이름
  fullClassLabel: string; // 예: 2학년 3반
  m1_1: string;
  m1_2: string;
  m1_3: string;
  m1_4: string;
  m2Score: number;
  m2_1: string;
  m2_2: string;
  m2_3: string;
  m2_4: string;
  bodyDiagnosis: string;
  body1: string;
  body2: string;
  body3: string;
  sentToGoogleSheet: boolean;
}
