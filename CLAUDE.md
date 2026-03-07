# LactiKit — Claude Code Project Context

## Project
NurtureScan / LactiKit: React Native (Expo) hackathon MVP for maternal nutritional health triage.

## Tech Stack
- Expo SDK 52, TypeScript, Expo Router v4 (file-based routing)
- NativeWind v4 (Tailwind CSS for RN) — use Tailwind classes for ALL styling
- expo-camera for scan screen
- react-native-reanimated for animations
- @google/generative-ai for Gemini API (model: gemini-2.0-flash)
- No backend — API key in .env as EXPO_PUBLIC_GEMINI_API_KEY

## App Flow
Home → Scan (camera + 3s fake analysis) → Results (Iron + B12 warnings) → Chat (Nurse Maya AI)

## Folder Structure
```
app/          # Expo Router screens: _layout, index, scan, results, chat
components/   # ui/ (Button, Card, Badge), scan/, results/, chat/
lib/          # gemini.ts (API client), systemPrompt.ts, constants.ts
hooks/        # useChat.ts, useAnalyzing.ts
types/        # index.ts (Message, ChatPhase, ScanResult, Deficiency)
```

## Key Conventions
- NativeWind Tailwind classes only — no StyleSheet.create() for layout/color
- All screens use `router.push()` / `router.replace()` from expo-router
- Shared types live in `types/index.ts` — import from there, never redefine
- Shared constants (colors, fake scan data, timing) live in `lib/constants.ts`
- Gemini model: `gemini-2.0-flash` (fast for demos)
- API key accessed via `process.env.EXPO_PUBLIC_GEMINI_API_KEY`

## Color Palette
- Primary: `#7C3AED` (deep purple)
- Warning: `#F59E0B` (amber)
- Danger: `#EF4444` (red)
- Background: `#F5F0FF` (soft lavender)
- Surface: `#FFFFFF`

## Multi-Agent Coordination
Agents communicate via `MULTI_AGENT_PLAN.md` at project root.
Each agent owns specific files — do NOT touch files owned by other agents.
