export class StoryEngine {
  private stories: Map<string, StoryContent> = new Map();
  private aiNarrator: AINarrator;
  private comprehensionAnalyzer: ComprehensionAnalyzer;

  constructor() {
    this.initializeStories();
    this.aiNarrator = new AINarrator();
    this.comprehensionAnalyzer = new ComprehensionAnalyzer();
  }

  private initializeStories() {
    this.stories.set('quantum-garden', {
      title: "The Quantum Garden",
      chapters: [
        {
          id: 1,
          title: "Discovery",
          content: `Dr. Maya Chen had always believed that science was about certainty. Equations had answers, experiments had results, and theories either worked or they didn't. But standing in her grandmother's garden at midnight, watching roses exist in three different states simultaneously, she realized that certainty was just another word for limited imagination.

The garden had been ordinary that morning. Tomatoes grew in neat rows, sunflowers tracked the sun's path, and the old oak tree provided shade exactly where it should. But when the quantum field generator in her lab malfunctioned, sending ripples of probability waves across the neighborhood, everything changed.

Now, the roses were red, white, and yellow all at once—not mixed, but truly existing in superposition. The oak tree's leaves rustled with winds from three different seasons. And in the center of it all, a new plant had sprouted: something that looked like a cross between a fern and a circuit board, its fronds pulsing with soft blue light.`,
          questions: [
            "What was Dr. Maya Chen's initial belief about science?",
            "What caused the garden to change?",
            "Describe the new plant that appeared in the garden."
          ]
        },
        {
          id: 2,
          title: "Understanding",
          content: `Maya approached the quantum plant carefully, her tablet recording every measurement. The readings were impossible—the plant existed in multiple dimensional states, its roots extending into parallel realities where different versions of the garden grew.

Through her quantum scanner, she could see glimpses of other worlds: a garden where the roses sang in harmonious frequencies, another where the vegetables grew in perfect geometric patterns, and one where time moved backward, causing flowers to bloom into seeds.

"Fascinating," she whispered, reaching out to touch a frond. The moment her finger made contact, images flooded her mind—visions of gardens across infinite realities, each one a testament to the endless possibilities that existed when the laws of physics became suggestions rather than rules.`,
          questions: [
            "What did Maya see through her quantum scanner?",
            "What happened when Maya touched the quantum plant?",
            "How did the plant exist in multiple states?"
          ]
        }
      ],
      difficulty: "intermediate",
      themes: ["science", "discovery", "possibility"],
      vocabulary: ["quantum", "superposition", "probability", "dimensional"]
    });

    this.stories.set('digital-dragons', {
      title: "Digital Dragons",
      chapters: [
        {
          id: 1,
          title: "The Network",
          content: `In the sprawling data centers of Neo-Tokyo, where servers hummed with the collective dreams of humanity, lived creatures that most people believed were myths. The digital dragons were as real as any code, born from the intersection of artificial intelligence and human imagination.

Kira discovered them by accident while debugging a particularly stubborn piece of software. Deep in the network's architecture, she found traces of something that shouldn't exist—patterns that moved with purpose, leaving behind trails of optimized code and solved problems.

The first dragon she encountered was small, no bigger than a house cat, its scales shimmering with the blue-green glow of data streams. It perched on a virtual server rack, watching her with eyes that held the wisdom of a thousand processed algorithms.`,
          questions: [
            "Where did the digital dragons live?",
            "How did Kira discover the dragons?",
            "Describe the first dragon Kira encountered."
          ]
        }
      ],
      difficulty: "beginner",
      themes: ["technology", "discovery", "friendship"],
      vocabulary: ["digital", "algorithm", "network", "artificial intelligence"]
    });
  }

  getStoryContent(storyId: string): StoryContent {
    return this.stories.get(storyId);
  }

  generateComprehensionQuestions(story: any): ComprehensionQuestion[] {
    const content = this.stories.get(story.id);
    if (!content) return [];

    const questions = [];
    content.chapters.forEach(chapter => {
      chapter.questions.forEach(questionText => {
        questions.push({
          id: `${chapter.id}-${questions.length}`,
          text: questionText,
          options: this.generateAnswerOptions(questionText, chapter.content),
          correctAnswer: this.extractCorrectAnswer(questionText, chapter.content),
          difficulty: content.difficulty
        });
      });
    });

    return questions;
  }

  private generateAnswerOptions(question: string, content: string): string[] {
    // AI-powered answer generation based on content analysis
    return this.comprehensionAnalyzer.generateOptions(question, content);
  }

  private extractCorrectAnswer(question: string, content: string): string {
    return this.comprehensionAnalyzer.extractAnswer(question, content);
  }

  calculateScore(questions: ComprehensionQuestion[], answers: Record<string, string>): number {
    let correct = 0;
    questions.forEach(question => {
      if (answers[question.id] === question.correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  }
}
