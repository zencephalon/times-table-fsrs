/**
 * Deck Registry - Central location for all deck definitions
 *
 * This file registers all available decks and exports the
 * configured registry for use throughout the application.
 */

import { deckRegistry } from "../deck-registry";
import { katakanaDeck } from "./katakana";
import { multiplicationDeck } from "./multiplication";
import { subtractionDeck } from "./subtraction";
import { unitLengthDeck } from "./unit-length";
import { unitTemperatureDeck } from "./unit-temperature";
import { unitVolumeDeck } from "./unit-volume";
import { unitWeightDeck } from "./unit-weight";

// Register all available decks
deckRegistry.register(multiplicationDeck);
deckRegistry.register(katakanaDeck);
deckRegistry.register(subtractionDeck);
deckRegistry.register(unitWeightDeck);
deckRegistry.register(unitLengthDeck);
deckRegistry.register(unitVolumeDeck);
deckRegistry.register(unitTemperatureDeck);

// Export the configured registry
export { deckRegistry };

// Export individual deck definitions for direct access if needed
export {
  multiplicationDeck,
  katakanaDeck,
  subtractionDeck,
  unitWeightDeck,
  unitLengthDeck,
  unitVolumeDeck,
  unitTemperatureDeck,
};

export type { KatakanaContent } from "./katakana";
// Re-export types for convenience
export type { MultiplicationContent } from "./multiplication";
export type { SubtractionContent } from "./subtraction";
export type { UnitConversionContent } from "./unit-conversion-utils";
