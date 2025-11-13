import { DeckType } from "@/lib/deck-types";
import { deckRegistry } from "@/lib/decks";
import type { MultiplicationContent } from "@/lib/decks/multiplication";
import type { Card } from "@/lib/types";

interface QuestionDisplayProps {
  card: Card<unknown>;
}

export default function QuestionDisplay({ card }: QuestionDisplayProps) {
  if (card.deckId === DeckType.MULTIPLICATION) {
    // Vertical format for multiplication
    return (
      <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 font-mono">
        <div className="text-right">
          {(card.content as MultiplicationContent).multiplier}
        </div>
        <div className="text-right">
          x {(card.content as MultiplicationContent).multiplicand}
        </div>
        <div className="border-t-4 border-gray-400 dark:border-gray-500 my-2"></div>
        <div className="text-right">?</div>
      </div>
    );
  }

  // Generic format for other decks
  return (
    <div className="text-6xl sm:text-7xl lg:text-8xl font-bold text-gray-900 dark:text-white mb-6">
      {deckRegistry.getDeckForCard(card).formatQuestion(card)}
    </div>
  );
}
