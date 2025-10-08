/**
 * CurriculumBuilderEnhanced.tsx
 *
 * Enhanced curriculum builder component with 3D model integration,
 * accessibility features, and AI-powered curriculum generation.
 *
 * Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
 *
 * TODO: Fix Chakra UI imports by installing proper packages:
 * npm install @chakra-ui/react @chakra-ui/icons @emotion/react @emotion/styled framer-motion
 */

// React imports
import React, { useCallback, useEffect, useMemo, useState } from "react";

// TypeScript interfaces for our mocked dependencies
// Commented out as it's not currently used but kept for future reference
/*
interface BlenderModelViewerProps {
  modelUrl: string;
  width?: number;
  height?: number;
  backgroundColor?: string;
  enableShadows?: boolean;
  enableRotation?: boolean;
}
*/

interface AnimationConfig {
  characterId: string;
  autoConnect?: boolean;
  enablePerformanceMonitoring?: boolean;
  onAnimationStart?: (animationId: string) => void;
  onAnimationEnd?: (animationId: string) => void;
  onAnimationError?: (animationId: string, error: Error) => void;
}

interface AnimationBridge {
  connect: () => void;
  disconnect: () => void;
  queueAnimation: (animationId: string) => void;
  cancelAnimation: (animationId: string) => void;
  getStatus: () => { connected: boolean; currentAnimation: string | null; queue: string[] };
}

interface GenerationParams {
  subject: string;
  character?: CurriculumCharacter | null;
  learningObjectives: string[];
  difficulty: string;
  duration: number;
  accessibilityRequirements?: string[] | undefined;
}

interface GeneratedModule {
  id: string;
  title: string;
  content: string;
  metadata: {
    subject: string;
    character: string;
    createdAt: string;
  };
}

// Mock implementations of required modules for standalone functionality
// These will be replaced with actual imports when dependencies are available

// Mock BlenderModelViewer component - this is commented out as it's unused
// but kept in comments for future implementation reference
/*
const BlenderModelViewer = (props: BlenderModelViewerProps): React.ReactElement | null => {
  console.log("BlenderModelViewer would render with:", props);
  return null; // This is just a placeholder
};
*/

// Mock UnityAnimationBridge implementation
const UnityAnimationBridge = (config: AnimationConfig): AnimationBridge => {
  console.log("UnityAnimationBridge initialized with:", config);
  return {
    connect: () => console.log("Animation bridge connected"),
    disconnect: () => console.log("Animation bridge disconnected"),
    queueAnimation: (animationId: string) => {
      console.log(`Animation queued: ${animationId}`);
      // Simulate callback after "animation" completes
      setTimeout(() => {
        if (config.onAnimationStart) config.onAnimationStart(animationId);

        // Simulate animation duration
        setTimeout(() => {
          if (config.onAnimationEnd) config.onAnimationEnd(animationId);
        }, 2000);
      }, 500);
    },
    cancelAnimation: (animationId: string) => console.log(`Animation cancelled: ${animationId}`),
    getStatus: () => ({ connected: true, currentAnimation: null, queue: [] }),
  };
};

// Mock curriculumAI service
const curriculumAI = {
  generateModule: async (params: GenerationParams): Promise<GeneratedModule> => {
    console.log("Generating curriculum module with params:", params);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    return {
      id: `module-${Date.now()}`,
      title: params.subject + " - " + (params.learningObjectives[0] || "New Module"),
      content:
        `# ${params.subject} Module\n\n## Learning Objectives\n` +
        params.learningObjectives.map((obj: string) => `- ${obj}`).join("\n") +
        `\n\n## Overview\nThis is a sample generated module for ${params.subject}. ` +
        `\n\nThe content would be tailored to match the character's teaching style ` +
        `and include accessibility features as needed.` +
        `\n\n## Duration: ${params.duration} minutes` +
        `\n\n## Difficulty: ${params.difficulty}` +
        `\n\n## Activities\n- Activity 1: Introduction\n- Activity 2: Core concepts\n- Activity 3: Practice exercises` +
        `\n\n## Assessment\n- Quiz at the end of the module\n- Practice problems with feedback`,
      metadata: {
        subject: params.subject,
        character: params.character?.name || "Unknown",
        createdAt: new Date().toISOString(),
      },
    };
  },
};

// Mock custom hooks for state management with proper TypeScript types
const useCharacterState = () => {
  const [selectedCharacter, setSelectedCharacter] = useState<CurriculumCharacter | null>(null);

  const selectCharacter = (character: CurriculumCharacter) => {
    setSelectedCharacter(character);
  };

  return { selectedCharacter, selectCharacter };
};

const useAnimationState = () => {
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [animationQueue, setAnimationQueue] = useState<string[]>([]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  useEffect(() => {
    // Simulate animation state changes for testing
    if (animationQueue.length > 0 && !currentAnimation) {
      const nextAnimation = animationQueue[0];
      setCurrentAnimation(nextAnimation);
      setIsAnimating(true);
      setAnimationQueue((prev) => prev.slice(1));

      // Simulate animation completing
      const timer = setTimeout(() => {
        setCurrentAnimation(null);
        setIsAnimating(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [animationQueue, currentAnimation]);

  return {
    currentAnimation,
    animationQueue,
    isAnimating,
    addAnimation: (animation: string) => setAnimationQueue((prev) => [...prev, animation]),
  };
};

const useModuleState = () => {
  type GenerationStatusType = "idle" | "generating" | "complete" | "error";

  const [generationStatus, setGenerationStatus] = useState<GenerationStatusType>("idle");
  const [currentModule, setCurrentModule] = useState<GeneratedModule | null>(null);
  const [modules, setModules] = useState<GeneratedModule[]>([]);

  const addGeneratedModule = (module: GeneratedModule) => {
    setCurrentModule(module);
    setModules((prev) => [...prev, module]);
  };

  return {
    generationStatus,
    setGenerationStatus,
    currentModule,
    modules,
    addGeneratedModule,
  };
};

// Student progress hook - commented out as it's not currently used
// but kept for future implementation
/*
const useProgressState = () => {
  // Progress type definition
  type Progress = {
    completed: boolean;
    score?: number;
    timeSpent?: number;
    lastAccessed?: Date;
  };

  const updateStudentProgress = (moduleId: string, progress: Progress) => {
    console.log(`Updating progress for module ${moduleId}:`, progress);
    // In a real implementation, this would update a database
  };

  return { updateStudentProgress };
};
*/

// Types for curriculum data
interface CurriculumCharacter {
  id: string;
  name: string;
  description: string;
  model: string;
  traits: string[];
  accessibilityFeatures?: string[];
}

interface ModuleTemplate {
  title: string;
  objectives: string[];
  duration: number;
  difficulty: string;
}

interface ModuleTemplates {
  [key: string]: ModuleTemplate[];
}

// Curriculum characters with enhanced accessibility features
const curriculumCharacters: CurriculumCharacter[] = [
  {
    id: "professor_ada",
    name: "Professor Ada",
    description: "A friendly and patient digital literacy expert",
    model: "professor_ada_v2.glb",
    traits: ["patient", "encouraging", "thorough"],
    accessibilityFeatures: ["clear speech", "sign language capable", "high contrast visuals"],
  },
  {
    id: "coach_alex",
    name: "Coach Alex",
    description: "An energetic and motivating employment skills coach",
    model: "coach_alex_v2.glb",
    traits: ["motivational", "practical", "supportive"],
    accessibilityFeatures: ["simplified language", "step-by-step guidance"],
  },
  {
    id: "mentor_sam",
    name: "Mentor Sam",
    description: "A calm and wise life skills mentor",
    model: "mentor_sam_v2.glb",
    traits: ["wise", "empathetic", "reflective"],
    accessibilityFeatures: ["text-to-speech integrated", "pace adjustment"],
  },
];

// Module templates organized by subject area
const moduleTemplates: ModuleTemplates = {
  "Life Skills": [
    {
      title: "Daily Planning and Organization",
      objectives: ["Create daily schedules", "Set priorities", "Track progress"],
      duration: 45,
      difficulty: "beginner",
    },
    {
      title: "Financial Literacy Basics",
      objectives: ["Budget creation", "Expense tracking", "Savings goals"],
      duration: 60,
      difficulty: "intermediate",
    },
    {
      title: "Effective Communication",
      objectives: ["Active listening", "Clear expression", "Feedback skills"],
      duration: 50,
      difficulty: "beginner",
    },
    {
      title: "Problem Solving Strategies",
      objectives: ["Issue identification", "Solution brainstorming", "Decision making"],
      duration: 55,
      difficulty: "intermediate",
    },
  ],
  "Employment Skills": [
    {
      title: "Resume Building",
      objectives: ["Format selection", "Content creation", "Skill highlighting"],
      duration: 40,
      difficulty: "beginner",
    },
    {
      title: "Interview Preparation",
      objectives: ["Common questions", "Response techniques", "Follow-up etiquette"],
      duration: 50,
      difficulty: "intermediate",
    },
    {
      title: "Workplace Communication",
      objectives: ["Professional emails", "Meeting participation", "Conflict resolution"],
      duration: 45,
      difficulty: "intermediate",
    },
    {
      title: "Career Planning",
      objectives: ["Skill assessment", "Industry research", "Goal setting"],
      duration: 60,
      difficulty: "advanced",
    },
  ],
  "Digital Literacy": [
    {
      title: "Computer Basics",
      objectives: ["Hardware familiarity", "Software navigation", "File management"],
      duration: 30,
      difficulty: "beginner",
    },
    {
      title: "Internet Safety",
      objectives: ["Password security", "Privacy settings", "Scam recognition"],
      duration: 40,
      difficulty: "beginner",
    },
    {
      title: "Using Email",
      objectives: ["Email setup", "Message composition", "Attachment handling"],
      duration: 35,
      difficulty: "beginner",
    },
    {
      title: "Social Media Awareness",
      objectives: ["Platform understanding", "Digital footprint", "Online communication"],
      duration: 45,
      difficulty: "intermediate",
    },
  ],
};

/**
 * Main enhanced curriculum builder component
 * Creates and manages curriculum modules with AI assistance and 3D character visualization
 *
 * TODO: Update Chakra UI components after installing the required packages
 */
/**
 * Inline styles to ensure component works without external CSS dependencies
 * These will be replaced with proper Tailwind classes or Chakra UI components later
 */
const styles: { [key: string]: React.CSSProperties } = {
  curriculumBuilder: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "20px",
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  heading: {
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#2D3748",
    borderBottom: "2px solid #E2E8F0",
    paddingBottom: "0.5rem",
  },
  section: {
    marginBottom: "2rem",
    padding: "1.5rem",
    backgroundColor: "#F7FAFC",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  sectionHeading: {
    fontSize: "1.25rem",
    marginBottom: "1rem",
    color: "#4A5568",
  },
  formGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    marginBottom: "0.5rem",
    fontWeight: "500",
    color: "#4A5568",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #CBD5E0",
    borderRadius: "4px",
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #CBD5E0",
    borderRadius: "4px",
    backgroundColor: "#fff",
  },
  textarea: {
    width: "100%",
    padding: "0.5rem",
    border: "1px solid #CBD5E0",
    borderRadius: "4px",
    minHeight: "100px",
  },
  characterGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "1rem",
  },
  characterCard: {
    padding: "1rem",
    border: "1px solid #CBD5E0",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  selectedCard: {
    borderColor: "#4299E1",
    boxShadow: "0 0 0 2px #BEE3F8",
  },
  traitBadge: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    backgroundColor: "#EBF8FF",
    color: "#2B6CB0",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    marginRight: "0.5rem",
    marginTop: "0.5rem",
  },
  accessibilityBadge: {
    display: "inline-block",
    padding: "0.25rem 0.5rem",
    backgroundColor: "#E9D8FD",
    color: "#6B46C1",
    borderRadius: "9999px",
    fontSize: "0.75rem",
    marginRight: "0.5rem",
    marginTop: "0.5rem",
  },
  actions: {
    display: "flex",
    gap: "1rem",
    marginTop: "2rem",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#4299E1",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
  },
  secondaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#CBD5E0",
    color: "#2D3748",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontWeight: "500",
  },
  disabledButton: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  generatedContent: {
    backgroundColor: "#fff",
    padding: "1rem",
    border: "1px solid #E2E8F0",
    borderRadius: "4px",
    marginTop: "1rem",
  },
  characterPreview: {
    marginTop: "2rem",
  },
  modelContainer: {
    height: "400px",
    border: "1px solid #CBD5E0",
    borderRadius: "4px",
    backgroundColor: "#F7FAFC",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  modelPlaceholder: {
    textAlign: "center",
    color: "#718096",
    fontSize: "1.25rem",
  },
};

export default function CurriculumBuilderEnhanced(): React.ReactElement {
  // Local state with proper TypeScript typing
  const [selectedSubject, setSelectedSubject] = useState<string>("Life Skills");
  const [selectedTemplate, setSelectedTemplate] = useState<ModuleTemplate | null>(null);
  const [showCharacterPreview, setShowCharacterPreview] = useState<boolean>(false);
  const [moduleTitle, setModuleTitle] = useState<string>("");
  const [moduleContent, setModuleContent] = useState<string>("");
  const [customObjectives, setCustomObjectives] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("intermediate");
  const [duration, setDuration] = useState<number>(30);
  const [enableAccessibility, setEnableAccessibility] = useState<boolean>(true);
  const [autoSave, setAutoSave] = useState<boolean>(true);

  // Custom hooks for state management
  const { selectedCharacter, selectCharacter } = useCharacterState();
  const { isAnimating } = useAnimationState(); // Only using isAnimating from this hook for now
  const { generationStatus, currentModule, setGenerationStatus, addGeneratedModule } =
    useModuleState();
  // const { updateStudentProgress } = useProgressState(); // Uncomment when needed

  // Simple toast notification function (replacement for Chakra UI's useToast)
  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info"): void => {
      console.log(`[${type.toUpperCase()}] ${message}`);
      // TODO: Replace with proper toast UI when Chakra UI is available
      alert(`${type.toUpperCase()}: ${message}`);
    },
    [],
  );

  // Initialize with first character
  useEffect(() => {
    if (!selectedCharacter && curriculumCharacters.length > 0) {
      selectCharacter(curriculumCharacters[0]);
    }
  }, [selectedCharacter, selectCharacter]);

  // Get animation control functions from the enhanced bridge
  const animationBridge = UnityAnimationBridge({
    characterId: selectedCharacter?.id || "",
    autoConnect: true,
    enablePerformanceMonitoring: true,
    onAnimationStart: (animationId: string): void => {
      console.log(`🎭 Animation started: ${animationId}`);
    },
    onAnimationEnd: (animationId: string): void => {
      console.log(`✅ Animation completed: ${animationId}`);
    },
    onAnimationError: (animationId: string, error: Error): void => {
      showToast(`Failed to play ${animationId}: ${error.message || "Unknown error"}`, "error");
    },
  });

  // Get available templates based on selected subject
  const availableTemplates = useMemo(() => {
    // Type assertion for moduleTemplates to ensure type safety
    return (moduleTemplates as Record<string, ModuleTemplate[]>)[selectedSubject] || [];
  }, [selectedSubject]);

  // Get learning objectives based on selected template
  const learningObjectives = useMemo(() => {
    if (!selectedTemplate) {
      return customObjectives.split("\n").filter((objective) => objective.trim().length > 0);
    }
    return selectedTemplate.objectives;
  }, [selectedTemplate, customObjectives]);

  // Handle template selection
  const handleTemplateSelect = useCallback(
    (templateTitle: string) => {
      const template = availableTemplates.find((t: ModuleTemplate) => t.title === templateTitle);
      setSelectedTemplate(template || null);
      if (template) {
        setModuleTitle(template.title);
        setDuration(template.duration);
        setDifficulty(template.difficulty);
      }
    },
    [availableTemplates],
  );

  // Handle subject selection
  const handleSubjectChange = useCallback((subject: string) => {
    setSelectedSubject(subject);
    setSelectedTemplate(null);
    setModuleTitle("");
  }, []);

  // Handle character selection
  const handleCharacterSelect = useCallback(
    (characterId: string) => {
      const character = curriculumCharacters.find((c) => c.id === characterId);
      if (character) {
        selectCharacter(character);
      }
    },
    [selectCharacter],
  );

  // Generate module using AI
  const handleGenerateModule = useCallback(async () => {
    if (!moduleTitle.trim()) {
      showToast("Please enter a module title", "error");
      return;
    }

    setGenerationStatus("generating");

    try {
      const generationParams = {
        subject: selectedSubject,
        character: selectedCharacter,
        learningObjectives: learningObjectives,
        difficulty: difficulty,
        duration: duration,
        accessibilityRequirements: enableAccessibility
          ? selectedCharacter?.accessibilityFeatures
          : [],
      };

      // TODO: Update curriculumAI.generateModule type definitions to match parameter types
      const generatedModule = await curriculumAI.generateModule(generationParams as any);

      if (generatedModule) {
        addGeneratedModule(generatedModule);
        setModuleContent(generatedModule.content);
        setGenerationStatus("complete");

        showToast("Module generated successfully!", "success");

        // Auto-save if enabled
        if (autoSave) {
          // TODO: Implement auto-save functionality
        }
      }
    } catch (error: unknown) {
      setGenerationStatus("error");

      showToast(
        error instanceof Error ? error.message : "Failed to generate module. Please try again.",
        "error",
      );
    }
  }, [
    moduleTitle,
    selectedSubject,
    selectedCharacter,
    learningObjectives,
    difficulty,
    duration,
    enableAccessibility,
    setGenerationStatus,
    addGeneratedModule,
    showToast,
    autoSave,
  ]);

  // Preview curriculum module with 3D character
  const handlePreviewModule = useCallback(() => {
    if (!currentModule) {
      showToast("No module to preview. Please generate one first.", "error");
      return;
    }

    // Queue character animations
    const characterAnimation =
      selectedCharacter?.id === "professor_ada"
        ? "teaching"
        : selectedCharacter?.id === "coach_alex"
          ? "motivating"
          : "explaining";

    animationBridge.queueAnimation(characterAnimation);

    showToast("Preview started! Watch the 3D character explain the module.", "info");
  }, [currentModule, selectedCharacter, animationBridge, showToast]);

  // Simplified render with inline styles to avoid Chakra UI errors
  return (
    <div style={styles.curriculumBuilder}>
      <h1 style={styles.heading}>Enhanced Curriculum Builder</h1>

      {/* Subject Selection */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>1. Select Subject</h2>
        <select
          style={styles.select}
          value={selectedSubject}
          onChange={(e) => handleSubjectChange(e.target.value)}
        >
          {Object.keys(moduleTemplates).map((subject) => (
            <option key={subject} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {/* Template Selection */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>2. Choose Template or Create Custom</h2>
        {availableTemplates.length > 0 && (
          <select
            style={styles.select}
            value={selectedTemplate?.title || ""}
            onChange={(e) => handleTemplateSelect(e.target.value)}
          >
            <option value="">-- Select Template --</option>
            {availableTemplates.map((template: ModuleTemplate) => (
              <option key={template.title} value={template.title}>
                {template.title} ({template.difficulty}, {template.duration} min)
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Module Details */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>3. Module Details</h2>

        <div style={styles.formGroup}>
          <label style={styles.label}>Title:</label>
          <input
            style={styles.input}
            type="text"
            value={moduleTitle}
            onChange={(e) => setModuleTitle(e.target.value)}
            placeholder="Enter module title"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Learning Objectives:</label>
          <textarea
            style={styles.textarea}
            value={customObjectives}
            onChange={(e) => setCustomObjectives(e.target.value)}
            placeholder="Enter learning objectives (one per line)"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (minutes):</label>
          <input
            style={styles.input}
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={5}
            max={120}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Difficulty:</label>
          <select
            style={styles.select}
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={{ ...styles.label, display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={enableAccessibility}
              onChange={(e) => setEnableAccessibility(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Enable Accessibility Features
          </label>
        </div>

        <div style={styles.formGroup}>
          <label style={{ ...styles.label, display: "flex", alignItems: "center" }}>
            <input
              type="checkbox"
              checked={autoSave}
              onChange={(e) => setAutoSave(e.target.checked)}
              style={{ marginRight: "8px" }}
            />
            Auto-save Generated Modules
          </label>
        </div>
      </div>

      {/* Character Selection */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>4. Select Character</h2>
        <div style={styles.characterGrid}>
          {curriculumCharacters.map((character) => (
            <div
              key={character.id}
              style={{
                ...styles.characterCard,
                ...(selectedCharacter?.id === character.id ? styles.selectedCard : {}),
              }}
              onClick={() => handleCharacterSelect(character.id)}
            >
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>{character.name}</h3>
              <p style={{ color: "#4A5568", marginBottom: "0.75rem" }}>{character.description}</p>
              <div>
                {character.traits.map((trait) => (
                  <span key={trait} style={styles.traitBadge}>
                    {trait}
                  </span>
                ))}
              </div>
              {character.accessibilityFeatures && (
                <div style={{ marginTop: "0.75rem" }}>
                  {character.accessibilityFeatures.map((feature) => (
                    <span key={feature} style={styles.accessibilityBadge}>
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button
          onClick={handleGenerateModule}
          disabled={generationStatus === "generating"}
          style={{
            ...styles.primaryButton,
            ...(generationStatus === "generating" ? styles.disabledButton : {}),
          }}
        >
          {generationStatus === "generating" ? "Generating..." : "Generate Module"}
        </button>

        <button
          onClick={handlePreviewModule}
          disabled={!currentModule || isAnimating}
          style={{
            ...styles.secondaryButton,
            ...(!currentModule || isAnimating ? styles.disabledButton : {}),
          }}
        >
          {isAnimating ? "Animating..." : "Preview with Character"}
        </button>

        <button
          onClick={() => setShowCharacterPreview(!showCharacterPreview)}
          style={styles.secondaryButton}
        >
          {showCharacterPreview ? "Hide Character Model" : "Show Character Model"}
        </button>
      </div>

      {/* Generated Content */}
      {moduleContent && (
        <div style={styles.section}>
          <h2 style={styles.sectionHeading}>Generated Curriculum Module</h2>
          <div style={styles.generatedContent}>
            <pre style={{ whiteSpace: "pre-wrap", fontSize: "0.9rem" }}>{moduleContent}</pre>
          </div>
        </div>
      )}

      {/* 3D Character Preview */}
      {showCharacterPreview && selectedCharacter && (
        <div style={styles.characterPreview}>
          <h2 style={styles.sectionHeading}>Character Preview</h2>
          <div style={styles.modelContainer}>
            {/* Using placeholder for 3D renderer until issues fixed */}
            <div style={styles.modelPlaceholder}>
              {`3D Model: ${selectedCharacter.model}`}
              <p style={{ marginTop: "12px", fontSize: "0.9rem" }}>
                (3D model viewer will be integrated when Blender/Unity components are ready)
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Additional settings section */}
      <div style={styles.section}>
        <h2 style={styles.sectionHeading}>5. Additional Settings</h2>
        <p style={{ marginBottom: "1rem", color: "#4A5568" }}>
          These settings will be implemented in the next version. The current implementation
          provides a basic framework that can be extended with more features.
        </p>
        <ul style={{ listStyleType: "disc", paddingLeft: "1.5rem", color: "#4A5568" }}>
          <li>Voice narration for accessibility</li>
          <li>Export to different formats (PDF, DOCX, HTML)</li>
          <li>Collaboration features</li>
          <li>Student progress tracking</li>
          <li>Interactive exercises integration</li>
        </ul>
      </div>
    </div>
  );
}
