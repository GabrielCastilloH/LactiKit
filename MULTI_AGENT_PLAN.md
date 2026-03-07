# LactiKit — Multi-Agent Coordination Plan

## Status: BUILDING

## Agent File Ownership

| Agent | Role | Files Owned |
|-------|------|-------------|
| Agent 1 | Foundation + Home | app/_layout.tsx, app/index.tsx, types/index.ts, lib/constants.ts, components/ui/Button.tsx, components/ui/Card.tsx, components/ui/Badge.tsx, global.css |
| Agent 2 | Scan + Results | app/scan.tsx, app/results.tsx, components/scan/ScanOverlay.tsx, components/scan/AnalyzingModal.tsx, components/results/DeficiencyCard.tsx, hooks/useAnalyzing.ts |
| Agent 3 | AI Integration | lib/gemini.ts, lib/systemPrompt.ts, hooks/useChat.ts |
| Agent 4 | Chat UI | app/chat.tsx, components/chat/MessageBubble.tsx, components/chat/TypingIndicator.tsx, components/chat/ChatInput.tsx |

## Shared Types (defined by Agent 1 in types/index.ts)
All agents must use these — do not redefine:
- Message: { id, role, content, timestamp }
- ChatPhase: 'questioning' | 'recipe' | 'referral'
- ScanResult: { deficiencies, scanId, timestamp }
- Deficiency: { nutrient, level, normalRange, detectedValue }

## Shared Constants (defined by Agent 1 in lib/constants.ts)
- COLORS: { primary, warning, danger, background, surface }
- SCAN_RESULT: hardcoded Iron + B12 deficiency data
- ANALYZING_DURATION_MS: 3000

## Hook Interface Contract (Agent 3 implements, Agent 4 consumes)
useChat() returns:
- messages: Message[]
- sendMessage(text: string): void
- isStreaming: boolean
- chatPhase: ChatPhase
- clinicalSummary: string | null

## Task Tracking

### Agent 1 Tasks
- [x] types/index.ts
- [x] lib/constants.ts
- [x] global.css (already existed, verified correct)
- [x] app/_layout.tsx
- [x] app/index.tsx (Home screen with pulse button)
- [x] components/ui/ (Button, Card, Badge)

### Agent 2 Tasks
- [ ] hooks/useAnalyzing.ts
- [ ] components/scan/ScanOverlay.tsx
- [ ] components/scan/AnalyzingModal.tsx
- [ ] app/scan.tsx
- [ ] components/results/DeficiencyCard.tsx
- [ ] app/results.tsx

### Agent 3 Tasks
- [ ] lib/systemPrompt.ts
- [ ] lib/gemini.ts
- [ ] hooks/useChat.ts

### Agent 4 Tasks
- [ ] components/chat/MessageBubble.tsx
- [ ] components/chat/TypingIndicator.tsx
- [ ] components/chat/ChatInput.tsx
- [ ] app/chat.tsx

## Messages Between Agents
_(agents write here to coordinate)_
