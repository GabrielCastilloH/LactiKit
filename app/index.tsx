import { useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';

export default function HomeScreen() {
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5F0FF' }}>
      <View className="flex-1 px-6 pt-10 pb-6">
        {/* Header */}
        <View className="items-center mb-12">
          <Text
            className="text-4xl font-bold mb-2"
            style={{ color: '#7C3AED' }}
          >
            LactiKit
          </Text>
          <Text className="text-base text-gray-500 text-center">
            Maternal Nutritional Health Triage
          </Text>
        </View>

        {/* Scan Button */}
        <View className="flex-1 items-center justify-center">
          <Animated.View style={animatedStyle}>
            <TouchableOpacity
              onPress={() => router.push('/scan')}
              className="w-48 h-48 rounded-full items-center justify-center shadow-lg"
              style={{ backgroundColor: '#7C3AED' }}
              activeOpacity={0.85}
            >
              <Text className="text-6xl mb-2">📷</Text>
              <Text className="text-white font-semibold text-base">
                Tap to Scan
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Recent Scan Card */}
        <Card className="mt-8">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-semibold text-gray-800">
              Recent Scan
            </Text>
            <Text className="text-sm text-gray-400">Feb 28, 2026</Text>
          </View>
          <View className="flex-row gap-2 mb-3">
            <Badge label="Calcium" variant="success" />
            <Badge label="Vitamin D" variant="success" />
          </View>
          <Text className="text-sm text-gray-500">All markers normal</Text>
        </Card>
      </View>
    </SafeAreaView>
  );
}
