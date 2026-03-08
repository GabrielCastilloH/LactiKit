import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { AnalyzingModal } from '../../components/scan/AnalyzingModal';
import { useAnalyzing } from '../../hooks/useAnalyzing';
import { captureRef } from '../../utils/cameraCapture';
import { COLORS } from '../../lib/constants';
import { useTestHistory } from '../../context/ScanHistoryContext';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { addTest } = useTestHistory();
  const insets = useSafeAreaInsets();

  const handleComplete = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    const id = addTest({
      date,
      testType: 'mom_urine',
      biomarkers: [
        {
          name: 'specific_gravity',
          displayName: 'Specific Gravity',
          unit: 'g/mL',
          detected: 1.015,
          normalMin: 1.005,
          normalMax: 1.025,
          level: 'normal',
        },
        {
          name: 'ketones',
          displayName: 'Ketones',
          unit: 'mg/dL',
          detected: 6,
          normalMin: 0,
          normalMax: 10,
          level: 'normal',
        },
        {
          name: 'vitamin_c',
          displayName: 'Vitamin C',
          unit: 'mg/dL',
          detected: 8,
          normalMin: 10,
          normalMax: 40,
          level: 'low',
        },
        {
          name: 'protein',
          displayName: 'Protein',
          unit: 'mg/dL',
          detected: 5,
          normalMin: 0,
          normalMax: 14,
          level: 'normal',
        },
        {
          name: 'calcium_magnesium',
          displayName: 'Calcium/Magnesium',
          unit: 'mg/L',
          detected: 145,
          normalMin: 100,
          normalMax: 300,
          level: 'normal',
        },
        {
          name: 'ph_level',
          displayName: 'pH Level',
          unit: 'pH',
          detected: 6.5,
          normalMin: 4.5,
          normalMax: 8.0,
          level: 'normal',
        },
      ],
    });
    router.replace('/(tabs)/');
    router.push(`/test/${id}`);
  }, [addTest]);

  useAnalyzing(isAnalyzing, handleComplete);

  useFocusEffect(
    useCallback(() => {
      captureRef.current = () => { if (!isAnalyzing) setIsAnalyzing(true); };
      return () => { captureRef.current = null; };
    }, [isAnalyzing])
  );

  if (!permission) {
    return <View style={{ flex: 1, backgroundColor: COLORS.background }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: COLORS.background }}>
        <Text style={{ fontSize: 18, fontWeight: '600', textAlign: 'center', marginBottom: 8, color: '#1F2937' }}>
          Camera access needed
        </Text>
        <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 24, paddingHorizontal: 32, color: '#4B5563' }}>
          LactiKit needs camera access to scan your test strip.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          style={{ backgroundColor: COLORS.primary, borderRadius: 12, paddingHorizontal: 24, paddingVertical: 12 }}
        >
          <Text style={{ color: '#FFF', fontWeight: '600', fontSize: 16 }}>Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#000',
        paddingTop: insets.top,
      }}
    >
      <CameraView style={{ flex: 1 }} facing="back" />
      <AnalyzingModal visible={isAnalyzing} />
    </View>
  );
}
