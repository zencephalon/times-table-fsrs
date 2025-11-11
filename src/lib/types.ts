import type { Card } from "ts-fsrs";

export interface KatakanaCard {
  id: string;
  character: string; // Katakana character (e.g., "ア")
  romaji: string; // Correct romaji (e.g., "a")
  fsrsCard: Card; // ts-fsrs Card object
}

export interface ResponseRecord {
  cardId: string;
  answer: string;
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
}
