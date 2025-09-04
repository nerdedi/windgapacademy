This workspace contains recommended VS Code settings to make Pylance friendlier in large repositories.

What was added
- `settings.json` — Limits Pylance diagnostics to open files, reduces type-checking strictness, sets extraPaths, and excludes large folders from analysis.
- `extensions.json` — Recommends `ms-python.python` and `ms-python.vscode-pylance` (plus other helpful extensions used across the project).

Why these changes
- Pylance can consume significant CPU and memory when scanning big repos. These defaults focus Pylance on the folders you most likely edit.

Adjusting settings
- If you work inside a subfolder, open that folder directly in VS Code to further reduce indexing.
- Edit `python.analysis.exclude` to add or remove patterns (wildcards like `**` are supported).
- Switch `python.analysis.diagnosticMode` to `workspace` if you need full workspace diagnostics.
- Set `python.analysis.typeCheckingMode` to `off` or `off` if you want even less analysis.

More help
- See the Pylance docs and VS Code Python extension docs for deeper configuration options.

If you want, I can also:
- Create a `.vscode/launch.json` with common run configurations.
- Add a small script to detect large folders and suggest exclude patterns automatically.
