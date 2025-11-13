import type { Card, DeckDefinition, DeckType } from "./deck-types";

/**
 * Central registry for all deck definitions
 * Provides type-safe access to deck-specific logic
 */
export class DeckRegistry {
  private decks = new Map<DeckType, DeckDefinition<unknown>>();

  /**
   * Register a deck definition
   */
  register<TContent>(definition: DeckDefinition<TContent>): void {
    if (this.decks.has(definition.id)) {
      console.warn(`Deck ${definition.id} is already registered`);
      return;
    }
    this.decks.set(definition.id, definition as DeckDefinition<unknown>);
  }

  /**
   * Get a deck definition by its ID
   * @throws Error if deck is not registered
   */
  getDeck<TContent>(deckId: DeckType): DeckDefinition<TContent> {
    const deck = this.decks.get(deckId);
    if (!deck) {
      throw new Error(`Deck ${deckId} is not registered`);
    }
    return deck as DeckDefinition<TContent>;
  }

  /**
   * Get all registered decks
   */
  getAllDecks(): DeckDefinition<unknown>[] {
    return Array.from(this.decks.values());
  }

  /**
   * Check if a deck is registered
   */
  hasDeck(deckId: DeckType): boolean {
    return this.decks.has(deckId);
  }

  /**
   * Get deck definition for a specific card
   */
  getDeckForCard<TContent>(card: Card<unknown>): DeckDefinition<TContent> {
    return this.getDeck<TContent>(card.deckId);
  }

  /**
   * Generate all cards for enabled decks
   */
  generateCardsForDecks(enabledDecks: DeckType[]): Card<unknown>[] {
    const allCards: Card<unknown>[] = [];

    for (const deckId of enabledDecks) {
      if (this.hasDeck(deckId)) {
        const deck = this.getDeck(deckId);
        const cards = deck.generateCards();
        allCards.push(...cards);
      } else {
        console.warn(
          `Attempted to generate cards for unregistered deck: ${deckId}`,
        );
      }
    }

    return allCards;
  }

  /**
   * Filter cards by enabled decks
   */
  filterCardsByDecks(
    cards: Card<unknown>[],
    enabledDecks: DeckType[],
  ): Card<unknown>[] {
    const enabledSet = new Set(enabledDecks);
    return cards.filter((card) => enabledSet.has(card.deckId));
  }
}

// Global singleton registry
export const deckRegistry = new DeckRegistry();
