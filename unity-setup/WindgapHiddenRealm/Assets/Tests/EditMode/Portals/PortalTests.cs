using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using WindgapAcademy.Portals;

namespace WindgapAcademy.Tests.Portals
{
    public class PortalTests
    {
        private GameObject portalGameObject;
        private Portal portal;
        private GameObject playerGameObject;

        [SetUp]
        public void Setup()
        {
            // Create a portal game object
            portalGameObject = new GameObject("TestPortal");
            portal = portalGameObject.AddComponent<Portal>();
            
            // Setup basic portal properties
            portal.destinationRealm = "TestRealm";
            portal.destinationPosition = new Vector3(10, 0, 10);
            portal.portalColor = Color.blue;
            portal.activationRadius = 2.0f;
            portal.isActive = true;
            
            // Create a player object with the Player tag
            playerGameObject = new GameObject("TestPlayer");
            playerGameObject.tag = "Player";
            playerGameObject.transform.position = new Vector3(0, 0, 0);
        }

        [TearDown]
        public void TearDown()
        {
            Object.DestroyImmediate(portalGameObject);
            Object.DestroyImmediate(playerGameObject);
        }

        [Test]
        public void Portal_InitializedCorrectly()
        {
            // Verify portal properties are set correctly
            Assert.AreEqual("TestRealm", portal.destinationRealm);
            Assert.AreEqual(new Vector3(10, 0, 10), portal.destinationPosition);
            Assert.AreEqual(Color.blue, portal.portalColor);
            Assert.AreEqual(2.0f, portal.activationRadius);
            Assert.IsTrue(portal.isActive);
        }

        [Test]
        public void Portal_AccessibilityOptions_DefaultValues()
        {
            // Verify default accessibility options
            Assert.IsTrue(portal.useVisualPulse);
            Assert.IsTrue(portal.useAudioCues);
            Assert.IsFalse(portal.useHighContrast);
            Assert.IsFalse(portal.useLargeInteractionZone);
        }

        [Test]
        public void Portal_SetAccessibilityOptions_UpdatesProperties()
        {
            // Set accessibility options
            portal.SetAccessibilityOptions(
                visualPulse: false,
                audioCues: false,
                highContrast: true,
                largeZone: true
            );
            
            // Verify options were updated
            Assert.IsFalse(portal.useVisualPulse);
            Assert.IsFalse(portal.useAudioCues);
            Assert.IsTrue(portal.useHighContrast);
            Assert.IsTrue(portal.useLargeInteractionZone);
        }

        [UnityTest]
        public IEnumerator Portal_PlayerInRadius_TriggersTransition() 
        {
            // Position player within activation radius
            playerGameObject.transform.position = new Vector3(1, 0, 0);
            
            // Wait for potential transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify player has been transported to destination
            Assert.AreEqual(portal.destinationPosition, playerGameObject.transform.position);
        }

        [UnityTest]
        public IEnumerator Portal_PlayerOutsideRadius_NoTransition() 
        {
            // Position player outside activation radius
            Vector3 initialPosition = new Vector3(5, 0, 0);
            playerGameObject.transform.position = initialPosition;
            
            // Wait for potential transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify player position hasn't changed
            Assert.AreEqual(initialPosition, playerGameObject.transform.position);
        }

        [UnityTest]
        public IEnumerator Portal_LargeInteractionZone_IncreasesTriggerDistance() 
        {
            // Enable large interaction zone
            portal.SetAccessibilityOptions(
                visualPulse: true,
                audioCues: true,
                highContrast: false,
                largeZone: true
            );
            
            // Position player outside normal radius but inside large zone
            // (at 3 units, which is between normal radius of 2 and large radius of 4)
            playerGameObject.transform.position = new Vector3(3, 0, 0);
            
            // Wait for potential transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify player has been transported to destination
            Assert.AreEqual(portal.destinationPosition, playerGameObject.transform.position);
        }

        [Test]
        public void Portal_InactivePortal_WontInitiateTransition()
        {
            // Make portal inactive
            portal.isActive = false;
            
            // Position player within activation radius
            playerGameObject.transform.position = new Vector3(1, 0, 0);
            
            // Verify player hasn't been transported
            Assert.AreNotEqual(portal.destinationPosition, playerGameObject.transform.position);
        }
    }
}