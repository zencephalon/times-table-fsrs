import type { Card as FSRSCard } from "ts-fsrs";
import type { Card } from "./deck-types";
import { DeckType } from "./deck-types";

// Re-export deck-related types for convenience
export type { Card, DeckType, DeckDefinition } from "./deck-types";

/**
 * @deprecated Use Card<MultiplicationContent> from deck-types instead
 * Kept temporarily for backward compatibility during migration
 */
export interface MultiplicationCard {
  id: string;
  multiplicand: number; // 2-9
  multiplier: number; // 2-99
  fsrsCard: FSRSCard; // ts-fsrs Card object
}

export interface ResponseRecord {
  cardId: string;
  answer: number | string; // Support both numeric and text answers
  correct: boolean;
  responseTime: number; // milliseconds
  timestamp: Date;
}

export interface SpeedStats {
  responses: number[];
  percentiles: { p25: number; p50: number; p75: number; p90: number };
  isWarmedUp: boolean; // true after 50+ responses
}

export interface SessionData {
  responses: ResponseRecord[];
  speedStats: SpeedStats;
  lastReviewDate: Date;
  sessionStartTime: Date;
  totalSessionTime: number; // milliseconds
}

export interface AppSettings {
  warmupTarget: number;
  soundEnabled: boolean;
  showUpcomingReviews: boolean;
  enabledDecks: DeckType[]; // Which decks are currently enabled for practice
}
