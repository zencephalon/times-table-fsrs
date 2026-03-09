import { DeckType } from "../deck-types";
import {
  createUnitConversionDeck,
  type UnitConversionCardData,
} from "./unit-conversion-utils";

const cards: UnitConversionCardData[] = [
  // US system
  { question: "1 lb = ? oz", answer: "16" },
  { question: "16 oz = ? lb", answer: "1" },
  { question: "1 ton = ? lbs", answer: "2000" },
  { question: "2000 lbs = ? tons", answer: "1" },

  // Metric system
  { question: "1 kg = ? g", answer: "1000" },
  { question: "1000 g = ? kg", answer: "1" },
  { question: "1 metric ton = ? kg", answer: "1000" },
  { question: "1000 kg = ? metric tons", answer: "1" },

  // Cross-system
  { question: "1 kg ≈ ? lbs", answer: "2.2" },
  { question: "1 lb ≈ ? kg", answer: "0.45" },
  { question: "1 oz ≈ ? g", answer: "28" },
  { question: "28 g ≈ ? oz", answer: "1" },

  // Concrete reference points
  { question: "5 kg ≈ ? lbs", answer: "11" },
  { question: "10 lbs ≈ ? kg", answer: "4.5" },
  { question: "100 kg ≈ ? lbs", answer: "220" },
  { question: "100 lbs ≈ ? kg", answer: "45" },

  // Stones (UK)
  { question: "1 stone = ? lbs", answer: "14" },
  { question: "14 lbs = ? stone", answer: "1" },
];

export const unitWeightDeck = createUnitConversionDeck(
  DeckType.UNIT_WEIGHT,
  "Unit Conversion: Weight",
  "Weight and mass conversions (US, metric, cross-system) with 18 cards",
  cards,
);
