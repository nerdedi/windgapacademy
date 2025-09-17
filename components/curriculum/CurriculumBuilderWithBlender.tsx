// @ts-nocheck - This file has Chakra UI dependencies that need to be installed
// Example implementation for the CurriculumBuilder component
// This shows how to integrate Blender character models with the curriculum builder

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
} from "@chakra-ui/react";
import { useState } from "react";

import BlenderModelViewer from "../../src/components/BlenderModelViewer.js";
import UnityAnimationBridge from "../../src/components/UnityAnimationBridge";
// @ts-ignore - Chakra UI React components

// Character definitions for curriculum
const curriculumCharacters = [
  {
    id: "winnie",
    name: "Winnie",
    path: "/assets/characters/winnie/winnie.glb",
    animations: [
      { id: "idle", label: "Idle", clipName: "idle" },
      { id: "teaching", label: "Teaching", clipName: "teaching" },
      { id: "encourage", label: "Encourage", clipName: "encourage" },
      { id: "celebrate", label: "Celebrate", clipName: "celebrate" },
    ],
    subjects: ["Life Skills", "Digital Literacy"],
  },
  {
    id: "natalie",
    name: "Natalie",
    path: "/assets/characters/natalie/natalie.glb",
    animations: [
      { id: "idle", label: "Idle", clipName: "idle" },
      { id: "teaching", label: "Teaching", clipName: "teaching" },
    ],
    subjects: ["Employment Skills", "Digital Literacy"],
  },
];

// Module templates
const moduleTemplates = {
  "Life Skills": [
    "Daily Living Skills",
    "Social Skills",
    "Self-Care and Health",
    "Community Navigation",
    "Personal Finance",
  ],
  "Employment Skills": [
    "Resume Building",
    "Interview Skills",
    "Workplace Communication",
    "Time Management",
    "Career Exploration",
  ],
  "Digital Literacy": [
    "Computer Basics",
    "Internet Safety",
    "Using Email",
    "Social Media Awareness",
    "Office Applications",
  ],
};

export default function CurriculumBuilder() {
  const [selectedSubject, setSelectedSubject] = useState("Life Skills");
  const [selectedCharacter, setSelectedCharacter] = useState(curriculumCharacters[0]);
  const [selectedAnimation, setSelectedAnimation] = useState("idle");
  const [showCharacterPreview, setShowCharacterPreview] = useState(false);
  const [moduleTitle, setModuleTitle] = useState("");
  const [moduleContent, setModuleContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Get animation control functions from the bridge
  const {
    playAnimation,
    playEmote,
    lookAt: _lookAt,
    isConnected,
  } = UnityAnimationBridge({
    characterId: selectedCharacter.id,
  });

  const toast = useToast();

  // Filter characters by selected subject
  const filteredCharacters = curriculumCharacters.filter((character) =>
    character.subjects.includes(selectedSubject),
  );

  // Auto-generate a module based on selected subject
  const generateModule = () => {
    setIsGenerating(true);

    // Simulate module generation (in real app, this would call an API)
    setTimeout(() => {
      const templates = moduleTemplates[selectedSubject as keyof typeof moduleTemplates];
      const randomTemplate = templates[Math.floor(Math.random() * templates.length)];

      setModuleTitle(`${randomTemplate} Module`);
      setModuleContent(
        `This is an automatically generated curriculum module for ${selectedSubject}, focusing on ${randomTemplate}.\n\nIt features ${selectedCharacter.name} as the instructor character.\n\nThe character will use the "${selectedAnimation}" animation during key teaching moments.`,
      );

      setShowCharacterPreview(true);
      setIsGenerating(false);

      // Play the teaching animation
      if (selectedCharacter.animations.find((anim) => anim.id === "teaching")) {
        setSelectedAnimation("teaching");
        // Use the Unity Animation Bridge to play the animation
        playAnimation("teaching", 3.0);
      }

      toast({
        title: "Module Generated",
        description: `Created a new ${randomTemplate} module with ${selectedCharacter.name}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    }, 1500);
  };

  return (
    <Box p={5}>
      <Heading as="h2" size="xl" mb={6}>
        Curriculum Builder
      </Heading>

      <Flex direction={{ base: "column", md: "row" }} gap={6}>
        <VStack align="stretch" flex="1" spacing={4}>
          <FormControl>
            <FormLabel>Subject</FormLabel>
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
                  !validCharacters.find((c) => c.id === selectedCharacter.id)
                ) {
                  setSelectedCharacter(validCharacters[0]);
                }
              }}
            >
              <option value="Life Skills">Life Skills</option>
              <option value="Employment Skills">Employment Skills</option>
              <option value="Digital Literacy">Digital Literacy</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel>Character</FormLabel>
            <Select
              value={selectedCharacter.id}
              onChange={(e) => {
                const character = curriculumCharacters.find((c) => c.id === e.target.value);
                if (character) {
                  setSelectedCharacter(character);
                  setSelectedAnimation("idle"); // Reset to idle animation
                }
              }}
            >
              {filteredCharacters.map((character) => (
                <option key={character.id} value={character.id}>
                  {character.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <Box mt={2}>
            <Text fontSize="sm" fontWeight="bold" mb={2}>
              Animation Controls:
            </Text>
            <HStack>
              <Button
                colorScheme="blue"
                size="sm"
                onClick={() => {
                  playAnimation(selectedAnimation, 3.0);
                }}
              >
                Play Animation
              </Button>
              <Button
                colorScheme="teal"
                size="sm"
                onClick={() => {
                  playEmote("happy");
                }}
              >
                Happy Emote
              </Button>
            </HStack>
            {isConnected && (
              <Text fontSize="xs" color="green.500" mt={1}>
                Connected to Unity
              </Text>
            )}
          </Box>

          <Button
            colorScheme="blue"
            onClick={generateModule}
            isLoading={isGenerating}
            loadingText="Generating..."
          >
            Auto-generate Module
          </Button>

          {moduleTitle && (
            <>
              <Divider my={4} />

              <FormControl>
                <FormLabel>Module Title</FormLabel>
                <Input value={moduleTitle} onChange={(e) => setModuleTitle(e.target.value)} />
              </FormControl>

              <FormControl>
                <FormLabel>Module Content</FormLabel>
                <Textarea
                  value={moduleContent}
                  onChange={(e) => setModuleContent(e.target.value)}
                  rows={10}
                />
              </FormControl>

              <HStack>
                <Button colorScheme="green">Save Module</Button>
                <Button variant="outline">Preview Full Module</Button>
              </HStack>
            </>
          )}
        </VStack>

        {showCharacterPreview && (
          <Box flex="1" borderWidth="1px" borderRadius="lg" overflow="hidden">
            <Text p={4} fontWeight="bold" bg="gray.50">
              Character Preview: {selectedCharacter.name}
            </Text>

            <BlenderModelViewer
              modelPath={selectedCharacter.path}
              isCharacter={true}
              width="100%"
              height="400px"
              backgroundColor="#f9fafb"
              initialAnimation={selectedAnimation}
              availableAnimations={selectedCharacter.animations}
              showControls={true}
              autoRotate={false}
              scale={1}
            />

            <Box p={4}>
              <FormControl size="sm">
                <FormLabel fontSize="sm">Animation</FormLabel>
                <Select
                  size="sm"
                  value={selectedAnimation}
                  onChange={(e) => setSelectedAnimation(e.target.value)}
                >
                  {selectedCharacter.animations.map((anim) => (
                    <option key={anim.id} value={anim.id}>
                      {anim.label}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </Box>
        )}
      </Flex>
    </Box>
  );
}
