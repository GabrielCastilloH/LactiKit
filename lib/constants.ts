import { ScanResult } from '../types';

export const COLORS = {
  primary: '#8B6B8B',
  warning: '#C9956A',
  danger: '#B85C5C',
  background: '#FDF6EE',
  surface: '#FFFAF5',
  tabBar: '#F5EDE3',
  border: '#E5D4C5',
  tabActive: '#8B6B8B',
  tabInactive: '#B8A89A',
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
