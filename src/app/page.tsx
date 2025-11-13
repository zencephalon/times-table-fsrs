"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { FSRS, Rating } from "ts-fsrs";
import ActionButtons from "@/components/ActionButtons";
import AnswerInput from "@/components/AnswerInput";
import CardStatsDisplay from "@/components/CardStatsDisplay";
import DeckSelector from "@/components/DeckSelector";
import ErrorDisplay from "@/components/ErrorDisplay";
import FeedbackDisplay from "@/components/FeedbackDisplay";
import LoadingScreen from "@/components/LoadingScreen";
import ProgressDashboard from "@/components/ProgressDashboard";
import QuestionDisplay from "@/components/QuestionDisplay";
import SessionStartScreen from "@/components/SessionStartScreen";
import Settings from "@/components/Settings";
import StatisticsModal from "@/components/StatisticsModal";
import UpcomingReviewsDisplay from "@/components/UpcomingReviewsDisplay";
import { DeckType, isCardOfDeck } from "@/lib/deck-types";
import { deckRegistry } from "@/lib/decks";
import type { KatakanaContent } from "@/lib/decks/katakana";
import {
  calculateGrade,
  createDefaultSpeedStats,
  createResponseRecord,
  updateSpeedStats,
} from "@/lib/grading";
import { getCardStats, getNextCard, getUpcomingReviews } from "@/lib/scheduler";
import {
  loadCards,
  loadSessionData,
  loadSettings,
  saveCards,
  saveSessionData,
  saveSettings,
} from "@/lib/storage";
import type { AppSettings, Card, SessionData } from "@/lib/types";

export default function Home() {
  const [cards, setCards] = useState<Card<unknown>[]>([]);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentCard, setCurrentCard] = useState<Card<unknown> | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<{
    show: boolean;
    correct: boolean;
    correctAnswer?: string;
    userAnswer?: string;
    rating?: string;
    responseTime?: number;
  }>({ show: false, correct: false });
  const [needsCorrection, setNeedsCorrection] = useState(false);
  const [correctionAnswer, setCorrectionAnswer] = useState("");
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(
    null,
  );
  const [cardStats, setCardStats] = useState<ReturnType<
    typeof getCardStats
  > | null>(null);
  const [upcomingReviews, setUpcomingReviews] = useState<number[]>([]);
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [showProgressDashboard, setShowProgressDashboard] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [deckSelectionComplete, setDeckSelectionComplete] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const correctionInputRef = useRef<HTMLInputElement>(null);
  const fsrs = new FSRS({});

  // Play celebration sound for correct answers
  const playCelebrationSound = () => {
    if (!settings?.soundEnabled) return;

    try {
      const audio = new Audio("/sound-fx/0.wav");
      audio.volume = 0.3; // Set volume to 30% to not be too loud
      audio.play().catch((error) => {
        console.warn("Could not play celebration sound:", error);
      });
    } catch (error) {
      console.warn("Could not load celebration sound:", error);
    }
  };

  // Play katakana character audio
  const playKatakanaAudio = (character: string) => {
    if (!settings?.soundEnabled) return;

    try {
      const audio = new Audio(`/katakana/${character}.wav`);
      audio.volume = 0.5; // Set volume to 50%
      audio.play().catch((error) => {
        console.warn(`Could not play katakana audio for ${character}:`, error);
      });
    } catch (error) {
      console.warn(`Could not load katakana audio for ${character}:`, error);
    }
  };

  const selectNextCard = useCallback((cardList: Card<unknown>[]) => {
    const nextCard = getNextCard(cardList);
    if (!nextCard) return;

    setCurrentCard(nextCard);
    setQuestionStartTime(performance.now());
    setFeedback({ show: false, correct: false });
    setUserAnswer("");
    setNeedsCorrection(false);
    setCorrectionAnswer("");

    // Update card stats and upcoming reviews
    setCardStats(getCardStats(cardList));
    setUpcomingReviews(getUpcomingReviews(cardList));

    // Focus input after a brief delay to ensure it's rendered
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }, []);

  useEffect(() => {
    const loadedCards = loadCards();
    const loadedSessionData = loadSessionData();
    const loadedSettings = loadSettings();

    setCards(loadedCards);
    setSessionData(loadedSessionData);
    setSettings(loadedSettings);
    setIsLoaded(true);

    // Start new session if it's been more than 4 hours since last review
    const now = new Date();
    const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);
    if (loadedSessionData.lastReviewDate < fourHoursAgo) {
      const newSessionData = {
        ...loadedSessionData,
        sessionStartTime: now,
        totalSessionTime: 0,
      };
      setSessionData(newSessionData);
      saveSessionData(newSessionData);
    }
    setSessionStartTime(loadedSessionData.sessionStartTime);

    // Load initial card stats for display on start screen
    if (loadedCards.length > 0) {
      setCardStats(getCardStats(loadedCards));
      setUpcomingReviews(getUpcomingReviews(loadedCards));
    }

    // Don't automatically select the first card - wait for user to start session
    // if (loadedCards.length > 0) {
    //   selectNextCard(loadedCards);
    // }
  }, []);

  const handleDeckToggle = useCallback(
    (deckId: DeckType, enabled: boolean) => {
      if (!settings) return;

      const newEnabledDecks = enabled
        ? [...settings.enabledDecks, deckId]
        : settings.enabledDecks.filter((id) => id !== deckId);

      const newSettings = {
        ...settings,
        enabledDecks: newEnabledDecks,
      };

      setSettings(newSettings);
      saveSettings(newSettings);

      // If enabling a deck, generate cards for it if they don't exist
      if (enabled) {
        const deckCards = cards.filter((card) => card.deckId === deckId);
        if (deckCards.length === 0) {
          // Generate new cards for this deck
          const newDeckCards = deckRegistry.getDeck(deckId).generateCards();
          const updatedCards = [...cards, ...newDeckCards];
          setCards(updatedCards);
          saveCards(updatedCards);
        }
      }
      // If disabling, we keep the cards but just don't show them
      // This preserves FSRS progress
    },
    [settings, cards],
  );

  const handleDeckSelectionComplete = useCallback(() => {
    setDeckSelectionComplete(true);
  }, []);

  const getFilteredCards = useCallback(() => {
    if (!settings) return cards;
    return deckRegistry.filterCardsByDecks(cards, settings.enabledDecks);
  }, [cards, settings]);

  const startSession = useCallback(() => {
    setSessionStarted(true);
    // Filter cards by enabled decks
    if (settings && cards.length > 0) {
      const filteredCards = getFilteredCards();
      selectNextCard(filteredCards);
    }
  }, [cards, settings, selectNextCard, getFilteredCards]);

  useEffect(() => {
    const handleGlobalKeyPress = (e: KeyboardEvent) => {
      // Don't handle shortcuts when modals are open
      if (showProgressDashboard || showStatistics || showSettings) return;

      // Handle deck selection completion
      if (
        !deckSelectionComplete &&
        e.key === "Enter" &&
        settings &&
        settings.enabledDecks.length > 0
      ) {
        e.preventDefault();
        handleDeckSelectionComplete();
        return;
      }

      // Handle session start
      if (deckSelectionComplete && !sessionStarted && e.key === "Enter") {
        e.preventDefault();
        startSession();
        return;
      }

      if (e.key === "Enter" && feedback.show && !needsCorrection) {
        e.preventDefault();
        selectNextCard(getFilteredCards());
      }

      // Keyboard shortcuts
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case "p":
            e.preventDefault();
            setShowProgressDashboard(true);
            break;
          case "s":
            e.preventDefault();
            setShowStatistics(true);
            break;
          case "b":
            e.preventDefault();
            setShowSettings(true);
            break;
        }
      }

      // Escape key to close modals
      if (e.key === "Escape") {
        setShowProgressDashboard(false);
        setShowStatistics(false);
        setShowSettings(false);
      }
    };

    window.addEventListener("keydown", handleGlobalKeyPress);
    return () => window.removeEventListener("keydown", handleGlobalKeyPress);
  }, [
    feedback.show,
    selectNextCard,
    getFilteredCards,
    showProgressDashboard,
    showStatistics,
    showSettings,
    sessionStarted,
    startSession,
    needsCorrection,
    deckSelectionComplete,
    handleDeckSelectionComplete,
    settings,
  ]);

  const handleSubmitAnswer = async () => {
    if (!currentCard || !questionStartTime || !sessionData || !settings) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const responseTime = performance.now() - questionStartTime;

      // Get deck-specific logic for this card
      const deck = deckRegistry.getDeckForCard(currentCard);

      // Check answer using deck-specific logic
      const answerCheck = deck.checkAnswer(currentCard, userAnswer);
      const isCorrect = answerCheck.isCorrect;

      // Get or create speed stats for this deck
      const deckId = currentCard.deckId;
      const currentDeckStats =
        sessionData.speedStats[deckId] || createDefaultSpeedStats();

      // Update speed statistics for this specific deck
      const newDeckStats = updateSpeedStats(
        currentDeckStats,
        responseTime,
        settings.warmupTarget,
      );

      // Calculate FSRS rating based on accuracy and speed (using deck-specific stats)
      const rating = calculateGrade(isCorrect, responseTime, newDeckStats);

      // Create response record
      const responseRecord = createResponseRecord(
        currentCard.id,
        userAnswer,
        answerCheck.correctAnswer,
        responseTime,
      );

      // Update FSRS card with the rating using scheduler
      const now = new Date();
      const reviewRecord = fsrs.repeat(currentCard.fsrsCard, now);

      // Get the updated FSRS card based on the rating
      let updatedFsrsCard: typeof currentCard.fsrsCard;
      switch (rating) {
        case 1: // Again
          updatedFsrsCard = reviewRecord[Rating.Again].card;
          break;
        case 2: // Hard
          updatedFsrsCard = reviewRecord[Rating.Hard].card;
          break;
        case 3: // Good
          updatedFsrsCard = reviewRecord[Rating.Good].card;
          break;
        case 4: // Easy
          updatedFsrsCard = reviewRecord[Rating.Easy].card;
          break;
        default:
          updatedFsrsCard = reviewRecord[Rating.Good].card; // Default to Good
      }

      // Update the card in our cards array
      const updatedCards = cards.map((card) =>
        card.id === currentCard.id
          ? { ...card, fsrsCard: updatedFsrsCard }
          : card,
      );

      // Update session data with new deck-specific stats
      const newSessionData: SessionData = {
        responses: [...sessionData.responses, responseRecord],
        speedStats: {
          ...sessionData.speedStats,
          [deckId]: newDeckStats, // Update only this deck's stats
        },
        lastReviewDate: now,
        sessionStartTime: sessionData.sessionStartTime,
        totalSessionTime: sessionData.totalSessionTime,
      };

      // Save updated data
      setCards(updatedCards);
      setSessionData(newSessionData);
      saveCards(updatedCards);
      saveSessionData(newSessionData);

      // Show feedback with rating information
      const ratingNames = { 1: "Again", 2: "Hard", 3: "Good", 4: "Easy" };
      setFeedback({
        show: true,
        correct: isCorrect,
        correctAnswer: answerCheck.correctAnswer,
        userAnswer: answerCheck.userAnswer,
        rating: ratingNames[rating as keyof typeof ratingNames],
        responseTime: Math.round(responseTime),
      });

      // Play audio feedback
      if (isCardOfDeck<KatakanaContent>(currentCard, DeckType.KATAKANA)) {
        // For katakana cards, play the character audio regardless of correctness
        playKatakanaAudio(currentCard.content.character);
      } else if (isCorrect) {
        // For other decks, play celebration sound only for correct answers
        playCelebrationSound();
      }

      // Set correction mode if answer is incorrect
      if (!isCorrect) {
        setNeedsCorrection(true);
        // Focus correction input after a brief delay to ensure it's rendered
        setTimeout(() => {
          correctionInputRef.current?.focus();
          correctionInputRef.current?.select(); // Also select the text for better UX
        }, 100);
      }
    } catch (err) {
      setError(
        `Failed to process answer: ${
          err instanceof Error ? err.message : "Unknown error"
        }`,
      );
      console.error("Error processing answer:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && userAnswer && !feedback.show) {
      handleSubmitAnswer();
    } else if (e.key === "Enter" && feedback.show && !needsCorrection) {
      e.preventDefault();
      selectNextCard(getFilteredCards());
    }
  };

  const handleCorrectionKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && needsCorrection) {
      handleCorrectionSubmit();
    }
  };

  const handleCorrectionSubmit = () => {
    if (!currentCard || !needsCorrection) return;

    // Get deck-specific logic for checking the correction
    const deck = deckRegistry.getDeckForCard(currentCard);
    const answerCheck = deck.checkAnswer(currentCard, correctionAnswer);

    if (answerCheck.isCorrect) {
      // Play audio feedback for correct correction
      if (isCardOfDeck<KatakanaContent>(currentCard, DeckType.KATAKANA)) {
        // For katakana cards, play the character audio
        playKatakanaAudio(currentCard.content.character);
      } else {
        // For other decks, play celebration sound
        playCelebrationSound();
      }
      setNeedsCorrection(false);
      setCorrectionAnswer("");
      // Allow proceeding to next card
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (!currentCard) {
      setUserAnswer(value);
      return;
    }

    // Get deck-specific input validation
    const deck = deckRegistry.getDeckForCard(currentCard);

    if (deck.inputType === "number") {
      // Only allow numeric input
      if (value === "" || /^\d+$/.test(value)) {
        setUserAnswer(value);
      }
    } else {
      // Allow any text input for text-based decks
      setUserAnswer(value);
    }
  };

  const handleCorrectionInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;

    if (!currentCard) {
      setCorrectionAnswer(value);
      return;
    }

    // Get deck-specific input validation
    const deck = deckRegistry.getDeckForCard(currentCard);

    if (deck.inputType === "number") {
      // Only allow numeric input
      if (value === "" || /^\d+$/.test(value)) {
        setCorrectionAnswer(value);
      }
    } else {
      // Allow any text input for text-based decks
      setCorrectionAnswer(value);
    }
  };

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Quick Kata
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Master skills through spaced repetition practice
          </p>

          <ActionButtons
            onShowProgress={() => setShowProgressDashboard(true)}
            onShowStatistics={() => setShowStatistics(true)}
            onShowSettings={() => setShowSettings(true)}
          />
        </header>

        {error && (
          <ErrorDisplay error={error} onDismiss={() => setError(null)} />
        )}

        <main className="max-w-4xl mx-auto">
          {cardStats && settings?.showUpcomingReviews && (
            <UpcomingReviewsDisplay upcomingReviews={upcomingReviews} />
          )}

          {/* Deck Selection Screen */}
          {!deckSelectionComplete && settings ? (
            <DeckSelector
              cards={cards}
              enabledDecks={settings.enabledDecks}
              onDeckToggle={handleDeckToggle}
              onStartPractice={handleDeckSelectionComplete}
            />
          ) : !sessionStarted ? (
            <SessionStartScreen
              cards={getFilteredCards()}
              onStartSession={startSession}
              onChangeDeckSelection={() => setDeckSelectionComplete(false)}
            />
          ) : (
            currentCard && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <div className="mb-8">
                    <QuestionDisplay card={currentCard} />
                  </div>

                  {!feedback.show ? (
                    <AnswerInput
                      card={currentCard}
                      value={userAnswer}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      onSubmit={handleSubmitAnswer}
                      inputRef={inputRef}
                      isSubmitting={isSubmitting}
                    />
                  ) : (
                    sessionData && (
                      <FeedbackDisplay
                        feedback={feedback}
                        needsCorrection={needsCorrection}
                        correctionAnswer={correctionAnswer}
                        card={currentCard}
                        sessionData={sessionData}
                        onCorrectionChange={handleCorrectionInputChange}
                        onCorrectionKeyPress={handleCorrectionKeyPress}
                        onCorrectionSubmit={handleCorrectionSubmit}
                        onNextCard={() => selectNextCard(getFilteredCards())}
                        correctionInputRef={correctionInputRef}
                      />
                    )
                  )}

                  <CardStatsDisplay
                    cards={getFilteredCards()}
                    currentCard={currentCard}
                    sessionData={sessionData}
                    sessionStartTime={sessionStartTime}
                    settings={settings}
                  />
                </div>
              </div>
            )
          )}
        </main>
      </div>

      {/* Progress Dashboard Modal */}
      {sessionData && (
        <ProgressDashboard
          cards={cards}
          sessionData={sessionData}
          isVisible={showProgressDashboard}
          onClose={() => setShowProgressDashboard(false)}
        />
      )}

      {sessionData && (
        <StatisticsModal
          sessionData={sessionData}
          isOpen={showStatistics}
          onClose={() => setShowStatistics(false)}
        />
      )}

      {/* Settings Modal */}
      {settings && (
        <Settings
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          onImportComplete={() => {
            // Reload all data after import
            const loadedCards = loadCards();
            const loadedSessionData = loadSessionData();
            const loadedSettings = loadSettings();
            setCards(loadedCards);
            setSessionData(loadedSessionData);
            setSettings(loadedSettings);
            if (loadedCards.length > 0) {
              selectNextCard(loadedCards);
            }
          }}
          settings={settings}
          onSettingsChange={(newSettings) => {
            setSettings(newSettings);
            saveSettings(newSettings);
          }}
        />
      )}
    </div>
  );
}
