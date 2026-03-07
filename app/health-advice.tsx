import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTestHistory } from '../context/ScanHistoryContext';
import { COLORS, TEST_TYPE_LABELS } from '../lib/constants';
import { TestResult, TestType } from '../types';

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
        'Use the scan button on the home screen to run your first at-home test.',
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
    if (flagged.some(b => b.name === 'leukocytes_nitrites')) {
      items.push('Drink at least 8–10 cups of water throughout the day.');
      items.push('Urinate frequently — avoid holding urine for long periods.');
      items.push('Wipe front to back after using the bathroom.');
      seekHelp = 'Elevated leukocytes or nitrites may indicate a urinary tract infection. Contact your healthcare provider if you experience burning, pain, or fever.';
    }
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
  } else if (test.testType === 'breastmilk') {
    if (flagged.some(b => b.name === 'protein')) {
      items.push('Increase protein intake: eggs, chicken, legumes, and Greek yogurt.');
      items.push('Aim for at least 65–71g of protein per day while breastfeeding.');
    }
    if (flagged.some(b => b.name === 'calcium_magnesium')) {
      items.push('Eat more dairy, fortified plant milks, leafy greens, and almonds.');
      items.push('Consider a calcium + magnesium supplement if dietary intake is low.');
      items.push('Limit alcohol and excess caffeine, which interfere with calcium absorption.');
    }
    if (flagged.some(b => b.name === 'ph_level')) {
      items.push('Stay well hydrated — dehydration can shift breastmilk pH.');
      items.push('Limit acidic foods (citrus, vinegar, tomatoes) temporarily.');
    }
    seekHelp = "Nutritional imbalances in breastmilk can affect your baby's development. Consider speaking with a lactation consultant or dietitian.";
  } else if (test.testType === 'baby_urine') {
    if (flagged.some(b => b.name === 'specific_gravity')) {
      items.push('Offer more frequent feeds — breast milk or formula as appropriate.');
      items.push('Watch for signs of dehydration: sunken fontanelle, dry mouth, fewer wet diapers.');
    }
    if (flagged.some(b => b.name === 'alcohol')) {
      items.push('If breastfeeding, avoid alcohol entirely or pump and discard milk for 2–3 hours per drink consumed.');
    }
    if (flagged.some(b => b.name === 'leukocytes_nitrites')) {
      items.push('Ensure the genital area is cleaned gently during diaper changes.');
      items.push('Monitor for fever, fussiness, or changes in feeding behavior.');
      seekHelp = "Elevated leukocytes or nitrites in baby's urine may indicate an infection. Contact your pediatrician promptly.";
    }
  }

  if (items.length === 0) {
    items.push('Monitor your symptoms and retest in a few days.');
    items.push('Stay hydrated and maintain a balanced diet.');
  }

  const names = flagged.map(b => b.displayName).join(', ');
  return {
    summary: `Your latest ${TEST_TYPE_LABELS[test.testType as TestType] ?? test.testType} test flagged: ${names}. Here's what you can do:`,
    actionItems: items,
    seekHelp,
  };
}

export default function HealthAdviceScreen() {
  const { tests } = useTestHistory();
  const latestTest = tests[0] ?? null;
  const advice = getDetailedAdvice(latestTest);
  const insets = useSafeAreaInsets();

  const hasFlagged = latestTest && latestTest.biomarkers.some(b => b.level !== 'normal');
  const borderColor = hasFlagged ? COLORS.warning : '#0D9488';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.surface }} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>Health Advice</Text>
      </View>

      <ScrollView
        style={{ flex: 1, backgroundColor: COLORS.background }}
        contentContainerStyle={{ padding: 16, paddingBottom: 16 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: borderColor + '40',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="alert-circle-outline" size={18} color={hasFlagged ? COLORS.warning : '#0D9488'} style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 14, fontWeight: '700', color: '#111827' }}>
              {hasFlagged ? 'Flagged Markers Detected' : 'All Clear'}
            </Text>
          </View>
          <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20 }}>{advice.summary}</Text>
        </View>

        {/* Action items */}
        <Text style={{ fontSize: 12, fontWeight: '600', color: '#4B5563', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
          Action Items
        </Text>
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 16,
            borderWidth: 1,
            borderColor: COLORS.border,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          {advice.actionItems.map((item, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 10,
                borderBottomWidth: i < advice.actionItems.length - 1 ? 1 : 0,
                borderBottomColor: COLORS.border,
              }}
            >
              <View
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 12,
                  backgroundColor: '#EDE9FE',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                  flexShrink: 0,
                }}
              >
                <Text style={{ fontSize: 11, fontWeight: '700', color: COLORS.primary }}>{i + 1}</Text>
              </View>
              <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20, flex: 1 }}>{item}</Text>
            </View>
          ))}
        </View>

        {/* Seek help warning */}
        {advice.seekHelp && (
          <>
            <Text style={{ fontSize: 12, fontWeight: '600', color: '#4B5563', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 }}>
              When to Seek Help
            </Text>
            <View
              style={{
                backgroundColor: COLORS.danger + '10',
                borderRadius: 16,
                padding: 16,
                marginBottom: 16,
                borderWidth: 1,
                borderColor: COLORS.danger + '30',
                flexDirection: 'row',
                alignItems: 'flex-start',
              }}
            >
              <Ionicons name="warning-outline" size={18} color={COLORS.danger} style={{ marginRight: 10, marginTop: 1 }} />
              <Text style={{ fontSize: 13, color: COLORS.danger, lineHeight: 20, flex: 1, fontWeight: '600' }}>
                {advice.seekHelp}
              </Text>
            </View>
          </>
        )}

        {/* Chat CTA */}
        {latestTest && (
          <TouchableOpacity
            onPress={() => router.push({ pathname: '/(tabs)/chat', params: { testId: latestTest.id } })}
            style={{
              backgroundColor: COLORS.primary,
              borderRadius: 14,
              paddingVertical: 14,
              alignItems: 'center',
              marginTop: 8,
            }}
            activeOpacity={0.85}
          >
            <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '700' }}>
              Ask Maya for more guidance
            </Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
