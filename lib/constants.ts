import { ScanResult } from '../types';

export const COLORS = {
  primary: '#7C3AED',
  warning: '#F59E0B',
  danger: '#EF4444',
  background: '#F5F0FF',
  surface: '#FFFFFF',
};

export const ANALYZING_DURATION_MS = 3000;

export const SCAN_RESULT: ScanResult = {
  date: '2026-02-28',
  deficiencies: [
    {
      nutrient: 'Iron',
      unit: 'µg/dL',
      detected: 7,
      normalMin: 10,
      normalMax: 30,
      level: 'low',
    },
    {
      nutrient: 'Vitamin B12',
      unit: 'pg/mL',
      detected: 150,
      normalMin: 200,
      normalMax: 900,
      level: 'low',
    },
  ],
};
