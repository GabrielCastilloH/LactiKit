import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { SCAN_RESULT, COLORS } from '../lib/constants';
import { DeficiencyCard } from '../components/results/DeficiencyCard';

export default function ResultsScreen() {
  const [accordionOpen, setAccordionOpen] = useState(false);

  const formattedDate = new Date(SCAN_RESULT.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      {/* Warning banner */}
      <View
        className="w-full px-4 py-3 flex-row items-center justify-center"
        style={{ backgroundColor: COLORS.danger }}
      >
        <Text className="text-white text-sm font-semibold text-center">
          ⚠ Nutritional Deficiencies Detected
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Title + date */}
        <Text className="text-2xl font-bold mb-1" style={{ color: '#111827' }}>
          Scan Results
        </Text>
        <Text className="text-sm mb-6" style={{ color: '#6B7280' }}>
          Scanned on {formattedDate}
        </Text>

        {/* Deficiency cards */}
        {SCAN_RESULT.deficiencies.map((deficiency) => (
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

        {/* CTA button */}
        <TouchableOpacity
          onPress={() => router.push('/(tabs)/chat')}
          className="w-full rounded-xl py-4 items-center"
          style={{ backgroundColor: COLORS.primary }}
          activeOpacity={0.85}
        >
          <Text className="text-white text-base font-semibold">
            Talk to Nurse Maya →
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
