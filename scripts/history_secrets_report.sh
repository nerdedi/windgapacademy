#!/usr/bin/env bash
# Non-destructive git-history search for specific secret values (does not rewrite history)
# Looks for the Firebase API key string in history and writes a summary to tmp/history_secrets_report.txt
set -euo pipefail
out=tmp/history_secrets_report.txt
mkdir -p tmp
: > "$out"

echo "Git history secret report started at $(date -u)" >> "$out"

# Candidate secret to search for (read from current committed file if present)
cand=""
if [ -f src/env.js ]; then
  cand=$(grep -oE "AIza[0-9A-Za-z_-]{35}" src/env.js || true)
fi
if [ -z "$cand" ]; then
  echo "No candidate key found in src/env.js; running heuristic search for Google API-like keys in commits" >> "$out"
  # search history for Google-style API keys (non-destructive)
  git log --all -p -G"AIza[0-9A-Za-z_-]{20,}" --pretty=format:'commit %H %an %ad' >> "$out" || true
else
  echo "Found candidate key: $cand" >> "$out"
  echo "Searching git history for exact matches (non-destructive)" >> "$out"
  git log --all -S"$cand" --pretty=format:'%h %an %ad %s' >> "$out" || true
fi

echo "Git history secret report finished at $(date -u)" >> "$out"
chmod 644 "$out"
echo "Wrote $out"
