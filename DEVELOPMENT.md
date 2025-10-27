# Windgap Academy Development Guide

This guide provides instructions for setting up, running, and developing the Windgap Academy application.

## Project Overview

Windgap Academy is a professional learning platform with:

- **Frontend**: React 18 with Vite, using Framer Motion for animations and Three.js/React Three Fiber for 3D rendering
- **Backend**: Express server with Firebase for authentication and Firestore for data storage
- **Features**: WebGL effects, character animations, and Unity integration

## Quick Start

Use our helper scripts to quickly start the application:

```bash
# Start both frontend and backend servers
./start-windgap.sh

# Open the application in your browser
./open-windgap.sh
```

## Manual Setup

### Prerequisites

- Node.js (v18+)
- npm (v7+)

### Environment Setup

1. Copy the example environment file:

```bash
cp .env.example .env.local
```

2. Add a JWT secret for development:

```bash
echo "JWT_SECRET=dev_jwt_secret" >> .env.local
```

3. (Optional) Configure Firebase credentials in `.env.local` for authentication features.

### Starting the Application

#### Frontend

```bash
# Install dependencies (if not already done)
npm install

# Start the frontend development server
npm run dev -- --port=4000
```

The frontend will be available at: http://localhost:4000

#### Backend

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies (if needed)
npm install

# Start the backend server
node server.js
```

The backend will be available at: http://localhost:5000

## Key URLs

### Frontend

- Main Application: http://localhost:4000
- Main Application (SPA): http://localhost:4000

Demo features are provided as React routes/components rather than standalone HTML pages. Example SPA routes:

- Animation demo: http://localhost:4000/animation-demo
- Fluid simulation: http://localhost:4000/tools/fluid-simulation
- Whiteboard: http://localhost:4000/tools/whiteboard

### Backend

- API Root: http://localhost:5000/api
- Health Check: http://localhost:5000/health
- API Documentation: http://localhost:5000/api/docs
- Metrics: http://localhost:5000/metrics

## Development Workflow

1. Run `npm run dev -- --port=4000` to start the frontend with hot reloading
2. Run `node backend/server.js` to start the backend
3. Make changes to the code and see them reflected immediately
4. Use the available demos to test specific features

## Testing

```bash
# Run all tests
npm test

# Run specific test
npm test -- -t "ComponentName"
```

> Note: Some tests may fail due to missing context providers or TypeScript configuration issues. These are being addressed.

## Project Structure

- `/src`: Frontend React components and logic
- `/backend`: Express server and API routes
- `/assets`: Static assets like images and 3D models
- `/components`: Reusable UI components
- `/utils`: Utility functions and helpers
- `/unity-integration`: Unity WebGL integration

## Working with Effects and Animations

- `WebGLEffects.js`: Use for particle systems, ripple effects, and glow highlights
- `CharacterAnimator.js`: Use for character animations
- `MicroInteractions.jsx`: Use for consistent animations across the platform

## Building for Production

```bash
# Build frontend
npm run build

# Serve production build
npm run serve
```

## Troubleshooting

- **Backend fails to start**: Ensure `JWT_SECRET` is set in `.env.local`
- **Socket.IO errors**: Check that frontend and backend ports match in configuration
- **Missing modules**: Run `npm install` in both root and `/backend` directories
- **Test failures**: Many tests require context providers that may not be set up in test environment

## Additional Resources

- [Vite Documentation](https://vitejs.dev/guide/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Three.js Documentation](https://threejs.org/docs/)
- [Firebase Documentation](https://firebase.google.com/docs)
