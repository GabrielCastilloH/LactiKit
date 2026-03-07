import { TestResult } from '../types';

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

export const TEST_TYPE_LABELS: Record<string, string> = {
  mom_urine: "Mom's Urine",
  breastmilk: 'Breastmilk',
  baby_urine: "Baby's Urine",
};

export const FAKE_TEST_RESULTS: TestResult[] = [
  {
    id: 'test-001',
    date: '2026-03-05',
    testType: 'mom_urine',
    biomarkers: [
      {
        name: 'leukocytes_nitrites',
        displayName: 'Leukocytes/Nitrites',
        unit: 'LEU/µL',
        detected: 75,
        normalMin: 0,
        normalMax: 25,
        level: 'high',
      },
      {
        name: 'specific_gravity',
        displayName: 'Specific Gravity',
        unit: 'g/mL',
        detected: 1.03,
        normalMin: 1.005,
        normalMax: 1.025,
        level: 'high',
      },
      {
        name: 'ketones',
        displayName: 'Ketones',
        unit: 'mg/dL',
        detected: 5,
        normalMin: 0,
        normalMax: 10,
        level: 'normal',
      },
      {
        name: 'vitamin_c',
        displayName: 'Vitamin C',
        unit: 'mg/dL',
        detected: 4,
        normalMin: 10,
        normalMax: 40,
        level: 'low',
      },
    ],
  },
  {
    id: 'test-002',
    date: '2026-03-01',
    testType: 'breastmilk',
    biomarkers: [
      {
        name: 'protein',
        displayName: 'Protein',
        unit: 'g/L',
        detected: 8,
        normalMin: 9,
        normalMax: 14,
        level: 'low',
      },
      {
        name: 'calcium_magnesium',
        displayName: 'Calcium/Magnesium',
        unit: 'mg/L',
        detected: 260,
        normalMin: 250,
        normalMax: 350,
        level: 'normal',
      },
      {
        name: 'ph_level',
        displayName: 'pH Level',
        unit: 'pH',
        detected: 7.2,
        normalMin: 6.5,
        normalMax: 7.5,
        level: 'normal',
      },
    ],
  },
];
