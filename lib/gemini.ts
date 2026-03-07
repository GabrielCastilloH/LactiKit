import { GoogleGenerativeAI } from '@google/generative-ai';
import { Message, TestResult } from '../types';
import { TEST_TYPE_LABELS } from './constants';

const genAI = new GoogleGenerativeAI(process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '');

export async function streamChatCompletion(
  messages: Message[],
  systemPrompt: string,
  onChunk: (chunk: string) => void
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash-lite',
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

export async function generateTestOverview(
  test: TestResult,
  surveyAnswers: Record<string, string | string[]>,
  onChunk: (chunk: string) => void
): Promise<string> {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

  const testLabel = TEST_TYPE_LABELS[test.testType] ?? test.testType;
  const biomarkerLines = test.biomarkers
    .map(b => `- ${b.displayName}: ${b.detected} ${b.unit} (${b.level}) — normal range: ${b.normalMin}–${b.normalMax}`)
    .join('\n');
  const surveyLines = Object.entries(surveyAnswers)
    .map(([q, a]) => `- ${q}: ${Array.isArray(a) ? a.join(', ') : a}`)
    .join('\n');

  const prompt = `You are a maternal health AI. A user completed an at-home ${testLabel} test.

Test results:
${biomarkerLines}

User survey answers:
${surveyLines}

Write a 3–4 sentence personalized health overview for this user. Be warm, specific to their results and diet, and give one actionable tip. Do not recommend specific medications.`;

  const result = await model.generateContent(prompt);
  const fullText = result.response.text();
  onChunk(fullText);
  return fullText;
}
