Admin automation

This repository includes a dispatched workflow that can perform two admin tasks when run manually:

- Protect the `main` branch (prevent force pushes / deletion, require PR reviews and status checks).
- Optionally delete the repository `nerdedi/LeetCodeAnimation` if you explicitly confirm deletion.

How it works
- The workflow `Auto Admin` is a `workflow_dispatch` workflow located at `.github/workflows/auto-admin.yml`.
- It requires a repository secret named `ADMIN_PAT` containing a PAT with `repo` scope (or you can set it in the workflow run input as `GITHUB_TOKEN` but that token may not have the necessary scopes).

To run (safe flow)
1. Go to the Actions tab → select `Auto Admin` → Click `Run workflow`.
2. Leave `confirm_delete` = `no` and `protect_main` = `true` to only apply branch protection.
3. After verifying branch protection, if you really want to delete the other repo, re-run the workflow with `confirm_delete` set to `yes` and ensure `ADMIN_PAT` is set.

Important caution
- Deleting repositories is irreversible. Use `confirm_delete=yes` only when you are certain. Prefer manual deletion via the web UI for safety.
