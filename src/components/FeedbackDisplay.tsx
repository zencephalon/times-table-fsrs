import type { RefObject } from "react";
import { deckRegistry } from "@/lib/decks";
import { createDefaultSpeedStats } from "@/lib/grading";
import type { Card, SessionData } from "@/lib/types";

interface FeedbackDisplayProps {
  feedback: {
    correct: boolean;
    correctAnswer?: string;
    userAnswer?: string;
    rating?: string;
    responseTime?: number;
  };
  needsCorrection: boolean;
  correctionAnswer: string;
  card: Card<unknown>;
  sessionData: SessionData;
  onCorrectionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onCorrectionKeyPress: (e: React.KeyboardEvent) => void;
  onCorrectionSubmit: () => void;
  onNextCard: () => void;
  correctionInputRef: RefObject<HTMLInputElement | null>;
}

export default function FeedbackDisplay({
  feedback,
  needsCorrection,
  correctionAnswer,
  card,
  sessionData,
  onCorrectionChange,
  onCorrectionKeyPress,
  onCorrectionSubmit,
  onNextCard,
  correctionInputRef,
}: FeedbackDisplayProps) {
  const deck = deckRegistry.getDeckForCard(card);
  const isNumberInput = deck.inputType === "number";
  const deckStats =
    sessionData.speedStats[card.deckId] || createDefaultSpeedStats();

  return (
    <div className="mb-6">
      <div
        className={`text-4xl font-bold mb-4 ${
          feedback.correct
            ? "text-green-600 dark:text-green-400"
            : "text-red-600 dark:text-red-400"
        }`}
      >
        {feedback.correct ? "✓ Correct!" : "✗ Incorrect"}
      </div>

      {!feedback.correct && (
        <div className="text-2xl text-gray-700 dark:text-gray-300 space-y-2">
          <div>
            Your answer:{" "}
            <span className="font-bold text-red-600 dark:text-red-400">
              {feedback.userAnswer}
            </span>
          </div>
          <div>
            Correct answer:{" "}
            <span className="font-bold text-green-600 dark:text-green-400">
              {feedback.correctAnswer}
            </span>
          </div>
        </div>
      )}

      {needsCorrection ? (
        <div className="mt-6">
          <div className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            Please enter the correct answer to continue:
          </div>
          <input
            ref={correctionInputRef}
            type="text"
            inputMode={isNumberInput ? "numeric" : "text"}
            value={correctionAnswer}
            onChange={onCorrectionChange}
            onKeyPress={onCorrectionKeyPress}
            className="text-xl font-bold text-center w-32 p-3 border-2 border-orange-300 dark:border-orange-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-orange-500 focus:outline-none"
            placeholder="Answer"
            maxLength={isNumberInput ? 5 : 20}
          />
          <div className="mt-3">
            <button
              type="button"
              onClick={onCorrectionSubmit}
              disabled={!correctionAnswer}
              className="bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Submit Correction
            </button>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Press Enter to submit the correct answer
          </p>
        </div>
      ) : (
        <div className="text-lg text-gray-600 dark:text-gray-400 mt-4">
          {feedback.correct ? "Great job!" : "Keep practicing!"}
        </div>
      )}

      {feedback.responseTime && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          Response time: {feedback.responseTime}ms
          {feedback.rating && (
            <span className="ml-2">
              • Rating: {feedback.rating}
              {!deckStats.isWarmedUp && (
                <span className="text-xs ml-1">(warmup)</span>
              )}
            </span>
          )}
        </div>
      )}

      {!needsCorrection && (
        <div className="mt-4">
          <button
            type="button"
            onClick={onNextCard}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-colors"
          >
            Next
          </button>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Press Enter or tap Next to continue
          </div>
        </div>
      )}
    </div>
  );
}
