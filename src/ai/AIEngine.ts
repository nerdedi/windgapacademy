import * as tf from '@tensorflow/tfjs';

export interface UserInteraction {
  timestamp: number;
  action: string;
  context: string;
  performance: number;
  timeSpent: number;
  difficulty: number;
  success: boolean;
  emotionalState?: string;
}

export interface LearningProfile {
  learningStyle: 'visual' | 'auditory' | 'kinesthetic' | 'mixed';
  difficultyPreference: number;
  engagementPatterns: EngagementPattern[];
  recommendedContent: ContentRecommendation[];
  strengths: string[];
  areasForImprovement: string[];
  motivationFactors: string[];
  optimalSessionLength: number;
  preferredTimeOfDay: string;
}

export interface EngagementPattern {
  activity: string;
  engagementLevel: number;
  duration: number;
  frequency: number;
}

export interface ContentRecommendation {
  type: string;
  difficulty: number;
  topic: string;
  estimatedTime: number;
  confidence: number;
}

export interface PerformanceData {
  accuracy: number;
  speed: number;
  consistency: number;
  improvement: number;
  effort: number;
  context: string;
}

export interface Feedback {
  message: string;
  tone: 'encouraging' | 'constructive' | 'celebratory' | 'supportive';
  suggestions: string[];
  nextSteps: string[];
  motivationalElements: string[];
}

export interface ConversationContext {
  topic: string;
  userMood: string;
  sessionHistory: string[];
  learningGoals: string[];
  currentActivity: string;
}

export interface AIResponse {
  text: string;
  emotion: string;
  confidence: number;
  suggestions: string[];
  followUpQuestions: string[];
}

export class AIEngine {
  private learningModel: tf.LayersModel | null = null;
  private personalityEngine: PersonalityEngine;
  private adaptiveSystem: AdaptiveSystem;
  private conversationAI: ConversationAI;
  private nlpProcessor: NLPProcessor;
  private emotionRecognition: EmotionRecognition;
  private contentGenerator: ContentGenerator;
  private tutorSystem: IntelligentTutor;
  private isInitialized: boolean = false;

  constructor() {
    this.initializeModels();
  }

  async initializeModels() {
    try {
      // Load pre-trained models for learning adaptation
      this.learningModel = await tf.loadLayersModel('/models/learning-adaptation.json');

      // Initialize AI subsystems
      this.personalityEngine = new PersonalityEngine();
      this.adaptiveSystem = new AdaptiveSystem();
      this.conversationAI = new ConversationAI();
      this.nlpProcessor = new NLPProcessor();
      this.emotionRecognition = new EmotionRecognition();
      this.contentGenerator = new ContentGenerator();
      this.tutorSystem = new IntelligentTutor();

      this.isInitialized = true;
      console.log('AI Engine initialized successfully');
    } catch (error) {
      console.warn('AI Engine initialization failed, using fallback systems:', error);
      this.initializeFallbackSystems();
    }
  }

  private initializeFallbackSystems() {
    // Initialize basic systems without ML models
    this.personalityEngine = new PersonalityEngine();
    this.adaptiveSystem = new AdaptiveSystem();
    this.conversationAI = new ConversationAI();
    this.nlpProcessor = new NLPProcessor();
    this.emotionRecognition = new EmotionRecognition();
    this.contentGenerator = new ContentGenerator();
    this.tutorSystem = new IntelligentTutor();
    this.isInitialized = true;
  }

  analyzeUserBehavior(interactions: UserInteraction[]): LearningProfile {
    if (!this.isInitialized) {
      throw new Error('AI Engine not initialized');
    }

    const features = this.extractFeatures(interactions);
    let prediction: tf.Tensor | null = null;

    if (this.learningModel) {
      prediction = this.learningModel.predict(features) as tf.Tensor;
    }

    return {
      learningStyle: this.determineLearningStyle(interactions, prediction),
      difficultyPreference: this.calculateOptimalDifficulty(interactions, prediction),
      engagementPatterns: this.analyzeEngagement(interactions),
      recommendedContent: this.generateRecommendations(interactions, prediction),
      strengths: this.identifyStrengths(interactions),
      areasForImprovement: this.identifyWeaknesses(interactions),
      motivationFactors: this.analyzeMotivation(interactions),
      optimalSessionLength: this.calculateOptimalSessionLength(interactions),
      preferredTimeOfDay: this.analyzeTimePreferences(interactions)
    };
  }

  private extractFeatures(interactions: UserInteraction[]): tf.Tensor {
    // Extract relevant features for ML model
    const features = interactions.map(interaction => [
      interaction.performance,
      interaction.timeSpent,
      interaction.difficulty,
      interaction.success ? 1 : 0,
      this.getActivityTypeEncoding(interaction.action),
      this.getTimeOfDayEncoding(interaction.timestamp)
    ]);

    return tf.tensor2d(features);
  }

  private getActivityTypeEncoding(action: string): number {
    const actionMap: { [key: string]: number } = {
      'math': 0.1,
      'reading': 0.2,
      'science': 0.3,
      'creative': 0.4,
      'problem-solving': 0.5,
      'quiz': 0.6,
      'exploration': 0.7
    };
    return actionMap[action] || 0;
  }

  private getTimeOfDayEncoding(timestamp: number): number {
    const hour = new Date(timestamp).getHours();
    return hour / 24; // Normalize to 0-1
  }

  private determineLearningStyle(interactions: UserInteraction[], prediction?: tf.Tensor): 'visual' | 'auditory' | 'kinesthetic' | 'mixed' {
    // Analyze interaction patterns to determine learning style
    const visualActivities = interactions.filter(i => i.action.includes('visual') || i.action.includes('read')).length;
    const auditoryActivities = interactions.filter(i => i.action.includes('audio') || i.action.includes('listen')).length;
    const kinestheticActivities = interactions.filter(i => i.action.includes('interactive') || i.action.includes('hands-on')).length;

    const total = interactions.length;
    const visualRatio = visualActivities / total;
    const auditoryRatio = auditoryActivities / total;
    const kinestheticRatio = kinestheticActivities / total;

    if (Math.max(visualRatio, auditoryRatio, kinestheticRatio) < 0.4) {
      return 'mixed';
    }

    if (visualRatio > auditoryRatio && visualRatio > kinestheticRatio) {
      return 'visual';
    } else if (auditoryRatio > kinestheticRatio) {
      return 'auditory';
    } else {
      return 'kinesthetic';
    }
  }

  private calculateOptimalDifficulty(interactions: UserInteraction[], prediction?: tf.Tensor): number {
    // Calculate optimal difficulty based on performance and engagement
    const recentInteractions = interactions.slice(-20); // Last 20 interactions
    const avgPerformance = recentInteractions.reduce((sum, i) => sum + i.performance, 0) / recentInteractions.length;
    const avgEngagement = recentInteractions.reduce((sum, i) => sum + (i.timeSpent > 0 ? 1 : 0), 0) / recentInteractions.length;

    // Target 70-80% success rate for optimal challenge
    let optimalDifficulty = 0.5;

    if (avgPerformance > 0.8) {
      optimalDifficulty = Math.min(1.0, optimalDifficulty + 0.1);
    } else if (avgPerformance < 0.6) {
      optimalDifficulty = Math.max(0.1, optimalDifficulty - 0.1);
    }

    return optimalDifficulty;
  }

  private analyzeEngagement(interactions: UserInteraction[]): EngagementPattern[] {
    const activityMap = new Map<string, { totalTime: number; count: number; avgEngagement: number }>();

    interactions.forEach(interaction => {
      const activity = interaction.action;
      const current = activityMap.get(activity) || { totalTime: 0, count: 0, avgEngagement: 0 };

      current.totalTime += interaction.timeSpent;
      current.count += 1;
      current.avgEngagement = (current.avgEngagement * (current.count - 1) + interaction.performance) / current.count;

      activityMap.set(activity, current);
    });

    return Array.from(activityMap.entries()).map(([activity, data]) => ({
      activity,
      engagementLevel: data.avgEngagement,
      duration: data.totalTime / data.count,
      frequency: data.count / interactions.length
    }));
  }

  private generateRecommendations(interactions: UserInteraction[], prediction?: tf.Tensor): ContentRecommendation[] {
    const engagementPatterns = this.analyzeEngagement(interactions);
    const recommendations: ContentRecommendation[] = [];

    // Recommend based on high engagement activities
    engagementPatterns
      .filter(pattern => pattern.engagementLevel > 0.7)
      .sort((a, b) => b.engagementLevel - a.engagementLevel)
      .slice(0, 5)
      .forEach(pattern => {
        recommendations.push({
          type: pattern.activity,
          difficulty: this.calculateOptimalDifficulty(interactions, prediction),
          topic: this.suggestTopic(pattern.activity, interactions),
          estimatedTime: Math.round(pattern.duration),
          confidence: pattern.engagementLevel
        });
      });

    return recommendations;
  }

  private suggestTopic(activity: string, interactions: UserInteraction[]): string {
    // Suggest topics based on activity type and past performance
    const topicMap: { [key: string]: string[] } = {
      'math': ['algebra', 'geometry', 'statistics', 'calculus'],
      'reading': ['fiction', 'non-fiction', 'poetry', 'drama'],
      'science': ['physics', 'chemistry', 'biology', 'earth-science'],
      'creative': ['art', 'music', 'writing', 'design']
    };

    const topics = topicMap[activity] || ['general'];
    return topics[Math.floor(Math.random() * topics.length)];
  }

  private identifyStrengths(interactions: UserInteraction[]): string[] {
    const activityPerformance = new Map<string, number[]>();

    interactions.forEach(interaction => {
      const performances = activityPerformance.get(interaction.action) || [];
      performances.push(interaction.performance);
      activityPerformance.set(interaction.action, performances);
    });

    const strengths: string[] = [];
    activityPerformance.forEach((performances, activity) => {
      const avgPerformance = performances.reduce((sum, p) => sum + p, 0) / performances.length;
      if (avgPerformance > 0.8) {
        strengths.push(activity);
      }
    });

    return strengths;
  }

  private identifyWeaknesses(interactions: UserInteraction[]): string[] {
    const activityPerformance = new Map<string, number[]>();

    interactions.forEach(interaction => {
      const performances = activityPerformance.get(interaction.action) || [];
      performances.push(interaction.performance);
      activityPerformance.set(interaction.action, performances);
    });

    const weaknesses: string[] = [];
    activityPerformance.forEach((performances, activity) => {
      const avgPerformance = performances.reduce((sum, p) => sum + p, 0) / performances.length;
      if (avgPerformance < 0.6) {
        weaknesses.push(activity);
      }
    });

    return weaknesses;
  }

  private analyzeMotivation(interactions: UserInteraction[]): string[] {
    const motivationFactors: string[] = [];

    // Analyze what keeps users engaged
    const longSessions = interactions.filter(i => i.timeSpent > 300); // 5+ minutes
    if (longSessions.length > interactions.length * 0.3) {
      motivationFactors.push('sustained-engagement');
    }

    const highPerformance = interactions.filter(i => i.performance > 0.8);
    if (highPerformance.length > interactions.length * 0.5) {
      motivationFactors.push('achievement-oriented');
    }

    return motivationFactors;
  }

  private calculateOptimalSessionLength(interactions: UserInteraction[]): number {
    const sessionLengths = interactions.map(i => i.timeSpent);
    const avgLength = sessionLengths.reduce((sum, length) => sum + length, 0) / sessionLengths.length;
    return Math.round(avgLength);
  }

  private analyzeTimePreferences(interactions: UserInteraction[]): string {
    const timeSlots = {
      morning: 0,
      afternoon: 0,
      evening: 0,
      night: 0
    };

    interactions.forEach(interaction => {
      const hour = new Date(interaction.timestamp).getHours();
      if (hour >= 6 && hour < 12) timeSlots.morning++;
      else if (hour >= 12 && hour < 17) timeSlots.afternoon++;
      else if (hour >= 17 && hour < 22) timeSlots.evening++;
      else timeSlots.night++;
    });

    return Object.entries(timeSlots).reduce((a, b) => timeSlots[a[0]] > timeSlots[b[0]] ? a : b)[0];
  }

  adaptContent(content: any, userProfile: LearningProfile): any {
    return this.adaptiveSystem.adapt(content, userProfile);
  }

  generatePersonalizedFeedback(performance: PerformanceData): Feedback {
    return this.personalityEngine.generateFeedback(performance);
  }

  async processNaturalLanguage(input: string, context: ConversationContext): Promise<AIResponse> {
    return await this.conversationAI.process(input, context);
  }

  recognizeEmotion(text: string, audioData?: ArrayBuffer): string {
    return this.emotionRecognition.analyze(text, audioData);
  }

  generateContent(type: string, difficulty: number, topic: string): any {
    return this.contentGenerator.generate(type, difficulty, topic);
  }

  provideTutoring(question: string, context: string): string {
    return this.tutorSystem.respond(question, context);
  }

  isReady(): boolean {
    return this.isInitialized;
  }
}

// Supporting AI Classes
class PersonalityEngine {
  generateFeedback(performance: PerformanceData): Feedback {
    const { accuracy, speed, consistency, improvement } = performance;

    let tone: 'encouraging' | 'constructive' | 'celebratory' | 'supportive' = 'encouraging';
    let message = '';
    const suggestions: string[] = [];
    const nextSteps: string[] = [];
    const motivationalElements: string[] = [];

    if (accuracy > 0.9) {
      tone = 'celebratory';
      message = "Outstanding work! You're really mastering this material.";
      motivationalElements.push("🌟 Excellent accuracy!");
      nextSteps.push("Try a more challenging level");
    } else if (accuracy > 0.7) {
      tone = 'encouraging';
      message = "Great job! You're making solid progress.";
      suggestions.push("Focus on the areas where you made mistakes");
      nextSteps.push("Practice similar problems");
    } else {
      tone = 'supportive';
      message = "Keep going! Learning takes time and practice.";
      suggestions.push("Take your time with each problem");
      suggestions.push("Review the fundamentals");
      nextSteps.push("Try easier problems first");
    }

    if (improvement > 0.1) {
      motivationalElements.push("📈 You're improving rapidly!");
    }

    if (speed > 0.8 && accuracy > 0.8) {
      motivationalElements.push("⚡ Great speed and accuracy!");
    }

    return {
      message,
      tone,
      suggestions,
      nextSteps,
      motivationalElements
    };
  }
}

class AdaptiveSystem {
  adapt(content: any, userProfile: LearningProfile): any {
    const adaptedContent = { ...content };

    // Adjust difficulty based on user profile
    if (userProfile.difficultyPreference > 0.8) {
      adaptedContent.difficulty = Math.min(1.0, content.difficulty + 0.2);
    } else if (userProfile.difficultyPreference < 0.4) {
      adaptedContent.difficulty = Math.max(0.1, content.difficulty - 0.2);
    }

    // Adapt presentation style based on learning style
    switch (userProfile.learningStyle) {
      case 'visual':
        adaptedContent.visualElements = true;
        adaptedContent.animations = true;
        break;
      case 'auditory':
        adaptedContent.audioNarration = true;
        adaptedContent.soundEffects = true;
        break;
      case 'kinesthetic':
        adaptedContent.interactiveElements = true;
        adaptedContent.handsonActivities = true;
        break;
    }

    return adaptedContent;
  }
}

class ConversationAI {
  async process(input: string, context: ConversationContext): Promise<AIResponse> {
    // Simple rule-based conversation system
    const lowerInput = input.toLowerCase();
    let response = '';
    let emotion = 'neutral';
    const suggestions: string[] = [];
    const followUpQuestions: string[] = [];

    if (lowerInput.includes('help') || lowerInput.includes('stuck')) {
      response = "I'm here to help! What specific part are you having trouble with?";
      emotion = 'supportive';
      suggestions.push("Break the problem into smaller steps");
      followUpQuestions.push("Would you like me to explain this concept differently?");
    } else if (lowerInput.includes('good') || lowerInput.includes('great')) {
      response = "That's wonderful to hear! You're doing amazing work.";
      emotion = 'happy';
      followUpQuestions.push("What would you like to explore next?");
    } else if (lowerInput.includes('difficult') || lowerInput.includes('hard')) {
      response = "I understand this can be challenging. Let's work through it together.";
      emotion = 'empathetic';
      suggestions.push("Try a simpler version first");
      suggestions.push("Take a short break if needed");
    } else {
      response = "That's interesting! Tell me more about what you're thinking.";
      followUpQuestions.push("How does this relate to what we learned before?");
    }

    return {
      text: response,
      emotion,
      confidence: 0.8,
      suggestions,
      followUpQuestions
    };
  }
}

class NLPProcessor {
  analyze(text: string): { sentiment: string; keywords: string[]; intent: string } {
    // Basic sentiment analysis
    const positiveWords = ['good', 'great', 'awesome', 'love', 'like', 'enjoy', 'fun'];
    const negativeWords = ['bad', 'hate', 'difficult', 'hard', 'boring', 'frustrated'];

    const words = text.toLowerCase().split(/\s+/);
    const positiveCount = words.filter(word => positiveWords.includes(word)).length;
    const negativeCount = words.filter(word => negativeWords.includes(word)).length;

    let sentiment = 'neutral';
    if (positiveCount > negativeCount) sentiment = 'positive';
    else if (negativeCount > positiveCount) sentiment = 'negative';

    // Extract keywords (simple approach)
    const keywords = words.filter(word => word.length > 3);

    // Determine intent
    let intent = 'general';
    if (text.includes('help') || text.includes('?')) intent = 'help';
    else if (text.includes('explain')) intent = 'explanation';
    else if (text.includes('next') || text.includes('continue')) intent = 'progression';

    return { sentiment, keywords, intent };
  }
}

class EmotionRecognition {
  analyze(text: string, audioData?: ArrayBuffer): string {
    // Text-based emotion recognition
    const emotionKeywords = {
      happy: ['happy', 'joy', 'excited', 'great', 'awesome', 'love'],
      sad: ['sad', 'disappointed', 'upset', 'down'],
      angry: ['angry', 'mad', 'frustrated', 'annoyed'],
      confused: ['confused', 'lost', 'don\'t understand', 'unclear'],
      confident: ['confident', 'sure', 'certain', 'know'],
      anxious: ['worried', 'nervous', 'anxious', 'scared']
    };

    const words = text.toLowerCase().split(/\s+/);

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      if (keywords.some(keyword => words.includes(keyword))) {
        return emotion;
      }
    }

    return 'neutral';
  }
}

class ContentGenerator {
  generate(type: string, difficulty: number, topic: string): any {
    // Generate content based on type, difficulty, and topic
    const templates = {
      math: {
        easy: "Solve: {a} + {b} = ?",
        medium: "If x + {a} = {b}, what is x?",
        hard: "Solve the quadratic equation: x² + {a}x + {b} = 0"
      },
      reading: {
        easy: "Read this short story and answer questions",
        medium: "Analyze the main character's motivation",
        hard: "Compare themes across multiple texts"
      }
    };

    const difficultyLevel = difficulty < 0.3 ? 'easy' : difficulty < 0.7 ? 'medium' : 'hard';
    const template = templates[type]?.[difficultyLevel] || "Practice activity";

    return {
      type,
      difficulty,
      topic,
      content: template,
      estimatedTime: Math.round(difficulty * 20 + 5) // 5-25 minutes
    };
  }
}

class IntelligentTutor {
  respond(question: string, context: string): string {
    // Intelligent tutoring responses
    const questionType = this.classifyQuestion(question);

    switch (questionType) {
      case 'conceptual':
        return "Let me explain the concept step by step...";
      case 'procedural':
        return "Here's how to solve this type of problem...";
      case 'factual':
        return "The answer is based on this principle...";
      default:
        return "That's a great question! Let's explore this together.";
    }
  }

  private classifyQuestion(question: string): string {
    if (question.includes('why') || question.includes('how does')) {
      return 'conceptual';
    } else if (question.includes('how to') || question.includes('steps')) {
      return 'procedural';
    } else if (question.includes('what is') || question.includes('define')) {
      return 'factual';
    }
    return 'general';
  }
}
