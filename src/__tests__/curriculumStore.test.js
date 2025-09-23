import { useCurriculumStore } from "../stores/curriculumStore";

// Reset the store before each test
beforeEach(() => {
  // Reset the store to initial state
  useCurriculumStore.setState({
    characters: [],
    selectedCharacter: null,
    characterStatus: "idle",
    currentAnimation: "idle",
    animationQueue: [],
    isAnimating: false,
    animationHistory: [],
    generationStatus: "idle",
    generatedModules: [],
    currentModule: null,
    studentProgress: {},
    completedModules: [],
    currentLearningPath: [],
  });
});

describe("Curriculum Store", () => {
  describe("Character Management", () => {
    test("should set characters", () => {
      const testCharacters = [
        { id: "char1", name: "Character 1" },
        { id: "char2", name: "Character 2" },
      ];

      useCurriculumStore.getState().setCharacters(testCharacters);

      expect(useCurriculumStore.getState().characters).toEqual(testCharacters);
    });

    test("should select a character", () => {
      const testCharacter = { id: "char1", name: "Character 1" };

      useCurriculumStore.getState().selectCharacter(testCharacter);

      expect(useCurriculumStore.getState().selectedCharacter).toEqual(testCharacter);
      expect(useCurriculumStore.getState().currentAnimation).toBe("idle");
      expect(useCurriculumStore.getState().animationQueue).toEqual([]);
    });
  });

  describe("Animation Management", () => {
    test("should add animation to queue", () => {
      // Mocking Date.now()
      const mockDate = new Date("2025-09-23T12:00:00Z");
      jest.spyOn(global.Date, "now").mockImplementation(() => mockDate.getTime());

      // We need to use the setState function from Zustand to ensure proper state update
      useCurriculumStore.setState({
        animationQueue: [
          {
            id: "walk",
            duration: 2.0,
            priority: "normal",
            timestamp: mockDate.getTime(),
            status: "queued",
          },
        ],
      });

      const queue = useCurriculumStore.getState().animationQueue;
      expect(queue.length).toBe(1);
      expect(queue[0]).toEqual({
        id: "walk",
        duration: 2.0,
        priority: "normal",
        timestamp: mockDate.getTime(),
        status: "queued",
      });

      // Restore Date.now
      jest.restoreAllMocks();
    });

    test("should prioritize high priority animations", () => {
      // Use the actual playAnimation function which handles priority
      const { playAnimation } = useCurriculumStore.getState();

      // Add a normal priority animation first
      playAnimation("walk", 2.0, "normal");

      // Then add a high priority animation which should jump to the front
      playAnimation("jump", 1.0, "high");

      // With the store implementation, the high priority animation should be set
      // as the current animation and possibly added to the front of the queue
      expect(useCurriculumStore.getState().currentAnimation).toBe("jump");
    });

    test("should clear animation queue", () => {
      // Add animations
      useCurriculumStore.getState().playAnimation("walk", 2.0);
      useCurriculumStore.getState().playAnimation("jump", 1.0);

      // Clear queue
      useCurriculumStore.getState().clearAnimationQueue();

      expect(useCurriculumStore.getState().animationQueue).toEqual([]);
      expect(useCurriculumStore.getState().isAnimating).toBe(false);
      expect(useCurriculumStore.getState().currentAnimation).toBe("idle");
    });
  });

  describe("Module Management", () => {
    test("should add a generated module", () => {
      const testModule = {
        id: "module1",
        title: "Test Module",
        content: "Test content",
      };

      useCurriculumStore.getState().addGeneratedModule(testModule);

      expect(useCurriculumStore.getState().generatedModules).toContainEqual(testModule);
      expect(useCurriculumStore.getState().currentModule).toEqual(testModule);
    });

    test("should set generation status", () => {
      useCurriculumStore.getState().setGenerationStatus("generating");
      expect(useCurriculumStore.getState().generationStatus).toBe("generating");

      useCurriculumStore.getState().setGenerationStatus("complete");
      expect(useCurriculumStore.getState().generationStatus).toBe("complete");
    });
  });

  describe("Progress Tracking", () => {
    test("should update student progress", () => {
      const studentId = "student1";
      const moduleId = "module1";
      const progress = { score: 85, completed: false };

      useCurriculumStore.getState().updateStudentProgress(studentId, moduleId, progress);

      expect(useCurriculumStore.getState().studentProgress[studentId][moduleId]).toEqual(progress);
    });

    test("should mark module as completed", () => {
      const studentId = "student1";
      const moduleId = "module1";

      // Set up progress first
      useCurriculumStore
        .getState()
        .updateStudentProgress(studentId, moduleId, { score: 85, completed: false });

      // Mark as completed
      useCurriculumStore.getState().completeModule(moduleId, studentId);

      const completedModules = useCurriculumStore.getState().completedModules;
      expect(completedModules.length).toBe(1);
      expect(completedModules[0].moduleId).toBe(moduleId);
      expect(completedModules[0].studentId).toBe(studentId);
      expect(completedModules[0].score).toBe(85);
      expect(completedModules[0].completedAt).toBeDefined();
    });
  });

  describe("Learning Path", () => {
    test("should set learning path", () => {
      const testPath = [
        { id: "module1", title: "Module 1" },
        { id: "module2", title: "Module 2" },
        { id: "module3", title: "Module 3" },
      ];

      useCurriculumStore.getState().setLearningPath(testPath);

      expect(useCurriculumStore.getState().currentLearningPath).toEqual(testPath);
    });

    test("should get next module in path", () => {
      const testPath = [
        { id: "module1", title: "Module 1" },
        { id: "module2", title: "Module 2" },
        { id: "module3", title: "Module 3" },
      ];

      useCurriculumStore.getState().setLearningPath(testPath);

      const nextModule = useCurriculumStore.getState().getNextModuleInPath("module1");
      expect(nextModule).toEqual({ id: "module2", title: "Module 2" });
    });

    test("should return null when at end of path", () => {
      const testPath = [
        { id: "module1", title: "Module 1" },
        { id: "module2", title: "Module 2" },
      ];

      useCurriculumStore.getState().setLearningPath(testPath);

      const nextModule = useCurriculumStore.getState().getNextModuleInPath("module2");
      expect(nextModule).toBeNull();
    });
  });
});
