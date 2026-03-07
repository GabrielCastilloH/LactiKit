import React, { useEffect, useState, useCallback } from 'react';
import { View, Dimensions, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const WINDOW_SIZE = 280;
// Fallback to window dims but we'll override with actual layout measurement
const screenDims = Dimensions.get('window');

export function ScanOverlay() {
  const scanLineY = useSharedValue(0);
  // Use actual container size measured via onLayout instead of Dimensions.get('window').
  // Dimensions.get('window') returns full screen height, but the camera renders in a
  // smaller area (above the tab bar), so centering based on window height was wrong.
  const [containerSize, setContainerSize] = useState({
    width: screenDims.width,
    height: screenDims.height,
  });

  const onContainerLayout = useCallback((e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    console.log('[SCAN_OVERLAY] container layout:', JSON.stringify({ width, height }));
    console.log('[SCAN_OVERLAY] Dimensions.window:', JSON.stringify(screenDims));
    setContainerSize({ width, height });
  }, []);

  useEffect(() => {
    scanLineY.value = withRepeat(
      withTiming(WINDOW_SIZE - 4, { duration: 2000, easing: Easing.linear }),
      -1,
      false
    );
  }, []);

  const scanLineStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: scanLineY.value }],
  }));

  const horizontalOverlayHeight = (containerSize.height - WINDOW_SIZE) / 2;
  const sideOverlayWidth = (containerSize.width - WINDOW_SIZE) / 2;

  console.log('[SCAN_OVERLAY] computed overlay heights:', {
    horizontalOverlayHeight,
    sideOverlayWidth,
    containerHeight: containerSize.height,
    containerWidth: containerSize.width,
  });

  return (
    <View className="absolute inset-0" onLayout={onContainerLayout}>
      {/* Top overlay — DEBUG: BLUE */}
      <View
        style={{ height: horizontalOverlayHeight, backgroundColor: 'rgba(0,0,255,0.5)' }}
        className="w-full"
      />
      {/* Middle row */}
      <View className="flex-row" style={{ height: WINDOW_SIZE }}>
        {/* Left overlay — DEBUG: GREEN */}
        <View style={{ width: sideOverlayWidth, backgroundColor: 'rgba(0,200,0,0.5)' }} />
        {/* Scan window — DEBUG: transparent (camera shows through) */}
        <View style={{ width: WINDOW_SIZE, height: WINDOW_SIZE, overflow: 'hidden' }}>
          {/* Top-left corner bracket */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: 20,
              height: 20,
              borderTopWidth: 3,
              borderLeftWidth: 3,
              borderColor: 'white',
            }}
          />
          {/* Top-right corner bracket */}
          <View
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: 20,
              height: 20,
              borderTopWidth: 3,
              borderRightWidth: 3,
              borderColor: 'white',
            }}
          />
          {/* Bottom-left corner bracket */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: 20,
              height: 20,
              borderBottomWidth: 3,
              borderLeftWidth: 3,
              borderColor: 'white',
            }}
          />
          {/* Bottom-right corner bracket */}
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 20,
              height: 20,
              borderBottomWidth: 3,
              borderRightWidth: 3,
              borderColor: 'white',
            }}
          />
          {/* Animated scan line */}
          <Animated.View
            style={[
              {
                position: 'absolute',
                left: 0,
                right: 0,
                height: 2,
                backgroundColor: '#8B6B8B',
              },
              scanLineStyle,
            ]}
          />
        </View>
        {/* Right overlay — DEBUG: ORANGE */}
        <View style={{ flex: 1, backgroundColor: 'rgba(255,165,0,0.5)' }} />
      </View>
      {/* Bottom overlay — DEBUG: RED — flex:1 fills whatever remains */}
      <View style={{ flex: 1, backgroundColor: 'rgba(255,0,0,0.5)' }} />
    </View>
  );
}
