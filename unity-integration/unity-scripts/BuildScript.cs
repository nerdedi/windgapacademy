using UnityEngine;
using UnityEditor;
using UnityEditor.Build.Reporting;
using System.IO;

/// <summary>
/// Unity Build Script for WebGL optimization
/// Optimized for React integration and web performance
/// </summary>
public class BuildScript
{
    // Build paths
    private static readonly string BUILD_OUTPUT_PATH = Path.Combine(Application.dataPath, "../Builds/WebGL");
    private static readonly string REACT_PUBLIC_PATH = Path.Combine(Application.dataPath, "../../../public/unity");

    [MenuItem("Build/Build WebGL Optimized")]
    public static void BuildWebGL()
    {
        Debug.Log("🎮 Starting optimized WebGL build for React integration...");

        // Configure WebGL build settings
        ConfigureWebGLSettings();

        // Configure Player settings for optimization
        ConfigurePlayerSettings();

        // Set build options
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
        {
            scenes = GetScenePaths(),
            locationPathName = BUILD_OUTPUT_PATH,
            target = BuildTarget.WebGL,
            options = BuildOptions.None
        };

        // Perform the build
        BuildReport report = BuildPipeline.BuildPlayer(buildPlayerOptions);
        BuildSummary summary = report.summary;

        if (summary.result == BuildResult.Succeeded)
        {
            Debug.Log($"✅ Build succeeded: {summary.totalSize} bytes");
            Debug.Log($"📦 Build output: {BUILD_OUTPUT_PATH}");

            // Copy to React public directory
            CopyToReactPublic();

            // Generate integration files
            GenerateIntegrationFiles();
        }
        else if (summary.result == BuildResult.Failed)
        {
            Debug.LogError("❌ Build failed");
        }
    }

    private static void ConfigureWebGLSettings()
    {
        Debug.Log("⚙️  Configuring WebGL settings...");

        // WebGL specific settings
        PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Brotli;
        PlayerSettings.WebGL.memorySize = 512; // MB
        PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.None;
        PlayerSettings.WebGL.nameFilesAsHashes = true;
        PlayerSettings.WebGL.dataCaching = true;
        PlayerSettings.WebGL.debugSymbols = false;
        PlayerSettings.WebGL.emscriptenArgs = "-s WASM=1 -s ALLOW_MEMORY_GROWTH=1";

        // Template settings for React integration
        PlayerSettings.WebGL.template = "PROJECT:React-Integration";

        Debug.Log("✅ WebGL settings configured for optimal performance");
    }

    private static void ConfigurePlayerSettings()
    {
        Debug.Log("⚙️  Configuring Player settings...");

        // General settings
        PlayerSettings.productName = "Windgap Academy WebGL";
        PlayerSettings.companyName = "Windgap Academy";
        PlayerSettings.bundleVersion = System.DateTime.Now.ToString("yyyy.MM.dd.HHmm");

        // Performance optimizations
        PlayerSettings.stripEngineCode = true;
        PlayerSettings.managedStrippingLevel = ManagedStrippingLevel.High;
        PlayerSettings.scriptingBackend = ScriptingImplementation.IL2CPP;
        PlayerSettings.ApiCompatibilityLevel.WebGL = ApiCompatibilityLevel.NET_Standard_2_0;

        // Graphics settings
        PlayerSettings.colorSpace = ColorSpace.Linear;
        PlayerSettings.gpuSkinning = false; // Better for WebGL

        // Audio settings
        AudioSettings.GetConfiguration().dspBufferSize = 1024; // Larger buffer for web

        Debug.Log("✅ Player settings optimized for WebGL and React integration");
    }

    private static string[] GetScenePaths()
    {
        string[] scenes = new string[EditorBuildSettings.scenes.Length];
        for (int i = 0; i < scenes.Length; i++)
        {
            scenes[i] = EditorBuildSettings.scenes[i].path;
        }
        return scenes;
    }

    private static void CopyToReactPublic()
    {
        Debug.Log("📋 Copying build files to React public directory...");

        try
        {
            if (Directory.Exists(REACT_PUBLIC_PATH))
            {
                Directory.Delete(REACT_PUBLIC_PATH, true);
            }

            Directory.CreateDirectory(REACT_PUBLIC_PATH);

            // Copy all build files
            DirectoryCopy(BUILD_OUTPUT_PATH, REACT_PUBLIC_PATH, true);

            Debug.Log($"✅ Build files copied to {REACT_PUBLIC_PATH}");
        }
        catch (System.Exception e)
        {
            Debug.LogError($"❌ Failed to copy build files: {e.Message}");
        }
    }

    private static void GenerateIntegrationFiles()
    {
        Debug.Log("📄 Generating React integration files...");

        // Generate build manifest for React
        string buildManifest = $@"{{
  ""buildTime"": ""{System.DateTime.UtcNow:yyyy-MM-ddTHH:mm:ssZ}"",
  ""version"": ""{PlayerSettings.bundleVersion}"",
  ""compressionFormat"": ""Brotli"",
  ""memorySize"": 512,
  ""files"": {{
    ""loader"": ""Build.loader.js"",
    ""framework"": ""Build.framework.js"",
    ""wasm"": ""Build.wasm"",
    ""data"": ""Build.data""
  }},
  ""integration"": ""react"",
  ""optimized"": true
}}";

        File.WriteAllText(Path.Combine(REACT_PUBLIC_PATH, "build-manifest.json"), buildManifest);

        // Generate TypeScript definitions for Unity communication
        string tsDefinitions = @"// Unity WebGL Integration Types for React
export interface UnityBuildManifest {
  buildTime: string;
  version: string;
  compressionFormat: string;
  memorySize: number;
  files: {
    loader: string;
    framework: string;
    wasm: string;
    data: string;
  };
  integration: 'react';
  optimized: boolean;
}

export interface UnityInstance {
  SendMessage(objectName: string, methodName: string, value?: string | number): void;
  SetFullscreen(fullscreen: number): void;
  Quit(): Promise<void>;
}

export interface UnityContextEvent {
  type: 'ANIMATION_COMPLETE' | 'STORY_NODE' | 'STORY_COMPLETE' | 'CHARACTER_CHANGED' | 'UNITY_ERROR';
  data: any;
}
";

        File.WriteAllText(Path.Combine(Path.GetDirectoryName(REACT_PUBLIC_PATH), "unity-types.d.ts"), tsDefinitions);

        Debug.Log("✅ Integration files generated successfully");
    }

    private static void DirectoryCopy(string sourceDirName, string destDirName, bool copySubDirs)
    {
        DirectoryInfo dir = new DirectoryInfo(sourceDirName);
        DirectoryInfo[] dirs = dir.GetDirectories();

        Directory.CreateDirectory(destDirName);

        FileInfo[] files = dir.GetFiles();
        foreach (FileInfo file in files)
        {
            string tempPath = Path.Combine(destDirName, file.Name);
            file.CopyTo(tempPath, true);
        }

        if (copySubDirs)
        {
            foreach (DirectoryInfo subdir in dirs)
            {
                string tempPath = Path.Combine(destDirName, subdir.Name);
                DirectoryCopy(subdir.FullName, tempPath, copySubDirs);
            }
        }
    }
}
