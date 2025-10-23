#!/bin/bash

# Start the complete Windgap Academy application stack

# Colors for prettier output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting Windgap Academy Application...${NC}"

# Check if .env.local exists, create if it doesn't
if [ ! -f /workspaces/windgapacademy/.env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    cp /workspaces/windgapacademy/.env.example /workspaces/windgapacademy/.env.local
    # Add JWT_SECRET if not present
    if ! grep -q "JWT_SECRET" /workspaces/windgapacademy/.env.local; then
        echo "# Development JWT secret for local testing" >> /workspaces/windgapacademy/.env.local
        echo "JWT_SECRET=dev_jwt_secret" >> /workspaces/windgapacademy/.env.local
        echo -e "${GREEN}Added JWT_SECRET to .env.local${NC}"
    fi
fi

# Kill existing processes
pkill -f "node /workspaces/windgapacademy/backend/server.js" 2>/dev/null
pkill -f "vite --port=4000" 2>/dev/null
echo -e "${GREEN}Cleaned up existing processes${NC}"

# Start backend server
cd /workspaces/windgapacademy
echo -e "${YELLOW}Starting backend server...${NC}"
node backend/server.js > /tmp/windgap-backend.log 2>&1 &
BACKEND_PID=$!
sleep 2

# Check if backend is running
if curl -s http://localhost:5000/health > /dev/null; then
    echo -e "${GREEN}✓ Backend server started successfully at http://localhost:5000${NC}"
else
    echo -e "${RED}✗ Failed to start backend server${NC}"
    echo "Check /tmp/windgap-backend.log for errors"
fi

# Start frontend dev server
echo -e "${YELLOW}Starting frontend dev server...${NC}"
cd /workspaces/windgapacademy
npm run dev -- --port=4000 > /tmp/windgap-frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 5

# Check if frontend is running
if curl -s http://localhost:4000 > /dev/null; then
    echo -e "${GREEN}✓ Frontend dev server started successfully at http://localhost:4000${NC}"
else
    echo -e "${RED}✗ Failed to start frontend dev server${NC}"
    echo "Check /tmp/windgap-frontend.log for errors"
fi

echo ""
echo -e "${GREEN}Windgap Academy is now running!${NC}"
echo ""
echo -e "Main Application: ${YELLOW}http://localhost:4000/${NC}"
echo -e "Ripple Effect Demo: ${YELLOW}http://localhost:4000/ripple-effect-demo.html${NC}"
echo -e "WebGL Effects Demo: ${YELLOW}http://localhost:4000/webgl-effects-demo.html${NC}"
echo -e "Character Animation Demo: ${YELLOW}http://localhost:4000/character-animation-demo.html${NC}"
echo ""
echo -e "Backend API: ${YELLOW}http://localhost:5000${NC}"
echo -e "API Health: ${YELLOW}http://localhost:5000/health${NC}"
echo -e "API Docs: ${YELLOW}http://localhost:5000/api/docs${NC}"
echo ""
echo -e "To open in browser, run: ${YELLOW}./open-windgap.sh${NC}"
echo -e "To stop the servers, run: ${YELLOW}pkill -f \"node /workspaces/windgapacademy/backend/server.js\"; pkill -f \"vite --port=4000\"${NC}"
echo ""
