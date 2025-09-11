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
OUTDIR=/workspaces/windgapacademy/tmp
DIFF_OUT="$OUTDIR/ruff_top20.diff"
FIXABLE_LIST="$OUTDIR/ruff_fixable_files.txt"
: > "$DIFF_OUT"
: > "$FIXABLE_LIST"
if [ ! -f "$TOPFILE" ]; then
  echo "Top file list not found: $TOPFILE" >&2
  exit 1
fi
# read top 20 file paths
mapfile -t paths < <(sed -n '1,20p' "$TOPFILE" | sed -E 's/^[[:space:]]*[0-9]+[[:space:]]+//')
if [ ${#paths[@]} -eq 0 ]; then
  echo "No paths to process"; exit 0
fi
echo "Checking which top files are auto-fixable by ruff: ${#paths[@]} files"
# run ruff diff (does not write files)
"$RUFF" check --diff "${paths[@]}" > "$DIFF_OUT" || true
# parse diff for filenames (lines starting with '+++ ')
grep -E '^\+\+\+ ' "$DIFF_OUT" | sed -E 's/^\+\+\+ (b\/|a\/)?//' | sed -E 's/\t.*$//' | sort -u > "$FIXABLE_LIST" || true
# also handle --- lines if needed
if [ ! -s "$FIXABLE_LIST" ]; then
  grep -E '^--- ' "$DIFF_OUT" | sed -E 's/^--- (b\/|a\/)?//' | sed -E 's/\t.*$//' | sort -u > "$FIXABLE_LIST" || true
fi
if [ ! -s "$FIXABLE_LIST" ]; then
  echo "No auto-fixable files detected in top 20. Diff saved to $DIFF_OUT"; exit 0
fi
echo "Auto-fixable files:"; sed -n '1,200p' "$FIXABLE_LIST"
# apply fixes in small batches
batch_size=5
mapfile -t fixable < "$FIXABLE_LIST"
cd "$ROOT"
for ((i=0;i<${#fixable[@]}; i+=batch_size)); do
  batch=("${fixable[@]:i:batch_size}")
  echo "\nApplying ruff --fix to batch: ${batch[*]}"
  "$RUFF" check --fix "${batch[@]}" || true
  git add -A "${batch[@]}" || true
  STAGED=$(git diff --staged --name-only || true)
  if [ -n "$STAGED" ]; then
    echo "Committing $(echo "$STAGED" | wc -l) files"
    git commit -m "style(ruff): apply auto-fixes to top files batch" || true
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
    echo "No staged changes after fixes for this batch"
  fi
done

echo "Done. Diff saved: $DIFF_OUT; list of fixable files: $FIXABLE_LIST"
exit 0
