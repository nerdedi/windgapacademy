using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using WindgapAcademy.Portals;

namespace WindgapAcademy.Tests.PlayMode.Portals
{
    public class PortalPlayModeTests
    {
        private GameObject portalGameObject;
        private Portal portal;
        private GameObject playerGameObject;
        private AudioSource audioSource;

        [UnitySetUp]
        public IEnumerator Setup()
        {
            // Create a portal game object
            portalGameObject = new GameObject("TestPortal");
            portal = portalGameObject.AddComponent<Portal>();
            
            // Setup portal properties
            portal.destinationRealm = "TestRealm";
            portal.destinationPosition = new Vector3(10, 0, 10);
            portal.portalColor = Color.blue;
            portal.activationRadius = 2.0f;
            portal.isActive = true;
            
            // Add audio clips for testing
            AudioClip activateSound = AudioClip.Create("ActivateSound", 44100, 1, 44100, false);
            AudioClip transitionSound = AudioClip.Create("TransitionSound", 44100, 1, 44100, false);
            portal.portalActivateSound = activateSound;
            portal.portalTransitionSound = transitionSound;
            
            // Create a player object with the Player tag
            playerGameObject = new GameObject("TestPlayer");
            playerGameObject.tag = "Player";
            playerGameObject.transform.position = new Vector3(0, 0, 0);
            
            // Let Awake methods run
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
        public IEnumerator Portal_VisualComponents_CreatedOnAwake()
        {
            // Wait a frame for Awake to complete
            yield return null;
            
            // Verify components were created
            Assert.IsNotNull(portalGameObject.GetComponentInChildren<Light>());
            Assert.IsNotNull(portalGameObject.GetComponentInChildren<ParticleSystem>());
            Assert.IsNotNull(portalGameObject.GetComponentInChildren<Renderer>());
        }

        [UnityTest]
        public IEnumerator Portal_AudioComponent_CreatedWhenAudioCuesEnabled()
        {
            // Wait a frame for Awake to complete
            yield return null;
            
            // Check that audio source exists
            Assert.IsNotNull(portalGameObject.GetComponent<AudioSource>());
        }

        [UnityTest]
        public IEnumerator Portal_HighContrastMode_IncreasesLightIntensity()
        {
            // Wait a frame for Awake to complete
            yield return null;
            
            // Get the light component
            Light light = portalGameObject.GetComponentInChildren<Light>();
            float initialIntensity = light.intensity;
            
            // Enable high contrast mode
            portal.SetAccessibilityOptions(true, true, true, false);
            
            // Verify light intensity increased
            Assert.Greater(light.intensity, initialIntensity);
        }

        [UnityTest]
        public IEnumerator Portal_DisableVisualPulse_StopsIntensityChanges()
        {
            // Wait a frame for Awake to complete
            yield return null;
            
            // Get the light component
            Light light = portalGameObject.GetComponentInChildren<Light>();
            
            // Disable visual pulse
            portal.SetAccessibilityOptions(false, true, false, false);
            
            // Get current intensity
            float initialIntensity = light.intensity;
            
            // Wait a moment for potential pulses
            yield return new WaitForSeconds(0.5f);
            
            // Verify intensity hasn't changed
            Assert.AreEqual(initialIntensity, light.intensity);
        }

        [UnityTest]
        public IEnumerator Portal_LargeInteractionZone_IncreasesLightRange()
        {
            // Wait a frame for Awake to complete
            yield return null;
            
            // Get the light component
            Light light = portalGameObject.GetComponentInChildren<Light>();
            float initialRange = light.range;
            
            // Enable large interaction zone
            portal.SetAccessibilityOptions(true, true, false, true);
            
            // Verify light range increased
            Assert.Greater(light.range, initialRange);
        }

        [UnityTest]
        public IEnumerator Portal_PlayerTransition_MovesPlayerToDestination()
        {
            // Move player into activation range
            playerGameObject.transform.position = portalGameObject.transform.position + new Vector3(1, 0, 0);
            
            // Wait for transition to complete
            yield return new WaitForSeconds(1.5f);
            
            // Verify player was moved to destination
            Assert.AreEqual(portal.destinationPosition, playerGameObject.transform.position);
        }

        [UnityTest]
        public IEnumerator Portal_DeactivatedPortal_DoesNotTransitionPlayer()
        {
            // Deactivate portal
            portal.isActive = false;
            
            // Move player into activation range
            Vector3 initialPosition = portalGameObject.transform.position + new Vector3(1, 0, 0);
            playerGameObject.transform.position = initialPosition;
            
            // Wait for potential transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify player wasn't moved
            Assert.AreEqual(initialPosition, playerGameObject.transform.position);
        }

        [UnityTest]
        public IEnumerator Portal_HighContrast_IncreasesParticleEmissionRate()
        {
            // Wait a frame for Awake to complete
            yield return null;
            
            // Get the particle system
            ParticleSystem particles = portalGameObject.GetComponentInChildren<ParticleSystem>();
            float initialEmissionRate = particles.emission.rateOverTime.constant;
            
            // Enable high contrast
            portal.SetAccessibilityOptions(true, true, true, false);
            
            // Verify emission rate increased
            Assert.Greater(particles.emission.rateOverTime.constant, initialEmissionRate);
        }
    }
}