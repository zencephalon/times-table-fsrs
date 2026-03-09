import { DeckType } from "../deck-types";
import {
  createUnitConversionDeck,
  type UnitConversionCardData,
} from "./unit-conversion-utils";

const cards: UnitConversionCardData[] = [
  // US system
  { question: "1 ft = ? in", answer: "12" },
  { question: "12 in = ? ft", answer: "1" },
  { question: "1 yd = ? ft", answer: "3" },
  { question: "3 ft = ? yd", answer: "1" },
  { question: "1 mi = ? ft", answer: "5280" },
  { question: "5280 ft = ? mi", answer: "1" },

  // Metric system
  { question: "1 m = ? cm", answer: "100" },
  { question: "100 cm = ? m", answer: "1" },
  { question: "1 km = ? m", answer: "1000" },
  { question: "1000 m = ? km", answer: "1" },
  { question: "1 cm = ? mm", answer: "10" },
  { question: "10 mm = ? cm", answer: "1" },

  // Cross-system
  { question: "1 in = ? cm", answer: "2.54" },
  { question: "2.54 cm = ? in", answer: "1" },
  { question: "1 mi ≈ ? km", answer: "1.6" },
  { question: "1 km ≈ ? mi", answer: "0.62" },
  { question: "1 m ≈ ? ft", answer: "3.28" },
  { question: "1 ft ≈ ? cm", answer: "30.48" },
  { question: "1 yd ≈ ? m", answer: "0.91" },
  { question: "1 m ≈ ? yd", answer: "1.09" },

  // Concrete reference points
  { question: "10 mi ≈ ? km", answer: "16" },
  { question: "10 km ≈ ? mi", answer: "6.2" },
  { question: "100 km ≈ ? mi", answer: "62" },
  { question: "100 mi ≈ ? km", answer: "160" },
  { question: "1 marathon ≈ ? mi", answer: "26.2" },
  { question: "1 marathon ≈ ? km", answer: "42.2" },
];

export const unitLengthDeck = createUnitConversionDeck(
  DeckType.UNIT_LENGTH,
  "Unit Conversion: Length",
  "Length and distance conversions (US, metric, cross-system) with 26 cards",
  cards,
);
