import { createEmptyCard } from "ts-fsrs";
import type { KatakanaCard } from "./types";

/**
 * All 46 basic Katakana characters with their romaji
 */
const KATAKANA_DATA: Array<{ character: string; romaji: string }> = [
  // A row
  { character: "ア", romaji: "a" },
  { character: "イ", romaji: "i" },
  { character: "ウ", romaji: "u" },
  { character: "エ", romaji: "e" },
  { character: "オ", romaji: "o" },
  // K row
  { character: "カ", romaji: "ka" },
  { character: "キ", romaji: "ki" },
  { character: "ク", romaji: "ku" },
  { character: "ケ", romaji: "ke" },
  { character: "コ", romaji: "ko" },
  // S row
  { character: "サ", romaji: "sa" },
  { character: "シ", romaji: "shi" },
  { character: "ス", romaji: "su" },
  { character: "セ", romaji: "se" },
  { character: "ソ", romaji: "so" },
  // T row
  { character: "タ", romaji: "ta" },
  { character: "チ", romaji: "chi" },
  { character: "ツ", romaji: "tsu" },
  { character: "テ", romaji: "te" },
  { character: "ト", romaji: "to" },
  // N row
  { character: "ナ", romaji: "na" },
  { character: "ニ", romaji: "ni" },
  { character: "ヌ", romaji: "nu" },
  { character: "ネ", romaji: "ne" },
  { character: "ノ", romaji: "no" },
  // H row
  { character: "ハ", romaji: "ha" },
  { character: "ヒ", romaji: "hi" },
  { character: "フ", romaji: "fu" },
  { character: "ヘ", romaji: "he" },
  { character: "ホ", romaji: "ho" },
  // M row
  { character: "マ", romaji: "ma" },
  { character: "ミ", romaji: "mi" },
  { character: "ム", romaji: "mu" },
  { character: "メ", romaji: "me" },
  { character: "モ", romaji: "mo" },
  // Y row
  { character: "ヤ", romaji: "ya" },
  { character: "ユ", romaji: "yu" },
  { character: "ヨ", romaji: "yo" },
  // R row
  { character: "ラ", romaji: "ra" },
  { character: "リ", romaji: "ri" },
  { character: "ル", romaji: "ru" },
  { character: "レ", romaji: "re" },
  { character: "ロ", romaji: "ro" },
  // W row
  { character: "ワ", romaji: "wa" },
  { character: "ヲ", romaji: "wo" },
  // N
  { character: "ン", romaji: "n" },
];

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
 * Generates all 46 Katakana cards
 * Cards are shuffled to avoid predictable sequences
 */
export function generateKatakanaCards(): KatakanaCard[] {
  const cards: KatakanaCard[] = KATAKANA_DATA.map((data) => ({
    id: data.character,
    character: data.character,
    romaji: data.romaji,
    fsrsCard: createEmptyCard(),
  }));

  // Shuffle the cards to avoid predictable sequences
  return shuffleArray(cards);
}

/**
 * Get the correct answer for a katakana card
 */
export function getAnswer(card: KatakanaCard): string {
  return card.romaji;
}

/**
 * Check if an answer is correct for a given card
 */
export function isCorrect(card: KatakanaCard, answer: string): boolean {
  return answer.toLowerCase().trim() === card.romaji.toLowerCase();
}

/**
 * Format a card as a question string (just the character)
 */
export function formatQuestion(card: KatakanaCard): string {
  return card.character;
}
