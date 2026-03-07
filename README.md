# LactiKit

Maternal nutritional health triage app built with Expo + Nurse Maya AI.

## Prerequisites

- Node.js 18+
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Xcode) or Android Emulator, or the [Expo Go](https://expo.dev/go) app on your phone

## Setup

**1. Clone and install**
```bash
git clone <repo-url>
cd LactiKit
npm install
```

**2. Add your Gemini API key**

Copy the example env file and fill in your key:
```bash
cp .env.example .env.local
```

Then edit `.env.local`:
```
EXPO_PUBLIC_GEMINI_API_KEY=your_key_here
```

Get a free key at [aistudio.google.com](https://aistudio.google.com).

**3. Start the app**
```bash
npx expo start --clear
```

Then press:
- `i` — open in iOS Simulator
- `a` — open in Android Emulator
- Scan the QR code with the Expo Go app on your phone

## App Flow

1. **Home** — tap the pulsing scan button
2. **Scan** — grant camera access, tap the capture button (3s fake analysis)
3. **Results** — view Iron + Vitamin B12 deficiency readings
4. **Chat** — talk to Nurse Maya AI for dietary advice or clinical referral

## Tech Stack

- Expo SDK 55 + TypeScript
- Expo Router v4 (file-based routing)
- NativeWind v4 (Tailwind CSS for React Native)
- Google Gemini 2.0 Flash (AI chat)
- react-native-reanimated (animations)
- expo-camera (scan screen)
