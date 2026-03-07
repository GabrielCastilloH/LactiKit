import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

function Dot({ delay }: { delay: number }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      translateY.value = withRepeat(
        withSequence(
          withTiming(-8, { duration: 300, easing: Easing.inOut(Easing.ease) }),
          withTiming(0, { duration: 300, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }, delay);
    return () => clearTimeout(timeout);
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          width: 8,
          height: 8,
          borderRadius: 4,
          backgroundColor: '#7C3AED',
          marginHorizontal: 3,
        },
      ]}
    />
  );
}

export function TypingIndicator() {
  return (
    <View className="flex-row items-center mb-3">
      <View className="bg-white rounded-2xl px-4 py-3 flex-row items-center" style={{ minHeight: 44 }}>
        <Text className="text-gray-500 text-sm mr-2">Nurse Maya</Text>
        <View className="flex-row items-center">
          <Dot delay={0} />
          <Dot delay={150} />
          <Dot delay={300} />
        </View>
      </View>
    </View>
  );
}
