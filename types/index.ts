export type Language = 'en' | 'ur' | 'roman';

export interface MedicineAnalysis {
  detectedNames: string[];
  brandName: string;
  genericName: string;
  category: string;
  primaryUses: string[];
  benefits: string[];
  howAndWhenToTake: {
    timing: string;
    instructions: string;
    dosAndDonts: string[];
  };
  sideEffects: {
    common: string[];
    serious: string[];
    whenToSeeDoctor: string;
  };
  safetyWarnings: {
    antibioticCaution?: string;
    pregnancyLactationCaution: string;
    drivingMachineryCaution: string;
    alcoholCaution: string;
    generalCautions: string[];
  };
  questionsForDoctor: string[];
  clarityNote?: string;
  isUnreadable?: boolean;
}

export type TestStatus = 'normal' | 'high' | 'low' | 'unknown' | 'not_provided' | 'unclear';

export interface TestResultItem {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  status: TestStatus;
  statusExplanation: string;
  isBlurryOrUnclear?: boolean;
}

export interface MedicalReportAnalysis {
  patientNeutralSummary: string;
  overallHealthStatusSimple: string;
  testResults: TestResultItem[];
  abnormalFindingsExplanation: {
    testName: string;
    meaningInPlainLanguage: string;
    whatItMeansForBody: string;
  }[];
  whatToAskYourDoctor: string[];
  whenToSeekUrgentCare: string[];
  validationNotes: string;
  isUnreadable?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  isSpoken?: boolean;
  emergencyAlert?: boolean;
}

export interface ActiveContext {
  type: 'medicine' | 'report';
  title: string;
  summary: string;
  data: MedicineAnalysis | MedicalReportAnalysis;
}

export interface HistoryItem {
  id: string;
  type: 'medicine' | 'report';
  title: string;
  date: string;
  data: MedicineAnalysis | MedicalReportAnalysis;
}
