import { createEmptyCard } from "ts-fsrs";
import type {
  AnswerCheckResult,
  Card,
  DeckDefinition,
  DeckType,
} from "../deck-types";

/**
 * Content structure for unit conversion cards
 */
export interface UnitConversionContent {
  question: string;
  answer: string;
}

/**
 * Raw card data for defining unit conversion cards
 */
export interface UnitConversionCardData {
  question: string;
  answer: string;
}

/**
 * Check a unit conversion answer.
 * Tries numeric comparison first (exact match), falls back to case-insensitive string match.
 */
function checkUnitAnswer(
  card: Card<UnitConversionContent>,
  answer: string | number,
): AnswerCheckResult {
  const expected = card.content.answer;
  const userStr =
    typeof answer === "number" ? answer.toString() : answer.trim();

  const expectedNum = Number(expected);
  const userNum = Number(userStr);

  const isCorrect =
    !Number.isNaN(expectedNum) && !Number.isNaN(userNum)
      ? userNum === expectedNum
      : userStr.toLowerCase() === expected.toLowerCase();

  return {
    isCorrect,
    correctAnswer: expected,
    userAnswer: userStr,
  };
}

/**
 * Create a unit conversion deck definition from card data
 */
export function createUnitConversionDeck(
  id: DeckType,
  name: string,
  description: string,
  cardData: UnitConversionCardData[],
): DeckDefinition<UnitConversionContent> {
  return {
    id,
    name,
    description,
    inputType: "text",

    generateCards(): Card<UnitConversionContent>[] {
      return cardData.map((data, index) => ({
        id: `${id}-${index}`,
        deckId: id,
        content: {
          question: data.question,
          answer: data.answer,
        },
        fsrsCard: createEmptyCard(),
      }));
    },

    formatQuestion(card: Card<UnitConversionContent>): string {
      return card.content.question;
    },

    checkAnswer: checkUnitAnswer,

    getCorrectAnswerString(card: Card<UnitConversionContent>): string {
      return card.content.answer;
    },
  };
}
