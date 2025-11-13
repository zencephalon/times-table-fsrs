import { DeckType } from "./deck-types";
import { deckRegistry } from "./decks";
import type { MultiplicationContent } from "./decks/multiplication";
import type {
  AppSettings,
  Card,
  ResponseRecord,
  SessionData,
  SpeedStats,
} from "./types";

const STORAGE_KEYS = {
  CARDS: "multiplicationCards",
  SESSION: "sessionData",
  SETTINGS: "appSettings",
  DATA_VERSION: "dataVersion",
} as const;

const CURRENT_DATA_VERSION = "2.0.0"; // Updated for deck system

/**
 * Initialize default session data
 */
function createDefaultSessionData(): SessionData {
  const now = new Date();
  return {
    responses: [],
    speedStats: {}, // Empty object - stats created per deck as needed
    lastReviewDate: now,
    sessionStartTime: now,
    totalSessionTime: 0,
  };
}

/**
 * Initialize default app settings
 */
function createDefaultSettings(): AppSettings {
  return {
    warmupTarget: 50,
    soundEnabled: true,
    showUpcomingReviews: true,
    enabledDecks: [DeckType.MULTIPLICATION], // Default to multiplication only
  };
}

/**
 * Migrate old MultiplicationCard format to new Card<MultiplicationContent> format
 */
interface OldMultiplicationCard {
  id: string;
  multiplicand: number;
  multiplier: number;
  fsrsCard: unknown;
}

function migrateOldCards(oldCards: OldMultiplicationCard[]): Card<unknown>[] {
  console.log("Migrating", oldCards.length, "cards to new deck format");

  return oldCards.map((oldCard) => ({
    id: oldCard.id,
    deckId: DeckType.MULTIPLICATION,
    content: {
      multiplicand: oldCard.multiplicand,
      multiplier: oldCard.multiplier,
    } as MultiplicationContent,
    fsrsCard: {
      ...(oldCard.fsrsCard as Record<string, unknown>),
      due: new Date((oldCard.fsrsCard as { due: string }).due),
      last_review: (oldCard.fsrsCard as { last_review?: string }).last_review
        ? new Date((oldCard.fsrsCard as { last_review: string }).last_review)
        : undefined,
    },
  })) as Card<unknown>[];
}

/**
 * Load cards from localStorage or generate them if not found
 */
export function loadCards(): Card<unknown>[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CARDS);
    const dataVersion = localStorage.getItem(STORAGE_KEYS.DATA_VERSION);

    if (stored) {
      const parsedCards = JSON.parse(stored) as unknown[];

      // Check if we need to migrate from old format
      if (!dataVersion || dataVersion < "2.0.0") {
        // Old format: MultiplicationCard[]
        const oldCards = parsedCards as OldMultiplicationCard[];

        // Check if it's the old format (has multiplicand/multiplier instead of deckId)
        if (
          oldCards.length > 0 &&
          "multiplicand" in oldCards[0] &&
          !("deckId" in oldCards[0])
        ) {
          console.log(
            "Detected old card format, migrating to new deck system...",
          );
          const migratedCards = migrateOldCards(oldCards);
          saveCards(migratedCards);
          localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
          return migratedCards;
        }
      }

      // New format: Card<unknown>[]
      const cards = parsedCards as Card<unknown>[];

      // Parse dates that were serialized as strings in FSRS cards
      const parsedDateCards = cards.map((card) => ({
        ...card,
        fsrsCard: {
          ...card.fsrsCard,
          due: new Date(card.fsrsCard.due as unknown as string),
          last_review: card.fsrsCard.last_review
            ? new Date(card.fsrsCard.last_review as unknown as string)
            : undefined,
        },
      }));

      return parsedDateCards;
    }
  } catch (error) {
    console.warn("Failed to load cards from storage:", error);
  }

  // Generate new cards if loading failed or incomplete
  const settings = loadSettings();
  const cards = deckRegistry.generateCardsForDecks(settings.enabledDecks);
  saveCards(cards);
  localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
  return cards;
}

/**
 * Save cards to localStorage
 */
export function saveCards(cards: Card<unknown>[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(cards));
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);
  } catch (error) {
    console.error("Failed to save cards to storage:", error);
  }
}

/**
 * Load session data from localStorage
 */
export function loadSessionData(): SessionData {
  if (typeof window === "undefined") return createDefaultSessionData();

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SESSION);
    if (stored) {
      const data = JSON.parse(stored) as SessionData;

      // Parse dates that were serialized as strings
      data.lastReviewDate = new Date(data.lastReviewDate);
      data.sessionStartTime = new Date(
        data.sessionStartTime || data.lastReviewDate,
      );
      data.totalSessionTime = data.totalSessionTime || 0;
      data.responses = data.responses.map((r) => ({
        ...r,
        timestamp: new Date(r.timestamp),
      }));

      // Migrate old speedStats format (single object) to new format (per-deck)
      if (data.speedStats && !isPerDeckSpeedStats(data.speedStats)) {
        console.log("Migrating speedStats to per-deck format");
        const oldStats = data.speedStats as unknown as SpeedStats;
        data.speedStats = {
          [DeckType.MULTIPLICATION]: oldStats,
        };
        saveSessionData(data);
      }

      // Ensure speedStats is an object
      if (!data.speedStats) {
        data.speedStats = {};
      }

      return data;
    }
  } catch (error) {
    console.warn("Failed to load session data from storage:", error);
  }

  const defaultData = createDefaultSessionData();
  saveSessionData(defaultData);
  return defaultData;
}

/**
 * Type guard to check if speedStats is in the new per-deck format
 */
function isPerDeckSpeedStats(
  speedStats: unknown,
): speedStats is Record<string, SpeedStats> {
  if (typeof speedStats !== "object" || speedStats === null) return false;

  // Old format has 'responses' and 'percentiles' directly
  if ("responses" in speedStats && "percentiles" in speedStats) {
    return false;
  }

  // New format has deck IDs as keys
  return true;
}

/**
 * Save session data to localStorage
 */
export function saveSessionData(data: SessionData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save session data to storage:", error);
  }
}

/**
 * Load app settings from localStorage
 */
export function loadSettings(): AppSettings {
  if (typeof window === "undefined") return createDefaultSettings();

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (stored) {
      const settings = JSON.parse(stored) as Partial<AppSettings>;

      // Migrate old settings that don't have enabledDecks
      if (!settings.enabledDecks) {
        console.log("Migrating settings: adding enabledDecks field");
        const migratedSettings: AppSettings = {
          ...createDefaultSettings(),
          ...settings,
          enabledDecks: [DeckType.MULTIPLICATION], // Default to multiplication
        };
        saveSettings(migratedSettings);
        return migratedSettings;
      }

      return settings as AppSettings;
    }
  } catch (error) {
    console.warn("Failed to load settings from storage:", error);
  }

  const defaultSettings = createDefaultSettings();
  saveSettings(defaultSettings);
  return defaultSettings;
}

/**
 * Save app settings to localStorage
 */
export function saveSettings(settings: AppSettings): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error("Failed to save settings to storage:", error);
  }
}

/**
 * Clear all stored data (useful for development/testing)
 */
export function clearAllData(): void {
  if (typeof window === "undefined") return;

  Object.values(STORAGE_KEYS).forEach((key) => {
    localStorage.removeItem(key);
  });
}

/**
 * Export data structure for JSON backup
 */
export interface ExportData {
  version: string;
  exportDate: string;
  cards: Card<unknown>[];
  sessionData: SessionData;
  settings: AppSettings;
}

/**
 * Export all data as JSON string
 */
export function exportData(): string {
  const cards = loadCards();
  const sessionData = loadSessionData();
  const settings = loadSettings();

  const exportData: ExportData = {
    version: "1.0.0",
    exportDate: new Date().toISOString(),
    cards,
    sessionData,
    settings,
  };

  return JSON.stringify(exportData, null, 2);
}

/**
 * Validate imported data structure
 */
function validateImportData(data: unknown): data is ExportData {
  if (!data || typeof data !== "object") return false;
  const typedData = data as Record<string, unknown>;
  if (!typedData.version || typeof typedData.version !== "string") return false;
  if (!typedData.exportDate || typeof typedData.exportDate !== "string")
    return false;
  if (!Array.isArray(typedData.cards)) return false;
  if (!typedData.sessionData || typeof typedData.sessionData !== "object")
    return false;
  if (!typedData.settings || typeof typedData.settings !== "object")
    return false;

  // Validate cards structure (at least one card)
  if (typedData.cards.length === 0) return false;
  const sampleCard = (typedData.cards as unknown[])[0] as Record<
    string,
    unknown
  >;

  // Check for new format (has deckId) or old format (has multiplicand)
  const hasNewFormat = "deckId" in sampleCard && "content" in sampleCard;
  const hasOldFormat =
    "multiplicand" in sampleCard && "multiplier" in sampleCard;

  if (
    !sampleCard?.id ||
    !sampleCard?.fsrsCard ||
    !(hasNewFormat || hasOldFormat)
  )
    return false;

  // Validate session data structure
  const sessionData = typedData.sessionData as Record<string, unknown>;
  if (!Array.isArray(sessionData.responses)) return false;
  if (!sessionData.speedStats || !sessionData.lastReviewDate) return false;

  return true;
}

/**
 * Import data from JSON string
 */
export function importData(jsonString: string): {
  success: boolean;
  error?: string;
} {
  try {
    const data = JSON.parse(jsonString);

    if (!validateImportData(data)) {
      return { success: false, error: "Invalid data format" };
    }

    let cards: Card<unknown>[];

    // Check if data is in old format and migrate if needed
    const sampleCard = data.cards[0] as unknown as Record<string, unknown>;
    if ("multiplicand" in sampleCard && !("deckId" in sampleCard)) {
      console.log("Importing old format data, migrating to new deck system...");
      const oldCards = data.cards as unknown as OldMultiplicationCard[];
      cards = migrateOldCards(oldCards);
    } else {
      // Parse dates in cards (data is validated as ExportData)
      cards = data.cards.map((card: Card<unknown>) => ({
        ...card,
        fsrsCard: {
          ...card.fsrsCard,
          due: new Date(card.fsrsCard.due as unknown as string),
          last_review: card.fsrsCard.last_review
            ? new Date(card.fsrsCard.last_review as unknown as string)
            : undefined,
        },
      }));
    }

    // Parse dates in session data
    const sessionData = {
      ...data.sessionData,
      lastReviewDate: new Date(
        data.sessionData.lastReviewDate as unknown as string,
      ),
      sessionStartTime: new Date(
        data.sessionData.sessionStartTime as unknown as string,
      ),
      responses: data.sessionData.responses.map((r: ResponseRecord) => ({
        ...r,
        timestamp: new Date(r.timestamp as unknown as string),
      })),
    };

    // Migrate settings if needed
    const settings = data.settings as Partial<AppSettings>;
    const migratedSettings: AppSettings = {
      ...createDefaultSettings(),
      ...settings,
      enabledDecks: settings.enabledDecks || [DeckType.MULTIPLICATION],
    };

    // Save imported data
    saveCards(cards);
    saveSessionData(sessionData);
    saveSettings(migratedSettings);
    localStorage.setItem(STORAGE_KEYS.DATA_VERSION, CURRENT_DATA_VERSION);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Create and download backup file
 */
export function downloadBackup(): void {
  if (typeof window === "undefined") return;

  const jsonData = exportData();
  const blob = new Blob([jsonData], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const timestamp = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const filename = `times-table-fsrs-backup-${timestamp}.json`;

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
