import { Tabs, router, usePathname } from 'expo-router';
import { TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from '../../utils/cameraCapture';
import { COLORS } from '../../lib/constants';

function CenterTabButton({ onPress }: any) {
  const pathname = usePathname();
  const isOnScan = pathname.includes('scan');
  return (
    <TouchableOpacity
      onPress={() => {
        if (isOnScan && captureRef.current) captureRef.current();
        else router.navigate('/(tabs)/scan');
      }}
      activeOpacity={0.85}
      style={{ alignItems: 'center', justifyContent: 'center', top: -16 }}
    >
      <View
        style={{
          width: 72,
          height: 72,
          borderRadius: 36,
          borderWidth: 3,
          borderColor: COLORS.primary,
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 4,
          backgroundColor: COLORS.tabBar,
        }}
      >
        <View style={{ width: 54, height: 54, borderRadius: 27, backgroundColor: COLORS.primary }} />
      </View>
    </TouchableOpacity>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.tabActive,
        tabBarInactiveTintColor: COLORS.tabInactive,
        tabBarStyle: {
          backgroundColor: COLORS.tabBar,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          elevation: 0,
          shadowOpacity: 0,
          overflow: 'visible',
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '500' },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="scan"
        options={{
          title: '',
          tabBarButton: (props) => <CenterTabButton {...props} />,
          tabBarItemStyle: { overflow: 'visible', backgroundColor: 'transparent' },
          // APPROACH: position:absolute makes the tab bar float OVER the screen
          // content, so the camera can fill all the way to the bottom of the screen.
          // This means the camera renders behind the tab bar instead of stopping above it.
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'rgba(237,233,254,0.85)', // semi-transparent so you can see if camera shows through
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            elevation: 0,
            shadowOpacity: 0,
            overflow: 'visible',
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'Maya',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
