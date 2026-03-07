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

  const allHistory = messages.slice(0, -1).map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));
  // Gemini requires history to start with a 'user' turn — drop any leading model messages
  // (the initial Maya greeting lives in the system prompt context anyway)
  const firstUserIdx = allHistory.findIndex((m) => m.role === 'user');
  const history = firstUserIdx >= 0 ? allHistory.slice(firstUserIdx) : [];

  const lastMessage = messages[messages.length - 1];

  console.log('[gemini] startChat history length:', history.length, history.map(m => m.role));
  console.log('[gemini] sending message:', lastMessage.content.slice(0, 80));

  const chat = model.startChat({ history });

  // Hermes (React Native) lacks Web Streams (pipeThrough), so we use the non-streaming API
  // and simulate streaming by drip-feeding the response word by word.
  const result = await chat.sendMessage(lastMessage.content);
  const fullText = result.response.text();

  console.log('[gemini] response complete, length:', fullText.length);

  // Simulate streaming — emit ~4 words at a time with a small delay
  const words = fullText.split(' ');
  const chunkSize = 4;
  for (let i = 0; i < words.length; i += chunkSize) {
    const piece = words.slice(i, i + chunkSize).join(' ') + (i + chunkSize < words.length ? ' ' : '');
    onChunk(piece);
    await new Promise(res => setTimeout(res, 30));
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

  // Hermes lacks Web Streams — use non-streaming API and simulate word-by-word reveal
  const result = await model.generateContent(prompt);
  const fullText = result.response.text();

  const words = fullText.split(' ');
  const chunkSize = 4;
  for (let i = 0; i < words.length; i += chunkSize) {
    const piece = words.slice(i, i + chunkSize).join(' ') + (i + chunkSize < words.length ? ' ' : '');
    onChunk(piece);
    await new Promise(res => setTimeout(res, 30));
  }

  return fullText;
}
