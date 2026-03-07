import Animated, { FadeInDown } from 'react-native-reanimated';
import { View, Text } from 'react-native';
import { Message } from '../../types';

type Props = { message: Message };

export function MessageBubble({ message }: Props) {
  const isUser = message.role === 'user';
  return (
    <Animated.View entering={FadeInDown.duration(300)} className={`mb-3 ${isUser ? 'items-end' : 'items-start'}`}>
      <View
        className="rounded-2xl px-4 py-3"
        style={{
          maxWidth: '80%',
          backgroundColor: isUser ? '#7C3AED' : '#FFFFFF',
        }}
      >
        <Text style={{ color: isUser ? '#FFFFFF' : '#1F2937' }} className="text-base leading-6">
          {message.content}
        </Text>
      </View>
      <Text className="text-xs text-gray-400 mt-1 mx-1">
        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </Animated.View>
  );
}
