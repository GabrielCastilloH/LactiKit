import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { ScanOverlay } from '../../components/scan/ScanOverlay';
import { AnalyzingModal } from '../../components/scan/AnalyzingModal';
import { useAnalyzing } from '../../hooks/useAnalyzing';
import { captureRef } from '../../utils/cameraCapture';
import { COLORS } from '../../lib/constants';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useAnalyzing(isAnalyzing);

  useFocusEffect(
    useCallback(() => {
      captureRef.current = () => { if (!isAnalyzing) setIsAnalyzing(true); };
      return () => { captureRef.current = null; };
    }, [isAnalyzing])
  );

  if (!permission) {
    return <View className="flex-1" style={{ backgroundColor: COLORS.background }} />;
  }

  if (!permission.granted) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center" style={{ backgroundColor: COLORS.background }}>
        <Text className="text-lg font-semibold text-center mb-2" style={{ color: '#1F2937' }}>
          Camera access needed
        </Text>
        <Text className="text-sm text-center mb-6 px-8" style={{ color: '#6B7280' }}>
          LactiKit needs camera access to scan your milk sample.
        </Text>
        <TouchableOpacity
          onPress={requestPermission}
          className="rounded-xl px-6 py-3"
          style={{ backgroundColor: COLORS.primary }}
        >
          <Text className="text-white font-semibold text-base">Grant Permission</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <View className="flex-1 bg-black">
      {/* Full-screen camera */}
      <CameraView className="flex-1" facing="back" />

      {/* Scan overlay (dark borders + corner brackets + scan line) */}
      <ScanOverlay />

      {/* Bottom controls */}
      <SafeAreaView
        edges={['bottom']}
        className="absolute bottom-0 left-0 right-0 items-center pb-8"
      >
        <Text className="text-white text-base font-medium mb-5 tracking-wide">
          Scan Milk Sample
        </Text>
        <TouchableOpacity
          onPress={() => setIsAnalyzing(true)}
          disabled={isAnalyzing}
          className="items-center justify-center rounded-full"
          style={{
            width: 64,
            height: 64,
            backgroundColor: '#FFFFFF',
          }}
        >
          <Text style={{ fontSize: 28, color: COLORS.primary }}>⦿</Text>
        </TouchableOpacity>
      </SafeAreaView>

      {/* Analyzing modal — rendered on top of everything */}
      <AnalyzingModal visible={isAnalyzing} />
    </View>
  );
}
