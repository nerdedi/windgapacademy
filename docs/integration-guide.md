# Integration Guide: Implementing Recommended Libraries

This guide provides step-by-step instructions for integrating the recommended libraries and frameworks into Windgap Academy's existing codebase.

## Phase 1: Foundation Enhancements (Weeks 1-2)

### 1.1 Add Chakra UI Component Library

**Goal**: Enhance UI consistency and accessibility

**Installation**:
```bash
npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion
```

**Integration Steps**:

1. **Wrap App with ChakraProvider**:
```jsx
// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';
import App from './App';

// Custom theme for Windgap Academy
const theme = extendTheme({
  colors: {
    windgap: {
      50: '#E6F3FF',
      100: '#B3DEFF',
      500: '#0066CC',
      600: '#0052A3',
      700: '#003D7A'
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif'
  },
  config: {
    initialColorMode: 'light',
    useSystemColorMode: false
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
```

2. **Update existing components**:
```jsx
// components/Dashboard.js - Enhanced version
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Grid,
  GridItem,
  Card,
  CardBody,
  Badge,
  Progress,
  useColorModeValue
} from '@chakra-ui/react';

export function EnhancedDashboard({ userData = {} }) {
  const bgColor = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'white');

  return (
    <Box p={6} bg={bgColor} minH="100vh">
      <Heading mb={6} color={textColor}>
        Welcome back, {userData.name || 'Learner'}!
      </Heading>
      
      <Grid templateColumns="repeat(auto-fit, minmax(300px, 1fr))" gap={6}>
        <GridItem>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Learning Progress</Heading>
              <Text mb={2}>Level {userData.level || 1}</Text>
              <Progress 
                value={userData.progressPercent || 0} 
                colorScheme="windgap"
                mb={2}
              />
              <Text fontSize="sm" color="gray.600">
                {userData.xp || 0} XP • {userData.nextLevelXP || 1000} XP to next level
              </Text>
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Recent Achievements</Heading>
              {(userData.badges || []).map((badge, index) => (
                <Badge key={index} colorScheme="green" mr={2} mb={2}>
                  {badge.name}
                </Badge>
              ))}
            </CardBody>
          </Card>
        </GridItem>
        
        <GridItem>
          <Card>
            <CardBody>
              <Heading size="md" mb={4}>Quick Actions</Heading>
              <Grid templateColumns="1fr 1fr" gap={3}>
                <Button colorScheme="windgap" size="sm">
                  Continue Learning
                </Button>
                <Button variant="outline" colorScheme="windgap" size="sm">
                  View Progress
                </Button>
              </Grid>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
    </Box>
  );
}
```

### 1.2 Implement tRPC for Type-Safe APIs

**Goal**: Replace REST APIs with type-safe procedures

**Installation**:
```bash
npm install @trpc/server @trpc/client @trpc/react-query @trpc/next zod
npm install @tanstack/react-query
```

**Backend Setup**:

1. **Create tRPC router** (`backend/trpc/router.js`):
```javascript
import { initTRPC } from '@trpc/server';
import { z } from 'zod';
import { authenticateToken } from '../middleware/authenticateToken.js';

const t = initTRPC.create();

// Middleware for authentication
const isAuthenticated = t.middleware(({ ctx, next }) => {
  if (!ctx.user) {
    throw new Error('UNAUTHORIZED');
  }
  return next({ ctx: { ...ctx, user: ctx.user } });
});

const protectedProcedure = t.procedure.use(isAuthenticated);

export const appRouter = t.router({
  // Game progress endpoints
  game: t.router({
    getState: t.procedure
      .input(z.object({ gameId: z.string().optional() }))
      .query(async ({ input }) => {
        // Return current game state
        return await getGameState(input.gameId);
      }),
      
    updateProgress: protectedProcedure
      .input(z.object({
        gameId: z.string(),
        level: z.number().min(1),
        score: z.number().min(0),
        timeSpent: z.number().min(0)
      }))
      .mutation(async ({ input, ctx }) => {
        return await updateGameProgress(ctx.user.id, input);
      })
  }),

  // User management
  user: t.router({
    getProfile: protectedProcedure
      .query(async ({ ctx }) => {
        return await getUserProfile(ctx.user.id);
      }),
      
    updatePreferences: protectedProcedure
      .input(z.object({
        accessibility: z.object({
          fontSize: z.number().min(12).max(24),
          highContrast: z.boolean(),
          dyslexiaFont: z.boolean()
        }).optional(),
        learning: z.object({
          difficultyLevel: z.enum(['beginner', 'intermediate', 'advanced'])
        }).optional()
      }))
      .mutation(async ({ input, ctx }) => {
        return await updateUserPreferences(ctx.user.id, input);
      })
  }),

  // Analytics
  analytics: t.router({
    getLearningReport: protectedProcedure
      .input(z.object({
        timeframe: z.enum(['week', 'month', 'year']).default('week')
      }))
      .query(async ({ input, ctx }) => {
        return await generateLearningReport(ctx.user.id, input.timeframe);
      })
  })
});

export type AppRouter = typeof appRouter;
```

2. **Frontend tRPC client setup** (`src/lib/trpc.ts`):
```typescript
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '../../backend/trpc/router';

export const trpc = createTRPCReact<AppRouter>();
```

3. **Provider setup** (`src/main.jsx`):
```jsx
import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import { trpc } from './lib/trpc';

function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: '/api/trpc',
          headers() {
            const token = localStorage.getItem('authToken');
            return token ? { authorization: `Bearer ${token}` } : {};
          }
        })
      ]
    })
  );

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ChakraProvider theme={theme}>
          <MainApp />
        </ChakraProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

### 1.3 Enhanced Firebase Authentication

**Goal**: Add social login and improved security

**Installation**:
```bash
npm install firebase-admin # For backend
```

**Implementation**:

1. **Enhanced auth service** (`src/services/auth.js`):
```javascript
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';

export class EnhancedAuthService {
  constructor() {
    this.auth = getAuth();
    this.db = getFirestore();
    this.googleProvider = new GoogleAuthProvider();
  }

  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(this.auth, this.googleProvider);
      await this.createOrUpdateUserProfile(result.user);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async createOrUpdateUserProfile(user) {
    const userRef = doc(this.db, 'users', user.uid);
    const userSnap = await getDoc(userRef);
    
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      lastLogin: new Date(),
      ...(userSnap.exists() ? {} : {
        // Only set defaults for new users
        preferences: {
          accessibility: {
            fontSize: 16,
            highContrast: false,
            dyslexiaFont: false,
            voiceCommands: false
          },
          learning: {
            difficultyLevel: 'beginner',
            gamificationEnabled: true
          }
        },
        progress: {
          level: 1,
          totalXP: 0,
          badges: [],
          completedGames: []
        },
        createdAt: new Date()
      })
    };

    await setDoc(userRef, userData, { merge: true });
    return userData;
  }
}
```

## Phase 2: 3D & Gaming Enhancements (Weeks 3-4)

### 2.1 Enhanced Three.js Integration

**Goal**: Add physics and advanced interactions to existing 3D scenes

**Installation**:
```bash
npm install @react-three/rapier @react-three/postprocessing leva
```

**Implementation**:

1. **Enhanced 3D environment** (`components/Enhanced3DEnvironment.jsx`):
```jsx
import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';
import { 
  Environment, 
  ContactShadows, 
  Text, 
  OrbitControls,
  useProgress,
  Html
} from '@react-three/drei';
import { EffectComposer, Bloom, Noise } from '@react-three/postprocessing';

// Loading component
function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="text-white text-xl">
        Loading 3D Environment... {progress.toFixed(0)}%
      </div>
    </Html>
  );
}

// Enhanced 3D scene with physics
export function Enhanced3DEnvironment({ gameConfig, onInteraction }) {
  const [selectedObject, setSelectedObject] = useState(null);

  return (
    <div className="w-full h-screen">
      <Canvas
        shadows
        camera={{ position: [0, 5, 10], fov: 60 }}
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={<Loader />}>
          {/* Lighting setup */}
          <Environment preset="sunset" />
          <ambientLight intensity={0.2} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize={2048}
          />

          <Physics gravity={[0, -9.81, 0]}>
            {/* Ground plane */}
            <RigidBody type="fixed">
              <CuboidCollider args={[50, 0.1, 50]} position={[0, -0.1, 0]} />
              <mesh position={[0, -0.1, 0]} receiveShadow>
                <boxGeometry args={[100, 0.2, 100]} />
                <meshStandardMaterial color="#4ade80" />
              </mesh>
            </RigidBody>

            {/* Interactive learning objects */}
            <InteractiveLearningObjects 
              gameConfig={gameConfig}
              onInteraction={onInteraction}
              selectedObject={selectedObject}
              setSelectedObject={setSelectedObject}
            />

            {/* Existing CityPack models with physics */}
            <EnhancedCityModels />
          </Physics>

          <ContactShadows 
            opacity={0.4} 
            scale={20} 
            blur={2} 
            far={10} 
            resolution={256} 
          />

          <OrbitControls 
            enablePan={false} 
            maxDistance={20} 
            minDistance={5}
            maxPolarAngle={Math.PI / 2}
          />

          {/* Post-processing effects */}
          <EffectComposer>
            <Bloom luminanceThreshold={0.2} luminanceSmoothing={0.9} height={300} />
            <Noise opacity={0.02} />
          </EffectComposer>
        </Suspense>
      </Canvas>

      {/* UI Overlay */}
      {selectedObject && (
        <ObjectInfoOverlay 
          object={selectedObject} 
          onClose={() => setSelectedObject(null)}
        />
      )}
    </div>
  );
}

// Interactive objects with physics
function InteractiveLearningObjects({ gameConfig, onInteraction, setSelectedObject }) {
  const objects = [
    { 
      id: 'math-cube', 
      position: [2, 1, 0], 
      subject: 'mathematics',
      color: '#3b82f6',
      points: 10 
    },
    { 
      id: 'literacy-book', 
      position: [-2, 1, 2], 
      subject: 'literacy',
      color: '#10b981',
      points: 15 
    },
    { 
      id: 'communication-phone', 
      position: [0, 1, -3], 
      subject: 'communication',
      color: '#8b5cf6',
      points: 20 
    }
  ];

  return (
    <>
      {objects.map(obj => (
        <InteractiveObject 
          key={obj.id}
          {...obj}
          onInteraction={onInteraction}
          onSelect={setSelectedObject}
        />
      ))}
    </>
  );
}

function InteractiveObject({ id, position, subject, color, points, onInteraction, onSelect }) {
  const meshRef = useRef();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005;
      if (hovered) {
        meshRef.current.scale.setScalar(1.1);
      } else {
        meshRef.current.scale.setScalar(1);
      }
    }
  });

  const handleClick = () => {
    setClicked(true);
    onSelect({ id, subject, points });
    onInteraction({ id, subject, points, timestamp: Date.now() });
    setTimeout(() => setClicked(false), 1000);
  };

  return (
    <RigidBody type="kinematicPosition" position={position}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={handleClick}
        castShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          color={clicked ? '#fbbf24' : hovered ? '#60a5fa' : color}
          emissive={clicked ? '#f59e0b' : '#000000'}
          emissiveIntensity={clicked ? 0.2 : 0}
        />
      </mesh>
      
      <Text
        position={[0, 1.5, 0]}
        fontSize={0.3}
        color={hovered ? '#ffffff' : '#374151'}
        anchorX="center"
        anchorY="middle"
      >
        {subject.charAt(0).toUpperCase() + subject.slice(1)}
      </Text>
    </RigidBody>
  );
}
```

### 2.2 Real-time Multiplayer with Socket.io

**Goal**: Enable collaborative learning experiences

**Installation**:
```bash
npm install socket.io socket.io-client
```

**Backend setup** (`backend/multiplayer/socketServer.js`):
```javascript
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';

export function initializeMultiplayer(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      methods: ["GET", "POST"]
    }
  });

  // Authentication middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = decoded.id || decoded.username;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  // Game room management
  const gameRooms = new Map();

  io.on('connection', (socket) => {
    console.log(`User ${socket.userId} connected`);

    // Join game room
    socket.on('join-room', async ({ roomId, playerInfo }, callback) => {
      try {
        socket.join(roomId);
        
        if (!gameRooms.has(roomId)) {
          gameRooms.set(roomId, {
            id: roomId,
            players: new Map(),
            gameState: initializeGameState(),
            createdAt: Date.now()
          });
        }

        const room = gameRooms.get(roomId);
        room.players.set(socket.userId, {
          ...playerInfo,
          socketId: socket.id,
          joinedAt: Date.now()
        });

        // Notify other players
        socket.to(roomId).emit('player-joined', {
          playerId: socket.userId,
          playerInfo: playerInfo
        });

        callback({
          success: true,
          gameState: room.gameState,
          players: Array.from(room.players.values())
        });
      } catch (error) {
        callback({ success: false, error: error.message });
      }
    });

    // Handle collaborative actions
    socket.on('collaborative-action', (data) => {
      const { roomId, action } = data;
      
      // Broadcast action to other players in the room
      socket.to(roomId).emit('collaboration-event', {
        playerId: socket.userId,
        action: action,
        timestamp: Date.now()
      });

      // Update game state if needed
      if (gameRooms.has(roomId)) {
        updateGameState(gameRooms.get(roomId), action);
      }
    });

    // Handle player movement in 3D space
    socket.on('player-move', (data) => {
      const { roomId, position, rotation } = data;
      
      socket.to(roomId).emit('player-moved', {
        playerId: socket.userId,
        position: position,
        rotation: rotation,
        timestamp: Date.now()
      });
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      // Remove player from all rooms
      for (const [roomId, room] of gameRooms) {
        if (room.players.has(socket.userId)) {
          room.players.delete(socket.userId);
          socket.to(roomId).emit('player-left', {
            playerId: socket.userId
          });
          
          // Clean up empty rooms
          if (room.players.size === 0) {
            gameRooms.delete(roomId);
          }
        }
      }
    });
  });

  return io;
}

function initializeGameState() {
  return {
    objectives: [],
    completedTasks: [],
    collaborativeProgress: {},
    startTime: Date.now()
  };
}

function updateGameState(room, action) {
  switch (action.type) {
    case 'complete-objective':
      room.gameState.completedTasks.push({
        objectiveId: action.objectiveId,
        completedBy: action.playerId,
        completedAt: Date.now()
      });
      break;
    case 'collaborative-solve':
      room.gameState.collaborativeProgress[action.problemId] = {
        contributions: action.contributions,
        status: 'in_progress'
      };
      break;
  }
}
```

**Frontend integration** (`src/hooks/useMultiplayer.js`):
```javascript
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export function useMultiplayer(authToken) {
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);
  const [players, setPlayers] = useState(new Map());
  const [gameState, setGameState] = useState(null);

  useEffect(() => {
    if (!authToken) return;

    const socketInstance = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:9000', {
      auth: { token: authToken }
    });

    socketInstance.on('connect', () => {
      setConnected(true);
      setSocket(socketInstance);
    });

    socketInstance.on('disconnect', () => {
      setConnected(false);
    });

    socketInstance.on('player-joined', ({ playerId, playerInfo }) => {
      setPlayers(prev => new Map(prev.set(playerId, playerInfo)));
    });

    socketInstance.on('player-left', ({ playerId }) => {
      setPlayers(prev => {
        const newPlayers = new Map(prev);
        newPlayers.delete(playerId);
        return newPlayers;
      });
    });

    socketInstance.on('collaboration-event', handleCollaborationEvent);
    socketInstance.on('player-moved', handlePlayerMoved);

    return () => {
      socketInstance.close();
    };
  }, [authToken]);

  const joinRoom = async (roomId, playerInfo) => {
    if (!socket) return { success: false, error: 'Not connected' };

    return new Promise((resolve) => {
      socket.emit('join-room', { roomId, playerInfo }, (response) => {
        if (response.success) {
          setGameState(response.gameState);
          setPlayers(new Map(response.players.map(p => [p.id, p])));
        }
        resolve(response);
      });
    });
  };

  const sendCollaborativeAction = (roomId, action) => {
    if (socket) {
      socket.emit('collaborative-action', { roomId, action });
    }
  };

  const handleCollaborationEvent = (data) => {
    // Handle real-time collaboration events
    console.log('Collaboration event:', data);
  };

  const handlePlayerMoved = (data) => {
    // Update player position in 3D scene
    setPlayers(prev => {
      const newPlayers = new Map(prev);
      if (newPlayers.has(data.playerId)) {
        newPlayers.set(data.playerId, {
          ...newPlayers.get(data.playerId),
          position: data.position,
          rotation: data.rotation
        });
      }
      return newPlayers;
    });
  };

  return {
    socket,
    connected,
    players,
    gameState,
    joinRoom,
    sendCollaborativeAction
  };
}
```

## Phase 3: Analytics & Gamification (Weeks 5-6)

### 3.1 OpenBadges Implementation

**Goal**: Add digital credential system

**Installation**:
```bash
npm install crypto-js qr-code-generator
```

**Implementation** (`src/services/badgeService.js`):
```javascript
import CryptoJS from 'crypto-js';

export class BadgeService {
  constructor() {
    this.baseURL = process.env.REACT_APP_BASE_URL || 'https://windgapacademy.com';
    this.issuer = {
      "@context": "https://w3id.org/openbadges/v2",
      "type": "Issuer",
      "id": `${this.baseURL}/issuer.json`,
      "name": "Windgap Academy",
      "url": this.baseURL,
      "email": "badges@windgapacademy.com",
      "description": "Inclusive learning platform for neurodivergent learners"
    };
  }

  async createBadge(badgeConfig) {
    const badge = {
      "@context": "https://w3id.org/openbadges/v2",
      "type": "BadgeClass",
      "id": `${this.baseURL}/badges/${badgeConfig.id}.json`,
      "name": badgeConfig.name,
      "description": badgeConfig.description,
      "image": `${this.baseURL}/images/badges/${badgeConfig.id}.png`,
      "criteria": {
        "type": "Criteria",
        "narrative": badgeConfig.criteria
      },
      "issuer": this.issuer.id,
      "tags": badgeConfig.tags || [],
      "alignment": badgeConfig.alignment || [],
      "related": badgeConfig.related || []
    };

    // Save badge definition
    await this.saveBadgeDefinition(badge);
    return badge;
  }

  async awardBadge(userId, badgeId, evidence = {}) {
    const assertionId = `${this.baseURL}/assertions/${userId}-${badgeId}-${Date.now()}.json`;
    
    const assertion = {
      "@context": "https://w3id.org/openbadges/v2",
      "type": "Assertion",
      "id": assertionId,
      "recipient": {
        "type": "email",
        "hashed": false,
        "identity": `user-${userId}@windgapacademy.com`
      },
      "badge": `${this.baseURL}/badges/${badgeId}.json`,
      "verification": {
        "type": "hosted"
      },
      "issuedOn": new Date().toISOString(),
      "evidence": {
        "id": evidence.url || `${this.baseURL}/evidence/${userId}-${badgeId}`,
        "narrative": evidence.description || "Achievement completed through Windgap Academy learning activities",
        "name": evidence.name || "Learning Achievement Evidence",
        "description": evidence.description,
        "genre": "Learning Portfolio"
      }
    };

    // Generate verification hash
    assertion.verification.signature = this.generateSignature(assertion);

    // Save assertion
    await this.saveAssertion(assertion);
    
    // Generate shareable certificate
    const certificate = await this.generateCertificate(assertion);
    
    // Notify user
    await this.notifyBadgeAwarded(userId, assertion, certificate);
    
    return { assertion, certificate };
  }

  generateSignature(assertion) {
    const dataString = JSON.stringify(assertion);
    return CryptoJS.SHA256(dataString + process.env.BADGE_SECRET).toString();
  }

  async generateCertificate(assertion) {
    // Generate QR code for badge verification
    const qrData = JSON.stringify({
      assertionId: assertion.id,
      verificationUrl: `${this.baseURL}/verify/${assertion.id}`,
      issuedOn: assertion.issuedOn
    });

    return {
      id: assertion.id,
      qrCode: qrData,
      shareableUrl: `${this.baseURL}/certificates/${assertion.id}`,
      printableUrl: `${this.baseURL}/certificates/${assertion.id}/print`
    };
  }

  async verifyBadge(assertionId) {
    try {
      const response = await fetch(`${this.baseURL}/assertions/${assertionId}.json`);
      const assertion = await response.json();
      
      // Verify signature
      const expectedSignature = this.generateSignature({
        ...assertion,
        verification: { ...assertion.verification, signature: undefined }
      });
      
      const isValid = assertion.verification.signature === expectedSignature;
      
      return {
        valid: isValid,
        assertion: isValid ? assertion : null,
        verifiedAt: new Date().toISOString(),
        issuer: this.issuer
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

// Badge definitions for Windgap Academy
export const WINDGAP_BADGES = {
  FIRST_STEPS: {
    id: 'first-steps',
    name: 'First Steps',
    description: 'Completed your first learning activity on Windgap Academy',
    criteria: 'Successfully complete any learning game or activity',
    tags: ['beginner', 'milestone'],
    image: 'first-steps.png'
  },
  
  NUMERACY_NOVICE: {
    id: 'numeracy-novice',
    name: 'Numeracy Novice',
    description: 'Demonstrated basic numeracy skills',
    criteria: 'Complete 5 numeracy games with 70% or higher accuracy',
    tags: ['numeracy', 'mathematics', 'skills'],
    image: 'numeracy-novice.png'
  },

  LITERACY_LEARNER: {
    id: 'literacy-learner',
    name: 'Literacy Learner',
    description: 'Showed progress in reading and writing skills',
    criteria: 'Complete 5 literacy activities and demonstrate improvement',
    tags: ['literacy', 'reading', 'writing'],
    image: 'literacy-learner.png'
  },

  COMMUNICATION_CHAMPION: {
    id: 'communication-champion',
    name: 'Communication Champion',
    description: 'Excelled in communication and social skills',
    criteria: 'Complete communication games and demonstrate social interaction skills',
    tags: ['communication', 'social-skills'],
    image: 'communication-champion.png'
  },

  ACCESSIBILITY_ADVOCATE: {
    id: 'accessibility-advocate',
    name: 'Accessibility Advocate',
    description: 'Actively used accessibility features to enhance learning',
    criteria: 'Use accessibility features for 30 days and provide feedback',
    tags: ['accessibility', 'inclusion'],
    image: 'accessibility-advocate.png'
  },

  PEER_HELPER: {
    id: 'peer-helper',
    name: 'Peer Helper',
    description: 'Helped other learners in collaborative activities',
    criteria: 'Assist 3 other learners in completing collaborative tasks',
    tags: ['collaboration', 'helping', 'social'],
    image: 'peer-helper.png'
  }
};
```

### 3.2 Enhanced Learning Analytics

**Goal**: Provide insights into learning patterns and progress

**Implementation** (`src/services/analyticsService.js`):
```javascript
export class LearningAnalyticsService {
  constructor() {
    this.events = [];
    this.insights = new Map();
    this.recommendations = new Map();
  }

  async trackLearningEvent(event) {
    const enrichedEvent = {
      ...event,
      id: this.generateEventId(),
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userId: this.getCurrentUserId(),
      deviceInfo: this.getDeviceInfo(),
      accessibilitySettings: await this.getAccessibilitySettings(),
      learningContext: await this.getLearningContext(event)
    };

    this.events.push(enrichedEvent);
    
    // Real-time analysis
    await this.analyzeEvent(enrichedEvent);
    
    // Send to analytics providers
    await this.sendToAnalyticsProviders(enrichedEvent);
    
    return enrichedEvent;
  }

  async generateLearningInsights(userId, timeframe = 'week') {
    const userEvents = this.events.filter(e => 
      e.userId === userId && 
      this.isWithinTimeframe(e.timestamp, timeframe)
    );

    const insights = {
      summary: this.generateSummary(userEvents),
      engagement: this.analyzeEngagement(userEvents),
      progress: this.analyzeProgress(userEvents),
      strengths: this.identifyStrengths(userEvents),
      challenges: this.identifyChallenges(userEvents),
      recommendations: await this.generateRecommendations(userEvents),
      accessibility: this.analyzeAccessibilityUsage(userEvents),
      collaboration: this.analyzeCollaboration(userEvents)
    };

    this.insights.set(`${userId}-${timeframe}`, insights);
    return insights;
  }

  generateSummary(events) {
    return {
      totalSessions: this.countUniqueSessions(events),
      totalTimeSpent: this.calculateTotalTime(events),
      activitiesCompleted: this.countCompletedActivities(events),
      averageScore: this.calculateAverageScore(events),
      streakDays: this.calculateStreakDays(events),
      badgesEarned: this.countBadgesEarned(events)
    };
  }

  analyzeEngagement(events) {
    const sessionLengths = this.getSessionLengths(events);
    const interactionFrequency = this.calculateInteractionFrequency(events);
    const dropoffPoints = this.identifyDropoffPoints(events);

    return {
      averageSessionLength: sessionLengths.reduce((a, b) => a + b, 0) / sessionLengths.length,
      engagementScore: this.calculateEngagementScore(events),
      interactionFrequency: interactionFrequency,
      dropoffPoints: dropoffPoints,
      peakEngagementTimes: this.identifyPeakTimes(events)
    };
  }

  analyzeProgress(events) {
    const skillAreas = ['numeracy', 'literacy', 'communication'];
    const progressBySkill = {};

    skillAreas.forEach(skill => {
      const skillEvents = events.filter(e => e.subject === skill);
      progressBySkill[skill] = {
        improvement: this.calculateImprovement(skillEvents),
        currentLevel: this.getCurrentLevel(skillEvents),
        timeToMastery: this.estimateTimeToMastery(skillEvents),
        difficultyProgression: this.analyzeDifficultyProgression(skillEvents)
      };
    });

    return {
      overall: this.calculateOverallProgress(events),
      bySkill: progressBySkill,
      milestones: this.identifyMilestones(events),
      learningVelocity: this.calculateLearningVelocity(events)
    };
  }

  identifyStrengths(events) {
    const strengths = [];
    const skillPerformance = this.calculateSkillPerformance(events);

    Object.entries(skillPerformance).forEach(([skill, performance]) => {
      if (performance.accuracy > 0.8 && performance.consistency > 0.7) {
        strengths.push({
          area: skill,
          confidence: performance.accuracy,
          evidence: `High accuracy (${(performance.accuracy * 100).toFixed(1)}%) and consistent performance`,
          recommendation: `Consider advancing to higher difficulty levels in ${skill}`
        });
      }
    });

    return strengths;
  }

  identifyChallenges(events) {
    const challenges = [];
    const difficultyAreas = this.identifyDifficultyAreas(events);
    const strugglingPatterns = this.identifyStrugglingPatterns(events);

    difficultyAreas.forEach(area => {
      challenges.push({
        area: area.skill,
        severity: area.severity,
        pattern: area.pattern,
        suggestion: this.generateChallengeStrategy(area)
      });
    });

    return challenges;
  }

  async generateRecommendations(events) {
    const userProfile = await this.buildUserProfile(events);
    const recommendations = [];

    // Content recommendations
    const contentRecs = await this.recommendContent(userProfile);
    recommendations.push(...contentRecs);

    // Difficulty adjustments
    const difficultyRecs = this.recommendDifficultyAdjustments(userProfile);
    recommendations.push(...difficultyRecs);

    // Accessibility recommendations
    const accessibilityRecs = this.recommendAccessibilityFeatures(userProfile);
    recommendations.push(...accessibilityRecs);

    // Social learning recommendations
    const socialRecs = this.recommendSocialLearning(userProfile);
    recommendations.push(...socialRecs);

    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  analyzeAccessibilityUsage(events) {
    const accessibilityEvents = events.filter(e => e.type === 'accessibility_feature_used');
    
    return {
      featuresUsed: this.getUniqueAccessibilityFeatures(accessibilityEvents),
      usageFrequency: this.calculateFeatureUsageFrequency(accessibilityEvents),
      effectivenessScores: this.calculateAccessibilityEffectiveness(events),
      recommendations: this.generateAccessibilityRecommendations(events)
    };
  }

  analyzeCollaboration(events) {
    const collaborationEvents = events.filter(e => e.type.includes('collaboration'));
    
    return {
      sessionsParticipated: this.countCollaborationSessions(collaborationEvents),
      helpGiven: this.countHelpGiven(collaborationEvents),
      helpReceived: this.countHelpReceived(collaborationEvents),
      collaborationScore: this.calculateCollaborationScore(collaborationEvents),
      preferredCollaborationTypes: this.identifyPreferredCollaboration(collaborationEvents)
    };
  }

  // Predictive analytics
  async predictLearningOutcomes(userId) {
    const recentEvents = this.getRecentEvents(userId, '2weeks');
    const historicalData = await this.getHistoricalData(userId);
    
    return {
      nextMilestone: this.predictNextMilestone(recentEvents, historicalData),
      riskFactors: this.identifyRiskFactors(recentEvents),
      optimalLearningPath: await this.generateOptimalPath(recentEvents, historicalData),
      estimatedTimeToGoals: this.estimateTimeToGoals(recentEvents, historicalData)
    };
  }
}
```

## Phase 4: Content Management & Performance (Weeks 7-8)

### 4.1 Strapi CMS Integration

**Goal**: Enable educators to manage content dynamically

**Installation & Setup**:
```bash
# In a separate directory for CMS
npx create-strapi-app@latest windgap-academy-cms --quickstart
cd windgap-academy-cms
npm install @strapi/plugin-graphql
```

**Content Types** (`types/lesson.js`):
```javascript
// Lesson content type for Strapi
module.exports = {
  collectionName: 'lessons',
  info: {
    name: 'Lesson',
    description: 'Learning lessons with 3D content and assessments'
  },
  attributes: {
    title: {
      type: 'string',
      required: true
    },
    description: {
      type: 'text',
      required: true
    },
    difficulty: {
      type: 'enumeration',
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    subject: {
      type: 'enumeration',
      enum: ['numeracy', 'literacy', 'communication', 'life-skills'],
      required: true
    },
    gameConfig: {
      type: 'json',
      required: true
    },
    learningObjectives: {
      type: 'json'
    },
    assessmentCriteria: {
      type: 'json'
    },
    accessibilityFeatures: {
      type: 'json'
    },
    estimatedDuration: {
      type: 'integer',
      default: 30
    },
    prerequisites: {
      type: 'relation',
      relation: 'manyToMany',
      target: 'api::lesson.lesson'
    },
    mediaAssets: {
      type: 'media',
      multiple: true,
      allowedTypes: ['images', 'videos', 'audios', 'files']
    },
    threeDModels: {
      type: 'json'
    }
  }
};
```

**Frontend Integration** (`src/services/cmsService.js`):
```javascript
import { gql } from 'graphql-request';

export class CMSService {
  constructor() {
    this.endpoint = process.env.REACT_APP_CMS_URL + '/graphql';
    this.headers = {
      'Authorization': `Bearer ${process.env.REACT_APP_CMS_TOKEN}`
    };
  }

  async getLessons(filters = {}) {
    const query = gql`
      query GetLessons($filters: LessonFiltersInput, $pagination: PaginationArg) {
        lessons(filters: $filters, pagination: $pagination) {
          data {
            id
            attributes {
              title
              description
              difficulty
              subject
              gameConfig
              learningObjectives
              estimatedDuration
              mediaAssets {
                data {
                  attributes {
                    url
                    name
                    mime
                  }
                }
              }
              threeDModels
            }
          }
        }
      }
    `;

    const response = await this.request(query, { filters });
    return this.transformLessons(response.lessons.data);
  }

  async getLessonById(id) {
    const query = gql`
      query GetLesson($id: ID!) {
        lesson(id: $id) {
          data {
            id
            attributes {
              title
              description
              difficulty
              subject
              gameConfig
              learningObjectives
              assessmentCriteria
              accessibilityFeatures
              estimatedDuration
              prerequisites {
                data {
                  id
                  attributes {
                    title
                    difficulty
                  }
                }
              }
              mediaAssets {
                data {
                  attributes {
                    url
                    name
                    mime
                    width
                    height
                  }
                }
              }
              threeDModels
            }
          }
        }
      }
    `;

    const response = await this.request(query, { id });
    return this.transformLesson(response.lesson.data);
  }

  transformLesson(lessonData) {
    const attributes = lessonData.attributes;
    return {
      id: lessonData.id,
      title: attributes.title,
      description: attributes.description,
      difficulty: attributes.difficulty,
      subject: attributes.subject,
      gameConfig: attributes.gameConfig,
      learningObjectives: attributes.learningObjectives || [],
      assessmentCriteria: attributes.assessmentCriteria || [],
      accessibilityFeatures: attributes.accessibilityFeatures || {},
      estimatedDuration: attributes.estimatedDuration,
      prerequisites: attributes.prerequisites?.data.map(p => ({
        id: p.id,
        title: p.attributes.title,
        difficulty: p.attributes.difficulty
      })) || [],
      mediaAssets: attributes.mediaAssets?.data.map(asset => ({
        url: asset.attributes.url,
        name: asset.attributes.name,
        type: asset.attributes.mime,
        dimensions: {
          width: asset.attributes.width,
          height: asset.attributes.height
        }
      })) || [],
      threeDModels: attributes.threeDModels || {}
    };
  }
}
```

### 4.2 Performance Optimization

**Goal**: Ensure smooth 3D rendering and fast load times

**Implementation** (`src/utils/performanceOptimizer.js`):
```javascript
export class PerformanceOptimizer {
  constructor() {
    this.performanceMetrics = {
      fps: 60,
      memoryUsage: 0,
      renderTime: 0,
      loadTime: 0
    };
    
    this.qualitySettings = {
      shadows: true,
      antialiasing: true,
      textureQuality: 'high',
      modelComplexity: 'high',
      particleCount: 'full'
    };

    this.initPerformanceMonitoring();
  }

  initPerformanceMonitoring() {
    // FPS monitoring
    let lastTime = performance.now();
    let frameCount = 0;

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();
      
      if (currentTime - lastTime >= 1000) {
        this.performanceMetrics.fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;
        
        // Adjust quality based on performance
        this.adaptQualitySettings();
      }
      
      requestAnimationFrame(measureFPS);
    };
    
    requestAnimationFrame(measureFPS);

    // Memory monitoring
    if ('memory' in performance) {
      setInterval(() => {
        this.performanceMetrics.memoryUsage = 
          performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit;
      }, 5000);
    }
  }

  adaptQualitySettings() {
    const { fps, memoryUsage } = this.performanceMetrics;
    
    if (fps < 30 || memoryUsage > 0.8) {
      // Reduce quality for better performance
      this.qualitySettings = {
        shadows: false,
        antialiasing: false,
        textureQuality: 'low',
        modelComplexity: 'low',
        particleCount: 'reduced'
      };
      
      this.notifyQualityChange('performance');
    } else if (fps > 55 && memoryUsage < 0.5) {
      // Increase quality for better visuals
      this.qualitySettings = {
        shadows: true,
        antialiasing: true,
        textureQuality: 'high',
        modelComplexity: 'high',
        particleCount: 'full'
      };
      
      this.notifyQualityChange('quality');
    }
  }

  // Lazy loading for 3D assets
  async lazyLoad3DAssets(assetList, priority = 'normal') {
    const loadPromises = assetList.map(asset => 
      this.loadAssetWithPriority(asset, priority)
    );
    
    if (priority === 'critical') {
      return Promise.all(loadPromises);
    } else {
      return this.loadInBatches(loadPromises, 3);
    }
  }

  async loadInBatches(promises, batchSize) {
    const results = [];
    
    for (let i = 0; i < promises.length; i += batchSize) {
      const batch = promises.slice(i, i + batchSize);
      const batchResults = await Promise.all(batch);
      results.push(...batchResults);
      
      // Allow browser to breathe between batches
      await new Promise(resolve => setTimeout(resolve, 16));
    }
    
    return results;
  }

  // Level of Detail (LOD) implementation
  implementLOD(scene, camera) {
    scene.traverse((child) => {
      if (child.isMesh && child.geometry) {
        const distance = camera.position.distanceTo(child.position);
        
        if (distance > 50) {
          // Use low-poly version
          child.visible = false;
        } else if (distance > 20) {
          // Use medium-poly version
          this.setGeometryDetail(child, 'medium');
        } else {
          // Use high-poly version
          this.setGeometryDetail(child, 'high');
        }
      }
    });
  }

  // Texture optimization
  optimizeTextures(scene) {
    scene.traverse((child) => {
      if (child.material && child.material.map) {
        const texture = child.material.map;
        
        // Compress textures based on quality settings
        if (this.qualitySettings.textureQuality === 'low') {
          texture.generateMipmaps = false;
          texture.minFilter = THREE.LinearFilter;
        } else {
          texture.generateMipmaps = true;
          texture.minFilter = THREE.LinearMipmapLinearFilter;
        }
        
        texture.needsUpdate = true;
      }
    });
  }

  // Instancing for repeated objects
  implementInstancing(scene, objectType) {
    const instances = [];
    
    scene.traverse((child) => {
      if (child.userData?.type === objectType) {
        instances.push({
          position: child.position.clone(),
          rotation: child.rotation.clone(),
          scale: child.scale.clone()
        });
        scene.remove(child);
      }
    });

    if (instances.length > 0) {
      const instancedMesh = this.createInstancedMesh(objectType, instances);
      scene.add(instancedMesh);
    }
  }

  // Service Worker for offline caching
  async setupServiceWorker() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');
        
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New version available
              this.notifyUpdate();
            }
          });
        });
        
      } catch (error) {
        console.error('Service Worker registration failed:', error);
      }
    }
  }
}

// Service Worker implementation (public/sw.js)
const CACHE_NAME = 'windgap-academy-v1';
const CRITICAL_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/main.js',
  '/models/essential-models.glb',
  '/audio/ui-sounds.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CRITICAL_ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'document' || 
      event.request.destination === 'script' ||
      event.request.destination === 'style') {
    
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          return response || fetch(event.request);
        })
    );
  }
});

// Background sync for offline progress
self.addEventListener('sync', (event) => {
  if (event.tag === 'progress-sync') {
    event.waitUntil(syncProgressData());
  }
});

async function syncProgressData() {
  // Sync offline progress when connection is restored
  const offlineData = await getOfflineProgress();
  if (offlineData.length > 0) {
    await submitProgressToServer(offlineData);
    await clearOfflineProgress();
  }
}
```

## Testing the Integration

**Run comprehensive tests**:
```bash
# Install test dependencies
npm install --save-dev @testing-library/react-three-fiber

# Run tests
npm test

# Test accessibility
npm run test:accessibility

# Test performance
npm run test:performance
```

**Example test** (`src/__tests__/Enhanced3DEnvironment.test.jsx`):
```jsx
import { render } from '@testing-library/react';
import { Canvas } from '@react-three/fiber';
import { axe, toHaveNoViolations } from 'jest-axe';
import { Enhanced3DEnvironment } from '../components/Enhanced3DEnvironment';

expect.extend(toHaveNoViolations);

describe('Enhanced3DEnvironment', () => {
  test('should render without accessibility violations', async () => {
    const { container } = render(
      <Enhanced3DEnvironment 
        gameConfig={{ type: 'numeracy', level: 1 }}
        onInteraction={jest.fn()}
      />
    );
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test('should handle performance degradation gracefully', () => {
    const mockPerformanceOptimizer = {
      adaptQualitySettings: jest.fn(),
      qualitySettings: { shadows: true }
    };
    
    // Simulate low FPS
    mockPerformanceOptimizer.performanceMetrics = { fps: 20 };
    mockPerformanceOptimizer.adaptQualitySettings();
    
    expect(mockPerformanceOptimizer.qualitySettings.shadows).toBe(false);
  });
});
```

## Deployment Checklist

- [ ] Environment variables configured
- [ ] CDN setup for 3D assets
- [ ] Database migrations completed
- [ ] SSL certificates installed
- [ ] Performance monitoring enabled
- [ ] Accessibility testing passed
- [ ] Load testing completed
- [ ] Backup systems in place

This integration guide provides a comprehensive roadmap for implementing all recommended technologies while maintaining the existing codebase and ensuring accessibility standards are met.