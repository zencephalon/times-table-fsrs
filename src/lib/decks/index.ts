/**
 * Deck Registry - Central location for all deck definitions
 *
 * This file registers all available decks and exports the
 * configured registry for use throughout the application.
 */

import { deckRegistry } from "../deck-registry";
import { katakanaDeck } from "./katakana";
import { multiplicationDeck } from "./multiplication";

// Register all available decks
deckRegistry.register(multiplicationDeck);
deckRegistry.register(katakanaDeck);

// Export the configured registry
export { deckRegistry };

// Export individual deck definitions for direct access if needed
export { multiplicationDeck, katakanaDeck };

// Re-export types for convenience
export type { MultiplicationContent } from "./multiplication";
export type { KatakanaContent } from "./katakana";
