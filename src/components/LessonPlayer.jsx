import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { useUser } from "../app/UserContext";
import { getUserDoc, setUserDoc } from "../app/firestoreClient";
import { useLesson } from "../contexts/LessonContext.tsx";
import { cardVariant, charBob, feedbackPop, staggerGrid, stepSlide } from "../utils/animations";
import { MiniAvatar } from "./CharacterAvatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Progress } from "./ui/progress";

// Maps curriculum course IDs (from CourseLibrary) → {subject, topic, title, character}
const COURSE_TO_LESSON = {
  // Life skills
  "cooking-basics": {
    subject: "independence",
    topic: "daily-living",
    title: "Cooking Basics",
    character: "indy",
  },
  "healthy-eating": {
    subject: "numeracy",
    topic: "counting",
    title: "Healthy Eating & Budgeting",
    character: "nia",
  },
  "home-safety": {
    subject: "independence",
    topic: "safety",
    title: "Home Safety",
    character: "indy",
  },
  "hygiene-personal-care": {
    subject: "independence",
    topic: "daily-living",
    title: "Personal Hygiene",
    character: "indy",
  },
  "safety-in-community": {
    subject: "independence",
    topic: "safety",
    title: "Community Safety",
    character: "indy",
  },
  "shopping-money-handling": {
    subject: "numeracy",
    topic: "counting",
    title: "Shopping & Money",
    character: "nia",
  },
  "time-management": {
    subject: "independence",
    topic: "daily-living",
    title: "Time Management",
    character: "indy",
  },
  "time-management-work": {
    subject: "independence",
    topic: "daily-living",
    title: "Time Management at Work",
    character: "indy",
  },
  "travel-training": {
    subject: "independence",
    topic: "transport",
    title: "Travel Training",
    character: "indy",
  },
  "using-public-services": {
    subject: "independence",
    topic: "community",
    title: "Using Public Services",
    character: "indy",
  },
  "communication-asking-for-help": {
    subject: "language",
    topic: "phonics",
    title: "Asking for Help",
    character: "lana",
  },
  // Employment skills
  "communication-at-work": {
    subject: "language",
    topic: "phonics",
    title: "Communication at Work",
    character: "lana",
  },
  "interview-practice": {
    subject: "language",
    topic: "phonics",
    title: "Interview Practice",
    character: "lana",
  },
  "resume-writing": {
    subject: "literacy",
    topic: "reading",
    title: "Resume Writing",
    character: "leo",
  },
  "workplace-rights": {
    subject: "literacy",
    topic: "reading",
    title: "Workplace Rights",
    character: "leo",
  },
  "workplace-behaviour": {
    subject: "independence",
    topic: "daily-living",
    title: "Workplace Behaviour",
    character: "indy",
  },
  "workplace-safety": {
    subject: "independence",
    topic: "safety",
    title: "Workplace Safety",
    character: "indy",
  },
  "digital-skills-work": {
    subject: "digital",
    topic: "literacy",
    title: "Digital Skills for Work",
    character: "dex",
  },
  // LLND / academic
  "language-phonics": {
    subject: "language",
    topic: "phonics",
    title: "Language & Phonics",
    character: "lana",
  },
  "literacy-reading": {
    subject: "literacy",
    topic: "reading",
    title: "Literacy & Reading",
    character: "leo",
  },
  "numeracy-counting": {
    subject: "numeracy",
    topic: "counting",
    title: "Numeracy & Counting",
    character: "nia",
  },
  "digital-literacy": {
    subject: "digital",
    topic: "literacy",
    title: "Digital Literacy",
    character: "dex",
  },
  "independence-skills": {
    subject: "independence",
    topic: "daily-living",
    title: "Independence Skills",
    character: "indy",
  },
};

// Domain ID → lesson mapping (from CourseLibrary ?domain= links)
const DOMAIN_TO_LESSON = {
  language: { subject: "language", topic: "phonics", character: "lana" },
  literacy: { subject: "literacy", topic: "reading", character: "leo" },
  numeracy: { subject: "numeracy", topic: "counting", character: "nia" },
  digital: { subject: "digital", topic: "literacy", character: "dex" },
  "life-skills": { subject: "independence", topic: "daily-living", character: "indy" },
  employment: { subject: "independence", topic: "daily-living", character: "indy" },
};

// Helper: speak with Australian English voice preference
let _auVoice = null;
function speakAussie(text) {
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const trySpeak = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!_auVoice && voices.length) {
      _auVoice =
        voices.find((v) => v.lang === "en-AU") ||
        voices.find((v) => v.lang.startsWith("en-AU")) ||
        voices.find((v) => v.name.toLowerCase().includes("australia")) ||
        voices.find((v) => v.lang === "en-GB") ||
        voices.find((v) => v.lang.startsWith("en")) ||
        null;
    }
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.82;
    u.pitch = 1.05;
    if (_auVoice) u.voice = _auVoice;
    window.speechSynthesis.speak(u);
  };
  const voices = window.speechSynthesis.getVoices();
  if (voices.length) {
    trySpeak();
  } else {
    window.speechSynthesis.onvoiceschanged = () => {
      trySpeak();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }
}

// Lesson content for each subject/topic
const lessonData = {
  language: {
    phonics: {
      title: "Language & Communication",
      character: "lana",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "Welcome to Language & Communication! In this lesson you will learn how to speak clearly, listen well, and ask for help when you need it. Your guide Lana the Owl will be with you every step of the way.",
        },
        {
          id: "vowels",
          type: "interactive",
          title: "Vowel Sounds",
          content: "Practice vowel sounds: A, E, I, O, U — the building blocks of words!",
        },
        {
          id: "consonants",
          type: "interactive",
          title: "Consonant Sounds",
          content: "Practice consonant sounds — the other 21 letters.",
        },
        {
          id: "asking",
          type: "interactive",
          title: "Asking for Help",
          content:
            "Asking for help is a skill! Practise saying: 'Excuse me, could you help me please?'",
        },
        {
          id: "quiz",
          type: "quiz",
          title: "Language Quiz",
          content: "Time to test what you have learned!",
        },
      ],
    },
  },
  literacy: {
    reading: {
      title: "Literacy & Reading",
      character: "leo",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "Welcome to Literacy & Reading! Reading helps you understand the world around you. Leo the Lion will guide you through stories, signs and more.",
        },
        {
          id: "vocabulary",
          type: "interactive",
          title: "Sight Words",
          content: "Learn the most common words you will see everywhere.",
        },
        {
          id: "story",
          type: "text",
          title: "Read a Story",
          content:
            "Mia woke up on a bright sunny day. She packed her bag and walked to the park. She saw flowers, birds, and a little dog chasing a butterfly. On the way home, she stopped at the bakery and bought fresh bread. It smelled amazing! When she got home, she told her mum all about her wonderful morning.",
        },
        {
          id: "signs",
          type: "interactive",
          title: "Signs & Symbols",
          content: "Read everyday signs and symbols you see in the community.",
        },
        { id: "quiz", type: "quiz", title: "Literacy Quiz", content: "Test your reading skills!" },
      ],
    },
  },
  numeracy: {
    counting: {
      title: "Numeracy & Money",
      character: "nia",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "Welcome to Numeracy! Numbers and maths are part of everyday life — from counting your change to reading a timetable. Nia the Penguin will guide you.",
        },
        {
          id: "counting",
          type: "interactive",
          title: "Counting Practice",
          content: "Count objects and practise your numbers 1–20.",
        },
        {
          id: "addition",
          type: "interactive",
          title: "Simple Addition",
          content: "Add small numbers together. You can use your fingers — that is fine!",
        },
        {
          id: "money",
          type: "interactive",
          title: "Australian Coins",
          content: "Recognise Australian coins and notes.",
        },
        { id: "quiz", type: "quiz", title: "Numeracy Quiz", content: "Test your maths skills!" },
      ],
    },
  },
  digital: {
    literacy: {
      title: "Digital Literacy",
      character: "dex",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "Welcome to Digital Literacy! Dex the Fox will teach you about devices, staying safe online, and using technology every day.",
        },
        {
          id: "devices",
          type: "interactive",
          title: "Parts of a Device",
          content: "Learn the names and purposes of parts of a computer, tablet or phone.",
        },
        {
          id: "safety",
          type: "interactive",
          title: "Internet Safety",
          content: "Learn the rules for staying safe online.",
        },
        {
          id: "email",
          type: "interactive",
          title: "Writing an Email",
          content: "Practise writing a professional email using the right format.",
        },
        { id: "quiz", type: "quiz", title: "Digital Quiz", content: "Test your digital literacy!" },
      ],
    },
  },
  independence: {
    "daily-living": {
      title: "Independence & Daily Living",
      character: "indy",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "Welcome to Independence Skills! Indy the Koala will help you build the skills to live and work more independently every day.",
        },
        {
          id: "routine",
          type: "interactive",
          title: "Daily Routine",
          content: "Build a morning, afternoon and evening routine that works for you.",
        },
        {
          id: "transport",
          type: "interactive",
          title: "Public Transport",
          content: "Read a bus timetable and plan your journey.",
        },
        {
          id: "emergency",
          type: "interactive",
          title: "Emergency Contacts",
          content: "Learn important phone numbers for emergencies.",
        },
        {
          id: "quiz",
          type: "quiz",
          title: "Independence Quiz",
          content: "Test what you have learned!",
        },
      ],
    },
    safety: {
      title: "Safety Skills",
      character: "indy",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "Safety is important at home and in the community. Indy will help you recognise risks and know what to do.",
        },
        {
          id: "home",
          type: "interactive",
          title: "Home Safety",
          content: "Learn about safety hazards at home and how to avoid them.",
        },
        {
          id: "community",
          type: "interactive",
          title: "Community Safety",
          content: "Stay safe when out and about in the community.",
        },
        {
          id: "emergency",
          type: "interactive",
          title: "Emergency Numbers",
          content: "Know the most important numbers to call in an emergency.",
        },
        { id: "quiz", type: "quiz", title: "Safety Quiz", content: "Test your safety knowledge!" },
      ],
    },
    transport: {
      title: "Getting Around",
      character: "indy",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "Learning to use public transport gives you independence. Indy will guide you through timetables, tickets and travel tips.",
        },
        {
          id: "timetable",
          type: "interactive",
          title: "Reading a Timetable",
          content: "Find bus and train times on a timetable.",
        },
        {
          id: "tickets",
          type: "text",
          title: "Buying a Ticket",
          content:
            "You can buy a myki or Opal card to tap on and off buses and trains. Keep it topped up! Concession cards give you a cheaper price if you are eligible.",
        },
        {
          id: "quiz",
          type: "quiz",
          title: "Transport Quiz",
          content: "Show what you know about getting around!",
        },
      ],
    },
    community: {
      title: "Using Community Services",
      character: "indy",
      steps: [
        {
          id: "intro",
          type: "text",
          title: "Welcome!",
          content:
            "There are many helpful services in your community — libraries, Centrelink, health clinics and more. Let us explore them together!",
        },
        {
          id: "library",
          type: "text",
          title: "The Library",
          content:
            "Your local library is free! You can borrow books, use computers, attend events and get help from librarians. You just need a library card — ask at the front desk.",
        },
        {
          id: "centrelink",
          type: "text",
          title: "Centrelink & Services Australia",
          content:
            "Centrelink can help with payments like the Disability Support Pension (DSP). You can call 13 27 17 or visit myGov online. An NDIS support worker can help you navigate this.",
        },
        {
          id: "quiz",
          type: "quiz",
          title: "Community Services Quiz",
          content: "Test your knowledge!",
        },
      ],
    },
  },
};

// Quiz questions per subject/topic
const QUIZ_QUESTIONS = {
  "language-phonics": {
    question: "Which of these is a vowel?",
    options: ["B", "E", "T"],
    correct: 1,
  },
  "literacy-reading": {
    question: "What does a 'No Entry' sign mean?",
    options: ["Park here", "You cannot go in", "Go this way"],
    correct: 1,
  },
  "numeracy-counting": { question: "What is 5 + 7?", options: ["11", "12", "13"], correct: 1 },
  "digital-literacy": {
    question: "What should you do if a stranger asks for your address online?",
    options: ["Give it to them", "Ignore and tell a trusted adult", "Share your school instead"],
    correct: 1,
  },
  "independence-daily-living": {
    question: "Which number do you call for ANY emergency in Australia?",
    options: ["131", "000", "112"],
    correct: 1,
  },
  "independence-safety": {
    question: "If you see a fire, what should you do first?",
    options: ["Try to put it out yourself", "Leave the building and call 000", "Hide under a desk"],
    correct: 1,
  },
  "independence-transport": {
    question: "What does a timetable show?",
    options: ["What food to eat", "When buses and trains depart", "Weather forecasts"],
    correct: 1,
  },
  "independence-community": {
    question: "What is a library card used for?",
    options: ["Paying for food", "Borrowing books for free", "Getting on a bus"],
    correct: 1,
  },
};

const SUBJECT_COLORS = {
  language: "from-purple-600 to-indigo-600",
  literacy: "from-amber-600 to-yellow-600",
  numeracy: "from-teal-600 to-cyan-600",
  digital: "from-orange-600 to-red-600",
  independence: "from-green-600 to-teal-600",
};

const phonicsVowels = ["A", "E", "I", "O", "U"];
const phonicsConsonants = ["B", "C", "D", "F", "G", "H"];
const LESSON_PROGRESS_STORAGE_KEY = "windgap-lesson-progress-v2";

function buildQuizSet(baseQuiz, lessonKey) {
  const templates = {
    "language-phonics": [
      {
        id: "q1",
        question: "Which phrase is best for asking support politely?",
        options: ["Help me now!", "Excuse me, could you help me please?", "I will just give up"],
        correct: 1,
      },
      {
        id: "q2",
        question: "Why are vowels important?",
        options: ["They help form many words", "They are only for decoration", "They are numbers"],
        correct: 0,
      },
    ],
    "literacy-reading": [
      {
        id: "q1",
        question: "What is a key reading strategy?",
        options: ["Skip all signs", "Read carefully for meaning", "Guess without looking"],
        correct: 1,
      },
      {
        id: "q2",
        question: "How do symbols help in the community?",
        options: [
          "They give useful safety and direction information",
          "They replace all language",
          "They are random",
        ],
        correct: 0,
      },
    ],
    "numeracy-counting": [
      {
        id: "q1",
        question: "Which is a good numeracy habit?",
        options: ["Estimate then verify", "Never check work", "Avoid numbers"],
        correct: 0,
      },
      {
        id: "q2",
        question: "What skill helps with shopping?",
        options: ["Counting change", "Ignoring prices", "Skipping receipts"],
        correct: 0,
      },
    ],
    "digital-literacy": [
      {
        id: "q1",
        question: "What should you do with a strong password?",
        options: ["Share it publicly", "Keep it private", "Write it in chats"],
        correct: 1,
      },
      {
        id: "q2",
        question: "When receiving a suspicious message, you should:",
        options: ["Click immediately", "Tell a trusted adult", "Forward to everyone"],
        correct: 1,
      },
    ],
  };

  const extra = templates[lessonKey] || [
    {
      id: "q1",
      question: "What helps learning transfer to real life?",
      options: ["Practice and reflection", "Avoiding feedback", "Only memorising"],
      correct: 0,
    },
    {
      id: "q2",
      question: "What is a strong next step after learning?",
      options: ["Set one practical action", "Do nothing", "Delete notes"],
      correct: 0,
    },
  ];

  return [
    {
      id: "base",
      question: baseQuiz.question,
      options: baseQuiz.options,
      correct: baseQuiz.correct,
    },
    ...extra,
  ];
}

export function LessonPlayer() {
  const { state, setLesson, resetLesson, nextStep, prevStep, goToStep, setUnderstood } =
    useLesson();
  const { user } = useUser();
  const [searchParams] = useSearchParams();
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [courseTitle, setCourseTitle] = useState(null);
  const [courseCharacter, setCourseCharacter] = useState(null);

  // All hooks must be declared before early returns
  const [activityAnswer, setActivityAnswer] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [direction, setDirection] = useState(1);
  const [learningMode, setLearningMode] = useState("guided");
  const [hintsUsed, setHintsUsed] = useState(0);
  const [evidence, setEvidence] = useState({});
  const [reflection, setReflection] = useState("");
  const [hydrated, setHydrated] = useState(false);

  // Read ?course= or ?domain= URL param and auto-load lesson
  useEffect(() => {
    const courseId = searchParams.get("course");
    const domainId = searchParams.get("domain");
    if (courseId) {
      const mapping = COURSE_TO_LESSON[courseId];
      if (mapping) {
        resetLesson();
        setSelectedSubject(mapping.subject);
        setSelectedTopic(mapping.topic);
        setCourseTitle(mapping.title);
        setCourseCharacter(mapping.character);
      } else {
        // Unknown course ID — reset so user sees selector
        resetLesson();
        setSelectedSubject(null);
        setSelectedTopic(null);
        setCourseTitle(null);
        setCourseCharacter(null);
      }
    } else if (domainId) {
      const mapping = DOMAIN_TO_LESSON[domainId];
      if (mapping) {
        resetLesson();
        setSelectedSubject(mapping.subject);
        setSelectedTopic(mapping.topic);
        setCourseTitle(null);
        setCourseCharacter(mapping.character);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  // Load lesson when subject/topic are selected
  useEffect(() => {
    if (selectedSubject && selectedTopic) {
      const lesson = lessonData[selectedSubject]?.[selectedTopic];
      if (lesson) {
        setLesson(selectedSubject, selectedTopic, lesson.steps);
        setFeedback("");
        setActivityAnswer("");
        setQuizAnswers({});
        setQuizSubmitted(false);
      }
    }
  }, [selectedSubject, selectedTopic, setLesson]);

  const lessonKey = state.subject && state.topic ? `${state.subject}-${state.topic}` : null;

  useEffect(() => {
    let cancelled = false;

    async function loadSavedLessonProgress() {
      if (!lessonKey) {
        setHydrated(false);
        return;
      }

      let localSaved = null;
      try {
        const raw = localStorage.getItem(LESSON_PROGRESS_STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : {};
        localSaved = parsed?.[lessonKey] || null;
      } catch {
        localSaved = null;
      }

      let remoteSaved = null;
      if (user?.id) {
        try {
          const userDoc = await getUserDoc(user.id);
          remoteSaved = userDoc?.lessonProgress?.[lessonKey] || null;
        } catch {
          remoteSaved = null;
        }
      }

      const saved = remoteSaved || localSaved;
      if (!cancelled) {
        if (saved?.stepIndex !== undefined) goToStep(saved.stepIndex);
        setLearningMode(saved?.learningMode || "guided");
        setHintsUsed(Number(saved?.hintsUsed || 0));
        setEvidence(saved?.evidence || {});
        setReflection(saved?.reflection || "");
        setQuizAnswers(saved?.quizAnswers || {});
        setQuizSubmitted(Boolean(saved?.quizSubmitted));
        setHydrated(true);
      }
    }

    loadSavedLessonProgress();
    return () => {
      cancelled = true;
    };
  }, [lessonKey, user?.id, goToStep]);

  useEffect(() => {
    if (!lessonKey || !hydrated) return;

    const payload = {
      stepIndex: state.stepIndex,
      learningMode,
      hintsUsed,
      evidence,
      reflection,
      quizAnswers,
      quizSubmitted,
      updatedAt: Date.now(),
    };

    try {
      const raw = localStorage.getItem(LESSON_PROGRESS_STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : {};
      parsed[lessonKey] = payload;
      localStorage.setItem(LESSON_PROGRESS_STORAGE_KEY, JSON.stringify(parsed));
    } catch {
      // ignore local storage failures
    }

    if (user?.id) {
      setUserDoc(user.id, { lessonProgress: { [lessonKey]: payload } }).catch(() => {
        // keep local path only
      });
    }
  }, [
    evidence,
    hintsUsed,
    hydrated,
    learningMode,
    lessonKey,
    quizAnswers,
    quizSubmitted,
    reflection,
    state.stepIndex,
    user?.id,
  ]);

  // Selector screen — shown when no active lesson
  if (!state.subject || !state.steps.length) {
    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <div
          className="rounded-2xl p-6 text-white"
          style={{ background: "linear-gradient(135deg, #6D28D9 0%, #4338CA 100%)" }}
        >
          <h1 className="text-3xl font-extrabold mb-1">Choose Your Lesson</h1>
          <p className="text-purple-200">Select a topic below to start learning with your guide.</p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerGrid}
          initial="initial"
          animate="animate"
        >
          {Object.entries(lessonData).map(([subject, topics]) =>
            Object.entries(topics).map(([topic, data]) => (
              <motion.button
                key={`${subject}-${topic}`}
                variants={cardVariant}
                whileHover={{ scale: 1.03, y: -4, boxShadow: "0 10px 28px rgba(0,0,0,0.10)" }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: "spring", stiffness: 360, damping: 22 }}
                onClick={() => {
                  setSelectedSubject(subject);
                  setSelectedTopic(topic);
                }}
                className="p-5 bg-white border-2 border-gray-200 rounded-2xl text-left hover:border-purple-400 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <MiniAvatar character={data.character} size={40} />
                  <span className="font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
                    {data.title}
                  </span>
                </div>
                <span className="text-xs text-gray-400 capitalize">{subject}</span>
              </motion.button>
            )),
          )}
        </motion.div>
      </div>
    );
  }

  const currentStep = state.steps[state.stepIndex];
  const progress = ((state.stepIndex + 1) / state.steps.length) * 100;
  const lessonInfo = lessonData[state.subject]?.[state.topic];
  const charKey = courseCharacter || lessonInfo?.character || "indy";
  const gradient = SUBJECT_COLORS[state.subject] || "from-purple-600 to-indigo-600";
  const quizKey = `${state.subject}-${state.topic}`;
  const quiz = QUIZ_QUESTIONS[quizKey] || {
    question: "What is 3 + 4?",
    options: ["6", "7", "8"],
    correct: 1,
  };
  const quizSet = buildQuizSet(quiz, quizKey);
  const quizScore = quizSet.reduce((acc, q) => acc + (quizAnswers[q.id] === q.correct ? 1 : 0), 0);
  const quizPass = quizSubmitted && quizScore >= Math.ceil(quizSet.length * 0.7);

  const resetLessonProgress = () => {
    setLearningMode("guided");
    setHintsUsed(0);
    setEvidence({});
    setReflection("");
    setQuizAnswers({});
    setQuizSubmitted(false);
    setFeedback("");
    setActivityAnswer("");
    goToStep(0);
  };

  const renderStepContent = () => {
    switch (currentStep?.type) {
      case "text":
        return (
          <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <h3 className="font-bold text-blue-900 text-lg mb-3">{currentStep.title}</h3>
            <p className="text-gray-700 leading-relaxed text-base">{currentStep.content}</p>
            <button
              onClick={() => speakAussie(currentStep.content)}
              className="mt-4 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-200"
            >
              🔊 Read aloud
            </button>
          </div>
        );

      case "interactive":
        return (
          <div className="p-6 bg-green-50 rounded-2xl border border-green-100">
            <h3 className="font-bold text-green-900 text-lg mb-2">{currentStep.title}</h3>
            <p className="text-gray-700 mb-4">{currentStep.content}</p>

            {currentStep.id === "vowels" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Click each vowel to hear its sound:
                </p>
                <div className="flex gap-3 flex-wrap">
                  {phonicsVowels.map((v) => (
                    <button
                      key={v}
                      className="w-14 h-14 rounded-xl bg-purple-600 text-white text-2xl font-extrabold hover:scale-110 transition-all shadow"
                      onClick={() => {
                        speakAussie(v);
                        setFeedback(`Great! ${v} is a vowel sound.`);
                      }}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep.id === "consonants" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Click to hear the consonant sound:
                </p>
                <div className="flex gap-3 flex-wrap">
                  {phonicsConsonants.map((c) => (
                    <button
                      key={c}
                      className="w-14 h-14 rounded-xl bg-blue-600 text-white text-2xl font-extrabold hover:scale-110 transition-all shadow"
                      onClick={() => {
                        speakAussie(c);
                        setFeedback(`${c} is a consonant.`);
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep.id === "asking" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Tap to practise saying these phrases out loud:
                </p>
                {[
                  "Excuse me, could you help me please?",
                  "I don't understand. Can you explain?",
                  "Thank you for your help.",
                ].map((phrase) => (
                  <button
                    key={phrase}
                    className="w-full text-left px-4 py-3 bg-white border-2 border-purple-200 rounded-xl mb-2 hover:border-purple-400 hover:shadow-sm transition-all"
                    onClick={() => {
                      speakAussie(phrase);
                      setFeedback("Great! Saying this out loud builds confidence.");
                    }}
                  >
                    🗣️ {phrase}
                  </button>
                ))}
              </div>
            )}
            {currentStep.id === "vocabulary" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">Tap a sight word to hear it:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { w: "the", e: "👆" },
                    { w: "and", e: "➕" },
                    { w: "is", e: "✅" },
                    { w: "you", e: "👤" },
                    { w: "we", e: "👫" },
                    { w: "my", e: "⭐" },
                  ].map((item) => (
                    <button
                      key={item.w}
                      className="p-3 rounded-xl bg-amber-50 border-2 border-amber-200 hover:border-amber-400 hover:scale-105 transition-all font-bold text-amber-800"
                      onClick={() => {
                        speakAussie(item.w);
                        setFeedback(`"${item.w}" is a very common word!`);
                      }}
                    >
                      {item.e} {item.w}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep.id === "signs" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Tap to learn what each sign means:
                </p>
                {[
                  { e: "🚫", n: "No Entry", m: "You cannot go in here" },
                  { e: "🚪", n: "Exit", m: "The way out" },
                  { e: "⚠️", n: "Warning", m: "Be careful here" },
                  { e: "♿", n: "Accessibility", m: "For people with disability" },
                ].map((sign) => (
                  <button
                    key={sign.n}
                    className="w-full flex items-center gap-4 p-4 bg-white border-2 border-amber-200 rounded-xl mb-2 hover:border-amber-400 text-left transition-all"
                    onClick={() => setFeedback(`"${sign.n}" means: ${sign.m}`)}
                  >
                    <span className="text-4xl">{sign.e}</span>
                    <span className="font-semibold text-gray-800">{sign.n}</span>
                  </button>
                ))}
              </div>
            )}
            {currentStep.id === "counting" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">How many apples are there?</p>
                <div className="text-6xl text-center my-4">🍎🍎🍎🍎🍎🍎🍎</div>
                <div className="flex gap-3 justify-center">
                  {[5, 6, 7, 8].map((n) => (
                    <button
                      key={n}
                      className={`w-14 h-14 rounded-xl text-2xl font-bold border-2 transition-all ${activityAnswer === String(n) ? (n === 7 ? "bg-green-500 text-white border-green-500" : "bg-red-200 text-red-800 border-red-300") : "bg-white border-gray-300 hover:border-teal-400"}`}
                      onClick={() => {
                        setActivityAnswer(String(n));
                        setFeedback(n === 7 ? "🎉 Correct! There are 7 apples!" : "Try again!");
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep.id === "addition" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">What is 4 + 5?</p>
                <div className="text-4xl text-center my-4">🔵🔵🔵🔵 + 🔵🔵🔵🔵🔵 = ?</div>
                <div className="flex gap-3 justify-center">
                  {[7, 8, 9, 10].map((n) => (
                    <button
                      key={n}
                      className={`w-14 h-14 rounded-xl text-2xl font-bold border-2 transition-all ${activityAnswer === String(n) ? (n === 9 ? "bg-green-500 text-white border-green-500" : "bg-red-200 text-red-800 border-red-300") : "bg-white border-gray-300 hover:border-teal-400"}`}
                      onClick={() => {
                        setActivityAnswer(String(n));
                        setFeedback(n === 9 ? "🎉 Correct! 4 + 5 = 9!" : "Not quite, try again!");
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep.id === "money" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">Which is the $2 coin?</p>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { l: "$1", c: "#FFD700", s: 68, correct: false },
                    { l: "$2", c: "#FFD700", s: 58, correct: true },
                    { l: "50c", c: "#C0C0C0", s: 74, correct: false },
                  ].map((coin) => (
                    <button
                      key={coin.l}
                      className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${activityAnswer === coin.l ? (coin.correct ? "border-green-500 bg-green-50" : "border-red-300 bg-red-50") : "border-gray-200 bg-white hover:border-teal-300"}`}
                      onClick={() => {
                        setActivityAnswer(coin.l);
                        setFeedback(
                          coin.correct
                            ? "🎉 Correct! The $2 coin is smaller than the $1 coin!"
                            : `That is the ${coin.l} coin. Try again!`,
                        );
                      }}
                    >
                      <div
                        className="rounded-full flex items-center justify-center font-extrabold text-white mb-2"
                        style={{
                          width: coin.s,
                          height: coin.s,
                          backgroundColor: coin.c,
                          fontSize: coin.s / 3.5,
                          boxShadow: `0 4px 12px ${coin.c}88`,
                        }}
                      >
                        {coin.l}
                      </div>
                      <span className="text-sm font-semibold text-gray-700">{coin.l}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            {currentStep.id === "devices" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  What does each part do? Tap to learn:
                </p>
                {[
                  { e: "⌨️", n: "Keyboard", d: "Used for typing" },
                  { e: "🖥️", n: "Screen", d: "Shows pictures, words and videos" },
                  { e: "🖱️", n: "Mouse", d: "Used to point and click" },
                  { e: "🔊", n: "Speaker", d: "Lets you hear sounds" },
                ].map((p) => (
                  <button
                    key={p.n}
                    className="w-full flex items-center gap-4 p-3 bg-white border-2 border-orange-200 rounded-xl mb-2 hover:border-orange-400 text-left transition-all"
                    onClick={() => setFeedback(`${p.n}: ${p.d}`)}
                  >
                    <span className="text-3xl">{p.e}</span>
                    <span className="font-semibold text-gray-800">{p.n}</span>
                  </button>
                ))}
              </div>
            )}
            {currentStep.id === "safety" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Tap each safety rule to learn more:
                </p>
                {[
                  { e: "🔒", t: "Keep your password secret", d: "Never share it with anyone" },
                  {
                    e: "🚫",
                    t: "Don't share personal info",
                    d: "No address, phone or school name to strangers",
                  },
                  {
                    e: "📢",
                    t: "Tell a trusted adult",
                    d: "If something worries you online, tell someone you trust",
                  },
                ].map((r) => (
                  <button
                    key={r.t}
                    className="w-full flex items-center gap-4 p-4 bg-white border-2 border-orange-200 rounded-xl mb-2 hover:border-orange-400 text-left transition-all"
                    onClick={() => setFeedback(`${r.t}: ${r.d}`)}
                  >
                    <span className="text-3xl">{r.e}</span>
                    <span className="font-semibold text-gray-800">{r.t}</span>
                  </button>
                ))}
              </div>
            )}
            {currentStep.id === "email" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Parts of an email. Tap each to learn:
                </p>
                {[
                  { e: "📬", t: "To: (email address)", d: "Who you are sending the email to" },
                  { e: "📋", t: "Subject: (topic)", d: "A short title for your email" },
                  {
                    e: "✉️",
                    t: "Body: (your message)",
                    d: "What you want to say — be polite and clear",
                  },
                  {
                    e: "👋",
                    t: "Sign off",
                    d: "End with 'Kind regards' or 'Thank you' + your name",
                  },
                ].map((p) => (
                  <button
                    key={p.t}
                    className="w-full flex items-center gap-4 p-3 bg-white border-2 border-orange-200 rounded-xl mb-2 hover:border-orange-400 text-left transition-all"
                    onClick={() => setFeedback(`${p.t}: ${p.d}`)}
                  >
                    <span className="text-3xl">{p.e}</span>
                    <span className="font-semibold text-gray-800">{p.t}</span>
                  </button>
                ))}
              </div>
            )}
            {currentStep.id === "routine" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Tap each morning routine step in order:
                </p>
                {[
                  { e: "⏰", t: "Wake up" },
                  { e: "🚿", t: "Wash face & brush teeth" },
                  { e: "👕", t: "Get dressed" },
                  { e: "🥣", t: "Eat breakfast" },
                  { e: "🎒", t: "Pack your bag" },
                ].map((s, i) => (
                  <button
                    key={s.t}
                    className={`w-full flex items-center gap-4 p-3 rounded-xl mb-2 border-2 transition-all text-left ${activityAnswer === String(i) ? "bg-green-100 border-green-400" : "bg-white border-green-200 hover:border-green-400"}`}
                    onClick={() => {
                      setActivityAnswer(String(i));
                      setFeedback(`Step ${i + 1}: ${s.t} ✓`);
                    }}
                  >
                    <span className="text-3xl">{s.e}</span>
                    <span className="font-semibold text-gray-800">
                      {i + 1}. {s.t}
                    </span>
                  </button>
                ))}
              </div>
            )}
            {(currentStep.id === "transport" || currentStep.id === "timetable") && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Bus timetable — tap a row to learn:
                </p>
                {[
                  { s: "City Centre", t: "8:00 / 8:30 / 9:00" },
                  { s: "Library", t: "8:08 / 8:38 / 9:08" },
                  { s: "Shopping Centre", t: "8:15 / 8:45 / 9:15" },
                ].map((row) => (
                  <button
                    key={row.s}
                    className="w-full flex justify-between items-center p-4 bg-white border-2 border-green-200 rounded-xl mb-2 hover:border-green-400 text-left transition-all"
                    onClick={() => setFeedback(`${row.s} has buses at: ${row.t}`)}
                  >
                    <span className="font-semibold text-gray-800">🚌 {row.s}</span>
                    <span className="text-teal-700 font-mono text-sm">{row.t}</span>
                  </button>
                ))}
              </div>
            )}
            {currentStep.id === "emergency" && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">
                  Tap to reveal each emergency number:
                </p>
                {[
                  { e: "🆘", s: "Any emergency", n: "000" },
                  { e: "💙", s: "Lifeline (crisis support)", n: "13 11 14" },
                  { e: "☠️", s: "Poison information", n: "13 11 26" },
                ].map((info) => (
                  <button
                    key={info.s}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl mb-2 border-2 transition-all text-left ${activityAnswer === info.s ? "bg-green-100 border-green-400" : "bg-white border-gray-200 hover:border-green-400"}`}
                    onClick={() => {
                      setActivityAnswer(info.s);
                      setFeedback(`${info.s}: Call ${info.n}`);
                    }}
                  >
                    <span className="text-3xl">{info.e}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{info.s}</p>
                      {activityAnswer === info.s && (
                        <p className="text-green-700 font-extrabold text-xl">{info.n}</p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {(currentStep.id === "home" || currentStep.id === "community") && (
              <div>
                <p className="font-semibold text-gray-700 mb-3">Tap each safety tip:</p>
                {[
                  {
                    e: "🔥",
                    t: "Kitchen safety",
                    d: "Never leave cooking unattended. Keep tea towels away from the stove.",
                  },
                  {
                    e: "💊",
                    t: "Medication safety",
                    d: "Keep medicines in a safe place away from children.",
                  },
                  {
                    e: "🚪",
                    t: "Lock your doors",
                    d: "Always lock your front door when you leave home or go to sleep.",
                  },
                  {
                    e: "📞",
                    t: "Know who to call",
                    d: "Keep important phone numbers written down somewhere safe.",
                  },
                ].map((tip) => (
                  <button
                    key={tip.t}
                    className="w-full flex items-center gap-4 p-3 bg-white border-2 border-green-200 rounded-xl mb-2 hover:border-green-400 text-left transition-all"
                    onClick={() => setFeedback(`${tip.t}: ${tip.d}`)}
                  >
                    <span className="text-3xl">{tip.e}</span>
                    <span className="font-semibold text-gray-800">{tip.t}</span>
                  </button>
                ))}
              </div>
            )}
            {feedback && (
              <div className="mt-4 p-3 bg-white border border-green-300 rounded-xl text-green-800 font-medium text-sm">
                {feedback}
              </div>
            )}
          </div>
        );

      case "video":
        return (
          <div className="p-6 bg-purple-50 rounded-2xl border border-purple-100">
            <h3 className="font-bold text-purple-900 text-lg mb-2">{currentStep.title}</h3>
            <p className="text-gray-700 mb-4">{currentStep.content}</p>
            <div className="aspect-video bg-gray-800 rounded-xl flex items-center justify-center text-white">
              <div className="text-center">
                <div className="text-6xl mb-4">▶️</div>
                <p>Video demonstration</p>
              </div>
            </div>
          </div>
        );

      case "quiz":
        return (
          <div className="p-6 bg-yellow-50 rounded-2xl border border-yellow-100">
            <h3 className="font-bold text-yellow-900 text-lg mb-4">
              {currentStep.title || "Quiz"}
            </h3>
            <p className="text-gray-700 mb-2 font-semibold">
              Complete this mastery check to demonstrate understanding.
            </p>
            <div className="space-y-4">
              {quizSet.map((q, qIndex) => (
                <div key={q.id} className="rounded-xl border border-yellow-200 p-3 bg-white">
                  <p className="font-semibold text-gray-800 mb-2">
                    {qIndex + 1}. {q.question}
                  </p>
                  <div className="space-y-2">
                    {q.options.map((opt, i) => (
                      <button
                        key={`${q.id}-${opt}`}
                        className={`w-full px-4 py-2 rounded-lg text-left font-medium transition-all border ${
                          quizAnswers[q.id] === i
                            ? i === q.correct
                              ? "bg-green-100 border-green-400 text-green-900"
                              : "bg-red-100 border-red-300 text-red-800"
                            : quizSubmitted && i === q.correct
                              ? "bg-green-50 border-green-300 text-green-800"
                              : "bg-white border-gray-200 hover:border-yellow-400"
                        }`}
                        onClick={() =>
                          setQuizAnswers((prev) => ({
                            ...prev,
                            [q.id]: i,
                          }))
                        }
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex flex-wrap gap-2 items-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuizSubmitted(true);
                    setFeedback("Assessment submitted. Review highlighted answers and feedback.");
                  }}
                >
                  Submit mastery check
                </Button>
                {quizSubmitted && (
                  <span
                    className={`text-sm font-semibold ${quizPass ? "text-green-700" : "text-orange-700"}`}
                  >
                    Score: {quizScore}/{quizSet.length} · {quizPass ? "Passed" : "Needs review"}
                  </span>
                )}
              </div>
            </div>
            <AnimatePresence>
              {feedback && (
                <motion.div
                  variants={feedbackPop}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  className={`mt-4 p-3 rounded-xl font-semibold text-center ${quizPass ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}
                >
                  {feedback}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );

      default:
        return <p className="text-gray-500">Loading step…</p>;
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className={`rounded-2xl p-5 text-white bg-gradient-to-r ${gradient}`}>
        <div className="flex items-center gap-4">
          <motion.div animate={charBob.animate}>
            <MiniAvatar character={charKey} size={56} />
          </motion.div>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-extrabold truncate">{courseTitle || lessonInfo?.title}</h2>
            <p className="text-white/70 text-sm">
              Step {state.stepIndex + 1} of {state.steps.length}: {currentStep?.title}
            </p>
          </div>
        </div>
        <div className="mt-3">
          <Progress value={progress} className="h-2 bg-white/30" />
        </div>
      </div>

      {/* Step content */}
      <Card>
        <CardContent className="pt-5">
          <div className="mb-4 space-y-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <p className="text-sm font-semibold text-slate-800">Adaptive Learning Coach</p>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <select
                  value={learningMode}
                  onChange={(e) => setLearningMode(e.target.value)}
                  className="rounded-md border border-slate-300 px-2 py-1 text-sm"
                >
                  <option value="guided">Guided</option>
                  <option value="coached">Coached</option>
                  <option value="independent">Independent</option>
                </select>
                <Button size="sm" variant="outline" onClick={() => setHintsUsed((v) => v + 1)}>
                  Use scaffold hint
                </Button>
                <span className="text-xs text-slate-600">Hints used: {hintsUsed}</span>
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-3">
              <p className="text-sm font-semibold text-slate-800">Evidence & Reflection</p>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                {[
                  "Completed guided practice",
                  "Applied skill in scenario",
                  "Can explain reasoning",
                ].map((item) => (
                  <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={Boolean(evidence[item])}
                      onChange={(e) =>
                        setEvidence((prev) => ({
                          ...prev,
                          [item]: e.target.checked,
                        }))
                      }
                    />
                    {item}
                  </label>
                ))}
              </div>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="Reflection: what worked best, and what will you try next?"
                className="mt-2 w-full min-h-[76px] rounded-md border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={state.stepIndex}
              custom={direction}
              variants={stepSlide}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              {renderStepContent()}
            </motion.div>
          </AnimatePresence>
          <div className="flex justify-between mt-6 gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setDirection(-1);
                prevStep();
                setFeedback("");
                setActivityAnswer("");
                setQuizAnswers({});
                setQuizSubmitted(false);
              }}
              disabled={state.stepIndex === 0}
            >
              ← Back
            </Button>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={state.understood === true ? "default" : "outline"}
                onClick={() => setUnderstood(true)}
              >
                ✓ Got it
              </Button>
              <Button
                size="sm"
                variant={state.understood === false ? "secondary" : "outline"}
                onClick={() => setUnderstood(false)}
              >
                ? Help
              </Button>
            </div>
            <Button
              onClick={() => {
                setDirection(1);
                nextStep();
                setFeedback("");
                setActivityAnswer("");
                setQuizAnswers({});
                setQuizSubmitted(false);
              }}
              disabled={state.stepIndex === state.steps.length - 1}
            >
              Next →
            </Button>
          </div>
          <div className="mt-3 text-center">
            <button
              className="text-sm text-gray-400 hover:text-gray-600 underline"
              onClick={() => {
                resetLesson();
                setSelectedSubject(null);
                setSelectedTopic(null);
                setCourseTitle(null);
                setCourseCharacter(null);
                resetLessonProgress();
              }}
            >
              ← Back to lesson list
            </button>
            <button
              className="ml-3 text-sm text-gray-400 hover:text-gray-600 underline"
              onClick={resetLessonProgress}
            >
              Reset lesson progress
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
