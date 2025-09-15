# 🚀 UNITY WEBGL BUILD PIPELINE FOR WINDGAP ACADEMY

## 🏗️ BUILD CONFIGURATION

### Unity Project Settings

```csharp
// Build Settings Configuration
public class WindgapBuildSettings
{
    // Platform Settings
    Platform: WebGL
    Target: WebGL 2.0
    Compression: Brotli
    Code Optimization: Master

    // Quality Settings
    Rendering Pipeline: Universal Render Pipeline (URP)
    Texture Quality: High (Desktop), Medium (Mobile)
    Shadow Quality: Medium
    Anti-Aliasing: FXAA

    // Performance Settings
    Scripting Backend: IL2CPP
    Api Compatibility: .NET Standard 2.1
    Managed Stripping Level: High
    Strip Engine Code: Enabled

    // WebGL Specific
    Memory Size: 512MB (expandable to 1GB)
    Enable Exceptions: None
    Compression Format: Brotli
    Linker Target: Wasm

    // Development Settings
    Development Build: False (Production)
    Script Debugging: False (Production)
    Deep Profiling: False (Production)
}
```

### Build Profiles

```json
{
  "buildProfiles": {
    "development": {
      "name": "Windgap Academy - Development",
      "compressionFormat": "Gzip",
      "memorySize": 256,
      "developmentBuild": true,
      "scriptDebugging": true,
      "outputPath": "builds/development/"
    },
    "staging": {
      "name": "Windgap Academy - Staging",
      "compressionFormat": "Brotli",
      "memorySize": 512,
      "developmentBuild": false,
      "scriptDebugging": false,
      "outputPath": "builds/staging/"
    },
    "production": {
      "name": "Windgap Academy - Production",
      "compressionFormat": "Brotli",
      "memorySize": 512,
      "developmentBuild": false,
      "scriptDebugging": false,
      "outputPath": "builds/production/"
    }
  }
}
```

## 🔧 AUTOMATED BUILD SYSTEM

### Unity Build Script

```csharp
using UnityEngine;
using UnityEditor;
using UnityEditor.Build.Reporting;
using System.IO;

public class WindgapBuildPipeline
{
    private static readonly string[] scenes = {
        "Assets/_Project/Scenes/Main/MainMenu.unity",
        "Assets/_Project/Scenes/Main/Academy.unity",
        "Assets/_Project/Scenes/Lessons/MathClassroom.unity",
        "Assets/_Project/Scenes/Lessons/LiteracyLibrary.unity",
        "Assets/_Project/Scenes/Simulations/Kitchen.unity",
        "Assets/_Project/Scenes/Simulations/Supermarket.unity"
    };

    [MenuItem("Windgap/Build/Development")]
    public static void BuildDevelopment()
    {
        BuildGame(BuildProfile.Development);
    }

    [MenuItem("Windgap/Build/Staging")]
    public static void BuildStaging()
    {
        BuildGame(BuildProfile.Staging);
    }

    [MenuItem("Windgap/Build/Production")]
    public static void BuildProduction()
    {
        BuildGame(BuildProfile.Production);
    }

    private static void BuildGame(BuildProfile profile)
    {
        // Configure build settings
        ConfigureBuildSettings(profile);

        // Set up build options
        BuildPlayerOptions buildOptions = new BuildPlayerOptions
        {
            scenes = scenes,
            locationPathName = profile.outputPath,
            target = BuildTarget.WebGL,
            options = GetBuildOptions(profile)
        };

        // Execute build
        Debug.Log($"Starting {profile.name} build...");
        BuildReport report = BuildPipeline.BuildPlayer(buildOptions);

        // Handle build result
        HandleBuildResult(report, profile);
    }

    private static void ConfigureBuildSettings(BuildProfile profile)
    {
        // Player Settings
        PlayerSettings.productName = profile.name;
        PlayerSettings.companyName = "Windgap Academy";
        PlayerSettings.bundleVersion = GetVersionNumber();

        // WebGL Settings
        PlayerSettings.WebGL.compressionFormat = profile.compressionFormat;
        PlayerSettings.WebGL.memorySize = profile.memorySize;
        PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.None;
        PlayerSettings.WebGL.nameFilesAsHashes = true;
        PlayerSettings.WebGL.dataCaching = true;

        // Quality Settings
        ConfigureQualitySettings(profile);

        // Graphics Settings
        ConfigureGraphicsSettings(profile);
    }

    private static BuildOptions GetBuildOptions(BuildProfile profile)
    {
        BuildOptions options = BuildOptions.None;

        if (profile.developmentBuild)
        {
            options |= BuildOptions.Development;
        }

        if (profile.scriptDebugging)
        {
            options |= BuildOptions.AllowDebugging;
        }

        return options;
    }

    private static void HandleBuildResult(BuildReport report, BuildProfile profile)
    {
        if (report.summary.result == BuildResult.Succeeded)
        {
            Debug.Log($"Build succeeded: {report.summary.outputPath}");
            Debug.Log($"Build size: {report.summary.totalSize} bytes");
            Debug.Log($"Build time: {report.summary.totalTime}");

            // Post-build processing
            PostBuildProcessing(profile, report.summary.outputPath);
        }
        else
        {
            Debug.LogError($"Build failed with {report.summary.totalErrors} errors");

            // Log build errors
            foreach (var step in report.steps)
            {
                foreach (var message in step.messages)
                {
                    if (message.type == LogType.Error)
                    {
                        Debug.LogError($"Build Error: {message.content}");
                    }
                }
            }
        }
    }

    private static void PostBuildProcessing(BuildProfile profile, string outputPath)
    {
        // Create deployment package
        CreateDeploymentPackage(profile, outputPath);

        // Generate build manifest
        GenerateBuildManifest(profile, outputPath);

        // Copy to deployment directory
        CopyToDeploymentDirectory(profile, outputPath);

        // Update React integration files
        UpdateReactIntegrationFiles(profile, outputPath);
    }
}
```

### Continuous Integration Pipeline

```yaml
# .github/workflows/unity-build.yml
name: Unity WebGL Build Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3
        with:
          lfs: true

      - name: Cache Unity Library
        uses: actions/cache@v3
        with:
          path: Library
          key: Library-${{ hashFiles('Assets/**', 'Packages/**', 'ProjectSettings/**') }}
          restore-keys: Library-

      - name: Build Unity Project
        uses: game-ci/unity-builder@v2
        env:
          UNITY_LICENSE: ${{ secrets.UNITY_LICENSE }}
        with:
          targetPlatform: WebGL
          buildMethod: WindgapBuildPipeline.BuildProduction

      - name: Upload Build Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: windgap-academy-webgl
          path: builds/production/

      - name: Deploy to Staging
        if: github.ref == 'refs/heads/develop'
        run: |
          # Deploy to staging environment
          npm run deploy:staging

      - name: Deploy to Production
        if: github.ref == 'refs/heads/main'
        run: |
          # Deploy to production environment
          npm run deploy:production
```

## 📦 DEPLOYMENT INTEGRATION

### React Integration Setup

```typescript
// scripts/unity-integration.ts
import fs from "fs";
import path from "path";

interface UnityBuildConfig {
  buildPath: string;
  outputPath: string;
  version: string;
  profile: "development" | "staging" | "production";
}

export class UnityIntegration {
  static async integrateUnityBuild(config: UnityBuildConfig) {
    console.log(`Integrating Unity build: ${config.version}`);

    // Copy Unity build files to React public directory
    await this.copyUnityFiles(config);

    // Update Unity loader configuration
    await this.updateUnityLoader(config);

    // Generate Unity component configuration
    await this.generateUnityConfig(config);

    // Update build manifest
    await this.updateBuildManifest(config);

    console.log("Unity integration complete");
  }

  private static async copyUnityFiles(config: UnityBuildConfig) {
    const unityBuildPath = config.buildPath;
    const publicUnityPath = path.join(config.outputPath, "unity-builds");

    // Ensure directory exists
    if (!fs.existsSync(publicUnityPath)) {
      fs.mkdirSync(publicUnityPath, { recursive: true });
    }

    // Copy Unity WebGL files
    const filesToCopy = [
      "Build/windgap-academy.loader.js",
      "Build/windgap-academy.framework.js",
      "Build/windgap-academy.data",
      "Build/windgap-academy.wasm",
      "TemplateData/style.css",
    ];

    for (const file of filesToCopy) {
      const sourcePath = path.join(unityBuildPath, file);
      const destPath = path.join(publicUnityPath, file);

      if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`Copied: ${file}`);
      }
    }
  }

  private static async updateUnityLoader(config: UnityBuildConfig) {
    const loaderConfig = {
      dataUrl: `/unity-builds/Build/windgap-academy.data`,
      frameworkUrl: `/unity-builds/Build/windgap-academy.framework.js`,
      codeUrl: `/unity-builds/Build/windgap-academy.wasm`,
      streamingAssetsUrl: "StreamingAssets",
      companyName: "Windgap Academy",
      productName: "Windgap Academy",
      productVersion: config.version,
      showBanner: config.profile !== "production",
      matchWebGLToCanvasSize: true,
      devicePixelRatio: 1,
    };

    const configPath = path.join(config.outputPath, "unity-config.json");
    fs.writeFileSync(configPath, JSON.stringify(loaderConfig, null, 2));
  }
}
```

### Package.json Scripts

```json
{
  "scripts": {
    "unity:build": "node scripts/unity-build.js",
    "unity:integrate": "node scripts/unity-integration.js",
    "unity:deploy": "npm run unity:build && npm run unity:integrate",
    "build:with-unity": "npm run unity:deploy && npm run build",
    "deploy:staging": "npm run build:with-unity && vercel --target staging",
    "deploy:production": "npm run build:with-unity && vercel --prod"
  }
}
```

## 🔄 VERSION MANAGEMENT

### Unity Build Versioning

```csharp
// Editor/BuildVersionManager.cs
using UnityEngine;
using UnityEditor;
using System;
using System.IO;

public class BuildVersionManager
{
    private static readonly string versionFilePath = "Assets/_Project/version.json";

    [MenuItem("Windgap/Version/Increment Patch")]
    public static void IncrementPatch()
    {
        var version = GetCurrentVersion();
        version.patch++;
        SaveVersion(version);
        UpdatePlayerSettings(version);
    }

    [MenuItem("Windgap/Version/Increment Minor")]
    public static void IncrementMinor()
    {
        var version = GetCurrentVersion();
        version.minor++;
        version.patch = 0;
        SaveVersion(version);
        UpdatePlayerSettings(version);
    }

    [MenuItem("Windgap/Version/Increment Major")]
    public static void IncrementMajor()
    {
        var version = GetCurrentVersion();
        version.major++;
        version.minor = 0;
        version.patch = 0;
        SaveVersion(version);
        UpdatePlayerSettings(version);
    }

    private static BuildVersion GetCurrentVersion()
    {
        if (File.Exists(versionFilePath))
        {
            string json = File.ReadAllText(versionFilePath);
            return JsonUtility.FromJson<BuildVersion>(json);
        }

        return new BuildVersion { major = 1, minor = 0, patch = 0 };
    }

    private static void SaveVersion(BuildVersion version)
    {
        version.buildNumber++;
        version.buildDate = DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm:ss UTC");

        string json = JsonUtility.ToJson(version, true);
        File.WriteAllText(versionFilePath, json);

        AssetDatabase.Refresh();
    }

    private static void UpdatePlayerSettings(BuildVersion version)
    {
        PlayerSettings.bundleVersion = version.ToString();
        PlayerSettings.macOS.buildNumber = version.buildNumber.ToString();
    }
}

[System.Serializable]
public class BuildVersion
{
    public int major;
    public int minor;
    public int patch;
    public int buildNumber;
    public string buildDate;

    public override string ToString()
    {
        return $"{major}.{minor}.{patch}";
    }

    public string GetFullVersion()
    {
        return $"{major}.{minor}.{patch}.{buildNumber}";
    }
}
```

## 📊 BUILD MONITORING & ANALYTICS

### Build Performance Tracking

```csharp
// Editor/BuildAnalytics.cs
using UnityEngine;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using System.Collections.Generic;

public class BuildAnalytics : IPreprocessBuildWithReport, IPostprocessBuildWithReport
{
    public int callbackOrder => 0;

    private System.DateTime buildStartTime;

    public void OnPreprocessBuild(BuildReport report)
    {
        buildStartTime = System.DateTime.UtcNow;
        Debug.Log($"Build started at: {buildStartTime}");
    }

    public void OnPostprocessBuild(BuildReport report)
    {
        var buildEndTime = System.DateTime.UtcNow;
        var buildDuration = buildEndTime - buildStartTime;

        var analytics = new BuildAnalyticsData
        {
            buildResult = report.summary.result.ToString(),
            buildDuration = buildDuration.TotalSeconds,
            buildSize = report.summary.totalSize,
            platform = report.summary.platform.ToString(),
            unityVersion = Application.unityVersion,
            buildTime = buildEndTime.ToString("yyyy-MM-dd HH:mm:ss UTC")
        };

        // Log analytics
        LogBuildAnalytics(analytics);

        // Send to analytics service (if configured)
        SendToAnalyticsService(analytics);
    }

    private void LogBuildAnalytics(BuildAnalyticsData data)
    {
        Debug.Log($"Build Analytics:");
        Debug.Log($"  Result: {data.buildResult}");
        Debug.Log($"  Duration: {data.buildDuration:F2} seconds");
        Debug.Log($"  Size: {data.buildSize / (1024 * 1024):F2} MB");
        Debug.Log($"  Platform: {data.platform}");
    }
}
```

## 🚀 DEPLOYMENT AUTOMATION

### Vercel Integration

```javascript
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/unity-builds/(.*)",
      "headers": {
        "Cross-Origin-Embedder-Policy": "require-corp",
        "Cross-Origin-Opener-Policy": "same-origin"
      },
      "dest": "/unity-builds/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "functions": {
    "app/api/**/*.js": {
      "runtime": "nodejs18.x"
    }
  }
}
```

This comprehensive Unity animation system provides everything needed for professional 3D educational experiences in Windgap Academy! 🎓✨
