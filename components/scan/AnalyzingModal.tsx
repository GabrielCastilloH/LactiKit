import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  visible: boolean;
};

export function AnalyzingModal({ visible }: Props) {
  const rotation = useSharedValue(0);
  const [dots, setDots] = useState('.');

  useEffect(() => {
    if (!visible) return;

    rotation.value = withRepeat(
      withTiming(360, { duration: 1500, easing: Easing.linear }),
      -1,
      false
    );

    const interval = setInterval(() => {
      setDots((d) => (d.length >= 3 ? '.' : d + '.'));
    }, 500);

    return () => clearInterval(interval);
  }, [visible]);

  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  if (!visible) return null;

  return (
    <View
      className="absolute inset-0 items-center justify-center"
      style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
    >
      <Animated.View
        style={[
          spinStyle,
          {
            width: 80,
            height: 80,
            borderRadius: 40,
            borderWidth: 4,
            borderColor: 'rgba(139,107,139,0.3)',
            borderTopColor: '#8B6B8B',
            marginBottom: 24,
          },
        ]}
      />
      <Text className="text-white text-2xl font-semibold mb-2">
        Analyzing{dots}
      </Text>
      <Text className="text-gray-400 text-sm">Powered by LactiKit AI</Text>
    </View>
  );
}
