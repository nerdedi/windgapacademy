import { createLessonTemplate, DIFFICULTY_LEVELS } from "../lessonModel";

/**
 * Literacy & Language Lessons - All difficulty levels
 */

// Reading Skills
const readingSkillsBeginner = createLessonTemplate({
  id: "literacy-language-reading-skills-beginner",
  title: "Basic Reading: Words and Short Texts",
  description:
    "Learn fundamental reading skills to recognize common words and understand short texts.",
  category: "Literacy & Language",
  subcategory: "Reading Skills",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Recognize and read common sight words",
    "Sound out simple words using phonics",
    "Read and understand short sentences",
    "Build reading confidence with simple texts",
  ],
  content: [
    {
      type: "text",
      title: "Why Reading Matters",
      body: `
# The Importance of Reading

Reading helps us in many parts of our daily lives.

## How Reading Helps Us
- Understand written information like signs and notices
- Follow instructions and directions
- Enjoy stories and learn new things
- Connect with others through messages and social media
- Complete forms and applications
- Read labels on food, medicine, and other products

## Basic Reading Skills
- **Letter recognition**: Knowing what each letter looks like and sounds like
- **Phonics**: Connecting letters to sounds
- **Word recognition**: Identifying whole words quickly
- **Comprehension**: Understanding what you read
- **Fluency**: Reading smoothly without stopping too much
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/literacy-language/reading-uses.jpg",
      alt: "Examples of reading in everyday life",
      caption: "Reading is used in many everyday situations",
    },
    {
      type: "text",
      title: "Common Sight Words",
      body: `
# Important Words to Recognize

Some words appear so frequently that it's helpful to recognize them instantly.

## What Are Sight Words?
- Words that appear very often in text
- Often don't follow standard phonics rules
- Learning to recognize them instantly improves reading speed and confidence

## Common Sight Words
Here are some of the most common sight words:

the, and, a, to, in, is, you, that, it, he
she, was, for, on, are, as, with, his, they, at
be, this, from, have, or, by, one, had, not, but
what, all, were, when, we, there, can, an, your, which

## Practicing Sight Words
- Look for these words in texts you read
- Make flashcards to practice
- Try to recognize them without sounding out each letter
- Notice how often they appear in sentences
      `,
    },
    {
      type: "video",
      title: "Recognizing Common Words",
      src: "https://example.com/videos/sight-words.mp4",
      transcript:
        "This video introduces common sight words and demonstrates how to recognize them in context. It shows examples of sight words in everyday texts and provides practice opportunities with interactive pauses.",
    },
    {
      type: "text",
      title: "Sounding Out Words",
      body: `
# Using Phonics to Read Words

When you encounter unfamiliar words, you can use phonics to sound them out.

## Basic Phonics Steps
1. Look at each letter or group of letters
2. Say the sound that each letter or group makes
3. Blend the sounds together
4. Say the word faster until it sounds natural

## Letter Sounds
- **Consonants**: Generally make consistent sounds (b, c, d, f, etc.)
- **Vowels**: Can make different sounds (a, e, i, o, u)
  - Short vowel sounds: cat, pet, sit, hot, but
  - Long vowel sounds: cake, these, like, home, use

## Common Letter Combinations
- **th**: makes either a soft sound (think) or hard sound (the)
- **sh**: makes a "shh" sound (ship, shop)
- **ch**: makes a "ch" sound (chair, lunch)
- **wh**: usually makes a "w" sound (what, when)
- **-ing**: added to verbs (walking, talking)

## Practice Words
Try sounding out these words:
- cat, dog, run, big, fan
- stop, grab, plan, swim, frog
- jump, desk, milk, tent, lift
      `,
    },
    {
      type: "interactive",
      title: "Word Sounding Practice",
      src: "phonics-practice-exercise",
      description:
        "Practice sounding out words with this interactive exercise. Click on each word to hear it pronounced, then try to sound it out yourself.",
    },
    {
      type: "text",
      title: "Reading Short Sentences",
      body: `
# Understanding Sentences

Once you can read individual words, the next step is reading complete sentences.

## Parts of a Sentence
- Usually starts with a capital letter
- Contains at least one complete thought
- Ends with punctuation (period, question mark, or exclamation point)

## Reading Sentence Steps
1. Identify words you recognize instantly
2. Sound out unfamiliar words
3. Read the whole sentence
4. Think about what it means
5. Re-read if necessary

## Common Sentence Structures
- **Statements**: Give information and end with a period (.)
  - "The bus is coming."
- **Questions**: Ask something and end with a question mark (?)
  - "Where is the bus?"
- **Exclamations**: Show strong feeling and end with an exclamation point (!)
  - "The bus is here!"

## Practice Sentences
Try reading these sentences:
- The cat sat on the mat.
- I can see a big dog.
- Where is my red book?
- She likes to read at night.
- We went to the park.
      `,
    },
    {
      type: "audio",
      title: "Sentence Reading Practice",
      src: "https://example.com/audio/sentence-practice.mp3",
      transcript:
        "This audio provides practice reading simple sentences. Each sentence is read aloud, with pauses for the listener to repeat. The speaker then explains key words and the meaning of each sentence.",
    },
    {
      type: "text",
      title: "Reading Short Texts",
      body: `
# Putting It All Together

Let's practice reading and understanding a short text.

## Sample Text: A Day at the Park

I went to the park today. The sun was bright and warm. I saw many dogs playing on the grass. Some children were on the swings. I sat on a bench and ate my lunch. It was a ham sandwich and an apple. After lunch, I walked around the lake. I saw ducks swimming in the water. It was a good day at the park.

## Reading Strategies
- Read one sentence at a time
- Look for words you know
- Sound out words you don't know
- Think about what's happening in the story
- Look at any pictures that go with the text
- Re-read parts that are confusing

## Checking Understanding
After reading, ask yourself:
- Who was in the story?
- Where did it take place?
- What happened?
- When did it happen?
- How did it make you feel?
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/literacy-language/park-scene.jpg",
      alt: "Illustration of a park scene with people, dogs, and a lake",
      caption: "A scene from 'A Day at the Park' reading passage",
    },
  ],
  activities: [
    {
      type: "sight-word-practice",
      title: "Sight Word Bingo",
      instructions: "Play Bingo with common sight words. Mark each word as it's called out.",
      materials: "Bingo cards with sight words, markers or tokens",
      steps: [
        "Each player gets a bingo card with sight words",
        "Caller randomly selects and reads sight words",
        "Players mark the word if it's on their card",
        "First player to complete a row (vertical, horizontal, or diagonal) calls 'Bingo!'",
        "Player must read all marked words correctly to win",
      ],
    },
    {
      type: "phonics-challenge",
      title: "Word Building",
      instructions: "Build words by combining letter cards or tiles.",
      wordLists: [
        {
          category: "Three-letter words",
          words: ["cat", "dog", "run", "big", "map", "sun", "hat"],
        },
        {
          category: "Four-letter words",
          words: ["jump", "stop", "fish", "milk", "desk", "hand"],
        },
        {
          category: "Words with blends",
          words: ["frog", "swim", "flag", "grab", "drop", "trip"],
        },
      ],
    },
    {
      type: "reading-comprehension",
      title: "Picture Story Sequence",
      instructions: "Read the short story, then arrange the pictures in the correct order.",
      story:
        "Tom went to the store. He bought some milk and bread. On the way home, he saw his friend. They talked for a while. Then Tom went home and put the groceries away.",
      pictures: [
        "tom-at-store.jpg",
        "tom-buying-groceries.jpg",
        "tom-meeting-friend.jpg",
        "tom-at-home.jpg",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Reading Basics Quiz",
      questions: [
        {
          question: "Which of these is a sight word?",
          options: ["elephant", "the", "computer", "banana"],
          correctAnswer: "the",
        },
        {
          question: "What punctuation mark ends a question?",
          options: ["Period (.)", "Question mark (?)", "Exclamation point (!)", "Comma (,)"],
          correctAnswer: "Question mark (?)",
        },
        {
          question: "Which word has a short 'a' sound?",
          options: ["cake", "cat", "ate", "day"],
          correctAnswer: "cat",
        },
        {
          question: "What is the first step when trying to read an unfamiliar word?",
          options: [
            "Skip it and read the rest of the sentence",
            "Ask someone else to read it",
            "Look at each letter or group of letters",
            "Guess based on the first letter",
          ],
          correctAnswer: "Look at each letter or group of letters",
        },
        {
          question: "Which sentence is a question?",
          options: [
            "The dog is black.",
            "Where is my book?",
            "I like pizza!",
            "We went to the store.",
          ],
          correctAnswer: "Where is my book?",
        },
      ],
    },
    {
      type: "reading-performance",
      title: "Reading Aloud Assessment",
      instructions:
        "Read the following passage aloud. Your instructor will note your accuracy and fluency.",
      passage:
        "My name is Sam. I have a pet cat. Her name is Bella. She is black and white. Bella likes to sleep on my bed. She plays with her toys every day. I give her food and water. Bella is a good cat.",
      rubric: {
        "Word Recognition": "Correctly reads common sight words",
        "Phonics Application": "Successfully sounds out unfamiliar words",
        Fluency: "Reads at a reasonable pace with appropriate pauses",
        Comprehension: "Can answer basic questions about the text after reading",
      },
    },
    {
      type: "comprehension-check",
      title: "Short Text Comprehension",
      instructions: "Read the short text and answer the questions.",
      text: "Jin went to the shop. He wanted to buy a gift for his mom. Her birthday was tomorrow. Jin looked at many things. He saw a blue scarf. His mom likes blue. Jin bought the scarf and a card. He was happy with his gift.",
      questions: [
        {
          question: "Who was Jin buying a gift for?",
          options: ["His dad", "His friend", "His mom", "His teacher"],
          correctAnswer: "His mom",
        },
        {
          question: "Why was Jin buying a gift?",
          options: ["For Christmas", "For a birthday", "For graduation", "Just because"],
          correctAnswer: "For a birthday",
        },
        {
          question: "What color was the scarf Jin bought?",
          options: ["Red", "Green", "Blue", "Yellow"],
          correctAnswer: "Blue",
        },
        {
          question: "What else did Jin buy besides the scarf?",
          options: ["Flowers", "Chocolate", "A card", "A cake"],
          correctAnswer: "A card",
        },
      ],
    },
  ],
  resources: [
    { type: "pdf", title: "Sight Words Flashcards", url: "/resources/sight-words-cards.pdf" },
    { type: "pdf", title: "Phonics Sound Chart", url: "/resources/phonics-chart.pdf" },
    {
      type: "link",
      title: "Interactive Reading Practice",
      url: "https://example.com/reading-practice",
    },
    {
      type: "video",
      title: "Reading Strategies Tutorial",
      url: "https://example.com/videos/reading-strategies",
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
    multisensoryApproach: "Visual, auditory, and hands-on reading activities",
    incrementalProgress: "Building from letters to words to sentences to short texts",
    repetitionAndPractice: "Multiple opportunities to practice each skill",
    visualSupports: "Images and visual cues to support text comprehension",
  },
});

// Writing Skills
const writingSkillsBeginner = createLessonTemplate({
  id: "literacy-language-writing-skills-beginner",
  title: "Basic Writing: From Words to Sentences",
  description:
    "Learn fundamental writing skills to express yourself through words and simple sentences.",
  category: "Literacy & Language",
  subcategory: "Writing Skills",
  difficultyLevel: DIFFICULTY_LEVELS.BEGINNER,
  duration: 45,
  learningObjectives: [
    "Write common words with correct spelling",
    "Form legible letters and words",
    "Construct simple sentences",
    "Express basic ideas in writing",
  ],
  content: [
    {
      type: "text",
      title: "Why Writing Matters",
      body: `
# The Importance of Writing

Writing helps us communicate and express ourselves.

## How Writing Helps Us
- Communicate with others when we're not face-to-face
- Record information we want to remember
- Express our thoughts and feelings
- Complete necessary forms and applications
- Create lists and reminders
- Share our stories and ideas

## Basic Writing Skills
- **Letter formation**: Writing clear, legible letters
- **Spelling**: Using the correct letters to form words
- **Grammar**: Using the right word forms and order
- **Punctuation**: Using marks like periods and commas correctly
- **Clarity**: Expressing ideas in a way others can understand
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/literacy-language/writing-examples.jpg",
      alt: "Examples of writing in everyday life",
      caption: "Writing is used in many everyday situations",
    },
    {
      type: "text",
      title: "Forming Letters",
      body: `
# Writing Clear Letters

Letters need to be formed clearly so others can read them.

## Handwriting Tips
- Hold your pen or pencil comfortably but firmly
- Position your paper at a slight angle
- Write on lined paper to help keep letters even
- Leave space between words
- Practice regular, consistent letter sizes
- Focus on clarity rather than speed

## Troublesome Letter Pairs
Some letters can look similar if not formed carefully:
- b and d
- p and q
- m and n
- i and l
- u and v

## Letter Case
- **Uppercase (Capital) Letters**: Used at the beginning of sentences and for proper names
- **Lowercase Letters**: Used for most writing

## Practicing Letter Formation
- Trace letters first if needed
- Say the letter sound as you write it
- Practice problem letters more often
- Write slowly and deliberately when learning
      `,
    },
    {
      type: "video",
      title: "Letter Formation Basics",
      src: "https://example.com/videos/letter-formation.mp4",
      transcript:
        "This video demonstrates proper techniques for forming both uppercase and lowercase letters. It shows hand positioning, paper positioning, and the correct sequence of strokes for each letter. Problem letter pairs are highlighted with extra examples.",
    },
    {
      type: "text",
      title: "Spelling Common Words",
      body: `
# Writing Words Correctly

Spelling is important for clear communication.

## Spelling Strategies
1. **Sound it out**: Break the word into sounds and write the letters that make those sounds
2. **Look for patterns**: Many words follow similar spelling patterns
3. **Learn sight words**: Common words that don't follow typical spelling rules
4. **Use memory tricks**: Create a phrase or image to help remember tricky words
5. **Practice regularly**: The more you write words, the better you'll remember them

## Common Spelling Patterns
- **CVC words**: Consonant-Vowel-Consonant (cat, dog, run)
- **Silent E**: Makes the vowel say its name (like, home, tune)
- **Double Consonants**: Often after short vowels (will, mess, ball)
- **Common Endings**: -ing, -ed, -er, -est

## Frequently Used Words to Practice
- the, and, that, have, with
- this, from, they, what, were
- when, your, said, there, some
- would, could, should, their, people
      `,
    },
    {
      type: "interactive",
      title: "Spelling Practice",
      src: "spelling-exercise",
      description:
        "Practice spelling common words with this interactive exercise. Type the correct spelling for each word you hear.",
    },
    {
      type: "text",
      title: "Writing Simple Sentences",
      body: `
# Creating Basic Sentences

A sentence expresses a complete thought.

## Parts of a Sentence
- **Subject**: Who or what the sentence is about
- **Verb**: The action or state of being
- **Object**: (Sometimes) What receives the action

## Basic Sentence Structure
- **Subject + Verb**: "Tom walks."
- **Subject + Verb + Object**: "Tom walks his dog."

## Sentence Rules
1. Start with a capital letter
2. End with punctuation (period, question mark, exclamation point)
3. Include at least one subject and one verb
4. Express a complete thought

## Types of Simple Sentences
- **Statements**: "I like pizza."
- **Questions**: "Do you like pizza?"
- **Commands**: "Eat your pizza."
- **Exclamations**: "That pizza is delicious!"

## Common Sentence Problems
- **Fragments**: Incomplete thoughts missing subjects or verbs
- **Run-ons**: Multiple thoughts without proper punctuation
      `,
    },
    {
      type: "image",
      src: "/assets/lessons/literacy-language/sentence-structure.jpg",
      alt: "Visual diagram showing the parts of a sentence",
      caption: "Basic parts of a simple sentence",
    },
    {
      type: "text",
      title: "Writing About Yourself",
      body: `
# Expressing Personal Information

A good first writing project is describing yourself and your life.

## Topics to Write About
- Your name and age
- Where you live
- Your family and friends
- Things you like to do
- Your daily routine
- Your favorite foods, colors, movies, etc.

## Sample Personal Paragraph

My name is Alex. I am 25 years old. I live in an apartment with my cat, Whiskers. I work at a grocery store. I like to watch movies and play games. My favorite food is pizza. On weekends, I visit my family. I have two brothers and one sister. We like to play cards together.

## Steps to Write About Yourself
1. Brainstorm facts about yourself
2. Organize your ideas (personal details, likes/dislikes, daily life)
3. Write simple sentences about each topic
4. Put related sentences together
5. Read your writing aloud to check if it makes sense
6. Fix any errors you notice
      `,
    },
    {
      type: "video",
      title: "Writing About Yourself",
      src: "https://example.com/videos/personal-writing.mp4",
      transcript:
        "This video guides viewers through the process of writing a short personal paragraph. It demonstrates brainstorming personal details, organizing ideas, and writing simple, clear sentences. The video shows examples of well-constructed personal paragraphs and common mistakes to avoid.",
    },
  ],
  activities: [
    {
      type: "letter-practice",
      title: "Letter Formation Practice",
      instructions: "Practice writing each letter of the alphabet clearly.",
      template: {
        uppercase: "A B C D E F G H I J K L M N O P Q R S T U V W X Y Z",
        lowercase: "a b c d e f g h i j k l m n o p q r s t u v w x y z",
        troublesome: "b d, p q, m n, i l, u v",
      },
    },
    {
      type: "word-writing",
      title: "Common Words Practice",
      instructions: "Write each word three times, focusing on correct spelling.",
      wordGroups: [
        ["the", "and", "that", "have", "with"],
        ["this", "from", "they", "what", "were"],
        ["when", "your", "said", "there", "some"],
        ["would", "could", "should", "their", "people"],
      ],
    },
    {
      type: "sentence-building",
      title: "Simple Sentence Construction",
      instructions: "Create sentences using the provided subjects and verbs.",
      wordSets: [
        {
          subjects: ["I", "You", "He", "She", "We", "They"],
          verbs: ["walk", "eat", "sleep", "read", "write", "play"],
          objects: ["food", "books", "games", "music", "sports"],
        },
      ],
      examples: ["I eat food.", "She reads books.", "They play games."],
    },
    {
      type: "personal-writing",
      title: "All About Me",
      instructions: "Write a short paragraph about yourself using simple sentences.",
      prompts: [
        "What is your name?",
        "How old are you?",
        "Where do you live?",
        "Who is in your family?",
        "What do you like to do?",
        "What is your favorite food?",
        "What is your daily routine?",
      ],
    },
  ],
  assessments: [
    {
      type: "multiple-choice",
      title: "Writing Basics Quiz",
      questions: [
        {
          question: "Which of these is a complete sentence?",
          options: [
            "Walking to the store.",
            "The big dog.",
            "She runs fast.",
            "Yesterday at home.",
          ],
          correctAnswer: "She runs fast.",
        },
        {
          question: "What should every sentence start with?",
          options: ["A number", "A capital letter", "A verb", "A quotation mark"],
          correctAnswer: "A capital letter",
        },
        {
          question: "Which word is spelled correctly?",
          options: ["freind", "friend", "frend", "freend"],
          correctAnswer: "friend",
        },
        {
          question: "What is the subject in this sentence: 'The cat sleeps on the bed.'?",
          options: ["cat", "sleeps", "bed", "on"],
          correctAnswer: "cat",
        },
        {
          question: "Which punctuation mark ends a question?",
          options: ["Period (.)", "Question mark (?)", "Comma (,)", "Exclamation point (!)"],
          correctAnswer: "Question mark (?)",
        },
      ],
    },
    {
      type: "writing-task",
      title: "Sentence Writing Assessment",
      instructions: "Write five complete sentences about your favorite activity or hobby.",
      rubric: {
        Clarity: "Ideas are clearly expressed",
        "Sentence Structure": "Each sentence is complete with subject and verb",
        Mechanics: "Correct capitalization and punctuation",
        Spelling: "Common words are spelled correctly",
        "Handwriting/Typing": "Text is legible and properly formatted",
      },
    },
    {
      type: "sentence-correction",
      title: "Fix the Sentences",
      instructions: "Correct the errors in each sentence.",
      sentences: [
        {
          original: "i like to swim",
          issues: ["No capital letter at beginning", "No period at end"],
          corrected: "I like to swim.",
        },
        {
          original: "she go to the store",
          issues: ["Incorrect verb form"],
          corrected: "She goes to the store.",
        },
        {
          original: "The dog barking loud.",
          issues: ["Incomplete sentence - missing helping verb"],
          corrected: "The dog is barking loud.",
        },
        {
          original: "they has three cats",
          issues: ["Incorrect verb form with 'they'"],
          corrected: "They have three cats.",
        },
        {
          original: "we watched a movie it was good",
          issues: ["Run-on sentence - needs period between thoughts"],
          corrected: "We watched a movie. It was good.",
        },
      ],
    },
  ],
  resources: [
    {
      type: "pdf",
      title: "Handwriting Practice Sheets",
      url: "/resources/handwriting-practice.pdf",
    },
    { type: "pdf", title: "Common Words Spelling List", url: "/resources/spelling-list.pdf" },
    {
      type: "link",
      title: "Interactive Sentence Builder",
      url: "https://example.com/sentence-builder",
    },
    {
      type: "video",
      title: "Writing Simple Sentences",
      url: "https://example.com/videos/simple-sentences",
    },
  ],
  accessibilityFeatures: {
    visualAids: true,
    screenReaderFriendly: true,
    highContrast: true,
    simplifiedLanguage: true,
    alternativeInputMethods: true,
  },
  neurodivergentConsiderations: {
    clearStructure: true,
    multisensoryApproach: "Visual, tactile, and verbal writing practice",
    incrementalProgress: "Building from letters to words to sentences",
    executiveFunctionSupport: "Templates and structured writing prompts",
    motorSkillConsiderations:
      "Options for typing or dictation for those with fine motor challenges",
  },
});

// Export all Literacy & Language lessons
export const literacyLanguageLessons = [
  readingSkillsBeginner,
  writingSkillsBeginner,
  // More literacy & language lessons would be added here
];
