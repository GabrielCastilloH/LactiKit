import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message } from '../types';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '');

export async function streamChatCompletion(
  messages: Message[],
  systemPrompt: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  const history = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const lastMessage = messages[messages.length - 1];

  const chat = model.startChat({ history });

  const result = await chat.sendMessageStream(lastMessage.content);

  let fullText = '';
  for await (const chunk of result.stream) {
    const chunkText = chunk.text();
    fullText += chunkText;
    onChunk(chunkText);
  }

  return fullText;
}
