import { communicationAnalytics } from './communicationAnalytics';

export interface Suggestion {
  text: string;
  confidence: number;
  type: 'word' | 'phrase' | 'completion';
  context?: string;
  frequency?: number;
}

export interface PredictionContext {
  currentSentence: string[];
  timeOfDay: number; // 0-23
  dayOfWeek: number; // 0-6
  recentWords: string[];
  userHistory: string[];
}

class SmartPredictionEngine {
  private wordTransitions: Map<string, Map<string, number>> = new Map();
  private phrasePatterns: Map<string, number> = new Map();
  private contextualWords: Map<string, Map<string, number>> = new Map();
  private timeBasedPatterns: Map<number, string[]> = new Map();
  private initialized = false;

  async initialize(userId: string) {
    if (this.initialized) return;

    await this.loadUserPatterns(userId);
    this.loadCommonPatterns();
    this.initialized = true;
  }

  private async loadUserPatterns(userId: string) {
    const stats = communicationAnalytics.getUsageStats(90); // Last 90 days

    // Build word transition probabilities
    const events = JSON.parse(localStorage.getItem(`communication_events_${userId}`) || '[]');

    events.forEach((event: any) => {
      if (event.type === 'sentence_built' || event.type === 'phrase_spoken') {
        const words = event.content.toLowerCase().split(/\s+/).filter((w: string) => w.length > 0);

        // Build word transitions
        for (let i = 0; i < words.length - 1; i++) {
          const currentWord = words[i];
          const nextWord = words[i + 1];

          if (!this.wordTransitions.has(currentWord)) {
            this.wordTransitions.set(currentWord, new Map());
          }

          const transitions = this.wordTransitions.get(currentWord)!;
          transitions.set(nextWord, (transitions.get(nextWord) || 0) + 1);
        }

        // Build phrase patterns
        if (words.length >= 2) {
          const phrase = words.join(' ');
          this.phrasePatterns.set(phrase, (this.phrasePatterns.get(phrase) || 0) + 1);
        }

        // Build time-based patterns
        const hour = new Date(event.timestamp).getHours();
        if (!this.timeBasedPatterns.has(hour)) {
          this.timeBasedPatterns.set(hour, []);
        }
        this.timeBasedPatterns.get(hour)!.push(...words.slice(0, 3)); // First 3 words
      }
    });
  }

  private loadCommonPatterns() {
    // Common word transitions in AAC
    const commonTransitions = [
      ['i', ['want', 'need', 'like', 'am', 'have', 'feel']],
      ['want', ['to', 'some', 'more', 'help']],
      ['need', ['to', 'help', 'more', 'some']],
      ['can', ['you', 'i', 'we', 'help']],
      ['please', ['help', 'give', 'come', 'stop']],
      ['thank', ['you']],
      ['good', ['morning', 'night', 'bye', 'job']],
      ['how', ['are', 'do', 'can', 'much']],
      ['what', ['is', 'do', 'can', 'time']],
      ['where', ['is', 'are', 'do', 'can']],
      ['when', ['is', 'do', 'can', 'will']],
      ['why', ['is', 'do', 'can', 'not']],
      ['more', ['please', 'food', 'time', 'help']],
      ['no', ['thank', 'more', 'stop', 'thanks']],
      ['yes', ['please', 'thank', 'good', 'okay']]
    ];

    commonTransitions.forEach(([word, nextWords]) => {
      if (!this.wordTransitions.has(word)) {
        this.wordTransitions.set(word, new Map());
      }
      const transitions = this.wordTransitions.get(word)!;
      nextWords.forEach((nextWord, index) => {
        // Give higher weight to more common transitions
        transitions.set(nextWord, 10 - index);
      });
    });

    // Common phrases
    const commonPhrases = [
      'thank you', 'please help', 'i want', 'i need', 'good morning',
      'good night', 'how are you', 'i love you', 'see you later',
      'excuse me', 'i\'m sorry', 'you\'re welcome', 'what time',
      'where is', 'can you help', 'i don\'t know', 'i understand',
      'more please', 'all done', 'let\'s go', 'come here'
    ];

    commonPhrases.forEach((phrase, index) => {
      this.phrasePatterns.set(phrase, 50 - index); // Higher weight for more common phrases
    });
  }

  getSuggestions(context: PredictionContext, maxSuggestions: number = 8): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Get word completion suggestions
    if (context.currentSentence.length > 0) {
      const lastWord = context.currentSentence[context.currentSentence.length - 1].toLowerCase();
      const wordSuggestions = this.getWordCompletions(lastWord, context);
      suggestions.push(...wordSuggestions);
    }

    // Get next word predictions
    if (context.currentSentence.length > 0) {
      const nextWordSuggestions = this.getNextWordPredictions(context);
      suggestions.push(...nextWordSuggestions);
    }

    // Get phrase suggestions
    const phraseSuggestions = this.getPhraseSuggestions(context);
    suggestions.push(...phraseSuggestions);

    // Get contextual suggestions (time-based, recent usage)
    const contextualSuggestions = this.getContextualSuggestions(context);
    suggestions.push(...contextualSuggestions);

    // Sort by confidence and remove duplicates
    const uniqueSuggestions = new Map<string, Suggestion>();
    suggestions.forEach(suggestion => {
      const existing = uniqueSuggestions.get(suggestion.text);
      if (!existing || suggestion.confidence > existing.confidence) {
        uniqueSuggestions.set(suggestion.text, suggestion);
      }
    });

    return Array.from(uniqueSuggestions.values())
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, maxSuggestions);
  }

  private getWordCompletions(partialWord: string, context: PredictionContext): Suggestion[] {
    if (partialWord.length < 2) return [];

    const suggestions: Suggestion[] = [];
    const allWords = new Set<string>();

    // Collect words from transitions and patterns
    this.wordTransitions.forEach((transitions, word) => {
      if (word.startsWith(partialWord)) {
        allWords.add(word);
      }
      transitions.forEach((count, nextWord) => {
        if (nextWord.startsWith(partialWord)) {
          allWords.add(nextWord);
        }
      });
    });

    this.phrasePatterns.forEach((count, phrase) => {
      phrase.split(' ').forEach(word => {
        if (word.startsWith(partialWord)) {
          allWords.add(word);
        }
      });
    });

    allWords.forEach(word => {
      if (word !== partialWord) {
        suggestions.push({
          text: word,
          confidence: this.calculateWordConfidence(word, context),
          type: 'word'
        });
      }
    });

    return suggestions;
  }

  private getNextWordPredictions(context: PredictionContext): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const lastWord = context.currentSentence[context.currentSentence.length - 1].toLowerCase();

    const transitions = this.wordTransitions.get(lastWord);
    if (transitions) {
      transitions.forEach((count, nextWord) => {
        const confidence = this.calculateTransitionConfidence(lastWord, nextWord, count, context);
        suggestions.push({
          text: nextWord,
          confidence,
          type: 'word',
          context: `after "${lastWord}"`
        });
      });
    }

    return suggestions;
  }

  private getPhraseSuggestions(context: PredictionContext): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const currentText = context.currentSentence.join(' ').toLowerCase();

    this.phrasePatterns.forEach((count, phrase) => {
      // Suggest phrases that start with current sentence
      if (phrase.startsWith(currentText) && phrase !== currentText) {
        suggestions.push({
          text: phrase,
          confidence: this.calculatePhraseConfidence(phrase, count, context),
          type: 'completion',
          frequency: count
        });
      }

      // Suggest complete phrases if current sentence is empty or short
      if (context.currentSentence.length <= 1) {
        suggestions.push({
          text: phrase,
          confidence: this.calculatePhraseConfidence(phrase, count, context) * 0.7,
          type: 'phrase',
          frequency: count
        });
      }
    });

    return suggestions;
  }

  private getContextualSuggestions(context: PredictionContext): Suggestion[] {
    const suggestions: Suggestion[] = [];

    // Time-based suggestions
    const timeWords = this.timeBasedPatterns.get(context.timeOfDay) || [];
    const wordCounts = new Map<string, number>();
    timeWords.forEach(word => {
      wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
    });

    wordCounts.forEach((count, word) => {
      suggestions.push({
        text: word,
        confidence: Math.min(0.8, count / Math.max(timeWords.length / 10, 1)),
        type: 'word',
        context: `common at ${context.timeOfDay}:00`
      });
    });

    // Recent usage boost
    context.recentWords.forEach((word, index) => {
      const recencyBoost = (context.recentWords.length - index) / context.recentWords.length;
      suggestions.push({
        text: word,
        confidence: 0.6 * recencyBoost,
        type: 'word',
        context: 'recently used'
      });
    });

    return suggestions;
  }

  private calculateWordConfidence(word: string, context: PredictionContext): number {
    let confidence = 0.5;

    // Boost confidence based on frequency in user's history
    const userWords = context.userHistory.join(' ').toLowerCase();
    const occurrences = (userWords.match(new RegExp(word, 'g')) || []).length;
    confidence += Math.min(0.3, occurrences / 100);

    // Boost confidence if word appears in recent context
    if (context.recentWords.includes(word)) {
      confidence += 0.2;
    }

    return Math.min(1.0, confidence);
  }

  private calculateTransitionConfidence(fromWord: string, toWord: string, count: number, context: PredictionContext): number {
    const transitions = this.wordTransitions.get(fromWord);
    if (!transitions) return 0.1;

    const totalTransitions = Array.from(transitions.values()).reduce((a, b) => a + b, 0);
    let confidence = count / totalTransitions;

    // Boost confidence for common patterns
    if (count > 5) confidence += 0.1;
    if (context.recentWords.includes(toWord)) confidence += 0.15;

    return Math.min(1.0, confidence);
  }

  private calculatePhraseConfidence(phrase: string, count: number, context: PredictionContext): number {
    let confidence = Math.min(0.8, count / 50); // Normalize frequency

    // Boost confidence for phrases used recently
    if (context.userHistory.some(text => text.toLowerCase().includes(phrase))) {
      confidence += 0.2;
    }

    // Boost confidence for time-appropriate phrases
    const hour = context.timeOfDay;
    if ((hour >= 6 && hour <= 11 && phrase.includes('morning')) ||
        (hour >= 18 && hour <= 23 && phrase.includes('night'))) {
      confidence += 0.1;
    }

    return Math.min(1.0, confidence);
  }

  learnFromSelection(selectedText: string, context: PredictionContext) {
    // Update patterns based on user's selection
    const words = selectedText.toLowerCase().split(/\s+/);

    if (context.currentSentence.length > 0 && words.length > 0) {
      const lastWord = context.currentSentence[context.currentSentence.length - 1].toLowerCase();
      const selectedWord = words[0];

      // Strengthen this transition
      if (!this.wordTransitions.has(lastWord)) {
        this.wordTransitions.set(lastWord, new Map());
      }
      const transitions = this.wordTransitions.get(lastWord)!;
      transitions.set(selectedWord, (transitions.get(selectedWord) || 0) + 1);
    }

    // If it's a phrase, strengthen phrase patterns
    if (words.length > 1) {
      const phrase = words.join(' ');
      this.phrasePatterns.set(phrase, (this.phrasePatterns.get(phrase) || 0) + 1);
    }
  }
}

export const smartPredictionEngine = new SmartPredictionEngine();
