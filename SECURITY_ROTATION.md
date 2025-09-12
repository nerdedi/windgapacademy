# Secret Exposure & Rotation Guide
## Secret Exposure & Rotation Guide

This file contains an actionable playbook to rotate a leaked Firebase (Google) API key, update CI/deployments, verify the remediation, and optionally prepare a safe history purge.

High-level recommendation (best immediate option)
- Rotate the exposed Firebase key immediately in the Firebase/GCP console. Do not wait for a history purge — revoke first, then remove from history if you still want to.

Checklist
- [x] Revoke/regenerate the exposed credential in the provider console (Firebase / GCP).
- [x] Remove working-tree occurrences and switch code to read from environment variables (already done: `src/env.js`).
- [ ] Update CI/CD and hosting provider secrets with the new key and redeploy.
- [ ] Audit logs and rotate any other related credentials if suspicious activity is found.
- [ ] (Optional) Purge the secret from git history using a safe, reviewed process.

Immediate rotation steps (Firebase / Google API key)
1. Sign into the Firebase Console for the project (https://console.firebase.google.com) and open Project Settings -> General -> Web API Key.
2. If the project uses a simple Web API key, generate a new key or rotate access by following the Console prompts.
3. Where possible, restrict the new key: add HTTP referrer restrictions (your domains) or IP restrictions for server keys.
4. If a service account key (JSON) was exposed, go to Google Cloud Console -> IAM & Admin -> Service Accounts, delete the exposed key and create a new one. Prefer using short-lived service account keys and workload identity where possible.

Update deployments and CI (examples)
- GitHub Actions (recommended):
  - In the repo on github.com go to Settings -> Secrets -> Actions and add `FIREBASE_API_KEY` with the new value.
  - Alternatively, using the GitHub CLI (if available):
   - gh secret set FIREBASE_API_KEY --body "$NEW_KEY" --repo OWNER/REPO
- Vercel: add an Environment Variable named `FIREBASE_API_KEY` in the Project Settings -> Environment Variables. Update for Production/Preview/Development as needed.
- Netlify: Site settings -> Build & deploy -> Environment -> Add variable `FIREBASE_API_KEY`.

Verification after rotation
1. Confirm the new API key is present in your CI secret store and not in the repo: run `git grep "AIza" || true` locally to ensure no working-tree matches.
2. Redeploy the site/app (via CI or host console) and run a smoke test. Check for errors in console/network that indicate invalid keys.
3. Inspect Firebase/GCP logs for any unexpected activity during the exposure window.

Optional: prepare and execute a git-history purge (destructive)
NOTE: This rewrites history and requires force-push and coordination with all contributors. Do NOT run unless you understand the workflow.

Quick recipe (git-filter-repo approach) — dry run first
1. Install git-filter-repo (preferred):
  - python3 -m pip install --user git-filter-repo
2. Mirror-clone the repo to operate on a throwaway copy:
  - git clone --mirror <git-url> /tmp/windgapacademy-mirror.git
3. In the mirror repo, create a `replacements.txt` file that maps the exposed secret to a safe token, e.g.:
  - `FIREBASE_API_KEY==>REDACTED_FIREBASE_API_KEY`
4. Run git-filter-repo (this is destructive to the mirror only):
  - cd /tmp/windgapacademy-mirror.git
  - git-filter-repo --replace-text ../replacements.txt --force
5. Inspect the rewritten mirror (look at refs, tags, and run `git log -S'<exposed_value>' --all` to verify it's gone).
6. If everything looks correct, push to a temporary remote or create a patch bundle for reviewers. Do not force-push main branches until collaborators are aligned.

Alternate BFG approach (if you prefer BFG):
1. Install BFG jar and run against a mirror clone:
  - java -jar bfg.jar --replace-text replacements.txt /tmp/windgapacademy-mirror.git
2. Follow BFG's post-processing steps (`git reflog expire --all && git gc --prune=now --aggressive`).

Collaboration and rollout strategy for history rewrite
- Create a dedicated issue and coordinate: list affected branches, open PRs to rebase, and timeline for the force-push.
- Prepare a migration doc for contributors: how to fetch the rewritten history, commands to rebase or reclone, and expected downtime.

Repository-side verification commands
- Search working tree for likely API key patterns:
  - git grep -n "AIza" || true
- Confirm history still contains occurrences (if you haven't purged yet):
  - git log --all -S"AIzaSy" --pretty=format:'%h %ad %an %s' --date=iso | head -n 50

If you want me to take further action
- I can: prepare an automated history-purge run on a mirror clone, produce a patch bundle, and show a safe diff for review (I will not force-push without explicit approval).
- I can also open a pull request for the current branch (`feature/auth-and-lms`) with the changes and attach these reports.

Files produced by the scan (where to look)
- `tmp/secrets_report_sources.txt` — heuristic source matches and file context
- `tmp/secrets_report_refined2.txt` — refined matches
- `tmp/history_secrets_report.txt` — commits and file/line contexts where the secret occurred

Keep this playbook as the canonical step-by-step; if you approve, I can run the non-destructive preview purge now and share the results.
