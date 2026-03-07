import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SCAN_RESULT, COLORS } from '../lib/constants';
import { DeficiencyCard } from '../components/results/DeficiencyCard';
import { useScanHistory } from '../context/ScanHistoryContext';

export default function ResultsScreen() {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const { scanId } = useLocalSearchParams<{ scanId: string }>();
  const { getScan } = useScanHistory();

  const resolvedId = Array.isArray(scanId) ? scanId[0] : scanId;
  const scanData = (resolvedId ? getScan(resolvedId) : undefined) ?? SCAN_RESULT;

  const formattedDate = new Date(scanData.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const deficiencyCount = scanData.deficiencies.filter((d) => d.level !== 'normal').length;

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Non-scrolling header */}
      <View
        style={{
          borderBottomWidth: 1,
          borderBottomColor: COLORS.border,
          backgroundColor: COLORS.background,
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 14,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          className="flex-row items-center mb-3"
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={20} color={COLORS.primary} />
          <Text className="text-sm font-medium ml-0.5" style={{ color: COLORS.primary }}>
            Back
          </Text>
        </TouchableOpacity>
        <Text className="text-2xl font-bold" style={{ color: '#111827' }}>
          Scan Results
        </Text>
        <Text className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
          Scanned on {formattedDate}
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card */}
        <View
          className="rounded-2xl p-4 mb-5 flex-row items-center"
          style={{
            backgroundColor: '#FFF1F1',
            borderWidth: 1,
            borderColor: COLORS.danger + '40',
          }}
        >
          <View
            className="rounded-full items-center justify-center mr-4"
            style={{
              width: 52,
              height: 52,
              backgroundColor: COLORS.danger,
            }}
          >
            <Text className="text-white text-xl font-bold">{deficiencyCount}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold" style={{ color: '#111827' }}>
              {deficiencyCount} {deficiencyCount === 1 ? 'Deficiency' : 'Deficiencies'} Detected
            </Text>
            <Text className="text-xs mt-0.5" style={{ color: '#6B7280' }}>
              Review the markers below for details
            </Text>
          </View>
        </View>

        {/* Section label */}
        <Text
          className="text-xs font-semibold mb-3 tracking-widest"
          style={{ color: '#9CA3AF' }}
        >
          NUTRIENT MARKERS
        </Text>

        {/* Deficiency cards */}
        {scanData.deficiencies.map((deficiency) => (
          <DeficiencyCard key={deficiency.nutrient} deficiency={deficiency} />
        ))}

        {/* Accordion: What does this mean? */}
        <View
          className="rounded-xl overflow-hidden mb-6"
          style={{
            backgroundColor: COLORS.surface,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <TouchableOpacity
            onPress={() => setAccordionOpen((o) => !o)}
            className="flex-row items-center justify-between px-4 py-4"
            activeOpacity={0.7}
          >
            <Text className="text-base font-semibold" style={{ color: '#111827' }}>
              What does this mean?
            </Text>
            <Text className="text-lg" style={{ color: COLORS.primary }}>
              {accordionOpen ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {accordionOpen && (
            <View
              className="px-4 pb-4"
              style={{ borderTopWidth: 1, borderTopColor: COLORS.border, paddingTop: 12 }}
            >
              <Text className="text-sm font-semibold mb-1" style={{ color: COLORS.danger }}>
                Iron Deficiency
              </Text>
              <Text className="text-sm mb-4" style={{ color: '#374151', lineHeight: 20 }}>
                Low iron levels in breast milk can affect your baby's cognitive development and
                immune function. Nursing mothers are at higher risk of iron deficiency due to
                postpartum blood loss and increased nutritional demands.
              </Text>
              <Text className="text-sm font-semibold mb-1" style={{ color: COLORS.danger }}>
                Vitamin B12 Deficiency
              </Text>
              <Text className="text-sm" style={{ color: '#374151', lineHeight: 20 }}>
                Vitamin B12 is critical for your baby's neurological development. Deficiency in
                breast milk can lead to developmental delays. This is especially common in mothers
                following plant-based diets. Supplementation is often recommended.
              </Text>
            </View>
          )}
        </View>

        {/* CTA section */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chat')}
          className="w-full rounded-xl py-4 items-center mb-2"
          style={{ backgroundColor: COLORS.primary }}
          activeOpacity={0.85}
        >
          <Text className="text-white text-base font-semibold">Chat with Maya</Text>
        </TouchableOpacity>
        <Text className="text-xs text-center" style={{ color: '#9CA3AF' }}>
          Get personalized dietary advice from Nurse Maya
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
