using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using WindgapAcademy.Portals;

namespace WindgapAcademy.Tests.Accessibility
{
    public class PortalAccessibilityTests
    {
        private GameObject portalGameObject;
        private Portal portal;
        private GameObject playerGameObject;
        
        [UnitySetUp]
        public IEnumerator Setup()
        {
            // Create portal with default settings
            portalGameObject = new GameObject("AccessibilityTestPortal");
            portal = portalGameObject.AddComponent<Portal>();
            portal.destinationRealm = "AccessibilityTestRealm";
            portal.destinationPosition = new Vector3(15, 0, 15);
            portal.activationRadius = 2.0f;
            portal.isActive = true;
            
            // Create player
            playerGameObject = new GameObject("AccessibilityTestPlayer");
            playerGameObject.tag = "Player";
            playerGameObject.transform.position = new Vector3(0, 0, 0);
            
            // Wait for Awake to complete
            yield return null;
        }
        
        [UnityTearDown]
        public IEnumerator TearDown()
        {
            Object.Destroy(portalGameObject);
            Object.Destroy(playerGameObject);
            yield return null;
        }
        
        [UnityTest]
        public IEnumerator Portal_HighContrastMode_IncreasesVisualFeedback()
        {
            // Get visual components
            Light portalLight = portalGameObject.GetComponentInChildren<Light>();
            ParticleSystem particles = portalGameObject.GetComponentInChildren<ParticleSystem>();
            Renderer renderer = portalGameObject.GetComponentInChildren<Renderer>();
            
            // Record initial values
            float initialLightIntensity = portalLight.intensity;
            float initialEmissionRate = particles.emission.rateOverTime.constant;
            Color initialEmissionColor = renderer.material.GetColor("_EmissionColor");
            
            // Enable high contrast mode
            portal.SetAccessibilityOptions(true, true, true, false);
            
            // Verify visual components have increased intensity/visibility
            Assert.Greater(portalLight.intensity, initialLightIntensity);
            Assert.Greater(particles.emission.rateOverTime.constant, initialEmissionRate);
            
            // We would check emission color intensity too, but we need to wait for material update
            yield return null;
            Color newEmissionColor = renderer.material.GetColor("_EmissionColor");
            Assert.Greater(newEmissionColor.maxColorComponent, initialEmissionColor.maxColorComponent);
        }
        
        [UnityTest]
        public IEnumerator Portal_LargeInteractionZone_DoublesTriggerRadius()
        {
            // Position player just outside normal interaction radius
            float testDistance = portal.activationRadius * 1.5f; // 1.5x normal radius
            playerGameObject.transform.position = portalGameObject.transform.position + new Vector3(testDistance, 0, 0);
            
            // Wait a moment
            yield return new WaitForSeconds(0.5f);
            
            // Verify player is not teleported with normal settings
            Assert.AreNotEqual(portal.destinationPosition, playerGameObject.transform.position);
            
            // Reset player position
            playerGameObject.transform.position = portalGameObject.transform.position + new Vector3(testDistance, 0, 0);
            
            // Enable large interaction zone
            portal.SetAccessibilityOptions(true, true, false, true);
            
            // Wait for transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify player is now teleported with large interaction zone
            Assert.AreEqual(portal.destinationPosition, playerGameObject.transform.position);
        }
        
        [UnityTest]
        public IEnumerator Portal_AudioCues_CreatesAudioSource()
        {
            // Create test audio clips
            AudioClip activateSound = AudioClip.Create("TestActivateSound", 44100, 1, 44100, false);
            AudioClip transitionSound = AudioClip.Create("TestTransitionSound", 44100, 1, 44100, false);
            portal.portalActivateSound = activateSound;
            portal.portalTransitionSound = transitionSound;
            
            // Verify audio source exists by default
            Assert.IsNotNull(portalGameObject.GetComponent<AudioSource>());
            
            // Disable audio cues
            portal.SetAccessibilityOptions(true, false, false, false);
            
            // AudioSource should still exist, but won't be used
            Assert.IsNotNull(portalGameObject.GetComponent<AudioSource>());
            
            // Attempting to trigger it won't play sounds when disabled
            // (This is harder to test directly without mocking the AudioSource)
            
            yield return null;
        }
        
        [UnityTest]
        public IEnumerator Portal_VisualPulse_AnimatesLightIntensity()
        {
            // Get light component
            Light portalLight = portalGameObject.GetComponentInChildren<Light>();
            
            // Enable visual pulse
            portal.SetAccessibilityOptions(true, true, false, false);
            
            // Record initial intensity
            float initialIntensity = portalLight.intensity;
            
            // Wait for animation frames
            yield return new WaitForSeconds(0.2f);
            float intensity1 = portalLight.intensity;
            
            yield return new WaitForSeconds(0.2f);
            float intensity2 = portalLight.intensity;
            
            // Verify light intensity is changing
            Assert.AreNotEqual(intensity1, intensity2);
            
            // Disable visual pulse
            portal.SetAccessibilityOptions(false, true, false, false);
            
            // Record intensity
            initialIntensity = portalLight.intensity;
            
            // Wait for animation frames
            yield return new WaitForSeconds(0.2f);
            intensity1 = portalLight.intensity;
            
            yield return new WaitForSeconds(0.2f);
            intensity2 = portalLight.intensity;
            
            // Verify light intensity is stable
            Assert.AreEqual(intensity1, intensity2);
        }
        
        [UnityTest]
        public IEnumerator Portal_CombinedAccessibilityFeatures_WorkTogether()
        {
            // Enable all accessibility features
            portal.SetAccessibilityOptions(true, true, true, true);
            
            // Get components
            Light portalLight = portalGameObject.GetComponentInChildren<Light>();
            
            // Verify high contrast increases light intensity
            Assert.Greater(portalLight.intensity, 1.0f);
            
            // Verify large interaction zone increases light range
            Assert.Greater(portalLight.range, 3.0f);
            
            // Position player outside normal radius but inside large radius
            float testDistance = portal.activationRadius * 1.5f; // 1.5x normal radius
            playerGameObject.transform.position = portalGameObject.transform.position + new Vector3(testDistance, 0, 0);
            
            // Wait for transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify player is teleported with larger interaction zone
            Assert.AreEqual(portal.destinationPosition, playerGameObject.transform.position);
        }
    }
}