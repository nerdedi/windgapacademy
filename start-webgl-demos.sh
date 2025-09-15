#!/bin/bash

# Start HTTP server for WebGL demos
echo "Starting HTTP server for WebGL demos on port 8080"
echo "Visit http://localhost:8080/webgl-demos.html to view all demos"
echo "Press Ctrl+C to stop the server"

npx http-server -p 8080 -o webgl-demos.html