#!/bin/bash
# Script to create a new Unity project for Windgap Academy

# Setup variables
UNITY_PROJECTS_DIR="/project/unity-projects"
PROJECT_NAME="windgap-interactive"
TEMPLATE="3d"  # Options: 2d, 3d, 3d-urp, 3d-hdrp

# Make sure projects directory exists
mkdir -p $UNITY_PROJECTS_DIR

# Run Unity to create the project
/opt/unity/Editor/Unity \
  -batchmode \
  -nographics \
  -createProject $UNITY_PROJECTS_DIR/$PROJECT_NAME \
  -template $TEMPLATE \
  -quit

echo "Project created at: $UNITY_PROJECTS_DIR/$PROJECT_NAME"