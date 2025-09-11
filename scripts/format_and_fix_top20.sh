#!/usr/bin/env bash
set -euo pipefail
ROOT=/workspaces/windgapacademy/o3de/o3de
cd "$ROOT"
# locate ruff
if [ -x .venv-ruff/bin/ruff ]; then
  RUFF=.venv-ruff/bin/ruff
elif [ -x ../../.venv/bin/ruff ]; then
  RUFF=../../.venv/bin/ruff
elif command -v ruff >/dev/null 2>&1; then
  RUFF=$(command -v ruff)
else
  echo "ruff not found" >&2
  exit 2
fi
TOPFILE=/workspaces/windgapacademy/tmp/ruff_top20_files.txt
if [ ! -f "$TOPFILE" ]; then
  echo "Top file list not found: $TOPFILE" >&2
  exit 1
fi
mapfile -t paths < <(sed -n '1,20p' "$TOPFILE" | sed -E 's/^[[:space:]]*[0-9]+[[:space:]]+//')
if [ ${#paths[@]} -eq 0 ]; then
  echo "No paths to process"; exit 0
fi
batch_size=5
for ((i=0;i<${#paths[@]}; i+=batch_size)); do
  batch=("${paths[@]:i:batch_size}")
  echo "\nFormatting batch with ruff format: ${batch[*]}"
  "$RUFF" format "${batch[@]}" || true
  echo "Running ruff --fix on batch: ${batch[*]}"
  "$RUFF" check --fix "${batch[@]}" || true
  git add -A "${batch[@]}" || true
  STAGED=$(git diff --staged --name-only || true)
  if [ -n "$STAGED" ]; then
    echo "Committing $(echo "$STAGED" | wc -l) files"
    git commit -m "style(format): ruff format + safe fixes on top files batch" || true
    NEW_SHA=$(git rev-parse HEAD)
    echo "Pushing nested HEAD $NEW_SHA to mufork/ruff/autofix-apply"
    GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_wg -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new' \
      git push mufork HEAD:refs/heads/ruff/autofix-apply --force-with-lease || \
      GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_wg -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new' \
      git push mufork HEAD:refs/heads/ruff/autofix-apply --force || true
    # update superproject pointer
    cd /workspaces/windgapacademy
    git -c submodule.o3de.ignore=none add -A o3de || true
    git update-index --cacheinfo 160000,$NEW_SHA,o3de || true
    git commit -m "chore(submodule): point o3de -> $NEW_SHA" || true
    git push origin feature/auth-and-lms || true
    cd "$ROOT"
  else
    echo "No staged changes in this batch"
  fi
done

echo "Done formatting and applying fixes." 
