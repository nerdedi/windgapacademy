# Unity Integration with VS Code

This document provides guidance on optimizing VS Code for Unity development in this project.

## Workspace Setup

For optimal performance when working with Unity projects in this codebase, use the specialized Unity workspace:

```bash
code unity-dev.code-workspace
```

Or select option 4 in the workspace selector script:

```bash
./open-workspace.sh
```

## Optimizing Unity Project Performance

Unity projects can become very large and cause performance issues in VS Code. To optimize performance:

1. **Clean temporary files regularly**:
   ```bash
   ./optimize-unity-project.sh
   ```
2. **Use the optimized workspace configuration**:
   - Excludes temporary Unity files
   - Configures C# settings for better performance
   - Sets up appropriate file watching patterns

3. **Consider using separate editors**:
   - Use Unity Editor for scene editing and game design
   - Use VS Code only for script editing

## Unity WebGL Integration

This project integrates Unity WebGL builds into the main application. The core integration files are:

- `unity-integration/UnityPlayer.jsx` - Basic Unity WebGL player component
- `unity-integration/EnhancedUnityPlayer.jsx` - Advanced player with additional features
- `unity-integration/UnityGamePage.jsx` - Page component for displaying Unity games

To deploy a new Unity WebGL build:

1. Build your Unity project to WebGL
2. Run the deployment script:
   ```bash
   ./unity-integration/deploy-unity-build.sh <path-to-build>
   ```

## Performance Recommendations

1. **Disable unnecessary VS Code extensions** when working with Unity projects
2. **Clean Unity's temporary files** regularly using the provided script
3. **Use a multi-root workspace** to focus only on relevant directories
4. **Consider using Unity's dedicated Visual Studio Code package** for deeper integration

## Troubleshooting

If you experience slowdowns in VS Code when working with Unity:

1. Clean temporary Unity folders (Library, Temp, obj, etc.)
2. Restart VS Code with reduced extensions: `code --disable-extensions`
3. Try using the specialized Unity workspace configuration
