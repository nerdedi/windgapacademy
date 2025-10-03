import { Box, Button, Card, CardBody, CardHeader, Heading, Select, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

/**
 * KhanAcademyResources component
 *
 * This component demonstrates how to integrate Khan Academy resources
 * into the Windgap Academy platform.
 */
const KhanAcademyResources = () => {
  const [selectedSubject, setSelectedSubject] = useState("math");
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sample subjects (would come from API in production)
  const subjects = [
    { id: "math", name: "Mathematics" },
    { id: "science", name: "Science" },
    { id: "computing", name: "Computing" },
    { id: "humanities", name: "Humanities" },
  ];

  // Mock function to simulate fetching resources from Khan Academy API
  const fetchKhanResources = async (subject) => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation, this would be an API call
      // await fetch('/api/khan/resources?subject=' + subject)

      // Mock data for demonstration purposes
      const mockData = {
        math: [
          {
            id: "early-math",
            title: "Early Math",
            type: "course",
            url: "https://www.khanacademy.org/math/early-math",
          },
          {
            id: "arithmetic",
            title: "Arithmetic",
            type: "course",
            url: "https://www.khanacademy.org/math/arithmetic",
          },
          {
            id: "algebra",
            title: "Algebra 1",
            type: "course",
            url: "https://www.khanacademy.org/math/algebra",
          },
        ],
        science: [
          {
            id: "biology",
            title: "Biology",
            type: "course",
            url: "https://www.khanacademy.org/science/biology",
          },
          {
            id: "chemistry",
            title: "Chemistry",
            type: "course",
            url: "https://www.khanacademy.org/science/chemistry",
          },
          {
            id: "physics",
            title: "Physics",
            type: "course",
            url: "https://www.khanacademy.org/science/physics",
          },
        ],
        computing: [
          {
            id: "computer-programming",
            title: "Computer Programming",
            type: "course",
            url: "https://www.khanacademy.org/computing/computer-programming",
          },
          {
            id: "computer-science",
            title: "Computer Science",
            type: "course",
            url: "https://www.khanacademy.org/computing/computer-science",
          },
        ],
        humanities: [
          {
            id: "world-history",
            title: "World History",
            type: "course",
            url: "https://www.khanacademy.org/humanities/world-history",
          },
          {
            id: "us-history",
            title: "US History",
            type: "course",
            url: "https://www.khanacademy.org/humanities/us-history",
          },
        ],
      };

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setResources(mockData[subject] || []);
    } catch (err) {
      console.error("Error fetching Khan Academy resources:", err);
      setError("Failed to load Khan Academy resources. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Load resources when the selected subject changes
  useEffect(() => {
    fetchKhanResources(selectedSubject);
  }, [selectedSubject]);

  // Handler for embedding a resource
  const handleEmbed = (resource) => {
    // In a real implementation, this could add the resource to the current lesson
    console.log("Embedding resource:", resource);
    alert(`Resource "${resource.title}" would be embedded here!`);
  };

  return (
    <Card variant="outline" width="100%" maxWidth="900px" margin="0 auto">
      <CardHeader>
        <Heading size="md">Khan Academy Resources</Heading>
      </CardHeader>
      <CardBody>
        <Box mb={4}>
          <Select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            width="100%"
            maxWidth="300px"
          >
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </Select>
        </Box>

        {loading && <Text>Loading resources...</Text>}

        {error && (
          <Box color="red.500" mb={4}>
            <Text>{error}</Text>
            <Button
              mt={2}
              colorScheme="blue"
              size="sm"
              onClick={() => fetchKhanResources(selectedSubject)}
            >
              Retry
            </Button>
          </Box>
        )}

        {!loading && !error && (
          <Box>
            {resources.length === 0 ? (
              <Text>No resources found.</Text>
            ) : (
              <Box display="flex" flexDirection="column" gap={3}>
                {resources.map((resource) => (
                  <Box
                    key={resource.id}
                    p={3}
                    borderWidth="1px"
                    borderRadius="md"
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Text fontWeight="bold">{resource.title}</Text>
                      <Text fontSize="sm" color="gray.600">
                        Type: {resource.type}
                      </Text>
                    </Box>
                    <Box>
                      <Button
                        size="sm"
                        colorScheme="teal"
                        mr={2}
                        onClick={() => handleEmbed(resource)}
                      >
                        Embed
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        as="a"
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View
                      </Button>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        )}

        <Box mt={6} p={4} bg="blue.50" borderRadius="md">
          <Text fontSize="sm">
            This component demonstrates how Khan Academy resources can be integrated into Windgap
            Academy. For more detailed integration instructions, see the{" "}
            <strong>docs/KHAN_ACADEMY_INTEGRATION.md</strong> file.
          </Text>
        </Box>
      </CardBody>
    </Card>
  );
};

export default KhanAcademyResources;
