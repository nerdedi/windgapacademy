import React, { useState } from "react";
import CharacterAnimationPlayer from "../components/CharacterAnimationPlayer.jsx";
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

const HiddenPortalStory = () => {
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
        The Hidden Portal at Central Station
      </Typography>

      <Typography variant="body1" paragraph>
        Discover the magical origins of Windgap Academy through the hidden portal at Central
        Station! Experience this interactive story to learn how our academy was founded and how
        students find their way to this special place of learning.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card elevation={3}>
            <CardContent>
              <CharacterAnimationPlayer
                characterName="Winnie"
                width={700}
                height={400}
                storylineId="hidden-portal-discovery"
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
              The Legend of the Portal
            </Typography>

            <Typography variant="body2" paragraph>
              For centuries, rumors have circulated about a magical portal at Central Station. Most
              people rush through the busy station without noticing anything unusual, but some
              special individuals sense something different - a shimmer between platforms 9 and 10,
              visible only at certain times of the day.
            </Typography>

            <Typography variant="body2" paragraph>
              The portal leads to Windgap Academy, a school that exists in a pocket dimension where
              time flows differently. Students can spend days or weeks learning at the academy, only
              to return to find that mere minutes have passed in the regular world.
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" gutterBottom>
              Story Elements:
            </Typography>

            <ul>
              <li>
                <Typography variant="body2">
                  <strong>The Shimmering Wall:</strong> The entrance to Windgap Academy
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Pocket Dimension:</strong> Where the academy exists outside normal
                  space-time
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>The Founders:</strong> Ancient travelers who discovered the dimensional
                  pocket
                </Typography>
              </li>
              <li>
                <Typography variant="body2">
                  <strong>Special Students:</strong> Only those with potential can see the portal
                </Typography>
              </li>
            </ul>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          The Magic of Windgap Academy
        </Typography>

        <Typography variant="body1" paragraph>
          Windgap Academy is more than just a school - it's a place where the ordinary rules of
          reality are slightly different, allowing for enhanced learning and extraordinary
          experiences. The founders discovered that in this pocket dimension, the connection between
          teaching and learning is stronger, allowing students to absorb knowledge more effectively.
        </Typography>

        <Typography variant="body1" paragraph>
          Each instructor at the academy specializes in different forms of knowledge:
        </Typography>

        <ul>
          <li>
            <Typography variant="body1">
              <strong>Winnie:</strong> The guide who helps new students find their way through the
              portal and discover their potential
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Andy:</strong> Master of technology and scientific understanding, exploring
              the mechanics of both worlds
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Daisy:</strong> Expert in natural sciences and the unique properties of the
              academy's environment
            </Typography>
          </li>
          <li>
            <Typography variant="body1">
              <strong>Natalie:</strong> Keeper of the academy's history and artistic traditions
              since its founding
            </Typography>
          </li>
        </ul>
      </Box>
    </Container>
  );
};

export default HiddenPortalStory;
