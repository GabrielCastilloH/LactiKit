import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Stack } from 'expo-router';
import { ScanHistoryProvider } from '../context/ScanHistoryContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView className="flex-1">
      <SafeAreaProvider>
        <ScanHistoryProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="test/[id]" />
            <Stack.Screen name="health-advice" />
          </Stack>
        </ScanHistoryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
