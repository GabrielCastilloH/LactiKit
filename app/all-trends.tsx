import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../lib/constants';
import { useTestHistory } from '../context/ScanHistoryContext';
import { BiomarkerTrendChart } from '../components/charts/BiomarkerTrendChart';
import { BiomarkerName } from '../types';

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

export default function AllTrendsScreen() {
  const { tests } = useTestHistory();

  // Only show biomarkers that appear in at least one test
  const available = BIOMARKER_META.filter(meta =>
    tests.some(t => t.biomarkers.some(b => b.name === meta.name))
  );

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
        <Text style={{ fontSize: 20, fontWeight: '800', color: '#111827' }}>
          All Biomarker Trends
        </Text>
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
