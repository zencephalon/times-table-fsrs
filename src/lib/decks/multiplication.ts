import { createEmptyCard } from "ts-fsrs";
import type {
  AnswerCheckResult,
  Card,
  DeckDefinition,
} from "../deck-types";
import { DeckType } from "../deck-types";

/**
 * Content structure for multiplication cards
 */
export interface MultiplicationContent {
  multiplicand: number; // 2-9
  multiplier: number; // 2-99
}

/**
 * Fisher-Yates shuffle algorithm to randomize array order
 */
function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Multiplication deck definition
 * Teaches multiplication tables (2-9 × 2-99)
 */
export const multiplicationDeck: DeckDefinition<MultiplicationContent> = {
  id: DeckType.MULTIPLICATION,
  name: "Multiplication Tables",
  description: "Learn multiplication tables (2-9 × 2-99) with 784 unique problems",
  inputType: "number",

  generateCards(): Card<MultiplicationContent>[] {
    const cards: Card<MultiplicationContent>[] = [];

    // Generate multiplicands 2-9 and multipliers 2-99
    for (let multiplicand = 2; multiplicand <= 9; multiplicand++) {
      for (let multiplier = 2; multiplier <= 99; multiplier++) {
        const id = `mult-${multiplicand}x${multiplier}`;

        cards.push({
          id,
          deckId: DeckType.MULTIPLICATION,
          content: {
            multiplicand,
            multiplier,
          },
          fsrsCard: createEmptyCard(),
        });
      }
    }

    // Shuffle the cards to avoid predictable sequences
    return shuffleArray(cards);
  },

  formatQuestion(card: Card<MultiplicationContent>): string {
    return `${card.content.multiplicand} × ${card.content.multiplier}`;
  },

  checkAnswer(
    card: Card<MultiplicationContent>,
    answer: string | number,
  ): AnswerCheckResult {
    const correctAnswer =
      card.content.multiplicand * card.content.multiplier;
    const userAnswerNum = typeof answer === "number" ? answer : parseInt(answer, 10);
    const isCorrect = !isNaN(userAnswerNum) && userAnswerNum === correctAnswer;

    return {
      isCorrect,
      correctAnswer: correctAnswer.toString(),
      userAnswer: typeof answer === "number" ? answer.toString() : answer,
    };
  },

  getCorrectAnswerString(card: Card<MultiplicationContent>): string {
    return (card.content.multiplicand * card.content.multiplier).toString();
  },
};
