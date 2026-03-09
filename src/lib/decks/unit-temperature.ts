import { DeckType } from "../deck-types";
import {
  createUnitConversionDeck,
  type UnitConversionCardData,
} from "./unit-conversion-utils";

const cards: UnitConversionCardData[] = [
  // Freezing point
  { question: "Water freezes at ? °F", answer: "32" },
  { question: "Water freezes at ? °C", answer: "0" },
  { question: "32°F = ? °C", answer: "0" },
  { question: "0°C = ? °F", answer: "32" },

  // Boiling point
  { question: "Water boils at ? °F", answer: "212" },
  { question: "Water boils at ? °C", answer: "100" },
  { question: "212°F = ? °C", answer: "100" },
  { question: "100°C = ? °F", answer: "212" },

  // Body temperature
  { question: "Body temp (98.6°F) = ? °C", answer: "37" },
  { question: "Body temp (37°C) = ? °F", answer: "98.6" },

  // Room temperature
  { question: "Room temp (72°F) ≈ ? °C", answer: "22" },
  { question: "Room temp (22°C) ≈ ? °F", answer: "72" },

  // The crossover
  { question: "-40°F = ? °C", answer: "-40" },

  // Formulas
  { question: "°F to °C formula: (°F - 32) × ?/?", answer: "5/9" },
  { question: "°C to °F formula: °C × ?/? + 32", answer: "9/5" },

  // Useful reference points
  { question: "50°F ≈ ? °C", answer: "10" },
  { question: "10°C ≈ ? °F", answer: "50" },
  { question: "350°F (baking) ≈ ? °C", answer: "177" },
  { question: "180°C (baking) ≈ ? °F", answer: "356" },
  { question: "0°F ≈ ? °C", answer: "-18" },
  { question: "-18°C ≈ ? °F", answer: "0" },
];

export const unitTemperatureDeck = createUnitConversionDeck(
  DeckType.UNIT_TEMPERATURE,
  "Unit Conversion: Temperature",
  "Temperature conversions and reference points (°F ↔ °C) with 21 cards",
  cards,
);
