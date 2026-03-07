export type MessageRole = 'user' | 'assistant';

export interface Message {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: Date;
}

export type Deficiency = {
  nutrient: string;
  unit: string;
  detected: number;
  normalMin: number;
  normalMax: number;
  level: 'low' | 'normal' | 'high';
};

export interface ScanResult {
  date: string;
  deficiencies: Deficiency[];
}

export type ChatPhase = 'questioning' | 'recipe' | 'referral';
