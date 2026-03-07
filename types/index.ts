export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export type ChatPhase = 'questioning' | 'recipe' | 'referral';

export type TestType = 'mom_urine' | 'breastmilk' | 'baby_urine';

export type BiomarkerName =
  | 'specific_gravity'
  | 'ketones'
  | 'vitamin_c'
  | 'protein'
  | 'calcium_magnesium'
  | 'ph_level'
  | 'alcohol';

export interface Biomarker {
  name: BiomarkerName;
  displayName: string;
  unit: string;
  detected: number;
  normalMin: number;
  normalMax: number;
  level: 'low' | 'normal' | 'high';
}

export interface TestResult {
  id: string;
  date: string;
  testType: TestType;
  biomarkers: Biomarker[];
  aiOverview?: string;
}
