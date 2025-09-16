# VS Code Performance Optimization

This document outlines how to optimize VS Code performance when working with this large codebase.

## Workspace Options

Several workspace files are available to help you focus on specific parts of the project:

- `lightweight.code-workspace` - Bare minimum for quick loading
- `main-dev.code-workspace` - Main development with heavy directories excluded
- `frontend-dev.code-workspace` - Frontend-only workspace (src, components)
- `unity-dev.code-workspace` - Unity-focused development
- Custom workspaces can be created with the `open-workspace.sh` script

## How to Use

Run the workspace selector script:

```bash
./open-workspace.sh
```

Or directly open a specific workspace:

```bash
# Fastest loading option
code lightweight.code-workspace

# For general development
code main-dev.code-workspace

# For frontend work only
code frontend-dev.code-workspace

# For Unity development
code unity-dev.code-workspace
```

## Performance Tips

1. **Avoid opening the full workspace** - Instead, use one of the workspace files above

2. **Work with subfolders** - When possible, open only specific subfolders:

   ```bash
   code src/
   code components/
   ```

3. **Exclude directories you don't need** - The workspaces already exclude large directories like:
   - o3de
   - unity-integration
   - unity-setup
   - assets/images-optimized
   - assets/images-webp
   - test-results
4. **Use multi-root workspaces** - Create custom workspaces that include only the folders you need for a specific task

5. **Limit extensions** - Disable extensions you don't need for your current task

## VS Code Settings

The `.vscode/settings.json` file has been optimized to improve performance by:

- Setting Pylance to only analyze open files
- Excluding large directories from file watching and indexing
- Optimizing search functionality
- Reducing unnecessary background processing

## Troubleshooting

If VS Code is still slow:

1. Try running with reduced extensions: `code --disable-extensions`
2. Check CPU usage with: `top` or `htop`
3. Consider closing other applications to free up system resources

## Unity Project Optimization

Unity projects can be particularly resource-intensive in VS Code. Here are specific optimizations for Unity development:

1. **Use the Unity-specific workspace**:

   ```bash
   code unity-dev.code-workspace
   ```

2. **Exclude Unity-specific temporary files**:
   - Library/
   - Logs/
   - obj/
   - Temp/
   - .meta files (except for .cs.meta)

3. **Disable unnecessary C# features**:
   - Set `"csharp.referencesCodeLens.enabled": false` to reduce overhead
   - Use `"omnisharp.useModernNet": true` for better performance

4. **Consider using Unity's built-in editor** for scene editing, while using VS Code just for script editing

The Unity-specific settings have been added to `unity-setup/.vscode/settings.json` and are included in the `unity-dev.code-workspace` configuration.
