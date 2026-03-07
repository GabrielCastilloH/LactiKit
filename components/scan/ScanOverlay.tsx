import React, { useEffect, useState } from 'react';
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

  const onContainerLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setContainerSize({ width, height });
  };

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

  return (
    <View className="absolute inset-0" onLayout={onContainerLayout}>
      {/* Top overlay */}
      <View
        style={{ height: horizontalOverlayHeight, backgroundColor: 'rgba(0,0,0,0.7)' }}
        className="w-full"
      />
      {/* Middle row */}
      <View className="flex-row" style={{ height: WINDOW_SIZE }}>
        {/* Left overlay */}
        <View style={{ width: sideOverlayWidth, backgroundColor: 'rgba(0,0,0,0.7)' }} />
        {/* Scan window */}
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
        {/* Right overlay */}
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }} />
      </View>
      {/* Bottom overlay */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)' }} />
    </View>
  );
}
