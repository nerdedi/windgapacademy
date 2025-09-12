#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Generating detect-secrets baseline..."
if ! command -v detect-secrets >/dev/null 2>&1; then
  echo "detect-secrets not found; installing locally into user site-packages..."
  python3 -m pip install --user detect-secrets
  export PATH="$HOME/.local/bin:$PATH"
fi
detect-secrets scan > .secrets.baseline
echo "Wrote .secrets.baseline"
