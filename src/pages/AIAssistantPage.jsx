import { Box, Button, Container, Grid, Heading, Text, VStack } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useState } from "react";

// This is a simplified version of the AIAssistantPage component
// Create this file in src/pages/AIAssistantPage.jsx

// Simple toast implementation since useToast is not available
const useCustomToast = () => {
  // eslint-disable-next-line no-unused-vars
  const showToast = ({ title, description, status, duration = 3000 }) => {
    console.log(`Toast: ${title} - ${description} (${status})`);
    // In a real implementation, you would show a toast notification
    alert(`${title}: ${description}`);
  };

  return showToast;
};

const AIAssistantPage = () => {
  const [inputText, setInputText] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toast = useCustomToast();

  // Simulated AI response function - in a real app, this would call your AI API
  const getAIResponse = async (text) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
    return `AI response to: "${text}". This is a placeholder response that would be replaced with real AI-generated content in a production environment.`;
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter text to get a response",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const aiResponse = await getAIResponse(inputText);
      setResponse(aiResponse);
    } catch {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box
          as={motion.div}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          textAlign="center"
        >
          <Heading as="h1" size="2xl" mb={4}>
            AI Learning Assistant
          </Heading>
          <Text fontSize="xl" color="gray.600">
            Get personalized learning assistance powered by artificial intelligence
          </Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", md: "1fr 1fr" }} gap={8}>
          <Box
            as={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
          >
            <Heading size="md" mb={4}>
              Ask the AI Assistant
            </Heading>
            <VStack spacing={4} align="stretch">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type your question or request here..."
                style={{
                  width: "100%",
                  height: "150px",
                  padding: "10px",
                  borderRadius: "5px",
                  border: "1px solid #E2E8F0",
                }}
              />
              <Button colorScheme="blue" onClick={handleSubmit} isLoading={isLoading}>
                Get Response
              </Button>
            </VStack>
          </Box>

          <Box
            as={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            p={6}
            borderWidth="1px"
            borderRadius="lg"
            boxShadow="md"
            bg="white"
          >
            <Heading size="md" mb={4}>
              AI Response
            </Heading>
            <Box p={4} borderWidth="1px" borderRadius="md" bg="gray.50" minHeight="150px">
              {response ? (
                <Text>{response}</Text>
              ) : (
                <Text color="gray.400">AI response will appear here</Text>
              )}
            </Box>
          </Box>
        </Grid>

        <Box
          as={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          p={6}
          borderWidth="1px"
          borderRadius="lg"
          boxShadow="md"
          bg="white"
        >
          <Heading size="md" mb={4}>
            How the AI Assistant Can Help You
          </Heading>
          <Grid templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }} gap={4}>
            <Box p={4} borderWidth="1px" borderRadius="md">
              <Heading size="sm" mb={2}>
                Explain Concepts
              </Heading>
              <Text>
                Get clear explanations of difficult concepts tailored to your learning level.
              </Text>
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md">
              <Heading size="sm" mb={2}>
                Practice Problems
              </Heading>
              <Text>Generate practice problems with step-by-step solutions.</Text>
            </Box>
            <Box p={4} borderWidth="1px" borderRadius="md">
              <Heading size="sm" mb={2}>
                Learning Assistance
              </Heading>
              <Text>Receive personalized learning strategies and study tips.</Text>
            </Box>
          </Grid>
        </Box>
      </VStack>
    </Container>
  );
};

export default AIAssistantPage;
