import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';

type ChatInputProps = {
  onSend: (text: string) => void;
  disabled?: boolean;
};

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim() || disabled) return;
    onSend(text.trim());
    setText('');
  };

  const canSend = text.trim().length > 0 && !disabled;

  return (
    <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-200">
      <TextInput
        className="flex-1 bg-gray-100 rounded-full px-4 py-3 text-base text-gray-800 mr-3"
        placeholder="Ask Nurse Maya..."
        placeholderTextColor="#9CA3AF"
        value={text}
        onChangeText={setText}
        editable={!disabled}
        onSubmitEditing={handleSend}
        returnKeyType="send"
        multiline={false}
      />
      <TouchableOpacity
        onPress={handleSend}
        disabled={!canSend}
        className="w-12 h-12 rounded-full items-center justify-center"
        style={{ backgroundColor: canSend ? '#7C3AED' : '#E5E7EB' }}
      >
        <Text style={{ color: canSend ? '#FFFFFF' : '#9CA3AF', fontSize: 18 }}>{'→'}</Text>
      </TouchableOpacity>
    </View>
  );
}
