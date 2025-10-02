import { writable } from 'svelte/store';

export interface CommunicationEvent {
  id: string;
  timestamp: number;
  type: 'tile_click' | 'phrase_spoken' | 'sentence_built' | 'custom_recording';
  content: string;
  category?: string;
  sessionId: string;
  duration?: number; // for recordings
}

export interface UsageStats {
  totalCommunications: number;
  dailyAverage: number;
  mostUsedWords: Array<{ word: string; count: number }>;
  mostUsedPhrases: Array<{ phrase: string; count: number }>;
  communicationsByHour: number[];
  communicationsByDay: number[];
  sessionDurations: number[];
  avgSessionDuration: number;
}

export interface ProgressMetrics {
  vocabularyGrowth: Array<{ date: string; uniqueWords: number }>;
  complexityTrend: Array<{ date: string; avgWordsPerSentence: number }>;
  engagementTrend: Array<{ date: string; sessionsCount: number }>;
}

class CommunicationAnalytics {
  private userId: string = '';
  private events: CommunicationEvent[] = [];
  private currentSessionId: string = '';

  constructor() {
    this.startNewSession();
  }

  setUserId(userId: string) {
    this.userId = userId;
    this.loadEvents();
  }

  startNewSession() {
    this.currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  trackEvent(event: Omit<CommunicationEvent, 'id' | 'timestamp' | 'sessionId'>) {
    const fullEvent: CommunicationEvent = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      sessionId: this.currentSessionId,
      ...event
    };

    this.events.push(fullEvent);
    this.saveEvents();
    return fullEvent;
  }

  getUsageStats(daysBack: number = 30): UsageStats {
    const cutoffTime = Date.now() - (daysBack * 24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp >= cutoffTime);

    // Calculate basic stats
    const totalCommunications = recentEvents.length;
    const dailyAverage = totalCommunications / daysBack;

    // Most used words
    const wordCounts = new Map<string, number>();
    recentEvents.forEach(event => {
      const words = event.content.toLowerCase().split(/\s+/);
      words.forEach(word => {
        if (word.length > 2) { // Skip very short words
          wordCounts.set(word, (wordCounts.get(word) || 0) + 1);
        }
      });
    });

    const mostUsedWords = Array.from(wordCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([word, count]) => ({ word, count }));

    // Most used phrases
    const phraseCounts = new Map<string, number>();
    recentEvents.forEach(event => {
      if (event.content.length > 0) {
        phraseCounts.set(event.content, (phraseCounts.get(event.content) || 0) + 1);
      }
    });

    const mostUsedPhrases = Array.from(phraseCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([phrase, count]) => ({ phrase, count }));

    // Communications by hour
    const communicationsByHour = new Array(24).fill(0);
    recentEvents.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      communicationsByHour[hour]++;
    });

    // Communications by day of week
    const communicationsByDay = new Array(7).fill(0);
    recentEvents.forEach(event => {
      const day = new Date(event.timestamp).getDay();
      communicationsByDay[day]++;
    });

    // Session durations
    const sessions = new Map<string, { start: number; end: number }>();
    recentEvents.forEach(event => {
      const session = sessions.get(event.sessionId) || { start: event.timestamp, end: event.timestamp };
      session.start = Math.min(session.start, event.timestamp);
      session.end = Math.max(session.end, event.timestamp);
      sessions.set(event.sessionId, session);
    });

    const sessionDurations = Array.from(sessions.values())
      .map(s => s.end - s.start)
      .filter(duration => duration > 0);

    const avgSessionDuration = sessionDurations.length > 0
      ? sessionDurations.reduce((a, b) => a + b, 0) / sessionDurations.length
      : 0;

    return {
      totalCommunications,
      dailyAverage,
      mostUsedWords,
      mostUsedPhrases,
      communicationsByHour,
      communicationsByDay,
      sessionDurations,
      avgSessionDuration
    };
  }

  getProgressMetrics(daysBack: number = 90): ProgressMetrics {
    const cutoffTime = Date.now() - (daysBack * 24 * 60 * 60 * 1000);
    const recentEvents = this.events.filter(e => e.timestamp >= cutoffTime);

    // Group events by date
    const eventsByDate = new Map<string, CommunicationEvent[]>();
    recentEvents.forEach(event => {
      const date = new Date(event.timestamp).toISOString().split('T')[0];
      if (!eventsByDate.has(date)) {
        eventsByDate.set(date, []);
      }
      eventsByDate.get(date)!.push(event);
    });

    // Vocabulary growth
    const vocabularyGrowth: Array<{ date: string; uniqueWords: number }> = [];
    const allWords = new Set<string>();

    Array.from(eventsByDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .forEach(([date, events]) => {
        events.forEach(event => {
          const words = event.content.toLowerCase().split(/\s+/);
          words.forEach(word => {
            if (word.length > 2) allWords.add(word);
          });
        });
        vocabularyGrowth.push({ date, uniqueWords: allWords.size });
      });

    // Complexity trend (average words per sentence)
    const complexityTrend: Array<{ date: string; avgWordsPerSentence: number }> = [];
    eventsByDate.forEach((events, date) => {
      const sentenceEvents = events.filter(e => e.type === 'sentence_built');
      if (sentenceEvents.length > 0) {
        const totalWords = sentenceEvents.reduce((sum, event) => {
          return sum + event.content.split(/\s+/).length;
        }, 0);
        const avgWordsPerSentence = totalWords / sentenceEvents.length;
        complexityTrend.push({ date, avgWordsPerSentence });
      }
    });

    // Engagement trend (sessions per day)
    const engagementTrend: Array<{ date: string; sessionsCount: number }> = [];
    eventsByDate.forEach((events, date) => {
      const uniqueSessions = new Set(events.map(e => e.sessionId));
      engagementTrend.push({ date, sessionsCount: uniqueSessions.size });
    });

    return {
      vocabularyGrowth: vocabularyGrowth.sort((a, b) => a.date.localeCompare(b.date)),
      complexityTrend: complexityTrend.sort((a, b) => a.date.localeCompare(b.date)),
      engagementTrend: engagementTrend.sort((a, b) => a.date.localeCompare(b.date))
    };
  }

  private loadEvents() {
    if (!this.userId) return;

    const saved = localStorage.getItem(`communication_events_${this.userId}`);
    if (saved) {
      try {
        this.events = JSON.parse(saved);
      } catch (e) {
        console.error('Failed to load communication events:', e);
        this.events = [];
      }
    }
  }

  private saveEvents() {
    if (!this.userId) return;

    // Keep only the last 10,000 events to prevent localStorage from growing too large
    if (this.events.length > 10000) {
      this.events = this.events.slice(-10000);
    }

    localStorage.setItem(`communication_events_${this.userId}`, JSON.stringify(this.events));
  }

  exportData(): string {
    return JSON.stringify({
      userId: this.userId,
      events: this.events,
      exportedAt: new Date().toISOString()
    }, null, 2);
  }

  clearData() {
    this.events = [];
    if (this.userId) {
      localStorage.removeItem(`communication_events_${this.userId}`);
    }
  }
}

// Create singleton instance
export const communicationAnalytics = new CommunicationAnalytics();

// Store for reactive updates
export const analyticsStore = writable({
  stats: null as UsageStats | null,
  progress: null as ProgressMetrics | null,
  isLoading: false
});
