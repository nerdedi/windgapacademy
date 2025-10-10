/**
 * CurriculumBuilderEnhanced.tsx
 *
 * Enhanced curriculum builder component with 3D model integration,
 * accessibility features, and AI-powered curriculum generation.
 *
 * Portions of this file were generated with the assistance of Anthropic Claude (https://www.anthropic.com/)
 */

// React imports
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Chakra UI imports - using separate imports for better compatibility
import * as ChakraIcons from "@chakra-ui/icons";
import * as Chakra from "@chakra-ui/react";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

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

// Define a custom theme with Windgap Academy styling
const theme = extendTheme({
  colors: {
    brand: {
      50: "#E6F5FF",
      100: "#CCE5FF",
      200: "#99CCFF",
      300: "#66B2FF",
      400: "#3399FF",
      500: "#007FFF", // Primary brand color
      600: "#0066CC",
      700: "#004D99",
      800: "#003366",
      900: "#001A33",
    },
    accent: {
      50: "#F0FFF4",
      100: "#C6F6D5",
      200: "#9AE6B4",
      300: "#68D391",
      400: "#48BB78",
      500: "#38A169", // Secondary accent color
      600: "#2F855A",
      700: "#276749",
      800: "#1C4532",
      900: "#133525",
    },
  },
  fonts: {
    heading: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: "500",
        borderRadius: "md",
      },
      variants: {
        primary: {
          bg: "brand.500",
          color: "white",
          _hover: {
            bg: "brand.600",
          },
          _active: {
            bg: "brand.700",
          },
        },
        secondary: {
          bg: "gray.200",
          color: "gray.700",
          _hover: {
            bg: "gray.300",
          },
          _active: {
            bg: "gray.400",
          },
        },
      },
    },
  },
});

/**
 * Main enhanced curriculum builder component
 * Creates and manages curriculum modules with AI assistance and 3D character visualization
 */
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

  // Use Chakra UI's toast
  const toast = Chakra.useToast();

  // Toast notification function
  const showToast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info"): void => {
      console.log(`[${type.toUpperCase()}] ${message}`);

      toast({
        title: type.charAt(0).toUpperCase() + type.slice(1),
        description: message,
        status: type,
        duration: 5000,
        isClosable: true,
        position: "top-right",
      });
    },
    [toast],
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
          showToast("Module auto-saved", "info");
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

  // Render with Chakra UI components
  return (
    <ChakraProvider theme={theme}>
      <Chakra.Container maxW="1200px" p={6}>
        <Chakra.Heading mb={6} pb={2} borderBottomWidth="2px" fontSize="2xl">
          Enhanced Curriculum Builder
        </Chakra.Heading>

        {/* Subject Selection */}
        <Chakra.Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
          <Chakra.Heading as="h2" size="md" mb={4}>
            1. Select Subject
          </Chakra.Heading>
          <Chakra.Select
            value={selectedSubject}
            onChange={(e) => handleSubjectChange(e.target.value)}
            mb={2}
          >
            {Object.keys(moduleTemplates).map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </Chakra.Select>
        </Chakra.Box>

        {/* Template Selection */}
        <Chakra.Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
          <Chakra.Heading as="h2" size="md" mb={4}>
            2. Choose Template or Create Custom
          </Chakra.Heading>
          {availableTemplates.length > 0 && (
            <Chakra.Select
              value={selectedTemplate?.title || ""}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              mb={2}
            >
              <option value="">-- Select Template --</option>
              {availableTemplates.map((template: ModuleTemplate) => (
                <option key={template.title} value={template.title}>
                  {template.title} ({template.difficulty}, {template.duration} min)
                </option>
              ))}
            </Chakra.Select>
          )}
        </Chakra.Box>

        {/* Module Details */}
        <Chakra.Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
          <Chakra.Heading as="h2" size="md" mb={4}>
            3. Module Details
          </Chakra.Heading>

          <Chakra.FormControl mb={4}>
            <Chakra.FormLabel>Title</Chakra.FormLabel>
            <Chakra.Input
              value={moduleTitle}
              onChange={(e) => setModuleTitle(e.target.value)}
              placeholder="Enter module title"
            />
          </Chakra.FormControl>

          <Chakra.FormControl mb={4}>
            <Chakra.FormLabel>Learning Objectives</Chakra.FormLabel>
            <Chakra.Textarea
              value={customObjectives}
              onChange={(e) => setCustomObjectives(e.target.value)}
              placeholder="Enter learning objectives (one per line)"
              rows={5}
            />
          </Chakra.FormControl>

          <Chakra.FormControl mb={4}>
            <Chakra.FormLabel>Duration (minutes)</Chakra.FormLabel>
            <Chakra.NumberInput
              value={duration}
              onChange={(valueString) => setDuration(Number(valueString))}
              min={5}
              max={120}
            >
              <Chakra.NumberInputField />
              <Chakra.NumberInputStepper>
                <Chakra.NumberIncrementStepper />
                <Chakra.NumberDecrementStepper />
              </Chakra.NumberInputStepper>
            </Chakra.NumberInput>
          </Chakra.FormControl>

          <Chakra.FormControl mb={4}>
            <Chakra.FormLabel>Difficulty</Chakra.FormLabel>
            <Chakra.Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </Chakra.Select>
          </Chakra.FormControl>

          <Chakra.Stack spacing={4}>
            <Chakra.Checkbox
              isChecked={enableAccessibility}
              onChange={(e) => setEnableAccessibility(e.target.checked)}
            >
              Enable Accessibility Features
            </Chakra.Checkbox>

            <Chakra.Checkbox isChecked={autoSave} onChange={(e) => setAutoSave(e.target.checked)}>
              Auto-save Generated Modules
            </Chakra.Checkbox>
          </Chakra.Stack>
        </Chakra.Box>

        {/* Character Selection */}
        <Chakra.Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
          <Chakra.Heading as="h2" size="md" mb={4}>
            4. Select Character
          </Chakra.Heading>
          <Chakra.Grid templateColumns="repeat(auto-fill, minmax(280px, 1fr))" gap={4}>
            {curriculumCharacters.map((character) => (
              <Chakra.Card
                key={character.id}
                borderWidth={2}
                borderColor={selectedCharacter?.id === character.id ? "brand.500" : "gray.200"}
                boxShadow={selectedCharacter?.id === character.id ? "md" : "sm"}
                onClick={() => handleCharacterSelect(character.id)}
                cursor="pointer"
                _hover={{ boxShadow: "md" }}
              >
                <Chakra.CardHeader pb={0}>
                  <Chakra.Heading size="md">{character.name}</Chakra.Heading>
                </Chakra.CardHeader>
                <Chakra.CardBody>
                  <Chakra.Text color="gray.600" mb={3}>
                    {character.description}
                  </Chakra.Text>

                  <Chakra.Wrap spacing={2} mb={2}>
                    {character.traits.map((trait) => (
                      <Chakra.WrapItem key={trait}>
                        <Chakra.Badge colorScheme="blue" rounded="full" px={2}>
                          {trait}
                        </Chakra.Badge>
                      </Chakra.WrapItem>
                    ))}
                  </Chakra.Wrap>

                  {character.accessibilityFeatures && (
                    <Chakra.Wrap spacing={2}>
                      {character.accessibilityFeatures.map((feature) => (
                        <Chakra.WrapItem key={feature}>
                          <Chakra.Badge colorScheme="purple" rounded="full" px={2}>
                            {feature}
                          </Chakra.Badge>
                        </Chakra.WrapItem>
                      ))}
                    </Chakra.Wrap>
                  )}
                </Chakra.CardBody>
              </Chakra.Card>
            ))}
          </Chakra.Grid>
        </Chakra.Box>

        {/* Actions */}
        <Chakra.Flex gap={4} mb={6}>
          <Chakra.Button
            colorScheme="blue"
            onClick={handleGenerateModule}
            isDisabled={generationStatus === "generating"}
            leftIcon={<ChakraIcons.InfoIcon />}
            isLoading={generationStatus === "generating"}
            loadingText="Generating..."
          >
            Generate Module
          </Chakra.Button>

          <Chakra.Button
            colorScheme="teal"
            onClick={handlePreviewModule}
            isDisabled={!currentModule || isAnimating}
            leftIcon={<ChakraIcons.TimeIcon />}
            isLoading={isAnimating}
            loadingText="Animating..."
          >
            Preview with Character
          </Chakra.Button>

          <Chakra.Button
            colorScheme="gray"
            onClick={() => setShowCharacterPreview(!showCharacterPreview)}
            leftIcon={<ChakraIcons.ViewIcon />}
          >
            {showCharacterPreview ? "Hide Character Model" : "Show Character Model"}
          </Chakra.Button>
        </Chakra.Flex>

        {/* Generated Content */}
        {moduleContent && (
          <Chakra.Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
            <Chakra.Heading as="h2" size="md" mb={4}>
              Generated Curriculum Module
            </Chakra.Heading>
            <Chakra.Box borderWidth={1} borderRadius="md" p={4} bg="gray.50">
              <Chakra.Text whiteSpace="pre-wrap" fontSize="sm" fontFamily="monospace">
                {moduleContent}
              </Chakra.Text>
            </Chakra.Box>
          </Chakra.Box>
        )}

        {/* 3D Character Preview */}
        {showCharacterPreview && selectedCharacter && (
          <Chakra.Box bg="white" p={6} borderRadius="md" boxShadow="sm" mb={6}>
            <Chakra.Heading as="h2" size="md" mb={4}>
              Character Preview
            </Chakra.Heading>
            <Chakra.Box
              height="400px"
              borderWidth={1}
              borderRadius="md"
              bg="gray.50"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Chakra.VStack>
                <Chakra.Text color="gray.500" fontSize="xl">
                  3D Model: {selectedCharacter.model}
                </Chakra.Text>
                <Chakra.Text color="gray.400" fontSize="md" mt={2}>
                  (3D model viewer will be integrated when Blender/Unity components are ready)
                </Chakra.Text>
              </Chakra.VStack>
            </Chakra.Box>
          </Chakra.Box>
        )}

        {/* Additional settings section */}
        <Chakra.Box bg="white" p={6} borderRadius="md" boxShadow="sm">
          <Chakra.Heading as="h2" size="md" mb={4}>
            5. Additional Settings
          </Chakra.Heading>
          <Chakra.Text color="gray.600" mb={4}>
            These settings will be implemented in the next version. The current implementation
            provides a basic framework that can be extended with more features.
          </Chakra.Text>
          <Chakra.List spacing={2} styleType="disc" pl={6} color="gray.600">
            <Chakra.ListItem>Voice narration for accessibility</Chakra.ListItem>
            <Chakra.ListItem>Export to different formats (PDF, DOCX, HTML)</Chakra.ListItem>
            <Chakra.ListItem>Collaboration features</Chakra.ListItem>
            <Chakra.ListItem>Student progress tracking</Chakra.ListItem>
            <Chakra.ListItem>Interactive exercises integration</Chakra.ListItem>
          </Chakra.List>
        </Chakra.Box>
      </Chakra.Container>
    </ChakraProvider>
  );
}
