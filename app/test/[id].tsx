import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTestHistory } from '../../context/ScanHistoryContext';
import { BiomarkerCard } from '../../components/results/BiomarkerCard';
import { COLORS, TEST_TYPE_LABELS } from '../../lib/constants';
import { TestType } from '../../types';

const TEST_TYPE_OVERVIEWS: Record<TestType, string> = {
  mom_urine:
    "A urine test gives us a window into your hydration, kidney health, and immune status. Elevated leukocytes or nitrites may signal an infection that needs attention, while low Vitamin C can reflect dietary gaps common in postpartum mothers. Staying hydrated and eating fresh fruits can support recovery significantly.",
  breastmilk:
    "Your breastmilk test reflects the nutritional quality of milk your baby is receiving. Protein levels support your baby's growth, while calcium and magnesium are crucial for bone development. pH within range indicates healthy milk composition. Small dietary adjustments can meaningfully improve these markers.",
  baby_urine:
    "Baby's urine provides early signals about hydration and kidney function. Elevated specific gravity suggests the baby may need more fluids. These markers change quickly with feeding adjustments, so re-testing in a few days after changes is encouraged.",
};

export default function TestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getTest } = useTestHistory();
  const test = getTest(id);

  if (!test) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ color: '#6B7280' }}>Test not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={{ marginTop: 16 }}>
          <Text style={{ color: COLORS.primary, fontWeight: '600' }}>Go Back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const label = TEST_TYPE_LABELS[test.testType] ?? test.testType;
  const formattedDate = new Date(test.date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
  const flaggedCount = test.biomarkers.filter(b => b.level !== 'normal').length;
  const overview = TEST_TYPE_OVERVIEWS[test.testType];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* Header */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 16,
          paddingVertical: 14,
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.surface,
        }}
      >
        <TouchableOpacity onPress={() => router.back()} hitSlop={8} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827' }}>{label} Test</Text>
          <Text style={{ fontSize: 12, color: '#6B7280' }}>{formattedDate}</Text>
        </View>
        {flaggedCount > 0 && (
          <View style={{ backgroundColor: COLORS.danger, borderRadius: 9999, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ color: '#FFF', fontSize: 11, fontWeight: '700' }}>{flaggedCount} flagged</Text>
          </View>
        )}
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16 }} showsVerticalScrollIndicator={false}>
        {/* AI Overview */}
        <View
          style={{
            backgroundColor: COLORS.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ fontSize: 18, marginRight: 8 }}>🩺</Text>
            <Text style={{ fontSize: 14, fontWeight: '700', color: COLORS.primary }}>AI Overview</Text>
          </View>
          <Text style={{ fontSize: 13, color: '#374151', lineHeight: 20 }}>{overview}</Text>
        </View>

        {/* Biomarkers */}
        <Text style={{ fontSize: 15, fontWeight: '700', color: '#111827', marginBottom: 12 }}>
          Biomarkers
        </Text>
        {test.biomarkers.map(b => (
          <BiomarkerCard key={b.name} biomarker={b} />
        ))}

        {/* CTA */}
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/(tabs)/chat', params: { testId: test.id } })}
          style={{
            backgroundColor: COLORS.primary,
            borderRadius: 14,
            paddingVertical: 14,
            alignItems: 'center',
            marginTop: 8,
            marginBottom: 24,
          }}
          activeOpacity={0.85}
        >
          <Text style={{ color: '#FFF', fontSize: 15, fontWeight: '700' }}>
            Chat with Maya about this test
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
