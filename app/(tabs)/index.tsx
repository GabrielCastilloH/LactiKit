import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { COLORS } from '../../lib/constants';

const NEXT_STEPS = [
  {
    emoji: '💉',
    title: 'Schedule B12 Check',
    description: 'Book a follow-up blood test to monitor your Vitamin B12 levels.',
  },
  {
    emoji: '🥬',
    title: 'Iron-Rich Meals This Week',
    description: 'Add lentils, spinach, and lean red meat to your daily meals.',
  },
  {
    emoji: '💧',
    title: 'Log Your Water Intake',
    description: 'Stay hydrated — aim for 8–10 glasses per day while breastfeeding.',
  },
];

const PAST_SCANS = [
  {
    date: 'Mar 5, 2026',
    deficiencies: ['Iron', 'Vitamin B12'],
    allNormal: false,
  },
  {
    date: 'Feb 28, 2026',
    deficiencies: ['Calcium', 'Vitamin D'],
    allNormal: true,
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: COLORS.background }}>
      <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-6 pb-4">
          <Text className="text-base text-gray-500 mb-1">Good morning 👋</Text>
          <Text className="text-3xl font-bold" style={{ color: COLORS.primary }}>
            LactiKit
          </Text>
          <Text className="text-sm text-gray-400 mt-1">Maternal Nutritional Health Triage</Text>
        </View>

        {/* AI Next Steps */}
        <View className="mb-6">
          <Text className="text-base font-semibold text-gray-700 mb-3">AI Recommendations</Text>
          {NEXT_STEPS.map((step, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              className="flex-row items-start rounded-2xl p-4 mb-2"
              style={{
                backgroundColor: COLORS.surface,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
            >
              <Text style={{ fontSize: 28 }} className="mr-3">
                {step.emoji}
              </Text>
              <View className="flex-1">
                <Text className="font-semibold text-gray-800 text-sm mb-0.5">{step.title}</Text>
                <Text className="text-gray-500 text-xs leading-5">{step.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Past Scans */}
        <View className="mb-8">
          <Text className="text-base font-semibold text-gray-700 mb-3">Past Scans</Text>
          {PAST_SCANS.map((scan, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={0.75}
              onPress={() => router.push('/(tabs)/results')}
            >
              <Card className="mb-2">
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-sm font-semibold text-gray-800">Scan Results</Text>
                  <Text className="text-xs text-gray-400">{scan.date}</Text>
                </View>
                {scan.allNormal ? (
                  <Text className="text-xs text-gray-500">All markers normal</Text>
                ) : (
                  <View className="flex-row flex-wrap gap-2">
                    {scan.deficiencies.map((d) => (
                      <Badge key={d} label={d} variant="warning" />
                    ))}
                  </View>
                )}
              </Card>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
