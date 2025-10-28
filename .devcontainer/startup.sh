#!/bin/bash
# Auto-start script for GitHub Codespaces

echo "🚀 Starting Windgap Academy with PM2..."

# Kill any existing Vite processes on port 3000 or 4000
pkill -f "vite --host --port"

# Start the app with PM2
npx pm2 start ecosystem.config.cjs

# Show status
npx pm2 status

echo "✅ Windgap Academy is now running!"
echo "📱 Access your app at: https://${CODESPACE_NAME}-3000.${GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN}"
echo ""
echo "Useful commands:"
echo "  npm run dev:logs     - View logs"
echo "  npm run dev:restart  - Restart app"
echo "  npm run dev:stop     - Stop app"
echo "  npm run dev:status   - Check status"
