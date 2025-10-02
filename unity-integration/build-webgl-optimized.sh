#!/bin/bash

# Unity WebGL Build Configuration Script
# Optimized for Windgap Academy React Integration

echo "🎮 Unity WebGL Build Configuration for Windgap Academy"
echo "======================================================"

# Configuration Variables
UNITY_PROJECT_PATH="/workspaces/windgapacademy/unity-project"
BUILD_OUTPUT_PATH="/workspaces/windgapacademy/public/unity-builds"
BUILD_NAME="windgap-academy-webgl"

# Unity Build Settings for WebGL Optimization
export UNITY_WEBGL_COMPRESSION_FORMAT="Brotli"
export UNITY_WEBGL_LINKER_TARGET="asm.js"
export UNITY_WEBGL_MEMORY_SIZE=512
export UNITY_WEBGL_EXCEPTION_SUPPORT="None"
export UNITY_WEBGL_NAME_FILES_AS_HASHES=1
export UNITY_WEBGL_DATA_CACHING=1
export UNITY_WEBGL_DEBUG_SYMBOLS=0

# Create build output directory
mkdir -p "$BUILD_OUTPUT_PATH"

echo "📁 Build Configuration:"
echo "   Project Path: $UNITY_PROJECT_PATH"
echo "   Output Path: $BUILD_OUTPUT_PATH"
echo "   Build Name: $BUILD_NAME"
echo "   Compression: $UNITY_WEBGL_COMPRESSION_FORMAT"
echo "   Memory Size: ${UNITY_WEBGL_MEMORY_SIZE}MB"

# Unity Build Command (requires Unity CLI)
if command -v unity &> /dev/null; then
    echo "🔨 Starting Unity WebGL build..."

    # Build command with optimizations
    unity -batchmode -quit \
        -projectPath "$UNITY_PROJECT_PATH" \
        -buildTarget WebGL \
        -buildPath "$BUILD_OUTPUT_PATH/$BUILD_NAME" \
        -executeMethod BuildScript.BuildWebGL \
        -logFile "$BUILD_OUTPUT_PATH/unity-build.log" \
        -nographics \
        -silent-crashes

    if [ $? -eq 0 ]; then
        echo "✅ Unity WebGL build completed successfully!"
        echo "📦 Build files available at: $BUILD_OUTPUT_PATH/$BUILD_NAME"

        # Copy build files to React public directory
        if [ -d "$BUILD_OUTPUT_PATH/$BUILD_NAME" ]; then
            echo "📋 Copying build files to React public directory..."
            cp -r "$BUILD_OUTPUT_PATH/$BUILD_NAME/"* "/workspaces/windgapacademy/public/unity/"
            echo "✅ Build files copied successfully!"
        fi

        # Generate build info JSON
        cat > "$BUILD_OUTPUT_PATH/build-info.json" << EOF
{
  "buildTime": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "buildName": "$BUILD_NAME",
  "compressionFormat": "$UNITY_WEBGL_COMPRESSION_FORMAT",
  "memorySize": "${UNITY_WEBGL_MEMORY_SIZE}MB",
  "optimization": "production",
  "version": "$(date +%Y%m%d%H%M%S)"
}
EOF

        echo "📊 Build information saved to build-info.json"

    else
        echo "❌ Unity WebGL build failed. Check the log file for details."
        cat "$BUILD_OUTPUT_PATH/unity-build.log"
        exit 1
    fi
else
    echo "⚠️  Unity CLI not found. Please install Unity and ensure it's in your PATH."
    echo "📖 For manual build:"
    echo "   1. Open Unity Editor"
    echo "   2. Open project: $UNITY_PROJECT_PATH"
    echo "   3. Go to File > Build Settings"
    echo "   4. Select WebGL platform"
    echo "   5. Configure settings as shown above"
    echo "   6. Build to: $BUILD_OUTPUT_PATH/$BUILD_NAME"
fi

echo ""
echo "🎯 WebGL Build Optimization Tips:"
echo "   • Use texture compression (DXT/ETC2)"
echo "   • Minimize audio file sizes"
echo "   • Optimize mesh complexity"
echo "   • Use object pooling for performance"
echo "   • Enable GPU instancing where possible"
echo ""
echo "🔗 Integration with React:"
echo "   • Build files will be available at /unity/ URL path"
echo "   • Use EnhancedUnityPlayer component for embedding"
echo "   • Unity-React communication via UnityBridge.js"
