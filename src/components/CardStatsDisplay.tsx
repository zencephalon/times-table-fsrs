import { deckRegistry } from "@/lib/decks";
import { createDefaultSpeedStats } from "@/lib/grading";
import { getCardStats } from "@/lib/scheduler";
import type { AppSettings, Card, SessionData } from "@/lib/types";

interface CardStatsDisplayProps {
  cards: Card<unknown>[];
  currentCard: Card<unknown> | null;
  sessionData: SessionData | null;
  sessionStartTime: Date | null;
  settings: AppSettings | null;
}

export default function CardStatsDisplay({
  cards,
  currentCard,
  sessionData,
  sessionStartTime,
  settings,
}: CardStatsDisplayProps) {
  const cardStats = cards.length > 0 ? getCardStats(cards) : null;

  return (
    <div className="mt-8 text-sm text-gray-500 dark:text-gray-400 space-y-2">
      {cardStats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
          <div>
            <div className="font-semibold text-blue-600 dark:text-blue-400">
              {cardStats.due}
            </div>
            <div>Due cards</div>
          </div>
          <div>
            <div className="font-semibold text-green-600 dark:text-green-400">
              {cardStats.new}
            </div>
            <div>New cards</div>
          </div>
          <div>
            <div className="font-semibold text-yellow-600 dark:text-yellow-400">
              {cardStats.learning}
            </div>
            <div>Learning</div>
          </div>
          <div>
            <div className="font-semibold text-purple-600 dark:text-purple-400">
              {cardStats.review}
            </div>
            <div>Review</div>
          </div>
        </div>
      )}
      {currentCard && (
        <div className="text-center mt-4">
          <div className="text-xs">
            Card State:{" "}
            {
              ["New", "Learning", "Review", "Relearning"][
                currentCard.fsrsCard.state
              ]
            }
            {currentCard.fsrsCard.state !== 0 && (
              <span className="ml-2">
                • Interval: {Math.round(currentCard.fsrsCard.elapsed_days)}d
              </span>
            )}
          </div>
        </div>
      )}
      {sessionData && currentCard && (
        <div className="text-center space-y-1">
          <div>
            {(() => {
              const deckStats =
                sessionData.speedStats[currentCard.deckId] ||
                createDefaultSpeedStats();
              return deckStats.isWarmedUp
                ? `Warmed up for ${deckRegistry.getDeckForCard(currentCard).name} (${deckStats.responses.length} responses)`
                : `Warmup (${deckRegistry.getDeckForCard(currentCard).name}): ${deckStats.responses.length}/${
                    settings?.warmupTarget || 50
                  }`;
            })()}
          </div>
          {sessionStartTime && (
            <div className="text-xs">
              Session started: {sessionStartTime.toLocaleTimeString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
