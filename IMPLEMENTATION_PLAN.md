# Implementation Plan: Multi-Deck Support with Katakana

## Overview
Expand the app to support multiple decks of flashcards. Users can toggle which decks are enabled before starting reviews. Only cards from enabled decks will appear in practice sessions.

## Architecture Changes

### Core Abstractions Needed
1. **Generic Card System**: Replace `MultiplicationCard` with deck-agnostic card type
2. **Deck Interface**: Define what a deck is (id, name, card generator, validators)
3. **Deck Registry**: System to register and manage available decks
4. **Deck Selection UI**: Interface for enabling/disabling decks before session
5. **Filtered Card Selection**: Update scheduler to only pull from enabled decks

### New Data Structures
- `DeckType`: Enum of available deck types (multiplication, katakana)
- `DeckDefinition`: Interface defining deck behavior (generate, validate, format)
- `Card<T>`: Generic card with deckId and deck-specific content
- `DeckSettings`: Which decks are enabled (stored in localStorage)

---

## Stage 1: Create Deck Abstraction Layer
**Goal**: Define core deck system without breaking existing multiplication functionality
**Success Criteria**:
- New types compile successfully
- Existing app still works unchanged
- Deck interface clearly defines required methods

**Implementation**:
1. Create `src/lib/deck-types.ts` with:
   - `DeckType` enum
   - `Card<TContent>` generic interface
   - `DeckDefinition<TContent>` interface
   - `DeckRegistry` class

2. Create `src/lib/decks/` directory structure:
   - `multiplication.ts` - Refactor existing multiplication logic
   - `katakana.ts` - New Katakana deck (stub)
   - `index.ts` - Export deck registry

**Tests**:
- [ ] App compiles without errors
- [ ] Existing multiplication practice works
- [ ] Can register and retrieve deck definitions

**Status**: ✅ Complete

---

## Stage 2: Refactor Multiplication into Deck System
**Goal**: Convert existing multiplication code to use new deck abstraction
**Success Criteria**:
- Multiplication works identically to before
- Uses new Card<MultiplicationContent> type
- All existing features functional (grading, FSRS, etc.)

**Implementation**:
1. ✅ Updated `src/lib/types.ts`:
   - Replaced `MultiplicationCard` with `Card<MultiplicationContent>`
   - Added `enabledDecks: DeckType[]` to `AppSettings`
   - Made ResponseRecord.answer support both number and string

2. ✅ Updated `src/lib/decks/multiplication.ts`:
   - Implemented `DeckDefinition<MultiplicationContent>`
   - Moved card generation logic
   - Implemented helper functions (checkAnswer, formatQuestion)

3. ✅ Updated `src/lib/storage.ts`:
   - Handles generic Card type
   - Stores/loads enabled decks in settings
   - Complete migration logic for existing data (v1 → v2)
   - Data version tracking

4. ✅ Updated `src/lib/scheduler.ts`:
   - Works with generic Card<unknown>[] type
   - All scheduling functions updated

5. ✅ Updated `src/app/page.tsx`:
   - Uses deck registry for answer checking
   - Uses deck-specific formatQuestion
   - Handles both multiplication and generic deck display

6. ✅ Updated `src/components/ProgressDashboard.tsx`:
   - Works with generic Card type

**Tests**:
- ✅ Build succeeds without errors
- ✅ Dev server starts successfully
- ✅ Data migration logic in place
- Need user testing: Load existing localStorage, practice multiplication

**Status**: ✅ Complete - Ready for user testing

---

## Stage 3: Create Katakana Deck
**Goal**: Add complete Katakana → Romaji deck implementation
**Success Criteria**:
- Generate all 46 basic Katakana cards
- Text input validation (romaji)
- Cards integrate with FSRS system
- Can practice Katakana independently

**Implementation**:
1. Define Katakana data in `src/lib/decks/katakana.ts`:
   - 46 basic Katakana characters (ア-ン)
   - Romaji mappings
   - Alternative romanizations (shi/si, chi/ti, etc.)

2. Implement `DeckDefinition<KatakanaContent>`:
   ```typescript
   interface KatakanaContent {
     character: string;    // e.g., "ア"
     romaji: string[];     // e.g., ["a"] or ["shi", "si"]
   }
   ```
   - `generateCards()`: Create 46 Katakana cards
   - `formatQuestion()`: Return katakana character
   - `checkAnswer()`: Compare romaji (case-insensitive, accept alternatives)
   - `inputType`: 'text' (not 'number')

3. Register Katakana deck in registry

**Tests**:
- [ ] Generate 46 Katakana cards
- [ ] Question displays correct character
- [ ] Accept primary romaji (e.g., "shi")
- [ ] Accept alternative romaji (e.g., "si")
- [ ] Case-insensitive matching
- [ ] FSRS scheduling works for Katakana cards

**Status**: Pending

---

## Stage 4: Build Deck Selection UI
**Goal**: Add UI for selecting decks before starting practice session
**Success Criteria**:
- Clear deck selection screen before session starts
- Toggle decks on/off
- Show card counts per deck
- Save selection to localStorage

**Implementation**:
1. Create `src/components/DeckSelector.tsx`:
   - Display available decks with descriptions
   - Checkbox/toggle for each deck
   - Show card counts (total, new, due)
   - "Start Practice" button (disabled if no decks selected)

2. Update `src/app/page.tsx`:
   - Show deck selector instead of "Ready to Practice?"
   - Store enabled decks in settings
   - Only show session start after deck selection

3. Design considerations:
   - Default: All decks enabled for first-time users
   - Remember last selection
   - Easy to change between sessions

**Tests**:
- [ ] Deck selector displays all registered decks
- [ ] Can enable/disable individual decks
- [ ] Settings persist to localStorage
- [ ] Cannot start with no decks enabled
- [ ] Card counts accurate per deck

**Status**: Pending

---

## Stage 5: Update Practice Session for Multi-Deck
**Goal**: Practice session handles multiple deck types correctly
**Success Criteria**:
- Questions display correctly for each deck type
- Input type adapts (number vs text)
- Answer validation uses correct deck logic
- FSRS scheduling works across all enabled decks

**Implementation**:
1. Update `src/app/page.tsx`:
   - Detect current card's deck type
   - Render appropriate input component:
     - `<input type="number">` for multiplication
     - `<input type="text">` for katakana
   - Use deck's `checkAnswer()` method
   - Use deck's `formatQuestion()` method

2. Update card selection logic:
   - Only select from cards belonging to enabled decks
   - Maintain FSRS priority (due date, state)

3. UI polish:
   - Show current deck name/icon
   - Deck-specific styling/theming
   - Appropriate feedback messages

**Tests**:
- [ ] Can practice only multiplication
- [ ] Can practice only Katakana
- [ ] Can practice both simultaneously
- [ ] Correct input type for each deck
- [ ] Answer validation works per deck
- [ ] FSRS scheduling considers all enabled decks
- [ ] Statistics track per-deck performance

**Status**: Pending

---

## Stage 6: Testing & Polish
**Goal**: Ensure system robustness and good UX
**Success Criteria**:
- All existing features work
- Smooth deck switching
- Data migration successful
- No performance issues

**Implementation**:
1. Test data migration:
   - Old localStorage format → new format
   - 784 multiplication cards preserved
   - FSRS state intact

2. Test edge cases:
   - Switch decks mid-session
   - Disable all decks (should prevent start)
   - Large number of cards
   - Special characters in Katakana input

3. Polish:
   - Loading states
   - Error handling
   - Keyboard shortcuts for deck selector
   - Mobile responsiveness

**Tests**:
- [ ] Existing users' data migrates correctly
- [ ] No console errors
- [ ] Smooth performance with multiple decks
- [ ] Mobile-friendly deck selection
- [ ] Accessible keyboard navigation

**Status**: Pending

---

## Implementation Notes

### Key Design Decisions
1. **Generic Card Type**: `Card<TContent>` allows type-safe deck-specific content
2. **Deck Registry**: Centralized place to register all available decks
3. **Input Abstraction**: Each deck specifies its input type (number/text)
4. **Answer Validation**: Deck-specific logic for correct/incorrect
5. **Storage Strategy**: Single cards array with deckId, filter at runtime

### Data Migration Strategy
- Check localStorage version
- If old format detected, migrate:
  - Wrap multiplication cards with deckId
  - Add enabledDecks to settings (default: [multiplication])
- Preserve all FSRS state during migration

### Testing Strategy
- Test each stage incrementally
- Ensure existing functionality at each step
- Use console.logs to verify card filtering
- Manual testing of both decks

### Future Extensibility
This architecture supports adding more decks:
- Hiragana
- Kanji readings
- Vocabulary
- Historical facts
- Geography capitals
Each deck implements `DeckDefinition` interface
