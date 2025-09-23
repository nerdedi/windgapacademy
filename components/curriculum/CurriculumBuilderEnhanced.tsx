// Enhanced CurriculumBuilder with all improvements integrated
import {
  CheckIcon,
  WarningIcon,
  InfoIcon,
  SettingsIcon,
  StarIcon,
  TimeIcon,
  ViewIcon,
} from "@chakra-ui/icons";
import {
  Button,
  IconButton,
  CloseButton,
  Select,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Box,
  Grid,
  VStack,
  Heading,
  useToast,
  Flex,
  Text,
  Divider,
  HStack,
  Progress,
  Badge,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  Tooltip,
  Switch,
  FormHelperText,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  useColorModeValue,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import React, { useState, useEffect, useCallback, useMemo } from "react";

import BlenderModelViewer from "../../src/components/BlenderModelViewer.js";
import UnityAnimationBridge from "../../src/components/UnityAnimationBridgeEnhanced";
import { curriculumAI } from "../../src/services/curriculumAI";
import {
  useCurriculumStore,
  useCharacterState,
  useAnimationState,
  useModuleState,
  useProgressState,
} from "../../src/stores/curriculumStore";

// Enhanced character definitions with accessibility and learning analytics
const curriculumCharacters = [
  {
    id: "winnie",
    name: "Winnie",
    path: "/assets/characters/winnie/winnie.glb",
    description: "Friendly and encouraging guide specializing in life skills",
    personality: "warm, patient, supportive",
    voiceSettings: { pitch: 1.2, rate: 0.9, volume: 0.8 },
    animations: [
      { id: "idle", label: "Idle", clipName: "idle", accessibility: "Character standing ready" },
      {
        id: "teaching",
        label: "Teaching",
        clipName: "teaching",
        accessibility: "Character gesturing while explaining",
      },
      {
        id: "encourage",
        label: "Encourage",
        clipName: "encourage",
        accessibility: "Character giving encouraging gestures",
      },
      {
        id: "celebrate",
        label: "Celebrate",
        clipName: "celebrate",
        accessibility: "Character celebrating success",
      },
      {
        id: "thinking",
        label: "Thinking",
        clipName: "thinking",
        accessibility: "Character in thoughtful pose",
      },
      {
        id: "pointing",
        label: "Pointing",
        clipName: "pointing",
        accessibility: "Character pointing to highlight content",
      },
    ],
    subjects: ["Life Skills", "Digital Literacy"],
    specializations: ["Daily Living", "Social Skills", "Self-Care"],
    accessibilityFeatures: ["high-contrast", "large-gestures", "clear-speech"],
  },
  {
    id: "natalie",
    name: "Natalie",
    path: "/assets/characters/natalie/natalie.glb",
    description: "Professional mentor focused on employment and career development",
    personality: "confident, professional, motivating",
    voiceSettings: { pitch: 1.0, rate: 1.0, volume: 0.8 },
    animations: [
      {
        id: "idle",
        label: "Idle",
        clipName: "idle",
        accessibility: "Character in professional stance",
      },
      {
        id: "teaching",
        label: "Teaching",
        clipName: "teaching",
        accessibility: "Character presenting information",
      },
      {
        id: "handshake",
        label: "Handshake",
        clipName: "handshake",
        accessibility: "Character extending hand for greeting",
      },
      {
        id: "typing",
        label: "Typing",
        clipName: "typing",
        accessibility: "Character demonstrating computer use",
      },
    ],
    subjects: ["Employment Skills", "Digital Literacy"],
    specializations: ["Resume Building", "Interview Skills", "Workplace Communication"],
    accessibilityFeatures: ["professional-tone", "structured-content", "clear-instructions"],
  },
];

// Enhanced module templates with learning objectives and accessibility
const moduleTemplates = {
  "Life Skills": [
    {
      title: "Daily Living Skills",
      objectives: ["Meal planning", "Budgeting basics", "Home maintenance"],
      duration: 45,
      difficulty: "beginner",
    },
    {
      title: "Social Skills",
      objectives: ["Communication", "Conflict resolution", "Building relationships"],
      duration: 60,
      difficulty: "intermediate",
    },
    {
      title: "Self-Care and Health",
      objectives: ["Health monitoring", "Medication management", "Exercise planning"],
      duration: 40,
      difficulty: "beginner",
    },
    {
      title: "Community Navigation",
      objectives: ["Public transport", "Community services", "Emergency procedures"],
      duration: 50,
      difficulty: "intermediate",
    },
    {
      title: "Personal Finance",
      objectives: ["Banking", "Savings", "Financial planning"],
      duration: 55,
      difficulty: "advanced",
    },
  ],
  "Employment Skills": [
    {
      title: "Resume Building",
      objectives: ["Resume structure", "Skills highlighting", "Work experience presentation"],
      duration: 40,
      difficulty: "beginner",
    },
    {
      title: "Interview Skills",
      objectives: ["Interview preparation", "Common questions", "Professional presentation"],
      duration: 50,
      difficulty: "intermediate",
    },
    {
      title: "Workplace Communication",
      objectives: ["Email etiquette", "Meeting participation", "Feedback handling"],
      duration: 45,
      difficulty: "intermediate",
    },
    {
      title: "Time Management",
      objectives: ["Priority setting", "Schedule management", "Productivity tools"],
      duration: 35,
      difficulty: "beginner",
    },
    {
      title: "Career Exploration",
      objectives: ["Career paths", "Skills assessment", "Goal setting"],
      duration: 60,
      difficulty: "advanced",
    },
  ],
  "Digital Literacy": [
    {
      title: "Computer Basics",
      objectives: ["Hardware understanding", "Operating system navigation", "File management"],
      duration: 50,
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
    {
      title: "Office Applications",
      objectives: ["Word processing", "Spreadsheets", "Presentations"],
      duration: 60,
      difficulty: "intermediate",
    },
  ],
};

// Main enhanced curriculum builder component
export default function CurriculumBuilderEnhanced() {
  // Local state
  const [selectedSubject, setSelectedSubject] = useState("Life Skills");
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showCharacterPreview, setShowCharacterPreview] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleContent, setModuleContent] = useState("");
  const [customObjectives, setCustomObjectives] = useState("");
  const [difficulty, setDifficulty] = useState("intermediate");
  const [duration, setDuration] = useState(30);
  const [aiProvider, setAiProvider] = useState("openai");
  const [enableAccessibility, setEnableAccessibility] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  // Zustand store hooks
  const { selectedCharacter, selectCharacter, setCharacterStatus } = useCharacterState();
  const { currentAnimation, animationQueue, isAnimating, playAnimation, getAnimationStats } =
    useAnimationState();
  const { generationStatus, currentModule, setGenerationStatus, addGeneratedModule } =
    useModuleState();
  const { updateStudentProgress, getStudentInsights } = useProgressState();

  // Toast for notifications
  const toast = useToast();

  // Color mode values
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Initialize with first character
  useEffect(() => {
    if (!selectedCharacter && curriculumCharacters.length > 0) {
      selectCharacter(curriculumCharacters[0]);
    }
  }, [selectedCharacter, selectCharacter]);

  // Get animation control functions from the enhanced bridge
  const animationBridge = UnityAnimationBridge({
    characterId: selectedCharacter?.id,
    autoConnect: true,
    enablePerformanceMonitoring: true,
    onAnimationStart: (animationId) => {
      console.log(`🎭 Animation started: ${animationId}`);
    },
    onAnimationEnd: (animationId) => {
      console.log(`🎭 Animation completed: ${animationId}`);
    },
    onAnimationError: (animationId, error) => {
      toast({
        title: "Animation Error",
        description: `Failed to play ${animationId}: ${error.message}`,
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    },
  });

  // Filter characters by selected subject
  const filteredCharacters = useMemo(() => {
    return curriculumCharacters.filter((character) => character.subjects.includes(selectedSubject));
  }, [selectedSubject]);

  // Get available templates for selected subject
  const availableTemplates = useMemo(() => {
    return moduleTemplates[selectedSubject] || [];
  }, [selectedSubject]);

  // Enhanced module generation with AI
  const generateModule = useCallback(async () => {
    if (!selectedCharacter) {
      toast({
        title: "No Character Selected",
        description: "Please select a character before generating a module.",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setGenerationStatus("generating");

    try {
      // Play teaching animation while generating
      animationBridge.playAnimation("teaching", 3.0);

      // Prepare generation parameters
      const learningObjectives = customObjectives
        ? customObjectives.split("\n").filter((obj) => obj.trim())
        : selectedTemplate?.objectives || [];

      const generationParams = {
        subject: selectedSubject,
        character: selectedCharacter,
        learningObjectives,
        difficulty,
        duration,
        accessibilityRequirements: enableAccessibility
          ? selectedCharacter.accessibilityFeatures
          : [],
      };

      // Generate module using AI service
      const generatedModule = await curriculumAI.generateModule(generationParams);

      // Add to store
      addGeneratedModule(generatedModule);

      // Update local state
      setModuleTitle(generatedModule.title);
      setModuleContent(generatedModule.description);
      setShowCharacterPreview(true);

      // Play celebration animation
      setTimeout(() => {
        animationBridge.playAnimation("celebrate", 2.0);
      }, 1000);

      // Auto-save if enabled
      if (autoSave) {
        await saveModule(generatedModule);
      }

      toast({
        title: "Module Generated Successfully!",
        description: `Created "${generatedModule.title}" with ${selectedCharacter.name}`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setGenerationStatus("complete");
    } catch (error) {
      console.error("Module generation failed:", error);

      // Play error animation
      animationBridge.playAnimation("thinking", 2.0);

      setGenerationStatus("error");

      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate module. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  }, [
    selectedCharacter,
    selectedSubject,
    selectedTemplate,
    customObjectives,
    difficulty,
    duration,
    enableAccessibility,
    autoSave,
    animationBridge,
    setGenerationStatus,
    addGeneratedModule,
    toast,
  ]);

  // Save module function
  const saveModule = useCallback(
    async (module = currentModule) => {
      if (!module) return;

      try {
        // Simulate saving to backend
        console.log("Saving module:", module);

        // Update progress tracking
        const studentId = "current_user"; // Would come from auth context
        updateStudentProgress(studentId, module.metadata?.id || Date.now(), {
          subject: selectedSubject,
          completed: true,
          score: 100,
          timeSpent: duration,
        });

        toast({
          title: "Module Saved",
          description: "Module has been saved successfully.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Save Failed",
          description: "Failed to save module. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    },
    [currentModule, updateStudentProgress, selectedSubject, duration, toast],
  );

  // Preview module function
  const previewModule = useCallback(() => {
    if (!currentModule) return;

    setPreviewMode(true);
    animationBridge.playAnimation("teaching", 5.0);

    // Simulate module preview
    toast({
      title: "Module Preview",
      description: "Starting module preview with character interactions.",
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  }, [currentModule, animationBridge, toast]);

  // Character selection handler
  const handleCharacterChange = useCallback(
    (characterId) => {
      const character = curriculumCharacters.find((c) => c.id === characterId);
      if (character) {
        selectCharacter(character);
        setShowCharacterPreview(true);

        // Play greeting animation
        setTimeout(() => {
          animationBridge.playAnimation("idle", 2.0);
        }, 500);
      }
    },
    [selectCharacter, animationBridge],
  );

  // Template selection handler
  const handleTemplateChange = useCallback(
    (templateTitle) => {
      const template = availableTemplates.find((t) => t.title === templateTitle);
      if (template) {
        setSelectedTemplate(template);
        setModuleTitle(template.title);
        setDifficulty(template.difficulty);
        setDuration(template.duration);
        setCustomObjectives(template.objectives.join("\n"));
      }
    },
    [availableTemplates],
  );

  return (
    <Box p={5} bg={bgColor} minH="100vh">
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <VStack align="start" spacing={1}>
            <Heading as="h2" size="xl">
              Enhanced Curriculum Builder
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Create AI-powered, accessible learning modules with animated character guides
            </Text>
          </VStack>

          {/* Settings Panel */}
          <HStack spacing={4}>
            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="accessibility-mode" mb="0" fontSize="sm">
                Accessibility
              </FormLabel>
              <Switch
                id="accessibility-mode"
                isChecked={enableAccessibility}
                onChange={(e) => setEnableAccessibility(e.target.checked)}
                colorScheme="blue"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="auto-save" mb="0" fontSize="sm">
                Auto-save
              </FormLabel>
              <Switch
                id="auto-save"
                isChecked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                colorScheme="green"
              />
            </FormControl>
          </HStack>
        </Flex>

        {/* Progress Indicator */}
        {generationStatus === "generating" && (
          <Alert status="info" borderRadius="md">
            <Spinner size="sm" mr={3} />
            <AlertTitle mr={2}>Generating Module...</AlertTitle>
            <AlertDescription>
              AI is creating your personalized learning module with {selectedCharacter?.name}.
            </AlertDescription>
          </Alert>
        )}

        <Flex direction={{ base: "column", lg: "row" }} gap={6}>
          {/* Main Configuration Panel */}
          <VStack align="stretch" flex="2" spacing={6}>
            <Card borderWidth="1px" borderColor={borderColor}>
              <CardHeader>
                <Heading size="md">Module Configuration</Heading>
              </CardHeader>
              <CardBody>
                <VStack spacing={4}>
                  {/* Subject Selection */}
                  <FormControl>
                    <FormLabel>Subject Area</FormLabel>
                    <Select
                      value={selectedSubject}
                      onChange={(e) => {
                        setSelectedSubject(e.target.value);
                        // Reset character if current one doesn't support this subject
                        const validCharacters = curriculumCharacters.filter((char) =>
                          char.subjects.includes(e.target.value),
                        );
                        if (
                          validCharacters.length > 0 &&
                          !validCharacters.find((c) => c.id === selectedCharacter?.id)
                        ) {
                          selectCharacter(validCharacters[0]);
                        }
                      }}
                    >
                      <option value="Life Skills">Life Skills</option>
                      <option value="Employment Skills">Employment Skills</option>
                      <option value="Digital Literacy">Digital Literacy</option>
                    </Select>
                    <FormHelperText>
                      Choose the main subject area for your learning module
                    </FormHelperText>
                  </FormControl>

                  {/* Template Selection */}
                  <FormControl>
                    <FormLabel>Module Template (Optional)</FormLabel>
                    <Select
                      placeholder="Select a template or create custom"
                      value={selectedTemplate?.title || ""}
                      onChange={(e) => handleTemplateChange(e.target.value)}
                    >
                      {availableTemplates.map((template) => (
                        <option key={template.title} value={template.title}>
                          {template.title} ({template.duration}min, {template.difficulty})
                        </option>
                      ))}
                    </Select>
                    <FormHelperText>
                      Templates provide pre-configured learning objectives and structure
                    </FormHelperText>
                  </FormControl>

                  {/* Character Selection */}
                  <FormControl>
                    <FormLabel>Character Guide</FormLabel>
                    <Select
                      value={selectedCharacter?.id || ""}
                      onChange={(e) => handleCharacterChange(e.target.value)}
                    >
                      {filteredCharacters.map((character) => (
                        <option key={character.id} value={character.id}>
                          {character.name} - {character.description}
                        </option>
                      ))}
                    </Select>
                    <FormHelperText>
                      Your AI character guide specializes in{" "}
                      {selectedCharacter?.specializations?.join(", ")}
                    </FormHelperText>
                  </FormControl>

                  {/* Configuration Grid */}
                  <Grid templateColumns="repeat(2, 1fr)" gap={4} w="full">
                    <FormControl>
                      <FormLabel>Difficulty Level</FormLabel>
                      <Select value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                      </Select>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <Input
                        type="number"
                        value={duration}
                        onChange={(e) => setDuration(parseInt(e.target.value))}
                        min={15}
                        max={120}
                      />
                    </FormControl>
                  </Grid>

                  {/* Custom Learning Objectives */}
                  <FormControl>
                    <FormLabel>Learning Objectives</FormLabel>
                    <Textarea
                      value={customObjectives}
                      onChange={(e) => setCustomObjectives(e.target.value)}
                      placeholder="Enter learning objectives (one per line)&#10;Example:&#10;- Understand basic concepts&#10;- Apply skills in practice&#10;- Demonstrate competency"
                      rows={4}
                    />
                    <FormHelperText>
                      Customize the learning objectives or use template defaults
                    </FormHelperText>
                  </FormControl>
                </VStack>
              </CardBody>
            </Card>

            {/* Character Animation Controls */}
            {selectedCharacter && (
              <Card borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Character Controls</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4}>
                    <HStack w="full" justify="space-between">
                      <Text fontSize="sm" fontWeight="bold">
                        Animation Controls:
                      </Text>
                      <Badge
                        colorScheme={animationBridge.isConnected ? "green" : "red"}
                        variant="subtle"
                      >
                        {animationBridge.isConnected ? "Connected" : "Disconnected"}
                      </Badge>
                    </HStack>

                    <Grid templateColumns="repeat(3, 1fr)" gap={2} w="full">
                      {selectedCharacter.animations.map((anim) => (
                        <Tooltip key={anim.id} label={anim.accessibility} placement="top">
                          <Button
                            size="sm"
                            variant={currentAnimation === anim.id ? "solid" : "outline"}
                            colorScheme="blue"
                            onClick={() => animationBridge.playAnimation(anim.id, 3.0)}
                            isLoading={isAnimating && currentAnimation === anim.id}
                            aria-label={anim.accessibility}
                          >
                            {anim.label}
                          </Button>
                        </Tooltip>
                      ))}
                    </Grid>

                    {animationQueue.length > 0 && (
                      <Alert status="info" size="sm">
                        <InfoIcon />
                        <Text fontSize="xs" ml={2}>
                          {animationQueue.length} animation(s) queued
                        </Text>
                      </Alert>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}

            {/* Generation Button */}
            <Button
              colorScheme="blue"
              size="lg"
              onClick={generateModule}
              isLoading={generationStatus === "generating"}
              loadingText="Generating Module..."
              leftIcon={<StarIcon />}
              isDisabled={!selectedCharacter}
            >
              Generate AI-Powered Module
            </Button>
          </VStack>

          {/* Character Preview Panel */}
          <VStack align="stretch" flex="1" spacing={6}>
            {showCharacterPreview && selectedCharacter && (
              <Card borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{selectedCharacter.name}</Heading>
                    <CloseButton
                      onClick={() => setShowCharacterPreview(false)}
                      aria-label="Close character preview"
                    />
                  </Flex>
                  <Text fontSize="sm" color="gray.600">
                    {selectedCharacter.description}
                  </Text>
                </CardHeader>
                <CardBody p={0}>
                  {generationStatus === "generating" ? (
                    <VStack p={6} spacing={4}>
                      <Skeleton height="200px" w="full" />
                      <SkeletonText noOfLines={3} spacing="4" />
                    </VStack>
                  ) : (
                    <BlenderModelViewer
                      modelPath={selectedCharacter.path}
                      isCharacter={true}
                      width="100%"
                      height="300px"
                      backgroundColor="#f9fafb"
                      initialAnimation={currentAnimation}
                      availableAnimations={selectedCharacter.animations}
                      showControls={false}
                      autoRotate={true}
                      scale={1}
                    />
                  )}
                </CardBody>
                <CardFooter>
                  <VStack w="full" spacing={2}>
                    <Badge colorScheme="purple" variant="subtle">
                      Specializes in: {selectedCharacter.specializations?.join(", ")}
                    </Badge>
                    {enableAccessibility && (
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Accessibility: {selectedCharacter.accessibilityFeatures?.join(", ")}
                      </Text>
                    )}
                  </VStack>
                </CardFooter>
              </Card>
            )}

            {/* Generated Module Preview */}
            {currentModule && (
              <Card borderWidth="1px" borderColor={borderColor}>
                <CardHeader>
                  <Heading size="md">Generated Module</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel>Module Title</FormLabel>
                      <Input
                        value={moduleTitle}
                        onChange={(e) => setModuleTitle(e.target.value)}
                        aria-describedby="title-helper"
                      />
                      <FormHelperText id="title-helper">
                        Edit the module title as needed
                      </FormHelperText>
                    </FormControl>

                    <FormControl>
                      <FormLabel>Module Description</FormLabel>
                      <Textarea
                        value={moduleContent}
                        onChange={(e) => setModuleContent(e.target.value)}
                        rows={6}
                        aria-describedby="content-helper"
                      />
                      <FormHelperText id="content-helper">
                        AI-generated content can be customized
                      </FormHelperText>
                    </FormControl>

                    {/* Module Metadata */}
                    <VStack spacing={2} align="stretch">
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">
                          Duration:
                        </Text>
                        <HStack>
                          <TimeIcon size="xs" />
                          <Text fontSize="sm">{duration} minutes</Text>
                        </HStack>
                      </HStack>
                      <HStack justify="space-between">
                        <Text fontSize="sm" color="gray.600">
                          Difficulty:
                        </Text>
                        <Badge colorScheme="blue" variant="subtle" textTransform="capitalize">
                          {difficulty}
                        </Badge>
                      </HStack>
                      {currentModule.learningObjectives && (
                        <VStack align="stretch">
                          <Text fontSize="sm" fontWeight="bold" color="gray.600">
                            Learning Objectives:
                          </Text>
                          {currentModule.learningObjectives.map((objective, index) => (
                            <HStack key={index}>
                              <CheckIcon size="xs" color="green.500" />
                              <Text fontSize="sm">{objective}</Text>
                            </HStack>
                          ))}
                        </VStack>
                      )}
                    </VStack>
                  </VStack>
                </CardBody>
                <CardFooter>
                  <HStack w="full" justify="space-between">
                    <Button
                      colorScheme="green"
                      onClick={() => saveModule()}
                      leftIcon={<CheckIcon />}
                    >
                      Save Module
                    </Button>
                    <Button variant="outline" onClick={previewModule} leftIcon={<ViewIcon />}>
                      Preview
                    </Button>
                  </HStack>
                </CardFooter>
              </Card>
            )}
          </VStack>
        </Flex>
      </VStack>
    </Box>
  );
}
