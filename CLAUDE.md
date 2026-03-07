# LactiKit — Claude Code Project Context

## Project
LactiKit: React Native (Expo) hackathon MVP for baby and maternal health tracking via at-home test kits (urine/breastmilk).

## Tech Stack
- Expo SDK 52, TypeScript, Expo Router v4 (file-based routing)
- NativeWind v4 (Tailwind CSS for RN) — use Tailwind classes for ALL styling
- expo-camera for scan screen
- react-native-reanimated for animations
- react-native-gifted-charts for charts (donut, line, bar)
- @google/generative-ai for Gemini API (model: gemini-2.5-flash-lite)
- No backend — API key in .env as EXPO_PUBLIC_GEMINI_API_KEY

## App Flow
Home (graphs + alerts + past tests) → Scan (camera + 3s fake analysis) → Home
Home → Test Detail (biomarker bars + AI overview) → Chat (Nurse Maya, test-aware)
Chat tab (no testId) → Maya gives generic greeting

## Test Types
- `mom_urine`: Specific Gravity, Ketones, Vitamin C, Protein, Calcium/Magnesium, pH Level
- `breastmilk`: Alcohol, pH Level, Vitamin C
- `baby_urine`: Specific Gravity, Ketones

## Folder Structure
```
app/              # Expo Router screens: _layout, (tabs)/index|scan|chat, test/[id]
components/       # ui/ (Button, Card, Badge), scan/, results/BiomarkerCard, chat/, charts/
lib/              # gemini.ts, testPrompt.ts, systemPrompt.ts (re-exports testPrompt), constants.ts
hooks/            # useChat.ts (testContext param), useAnalyzing.ts
types/            # index.ts (Message, MessageRole, ChatPhase, TestType, Biomarker, TestResult)
context/          # ScanHistoryContext.tsx (TestHistoryContext, useTestHistory)
```

## Key Conventions
- All screens use `router.push()` / `router.replace()` from expo-router
- Shared types live in `types/index.ts` — import from there, never redefine
- Shared constants (colors, fake test data, timing) live in `lib/constants.ts`
- Gemini model: `gemini-2.5-flash-lite` (fast for demos)
- API key accessed via `process.env.EXPO_PUBLIC_GEMINI_API_KEY`

## Color Palette
- Primary: `#7C3AED` (deep purple)
- Warning: `#F59E0B` (amber)
- Danger: `#EF4444` (red)
- Background: `#F5F0FF` (soft lavender)
- Surface: `#FFFFFF`
- TabBar: `#EDE9FE`, Border: `#DDD6FE`
