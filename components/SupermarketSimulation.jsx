import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  cardVariant,
  feedbackPop,
  pageVariants,
  staggerGrid,
} from "../src/utils/animations";

// ─── Voice (async-safe) ────────────────────────────────────────────────────────
let _vc = null;
if (typeof window !== "undefined" && window.speechSynthesis) {
  window.speechSynthesis.addEventListener("voiceschanged", () => { _vc = null; });
}
function getBestVoice() {
  if (_vc) return _vc;
  const vs = window.speechSynthesis?.getVoices?.() ?? [];
  _vc =
    vs.find((v) => v.name === "Karen") ||
    vs.find((v) => v.name === "Lee") ||
    vs.find((v) => /google.*en-AU/i.test(v.name + v.lang)) ||
    vs.find((v) => v.lang === "en-AU") ||
    vs.find((v) => /google.*en-GB/i.test(v.name + v.lang)) ||
    vs.find((v) => v.lang === "en-GB") ||
    vs.find((v) => v.lang.startsWith("en")) ||
    null;
  return _vc;
}
function speak(text) {
  if (!window?.speechSynthesis) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.rate = 0.85;
  u.pitch = 1.0;
  const v = getBestVoice();
  if (v) u.voice = v;
  window.speechSynthesis.speak(u);
}

// ─── Data ──────────────────────────────────────────────────────────────────────
const BUDGET = 20.0;
const SHOPPING_LIST = ["Milk", "Bread", "Apple", "Banana", "Eggs"];

const SECTIONS = [
  {
    id: "entrance",
    emoji: "🚪",
    label: "Entrance",
    mapPos: { gridColumn: "1 / -1", gridRow: 1 },
    color: "#388E3C",
    bg: "#E8F5E9",
    headerBg: "linear-gradient(135deg,#43A047,#2E7D32)",
    guide: "Welcome! 👋 Grab a trolley from near the door. You'll need it to carry your shopping.",
    items: [],
  },
  {
    id: "produce",
    emoji: "🥦",
    label: "Produce",
    mapPos: { gridColumn: 1, gridRow: 2 },
    color: "#2E7D32",
    bg: "#F1F8E9",
    headerBg: "linear-gradient(135deg,#66BB6A,#2E7D32)",
    guide: "The produce section has fresh fruit and vegetables. It smells earthy and fresh in here!",
    items: [
      { name: "Apple",    emoji: "🍎", price: 0.99, unit: "each",  useBy: "22 May", special: false },
      { name: "Banana",   emoji: "🍌", price: 0.79, unit: "each",  useBy: "21 May", special: false },
      { name: "Broccoli", emoji: "🥦", price: 2.50, unit: "head",  useBy: "25 May", special: true  },
      { name: "Carrot",   emoji: "🥕", price: 1.20, unit: "bunch", useBy: "28 May", special: false },
      { name: "Grapes",   emoji: "🍇", price: 4.50, unit: "bag",   useBy: "20 May", special: true  },
    ],
  },
  {
    id: "bakery",
    emoji: "🍞",
    label: "Bakery",
    mapPos: { gridColumn: 2, gridRow: 2 },
    color: "#BF360C",
    bg: "#FFF8E1",
    headerBg: "linear-gradient(135deg,#FF7043,#BF360C)",
    guide: "The bakery smells amazing! Fresh bread, rolls and pastries are baked here every morning.",
    items: [
      { name: "Bread",     emoji: "🍞", price: 3.50, unit: "loaf", useBy: "20 May", special: false },
      { name: "Muffin",    emoji: "🧁", price: 1.80, unit: "each", useBy: "19 May", special: true  },
      { name: "Bagel",     emoji: "🥯", price: 2.20, unit: "each", useBy: "20 May", special: false },
      { name: "Croissant", emoji: "🥐", price: 2.50, unit: "each", useBy: "18 May", special: true  },
    ],
  },
  {
    id: "dairy",
    emoji: "🥛",
    label: "Dairy",
    mapPos: { gridColumn: 3, gridRow: 2 },
    color: "#1565C0",
    bg: "#E3F2FD",
    headerBg: "linear-gradient(135deg,#42A5F5,#1565C0)",
    guide: "The dairy fridges are cold! You can hear them humming. Milk, cheese, eggs and yoghurt are here.",
    items: [
      { name: "Milk",    emoji: "🥛", price: 2.20, unit: "2 L",   useBy: "24 May", special: false },
      { name: "Cheese",  emoji: "🧀", price: 5.00, unit: "block", useBy: "01 Jun", special: false },
      { name: "Eggs",    emoji: "🥚", price: 4.50, unit: "dozen", useBy: "30 May", special: false },
      { name: "Yoghurt", emoji: "🍶", price: 3.00, unit: "tub",   useBy: "26 May", special: true  },
      { name: "Butter",  emoji: "🧈", price: 3.80, unit: "block", useBy: "15 Jun", special: false },
    ],
  },
  {
    id: "checkout",
    emoji: "💳",
    label: "Checkout",
    mapPos: { gridColumn: "1 / -1", gridRow: 3 },
    color: "#00695C",
    bg: "#E0F2F1",
    headerBg: "linear-gradient(135deg,#26A69A,#00695C)",
    guide: "The checkout is where you pay. Place your items on the belt and wait for the total.",
    items: [],
  },
];

const STEPS = [
  { emoji: "🛒", title: "Get a trolley or basket", desc: "At the entrance, pick up a trolley for a big shop or a basket for just a few things.", tip: "Tip: Trolleys are near the entrance. You may need a $1 or $2 coin to unlock one." },
  { emoji: "📋", title: "Check your shopping list", desc: "Look at what you need to buy before you start walking. A list helps you remember everything!", tip: "Tip: Group your list by section — all fruit together, all dairy together. It saves time!" },
  { emoji: "🗺️", title: "Find each section", desc: "Walk through the store to find your items. Look for the signs hanging from the ceiling.", tip: "Tip: Can't find something? Ask a staff member in a green uniform — they're always happy to help!" },
  { emoji: "🧺", title: "Add items to your trolley", desc: "Pick up each item on your list and place it in your trolley. Check the price and use-by date.", tip: "Tip: Check the use-by date on dairy and meat. Always pick the freshest one!" },
  { emoji: "💳", title: "Go to the checkout", desc: "When you have everything, head to the checkout. You can use a staffed register or self-checkout.", tip: "Tip: Self-checkout is fast for small shops. A staffed register is better for lots of items." },
  { emoji: "💰", title: "Pay for your shopping", desc: "Place items on the belt. Pay with cash, card, or tap your phone or watch. Wait for your receipt.", tip: "Tip: Keep your receipt! If something is wrong you'll need it to get a refund." },
  { emoji: "🛍️", title: "Pack your bags and go home", desc: "Pack carefully — heavy items like milk go at the bottom. Grab your receipt and you're done!", tip: "Tip: Bring reusable bags to save money and help the environment." },
];

const WATCH_TIPS = [
  "✅ How does the person get a trolley at the entrance?",
  "✅ Which sections (produce, bakery, dairy) do they visit?",
  "✅ How do they choose items — do they check prices or use-by dates?",
  "✅ How do they pay at checkout — tap, card or cash?",
];

const GREEN = "linear-gradient(135deg,#00A651 0%,#007A3D 100%)";

// ─── Helpers ───────────────────────────────────────────────────────────────────
function fmt(n) { return `$${n.toFixed(2)}`; }

// ─── Component ─────────────────────────────────────────────────────────────────
export default function SupermarketSimulation() {
  const [phase, setPhase]           = useState("video");     // video | steps | practice
  const [stepIdx, setStepIdx]       = useState(0);

  // Practice state
  const [practiceStage, setPracticeStage] = useState("intro");
  // intro → map → section → checkout → paying → receipt
  const [activeSection, setActiveSection] = useState(null);   // section object
  const [cart, setCart]                   = useState([]);
  const [charPos, setCharPos]             = useState("entrance");
  const [visitedIds, setVisitedIds]       = useState([]);
  const [lastMsg, setLastMsg]             = useState("");

  // Checkout / payment
  const [scanIdx, setScanIdx]       = useState(0);
  const [payMethod, setPayMethod]   = useState(null);
  const [payStage, setPayStage]     = useState("choose"); // choose | processing | done
  const [cashAmount, setCashAmount] = useState("20");

  const total       = cart.reduce((s, i) => s + i.price, 0);
  const remaining   = BUDGET - total;
  const listFound   = SHOPPING_LIST.filter((n) => cart.some((i) => i.name === n));
  const allFound    = listFound.length === SHOPPING_LIST.length;
  const change      = parseFloat(cashAmount || 0) - total;

  function msg(text) { setLastMsg(text); speak(text); }

  function enterSection(section) {
    setActiveSection(section);
    setCharPos(section.id);
    if (!visitedIds.includes(section.id)) setVisitedIds((v) => [...v, section.id]);
    setPracticeStage("section");
    msg(section.guide);
  }

  function addItem(item) {
    if (cart.some((i) => i.name === item.name)) {
      msg(`${item.name} is already in your trolley.`);
      return;
    }
    if (total + item.price > BUDGET + 0.001) {
      msg("That would go over your $20 budget. Try a cheaper item!");
      return;
    }
    setCart((c) => [...c, { ...item }]);
    const onList = SHOPPING_LIST.includes(item.name);
    msg(onList
      ? `✅ ${item.name} added — that's on your list! ${fmt(item.price)}.`
      : `${item.emoji} ${item.name} added to trolley. ${fmt(item.price)}.`);
  }

  function startCheckout() {
    setPracticeStage("checkout");
    setScanIdx(0);
    msg("Great shopping! Place your items on the belt and we'll scan them.");
  }

  function goToPay() {
    setPracticeStage("paying");
    setPayMethod(null);
    setPayStage("choose");
    msg("How would you like to pay?");
  }

  function selectPayment(method) {
    setPayMethod(method);
    setPayStage("processing");
    const lines = {
      tap:  "Tap your card or phone on the reader. Hold it near the card machine.",
      card: "Insert your card into the reader, then enter your PIN.",
      cash: "Hand over your cash to the cashier.",
    };
    msg(lines[method]);
    setTimeout(() => {
      setPayStage("done");
      msg("Payment approved! Thank you. Don't forget your receipt!");
      setTimeout(() => setPracticeStage("receipt"), 1200);
    }, 2800);
  }

  function resetPractice() {
    setCart([]); setCharPos("entrance"); setVisitedIds([]);
    setActiveSection(null); setLastMsg(""); setScanIdx(0);
    setPayMethod(null); setPayStage("choose"); setCashAmount("20");
    setPracticeStage("intro");
  }

  // ── Phase: Video ──────────────────────────────────────────────────────────────
  if (phase === "video") {
    return (
      <motion.div className="max-w-3xl mx-auto p-4 space-y-5"
        variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="rounded-2xl p-6 text-white" style={{ background: GREEN }}>
          <div className="text-4xl mb-2">🛒</div>
          <h1 className="text-2xl font-extrabold mb-1">Shopping at Woolworths</h1>
          <p className="opacity-85 text-sm">Watch the video to see what a supermarket trip looks like, then practise step-by-step!</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <h2 className="font-bold text-gray-800 text-lg mb-3">🎬 Watch: A trip to the supermarket</h2>
          <div className="rounded-xl overflow-hidden border border-gray-200 mb-4 shadow-sm">
            <iframe
              width="100%" style={{ aspectRatio: "16/9", display: "block" }}
              src="https://www.youtube.com/embed/CQmIF_v4cJs?rel=0&modestbranding=1"
              title="A trip to the supermarket"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <p className="font-semibold text-green-800 mb-3">🤔 While you watch, look out for:</p>
            <motion.ul className="space-y-2" variants={staggerGrid} initial="initial" animate="animate">
              {WATCH_TIPS.map((t, i) => (
                <motion.li key={i} variants={cardVariant} className="text-green-700 text-sm">{t}</motion.li>
              ))}
            </motion.ul>
          </div>
        </div>

        <motion.button onClick={() => setPhase("steps")}
          whileHover={{ scale: 1.02, y: -2, transition: { type: "spring", stiffness: 380, damping: 20 } }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md" style={{ background: GREEN }}>
          I've watched it — show me what to do →
        </motion.button>
      </motion.div>
    );
  }

  // ── Phase: Steps ──────────────────────────────────────────────────────────────
  if (phase === "steps") {
    const step = STEPS[stepIdx];
    const isLast = stepIdx === STEPS.length - 1;
    return (
      <motion.div className="max-w-3xl mx-auto p-4 space-y-5"
        variants={pageVariants} initial="initial" animate="animate" exit="exit">
        <div className="rounded-2xl p-5 text-white" style={{ background: GREEN }}>
          <h1 className="text-xl font-extrabold mb-1">📋 What to do at the supermarket</h1>
          <p className="opacity-75 text-sm mb-2">Step {stepIdx + 1} of {STEPS.length}</p>
          <div className="bg-white/25 rounded-full h-2.5">
            <div className="bg-white h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${((stepIdx + 1) / STEPS.length) * 100}%` }} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={stepIdx}
            initial={{ opacity: 0, x: 40, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 26 } }}
            exit={{ opacity: 0, x: -30, transition: { duration: 0.15 } }}
            className="bg-white rounded-2xl p-8 text-center shadow-sm border border-gray-100">
            <motion.div className="text-7xl mb-4"
              animate={{ y: [0, -8, 0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
              {step.emoji}
            </motion.div>
            <h2 className="text-2xl font-extrabold text-gray-800 mb-3">{step.title}</h2>
            <p className="text-gray-600 text-base leading-relaxed mb-4">{step.desc}</p>
            <div className="bg-amber-50 rounded-xl p-3 border border-amber-100 text-left mb-4">
              <p className="text-amber-800 text-sm">{step.tip}</p>
            </div>
            <button onClick={() => speak(`${step.title}. ${step.desc}. ${step.tip}`)}
              className="px-4 py-2 bg-gray-100 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              🔊 Read aloud
            </button>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <button key={i} onClick={() => setStepIdx(i)}
              className={`rounded-full transition-all duration-300 ${i === stepIdx ? "w-5 h-3 bg-green-600" : i < stepIdx ? "w-3 h-3 bg-green-300" : "w-3 h-3 bg-gray-200"}`} />
          ))}
        </div>

        <div className="flex gap-3">
          <motion.button whileTap={{ scale: 0.96 }}
            onClick={() => stepIdx > 0 ? setStepIdx((s) => s - 1) : setPhase("video")}
            className="flex-1 py-3 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors">
            ← Back
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02, y: -1, transition: { type: "spring", stiffness: 380, damping: 20 } }}
            whileTap={{ scale: 0.96 }}
            onClick={() => isLast ? (setPhase("practice"), resetPractice()) : setStepIdx((s) => s + 1)}
            className="py-3 px-8 rounded-xl font-bold text-white shadow-md" style={{ background: GREEN, flex: 2 }}>
            {isLast ? "🎮 Start the simulation →" : "Next step →"}
          </motion.button>
        </div>
      </motion.div>
    );
  }

  // ── Phase: Practice ───────────────────────────────────────────────────────────
  // Shared sidebar: Shopping list + budget
  const Sidebar = () => (
    <div className="space-y-3">
      {/* Budget */}
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">Budget</p>
        <div className="flex items-end gap-1">
          <span className={`text-2xl font-extrabold ${remaining < 0 ? "text-red-600" : "text-green-700"}`}>
            {fmt(remaining)}
          </span>
          <span className="text-xs text-gray-400 mb-1">remaining</span>
        </div>
        <div className="bg-gray-100 rounded-full h-2 mt-1">
          <div className="bg-green-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(0, (remaining / BUDGET) * 100)}%` }} />
        </div>
      </div>
      {/* Shopping list */}
      <div className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Shopping List</p>
        <ul className="space-y-1">
          {SHOPPING_LIST.map((name) => {
            const found = cart.some((i) => i.name === name);
            return (
              <li key={name} className={`text-sm flex items-center gap-2 ${found ? "line-through text-gray-400" : "text-gray-700"}`}>
                <span>{found ? "✅" : "⬜"}</span> {name}
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-green-700 font-semibold mt-2">{listFound.length}/{SHOPPING_LIST.length} found</p>
      </div>
      {/* Trolley count */}
      {cart.length > 0 && (
        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
          <p className="text-xs text-green-700 font-semibold">🛒 Trolley: {cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          <p className="text-xs text-green-600 mt-0.5">{fmt(total)} spent</p>
        </div>
      )}
    </div>
  );

  // ── Practice intro ──────────────────────────────────────────────────────────
  if (practiceStage === "intro") {
    return (
      <motion.div className="max-w-3xl mx-auto p-4 space-y-5"
        variants={pageVariants} initial="initial" animate="animate">
        <div className="rounded-2xl p-6 text-white" style={{ background: GREEN }}>
          <div className="text-4xl mb-2">🎮</div>
          <h1 className="text-2xl font-extrabold mb-1">Your Shopping Mission!</h1>
          <p className="opacity-85 text-sm">Walk through Woolworths, find your 5 items, and pay at the checkout — all for under $20!</p>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3">🛍️ Your shopping list today:</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {SHOPPING_LIST.map((name) => {
              const item = SECTIONS.flatMap((s) => s.items).find((i) => i.name === name);
              return (
                <span key={name} className="px-3 py-2 bg-green-50 border border-green-200 rounded-xl text-sm font-semibold text-green-800">
                  {item?.emoji} {name}
                </span>
              );
            })}
          </div>
          <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
            <p className="text-amber-800 text-sm font-medium">💰 You have <strong>$20.00</strong> to spend. Try not to go over!</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <h2 className="font-bold text-gray-800 mb-3">🗺️ The store has 3 sections to visit:</h2>
          <div className="grid grid-cols-3 gap-3">
            {SECTIONS.filter((s) => s.items.length > 0).map((s) => (
              <div key={s.id} className="rounded-xl p-3 text-center text-white text-sm font-bold"
                style={{ background: s.headerBg }}>
                <div className="text-2xl mb-1">{s.emoji}</div>
                {s.label}
              </div>
            ))}
          </div>
        </div>

        <motion.button
          onClick={() => { setPracticeStage("map"); speak("Let's go! Start at the entrance and grab a trolley."); }}
          whileHover={{ scale: 1.02, y: -2, transition: { type: "spring", stiffness: 380, damping: 20 } }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md" style={{ background: GREEN }}>
          🚶 Enter the store →
        </motion.button>
      </motion.div>
    );
  }

  // ── Practice map / section view ─────────────────────────────────────────────
  if (practiceStage === "map" || practiceStage === "section") {
    return (
      <motion.div className="max-w-3xl mx-auto p-4"
        variants={pageVariants} initial="initial" animate="animate">
        <div className="rounded-2xl p-4 text-white mb-4" style={{ background: GREEN }}>
          <div className="flex items-center justify-between">
            <h1 className="font-extrabold text-lg">🏪 Woolworths</h1>
            <span className="text-sm opacity-80">Budget: {fmt(remaining)} left</span>
          </div>
        </div>

        <div className="flex gap-3">
          {/* Main area */}
          <div className="flex-1 min-w-0">
            {/* Store map */}
            <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm mb-3">
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-2">Store Map — tap a section to walk there</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gridTemplateRows: "auto auto auto", gap: "6px" }}>
                {SECTIONS.map((sec) => {
                  const isHere = charPos === sec.id;
                  const visited = visitedIds.includes(sec.id);
                  return (
                    <motion.button
                      key={sec.id}
                      style={{ ...sec.mapPos, background: isHere ? sec.color : visited ? sec.bg : "#f5f5f5", border: isHere ? `2px solid ${sec.color}` : "2px solid transparent" }}
                      whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => enterSection(sec)}
                      className="rounded-xl py-2 px-2 text-center transition-all duration-200 cursor-pointer"
                    >
                      <div className={`text-xl ${isHere ? "" : ""}`}>{sec.emoji}</div>
                      <div className={`text-xs font-bold mt-0.5 ${isHere ? "text-white" : "text-gray-600"}`}>{sec.label}</div>
                      {isHere && (
                        <motion.div
                          animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity }}
                          className="text-xs text-white mt-0.5">
                          👤 You're here
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Section content */}
            <AnimatePresence mode="wait">
              {practiceStage === "section" && activeSection && (
                <motion.div key={activeSection.id}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  transition={{ type: "spring", stiffness: 280, damping: 24 }}
                  className="rounded-2xl overflow-hidden shadow-sm border border-gray-100">

                  {/* Aisle header */}
                  <div className="p-4 text-white" style={{ background: activeSection.headerBg }}>
                    <div className="flex items-center gap-3">
                      <motion.div className="text-4xl"
                        animate={{ y: [0, -5, 0] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                        {activeSection.emoji}
                      </motion.div>
                      <div>
                        <h2 className="font-extrabold text-lg">{activeSection.label} Aisle</h2>
                        <p className="opacity-80 text-xs">{activeSection.guide}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4" style={{ background: activeSection.bg }}>
                    {activeSection.id === "entrance" ? (
                      <div className="text-center py-6">
                        <motion.div className="text-6xl mb-3"
                          animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                          🛒
                        </motion.div>
                        <h3 className="font-bold text-gray-700 text-lg mb-2">Grab a trolley!</h3>
                        <p className="text-gray-500 text-sm mb-4">Take a trolley from the row near the entrance. Now you're ready to shop!</p>
                        <motion.button
                          onClick={() => { msg("Great — you have your trolley! Head to the Produce, Bakery or Dairy section."); setPracticeStage("map"); }}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className="px-6 py-3 rounded-xl font-bold text-white shadow" style={{ background: GREEN }}>
                          🛒 I've got my trolley!
                        </motion.button>
                      </div>
                    ) : activeSection.id === "checkout" ? (
                      <div className="text-center py-6">
                        <div className="text-5xl mb-3">💳</div>
                        <p className="text-gray-600 mb-4">You have {cart.length} item{cart.length !== 1 ? "s" : ""} worth <strong>{fmt(total)}</strong>.</p>
                        <motion.button onClick={startCheckout}
                          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                          className="px-8 py-3 rounded-xl font-bold text-white shadow" style={{ background: GREEN }}>
                          💳 Start checkout
                        </motion.button>
                      </div>
                    ) : (
                      <>
                        {/* Shelf label */}
                        <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 font-semibold uppercase tracking-wide">
                          <div className="flex-1 h-px bg-gray-200" />
                          <span>🏷️ Items on the shelf</span>
                          <div className="flex-1 h-px bg-gray-200" />
                        </div>
                        <motion.div className="grid grid-cols-2 gap-3"
                          variants={staggerGrid} initial="initial" animate="animate">
                          {activeSection.items.map((item) => {
                            const inCart = cart.some((i) => i.name === item.name);
                            const onList = SHOPPING_LIST.includes(item.name);
                            return (
                              <motion.div key={item.name} variants={cardVariant}
                                className={`rounded-xl border-2 p-3 transition-all ${inCart ? "border-green-400 bg-green-50" : "border-gray-200 bg-white hover:border-green-300"}`}>
                                <div className="flex items-start gap-3">
                                  <motion.div className="text-4xl flex-shrink-0"
                                    animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: Math.random() * 2 }}>
                                    {item.emoji}
                                  </motion.div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-1 flex-wrap">
                                      <span className="font-bold text-sm text-gray-800">{item.name}</span>
                                      {onList && !inCart && <span className="text-xs bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-semibold">⭐ On your list</span>}
                                      {item.special && <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-semibold">SPECIAL</span>}
                                    </div>
                                    <p className="text-green-700 font-extrabold text-sm">{fmt(item.price)} <span className="text-gray-400 font-normal text-xs">/{item.unit}</span></p>
                                    <p className="text-xs text-gray-400">Use by: <span className="text-gray-600">{item.useBy}</span></p>
                                    {inCart ? (
                                      <span className="text-xs text-green-600 font-bold">✅ In trolley</span>
                                    ) : (
                                      <motion.button onClick={() => addItem(item)}
                                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.93 }}
                                        className="mt-1.5 w-full py-1.5 rounded-lg font-bold text-white text-xs shadow-sm"
                                        style={{ background: activeSection.headerBg }}>
                                        + Add to trolley
                                      </motion.button>
                                    )}
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </motion.div>
                      </>
                    )}
                  </div>

                  {/* Back to map */}
                  {activeSection.id !== "entrance" && activeSection.id !== "checkout" && (
                    <div className="bg-white px-4 pb-4" style={{ background: activeSection.bg }}>
                      <button onClick={() => setPracticeStage("map")}
                        className="text-sm text-gray-400 hover:text-gray-600 underline mt-2">
                        ← Back to store map
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
              {practiceStage === "map" && (
                <motion.div key="mapMsg" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 text-center">
                  {lastMsg ? (
                    <p className="text-gray-700 font-medium">{lastMsg}</p>
                  ) : (
                    <p className="text-gray-400 text-sm">Tap a section on the map above to walk there.</p>
                  )}
                  {allFound && (
                    <motion.div variants={feedbackPop} initial="initial" animate="animate"
                      className="mt-4 bg-green-50 rounded-xl p-4 border border-green-200">
                      <p className="text-green-800 font-bold text-lg mb-2">🎉 You found everything on your list!</p>
                      <motion.button onClick={() => enterSection(SECTIONS.find((s) => s.id === "checkout"))}
                        whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                        className="px-6 py-3 rounded-xl font-bold text-white shadow" style={{ background: GREEN }}>
                        💳 Head to checkout →
                      </motion.button>
                    </motion.div>
                  )}
                  {!allFound && cart.length > 0 && (
                    <p className="text-xs text-gray-400 mt-3">
                      Still need: {SHOPPING_LIST.filter((n) => !cart.some((i) => i.name === n)).join(", ")}
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sidebar */}
          <div className="w-40 flex-shrink-0 hidden sm:block">
            <Sidebar />
          </div>
        </div>

        {/* Mobile sidebar */}
        <div className="sm:hidden mt-3">
          <Sidebar />
        </div>

        <div className="flex justify-center gap-4 pt-1">
          <button onClick={() => setPhase("steps")} className="text-xs text-gray-400 hover:text-gray-600 underline">← Back to steps</button>
          <button onClick={() => { setPhase("video"); }} className="text-xs text-gray-400 hover:text-gray-600 underline">📺 Watch video</button>
        </div>
      </motion.div>
    );
  }

  // ── Checkout ────────────────────────────────────────────────────────────────
  if (practiceStage === "checkout") {
    return (
      <motion.div className="max-w-3xl mx-auto p-4 space-y-4"
        variants={pageVariants} initial="initial" animate="animate">
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#26A69A,#00695C)" }}>
          <h1 className="text-xl font-extrabold mb-1">💳 Checkout</h1>
          <p className="opacity-80 text-sm">Place your items on the conveyor belt. The cashier will scan them.</p>
        </div>

        {/* Conveyor belt */}
        <div className="bg-gray-800 rounded-2xl p-4 overflow-hidden relative">
          <p className="text-gray-400 text-xs uppercase tracking-wide font-semibold mb-3">🏪 Checkout belt</p>
          <div className="flex gap-3 overflow-x-auto pb-2" style={{ scrollbarWidth: "thin" }}>
            {cart.map((item, i) => (
              <motion.div key={item.name}
                initial={{ opacity: 0, scale: 0.5, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: i * 0.12, type: "spring", stiffness: 300, damping: 20 }}
                className="flex-shrink-0 w-16 text-center">
                <div className="text-3xl mb-1">{item.emoji}</div>
                <p className="text-white text-xs font-semibold">{item.name}</p>
                <p className="text-green-400 text-xs">{fmt(item.price)}</p>
              </motion.div>
            ))}
          </div>
          {/* Belt lines */}
          <div className="flex gap-4 mt-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex-1 h-1.5 bg-gray-600 rounded-full" />
            ))}
          </div>
        </div>

        {/* Register display */}
        <div className="bg-gray-900 rounded-2xl p-5 text-center font-mono border border-gray-700">
          <p className="text-green-400 text-xs uppercase tracking-widest mb-2">REGISTER</p>
          <p className="text-gray-400 text-sm mb-1">{cart.length} item{cart.length !== 1 ? "s" : ""}</p>
          <p className="text-white text-4xl font-bold mb-1">{fmt(total)}</p>
          <p className="text-green-400 text-xs">Budget remaining after payment: {fmt(BUDGET - total)}</p>
        </div>

        <motion.button onClick={goToPay}
          whileHover={{ scale: 1.02, y: -2, transition: { type: "spring", stiffness: 380, damping: 20 } }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-4 rounded-2xl font-bold text-white text-lg shadow-md" style={{ background: GREEN }}>
          💰 Choose how to pay →
        </motion.button>
      </motion.div>
    );
  }

  // ── Payment ─────────────────────────────────────────────────────────────────
  if (practiceStage === "paying") {
    return (
      <motion.div className="max-w-xl mx-auto p-4 space-y-4"
        variants={pageVariants} initial="initial" animate="animate">
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg,#26A69A,#00695C)" }}>
          <h1 className="text-xl font-extrabold mb-1">💰 Pay for your shopping</h1>
          <p className="opacity-80 text-sm">Total: <strong>{fmt(total)}</strong> — choose how to pay</p>
        </div>

        {/* Payment terminal visual */}
        <div className="bg-gray-800 rounded-2xl p-5">
          <div className="bg-gray-900 rounded-xl p-4 text-center mb-4 border border-gray-700">
            <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">PAYMENT TERMINAL</p>
            <AnimatePresence mode="wait">
              {payStage === "choose" && (
                <motion.p key="choose" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-white text-lg font-bold">
                  {fmt(total)} — HOW TO PAY?
                </motion.p>
              )}
              {payStage === "processing" && payMethod === "tap" && (
                <motion.div key="tap-proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <motion.div className="text-5xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}>
                    📱
                  </motion.div>
                  <motion.p className="text-green-400 text-sm font-bold"
                    animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    TAP YOUR CARD OR PHONE NOW…
                  </motion.p>
                  <div className="flex justify-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div key={i} className="w-2 h-2 bg-green-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }} transition={{ delay: i * 0.2, duration: 0.6, repeat: Infinity }} />
                    ))}
                  </div>
                </motion.div>
              )}
              {payStage === "processing" && payMethod === "card" && (
                <motion.div key="card-proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2">
                  <p className="text-gray-300 text-sm mb-1">INSERT CARD →</p>
                  <motion.div className="text-4xl" animate={{ x: [0, 8, 0] }} transition={{ duration: 0.6, repeat: Infinity }}>
                    💳
                  </motion.div>
                  <p className="text-yellow-400 text-sm font-bold">ENTER PIN:</p>
                  <p className="text-white text-2xl tracking-widest font-mono">● ● ● ●</p>
                </motion.div>
              )}
              {payStage === "processing" && payMethod === "cash" && (
                <motion.div key="cash-proc" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-2 text-center">
                  <div className="text-4xl">💵</div>
                  <p className="text-white text-sm">CASH GIVEN: <strong>{fmt(parseFloat(cashAmount))}</strong></p>
                  <p className="text-green-400 text-sm">CHANGE: <strong>{fmt(Math.max(0, change))}</strong></p>
                </motion.div>
              )}
              {payStage === "done" && (
                <motion.div key="done" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 300 }} className="space-y-1">
                  <div className="text-5xl">✅</div>
                  <p className="text-green-400 font-bold text-lg">PAYMENT APPROVED</p>
                  <p className="text-gray-400 text-xs">THANK YOU!</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Payment options */}
          {payStage === "choose" && (
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "tap",  emoji: "📱", label: "Tap Phone\nor Watch",  desc: "Hold your phone or watch near the reader" },
                { id: "card", emoji: "💳", label: "Insert Card\n+ PIN",   desc: "Put your card in the slot and type your PIN" },
                { id: "cash", emoji: "💵", label: "Pay Cash",             desc: "Hand over notes and coins" },
              ].map((opt) => (
                <motion.button key={opt.id}
                  onClick={() => {
                    if (opt.id === "cash") {
                      const given = parseFloat(cashAmount);
                      if (isNaN(given) || given < total) {
                        speak("You need to give at least " + fmt(total) + " in cash.");
                        return;
                      }
                    }
                    selectPayment(opt.id);
                  }}
                  whileHover={{ scale: 1.04, y: -2 }} whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center p-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-center transition-colors">
                  <div className="text-3xl mb-1">{opt.emoji}</div>
                  <p className="text-white text-xs font-bold whitespace-pre-line leading-tight">{opt.label}</p>
                </motion.button>
              ))}
            </div>
          )}

          {/* Cash input */}
          {payStage === "choose" && (
            <div className="mt-3 flex items-center gap-2">
              <label className="text-gray-400 text-xs whitespace-nowrap">Cash amount: $</label>
              <input type="number" min="0" step="0.01"
                value={cashAmount} onChange={(e) => setCashAmount(e.target.value)}
                className="flex-1 bg-gray-700 text-white rounded-lg px-3 py-2 text-sm border border-gray-600 focus:outline-none focus:border-green-400"
                placeholder="20.00"
              />
              {parseFloat(cashAmount) >= total && (
                <span className="text-green-400 text-xs whitespace-nowrap">Change: {fmt(Math.max(0, parseFloat(cashAmount) - total))}</span>
              )}
            </div>
          )}
        </div>

        <button onClick={() => setPracticeStage("checkout")} className="text-sm text-gray-400 hover:text-gray-600 underline">
          ← Back to checkout
        </button>
      </motion.div>
    );
  }

  // ── Receipt ─────────────────────────────────────────────────────────────────
  if (practiceStage === "receipt") {
    const payLabels = { tap: "Tap (Contactless)", card: "Credit/Debit Card", cash: "Cash" };
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" });
    const dateStr = now.toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" });

    return (
      <motion.div className="max-w-xl mx-auto p-4 space-y-5"
        variants={pageVariants} initial="initial" animate="animate">

        <motion.div className="text-center"
          animate={{ scale: [0.8, 1.15, 1], rotate: [0, 8, -5, 2, 0] }}
          transition={{ duration: 0.7 }}>
          <div className="text-7xl mb-2">🎉</div>
          <h1 className="text-2xl font-extrabold text-gray-800">Shopping complete!</h1>
          <p className="text-gray-500 text-sm mt-1">You did a great job at Woolworths today.</p>
        </motion.div>

        {/* Receipt */}
        <motion.div
          initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          style={{ fontFamily: "monospace" }}>
          <div className="bg-gray-900 text-white p-4 text-center">
            <p className="text-lg font-bold tracking-widest">WOOLWORTHS</p>
            <p className="text-xs text-gray-400">YOUR RECEIPT</p>
          </div>
          <div className="p-4 space-y-1 text-sm">
            <div className="flex justify-between text-gray-500 text-xs mb-2 pb-2 border-b border-dashed border-gray-200">
              <span>{dateStr}</span><span>{timeStr}</span>
            </div>
            {cart.map((item, i) => (
              <motion.div key={item.name} className="flex justify-between"
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}>
                <span className="text-gray-700">{item.emoji} {item.name}</span>
                <span className="text-gray-800 font-semibold">{fmt(item.price)}</span>
              </motion.div>
            ))}
            <div className="border-t border-dashed border-gray-200 mt-3 pt-3">
              <div className="flex justify-between font-bold text-base">
                <span>TOTAL</span><span>{fmt(total)}</span>
              </div>
              {payMethod === "cash" && (
                <div className="flex justify-between text-gray-500 text-xs mt-1">
                  <span>CHANGE</span><span>{fmt(Math.max(0, parseFloat(cashAmount) - total))}</span>
                </div>
              )}
              <p className="text-gray-500 text-xs mt-1">Payment: {payLabels[payMethod]}</p>
            </div>
            <p className="text-center text-gray-400 text-xs pt-3 border-t border-dashed border-gray-100 mt-3">
              Thank you for shopping at Woolworths!<br />Everyday Rewards saves you money.
            </p>
          </div>
        </motion.div>

        {/* What you learned */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
          className="bg-green-50 rounded-2xl p-5 border border-green-100">
          <h2 className="font-bold text-green-800 mb-3">🌟 What you practised today:</h2>
          <ul className="space-y-1.5 text-sm text-green-700">
            <li>✅ Navigating through a supermarket</li>
            <li>✅ Reading prices and use-by dates on products</li>
            <li>✅ Checking items off a shopping list</li>
            <li>✅ Staying within a $20 budget (you spent {fmt(total)})</li>
            <li>✅ Paying at the checkout using {payLabels[payMethod]?.toLowerCase()}</li>
          </ul>
        </motion.div>

        <div className="flex gap-3">
          <motion.button onClick={resetPractice}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-3 rounded-xl font-bold text-white shadow" style={{ background: GREEN }}>
            🔄 Shop again
          </motion.button>
          <motion.button onClick={() => { resetPractice(); setPhase("video"); }}
            whileTap={{ scale: 0.96 }}
            className="flex-1 py-3 rounded-xl font-bold bg-gray-100 text-gray-700 hover:bg-gray-200">
            📺 Watch video
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return null;
}
