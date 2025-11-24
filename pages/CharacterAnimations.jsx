import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useState } from "react";

import CharacterAnimationPlayer from "../components/CharacterAnimationPlayer.jsx";

const CharacterAnimationsPage = () => {
  const [selectedCharacter, setSelectedCharacter] = useState("Winnie");
  const [activeTab, setActiveTab] = useState(0);
  const [storyLog, setStoryLog] = useState([]);
  const [animationLog, setAnimationLog] = useState([]);

  // Handle tab onStoryNodeChange
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  // Handle character selection
  const handleCharacterChange = (event) => {
    setSelectedCharacter(event.target.value);
  };

  // Handle animation completion
  const handleAnimationComplete = (animationName, character) => {
    const timestamp = new Date().toLocaleTimeString();
    setAnimationLog((prev) => [
      ...prev,
      `[${timestamp}] ${character}: Completed "${animationName}" animation`,
    ]);
  };

  // Handle story node change
  const handleStoryNodeChange = (storyNode) => {
    const timestamp = new Date().toLocaleTimeString();
    setStoryLog((prev) => [
      ...prev,
      `[${timestamp}] ${storyNode.characterName}: "${storyNode.dialogText}"`,
    ]);
  };

  // Handle story completion
  const handleStoryComplete = () => {
    const timestamp = new Date().toLocaleTimeString();
    setStoryLog((prev) => [...prev, `[${timestamp}] Story complete`]);
  };

  // Clear logs
  const clearLogs = () => {
    if (activeTab === 0) {
      setStoryLog([]);
    } else {
      setAnimationLog([]);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h2" component="h1" gutterBottom>
        Character Animations & Interactive Stories
      </Typography>

      <Typography variant="body1" paragraph>
        This page demonstrates the integration between React and Unity for creating interactive
        character animations and storylines. The animations and game logic are powered by Unity,
        while the UI and application flow are controlled by React.
      </Typography>

      <Box sx={{ mb: 4 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="character-select-label">Character</InputLabel>
          <Select
            labelId="character-select-label"
            value={selectedCharacter}
            label="Character"
            onChange={handleCharacterChange}
          >
            <MenuItem value="Winnie">Winnie</MenuItem>
            <MenuItem value="Andy">Andy</MenuItem>
            <MenuItem value="Daisy">Daisy</MenuItem>
            <MenuItem value="Natalie">Natalie</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <CharacterAnimationPlayer
                characterName={selectedCharacter}
                width={700}
                height={400}
                storylineId="welcome-to-windgap"
                onAnimationComplete={handleAnimationComplete}
                onStoryNodeChange={handleStoryNodeChange}
                onStoryComplete={handleStoryComplete}
                onCharacterChange={(character) => setSelectedCharacter(character)}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
              <Tabs value={activeTab} onChange={handleTabChange}>
                <Tab label="Story Log" />
                <Tab label="Animation Log" />
              </Tabs>
            </Box>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 1 }}>
              <Button size="small" onClick={clearLogs}>
                Clear Log
              </Button>
            </Box>

            <Box sx={{ height: 300, overflowY: "auto", p: 1, bgcolor: "#f5f5f5" }}>
              {activeTab === 0 ? (
                storyLog.length > 0 ? (
                  storyLog.map((entry, index) => (
                    <Typography key={index} variant="body2" component="div" sx={{ mb: 1 }}>
                      {entry}
                    </Typography>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No story events yet. Click &quot;Start Story&quot; to begin.
                  </Typography>
                )
              ) : animationLog.length > 0 ? (
                animationLog.map((entry, index) => (
                  <Typography key={index} variant="body2" component="div" sx={{ mb: 1 }}>
                    {entry}
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No animations played yet. Try the animation buttons.
                </Typography>
              )}
            </Box>
          </Paper>

          <Paper elevation={3} sx={{ p: 2, mt: 2 }}>
            <Typography variant="h6" gutterBottom>
              Character Information
            </Typography>

            {selectedCharacter === "Winnie" && (
              <Typography variant="body2">
                Winnie is the friendly mascot of Windgap Academy. She helps guide learners through
                the educational content with her cheerful personality.
              </Typography>
            )}

            {selectedCharacter === "Andy" && (
              <Typography variant="body2">
                Andy is a technical expert who explains complex concepts clearly. He specializes in
                computer skills and problem-solving activities.
              </Typography>
            )}

            {selectedCharacter === "Daisy" && (
              <Typography variant="body2">
                Daisy is enthusiastic about nature and science. She loves outdoor activities and
                brings energy to environmental learning topics.
              </Typography>
            )}

            {selectedCharacter === "Natalie" && (
              <Typography variant="body2">
                Natalie is creative and artistic. She guides learners through expressive activities
                and helps with building confidence in communication.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Technical Implementation
        </Typography>

        <Typography variant="body1" paragraph>
          This integration uses a bidirectional communication layer between React and Unity. The
          Unity WebGL build contains the 3D models, animations, and game logic, while React handles
          the UI, application state, and data persistence.
        </Typography>

        <Typography variant="body1" paragraph>
          Key features of this integration:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">
              <strong>Character Selection:</strong> Change characters dynamically through the React
              UI
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Animation Control:</strong> Trigger animations from React and receive
              completion events
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Interactive Storylines:</strong> Unity-powered interactive narrative with
              React UI for choices
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Progress Tracking:</strong> Events from Unity are logged and can be persisted
              in your database
            </Typography>
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default CharacterAnimationsPage;
