import { useState, useCallback, useRef, useEffect } from 'react';
import { Message, ChatPhase, TestResult } from '../types';
import { streamChatCompletion } from '../lib/gemini';
import { buildSystemPrompt } from '../lib/testPrompt';
import { TEST_TYPE_LABELS } from '../lib/constants';

function buildInitialMessage(test: TestResult | null): Message {
  let content: string;
  if (test) {
    const label = TEST_TYPE_LABELS[test.testType] ?? test.testType;
    const flagged = test.biomarkers.filter(b => b.level !== 'normal');
    if (flagged.length > 0) {
      const names = flagged.map(b => b.displayName).join(' and ');
      content = `Hello! I'm Nurse Maya. I've reviewed your ${label} test results — I see ${names} ${flagged.length === 1 ? 'is' : 'are'} outside the normal range. I'd like to ask a couple of questions to better understand your situation. How have you been feeling lately?`;
    } else {
      content = `Hello! I'm Nurse Maya. Great news — your ${label} test results look healthy across all markers! I'd still love to chat if you have any questions or concerns. How are you feeling today?`;
    }
  } else {
    content = "Hello! I'm Nurse Maya, your AI maternal health assistant. I'm here to help you understand your LactiKit results and support your health journey. How are you feeling today?";
  }

  return {
    id: '1',
    role: 'assistant',
    content,
    timestamp: new Date(),
  };
}

export function useChat(testContext: TestResult | null = null) {
  const [messages, setMessages] = useState<Message[]>([buildInitialMessage(testContext)]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [chatPhase, setChatPhase] = useState<ChatPhase>('questioning');
  const [clinicalSummary, setClinicalSummary] = useState<string>('');
  const [streamingText, setStreamingText] = useState('');
  const assistantTurnCount = useRef(1);
  const systemPrompt = buildSystemPrompt(testContext);

  // Reset chat when the test context changes (e.g. navigating to chat from a different test)
  useEffect(() => {
    setMessages([buildInitialMessage(testContext)]);
    setChatPhase('questioning');
    setClinicalSummary('');
    setStreamingText('');
    assistantTurnCount.current = 1;
  }, [testContext?.id]);

  const clearChat = useCallback(() => {
    setMessages([buildInitialMessage(testContext)]);
    setChatPhase('questioning');
    setClinicalSummary('');
    setStreamingText('');
    assistantTurnCount.current = 1;
  }, [testContext]);

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
        systemPrompt,
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

      if (assistantTurnCount.current >= 4) {
        if (fullResponse.includes('CLINICAL_REFERRAL_NEEDED')) {
          const summaryMatch = fullResponse.match(/Clinical Summary:\s*([\s\S]+)/i);
          setClinicalSummary(summaryMatch ? summaryMatch[1].trim() : fullResponse);
          setChatPhase('referral');
        } else {
          setChatPhase('recipe');
        }
      }
    } catch (error) {
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
  }, [messages, isStreaming, systemPrompt]);

  return {
    messages,
    sendMessage,
    clearChat,
    isStreaming,
    chatPhase,
    clinicalSummary,
    streamingText,
  };
}
