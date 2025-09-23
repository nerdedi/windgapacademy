import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import React, { useState } from "react";

import CharacterAnimationPlayer from "../components/CharacterAnimationPlayer.jsx";

const FirstDayStory = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [storyLog, setStoryLog] = useState([]);
  const [animationLog, setAnimationLog] = useState([]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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
  const handleStoryComplete = (data) => {
    const timestamp = new Date().toLocaleTimeString();
    setStoryLog((prev) => [...prev, `[${timestamp}] Story complete: "${data.title}"`]);
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
        First Day at Windgap Academy
      </Typography>

      <Typography variant="body1" paragraph>
        Experience the story of your first day at Windgap Academy! This interactive story lets you
        explore the campus and meet the characters who will guide your learning journey.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <CharacterAnimationPlayer
                characterName="Winnie"
                width={700}
                height={400}
                storylineId="first-day-at-school"
                onAnimationComplete={handleAnimationComplete}
                onStoryNodeChange={handleStoryNodeChange}
                onStoryComplete={handleStoryComplete}
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
                    No story events yet. Click "Start Story" to begin.
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
              Story Information
            </Typography>

            <Typography variant="body2" paragraph>
              This interactive story follows your first day at Windgap Academy. You'll tour the
              campus, meet the instructors, and make choices that shape your experience.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Story Features:
            </Typography>

            <ul>
              <li>
                <Typography variant="body2">
                  <strong>Character Interactions:</strong> Meet Winnie, Andy, Daisy, and Natalie
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Campus Tour:</strong> Explore the classroom, library, and outdoor areas
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Interactive Choices:</strong> Your decisions influence the story path
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Animated Sequences:</strong> Characters animate based on the story context
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Story Background
        </Typography>

        <Typography variant="body1" paragraph>
          Windgap Academy is a special educational environment designed to make learning engaging
          and interactive. The academy uses advanced technology, including 3D animations and
          interactive stories, to create immersive learning experiences.
        </Typography>

        <Typography variant="body1" paragraph>
          Each character specializes in different areas of learning:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">
              <strong>Winnie:</strong> The friendly mascot who guides you through your learning
              journey
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Andy:</strong> Technology expert who explains computer skills and
              problem-solving
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Daisy:</strong> Nature enthusiast who teaches about science and the
              environment
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Natalie:</strong> Creative guide who helps with artistic expression and
              communication
            </Typography>
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default FirstDayStory;
