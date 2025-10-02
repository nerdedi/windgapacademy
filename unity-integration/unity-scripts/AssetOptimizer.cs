using UnityEngine;
using UnityEditor;
using UnityEditor.Build;
using UnityEditor.Build.Reporting;
using System.IO;
using System.Collections.Generic;

namespace WindgapAcademy.Unity.Optimization
{
    /// <summary>
    /// Unity Asset Optimization and Performance Configuration
    /// Automatically optimizes assets for WebGL deployment
    /// </summary>
    public class AssetOptimizer : IPreprocessBuildWithReport, IPostprocessBuildWithReport
    {
        public int callbackOrder => 0;

        // Optimization settings
        private static readonly Dictionary<string, TextureImporterFormat> TEXTURE_FORMATS = new Dictionary<string, TextureImporterFormat>
        {
            { "default", TextureImporterFormat.DXT5 },
            { "ui", TextureImporterFormat.DXT5 },
            { "character", TextureImporterFormat.DXT5 },
            { "environment", TextureImporterFormat.DXT1 },
            { "normal", TextureImporterFormat.DXT5 }
        };

        private static readonly Dictionary<string, int> TEXTURE_MAX_SIZES = new Dictionary<string, int>
        {
            { "ui", 1024 },
            { "character", 2048 },
            { "environment", 1024 },
            { "background", 512 },
            { "icon", 256 }
        };

        [MenuItem("Windgap/Optimize Assets for WebGL")]
        public static void OptimizeAssetsForWebGL()
        {
            Debug.Log("🔧 Starting WebGL asset optimization...");

            OptimizeTextures();
            OptimizeAudioClips();
            OptimizeMeshes();
            OptimizeMaterials();
            OptimizeAnimations();
            ConfigureQualitySettings();

            AssetDatabase.SaveAssets();
            AssetDatabase.Refresh();

            Debug.Log("✅ WebGL asset optimization completed!");
        }

        public void OnPreprocessBuild(BuildReport report)
        {
            if (report.summary.platform == BuildTarget.WebGL)
            {
                Debug.Log("🎯 Preprocessing WebGL build - applying optimizations...");
                OptimizeAssetsForWebGL();
                ConfigureWebGLSpecificSettings();
            }
        }

        public void OnPostprocessBuild(BuildReport report)
        {
            if (report.summary.platform == BuildTarget.WebGL)
            {
                Debug.Log("📊 Postprocessing WebGL build - generating optimization report...");
                GenerateOptimizationReport(report);
            }
        }

        private static void OptimizeTextures()
        {
            Debug.Log("🖼️  Optimizing textures...");

            string[] textureGuids = AssetDatabase.FindAssets("t:Texture2D");
            int optimizedCount = 0;

            foreach (string guid in textureGuids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                TextureImporter importer = AssetImporter.GetAtPath(path) as TextureImporter;

                if (importer == null) continue;

                bool changed = false;

                // Get platform settings for WebGL
                var webglSettings = importer.GetPlatformTextureSettings("WebGL");
                if (webglSettings == null)
                {
                    webglSettings = new TextureImporterPlatformSettings();
                    webglSettings.name = "WebGL";
                    webglSettings.overridden = true;
                    changed = true;
                }

                // Determine texture category and optimize accordingly
                string category = DetermineTextureCategory(path);

                // Set compression format
                if (TEXTURE_FORMATS.ContainsKey(category))
                {
                    webglSettings.format = TEXTURE_FORMATS[category];
                    changed = true;
                }

                // Set max size
                if (TEXTURE_MAX_SIZES.ContainsKey(category))
                {
                    int maxSize = TEXTURE_MAX_SIZES[category];
                    if (webglSettings.maxTextureSize > maxSize)
                    {
                        webglSettings.maxTextureSize = maxSize;
                        changed = true;
                    }
                }

                // Enable compression
                webglSettings.compressionQuality = 50; // Balance between size and quality

                // Disable mipmaps for UI textures
                if (category == "ui" || category == "icon")
                {
                    importer.mipmapEnabled = false;
                    changed = true;
                }

                if (changed)
                {
                    importer.SetPlatformTextureSettings(webglSettings);
                    importer.SaveAndReimport();
                    optimizedCount++;
                }
            }

            Debug.Log($"✅ Optimized {optimizedCount} textures for WebGL");
        }

        private static void OptimizeAudioClips()
        {
            Debug.Log("🔊 Optimizing audio clips...");

            string[] audioGuids = AssetDatabase.FindAssets("t:AudioClip");
            int optimizedCount = 0;

            foreach (string guid in audioGuids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                AudioImporter importer = AssetImporter.GetAtPath(path) as AudioImporter;

                if (importer == null) continue;

                bool changed = false;
                var webglSettings = importer.GetOverrideSample("WebGL");

                if (webglSettings.overrideSample == false)
                {
                    webglSettings.overrideSample = true;
                    changed = true;
                }

                // Optimize based on audio type
                if (path.Contains("music") || path.Contains("background"))
                {
                    // Background music - compressed
                    webglSettings.compressionFormat = AudioCompressionFormat.Vorbis;
                    webglSettings.quality = 0.5f; // Lower quality for background music
                    webglSettings.sampleRateSetting = AudioSampleRateSetting.OptimizeSize;
                    changed = true;
                }
                else if (path.Contains("sfx") || path.Contains("sound"))
                {
                    // Sound effects - uncompressed for low latency
                    webglSettings.compressionFormat = AudioCompressionFormat.PCM;
                    webglSettings.loadType = AudioClipLoadType.DecompressOnLoad;
                    webglSettings.sampleRateSetting = AudioSampleRateSetting.OverrideSampleRate;
                    webglSettings.sampleRateOverride = 22050; // Reduce sample rate
                    changed = true;
                }
                else if (path.Contains("voice") || path.Contains("narration"))
                {
                    // Voice - balanced compression
                    webglSettings.compressionFormat = AudioCompressionFormat.Vorbis;
                    webglSettings.quality = 0.7f;
                    webglSettings.sampleRateSetting = AudioSampleRateSetting.OverrideSampleRate;
                    webglSettings.sampleRateOverride = 22050;
                    changed = true;
                }

                if (changed)
                {
                    importer.SetOverrideSample("WebGL", webglSettings);
                    importer.SaveAndReimport();
                    optimizedCount++;
                }
            }

            Debug.Log($"✅ Optimized {optimizedCount} audio clips for WebGL");
        }

        private static void OptimizeMeshes()
        {
            Debug.Log("🎯 Optimizing meshes...");

            string[] meshGuids = AssetDatabase.FindAssets("t:Mesh");
            int optimizedCount = 0;

            foreach (string guid in meshGuids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                ModelImporter importer = AssetImporter.GetAtPath(path) as ModelImporter;

                if (importer == null) continue;

                bool changed = false;

                // Optimize mesh settings
                if (importer.optimizeMeshPolygons == false)
                {
                    importer.optimizeMeshPolygons = true;
                    changed = true;
                }

                if (importer.optimizeMeshVertices == false)
                {
                    importer.optimizeMeshVertices = true;
                    changed = true;
                }

                // Reduce precision for WebGL
                if (importer.indexFormat != ModelImporterIndexFormat.UInt16)
                {
                    importer.indexFormat = ModelImporterIndexFormat.UInt16;
                    changed = true;
                }

                // Disable unnecessary features
                if (importer.importBlendShapes)
                {
                    importer.importBlendShapes = false;
                    changed = true;
                }

                if (importer.importVisibility)
                {
                    importer.importVisibility = false;
                    changed = true;
                }

                if (changed)
                {
                    importer.SaveAndReimport();
                    optimizedCount++;
                }
            }

            Debug.Log($"✅ Optimized {optimizedCount} meshes for WebGL");
        }

        private static void OptimizeMaterials()
        {
            Debug.Log("🎨 Optimizing materials...");

            string[] materialGuids = AssetDatabase.FindAssets("t:Material");
            int optimizedCount = 0;

            foreach (string guid in materialGuids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                Material material = AssetDatabase.LoadAssetAtPath<Material>(path);

                if (material == null) continue;

                bool changed = false;

                // Switch to mobile-friendly shaders
                if (material.shader.name.Contains("Standard"))
                {
                    Shader mobileShader = Shader.Find("Mobile/Diffuse");
                    if (mobileShader != null)
                    {
                        material.shader = mobileShader;
                        changed = true;
                    }
                }

                // Disable expensive features
                if (material.HasProperty("_Emission"))
                {
                    material.DisableKeyword("_EMISSION");
                    changed = true;
                }

                if (changed)
                {
                    EditorUtility.SetDirty(material);
                    optimizedCount++;
                }
            }

            Debug.Log($"✅ Optimized {optimizedCount} materials for WebGL");
        }

        private static void OptimizeAnimations()
        {
            Debug.Log("🎬 Optimizing animations...");

            string[] animationGuids = AssetDatabase.FindAssets("t:AnimationClip");
            int optimizedCount = 0;

            foreach (string guid in animationGuids)
            {
                string path = AssetDatabase.GUIDToAssetPath(guid);
                ModelImporter importer = AssetImporter.GetAtPath(path) as ModelImporter;

                if (importer == null) continue;

                bool changed = false;

                // Reduce animation precision
                if (importer.animationCompression != ModelImporterAnimationCompression.Optimal)
                {
                    importer.animationCompression = ModelImporterAnimationCompression.Optimal;
                    changed = true;
                }

                // Set compression error threshold
                if (importer.animationRotationError < 0.5f)
                {
                    importer.animationRotationError = 0.5f;
                    changed = true;
                }

                if (importer.animationPositionError < 0.5f)
                {
                    importer.animationPositionError = 0.5f;
                    changed = true;
                }

                if (importer.animationScaleError < 0.5f)
                {
                    importer.animationScaleError = 0.5f;
                    changed = true;
                }

                if (changed)
                {
                    importer.SaveAndReimport();
                    optimizedCount++;
                }
            }

            Debug.Log($"✅ Optimized {optimizedCount} animation clips for WebGL");
        }

        private static void ConfigureQualitySettings()
        {
            Debug.Log("⚙️  Configuring quality settings for WebGL...");

            // Get or create WebGL quality settings
            QualitySettings.SetQualityLevel(2); // Medium quality as baseline

            // Optimize rendering settings for WebGL
            QualitySettings.pixelLightCount = 1;
            QualitySettings.shadows = ShadowQuality.Disable;
            QualitySettings.shadowResolution = ShadowResolution.Low;
            QualitySettings.shadowDistance = 20f;
            QualitySettings.antiAliasing = 0; // Disable MSAA for WebGL
            QualitySettings.anisotropicFiltering = AnisotropicFiltering.Disable;
            QualitySettings.realtimeReflectionProbes = false;
            QualitySettings.billboardsFaceCameraPosition = false;

            // Memory and performance optimizations
            QualitySettings.maxQueuedFrames = 1;
            QualitySettings.vSyncCount = 0; // Let browser handle VSync

            Debug.Log("✅ Quality settings configured for WebGL optimization");
        }

        private static void ConfigureWebGLSpecificSettings()
        {
            Debug.Log("🌐 Configuring WebGL-specific settings...");

            // Configure WebGL player settings
            PlayerSettings.WebGL.compressionFormat = WebGLCompressionFormat.Brotli;
            PlayerSettings.WebGL.memorySize = 512;
            PlayerSettings.WebGL.exceptionSupport = WebGLExceptionSupport.None;
            PlayerSettings.WebGL.nameFilesAsHashes = true;
            PlayerSettings.WebGL.dataCaching = true;
            PlayerSettings.WebGL.debugSymbols = false;

            // Graphics settings for WebGL
            PlayerSettings.colorSpace = ColorSpace.Gamma; // Better performance on WebGL
            PlayerSettings.gpuSkinning = false; // Not supported on WebGL
            PlayerSettings.graphicsJobs = false; // Not supported on WebGL

            // Audio settings
            AudioSettings.dspBufferSize = 1024; // Larger buffer for web

            Debug.Log("✅ WebGL-specific settings configured");
        }

        private static void GenerateOptimizationReport(BuildReport report)
        {
            string reportPath = Path.Combine(Path.GetDirectoryName(report.summary.outputPath), "optimization-report.json");

            var reportData = new
            {
                buildTime = report.summary.buildStartedAt.ToString("yyyy-MM-ddTHH:mm:ssZ"),
                buildDuration = report.summary.totalTime.TotalSeconds,
                buildSize = report.summary.totalSize,
                platform = report.summary.platform.ToString(),
                optimizations = new
                {
                    texturesOptimized = true,
                    audioOptimized = true,
                    meshesOptimized = true,
                    materialsOptimized = true,
                    animationsOptimized = true,
                    qualitySettingsConfigured = true
                },
                settings = new
                {
                    compressionFormat = PlayerSettings.WebGL.compressionFormat.ToString(),
                    memorySize = PlayerSettings.WebGL.memorySize,
                    colorSpace = PlayerSettings.colorSpace.ToString(),
                    antiAliasing = QualitySettings.antiAliasing,
                    shadows = QualitySettings.shadows.ToString()
                }
            };

            string json = JsonUtility.ToJson(reportData, true);
            File.WriteAllText(reportPath, json);

            Debug.Log($"📊 Optimization report generated: {reportPath}");
        }

        private static string DetermineTextureCategory(string path)
        {
            string lowerPath = path.ToLower();

            if (lowerPath.Contains("ui") || lowerPath.Contains("gui"))
                return "ui";
            if (lowerPath.Contains("character") || lowerPath.Contains("player"))
                return "character";
            if (lowerPath.Contains("environment") || lowerPath.Contains("world"))
                return "environment";
            if (lowerPath.Contains("background") || lowerPath.Contains("sky"))
                return "background";
            if (lowerPath.Contains("icon") || lowerPath.Contains("button"))
                return "icon";
            if (lowerPath.Contains("normal"))
                return "normal";

            return "default";
        }
    }
}
