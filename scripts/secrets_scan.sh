#!/usr/bin/env bash
# Non-destructive repository secrets heuristic scanner.
# Writes findings to tmp/secrets_report_sources.txt
set -euo pipefail
out=tmp/secrets_report_sources.txt
mkdir -p tmp
: > "$out"
echo "Secrets scan started at $(date -u)" >> "$out"

# Patterns to look for (heuristic)
patterns=(
  "AIza[0-9A-Za-z_-]{35}"          # Google API keys (Firebase, Maps)
  "AKIA[0-9A-Z]{16}"               # AWS Access Key ID
  "ghp_[A-Za-z0-9_]{36}"           # GitHub personal access tokens (old format)
  "gho_[A-Za-z0-9_]{36}"           # GitHub OAuth tokens
  "sk_live_[A-Za-z0-9]{24,}"       # Stripe live secret (partial heuristic)
  "-----BEGIN PRIVATE KEY-----"    # Private keys
  "-----BEGIN RSA PRIVATE KEY-----"
  "xoxa-"                           # Slack tokens
  "firebase"                        # firebase occurrences
  "FIREBASE_API_KEY"
)

# Exclude some large directories that are not source
excludes=(".git" "node_modules" "dist" "coverage" "tmp" "assets/images-optimized" "assets/images-webp")
exclude_args=()
for e in "${excludes[@]}"; do
  exclude_args+=(--exclude-dir="$e")
done

# Run grep for each pattern
for p in "${patterns[@]}"; do
  echo "--- Pattern: $p ---" >> "$out"
  # Use grep -I to ignore binary, -n to show line numbers
  # shellcheck disable=SC2086
  grep -I -R -n -E "$p" . ${exclude_args[@]} || true
  echo >> "$out"
done

# Also list files which mention 'FIREBASE_API_KEY' or 'firebaseConfig'
echo "--- explicit keys/vars ---" >> "$out"
for key in "FIREBASE_API_KEY" "firebaseConfig" "FIREBASE_APP_ID"; do
  echo "### $key" >> "$out"
  grep -R -n --exclude-dir=.git --exclude-dir=node_modules -E "$key" || true
  echo >> "$out"
done

echo "Secrets scan finished at $(date -u)" >> "$out"
chmod 644 "$out"

# Also echo summary to stdout
echo "Wrote $out"
