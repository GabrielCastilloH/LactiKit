import { useState, useCallback, useRef } from 'react';
import { Message, ChatPhase } from '../types';
import { streamChatCompletion } from '../lib/gemini';
import { SYSTEM_PROMPT } from '../lib/systemPrompt';

const INITIAL_MESSAGE: Message = {
  id: '1',
  role: 'assistant',
  content: "Hello! I'm Nurse Maya. I've reviewed your NurtureScan results showing low Iron and Vitamin B12 levels. I'd like to ask you a couple of questions to better understand your situation. How have you been feeling lately? Are you experiencing any fatigue, dizziness, or weakness?",
  timestamp: new Date(),
};

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatPhase, setChatPhase] = useState<ChatPhase>('questioning');
  const [clinicalSummary, setClinicalSummary] = useState<string>('');
  const [streamingText, setStreamingText] = useState('');
  const assistantTurnCount = useRef(1); // starts at 1 because of initial message

  const sendMessage = useCallback(async (userContent: string) => {
    if (isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userContent,
      timestamp: new Date(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsStreaming(true);
    setStreamingText('');

    try {
      let accumulated = '';
      const fullResponse = await streamChatCompletion(
        updatedMessages,
        SYSTEM_PROMPT,
        (chunk) => {
          accumulated += chunk;
          setStreamingText(accumulated);
        }
      );

      assistantTurnCount.current += 1;

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fullResponse,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStreamingText('');

      // Phase detection: after assistant has spoken 3+ times (initial + 2 follow-ups), check sentinel
      if (assistantTurnCount.current >= 3) {
        if (fullResponse.includes('CLINICAL_REFERRAL_NEEDED')) {
          const summaryMatch = fullResponse.match(/Clinical Summary:\s*([\s\S]+)/i);
          setClinicalSummary(summaryMatch ? summaryMatch[1].trim() : fullResponse);
          setChatPhase('referral');
        } else {
          setChatPhase('recipe');
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setStreamingText('');
    } finally {
      setIsStreaming(false);
    }
  }, [messages, isStreaming]);

  return {
    messages,
    sendMessage,
    isStreaming,
    chatPhase,
    clinicalSummary,
    streamingText,
  };
}
