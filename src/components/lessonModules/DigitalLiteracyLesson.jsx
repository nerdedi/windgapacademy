import React, { useState } from "react";

import { DexFox, MiniAvatar } from "../CharacterAvatar";

// ─── Activity 1: Parts of a Device ────────────────────────────────────────
const DEVICE_PARTS = [
  { name: "Screen", emoji: "🖥️", description: "The screen shows you pictures, words and videos. You read and watch things here." },
  { name: "Keyboard", emoji: "⌨️", description: "You use the keyboard to type letters, numbers and words." },
  { name: "Mouse", emoji: "🖱️", description: "The mouse lets you point and click on things on the screen." },
  { name: "Microphone", emoji: "🎤", description: "The microphone lets the computer hear your voice." },
  { name: "Camera", emoji: "📷", description: "The camera takes photos and videos of you." },
  { name: "Speaker", emoji: "🔊", description: "The speaker lets you hear sounds and music from the computer." },
  { name: "USB Port", emoji: "🔌", description: "USB ports let you connect things like a USB stick or a charging cable." },
  { name: "Power Button", emoji: "⏻", description: "The power button turns your device on and off." },
];

function DevicePartsActivity() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="dex" size={40} />
        <div className="bg-orange-50 rounded-xl p-3 text-orange-900 text-sm font-medium border border-orange-200">
          Tap each part to learn what it does! 💻
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {DEVICE_PARTS.map((part) => (
          <button key={part.name} onClick={() => setSelected(selected?.name === part.name ? null : part)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${selected?.name === part.name ? "border-orange-500 bg-orange-50 shadow-md scale-95" : "border-gray-200 bg-white hover:border-orange-300 hover:scale-105"}`}>
            <span className="text-4xl mb-2">{part.emoji}</span>
            <span className="text-sm font-semibold text-gray-700 text-center">{part.name}</span>
          </button>
        ))}
      </div>
      {selected && (
        <div className="p-5 bg-gradient-to-r from-orange-50 to-yellow-50 border-2 border-orange-200 rounded-2xl">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">{selected.emoji}</span>
            <h3 className="text-xl font-bold text-orange-900">{selected.name}</h3>
          </div>
          <p className="text-gray-700 leading-relaxed">{selected.description}</p>
        </div>
      )}
    </div>
  );
}

// ─── Activity 2: Internet Safety Rules ────────────────────────────────────
const SAFETY_RULES = [
  {
    icon: "🔒", title: "Keep your password secret",
    detail: "Never tell your password to anyone — not even friends. A strong password uses numbers, letters and symbols.",
    good: true,
  },
  {
    icon: "🚫", title: "Don't share personal info online",
    detail: "Never give out your home address, phone number, school name or date of birth to people you don't know online.",
    good: true,
  },
  {
    icon: "🤝", title: "Be kind online",
    detail: "Treat others online the way you want to be treated. Do not say hurtful things to people on the internet.",
    good: true,
  },
  {
    icon: "📢", title: "Tell a trusted adult if something worries you",
    detail: "If you see something that makes you feel uncomfortable or scared online, tell a parent, carer or teacher straight away.",
    good: true,
  },
  {
    icon: "⚠️", title: "Don't meet strangers from the internet",
    detail: "Someone online might not be who they say they are. Never agree to meet someone in person that you only know from the internet.",
    good: true,
  },
  {
    icon: "✅", title: "Ask before downloading or buying",
    detail: "Always ask a trusted adult before downloading apps, games or buying anything online.",
    good: true,
  },
];

function InternetSafetyActivity() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="dex" size={40} />
        <div className="bg-orange-50 rounded-xl p-3 text-orange-900 text-sm font-medium border border-orange-200">
          Tap each rule to learn more. These rules keep you safe online! 🛡️
        </div>
      </div>
      <div className="space-y-3">
        {SAFETY_RULES.map((rule, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <button onClick={() => setExpanded(expanded === i ? null : i)}
              className="w-full flex items-center gap-4 p-4 hover:bg-orange-50 transition-all text-left">
              <span className="text-3xl flex-shrink-0">{rule.icon}</span>
              <span className="font-semibold text-gray-800 flex-1">{rule.title}</span>
              <span className="text-gray-400 text-lg">{expanded === i ? "▲" : "▼"}</span>
            </button>
            {expanded === i && (
              <div className="px-5 pb-4 text-gray-700 border-t border-gray-100 pt-3 bg-orange-50">
                {rule.detail}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Activity 3: Email Writing ────────────────────────────────────────────
const EMAIL_TEMPLATES = [
  {
    scenario: "Ask your teacher for help with an assignment",
    to: "teacher@school.edu.au",
    subject: "Help with my assignment",
    hint: "Start with 'Dear' and explain what you need help with politely.",
    sample: "Dear Ms Johnson,\n\nI am having trouble with my assignment about plants. Could you please help me understand Question 3?\n\nThank you very much,\n[Your name]",
  },
  {
    scenario: "Thank your support worker for their help",
    to: "support@example.com.au",
    subject: "Thank you!",
    hint: "Tell them what you are thankful for and why it helped you.",
    sample: "Dear Sarah,\n\nThank you so much for helping me with the bus trip yesterday. I felt much more confident because of your support.\n\nKind regards,\n[Your name]",
  },
];

function EmailWritingActivity() {
  const [templateIdx, setTemplateIdx] = useState(0);
  const [body, setBody] = useState("");
  const [sent, setSent] = useState(false);
  const t = EMAIL_TEMPLATES[templateIdx];

  function switchTemplate(i) { setTemplateIdx(i); setBody(""); setSent(false); }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="dex" size={40} />
        <div className="bg-orange-50 rounded-xl p-3 text-orange-900 text-sm font-medium border border-orange-200">
          Practise writing an email! Use the hint to help you. ✉️
        </div>
      </div>
      <div className="flex gap-2 mb-4">
        {EMAIL_TEMPLATES.map((tmpl, i) => (
          <button key={i} onClick={() => switchTemplate(i)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all ${templateIdx === i ? "bg-orange-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50"}`}>
            Scenario {i + 1}
          </button>
        ))}
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
        <p className="font-semibold text-blue-900 mb-1">📋 Your task:</p>
        <p className="text-blue-800">{t.scenario}</p>
        <p className="text-blue-600 text-sm mt-2">💡 Hint: {t.hint}</p>
      </div>
      {!sent ? (
        <div className="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-sm">
          <div className="space-y-3 mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-500 w-16">To:</span>
              <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">{t.to}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-500 w-16">Subject:</span>
              <span className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 border border-gray-200">{t.subject}</span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-500 block mb-2">Message:</span>
              <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)}
                placeholder="Start typing your email here..."
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:border-orange-400 focus:outline-none resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setSent(true)} disabled={body.trim().length < 20}
              className="px-5 py-2 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-40 transition-all">
              📤 Send Email
            </button>
            <button onClick={() => setBody(t.sample)} className="px-4 py-2 border border-gray-200 rounded-xl text-sm hover:bg-gray-50">Show example</button>
          </div>
        </div>
      ) : (
        <div className="bg-green-50 border-2 border-green-300 rounded-2xl p-6 text-center">
          <span className="text-5xl">📬</span>
          <p className="text-xl font-bold text-green-700 mt-3">Email sent!</p>
          <p className="text-gray-600 mt-2">Great work writing that email professionally.</p>
          <button onClick={() => setSent(false)} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700">Write another</button>
        </div>
      )}
    </div>
  );
}

// ─── Activity 4: Digital Safety Quiz ─────────────────────────────────────
const DIG_QUIZ = [
  { q: "What should you do if a stranger online asks for your home address?", opts: ["Give it to them", "Ask a trusted adult and don't share it", "Share your school address instead"], correct: 1 },
  { q: "Which is the strongest password?", opts: ["1234", "myname", "Tr0p!c@l#7"], correct: 2 },
  { q: "What does the @ symbol mean in an email address?", opts: ["It separates your name from the service provider", "It means the email is secure", "It is your password"], correct: 0 },
  { q: "What should you do before downloading a new app?", opts: ["Download it straight away", "Ask a trusted adult first", "Tell your friends online"], correct: 1 },
  { q: "What is the KEYBOARD used for?", opts: ["Looking at pictures", "Typing letters and numbers", "Making the screen brighter"], correct: 1 },
];

function DigitalQuiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = Object.entries(answers).filter(([i, a]) => Number(a) === DIG_QUIZ[Number(i)].correct).length;

  function answer(qi, ai) { if (!submitted) setAnswers((prev) => ({ ...prev, [qi]: ai })); }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="dex" size={40} />
        <div className="bg-orange-50 rounded-xl p-3 text-orange-900 text-sm font-medium border border-orange-200">
          Digital skills quiz! Show what you know. 🌟
        </div>
      </div>
      <div className="space-y-5">
        {DIG_QUIZ.map((q, qi) => (
          <div key={qi} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.q}</p>
            <div className="flex flex-col gap-2">
              {q.opts.map((opt, ai) => {
                let style = "bg-gray-100 text-gray-700 hover:bg-gray-200 text-left";
                if (answers[qi] === ai) {
                  style = submitted
                    ? ai === q.correct ? "bg-green-200 text-green-800 font-bold" : "bg-red-200 text-red-800"
                    : "bg-orange-200 text-orange-900";
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
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < DIG_QUIZ.length}
          className="mt-4 w-full py-3 bg-orange-600 text-white rounded-xl font-semibold hover:bg-orange-700 disabled:opacity-50 transition-all">
          Submit Answers
        </button>
      ) : (
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 text-center">
          <p className="text-5xl font-extrabold text-orange-700">{score}/{DIG_QUIZ.length}</p>
          <p className="text-gray-600 mt-2">{score === DIG_QUIZ.length ? "🏆 Digital star!" : score >= 3 ? "🌟 Great work!" : "💻 Keep practising!"}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-3 px-4 py-2 bg-orange-600 text-white rounded-lg text-sm font-medium hover:bg-orange-700">Try Again</button>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function DigitalLiteracyLesson() {
  const [activeSection, setActiveSection] = useState("devices");
  const sections = [
    { id: "devices", label: "💻 Device Parts", component: <DevicePartsActivity /> },
    { id: "safety", label: "🛡️ Internet Safety", component: <InternetSafetyActivity /> },
    { id: "email", label: "✉️ Email Writing", component: <EmailWritingActivity /> },
    { id: "quiz", label: "🌟 Quiz", component: <DigitalQuiz /> },
  ];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6 text-white" style={{ background: "linear-gradient(135deg, #EA580C 0%, #DC2626 100%)" }}>
        <div className="absolute right-4 top-4 opacity-30 pointer-events-none"><DexFox size={100} /></div>
        <h2 className="text-2xl font-extrabold mb-1">Digital Literacy</h2>
        <p className="text-orange-200 text-sm max-w-md">Learn about devices, stay safe online, and write emails. Dex the Fox is your tech guide!</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {["ACSF: Digital Literacy", "NDIS: Community Participation", "Online Safety"].map((tag) => (
            <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === s.id ? "bg-orange-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-orange-50"}`}>
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
