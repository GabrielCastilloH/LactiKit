import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { COLORS, TEST_TYPE_LABELS } from '../lib/constants';
import { useTestHistory } from '../context/ScanHistoryContext';
import { BiomarkerTrendChart } from '../components/charts/BiomarkerTrendChart';
import { BiomarkerName, TestResult } from '../types';

const BAR_CHART_BIOMARKERS: BiomarkerName[] = ['protein', 'ketones', 'alcohol'];

const BIOMARKER_META: { name: BiomarkerName; displayName: string; unit: string }[] = [
  { name: 'vitamin_c', displayName: 'Vitamin C', unit: 'mg/dL' },
  { name: 'protein', displayName: 'Protein', unit: 'mg/dL' },
  { name: 'ph_level', displayName: 'pH Level', unit: 'pH' },
  { name: 'specific_gravity', displayName: 'Specific Gravity', unit: 'g/mL' },
  { name: 'calcium_magnesium', displayName: 'Calcium / Magnesium', unit: 'mg/L' },
  { name: 'ketones', displayName: 'Ketones', unit: 'mg/dL' },
  { name: 'alcohol', displayName: 'Alcohol', unit: 'mg/dL' },
];

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function levelBadgeClass(level: string): string {
  if (level === 'low') return 'badge-low';
  if (level === 'high') return 'badge-high';
  return 'badge-normal';
}

function buildPDFHtml(tests: TestResult[]): string {
  const testTypeLabel = (type: string) => TEST_TYPE_LABELS[type] ?? type;
  const rows = tests.flatMap(test =>
    test.biomarkers.map(b => ({
      date: test.date,
      testType: testTypeLabel(test.testType),
      biomarker: b.displayName,
      value: b.detected,
      unit: b.unit,
      level: b.level,
      normalMin: b.normalMin,
      normalMax: b.normalMax,
    }))
  );

  const rowHtml = rows
    .map(
      r => `
    <tr>
      <td>${escapeHtml(r.date)}</td>
      <td>${escapeHtml(r.testType)}</td>
      <td>${escapeHtml(r.biomarker)}</td>
      <td>${r.value} ${escapeHtml(r.unit)}</td>
      <td><span class="badge ${levelBadgeClass(r.level)}">${escapeHtml(r.level)}</span></td>
      <td>${r.normalMin} – ${r.normalMax}</td>
    </tr>`
    )
    .join('');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page { margin: 24px; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      color: #374151;
      line-height: 1.5;
      margin: 0;
      padding: 20px;
    }
    .header {
      text-align: center;
      margin-bottom: 28px;
      padding-bottom: 20px;
      border-bottom: 2px solid ${COLORS.primary};
    }
    .header h1 {
      font-size: 24px;
      font-weight: 700;
      color: ${COLORS.primary};
      margin: 0 0 4px 0;
    }
    .header p {
      font-size: 13px;
      color: #6B7280;
      margin: 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 12px;
    }
    th {
      text-align: left;
      padding: 10px 12px;
      background: ${COLORS.primary};
      color: white;
      font-weight: 600;
    }
    th:first-child { border-radius: 6px 0 0 0; }
    th:last-child { border-radius: 0 6px 0 0; }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #E5E7EB;
    }
    tr:nth-child(even) { background: #F9FAFB; }
    tr:hover { background: #F3F4F6; }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }
    .badge-normal { background: #D1FAE5; color: #065F46; }
    .badge-low { background: #FEF3C7; color: #92400E; }
    .badge-high { background: #FEE2E2; color: #991B1B; }
    .footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #E5E7EB;
      font-size: 11px;
      color: #9CA3AF;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>LactiKit Biomarker Report</h1>
    <p>Exported on ${escapeHtml(new Date().toLocaleDateString())} • ${tests.length} test(s)</p>
  </div>
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Test Type</th>
        <th>Biomarker</th>
        <th>Value</th>
        <th>Level</th>
        <th>Normal Range</th>
      </tr>
    </thead>
    <tbody>${rowHtml}
    </tbody>
  </table>
  <div class="footer">
    LactiKit — Maternal & baby health tracking. This report is for informational purposes only.
  </div>
</body>
</html>`;
}

export default function AllTrendsScreen() {
  const { tests } = useTestHistory();

  // Only show biomarkers that appear in at least one test
  const available = BIOMARKER_META.filter(meta =>
    tests.some(t => t.biomarkers.some(b => b.name === meta.name))
  );

  async function handleExport() {
    if (tests.length === 0) {
      Alert.alert('No data', 'Run a test first to export data.');
      return;
    }
    try {
      const html = buildPDFHtml(tests);
      const { uri } = await Print.printToFileAsync({ html });
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Export LactiKit Report',
          ...(Platform.OS === 'ios' && { UTI: '.pdf' }),
        });
      } else {
        Alert.alert('Export failed', 'Sharing is not available on this device.');
      }
    } catch (e) {
      console.error('Export failed:', e);
      Alert.alert('Export failed', 'Could not generate or share PDF.');
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          gap: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: COLORS.surface,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827', flex: 1 }}>
          All Biomarker Trends
        </Text>
        <TouchableOpacity
          onPress={handleExport}
          activeOpacity={0.7}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            paddingHorizontal: 11,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1.5,
            borderColor: `${COLORS.primary}66`,
            backgroundColor: 'transparent',
          }}
        >
          <Ionicons name="download-outline" size={15} color={COLORS.primary} />
          <Text style={{ fontSize: 13, fontWeight: '600', color: COLORS.primary }}>Export</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {available.length === 0 ? (
          <View
            style={{
              borderWidth: 1.5,
              borderColor: COLORS.border,
              borderStyle: 'dashed',
              borderRadius: 16,
              padding: 32,
              alignItems: 'center',
              marginTop: 24,
            }}
          >
            <Text style={{ fontSize: 14, color: '#4B5563', textAlign: 'center' }}>
              No test data yet. Run your first test to see biomarker trends.
            </Text>
          </View>
        ) : (
          available.map(meta => (
            <View
              key={meta.name}
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: COLORS.border,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <BiomarkerTrendChart
                biomarkerName={meta.name}
                displayName={meta.displayName}
                unit={meta.unit}
                tests={tests}
                chartType={BAR_CHART_BIOMARKERS.includes(meta.name) ? 'bar' : 'line'}
              />
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
