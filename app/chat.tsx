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
import { useChat } from '../hooks/useChat';
import { MessageBubble } from '../components/chat/MessageBubble';
import { TypingIndicator } from '../components/chat/TypingIndicator';
import { ChatInput } from '../components/chat/ChatInput';
import { Message } from '../types';

const RECIPES = [
  {
    emoji: '🥣',
    name: 'Iron-Rich Lentil Soup',
    description: 'Red lentils, spinach & cumin • Rich in iron & folate',
  },
  {
    emoji: '🐟',
    name: 'B12 Salmon Bowl',
    description: 'Grilled salmon, brown rice & edamame • High in B12 & omega-3',
  },
  {
    emoji: '🥚',
    name: 'Spinach Egg Scramble',
    description: 'Eggs, baby spinach & feta • Iron + B12 powerhouse',
  },
];

export default function ChatScreen() {
  const { messages, sendMessage, isStreaming, chatPhase, clinicalSummary, streamingText } = useChat();
  const flatListRef = useRef<FlatList<Message>>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
    return () => clearTimeout(timer);
  }, [messages, isStreaming, streamingText]);

  const streamingMessage: Message | null =
    isStreaming && streamingText
      ? {
          id: 'streaming',
          role: 'assistant',
          content: streamingText,
          timestamp: new Date(),
        }
      : null;

  const renderItem = ({ item }: { item: Message }) => <MessageBubble message={item} />;

  const ListFooter = () => (
    <>
      {isStreaming && streamingMessage && <MessageBubble message={streamingMessage} />}
      {isStreaming && !streamingText && <TypingIndicator />}

      {chatPhase === 'recipe' && (
        <View className="mt-4 mb-2">
          <Text className="text-sm font-semibold text-gray-500 mb-3 px-1">
            Recommended Recipes for You
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {RECIPES.map((recipe, index) => (
              <View
                key={index}
                className="bg-white rounded-2xl p-4 mr-3"
                style={{
                  width: 200,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.08,
                  shadowRadius: 8,
                  elevation: 3,
                }}
              >
                <Text style={{ fontSize: 36 }} className="mb-2">
                  {recipe.emoji}
                </Text>
                <Text className="font-bold text-gray-800 text-sm mb-1">{recipe.name}</Text>
                <Text className="text-gray-500 text-xs leading-5">{recipe.description}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {chatPhase === 'referral' && (
        <View
          className="mt-4 mb-2 rounded-2xl p-4"
          style={{
            borderWidth: 1.5,
            borderColor: '#EF4444',
            backgroundColor: '#FFF5F5',
          }}
        >
          <Text className="font-bold text-base mb-1" style={{ color: '#EF4444' }}>
            ⚕ Clinical Referral Recommended
          </Text>
          <Text className="text-gray-600 text-sm mb-3">
            Nurse Maya recommends consulting a healthcare provider
          </Text>
          {clinicalSummary.length > 0 && (
            <View className="bg-gray-100 rounded-xl p-3 mb-3">
              <Text className="text-gray-700 text-sm leading-5">{clinicalSummary}</Text>
            </View>
          )}
          <TouchableOpacity
            className="rounded-xl py-3 items-center"
            style={{ borderWidth: 1.5, borderColor: '#EF4444' }}
          >
            <Text className="font-semibold text-sm" style={{ color: '#EF4444' }}>
              Find a Clinic
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#F5F0FF' }} edges={['top']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View
          className="flex-row items-center px-4 py-3 border-b border-gray-100"
          style={{ backgroundColor: '#F5F0FF' }}
        >
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: '#EDE9FE' }}
          >
            <Text style={{ fontSize: 20 }}>👩‍⚕️</Text>
          </View>
          <View className="flex-1">
            <Text className="font-bold text-base" style={{ color: '#7C3AED' }}>
              Nurse Maya
            </Text>
            <Text className="text-xs text-gray-500">AI Maternal Health Nurse</Text>
          </View>
          <View className="flex-row items-center">
            <View
              className="w-2.5 h-2.5 rounded-full mr-1"
              style={{ backgroundColor: '#10B981' }}
            />
            <Text className="text-xs text-gray-500">Online</Text>
          </View>
        </View>

        {/* Message List */}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ListFooterComponent={ListFooter}
          contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}
          style={{ backgroundColor: '#F5F0FF' }}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
          showsVerticalScrollIndicator={false}
        />

        {/* Input */}
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
