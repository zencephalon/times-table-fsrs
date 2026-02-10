import type { ComponentType } from "react";
import { DeckType } from "@/lib/deck-types";
import { deckRegistry } from "@/lib/decks";
import type { MultiplicationContent } from "@/lib/decks/multiplication";
import type { SubtractionContent } from "@/lib/decks/subtraction";
import type { Card } from "@/lib/types";

interface CardProps {
  card: Card<unknown>;
}

function ColumnarQuestion({
  top,
  operator,
  bottom,
}: { top: number; operator: string; bottom: number }) {
  return (
    <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono">
      <div className="text-right">{top}</div>
      <div className="text-right">
        {operator} {bottom}
      </div>
      <div className="border-t-4 border-gray-400 dark:border-gray-500 my-2" />
      <div className="text-right">?</div>
    </div>
  );
}

function MultiplicationQuestion({ card }: CardProps) {
  const { multiplier, multiplicand } =
    card.content as MultiplicationContent;
  return (
    <ColumnarQuestion top={multiplier} operator="x" bottom={multiplicand} />
  );
}

function SubtractionQuestion({ card }: CardProps) {
  const { minuend, subtrahend } = card.content as SubtractionContent;
  return <ColumnarQuestion top={minuend} operator="−" bottom={subtrahend} />;
}

function GenericQuestion({ card }: CardProps) {
  return (
    <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6">
      {deckRegistry.getDeckForCard(card).formatQuestion(card)}
    </div>
  );
}

const questionDisplayMap: Partial<Record<DeckType, ComponentType<CardProps>>> = {
  [DeckType.MULTIPLICATION]: MultiplicationQuestion,
  [DeckType.SUBTRACTION]: SubtractionQuestion,
};

export default function QuestionDisplay({ card }: CardProps) {
  const Component = questionDisplayMap[card.deckId] ?? GenericQuestion;
  return <Component card={card} />;
}
