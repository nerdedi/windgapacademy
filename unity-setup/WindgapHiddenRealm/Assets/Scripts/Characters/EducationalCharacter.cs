using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using WindgapAcademy.Input;

// Portions of this file were generated with the assistance of GitHub Copilot
namespace WindgapAcademy.Characters
{
    /// <summary>
    /// Educational character that can respond to student interactions and help
    /// guide them through learning experiences in the Windgap Academy environment.
    /// </summary>
    [RequireComponent(typeof(CharacterEmotionalState))]
    public class EducationalCharacter : MonoBehaviour
    {
        [Header("Character Information")]
        [SerializeField] private string characterName = "Winnie";
        [SerializeField] private string characterRole = "Education Guide";
        [SerializeField] private string characterDescription = "Windgap Academy's friendly mascot who helps students navigate the learning environment.";
        
        [Header("Interaction Settings")]
        [SerializeField] private float interactionRadius = 3f;
        [SerializeField] private LayerMask studentLayer;
        [SerializeField] private Transform interactionPoint;
        [SerializeField] private GameObject interactionPrompt;
        [SerializeField] private AudioSource voiceAudio;
        
        [Header("Dialog Settings")]
        [SerializeField] private TMPro.TextMeshProUGUI dialogText;
        [SerializeField] private GameObject dialogPanel;
        [SerializeField] private float typingSpeed = 0.05f;
        [SerializeField] private AudioClip typingSound;
        [SerializeField] private AudioClip[] voiceClips;
        
        // Required components
        private CharacterEmotionalState emotionalState;
        private Animator animator;
        
        // Dialog state
        private bool isInDialog = false;
        private Coroutine currentDialog;
        private Queue<DialogEntry> dialogQueue = new Queue<DialogEntry>();
        
        // Animation parameter hashes
        private int talkingHash;
        private int greetingHash;
        private int pointingHash;
        private int thinkingHash;
        private int idleHash;
        
        private void Awake()
        {
            // Get required components
            emotionalState = GetComponent<CharacterEmotionalState>();
            animator = GetComponentInChildren<Animator>();
            
            // Initialize dialog panel
            if (dialogPanel != null)
            {
                dialogPanel.SetActive(false);
            }
            
            // Initialize interaction prompt
            if (interactionPrompt != null)
            {
                interactionPrompt.SetActive(false);
            }
            
            // Cache animation parameter hashes
            if (animator != null)
            {
                talkingHash = Animator.StringToHash("Talking");
                greetingHash = Animator.StringToHash("Greeting");
                pointingHash = Animator.StringToHash("Pointing");
                thinkingHash = Animator.StringToHash("Thinking");
                idleHash = Animator.StringToHash("Idle");
            }
        }
        
        private void Update()
        {
            // Check for nearby students
            DetectStudents();
            
            // Process dialog queue if not in dialog
            if (!isInDialog && dialogQueue.Count > 0)
            {
                StartNextDialog();
            }
        }
        
        /// <summary>
        /// Look for students within the interaction radius
        /// </summary>
        private void DetectStudents()
        {
            if (interactionPoint == null || isInDialog) return;
            
            // Cast a sphere to detect students
            Collider[] colliders = Physics.OverlapSphere(interactionPoint.position, interactionRadius, studentLayer);
            
            if (colliders.Length > 0)
            {
                // Show interaction prompt
                if (interactionPrompt != null && !interactionPrompt.activeSelf)
                {
                    interactionPrompt.SetActive(true);
                }
                
                // Check for interaction input
                if (Input.GetKeyDown(KeyCode.E))
                {
                    // Interact with the closest student
                    GameObject closestStudent = colliders[0].gameObject;
                    InteractWithStudent(closestStudent);
                }
            }
            else
            {
                // Hide interaction prompt
                if (interactionPrompt != null && interactionPrompt.activeSelf)
                {
                    interactionPrompt.SetActive(false);
                }
            }
        }
        
        /// <summary>
        /// Interact with a student character
        /// </summary>
        /// <param name="student">The student GameObject</param>
        private void InteractWithStudent(GameObject student)
        {
            // Get student component
            PlayerCharacterController studentController = student.GetComponent<PlayerCharacterController>();
            
            if (studentController != null)
            {
                // Face the student
                Vector3 lookDirection = student.transform.position - transform.position;
                lookDirection.y = 0;
                transform.rotation = Quaternion.LookRotation(lookDirection);
                
                // Start greeting animation
                if (animator != null)
                {
                    animator.SetTrigger(greetingHash);
                }
                
                // Set happy emotion
                emotionalState.SetEmotionalState(EmotionalState.Happy, false, 2f);
                
                // Start welcome dialog
                QueueDialog(new DialogEntry(
                    "Welcome to Windgap Academy! I'm " + characterName + ", your guide to the Hidden Realm.",
                    EmotionalState.Happy,
                    GetRandomVoiceClip()
                ));
                
                QueueDialog(new DialogEntry(
                    "I can help you navigate this environment and learn about the various features available to you.",
                    EmotionalState.Neutral,
                    GetRandomVoiceClip()
                ));
                
                QueueDialog(new DialogEntry(
                    "Would you like a tour of the campus?",
                    EmotionalState.Excited,
                    GetRandomVoiceClip()
                ));
            }
        }
        
        /// <summary>
        /// Queue a dialog entry to be displayed
        /// </summary>
        /// <param name="entry">The dialog entry to queue</param>
        public void QueueDialog(DialogEntry entry)
        {
            dialogQueue.Enqueue(entry);
        }
        
        /// <summary>
        /// Start the next dialog in the queue
        /// </summary>
        private void StartNextDialog()
        {
            if (dialogQueue.Count == 0 || isInDialog) return;
            
            DialogEntry entry = dialogQueue.Dequeue();
            currentDialog = StartCoroutine(ShowDialog(entry));
        }
        
        /// <summary>
        /// Show a dialog entry with typing effect
        /// </summary>
        private IEnumerator ShowDialog(DialogEntry entry)
        {
            isInDialog = true;
            
            // Show dialog panel
            if (dialogPanel != null)
            {
                dialogPanel.SetActive(true);
            }
            
            // Set emotional state for this dialog
            emotionalState.SetEmotionalState(entry.EmotionState, false);
            
            // Play voice clip
            if (voiceAudio != null && entry.VoiceClip != null)
            {
                voiceAudio.clip = entry.VoiceClip;
                voiceAudio.Play();
            }
            
            // Set talking animation
            if (animator != null)
            {
                animator.SetBool(talkingHash, true);
            }
            
            // Type out the text
            if (dialogText != null)
            {
                dialogText.text = "";
                
                foreach (char c in entry.Text)
                {
                    dialogText.text += c;
                    
                    // Play typing sound
                    if (typingSound != null && voiceAudio != null)
                    {
                        voiceAudio.PlayOneShot(typingSound, 0.5f);
                    }
                    
                    yield return new WaitForSeconds(typingSpeed);
                }
            }
            
            // Wait for input to continue
            while (!Input.GetKeyDown(KeyCode.Space) && !Input.GetKeyDown(KeyCode.Return) && !Input.GetKeyDown(KeyCode.E))
            {
                yield return null;
            }
            
            // End dialog
            if (animator != null)
            {
                animator.SetBool(talkingHash, false);
            }
            
            // Hide dialog panel if queue is empty
            if (dialogQueue.Count == 0 && dialogPanel != null)
            {
                dialogPanel.SetActive(false);
                
                // Return to neutral emotional state
                emotionalState.SetEmotionalState(EmotionalState.Neutral, false);
            }
            
            isInDialog = false;
        }
        
        /// <summary>
        /// Get a random voice clip from the available clips
        /// </summary>
        private AudioClip GetRandomVoiceClip()
        {
            if (voiceClips == null || voiceClips.Length == 0) return null;
            
            return voiceClips[Random.Range(0, voiceClips.Length)];
        }
        
        /// <summary>
        /// Dialog entry structure
        /// </summary>
        public struct DialogEntry
        {
            public string Text;
            public EmotionalState EmotionState;
            public AudioClip VoiceClip;
            
            public DialogEntry(string text, EmotionalState emotionState, AudioClip voiceClip)
            {
                Text = text;
                EmotionState = emotionState;
                VoiceClip = voiceClip;
            }
        }
    }
}