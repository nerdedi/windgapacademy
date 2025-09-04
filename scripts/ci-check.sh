#!/usr/bin/env bash
set -euo pipefail

echo "Running local CI checks: ESLint, TypeScript, Tests"

npx eslint components --ext .js,.jsx,.ts,.tsx
npx tsc --noEmit
npm test --silent || npx jest --watchAll=false --runInBand

echo "Local CI checks passed"
