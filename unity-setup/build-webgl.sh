#!/bin/bash
# Unity WebGL build script for Windgap Academy

# Setup variables
PROJECT_PATH="/project/unity-projects/windgap-interactive"
OUTPUT_PATH="/project/public/unity-webgl"
LOG_FILE="/project/unity-setup/unity-build.log"

# Make sure output directory exists
mkdir -p $OUTPUT_PATH

# Run Unity in batch mode to build WebGL
/opt/unity/Editor/Unity \
  -batchmode \
  -nographics \
  -silent-crashes \
  -logFile $LOG_FILE \
  -projectPath $PROJECT_PATH \
  -executeMethod WebGLBuilder.Build \
  -buildTarget WebGL \
  -customBuildPath $OUTPUT_PATH \
  -quit

# Check if build was successful
if [ $? -eq 0 ]; then
  echo "WebGL build completed successfully!"
  echo "Output available at: $OUTPUT_PATH"
else
  echo "WebGL build failed. Check log file: $LOG_FILE"
  exit 1
fi