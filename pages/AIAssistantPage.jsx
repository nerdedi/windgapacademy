import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Heading,
  Text,
  Button,
  SimpleGrid,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import AIAssistant from "../components/AIAssistant";
import useAIAssistant from "../hooks/useAIAssistant";

// Sample AAC symbols for demonstration
const sampleSymbols = [
  { id: "sym1", name: "I", imageUrl: "/assets/symbols/i.png" },
  { id: "sym2", name: "want", imageUrl: "/assets/symbols/want.png" },
  { id: "sym3", name: "go", imageUrl: "/assets/symbols/go.png" },
  { id: "sym4", name: "outside", imageUrl: "/assets/symbols/outside.png" },
  { id: "sym5", name: "play", imageUrl: "/assets/symbols/play.png" },
  { id: "sym6", name: "eat", imageUrl: "/assets/symbols/eat.png" },
  { id: "sym7", name: "drink", imageUrl: "/assets/symbols/drink.png" },
  { id: "sym8", name: "happy", imageUrl: "/assets/symbols/happy.png" },
  { id: "sym9", name: "sad", imageUrl: "/assets/symbols/sad.png" },
  { id: "sym10", name: "help", imageUrl: "/assets/symbols/help.png" },
  { id: "sym11", name: "please", imageUrl: "/assets/symbols/please.png" },
  { id: "sym12", name: "thank you", imageUrl: "/assets/symbols/thank_you.png" },
];

const AIAssistantPage = () => {
  const [selectedSymbols, setSelectedSymbols] = useState([]);
  const [assistantMode, setAssistantMode] = useState("sentence");
  const [generatedText, setGeneratedText] = useState("");
  const [grammarText, setGrammarText] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const { constructSentence, correctGrammar, interpretSymbols, isLoading } = useAIAssistant();

  const handleSymbolClick = (symbol) => {
    setSelectedSymbols([...selectedSymbols, symbol]);
  };

  const handleClearSymbols = () => {
    setSelectedSymbols([]);
  };

  const handleAssistantOpen = (mode) => {
    setAssistantMode(mode);
    onOpen();
  };

  const handleSentenceGenerated = (sentence) => {
    setGeneratedText(sentence);
    toast({
      title: "Sentence generated",
      description: sentence,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleQuickSentence = async () => {
    if (selectedSymbols.length === 0) {
      toast({
        title: "No symbols selected",
        description: "Please select symbols to generate a sentence.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await constructSentence(selectedSymbols);
      setGeneratedText(result.sentence);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate sentence. Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleGrammarCorrection = async () => {
    if (!grammarText) {
      toast({
        title: "No text to correct",
        description: "Please enter text to correct grammar.",
        status: "warning",
        duration: 3000,
      });
      return;
    }

    try {
      const result = await correctGrammar(grammarText);
      setGeneratedText(result.corrected);
      if (result.explanation) {
        toast({
          title: "Grammar corrected",
          description: result.explanation,
          status: "info",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to correct grammar. Please try again.",
        status: "error",
        duration: 3000,
      });
    }
  };

  // Text-to-speech functionality
  const speakText = (text) => {
    if (!text) return;

    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;

    window.speechSynthesis.speak(speech);
  };

  return (
    <Container maxW="1200px" py={8}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        AI Assistant Integration Demo
      </Heading>

      <Box mb={8} p={4} borderWidth={1} borderRadius="lg" bg="blue.50">
        <Heading as="h2" size="md" mb={2}>
          Communication Board
        </Heading>
        <Text mb={4}>
          Select symbols to create a message. Then use the AI Assistant to transform them into
          natural language.
        </Text>

        <SimpleGrid columns={{ base: 3, md: 6 }} spacing={4} mb={6}>
          {sampleSymbols.map((symbol) => (
            <motion.div key={symbol.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Box
                onClick={() => handleSymbolClick(symbol)}
                p={3}
                borderWidth={1}
                borderRadius="md"
                bg="white"
                textAlign="center"
                cursor="pointer"
                _hover={{ bg: "gray.100" }}
              >
                <Box
                  height="60px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  mb={2}
                  fontSize="2xl"
                >
                  {symbol.imageUrl ? (
                    <img src={symbol.imageUrl} alt={symbol.name} style={{ maxHeight: "100%" }} />
                  ) : (
                    <Box>{symbol.name.charAt(0).toUpperCase()}</Box>
                  )}
                </Box>
                <Text fontSize="sm">{symbol.name}</Text>
              </Box>
            </motion.div>
          ))}
        </SimpleGrid>
      </Box>

      <Box mb={8} p={4} borderWidth={1} borderRadius="lg" bg="gray.50">
        <Heading as="h2" size="md" mb={2}>
          Selected Symbols
        </Heading>

        {selectedSymbols.length > 0 ? (
          <Box mb={4} display="flex" flexWrap="wrap" gap={2}>
            {selectedSymbols.map((symbol, index) => (
              <Box
                key={`${symbol.id}-${index}`}
                px={3}
                py={2}
                borderWidth={1}
                borderRadius="md"
                bg="blue.100"
              >
                {symbol.name}
              </Box>
            ))}
          </Box>
        ) : (
          <Text mb={4} color="gray.500">
            No symbols selected yet.
          </Text>
        )}

        <Box display="flex" gap={4} flexWrap="wrap">
          <Button
            colorScheme="blue"
            onClick={() => handleAssistantOpen("sentence")}
            isDisabled={selectedSymbols.length === 0}
          >
            Open AI Assistant
          </Button>

          <Button
            colorScheme="green"
            onClick={handleQuickSentence}
            isLoading={isLoading}
            isDisabled={selectedSymbols.length === 0}
          >
            Quick Sentence
          </Button>

          <Button
            colorScheme="red"
            variant="outline"
            onClick={handleClearSymbols}
            isDisabled={selectedSymbols.length === 0}
          >
            Clear Symbols
          </Button>
        </Box>
      </Box>

      <Box mb={8} p={4} borderWidth={1} borderRadius="lg" bg="green.50">
        <Heading as="h2" size="md" mb={2}>
          Generated Text
        </Heading>

        {generatedText ? (
          <Box mb={4} p={3} bg="white" borderWidth={1} borderRadius="md" position="relative">
            <Text fontSize="lg">{generatedText}</Text>
            <Button
              size="sm"
              colorScheme="blue"
              position="absolute"
              top="8px"
              right="8px"
              onClick={() => speakText(generatedText)}
            >
              🔊 Speak
            </Button>
          </Box>
        ) : (
          <Text mb={4} color="gray.500">
            Use the AI Assistant to generate text.
          </Text>
        )}
      </Box>

      <Box mb={8} p={4} borderWidth={1} borderRadius="lg" bg="purple.50">
        <Heading as="h2" size="md" mb={4}>
          Grammar Correction
        </Heading>

        <Box mb={4}>
          <textarea
            value={grammarText}
            onChange={(e) => setGrammarText(e.target.value)}
            placeholder="Enter text with grammar errors to correct..."
            className="w-full p-2 border rounded min-h-[80px]"
          />
        </Box>

        <Box display="flex" gap={4}>
          <Button
            colorScheme="purple"
            onClick={() => handleAssistantOpen("grammar")}
            isDisabled={!grammarText}
          >
            Open Grammar Assistant
          </Button>

          <Button
            colorScheme="teal"
            onClick={handleGrammarCorrection}
            isLoading={isLoading}
            isDisabled={!grammarText}
          >
            Quick Correction
          </Button>
        </Box>
      </Box>

      <Box p={4} borderWidth={1} borderRadius="lg" bg="orange.50">
        <Heading as="h2" size="md" mb={2}>
          Symbol Interpretation
        </Heading>

        <Text mb={4}>
          Let the AI interpret the meaning behind symbols for more complex communication needs.
        </Text>

        <Button
          colorScheme="orange"
          onClick={() => handleAssistantOpen("interpret")}
          isDisabled={selectedSymbols.length === 0}
        >
          Interpret Symbols
        </Button>
      </Box>

      {isOpen && (
        <AIAssistant
          symbols={selectedSymbols}
          initialText={assistantMode === "grammar" ? grammarText : ""}
          mode={assistantMode}
          onSentenceGenerated={handleSentenceGenerated}
          onClose={onClose}
        />
      )}
    </Container>
  );
};

export default AIAssistantPage;
