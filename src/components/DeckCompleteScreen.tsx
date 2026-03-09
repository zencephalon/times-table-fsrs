interface DeckCompleteScreenProps {
  deckName: string;
  cardsReviewed: number;
  reason: "no-due" | "limit-reached";
  hasNextDeck: boolean;
  onContinue: () => void;
}

export default function DeckCompleteScreen({
  deckName,
  cardsReviewed,
  reason,
  hasNextDeck,
  onContinue,
}: DeckCompleteScreenProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {deckName} Complete!
        </div>

        <div className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {cardsReviewed} card{cardsReviewed !== 1 ? "s" : ""} reviewed
        </div>

        <div className="text-sm text-gray-500 dark:text-gray-400 mb-8">
          {reason === "no-due"
            ? "No more cards due for review today."
            : "Reached the 50-card limit for this deck."}
        </div>

        {hasNextDeck ? (
          <>
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              Press{" "}
              <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
                Enter
              </kbd>{" "}
              to continue to the next deck
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next Deck
            </button>
          </>
        ) : (
          <>
            <div className="text-lg text-gray-600 dark:text-gray-400 mb-6">
              All decks completed for this session!
            </div>
            <button
              type="button"
              onClick={onContinue}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-8 rounded-lg text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
