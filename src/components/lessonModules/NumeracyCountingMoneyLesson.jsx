import React, { useState } from "react";

import { NiaPenguin, MiniAvatar } from "../CharacterAvatar";

// ─── Activity 1: Coin Recognition ─────────────────────────────────────────
const COINS = [
  { label: "5c", value: 5, color: "#CD7F32", size: 56, description: "Five cents – bronze, small and round" },
  { label: "10c", value: 10, color: "#C0C0C0", size: 60, description: "Ten cents – silver, small" },
  { label: "20c", value: 20, color: "#C0C0C0", size: 66, description: "Twenty cents – silver, twelve-sided" },
  { label: "50c", value: 50, color: "#C0C0C0", size: 74, description: "Fifty cents – silver, twelve-sided, biggest" },
  { label: "$1", value: 100, color: "#FFD700", size: 68, description: "One dollar – gold, round" },
  { label: "$2", value: 200, color: "#FFD700", size: 62, description: "Two dollars – gold, smaller than $1" },
];

function CoinRecognitionActivity() {
  const [selected, setSelected] = useState(null);
  const [quiz, setQuiz] = useState(() => COINS[Math.floor(Math.random() * COINS.length)]);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [feedback, setFeedback] = useState(null);

  function pick(coin) {
    setSelected(coin.label);
    if (coin.label === quiz.label) {
      setFeedback({ ok: true, msg: `✓ Correct! That is ${quiz.label}` });
      setScore((s) => s + 1);
    } else {
      setFeedback({ ok: false, msg: `Not quite – that was ${coin.label}. The answer is ${quiz.label}` });
    }
    setTimeout(() => {
      setRounds((r) => r + 1);
      setQuiz(COINS[Math.floor(Math.random() * COINS.length)]);
      setSelected(null);
      setFeedback(null);
    }, 1800);
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="nia" size={40} />
        <div className="bg-teal-50 rounded-xl p-3 text-teal-900 text-sm font-medium border border-teal-200">
          Tap the coin that matches! 🪙
        </div>
      </div>
      {rounds > 0 && <p className="text-sm text-gray-500 mb-3">Score: <span className="font-bold text-teal-600">{score}/{rounds}</span></p>}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-200 rounded-2xl p-5 text-center mb-5">
        <p className="text-sm text-gray-500 mb-1">Find this coin:</p>
        <p className="text-4xl font-extrabold text-teal-800">{quiz.label}</p>
        <p className="text-sm text-gray-500 mt-1">{quiz.description}</p>
      </div>
      {feedback && (
        <div className={`p-3 rounded-xl text-center mb-4 font-semibold ${feedback.ok ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}`}>
          {feedback.msg}
        </div>
      )}
      <div className="grid grid-cols-3 gap-4">
        {COINS.map((coin) => (
          <button key={coin.label} onClick={() => !feedback && pick(coin)}
            className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${selected === coin.label ? "border-teal-500 scale-95 shadow-md" : "border-gray-200 bg-white hover:border-teal-300 hover:scale-105"}`}>
            <div className="rounded-full flex items-center justify-center font-extrabold text-white shadow-lg mb-2"
              style={{ width: coin.size, height: coin.size, backgroundColor: coin.color, fontSize: coin.size / 3.2, boxShadow: `0 4px 12px ${coin.color}88` }}>
              {coin.label}
            </div>
            <span className="text-sm font-semibold text-gray-700">{coin.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Activity 2: Shopping Calculator ──────────────────────────────────────
const SHOP_ITEMS = [
  { name: "Milk", price: 2.50, emoji: "🥛" },
  { name: "Bread", price: 3.00, emoji: "🍞" },
  { name: "Apple", price: 0.80, emoji: "🍎" },
  { name: "Banana", price: 1.20, emoji: "🍌" },
  { name: "Cheese", price: 4.50, emoji: "🧀" },
  { name: "Eggs (6)", price: 3.80, emoji: "🥚" },
  { name: "Orange Juice", price: 3.20, emoji: "🍊" },
  { name: "Yoghurt", price: 2.10, emoji: "🫙" },
];

function ShoppingCalculatorActivity() {
  const [cart, setCart] = useState([]);

  function addToCart(item) {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name);
      if (existing) return prev.map((c) => c.name === item.name ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { ...item, qty: 1 }];
    });
  }

  function removeFromCart(name) {
    setCart((prev) => prev.flatMap((c) => c.name === name ? (c.qty > 1 ? [{ ...c, qty: c.qty - 1 }] : []) : [c]));
  }

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="nia" size={40} />
        <div className="bg-teal-50 rounded-xl p-3 text-teal-900 text-sm font-medium border border-teal-200">
          Go shopping! Add items to your basket and add up the total. 🛒
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        {SHOP_ITEMS.map((item) => (
          <button key={item.name} onClick={() => addToCart(item)}
            className="flex flex-col items-center p-3 rounded-2xl bg-white border-2 border-gray-200 hover:border-teal-400 hover:scale-105 hover:shadow-md transition-all">
            <span className="text-4xl mb-1">{item.emoji}</span>
            <span className="text-sm font-semibold text-gray-700">{item.name}</span>
            <span className="text-teal-700 font-bold text-sm">${item.price.toFixed(2)}</span>
          </button>
        ))}
      </div>
      <div className="bg-teal-50 rounded-2xl border border-teal-200 p-4">
        <h4 className="font-bold text-teal-900 mb-3 flex items-center gap-2">🛒 Your Basket</h4>
        {cart.length === 0 ? (
          <p className="text-gray-400 text-sm">Add items from the shop above</p>
        ) : (
          <div className="space-y-2 mb-3">
            {cart.map((c) => (
              <div key={c.name} className="flex items-center justify-between bg-white rounded-xl px-3 py-2 border border-teal-100">
                <span className="font-medium">{c.emoji} {c.name}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => removeFromCart(c.name)} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-bold text-sm flex items-center justify-center">−</button>
                  <span className="font-bold w-5 text-center">{c.qty}</span>
                  <button onClick={() => addToCart(c)} className="w-6 h-6 rounded-full bg-teal-100 hover:bg-teal-200 text-teal-700 font-bold text-sm flex items-center justify-center">+</button>
                  <span className="font-bold text-teal-700 w-16 text-right">${(c.price * c.qty).toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="border-t border-teal-200 pt-3 flex justify-between items-center">
          <span className="font-bold text-gray-700">Total:</span>
          <span className="text-2xl font-extrabold text-teal-700">${total.toFixed(2)}</span>
        </div>
        {cart.length > 0 && (
          <button onClick={() => setCart([])} className="mt-3 w-full py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">Clear basket</button>
        )}
      </div>
    </div>
  );
}

// ─── Activity 3: Change Calculator ────────────────────────────────────────
function ChangeCalculatorActivity() {
  const [price, setPrice] = useState("");
  const [paid, setPaid] = useState("");
  const [showAnswer, setShowAnswer] = useState(false);

  const priceNum = parseFloat(price) || 0;
  const paidNum = parseFloat(paid) || 0;
  const change = paidNum - priceNum;
  const valid = paidNum > 0 && priceNum > 0 && paidNum >= priceNum;

  const NOTE_OPTIONS = [5, 10, 20, 50, 100];

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="nia" size={40} />
        <div className="bg-teal-50 rounded-xl p-3 text-teal-900 text-sm font-medium border border-teal-200">
          How much change do you get back? Enter the price and how much you paid. 💵
        </div>
      </div>
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Item Price ($)</label>
            <input type="number" min="0" step="0.05" value={price} onChange={(e) => { setPrice(e.target.value); setShowAnswer(false); }}
              placeholder="e.g. 3.50"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-bold focus:border-teal-400 focus:outline-none" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Amount You Pay ($)</label>
            <input type="number" min="0" step="0.05" value={paid} onChange={(e) => { setPaid(e.target.value); setShowAnswer(false); }}
              placeholder="e.g. 5.00"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-lg font-bold focus:border-teal-400 focus:outline-none" />
            <div className="flex gap-2 mt-2 flex-wrap">
              {NOTE_OPTIONS.map((n) => (
                <button key={n} onClick={() => { setPaid(String(n)); setShowAnswer(false); }}
                  className="px-2 py-1 bg-yellow-100 border border-yellow-300 text-yellow-800 rounded-lg text-xs font-bold hover:bg-yellow-200">${n}</button>
              ))}
            </div>
          </div>
        </div>
        {paidNum > 0 && priceNum > 0 && paidNum < priceNum && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium mb-4">
            ⚠️ You need ${(priceNum - paidNum).toFixed(2)} more to cover the price!
          </div>
        )}
        {valid && !showAnswer && (
          <button onClick={() => setShowAnswer(true)}
            className="w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-all">
            Calculate Change
          </button>
        )}
        {showAnswer && valid && (
          <div className="bg-gradient-to-r from-teal-50 to-blue-50 border-2 border-teal-300 rounded-2xl p-5 text-center">
            <p className="text-gray-600 text-sm mb-1">You paid ${paidNum.toFixed(2)} for an item worth ${priceNum.toFixed(2)}</p>
            <p className="text-5xl font-extrabold text-teal-700 mt-2">${change.toFixed(2)}</p>
            <p className="text-green-700 font-semibold mt-1">Change to receive 🪙</p>
            <button onClick={() => { setPrice(""); setPaid(""); setShowAnswer(false); }}
              className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Try another</button>
          </div>
        )}
      </div>
      <div className="bg-teal-50 rounded-xl p-4 border border-teal-200">
        <p className="text-sm font-bold text-teal-900 mb-2">💡 How to work it out:</p>
        <p className="text-sm text-teal-800">Change = Amount Paid − Item Price</p>
        <p className="text-sm text-teal-700 mt-1">Example: Pay $10 for an item worth $6.50 → Change = $10 − $6.50 = <strong>$3.50</strong></p>
      </div>
    </div>
  );
}

// ─── Activity 4: Numeracy Quiz ─────────────────────────────────────────────
const NUM_QUIZ = [
  { q: "What is 5 + 8?", opts: ["12", "13", "14"], correct: 1 },
  { q: "Which coin is worth more — $1 or 50c?", opts: ["$1", "50c", "They're the same"], correct: 0 },
  { q: "If something costs $4.50 and you pay $5, how much change do you get?", opts: ["$0.50", "$1.00", "$0.25"], correct: 0 },
  { q: "What is 3 × 4?", opts: ["10", "12", "14"], correct: 1 },
  { q: "Round $2.76 to the nearest dollar:", opts: ["$2", "$3", "$4"], correct: 1 },
  { q: "You buy 2 apples for $0.80 each. How much is the total?", opts: ["$1.20", "$1.60", "$0.80"], correct: 1 },
];

function NumeracyQuiz() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const score = Object.entries(answers).filter(([i, a]) => Number(a) === NUM_QUIZ[Number(i)].correct).length;

  function answer(qi, ai) { if (!submitted) setAnswers((prev) => ({ ...prev, [qi]: ai })); }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <MiniAvatar character="nia" size={40} />
        <div className="bg-teal-50 rounded-xl p-3 text-teal-900 text-sm font-medium border border-teal-200">
          Numeracy quiz! Test your maths and money skills. 🌟
        </div>
      </div>
      <div className="space-y-5">
        {NUM_QUIZ.map((q, qi) => (
          <div key={qi} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm">
            <p className="font-semibold text-gray-800 mb-3">{qi + 1}. {q.q}</p>
            <div className="flex flex-wrap gap-2">
              {q.opts.map((opt, ai) => {
                let style = "bg-gray-100 text-gray-700 hover:bg-gray-200";
                if (answers[qi] === ai) {
                  style = submitted
                    ? ai === q.correct ? "bg-green-200 text-green-800 font-bold" : "bg-red-200 text-red-800"
                    : "bg-teal-200 text-teal-900";
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
        <button onClick={() => setSubmitted(true)} disabled={Object.keys(answers).length < NUM_QUIZ.length}
          className="mt-4 w-full py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 disabled:opacity-50 transition-all">
          Submit Answers
        </button>
      ) : (
        <div className="mt-4 p-5 rounded-xl bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 text-center">
          <p className="text-5xl font-extrabold text-teal-700">{score}/{NUM_QUIZ.length}</p>
          <p className="text-gray-600 mt-2">{score === NUM_QUIZ.length ? "🏆 Perfect score!" : score >= 4 ? "🌟 Great work!" : "🔢 Keep practising!"}</p>
          <button onClick={() => { setAnswers({}); setSubmitted(false); }}
            className="mt-3 px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700">Try Again</button>
        </div>
      )}
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function NumeracyCountingMoneyLesson() {
  const [activeSection, setActiveSection] = useState("coins");
  const sections = [
    { id: "coins", label: "🪙 Coin Recognition", component: <CoinRecognitionActivity /> },
    { id: "shopping", label: "🛒 Shopping", component: <ShoppingCalculatorActivity /> },
    { id: "change", label: "💵 Making Change", component: <ChangeCalculatorActivity /> },
    { id: "quiz", label: "🌟 Quiz", component: <NumeracyQuiz /> },
  ];

  return (
    <div className="space-y-6">
      <div className="relative rounded-2xl overflow-hidden p-6 text-white" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0891B2 100%)" }}>
        <div className="absolute right-4 top-4 opacity-30 pointer-events-none"><NiaPenguin size={100} /></div>
        <h2 className="text-2xl font-extrabold mb-1">Numeracy &amp; Money</h2>
        <p className="text-teal-200 text-sm max-w-md">Count coins, go shopping, and calculate change. Nia the Penguin will guide you through every step!</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {["ACSF: Numeracy", "NDIS: Daily Living", "Money Skills"].map((tag) => (
            <span key={tag} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeSection === s.id ? "bg-teal-600 text-white shadow-md" : "bg-white border border-gray-200 text-gray-600 hover:bg-teal-50"}`}>
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
