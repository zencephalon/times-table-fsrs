import { deckRegistry } from "@/lib/decks";
import { DeckType } from "@/lib/deck-types";
import type { Card } from "@/lib/types";

interface DeckSelectorProps {
  cards: Card<unknown>[];
  enabledDecks: DeckType[];
  onDeckToggle: (deckId: DeckType, enabled: boolean) => void;
  onStartPractice: () => void;
  cardStats?: {
    due: number;
    new: number;
    learning: number;
    review: number;
  };
}

export default function DeckSelector({
  cards,
  enabledDecks,
  onDeckToggle,
  onStartPractice,
}: DeckSelectorProps) {
  const allDecks = deckRegistry.getAllDecks();
  const enabledSet = new Set(enabledDecks);

  // Calculate stats per deck
  const getDeckStats = (deckId: DeckType) => {
    const deckCards = cards.filter((card) => card.deckId === deckId);
    const now = new Date();
    const dueCards = deckCards.filter(
      (card) => card.fsrsCard.due.getTime() <= now.getTime(),
    );
    const newCards = deckCards.filter((card) => card.fsrsCard.state === 0);
    const learningCards = deckCards.filter((card) => card.fsrsCard.state === 1);

    return {
      total: deckCards.length,
      due: dueCards.length,
      new: newCards.length,
      learning: learningCards.length,
    };
  };

  const canStartPractice = enabledDecks.length > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Select Practice Decks
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Choose which decks you want to practice. You can enable multiple decks
          at once.
        </p>
      </div>

      <div className="space-y-4 mb-8">
        {allDecks.map((deck) => {
          const isEnabled = enabledSet.has(deck.id);
          const stats = getDeckStats(deck.id);

          return (
            <div
              key={deck.id}
              className={`border-2 rounded-lg p-6 transition-all cursor-pointer ${
                isEnabled
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
              onClick={() => onDeckToggle(deck.id, !isEnabled)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {/* Checkbox */}
                    <div
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                        isEnabled
                          ? "bg-blue-600 border-blue-600"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    >
                      {isEnabled && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <title>Enabled</title>
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {deck.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {deck.description}
                      </p>
                    </div>
                  </div>

                  {/* Statistics */}
                  <div className="ml-9 mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                    <div className="bg-white dark:bg-gray-700 rounded px-3 py-2">
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {stats.total}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Total
                      </div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded px-3 py-2">
                      <div className="font-semibold text-blue-600 dark:text-blue-400">
                        {stats.due}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">Due</div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded px-3 py-2">
                      <div className="font-semibold text-green-600 dark:text-green-400">
                        {stats.new}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">New</div>
                    </div>
                    <div className="bg-white dark:bg-gray-700 rounded px-3 py-2">
                      <div className="font-semibold text-yellow-600 dark:text-yellow-400">
                        {stats.learning}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        Learning
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Start Practice Button */}
      <div className="text-center">
        <button
          type="button"
          onClick={onStartPractice}
          disabled={!canStartPractice}
          className={`text-xl font-semibold py-4 px-8 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            canStartPractice
              ? "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500"
              : "bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed"
          }`}
        >
          {canStartPractice
            ? "Start Practice Session"
            : "Select at least one deck"}
        </button>

        {canStartPractice && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
            Press <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs font-mono">Enter</kbd> to start
          </p>
        )}
      </div>
    </div>
  );
}
