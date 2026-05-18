import React, { useState } from "react";

import { LanaOwl, MiniAvatar } from "../CharacterAvatar";

// ─── Activity 1: Alphabet Grid ────────────────────────────────────────────────
function AlphabetSoundsActivity() {
  const [spoken, setSpoken] = useState(new Set());
  const [lastLetter, setLastLetter] = useState(null);

  const vowels = new Set(["A", "E", "I", "O", "U"]);
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

  const examples = {
    A:"Apple",B:"Ball",C:"Cat",D:"Dog",E:"Egg",F:"Fish",G:"Goat",H:"Hat",
    I:"Ice cream",J:"Jam",K:"Kite",L:"Lion",M:"Moon",N:"Nest",O:"Orange",
    P:"Pen",Q:"Queen",R:"Rain",S:"Sun",T:"Tree",U:"Umbrella",V:"Van",
    W:"Water",X:"X-ray",Y:"Yellow",Z:"Zebra",
  };

  function speak(letter) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u1 = new SpeechSynthesisUtterance(letter);
      u1.rate = 0.8;
      const u2 = new SpeechSynthesisUtterance("... as in " + examples[letter]);
      u2.rate = 0.8;
      window.speechSynthesis.speak(u1);
      window.speechSynthesis.speak(u2);
    }
    setLastLetter(letter);
    setSpoken((prev) => new Set([...prev, letter]));
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="lana" size={40} />
        <div className="bg-purple-50 rounded-xl p-3 text-purple-800 text-sm font-medium border border-purple-200">
          Click each letter to hear its sound! Try all 26! 🎵
        </div>
      </div>
      <div className="grid grid-cols-6 md:grid-cols-9 gap-2 mb-4">
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => speak(letter)}
            className={[
              "aspect-square flex flex-col items-center justify-center rounded-xl font-bold text-lg shadow transition-all",
              spoken.has(letter) ? "scale-95 ring-2 ring-offset-1" : "hover:scale-110 hover:shadow-lg",
              vowels.has(letter)
                ? spoken.has(letter) ? "bg-purple-600 text-white ring-purple-400" : "bg-purple-100 text-purple-700 border-2 border-purple-300"
                : spoken.has(letter) ? "bg-blue-600 text-white ring-blue-400" : "bg-blue-50 text-blue-800 border-2 border-blue-200",
            ].join(" ")}
          >
            {letter}
          </button>
        ))}
      </div>
      {lastLetter && (
        <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-200 text-center">
          <span className="text-5xl font-extrabold text-purple-600">{lastLetter}</span>
          <p className="text-gray-700 mt-1">
            <span className="text-purple-500 font-bold">{lastLetter}</span> is for{" "}
            <span className="font-semibold">{examples[lastLetter]}</span>
          </p>
        </div>
      )}
      <div className="mt-3 flex flex-wrap gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-purple-100 border border-purple-300 inline-block" /> Vowels (A E I O U)</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-50 border border-blue-200 inline-block" /> Consonants</span>
        <span className="font-medium text-green-600">{spoken.size}/26 heard ✓</span>
      </div>
    </div>
  );
}

// ─── Activity 2: Sight Word Flashcards ────────────────────────────────────────
const SIGHT_WORDS = [
  { word: "the", sentence: "The cat is big.", emoji: "👆" },
  { word: "and", sentence: "Dogs and cats play.", emoji: "➕" },
  { word: "is", sentence: "The sky is blue.", emoji: "✅" },
  { word: "a", sentence: "I have a dog.", emoji: "🔤" },
  { word: "to", sentence: "I go to school.", emoji: "➡️" },
  { word: "in", sentence: "I am in the room.", emoji: "📦" },
  { word: "it", sentence: "It is raining.", emoji: "👉" },
  { word: "you", sentence: "You are my friend.", emoji: "👤" },
  { word: "he", sentence: "He likes bananas.", emoji: "👨" },
  { word: "she", sentence: "She is happy.", emoji: "👩" },
  { word: "we", sentence: "We go together.", emoji: "👫" },
  { word: "my", sentence: "My name is Alex.", emoji: "🌟" },
];

function SightWordsActivity() {
  const [cardIndex, setCardIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [mastered, setMastered] = useState(new Set());

  const card = SIGHT_WORDS[cardIndex];

  function speak(text) {
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.rate = 0.75;
      window.speechSynthesis.speak(u);
    }
  }

  function markMastered() {
    setMastered((prev) => new Set([...prev, card.word]));
    next();
  }

  function next() { setFlipped(false); setCardIndex((i) => (i + 1) % SIGHT_WORDS.length); }
  function prev() { setFlipped(false); setCardIndex((i) => (i - 1 + SIGHT_WORDS.length) % SIGHT_WORDS.length); }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="lana" size={40} />
        <div className="bg-purple-50 rounded-xl p-3 text-purple-800 text-sm font-medium border border-purple-200">
          Flash cards! Tap the card to flip it. Mark the words you know! 📖
        </div>
      </div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xs text-gray-500">Progress:</span>
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 transition-all" style={{ width: `${(mastered.size / SIGHT_WORDS.length) * 100}%` }} />
        </div>
        <span className="text-xs font-bold text-purple-600">{mastered.size}/{SIGHT_WORDS.length}</span>
      </div>
      <div className="relative cursor-pointer mx-auto" style={{ maxWidth: 280, minHeight: 180 }}
        onClick={() => { setFlipped(!flipped); speak(flipped ? card.word : card.sentence); }}>
        {!flipped ? (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-purple-100 to-purple-200 border-2 border-purple-300 p-6" style={{ minHeight: 180 }}>
            <span className="text-5xl mb-2">{card.emoji}</span>
            <span className="text-5xl font-extrabold text-purple-700">{card.word}</span>
            <span className="text-xs text-purple-500 mt-2">Tap to flip →</span>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-teal-100 border-2 border-teal-300 p-6" style={{ minHeight: 180 }}>
            <p className="text-xl font-semibold text-gray-700 text-center mb-2">{card.sentence}</p>
            <span className="text-xs text-teal-500">Tap to flip back</span>
          </div>
        )}
      </div>
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        <button onClick={prev} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">← Prev</button>
        <button onClick={() => speak(flipped ? card.sentence : card.word)} className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 hover:bg-purple-200 text-sm font-medium">🔊 Say it</button>
        <button onClick={markMastered} className={`px-4 py-2 rounded-lg text-sm font-medium ${mastered.has(card.word) ? "bg-green-200 text-green-700" : "bg-green-100 text-green-700 hover:bg-green-200"}`}>
          {mastered.has(card.word) ? "✓ Mastered!" : "✓ I know it!"}
        </button>
        <button onClick={next} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">Next →</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {SIGHT_WORDS.map((w, i) => (
          <button key={w.word} onClick={() => { setCardIndex(i); setFlipped(false); }}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${mastered.has(w.word) ? "bg-green-200 text-green-800 line-through" : i === cardIndex ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>
            {w.word}
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Activity 3: Sentence Builder ────────────────────────────────────────────
const SENTENCE_PUZZLES = [
  { words: ["The", "cat", "sat", "on", "the", "mat"], answer: "The cat sat on the mat" },
  { words: ["I", "like", "to", "eat", "apples"], answer: "I like to eat apples" },
  { words: ["She", "walks", "to", "school"], answer: "She walks to school" },
  { words: ["We", "play", "in", "the", "park"], answer: "We play in the park" },
];

function SentenceStartersActivity() {
  const [puzzleIdx, setPuzzleIdx] = useState(0);
  const puzzle = SENTENCE_PUZZLES[puzzleIdx];
  const [pool, setPool] = useState(() => [...puzzle.words].sort(() => Math.random() - 0.5));
  const [selected, setSelected] = useState([]);
  const [feedback, setFeedback] = useState(null);

  function pickWord(word, poolIdx) {
    const newSelected = [...selected, word];
    setSelected(newSelected);
    setPool((p) => p.filter((_, i) => i !== poolIdx));
    if (newSelected.join(" ") === puzzle.answer) {
      setFeedback("correct");
      if ("speechSynthesis" in window) {
        const u = new SpeechSynthesisUtterance("Excellent! " + puzzle.answer);
        u.rate = 0.8;
        window.speechSynthesis.speak(u);
      }
    }
  }

  function reset() {
    setSelected([]);
    setPool([...puzzle.words].sort(() => Math.random() - 0.5));
    setFeedback(null);
  }

  function nextPuzzle() {
    const next = (puzzleIdx + 1) % SENTENCE_PUZZLES.length;
    setPuzzleIdx(next);
    setSelected([]);
    setPool([...SENTENCE_PUZZLES[next].words].sort(() => Math.random() - 0.5));
    setFeedback(null);
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="lana" size={40} />
        <div className="bg-purple-50 rounded-xl p-3 text-purple-800 text-sm font-medium border border-purple-200">
          Build the sentence! Click words in the right order. 🏗️
        </div>
      </div>
      <div className="min-h-[60px] flex flex-wrap gap-2 items-center p-4 bg-white border-2 border-dashed border-purple-300 rounded-xl mb-4">
        {selected.length === 0 && <span className="text-gray-400 text-sm">Your sentence will appear here…</span>}
        {selected.map((word, i) => (
          <span key={i} className="px-3 py-1.5 bg-purple-600 text-white rounded-lg font-medium shadow text-sm">{word}</span>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 mb-4">
        {pool.map((word, i) => (
          <button key={i} onClick={() => pickWord(word, i)}
            className="px-3 py-1.5 bg-white border-2 border-purple-300 text-purple-700 rounded-lg font-medium hover:bg-purple-50 hover:scale-105 transition-all shadow-sm">
            {word}
          </button>
        ))}
      </div>
      {feedback === "correct" && (
        <div className="p-4 bg-green-50 border-2 border-green-300 rounded-xl text-center mb-4">
          <span className="text-3xl">🎉</span>
          <p className="text-green-700 font-bold text-lg mt-1">Fantastic sentence!</p>
          <p className="text-green-600">"{puzzle.answer}"</p>
        </div>
      )}
      <div className="flex gap-3">
        <button onClick={reset} className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm">🔄 Reset</button>
        {feedback === "correct" && (
          <button onClick={nextPuzzle} className="px-4 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 text-sm font-medium">Next sentence →</button>
        )}
      </div>
      <p className="text-xs text-gray-400 mt-2">Puzzle {puzzleIdx + 1} of {SENTENCE_PUZZLES.length}</p>
    </div>
  );
}

// ─── Activity 4: Language Quiz ─────────────────────────────────────────────────
const LANG_QUIZ = [
  { q: "Which letter makes the sound 'sss'?", opts: ["S", "C", "Z"], correct: 0 },
  { q: "Which word rhymes with 'cat'?", opts: ["Dog", "Mat", "Run"], correct: 1 },
  { q: "How many vowels are in the alphabet?", opts: ["3", "5", "7"], correct: 1 },
  { q: "Which of these is a vowel?", opts: ["B", "E", "T"], correct: 1 },
  { q: "The word 'apple' starts with which sound?", opts: ["/b/", "/a/", "/p/"], correct: 1 },
  { q: "Which word means a person you know well?", opts: ["Friend", "House", "Run"], correct: 0 },
];

function LanguageChecklist() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = Object.entries(answers).filter(([i, a]) => Number(a) === LANG_QUIZ[Number(i)].correct).length;

  function answer(qi, ai) { if (!submitted) setAnswers((prev) => ({ ...prev, [qi]: ai })); }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="lana" size={40} />
        <div className="bg-purple-50 rounded-xl p-3 text-purple-800 text-sm font-medium border border-purple-200">
          Quiz time! Test what you have learned. 🌟
        </div>
      </div>
      <div className="space-y-5">
        {LANG_QUIZ.map((q, qi) => (
          <div key={qi} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.opts.map((opt, ai) => {
                let style = "bg-gray-100 text-gray-700 hover:bg-gray-200";
                if (answers[qi] === ai) {
                  style = submitted
                    ? ai === q.correct ? "bg-green-200 text-green-800 font-bold" : "bg-red-200 text-red-800"
                    : "bg-purple-200 text-purple-800";
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
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < LANG_QUIZ.length}
          className="mt-4 w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 disabled:opacity-50 transition-all">
          Submit Answers
        </button>
      ) : (
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-center">
          <p className="text-5xl font-extrabold text-purple-700">{score}/{LANG_QUIZ.length}</p>
          <p className="text-gray-600 mt-2">
            {score === LANG_QUIZ.length ? "🏆 Perfect score!" : score >= 4 ? "🌟 Great work!" : "📖 Keep practising!"}
          </p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-3 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700">Try Again</button>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LanguagePhonicsLesson() {
  const [activeSection, setActiveSection] = useState("alphabet");
  const sections = [
    { id: "alphabet", label: "🔤 Alphabet Sounds", component: <AlphabetSoundsActivity /> },
    { id: "sightwords", label: "📖 Sight Words", component: <SightWordsActivity /> },
    { id: "sentences", label: "🏗️ Build Sentences", component: <SentenceStartersActivity /> },
    { id: "quiz", label: "🌟 Quiz", component: <LanguageChecklist /> },
  ];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6 text-white" style={{ background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 100%)" }}>
        <div className="absolute right-4 top-4 opacity-30 pointer-events-none"><LanaOwl size={100} /></div>
        <h2 className="text-2xl font-extrabold mb-1">Language &amp; Phonics</h2>
        <p className="text-purple-200 text-sm max-w-md">Learn letter sounds, sight words, and how to build sentences. Your guide Lana the Owl will help you!</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {["ACSF: Oral Communication", "ACSF: Reading", "NDIS: Social Participation"].map((tag) => (
            <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === s.id ? "bg-purple-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-purple-50"}`}>
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
