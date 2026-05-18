import React, { useState } from "react";

import { LeoLion, MiniAvatar } from "../CharacterAvatar";

// ─── Activity 1: Story Reading with Comprehension ──────────────────────────
const STORIES = [
  {
    title: "Sam's Big Day",
    text: "Sam woke up early on Monday. He had a big day at school. First, he ate his breakfast — toast with butter and a glass of milk. Then he put on his backpack and walked to the bus stop. At school, Sam's teacher read the class a funny story about a dragon who was afraid of fire. Sam laughed so hard his tummy hurt! After lunch he played football with his friends. When he got home, Mum had made spaghetti — his favourite. Sam told her everything about his day. \"It was the best day ever!\" he said.",
    questions: [
      { q: "What did Sam eat for breakfast?", opts: ["Cereal", "Toast with butter", "Eggs"], correct: 1 },
      { q: "What was the dragon afraid of?", opts: ["Water", "People", "Fire"], correct: 2 },
      { q: "What did Sam play after lunch?", opts: ["Basketball", "Football", "Cricket"], correct: 1 },
      { q: "What did Mum make for dinner?", opts: ["Pizza", "Spaghetti", "Soup"], correct: 1 },
    ],
  },
  {
    title: "The Lost Puppy",
    text: "One afternoon, Maya was walking home when she spotted a small brown puppy sitting alone near the park gate. It had a red collar but no tag. Maya sat down slowly and held out her hand. The puppy sniffed her fingers, then licked them. \"You're lost, aren't you?\" she said gently. Maya carried the puppy to the local vet. The vet scanned the puppy's chip and found the owner's phone number. An hour later, a little girl named Ava came running in, crying happy tears. \"Biscuit!\" she shouted. Maya smiled. Helping someone always feels good.",
    questions: [
      { q: "Where did Maya find the puppy?", opts: ["At the shops", "Near the park gate", "By the school"], correct: 1 },
      { q: "What colour was the puppy's collar?", opts: ["Blue", "Green", "Red"], correct: 2 },
      { q: "How did the vet find the owner?", opts: ["Social media", "Puppy chip", "A poster"], correct: 1 },
      { q: "What was the puppy's name?", opts: ["Biscuit", "Cookie", "Muffin"], correct: 0 },
    ],
  },
];

function ReadingTextActivity() {
  const [storyIdx, setStoryIdx] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const story = STORIES[storyIdx];
  const score = Object.entries(answers).filter(([i, a]) => Number(a) === story.questions[Number(i)].correct).length;

  function switchStory(i) { setStoryIdx(i); setAnswers({}); setSubmitted(false); }
  function answer(qi, ai) { if (!submitted) setAnswers((prev) => ({ ...prev, [qi]: ai })); }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="leo" size={40} />
        <div className="bg-amber-50 rounded-xl p-3 text-amber-900 text-sm font-medium border border-amber-200">
          Read the story carefully, then answer the questions. 📖
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {STORIES.map((s, i) => (
          <button key={i} onClick={() => switchStory(i)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${storyIdx === i ? "bg-amber-600 text-white" : "bg-white border border-amber-300 text-amber-700 hover:bg-amber-50"}`}>
            {s.title}
          </button>
        ))}
      </div>
      <div className="bg-amber-50 rounded-2xl p-5 border border-amber-200 mb-6">
        <h3 className="font-bold text-amber-900 text-xl mb-3">📖 {story.title}</h3>
        <p className="text-gray-700 leading-relaxed text-base">{story.text}</p>
        <button
          onClick={() => { if ("speechSynthesis" in window) { window.speechSynthesis.cancel(); const u = new SpeechSynthesisUtterance(story.text); u.rate = 0.85; window.speechSynthesis.speak(u); } }}
          className="mt-3 px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 transition-all"
        >🔊 Read aloud</button>
      </div>
      <h4 className="font-bold text-gray-800 mb-3">Comprehension Questions:</h4>
      <div className="space-y-4">
        {story.questions.map((q, qi) => (
          <div key={qi} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.opts.map((opt, ai) => {
                let style = "bg-gray-100 text-gray-700 hover:bg-gray-200";
                if (answers[qi] === ai) {
                  style = submitted
                    ? ai === q.correct ? "bg-green-200 text-green-800 font-bold" : "bg-red-200 text-red-800"
                    : "bg-amber-200 text-amber-900";
                } else if (submitted && ai === q.correct) {
                  style = "bg-green-100 text-green-700 font-bold";
                }
                return (
                  <button key={ai} onClick={() => answer(qi, ai)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${style}`}>{opt}</button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < story.questions.length}
          className="mt-4 w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 disabled:opacity-50 transition-all">
          Check My Answers
        </button>
      ) : (
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 text-center">
          <p className="text-5xl font-extrabold text-amber-700">{score}/{story.questions.length}</p>
          <p className="text-gray-600 mt-2">{score === story.questions.length ? "🏆 Perfect!" : score >= 3 ? "🌟 Great reading!" : "📖 Try reading the story again!"}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg text-sm font-medium hover:bg-amber-700">Try Again</button>
        </div>
      )}
    </div>
  );
}

// ─── Activity 2: Signs & Symbols Matching ─────────────────────────────────
const SIGNS = [
  { symbol: "🚫", name: "No Entry", meaning: "You cannot go in here" },
  { symbol: "🚪", name: "Exit", meaning: "The way out" },
  { symbol: "⚠️", name: "Warning / Danger", meaning: "Be careful here" },
  { symbol: "♿", name: "Accessibility", meaning: "For people with disability" },
  { symbol: "🚻", name: "Toilets", meaning: "Bathrooms are here" },
  { symbol: "🚑", name: "First Aid", meaning: "Medical help is here" },
  { symbol: "🅿️", name: "Parking", meaning: "You can park your car here" },
  { symbol: "🔥", name: "Fire Exit", meaning: "Use this in an emergency" },
];

function SignsAndSymbolsActivity() {
  const [matched, setMatched] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [targetMeaning, setTargetMeaning] = useState(() => {
    const shuffled = [...SIGNS].sort(() => Math.random() - 0.5);
    return shuffled[0];
  });
  const [feedback, setFeedback] = useState(null);

  function pickSign(sign) {
    if (matched.has(sign.name)) return;
    if (sign.name === targetMeaning.name) {
      setMatched((prev) => new Set([...prev, sign.name]));
      setFeedback({ ok: true, msg: `✓ Correct! "${sign.name}" means: ${sign.meaning}` });
      setTimeout(() => {
        const remaining = SIGNS.filter((s) => !matched.has(s.name) && s.name !== sign.name);
        if (remaining.length > 0) {
          setTargetMeaning(remaining[Math.floor(Math.random() * remaining.length)]);
        }
        setFeedback(null);
      }, 1600);
    } else {
      setFeedback({ ok: false, msg: `That is "${sign.name}". Try again!` });
      setTimeout(() => setFeedback(null), 1500);
    }
  }

  const allDone = matched.size === SIGNS.length;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="leo" size={40} />
        <div className="bg-amber-50 rounded-xl p-3 text-amber-900 text-sm font-medium border border-amber-200">
          Match the sign! Tap the symbol that matches the description below. 🚦
        </div>
      </div>
      {!allDone ? (
        <>
          <div className="bg-gradient-to-r from-amber-100 to-yellow-100 border-2 border-amber-300 rounded-2xl p-5 text-center mb-5">
            <p className="text-sm text-gray-500 mb-1">Find the sign that means:</p>
            <p className="text-2xl font-bold text-amber-900">"{targetMeaning.meaning}"</p>
          </div>
          {feedback && (
            <div className={`p-3 rounded-xl text-center mb-4 font-semibold ${feedback.ok ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
              {feedback.msg}
            </div>
          )}
          <div className="grid grid-cols-4 gap-4">
            {SIGNS.map((sign) => (
              <button key={sign.name} onClick={() => pickSign(sign)} disabled={matched.has(sign.name)}
                className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all shadow-sm ${
                  matched.has(sign.name) ? "bg-green-100 border-green-300 opacity-60" : "bg-white border-gray-200 hover:border-amber-400 hover:scale-105 hover:shadow-md"}`}>
                <span className="text-5xl mb-1">{sign.symbol}</span>
                <span className="text-xs text-gray-600 text-center font-medium">{sign.name}</span>
                {matched.has(sign.name) && <span className="text-green-600 text-lg mt-1">✓</span>}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-3 text-center">{matched.size}/{SIGNS.length} matched</p>
        </>
      ) : (
        <div className="text-center p-8 bg-green-50 border-2 border-green-300 rounded-2xl">
          <p className="text-5xl mb-3">🎉</p>
          <p className="text-2xl font-bold text-green-700 mb-2">All signs matched!</p>
          <p className="text-gray-600 mb-4">You know all 8 important signs.</p>
          <button onClick={() => setMatched(new Set())} className="px-5 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700">Play again</button>
        </div>
      )}
    </div>
  );
}

// ─── Activity 3: Word Spelling Practice ────────────────────────────────────
const SPELL_WORDS = [
  { word: "school", hint: "You go here to learn", letters: ["s","c","h","o","o","l"] },
  { word: "friend", hint: "Someone you like to spend time with", letters: ["f","r","i","e","n","d"] },
  { word: "water", hint: "You drink this every day", letters: ["w","a","t","e","r"] },
  { word: "happy", hint: "How you feel when something is good", letters: ["h","a","p","p","y"] },
  { word: "family", hint: "The people who live with you and love you", letters: ["f","a","m","i","l","y"] },
];

function LiteracyChecklist() {
  const [wordIdx, setWordIdx] = useState(0);
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [result, setResult] = useState(null);
  const [completed, setCompleted] = useState(new Set());
  const w = SPELL_WORDS[wordIdx];

  function check() {
    const correct = input.trim().toLowerCase() === w.word;
    setAttempts((a) => a + 1);
    setResult(correct ? "correct" : "wrong");
    if (correct) setCompleted((prev) => new Set([...prev, w.word]));
  }

  function next() {
    setWordIdx((i) => (i + 1) % SPELL_WORDS.length);
    setInput(""); setAttempts(0); setResult(null);
  }

  function speak() {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(w.word);
      u.rate = 0.6;
      window.speechSynthesis.speak(u);
    }
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="leo" size={40} />
        <div className="bg-amber-50 rounded-xl p-3 text-amber-900 text-sm font-medium border border-amber-200">
          Spelling practice! Listen to the hint and type the word. ✏️
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mb-5">
        {SPELL_WORDS.map((sw, i) => (
          <button key={sw.word} onClick={() => { setWordIdx(i); setInput(""); setAttempts(0); setResult(null); }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${completed.has(sw.word) ? "bg-green-200 text-green-800 line-through" : i === wordIdx ? "bg-amber-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {sw.word}
          </button>
        ))}
      </div>
      <div className="bg-amber-50 rounded-2xl p-6 border border-amber-200 text-center mb-5">
        <p className="text-sm text-gray-500 mb-2">Hint:</p>
        <p className="text-xl font-semibold text-amber-900 mb-4">"{w.hint}"</p>
        <button onClick={speak} className="px-4 py-2 bg-amber-100 text-amber-800 rounded-lg text-sm font-medium hover:bg-amber-200 mb-4">🔊 Hear the word</button>
        {attempts > 1 && (
          <div className="flex justify-center gap-2 mb-4">
            {w.letters.map((l, i) => (
              <span key={i} className="w-8 h-8 flex items-center justify-center rounded-lg bg-white border-2 border-amber-300 font-bold text-amber-700">{l}</span>
            ))}
          </div>
        )}
        <div className="flex gap-3 justify-center">
          <input value={input} onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && check()}
            placeholder="Type the word here..."
            className="px-4 py-3 border-2 border-amber-300 rounded-xl text-center text-xl font-semibold focus:border-amber-500 focus:outline-none w-48"
          />
          <button onClick={check} className="px-5 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700">Check</button>
        </div>
        {result === "correct" && (
          <div className="mt-4 text-green-700 font-bold text-xl">🎉 Correct! Well done!</div>
        )}
        {result === "wrong" && (
          <div className="mt-4 text-red-600 font-semibold">
            Not quite! {attempts >= 2 ? `The word is: "${w.word}"` : "Try again!"}
          </div>
        )}
      </div>
      {result === "correct" && (
        <button onClick={next} className="w-full py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700">Next word →</button>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LiteracyReadingLesson() {
  const [activeSection, setActiveSection] = useState("reading");
  const sections = [
    { id: "reading", label: "📖 Story Reading", component: <ReadingTextActivity /> },
    { id: "signs", label: "🚦 Signs & Symbols", component: <SignsAndSymbolsActivity /> },
    { id: "spelling", label: "✏️ Spelling", component: <LiteracyChecklist /> },
  ];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6 text-white" style={{ background: "linear-gradient(135deg, #D97706 0%, #B45309 100%)" }}>
        <div className="absolute right-4 top-4 opacity-30 pointer-events-none"><LeoLion size={100} /></div>
        <h2 className="text-2xl font-extrabold mb-1">Literacy &amp; Reading</h2>
        <p className="text-amber-200 text-sm max-w-md">Read stories, recognise signs, and practise spelling. Leo the Lion will guide you through every step!</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {["ACSF: Reading", "ACSF: Writing", "NDIS: Daily Living"].map((tag) => (
            <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === s.id ? "bg-amber-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-amber-50"}`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        {sections.find((s) => s.id === activeSection)?.component}
      </div>
    </div>
  );
}
