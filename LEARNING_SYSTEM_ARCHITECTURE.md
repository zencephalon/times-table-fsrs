# Learning Management System Architecture Design

*Based on the multiplication FSRS app, this document outlines a scalable architecture for a comprehensive learning platform that can handle multiple subjects, languages, and algorithmic card generation.*

## Core Architecture: Domain-Driven Design with Plugin System

```typescript
// Core Domain Models
interface LearningCard {
  id: string;
  deckId: string;
  contentType: 'math' | 'language' | 'science' | 'custom';
  content: CardContent;
  fsrsState: FSRSCard;
  metadata: CardMetadata;
}

interface Deck {
  id: string;
  subjectId: string;
  name: string;
  description: string;
  language: string;
  difficulty: DifficultyLevel;
  cardCount: number;
  generatorConfig?: GeneratorConfig;
}

interface Subject {
  id: string;
  name: string;
  category: 'math' | 'language' | 'science' | 'custom';
  icon: string;
  availableLanguages: string[];
  practiceComponent: string; // Component name for rendering
  generatorPlugins: GeneratorPlugin[];
}
```

## Plugin Architecture for Extensibility

```typescript
// Subject-specific plugins
interface SubjectPlugin {
  id: string;
  name: string;
  version: string;

  // Card generation
  generators: GeneratorPlugin[];

  // Custom practice interface
  practiceComponent: React.ComponentType<PracticeProps>;

  // Grading logic
  gradingStrategy: GradingStrategy;

  // Progress tracking
  progressMetrics: ProgressMetric[];
}

// Example: Math plugin
const mathPlugin: SubjectPlugin = {
  id: 'math-core',
  generators: [
    multiplicationGenerator,
    divisionGenerator,
    algebraGenerator,
    geometryGenerator
  ],
  practiceComponent: MathPracticeInterface,
  gradingStrategy: speedBasedGrading,
  progressMetrics: ['accuracy', 'speed', 'retention']
};

// Example: Language plugin
const languagePlugin: SubjectPlugin = {
  id: 'language-core',
  generators: [
    vocabularyGenerator,
    grammarGenerator,
    conjugationGenerator
  ],
  practiceComponent: LanguagePracticeInterface,
  gradingStrategy: accuracyBasedGrading,
  progressMetrics: ['comprehension', 'fluency', 'retention']
};
```

## Algorithmic Card Generation System

```typescript
interface GeneratorConfig {
  templateId: string;
  parameters: Record<string, any>;
  constraints: GenerationConstraint[];
  count: number;
}

interface CardTemplate {
  id: string;
  contentType: string;
  questionTemplate: string;
  answerTemplate: string;
  variables: TemplateVariable[];
  difficulty: DifficultyCalculator;
}

// Example: Multiplication template
const multiplicationTemplate: CardTemplate = {
  id: 'multiplication-basic',
  contentType: 'math',
  questionTemplate: '${a} × ${b}',
  answerTemplate: '${result}',
  variables: [
    { name: 'a', range: [2, 9], type: 'integer' },
    { name: 'b', range: [2, 99], type: 'integer' }
  ],
  difficulty: (vars) => Math.log2(vars.a * vars.b)
};

// Example: Spanish vocabulary template
const spanishVocabTemplate: CardTemplate = {
  id: 'spanish-vocab-noun',
  contentType: 'language',
  questionTemplate: '${englishWord}',
  answerTemplate: '${spanishWord}',
  variables: [
    { name: 'englishWord', source: 'vocabulary_db', category: 'nouns' },
    { name: 'spanishWord', source: 'vocabulary_db', linked: 'englishWord' }
  ],
  difficulty: (vars) => vars.frequencyRank / 1000
};
```

## Data Architecture: Multi-Domain Persistence

```typescript
interface UserProfile {
  id: string;
  preferences: UserPreferences;
  subjects: Record<string, SubjectProgress>;
  globalStats: GlobalLearningStats;
}

interface SubjectProgress {
  subjectId: string;
  decks: Record<string, DeckProgress>;
  overallStats: SubjectStats;
  currentStreak: number;
  lastPracticed: Date;
}

interface DeckProgress {
  deckId: string;
  cards: Record<string, CardProgress>;
  fsrsScheduler: FSRSScheduler;
  statistics: DeckStatistics;
  masteryLevel: number; // 0-100
}

// Storage Strategy
class StorageService {
  // localStorage for demo/offline
  // IndexedDB for large datasets
  // Remote sync for multi-device

  async getDeck(deckId: string): Promise<Deck>;
  async getCards(deckId: string, limit?: number): Promise<LearningCard[]>;
  async updateCardProgress(cardId: string, response: UserResponse): Promise<void>;
  async syncProgress(): Promise<void>;
}
```

## Application Architecture: Layered Services

```typescript
// Service Layer
class LearningOrchestrator {
  constructor(
    private subjectRegistry: SubjectRegistry,
    private cardGenerator: CardGenerationService,
    private progressTracker: ProgressTrackingService,
    private scheduler: SchedulingService
  ) {}

  async startPracticeSession(subjectId: string, deckId: string): Promise<PracticeSession> {
    const subject = await this.subjectRegistry.getSubject(subjectId);
    const deck = await this.getDeck(deckId);
    const dueCards = await this.scheduler.getDueCards(deckId);

    return new PracticeSession({
      subject,
      deck,
      cards: dueCards,
      gradingStrategy: subject.gradingStrategy
    });
  }
}

// Plugin Registry
class SubjectRegistry {
  private plugins = new Map<string, SubjectPlugin>();

  registerPlugin(plugin: SubjectPlugin): void;
  getSubject(id: string): Promise<Subject>;
  getAvailableSubjects(): Promise<Subject[]>;
  getGenerators(subjectId: string): Promise<GeneratorPlugin[]>;
}

// Card Generation Service
class CardGenerationService {
  async generateDeck(config: GeneratorConfig): Promise<LearningCard[]> {
    const template = await this.getTemplate(config.templateId);
    const generator = this.getGenerator(template.contentType);

    return generator.generate(template, config);
  }
}
```

## Frontend Architecture: Modular Components

```typescript
// Main App Structure
src/
├── app/
│   ├── dashboard/          # Subject selection & progress overview
│   ├── practice/[subject]/ # Subject-specific practice routes
│   └── decks/[deckId]/     # Individual deck management
├── components/
│   ├── core/               # Shared UI components
│   ├── subjects/           # Subject-specific components
│   │   ├── math/
│   │   ├── language/
│   │   └── science/
│   └── practice/           # Practice session components
├── lib/
│   ├── core/               # Core domain logic
│   ├── plugins/            # Subject plugin system
│   ├── storage/            # Multi-strategy persistence
│   └── services/           # Business logic services
└── plugins/
    ├── math-plugin/
    ├── spanish-plugin/
    ├── french-plugin/
    └── science-plugin/

// Dynamic Plugin Loading
const PracticeInterface = ({ subjectId, deckId }) => {
  const subject = useSubject(subjectId);
  const PracticeComponent = subject.practiceComponent;

  return (
    <PracticeComponent
      deckId={deckId}
      gradingStrategy={subject.gradingStrategy}
      onProgress={handleProgress}
    />
  );
};
```

## Key Architectural Benefits

1. **Extensibility**: New subjects added via plugins without core changes
2. **Algorithmic Generation**: Templates + rules = infinite content variety
3. **Multi-language**: Built-in i18n with language-specific generators
4. **Scalable Storage**: Tiered storage strategy (localStorage → IndexedDB → Cloud)
5. **Personalized Learning**: Cross-domain progress tracking with adaptive algorithms
6. **Performance**: Lazy loading of subjects, efficient card scheduling
7. **Offline-First**: Works without network, syncs when available

## Implementation Strategy

### Phase 1: Core Infrastructure
- Plugin system foundation
- Multi-deck storage architecture
- Subject registry and routing

### Phase 2: First Additional Subject
- Language learning plugin
- Vocabulary generation templates
- Multi-modal practice interface

### Phase 3: Advanced Features
- Cross-subject analytics
- Adaptive difficulty algorithms
- Cloud synchronization

### Phase 4: Ecosystem Expansion
- Third-party plugin support
- Content marketplace
- Advanced pedagogical features

This architecture transforms the focused multiplication app into a comprehensive, extensible learning platform while maintaining the proven SRS foundation already built.