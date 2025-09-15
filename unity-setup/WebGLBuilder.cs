using UnityEngine;
using UnityEditor;
using System.IO;

public class WebGLBuilder
{
    [MenuItem("Build/WebGL")]
    public static void Build()
    {
        // Set the build target to WebGL
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions();
        buildPlayerOptions.scenes = GetScenes();
        buildPlayerOptions.target = BuildTarget.WebGL;
        buildPlayerOptions.options = BuildOptions.None;
        
        // Get custom build path from command line or use default
        string buildPath = GetCommandLineArg("-customBuildPath");
        if (string.IsNullOrEmpty(buildPath))
        {
            buildPath = "Builds/WebGL";
        }
        buildPlayerOptions.locationPathName = buildPath;
        
        // Build the project
        BuildPipeline.BuildPlayer(buildPlayerOptions);
    }
    
    private static string[] GetScenes()
    {
        // Get all enabled scenes from build settings
        EditorBuildSettingsScene[] scenes = EditorBuildSettings.scenes;
        string[] scenePaths = new string[scenes.Length];
        
        for (int i = 0; i < scenes.Length; i++)
        {
            if (scenes[i].enabled)
            {
                scenePaths[i] = scenes[i].path;
            }
        }
        
        // If no scenes are enabled, include the active scene
        if (scenePaths.Length == 0)
        {
            scenePaths = new string[] { EditorSceneManager.GetActiveScene().path };
        }
        
        return scenePaths;
    }
    
    private static string GetCommandLineArg(string name)
    {
        string[] args = System.Environment.GetCommandLineArgs();
        for (int i = 0; i < args.Length; i++)
        {
            if (args[i] == name && i < args.Length - 1)
            {
                return args[i + 1];
            }
        }
        return null;
    }
}