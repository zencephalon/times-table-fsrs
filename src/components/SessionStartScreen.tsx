import { getCardStats } from "@/lib/scheduler";
import type { Card } from "@/lib/types";

interface SessionStartScreenProps {
  cards: Card<unknown>[];
  onStartSession: () => void;
  onChangeDeckSelection: () => void;
}

export default function SessionStartScreen({
  cards,
  onStartSession,
  onChangeDeckSelection,
}: SessionStartScreenProps) {
  const cardStats = cards.length > 0 ? getCardStats(cards) : null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto">
      <div className="text-center">
        <div className="mb-8">
          <div className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Ready to Practice?
          </div>
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            Press{" "}
            <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-sm font-mono">
              Enter
            </kbd>{" "}
            to start your practice session
          </div>
        </div>

        <button
          type="button"
          onClick={onStartSession}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Start Practice Session
        </button>

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          {cardStats && (
            <div>
              {cardStats.due} cards due • {cardStats.new} new cards •{" "}
              {cardStats.learning} learning
            </div>
          )}
        </div>

        <div className="mt-4">
          <button
            type="button"
            onClick={onChangeDeckSelection}
            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
          >
            ← Change deck selection
          </button>
        </div>
      </div>
    </div>
  );
}
