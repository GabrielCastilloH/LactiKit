import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useLocalSearchParams } from 'expo-router';
import { useChat } from '../../hooks/useChat';
import { useTestHistory } from '../../context/ScanHistoryContext';
import { MessageBubble } from '../../components/chat/MessageBubble';
import { TypingIndicator } from '../../components/chat/TypingIndicator';
import { ChatInput } from '../../components/chat/ChatInput';
import { Message } from '../../types';
import { COLORS } from '../../lib/constants';

const RECIPES = [
  {
    emoji: '🥣',
    name: 'Hydration Lentil Soup',
    description: 'Red lentils, celery & parsley • Rich in protein & fluid balance',
  },
  {
    emoji: '🫐',
    name: 'Vitamin C Berry Bowl',
    description: 'Mixed berries, kiwi & orange • Vitamin C powerhouse',
  },
  {
    emoji: '🥚',
    name: 'Protein Egg Scramble',
    description: 'Eggs, spinach & feta • Calcium + protein boost',
  },
];

export default function ChatScreen() {
  const { testId } = useLocalSearchParams<{ testId?: string }>();
  const { getTest } = useTestHistory();
  const testContext = testId ? (getTest(testId) ?? null) : null;

  const { messages, sendMessage, clearChat, isStreaming, chatPhase, clinicalSummary, streamingText } =
    useChat(testContext);
  const tabBarHeight = useBottomTabBarHeight();
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isStreaming, streamingText]);

  const streamingMessage: Message | null =
    isStreaming && streamingText
      ? { id: 'streaming', role: 'assistant', content: streamingText, timestamp: new Date() }
      : null;

  const renderItem = ({ item }: { item: Message }) => <MessageBubble message={item} />;

  const ListFooter = () => (
    <>
      {isStreaming && streamingMessage && <MessageBubble message={streamingMessage} />}
      {isStreaming && !streamingText && <TypingIndicator />}

      {chatPhase === 'recipe' && (
        <View style={{ marginTop: 16, marginBottom: 8 }}>
          <Text style={{ fontSize: 13, fontWeight: '600', color: '#4B5563', marginBottom: 12, paddingHorizontal: 4 }}>
            Recommended for You
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {RECIPES.map((recipe, index) => (
              <View
                key={index}
                style={{
                  width: 200,
                  backgroundColor: COLORS.surface,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 16,
                  padding: 14,
                  marginRight: 12,
                }}
              >
                <Text style={{ fontSize: 36, marginBottom: 8 }}>{recipe.emoji}</Text>
                <Text style={{ fontWeight: '700', color: '#111827', fontSize: 13, marginBottom: 4 }}>{recipe.name}</Text>
                <Text style={{ color: '#4B5563', fontSize: 12, lineHeight: 18 }}>{recipe.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {chatPhase === 'referral' && (
        <View
          style={{
            marginTop: 16,
            marginBottom: 8,
            borderRadius: 16,
            padding: 16,
            borderWidth: 1.5,
            borderColor: COLORS.danger,
            backgroundColor: '#FFF5F5',
          }}
        >
          <Text style={{ fontWeight: '700', fontSize: 15, color: COLORS.danger, marginBottom: 4 }}>
            ⚕ Clinical Referral Recommended
          </Text>
          <Text style={{ color: '#4B5563', fontSize: 13, marginBottom: 12 }}>
            Nurse Maya recommends consulting a healthcare provider
          </Text>
          {clinicalSummary.length > 0 && (
            <View style={{ backgroundColor: COLORS.tabBar, borderRadius: 10, padding: 12, marginBottom: 12 }}>
              <Text style={{ color: '#374151', fontSize: 13, lineHeight: 20 }}>{clinicalSummary}</Text>
            </View>
          )}
          <TouchableOpacity
            style={{ borderWidth: 1.5, borderColor: COLORS.danger, borderRadius: 10, paddingVertical: 10, alignItems: 'center' }}
          >
            <Text style={{ fontWeight: '600', fontSize: 13, color: COLORS.danger }}>Find a Clinic</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }} edges={['top']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* Header */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            backgroundColor: COLORS.background,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.border,
          }}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.tabBar,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 20 }}>👩‍⚕️</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: '700', fontSize: 15, color: COLORS.primary }}>Nurse Maya</Text>
            <Text style={{ fontSize: 11, color: '#4B5563' }}>AI Maternal Health Nurse</Text>
          </View>
          <TouchableOpacity onPress={clearChat} hitSlop={8}>
            <Text style={{ fontSize: 12, fontWeight: '600', color: COLORS.primary }}>Clear</Text>
          </TouchableOpacity>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={ListFooter}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}
          style={{ backgroundColor: COLORS.background }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        <View style={{ paddingBottom: tabBarHeight + 16, backgroundColor: COLORS.surface }}>
          <ChatInput onSend={sendMessage} disabled={isStreaming} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
