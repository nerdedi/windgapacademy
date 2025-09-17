using UnityEngine;
using UnityEngine.UI;
using WindgapAcademy.Animation;
using System.Collections;

namespace WindgapAcademy.Demo
{
    /// <summary>
    /// Demo scene for testing code-based animations
    /// This script creates a UI to test different animation features
    /// </summary>
    public class AnimationDemoScene : MonoBehaviour
    {
        [Header("Character Reference")]
        [SerializeField] private GameObject characterPrefab;
        [SerializeField] private Transform spawnPoint;
        
        [Header("UI References")]
        [SerializeField] private Button playTalkButton;
        [SerializeField] private Button playWalkButton;
        [SerializeField] private Button playCelebrateButton;
        [SerializeField] private Button playSequenceButton;
        [SerializeField] private Button pointAtButton;
        [SerializeField] private Button randomEmoteButton;
        [SerializeField] private Button teachingDemoButton;
        
        [Header("Target Objects")]
        [SerializeField] private Transform pointTarget;
        [SerializeField] private Transform[] teachingTargets;
        
        // Component references
        private GameObject character;
        private AnimationController animController;
        private AnimationSequencePlayer sequencePlayer;
        private ProceduralAnimator procAnimator;
        private EmoteSystem emoteSystem;
        
        private void Start()
        {
            // Spawn character if needed
            SpawnCharacterIfNeeded();
            
            // Set up UI buttons
            SetupButtons();
        }
        
        /// <summary>
        /// Spawn a character if one doesn't exist
        /// </summary>
        private void SpawnCharacterIfNeeded()
        {
            if (characterPrefab != null && spawnPoint != null)
            {
                character = Instantiate(characterPrefab, spawnPoint.position, spawnPoint.rotation);
                
                // Get animation components
                animController = character.GetComponent<AnimationController>();
                sequencePlayer = character.GetComponent<AnimationSequencePlayer>();
                procAnimator = character.GetComponent<ProceduralAnimator>();
                emoteSystem = character.GetComponent<EmoteSystem>();
                
                Debug.Log("Character spawned and animation components initialized");
            }
            else
            {
                Debug.LogError("Character prefab or spawn point not assigned");
            }
        }
        
        /// <summary>
        /// Set up UI button listeners
        /// </summary>
        private void SetupButtons()
        {
            if (playTalkButton != null)
                playTalkButton.onClick.AddListener(PlayTalkAnimation);
                
            if (playWalkButton != null)
                playWalkButton.onClick.AddListener(PlayWalkAnimation);
                
            if (playCelebrateButton != null)
                playCelebrateButton.onClick.AddListener(PlayCelebrateAnimation);
                
            if (playSequenceButton != null)
                playSequenceButton.onClick.AddListener(PlayAnimationSequence);
                
            if (pointAtButton != null)
                pointAtButton.onClick.AddListener(PointAtTarget);
                
            if (randomEmoteButton != null)
                randomEmoteButton.onClick.AddListener(PlayRandomEmote);
                
            if (teachingDemoButton != null)
                teachingDemoButton.onClick.AddListener(RunTeachingDemo);
        }
        
        /// <summary>
        /// Play talk animation
        /// </summary>
        public void PlayTalkAnimation()
        {
            if (animController != null)
            {
                animController.PlayAnimationWithDuration("talk", 3.0f);
                Debug.Log("Playing talk animation for 3 seconds");
            }
        }
        
        /// <summary>
        /// Play walk animation
        /// </summary>
        public void PlayWalkAnimation()
        {
            if (animController != null)
            {
                animController.PlayAnimation("walk");
                Debug.Log("Playing walk animation");
            }
        }
        
        /// <summary>
        /// Play celebrate animation
        /// </summary>
        public void PlayCelebrateAnimation()
        {
            if (animController != null)
            {
                animController.PlayAnimationWithDuration("celebrate", 2.0f);
                Debug.Log("Playing celebrate animation for 2 seconds");
            }
        }
        
        /// <summary>
        /// Play animation sequence
        /// </summary>
        public void PlayAnimationSequence()
        {
            if (sequencePlayer != null)
            {
                Debug.Log("Playing animation sequence");
                
                sequencePlayer.StartSequence()
                    .Then("idle", 1.0f)        // Start with idle for 1 second
                    .Then("talk", 2.0f)        // Talk for 2 seconds
                    .Then("think", 2.0f)       // Think for 2 seconds
                    .Then("celebrate", 1.5f)   // Celebrate for 1.5 seconds
                    .EndWithIdle();            // Return to idle
            }
        }
        
        /// <summary>
        /// Point at target
        /// </summary>
        public void PointAtTarget()
        {
            if (procAnimator != null && pointTarget != null)
            {
                procAnimator.PointAt(pointTarget.position);
                Debug.Log("Pointing at target");
                
                // Stop pointing after 3 seconds
                Invoke("StopPointing", 3.0f);
            }
        }
        
        /// <summary>
        /// Stop pointing
        /// </summary>
        private void StopPointing()
        {
            if (procAnimator != null)
            {
                procAnimator.StopPointing();
                Debug.Log("Stopped pointing");
            }
        }
        
        /// <summary>
        /// Play random emote
        /// </summary>
        public void PlayRandomEmote()
        {
            if (emoteSystem != null)
            {
                emoteSystem.PlayRandomEmote();
            }
        }
        
        /// <summary>
        /// Run a full teaching demo sequence
        /// </summary>
        public void RunTeachingDemo()
        {
            if (animController != null && procAnimator != null && sequencePlayer != null)
            {
                Debug.Log("Starting teaching demo sequence");
                StartCoroutine(TeachingDemoSequence());
            }
        }
        
        /// <summary>
        /// Teaching demo sequence coroutine
        /// </summary>
        private IEnumerator TeachingDemoSequence()
        {
            // Introduction
            animController.PlayAnimationWithDuration("talk", 2.0f);
            yield return new WaitForSeconds(2.0f);
            
            // Point at first teaching target
            if (teachingTargets != null && teachingTargets.Length > 0)
            {
                procAnimator.PointAt(teachingTargets[0].position);
                animController.PlayAnimationWithDuration("talk", 3.0f);
                yield return new WaitForSeconds(3.0f);
                procAnimator.StopPointing();
            }
            
            // Think moment
            animController.PlayAnimationWithDuration("think", 2.0f);
            yield return new WaitForSeconds(2.0f);
            
            // Point at second teaching target
            if (teachingTargets != null && teachingTargets.Length > 1)
            {
                procAnimator.PointAt(teachingTargets[1].position);
                animController.PlayAnimationWithDuration("talk", 3.0f);
                yield return new WaitForSeconds(3.0f);
                procAnimator.StopPointing();
            }
            
            // Conclusion
            animController.PlayAnimationWithDuration("celebrate", 2.0f);
            yield return new WaitForSeconds(2.0f);
            
            // Back to idle
            animController.PlayAnimation("idle");
            
            Debug.Log("Teaching demo sequence completed");
        }
        
        /// <summary>
        /// Simulated event from React
        /// This could be called from the ReactBridgeManager
        /// </summary>
        /// <param name="animationData">Animation data from React</param>
        public void OnReactAnimationRequest(string characterId, string animationName, float duration = 0)
        {
            if (animController != null)
            {
                Debug.Log($"Received animation request from React: {animationName} for {characterId}");
                
                if (duration > 0)
                {
                    animController.PlayAnimationWithDuration(animationName, duration);
                }
                else
                {
                    animController.PlayAnimation(animationName);
                }
            }
        }
    }
}