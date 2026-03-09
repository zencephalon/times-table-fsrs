import { getCardStats } from "@/lib/scheduler";
import type { Card } from "@/lib/types";

interface DeckPreparationScreenProps {
  deckName: string;
  deckDescription: string;
  deckCards: Card<unknown>[];
  deckIndex: number;
  totalDecks: number;
  onStart: () => void;
}

export default function DeckPreparationScreen({
  deckName,
  deckDescription,
  deckCards,
  deckIndex,
  totalDecks,
  onStart,
}: DeckPreparationScreenProps) {
  const stats = deckCards.length > 0 ? getCardStats(deckCards) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Deck {deckIndex + 1} of {totalDecks}
        </div>

        <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {deckName}
        </div>

        <div className="text-lg text-gray-600 dark:text-gray-400 mb-8">
          {deckDescription}
        </div>

        {stats && (
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
            {stats.due} cards due &bull; {stats.new} new cards &bull;{" "}
            {stats.learning} learning
          </div>
        )}

        <div className="mb-6">
          <div className="text-lg text-gray-600 dark:text-gray-400">
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
              Enter
            </kbd>{" "}
            to begin
          </div>
        </div>

        <button
          type="button"
          onClick={onStart}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Start Deck
        </button>
      </div>
    </div>
  );
}
