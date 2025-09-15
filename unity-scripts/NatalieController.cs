using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace WindgapAcademy
{
    /// <summary>
    /// Natalie - The Educator Character Controller
    /// Specialized for teaching interactions and educational demonstrations
    /// </summary>
    public class NatalieController : CharacterController
    {
        [Header("Educator Settings")]
        public Transform teachingPosition;
        public Transform whiteboardPosition;
        public GameObject[] teachingProps;
        public float teachingRange = 3.0f;
        
        [Header("Teaching Animations")]
        public string explainGestureAnim = "Explain_Gesture";
        public string pointAtBoardAnim = "Point_At_Board";
        public string writeOnBoardAnim = "Write_On_Board";
        public string demonstrateAnim = "Demonstrate_Action";
        public string encourageAnim = "Encouraging_Nod";
        
        // Teaching state
        private TeachingMode currentTeachingMode;
        private List<GameObject> activeStudents;
        private bool isTeachingActive;
        private float lessonTimer;
        
        // Animation parameters specific to Natalie
        private readonly int TeachingModeParam = Animator.StringToHash("TeachingMode");
        private readonly int IsTeachingParam = Animator.StringToHash("IsTeaching");
        private readonly int StudentCountParam = Animator.StringToHash("StudentCount");
        
        protected override void Start()
        {
            base.Start();
            characterType = CharacterType.Educator;
            activeStudents = new List<GameObject>();
        }
        
        protected override void OnLessonInitialized(LessonData lessonData)
        {
            base.OnLessonInitialized(lessonData);
            
            // Move to teaching position
            if (teachingPosition != null)
            {
                MoveTo(teachingPosition.position);
                LookAt(whiteboardPosition != null ? whiteboardPosition.position : transform.position + transform.forward);
            }
            
            // Start teaching mode
            StartTeaching();
        }
        
        #region Teaching System
        
        public void StartTeaching()
        {
            isTeachingActive = true;
            lessonTimer = 0f;
            ChangeState(CharacterState.Teaching);
            SetAnimationParameter(IsTeachingParam, true);
            
            // Welcome gesture
            TriggerAnimation("Wave_Hello");
            PlayVoiceClip("welcome_students");
            
            // Start lesson introduction
            StartCoroutine(LessonIntroductionCoroutine());
        }
        
        public void StopTeaching()
        {
            isTeachingActive = false;
            ChangeState(CharacterState.Idle);
            SetAnimationParameter(IsTeachingParam, false);
            
            // Farewell gesture
            TriggerAnimation("Goodbye_Wave");
            PlayVoiceClip("lesson_complete");
        }
        
        private IEnumerator LessonIntroductionCoroutine()
        {
            yield return new WaitForSeconds(2f);
            
            // Explain lesson objectives
            SetTeachingMode(TeachingMode.Explaining);
            TriggerAnimation(explainGestureAnim);
            PlayVoiceClip("lesson_objectives");
            
            yield return new WaitForSeconds(5f);
            
            // Begin main lesson content
            SetTeachingMode(TeachingMode.Demonstrating);
            BeginLessonContent();
        }
        
        public void SetTeachingMode(TeachingMode mode)
        {
            currentTeachingMode = mode;
            SetAnimationParameter(TeachingModeParam, (int)mode);
            
            switch (mode)
            {
                case TeachingMode.Explaining:
                    // Use gestures and eye contact
                    break;
                case TeachingMode.Demonstrating:
                    // Show practical examples
                    break;
                case TeachingMode.Questioning:
                    // Engage students with questions
                    break;
                case TeachingMode.Encouraging:
                    // Provide positive reinforcement
                    break;
            }
        }
        
        private void BeginLessonContent()
        {
            if (currentLesson != null)
            {
                // Adapt teaching based on lesson type
                switch (currentLesson.lessonId)
                {
                    case "math-counting":
                        TeachMathCounting();
                        break;
                    case "literacy-reading":
                        TeachLiteracyReading();
                        break;
                    case "life-skills-cooking":
                        TeachCookingSkills();
                        break;
                    default:
                        TeachGenericLesson();
                        break;
                }
            }
        }
        
        #endregion
        
        #region Lesson-Specific Teaching Methods
        
        private void TeachMathCounting()
        {
            StartCoroutine(MathCountingSequence());
        }
        
        private IEnumerator MathCountingSequence()
        {
            // Point to whiteboard
            LookAt(whiteboardPosition.position);
            TriggerAnimation(pointAtBoardAnim);
            PlayVoiceClip("math_introduction");
            yield return new WaitForSeconds(3f);
            
            // Demonstrate counting
            SetTeachingMode(TeachingMode.Demonstrating);
            TriggerAnimation(demonstrateAnim);
            PlayVoiceClip("counting_demonstration");
            yield return new WaitForSeconds(5f);
            
            // Engage students
            SetTeachingMode(TeachingMode.Questioning);
            LookAtStudents();
            TriggerAnimation("Ask_Question");
            PlayVoiceClip("counting_question");
        }
        
        private void TeachLiteracyReading()
        {
            StartCoroutine(LiteracyReadingSequence());
        }
        
        private IEnumerator LiteracyReadingSequence()
        {
            // Hold up book prop
            ActivateTeachingProp("book");
            TriggerAnimation("Hold_Object");
            PlayVoiceClip("reading_introduction");
            yield return new WaitForSeconds(4f);
            
            // Demonstrate reading
            SetTeachingMode(TeachingMode.Demonstrating);
            TriggerAnimation("Read_Aloud");
            PlayVoiceClip("reading_demonstration");
            yield return new WaitForSeconds(6f);
            
            // Encourage student participation
            SetTeachingMode(TeachingMode.Encouraging);
            TriggerAnimation(encourageAnim);
            PlayVoiceClip("reading_encouragement");
        }
        
        private void TeachCookingSkills()
        {
            StartCoroutine(CookingSkillsSequence());
        }
        
        private IEnumerator CookingSkillsSequence()
        {
            // Move to kitchen area
            MoveTo(teachingPosition.position);
            yield return new WaitForSeconds(2f);
            
            // Demonstrate cooking technique
            ActivateTeachingProp("cooking_utensil");
            SetTeachingMode(TeachingMode.Demonstrating);
            TriggerAnimation("Cooking_Demonstration");
            PlayVoiceClip("cooking_safety");
            yield return new WaitForSeconds(5f);
            
            // Guide student practice
            SetTeachingMode(TeachingMode.Encouraging);
            TriggerAnimation("Guide_Student");
            PlayVoiceClip("cooking_guidance");
        }
        
        private void TeachGenericLesson()
        {
            // Default teaching behavior
            SetTeachingMode(TeachingMode.Explaining);
            TriggerAnimation(explainGestureAnim);
            PlayVoiceClip("generic_explanation");
        }
        
        #endregion
        
        #region Student Interaction
        
        public void RegisterStudent(GameObject student)
        {
            if (!activeStudents.Contains(student))
            {
                activeStudents.Add(student);
                SetAnimationParameter(StudentCountParam, activeStudents.Count);
                
                // Acknowledge new student
                LookAt(student.transform.position);
                TriggerAnimation("Acknowledge_Student");
                PlayVoiceClip("welcome_student");
            }
        }
        
        public void UnregisterStudent(GameObject student)
        {
            if (activeStudents.Contains(student))
            {
                activeStudents.Remove(student);
                SetAnimationParameter(StudentCountParam, activeStudents.Count);
            }
        }
        
        private void LookAtStudents()
        {
            if (activeStudents.Count > 0)
            {
                // Look at center of student group
                Vector3 centerPosition = Vector3.zero;
                foreach (var student in activeStudents)
                {
                    centerPosition += student.transform.position;
                }
                centerPosition /= activeStudents.Count;
                LookAt(centerPosition);
            }
        }
        
        public void RespondToStudentAnswer(bool isCorrect, GameObject student)
        {
            LookAt(student.transform.position);
            
            if (isCorrect)
            {
                SetEmotion(EmotionalState.Proud);
                TriggerAnimation("Thumbs_Up");
                PlayVoiceClip("correct_answer");
                SetTeachingMode(TeachingMode.Encouraging);
            }
            else
            {
                SetEmotion(EmotionalState.Encouraging);
                TriggerAnimation("Gentle_Correction");
                PlayVoiceClip("gentle_correction");
                SetTeachingMode(TeachingMode.Explaining);
            }
        }
        
        #endregion
        
        #region Teaching Props
        
        private void ActivateTeachingProp(string propName)
        {
            // Deactivate all props first
            foreach (var prop in teachingProps)
            {
                prop.SetActive(false);
            }
            
            // Activate specific prop
            GameObject targetProp = System.Array.Find(teachingProps, p => p.name.Contains(propName));
            if (targetProp != null)
            {
                targetProp.SetActive(true);
            }
        }
        
        #endregion
        
        #region Animation Overrides
        
        protected override void UpdateTeachingAnimations()
        {
            if (isTeachingActive)
            {
                lessonTimer += Time.deltaTime;
                
                // Update teaching-specific animations based on mode
                switch (currentTeachingMode)
                {
                    case TeachingMode.Explaining:
                        // Periodic gesture animations
                        if (lessonTimer % 10f < 0.1f)
                        {
                            TriggerAnimation(explainGestureAnim);
                        }
                        break;
                        
                    case TeachingMode.Demonstrating:
                        // Demonstration-specific updates
                        break;
                        
                    case TeachingMode.Questioning:
                        // Look at students periodically
                        if (lessonTimer % 5f < 0.1f)
                        {
                            LookAtStudents();
                        }
                        break;
                }
            }
        }
        
        #endregion
        
        #region Voice System Override
        
        protected override AudioClip GetVoiceClip(string clipName)
        {
            // Natalie-specific voice clip lookup
            return Resources.Load<AudioClip>($"Audio/Natalie/{clipName}");
        }
        
        #endregion
    }
    
    public enum TeachingMode
    {
        Idle = 0,
        Explaining = 1,
        Demonstrating = 2,
        Questioning = 3,
        Encouraging = 4,
        Correcting = 5
    }
}
