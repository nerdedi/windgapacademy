import { createLessonTemplate, DIFFICULTY_LEVELS } from "../lessonModel";

/**
 * Social Communication Lessons - All difficulty levels
 */

// Conversation Skills
const conversationSkillsBeginner = createLessonTemplate({
  id: "social-communication-conversation-skills-beginner",
  title: "Basic Conversation Skills",
  description: "Learn fundamental skills for starting and maintaining simple conversations.",
  category: "Social Communication",
  subcategory: "Conversation Skills",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Recognize appropriate times and ways to start a conversation",
    "Practice basic greetings and introductions",
    "Learn simple conversation starters",
    "Understand the concept of turn-taking in conversations",
  ],
  content: [
    {
      type: "text",
      title: "Why Conversations Matter",
      body: `
# The Importance of Talking with Others

Conversations help us connect with other people and get things done.

## Benefits of Conversation Skills
- Making friends and maintaining relationships
- Getting help when you need it
- Sharing information and ideas
- Expressing your needs and feelings
- Learning from others
- Building confidence in social situations

## Types of Conversations
- **Casual conversations**: Informal chats with friends or acquaintances
- **Functional conversations**: Talking to get something done (ordering food, asking for directions)
- **Professional conversations**: Talking in work or educational settings
- **Support conversations**: Discussing problems or seeking help

## Basic Elements of Conversations
- Greetings and closings
- Taking turns speaking and listening
- Asking and answering questions
- Staying on topic
- Showing interest in the other person
- Using appropriate tone and volume
- Reading and responding to social cues
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/social-communication/conversation-elements.jpg",
      alt: "Visual diagram showing the basic elements of a conversation",
      caption: "Key parts of a successful conversation",
    },
    {
      type: "text",
      title: "Starting Conversations",
      body: `
# How to Begin Talking with Others

Starting a conversation can sometimes feel challenging, but there are simple ways to begin.

## When to Start a Conversation
Good times to start a conversation include:
- When someone makes eye contact and smiles
- During breaks or social times
- When you're introduced to someone
- When you need information or help
- When you're participating in a shared activity

Times that may not be good for starting conversations:
- When someone is clearly busy or in a hurry
- During quiet times (like a test or movie)
- When someone is showing signs they want to be alone
- When someone is having a private conversation
- If the person has previously indicated they don't want to talk

## Basic Greetings
Simple ways to start a conversation include:
- "Hi" / "Hello"
- "Good morning/afternoon/evening"
- "Hey, how's it going?"
- "Nice to see you"
- "Hello, my name is..." (when meeting someone new)

## Adding Information
After the greeting, you can add:
- Your name (if the person doesn't know you)
- A simple question
- A comment about a shared experience
- A compliment
- A relevant observation

## Examples of Conversation Starters
- "Hi, I'm Alex. I'm new to this class."
- "Hello, how was your weekend?"
- "Nice weather today, isn't it?"
- "I like your shirt. Where did you get it?"
- "That book looks interesting. What's it about?"
      `,
    },
    {
      type: "video",
      title: "Starting Conversations",
      src: "https://example.com/videos/conversation-starters.mp4",
      transcript:
        "This video demonstrates various ways to start conversations in different settings. It shows examples of good timing for starting conversations and models appropriate greetings and conversation starters. The video also illustrates how to read social cues that indicate when someone is open to conversation.",
    },
    {
      type: "text",
      title: "Taking Turns in Conversation",
      body: `
# The Back-and-Forth of Talking

Conversations involve taking turns speaking and listening.

## Why Turn-Taking Matters
- Gives both people a chance to participate
- Shows respect for the other person
- Helps the conversation flow naturally
- Allows for exchange of ideas and information
- Builds connection between people

## Signs It's Your Turn to Speak
- The other person has finished their thought
- They ask you a question
- They pause and look at you
- They use your name
- They make a gesture indicating it's your turn

## Signs It's Time to Listen
- The other person starts speaking
- They haven't finished their thought
- They look like they have more to say
- They raise their hand or finger
- They say "Let me finish" or similar phrases

## Challenges with Turn-Taking
- Interrupting others
- Long pauses that feel awkward
- One person dominating the conversation
- Not knowing when to jump in
- Multiple people trying to speak at once

## Tips for Better Turn-Taking
- Wait until the other person has finished speaking
- Look for natural pauses
- Use phrases like "What do you think?" to invite the other person to speak
- Be aware of how much you're talking compared to others
- If you accidentally interrupt, say "Sorry, please continue"
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/social-communication/turn-taking.jpg",
      alt: "Visual showing the back-and-forth nature of conversation",
      caption: "Conversations involve a balanced exchange between people",
    },
    {
      type: "text",
      title: "Simple Questions and Responses",
      body: `
# Keeping the Conversation Going

Questions and responses help maintain the flow of conversation.

## Types of Questions
- **Yes/No Questions**: Have simple yes or no answers
  - "Do you like movies?"
  - "Are you going to the event?"

- **Open-ended Questions**: Invite longer, more detailed answers
  - "What did you do this weekend?"
  - "How do you feel about that?"

- **Follow-up Questions**: Show interest by asking for more information
  - "What kind of movies do you enjoy?"
  - "Why did you choose that option?"

## Answering Questions
When someone asks you a question:
1. Listen carefully to what they're asking
2. Take a moment to think if needed
3. Answer the question directly first
4. Add a bit more information if appropriate
5. Consider asking a related question back

## Example Question and Response
- Question: "Did you watch the game last night?"
- Basic response: "Yes, I did."
- Better response: "Yes, I did. It was really exciting in the last quarter. Did you see it too?"

## Topics for Simple Conversations
- Weather
- Recent or upcoming events
- Shared activities or interests
- Food and restaurants
- Movies, TV shows, or books
- Local news
- Pets
- Hobbies
      `,
    },
    {
      type: "interactive",
      title: "Conversation Practice",
      src: "conversation-exercise",
      description:
        "Interactive exercise where you can practice starting conversations and responding to questions in different scenarios.",
    },
    {
      type: "text",
      title: "Ending Conversations Politely",
      body: `
# Wrapping Up a Conversation

Knowing how to end a conversation politely is as important as knowing how to start one.

## Signs a Conversation Is Ending
- The topic has been fully discussed
- There are longer pauses
- The other person checks the time
- They start using closing language
- Their body language shows they're preparing to leave
- They mention other things they need to do

## Polite Ways to End a Conversation
- "It was nice talking to you."
- "I should get going, but it was great to chat."
- "I need to [reason to leave], but let's talk again soon."
- "Thanks for the conversation. See you later!"
- "I've enjoyed talking. Have a good day!"

## Steps for Ending a Conversation
1. Wait for a natural pause
2. Summarize or acknowledge the conversation positively
3. Give a reason for leaving (if appropriate)
4. Use a closing phrase
5. Say goodbye

## Example of Ending a Conversation
"Well, it was really interesting hearing about your trip to Florida. I should get back to work now, but let's talk more about it later. Have a good afternoon!"

## Following Up Later
If you've enjoyed the conversation, you might:
- Mention something specific to talk about next time
- Suggest meeting again if appropriate
- Thank the person for specific information or help they provided
      `,
    },
    {
      type: "audio",
      title: "Conversation Examples",
      src: "https://example.com/audio/conversation-examples.mp3",
      transcript:
        "This audio presents several example conversations, demonstrating how to start, maintain, and end conversations politely. Each example includes analysis pointing out effective techniques and language used by the speakers.",
    },
  ],
  activities: [
    {
      type: "role-play",
      title: "Conversation Starters Practice",
      instructions: "Practice starting conversations in different scenarios.",
      scenarios: [
        "Meeting a new classmate on the first day of school",
        "Talking to someone sitting next to you on the bus",
        "Starting a conversation with someone in your hobby group",
        "Asking for help from a store employee",
        "Greeting a neighbor you see regularly",
      ],
      steps: [
        "Choose a scenario or have one assigned",
        "Think about an appropriate greeting and conversation starter",
        "Practice with a partner, taking turns in different roles",
        "Get feedback on what worked well and what could be improved",
        "Try a different approach if needed",
      ],
    },
    {
      type: "observation-game",
      title: "Turn-Taking Tennis",
      instructions: "Practice the rhythm of conversation turn-taking.",
      materials: "Soft ball or bean bag (optional)",
      steps: [
        "Sit facing your partner(s)",
        "Person A starts by making a simple statement about any topic",
        "Person B responds to the statement, then adds a related question or comment",
        "Person A responds to Person B, then continues with a related question or comment",
        "Continue passing the conversation back and forth like a tennis match",
        "Optional: Pass a soft ball or bean bag to represent whose turn it is to speak",
      ],
    },
    {
      type: "question-practice",
      title: "Question Variety Practice",
      instructions: "Practice asking different types of questions.",
      topics: ["Favorite foods", "Places visited", "Hobbies", "Movies", "Animals"],
      examples: {
        "Yes/No Question": "Do you like pizza?",
        "Open-ended Question": "What kinds of foods do you enjoy?",
        "Follow-up Question": "Why is pizza your favorite food?",
      },
      steps: [
        "Choose a topic from the list",
        "Create one yes/no question about the topic",
        "Create one open-ended question about the topic",
        "Create one follow-up question based on a potential answer",
        "Practice asking these questions with a partner",
        "Switch roles and repeat with a new topic",
      ],
    },
    {
      type: "social-scenario",
      title: "Conversation Exit Practice",
      instructions: "Practice ending conversations politely in different situations.",
      scenarios: [
        "You need to leave a conversation to catch your bus",
        "You've been talking with someone for 10 minutes at a party and want to talk to others",
        "You need to end a phone call because dinner is ready",
        "You run into a neighbor while shopping but are in a hurry",
        "You've finished discussing a topic with a teacher or boss",
      ],
      steps: [
        "Select a scenario",
        "Plan a polite way to end the conversation",
        "Practice with a partner, including a proper closing and goodbye",
        "Get feedback on how natural and polite your exit seemed",
        "Try different scenarios to practice various situations",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Conversation Basics Quiz",
      questions: [
        {
          question: "Which is generally a good time to start a conversation?",
          options: [
            "When someone is talking on the phone",
            "During a moment of silence in a meeting",
            "When someone makes eye contact and smiles at you",
            "When someone is rushing to catch a bus",
          ],
          correctAnswer: "When someone makes eye contact and smiles at you",
        },
        {
          question: "Which is an example of a good conversation starter?",
          options: [
            "Telling a long story about your day",
            "Asking a personal question about someone's health problems",
            "Making a negative comment about the weather",
            "Commenting on a shared experience or activity",
          ],
          correctAnswer: "Commenting on a shared experience or activity",
        },
        {
          question: "How can you tell it might be your turn to speak in a conversation?",
          options: [
            "The other person is still talking rapidly",
            "The other person pauses and looks at you",
            "The other person just started making an important point",
            "The other person is looking at their phone",
          ],
          correctAnswer: "The other person pauses and looks at you",
        },
        {
          question: "Which is an example of an open-ended question?",
          options: [
            "Did you have a good weekend?",
            "Is this your first time here?",
            "What did you do over the weekend?",
            "Do you like this class?",
          ],
          correctAnswer: "What did you do over the weekend?",
        },
        {
          question: "Which is a polite way to end a conversation?",
          options: [
            "Walking away when the other person is still talking",
            "Saying 'I'm bored with this conversation'",
            "Suddenly changing the subject to something completely different",
            "Saying 'It was nice talking with you, but I need to get going now'",
          ],
          correctAnswer: "Saying 'It was nice talking with you, but I need to get going now'",
        },
      ],
    },
    {
      type: "scenario-based",
      title: "Conversation Scenario Assessment",
      instructions: "Read each scenario and select the most appropriate response.",
      scenarios: [
        {
          scenario: "You see a new person sitting alone in the cafeteria and want to talk to them.",
          question: "What would be an appropriate way to start a conversation?",
          options: [
            "Sit down without saying anything and start eating your lunch",
            "Ask if you can join them and introduce yourself",
            "Tell them they shouldn't sit alone because it looks weird",
            "Stand near their table and wait for them to talk to you",
          ],
          correctAnswer: "Ask if you can join them and introduce yourself",
        },
        {
          scenario:
            "You're talking with someone and they ask if you liked a movie that you actually didn't enjoy.",
          question: "What would be a good response?",
          options: [
            "'That movie was terrible! Anyone who liked it has bad taste.'",
            "'It wasn't really my type of movie, but I liked the special effects. What did you think of it?'",
            "Lie and say you loved it to avoid disagreement",
            "Change the subject without answering their question",
          ],
          correctAnswer:
            "'It wasn't really my type of movie, but I liked the special effects. What did you think of it?'",
        },
        {
          scenario:
            "You've been talking with your neighbor for 10 minutes and need to leave for an appointment.",
          question: "What would be a polite way to end the conversation?",
          options: [
            "Suddenly remember your appointment and run away mid-conversation",
            "Wait for them to end the conversation, even if it makes you late",
            "Interrupt them and say you have to go right away",
            "'I've enjoyed catching up, but I need to head to an appointment now. Let's talk again soon!'",
          ],
          correctAnswer:
            "'I've enjoyed catching up, but I need to head to an appointment now. Let's talk again soon!'",
        },
        {
          scenario:
            "You're in a conversation and realize the other person hasn't had a chance to speak for a while.",
          question: "What would be the best thing to do?",
          options: [
            "Continue talking since they seem interested in what you're saying",
            "Pause and ask, 'What do you think?' or 'How about you?'",
            "Apologize repeatedly for talking too much",
            "End the conversation immediately",
          ],
          correctAnswer: "Pause and ask, 'What do you think?' or 'How about you?'",
        },
      ],
    },
    {
      type: "role-play-evaluation",
      title: "Conversation Skills Demonstration",
      instructions:
        "Demonstrate your conversation skills in a brief role-play with a partner or instructor.",
      scenarios: [
        "Meeting someone new at a community event",
        "Asking for information from a staff member",
        "Chatting with a classmate before class starts",
        "Talking with someone about a shared interest",
      ],
      rubric: {
        "Starting the conversation": "Uses appropriate greeting and conversation starter",
        "Turn-taking": "Listens when the other person speaks and responds appropriately",
        "Asking questions": "Uses different types of questions to maintain the conversation",
        "Ending the conversation": "Concludes the interaction politely",
        "Overall engagement": "Maintains appropriate eye contact and shows interest",
      },
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Conversation Starters List",
      url: "/resources/conversation-starters.pdf",
    },
    { type: "pdf", title: "Turn-Taking Visual Guide", url: "/resources/turn-taking-guide.pdf" },
    {
      type: "link",
      title: "Interactive Conversation Practice",
      url: "https://example.com/conversation-practice",
    },
    {
      type: "video",
      title: "Everyday Conversations Tutorial",
      url: "https://example.com/videos/everyday-conversations",
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
    socialScripts: "Explicit examples of conversation starters and responses",
    visualSupports: "Visual cues for turn-taking and conversation flow",
    predictablePatterns: "Clear frameworks for starting, maintaining, and ending conversations",
    processingTime: "Acknowledgment that pauses to think are acceptable in conversations",
  },
});

// Nonverbal Communication
const nonverbalCommunicationBeginner = createLessonTemplate({
  id: "social-communication-nonverbal-communication-beginner",
  title: "Understanding Body Language",
  description: "Learn to recognize and use basic nonverbal communication signals.",
  category: "Social Communication",
  subcategory: "Nonverbal Communication",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Identify common facial expressions and their meanings",
    "Recognize basic body language signals",
    "Understand the importance of eye contact",
    "Learn about personal space boundaries",
  ],
  content: [
    {
      type: "text",
      title: "What Is Nonverbal Communication?",
      body: `
# Communication Without Words

Nonverbal communication is how we express ourselves without speaking.

## Why Nonverbal Communication Matters
- Makes up a large part of our communication (some say more than 50%)
- Can reveal feelings that words don't express
- Often happens automatically without us realizing it
- Helps us understand the full meaning of what someone is saying
- Varies across cultures and contexts

## Types of Nonverbal Communication
- Facial expressions
- Body posture and movement
- Gestures
- Eye contact
- Personal space
- Touch
- Voice tone and volume (not the words, but how they're said)

## Reading vs. Expressing Nonverbal Cues
This lesson focuses on both:
- How to recognize nonverbal signals from others
- How to be aware of the signals you're sending
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/social-communication/nonverbal-types.jpg",
      alt: "Different types of nonverbal communication illustrated",
      caption: "Various ways we communicate without words",
    },
    {
      type: "text",
      title: "Facial Expressions",
      body: `
# The Face Tells a Story

Our faces show our emotions and reactions.

## Basic Facial Expressions
Most people around the world recognize these expressions:

- **Happy**: Raised cheeks, crinkled eyes, upturned mouth
- **Sad**: Downturned mouth, droopy eyes, raised inner eyebrows
- **Angry**: Lowered eyebrows, intense or narrowed eyes, tight lips or exposed teeth
- **Surprised**: Raised eyebrows, wide eyes, open mouth
- **Disgusted**: Wrinkled nose, raised upper lip, narrowed eyes
- **Fearful**: Raised eyebrows, wide eyes, open mouth, tense lower face
- **Confused**: Furrowed brow, squinted eyes, maybe a tilted head

## Mixed and Subtle Expressions
- People often show combinations of emotions
- Expressions can be very brief (micro-expressions)
- Some people hide or mask their true feelings
- Intensity varies (slightly annoyed vs. very angry)

## Cultural Differences
- Some cultures are more expressive than others
- The meaning of certain expressions may vary
- Rules about when to show emotion differ across cultures

## Reading Faces
When trying to understand someone's facial expression:
- Look at their entire face, not just one feature
- Consider the context and situation
- Pay attention to changes in expression
- Don't assume you always know what someone is feeling
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/social-communication/facial-expressions.jpg",
      alt: "Six basic facial expressions illustrated",
      caption: "The six basic facial expressions recognized across cultures",
    },
    {
      type: "text",
      title: "Body Language Basics",
      body: `
# What Our Bodies Say

Our posture, movements, and gestures communicate messages.

## Common Body Positions and Their Meanings

- **Open posture**: Arms uncrossed, facing the person, relaxed shoulders
  - Usually means: Receptive, friendly, interested

- **Closed posture**: Arms crossed, body turned away, tense shoulders
  - Usually means: Defensive, uncomfortable, not interested

- **Leaning forward**: Moving upper body toward the person
  - Usually means: Interested, engaged, paying attention

- **Leaning back**: Moving upper body away from the person
  - Usually means: Relaxed, casual, or possibly disinterested

- **Standing tall**: Straight posture, head up, shoulders back
  - Usually means: Confident, attentive, assertive

- **Slumped posture**: Rounded shoulders, head down
  - Usually means: Tired, sad, defeated, or relaxed in casual settings

## Common Gestures and Movements

- **Nodding**: Up and down head movement
  - Usually means: Agreement, understanding, encouragement to continue

- **Head shake**: Side to side head movement
  - Usually means: Disagreement, saying "no"

- **Hand gestures while speaking**: Moving hands to emphasize points
  - Usually means: Enthusiasm, trying to explain clearly

- **Fidgeting**: Small repetitive movements (tapping, hair twirling)
  - Usually means: Nervous, bored, impatient, or excess energy

- **Mirroring**: Unconsciously matching another person's posture
  - Usually means: Connection, rapport, agreement
      `,
    },
    {
      type: "video",
      title: "Reading Body Language",
      src: "https://example.com/videos/body-language-basics.mp4",
      transcript:
        "This video demonstrates different body postures and gestures, explaining what they typically communicate. It shows examples of open vs. closed posture, leaning positions, and common gestures. The video emphasizes that body language should be interpreted in context and that multiple signals together provide better information than a single gesture.",
    },
    {
      type: "text",
      title: "Eye Contact",
      body: `
# The Power of Looking

Eye contact is one of the most important forms of nonverbal communication.

## Functions of Eye Contact
- Shows you're paying attention
- Indicates interest in the conversation
- Helps establish connection
- Communicates emotions
- Signals turn-taking in conversation

## Cultural and Individual Differences
- Expected amount of eye contact varies across cultures
- Some cultures consider direct eye contact respectful, others disrespectful
- Neurodivergent individuals may find sustained eye contact uncomfortable
- Personal preference affects comfort with eye contact

## General Guidelines for Eye Contact
- In most Western contexts:
  - Make eye contact when greeting someone
  - Maintain some eye contact while speaking (60-70% of the time is often comfortable)
  - It's natural to look away occasionally when thinking
  - Staring continuously can make people uncomfortable
  - Breaking eye contact completely may signal disinterest

## If Eye Contact Is Difficult
Some people find eye contact challenging. Alternatives include:
- Looking at the bridge of the nose
- Looking at the forehead
- Looking near the person rather than directly at their eyes
- Using more verbal feedback to show you're listening
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/social-communication/eye-contact.jpg",
      alt: "Illustration showing appropriate eye contact during conversation",
      caption: "Comfortable eye contact helps establish connection",
    },
    {
      type: "text",
      title: "Personal Space",
      body: `
# The Invisible Boundary

Personal space is the physical distance we prefer to maintain between ourselves and others.

## Why Personal Space Matters
- Helps people feel comfortable and safe
- Varies based on relationship and context
- Is influenced by culture and individual preference
- Being aware of it shows respect for others

## Typical Personal Space Zones
These vary by culture, but in many Western contexts:

- **Intimate space** (0-18 inches):
  - For very close relationships (family, romantic partners)
  - Also used in crowded situations by necessity

- **Personal space** (18 inches - 4 feet):
  - For conversations with friends, family, acquaintances
  - Comfortable for most casual interactions

- **Social space** (4-12 feet):
  - For interactions with people you don't know well
  - Appropriate for business and casual social gatherings

- **Public space** (12+ feet):
  - For public speaking or formal situations
  - Maintains formality and professionalism

## Reading Personal Space Cues
Signs someone might want more space:
- Taking a step back
- Leaning away
- Crossing arms
- Turning body away
- Looking uncomfortable

## Respecting Personal Space
- Notice if someone steps back (they may want more space)
- Be aware that comfort with closeness varies by person
- Ask before entering someone's personal space
- Respect cultural differences in space preferences
- Understand that some settings (elevators, public transport) require closer proximity
      `,
    },
    {
      type: "interactive",
      title: "Nonverbal Communication Practice",
      src: "nonverbal-exercise",
      description:
        "Interactive exercise where you can practice identifying different nonverbal cues in various scenarios.",
    },
  ],
  activities: [
    {
      type: "expression-recognition",
      title: "Emotion Charades",
      instructions: "Practice identifying facial expressions by playing a guessing game.",
      materials: "Emotion word cards or pictures",
      steps: [
        "One person selects an emotion card without showing others",
        "They express that emotion using only their face",
        "Others try to guess which emotion is being shown",
        "Discuss which facial features helped identify the emotion",
        "Switch roles so everyone has a chance to express emotions",
      ],
    },
    {
      type: "body-language-practice",
      title: "Message Without Words",
      instructions: "Practice communicating different messages using only body language.",
      messages: [
        "I'm interested in what you're saying",
        "I'm bored/not interested",
        "I'm confused by what you're saying",
        "I'm feeling confident",
        "I'm feeling nervous or uncomfortable",
        "I agree with you",
        "I disagree with you",
      ],
      steps: [
        "Choose a message from the list",
        "Without speaking, use your body language to communicate that message",
        "Have others guess what message you're trying to convey",
        "Discuss which specific body language cues communicated the message",
        "Try different ways to express the same message",
      ],
    },
    {
      type: "observation-practice",
      title: "Nonverbal Detective",
      instructions: "Practice observing nonverbal communication in real or recorded interactions.",
      options: [
        "Watch a short video clip with the sound off",
        "Observe people in a public space (with permission if appropriate)",
        "Watch a provided role-play demonstration",
      ],
      observationGuide: {
        facialExpressions: "What emotions are being shown?",
        bodyLanguage: "Are postures open or closed? Relaxed or tense?",
        eyeContact: "How are people using eye contact?",
        personalSpace: "What distances are people maintaining?",
        gestures: "What hand movements or gestures are being used?",
      },
    },
    {
      type: "personal-space-exploration",
      title: "Space Bubbles",
      instructions: "Explore personal space preferences through a physical demonstration.",
      materials: "Open space to move around, optional hula hoops or string circles",
      steps: [
        "Stand facing a partner at a distance of about 10 feet",
        "Slowly walk toward each other",
        "Stop when you start to feel that the other person is getting close to your comfortable boundary",
        "Notice the distance between you",
        "Discuss how this might change based on your relationship with someone",
        "Optional: Use hula hoops or string circles to visualize personal space zones",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Nonverbal Communication Quiz",
      questions: [
        {
          question: "Which facial expression typically shows happiness?",
          options: [
            "Furrowed brows and tight lips",
            "Upturned mouth and crinkled eyes",
            "Wrinkled nose and raised upper lip",
            "Droopy eyes and downturned mouth",
          ],
          correctAnswer: "Upturned mouth and crinkled eyes",
        },
        {
          question: "What does crossing your arms in front of your body often communicate?",
          options: [
            "Openness and friendliness",
            "Excitement and enthusiasm",
            "Defensiveness or discomfort",
            "Leadership and authority",
          ],
          correctAnswer: "Defensiveness or discomfort",
        },
        {
          question: "What is the typical meaning of nodding your head during a conversation?",
          options: [
            "Disagreement with what's being said",
            "Boredom or disinterest",
            "Agreement or understanding",
            "Confusion about the topic",
          ],
          correctAnswer: "Agreement or understanding",
        },
        {
          question: "Which distance is generally considered 'personal space' in Western cultures?",
          options: ["0-18 inches", "18 inches - 4 feet", "4-12 feet", "12+ feet"],
          correctAnswer: "18 inches - 4 feet",
        },
        {
          question: "If someone steps back during a conversation, it might mean:",
          options: [
            "They want to see your whole outfit",
            "They're losing their balance",
            "They want more personal space",
            "They're preparing to leave",
          ],
          correctAnswer: "They want more personal space",
        },
      ],
    },
    {
      type: "scenario-based",
      title: "Reading Nonverbal Cues",
      instructions: "Read each scenario and identify what the nonverbal cues might mean.",
      scenarios: [
        {
          scenario:
            "During a conversation, Taylor maintains eye contact, nods occasionally, and leans slightly forward.",
          question: "What is Taylor likely communicating nonverbally?",
          options: [
            "Boredom with the conversation",
            "Disagreement with what's being said",
            "Interest and engagement in the conversation",
            "Anger or frustration",
          ],
          correctAnswer: "Interest and engagement in the conversation",
        },
        {
          scenario:
            "While you're talking, Jamie crosses their arms, looks at the floor, and steps back slightly.",
          question: "What might Jamie be feeling?",
          options: [
            "Excited and enthusiastic",
            "Uncomfortable or defensive",
            "Completely agreeing with you",
            "Ready to share a story",
          ],
          correctAnswer: "Uncomfortable or defensive",
        },
        {
          scenario:
            "You notice a person with raised eyebrows, wide eyes, and an open mouth after hearing an announcement.",
          question: "What emotion are they likely expressing?",
          options: ["Boredom", "Anger", "Surprise", "Happiness"],
          correctAnswer: "Surprise",
        },
        {
          scenario:
            "In a group setting, someone is standing very close to others, frequently touching their arms during conversation.",
          question: "This person might be from a culture that:",
          options: [
            "Values larger personal space distances",
            "Considers touch an important part of communication",
            "Discourages physical contact completely",
            "Prefers minimal nonverbal communication",
          ],
          correctAnswer: "Considers touch an important part of communication",
        },
      ],
    },
    {
      type: "matching",
      title: "Nonverbal Cues Matching",
      instructions: "Match each nonverbal cue with its most likely meaning.",
      pairs: [
        { cue: "Smiling with crinkled eyes", meaning: "Genuine happiness" },
        { cue: "Arms crossed, body turned away", meaning: "Defensiveness or discomfort" },
        { cue: "Leaning forward during conversation", meaning: "Interest or engagement" },
        { cue: "Continuous, unblinking stare", meaning: "Intensity or intimidation" },
        { cue: "Fidgeting or tapping", meaning: "Nervousness or impatience" },
        { cue: "Taking a step back", meaning: "Desire for more personal space" },
        { cue: "Nodding while listening", meaning: "Agreement or understanding" },
        { cue: "Mirroring another's posture", meaning: "Connection or rapport" },
      ],
    },
  ],
  resources: [
    { type: "pdf", title: "Facial Expressions Guide", url: "/resources/facial-expressions.pdf" },
    { type: "pdf", title: "Body Language Reference Sheet", url: "/resources/body-language.pdf" },
    {
      type: "link",
      title: "Interactive Nonverbal Communication Practice",
      url: "https://example.com/nonverbal-practice",
    },
    {
      type: "video",
      title: "Cultural Differences in Nonverbal Communication",
      url: "https://example.com/videos/cultural-nonverbal",
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
    socialScripts: "Explicit descriptions of what different nonverbal cues typically mean",
    eyeContactAlternatives:
      "Acknowledges that eye contact may be difficult and offers alternatives",
    sensoryConsiderations: "Respects different comfort levels with personal space and touch",
    explicitTeaching: "Breaks down subtle social cues that may not be automatically understood",
  },
});

// Export all Social Communication lessons
export const socialCommunicationLessons = [
  conversationSkillsBeginner,
  nonverbalCommunicationBeginner,
  // More social communication lessons would be added here
];
