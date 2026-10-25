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
  googleSheetWebhookUrl?: string; // Google Apps Script doPost URL for sheets
}

export interface StudentSubmissionRecord {
  id: string;
  timestamp: string;
  studentGrade: string; // 학년/반/번호
  studentName: string;
  m1Results: string;
  m2Score: number;
  m2Results: string;
  bodyTypeDiagnosis: string;
  bodyAnswers: string;
  sentToGoogleSheet: boolean;
}
