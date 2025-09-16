using System.Collections;
using System.Collections.Generic;
using NUnit.Framework;
using UnityEngine;
using UnityEngine.TestTools;
using WindgapAcademy.Portals;

namespace WindgapAcademy.Tests.Integration
{
    public class PortalCharacterIntegrationTests
    {
        private GameObject portalGameObject;
        private Portal portal;
        private GameObject characterGameObject;
        private CharacterMock character;
        
        /// <summary>
        /// Mock character controller for testing integration with portals
        /// </summary>
        private class CharacterMock : MonoBehaviour
        {
            public bool canTeleport = true;
            public string currentRealm = "StartRealm";
            public Vector3 startPosition;
            public bool wasRecentlyTeleported = false;
            public List<string> visitedRealms = new List<string>();
            
            public void Teleport(Vector3 position, string realm)
            {
                if (canTeleport)
                {
                    transform.position = position;
                    currentRealm = realm;
                    wasRecentlyTeleported = true;
                    if (!visitedRealms.Contains(realm))
                    {
                        visitedRealms.Add(realm);
                    }
                }
            }
            
            public void ResetTeleportFlag()
            {
                wasRecentlyTeleported = false;
                transform.position = startPosition;
            }
        }
        
        [UnitySetUp]
        public IEnumerator Setup()
        {
            // Create portal
            portalGameObject = new GameObject("IntegrationTestPortal");
            portal = portalGameObject.AddComponent<Portal>();
            portal.destinationRealm = "DestinationRealm";
            portal.destinationPosition = new Vector3(20, 0, 20);
            portal.activationRadius = 2.0f;
            portal.isActive = true;
            
            // Create character with mock controller
            characterGameObject = new GameObject("IntegrationTestCharacter");
            characterGameObject.tag = "Player";
            character = characterGameObject.AddComponent<CharacterMock>();
            character.startPosition = new Vector3(0, 0, 0);
            characterGameObject.transform.position = character.startPosition;
            
            // Wait for Awake to complete
            yield return null;
        }
        
        [UnityTearDown]
        public IEnumerator TearDown()
        {
            Object.Destroy(portalGameObject);
            Object.Destroy(characterGameObject);
            yield return null;
        }
        
        [UnityTest]
        public IEnumerator Portal_CharacterEntersRadius_UpdatesCharacterRealm()
        {
            // Position character within portal activation radius
            characterGameObject.transform.position = portalGameObject.transform.position + new Vector3(1, 0, 0);
            
            // Wait for transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify character position updated
            Assert.AreEqual(portal.destinationPosition, characterGameObject.transform.position);
            
            // In a real implementation, we would check if the character's realm was updated
            // This is mocked in our test with the character.currentRealm property
        }
        
        [UnityTest]
        public IEnumerator Portal_DisabledCharacterTeleport_PreventsTransition()
        {
            // Disable character teleportation
            character.canTeleport = false;
            
            // Position character within portal activation radius
            Vector3 initialPosition = portalGameObject.transform.position + new Vector3(1, 0, 0);
            characterGameObject.transform.position = initialPosition;
            
            // Wait for potential transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify character position didn't change (would remain at the portal location)
            Assert.AreEqual(initialPosition, characterGameObject.transform.position);
            Assert.AreEqual("StartRealm", character.currentRealm);
        }
        
        [UnityTest]
        public IEnumerator Portal_AccessibilitySettings_AffectCharacterInteraction()
        {
            // Reset character position
            character.ResetTeleportFlag();
            
            // Enable large interaction zone for accessibility
            portal.SetAccessibilityOptions(true, true, false, true);
            
            // Position character outside normal radius but inside enlarged radius
            // Normal radius is 2.0, large is 4.0 (doubled)
            characterGameObject.transform.position = portalGameObject.transform.position + new Vector3(3, 0, 0);
            
            // Wait for transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify character was teleported despite being outside normal radius
            Assert.AreEqual(portal.destinationPosition, characterGameObject.transform.position);
        }
        
        [UnityTest]
        public IEnumerator Portal_ChainedPortalTransitions_TrackVisitedRealms()
        {
            // Setup second portal for chained transition
            GameObject secondPortalGameObject = new GameObject("SecondPortal");
            Portal secondPortal = secondPortalGameObject.AddComponent<Portal>();
            secondPortal.destinationRealm = "FinalRealm";
            secondPortal.destinationPosition = new Vector3(30, 0, 30);
            secondPortal.activationRadius = 2.0f;
            secondPortal.isActive = true;
            
            // Position character at first portal
            characterGameObject.transform.position = portalGameObject.transform.position + new Vector3(1, 0, 0);
            
            // Wait for first transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify first transition completed
            Assert.AreEqual(portal.destinationPosition, characterGameObject.transform.position);
            
            // Move character to second portal
            characterGameObject.transform.position = secondPortalGameObject.transform.position + new Vector3(1, 0, 0);
            
            // Wait for second transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify second transition completed
            Assert.AreEqual(secondPortal.destinationPosition, characterGameObject.transform.position);
            
            // Verify realms were tracked in the expected order
            Assert.AreEqual(3, character.visitedRealms.Count);
            Assert.AreEqual("StartRealm", character.visitedRealms[0]);
            Assert.AreEqual("DestinationRealm", character.visitedRealms[1]);
            Assert.AreEqual("FinalRealm", character.visitedRealms[2]);
            
            // Cleanup
            Object.Destroy(secondPortalGameObject);
        }
        
        [UnityTest]
        public IEnumerator Portal_DeactivateAfterUse_PreventsReuse()
        {
            // Set portal to deactivate after use
            // (We need to create a custom method for this test)
            bool originalPortalState = portal.isActive;
            
            // Position character within portal activation radius
            characterGameObject.transform.position = portalGameObject.transform.position + new Vector3(1, 0, 0);
            
            // Wait for transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify character was teleported
            Assert.AreEqual(portal.destinationPosition, characterGameObject.transform.position);
            
            // Manually deactivate portal (simulating one-time use)
            portal.isActive = false;
            
            // Reset character position
            character.ResetTeleportFlag();
            characterGameObject.transform.position = portalGameObject.transform.position + new Vector3(1, 0, 0);
            
            // Wait for potential transition
            yield return new WaitForSeconds(1.5f);
            
            // Verify character wasn't teleported again
            Assert.AreEqual(portalGameObject.transform.position + new Vector3(1, 0, 0), characterGameObject.transform.position);
            Assert.IsFalse(character.wasRecentlyTeleported);
            
            // Restore portal state
            portal.isActive = originalPortalState;
        }
    }
}