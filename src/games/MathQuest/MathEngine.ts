export class MathEngine {
  private difficultyLevels: DifficultyConfig[];
  private problemTypes: ProblemType[];
  private adaptiveSystem: AdaptiveSystem;

  constructor() {
    this.initializeDifficultyLevels();
    this.initializeProblemTypes();
    this.adaptiveSystem = new AdaptiveSystem();
  }

  private initializeDifficultyLevels() {
    this.difficultyLevels = [
      { level: 1, range: [1, 10], operations: ['addition', 'subtraction'] },
      { level: 2, range: [1, 50], operations: ['addition', 'subtraction', 'multiplication'] },
      { level: 3, range: [1, 100], operations: ['all'], includeDecimals: true },
      { level: 4, range: [1, 1000], operations: ['all'], includeDecimals: true, includeFractions: true },
      { level: 5, range: [1, 10000], operations: ['all'], includeAlgebra: true }
    ];
  }

  generateProblem(level: number, userProfile?: LearningProfile): MathProblem {
    const config = this.difficultyLevels[level - 1];
    const operation = this.selectOperation(config, userProfile);

    switch (operation) {
      case 'addition':
        return this.generateAdditionProblem(config);
      case 'subtraction':
        return this.generateSubtractionProblem(config);
      case 'multiplication':
        return this.generateMultiplicationProblem(config);
      case 'division':
        return this.generateDivisionProblem(config);
      case 'algebra':
        return this.generateAlgebraProblem(config);
      default:
        return this.generateAdditionProblem(config);
    }
  }

  generateAnswerChoices(problem: MathProblem): number[] {
    const correctAnswer = problem.answer;
    const choices = [correctAnswer];

    // Generate plausible wrong answers
    for (let i = 0; i < 3; i++) {
      let wrongAnswer;
      do {
        const variance = Math.floor(Math.random() * 20) - 10;
        wrongAnswer = correctAnswer + variance;
      } while (choices.includes(wrongAnswer) || wrongAnswer < 0);

      choices.push(wrongAnswer);
    }

    return this.shuffleArray(choices);
  }

  checkAnswer(problem: MathProblem, userAnswer: number): boolean {
    return Math.abs(problem.answer - userAnswer) < 0.001;
  }

  private generateAdditionProblem(config: DifficultyConfig): MathProblem {
    const a = this.randomInRange(config.range);
    const b = this.randomInRange(config.range);

    return {
      question: `${a} + ${b} = ?`,
      answer: a + b,
      type: 'addition',
      difficulty: config.level,
      operands: [a, b]
    };
  }

  private generateAlgebraProblem(config: DifficultyConfig): MathProblem {
    const x = this.randomInRange([1, 20]);
    const coefficient = this.randomInRange([2, 10]);
    const constant = this.randomInRange([1, 50]);
    const result = coefficient * x + constant;

    return {
      question: `${coefficient}x + ${constant} = ${result}, x = ?`,
      answer: x,
      type: 'algebra',
      difficulty: config.level,
      operands: [coefficient, constant, result]
    };
  }

  private randomInRange(range: [number, number]): number {
    return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
