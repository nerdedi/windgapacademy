#!/usr/bin/env bash
set -euo pipefail

# Safe git sync helper
# Modes:
#   --preview : show what would happen
#   --auto    : perform actions automatically (stash/un-stash if needed, pull --rebase, push)
# Usage: ./scripts/git-sync.sh [--preview|--auto]

PREVIEW=false
AUTO=false
for arg in "$@"; do
  case "$arg" in
    --preview) PREVIEW=true ;; 
    --auto) AUTO=true ;; 
    *) echo "Unknown arg: $arg"; exit 2 ;;
  esac
done

echo "git-sync: starting (preview=${PREVIEW}, auto=${AUTO})"

ROOT_DIR="$(git rev-parse --show-toplevel 2>/dev/null || echo ".")"
cd "$ROOT_DIR"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
echo "On branch: $BRANCH"

echo "Fetching remote refs..."
if $PREVIEW; then
  echo "[preview] git fetch origin --prune"
else
  git fetch origin --prune
fi

echo
echo "Local status:"
git status --porcelain=1 -b || true

if [ "$BRANCH" = "HEAD" ]; then
  echo "Detached HEAD - aborting. Checkout a branch first." >&2
  exit 1
fi

REMOTE_EXISTS=false
if git ls-remote --exit-code --heads origin "$BRANCH" >/dev/null 2>&1; then
  REMOTE_EXISTS=true
fi

echo "Remote branch exists: $REMOTE_EXISTS"

STASHED=false
if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree has changes."
  if $AUTO; then
    echo "Auto mode: stashing local changes"
    git stash push -u -m "git-sync auto-stash: $(date --iso-8601=seconds)"
    STASHED=true
  else
    echo "Run with --auto to stash and continue, or commit/clean your working tree." >&2
    exit 1
  fi
fi

echo "Pulling latest from origin/$BRANCH (rebase)..."
if $PREVIEW; then
  echo "[preview] git pull --rebase origin $BRANCH"
else
  # if remote branch doesn't exist, skip pull
  if $REMOTE_EXISTS; then
    git pull --rebase origin "$BRANCH"
  else
    echo "Remote branch does not exist yet; will push to create it." 
  fi
fi

if $STASHED; then
  echo "Popping stash..."
  if $PREVIEW; then
    echo "[preview] git stash pop"
  else
    set +e
    git stash pop
    STASH_POP_EXIT=$?
    set -e
    if [ $STASH_POP_EXIT -ne 0 ]; then
      echo "git stash pop exited with $STASH_POP_EXIT. You may have conflicts to resolve." >&2
      exit $STASH_POP_EXIT
    fi
  fi
fi

echo "Pushing branch to origin (set upstream if needed)..."
if $PREVIEW; then
  if $REMOTE_EXISTS; then
    echo "[preview] git push origin $BRANCH"
  else
    echo "[preview] git push -u origin $BRANCH"
  fi
else
  if $REMOTE_EXISTS; then
    git push origin "$BRANCH"
  else
    git push -u origin "$BRANCH"
  fi
fi

echo "git-sync: done"
