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
TARGET_BASE=AutomatedTesting/Gem/PythonTests
LOG=/workspaces/windgapacademy/tmp/ruff_dir_batch.log
mkdir -p /workspaces/windgapacademy/tmp
: > "$LOG"
echo "Using ruff: $RUFF" | tee -a "$LOG"
# list immediate subdirectories (only dirs)
mapfile -t DIRS < <(find "$TARGET_BASE" -mindepth 1 -maxdepth 1 -type d | sort)
TOTAL=${#DIRS[@]}
if [ "$TOTAL" -eq 0 ]; then
  echo "No subdirectories under $TARGET_BASE" | tee -a "$LOG"
  exit 0
fi
LIMIT=5
COUNT=0
for d in "${DIRS[@]}"; do
  COUNT=$((COUNT+1))
  if [ $COUNT -gt $LIMIT ]; then
    break
  fi
  echo "\n=== Processing directory ($COUNT/$LIMIT): $d ===" | tee -a "$LOG"
  # run safe ruff --fix on this directory
  "$RUFF" check --fix "$d" || true
  # stage changes under target base
  git add -A "$TARGET_BASE" || true
  STAGED=$(git diff --staged --name-only || true)
  if [ -n "$STAGED" ]; then
    echo "Committing $(echo "$STAGED" | wc -l) files after fixing $d" | tee -a "$LOG"
    git commit -m "style(ruff): safe fixes for $d" || true
    NEW_SHA=$(git rev-parse HEAD)
    echo "Pushing nested HEAD $NEW_SHA to mufork/ruff/autofix-apply" | tee -a "$LOG"
    GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_wg -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new' \
      git push mufork HEAD:refs/heads/ruff/autofix-apply --force-with-lease || \
      GIT_SSH_COMMAND='ssh -i ~/.ssh/id_ed25519_wg -o IdentitiesOnly=yes -o StrictHostKeyChecking=accept-new' \
      git push mufork HEAD:refs/heads/ruff/autofix-apply --force || true
    echo "Pushed $NEW_SHA for directory $d" | tee -a "$LOG"
    # update superproject pointer
    cd /workspaces/windgapacademy
    git -c submodule.o3de.ignore=none add -A o3de || true
    git update-index --cacheinfo 160000,$NEW_SHA,o3de || true
    # If there are staged changes, commit them, else create a commit updating the submodule
    if git diff --staged --quiet -- o3de; then
      TREE=$(git write-tree)
      PARENT=$(git rev-parse HEAD)
      COMMIT_MSG="chore(submodule): point o3de -> $NEW_SHA"
      COMMIT=$(echo "$COMMIT_MSG" | git commit-tree $TREE -p $PARENT)
      git update-ref refs/heads/feature/auth-and-lms $COMMIT || true
      git checkout feature/auth-and-lms || true
    else
      git commit -m "chore(submodule): point o3de -> $NEW_SHA" || true
    fi
    git push origin feature/auth-and-lms || true
    cd "$ROOT"
  else
    echo "No staged changes for $d" | tee -a "$LOG"
  fi
done
echo "Done. Log: $LOG" | tee -a "$LOG"
