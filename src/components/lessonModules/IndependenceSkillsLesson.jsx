import React, { useState } from "react";

import { IndyKoala, MiniAvatar } from "../CharacterAvatar";

// ─── Activity 1: Daily Routine Builder ────────────────────────────────────
const ROUTINE_ITEMS = {
  morning: [
    { id: "wake", label: "Wake up", emoji: "⏰" },
    { id: "toilet", label: "Use the toilet", emoji: "🚽" },
    { id: "wash", label: "Wash face & hands", emoji: "🚿" },
    { id: "brush", label: "Brush teeth", emoji: "🪥" },
    { id: "dress", label: "Get dressed", emoji: "👕" },
    { id: "breakfast", label: "Eat breakfast", emoji: "🥣" },
    { id: "bag", label: "Pack your bag", emoji: "🎒" },
  ],
  afternoon: [
    { id: "arrive", label: "Arrive home", emoji: "🏠" },
    { id: "snack", label: "Have a snack", emoji: "🍎" },
    { id: "homework", label: "Do homework or activities", emoji: "📚" },
    { id: "chores", label: "Do your chores", emoji: "🧹" },
    { id: "play", label: "Free time / play", emoji: "🎮" },
  ],
  evening: [
    { id: "dinner", label: "Eat dinner", emoji: "🍽️" },
    { id: "bath", label: "Shower or bath", emoji: "🛁" },
    { id: "pyjamas", label: "Put on pyjamas", emoji: "😴" },
    { id: "read", label: "Read or relax", emoji: "📖" },
    { id: "sleep", label: "Go to sleep", emoji: "🌙" },
  ],
};

function DailyRoutineActivity() {
  const [session, setSession] = useState("morning");
  const [done, setDone] = useState(new Set());

  const items = ROUTINE_ITEMS[session];
  const completed = items.filter((i) => done.has(`${session}-${i.id}`)).length;

  function toggle(id) {
    const key = `${session}-${id}`;
    setDone((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="indy" size={40} />
        <div className="bg-green-50 rounded-xl p-3 text-green-900 text-sm font-medium border border-green-200">
          Build your daily routine! Tick off each task as you complete it. ✅
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        {Object.keys(ROUTINE_ITEMS).map((s) => (
          <button key={s} onClick={() => setSession(s)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${session === s ? "bg-green-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50"}`}>
            {s === "morning" ? "🌅 Morning" : s === "afternoon" ? "☀️ Afternoon" : "🌙 Evening"}
          </button>
        ))}
      </div>
      <div className="mb-3 flex items-center gap-2">
        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all" style={{ width: `${(completed / items.length) * 100}%` }} />
        </div>
        <span className="text-sm font-bold text-green-600">{completed}/{items.length}</span>
      </div>
      <div className="space-y-2">
        {items.map((item) => {
          const key = `${session}-${item.id}`;
          const isDone = done.has(key);
          return (
            <button key={item.id} onClick={() => toggle(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${isDone ? "bg-green-50 border-green-300" : "bg-white border-gray-200 hover:border-green-300"}`}>
              <span className="text-3xl">{item.emoji}</span>
              <span className={`flex-1 font-medium text-base ${isDone ? "line-through text-gray-400" : "text-gray-800"}`}>{item.label}</span>
              <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold transition-all ${isDone ? "bg-green-500 border-green-500 text-white" : "border-gray-300 text-gray-300"}`}>
                {isDone ? "✓" : ""}
              </span>
            </button>
          );
        })}
      </div>
      {completed === items.length && (
        <div className="mt-4 p-4 bg-green-100 border-2 border-green-400 rounded-2xl text-center">
          <p className="text-2xl font-bold text-green-800">🎉 Amazing! All {session} tasks done!</p>
        </div>
      )}
    </div>
  );
}

// ─── Activity 2: Bus Timetable Reading ─────────────────────────────────────
const BUS_TIMETABLE = [
  { stop: "City Centre (Stop A)", times: ["8:00", "8:30", "9:00", "9:30", "10:00"] },
  { stop: "Main Street Library", times: ["8:08", "8:38", "9:08", "9:38", "10:08"] },
  { stop: "Shopping Centre", times: ["8:15", "8:45", "9:15", "9:45", "10:15"] },
  { stop: "Community Centre", times: ["8:22", "8:52", "9:22", "9:52", "10:22"] },
  { stop: "Park & Ride", times: ["8:30", "9:00", "9:30", "10:00", "10:30"] },
];

const BUS_QUESTIONS = [
  { q: "What time does the first bus leave City Centre?", answer: "8:00" },
  { q: "How long does it take from City Centre to the Shopping Centre?", answer: "15 minutes" },
  { q: "If you need to be at the Community Centre by 9:30, which bus should you catch from City Centre?", answer: "9:00" },
];

function PublicTransportActivity() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="indy" size={40} />
        <div className="bg-green-50 rounded-xl p-3 text-green-900 text-sm font-medium border border-green-200">
          Read the bus timetable and answer the questions. 🚌
        </div>
      </div>
      <div className="overflow-x-auto mb-5">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-3 text-left rounded-tl-xl font-bold">Stop</th>
              {[1,2,3,4,5].map((n) => <th key={n} className="p-3 text-center font-bold">Bus {n}</th>)}
            </tr>
          </thead>
          <tbody>
            {BUS_TIMETABLE.map((row, i) => (
              <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-green-50"}>
                <td className="p-3 font-medium text-gray-800 border-b border-gray-100">{row.stop}</td>
                {row.times.map((t, j) => <td key={j} className="p-3 text-center text-gray-700 border-b border-gray-100 font-mono">{t}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <h4 className="font-bold text-gray-800 mb-3">Answer these questions about the timetable:</h4>
      <div className="space-y-4">
        {BUS_QUESTIONS.map((q, qi) => (
          <div key={qi} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="font-semibold text-gray-800 mb-2">{qi + 1}. {q.q}</p>
            <div className="flex gap-2">
              <input value={answers[qi] || ""} onChange={(e) => setAnswers((p) => ({ ...p, [qi]: e.target.value }))}
                disabled={submitted}
                placeholder="Type your answer..."
                className="flex-1 px-4 py-2 border-2 border-gray-200 rounded-xl text-sm focus:border-green-400 focus:outline-none" />
              {submitted && (
                <span className={`px-3 py-2 rounded-xl text-sm font-semibold ${answers[qi]?.toLowerCase().includes(q.answer.toLowerCase()) ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                  {answers[qi]?.toLowerCase().includes(q.answer.toLowerCase()) ? "✓" : `Answer: ${q.answer}`}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
      {!submitted ? (
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < BUS_QUESTIONS.length}
          className="mt-4 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-all">
          Check Answers
        </button>
      ) : (
        <button onClick={() => { setAnswers({}); setSubmitted(false); }}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700">Try again</button>
      )}
    </div>
  );
}

// ─── Activity 3: Emergency Information ────────────────────────────────────
const EMERGENCY_INFO = [
  { service: "Police", number: "000", emoji: "🚔", when: "When there is a crime or immediate danger" },
  { service: "Ambulance", number: "000", emoji: "🚑", when: "When someone is very sick or hurt" },
  { service: "Fire Brigade", number: "000", emoji: "🚒", when: "When there is a fire" },
  { service: "Emergency (all)", number: "000", emoji: "🆘", when: "Any life-threatening emergency" },
  { service: "Poison Info", number: "13 11 26", emoji: "☠️", when: "If someone swallowed something dangerous" },
  { service: "Crisis Support", number: "13 11 14", emoji: "💙", when: "Lifeline: When you feel overwhelmed or unsafe" },
];

function EmergencyContactsActivity() {
  const [revealed, setRevealed] = useState(new Set());
  const [quizMode, setQuizMode] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizFeedback, setQuizFeedback] = useState(null);

  function checkQuiz() {
    const correct = quizAnswer.replace(/\s/g, "") === EMERGENCY_INFO[quizIdx].number.replace(/\s/g, "");
    setQuizFeedback(correct ? "correct" : "wrong");
    setTimeout(() => {
      if (correct) { setQuizIdx((i) => (i + 1) % EMERGENCY_INFO.length); setQuizAnswer(""); setQuizFeedback(null); }
    }, 1200);
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="indy" size={40} />
        <div className="bg-green-50 rounded-xl p-3 text-green-900 text-sm font-medium border border-green-200">
          Learn important emergency numbers. These could save a life! 📞
        </div>
      </div>
      <div className="flex gap-2 mb-5">
        <button onClick={() => setQuizMode(false)} className={`px-4 py-2 rounded-xl text-sm font-semibold ${!quizMode ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>📋 Learn</button>
        <button onClick={() => setQuizMode(true)} className={`px-4 py-2 rounded-xl text-sm font-semibold ${quizMode ? "bg-green-600 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>🧠 Quiz</button>
      </div>
      {!quizMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {EMERGENCY_INFO.map((info, i) => (
            <button key={i} onClick={() => setRevealed((p) => { const n = new Set(p); n.has(i) ? n.delete(i) : n.add(i); return n; })}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${revealed.has(i) ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-green-300"}`}>
              <div className="flex items-center gap-3 mb-1">
                <span className="text-3xl">{info.emoji}</span>
                <span className="font-bold text-gray-800">{info.service}</span>
                {revealed.has(i) && <span className="ml-auto font-extrabold text-green-700 text-lg">{info.number}</span>}
              </div>
              <p className="text-sm text-gray-600 ml-12">{info.when}</p>
              {!revealed.has(i) && <p className="text-xs text-green-600 ml-12 mt-1">Tap to see number</p>}
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white border-2 border-green-300 rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-5xl">{EMERGENCY_INFO[quizIdx].emoji}</span>
            <div className="text-left">
              <p className="text-xl font-bold text-gray-800">{EMERGENCY_INFO[quizIdx].service}</p>
              <p className="text-sm text-gray-500">{EMERGENCY_INFO[quizIdx].when}</p>
            </div>
          </div>
          <p className="text-gray-600 mb-4">What number do you call?</p>
          <div className="flex gap-3 justify-center">
            <input value={quizAnswer} onChange={(e) => setQuizAnswer(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && checkQuiz()}
              placeholder="Type the number..."
              className="px-4 py-3 border-2 border-gray-200 rounded-xl text-center text-xl font-bold w-40 focus:border-green-400 focus:outline-none" />
            <button onClick={checkQuiz} className="px-5 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700">Check</button>
          </div>
          {quizFeedback === "correct" && <p className="mt-4 text-2xl font-bold text-green-700">✓ Correct!</p>}
          {quizFeedback === "wrong" && <p className="mt-4 text-lg font-semibold text-red-600">Not quite — the answer is {EMERGENCY_INFO[quizIdx].number}</p>}
          <p className="text-xs text-gray-400 mt-3">Card {quizIdx + 1} of {EMERGENCY_INFO.length}</p>
        </div>
      )}
    </div>
  );
}

// ─── Activity 4: Independence Quiz ─────────────────────────────────────────
const IND_QUIZ = [
  { q: "What is the first thing you should do in the morning to stay clean?", opts: ["Watch TV", "Wash face and brush teeth", "Eat lunch"], correct: 1 },
  { q: "If you smell smoke inside a building, what should you do?", opts: ["Keep reading", "Leave the building and call 000", "Open a window"], correct: 1 },
  { q: "Which number do you call for ANY emergency in Australia?", opts: ["112", "000", "131"], correct: 1 },
  { q: "You need to catch a bus that leaves at 9:00. What time should you arrive at the stop?", opts: ["9:10", "9:00 exactly", "A few minutes before 9:00"], correct: 2 },
  { q: "What does a timetable help you with?", opts: ["Cooking food", "Knowing when to catch buses and trains", "Spelling words"], correct: 1 },
];

function IndependenceQuiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = Object.entries(answers).filter(([i, a]) => Number(a) === IND_QUIZ[Number(i)].correct).length;

  function answer(qi, ai) { if (!submitted) setAnswers((prev) => ({ ...prev, [qi]: ai })); }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="indy" size={40} />
        <div className="bg-green-50 rounded-xl p-3 text-green-900 text-sm font-medium border border-green-200">
          Independence skills quiz! 🌟
        </div>
      </div>
      <div className="space-y-5">
        {IND_QUIZ.map((q, qi) => (
          <div key={qi} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.q}</p>
            <div className="flex flex-col gap-2">
              {q.opts.map((opt, ai) => {
                let style = "bg-gray-100 text-gray-700 hover:bg-gray-200 text-left";
                if (answers[qi] === ai) {
                  style = submitted
                    ? ai === q.correct ? "bg-green-200 text-green-800 font-bold" : "bg-red-200 text-red-800"
                    : "bg-green-200 text-green-900";
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
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < IND_QUIZ.length}
          className="mt-4 w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-all">
          Submit Answers
        </button>
      ) : (
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-green-50 to-teal-50 border border-green-200 text-center">
          <p className="text-5xl font-extrabold text-green-700">{score}/{IND_QUIZ.length}</p>
          <p className="text-gray-600 mt-2">{score === IND_QUIZ.length ? "🏆 Independence champion!" : score >= 3 ? "🌟 Great work!" : "🏠 Keep learning!"}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Try Again</button>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function IndependenceSkillsLesson() {
  const [activeSection, setActiveSection] = useState("routine");
  const sections = [
    { id: "routine", label: "📋 Daily Routine", component: <DailyRoutineActivity /> },
    { id: "transport", label: "🚌 Public Transport", component: <PublicTransportActivity /> },
    { id: "emergency", label: "🆘 Emergency Info", component: <EmergencyContactsActivity /> },
    { id: "quiz", label: "🌟 Quiz", component: <IndependenceQuiz /> },
  ];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6 text-white" style={{ background: "linear-gradient(135deg, #16A34A 0%, #0D9488 100%)" }}>
        <div className="absolute right-4 top-4 opacity-30 pointer-events-none"><IndyKoala size={100} /></div>
        <h2 className="text-2xl font-extrabold mb-1">Independence Skills</h2>
        <p className="text-green-200 text-sm max-w-md">Build daily routines, use public transport, and know who to call in emergencies. Indy the Koala is your guide!</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {["NDIS: Daily Living", "NDIS: Community Access", "Life Skills"].map((tag) => (
            <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === s.id ? "bg-green-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-green-50"}`}>
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
