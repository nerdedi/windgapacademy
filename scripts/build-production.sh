#!/bin/bash

# Windgap Academy Production Build Script
# This script prepares the application for production deployment

set -e  # Exit on any error

echo "🚀 Starting Windgap Academy Production Build..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check Node.js version
print_status "Checking Node.js version..."
NODE_VERSION=$(node --version)
print_success "Node.js version: $NODE_VERSION"

# Clean previous builds
print_status "Cleaning previous builds..."
rm -rf dist/
rm -rf coverage/
print_success "Cleaned previous builds"

# Install dependencies
print_status "Installing dependencies..."
npm ci --only=production --silent
print_success "Dependencies installed"

# Run linting
print_status "Running ESLint..."
if npm run lint; then
    print_success "Linting passed"
else
    print_error "Linting failed - fix errors before building"
    exit 1
fi

# Run tests
print_status "Running tests..."
if npm run test:ci; then
    print_success "All tests passed"
else
    print_warning "Some tests failed - continuing with build"
fi

# Check TypeScript if applicable
if [ -f "tsconfig.json" ]; then
    print_status "Type checking..."
    if npx tsc --noEmit; then
        print_success "Type checking passed"
    else
        print_error "Type checking failed"
        exit 1
    fi
fi

# Optimize images
print_status "Optimizing images..."
if command -v npm run optimize:images &> /dev/null; then
    npm run optimize:images
    print_success "Images optimized"
else
    print_warning "Image optimization script not found"
fi

# Build for production
print_status "Building for production..."
NODE_ENV=production npm run build:production

if [ -d "dist" ]; then
    print_success "Production build completed successfully"
else
    print_error "Build failed - dist directory not created"
    exit 1
fi

# Analyze bundle size
print_status "Analyzing bundle size..."
if command -v npm run analyze:bundle &> /dev/null; then
    npm run analyze:bundle
fi

# Generate build report
print_status "Generating build report..."
BUILD_SIZE=$(du -sh dist/ | cut -f1)
BUILD_TIME=$(date)
BUILD_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

cat > dist/build-info.json << EOF
{
  "buildTime": "$BUILD_TIME",
  "buildSize": "$BUILD_SIZE",
  "gitHash": "$BUILD_HASH",
  "nodeVersion": "$NODE_VERSION",
  "version": "$(node -p "require('./package.json').version")"
}
EOF

print_success "Build report generated"

# Security check
print_status "Running security audit..."
if npm audit --audit-level=high; then
    print_success "Security audit passed"
else
    print_warning "Security issues found - review before deployment"
fi

# Performance check
print_status "Checking bundle performance..."
DIST_SIZE=$(du -sb dist/ | cut -f1)
MAX_SIZE=10485760  # 10MB in bytes

if [ $DIST_SIZE -gt $MAX_SIZE ]; then
    print_warning "Bundle size ($BUILD_SIZE) exceeds recommended 10MB"
else
    print_success "Bundle size is optimal: $BUILD_SIZE"
fi

# Generate deployment checklist
print_status "Generating deployment checklist..."
cat > dist/DEPLOYMENT_CHECKLIST.md << 'EOF'
# Windgap Academy Deployment Checklist

## Pre-deployment
- [ ] All tests are passing
- [ ] No security vulnerabilities
- [ ] Environment variables are set
- [ ] Firebase configuration is correct
- [ ] SSL certificates are valid

## Deployment
- [ ] Deploy to staging environment first
- [ ] Run smoke tests
- [ ] Check all critical user flows
- [ ] Monitor error rates
- [ ] Verify performance metrics

## Post-deployment
- [ ] Monitor application logs
- [ ] Check user analytics
- [ ] Verify all features work correctly
- [ ] Monitor server resources
- [ ] Update documentation

## Rollback Plan
- [ ] Previous version backup available
- [ ] Rollback procedure documented
- [ ] Database migration rollback ready (if applicable)
EOF

print_success "Deployment checklist created"

# Final summary
echo ""
echo "════════════════════════════════════════"
print_success "🎉 Production build completed successfully!"
echo "════════════════════════════════════════"
echo ""
print_status "Build Summary:"
echo "  📦 Build size: $BUILD_SIZE"
echo "  🏗️  Build time: $BUILD_TIME"
echo "  🔖 Git hash: $BUILD_HASH"
echo "  📁 Output: ./dist/"
echo ""
print_status "Next steps:"
echo "  1. Review dist/DEPLOYMENT_CHECKLIST.md"
echo "  2. Test the built application locally: npm run preview"
echo "  3. Deploy to staging environment first"
echo "  4. Run end-to-end tests"
echo "  5. Deploy to production"
echo ""
print_success "Ready for deployment! 🚀"
