import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
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
  const action = 'Make sure you\'re drinking enough water and eating a balanced diet.';
  return `Your latest ${TEST_TYPE_LABELS[test.testType]} test flagged: ${names}. ${action}`;
}

function getHealthScore(test: TestResult | null): number {
  if (!test) return 0;
  const normal = test.biomarkers.filter(b => b.level === 'normal').length;
  return Math.round((normal / test.biomarkers.length) * 100);
}

interface DetailedAdvice {
  summary: string;
  actionItems: string[];
  seekHelp: string | null;
}

function getDetailedAdvice(test: TestResult | null): DetailedAdvice {
  if (!test) {
    return {
      summary: 'No test results yet. Run your first test to get personalized health advice.',
      actionItems: [
        'Use the scan button below to run your first at-home test.',
        'Make sure your test strip is placed correctly before scanning.',
        'Test results are analyzed in seconds.',
      ],
      seekHelp: null,
    };
  }

  const flagged = test.biomarkers.filter(b => b.level !== 'normal');

  if (flagged.length === 0) {
    return {
      summary: 'All markers from your latest test are within normal range. Great work keeping up with your health!',
      actionItems: [
        'Continue drinking 8–10 cups of water daily.',
        'Maintain a balanced diet rich in whole foods, fruits, and vegetables.',
        'Keep up regular testing to track your wellness over time.',
        'Get adequate rest — aim for 7–9 hours of sleep per night.',
      ],
      seekHelp: null,
    };
  }

  const items: string[] = [];
  let seekHelp: string | null = null;

  if (test.testType === 'mom_urine') {
    if (flagged.some(b => b.name === 'specific_gravity')) {
      items.push('Increase fluid intake — aim for at least 10 cups of water daily.');
      items.push('Limit caffeine and sugary drinks which can dehydrate you.');
    }
    if (flagged.some(b => b.name === 'ketones')) {
      items.push('Eat regular, balanced meals — avoid skipping breakfast.');
      items.push('Include complex carbohydrates like oats, sweet potato, and whole grains.');
      items.push('Consult your doctor if ketones remain elevated, especially if breastfeeding.');
    }
    if (flagged.some(b => b.name === 'vitamin_c')) {
      items.push('Add more citrus fruits (oranges, kiwi, strawberries) to your diet.');
      items.push('Include bell peppers and broccoli — excellent sources of Vitamin C.');
      items.push('Consider a Vitamin C supplement after consulting your doctor.');
    }
    if (flagged.some(b => b.name === 'protein')) {
      items.push('Elevated urine protein can indicate kidney stress or dehydration.');
      items.push('Drink more water and monitor for swelling, headaches, or blurred vision.');
      seekHelp = 'Persistent elevated protein in urine postpartum may indicate late-onset preeclampsia. Contact your healthcare provider promptly.';
    }
    if (flagged.some(b => b.name === 'calcium_magnesium')) {
      items.push('Eat more dairy, leafy greens, almonds, and fortified plant milks.');
      items.push('Consider a calcium + magnesium supplement after consulting your doctor.');
    }
    if (flagged.some(b => b.name === 'ph_level')) {
      items.push('Stay well hydrated to help maintain healthy urine pH.');
      items.push('A very alkaline or acidic result can reflect diet or early infection — monitor closely.');
    }
  } else if (test.testType === 'breastmilk') {
    if (flagged.some(b => b.name === 'alcohol')) {
      items.push('Wait at least 2–3 hours per drink consumed before breastfeeding.');
      items.push('Consider pumping and discarding milk after alcohol consumption.');
      seekHelp = 'Any detectable alcohol in breastmilk can affect your baby\'s development. Consult your healthcare provider if this persists.';
    }
    if (flagged.some(b => b.name === 'ph_level')) {
      items.push('An elevated breastmilk pH can be an early sign of mastitis — watch for breast redness, warmth, or pain.');
      items.push('Stay well hydrated and continue breastfeeding frequently to prevent blockages.');
      if (!seekHelp) seekHelp = 'Abnormal breastmilk pH may indicate a breast infection. Contact your healthcare provider if you develop fever or breast pain.';
    }
    if (flagged.some(b => b.name === 'vitamin_c')) {
      items.push('Increase Vitamin C intake: citrus fruits, kiwi, bell peppers, and strawberries.');
      items.push('Your baby\'s Vitamin C supply depends directly on your diet — aim for 120mg/day while breastfeeding.');
    }
  } else if (test.testType === 'baby_urine') {
    if (flagged.some(b => b.name === 'specific_gravity')) {
      items.push('Offer more frequent feeds — breast milk or formula as appropriate.');
      items.push('Watch for signs of dehydration: sunken fontanelle, dry mouth, fewer wet diapers.');
      seekHelp = 'High specific gravity in an infant can signal dehydration or inadequate feeding. Contact your pediatrician if feeding difficulties persist.';
    }
    if (flagged.some(b => b.name === 'ketones')) {
      items.push('Ensure the baby is feeding frequently — at least 8–12 times per day for newborns.');
      items.push('High ketones in an infant indicate a caloric deficit — check latch and milk transfer if breastfeeding.');
      if (!seekHelp) seekHelp = 'Elevated ketones in a baby may indicate inadequate caloric intake. Contact your pediatrician promptly.';
    }
  }

  if (items.length === 0) {
    items.push('Monitor your symptoms and retest in a few days.');
    items.push('Stay hydrated and maintain a balanced diet.');
  }

  const names = flagged.map(b => b.displayName).join(', ');
  return {
    summary: `Your latest ${TEST_TYPE_LABELS[test.testType]} test flagged: ${names}. Here's what you can do:`,
    actionItems: items,
    seekHelp,
  };
}

const TEST_INTERVAL_DAYS = 7;

function getNextTestInfo(tests: TestResult[]): { daysUntil: number } | null {
  if (tests.length === 0) return null;
  const lastDate = new Date(tests[0].date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  lastDate.setHours(0, 0, 0, 0);
  const daysSince = Math.floor((today.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
  return { daysUntil: Math.max(0, TEST_INTERVAL_DAYS - daysSince) };
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
  const tabBarHeight = useBottomTabBarHeight();
  const nextTest = getNextTestInfo(tests);
  const [nextTestModalVisible, setNextTestModalVisible] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: tabBarHeight + 16 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingTop: 20, paddingBottom: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '800', color: COLORS.primary }}>LactiKit</Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>Baby & Maternal Health Tracker</Text>
          </View>
          {nextTest && (
            <TouchableOpacity
              onPress={() => setNextTestModalVisible(true)}
              activeOpacity={0.75}
              style={{
                backgroundColor: COLORS.primary + '18',
                borderRadius: 12,
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderWidth: 1,
                borderColor: COLORS.primary + '40',
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 10, fontWeight: '600', color: COLORS.primary }}>Next test in</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: COLORS.primary, lineHeight: 20 }}>
                {nextTest.daysUntil}d
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Next Test Modal */}
        <Modal
          visible={nextTestModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setNextTestModalVisible(false)}
        >
          <TouchableOpacity
            style={{ flex: 1, backgroundColor: '#00000044', justifyContent: 'center', alignItems: 'center' }}
            activeOpacity={1}
            onPress={() => setNextTestModalVisible(false)}
          >
            <TouchableOpacity activeOpacity={1} onPress={() => {}}>
              <View
                style={{
                  backgroundColor: COLORS.surface,
                  borderRadius: 20,
                  padding: 28,
                  marginHorizontal: 32,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 8 },
                  shadowOpacity: 0.12,
                  shadowRadius: 24,
                  elevation: 8,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
              >
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: COLORS.primary + '18',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 16,
                  }}
                >
                  <Ionicons name="calendar-outline" size={26} color={COLORS.primary} />
                </View>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 8, textAlign: 'center' }}>
                  Upcoming Test
                </Text>
                <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 22 }}>
                  You should take your next tests in{' '}
                  <Text style={{ fontWeight: '700', color: COLORS.primary }}>
                    {nextTest.daysUntil === 0 ? 'today' : `${nextTest.daysUntil} day${nextTest.daysUntil === 1 ? '' : 's'}`}
                  </Text>
                  {nextTest.daysUntil > 0 ? '.' : ' — it\'s time to scan!'}
                </Text>
                <TouchableOpacity
                  onPress={() => setNextTestModalVisible(false)}
                  style={{
                    marginTop: 20,
                    backgroundColor: COLORS.primary,
                    borderRadius: 12,
                    paddingHorizontal: 28,
                    paddingVertical: 10,
                  }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#FFFFFF' }}>Got it</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

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
            <Text style={{ fontSize: 13, fontWeight: '700', color: '#111827', flex: 1 }}>Health Advice</Text>
            <TouchableOpacity onPress={() => router.push('/health-advice')} activeOpacity={0.75}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.primary }}>Show More</Text>
            </TouchableOpacity>
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
            size={90}
          />
          <View style={{ width: 1, backgroundColor: COLORS.border }} />
          <CircleGraph
            percent={healthScore}
            label="Health Score"
            color={COLORS.primary}
            size={90}
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
