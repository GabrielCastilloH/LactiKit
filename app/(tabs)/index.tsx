import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { COLORS, TEST_TYPE_LABELS } from '../../lib/constants';
import { useTestHistory } from '../../context/ScanHistoryContext';
import { CircleGraph } from '../../components/charts/CircleGraph';
import { HealthScoreChart } from '../../components/charts/HealthScoreChart';
import { Ionicons } from '@expo/vector-icons';
import { TestResult } from '../../types';

function getAlertText(test: TestResult | null): string {
  if (!test) return 'No test results yet. Use the scan button below to run your first test.';
  const flagged = test.biomarkers.filter(b => b.level !== 'normal');
  if (flagged.length === 0) return 'All markers from your latest test are within normal range. Keep it up!';
  const names = flagged.map(b => b.displayName).join(', ');
  const action = test.testType === 'breastmilk'
    ? 'Consider increasing protein-rich foods and staying well hydrated.'
    : 'Make sure you\'re drinking enough water and eating a balanced diet.';
  return `Your latest ${TEST_TYPE_LABELS[test.testType]} test flagged: ${names}. ${action}`;
}

function getHealthScore(test: TestResult | null): number {
  if (!test) return 0;
  const normal = test.biomarkers.filter(b => b.level === 'normal').length;
  return Math.round((normal / test.biomarkers.length) * 100);
}

function getHydrationScore(test: TestResult | null): number {
  if (!test) return 0;
  const hydrationMarker = test.biomarkers.find(
    b => b.name === 'specific_gravity' || b.name === 'ketones'
  );
  if (!hydrationMarker) return 72;
  return hydrationMarker.level === 'normal' ? 85 : hydrationMarker.level === 'high' ? 45 : 62;
}

export default function HomeScreen() {
  const { tests } = useTestHistory();
  const latestTest = tests[0] ?? null;
  const alertText = getAlertText(latestTest);
  const healthScore = getHealthScore(latestTest);
  const hydrationScore = getHydrationScore(latestTest);


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: 20, paddingBottom: 16 }}>
          <Text style={{ fontSize: 12, color: '#6B7280', marginBottom: 2 }}>Good morning</Text>
          <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.primary }}>LactiKit</Text>
          <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Baby & Maternal Health Tracker</Text>
        </View>

        {/* Alert / Advice Card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: (latestTest && latestTest.biomarkers.some(b => b.level !== 'normal')
              ? COLORS.warning
              : '#0D9488') + '40',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Ionicons name="alert-circle-outline" size={18} color={COLORS.warning} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827' }}>Health Advice</Text>
          </View>
          <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20 }}>{alertText}</Text>
        </View>

        {/* Graphs Row — Donut charts */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 14 }}>Health Overview</Text>
        <View
          style={{
            backgroundColor: COLORS.background,
            borderRadius: 16,
            padding: 20,
            marginBottom: 20,
            flexDirection: 'row',
            justifyContent: 'space-around',
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <CircleGraph
            percent={hydrationScore}
            label="Hydration"
            color="#7BAAA3"
            size={110}
          />
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <CircleGraph
            percent={healthScore}
            label="Health Score"
            color={COLORS.primary}
            size={110}
          />
        </View>

        {/* Line Chart — Health Score Trend */}
        {tests.length >= 1 && (
          <>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>Wellness Trend</Text>
            <View
              style={{
                backgroundColor: COLORS.surface,
                borderRadius: 16,
                padding: 16,
                marginBottom: 20,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
                elevation: 2,
              }}
            >
              <HealthScoreChart tests={tests} />
            </View>
          </>
        )}

        {/* Past Tests */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 14 }}>Past Tests</Text>
        {tests.length === 0 ? (
          <View
            style={{
              borderWidth: 1.5,
              borderColor: COLORS.border,
              borderStyle: 'dashed',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#6B7280', marginBottom: 4 }}>No tests yet</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', textAlign: 'center' }}>
              Tap the scan button below to run your first test
            </Text>
          </View>
        ) : (
          tests.map(test => {
            const flagged = test.biomarkers.filter(b => b.level !== 'normal');
            const date = new Date(test.date).toLocaleDateString('en-US', {
              month: 'short', day: 'numeric', year: 'numeric',
            });
            return (
              <TouchableOpacity
                key={test.id}
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: '/test/[id]', params: { id: test.id } })}
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 14,
                  padding: 14,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.04,
                  shadowRadius: 4,
                  elevation: 1,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '600', color: '#111827', marginBottom: 3 }}>
                    {TEST_TYPE_LABELS[test.testType]}
                  </Text>
                  <Text style={{ fontSize: 12, color: '#9CA3AF' }}>{date}</Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  {flagged.length > 0 ? (
                    <View style={{ backgroundColor: COLORS.warning + '22', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.warning }}>
                        {flagged.length} flagged
                      </Text>
                    </View>
                  ) : (
                    <View style={{ backgroundColor: '#0D948822', borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 }}>
                      <Text style={{ fontSize: 11, fontWeight: '700', color: '#0D9488' }}>All normal</Text>
                    </View>
                  )}
                  <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
