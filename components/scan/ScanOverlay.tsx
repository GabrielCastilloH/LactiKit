import React, { useEffect } from 'react';
import { View, Dimensions } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const WINDOW_SIZE = 280;
const { width, height } = Dimensions.get('window');

export function ScanOverlay() {
  const scanLineY = useSharedValue(0);

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

  const horizontalOverlayHeight = (height - WINDOW_SIZE) / 2;
  const sideOverlayWidth = (width - WINDOW_SIZE) / 2;

  return (
    <View className="absolute inset-0">
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
