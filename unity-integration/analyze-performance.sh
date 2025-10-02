# Unity WebGL Performance Optimization Guide
# Windgap Academy - Educational Platform Integration

## 📊 Performance Monitoring Script
# Run this script to monitor Unity WebGL build performance

#!/bin/bash

echo "🎮 Unity WebGL Performance Analysis for Windgap Academy"
echo "========================================================"

# Configuration
UNITY_BUILD_PATH="${1:-/workspaces/windgapacademy/public/unity}"
PERFORMANCE_LOG="unity-performance-analysis.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$PERFORMANCE_LOG"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$PERFORMANCE_LOG"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$PERFORMANCE_LOG"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$PERFORMANCE_LOG"
}

# Initialize performance log
echo "Unity WebGL Performance Analysis - $TIMESTAMP" > "$PERFORMANCE_LOG"
echo "=========================================" >> "$PERFORMANCE_LOG"

log_info "Starting Unity WebGL performance analysis..."
log_info "Build path: $UNITY_BUILD_PATH"

# Check if Unity build exists
if [ ! -d "$UNITY_BUILD_PATH" ]; then
    log_error "Unity build directory not found: $UNITY_BUILD_PATH"
    exit 1
fi

# Analyze build files
log_info "📁 Analyzing build file sizes..."

if [ -f "$UNITY_BUILD_PATH/Build.wasm" ]; then
    WASM_SIZE=$(du -h "$UNITY_BUILD_PATH/Build.wasm" | cut -f1)
    WASM_SIZE_MB=$(du -m "$UNITY_BUILD_PATH/Build.wasm" | cut -f1)
    log_info "WASM file size: $WASM_SIZE (${WASM_SIZE_MB}MB)"

    if [ "$WASM_SIZE_MB" -gt 50 ]; then
        log_warning "WASM file is large (${WASM_SIZE_MB}MB). Consider further optimization."
    else
        log_success "WASM file size is optimal (${WASM_SIZE_MB}MB)"
    fi
else
    log_error "Build.wasm not found"
fi

if [ -f "$UNITY_BUILD_PATH/Build.data" ]; then
    DATA_SIZE=$(du -h "$UNITY_BUILD_PATH/Build.data" | cut -f1)
    DATA_SIZE_MB=$(du -m "$UNITY_BUILD_PATH/Build.data" | cut -f1)
    log_info "Data file size: $DATA_SIZE (${DATA_SIZE_MB}MB)"

    if [ "$DATA_SIZE_MB" -gt 30 ]; then
        log_warning "Data file is large (${DATA_SIZE_MB}MB). Consider asset optimization."
    else
        log_success "Data file size is optimal (${DATA_SIZE_MB}MB)"
    fi
else
    log_error "Build.data not found"
fi

if [ -f "$UNITY_BUILD_PATH/Build.framework.js" ]; then
    FRAMEWORK_SIZE=$(du -h "$UNITY_BUILD_PATH/Build.framework.js" | cut -f1)
    FRAMEWORK_SIZE_KB=$(du -k "$UNITY_BUILD_PATH/Build.framework.js" | cut -f1)
    log_info "Framework JS size: $FRAMEWORK_SIZE (${FRAMEWORK_SIZE_KB}KB)"

    if [ "$FRAMEWORK_SIZE_KB" -gt 2048 ]; then
        log_warning "Framework JS is large (${FRAMEWORK_SIZE_KB}KB)"
    else
        log_success "Framework JS size is optimal (${FRAMEWORK_SIZE_KB}KB)"
    fi
else
    log_error "Build.framework.js not found"
fi

# Calculate total build size
TOTAL_SIZE=$(du -sh "$UNITY_BUILD_PATH" | cut -f1)
TOTAL_SIZE_MB=$(du -sm "$UNITY_BUILD_PATH" | cut -f1)
log_info "📊 Total build size: $TOTAL_SIZE (${TOTAL_SIZE_MB}MB)"

if [ "$TOTAL_SIZE_MB" -gt 100 ]; then
    log_warning "Total build size is large (${TOTAL_SIZE_MB}MB). Consider comprehensive optimization."
elif [ "$TOTAL_SIZE_MB" -gt 50 ]; then
    log_warning "Total build size is moderate (${TOTAL_SIZE_MB}MB). Some optimization recommended."
else
    log_success "Total build size is optimal (${TOTAL_SIZE_MB}MB)"
fi

# Check for compression
log_info "🗜️  Checking compression status..."

COMPRESSED_FILES=0
TOTAL_FILES=0

for file in "$UNITY_BUILD_PATH"/*.{js,wasm,data}; do
    if [ -f "$file" ]; then
        TOTAL_FILES=$((TOTAL_FILES + 1))
        if [ -f "${file}.br" ]; then
            COMPRESSED_FILES=$((COMPRESSED_FILES + 1))
            ORIGINAL_SIZE=$(du -k "$file" | cut -f1)
            COMPRESSED_SIZE=$(du -k "${file}.br" | cut -f1)
            COMPRESSION_RATIO=$(echo "scale=1; $COMPRESSED_SIZE * 100 / $ORIGINAL_SIZE" | bc)
            log_success "$(basename "$file") compressed: ${COMPRESSION_RATIO}% of original size"
        else
            log_warning "$(basename "$file") not compressed"
        fi
    fi
done

if [ "$COMPRESSED_FILES" -eq "$TOTAL_FILES" ]; then
    log_success "All build files are compressed"
else
    log_warning "$COMPRESSED_FILES/$TOTAL_FILES files are compressed"
fi

# Analyze build manifest if available
if [ -f "$UNITY_BUILD_PATH/build-manifest.json" ]; then
    log_info "📄 Analyzing build manifest..."

    if command -v jq &> /dev/null; then
        VERSION=$(jq -r '.version' "$UNITY_BUILD_PATH/build-manifest.json")
        BUILD_TIME=$(jq -r '.buildTime' "$UNITY_BUILD_PATH/build-manifest.json")
        COMPRESSION_FORMAT=$(jq -r '.compressionFormat' "$UNITY_BUILD_PATH/build-manifest.json")
        MEMORY_SIZE=$(jq -r '.memorySize' "$UNITY_BUILD_PATH/build-manifest.json")
        OPTIMIZED=$(jq -r '.optimized' "$UNITY_BUILD_PATH/build-manifest.json")

        log_info "Build version: $VERSION"
        log_info "Build time: $BUILD_TIME"
        log_info "Compression format: $COMPRESSION_FORMAT"
        log_info "Memory size: ${MEMORY_SIZE}MB"

        if [ "$OPTIMIZED" = "true" ]; then
            log_success "Build is marked as optimized"
        else
            log_warning "Build is not marked as optimized"
        fi
    else
        log_warning "jq not available, skipping manifest analysis"
    fi
else
    log_warning "Build manifest not found"
fi

# Performance recommendations
log_info "🚀 Performance Recommendations:"

echo "" | tee -a "$PERFORMANCE_LOG"
echo "OPTIMIZATION RECOMMENDATIONS:" | tee -a "$PERFORMANCE_LOG"
echo "=============================" | tee -a "$PERFORMANCE_LOG"

if [ "$TOTAL_SIZE_MB" -gt 50 ]; then
    echo "• Consider texture compression and resolution reduction" | tee -a "$PERFORMANCE_LOG"
    echo "• Optimize audio files (reduce sample rates, use compression)" | tee -a "$PERFORMANCE_LOG"
    echo "• Remove unused assets and scripts" | tee -a "$PERFORMANCE_LOG"
fi

if [ "$COMPRESSED_FILES" -lt "$TOTAL_FILES" ]; then
    echo "• Enable Brotli compression for all build files" | tee -a "$PERFORMANCE_LOG"
    echo "• Configure server to serve .br files when available" | tee -a "$PERFORMANCE_LOG"
fi

echo "• Use Unity's Asset Bundle system for large assets" | tee -a "$PERFORMANCE_LOG"
echo "• Implement progressive loading for educational content" | tee -a "$PERFORMANCE_LOG"
echo "• Optimize shaders for mobile/web performance" | tee -a "$PERFORMANCE_LOG"
echo "• Use object pooling for frequently created/destroyed objects" | tee -a "$PERFORMANCE_LOG"

# React integration recommendations
echo "" | tee -a "$PERFORMANCE_LOG"
echo "REACT INTEGRATION RECOMMENDATIONS:" | tee -a "$PERFORMANCE_LOG"
echo "=================================" | tee -a "$PERFORMANCE_LOG"
echo "• Use lazy loading for Unity player component" | tee -a "$PERFORMANCE_LOG"
echo "• Implement loading progress indicators" | tee -a "$PERFORMANCE_LOG"
echo "• Use React.memo for Unity player wrapper" | tee -a "$PERFORMANCE_LOG"
echo "• Implement Unity instance cleanup on component unmount" | tee -a "$PERFORMANCE_LOG"
echo "• Use service workers for caching Unity assets" | tee -a "$PERFORMANCE_LOG"

# Generate performance score
PERFORMANCE_SCORE=100

if [ "$TOTAL_SIZE_MB" -gt 100 ]; then
    PERFORMANCE_SCORE=$((PERFORMANCE_SCORE - 30))
elif [ "$TOTAL_SIZE_MB" -gt 50 ]; then
    PERFORMANCE_SCORE=$((PERFORMANCE_SCORE - 15))
fi

if [ "$COMPRESSED_FILES" -eq 0 ]; then
    PERFORMANCE_SCORE=$((PERFORMANCE_SCORE - 20))
elif [ "$COMPRESSED_FILES" -lt "$TOTAL_FILES" ]; then
    PERFORMANCE_SCORE=$((PERFORMANCE_SCORE - 10))
fi

if [ ! -f "$UNITY_BUILD_PATH/build-manifest.json" ]; then
    PERFORMANCE_SCORE=$((PERFORMANCE_SCORE - 5))
fi

log_info "📊 Performance Score: $PERFORMANCE_SCORE/100"

if [ "$PERFORMANCE_SCORE" -ge 90 ]; then
    log_success "Excellent performance optimization!"
elif [ "$PERFORMANCE_SCORE" -ge 70 ]; then
    log_success "Good performance optimization"
elif [ "$PERFORMANCE_SCORE" -ge 50 ]; then
    log_warning "Moderate performance - room for improvement"
else
    log_error "Poor performance - optimization needed"
fi

# Create performance summary
cat > "unity-performance-summary.json" << EOF
{
  "timestamp": "$TIMESTAMP",
  "buildPath": "$UNITY_BUILD_PATH",
  "totalSizeMB": $TOTAL_SIZE_MB,
  "compressionStatus": "$COMPRESSED_FILES/$TOTAL_FILES",
  "performanceScore": $PERFORMANCE_SCORE,
  "recommendations": [
    "Optimize texture sizes and compression",
    "Enable Brotli compression for all files",
    "Implement progressive loading",
    "Use React lazy loading for Unity component",
    "Configure asset caching strategies"
  ]
}
EOF

log_success "Performance analysis completed!"
log_info "Detailed log saved to: $PERFORMANCE_LOG"
log_info "Summary saved to: unity-performance-summary.json"

echo ""
echo "🎯 Next Steps:"
echo "1. Review the performance log for specific recommendations"
echo "2. Run the Unity Asset Optimizer in the Unity Editor"
echo "3. Update your React components to use lazy loading"
echo "4. Configure your web server for optimal asset delivery"
echo "5. Implement monitoring in your React-Unity bridge"
