/**
 * types.ts — AI Assistant Type Definitions
 *
 * Shared TypeScript interfaces for the entire AIAssistant component tree.
 *
 * ─── REACT CONCEPT: TypeScript + Props ──────────────────────────────────────
 * In React with TypeScript, every component's props are typed.
 * This means:
 *   - Autocomplete in editors
 *   - Compile-time errors if you pass wrong prop types
 *   - Self-documenting code (the types ARE the documentation)
 *
 * ─── FUTURE EVOLUTION ────────────────────────────────────────────────────────
 * Message will later include:
 *   - agentTrace?: AgentStep[]  — show which agents processed the message
 *   - suggestedActions?: Action[] — quick action buttons in the reply
 *   - dishCard?: GeneratedDish   — inline dish recommendation card
 *   - dctToken?: string          — secure order token for checkout
 */

/**
 * A single message in the chat.
 * role: "user" renders on the right with emerald styling.
 * role: "assistant" renders on the left with warm white styling.
 */
export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

/**
 * The state shape managed by the useChat hook.
 * Passed down as props to presentational components.
 */
export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Props for the main AIAssistant orchestrator component.
 * Empty for now — no external configuration needed.
 * Future: could accept `initialPrompt`, `userId`, `restaurantContext`.
 */
export interface AIAssistantProps {}

/**
 * Suggestion chips displayed when chat is empty.
 */
export interface SuggestionChip {
  id: string;
  label: string;
  prompt: string;
  icon: string;
}

/**
 * The default suggestion chips shown to new users.
 * These serve as onboarding — showing users what the AI can do.
 */
export const DEFAULT_SUGGESTIONS: SuggestionChip[] = [
  {
    id: "s1",
    label: "Order dinner under ₹500",
    prompt: "Order a delicious dinner for one person under ₹500",
    icon: "🍽️",
  },
  {
    id: "s2",
    label: "Generate a healthy recipe",
    prompt: "Generate a healthy, balanced recipe I can make at home",
    icon: "🥗",
  },
  {
    id: "s3",
    label: "Recommend high-protein meal",
    prompt: "Recommend a high-protein meal for post-workout recovery",
    icon: "💪",
  },
  {
    id: "s4",
    label: "Find a spicy vegetarian dish",
    prompt: "Find a spicy vegetarian dish that's flavorful and satisfying",
    icon: "🌶️",
  },
];
