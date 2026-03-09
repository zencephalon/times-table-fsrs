import { DeckType } from "../deck-types";
import {
  createUnitConversionDeck,
  type UnitConversionCardData,
} from "./unit-conversion-utils";

const cards: UnitConversionCardData[] = [
  // US cooking measures
  { question: "1 tbsp = ? tsp", answer: "3" },
  { question: "3 tsp = ? tbsp", answer: "1" },
  { question: "1 cup = ? tbsp", answer: "16" },
  { question: "16 tbsp = ? cup", answer: "1" },
  { question: "1 pint = ? cups", answer: "2" },
  { question: "2 cups = ? pint", answer: "1" },
  { question: "1 quart = ? pints", answer: "2" },
  { question: "2 pints = ? quart", answer: "1" },
  { question: "1 gallon = ? quarts", answer: "4" },
  { question: "4 quarts = ? gallon", answer: "1" },
  { question: "1 gallon = ? fl oz", answer: "128" },
  { question: "128 fl oz = ? gallons", answer: "1" },

  // Metric
  { question: "1 L = ? mL", answer: "1000" },
  { question: "1000 mL = ? L", answer: "1" },

  // Cross-system
  { question: "1 gallon ≈ ? L", answer: "3.785" },
  { question: "1 L ≈ ? fl oz", answer: "33.8" },
  { question: "1 cup ≈ ? mL", answer: "237" },
  { question: "237 mL ≈ ? cups", answer: "1" },
  { question: "1 fl oz ≈ ? mL", answer: "30" },
  { question: "30 mL ≈ ? fl oz", answer: "1" },
  { question: "1 quart ≈ ? L", answer: "0.95" },

  // Concrete reference points
  { question: "2 L ≈ ? quarts", answer: "2.1" },
  { question: "5 gallons ≈ ? L", answer: "19" },
  { question: "10 L ≈ ? gallons", answer: "2.6" },
];

export const unitVolumeDeck = createUnitConversionDeck(
  DeckType.UNIT_VOLUME,
  "Unit Conversion: Volume",
  "Volume and liquid measure conversions (US, metric, cross-system) with 24 cards",
  cards,
);
