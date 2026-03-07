import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text } from 'react-native';
import { COLORS } from '../../lib/constants';

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
    <View
      className="flex-row items-center px-4 py-3"
      style={{ backgroundColor: COLORS.surface, borderTopWidth: 1, borderTopColor: COLORS.border }}
    >
      <TextInput
        className="flex-1 rounded-full px-4 py-3 text-base text-gray-800 mr-3"
        style={{ backgroundColor: COLORS.tabBar, textAlignVertical: 'center' }}
        placeholder="Ask Nurse Maya..."
        placeholderTextColor={COLORS.tabInactive}
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
        style={{ backgroundColor: canSend ? COLORS.primary : COLORS.border }}
      >
        <Text style={{ color: canSend ? '#FFFFFF' : COLORS.tabInactive, fontSize: 18 }}>{'→'}</Text>
      </TouchableOpacity>
    </View>
  );
}
