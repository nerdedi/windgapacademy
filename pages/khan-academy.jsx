import {
  Box,
  Container,
  Heading,
  Link,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import KhanAcademyExercise from "../components/KhanAcademyExercise";
import KhanAcademyResources from "../components/KhanAcademyResources";

/**
 * Khan Academy Integration Page
 * This page demonstrates the integration of Khan Academy resources into Windgap Academy
 */
const KhanAcademyPage = () => {
  const [selectedExercise, setSelectedExercise] = useState("adding_fractions");

  // Example exercises - in a real application, these would come from an API
  const exampleExercises = [
    { id: "adding_fractions", name: "Adding Fractions" },
    { id: "graphing_linear_equations", name: "Graphing Linear Equations" },
    {
      id: "adding_and_subtracting_negative_numbers",
      name: "Adding and Subtracting Negative Numbers",
    },
    { id: "scientific_notation", name: "Scientific Notation" },
  ];

  return (
    <Container maxW="1200px" py={8}>
      <Heading as="h1" mb={6}>
        Khan Academy Integration
      </Heading>

      <Box mb={8}>
        <Text fontSize="lg" mb={4}>
          This page demonstrates how Khan Academy content can be integrated into the Windgap Academy
          platform to provide additional educational resources and exercises for students.
        </Text>
      </Box>

      <Tabs variant="enclosed" colorScheme="teal">
        <TabList>
          <Tab>Khan Resources</Tab>
          <Tab>Embedded Exercise</Tab>
          <Tab>Implementation Guide</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Box py={4}>
              <Heading as="h2" size="md" mb={4}>
                Browse Khan Academy Resources
              </Heading>
              <Text mb={6}>
                Use this component to browse available Khan Academy resources and integrate them
                into your lessons.
              </Text>

              <KhanAcademyResources />
            </Box>
          </TabPanel>

          <TabPanel>
            <Box py={4}>
              <Heading as="h2" size="md" mb={4}>
                Embedded Khan Academy Exercise
              </Heading>
              <Text mb={4}>
                This example shows a Khan Academy exercise directly embedded into a Windgap Academy
                page.
              </Text>

              <Box mb={4}>
                <Text fontWeight="bold" mb={2}>
                  Select an exercise:
                </Text>
                <select
                  value={selectedExercise}
                  onChange={(e) => setSelectedExercise(e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    marginBottom: "20px",
                  }}
                >
                  {exampleExercises.map((exercise) => (
                    <option key={exercise.id} value={exercise.id}>
                      {exercise.name}
                    </option>
                  ))}
                </select>
              </Box>

              <Box border="1px solid #eee" borderRadius="md" p={1}>
                <KhanAcademyExercise exerciseId={selectedExercise} />
              </Box>
            </Box>
          </TabPanel>

          <TabPanel>
            <Box py={4}>
              <Heading as="h2" size="md" mb={4}>
                Implementation Guide
              </Heading>

              <Text mb={4}>To implement Khan Academy integration in your own projects:</Text>

              <Box mb={6}>
                <Text fontWeight="bold" mb={2}>
                  1. Set up the Khan exercises server:
                </Text>
                <Box bg="gray.50" p={3} borderRadius="md" fontFamily="mono">
                  <Text>bash scripts/setup-khan-exercises.sh</Text>
                </Box>
              </Box>

              <Box mb={6}>
                <Text fontWeight="bold" mb={2}>
                  2. Start the Khan exercises server:
                </Text>
                <Box bg="gray.50" p={3} borderRadius="md" fontFamily="mono">
                  <Text>npm run khan:serve</Text>
                </Box>
              </Box>

              <Box mb={6}>
                <Text fontWeight="bold" mb={2}>
                  3. Use the integration components:
                </Text>
                <Box bg="gray.50" p={3} borderRadius="md" fontFamily="mono" whiteSpace="pre">
                  {`import KhanAcademyExercise from '../components/KhanAcademyExercise';
import KhanAcademyResources from '../components/KhanAcademyResources';

// In your component:
<KhanAcademyExercise exerciseId="adding_fractions" />
<KhanAcademyResources />`}
                </Box>
              </Box>

              <Box bg="blue.50" p={4} borderRadius="md" mb={6}>
                <Text fontWeight="bold">Read the full documentation:</Text>
                <Link color="blue.500" href="/docs/KHAN_ACADEMY_INTEGRATION.md">
                  KHAN_ACADEMY_INTEGRATION.md
                </Link>
              </Box>
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  );
};

export default KhanAcademyPage;
