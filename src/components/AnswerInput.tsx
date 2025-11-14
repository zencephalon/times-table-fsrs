import type { RefObject } from "react";
import { deckRegistry } from "@/lib/decks";
import type { Card } from "@/lib/types";

interface AnswerInputProps {
  card: Card<unknown>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  onSubmit: () => void;
  inputRef: RefObject<HTMLInputElement | null>;
  isSubmitting: boolean;
}

export default function AnswerInput({
  card,
  value,
  onChange,
  onKeyPress,
  onSubmit,
  inputRef,
  isSubmitting,
}: AnswerInputProps) {
  const deck = deckRegistry.getDeckForCard(card);
  const isNumberInput = deck.inputType === "number";

  return (
    <div className="mb-6">
      <input
        ref={inputRef}
        type="text"
        inputMode={isNumberInput ? "numeric" : "text"}
        value={value}
        onChange={onChange}
        onKeyPress={onKeyPress}
        className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center w-48 sm:w-56 lg:w-64 p-3 sm:p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 focus:outline-none"
        placeholder={isNumberInput ? "Number" : "Your answer"}
        maxLength={isNumberInput ? 5 : 20}
      />
    </div>
  );
}
