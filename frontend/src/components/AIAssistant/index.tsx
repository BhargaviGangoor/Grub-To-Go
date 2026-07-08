/**
 * index.tsx — Public API of the AIAssistant module
 *
 * WHY A BARREL EXPORT:
 * Instead of importing: `from "@/components/AIAssistant/AIAssistant"`
 * Consumers import:    `from "@/components/AIAssistant"`
 *
 * This gives the module a clean public API.
 * Internal file structure can be refactored without changing consumer imports.
 *
 * Only export what should be PUBLIC.
 * Internal components (TypingIndicator, MessageBubble, etc.) are NOT exported —
 * they're implementation details that consumers don't need to know about.
 */

// Primary export: the root component to mount in layout.tsx
export { AIAssistant } from "./AIAssistant";

// Types that consumers might need (e.g., for extending functionality)
export type { Message, ChatState, SuggestionChip } from "./types";
