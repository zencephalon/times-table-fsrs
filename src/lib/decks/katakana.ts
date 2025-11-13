import { createEmptyCard } from "ts-fsrs";
import type { AnswerCheckResult, Card, DeckDefinition } from "../deck-types";
import { DeckType } from "../deck-types";

/**
 * Content structure for Katakana cards
 */
export interface KatakanaContent {
  character: string; // The katakana character (e.g., "ア")
  romaji: string[]; // Accepted romanizations (e.g., ["a"] or ["shi", "si"])
}

/**
 * Basic Katakana characters (46 total)
 * Ordered by traditional gojūon (五十音) sequence
 */
const KATAKANA_DATA: Array<{ char: string; romaji: string[] }> = [
  // Vowels (a, i, u, e, o)
  { char: "ア", romaji: ["a"] },
  { char: "イ", romaji: ["i"] },
  { char: "ウ", romaji: ["u"] },
  { char: "エ", romaji: ["e"] },
  { char: "オ", romaji: ["o"] },

  // K-row
  { char: "カ", romaji: ["ka"] },
  { char: "キ", romaji: ["ki"] },
  { char: "ク", romaji: ["ku"] },
  { char: "ケ", romaji: ["ke"] },
  { char: "コ", romaji: ["ko"] },

  // S-row (note shi/si variants)
  { char: "サ", romaji: ["sa"] },
  { char: "シ", romaji: ["shi", "si"] },
  { char: "ス", romaji: ["su"] },
  { char: "セ", romaji: ["se"] },
  { char: "ソ", romaji: ["so"] },

  // T-row (note chi/ti and tsu/tu variants)
  { char: "タ", romaji: ["ta"] },
  { char: "チ", romaji: ["chi", "ti"] },
  { char: "ツ", romaji: ["tsu", "tu"] },
  { char: "テ", romaji: ["te"] },
  { char: "ト", romaji: ["to"] },

  // N-row
  { char: "ナ", romaji: ["na"] },
  { char: "ニ", romaji: ["ni"] },
  { char: "ヌ", romaji: ["nu"] },
  { char: "ネ", romaji: ["ne"] },
  { char: "ノ", romaji: ["no"] },

  // H-row (note fu/hu variant)
  { char: "ハ", romaji: ["ha"] },
  { char: "ヒ", romaji: ["hi"] },
  { char: "フ", romaji: ["fu", "hu"] },
  { char: "ヘ", romaji: ["he"] },
  { char: "ホ", romaji: ["ho"] },

  // M-row
  { char: "マ", romaji: ["ma"] },
  { char: "ミ", romaji: ["mi"] },
  { char: "ム", romaji: ["mu"] },
  { char: "メ", romaji: ["me"] },
  { char: "モ", romaji: ["mo"] },

  // Y-row
  { char: "ヤ", romaji: ["ya"] },
  { char: "ユ", romaji: ["yu"] },
  { char: "ヨ", romaji: ["yo"] },

  // R-row
  { char: "ラ", romaji: ["ra"] },
  { char: "リ", romaji: ["ri"] },
  { char: "ル", romaji: ["ru"] },
  { char: "レ", romaji: ["re"] },
  { char: "ロ", romaji: ["ro"] },

  // W-row
  { char: "ワ", romaji: ["wa"] },
  { char: "ヲ", romaji: ["wo", "o"] },

  // N
  { char: "ン", romaji: ["n"] },
];

/**
 * Katakana deck definition
 * Teaches basic Katakana characters (46 total)
 */
export const katakanaDeck: DeckDefinition<KatakanaContent> = {
  id: DeckType.KATAKANA,
  name: "Katakana",
  description: "Learn to read basic Katakana characters (46 cards)",
  inputType: "text",

  generateCards(): Card<KatakanaContent>[] {
    return KATAKANA_DATA.map((data) => ({
      id: `katakana-${data.char}`,
      deckId: DeckType.KATAKANA,
      content: {
        character: data.char,
        romaji: data.romaji,
      },
      fsrsCard: createEmptyCard(),
    }));
  },

  formatQuestion(card: Card<KatakanaContent>): string {
    return card.content.character;
  },

  checkAnswer(
    card: Card<KatakanaContent>,
    answer: string | number,
  ): AnswerCheckResult {
    // Convert answer to lowercase string for comparison
    const userAnswer =
      typeof answer === "string"
        ? answer.toLowerCase().trim()
        : answer.toString();

    // Check if user's answer matches any of the accepted romaji
    const isCorrect = card.content.romaji.some(
      (acceptedRomaji) => acceptedRomaji.toLowerCase() === userAnswer,
    );

    return {
      isCorrect,
      correctAnswer: card.content.romaji[0], // Primary romanization
      userAnswer: typeof answer === "string" ? answer : answer.toString(),
    };
  },

  getCorrectAnswerString(card: Card<KatakanaContent>): string {
    // Return primary romanization, with alternatives if they exist
    if (card.content.romaji.length > 1) {
      return `${card.content.romaji[0]} (or ${card.content.romaji.slice(1).join(", ")})`;
    }
    return card.content.romaji[0];
  },
};
