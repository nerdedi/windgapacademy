using System;
using System.Collections;
using System.Collections.Generic;

namespace UnityEngine
{
    // Bare minimum UnityEngine classes to allow syntax checking
    public class MonoBehaviour {}
    public class GameObject {}
    public class Transform {}
    public class Component {}
    public class Object {}
    public class Animator {}
    public class AnimationClip {}
    public class Coroutine {}
    public class SkinnedMeshRenderer 
    {
        public UnityEngine.Mesh sharedMesh;
        public float GetBlendShapeWeight(int index) => 0f;
        public void SetBlendShapeWeight(int index, float value) {}
    }
    public class Mesh
    {
        public int blendShapeCount;
        public string GetBlendShapeName(int index) => "";
        public int GetBlendShapeIndex(string name) => -1;
    }
    public class Time
    {
        public static float deltaTime = 0.016f;
    }
    public class Mathf
    {
        public static float Clamp01(float value) => value;
        public static float Lerp(float a, float b, float t) => a + (b - a) * t;
    }
    public class Debug
    {
        public static void Log(object message) {}
        public static void LogWarning(object message) {}
        public static void LogError(object message) {}
    }
    public class WaitForSeconds
    {
        public WaitForSeconds(float seconds) {}
    }

    // Attribute classes
    public class HeaderAttribute : Attribute
    {
        public HeaderAttribute(string header) {}
    }
}

namespace UnityEditor
{
    public class EditorApplication
    {
        public static bool isPlaying;
        public static bool isPaused;
    }
    public class AssetDatabase
    {
        public static void Refresh() {}
    }
}