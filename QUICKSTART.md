# Windgap Academy - Quick Start Guide

Welcome to Windgap Academy! This document will help you quickly get up and running with the development environment.

## Getting Started in 2 Minutes

To start the application with a single command:

```bash
./start-windgap.sh
```

This script:

- Creates the necessary environment configuration if it doesn't exist
- Starts the backend Express server on port 5000
- Starts the frontend Vite development server on port 4000

Once everything is running, you can open the application in your browser:

```bash
./open-windgap.sh
```

## Application URLs

- **Main Application**: http://localhost:4000/
- **Backend API**: http://localhost:5000/
- **API Health Check**: http://localhost:5000/health
- **API Documentation**: http://localhost:5000/api/docs

## Demo Pages

Explore these demo pages to see the key features of Windgap Academy:

The app is a single-page React application. Demo features have been integrated as SPA routes/components. Example routes:

- Animation demo: http://localhost:4000/animation-demo
- Fluid simulation: http://localhost:4000/tools/fluid-simulation
- Whiteboard: http://localhost:4000/tools/whiteboard

## Documentation

For more detailed information, refer to these documents:

- **DEVELOPMENT.md**: Complete development guide
- **IMPLEMENTATION-SUMMARY.md**: Current implementation status
- **README_API.md**: API documentation
- **README_CODE_ANIMATION.md**: Animation system documentation
- **UNITY_INTEGRATION.md**: Unity WebGL integration details

## Stopping the Servers

To stop all running servers:

```bash
pkill -f "node.*5000"; pkill -f "vite --port=4000"
```

## Troubleshooting

If you encounter any issues:

1. Check the log files:
   - Frontend: `/tmp/windgap-frontend.log`
   - Backend: `/tmp/windgap-backend.log`

2. Try restarting with a clean environment:

   ```bash
   ./clean-restart.sh
   ```

3. Make sure ports 4000 and 5000 are not already in use by other applications.

Happy developing with Windgap Academy!
