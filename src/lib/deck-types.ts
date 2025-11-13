import type { Card as FSRSCard } from "ts-fsrs";

/**
 * Available deck types in the application
 */
export enum DeckType {
  MULTIPLICATION = "multiplication",
  KATAKANA = "katakana",
}

/**
 * Generic card structure that works with any deck type
 * @template TContent The deck-specific content type
 */
export interface Card<TContent = unknown> {
  id: string;
  deckId: DeckType;
  content: TContent;
  fsrsCard: FSRSCard;
}

/**
 * Input type for answering cards
 */
export type InputType = "number" | "text";

/**
 * Result of checking an answer
 */
export interface AnswerCheckResult {
  isCorrect: boolean;
  correctAnswer: string;
  userAnswer: string;
}

/**
 * Deck definition interface - implement this for each deck type
 * @template TContent The deck-specific content type
 */
export interface DeckDefinition<TContent = unknown> {
  /** Unique identifier for this deck */
  id: DeckType;

  /** Display name of the deck */
  name: string;

  /** Brief description of what this deck teaches */
  description: string;

  /** Input type required for this deck (number or text) */
  inputType: InputType;

  /**
   * Generate all cards for this deck
   * @returns Array of cards with fresh FSRS state
   */
  generateCards(): Card<TContent>[];

  /**
   * Format the question to display to the user
   * @param card The card to format
   * @returns Formatted question string or JSX element
   */
  formatQuestion(card: Card<TContent>): string;

  /**
   * Check if the user's answer is correct
   * @param card The card being answered
   * @param answer The user's raw answer (string or number)
   * @returns Result with correctness and formatted answers
   */
  checkAnswer(card: Card<TContent>, answer: string | number): AnswerCheckResult;

  /**
   * Get the correct answer as a string for display
   * @param card The card to get answer for
   * @returns String representation of correct answer
   */
  getCorrectAnswerString(card: Card<TContent>): string;
}

/**
 * Type guard to check if a card belongs to a specific deck
 */
export function isCardOfDeck<TContent>(
  card: Card<unknown>,
  deckType: DeckType,
): card is Card<TContent> {
  return card.deckId === deckType;
}

/**
 * Type-safe way to get a card's content for a specific deck
 */
export function getCardContent<TContent>(
  card: Card<unknown>,
  deckType: DeckType,
): TContent {
  if (card.deckId !== deckType) {
    throw new Error(`Card ${card.id} does not belong to deck ${deckType}`);
  }
  return card.content as TContent;
}
