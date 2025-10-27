#!/bin/bash

# Open the Windgap Academy app in the browser

echo "Opening Windgap Academy in the browser..."

# Frontend URL
FRONTEND_URL="http://localhost:4000"

# Backend URL
BACKEND_URL="http://localhost:5000/health"

echo "Checking if the frontend is running at $FRONTEND_URL..."
if curl -s "$FRONTEND_URL" > /dev/null; then
    echo "✅ Frontend is running at $FRONTEND_URL"
else
    echo "❌ Frontend is not running. Starting frontend..."
    cd /workspaces/windgapacademy
    npm run dev -- --port=4000 &
    sleep 5
    if curl -s "$FRONTEND_URL" > /dev/null; then
        echo "✅ Frontend started successfully"
    else
        echo "❌ Failed to start frontend"
    fi
fi

echo "Checking if the backend is running at $BACKEND_URL..."
if curl -s "$BACKEND_URL" > /dev/null; then
    echo "✅ Backend is running at $BACKEND_URL"
else
    echo "❌ Backend is not running. Starting backend..."
    cd /workspaces/windgapacademy
    node backend/server.js > /tmp/windgap-backend.log 2>&1 &
    sleep 3
    if curl -s "$BACKEND_URL" > /dev/null; then
        echo "✅ Backend started successfully"
    else
        echo "❌ Failed to start backend"
    fi
fi

# Open browser
echo "Opening Windgap Academy in the browser..."
"$BROWSER" "$FRONTEND_URL"

echo "Done! Windgap Academy is ready to use."
echo ""
echo "Main app: $FRONTEND_URL"
echo "Example SPA routes:"
echo "- Animation demo: $FRONTEND_URL/animation-demo"
echo "- Fluid simulation: $FRONTEND_URL/tools/fluid-simulation"
echo "- Whiteboard: $FRONTEND_URL/tools/whiteboard"

exit 0
