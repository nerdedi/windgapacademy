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
# detect black (optional). Will only be run when RUN_BLACK=1 is set in the environment.
if [ -x .venv-ruff/bin/black ]; then
  BLACK=.venv-ruff/bin/black
elif [ -x ../../.venv/bin/black ]; then
  BLACK=../../.venv/bin/black
elif command -v black >/dev/null 2>&1; then
  BLACK=$(command -v black)
else
  BLACK=""
fi
NEXT=/workspaces/windgapacademy/tmp/next_batch_files.txt
if [ ! -f "$NEXT" ]; then echo "next batch file missing: $NEXT" >&2; exit 1; fi
mapfile -t paths < "$NEXT"
if [ ${#paths[@]} -eq 0 ]; then echo "no files in next batch"; exit 0; fi
batch_size=5
for ((i=0;i<${#paths[@]}; i+=batch_size)); do
  batch=("${paths[@]:i:batch_size}")
  echo "\n== Processing batch: ${batch[*]} =="
  # ruff format if available
  # If enabled, run Black first (explicit path) to handle line reflow. Disabled by default.
  if [ -n "${RUN_BLACK:-}" ] && [ -n "${BLACK}" ]; then
    echo "RUN_BLACK set; running: $BLACK ${batch[*]}"
    "$BLACK" --quiet "${batch[@]}" || true
  fi

  if "$RUFF" format --help >/dev/null 2>&1; then
    echo "Running: $RUFF format ${batch[*]}"
    "$RUFF" format "${batch[@]}" || true
  fi
  echo "Running: $RUFF check --fix ${batch[*]}"
  "$RUFF" check --fix "${batch[@]}" || true
  git add -A "${batch[@]}" || true
  STAGED=$(git diff --staged --name-only || true)
  if [ -n "$STAGED" ]; then
    echo "Committing $(echo "$STAGED" | wc -l) files"
    git commit -m "style(format): ruff format + safe fixes on next batch" || true
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

echo "Done processing next batch."
