import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
} from "@mui/material";

const UnityGameDemo = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [loadingProgress, setLoadingProgress] = useState(0);

  // This would normally be handled by the UnityPlayer component
  const simulateLoading = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.1;
      setLoadingProgress(progress);
      if (progress >= 1) {
        clearInterval(interval);
        setIsLoaded(true);
      }
    }, 300);
  };

  // Simulate starting a new game
  const handleStartGame = () => {
    simulateLoading();
  };

  // Simulate completing a level
  const handleCompleteLevel = () => {
    const newLevel = level + 1;
    setLevel(newLevel);
    setScore(score + Math.floor(Math.random() * 100) + 50);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Windgap Academy Unity Game Demo
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              width: "100%",
              height: 480,
              backgroundColor: "#333",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              color: "white",
              position: "relative",
              overflow: "hidden",
              borderRadius: 2,
            }}
          >
            {!isLoaded ? (
              <Box sx={{ width: "80%", textAlign: "center" }}>
                <Typography variant="h6" gutterBottom>
                  Unity Game Demo
                </Typography>
                <Box sx={{ width: "100%", mb: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={loadingProgress * 100}
                    sx={{ height: 10, borderRadius: 5 }}
                  />
                </Box>
                {loadingProgress === 0 ? (
                  <Button variant="contained" color="primary" onClick={handleStartGame}>
                    Start Game
                  </Button>
                ) : (
                  <Typography>Loading... {Math.round(loadingProgress * 100)}%</Typography>
                )}
              </Box>
            ) : (
              <>
                <Typography variant="h5" gutterBottom>
                  Windgap Academy Educational Game
                </Typography>
                <Typography variant="body1" gutterBottom>
                  Level {level} - Score: {score}
                </Typography>
                <Box sx={{ mt: 4 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    sx={{ mr: 2 }}
                    onClick={handleCompleteLevel}
                  >
                    Complete Level
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setIsLoaded(false);
                      setLoadingProgress(0);
                      setScore(0);
                      setLevel(1);
                    }}
                  >
                    Reset Game
                  </Button>
                </Box>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Game Status
              </Typography>
              <Typography variant="body2">Current Level: {level}</Typography>
              <Typography variant="body2">Current Score: {score}</Typography>
              <Typography variant="body2">
                Game State: {isLoaded ? "Running" : "Not Started"}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Learning Objectives
              </Typography>
              <Typography variant="body2" paragraph>
                This educational game helps students practice:
              </Typography>
              <ul>
                <li>Problem-solving skills</li>
                <li>Critical thinking</li>
                <li>Mathematical concepts</li>
                <li>Spatial reasoning</li>
              </ul>

              <Typography variant="body2" sx={{ mt: 2 }}>
                Progress is automatically tracked and synchronized with the Windgap Academy
                platform.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          About This Integration
        </Typography>
        <Typography variant="body1" paragraph>
          This demo showcases the integration between Unity WebGL builds and the Windgap Academy
          platform. In a production environment, the Unity WebGL build would be loaded in the frame
          above, providing interactive 3D educational experiences directly within the platform.
        </Typography>
        <Typography variant="body1">
          The integration supports bidirectional communication, allowing the Unity game to report
          progress, scores, and completion status back to the platform, while the platform can send
          user data and configuration settings to the game.
        </Typography>
      </Box>
    </Box>
  );
};

export default UnityGameDemo;
