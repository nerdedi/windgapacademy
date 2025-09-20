import { createLessonTemplate, DIFFICULTY_LEVELS } from "../lessonModel";

/**
 * Emotional Regulation Lessons - All difficulty levels
 */

// Understanding Emotions
const understandingEmotionsBeginner = createLessonTemplate({
  id: "emotional-regulation-understanding-emotions-beginner",
  title: "Recognizing Basic Emotions",
  description: "Learn to identify and name basic emotions in yourself and others.",
  category: "Emotional Regulation",
  subcategory: "Understanding Emotions",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Identify the six basic emotions: happy, sad, angry, afraid, surprised, and disgusted",
    "Recognize facial expressions associated with each emotion",
    "Understand how emotions feel in your body",
    "Begin to identify your own emotional responses",
  ],
  content: [
    {
      type: "text",
      title: "What Are Emotions?",
      body: `
# Understanding Our Feelings

Emotions are feelings that we all experience. They help us understand the world and communicate with others.

## Why Emotions Matter
- They tell us important information about situations
- They help us connect with other people
- They guide our decisions and actions
- They are a normal, healthy part of being human

## Basic Facts About Emotions
- Everyone has emotions
- Emotions come and go
- No emotion is "bad" or "wrong"
- We can have different emotions at the same time
- People can feel different emotions in the same situation
- Understanding our emotions helps us manage them better
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/emotional-regulation/emotion-circles.jpg",
      alt: "Colorful circles showing the six basic emotions with facial expressions",
      caption: "The six basic emotions we all experience",
    },
    {
      type: "text",
      title: "The Six Basic Emotions",
      body: `
# Core Emotions Everyone Feels

While we experience many different emotions, researchers have identified six basic emotions that people around the world recognize.

## Happy
- **How it feels**: Warm, energetic, light
- **How it looks**: Smiling, bright eyes, relaxed face
- **When we feel it**: When good things happen, when we're with people we like, when we achieve something
- **What it tells us**: Something is going well or we're getting what we need

## Sad
- **How it feels**: Heavy, tired, empty
- **How it looks**: Downturned mouth, droopy eyes, tears
- **When we feel it**: When we lose something or someone, when things don't go as hoped, when others are suffering
- **What it tells us**: We've experienced a loss or disappointment

## Angry
- **How it feels**: Hot, tense, energized
- **How it looks**: Furrowed brows, tight jaw, intense eyes
- **When we feel it**: When something is unfair, when we're frustrated, when our boundaries are crossed
- **What it tells us**: Something feels wrong or unfair and may need to change

## Afraid
- **How it feels**: Shaky, cold, rapid heartbeat
- **How it looks**: Wide eyes, raised eyebrows, tense body
- **When we feel it**: When we sense danger, when facing something new, when we're uncertain
- **What it tells us**: There might be a threat we need to respond to

## Surprised
- **How it feels**: Startled, alert, sudden awareness
- **How it looks**: Raised eyebrows, wide eyes, open mouth
- **When we feel it**: When something unexpected happens, good or bad
- **What it tells us**: Something unexpected has happened that we need to process

## Disgusted
- **How it feels**: Nauseous, recoiling, wanting to get away
- **How it looks**: Wrinkled nose, raised upper lip, pulled back
- **When we feel it**: When something seems gross, morally wrong, or contaminated
- **What it tells us**: We should avoid something that might be harmful
      `,
    },
    {
      type: "video",
      title: "Recognizing Emotions in Faces",
      src: "https://example.com/videos/facial-emotions.mp4",
      transcript:
        "This video shows different people expressing the six basic emotions. It points out the specific facial features that change with each emotion and gives viewers time to practice identifying each expression. The video includes examples of subtle and obvious expressions of each emotion.",
    },
    {
      type: "text",
      title: "How Emotions Feel in Your Body",
      body: `
# Body Signals of Emotions

Emotions aren't just in our minds - they create physical sensations in our bodies.

## Body Mapping
Different emotions tend to create different sensations:

- **Happy**: Warmth in chest, relaxed muscles, energized feeling, light sensation
- **Sad**: Heaviness in chest or limbs, tiredness, emptiness, aching
- **Angry**: Heat (especially in face/chest), muscle tension, racing heart, clenched jaw/fists
- **Afraid**: Butterflies in stomach, racing heart, cold hands/feet, shaking, shallow breathing
- **Surprised**: Sudden intake of breath, wide eyes, raised eyebrows, feeling alert
- **Disgusted**: Nausea, wrinkling nose, turning away, bad taste in mouth

## Why Body Awareness Matters
Noticing these physical signals can help you:
- Recognize emotions earlier
- Understand what you're feeling
- Begin to manage strong emotions before they overwhelm you
- Connect your physical sensations to your emotional experience

## Practicing Body Awareness
Take a moment right now to notice:
- How does your body feel?
- Where do you feel tension or relaxation?
- Is your heart beating fast or slow?
- Is your breathing deep or shallow?
- Do you feel hot, cold, or neutral?
- How do these sensations connect to how you're feeling emotionally?
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/emotional-regulation/body-emotion-map.jpg",
      alt: "Human body outlines showing where different emotions are commonly felt",
      caption: "How different emotions may feel in your body",
    },
    {
      type: "text",
      title: "Identifying Your Own Emotions",
      body: `
# Recognizing What You Feel

Learning to identify your own emotions is an important skill.

## Steps to Identify Your Emotions
1. **Pause and notice**: Take a moment to check in with yourself
2. **Scan your body**: Notice any physical sensations
3. **Consider the situation**: What's happening around you?
4. **Name the feeling**: Try to put a word to what you're experiencing
5. **Accept the emotion**: Remember all emotions are valid, even uncomfortable ones

## Common Challenges
- Emotions can be mixed (feeling both happy and nervous)
- Emotions can be subtle or strong
- Some emotions feel similar (anxiety and excitement)
- Past experiences affect how we interpret emotions
- Some people were taught to ignore certain emotions

## Benefits of Emotion Awareness
- Better communication with others
- Improved decision making
- Stronger relationships
- More effective emotional regulation
- Increased self-understanding

## Emotion Intensity Scale
Emotions come in different intensities:
1. **Very mild** - barely noticeable
2. **Mild** - present but manageable
3. **Moderate** - definitely noticeable
4. **Strong** - hard to ignore
5. **Very intense** - overwhelming

Try rating your emotions on this scale when you identify them.
      `,
    },
    {
      type: "interactive",
      title: "Emotion Matching Game",
      src: "emotion-matching-exercise",
      description:
        "Match the emotion names with the corresponding facial expressions and body sensations in this interactive exercise.",
    },
  ],
  activities: [
    {
      type: "emotion-identification",
      title: "Emotion Charades",
      instructions: "Take turns acting out different emotions for others to guess.",
      materials: "Cards with emotion words or pictures",
      steps: [
        "One person draws an emotion card",
        "Without speaking, they act out the emotion using facial expressions and body language",
        "Others try to guess which emotion is being portrayed",
        "Discuss the specific cues that helped identify the emotion",
        "Take turns so everyone has a chance to act and guess",
      ],
    },
    {
      type: "self-awareness",
      title: "Emotion Check-In Journal",
      instructions: "Create a simple emotion journal to track your feelings throughout the day.",
      template: {
        time: "[Morning/Afternoon/Evening]",
        emotion: "[Choose from: Happy, Sad, Angry, Afraid, Surprised, Disgusted, or Other]",
        intensity: "[Rate from 1-5]",
        bodyFeelings: "[What physical sensations do you notice?]",
        situation: "[What was happening when you felt this way?]",
      },
      example: {
        time: "Morning",
        emotion: "Nervous",
        intensity: "4",
        bodyFeelings: "Butterflies in stomach, cold hands, fast heartbeat",
        situation: "Before my doctor's appointment",
      },
    },
    {
      type: "creative-expression",
      title: "Emotion Color Mapping",
      instructions: "Create a personal color map of your emotions.",
      materials: "Paper, colored pencils or markers",
      steps: [
        "Draw six large circles on your paper",
        "Label each circle with one of the six basic emotions",
        "Choose a color that represents each emotion for you",
        "Fill each circle with its color",
        "Share why you chose each color (optional)",
        "Keep your emotion color map as a reference",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Emotion Recognition Quiz",
      questions: [
        {
          question: "Which of these expressions typically shows happiness?",
          options: [
            "Furrowed brows and tight lips",
            "Smiling mouth and crinkled eyes",
            "Wide eyes and open mouth",
            "Wrinkled nose and raised upper lip",
          ],
          correctAnswer: "Smiling mouth and crinkled eyes",
        },
        {
          question: "Which emotion might you feel when something unexpected happens?",
          options: ["Anger", "Sadness", "Surprise", "Disgust"],
          correctAnswer: "Surprise",
        },
        {
          question:
            "When you feel butterflies in your stomach and your heart beats faster, you might be feeling:",
          options: ["Happiness", "Sadness", "Fear", "Disgust"],
          correctAnswer: "Fear",
        },
        {
          question: "If someone loses something important to them, they would likely feel:",
          options: ["Anger", "Sadness", "Surprise", "Happiness"],
          correctAnswer: "Sadness",
        },
        {
          question: "Which physical sensation is most commonly associated with anger?",
          options: [
            "Feeling cold and shaky",
            "Feeling heavy and tired",
            "Feeling hot and tense",
            "Feeling nauseous and wanting to turn away",
          ],
          correctAnswer: "Feeling hot and tense",
        },
      ],
    },
    {
      type: "emotion-identification",
      title: "Facial Expression Matching",
      instructions: "Look at each facial expression and identify the emotion being shown.",
      images: [
        {
          src: "/assets/lessons/emotional-regulation/assessment/happy-face.jpg",
          correctAnswer: "Happy",
        },
        {
          src: "/assets/lessons/emotional-regulation/assessment/sad-face.jpg",
          correctAnswer: "Sad",
        },
        {
          src: "/assets/lessons/emotional-regulation/assessment/angry-face.jpg",
          correctAnswer: "Angry",
        },
        {
          src: "/assets/lessons/emotional-regulation/assessment/afraid-face.jpg",
          correctAnswer: "Afraid",
        },
        {
          src: "/assets/lessons/emotional-regulation/assessment/surprised-face.jpg",
          correctAnswer: "Surprised",
        },
        {
          src: "/assets/lessons/emotional-regulation/assessment/disgusted-face.jpg",
          correctAnswer: "Disgusted",
        },
      ],
    },
    {
      type: "scenario-based",
      title: "Emotion Scenarios",
      instructions: "Read each scenario and identify what emotion the person is likely feeling.",
      scenarios: [
        {
          scenario:
            "Tom just won first prize in the art contest. His artwork will be displayed in the community center.",
          question: "How is Tom likely feeling?",
          options: ["Sad", "Happy", "Afraid", "Disgusted"],
          correctAnswer: "Happy",
        },
        {
          scenario: "Maria's favorite mug broke when it fell off the table.",
          question: "How is Maria likely feeling?",
          options: ["Sad", "Surprised", "Angry", "Disgusted"],
          correctAnswer: "Sad",
        },
        {
          scenario: "Carlos is walking alone at night and hears a strange noise behind him.",
          question: "How is Carlos likely feeling?",
          options: ["Happy", "Sad", "Afraid", "Disgusted"],
          correctAnswer: "Afraid",
        },
        {
          scenario:
            "Leah discovers that someone took her lunch from the refrigerator without asking.",
          question: "How is Leah likely feeling?",
          options: ["Happy", "Afraid", "Angry", "Surprised"],
          correctAnswer: "Angry",
        },
        {
          scenario: "Ahmed finds a worm in his apple after taking a bite.",
          question: "How is Ahmed likely feeling?",
          options: ["Happy", "Surprised", "Afraid", "Disgusted"],
          correctAnswer: "Disgusted",
        },
      ],
    },
  ],
  resources: [
    { type: "pdf", title: "Emotion Face Cards", url: "/resources/emotion-face-cards.pdf" },
    { type: "pdf", title: "Body Sensation Map", url: "/resources/body-sensation-map.pdf" },
    {
      type: "link",
      title: "Interactive Emotion Identification Game",
      url: "https://example.com/emotion-game",
    },
    {
      type: "video",
      title: "Understanding Emotions Tutorial",
      url: "https://example.com/videos/emotions-tutorial",
    },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
    audioSupport: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    multisensoryApproach: "Visual, verbal, and experiential learning about emotions",
    socialScripts: "Explicit examples of how emotions look and feel",
    sensoryConsiderations: "Activities can be modified for sensory sensitivities",
    alexithymiaSupport: "Concrete descriptions of physical sensations associated with emotions",
  },
});

// Coping Strategies
const copingStrategiesBeginner = createLessonTemplate({
  id: "emotional-regulation-coping-strategies-beginner",
  title: "Basic Coping Skills",
  description: "Learn simple strategies to manage strong emotions and stay calm.",
  category: "Emotional Regulation",
  subcategory: "Coping Strategies",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Identify when you need to use coping strategies",
    "Practice deep breathing techniques",
    "Learn simple grounding exercises",
    "Discover healthy ways to express emotions",
  ],
  content: [
    {
      type: "text",
      title: "What Are Coping Skills?",
      body: `
# Tools for Managing Emotions

Coping skills are techniques that help us manage strong emotions and stress.

## Why Coping Skills Matter
- Strong emotions can feel overwhelming
- Our natural reactions aren't always helpful
- Coping skills give us healthier options
- They help us stay in control of our actions
- They can prevent emotional outbursts

## When to Use Coping Skills
- When emotions feel too intense
- Before reacting in ways you might regret
- When you notice stress building up
- During difficult situations
- After upsetting events, to help recover

## Benefits of Good Coping Skills
- Better relationships
- Improved problem-solving
- Reduced stress
- Greater confidence
- More emotional stability
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/emotional-regulation/coping-toolkit.jpg",
      alt: "Visual representation of various coping tools",
      caption: "A toolkit of coping strategies for different situations",
    },
    {
      type: "text",
      title: "Deep Breathing Techniques",
      body: `
# Calming Your Body Through Breath

Deep breathing is one of the simplest and most effective coping skills.

## How Deep Breathing Helps
- Sends a message to your brain to calm down
- Lowers heart rate and blood pressure
- Reduces muscle tension
- Brings focus to the present moment
- Can be done anywhere, anytime

## Basic Deep Breathing
1. Sit or stand comfortably
2. Place one hand on your belly
3. Breathe in slowly through your nose for 4 counts (belly expands)
4. Hold for 1-2 counts (optional)
5. Breathe out slowly through your mouth for 4 counts (belly contracts)
6. Repeat 3-5 times

## Box Breathing
1. Breathe in for 4 counts
2. Hold for 4 counts
3. Breathe out for 4 counts
4. Hold for 4 counts
5. Repeat the "box" pattern

## Flower and Candle Breathing
- Imagine smelling a flower as you breathe in
- Imagine blowing out a candle as you breathe out
- Make your exhale longer than your inhale for extra calming effect
      `,
    },
    {
      type: "video",
      title: "Deep Breathing Practice",
      src: "https://example.com/videos/deep-breathing.mp4",
      transcript:
        "This video guides viewers through different deep breathing techniques. It demonstrates proper breathing form with visual cues and provides a guided practice session. The video shows how the body changes with calm breathing and explains why deep breathing helps manage emotions.",
    },
    {
      type: "text",
      title: "Grounding Techniques",
      body: `
# Connecting to the Present Moment

Grounding techniques help bring your attention to the present when emotions are overwhelming.

## What is Grounding?
- Techniques that connect you to the present moment
- Uses your senses to shift focus away from strong emotions
- Helps when you feel overwhelmed, anxious, or disconnected
- Can be done quickly in any situation

## The 5-4-3-2-1 Technique
Use your senses to notice:
1. **5 things you can SEE** (Look around and name them: "I see a blue chair, a window...")
2. **4 things you can FEEL** (Notice physical sensations: "I feel the chair against my back...")
3. **3 things you can HEAR** (Listen carefully: "I hear a clock ticking...")
4. **2 things you can SMELL** (Or like to smell: "I smell coffee brewing...")
5. **1 thing you can TASTE** (Or like to taste: "I taste mint gum...")

## Physical Grounding
- Press your feet firmly into the ground
- Hold a cold or warm object (ice cube, warm mug)
- Stretch your arms or legs
- Splash cold water on your face
- Rub your hands together and notice the sensation

## Category Grounding
Name as many items as you can in categories like:
- Animals that live in the ocean
- Green vegetables
- Countries starting with "A"
- Types of transportation
- Movies you've seen
      `,
    },
    {
      type: "interactive",
      title: "5-4-3-2-1 Grounding Practice",
      src: "grounding-exercise",
      description:
        "Interactive exercise guiding you through the 5-4-3-2-1 grounding technique, with places to record what you notice through each sense.",
    },
    {
      type: "text",
      title: "Healthy Expression of Emotions",
      body: `
# Safe Ways to Express Feelings

It's important to express emotions in ways that are healthy for you and others.

## Why Expressing Emotions Matters
- Bottled-up emotions often come out in unhelpful ways
- Expressing feelings can prevent them from building up
- Healthy expression helps others understand you better
- It's an important part of human connection
- Helps release emotional tension

## Verbal Expression
- Talk to someone you trust
- Use "I feel..." statements
- Name your emotions specifically
- Explain what caused the feeling
- Ask for what you need

## Physical Expression
- Take a walk or exercise
- Dance to express emotions
- Squeeze a stress ball
- Tear or crumple paper
- Punch a pillow (for anger)

## Creative Expression
- Draw or paint your feelings
- Write in a journal
- Make music or sing
- Create a collage that represents your emotion
- Use clay or play-dough to shape your feelings

## Symbolic Expression
- Write down what's bothering you and tear it up
- Wash your hands while imagining washing away negative feelings
- Blow bubbles to represent letting go of thoughts
- Draw your feeling and then transform the drawing
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/emotional-regulation/expression-methods.jpg",
      alt: "Various methods of emotional expression",
      caption: "Different ways to express emotions in healthy ways",
    },
    {
      type: "text",
      title: "Creating Your Coping Plan",
      body: `
# Your Personal Toolbox

Creating a personalized coping plan helps you remember strategies when you need them most.

## When to Use Your Plan
- When you notice warning signs of strong emotions
- During stressful situations
- Before challenging events
- When you feel overwhelmed
- As regular practice to build your skills

## Key Components of a Coping Plan
1. **Warning signs**: How you know you're getting upset
2. **Triggering situations**: Events that typically cause strong emotions
3. **Go-to strategies**: Your most effective coping techniques
4. **People who can help**: Supportive individuals you can reach out to
5. **Reminders**: Positive statements that help you stay focused

## Example Coping Plan
- **My warning signs**: Fast heartbeat, clenched fists, hot face
- **My triggers**: Being rushed, loud noises, feeling left out
- **My go-to strategies**: Deep breathing, counting to 10, taking a walk
- **People who help me**: My teacher Ms. Johnson, my friend Taylor, my uncle Rob
- **My reminder**: "I can handle this feeling. It will pass."

## Making Your Plan Accessible
- Write it down or create a visual version
- Keep a copy in places you might need it
- Create a smaller version to carry with you
- Practice your strategies regularly when calm
- Update your plan as you learn what works best
      `,
    },
    {
      type: "audio",
      title: "Guided Relaxation Practice",
      src: "https://example.com/audio/guided-relaxation.mp3",
      transcript:
        "This audio guides listeners through a progressive relaxation exercise. It includes deep breathing, muscle relaxation, and visualization techniques. The narrator uses a calm, steady voice to lead listeners through each step of the relaxation process.",
    },
  ],
  activities: [
    {
      type: "breathing-practice",
      title: "Breathing Buddies",
      instructions: "Practice deep breathing with a visual aid.",
      materials: "Small stuffed animal or soft object",
      steps: [
        "Lie down on your back in a comfortable position",
        "Place the stuffed animal on your belly",
        "Breathe in slowly through your nose for 4 counts (watch the stuffed animal rise)",
        "Breathe out slowly through your mouth for 4 counts (watch the stuffed animal fall)",
        "Focus on the movement of the stuffed animal for 5-10 breaths",
        "Notice how your body feels after the exercise",
      ],
    },
    {
      type: "grounding-exercise",
      title: "Sensory Grounding Kit",
      instructions: "Create a personal kit with items that engage your five senses.",
      materials: "Small container, collection of sensory items",
      suggestedItems: [
        "Visual: Photos, colorful stones, small toys",
        "Touch: Stress ball, soft fabric, textured items",
        "Hearing: Small bell, whistle, recorded sounds",
        "Smell: Scented oils, spices in sealed containers, scented eraser",
        "Taste: Hard candies, gum, tea bags",
      ],
      steps: [
        "Collect items that appeal to each of your senses",
        "Place them in a container you can easily access",
        "Label each item with which sense it engages",
        "Practice using different items when you feel stressed",
        "Notice which sensory inputs help you most",
      ],
    },
    {
      type: "expression-activity",
      title: "Emotion Color Mapping",
      instructions: "Express emotions through color and drawing.",
      materials: "Paper, colored markers or pencils",
      steps: [
        "Think about a recent strong emotion you felt",
        "Choose a color that represents that emotion",
        "Draw shapes, lines, or patterns that express the feeling",
        "You don't need to draw a specific picture - just express the feeling",
        "On the back, write what emotion you were expressing",
        "Share your drawing if you feel comfortable (optional)",
      ],
    },
    {
      type: "coping-plan",
      title: "My Personal Coping Plan",
      instructions: "Create your own coping plan to use when emotions are strong.",
      template: {
        warningSigns: "How I know I'm getting upset:",
        triggers: "Situations that often upset me:",
        strategies: "Coping skills that help me:",
        supporters: "People I can talk to:",
        reminders: "What I can tell myself:",
      },
      example: {
        warningSigns: "Talking louder, face feels hot, heart beats fast",
        triggers: "Being interrupted, not understanding instructions, losing a game",
        strategies: "Deep breathing, counting to 20, getting a drink of water",
        supporters: "Mom, Teacher, School Counselor",
        reminders: "My feelings are temporary. I can handle this.",
      },
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Coping Skills Quiz",
      questions: [
        {
          question: "Which of these is a deep breathing technique?",
          options: [
            "Holding your breath as long as possible",
            "Breathing quickly to get more oxygen",
            "Breathing in for 4 counts and out for 4 counts",
            "Taking shallow breaths from your chest",
          ],
          correctAnswer: "Breathing in for 4 counts and out for 4 counts",
        },
        {
          question: "When is a good time to use coping skills?",
          options: [
            "Only during an emotional crisis",
            "When you notice early signs of strong emotions",
            "Only when a teacher or parent tells you to",
            "Only after you've become very upset",
          ],
          correctAnswer: "When you notice early signs of strong emotions",
        },
        {
          question: "The 5-4-3-2-1 technique is a type of:",
          options: [
            "Breathing exercise",
            "Grounding technique",
            "Creative expression",
            "Physical exercise",
          ],
          correctAnswer: "Grounding technique",
        },
        {
          question: "Which is a healthy way to express anger?",
          options: [
            "Yelling at the person who made you angry",
            "Keeping it inside and not telling anyone",
            "Breaking something to release the tension",
            "Taking a walk or squeezing a stress ball",
          ],
          correctAnswer: "Taking a walk or squeezing a stress ball",
        },
        {
          question: "A personal coping plan should include:",
          options: [
            "Ways to avoid all stressful situations",
            "Strategies to make other people change their behavior",
            "Your personal warning signs and effective coping strategies",
            "Instructions for others on how to treat you",
          ],
          correctAnswer: "Your personal warning signs and effective coping strategies",
        },
      ],
    },
    {
      type: "demonstration",
      title: "Coping Skills Demonstration",
      instructions: "Demonstrate two different coping skills you've learned.",
      rubric: {
        Technique: "Demonstrates the skill correctly",
        Understanding: "Can explain when and why to use the skill",
        Effectiveness: "Shows how the skill might help with emotions",
        Personalization: "Has adapted the skill to their preferences",
      },
    },
    {
      type: "scenario-based",
      title: "Applying Coping Strategies",
      instructions: "Read each scenario and select an appropriate coping strategy.",
      scenarios: [
        {
          scenario:
            "You have a big test tomorrow and feel very nervous. Your heart is racing and you can't focus.",
          question: "Which coping strategy might help most in this moment?",
          options: [
            "Call a friend to complain about the test",
            "Practice deep breathing for a few minutes",
            "Decide not to take the test",
            "Drink caffeine to help you focus",
          ],
          correctAnswer: "Practice deep breathing for a few minutes",
        },
        {
          scenario:
            "Someone said something that hurt your feelings, and you feel yourself getting angry.",
          question: "Which coping strategy might be most helpful?",
          options: [
            "Immediately confront the person while angry",
            "Tell everyone else what the person said about you",
            "Count to 20 before responding",
            "Decide never to speak to that person again",
          ],
          correctAnswer: "Count to 20 before responding",
        },
        {
          scenario: "You're feeling overwhelmed by too many things happening at once.",
          question: "Which grounding strategy might help you?",
          options: [
            "Try to solve all your problems immediately",
            "Use the 5-4-3-2-1 technique to focus on the present moment",
            "Take on more tasks to distract yourself",
            "Ignore the feeling until it goes away",
          ],
          correctAnswer: "Use the 5-4-3-2-1 technique to focus on the present moment",
        },
        {
          scenario: "You're feeling sad after getting disappointing news.",
          question: "Which would be a healthy way to express this emotion?",
          options: [
            "Keep it to yourself so you don't bother others",
            "Write about your feelings in a journal",
            "Skip school or work the next day",
            "Eat lots of junk food to feel better",
          ],
          correctAnswer: "Write about your feelings in a journal",
        },
      ],
    },
  ],
  resources: [
    { type: "pdf", title: "Deep Breathing Guide", url: "/resources/breathing-techniques.pdf" },
    { type: "pdf", title: "Coping Plan Template", url: "/resources/coping-plan.pdf" },
    {
      type: "link",
      title: "Interactive Grounding Exercises",
      url: "https://example.com/grounding-tools",
    },
    {
      type: "video",
      title: "Calming Strategies Tutorial",
      url: "https://example.com/videos/calming-strategies",
    },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
    audioSupport: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    multisensoryApproach:
      "Multiple types of coping strategies addressing different sensory preferences",
    incrementalProgress: "Starting with simple techniques and building complexity",
    repetitionAndPractice: "Multiple opportunities to practice each technique",
    sensoryConsiderations: "Options to adjust techniques for sensory sensitivities or preferences",
  },
});

// Export all Emotional Regulation lessons
export const emotionalRegulationLessons = [
  understandingEmotionsBeginner,
  copingStrategiesBeginner,
  // More emotional regulation lessons would be added here
];
