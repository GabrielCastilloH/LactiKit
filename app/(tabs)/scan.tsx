import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutChangeEvent } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useFocusEffect } from 'expo-router';
import { ScanOverlay } from '../../components/scan/ScanOverlay';
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

  // LOG: surface all inset/dimension info to understand the gap
  console.log('[SCAN] useSafeAreaInsets:', JSON.stringify(insets));

  const onRootLayout = useCallback((e: LayoutChangeEvent) => {
    console.log('[SCAN] root View layout:', JSON.stringify(e.nativeEvent.layout));
  }, []);

  const onCameraLayout = useCallback((e: LayoutChangeEvent) => {
    console.log('[SCAN] CameraView layout:', JSON.stringify(e.nativeEvent.layout));
  }, []);

  const handleComplete = useCallback(() => {
    const date = new Date().toISOString().split('T')[0];
    addTest({
      date,
      testType: 'mom_urine',
      biomarkers: [
        {
          name: 'leukocytes_nitrites',
          displayName: 'Leukocytes/Nitrites',
          unit: 'LEU/µL',
          detected: 15,
          normalMin: 0,
          normalMax: 25,
          level: 'normal',
        },
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
          name: 'vitamin_c',
          displayName: 'Vitamin C',
          unit: 'mg/dL',
          detected: 8,
          normalMin: 10,
          normalMax: 40,
          level: 'low',
        },
      ],
    });
    router.replace('/(tabs)/');
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
        <Text style={{ fontSize: 14, textAlign: 'center', marginBottom: 24, paddingHorizontal: 32, color: '#6B7280' }}>
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

  // APPROACH: Drop SafeAreaView entirely for the camera screen.
  // SafeAreaView with edges=['bottom'] adds bottom padding = home-indicator height,
  // which creates an opaque black gap between the camera and the tab bar.
  // We manually apply only the top inset so the camera view fills all the way
  // down to (and flush against) the tab bar.
  // ROOT container: DEBUG YELLOW so the insets.top padding strip is visible
  return (
    <View
      style={{ flex: 1, backgroundColor: 'yellow', paddingTop: insets.top }}
      onLayout={onRootLayout}
    >
      <CameraView
        style={{ flex: 1 }}
        facing="back"
        onLayout={onCameraLayout}
      />
      <ScanOverlay />
      <AnalyzingModal visible={isAnalyzing} />
    </View>
  );
}
