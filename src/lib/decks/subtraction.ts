import { createEmptyCard } from "ts-fsrs";
import type { AnswerCheckResult, Card, DeckDefinition } from "../deck-types";
import { DeckType } from "../deck-types";

/**
 * Content structure for subtraction cards
 */
export interface SubtractionContent {
  minuend: number; // 2-99 (the number being subtracted from)
  subtrahend: number; // 1-98 (the number being subtracted, always < minuend)
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
 * Subtraction deck definition
 * Teaches subtraction (1-99 − 1-99) where minuend > subtrahend
 */
export const subtractionDeck: DeckDefinition<SubtractionContent> = {
  id: DeckType.SUBTRACTION,
  name: "Subtraction",
  description: "Subtraction problems (1-99 − 1-99) with 4,851 unique problems",
  inputType: "number",

  generateCards(): Card<SubtractionContent>[] {
    const cards: Card<SubtractionContent>[] = [];

    // Generate all pairs where minuend > subtrahend (positive results only)
    for (let minuend = 2; minuend <= 99; minuend++) {
      for (let subtrahend = 1; subtrahend < minuend; subtrahend++) {
        const id = `sub-${minuend}-${subtrahend}`;

        cards.push({
          id,
          deckId: DeckType.SUBTRACTION,
          content: {
            minuend,
            subtrahend,
          },
          fsrsCard: createEmptyCard(),
        });
      }
    }

    // Shuffle the cards to avoid predictable sequences
    return shuffleArray(cards);
  },

  formatQuestion(card: Card<SubtractionContent>): string {
    return `${card.content.minuend} − ${card.content.subtrahend}`;
  },

  checkAnswer(
    card: Card<SubtractionContent>,
    answer: string | number,
  ): AnswerCheckResult {
    const correctAnswer = card.content.minuend - card.content.subtrahend;
    const userAnswerNum =
      typeof answer === "number" ? answer : parseInt(answer, 10);
    const isCorrect =
      !Number.isNaN(userAnswerNum) && userAnswerNum === correctAnswer;

    return {
      isCorrect,
      correctAnswer: correctAnswer.toString(),
      userAnswer: typeof answer === "number" ? answer.toString() : answer,
    };
  },

  getCorrectAnswerString(card: Card<SubtractionContent>): string {
    return (card.content.minuend - card.content.subtrahend).toString();
  },
};
